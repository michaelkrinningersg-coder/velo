import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import { createTestDb, seedReferenceData, seedTeams, seedRider, seedGameState } from './helpers/testDb';
import { RiderRepository } from '../db/repositories/RiderRepository';
import { GameStateService } from '../game/GameStateService';

/**
 * Die Karrierebilanz "Punkte je Rennen" gruppiert ueber den RENNNAMEN, nicht
 * ueber `races.id`.
 *
 * Grund: der Kalender legt fuer JEDE Saison eine eigene Zeile in `races` an —
 * die Tour de France steht in einem Spielstand mit acht Saisons acht Mal in
 * der Tabelle. Ueber die id gruppiert stuende jede Austragung als eigenes
 * "Rennen" in der Bilanz, mit einem Achtel der Punkte.
 *
 * Die Kategorie kommt aus der juengsten Austragung, damit eine spaetere
 * Umstufung eines Rennens nicht die alte Einstufung zeigt.
 */
describe('Karrierepunkte je Rennen', () => {
  let db: Database.Database;
  let fahrer: number;

  beforeEach(() => {
    db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 2, playerTeamId: 1 });
    seedGameState(db, { date: '2029-03-01', season: 2029 });
    // Legt die Zusatzspalten von rider_daily_state an, die getRiderStats liest.
    new GameStateService(db).ensureState();
    db.prepare(`INSERT INTO race_categories_bonus (id, name, bonus_seconds_final, points_one_day, points_gc_final, points_stage, points_sprint_finish)
      VALUES (901, 'B', '10|6|4', '25|20|15|10', '50|30|20', '25|20|15|10', '25|20|15|10')`).run();
    const kategorie = db.prepare(`INSERT INTO race_categories (id, name, tier, number_of_teams, number_of_riders, bonus_system_id, home_selection_probability)
      VALUES (?, ?, 1, 2, 4, 901, 0.0)`);
    kategorie.run(901, 'Testkategorie Eintagesrennen');
    kategorie.run(902, 'Testkategorie Meisterschaft');
    kategorie.run(903, 'Testkategorie Alt');

    // Je Saison eine eigene Rennzeile — genau so baut der Kalender ihn auf.
    // 'Klassiker' war 2027 noch anders eingestuft (903) als 2028 (901).
    const rennen = db.prepare(`INSERT INTO races (id, name, country_id, category_id, is_stage_race, number_of_stages, start_date, end_date, prestige)
      VALUES (?, ?, 1, ?, 0, 1, ?, ?, 50)`);
    rennen.run(1, 'Klassiker', 903, '2027-04-01', '2027-04-01');
    rennen.run(2, 'Klassiker', 901, '2028-04-01', '2028-04-01');
    rennen.run(3, 'Nationale Meisterschaft Strasse – Testland', 902, '2027-06-20', '2027-06-20');
    rennen.run(4, 'Nationale Meisterschaft Strasse – Testland', 902, '2028-06-20', '2028-06-20');
    // Gefahren, aber ohne Punkte — darf in der Bilanz nicht auftauchen.
    rennen.run(5, 'Punktloses Rennen', 901, '2028-08-01', '2028-08-01');

    const etappe = db.prepare(`INSERT INTO stages (id, race_id, stage_number, date, profile, start_elevation, details_csv_file)
      VALUES (?, ?, 1, ?, 'Flat', 0, 'dummy_flat_a.csv')`);
    etappe.run(1, 1, '2027-04-01');
    etappe.run(2, 2, '2028-04-01');
    etappe.run(3, 3, '2027-06-20');
    etappe.run(4, 4, '2028-06-20');
    etappe.run(5, 5, '2028-08-01');

    fahrer = seedRider(db, { activeTeamId: 1, overallRating: 70 });

    // Renntage kommen aus dem Startlisten-Archiv, nicht aus den Punkten.
    const eintrag = db.prepare(`
      INSERT INTO stage_entries_flat (stage_id, race_id, team_id, rider_id, status, status_reason)
      VALUES (?, ?, 1, ?, ?, NULL)
    `);

    const ereignis = db.prepare(`
      INSERT INTO season_point_events (season, race_id, stage_id, rider_id, team_id, award_type, rank, points_awarded, awarded_on)
      VALUES (?, ?, ?, ?, 1, 'one_day_result', 1, ?, ?)
    `);
    ereignis.run(2027, 1, 1, fahrer, 100, '2027-04-01');
    ereignis.run(2028, 2, 2, fahrer, 200, '2028-04-01');
    ereignis.run(2027, 3, 3, fahrer, 90, '2027-06-20');
    ereignis.run(2028, 4, 4, fahrer, 60, '2028-06-20');
    ereignis.run(2028, 5, 5, fahrer, 0, '2028-08-01');

    eintrag.run(1, 1, fahrer, 'finished');
    eintrag.run(2, 2, fahrer, 'finished');
    eintrag.run(3, 3, fahrer, 'finished');
    eintrag.run(4, 4, fahrer, 'finished');
    // Aufgabe zaehlt nicht als Renntag.
    eintrag.run(5, 5, fahrer, 'dnf');
  });

  afterEach(() => db.close());

  it('fasst gleichnamige Rennen zusammen, sortiert absteigend und laesst punktlose weg', () => {
    const payload = new RiderRepository(db).getRiderStats(fahrer);
    expect(payload).not.toBeNull();
    expect(payload!.careerPointsByRace).toEqual([
      // 100 (2027) + 200 (2028); Kategorie aus der juengsten Austragung.
      { raceName: 'Klassiker', categoryName: 'Testkategorie Eintagesrennen', points: 300, seasons: 2, seasonsRidden: 2, raceDays: 2, isStageRace: false },
      {
        raceName: 'Nationale Meisterschaft Strasse – Testland',
        categoryName: 'Testkategorie Meisterschaft',
        points: 150,
        seasons: 2,
        seasonsRidden: 2,
        raceDays: 2,
        isStageRace: false,
      },
    ]);
  });

  it('zaehlt die Renntage gleichnamiger Austragungen zusammen und laesst Aufgaben weg', () => {
    // Eine dritte Austragung von 'Klassiker', beendet, aber ohne Punkte: sie
    // erhoeht die Renntage, nicht die Punkte.
    db.prepare(`INSERT INTO races (id, name, country_id, category_id, is_stage_race, number_of_stages, start_date, end_date, prestige)
      VALUES (6, 'Klassiker', 1, 901, 0, 1, '2028-09-01', '2028-09-01', 50)`).run();
    db.prepare(`INSERT INTO stages (id, race_id, stage_number, date, profile, start_elevation, details_csv_file)
      VALUES (6, 6, 1, '2028-09-01', 'Flat', 0, 'dummy_flat_a.csv')`).run();
    db.prepare(`INSERT INTO stage_entries_flat (stage_id, race_id, team_id, rider_id, status, status_reason)
      VALUES (6, 6, 1, ?, 'finished', NULL)`).run(fahrer);

    const bilanz = new RiderRepository(db).getRiderStats(fahrer)!.careerPointsByRace;
    expect(bilanz.find((e) => e.raceName === 'Klassiker')).toMatchObject({ points: 300, raceDays: 3, seasonsRidden: 3 });
    // Das punktlose Rennen bleibt draussen, obwohl es einen Eintrag hat.
    expect(bilanz.some((e) => e.raceName === 'Punktloses Rennen')).toBe(false);
  });

  it('zaehlt bestrittene Austragungen getrennt von den Saisons mit Punkten', () => {
    // Eine vierte Austragung von 'Klassiker', gefahren und beendet, aber ohne
    // Punkte. Genau dieser Fall laesst ein Eintagesrennen mehr Renntage als
    // Punktesaisons haben — er ist richtig, nicht widerspruechlich.
    db.prepare(`INSERT INTO races (id, name, country_id, category_id, is_stage_race, number_of_stages, start_date, end_date, prestige)
      VALUES (7, 'Klassiker', 1, 901, 0, 1, '2029-04-01', '2029-04-01', 50)`).run();
    db.prepare(`INSERT INTO stages (id, race_id, stage_number, date, profile, start_elevation, details_csv_file)
      VALUES (7, 7, 1, '2029-04-01', 'Flat', 0, 'dummy_flat_a.csv')`).run();
    db.prepare(`INSERT INTO stage_entries_flat (stage_id, race_id, team_id, rider_id, status, status_reason)
      VALUES (7, 7, 1, ?, 'finished', NULL)`).run(fahrer);

    const klassiker = new RiderRepository(db).getRiderStats(fahrer)!.careerPointsByRace
      .find((e) => e.raceName === 'Klassiker');
    expect(klassiker).toMatchObject({ points: 300, raceDays: 3, seasonsRidden: 3, seasons: 2 });
  });
});
