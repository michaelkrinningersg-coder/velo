/**
 * Quick Simulation: ein Etappenergebnis ohne Substep-Schleife.
 *
 * Bindet den reinen Kern aus `shared/quickSim` an das Spiel an. Alles, was vor
 * dem Rennen feststeht — Favoritenwertung, Vorfaelle, Ausreisserplan — kommt
 * aus denselben Funktionen und denselben abgeleiteten Seeds wie in der
 * Instant-Simulation. Damit sehen beide Modi auf derselben Etappe mit
 * demselben Seed dieselben Stuerze und denselben Einholpunkt; sie
 * unterscheiden sich nur darin, wie aus alldem Zielzeiten werden.
 *
 * Rueckgabe ist bewusst kein `SimulationSnapshot`: der Modus simuliert keine
 * Positionen, keine Uhr und keine Cluster. Geliefert wird genau das, was der
 * Commit-Dienst braucht.
 */

import {
  resolveMarkerRanking,
  type QuickSimBreakawayPlan,
} from '../../../shared/quickSim/breakaway';
import type { QuickSimIncident } from '../../../shared/quickSim/incidents';
import {
  simulateQuickStage,
  type QuickSimResultEntry,
  type QuickSimStageResult,
} from '../../../shared/quickSim/simulateStage';
import {
  DEFAULT_QUICK_SIM_PROFILES,
  type QuickSimProfileParameters,
} from '../../../shared/quickSimProfiles';
import { createRandomSeed, createSeededRandom, deriveSeed } from '../../../shared/rng';
import type {
  PrecalculatedRaceIncident,
  RaceSimMessage,
  RealtimeSimulationBootstrap,
  RealtimeStageCommitEntry,
  Rider,
  StageMarkerClassification,
  StageMarkerClassificationEntry,
  StageProfile,
} from '../../../shared/types';
import { precalculateRaceIncidents } from './incidents';
import { calculateStageFavorites, calculateStageFavoriteRiderRanking } from './stageFavorites';
import { precalculateStageBreakaway } from './stageBreakaways';
import { collectStageBoundaryMarkers, isMountainClassificationMarker } from './stageSummary';
import {
  buildStageScoringWeightMap,
  resolveMarkerWeightProfile,
  resolveWeightProfileValue,
} from './markerWeights';

/** Wie viele Raenge je Zwischenwertung geliefert werden. Der Commit-Dienst vergibt danach die Punkte. */
const MARKER_RANKS = 15;

export interface QuickSimulationOutcome {
  entries: RealtimeStageCommitEntry[];
  markerClassifications: StageMarkerClassification[];
  incidents: PrecalculatedRaceIncident[];
  events: RaceSimMessage[];
  /** Kennzahlen des Laufs — fuer Anzeige und Kalibrierung. */
  result: QuickSimStageResult;
  seed: number;
}

export interface RunQuickSimulationOptions {
  /** Ueberschreibt den Etappen-Seed. Sonst der aus dem Bootstrap. */
  seed?: number;
  /** Ueberschreibt die Profilparameter. Sonst die aus der Datenbank oder die Vorgabe. */
  parameters?: QuickSimProfileParameters;
}

interface StageMarkerInfo {
  key: string;
  label: string;
  markerType: StageMarkerClassification['markerType'];
  markerCategory: StageMarkerClassification['markerCategory'];
  kmMark: number;
}

/**
 * Zwischenwertungen der Etappe, in derselben Auswahl und Reihenfolge wie
 * `buildIntermediateMarkers` in der Engine.
 */
function collectIntermediateMarkers(bootstrap: RealtimeSimulationBootstrap): StageMarkerInfo[] {
  return collectStageBoundaryMarkers(bootstrap.stageSummary)
    .filter(({ marker }) => marker.type === 'sprint_intermediate' || isMountainClassificationMarker(marker))
    .map(({ key, label, marker, kmMark }) => ({
      key,
      label,
      markerType: marker.type,
      markerCategory: marker.cat,
      kmMark,
    }))
    .sort((left, right) => left.kmMark - right.kmMark);
}

export function runQuickSimulation(
  bootstrap: RealtimeSimulationBootstrap,
  options?: RunQuickSimulationOptions,
): QuickSimulationOutcome {
  const profile = bootstrap.stage.profile as StageProfile;
  const distanceKm = bootstrap.stageSummary.distanceKm;
  const elevationGainMeters = bootstrap.stageSummary.elevationGainMeters;
  const seed = options?.seed ?? bootstrap.simSeed ?? createRandomSeed();
  const parameters = options?.parameters
    ?? bootstrap.quickSimProfiles?.[profile]
    ?? DEFAULT_QUICK_SIM_PROFILES[profile];

  const ranking = calculateStageFavoriteRiderRanking(
    bootstrap.riders,
    bootstrap.teams,
    bootstrap.stage,
    { distanceKm, elevationGainMeters },
  );

  // Dieselben abgeleiteten Stroeme wie in SimulationEngine — gleicher Seed,
  // gleiche Stuerze, gleicher Einholpunkt.
  const precalculatedIncidents = precalculateRaceIncidents(
    bootstrap.riders,
    bootstrap.stage,
    distanceKm,
    createSeededRandom(deriveSeed(seed, 'incidents')),
  );
  const incidents: QuickSimIncident[] = precalculatedIncidents.map((incident) => ({
    riderId: incident.riderId,
    type: incident.type,
    severity: incident.severity,
    triggerDistanceKm: incident.triggerDistanceKm,
    waitDurationSeconds: incident.waitDurationSeconds,
  }));

  const plan = precalculateStageBreakaway(
    bootstrap.riders,
    bootstrap.race,
    bootstrap.stage,
    bootstrap.stageSummary,
    calculateStageFavorites(bootstrap.riders, bootstrap.teams, bootstrap.stage, { distanceKm, elevationGainMeters }),
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

  const result = simulateQuickStage({
    profile,
    distanceKm,
    stageScore: bootstrap.stage.profileScore ?? null,
    parameters,
    riders: ranking.map((candidate) => ({
      riderId: candidate.rider.id,
      score: candidate.effectiveSkill,
      // Der Tie-Break innerhalb einer Zeitgruppe: derselbe Wert wie die
      // Reihenfolge, die Fahrer-ID entscheidet den Rest.
      photoFinishScore: candidate.effectiveSkill,
      teamId: candidate.rider.activeTeamId ?? undefined,
    })),
    incidents,
    breakaway,
    random: createSeededRandom(deriveSeed(seed, 'quicksim')),
  });

  const riderById = new Map(bootstrap.riders.map((rider) => [rider.id, rider]));
  const breakawayRiderIds = new Set(plan?.riderIds ?? []);
  const entries = buildCommitEntries(result, bootstrap, breakawayRiderIds);
  const markerClassifications = buildMarkerClassifications({
    bootstrap, result, breakaway, parameters, riderById,
  });

  return {
    entries,
    markerClassifications,
    incidents: precalculatedIncidents,
    events: buildEvents(result, bootstrap, plan, riderById),
    result,
    seed,
  };
}

/**
 * Ergebniszeilen fuer den Commit-Dienst. Ueber die Startliste iteriert, nicht
 * ueber das Ergebnis: der Dienst erwartet genau einen Zielstatus je Starter.
 */
function buildCommitEntries(
  result: QuickSimStageResult,
  bootstrap: RealtimeSimulationBootstrap,
  breakawayRiderIds: ReadonlySet<number>,
): RealtimeStageCommitEntry[] {
  const byRiderId = new Map(result.entries.map((entry) => [entry.riderId, entry]));
  return bootstrap.riders.map((starter) => {
    const entry = byRiderId.get(starter.id) ?? null;
    const isDnf = entry == null || entry.isAbandon || entry.stageTimeSeconds == null;
    return {
      riderId: starter.id,
      finishTimeSeconds: isDnf ? null : entry.stageTimeSeconds,
      finishStatus: isDnf ? 'dnf' : 'finished',
      isBreakaway: breakawayRiderIds.has(starter.id),
      statusReason: isDnf ? resolveAbandonReason(entry) : null,
      photoFinishScore: entry?.photoFinishScore,
    } satisfies RealtimeStageCommitEntry;
  });
}

function resolveAbandonReason(entry: QuickSimResultEntry | null): string | null {
  if (!entry?.incident) {
    return null;
  }
  return entry.incident.type === 'crash' ? 'Sturz' : 'Defekt';
}

interface MarkerBuildInput {
  bootstrap: RealtimeSimulationBootstrap;
  result: QuickSimStageResult;
  breakaway: QuickSimBreakawayPlan | null;
  parameters: QuickSimProfileParameters;
  riderById: ReadonlyMap<number, Rider>;
}

/**
 * Zwischenwertungen aus dem Einholpunkt.
 *
 * Der Einholpunkt steht vor dem Rennen fest (`phaseEndDistanceMeters` aus dem
 * Ausreisserplan). Wertungen davor fallen aus der Ausreissergruppe, danach aus
 * dem Kopf des Feldes — ohne dass eine Sekunde simuliert werden muss.
 */
function buildMarkerClassifications(input: MarkerBuildInput): StageMarkerClassification[] {
  const { bootstrap, result, breakaway, parameters, riderById } = input;
  const markers = collectIntermediateMarkers(bootstrap);
  if (markers.length === 0) {
    return [];
  }

  const weightMap = buildStageScoringWeightMap(bootstrap.stageScoringRules ?? []);
  const catchKm = breakaway ? breakaway.phaseEndDistanceMeters / 1000 : 0;
  const finishOrder = result.entries.filter((entry) => !entry.isAbandon).map((entry) => entry.riderId);
  // Ausreisser koennen aufgegeben haben und stehen dann nicht im Zielfeld —
  // ihre Marker-Wertung wird trotzdem gebraucht.
  const markerCandidates = [...new Set([...finishOrder, ...(breakaway?.riderIds ?? [])])];
  const winnerTimeSeconds = result.winnerTimeSeconds;
  const distanceKm = bootstrap.stageSummary.distanceKm;

  return markers.map((marker) => {
    const weights = resolveMarkerWeightProfile(weightMap, marker.markerType, marker.markerCategory);
    // Je Fahrer einmal rechnen, nicht einmal je Vergleich: der Sortiervergleich
    // wuerde denselben Wert sonst rund log2(n)-mal anfordern.
    const scoreByRiderId = new Map<number, number>();
    for (const riderId of markerCandidates) {
      const rider = riderById.get(riderId);
      // Derselbe deterministische Tie-Break wie in der Engine, damit zwei
      // gleich starke Fahrer nicht an jeder Wertung in derselben Reihenfolge
      // stehen.
      scoreByRiderId.set(riderId, rider
        ? resolveWeightProfileValue(rider.skills, weights)
          + (resolveDeterministicRatio(`${bootstrap.stage.id}:${marker.key}:${riderId}`) * 25)
        : 0);
    }
    const resolveMarkerScore = (riderId: number): number => scoreByRiderId.get(riderId) ?? 0;

    const fieldOrder = [...finishOrder].sort(
      (left, right) => resolveMarkerScore(right) - resolveMarkerScore(left) || left - right,
    );
    const ranking = resolveMarkerRanking({
      markerKm: marker.kmMark,
      rankCount: MARKER_RANKS,
      catchKm,
      plan: breakaway,
      parameters,
      fieldOrderByMarkerScore: fieldOrder,
      resolveMarkerScore,
    });

    // Die Ueberquerungszeit ist keine gemessene Groesse, sondern aus dem
    // Kilometer und der Siegerzeit hochgerechnet — der Commit-Dienst braucht
    // sie nur, um die Reihenfolge zu halten.
    const crossingTimeSeconds = distanceKm > 0
      ? Math.round((marker.kmMark / distanceKm) * winnerTimeSeconds)
      : 0;
    const entries: StageMarkerClassificationEntry[] = ranking.riderIds.map((riderId, index) => ({
      riderId,
      rank: index + 1,
      crossingTimeSeconds: crossingTimeSeconds + index,
      gapSeconds: index,
      photoFinishScore: resolveMarkerScore(riderId),
    }));

    return {
      markerKey: marker.key,
      markerLabel: marker.label,
      markerType: marker.markerType,
      markerCategory: marker.markerCategory,
      kmMark: marker.kmMark,
      entries,
    };
  });
}

/** FNV-1a, identisch zu `resolveDeterministicRatio` in der Engine. */
function resolveDeterministicRatio(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

/**
 * Ereignisse der Etappe.
 *
 * Der Modus simuliert nichts, hat aber trotzdem etwas zu erzaehlen: die
 * Ausreissergruppe, der Einholpunkt und die Stuerze stehen alle vorberechnet
 * fest. Das ist der Unterschied zwischen einer Ergebnistabelle und einer
 * Etappe, die stattgefunden hat.
 */
function buildEvents(
  result: QuickSimStageResult,
  bootstrap: RealtimeSimulationBootstrap,
  plan: { riderIds: number[]; triggerDistanceMeters: number; phaseEndDistanceMeters: number } | null,
  riderById: ReadonlyMap<number, Rider>,
): RaceSimMessage[] {
  const events: RaceSimMessage[] = [];
  const distanceKm = bootstrap.stageSummary.distanceKm;
  const winnerTimeSeconds = result.winnerTimeSeconds;
  const atKm = (kmMark: number): number => (distanceKm > 0
    ? Math.round((kmMark / distanceKm) * winnerTimeSeconds)
    : 0);
  const nameOf = (riderId: number): string => {
    const rider = riderById.get(riderId);
    return rider ? `${rider.firstName} ${rider.lastName}` : `Fahrer ${riderId}`;
  };
  let nextId = 1;

  if (plan && plan.riderIds.length > 0) {
    const triggerKm = plan.triggerDistanceMeters / 1000;
    events.push({
      id: nextId += 1,
      elapsedSeconds: atKm(triggerKm),
      riderId: plan.riderIds[0] ?? null,
      riderName: plan.riderIds[0] != null ? nameOf(plan.riderIds[0]) : null,
      riderTeamId: null,
      type: 'attack',
      tone: 'neutral',
      title: `Ausreissergruppe gebildet: ${plan.riderIds.length} Fahrer`,
      detail: plan.riderIds.map(nameOf).join(', '),
      kmMark: Math.round(triggerKm * 10) / 10,
    });

    const catchKm = plan.phaseEndDistanceMeters / 1000;
    if (catchKm < distanceKm) {
      events.push({
        id: nextId += 1,
        elapsedSeconds: atKm(catchKm),
        riderId: null,
        riderName: null,
        riderTeamId: null,
        type: 'attack',
        tone: 'neutral',
        title: 'Ausreisser gestellt',
        detail: `Das Feld holt die Spitzengruppe bei Kilometer ${catchKm.toFixed(1)} ein.`,
        kmMark: Math.round(catchKm * 10) / 10,
      });
    } else if (result.breakawaySurvived) {
      events.push({
        id: nextId += 1,
        elapsedSeconds: winnerTimeSeconds,
        riderId: null,
        riderName: null,
        riderTeamId: null,
        type: 'attack',
        tone: 'neutral',
        title: 'Die Ausreisser kommen durch',
        detail: 'Das Feld bekommt die Spitzengruppe nicht mehr zu fassen.',
        kmMark: Math.round(distanceKm * 10) / 10,
      });
    }
  }

  for (const entry of result.entries) {
    const incident = entry.incident;
    if (!incident) {
      continue;
    }
    const rider = riderById.get(entry.riderId);
    events.push({
      id: nextId += 1,
      elapsedSeconds: atKm(incident.triggerDistanceKm),
      riderId: entry.riderId,
      riderName: nameOf(entry.riderId),
      riderTeamId: rider?.activeTeamId ?? null,
      type: entry.isAbandon ? 'dnf' : 'incident',
      tone: entry.isAbandon ? 'danger' : 'warning',
      title: incident.type === 'crash' ? 'Sturz' : 'Defekt',
      detail: entry.isAbandon
        ? `${nameOf(entry.riderId)} kann das Rennen nicht fortsetzen.`
        : `${nameOf(entry.riderId)} verliert ${Math.round(incident.timeLossSeconds)} Sekunden.`,
      kmMark: Math.round(incident.triggerDistanceKm * 10) / 10,
    });
  }

  return events.sort((left, right) => left.elapsedSeconds - right.elapsedSeconds);
}
