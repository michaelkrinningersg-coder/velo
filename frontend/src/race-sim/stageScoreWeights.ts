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
  /**
   * Gewichte in der Mitte der Spanne. Nur die Bergprofile fuehren sie; ohne
   * sie wird geradlinig von `easy` nach `hard` ueberblendet, mit ihr in zwei
   * Abschnitten ueber sie hinweg.
   */
  middle?: SkillWeights;
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
 *
 * Fuer die fuenf Bergprofile stehen die Anteile von `hill`, `mediumMountain`
 * und `mountain` seit der Vorgabe fest, und zwar an drei Stuetzstellen: am
 * unteren Ende der Spanne, in ihrer Mitte und am oberen Ende. Oben gilt
 * dabei die Verteilung, mit der das *naechste* Terrain unten anfaengt — so
 * geht die Leiter ohne Sprung ineinander ueber:
 *
 *   Terrain            unten            Mitte            oben
 *   Hilly              100 /  0 /  0    75 / 25 /  0     65 / 35 /  0
 *   Hilly_Difficult     65 / 35 /  0    45 / 45 / 10     25 / 60 / 15
 *   Medium_Mountain     25 / 60 / 15    25 / 50 / 25      5 / 40 / 55
 *   Mountain             5 / 40 / 55     0 / 25 / 75      0 /  0 / 100
 *   High_Mountain        0 /  0 / 100    0 /  0 / 100     0 /  0 / 100
 *
 * Zwischen den Stuetzstellen wird geradlinig ueberblendet, in zwei
 * Abschnitten ueber die Mitte hinweg. Oberhalb des Hochgebirges kommt kein
 * Terrain mehr, dort steht oben dieselbe Verteilung wie unten.
 *
 * Alles andere am Score bleibt, wie es war: Flach, Sprint, Antritt und
 * Abfahrt behalten ihre Gewichte und werden weiter mit ueberblendet; was
 * nach ihnen uebrig ist, wird nach den Anteilen oben verteilt. `Flat`,
 * `Rolling` und die beiden Pflasterprofile sind gar nicht betroffen.
 *
 * Die Spannen (`difficultyRange`) sind zugleich die Grenzen, nach denen die
 * Etappen der Rundfahrten eingestuft werden — Profil und Ueberblendung
 * benutzen damit dieselbe Leiter. Die Grenzen stammen aus 826 echten
 * Grand-Tour-Etappen: jeweils die Mitte zwischen dem oberen Quartil des
 * einen und dem unteren Quartil des naechsten Terrains.
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
    difficultyRange: [0.30, 0.45],
    easy: { flat: 0.50, hill: 0.40, sprint: 0.06, acceleration: 0.04 },
    middle: { flat: 0.39, hill: 0.39, mediumMountain: 0.13, sprint: 0.055, acceleration: 0.035 },
    hard: { flat: 0.28, hill: 0.416, mediumMountain: 0.224, sprint: 0.05, acceleration: 0.03 },
  },
  Hilly_Difficult: {
    difficultyRange: [0.45, 0.87],
    easy: { flat: 0.29, hill: 0.4225, mediumMountain: 0.2275, sprint: 0.03, acceleration: 0.03 },
    middle: { flat: 0.19, hill: 0.3375, mediumMountain: 0.3375, mountain: 0.075, sprint: 0.03, acceleration: 0.03 },
    hard: { flat: 0.09, hill: 0.2125, mediumMountain: 0.51, mountain: 0.1275, sprint: 0.03, acceleration: 0.03 },
  },
  Medium_Mountain: {
    difficultyRange: [0.87, 1.40],
    easy: { hill: 0.2425, mediumMountain: 0.582, mountain: 0.1455, sprint: 0.02, acceleration: 0.01 },
    middle: { hill: 0.2437, mediumMountain: 0.4876, mountain: 0.2437, sprint: 0.015, acceleration: 0.01 },
    hard: { hill: 0.049, mediumMountain: 0.392, mountain: 0.539, sprint: 0.01, acceleration: 0.01 },
  },
  Mountain: {
    difficultyRange: [1.40, 1.95],
    easy: { hill: 0.0465, mediumMountain: 0.372, mountain: 0.5115, downhill: 0.05, sprint: 0.02 },
    middle: { mediumMountain: 0.235, mountain: 0.705, downhill: 0.045, sprint: 0.015 },
    hard: { mountain: 0.95, downhill: 0.04, sprint: 0.01 },
  },
  High_Mountain: {
    // Oberhalb des Hochgebirges kommt kein Terrain mehr, deshalb steht am
    // oberen Ende dieselbe Verteilung wie am unteren.
    difficultyRange: [1.95, 3.20],
    easy: { mountain: 0.95, downhill: 0.05 },
    middle: { mountain: 0.955, downhill: 0.045 },
    hard: { mountain: 0.96, downhill: 0.04 },
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
    difficultyRange: [0.45, 0.87],
    easy: { hill: 0.598, mediumMountain: 0.322, sprint: 0.04, acceleration: 0.04 },
    middle: { hill: 0.4185, mediumMountain: 0.4185, mountain: 0.093, sprint: 0.035, acceleration: 0.035 },
    hard: { hill: 0.235, mediumMountain: 0.564, mountain: 0.141, sprint: 0.03, acceleration: 0.03 },
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

/** Zwei Gewichtssaetze geradlinig mischen. */
function mische(links: SkillWeights, rechts: SkillWeights, anteil: number): SkillWeights {
  const keys = new Set([...Object.keys(links), ...Object.keys(rechts)] as RiderSkillKey[]);
  const weights: SkillWeights = {};
  for (const key of keys) {
    const value = ((links[key] ?? 0) * (1 - anteil)) + ((rechts[key] ?? 0) * anteil);
    if (value > 0) {
      weights[key] = value;
    }
  }
  return weights;
}

/**
 * Gewichte einer konkreten Etappe.
 *
 * Mit einer Mitte wird in zwei Abschnitten ueberblendet — von `easy` zur
 * Mitte und von der Mitte nach `hard`. Damit sitzen alle drei Stuetzstellen
 * exakt, statt dass die Gerade die Mitte ueberspringt. Ohne Mitte bleibt es
 * bei der einen Geraden von `easy` nach `hard`.
 */
export function resolveStageScoreWeights(
  profile: StageProfile,
  stageScore: number | null,
  distanceKm: number,
  isStageRace = false,
): SkillWeights {
  const entry = resolveProfileWeights(profile, isStageRace);
  const position = resolveDifficultyPosition(profile, stageScore, distanceKm);
  if (entry.middle == null) {
    return mische(entry.easy, entry.hard, position);
  }
  return position <= 0.5
    ? mische(entry.easy, entry.middle, position * 2)
    : mische(entry.middle, entry.hard, (position - 0.5) * 2);
}
