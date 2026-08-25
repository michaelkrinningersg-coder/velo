import { describe, expect, it } from 'vitest';
import {
  LEADOUT_BONUS_FACTOR,
  RANK_NOISE_FACTOR,
  resolveLeadoutBonusFactor,
  resolveRankNoiseFactor,
  resolveSeasonFormFactor,
  resolveTieBreakNoiseFactor,
  SEASON_FORM_FACTOR,
  TIE_BREAK_NOISE_FACTOR,
} from '../../../shared/quickSim/terrainModifiers';
import { calculateStageFavoriteRiderRanking } from '../../../frontend/src/race-sim/stageFavorites';
import type { Rider, Stage, StageProfile, Team } from '../../../shared/types';

describe('Terrainfaktoren', () => {
  it('schwaecht Saison- und Rennform flach und rollend auf die Haelfte', () => {
    expect(resolveSeasonFormFactor('Flat')).toBe(0.5);
    expect(resolveSeasonFormFactor('Rolling')).toBe(0.5);
  });

  it('schwaecht sie huegelig auf drei Viertel', () => {
    expect(resolveSeasonFormFactor('Hilly')).toBe(0.75);
  });

  it('laesst alle uebrigen Profile unveraendert', () => {
    for (const profile of ['Hilly_Difficult', 'Medium_Mountain', 'Mountain', 'High_Mountain', 'Cobble', 'Cobble_Hill', 'ITT', 'TTT'] as StageProfile[]) {
      expect(resolveSeasonFormFactor(profile)).toBe(1);
      expect(resolveLeadoutBonusFactor(profile)).toBe(1);
    }
    expect(resolveSeasonFormFactor(null)).toBe(1);
    expect(resolveLeadoutBonusFactor(undefined)).toBe(1);
  });

  it('viertelt den Anteil des Rangrauschens am Zielsprint auf Flat, Rolling und Hilly', () => {
    for (const profile of ['Flat', 'Rolling', 'Hilly'] as StageProfile[]) {
      expect(resolveTieBreakNoiseFactor(profile)).toBe(0.25);
    }
    for (const profile of ['Hilly_Difficult', 'Medium_Mountain', 'Mountain', 'High_Mountain', 'Cobble', 'Cobble_Hill'] as StageProfile[]) {
      expect(resolveTieBreakNoiseFactor(profile)).toBe(1);
    }
    expect(resolveTieBreakNoiseFactor(null)).toBe(1);
  });

  it('senkt das Rangrauschen insgesamt auf ein Fuenftel, auf jedem Profil', () => {
    expect(RANK_NOISE_FACTOR).toBe(0.2);
    for (const profile of ['Flat', 'Rolling', 'Hilly', 'Hilly_Difficult', 'Medium_Mountain', 'Mountain', 'High_Mountain', 'Cobble', 'Cobble_Hill', 'ITT', 'TTT'] as StageProfile[]) {
      expect(resolveRankNoiseFactor(profile)).toBe(RANK_NOISE_FACTOR);
    }
    expect(resolveRankNoiseFactor(undefined)).toBe(RANK_NOISE_FACTOR);
    expect(resolveRankNoiseFactor(null)).toBe(RANK_NOISE_FACTOR);
  });

  it('verrechnet beide Rauschfaktoren im Sprint miteinander', () => {
    // Flach: erst auf ein Fuenftel, dann vierteln — zusammen ein Zwanzigstel.
    expect(RANK_NOISE_FACTOR * resolveTieBreakNoiseFactor('Flat')).toBeCloseTo(0.05, 10);
    // Am Berg wirkt nur der Gesamtfaktor.
    expect(RANK_NOISE_FACTOR * resolveTieBreakNoiseFactor('Mountain')).toBeCloseTo(0.2, 10);
  });

  it('hebt den Anfahrtsbonus flach und rollend um ein Viertel, huegelig um 15 Prozent', () => {
    expect(resolveLeadoutBonusFactor('Flat')).toBe(1.25);
    expect(resolveLeadoutBonusFactor('Rolling')).toBe(1.25);
    expect(resolveLeadoutBonusFactor('Hilly')).toBe(1.15);
  });

  it('haelt Formabschlag und Anfahrtszuschlag fuer dieselben Profile fest', () => {
    // Die beiden gehoeren zusammen: wo die Form nachgibt, traegt die Anfahrt.
    expect(Object.keys(SEASON_FORM_FACTOR).sort()).toEqual(Object.keys(LEADOUT_BONUS_FACTOR).sort());
  });
});

const rider = (id: number, formBonus: number, raceFormBonus: number): Rider => ({
  id,
  firstName: 'Test',
  lastName: `Fahrer ${id}`,
  activeTeamId: 1,
  age: 27,
  overallRating: 75,
  riderType: 1,
  formBonus,
  raceFormBonus,
  skills: {
    flat: 75, mountain: 70, mediumMountain: 70, hill: 72, timeTrial: 70, prologue: 70,
    cobble: 70, sprint: 75, acceleration: 74, downhill: 70, attack: 70, stamina: 74,
    resistance: 70, recuperation: 70, bikeHandling: 70,
  },
} as unknown as Rider);

const stage = (profile: StageProfile): Stage => ({
  id: 1, raceId: 1, stageNumber: 1, profile, profileScore: 20,
} as unknown as Stage);

const teams: Team[] = [{ id: 1, name: 'Team 1' } as Team];

describe('Etappenscore mit Terrainfaktor', () => {
  const bewerte = (profile: StageProfile, formBonus: number, raceFormBonus: number): number =>
    calculateStageFavoriteRiderRanking(
      [rider(1, formBonus, raceFormBonus)], teams, stage(profile), { distanceKm: 190, elevationGainMeters: 900 },
    )[0]!.effectiveSkill;

  it('rechnet flach nur die halbe Form ein', () => {
    const ohne = bewerte('Flat', 0, 0);
    const mit = bewerte('Flat', 4, 4);
    expect(mit - ohne).toBeCloseTo(4, 6);
  });

  it('rechnet huegelig drei Viertel ein', () => {
    const ohne = bewerte('Hilly', 0, 0);
    const mit = bewerte('Hilly', 4, 4);
    expect(mit - ohne).toBeCloseTo(6, 6);
  });

  it('rechnet am Berg weiterhin voll', () => {
    const ohne = bewerte('Mountain', 0, 0);
    const mit = bewerte('Mountain', 4, 4);
    expect(mit - ohne).toBeCloseTo(8, 6);
  });

  it('laesst die Tagesform unberuehrt', () => {
    const mitTagesform = calculateStageFavoriteRiderRanking(
      [rider(1, 0, 0)], teams, stage('Flat'),
      { distanceKm: 190, elevationGainMeters: 900, dailyFormByRiderId: new Map([[1, 4]]) },
    )[0]!.effectiveSkill;
    const ohne = bewerte('Flat', 0, 0);
    expect(mitTagesform - ohne).toBeCloseTo(4, 6);
  });
});
