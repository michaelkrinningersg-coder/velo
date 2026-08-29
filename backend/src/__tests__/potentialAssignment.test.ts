import { describe, expect, it } from 'vitest';
import type Database from 'better-sqlite3';
import { createTestDb, seedReferenceData, seedGameState } from './helpers/testDb';
import { POT_PRESET_SKILL_COLUMNS } from '../../../shared/newgenPresetTiers';
import {
  istPresetVertraeglich,
  waehlePreset,
  ziehePotenziale,
  type PresetSpanne,
} from '../../../shared/potentialAssignment';
import { calcRiderOverall } from '../../../shared/riderOverall';
import { PotentialAssignmentService } from '../game/PotentialAssignmentService';

/**
 * Bestandsfahrer aus `riders.csv` bringen nur ihre Faehigkeiten mit; ihre
 * Potenziale entstanden bisher aus einer Formel ohne Profilbezug und passten
 * deshalb in kein Preset. Jetzt werden sie aus einem vertraeglichen Preset
 * gezogen — mit der harten Regel, dass kein Potenzial unter dem heutigen
 * Koennen liegen darf.
 */

const SP = [...POT_PRESET_SKILL_COLUMNS];

function spanne(name: string, min: number, max: number, weight = 1): PresetSpanne {
  const mitte = (min + max) / 2;
  return {
    displayName: name, weight,
    // Alle Skills gleich, also ist die Gesamtwertung genau die Mitte.
    midOverall: calcRiderOverall(Object.fromEntries(
      ['flat','mountain','mediumMountain','hill','timeTrial','prologue','cobble','sprint',
       'acceleration','downhill','attack','stamina','resistance','recuperation','bikeHandling']
        .map((k) => [k, mitte]),
    ) as never),
    min: Object.fromEntries(SP.map((s) => [s, min])),
    max: Object.fromEntries(SP.map((s) => [s, max])),
  };
}
const skillsMit = (wert: number) => Object.fromEntries(SP.map((s) => [s, wert]));

describe('Zuordnung der Potenziale', () => {
  it('nimmt nur Presets, die jeden Skill mindestens halten koennen', () => {
    const skills = { ...skillsMit(60), sprint: 78 };
    expect(istPresetVertraeglich(spanne('weit', 50, 80), skills, SP)).toBe(true);
    // Die Obergrenze fuer Sprint liegt unter dem heutigen Wert.
    expect(istPresetVertraeglich(spanne('eng', 50, 70), skills, SP)).toBe(false);
  });

  it('zieht nie unter das heutige Koennen, auch nicht bei gebrochenen Werten', () => {
    const skills = { ...skillsMit(66.4), mountain: 71.8 };
    for (const wuerfel of [0, 0.5, 0.999999]) {
      const pot = ziehePotenziale(spanne('p', 50, 75), skills, SP, () => wuerfel);
      for (const s of SP) expect(pot[s]!).toBeGreaterThanOrEqual(skills[s] ?? 0);
      expect(pot['mountain']!).toBeLessThanOrEqual(75);
    }
  });

  it('bleibt innerhalb des Presets und unter dem Maximum von 85', () => {
    const pot = ziehePotenziale(spanne('hoch', 80, 95), skillsMit(60), SP, () => 0.999999);
    for (const s of SP) expect(pot[s]!).toBeLessThanOrEqual(85);
  });

  it('gewichtet die Auswahl und liefert ohne Kandidaten nichts', () => {
    const kandidaten = [spanne('selten', 50, 70, 1), spanne('haeufig', 50, 70, 9)];
    expect(waehlePreset(kandidaten, () => 0.01)?.displayName).toBe('selten');
    expect(waehlePreset(kandidaten, () => 0.5)?.displayName).toBe('haeufig');
    expect(waehlePreset([], () => 0.5)).toBeNull();
  });
});

function aufbau(): Database.Database {
  const db = createTestDb();
  seedReferenceData(db);
  seedGameState(db, { date: '2027-01-01', season: 2027 });
  db.prepare('DELETE FROM newgen_potential_presets').run();
  const spalten = ['preset_id', 'display_name', 'weight',
    ...SP.flatMap((s) => [`min_pot_${s}`, `max_pot_${s}`])];
  db.prepare(`INSERT INTO newgen_potential_presets (${spalten.join(', ')})
    VALUES (${spalten.map(() => '?').join(', ')})`)
    .run(1, 'Testpreset', 1, ...SP.flatMap(() => [60, 72]));
  return db;
}

function legeFahrer(db: Database.Database, id: number, skill: number, geboren: number, peak: number): void {
  const spalten = ['id', 'first_name', 'last_name', 'country_id', 'birth_year', 'is_retired',
    'rider_type_id', 'overall_rating', 'pot_overall', 'peak_age',
    ...SP.map((s) => `skill_${s}`), ...SP.map((s) => `pot_${s}`)];
  db.prepare(`INSERT INTO riders (${spalten.join(', ')}) VALUES (${spalten.map(() => '?').join(', ')})`)
    .run(id, 'Test', `Fahrer${id}`, 1, geboren, 0, 1, skill, skill + 9, peak,
      ...SP.map(() => skill), ...SP.map(() => skill + 9));
}

describe('Daempfung fuer Fahrer ohne Vertrag', () => {
  it('zieht die Auswahl zu Presets nahe dem heutigen Koennen', () => {
    const nah = spanne('nah', 60, 70);      // Mitte 65
    const fern = spanne('fern', 78, 84);    // Mitte 81
    // Ohne Naehe entscheidet allein das Gewicht — beide sind gleich schwer,
    // die Ziehung bei 0,9 landet auf dem zweiten.
    expect(waehlePreset([nah, fern], () => 0.9)?.displayName).toBe('fern');
    // Mit Naehe zu einem Koennen von 65 faellt das ferne Preset stark ab.
    expect(waehlePreset([nah, fern], () => 0.9, 65)?.displayName).toBe('nah');
  });

  it('bevorzugt kein Preset unterhalb des Koennens', () => {
    // Ein Fahrer, der schon ueber der Mitte beider Presets liegt, soll nicht
    // kuenstlich klein gehalten werden: beide werden gleich behandelt.
    const a = spanne('a', 60, 70);
    const b = spanne('b', 62, 72);
    const ohne = waehlePreset([a, b], () => 0.9)?.displayName;
    expect(waehlePreset([a, b], () => 0.9, 85)?.displayName).toBe(ohne);
  });

  it('neigt die Ziehung zum unteren Rand, ohne die Spanne zu verlassen', () => {
    const preset = spanne('p', 60, 80);
    const skills = skillsMit(60);
    let gleich = 0;
    let geneigt = 0;
    for (let i = 1; i <= 200; i++) {
      const wuerfel = () => i / 201;
      gleich += ziehePotenziale(preset, skills, SP, wuerfel)['flat']!;
      const wert = ziehePotenziale(preset, skills, SP, wuerfel, 1.5)['flat']!;
      geneigt += wert;
      expect(wert).toBeGreaterThanOrEqual(60);
      expect(wert).toBeLessThanOrEqual(80);
    }
    expect(geneigt).toBeLessThan(gleich);
  });
});

describe('Einmaliger Lauf am Bestand', () => {
  it('setzt am Zielalter das Potenzial auf das Koennen und vergibt kein Preset', () => {
    const db = aufbau();
    legeFahrer(db, 1, 65, 1995, 26); // 32 Jahre, Zielalter 26 laengst durch
    new PotentialAssignmentService(db).weiseZu(2027, () => 0.5);

    const zeile = db.prepare('SELECT pot_flat, skill_flat, pot_overall, overall_rating, pot_preset_key FROM riders WHERE id = 1').get() as any;
    expect(zeile.pot_flat).toBe(zeile.skill_flat);
    expect(zeile.pot_overall).toBeCloseTo(zeile.overall_rating, 6);
    expect(zeile.pot_preset_key).toBeNull();
    db.close();
  });

  it('zieht vor dem Zielalter aus einem Preset und merkt es sich', () => {
    const db = aufbau();
    legeFahrer(db, 2, 65, 2005, 26); // 22 Jahre
    new PotentialAssignmentService(db).weiseZu(2027, () => 0.5);

    const zeile = db.prepare('SELECT pot_flat, skill_flat, pot_preset_key FROM riders WHERE id = 2').get() as any;
    expect(zeile.pot_preset_key).toBe('Testpreset');
    expect(zeile.pot_flat).toBeGreaterThanOrEqual(zeile.skill_flat);
    expect(zeile.pot_flat).toBeLessThanOrEqual(72);
    db.close();
  });

  it('laesst einen Fahrer unberuehrt, zu dem kein Preset passt', () => {
    const db = aufbau();
    legeFahrer(db, 3, 76, 2005, 26); // staerker als jede Obergrenze des Presets
    const bericht = new PotentialAssignmentService(db).weiseZu(2027, () => 0.5);

    expect(bericht?.ohnePreset).toBe(1);
    const zeile = db.prepare('SELECT pot_flat, pot_preset_key FROM riders WHERE id = 3').get() as any;
    expect(zeile.pot_preset_key).toBeNull();
    expect(zeile.pot_flat).toBe(85); // unveraendert aus der Fixture
    db.close();
  });

  it('laeuft nur einmal — ein zweiter Lauf wuerfelt nicht neu', () => {
    const db = aufbau();
    legeFahrer(db, 4, 65, 2005, 26);
    const dienst = new PotentialAssignmentService(db);
    expect(dienst.wurdeAusgefuehrt()).toBe(false);
    dienst.weiseZu(2027, () => 0.5);
    expect(dienst.wurdeAusgefuehrt()).toBe(true);
    db.close();
  });

  it('haelt den Deckel eines Spitzen-Presets ein', () => {
    const db = aufbau();
    // Das Testpreset auf Spitzenniveau heben, damit ein Deckel greift.
    db.prepare('DELETE FROM newgen_potential_presets').run();
    const spalten = ['preset_id', 'display_name', 'weight', ...SP.flatMap((s) => [`min_pot_${s}`, `max_pot_${s}`])];
    db.prepare(`INSERT INTO newgen_potential_presets (${spalten.join(', ')})
      VALUES (${spalten.map(() => '?').join(', ')})`)
      .run(1, 'Spitzenpreset', 1, ...SP.flatMap(() => [80, 85]));
    for (let i = 10; i < 20; i++) legeFahrer(db, i, 70, 2005, 26);

    new PotentialAssignmentService(db).weiseZu(2027, () => 0.5);
    const n = (db.prepare("SELECT COUNT(*) n FROM riders WHERE pot_preset_key = 'Spitzenpreset'").get() as any).n;
    // Zehn Kandidaten, aber der Deckel der Spitzenstufe laesst nur wenige zu.
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThan(10);
    db.close();
  });
});

describe('Deckel waehrend des einmaligen Laufs', () => {
  it('setzt hoechstens einen Fahrer je Spitzen-Preset', () => {
    const db = createTestDb();
    seedReferenceData(db);
    seedGameState(db, { date: '2027-01-01', season: 2027 });
    db.prepare('DELETE FROM newgen_potential_presets').run();
    const spalten = ['preset_id', 'display_name', 'weight', ...SP.flatMap((s) => [`min_pot_${s}`, `max_pot_${s}`])];
    // Spitzenniveau: die Stufe traegt einen Deckel von drei.
    db.prepare(`INSERT INTO newgen_potential_presets (${spalten.join(', ')})
      VALUES (${spalten.map(() => '?').join(', ')})`)
      .run(1, 'Spitzenpreset', 1, ...SP.flatMap(() => [80, 85]));
    for (let i = 30; i < 40; i++) legeFahrer(db, i, 70, 2005, 26);

    new PotentialAssignmentService(db).weiseZu(2027, () => 0.5);
    const n = (db.prepare("SELECT COUNT(*) n FROM riders WHERE pot_preset_key = 'Spitzenpreset'").get() as any).n;
    // Der Deckel der Stufe waere drei — dieser Lauf nimmt nur einen und laesst
    // den Rest fuer kuenftige Newgen-Jahrgaenge frei.
    expect(n).toBe(1);
    db.close();
  });
});
