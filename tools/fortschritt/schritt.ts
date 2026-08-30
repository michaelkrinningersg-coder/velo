/**
 * Ein Schritt des Auto-Weiter, serverseitig nachgestellt.
 *
 * Die Oberflaeche macht je Schritt genau diese Aufrufe (siehe
 * `runAutoProgressLoop` in frontend/src/views/dashboard.ts):
 *
 *   Etappe:  GET  /api/simulation/realtime/:id
 *            -> runQuickSimulation (laeuft im Browser)
 *            -> POST /api/simulation/realtime/:id/complete?reload=light
 *   Tag:     POST /api/state/advance?reload=light
 *
 * Beide Etappen-Routen holen vorher `loadStatus()`, um die Etappe freizugeben —
 * das gehoert zur Rechnung und wird hier mitgemessen. Das Reload-Buendel haengt
 * seit der Beschleunigung an den Antworten und wird deshalb innerhalb von
 * `commit` bzw. `advanceDay` mitgemessen, nicht als eigener Aufruf.
 */
import type Database from 'better-sqlite3';
import { GameStateService } from '../../backend/src/game/GameStateService';
import { GameRepository } from '../../backend/src/db/GameRepository';
import { StageResultCommitService } from '../../backend/src/simulation/StageResultCommitService';
import { assembleStageBootstrap } from '../../backend/src/simulation/StageBootstrapService';
import { ensureRaceEntries } from '../../backend/src/simulation/RaceRosterService';
import { finalizeChampionshipWithoutStarters } from '../../backend/src/simulation/RaceRosterService';
import { isChampionshipCategory, isNationalChampionshipCategory } from '../../backend/src/simulation/championships';
import { isRenewalSelectionPending, saveRenewalSelection } from '../../backend/src/simulation/contractRenewalSelection';
import { ensureSimSeedRolled, ensureWeatherRolled } from '../../backend/src/routes/api';
import { RiderDraftService } from '../../backend/src/game/RiderDraftService';
import { runQuickSimulation } from '../../frontend/src/race-sim/runQuickSimulation';

export type Phase = 'loadStatus' | 'startliste' | 'aufbau' | 'quicksim' | 'commit' | 'advanceDay' | 'draft';

/**
 * `bootstrap` ist bewusst in zwei Phasen geteilt:
 *   startliste — `ensureRaceEntries`, laeuft nur vor der ERSTEN Etappe eines
 *                Rennens wirklich los und baut den Kader.
 *   aufbau     — `assembleStageBootstrap`, laeuft vor jeder Etappe.
 * Ohne die Trennung laesst sich nicht sagen, warum eine erste Etappe teurer ist
 * als eine spaetere.
 */
export const PHASEN: Phase[] = ['loadStatus', 'startliste', 'aufbau', 'quicksim', 'commit', 'advanceDay', 'draft'];

/** Wanduhr je Phase. `phase` sagt der SQL-Messhuelle, wem sie eine Abfrage zuschreibt. */
export interface Uhr {
  phase: Phase | null;
  zeit: Map<string, number>;
  anzahl: Map<string, number>;
}

export function neueUhr(): Uhr {
  return { phase: null, zeit: new Map(), anzahl: new Map() };
}

export function miss<T>(uhr: Uhr, phase: Phase, arbeit: () => T): T {
  const vorher = uhr.phase;
  uhr.phase = phase;
  const start = process.hrtime.bigint();
  try {
    return arbeit();
  } finally {
    const dauer = Number(process.hrtime.bigint() - start) / 1e6;
    uhr.zeit.set(phase, (uhr.zeit.get(phase) ?? 0) + dauer);
    uhr.anzahl.set(phase, (uhr.anzahl.get(phase) ?? 0) + 1);
    uhr.phase = vorher;
  }
}

export interface SchrittErgebnis {
  art: 'etappe' | 'tag';
  datum: string;
  /**
   * Bei Etappen: wo die Etappe im Rennen steht. Die Kosten je Schritt haengen
   * stark davon ab — vor der ersten Etappe wird die Startliste gebaut, nach der
   * letzten wird das Rennen abgerechnet. Ein Eintagesrennen zahlt beides in
   * einem einzigen Schritt.
   */
  art2?: 'eintagesrennen' | 'erste-etappe' | 'mittlere-etappe' | 'letzte-etappe';
  /** Wanduhr dieses einen Schritts, je Phase. */
  ms?: Partial<Record<Phase, number>>;
}

/** Misst eine Phase und gibt zusaetzlich die Dauer dieses einen Aufrufs zurueck. */
function messeEinzeln<T>(uhr: Uhr, phase: Phase, ms: Partial<Record<Phase, number>>, arbeit: () => T): T {
  const vorher = uhr.zeit.get(phase) ?? 0;
  const wert = miss(uhr, phase, arbeit);
  ms[phase] = (ms[phase] ?? 0) + ((uhr.zeit.get(phase) ?? 0) - vorher);
  return wert;
}

/** Fuehrt genau einen Schritt aus. `null`, wenn nichts mehr geht. */
export function einSchritt(db: Database.Database, gss: GameStateService, uhr: Uhr): SchrittErgebnis | null {
  // Das blockierende Auswahlfenster fuer Vertragsverlaengerungen haelt den
  // Auto-Weiter an. Im Messlauf wird es leer bestaetigt.
  if (isRenewalSelectionPending(db)) {
    saveRenewalSelection(db, []);
  }
  const status = miss(uhr, 'loadStatus', () => gss.loadStatus());
  const offen = status.pendingStages ?? [];
  const zustand = gss.loadState();
  const datum = zustand.currentDate;

  // Der Draft laeuft im Spiel ueber die Draft-Ansicht. Ohne ihn laufen die
  // Vertraege Saison fuer Saison aus und die Kader leeren sich — ein Lauf ueber
  // mehrere Jahre misst dann ein Spiel, in dem kaum noch jemand einen Vertrag
  // hat und die Rennen keine Startliste mehr zustande bringen.
  if (zustand.draftStatus === 'active' && zustand.draftSeason != null) {
    // Genau wie die Route /draft/:season/quick-complete: die restlichen Picks
    // ziehen und danach die Saison initialisieren. NICHT executeDraft() — das
    // ruft prepareDraft() auf und loescht die Draft-Historie der Saison, der
    // Draft finge also bei jedem Schritt von vorne an und kaeme nie ans Ende.
    const saison = zustand.draftSeason as number;
    miss(uhr, 'draft', () => {
      new RiderDraftService(db).executeNextPicksUntilPlayer(saison, true);
      gss.completeDraftAndInitializeSeason(saison, gss.loadState().currentDate);
    });
  }

  if (offen.length > 0) {
    const stageId = offen[0]!.stageId;
    const ms: Partial<Record<Phase, number>> = {};
    const repoS = new GameRepository(db);
    // Genau die Schritte aus `buildStageBootstrap`, nur getrennt gemessen.
    const bootstrap = (() => {
      const stage = repoS.getStageById(stageId);
      const race = stage ? repoS.getRaceById(stage.raceId) : null;
      if (!stage || !race) return null;
      const fahrer = messeEinzeln(uhr, 'startliste', ms, () => {
        ensureWeatherRolled(db, stageId);
        return ensureRaceEntries(db, repoS, race, stage);
      });
      if (fahrer.length === 0) return null;
      return messeEinzeln(uhr, 'aufbau', ms, () => {
        const simSeed = ensureSimSeedRolled(db, stageId);
        return assembleStageBootstrap(db, repoS, race, stage, fahrer, { simSeed });
      });
    })();
    if (!bootstrap) {
      // Genau wie die Route: NUR eine Meisterschaft ohne startberechtigte
      // Fahrer wird ergebnislos abgeschlossen. Bei jedem anderen Rennen ist
      // eine fehlende Startliste ein Fehler — er darf hier nicht stillschweigend
      // zu einem Rennen ohne Ergebnis werden, sonst misst der Lauf ein Spiel,
      // in dem die grossen Rundfahrten gar nicht stattfinden.
      const repo = new GameRepository(db);
      const stage = repo.getStageById(stageId);
      const race = stage ? repo.getRaceById(stage.raceId) : null;
      if (race && (isChampionshipCategory(race.categoryId) || isNationalChampionshipCategory(race.categoryId))) {
        finalizeChampionshipWithoutStarters(db, race);
        return { art: 'etappe', datum, art2: 'eintagesrennen', ms };
      }
      throw new Error(`Fuer Etappe ${stageId} (${race?.name ?? '?'}) konnte keine Startliste bestimmt werden.`);
    }
    const lauf = messeEinzeln(uhr, 'quicksim', ms, () => runQuickSimulation(bootstrap as any));
    messeEinzeln(uhr, 'commit', ms, () => new StageResultCommitService(db).commitRealtimeStage(
      stageId, lauf.entries as any, lauf.markerClassifications as any, lauf.incidents as any,
      lauf.events as any, lauf.leadoutContributions as any, lauf.superTeamId,
    ));
    return { art: 'etappe', datum, art2: etappenLage(db, stageId), ms };
  }

  const ms: Partial<Record<Phase, number>> = {};
  messeEinzeln(uhr, 'advanceDay', ms, () => gss.advanceDay());
  return { art: 'tag', datum, ms };
}

/** Wo steht diese Etappe in ihrem Rennen? */
function etappenLage(db: Database.Database, stageId: number): SchrittErgebnis['art2'] {
  const zeile = db.prepare(`
    SELECT s.stage_number AS nr,
           (SELECT COUNT(*) FROM stages WHERE race_id = s.race_id) AS gesamt
    FROM stages s WHERE s.id = ?
  `).get(stageId) as { nr: number; gesamt: number } | undefined;
  if (!zeile) return undefined;
  if (zeile.gesamt <= 1) return 'eintagesrennen';
  if (zeile.nr <= 1) return 'erste-etappe';
  if (zeile.nr >= zeile.gesamt) return 'letzte-etappe';
  return 'mittlere-etappe';
}
