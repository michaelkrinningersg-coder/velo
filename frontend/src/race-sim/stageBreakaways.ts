import type { ParsedStageSummary, Race, RealtimeClassificationStanding, RealtimeGcStanding, Rider, Stage, Team } from '../../../shared/types';
import { calculateStageFavoriteRiderRanking, type FavoriteItem } from './stageFavorites';
import { collectStageBoundaryMarkers, isMountainClassificationMarker } from './stageSummary';

export interface PrecalculatedStageBreakaway {
  riderIds: number[];
  triggerDistanceMeters: number;
  groupPhaseEndDistanceMeters: number;
  phaseEndDistanceMeters: number;
  skillBonus: number;
  malusValue: number;
  superTeamId?: number;
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

function sampleWeightedWithoutReplacement<T>(values: T[], count: number, resolveWeight: (value: T) => number): T[] {
  const pool = [...values];
  const selected: T[] = [];

  while (selected.length < count && pool.length > 0) {
    const totalWeight = pool.reduce((sum, value) => sum + Math.max(0.0001, resolveWeight(value)), 0);
    let roll = Math.random() * totalWeight;
    let selectedIndex = 0;
    for (let index = 0; index < pool.length; index += 1) {
      roll -= Math.max(0.0001, resolveWeight(pool[index] as T));
      if (roll <= 0) {
        selectedIndex = index;
        break;
      }
    }
    const [picked] = pool.splice(selectedIndex, 1);
    if (picked) {
      selected.push(picked);
    }
  }

  return selected;
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

function getTopClassificationIds(standings: RealtimeClassificationStanding[], limit: number): Set<number> {
  return new Set(
    standings
      .slice(0, limit)
      .map((standing) => standing.riderId)
      .filter((id): id is number => id != null),
  );
}

function getTopClassificationIdsWithExclusions(
  standings: RealtimeClassificationStanding[],
  excludedIds: ReadonlySet<number>,
  limit: number,
): Set<number> {
  return new Set(
    standings
      .map((standing) => standing.riderId)
      .filter((id): id is number => id != null && !excludedIds.has(id))
      .slice(0, limit),
  );
}

function normalizeRoleName(value: string | null | undefined): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function resolveRiderRoleName(rider: Rider): string {
  return normalizeRoleName(rider.role?.name);
}

function hasMountainClassifications(stageSummary: ParsedStageSummary): boolean {
  return collectStageBoundaryMarkers(stageSummary).some(({ marker }) => isMountainClassificationMarker(marker));
}

function resolveAttackInitiativeWeight(rider: Rider): number {
  return Math.max(1, Math.pow(10, (rider.skills.attack - 65) / 10));
}

function resolveBreakawayWeightFactors(
  rider: Rider,
  options: {
    isEarlyStageRace: boolean;
    race: Race;
    gcLeaderTeamId: number | null;
    stageHasMountainClassifications: boolean;
    topMountainIds: ReadonlySet<number>;
    isHardStage: boolean;
  },
): {
  attackFactor: number;
  superformFactor: number;
  gcLeaderTeamFactor: number;
  mountainFactor: number;
  sprinterFactor: number;
  finalWeight: number;
} {
  const attackFactor = resolveAttackInitiativeWeight(rider);
  const superformFactor = rider.hasSuperform === true ? 40 : 1;
  const gcLeaderTeamFactor = !options.isEarlyStageRace && options.race.isStageRace && options.gcLeaderTeamId != null && rider.activeTeamId === options.gcLeaderTeamId
    ? 0.25
    : 1;
  const mountainFactor = options.stageHasMountainClassifications && options.topMountainIds.has(rider.id) ? 50 : 1;
  const sprinterFactor = options.isHardStage && resolveRiderRoleName(rider) === 'sprinter' && rider.skills.hill > 67 ? 20 : 1;
  const finalWeight = attackFactor * superformFactor * gcLeaderTeamFactor * mountainFactor * sprinterFactor;

  return {
    attackFactor,
    superformFactor,
    gcLeaderTeamFactor,
    mountainFactor,
    sprinterFactor,
    finalWeight,
  };
}

function isHarderThanHillyStage(stage: Stage): boolean {
  return stage.profile === 'Hilly_Difficult'
    || stage.profile === 'Medium_Mountain'
    || stage.profile === 'Mountain'
    || stage.profile === 'High_Mountain'
    || stage.profile === 'Cobble_Hill';
}

function resolveGcLeaderTeamId(riders: Rider[], gcStandings: RealtimeGcStanding[]): number | null {
  const gcLeaderId = gcStandings[0]?.riderId ?? null;
  if (gcLeaderId == null) {
    return null;
  }

  return riders.find((rider) => rider.id === gcLeaderId)?.activeTeamId ?? null;
}

function getTopFavoriteTeamIds(favorites: FavoriteItem[], riders: Rider[], limit: number): Set<number> {
  const riderById = new Map(riders.map((rider) => [rider.id, rider]));
  const teamIds = new Set<number>();

  for (const favorite of favorites) {
    if (favorite.kind !== 'rider' || favorite.riderId == null) {
      continue;
    }

    const rider = riderById.get(favorite.riderId) ?? null;
    if (!rider || rider.activeTeamId == null || teamIds.has(rider.activeTeamId)) {
      continue;
    }

    teamIds.add(rider.activeTeamId);
    if (teamIds.size >= limit) {
      break;
    }
  }

  return teamIds;
}

function buildTeamHasCaptainInRace(riders: Rider[]): Map<number, boolean> {
  const result = new Map<number, boolean>();

  for (const rider of riders) {
    if (rider.activeTeamId == null) {
      continue;
    }

    if (!result.has(rider.activeTeamId)) {
      result.set(rider.activeTeamId, false);
    }

    if (resolveRiderRoleName(rider) === 'kapitaen') {
      result.set(rider.activeTeamId, true);
    }
  }

  return result;
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
  mountainStandings: RealtimeClassificationStanding[],
  teams?: Team[],
): PrecalculatedStageBreakaway | null {
  if ((stage.profile === 'ITT' || stage.profile === 'TTT') || riders.length === 0 || stageSummary.distanceKm <= 0) {
    return null;
  }

  const riderCount = riders.length;
  const { min: minBreakawaySize, max: maxBreakawaySize } = resolveBreakawaySizeBounds(race, stage, riderCount);
  const desiredBreakawaySize = randomInteger(minBreakawaySize, maxBreakawaySize);
  const isEarlyStageRace = race.isStageRace && stage.stageNumber <= 10;
  const isOneDayRace = !race.isStageRace;
  const gcLeaderTeamId = resolveGcLeaderTeamId(riders, gcStandings);
  const topFavoriteTeamIds = isEarlyStageRace ? getTopFavoriteTeamIds(stageFavorites, riders, 5) : new Set<number>();
  const teamHasCaptainInRace = isEarlyStageRace ? buildTeamHasCaptainInRace(riders) : new Map<number, boolean>();
  const stageHasMountainClassifications = hasMountainClassifications(stageSummary);
  const topFavoriteIds = getTopFavoriteIds(stageFavorites, 5);
  const topGcIds = getTopGcIds(gcStandings, 10);
  const excludedByFavoritesOrGc = new Set<number>([...topFavoriteIds, ...topGcIds]);
  const topMountainIds = stageHasMountainClassifications
    ? getTopClassificationIdsWithExclusions(mountainStandings, excludedByFavoritesOrGc, 5)
    : new Set<number>();
  const isHardStage = isHarderThanHillyStage(stage);

  // Superteam selection logic
  const isDifficultProfile = ['Hilly_Difficult', 'Medium_Mountain', 'Mountain', 'High_Mountain'].includes(stage.profile);
  const isSuperTeamEligible = race.isStageRace && isDifficultProfile && stage.stageNumber >= 4;
  let superTeamId: number | undefined;
  const protectedLeaderIds = new Set<number>();

  if (isSuperTeamEligible) {
    const top10Gc = getTopGcIds(gcStandings, 10);
    const resolvedTeams = teams ?? [];
    const fullRiderRanking = calculateStageFavoriteRiderRanking(riders, resolvedTeams, stage, {
      distanceKm: stageSummary.distanceKm,
      elevationGainMeters: stageSummary.elevationGainMeters,
    });

    let candidateTeams: number[] = [];

    // Step A: check captains/co-captains in the favorites list (going down until we have 5 unique teams)
    for (const fav of fullRiderRanking) {
      if (candidateTeams.length >= 5) break;
      const rider = fav.rider;
      if (rider.activeTeamId == null || !top10Gc.has(rider.id)) continue;

      const role = resolveRiderRoleName(rider);
      if (role === 'kapitaen' || role === 'co-kapitaen') {
        if (!candidateTeams.includes(rider.activeTeamId)) {
          candidateTeams.push(rider.activeTeamId);
        }
      }
    }

    // Step B: if no candidate teams found, expand search to Lieutenants (Edelhelfer)
    if (candidateTeams.length === 0) {
      for (const fav of fullRiderRanking) {
        if (candidateTeams.length >= 5) break;
        const rider = fav.rider;
        if (rider.activeTeamId == null || !top10Gc.has(rider.id)) continue;

        const role = resolveRiderRoleName(rider);
        if (role === 'edelhelfer') {
          if (!candidateTeams.includes(rider.activeTeamId)) {
            candidateTeams.push(rider.activeTeamId);
          }
        }
      }
    }

    if (candidateTeams.length > 0 && Math.random() < 0.5) {
      const randomIndex = randomInteger(0, candidateTeams.length - 1);
      superTeamId = candidateTeams[randomIndex];
    }
  }

  // Identify leaders for the selected Superteam (to protect from breakaway and bonus/malus)
  if (superTeamId != null) {
    const teamRiders = riders.filter(r => r.activeTeamId === superTeamId);
    const captains = teamRiders.filter(r => resolveRiderRoleName(r) === 'kapitaen');
    const coCaptains = teamRiders.filter(r => resolveRiderRoleName(r) === 'co-kapitaen');

    if (captains.length > 0) {
      captains.forEach(r => protectedLeaderIds.add(r.id));
      if (captains.length === 1 && coCaptains.length > 0) {
        const sortedCoCaptains = [...coCaptains].sort((a, b) => b.overallRating - a.overallRating || b.id - a.id);
        protectedLeaderIds.add(sortedCoCaptains[0].id);
      }
    } else if (coCaptains.length > 0) {
      const sortedCoCaptains = [...coCaptains].sort((a, b) => b.overallRating - a.overallRating || b.id - a.id);
      sortedCoCaptains.slice(0, 2).forEach(r => protectedLeaderIds.add(r.id));
    } else {
      // Fallback: use the best Edelhelfer by overall rating
      const edelhelfers = teamRiders.filter(r => resolveRiderRoleName(r) === 'edelhelfer');
      if (edelhelfers.length > 0) {
        const sortedEdelhelfers = [...edelhelfers].sort((a, b) => b.overallRating - a.overallRating || b.id - a.id);
        protectedLeaderIds.add(sortedEdelhelfers[0].id);
      }
    }
  }

  // Forced breakaway rider for selected Superteam
  let forcedRider: Rider | undefined;
  if (superTeamId != null) {
    const teamRiders = riders.filter(r => r.activeTeamId === superTeamId);
    const eligibleSuperteamRiders = teamRiders.filter(r => !protectedLeaderIds.has(r.id));
    if (eligibleSuperteamRiders.length > 0) {
      const sortedSupport = [...eligibleSuperteamRiders].sort(
        (a, b) => b.skills.attack - a.skills.attack || b.overallRating - a.overallRating || b.id - a.id
      );
      forcedRider = sortedSupport[0];
    }
  }

  const eligibleRiders = riders.filter((rider) => {
    if (rider.activeTeamId == null || topFavoriteIds.has(rider.id) || topGcIds.has(rider.id)) {
      return false;
    }

    if (superTeamId != null && rider.activeTeamId === superTeamId) {
      // Leader cannot go into breakaway
      if (protectedLeaderIds.has(rider.id)) {
        return false;
      }
      // Forced rider is already handled
      if (forcedRider != null && rider.id === forcedRider.id) {
        return false;
      }
    }

    if (isEarlyStageRace && gcLeaderTeamId != null && rider.activeTeamId === gcLeaderTeamId) {
      return false;
    }

    if (isEarlyStageRace && topFavoriteTeamIds.has(rider.activeTeamId)) {
      return false;
    }

    const roleName = resolveRiderRoleName(rider);
    if (isOneDayRace && (roleName === 'kapitaen' || roleName === 'co-kapitaen')) {
      return false;
    }

    if (isEarlyStageRace && roleName === 'kapitaen') {
      return false;
    }

    if (isEarlyStageRace && roleName === 'co-kapitaen' && teamHasCaptainInRace.get(rider.activeTeamId) !== true) {
      return false;
    }

    if (roleName === 'sprinter') {
      if (race.isStageRace && stage.stageNumber <= 5) {
        return false;
      }
      if (!race.isStageRace && ['Flat', 'Rolling', 'Hilly'].includes(stage.profile)) {
        return false;
      }
    }

    return true;
  });
  if (eligibleRiders.length === 0) {
    return null;
  }

  const weightByRiderId = new Map(eligibleRiders.map((rider) => [
    rider.id,
    resolveBreakawayWeightFactors(rider, {
      isEarlyStageRace,
      race,
      gcLeaderTeamId,
      stageHasMountainClassifications,
      topMountainIds,
      isHardStage,
    }),
  ]));

  const totalEligibleWeight = eligibleRiders.reduce((sum, rider) => sum + (weightByRiderId.get(rider.id)?.finalWeight ?? 0), 0);

  const selectedRiders = sampleWeightedWithoutReplacement(
    eligibleRiders,
    Math.max(0, Math.min(desiredBreakawaySize - (forcedRider ? 1 : 0), eligibleRiders.length)),
    (rider) => weightByRiderId.get(rider.id)?.finalWeight ?? 1,
  );
  if (forcedRider) {
    selectedRiders.push(forcedRider);
  }
  if (selectedRiders.length === 0) {
    return null;
  }

  console.groupCollapsed(
    `[BreakawaySelection] ${stage.profile} Etappe ${stage.stageNumber}: ${selectedRiders.length}/${desiredBreakawaySize} ausgewählt aus ${eligibleRiders.length}`,
  );
  console.log(`Gesamtgewicht im Pool: ${totalEligibleWeight.toFixed(2)}`);
  console.table(selectedRiders.map((rider) => {
    const weight = weightByRiderId.get(rider.id);
    return {
      Fahrer: `${rider.firstName} ${rider.lastName}`,
      Team: rider.activeTeamId,
      Rolle: rider.role?.name ?? null,
      Atk: rider.skills.attack,
      Hill: rider.skills.hill,
      Chance: `${(((totalEligibleWeight > 0 && weight != null ? weight.finalWeight / totalEligibleWeight : 0) * 100)).toFixed(2)}%`,
      Gewicht: (weight?.finalWeight ?? 1).toFixed(2),
      Attacke: `x${(weight?.attackFactor ?? 1).toFixed(2)}`,
      Superform: `x${weight?.superformFactor ?? 1}`,
      GC_Team: `x${(weight?.gcLeaderTeamFactor ?? 1).toFixed(2)}`,
      Berg: `x${weight?.mountainFactor ?? 1}`,
      Sprinter: `x${weight?.sprinterFactor ?? 1}`,
    };
  }));
  console.groupEnd();

  const stageDistanceMeters = stageSummary.distanceKm * 1000;
  const triggerDistanceMeters = randomInteger(0, Math.min(10000, Math.max(0, Math.floor(stageDistanceMeters * 0.1))));
  const phaseEndRange = resolveBreakawayPhaseEndRange(race, stage);
  const phaseEndDistanceMeters = Math.round(stageDistanceMeters * randomBetween(phaseEndRange.min, phaseEndRange.max));
  const groupPhaseLeadOutMeters = Math.round(stageDistanceMeters * randomBetween(0.1, 0.25));
  const groupPhaseEndDistanceMeters = Math.max(
    triggerDistanceMeters + 1000,
    Math.min(phaseEndDistanceMeters - 1000, phaseEndDistanceMeters - groupPhaseLeadOutMeters),
  );
  const breakawayBonus = stage.rolledBreakawayBonus ?? 0;
  const skillBonus = randomInteger(3 + breakawayBonus, 8 + breakawayBonus);

  return {
    riderIds: selectedRiders.map((rider) => rider.id),
    triggerDistanceMeters,
    groupPhaseEndDistanceMeters,
    phaseEndDistanceMeters,
    skillBonus,
    malusValue: randomInteger(5, 8),
    superTeamId,
  };
}