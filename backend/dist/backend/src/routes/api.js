"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = createRouter;
const express_1 = require("express");
const RiderTeamEditorService_1 = require("../editor/RiderTeamEditorService");
const RaceProgramsEditorService_1 = require("../editor/RaceProgramsEditorService");
const GameRepository_1 = require("../db/GameRepository");
const RiderRepository_1 = require("../db/repositories/RiderRepository");
const ResultRepository_1 = require("../db/repositories/ResultRepository");
const LeaderboardRepository_1 = require("../db/repositories/LeaderboardRepository");
const GameStateService_1 = require("../game/GameStateService");
const RouteImporter_1 = require("../simulation/RouteImporter");
const RaceRosterService_1 = require("../simulation/RaceRosterService");
const StageResultCommitService_1 = require("../simulation/StageResultCommitService");
const StageParser_1 = require("../simulation/StageParser");
function ok(res, data) {
    const body = { success: true, data };
    res.json(body);
}
function fail(res, status, message) {
    const body = { success: false, error: message };
    res.status(status).json(body);
}
function resolveRealtimeTeamStartOrder(repo, race, stageNumber, riders) {
    const participatingTeams = new Map();
    for (const team of repo.getTeams()) {
        if (riders.some((rider) => rider.activeTeamId === team.id)) {
            participatingTeams.set(team.id, team);
        }
    }
    const participatingTeamIds = new Set(participatingTeams.keys());
    if (participatingTeamIds.size === 0) {
        return [];
    }
    if (race.isStageRace && stageNumber > 1) {
        const previousGcStandings = repo.getPreviousGcStandings(race.id, stageNumber);
        const riderById = new Map(riders.map((rider) => [rider.id, rider]));
        const teamTotals = new Map();
        for (const standing of previousGcStandings) {
            const rider = riderById.get(standing.riderId);
            const teamId = rider?.activeTeamId;
            if (teamId == null || !participatingTeamIds.has(teamId)) {
                continue;
            }
            const bucket = teamTotals.get(teamId) ?? [];
            bucket.push(standing.timeSeconds);
            teamTotals.set(teamId, bucket);
        }
        return [...participatingTeams.values()]
            .sort((left, right) => {
            const leftTimes = teamTotals.get(left.id);
            const rightTimes = teamTotals.get(right.id);
            const leftTotal = leftTimes?.slice().sort((a, b) => a - b).slice(0, Math.min(3, leftTimes.length)).reduce((sum, value) => sum + value, 0) ?? null;
            const rightTotal = rightTimes?.slice().sort((a, b) => a - b).slice(0, Math.min(3, rightTimes.length)).reduce((sum, value) => sum + value, 0) ?? null;
            if (leftTotal != null && rightTotal != null) {
                return rightTotal - leftTotal || left.name.localeCompare(right.name, 'de');
            }
            if (leftTotal != null)
                return 1;
            if (rightTotal != null)
                return -1;
            return left.name.localeCompare(right.name, 'de');
        })
            .map((team) => team.id);
    }
    const seasonTeamPoints = new Map(repo.getSeasonStandings().teamStandings
        .filter((row) => row.teamId != null && participatingTeamIds.has(row.teamId))
        .map((row) => [row.teamId, row.points]));
    return [...participatingTeams.values()]
        .sort((left, right) => {
        const leftPoints = seasonTeamPoints.get(left.id) ?? 0;
        const rightPoints = seasonTeamPoints.get(right.id) ?? 0;
        if (leftPoints === 0 && rightPoints === 0) {
            return left.name.localeCompare(right.name, 'de');
        }
        if (leftPoints === 0)
            return -1;
        if (rightPoints === 0)
            return 1;
        return leftPoints - rightPoints || left.name.localeCompare(right.name, 'de');
    })
        .map((team) => team.id);
}
function createRouter(dbService) {
    const router = (0, express_1.Router)();
    const routeImporter = new RouteImporter_1.RouteImporter();
    const riderTeamEditorService = new RiderTeamEditorService_1.RiderTeamEditorService();
    const raceProgramsEditorService = new RaceProgramsEditorService_1.RaceProgramsEditorService();
    // Caches GameStateService per active connection
    let cachedGss = null;
    let cachedDb = null;
    function getGss() {
        const db = dbService.getActiveConnection();
        if (!cachedGss || cachedDb !== db) {
            cachedGss = new GameStateService_1.GameStateService(db);
            cachedGss.ensureState();
            cachedDb = db;
        }
        return cachedGss;
    }
    // ---- Savegames ----------------------------------------
    router.get('/saves', (_req, res) => {
        try {
            ok(res, dbService.listSaves());
        }
        catch (e) {
            fail(res, 500, e.message);
        }
    });
    router.post('/saves', (req, res) => {
        const { filename, careerName, teamId } = req.body;
        if (!filename || !careerName || teamId == null) {
            return fail(res, 400, 'filename, careerName und teamId sind erforderlich.');
        }
        const id = Number(teamId);
        if (!Number.isFinite(id))
            return fail(res, 400, 'teamId muss eine Zahl sein.');
        try {
            dbService.createNewSave(filename, careerName, id);
            ok(res, undefined);
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    // Gibt alle wÃ¤hlbaren (nicht-U23) Teams aus der Master-DB zurÃ¼ck
    router.get('/teams/available', (_req, res) => {
        let masterDb = null;
        try {
            masterDb = dbService.getMasterConnection();
            const rows = new GameRepository_1.GameRepository(masterDb).getTeams();
            const selectable = rows.filter((t) => t.division !== 'U23');
            ok(res, selectable);
        }
        catch (e) {
            fail(res, 500, e.message);
        }
        finally {
            masterDb?.close();
        }
    });
    router.post('/saves/:id/load', (req, res) => {
        const { id } = req.params;
        try {
            dbService.loadSave(id);
            cachedGss = null; // Reset cache after new save loaded
            const saves = dbService.listSaves();
            const meta = saves.find(s => s.filename === id);
            ok(res, meta ?? { id: 0, filename: id, careerName: id, teamName: '', currentSeason: 2026, lastSaved: '' });
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.delete('/saves/:id', (req, res) => {
        const { id } = req.params;
        try {
            dbService.deleteSave(id);
            ok(res, undefined);
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    // ---- Teams --------------------------------------------
    router.get('/teams', (_req, res) => {
        try {
            const db = dbService.getActiveConnection();
            ok(res, new GameRepository_1.GameRepository(db).getTeams());
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/teams/:id', (req, res) => {
        const id = Number(req.params['id']);
        if (!Number.isFinite(id))
            return fail(res, 400, 'UngÃ¼ltige Team-ID.');
        try {
            const db = dbService.getActiveConnection();
            getGss().ensureState();
            // Use TeamRepository to get the team
            const { TeamRepository } = require('../db/repositories/TeamRepository');
            const teamRepo = new TeamRepository(db);
            const team = teamRepo.getTeamById(id);
            if (!team)
                return fail(res, 404, `Team ${id} nicht gefunden.`);
            ok(res, { ...team, riders: new RiderRepository_1.RiderRepository(db).getRiders(id, true) });
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/teams/:id/stats', (req, res) => {
        const id = Number(req.params['id']);
        if (!Number.isFinite(id))
            return fail(res, 400, 'Ungültige Team-ID.');
        try {
            const db = dbService.getActiveConnection();
            getGss().ensureState();
            const { TeamRepository } = require('../db/repositories/TeamRepository');
            const teamRepo = new TeamRepository(db);
            const payload = teamRepo.getTeamStats(id);
            if (!payload)
                return fail(res, 404, `Team ${id} nicht gefunden.`);
            ok(res, payload);
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    // ---- Riders -------------------------------------------
    router.get('/riders', (req, res) => {
        const teamId = req.query['teamId'] ? Number(req.query['teamId']) : undefined;
        try {
            const db = dbService.getActiveConnection();
            getGss().ensureState();
            ok(res, new RiderRepository_1.RiderRepository(db).getRiders(teamId));
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/riders/:id/program-races', (req, res) => {
        const riderId = Number(req.params['id']);
        if (!Number.isFinite(riderId))
            return fail(res, 400, 'UngÃ¼ltige Fahrer-ID.');
        try {
            const db = dbService.getActiveConnection();
            getGss().ensureState();
            const payload = new RiderRepository_1.RiderRepository(db).getRiderProgramRaceSummary(riderId);
            if (!payload)
                return fail(res, 404, `Kein Programm fuer Fahrer ${riderId} gefunden.`);
            ok(res, payload);
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/riders/:id/stats', (req, res) => {
        const riderId = Number(req.params['id']);
        if (!Number.isFinite(riderId))
            return fail(res, 400, 'UngÃ¼ltige Fahrer-ID.');
        try {
            const db = dbService.getActiveConnection();
            getGss().ensureState();
            const excludeFatigue = req.query['excludeFatigue'] === 'true';
            const payload = new RiderRepository_1.RiderRepository(db).getRiderStats(riderId, excludeFatigue);
            if (!payload)
                return fail(res, 404, `Fahrer ${riderId} nicht gefunden.`);
            ok(res, payload);
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/rider-team-editor', (_req, res) => {
        try {
            ok(res, riderTeamEditorService.load());
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.post('/rider-team-editor', (req, res) => {
        try {
            ok(res, riderTeamEditorService.save(req.body));
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.post('/rider-team-editor/export', (req, res) => {
        try {
            ok(res, riderTeamEditorService.export(req.body));
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/race-programs-editor', (_req, res) => {
        try {
            let activeDb;
            try {
                activeDb = dbService.getActiveConnection();
            }
            catch (e) {
                // active connection may not exist
            }
            ok(res, raceProgramsEditorService.load(activeDb));
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.post('/race-programs-editor/save', (req, res) => {
        try {
            let activeDb;
            try {
                activeDb = dbService.getActiveConnection();
            }
            catch (e) {
                // active connection may not exist (e.g. at start screen)
            }
            raceProgramsEditorService.save(req.body, activeDb);
            ok(res, undefined);
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    // ---- Races --------------------------------------------
    router.get('/races', (_req, res) => {
        try {
            const db = dbService.getActiveConnection();
            ok(res, new GameRepository_1.GameRepository(db).getRaces());
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/races/:id/program-participants', (req, res) => {
        const raceId = Number(req.params['id']);
        if (!Number.isFinite(raceId))
            return fail(res, 400, 'UngÃ¼ltige Rennen-ID.');
        try {
            const db = dbService.getActiveConnection();
            getGss().ensureState();
            ok(res, new GameRepository_1.GameRepository(db).getRaceProgramParticipants(raceId));
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/races/:id/results-roster', (req, res) => {
        const raceId = Number(req.params['id']);
        if (!Number.isFinite(raceId))
            return fail(res, 400, 'Ungültige Rennen-ID.');
        try {
            const db = dbService.getActiveConnection();
            const result = new ResultRepository_1.ResultRepository(db).getRaceRoster(raceId);
            if (!result)
                return fail(res, 404, 'Keine Teilnehmerdaten verfügbar (Rennen noch nicht gestartet?).');
            ok(res, result);
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    // ---- Stage Editor --------------------------------------
    router.get('/stage-editor/stages', (_req, res) => {
        try {
            ok(res, routeImporter.listExistingStages());
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/stage-editor/overview', (_req, res) => {
        try {
            ok(res, routeImporter.listOverview());
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/stage-editor/stages/:stageId', (req, res) => {
        const stageId = Number(req.params['stageId']);
        if (!Number.isInteger(stageId) || stageId <= 0)
            return fail(res, 400, 'UngÃ¼ltige Stage-ID.');
        try {
            ok(res, routeImporter.loadExistingStage(stageId));
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.post('/stage-editor/import', (req, res) => {
        try {
            ok(res, routeImporter.importRoute(req.body));
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.post('/stage-editor/export', (req, res) => {
        try {
            ok(res, routeImporter.exportCsv(req.body));
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/stage-editor/countries', (_req, res) => {
        try {
            ok(res, routeImporter.loadCountriesList());
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/stage-editor/race-categories', (_req, res) => {
        try {
            ok(res, routeImporter.loadRaceCategoriesList());
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/stage-editor/race-programs', (_req, res) => {
        try {
            ok(res, routeImporter.loadRaceProgramsList());
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    // ---- Game State ---------------------------------------
    router.get('/state', (_req, res) => {
        try {
            ok(res, getGss().loadState());
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/game/status', (_req, res) => {
        try {
            ok(res, getGss().loadStatus());
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/simulation/realtime/:stageId', (req, res) => {
        const stageId = Number(req.params['stageId']);
        if (!Number.isFinite(stageId))
            return fail(res, 400, 'UngÃ¼ltige Stage-ID.');
        try {
            const pendingStageIds = new Set(getGss().loadStatus().pendingStages.map((stage) => stage.stageId));
            if (!pendingStageIds.has(stageId)) {
                return fail(res, 400, 'Diese Etappe ist aktuell nicht zur Live-Simulation freigegeben.');
            }
            const db = dbService.getActiveConnection();
            ensureWeatherRolled(db, stageId);
            const repo = new GameRepository_1.GameRepository(db);
            const stage = repo.getStageById(stageId);
            if (!stage) {
                return fail(res, 404, `Stage ${stageId} nicht gefunden.`);
            }
            const race = repo.getRaceById(stage.raceId);
            if (!race) {
                return fail(res, 404, `Rennen ${stage.raceId} nicht gefunden.`);
            }
            const riders = (0, RaceRosterService_1.ensureRaceEntries)(db, repo, race, stage);
            if (riders.length === 0) {
                return fail(res, 400, 'FÃ¼r diese Etappe konnte keine Startliste bestimmt werden.');
            }
            ok(res, {
                race,
                stage,
                riders,
                teams: repo.getTeams().filter((team) => riders.some((rider) => rider.activeTeamId === team.id)),
                stageSummary: StageParser_1.StageParser.summarizeStageProfile(stage.detailsCsvFile, stage.startElevation),
                gcStandings: repo.getPreviousGcStandings(stage.raceId, stage.stageNumber),
                pointsStandings: repo.getPreviousPointsStandings(stage.raceId, stage.stageNumber),
                mountainStandings: repo.getPreviousMountainStandings(stage.raceId, stage.stageNumber),
                youthStandings: repo.getPreviousYouthStandings(stage.raceId, stage.stageNumber),
                classificationLeaders: repo.getPreviousClassificationLeaders(stage.raceId, stage.stageNumber),
                teamStartOrder: resolveRealtimeTeamStartOrder(repo, race, stage.stageNumber, riders),
                skillWeightRules: repo.getSkillWeightRules(),
                stageScoringRules: repo.getStageScoringRules(),
            });
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/stages/:stageId/summary', (req, res) => {
        const stageId = Number(req.params['stageId']);
        if (!Number.isFinite(stageId))
            return fail(res, 400, 'Ungültige Stage-ID.');
        try {
            const db = dbService.getActiveConnection();
            const repo = new GameRepository_1.GameRepository(db);
            let stage = repo.getStageById(stageId);
            if (!stage) {
                try {
                    const loaded = routeImporter.loadExistingStage(stageId);
                    if (loaded && loaded.metadata) {
                        stage = {
                            id: loaded.metadata.stageId,
                            raceId: loaded.metadata.raceId,
                            stageNumber: loaded.metadata.stageNumber,
                            date: loaded.metadata.date,
                            profile: loaded.metadata.profile,
                            startElevation: loaded.metadata.startElevation,
                            detailsCsvFile: loaded.metadata.detailsCsvFile,
                            isStageRace: true,
                        };
                    }
                }
                catch (e) {
                    // ignore
                }
            }
            if (!stage) {
                return fail(res, 404, `Stage ${stageId} nicht gefunden.`);
            }
            ok(res, StageParser_1.StageParser.summarizeStageProfile(stage.detailsCsvFile, stage.startElevation));
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/simulation/roster/:stageId', (req, res) => {
        const stageId = Number(req.params['stageId']);
        if (!Number.isFinite(stageId))
            return fail(res, 400, 'Ungültige Stage-ID.');
        try {
            const pendingStageIds = new Set(getGss().loadStatus().pendingStages.map((stage) => stage.stageId));
            if (!pendingStageIds.has(stageId)) {
                return fail(res, 400, 'Diese Etappe ist aktuell nicht fÃ¼r das Starterfeld freigegeben.');
            }
            const db = dbService.getActiveConnection();
            const repo = new GameRepository_1.GameRepository(db);
            const stage = repo.getStageById(stageId);
            if (!stage) {
                return fail(res, 404, `Stage ${stageId} nicht gefunden.`);
            }
            const race = repo.getRaceById(stage.raceId);
            if (!race) {
                return fail(res, 404, `Rennen ${stage.raceId} nicht gefunden.`);
            }
            ok(res, (0, RaceRosterService_1.previewRaceRosterEditor)(db, repo, race, stage));
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.post('/simulation/roster/:stageId/apply', (req, res) => {
        const stageId = Number(req.params['stageId']);
        if (!Number.isFinite(stageId))
            return fail(res, 400, 'UngÃ¼ltige Stage-ID.');
        try {
            const pendingStageIds = new Set(getGss().loadStatus().pendingStages.map((stage) => stage.stageId));
            if (!pendingStageIds.has(stageId)) {
                return fail(res, 400, 'Diese Etappe ist aktuell nicht fÃ¼r das Starterfeld freigegeben.');
            }
            const payload = req.body;
            if (!payload || !Array.isArray(payload.riderIds)) {
                return fail(res, 400, 'Es wurden keine Teilnehmer Ã¼bergeben.');
            }
            const db = dbService.getActiveConnection();
            ensureWeatherRolled(db, stageId);
            const repo = new GameRepository_1.GameRepository(db);
            const stage = repo.getStageById(stageId);
            if (!stage) {
                return fail(res, 404, `Stage ${stageId} nicht gefunden.`);
            }
            const race = repo.getRaceById(stage.raceId);
            if (!race) {
                return fail(res, 404, `Rennen ${stage.raceId} nicht gefunden.`);
            }
            const riders = (0, RaceRosterService_1.applyRaceRosterSelection)(db, repo, race, stage, payload.riderIds);
            if (riders.length === 0) {
                return fail(res, 400, 'FÃ¼r diese Etappe konnte keine Startliste gespeichert werden.');
            }
            const ALL_SKILL_KEYS = ['flat', 'mountain', 'mediumMountain', 'hill', 'timeTrial', 'prologue', 'cobble', 'sprint', 'acceleration', 'downhill', 'attack', 'stamina', 'resistance', 'recuperation'];
            for (const rider of riders) {
                if (rider.age && rider.age <= 22) {
                    const mentors = riders.filter(m => m.id !== rider.id &&
                        m.activeTeamId === rider.activeTeamId &&
                        m.age && m.age > 32 &&
                        m.overallRating >= 73 &&
                        (m.riderType === rider.riderType ||
                            (rider.specialization1 && m.riderType === rider.specialization1) ||
                            (rider.specialization2 && m.riderType === rider.specialization2) ||
                            (rider.specialization3 && m.riderType === rider.specialization3)));
                    if (mentors.length > 0) {
                        rider.mentorBoosts = {};
                        for (let i = 0; i < mentors.length; i++) {
                            const shuffled = [...ALL_SKILL_KEYS].sort(() => 0.5 - Math.random());
                            for (let j = 0; j < 3; j++) {
                                const key = shuffled[j];
                                rider.mentorBoosts[key] = (rider.mentorBoosts[key] || 0) + 1;
                            }
                        }
                    }
                }
            }
            ok(res, {
                race,
                stage,
                riders,
                teams: repo.getTeams().filter((team) => riders.some((rider) => rider.activeTeamId === team.id)),
                stageSummary: StageParser_1.StageParser.summarizeStageProfile(stage.detailsCsvFile, stage.startElevation),
                gcStandings: repo.getPreviousGcStandings(stage.raceId, stage.stageNumber),
                pointsStandings: repo.getPreviousPointsStandings(stage.raceId, stage.stageNumber),
                mountainStandings: repo.getPreviousMountainStandings(stage.raceId, stage.stageNumber),
                youthStandings: repo.getPreviousYouthStandings(stage.raceId, stage.stageNumber),
                classificationLeaders: repo.getPreviousClassificationLeaders(stage.raceId, stage.stageNumber),
                teamStartOrder: resolveRealtimeTeamStartOrder(repo, race, stage.stageNumber, riders),
                skillWeightRules: repo.getSkillWeightRules(),
                stageScoringRules: repo.getStageScoringRules(),
            });
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.post('/simulation/realtime/:stageId/complete', (req, res) => {
        const stageId = Number(req.params['stageId']);
        if (!Number.isFinite(stageId))
            return fail(res, 400, 'UngÃ¼ltige Stage-ID.');
        try {
            const pendingStageIds = new Set(getGss().loadStatus().pendingStages.map((stage) => stage.stageId));
            if (!pendingStageIds.has(stageId)) {
                return fail(res, 400, 'Diese Etappe ist aktuell nicht zur Live-Simulation freigegeben.');
            }
            const payload = req.body;
            if (!payload || !Array.isArray(payload.entries) || payload.entries.length === 0) {
                return fail(res, 400, 'Es wurden keine Live-Ergebnisse Ã¼bergeben.');
            }
            const db = dbService.getActiveConnection();
            ok(res, new StageResultCommitService_1.StageResultCommitService(db).commitRealtimeStage(stageId, payload.entries, payload.markerClassifications ?? [], payload.incidents ?? [], payload.events ?? [], payload.leadoutContributions, payload.superTeamId));
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/results/:stageId', (req, res) => {
        const stageId = Number(req.params['stageId']);
        if (!Number.isFinite(stageId))
            return fail(res, 400, 'UngÃ¼ltige Stage-ID.');
        try {
            const db = dbService.getActiveConnection();
            const payload = new ResultRepository_1.ResultRepository(db).getStageResults(stageId);
            if (!payload)
                return fail(res, 404, `Keine Ergebnisse für Stage ${stageId} gefunden.`);
            ok(res, payload);
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/season-standings', (_req, res) => {
        try {
            const db = dbService.getActiveConnection();
            ok(res, new GameRepository_1.GameRepository(db).getSeasonStandings());
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/leaderboards', (req, res) => {
        const scope = req.query['scope'];
        const metricKey = req.query['metricKey'];
        const period = req.query['period'];
        if (!scope || !metricKey || !period) {
            return fail(res, 400, 'Missing scope, metricKey, or period parameter.');
        }
        try {
            const db = dbService.getActiveConnection();
            const gameState = db.prepare('SELECT season FROM game_state').get();
            const currentSeason = gameState?.season ?? 2026;
            const data = new LeaderboardRepository_1.LeaderboardRepository(db).getLeaderboard(scope, metricKey, period, currentSeason);
            ok(res, data);
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.post('/state/advance', (_req, res) => {
        try {
            ok(res, getGss().advanceDay());
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/draft/:season', (req, res) => {
        try {
            const db = dbService.getActiveConnection();
            const season = parseInt(req.params.season, 10);
            const repo = new GameRepository_1.GameRepository(db);
            const rows = db.prepare(`
        SELECT 
          d.draft_round AS draftRound,
          d.pick_number AS pickNumber,
          d.contract_length AS contractLength,
          d.overall_at_draft AS overallAtDraft,
          d.pot_overall_at_draft AS potOverallAtDraft,
          d.draft_value AS draftValue,
          
          r.id AS riderId,
          r.first_name AS riderFirstName,
          r.last_name AS riderLastName,
          r.birth_year AS riderBirthYear,
          
          c.code_3 AS countryCode,
          
          t.id AS teamId,
          t.name AS teamName,
          
          ot.id AS oldTeamId,
          ot.name AS oldTeamName
          
        FROM draft_history d
        JOIN riders r ON d.rider_id = r.id
        JOIN sta_country c ON r.country_id = c.id
        JOIN teams t ON d.team_id = t.id
        LEFT JOIN teams ot ON d.old_team_id = ot.id
        WHERE d.season = ?
        ORDER BY d.pick_number ASC
      `).all(season);
            ok(res, {
                season,
                rows
            });
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/injuries', (_req, res) => {
        try {
            const db = dbService.getActiveConnection();
            const stateRow = db.prepare(`SELECT season, "current_date" AS current_date FROM game_state WHERE id = 1`).get();
            const season = stateRow?.season ?? new Date().getFullYear();
            const currentDate = stateRow?.current_date ?? new Date().toISOString().split('T')[0];
            const rows = db.prepare(`
        SELECT
          r.id AS riderId,
          r.first_name AS riderFirstName,
          r.last_name AS riderLastName,
          c.code_3 AS countryCode,
          t.abbreviation AS teamAbbreviation,
          t.id AS teamId,
          dt.tier AS teamDivisionTier,
          r.overall_rating AS overallRating,
          CAST(strftime('%Y', 'now') - r.birth_year AS INTEGER) AS age,
          rds.health_status AS healthStatus,
          rds.unavailable_days_remaining AS unavailableDays,
          rds.unavailable_until AS fitDate
        FROM rider_daily_state rds
        JOIN riders r ON rds.rider_id = r.id
        JOIN sta_country c ON r.country_id = c.id
        LEFT JOIN contracts cnt ON r.id = cnt.rider_id AND cnt.status = 'active'
        LEFT JOIN teams t ON cnt.team_id = t.id
        LEFT JOIN division_teams dt ON dt.id = t.division_id
        WHERE rds.health_status IN ('ill', 'injured')
        ORDER BY rds.unavailable_days_remaining DESC
      `).all();
            if (rows.length > 0) {
                const riderIds = rows.map((r) => r.riderId);
                const placeholders = riderIds.map(() => '?').join(', ');
                const missedRacesRows = db.prepare(`
          SELECT
            rsp.rider_id,
            r.name,
            r.start_date AS startDate,
            r.is_stage_race AS isStageRace,
            c.name AS categoryName,
            co.code_3 AS countryCode
          FROM rider_season_programs rsp
          JOIN race_program_races rpr ON rsp.program_id = rpr.program_id
          JOIN races r ON rpr.race_id = r.id
          LEFT JOIN race_categories c ON r.category_id = c.id
          LEFT JOIN sta_country co ON r.country_id = co.id
          WHERE rsp.season = ?
            AND r.start_date >= ?
            AND rsp.rider_id IN (${placeholders})
          ORDER BY r.start_date ASC
        `).all(season, currentDate, ...riderIds);
                for (const row of rows) {
                    if (!row.fitDate)
                        continue;
                    row.missedRaces = missedRacesRows
                        .filter((m) => m.rider_id === row.riderId && m.startDate <= row.fitDate)
                        .map((m) => ({
                        name: m.name,
                        startDate: m.startDate,
                        isStageRace: m.isStageRace === 1,
                        categoryName: m.categoryName,
                        countryCode: m.countryCode,
                    }));
                }
            }
            ok(res, rows);
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    return router;
}
function ensureWeatherRolled(db, stageId) {
    const row = db.prepare('SELECT rolled_weather_id, allowed_weather FROM stages WHERE id = ?').get(stageId);
    if (!row) {
        return;
    }
    if (row.rolled_weather_id != null) {
        return;
    }
    const allowed = row.allowed_weather.split('|').map((id) => parseInt(id.trim(), 10)).filter(Number.isFinite);
    if (allowed.length === 0) {
        allowed.push(1);
    }
    const randomIndex = Math.floor(Math.random() * allowed.length);
    const rolledId = allowed[randomIndex];
    db.prepare('UPDATE stages SET rolled_weather_id = ? WHERE id = ?').run(rolledId, stageId);
}
