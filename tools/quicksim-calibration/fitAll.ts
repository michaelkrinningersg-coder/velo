/**
 * Leitet alle gemessenen Parameter der Quick Simulation aus einem
 * Referenzdatensatz her.
 *
 * Bis hierher stammte jeder Wert in `data/csv/quick_sim_profiles.csv` aus
 * Wegwerf-Skripten: einmal ausgerechnet, von Hand eingetragen, danach nicht
 * mehr nachvollziehbar. Nach vier Referenzlaeufen — Wetterkorrektur,
 * Mutationsfehler — war das nicht mehr tragbar. Ein Datensatz, aus dem sich
 * die Parameter nicht per Befehl herleiten lassen, veraltet still.
 *
 * Zwei Stufen:
 *
 *   A  aus den Daten allein: Geschwindigkeit, Regime-Ziehung, Anteile der
 *      ersten Zeitgruppe, Hoehe und Form der Rueckstandskurve
 *   B  ueber die Quick Simulation: Klumpung des Feldendes und das
 *      Zeitfahrmodell — beide lassen sich nicht ablesen, sondern nur gegen
 *      ihre Zielgroesse fitten
 *
 * Ungemessen bleiben `noise_sigma`, `incident_loss_multiplier`,
 * `severe_dnf_chance`, `breakaway_shrink_exponent` und
 * `mass_crash_involvement`; sie werden unveraendert uebernommen.
 *
 * Aufruf:
 *   npm run calibrate:fit -- --in=debug/quicksim-reference-v4
 *   npm run calibrate:fit -- --in=... --write     schreibt die CSV
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import {
  buildStageBootstrap,
  createBootstrapContext,
  migrateSavegame,
  pinStageSeed,
  resolveRunSeed,
} from './bootstrap';
import { computeStageRunMetrics, type StageRunMetrics } from './metrics';
import { runQuickStage } from './quickSimAdapter';
import { calculateStageFavoriteRiderRanking } from '../../frontend/src/race-sim/stageFavorites';
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
} from './fit/regression';
import {
  DEFAULT_QUICK_SIM_PROFILES,
  type QuickSimProfileParameters,
} from '../../shared/quickSimProfiles';
import type { RealtimeSimulationBootstrap, StageProfile } from '../../shared/types';

/** Ab diesem Anteil der Finisher in der ersten Zeitgruppe gilt ein Lauf als geschlossene Ankunft. */
const BUNCH_SHARE_THRESHOLD = 0.5;
/** Zeitfahren haben kein Gruppenmodell. */
const ROAD_ONLY = (profile: string): boolean => profile !== 'ITT' && profile !== 'TTT';
const TIME_TRIAL_ONLY = (profile: string): boolean => !ROAD_ONLY(profile);

const SLOPE_GRID = Array.from({ length: 24 }, (_, index) => 0.0010 + (index * 0.0010));
const NOISE_GRID = Array.from({ length: 20 }, (_, index) => 0.005 + (index * 0.005));
const MIN_GROUP_SIZE = 1;
const MAX_GROUP_SIZE = 40;
const BISECTION_STEPS = 16;

interface StageReferenceFile {
  stage: { stageId: number; profile: string; stageScore: number | null; distanceKm: number | null };
  weatherId: number | null;
  runs: StageRunMetrics[];
}

interface StageWork {
  stageScore: number | null;
  distanceKm: number;
  stageSeed: number;
  bootstrap: RealtimeSimulationBootstrap;
  /** Favoritenwertung vor dem Rennen — Bezugsgroesse der Rangkorrelation. */
  favouriteRiderIdsInOrder: number[];
}

function withSilencedConsole<T>(run: () => T): T {
  const original = { log: console.log, warn: console.warn, info: console.info, debug: console.debug };
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.debug = () => {};
  try {
    return run();
  } finally {
    Object.assign(console, original);
  }
}

// ---------------------------------------------------------------- Stufe A

interface DataFits {
  baseSpeedKmh: Map<string, number>;
  bunchIntercepts: Map<string, number>;
  bunchSlope: number;
  bunchedShareIntercept: Map<string, number>;
  bunchedShareRelativeSd: number;
  splitShareIntercepts: Map<string, number>;
  splitShareSlope: number;
  splitShareRelativeSd: number;
  tailGapPerKm: Map<string, number>;
  tailShape: { epsilon: number; exponent: number; rmse: number };
  regimeComparison: Array<{ label: string; logLikelihood: number; parameters: number; bic: number }>;
}

function fitFromData(references: readonly StageReferenceFile[]): DataFits {
  const speeds = new Map<string, number[]>();
  const lastGaps = new Map<string, number[]>();
  const bunchedShares = new Map<string, number[]>();
  const splitShares = new Map<string, Array<{ share: number; difficulty: number }>>();
  const binomial: BinomialObservation[] = [];
  const tailPoints: Array<{ v: number; share: number }> = [];

  const push = <T>(map: Map<string, T[]>, key: string, value: T): void => {
    const bucket = map.get(key) ?? [];
    bucket.push(value);
    map.set(key, bucket);
  };

  for (const reference of references) {
    const { profile, stageScore, distanceKm } = reference.stage;
    if (!distanceKm || distanceKm <= 0) {
      continue;
    }
    const runs = reference.runs.filter((run) => run.finisherCount > 0);
    if (runs.length === 0) {
      continue;
    }

    for (const run of runs) {
      if (run.winnerTimeSeconds > 0) {
        push(speeds, profile, distanceKm / (run.winnerTimeSeconds / 3600));
      }
      if (run.lastFinisherGapSeconds != null && run.lastFinisherGapSeconds > 0) {
        push(lastGaps, profile, run.lastFinisherGapSeconds / distanceKm);
      }
    }

    if (!ROAD_ONLY(profile) || stageScore == null) {
      continue;
    }
    const difficulty = stageScore / distanceKm;
    const shares = runs.map((run) => run.firstGroupSize / run.finisherCount);
    const bunched = shares.filter((share) => share > BUNCH_SHARE_THRESHOLD);
    binomial.push({
      group: profile,
      x: difficulty,
      share: bunched.length / shares.length,
      trials: shares.length,
    });
    for (const share of bunched) {
      push(bunchedShares, profile, share);
    }
    for (const share of shares.filter((value) => value <= BUNCH_SHARE_THRESHOLD)) {
      push(splitShares, profile, { share, difficulty });
    }

    // Form der Rueckstandskurve: Position hinter der ersten Zeitgruppe gegen
    // den Anteil am Rueckstand des Letzten.
    for (const run of runs) {
      const first = run.firstGroupSize / run.finisherCount;
      const last = run.lastFinisherGapSeconds;
      if (first >= 0.999 || last == null || last <= 0) {
        continue;
      }
      for (const [key, gap] of Object.entries(run.gapSecondsByFieldPosition ?? {})) {
        if (gap == null || gap <= 0) {
          continue;
        }
        const v = (Number(key) - first) / (1 - first);
        if (v > 0.02 && v <= 1) {
          tailPoints.push({ v, share: gap / last });
        }
      }
    }
  }

  const bunchFit = fitLogisticWithGroupIntercepts(binomial, { iterations: 120_000, learningRate: 0.15 });
  const pooledObservations = binomial.map((entry) => ({ ...entry, group: 'alle' }));
  const pooledFit = fitLogisticWithGroupIntercepts(pooledObservations, { iterations: 120_000, learningRate: 0.15 });
  const logObservations = binomial.map((entry) => ({ ...entry, group: 'alle', x: Math.log(Math.max(0.01, entry.x)) }));
  const logFit = fitLogisticWithGroupIntercepts(logObservations, { iterations: 120_000, learningRate: 0.15 });

  const splitObservations: GroupedObservation[] = [];
  for (const [profile, entries] of splitShares) {
    for (const entry of entries) {
      splitObservations.push({
        group: profile,
        x: Math.log(Math.max(0.01, entry.difficulty)),
        y: entry.share,
        weight: 1,
      });
    }
  }
  const splitFit = fitLinearWithGroupIntercepts(splitObservations);

  // Relative Streuung: innerhalb der Etappe, gemittelt ueber die Etappen —
  // sonst mischt sich die Streuung *zwischen* Etappen hinein.
  const relativeSd = (map: Map<string, number[]>): number => {
    const values = [...map.values()]
      .map((entries) => moments(entries))
      .filter((entry): entry is NonNullable<typeof entry> => entry != null && entry.mean > 0)
      .map((entry) => entry.sd / entry.mean);
    return median(values) ?? 0;
  };
  const splitResiduals = new Map<string, number[]>();
  for (const [profile, entries] of splitShares) {
    splitResiduals.set(profile, entries.map((entry) => entry.share));
  }

  const toMedianMap = (map: Map<string, number[]>): Map<string, number> => {
    const result = new Map<string, number>();
    for (const [key, values] of map) {
      const value = median(values);
      if (value != null) {
        result.set(key, value);
      }
    }
    return result;
  };
  const toMeanMap = (map: Map<string, number[]>): Map<string, number> => {
    const result = new Map<string, number>();
    for (const [key, values] of map) {
      const value = moments(values);
      if (value != null) {
        result.set(key, value.mean);
      }
    }
    return result;
  };

  return {
    baseSpeedKmh: toMedianMap(speeds),
    bunchIntercepts: bunchFit.intercepts,
    bunchSlope: bunchFit.slope,
    bunchedShareIntercept: toMeanMap(bunchedShares),
    bunchedShareRelativeSd: relativeSd(bunchedShares),
    splitShareIntercepts: splitFit.intercepts,
    splitShareSlope: splitFit.slope,
    splitShareRelativeSd: relativeSd(splitResiduals),
    tailGapPerKm: toMedianMap(lastGaps),
    tailShape: fitTailShape(tailPoints),
    regimeComparison: [
      {
        label: 'logit = a(Profil) + b*D',
        logLikelihood: logisticLogLikelihood(binomial, bunchFit),
        parameters: bunchFit.intercepts.size + 1,
        bic: bic(logisticLogLikelihood(binomial, bunchFit), bunchFit.intercepts.size + 1, binomial.length),
      },
      {
        label: 'logit = a + b*D',
        logLikelihood: logisticLogLikelihood(pooledObservations, pooledFit),
        parameters: 2,
        bic: bic(logisticLogLikelihood(pooledObservations, pooledFit), 2, binomial.length),
      },
      {
        label: 'logit = a + b*ln(D)',
        logLikelihood: logisticLogLikelihood(logObservations, logFit),
        parameters: 2,
        bic: bic(logisticLogLikelihood(logObservations, logFit), 2, binomial.length),
      },
    ],
  };
}

// ---------------------------------------------------------------- Stufe B

interface SimulationTargets {
  timeGroupCount: number;
  lastGapPerKm: number;
  spearman: number | null;
}

function measure(
  work: readonly StageWork[],
  parameters: QuickSimProfileParameters,
  runs: number,
): SimulationTargets | null {
  const groupCounts: number[] = [];
  const lastGaps: number[] = [];
  const spearmans: number[] = [];
  for (const stage of work) {
    for (let run = 0; run < runs; run += 1) {
      const result = withSilencedConsole(() => runQuickStage({
        bootstrap: stage.bootstrap,
        seed: resolveRunSeed(stage.stageSeed, run),
        stageScore: stage.stageScore,
        parameters,
      }));
      const times = result.entries
        .filter((entry) => !entry.isAbandon && !entry.isOutsideTimeLimit && entry.stageTimeSeconds != null)
        .map((entry) => entry.stageTimeSeconds as number)
        .sort((left, right) => left - right);
      if (times.length < 2) {
        continue;
      }
      let groups = 1;
      for (let index = 1; index < times.length; index += 1) {
        if ((times[index] as number) - (times[index - 1] as number) > 1) {
          groups += 1;
        }
      }
      groupCounts.push(groups);
      lastGaps.push(((times[times.length - 1] as number) - (times[0] as number)) / stage.distanceKm);

      const metrics = computeStageRunMetrics({
        finishers: result.entries
          .filter((entry) => !entry.isAbandon && !entry.isOutsideTimeLimit && entry.stageTimeSeconds != null)
          .map((entry) => ({ riderId: entry.riderId, finishTimeSeconds: entry.stageTimeSeconds as number })),
        dnfCount: result.abandonCount,
        otlCount: result.outsideTimeLimitCount,
        breakawayRiderIds: [],
        breakawayCatchKm: null,
        favouriteRiderIdsInOrder: stage.favouriteRiderIdsInOrder,
      });
      if (metrics?.favouriteSpearman != null) {
        spearmans.push(metrics.favouriteSpearman);
      }
    }
  }
  const timeGroupCount = median(groupCounts);
  const lastGapPerKm = median(lastGaps);
  return timeGroupCount == null || lastGapPerKm == null
    ? null
    : { timeGroupCount, lastGapPerKm, spearman: median(spearmans) };
}

/** Klumpung: mehr Fahrer je Gruppe heisst weniger Gruppen, also Bisektion. */
function fitTailGroupSize(
  work: readonly StageWork[],
  base: QuickSimProfileParameters,
  targetGroupCount: number,
  runs: number,
): { size: number; achieved: number } {
  let low = MIN_GROUP_SIZE;
  let high = MAX_GROUP_SIZE;
  let achieved = targetGroupCount;
  for (let step = 0; step < BISECTION_STEPS; step += 1) {
    const middle = (low + high) / 2;
    const measured = measure(work, { ...base, tailGroupSize: middle }, runs);
    if (!measured) {
      break;
    }
    achieved = measured.timeGroupCount;
    if (measured.timeGroupCount > targetGroupCount) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return { size: (low + high) / 2, achieved };
}

/**
 * Streuung der Reihenfolge gegen die gemessene Rangkorrelation.
 *
 * Mehr Streuung heisst niedrigere Korrelation — die Zielfunktion faellt
 * monoton, also Bisektion. Das ist die Kennzahl, die der Entwurf die
 * wichtigste nennt: sie misst, wie vorhersagbar ein Ergebnis ist.
 */
function fitRankNoise(
  work: readonly StageWork[],
  base: QuickSimProfileParameters,
  targetSpearman: number,
  runs: number,
): { rankNoise: number; achieved: number | null } {
  let low = 0;
  let high = 8;
  let achieved: number | null = null;
  for (let step = 0; step < BISECTION_STEPS; step += 1) {
    const middle = (low + high) / 2;
    const measured = measure(work, { ...base, rankNoise: middle }, runs);
    if (!measured || measured.spearman == null) {
      break;
    }
    achieved = measured.spearman;
    if (measured.spearman > targetSpearman) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return { rankNoise: (low + high) / 2, achieved };
}

/** Zeitfahren: zwei Parameter, zwei Ziele, Rastersuche. */
function fitTimeTrial(
  work: readonly StageWork[],
  base: QuickSimProfileParameters,
  // Nur die beiden Kennzahlen, gegen die das Zeitfahren angepasst wird. Die
  // Rangkorrelation gehoert nicht dazu: sie haengt am Etappenscore, nicht an
  // Steigung und Streuung der Zeitfahrformel.
  targets: Pick<SimulationTargets, 'timeGroupCount' | 'lastGapPerKm'>,
  runs: number,
): { slope: number; noise: number; achieved: SimulationTargets } | null {
  let best: { slope: number; noise: number; error: number; achieved: SimulationTargets } | null = null;
  for (const timeTrialSlope of SLOPE_GRID) {
    for (const timeTrialNoise of NOISE_GRID) {
      const measured = measure(work, { ...base, timeTrialSlope, timeTrialNoise }, runs);
      if (!measured) {
        continue;
      }
      const error = (Math.log(measured.lastGapPerKm / targets.lastGapPerKm) ** 2)
        + (Math.log(measured.timeGroupCount / targets.timeGroupCount) ** 2);
      if (!best || error < best.error) {
        best = { slope: timeTrialSlope, noise: timeTrialNoise, error, achieved: measured };
      }
    }
  }
  return best ? { slope: best.slope, noise: best.noise, achieved: best.achieved } : null;
}

// ---------------------------------------------------------------- Ausgabe

function writeCsv(
  csvPath: string,
  parametersByProfile: Map<string, QuickSimProfileParameters>,
): void {
  const columns: Array<[string, (p: QuickSimProfileParameters) => number, number]> = [
    ['base_speed_kmh', (p) => p.baseSpeedKmh, 2],
    ['bunch_intercept', (p) => p.bunchIntercept, 2],
    ['bunched_share_intercept', (p) => p.bunchedShareIntercept, 4],
    ['split_share_intercept', (p) => p.splitShareIntercept, 4],
    ['tail_gap_per_km', (p) => p.tailGapPerKm, 2],
    ['tail_group_size', (p) => p.tailGroupSize, 2],
    ['noise_sigma', (p) => p.noiseSigma, 2],
    ['incident_loss_multiplier', (p) => p.incidentLossMultiplier, 2],
    ['severe_dnf_chance', (p) => p.severeDnfChance, 2],
    ['breakaway_shrink_exponent', (p) => p.breakawayShrinkExponent, 2],
    ['time_trial_slope', (p) => p.timeTrialSlope, 5],
    ['time_trial_noise', (p) => p.timeTrialNoise, 4],
    ['mass_crash_involvement', (p) => p.massCrashInvolvement, 2],
    ['rank_noise', (p) => p.rankNoise, 2],
  ];
  const order = Object.keys(DEFAULT_QUICK_SIM_PROFILES);
  const lines = [['profile', ...columns.map(([name]) => name)].join(',')];
  for (const profile of order) {
    const parameters = parametersByProfile.get(profile);
    if (!parameters) {
      continue;
    }
    lines.push([profile, ...columns.map(([, pick, digits]) => pick(parameters).toFixed(digits))].join(','));
  }
  fs.writeFileSync(csvPath, `${lines.join('\n')}\n`, 'utf8');
}

/**
 * Traegt die Ergebnisse auch in den Code nach.
 *
 * Die Vorgabewerte in `shared/quickSimProfiles.ts` muessen mit der CSV
 * uebereinstimmen — ein Test erzwingt das. Wuerde das Werkzeug nur die CSV
 * schreiben, waere der naechste Lauf wieder Handarbeit, und genau dort ist
 * bisher jeder Fehler entstanden.
 */
function rewriteDefaults(
  filePath: string,
  parametersByProfile: ReadonlyMap<string, QuickSimProfileParameters>,
  data: DataFits,
): void {
  let source = fs.readFileSync(filePath, 'utf8');

  const constants: Array<[string, string]> = [
    ['BUNCH_SLOPE', data.bunchSlope.toFixed(3)],
    ['SPLIT_SHARE_SLOPE', data.splitShareSlope.toFixed(4)],
    ['BUNCHED_SHARE_RELATIVE_SD', data.bunchedShareRelativeSd.toFixed(3)],
    ['SPLIT_SHARE_RELATIVE_SD', data.splitShareRelativeSd.toFixed(3)],
    ['TAIL_SHAPE_EPSILON', data.tailShape.epsilon.toFixed(3)],
    ['TAIL_SHAPE_EXPONENT', data.tailShape.exponent.toFixed(2)],
  ];
  for (const [name, value] of constants) {
    const pattern = new RegExp(`(export const ${name} = )[-0-9.]+;`);
    if (!pattern.test(source)) {
      throw new Error(`Konstante ${name} nicht gefunden in ${filePath}`);
    }
    source = source.replace(pattern, `$1${value};`);
  }

  const format = (parameters: QuickSimProfileParameters): string => [
    `baseSpeedKmh: ${parameters.baseSpeedKmh.toFixed(2)}`,
    `bunchIntercept: ${parameters.bunchIntercept.toFixed(2)}`,
    `bunchedShareIntercept: ${parameters.bunchedShareIntercept.toFixed(4)}`,
    `splitShareIntercept: ${parameters.splitShareIntercept.toFixed(4)}`,
    `tailGapPerKm: ${parameters.tailGapPerKm.toFixed(2)}`,
    `tailGroupSize: ${parameters.tailGroupSize.toFixed(2)}`,
    `noiseSigma: ${parameters.noiseSigma.toFixed(2)}`,
    `incidentLossMultiplier: ${parameters.incidentLossMultiplier.toFixed(2)}`,
    `severeDnfChance: ${parameters.severeDnfChance.toFixed(2)}`,
    `breakawayShrinkExponent: ${parameters.breakawayShrinkExponent.toFixed(2)}`,
    `timeTrialSlope: ${parameters.timeTrialSlope.toFixed(5)}`,
    `timeTrialNoise: ${parameters.timeTrialNoise.toFixed(4)}`,
    `massCrashInvolvement: ${parameters.massCrashInvolvement.toFixed(2)}`,
    `rankNoise: ${parameters.rankNoise.toFixed(2)}`,
  ].join(', ');

  const width = Math.max(...[...parametersByProfile.keys()].map((profile) => profile.length)) + 2;
  const body = [...parametersByProfile.entries()]
    .map(([profile, parameters]) => `  ${`${profile}:`.padEnd(width)} { ${format(parameters)} },`)
    .join('\n');
  const start = source.indexOf('export const DEFAULT_QUICK_SIM_PROFILES');
  const end = source.indexOf('};', start) + 2;
  if (start < 0 || end < 2) {
    throw new Error(`DEFAULT_QUICK_SIM_PROFILES nicht gefunden in ${filePath}`);
  }
  source = source.slice(0, start)
    + 'export const DEFAULT_QUICK_SIM_PROFILES: Record<StageProfile, QuickSimProfileParameters> = {\n'
    + body
    + '\n};'
    + source.slice(end);

  fs.writeFileSync(filePath, source, 'utf8');
}

function main(): void {
  const argv = process.argv.slice(2);
  const get = (name: string): string | null => {
    const hit = argv.find((arg) => arg.startsWith(`--${name}=`));
    return hit ? hit.slice(name.length + 3) : null;
  };
  const inputDir = get('in') ?? path.join('debug', 'quicksim-reference-v4');
  const savegame = get('savegame') ?? path.join('savegames', 'a_1783240576758.db');
  const runs = Number(get('runs') ?? 10);
  const shouldWrite = argv.includes('--write');

  for (const [label, target] of [['Verzeichnis', inputDir], ['Spielstand', savegame]] as const) {
    if (!fs.existsSync(target)) {
      console.error(`${label} nicht gefunden: ${target}`);
      process.exit(1);
    }
  }

  const references = fs.readdirSync(inputDir)
    .filter((name) => name.startsWith('stage-') && name.endsWith('.json'))
    .map((name) => JSON.parse(fs.readFileSync(path.join(inputDir, name), 'utf8')) as StageReferenceFile);
  if (references.length === 0) {
    console.error(`Keine stage-*.json in ${inputDir}.`);
    process.exit(1);
  }

  console.log('');
  console.log(`Stufe A — aus ${references.length} Etappen`);
  const data = fitFromData(references);

  console.log('');
  console.log('  Regime-Ziehung, Modellformen im Vergleich (kleineres BIC ist besser):');
  for (const entry of [...data.regimeComparison].sort((left, right) => left.bic - right.bic)) {
    console.log(
      `    ${entry.label.padEnd(24)} LogLik ${entry.logLikelihood.toFixed(1).padStart(9)}`
      + `  Parameter ${String(entry.parameters).padStart(3)}  BIC ${entry.bic.toFixed(0).padStart(7)}`,
    );
  }
  console.log('');
  console.log('  Globale Konstanten fuer shared/quickSimProfiles.ts:');
  console.log(`    BUNCH_SLOPE               = ${data.bunchSlope.toFixed(3)}`);
  console.log(`    SPLIT_SHARE_SLOPE         = ${data.splitShareSlope.toFixed(4)}`);
  console.log(`    BUNCHED_SHARE_RELATIVE_SD = ${data.bunchedShareRelativeSd.toFixed(3)}`);
  console.log(`    SPLIT_SHARE_RELATIVE_SD   = ${data.splitShareRelativeSd.toFixed(3)}`);
  console.log(`    TAIL_SHAPE_EPSILON        = ${data.tailShape.epsilon.toFixed(3)}`);
  console.log(`    TAIL_SHAPE_EXPONENT       = ${data.tailShape.exponent.toFixed(2)}`
    + `   (RMSE im Log-Raum ${data.tailShape.rmse.toFixed(3)})`);

  // Stufe B braucht die Simulation und damit die Bootstraps.
  const workingCopy = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'velo-fit-')), 'fit.db');
  fs.copyFileSync(savegame, workingCopy);
  const db = new Database(workingCopy);
  db.pragma('journal_mode = WAL');
  db.pragma('cache_size = -262144');
  db.pragma('temp_store = MEMORY');
  migrateSavegame(db);
  const context = createBootstrapContext(db);

  const workByProfile = new Map<string, StageWork[]>();
  const targetsByProfile = new Map<string, { groups: number[]; gaps: number[]; spearman: number[] }>();
  for (const reference of references) {
    const { stageId, profile, stageScore, distanceKm } = reference.stage;
    if (!distanceKm || distanceKm <= 0) {
      continue;
    }
    const { seed: stageSeed } = pinStageSeed(db, stageId);
    const bootstrap = withSilencedConsole(() => buildStageBootstrap(db, stageId, context));
    if (!bootstrap || !bootstrap.riders || bootstrap.riders.length === 0) {
      continue;
    }
    const bucket = workByProfile.get(profile) ?? [];
    bucket.push({
      stageScore, distanceKm, stageSeed, bootstrap,
      favouriteRiderIdsInOrder: withSilencedConsole(() => calculateStageFavoriteRiderRanking(
        bootstrap.riders,
        bootstrap.teams,
        bootstrap.stage,
        {
          distanceKm: bootstrap.stageSummary.distanceKm,
          elevationGainMeters: bootstrap.stageSummary.elevationGainMeters,
        },
      )).map((candidate) => candidate.rider.id),
    });
    workByProfile.set(profile, bucket);

    const targets = targetsByProfile.get(profile) ?? { groups: [], gaps: [], spearman: [] };
    for (const run of reference.runs) {
      targets.groups.push(run.timeGroupCount);
      if (run.lastFinisherGapSeconds != null) {
        targets.gaps.push(run.lastFinisherGapSeconds / distanceKm);
      }
      if (run.favouriteSpearman != null) {
        targets.spearman.push(run.favouriteSpearman);
      }
    }
    targetsByProfile.set(profile, targets);
    process.stdout.write(`\r  Bootstraps: ${[...workByProfile.values()].reduce((sum, list) => sum + list.length, 0)}   `);
  }
  process.stdout.write('\n');
  db.close();

  console.log('');
  console.log(`Stufe B — ${runs} Laeufe je Etappe`);
  console.log('  Profil            Ziel Gruppen  Modell  tail_group_size');
  const fitted = new Map<string, QuickSimProfileParameters>();
  for (const profile of Object.keys(DEFAULT_QUICK_SIM_PROFILES)) {
    const fallback = DEFAULT_QUICK_SIM_PROFILES[profile as StageProfile];
    const parameters: QuickSimProfileParameters = {
      ...fallback,
      baseSpeedKmh: data.baseSpeedKmh.get(profile) ?? fallback.baseSpeedKmh,
      bunchIntercept: ROAD_ONLY(profile) ? (data.bunchIntercepts.get(profile) ?? fallback.bunchIntercept) : 0,
      bunchedShareIntercept: data.bunchedShareIntercept.get(profile) ?? fallback.bunchedShareIntercept,
      splitShareIntercept: ROAD_ONLY(profile)
        ? (data.splitShareIntercepts.get(profile) ?? fallback.splitShareIntercept)
        : 0,
      tailGapPerKm: data.tailGapPerKm.get(profile) ?? fallback.tailGapPerKm,
    };

    const work = workByProfile.get(profile) ?? [];
    const targets = targetsByProfile.get(profile);
    if (work.length > 0 && targets && targets.groups.length > 0) {
      const targetGroups = median(targets.groups) as number;
      const targetGap = median(targets.gaps);
      if (TIME_TRIAL_ONLY(profile) && targetGap != null) {
        const tt = fitTimeTrial(work, parameters, { timeGroupCount: targetGroups, lastGapPerKm: targetGap }, runs);
        if (tt) {
          parameters.timeTrialSlope = tt.slope;
          parameters.timeTrialNoise = tt.noise;
          console.log(
            `  ${profile.padEnd(17)}${targetGroups.toFixed(0).padStart(12)}`
            + `${tt.achieved.timeGroupCount.toFixed(0).padStart(8)}`
            + `   slope ${tt.slope.toFixed(5)}  noise ${tt.noise.toFixed(4)}`,
          );
        }
      } else if (ROAD_ONLY(profile)) {
        const tail = fitTailGroupSize(work, parameters, targetGroups, runs);
        parameters.tailGroupSize = tail.size;
        let rankLine = '';
        const targetRho = median(targets.spearman);
        if (targetRho != null) {
          const rank = fitRankNoise(work, parameters, targetRho, runs);
          parameters.rankNoise = rank.rankNoise;
          rankLine = `   rho ${targetRho.toFixed(2)} -> ${(rank.achieved ?? 0).toFixed(2)}`
            + `  rank_noise ${rank.rankNoise.toFixed(2)}`;
        }
        console.log(
          `  ${profile.padEnd(17)}${targetGroups.toFixed(0).padStart(12)}`
          + `${tail.achieved.toFixed(0).padStart(8)}${tail.size.toFixed(2).padStart(17)}${rankLine}`,
        );
      }
    }
    fitted.set(profile, parameters);
  }

  console.log('');
  console.log('Profil            km/h  bunch_int  bunched  split_int  s/km   Gruppe');
  for (const [profile, parameters] of fitted) {
    console.log(
      profile.padEnd(17)
      + parameters.baseSpeedKmh.toFixed(2).padStart(6)
      + parameters.bunchIntercept.toFixed(2).padStart(11)
      + parameters.bunchedShareIntercept.toFixed(3).padStart(9)
      + parameters.splitShareIntercept.toFixed(4).padStart(11)
      + parameters.tailGapPerKm.toFixed(2).padStart(7)
      + parameters.tailGroupSize.toFixed(2).padStart(9),
    );
  }

  const csvPath = path.join('data', 'csv', 'quick_sim_profiles.csv');
  if (shouldWrite) {
    writeCsv(csvPath, fitted);
    rewriteDefaults(path.join('shared', 'quickSimProfiles.ts'), fitted, data);
    console.log('');
    console.log(`Geschrieben: ${csvPath}`);
    console.log('Geschrieben: shared/quickSimProfiles.ts (Konstanten und Vorgabewerte)');
  } else {
    console.log('');
    console.log(`Nichts geschrieben. Mit --write nach ${csvPath}.`);
  }
  console.log('');
}

main();
