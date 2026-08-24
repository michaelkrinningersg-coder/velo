/**
 * Erzeugt den Referenzdatensatz fuer die Kalibrierung der Quick Simulation.
 *
 * Faehrt eine Auswahl Etappen N-mal mit der bestehenden Instant-Simulation und
 * schreibt je Etappe die Kennzahlen aus `metrics.ts` — einmal je Lauf und
 * einmal verdichtet. Gegen diese Zahlen wird die Quick Sim spaeter gefittet.
 *
 * Aufruf (aus dem Repo-Wurzelverzeichnis):
 *   npm run calibrate:reference -- --runs=50 --per-profile=3
 *
 * Der Spielstand wird vor dem Lauf kopiert; die Originaldatei wird nie
 * beschrieben (die Startlisten-Erzeugung schreibt in die Datenbank).
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import { SimulationEngine } from '../../frontend/src/race-sim/SimulationEngine';
import { buildRealtimeCommitEntries } from '../../frontend/src/race-sim/commitEntries';
import { calculateStageFavoriteRiderRanking } from '../../frontend/src/race-sim/stageFavorites';
import { resolveStageTimeLimitSeconds } from '../../shared/stageResultRules';
import type { StageProfile } from '../../shared/types';
import {
  buildStageBootstrap,
  createBootstrapContext,
  listStageCandidates,
  migrateSavegame,
  rollStageWeatherOnce,
  type StageBootstrapContext,
  type StageCandidate,
} from './bootstrap';
import {
  computeStageRunMetrics,
  summarize,
  TRACKED_GAP_RANKS,
  type Distribution,
  type StageRunMetrics,
} from './metrics';

/** Sekunden Rennzeit je Engine-Schritt. Beeinflusst die Physik nicht. */
const CHUNK_SECONDS = 300;
/** Substep-Laenge der Instant-Sim — identisch zu runInstantSimulation.ts. */
const INSTANT_SUBSTEP_SECONDS = 5;
/** Notbremse gegen eine Etappe, die nie fertig wird. */
const MAX_STEPS = 200_000;

interface Options {
  savegame: string;
  runs: number;
  perProfile: number;
  stageIds: number[] | null;
  outDir: string;
  /**
   * Wenn gesetzt: nur den Bootstrap der ersten gewaehlten Etappe als JSON
   * schreiben und beenden. Damit wird die Testvorlage fuer den
   * Determinismus-Test erzeugt — der laeuft dann ohne Datenbank.
   */
  dumpBootstrap: string | null;
  /** Nur diese Etappenprofile messen. Leer = alle. */
  profiles: string[] | null;
  /** Aufteilung auf mehrere Prozesse: `i/n` misst jede n-te Etappe ab i. */
  shardIndex: number;
  shardCount: number;
}

function parseOptions(argv: string[]): Options {
  const get = (name: string): string | null => {
    const hit = argv.find((arg) => arg.startsWith(`--${name}=`));
    return hit ? hit.slice(name.length + 3) : null;
  };

  const stageIdsRaw = get('stages');
  const shard = get('shard');
  return {
    savegame: get('savegame') ?? path.join('savegames', 'a_1783240576758.db'),
    runs: Number(get('runs') ?? 30),
    perProfile: Number(get('per-profile') ?? 3),
    stageIds: stageIdsRaw ? stageIdsRaw.split(',').map((value) => Number(value.trim())) : null,
    outDir: get('out') ?? path.join('debug', 'quicksim-reference'),
    dumpBootstrap: get('dump-bootstrap'),
    profiles: (get('profiles') ?? '').trim()
      ? (get('profiles') as string).split(',').map((value) => value.trim()).filter(Boolean)
      : null,
    shardIndex: shard ? Number(shard.split('/')[0]) : 0,
    shardCount: shard ? Number(shard.split('/')[1]) : 1,
  };
}

/**
 * Waehlt je Etappenprofil eine feste Stichprobe. Deterministisch ueber die
 * Stage-ID, damit derselbe Aufruf dieselbe Auswahl trifft — sonst vergleicht
 * man nach einer Modelaenderung andere Etappen.
 */
function selectStages(candidates: StageCandidate[], perProfile: number): StageCandidate[] {
  const byProfile = new Map<string, StageCandidate[]>();
  for (const candidate of candidates) {
    const bucket = byProfile.get(candidate.profile) ?? [];
    bucket.push(candidate);
    byProfile.set(candidate.profile, bucket);
  }

  const selected: StageCandidate[] = [];
  for (const [, bucket] of [...byProfile.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const step = Math.max(1, Math.floor(bucket.length / perProfile));
    for (let index = 0; index < bucket.length && selected.length >= 0; index += step) {
      selected.push(bucket[index]!);
      if (selected.filter((entry) => entry.profile === bucket[0]!.profile).length >= perProfile) {
        break;
      }
    }
  }
  return selected;
}

interface StageReference {
  stage: StageCandidate;
  weatherId: number | null;
  starterCount: number;
  runs: StageRunMetrics[];
  aggregate: Record<string, Distribution | null>;
  runtimeMsMedian: number;
}

/**
 * Schaltet die Konsolenausgabe waehrend eines Blocks stumm. Die Engine
 * protokolliert je Lauf Superform-Listen und Draft-Details; bei hunderten
 * Laeufen ueberdeckt das den Fortschritt vollstaendig.
 */
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

function runStage(
  db: Database.Database,
  stage: StageCandidate,
  runs: number,
  context: StageBootstrapContext,
): StageReference | null {
  const weatherId = rollStageWeatherOnce(db, stage.stageId);
  const bootstrap = withSilencedConsole(() => buildStageBootstrap(db, stage.stageId, context));
  if (!bootstrap || !bootstrap.riders || bootstrap.riders.length === 0) {
    return null;
  }

  // Favoritenwertung *vor* dem Rennen — Grundlage der Rangkorrelation. Dieselbe
  // Funktion, die auch die Engine fuer ihre Favoritenanzeige benutzt.
  const favouriteRiderIdsInOrder = calculateStageFavoriteRiderRanking(
    bootstrap.riders,
    bootstrap.teams,
    bootstrap.stage,
    {
      distanceKm: bootstrap.stageSummary.distanceKm,
      elevationGainMeters: bootstrap.stageSummary.elevationGainMeters,
    },
  ).map((candidate) => candidate.rider.id);

  // Distanz steht erst nach dem Parsen des Etappenprofils fest.
  const stageWithDistance: StageCandidate = { ...stage, distanceKm: bootstrap.stageSummary.distanceKm };

  const metricsPerRun: StageRunMetrics[] = [];
  const runtimesMs: number[] = [];

  for (let run = 0; run < runs; run += 1) {
    const engine = withSilencedConsole(() => new SimulationEngine(bootstrap, {
      maxSubstepSeconds: INSTANT_SUBSTEP_SECONDS,
      isInstantSimulation: true,
    }));

    const startedAt = process.hrtime.bigint();
    withSilencedConsole(() => {
      let finished = false;
      let steps = 0;
      while (!finished && steps < MAX_STEPS) {
        finished = engine.step(CHUNK_SECONDS).isFinished;
        steps += 1;
      }
    });
    runtimesMs.push(Number(process.hrtime.bigint() - startedAt) / 1e6);

    const snapshot = withSilencedConsole(() => engine.getSnapshot());
    // Dieselbe Uebersetzung wie im Spiel: bei Zeitfahren zaehlt die individuelle
    // Fahrzeit (riderClockSeconds), nicht die absolute Uhrzeit — sonst liegen
    // alle spaet gestarteten Fahrer scheinbar ausserhalb des Zeitlimits.
    const commitEntries = buildRealtimeCommitEntries(snapshot, bootstrap);
    const finishers = commitEntries
      .filter((entry) => entry.finishStatus !== 'dnf' && entry.finishTimeSeconds != null)
      .map((entry) => ({ riderId: entry.riderId, finishTimeSeconds: entry.finishTimeSeconds as number }));

    // OTL wird im Commit-Dienst aus dem Zeitlimit abgeleitet, nicht von der
    // Engine gemeldet. Hier dieselbe Regel anwenden, damit die Referenz das
    // misst, was im Spiel tatsaechlich als OTL gewertet wird.
    const timeLimitSeconds = resolveStageTimeLimitSeconds(
      bootstrap.stage.profile as StageProfile,
      finishers.map((entry) => entry.finishTimeSeconds),
    );
    const withinLimit = timeLimitSeconds == null
      ? finishers
      : finishers.filter((entry) => entry.finishTimeSeconds <= timeLimitSeconds);
    const otlCount = finishers.length - withinLimit.length;

    const metrics = computeStageRunMetrics({
      finishers: withinLimit,
      dnfCount: commitEntries.filter((entry) => entry.finishStatus === 'dnf').length,
      otlCount,
      breakawayRiderIds: [],
      breakawayCatchKm: null,
      favouriteRiderIdsInOrder,
    });
    if (metrics) {
      metricsPerRun.push(metrics);
    }
  }

  if (metricsPerRun.length === 0) {
    return null;
  }

  const pick = (selector: (m: StageRunMetrics) => number | null) => summarize(metricsPerRun.map(selector));
  const aggregate: Record<string, Distribution | null> = {
    winnerTimeSeconds: pick((m) => m.winnerTimeSeconds),
    finisherCount: pick((m) => m.finisherCount),
    dnfCount: pick((m) => m.dnfCount),
    otlCount: pick((m) => m.otlCount),
    lastFinisherGapSeconds: pick((m) => m.lastFinisherGapSeconds),
    firstGroupSize: pick((m) => m.firstGroupSize),
    timeGroupCount: pick((m) => m.timeGroupCount),
    largestGroupSize: pick((m) => m.largestGroupSize),
    favouriteSpearman: pick((m) => m.favouriteSpearman),
  };
  for (const rank of TRACKED_GAP_RANKS) {
    aggregate[`gapSecondsRank${rank}`] = pick((m) => m.gapSecondsByRank[rank] ?? null);
  }

  const sortedRuntimes = [...runtimesMs].sort((left, right) => left - right);
  return {
    stage: stageWithDistance,
    weatherId,
    starterCount: bootstrap.riders.length,
    runs: metricsPerRun,
    aggregate,
    runtimeMsMedian: sortedRuntimes[Math.floor(sortedRuntimes.length / 2)] ?? 0,
  };
}

function writeSummaryCsv(references: StageReference[], filePath: string): void {
  const header = [
    'stage_id', 'race', 'stage_number', 'profile', 'distance_km', 'stage_score', 'weather_id', 'starters', 'runs',
    'winner_time_s_median', 'winner_time_s_sd',
    ...TRACKED_GAP_RANKS.map((rank) => `gap_rank${rank}_s_median`),
    'last_gap_s_median', 'first_group_median', 'time_groups_median', 'largest_group_median',
    'dnf_median', 'otl_median', 'spearman_median', 'runtime_ms_median',
  ].join(';');

  const value = (distribution: Distribution | null, key: keyof Distribution): string =>
    distribution ? distribution[key].toFixed(3) : '';

  const lines = references.map((reference) => [
    reference.stage.stageId,
    reference.stage.raceName.replace(/;/g, ','),
    reference.stage.stageNumber,
    reference.stage.profile,
    reference.stage.distanceKm ?? '',
    reference.stage.stageScore ?? '',
    reference.weatherId ?? '',
    reference.starterCount,
    reference.runs.length,
    value(reference.aggregate['winnerTimeSeconds'] ?? null, 'median'),
    value(reference.aggregate['winnerTimeSeconds'] ?? null, 'sd'),
    ...TRACKED_GAP_RANKS.map((rank) => value(reference.aggregate[`gapSecondsRank${rank}`] ?? null, 'median')),
    value(reference.aggregate['lastFinisherGapSeconds'] ?? null, 'median'),
    value(reference.aggregate['firstGroupSize'] ?? null, 'median'),
    value(reference.aggregate['timeGroupCount'] ?? null, 'median'),
    value(reference.aggregate['largestGroupSize'] ?? null, 'median'),
    value(reference.aggregate['dnfCount'] ?? null, 'median'),
    value(reference.aggregate['otlCount'] ?? null, 'median'),
    value(reference.aggregate['favouriteSpearman'] ?? null, 'median'),
    reference.runtimeMsMedian.toFixed(1),
  ].join(';'));

  fs.writeFileSync(filePath, [header, ...lines].join('\n') + '\n', 'utf8');
}

function main(): void {
  const options = parseOptions(process.argv.slice(2));

  if (!fs.existsSync(options.savegame)) {
    console.error(`Spielstand nicht gefunden: ${options.savegame}`);
    process.exit(1);
  }

  // Auf einer Kopie arbeiten: die Startlisten-Erzeugung schreibt in die DB.
  const workingCopy = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), 'velo-calibration-')),
    'reference.db',
  );
  fs.copyFileSync(options.savegame, workingCopy);

  const db = new Database(workingCopy);
  db.pragma('journal_mode = WAL');
  db.pragma('cache_size = -262144');
  db.pragma('temp_store = MEMORY');

  // Denselben Schemastand herstellen, den das Spiel beim Laden herstellt.
  migrateSavegame(db);

  const candidates = listStageCandidates(db);
  const filtered = options.profiles
    ? candidates.filter((candidate) => options.profiles!.includes(candidate.profile))
    : candidates;
  const chosen = options.stageIds
    ? filtered.filter((candidate) => options.stageIds!.includes(candidate.stageId))
    : selectStages(filtered, options.perProfile);
  // Aufteilung erst nach der Auswahl: jeder Prozess misst dieselbe Stichprobe,
  // nur einen anderen Ausschnitt davon.
  const stages = options.shardCount > 1
    ? chosen.filter((_, index) => index % options.shardCount === options.shardIndex)
    : chosen;

  if (options.dumpBootstrap) {
    const target = stages[0];
    if (!target) {
      console.error('Keine Etappe gewaehlt — --stages=<id> angeben.');
      process.exit(1);
    }
    rollStageWeatherOnce(db, target.stageId);
    const dumped = withSilencedConsole(() => buildStageBootstrap(db, target.stageId));
    if (!dumped) {
      console.error(`Etappe ${target.stageId}: kein Bootstrap erzeugbar.`);
      process.exit(1);
    }
    fs.mkdirSync(path.dirname(options.dumpBootstrap), { recursive: true });
    fs.writeFileSync(options.dumpBootstrap, JSON.stringify(dumped), 'utf8');
    db.close();
    fs.rmSync(path.dirname(workingCopy), { recursive: true, force: true });
    console.error(
      `Bootstrap Etappe ${target.stageId} (${target.profile}, ${dumped.riders.length} Fahrer) → ${options.dumpBootstrap}`,
    );
    return;
  }

  fs.mkdirSync(options.outDir, { recursive: true });
  console.error(`${stages.length} Etappen x ${options.runs} Laeufe — Spielstand ${path.basename(options.savegame)}`);

  // Etappenunabhaengigen Teil einmal laden statt einmal je Etappe.
  const bootstrapContext = withSilencedConsole(() => createBootstrapContext(db));

  const references: StageReference[] = [];
  for (const [index, stage] of stages.entries()) {
    process.stderr.write(
      `  [${index + 1}/${stages.length}] ${stage.profile.padEnd(16)} ${stage.raceName} #${stage.stageNumber} … `,
    );
    let reference: StageReference | null = null;
    try {
      reference = runStage(db, stage, options.runs, bootstrapContext);
    } catch (error) {
      console.error(`Fehler: ${(error as Error).message}`);
      continue;
    }
    if (!reference) {
      console.error('uebersprungen (keine Startliste)');
      continue;
    }
    references.push(reference);
    fs.writeFileSync(
      path.join(options.outDir, `stage-${stage.stageId}.json`),
      JSON.stringify(reference, null, 2),
      'utf8',
    );
    const winner = reference.aggregate['winnerTimeSeconds'];
    const firstGroup = reference.aggregate['firstGroupSize'];
    const spearman = reference.aggregate['favouriteSpearman'];
    console.error(
      `Sieger ${(winner ? winner.median / 60 : 0).toFixed(1)} min · `
      + `1. Gruppe ${(firstGroup?.median ?? 0).toFixed(0)} · `
      + `rho ${(spearman?.median ?? 0).toFixed(2)}`,
    );
  }

  const summarySuffix = options.shardCount > 1 ? `-shard${options.shardIndex}` : '';
  const summaryPath = path.join(options.outDir, `summary${summarySuffix}.csv`);
  writeSummaryCsv(references, summaryPath);
  db.close();
  fs.rmSync(path.dirname(workingCopy), { recursive: true, force: true });

  console.error(`\nFertig. ${references.length} Etappen → ${summaryPath}`);
}

main();
