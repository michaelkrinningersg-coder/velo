/**
 * Anfahrtsbonus im Zielsprint.
 *
 * Auf Flach- und Huegelankuenften entscheidet nicht der Leistungsscore allein,
 * wer den Sprint gewinnt, sondern auch die Anfahrt: ein Team mit einem
 * geschlossenen Zug bringt seinen Sprinter besser in Position. Der Bonus geht
 * deshalb auf den `photoFinishScore` — den Tie-Break *innerhalb* der ersten
 * Zeitgruppe —, nicht auf die Zielzeit.
 *
 * Die Regeln lagen als private Methoden in `SimulationEngine.ts`. Die Quick
 * Simulation braucht dieselben: ohne sie waere auf einer Sprintetappe der
 * Etappensieg allein eine Frage des Fahrerscores, und der Anfahrtszug — das
 * Sichtbarste am Sprint — bliebe wirkungslos.
 */

import type { ParsedStageSummary, RiderSkillKey, StageProfile } from '../../../shared/types';
import { randomBetween, type RandomSource } from '../../../shared/rng';
import { collectStageBoundaryMarkers } from './stageSummary';

/** Ab diesem Sprintwert kommt ein Fahrer als Zielsprinter seines Teams in Frage. */
export const LEADOUT_SPRINTER_THRESHOLD = 73;

/** Was ein Helfer koennen muss, um zur Anfahrt beizutragen. */
const HELPER_CRITERIA: Array<{ skill: RiderSkillKey; minimum: number; isSprinter: boolean }> = [
  { skill: 'sprint', minimum: 72, isSprinter: true },
  { skill: 'flat', minimum: 78, isSprinter: false },
  { skill: 'timeTrial', minimum: 76, isSprinter: false },
  { skill: 'acceleration', minimum: 80, isSprinter: false },
];

/** Je mehr Kriterien ein Helfer erfuellt, desto mehr zaehlt er. */
const MULTIPLIER_BY_MET_COUNT: Record<number, number> = { 1: 1.0, 2: 1.25, 3: 1.5, 4: 2.0 };

/** Der Gesamtbeitrag geht anderthalbfach in den Tie-Break ein. */
const LEADOUT_SCALE = 1.5;

export interface LeadoutTeammate {
  riderId: number;
  name: string;
  skills: Record<RiderSkillKey, number>;
  /** Fahrer, die aufgegeben haben oder ausserhalb des Zeitlimits sind, helfen nicht. */
  isAvailable: boolean;
}

export interface LeadoutResult {
  /** Zuschlag auf den photoFinishScore des Sprinters. */
  bonus: number;
  /** Der Helfer mit dem groessten Einzelbeitrag. */
  leadoutRiderId: number | null;
  contributions: Array<{ riderId: number; name: string; contribution: number }>;
}

/**
 * Zwei Zufallswerte je Mannschaft: wie stark ein Sprinthelfer und wie stark ein
 * Spezialist an diesem Tag traegt. Einmal je Team gezogen, damit alle Helfer
 * derselben Mannschaft konsistent bewertet werden.
 */
export function drawTeamLeadoutRandoms(random: RandomSource): { sprint: number; special: number } {
  return {
    sprint: randomBetween(random, 0.25, 0.6),
    special: randomBetween(random, 0.1, 0.3),
  };
}

/** Anfahrtsbonus eines Sprinters aus den Beitraegen seiner Mannschaft. */
export function resolveLeadoutBonus(
  teammates: readonly LeadoutTeammate[],
  randoms: { sprint: number; special: number },
): LeadoutResult {
  let totalBonus = 0;
  let maxContribution = 0;
  let leadoutRiderId: number | null = null;
  let bestSprintSkill = Number.NEGATIVE_INFINITY;
  const contributions: LeadoutResult['contributions'] = [];

  for (const mate of teammates) {
    if (!mate.isAvailable) {
      continue;
    }
    let metCount = 0;
    let isSprintHelper = false;
    for (const criterion of HELPER_CRITERIA) {
      if ((mate.skills[criterion.skill] ?? 0) >= criterion.minimum) {
        metCount += 1;
        if (criterion.isSprinter) {
          isSprintHelper = true;
        }
      }
    }
    if (metCount === 0) {
      continue;
    }

    const baseBonus = isSprintHelper ? randoms.sprint : randoms.special;
    const weighted = baseBonus * (MULTIPLIER_BY_MET_COUNT[metCount] ?? 1);
    totalBonus += weighted;
    contributions.push({
      riderId: mate.riderId,
      name: mate.name,
      contribution: Number((weighted * LEADOUT_SCALE).toFixed(2)),
    });

    if (weighted > maxContribution
      || (weighted === maxContribution && (mate.skills.sprint ?? 0) > bestSprintSkill)) {
      maxContribution = weighted;
      leadoutRiderId = mate.riderId;
      bestSprintSkill = mate.skills.sprint ?? 0;
    }
  }

  return {
    bonus: totalBonus * LEADOUT_SCALE,
    leadoutRiderId: totalBonus > 0 ? leadoutRiderId : null,
    contributions: totalBonus > 0 ? contributions : [],
  };
}

/**
 * Art der Zielankunft. Bestimmt, ob es ueberhaupt einen Zielsprint gibt —
 * am Berg entscheidet kein Anfahrtszug.
 */
export function resolveFinishMarkerType(
  stageSummary: ParsedStageSummary,
  profile: StageProfile,
): 'finish_flat' | 'finish_hill' | 'finish_mountain' {
  const markers = collectStageBoundaryMarkers(stageSummary);
  for (let index = markers.length - 1; index >= 0; index -= 1) {
    const type = markers[index]!.marker.type;
    if (type === 'finish_flat' || type === 'finish_hill' || type === 'finish_mountain') {
      return type;
    }
  }

  switch (profile) {
    case 'Hilly':
    case 'Hilly_Difficult':
    case 'Rolling':
    case 'Cobble_Hill':
      return 'finish_hill';
    case 'Medium_Mountain':
    case 'Mountain':
    case 'High_Mountain':
      return 'finish_mountain';
    default:
      return 'finish_flat';
  }
}

/** Nur Flach- und Huegelankuenfte kennen einen Anfahrtszug. */
export function hasSprintFinish(
  stageSummary: ParsedStageSummary,
  profile: StageProfile,
): boolean {
  if (profile === 'ITT' || profile === 'TTT') {
    return false;
  }
  const finishType = resolveFinishMarkerType(stageSummary, profile);
  return finishType === 'finish_flat' || finishType === 'finish_hill';
}
