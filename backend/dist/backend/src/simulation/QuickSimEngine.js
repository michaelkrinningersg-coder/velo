"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickSimEngine = void 0;
const GameRepository_1 = require("../db/GameRepository");
const StageParser_1 = require("./StageParser");
const TimeTrialSimulator_1 = require("./TimeTrialSimulator");
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
const DIVISION_BY_TIER = {
    1: 'WorldTour',
    2: 'ProTour',
    3: 'U23',
};
const PROFILE_BASE_SPEED = {
    Flat: 46,
    Rolling: 44,
    Hilly: 42,
    Hilly_Difficult: 40,
    Medium_Mountain: 38,
    Mountain: 36,
    High_Mountain: 33,
    Cobble: 43,
    Cobble_Hill: 40,
};
const PROFILE_SCORE_FACTOR = {
    Flat: 0.00075,
    Rolling: 0.00085,
    Hilly: 0.001,
    Hilly_Difficult: 0.0011,
    Medium_Mountain: 0.00125,
    Mountain: 0.00145,
    High_Mountain: 0.00165,
    Cobble: 0.00095,
    Cobble_Hill: 0.0011,
};
const GROUP_THRESHOLD_SECONDS = {
    Flat: 2,
    Rolling: 2,
    Hilly: 3,
    Hilly_Difficult: 3,
    Medium_Mountain: 4,
    Mountain: 6,
    High_Mountain: 7,
    Cobble: 2,
    Cobble_Hill: 3,
};
const FORM_MIN = 0.96;
const FORM_MAX = 1.04;
const SCORE_NOISE = 0.01;
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
function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}
function roundSeconds(value) {
    return Math.max(0, Math.round(value));
}
function appendToNumberMap(target, key, value) {
    if (value === 0)
        return;
    target.set(key, (target.get(key) ?? 0) + value);
}
class QuickSimEngine {
    constructor(db) {
        this.db = db;
        this.repo = new GameRepository_1.GameRepository(db);
    }
    simulateStage(stageId) {
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
        const riders = this.ensureRaceEntries(race);
        if (riders.length === 0) {
            throw new Error('Für dieses Rennen konnten keine Fahrer für die Startliste bestimmt werden.');
        }
        const teamsById = new Map(this.repo.getTeams().map((team) => [team.id, team]));
        const missingTeam = riders.find((rider) => rider.activeTeamId == null || !teamsById.has(rider.activeTeamId));
        if (missingTeam) {
            throw new Error(`Team für Fahrer ${missingTeam.firstName} ${missingTeam.lastName} konnte nicht aufgelöst werden.`);
        }
        const performance = stage.profile === 'ITT'
            ? this.simulateTimeTrialStage(race, stage, riders, teamsById)
            : this.simulateMassStartStage(race, stage, riders, teamsById);
        const previousStageId = this.getPreviousSimulatedStageId(stage.raceId, stage.stageNumber);
        const previousGc = this.loadPreviousRiderMetricMap(previousStageId, RESULT_TYPES.gc, 'time_seconds');
        const previousPoints = this.loadPreviousRiderMetricMap(previousStageId, RESULT_TYPES.points, 'points');
        const previousMountain = this.loadPreviousRiderMetricMap(previousStageId, RESULT_TYPES.mountain, 'points');
        const previousTeam = this.loadPreviousTeamMetricMap(previousStageId, RESULT_TYPES.team, 'time_seconds');
        const stageRows = performance.map((entry, index) => ({
            rank: index + 1,
            riderId: entry.rider.id,
            teamId: entry.team.id,
            timeSeconds: entry.stageTimeSeconds,
            points: entry.points,
        }));
        const gcRows = [...performance]
            .map((entry) => ({
            riderId: entry.rider.id,
            teamId: entry.team.id,
            timeSeconds: (previousGc.get(entry.rider.id) ?? 0) + entry.stageTimeSeconds - entry.gcBonusSeconds,
        }))
            .sort((left, right) => left.timeSeconds - right.timeSeconds || left.riderId - right.riderId)
            .map((entry, index) => ({ ...entry, rank: index + 1, points: null }));
        const pointsRows = [...performance]
            .map((entry) => ({
            riderId: entry.rider.id,
            teamId: entry.team.id,
            points: (previousPoints.get(entry.rider.id) ?? 0) + entry.points,
        }))
            .sort((left, right) => right.points - left.points || left.riderId - right.riderId)
            .map((entry, index) => ({ ...entry, rank: index + 1, timeSeconds: null }));
        const mountainRows = [...performance]
            .map((entry) => ({
            riderId: entry.rider.id,
            teamId: entry.team.id,
            points: (previousMountain.get(entry.rider.id) ?? 0) + entry.mountainPoints,
        }))
            .sort((left, right) => right.points - left.points || left.riderId - right.riderId)
            .map((entry, index) => ({ ...entry, rank: index + 1, timeSeconds: null }));
        const currentSeason = this.repo.getCurrentSeason();
        const youthRows = gcRows
            .filter((entry) => {
            const rider = performance.find((candidate) => candidate.rider.id === entry.riderId)?.rider;
            return rider != null && currentSeason - rider.birthYear <= 25;
        })
            .map((entry, index) => ({
            rank: index + 1,
            riderId: entry.riderId,
            teamId: entry.teamId,
            timeSeconds: entry.timeSeconds,
            points: null,
        }));
        const stageTeamTimes = new Map();
        for (const team of teamsById.values()) {
            const teamEntries = performance
                .filter((entry) => entry.team.id === team.id)
                .sort((left, right) => left.stageTimeSeconds - right.stageTimeSeconds)
                .slice(0, 3);
            if (teamEntries.length === 0)
                continue;
            stageTeamTimes.set(team.id, teamEntries.reduce((sum, entry) => sum + entry.stageTimeSeconds, 0));
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
        race_id, stage_id, rider_id, team_id, result_type_id, rank, time_seconds, points
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
        this.db.transaction(() => {
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
                });
            }
        })();
        this.repo.syncSeasonPointEventsForSeason(this.repo.getCurrentSeason());
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
    ensureRaceEntries(race) {
        const existingEntries = this.repo.getRaceRiders(race.id);
        if (existingEntries.length > 0) {
            return existingEntries;
        }
        const targetDivision = DIVISION_BY_TIER[race.category?.tier ?? 1];
        const eligibleTeams = this.repo.getTeams()
            .filter((team) => team.division === targetDivision)
            .slice(0, race.category?.numberOfTeams ?? 0);
        const insertEntry = this.db.prepare('INSERT OR IGNORE INTO race_entries (race_id, team_id, rider_id) VALUES (?, ?, ?)');
        this.db.transaction(() => {
            for (const team of eligibleTeams) {
                const riders = this.repo.getRiders(team.id).slice(0, race.category?.numberOfRiders ?? 0);
                for (const rider of riders) {
                    insertEntry.run(race.id, team.id, rider.id);
                }
            }
        })();
        return this.repo.getRaceRiders(race.id);
    }
    simulateTimeTrialStage(race, stage, riders, teamsById) {
        const ttResult = TimeTrialSimulator_1.TimeTrialSimulator.simulate(race, stage, riders);
        return ttResult.entries.map((entry) => {
            const team = teamsById.get(entry.rider.activeTeamId ?? -1);
            if (!team) {
                throw new Error(`Team für Fahrer ${entry.rider.firstName} ${entry.rider.lastName} konnte nicht geladen werden.`);
            }
            return {
                rider: entry.rider,
                team,
                dayForm: entry.dayFormFactor,
                performanceScore: 0,
                rawTimeSeconds: entry.finishTimeSeconds,
                stageTimeSeconds: roundSeconds(entry.finishTimeSeconds),
                points: 0,
                gcBonusSeconds: 0,
                mountainPoints: 0,
            };
        });
    }
    simulateMassStartStage(race, stage, riders, teamsById) {
        const summary = StageParser_1.StageParser.summarizeStageProfile(stage.detailsCsvFile);
        const markers = summary.points.flatMap((point) => point.markers.map((marker) => ({ kmMark: point.kmMark, marker })));
        const sprintPointValues = parseRankedValues(race.category?.bonusSystem?.pointsSprintIntermediate);
        const sprintBonusValues = parseRankedValues(race.category?.bonusSystem?.bonusSecondsIntermediate);
        const finishBonusValues = parseRankedValues(race.category?.bonusSystem?.bonusSecondsFinal);
        const finishPointValues = parseRankedValues(race.isStageRace
            ? race.category?.bonusSystem?.pointsStage
            : race.category?.bonusSystem?.pointsOneDay);
        const mountainPointValues = {
            HC: parseRankedValues(race.category?.bonusSystem?.pointsMountainHc),
            '1': parseRankedValues(race.category?.bonusSystem?.pointsMountainCat1),
            '2': parseRankedValues(race.category?.bonusSystem?.pointsMountainCat2),
            '3': parseRankedValues(race.category?.bonusSystem?.pointsMountainCat3),
            '4': parseRankedValues(race.category?.bonusSystem?.pointsMountainCat4),
        };
        const baseEntries = riders.map((rider) => {
            const team = teamsById.get(rider.activeTeamId ?? -1);
            if (!team) {
                throw new Error(`Team für Fahrer ${rider.firstName} ${rider.lastName} konnte nicht geladen werden.`);
            }
            const dayForm = randomBetween(FORM_MIN, FORM_MAX);
            const scoreNoise = randomBetween(-SCORE_NOISE, SCORE_NOISE);
            const performanceScore = this.resolveStageScore(rider, summary.segments, summary.distanceKm) * dayForm * (1 + scoreNoise);
            return {
                rider,
                team,
                dayForm,
                performanceScore,
                rawTimeSeconds: 0,
                stageTimeSeconds: 0,
                points: 0,
                gcBonusSeconds: 0,
                mountainPoints: 0,
            };
        });
        const profile = stage.profile;
        const winnerScore = Math.max(...baseEntries.map((entry) => entry.performanceScore));
        const leaderSpeed = PROFILE_BASE_SPEED[profile] + Math.max(0, (winnerScore - 50) * 0.12);
        const leaderTime = (summary.distanceKm / leaderSpeed) * 3600;
        const scoreFactor = PROFILE_SCORE_FACTOR[profile];
        const sorted = [...baseEntries]
            .map((entry) => ({
            ...entry,
            rawTimeSeconds: leaderTime * (1 + Math.max(0, winnerScore - entry.performanceScore) * scoreFactor),
        }))
            .sort((left, right) => left.rawTimeSeconds - right.rawTimeSeconds || right.performanceScore - left.performanceScore);
        let currentGroupTime = roundSeconds(sorted[0]?.rawTimeSeconds ?? leaderTime);
        let previousRawTime = sorted[0]?.rawTimeSeconds ?? leaderTime;
        sorted.forEach((entry, index) => {
            if (index === 0) {
                entry.stageTimeSeconds = currentGroupTime;
                return;
            }
            if (entry.rawTimeSeconds - previousRawTime <= GROUP_THRESHOLD_SECONDS[profile]) {
                entry.stageTimeSeconds = currentGroupTime;
            }
            else {
                currentGroupTime = roundSeconds(entry.rawTimeSeconds);
                entry.stageTimeSeconds = currentGroupTime;
            }
            previousRawTime = entry.rawTimeSeconds;
        });
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
        const sprintPointsByRider = new Map();
        const sprintBonusesByRider = new Map();
        for (const marker of markers.filter((candidate) => candidate.marker.type === 'sprint_intermediate')) {
            const sprintRanking = [...sorted]
                .sort((left, right) => this.resolveSprintScore(right.rider, marker.kmMark / summary.distanceKm, right.dayForm) - this.resolveSprintScore(left.rider, marker.kmMark / summary.distanceKm, left.dayForm));
            sprintPointValues.forEach((points, index) => {
                const entry = sprintRanking[index];
                if (!entry)
                    return;
                appendToNumberMap(sprintPointsByRider, entry.rider.id, points);
            });
            sprintBonusValues.forEach((bonusSeconds, index) => {
                const entry = sprintRanking[index];
                if (!entry)
                    return;
                appendToNumberMap(sprintBonusesByRider, entry.rider.id, bonusSeconds);
            });
        }
        const mountainPointsByRider = new Map();
        for (const marker of markers.filter((candidate) => candidate.marker.type === 'climb_top' && candidate.marker.cat != null && candidate.marker.cat !== 'Sprint')) {
            const pointValues = mountainPointValues[marker.marker.cat];
            const climbingRanking = [...sorted]
                .sort((left, right) => this.resolveClimbScore(right.rider, marker.kmMark / summary.distanceKm, right.dayForm) - this.resolveClimbScore(left.rider, marker.kmMark / summary.distanceKm, left.dayForm));
            pointValues.forEach((points, index) => {
                const entry = climbingRanking[index];
                if (!entry)
                    return;
                appendToNumberMap(mountainPointsByRider, entry.rider.id, points);
            });
        }
        return sorted.map((entry) => ({
            ...entry,
            points: entry.points + (sprintPointsByRider.get(entry.rider.id) ?? 0),
            gcBonusSeconds: entry.gcBonusSeconds + (sprintBonusesByRider.get(entry.rider.id) ?? 0),
            mountainPoints: mountainPointsByRider.get(entry.rider.id) ?? 0,
        }));
    }
    resolveStageScore(rider, segments, distanceKm) {
        const weightedTerrainScore = segments.reduce((sum, segment) => {
            const segmentWeight = segment.length_km / Math.max(distanceKm, 1);
            return sum + this.resolveTerrainSkill(rider, segment) * segmentWeight;
        }, 0);
        const enduranceFactor = Math.min(distanceKm / 200, 1.15);
        const staminaBoost = (rider.skills.stamina - 50) * 0.12 * enduranceFactor;
        const resistanceBoost = (rider.skills.resistance - 50) * 0.08 * enduranceFactor;
        return weightedTerrainScore + staminaBoost + resistanceBoost;
    }
    resolveTerrainSkill(rider, segment) {
        switch (segment.terrain) {
            case 'Flat':
                return rider.skills.flat * 0.55 + rider.skills.sprint * 0.15 + rider.skills.resistance * 0.15 + rider.skills.stamina * 0.15;
            case 'Hill':
                return rider.skills.hill * 0.5 + rider.skills.acceleration * 0.15 + rider.skills.attack * 0.15 + rider.skills.resistance * 0.1 + rider.skills.stamina * 0.1;
            case 'Medium_Mountain':
                return rider.skills.mediumMountain * 0.45 + rider.skills.mountain * 0.2 + rider.skills.attack * 0.15 + rider.skills.resistance * 0.1 + rider.skills.stamina * 0.1;
            case 'Mountain':
            case 'High_Mountain':
                return rider.skills.mountain * 0.55 + rider.skills.stamina * 0.15 + rider.skills.resistance * 0.15 + rider.skills.attack * 0.1 + rider.skills.downhill * 0.05;
            case 'Cobble':
                return rider.skills.cobble * 0.5 + rider.skills.flat * 0.15 + rider.skills.resistance * 0.15 + rider.skills.bikeHandling * 0.1 + rider.skills.sprint * 0.1;
            case 'Cobble_Hill':
                return rider.skills.cobble * 0.3 + rider.skills.hill * 0.2 + rider.skills.bikeHandling * 0.15 + rider.skills.resistance * 0.15 + rider.skills.acceleration * 0.1 + rider.skills.stamina * 0.1;
            case 'Abfahrt':
                return rider.skills.downhill * 0.55 + rider.skills.bikeHandling * 0.25 + rider.skills.flat * 0.1 + rider.skills.resistance * 0.1;
            case 'Sprint':
                return rider.skills.sprint * 0.5 + rider.skills.acceleration * 0.25 + rider.skills.flat * 0.1 + rider.skills.resistance * 0.1 + rider.skills.bikeHandling * 0.05;
            default:
                return rider.skills.flat;
        }
    }
    resolveSprintScore(rider, stageFraction, dayForm) {
        const fatigueBoost = 1 + ((rider.skills.stamina - 50) / 250) * stageFraction;
        return (rider.skills.sprint * 0.45
            + rider.skills.acceleration * 0.25
            + rider.skills.flat * 0.1
            + rider.skills.resistance * 0.1
            + rider.skills.bikeHandling * 0.1) * fatigueBoost * dayForm;
    }
    resolveClimbScore(rider, stageFraction, dayForm) {
        const fatigueBoost = 1 + ((rider.skills.stamina - 50) / 220) * stageFraction;
        return (rider.skills.mountain * 0.45
            + rider.skills.mediumMountain * 0.2
            + rider.skills.hill * 0.1
            + rider.skills.attack * 0.1
            + rider.skills.resistance * 0.15) * fatigueBoost * dayForm;
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
            insert.run(raceId, stageId, row.riderId ?? null, row.teamId, resultTypeId, row.rank, row.timeSeconds, row.points);
        }
        catch (error) {
            throw new Error(`Ergebnis konnte nicht gespeichert werden (type=${resultTypeId}, stage=${stageId}, rank=${row.rank}, rider=${row.riderId ?? 'null'}, team=${row.teamId ?? 'null'}): ${error.message}`);
        }
    }
}
exports.QuickSimEngine = QuickSimEngine;
