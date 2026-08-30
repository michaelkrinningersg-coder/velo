import { describe, expect, it, beforeEach } from 'vitest';
import type Database from 'better-sqlite3';
import { createTestDb, seedReferenceData, seedTeams, seedGameState } from './helpers/testDb';
import { DatabaseService } from '../db/DatabaseService';

/**
 * `race_results_compact` ist keine Ergebnisablage mehr, sondern nur noch die
 * Markierung "dieses Rennen ist abgeschlossen". Alle Spielabfragen lesen
 * `results_flat`; der JSON-Blob wird nur noch geschrieben.
 *
 * Zwei Stellen leeren ihn: der Saisonwechsel (advanceDay) fuer die abgelaufene
 * Saison, und `leereAlteErgebnisPayloads` einmalig beim Laden bestehender
 * Spielstaende. Die Tests halten fest, was dabei gelten muss — vor allem, dass
 * die ZEILE stehen bleibt.
 */
describe('Ergebnis-Payloads leeren', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 2, playerTeamId: 1 });
    seedGameState(db, { date: '2032-06-01', season: 2032 });
    db.prepare(`INSERT INTO race_categories_bonus (id, name, bonus_seconds_final, points_one_day, points_gc_final, points_stage, points_sprint_finish)
      VALUES (1, 'B', '10|6|4', '25|20|15|10', '50|30|20', '25|20|15|10', '25|20|15|10')`).run();
    db.prepare(`INSERT INTO race_categories (id, name, tier, number_of_teams, number_of_riders, bonus_system_id, home_selection_probability)
      VALUES (1, 'Cat', 1, 2, 4, 1, 0.0)`).run();
    for (const [id, saison] of [[1, 2030], [2, 2031], [3, 2032]] as const) {
      db.prepare(`INSERT INTO races (id, name, country_id, category_id, is_stage_race, number_of_stages, start_date, end_date, prestige)
        VALUES (?, ?, 1, 1, 0, 1, ?, ?, 50)`).run(id, 'Rennen ' + saison, `${saison}-05-01`, `${saison}-05-01`);
      db.prepare(`INSERT INTO stages (id, race_id, stage_number, date, profile, start_elevation, details_csv_file)
        VALUES (?, ?, 1, ?, 'Flat', 0, 'x.csv')`).run(id * 10, id, `${saison}-05-01`);
      db.prepare(`INSERT INTO race_results_compact (race_id, season, payload) VALUES (?, ?, ?)`)
        .run(id, saison, JSON.stringify({ type1: [[id * 10, 7, 1, 1, 10000, 25, 0, null, null, null, null, null]] }));
    }
  });

  it('leert abgeschlossene Saisons, laesst die laufende stehen und behaelt jede Zeile', () => {
    new DatabaseService().applySchemaTo(db);

    const zeilen = db.prepare('SELECT race_id, season, payload FROM race_results_compact ORDER BY race_id')
      .all() as Array<{ race_id: number; season: number; payload: string }>;

    // Die Markierung bleibt fuer jedes Rennen erhalten — daran erkennt
    // ensureStageCanBeSimulated ein bereits gefahrenes Rennen.
    expect(zeilen.map((z) => z.race_id)).toEqual([1, 2, 3]);
    expect(zeilen[0]!.payload).toBe('{}');
    expect(zeilen[1]!.payload).toBe('{}');
    // Die laufende Saison bleibt vollstaendig: ihre Payloads liest
    // backfillSeasonWinsV2 beim Laden alter Spielstaende.
    expect(JSON.parse(zeilen[2]!.payload).type1).toHaveLength(1);
  });

  it('laeuft nur einmal und ruehrt spaeter geschriebene Payloads nicht an', () => {
    new DatabaseService().applySchemaTo(db);

    // Ein Rennen der inzwischen abgelaufenen Saison 2031 wird neu kompaktiert.
    db.prepare(`UPDATE race_results_compact SET payload = ? WHERE race_id = 2`)
      .run(JSON.stringify({ type1: [[20, 9, 2, 1, 9000, 25, 0, null, null, null, null, null]] }));

    new DatabaseService().applySchemaTo(db);

    const payload = (db.prepare('SELECT payload FROM race_results_compact WHERE race_id = 2')
      .get() as { payload: string }).payload;
    expect(JSON.parse(payload).type1).toHaveLength(1);
  });

  it('die Sicht all_results vertraegt leere Payloads', () => {
    new DatabaseService().applySchemaTo(db);

    // json_each auf '{}' liefert null Zeilen statt eines Fehlers — die Sicht
    // bleibt also benutzbar, sie liefert fuer geleerte Saisons nur nichts mehr.
    const anzahl = (db.prepare('SELECT COUNT(*) AS n FROM all_results').get() as { n: number }).n;
    expect(anzahl).toBe(1);
  });
});
