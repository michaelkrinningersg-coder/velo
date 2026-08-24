/**
 * Verdichtet den Referenzdatensatz zu Kalibrierzielen je Etappenprofil.
 *
 * Die Rohmessung liegt je Etappe vor. Zum Fitten braucht es sie je Profil und
 * in Groessen, die nicht an der einzelnen Etappe haengen — eine Siegerzeit von
 * 280 Minuten sagt nichts, solange man die Distanz nicht kennt. Deshalb wird
 * hier normalisiert:
 *
 *   Siegerzeit      → Durchschnittsgeschwindigkeit in km/h   (→ base_speed_kmh)
 *   Rueckstaende    → Sekunden je Kilometer                  (→ gap_factor)
 *   erste Gruppe    → absolut und als Anteil der Finisher    (→ group_threshold)
 *   Spearman        → unveraendert                           (→ noise_sigma)
 *
 * Aufruf: npm run calibrate:aggregate -- --in=debug/quicksim-reference
 */

import fs from 'node:fs';
import path from 'node:path';
import { summarize, TRACKED_GAP_RANKS, type Distribution, type StageRunMetrics } from './metrics';

interface StageReferenceFile {
  stage: {
    stageId: number;
    raceName: string;
    stageNumber: number;
    profile: string;
    stageScore: number | null;
    distanceKm: number | null;
  };
  weatherId: number | null;
  starterCount: number;
  runs: StageRunMetrics[];
  runtimeMsMedian: number;
}

interface ProfileTarget {
  profile: string;
  stageCount: number;
  runCount: number;
  distanceKm: Distribution | null;
  speedKmh: Distribution | null;
  firstGroupSize: Distribution | null;
  firstGroupShare: Distribution | null;
  timeGroupCount: Distribution | null;
  gapPerKmByRank: Record<number, Distribution | null>;
  lastGapPerKm: Distribution | null;
  dnfCount: Distribution | null;
  otlCount: Distribution | null;
  spearman: Distribution | null;
  runtimeMsMedian: number;
}

function readReferences(inputDir: string): StageReferenceFile[] {
  if (!fs.existsSync(inputDir)) {
    console.error(`Verzeichnis nicht gefunden: ${inputDir}`);
    process.exit(1);
  }
  return fs.readdirSync(inputDir)
    .filter((name) => name.startsWith('stage-') && name.endsWith('.json'))
    .map((name) => JSON.parse(fs.readFileSync(path.join(inputDir, name), 'utf8')) as StageReferenceFile);
}

function buildProfileTarget(profile: string, references: StageReferenceFile[]): ProfileTarget {
  const speeds: number[] = [];
  const firstGroupSizes: Array<number | null> = [];
  const firstGroupShares: Array<number | null> = [];
  const timeGroupCounts: Array<number | null> = [];
  const gapsPerKm: Record<number, Array<number | null>> = {};
  const lastGapsPerKm: Array<number | null> = [];
  const dnfCounts: Array<number | null> = [];
  const otlCounts: Array<number | null> = [];
  const spearmans: Array<number | null> = [];
  const distances: number[] = [];
  const runtimes: number[] = [];

  for (const rank of TRACKED_GAP_RANKS) {
    gapsPerKm[rank] = [];
  }

  let runCount = 0;
  for (const reference of references) {
    const distanceKm = reference.stage.distanceKm;
    if (!distanceKm || distanceKm <= 0) {
      continue;
    }
    distances.push(distanceKm);
    runtimes.push(reference.runtimeMsMedian);

    for (const run of reference.runs) {
      runCount += 1;
      if (run.winnerTimeSeconds > 0) {
        speeds.push(distanceKm / (run.winnerTimeSeconds / 3600));
      }
      firstGroupSizes.push(run.firstGroupSize);
      firstGroupShares.push(run.finisherCount > 0 ? run.firstGroupSize / run.finisherCount : null);
      timeGroupCounts.push(run.timeGroupCount);
      lastGapsPerKm.push(run.lastFinisherGapSeconds == null ? null : run.lastFinisherGapSeconds / distanceKm);
      dnfCounts.push(run.dnfCount);
      otlCounts.push(run.otlCount);
      spearmans.push(run.favouriteSpearman);
      for (const rank of TRACKED_GAP_RANKS) {
        const gap = run.gapSecondsByRank[rank];
        gapsPerKm[rank]!.push(gap == null ? null : gap / distanceKm);
      }
    }
  }

  const gapPerKmByRank: Record<number, Distribution | null> = {};
  for (const rank of TRACKED_GAP_RANKS) {
    gapPerKmByRank[rank] = summarize(gapsPerKm[rank]!);
  }

  const sortedRuntimes = [...runtimes].sort((left, right) => left - right);
  return {
    profile,
    stageCount: references.length,
    runCount,
    distanceKm: summarize(distances),
    speedKmh: summarize(speeds),
    firstGroupSize: summarize(firstGroupSizes),
    firstGroupShare: summarize(firstGroupShares),
    timeGroupCount: summarize(timeGroupCounts),
    gapPerKmByRank,
    lastGapPerKm: summarize(lastGapsPerKm),
    dnfCount: summarize(dnfCounts),
    otlCount: summarize(otlCounts),
    spearman: summarize(spearmans),
    runtimeMsMedian: sortedRuntimes[Math.floor(sortedRuntimes.length / 2)] ?? 0,
  };
}

function formatNumber(distribution: Distribution | null, digits = 2): string {
  return distribution ? distribution.median.toFixed(digits) : '–';
}

function main(): void {
  const argv = process.argv.slice(2);
  const get = (name: string): string | null => {
    const hit = argv.find((arg) => arg.startsWith(`--${name}=`));
    return hit ? hit.slice(name.length + 3) : null;
  };
  const inputDir = get('in') ?? path.join('debug', 'quicksim-reference');

  const references = readReferences(inputDir);
  if (references.length === 0) {
    console.error(`Keine stage-*.json in ${inputDir}.`);
    process.exit(1);
  }

  const byProfile = new Map<string, StageReferenceFile[]>();
  for (const reference of references) {
    const bucket = byProfile.get(reference.stage.profile) ?? [];
    bucket.push(reference);
    byProfile.set(reference.stage.profile, bucket);
  }

  const targets = [...byProfile.entries()]
    .map(([profile, group]) => buildProfileTarget(profile, group))
    .sort((left, right) => (right.speedKmh?.median ?? 0) - (left.speedKmh?.median ?? 0));

  fs.writeFileSync(
    path.join(inputDir, 'targets.json'),
    JSON.stringify(targets, null, 2),
    'utf8',
  );

  const header = [
    'profile', 'stages', 'runs', 'distance_km', 'speed_kmh', 'speed_sd',
    'first_group', 'first_group_share', 'time_groups',
    ...TRACKED_GAP_RANKS.map((rank) => `gap_rank${rank}_s_per_km`),
    'last_gap_s_per_km', 'dnf', 'otl', 'spearman', 'runtime_ms',
  ].join(';');
  const lines = targets.map((target) => [
    target.profile, target.stageCount, target.runCount,
    formatNumber(target.distanceKm, 1),
    formatNumber(target.speedKmh, 2),
    target.speedKmh ? target.speedKmh.sd.toFixed(2) : '–',
    formatNumber(target.firstGroupSize, 1),
    formatNumber(target.firstGroupShare, 3),
    formatNumber(target.timeGroupCount, 1),
    ...TRACKED_GAP_RANKS.map((rank) => formatNumber(target.gapPerKmByRank[rank] ?? null, 4)),
    formatNumber(target.lastGapPerKm, 4),
    formatNumber(target.dnfCount, 2),
    formatNumber(target.otlCount, 2),
    formatNumber(target.spearman, 3),
    target.runtimeMsMedian.toFixed(0),
  ].join(';'));
  fs.writeFileSync(path.join(inputDir, 'targets.csv'), [header, ...lines].join('\n') + '\n', 'utf8');

  const pad = (value: string, width: number) => value.padStart(width);
  console.log('');
  console.log('Profil            Etappen Laeufe   km   km/h  1.Gruppe  Anteil  Gruppen  s/km(letzter)   rho');
  console.log('----------------- ------- ------ ---- ------ --------- ------- -------- ------------- -----');
  for (const target of targets) {
    console.log(
      target.profile.padEnd(17)
      + pad(String(target.stageCount), 8)
      + pad(String(target.runCount), 7)
      + pad(formatNumber(target.distanceKm, 0), 5)
      + pad(formatNumber(target.speedKmh, 2), 7)
      + pad(formatNumber(target.firstGroupSize, 1), 10)
      + pad(formatNumber(target.firstGroupShare, 3), 8)
      + pad(formatNumber(target.timeGroupCount, 1), 9)
      + pad(formatNumber(target.lastGapPerKm, 3), 14)
      + pad(formatNumber(target.spearman, 2), 6),
    );
  }
  console.log('');
  console.log(`${targets.length} Profile → ${path.join(inputDir, 'targets.csv')} und targets.json`);
}

main();
