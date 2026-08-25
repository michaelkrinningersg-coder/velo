/**
 * Der Kerntest fuer den Etappen-Seed: dieselbe Etappe mit demselben Seed muss
 * dasselbe Rennen ergeben — und mit einem anderen Seed ein anderes.
 *
 * Laeuft gegen die echte Engine, aber ohne Datenbank: der Bootstrap liegt als
 * Vorlage bei. Das macht den Test schnell, unabhaengig vom Spielstand und
 * unabhaengig von der GameRepository-Bruecke.
 *
 * Vorlage neu erzeugen:
 *   npm run calibrate:reference -- --stages=549 \
 *     --dump-bootstrap=backend/src/__tests__/fixtures/stage-549-bootstrap.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { SimulationEngine } from '../../frontend/src/race-sim/SimulationEngine';
import type { RealtimeSimulationBootstrap } from '../../shared/types';

const FIXTURE = path.join(
  __dirname, '..', '..', 'backend', 'src', '__tests__', 'fixtures', 'stage-549-bootstrap.json',
);

interface RaceOutcome {
  riderId: number;
  finishTimeSeconds: number | null;
  finishStatus: string | null;
}

function loadBootstrap(): RealtimeSimulationBootstrap {
  return JSON.parse(fs.readFileSync(FIXTURE, 'utf8')) as RealtimeSimulationBootstrap;
}

function silence<T>(run: () => T): T {
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

function raceWithSeed(seed: number): RaceOutcome[] {
  return silence(() => {
    // Frischer Bootstrap je Lauf: die Engine veraendert bootstrap.riders
    // (Heimvorteil, Sonderformen) — ein geteiltes Objekt wuerde den zweiten
    // Lauf verfaelschen und der Test waere wertlos.
    const engine = new SimulationEngine(loadBootstrap(), {
      maxSubstepSeconds: 5,
      isInstantSimulation: true,
      seed,
    });
    let finished = false;
    let steps = 0;
    while (!finished && steps < 200_000) {
      finished = engine.step(300).isFinished;
      steps += 1;
    }
    return engine.getSnapshot().riders
      .map((rider) => ({
        riderId: rider.riderId,
        finishTimeSeconds: rider.finishTimeSeconds,
        finishStatus: rider.finishStatus,
      }))
      .sort((left, right) => left.riderId - right.riderId);
  });
}

describe('Etappen-Seed', () => {
  it('hat eine brauchbare Vorlage mit vollem Starterfeld', () => {
    const bootstrap = loadBootstrap();
    expect(bootstrap.riders.length).toBeGreaterThan(50);
    expect(bootstrap.stageSummary.distanceKm).toBeGreaterThan(0);
  });

  it('liefert bei gleichem Seed exakt dasselbe Ergebnis', () => {
    const first = raceWithSeed(4711);
    const second = raceWithSeed(4711);
    expect(second).toEqual(first);
  }, 180_000);

  it('liefert bei anderem Seed ein anderes Ergebnis', () => {
    const a = raceWithSeed(4711);
    const b = raceWithSeed(4712);
    expect(b).not.toEqual(a);
  }, 180_000);

  it('nimmt den Seed aus dem Bootstrap, wenn keiner uebergeben wird', () => {
    const seeded = { ...loadBootstrap(), simSeed: 99_991 };
    const engine = silence(() => new SimulationEngine(seeded, { isInstantSimulation: true }));
    expect(engine.seed).toBe(99_991);
  });

  it('bevorzugt den uebergebenen Seed vor dem des Bootstraps', () => {
    const seeded = { ...loadBootstrap(), simSeed: 99_991 };
    const engine = silence(() => new SimulationEngine(seeded, { isInstantSimulation: true, seed: 12_345 }));
    expect(engine.seed).toBe(12_345);
  });

  it('zieht ohne jeden Seed einen eigenen, damit Altaufrufer weiterlaufen', () => {
    const withoutSeed = loadBootstrap();
    delete (withoutSeed as { simSeed?: number }).simSeed;
    const engineA = silence(() => new SimulationEngine(withoutSeed, { isInstantSimulation: true }));
    const engineB = silence(() => new SimulationEngine(loadBootstrap(), { isInstantSimulation: true }));
    expect(Number.isInteger(engineA.seed)).toBe(true);
    expect(engineA.seed).not.toBe(engineB.seed);
  });
});
