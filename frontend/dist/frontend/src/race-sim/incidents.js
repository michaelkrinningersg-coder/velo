const BASE_CRASH_CHANCE = 0.005;
const BASE_MECHANICAL_CHANCE = 0.005;
const EARLY_INCIDENT_THRESHOLD_PERCENT = 70;
const EARLY_RECOVERY_SECONDS = 1000;
const EARLY_RECOVERY_FORM_BONUS = 15;
const LATE_RECOVERY_SECONDS = 360;
const LATE_RECOVERY_FORM_BONUS = 8;
const BASE_DAY_FORM_PENALTY = -0.75;
const BASE_STAMINA_PENALTY = 10;
function randomBetween(min, max) {
    return min + (Math.random() * (max - min));
}
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
function isIncidentFreeStage(profile) {
    return profile === 'ITT' || profile === 'TTT';
}
function resolveSupportRiderIds(rider, riders) {
    if (rider.role?.name !== 'Kapitaen' || rider.activeTeamId == null) {
        return [];
    }
    return riders
        .filter((candidate) => (candidate.id !== rider.id
        && candidate.activeTeamId === rider.activeTeamId
        && (candidate.role?.name === 'Edelhelfer'
            || candidate.role?.name === 'Starke Helfer'
            || candidate.role?.name === 'Wassertraeger')))
        .map((candidate) => candidate.id);
}
function resolveCrashSeverity() {
    const roll = Math.random();
    if (roll < 0.1) {
        return 'severe';
    }
    if (roll < 0.35) {
        return 'medium';
    }
    return 'light';
}
function buildIncident(rider, riders, stageLengthKm, type) {
    const severity = type === 'crash' ? resolveCrashSeverity() : null;
    const triggerDistanceKm = Number(randomBetween(0.5, Math.max(0.6, stageLengthKm - 0.25)).toFixed(2));
    const triggerDistanceMeters = Math.round(triggerDistanceKm * 1000);
    const triggerDistancePercent = clamp((triggerDistanceKm / Math.max(0.1, stageLengthKm)) * 100, 0, 100);
    const isEarlyIncident = triggerDistancePercent <= EARLY_INCIDENT_THRESHOLD_PERCENT;
    return {
        riderId: rider.id,
        type,
        severity,
        triggerDistanceKm,
        triggerDistanceMeters,
        triggerDistancePercent,
        waitDurationSeconds: type === 'crash'
            ? Math.round(randomBetween(10, 60))
            : Math.round(randomBetween(10, 45)),
        recoverySeconds: isEarlyIncident ? EARLY_RECOVERY_SECONDS : LATE_RECOVERY_SECONDS,
        recoveryFormBonus: isEarlyIncident ? EARLY_RECOVERY_FORM_BONUS : LATE_RECOVERY_FORM_BONUS,
        dayFormPenalty: BASE_DAY_FORM_PENALTY,
        staminaPenalty: BASE_STAMINA_PENALTY,
        recoveryPenaltyStages: type === 'crash'
            ? (severity === 'light' ? [10, 5, 2] : [])
            : [],
        raceRecuperationPenalty: type === 'crash' ? (severity === 'medium' ? 15 : 0) : 0,
        supportRiderIds: resolveSupportRiderIds(rider, riders),
    };
}
export function precalculateRaceIncidents(riders, stage, stageLengthKm) {
    if (isIncidentFreeStage(stage.profile) || stageLengthKm <= 0) {
        return [];
    }
    const incidents = [];
    for (const rider of riders) {
        const crashRoll = Math.random();
        const mechanicalRoll = Math.random();
        const crashChance = BASE_CRASH_CHANCE * Math.max(0, stage.crashIncidentMultiplier ?? 1);
        const mechanicalChance = BASE_MECHANICAL_CHANCE * Math.max(0, stage.mechanicalIncidentMultiplier ?? 1);
        const crashHit = crashRoll < crashChance;
        const mechanicalHit = mechanicalRoll < mechanicalChance;
        if (!crashHit && !mechanicalHit) {
            continue;
        }
        const incidentType = crashHit && mechanicalHit
            ? (crashRoll <= mechanicalRoll ? 'crash' : 'mechanical')
            : crashHit
                ? 'crash'
                : 'mechanical';
        const incident = buildIncident(rider, riders, stageLengthKm, incidentType);
        if (incidentType === 'crash' && Math.random() < 0.01) {
            incident.isMassCrashTrigger = true;
            const numAffected = Math.floor(randomBetween(2, 26)); // 2 to 25
            const potentialVictims = riders.filter(r => r.id !== rider.id);
            const shuffled = [...potentialVictims].sort(() => 0.5 - Math.random());
            incident.massCrashPotentialRiderIds = shuffled.slice(0, numAffected).map(r => r.id);
            if (Math.random() < 0.20) {
                incident.hasAdditionalMechanical = true;
                incident.waitDurationSeconds += Math.round(randomBetween(10, 45));
            }
        }
        incidents.push(incident);
    }
    return incidents;
}
export function buildDynamicCrashIncident(rider, riders, triggerDistanceKm, stageLengthKm) {
    const severity = resolveCrashSeverity();
    const triggerDistanceMeters = Math.round(triggerDistanceKm * 1000);
    const triggerDistancePercent = clamp((triggerDistanceKm / Math.max(0.1, stageLengthKm)) * 100, 0, 100);
    const isEarlyIncident = triggerDistancePercent <= EARLY_INCIDENT_THRESHOLD_PERCENT;
    let waitDurationSeconds = Math.round(randomBetween(10, 60));
    let hasAdditionalMechanical = false;
    if (Math.random() < 0.20) {
        hasAdditionalMechanical = true;
        waitDurationSeconds += Math.round(randomBetween(10, 45));
    }
    return {
        riderId: rider.id,
        type: 'crash',
        severity,
        triggerDistanceKm,
        triggerDistanceMeters,
        triggerDistancePercent,
        waitDurationSeconds,
        recoverySeconds: isEarlyIncident ? EARLY_RECOVERY_SECONDS : LATE_RECOVERY_SECONDS,
        recoveryFormBonus: isEarlyIncident ? EARLY_RECOVERY_FORM_BONUS : LATE_RECOVERY_FORM_BONUS,
        dayFormPenalty: BASE_DAY_FORM_PENALTY,
        staminaPenalty: BASE_STAMINA_PENALTY,
        recoveryPenaltyStages: severity === 'light' ? [10, 5, 2] : [],
        raceRecuperationPenalty: severity === 'medium' ? 15 : 0,
        supportRiderIds: resolveSupportRiderIds(rider, riders),
        hasAdditionalMechanical
    };
}
export function precalculate_race_incidents(rider_list, stage_length, stage_profile) {
    return precalculateRaceIncidents(rider_list, {
        id: 0,
        raceId: 0,
        stageNumber: 1,
        date: '',
        profile: stage_profile,
        detailsCsvFile: '',
        startElevation: 0,
        finalSpreadStartPercent: 70,
        finalPushStartPercent: 90,
        finalSpreadDifficultyMultiplier: 1,
        crashIncidentMultiplier: 1,
        mechanicalIncidentMultiplier: 1,
    }, stage_length);
}
