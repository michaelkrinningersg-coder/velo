import type { ParsedStageSegment, ParsedStageSummary, Rider, Stage } from '../../../shared/types';
import type { FavoriteItem } from './stageFavorites';

export interface PrecalculatedStageAttack {
  riderId: number;
  attackNumber: number;
  triggerDistanceMeters: number;
  durationSeconds: number;
  sourceSegmentStartMeters: number;
  sourceSegmentEndMeters: number;
  isCounterAttack: false;
}

export interface ActiveStageAttack {
  riderId: number;
  remainingSeconds: number;
  startedAtElapsedSeconds: number;
  triggerDistanceMeters: number;
  durationSeconds: number;
  attackNumber: number;
  isCounterAttack: boolean;
  triggeredByRiderId: number | null;
}

export interface StageAttackTickTrigger {
  newActiveAttacks: ActiveStageAttack[];
  expiredRiderIds: number[];
}

interface AttackWindow {
  startMeters: number;
  endMeters: number;
  sourceSegmentStartMeters: number;
  sourceSegmentEndMeters: number;
}

const ALLOWED_ATTACK_PROFILES = new Set<Stage['profile']>([
  'Hilly_Difficult',
  'Medium_Mountain',
  'Mountain',
  'High_Mountain',
  'Cobble',
  'Cobble_Hill',
]);

const MIN_PRIMARY_ATTACKERS = 3;
const MAX_PRIMARY_ATTACKERS = 7;
const ATTACK_DURATION_MIN_SECONDS = 120;
const ATTACK_DURATION_MAX_SECONDS = 200;
export const COUNTER_ATTACK_DURATION_SECONDS = 180;
export const ATTACK_SKILL_BONUS = 10;
const SECOND_ATTACK_MIN_DISTANCE_METERS = 8000;

function randomInteger(min: number, max: number, randomValue = Math.random()): number {
  const normalizedMin = Math.ceil(Math.min(min, max));
  const normalizedMax = Math.floor(Math.max(min, max));
  return Math.floor(randomValue * ((normalizedMax - normalizedMin) + 1)) + normalizedMin;
}

function shuffleInPlace<T>(values: T[]): T[] {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInteger(0, index);
    [values[index], values[swapIndex]] = [values[swapIndex]!, values[index]!];
  }
  return values;
}

function sampleWithoutReplacement<T>(values: T[], count: number): T[] {
  if (count <= 0 || values.length === 0) {
    return [];
  }
  return shuffleInPlace([...values]).slice(0, Math.min(count, values.length));
}

function isAttackStage(stage: Stage): boolean {
  return ALLOWED_ATTACK_PROFILES.has(stage.profile);
}

function isAttackSegment(segment: ParsedStageSegment): boolean {
  return segment.gradient_percent > 5 || segment.terrain === 'Cobble' || segment.terrain === 'Cobble_Hill';
}

function buildAttackWindows(stage: Stage, stageSummary: ParsedStageSummary): AttackWindow[] {
  if (!isAttackStage(stage) || stageSummary.distanceKm <= 0) {
    return [];
  }

  const finalPushStartMeters = stageSummary.distanceKm * 1000 * Math.max(0, Math.min(1, stage.finalPushStartPercent / 100));
  return stageSummary.segments.flatMap((segment) => {
    if (!isAttackSegment(segment)) {
      return [];
    }

    const segmentStartMeters = segment.start_km * 1000;
    const segmentEndMeters = segment.end_km * 1000;
    const usableStartMeters = Math.max(segmentStartMeters, finalPushStartMeters);
    if (usableStartMeters >= segmentEndMeters) {
      return [];
    }

    return [{
      startMeters: usableStartMeters,
      endMeters: segmentEndMeters,
      sourceSegmentStartMeters: segmentStartMeters,
      sourceSegmentEndMeters: segmentEndMeters,
    }];
  });
}

function sampleTriggerFromWindows(windows: AttackWindow[], excludeDistanceMeters?: number): {
  triggerDistanceMeters: number;
  sourceSegmentStartMeters: number;
  sourceSegmentEndMeters: number;
} | null {
  const eligibleWindows = excludeDistanceMeters == null
    ? windows
    : windows.filter((window) => {
      const minDistance = Math.min(
        Math.abs(window.startMeters - excludeDistanceMeters),
        Math.abs(window.endMeters - excludeDistanceMeters),
      );
      const maxDistance = Math.max(
        Math.abs(window.startMeters - excludeDistanceMeters),
        Math.abs(window.endMeters - excludeDistanceMeters),
      );
      return minDistance >= SECOND_ATTACK_MIN_DISTANCE_METERS || maxDistance >= SECOND_ATTACK_MIN_DISTANCE_METERS;
    });
  if (eligibleWindows.length === 0) {
    return null;
  }

  const selectedWindow = eligibleWindows[randomInteger(0, eligibleWindows.length - 1)];
  if (!selectedWindow) {
    return null;
  }

  const minTrigger = Math.ceil(selectedWindow.startMeters);
  const maxTrigger = Math.floor(selectedWindow.endMeters);
  if (maxTrigger <= minTrigger) {
    return null;
  }

  let attempts = 0;
  while (attempts < 12) {
    const triggerDistanceMeters = randomInteger(minTrigger, maxTrigger);
    if (excludeDistanceMeters == null || Math.abs(triggerDistanceMeters - excludeDistanceMeters) >= SECOND_ATTACK_MIN_DISTANCE_METERS) {
      return {
        triggerDistanceMeters,
        sourceSegmentStartMeters: selectedWindow.sourceSegmentStartMeters,
        sourceSegmentEndMeters: selectedWindow.sourceSegmentEndMeters,
      };
    }
    attempts += 1;
  }

  const fallbackTrigger = excludeDistanceMeters != null && excludeDistanceMeters < selectedWindow.startMeters
    ? maxTrigger
    : minTrigger;
  if (excludeDistanceMeters == null || Math.abs(fallbackTrigger - excludeDistanceMeters) >= SECOND_ATTACK_MIN_DISTANCE_METERS) {
    return {
      triggerDistanceMeters: fallbackTrigger,
      sourceSegmentStartMeters: selectedWindow.sourceSegmentStartMeters,
      sourceSegmentEndMeters: selectedWindow.sourceSegmentEndMeters,
    };
  }

  return null;
}

export function precalculateStageAttacks(top15Riders: Rider[], stage: Stage, stageSummary: ParsedStageSummary): PrecalculatedStageAttack[] {
  const validTop15 = top15Riders.slice(0, 15);
  const attackWindows = buildAttackWindows(stage, stageSummary);
  if (validTop15.length === 0 || attackWindows.length === 0) {
    return [];
  }

  const desiredPrimaryAttackers = randomInteger(MIN_PRIMARY_ATTACKERS, Math.min(MAX_PRIMARY_ATTACKERS, validTop15.length));
  const selectedAttackers = sampleWithoutReplacement(validTop15, desiredPrimaryAttackers);
  const attacks: PrecalculatedStageAttack[] = [];

  for (const rider of selectedAttackers) {
    const primaryTrigger = sampleTriggerFromWindows(attackWindows);
    if (!primaryTrigger) {
      continue;
    }

    attacks.push({
      riderId: rider.id,
      attackNumber: 1,
      triggerDistanceMeters: primaryTrigger.triggerDistanceMeters,
      durationSeconds: randomInteger(ATTACK_DURATION_MIN_SECONDS, ATTACK_DURATION_MAX_SECONDS),
      sourceSegmentStartMeters: primaryTrigger.sourceSegmentStartMeters,
      sourceSegmentEndMeters: primaryTrigger.sourceSegmentEndMeters,
      isCounterAttack: false,
    });
  }

  if (attacks.length === 0) {
    return [];
  }

  const attackersWithPrimary = attacks.map((attack) => attack.riderId);
  const secondAttackCount = Math.floor(attackersWithPrimary.length * 0.5);
  const secondAttackRiderIds = new Set(sampleWithoutReplacement(attackersWithPrimary, secondAttackCount));

  for (const primaryAttack of [...attacks]) {
    if (!secondAttackRiderIds.has(primaryAttack.riderId)) {
      continue;
    }

    const secondTrigger = sampleTriggerFromWindows(attackWindows, primaryAttack.triggerDistanceMeters);
    if (!secondTrigger) {
      continue;
    }

    attacks.push({
      riderId: primaryAttack.riderId,
      attackNumber: 2,
      triggerDistanceMeters: secondTrigger.triggerDistanceMeters,
      durationSeconds: randomInteger(ATTACK_DURATION_MIN_SECONDS, ATTACK_DURATION_MAX_SECONDS),
      sourceSegmentStartMeters: secondTrigger.sourceSegmentStartMeters,
      sourceSegmentEndMeters: secondTrigger.sourceSegmentEndMeters,
      isCounterAttack: false,
    });
  }

  return attacks.sort((left, right) => (
    left.triggerDistanceMeters - right.triggerDistanceMeters
    || left.riderId - right.riderId
    || left.attackNumber - right.attackNumber
  ));
}

export function resolveCounterAttackStarterIds(top20Favorites: FavoriteItem[], attackerRiderId: number, activeAttackerIds: ReadonlySet<number>): number[] {
  if (top20Favorites.length === 0) {
    return [];
  }

  const eligibleRiderIds = top20Favorites
    .filter((favorite) => favorite.kind === 'rider' && favorite.riderId != null)
    .map((favorite) => favorite.riderId as number)
    .filter((riderId) => riderId !== attackerRiderId && !activeAttackerIds.has(riderId));
  if (eligibleRiderIds.length === 0) {
    return [];
  }

  const desiredCounterCount = Math.min(randomInteger(0, 3), eligibleRiderIds.length);
  return sampleWithoutReplacement(eligibleRiderIds, desiredCounterCount);
}

export function updateActiveStageAttacks(activeAttacks: ReadonlyMap<number, ActiveStageAttack>, deltaSeconds: number): StageAttackTickTrigger {
  const newActiveAttacks: ActiveStageAttack[] = [];
  const expiredRiderIds: number[] = [];

  for (const [riderId, attack] of activeAttacks.entries()) {
    const remainingSeconds = Math.max(0, attack.remainingSeconds - deltaSeconds);
    if (remainingSeconds <= 0) {
      expiredRiderIds.push(riderId);
      continue;
    }

    newActiveAttacks.push({
      ...attack,
      remainingSeconds,
    });
  }

  return { newActiveAttacks, expiredRiderIds };
}