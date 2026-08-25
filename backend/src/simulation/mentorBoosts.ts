/**
 * Mentorenbonus.
 *
 * Ein junger Fahrer mit einem passenden erfahrenen Mannschaftskollegen bekommt
 * fuer die Etappe einen kleinen Zuschlag auf drei zufaellige Faehigkeiten, je
 * Mentor einen.
 *
 * Lag bisher als Schleife in der Roster-Route — der Bonus entstand also nur,
 * wenn der Spieler die Startliste bearbeitet hatte, und fehlte bei jeder
 * anderen Etappe. Jetzt haengt er am Bootstrap und gilt damit ueberall.
 *
 * Die Ziehung ist geseedet. Vorher lief sie ueber `Math.random()` und ein
 * `sort(() => 0.5 - Math.random())` — beides wollten wir hier nicht: das eine
 * macht die Etappe unwiederholbar, das andere ist keine Gleichverteilung und
 * bevorzugt bestimmte Faehigkeiten.
 */

import type { Rider, RiderSkillKey } from '../../../shared/types';
import { shuffled, type RandomSource } from '../../../shared/rng';

/** Hoechstalter des Schuetzlings. */
export const MENTEE_MAX_AGE = 22;
/** Mindestalter des Mentors. */
export const MENTOR_MIN_AGE = 33;
/** Mindeststaerke des Mentors. */
export const MENTOR_MIN_OVERALL = 73;
/** Wie viele Faehigkeiten ein Mentor hebt. */
export const MENTOR_SKILL_COUNT = 3;
/** Um wie viel. */
export const MENTOR_SKILL_BONUS = 1;

const ALL_SKILL_KEYS: readonly RiderSkillKey[] = [
  'flat', 'mountain', 'mediumMountain', 'hill', 'timeTrial', 'prologue', 'cobble',
  'sprint', 'acceleration', 'downhill', 'attack', 'stamina', 'resistance', 'recuperation',
];

/** Passt der Mentor fachlich zum Schuetzling? */
function isMatchingMentor(mentee: Rider, mentor: Rider): boolean {
  return mentor.riderType === mentee.riderType
    || (mentee.specialization1 != null && mentor.riderType === mentee.specialization1)
    || (mentee.specialization2 != null && mentor.riderType === mentee.specialization2)
    || (mentee.specialization3 != null && mentor.riderType === mentee.specialization3);
}

/**
 * Vergibt die Zuschlaege auf einer Kopie der Fahrerliste.
 *
 * Die Reihenfolge der Ziehung haengt an der Fahrer-ID, nicht an der Sortierung
 * der Liste — sonst saehe dieselbe Etappe je nach Aufrufweg anders aus.
 */
export function applyMentorBoosts(riders: readonly Rider[], random: RandomSource): Rider[] {
  const byTeam = new Map<number, Rider[]>();
  for (const rider of riders) {
    if (rider.activeTeamId == null) {
      continue;
    }
    const bucket = byTeam.get(rider.activeTeamId) ?? [];
    bucket.push(rider);
    byTeam.set(rider.activeTeamId, bucket);
  }

  const boostsByRiderId = new Map<number, Partial<Record<RiderSkillKey, number>>>();
  for (const mentee of [...riders].sort((left, right) => left.id - right.id)) {
    if ((mentee.age ?? 0) > MENTEE_MAX_AGE || mentee.activeTeamId == null) {
      continue;
    }
    const mentors = (byTeam.get(mentee.activeTeamId) ?? []).filter((mentor) => (
      mentor.id !== mentee.id
      && (mentor.age ?? 0) >= MENTOR_MIN_AGE
      && mentor.overallRating >= MENTOR_MIN_OVERALL
      && isMatchingMentor(mentee, mentor)
    ));
    if (mentors.length === 0) {
      continue;
    }

    const boosts: Partial<Record<RiderSkillKey, number>> = {};
    for (let index = 0; index < mentors.length; index += 1) {
      for (const key of shuffled(random, [...ALL_SKILL_KEYS]).slice(0, MENTOR_SKILL_COUNT)) {
        boosts[key] = (boosts[key] ?? 0) + MENTOR_SKILL_BONUS;
      }
    }
    boostsByRiderId.set(mentee.id, boosts);
  }

  if (boostsByRiderId.size === 0) {
    return [...riders];
  }
  return riders.map((rider) => {
    const boosts = boostsByRiderId.get(rider.id);
    return boosts ? { ...rider, mentorBoosts: boosts } : rider;
  });
}
