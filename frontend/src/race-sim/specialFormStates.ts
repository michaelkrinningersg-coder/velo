import type { Rider, Stage, Team } from '../../../shared/types';
import { calculateStageFavoriteRiderRanking, type StageFavoriteOptions } from './stageFavorites';

function randomBetween(min: number, max: number): number {
  return min + (Math.random() * (max - min));
}

function shuffleRiders(riders: Rider[]): Rider[] {
  const shuffled = [...riders];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(randomBetween(0, index + 1));
    const current = shuffled[index];
    shuffled[index] = shuffled[swapIndex] ?? current;
    shuffled[swapIndex] = current;
  }
  return shuffled;
}

function createFallbackTeams(riders: Rider[]): Team[] {
  const seen = new Map<number, Team>();
  for (const rider of riders) {
    if (rider.activeTeamId == null || seen.has(rider.activeTeamId)) {
      continue;
    }
    seen.set(rider.activeTeamId, {
      id: rider.activeTeamId,
      name: `Team ${rider.activeTeamId}`,
      abbreviation: '---',
      divisionId: 0,
      u23TeamId: null,
      isPlayerTeam: false,
      countryCode: '---',
      colorPrimary: '#000000',
      colorSecondary: '#ffffff',
      aiFocus1: 0,
      aiFocus2: 0,
      aiFocus3: 0,
    });
  }
  return [...seen.values()];
}

interface ApplySpecialFormStatesOptions extends StageFavoriteOptions {
  teams?: Team[];
}

export function applySpecialFormStates(riders: Rider[], stage: Stage): Rider[] {
  return applySpecialFormStatesWithContext(riders, stage);
}

export function applySpecialFormStatesWithContext(riders: Rider[], stage: Stage, options: ApplySpecialFormStatesOptions = {}): Rider[] {
  if (riders.length === 0) {
    return [];
  }

  const clonedRiders = riders.map((rider) => ({
    ...rider,
    hasSuperform: false,
    hasSupermalus: false,
    specialFormDelta: 0,
  }));

  const teams = options.teams ?? createFallbackTeams(clonedRiders);
  const riderRanking = calculateStageFavoriteRiderRanking(clonedRiders, teams, stage, options);
  const topTwentyRiderIds = new Set(riderRanking.slice(0, 20).map((entry) => entry.rider.id));

  const superformTargetCount = Math.min(
    Math.ceil(clonedRiders.length * 0.02),
    Math.max(0, clonedRiders.length - topTwentyRiderIds.size),
  );
  const supermalusTargetCount = Math.min(
    Math.ceil(clonedRiders.length * 0.01),
    clonedRiders.length,
  );

  const superformPool = shuffleRiders(clonedRiders.filter((rider) => !topTwentyRiderIds.has(rider.id)));
  const superformRiderIds = new Set(superformPool.slice(0, superformTargetCount).map((rider) => rider.id));

  const supermalusPool = shuffleRiders(clonedRiders.filter((rider) => !superformRiderIds.has(rider.id)));
  const supermalusRiderIds = new Set(supermalusPool.slice(0, supermalusTargetCount).map((rider) => rider.id));

  return clonedRiders.map((rider) => {
    if (superformRiderIds.has(rider.id)) {
      return {
        ...rider,
        hasSuperform: true,
        hasSupermalus: false,
        specialFormDelta: 3,
      } satisfies Rider;
    }

    if (supermalusRiderIds.has(rider.id)) {
      return {
        ...rider,
        hasSuperform: false,
        hasSupermalus: true,
        specialFormDelta: -5,
      } satisfies Rider;
    }

    return rider;
  });
}