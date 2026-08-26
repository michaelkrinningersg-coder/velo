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

  const LEITER: StageProfile[] = ['Hilly', 'Hilly_Difficult', 'Medium_Mountain', 'Mountain', 'High_Mountain'];
  const VORGABE: Record<string, { unten: [number, number, number]; mitte: [number, number, number] }> = {
    Hilly: { unten: [100, 0, 0], mitte: [75, 25, 0] },
    Hilly_Difficult: { unten: [65, 35, 0], mitte: [45, 45, 10] },
    Medium_Mountain: { unten: [25, 60, 15], mitte: [25, 50, 25] },
    Mountain: { unten: [5, 40, 55], mitte: [0, 25, 75] },
    High_Mountain: { unten: [0, 0, 100], mitte: [0, 0, 100] },
  };

  const trifft = (ist: number[], soll: number[]): void => {
    for (let index = 0; index < 3; index += 1) {
      expect(Math.abs(ist[index]! - soll[index]!)).toBeLessThan(0.5);
    }
  };

  it('trifft die Vorgabe am unteren Ende jeder Spanne', () => {
    for (const profile of LEITER) {
      trifft(bergAnteile(profile, 0), VORGABE[profile]!.unten);
    }
  });

  it('trifft die Vorgabe in der Mitte jeder Spanne', () => {
    for (const profile of LEITER) {
      trifft(bergAnteile(profile, 0.5), VORGABE[profile]!.mitte);
    }
  });

  it('geht am oberen Ende in den Anfang des naechsten Terrains ueber', () => {
    // Das ist der Punkt der Leiter: eine Etappe an der Grenze bekommt
    // dieselbe Gewichtung, egal welchem der beiden Terrains sie zufaellt.
    for (let index = 0; index < LEITER.length - 1; index += 1) {
      trifft(bergAnteile(LEITER[index]!, 1), VORGABE[LEITER[index + 1]!]!.unten);
    }
    // Oberhalb des Hochgebirges kommt nichts mehr.
    trifft(bergAnteile('High_Mountain', 1), VORGABE.High_Mountain!.unten);
  });

  it('gilt auch fuer die Rundfahrtvariante von Hilly_Difficult', () => {
    trifft(bergAnteile('Hilly_Difficult', 0, true), VORGABE.Hilly_Difficult!.unten);
    trifft(bergAnteile('Hilly_Difficult', 0.5, true), VORGABE.Hilly_Difficult!.mitte);
    trifft(bergAnteile('Hilly_Difficult', 1, true), VORGABE.Medium_Mountain!.unten);
  });

  it('verlaeuft zwischen den Stuetzstellen einformig', () => {
    // Der Bergwert darf ueber die Spanne nie zurueckgehen.
    for (const profile of LEITER) {
      let vorher = -1;
      for (let position = 0; position <= 1.0001; position += 0.05) {
        const anteil = bergAnteile(profile, Math.min(1, position))[2]!;
        expect(anteil).toBeGreaterThanOrEqual(vorher - 1e-9);
        vorher = anteil;
      }
    }
  });

  it('laesst jeder Stuetzstelle die Summe 1', () => {
    for (const profile of LEITER) {
      for (const position of [0, 0.25, 0.5, 0.75, 1]) {
        const [low, high] = PROFILE_SCORE_WEIGHTS[profile].difficultyRange;
        const w = resolveStageScoreWeights(profile, (low + ((high - low) * position)) * 200, 200);
        expect(summe(w)).toBeCloseTo(1, 6);
      }
    }
  });

  it('laesst Flach, Sprint, Antritt und Abfahrt unangetastet', () => {
    expect(PROFILE_SCORE_WEIGHTS.Hilly.easy.flat).toBe(0.50);
    expect(PROFILE_SCORE_WEIGHTS.Hilly.hard.flat).toBe(0.28);
    expect(PROFILE_SCORE_WEIGHTS.Mountain.easy.downhill).toBe(0.05);
    expect(PROFILE_SCORE_WEIGHTS.High_Mountain.hard.downhill).toBe(0.04);
    for (const profile of ['Flat', 'Rolling', 'Cobble', 'Cobble_Hill'] as StageProfile[]) {
      expect(PROFILE_SCORE_WEIGHTS[profile].middle).toBeUndefined();
      expect(summe(PROFILE_SCORE_WEIGHTS[profile].easy)).toBeCloseTo(1, 6);
      expect(PROFILE_SCORE_WEIGHTS[profile].easy.mountain).toBeUndefined();
    }
  });

  it('haelt die Spannen luecken- und ueberlappungsfrei aneinander', () => {
    for (let index = 1; index < LEITER.length; index += 1) {
      expect(PROFILE_SCORE_WEIGHTS[LEITER[index]!].difficultyRange[0])
        .toBeCloseTo(PROFILE_SCORE_WEIGHTS[LEITER[index - 1]!].difficultyRange[1], 6);
    }
  });
});
