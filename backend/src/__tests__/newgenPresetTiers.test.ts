import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  NEWGEN_PRESET_TIERS,
  resolveNewgenPresetTier,
  resolveNewgenPresetWeights,
  resolvePresetMidOverall,
} from '../../../shared/newgenPresetTiers';

const CSV = path.resolve(__dirname, '../../../data/csv/newgen_potential_presets.csv');

function lesePresets(): Array<Record<string, string>> {
  const zeilen = fs.readFileSync(CSV, 'utf8').replace(/\r/g, '').trim().split('\n');
  const kopf = zeilen[0]!.split(',');
  return zeilen.slice(1).map((zeile) => {
    const felder = zeile.split(',');
    const eintrag: Record<string, string> = {};
    kopf.forEach((spalte, index) => { eintrag[spalte] = felder[index] ?? ''; });
    return eintrag;
  });
}

describe('Stufen der Newgen-Presets', () => {
  it('verteilt die Zielanteile vollstaendig', () => {
    const summe = NEWGEN_PRESET_TIERS.reduce((wert, stufe) => wert + stufe.zielanteil, 0);
    expect(summe).toBeCloseTo(1, 6);
  });

  it('ordnet jede Gesamtwertung genau einer Stufe zu', () => {
    expect(resolveNewgenPresetTier(80).key).toBe('S');
    expect(resolveNewgenPresetTier(74.5).key).toBe('S');
    expect(resolveNewgenPresetTier(74.49).key).toBe('A');
    expect(resolveNewgenPresetTier(50).key).toBe('E');
  });

  it('hat in der CSV die Gewichte, die aus der Stufentabelle folgen', () => {
    const presets = lesePresets();
    const erwartet = resolveNewgenPresetWeights(presets);
    const abweichungen = erwartet
      .filter((eintrag, index) => String(eintrag.weight) !== presets[index]!['weight'])
      .map((eintrag) => `Preset ${eintrag.presetId}: erwartet ${eintrag.weight}, ist ${presets[erwartet.indexOf(eintrag)]!['weight']}`);
    expect(abweichungen).toEqual([]);
  });

  it('haelt in den gedeckelten Stufen genug Presets fuer 25 Jahre bereit', () => {
    // Rund 3900 Newgens in 25 Jahren. Ein Preset darf hoechstens dreimal
    // gleichzeitig aktiv sein; damit der Deckel nicht beisst, soll jedes Preset
    // im Schnitt nicht oefter als einmal gebraucht werden.
    const NEWGENS_25_JAHRE = 3900;
    const presets = lesePresets();
    const eingestuft = resolveNewgenPresetWeights(presets);
    for (const stufe of NEWGEN_PRESET_TIERS.filter((eintrag) => eintrag.deckel !== null)) {
      const anzahl = eingestuft.filter((eintrag) => eintrag.tier === stufe.key).length;
      const gebraucht = NEWGENS_25_JAHRE * stufe.zielanteil;
      expect(anzahl).toBeGreaterThanOrEqual(gebraucht);
    }
  });

  it('rechnet die Mitte einer Spanne als Gesamtwertung', () => {
    const gleich = Object.fromEntries(
      ['flat', 'mountain', 'medium_mountain', 'hill', 'time_trial', 'cobble', 'sprint',
        'acceleration', 'stamina', 'resistance', 'recuperation']
        .flatMap((skill) => [[`min_pot_${skill}`, 60], [`max_pot_${skill}`, 80]]),
    );
    expect(resolvePresetMidOverall(gleich)).toBeCloseTo(70, 6);
  });
});
