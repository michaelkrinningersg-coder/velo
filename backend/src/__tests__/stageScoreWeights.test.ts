import { describe, expect, it } from 'vitest';
import {
  PROFILE_SCORE_WEIGHTS,
  STAGE_RACE_SCORE_WEIGHTS,
  resolveStageScoreWeights,
  resolveStaminaWeight,
} from '../../../frontend/src/race-sim/stageScoreWeights';
import type { StageProfile } from '../../../shared/types';

const ALLE_PROFILE: StageProfile[] = [
  'Flat', 'Rolling', 'Hilly', 'Hilly_Difficult', 'Medium_Mountain',
  'Mountain', 'High_Mountain', 'Cobble', 'Cobble_Hill', 'ITT', 'TTT',
];

const summe = (w: Record<string, number | undefined>): number =>
  Object.values(w).reduce<number>((acc, value) => acc + (value ?? 0), 0);

describe('Ausdauergewicht', () => {
  it('greift erst ab 120 Kilometern', () => {
    expect(resolveStaminaWeight(0)).toBe(0);
    expect(resolveStaminaWeight(120)).toBe(0);
    expect(resolveStaminaWeight(90)).toBe(0);
  });

  it('waechst nur noch halb so schnell wie zuvor', () => {
    // Vorher `(km - 120) / 240`, jetzt die halbe Steigung.
    expect(resolveStaminaWeight(190)).toBeCloseTo(70 / 480, 10);
    expect(resolveStaminaWeight(240)).toBeCloseTo(0.25, 10);
    expect(resolveStaminaWeight(300)).toBeCloseTo(0.375, 10);
    expect(resolveStaminaWeight(190)).toBeCloseTo(((190 - 120) / 240) / 2, 10);
  });

  it('bleibt unter dem groessten Einzelgewicht einer Bergetappe', () => {
    const berg = PROFILE_SCORE_WEIGHTS.High_Mountain.hard.mountain ?? 0;
    // Selbst die laengste denkbare Etappe darf die Ausdauer nicht zur
    // wichtigsten Faehigkeit am Berg machen.
    expect(resolveStaminaWeight(320)).toBeLessThan(berg);
  });
});

describe('Gewichte in Etappenrennen', () => {
  it('nimmt Hilly_Difficult den Flach-Anteil, aber nur dort', () => {
    const eintages = resolveStageScoreWeights('Hilly_Difficult', 0.45 * 200, 200, false);
    const rundfahrt = resolveStageScoreWeights('Hilly_Difficult', 0.45 * 200, 200, true);
    expect(eintages.flat).toBeGreaterThan(0);
    expect(rundfahrt.flat).toBeUndefined();
  });

  it('verteilt das freigewordene Gewicht, Summe bleibt 1', () => {
    for (const stageScore of [0.45 * 200, 0.78 * 200, 1.10 * 200]) {
      const w = resolveStageScoreWeights('Hilly_Difficult', stageScore, 200, true);
      expect(summe(w)).toBeCloseTo(1, 6);
    }
    expect(summe(STAGE_RACE_SCORE_WEIGHTS.Hilly_Difficult!.easy)).toBeCloseTo(1, 6);
    expect(summe(STAGE_RACE_SCORE_WEIGHTS.Hilly_Difficult!.hard)).toBeCloseTo(1, 6);
  });

  it('erhoeht dabei Huegel und Mittelgebirge', () => {
    const eintages = resolveStageScoreWeights('Hilly_Difficult', 0.45 * 200, 200, false);
    const rundfahrt = resolveStageScoreWeights('Hilly_Difficult', 0.45 * 200, 200, true);
    expect(rundfahrt.hill!).toBeGreaterThan(eintages.hill!);
    expect(rundfahrt.mediumMountain!).toBeGreaterThan(eintages.mediumMountain!);
  });

  it('laesst jedes andere Profil unveraendert', () => {
    for (const profile of ALLE_PROFILE) {
      if (profile === 'Hilly_Difficult') continue;
      const [low, high] = PROFILE_SCORE_WEIGHTS[profile].difficultyRange;
      for (const d of [low, (low + high) / 2, high]) {
        expect(resolveStageScoreWeights(profile, d * 200, 200, true))
          .toEqual(resolveStageScoreWeights(profile, d * 200, 200, false));
      }
    }
  });

  it('gilt ohne Angabe als Eintagesrennen', () => {
    expect(resolveStageScoreWeights('Hilly_Difficult', 0.45 * 200, 200))
      .toEqual(resolveStageScoreWeights('Hilly_Difficult', 0.45 * 200, 200, false));
  });

  it('ueberblendet in der Rundfahrtvariante weiterhin nach Schwierigkeit', () => {
    const leicht = resolveStageScoreWeights('Hilly_Difficult', 0.45 * 200, 200, true);
    const schwer = resolveStageScoreWeights('Hilly_Difficult', 1.10 * 200, 200, true);
    expect(schwer.mediumMountain!).toBeGreaterThan(leicht.mediumMountain!);
    expect(schwer.hill!).toBeLessThan(leicht.hill!);
  });
});

describe('Vorgegebene Anteile der Bergfaehigkeiten', () => {
  /** Anteil von hill, mediumMountain und mountain am Gesamtgewicht, auf 100 normiert. */
  function bergAnteile(profile: StageProfile, position: number, isStageRace = false): [number, number, number] {
    const [low, high] = (isStageRace ? STAGE_RACE_SCORE_WEIGHTS[profile] : undefined)?.difficultyRange
      ?? PROFILE_SCORE_WEIGHTS[profile].difficultyRange;
    const stageScore = (low + ((high - low) * position)) * 200;
    const w = resolveStageScoreWeights(profile, stageScore, 200, isStageRace);
    const berg = (w.hill ?? 0) + (w.mediumMountain ?? 0) + (w.mountain ?? 0);
    return [(w.hill ?? 0) / berg * 100, (w.mediumMountain ?? 0) / berg * 100, (w.mountain ?? 0) / berg * 100];
  }

  it('trifft die Vorgabe am Anfang jeder Spanne', () => {
    const vorgabe: Array<[StageProfile, [number, number, number]]> = [
      ['Hilly', [100, 0, 0]],
      ['Hilly_Difficult', [65, 35, 0]],
      ['Medium_Mountain', [25, 60, 15]],
      ['Mountain', [5, 40, 55]],
      ['High_Mountain', [0, 0, 100]],
    ];
    for (const [profile, erwartet] of vorgabe) {
      const ist = bergAnteile(profile, 0);
      for (let index = 0; index < 3; index += 1) {
        expect(ist[index]!).toBeCloseTo(erwartet[index]!, 0);
      }
    }
  });

  it('trifft die Vorgabe in der Mitte jeder Spanne', () => {
    const vorgabe: Array<[StageProfile, [number, number, number]]> = [
      ['Hilly', [75, 25, 0]],
      ['Hilly_Difficult', [45, 45, 10]],
      ['Medium_Mountain', [25, 50, 25]],
      ['Mountain', [0, 25, 75]],
      ['High_Mountain', [0, 0, 100]],
    ];
    for (const [profile, erwartet] of vorgabe) {
      const ist = bergAnteile(profile, 0.5);
      for (let index = 0; index < 3; index += 1) {
        // Bei Mountain waere der Huegelanteil rechnerisch negativ und ist auf
        // 0 gestutzt; dadurch bleiben dort 2,5 Prozent stehen.
        expect(Math.abs(ist[index]! - erwartet[index]!)).toBeLessThan(profile === 'Mountain' ? 3 : 0.5);
      }
    }
  });

  it('gilt auch fuer die Rundfahrtvariante von Hilly_Difficult', () => {
    for (const [position, erwartet] of [[0, [65, 35, 0]], [0.5, [45, 45, 10]]] as Array<[number, number[]]>) {
      const ist = bergAnteile('Hilly_Difficult', position, true);
      for (let index = 0; index < 3; index += 1) {
        expect(ist[index]!).toBeCloseTo(erwartet[index]!, 0);
      }
    }
  });

  it('laesst Flach, Sprint, Antritt und Abfahrt unangetastet', () => {
    expect(PROFILE_SCORE_WEIGHTS.Hilly.easy.flat).toBe(0.50);
    expect(PROFILE_SCORE_WEIGHTS.Hilly.hard.flat).toBe(0.28);
    expect(PROFILE_SCORE_WEIGHTS.Mountain.easy.downhill).toBe(0.05);
    expect(PROFILE_SCORE_WEIGHTS.High_Mountain.hard.downhill).toBe(0.04);
    for (const profile of ['Flat', 'Rolling', 'Cobble', 'Cobble_Hill'] as StageProfile[]) {
      expect(summe(PROFILE_SCORE_WEIGHTS[profile].easy)).toBeCloseTo(1, 6);
      expect(PROFILE_SCORE_WEIGHTS[profile].easy.mountain).toBeUndefined();
    }
  });

  it('haelt die Spannen luecken- und ueberlappungsfrei aneinander', () => {
    const leiter: StageProfile[] = ['Hilly', 'Hilly_Difficult', 'Medium_Mountain', 'Mountain', 'High_Mountain'];
    for (let index = 1; index < leiter.length; index += 1) {
      expect(PROFILE_SCORE_WEIGHTS[leiter[index]!].difficultyRange[0])
        .toBeCloseTo(PROFILE_SCORE_WEIGHTS[leiter[index - 1]!].difficultyRange[1], 6);
    }
  });
});
