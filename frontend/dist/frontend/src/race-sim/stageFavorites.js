function resolveDailyForm(riderId, input) {
    if (!input) {
        return 0;
    }
    if (input instanceof Map) {
        return input.get(riderId) ?? 0;
    }
    return input[riderId] ?? 0;
}
function roundToOne(value) {
    return Math.round(value * 10) / 10;
}
function resolveDistanceKm(stage, options) {
    const stageWithDistance = stage;
    return options?.distanceKm ?? stageWithDistance.distanceKm ?? 0;
}
function resolveElevationGainMeters(stage, options) {
    const stageWithElevation = stage;
    return options?.elevationGainMeters ?? stageWithElevation.elevationGainMeters ?? 0;
}
function resolveFormContribution(rider, dailyForm) {
    return dailyForm + (rider.formBonus ?? 0) + (rider.raceFormBonus ?? 0);
}
function resolveStaminaContribution(rider, distanceKm) {
    return rider.skills.stamina * (distanceKm / 300);
}
function calculateIttScore(rider, dailyForm, elevationGainMeters) {
    return rider.skills.timeTrial
        + resolveFormContribution(rider, dailyForm)
        + (rider.skills.mountain * (elevationGainMeters / 500));
}
function calculateRoadScore(rider, stage, distanceKm, dailyForm) {
    const staminaContribution = resolveStaminaContribution(rider, distanceKm);
    const formContribution = resolveFormContribution(rider, dailyForm);
    switch (stage.profile) {
        case 'Flat':
            return (0.8 * rider.skills.sprint) + (0.2 * rider.skills.flat) + formContribution + staminaContribution;
        case 'Rolling':
            return (0.7 * rider.skills.sprint) + (0.2 * rider.skills.flat) + (0.1 * rider.skills.hill) + formContribution + staminaContribution;
        case 'Hilly':
            return (0.4 * rider.skills.sprint) + (0.2 * rider.skills.flat) + (0.4 * rider.skills.hill) + formContribution + staminaContribution;
        case 'Hilly_Difficult':
            return (0.2 * rider.skills.sprint) + (0.1 * rider.skills.flat) + (0.7 * rider.skills.hill) + formContribution + staminaContribution;
        case 'Medium_Mountain':
            return (0.05 * rider.skills.sprint)
                + (0.1 * rider.skills.flat)
                + (0.35 * rider.skills.hill)
                + (0.45 * rider.skills.mediumMountain)
                + (0.05 * rider.skills.mountain)
                + formContribution
                + staminaContribution;
        case 'Mountain':
            return (0.05 * rider.skills.hill)
                + (0.2 * rider.skills.mediumMountain)
                + (0.75 * rider.skills.mountain)
                + formContribution
                + staminaContribution;
        case 'High_Mountain':
            return rider.skills.mountain + formContribution + staminaContribution;
        case 'Cobble':
            return (0.3 * rider.skills.sprint) + (0.2 * rider.skills.flat) + (0.5 * rider.skills.cobble) + formContribution + staminaContribution;
        case 'Cobble_Hill':
            return (0.3 * rider.skills.sprint) + (0.2 * rider.skills.flat) + (0.2 * rider.skills.hill) + (0.3 * rider.skills.cobble) + formContribution + staminaContribution;
        default:
            return (0.8 * rider.skills.sprint) + (0.2 * rider.skills.flat) + formContribution + staminaContribution;
    }
}
function calculateRiderScore(rider, stage, distanceKm, elevationGainMeters, dailyForm) {
    if (stage.profile === 'ITT' || stage.profile === 'TTT') {
        return calculateIttScore(rider, dailyForm, elevationGainMeters);
    }
    return calculateRoadScore(rider, stage, distanceKm, dailyForm);
}
function toFavoriteItem(candidate, rank) {
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
export function calculateStageFavorites(riders, teams, stage, options) {
    const distanceKm = resolveDistanceKm(stage, options);
    const elevationGainMeters = resolveElevationGainMeters(stage, options);
    const teamById = new Map(teams.map((team) => [team.id, team]));
    if (stage.profile === 'TTT') {
        const ridersByTeamId = new Map();
        for (const rider of riders) {
            if (rider.activeTeamId == null) {
                continue;
            }
            const existing = ridersByTeamId.get(rider.activeTeamId) ?? [];
            existing.push(rider);
            ridersByTeamId.set(rider.activeTeamId, existing);
        }
        const teamFavorites = [...ridersByTeamId.entries()].map(([teamId, teamRiders]) => {
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
            };
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
        }));
    }
    const riderRanking = options != null
        ? calculateStageFavoriteRiderRanking(riders, teams, stage, options)
        : calculateStageFavoriteRiderRanking(riders, teams, stage);
    return riderRanking
        .sort((left, right) => right.effectiveSkill - left.effectiveSkill || left.rider.id - right.rider.id)
        .slice(0, 20)
        .map((candidate, index) => toFavoriteItem(candidate, index + 1));
}
export function calculateStageFavoriteRiderRanking(riders, teams, stage, options) {
    const distanceKm = resolveDistanceKm(stage, options);
    const elevationGainMeters = resolveElevationGainMeters(stage, options);
    const teamById = new Map(teams.map((team) => [team.id, team]));
    return riders
        .map((rider) => ({
        rider,
        teamName: rider.activeTeamId != null ? (teamById.get(rider.activeTeamId)?.name ?? `Team ${rider.activeTeamId}`) : '—',
        effectiveSkill: calculateRiderScore(rider, stage, distanceKm, elevationGainMeters, resolveDailyForm(rider.id, options?.dailyFormByRiderId)),
    }))
        .sort((left, right) => right.effectiveSkill - left.effectiveSkill || left.rider.id - right.rider.id);
}
