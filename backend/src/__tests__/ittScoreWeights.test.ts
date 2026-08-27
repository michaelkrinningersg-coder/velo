import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  ITT_HILL_MOUNTAIN_SHARE,
  ITT_TERRAIN_WEIGHTS,
  resolveIttScoreWeights,
  resolveTerrainShares,
} from '../../../shared/quickSim/ittScoreWeights';
import { resolveSkillWeightFactor } from '../../../shared/quickSim/terrainModifiers';
import { DEFAULT_QUICK_SIM_PROFILES } from '../../../shared/quickSimProfiles';
import type { StageTerrain } from '../../../shared/types';

const summe = (gewichte: Partial<Record<string, number>>): number =>
  Object.values(gewichte).reduce((wert: number, teil) => wert + (teil ?? 0), 0);

describe('Faehigkeitsgewichte eines Zeitfahrens', () => {
  it('haelt jede Terrainzeile auf Summe 1', () => {
    for (const [terrain, zeile] of Object.entries(ITT_TERRAIN_WEIGHTS)) {
      expect(summe(zeile), terrain).toBeCloseTo(1, 6);
    }
  });

  it('mittelt die Zeilen nach Kilometeranteilen und bleibt bei Summe 1', () => {
    const anteile = new Map<StageTerrain, number>([['Flat', 0.63], ['Hill', 0.37]]);
    const gewichte = resolveIttScoreWeights(anteile);
    expect(summe(gewichte)).toBeCloseTo(1, 6);
    expect(gewichte.timeTrial).toBeCloseTo(0.63 * 0.725 + 0.37 * 0.4, 6);
  });

  it('gibt dem Bergwert auf flacher Strecke nichts', () => {
    const gewichte = resolveIttScoreWeights(new Map<StageTerrain, number>([['Flat', 1]]));
    expect(gewichte.mountain ?? 0).toBe(0);
  });

  it('gibt dem Bergwert auf huegeliger Strecke etwas, aber weniger als dem Zeitfahrwert', () => {
    // Der WM-Kurs: 63 % Flat, 37 % Hill, 671 Hoehenmeter auf 40,6 km.
    const gewichte = resolveIttScoreWeights(new Map<StageTerrain, number>([['Flat', 0.63], ['Hill', 0.37]]));
    expect(gewichte.mountain).toBeCloseTo(0.37 * ITT_HILL_MOUNTAIN_SHARE, 6);
    expect(gewichte.mountain!).toBeGreaterThan(0);
    expect(gewichte.mountain!).toBeLessThan((gewichte.timeTrial ?? 0) / 4);
    expect(gewichte.hill!).toBeGreaterThan(gewichte.mountain!);
  });

  it('leitet die Kilometeranteile aus den Segmenten ab', () => {
    const anteile = resolveTerrainShares([
      { terrain: 'Flat', length_km: 12 },
      { terrain: 'Hill', length_km: 4 },
      { terrain: 'Flat', length_km: 4 },
    ]);
    expect(anteile.get('Flat')).toBeCloseTo(0.8, 6);
    expect(anteile.get('Hill')).toBeCloseTo(0.2, 6);
  });

  it('faellt ohne Anteile auf ein flaches Zeitfahren zurueck', () => {
    expect(resolveIttScoreWeights(null)).toEqual(ITT_TERRAIN_WEIGHTS.Flat);
    expect(resolveIttScoreWeights(new Map())).toEqual(ITT_TERRAIN_WEIGHTS.Flat);
  });

  it('spreizt den Faehigkeitsanteil, weil die Gewichte sich auf 1 summieren', () => {
    // Ohne den Faktor draengt die Form den Koennensanteil an die Wand: die
    // Gewichte summieren sich auf 1, die Form bleibt in voller Groesse stehen.
    expect(resolveSkillWeightFactor('ITT')).toBeGreaterThan(1.4);
  });
});

describe('ITT-Parameter der Quick Simulation', () => {
  it('stimmen mit der CSV ueberein', () => {
    const csv = fs.readFileSync(
      path.resolve(__dirname, '../../../data/csv/quick_sim_profiles.csv'), 'utf8',
    ).replace(/\r/g, '').trim().split('\n');
    const kopf = csv[0]!.split(',');
    const zeile = csv.slice(1).map((z) => z.split(',')).find((z) => z[0] === 'ITT')!;
    const wert = (spalte: string) => Number(zeile[kopf.indexOf(spalte)]);
    expect(wert('time_trial_slope')).toBeCloseTo(DEFAULT_QUICK_SIM_PROFILES.ITT.timeTrialSlope, 6);
    expect(wert('time_trial_noise')).toBeCloseTo(DEFAULT_QUICK_SIM_PROFILES.ITT.timeTrialNoise, 6);
  });
});
