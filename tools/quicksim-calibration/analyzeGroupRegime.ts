/**
 * Untersucht, wovon es abhaengt, ob ein Etappenfeld geschlossen ankommt.
 *
 * Hintergrund: die erste Zeitgruppe faellt ueber die Etappenprofile hinweg
 * nicht gleichmaessig ab, sondern springt — Flat 0,89, Rolling 0,67, Hilly
 * 0,38, und dann direkt auf unter 0,04 fuer alles Schwerere. Die Frage ist, ob
 * das eine Eigenschaft des Profils ist oder einer messbaren Etappengroesse.
 *
 * Dieses Werkzeug beantwortet sie: es setzt den Anteil der Laeufe mit
 * geschlossener Ankunft gegen die Schwierigkeit je Kilometer
 * (`stage_score / distanceKm`) und passt eine logistische Kurve an. Was danach
 * als Residuum je Profil uebrig bleibt, ist der echte Profileffekt.
 *
 * Aufruf: npm run calibrate:groups -- --in=debug/quicksim-reference
 */

import fs from 'node:fs';
import path from 'node:path';
import type { StageRunMetrics } from './metrics';

/** Ab diesem Anteil der Finisher in der ersten Zeitgruppe gilt ein Lauf als geschlossene Ankunft. */
const BUNCH_SHARE_THRESHOLD = 0.5;
/** Zeitfahren haben keine Gruppendynamik und bleiben aussen vor. */
const EXCLUDED_PROFILES = new Set(['ITT', 'TTT']);

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
}

interface StagePoint {
  stageId: number;
  profile: string;
  label: string;
  difficultyPerKm: number;
  runCount: number;
  bunchCount: number;
  bunchFraction: number;
  /** Mittlerer Anteil der ersten Zeitgruppe in Laeufen mit geschlossener Ankunft. */
  shareWhenBunched: number | null;
  /** Mittlerer Anteil in Laeufen ohne geschlossene Ankunft. */
  shareWhenSplit: number | null;
}

function mean(values: number[]): number | null {
  return values.length === 0 ? null : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function collectPoints(inputDir: string): StagePoint[] {
  const points: StagePoint[] = [];
  for (const name of fs.readdirSync(inputDir)) {
    if (!name.startsWith('stage-') || !name.endsWith('.json')) {
      continue;
    }
    const reference = JSON.parse(
      fs.readFileSync(path.join(inputDir, name), 'utf8'),
    ) as StageReferenceFile;
    const { profile, stageScore, distanceKm } = reference.stage;
    if (EXCLUDED_PROFILES.has(profile) || stageScore == null || !distanceKm || distanceKm <= 0) {
      continue;
    }

    const shares = reference.runs
      .filter((run) => run.finisherCount > 0)
      .map((run) => run.firstGroupSize / run.finisherCount);
    if (shares.length === 0) {
      continue;
    }

    const bunched = shares.filter((share) => share > BUNCH_SHARE_THRESHOLD);
    points.push({
      stageId: reference.stage.stageId,
      profile,
      label: `${reference.stage.raceName} #${reference.stage.stageNumber}`,
      difficultyPerKm: stageScore / distanceKm,
      runCount: shares.length,
      bunchCount: bunched.length,
      bunchFraction: bunched.length / shares.length,
      shareWhenBunched: mean(bunched),
      shareWhenSplit: mean(shares.filter((share) => share <= BUNCH_SHARE_THRESHOLD)),
    });
  }
  return points.sort((left, right) => left.difficultyPerKm - right.difficultyPerKm);
}

/**
 * Gewichtete logistische Regression P(bunch) = sigmoid(intercept + slope * D).
 * Jede Etappe traegt ihre Laeufe als Binomialbeobachtung bei, damit eine Etappe
 * mit 50 Laeufen nicht so viel zaehlt wie eine mit fuenf.
 */
function fitLogistic(points: StagePoint[]): { intercept: number; slope: number } {
  let intercept = 0;
  let slope = 0;
  const learningRate = 0.02;

  for (let iteration = 0; iteration < 200_000; iteration += 1) {
    let gradientIntercept = 0;
    let gradientSlope = 0;
    let totalWeight = 0;

    for (const point of points) {
      const z = intercept + (slope * point.difficultyPerKm);
      const predicted = 1 / (1 + Math.exp(-z));
      // Gradient der Binomial-Log-Likelihood: (beobachtet - erwartet) * n
      const residual = (point.bunchFraction - predicted) * point.runCount;
      gradientIntercept += residual;
      gradientSlope += residual * point.difficultyPerKm;
      totalWeight += point.runCount;
    }

    intercept += (learningRate * gradientIntercept) / totalWeight;
    slope += (learningRate * gradientSlope) / totalWeight;
  }

  return { intercept, slope };
}

function main(): void {
  const argv = process.argv.slice(2);
  const get = (name: string): string | null => {
    const hit = argv.find((arg) => arg.startsWith(`--${name}=`));
    return hit ? hit.slice(name.length + 3) : null;
  };
  const inputDir = get('in') ?? path.join('debug', 'quicksim-reference');

  if (!fs.existsSync(inputDir)) {
    console.error(`Verzeichnis nicht gefunden: ${inputDir}`);
    process.exit(1);
  }

  const points = collectPoints(inputDir);
  if (points.length < 5) {
    console.error(`Zu wenige Strassenetappen fuer eine Anpassung: ${points.length}.`);
    process.exit(1);
  }

  const { intercept, slope } = fitLogistic(points);
  const midpoint = -intercept / slope;
  const steepness = -slope;

  console.log('');
  console.log(`${points.length} Strassenetappen, ${points.reduce((sum, p) => sum + p.runCount, 0)} Laeufe`);
  console.log('');
  console.log('  P(geschlossene Ankunft) = 1 / (1 + exp( k * (D - D0) ))');
  console.log(`  D  = stage_score / km`);
  console.log(`  k  = ${steepness.toFixed(3)}   (Steilheit des Uebergangs)`);
  console.log(`  D0 = ${midpoint.toFixed(3)}   (Schwierigkeit je km, bei der es kippt)`);
  console.log('');

  console.log('Kurve:');
  for (const difficulty of [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.7, 1.0, 1.5, 2.0]) {
    const predicted = 1 / (1 + Math.exp(-(intercept + (slope * difficulty))));
    console.log(`  D=${difficulty.toFixed(2)}  →  ${(predicted * 100).toFixed(0).padStart(3)} %`);
  }
  console.log('');

  const residualsByProfile = new Map<string, number[]>();
  for (const point of points) {
    const predicted = 1 / (1 + Math.exp(-(intercept + (slope * point.difficultyPerKm))));
    const bucket = residualsByProfile.get(point.profile) ?? [];
    bucket.push(point.bunchFraction - predicted);
    residualsByProfile.set(point.profile, bucket);
  }

  console.log('Residuum je Profil (positiv = klumpt staerker, als die Schwierigkeit erwarten laesst):');
  for (const [profile, residuals] of [...residualsByProfile.entries()].sort()) {
    const average = mean(residuals) ?? 0;
    console.log(
      `  ${profile.padEnd(17)}${average >= 0 ? '+' : ''}${average.toFixed(3)}   (${residuals.length} Etappen)`,
    );
  }
  console.log('');

  const bunchedShares = points.map((point) => point.shareWhenBunched).filter((v): v is number => v != null);
  const splitShares = points.map((point) => point.shareWhenSplit).filter((v): v is number => v != null);
  console.log('Anteil der ersten Zeitgruppe je Regime (ueber alle Etappen gemittelt):');
  console.log(`  geschlossene Ankunft: ${((mean(bunchedShares) ?? 0) * 100).toFixed(1)} %`);
  console.log(`  zerfallenes Feld:     ${((mean(splitShares) ?? 0) * 100).toFixed(1)} %`);
  console.log('');

  console.log('Etappen nach Schwierigkeit je Kilometer:');
  console.log('   D      Profil            beobachtet  erwartet');
  for (const point of points) {
    const predicted = 1 / (1 + Math.exp(-(intercept + (slope * point.difficultyPerKm))));
    console.log(
      `  ${point.difficultyPerKm.toFixed(3).padStart(6)}  ${point.profile.padEnd(17)}`
      + `${(point.bunchFraction * 100).toFixed(0).padStart(8)} %`
      + `${(predicted * 100).toFixed(0).padStart(9)} %`,
    );
  }

  fs.writeFileSync(
    path.join(inputDir, 'group-regime.json'),
    JSON.stringify({ steepness, midpoint, intercept, slope, points }, null, 2),
    'utf8',
  );
  console.log('');
  console.log(`→ ${path.join(inputDir, 'group-regime.json')}`);
}

main();
