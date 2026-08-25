import { describe, expect, it } from 'vitest';
import {
  DAILY_FORM_GC_LEADER_MAX,
  DAILY_FORM_MAX,
  DAILY_FORM_MIN,
  FATIGUE_WEIGHT,
  resolveConditionFormBonus,
  resolveFatigueMalus,
  resolveQuickSimFatigueMalus,
  sampleDailyForm,
} from '../../../frontend/src/race-sim/riderCondition';
import { createSeededRandom } from '../../../shared/rng';
import type { Rider } from '../../../shared/types';

const rider = (values: Partial<Rider>): Rider => ({
  fatigueMalus: 0,
  longTermFatigueMalus: 0,
  shortTermFatigueMalus: 0,
  formBonus: 0,
  raceFormBonus: 0,
  ...values,
} as Rider);

describe('sampleDailyForm', () => {
  it('bleibt in der Spanne -4 bis +4', () => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    const random = createSeededRandom(1);
    for (let draw = 0; draw < 20_000; draw += 1) {
      const value = sampleDailyForm(random);
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
    expect(min).toBeGreaterThanOrEqual(DAILY_FORM_MIN);
    expect(max).toBeLessThanOrEqual(DAILY_FORM_MAX);
    // Die Spanne wird auch ausgeschoepft.
    expect(min).toBeLessThan(-3.9);
    expect(max).toBeGreaterThan(3.9);
  });

  it('deckelt den Gesamtfuehrenden nach oben, nicht nach unten', () => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    const random = createSeededRandom(2);
    for (let draw = 0; draw < 20_000; draw += 1) {
      const value = sampleDailyForm(random, true);
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
    expect(max).toBeLessThanOrEqual(DAILY_FORM_GC_LEADER_MAX);
    expect(min).toBeGreaterThanOrEqual(DAILY_FORM_MIN);
    expect(min).toBeLessThan(-3.9);
  });
});

describe('resolveQuickSimFatigueMalus', () => {
  it('laesst die Rundfahrt-Ermuedung weg', () => {
    const muerbe = rider({ fatigueMalus: 12, longTermFatigueMalus: 2, shortTermFatigueMalus: 6 });
    expect(resolveFatigueMalus(muerbe)).toBeCloseTo(20 * FATIGUE_WEIGHT, 10);
    expect(resolveQuickSimFatigueMalus(muerbe)).toBeCloseTo(8 * FATIGUE_WEIGHT, 10);
  });

  it('stimmt mit der vollen Ermuedung ueberein, wenn keine Rundfahrt laeuft', () => {
    const eintagesrennen = rider({ longTermFatigueMalus: 1.5, shortTermFatigueMalus: 3 });
    expect(resolveQuickSimFatigueMalus(eintagesrennen)).toBeCloseTo(resolveFatigueMalus(eintagesrennen), 10);
  });

  it('bleibt bei einem frischen Fahrer null', () => {
    expect(resolveQuickSimFatigueMalus(rider({}))).toBe(0);
  });

  it('laesst die volle Simulation unveraendert', () => {
    // `resolveConditionFormBonus` ist der Wert der Engine — dort zaehlt die
    // Rundfahrt-Ermuedung weiterhin mit.
    const muerbe = rider({ fatigueMalus: 10, shortTermFatigueMalus: 4, formBonus: 3, raceFormBonus: 2 });
    expect(resolveConditionFormBonus(muerbe)).toBeCloseTo(5 - (14 * FATIGUE_WEIGHT), 10);
  });
});
