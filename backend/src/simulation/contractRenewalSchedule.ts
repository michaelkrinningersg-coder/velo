import Database from 'better-sqlite3';
import { resolveContractYears } from '../../../shared/contractTerms';
import { selectRenewalCandidates, type RenewalCandidate } from '../../../shared/contractRenewal';
import { tableExists } from '../db/mappers';

export const CONTRACT_RENEWAL_MONTH_DAY = '08-01';
const CONTRACT_RENEWAL_SHARE = 0.35;              // KI-Teams: feste 35%
const PLAYER_RENEWAL_MIN_SHARE = 0.50;            // Spieler: 50-80% der Auswahl
const PLAYER_RENEWAL_MAX_SHARE = 0.80;
const CONTRACT_RENEWAL_MIN_YEARS = 1;

function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/** Rollen, deren Traeger ein Team nicht aus Versehen ziehen laesst. */
const CAPTAIN_ROLE_NAMES = new Set(['Kapitaen', 'Co-Kapitaen']);

interface RenewalRow extends RenewalCandidate {
  maxExtensionYears: number;
  retirementAge: number;
  teamId: number;
}

interface RenewalSourceRow {
  id: number;
  teamId: number;
  birthYear: number;
  retirementAge: number;
  potential: number;
  overall: number;
  declineAge: number;
  roleName: string | null;
  riderId: number;
}

/** Gruppiert Vertraege nach Team — die Auswahl laeuft je Kader, nicht global. */
function groupByTeam(rows: readonly RenewalRow[]): Map<number, RenewalRow[]> {
  const nachTeam = new Map<number, RenewalRow[]>();
  for (const row of rows) {
    const eimer = nachTeam.get(row.teamId) ?? [];
    eimer.push(row);
    nachTeam.set(row.teamId, eimer);
  }
  return nachTeam;
}

// Am 01.08. jeder Saison werden auslaufende Vertraege verlaengert:
//   * KI-Teams: 35 % der verlaengerbaren Vertraege JE TEAM. Wer davon, das
//     entscheidet seit dem Umbau nicht mehr das Mischen, sondern eine
//     gewichtete Ziehung nach dem Verlaengerungswert — siehe
//     shared/contractRenewal.ts. Frueher waren es 35 % ueber ALLE Teams
//     zusammen, ein Team konnte also zufaellig leer ausgehen.
//   * Spieler-Team: NUR die am 10.01. ausgewaehlten Ziele (contract_renewal_
//     selection); davon verlaengern zufaellig 50-80%.
// Verlaengerte Vertraege bleiben 'active' mit Zukunfts-End-Saison und scheiden
// so aus dem Free-Agent-Pool des Jahresend-Drafts aus. Silent, idempotent ueber
// contract_renewal_runs (eine Zeile je bereits gelaufener Saison).
export function ensureContractRenewals(db: Database.Database): void {
  if (!tableExists(db, 'contracts') || !tableExists(db, 'riders') || !tableExists(db, 'game_state')) return;
  if (!tableExists(db, 'contract_renewal_runs')) return;

  // WICHTIG: "current_date" quoten - unquoted ist es das SQLite-Schluesselwort.
  const gameState = db.prepare('SELECT "current_date" AS d, season FROM game_state LIMIT 1').get() as
    | { d: string; season: number } | undefined;
  if (!gameState) return;
  if (gameState.d < `${gameState.season}-${CONTRACT_RENEWAL_MONTH_DAY}`) return;

  const alreadyRun = db.prepare('SELECT 1 FROM contract_renewal_runs WHERE season = ?').get(gameState.season);
  if (alreadyRun) return;

  const playerTeamRow = db.prepare('SELECT id FROM teams WHERE is_player_team = 1 LIMIT 1').get() as { id: number } | undefined;
  const playerTeamId = playerTeamRow?.id ?? null;

  const prestigeByTeamId = new Map<number, number>(
    (db.prepare('SELECT id, COALESCE(prestige, 3) AS prestige FROM teams').all() as Array<{ id: number; prestige: number }>)
      .map((t) => [t.id, t.prestige]),
  );

  const toRenewalRow = (c: RenewalSourceRow): RenewalRow => {
    const effRetAge = c.retirementAge > 0 ? c.retirementAge : 36;
    return {
      contractId: c.id,
      riderId: c.riderId,
      maxExtensionYears: c.birthYear + effRetAge - 1 - gameState.season,
      age: gameState.season - c.birthYear,
      overall: c.overall,
      potential: c.potential,
      declineAge: c.declineAge,
      isCaptain: c.roleName != null && CAPTAIN_ROLE_NAMES.has(c.roleName),
      retirementAge: c.retirementAge,
      teamId: c.teamId,
    };
  };

  const AUSWAHLFELDER = `
    c.id AS id, c.team_id AS teamId, c.rider_id AS riderId,
    r.birth_year AS birthYear, r.retirement_age AS retirementAge,
    r.pot_overall AS potential, r.overall_rating AS overall,
    r.decline_age AS declineAge, ro.name AS roleName
  `;

  // --- KI-Teams: 35% der verlaengerbaren, auslaufenden Vertraege ---
  const aiCandidates = db.prepare(`
    SELECT ${AUSWAHLFELDER}
    FROM contracts c
    JOIN riders r ON r.id = c.rider_id
    LEFT JOIN sta_role ro ON ro.id = r.role_id
    WHERE c.end_season = ? AND c.status = 'active' AND r.is_retired = 0
      ${playerTeamId != null ? 'AND c.team_id != ?' : ''}
  `).all(...(playerTeamId != null ? [gameState.season, playerTeamId] : [gameState.season])) as RenewalSourceRow[];

  const aiEligible = aiCandidates.map(toRenewalRow).filter((c) => c.maxExtensionYears >= CONTRACT_RENEWAL_MIN_YEARS);
  const aiSelected: RenewalRow[] = [];
  for (const kader of groupByTeam(aiEligible).values()) {
    const anzahl = Math.round(kader.length * CONTRACT_RENEWAL_SHARE);
    aiSelected.push(...(selectRenewalCandidates(kader, anzahl, Math.random) as RenewalRow[]));
  }

  // --- Spieler-Team: 35-65% der am 10.01. ausgewaehlten Ziele ---
  let playerSelected: RenewalRow[] = [];
  if (playerTeamId != null && tableExists(db, 'contract_renewal_selection')) {
    const chosen = db.prepare(`
      SELECT ${AUSWAHLFELDER}
      FROM contract_renewal_selection s
      JOIN contracts c ON c.rider_id = s.rider_id AND c.team_id = ? AND c.end_season = ? AND c.status = 'active'
      JOIN riders r ON r.id = c.rider_id
      LEFT JOIN sta_role ro ON ro.id = r.role_id
      WHERE s.season = ? AND r.is_retired = 0
    `).all(playerTeamId, gameState.season, gameState.season) as RenewalSourceRow[];
    const eligible = chosen.map(toRenewalRow).filter((c) => c.maxExtensionYears >= CONTRACT_RENEWAL_MIN_YEARS);
    shuffle(eligible);
    const share = PLAYER_RENEWAL_MIN_SHARE + Math.random() * (PLAYER_RENEWAL_MAX_SHARE - PLAYER_RENEWAL_MIN_SHARE);
    playerSelected = eligible.slice(0, Math.round(eligible.length * share));
  }

  const updateStmt = db.prepare('UPDATE contracts SET end_season = end_season + ? WHERE id = ?');
  const markRunStmt = db.prepare('INSERT OR IGNORE INTO contract_renewal_runs (season) VALUES (?)');

  db.transaction(() => {
    for (const c of [...aiSelected, ...playerSelected]) {
      // Laenge nach Alter, Potenzial und Prestige — dieselbe Regel wie im
      // Draft, damit ein Vertrag nicht davon abhaengt, auf welchem Weg er
      // zustande kommt.
      const gewuenscht = resolveContractYears({
        age: c.age, potential: c.potential, retirementAge: c.retirementAge,
        teamPrestige: prestigeByTeamId.get(c.teamId) ?? 3,
      }, Math.random);
      const extensionYears = Math.max(CONTRACT_RENEWAL_MIN_YEARS, Math.min(gewuenscht, c.maxExtensionYears));
      updateStmt.run(extensionYears, c.contractId);
    }
    markRunStmt.run(gameState.season);
  })();
}
