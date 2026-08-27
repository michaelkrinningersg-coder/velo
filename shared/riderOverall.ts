/**
 * Die Gesamtwertung eines Fahrers aus seinen Faehigkeiten.
 *
 * Lag frueher im RiderDevelopmentService. Sie wird inzwischen auch ausserhalb
 * des Backends gebraucht — vom Newgen-Service, vom Werkzeug, das die Presets
 * einstuft, und vom Test dazu — und steht deshalb hier.
 *
 * Zwei Dinge sind an der Formel wichtig, wenn man Presets danach einstuft:
 * Prolog, Abfahrt, Angriff und Radbeherrschung zaehlen gar nicht mit, und gut
 * ein Viertel des Gewichts (2,75 von 9,67) haengt an den beiden hoechsten
 * Werten. Ein Fahrer mit einer einzelnen Spitze verschenkt davon die Haelfte.
 */

import type { RiderSkills } from './types';

export type OverallRelevantSkills = Pick<
  RiderSkills,
  'flat' | 'mountain' | 'mediumMountain' | 'hill' | 'timeTrial' | 'cobble' | 'sprint'
  | 'stamina' | 'resistance' | 'recuperation' | 'acceleration'
>;

const clamp = (value: number): number => Math.max(0, Math.min(85, value));

export function calcRiderOverall(skills: OverallRelevantSkills): number {
  const includedSkills = [
    ['mountain', skills.mountain, 1.8],
    ['hill', skills.hill, 1],
    ['sprint', skills.sprint, 1.2],
    ['timeTrial', skills.timeTrial, 2 / 3],
    ['cobble', skills.cobble, 4 / 5],
    ['mediumMountain', skills.mediumMountain, 0.2],
    ['stamina', skills.stamina, 0.1],
    ['resistance', skills.resistance, 0.1],
    ['recuperation', skills.recuperation, 0.1],
    ['flat', skills.flat, 0.15],
    ['acceleration', skills.acceleration, 0.8],
  ] as const;

  const weightedTotal = includedSkills.reduce((sum, [, value, weight]) => sum + value * weight, 0);
  let topSkillValue = -Infinity;
  let secondSkillValue = -Infinity;

  for (const [, value] of includedSkills) {
    if (value > topSkillValue) {
      secondSkillValue = topSkillValue;
      topSkillValue = value;
      continue;
    }

    if (value > secondSkillValue) {
      secondSkillValue = value;
    }
  }

  const bonusTotal = topSkillValue * 1.5 + secondSkillValue * 1.25;
  const totalWeight = 1.8 + 1 + 1.2 + (2 / 3) + (4 / 5) + 0.2 + 0.1 + 0.1 + 0.1 + 0.15 + 0.8 + 1.5 + 1.25;
  return clamp((weightedTotal + bonusTotal) / totalWeight);
}
