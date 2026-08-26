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
  BUNCHED_SHARE_SLOPE,
  BUNCH_SLOPE,
  SPLIT_SHARE_SLOPE,
  FIRST_GROUP_MAX_SIZE,
  FIRST_GROUP_SOFT_KNEE,
  MEASURED_GAP_SIGMA_CLAMP,
  MEASURED_STAGE_GAP_MODEL,
  TAIL_GROUP_SHAPE_END,
  TAIL_GROUP_SHAPE_PEAK,
  TAIL_GROUP_SHAPE_PEAK_FACTOR,
  TAIL_GROUP_SHAPE_PROFILES,
  TAIL_GROUP_SHAPE_START,
  resolveSplitShareRelativeSd,
  resolveTailShape,
  type QuickSimProfileParameters,
} from '../quickSimProfiles';
import { randomBetween, type RandomSource } from '../rng';
import { TIME_TIE_THRESHOLD_SECONDS } from '../stageResultRules';
import type { StageProfile } from '../types';

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
 * beobachtet waren 0,022 bis 0,034, und fuer Flat 0,772 statt 0,858.
 *
 * Und beide haengen an der Schwierigkeit je Kilometer, nicht nur am Profil:
 * eine leichte Flachetappe bringt ein groesseres Feld geschlossen ins Ziel als
 * eine schwere. Innerhalb eines Profils gemessen liegt die Rangkorrelation bei
 * -0,42 bis -0,59.
 */
export function resolveFirstGroupShareMean(
  parameters: QuickSimProfileParameters,
  regime: FinishRegime,
  difficultyPerKm: number,
): number {
  const logDifficulty = Math.log(Math.max(0.01, difficultyPerKm));
  if (regime === 'bunched') {
    const mean = parameters.bunchedShareIntercept + (BUNCHED_SHARE_SLOPE * logDifficulty);
    return Math.min(MAX_SHARE, Math.max(MIN_SHARE, mean));
  }
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
  profile?: StageProfile,
): number {
  const mean = resolveFirstGroupShareMean(parameters, regime, difficultyPerKm);
  const relativeSd = regime === 'bunched' ? BUNCHED_SHARE_RELATIVE_SD : resolveSplitShareRelativeSd(profile);
  const { alpha, beta } = resolveBetaParameters(mean, relativeSd);
  return drawBeta(random, alpha, beta);
}

/**
 * Groesse der ersten Zeitgruppe. Mindestens ein Fahrer, hoechstens das Feld —
 * am Berg zusaetzlich gedeckelt, siehe `FIRST_GROUP_MAX_SIZE`.
 */
export function resolveFirstGroupSize(share: number, finisherCount: number, profile?: StageProfile): number {
  if (finisherCount <= 0) {
    return 0;
  }
  const roh = Math.max(1, Math.round(share * finisherCount));
  const grenze = profile != null ? FIRST_GROUP_MAX_SIZE[profile] : undefined;
  if (grenze == null) {
    return Math.min(finisherCount, roh);
  }
  const knie = FIRST_GROUP_SOFT_KNEE[profile!] ?? grenze;
  const breite = Math.max(1, grenze - knie);
  const gedaempft = roh <= knie
    ? roh
    : grenze - (breite * Math.exp(-(roh - knie) / breite));
  return Math.min(finisherCount, grenze, Math.max(1, Math.round(gedaempft)));
}

export interface FinishGroup {
  /** Indizes in die nach Score absteigend sortierte Fahrerliste. */
  memberIndices: number[];
  /** Rueckstand der Gruppe auf den Sieger in Sekunden. */
  gapSeconds: number;
}

/**
 * Lognormaler Streufaktor um 1, gestutzt auf `MEASURED_GAP_SIGMA_CLAMP` Sigma.
 *
 * Ohne die Stutzung zieht eine Standardnormalverteilung gelegentlich vier
 * Sigma — bei sigma 0,6 waere das der Faktor 11, und eine Huegeletappe haette
 * die Abstaende eines Hochgebirgstages.
 */
export function drawLogNormalFactor(random: RandomSource, sigma: number): number {
  if (sigma <= 0) {
    return 1;
  }
  const z = Math.min(MEASURED_GAP_SIGMA_CLAMP, Math.max(-MEASURED_GAP_SIGMA_CLAMP, drawStandardNormal(random)));
  return Math.exp(sigma * z);
}

/**
 * Rueckstand des letzten Fahrers je Kilometer.
 *
 * Fuer die fuenf an echten Rennen angepassten Profile aus Schwierigkeit und
 * Ziehung, sonst der feste Profilwert. Siehe `MEASURED_STAGE_GAP_MODEL`.
 */
export function resolveTailGapPerKm(
  parameters: QuickSimProfileParameters,
  difficultyPerKm: number,
  random: RandomSource,
  profile?: StageProfile,
): number {
  const modell = profile != null ? MEASURED_STAGE_GAP_MODEL[profile] : undefined;
  if (modell == null) {
    return parameters.tailGapPerKm;
  }
  const basis = Math.exp((modell.gapSlope * difficultyPerKm) + modell.gapIntercept);
  return basis * drawLogNormalFactor(random, modell.gapSigma);
}

/** Mittlere Groesse der Zeitgruppen hinter der Spitze — analog zum Rueckstand. */
export function resolveTailGroupSize(
  parameters: QuickSimProfileParameters,
  difficultyPerKm: number,
  random: RandomSource,
  profile?: StageProfile,
): number {
  const modell = profile != null ? MEASURED_STAGE_GAP_MODEL[profile] : undefined;
  if (modell == null) {
    return parameters.tailGroupSize;
  }
  const basis = Math.exp((modell.groupSlope * difficultyPerKm) + modell.groupIntercept);
  return Math.max(1, basis * drawLogNormalFactor(random, modell.groupSigma));
}

/**
 * Formfaktor auf die Gruppengroesse an der Position `v` hinter der Spitze.
 *
 * Drei Stuetzstellen, geradlinig verbunden: klein am Anfang, am groessten bei
 * `TAIL_GROUP_SHAPE_PEAK`, danach wieder kleiner. Profile ohne Eintrag
 * bekommen ueberall 1 und behalten damit ihre gleichmaessige Verteilung.
 */
export function resolveTailGroupShape(position: number, profile?: StageProfile): number {
  if (profile == null || !TAIL_GROUP_SHAPE_PROFILES.has(profile)) {
    return 1;
  }
  const v = Math.min(1, Math.max(0, position));
  return v <= TAIL_GROUP_SHAPE_PEAK
    ? TAIL_GROUP_SHAPE_START + ((TAIL_GROUP_SHAPE_PEAK_FACTOR - TAIL_GROUP_SHAPE_START) * (v / TAIL_GROUP_SHAPE_PEAK))
    : TAIL_GROUP_SHAPE_PEAK_FACTOR
      + ((TAIL_GROUP_SHAPE_END - TAIL_GROUP_SHAPE_PEAK_FACTOR) * ((v - TAIL_GROUP_SHAPE_PEAK) / (1 - TAIL_GROUP_SHAPE_PEAK)));
}

export interface BuildFinishGroupsInput {
  /**
   * Leistungsscores, absteigend sortiert. Nur die Laenge und die Reihenfolge
   * zaehlen — die Rueckstaende haengen an der Position im Feld, nicht an den
   * Score-Abstaenden.
   */
  scoresDescending: readonly number[];
  firstGroupSize: number;
  distanceKm: number;
  parameters: QuickSimProfileParameters;
  /** Entscheidet ueber die Form der Rueckstandskurve — siehe `resolveTailGapShare`. */
  profile?: StageProfile;
  /**
   * Schwierigkeit je Kilometer. Bestimmt bei den an echte Rennen angepassten
   * Profilen Hoehe der Kurve und Gruppengroesse — siehe
   * `MEASURED_STAGE_GAP_MODEL`. Ohne Angabe gelten die festen Profilwerte.
   */
  difficultyPerKm?: number;
  random: RandomSource;
}

/** Kleinster Abstand zwischen erster Zeitgruppe und dem Feld dahinter. */
const MIN_SPLIT_SECONDS = TIME_TIE_THRESHOLD_SECONDS + 1;

/**
 * Form der Rueckstandskurve hinter der ersten Zeitgruppe.
 *
 * `position` ist 0 direkt hinter der Spitzengruppe und 1 beim letzten Fahrer.
 * Der Wert ist der Anteil am Rueckstand des Letzten, also 1 bei position = 1.
 *
 * Welche der beiden Formen und mit welchen Parametern, steht je Profil in
 * `TAIL_SHAPE_BY_PROFILE`; ohne Eintrag gilt die gemessene Kurve aus dem
 * Referenzlauf. Beide Formen sind bei 0 exakt 0 und bei 1 exakt 1, die Hoehe
 * kommt in jedem Fall aus `tailGapPerKm`.
 */
export function resolveTailGapShare(position: number, profile?: StageProfile): number {
  const v = Math.min(1, Math.max(0, position));
  const { kind, exponent, weight } = resolveTailShape(profile);
  const front = Math.pow(v, exponent);
  return kind === 'sform'
    ? front / (front + (weight * (1 - v)))
    : (weight * front) / (1 - v + weight);
}

/**
 * Groesse einer Zeitgruppe im Feld hinter der Spitze.
 *
 * Geometrisch verteilt um den gemessenen Mittelwert: viele kleine Gruppen,
 * gelegentlich eine grosse. Das abgehaengte Ende faehrt nicht einzeln — ohne
 * diese Klumpung ergibt das Modell auf einer Flachetappe 28 Zeitgruppen statt
 * gemessener 11 und im Hochgebirge 174 statt 87.
 */
export function drawTailGroupSize(random: RandomSource, meanSize: number, remaining: number): number {
  if (remaining <= 1) {
    return Math.max(0, remaining);
  }
  const mean = Math.max(1, meanSize);
  if (mean <= 1) {
    return 1;
  }
  // u darf nicht 0 sein, sonst ist der Logarithmus nicht definiert.
  const draw = 1 + Math.floor(-Math.log(1 - random()) * (mean - 1));
  return Math.min(remaining, Math.max(1, draw));
}

/**
 * Vergibt die Rueckstaende hinter der ersten Zeitgruppe und bildet daraus die
 * Zeitgruppen.
 *
 * Die erste Gruppe ist durch `firstGroupSize` gesetzt — sie kommt aus der
 * Regime-Ziehung, nicht aus den Scores. Dahinter zerfaellt das Feld in weitere
 * Zeitgruppen von gemessener mittlerer Groesse, und jede bekommt ihren
 * Rueckstand aus ihrer *Position im Feld*, nicht aus dem Score-Abstand zum
 * Vordermann.
 *
 * Die Scores bestimmen damit nur noch die Reihenfolge. Das ist die zweite
 * Korrektur, die aus der Messung kam: der Rueckstand des letzten Fahrers ist
 * auf einer Flachetappe 185-mal so gross wie der von Rang 100, und die Scores
 * springen dort nicht. Was das Ende des Feldes verliert, haengt daran, *wie
 * weit hinten* es faehrt.
 *
 * Das Rauschen wirkt auf die Zuwaechse, nicht auf die Summe — sonst koennte
 * ein Fahrer den vor ihm liegenden ueberholen, und die Reihenfolge waere nicht
 * mehr die der Scores.
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

  const tailCount = riderCount - headSize;
  const difficultyPerKm = input.difficultyPerKm ?? 0;
  // Beide Ziehungen einmal je Etappe, vor der Schleife: sie beschreiben die
  // Etappe als Ganzes, nicht die einzelne Gruppe.
  const totalGapSeconds = resolveTailGapPerKm(parameters, difficultyPerKm, random, input.profile) * distanceKm;
  const tailGroupSize = resolveTailGroupSize(parameters, difficultyPerKm, random, input.profile);

  let index = headSize;
  let cumulative = 0;
  let previousShare = 0;
  while (index < riderCount) {
    // Die Gruppengroesse haengt an der Position: vorne faehrt jeder fuer sich,
    // in der zweiten Haelfte sammelt sich das Gruppetto.
    const form = resolveTailGroupShape((index - headSize) / tailCount, input.profile);
    const size = drawTailGroupSize(random, tailGroupSize * form, riderCount - index);
    const lastIndex = index + size - 1;
    // Die Gruppe sitzt auf der Kurve an der Position ihres letzten Fahrers —
    // damit trifft der Letzte im Feld genau `tailGapPerKm`.
    const share = resolveTailGapShare((lastIndex - headSize + 1) / tailCount, input.profile);
    const noise = 1 + (drawStandardNormal(random) * parameters.noiseSigma);
    const step = totalGapSeconds * (share - previousShare) * Math.max(0.05, noise);
    previousShare = share;
    // Die erste Gruppe hinter der Spitze muss sichtbar dahinter liegen, sonst
    // waere die gezogene Spitzengruppe durch die 1-Sekunden-Regel wieder
    // aufgehoben.
    cumulative += index === headSize ? Math.max(MIN_SPLIT_SECONDS, step) : Math.max(0, step);

    groups.push({
      memberIndices: Array.from({ length: size }, (_, offset) => index + offset),
      gapSeconds: cumulative,
    });
    index = lastIndex + 1;
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
