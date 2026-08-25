/**
 * Bindeglied zwischen einem Etappen-Bootstrap und dem reinen Kern der Quick
 * Simulation.
 *
 * Der Kern in `shared/quickSim` kennt weder Fahrer noch Datenbank — er bekommt
 * Scores, einen Ausreisserplan und Vorfaelle hereingereicht. Dieser Adapter
 * besorgt die drei aus denselben Funktionen, die auch die Instant-Simulation
 * benutzt, und mit denselben abgeleiteten Seeds. Dadurch sehen beide Modi auf
 * derselben Etappe mit demselben Seed dieselben Stuerze und denselben
 * Einholpunkt.
 *
 * Er liegt im Kalibrierwerkzeug, nicht im Spiel: die Anbindung an die
 * Oberflaeche ist der naechste Schritt, die Messbarkeit des Kerns nicht.
 */

import { calculateStageFavorites, calculateStageFavoriteRiderRanking } from '../../frontend/src/race-sim/stageFavorites';
import { precalculateRaceIncidents } from '../../frontend/src/race-sim/incidents';
import { precalculateStageBreakaway } from '../../frontend/src/race-sim/stageBreakaways';
import type { QuickSimBreakawayPlan } from '../../shared/quickSim/breakaway';
import type { QuickSimIncident } from '../../shared/quickSim/incidents';
import {
  simulateQuickStage,
  type QuickSimStageResult,
} from '../../shared/quickSim/simulateStage';
import { DEFAULT_QUICK_SIM_PROFILES, type QuickSimProfileParameters } from '../../shared/quickSimProfiles';
import { createSeededRandom, deriveSeed } from '../../shared/rng';
import type { RealtimeStageBootstrap, StageProfile } from '../../shared/types';

export interface RunQuickStageOptions {
  bootstrap: RealtimeStageBootstrap;
  seed: number;
  stageScore: number | null;
  parameters?: QuickSimProfileParameters;
}

export function runQuickStage(options: RunQuickStageOptions): QuickSimStageResult {
  const { bootstrap, seed, stageScore } = options;
  const profile = bootstrap.stage.profile as StageProfile;
  const parameters = options.parameters ?? DEFAULT_QUICK_SIM_PROFILES[profile];
  const distanceKm = bootstrap.stageSummary.distanceKm;

  const ranking = calculateStageFavoriteRiderRanking(
    bootstrap.riders,
    bootstrap.teams,
    bootstrap.stage,
    { distanceKm, elevationGainMeters: bootstrap.stageSummary.elevationGainMeters },
  );

  // Dieselben abgeleiteten Stroeme wie in SimulationEngine — gleicher Seed,
  // gleiche Vorfaelle.
  const incidents: QuickSimIncident[] = precalculateRaceIncidents(
    bootstrap.riders,
    bootstrap.stage,
    distanceKm,
    createSeededRandom(deriveSeed(seed, 'incidents')),
  ).map((incident) => ({
    riderId: incident.riderId,
    type: incident.type,
    severity: incident.severity,
    triggerDistanceKm: incident.triggerDistanceKm,
    waitDurationSeconds: incident.waitDurationSeconds,
  }));

  const stageFavorites = calculateStageFavorites(
    bootstrap.riders,
    bootstrap.teams,
    bootstrap.stage,
    { distanceKm, elevationGainMeters: bootstrap.stageSummary.elevationGainMeters },
  );
  const plan = precalculateStageBreakaway(
    bootstrap.riders,
    bootstrap.race,
    bootstrap.stage,
    bootstrap.stageSummary,
    stageFavorites,
    bootstrap.gcStandings,
    bootstrap.mountainStandings,
    bootstrap.teams,
    createSeededRandom(deriveSeed(seed, 'breakaway')),
  );
  const breakaway: QuickSimBreakawayPlan | null = plan
    ? {
      riderIds: plan.riderIds,
      phaseEndDistanceMeters: plan.phaseEndDistanceMeters,
      triggerDistanceMeters: plan.triggerDistanceMeters,
      skillBonus: plan.skillBonus,
      malusValue: plan.malusValue,
    }
    : null;

  return simulateQuickStage({
    profile,
    distanceKm,
    stageScore,
    parameters,
    riders: ranking.map((candidate) => ({
      riderId: candidate.rider.id,
      score: candidate.effectiveSkill,
      // Nur das Mannschaftszeitfahren braucht die Zuordnung — dort ist das
      // Team die Zeitgruppe.
      teamId: candidate.rider.activeTeamId ?? undefined,
      // Der Tie-Break innerhalb einer Zeitgruppe ist in der vollen Simulation
      // ein eigener Wert; hier reicht der Score, solange er nicht identisch
      // ist — die Fahrer-ID entscheidet den Rest.
      photoFinishScore: candidate.effectiveSkill,
    })),
    incidents,
    breakaway,
    random: createSeededRandom(deriveSeed(seed, 'quicksim')),
  });
}
