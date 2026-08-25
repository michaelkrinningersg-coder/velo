/**
 * Bindeglied zwischen einem Etappen-Bootstrap und der Quick Simulation.
 *
 * Ruft denselben Laeufer auf, den auch das Spiel benutzt
 * (`frontend/src/race-sim/runQuickSimulation.ts`). Ein zweiter Aufbau nur fuer
 * die Messung wuerde mit der Zeit davon abweichen — und die Kalibrierung waere
 * dann fuer etwas gueltig, das niemand spielt.
 */

import { runQuickSimulation } from '../../frontend/src/race-sim/runQuickSimulation';
import type { QuickSimStageResult } from '../../shared/quickSim/simulateStage';
import type { QuickSimProfileParameters } from '../../shared/quickSimProfiles';
import type { RealtimeSimulationBootstrap } from '../../shared/types';

export interface RunQuickStageOptions {
  bootstrap: RealtimeSimulationBootstrap;
  seed: number;
  /**
   * Etappenwert. Wird nur noch fuer Bootstraps gebraucht, in denen er fehlt —
   * der Laeufer liest ihn sonst selbst aus `stage.profileScore`.
   */
  stageScore?: number | null;
  parameters?: QuickSimProfileParameters;
}

export function runQuickStage(options: RunQuickStageOptions): QuickSimStageResult {
  const { bootstrap, seed, stageScore, parameters } = options;
  const patched = stageScore != null && bootstrap.stage.profileScore == null
    ? { ...bootstrap, stage: { ...bootstrap.stage, profileScore: stageScore } }
    : bootstrap;
  return runQuickSimulation(patched, { seed, ...(parameters ? { parameters } : {}) }).result;
}
