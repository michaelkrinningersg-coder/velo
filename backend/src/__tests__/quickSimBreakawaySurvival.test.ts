import { describe, expect, it } from 'vitest';
import {
  BREAKAWAY_SURVIVAL_EASY,
  BREAKAWAY_SURVIVAL_HARD,
  BREAKAWAY_SURVIVAL_ONE_DAY,
  resolveBaseSurvivalChance,
  resolveBreakawaySurvivalChance,
  SHORT_STAGE_RACE_FACTOR,
  SURVIVAL_JITTER,
} from '../../../shared/quickSim/breakawaySurvival';
import { createSeededRandom } from '../../../shared/rng';
import type { StageProfile } from '../../../shared/types';

const grandTour = { isStageRace: true, numberOfStages: 21 };

describe('resolveBaseSurvivalChance', () => {
  it('liest die Tabelle fuer leichtes Terrain', () => {
    for (const profile of ['Flat', 'Rolling', 'Hilly'] as StageProfile[]) {
      for (let stageNumber = 1; stageNumber <= 21; stageNumber += 1) {
        expect(resolveBaseSurvivalChance({ profile, stageNumber, ...grandTour }))
          .toBeCloseTo(BREAKAWAY_SURVIVAL_EASY[stageNumber - 1] as number, 10);
      }
    }
  });

  it('liest ab Hilly_Difficult die schwere Tabelle', () => {
    const hard: StageProfile[] = ['Hilly_Difficult', 'Medium_Mountain', 'Mountain', 'High_Mountain'];
    for (const profile of hard) {
      expect(resolveBaseSurvivalChance({ profile, stageNumber: 19, ...grandTour })).toBeCloseTo(0.4, 10);
      expect(resolveBaseSurvivalChance({ profile, stageNumber: 10, ...grandTour })).toBeCloseTo(0.055, 10);
    }
  });

  it('behandelt Pflaster wie leichtes Terrain', () => {
    for (const profile of ['Cobble', 'Cobble_Hill'] as StageProfile[]) {
      expect(resolveBaseSurvivalChance({ profile, stageNumber: 19, ...grandTour }))
        .toBeCloseTo(BREAKAWAY_SURVIVAL_EASY[18] as number, 10);
    }
  });

  it('faellt zur vorletzten Etappe hin zurueck', () => {
    // Etappe 20 ist die letzte Entscheidung — da faehrt das Feld die Gruppe
    // zurueck, obwohl Etappe 19 der Hoechstwert ist.
    expect(BREAKAWAY_SURVIVAL_EASY[19]).toBeLessThan(BREAKAWAY_SURVIVAL_EASY[18] as number);
    expect(BREAKAWAY_SURVIVAL_HARD[19]).toBeLessThan(BREAKAWAY_SURVIVAL_HARD[18] as number);
  });

  it('haelt die Etappennummer in der Tabelle', () => {
    const last = BREAKAWAY_SURVIVAL_EASY[20] as number;
    expect(resolveBaseSurvivalChance({ profile: 'Flat', stageNumber: 30, ...grandTour })).toBeCloseTo(last, 10);
    expect(resolveBaseSurvivalChance({ profile: 'Flat', stageNumber: 0, ...grandTour }))
      .toBeCloseTo(BREAKAWAY_SURVIVAL_EASY[0] as number, 10);
  });

  it('verstaerkt kurze Rundfahrten um das Zweieinhalbfache', () => {
    const long = resolveBaseSurvivalChance({ profile: 'Flat', stageNumber: 3, isStageRace: true, numberOfStages: 21 });
    const short = resolveBaseSurvivalChance({ profile: 'Flat', stageNumber: 3, isStageRace: true, numberOfStages: 5 });
    expect(short).toBeCloseTo(long * SHORT_STAGE_RACE_FACTOR, 10);
    // Genau sechs Etappen gelten nicht mehr als kurz.
    expect(resolveBaseSurvivalChance({ profile: 'Flat', stageNumber: 3, isStageRace: true, numberOfStages: 6 }))
      .toBeCloseTo(long, 10);
  });

  it('nimmt bei Eintagesrennen nur das Terrain', () => {
    for (const [profile, chance] of Object.entries(BREAKAWAY_SURVIVAL_ONE_DAY)) {
      for (const stageNumber of [1, 12, 21]) {
        expect(resolveBaseSurvivalChance({
          profile: profile as StageProfile, stageNumber, isStageRace: false, numberOfStages: 1,
        })).toBeCloseTo(chance, 10);
      }
    }
  });

  it('laesst im Zeitfahren keine Ausreisser durch', () => {
    for (const profile of ['ITT', 'TTT'] as StageProfile[]) {
      expect(resolveBaseSurvivalChance({ profile, stageNumber: 19, ...grandTour })).toBe(0);
      expect(resolveBaseSurvivalChance({ profile, stageNumber: 1, isStageRace: false, numberOfStages: 1 })).toBe(0);
    }
  });
});

describe('resolveBreakawaySurvivalChance', () => {
  it('streut jeden Wert um hoechstens 20 Prozent', () => {
    let min = Number.POSITIVE_INFINITY;
    let max = 0;
    for (let seed = 0; seed < 2000; seed += 1) {
      const chance = resolveBreakawaySurvivalChance({
        profile: 'Hilly_Difficult', stageNumber: 19, ...grandTour, random: createSeededRandom(seed),
      });
      min = Math.min(min, chance);
      max = Math.max(max, chance);
    }
    expect(min).toBeGreaterThanOrEqual(0.4 * (1 - SURVIVAL_JITTER));
    expect(max).toBeLessThanOrEqual(0.4 * (1 + SURVIVAL_JITTER));
    // Die Spanne wird auch ausgeschoepft, nicht nur eingehalten.
    expect(min).toBeLessThan(0.33);
    expect(max).toBeGreaterThan(0.47);
  });

  it('trifft im Mittel den Tabellenwert', () => {
    let sum = 0;
    const runs = 5000;
    for (let seed = 0; seed < runs; seed += 1) {
      sum += resolveBreakawaySurvivalChance({
        profile: 'Flat', stageNumber: 15, ...grandTour, random: createSeededRandom(seed),
      });
    }
    expect(sum / runs).toBeCloseTo(0.105, 3);
  });

  it('bleibt bei Wahrscheinlichkeit null ohne Ziehung', () => {
    expect(resolveBreakawaySurvivalChance({
      profile: 'ITT', stageNumber: 5, ...grandTour, random: () => 0.99,
    })).toBe(0);
  });
});
