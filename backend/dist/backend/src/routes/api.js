"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = createRouter;
const express_1 = require("express");
const GameRepository_1 = require("../db/GameRepository");
const GameStateService_1 = require("../game/GameStateService");
const TimeTrialSimulator_1 = require("../simulation/TimeTrialSimulator");
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
    // ---- Game State ---------------------------------------
    router.get('/state', (_req, res) => {
        try {
            ok(res, getGss().loadState());
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
    // ---- Simulation ---------------------------------------
    router.get('/races/:id/results', (req, res) => {
        const id = Number(req.params['id']);
        if (!Number.isFinite(id))
            return fail(res, 400, 'Ungültige Rennen-ID.');
        try {
            const db = dbService.getActiveConnection();
            const repo = new GameRepository_1.GameRepository(db);
            const result = repo.getRaceResults(id);
            if (!result)
                return fail(res, 404, 'Keine Ergebnisse für dieses Rennen.');
            ok(res, result);
        }
        catch (e) {
            fail(res, 500, e.message);
        }
    });
    router.post('/races/:id/simulate', (req, res) => {
        const id = Number(req.params['id']);
        if (!Number.isFinite(id))
            return fail(res, 400, 'Ungültige Rennen-ID.');
        try {
            const db = dbService.getActiveConnection();
            const repo = new GameRepository_1.GameRepository(db);
            const race = repo.getRaceById(id);
            if (!race)
                return fail(res, 404, `Rennen ${id} nicht gefunden.`);
            if (race.type !== 'TimeTrial')
                return fail(res, 400, `Rennen "${race.name}" ist kein Zeitfahren.`);
            const riders = repo.getRaceRiders(id);
            if (riders.length === 0)
                return fail(res, 400, 'Keine Fahrer für dieses Rennen gemeldet.');
            const result = TimeTrialSimulator_1.TimeTrialSimulator.simulate(race, riders);
            repo.saveRaceResults(id, result.entries.map((e, idx) => ({
                riderId: e.rider.id, position: idx + 1, timeSec: e.finishTimeSeconds, gapSec: e.gapSeconds, dayForm: e.dayFormFactor,
            })));
            ok(res, result);
        }
        catch (e) {
            fail(res, 500, e.message);
        }
    });
    return router;
}
