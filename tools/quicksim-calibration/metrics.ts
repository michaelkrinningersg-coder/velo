/**
 * Kennzahlen eines Etappenlaufs — reine Funktionen ohne Datenbank, ohne Engine.
 *
 * Diese Datei ist die Messlatte, gegen die die Quick Simulation kalibriert
 * wird. Sie beschreibt ein Etappenergebnis in Zahlen, die beide Modi liefern
 * koennen; die Kalibrierung minimiert spaeter die Differenz zwischen den
 * Kennzahlen der Instant-Sim (Referenz) und denen der Quick Sim.
 *
 * Bewusst frei von Abhaengigkeiten, damit die Kennzahlen fuer sich testbar
 * sind — die Fehler, die man hier macht, faelscht man sonst still in jede
 * Kalibrierung hinein.
 */

import { TIME_TIE_THRESHOLD_SECONDS } from '../../shared/stageResultRules';

/** Raenge, deren Rueckstand auf den Sieger erfasst wird. */
export const TRACKED_GAP_RANKS = [2, 5, 10, 20, 50, 100] as const;

/**
 * Relative Positionen im Feld, deren Rueckstand ebenfalls erfasst wird.
 *
 * Feste Raenge reichen fuer den Kopf, nicht fuer das Ende. Der Vergleich der
 * Quick Sim mit der Instant-Sim ist genau daran haengen geblieben: auf einer
 * Flachetappe liegt Rang 100 bei 11 Sekunden zurueck, der letzte Fahrer bei
 * 892 — und *wo* dazwischen der Sprung passiert, sagt keine der bisherigen
 * Kennzahlen. Gemessen an einer Sonde beginnt er bei 109 km um Rang 172 von
 * 183, bei 235 km schon um Rang 130 von 178: das Ende des Feldes wird
 * abgehaengt, und wie frueh, haengt an der Etappe.
 *
 * Relative Positionen sind dafuer das richtige Mass, weil sie weder von der
 * Feldgroesse noch von der Zahl der Aufgaben abhaengen.
 */
export const TRACKED_FIELD_POSITIONS = [0.5, 0.75, 0.9, 0.95, 0.99] as const;

export interface FinisherObservation {
  riderId: number;
  /** Zielzeit in Sekunden. */
  finishTimeSeconds: number;
}

export interface StageRunObservation {
  finishers: FinisherObservation[];
  dnfCount: number;
  otlCount: number;
  /** Fahrer-IDs der vorberechneten Ausreissergruppe (leer, wenn keine). */
  breakawayRiderIds: number[];
  /** Kilometer, an dem die Ausreisser gestellt werden. null = ueberlebt. */
  breakawayCatchKm: number | null;
  /**
   * Fahrer-IDs in der Reihenfolge der Favoritenwertung *vor* dem Rennen.
   * Grundlage der Rangkorrelation.
   */
  favouriteRiderIdsInOrder: number[];
}

export interface StageRunMetrics {
  winnerTimeSeconds: number;
  finisherCount: number;
  dnfCount: number;
  otlCount: number;
  /** Rueckstand auf den Sieger je verfolgtem Rang; null, wenn es den Rang nicht gibt. */
  gapSecondsByRank: Record<number, number | null>;
  /**
   * Rueckstand auf den Sieger an relativen Positionen im Feld. Erst diese
   * Kurve macht das abgehaengte Ende sichtbar.
   */
  gapSecondsByFieldPosition: Record<number, number | null>;
  lastFinisherGapSeconds: number | null;
  /** Anzahl Fahrer in der ersten Zeitgruppe (1-Sekunden-Regel). */
  firstGroupSize: number;
  timeGroupCount: number;
  /** Groesste Zeitgruppe der Etappe — auf Flachetappen typischerweise das Feld. */
  largestGroupSize: number;
  breakawaySurvived: boolean | null;
  /**
   * Spearman-Rangkorrelation zwischen Favoritenrang vor dem Rennen und
   * Zielrang. Die wichtigste Kennzahl: sie misst, wie stark das Ergebnis
   * vorhersagbar ist. Eine Quick Sim, die hier deutlich hoeher liegt als die
   * Instant-Sim, ist zu deterministisch — dann gewinnen immer dieselben.
   */
  favouriteSpearman: number | null;
}

/**
 * Teilt aufsteigend sortierte Zielzeiten nach der 1-Sekunden-Regel in
 * Zeitgruppen. Ein Fahrer gehoert zur laufenden Gruppe, wenn sein Abstand zum
 * *Vordermann* hoechstens TIME_TIE_THRESHOLD_SECONDS betraegt — dieselbe Regel
 * wie in normalizeRoadStageTimeGroups.
 */
export function computeTimeGroupSizes(sortedFinishTimesSeconds: number[]): number[] {
  if (sortedFinishTimesSeconds.length === 0) {
    return [];
  }

  const sizes: number[] = [];
  let currentSize = 1;
  for (let index = 1; index < sortedFinishTimesSeconds.length; index += 1) {
    const gapToPredecessor = sortedFinishTimesSeconds[index]! - sortedFinishTimesSeconds[index - 1]!;
    if (gapToPredecessor <= TIME_TIE_THRESHOLD_SECONDS) {
      currentSize += 1;
      continue;
    }
    sizes.push(currentSize);
    currentSize = 1;
  }
  sizes.push(currentSize);
  return sizes;
}

/**
 * Raenge mit Mittelung bei Bindungen (1, 2.5, 2.5, 4 …). Ohne diese
 * Behandlung verzerren gleiche Werte die Korrelation.
 */
export function rankWithTies(values: number[]): number[] {
  const order = values
    .map((value, index) => ({ value, index }))
    .sort((left, right) => left.value - right.value);

  const ranks = new Array<number>(values.length);
  let position = 0;
  while (position < order.length) {
    let end = position;
    while (end + 1 < order.length && order[end + 1]!.value === order[position]!.value) {
      end += 1;
    }
    const averageRank = (position + end) / 2 + 1;
    for (let index = position; index <= end; index += 1) {
      ranks[order[index]!.index] = averageRank;
    }
    position = end + 1;
  }
  return ranks;
}

/** Spearman-Rangkorrelation. Gibt null zurueck, wenn eine Seite keine Varianz hat. */
export function spearmanRankCorrelation(left: number[], right: number[]): number | null {
  if (left.length !== right.length || left.length < 3) {
    return null;
  }

  const leftRanks = rankWithTies(left);
  const rightRanks = rankWithTies(right);
  const n = left.length;
  const meanRank = (n + 1) / 2;

  let covariance = 0;
  let leftVariance = 0;
  let rightVariance = 0;
  for (let index = 0; index < n; index += 1) {
    const leftDeviation = leftRanks[index]! - meanRank;
    const rightDeviation = rightRanks[index]! - meanRank;
    covariance += leftDeviation * rightDeviation;
    leftVariance += leftDeviation * leftDeviation;
    rightVariance += rightDeviation * rightDeviation;
  }

  if (leftVariance === 0 || rightVariance === 0) {
    return null;
  }
  return covariance / Math.sqrt(leftVariance * rightVariance);
}

/** Verdichtet einen Etappenlauf zu den Kennzahlen aus dem Kalibrierabschnitt. */
export function computeStageRunMetrics(observation: StageRunObservation): StageRunMetrics | null {
  const finishers = [...observation.finishers].sort(
    (left, right) => left.finishTimeSeconds - right.finishTimeSeconds,
  );
  if (finishers.length === 0) {
    return null;
  }

  const winnerTimeSeconds = finishers[0]!.finishTimeSeconds;
  const finishTimes = finishers.map((entry) => entry.finishTimeSeconds);
  const groupSizes = computeTimeGroupSizes(finishTimes);

  const gapSecondsByRank: Record<number, number | null> = {};
  for (const rank of TRACKED_GAP_RANKS) {
    const entry = finishers[rank - 1];
    gapSecondsByRank[rank] = entry ? entry.finishTimeSeconds - winnerTimeSeconds : null;
  }

  const gapSecondsByFieldPosition: Record<number, number | null> = {};
  for (const position of TRACKED_FIELD_POSITIONS) {
    // Aufrunden, damit Position 1,0 der letzte Fahrer waere und 0,5 bei
    // ungerader Feldgroesse nicht nach vorne rutscht.
    const index = Math.min(finishers.length - 1, Math.max(0, Math.ceil(position * finishers.length) - 1));
    const entry = finishers[index];
    gapSecondsByFieldPosition[position] = entry ? entry.finishTimeSeconds - winnerTimeSeconds : null;
  }

  return {
    winnerTimeSeconds,
    finisherCount: finishers.length,
    dnfCount: observation.dnfCount,
    otlCount: observation.otlCount,
    gapSecondsByRank,
    gapSecondsByFieldPosition,
    lastFinisherGapSeconds: finishers[finishers.length - 1]!.finishTimeSeconds - winnerTimeSeconds,
    firstGroupSize: groupSizes[0] ?? 0,
    timeGroupCount: groupSizes.length,
    largestGroupSize: groupSizes.reduce((best, size) => Math.max(best, size), 0),
    breakawaySurvived: observation.breakawayRiderIds.length === 0
      ? null
      : observation.breakawayCatchKm === null,
    favouriteSpearman: resolveFavouriteSpearman(finishers, observation.favouriteRiderIdsInOrder),
  };
}

function resolveFavouriteSpearman(
  finishersSortedByTime: FinisherObservation[],
  favouriteRiderIdsInOrder: number[],
): number | null {
  if (favouriteRiderIdsInOrder.length === 0) {
    return null;
  }

  const favouritePositionByRiderId = new Map<number, number>();
  favouriteRiderIdsInOrder.forEach((riderId, index) => {
    favouritePositionByRiderId.set(riderId, index + 1);
  });

  // Nur Fahrer, die in beiden Listen vorkommen — Nichtstarter und Fahrer ohne
  // Favoritenwert wuerden die Korrelation sonst kuenstlich verduennen.
  const favouritePositions: number[] = [];
  const finishPositions: number[] = [];
  finishersSortedByTime.forEach((entry, index) => {
    const favouritePosition = favouritePositionByRiderId.get(entry.riderId);
    if (favouritePosition === undefined) {
      return;
    }
    favouritePositions.push(favouritePosition);
    finishPositions.push(index + 1);
  });

  return spearmanRankCorrelation(favouritePositions, finishPositions);
}

export interface Distribution {
  n: number;
  mean: number;
  median: number;
  sd: number;
  p10: number;
  p90: number;
}

/** Verteilungskennzahlen ueber mehrere Laeufe. Ignoriert null-Werte. */
export function summarize(values: Array<number | null>): Distribution | null {
  const clean = values.filter((value): value is number => value !== null && Number.isFinite(value));
  if (clean.length === 0) {
    return null;
  }

  const sorted = [...clean].sort((left, right) => left - right);
  const mean = clean.reduce((sum, value) => sum + value, 0) / clean.length;
  const variance = clean.length < 2
    ? 0
    : clean.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / (clean.length - 1);

  return {
    n: clean.length,
    mean,
    median: quantile(sorted, 0.5),
    sd: Math.sqrt(variance),
    p10: quantile(sorted, 0.1),
    p90: quantile(sorted, 0.9),
  };
}

function quantile(sortedValues: number[], fraction: number): number {
  if (sortedValues.length === 1) {
    return sortedValues[0]!;
  }
  const position = (sortedValues.length - 1) * fraction;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  const weight = position - lowerIndex;
  return (sortedValues[lowerIndex]! * (1 - weight)) + (sortedValues[upperIndex]! * weight);
}
