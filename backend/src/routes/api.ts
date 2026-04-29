import { Router, Request, Response } from 'express';
import { DatabaseService } from '../db/DatabaseService';
import { GameRepository } from '../db/GameRepository';
import { GameStateService } from '../game/GameStateService';
import { RouteImporter } from '../simulation/RouteImporter';
import {
  ApiResponse,
  SavegameMeta,
  Team,
  Rider,
  Race,
  GameState,
  StageEditorDraft,
  StageEditorExportPayload,
  StageEditorExportRequest,
  StageEditorImportRequest,
} from '../../../shared/types';

function ok<T>(res: Response, data: T): void {
  const body: ApiResponse<T> = { success: true, data };
  res.json(body);
}

function fail(res: Response, status: number, message: string): void {
  const body: ApiResponse<never> = { success: false, error: message };
  res.status(status).json(body);
}

export function createRouter(dbService: DatabaseService): Router {
  const router = Router();
  const routeImporter = new RouteImporter();

  // Caches GameStateService per active connection
  let cachedGss: GameStateService | null = null;
  let cachedDb: object | null = null;
  function getGss(): GameStateService {
    const db = dbService.getActiveConnection();
    if (!cachedGss || cachedDb !== db) {
      cachedGss = new GameStateService(db);
      cachedGss.ensureState();
      cachedDb = db;
    }
    return cachedGss;
  }

  // ---- Savegames ----------------------------------------

  router.get('/saves', (_req: Request, res: Response) => {
    try { ok<SavegameMeta[]>(res, dbService.listSaves()); }
    catch (e) { fail(res, 500, (e as Error).message); }
  });

  router.post('/saves', (req: Request, res: Response) => {
    const { filename, careerName, teamId } = req.body as { filename?: string; careerName?: string; teamId?: number };
    if (!filename || !careerName || teamId == null) {
      return fail(res, 400, 'filename, careerName und teamId sind erforderlich.');
    }
    const id = Number(teamId);
    if (!Number.isFinite(id)) return fail(res, 400, 'teamId muss eine Zahl sein.');
    try { dbService.createNewSave(filename, careerName, id); ok<void>(res, undefined); }
    catch (e) { fail(res, 400, (e as Error).message); }
  });

  // Gibt alle wählbaren (nicht-U23) Teams aus der Master-DB zurück
  router.get('/teams/available', (_req: Request, res: Response) => {
    let masterDb: ReturnType<typeof dbService.getMasterConnection> | null = null;
    try {
      masterDb = dbService.getMasterConnection();
      const rows = new GameRepository(masterDb).getTeams();
      const selectable = rows.filter(t => t.division !== 'U23');
      ok<Team[]>(res, selectable);
    } catch (e) { fail(res, 500, (e as Error).message); }
    finally { masterDb?.close(); }
  });

  router.post('/saves/:id/load', (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      dbService.loadSave(id);
      cachedGss = null; // Reset cache after new save loaded
      const saves = dbService.listSaves();
      const meta = saves.find(s => s.filename === id);
      ok<SavegameMeta>(res, meta ?? { id: 0, filename: id, careerName: id, teamName: '', currentSeason: 2026, lastSaved: '' });
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.delete('/saves/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    try { dbService.deleteSave(id); ok<void>(res, undefined); }
    catch (e) { fail(res, 400, (e as Error).message); }
  });

  // ---- Teams --------------------------------------------

  router.get('/teams', (_req: Request, res: Response) => {
    try {
      const db = dbService.getActiveConnection();
      ok<Team[]>(res, new GameRepository(db).getTeams());
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/teams/:id', (req: Request, res: Response) => {
    const id = Number(req.params['id']);
    if (!Number.isFinite(id)) return fail(res, 400, 'Ungültige Team-ID.');
    try {
      const db   = dbService.getActiveConnection();
      const repo = new GameRepository(db);
      const team = repo.getTeamById(id);
      if (!team) return fail(res, 404, `Team ${id} nicht gefunden.`);
      ok<Team & { riders: Rider[] }>(res, { ...team, riders: repo.getRiders(id) });
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  // ---- Riders -------------------------------------------

  router.get('/riders', (req: Request, res: Response) => {
    const teamId = req.query['teamId'] ? Number(req.query['teamId']) : undefined;
    try {
      const db = dbService.getActiveConnection();
      ok<Rider[]>(res, new GameRepository(db).getRiders(teamId));
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  // ---- Races --------------------------------------------

  router.get('/races', (_req: Request, res: Response) => {
    try {
      const db = dbService.getActiveConnection();
      ok<Race[]>(res, new GameRepository(db).getRaces());
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  // ---- Stage Editor --------------------------------------

  router.post('/stage-editor/import', (req: Request, res: Response) => {
    try {
      ok<StageEditorDraft>(res, routeImporter.importRoute(req.body as StageEditorImportRequest));
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.post('/stage-editor/export', (req: Request, res: Response) => {
    try {
      ok<StageEditorExportPayload>(res, routeImporter.exportCsv(req.body as StageEditorExportRequest));
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  // ---- Game State ---------------------------------------

  router.get('/state', (_req: Request, res: Response) => {
    try { ok<GameState>(res, getGss().loadState()); }
    catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.post('/state/advance', (_req: Request, res: Response) => {
    try { ok<GameState>(res, getGss().advanceDay()); }
    catch (e) { fail(res, 400, (e as Error).message); }
  });

  return router;
}
