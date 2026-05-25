import type { ParsedStageSummary, Race, RealtimeGcStanding, Rider, Stage } from '../../../shared/types';
import type { FavoriteItem } from './stageFavorites';

export interface PrecalculatedStageBreakaway {
  riderIds: number[];
  triggerDistanceMeters: number;
  phaseEndDistanceMeters: number;
  skillBonus: number;
  malusValue: number;
}

function randomInteger(min: number, max: number): number {
  const normalizedMin = Math.ceil(Math.min(min, max));
  const normalizedMax = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * ((normalizedMax - normalizedMin) + 1)) + normalizedMin;
}

function randomBetween(min: number, max: number): number {
  return min + (Math.random() * (max - min));
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

function getTopFavoriteIds(favorites: FavoriteItem[], limit: number): Set<number> {
  return new Set(
    favorites
      .filter((favorite) => favorite.kind === 'rider' && favorite.riderId != null)
      .slice(0, limit)
      .map((favorite) => favorite.riderId as number),
  );
}

function getTopGcIds(gcStandings: RealtimeGcStanding[], limit: number): Set<number> {
  return new Set(gcStandings.slice(0, limit).map((standing) => standing.riderId));
}

function resolveBreakawaySizeBounds(race: Race, stage: Stage, riderCount: number): { min: number; max: number } {
  if (race.isStageRace && stage.stageNumber <= 8) {
    const min = Math.max(1, Math.ceil(riderCount * 0.01));
    const max = Math.max(min, Math.ceil(riderCount * 0.06));
    return { min, max };
  }

  const isEarlyStage = stage.stageNumber <= 10;
  const min = Math.max(1, Math.floor(riderCount * (isEarlyStage ? 0.01 : 0.05)));
  const max = Math.max(min, Math.floor(riderCount * (isEarlyStage ? 0.08 : 0.20)));
  return { min, max };
}

function resolveBreakawayPhaseEndRange(race: Race, stage: Stage): { min: number; max: number } {
  if (!race.isStageRace || stage.stageNumber <= 8) {
    return { min: 0.45, max: 0.6 };
  }
  if (stage.stageNumber <= 15) {
    return { min: 0.45, max: 0.75 };
  }
  return { min: 0.5, max: 0.85 };
}

export function precalculateStageBreakaway(
  riders: Rider[],
  race: Race,
  stage: Stage,
  stageSummary: ParsedStageSummary,
  stageFavorites: FavoriteItem[],
  gcStandings: RealtimeGcStanding[],
): PrecalculatedStageBreakaway | null {
  if ((stage.profile === 'ITT' || stage.profile === 'TTT') || riders.length === 0 || stageSummary.distanceKm <= 0) {
    return null;
  }

  const riderCount = riders.length;
  const { min: minBreakawaySize, max: maxBreakawaySize } = resolveBreakawaySizeBounds(race, stage, riderCount);
  const desiredBreakawaySize = randomInteger(minBreakawaySize, maxBreakawaySize);

  const topFavoriteIds = getTopFavoriteIds(stageFavorites, 5);
  const topGcIds = getTopGcIds(gcStandings, 10);

  const eligibleRiders = riders.filter((rider) => rider.activeTeamId != null && !topFavoriteIds.has(rider.id) && !topGcIds.has(rider.id));
  if (eligibleRiders.length === 0) {
    return null;
  }

  const selectedRiders = sampleWithoutReplacement(eligibleRiders, Math.min(desiredBreakawaySize, eligibleRiders.length));
  if (selectedRiders.length === 0) {
    return null;
  }

  const stageDistanceMeters = stageSummary.distanceKm * 1000;
  const triggerDistanceMeters = randomInteger(0, Math.min(10000, Math.max(0, Math.floor(stageDistanceMeters * 0.1))));
  const phaseEndRange = resolveBreakawayPhaseEndRange(race, stage);
  const phaseEndDistanceMeters = Math.round(stageDistanceMeters * randomBetween(phaseEndRange.min, phaseEndRange.max));
  const skillBonus = randomInteger(4, 9);

  return {
    riderIds: selectedRiders.map((rider) => rider.id),
    triggerDistanceMeters,
    phaseEndDistanceMeters,
    skillBonus,
    malusValue: 10,
  };
}