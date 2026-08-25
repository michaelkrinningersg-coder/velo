/**
 * Wie wahrscheinlich es ist, dass die Ausreissergruppe bis ins Ziel kommt.
 *
 * Bisher entschied das allein der Einholpunkt: kam er hinter der Zieldistanz
 * zu liegen, ueberlebte die Gruppe. `resolveBreakawayPhaseEndRange()` zieht
 * ihn aber hoechstens bei 0,85 der Distanz — die Gruppe wurde also *immer*
 * gestellt. Etappen, die ein Ausreisser gewinnt, gab es damit gar nicht.
 *
 * Jetzt gibt es dafuer eine eigene Ziehung, und zwar nach der Rennstruktur
 * statt nach der Etappe: in einer dreiwoechigen Rundfahrt laesst das Feld die
 * Gruppe in der ersten Woche selten laufen und in der dritten oft, weil die
 * Sprinterteams verschlissen sind und die Gesamtwertung steht. Auf schwerem
 * Terrain ab `Hilly_Difficult` kippt das frueher und deutlicher.
 */

import type { RandomSource } from '../rng';
import type { StageProfile } from '../types';

/**
 * Etappe 1 bis 21 auf leichtem Terrain (`Flat`, `Rolling`, `Hilly`) und auf
 * Pflaster. Der Knick bei Etappe 20 ist gewollt: die vorletzte Etappe einer
 * grossen Rundfahrt ist die letzte Entscheidung, da faehrt das Feld die
 * Gruppe zurueck. Etappe 21 ist die Schlussetappe.
 */
export const BREAKAWAY_SURVIVAL_EASY: readonly number[] = [
  0.010, 0.015, 0.020, 0.025, 0.030, 0.035, 0.040, 0.045, 0.050, 0.055,
  0.065, 0.075, 0.085, 0.095, 0.105, 0.115, 0.125, 0.135, 0.145, 0.100,
  0.020,
];

/** Dieselben Etappennummern ab `Hilly_Difficult` aufwaerts. */
export const BREAKAWAY_SURVIVAL_HARD: readonly number[] = [
  0.010, 0.015, 0.020, 0.025, 0.030, 0.035, 0.040, 0.045, 0.050, 0.055,
  0.200, 0.225, 0.250, 0.275, 0.300, 0.325, 0.350, 0.375, 0.400, 0.200,
  0.020,
];

/**
 * Eintagesrennen haben keine Etappennummer und keinen Rennverlauf ueber
 * Wochen — dort entscheidet allein das Terrain.
 */
export const BREAKAWAY_SURVIVAL_ONE_DAY: Record<StageProfile, number> = {
  Flat: 0.075,
  Rolling: 0.050,
  Hilly: 0.030,
  Hilly_Difficult: 0.020,
  Medium_Mountain: 0.005,
  Cobble: 0.005,
  Cobble_Hill: 0.005,
  Mountain: 0.005,
  High_Mountain: 0.005,
  ITT: 0,
  TTT: 0,
};

/**
 * Terrain ab `Hilly_Difficult`. Pflaster steht bewusst nicht darin: eine
 * Pflasteretappe ist selektiv wie eine schwere Huegeletappe, aber das Feld
 * faehrt sie geschlossen an — sie folgt der leichten Tabelle.
 */
const HARD_PROFILES: ReadonlySet<StageProfile> = new Set<StageProfile>([
  'Hilly_Difficult', 'Medium_Mountain', 'Mountain', 'High_Mountain',
]);

/** Kurze Rundfahrten haben keine dritte Woche — dafuer diesen Aufschlag. */
export const SHORT_STAGE_RACE_FACTOR = 2.5;
/** Ab dieser Etappenzahl gilt eine Rundfahrt nicht mehr als kurz. */
export const SHORT_STAGE_RACE_MAX_STAGES = 6;
/** Streuung auf jeden Tabellenwert. */
export const SURVIVAL_JITTER = 0.2;

export interface BreakawaySurvivalInput {
  profile: StageProfile;
  isStageRace: boolean;
  /** Etappennummer, 1-basiert. Bei Eintagesrennen ohne Bedeutung. */
  stageNumber: number;
  /** Etappen des Rennens insgesamt. */
  numberOfStages: number;
  random: RandomSource;
}

/** Tabellenwert ohne Streuung und ohne Aufschlag. */
export function resolveBaseSurvivalChance(input: Omit<BreakawaySurvivalInput, 'random'>): number {
  const { profile, isStageRace, stageNumber, numberOfStages } = input;
  if (profile === 'ITT' || profile === 'TTT') {
    return 0;
  }
  if (!isStageRace) {
    return BREAKAWAY_SURVIVAL_ONE_DAY[profile] ?? 0;
  }

  const table = HARD_PROFILES.has(profile) ? BREAKAWAY_SURVIVAL_HARD : BREAKAWAY_SURVIVAL_EASY;
  const index = Math.min(table.length - 1, Math.max(0, Math.round(stageNumber) - 1));
  const base = table[index] as number;
  return numberOfStages < SHORT_STAGE_RACE_MAX_STAGES ? base * SHORT_STAGE_RACE_FACTOR : base;
}

/**
 * Wahrscheinlichkeit fuer diese Etappe, inklusive Streuung von ±20 Prozent.
 * Ein Tabellenwert von 0,4 liegt damit zwischen 0,32 und 0,48.
 */
export function resolveBreakawaySurvivalChance(input: BreakawaySurvivalInput): number {
  const base = resolveBaseSurvivalChance(input);
  if (base <= 0) {
    return 0;
  }
  const factor = 1 - SURVIVAL_JITTER + (input.random() * 2 * SURVIVAL_JITTER);
  return Math.min(1, Math.max(0, base * factor));
}
