import { describe, expect, it } from 'vitest';
import {
  computeStageRunMetrics,
  computeTimeGroupSizes,
  rankWithTies,
  spearmanRankCorrelation,
  summarize,
} from './metrics';

describe('computeTimeGroupSizes', () => {
  it('fasst Fahrer innerhalb einer Sekunde zum Vordermann zusammen', () => {
    // 0.0 / 0.5 / 1.0 haengen zusammen (je <= 1s zum Vordermann), 5.0 nicht.
    expect(computeTimeGroupSizes([0, 0.5, 1, 5])).toEqual([3, 1]);
  });

  it('kettet Gruppen ueber den Vordermann, nicht ueber den Gruppenkopf', () => {
    // Jeder Abstand ist 1s, der Gesamtabstand 3s — trotzdem eine Gruppe.
    // Genau so verhaelt sich normalizeRoadStageTimeGroups im Commit-Dienst.
    expect(computeTimeGroupSizes([0, 1, 2, 3])).toEqual([4]);
  });

  it('behandelt ein Einzelergebnis und eine leere Liste', () => {
    expect(computeTimeGroupSizes([42])).toEqual([1]);
    expect(computeTimeGroupSizes([])).toEqual([]);
  });

  it('zaehlt jeden Fahrer genau einmal', () => {
    const times = [0, 0.5, 4, 4.2, 4.9, 20, 60, 60.5];
    const sizes = computeTimeGroupSizes(times);
    expect(sizes.reduce((sum, size) => sum + size, 0)).toBe(times.length);
  });
});

describe('rankWithTies', () => {
  it('mittelt Raenge bei Gleichstand', () => {
    expect(rankWithTies([10, 20, 20, 30])).toEqual([1, 2.5, 2.5, 4]);
  });

  it('vergibt bei durchweg gleichen Werten denselben mittleren Rang', () => {
    expect(rankWithTies([7, 7, 7])).toEqual([2, 2, 2]);
  });
});

describe('spearmanRankCorrelation', () => {
  it('ist 1 bei identischer Ordnung', () => {
    expect(spearmanRankCorrelation([1, 2, 3, 4], [10, 20, 30, 40])).toBeCloseTo(1, 10);
  });

  it('ist -1 bei umgekehrter Ordnung', () => {
    expect(spearmanRankCorrelation([1, 2, 3, 4], [40, 30, 20, 10])).toBeCloseTo(-1, 10);
  });

  it('liefert null ohne Varianz auf einer Seite', () => {
    expect(spearmanRankCorrelation([1, 1, 1, 1], [1, 2, 3, 4])).toBeNull();
  });

  it('liefert null bei zu wenigen oder ungleich langen Reihen', () => {
    expect(spearmanRankCorrelation([1, 2], [1, 2])).toBeNull();
    expect(spearmanRankCorrelation([1, 2, 3], [1, 2])).toBeNull();
  });
});

describe('computeStageRunMetrics', () => {
  const favouriteRiderIdsInOrder = [1, 2, 3, 4, 5];

  it('berechnet Siegerzeit, Rueckstaende und Zeitgruppen', () => {
    const metrics = computeStageRunMetrics({
      finishers: [
        { riderId: 1, finishTimeSeconds: 1000 },
        { riderId: 2, finishTimeSeconds: 1000.4 },
        { riderId: 3, finishTimeSeconds: 1030 },
        { riderId: 4, finishTimeSeconds: 1090 },
        { riderId: 5, finishTimeSeconds: 1300 },
      ],
      dnfCount: 2,
      otlCount: 1,
      breakawayRiderIds: [4, 5],
      breakawayCatchKm: 120,
      favouriteRiderIdsInOrder,
    });

    expect(metrics).not.toBeNull();
    expect(metrics!.winnerTimeSeconds).toBe(1000);
    expect(metrics!.finisherCount).toBe(5);
    expect(metrics!.dnfCount).toBe(2);
    expect(metrics!.otlCount).toBe(1);
    expect(metrics!.gapSecondsByRank[2]).toBeCloseTo(0.4, 6);
    expect(metrics!.gapSecondsByRank[5]).toBe(300);
    expect(metrics!.lastFinisherGapSeconds).toBe(300);
    expect(metrics!.firstGroupSize).toBe(2);
    expect(metrics!.timeGroupCount).toBe(4);
    expect(metrics!.largestGroupSize).toBe(2);
  });

  it('meldet null fuer Raenge, die es nicht gibt', () => {
    const metrics = computeStageRunMetrics({
      finishers: [
        { riderId: 1, finishTimeSeconds: 900 },
        { riderId: 2, finishTimeSeconds: 950 },
      ],
      dnfCount: 0,
      otlCount: 0,
      breakawayRiderIds: [],
      breakawayCatchKm: null,
      favouriteRiderIdsInOrder,
    });

    expect(metrics!.gapSecondsByRank[2]).toBe(50);
    expect(metrics!.gapSecondsByRank[10]).toBeNull();
    expect(metrics!.gapSecondsByRank[100]).toBeNull();
  });

  it('unterscheidet ueberlebte, gestellte und fehlende Ausreissergruppe', () => {
    const base = {
      finishers: [
        { riderId: 1, finishTimeSeconds: 900 },
        { riderId: 2, finishTimeSeconds: 950 },
        { riderId: 3, finishTimeSeconds: 980 },
      ],
      dnfCount: 0,
      otlCount: 0,
      favouriteRiderIdsInOrder,
    };

    expect(computeStageRunMetrics({ ...base, breakawayRiderIds: [2], breakawayCatchKm: null })!.breakawaySurvived)
      .toBe(true);
    expect(computeStageRunMetrics({ ...base, breakawayRiderIds: [2], breakawayCatchKm: 140 })!.breakawaySurvived)
      .toBe(false);
    expect(computeStageRunMetrics({ ...base, breakawayRiderIds: [], breakawayCatchKm: null })!.breakawaySurvived)
      .toBeNull();
  });

  it('korreliert perfekt, wenn die Favoriten in ihrer Reihenfolge ankommen', () => {
    const metrics = computeStageRunMetrics({
      finishers: [
        { riderId: 1, finishTimeSeconds: 900 },
        { riderId: 2, finishTimeSeconds: 910 },
        { riderId: 3, finishTimeSeconds: 920 },
        { riderId: 4, finishTimeSeconds: 930 },
        { riderId: 5, finishTimeSeconds: 940 },
      ],
      dnfCount: 0,
      otlCount: 0,
      breakawayRiderIds: [],
      breakawayCatchKm: null,
      favouriteRiderIdsInOrder,
    });
    expect(metrics!.favouriteSpearman).toBeCloseTo(1, 10);
  });

  it('ignoriert Finisher ohne Favoritenwert', () => {
    // Fahrer 99 steht nicht in der Favoritenliste und darf die Korrelation
    // nicht verduennen — die restlichen vier kommen in Favoritenreihenfolge an.
    const metrics = computeStageRunMetrics({
      finishers: [
        { riderId: 99, finishTimeSeconds: 890 },
        { riderId: 1, finishTimeSeconds: 900 },
        { riderId: 2, finishTimeSeconds: 910 },
        { riderId: 3, finishTimeSeconds: 920 },
        { riderId: 4, finishTimeSeconds: 930 },
      ],
      dnfCount: 0,
      otlCount: 0,
      breakawayRiderIds: [],
      breakawayCatchKm: null,
      favouriteRiderIdsInOrder,
    });
    expect(metrics!.favouriteSpearman).toBeCloseTo(1, 10);
  });

  it('liefert null ohne Finisher', () => {
    expect(computeStageRunMetrics({
      finishers: [],
      dnfCount: 180,
      otlCount: 0,
      breakawayRiderIds: [],
      breakawayCatchKm: null,
      favouriteRiderIdsInOrder,
    })).toBeNull();
  });
});

describe('summarize', () => {
  it('berechnet Mittel, Median und Streuung', () => {
    const distribution = summarize([2, 4, 4, 4, 5, 5, 7, 9]);
    expect(distribution!.n).toBe(8);
    expect(distribution!.mean).toBeCloseTo(5, 10);
    expect(distribution!.median).toBeCloseTo(4.5, 10);
    expect(distribution!.sd).toBeCloseTo(2.138, 3);
  });

  it('ueberspringt null und nicht-endliche Werte', () => {
    const distribution = summarize([1, null, 3, Number.NaN, 5]);
    expect(distribution!.n).toBe(3);
    expect(distribution!.mean).toBeCloseTo(3, 10);
  });

  it('liefert null, wenn nichts uebrig bleibt', () => {
    expect(summarize([null, null])).toBeNull();
    expect(summarize([])).toBeNull();
  });
});
