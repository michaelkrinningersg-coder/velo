import type { ParsedStageSummary, RealtimeGcStanding, Rider, Stage } from '../../../shared/types';
import type { FavoriteItem } from './stageFavorites';

export interface PrecalculatedStageBreakaway {
  riderIds: number[];
  triggerDistanceMeters: number;
  phaseEndDistanceMeters: number;
  speedBonusKph: number;
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

export function precalculateStageBreakaway(
  riders: Rider[],
  stage: Stage,
  stageSummary: ParsedStageSummary,
  stageFavorites: FavoriteItem[],
  gcStandings: RealtimeGcStanding[],
): PrecalculatedStageBreakaway | null {
  if ((stage.profile === 'ITT' || stage.profile === 'TTT') || riders.length === 0 || stageSummary.distanceKm <= 0) {
    return null;
  }

  const riderCount = riders.length;
  const isEarlyStage = stage.stageNumber <= 10;
  const minBreakawaySize = Math.max(1, Math.floor(riderCount * (isEarlyStage ? 0.01 : 0.05)));
  const maxBreakawaySize = Math.max(minBreakawaySize, Math.floor(riderCount * (isEarlyStage ? 0.08 : 0.20)));
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
  const phaseEndDistanceMeters = Math.round(stageDistanceMeters * randomBetween(0.45, 0.70));
  const speedBonusKph = randomBetween(1.5, 3.5);

  return {
    riderIds: selectedRiders.map((rider) => rider.id),
    triggerDistanceMeters,
    phaseEndDistanceMeters,
    speedBonusKph,
    malusValue: 8,
  };
}