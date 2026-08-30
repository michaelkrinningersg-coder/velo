import { describe, expect, it, beforeEach } from 'vitest';
import type Database from 'better-sqlite3';
import { createTestDb, seedReferenceData, seedRider, seedTeams, seedGameState } from './helpers/testDb';
import { StartlistQualityService } from '../game/StartlistQualityService';
import { columnExists } from '../db/mappers';

/**
 * Absicherung der Umbauten, die das Fortschreiten beschleunigt haben.
 *
 * Alle drei sind reine Beschleunigungen — sie duerfen an keiner Stelle etwas
 * anderes liefern als vorher. Die Tests halten genau das fest.
 */

let db: Database.Database;

function legeRennen(id: number, name: string, saison: number, opts: {
  etappen?: number; kategorie?: number; rundfahrt?: boolean; tag?: string;
} = {}): void {
  const etappen = opts.etappen ?? 1;
  const start = opts.tag ?? `${saison}-07-01`;
  db.prepare(`
    INSERT INTO races (id, name, country_id, category_id, is_stage_race, number_of_stages,
      start_date, end_date, prestige)
    VALUES (?, ?, 1, ?, ?, ?, ?, ?, 80)
  `).run(id, name, opts.kategorie ?? 1, opts.rundfahrt === false ? 0 : 1, etappen, start, start);
  for (let i = 1; i <= etappen; i += 1) {
    db.prepare(`
      INSERT INTO stages (id, race_id, stage_number, date, profile, start_elevation, details_csv_file)
      VALUES (?, ?, ?, ?, 'Flat', 100, 'x.csv')
    `).run((id * 1000) + i, id, i, start);
  }
}

beforeEach(() => {
  db = createTestDb();
  seedReferenceData(db);
  seedTeams(db, { count: 3, playerTeamId: 1 });
});

/**
 * Die Sperre "wer ist heute schon gefahren" lief ueber die Sicht `all_results`.
 * Die packt bei jedem Aufruf die gesamte Archivhistorie aus — auf einem
 * Spielstand von 2033 waren das 406 ms je Rennstart. `results_flat` traegt
 * dieselben Ergebnisse flach und indiziert.
 */
describe('Sperre ueber results_flat', () => {
  it('findet dieselben Fahrer wie die Sicht all_results', () => {
    legeRennen(10, 'Vormittagsrennen', 2030, { rundfahrt: false, tag: '2030-07-01' });
    legeRennen(11, 'Nachmittagsrennen', 2030, { rundfahrt: false, tag: '2030-07-01' });
    const gefahren = seedRider(db, { id: 1, activeTeamId: 1 });
    const frisch = seedRider(db, { id: 2, activeTeamId: 1 });

    const eintrag = db.prepare(`
      INSERT INTO results (race_id, stage_id, rider_id, team_id, result_type_id, rank, time_seconds, points)
      VALUES (?, ?, ?, 1, 1, 1, 3600, 100)
    `);
    eintrag.run(10, 10001, gefahren);
    db.prepare(`
      INSERT INTO results_flat (race_id, stage_id, rider_id, team_id, result_type_id, rank, time_seconds, points)
      VALUES (?, ?, ?, 1, 1, 1, 3600, 100)
    `).run(10, 10001, gefahren);

    const frage = (quelle: string) => new Set((db.prepare(`
      SELECT DISTINCT results.rider_id AS rider_id
      FROM ${quelle} results
      JOIN stages ON stages.id = results.stage_id
      WHERE results.result_type_id = 1
        AND results.rider_id IS NOT NULL
        AND stages.date = ?
        AND stages.race_id != ?
    `).all('2030-07-01', 11) as Array<{ rider_id: number }>).map((z) => z.rider_id));

    expect(frage('results_flat')).toEqual(frage('all_results'));
    expect(frage('results_flat').has(gefahren)).toBe(true);
    expect(frage('results_flat').has(frisch)).toBe(false);
  });
});

/**
 * Die Karrierepunkte der Startlisten-Qualitaet summierten bei jedem Rennstart
 * alle Punkteereignisse. Alle Rennen desselben Tages brauchen denselben Wert.
 */
describe('Karrierepunkte je Stichtag', () => {
  it('schreibt fuer mehrere Rennen desselben Tages dieselben Werte wie einzeln gerechnet', () => {
    seedGameState(db, { date: '2030-07-01', season: 2030 });
    const fahrer = [1, 2, 3].map((id) => seedRider(db, { id, activeTeamId: 1 }));
    legeRennen(20, 'Erstes', 2030, { rundfahrt: false, tag: '2030-07-01' });
    legeRennen(21, 'Zweites', 2030, { rundfahrt: false, tag: '2030-07-01' });
    for (const [index, id] of fahrer.entries()) {
      db.prepare(`
        INSERT INTO season_point_events (season, race_id, stage_id, rider_id, team_id, award_type, rank, points_awarded, awarded_on)
        VALUES (2029, 20, 20001, ?, 1, 'one_day_result', 1, ?, '2029-05-01')
      `).run(id, 100 * (index + 1));
      db.prepare('INSERT INTO active_race_entries (race_id, team_id, rider_id) VALUES (20, 1, ?)').run(id);
      db.prepare('INSERT INTO active_race_entries (race_id, team_id, rider_id) VALUES (21, 1, ?)').run(id);
    }

    const dienst = new StartlistQualityService(db);
    expect(dienst.erfasseRennstart(20, 2030)).toBe(true);
    // Zweites Rennen, derselbe Tag: der Puffer liefert dieselbe Punktekarte.
    expect(dienst.erfasseRennstart(21, 2030)).toBe(true);

    const werte = db.prepare('SELECT race_id, score, raw_points, max_points FROM race_startlist_quality ORDER BY race_id').all() as any[];
    expect(werte).toHaveLength(2);
    expect(werte[0].raw_points).toBe(werte[1].raw_points);
    expect(werte[0].score).toBe(werte[1].score);
    expect(werte[0].raw_points).toBe(600);
  });
});

/** Der Spaltenpuffer darf nur "ja" merken — ein "nein" kann sich aendern. */
describe('Gepufferte Schemapruefung', () => {
  it('erkennt eine Spalte, die erst nachtraeglich angelegt wird', () => {
    db.prepare('CREATE TABLE probe (a INTEGER)').run();
    expect(columnExists(db, 'probe', 'b')).toBe(false);
    db.prepare('ALTER TABLE probe ADD COLUMN b INTEGER').run();
    expect(columnExists(db, 'probe', 'b')).toBe(true);
    // Und danach aus dem Puffer, mit demselben Ergebnis.
    expect(columnExists(db, 'probe', 'b')).toBe(true);
  });
});
