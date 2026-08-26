import { describe, expect, it } from 'vitest';
import {
  DOMESTIQUE_CLIMB_PENALTY,
  SKILL_WEIGHT_FACTOR_BY_PROFILE,
  resolveSkillWeightFactor,
} from '../../../shared/quickSim/terrainModifiers';
import { resolveStageScoreWeights, resolveStaminaWeight } from '../../../frontend/src/race-sim/stageScoreWeights';
import { calculateStageFavoriteRiderRanking } from '../../../frontend/src/race-sim/stageFavorites';
import type { Rider, RiderSkillKey, StageProfile } from '../../../shared/types';

const STRASSE: StageProfile[] = ['Flat', 'Rolling', 'Hilly', 'Hilly_Difficult', 'Medium_Mountain', 'Mountain', 'High_Mountain'];
const teams = [{ id: 1, name: 'Team' }] as unknown as never;

function baueFahrer(id: number, wert: number, form = 0): Rider {
  const skills = {
    flat: wert, hill: wert, mediumMountain: wert, mountain: wert, timeTrial: wert,
    prologue: wert, cobble: wert, sprint: wert, acceleration: wert, downhill: wert,
    stamina: wert, resistance: wert, recuperation: wert, bikeHandling: wert,
  };
  return {
    id, firstName: 'F', lastName: `${id}`, activeTeamId: 1,
    role: { id: 1, name: 'Kapitaen' }, skills, formBonus: form, raceFormBonus: 0,
  } as unknown as Rider;
}

const stage = (profile: StageProfile, score: number) => ({ id: 1, stageNumber: 1, profile, profileScore: score } as never);
const wert = (rang: ReadonlyArray<{ rider: Rider; effectiveSkill: number }>, id: number) =>
  rang.find((x) => x.rider.id === id)!.effectiveSkill;

describe('Faktor auf den Faehigkeitsanteil', () => {
  it('steht fuer jedes Strassenprofil in der Tabelle', () => {
    expect(SKILL_WEIGHT_FACTOR_BY_PROFILE.Flat).toBe(1.4);
    expect(SKILL_WEIGHT_FACTOR_BY_PROFILE.Rolling).toBe(1.4);
    expect(SKILL_WEIGHT_FACTOR_BY_PROFILE.Hilly).toBe(2.2);
    expect(SKILL_WEIGHT_FACTOR_BY_PROFILE.Hilly_Difficult).toBe(1.5);
    expect(SKILL_WEIGHT_FACTOR_BY_PROFILE.Medium_Mountain).toBe(1.15);
    expect(SKILL_WEIGHT_FACTOR_BY_PROFILE.Mountain).toBe(1.1);
    expect(SKILL_WEIGHT_FACTOR_BY_PROFILE.High_Mountain).toBe(1.05);
    for (const profile of STRASSE) {
      expect(resolveSkillWeightFactor(profile)).toBeGreaterThanOrEqual(1);
    }
  });

  it('laesst Zeitfahren und Pflaster unangetastet', () => {
    for (const profile of ['ITT', 'TTT', 'Cobble', 'Cobble_Hill'] as StageProfile[]) {
      expect(resolveSkillWeightFactor(profile)).toBe(1);
    }
    expect(resolveSkillWeightFactor(null)).toBe(1);
    expect(resolveSkillWeightFactor(undefined)).toBe(1);
  });

  it('faellt mit steigender Schwierigkeit — die leichten Profile brauchen ihn am meisten', () => {
    const reihe = STRASSE.map((profile) => resolveSkillWeightFactor(profile));
    // Hilly ist die Ausnahme nach oben: dort liegt das Feld am engsten.
    expect(reihe[2]).toBeGreaterThan(reihe[3]!);
    for (let index = 3; index < reihe.length - 1; index += 1) {
      expect(reihe[index]).toBeGreaterThanOrEqual(reihe[index + 1]!);
    }
  });
});

describe('Wirkung im Etappenscore', () => {
  it('spreizt den Abstand zweier Fahrer genau um den Faktor', () => {
    for (const profile of STRASSE) {
      const score = { Flat: 18, Rolling: 40, Hilly: 68, Hilly_Difficult: 119, Medium_Mountain: 203, Mountain: 302, High_Mountain: 414 }[profile as string]!;
      const rang = calculateStageFavoriteRiderRanking(
        [baueFahrer(1, 80), baueFahrer(2, 70)], teams, stage(profile, score), { distanceKm: 180, isStageRace: true },
      );
      // Ohne Faktor waeren es genau zehn Punkte: alle Faehigkeiten sind gleich,
      // die Gewichte summieren sich auf eins, dazu die Ausdauer.
      const ohne = 10 * (1 + resolveStaminaWeight(180));
      expect(wert(rang, 1) - wert(rang, 2)).toBeCloseTo(ohne * resolveSkillWeightFactor(profile), 6);
    }
  });

  it('laesst die Form in absoluter Groesse stehen', () => {
    for (const profile of STRASSE) {
      const score = { Flat: 18, Rolling: 40, Hilly: 68, Hilly_Difficult: 119, Medium_Mountain: 203, Mountain: 302, High_Mountain: 414 }[profile as string]!;
      const rang = calculateStageFavoriteRiderRanking(
        [baueFahrer(1, 75, 4), baueFahrer(2, 75, 0)], teams, stage(profile, score), { distanceKm: 180, isStageRace: true },
      );
      // Vier Punkte Saisonform, auf Flach, Rolling und Huegel abgeschwaecht —
      // vom Faktor unberuehrt.
      const erwartet = 4 * ({ Flat: 0.5, Rolling: 0.5, Hilly: 0.75 }[profile as string] ?? 1);
      expect(wert(rang, 1) - wert(rang, 2)).toBeCloseTo(erwartet, 6);
    }
  });

  /**
   * Gemessene Streuung der reinen Faehigkeiten je Terrain, in Punkten.
   *
   * Ermittelt an den 200 Fahrern eines Giro-Laufs, jeweils auf einer
   * 180-km-Etappe des Terrains gerechnet. Genau diese Zahlen begruenden die
   * Faktoren — steht hier eine andere Streuung, gehoert der Faktor neu
   * bestimmt, sonst rutscht ein Terrain wieder aus der Reihe.
   */
  const GEMESSENE_STREUUNG: Partial<Record<StageProfile, number>> = {
    Flat: 2.65, Rolling: 2.53, Hilly: 2.13, Hilly_Difficult: 3.14,
    Medium_Mountain: 3.99, Mountain: 4.37, High_Mountain: 4.69,
  };

  it('gleicht die gemessene Streuung der Terrains einander an', () => {
    const danach = STRASSE.map((profile) => GEMESSENE_STREUUNG[profile]! * resolveSkillWeightFactor(profile));
    const vorher = STRASSE.map((profile) => GEMESSENE_STREUUNG[profile]!);
    const spanne = (w: number[]) => Math.max(...w) / Math.min(...w);
    // Vorher lag zwischen dem engsten und dem breitesten Feld mehr als das
    // Doppelte, danach weniger als das Anderthalbfache.
    expect(spanne(vorher)).toBeGreaterThan(2);
    expect(spanne(danach)).toBeLessThan(1.45);
    // Und keines der Bergprofile faellt unter die leichten.
    for (const profile of ['Hilly_Difficult', 'Medium_Mountain', 'Mountain', 'High_Mountain'] as StageProfile[]) {
      const berg = GEMESSENE_STREUUNG[profile]! * resolveSkillWeightFactor(profile);
      for (const leicht of ['Flat', 'Rolling'] as StageProfile[]) {
        expect(berg).toBeGreaterThan(GEMESSENE_STREUUNG[leicht]! * resolveSkillWeightFactor(leicht));
      }
    }
  });

  it('spreizt den Rollenabzug am Berg mit', () => {
    // Der Abzug ist in Punkten der Faehigkeitsskala gedacht und muss deshalb
    // denselben Faktor tragen — sonst verloere er genau so viel Wirkung, wie
    // der Faktor die Faehigkeiten spreizt.
    for (const [profile, abzug] of Object.entries(DOMESTIQUE_CLIMB_PENALTY) as Array<[StageProfile, number]>) {
      const wasser = baueFahrer(2, 75);
      (wasser as { role: { id: number; name: string } }).role = { id: 5, name: 'Wassertraeger' };
      const rang = calculateStageFavoriteRiderRanking(
        [baueFahrer(1, 75), wasser], teams, stage(profile, 203), { distanceKm: 180, isStageRace: true },
      );
      expect(wert(rang, 1) - wert(rang, 2)).toBeCloseTo(abzug * resolveSkillWeightFactor(profile), 6);
    }
  });

  it('haelt den Rollenabzug im selben Verhaeltnis zu den Faehigkeiten', () => {
    // Zehn Punkte Bergwert wiegen den Abzug auf einem Terrain genauso auf wie
    // vor dem Faktor — beide werden gleich gespreizt.
    for (const profile of ['Medium_Mountain', 'Mountain', 'High_Mountain'] as StageProfile[]) {
      const wasser = baueFahrer(2, 85);
      (wasser as { role: { id: number; name: string } }).role = { id: 5, name: 'Wassertraeger' };
      const rang = calculateStageFavoriteRiderRanking(
        [baueFahrer(1, 75), wasser], teams, stage(profile, 203), { distanceKm: 180, isStageRace: true },
      );
      const faktor = resolveSkillWeightFactor(profile);
      const vorsprung = 10 * (1 + resolveStaminaWeight(180)) - DOMESTIQUE_CLIMB_PENALTY[profile]!;
      expect(wert(rang, 2) - wert(rang, 1)).toBeCloseTo(vorsprung * faktor, 6);
    }
  });

  it('laesst die Gewichte selbst unveraendert — sie summieren sich weiter auf eins', () => {
    for (const profile of STRASSE) {
      const w = resolveStageScoreWeights(profile, 0.6 * 180, 180, true);
      const summe = (Object.values(w) as number[]).reduce((s, x) => s + x, 0);
      expect(summe).toBeCloseTo(1, 6);
      for (const key of Object.keys(w) as RiderSkillKey[]) {
        expect(w[key]).toBeLessThanOrEqual(1);
      }
    }
  });
});
