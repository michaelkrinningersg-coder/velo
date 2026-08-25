/**
 * Passt die Klumpung des Feldendes an den Referenzdatensatz an.
 *
 * Hoehe und Form der Rueckstandskurve sind gemessen: `tail_gap_per_km` ist der
 * Rueckstand des letzten Fahrers je Kilometer, die Formparameter stammen aus
 * 11.601 Messpunkten. Was sich daraus *nicht* ablesen laesst, ist die
 * Klumpung — wie viele Fahrer sich zu einer Zeitgruppe zusammenfinden.
 *
 * Sie direkt zu messen fuehrt in die Irre: der Median des Verhaeltnisses
 * "Fahrer je Gruppe" ueber die Laeufe ist nicht der Wert, der den Median der
 * Gruppenzahl trifft (Flat 2,00 gegen 4,49 gepoolt, und keiner der beiden
 * reproduziert die gemessenen 11 Zeitgruppen). Deshalb wird hier gegen die
 * Zielgroesse selbst gefittet: die Zahl der Zeitgruppen.
 *
 * Ein Parameter, ein Ziel, Bisektion.
 *
 * Aufruf:
 *   npm run calibrate:fit-tail -- --in=debug/quicksim-reference-v2 --runs=20
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

/** Zeitfahren haben mit TimeTrialSimulator ein eigenes Modell. */
const EXCLUDED_PROFILES = new Set(['ITT', 'TTT']);

/** Suchbereich der Bisektion. */
const MIN_GROUP_SIZE = 1;
const MAX_GROUP_SIZE = 40;
const BISECTION_STEPS = 16;

interface StageReferenceFile {
  stage: { stageId: number; profile: string; stageScore: number | null; distanceKm: number | null };
  runs: StageRunMetrics[];
}

interface StageWork {
  stageId: number;
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

/** Zeitgruppen eines Quick-Laufs nach der 1-Sekunden-Regel des Spiels. */
function measureTimeGroupCounts(
  work: StageWork[],
  parameters: QuickSimProfileParameters,
  runs: number,
): number[] {
  const counts: number[] = [];
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
      if (times.length === 0) {
        continue;
      }
      let groups = 1;
      for (let index = 1; index < times.length; index += 1) {
        if ((times[index] as number) - (times[index - 1] as number) > 1) {
          groups += 1;
        }
      }
      counts.push(groups);
    }
  }
  return counts;
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

  // Bootstraps einmal bauen — der teure Teil; die Quick Sim kostet unter einer
  // Millisekunde je Lauf.
  const workByProfile = new Map<string, StageWork[]>();
  const targetByProfile = new Map<string, number[]>();
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
    bucket.push({ stageId, stageScore, distanceKm, stageSeed, bootstrap });
    workByProfile.set(profile, bucket);

    const targets = targetByProfile.get(profile) ?? [];
    targets.push(...reference.runs.map((run) => run.timeGroupCount));
    targetByProfile.set(profile, targets);
    process.stdout.write(`\rBootstraps: ${[...workByProfile.values()].reduce((sum, list) => sum + list.length, 0)}   `);
  }
  process.stdout.write('\n\n');
  db.close();

  console.log('Profil            Etappen  Ziel  Modell  tail_group_size');
  console.log('----------------- -------  ----  ------  ---------------');
  const fitted: Array<{ profile: string; size: number }> = [];
  for (const [profile, work] of [...workByProfile.entries()].sort()) {
    const target = median(targetByProfile.get(profile) ?? []);
    const base = DEFAULT_QUICK_SIM_PROFILES[profile as StageProfile];
    if (target == null || !base) {
      continue;
    }

    // Mehr Fahrer je Gruppe → weniger Gruppen. Die Zielfunktion faellt monoton,
    // deshalb genuegt eine Bisektion.
    let low = MIN_GROUP_SIZE;
    let high = MAX_GROUP_SIZE;
    let achieved = target;
    for (let step = 0; step < BISECTION_STEPS; step += 1) {
      const middle = (low + high) / 2;
      const count = median(measureTimeGroupCounts(work, { ...base, tailGroupSize: middle }, runs)) ?? 0;
      achieved = count;
      if (count > target) {
        low = middle;
      } else {
        high = middle;
      }
    }
    const size = (low + high) / 2;
    fitted.push({ profile, size });
    console.log(
      profile.padEnd(17)
      + String(work.length).padStart(8)
      + target.toFixed(0).padStart(6)
      + achieved.toFixed(0).padStart(8)
      + size.toFixed(2).padStart(17),
    );
  }

  console.log('');
  console.log('Fuer data/csv/quick_sim_profiles.csv:');
  for (const entry of fitted) {
    console.log(`  ${entry.profile.padEnd(17)} tail_group_size=${entry.size.toFixed(2)}`);
  }
  console.log('');
}

main();
