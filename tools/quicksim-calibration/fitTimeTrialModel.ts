/**
 * Passt das Zeitfahrmodell an den Referenzdatensatz an.
 *
 * Zwei Parameter je Zeitfahrprofil:
 *
 *   time_trial_slope   Rueckstand je Score-Punkt, als Anteil der Siegerzeit
 *   time_trial_noise   Reststreuung um diese Gerade (Tagesform), ebenso relativ
 *
 * Beide sind aus einer Sonde grob gemessen (ITT 0,0042 und 0,019; TTT 0,0062
 * und 0,0405), aber die Streuung zwischen den Etappen ist gross — beim TTT
 * reicht die Steigung von 0,0032 bis 0,0123. Der Median daraus trifft die
 * Zielgroessen nicht: der Rueckstand des letzten Fahrers kam auf 13,8 s/km
 * statt gemessener 22,4.
 *
 * Deshalb wird hier gegen die Zielgroessen selbst gefittet, ueber ein Raster:
 *
 *   Rueckstand des Letzten je Kilometer   (Spreizung des Feldes)
 *   Zahl der Zeitgruppen                  (Feinstruktur, haengt an der Streuung)
 *
 * Aufruf:
 *   npm run calibrate:fit-tt -- --in=debug/quicksim-reference-v2 --runs=20
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
import type { StageRunMetrics } from './metrics';
import { runQuickStage } from './quickSimAdapter';
import { DEFAULT_QUICK_SIM_PROFILES, type QuickSimProfileParameters } from '../../shared/quickSimProfiles';
import type { RealtimeSimulationBootstrap, StageProfile } from '../../shared/types';

const TIME_TRIAL_PROFILES = new Set(['ITT', 'TTT']);

/** Rasterpunkte. Grob genug, um schnell zu bleiben, fein genug fuer zwei Stellen. */
const SLOPE_GRID = Array.from({ length: 24 }, (_, index) => 0.0010 + (index * 0.0010));
const NOISE_GRID = Array.from({ length: 20 }, (_, index) => 0.005 + (index * 0.005));

interface StageReferenceFile {
  stage: { stageId: number; profile: string; stageScore: number | null; distanceKm: number | null };
  runs: StageRunMetrics[];
}

interface StageWork {
  stageScore: number | null;
  distanceKm: number;
  stageSeed: number;
  bootstrap: RealtimeSimulationBootstrap;
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

function median(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)] as number;
}

interface Measured {
  lastGapPerKm: number;
  timeGroupCount: number;
}

function measure(work: StageWork[], parameters: QuickSimProfileParameters, runs: number): Measured | null {
  const lastGaps: number[] = [];
  const groupCounts: number[] = [];
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
      lastGaps.push(((times[times.length - 1] as number) - (times[0] as number)) / stage.distanceKm);
      let groups = 1;
      for (let index = 1; index < times.length; index += 1) {
        if ((times[index] as number) - (times[index - 1] as number) > 1) {
          groups += 1;
        }
      }
      groupCounts.push(groups);
    }
  }
  const lastGapPerKm = median(lastGaps);
  const timeGroupCount = median(groupCounts);
  return lastGapPerKm == null || timeGroupCount == null ? null : { lastGapPerKm, timeGroupCount };
}

function main(): void {
  const argv = process.argv.slice(2);
  const get = (name: string): string | null => {
    const hit = argv.find((arg) => arg.startsWith(`--${name}=`));
    return hit ? hit.slice(name.length + 3) : null;
  };
  const inputDir = get('in') ?? path.join('debug', 'quicksim-reference-v2');
  const savegame = get('savegame') ?? path.join('savegames', 'a_1783240576758.db');
  const runs = Number(get('runs') ?? 20);

  for (const [label, target] of [['Verzeichnis', inputDir], ['Spielstand', savegame]] as const) {
    if (!fs.existsSync(target)) {
      console.error(`${label} nicht gefunden: ${target}`);
      process.exit(1);
    }
  }

  const references = fs.readdirSync(inputDir)
    .filter((name) => name.startsWith('stage-') && name.endsWith('.json'))
    .map((name) => JSON.parse(fs.readFileSync(path.join(inputDir, name), 'utf8')) as StageReferenceFile)
    .filter((reference) => TIME_TRIAL_PROFILES.has(reference.stage.profile));

  const workingCopy = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'velo-fit-tt-')), 'fit.db');
  fs.copyFileSync(savegame, workingCopy);
  const db = new Database(workingCopy);
  db.pragma('journal_mode = WAL');
  db.pragma('cache_size = -262144');
  db.pragma('temp_store = MEMORY');
  migrateSavegame(db);
  const context = createBootstrapContext(db);

  const workByProfile = new Map<string, StageWork[]>();
  const targetByProfile = new Map<string, Measured>();
  const rawTargets = new Map<string, { gaps: number[]; groups: number[] }>();
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
    bucket.push({ stageScore, distanceKm, stageSeed, bootstrap });
    workByProfile.set(profile, bucket);

    const raw = rawTargets.get(profile) ?? { gaps: [], groups: [] };
    for (const run of reference.runs) {
      if (run.lastFinisherGapSeconds != null) {
        raw.gaps.push(run.lastFinisherGapSeconds / distanceKm);
      }
      raw.groups.push(run.timeGroupCount);
    }
    rawTargets.set(profile, raw);
  }
  db.close();
  for (const [profile, raw] of rawTargets) {
    const gap = median(raw.gaps);
    const groups = median(raw.groups);
    if (gap != null && groups != null) {
      targetByProfile.set(profile, { lastGapPerKm: gap, timeGroupCount: groups });
    }
  }

  console.log('');
  for (const [profile, work] of [...workByProfile.entries()].sort()) {
    const target = targetByProfile.get(profile);
    const base = DEFAULT_QUICK_SIM_PROFILES[profile as StageProfile];
    if (!target || !base) {
      continue;
    }

    let best: { slope: number; noise: number; error: number; measured: Measured } | null = null;
    for (const timeTrialSlope of SLOPE_GRID) {
      for (const timeTrialNoise of NOISE_GRID) {
        const measured = measure(work, { ...base, timeTrialSlope, timeTrialNoise }, runs);
        if (!measured) {
          continue;
        }
        // Log-Verhaeltnisse, damit beide Ziele gleich zaehlen — die eine Groesse
        // liegt bei 10, die andere bei 30.
        const error = (Math.log(measured.lastGapPerKm / target.lastGapPerKm) ** 2)
          + (Math.log(measured.timeGroupCount / target.timeGroupCount) ** 2);
        if (!best || error < best.error) {
          best = { slope: timeTrialSlope, noise: timeTrialNoise, error, measured };
        }
      }
    }
    if (!best) {
      continue;
    }
    console.log(`${profile}  (${work.length} Etappen)`);
    console.log(`  s/km letzter   Referenz ${target.lastGapPerKm.toFixed(3).padStart(8)}   Modell ${best.measured.lastGapPerKm.toFixed(3).padStart(8)}`);
    console.log(`  Zeitgruppen    Referenz ${target.timeGroupCount.toFixed(1).padStart(8)}   Modell ${best.measured.timeGroupCount.toFixed(1).padStart(8)}`);
    console.log(`  time_trial_slope=${best.slope.toFixed(5)}  time_trial_noise=${best.noise.toFixed(4)}`);
    console.log('');
  }
}

main();
