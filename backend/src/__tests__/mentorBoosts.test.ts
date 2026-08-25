import { describe, expect, it } from 'vitest';
import { createSeededRandom } from '../../../shared/rng';
import type { Rider, RiderSkillKey } from '../../../shared/types';
import {
  applyMentorBoosts,
  MENTEE_MAX_AGE,
  MENTOR_MIN_AGE,
  MENTOR_MIN_OVERALL,
  MENTOR_SKILL_BONUS,
  MENTOR_SKILL_COUNT,
} from '../simulation/mentorBoosts';
import { resolveSkillsWithMentorBoosts } from '../../../frontend/src/race-sim/riderCondition';

function rider(overrides: Partial<Rider> & { id: number }): Rider {
  const skills = Object.fromEntries([
    'flat', 'mountain', 'mediumMountain', 'hill', 'timeTrial', 'prologue', 'cobble',
    'sprint', 'acceleration', 'downhill', 'attack', 'stamina', 'resistance', 'recuperation', 'bikeHandling',
  ].map((key) => [key, 70])) as Record<RiderSkillKey, number>;
  return {
    firstName: 'A', lastName: `Fahrer ${overrides.id}`,
    activeTeamId: 1, age: 25, overallRating: 70, riderType: 3,
    skills,
    ...overrides,
  } as Rider;
}

const boostSum = (rider: Rider | undefined): number =>
  Object.values(rider?.mentorBoosts ?? {}).reduce((sum, value) => sum + (value ?? 0), 0);

describe('applyMentorBoosts', () => {
  const mentee = rider({ id: 1, age: MENTEE_MAX_AGE, riderType: 3 });
  const mentor = rider({ id: 2, age: MENTOR_MIN_AGE, overallRating: MENTOR_MIN_OVERALL, riderType: 3 });

  it('hebt drei Faehigkeiten je passendem Mentor', () => {
    const result = applyMentorBoosts([mentee, mentor], createSeededRandom(1));
    expect(boostSum(result.find((entry) => entry.id === 1)))
      .toBe(MENTOR_SKILL_COUNT * MENTOR_SKILL_BONUS);
    // Der Mentor selbst bekommt nichts.
    expect(result.find((entry) => entry.id === 2)?.mentorBoosts).toBeUndefined();
  });

  it('summiert mehrere Mentoren', () => {
    const second = rider({ id: 3, age: MENTOR_MIN_AGE + 2, overallRating: 80, riderType: 3 });
    const result = applyMentorBoosts([mentee, mentor, second], createSeededRandom(2));
    expect(boostSum(result.find((entry) => entry.id === 1)))
      .toBe(2 * MENTOR_SKILL_COUNT * MENTOR_SKILL_BONUS);
  });

  it('nimmt einen Mentor aus einer anderen Mannschaft nicht', () => {
    const foreign = { ...mentor, activeTeamId: 2 };
    expect(applyMentorBoosts([mentee, foreign], createSeededRandom(3))[0]?.mentorBoosts).toBeUndefined();
  });

  it('achtet auf Alter, Staerke und Fachrichtung', () => {
    const tooYoung = { ...mentor, age: MENTOR_MIN_AGE - 1 };
    const tooWeak = { ...mentor, overallRating: MENTOR_MIN_OVERALL - 1 };
    const wrongType = { ...mentor, riderType: 9 };
    for (const candidate of [tooYoung, tooWeak, wrongType]) {
      expect(applyMentorBoosts([mentee, candidate], createSeededRandom(4))[0]?.mentorBoosts).toBeUndefined();
    }
  });

  it('greift bei einem Fahrer ueber der Altersgrenze nicht mehr', () => {
    const older = { ...mentee, age: MENTEE_MAX_AGE + 1 };
    expect(applyMentorBoosts([older, mentor], createSeededRandom(5))[0]?.mentorBoosts).toBeUndefined();
  });

  it('erkennt auch die Spezialisierungen als Fachrichtung', () => {
    const specialist = rider({ id: 4, age: 20, riderType: 1, specialization2: 3 });
    expect(boostSum(applyMentorBoosts([specialist, mentor], createSeededRandom(6))[0]))
      .toBe(MENTOR_SKILL_COUNT * MENTOR_SKILL_BONUS);
  });

  it('liefert bei gleichem Seed dasselbe und bei anderem etwas anderes', () => {
    const build = (seed: number) => JSON.stringify(
      applyMentorBoosts([mentee, mentor], createSeededRandom(seed))[0]?.mentorBoosts,
    );
    expect(build(7)).toBe(build(7));
    // Ueber mehrere Seeds muss sich die Auswahl unterscheiden.
    expect(new Set([7, 8, 9, 10, 11].map(build)).size).toBeGreaterThan(1);
  });

  it('haengt nicht an der Reihenfolge der Fahrerliste', () => {
    const forward = applyMentorBoosts([mentee, mentor], createSeededRandom(12));
    const backward = applyMentorBoosts([mentor, mentee], createSeededRandom(12));
    expect(forward.find((entry) => entry.id === 1)?.mentorBoosts)
      .toEqual(backward.find((entry) => entry.id === 1)?.mentorBoosts);
  });

  it('laesst die uebergebene Liste unangetastet', () => {
    const input = [mentee, mentor];
    applyMentorBoosts(input, createSeededRandom(13));
    expect(input[0]?.mentorBoosts).toBeUndefined();
  });
});

describe('resolveSkillsWithMentorBoosts', () => {
  const boosts = { flat: 2, sprint: 1 } as const;

  it('hebt die Faehigkeiten eines Kapitaens', () => {
    const captain = rider({ id: 1, role: { id: 1, name: 'Kapitaen' }, mentorBoosts: boosts } as never);
    const skills = resolveSkillsWithMentorBoosts(captain);
    expect(skills.flat).toBe(captain.skills.flat + 2);
    expect(skills.sprint).toBe(captain.skills.sprint + 1);
    expect(skills.mountain).toBe(captain.skills.mountain);
  });

  it('gilt auch fuer Co-Kapitaene', () => {
    const co = rider({ id: 2, role: { id: 2, name: 'Co-Kapitaen' }, mentorBoosts: boosts } as never);
    expect(resolveSkillsWithMentorBoosts(co).flat).toBe(co.skills.flat + 2);
  });

  it('laesst jede andere Rolle unveraendert — so macht es die volle Simulation', () => {
    const helper = rider({ id: 3, role: { id: 5, name: 'Edelhelfer' }, mentorBoosts: boosts } as never);
    expect(resolveSkillsWithMentorBoosts(helper)).toBe(helper.skills);
  });

  it('kommt ohne Bonus und ohne Rolle zurecht', () => {
    const plain = rider({ id: 4 });
    expect(resolveSkillsWithMentorBoosts(plain)).toBe(plain.skills);
  });
});
