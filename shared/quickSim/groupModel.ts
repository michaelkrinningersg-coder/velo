/**
 * Gruppenmodell der Quick Simulation.
 *
 * Bestimmt, wie sich ein Feld am Ziel verteilt: kommt es geschlossen an oder
 * zerfaellt es, wie gross ist die erste Zeitgruppe, und wie gross sind die
 * Abstaende dahinter.
 *
 * Alle Kennwerte stammen aus einem Referenzlauf ueber 63 Etappen und 3.150
 * Etappenlaeufe der Instant-Simulation (siehe tools/quicksim-calibration).
 * Reine Funktionen ohne Datenbank und ohne Engine — der Zufall wird
 * hereingereicht, damit jeder Aufruf reproduzierbar ist.
 */

import {
  BUNCHED_SHARE_RELATIVE_SD,
  BUNCH_SLOPE,
  SPLIT_SHARE_RELATIVE_SD,
  SPLIT_SHARE_SLOPE,
  type QuickSimProfileParameters,
} from '../quickSimProfiles';
import { randomBetween, type RandomSource } from '../rng';

export type FinishRegime = 'bunched' | 'split';

/**
 * Schwierigkeit je Kilometer. Der eine Wert, der am besten vorhersagt, ob das
 * Feld geschlossen ankommt (Rangkorrelation -0,71 ueber 53 Strassenetappen).
 */
export function resolveDifficultyPerKm(stageScore: number | null, distanceKm: number): number {
  if (stageScore == null || distanceKm <= 0) {
    return 0;
  }
  return stageScore / distanceKm;
}

/**
 * Wahrscheinlichkeit einer geschlossenen Ankunft.
 *
 * Aus einer gewichteten logistischen Regression mit Achsenabschnitt je Profil
 * und gemeinsamer Steigung. Diese Form schlug sowohl das Modell mit einem
 * einzigen Achsenabschnitt als auch das mit log-Schwierigkeit deutlich
 * (BIC 1863 gegen 2130 und 2218).
 */
export function resolveBunchProbability(
  parameters: QuickSimProfileParameters,
  difficultyPerKm: number,
): number {
  const z = parameters.bunchIntercept + (BUNCH_SLOPE * difficultyPerKm);
  return 1 / (1 + Math.exp(-z));
}

export function drawFinishRegime(
  random: RandomSource,
  parameters: QuickSimProfileParameters,
  difficultyPerKm: number,
): FinishRegime {
  return random() < resolveBunchProbability(parameters, difficultyPerKm) ? 'bunched' : 'split';
}

/**
 * Standardnormalverteilte Zufallszahl (Box-Muller). Wird fuer die
 * Gamma-Ziehung und das Rauschen der Gruppenabstaende gebraucht.
 */
export function drawStandardNormal(random: RandomSource): number {
  // u darf nicht 0 sein, sonst ist der Logarithmus nicht definiert.
  const u = 1 - random();
  const v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * Gamma-verteilte Zufallszahl nach Marsaglia und Tsang (2000).
 * Fuer shape < 1 mit dem ueblichen Potenz-Trick auf shape + 1 zurueckgefuehrt.
 */
export function drawGamma(random: RandomSource, shape: number): number {
  if (shape < 1) {
    return drawGamma(random, shape + 1) * Math.pow(random(), 1 / shape);
  }

  const d = shape - (1 / 3);
  const c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x = 0;
    let v = 0;
    do {
      x = drawStandardNormal(random);
      v = 1 + (c * x);
    } while (v <= 0);

    v = v * v * v;
    const u = random();
    if (u < 1 - (0.0331 * x * x * x * x)) {
      return d * v;
    }
    if (Math.log(u) < (0.5 * x * x) + (d * (1 - v + Math.log(v)))) {
      return d * v;
    }
  }
}

/** Beta-verteilte Zufallszahl ueber zwei Gamma-Ziehungen. */
export function drawBeta(random: RandomSource, alpha: number, beta: number): number {
  const a = drawGamma(random, alpha);
  const b = drawGamma(random, beta);
  const sum = a + b;
  return sum === 0 ? 0.5 : a / sum;
}

/** Kleinster und groesster zulaessiger Anteil, damit die Beta-Ziehung definiert bleibt. */
const MIN_SHARE = 0.005;
const MAX_SHARE = 0.98;

/**
 * Erwarteter Anteil der ersten Zeitgruppe je Regime.
 *
 * Beide haengen vom Profil ab — ein gepoolter Mittelwert war der groesste
 * Fehler der ersten Fassung: er sagte fuer alle Bergprofile 0,092 voraus,
 * beobachtet waren 0,022 bis 0,034, und fuer Flat 0,772 statt 0,858. Im
 * zerfallenen Regime kommt die Schwierigkeit je Kilometer hinzu.
 */
export function resolveFirstGroupShareMean(
  parameters: QuickSimProfileParameters,
  regime: FinishRegime,
  difficultyPerKm: number,
): number {
  if (regime === 'bunched') {
    return Math.min(MAX_SHARE, Math.max(MIN_SHARE, parameters.bunchedShareMean));
  }
  const logDifficulty = Math.log(Math.max(0.01, difficultyPerKm));
  const mean = parameters.splitShareIntercept + (SPLIT_SHARE_SLOPE * logDifficulty);
  return Math.min(0.5, Math.max(MIN_SHARE, mean));
}

/**
 * Beta-Parameter aus Mittelwert und relativer Streuung (Momentenmethode).
 * Die Varianz wird gedeckelt, damit alpha und beta positiv bleiben.
 */
export function resolveBetaParameters(mean: number, relativeSd: number): { alpha: number; beta: number } {
  const clampedMean = Math.min(MAX_SHARE, Math.max(MIN_SHARE, mean));
  const maxVariance = clampedMean * (1 - clampedMean) * 0.98;
  const variance = Math.min(maxVariance, (clampedMean * relativeSd) ** 2);
  const concentration = ((clampedMean * (1 - clampedMean)) / variance) - 1;
  return { alpha: clampedMean * concentration, beta: (1 - clampedMean) * concentration };
}

/** Anteil der Finisher in der ersten Zeitgruppe. */
export function drawFirstGroupShare(
  random: RandomSource,
  parameters: QuickSimProfileParameters,
  regime: FinishRegime,
  difficultyPerKm: number,
): number {
  const mean = resolveFirstGroupShareMean(parameters, regime, difficultyPerKm);
  const relativeSd = regime === 'bunched' ? BUNCHED_SHARE_RELATIVE_SD : SPLIT_SHARE_RELATIVE_SD;
  const { alpha, beta } = resolveBetaParameters(mean, relativeSd);
  return drawBeta(random, alpha, beta);
}

/** Groesse der ersten Zeitgruppe. Mindestens ein Fahrer, hoechstens das Feld. */
export function resolveFirstGroupSize(share: number, finisherCount: number): number {
  if (finisherCount <= 0) {
    return 0;
  }
  return Math.min(finisherCount, Math.max(1, Math.round(share * finisherCount)));
}

export interface FinishGroup {
  /** Indizes in die nach Score absteigend sortierte Fahrerliste. */
  memberIndices: number[];
  /** Rueckstand der Gruppe auf den Sieger in Sekunden. */
  gapSeconds: number;
}

export interface BuildFinishGroupsInput {
  /** Leistungsscores, absteigend sortiert. */
  scoresDescending: readonly number[];
  firstGroupSize: number;
  distanceKm: number;
  parameters: QuickSimProfileParameters;
  random: RandomSource;
}

/**
 * Teilt das Feld hinter der ersten Zeitgruppe in weitere Gruppen und vergibt
 * die Abstaende.
 *
 * Die erste Gruppe ist durch `firstGroupSize` gesetzt (sie kommt aus der
 * Regime-Ziehung, nicht aus den Scores). Dahinter beginnt eine neue Gruppe,
 * wenn der Score-Abstand zum Vordermann groesser ist als der mittlere Abstand
 * im verbleibenden Feld — so entstehen am Berg viele kleine Gruppen und im
 * Flachen wenige grosse, ohne einen zweiten freien Parameter.
 */
export function buildFinishGroups(input: BuildFinishGroupsInput): FinishGroup[] {
  const { scoresDescending, firstGroupSize, distanceKm, parameters, random } = input;
  const riderCount = scoresDescending.length;
  if (riderCount === 0) {
    return [];
  }

  const headSize = Math.min(riderCount, Math.max(1, firstGroupSize));
  const groups: FinishGroup[] = [{
    memberIndices: Array.from({ length: headSize }, (_, index) => index),
    gapSeconds: 0,
  }];
  if (headSize >= riderCount) {
    return groups;
  }

  // Mittlerer Score-Abstand im Feld hinter der ersten Gruppe.
  const tailStart = headSize;
  const tailSpan = (scoresDescending[tailStart - 1] as number) - (scoresDescending[riderCount - 1] as number);
  const averageStep = tailSpan / Math.max(1, riderCount - tailStart);

  let current: FinishGroup = { memberIndices: [tailStart], gapSeconds: 0 };
  for (let index = tailStart + 1; index < riderCount; index += 1) {
    const step = (scoresDescending[index - 1] as number) - (scoresDescending[index] as number);
    if (step > averageStep && current.memberIndices.length > 0) {
      groups.push(current);
      current = { memberIndices: [index], gapSeconds: 0 };
      continue;
    }
    current.memberIndices.push(index);
  }
  groups.push(current);

  // Abstaende aus den Score-Differenzen der Gruppenkoepfe.
  for (let groupIndex = 1; groupIndex < groups.length; groupIndex += 1) {
    const previousHead = groups[groupIndex - 1]!.memberIndices[0] as number;
    const head = groups[groupIndex]!.memberIndices[0] as number;
    const scoreGap = Math.max(0, (scoresDescending[previousHead] as number) - (scoresDescending[head] as number));
    const noise = 1 + (drawStandardNormal(random) * parameters.noiseSigma);
    const delta = parameters.gapFactor
      * Math.pow(scoreGap, parameters.gapExponent)
      * distanceKm
      * Math.max(0.1, noise);
    groups[groupIndex]!.gapSeconds = groups[groupIndex - 1]!.gapSeconds + Math.max(1, delta);
  }

  return groups;
}

/**
 * Siegerzeit in Sekunden. Haengt praktisch nicht von den Fahrern ab, sondern
 * an Distanz und Profil — deshalb getrennt vom Rueckstandsmodell kalibriert.
 * Die Referenzgeschwindigkeiten sind gemessen.
 */
export function resolveWinnerTimeSeconds(
  random: RandomSource,
  parameters: QuickSimProfileParameters,
  distanceKm: number,
): number {
  if (distanceKm <= 0) {
    return 0;
  }
  // Leichte Streuung um die Referenzgeschwindigkeit, damit nicht jede Ausgabe
  // derselben Etappe dieselbe Siegerzeit hat.
  const speedKmh = parameters.baseSpeedKmh * randomBetween(random, 0.97, 1.03);
  return (distanceKm / speedKmh) * 3600;
}
