import type {
  ParsedStageSegment,
  RealtimeSimulationBootstrap,
  Rider,
  RiderSkillKey,
  Stage,
  StageMarkerCategory,
  StageMarkerClassification,
  StageMarkerClassificationEntry,
  StageMarkerType,
  StageTerrain,
} from '../../../shared/types';
import { buildSkillWeightRuleMap, resolveSkillWeightComponents, resolveSkillWeightSimulationMode, resolveTttTerrainSpeedMultiplier, resolveWeightedSkillFromSkills } from './skillWeights';
import { collectStageBoundaryMarkers } from './stageSummary';

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
  isLeadingGroup: boolean;
  isFinished: boolean;
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
  isLeadingGroup: boolean;
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
const DRAFT_BONUS_SCALE = 2 / 3;
const DRAFT_PACK_SOFT_CAP_START = 10;
const DRAFT_PACK_HARD_CAP_SIZE = 50;
const DRAFT_FRONT_NO_BONUS_GROUP_SIZE = 25;

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
  return (rider.formBonus ?? 0) + (rider.raceFormBonus ?? 0) - (rider.fatigueMalus ?? 0);
}

function formatSkillBreakdown(rider: Rider, components: WeightedSkillComponent[]): string {
  if (components.length === 0) {
    return '';
  }

  const totalWeight = components.reduce((sum, component) => sum + component.weight, 0);
  return components.map((component) => {
    const skillValue = rider.skills[component.key];
    const weightPercent = Math.round((component.weight / totalWeight) * 100);
    return `${SKILL_SHORT_LABELS[component.key]} ${Math.round(skillValue)} (${weightPercent}%)`;
  }).join(' · ');
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
  if (left.distanceCoveredMeters !== right.distanceCoveredMeters) {
    return right.distanceCoveredMeters - left.distanceCoveredMeters;
  }

  if (left.finishTimeSeconds != null && right.finishTimeSeconds != null) {
    return left.finishTimeSeconds - right.finishTimeSeconds || right.photoFinishScore - left.photoFinishScore || left.rider.id - right.rider.id;
  }

  if (left.finishTimeSeconds != null) return -1;
  if (right.finishTimeSeconds != null) return 1;
  return left.rider.id - right.rider.id;
}

function compareDraftOrder(left: RiderState, right: RiderState): number {
  const distanceDelta = right.distanceCoveredMeters - left.distanceCoveredMeters;
  if (Math.abs(distanceDelta) >= 0.1) {
    return distanceDelta;
  }

  if (left.tempSpeedMps !== right.tempSpeedMps) {
    return right.tempSpeedMps - left.tempSpeedMps;
  }

  if (left.finishTimeSeconds != null && right.finishTimeSeconds != null) {
    return left.finishTimeSeconds - right.finishTimeSeconds || left.rider.id - right.rider.id;
  }

  if (left.finishTimeSeconds != null) return -1;
  if (right.finishTimeSeconds != null) return 1;
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

    const effectiveSkill = Math.max(
      0,
      rider.rider.skills[skillKey as RiderSkillKey] + formBonus + rider.dailyForm + rider.microForm + rider.teamGroupBonus - rider.staminaPenalty,
    );
    return sum + (effectiveSkill * weight);
  }, 0);
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

  private readonly isIndividualTimeTrial: boolean;

  private readonly isTeamTimeTrial: boolean;

  private readonly isTimeTrialMode: boolean;

  private readonly riders: RiderState[];

  private readonly windZones: WindZone[];

  private readonly intermediateMarkers: IntermediateMarker[];

  private readonly lateStageStartRatio: number;

  private readonly spreadCurve: number[];

  private readonly skillWeightRuleMap: Map<string, Partial<Record<RiderSkillKey, number>>>;

  private elapsedSeconds = 0;

  constructor(private readonly bootstrap: RealtimeSimulationBootstrap) {
    this.stageDistanceMeters = bootstrap.stageSummary.distanceKm * 1000;
    this.isIndividualTimeTrial = bootstrap.stage.profile === 'ITT';
    this.isTeamTimeTrial = bootstrap.stage.profile === 'TTT';
    this.isTimeTrialMode = this.isIndividualTimeTrial || this.isTeamTimeTrial;
    this.skillWeightRuleMap = buildSkillWeightRuleMap(bootstrap.skillWeightRules ?? []);
    this.windZones = createWindZones(this.stageDistanceMeters);
    this.intermediateMarkers = this.buildIntermediateMarkers();
    this.lateStageStartRatio = randomBetween(LATE_STAGE_START_MIN, LATE_STAGE_START_MAX);
    this.spreadCurve = this.buildSpreadCurve(this.lateStageStartRatio);
    const riderStates: RiderState[] = bootstrap.riders.map((rider) => ({
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
      isLeadingGroup: !this.isTimeTrialMode,
    }));

    const orderedRiders = this.resolveStartOrder(riderStates);
    const teamStartIndexByTeamId = new Map((this.bootstrap.teamStartOrder ?? []).map((teamId, index) => [teamId, index]));
    this.riders = orderedRiders.map((rider, index) => ({
      ...rider,
      startOffsetSeconds: this.resolveStartOffsetSeconds(rider, index, teamStartIndexByTeamId),
    }));

    this.riders.forEach((rider) => this.syncRiderTelemetry(rider));
  }

  public step(deltaSeconds: number): SimulationFrameSnapshot {
    if (deltaSeconds <= 0 || this.isFinished()) {
      return this.getFrameSnapshot();
    }

    let remainingSeconds = deltaSeconds;
    while (remainingSeconds > 0 && !this.isFinished()) {
      const substepSeconds = Math.min(remainingSeconds, MAX_SUBSTEP_SECONDS);
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
        hasStarted: rider.hasStarted || rider.finishTimeSeconds != null,
        distanceCoveredMeters: rider.distanceCoveredMeters,
        gapToLeaderMeters: Math.max(0, frameSnapshot.leaderDistanceMeters - rider.distanceCoveredMeters),
        segmentStartKm: rider.segmentStartKm,
        segmentEndKm: rider.segmentEndKm,
        segmentStartElevation: rider.segmentStartElevation,
        segmentEndElevation: rider.segmentEndElevation,
        activeTerrain: rider.finishTimeSeconds != null ? 'Finish' : rider.activeTerrain,
        skillName: rider.finishTimeSeconds != null ? 'Finish' : rider.skillName,
        skillBreakdown: rider.finishTimeSeconds != null ? '' : rider.skillBreakdown,
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
        finishTimeSeconds: rider.finishTimeSeconds,
        isLeadingGroup: rider.isLeadingGroup,
        isFinished: rider.finishTimeSeconds != null,
      })),
      markerClassifications: this.buildMarkerClassifications(ordered),
    };
  }

  private buildMarkerClassifications(ordered: RiderState[]): StageMarkerClassification[] {
    return this.intermediateMarkers.map((marker) => {
      const markerEntries = ordered
        .map((rider) => rider.markerCrossings[marker.key] ?? null)
        .filter((entry): entry is MarkerCrossing => entry != null)
        .sort((left, right) => left.crossingTimeSeconds - right.crossingTimeSeconds || right.photoFinishScore - left.photoFinishScore || left.riderId - right.riderId);

      const leaderTime = markerEntries[0]?.crossingTimeSeconds ?? 0;
      const entries: StageMarkerClassificationEntry[] = markerEntries.map((entry, index) => ({
        riderId: entry.riderId,
        rank: index + 1,
        crossingTimeSeconds: entry.crossingTimeSeconds,
        gapSeconds: Math.max(0, entry.crossingTimeSeconds - leaderTime),
        photoFinishScore: entry.photoFinishScore,
      }));

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
    const ordered = [...this.riders].sort(compareRiders);
    return ordered;
  }

  private buildFrameSnapshot(ordered: RiderState[]): SimulationFrameSnapshot {
    const leaderDistanceMeters = ordered[0]?.distanceCoveredMeters ?? 0;
    let finishedRiders = 0;

    for (const rider of ordered) {
      if (rider.finishTimeSeconds != null) {
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
    return this.riders.every((rider) => rider.finishTimeSeconds != null);
  }

  private advanceSubstep(deltaSeconds: number): void {
    const stepStartSeconds = this.elapsedSeconds;
    const stepEndSeconds = stepStartSeconds + deltaSeconds;
    const currentTeamGroupBonusByRiderId = this.isTimeTrialMode ? null : this.buildTeamGroupBonusByRiderId();

    for (const rider of this.riders) {
      if (rider.finishTimeSeconds != null) {
        rider.nextDistanceCoveredMeters = null;
        rider.tempSpeedMps = 0;
        rider.draftModifier = 1;
        rider.draftNearbyRiderCount = 0;
        rider.draftPackFactor = 0;
        rider.currentSpeedMps = 0;
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
        rider.isLeadingGroup = false;
        rider.activeTerrain = 'Finish';
        rider.skillName = 'Finish';
        rider.skillBreakdown = '';
        rider.photoFinishScore = this.calculatePhotoFinishScore(rider);
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
      rider.isLeadingGroup = !this.isTimeTrialMode;
      rider.nextDistanceCoveredMeters = null;
      rider.nextDistanceCoveredMeters = rider.distanceCoveredMeters + (rider.currentSpeedMps * activeDeltaSeconds);
    }

    if (this.isTeamTimeTrial) {
      this.applyTeamTimeTrialTempo(stepStartSeconds, stepEndSeconds);
    } else if (!this.isTimeTrialMode) {
      const ordered = [...this.riders].sort(compareDraftOrder);
      for (let index = 0; index < ordered.length; index += 1) {
        const rider = ordered[index];
        if (rider.finishTimeSeconds != null) {
          continue;
        }

        const refV = rider.tempSpeedMps / 14;
        const dFull = Math.max(5, 50 * refV);
        const dZero = Math.max(15, 150 * refV);
        const draftGroupWindow = resolveDraftGroupWindow(ordered, index, dZero);
        const draftGroupSize = draftGroupWindow.size;
        const draftPackFactor = resolveDraftPackFactor(draftGroupSize);
        const riderIsInFrontNoDraftZone = isFrontOfLargeDraftGroup(draftGroupSize, draftGroupWindow.positionInGroup);
        let ridersInZoneCount = 0;
        let closestGapMeters = Number.POSITIVE_INFINITY;
        let closestRider: RiderState | null = null;

        for (let candidateIndex = 0; candidateIndex < index; candidateIndex += 1) {
          const candidate = ordered[candidateIndex];
          const gapMeters = candidate.distanceCoveredMeters - rider.distanceCoveredMeters;
          if (gapMeters <= 0 || gapMeters >= dZero) {
            continue;
          }

          ridersInZoneCount += 1;
          if (gapMeters < closestGapMeters) {
            closestGapMeters = gapMeters;
            closestRider = candidate;
          }
        }

        if (ridersInZoneCount === 0 || !closestRider) {
          rider.draftModifier = 1;
          rider.draftNearbyRiderCount = 0;
          rider.draftPackFactor = 0;
          rider.currentSpeedMps = rider.tempSpeedMps;
          rider.nextDistanceCoveredMeters = rider.distanceCoveredMeters + (rider.currentSpeedMps * deltaSeconds);
          rider.isLeadingGroup = true;
          continue;
        }

        const targetFinalSpeed = closestRider.finishTimeSeconds != null
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
        const segment = this.currentSegment(rider);
        const gradientPercent = clamp(segment?.gradient_percent ?? 0, -20, 20);
        const draftRetentionFactor = resolveDraftRetentionFactor(gradientPercent);
        const adjustedDraftBonus = riderIsInFrontNoDraftZone
          ? 0
          : (maxBonus * fDist * draftPackFactor) * draftRetentionFactor;
        const draftModifier = 1 + adjustedDraftBonus;
        const draftedSpeed = rider.tempSpeedMps * draftModifier;

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
            continue;
          }

          rider.currentSpeedMps = Math.min(draftedSpeed, targetFinalSpeed + 2.0);
          rider.nextDistanceCoveredMeters = rider.distanceCoveredMeters + (rider.currentSpeedMps * deltaSeconds);
          continue;
        }

        rider.currentSpeedMps = draftedSpeed;
        rider.nextDistanceCoveredMeters = rider.distanceCoveredMeters + (rider.currentSpeedMps * deltaSeconds);
      }
    }

    const nextTeamGroupBonusByRiderId = this.isTimeTrialMode ? null : this.buildTeamGroupBonusByRiderId();

    for (const rider of this.riders) {
      if (rider.finishTimeSeconds != null) {
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
      const remainingMeters = this.stageDistanceMeters - rider.distanceCoveredMeters;
      const travelMeters = Math.max(0, targetDistance - rider.distanceCoveredMeters);

      if (travelMeters >= remainingMeters) {
        const finishSeconds = remainingMeters / rider.currentSpeedMps;
        rider.distanceCoveredMeters = this.stageDistanceMeters;
        this.recordIntermediateSplits(rider, previousDistance, rider.distanceCoveredMeters, activeStepStartSeconds, rider.currentSpeedMps);
        rider.finishTimeSeconds = activeStepStartSeconds + finishSeconds;
        rider.currentSpeedMps = 0;
      } else {
        rider.distanceCoveredMeters = targetDistance;
        this.recordIntermediateSplits(rider, previousDistance, rider.distanceCoveredMeters, activeStepStartSeconds, rider.currentSpeedMps);
      }

      rider.nextDistanceCoveredMeters = null;

      while (rider.finishTimeSeconds == null && rider.distanceCoveredMeters >= rider.nextFormUpdateMeter) {
        rider.microForm = sampleMicroForm();
        rider.nextFormUpdateMeter += randomBetween(5000, 40000);
      }

      this.advanceIndexForDistance(rider);
      this.syncRiderTelemetry(rider, nextTeamGroupBonusByRiderId);
    }

    this.elapsedSeconds += deltaSeconds;
  }

  private applyTeamTimeTrialTempo(stepStartSeconds: number, stepEndSeconds: number): void {
    const activeRidersByTeamId = new Map<number, RiderState[]>();

    for (const rider of this.riders) {
      if (rider.finishTimeSeconds != null || rider.rider.activeTeamId == null) {
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
      const weightedSkill = this.resolveWeightedSkill(rider.rider, segment.terrain).value;
      const segmentCenterMeter = ((segment.start_km + segment.end_km) / 2) * 1000;
      const { effectiveSkill } = this.resolveEffectiveSkill({
        rider,
        baseSkill: weightedSkill,
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
      .filter(({ marker }) => marker.type === 'sprint_intermediate' || marker.type === 'climb_top')
      .map(({ key, label, marker, kmMark }) => ({
        key,
        distanceMeters: kmMark * 1000,
        label,
        markerType: marker.type,
        markerCategory: marker.cat,
      }))
      .sort((left, right) => left.distanceMeters - right.distanceMeters);
  }

  private calculateBasePhysics(rider: RiderState, segment: ParsedStageSegment, windZone: WindZone): BasePhysicsResult {
    const skillName = terrainToSkillName(segment.terrain);
    const weightedSkill = this.resolveWeightedSkill(rider.rider, segment.terrain);
    const baseSkill = Math.min(85, weightedSkill.value);
    const teamGroupBonus = this.isTimeTrialMode ? 0 : rider.teamGroupBonus;
    const currentElevationMeters = this.resolveSegmentElevation(segment, rider.distanceCoveredMeters);
    const { effectiveSkill, staminaPenalty, elevationPenalty } = this.resolveEffectiveSkill({
      rider,
      baseSkill,
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
    const baseSpeedKph = 40 + ((effectiveSkill - 50) * speedSkillFactor * spreadFactor);
    const baseSpeedMps = baseSpeedKph / 3.6;
    return Math.max(0.5, baseSpeedMps * gradientModifier * windModifier);
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
    if (!segment || !windZone) {
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
      rider.elevationPenalty = 0;
      rider.gradientPercent = 0;
      rider.gradientModifier = 1;
      rider.windModifier = 1;
      rider.draftModifier = 1;
      rider.draftNearbyRiderCount = 0;
      rider.draftPackFactor = 0;
      rider.currentSpeedMps = 0;
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
    rider.skillBreakdown = basePhysics.skillBreakdown;
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
  }

  private buildClusters(ordered: RiderState[]): RiderCluster[] {
    const clusters: Array<RiderCluster & { distanceSum: number }> = [];

    for (const rider of ordered) {
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
      .filter((rider) => rider.finishTimeSeconds == null && rider.rider.activeTeamId != null)
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
        sameTeamNearbyCount === 0 ? -0.5 : roundToTwoDecimals(sameTeamNearbyCount * 0.3),
      );
    }

    return bonusByRiderId;
  }

  private resolveTeamGroupBonusValue(rider: RiderState, teamGroupBonusByRiderId: TeamGroupBonusByRiderId | null): number {
    if (this.isTimeTrialMode || rider.rider.activeTeamId == null) {
      return 0;
    }

    return teamGroupBonusByRiderId?.get(rider.rider.id) ?? -0.5;
  }

  private resolveEffectiveSkill(input: {
    rider: RiderState;
    baseSkill: number;
    teamGroupBonus: number;
    distanceMeters: number;
    currentElevationMeters?: number;
  }): {
    effectiveSkill: number;
    staminaPenalty: number;
    elevationPenalty: number;
  } {
    const baseWithForm = input.baseSkill
      + resolveConditionFormBonus(input.rider.rider)
      + input.rider.dailyForm
      + input.rider.microForm
      + input.teamGroupBonus;
    const staminaPenalty = input.distanceMeters === input.rider.distanceCoveredMeters
      ? this.resolveRiderStaminaPenalty(input.rider)
      : this.resolveStaminaPenalty(input.rider.rider.skills.stamina, input.distanceMeters);
    const skillAfterStamina = Math.max(0, baseWithForm - staminaPenalty);
    const elevationPenalty = input.distanceMeters === input.rider.distanceCoveredMeters
      ? this.resolveRiderElevationPenalty(input.rider, input.currentElevationMeters)
      : this.resolveElevationPenalty(input.rider, input.distanceMeters);

    return {
      effectiveSkill: Math.max(0, skillAfterStamina - elevationPenalty),
      staminaPenalty,
      elevationPenalty,
    };
  }

  private resolveStaminaPenalty(staminaSkill: number, distanceMeters: number): number {
    const distanceKmBucket = Math.max(0, Math.floor(distanceMeters / 1000));
    return ((100 - staminaSkill) / 5000) * ((distanceKmBucket ** 2) / 100);
  }

  private resolveRiderStaminaPenalty(rider: RiderState): number {
    const distanceKmBucket = Math.max(0, Math.floor(rider.distanceCoveredMeters / 1000));
    if (distanceKmBucket === rider.staminaPenaltyKmBucket) {
      return rider.staminaPenalty;
    }

    rider.staminaPenaltyKmBucket = distanceKmBucket;
    rider.staminaPenalty = this.resolveStaminaPenalty(rider.rider.skills.stamina, rider.distanceCoveredMeters);
    return rider.staminaPenalty;
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

    const lateProgress = clamp((distanceRatio - this.lateStageStartRatio) / Math.max(0.0001, 1 - this.lateStageStartRatio), 0, 1);
    const remainingMeters = Math.max(0, this.stageDistanceMeters - distanceCoveredMeters);

    if (segment.terrain === 'Hill') {
      const hillSpread = 1 + (0.1 * lateProgress);
      if (remainingMeters > 3000) {
        return Math.max(baseSpread, hillSpread);
      }

      const ratioAtThreeKm = this.stageDistanceMeters <= 3000
        ? this.lateStageStartRatio
        : clamp((this.stageDistanceMeters - 3000) / this.stageDistanceMeters, this.lateStageStartRatio, 1);
      const lateProgressAtThreeKm = clamp((ratioAtThreeKm - this.lateStageStartRatio) / Math.max(0.0001, 1 - this.lateStageStartRatio), 0, 1);
      const spreadAtThreeKm = 1 + (0.1 * lateProgressAtThreeKm);
      const finalKickProgress = 1 - (remainingMeters / 3000);
      return Math.max(baseSpread, spreadAtThreeKm + ((1.6 - spreadAtThreeKm) * finalKickProgress));
    }

    if (segment.terrain === 'Medium_Mountain' || segment.terrain === 'Mountain' || segment.terrain === 'High_Mountain') {
      const mountainSpread = 1 + (0.6 * lateProgress);
      if (distanceRatio < 0.9) {
        return Math.max(baseSpread, mountainSpread);
      }

      const ratioAtNinetyPercent = clamp(0.9, this.lateStageStartRatio, 1);
      const lateProgressAtNinetyPercent = clamp(
        (ratioAtNinetyPercent - this.lateStageStartRatio) / Math.max(0.0001, 1 - this.lateStageStartRatio),
        0,
        1,
      );
      const spreadAtNinetyPercent = 1 + (0.6 * lateProgressAtNinetyPercent);
      const finalKickProgress = (distanceRatio - 0.9) / 0.1;
      return Math.max(baseSpread, spreadAtNinetyPercent + ((2.5 - spreadAtNinetyPercent) * finalKickProgress));
    }

    if (segment.terrain === 'Cobble' || segment.terrain === 'Cobble_Hill') {
      return Math.max(baseSpread, 1 + (0.5 * lateProgress));
    }

    return baseSpread;
  }

  private resolveWeightedSkill(rider: Rider, terrain: StageTerrain): { value: number; breakdown: string } {
    const components = resolveSkillWeightComponents(
      resolveSkillWeightSimulationMode(this.bootstrap.stage.profile),
      terrain,
      this.skillWeightRuleMap,
    ).map((component) => ({ key: component.key, weight: component.weight })) satisfies WeightedSkillComponent[];

    return {
      value: resolveWeightedSkillFromSkills(
        rider.skills,
        resolveSkillWeightSimulationMode(this.bootstrap.stage.profile),
        terrain,
        this.skillWeightRuleMap,
      ),
      breakdown: formatSkillBreakdown(rider, components),
    };
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
    return resolveLiveWeightProfileValue(rider, this.resolveFinishWeightProfile(this.bootstrap.stage.profile));
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
      const photoFinishScore = this.resolveMarkerCrossingScore(rider, marker.markerType, marker.markerCategory);
      rider.lastSplitLabel = marker.label;
      rider.lastSplitTimeSeconds = crossingTimeSeconds;
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
    markerType: StageMarkerType,
    markerCategory: StageMarkerCategory | null,
  ): number {
    if (markerType === 'sprint_intermediate') {
      return resolveLiveWeightProfileValue(rider, SPRINT_INTERMEDIATE_WEIGHTS);
    }

    return resolveLiveWeightProfileValue(rider, this.resolveClimbWeightProfile(markerCategory));
  }

  private resolveClimbWeightProfile(category: StageMarkerCategory | null): MarkerWeightProfile {
    if (!category || category === 'Sprint') {
      return CLIMB_TOP_WEIGHTS.HC;
    }

    return CLIMB_TOP_WEIGHTS[category];
  }

  private resolveFinishWeightProfile(stageProfile: Stage['profile']): MarkerWeightProfile {
    switch (stageProfile) {
      case 'Hilly':
      case 'Hilly_Difficult':
      case 'Rolling':
      case 'Cobble_Hill':
        return FINISH_HILL_WEIGHTS;
      case 'Medium_Mountain':
      case 'Mountain':
      case 'High_Mountain':
        return FINISH_MOUNTAIN_WEIGHTS;
      default:
        return FINISH_FLAT_WEIGHTS;
    }
  }

  private resolveRiderClockSeconds(rider: RiderState): number | null {
    if (rider.finishTimeSeconds != null) {
      return Math.max(0, rider.finishTimeSeconds - rider.startOffsetSeconds);
    }
    if (!this.isTimeTrialMode) {
      return this.elapsedSeconds;
    }
    if (!rider.hasStarted) {
      return null;
    }
    return Math.max(0, this.elapsedSeconds - rider.startOffsetSeconds);
  }
}