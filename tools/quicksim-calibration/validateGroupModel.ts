/**
 * Prueft das Gruppenmodell gegen den Referenzdatensatz.
 *
 * Fuer jede gemessene Etappe wird der Anteil der ersten Zeitgruppe, den das
 * Modell erwartet, gegen den beobachteten gestellt. Das ist der eine Test, der
 * nach jeder Parameteraenderung laufen muss — ein Modell, das die Momente der
 * Ziehungen trifft, kann die Etappen trotzdem verfehlen.
 *
 * Erwartungswert des Modells je Etappe:
 *   P(geschlossen) · E[Anteil | geschlossen] + (1 − P) · E[Anteil | zerfallen]
 *
 * Aufruf: npm run calibrate:validate -- --in=debug/quicksim-reference
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  resolveBunchProbability,
  resolveDifficultyPerKm,
  resolveFirstGroupShareMean,
} from '../../shared/quickSim/groupModel';
import { DEFAULT_QUICK_SIM_PROFILES } from '../../shared/quickSimProfiles';
import type { StageProfile } from '../../shared/types';
import type { StageRunMetrics } from './metrics';

/** Zeitfahren haben keine Gruppendynamik. */
const EXCLUDED_PROFILES = new Set(['ITT', 'TTT']);

interface StageReferenceFile {
  stage: {
    stageId: number;
    profile: string;
    stageScore: number | null;
    distanceKm: number | null;
  };
  runs: StageRunMetrics[];
}

interface Comparison {
  profile: string;
  stageCount: number;
  observed: number;
  predicted: number;
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

  const byProfile = new Map<string, Array<{ observed: number; predicted: number }>>();
  for (const name of fs.readdirSync(inputDir)) {
    if (!name.startsWith('stage-') || !name.endsWith('.json')) {
      continue;
    }
    const reference = JSON.parse(
      fs.readFileSync(path.join(inputDir, name), 'utf8'),
    ) as StageReferenceFile;
    const { profile, stageScore, distanceKm } = reference.stage;
    if (EXCLUDED_PROFILES.has(profile) || stageScore == null || !distanceKm) {
      continue;
    }
    const parameters = DEFAULT_QUICK_SIM_PROFILES[profile as StageProfile];
    if (!parameters) {
      continue;
    }
    const runs = reference.runs.filter((run) => run.finisherCount > 0);
    if (runs.length === 0) {
      continue;
    }

    const observed = runs.reduce((sum, run) => sum + (run.firstGroupSize / run.finisherCount), 0) / runs.length;
    const difficultyPerKm = resolveDifficultyPerKm(stageScore, distanceKm);
    const bunchProbability = resolveBunchProbability(parameters, difficultyPerKm);
    const predicted =
      (bunchProbability * resolveFirstGroupShareMean(parameters, 'bunched', difficultyPerKm))
      + ((1 - bunchProbability) * resolveFirstGroupShareMean(parameters, 'split', difficultyPerKm));

    const bucket = byProfile.get(profile) ?? [];
    bucket.push({ observed, predicted });
    byProfile.set(profile, bucket);
  }

  const comparisons: Comparison[] = [...byProfile.entries()]
    .map(([profile, entries]) => ({
      profile,
      stageCount: entries.length,
      observed: entries.reduce((sum, entry) => sum + entry.observed, 0) / entries.length,
      predicted: entries.reduce((sum, entry) => sum + entry.predicted, 0) / entries.length,
    }))
    .sort((left, right) => right.observed - left.observed);

  console.log('');
  console.log('Anteil der ersten Zeitgruppe — Referenz gegen Modell');
  console.log('Profil            Etappen  beobachtet  Modell    Delta');
  console.log('----------------- -------  ----------  ------  -------');
  let weightedError = 0;
  let stageTotal = 0;
  for (const entry of comparisons) {
    const delta = entry.predicted - entry.observed;
    weightedError += Math.abs(delta) * entry.stageCount;
    stageTotal += entry.stageCount;
    console.log(
      entry.profile.padEnd(17)
      + String(entry.stageCount).padStart(8)
      + entry.observed.toFixed(3).padStart(12)
      + entry.predicted.toFixed(3).padStart(8)
      + `${delta >= 0 ? '+' : ''}${delta.toFixed(3)}`.padStart(9),
    );
  }
  const meanAbsoluteError = stageTotal === 0 ? 0 : weightedError / stageTotal;
  console.log('');
  console.log(`Mittlerer absoluter Fehler je Etappe: ${meanAbsoluteError.toFixed(3)}`);
  console.log('');
  if (meanAbsoluteError > 0.08) {
    console.log('Zu gross — das Modell trifft die Referenz nicht mehr.');
    process.exit(1);
  }
}

main();
