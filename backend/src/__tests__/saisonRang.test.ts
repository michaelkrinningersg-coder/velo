import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import { createTestDb, seedReferenceData, seedTeams, seedRider, seedGameState } from './helpers/testDb';
import { ResultRepository } from '../db/repositories/ResultRepository';
import { DatabaseService } from '../db/DatabaseService';

/**
 * `rider_season_rank` haelt den Platz in der Saisonwertung je abgeschlossener
 * Saison fest.
 *
 * Vorher zeigte die Vertragsuebersicht nur den Platz der laufenden Saison, weil
 * die Payload nur diesen einen Wert trug. Ihn nachtraeglich zu rechnen kostet
 * 4,5 ms je Saison, ihn aus dem Snapshot der Saisonwertung herauszusuchen
 * 8,8 ms fuer alle — die Tabelle beantwortet dieselbe Frage per Index.
 *
 * Entscheidend ist, dass sie denselben Platz nennt wie die Saisonwertung
 * selbst: beide stammen aus `getSeasonStandings`.
 */
describe('Saison-Raenge', () => {
  let db: Database.Database;
  const fahrer: number[] = [];

  beforeEach(() => {
    db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 2, playerTeamId: 1 });
    seedGameState(db, { date: '2029-03-01', season: 2029 });
    db.prepare(`INSERT INTO race_categories_bonus (id, name, bonus_seconds_final, points_one_day, points_gc_final, points_stage, points_sprint_finish)
      VALUES (1, 'B', '10|6|4', '25|20|15|10', '50|30|20', '25|20|15|10', '25|20|15|10')`).run();
    db.prepare(`INSERT INTO race_categories (id, name, tier, number_of_teams, number_of_riders, bonus_system_id, home_selection_probability)
      VALUES (1, 'Cat', 1, 2, 4, 1, 0.0)`).run();
    // Je Saison ein eigenes Rennen: season_point_events ist auf
    // (stage_id, rider_id, award_type) eindeutig.
    for (const [id, jahr] of [[1, 2027], [2, 2028]] as const) {
      db.prepare(`INSERT INTO races (id, name, country_id, category_id, is_stage_race, number_of_stages, start_date, end_date, prestige)
        VALUES (?, ?, 1, 1, 0, 1, ?, ?, 50)`).run(id, 'Test ' + jahr, `${jahr}-05-01`, `${jahr}-05-01`);
      db.prepare(`INSERT INTO stages (id, race_id, stage_number, date, profile, start_elevation, details_csv_file)
        VALUES (?, ?, 1, ?, 'Flat', 0, 'x.csv')`).run(id, id, `${jahr}-05-01`);
    }

    fahrer.length = 0;
    for (let i = 0; i < 4; i += 1) fahrer.push(seedRider(db, { activeTeamId: (i % 2) + 1, overallRating: 70 }));

    // Punkte in zwei abgeschlossenen Saisons, mit umgekehrter Rangfolge.
    const ereignis = db.prepare(`
      INSERT INTO season_point_events (season, race_id, stage_id, rider_id, team_id, award_type, rank, points_awarded, awarded_on)
      VALUES (?, ?, ?, ?, 1, 'one_day_result', 1, ?, ?)
    `);
    const punkte2027 = [400, 300, 200, 100];
    const punkte2028 = [100, 200, 300, 400];
    fahrer.forEach((id, i) => {
      ereignis.run(2027, 1, 1, id, punkte2027[i], '2027-05-01');
      ereignis.run(2028, 2, 2, id, punkte2028[i], '2028-05-01');
    });
  });

  afterEach(() => db.close());

  it('schreibt die Wertung einer Saison fest und liefert sie je Fahrer zurueck', () => {
    const repo = new ResultRepository(db);
    expect(repo.writeRiderSeasonRanks(2027)).toBe(4);
    expect(repo.writeRiderSeasonRanks(2028)).toBe(4);

    // 2027 fuehrt der erste Fahrer, 2028 der letzte.
    expect(repo.getRiderSeasonRanks(fahrer[0]!)).toEqual([
      { season: 2028, rank: 4 },
      { season: 2027, rank: 1 },
    ]);
    expect(repo.getRiderSeasonRanks(fahrer[3]!)).toEqual([
      { season: 2028, rank: 1 },
      { season: 2027, rank: 4 },
    ]);
  });

  it('nennt denselben Platz wie die Saisonwertung', () => {
    const repo = new ResultRepository(db);
    repo.writeRiderSeasonRanks(2027);
    for (const zeile of repo.getSeasonStandings(2027).riderStandings) {
      if (zeile.riderId == null) continue;
      const ausTabelle = (db.prepare('SELECT rank FROM rider_season_rank WHERE season = ? AND rider_id = ?')
        .get(2027, zeile.riderId) as { rank: number }).rank;
      expect(ausTabelle).toBe(zeile.rank);
    }
  });

  it('schreibt beim zweiten Aufruf dieselbe Saison sauber neu', () => {
    const repo = new ResultRepository(db);
    repo.writeRiderSeasonRanks(2027);
    repo.writeRiderSeasonRanks(2027);
    const anzahl = (db.prepare('SELECT COUNT(*) AS n FROM rider_season_rank WHERE season = 2027').get() as { n: number }).n;
    expect(anzahl).toBe(4);
  });

  it('traegt bestehende Spielstaende beim Laden nach — ohne die laufende Saison', () => {
    new DatabaseService().applySchemaTo(db);

    const saisons = (db.prepare('SELECT DISTINCT season FROM rider_season_rank ORDER BY season').all() as Array<{ season: number }>)
      .map((z) => z.season);
    // 2029 laeuft noch: ihr Platz aendert sich mit jedem Rennen und wird direkt
    // gerechnet, nicht festgeschrieben.
    expect(saisons).toEqual([2027, 2028]);
    expect(new ResultRepository(db).getRiderSeasonRanks(fahrer[0]!)).toEqual([
      { season: 2028, rank: 4 },
      { season: 2027, rank: 1 },
    ]);
  });
});
