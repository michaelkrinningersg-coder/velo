"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageResultCommitService = void 0;
const GameStateRepository_1 = require("../db/repositories/GameStateRepository");
const RaceRepository_1 = require("../db/repositories/RaceRepository");
const ResultRepository_1 = require("../db/repositories/ResultRepository");
const RiderRepository_1 = require("../db/repositories/RiderRepository");
const TeamRepository_1 = require("../db/repositories/TeamRepository");
const GameStateService_1 = require("../game/GameStateService");
const stageResultRules_1 = require("../../../shared/stageResultRules");
const RaceRosterService_1 = require("./RaceRosterService");
const RESULT_TYPES = {
    stage: 1,
    gc: 2,
    points: 3,
    mountain: 4,
    youth: 5,
    team: 6,
    breakaway: 7,
};
const SUPPORTED_RESULT_TYPES = [
    { id: RESULT_TYPES.stage, name: 'Stage' },
    { id: RESULT_TYPES.gc, name: 'GC' },
    { id: RESULT_TYPES.points, name: 'Points' },
    { id: RESULT_TYPES.mountain, name: 'Mountain' },
    { id: RESULT_TYPES.youth, name: 'Youth' },
    { id: RESULT_TYPES.team, name: 'Team' },
    { id: RESULT_TYPES.breakaway, name: 'Breakaway' },
];
function tableExists(db, tableName) {
    const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName);
    return row != null;
}
function parseRankedValues(serialized) {
    if (!serialized)
        return [];
    return serialized
        .split('|')
        .map((value) => Number.parseInt(value.trim(), 10))
        .filter((value) => Number.isFinite(value));
}
function randomInteger(min, max) {
    return Math.floor(Math.random() * ((max - min) + 1)) + min;
}
function addDaysIso(isoDate, days) {
    const [year, month, day] = isoDate.split('-').map((value) => Number(value));
    const date = new Date(Date.UTC(year, Math.max(0, month - 1), day));
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
}
function rankPerformanceEntries(entries, profile) {
    return (0, stageResultRules_1.rankStageResultEntries)(entries, profile);
}
function resolveTimeLimitSeconds(stage, performance) {
    return (0, stageResultRules_1.resolveStageTimeLimitSeconds)(stage.profile, performance.map((entry) => entry.stageTimeSeconds));
}
function splitOtlPerformance(stage, performance) {
    const timeLimitSeconds = resolveTimeLimitSeconds(stage, performance);
    if (timeLimitSeconds == null) {
        return { classifiedPerformance: performance, otlEntries: [] };
    }
    const classifiedPerformance = [];
    const otlEntries = [];
    const timeLimitPercent = (0, stageResultRules_1.resolveTimeLimitPercent)(stage.profile);
    for (const entry of performance) {
        if (entry.stageTimeSeconds <= timeLimitSeconds) {
            classifiedPerformance.push(entry);
            continue;
        }
        otlEntries.push({
            riderId: entry.rider.id,
            statusReason: `OTL +${Math.round(entry.stageTimeSeconds - timeLimitSeconds)}s ueber Zeitlimit (${timeLimitPercent}%)`,
        });
    }
    return { classifiedPerformance, otlEntries };
}
function filterMarkerClassificationsForClassifiedRiders(classifications, classifiedRiderIds) {
    return classifications.map((classification) => ({
        ...classification,
        entries: classification.entries.filter((entry) => classifiedRiderIds.has(entry.riderId)),
    }));
}
function normalizeRoadStageTimeGroups(entries, profile) {
    if ((0, stageResultRules_1.isTimeTrialProfile)(profile)) {
        return;
    }
    const sortedByTime = [...entries].sort((left, right) => left.stageTimeSeconds - right.stageTimeSeconds || right.photoFinishScore - left.photoFinishScore || left.riderId - right.riderId);
    let groupTime = null;
    let previousTime = null;
    for (const entry of sortedByTime) {
        const originalTime = entry.stageTimeSeconds;
        if (groupTime == null || previousTime == null || originalTime - previousTime > stageResultRules_1.TIME_TIE_THRESHOLD_SECONDS) {
            groupTime = originalTime;
        }
        entry.stageTimeSeconds = groupTime;
        previousTime = originalTime;
    }
}
function normalizeTimeRows(rows, applyTimeTieGroups) {
    if (!applyTimeTieGroups) {
        return [...rows].sort((left, right) => left.timeSeconds - right.timeSeconds || left.riderId - right.riderId);
    }
    const sortedByTime = [...rows].sort((left, right) => left.timeSeconds - right.timeSeconds || left.riderId - right.riderId);
    const normalized = [];
    let groupTime = null;
    let previousTime = null;
    for (const row of sortedByTime) {
        if (groupTime == null || previousTime == null || row.timeSeconds - previousTime > stageResultRules_1.TIME_TIE_THRESHOLD_SECONDS) {
            groupTime = row.timeSeconds;
        }
        normalized.push({ ...row, timeSeconds: groupTime });
        previousTime = row.timeSeconds;
    }
    return normalized.sort((left, right) => left.timeSeconds - right.timeSeconds || left.riderId - right.riderId);
}
function normalizeMarkerEntries(entries, applyTimeTieGroups) {
    if (!applyTimeTieGroups) {
        return [...entries].sort((left, right) => left.rank - right.rank || left.crossingTimeSeconds - right.crossingTimeSeconds || right.photoFinishScore - left.photoFinishScore || left.riderId - right.riderId);
    }
    const sortedByTime = [...entries].sort((left, right) => left.crossingTimeSeconds - right.crossingTimeSeconds || right.photoFinishScore - left.photoFinishScore || left.riderId - right.riderId);
    const leaderTime = sortedByTime[0]?.crossingTimeSeconds ?? 0;
    const ranked = [];
    let group = [];
    let groupLeaderTime = 0;
    let previousTime = null;
    const flushGroup = () => {
        const gapSeconds = Math.max(0, groupLeaderTime - leaderTime);
        const orderedGroup = group.sort((left, right) => right.photoFinishScore - left.photoFinishScore || left.riderId - right.riderId);
        for (const entry of orderedGroup) {
            ranked.push({
                ...entry,
                rank: ranked.length + 1,
                gapSeconds,
            });
        }
    };
    for (const entry of sortedByTime) {
        if (group.length === 0) {
            group = [entry];
            groupLeaderTime = entry.crossingTimeSeconds;
            previousTime = entry.crossingTimeSeconds;
            continue;
        }
        if (previousTime != null && entry.crossingTimeSeconds - previousTime <= stageResultRules_1.TIME_TIE_THRESHOLD_SECONDS) {
            group.push(entry);
            previousTime = entry.crossingTimeSeconds;
            continue;
        }
        flushGroup();
        group = [entry];
        groupLeaderTime = entry.crossingTimeSeconds;
        previousTime = entry.crossingTimeSeconds;
    }
    if (group.length > 0) {
        flushGroup();
    }
    return ranked;
}
function normalizeMarkerClassifications(classifications, applyTimeTieGroups) {
    return classifications.map((classification) => ({
        ...classification,
        entries: normalizeMarkerEntries(classification.entries, applyTimeTieGroups),
    }));
}
function usesMountainStageSprintFinishPoints(profile) {
    return !['ITT', 'TTT', 'Flat', 'Rolling', 'Hilly'].includes(profile);
}
class StageResultCommitService {
    constructor(db) {
        this.db = db;
        const raceRepo = new RaceRepository_1.RaceRepository(db);
        const teamRepo = new TeamRepository_1.TeamRepository(db);
        const gsRepo = new GameStateRepository_1.GameStateRepository(db);
        const riderRepo = new RiderRepository_1.RiderRepository(db);
        this.repo = {
            // RaceRepository methods
            getStageById: (id) => raceRepo.getStageById(id),
            getRaceById: (id) => raceRepo.getRaceById(id),
            getRaceRiders: (raceId) => raceRepo.getRaceRiders(raceId),
            getRaceProgramsForRace: (raceId) => raceRepo.getRaceProgramsForRace(raceId),
            getStageRiders: (stageId) => raceRepo.getStageRiders(stageId),
            // TeamRepository methods
            getTeams: (teamId) => teamRepo.getTeams(teamId),
            // RiderRepository methods
            getRiders: (teamId) => riderRepo.getRiders(teamId),
            // GameStateRepository methods
            getCurrentSeason: () => gsRepo.getCurrentSeason(),
            getCurrentDate: () => gsRepo.getCurrentDate(),
            getFullyClassifiedStageRaceRiderIds: (raceId, upTo) => gsRepo.getFullyClassifiedStageRaceRiderIds(raceId, upTo),
            applyIncidentRaceState: (raceId, incidents) => gsRepo.applyIncidentRaceState(raceId, incidents),
            markStageEntriesFinished: (stageId, riderIds) => gsRepo.markStageEntriesFinished(stageId, riderIds),
            updateStageEntryStatus: (stageId, riderId, status, reason) => gsRepo.updateStageEntryStatus(stageId, riderId, status, reason),
            syncSeasonPointEventsForSeason: (season) => gsRepo.syncSeasonPointEventsForSeason(season),
            ensureStageEntries: (stage) => gsRepo.ensureStageEntries(stage),
            prepareStageRaceFatigue: (raceId, stageNumber, riderIds) => gsRepo.prepareStageRaceFatigue(raceId, stageNumber, riderIds),
            attachStageRaceFatigue: (raceId, riders, stageNumber) => raceRepo.attachStageRaceFatigue(raceId, riders, stageNumber),
            clearStageEntries: (stageId) => gsRepo.clearStageEntries(stageId),
        };
    }
    commitRealtimeStage(stageId, entries, markerClassifications = [], incidents = [], events = [], leadoutContributions) {
        const { race, stage, riders, teamsById } = this.loadStageContext(stageId);
        const rosterById = new Map(riders.map((rider) => [rider.id, rider]));
        const sanitizedEntries = [...entries]
            .filter((entry) => Number.isFinite(entry.riderId))
            .map((entry) => ({
            riderId: entry.riderId,
            finishStatus: entry.finishStatus,
            isBreakaway: entry.isBreakaway === true,
            statusReason: entry.statusReason ?? null,
            finishTimeSeconds: entry.finishStatus === 'finished' && entry.finishTimeSeconds != null && Number.isFinite(entry.finishTimeSeconds)
                ? (0, stageResultRules_1.roundStageResultSeconds)(entry.finishTimeSeconds)
                : null,
            photoFinishScore: Number.isFinite(entry.photoFinishScore) ? entry.photoFinishScore : 0,
            leadoutRiderId: entry.leadoutRiderId ?? null,
            leadoutBonus: entry.leadoutBonus ?? null,
        }))
            .sort((left, right) => (left.finishTimeSeconds ?? Number.POSITIVE_INFINITY) - (right.finishTimeSeconds ?? Number.POSITIVE_INFINITY) || (right.photoFinishScore ?? 0) - (left.photoFinishScore ?? 0) || left.riderId - right.riderId);
        if (sanitizedEntries.length !== riders.length) {
            throw new Error('Die Live-Simulation muss genau einen Zielstatus für jeden Starter übergeben.');
        }
        const seenRiderIds = new Set();
        for (const entry of sanitizedEntries) {
            if (seenRiderIds.has(entry.riderId)) {
                throw new Error(`Live-Ergebnis für Fahrer ${entry.riderId} wurde doppelt übergeben.`);
            }
            if (entry.finishStatus === 'finished' && entry.finishTimeSeconds == null) {
                throw new Error(`Fahrer ${entry.riderId} wurde als Finisher ohne Zielzeit uebergeben.`);
            }
            seenRiderIds.add(entry.riderId);
        }
        const finishedEntries = sanitizedEntries.filter((entry) => entry.finishStatus === 'finished');
        const dnfEntries = sanitizedEntries.filter((entry) => entry.finishStatus === 'dnf');
        const performance = finishedEntries.map((entry) => {
            const rider = rosterById.get(entry.riderId);
            if (!rider) {
                throw new Error(`Live-Ergebnis für unbekannten Fahrer ${entry.riderId} erhalten.`);
            }
            const team = teamsById.get(rider.activeTeamId ?? -1);
            if (!team) {
                throw new Error(`Team für Fahrer ${rider.firstName} ${rider.lastName} konnte nicht geladen werden.`);
            }
            return {
                rider,
                riderId: rider.id,
                team,
                dayForm: 1,
                performanceScore: 0,
                rawTimeSeconds: entry.finishTimeSeconds ?? 0,
                stageTimeSeconds: entry.finishTimeSeconds ?? 0,
                photoFinishScore: entry.photoFinishScore ?? 0,
                points: 0,
                gcBonusSeconds: 0,
                mountainPoints: 0,
                isBreakaway: entry.isBreakaway === true,
                leadoutRiderId: entry.leadoutRiderId,
                leadoutBonus: entry.leadoutBonus,
            };
        });
        if (seenRiderIds.size !== riders.length) {
            throw new Error('Die Live-Simulation hat nicht alle Starter geliefert.');
        }
        const { classifiedPerformance, otlEntries } = splitOtlPerformance(stage, performance);
        const classifiedRiderIds = new Set(classifiedPerformance.map((entry) => entry.rider.id));
        const normalizedMarkerClassifications = filterMarkerClassificationsForClassifiedRiders(normalizeMarkerClassifications(markerClassifications, !(0, stageResultRules_1.isTimeTrialProfile)(stage.profile)), classifiedRiderIds);
        const awardedMarkerClassifications = this.applyMarkerClassificationAwards(race, stage, classifiedPerformance, normalizedMarkerClassifications);
        normalizeRoadStageTimeGroups(classifiedPerformance, stage.profile);
        this.applyFinishLineAwards(race, stage, classifiedPerformance, {
            awardPoints: stage.profile !== 'TTT',
            awardTimeBonuses: stage.profile !== 'ITT' && stage.profile !== 'TTT',
        });
        const dnsEvents = this.loadDnsEvents(race, stage);
        const combinedEvents = [...dnsEvents, ...events];
        ResultRepository_1.ResultRepository.inMemoryStageEvents.set(stageId, combinedEvents);
        const breakawayRiderIds = new Set();
        for (const entry of sanitizedEntries) {
            if (entry.isBreakaway) {
                breakawayRiderIds.add(entry.riderId);
            }
        }
        return this.persistStagePerformance(race, stage, classifiedPerformance, awardedMarkerClassifications, [...dnfEntries, ...otlEntries], incidents, breakawayRiderIds, events, leadoutContributions);
    }
    loadDnsEvents(race, stage) {
        const tableExists = (db, name) => {
            const row = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(name);
            return !!row;
        };
        if (!tableExists(this.db, 'rider_daily_state')) {
            return [];
        }
        const dnsRows = this.db.prepare(`
      SELECT r.id, r.first_name, r.last_name, rds.health_status, re.team_id
      FROM race_entries re
      JOIN riders r ON r.id = re.rider_id
      JOIN rider_daily_state rds ON rds.rider_id = re.rider_id
      WHERE re.race_id = ?
        AND rds.unavailable_days_remaining > 0
        AND re.rider_id NOT IN (
          SELECT DISTINCT se.rider_id
          FROM stage_entries se
          JOIN stages s ON s.id = se.stage_id
          WHERE se.race_id = ?
            AND s.stage_number < ?
            AND se.status IN ('dns', 'dnf')
        )
    `).all(race.id, race.id, stage.stageNumber);
        const previousGcStandings = new ResultRepository_1.ResultRepository(this.db).getPreviousGcStandings(race.id, stage.stageNumber);
        const previousGcMap = new Map(previousGcStandings.map(s => [s.riderId, s.rank]));
        return dnsRows.map((row, index) => {
            const riderName = `${row.first_name} ${row.last_name}`;
            const gcRank = previousGcMap.get(row.id);
            const riderNameFormatted = gcRank != null ? `${riderName} (${gcRank}.)` : riderName;
            const reason = row.health_status === 'ill' ? 'Krankheitsbedingt' : 'Verletzungsbedingt';
            return {
                id: -1000 - index,
                elapsedSeconds: 0,
                riderId: row.id,
                riderName: riderName,
                riderTeamId: row.team_id,
                type: 'dnf',
                tone: 'danger',
                title: `${riderNameFormatted} nicht am Start`,
                detail: `${reason} nicht am Start der Etappe.`,
                kmMark: 0,
            };
        });
    }
    loadStageContext(stageId) {
        if (!tableExists(this.db, 'results') || !tableExists(this.db, 'result_types')) {
            throw new Error('Das Savegame verwendet noch kein Results-Schema. Bitte eine neue Karriere mit dem aktuellen Build anlegen.');
        }
        const stage = this.repo.getStageById(stageId);
        if (!stage) {
            throw new Error(`Stage ${stageId} wurde nicht gefunden.`);
        }
        const race = this.repo.getRaceById(stage.raceId);
        if (!race || !race.category?.bonusSystem) {
            throw new Error(`Rennen ${stage.raceId} konnte nicht vollständig geladen werden.`);
        }
        this.ensureStageCanBeSimulated(stage);
        const riders = (0, RaceRosterService_1.ensureRaceEntries)(this.db, this.repo, race, stage);
        if (riders.length === 0) {
            throw new Error('Für dieses Rennen konnten keine Fahrer für die Startliste bestimmt werden.');
        }
        const teamsById = new Map(this.repo.getTeams().map((team) => [team.id, team]));
        const missingTeam = riders.find((rider) => rider.activeTeamId == null || !teamsById.has(rider.activeTeamId));
        if (missingTeam) {
            throw new Error(`Team für Fahrer ${missingTeam.firstName} ${missingTeam.lastName} konnte nicht aufgelöst werden.`);
        }
        return { race, stage, riders, teamsById };
    }
    applyFinishLineAwards(race, stage, performance, options = { awardPoints: true, awardTimeBonuses: true }) {
        if (!race.category?.bonusSystem) {
            return;
        }
        const finishPointValues = options.awardPoints && race.isStageRace
            ? parseRankedValues(usesMountainStageSprintFinishPoints(stage.profile)
                ? race.category.bonusSystem.pointsMountainStage
                : race.category.bonusSystem.pointsSprintFinish)
            : [];
        const finishBonusValues = options.awardTimeBonuses
            ? parseRankedValues(race.category.bonusSystem.bonusSecondsFinal)
            : [];
        const sorted = rankPerformanceEntries(performance, stage.profile);
        finishPointValues.forEach((points, index) => {
            const entry = sorted[index];
            if (!entry)
                return;
            entry.points += points;
        });
        finishBonusValues.forEach((bonusSeconds, index) => {
            const entry = sorted[index];
            if (!entry)
                return;
            entry.gcBonusSeconds += bonusSeconds;
        });
    }
    applyMarkerClassificationAwards(race, stage, performance, markerClassifications) {
        if (markerClassifications.length === 0) {
            return [];
        }
        if (!race.isStageRace || !race.category?.bonusSystem) {
            return markerClassifications.map((classification) => ({
                ...classification,
                entries: classification.entries.map((entry) => ({
                    ...entry,
                    pointsAwarded: entry.pointsAwarded ?? 0,
                })),
            }));
        }
        const sprintPointValues = parseRankedValues(race.category.bonusSystem.pointsSprintIntermediate);
        const sprintBonusValues = parseRankedValues(race.category.bonusSystem.bonusSecondsIntermediate);
        const mountainPointValues = {
            HC: parseRankedValues(race.category.bonusSystem.pointsMountainHc),
            '1': parseRankedValues(race.category.bonusSystem.pointsMountainCat1),
            '2': parseRankedValues(race.category.bonusSystem.pointsMountainCat2),
            '3': parseRankedValues(race.category.bonusSystem.pointsMountainCat3),
            '4': parseRankedValues(race.category.bonusSystem.pointsMountainCat4),
        };
        const performanceByRiderId = new Map(performance.map((entry) => [entry.rider.id, entry]));
        return markerClassifications.map((classification) => {
            const awardedEntries = classification.entries.map((markerEntry, index) => {
                let pointsAwarded = 0;
                const performanceEntry = performanceByRiderId.get(markerEntry.riderId) ?? null;
                if (classification.markerType === 'sprint_intermediate' && stage.profile !== 'ITT' && stage.profile !== 'TTT') {
                    pointsAwarded = sprintPointValues[index] ?? 0;
                    if (performanceEntry) {
                        performanceEntry.points += pointsAwarded;
                        performanceEntry.gcBonusSeconds += sprintBonusValues[index] ?? 0;
                    }
                }
                if ((classification.markerType === 'climb_top' || classification.markerType === 'finish_hill' || classification.markerType === 'finish_mountain')
                    && classification.markerCategory != null
                    && classification.markerCategory !== 'Sprint') {
                    pointsAwarded = mountainPointValues[classification.markerCategory][index] ?? 0;
                    if (performanceEntry) {
                        performanceEntry.mountainPoints += pointsAwarded;
                    }
                }
                return {
                    ...markerEntry,
                    pointsAwarded,
                };
            });
            return {
                ...classification,
                entries: awardedEntries,
            };
        });
    }
    persistStagePerformance(race, stage, performance, markerClassifications = [], dnfEntries = [], incidents = [], breakawayRiderIds = new Set(), events = [], leadoutContributions) {
        const rankedPerformance = rankPerformanceEntries(performance, stage.profile);
        const previousStageId = this.getPreviousSimulatedStageId(stage.raceId, stage.stageNumber);
        const previousGc = this.loadPreviousRiderMetricMap(previousStageId, RESULT_TYPES.gc, 'time_seconds');
        const previousPoints = this.loadPreviousRiderMetricMap(previousStageId, RESULT_TYPES.points, 'points');
        const previousMountain = this.loadPreviousRiderMetricMap(previousStageId, RESULT_TYPES.mountain, 'points');
        const previousTeam = this.loadPreviousTeamMetricMap(previousStageId, RESULT_TYPES.team, 'time_seconds');
        const classificationEligibility = race.isStageRace && stage.stageNumber > 1
            ? new Set(this.repo.getFullyClassifiedStageRaceRiderIds(race.id, stage.stageNumber - 1))
            : null;
        const classificationPerformance = classificationEligibility == null
            ? performance
            : performance.filter((entry) => classificationEligibility.has(entry.rider.id));
        const ridersById = new Map(performance.map((entry) => [entry.rider.id, entry.rider]));
        const stageRows = stage.profile === 'TTT'
            ? [...new Map(rankedPerformance.map((entry) => [entry.team.id, {
                        teamId: entry.team.id,
                        timeSeconds: entry.stageTimeSeconds,
                    }])).values()]
                .sort((left, right) => left.timeSeconds - right.timeSeconds || left.teamId - right.teamId)
                .map((entry, index) => ({
                rank: index + 1,
                riderId: null,
                teamId: entry.teamId,
                timeSeconds: entry.timeSeconds,
                points: null,
            }))
            : rankedPerformance.map((entry, index) => ({
                rank: index + 1,
                riderId: entry.rider.id,
                teamId: entry.team.id,
                timeSeconds: entry.stageTimeSeconds,
                points: race.isStageRace ? entry.points : null,
                isBreakaway: entry.isBreakaway === true,
                leadoutRiderId: entry.leadoutRiderId,
                leadoutBonus: entry.leadoutBonus,
            }));
        const gcRows = normalizeTimeRows([...classificationPerformance]
            .map((entry) => ({
            riderId: entry.rider.id,
            teamId: entry.team.id,
            timeSeconds: (previousGc.get(entry.rider.id) ?? 0) + entry.stageTimeSeconds - entry.gcBonusSeconds,
        })), !(0, stageResultRules_1.isTimeTrialProfile)(stage.profile))
            .map((entry, index) => ({ ...entry, rank: index + 1, points: null }));
        const pointsRows = race.isStageRace
            ? [...classificationPerformance]
                .map((entry) => ({
                riderId: entry.rider.id,
                teamId: entry.team.id,
                points: (previousPoints.get(entry.rider.id) ?? 0) + entry.points,
            }))
                .sort((left, right) => right.points - left.points || left.riderId - right.riderId)
                .map((entry, index) => ({ ...entry, rank: index + 1, timeSeconds: null }))
            : [];
        // For mountain classification tie-breaking: when points are equal, use stage
        // finish rank (crossing order). This is especially important at mountain finishes
        // where the finish line IS the mountain top.
        const stageRankByRiderId = new Map(stageRows
            .filter((r) => r.riderId != null)
            .map((r) => [r.riderId, r.rank]));
        const mountainRows = race.isStageRace
            ? [...classificationPerformance]
                .map((entry) => ({
                riderId: entry.rider.id,
                teamId: entry.team.id,
                points: (previousMountain.get(entry.rider.id) ?? 0) + entry.mountainPoints,
            }))
                .sort((left, right) => right.points - left.points
                || (stageRankByRiderId.get(left.riderId) ?? 9999) - (stageRankByRiderId.get(right.riderId) ?? 9999)
                || left.riderId - right.riderId)
                .map((entry, index) => ({ ...entry, rank: index + 1, timeSeconds: null }))
            : [];
        const currentSeason = this.repo.getCurrentSeason();
        const youthRows = race.isStageRace
            ? gcRows
                .filter((entry) => {
                const rider = ridersById.get(entry.riderId);
                return rider != null && currentSeason - rider.birthYear <= 25;
            })
                .map((entry, index) => ({
                rank: index + 1,
                riderId: entry.riderId,
                teamId: entry.teamId,
                timeSeconds: entry.timeSeconds,
                points: null,
            }))
            : [];
        const teamIds = [...new Set(rankedPerformance.map((entry) => entry.team.id))];
        const stageTeamTimes = new Map();
        for (const teamId of teamIds) {
            const teamEntries = rankedPerformance
                .filter((entry) => entry.team.id === teamId)
                .sort((left, right) => left.stageTimeSeconds - right.stageTimeSeconds)
                .slice(0, 3);
            if (teamEntries.length < 3)
                continue;
            stageTeamTimes.set(teamId, teamEntries.reduce((sum, entry) => sum + entry.stageTimeSeconds, 0));
        }
        const teamRows = [...stageTeamTimes.entries()]
            .map(([teamId, stageTime]) => ({
            teamId,
            timeSeconds: (previousTeam.get(teamId) ?? 0) + stageTime,
        }))
            .sort((left, right) => left.timeSeconds - right.timeSeconds || left.teamId - right.teamId)
            .map((entry, index) => ({
            rank: index + 1,
            teamId: entry.teamId,
            timeSeconds: entry.timeSeconds,
            points: null,
        }));
        // Parse breakaway kms, form and home advantage events
        const riderEscapeStart = new Map();
        const riderEscapeKms = new Map();
        let stageDistance = 0;
        for (const event of events) {
            if (event.kmMark != null && event.kmMark > stageDistance) {
                stageDistance = event.kmMark;
            }
        }
        for (const event of events) {
            if (event.riderId == null)
                continue;
            const rId = event.riderId;
            const title = event.title ?? '';
            if (title.startsWith('Ausreißversuch:')) {
                if (event.kmMark != null) {
                    riderEscapeStart.set(rId, event.kmMark);
                }
            }
            else if (title.startsWith('Ausreißer eingeholt:')) {
                const startKm = riderEscapeStart.get(rId);
                if (startKm != null) {
                    const endKm = event.kmMark ?? startKm;
                    riderEscapeKms.set(rId, (riderEscapeKms.get(rId) || 0) + Math.max(0, endKm - startKm));
                    riderEscapeStart.delete(rId);
                }
            }
        }
        for (const [rId, startKm] of riderEscapeStart.entries()) {
            riderEscapeKms.set(rId, (riderEscapeKms.get(rId) || 0) + Math.max(0, stageDistance - startKm));
        }
        const crashCounts = new Map();
        const defectCounts = new Map();
        for (const inc of incidents) {
            if (inc.type === 'crash') {
                crashCounts.set(inc.riderId, (crashCounts.get(inc.riderId) || 0) + 1);
            }
            else if (inc.type === 'mechanical') {
                defectCounts.set(inc.riderId, (defectCounts.get(inc.riderId) || 0) + 1);
            }
        }
        const superformCounts = new Map();
        const supermalusCounts = new Map();
        const attackCounts = new Map();
        const counterAttackCounts = new Map();
        const homeAdvantageCounts = new Map();
        const superHomeAdvantageCounts = new Map();
        const homePressureCounts = new Map();
        for (const ev of events) {
            if (ev.riderId == null)
                continue;
            const rId = ev.riderId;
            const title = ev.title ?? '';
            if (ev.type === 'attack') {
                attackCounts.set(rId, (attackCounts.get(rId) || 0) + 1);
            }
            else if (ev.type === 'counter_attack') {
                counterAttackCounts.set(rId, (counterAttackCounts.get(rId) || 0) + 1);
            }
            else if (ev.type === 'incident') {
                if (ev.detail === 'Superform aktiv.') {
                    superformCounts.set(rId, (superformCounts.get(rId) || 0) + 1);
                }
                else if (ev.detail === 'Supermalus aktiv.') {
                    supermalusCounts.set(rId, (supermalusCounts.get(rId) || 0) + 1);
                }
                else if (title.includes('Super-Heimvorteil')) {
                    superHomeAdvantageCounts.set(rId, (superHomeAdvantageCounts.get(rId) || 0) + 1);
                }
                else if (title.includes('Heimdruck')) {
                    homePressureCounts.set(rId, (homePressureCounts.get(rId) || 0) + 1);
                }
                else if (title.includes('Heimvorteil') && !title.includes('Super-Heimvorteil')) {
                    homeAdvantageCounts.set(rId, (homeAdvantageCounts.get(rId) || 0) + 1);
                }
            }
        }
        const previousBreakaway = this.loadPreviousRiderMetricMap(previousStageId, RESULT_TYPES.breakaway, 'breakaway_kms');
        const breakawayRows = race.isStageRace
            ? [...classificationPerformance]
                .map((entry) => {
                const currentStageKms = riderEscapeKms.get(entry.rider.id) ?? 0.0;
                const totalKms = (previousBreakaway.get(entry.rider.id) ?? 0.0) + currentStageKms;
                return {
                    riderId: entry.rider.id,
                    teamId: entry.team.id,
                    breakawayKms: totalKms,
                    points: Math.floor(totalKms),
                };
            })
                .filter((entry) => entry.breakawayKms > 0)
                .sort((left, right) => right.breakawayKms - left.breakawayKms
                || (stageRankByRiderId.get(left.riderId) ?? 9999) - (stageRankByRiderId.get(right.riderId) ?? 9999)
                || left.riderId - right.riderId)
                .map((entry, index) => ({ ...entry, rank: index + 1, timeSeconds: null }))
            : [];
        const jerseysByRiderId = new Map();
        if (previousStageId != null) {
            const standingsRows = this.db.prepare(`
        SELECT result_type_id, rider_id, rank
        FROM results
        WHERE stage_id = ? AND result_type_id IN (2, 3, 4, 5, 7) AND rider_id IS NOT NULL
        ORDER BY rank ASC
      `).all(previousStageId);
            const leadersByClassification = new Map();
            for (const row of standingsRows) {
                const list = leadersByClassification.get(row.result_type_id) ?? [];
                list.push(row.rider_id);
                leadersByClassification.set(row.result_type_id, list);
            }
            const assignedRiderIds = new Set();
            const classifications = [
                { typeId: 2, key: 'yellow' }, // GC
                { typeId: 3, key: 'green' }, // Points
                { typeId: 4, key: 'red' }, // Mountain
                { typeId: 5, key: 'white' }, // Youth
                { typeId: 7, key: 'purple' }, // Breakaway
            ];
            for (const cls of classifications) {
                const riders = leadersByClassification.get(cls.typeId) ?? [];
                for (const rId of riders) {
                    if (!assignedRiderIds.has(rId)) {
                        jerseysByRiderId.set(rId, cls.key);
                        assignedRiderIds.add(rId);
                        break;
                    }
                }
            }
        }
        const insert = this.db.prepare(`
      INSERT INTO results (
        race_id, stage_id, rider_id, team_id, result_type_id, rank, time_seconds, points, is_breakaway, leadout_rider_id, leadout_bonus, breakaway_kms, event_ids, jerseys_worn
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        const insertMarkerResult = this.db.prepare(`
      INSERT INTO stage_marker_results (
        race_id, stage_id, marker_key, marker_label, marker_type, marker_category, km_mark,
        rider_id, team_id, rank, crossing_time_seconds, gap_seconds, points_awarded, photo_finish_score
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        const performanceByRiderId = new Map(performance.map((entry) => [entry.rider.id, entry]));
        const completedRiderIds = performance.map((entry) => entry.rider.id);
        const severeCrashRiderIds = new Set(incidents.filter((incident) => incident.type === 'crash' && incident.severity === 'severe').map((incident) => incident.riderId));
        this.db.transaction(() => {
            this.repo.applyIncidentRaceState(race.id, incidents);
            for (const row of stageRows) {
                const riderId = row.riderId;
                let eventIdsStr = null;
                if (riderId != null) {
                    const eventParts = [];
                    if ((crashCounts.get(riderId) ?? 0) > 0)
                        eventParts.push(`1:${crashCounts.get(riderId)}`);
                    if ((defectCounts.get(riderId) ?? 0) > 0)
                        eventParts.push(`2:${defectCounts.get(riderId)}`);
                    if ((superformCounts.get(riderId) ?? 0) > 0)
                        eventParts.push(`3:${superformCounts.get(riderId)}`);
                    if ((supermalusCounts.get(riderId) ?? 0) > 0)
                        eventParts.push(`4:${supermalusCounts.get(riderId)}`);
                    if ((attackCounts.get(riderId) ?? 0) > 0)
                        eventParts.push(`5:${attackCounts.get(riderId)}`);
                    if ((counterAttackCounts.get(riderId) ?? 0) > 0)
                        eventParts.push(`6:${counterAttackCounts.get(riderId)}`);
                    if ((homeAdvantageCounts.get(riderId) ?? 0) > 0)
                        eventParts.push(`7:${homeAdvantageCounts.get(riderId)}`);
                    if ((superHomeAdvantageCounts.get(riderId) ?? 0) > 0)
                        eventParts.push(`8:${superHomeAdvantageCounts.get(riderId)}`);
                    if ((homePressureCounts.get(riderId) ?? 0) > 0)
                        eventParts.push(`9:${homePressureCounts.get(riderId)}`);
                    if (eventParts.length > 0)
                        eventIdsStr = eventParts.join('|');
                }
                const breakawayKms = riderId != null ? (riderEscapeKms.get(riderId) ?? null) : null;
                const jerseysWorn = riderId != null ? (jerseysByRiderId.get(riderId) ?? null) : null;
                this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.stage, row, breakawayKms, eventIdsStr, jerseysWorn);
            }
            for (const row of gcRows) {
                this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.gc, row);
            }
            for (const row of pointsRows) {
                this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.points, row);
            }
            for (const row of mountainRows) {
                this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.mountain, row);
            }
            for (const row of youthRows) {
                this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.youth, row);
            }
            for (const row of breakawayRows) {
                this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.breakaway, {
                    rank: row.rank,
                    riderId: row.riderId,
                    teamId: row.teamId,
                    timeSeconds: null,
                    points: row.points,
                }, row.breakawayKms);
            }
            for (const row of teamRows) {
                this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.team, {
                    rank: row.rank,
                    riderId: null,
                    teamId: row.teamId,
                    timeSeconds: row.timeSeconds,
                    points: row.points,
                    isBreakaway: false,
                });
            }
            for (const classification of markerClassifications) {
                for (const entry of classification.entries) {
                    const performanceEntry = performanceByRiderId.get(entry.riderId);
                    if (!performanceEntry)
                        continue;
                    insertMarkerResult.run(race.id, stage.id, classification.markerKey, classification.markerLabel, classification.markerType, classification.markerCategory, classification.kmMark, entry.riderId, performanceEntry.team.id, entry.rank, entry.crossingTimeSeconds, entry.gapSeconds, entry.pointsAwarded ?? 0, entry.photoFinishScore);
                }
            }
            // Accumulate and update rider career stats (never reset)
            const careerStatsIncrements = new Map();
            const getOrCreateIncrement = (riderId) => {
                let inc = careerStatsIncrements.get(riderId);
                if (!inc) {
                    inc = { breakaway: 0, attacks: 0, counterAttacks: 0, crashes: 0, defects: 0 };
                    careerStatsIncrements.set(riderId, inc);
                }
                return inc;
            };
            // 1. Breakaway attempts
            for (const riderId of breakawayRiderIds) {
                getOrCreateIncrement(riderId).breakaway = 1;
            }
            // 2. Crashes and mechanical defects
            for (const incident of incidents) {
                const inc = getOrCreateIncrement(incident.riderId);
                if (incident.type === 'crash') {
                    inc.crashes++;
                }
                else if (incident.type === 'mechanical') {
                    inc.defects++;
                }
            }
            // 3. Attacks and counter-attacks
            for (const event of events) {
                if (event.riderId != null) {
                    const inc = getOrCreateIncrement(event.riderId);
                    if (event.type === 'attack' && event.title && event.title.includes('attackiert')) {
                        inc.attacks++;
                    }
                    else if (event.type === 'counter_attack') {
                        inc.counterAttacks++;
                    }
                }
            }
            // 4. Perform SQLite update
            const updateStatsStmt = this.db.prepare(`
        INSERT INTO rider_career_stats (
          rider_id, breakaway_attempts, attacks, counter_attacks, crashes, defects
        ) VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(rider_id) DO UPDATE SET
          breakaway_attempts = breakaway_attempts + excluded.breakaway_attempts,
          attacks = attacks + excluded.attacks,
          counter_attacks = counter_attacks + excluded.counter_attacks,
          crashes = crashes + excluded.crashes,
          defects = defects + excluded.defects
      `);
            for (const [riderId, inc] of careerStatsIncrements.entries()) {
                updateStatsStmt.run(riderId, inc.breakaway, inc.attacks, inc.counterAttacks, inc.crashes, inc.defects);
            }
            // 5. Update season stats table (rider_season_stats)
            const currentSeason = this.repo.getCurrentSeason();
            // Ensure stats row exists for the season
            const insertSeasonStatsRowStmt = this.db.prepare(`
        INSERT OR IGNORE INTO rider_season_stats (rider_id, season) VALUES (?, ?)
      `);
            // Update statement for stage results career-like increments in season stats
            const updateSeasonCareerLikeStmt = this.db.prepare(`
        UPDATE rider_season_stats SET
          breakaway_attempts = breakaway_attempts + ?,
          attacks = attacks + ?,
          counter_attacks = counter_attacks + ?,
          crashes = crashes + ?,
          defects = defects + ?
        WHERE rider_id = ? AND season = ?
      `);
            // Fill basic rows
            for (const [riderId, inc] of careerStatsIncrements.entries()) {
                insertSeasonStatsRowStmt.run(riderId, currentSeason);
                updateSeasonCareerLikeStmt.run(inc.breakaway, inc.attacks, inc.counterAttacks, inc.crashes, inc.defects, riderId, currentSeason);
            }
            // DNS
            const dnsEvents = this.loadDnsEvents(race, stage);
            const updateDnsStmt = this.db.prepare(`
        UPDATE rider_season_stats SET dns_count = dns_count + 1 WHERE rider_id = ? AND season = ?
      `);
            for (const dns of dnsEvents) {
                if (dns.riderId != null) {
                    insertSeasonStatsRowStmt.run(dns.riderId, currentSeason);
                    updateDnsStmt.run(dns.riderId, currentSeason);
                }
            }
            // DNF / OTL
            const updateDnfStmt = this.db.prepare(`
        UPDATE rider_season_stats SET dnf_count = dnf_count + 1 WHERE rider_id = ? AND season = ?
      `);
            const updateOtlStmt = this.db.prepare(`
        UPDATE rider_season_stats SET otl_count = otl_count + 1 WHERE rider_id = ? AND season = ?
      `);
            for (const entry of dnfEntries) {
                insertSeasonStatsRowStmt.run(entry.riderId, currentSeason);
                if (entry.statusReason?.startsWith('OTL ')) {
                    updateOtlStmt.run(entry.riderId, currentSeason);
                }
                else {
                    updateDnfStmt.run(entry.riderId, currentSeason);
                }
            }
            const allEventRiderIds = new Set([
                ...riderEscapeKms.keys(),
                ...superformCounts.keys(),
                ...supermalusCounts.keys(),
                ...superHomeAdvantageCounts.keys(),
                ...homeAdvantageCounts.keys(),
                ...homePressureCounts.keys(),
            ]);
            const updateSeasonEventsStmt = this.db.prepare(`
        UPDATE rider_season_stats SET
          breakaway_kms = breakaway_kms + ?,
          superform_days = superform_days + ?,
          supermalus_days = supermalus_days + ?,
          home_advantage_days = home_advantage_days + ?,
          super_home_advantage_days = super_home_advantage_days + ?,
          home_pressure_days = home_pressure_days + ?
        WHERE rider_id = ? AND season = ?
      `);
            for (const rId of allEventRiderIds) {
                insertSeasonStatsRowStmt.run(rId, currentSeason);
                updateSeasonEventsStmt.run(riderEscapeKms.get(rId) ?? 0.0, superformCounts.get(rId) ?? 0, supermalusCounts.get(rId) ?? 0, homeAdvantageCounts.get(rId) ?? 0, superHomeAdvantageCounts.get(rId) ?? 0, homePressureCounts.get(rId) ?? 0, rId, currentSeason);
            }
            this.repo.markStageEntriesFinished(stage.id, completedRiderIds);
            for (const entry of dnfEntries) {
                this.repo.updateStageEntryStatus(stage.id, entry.riderId, 'dnf', entry.statusReason);
            }
            for (const riderId of severeCrashRiderIds) {
                this.applySevereCrashInjury(stage.date, riderId);
            }
            // Clean up previous leadout contributions for this stage just in case
            this.db.prepare('DELETE FROM stage_leadouts WHERE stage_id = ?').run(stage.id);
            if (leadoutContributions && leadoutContributions.length > 0) {
                const insertLeadoutStmt = this.db.prepare(`
          INSERT INTO stage_leadouts (stage_id, race_id, season, team_id, sprinter_id, leadout_bonus, contributors_json)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
                for (const c of leadoutContributions) {
                    insertLeadoutStmt.run(stage.id, race.id, currentSeason, c.teamId, c.sprinterId, c.leadoutBonus, c.contributorsJson);
                }
            }
        })();
        const gameStateService = new GameStateService_1.GameStateService(this.db);
        gameStateService.applyRaceDayFormBonuses(stage.date, completedRiderIds);
        gameStateService.refreshRiderLoadState(stage.date, this.repo.getCurrentSeason());
        gameStateService.applyStageFatigue(stage.id, completedRiderIds, dnfEntries.map((e) => e.riderId));
        this.repo.syncSeasonPointEventsForSeason(this.repo.getCurrentSeason());
        this.evaluateU23Breakthroughs(race, stage, stageRows, gcRows, pointsRows, mountainRows, youthRows, ridersById);
        this.evaluateRacePreferences(race, stage, stageRows, gcRows, dnfEntries, ridersById);
        return {
            raceId: race.id,
            raceName: race.name,
            stageId: stage.id,
            stageNumber: stage.stageNumber,
            date: stage.date,
            profile: stage.profile,
            resultTypes: SUPPORTED_RESULT_TYPES,
        };
    }
    applySevereCrashInjury(currentDate, riderId) {
        this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_daily_state (
        rider_id INTEGER PRIMARY KEY REFERENCES riders(id) ON DELETE CASCADE,
        season INTEGER NOT NULL,
        form_bonus REAL NOT NULL DEFAULT 0.0,
        race_form_bonus REAL NOT NULL DEFAULT 0.0,
        peak_s_form REAL NOT NULL DEFAULT 0.0,
        peak_r_form REAL NOT NULL DEFAULT 0.0,
        active_peak_date TEXT,
        peak_dates_json TEXT NOT NULL DEFAULT '[]',
        health_status TEXT NOT NULL DEFAULT 'healthy' CHECK(health_status IN ('healthy', 'ill', 'injured')),
        unavailable_until TEXT,
        unavailable_days_remaining INTEGER NOT NULL DEFAULT 0 CHECK(unavailable_days_remaining >= 0),
        season_race_days_total INTEGER NOT NULL DEFAULT 0 CHECK(season_race_days_total >= 0),
        rolling_30d_race_days INTEGER NOT NULL DEFAULT 0 CHECK(rolling_30d_race_days >= 0),
        short_term_fatigue REAL NOT NULL DEFAULT 0.0,
        long_term_fatigue_decayable REAL NOT NULL DEFAULT 0.0,
        long_term_fatigue_locked REAL NOT NULL DEFAULT 0.0
      )
    `).run();
        const isLongInjury = Math.random() < 0.1;
        const durationDays = isLongInjury
            ? randomInteger(6, 30)
            : randomInteger(2, 14);
        const unavailableUntil = addDaysIso(currentDate, durationDays - 1);
        this.db.prepare(`
      UPDATE rider_daily_state
      SET health_status = 'injured',
          unavailable_until = ?,
          unavailable_days_remaining = ?
      WHERE rider_id = ?
    `).run(unavailableUntil, durationDays, riderId);
        // Track crash-induced injury in career stats
        const tableExists = (db, name) => {
            const row = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(name);
            return !!row;
        };
        if (tableExists(this.db, 'rider_career_stats')) {
            this.db.prepare(`
        INSERT INTO rider_career_stats (
          rider_id, injuries, injury_days
        ) VALUES (?, 1, ?)
        ON CONFLICT(rider_id) DO UPDATE SET
          injuries = injuries + excluded.injuries,
          injury_days = injury_days + excluded.injury_days
      `).run(riderId, durationDays);
        }
        if (tableExists(this.db, 'rider_season_stats')) {
            const currentSeason = this.repo.getCurrentSeason();
            this.db.prepare(`
        INSERT INTO rider_season_stats (
          rider_id, season, injuries, injury_days
        ) VALUES (?, ?, 1, ?)
        ON CONFLICT(rider_id, season) DO UPDATE SET
          injuries = injuries + excluded.injuries,
          injury_days = injury_days + excluded.injury_days
      `).run(riderId, currentSeason, durationDays);
        }
    }
    ensureStageCanBeSimulated(stage) {
        const existing = this.db.prepare(`
      SELECT 1
      FROM results
      WHERE stage_id = ? AND result_type_id = ?
      LIMIT 1
    `).get(stage.id, RESULT_TYPES.stage);
        if (existing) {
            throw new Error('Diese Etappe wurde bereits simuliert.');
        }
        const row = this.db.prepare(`
      SELECT MAX(stages.stage_number) AS last_stage_number
      FROM results
      JOIN stages ON stages.id = results.stage_id
      WHERE stages.race_id = ? AND results.result_type_id = ?
    `).get(stage.raceId, RESULT_TYPES.stage);
        const expectedStageNumber = (row?.last_stage_number ?? 0) + 1;
        if (stage.stageNumber !== expectedStageNumber) {
            throw new Error('Etappen eines Rennens müssen in der vorgesehenen Reihenfolge simuliert werden.');
        }
    }
    getPreviousSimulatedStageId(raceId, stageNumber) {
        const row = this.db.prepare(`
      SELECT stages.id AS stage_id
      FROM stages
      JOIN results ON results.stage_id = stages.id
      WHERE stages.race_id = ?
        AND stages.stage_number < ?
        AND results.result_type_id = ?
      GROUP BY stages.id, stages.stage_number
      ORDER BY stages.stage_number DESC
      LIMIT 1
    `).get(raceId, stageNumber, RESULT_TYPES.stage);
        return row?.stage_id ?? null;
    }
    loadPreviousRiderMetricMap(previousStageId, resultTypeId, column) {
        if (previousStageId == null)
            return new Map();
        const rows = this.db.prepare(`
      SELECT rider_id, team_id, time_seconds, points, breakaway_kms
      FROM results
      WHERE stage_id = ? AND result_type_id = ? AND rider_id IS NOT NULL
    `).all(previousStageId, resultTypeId);
        const result = new Map();
        for (const row of rows) {
            const value = row[column];
            if (value != null) {
                result.set(row.rider_id, value);
            }
        }
        return result;
    }
    loadPreviousTeamMetricMap(previousStageId, resultTypeId, column) {
        if (previousStageId == null)
            return new Map();
        const rows = this.db.prepare(`
      SELECT team_id, time_seconds, points
      FROM results
      WHERE stage_id = ? AND result_type_id = ? AND rider_id IS NULL
    `).all(previousStageId, resultTypeId);
        const result = new Map();
        for (const row of rows) {
            const value = row[column];
            if (value != null) {
                result.set(row.team_id, value);
            }
        }
        return result;
    }
    insertResultRow(insert, raceId, stageId, resultTypeId, row, breakawayKms = null, eventIds = null, jerseysWorn = null) {
        try {
            insert.run(raceId, stageId, row.riderId ?? null, row.teamId, resultTypeId, row.rank, row.timeSeconds, row.points, resultTypeId === RESULT_TYPES.stage && row.isBreakaway === true ? 1 : 0, resultTypeId === RESULT_TYPES.stage && row.leadoutRiderId != null ? row.leadoutRiderId : null, resultTypeId === RESULT_TYPES.stage && row.leadoutBonus != null ? row.leadoutBonus : null, breakawayKms, eventIds, jerseysWorn);
        }
        catch (error) {
            throw new Error(`Ergebnis konnte nicht gespeichert werden (type=${resultTypeId}, stage=${stageId}, rank=${row.rank}, rider=${row.riderId ?? 'null'}, team=${row.teamId ?? 'null'}): ${error.message}`);
        }
    }
    evaluateRacePreferences(race, stage, stageRows, gcRows, dnfEntries, ridersById) {
        const isFinalStage = !race.isStageRace || stage.stageNumber === race.numberOfStages;
        const isCat1Or2 = race.categoryId === 1 || race.categoryId === 2 || race.categoryId === 3 || race.category?.name?.startsWith('1.') || race.category?.name?.startsWith('2.');
        const nameLow = race.name.toLowerCase();
        const isMonument = nameLow.includes('monument') || nameLow.includes('san remo') || nameLow.includes('sanremo') || nameLow.includes('roubaix') || nameLow.includes('vlaanderen') || nameLow.includes('flandern') || nameLow.includes('liège') || nameLow.includes('liege') || nameLow.includes('lombardia');
        const winRiderIds = new Set();
        const dnfRiderIds = new Set();
        if (isFinalStage) {
            const targetRows = race.isStageRace ? gcRows : stageRows;
            for (const row of targetRows) {
                if (row.rank === 1 && row.riderId) {
                    winRiderIds.add(row.riderId);
                }
                if ((isCat1Or2 || isMonument) && row.rank <= 3 && row.riderId) {
                    winRiderIds.add(row.riderId);
                }
            }
        }
        for (const entry of dnfEntries) {
            if (entry.statusReason === 'crash' && entry.riderId) {
                dnfRiderIds.add(entry.riderId);
            }
        }
        const ridersToUpdate = new Set([...winRiderIds, ...dnfRiderIds]);
        if (ridersToUpdate.size === 0)
            return;
        for (const riderId of ridersToUpdate) {
            const rider = ridersById.get(riderId);
            if (!rider)
                continue;
            let favs = [...(rider.favoriteRaces ?? [])];
            let nonFavs = [...(rider.nonFavoriteRaces ?? [])];
            let changed = false;
            if (dnfRiderIds.has(riderId)) {
                if (favs.includes(race.id)) {
                    favs = favs.filter(id => id !== race.id);
                    changed = true;
                }
                if (!nonFavs.includes(race.id)) {
                    nonFavs.push(race.id);
                    changed = true;
                }
            }
            else if (winRiderIds.has(riderId)) {
                if (nonFavs.includes(race.id)) {
                    nonFavs = nonFavs.filter(id => id !== race.id);
                    changed = true;
                }
                if (!favs.includes(race.id)) {
                    favs.push(race.id);
                    changed = true;
                }
            }
            if (changed) {
                rider.favoriteRaces = favs;
                rider.nonFavoriteRaces = nonFavs;
                this.db.prepare(`
          UPDATE riders
          SET favorite_races = ?, non_favorite_races = ?
          WHERE id = ?
        `).run(favs.join(','), nonFavs.join(','), riderId);
            }
        }
    }
    evaluateU23Breakthroughs(race, stage, stageRows, gcRows, pointsRows, mountainRows, youthRows, ridersById) {
        const isCategory1Or2 = race.categoryId === 1 || race.categoryId === 2 || race.categoryId === 3;
        const isFinalStage = !race.isStageRace || stage.stageNumber === race.numberOfStages;
        const currentSeason = this.repo.getCurrentSeason();
        const breakthroughRiderIds = new Set();
        for (const row of stageRows) {
            if (row.rank === 1 && row.riderId)
                breakthroughRiderIds.add(row.riderId);
        }
        if (isCategory1Or2) {
            for (const row of stageRows) {
                if (row.rank <= 3 && row.riderId)
                    breakthroughRiderIds.add(row.riderId);
            }
        }
        if (race.isStageRace && isFinalStage) {
            for (const row of gcRows) {
                if (row.rank <= 5 && row.riderId)
                    breakthroughRiderIds.add(row.riderId);
            }
            for (const row of pointsRows) {
                if (row.rank === 1 && row.riderId)
                    breakthroughRiderIds.add(row.riderId);
            }
            for (const row of mountainRows) {
                if (row.rank === 1 && row.riderId)
                    breakthroughRiderIds.add(row.riderId);
            }
            for (const row of youthRows) {
                if (row.rank === 1 && row.riderId)
                    breakthroughRiderIds.add(row.riderId);
            }
        }
        if (breakthroughRiderIds.size === 0)
            return;
        const validU23RiderIds = Array.from(breakthroughRiderIds).filter((riderId) => {
            const rider = ridersById.get(riderId);
            return rider && (currentSeason - rider.birthYear) <= 22;
        });
        if (validU23RiderIds.length === 0)
            return;
        const potColumns = [
            'pot_flat', 'pot_mountain', 'pot_medium_mountain', 'pot_hill', 'pot_time_trial',
            'pot_prologue', 'pot_cobble', 'pot_sprint', 'pot_acceleration', 'pot_downhill',
            'pot_attack', 'pot_stamina', 'pot_resistance', 'pot_recuperation', 'pot_bike_handling'
        ];
        for (const riderId of validU23RiderIds) {
            const riderPotentials = this.db.prepare(`
        SELECT pot_flat, pot_mountain, pot_medium_mountain, pot_hill, pot_time_trial,
               pot_prologue, pot_cobble, pot_sprint, pot_acceleration, pot_downhill,
               pot_attack, pot_stamina, pot_resistance, pot_recuperation, pot_bike_handling
        FROM riders WHERE id = ?
      `).get(riderId);
            if (!riderPotentials)
                continue;
            const validColumns = potColumns.filter((col) => riderPotentials[col] < 85);
            if (validColumns.length === 0)
                continue;
            const selectedColumn = validColumns[Math.floor(Math.random() * validColumns.length)];
            this.db.prepare(`
        UPDATE riders SET ${selectedColumn} = ${selectedColumn} + 1 WHERE id = ?
      `).run(riderId);
        }
    }
}
exports.StageResultCommitService = StageResultCommitService;
