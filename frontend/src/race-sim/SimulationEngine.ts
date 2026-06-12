import type {
  PrecalculatedRaceIncident,
  ParsedStageSegment,
  RealtimeFinishStatus,
  RealtimeSimulationBootstrap,
  Rider,
  RiderSkillKey,
  SkillWeightRule,
  Stage,
  StageMarkerCategory,
  StageMarkerClassification,
  StageMarkerClassificationEntry,
  StageMarkerType,
  StageScoringRule,
  StageTerrain,
  RaceSimMessage,
} from '../../../shared/types';
import { buildSkillWeightConfigMap, buildSkillWeightRuleMap, resolveFinalSpreadConfig, resolveSkillWeightComponents, resolveSkillWeightSimulationMode, resolveTttTerrainSpeedMultiplier, resolveWeightedSkillFromSkills } from './skillWeights';
import { precalculateRaceIncidents, buildDynamicCrashIncident } from './incidents';
import { applySpecialFormStatesWithContext } from './specialFormStates';
import { calculateStageFavorites, type FavoriteItem } from './stageFavorites';
import { precalculateStageBreakaway, type PrecalculatedStageBreakaway } from './stageBreakaways';
import { collectStageBoundaryMarkers, isMountainClassificationMarker } from './stageSummary';
import {
  ATTACK_SKILL_BONUS,
  COUNTER_ATTACK_DURATION_SECONDS,
  precalculateStageAttacks,
  resolveCounterAttackStarterIds,
  updateActiveStageAttacks,
  type ActiveStageAttack,
  type PrecalculatedStageAttack,
} from './stageAttacks';

export type TerrainSkillName = 'Flat' | 'Hill' | 'Medium_Mountain' | 'Mountain' | 'Cobble' | 'Sprint' | 'Downhill';

export interface WindZone {
  startMeter: number;
  endMeter: number;
  windSpeedKph: number;
  vector: number;
}

export interface RiderCluster {
  riderIds: number[];
  riderCount: number;
  distanceMeter: number;
}

export interface RealtimeRiderSnapshot {
  riderId: number;
  riderName: string;
  startOffsetSeconds: number;
  riderClockSeconds: number | null;
  hasStarted: boolean;
  distanceCoveredMeters: number;
  gapToLeaderMeters: number;
  segmentStartKm: number;
  segmentEndKm: number;
  segmentStartElevation: number;
  segmentEndElevation: number;
  activeTerrain: StageTerrain | 'Finish';
  skillName: TerrainSkillName | 'Finish';
  skillBreakdown: string;
  baseSkill: number;
  teamGroupBonus: number;
  effectiveSkill: number;
  staminaPenalty: number;
  elevationPenalty: number;
  dailyForm: number;
  microForm: number;
  gradientPercent: number;
  gradientModifier: number;
  windModifier: number;
  draftModifier: number;
  draftNearbyRiderCount: number;
  draftPackFactor: number;
  currentSpeedMps: number;
  photoFinishScore: number;
  lastSplitLabel: string | null;
  lastSplitTimeSeconds: number | null;
  splitTimes: Record<string, number>;
  finishTimeSeconds: number | null;
  finishStatus: RealtimeFinishStatus | null;
  statusReason: string | null;
  isAttacking: boolean;
  isBreakaway: boolean;
  isLeadingGroup: boolean;
  hasSuperform: boolean;
  hasSupermalus: boolean;
  isFinished: boolean;
}

export interface BreakawayGapStatusSnapshot {
  gapSeconds: number | null;
  penalty: number;
  kmMark: number | null;
}



export interface SimulationSnapshot {
  elapsedSeconds: number;
  stageDistanceMeters: number;
  leaderDistanceMeters: number;
  finishedRiders: number;
  isFinished: boolean;
  clusters: RiderCluster[];
  windZones: WindZone[];
}

export interface SimulationFrameSnapshot {
  elapsedSeconds: number;
  stageDistanceMeters: number;
  leaderDistanceMeters: number;
  finishedRiders: number;
  isFinished: boolean;
  clusters: RiderCluster[];
  windZones: WindZone[];
}

export interface SimulationSnapshot extends SimulationFrameSnapshot {
  riders: RealtimeRiderSnapshot[];
  markerClassifications: StageMarkerClassification[];
  incidents: PrecalculatedRaceIncident[];
  messages: RaceSimMessage[];
  stageFavorites: FavoriteItem[];
  breakawayPhaseActive: boolean;
  breakawayGapStatus: BreakawayGapStatusSnapshot | null;
  allEvents?: RaceSimMessage[];
}

interface MarkerCrossing {
  riderId: number;
  markerKey: string;
  markerLabel: string;
  markerType: StageMarkerType;
  markerCategory: StageMarkerCategory | null;
  kmMark: number;
  crossingTimeSeconds: number;
  photoFinishScore: number;
}

interface RiderState {
  rider: Rider;
  riderName: string;
  startOffsetSeconds: number;
  hasStarted: boolean;
  distanceCoveredMeters: number;
  nextDistanceCoveredMeters: number | null;
  segmentStartKm: number;
  segmentEndKm: number;
  segmentStartElevation: number;
  segmentEndElevation: number;
  dailyForm: number;
  microForm: number;
  nextFormUpdateMeter: number;
  finishTimeSeconds: number | null;
  segmentIndex: number;
  windZoneIndex: number;
  activeTerrain: StageTerrain | 'Finish';
  skillName: TerrainSkillName | 'Finish';
  skillBreakdown: string;
  baseSkill: number;
  teamGroupBonus: number;
  effectiveSkill: number;
  staminaPenalty: number;
  staminaSkillPenalty: number;
  elevationPenalty: number;
  staminaPenaltyKmBucket: number;
  elevationPenaltyHmBucket: number;
  gradientPercent: number;
  gradientModifier: number;
  windModifier: number;
  draftModifier: number;
  draftNearbyRiderCount: number;
  draftPackFactor: number;
  tempSpeedMps: number;
  currentSpeedMps: number;
  photoFinishScore: number;
  nextIntermediateIndex: number;
  lastSplitLabel: string | null;
  lastSplitTimeSeconds: number | null;
  splitTimes: Record<string, number>;
  markerCrossings: Record<string, MarkerCrossing>;
  finishStatus: RealtimeFinishStatus | null;
  statusReason: string | null;
  pendingIncident: PrecalculatedRaceIncident | null;
  appliedIncident: PrecalculatedRaceIncident | null;
  incidentDelaySecondsRemaining: number;
  incidentRecoverySecondsRemaining: number;
  incidentRecoveryFormBonus: number;
  incidentStaminaPenalty: number;
  dailyFormCap: number | null;
  waitingForCaptainId: number | null;
  waitForCaptainRecovery: boolean;
  waitLogged: boolean;
  breakawayMalus: number;
  breakawayInitialMalus: number;
  breakawayRecoveryStartDistanceMeters: number | null;
  breakawayGapPenalty: number;
  breakawayFallbackCheckpointTimes: Array<number | null>;
  nextBreakawayFallbackCheckpointIndex: number;
  isAttacking: boolean;
  isBreakaway: boolean;
  isLeadingGroup: boolean;
  leadoutBonus?: number;
}

interface BasePhysicsResult {
  skillName: TerrainSkillName;
  skillBreakdown: string;
  baseSkill: number;
  teamGroupBonus: number;
  effectiveSkill: number;
  staminaPenalty: number;
  elevationPenalty: number;
  gradientPercent: number;
  gradientModifier: number;
  windModifier: number;
  attackSkillBonus: number;
  tempSpeedMps: number;
}

type MarkerWeightProfile = Partial<Record<RiderSkillKey, number>>;

const SPRINT_INTERMEDIATE_WEIGHTS: MarkerWeightProfile = {
  sprint: 0.46,
  acceleration: 0.24,
  hill: 0.06,
  attack: 0.08,
  resistance: 0.08,
  stamina: 0.04,
  flat: 0.04,
};

const FINISH_FLAT_WEIGHTS: MarkerWeightProfile = {
  sprint: 0.45,
  acceleration: 0.2,
  hill: 0.04,
  attack: 0.06,
  resistance: 0.06,
  stamina: 0.04,
  flat: 0.15,
};

const FINISH_HILL_WEIGHTS: MarkerWeightProfile = {
  mountain: 0.05,
  mediumMountain: 0.05,
  hill: 0.28,
  sprint: 0.18,
  acceleration: 0.12,
  attack: 0.12,
  resistance: 0.1,
  stamina: 0.06,
  flat: 0.04,
};

const FINISH_MOUNTAIN_WEIGHTS: MarkerWeightProfile = {
  mountain: 0.38,
  mediumMountain: 0.2,
  hill: 0.1,
  sprint: 0.03,
  acceleration: 0.03,
  attack: 0.12,
  resistance: 0.08,
  stamina: 0.06,
};

const CLIMB_TOP_WEIGHTS: Record<Exclude<StageMarkerCategory, 'Sprint'>, MarkerWeightProfile> = {
  HC: {
    mountain: 0.4,
    mediumMountain: 0.2,
    hill: 0.07,
    sprint: 0.01,
    acceleration: 0.02,
    attack: 0.16,
    resistance: 0.08,
    stamina: 0.06,
  },
  '1': {
    mountain: 0.31,
    mediumMountain: 0.18,
    hill: 0.12,
    sprint: 0.03,
    acceleration: 0.04,
    attack: 0.16,
    resistance: 0.09,
    stamina: 0.07,
  },
  '2': {
    mountain: 0.2,
    mediumMountain: 0.14,
    hill: 0.22,
    sprint: 0.08,
    acceleration: 0.08,
    attack: 0.15,
    resistance: 0.08,
    stamina: 0.05,
  },
  '3': {
    mountain: 0.05,
    mediumMountain: 0.09,
    hill: 0.27,
    sprint: 0.14,
    acceleration: 0.12,
    attack: 0.16,
    resistance: 0.1,
    stamina: 0.07,
  },
  '4': {
    hill: 0.3,
    sprint: 0.18,
    acceleration: 0.16,
    attack: 0.16,
    resistance: 0.12,
    stamina: 0.08,
  },
};

function buildStageScoringWeightMap(rules: StageScoringRule[]): Map<string, MarkerWeightProfile> {
  const map = new Map<string, MarkerWeightProfile>();
  for (const rule of rules) {
    const weights = rule.weights as MarkerWeightProfile;
    if (rule.appliesTo === 'sprint_intermediate') {
      map.set('sprint_intermediate', weights);
    } else if (rule.appliesTo === 'climb_top') {
      const category = (!rule.markerCategory || rule.markerCategory === 'Sprint') ? 'HC' : rule.markerCategory;
      map.set(`climb_top|${category}`, weights);
    } else if (rule.appliesTo === 'finish') {
      map.set(rule.markerType, weights);
    }
  }
  return map;
}

type TeamGroupBonusByRiderId = Map<number, number>;

const CLUSTER_DISTANCE_METERS = 20;
const MAX_SUBSTEP_SECONDS = 1;
const ITT_START_INTERVAL_SECONDS = 120;
const TTT_START_INTERVAL_SECONDS = 300;
const SPREAD_BUCKET_RATIO = 0.025;
const START_SPREAD_MIN = 0.1;
const START_SPREAD_MAX = 0.4;
const LATE_STAGE_START_MIN = 0.6;
const LATE_STAGE_START_MAX = 0.8;
const TIME_TIE_THRESHOLD_SECONDS = 1;
const DRAFT_BONUS_SCALE = 2 / 3;
// Muss der Distanz-Toleranz in compareDraftOrder entsprechen (dort: abs(distanceDelta) >= 0.1).
// Die Draft-Reihenfolge ist nur bis auf diese Toleranz monoton nach Distanz sortiert.
const DRAFT_ORDER_DISTANCE_TIE_METERS = 0.1;
const DRAFT_PACK_SOFT_CAP_START = 10;
const DRAFT_PACK_HARD_CAP_SIZE = 50;
const DRAFT_FRONT_NO_BONUS_GROUP_SIZE = 25;
const INCIDENT_RECOVERY_CATCHUP_BONUS = 7;
const ELEVATION_SPREAD_START_METERS = 500;
const ELEVATION_SPREAD_STEP_METERS = 100;
const ELEVATION_SPREAD_STEP_FACTOR = 0.02;
const MOUNTAIN_ELEVATION_SPREAD_BASE_STEP_FACTOR = 0.04;
const MOUNTAIN_ELEVATION_SPREAD_STEP_INCREMENT = 0.009;
const FLAT_DRAFT_DISTANCE_CAP_METERS = 120;
const DOWNHILL_DRAFT_DISTANCE_CAP_METERS = 150;
const STAMINA_STAGE_DISTANCE_MIN_KM = 100;
const STAMINA_STAGE_DISTANCE_MAX_KM = 300;
const STAMINA_SKILL_MIN = 50;
const STAMINA_SKILL_MAX = 85;
const STAMINA_DISTANCE_DIFF_ANCHORS = [
  { kmMark: 100, value: 0.5 },
  { kmMark: 150, value: 1 },
  { kmMark: 175, value: 2 },
  { kmMark: 200, value: 3 },
  { kmMark: 250, value: 8 },
  { kmMark: 300, value: 15 },
] as const;
const BREAKAWAY_GAP_PENALTY_START_SECONDS = 5 * 60;
const BREAKAWAY_GAP_PENALTY_STEP_SECONDS = 60;
const BREAKAWAY_GAP_PENALTY_BASE_SKILL = 0.5;
const BREAKAWAY_GAP_PENALTY_FALLBACK_START_RATIO = 0.3;
const BREAKAWAY_GAP_PENALTY_FALLBACK_STEP_METERS = 5000;
const BREAKAWAY_MALUS_RECOVERY_STEP_METERS = 2000;
const BREAKAWAY_MALUS_RECOVERY_STEP_SKILL = 1;
const BREAKAWAY_MALUS_RECOVERY_FLOOR = 2;
const BREAKAWAY_FULL_RECOVERY_CHANCE = 0.05;

interface WeightedSkillComponent {
  key: RiderSkillKey;
  weight: number;
}

const SKILL_SHORT_LABELS: Record<RiderSkillKey, string> = {
  flat: 'Fl',
  mountain: 'Berg',
  mediumMountain: 'MB',
  hill: 'Hgl',
  timeTrial: 'ZF',
  prologue: 'Pro',
  cobble: 'Pf',
  sprint: 'Spr',
  acceleration: 'Acc',
  downhill: 'Abf',
  attack: 'Atk',
  stamina: 'Sta',
  resistance: 'Res',
  recuperation: 'Rec',
  bikeHandling: 'Ftg',
};

interface IntermediateMarker {
  key: string;
  distanceMeters: number;
  label: string;
  markerType: StageMarkerType;
  markerCategory: StageMarkerCategory | null;
}

interface BreakawayGapPenaltyConfig {
  markers: IntermediateMarker[];
  fallbackCheckpointsMeters: number[];
}

interface BreakawayGapStatus {
  gapSeconds: number | null;
  penalty: number;
  kmMark: number | null;
}

const DRAFT_GRADIENT_PENALTY_CURVE = [
  { gradientPercent: 2, draftPenaltyShare: 0.10 },
  { gradientPercent: 3, draftPenaltyShare: 0.15 },
  { gradientPercent: 4, draftPenaltyShare: 0.20 },
  { gradientPercent: 5, draftPenaltyShare: 0.30 },
  { gradientPercent: 6, draftPenaltyShare: 0.45 },
  { gradientPercent: 7, draftPenaltyShare: 0.80 },
  { gradientPercent: 8, draftPenaltyShare: 0.90 },
  { gradientPercent: 9, draftPenaltyShare: 0.92 },
  { gradientPercent: 10, draftPenaltyShare: 0.94 },
  { gradientPercent: 12, draftPenaltyShare: 0.96 },
  { gradientPercent: 15, draftPenaltyShare: 0.98 },
  { gradientPercent: 20, draftPenaltyShare: 1.00 },
] as const;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function chooseOne<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)] as T;
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

function resolveDeterministicRatio(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function resolveDraftRetentionFactor(gradientPercent: number): number {
  if (gradientPercent < 2) {
    return 1;
  }

  const clampedGradientPercent = clamp(gradientPercent, 2, 20);
  const firstPoint = DRAFT_GRADIENT_PENALTY_CURVE[0];
  if (clampedGradientPercent <= firstPoint.gradientPercent) {
    return 1 - firstPoint.draftPenaltyShare;
  }

  for (let index = 1; index < DRAFT_GRADIENT_PENALTY_CURVE.length; index += 1) {
    const left = DRAFT_GRADIENT_PENALTY_CURVE[index - 1];
    const right = DRAFT_GRADIENT_PENALTY_CURVE[index];
    if (clampedGradientPercent > right.gradientPercent) {
      continue;
    }

    const ratio = (clampedGradientPercent - left.gradientPercent) / Math.max(0.0001, right.gradientPercent - left.gradientPercent);
    const interpolatedPenalty = left.draftPenaltyShare + ((right.draftPenaltyShare - left.draftPenaltyShare) * ratio);
    return Math.max(0, 1 - interpolatedPenalty);
  }

  return 0;
}

function resolveDraftDistanceCapMeters(terrain: StageTerrain | null | undefined): number {
  if (terrain === 'Flat') {
    return FLAT_DRAFT_DISTANCE_CAP_METERS;
  }

  if (terrain === 'Abfahrt') {
    return DOWNHILL_DRAFT_DISTANCE_CAP_METERS;
  }

  return Number.POSITIVE_INFINITY;
}

function terrainToSkillName(terrain: StageTerrain): TerrainSkillName {
  switch (terrain) {
    case 'Flat':
      return 'Flat';
    case 'Hill':
      return 'Hill';
    case 'Medium_Mountain':
      return 'Medium_Mountain';
    case 'Mountain':
    case 'High_Mountain':
      return 'Mountain';
    case 'Cobble':
    case 'Cobble_Hill':
      return 'Cobble';
    case 'Sprint':
      return 'Sprint';
    case 'Abfahrt':
      return 'Downhill';
    default:
      return 'Flat';
  }
}

function resolveBaseSkill(rider: Rider, skillName: TerrainSkillName): number {
  switch (skillName) {
    case 'Flat':
      return rider.skills.flat;
    case 'Hill':
      return rider.skills.hill;
    case 'Medium_Mountain':
      return rider.skills.mediumMountain;
    case 'Mountain':
      return rider.skills.mountain;
    case 'Cobble':
      return rider.skills.cobble;
    case 'Sprint':
      return rider.skills.sprint;
    case 'Downhill':
      return rider.skills.downhill;
    default:
      return rider.skills.flat;
  }
}

function resolveConditionFormBonus(rider: Rider): number {
  return (rider.formBonus ?? 0)
    + (rider.raceFormBonus ?? 0)
    - (rider.fatigueMalus ?? 0)
    - (rider.longTermFatigueMalus ?? 0)
    - (rider.shortTermFatigueMalus ?? 0);
}

function formatSkillBreakdown(rider: Rider, components: WeightedSkillComponent[]): string {
  if (components.length === 0) {
    return '';
  }

  const totalWeight = components.reduce((sum, component) => sum + component.weight, 0);
  const parts = components.map((component) => {
    const skillValue = rider.skills[component.key];
    const weightPercent = Math.round((component.weight / totalWeight) * 100);
    return `${SKILL_SHORT_LABELS[component.key]} ${Math.round(skillValue)} (${weightPercent}%)`;
  });

  const seasonForm = rider.formBonus ?? 0;
  const raceForm = rider.raceFormBonus ?? 0;
  const fatigue = rider.fatigueMalus ?? 0;
  const longTermFatigue = rider.longTermFatigueMalus ?? 0;
  const shortTermFatigue = rider.shortTermFatigueMalus ?? 0;

  parts.push(`S-Form ${seasonForm >= 0 ? '+' : ''}${seasonForm.toFixed(1).replace('.', ',')}`);
  parts.push(`R-Form ${raceForm >= 0 ? '+' : ''}${raceForm.toFixed(1).replace('.', ',')}`);
  if (fatigue > 0) {
    parts.push(`Fatigue -${fatigue.toFixed(1).replace('.', ',')}`);
  }
  if (longTermFatigue > 0) {
    parts.push(`Langzeit -${longTermFatigue.toFixed(1).replace('.', ',')}`);
  }
  if (shortTermFatigue > 0) {
    parts.push(`Akut -${shortTermFatigue.toFixed(1).replace('.', ',')}`);
  }

  let mentorBoostSum = 0;
  if (rider.mentorBoosts) {
    for (const component of components) {
      mentorBoostSum += (rider.mentorBoosts[component.key] || 0) * (component.weight / totalWeight);
    }
  }
  if (mentorBoostSum > 0) {
    parts.push(`Mentor +${mentorBoostSum.toFixed(1).replace('.', ',')}`);
  }

  return parts.join(' • ');;
}

function sampleInitialWindSpeedKph(): number {
  const roll = Math.random();
  if (roll < 0.9) {
    return randomBetween(5, 20);
  }
  if (roll < 0.98) {
    return randomBetween(20, 40);
  }
  return randomBetween(40, 70);
}

function sampleMicroForm(): number {
  const roll = Math.random();
  if (roll < 0.9) {
    return roundToTwoDecimals(randomBetween(-1, 1));
  }
  if (roll < 0.995) {
    return roundToTwoDecimals(chooseOne([-1, 1]) * randomBetween(1, 2));
  }
  return roundToTwoDecimals(chooseOne([-1, 1]) * randomBetween(3, 4));
}

function sampleDailyForm(): number {
  return roundToTwoDecimals(randomBetween(-3, 3));
}

function createWindZones(stageDistanceMeters: number): WindZone[] {
  const zones: WindZone[] = [];
  let currentMeter = 0;
  let windSpeedKph = sampleInitialWindSpeedKph();
  let vector = randomBetween(-1, 1);

  while (currentMeter < stageDistanceMeters) {
    const zoneLength = Math.min(stageDistanceMeters - currentMeter, randomBetween(3000, 40000));
    zones.push({
      startMeter: currentMeter,
      endMeter: currentMeter + zoneLength,
      windSpeedKph,
      vector,
    });
    currentMeter += zoneLength;

    if (currentMeter >= stageDistanceMeters) {
      break;
    }

    windSpeedKph = clamp(
      windSpeedKph + (Math.random() < 0.5 ? -1 : 1) * randomBetween(2, 10),
      5,
      70,
    );
    vector = clamp(
      vector + (Math.random() < 0.5 ? -1 : 1) * randomBetween(0, 0.5),
      -1,
      1,
    );
  }

  return zones;
}

function compareRiders(left: RiderState, right: RiderState): number {
  const leftInactive = isRiderInactive(left);
  const rightInactive = isRiderInactive(right);
  if (leftInactive !== rightInactive) {
    return leftInactive ? 1 : -1;
  }

  const leftClassifiedFinisher = isClassifiedFinisher(left);
  const rightClassifiedFinisher = isClassifiedFinisher(right);
  if (leftClassifiedFinisher && rightClassifiedFinisher) {
    return (left.finishTimeSeconds ?? 0) - (right.finishTimeSeconds ?? 0) || right.photoFinishScore - left.photoFinishScore || left.rider.id - right.rider.id;
  }
  if (leftClassifiedFinisher) return -1;
  if (rightClassifiedFinisher) return 1;

  if (left.distanceCoveredMeters !== right.distanceCoveredMeters) {
    return right.distanceCoveredMeters - left.distanceCoveredMeters;
  }

  return left.rider.id - right.rider.id;
}

function isRiderInactive(rider: Pick<RiderState, 'finishStatus' | 'finishTimeSeconds'>): boolean {
  return rider.finishStatus === 'dnf' || rider.finishTimeSeconds != null;
}

function isClassifiedFinisher(rider: Pick<RiderState, 'finishStatus' | 'finishTimeSeconds'>): boolean {
  return rider.finishStatus !== 'dnf' && rider.finishTimeSeconds != null;
}

type TieBreakContext = 'finish_flat' | 'finish_hill' | 'finish_mountain' | 'climb_top' | 'sprint_intermediate';

/**
 * Berechnet einen Bonus/Malus auf den photoFinishScore basierend auf Fahrertyp und Wertungskontext.
 *
 * Regeln:
 * - Zwischensprint (sprint_intermediate):
 *     Spec1=Berg: -3 | Spec2=Berg: -2 | Spec1=Sprint: +1 | Spec2=Sprint: +0.5
 * - Finish Flat (finish_flat):
 *     Spec1=Sprint: +2 (immer) | Spec2=Sprint: +1 (immer)
 *     Spec1/2=Sprint: +1 (zusätzlich bei Etappentyp Flat/Rolling)
 *     Spec1=Berg: -3 (nur bei Etappentyp Flat/Rolling) | Spec2=Berg: -2 (nur bei Etappentyp Flat/Rolling)
 * - Bergwertung (climb_top):
 *     Spec1=Sprint: -3 | Spec2=Sprint: -1.5 | Spec1/2=Attacker: +1.5
 * - Sonstige Finish-Typen (finish_hill, finish_mountain): kein Adjustment
 */
function resolveSpecializationTieBreakAdjustment(
  entry: MarkerCrossing | RiderState,
  context: TieBreakContext,
  isClimberMalusStage: boolean = false,
  markerCategory: StageMarkerCategory | null = null,
): number {
  const rider = 'rider' in entry ? entry.rider : null;
  const spec1 = rider?.specialization1 ?? null;
  const spec2 = rider?.specialization2 ?? null;
  let adjustment = 0;

  if (context === 'sprint_intermediate') {
    if (spec1 === 'Berg') adjustment -= 3;
    else if (spec2 === 'Berg') adjustment -= 2;
    if (spec1 === 'Sprint') adjustment += 1;
    else if (spec2 === 'Sprint') adjustment += 0.5;

  } else if (context === 'finish_flat') {
    // Sprinter-Bonus gilt immer bei finish_flat
    if (spec1 === 'Sprint') adjustment += 2;
    else if (spec2 === 'Sprint') adjustment += 1;
    // Bergfahrer-Malus und zusätzlicher Sprinter-Bonus nur bei Flat/Rolling-Etappe
    if (isClimberMalusStage) {
      if (spec1 === 'Sprint' || spec2 === 'Sprint') adjustment += 1;
      if (spec1 === 'Berg') adjustment -= 3;
      else if (spec2 === 'Berg') adjustment -= 2;
    }

  } else if (context === 'climb_top') {
    const role = rider?.role?.name;
    
    if (markerCategory === '4') {
      if (spec1 === 'Sprint') adjustment -= 3;
      else if (spec2 === 'Sprint') adjustment -= 1.5;

      if (role === 'Edelhelfer' || role === 'Starke Helfer') adjustment += 2;
      if (role === 'Wassertraeger') adjustment += 1;
      if (role === 'Co-Kapitaen') adjustment -= 1;
      if (role === 'Kapitaen') adjustment -= 3;
    } else {
      if (spec1 === 'Sprint') adjustment -= 3;
      else if (spec2 === 'Sprint') adjustment -= 1.5;

      if (role === 'Edelhelfer') adjustment += 3;
      if (role === 'Starke Helfer') adjustment += 1.5;
      if (role === 'Wassertraeger') adjustment += 0.5;
      if (role === 'Co-Kapitaen') adjustment -= 1;
      if (role === 'Kapitaen') adjustment -= 2;
    }

    if (spec1 === 'Attacker' || spec2 === 'Attacker') adjustment += 3;
  }

  return adjustment;
}

/**
 * Variante für MarkerCrossing-Einträge (kein direkter Rider-Zugriff), nutzt riderStateById.
 */
function resolveMarkerCrossingTieBreakAdjustment(
  entry: MarkerCrossing,
  context: TieBreakContext,
  riderStateById: Map<number, RiderState>,
  isClimberMalusStage: boolean = false,
  markerCategory: StageMarkerCategory | null = null,
): number {
  const riderState = riderStateById.get(entry.riderId);
  if (!riderState) return 0;
  return resolveSpecializationTieBreakAdjustment(riderState, context, isClimberMalusStage, markerCategory);
}

function normalizeMarkerClassificationEntries(
  entries: MarkerCrossing[],
  applyTimeTieGroups: boolean,
  markerType: StageMarkerType | null = null,
  riderStateById: Map<number, RiderState> | null = null,
  isClimberMalusStage: boolean = false,
): StageMarkerClassificationEntry[] {
  const tieContext: TieBreakContext | null = markerType === 'sprint_intermediate'
    ? 'sprint_intermediate'
    : markerType === 'climb_top'
      ? 'climb_top'
      : null;

  const effectiveScore = (entry: MarkerCrossing): number => {
    return entry.photoFinishScore;
  };

  if (!applyTimeTieGroups) {
    const sorted = [...entries].sort((left, right) => left.crossingTimeSeconds - right.crossingTimeSeconds || right.photoFinishScore - left.photoFinishScore || left.riderId - right.riderId);
    const leaderTime = sorted[0]?.crossingTimeSeconds ?? 0;
    return sorted.map((entry, index) => ({
      riderId: entry.riderId,
      rank: index + 1,
      crossingTimeSeconds: entry.crossingTimeSeconds,
      gapSeconds: Math.max(0, entry.crossingTimeSeconds - leaderTime),
      photoFinishScore: entry.photoFinishScore,
    }));
  }

  const sortedByTime = [...entries].sort((left, right) => left.crossingTimeSeconds - right.crossingTimeSeconds || right.photoFinishScore - left.photoFinishScore || left.riderId - right.riderId);
  const leaderTime = sortedByTime[0]?.crossingTimeSeconds ?? 0;
  const ranked: StageMarkerClassificationEntry[] = [];
  let group: MarkerCrossing[] = [];
  let groupLeaderTime = 0;
  let previousTime: number | null = null;

  const flushGroup = (): void => {
    const gapSeconds = Math.max(0, groupLeaderTime - leaderTime);
    const orderedGroup = group.sort((left, right) => effectiveScore(right) - effectiveScore(left) || left.riderId - right.riderId);
    for (const entry of orderedGroup) {
      ranked.push({
        riderId: entry.riderId,
        rank: ranked.length + 1,
        crossingTimeSeconds: entry.crossingTimeSeconds,
        gapSeconds,
        photoFinishScore: entry.photoFinishScore,
      });
    }
  };

  for (const entry of sortedByTime) {
    if (group.length === 0) {
      group = [entry];
      groupLeaderTime = entry.crossingTimeSeconds;
      previousTime = entry.crossingTimeSeconds;
      continue;
    }

    if (previousTime != null && entry.crossingTimeSeconds - previousTime <= TIME_TIE_THRESHOLD_SECONDS) {
      group.push(entry);
      previousTime = entry.crossingTimeSeconds;
      continue;
    }

    flushGroup();
    group = [entry];
    groupLeaderTime = entry.crossingTimeSeconds;
    previousTime = entry.crossingTimeSeconds;
  }

  if (group.length > 0) {
    flushGroup();
  }

  return ranked;
}

function orderRoadRiders(riders: RiderState[], finishContext: TieBreakContext, isClimberMalusStage: boolean): RiderState[] {
  const finishedRiders = riders
    .filter(isClassifiedFinisher)
    .sort((left, right) => (left.finishTimeSeconds ?? 0) - (right.finishTimeSeconds ?? 0) || right.photoFinishScore - left.photoFinishScore || left.rider.id - right.rider.id);
  const activeRiders = riders
    .filter((rider) => !isRiderInactive(rider))
    .sort(compareRiders);
  const dnfRiders = riders
    .filter((rider) => rider.finishStatus === 'dnf')
    .sort((left, right) => right.distanceCoveredMeters - left.distanceCoveredMeters || left.rider.id - right.rider.id);
  const rankedFinished: RiderState[] = [];
  let group: RiderState[] = [];
  let previousTime: number | null = null;

  const effectiveScore = (r: RiderState): number =>
    r.photoFinishScore;

  const flushGroup = (): void => {
    rankedFinished.push(...group.sort((left, right) => effectiveScore(right) - effectiveScore(left) || left.rider.id - right.rider.id));
  };

  for (const rider of finishedRiders) {
    const finishTime = rider.finishTimeSeconds ?? 0;
    if (group.length === 0) {
      group = [rider];
      previousTime = finishTime;
      continue;
    }

    if (previousTime != null && finishTime - previousTime <= TIME_TIE_THRESHOLD_SECONDS) {
      group.push(rider);
      previousTime = finishTime;
      continue;
    }

    flushGroup();
    group = [rider];
    previousTime = finishTime;
  }

  if (group.length > 0) {
    flushGroup();
  }

  return [...rankedFinished, ...activeRiders, ...dnfRiders];
}

function compareDraftOrder(left: RiderState, right: RiderState): number {
  const leftInactive = isRiderInactive(left);
  const rightInactive = isRiderInactive(right);
  if (leftInactive !== rightInactive) {
    return leftInactive ? 1 : -1;
  }

  const distanceDelta = right.distanceCoveredMeters - left.distanceCoveredMeters;
  if (Math.abs(distanceDelta) >= 0.1) {
    return distanceDelta;
  }

  if (left.tempSpeedMps !== right.tempSpeedMps) {
    return right.tempSpeedMps - left.tempSpeedMps;
  }

  if (isClassifiedFinisher(left) && isClassifiedFinisher(right)) {
    return (left.finishTimeSeconds ?? 0) - (right.finishTimeSeconds ?? 0) || left.rider.id - right.rider.id;
  }

  if (isClassifiedFinisher(left)) return -1;
  if (isClassifiedFinisher(right)) return 1;
  return left.rider.id - right.rider.id;
}

function resolveDraftPackFactor(groupSize: number): number {
  const clampedGroupSize = clamp(groupSize, 1, DRAFT_PACK_HARD_CAP_SIZE);
  if (clampedGroupSize <= 2) {
    return 0.12 * clampedGroupSize;
  }

  if (clampedGroupSize <= DRAFT_PACK_SOFT_CAP_START) {
    const progressToSoftCap = (clampedGroupSize - 2) / Math.max(1, DRAFT_PACK_SOFT_CAP_START - 2);
    return 0.24 + (progressToSoftCap * 0.58);
  }

  const progressToHardCap = (clampedGroupSize - DRAFT_PACK_SOFT_CAP_START) / Math.max(1, DRAFT_PACK_HARD_CAP_SIZE - DRAFT_PACK_SOFT_CAP_START);
  return 0.82 + (progressToHardCap * 0.18);
}

function resolveLiveWeightProfileValue(rider: RiderState, weights: MarkerWeightProfile): number {
  const formBonus = resolveConditionFormBonus(rider.rider);
  return Object.entries(weights).reduce((sum, [skillKey, weight]) => {
    if (!weight) {
      return sum;
    }

    const staminaPenalty = skillKey === 'stamina'
      ? rider.staminaSkillPenalty + rider.incidentStaminaPenalty
      : 0;
    const effectiveSkill = Math.max(
      0,
      rider.rider.skills[skillKey as RiderSkillKey] + formBonus + rider.dailyForm + rider.microForm + rider.teamGroupBonus - staminaPenalty,
    );
    return sum + (effectiveSkill * weight);
  }, 0);
}

function buildLiveWeightProfileBreakdown(rider: RiderState, weights: MarkerWeightProfile): Array<{
  skillKey: RiderSkillKey;
  weight: number;
  effectiveSkill: number;
  contribution: number;
}> {
  const formBonus = resolveConditionFormBonus(rider.rider);

  return Object.entries(weights)
    .filter((entry): entry is [string, number] => Boolean(entry[1]))
    .map(([skillKey, weight]) => {
      const resolvedSkillKey = skillKey as RiderSkillKey;
      const staminaPenalty = resolvedSkillKey === 'stamina'
        ? rider.staminaSkillPenalty + rider.incidentStaminaPenalty
        : 0;
      const effectiveSkill = Math.max(
        0,
        rider.rider.skills[resolvedSkillKey] + formBonus + rider.dailyForm + rider.microForm + rider.teamGroupBonus - staminaPenalty,
      );

      return {
        skillKey: resolvedSkillKey,
        weight,
        effectiveSkill,
        contribution: effectiveSkill * weight,
      };
    });
}

function resolveDraftGroupWindow(orderedRiders: RiderState[], riderIndex: number, maxGapMeters: number): { startIndex: number; endIndex: number; size: number; positionInGroup: number } {
  let startIndex = riderIndex;
  while (startIndex > 0) {
    const gapToFront = orderedRiders[startIndex - 1].distanceCoveredMeters - orderedRiders[startIndex].distanceCoveredMeters;
    if (gapToFront <= 0 || gapToFront >= maxGapMeters) {
      break;
    }
    startIndex -= 1;
  }

  let endIndex = riderIndex;
  while (endIndex < orderedRiders.length - 1) {
    const gapToBack = orderedRiders[endIndex].distanceCoveredMeters - orderedRiders[endIndex + 1].distanceCoveredMeters;
    if (gapToBack <= 0 || gapToBack >= maxGapMeters) {
      break;
    }
    endIndex += 1;
  }

  return {
    startIndex,
    endIndex,
    size: (endIndex - startIndex) + 1,
    positionInGroup: riderIndex - startIndex,
  };
}

function isFrontOfLargeDraftGroup(groupSize: number, positionInGroup: number): boolean {
  if (groupSize < DRAFT_FRONT_NO_BONUS_GROUP_SIZE) {
    return false;
  }

  const frontZoneSize = Math.max(1, Math.floor(groupSize * 0.1));
  return positionInGroup < frontZoneSize;
}

export class SimulationEngine {
  private readonly stageDistanceMeters: number;
  private readonly maxSubstepSeconds: number;

  private readonly isIndividualTimeTrial: boolean;

  private readonly isTeamTimeTrial: boolean;

  private readonly isTimeTrialMode: boolean;

  private readonly riders: RiderState[];

  private readonly windZones: WindZone[];

  private readonly intermediateMarkers: IntermediateMarker[];

  private readonly lateStageStartRatio: number;

  private readonly finalPushStartRatio: number;

  private readonly spreadCurve: number[];

  private readonly finalSpreadDifficultyMultiplier: number;

  private readonly skillWeightRuleMap: Map<string, Partial<Record<RiderSkillKey, number>>>;

  private readonly skillWeightConfigMap: Map<string, SkillWeightRule>;

  private readonly stageScoringWeightMap: Map<string, MarkerWeightProfile>;

  private readonly finishWeightProfile: MarkerWeightProfile;

  private readonly simulationMode: ReturnType<typeof resolveSkillWeightSimulationMode>;

  private readonly weightedSkillComponentsByTerrain = new Map<StageTerrain, WeightedSkillComponent[]>();

  private readonly skillBreakdownCache = new Map<string, string>();
  private readonly teamSprintRandomValues = new Map<number, number>();

  private lastTeamGroupBonusByRiderId: TeamGroupBonusByRiderId | null = null;

  private readonly draftOrderScratch: RiderState[] = [];

  private elapsedSeconds = 0;

  private readonly incidentsByRiderId: Map<number, PrecalculatedRaceIncident>;

  private readonly stageFavorites: FavoriteItem[];

  private readonly precalculatedStageAttacksByRiderId: Map<number, PrecalculatedStageAttack[]>;

  private readonly activeStageAttacksByRiderId = new Map<number, ActiveStageAttack>();

  private readonly breakawayPlan: PrecalculatedStageBreakaway | null;

  private readonly breakawayGapPenaltyMarkers: IntermediateMarker[];

  private readonly breakawayGapPenaltyFallbackCheckpointsMeters: number[];

  private nextBreakawayGapPenaltyMarkerIndex = 0;

  private nextBreakawayGapPenaltyFallbackIndex = 0;

  private breakawayGapStatus: BreakawayGapStatus | null = null;

  private breakawayPhaseActive = false;

  private breakawayGroupPhaseEnded = false;

  private breakawayPhaseEnded = false;

  private readonly messages: RaceSimMessage[] = [];
  private readonly allEvents: RaceSimMessage[] = [];

  private nextMessageId = 1;

  private hasLoggedFinishSprintTieBreak = false;

  constructor(
    private readonly bootstrap: RealtimeSimulationBootstrap,
    options?: { maxSubstepSeconds?: number },
  ) {
    this.maxSubstepSeconds = options?.maxSubstepSeconds ?? 1;
    this.stageDistanceMeters = bootstrap.stageSummary.distanceKm * 1000;
    this.isIndividualTimeTrial = bootstrap.stage.profile === 'ITT';
    this.isTeamTimeTrial = bootstrap.stage.profile === 'TTT';
    this.isTimeTrialMode = this.isIndividualTimeTrial || this.isTeamTimeTrial;
    this.simulationMode = resolveSkillWeightSimulationMode(bootstrap.stage.profile);
    this.skillWeightRuleMap = buildSkillWeightRuleMap(bootstrap.skillWeightRules ?? []);
    this.skillWeightConfigMap = buildSkillWeightConfigMap(bootstrap.skillWeightRules ?? []);
    this.stageScoringWeightMap = buildStageScoringWeightMap(bootstrap.stageScoringRules ?? []);
    this.finishWeightProfile = this.resolveFinishWeightProfile();
    this.windZones = createWindZones(this.stageDistanceMeters);
    this.intermediateMarkers = this.buildIntermediateMarkers();
    const configuredStartPercent = bootstrap.stage.finalSpreadStartPercent;
    this.lateStageStartRatio = configuredStartPercent != null
      ? clamp(configuredStartPercent / 100, 0, 1)
      : randomBetween(LATE_STAGE_START_MIN, LATE_STAGE_START_MAX);
    const configuredFinalPushStartPercent = bootstrap.stage.finalPushStartPercent;
    this.finalPushStartRatio = configuredFinalPushStartPercent != null
      ? clamp(configuredFinalPushStartPercent / 100, this.lateStageStartRatio, 1)
      : clamp(0.9, this.lateStageStartRatio, 1);
    this.finalSpreadDifficultyMultiplier = bootstrap.stage.finalSpreadDifficultyMultiplier ?? 1;
    this.spreadCurve = this.buildSpreadCurve(this.lateStageStartRatio);
    const precalculatedIncidents = precalculateRaceIncidents(bootstrap.riders, bootstrap.stage, bootstrap.stageSummary.distanceKm);
    this.incidentsByRiderId = new Map(precalculatedIncidents.map((incident) => [incident.riderId, incident]));
    if (precalculatedIncidents.length > 0) {
      console.log('[RaceIncidents] Vor der Etappe ausgewuerfelt:', precalculatedIncidents.map((incident) => ({
        riderId: incident.riderId,
        type: incident.type,
        severity: incident.severity,
        kmMark: incident.triggerDistanceKm,
        waitDurationSeconds: incident.waitDurationSeconds,
        supportRiderIds: incident.supportRiderIds,
      })));

      const massCrashTriggers = precalculatedIncidents.filter(i => i.isMassCrashTrigger);
      if (massCrashTriggers.length > 0) {
        massCrashTriggers.forEach(trigger => {
          console.log(`[RaceIncidents] Massensturz vor der Etappe ausgewuerfelt! Auslöser: Fahrer ${trigger.riderId} bei Km ${trigger.triggerDistanceKm}. Potenziell betroffene Fahrer (${trigger.massCrashPotentialRiderIds?.length}):`, trigger.massCrashPotentialRiderIds);
        });
      }
    }
    const baseRiderStates: RiderState[] = bootstrap.riders.map((rider) => {
      const riderState: RiderState = {
        rider,
        riderName: `${rider.firstName} ${rider.lastName}`,
        startOffsetSeconds: 0,
        hasStarted: !this.isTimeTrialMode,
        distanceCoveredMeters: 0,
        nextDistanceCoveredMeters: null,
        segmentStartKm: 0,
        segmentEndKm: 0,
        segmentStartElevation: 0,
        segmentEndElevation: 0,
        dailyForm: sampleDailyForm(),
        microForm: sampleMicroForm(),
        nextFormUpdateMeter: randomBetween(5000, 40000),
        finishTimeSeconds: null,
        segmentIndex: 0,
        windZoneIndex: 0,
        activeTerrain: 'Flat',
        skillName: 'Flat',
        skillBreakdown: '',
        baseSkill: 0,
        teamGroupBonus: 0,
        effectiveSkill: 0,
        staminaPenalty: 0,
        staminaSkillPenalty: 0,
        elevationPenalty: 0,
        staminaPenaltyKmBucket: 0,
        elevationPenaltyHmBucket: 0,
        gradientPercent: 0,
        gradientModifier: 1,
        windModifier: 1,
        draftModifier: 1,
        draftNearbyRiderCount: 0,
        draftPackFactor: 0,
        tempSpeedMps: 0,
        currentSpeedMps: 0,
        photoFinishScore: 0,
        nextIntermediateIndex: 0,
        lastSplitLabel: null,
        lastSplitTimeSeconds: null,
        splitTimes: {},
        markerCrossings: {},
        finishStatus: null,
        statusReason: null,
        pendingIncident: this.incidentsByRiderId.get(rider.id) ?? null,
        appliedIncident: null,
        incidentDelaySecondsRemaining: 0,
        incidentRecoverySecondsRemaining: 0,
        incidentRecoveryFormBonus: 0,
        incidentStaminaPenalty: 0,
        dailyFormCap: null,
        waitingForCaptainId: null,
        waitForCaptainRecovery: false,
        waitLogged: false,
        breakawayMalus: 0,
        breakawayInitialMalus: 0,
        breakawayRecoveryStartDistanceMeters: null,
        breakawayGapPenalty: 0,
        breakawayFallbackCheckpointTimes: [],
        nextBreakawayFallbackCheckpointIndex: 0,
        isAttacking: false,
        isBreakaway: false,
        isLeadingGroup: !this.isTimeTrialMode,
      };
      this.applyPersistentStageRaceState(riderState);
      return riderState;
    });

    const preStartDailyFormByRiderId = new Map(baseRiderStates.map((rider) => [rider.rider.id, rider.dailyForm]));
    this.stageFavorites = calculateStageFavorites(bootstrap.riders, bootstrap.teams, bootstrap.stage, {
      distanceKm: bootstrap.stageSummary.distanceKm,
      elevationGainMeters: bootstrap.stageSummary.elevationGainMeters,
      dailyFormByRiderId: preStartDailyFormByRiderId,
    });
    const top15FavoriteRiders = this.stageFavorites
      .filter((favorite) => favorite.kind === 'rider' && favorite.riderId != null)
      .slice(0, 15)
      .map((favorite) => bootstrap.riders.find((rider) => rider.id === favorite.riderId) ?? null)
      .filter((rider): rider is Rider => rider != null);
    const gcLeaderRiderId = bootstrap.gcStandings.find((standing) => standing.rank === 1)?.riderId ?? null;
    const precalculatedStageAttacks = precalculateStageAttacks(
      top15FavoriteRiders,
      bootstrap.stage,
      bootstrap.stageSummary,
      (candidate) => {
        const attackWeight = Math.max(1, Math.pow(10, (candidate.skills.attack - 65) / 10));
        return attackWeight * (candidate.id === gcLeaderRiderId ? 0.25 : 1);
      },
    );
    this.precalculatedStageAttacksByRiderId = new Map();
    for (const attack of precalculatedStageAttacks) {
      const bucket = this.precalculatedStageAttacksByRiderId.get(attack.riderId) ?? [];
      bucket.push(attack);
      this.precalculatedStageAttacksByRiderId.set(attack.riderId, bucket);
    }

    this.breakawayPlan = precalculateStageBreakaway(
      bootstrap.riders,
      bootstrap.race,
      bootstrap.stage,
      bootstrap.stageSummary,
      this.stageFavorites,
      bootstrap.gcStandings,
      bootstrap.mountainStandings,
    );
    const breakawayGapPenaltyConfig = this.buildBreakawayGapPenaltyConfig();
    this.breakawayGapPenaltyMarkers = breakawayGapPenaltyConfig.markers;
    this.breakawayGapPenaltyFallbackCheckpointsMeters = breakawayGapPenaltyConfig.fallbackCheckpointsMeters;
    for (const riderState of baseRiderStates) {
      riderState.breakawayFallbackCheckpointTimes = new Array(this.breakawayGapPenaltyFallbackCheckpointsMeters.length).fill(null);
    }

    const ridersWithSpecialStates = applySpecialFormStatesWithContext(bootstrap.riders, bootstrap.stage, {
      teams: bootstrap.teams,
      distanceKm: bootstrap.stageSummary.distanceKm,
      elevationGainMeters: bootstrap.stageSummary.elevationGainMeters,
      dailyFormByRiderId: preStartDailyFormByRiderId,
    });
    const riderWithSpecialStateById = new Map(ridersWithSpecialStates.map((rider) => [rider.id, rider]));

    const riderStates: RiderState[] = baseRiderStates.map((riderState) => {
      const rider = riderWithSpecialStateById.get(riderState.rider.id) ?? riderState.rider;
      return {
        ...riderState,
        rider,
        riderName: `${rider.firstName} ${rider.lastName}`,
        dailyForm: riderState.dailyForm + (rider.specialFormDelta ?? 0),
      };
    });

    const superformRiders = ridersWithSpecialStates.filter((rider) => rider.hasSuperform);
    const supermalusRiders = ridersWithSpecialStates.filter((rider) => rider.hasSupermalus);
    if (superformRiders.length > 0 || supermalusRiders.length > 0) {
      console.log('[RaceSpecialForm] Vor der Etappe ausgewuerfelt:', {
        superform: superformRiders.map((rider) => `${rider.firstName} ${rider.lastName}`),
        supermalus: supermalusRiders.map((rider) => `${rider.firstName} ${rider.lastName}`),
      });
    }

    const orderedRiders = this.resolveStartOrder(riderStates);
    const teamStartIndexByTeamId = new Map((this.bootstrap.teamStartOrder ?? []).map((teamId, index) => [teamId, index]));
    this.riders = orderedRiders.map((rider, index) => ({
      ...rider,
      startOffsetSeconds: this.resolveStartOffsetSeconds(rider, index, teamStartIndexByTeamId),
    }));

    this.riders.forEach((rider) => this.syncRiderTelemetry(rider));

    // Log special form states & form peaks at stage start (km 0)
    for (const r of this.riders) {
      if (r.rider.hasSuperform) {
        this.pushMessage({
          elapsedSeconds: 0,
          riderId: r.rider.id,
          riderName: r.riderName,
          type: 'support_resume',
          tone: 'neutral',
          title: `${this.formatRiderWithPreStageGc(r.rider.id, r.riderName)} hat heute einen guten Tag`,
          detail: 'Superform aktiv.',
        });
      }
      if (r.rider.hasSupermalus) {
        this.pushMessage({
          elapsedSeconds: 0,
          riderId: r.rider.id,
          riderName: r.riderName,
          type: 'support_wait',
          tone: 'danger',
          title: `${this.formatRiderWithPreStageGc(r.rider.id, r.riderName)} hat heute einen schlechten Tag`,
          detail: 'Supermalus aktiv.',
        });
      }
      if (r.rider.activePeakDate === this.bootstrap.stage.date) {
        this.pushMessage({
          elapsedSeconds: 0,
          riderId: r.rider.id,
          riderName: r.riderName,
          type: 'support_resume',
          tone: 'neutral',
          title: `${this.formatRiderWithPreStageGc(r.rider.id, r.riderName)} hat heute seinen Formhöhepunkt`,
          detail: 'Formhöhepunkt erreicht.',
        });
      }
    }
  }

  public step(deltaSeconds: number): SimulationFrameSnapshot {
    if (deltaSeconds <= 0 || this.isFinished()) {
      return this.getFrameSnapshot();
    }

    let remainingSeconds = deltaSeconds;
    while (remainingSeconds > 0 && !this.isFinished()) {
      const substepSeconds = Math.min(remainingSeconds, this.maxSubstepSeconds);
      this.advanceSubstep(substepSeconds);
      remainingSeconds -= substepSeconds;
    }

    return this.getFrameSnapshot();
  }

  public getFrameSnapshot(): SimulationFrameSnapshot {
    const ordered = this.getOrderedRiders();
    return this.buildFrameSnapshot(ordered);
  }

  public getSnapshot(): SimulationSnapshot {
    const ordered = this.getOrderedRiders();
    const frameSnapshot = this.buildFrameSnapshot(ordered);

    return {
      ...frameSnapshot,
      riders: ordered.map((rider) => ({
        riderId: rider.rider.id,
        riderName: rider.riderName,
        startOffsetSeconds: rider.startOffsetSeconds,
        riderClockSeconds: this.resolveRiderClockSeconds(rider),
        hasStarted: rider.hasStarted || isRiderInactive(rider),
        distanceCoveredMeters: rider.distanceCoveredMeters,
        gapToLeaderMeters: Math.max(0, frameSnapshot.leaderDistanceMeters - rider.distanceCoveredMeters),
        segmentStartKm: rider.segmentStartKm,
        segmentEndKm: rider.segmentEndKm,
        segmentStartElevation: rider.segmentStartElevation,
        segmentEndElevation: rider.segmentEndElevation,
        activeTerrain: isClassifiedFinisher(rider) ? 'Finish' : rider.activeTerrain,
        skillName: isClassifiedFinisher(rider) ? 'Finish' : rider.skillName,
        skillBreakdown: isClassifiedFinisher(rider) ? '' : rider.skillBreakdown,
        baseSkill: rider.baseSkill,
        teamGroupBonus: rider.teamGroupBonus,
        effectiveSkill: rider.effectiveSkill,
        staminaPenalty: rider.staminaPenalty,
        elevationPenalty: rider.elevationPenalty,
        dailyForm: rider.dailyForm,
        microForm: rider.microForm,
        gradientPercent: rider.gradientPercent,
        gradientModifier: rider.gradientModifier,
        windModifier: rider.windModifier,
        draftModifier: rider.draftModifier,
        draftNearbyRiderCount: rider.draftNearbyRiderCount,
        draftPackFactor: rider.draftPackFactor,
        currentSpeedMps: rider.currentSpeedMps,
        photoFinishScore: rider.photoFinishScore,
        lastSplitLabel: rider.lastSplitLabel,
        lastSplitTimeSeconds: rider.lastSplitTimeSeconds,
        splitTimes: { ...rider.splitTimes },
        finishTimeSeconds: Number.isFinite(rider.finishTimeSeconds ?? Number.NaN) ? rider.finishTimeSeconds : null,
        finishStatus: rider.finishStatus,
        statusReason: rider.statusReason,
        isAttacking: rider.isAttacking,
        isBreakaway: rider.isBreakaway,
        isLeadingGroup: rider.isLeadingGroup,
        hasSuperform: rider.rider.hasSuperform === true,
        hasSupermalus: rider.rider.hasSupermalus === true,
        isFinished: isClassifiedFinisher(rider),
      })),
      markerClassifications: this.buildMarkerClassifications(ordered),
      incidents: this.riders.flatMap((rider) => rider.appliedIncident ? [rider.appliedIncident] : []),
      messages: [...this.messages],
      allEvents: [...this.allEvents],
      stageFavorites: this.stageFavorites,
      breakawayPhaseActive: this.isBreakawayGroupPhaseActive(),
      breakawayGapStatus: this.breakawayGapStatus == null ? null : { ...this.breakawayGapStatus },
    };
  }

  private applyPersistentStageRaceState(rider: RiderState): void {
    rider.dailyForm += rider.rider.stageRaceDayFormPenalty ?? 0;
    rider.microForm += rider.rider.stageRaceMicroFormPenalty ?? 0;
    rider.incidentStaminaPenalty += rider.rider.stageRaceStaminaPenalty ?? 0;
    rider.dailyFormCap = rider.rider.stageRaceDayFormCap ?? null;
    if (rider.dailyFormCap != null) {
      rider.dailyForm = Math.min(rider.dailyForm, rider.dailyFormCap);
    }
  }

  private pushMessage(message: Omit<RaceSimMessage, 'id' | 'riderTeamId'> & { riderTeamId?: number | null }): void {
    const riderTeamId = message.riderTeamId
      ?? (message.riderId != null
        ? this.riders.find((candidate) => candidate.rider.id === message.riderId)?.rider.activeTeamId ?? null
        : null);

    let kmMark: number | null = null;
    if (message.riderId != null) {
      const rider = this.riders.find((r) => r.rider.id === message.riderId);
      if (rider) {
        kmMark = Number((rider.distanceCoveredMeters / 1000.0).toFixed(2));
      }
    }
    if (kmMark == null) {
      const leaderDistance = this.riders
        .filter((r) => r.finishStatus !== 'dnf')
        .reduce((maxDist, r) => Math.max(maxDist, r.distanceCoveredMeters), 0);
      kmMark = Number((leaderDistance / 1000.0).toFixed(2));
    }

    const newMessage: RaceSimMessage = {
      id: this.nextMessageId,
      ...message,
      riderTeamId,
      kmMark,
    };

    this.messages.unshift(newMessage);
    this.allEvents.push(newMessage);
    this.nextMessageId += 1;
    if (this.messages.length > 60) {
      this.messages.length = 60;
    }
    this.allEvents.push(newMessage);
  }

  private buildMarkerClassifications(ordered: RiderState[]): StageMarkerClassification[] {
    const riderStateById = new Map(ordered.map((r) => [r.rider.id, r]));
    return this.intermediateMarkers.map((marker) => {
      const markerEntries = ordered
        .map((rider) => rider.markerCrossings[marker.key] ?? null)
        .filter((entry): entry is MarkerCrossing => entry != null);

      const entries = normalizeMarkerClassificationEntries(
        markerEntries,
        !this.isTimeTrialMode,
        marker.markerType,
        riderStateById,
        this.isClimberMalusStage(),
      );

      return {
        markerKey: marker.key,
        markerLabel: marker.label,
        markerType: marker.markerType,
        markerCategory: marker.markerCategory,
        kmMark: marker.distanceMeters / 1000,
        entries,
      };
    });
  }

  private getOrderedRiders(): RiderState[] {
    const ordered = this.isTimeTrialMode
      ? [...this.riders].sort(compareRiders)
      : orderRoadRiders(this.riders, this.resolveFinishMarkerType(), this.isClimberMalusStage());
    return ordered;
  }

  /**
   * Gibt true zurück, wenn die Etappe vom Typ Flat oder Rolling ist (kein ITT/TTT).
   * Nur dann gilt der Bergfahrer-Malus beim Finish-Tie-Break.
   */
  private isClimberMalusStage(): boolean {
    if (this.isTimeTrialMode) return false;
    const profile = this.bootstrap.stage.profile;
    return profile === 'Flat' || profile === 'Rolling';
  }

  private buildFrameSnapshot(ordered: RiderState[]): SimulationFrameSnapshot {
    const leaderDistanceMeters = ordered
      .filter((rider) => rider.finishStatus !== 'dnf')
      .reduce((leaderDistance, rider) => Math.max(leaderDistance, rider.distanceCoveredMeters), 0);
    let finishedRiders = 0;

    for (const rider of ordered) {
      if (isClassifiedFinisher(rider)) {
        finishedRiders += 1;
      }
    }

    return {
      elapsedSeconds: this.elapsedSeconds,
      stageDistanceMeters: this.stageDistanceMeters,
      leaderDistanceMeters,
      finishedRiders,
      isFinished: this.isFinished(),
      clusters: this.buildClusters(ordered),
      windZones: this.windZones,
    };
  }

  private isFinished(): boolean {
    return this.riders.every(isRiderInactive);
  }

  private advanceSubstep(deltaSeconds: number): void {
    const stepStartSeconds = this.elapsedSeconds;
    const stepEndSeconds = stepStartSeconds + deltaSeconds;
    // Positionen ändern sich nicht zwischen Substep-Ende und nächstem Substep-Start,
    // daher kann die am Ende gebaute Bonus-Map als Startwert wiederverwendet werden.
    const currentTeamGroupBonusByRiderId = this.isTimeTrialMode
      ? null
      : (this.lastTeamGroupBonusByRiderId ?? this.buildTeamGroupBonusByRiderId());

    this.updateBreakawayPhaseState();

    for (const rider of this.riders) {
      if (isRiderInactive(rider)) {
        rider.nextDistanceCoveredMeters = null;
        rider.tempSpeedMps = 0;
        rider.draftModifier = 1;
        rider.draftNearbyRiderCount = 0;
        rider.draftPackFactor = 0;
        rider.currentSpeedMps = 0;
        rider.isAttacking = false;
        rider.isLeadingGroup = false;
        continue;
      }

      if (this.isTimeTrialMode && stepEndSeconds <= rider.startOffsetSeconds) {
        rider.nextDistanceCoveredMeters = null;
        rider.tempSpeedMps = 0;
        rider.draftModifier = 1;
        rider.draftNearbyRiderCount = 0;
        rider.draftPackFactor = 0;
        rider.currentSpeedMps = 0;
        rider.teamGroupBonus = 0;
        rider.isAttacking = false;
        rider.isLeadingGroup = false;
        continue;
      }

      const activeStepStartSeconds = this.isTimeTrialMode
        ? Math.max(stepStartSeconds, rider.startOffsetSeconds)
        : stepStartSeconds;
      const activeDeltaSeconds = Math.max(0, stepEndSeconds - activeStepStartSeconds);
      if (activeDeltaSeconds <= 0) {
        continue;
      }
      if (rider.incidentDelaySecondsRemaining > 0) {
        rider.incidentDelaySecondsRemaining = Math.max(0, rider.incidentDelaySecondsRemaining - activeDeltaSeconds);
        rider.tempSpeedMps = 0;
        rider.currentSpeedMps = 0;
        rider.nextDistanceCoveredMeters = rider.distanceCoveredMeters;
        rider.isAttacking = this.activeStageAttacksByRiderId.has(rider.rider.id);
        continue;
      }
      rider.hasStarted = true;

      this.advanceIndexForDistance(rider);
      const segment = this.currentSegment(rider);
      const windZone = this.currentWindZone(rider);
      if (!segment || !windZone) {
        rider.distanceCoveredMeters = this.stageDistanceMeters;
        rider.nextDistanceCoveredMeters = this.stageDistanceMeters;
        rider.finishTimeSeconds = activeStepStartSeconds;
        rider.tempSpeedMps = 0;
        rider.draftModifier = 1;
        rider.draftNearbyRiderCount = 0;
        rider.draftPackFactor = 0;
        rider.currentSpeedMps = 0;
        rider.isAttacking = false;
        rider.isLeadingGroup = false;
        rider.activeTerrain = 'Finish';
        rider.skillName = 'Finish';
        rider.skillBreakdown = '';
        rider.photoFinishScore = this.calculatePhotoFinishScore(rider);
        const specAdj = resolveSpecializationTieBreakAdjustment(rider, this.resolveFinishMarkerType(), this.isClimberMalusStage());
        const leadoutBonus = this.calculateSprintLeadoutBonus(rider);
        rider.photoFinishScore += specAdj + leadoutBonus;
        rider.leadoutBonus = leadoutBonus;
        continue;
      }

      rider.teamGroupBonus = this.resolveTeamGroupBonusValue(rider, currentTeamGroupBonusByRiderId);
      const basePhysics = this.calculateBasePhysics(rider, segment, windZone);
      rider.activeTerrain = segment.terrain;
      rider.skillName = basePhysics.skillName;
      rider.skillBreakdown = basePhysics.skillBreakdown;
      rider.baseSkill = basePhysics.baseSkill;
      rider.teamGroupBonus = basePhysics.teamGroupBonus;
      rider.effectiveSkill = basePhysics.effectiveSkill;
      rider.staminaPenalty = basePhysics.staminaPenalty;
      rider.elevationPenalty = basePhysics.elevationPenalty;
      rider.gradientPercent = basePhysics.gradientPercent;
      rider.gradientModifier = basePhysics.gradientModifier;
      rider.windModifier = basePhysics.windModifier;
      rider.tempSpeedMps = basePhysics.tempSpeedMps;
      rider.draftModifier = 1;
      rider.draftNearbyRiderCount = 0;
      rider.draftPackFactor = 0;
      rider.currentSpeedMps = basePhysics.tempSpeedMps;
      rider.photoFinishScore = this.calculatePhotoFinishScore(rider);
      rider.isAttacking = this.activeStageAttacksByRiderId.has(rider.rider.id);
      rider.isLeadingGroup = !this.isTimeTrialMode;
      rider.nextDistanceCoveredMeters = null;
      rider.nextDistanceCoveredMeters = rider.distanceCoveredMeters + (rider.currentSpeedMps * activeDeltaSeconds);
    }

    this.applyBreakawaySkillTempo(deltaSeconds);

    if (this.isTeamTimeTrial) {
      this.applyTeamTimeTrialTempo(stepStartSeconds, stepEndSeconds);
    } else if (!this.isTimeTrialMode) {
      const ordered = this.draftOrderScratch;
      ordered.length = 0;
      for (const rider of this.riders) {
        ordered.push(rider);
      }
      ordered.sort(compareDraftOrder);
      for (let index = 0; index < ordered.length; index += 1) {
        const rider = ordered[index];
        if (isRiderInactive(rider)) {
          continue;
        }

        const isActiveBreakawayRider = this.isActiveBreakawayRider(rider);

        const refV = rider.tempSpeedMps / 14;
        const dFull = Math.max(5, 50 * refV);
  const segment = this.currentSegment(rider);
  const baseDZero = Math.max(15, 150 * refV);
  const dZero = Math.max(dFull, Math.min(baseDZero, resolveDraftDistanceCapMeters(segment?.terrain)));
        const draftGroupWindow = resolveDraftGroupWindow(ordered, index, dZero);
        const draftGroupSize = draftGroupWindow.size;
        const draftPackFactor = resolveDraftPackFactor(draftGroupSize);
        const riderIsInFrontNoDraftZone = isFrontOfLargeDraftGroup(draftGroupSize, draftGroupWindow.positionInGroup);
        let ridersInZoneCount = 0;
        let closestGapMeters = Number.POSITIVE_INFINITY;
        let closestRider: RiderState | null = null;

        // ordered ist nach Distanz absteigend sortiert (bis auf DRAFT_ORDER_DISTANCE_TIE_METERS).
        // Rückwärts ab dem direkten Vordermann: die Lücke wächst monoton, daher kann abgebrochen
        // werden, sobald sie sicher außerhalb der Draft-Zone liegt.
        for (let candidateIndex = index - 1; candidateIndex >= 0; candidateIndex -= 1) {
          const candidate = ordered[candidateIndex];
          const gapMeters = candidate.distanceCoveredMeters - rider.distanceCoveredMeters;
          if (gapMeters >= dZero + DRAFT_ORDER_DISTANCE_TIE_METERS) {
            break;
          }
          if (!this.canReceiveDraftFromCandidate(rider, candidate) || this.isActiveBreakawayRider(candidate)) {
            continue;
          }
          if (gapMeters <= 0 || gapMeters >= dZero) {
            continue;
          }

          ridersInZoneCount += 1;
          if (gapMeters <= closestGapMeters) {
            closestGapMeters = gapMeters;
            closestRider = candidate;
          }
        }

        if (ridersInZoneCount === 0 || !closestRider) {
          if (isActiveBreakawayRider) {
            continue;
          }

          rider.draftModifier = 1;
          rider.draftNearbyRiderCount = 0;
          rider.draftPackFactor = 0;
          rider.currentSpeedMps = rider.tempSpeedMps;
          rider.nextDistanceCoveredMeters = rider.distanceCoveredMeters + (rider.currentSpeedMps * deltaSeconds);
          rider.isLeadingGroup = true;
          this.applyCaptainWaitLogic(rider);
          continue;
        }

        const targetFinalSpeed = isRiderInactive(closestRider)
          ? closestRider.tempSpeedMps
          : closestRider.currentSpeedMps;

        const dist = closestGapMeters;
        const fDist = dist <= dFull
          ? 1
          : 1 - ((dist - dFull) / Math.max(0.0001, dZero - dFull));
        const windZone = this.currentWindZone(rider);
        const currentWindVector = windZone?.vector ?? 0;
        const currentWindSpeed = windZone?.windSpeedKph ?? 0;
        const windEffect = -currentWindVector * (currentWindSpeed / 70);
        const baseBonus = Math.max(0.30, 0.35 + (0.35 * windEffect));
        const maxBonus = (baseBonus * Math.min(1, refV)) * DRAFT_BONUS_SCALE;
        const gradientPercent = clamp(segment?.gradient_percent ?? 0, -20, 20);
        const draftRetentionFactor = resolveDraftRetentionFactor(gradientPercent);
        const adjustedDraftBonus = riderIsInFrontNoDraftZone
          ? 0
          : (maxBonus * fDist * draftPackFactor) * draftRetentionFactor;
        const draftModifier = 1 + adjustedDraftBonus;
        const draftedSpeed = rider.tempSpeedMps * draftModifier;

        if (isActiveBreakawayRider && draftModifier <= rider.draftModifier) {
          continue;
        }

        rider.draftModifier = draftModifier;
        rider.draftNearbyRiderCount = draftGroupSize;
        rider.draftPackFactor = draftPackFactor;
        rider.isLeadingGroup = riderIsInFrontNoDraftZone;

        if (draftedSpeed > targetFinalSpeed) {
          if (rider.tempSpeedMps > closestRider.tempSpeedMps) {
            rider.currentSpeedMps = draftedSpeed;
            rider.nextDistanceCoveredMeters = rider.distanceCoveredMeters + (rider.currentSpeedMps * deltaSeconds);
            continue;
          }

          if (dist < 1.0) {
            rider.currentSpeedMps = targetFinalSpeed;
            rider.nextDistanceCoveredMeters = closestRider.distanceCoveredMeters + (targetFinalSpeed * deltaSeconds);
            if (!isActiveBreakawayRider) {
              this.applyCaptainWaitLogic(rider);
            }
            continue;
          }

          rider.currentSpeedMps = Math.min(draftedSpeed, targetFinalSpeed + 2.0);
          rider.nextDistanceCoveredMeters = rider.distanceCoveredMeters + (rider.currentSpeedMps * deltaSeconds);
          if (!isActiveBreakawayRider) {
            this.applyCaptainWaitLogic(rider);
          }
          continue;
        }

        rider.currentSpeedMps = draftedSpeed;
        rider.nextDistanceCoveredMeters = rider.distanceCoveredMeters + (rider.currentSpeedMps * deltaSeconds);
        if (!isActiveBreakawayRider) {
          this.applyCaptainWaitLogic(rider);
        }
      }
    }

    this.applyBreakawayGroupTempo(deltaSeconds);

    for (const rider of this.riders) {
      if (rider.incidentRecoverySecondsRemaining > 0 && rider.draftModifier >= 1.2) {
        rider.incidentRecoverySecondsRemaining = 0;
        rider.incidentRecoveryFormBonus = 0;
      }
    }

    const nextTeamGroupBonusByRiderId = this.isTimeTrialMode ? null : this.buildTeamGroupBonusByRiderId();
    this.lastTeamGroupBonusByRiderId = nextTeamGroupBonusByRiderId;

    for (const rider of this.riders) {
      if (isRiderInactive(rider)) {
        continue;
      }

      if (this.isTimeTrialMode && stepEndSeconds <= rider.startOffsetSeconds) {
        continue;
      }

      const activeStepStartSeconds = this.isTimeTrialMode
        ? Math.max(stepStartSeconds, rider.startOffsetSeconds)
        : stepStartSeconds;
      const activeDeltaSeconds = Math.max(0, stepEndSeconds - activeStepStartSeconds);
      if (activeDeltaSeconds <= 0) {
        continue;
      }

      const previousDistance = rider.distanceCoveredMeters;

      const targetDistance = rider.nextDistanceCoveredMeters
        ?? (rider.distanceCoveredMeters + (rider.currentSpeedMps * activeDeltaSeconds));
      const pendingIncident = rider.pendingIncident;
      if (pendingIncident && previousDistance < pendingIncident.triggerDistanceMeters && targetDistance >= pendingIncident.triggerDistanceMeters) {
        const incidentSpeed = Math.max(0.1, rider.currentSpeedMps);
        const secondsToIncident = Math.max(0, (pendingIncident.triggerDistanceMeters - previousDistance) / incidentSpeed);
        rider.distanceCoveredMeters = pendingIncident.triggerDistanceMeters;
        this.recordIntermediateSplits(rider, previousDistance, rider.distanceCoveredMeters, activeStepStartSeconds, rider.currentSpeedMps);
        this.recordBreakawayFallbackCheckpointCrossings(rider, previousDistance, rider.distanceCoveredMeters, activeStepStartSeconds, rider.currentSpeedMps);
        this.applyIncident(rider, pendingIncident, activeStepStartSeconds + secondsToIncident);
        rider.nextDistanceCoveredMeters = null;
        this.advanceIndexForDistance(rider);
        this.syncRiderTelemetry(rider, nextTeamGroupBonusByRiderId);
        continue;
      }
      const remainingMeters = this.stageDistanceMeters - rider.distanceCoveredMeters;
      const travelMeters = Math.max(0, targetDistance - rider.distanceCoveredMeters);

      if (travelMeters >= remainingMeters) {
        const finishSeconds = remainingMeters / rider.currentSpeedMps;
        rider.distanceCoveredMeters = this.stageDistanceMeters;
        this.recordIntermediateSplits(rider, previousDistance, rider.distanceCoveredMeters, activeStepStartSeconds, rider.currentSpeedMps);
        this.recordBreakawayFallbackCheckpointCrossings(rider, previousDistance, rider.distanceCoveredMeters, activeStepStartSeconds, rider.currentSpeedMps);
        rider.finishTimeSeconds = activeStepStartSeconds + finishSeconds;
        rider.currentSpeedMps = 0;
        const specAdj = resolveSpecializationTieBreakAdjustment(rider, this.resolveFinishMarkerType(), this.isClimberMalusStage());
        const leadoutBonus = this.calculateSprintLeadoutBonus(rider);
        rider.photoFinishScore += specAdj + leadoutBonus;
        rider.leadoutBonus = leadoutBonus;
      } else {
        rider.distanceCoveredMeters = targetDistance;
        this.recordIntermediateSplits(rider, previousDistance, rider.distanceCoveredMeters, activeStepStartSeconds, rider.currentSpeedMps);
        this.recordBreakawayFallbackCheckpointCrossings(rider, previousDistance, rider.distanceCoveredMeters, activeStepStartSeconds, rider.currentSpeedMps);
      }

      this.triggerStageAttacksForRider(rider, previousDistance, rider.distanceCoveredMeters, activeStepStartSeconds);

      rider.nextDistanceCoveredMeters = null;
      if (rider.incidentRecoverySecondsRemaining > 0) {
        rider.incidentRecoverySecondsRemaining = Math.max(0, rider.incidentRecoverySecondsRemaining - activeDeltaSeconds);
        if (rider.incidentRecoverySecondsRemaining <= 0) {
          rider.incidentRecoveryFormBonus = 0;
        }
      }

      while (!isRiderInactive(rider) && rider.distanceCoveredMeters >= rider.nextFormUpdateMeter) {
        rider.microForm = sampleMicroForm();
        rider.nextFormUpdateMeter += randomBetween(5000, 40000);
      }

      this.advanceIndexForDistance(rider);
      this.syncRiderTelemetry(rider, nextTeamGroupBonusByRiderId);
    }

    const breakawayPhaseEndedThisStep = this.updateBreakawayPhaseState();
    const breakawayRecoveryChanged = this.updateBreakawayMalusRecovery();
    if (breakawayPhaseEndedThisStep || breakawayRecoveryChanged) {
      this.syncBreakawayPlanRidersTelemetry(nextTeamGroupBonusByRiderId);
    }
    this.updateBreakawayGapStatus();

    const updatedActiveAttacks = updateActiveStageAttacks(this.activeStageAttacksByRiderId, deltaSeconds);
    this.activeStageAttacksByRiderId.clear();
    for (const attack of updatedActiveAttacks.newActiveAttacks) {
      this.activeStageAttacksByRiderId.set(attack.riderId, attack);
    }
    for (const rider of this.riders) {
      rider.isAttacking = !isRiderInactive(rider) && this.activeStageAttacksByRiderId.has(rider.rider.id);
    }

    this.elapsedSeconds += deltaSeconds;

    this.logFinishSprintTieBreakIfNeeded();
  }

  private applyTeamTimeTrialTempo(stepStartSeconds: number, stepEndSeconds: number): void {
    const activeRidersByTeamId = new Map<number, RiderState[]>();

    for (const rider of this.riders) {
      if (isRiderInactive(rider) || rider.rider.activeTeamId == null) {
        continue;
      }

      if (stepEndSeconds <= rider.startOffsetSeconds) {
        continue;
      }

      const bucket = activeRidersByTeamId.get(rider.rider.activeTeamId) ?? [];
      bucket.push(rider);
      activeRidersByTeamId.set(rider.rider.activeTeamId, bucket);
    }

    for (const teamRiders of activeRidersByTeamId.values()) {
      const referenceRider = teamRiders[0];
      const segment = referenceRider ? this.currentSegment(referenceRider) : null;
      if (!referenceRider || !segment) {
        continue;
      }

      const topCount = Math.min(5, teamRiders.length);
      const averageTopEffectiveSkill = [...teamRiders]
        .sort((left, right) => right.effectiveSkill - left.effectiveSkill || left.rider.id - right.rider.id)
        .slice(0, topCount)
        .reduce((sum, rider) => sum + rider.effectiveSkill, 0) / Math.max(topCount, 1);
      const missingRiderMalus = Math.max(0, 8 - teamRiders.length);
      const teamEffectiveSkill = Math.max(1, averageTopEffectiveSkill - missingRiderMalus);
      const teamSpeedMps = this.resolveTimeTrialSpeedMps(
        teamEffectiveSkill,
        referenceRider.distanceCoveredMeters,
        segment,
        referenceRider.gradientModifier,
        referenceRider.windModifier,
      ) * resolveTttTerrainSpeedMultiplier(segment.terrain, this.bootstrap.skillWeightRules ?? []);

      for (const rider of teamRiders) {
        const activeStepStartSeconds = Math.max(stepStartSeconds, rider.startOffsetSeconds);
        const activeDeltaSeconds = Math.max(0, stepEndSeconds - activeStepStartSeconds);
        rider.currentSpeedMps = teamSpeedMps;
        rider.tempSpeedMps = teamSpeedMps;
        rider.nextDistanceCoveredMeters = rider.distanceCoveredMeters + (teamSpeedMps * activeDeltaSeconds);
      }
    }
  }

  private advanceIndexForDistance(rider: RiderState): void {
    while (rider.segmentIndex < this.bootstrap.stageSummary.segments.length - 1) {
      const segment = this.bootstrap.stageSummary.segments[rider.segmentIndex];
      if (rider.distanceCoveredMeters < segment.end_km * 1000) {
        break;
      }
      rider.segmentIndex += 1;
    }

    while (rider.windZoneIndex < this.windZones.length - 1) {
      const windZone = this.windZones[rider.windZoneIndex];
      if (rider.distanceCoveredMeters < windZone.endMeter) {
        break;
      }
      rider.windZoneIndex += 1;
    }
  }

  private currentSegment(rider: RiderState): ParsedStageSegment | null {
    return this.bootstrap.stageSummary.segments[rider.segmentIndex] ?? null;
  }

  private currentWindZone(rider: RiderState): WindZone | null {
    return this.windZones[rider.windZoneIndex] ?? null;
  }

  private resolveStartOrder(riders: RiderState[]): RiderState[] {
    if (this.isTeamTimeTrial) {
      const teamStartIndexByTeamId = new Map((this.bootstrap.teamStartOrder ?? []).map((teamId, index) => [teamId, index]));
      return [...riders].sort((left, right) => {
        const leftTeamIndex = left.rider.activeTeamId != null ? teamStartIndexByTeamId.get(left.rider.activeTeamId) ?? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
        const rightTeamIndex = right.rider.activeTeamId != null ? teamStartIndexByTeamId.get(right.rider.activeTeamId) ?? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
        if (leftTeamIndex !== rightTeamIndex) {
          return leftTeamIndex - rightTeamIndex;
        }
        return this.resolveProjectedIttStartScore(right) - this.resolveProjectedIttStartScore(left) || left.rider.id - right.rider.id;
      });
    }

    if (!this.isIndividualTimeTrial) {
      return [...riders];
    }

    const gcRankByRiderId = new Map((this.bootstrap.gcStandings ?? []).map((entry) => [entry.riderId, entry.rank]));
    const hasEstablishedGc = this.bootstrap.race.isStageRace && this.bootstrap.stage.stageNumber > 1 && gcRankByRiderId.size > 0;
    if (!hasEstablishedGc) {
      return [...riders].sort((left, right) => left.rider.skills.timeTrial - right.rider.skills.timeTrial || left.rider.id - right.rider.id);
    }

    return [...riders].sort((left, right) => {
      const leftRank = gcRankByRiderId.get(left.rider.id);
      const rightRank = gcRankByRiderId.get(right.rider.id);
      if (leftRank != null && rightRank != null) {
        return rightRank - leftRank;
      }
      if (leftRank != null) return -1;
      if (rightRank != null) return 1;
      return this.resolveProjectedIttStartScore(left) - this.resolveProjectedIttStartScore(right) || left.rider.id - right.rider.id;
    });
  }

  private resolveProjectedIttStartScore(rider: RiderState): number {
    let weightedScore = 0;
    let totalDistance = 0;

    for (const segment of this.bootstrap.stageSummary.segments) {
      const segmentCenterMeter = ((segment.start_km + segment.end_km) / 2) * 1000;
      const staminaSkillPenalty = this.resolveStaminaPenalty(rider.rider.skills.stamina, segmentCenterMeter) + rider.incidentStaminaPenalty;
      const baseWeightedSkill = this.resolveWeightedSkill(rider.rider, segment.terrain);
      const weightedSkill = staminaSkillPenalty > 0
        ? this.resolveWeightedSkill(rider.rider, segment.terrain, staminaSkillPenalty)
        : baseWeightedSkill;
      const effectiveStaminaPenalty = Math.max(0, baseWeightedSkill.value - weightedSkill.value);
      const { effectiveSkill } = this.resolveEffectiveSkill({
        rider,
        baseSkill: weightedSkill.value,
        staminaPenalty: effectiveStaminaPenalty,
        teamGroupBonus: 0,
        distanceMeters: segmentCenterMeter,
      });
      const gradientPercent = clamp(segment.gradient_percent, -20, 20);
      const gradientModifier = gradientPercent > 0
        ? Math.exp(-0.11 * gradientPercent)
        : 1 - (gradientPercent * 0.06);
      const windZone = this.windZones.find((candidate) => segmentCenterMeter >= candidate.startMeter && segmentCenterMeter <= candidate.endMeter) ?? this.windZones[this.windZones.length - 1];
      const windModifier = windZone
        ? 1 + (windZone.vector * (windZone.windSpeedKph / 100) * 0.52)
        : 1;
      weightedScore += effectiveSkill * gradientModifier * windModifier * segment.length_km;
      totalDistance += segment.length_km;
    }

    return totalDistance > 0 ? weightedScore / totalDistance : 0;
  }

  private resolveStartOffsetSeconds(
    rider: RiderState,
    riderIndex: number,
    teamStartIndexByTeamId: Map<number, number>,
  ): number {
    if (this.isIndividualTimeTrial) {
      return riderIndex * ITT_START_INTERVAL_SECONDS;
    }

    if (this.isTeamTimeTrial) {
      const teamId = rider.rider.activeTeamId;
      const teamStartIndex = teamId != null ? teamStartIndexByTeamId.get(teamId) ?? 0 : 0;
      return teamStartIndex * TTT_START_INTERVAL_SECONDS;
    }

    return 0;
  }

  private buildIntermediateMarkers(): IntermediateMarker[] {
    return collectStageBoundaryMarkers(this.bootstrap.stageSummary)
      .filter(({ marker }) => marker.type === 'sprint_intermediate' || isMountainClassificationMarker(marker))
      .map(({ key, label, marker, kmMark }) => ({
        key,
        distanceMeters: kmMark * 1000,
        label,
        markerType: marker.type,
        markerCategory: marker.cat,
      }))
      .sort((left, right) => left.distanceMeters - right.distanceMeters);
  }

  private buildBreakawayGapPenaltyConfig(): BreakawayGapPenaltyConfig {
    const breakawayPlan = this.breakawayPlan;
    if (!breakawayPlan || this.isTimeTrialMode) {
      return { markers: [], fallbackCheckpointsMeters: [] };
    }

    const markers = this.intermediateMarkers.filter((marker) => marker.distanceMeters < breakawayPlan.groupPhaseEndDistanceMeters);
    const fallbackStartDistanceMeters = this.stageDistanceMeters * BREAKAWAY_GAP_PENALTY_FALLBACK_START_RATIO;
    const hasEarlyMarker = markers.some((marker) => marker.distanceMeters <= fallbackStartDistanceMeters);
    const needsFallback = markers.length <= 1 || !hasEarlyMarker;
    if (!needsFallback) {
      return { markers, fallbackCheckpointsMeters: [] };
    }

    const fallbackCheckpointsMeters: number[] = [];
    const firstCheckpointMeters = Math.max(
      BREAKAWAY_GAP_PENALTY_FALLBACK_STEP_METERS,
      Math.ceil(fallbackStartDistanceMeters / BREAKAWAY_GAP_PENALTY_FALLBACK_STEP_METERS) * BREAKAWAY_GAP_PENALTY_FALLBACK_STEP_METERS,
    );
    for (
      let checkpointMeters = firstCheckpointMeters;
      checkpointMeters < breakawayPlan.groupPhaseEndDistanceMeters;
      checkpointMeters += BREAKAWAY_GAP_PENALTY_FALLBACK_STEP_METERS
    ) {
      fallbackCheckpointsMeters.push(checkpointMeters);
    }

    return { markers, fallbackCheckpointsMeters };
  }

  private calculateBasePhysics(rider: RiderState, segment: ParsedStageSegment, windZone: WindZone): BasePhysicsResult {
    const skillName = terrainToSkillName(segment.terrain);
    const staminaSkillPenalty = this.resolveRiderStaminaPenalty(rider) + rider.incidentStaminaPenalty;
    const baseWeightedSkill = this.resolveWeightedSkill(rider.rider, segment.terrain);
    const weightedSkill = staminaSkillPenalty > 0
      ? this.resolveWeightedSkill(rider.rider, segment.terrain, staminaSkillPenalty)
      : baseWeightedSkill;
    const effectiveStaminaPenalty = Math.max(0, baseWeightedSkill.value - weightedSkill.value);
    const attackSkillBonus = this.resolveAttackSkillBonus(rider);
    const baseSkill = Math.min(85, weightedSkill.value) + attackSkillBonus;
    const teamGroupBonus = this.isTimeTrialMode ? 0 : rider.teamGroupBonus;
    const currentElevationMeters = this.resolveSegmentElevation(segment, rider.distanceCoveredMeters);
    const { effectiveSkill, staminaPenalty, elevationPenalty } = this.resolveEffectiveSkill({
      rider,
      baseSkill,
      staminaPenalty: effectiveStaminaPenalty,
      teamGroupBonus,
      distanceMeters: rider.distanceCoveredMeters,
      currentElevationMeters,
    });
    const gradientPercent = clamp(segment.gradient_percent, -20, 20);
    const gradientModifier = gradientPercent > 0
      ? Math.exp(-0.11 * gradientPercent)
      : 1 - (gradientPercent * 0.06);
    const windModifier = 1 + (windZone.vector * (windZone.windSpeedKph / 100) * 0.52);
    const speedSkillFactor = this.isTimeTrialMode
      ? 0.5
      : skillName === 'Flat'
        ? 0.14
        : skillName === 'Downhill'
          ? 0.18
          : (10 / 35);
    return {
      skillName,
      skillBreakdown: weightedSkill.breakdown,
      baseSkill,
      teamGroupBonus,
      effectiveSkill,
      staminaPenalty,
      elevationPenalty,
      gradientPercent,
      gradientModifier,
      windModifier,
      attackSkillBonus,
      tempSpeedMps: this.isTimeTrialMode
        ? this.resolveTimeTrialSpeedMps(effectiveSkill, rider.distanceCoveredMeters, segment, gradientModifier, windModifier)
        : this.resolveRoadStageSpeedMps(effectiveSkill, rider.distanceCoveredMeters, segment, gradientModifier, windModifier, speedSkillFactor),
    };
  }

  private resolveRoadStageSpeedMps(
    effectiveSkill: number,
    distanceMeters: number,
    segment: ParsedStageSegment,
    gradientModifier: number,
    windModifier: number,
    speedSkillFactor: number,
  ): number {
    const spreadFactor = this.resolveSkillSpreadFactor(distanceMeters, segment);
    const currentElevationMeters = this.resolveSegmentElevation(segment, distanceMeters);
    const elevationSpreadFactor = this.resolveElevationSkillSpreadFactor(segment, currentElevationMeters);
    const skillSpeedDeltaKph = (effectiveSkill - 50) * speedSkillFactor * spreadFactor * elevationSpreadFactor;
    const baseSpeedKph = 40 + skillSpeedDeltaKph;
    const baseSpeedMps = baseSpeedKph / 3.6;
    return Math.max(0.5, baseSpeedMps * gradientModifier * windModifier);
  }

  private resolveElevationSkillSpreadFactor(segment: ParsedStageSegment, elevationMeters: number): number {
    if (segment.terrain !== 'Mountain' && segment.terrain !== 'Medium_Mountain') {
      return 1;
    }

    const elevationAboveStart = Math.max(0, elevationMeters - ELEVATION_SPREAD_START_METERS);
    const spreadSteps = Math.floor(elevationAboveStart / ELEVATION_SPREAD_STEP_METERS);

    if (segment.terrain === 'Mountain') {
      const spreadBonus = (spreadSteps * MOUNTAIN_ELEVATION_SPREAD_BASE_STEP_FACTOR)
        + ((spreadSteps * Math.max(0, spreadSteps - 1)) * MOUNTAIN_ELEVATION_SPREAD_STEP_INCREMENT / 2);
      return 1 + spreadBonus;
    }

    return 1 + (spreadSteps * ELEVATION_SPREAD_STEP_FACTOR);
  }

  private resolveRoadSpeedSkillFactor(skillName: TerrainSkillName | 'Finish'): number {
    if (skillName === 'Flat') return 0.14;
    if (skillName === 'Downhill') return 0.18;
    return 10 / 35;
  }

  private resolveBreakawayReferenceSkill(rider: RiderState, activeNonBreakawayRiders: RiderState[]): number {
    const sameTerrainRiders = activeNonBreakawayRiders.filter((candidate) => candidate.activeTerrain === rider.activeTerrain);
    const referenceRiders = sameTerrainRiders.length > 0 ? sameTerrainRiders : activeNonBreakawayRiders;
    return referenceRiders.reduce((bestSkill, candidate) => Math.max(bestSkill, candidate.effectiveSkill), rider.effectiveSkill);
  }

  private resolveBreakawaySkillBonus(rider: RiderState): number {
    if (!this.isBreakawayBonusWindow(rider)) {
      return 0;
    }

    return this.breakawayPlan?.skillBonus ?? 0;
  }

  private resolveMaxBreakawayDraftModifier(rider: RiderState, segment: ParsedStageSegment, groupSize: number): { draftModifier: number; draftPackFactor: number } {
    if (groupSize <= 1) {
      return { draftModifier: 1, draftPackFactor: 0 };
    }

    const refV = rider.tempSpeedMps / 14;
    const windZone = this.currentWindZone(rider);
    const currentWindVector = windZone?.vector ?? 0;
    const currentWindSpeed = windZone?.windSpeedKph ?? 0;
    const windEffect = -currentWindVector * (currentWindSpeed / 70);
    const baseBonus = Math.max(0.30, 0.35 + (0.35 * windEffect));
    const maxBonus = (baseBonus * Math.min(1, refV)) * DRAFT_BONUS_SCALE;
    const gradientPercent = clamp(segment.gradient_percent, -20, 20);
    const draftRetentionFactor = resolveDraftRetentionFactor(gradientPercent);
    const draftPackFactor = resolveDraftPackFactor(groupSize);
    return {
      draftModifier: 1 + (maxBonus * draftPackFactor * draftRetentionFactor),
      draftPackFactor,
    };
  }

  private resolveBreakawayTimeGapPenalty(gapSeconds: number): number {
    if (gapSeconds < BREAKAWAY_GAP_PENALTY_START_SECONDS) {
      return 0;
    }

    const penaltySteps = Math.floor((gapSeconds - BREAKAWAY_GAP_PENALTY_START_SECONDS) / BREAKAWAY_GAP_PENALTY_STEP_SECONDS);
    return BREAKAWAY_GAP_PENALTY_BASE_SKILL + penaltySteps;
  }

  private recordBreakawayFallbackCheckpointCrossings(
    rider: RiderState,
    startDistanceMeters: number,
    endDistanceMeters: number,
    stepStartSeconds: number,
    speedMps: number,
  ): void {
    if (this.breakawayGapPenaltyFallbackCheckpointsMeters.length === 0 || speedMps <= 0) {
      return;
    }

    while (rider.nextBreakawayFallbackCheckpointIndex < this.breakawayGapPenaltyFallbackCheckpointsMeters.length) {
      const checkpointIndex = rider.nextBreakawayFallbackCheckpointIndex;
      const checkpointMeters = this.breakawayGapPenaltyFallbackCheckpointsMeters[checkpointIndex];
      if (checkpointMeters == null || checkpointMeters > endDistanceMeters) {
        break;
      }
      if (checkpointMeters < startDistanceMeters) {
        rider.nextBreakawayFallbackCheckpointIndex += 1;
        continue;
      }

      const secondsToCheckpoint = (checkpointMeters - startDistanceMeters) / speedMps;
      const crossingTimeSeconds = Math.max(0, this.isTimeTrialMode
        ? stepStartSeconds + secondsToCheckpoint - rider.startOffsetSeconds
        : stepStartSeconds + secondsToCheckpoint);
      rider.breakawayFallbackCheckpointTimes[checkpointIndex] = crossingTimeSeconds;
      rider.nextBreakawayFallbackCheckpointIndex += 1;
    }
  }

  private updateBreakawayGapPenaltyFromCheckpoints(
    activeBreakawayRiders: RiderState[],
    activeNonBreakawayRiders: RiderState[],
  ): number {
    const breakawayPlan = this.breakawayPlan;
    if (!breakawayPlan || activeBreakawayRiders.length === 0 || activeNonBreakawayRiders.length === 0) {
      this.breakawayGapStatus = null;
      return activeBreakawayRiders[0]?.breakawayGapPenalty ?? 0;
    }

    let gapPenalty = activeBreakawayRiders[0]?.breakawayGapPenalty ?? 0;
    const bestNonBreakawayRider = [...activeNonBreakawayRiders].sort((left, right) => (
      right.distanceCoveredMeters - left.distanceCoveredMeters
      || right.currentSpeedMps - left.currentSpeedMps
      || left.rider.id - right.rider.id
    ))[0] ?? null;
    if (!bestNonBreakawayRider) {
      this.breakawayGapStatus = null;
      return gapPenalty;
    }

    while (this.nextBreakawayGapPenaltyMarkerIndex < this.breakawayGapPenaltyMarkers.length) {
      const marker = this.breakawayGapPenaltyMarkers[this.nextBreakawayGapPenaltyMarkerIndex];
      if (!marker) {
        break;
      }

      const bestNonBreakawayCrossing = bestNonBreakawayRider.markerCrossings[marker.key] ?? null;
      if (!bestNonBreakawayCrossing) {
        break;
      }

      const breakawayLeaderCrossing = activeBreakawayRiders
        .map((candidate) => candidate.markerCrossings[marker.key] ?? null)
        .filter((crossing): crossing is MarkerCrossing => crossing != null)
        .sort((left, right) => left.crossingTimeSeconds - right.crossingTimeSeconds || left.riderId - right.riderId)[0] ?? null;
      if (breakawayLeaderCrossing) {
        const gapSeconds = bestNonBreakawayCrossing.crossingTimeSeconds - breakawayLeaderCrossing.crossingTimeSeconds;
        gapPenalty = this.resolveBreakawayTimeGapPenalty(gapSeconds);
        this.breakawayGapStatus = {
          gapSeconds,
          penalty: gapPenalty,
          kmMark: marker.distanceMeters / 1000,
        };
      }

      this.nextBreakawayGapPenaltyMarkerIndex += 1;
    }

    while (this.nextBreakawayGapPenaltyFallbackIndex < this.breakawayGapPenaltyFallbackCheckpointsMeters.length) {
      const checkpointIndex = this.nextBreakawayGapPenaltyFallbackIndex;
      const bestNonBreakawayCrossingTime = bestNonBreakawayRider.breakawayFallbackCheckpointTimes[checkpointIndex] ?? null;
      if (bestNonBreakawayCrossingTime == null) {
        break;
      }

      const breakawayLeaderCrossingTime = activeBreakawayRiders
        .map((candidate) => candidate.breakawayFallbackCheckpointTimes[checkpointIndex] ?? null)
        .filter((crossingTime): crossingTime is number => crossingTime != null)
        .sort((left, right) => left - right)[0] ?? null;
      if (breakawayLeaderCrossingTime != null) {
        const gapSeconds = bestNonBreakawayCrossingTime - breakawayLeaderCrossingTime;
        gapPenalty = this.resolveBreakawayTimeGapPenalty(gapSeconds);
        this.breakawayGapStatus = {
          gapSeconds,
          penalty: gapPenalty,
          kmMark: checkpointIndex < this.breakawayGapPenaltyFallbackCheckpointsMeters.length
            ? this.breakawayGapPenaltyFallbackCheckpointsMeters[checkpointIndex] / 1000
            : null,
        };
      }

      this.nextBreakawayGapPenaltyFallbackIndex += 1;
    }

    return gapPenalty;
  }

  private updateBreakawayGapStatus(): void {
    const breakawayPlan = this.breakawayPlan;
    if (!breakawayPlan || this.isTimeTrialMode || !this.isBreakawayGroupPhaseActive()) {
      this.breakawayGapStatus = null;
      return;
    }

    const breakawayRiderIds = new Set(breakawayPlan.riderIds);
    const activeBreakawayRiders = this.riders.filter((rider) => (
      !isRiderInactive(rider)
      && breakawayRiderIds.has(rider.rider.id)
      && rider.activeTerrain !== 'Finish'
    ));
    const activeNonBreakawayRiders = this.riders.filter((rider) => (
      !isRiderInactive(rider)
      && !breakawayRiderIds.has(rider.rider.id)
      && rider.activeTerrain !== 'Finish'
    ));
    if (activeBreakawayRiders.length === 0 || activeNonBreakawayRiders.length === 0) {
      this.breakawayGapStatus = null;
      return;
    }

    const bestBreakawayRider = [...activeBreakawayRiders].sort((left, right) => (
      right.distanceCoveredMeters - left.distanceCoveredMeters
      || right.currentSpeedMps - left.currentSpeedMps
      || left.rider.id - right.rider.id
    ))[0] ?? null;
    const bestNonBreakawayRider = [...activeNonBreakawayRiders].sort((left, right) => (
      right.distanceCoveredMeters - left.distanceCoveredMeters
      || right.currentSpeedMps - left.currentSpeedMps
      || left.rider.id - right.rider.id
    ))[0] ?? null;
    if (!bestBreakawayRider || !bestNonBreakawayRider || bestBreakawayRider.distanceCoveredMeters <= bestNonBreakawayRider.distanceCoveredMeters) {
      this.breakawayGapStatus = null;
      return;
    }

    for (let index = this.intermediateMarkers.length - 1; index >= 0; index -= 1) {
      const marker = this.intermediateMarkers[index];
      if (!marker) {
        continue;
      }

      const breakawayCrossing = bestBreakawayRider.markerCrossings[marker.key] ?? null;
      const nonBreakawayCrossing = bestNonBreakawayRider.markerCrossings[marker.key] ?? null;
      if (!breakawayCrossing || !nonBreakawayCrossing) {
        continue;
      }

      const gapSeconds = nonBreakawayCrossing.crossingTimeSeconds - breakawayCrossing.crossingTimeSeconds;
      this.breakawayGapStatus = {
        gapSeconds,
        penalty: this.resolveBreakawayTimeGapPenalty(gapSeconds),
        kmMark: marker.distanceMeters / 1000,
      };
      return;
    }

    for (let index = this.breakawayGapPenaltyFallbackCheckpointsMeters.length - 1; index >= 0; index -= 1) {
      const checkpointMeters = this.breakawayGapPenaltyFallbackCheckpointsMeters[index];
      if (checkpointMeters == null) {
        continue;
      }

      const breakawayCrossingTime = bestBreakawayRider.breakawayFallbackCheckpointTimes[index] ?? null;
      const nonBreakawayCrossingTime = bestNonBreakawayRider.breakawayFallbackCheckpointTimes[index] ?? null;
      if (breakawayCrossingTime == null || nonBreakawayCrossingTime == null) {
        continue;
      }

      const gapSeconds = nonBreakawayCrossingTime - breakawayCrossingTime;
      this.breakawayGapStatus = {
        gapSeconds,
        penalty: this.resolveBreakawayTimeGapPenalty(gapSeconds),
        kmMark: checkpointMeters / 1000,
      };
      return;
    }

    this.breakawayGapStatus = null;
  }

  private applyBreakawaySkillTempo(deltaSeconds: number): void {
    const breakawayPlan = this.breakawayPlan;
    if (!breakawayPlan || !this.isBreakawayGroupPhaseActive() || this.isTimeTrialMode) {
      return;
    }

    const breakawayRiderIds = new Set(breakawayPlan.riderIds);
    const activeBreakawayRiders = this.riders.filter((rider) => (
      !isRiderInactive(rider)
      && breakawayRiderIds.has(rider.rider.id)
    ));
    if (activeBreakawayRiders.length === 0) {
      return;
    }

    const activeNonBreakawayRiders = this.riders.filter((rider) => (
      !isRiderInactive(rider)
      && !breakawayRiderIds.has(rider.rider.id)
      && rider.activeTerrain !== 'Finish'
    ));

    const gapPenalty = this.updateBreakawayGapPenaltyFromCheckpoints(activeBreakawayRiders, activeNonBreakawayRiders);
    for (const rider of activeBreakawayRiders) {
      rider.breakawayGapPenalty = gapPenalty;
    }

    for (const rider of activeBreakawayRiders) {
      const segment = this.currentSegment(rider);
      if (!segment) {
        continue;
      }

      const bestReferenceSkill = this.resolveBreakawayReferenceSkill(rider, activeNonBreakawayRiders);
      const breakawayTargetSkill = bestReferenceSkill + Math.max(0, breakawayPlan.skillBonus - rider.breakawayGapPenalty);
      rider.effectiveSkill = breakawayTargetSkill;
      rider.tempSpeedMps = this.resolveRoadStageSpeedMps(
        breakawayTargetSkill,
        rider.distanceCoveredMeters,
        segment,
        rider.gradientModifier,
        rider.windModifier,
        this.resolveRoadSpeedSkillFactor(rider.skillName),
      );
      const breakawayDraft = this.resolveMaxBreakawayDraftModifier(rider, segment, activeBreakawayRiders.length);
      rider.draftModifier = breakawayDraft.draftModifier;
      rider.draftNearbyRiderCount = Math.max(0, activeBreakawayRiders.length - 1);
      rider.draftPackFactor = breakawayDraft.draftPackFactor;
      rider.currentSpeedMps = rider.tempSpeedMps * breakawayDraft.draftModifier;
      rider.nextDistanceCoveredMeters = rider.distanceCoveredMeters + (rider.currentSpeedMps * deltaSeconds);
    }
  }

  private resolveTimeTrialSpeedMps(
    effectiveSkill: number,
    distanceMeters: number,
    segment: ParsedStageSegment,
    gradientModifier: number,
    windModifier: number,
  ): number {
    return this.resolveRoadStageSpeedMps(effectiveSkill, distanceMeters, segment, gradientModifier, windModifier, 0.5);
  }

  private syncRiderTelemetry(rider: RiderState, teamGroupBonusByRiderId: TeamGroupBonusByRiderId | null = null): void {
    const segment = this.currentSegment(rider);
    const windZone = this.currentWindZone(rider);
    if (isRiderInactive(rider) || !segment || !windZone) {
      rider.segmentStartKm = this.bootstrap.stageSummary.distanceKm;
      rider.segmentEndKm = this.bootstrap.stageSummary.distanceKm;
      rider.segmentStartElevation = 0;
      rider.segmentEndElevation = 0;
      rider.activeTerrain = 'Finish';
      rider.skillName = 'Finish';
      rider.skillBreakdown = '';
      rider.baseSkill = 0;
      rider.teamGroupBonus = 0;
      rider.effectiveSkill = 0;
      rider.staminaPenalty = 0;
      rider.staminaSkillPenalty = 0;
      rider.elevationPenalty = 0;
      rider.gradientPercent = 0;
      rider.gradientModifier = 1;
      rider.windModifier = 1;
      rider.draftModifier = 1;
      rider.draftNearbyRiderCount = 0;
      rider.draftPackFactor = 0;
      rider.currentSpeedMps = 0;
      rider.isAttacking = false;
      return;
    }

    rider.teamGroupBonus = this.resolveTeamGroupBonusValue(rider, teamGroupBonusByRiderId);
    const basePhysics = this.calculateBasePhysics(rider, segment, windZone);
  rider.segmentStartKm = segment.start_km;
  rider.segmentEndKm = segment.end_km;
  rider.segmentStartElevation = segment.start_elevation;
  rider.segmentEndElevation = segment.end_elevation;
    rider.activeTerrain = segment.terrain;
    rider.skillName = basePhysics.skillName;
    rider.skillBreakdown = basePhysics.attackSkillBonus > 0
      ? `${basePhysics.skillBreakdown} · Attack +${basePhysics.attackSkillBonus}`
      : basePhysics.skillBreakdown;
    rider.baseSkill = basePhysics.baseSkill;
    rider.teamGroupBonus = basePhysics.teamGroupBonus;
    rider.effectiveSkill = basePhysics.effectiveSkill;
    rider.staminaPenalty = basePhysics.staminaPenalty;
    rider.elevationPenalty = basePhysics.elevationPenalty;
    rider.gradientPercent = basePhysics.gradientPercent;
    rider.gradientModifier = basePhysics.gradientModifier;
    rider.windModifier = basePhysics.windModifier;
    rider.currentSpeedMps = basePhysics.tempSpeedMps * rider.draftModifier;
    rider.photoFinishScore = this.calculatePhotoFinishScore(rider);
    rider.isAttacking = this.activeStageAttacksByRiderId.has(rider.rider.id);
    rider.isBreakaway = this.breakawayPlan?.riderIds.includes(rider.rider.id) ?? false;
  }

  private updateBreakawayMalusRecovery(): boolean {
    const breakawayPlan = this.breakawayPlan;
    if (!breakawayPlan || !this.breakawayPhaseEnded || this.isTimeTrialMode) {
      return false;
    }

    const breakawayRiderIds = new Set(breakawayPlan.riderIds);
    const leadingNonBreakawayDistanceMeters = this.riders.reduce((bestDistance, rider) => {
      if (isRiderInactive(rider) || breakawayRiderIds.has(rider.rider.id)) {
        return bestDistance;
      }
      return Math.max(bestDistance, rider.distanceCoveredMeters);
    }, 0);

    if (leadingNonBreakawayDistanceMeters <= breakawayPlan.phaseEndDistanceMeters) {
      return false;
    }

    let hasChanges = false;
    for (const rider of this.riders) {
      if (!breakawayRiderIds.has(rider.rider.id) || rider.breakawayMalus <= 0) {
        continue;
      }

      if (rider.rider.hasSupermalus === true || rider.distanceCoveredMeters < breakawayPlan.phaseEndDistanceMeters) {
        continue;
      }

      if (rider.breakawayRecoveryStartDistanceMeters == null) {
        if (leadingNonBreakawayDistanceMeters <= rider.distanceCoveredMeters) {
          continue;
        }

        rider.breakawayRecoveryStartDistanceMeters = rider.distanceCoveredMeters;
        if (rider.rider.hasSuperform === true || Math.random() < BREAKAWAY_FULL_RECOVERY_CHANCE) {
          rider.breakawayMalus = 0;
          hasChanges = true;
          continue;
        }
      }

      const recoveryStartDistanceMeters = rider.breakawayRecoveryStartDistanceMeters;
      if (recoveryStartDistanceMeters == null || rider.breakawayInitialMalus <= 0) {
        continue;
      }

      const recoveredDistanceMeters = Math.max(0, rider.distanceCoveredMeters - recoveryStartDistanceMeters);
      const recoverySteps = Math.floor(recoveredDistanceMeters / BREAKAWAY_MALUS_RECOVERY_STEP_METERS);
      const minimumRemainingMalus = Math.min(BREAKAWAY_MALUS_RECOVERY_FLOOR, rider.breakawayInitialMalus);
      const recoveredMalus = Math.max(
        minimumRemainingMalus,
        rider.breakawayInitialMalus - (recoverySteps * BREAKAWAY_MALUS_RECOVERY_STEP_SKILL),
      );
      const nextMalus = roundToTwoDecimals(recoveredMalus);
      if (nextMalus !== rider.breakawayMalus) {
        rider.breakawayMalus = nextMalus;
        hasChanges = true;
      }
    }

    return hasChanges;
  }

  private syncBreakawayPlanRidersTelemetry(teamGroupBonusByRiderId: TeamGroupBonusByRiderId | null): void {
    const breakawayPlan = this.breakawayPlan;
    if (!breakawayPlan) {
      return;
    }

    const breakawayRiderIds = new Set(breakawayPlan.riderIds);
    for (const rider of this.riders) {
      if (isRiderInactive(rider) || !breakawayRiderIds.has(rider.rider.id)) {
        continue;
      }
      this.syncRiderTelemetry(rider, teamGroupBonusByRiderId);
    }
  }

  private updateBreakawayPhaseState(): boolean {
    const breakawayPlan = this.breakawayPlan;
    if (!breakawayPlan || this.breakawayPhaseEnded) {
      return false;
    }

    const breakawayRiders = this.riders.filter((rider) => breakawayPlan.riderIds.includes(rider.rider.id));
    if (breakawayRiders.length === 0) {
      return false;
    }

    if (!this.breakawayPhaseActive && breakawayRiders.some((rider) => rider.distanceCoveredMeters >= breakawayPlan.triggerDistanceMeters)) {
      this.breakawayPhaseActive = true;
      for (const r of breakawayRiders) {
        this.pushMessage({
          elapsedSeconds: this.elapsedSeconds,
          riderId: r.rider.id,
          riderName: r.riderName,
          type: 'attack',
          tone: 'warning',
          title: `Ausreißversuch: ${this.formatRiderWithPreStageGc(r.rider.id, r.riderName)}`,
          detail: `Fahrer ist Teil der Ausreißergruppe. Die gemeinsame Bewegung endet ab ${(breakawayPlan.groupPhaseEndDistanceMeters / 1000).toFixed(1).replace('.', ',')} km.`,
        });
      }
    }

    let hasChanges = false;

    if (!this.breakawayGroupPhaseEnded && this.breakawayPhaseActive && breakawayRiders.some((rider) => rider.distanceCoveredMeters >= breakawayPlan.groupPhaseEndDistanceMeters)) {
      this.breakawayGroupPhaseEnded = true;
      this.breakawayGapStatus = null;
      for (const rider of breakawayRiders) {
        rider.breakawayGapPenalty = 0;
      }
      this.pushMessage({
        elapsedSeconds: this.elapsedSeconds,
        riderId: null,
        riderName: null,
        type: 'attack',
        tone: 'warning',
        title: 'Ausreißerverbund endet',
        detail: `Ab jetzt gilt wieder normales Drafting. Der Ausreißermalus greift erst ab ${(breakawayPlan.phaseEndDistanceMeters / 1000).toFixed(1).replace('.', ',')} km.`,
      });
      hasChanges = true;
    }

    if (this.breakawayPhaseActive && breakawayRiders.some((rider) => rider.distanceCoveredMeters >= breakawayPlan.phaseEndDistanceMeters)) {
      this.breakawayPhaseEnded = true;
      this.breakawayGapStatus = null;
      for (const rider of breakawayRiders) {
        rider.breakawayMalus = breakawayPlan.malusValue;
        rider.breakawayInitialMalus = breakawayPlan.malusValue;
        rider.breakawayRecoveryStartDistanceMeters = null;
        rider.breakawayGapPenalty = 0;
      }
      this.pushMessage({
        elapsedSeconds: this.elapsedSeconds,
        riderId: null,
        riderName: null,
        type: 'incident',
        tone: 'danger',
        title: 'Ausreißerphase endet',
        detail: `Die Fahrer erhalten -${breakawayPlan.malusValue} Form für den Rest der Etappe.`,
      });
      return true;
    }

    return hasChanges;
  }

  private applyBreakawayGroupTempo(deltaSeconds: number): void {
    const breakawayPlan = this.breakawayPlan;
    if (!breakawayPlan || !this.isBreakawayGroupPhaseActive() || this.isTimeTrialMode) {
      return;
    }

    const activeBreakawayRiders = this.riders
      .filter((rider) => !isRiderInactive(rider) && breakawayPlan.riderIds.includes(rider.rider.id));
    if (activeBreakawayRiders.length === 0) {
      return;
    }

    const bestBreakawayRider = [...activeBreakawayRiders].sort((left, right) => (
      right.distanceCoveredMeters - left.distanceCoveredMeters
      || right.currentSpeedMps - left.currentSpeedMps
      || left.rider.id - right.rider.id
    ))[0];
    if (!bestBreakawayRider) {
      return;
    }

    const groupSpeedMps = Math.max(0.1, bestBreakawayRider.currentSpeedMps);
    const leaderTargetDistance = bestBreakawayRider.distanceCoveredMeters + (groupSpeedMps * deltaSeconds);

    for (const rider of activeBreakawayRiders) {
      const gapToBestMeters = Math.max(0, bestBreakawayRider.distanceCoveredMeters - rider.distanceCoveredMeters);
      if (gapToBestMeters > 0) {
        const catchUpSpeedMps = groupSpeedMps + 0.1;
        rider.currentSpeedMps = catchUpSpeedMps;
        rider.nextDistanceCoveredMeters = Math.min(
          leaderTargetDistance,
          rider.distanceCoveredMeters + (catchUpSpeedMps * deltaSeconds),
        );
        continue;
      }

      rider.currentSpeedMps = groupSpeedMps;
      rider.nextDistanceCoveredMeters = rider.distanceCoveredMeters + (groupSpeedMps * deltaSeconds);
    }
  }

  private resolveAttackSkillBonus(rider: RiderState): number {
    return this.activeStageAttacksByRiderId.has(rider.rider.id) ? ATTACK_SKILL_BONUS : 0;
  }

  private isActiveBreakawayRider(rider: RiderState): boolean {
    return (this.breakawayPlan?.riderIds.includes(rider.rider.id) ?? false)
      && this.isBreakawayGroupPhaseActive();
  }

  private isBreakawayGroupPhaseActive(): boolean {
    return this.breakawayPhaseActive
      && !this.breakawayGroupPhaseEnded
      && !this.breakawayPhaseEnded;
  }

  private isBreakawayBonusWindow(rider: RiderState): boolean {
    return (this.breakawayPlan?.riderIds.includes(rider.rider.id) ?? false)
      && this.breakawayPhaseActive
      && this.breakawayGroupPhaseEnded
      && !this.breakawayPhaseEnded;
  }

  private resolveAttackStagePositionExcludingBreakaways(riderId: number): number {
    return this.getOrderedRiders()
      .filter((candidate) => !this.isActiveBreakawayRider(candidate))
      .findIndex((candidate) => candidate.rider.id === riderId) + 1;
  }

  private isDraftBlockedByAttack(candidate: RiderState): boolean {
    const activeAttack = this.activeStageAttacksByRiderId.get(candidate.rider.id) ?? null;
    return activeAttack != null && !activeAttack.isCounterAttack;
  }

  private canReceiveDraftFromCandidate(rider: RiderState, candidate: RiderState): boolean {
    const candidateAttack = this.activeStageAttacksByRiderId.get(candidate.rider.id) ?? null;
    if (candidateAttack == null || candidateAttack.isCounterAttack) {
      return true;
    }

    const riderAttack = this.activeStageAttacksByRiderId.get(rider.rider.id) ?? null;
    return riderAttack?.isCounterAttack === true && riderAttack.triggeredByRiderId === candidate.rider.id;
  }

  private resolvePreStageGcRank(riderId: number): number | null {
    return this.bootstrap.gcStandings.find((standing) => standing.riderId === riderId)?.rank ?? null;
  }

  private formatRiderWithPreStageGc(riderId: number, riderName: string): string {
    const gcRank = this.resolvePreStageGcRank(riderId);
    return gcRank != null ? `${riderName} (${gcRank}.)` : riderName;
  }

  private triggerStageAttacksForRider(rider: RiderState, previousDistance: number, currentDistance: number, activeStepStartSeconds: number): void {
    if (isRiderInactive(rider) || this.activeStageAttacksByRiderId.has(rider.rider.id)) {
      return;
    }

    const plannedAttacks = this.precalculatedStageAttacksByRiderId.get(rider.rider.id);
    if (!plannedAttacks || plannedAttacks.length === 0) {
      return;
    }

    const nextAttack = plannedAttacks[0];
    if (!nextAttack || previousDistance >= nextAttack.triggerDistanceMeters || currentDistance < nextAttack.triggerDistanceMeters) {
      return;
    }

    const currentStagePosition = this.resolveAttackStagePositionExcludingBreakaways(rider.rider.id);
    if (currentStagePosition <= 0 || currentStagePosition > 10) {
      console.log(
        `[RaceAttack] verworfen: ${rider.riderName} Attacke ${nextAttack.attackNumber} bei ${(nextAttack.triggerDistanceMeters / 1000).toFixed(1).replace('.', ',')} km, `
        + `Position ohne Ausreißer ${currentStagePosition}, aktuelle km ${(currentDistance / 1000).toFixed(1).replace('.', ',')}`,
      );
      plannedAttacks.shift();
      return;
    }

    plannedAttacks.shift();
    const currentSpeed = Math.max(0.1, rider.currentSpeedMps);
    const secondsToTrigger = Math.max(0, (nextAttack.triggerDistanceMeters - previousDistance) / currentSpeed);
    const startedAtElapsedSeconds = activeStepStartSeconds + secondsToTrigger;
    this.activeStageAttacksByRiderId.set(rider.rider.id, {
      riderId: rider.rider.id,
      remainingSeconds: nextAttack.durationSeconds,
      startedAtElapsedSeconds,
      triggerDistanceMeters: nextAttack.triggerDistanceMeters,
      durationSeconds: nextAttack.durationSeconds,
      attackNumber: nextAttack.attackNumber,
      isCounterAttack: false,
      triggeredByRiderId: null,
    });
    rider.isAttacking = true;
    const activeAttackerIds = new Set(this.activeStageAttacksByRiderId.keys());
    const nearbyCounterFavorites = this.stageFavorites
      .slice(0, 20)
      .filter((favorite) => {
        if (favorite.kind !== 'rider' || favorite.riderId == null) {
          return false;
        }

        const candidate = this.riders.find((entry) => entry.rider.id === favorite.riderId);
        if (!candidate || isRiderInactive(candidate)) {
          return false;
        }

        const gapBehindAttackerMeters = rider.distanceCoveredMeters - candidate.distanceCoveredMeters;
        return gapBehindAttackerMeters >= 0 && gapBehindAttackerMeters <= 150;
      });
    const counterRiderIds = resolveCounterAttackStarterIds(nearbyCounterFavorites, rider.rider.id, activeAttackerIds);
    const counterRiders: Array<{ riderName: string; riderTeamId: number | null }> = [];
    for (const counterRiderId of counterRiderIds) {
      const counterRider = this.riders.find((candidate) => candidate.rider.id === counterRiderId);
      if (!counterRider || isRiderInactive(counterRider) || this.activeStageAttacksByRiderId.has(counterRiderId)) {
        continue;
      }

      this.activeStageAttacksByRiderId.set(counterRiderId, {
        riderId: counterRiderId,
        remainingSeconds: COUNTER_ATTACK_DURATION_SECONDS,
        startedAtElapsedSeconds,
        triggerDistanceMeters: counterRider.distanceCoveredMeters,
        durationSeconds: COUNTER_ATTACK_DURATION_SECONDS,
        attackNumber: 1,
        isCounterAttack: true,
        triggeredByRiderId: rider.rider.id,
      });
      counterRider.isAttacking = true;
      counterRiders.push({
        riderName: this.formatRiderWithPreStageGc(counterRiderId, counterRider.riderName),
        riderTeamId: counterRider.rider.activeTeamId ?? null,
      });
    }

    // Push attack message for the main attacker
    this.pushMessage({
      elapsedSeconds: startedAtElapsedSeconds,
      riderId: rider.rider.id,
      riderName: rider.riderName,
      type: 'attack',
      tone: 'warning',
      title: `${this.formatRiderWithPreStageGc(rider.rider.id, rider.riderName)} attackiert`,
      detail: `Attacke ${nextAttack.attackNumber} bei ${(nextAttack.triggerDistanceMeters / 1000).toFixed(1).replace('.', ',')} km.`,
    });

    // Push counter_attack messages for each counter-attacker
    for (const counterRider of counterRiders) {
      const cRiderState = this.riders.find(r => r.riderName === counterRider.riderName);
      this.pushMessage({
        elapsedSeconds: startedAtElapsedSeconds,
        riderId: cRiderState?.rider.id ?? null,
        riderName: counterRider.riderName,
        type: 'counter_attack',
        tone: 'warning',
        title: `${counterRider.riderName} kontert (Reaktion auf ${this.formatRiderWithPreStageGc(rider.rider.id, rider.riderName)})`,
        detail: `Konterattacke bei ${(nextAttack.triggerDistanceMeters / 1000).toFixed(1).replace('.', ',')} km.`,
      });
    }
  }

  private buildClusters(ordered: RiderState[]): RiderCluster[] {
    const clusters: Array<RiderCluster & { distanceSum: number }> = [];

    for (const rider of ordered) {
      if (rider.finishStatus === 'dnf') {
        continue;
      }
      const currentCluster = clusters[clusters.length - 1];
      if (!currentCluster || Math.abs(currentCluster.distanceMeter - rider.distanceCoveredMeters) >= CLUSTER_DISTANCE_METERS) {
        clusters.push({
          riderIds: [rider.rider.id],
          riderCount: 1,
          distanceMeter: rider.distanceCoveredMeters,
          distanceSum: rider.distanceCoveredMeters,
        });
        continue;
      }

      currentCluster.riderIds.push(rider.rider.id);
      currentCluster.riderCount += 1;
      currentCluster.distanceSum += rider.distanceCoveredMeters;
      currentCluster.distanceMeter = currentCluster.distanceSum / currentCluster.riderCount;
    }

    return clusters.map(({ distanceSum: _distanceSum, ...cluster }) => cluster);
  }

  private buildTeamGroupBonusByRiderId(): TeamGroupBonusByRiderId {
    const bonusByRiderId: TeamGroupBonusByRiderId = new Map();
    const activeTeamRiders = this.riders
      .filter((rider) => !isRiderInactive(rider) && rider.rider.activeTeamId != null)
      .sort((left, right) => left.distanceCoveredMeters - right.distanceCoveredMeters || left.rider.id - right.rider.id);

    const teamCounts = new Map<number, number>();
    let startIndex = 0;
    let endIndex = 0;

    for (let index = 0; index < activeTeamRiders.length; index += 1) {
      const rider = activeTeamRiders[index];
      const currentDistanceMeters = rider.distanceCoveredMeters;

      while (
        endIndex < activeTeamRiders.length
        && (activeTeamRiders[endIndex].distanceCoveredMeters - currentDistanceMeters) < CLUSTER_DISTANCE_METERS
      ) {
        const teamId = activeTeamRiders[endIndex].rider.activeTeamId;
        if (teamId != null) {
          teamCounts.set(teamId, (teamCounts.get(teamId) ?? 0) + 1);
        }
        endIndex += 1;
      }

      while (
        startIndex < activeTeamRiders.length
        && (currentDistanceMeters - activeTeamRiders[startIndex].distanceCoveredMeters) >= CLUSTER_DISTANCE_METERS
      ) {
        const teamId = activeTeamRiders[startIndex].rider.activeTeamId;
        if (teamId != null) {
          const nextCount = (teamCounts.get(teamId) ?? 0) - 1;
          if (nextCount <= 0) {
            teamCounts.delete(teamId);
          } else {
            teamCounts.set(teamId, nextCount);
          }
        }
        startIndex += 1;
      }

      const teamId = rider.rider.activeTeamId;
      const sameTeamNearbyCount = teamId == null ? 0 : Math.max(0, (teamCounts.get(teamId) ?? 0) - 1);
      bonusByRiderId.set(
        rider.rider.id,
        sameTeamNearbyCount === 0
          ? 0
          : roundToTwoDecimals(sameTeamNearbyCount * 0.3 * this.resolveTeamBonusRoleMultiplier(rider)),
      );
    }

    return bonusByRiderId;
  }

  private resolveTeamBonusRoleMultiplier(rider: RiderState): number {
    switch (rider.rider.role?.name) {
      case 'Kapitaen':
      case 'Co-Kapitaen':
      case 'Sprinter':
        return 1;
      case 'Wassertraeger':
        return 0.1;
      default:
        return 0.5;
    }
  }

  private resolveTeamGroupBonusValue(rider: RiderState, teamGroupBonusByRiderId: TeamGroupBonusByRiderId | null): number {
    if (this.isTimeTrialMode || rider.rider.activeTeamId == null) {
      return 0;
    }

    return teamGroupBonusByRiderId?.get(rider.rider.id) ?? 0;
  }

  private resolveEffectiveSkill(input: {
    rider: RiderState;
    baseSkill: number;
    staminaPenalty: number;
    teamGroupBonus: number;
    distanceMeters: number;
    currentElevationMeters?: number;
  }): {
    effectiveSkill: number;
    staminaPenalty: number;
    elevationPenalty: number;
  } {
    const recoveryCatchupBonus = input.rider.incidentRecoverySecondsRemaining > 0 ? INCIDENT_RECOVERY_CATCHUP_BONUS : 0;
    const breakawaySkillBonus = this.resolveBreakawaySkillBonus(input.rider);
    const baseWithForm = input.baseSkill
      + resolveConditionFormBonus(input.rider.rider)
      + input.rider.dailyForm
      + input.rider.incidentRecoveryFormBonus
      + recoveryCatchupBonus
      + input.rider.microForm
      + breakawaySkillBonus
      + input.teamGroupBonus
      - input.rider.breakawayMalus;
    const skillAfterStamina = Math.max(0, baseWithForm);
    const elevationPenalty = input.distanceMeters === input.rider.distanceCoveredMeters
      ? this.resolveRiderElevationPenalty(input.rider, input.currentElevationMeters)
      : this.resolveElevationPenalty(input.rider, input.distanceMeters);

    return {
      effectiveSkill: Math.max(0, skillAfterStamina - elevationPenalty),
      staminaPenalty: input.staminaPenalty,
      elevationPenalty,
    };
  }

  private resolveStaminaPenalty(staminaSkill: number, distanceMeters: number): number {
    const clampedStageDistanceKm = clamp(this.stageDistanceMeters / 1000, STAMINA_STAGE_DISTANCE_MIN_KM, STAMINA_STAGE_DISTANCE_MAX_KM);
    const distanceDifference = this.interpolateStaminaDistanceValue(clampedStageDistanceKm);
    const clampedStaminaSkill = clamp(staminaSkill, STAMINA_SKILL_MIN, STAMINA_SKILL_MAX);
    const skillDifferenceRatio = (STAMINA_SKILL_MAX - clampedStaminaSkill) / (STAMINA_SKILL_MAX - STAMINA_SKILL_MIN);
    const staminaEndPenalty = (distanceDifference / 3) + (skillDifferenceRatio * distanceDifference);
    const progressRatio = this.stageDistanceMeters <= 0
      ? 0
      : clamp(distanceMeters / this.stageDistanceMeters, 0, 1);
    return staminaEndPenalty * (progressRatio ** 2);
  }

  private resolveRiderStaminaPenalty(rider: RiderState): number {
    const distanceKmBucket = Math.max(0, Math.floor(rider.distanceCoveredMeters / 1000));
    if (distanceKmBucket === rider.staminaPenaltyKmBucket) {
      return rider.staminaSkillPenalty;
    }

    rider.staminaPenaltyKmBucket = distanceKmBucket;
    rider.staminaSkillPenalty = this.resolveStaminaPenalty(rider.rider.skills.stamina, rider.distanceCoveredMeters);
    return rider.staminaSkillPenalty;
  }

  private interpolateStaminaDistanceValue(distanceKm: number): number {
    if (distanceKm <= STAMINA_DISTANCE_DIFF_ANCHORS[0].kmMark) {
      return STAMINA_DISTANCE_DIFF_ANCHORS[0].value;
    }

    for (let index = 0; index < STAMINA_DISTANCE_DIFF_ANCHORS.length - 1; index += 1) {
      const current = STAMINA_DISTANCE_DIFF_ANCHORS[index];
      const next = STAMINA_DISTANCE_DIFF_ANCHORS[index + 1];
      if (distanceKm <= next.kmMark) {
        const spanKm = Math.max(0.0001, next.kmMark - current.kmMark);
        const ratio = (distanceKm - current.kmMark) / spanKm;
        return current.value + ((next.value - current.value) * ratio);
      }
    }

    return STAMINA_DISTANCE_DIFF_ANCHORS[STAMINA_DISTANCE_DIFF_ANCHORS.length - 1].value;
  }

  private buildSpreadCurve(lateStageStartRatio: number): number[] {
    const totalBucketCount = Math.ceil(1 / SPREAD_BUCKET_RATIO);
    const reachBucket = Math.max(1, Math.ceil(lateStageStartRatio / SPREAD_BUCKET_RATIO));
    const startSpreadFactor = randomBetween(START_SPREAD_MIN, START_SPREAD_MAX);
    const weights = Array.from({ length: reachBucket }, () => randomBetween(0.2, 1.2));
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const factors = Array.from({ length: totalBucketCount + 1 }, () => 1);

    factors[0] = startSpreadFactor;
    let cumulativeWeight = 0;
    for (let index = 1; index <= reachBucket; index += 1) {
      cumulativeWeight += weights[index - 1] ?? 0;
      factors[index] = startSpreadFactor + ((1 - startSpreadFactor) * (cumulativeWeight / totalWeight));
    }

    return factors;
  }

  private resolveSkillSpreadFactor(distanceCoveredMeters: number, segment: ParsedStageSegment): number {
    const distanceRatio = this.stageDistanceMeters <= 0
      ? 1
      : clamp(distanceCoveredMeters / this.stageDistanceMeters, 0, 1);
    const bucketIndex = Math.min(this.spreadCurve.length - 1, Math.floor(distanceRatio / SPREAD_BUCKET_RATIO));
    const baseSpread = this.spreadCurve[bucketIndex] ?? 1;

    if (distanceRatio <= this.lateStageStartRatio) {
      return baseSpread;
    }

    const spreadConfig = resolveFinalSpreadConfig(this.simulationMode, segment.terrain, this.skillWeightConfigMap);
    const lateMultiplier = this.scaleFinalSpreadMultiplier(spreadConfig.lateMultiplier);
    const peakMultiplier = Math.max(lateMultiplier, this.scaleFinalSpreadMultiplier(spreadConfig.peakMultiplier));
    const lateProgress = clamp(
      (distanceRatio - this.lateStageStartRatio) / Math.max(0.0001, this.finalPushStartRatio - this.lateStageStartRatio),
      0,
      1,
    );
    const lateSpread = this.interpolateFinalSpread(lateMultiplier, lateProgress);

    if (lateMultiplier <= 1 && peakMultiplier <= 1) {
      return baseSpread;
    }

    if (distanceRatio < this.finalPushStartRatio || peakMultiplier <= lateMultiplier) {
      return Math.max(baseSpread, lateSpread);
    }

    const peakProgress = clamp(
      (distanceRatio - this.finalPushStartRatio) / Math.max(0.0001, 1 - this.finalPushStartRatio),
      0,
      1,
    );
    const pushedSpread = lateMultiplier + ((peakMultiplier - lateMultiplier) * peakProgress);
    return Math.max(baseSpread, pushedSpread);
  }

  private scaleFinalSpreadMultiplier(multiplier: number): number {
    return 1 + ((Math.max(0, multiplier) - 1) * this.finalSpreadDifficultyMultiplier);
  }

  private interpolateFinalSpread(targetMultiplier: number, progress: number): number {
    return 1 + ((targetMultiplier - 1) * progress);
  }

  private resolveWeightedSkillComponents(terrain: StageTerrain): WeightedSkillComponent[] {
    const cached = this.weightedSkillComponentsByTerrain.get(terrain);
    if (cached) {
      return cached;
    }

    const components = resolveSkillWeightComponents(
      this.simulationMode,
      terrain,
      this.skillWeightRuleMap,
    ).map((component) => ({ key: component.key, weight: component.weight })) satisfies WeightedSkillComponent[];
    this.weightedSkillComponentsByTerrain.set(terrain, components);
    return components;
  }

  private resolveWeightedSkill(rider: Rider, terrain: StageTerrain, staminaSkillPenalty = 0): { value: number; breakdown: string } {
    const components = this.resolveWeightedSkillComponents(terrain);

    const adjustedSkills = staminaSkillPenalty > 0 || rider.mentorBoosts
      ? { ...rider.skills }
      : rider.skills;
    if (staminaSkillPenalty > 0) {
      adjustedSkills.stamina = Math.max(0, adjustedSkills.stamina - staminaSkillPenalty);
    }
    if (rider.mentorBoosts) {
      for (const [key, val] of Object.entries(rider.mentorBoosts)) {
        if (typeof val === 'number') {
          adjustedSkills[key as RiderSkillKey] += val;
        }
      }
    }

    let totalWeight = 0;
    let weightedSum = 0;
    for (const component of components) {
      totalWeight += component.weight;
      weightedSum += adjustedSkills[component.key] * component.weight;
    }
    const value = totalWeight > 0
      ? weightedSum / totalWeight
      : resolveWeightedSkillFromSkills(adjustedSkills, this.simulationMode, terrain, this.skillWeightRuleMap);

    return {
      value,
      breakdown: this.resolveSkillBreakdown(rider, terrain, components),
    };
  }

  private resolveSkillBreakdown(rider: Rider, terrain: StageTerrain, components: WeightedSkillComponent[]): string {
    const cacheKey = `${rider.id}:${terrain}:${rider.formBonus ?? 0}:${rider.raceFormBonus ?? 0}:${rider.fatigueMalus ?? 0}:${rider.longTermFatigueMalus ?? 0}:${rider.shortTermFatigueMalus ?? 0}`;
    const cached = this.skillBreakdownCache.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const breakdown = formatSkillBreakdown(rider, components);
    this.skillBreakdownCache.set(cacheKey, breakdown);
    return breakdown;
  }

  private resolvePrimarySkillKey(skillName: TerrainSkillName): RiderSkillKey {
    switch (skillName) {
      case 'Flat':
        return 'flat';
      case 'Hill':
        return 'hill';
      case 'Medium_Mountain':
        return 'mediumMountain';
      case 'Mountain':
        return 'mountain';
      case 'Cobble':
        return 'cobble';
      case 'Sprint':
        return 'sprint';
      case 'Downhill':
        return 'downhill';
      default:
        return 'flat';
    }
  }

  private resolveElevationPenaltyFromElevation(rider: RiderState, elevationMeters: number): number {
    const combinedSkill = ((4 * rider.rider.skills.mountain) + rider.rider.skills.resistance + (2 * rider.rider.skills.stamina)) / 7;
    const skillPenaltyFactor = Math.max(0, 100 - combinedSkill) / 1000;
    const currentElevation = this.resolveElevationBucket(elevationMeters);
    return skillPenaltyFactor * ((currentElevation ** 3) / 1500 / 100000);
  }

  private resolveElevationPenalty(rider: RiderState, distanceMeters: number): number {
    return this.resolveElevationPenaltyFromElevation(rider, this.interpolateElevation(distanceMeters));
  }

  private resolveRiderElevationPenalty(rider: RiderState, currentElevationMeters?: number): number {
    const currentElevation = currentElevationMeters ?? this.interpolateElevation(rider.distanceCoveredMeters);
    const elevationHmBucket = this.resolveElevationBucket(currentElevation);
    if (elevationHmBucket === rider.elevationPenaltyHmBucket) {
      return rider.elevationPenalty;
    }

    rider.elevationPenaltyHmBucket = elevationHmBucket;
    rider.elevationPenalty = this.resolveElevationPenaltyFromElevation(rider, currentElevation);
    return rider.elevationPenalty;
  }

  private resolveSegmentElevation(segment: ParsedStageSegment, distanceMeters: number): number {
    const startMeters = segment.start_km * 1000;
    const endMeters = segment.end_km * 1000;
    const segmentSpanMeters = Math.max(0.0001, endMeters - startMeters);
    const ratio = clamp((distanceMeters - startMeters) / segmentSpanMeters, 0, 1);
    return segment.start_elevation + ((segment.end_elevation - segment.start_elevation) * ratio);
  }

  private resolveElevationBucket(elevationMeters: number): number {
    return Math.max(0, Math.floor(elevationMeters / 10) * 10);
  }

  private interpolateElevation(distanceMeters: number): number {
    const points = this.bootstrap.stageSummary.points;
    if (points.length === 0) {
      return 0;
    }

    const clampedDistanceMeters = clamp(distanceMeters, 0, this.stageDistanceMeters);
    const distanceKm = clampedDistanceMeters / 1000;

    if (distanceKm <= points[0].kmMark) {
      return points[0].elevation;
    }

    for (let index = 0; index < points.length - 1; index += 1) {
      const current = points[index];
      const next = points[index + 1];
      if (distanceKm <= next.kmMark) {
        const spanKm = Math.max(0.0001, next.kmMark - current.kmMark);
        const ratio = (distanceKm - current.kmMark) / spanKm;
        return current.elevation + ((next.elevation - current.elevation) * ratio);
      }
    }

    return points[points.length - 1].elevation;
  }

  private calculatePhotoFinishScore(rider: RiderState): number {
    this.resolveRiderStaminaPenalty(rider);
    return resolveLiveWeightProfileValue(rider, this.finishWeightProfile);
  }

  private logFinishSprintTieBreakIfNeeded(): void {
    if (this.hasLoggedFinishSprintTieBreak || this.isTimeTrialMode || !this.isFinished()) {
      return;
    }

    this.hasLoggedFinishSprintTieBreak = true;

    const finishedRiders = this.riders
      .filter(isClassifiedFinisher)
      .sort((left, right) => (left.finishTimeSeconds ?? 0) - (right.finishTimeSeconds ?? 0) || right.photoFinishScore - left.photoFinishScore || left.rider.id - right.rider.id);

    if (finishedRiders.length === 0) {
      return;
    }

    const firstFinishGroup: RiderState[] = [];
    let previousTime: number | null = null;

    for (const rider of finishedRiders) {
      const finishTime = rider.finishTimeSeconds ?? 0;
      if (firstFinishGroup.length === 0) {
        firstFinishGroup.push(rider);
        previousTime = finishTime;
        continue;
      }

      if (previousTime != null && finishTime - previousTime <= TIME_TIE_THRESHOLD_SECONDS) {
        firstFinishGroup.push(rider);
        previousTime = finishTime;
        continue;
      }

      break;
    }

    const finishContext = this.resolveFinishMarkerType();
    const climberMalusStage = this.isClimberMalusStage();
    const effectiveScore = (r: RiderState): number =>
      r.photoFinishScore;

    const orderedFirstFinishGroup = [...firstFinishGroup]
      .sort((left, right) => effectiveScore(right) - effectiveScore(left) || left.rider.id - right.rider.id);

    const leaderFinishTimeSeconds = orderedFirstFinishGroup[0]?.finishTimeSeconds ?? 0;
    const finishWeights = this.finishWeightProfile;
    const stageLabel = `Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile}`;

    console.groupCollapsed(
      `[FinishSprintTieBreak] ${stageLabel} | erste Zielgruppe (${orderedFirstFinishGroup.length} Fahrer) | Zeitfenster <= ${TIME_TIE_THRESHOLD_SECONDS.toFixed(2)} s`,
    );
    console.log(
      `[FinishSprintTieBreak] Sortierung: erst Zielzeit, dann Score (photoFinish + SpecAdjustment) absteigend, dann Fahrer-ID.`,
    );
    console.log(
      `[FinishSprintTieBreak] Kontext: ${finishContext}${climberMalusStage ? ' | Bergfahrer-Malus aktiv' : ''}`,
    );

    orderedFirstFinishGroup.forEach((rider, index) => {
      const breakdown = buildLiveWeightProfileBreakdown(rider, finishWeights)
        .map((component) => `${SKILL_SHORT_LABELS[component.skillKey]} ${component.contribution.toFixed(2)} = ${component.effectiveSkill.toFixed(2)} x ${(component.weight * 100).toFixed(0)}%`)
        .join(' | ');
      const finishTimeSeconds = rider.finishTimeSeconds ?? 0;
      const gapToLeaderSeconds = finishTimeSeconds - leaderFinishTimeSeconds;
      const timeLabel = gapToLeaderSeconds <= 0.0001
        ? `${finishTimeSeconds.toFixed(2)} s`
        : `${finishTimeSeconds.toFixed(2)} s (+${gapToLeaderSeconds.toFixed(2)} s)`;
      const skillScore = this.calculatePhotoFinishScore(rider);
      const leadoutBonus = rider.leadoutBonus ?? 0;
      const specAdj = resolveSpecializationTieBreakAdjustment(rider, finishContext, climberMalusStage);

      console.log(
        `#${index + 1} Zielsprint | ${rider.riderName} | Zeit ${timeLabel} | Score (ohne Boni): ${skillScore.toFixed(2)} -> Score (mit Boni): ${rider.photoFinishScore.toFixed(2)} [SpecAdj: ${specAdj > 0 ? '+' : ''}${specAdj.toFixed(2)}, Leadout: +${leadoutBonus.toFixed(2)}] | ID-Tiebreak ${rider.rider.id} | (${breakdown})`,
      );
    });

    console.groupEnd();
  }

  private recordIntermediateSplits(
    rider: RiderState,
    startDistanceMeters: number,
    endDistanceMeters: number,
    stepStartSeconds: number,
    speedMps: number,
  ): void {
    if (speedMps <= 0) {
      return;
    }

    while (rider.nextIntermediateIndex < this.intermediateMarkers.length) {
      const marker = this.intermediateMarkers[rider.nextIntermediateIndex];
      if (marker.distanceMeters > endDistanceMeters) {
        break;
      }
      if (marker.distanceMeters < startDistanceMeters) {
        rider.nextIntermediateIndex += 1;
        continue;
      }

      const secondsToMarker = (marker.distanceMeters - startDistanceMeters) / speedMps;
      const crossingTimeSeconds = Math.max(0, this.isTimeTrialMode
        ? stepStartSeconds + secondsToMarker - rider.startOffsetSeconds
        : stepStartSeconds + secondsToMarker);
      let photoFinishScore = this.resolveMarkerCrossingScore(rider, marker);
      const tieContext: TieBreakContext | null = marker.markerType === 'sprint_intermediate'
        ? 'sprint_intermediate'
        : marker.markerType === 'climb_top'
          ? 'climb_top'
          : null;
      if (tieContext) {
        photoFinishScore += resolveSpecializationTieBreakAdjustment(rider, tieContext, this.isClimberMalusStage(), marker.markerCategory);
      }
      rider.lastSplitLabel = marker.label;
      rider.lastSplitTimeSeconds = crossingTimeSeconds;
      rider.splitTimes[marker.key] = crossingTimeSeconds;
      rider.splitTimes[marker.label] = crossingTimeSeconds;
      rider.markerCrossings[marker.key] = {
        riderId: rider.rider.id,
        markerKey: marker.key,
        markerLabel: marker.label,
        markerType: marker.markerType,
        markerCategory: marker.markerCategory,
        kmMark: marker.distanceMeters / 1000,
        crossingTimeSeconds,
        photoFinishScore,
      };
      rider.nextIntermediateIndex += 1;
    }
  }

  private resolveMarkerCrossingScore(
    rider: RiderState,
    marker: IntermediateMarker,
  ): number {
    if (marker.markerType === 'sprint_intermediate') {
      return resolveLiveWeightProfileValue(rider, this.resolveSprintWeightProfile());
    }

    const baseScore = resolveLiveWeightProfileValue(rider, this.resolveClimbWeightProfile(marker.markerCategory));
    const markerTieBreak = resolveDeterministicRatio(`${this.bootstrap.stage.id}:${marker.key}:${rider.rider.id}`) * 25;
    return baseScore + markerTieBreak;
  }

  private resolveSprintWeightProfile(): MarkerWeightProfile {
    return this.stageScoringWeightMap.get('sprint_intermediate') ?? SPRINT_INTERMEDIATE_WEIGHTS;
  }

  private resolveClimbWeightProfile(category: StageMarkerCategory | null): MarkerWeightProfile {
    const normalized = (!category || category === 'Sprint') ? 'HC' : category;
    return this.stageScoringWeightMap.get(`climb_top|${normalized}`) ?? CLIMB_TOP_WEIGHTS[normalized];
  }

  private calculateSprintLeadoutBonus(rider: RiderState): number {
    const finishType = this.resolveFinishMarkerType();
    if (finishType !== 'finish_flat' && finishType !== 'finish_hill') {
      return 0;
    }

    const teamId = rider.rider.activeTeamId;
    if (teamId == null) {
      return 0;
    }

    // Find all team riders in the current race (starting roster)
    const teamRiders = this.riders.filter((r) => r.rider.activeTeamId === teamId);
    if (teamRiders.length === 0) {
      return 0;
    }

    const sortedSprinters = [...teamRiders].sort((a, b) => {
      const scoreA = this.calculatePhotoFinishScore(a);
      const scoreB = this.calculatePhotoFinishScore(b);
      const diff = scoreB - scoreA;
      if (diff !== 0) {
        return diff;
      }
      return a.rider.id - b.rider.id;
    });

    const bestSprinter = sortedSprinters[0];
    if (!bestSprinter || rider.rider.id !== bestSprinter.rider.id) {
      return 0;
    }

    if (bestSprinter.rider.skills.sprint <= 73) {
      return 0;
    }

    // Count teammates (not DNF, OTL, or DNS) who have Sprint Skill >= 72
    const teammatesWithSprintCount = teamRiders.filter(
      (r) => r.rider.id !== bestSprinter.rider.id &&
             r.finishStatus !== 'dnf' &&
             (r.finishStatus as string) !== 'otl' &&
             (r.finishStatus as string) !== 'dns' &&
             r.rider.skills.sprint >= 72
    ).length;

    if (teammatesWithSprintCount === 0) {
      return 0;
    }

    let teamRand = this.teamSprintRandomValues.get(teamId);
    if (teamRand === undefined) {
      teamRand = randomBetween(0.25, 0.6);
      this.teamSprintRandomValues.set(teamId, teamRand);
    }

    return teammatesWithSprintCount * teamRand;
  }

  private resolveFinishMarkerType(): 'finish_flat' | 'finish_hill' | 'finish_mountain' {
    const markers = collectStageBoundaryMarkers(this.bootstrap.stageSummary);
    for (let index = markers.length - 1; index >= 0; index -= 1) {
      const type = markers[index].marker.type;
      if (type === 'finish_flat' || type === 'finish_hill' || type === 'finish_mountain') {
        return type;
      }
    }

    switch (this.bootstrap.stage.profile) {
      case 'Hilly':
      case 'Hilly_Difficult':
      case 'Rolling':
      case 'Cobble_Hill':
        return 'finish_hill';
      case 'Medium_Mountain':
      case 'Mountain':
      case 'High_Mountain':
        return 'finish_mountain';
      default:
        return 'finish_flat';
    }
  }

  private resolveFinishWeightProfile(): MarkerWeightProfile {
    const finishType = this.resolveFinishMarkerType();
    const ruleWeights = this.stageScoringWeightMap.get(finishType);
    if (ruleWeights) {
      return ruleWeights;
    }

    switch (finishType) {
      case 'finish_hill':
        return FINISH_HILL_WEIGHTS;
      case 'finish_mountain':
        return FINISH_MOUNTAIN_WEIGHTS;
      default:
        return FINISH_FLAT_WEIGHTS;
    }
  }

  private resolveRiderClockSeconds(rider: RiderState): number | null {
    if (isClassifiedFinisher(rider)) {
      const finishTimeSeconds = rider.finishTimeSeconds;
      if (finishTimeSeconds == null || !Number.isFinite(finishTimeSeconds)) {
        return null;
      }
      return Math.max(0, finishTimeSeconds - rider.startOffsetSeconds);
    }
    if (rider.finishStatus === 'dnf') {
      return null;
    }
    if (!this.isTimeTrialMode) {
      return this.elapsedSeconds;
    }
    if (!rider.hasStarted) {
      return null;
    }
    return Math.max(0, this.elapsedSeconds - rider.startOffsetSeconds);
  }

  private applyIncident(
    rider: RiderState,
    incident: PrecalculatedRaceIncident,
    eventTimeSeconds: number,
    isMassCrash = false
  ): void {
    rider.pendingIncident = null;
    rider.appliedIncident = incident;
    rider.incidentDelaySecondsRemaining = incident.waitDurationSeconds;
    rider.incidentRecoverySecondsRemaining = incident.recoverySeconds;
    rider.incidentRecoveryFormBonus = incident.recoveryFormBonus;
    rider.dailyForm += incident.dayFormPenalty;
    rider.incidentStaminaPenalty += incident.staminaPenalty;
    rider.statusReason = incident.type === 'crash'
      ? `crash:${incident.severity ?? 'unknown'}${incident.hasAdditionalMechanical ? '+mechanical' : ''}`
      : 'mechanical';
    if (rider.dailyFormCap != null) {
      rider.dailyForm = Math.min(rider.dailyForm, rider.dailyFormCap);
    }

    if (incident.type === 'crash') {
      if (incident.severity === 'medium') {
        rider.dailyForm = Math.min(0, rider.dailyForm - 3);
        rider.microForm -= 3;
        rider.dailyFormCap = 0;
      }
      if (incident.severity === 'light') {
        rider.dailyForm += 0;
      }
      if (incident.severity === 'severe') {
        rider.finishStatus = 'dnf';
        rider.finishTimeSeconds = null;
        rider.currentSpeedMps = 0;
        rider.tempSpeedMps = 0;
        rider.nextDistanceCoveredMeters = null;
        rider.isAttacking = false;
        rider.isLeadingGroup = false;
        this.activeStageAttacksByRiderId.delete(rider.rider.id);
        rider.incidentDelaySecondsRemaining = 0;
        rider.incidentRecoverySecondsRemaining = 0;
        rider.incidentRecoveryFormBonus = 0;
      }
    }

    if (rider.rider.role?.name === 'Kapitaen' && incident.supportRiderIds.length > 0 && incident.severity !== 'severe') {
      for (const supportRiderId of incident.supportRiderIds) {
        const supportRider = this.riders.find((candidate) => candidate.rider.id === supportRiderId);
        if (!supportRider) {
          continue;
        }
        supportRider.waitingForCaptainId = rider.rider.id;
        supportRider.waitForCaptainRecovery = true;
        supportRider.waitLogged = false;
      }
    }

    if (incident.isMassCrashTrigger && incident.massCrashPotentialRiderIds) {
      isMassCrash = true;
      const actuallyCrashedRiders: number[] = [];
      for (const victimId of incident.massCrashPotentialRiderIds) {
        const victimState = this.riders.find(r => r.rider.id === victimId);
        if (!victimState || isRiderInactive(victimState)) continue;
        
        const distanceDiff = Math.abs(victimState.distanceCoveredMeters - rider.distanceCoveredMeters);
        if (distanceDiff <= 50) {
          actuallyCrashedRiders.push(victimId);
          const victimIncident = buildDynamicCrashIncident(
            victimState.rider, 
            this.bootstrap.riders, 
            incident.triggerDistanceKm, 
            this.bootstrap.stageSummary.distanceKm
          );
          
          this.applyIncident(victimState, victimIncident, eventTimeSeconds, true);
        }
      }
      console.log(`[RaceIncidents] Massensturz ausgelöst durch Fahrer ${rider.rider.id} bei Km ${incident.triggerDistanceKm}. Tatsächlich verwickelte Fahrer (${actuallyCrashedRiders.length}):`, actuallyCrashedRiders);
    }

    this.pushMessage({
      elapsedSeconds: eventTimeSeconds,
      riderId: rider.rider.id,
      riderName: rider.riderName,
      type: 'incident',
      tone: incident.type === 'crash' ? 'danger' : 'warning',
      title: isMassCrash
        ? (incident.isMassCrashTrigger
          ? `Massensturz (Auslöser): ${this.formatRiderWithPreStageGc(rider.rider.id, rider.riderName)} stürzt`
          : `Massensturz (involviert): ${this.formatRiderWithPreStageGc(rider.rider.id, rider.riderName)} stürzt`)
        : (incident.type === 'crash'
          ? `${this.formatRiderWithPreStageGc(rider.rider.id, rider.riderName)} stürzt`
          : `${this.formatRiderWithPreStageGc(rider.rider.id, rider.riderName)} hat einen Defekt`),
      detail: incident.type === 'crash'
        ? (() => {
            let severityLabel = 'Low';
            let consequenceLabel = 'Regenerationsmalus auf den nächsten Etappen (-10, -5, -2 Form)';
            if (incident.severity === 'medium') {
              severityLabel = 'Middle';
              consequenceLabel = 'Frischeverlust (-15 Frische) und verringerte Tagesform für den Rest der Etappe';
            } else if (incident.severity === 'severe') {
              severityLabel = 'High';
              consequenceLabel = 'Fahrer musste die Etappe beenden (DNF)';
            }
            return `Auswirkung: ${severityLabel} · Folge: ${consequenceLabel} · Wartezeit: ${incident.waitDurationSeconds}s`;
          })()
        : `Wartezeit: ${incident.waitDurationSeconds}s`,
    });

    if (incident.type === 'crash' && incident.severity === 'severe') {
      this.pushMessage({
        elapsedSeconds: eventTimeSeconds,
        riderId: rider.rider.id,
        riderName: rider.riderName,
        type: 'dnf',
        tone: 'danger',
        title: isMassCrash
          ? `Massensturz (Folge): ${this.formatRiderWithPreStageGc(rider.rider.id, rider.riderName)} ist ausgeschieden`
          : `${this.formatRiderWithPreStageGc(rider.rider.id, rider.riderName)} ist ausgeschieden`,
        detail: `Schwerer Sturz bei km ${incident.triggerDistanceKm.toFixed(2)}.`,
      });
    }

    console.log('[RaceIncidents] Trigger', {
      rider: rider.riderName,
      type: incident.type,
      severity: incident.severity,
      kmMark: incident.triggerDistanceKm,
      waitDurationSeconds: incident.waitDurationSeconds,
      eventTimeSeconds,
      supportRiderIds: incident.supportRiderIds,
    });
  }

  private applyCaptainWaitLogic(rider: RiderState): void {
    if (rider.waitingForCaptainId == null) {
      return;
    }

    const captain = this.riders.find((candidate) => candidate.rider.id === rider.waitingForCaptainId) ?? null;
    if (!captain || captain.finishStatus === 'dnf') {
      rider.waitingForCaptainId = null;
      rider.waitForCaptainRecovery = false;
      rider.waitLogged = false;
      return;
    }

    if (rider.waitForCaptainRecovery && (captain.incidentDelaySecondsRemaining > 0 || captain.incidentRecoverySecondsRemaining > 0)) {
      return;
    }
    rider.waitForCaptainRecovery = false;

    if (rider.distanceCoveredMeters > captain.distanceCoveredMeters + CLUSTER_DISTANCE_METERS) {
      rider.currentSpeedMps = 0;
      rider.nextDistanceCoveredMeters = rider.distanceCoveredMeters;
      if (!rider.waitLogged) {
        this.pushMessage({
          elapsedSeconds: this.elapsedSeconds,
          riderId: rider.rider.id,
          riderName: rider.riderName,
          type: 'support_wait',
          tone: 'neutral',
          title: `${this.formatRiderWithPreStageGc(rider.rider.id, rider.riderName)} wartet auf ${this.formatRiderWithPreStageGc(captain.rider.id, captain.riderName)}`,
          detail: 'Helfer nimmt Tempo raus, bis der Kapitän wieder anschließt.',
        });
        console.log('[RaceIncidents] Helfer wartet', {
          helper: rider.riderName,
          captain: captain.riderName,
        });
        rider.waitLogged = true;
      }
      return;
    }

    if (rider.waitLogged) {
      this.pushMessage({
        elapsedSeconds: this.elapsedSeconds,
        riderId: rider.rider.id,
        riderName: rider.riderName,
        type: 'support_resume',
        tone: 'neutral',
        title: `${this.formatRiderWithPreStageGc(rider.rider.id, rider.riderName)} ist wieder beim Kapitän`,
        detail: `${this.formatRiderWithPreStageGc(captain.rider.id, captain.riderName)} hat den Helfer wieder erreicht.`,
      });
    }

    rider.waitingForCaptainId = null;
    rider.waitForCaptainRecovery = false;
    rider.waitLogged = false;
  }
}