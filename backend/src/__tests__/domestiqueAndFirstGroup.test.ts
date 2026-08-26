import { describe, expect, it } from 'vitest';
import { resolveFirstGroupSize } from '../../../shared/quickSim/groupModel';
import { simulateQuickStage } from '../../../shared/quickSim/simulateStage';
import {
  DEFAULT_QUICK_SIM_PROFILES,
  FIRST_GROUP_MAX_SIZE,
  FIRST_GROUP_SOFT_KNEE,
} from '../../../shared/quickSimProfiles';
import {
  DOMESTIQUE_CLIMB_PENALTY,
  STRONG_HELPER_PENALTY_SHARE,
  resolveClimbPenaltyForRole,
  resolveDomestiqueClimbPenalty,
  resolveSkillWeightFactor,
} from '../../../shared/quickSim/terrainModifiers';
import { calculateStageFavoriteRiderRanking } from '../../../frontend/src/race-sim/stageFavorites';
import { createSeededRandom } from '../../../shared/rng';
import type { Rider, StageProfile, Team } from '../../../shared/types';

const GEDECKELT: StageProfile[] = ['Hilly_Difficult', 'Medium_Mountain', 'Mountain', 'High_Mountain'];
const UNGEDECKELT: StageProfile[] = ['Flat', 'Rolling', 'Hilly', 'Cobble', 'Cobble_Hill'];

describe('Obergrenze der ersten Zeitgruppe', () => {
  it('deckelt nur am Berg', () => {
    for (const profile of GEDECKELT) {
      expect(FIRST_GROUP_MAX_SIZE[profile]).toBeGreaterThan(0);
    }
    for (const profile of UNGEDECKELT) {
      expect(FIRST_GROUP_MAX_SIZE[profile]).toBeUndefined();
      expect(resolveFirstGroupSize(0.9, 170, profile)).toBe(153);
    }
    expect(resolveFirstGroupSize(0.9, 170)).toBe(153);
  });

  it('haelt die vorgegebenen Grenzen ein', () => {
    for (const profile of GEDECKELT) {
      const grenze = FIRST_GROUP_MAX_SIZE[profile]!;
      for (const share of [0.1, 0.3, 0.6, 0.98]) {
        expect(resolveFirstGroupSize(share, 170, profile)).toBeLessThanOrEqual(grenze);
      }
      // Ein sehr grosser Anteil laeuft an die Grenze, ohne sie zu erreichen —
      // die Saettigung naehert sich ihr nur.
      expect(resolveFirstGroupSize(0.98, 400, profile)).toBe(grenze);
    }
  });

  it('laesst die Ziehung unterhalb des Knies unangetastet', () => {
    for (const profile of GEDECKELT) {
      const knie = FIRST_GROUP_SOFT_KNEE[profile]!;
      for (let roh = 1; roh <= knie; roh += 1) {
        expect(resolveFirstGroupSize(roh / 170, 170, profile)).toBe(roh);
      }
    }
  });

  it('steigt oberhalb des Knies weiter, aber langsamer', () => {
    for (const profile of GEDECKELT) {
      const knie = FIRST_GROUP_SOFT_KNEE[profile]!;
      const grenze = FIRST_GROUP_MAX_SIZE[profile]!;
      let vorher = resolveFirstGroupSize(knie / 170, 170, profile);
      for (let roh = knie + 1; roh <= 170; roh += 1) {
        const wert = resolveFirstGroupSize(roh / 170, 170, profile);
        expect(wert).toBeGreaterThanOrEqual(vorher);
        expect(wert - vorher).toBeLessThanOrEqual(1);
        expect(wert).toBeLessThanOrEqual(grenze);
        vorher = wert;
      }
    }
  });

  it('laesst kleine Gruppen unangetastet und nie unter einem Fahrer', () => {
    for (const profile of GEDECKELT) {
      expect(resolveFirstGroupSize(0.006, 170, profile)).toBe(1);
      expect(resolveFirstGroupSize(0, 170, profile)).toBe(1);
      expect(resolveFirstGroupSize(0.9, 0, profile)).toBe(0);
    }
    // Ein Feld, das kleiner ist als die Grenze, wird nicht kuenstlich gedehnt.
    expect(resolveFirstGroupSize(0.98, 4, 'Medium_Mountain')).toBe(4);
  });

  it('haelt die Grenze auch ueber viele gezogene Etappen', () => {
    for (const profile of GEDECKELT) {
      const grenze = FIRST_GROUP_MAX_SIZE[profile]!;
      const riders = Array.from({ length: 170 }, (_, index) => ({
        riderId: index + 1, score: 90 - (index * 0.12), photoFinishScore: 90 - (index * 0.12),
      }));
      for (let seed = 0; seed < 400; seed += 1) {
        const ergebnis = simulateQuickStage({
          profile,
          distanceKm: 165,
          stageScore: 165 * (profile === 'Hilly_Difficult' ? 0.7 : 1.6),
          parameters: DEFAULT_QUICK_SIM_PROFILES[profile], riders, random: createSeededRandom(seed),
        });
        expect(ergebnis.firstGroupSize).toBeLessThanOrEqual(grenze);
      }
    }
  });
});

function baueFahrer(id: number, rolle: string, bergwert: number): Rider {
  const skills = {
    flat: 70, hill: bergwert, mediumMountain: bergwert, mountain: bergwert, timeTrial: 70,
    prologue: 70, cobble: 70, sprint: 70, acceleration: 70, downhill: 70, attack: 70,
    stamina: 70, resistance: 70, recuperation: 70, bikeHandling: 70,
  };
  return { id, firstName: 'F', lastName: `${id}`, activeTeamId: 1, role: { id: 5, name: rolle }, skills } as unknown as Rider;
}

describe('Abzug fuer Wassertraeger am Berg', () => {
  const teams = [{ id: 1, name: 'Team' }] as unknown as Team[];
  const stage = (profile: StageProfile) => ({ id: 1, stageNumber: 1, profile, profileScore: 165 * 1.6 } as never);

  it('gilt nur auf den drei Bergprofilen', () => {
    expect(DOMESTIQUE_CLIMB_PENALTY.High_Mountain).toBe(6);
    expect(DOMESTIQUE_CLIMB_PENALTY.Mountain).toBe(4);
    expect(DOMESTIQUE_CLIMB_PENALTY.Medium_Mountain).toBe(2);
    for (const profile of ['Flat', 'Rolling', 'Hilly', 'Hilly_Difficult', 'Cobble', 'Cobble_Hill', 'ITT'] as StageProfile[]) {
      expect(resolveDomestiqueClimbPenalty(profile)).toBe(0);
    }
    expect(resolveDomestiqueClimbPenalty(null)).toBe(0);
  });

  it('zieht dem Wassertraeger den vorgegebenen Wert ab, mit dem Terrainfaktor', () => {
    for (const [profile, abzug] of Object.entries(DOMESTIQUE_CLIMB_PENALTY) as Array<[StageProfile, number]>) {
      const kapitaen = baueFahrer(1, 'Kapitaen', 75);
      const wasser = baueFahrer(2, 'Wassertraeger', 75);
      const rang = calculateStageFavoriteRiderRanking([kapitaen, wasser], teams, stage(profile), { distanceKm: 165, isStageRace: true });
      const kap = rang.find((r) => r.rider.id === 1)!.effectiveSkill;
      const was = rang.find((r) => r.rider.id === 2)!.effectiveSkill;
      // Der Abzug steht in Punkten der Faehigkeitsskala und wird deshalb
      // genauso gespreizt wie sie. Siehe `SKILL_WEIGHT_FACTOR_BY_PROFILE`.
      expect(kap - was).toBeCloseTo(abzug * resolveSkillWeightFactor(profile), 6);
    }
  });

  it('laesst den Wassertraeger flach und huegelig unangetastet', () => {
    for (const profile of ['Flat', 'Rolling', 'Hilly', 'Hilly_Difficult'] as StageProfile[]) {
      const rang = calculateStageFavoriteRiderRanking(
        [baueFahrer(1, 'Kapitaen', 75), baueFahrer(2, 'Wassertraeger', 75)],
        teams, stage(profile), { distanceKm: 165, isStageRace: true },
      );
      expect(rang[0]!.effectiveSkill).toBeCloseTo(rang[1]!.effectiveSkill, 6);
    }
  });

  it('erkennt die Rolle auch mit Betonungszeichen', () => {
    const rang = calculateStageFavoriteRiderRanking(
      [baueFahrer(1, 'Kapitaen', 75), baueFahrer(2, 'Wasserträger', 75)],
      teams, stage('High_Mountain'), { distanceKm: 165, isStageRace: true },
    );
    expect(rang.find((r) => r.rider.id === 1)!.effectiveSkill - rang.find((r) => r.rider.id === 2)!.effectiveSkill)
      .toBeCloseTo(6 * resolveSkillWeightFactor('High_Mountain'), 6);
  });

  it('dreht die Reihenfolge, wo der Abzug den Unterschied ausmacht', () => {
    // Wassertraeger mit fuenf Punkten mehr Bergwert steht im Hochgebirge
    // trotzdem hinten, weil der Abzug sechs betraegt.
    const rang = calculateStageFavoriteRiderRanking(
      [baueFahrer(1, 'Kapitaen', 70), baueFahrer(2, 'Wassertraeger', 75)],
      teams, stage('High_Mountain'), { distanceKm: 165, isStageRace: true },
    );
    expect(rang[0]!.rider.id).toBe(1);
  });
});

describe('Abzug fuer starke Helfer am Berg', () => {
  const teams = [{ id: 1, name: 'Team' }] as unknown as Team[];
  const stage = (profile: StageProfile) => ({ id: 1, stageNumber: 1, profile, profileScore: 165 * 1.6 } as never);

  it('traegt genau ein Drittel des vollen Abzugs', () => {
    expect(STRONG_HELPER_PENALTY_SHARE).toBeCloseTo(1 / 3, 12);
    for (const [profile, voll] of Object.entries(DOMESTIQUE_CLIMB_PENALTY) as Array<[StageProfile, number]>) {
      expect(resolveClimbPenaltyForRole('starke helfer', profile)).toBeCloseTo(voll / 3, 12);
      expect(resolveClimbPenaltyForRole('wassertraeger', profile)).toBeCloseTo(voll, 12);
    }
  });

  it('gibt Rollen ohne Eintrag keinen Abzug', () => {
    for (const rolle of ['kapitaen', 'co-kapitaen', 'edelhelfer', 'sprinter', '']) {
      expect(resolveClimbPenaltyForRole(rolle, 'High_Mountain')).toBe(0);
    }
  });

  it('wirkt im Ranking mit einem Drittel', () => {
    for (const [profile, voll] of Object.entries(DOMESTIQUE_CLIMB_PENALTY) as Array<[StageProfile, number]>) {
      const rang = calculateStageFavoriteRiderRanking(
        [baueFahrer(1, 'Kapitaen', 75), baueFahrer(2, 'Starke Helfer', 75), baueFahrer(3, 'Wassertraeger', 75)],
        teams, stage(profile), { distanceKm: 165, isStageRace: true },
      );
      const wert = (id: number) => rang.find((r) => r.rider.id === id)!.effectiveSkill;
      const faktor = resolveSkillWeightFactor(profile);
      expect(wert(1) - wert(2)).toBeCloseTo((voll / 3) * faktor, 6);
      expect(wert(1) - wert(3)).toBeCloseTo(voll * faktor, 6);
      // Der starke Helfer steht zwischen Kapitaen und Wassertraeger.
      expect(rang.map((r) => r.rider.id)).toEqual([1, 2, 3]);
    }
  });

  it('laesst den starken Helfer flach und huegelig unangetastet', () => {
    for (const profile of ['Flat', 'Rolling', 'Hilly', 'Hilly_Difficult'] as StageProfile[]) {
      expect(resolveClimbPenaltyForRole('starke helfer', profile)).toBe(0);
    }
  });
});
