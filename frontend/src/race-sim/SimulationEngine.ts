import type {
  ParsedStageSegment,
  RealtimeSimulationBootstrap,
  Rider,
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
  distanceCoveredMeters: number;
  gapToLeaderMeters: number;
  activeTerrain: StageTerrain | 'Finish';
  skillName: TerrainSkillName | 'Finish';
  baseSkill: number;
  effectiveSkill: number;
  dailyForm: number;
  microForm: number;
  gradientModifier: number;
  windModifier: number;
  draftModifier: number;
  currentSpeedMps: number;
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
  baseSkill: number;
  effectiveSkill: number;
  gradientModifier: number;
  windModifier: number;
  draftModifier: number;
  tempSpeedMps: number;
  currentSpeedMps: number;
  isLeadingGroup: boolean;
}

interface BasePhysicsResult {
  skillName: TerrainSkillName;
  baseSkill: number;
  effectiveSkill: number;
  gradientModifier: number;
  windModifier: number;
  tempSpeedMps: number;
}

const CLUSTER_DISTANCE_METERS = 20;
const MAX_SUBSTEP_SECONDS = 1;

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
    return left.finishTimeSeconds - right.finishTimeSeconds || left.rider.id - right.rider.id;
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

  private readonly riders: RiderState[];

  private readonly windZones: WindZone[];

  private elapsedSeconds = 0;

  constructor(private readonly bootstrap: RealtimeSimulationBootstrap) {
    this.stageDistanceMeters = bootstrap.stageSummary.distanceKm * 1000;
    this.windZones = createWindZones(this.stageDistanceMeters);
    this.riders = bootstrap.riders.map((rider) => ({
      rider,
      riderName: `${rider.firstName} ${rider.lastName}`,
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
      baseSkill: 0,
      effectiveSkill: 0,
      gradientModifier: 1,
      windModifier: 1,
      draftModifier: 1,
      tempSpeedMps: 0,
      currentSpeedMps: 0,
      isLeadingGroup: true,
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
        distanceCoveredMeters: rider.distanceCoveredMeters,
        gapToLeaderMeters: Math.max(0, leaderDistanceMeters - rider.distanceCoveredMeters),
        activeTerrain: rider.finishTimeSeconds != null ? 'Finish' : rider.activeTerrain,
        skillName: rider.finishTimeSeconds != null ? 'Finish' : rider.skillName,
        baseSkill: rider.baseSkill,
        effectiveSkill: rider.effectiveSkill,
        dailyForm: rider.dailyForm,
        microForm: rider.microForm,
        gradientModifier: rider.gradientModifier,
        windModifier: rider.windModifier,
        draftModifier: rider.draftModifier,
        currentSpeedMps: rider.currentSpeedMps,
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

    for (const rider of this.riders) {
      if (rider.finishTimeSeconds != null) {
        rider.nextDistanceCoveredMeters = null;
        rider.tempSpeedMps = 0;
        rider.draftModifier = 1;
        rider.currentSpeedMps = 0;
        rider.isLeadingGroup = false;
        continue;
      }

      this.advanceIndexForDistance(rider);
      const segment = this.currentSegment(rider);
      const windZone = this.currentWindZone(rider);
      if (!segment || !windZone) {
        rider.distanceCoveredMeters = this.stageDistanceMeters;
        rider.nextDistanceCoveredMeters = this.stageDistanceMeters;
        rider.finishTimeSeconds = stepStartSeconds;
        rider.tempSpeedMps = 0;
        rider.draftModifier = 1;
        rider.currentSpeedMps = 0;
        rider.isLeadingGroup = false;
        rider.activeTerrain = 'Finish';
        rider.skillName = 'Finish';
        continue;
      }

      const basePhysics = this.calculateBasePhysics(rider, segment, windZone);
      rider.activeTerrain = segment.terrain;
      rider.skillName = basePhysics.skillName;
      rider.baseSkill = basePhysics.baseSkill;
      rider.effectiveSkill = basePhysics.effectiveSkill;
      rider.gradientModifier = basePhysics.gradientModifier;
      rider.windModifier = basePhysics.windModifier;
      rider.tempSpeedMps = basePhysics.tempSpeedMps;
      rider.draftModifier = 1;
      rider.currentSpeedMps = basePhysics.tempSpeedMps;
      rider.isLeadingGroup = true;
      rider.nextDistanceCoveredMeters = null;
    }

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
          continue;
        }

        if (dist < 1.0) {
          rider.currentSpeedMps = targetFinalSpeed;
          rider.nextDistanceCoveredMeters = target.rider.distanceCoveredMeters + (targetFinalSpeed * deltaSeconds);
          continue;
        }

        rider.currentSpeedMps = Math.min(draftedSpeed, targetFinalSpeed + 2.0);
        continue;
      }

      rider.currentSpeedMps = draftedSpeed;
    }

    for (const rider of this.riders) {
      if (rider.finishTimeSeconds != null) {
        continue;
      }

      const targetDistance = rider.nextDistanceCoveredMeters
        ?? (rider.distanceCoveredMeters + (rider.currentSpeedMps * deltaSeconds));
      const remainingMeters = this.stageDistanceMeters - rider.distanceCoveredMeters;
      const travelMeters = Math.max(0, targetDistance - rider.distanceCoveredMeters);

      if (travelMeters >= remainingMeters) {
        const finishSeconds = remainingMeters / rider.currentSpeedMps;
        rider.distanceCoveredMeters = this.stageDistanceMeters;
        rider.finishTimeSeconds = stepStartSeconds + finishSeconds;
        rider.currentSpeedMps = 0;
      } else {
        rider.distanceCoveredMeters = targetDistance;
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

  private calculateBasePhysics(rider: RiderState, segment: ParsedStageSegment, windZone: WindZone): BasePhysicsResult {
    const skillName = terrainToSkillName(segment.terrain);
    const baseSkill = Math.min(85, resolveBaseSkill(rider.rider, skillName));
    const effectiveSkill = baseSkill + rider.dailyForm + rider.microForm;
    const gradientPercent = clamp(segment.gradient_percent, -20, 20);
    const gradientModifier = gradientPercent > 0
      ? Math.exp(-0.06 * gradientPercent)
      : 1 - (gradientPercent * 0.06);
    const windModifier = 1 + (windZone.vector * (windZone.windSpeedKph / 100) * 0.52);
    const speedSkillFactor = skillName === 'Flat' ? (7 / 35) : (10 / 35);
    const baseSpeedKph = 40 + ((effectiveSkill - 50) * speedSkillFactor);
    const baseSpeedMps = baseSpeedKph / 3.6;

    return {
      skillName,
      baseSkill,
      effectiveSkill,
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
      rider.baseSkill = 0;
      rider.effectiveSkill = 0;
      rider.gradientModifier = 1;
      rider.windModifier = 1;
      return;
    }

    const basePhysics = this.calculateBasePhysics(rider, segment, windZone);
    rider.activeTerrain = segment.terrain;
    rider.skillName = basePhysics.skillName;
    rider.baseSkill = basePhysics.baseSkill;
    rider.effectiveSkill = basePhysics.effectiveSkill;
    rider.gradientModifier = basePhysics.gradientModifier;
    rider.windModifier = basePhysics.windModifier;
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
}