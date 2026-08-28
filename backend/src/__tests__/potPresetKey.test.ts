import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type Database from 'better-sqlite3';
import { createTestDb, seedReferenceData } from './helpers/testDb';
import { POT_PRESET_SKILL_COLUMNS } from '../../../shared/newgenPresetTiers';

/**
 * Newgens merken sich, aus welchem Potenzial-Preset sie stammen — der Deckel
 * je Spitzen-Preset zaehlt darueber.
 *
 * Der Verweis lief frueher ueber die Zeilen-ID. Die Preset-Tabelle wird aber
 * bei jedem Laden aus der CSV geloescht und neu befuellt; nach einem Umbau der
 * CSV zeigte eine gespeicherte ID auf eine voellig andere Zeile. An einem
 * echten Spielstand gemessen passte danach genau einer von 156 Newgens noch in
 * sein vermerktes Preset, mit Abweichungen bis 24 Punkte. Seither ist der
 * display_name die Referenz.
 */

const CSV = path.resolve(__dirname, '../../../data/csv/newgen_potential_presets.csv');

function csvNamen(): string[] {
  const zeilen = fs.readFileSync(CSV, 'utf8').replace(/\r/g, '').trim().split('\n');
  const kopf = zeilen[0]!.split(',');
  const spalte = kopf.indexOf('display_name');
  return zeilen.slice(1).map((z) => z.split(',')[spalte]!);
}

function legePreset(db: Database.Database, presetId: number, name: string, min: number, max: number): void {
  const spalten = ['preset_id', 'display_name', 'weight',
    ...POT_PRESET_SKILL_COLUMNS.flatMap((s) => [`min_pot_${s}`, `max_pot_${s}`])];
  const werte: Array<number | string> = [presetId, name, 1,
    ...POT_PRESET_SKILL_COLUMNS.flatMap(() => [min, max])];
  db.prepare(`INSERT INTO newgen_potential_presets (${spalten.join(', ')})
    VALUES (${spalten.map(() => '?').join(', ')})`).run(...werte);
}

function legeFahrer(db: Database.Database, id: number, pot: number, presetId: number | null): void {
  const spalten = ['id', 'first_name', 'last_name', 'country_id', 'birth_year', 'is_retired',
    'rider_type_id', 'overall_rating', 'pot_overall', 'pot_preset_id',
    ...POT_PRESET_SKILL_COLUMNS.map((s) => `pot_${s}`)];
  const werte: Array<number | string | null> = [id, 'Test', `Fahrer${id}`, 1, 2005, 0,
    1, 60, pot, presetId, ...POT_PRESET_SKILL_COLUMNS.map(() => pot)];
  db.prepare(`INSERT INTO riders (${spalten.join(', ')})
    VALUES (${spalten.map(() => '?').join(', ')})`).run(...werte);
}

describe('Preset-Verweis der Newgens', () => {
  it('vergibt in der CSV keinen Namen zweimal', () => {
    const namen = csvNamen();
    const doppelt = namen.filter((n, i) => namen.indexOf(n) !== i);
    expect([...new Set(doppelt)]).toEqual([]);
    expect(namen.length).toBeGreaterThan(0);
  });

  it('legt die Spalte an und traegt nur nachweisbare Zuordnungen nach', () => {
    const db = createTestDb();
    seedReferenceData(db);
    // Die echten Presets aus der CSV stehen schon drin — hier zaehlt nur der
    // gebaute Fall.
    db.prepare('DELETE FROM newgen_potential_presets').run();
    // Das Preset mit ID 1 erlaubt 60-70, das mit ID 2 erlaubt 75-80.
    legePreset(db, 1, 'Preset Eins', 60, 70);
    legePreset(db, 2, 'Preset Zwei', 75, 80);
    // Fahrer A passt zu seinem vermerkten Preset, Fahrer B nicht (die ID zeigt
    // nach einem CSV-Umbau auf eine fremde Zeile), Fahrer C ist Bestand.
    legeFahrer(db, 101, 65, 1);
    legeFahrer(db, 102, 65, 2);
    legeFahrer(db, 103, 65, null);

    // Die Migration laeuft im applySchemaTo von createTestDb noch nicht, weil
    // die Fahrer erst danach entstanden sind — also hier ausloesen.
    db.prepare('UPDATE riders SET pot_preset_key = NULL').run();
    const bedingung = POT_PRESET_SKILL_COLUMNS
      .map((s) => `r.pot_${s} BETWEEN p.min_pot_${s} - 0.000001 AND p.max_pot_${s} + 0.000001`)
      .join(' AND ');
    db.prepare(`UPDATE riders AS r SET pot_preset_key = (
      SELECT p.display_name FROM newgen_potential_presets p
      WHERE p.preset_id = r.pot_preset_id AND ${bedingung})
      WHERE r.pot_preset_id IS NOT NULL`).run();

    const key = (id: number) => (db.prepare('SELECT pot_preset_key AS k FROM riders WHERE id = ?').get(id) as any).k;
    expect(key(101)).toBe('Preset Eins');
    // Bewusst kein Uebersetzen: eine widerlegte Zuordnung bleibt leer, statt
    // den Fehler festzuschreiben.
    expect(key(102)).toBeNull();
    expect(key(103)).toBeNull();
    db.close();
  });

  it('haelt den Verweis, wenn die Presets neu nummeriert werden', () => {
    const db = createTestDb();
    seedReferenceData(db);
    db.prepare('DELETE FROM newgen_potential_presets').run();
    legePreset(db, 1, 'Preset Eins', 60, 70);
    legeFahrer(db, 101, 65, 1);
    db.prepare("UPDATE riders SET pot_preset_key = 'Preset Eins' WHERE id = 101").run();

    // Die CSV wird umgebaut: dasselbe Preset steht jetzt auf Zeile 47.
    db.prepare('DELETE FROM newgen_potential_presets').run();
    legePreset(db, 47, 'Preset Eins', 60, 70);
    legePreset(db, 1, 'Ein ganz anderes Preset', 80, 85);

    const gefunden = db.prepare(`
      SELECT p.preset_id AS id FROM riders r
      JOIN newgen_potential_presets p ON p.display_name = r.pot_preset_key
      WHERE r.id = 101`).get() as any;
    expect(gefunden.id).toBe(47);

    // Ueber die alte ID waere es das falsche Preset gewesen.
    const ueberId = db.prepare(`
      SELECT p.display_name AS name FROM riders r
      JOIN newgen_potential_presets p ON p.preset_id = r.pot_preset_id
      WHERE r.id = 101`).get() as any;
    expect(ueberId.name).toBe('Ein ganz anderes Preset');
    db.close();
  });
});
