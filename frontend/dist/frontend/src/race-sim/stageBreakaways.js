import { collectStageBoundaryMarkers, isMountainClassificationMarker } from './stageSummary';
function randomInteger(min, max) {
    const normalizedMin = Math.ceil(Math.min(min, max));
    const normalizedMax = Math.floor(Math.max(min, max));
    return Math.floor(Math.random() * ((normalizedMax - normalizedMin) + 1)) + normalizedMin;
}
function randomBetween(min, max) {
    return min + (Math.random() * (max - min));
}
function shuffleInPlace(values) {
    for (let index = values.length - 1; index > 0; index -= 1) {
        const swapIndex = randomInteger(0, index);
        [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
    }
    return values;
}
function sampleWithoutReplacement(values, count) {
    if (count <= 0 || values.length === 0) {
        return [];
    }
    return shuffleInPlace([...values]).slice(0, Math.min(count, values.length));
}
function sampleWeightedWithoutReplacement(values, count, resolveWeight) {
    const pool = [...values];
    const selected = [];
    while (selected.length < count && pool.length > 0) {
        const totalWeight = pool.reduce((sum, value) => sum + Math.max(0.0001, resolveWeight(value)), 0);
        let roll = Math.random() * totalWeight;
        let selectedIndex = 0;
        for (let index = 0; index < pool.length; index += 1) {
            roll -= Math.max(0.0001, resolveWeight(pool[index]));
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
function getTopFavoriteIds(favorites, limit) {
    return new Set(favorites
        .filter((favorite) => favorite.kind === 'rider' && favorite.riderId != null)
        .slice(0, limit)
        .map((favorite) => favorite.riderId));
}
function getTopGcIds(gcStandings, limit) {
    return new Set(gcStandings.slice(0, limit).map((standing) => standing.riderId));
}
function getTopClassificationIds(standings, limit) {
    return new Set(standings.slice(0, limit).map((standing) => standing.riderId));
}
function getTopClassificationIdsWithExclusions(standings, excludedIds, limit) {
    return new Set(standings
        .filter((standing) => !excludedIds.has(standing.riderId))
        .slice(0, limit)
        .map((standing) => standing.riderId));
}
function normalizeRoleName(value) {
    return (value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}
function resolveRiderRoleName(rider) {
    return normalizeRoleName(rider.role?.name);
}
function hasMountainClassifications(stageSummary) {
    return collectStageBoundaryMarkers(stageSummary).some(({ marker }) => isMountainClassificationMarker(marker));
}
function resolveAttackInitiativeWeight(rider) {
    return Math.max(1, Math.pow(10, (rider.skills.attack - 65) / 10));
}
function resolveBreakawayWeightFactors(rider, options) {
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
function isHarderThanHillyStage(stage) {
    return stage.profile === 'Hilly_Difficult'
        || stage.profile === 'Medium_Mountain'
        || stage.profile === 'Mountain'
        || stage.profile === 'High_Mountain'
        || stage.profile === 'Cobble_Hill';
}
function resolveGcLeaderTeamId(riders, gcStandings) {
    const gcLeaderId = gcStandings[0]?.riderId ?? null;
    if (gcLeaderId == null) {
        return null;
    }
    return riders.find((rider) => rider.id === gcLeaderId)?.activeTeamId ?? null;
}
function getTopFavoriteTeamIds(favorites, riders, limit) {
    const riderById = new Map(riders.map((rider) => [rider.id, rider]));
    const teamIds = new Set();
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
function buildTeamHasCaptainInRace(riders) {
    const result = new Map();
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
function resolveBreakawaySizeBounds(race, stage, riderCount) {
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
function resolveBreakawayPhaseEndRange(race, stage) {
    if (!race.isStageRace || stage.stageNumber <= 8) {
        return { min: 0.45, max: 0.6 };
    }
    if (stage.stageNumber <= 15) {
        return { min: 0.45, max: 0.75 };
    }
    return { min: 0.5, max: 0.85 };
}
export function precalculateStageBreakaway(riders, race, stage, stageSummary, stageFavorites, gcStandings, mountainStandings) {
    if ((stage.profile === 'ITT' || stage.profile === 'TTT') || riders.length === 0 || stageSummary.distanceKm <= 0) {
        return null;
    }
    const riderCount = riders.length;
    const { min: minBreakawaySize, max: maxBreakawaySize } = resolveBreakawaySizeBounds(race, stage, riderCount);
    const desiredBreakawaySize = randomInteger(minBreakawaySize, maxBreakawaySize);
    const isEarlyStageRace = race.isStageRace && stage.stageNumber <= 10;
    const gcLeaderTeamId = resolveGcLeaderTeamId(riders, gcStandings);
    const topFavoriteTeamIds = isEarlyStageRace ? getTopFavoriteTeamIds(stageFavorites, riders, 5) : new Set();
    const teamHasCaptainInRace = isEarlyStageRace ? buildTeamHasCaptainInRace(riders) : new Map();
    const stageHasMountainClassifications = hasMountainClassifications(stageSummary);
    const topFavoriteIds = getTopFavoriteIds(stageFavorites, 5);
    const topGcIds = getTopGcIds(gcStandings, 10);
    const excludedByFavoritesOrGc = new Set([...topFavoriteIds, ...topGcIds]);
    const topMountainIds = stageHasMountainClassifications
        ? getTopClassificationIdsWithExclusions(mountainStandings, excludedByFavoritesOrGc, 5)
        : new Set();
    const isHardStage = isHarderThanHillyStage(stage);
    const eligibleRiders = riders.filter((rider) => {
        if (rider.activeTeamId == null || topFavoriteIds.has(rider.id) || topGcIds.has(rider.id)) {
            return false;
        }
        if (isEarlyStageRace && gcLeaderTeamId != null && rider.activeTeamId === gcLeaderTeamId) {
            return false;
        }
        if (isEarlyStageRace && topFavoriteTeamIds.has(rider.activeTeamId)) {
            return false;
        }
        const roleName = resolveRiderRoleName(rider);
        if (isEarlyStageRace && roleName === 'kapitaen') {
            return false;
        }
        if (isEarlyStageRace && roleName === 'co-kapitaen' && teamHasCaptainInRace.get(rider.activeTeamId) !== true) {
            return false;
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
    const selectedRiders = sampleWeightedWithoutReplacement(eligibleRiders, Math.min(desiredBreakawaySize, eligibleRiders.length), (rider) => weightByRiderId.get(rider.id)?.finalWeight ?? 1);
    if (selectedRiders.length === 0) {
        return null;
    }
    console.groupCollapsed(`[BreakawaySelection] ${stage.profile} Etappe ${stage.stageNumber}: ${selectedRiders.length}/${desiredBreakawaySize} ausgewählt aus ${eligibleRiders.length}`);
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
    const groupPhaseEndDistanceMeters = Math.max(triggerDistanceMeters + 1000, Math.min(phaseEndDistanceMeters - 1000, phaseEndDistanceMeters - groupPhaseLeadOutMeters));
    const skillBonus = randomInteger(3, 8);
    return {
        riderIds: selectedRiders.map((rider) => rider.id),
        triggerDistanceMeters,
        groupPhaseEndDistanceMeters,
        phaseEndDistanceMeters,
        skillBonus,
        malusValue: randomInteger(5, 8),
    };
}
