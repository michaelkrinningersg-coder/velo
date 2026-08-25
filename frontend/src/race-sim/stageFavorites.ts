import type { Rider, RiderSkillKey, Stage, Team } from '../../../shared/types';
import { resolveStageScoreWeights, resolveStaminaWeight } from './stageScoreWeights';

export interface FavoriteItem {
  rank: number;
  kind: 'rider' | 'team';
  effectiveSkill: number;
  teamId: number;
  teamName: string;
  displayName: string;
  roleLabel: string;
  riderId?: number;
}

export interface StageFavoriteOptions {
  distanceKm?: number;
  elevationGainMeters?: number;
  dailyFormByRiderId?: Map<number, number> | Record<number, number>;
}

interface TeamFavoriteCandidate {
  team: Team;
  score: number;
}

export interface RiderFavoriteCandidate {
  rider: Rider;
  teamName: string;
  effectiveSkill: number;
}

function resolveDailyForm(riderId: number, input?: Map<number, number> | Record<number, number>): number {
  if (!input) {
    return 0;
  }
  if (input instanceof Map) {
    return input.get(riderId) ?? 0;
  }
  return input[riderId] ?? 0;
}

function roundToOne(value: number): number {
  return Math.round(value * 10) / 10;
}

function resolveDistanceKm(stage: Stage, options?: StageFavoriteOptions): number {
  const stageWithDistance = stage as Stage & { distanceKm?: number };
  return options?.distanceKm ?? stageWithDistance.distanceKm ?? 0;
}

function resolveElevationGainMeters(stage: Stage, options?: StageFavoriteOptions): number {
  const stageWithElevation = stage as Stage & { elevationGainMeters?: number };
  return options?.elevationGainMeters ?? stageWithElevation.elevationGainMeters ?? 0;
}

function resolveFormContribution(rider: Rider, dailyForm: number): number {
  return dailyForm + (rider.formBonus ?? 0) + (rider.raceFormBonus ?? 0);
}

function resolveStaminaContribution(rider: Rider, distanceKm: number): number {
  return rider.skills.stamina * resolveStaminaWeight(distanceKm);
}

function calculateIttScore(rider: Rider, dailyForm: number, elevationGainMeters: number): number {
  return rider.skills.timeTrial
    + resolveFormContribution(rider, dailyForm)
    + (rider.skills.mountain * (elevationGainMeters / 500));
}

/**
 * Etappenscore einer Strassenetappe.
 *
 * Die Gewichte kommen aus `stageScoreWeights.ts` und haengen an Profil *und*
 * Schwierigkeit je Kilometer. Vorher stand hier je Profil eine feste Formel,
 * in der der Sprint die Flachetappe mit 0,80 dominierte — das ist die
 * Gewichtung eines Zielsprints, nicht die einer 190 Kilometer langen Anfahrt.
 */
function calculateRoadScore(
  rider: Rider,
  stage: Stage,
  distanceKm: number,
  dailyForm: number,
): number {
  const weights = resolveStageScoreWeights(
    stage.profile,
    (stage as Stage & { profileScore?: number | null }).profileScore ?? null,
    distanceKm,
  );
  let weighted = 0;
  for (const [key, weight] of Object.entries(weights) as Array<[RiderSkillKey, number]>) {
    weighted += rider.skills[key] * weight;
  }
  return weighted + resolveFormContribution(rider, dailyForm) + resolveStaminaContribution(rider, distanceKm);
}

function calculateRiderScore(rider: Rider, stage: Stage, distanceKm: number, elevationGainMeters: number, dailyForm: number): number {
  if (stage.profile === 'ITT' || stage.profile === 'TTT') {
    return calculateIttScore(rider, dailyForm, elevationGainMeters);
  }
  return calculateRoadScore(rider, stage, distanceKm, dailyForm);
}

function toFavoriteItem(candidate: { rider: Rider; teamName: string; effectiveSkill: number }, rank: number): FavoriteItem {
  return {
    rank,
    kind: 'rider',
    effectiveSkill: roundToOne(candidate.effectiveSkill),
    teamId: candidate.rider.activeTeamId ?? 0,
    teamName: candidate.teamName,
    displayName: `${candidate.rider.firstName} ${candidate.rider.lastName}`,
    roleLabel: candidate.rider.role?.name ?? '–',
    riderId: candidate.rider.id,
  };
}

export function calculateStageFavorites(riders: Rider[], teams: Team[], stage: Stage): FavoriteItem[];
export function calculateStageFavorites(riders: Rider[], teams: Team[], stage: Stage, options: StageFavoriteOptions): FavoriteItem[];
export function calculateStageFavorites(riders: Rider[], teams: Team[], stage: Stage, options?: StageFavoriteOptions): FavoriteItem[] {
  const distanceKm = resolveDistanceKm(stage, options);
  const elevationGainMeters = resolveElevationGainMeters(stage, options);
  const teamById = new Map(teams.map((team) => [team.id, team]));

  if (stage.profile === 'TTT') {
    const ridersByTeamId = new Map<number, Rider[]>();
    for (const rider of riders) {
      if (rider.activeTeamId == null) {
        continue;
      }
      const existing = ridersByTeamId.get(rider.activeTeamId) ?? [];
      existing.push(rider);
      ridersByTeamId.set(rider.activeTeamId, existing);
    }

    const teamFavorites: TeamFavoriteCandidate[] = [...ridersByTeamId.entries()].map(([teamId, teamRiders]) => {
      const team = teamById.get(teamId);
      const scoredRiders = teamRiders
        .map((rider) => calculateIttScore(rider, resolveDailyForm(rider.id, options?.dailyFormByRiderId), elevationGainMeters))
        .sort((left, right) => right - left);
      const bestFive = scoredRiders.slice(0, 5);
      const availableCount = bestFive.length;
      const average = availableCount > 0
        ? bestFive.reduce((sum, value) => sum + value, 0) / availableCount
        : 0;
      const missingRidersPenalty = Math.max(0, 5 - availableCount) * 2;
      return {
        team: team ?? {
          id: teamId,
          name: `Team ${teamId}`,
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
        },
        score: average - missingRidersPenalty,
      } satisfies TeamFavoriteCandidate;
    });

    return teamFavorites
      .sort((left, right) => right.score - left.score || left.team.id - right.team.id)
      .slice(0, 20)
      .map((item, index) => ({
        rank: index + 1,
        kind: 'team',
        effectiveSkill: roundToOne(item.score),
        teamId: item.team.id,
        teamName: item.team.name,
        displayName: item.team.name,
        roleLabel: 'TTT',
      } satisfies FavoriteItem));
  }

  const riderRanking = options != null
    ? calculateStageFavoriteRiderRanking(riders, teams, stage, options)
    : calculateStageFavoriteRiderRanking(riders, teams, stage);

  return riderRanking
    .sort((left, right) => right.effectiveSkill - left.effectiveSkill || left.rider.id - right.rider.id)
    .slice(0, 20)
    .map((candidate, index) => toFavoriteItem(candidate, index + 1));
}

export function calculateStageFavoriteRiderRanking(riders: Rider[], teams: Team[], stage: Stage): RiderFavoriteCandidate[];
export function calculateStageFavoriteRiderRanking(riders: Rider[], teams: Team[], stage: Stage, options: StageFavoriteOptions): RiderFavoriteCandidate[];
export function calculateStageFavoriteRiderRanking(riders: Rider[], teams: Team[], stage: Stage, options?: StageFavoriteOptions): RiderFavoriteCandidate[] {
  const distanceKm = resolveDistanceKm(stage, options);
  const elevationGainMeters = resolveElevationGainMeters(stage, options);
  const teamById = new Map(teams.map((team) => [team.id, team]));

  return riders
    .map((rider) => ({
      rider,
      teamName: rider.activeTeamId != null ? (teamById.get(rider.activeTeamId)?.name ?? `Team ${rider.activeTeamId}`) : '—',
      effectiveSkill: calculateRiderScore(
        rider,
        stage,
        distanceKm,
        elevationGainMeters,
        resolveDailyForm(rider.id, options?.dailyFormByRiderId),
      ),
    }))
    .sort((left, right) => right.effectiveSkill - left.effectiveSkill || left.rider.id - right.rider.id);
}