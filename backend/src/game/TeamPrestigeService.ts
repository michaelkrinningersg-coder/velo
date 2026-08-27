import Database from 'better-sqlite3';
import { ResultRepository } from '../db/repositories/ResultRepository';
import { columnExists, tableExists } from '../db/mappers';

/**
 * Prestige eines Teams — die langsame Achse der Teamidentitaet.
 *
 * Bisher unterschied die Teams im Draft nur die Reihenfolge, und die ist im
 * Sechs-Runden-Zyklus bewusst gedaempft (Verhaeltnis der besten fuenf zu den
 * schwaechsten fuenf: 3:1). Nach ein paar Saisons sahen deshalb alle Kader
 * gleich aus.
 *
 * Prestige ist der gleitende Mittelwert der Platzierung ueber drei Saisons.
 * Bewusst nicht die letzte allein: ein Team soll nicht nach einem schlechten
 * Jahr abstuerzen und nicht nach einem guten aufsteigen — das ist der
 * Unterschied zwischen Tabellenplatz und Identitaet.
 *
 * Es steuert zwei Dinge: wie viele Spitzenfahrer ein Team halten darf
 * (`resolveTopRiderCaps`) und wie lange es Vertraege anbieten kann
 * (`shared/contractTerms.ts`).
 */

/** Ueber so viele Saisons wird gemittelt. */
export const PRESTIGE_WINDOW_SEASONS = 3;
/** Ohne Ergebnisse steht ein Team in der Mitte. */
export const PRESTIGE_DEFAULT = 3;

/**
 * Top-Fahrer-Kappen je Prestigestufe: wie viele Fahrer ueber 77 und ueber 74
 * ein Team gleichzeitig halten darf.
 *
 * Prestige 3 traegt die bisherigen Werte fuer alle Teams (4 und 10). Nach oben
 * und unten faechert es auf — so entstehen echte Spitzenteams, ohne dass eines
 * alle Bergfahrer einsammelt: die Verteilung je Spezialisierung
 * (`shared/draftWeights.ts`) steht unveraendert daneben.
 */
export const TOP_RIDER_CAPS_BY_PRESTIGE: Readonly<Record<number, { cap77: number; cap74: number }>> = {
  1: { cap77: 2, cap74: 6 },
  2: { cap77: 3, cap74: 8 },
  3: { cap77: 4, cap74: 10 },
  4: { cap77: 5, cap74: 11 },
  5: { cap77: 6, cap74: 13 },
};

export function resolveTopRiderCaps(prestige: number): { cap77: number; cap74: number } {
  const stufe = Math.max(1, Math.min(5, Math.round(prestige)));
  return TOP_RIDER_CAPS_BY_PRESTIGE[stufe] ?? TOP_RIDER_CAPS_BY_PRESTIGE[PRESTIGE_DEFAULT]!;
}

/**
 * Verteilt Teams anhand ihrer mittleren Platzierung auf fuenf Stufen.
 *
 * Quintile statt fester Punktgrenzen: die Punktzahlen einer Saison haengen am
 * Kalender und waeren als absolute Schwelle nicht stabil. Fuenf gleich grosse
 * Gruppen sind es.
 */
export function resolvePrestigeByRank(rankIndex: number, teamCount: number): number {
  if (teamCount <= 1) return PRESTIGE_DEFAULT;
  const quintil = Math.floor((rankIndex * 5) / teamCount);
  return 5 - Math.max(0, Math.min(4, quintil));
}

export class TeamPrestigeService {
  constructor(private readonly db: Database.Database) {}

  /**
   * Rechnet das Prestige aller Teams neu und schreibt es in `teams.prestige`.
   * `season` ist die gerade abgeschlossene Saison.
   */
  public recalculatePrestige(season: number): void {
    if (!tableExists(this.db, 'teams') || !columnExists(this.db, 'teams', 'prestige')) return;

    const repo = new ResultRepository(this.db);
    const summeRang = new Map<number, number>();
    const zahlRang = new Map<number, number>();

    for (let versatz = 0; versatz < PRESTIGE_WINDOW_SEASONS; versatz += 1) {
      let standings: { teamStandings: Array<{ teamId: number | null }> };
      try {
        standings = repo.getSeasonStandings(season - versatz) as any;
      } catch {
        continue;
      }
      const teams = (standings.teamStandings ?? []).filter((t) => t.teamId != null);
      if (teams.length === 0) continue;
      teams.forEach((team, index) => {
        const id = team.teamId as number;
        // Auf die Feldgroesse normiert, damit Saisons mit unterschiedlich
        // vielen gewerteten Teams vergleichbar bleiben.
        summeRang.set(id, (summeRang.get(id) ?? 0) + (index / Math.max(1, teams.length - 1)));
        zahlRang.set(id, (zahlRang.get(id) ?? 0) + 1);
      });
    }

    const alleTeams = this.db.prepare('SELECT id FROM teams ORDER BY id ASC').all() as Array<{ id: number }>;
    if (alleTeams.length === 0) return;

    const mittel = alleTeams.map((team) => ({
      id: team.id,
      // Teams ohne Ergebnisse landen in der Mitte statt am Ende.
      wert: zahlRang.has(team.id) ? (summeRang.get(team.id) as number) / (zahlRang.get(team.id) as number) : 0.5,
    })).sort((links, rechts) => links.wert - rechts.wert || links.id - rechts.id);

    const schreiben = this.db.prepare('UPDATE teams SET prestige = ? WHERE id = ?');
    this.db.transaction(() => {
      mittel.forEach((team, index) => {
        schreiben.run(resolvePrestigeByRank(index, mittel.length), team.id);
      });
    })();
  }

  /** Prestige je Team, mit Vorgabe fuer alles, was noch keines hat. */
  public loadPrestigeByTeamId(): Map<number, number> {
    const werte = new Map<number, number>();
    if (!tableExists(this.db, 'teams')) return werte;
    const hatSpalte = columnExists(this.db, 'teams', 'prestige');
    const rows = this.db.prepare(
      `SELECT id, ${hatSpalte ? 'prestige' : `${PRESTIGE_DEFAULT} AS prestige`} FROM teams`,
    ).all() as Array<{ id: number; prestige: number | null }>;
    for (const row of rows) werte.set(row.id, row.prestige ?? PRESTIGE_DEFAULT);
    return werte;
  }
}
