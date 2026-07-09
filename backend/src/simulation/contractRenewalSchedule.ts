import Database from 'better-sqlite3';
import { tableExists } from '../db/mappers';

export const CONTRACT_RENEWAL_MONTH_DAY = '08-01';
const CONTRACT_RENEWAL_SHARE = 0.35;              // KI-Teams: feste 35%
const PLAYER_RENEWAL_MIN_SHARE = 0.35;            // Spieler: 35-65% der Auswahl
const PLAYER_RENEWAL_MAX_SHARE = 0.65;
const CONTRACT_RENEWAL_MIN_YEARS = 1;
const CONTRACT_RENEWAL_MAX_YEARS = 3;

function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

interface RenewalRow { id: number; maxExtensionYears: number }

// Am 01.08. jeder Saison werden auslaufende Vertraege verlaengert:
//   * KI-Teams: 35% der verlaengerbaren Vertraege (Retirement-Filter vor der
//     Ziehung), zufaellig 1-3 Jahre.
//   * Spieler-Team: NUR die am 10.01. ausgewaehlten Ziele (contract_renewal_
//     selection); davon verlaengern zufaellig 35-65%.
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

  const toRenewalRow = (c: { id: number; birthYear: number; retirementAge: number }): RenewalRow => {
    const effRetAge = c.retirementAge > 0 ? c.retirementAge : 36;
    return { id: c.id, maxExtensionYears: c.birthYear + effRetAge - 1 - gameState.season };
  };

  // --- KI-Teams: 35% der verlaengerbaren, auslaufenden Vertraege ---
  const aiCandidates = db.prepare(`
    SELECT c.id AS id, r.birth_year AS birthYear, r.retirement_age AS retirementAge
    FROM contracts c
    JOIN riders r ON r.id = c.rider_id
    WHERE c.end_season = ? AND c.status = 'active' AND r.is_retired = 0
      ${playerTeamId != null ? 'AND c.team_id != ?' : ''}
  `).all(...(playerTeamId != null ? [gameState.season, playerTeamId] : [gameState.season])) as
    Array<{ id: number; birthYear: number; retirementAge: number }>;

  const aiEligible = aiCandidates.map(toRenewalRow).filter((c) => c.maxExtensionYears >= CONTRACT_RENEWAL_MIN_YEARS);
  shuffle(aiEligible);
  const aiSelected = aiEligible.slice(0, Math.round(aiEligible.length * CONTRACT_RENEWAL_SHARE));

  // --- Spieler-Team: 35-65% der am 10.01. ausgewaehlten Ziele ---
  let playerSelected: RenewalRow[] = [];
  if (playerTeamId != null && tableExists(db, 'contract_renewal_selection')) {
    const chosen = db.prepare(`
      SELECT c.id AS id, r.birth_year AS birthYear, r.retirement_age AS retirementAge
      FROM contract_renewal_selection s
      JOIN contracts c ON c.rider_id = s.rider_id AND c.team_id = ? AND c.end_season = ? AND c.status = 'active'
      JOIN riders r ON r.id = c.rider_id
      WHERE s.season = ? AND r.is_retired = 0
    `).all(playerTeamId, gameState.season, gameState.season) as
      Array<{ id: number; birthYear: number; retirementAge: number }>;
    const eligible = chosen.map(toRenewalRow).filter((c) => c.maxExtensionYears >= CONTRACT_RENEWAL_MIN_YEARS);
    shuffle(eligible);
    const share = PLAYER_RENEWAL_MIN_SHARE + Math.random() * (PLAYER_RENEWAL_MAX_SHARE - PLAYER_RENEWAL_MIN_SHARE);
    playerSelected = eligible.slice(0, Math.round(eligible.length * share));
  }

  const updateStmt = db.prepare('UPDATE contracts SET end_season = end_season + ? WHERE id = ?');
  const markRunStmt = db.prepare('INSERT OR IGNORE INTO contract_renewal_runs (season) VALUES (?)');

  db.transaction(() => {
    for (const c of [...aiSelected, ...playerSelected]) {
      const extensionYears = Math.min(randomInteger(CONTRACT_RENEWAL_MIN_YEARS, CONTRACT_RENEWAL_MAX_YEARS), c.maxExtensionYears);
      updateStmt.run(extensionYears, c.id);
    }
    markRunStmt.run(gameState.season);
  })();
}
