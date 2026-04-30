"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = createRouter;
const express_1 = require("express");
const GameRepository_1 = require("../db/GameRepository");
const GameStateService_1 = require("../game/GameStateService");
const RouteImporter_1 = require("../simulation/RouteImporter");
const QuickSimEngine_1 = require("../simulation/QuickSimEngine");
function ok(res, data) {
    const body = { success: true, data };
    res.json(body);
}
function fail(res, status, message) {
    const body = { success: false, error: message };
    res.status(status).json(body);
}
function createRouter(dbService) {
    const router = (0, express_1.Router)();
    const routeImporter = new RouteImporter_1.RouteImporter();
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
    // Gibt alle wählbaren (nicht-U23) Teams aus der Master-DB zurück
    router.get('/teams/available', (_req, res) => {
        let masterDb = null;
        try {
            masterDb = dbService.getMasterConnection();
            const rows = new GameRepository_1.GameRepository(masterDb).getTeams();
            const selectable = rows.filter(t => t.division !== 'U23');
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
            return fail(res, 400, 'Ungültige Team-ID.');
        try {
            const db = dbService.getActiveConnection();
            const repo = new GameRepository_1.GameRepository(db);
            const team = repo.getTeamById(id);
            if (!team)
                return fail(res, 404, `Team ${id} nicht gefunden.`);
            ok(res, { ...team, riders: repo.getRiders(id) });
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
            ok(res, new GameRepository_1.GameRepository(db).getRiders(teamId));
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
    // ---- Stage Editor --------------------------------------
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
    router.post('/simulation/quick/:stageId', (req, res) => {
        const stageId = Number(req.params['stageId']);
        if (!Number.isFinite(stageId))
            return fail(res, 400, 'Ungültige Stage-ID.');
        try {
            const pendingStageIds = new Set(getGss().loadStatus().pendingStages.map((stage) => stage.stageId));
            if (!pendingStageIds.has(stageId)) {
                return fail(res, 400, 'Diese Etappe ist aktuell nicht zur Simulation freigegeben.');
            }
            const db = dbService.getActiveConnection();
            ok(res, new QuickSimEngine_1.QuickSimEngine(db).simulateStage(stageId));
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    router.get('/results/:stageId', (req, res) => {
        const stageId = Number(req.params['stageId']);
        if (!Number.isFinite(stageId))
            return fail(res, 400, 'Ungültige Stage-ID.');
        try {
            const db = dbService.getActiveConnection();
            const payload = new GameRepository_1.GameRepository(db).getStageResults(stageId);
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
    router.post('/state/advance', (_req, res) => {
        try {
            ok(res, getGss().advanceDay());
        }
        catch (e) {
            fail(res, 400, e.message);
        }
    });
    return router;
}
