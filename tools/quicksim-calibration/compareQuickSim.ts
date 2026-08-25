/**
 * Stellt die Quick Simulation der Instant-Simulation gegenueber.
 *
 * `validateGroupModel.ts` prueft eine einzelne Groesse — den Anteil der ersten
 * Zeitgruppe — gegen den Erwartungswert des Modells. Das reicht, solange man
 * das Gruppenmodell fittet, aber nicht, um zu sagen, ob der Kern funktioniert:
 * ein Modell kann die Momente treffen und trotzdem Etappenergebnisse liefern,
 * die kein Radrennen sind.
 *
 * Dieses Werkzeug faehrt deshalb dieselben Etappen wie der Referenzlauf, nur
 * mit dem Quick-Kern, und misst sie mit *derselben* `computeStageRunMetrics`.
 * Verglichen wird gegen die gespeicherten Instant-Kennzahlen.
 *
 * Aufruf:
 *   npm run calibrate:compare -- --in=debug/quicksim-reference --runs=30
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
import { computeStageRunMetrics, summarize, type Distribution, type StageRunMetrics } from './metrics';
import { runQuickStage } from './quickSimAdapter';
import { calculateStageFavoriteRiderRanking } from '../../frontend/src/race-sim/stageFavorites';

interface StageReferenceFile {
  stage: {
    stageId: number;
    raceName: string;
    stageNumber: number;
    profile: string;
    stageScore: number | null;
    distanceKm: number | null;
  };
  runs: StageRunMetrics[];
  runtimeMsMedian: number;
}

interface Options {
  savegame: string;
  inputDir: string;
  runs: number;
  profiles: string[] | null;
}

function parseOptions(argv: string[]): Options {
  const get = (name: string): string | null => {
    const hit = argv.find((arg) => arg.startsWith(`--${name}=`));
    return hit ? hit.slice(name.length + 3) : null;
  };
  const profiles = (get('profiles') ?? '').trim();
  return {
    savegame: get('savegame') ?? path.join('savegames', 'a_1783240576758.db'),
    inputDir: get('in') ?? path.join('debug', 'quicksim-reference'),
    runs: Number(get('runs') ?? 30),
    profiles: profiles ? profiles.split(',').map((value) => value.trim()).filter(Boolean) : null,
  };
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

/** Kennzahl je Modus, damit die Ausgabe eine Zeile je Profil bleibt. */
interface Side {
  speedKmh: number[];
  firstGroupShare: number[];
  timeGroupCount: number[];
  lastGapPerKm: number[];
  dnfCount: number[];
  otlCount: number[];
  spearman: number[];
  runtimeMs: number[];
}

function emptySide(): Side {
  return {
    speedKmh: [], firstGroupShare: [], timeGroupCount: [], lastGapPerKm: [],
    dnfCount: [], otlCount: [], spearman: [], runtimeMs: [],
  };
}

function collect(side: Side, metrics: StageRunMetrics, distanceKm: number): void {
  if (metrics.winnerTimeSeconds > 0) {
    side.speedKmh.push(distanceKm / (metrics.winnerTimeSeconds / 3600));
  }
  if (metrics.finisherCount > 0) {
    side.firstGroupShare.push(metrics.firstGroupSize / metrics.finisherCount);
  }
  side.timeGroupCount.push(metrics.timeGroupCount);
  if (metrics.lastFinisherGapSeconds != null) {
    side.lastGapPerKm.push(metrics.lastFinisherGapSeconds / distanceKm);
  }
  side.dnfCount.push(metrics.dnfCount);
  side.otlCount.push(metrics.otlCount);
  if (metrics.favouriteSpearman != null) {
    side.spearman.push(metrics.favouriteSpearman);
  }
}

function median(values: number[]): number | null {
  const distribution: Distribution | null = summarize(values);
  return distribution ? distribution.median : null;
}

function format(value: number | null, digits: number): string {
  return value == null ? '–' : value.toFixed(digits);
}

function main(): void {
  const options = parseOptions(process.argv.slice(2));
  if (!fs.existsSync(options.inputDir)) {
    console.error(`Verzeichnis nicht gefunden: ${options.inputDir}`);
    process.exit(1);
  }
  if (!fs.existsSync(options.savegame)) {
    console.error(`Spielstand nicht gefunden: ${options.savegame}`);
    process.exit(1);
  }

  const references = fs.readdirSync(options.inputDir)
    .filter((name) => name.startsWith('stage-') && name.endsWith('.json'))
    .map((name) => JSON.parse(fs.readFileSync(path.join(options.inputDir, name), 'utf8')) as StageReferenceFile)
    .filter((reference) => !options.profiles || options.profiles.includes(reference.stage.profile))
    .sort((left, right) => left.stage.stageId - right.stage.stageId);

  if (references.length === 0) {
    console.error(`Keine passenden stage-*.json in ${options.inputDir}.`);
    process.exit(1);
  }

  // Auf einer Kopie arbeiten: die Startlisten-Erzeugung schreibt in die DB.
  const workingCopy = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'velo-compare-')), 'compare.db');
  fs.copyFileSync(options.savegame, workingCopy);
  const db = new Database(workingCopy);
  db.pragma('journal_mode = WAL');
  db.pragma('cache_size = -262144');
  db.pragma('temp_store = MEMORY');
  migrateSavegame(db);
  const context = createBootstrapContext(db);

  const instantByProfile = new Map<string, Side>();
  const quickByProfile = new Map<string, Side>();
  let comparedStages = 0;

  for (const reference of references) {
    const { stageId, profile, stageScore, distanceKm } = reference.stage;
    if (!distanceKm || distanceKm <= 0) {
      continue;
    }

    const { seed: stageSeed } = pinStageSeed(db, stageId);
    const bootstrap = withSilencedConsole(() => buildStageBootstrap(db, stageId, context));
    if (!bootstrap || !bootstrap.riders || bootstrap.riders.length === 0) {
      console.warn(`Etappe ${stageId}: kein Bootstrap — uebersprungen.`);
      continue;
    }

    // Favoritenwertung *vor* dem Rennen — exakt dieselbe Liste, gegen die auch
    // der Referenzlauf seine Rangkorrelation misst. Vorher stand hier die
    // Zielreihenfolge eines Quick-Laufs; das mass die Streuung zwischen zwei
    // Laeufen, nicht die Vorhersagbarkeit, und war mit der Referenz nicht
    // vergleichbar.
    const favouriteRiderIdsInOrder = withSilencedConsole(() => calculateStageFavoriteRiderRanking(
      bootstrap.riders,
      bootstrap.teams,
      bootstrap.stage,
      {
        distanceKm: bootstrap.stageSummary.distanceKm,
        elevationGainMeters: bootstrap.stageSummary.elevationGainMeters,
      },
    )).map((candidate) => candidate.rider.id);

    const quick = quickByProfile.get(profile) ?? emptySide();
    for (let run = 0; run < options.runs; run += 1) {
      const startedAt = process.hrtime.bigint();
      const result = withSilencedConsole(() => runQuickStage({
        bootstrap, seed: resolveRunSeed(stageSeed, run), stageScore,
      }));
      quick.runtimeMs.push(Number(process.hrtime.bigint() - startedAt) / 1e6);

      const finishers = result.entries
        .filter((entry) => !entry.isAbandon && !entry.isOutsideTimeLimit && entry.stageTimeSeconds != null)
        .map((entry) => ({ riderId: entry.riderId, finishTimeSeconds: entry.stageTimeSeconds as number }));
      const metrics = computeStageRunMetrics({
        finishers,
        dnfCount: result.abandonCount,
        otlCount: result.outsideTimeLimitCount,
        breakawayRiderIds: [],
        breakawayCatchKm: null,
        favouriteRiderIdsInOrder,
      });
      if (metrics) {
        collect(quick, metrics, distanceKm);
      }
    }
    quickByProfile.set(profile, quick);

    const instant = instantByProfile.get(profile) ?? emptySide();
    for (const metrics of reference.runs) {
      collect(instant, metrics, distanceKm);
    }
    instant.runtimeMs.push(reference.runtimeMsMedian);
    instantByProfile.set(profile, instant);

    comparedStages += 1;
    process.stdout.write(`\rEtappen verglichen: ${comparedStages}/${references.length}   `);
  }
  process.stdout.write('\n');
  db.close();

  const profiles = [...quickByProfile.keys()].sort();
  const rows: Array<{ label: string; digits: number; pick: (side: Side) => number | null }> = [
    { label: 'km/h', digits: 2, pick: (side) => median(side.speedKmh) },
    { label: '1. Gruppe (Anteil)', digits: 3, pick: (side) => median(side.firstGroupShare) },
    { label: 'Zeitgruppen', digits: 1, pick: (side) => median(side.timeGroupCount) },
    { label: 's/km (letzter)', digits: 3, pick: (side) => median(side.lastGapPerKm) },
    { label: 'Aufgaben', digits: 2, pick: (side) => median(side.dnfCount) },
    { label: 'OTL', digits: 2, pick: (side) => median(side.otlCount) },
    // Die wichtigste Zahl: wie stark das Ergebnis vorhersagbar ist. Liegt die
    // Quick Sim hier deutlich hoeher, ist sie zu deterministisch — dann
    // gewinnen immer dieselben, auch wenn alle anderen Kennzahlen passen.
    { label: 'Spearman rho', digits: 3, pick: (side) => median(side.spearman) },
    { label: 'Laufzeit ms', digits: 2, pick: (side) => median(side.runtimeMs) },
  ];

  console.log('');
  console.log(`Quick gegen Instant — ${comparedStages} Etappen, ${options.runs} Quick-Laeufe je Etappe`);
  for (const profile of profiles) {
    const quick = quickByProfile.get(profile) as Side;
    const instant = instantByProfile.get(profile) as Side;
    console.log('');
    console.log(profile);
    console.log('  Kennzahl              Instant     Quick     Delta');
    console.log('  --------------------- -------  --------  --------');
    for (const row of rows) {
      const left = row.pick(instant);
      const right = row.pick(quick);
      const delta = left != null && right != null ? right - left : null;
      console.log(
        `  ${row.label.padEnd(22)}${format(left, row.digits).padStart(7)}`
        + `${format(right, row.digits).padStart(10)}`
        + `${(delta == null ? '–' : `${delta >= 0 ? '+' : ''}${delta.toFixed(row.digits)}`).padStart(10)}`,
      );
    }
  }
  console.log('');

  const instantRuntime = median([...instantByProfile.values()].flatMap((side) => side.runtimeMs));
  const quickRuntime = median([...quickByProfile.values()].flatMap((side) => side.runtimeMs));
  if (instantRuntime != null && quickRuntime != null && quickRuntime > 0) {
    console.log(`Laufzeit je Etappe: Instant ${instantRuntime.toFixed(0)} ms, Quick ${quickRuntime.toFixed(2)} ms `
      + `(Faktor ${(instantRuntime / quickRuntime).toFixed(0)})`);
    console.log('');
  }
}

main();
