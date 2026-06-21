import type { StageProfile } from './types';

export interface StageResultRankingEntry {
  stageTimeSeconds: number;
  photoFinishScore: number;
  riderId: number;
}

export const TIME_TIE_THRESHOLD_SECONDS = 1;

export const TIME_LIMIT_PERCENT_BY_PROFILE: Record<StageProfile, number> = {
  Flat: 14,
  Rolling: 15,
  Hilly: 16,
  Hilly_Difficult: 17,
  Medium_Mountain: 18,
  Mountain: 25,
  High_Mountain: 27,
  ITT: 30,
  TTT: 40,
  Cobble: 18,
  Cobble_Hill: 20,
};

export function roundStageResultSeconds(value: number): number {
  return Math.max(0, Math.round(value));
}

export function isTimeTrialProfile(profile: StageProfile): boolean {
  return profile === 'ITT' || profile === 'TTT';
}

export function resolveTimeLimitPercent(profile: StageProfile): number {
  return TIME_LIMIT_PERCENT_BY_PROFILE[profile] ?? 20;
}

export function resolveStageTimeLimitSeconds(profile: StageProfile, stageTimesSeconds: number[]): number | null {
  if (stageTimesSeconds.length === 0) {
    return null;
  }

  const winnerTimeSeconds = Math.min(...stageTimesSeconds);
  if (!Number.isFinite(winnerTimeSeconds) || winnerTimeSeconds <= 0) {
    return null;
  }

  return Math.floor(winnerTimeSeconds * (1 + (resolveTimeLimitPercent(profile) / 100)));
}

function compareStageResultEntries(left: StageResultRankingEntry, right: StageResultRankingEntry): number {
  return left.stageTimeSeconds - right.stageTimeSeconds
    || right.photoFinishScore - left.photoFinishScore
    || left.riderId - right.riderId;
}

function compareStageResultEntriesWithinTimeGroup(left: StageResultRankingEntry, right: StageResultRankingEntry): number {
  return right.photoFinishScore - left.photoFinishScore || left.riderId - right.riderId;
}

export function rankStageResultEntries<T extends StageResultRankingEntry>(entries: T[], profile: StageProfile): T[] {
  if (isTimeTrialProfile(profile)) {
    return [...entries].sort(compareStageResultEntries);
  }

  const sortedByTime = [...entries].sort((left, right) => left.stageTimeSeconds - right.stageTimeSeconds || compareStageResultEntriesWithinTimeGroup(left, right));
  const ranked: T[] = [];
  let group: T[] = [];
  let previousTime: number | null = null;

  const flushGroup = (): void => {
    ranked.push(...group.sort(compareStageResultEntriesWithinTimeGroup));
  };

  for (const entry of sortedByTime) {
    if (group.length === 0) {
      group = [entry];
      previousTime = entry.stageTimeSeconds;
      continue;
    }

    if (previousTime != null && entry.stageTimeSeconds - previousTime <= TIME_TIE_THRESHOLD_SECONDS) {
      group.push(entry);
      previousTime = entry.stageTimeSeconds;
      continue;
    }

    flushGroup();
    group = [entry];
    previousTime = entry.stageTimeSeconds;
  }

  if (group.length > 0) {
    flushGroup();
  }

  return ranked;
}
