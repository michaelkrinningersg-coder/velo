import { describe, expect, it } from 'vitest';
import {
  applyGroupProtection,
  MAX_PROTECTED_SHARE,
  PROTECTION_STRENGTH,
} from '../../../shared/quickSim/groupProtection';
import type { FinishGroup } from '../../../shared/quickSim/groupModel';
import { createSeededRandom } from '../../../shared/rng';

/** Vier Gruppen zu je zehn Fahrern, Index 0 ist der staerkste. */
function groups(): FinishGroup[] {
  return Array.from({ length: 4 }, (_, index) => ({
    memberIndices: Array.from({ length: 10 }, (_, offset) => (index * 10) + offset),
    gapSeconds: index * 30,
  }));
}

const memberCount = (result: FinishGroup[]): number =>
  result.reduce((sum, group) => sum + group.memberIndices.length, 0);

describe('applyGroupProtection', () => {
  it('holt geschuetzte Fahrer in die erste Gruppe', () => {
    const result = applyGroupProtection({
      groups: groups(),
      profile: 'Flat',
      protectedIndices: new Set([31, 32]),
      random: createSeededRandom(1),
    });
    expect(result[0]!.memberIndices).toContain(31);
    expect(result[0]!.memberIndices).toContain(32);
  });

  it('haelt das Kontingent von einem Viertel je Gruppe ein', () => {
    // Zehn geschuetzte Fahrer wollen in eine Gruppe von zehn — hoechstens
    // zwei duerfen hinein, der Rest kommt bei Gruppe 2 erneut in Frage.
    const result = applyGroupProtection({
      groups: groups(),
      profile: 'Flat',
      protectedIndices: new Set(Array.from({ length: 10 }, (_, index) => 30 + index)),
      random: createSeededRandom(2),
    });
    const inFirst = result[0]!.memberIndices.filter((index) => index >= 30).length;
    expect(inFirst).toBeLessThanOrEqual(Math.floor(10 * MAX_PROTECTED_SHARE));
  });

  it('verliert keinen Fahrer', () => {
    for (let seed = 0; seed < 30; seed += 1) {
      const result = applyGroupProtection({
        groups: groups(),
        profile: 'Flat',
        protectedIndices: new Set([25, 31, 32, 38]),
        random: createSeededRandom(seed),
      });
      expect(memberCount(result)).toBe(40);
      const all = result.flatMap((group) => group.memberIndices).sort((a, b) => a - b);
      expect(new Set(all).size).toBe(40);
    }
  });

  it('haengt in etwa der Haelfte der Faelle an und tauscht sonst', () => {
    // Anhaengen macht die erste Gruppe groesser, Tauschen laesst sie gleich.
    let grown = 0;
    const runs = 300;
    for (let seed = 0; seed < runs; seed += 1) {
      const result = applyGroupProtection({
        groups: groups(),
        profile: 'Flat',
        protectedIndices: new Set([35]),
        random: createSeededRandom(seed),
      });
      if (result[0]!.memberIndices.length > 10) {
        grown += 1;
      }
    }
    expect(grown / runs).toBeGreaterThan(0.4);
    expect(grown / runs).toBeLessThan(0.6);
  });

  it('wirkt huegelig schwaecher und schwer-huegelig noch schwaecher', () => {
    const anteil = (profile: 'Flat' | 'Hilly' | 'Hilly_Difficult'): number => {
      let promoted = 0;
      const runs = 400;
      for (let seed = 0; seed < runs; seed += 1) {
        const result = applyGroupProtection({
          groups: groups(),
          profile,
          protectedIndices: new Set([35]),
          random: createSeededRandom(seed),
        });
        if (result[0]!.memberIndices.includes(35)) {
          promoted += 1;
        }
      }
      return promoted / runs;
    };
    const flat = anteil('Flat');
    const hilly = anteil('Hilly');
    const schwer = anteil('Hilly_Difficult');
    expect(flat).toBeGreaterThan(hilly);
    expect(hilly).toBeGreaterThan(schwer);
    expect(flat).toBeCloseTo(PROTECTION_STRENGTH.Flat as number, 1);
    expect(hilly).toBeCloseTo(PROTECTION_STRENGTH.Hilly as number, 1);
  });

  it('ruehrt Bergetappen nicht an', () => {
    for (const profile of ['Mountain', 'High_Mountain', 'Medium_Mountain', 'Cobble'] as const) {
      const result = applyGroupProtection({
        groups: groups(),
        profile,
        protectedIndices: new Set([31, 32, 33]),
        random: createSeededRandom(3),
      });
      expect(result[0]!.memberIndices).toEqual(groups()[0]!.memberIndices);
    }
  });

  it('haelt die Score-Reihenfolge innerhalb der Gruppen', () => {
    const result = applyGroupProtection({
      groups: groups(),
      profile: 'Rolling',
      protectedIndices: new Set([31, 35, 39]),
      random: createSeededRandom(4),
    });
    for (const group of result) {
      expect(group.memberIndices).toEqual([...group.memberIndices].sort((a, b) => a - b));
    }
  });

  it('macht nichts ohne geschuetzte Fahrer oder bei einer einzigen Gruppe', () => {
    const unveraendert = applyGroupProtection({
      groups: groups(), profile: 'Flat', protectedIndices: new Set(), random: createSeededRandom(5),
    });
    expect(unveraendert).toEqual(groups());

    const einzeln: FinishGroup[] = [{ memberIndices: [0, 1, 2], gapSeconds: 0 }];
    expect(applyGroupProtection({
      groups: einzeln, profile: 'Flat', protectedIndices: new Set([2]), random: createSeededRandom(6),
    })).toEqual(einzeln);
  });

  it('laesst keine leere Gruppe zurueck', () => {
    // Eine Gruppe aus lauter geschuetzten Fahrern wird komplett aufgeloest.
    const zwei: FinishGroup[] = [
      { memberIndices: [0, 1, 2, 3, 4, 5, 6, 7], gapSeconds: 0 },
      { memberIndices: [8], gapSeconds: 60 },
    ];
    const result = applyGroupProtection({
      groups: zwei, profile: 'Flat', protectedIndices: new Set([8]), random: createSeededRandom(7),
    });
    expect(result.every((group) => group.memberIndices.length > 0)).toBe(true);
    expect(memberCount(result)).toBe(9);
  });
});
