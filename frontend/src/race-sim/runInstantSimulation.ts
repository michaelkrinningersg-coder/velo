import type { RealtimeSimulationBootstrap } from '../../../shared/types';
import { SimulationEngine } from './SimulationEngine';
import type { SimulationSnapshot } from './SimulationEngine';

/**
 * Anzahl Renn-Sekunden, die pro Schleifendurchlauf am Stück simuliert werden.
 * Die Engine zerlegt jeden `step()` intern in 1-Sekunden-Substeps, daher ist
 * die Rennphysik (Drafting, Abstände, Gruppen) unabhängig von diesem Wert –
 * er steuert nur, wie oft der Fortschrittsbalken aktualisiert wird.
 */
const CHUNK_SECONDS = 300;

/**
 * Führt eine Etappensimulation vollständig „headless" (ohne Darstellung) aus.
 * Verwendet exakt dieselbe `SimulationEngine` wie die Live-Simulation und
 * liefert denselben finalen Snapshot, der anschließend über den regulären
 * Ergebnisdienst gespeichert werden kann.
 *
 * @param bootstrap  Identischer Bootstrap wie im Live-Rennen.
 * @param onProgress Callback mit Fortschritt im Bereich [0, 1].
 */
export async function runInstantSimulation(
  bootstrap: RealtimeSimulationBootstrap,
  onProgress?: (progress: number) => void,
): Promise<SimulationSnapshot> {
  const engine = new SimulationEngine(bootstrap, { maxSubstepSeconds: 5 });

  let isFinished = false;
  while (!isFinished) {
    const frame = engine.step(CHUNK_SECONDS);
    isFinished = frame.isFinished;

    if (onProgress) {
      const distanceProgress = frame.stageDistanceMeters > 0
        ? frame.leaderDistanceMeters / frame.stageDistanceMeters
        : 0;
      const finishedProgress = bootstrap.riders.length > 0
        ? frame.finishedRiders / bootstrap.riders.length
        : 0;
      const progress = Math.min(1, Math.max(0, Math.max(distanceProgress, finishedProgress)));
      onProgress(progress);
    }

    // Browser kurz freigeben, damit der Fortschrittsbalken neu gezeichnet wird.
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }

  onProgress?.(1);
  return engine.getSnapshot();
}
