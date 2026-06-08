"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageResultCommitService = void 0;
const GameStateRepository_1 = require("../db/repositories/GameStateRepository");
const RaceRepository_1 = require("../db/repositories/RaceRepository");
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
};
const SUPPORTED_RESULT_TYPES = [
    { id: RESULT_TYPES.stage, name: 'Stage' },
    { id: RESULT_TYPES.gc, name: 'GC' },
    { id: RESULT_TYPES.points, name: 'Points' },
    { id: RESULT_TYPES.mountain, name: 'Mountain' },
    { id: RESULT_TYPES.youth, name: 'Youth' },
    { id: RESULT_TYPES.team, name: 'Team' },
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
    commitRealtimeStage(stageId, entries, markerClassifications = [], incidents = []) {
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
            };
        });
        if (seenRiderIds.size !== riders.length) {
            throw new Error('Die Live-Simulation hat nicht alle Starter geliefert.');
        }
        const { classifiedPerformance, otlEntries } = splitOtlPerformance(stage, performance);
        const classifiedRiderIds = new Set(classifiedPerformance.map((entry) => entry.rider.id));
        const normalizedMarkerClassifications = filterMarkerClassificationsForClassifiedRiders(normalizeMarkerClassifications(markerClassifications, !(0, stageResultRules_1.isTimeTrialProfile)(stage.profile)), classifiedRiderIds);
        const awardedMarkerClassifications = this.applyMarkerClassificationAwards(race, stage, classifiedPerformance, normalizedMarkerClassifications);
        this.applyFinishLineAwards(race, stage, classifiedPerformance, {
            awardPoints: stage.profile !== 'TTT',
            awardTimeBonuses: stage.profile !== 'ITT' && stage.profile !== 'TTT',
        });
        return this.persistStagePerformance(race, stage, classifiedPerformance, awardedMarkerClassifications, [...dnfEntries, ...otlEntries], incidents);
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
    persistStagePerformance(race, stage, performance, markerClassifications = [], dnfEntries = [], incidents = []) {
        normalizeRoadStageTimeGroups(performance, stage.profile);
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
        const mountainRows = race.isStageRace
            ? [...classificationPerformance]
                .map((entry) => ({
                riderId: entry.rider.id,
                teamId: entry.team.id,
                points: (previousMountain.get(entry.rider.id) ?? 0) + entry.mountainPoints,
            }))
                .sort((left, right) => right.points - left.points || left.riderId - right.riderId)
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
        const insert = this.db.prepare(`
      INSERT INTO results (
        race_id, stage_id, rider_id, team_id, result_type_id, rank, time_seconds, points, is_breakaway
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.stage, row);
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
            this.repo.markStageEntriesFinished(stage.id, completedRiderIds);
            for (const entry of dnfEntries) {
                this.repo.updateStageEntryStatus(stage.id, entry.riderId, 'dnf', entry.statusReason);
            }
            for (const riderId of severeCrashRiderIds) {
                this.applySevereCrashInjury(stage.date, riderId);
            }
        })();
        const gameStateService = new GameStateService_1.GameStateService(this.db);
        gameStateService.applyRaceDayFormBonuses(stage.date, completedRiderIds);
        gameStateService.refreshRiderLoadState(stage.date, this.repo.getCurrentSeason());
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
        unavailable_days_remaining INTEGER NOT NULL DEFAULT 0 CHECK(unavailable_days_remaining >= 0)
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
      SELECT rider_id, team_id, time_seconds, points
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
    insertResultRow(insert, raceId, stageId, resultTypeId, row) {
        try {
            insert.run(raceId, stageId, row.riderId ?? null, row.teamId, resultTypeId, row.rank, row.timeSeconds, row.points, resultTypeId === RESULT_TYPES.stage && row.isBreakaway === true ? 1 : 0);
        }
        catch (error) {
            throw new Error(`Ergebnis konnte nicht gespeichert werden (type=${resultTypeId}, stage=${stageId}, rank=${row.rank}, rider=${row.riderId ?? 'null'}, team=${row.teamId ?? 'null'}): ${error.message}`);
        }
    }
    evaluateRacePreferences(race, stage, stageRows, gcRows, dnfEntries, ridersById) {
        const isFinalStage = !race.isStageRace || stage.stageNumber === race.numberOfStages;
        const isCat1Or2 = race.categoryId === 1 || race.categoryId === 2 || race.category?.name?.startsWith('1.') || race.category?.name?.startsWith('2.');
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
        const isCategory1Or2 = race.categoryId === 1 || race.categoryId === 2;
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
