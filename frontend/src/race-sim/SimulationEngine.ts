import type {
  ParsedStageSegment,
  RealtimeSimulationBootstrap,
  Rider,
  RiderSkillKey,
  StageTerrain,
} from '../../../shared/types';

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
  activeTerrain: StageTerrain | 'Finish';
  skillName: TerrainSkillName | 'Finish';
  skillBreakdown: string;
  baseSkill: number;
  teamGroupBonus: number;
  effectiveSkill: number;
  staminaModifier: number;
  elevationGainModifier: number;
  dailyForm: number;
  microForm: number;
  gradientPercent: number;
  gradientModifier: number;
  windModifier: number;
  draftModifier: number;
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
  riders: RealtimeRiderSnapshot[];
  clusters: RiderCluster[];
  windZones: WindZone[];
}

interface RiderState {
  rider: Rider;
  riderName: string;
  startOffsetSeconds: number;
  hasStarted: boolean;
  distanceCoveredMeters: number;
  nextDistanceCoveredMeters: number | null;
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
  staminaModifier: number;
  elevationGainModifier: number;
  gradientPercent: number;
  gradientModifier: number;
  windModifier: number;
  draftModifier: number;
  tempSpeedMps: number;
  currentSpeedMps: number;
  photoFinishScore: number;
  nextIntermediateIndex: number;
  lastSplitLabel: string | null;
  lastSplitTimeSeconds: number | null;
  splitTimes: Record<string, number>;
  isLeadingGroup: boolean;
}

interface BasePhysicsResult {
  skillName: TerrainSkillName;
  skillBreakdown: string;
  baseSkill: number;
  teamGroupBonus: number;
  effectiveSkill: number;
  staminaModifier: number;
  elevationGainModifier: number;
  gradientPercent: number;
  gradientModifier: number;
  windModifier: number;
  tempSpeedMps: number;
}

const CLUSTER_DISTANCE_METERS = 20;
const MAX_SUBSTEP_SECONDS = 1;
const ITT_START_INTERVAL_SECONDS = 120;
const SPREAD_BUCKET_RATIO = 0.025;
const START_SPREAD_MIN = 0.1;
const START_SPREAD_MAX = 0.4;
const LATE_STAGE_START_MIN = 0.6;
const LATE_STAGE_START_MAX = 0.8;

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
  distanceMeters: number;
  label: string;
}

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

export class SimulationEngine {
  private readonly stageDistanceMeters: number;

  private readonly isIndividualTimeTrial: boolean;

  private readonly riders: RiderState[];

  private readonly windZones: WindZone[];

  private readonly intermediateMarkers: IntermediateMarker[];

  private readonly lateStageStartRatio: number;

  private readonly spreadCurve: number[];

  private elapsedSeconds = 0;

  constructor(private readonly bootstrap: RealtimeSimulationBootstrap) {
    this.stageDistanceMeters = bootstrap.stageSummary.distanceKm * 1000;
    this.isIndividualTimeTrial = bootstrap.stage.profile === 'ITT';
    this.windZones = createWindZones(this.stageDistanceMeters);
    this.intermediateMarkers = this.buildIntermediateMarkers();
    this.lateStageStartRatio = randomBetween(LATE_STAGE_START_MIN, LATE_STAGE_START_MAX);
    this.spreadCurve = this.buildSpreadCurve(this.lateStageStartRatio);
    const riderStates: RiderState[] = bootstrap.riders.map((rider) => ({
      rider,
      riderName: `${rider.firstName} ${rider.lastName}`,
      startOffsetSeconds: 0,
      hasStarted: !this.isIndividualTimeTrial,
      distanceCoveredMeters: 0,
      nextDistanceCoveredMeters: null,
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
      staminaModifier: 1,
      elevationGainModifier: 1,
      gradientPercent: 0,
      gradientModifier: 1,
      windModifier: 1,
      draftModifier: 1,
      tempSpeedMps: 0,
      currentSpeedMps: 0,
      photoFinishScore: 0,
      nextIntermediateIndex: 0,
      lastSplitLabel: null,
      lastSplitTimeSeconds: null,
      splitTimes: {},
      isLeadingGroup: !this.isIndividualTimeTrial,
    }));

    const orderedRiders = this.resolveStartOrder(riderStates);
    this.riders = orderedRiders.map((rider, index) => ({
      ...rider,
      startOffsetSeconds: this.isIndividualTimeTrial ? index * ITT_START_INTERVAL_SECONDS : 0,
    }));

    this.riders.forEach((rider) => this.syncRiderTelemetry(rider));
  }

  public step(deltaSeconds: number): SimulationSnapshot {
    if (deltaSeconds <= 0 || this.isFinished()) {
      return this.getSnapshot();
    }

    let remainingSeconds = deltaSeconds;
    while (remainingSeconds > 0 && !this.isFinished()) {
      const substepSeconds = Math.min(remainingSeconds, MAX_SUBSTEP_SECONDS);
      this.advanceSubstep(substepSeconds);
      remainingSeconds -= substepSeconds;
    }

    return this.getSnapshot();
  }

  public getSnapshot(): SimulationSnapshot {
    const ordered = [...this.riders].sort(compareRiders);
    const leaderDistanceMeters = ordered[0]?.distanceCoveredMeters ?? 0;

    return {
      elapsedSeconds: this.elapsedSeconds,
      stageDistanceMeters: this.stageDistanceMeters,
      leaderDistanceMeters,
      finishedRiders: ordered.filter((rider) => rider.finishTimeSeconds != null).length,
      isFinished: this.isFinished(),
      riders: ordered.map((rider) => ({
        riderId: rider.rider.id,
        riderName: rider.riderName,
        startOffsetSeconds: rider.startOffsetSeconds,
        riderClockSeconds: this.resolveRiderClockSeconds(rider),
        hasStarted: rider.hasStarted || rider.finishTimeSeconds != null,
        distanceCoveredMeters: rider.distanceCoveredMeters,
        gapToLeaderMeters: Math.max(0, leaderDistanceMeters - rider.distanceCoveredMeters),
        activeTerrain: rider.finishTimeSeconds != null ? 'Finish' : rider.activeTerrain,
        skillName: rider.finishTimeSeconds != null ? 'Finish' : rider.skillName,
        skillBreakdown: rider.finishTimeSeconds != null ? '' : rider.skillBreakdown,
        baseSkill: rider.baseSkill,
        teamGroupBonus: rider.teamGroupBonus,
        effectiveSkill: rider.effectiveSkill,
        staminaModifier: rider.staminaModifier,
        elevationGainModifier: rider.elevationGainModifier,
        dailyForm: rider.dailyForm,
        microForm: rider.microForm,
        gradientPercent: rider.gradientPercent,
        gradientModifier: rider.gradientModifier,
        windModifier: rider.windModifier,
        draftModifier: rider.draftModifier,
        currentSpeedMps: rider.currentSpeedMps,
        photoFinishScore: rider.photoFinishScore,
        lastSplitLabel: rider.lastSplitLabel,
        lastSplitTimeSeconds: rider.lastSplitTimeSeconds,
        splitTimes: { ...rider.splitTimes },
        finishTimeSeconds: rider.finishTimeSeconds,
        isLeadingGroup: rider.isLeadingGroup,
        isFinished: rider.finishTimeSeconds != null,
      })),
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

    for (const rider of this.riders) {
      if (rider.finishTimeSeconds != null) {
        rider.nextDistanceCoveredMeters = null;
        rider.tempSpeedMps = 0;
        rider.draftModifier = 1;
        rider.currentSpeedMps = 0;
        rider.isLeadingGroup = false;
        continue;
      }

      if (this.isIndividualTimeTrial && stepEndSeconds <= rider.startOffsetSeconds) {
        rider.nextDistanceCoveredMeters = null;
        rider.tempSpeedMps = 0;
        rider.draftModifier = 1;
        rider.currentSpeedMps = 0;
        rider.teamGroupBonus = 0;
        rider.isLeadingGroup = false;
        continue;
      }

      const activeStepStartSeconds = this.isIndividualTimeTrial
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
        rider.currentSpeedMps = 0;
        rider.isLeadingGroup = false;
        rider.activeTerrain = 'Finish';
        rider.skillName = 'Finish';
        rider.skillBreakdown = '';
        rider.photoFinishScore = this.calculatePhotoFinishScore(rider);
        continue;
      }

      rider.teamGroupBonus = this.isIndividualTimeTrial ? 0 : this.calculateTeamGroupBonus(rider);
      const basePhysics = this.calculateBasePhysics(rider, segment, windZone);
      rider.activeTerrain = segment.terrain;
      rider.skillName = basePhysics.skillName;
      rider.skillBreakdown = basePhysics.skillBreakdown;
      rider.baseSkill = basePhysics.baseSkill;
      rider.teamGroupBonus = basePhysics.teamGroupBonus;
      rider.effectiveSkill = basePhysics.effectiveSkill;
      rider.staminaModifier = basePhysics.staminaModifier;
      rider.elevationGainModifier = basePhysics.elevationGainModifier;
      rider.gradientPercent = basePhysics.gradientPercent;
      rider.gradientModifier = basePhysics.gradientModifier;
      rider.windModifier = basePhysics.windModifier;
      rider.tempSpeedMps = basePhysics.tempSpeedMps;
      rider.draftModifier = 1;
      rider.currentSpeedMps = basePhysics.tempSpeedMps;
      rider.photoFinishScore = this.calculatePhotoFinishScore(rider);
      rider.isLeadingGroup = !this.isIndividualTimeTrial;
      rider.nextDistanceCoveredMeters = null;
      rider.nextDistanceCoveredMeters = rider.distanceCoveredMeters + (rider.currentSpeedMps * activeDeltaSeconds);
    }

    if (!this.isIndividualTimeTrial) {
      const ordered = [...this.riders].sort(compareDraftOrder);
      for (let index = 0; index < ordered.length; index += 1) {
        const rider = ordered[index];
        if (rider.finishTimeSeconds != null) {
          continue;
        }

        const refV = rider.tempSpeedMps / 14;
        const dFull = Math.max(5, 50 * refV);
        const dZero = Math.max(15, 150 * refV);
        const ridersInZone = ordered
          .slice(0, index)
          .map((candidate) => ({
            rider: candidate,
            gapMeters: candidate.distanceCoveredMeters - rider.distanceCoveredMeters,
          }))
          .filter((candidate) => candidate.gapMeters > 0 && candidate.gapMeters < dZero);

        if (ridersInZone.length === 0) {
          rider.draftModifier = 1;
          rider.currentSpeedMps = rider.tempSpeedMps;
          rider.nextDistanceCoveredMeters = rider.distanceCoveredMeters + (rider.currentSpeedMps * deltaSeconds);
          rider.isLeadingGroup = true;
          continue;
        }

        const target = ridersInZone.reduce((closest, candidate) => (
          candidate.gapMeters < closest.gapMeters ? candidate : closest
        ));

        const targetFinalSpeed = target.rider.finishTimeSeconds != null
          ? target.rider.tempSpeedMps
          : target.rider.currentSpeedMps;

        const dist = target.gapMeters;
        const fDist = dist <= dFull
          ? 1
          : 1 - ((dist - dFull) / Math.max(0.0001, dZero - dFull));
        const fPack = Math.min(1, 0.5 + (ridersInZone.length * 0.1));
        const windZone = this.currentWindZone(rider);
        const currentWindVector = windZone?.vector ?? 0;
        const currentWindSpeed = windZone?.windSpeedKph ?? 0;
        const windEffect = -currentWindVector * (currentWindSpeed / 70);
        const baseBonus = Math.max(0.30, 0.35 + (0.35 * windEffect));
        const maxBonus = baseBonus * Math.min(1, refV);
        const segment = this.currentSegment(rider);
        const gradientPercent = clamp(segment?.gradient_percent ?? 0, -20, 20);
        const adjustedDraftBonus = gradientPercent >= 2
          ? ((maxBonus * fDist * fPack) / 1.5)
          : (maxBonus * fDist * fPack);
        const draftModifier = 1 + adjustedDraftBonus;
        const draftedSpeed = rider.tempSpeedMps * draftModifier;

        rider.draftModifier = draftModifier;
        rider.isLeadingGroup = false;

        if (draftedSpeed > targetFinalSpeed) {
          if (rider.tempSpeedMps > target.rider.tempSpeedMps) {
            rider.currentSpeedMps = draftedSpeed;
            rider.nextDistanceCoveredMeters = rider.distanceCoveredMeters + (rider.currentSpeedMps * deltaSeconds);
            continue;
          }

          if (dist < 1.0) {
            rider.currentSpeedMps = targetFinalSpeed;
            rider.nextDistanceCoveredMeters = target.rider.distanceCoveredMeters + (targetFinalSpeed * deltaSeconds);
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

    for (const rider of this.riders) {
      if (rider.finishTimeSeconds != null) {
        continue;
      }

      if (this.isIndividualTimeTrial && stepEndSeconds <= rider.startOffsetSeconds) {
        continue;
      }

      const activeStepStartSeconds = this.isIndividualTimeTrial
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
      this.syncRiderTelemetry(rider);
    }

    this.elapsedSeconds += deltaSeconds;
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
      const skillName = terrainToSkillName(segment.terrain);
      const weightedSkill = this.resolveWeightedSkill(rider.rider, skillName).value;
      const effectiveSkill = weightedSkill + resolveConditionFormBonus(rider.rider) + rider.dailyForm + rider.microForm;
      const gradientPercent = clamp(segment.gradient_percent, -20, 20);
      const gradientModifier = gradientPercent > 0
        ? Math.exp(-0.11 * gradientPercent)
        : 1 - (gradientPercent * 0.06);
      const segmentCenterMeter = ((segment.start_km + segment.end_km) / 2) * 1000;
      const windZone = this.windZones.find((candidate) => segmentCenterMeter >= candidate.startMeter && segmentCenterMeter <= candidate.endMeter) ?? this.windZones[this.windZones.length - 1];
      const windModifier = windZone
        ? 1 + (windZone.vector * (windZone.windSpeedKph / 100) * 0.52)
        : 1;
      const elevationModifier = this.resolveElevationGainModifier(skillName, effectiveSkill);
      weightedScore += effectiveSkill * gradientModifier * windModifier * elevationModifier * segment.length_km;
      totalDistance += segment.length_km;
    }

    return totalDistance > 0 ? weightedScore / totalDistance : 0;
  }

  private buildIntermediateMarkers(): IntermediateMarker[] {
    return this.bootstrap.stageSummary.points
      .flatMap((point, pointIndex) => point.markers
        .filter((marker) => marker.type === 'sprint_intermediate')
        .map((marker, markerIndex) => ({
          distanceMeters: point.kmMark * 1000,
          label: marker.name ?? `SZ ${pointIndex + markerIndex + 1}`,
        })))
      .sort((left, right) => left.distanceMeters - right.distanceMeters);
  }

  private calculateBasePhysics(rider: RiderState, segment: ParsedStageSegment, windZone: WindZone): BasePhysicsResult {
    const skillName = terrainToSkillName(segment.terrain);
    const weightedSkill = this.resolveWeightedSkill(rider.rider, skillName);
    const baseSkill = Math.min(85, weightedSkill.value);
    const teamGroupBonus = this.isIndividualTimeTrial ? 0 : rider.teamGroupBonus;
    const staminaModifier = this.resolveStaminaModifier(rider);
    const preElevationEffectiveSkill = (baseSkill + resolveConditionFormBonus(rider.rider) + rider.dailyForm + rider.microForm + teamGroupBonus) * staminaModifier;
    const elevationGainModifier = this.resolveElevationGainModifier(skillName, preElevationEffectiveSkill);
    const effectiveSkill = preElevationEffectiveSkill * elevationGainModifier;
    const gradientPercent = clamp(segment.gradient_percent, -20, 20);
    const gradientModifier = gradientPercent > 0
      ? Math.exp(-0.11 * gradientPercent)
      : 1 - (gradientPercent * 0.06);
    const windModifier = 1 + (windZone.vector * (windZone.windSpeedKph / 100) * 0.52);
    const speedSkillFactor = skillName === 'Flat' ? (7 / 35) : (10 / 35);
    const spreadFactor = this.resolveSkillSpreadFactor(rider.distanceCoveredMeters, segment);
    const baseSpeedKph = 40 + ((effectiveSkill - 50) * speedSkillFactor * spreadFactor);
    const baseSpeedMps = baseSpeedKph / 3.6;

    return {
      skillName,
      skillBreakdown: weightedSkill.breakdown,
      baseSkill,
      teamGroupBonus,
      effectiveSkill,
      staminaModifier,
      elevationGainModifier,
      gradientPercent,
      gradientModifier,
      windModifier,
      tempSpeedMps: Math.max(0.5, baseSpeedMps * gradientModifier * windModifier),
    };
  }

  private syncRiderTelemetry(rider: RiderState): void {
    const segment = this.currentSegment(rider);
    const windZone = this.currentWindZone(rider);
    if (!segment || !windZone) {
      rider.activeTerrain = 'Finish';
      rider.skillName = 'Finish';
      rider.skillBreakdown = '';
      rider.baseSkill = 0;
      rider.teamGroupBonus = 0;
      rider.effectiveSkill = 0;
      rider.staminaModifier = 1;
      rider.elevationGainModifier = 1;
      rider.gradientPercent = 0;
      rider.gradientModifier = 1;
      rider.windModifier = 1;
      rider.draftModifier = 1;
      rider.currentSpeedMps = 0;
      return;
    }

    rider.teamGroupBonus = this.isIndividualTimeTrial ? 0 : this.calculateTeamGroupBonus(rider);
    const basePhysics = this.calculateBasePhysics(rider, segment, windZone);
    rider.activeTerrain = segment.terrain;
    rider.skillName = basePhysics.skillName;
    rider.skillBreakdown = basePhysics.skillBreakdown;
    rider.baseSkill = basePhysics.baseSkill;
    rider.teamGroupBonus = basePhysics.teamGroupBonus;
    rider.effectiveSkill = basePhysics.effectiveSkill;
    rider.staminaModifier = basePhysics.staminaModifier;
    rider.elevationGainModifier = basePhysics.elevationGainModifier;
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

  private calculateTeamGroupBonus(targetRider: RiderState): number {
    if (this.isIndividualTimeTrial) {
      return 0;
    }

    if (targetRider.rider.activeTeamId == null) {
      return 0;
    }

    const sameTeamNearbyCount = this.riders.filter((candidate) => (
      candidate.rider.id !== targetRider.rider.id
      && candidate.finishTimeSeconds == null
      && candidate.rider.activeTeamId === targetRider.rider.activeTeamId
      && Math.abs(candidate.distanceCoveredMeters - targetRider.distanceCoveredMeters) < CLUSTER_DISTANCE_METERS
    )).length;

    if (sameTeamNearbyCount === 0) {
      return -0.5;
    }

    return roundToTwoDecimals(sameTeamNearbyCount * 0.15);
  }

  private resolveStaminaModifier(rider: RiderState): number {
    const stageDistanceKm = this.stageDistanceMeters / 1000;
    if (stageDistanceKm <= 150) {
      return 1;
    }

    const effectiveStaminaSkill = rider.rider.skills.stamina + resolveConditionFormBonus(rider.rider) + rider.dailyForm + rider.microForm + rider.teamGroupBonus;
    const distanceFactor = 1.05 + (((stageDistanceKm - 150) / 10) * 0.01);
    return effectiveStaminaSkill / (90 * distanceFactor);
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
      return Math.max(baseSpread, spreadAtThreeKm + ((1.3 - spreadAtThreeKm) * finalKickProgress));
    }

    if (segment.terrain === 'Medium_Mountain' || segment.terrain === 'Mountain' || segment.terrain === 'High_Mountain') {
      const mountainSpread = 1 + (0.2 * lateProgress);
      const finalTenPercentBoost = distanceRatio >= 0.9
        ? ((distanceRatio - 0.9) / 0.1) * 0.2
        : 0;
      return Math.max(baseSpread, mountainSpread + finalTenPercentBoost);
    }

    if (segment.terrain === 'Cobble' || segment.terrain === 'Cobble_Hill') {
      return Math.max(baseSpread, 1 + (0.2 * lateProgress));
    }

    return baseSpread;
  }

  private resolveWeightedSkill(rider: Rider, skillName: TerrainSkillName): { value: number; breakdown: string } {
    if (!this.isIndividualTimeTrial) {
      const components: WeightedSkillComponent[] = [{ key: this.resolvePrimarySkillKey(skillName), weight: 1 }];
      return {
        value: resolveBaseSkill(rider, skillName),
        breakdown: formatSkillBreakdown(rider, components),
      };
    }

    const components: WeightedSkillComponent[] = [];

    switch (skillName) {
      case 'Flat':
      case 'Sprint':
        components.push({ key: 'timeTrial', weight: 3 }, { key: 'flat', weight: 2 }, { key: 'stamina', weight: 1 });
        break;
      case 'Hill':
        components.push({ key: 'timeTrial', weight: 3 }, { key: 'hill', weight: 2 }, { key: 'stamina', weight: 1 });
        break;
      case 'Medium_Mountain':
        components.push({ key: 'timeTrial', weight: 2 }, { key: 'mediumMountain', weight: 3 }, { key: 'stamina', weight: 1 });
        break;
      case 'Mountain':
        components.push({ key: 'timeTrial', weight: 1 }, { key: 'mountain', weight: 4 }, { key: 'stamina', weight: 1 });
        break;
      case 'Downhill':
        components.push({ key: 'timeTrial', weight: 3 }, { key: 'downhill', weight: 2 }, { key: 'flat', weight: 1 });
        break;
      case 'Cobble':
        components.push({ key: 'timeTrial', weight: 3 }, { key: 'cobble', weight: 2 }, { key: 'stamina', weight: 1 });
        break;
      default:
        return {
          value: resolveBaseSkill(rider, skillName),
          breakdown: '',
        };
    }

    const totalWeight = components.reduce((sum, component) => sum + component.weight, 0);
    const totalValue = components.reduce((sum, component) => sum + (rider.skills[component.key] * component.weight), 0);
    return {
      value: totalValue / totalWeight,
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

  private resolveElevationGainModifier(skillName: TerrainSkillName, effectiveSkill: number): number {
    if (skillName !== 'Mountain' && skillName !== 'Medium_Mountain') {
      return 1;
    }

    const elevationGainMeters = this.bootstrap.stageSummary.elevationGainMeters;
    if (elevationGainMeters < 1500) {
      return 1;
    }

    const stageLoadFactor = 1 + ((Math.min(elevationGainMeters, 3000) - 1500) / 250);
    const clampedSkill = clamp(effectiveSkill, 50, 85);
    const skillRatio = (85 - clampedSkill) / 35;
    const penaltyPerBand = 0.01 + (skillRatio * 0.02);
    return Math.max(0.5, 1 - (penaltyPerBand * stageLoadFactor));
  }

  private calculatePhotoFinishScore(rider: RiderState): number {
    const formBonus = resolveConditionFormBonus(rider.rider);
    const effectiveSprint = (rider.rider.skills.sprint + formBonus + rider.dailyForm + rider.microForm + rider.teamGroupBonus) * rider.staminaModifier;
    const effectiveAcceleration = (rider.rider.skills.acceleration + formBonus + rider.dailyForm + rider.microForm + rider.teamGroupBonus) * rider.staminaModifier;
    const effectiveFlat = (rider.rider.skills.flat + formBonus + rider.dailyForm + rider.microForm + rider.teamGroupBonus) * rider.staminaModifier;
    return (effectiveSprint * 0.6) + (effectiveAcceleration * 0.2) + (effectiveFlat * 0.2);
  }

  private recordIntermediateSplits(
    rider: RiderState,
    startDistanceMeters: number,
    endDistanceMeters: number,
    stepStartSeconds: number,
    speedMps: number,
  ): void {
    if (!this.isIndividualTimeTrial || speedMps <= 0) {
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
      rider.lastSplitLabel = marker.label;
      rider.lastSplitTimeSeconds = Math.max(0, stepStartSeconds + secondsToMarker - rider.startOffsetSeconds);
      rider.splitTimes[marker.label] = rider.lastSplitTimeSeconds;
      rider.nextIntermediateIndex += 1;
    }
  }

  private resolveRiderClockSeconds(rider: RiderState): number | null {
    if (rider.finishTimeSeconds != null) {
      return Math.max(0, rider.finishTimeSeconds - rider.startOffsetSeconds);
    }
    if (!this.isIndividualTimeTrial) {
      return this.elapsedSeconds;
    }
    if (!rider.hasStarted) {
      return null;
    }
    return Math.max(0, this.elapsedSeconds - rider.startOffsetSeconds);
  }
}