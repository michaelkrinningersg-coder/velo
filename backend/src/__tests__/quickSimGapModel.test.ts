import { describe, expect, it } from 'vitest';
import {
  drawLogNormalFactor,
  resolveTailGapPerKm,
  resolveTailGroupSize,
} from '../../../shared/quickSim/groupModel';
import {
  DEFAULT_QUICK_SIM_PROFILES,
  MEASURED_GAP_SIGMA_CLAMP,
  MEASURED_STAGE_GAP_MODEL,
} from '../../../shared/quickSimProfiles';
import { createSeededRandom } from '../../../shared/rng';
import type { StageProfile } from '../../../shared/types';

const ANGEPASST: StageProfile[] = ['Hilly', 'Hilly_Difficult', 'Medium_Mountain', 'Mountain', 'High_Mountain'];
const UNVERAENDERT: StageProfile[] = ['Flat', 'Rolling', 'Cobble', 'Cobble_Hill'];

/** Median von n Ziehungen, damit der Zufall die Erwartung nicht verdeckt. */
function median(werte: number[]): number {
  const sortiert = [...werte].sort((links, rechts) => links - rechts);
  return sortiert[Math.floor(sortiert.length / 2)]!;
}

function ziehungen(fn: (random: () => number) => number, anzahl = 4000): number[] {
  const random = createSeededRandom(4711);
  return Array.from({ length: anzahl }, () => fn(random));
}

describe('drawLogNormalFactor', () => {
  it('streut um 1 herum', () => {
    const werte = ziehungen((random) => drawLogNormalFactor(random, 0.4));
    expect(median(werte)).toBeCloseTo(1, 1);
  });

  it('bleibt ohne Streuung genau 1', () => {
    const werte = ziehungen((random) => drawLogNormalFactor(random, 0));
    expect(werte.every((wert) => wert === 1)).toBe(true);
  });

  it('stutzt Ausreisser auf die vereinbarte Zahl Sigma', () => {
    const sigma = 0.6;
    const grenze = Math.exp(MEASURED_GAP_SIGMA_CLAMP * sigma);
    const werte = ziehungen((random) => drawLogNormalFactor(random, sigma), 20_000);
    expect(Math.max(...werte)).toBeLessThanOrEqual(grenze + 1e-9);
    expect(Math.min(...werte)).toBeGreaterThanOrEqual((1 / grenze) - 1e-9);
  });
});

describe('resolveTailGapPerKm', () => {
  it('laesst Profile ohne Eintrag bei ihrem festen Wert', () => {
    for (const profile of UNVERAENDERT) {
      expect(MEASURED_STAGE_GAP_MODEL[profile]).toBeUndefined();
      const parameters = DEFAULT_QUICK_SIM_PROFILES[profile];
      for (const difficulty of [0.1, 0.8, 2.0]) {
        const werte = ziehungen((random) => resolveTailGapPerKm(parameters, difficulty, random, profile), 50);
        expect(werte.every((wert) => wert === parameters.tailGapPerKm)).toBe(true);
      }
    }
  });

  it('faellt ohne Profil auf den festen Wert zurueck', () => {
    const parameters = DEFAULT_QUICK_SIM_PROFILES.Mountain;
    expect(resolveTailGapPerKm(parameters, 1.7, createSeededRandom(1))).toBe(parameters.tailGapPerKm);
  });

  it('waechst mit der Schwierigkeit', () => {
    for (const profile of ANGEPASST) {
      const parameters = DEFAULT_QUICK_SIM_PROFILES[profile];
      const leicht = median(ziehungen((random) => resolveTailGapPerKm(parameters, 0.6, random, profile)));
      const schwer = median(ziehungen((random) => resolveTailGapPerKm(parameters, 2.2, random, profile)));
      expect(schwer).toBeGreaterThan(leicht);
    }
  });

  it('trifft die gemessenen Medianwerte', () => {
    // Median der 826 ausgewerteten Etappen, je Terrain bei typischer
    // Schwierigkeit. Zulaessig sind 15 Prozent Abweichung.
    const erwartet: Array<[StageProfile, number, number]> = [
      ['Hilly', 0.60, 3.92],
      ['Hilly_Difficult', 0.78, 7.03],
      ['Medium_Mountain', 1.10, 9.38],
      ['Mountain', 1.70, 11.57],
      ['High_Mountain', 2.20, 13.74],
    ];
    for (const [profile, difficulty, ziel] of erwartet) {
      const parameters = DEFAULT_QUICK_SIM_PROFILES[profile];
      const wert = median(ziehungen((random) => resolveTailGapPerKm(parameters, difficulty, random, profile)));
      expect(wert).toBeGreaterThan(ziel * 0.85);
      expect(wert).toBeLessThan(ziel * 1.15);
    }
  });

  it('streut von Etappe zu Etappe, und zwar im Gebirge weniger als im Huegel', () => {
    const spanne = (profile: StageProfile, difficulty: number): number => {
      const parameters = DEFAULT_QUICK_SIM_PROFILES[profile];
      const werte = ziehungen((random) => resolveTailGapPerKm(parameters, difficulty, random, profile)).sort((a, b) => a - b);
      return werte[Math.floor(werte.length * 0.9)]! / werte[Math.floor(werte.length * 0.1)]!;
    };
    expect(spanne('Hilly', 0.6)).toBeGreaterThan(spanne('High_Mountain', 2.2));
    expect(spanne('High_Mountain', 2.2)).toBeGreaterThan(1.2);
  });
});

describe('resolveTailGroupSize', () => {
  it('laesst Profile ohne Eintrag bei ihrem festen Wert', () => {
    for (const profile of UNVERAENDERT) {
      const parameters = DEFAULT_QUICK_SIM_PROFILES[profile];
      const werte = ziehungen((random) => resolveTailGroupSize(parameters, 1.0, random, profile), 50);
      expect(werte.every((wert) => wert === parameters.tailGroupSize)).toBe(true);
    }
  });

  it('schrumpft mit der Schwierigkeit — schwerer heisst kleinere Gruppen', () => {
    for (const profile of ANGEPASST) {
      const parameters = DEFAULT_QUICK_SIM_PROFILES[profile];
      const leicht = median(ziehungen((random) => resolveTailGroupSize(parameters, 0.6, random, profile)));
      const schwer = median(ziehungen((random) => resolveTailGroupSize(parameters, 2.2, random, profile)));
      expect(schwer).toBeLessThan(leicht);
    }
  });

  it('bleibt immer mindestens 1', () => {
    for (const profile of ANGEPASST) {
      const parameters = DEFAULT_QUICK_SIM_PROFILES[profile];
      const werte = ziehungen((random) => resolveTailGroupSize(parameters, 3.5, random, profile));
      expect(Math.min(...werte)).toBeGreaterThanOrEqual(1);
    }
  });

  it('trifft die gemessenen Medianwerte', () => {
    const erwartet: Array<[StageProfile, number, number]> = [
      ['Hilly_Difficult', 0.78, 4.78],
      ['Medium_Mountain', 1.10, 3.98],
      ['Mountain', 1.70, 3.17],
      ['High_Mountain', 2.20, 3.02],
    ];
    for (const [profile, difficulty, ziel] of erwartet) {
      const parameters = DEFAULT_QUICK_SIM_PROFILES[profile];
      const wert = median(ziehungen((random) => resolveTailGroupSize(parameters, difficulty, random, profile)));
      expect(wert).toBeGreaterThan(ziel * 0.8);
      expect(wert).toBeLessThan(ziel * 1.2);
    }
  });
});
