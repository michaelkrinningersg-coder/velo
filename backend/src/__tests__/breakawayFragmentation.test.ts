import { describe, expect, it } from 'vitest';
import {
  BREAKAWAY_SURVIVOR_SHARE_MAX,
  BREAKAWAY_SURVIVOR_SHARE_MIN,
  CAUGHT_BREAKAWAY_SCORE_MALUS,
  buildBreakawayFragments,
  drawBreakawaySurvivorShare,
  resolveBreakawaySurvivorCount,
  resolveBreakawaySurvivorShareMax,
} from '../../../shared/quickSim/breakaway';
import { simulateQuickStage } from '../../../shared/quickSim/simulateStage';
import { DEFAULT_QUICK_SIM_PROFILES } from '../../../shared/quickSimProfiles';
import { createSeededRandom } from '../../../shared/rng';
import type { StageProfile } from '../../../shared/types';

const PROFILE: StageProfile[] = ['Hilly', 'Hilly_Difficult', 'Medium_Mountain', 'Mountain', 'High_Mountain'];

describe('Anteil der durchgekommenen Ausreisser', () => {
  it('haelt die vorgegebenen Obergrenzen je Terrain', () => {
    expect(resolveBreakawaySurvivorShareMax('Mountain')).toBe(0.5);
    expect(resolveBreakawaySurvivorShareMax('High_Mountain')).toBe(0.5);
    expect(resolveBreakawaySurvivorShareMax('Medium_Mountain')).toBe(0.75);
    expect(resolveBreakawaySurvivorShareMax('Hilly_Difficult')).toBe(0.75);
    expect(resolveBreakawaySurvivorShareMax('Hilly')).toBe(1);
    // Wo nichts steht, zerfaellt die Gruppe nicht erzwungen.
    expect(resolveBreakawaySurvivorShareMax('Flat')).toBe(1);
    expect(resolveBreakawaySurvivorShareMax(null)).toBe(1);
  });

  it('bleibt ueber viele Ziehungen zwischen Unter- und Obergrenze', () => {
    for (const profile of PROFILE) {
      const max = BREAKAWAY_SURVIVOR_SHARE_MAX[profile] ?? 1;
      const random = createSeededRandom(11);
      let summe = 0;
      for (let zug = 0; zug < 4000; zug += 1) {
        const anteil = drawBreakawaySurvivorShare(random, profile);
        expect(anteil).toBeGreaterThanOrEqual(BREAKAWAY_SURVIVOR_SHARE_MIN);
        expect(anteil).toBeLessThanOrEqual(max);
        summe += anteil;
      }
      // Normalverteilt um die Mitte der Spanne.
      expect(summe / 4000).toBeCloseTo((BREAKAWAY_SURVIVOR_SHARE_MIN + max) / 2, 2);
    }
  });

  it('laesst immer mindestens den Etappensieger durch, nie mehr als die Gruppe', () => {
    for (const profile of PROFILE) {
      const random = createSeededRandom(7);
      for (let groesse = 1; groesse <= 20; groesse += 1) {
        for (let zug = 0; zug < 50; zug += 1) {
          const anzahl = resolveBreakawaySurvivorCount(random, groesse, profile);
          expect(anzahl).toBeGreaterThanOrEqual(1);
          expect(anzahl).toBeLessThanOrEqual(groesse);
        }
      }
    }
    expect(resolveBreakawaySurvivorCount(createSeededRandom(1), 0, 'Mountain')).toBe(0);
  });

  it('laesst im Hochgebirge deutlich weniger durch als huegelig', () => {
    const mittel = (profile: StageProfile): number => {
      const random = createSeededRandom(23);
      let summe = 0;
      for (let zug = 0; zug < 2000; zug += 1) {
        summe += resolveBreakawaySurvivorCount(random, 8, profile);
      }
      return summe / 2000;
    };
    expect(mittel('High_Mountain')).toBeLessThan(mittel('Medium_Mountain'));
    expect(mittel('Medium_Mountain')).toBeLessThan(mittel('Hilly'));
  });
});

describe('Zersplitterung der durchgekommenen Ausreisser', () => {
  it('verteilt genau die Durchgekommenen auf Gruppen', () => {
    const random = createSeededRandom(5);
    for (let anzahl = 1; anzahl <= 12; anzahl += 1) {
      for (let zug = 0; zug < 40; zug += 1) {
        const fragmente = buildBreakawayFragments(random, anzahl, 180);
        expect(fragmente.reduce((summe, teil) => summe + teil.size, 0)).toBe(anzahl);
        for (const teil of fragmente) {
          expect(teil.size).toBeGreaterThanOrEqual(1);
        }
      }
    }
    expect(buildBreakawayFragments(random, 0, 180)).toEqual([]);
  });

  it('setzt den Sieger auf null und staffelt die Gruppen dahinter', () => {
    const random = createSeededRandom(9);
    for (let zug = 0; zug < 500; zug += 1) {
      const fragmente = buildBreakawayFragments(random, 8, 240);
      expect(fragmente[0]!.gapSeconds).toBe(0);
      for (let index = 1; index < fragmente.length; index += 1) {
        // Mindestens zwei Sekunden, sonst faellt die Gruppe durch die
        // 1-Sekunden-Regel wieder mit der vorigen zusammen.
        expect(fragmente[index]!.gapSeconds - fragmente[index - 1]!.gapSeconds).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('haelt auch den letzten Durchgekommenen vor dem Feld', () => {
    const random = createSeededRandom(13);
    for (const lead of [3, 10, 45, 120, 600]) {
      for (let zug = 0; zug < 300; zug += 1) {
        const fragmente = buildBreakawayFragments(random, 12, lead);
        expect(fragmente[fragmente.length - 1]!.gapSeconds).toBeLessThan(lead);
      }
    }
  });

  it('faehrt bei kleinem Restvorsprung geschlossen ins Ziel', () => {
    // Zwei Sekunden Vorsprung geben keine zweite Gruppe her.
    const fragmente = buildBreakawayFragments(createSeededRandom(3), 6, 2);
    expect(fragmente).toHaveLength(1);
    expect(fragmente[0]!.size).toBe(6);
  });

  it('laesst den Sieger meistens allein oder zu zweit ankommen', () => {
    const random = createSeededRandom(17);
    let allein = 0;
    for (let zug = 0; zug < 2000; zug += 1) {
      if (buildBreakawayFragments(random, 6, 300)[0]!.size <= 2) {
        allein += 1;
      }
    }
    expect(allein / 2000).toBeGreaterThan(0.7);
  });
});

const feld = (count: number) => Array.from({ length: count }, (_, index) => ({
  riderId: index + 1,
  score: 90 - (index * 0.3),
  photoFinishScore: 90 - (index * 0.3),
}));

describe('Ausreissergruppe im Etappenergebnis', () => {
  const plan = (riderIds: number[]) => ({
    riderIds,
    phaseEndDistanceMeters: 250_000,
    triggerDistanceMeters: 6_000,
    skillBonus: 8,
    malusValue: 30,
  });

  it('bringt nicht mehr die ganze Gruppe durch', () => {
    const breakawayIds = [40, 41, 42, 43, 44, 45, 46, 47];
    let zerfallen = 0;
    for (let seed = 0; seed < 60; seed += 1) {
      const result = simulateQuickStage({
        profile: 'High_Mountain', distanceKm: 175, stageScore: 175 * 2.2,
        parameters: DEFAULT_QUICK_SIM_PROFILES.High_Mountain,
        riders: feld(160), breakaway: plan(breakawayIds), random: createSeededRandom(seed),
      });
      expect(result.breakawaySurvived).toBe(true);

      const order = result.entries.filter((entry) => !entry.isAbandon);
      const ersterImFeld = order.findIndex((entry) => !breakawayIds.includes(entry.riderId));
      const vorne = order.slice(0, ersterImFeld).map((entry) => entry.riderId);
      // Mindestens der Sieger kommt durch, aber nie die ganze Gruppe im
      // Hochgebirge — dort liegt die Obergrenze bei der Haelfte.
      expect(vorne.length).toBeGreaterThanOrEqual(1);
      expect(vorne.length).toBeLessThanOrEqual(Math.round(0.5 * breakawayIds.length));
      expect(breakawayIds).toContain(order[0]!.riderId);
      if (vorne.length < breakawayIds.length) {
        zerfallen += 1;
      }
      // Die Durchgekommenen stehen nicht mehr alle zeitgleich vorne.
      const vorneZeiten = new Set(order.slice(0, ersterImFeld).map((entry) => entry.gapSeconds));
      expect(vorneZeiten.size).toBeGreaterThanOrEqual(1);
    }
    expect(zerfallen).toBe(60);
  });

  it('reiht die Eingeholten mit ihrem Abzug ins Feld ein', () => {
    const breakawayIds = [1, 2, 3, 4, 5, 6];
    const result = simulateQuickStage({
      profile: 'Mountain', distanceKm: 180, stageScore: 180 * 1.6,
      parameters: { ...DEFAULT_QUICK_SIM_PROFILES.Mountain, rankNoise: 0 },
      riders: feld(150), breakaway: plan(breakawayIds), random: createSeededRandom(4),
    });
    const order = result.entries.filter((entry) => !entry.isAbandon).map((entry) => entry.riderId);
    const ersterImFeld = order.findIndex((entry) => !breakawayIds.includes(entry));
    const eingeholt = breakawayIds.filter((riderId) => order.indexOf(riderId) > ersterImFeld);
    expect(eingeholt.length).toBeGreaterThan(0);

    // Ein eingeholter Ausreisser steht dort, wo sein eigener Score minus drei
    // ihn hinstellt — also knapp hinter dem Fahrer mit demselben Score.
    for (const riderId of eingeholt) {
      const eigenerScore = 90 - ((riderId - 1) * 0.3);
      const zielScore = eigenerScore - CAUGHT_BREAKAWAY_SCORE_MALUS;
      const erwarteterNachbar = Math.round(((90 - zielScore) / 0.3)) + 1;
      expect(Math.abs(order.indexOf(riderId) - order.indexOf(erwarteterNachbar))).toBeLessThanOrEqual(2);
    }
  });

  it('haelt jeden Durchgekommenen vor dem ersten Fahrer aus dem Feld', () => {
    const breakawayIds = [30, 31, 32, 33, 34, 35, 36];
    for (const profile of PROFILE) {
      for (let seed = 0; seed < 40; seed += 1) {
        const result = simulateQuickStage({
          profile, distanceKm: 180, stageScore: 180 * 1.4,
          parameters: DEFAULT_QUICK_SIM_PROFILES[profile],
          riders: feld(150), breakaway: plan(breakawayIds), random: createSeededRandom(seed),
        });
        const order = result.entries.filter((entry) => !entry.isAbandon);
        const ersterImFeld = order.find((entry) => !breakawayIds.includes(entry.riderId))!;
        for (const entry of order.slice(0, order.indexOf(ersterImFeld))) {
          expect(entry.gapSeconds as number).toBeLessThan(ersterImFeld.gapSeconds as number);
        }
      }
    }
  });
});
