import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  NEWGEN_PRESET_RULES,
  describeNewgenPresetViolation,
  findNewgenPresetViolations,
} from '../../../shared/newgenPresetRules';

const CSV = path.resolve(__dirname, '../../../data/csv/newgen_potential_presets.csv');

function lesePresets(): Array<Record<string, number | string>> {
  const zeilen = fs.readFileSync(CSV, 'utf8').replace(/\r/g, '').trim().split('\n');
  const kopf = zeilen[0]!.split(',');
  return zeilen.slice(1).map((zeile) => {
    const felder = zeile.split(',');
    const eintrag: Record<string, number | string> = {};
    kopf.forEach((spalte, index) => {
      const roh = felder[index] ?? '';
      eintrag[spalte] = /^-?\d+(\.\d+)?$/.test(roh) ? Number(roh) : roh;
    });
    return eintrag;
  });
}

describe('Newgen-Potenzial-Presets', () => {
  it('haelt alle Vertraeglichkeitsregeln ein', () => {
    const verstoesse = findNewgenPresetViolations(lesePresets());
    expect(verstoesse.map(describeNewgenPresetViolation)).toEqual([]);
  });

  it('haelt min_pot niemals ueber max_pot', () => {
    const presets = lesePresets();
    const skills = Object.keys(presets[0]!)
      .filter((spalte) => spalte.startsWith('min_pot_'))
      .map((spalte) => spalte.slice('min_pot_'.length));
    const kaputt: string[] = [];
    for (const preset of presets) {
      for (const skill of skills) {
        if (Number(preset[`max_pot_${skill}`]) < Number(preset[`min_pot_${skill}`])) {
          kaputt.push(`Preset ${preset['preset_id']}: ${skill}`);
        }
      }
    }
    expect(kaputt).toEqual([]);
  });

  it('erkennt einen Regelbruch', () => {
    const verstoesse = findNewgenPresetViolations([
      { preset_id: 99, max_pot_mountain: 84, max_pot_sprint: 84 },
    ]);
    // Berg 84 und Sprint 84 brechen beide Richtungen: Regel 1 (Berg deckelt
    // den Sprint) und Regel 5 (Sprint deckelt den Berg).
    expect(verstoesse).toHaveLength(2);
    expect(verstoesse[0]!.regel).toEqual(NEWGEN_PRESET_RULES[0]);
    expect(verstoesse[1]!.regel).toEqual(NEWGEN_PRESET_RULES[4]);
  });
});
