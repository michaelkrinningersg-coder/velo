import Database from 'better-sqlite3';
import { tableExists } from '../db/mappers';

// Auswahlfenster fuer Spieler-Vertragsverlaengerungen: ab dem 10.01. jeder
// Saison waehlt der Spieler seine Verlaengerungsziele (max. 75% der Fahrer mit
// auslaufendem Vertrag, ohne Retirement-Faelle). Am 01.08. verlaengern davon
// zufaellig 35-65% (siehe contractRenewalSchedule.ts). KI-Teams bleiben beim
// automatischen 35%-Lauf.
export const RENEWAL_SELECTION_MONTH_DAY = '01-10';
export const RENEWAL_DRAW_MONTH_DAY = '08-01';
export const RENEWAL_MAX_SELECT_SHARE = 0.75;
const RETIREMENT_AGE_FALLBACK = 36;

export interface RenewalCandidate {
  riderId: number;
  firstName: string;
  lastName: string;
  countryCode: string | null;
  overallRating: number;
  age: number;
  endSeason: number;
  maxExtensionYears: number;
}

export interface RenewalSelectionPayload {
  season: number;
  windowOpen: boolean;
  confirmed: boolean;
  maxSelectable: number;
  candidates: RenewalCandidate[];
  selectedRiderIds: number[];
}

function getGameState(db: Database.Database): { date: string; season: number } | null {
  const row = db.prepare('SELECT "current_date" AS d, season FROM game_state LIMIT 1').get() as
    | { d: string; season: number } | undefined;
  return row ? { date: row.d, season: row.season } : null;
}

function getPlayerTeamId(db: Database.Database): number | null {
  const row = db.prepare('SELECT id FROM teams WHERE is_player_team = 1 LIMIT 1').get() as { id: number } | undefined;
  return row?.id ?? null;
}

// Fahrer des Spieler-Teams mit in dieser Saison auslaufendem Vertrag, die nicht
// ihr Retirement-Age erreichen (also mind. 1 Jahr verlaengerbar sind).
export function getEligibleRenewalCandidates(db: Database.Database, season: number, teamId: number): RenewalCandidate[] {
  const rows = db.prepare(`
    SELECT c.rider_id AS riderId, r.first_name AS firstName, r.last_name AS lastName,
           r.birth_year AS birthYear, r.retirement_age AS retirementAge,
           r.overall_rating AS overallRating, country.code_3 AS countryCode, c.end_season AS endSeason
    FROM contracts c
    JOIN riders r ON r.id = c.rider_id
    JOIN sta_country country ON country.id = r.country_id
    WHERE c.team_id = ? AND c.end_season = ? AND c.status = 'active' AND r.is_retired = 0
    ORDER BY r.overall_rating DESC, r.last_name ASC
  `).all(teamId, season) as Array<{
    riderId: number; firstName: string; lastName: string; birthYear: number;
    retirementAge: number; overallRating: number; countryCode: string | null; endSeason: number;
  }>;

  const candidates: RenewalCandidate[] = [];
  for (const r of rows) {
    const effRetAge = r.retirementAge > 0 ? r.retirementAge : RETIREMENT_AGE_FALLBACK;
    const maxExtensionYears = r.birthYear + effRetAge - 1 - season;
    if (maxExtensionYears < 1) continue; // wuerde Retirement-Age erreichen -> nicht waehlbar
    candidates.push({
      riderId: r.riderId, firstName: r.firstName, lastName: r.lastName,
      countryCode: r.countryCode, overallRating: r.overallRating,
      age: season - r.birthYear, endSeason: r.endSeason, maxExtensionYears,
    });
  }
  return candidates;
}

export function maxSelectableCount(eligibleCount: number): number {
  return Math.floor(eligibleCount * RENEWAL_MAX_SELECT_SHARE);
}

function windowOpen(date: string, season: number): boolean {
  return date >= `${season}-${RENEWAL_SELECTION_MONTH_DAY}` && date < `${season}-${RENEWAL_DRAW_MONTH_DAY}`;
}

export function isRenewalSelectionConfirmed(db: Database.Database, season: number): boolean {
  if (!tableExists(db, 'contract_renewal_selection_runs')) return true;
  return db.prepare('SELECT 1 FROM contract_renewal_selection_runs WHERE season = ?').get(season) != null;
}

// Muss der Spieler aktuell seine Verlaengerungsziele waehlen? (blockiert den
// Tageswechsel bis zur Bestaetigung).
export function isRenewalSelectionPending(db: Database.Database): boolean {
  if (!tableExists(db, 'contracts') || !tableExists(db, 'contract_renewal_selection_runs')) return false;
  const gs = getGameState(db);
  if (!gs) return false;
  if (!windowOpen(gs.date, gs.season)) return false;
  if (isRenewalSelectionConfirmed(db, gs.season)) return false;
  const teamId = getPlayerTeamId(db);
  if (teamId == null) return false;
  return getEligibleRenewalCandidates(db, gs.season, teamId).length > 0;
}

export function getRenewalSelectionPayload(db: Database.Database): RenewalSelectionPayload {
  const gs = getGameState(db);
  const season = gs?.season ?? 0;
  const teamId = gs ? getPlayerTeamId(db) : null;
  const candidates = gs && teamId != null ? getEligibleRenewalCandidates(db, season, teamId) : [];
  const selectedRiderIds = tableExists(db, 'contract_renewal_selection')
    ? (db.prepare('SELECT rider_id AS id FROM contract_renewal_selection WHERE season = ?').all(season) as Array<{ id: number }>).map((r) => r.id)
    : [];
  return {
    season,
    windowOpen: gs ? windowOpen(gs.date, season) : false,
    confirmed: isRenewalSelectionConfirmed(db, season),
    maxSelectable: maxSelectableCount(candidates.length),
    candidates,
    selectedRiderIds,
  };
}

// Speichert die Auswahl des Spielers und schliesst das Fenster (markiert die
// Saison als bestaetigt). Validiert: nur waehlbare Fahrer, max. 75%.
export function saveRenewalSelection(db: Database.Database, riderIds: number[]): void {
  const gs = getGameState(db);
  if (!gs) throw new Error('Spielzustand nicht ladbar.');
  const teamId = getPlayerTeamId(db);
  if (teamId == null) throw new Error('Kein Spieler-Team gefunden.');
  if (!windowOpen(gs.date, gs.season)) throw new Error('Das Auswahlfenster für Vertragsverlängerungen ist nicht geöffnet.');
  if (isRenewalSelectionConfirmed(db, gs.season)) throw new Error('Die Auswahl wurde für diese Saison bereits bestätigt.');

  const eligible = getEligibleRenewalCandidates(db, gs.season, teamId);
  const eligibleIds = new Set(eligible.map((c) => c.riderId));
  const unique = Array.from(new Set(riderIds ?? []));
  for (const id of unique) {
    if (!eligibleIds.has(id)) throw new Error(`Fahrer ${id} ist nicht wählbar (kein auslaufender Vertrag oder Retirement).`);
  }
  const maxSel = maxSelectableCount(eligible.length);
  if (unique.length > maxSel) throw new Error(`Es dürfen maximal ${maxSel} Fahrer (75%) ausgewählt werden.`);

  const insertSel = db.prepare('INSERT OR IGNORE INTO contract_renewal_selection (season, rider_id) VALUES (?, ?)');
  const clearSel = db.prepare('DELETE FROM contract_renewal_selection WHERE season = ?');
  const markRun = db.prepare('INSERT OR IGNORE INTO contract_renewal_selection_runs (season) VALUES (?)');
  db.transaction(() => {
    clearSel.run(gs.season);
    for (const id of unique) insertSel.run(gs.season, id);
    markRun.run(gs.season);
  })();
}
