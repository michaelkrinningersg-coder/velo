import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import { ensureOlympicGames } from './olympicGamesSchedule';
import { createTestDb, seedReferenceData, seedTeams, seedGameState } from '../__tests__/helpers/testDb';

// Legt fuer eine Saison je einen Basis-Stage-Eintrag an, damit ensureOlympic-
// Games die Saison ueber die stages-Tabelle entdeckt.
function seedSeasonStage(db: Database.Database, id: number, season: number) {
  db.prepare(`INSERT INTO races (id, name, country_id, category_id, is_stage_race, number_of_stages, start_date, end_date, prestige)
    VALUES (?, 'Basis', 1, 1, 0, 1, ?, ?, 10)`).run(id, `${season}-01-10`, `${season}-01-10`);
  db.prepare(`INSERT INTO stages (id, race_id, stage_number, date, profile, start_elevation, details_csv_file)
    VALUES (?, ?, 1, ?, 'Flat', 0, 'x.csv')`).run(id, id, `${season}-01-10`);
}

function olympicRaceCount(db: Database.Database, season: number): number {
  return (db.prepare(`
    SELECT COUNT(*) AS n FROM races r JOIN stages s ON s.race_id = r.id
    WHERE r.category_id IN (24, 25) AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
  `).get(season) as { n: number }).n;
}

describe('ensureOlympicGames', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 1, playerTeamId: 1 });
  });

  afterEach(() => db.close());

  it('erzeugt Olympia (ITT+Strasse) nur in Olympia-Jahren ab dem 22.06.', () => {
    seedSeasonStage(db, 100, 2027); // kein Olympia-Jahr
    seedSeasonStage(db, 101, 2028); // Olympia-Jahr
    seedGameState(db, { date: '2028-08-01', season: 2028 });

    ensureOlympicGames(db);

    expect(olympicRaceCount(db, 2028)).toBe(2); // ITT (24? -> 25) + Strasse (24)
    expect(olympicRaceCount(db, 2027)).toBe(0);

    const cats = db.prepare(`
      SELECT r.category_id AS c, s.date AS d FROM races r JOIN stages s ON s.race_id = r.id
      WHERE r.category_id IN (24, 25) ORDER BY s.date
    `).all() as Array<{ c: number; d: string }>;
    expect(cats).toEqual([
      { c: 25, d: '2028-06-22' }, // ITT
      { c: 24, d: '2028-06-24' }, // Strasse
    ]);
  });

  it('erzeugt in der laufenden Olympia-Saison nichts vor dem 22.06.', () => {
    seedSeasonStage(db, 102, 2028);
    seedGameState(db, { date: '2028-06-21', season: 2028 });

    ensureOlympicGames(db);

    expect(olympicRaceCount(db, 2028)).toBe(0);
  });

  it('ist idempotent (kein Doppelanlegen bei erneutem Aufruf)', () => {
    seedSeasonStage(db, 103, 2028);
    seedGameState(db, { date: '2028-07-01', season: 2028 });

    ensureOlympicGames(db);
    ensureOlympicGames(db);

    expect(olympicRaceCount(db, 2028)).toBe(2);
  });
});
