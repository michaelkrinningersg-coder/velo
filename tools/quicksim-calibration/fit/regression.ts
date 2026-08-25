/**
 * Die Anpassungen hinter den Kalibrierparametern.
 *
 * Reine Funktionen, ohne Datei und ohne Simulation — damit sie fuer sich
 * pruefbar sind. Die Fehler, die man hier macht, faelscht man sonst still in
 * jeden Parameter hinein.
 *
 * Zwei Formen kommen vor, beide mit *einem Achsenabschnitt je Gruppe und
 * gemeinsamer Steigung*: so viel Profilabhaengigkeit wie noetig, so wenig
 * freie Parameter wie moeglich.
 */

export interface GroupedObservation {
  /** Profil, Wetter, was auch immer die Gruppe ist. */
  group: string;
  x: number;
  /** Beobachteter Wert; bei der logistischen Form ein Anteil in [0,1]. */
  y: number;
  /** Gewicht, etwa die Zahl der Laeufe hinter der Beobachtung. */
  weight: number;
}

export interface GroupedFit {
  intercepts: Map<string, number>;
  slope: number;
}

/**
 * Gewichtete lineare Anpassung y = a(gruppe) + b*x.
 *
 * Geschlossen loesbar: zieht man innerhalb jeder Gruppe die gewichteten
 * Mittelwerte ab, faellt der Achsenabschnitt heraus und die gemeinsame
 * Steigung ist die uebliche Kovarianzformel. Danach ergeben sich die
 * Achsenabschnitte aus den Gruppenmitteln.
 */
export function fitLinearWithGroupIntercepts(observations: readonly GroupedObservation[]): GroupedFit {
  const byGroup = new Map<string, GroupedObservation[]>();
  for (const observation of observations) {
    const bucket = byGroup.get(observation.group) ?? [];
    bucket.push(observation);
    byGroup.set(observation.group, bucket);
  }

  const means = new Map<string, { x: number; y: number }>();
  for (const [group, bucket] of byGroup) {
    let weight = 0;
    let sumX = 0;
    let sumY = 0;
    for (const observation of bucket) {
      weight += observation.weight;
      sumX += observation.weight * observation.x;
      sumY += observation.weight * observation.y;
    }
    means.set(group, weight > 0 ? { x: sumX / weight, y: sumY / weight } : { x: 0, y: 0 });
  }

  let covariance = 0;
  let variance = 0;
  for (const observation of observations) {
    const mean = means.get(observation.group) as { x: number; y: number };
    const centeredX = observation.x - mean.x;
    covariance += observation.weight * centeredX * (observation.y - mean.y);
    variance += observation.weight * centeredX * centeredX;
  }
  const slope = variance === 0 ? 0 : covariance / variance;

  const intercepts = new Map<string, number>();
  for (const [group, mean] of means) {
    intercepts.set(group, mean.y - (slope * mean.x));
  }
  return { intercepts, slope };
}

export interface BinomialObservation {
  group: string;
  x: number;
  /** Anteil der Treffer. */
  share: number;
  /** Zahl der Versuche hinter dem Anteil. */
  trials: number;
}

export interface LogisticFitOptions {
  iterations?: number;
  learningRate?: number;
}

/**
 * Gewichtete logistische Anpassung logit(p) = a(gruppe) + b*x.
 *
 * Kein geschlossener Ausdruck, deshalb Gradientenaufstieg auf der
 * Binomial-Log-Likelihood. Jede Beobachtung traegt mit ihrer Zahl an Versuchen
 * bei — eine Etappe mit 50 Laeufen zaehlt mehr als eine mit fuenf.
 */
export function fitLogisticWithGroupIntercepts(
  observations: readonly BinomialObservation[],
  options: LogisticFitOptions = {},
): GroupedFit {
  const iterations = options.iterations ?? 60_000;
  const learningRate = options.learningRate ?? 0.05;

  const groups = [...new Set(observations.map((observation) => observation.group))];
  const intercepts = new Map<string, number>(groups.map((group) => [group, 0]));
  let slope = 0;
  const totalTrials = observations.reduce((sum, observation) => sum + observation.trials, 0);
  if (totalTrials === 0) {
    return { intercepts, slope };
  }

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const gradientIntercept = new Map<string, number>(groups.map((group) => [group, 0]));
    const trialsByGroup = new Map<string, number>(groups.map((group) => [group, 0]));
    let gradientSlope = 0;

    for (const observation of observations) {
      const z = (intercepts.get(observation.group) as number) + (slope * observation.x);
      const predicted = 1 / (1 + Math.exp(-z));
      const residual = (observation.share - predicted) * observation.trials;
      gradientIntercept.set(observation.group, (gradientIntercept.get(observation.group) as number) + residual);
      trialsByGroup.set(observation.group, (trialsByGroup.get(observation.group) as number) + observation.trials);
      gradientSlope += residual * observation.x;
    }

    for (const group of groups) {
      const trials = trialsByGroup.get(group) as number;
      if (trials > 0) {
        intercepts.set(
          group,
          (intercepts.get(group) as number) + ((learningRate * (gradientIntercept.get(group) as number)) / trials),
        );
      }
    }
    slope += (learningRate * gradientSlope) / totalTrials;
  }

  return { intercepts, slope };
}

/** Log-Likelihood der Anpassung — fuer den Vergleich zweier Modellformen. */
export function logisticLogLikelihood(
  observations: readonly BinomialObservation[],
  fit: GroupedFit,
): number {
  let total = 0;
  for (const observation of observations) {
    const z = (fit.intercepts.get(observation.group) ?? 0) + (fit.slope * observation.x);
    const predicted = Math.min(1 - 1e-12, Math.max(1e-12, 1 / (1 + Math.exp(-z))));
    const hits = observation.share * observation.trials;
    total += (hits * Math.log(predicted)) + ((observation.trials - hits) * Math.log(1 - predicted));
  }
  return total;
}

/** Bayessches Informationskriterium. Kleiner ist besser. */
export function bic(logLikelihood: number, parameterCount: number, observationCount: number): number {
  return (parameterCount * Math.log(observationCount)) - (2 * logLikelihood);
}

export interface Moments {
  mean: number;
  sd: number;
  n: number;
}

export function moments(values: readonly number[]): Moments | null {
  if (values.length === 0) {
    return null;
  }
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  if (values.length === 1) {
    return { mean, sd: 0, n: 1 };
  }
  const variance = values.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / (values.length - 1);
  return { mean, sd: Math.sqrt(variance), n: values.length };
}

export function median(values: readonly number[]): number | null {
  if (values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)] as number;
}

/**
 * Form der Rueckstandskurve hinter der ersten Zeitgruppe:
 * anteil(v) = eps * v^alpha / (1 - v + eps).
 *
 * Rastersuche im Log-Raum. Die Kurve ist in beiden Parametern nicht linear und
 * das Raster ist billig — 11.000 Messpunkte kosten Millisekunden.
 */
export function fitTailShape(
  points: readonly { v: number; share: number }[],
): { epsilon: number; exponent: number; rmse: number } {
  let best = { epsilon: 0.081, exponent: 0.5, rmse: Number.POSITIVE_INFINITY };
  if (points.length === 0) {
    return best;
  }
  for (let epsilon = 0.02; epsilon < 1.5; epsilon *= 1.06) {
    for (let exponent = 0.2; exponent < 2.0; exponent += 0.05) {
      let sum = 0;
      for (const point of points) {
        const predicted = (epsilon * Math.pow(point.v, exponent)) / (1 - point.v + epsilon);
        sum += (Math.log(predicted) - Math.log(point.share)) ** 2;
      }
      const rmse = Math.sqrt(sum / points.length);
      if (rmse < best.rmse) {
        best = { epsilon, exponent, rmse };
      }
    }
  }
  return best;
}
