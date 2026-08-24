/**
 * Passt das Abstandsmodell der Quick Simulation an den Referenzdatensatz an.
 *
 * Bis hierher waren `gap_factor` und `gap_exponent` geschaetzte Startwerte —
 * der Vergleich mit der Instant-Simulation hat gezeigt, wie weit sie daneben
 * liegen (Flachetappen: 0,58 Sekunden Rueckstand je Kilometer fuer den
 * Letzten statt gemessener 7,69). Dieses Werkzeug ersetzt das Raten.
 *
 *   Δt_i = f · (S_{i-1} − S_i)^γ · km · (1 + ε)
 *
 * Der Rueckstand ist in f *linear*. Deshalb genuegt je Exponent ein einziger
 * Lauf mit f = 1: das optimale f folgt danach in geschlossener Form als
 * geometrisches Mittel der Verhaeltnisse. Gesucht wird nur ueber γ.
 *
 * Zielgroessen sind die Rueckstaende je Kilometer an den Raengen 2, 5, 10, 20,
 * 50, 100 — also die Form der Rueckstandskurve, nicht nur ihr Ende.
 *
 * Der letzte Fahrer gehoert ausdruecklich *nicht* dazu. Der erste Versuch, ihn
 * mitzufitten, ist daran gescheitert, und die Messung sagt auch warum: auf
 * einer Flachetappe liegt Rang 100 bei 0,063 Sekunden je Kilometer zurueck,
 * der Letzte bei 7,691 — Faktor 120. So einen Sprung erzeugt kein
 * Score-Abstand, denn die Scores springen dort nicht. Der Letzte ist kein
 * abgehaengter Fahrer, sondern ein Gestuerzter. Deshalb hat dieses Werkzeug
 * zwei Stufen:
 *
 *   A  gap_factor und gap_exponent gegen die Raenge 2 bis 100
 *   B  incident_loss_multiplier gegen den Rueckstand des Letzten
 *
 * Aufruf:
 *   npm run calibrate:fit-gaps -- --in=debug/quicksim-reference --runs=20
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
import { TRACKED_GAP_RANKS, type StageRunMetrics } from './metrics';
import { runQuickStage } from './quickSimAdapter';
import { DEFAULT_QUICK_SIM_PROFILES, type QuickSimProfileParameters } from '../../shared/quickSimProfiles';
import type { RealtimeSimulationBootstrap, StageProfile } from '../../shared/types';

/** Ueber diese Exponenten wird gesucht. */
const EXPONENT_GRID = Array.from({ length: 16 }, (_, index) => 0.8 + (index * 0.1));

/** Zeitfahren haben ein eigenes Modell (TimeTrialSimulator) und werden nicht gefittet. */
const EXCLUDED_PROFILES = new Set(['ITT', 'TTT']);

interface StageReferenceFile {
  stage: { stageId: number; profile: string; stageScore: number | null; distanceKm: number | null };
  runs: StageRunMetrics[];
}

interface StageWork {
  stageId: number;
  profile: string;
  stageScore: number | null;
  distanceKm: number;
  stageSeed: number;
  bootstrap: RealtimeSimulationBootstrap;
}

/** Rueckstand je Kilometer an den verfolgten Raengen plus der des Letzten. */
type GapCurve = Record<string, number>;

const CURVE_KEYS = [...TRACKED_GAP_RANKS.map((rank) => `rank${rank}`), 'last'];
/** Ziele der ersten Stufe. Der Letzte bleibt draussen — siehe Kopfkommentar. */
const BULK_KEYS = TRACKED_GAP_RANKS.map((rank) => `rank${rank}`);

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

function median(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)] as number;
}

function curveFromMetrics(samples: StageRunMetrics[], distanceKm: number): Array<Partial<GapCurve>> {
  return samples.map((metrics) => {
    const curve: Partial<GapCurve> = {};
    for (const rank of TRACKED_GAP_RANKS) {
      const gap = metrics.gapSecondsByRank[rank];
      if (gap != null && gap > 0) {
        curve[`rank${rank}`] = gap / distanceKm;
      }
    }
    if (metrics.lastFinisherGapSeconds != null && metrics.lastFinisherGapSeconds > 0) {
      curve['last'] = metrics.lastFinisherGapSeconds / distanceKm;
    }
    return curve;
  });
}

function medianCurve(curves: Array<Partial<GapCurve>>): Partial<GapCurve> {
  const result: Partial<GapCurve> = {};
  for (const key of CURVE_KEYS) {
    const values = curves.map((curve) => curve[key]).filter((value): value is number => value != null);
    const value = median(values);
    if (value != null) {
      result[key] = value;
    }
  }
  return result;
}

/** Rueckstandskurve eines Quick-Laufs, direkt aus dem Ergebnis. */
function measureQuickCurve(
  work: StageWork,
  parameters: QuickSimProfileParameters,
  runs: number,
): Array<Partial<GapCurve>> {
  const curves: Array<Partial<GapCurve>> = [];
  for (let run = 0; run < runs; run += 1) {
    const result = withSilencedConsole(() => runQuickStage({
      bootstrap: work.bootstrap,
      seed: resolveRunSeed(work.stageSeed, run),
      stageScore: work.stageScore,
      parameters,
    }));
    const finishers = result.entries.filter(
      (entry) => !entry.isAbandon && !entry.isOutsideTimeLimit && entry.gapSeconds != null,
    );
    if (finishers.length === 0) {
      continue;
    }
    const curve: Partial<GapCurve> = {};
    for (const rank of TRACKED_GAP_RANKS) {
      const entry = finishers[rank - 1];
      if (entry && (entry.gapSeconds as number) > 0) {
        curve[`rank${rank}`] = (entry.gapSeconds as number) / work.distanceKm;
      }
    }
    const last = finishers[finishers.length - 1];
    if (last && (last.gapSeconds as number) > 0) {
      curve['last'] = (last.gapSeconds as number) / work.distanceKm;
    }
    curves.push(curve);
  }
  return curves;
}

interface Fit {
  profile: string;
  stageCount: number;
  gapFactor: number;
  gapExponent: number;
  /** Wurzel des mittleren quadratischen Log-Verhaeltnisses ueber die Kurve. */
  residual: number;
  /** Zweite Stufe: Multiplikator, der den Rueckstand des Letzten trifft. */
  incidentLossMultiplier: number;
  observed: Partial<GapCurve>;
  predicted: Partial<GapCurve>;
}

/**
 * Sucht den Vorfall-Multiplikator, der den beobachteten Rueckstand des letzten
 * Fahrers trifft. Der Rueckstand ist in ihm nicht linear — der Letzte ist
 * nicht immer derselbe Fahrer —, deshalb Bisektion statt geschlossener Form.
 */
function fitIncidentMultiplier(
  work: StageWork[],
  base: QuickSimProfileParameters,
  observedLastGap: number,
  runs: number,
): number {
  const measure = (multiplier: number): number => {
    const curves = work.flatMap((stage) => measureQuickCurve(
      stage,
      { ...base, incidentLossMultiplier: multiplier },
      runs,
    ));
    return medianCurve(curves)['last'] ?? 0;
  };

  let low = 0.1;
  let high = 200;
  if (measure(high) < observedLastGap) {
    return high;
  }
  for (let step = 0; step < 14; step += 1) {
    const middle = Math.sqrt(low * high);
    if (measure(middle) < observedLastGap) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return Math.sqrt(low * high);
}

function main(): void {
  const argv = process.argv.slice(2);
  const get = (name: string): string | null => {
    const hit = argv.find((arg) => arg.startsWith(`--${name}=`));
    return hit ? hit.slice(name.length + 3) : null;
  };
  const inputDir = get('in') ?? path.join('debug', 'quicksim-reference');
  const savegame = get('savegame') ?? path.join('savegames', 'a_1783240576758.db');
  const runs = Number(get('runs') ?? 20);
  const profileFilter = (get('profiles') ?? '').trim();

  for (const [label, target] of [['Verzeichnis', inputDir], ['Spielstand', savegame]] as const) {
    if (!fs.existsSync(target)) {
      console.error(`${label} nicht gefunden: ${target}`);
      process.exit(1);
    }
  }

  const references = fs.readdirSync(inputDir)
    .filter((name) => name.startsWith('stage-') && name.endsWith('.json'))
    .map((name) => JSON.parse(fs.readFileSync(path.join(inputDir, name), 'utf8')) as StageReferenceFile)
    .filter((reference) => !EXCLUDED_PROFILES.has(reference.stage.profile))
    .filter((reference) => !profileFilter || profileFilter.split(',').includes(reference.stage.profile));

  const workingCopy = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'velo-fit-')), 'fit.db');
  fs.copyFileSync(savegame, workingCopy);
  const db = new Database(workingCopy);
  db.pragma('journal_mode = WAL');
  db.pragma('cache_size = -262144');
  db.pragma('temp_store = MEMORY');
  migrateSavegame(db);
  const context = createBootstrapContext(db);

  // Bootstraps einmal bauen — das ist der teure Teil, die Quick Sim selbst
  // kostet unter einer Millisekunde je Lauf.
  const workByProfile = new Map<string, StageWork[]>();
  const observedByProfile = new Map<string, Array<Partial<GapCurve>>>();
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
    bucket.push({ stageId, profile, stageScore, distanceKm, stageSeed, bootstrap });
    workByProfile.set(profile, bucket);

    const observed = observedByProfile.get(profile) ?? [];
    observed.push(...curveFromMetrics(reference.runs, distanceKm));
    observedByProfile.set(profile, observed);
    process.stdout.write(`\rBootstraps: ${[...workByProfile.values()].reduce((sum, list) => sum + list.length, 0)}   `);
  }
  process.stdout.write('\n');
  db.close();

  const fits: Fit[] = [];
  for (const [profile, work] of [...workByProfile.entries()].sort()) {
    const observed = medianCurve(observedByProfile.get(profile) ?? []);
    const base = DEFAULT_QUICK_SIM_PROFILES[profile as StageProfile];
    if (!base || Object.keys(observed).length === 0) {
      continue;
    }

    let best: Fit | null = null;
    for (const gapExponent of EXPONENT_GRID) {
      // Ein Lauf je Exponent mit f = 1; der Rueckstand ist in f linear.
      const unit = medianCurve(work.flatMap((stage) => measureQuickCurve(
        stage,
        { ...base, gapFactor: 1, gapExponent },
        runs,
      )));

      const logRatios = BULK_KEYS
        .map((key) => {
          const target = observed[key];
          const prediction = unit[key];
          return target != null && prediction != null && prediction > 0 ? Math.log(target / prediction) : null;
        })
        .filter((value): value is number => value != null);
      if (logRatios.length === 0) {
        continue;
      }

      // Geometrisches Mittel der Verhaeltnisse — das f, das die Kurve im
      // Log-Raum am besten trifft.
      const logFactor = logRatios.reduce((sum, value) => sum + value, 0) / logRatios.length;
      const residual = Math.sqrt(
        logRatios.reduce((sum, value) => sum + ((value - logFactor) ** 2), 0) / logRatios.length,
      );
      if (!best || residual < best.residual) {
        const gapFactor = Math.exp(logFactor);
        const predicted: Partial<GapCurve> = {};
        for (const key of CURVE_KEYS) {
          if (unit[key] != null) {
            predicted[key] = (unit[key] as number) * gapFactor;
          }
        }
        best = {
          profile, stageCount: work.length, gapFactor, gapExponent, residual,
          incidentLossMultiplier: base.incidentLossMultiplier, observed, predicted,
        };
      }
    }
    if (!best) {
      continue;
    }

    // Stufe B: mit den gefitteten Abstandsparametern den Vorfall-Multiplikator
    // auf den Rueckstand des Letzten ziehen.
    const observedLastGap = observed['last'];
    if (observedLastGap != null) {
      const fitted = { ...base, gapFactor: best.gapFactor, gapExponent: best.gapExponent };
      best.incidentLossMultiplier = fitIncidentMultiplier(work, fitted, observedLastGap, runs);
      best.predicted['last'] = medianCurve(work.flatMap((stage) => measureQuickCurve(
        stage,
        { ...fitted, incidentLossMultiplier: best!.incidentLossMultiplier },
        runs,
      )))['last'];
    }

    fits.push(best);
    console.log(
      `${profile.padEnd(17)} f=${best.gapFactor.toFixed(4).padStart(9)}`
      + `  γ=${best.gapExponent.toFixed(1)}`
      + `  m=${best.incidentLossMultiplier.toFixed(2).padStart(7)}`
      + `  Streuung ${best.residual.toFixed(3)}`
      + `  (${best.stageCount} Etappen)`,
    );
  }

  console.log('');
  console.log('Rueckstand je Kilometer — Referenz gegen angepasstes Modell');
  console.log(`Profil            ${CURVE_KEYS.map((key) => key.padStart(8)).join('')}`);
  for (const fit of fits) {
    console.log(`${fit.profile.padEnd(17)}${CURVE_KEYS.map((key) => {
      const target = fit.observed[key];
      return (target == null ? '–' : target.toFixed(3)).padStart(8);
    }).join('')}   Referenz`);
    console.log(`${''.padEnd(17)}${CURVE_KEYS.map((key) => {
      const prediction = fit.predicted[key];
      return (prediction == null ? '–' : prediction.toFixed(3)).padStart(8);
    }).join('')}   Modell`);
  }

  console.log('');
  console.log('Fuer data/csv/quick_sim_profiles.csv:');
  for (const fit of fits) {
    console.log(
      `  ${fit.profile.padEnd(17)} gap_factor=${fit.gapFactor.toFixed(4)}`
      + `  gap_exponent=${fit.gapExponent.toFixed(1)}`
      + `  incident_loss_multiplier=${fit.incidentLossMultiplier.toFixed(2)}`,
    );
  }
  console.log('');
}

main();
