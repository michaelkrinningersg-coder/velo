import { describe, expect, it } from 'vitest';
import {
  buildFinishGroups,
  drawBeta,
  drawFinishRegime,
  drawFirstGroupShare,
  drawGamma,
  drawStandardNormal,
  resolveBetaParameters,
  resolveBunchProbability,
  resolveDifficultyPerKm,
  resolveFirstGroupShareMean,
  resolveFirstGroupSize,
  resolveWinnerTimeSeconds,
} from '../../../shared/quickSim/groupModel';
import { DEFAULT_QUICK_SIM_PROFILES } from '../../../shared/quickSimProfiles';
import { createSeededRandom } from '../../../shared/rng';

function moments(values: number[]): { mean: number; sd: number } {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / (values.length - 1);
  return { mean, sd: Math.sqrt(variance) };
}

describe('resolveDifficultyPerKm', () => {
  it('teilt den Etappenwert durch die Distanz', () => {
    expect(resolveDifficultyPerKm(200, 160)).toBeCloseTo(1.25, 10);
  });

  it('faellt auf 0 zurueck, wenn Wert oder Distanz fehlen', () => {
    expect(resolveDifficultyPerKm(null, 160)).toBe(0);
    expect(resolveDifficultyPerKm(200, 0)).toBe(0);
    expect(resolveDifficultyPerKm(200, -5)).toBe(0);
  });
});

describe('resolveBunchProbability', () => {
  it('trifft die gemessenen Randbereiche', () => {
    // Flache Etappe, sehr geringe Schwierigkeit je km → fast immer geschlossen.
    const flat = resolveBunchProbability(DEFAULT_QUICK_SIM_PROFILES.Flat, 0.1);
    expect(flat).toBeGreaterThan(0.6);
    // Hochgebirge, hohe Schwierigkeit → praktisch nie.
    const high = resolveBunchProbability(DEFAULT_QUICK_SIM_PROFILES.High_Mountain, 1.8);
    expect(high).toBeLessThan(0.01);
  });

  it('faellt monoton mit der Schwierigkeit', () => {
    const parameters = DEFAULT_QUICK_SIM_PROFILES.Hilly;
    const values = [0.1, 0.3, 0.5, 0.8, 1.2].map((d) => resolveBunchProbability(parameters, d));
    for (let index = 1; index < values.length; index += 1) {
      expect(values[index]!).toBeLessThan(values[index - 1]!);
    }
  });

  it('bildet den Cobble-Sondereffekt ab', () => {
    // Kopfsteinpflaster zersprengt das Feld auch bei geringer Schwierigkeit —
    // genau dafuer ist der negative Achsenabschnitt da.
    const cobble = resolveBunchProbability(DEFAULT_QUICK_SIM_PROFILES.Cobble, 0.26);
    const flat = resolveBunchProbability(DEFAULT_QUICK_SIM_PROFILES.Flat, 0.26);
    expect(cobble).toBeLessThan(0.05);
    expect(flat).toBeGreaterThan(0.4);
  });

  it('liegt immer zwischen 0 und 1', () => {
    for (const parameters of Object.values(DEFAULT_QUICK_SIM_PROFILES)) {
      for (const difficulty of [0, 0.5, 1, 3, 10]) {
        const value = resolveBunchProbability(parameters, difficulty);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe('drawFinishRegime', () => {
  it('trifft die Wahrscheinlichkeit ueber viele Ziehungen', () => {
    const random = createSeededRandom(11);
    const parameters = DEFAULT_QUICK_SIM_PROFILES.Hilly;
    const difficulty = 0.4;
    const expected = resolveBunchProbability(parameters, difficulty);
    let bunched = 0;
    const draws = 20_000;
    for (let index = 0; index < draws; index += 1) {
      if (drawFinishRegime(random, parameters, difficulty) === 'bunched') {
        bunched += 1;
      }
    }
    expect(bunched / draws).toBeCloseTo(expected, 1);
  });
});

describe('Zufallsverteilungen', () => {
  it('drawStandardNormal hat Mittel 0 und Streuung 1', () => {
    const random = createSeededRandom(21);
    const values = Array.from({ length: 50_000 }, () => drawStandardNormal(random));
    const { mean, sd } = moments(values);
    expect(mean).toBeCloseTo(0, 1);
    expect(sd).toBeCloseTo(1, 1);
  });

  it('drawGamma trifft Erwartungswert und Varianz', () => {
    const random = createSeededRandom(22);
    for (const shape of [0.4, 1, 2.4, 8]) {
      const values = Array.from({ length: 20_000 }, () => drawGamma(random, shape));
      const { mean, sd } = moments(values);
      // Gamma(shape, 1): Erwartungswert = shape, Varianz = shape
      expect(mean).toBeGreaterThan(shape * 0.94);
      expect(mean).toBeLessThan(shape * 1.06);
      expect(sd).toBeGreaterThan(Math.sqrt(shape) * 0.9);
      expect(sd).toBeLessThan(Math.sqrt(shape) * 1.1);
      expect(values.every((value) => value > 0)).toBe(true);
    }
  });

  it('drawBeta bleibt in [0, 1]', () => {
    const random = createSeededRandom(23);
    for (let index = 0; index < 5_000; index += 1) {
      const value = drawBeta(random, 0.408, 4.025);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });
});

describe('resolveFirstGroupShareMean', () => {
  it('nimmt bei geschlossener Ankunft den gemessenen Profilwert', () => {
    // Flat kommt geschlossen mit 0,858 an, Cobble_Hill nur mit 0,624 —
    // ein gepoolter Wert war der groesste Fehler der ersten Fassung.
    expect(resolveFirstGroupShareMean(DEFAULT_QUICK_SIM_PROFILES.Flat, 'bunched', 0.1))
      .toBeCloseTo(0.8575, 4);
    expect(resolveFirstGroupShareMean(DEFAULT_QUICK_SIM_PROFILES.Cobble_Hill, 'bunched', 0.5))
      .toBeCloseTo(0.6237, 4);
  });

  it('faellt im zerfallenen Regime mit der Schwierigkeit', () => {
    const parameters = DEFAULT_QUICK_SIM_PROFILES.Hilly;
    const values = [0.2, 0.5, 1.0, 2.0].map((d) => resolveFirstGroupShareMean(parameters, 'split', d));
    for (let index = 1; index < values.length; index += 1) {
      expect(values[index]!).toBeLessThan(values[index - 1]!);
    }
  });

  it('trifft die Bergprofile, an denen die erste Fassung scheiterte', () => {
    // Beobachtet 0,022 bis 0,034; die gepoolte Fassung sagte 0,092 voraus.
    const high = resolveFirstGroupShareMean(DEFAULT_QUICK_SIM_PROFILES.High_Mountain, 'split', 1.8);
    expect(high).toBeGreaterThan(0.005);
    expect(high).toBeLessThan(0.045);
  });

  it('bleibt in sinnvollen Grenzen', () => {
    for (const parameters of Object.values(DEFAULT_QUICK_SIM_PROFILES)) {
      for (const difficulty of [0, 0.01, 1, 5, 50]) {
        for (const regime of ['bunched', 'split'] as const) {
          const value = resolveFirstGroupShareMean(parameters, regime, difficulty);
          expect(value).toBeGreaterThanOrEqual(0.005);
          expect(value).toBeLessThanOrEqual(0.98);
        }
      }
    }
  });
});

describe('resolveBetaParameters', () => {
  it('erzeugt Parameter, die Mittelwert und Streuung reproduzieren', () => {
    const { alpha, beta } = resolveBetaParameters(0.3, 0.5);
    expect(alpha / (alpha + beta)).toBeCloseTo(0.3, 6);
    const variance = (alpha * beta) / (((alpha + beta) ** 2) * (alpha + beta + 1));
    expect(Math.sqrt(variance)).toBeCloseTo(0.3 * 0.5, 3);
  });

  it('haelt alpha und beta positiv, auch bei absurder Streuung', () => {
    for (const mean of [0.005, 0.05, 0.5, 0.9]) {
      for (const relativeSd of [0.1, 0.694, 5]) {
        const { alpha, beta } = resolveBetaParameters(mean, relativeSd);
        expect(alpha).toBeGreaterThan(0);
        expect(beta).toBeGreaterThan(0);
      }
    }
  });
});

describe('drawFirstGroupShare', () => {
  it('trifft den erwarteten Mittelwert bei geschlossener Ankunft', () => {
    const random = createSeededRandom(31);
    const parameters = DEFAULT_QUICK_SIM_PROFILES.Flat;
    const values = Array.from({ length: 30_000 }, () => drawFirstGroupShare(random, parameters, 'bunched', 0.1));
    expect(moments(values).mean).toBeCloseTo(0.8575, 2);
  });

  it('trifft den erwarteten Mittelwert im zerfallenen Regime', () => {
    const random = createSeededRandom(32);
    const parameters = DEFAULT_QUICK_SIM_PROFILES.High_Mountain;
    const expected = resolveFirstGroupShareMean(parameters, 'split', 1.8);
    const values = Array.from({ length: 30_000 }, () => drawFirstGroupShare(random, parameters, 'split', 1.8));
    expect(moments(values).mean).toBeCloseTo(expected, 2);
  });

  it('trennt die beiden Regime deutlich', () => {
    const random = createSeededRandom(33);
    const parameters = DEFAULT_QUICK_SIM_PROFILES.Hilly;
    const bunched = Array.from({ length: 2_000 }, () => drawFirstGroupShare(random, parameters, 'bunched', 0.4));
    const split = Array.from({ length: 2_000 }, () => drawFirstGroupShare(random, parameters, 'split', 0.4));
    expect(moments(bunched).mean).toBeGreaterThan(moments(split).mean + 0.5);
  });
});

describe('resolveFirstGroupSize', () => {
  it('rundet auf ganze Fahrer und bleibt im Feld', () => {
    expect(resolveFirstGroupSize(0.833, 180)).toBe(150);
    expect(resolveFirstGroupSize(1.5, 180)).toBe(180);
    expect(resolveFirstGroupSize(0.0001, 180)).toBe(1);
    expect(resolveFirstGroupSize(0.5, 0)).toBe(0);
  });
});

describe('buildFinishGroups', () => {
  const parameters = DEFAULT_QUICK_SIM_PROFILES.Hilly;
  const scores = Array.from({ length: 60 }, (_, index) => 100 - (index * 0.7));

  it('gibt jeden Fahrer genau einer Gruppe', () => {
    const groups = buildFinishGroups({
      scoresDescending: scores,
      firstGroupSize: 20,
      distanceKm: 180,
      parameters,
      random: createSeededRandom(41),
    });
    const all = groups.flatMap((group) => group.memberIndices).sort((a, b) => a - b);
    expect(all).toEqual(Array.from({ length: scores.length }, (_, index) => index));
  });

  it('setzt die erste Gruppe auf die vorgegebene Groesse und ohne Rueckstand', () => {
    const groups = buildFinishGroups({
      scoresDescending: scores,
      firstGroupSize: 20,
      distanceKm: 180,
      parameters,
      random: createSeededRandom(42),
    });
    expect(groups[0]!.memberIndices).toHaveLength(20);
    expect(groups[0]!.gapSeconds).toBe(0);
  });

  it('vergibt streng wachsende Rueckstaende', () => {
    const groups = buildFinishGroups({
      scoresDescending: scores,
      firstGroupSize: 10,
      distanceKm: 180,
      parameters,
      random: createSeededRandom(43),
    });
    for (let index = 1; index < groups.length; index += 1) {
      expect(groups[index]!.gapSeconds).toBeGreaterThan(groups[index - 1]!.gapSeconds);
    }
  });

  it('liefert eine einzige Gruppe, wenn das ganze Feld geschlossen ankommt', () => {
    const groups = buildFinishGroups({
      scoresDescending: scores,
      firstGroupSize: scores.length,
      distanceKm: 180,
      parameters,
      random: createSeededRandom(44),
    });
    expect(groups).toHaveLength(1);
    expect(groups[0]!.memberIndices).toHaveLength(scores.length);
  });

  it('zerfaellt am Berg staerker als im Flachen', () => {
    // Gleiche Scores, gleiche Gruppengroesse — nur andere Profilparameter.
    const flatGroups = buildFinishGroups({
      scoresDescending: scores,
      firstGroupSize: 5,
      distanceKm: 180,
      parameters: DEFAULT_QUICK_SIM_PROFILES.Flat,
      random: createSeededRandom(45),
    });
    const mountainGroups = buildFinishGroups({
      scoresDescending: scores,
      firstGroupSize: 5,
      distanceKm: 180,
      parameters: DEFAULT_QUICK_SIM_PROFILES.High_Mountain,
      random: createSeededRandom(45),
    });
    const lastGap = (groups: ReturnType<typeof buildFinishGroups>) =>
      groups[groups.length - 1]!.gapSeconds;
    expect(lastGap(mountainGroups)).toBeGreaterThan(lastGap(flatGroups));
  });

  it('verkraftet ein leeres Feld und einen einzelnen Fahrer', () => {
    expect(buildFinishGroups({
      scoresDescending: [], firstGroupSize: 0, distanceKm: 180, parameters, random: createSeededRandom(46),
    })).toEqual([]);
    const single = buildFinishGroups({
      scoresDescending: [80], firstGroupSize: 1, distanceKm: 180, parameters, random: createSeededRandom(47),
    });
    expect(single).toHaveLength(1);
    expect(single[0]!.memberIndices).toEqual([0]);
  });

  it('ist bei gleichem Seed reproduzierbar', () => {
    const build = () => buildFinishGroups({
      scoresDescending: scores,
      firstGroupSize: 12,
      distanceKm: 180,
      parameters,
      random: createSeededRandom(48),
    });
    expect(build()).toEqual(build());
  });
});

describe('resolveWinnerTimeSeconds', () => {
  it('trifft die Referenzgeschwindigkeit im Mittel', () => {
    const random = createSeededRandom(51);
    const parameters = DEFAULT_QUICK_SIM_PROFILES.Flat;
    const distanceKm = 180;
    const speeds = Array.from({ length: 5_000 }, () =>
      distanceKm / (resolveWinnerTimeSeconds(random, parameters, distanceKm) / 3600));
    expect(moments(speeds).mean).toBeCloseTo(parameters.baseSpeedKmh, 0);
  });

  it('ist bei Distanz 0 ebenfalls 0', () => {
    expect(resolveWinnerTimeSeconds(createSeededRandom(52), DEFAULT_QUICK_SIM_PROFILES.Flat, 0)).toBe(0);
  });

  it('braucht am Berg laenger als im Flachen', () => {
    const flat = resolveWinnerTimeSeconds(createSeededRandom(53), DEFAULT_QUICK_SIM_PROFILES.Flat, 180);
    const mountain = resolveWinnerTimeSeconds(createSeededRandom(53), DEFAULT_QUICK_SIM_PROFILES.High_Mountain, 180);
    expect(mountain).toBeGreaterThan(flat);
  });
});
