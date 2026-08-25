/**
 * Gewichtung der Fahrerstaerken fuer den Etappenscore.
 *
 * Zwei Dinge werden hier bewusst getrennt, die vorher eins waren:
 *
 *   Etappenscore   wer die Etappe ueberhaupt vorne uebersteht
 *   Zielscore      wer den Sprint gewinnt, wenn mehrere zeitgleich ankommen
 *
 * Die alte Formel hat den Sprint fuer die *ganze* Etappe gewichtet — auf einer
 * Flachetappe mit 0,80. Das ist die Gewichtung eines Zielsprints, nicht die
 * einer 190 Kilometer langen Anfahrt: entscheidend ist dort, wer ueberhaupt
 * vorne mitfahren kann. Der Zielsprint hat mit den Gewichten in
 * `markerWeights.ts` eine eigene Bewertung und braucht sie hier nicht.
 *
 * Zweitens haengt die Gewichtung jetzt an der Schwierigkeit der Etappe, nicht
 * nur an ihrem Profil. Eine flache Etappe mit 0,06 Punkten je Kilometer ist
 * eine andere Aufgabe als eine mit 0,13 — beide heissen `Flat`. Zwischen einer
 * leichten und einer schweren Auspraegung wird linear ueberblendet.
 */

import type { RiderSkillKey, StageProfile } from '../../../shared/types';

export type SkillWeights = Partial<Record<RiderSkillKey, number>>;

export interface ProfileScoreWeights {
  /** Gewichte bei der leichtesten Auspraegung des Profils. */
  easy: SkillWeights;
  /** Gewichte bei der schwersten. */
  hard: SkillWeights;
  /**
   * Schwierigkeit je Kilometer (stage_score / km), zwischen der ueberblendet
   * wird. Die Werte stammen aus den gemessenen Bereichen der 63 Referenz-
   * etappen — unterhalb gilt `easy`, oberhalb `hard`.
   */
  difficultyRange: [number, number];
}

/**
 * Je Profil eine leichte und eine schwere Auspraegung. Beide summieren sich
 * auf 1, damit der Score die Groessenordnung einer Faehigkeit behaelt.
 *
 * Der Sprint steht ueberall klein: er entscheidet den Zielsprint, nicht die
 * Etappe. Auf Pflaster ist er auf 0,10 gedeckelt, das freigewordene Gewicht
 * gleichmaessig auf die uebrigen verteilt.
 */
export const PROFILE_SCORE_WEIGHTS: Record<StageProfile, ProfileScoreWeights> = {
  Flat: {
    difficultyRange: [0.05, 0.15],
    easy: { flat: 0.72, hill: 0.05, sprint: 0.20, acceleration: 0.03 },
    hard: { flat: 0.62, hill: 0.15, sprint: 0.20, acceleration: 0.03 },
  },
  Rolling: {
    difficultyRange: [0.15, 0.50],
    easy: { flat: 0.69, hill: 0.13, sprint: 0.15, acceleration: 0.03 },
    hard: { flat: 0.52, hill: 0.30, sprint: 0.15, acceleration: 0.03 },
  },
  Hilly: {
    difficultyRange: [0.20, 1.00],
    easy: { flat: 0.50, hill: 0.40, sprint: 0.06, acceleration: 0.04 },
    hard: { flat: 0.28, hill: 0.60, mediumMountain: 0.04, sprint: 0.05, acceleration: 0.03 },
  },
  Hilly_Difficult: {
    difficultyRange: [0.45, 1.10],
    easy: { flat: 0.29, hill: 0.58, mediumMountain: 0.07, sprint: 0.03, acceleration: 0.03 },
    hard: { flat: 0.09, hill: 0.58, mediumMountain: 0.27, sprint: 0.03, acceleration: 0.03 },
  },
  Medium_Mountain: {
    difficultyRange: [0.65, 1.10],
    easy: { flat: 0.10, hill: 0.22, mediumMountain: 0.55, mountain: 0.10, sprint: 0.02, acceleration: 0.01 },
    hard: { flat: 0.04, hill: 0.12, mediumMountain: 0.56, mountain: 0.26, sprint: 0.01, acceleration: 0.01 },
  },
  Mountain: {
    difficultyRange: [0.90, 2.60],
    easy: { hill: 0.10, mediumMountain: 0.25, mountain: 0.58, downhill: 0.05, sprint: 0.02 },
    hard: { hill: 0.04, mediumMountain: 0.16, mountain: 0.75, downhill: 0.04, sprint: 0.01 },
  },
  High_Mountain: {
    difficultyRange: [1.15, 2.30],
    easy: { hill: 0.05, mediumMountain: 0.16, mountain: 0.74, downhill: 0.05 },
    hard: { hill: 0.02, mediumMountain: 0.10, mountain: 0.84, downhill: 0.04 },
  },
  // Pflaster: nur zwei Referenzetappen, deshalb keine Ueberblendung.
  Cobble: {
    difficultyRange: [0.20, 0.35],
    easy: { cobble: 0.60, flat: 0.30, sprint: 0.10 },
    hard: { cobble: 0.60, flat: 0.30, sprint: 0.10 },
  },
  Cobble_Hill: {
    difficultyRange: [0.40, 0.95],
    easy: { cobble: 0.37, flat: 0.30, hill: 0.23, sprint: 0.10 },
    hard: { cobble: 0.37, flat: 0.20, hill: 0.33, sprint: 0.10 },
  },
  // Zeitfahren haben ihre eigene Formel; die Tabelle ist nur der Vollstaendigkeit halber besetzt.
  ITT: {
    difficultyRange: [0, 1],
    easy: { timeTrial: 1 },
    hard: { timeTrial: 1 },
  },
  TTT: {
    difficultyRange: [0, 1],
    easy: { timeTrial: 1 },
    hard: { timeTrial: 1 },
  },
};

/**
 * Gewicht der Ausdauer, als Vielfaches einer Faehigkeit.
 *
 * Vorher `km / 300`: bei 190 Kilometern 0,63 — mehr als Antritt und Flach
 * zusammen, und auf einer *kurzen* Bergetappe weniger als auf einer langen
 * Flachetappe. Dann `(km - 120) / 240`, also erst ab 120 Kilometern und bei
 * 300 Kilometern 0,75.
 *
 * Auch das war noch zu viel: 0,29 bei einer 190er Etappe stand gegen ein
 * Bergprofil, dessen groesstes Einzelgewicht 0,84 betraegt — die Ausdauer war
 * damit die zweitwichtigste Faehigkeit am Berg und schob Helfer mit gutem
 * Ausdauerwert nach vorne. Dieselbe Schwelle, halbe Steigung: bei 190
 * Kilometern 0,15, bei 300 Kilometern 0,375.
 */
export function resolveStaminaWeight(distanceKm: number): number {
  return Math.max(0, (distanceKm - 120) / 480);
}

/**
 * Abweichende Gewichte fuer Etappen eines Etappenrennens.
 *
 * `Hilly_Difficult` faellt dort ohne Flach-Anteil aus. Der Grund ist die
 * Rundfahrtwertung: eine schwere Huegeletappe ist in einem Etappenrennen eine
 * Vorentscheidung, bei der das Feld am Anstieg auseinanderfaellt — wer flach
 * stark ist, holt das nicht zurueck. In einem Eintagesrennen dagegen wird eine
 * solche Etappe oft geschlossen angefahren und im Finale entschieden, dort
 * bleibt der Flach-Anteil stehen.
 *
 * Das freigewordene Gewicht wird anteilig auf die uebrigen Faehigkeiten
 * verteilt, damit die Summe 1 bleibt und der Score seine Groessenordnung
 * behaelt.
 */
export const STAGE_RACE_SCORE_WEIGHTS: Partial<Record<StageProfile, ProfileScoreWeights>> = {
  Hilly_Difficult: {
    difficultyRange: [0.45, 1.10],
    easy: { hill: 0.82, mediumMountain: 0.10, sprint: 0.04, acceleration: 0.04 },
    hard: { hill: 0.64, mediumMountain: 0.30, sprint: 0.03, acceleration: 0.03 },
  },
};

/** Die fuer diese Etappe gueltige Gewichtstabelle. */
function resolveProfileWeights(profile: StageProfile, isStageRace: boolean): ProfileScoreWeights {
  return (isStageRace ? STAGE_RACE_SCORE_WEIGHTS[profile] : undefined) ?? PROFILE_SCORE_WEIGHTS[profile];
}

/** Lage der Etappe zwischen leichter und schwerer Auspraegung, 0 bis 1. */
export function resolveDifficultyPosition(
  profile: StageProfile,
  stageScore: number | null,
  distanceKm: number,
): number {
  const [low, high] = PROFILE_SCORE_WEIGHTS[profile].difficultyRange;
  if (stageScore == null || distanceKm <= 0 || high <= low) {
    return 0.5;
  }
  const difficulty = stageScore / distanceKm;
  return Math.min(1, Math.max(0, (difficulty - low) / (high - low)));
}

/** Gewichte einer konkreten Etappe: zwischen leicht und schwer ueberblendet. */
export function resolveStageScoreWeights(
  profile: StageProfile,
  stageScore: number | null,
  distanceKm: number,
  isStageRace = false,
): SkillWeights {
  const entry = resolveProfileWeights(profile, isStageRace);
  const position = resolveDifficultyPosition(profile, stageScore, distanceKm);
  const keys = new Set([...Object.keys(entry.easy), ...Object.keys(entry.hard)] as RiderSkillKey[]);
  const weights: SkillWeights = {};
  for (const key of keys) {
    const value = ((entry.easy[key] ?? 0) * (1 - position)) + ((entry.hard[key] ?? 0) * position);
    if (value > 0) {
      weights[key] = value;
    }
  }
  return weights;
}
