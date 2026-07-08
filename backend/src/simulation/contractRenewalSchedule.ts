import Database from 'better-sqlite3';
import { tableExists } from '../db/mappers';

export const CONTRACT_RENEWAL_MONTH_DAY = '08-01';
const CONTRACT_RENEWAL_SHARE = 0.35;
const CONTRACT_RENEWAL_MIN_YEARS = 1;
const CONTRACT_RENEWAL_MAX_YEARS = 3;

function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

// Am 01.08. jeder Saison werden alle in diesem Jahr auslaufenden Vertraege
// geprueft: 35% werden automatisch um zufaellig 1-3 Jahre verlaengert - aber
// nur, wenn der Fahrer dadurch nicht sein Retirement-Age erreicht (Filter vor
// der 35%-Ziehung, damit die Quote sich auf verlaengerbare Vertraege bezieht).
// Verlaengerte Vertraege bleiben 'active' mit End-Saison in der Zukunft und
// scheiden damit automatisch aus dem Free-Agent-Pool des Jahresend-Drafts aus
// (siehe Eligibility-Query in RiderDraftService: status IN ('active','future')
// schliesst sie aus). Silent, kein News-Eintrag. Idempotent ueber
// contract_renewal_runs (eine Zeile je Saison, in der der Lauf bereits
// stattgefunden hat).
export function ensureContractRenewals(db: Database.Database): void {
  if (!tableExists(db, 'contracts') || !tableExists(db, 'riders') || !tableExists(db, 'game_state')) return;
  if (!tableExists(db, 'contract_renewal_runs')) return;

  // WICHTIG: "current_date" quoten - unquoted ist es das SQLite-Schluesselwort
  // CURRENT_DATE (echtes Systemdatum) statt der gespeicherten Spielzeit.
  const gameState = db.prepare('SELECT "current_date" AS d, season FROM game_state LIMIT 1').get() as
    | { d: string; season: number }
    | undefined;
  if (!gameState) return;
  if (gameState.d < `${gameState.season}-${CONTRACT_RENEWAL_MONTH_DAY}`) return;

  const alreadyRun = db.prepare('SELECT 1 FROM contract_renewal_runs WHERE season = ?').get(gameState.season);
  if (alreadyRun) return;

  const candidates = db.prepare(`
    SELECT c.id AS id, r.birth_year AS birthYear, r.retirement_age AS retirementAge
    FROM contracts c
    JOIN riders r ON r.id = c.rider_id
    WHERE c.end_season = ? AND c.status = 'active' AND r.is_retired = 0
  `).all(gameState.season) as Array<{ id: number; birthYear: number; retirementAge: number }>;

  const eligible = candidates
    .map((c) => {
      const effectiveRetirementAge = c.retirementAge > 0 ? c.retirementAge : 36;
      const maxExtensionYears = c.birthYear + effectiveRetirementAge - 1 - gameState.season;
      return { id: c.id, maxExtensionYears };
    })
    .filter((c) => c.maxExtensionYears >= CONTRACT_RENEWAL_MIN_YEARS);

  for (let i = eligible.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
  }

  const renewCount = Math.round(eligible.length * CONTRACT_RENEWAL_SHARE);
  const selected = eligible.slice(0, renewCount);

  const updateStmt = db.prepare('UPDATE contracts SET end_season = end_season + ? WHERE id = ?');
  const markRunStmt = db.prepare('INSERT OR IGNORE INTO contract_renewal_runs (season) VALUES (?)');

  db.transaction(() => {
    for (const c of selected) {
      const extensionYears = Math.min(randomInteger(CONTRACT_RENEWAL_MIN_YEARS, CONTRACT_RENEWAL_MAX_YEARS), c.maxExtensionYears);
      updateStmt.run(extensionYears, c.id);
    }
    markRunStmt.run(gameState.season);
  })();
}
