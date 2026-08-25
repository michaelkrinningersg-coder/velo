/**
 * Tests der Anpassungen. Gegen bekannte Wahrheiten: Daten mit vorgegebenen
 * Koeffizienten erzeugen und pruefen, ob die Anpassung sie wiederfindet.
 * Ein Fehler hier faelscht sonst still jeden Kalibrierparameter.
 */

import { describe, expect, it } from 'vitest';
import {
  bic,
  fitLinearWithGroupIntercepts,
  fitLogisticWithGroupIntercepts,
  fitTailShape,
  logisticLogLikelihood,
  median,
  moments,
  type BinomialObservation,
  type GroupedObservation,
} from './regression';

describe('fitLinearWithGroupIntercepts', () => {
  it('findet Achsenabschnitte und gemeinsame Steigung wieder', () => {
    const truth = { A: 2, B: -1, C: 0.5 };
    const slope = 1.75;
    const observations: GroupedObservation[] = [];
    for (const [group, intercept] of Object.entries(truth)) {
      for (let index = 0; index < 20; index += 1) {
        const x = index * 0.3;
        observations.push({ group, x, y: intercept + (slope * x), weight: 1 });
      }
    }
    const fit = fitLinearWithGroupIntercepts(observations);
    expect(fit.slope).toBeCloseTo(slope, 8);
    for (const [group, intercept] of Object.entries(truth)) {
      expect(fit.intercepts.get(group)).toBeCloseTo(intercept, 8);
    }
  });

  it('gewichtet Beobachtungen', () => {
    // Zwei widersprechende Punkte; der schwerere gibt die Steigung vor.
    const fit = fitLinearWithGroupIntercepts([
      { group: 'A', x: 0, y: 0, weight: 1 },
      { group: 'A', x: 1, y: 10, weight: 1000 },
      { group: 'A', x: 1, y: 0, weight: 1 },
    ]);
    expect(fit.slope).toBeGreaterThan(9);
  });

  it('liefert Steigung 0, wenn x nicht streut', () => {
    const fit = fitLinearWithGroupIntercepts([
      { group: 'A', x: 3, y: 1, weight: 1 },
      { group: 'A', x: 3, y: 5, weight: 1 },
    ]);
    expect(fit.slope).toBe(0);
    expect(fit.intercepts.get('A')).toBeCloseTo(3, 10);
  });

  it('kommt mit einer leeren Eingabe zurecht', () => {
    expect(fitLinearWithGroupIntercepts([]).intercepts.size).toBe(0);
  });
});

describe('fitLogisticWithGroupIntercepts', () => {
  it('findet Achsenabschnitte und gemeinsame Steigung wieder', () => {
    const truth = { Flach: 1.5, Berg: -1.0 };
    const slope = -3;
    const observations: BinomialObservation[] = [];
    for (const [group, intercept] of Object.entries(truth)) {
      for (let step = 0; step <= 20; step += 1) {
        const x = step * 0.1;
        const share = 1 / (1 + Math.exp(-(intercept + (slope * x))));
        observations.push({ group, x, share, trials: 200 });
      }
    }
    const fit = fitLogisticWithGroupIntercepts(observations, { iterations: 120_000, learningRate: 0.2 });
    expect(fit.slope).toBeCloseTo(slope, 1);
    expect(fit.intercepts.get('Flach')).toBeCloseTo(truth.Flach, 1);
    expect(fit.intercepts.get('Berg')).toBeCloseTo(truth.Berg, 1);
  });

  it('bewertet die bessere Modellform besser', () => {
    // Daten mit zwei verschiedenen Achsenabschnitten: ein gemeinsamer
    // Achsenabschnitt muss schlechter abschneiden.
    const observations: BinomialObservation[] = [];
    for (const [group, intercept] of Object.entries({ A: 2, B: -2 })) {
      for (let step = 0; step <= 10; step += 1) {
        const x = step * 0.1;
        observations.push({
          group, x, trials: 100,
          share: 1 / (1 + Math.exp(-(intercept - (2 * x)))),
        });
      }
    }
    const perGroup = fitLogisticWithGroupIntercepts(observations, { iterations: 60_000, learningRate: 0.2 });
    const pooled = fitLogisticWithGroupIntercepts(
      observations.map((entry) => ({ ...entry, group: 'alle' })),
      { iterations: 60_000, learningRate: 0.2 },
    );
    const n = observations.length;
    const bicPerGroup = bic(logisticLogLikelihood(observations, perGroup), 3, n);
    const bicPooled = bic(
      logisticLogLikelihood(observations.map((entry) => ({ ...entry, group: 'alle' })), pooled),
      2, n,
    );
    expect(bicPerGroup).toBeLessThan(bicPooled);
  });

  it('kommt mit einer leeren Eingabe zurecht', () => {
    expect(fitLogisticWithGroupIntercepts([]).slope).toBe(0);
  });
});

describe('fitTailShape', () => {
  it('findet die erzeugenden Parameter wieder', () => {
    const epsilon = 0.09;
    const exponent = 0.6;
    const points = Array.from({ length: 60 }, (_, index) => {
      const v = (index + 1) / 61;
      return { v, share: (epsilon * Math.pow(v, exponent)) / (1 - v + epsilon) };
    });
    const fit = fitTailShape(points);
    expect(fit.epsilon).toBeCloseTo(epsilon, 1);
    expect(fit.exponent).toBeCloseTo(exponent, 1);
    expect(fit.rmse).toBeLessThan(0.05);
  });

  it('faellt bei leerer Eingabe auf die gemessenen Werte zurueck', () => {
    expect(fitTailShape([]).rmse).toBe(Number.POSITIVE_INFINITY);
  });
});

describe('moments und median', () => {
  it('rechnen Mittel, Streuung und Median', () => {
    const result = moments([2, 4, 4, 4, 5, 5, 7, 9]);
    expect(result?.mean).toBeCloseTo(5, 10);
    // Stichprobenstreuung (n-1), nicht die der Grundgesamtheit.
    expect(result?.sd).toBeCloseTo(2.138, 3);
    expect(median([3, 1, 2])).toBe(2);
  });

  it('melden eine leere Eingabe, statt zu raten', () => {
    expect(moments([])).toBeNull();
    expect(median([])).toBeNull();
  });

  it('geben bei einem einzigen Wert keine Streuung vor', () => {
    expect(moments([7])).toEqual({ mean: 7, sd: 0, n: 1 });
  });
});
