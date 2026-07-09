import { Router, Request, Response } from 'express';
import { DatabaseService } from '../db/DatabaseService';
import { RiderTeamEditorService } from '../editor/RiderTeamEditorService';
import { RaceProgramsEditorService } from '../editor/RaceProgramsEditorService';
import { GameRepository } from '../db/GameRepository';
import { RiderRepository } from '../db/repositories/RiderRepository';
import { ResultRepository } from '../db/repositories/ResultRepository';
import { LeaderboardRepository } from '../db/repositories/LeaderboardRepository';
import { BadgeRepository } from '../db/repositories/BadgeRepository';
import { GameStateService } from '../game/GameStateService';
import { getRenewalSelectionPayload, saveRenewalSelection } from '../simulation/contractRenewalSelection';
import { RiderDraftService } from '../game/RiderDraftService';
import { RouteImporter } from '../simulation/RouteImporter';
import { applyRaceRosterSelection, ensureRaceEntries, previewRaceRoster, previewRaceRosterEditor } from '../simulation/RaceRosterService';
import { StageResultCommitService } from '../simulation/StageResultCommitService';
import { StageParser } from '../simulation/StageParser';
import {
  ApiResponse,
  ParsedStageSummary,
  SavegameMeta,
  Team,
  Rider,
  Race,
  RaceProgramParticipant,
  GameState,
  GameStatus,
  StageResultCommitResponse,
  RaceRosterEditorPayload,
  RaceRosterSelectionRequest,
  RiderProgramRaceSummary,
  RiderStatsPayload,
  TeamStatsPayload,
  RiderTeamEditorExportPayload,
  RiderTeamEditorPayload,
  RiderTeamEditorSaveRequest,
  RealtimeClassificationLeaders,
  RealtimeStageCommitRequest,
  RealtimeSimulationBootstrap,
  SeasonStandingsPayload,
  DraftHistoryPayload,
  InjuryRow,
  StageEditorDraft,
  StageEditorExistingStageListResponse,
  StageEditorExistingStageLoadResponse,
  StageEditorExportPayload,
  StageEditorExportRequest,
  StageEditorImportRequest,
  StageEditorOverviewResponse,
  StageResultsPayload,
  RaceRosterPayload,
  RacePalmaresPayload,
} from '../../../shared/types';

function ok<T>(res: Response, data: T): void {
  const body: ApiResponse<T> = { success: true, data };
  res.json(body);
}

function fail(res: Response, status: number, message: string): void {
  const body: ApiResponse<never> = { success: false, error: message };
  res.status(status).json(body);
}

function resolveRealtimeTeamStartOrder(repo: any, race: Race, stageNumber: number, riders: Rider[]): number[] {
  const participatingTeams = new Map<number, Team>();
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
    const teamTotals = new Map<number, number[]>();

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
        if (leftTotal != null) return 1;
        if (rightTotal != null) return -1;
        return left.name.localeCompare(right.name, 'de');
      })
      .map((team) => team.id);
  }

  const seasonTeamPoints = new Map(
    repo.getSeasonStandings().teamStandings
      .filter((row: any) => row.teamId != null && participatingTeamIds.has(row.teamId))
      .map((row: any) => [row.teamId as number, row.points] as const),
  );

  return [...participatingTeams.values()]
    .sort((left, right) => {
      const leftPoints = seasonTeamPoints.get(left.id) ?? 0;
      const rightPoints = seasonTeamPoints.get(right.id) ?? 0;

      if (leftPoints === 0 && rightPoints === 0) {
        return left.name.localeCompare(right.name, 'de');
      }
      if (leftPoints === 0) return -1;
      if (rightPoints === 0) return 1;
      return (leftPoints as number) - (rightPoints as number) || left.name.localeCompare(right.name, 'de');
    })
    .map((team: any) => team.id);
}

function getSinglePickDetails(db: any, season: number, pickNumber: number): any {
  // 1. Get the draft history row
  const r = db.prepare(`
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
      ot.name AS oldTeamName,
      
      spec.display_name AS riderSpecialization
      
    FROM draft_history d
    JOIN riders r ON d.rider_id = r.id
    JOIN sta_country c ON r.country_id = c.id
    JOIN teams t ON d.team_id = t.id
    LEFT JOIN teams ot ON d.old_team_id = ot.id
    LEFT JOIN type_rider spec ON r.specialization_1_id = spec.id
    WHERE d.season = ? AND d.pick_number = ?
  `).get(season, pickNumber) as any;

  if (!r) return null;

  // 2. Get UCI Ranks for the previous year
  const uciPointsRows = db.prepare(`
    SELECT rider_id, SUM(points_awarded) AS points
    FROM season_point_events
    WHERE season = ?
    GROUP BY rider_id
    ORDER BY points DESC
  `).all(season - 1) as Array<{ rider_id: number, points: number }>;
  
  const uciRanks = new Map<number, number>();
  uciPointsRows.forEach((row, index) => {
    uciRanks.set(row.rider_id, index + 1);
  });

  // 3. Get wins map
  const winsRow = db.prepare(`
    SELECT SUM(gc_wins + stage_wins + one_day_wins) AS wins
    FROM rider_career_category_stats
    WHERE rider_id = ?
  `).get(r.riderId) as { wins: number | null } | undefined;
  const riderWins = winsRow?.wins ?? 0;

  // 4. Get candidates from pool
  const candidatesRaw = db.prepare(`
    SELECT 
      p.rider_id AS riderId,
      p.weight AS weight,
      p.probability AS probability,
      COALESCE(p.old_team_id, (
        SELECT team_id FROM contracts 
        WHERE rider_id = p.rider_id AND end_season = ? - 1
        ORDER BY end_season DESC LIMIT 1
      )) AS oldTeamId,
      COALESCE(ot.name, (
        SELECT name FROM teams 
        WHERE id = (
          SELECT team_id FROM contracts 
          WHERE rider_id = p.rider_id AND end_season = ? - 1
          ORDER BY end_season DESC LIMIT 1
        )
      )) AS oldTeamName,
      r.first_name AS firstName,
      r.last_name AS lastName,
      r.overall_rating AS overallRating,
      r.pot_overall AS potential,
      r.birth_year AS birthYear,
      spec1.display_name AS specialization1,
      spec2.display_name AS specialization2,
      spec3.display_name AS specialization3,
      c.code_3 AS countryCode
    FROM draft_picks_pool p
    JOIN riders r ON p.rider_id = r.id
    LEFT JOIN teams ot ON p.old_team_id = ot.id
    LEFT JOIN type_rider spec1 ON r.specialization_1_id = spec1.id
    LEFT JOIN type_rider spec2 ON r.specialization_2_id = spec2.id
    LEFT JOIN type_rider spec3 ON r.specialization_3_id = spec3.id
    JOIN sta_country c ON r.country_id = c.id
    WHERE p.season = ? AND p.pick_number = ?
    ORDER BY p.probability DESC
  `).all(season, season, season, pickNumber) as any[];

  // 5. Get career wins of candidates
  const candidateRiderIds = candidatesRaw.map(cand => cand.riderId);
  const winsMap = new Map<number, number>();
  if (candidateRiderIds.length > 0) {
    const placeholders = candidateRiderIds.map(() => '?').join(',');
    const winsRows = db.prepare(`
      SELECT rider_id, SUM(gc_wins + stage_wins + one_day_wins) AS wins
      FROM rider_career_category_stats
      WHERE rider_id IN (${placeholders})
      GROUP BY rider_id
    `).all(...candidateRiderIds) as Array<{ rider_id: number; wins: number }>;

    for (const row of winsRows) {
      winsMap.set(row.rider_id, row.wins);
    }
  }

  const candidates = candidatesRaw.map(cand => {
    const uciRank = uciRanks.get(cand.riderId) ?? null;
    const wins = winsMap.get(cand.riderId) ?? 0;
    return {
      riderId: cand.riderId,
      firstName: cand.firstName,
      lastName: cand.lastName,
      countryCode: cand.countryCode,
      specialization1: cand.specialization1 || null,
      specialization2: cand.specialization2 || null,
      specialization3: cand.specialization3 || null,
      overallRating: cand.overallRating,
      potential: cand.potential,
      probability: cand.probability,
      oldTeamId: cand.oldTeamId,
      oldTeamName: cand.oldTeamName,
      birthYear: cand.birthYear,
      uciRank,
      wins
    };
  });

  return {
    ...r,
    candidates
  };
}

export function createRouter(dbService: DatabaseService): Router {
  const router = Router();
  const routeImporter = new RouteImporter();
  const riderTeamEditorService = new RiderTeamEditorService();
  const raceProgramsEditorService = new RaceProgramsEditorService();

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
    catch (e) {
      console.error('ERROR IN CREATE SAVE:', e);
      fail(res, 400, (e as Error).message);
    }
  });

  // Gibt alle wÃ¤hlbaren (nicht-U23) Teams aus der Master-DB zurÃ¼ck
  router.get('/teams/available', (_req: Request, res: Response) => {
    let masterDb: ReturnType<typeof dbService.getMasterConnection> | null = null;
    try {
      masterDb = dbService.getMasterConnection();
      const rows = new GameRepository(masterDb).getTeams();
      const selectable = rows.filter((t: any) => t.division !== 'U23');
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
    if (!Number.isFinite(id)) return fail(res, 400, 'UngÃ¼ltige Team-ID.');
    try {
      const db   = dbService.getActiveConnection();
      getGss().ensureState();
      // Use TeamRepository to get the team
      const { TeamRepository } = require('../db/repositories/TeamRepository');
      const teamRepo = new TeamRepository(db);
      const team = teamRepo.getTeamById(id);
      if (!team) return fail(res, 404, `Team ${id} nicht gefunden.`);
      ok<Team & { riders: Rider[] }>(res, { ...team, riders: new RiderRepository(db).getRiders(id, true) });
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/teams/:id/stats', (req: Request, res: Response) => {
    const id = Number(req.params['id']);
    if (!Number.isFinite(id)) return fail(res, 400, 'Ungültige Team-ID.');
    try {
      const db = dbService.getActiveConnection();
      getGss().ensureState();
      const { TeamRepository } = require('../db/repositories/TeamRepository');
      const teamRepo = new TeamRepository(db);
      const payload = teamRepo.getTeamStats(id);
      if (!payload) return fail(res, 404, `Team ${id} nicht gefunden.`);
      ok<TeamStatsPayload>(res, payload);
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  // ---- Riders -------------------------------------------

  router.get('/riders', (req: Request, res: Response) => {
    const teamId = req.query['teamId'] ? Number(req.query['teamId']) : undefined;
    const onlyWithTeam = req.query['onlyWithTeam'] === 'true';
    const season = req.query['season'] ? Number(req.query['season']) : undefined;
    const summary = req.query['summary'] === 'true';
    try {
      const db = dbService.getActiveConnection();
      getGss().ensureState();
      ok<Rider[]>(res, new RiderRepository(db).getRiders(teamId, false, onlyWithTeam, season, !summary));
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/riders/:id/program-races', (req: Request, res: Response) => {
    const riderId = Number(req.params['id']);
    if (!Number.isFinite(riderId)) return fail(res, 400, 'UngÃ¼ltige Fahrer-ID.');
    try {
      const db = dbService.getActiveConnection();
      getGss().ensureState();
      const payload = new RiderRepository(db).getRiderProgramRaceSummary(riderId);
      if (!payload) return fail(res, 404, `Kein Programm fuer Fahrer ${riderId} gefunden.`);
      ok<RiderProgramRaceSummary>(res, payload);
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/riders/:id/stats', (req: Request, res: Response) => {
    const riderId = Number(req.params['id']);
    if (!Number.isFinite(riderId)) return fail(res, 400, 'UngÃ¼ltige Fahrer-ID.');
    try {
      const db = dbService.getActiveConnection();
      getGss().ensureState();
      const excludeFatigue = req.query['excludeFatigue'] === 'true';
      const payload = new RiderRepository(db).getRiderStats(riderId, excludeFatigue);
      if (!payload) return fail(res, 404, `Fahrer ${riderId} nicht gefunden.`);
      ok<RiderStatsPayload>(res, payload);
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/rider-team-editor', (_req: Request, res: Response) => {
    try {
      ok<RiderTeamEditorPayload>(res, riderTeamEditorService.load());
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.post('/rider-team-editor', (req: Request, res: Response) => {
    try {
      ok<RiderTeamEditorPayload>(res, riderTeamEditorService.save(req.body as RiderTeamEditorSaveRequest));
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.post('/rider-team-editor/export', (req: Request, res: Response) => {
    try {
      ok<RiderTeamEditorExportPayload>(res, riderTeamEditorService.export(req.body as RiderTeamEditorSaveRequest));
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/race-programs-editor', (_req: Request, res: Response) => {
    try {
      let activeDb;
      try {
        activeDb = dbService.getActiveConnection();
      } catch (e) {
        // active connection may not exist
      }
      ok(res, raceProgramsEditorService.load(activeDb));
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.post('/race-programs-editor/save', (req: Request, res: Response) => {
    try {
      let activeDb;
      try {
        activeDb = dbService.getActiveConnection();
      } catch (e) {
        // active connection may not exist (e.g. at start screen)
      }
      raceProgramsEditorService.save(req.body, activeDb);
      ok(res, undefined);
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  // ---- Races --------------------------------------------

  router.get('/races', (_req: Request, res: Response) => {
    try {
      const db = dbService.getActiveConnection();
      ok<Race[]>(res, new GameRepository(db).getRaces());
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/races/:id/program-participants', (req: Request, res: Response) => {
    const raceId = Number(req.params['id']);
    if (!Number.isFinite(raceId)) return fail(res, 400, 'UngÃ¼ltige Rennen-ID.');
    try {
      const db = dbService.getActiveConnection();
      getGss().ensureState();
      ok<RaceProgramParticipant[]>(res, new GameRepository(db).getRaceProgramParticipants(raceId));
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/races/:id/results-roster', (req: Request, res: Response) => {
    const raceId = Number(req.params['id']);
    if (!Number.isFinite(raceId)) return fail(res, 400, 'Ungültige Rennen-ID.');
    try {
      const db = dbService.getActiveConnection();
      const result = new ResultRepository(db).getRaceRoster(raceId);
      if (!result) return fail(res, 404, 'Keine Teilnehmerdaten verfügbar (Rennen noch nicht gestartet?).');
      ok<RaceRosterPayload>(res, result);
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/races/:id/history', (req: Request, res: Response) => {
    const raceId = Number(req.params['id']);
    if (!Number.isFinite(raceId)) return fail(res, 400, 'Ungültige Rennen-ID.');
    try {
      const db = dbService.getActiveConnection();
      ok<RacePalmaresPayload>(res, new ResultRepository(db).getRacePalmares(raceId));
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  // ---- Stage Editor --------------------------------------

  router.get('/stage-editor/stages', (_req: Request, res: Response) => {
    try {
      ok<StageEditorExistingStageListResponse>(res, routeImporter.listExistingStages());
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/stage-editor/overview', (_req: Request, res: Response) => {
    try {
      ok<StageEditorOverviewResponse>(res, routeImporter.listOverview());
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/stage-editor/stages/:stageId', (req: Request, res: Response) => {
    const stageId = Number(req.params['stageId']);
    if (!Number.isInteger(stageId) || stageId <= 0) return fail(res, 400, 'UngÃ¼ltige Stage-ID.');
    try {
      ok<StageEditorExistingStageLoadResponse>(res, routeImporter.loadExistingStage(stageId));
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

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

  router.get('/stage-editor/countries', (_req: Request, res: Response) => {
    try {
      ok(res, routeImporter.loadCountriesList());
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/stage-editor/race-categories', (_req: Request, res: Response) => {
    try {
      ok(res, routeImporter.loadRaceCategoriesList());
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/stage-editor/race-programs', (_req: Request, res: Response) => {
    try {
      ok(res, routeImporter.loadRaceProgramsList());
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  // ---- Game State ---------------------------------------

  router.get('/state', (_req: Request, res: Response) => {
    try { ok<GameState>(res, getGss().loadState()); }
    catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/game/status', (_req: Request, res: Response) => {
    try { ok<GameStatus>(res, getGss().loadStatus()); }
    catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/simulation/realtime/:stageId', (req: Request, res: Response) => {
    const stageId = Number(req.params['stageId']);
    if (!Number.isFinite(stageId)) return fail(res, 400, 'UngÃ¼ltige Stage-ID.');

    try {
      const pendingStageIds = new Set(getGss().loadStatus().pendingStages.map((stage) => stage.stageId));
      if (!pendingStageIds.has(stageId)) {
        return fail(res, 400, 'Diese Etappe ist aktuell nicht zur Live-Simulation freigegeben.');
      }

      const db = dbService.getActiveConnection();
      ensureWeatherRolled(db, stageId);
      const repo = new GameRepository(db);
      const stage = repo.getStageById(stageId);
      if (!stage) {
        return fail(res, 404, `Stage ${stageId} nicht gefunden.`);
      }

      const race = repo.getRaceById(stage.raceId);
      if (!race) {
        return fail(res, 404, `Rennen ${stage.raceId} nicht gefunden.`);
      }

      const riders = ensureRaceEntries(db, repo, race, stage);
      if (riders.length === 0) {
        return fail(res, 400, 'Für diese Etappe konnte keine Startliste bestimmt werden.');
      }

      const season = db.prepare('SELECT season FROM game_state WHERE id = 1').get() as { season: number };
      const lieutenants = db.prepare('SELECT leader_id AS leaderId, lieutenant_id AS lieutenantId FROM rider_lieutenants WHERE season = ?').all(season?.season || 2026) as any[];

      ok<RealtimeSimulationBootstrap>(res, {
        race,
        stage,
        riders,
        teams: repo.getTeams().filter((team: any) => riders.some((rider: any) => rider.activeTeamId === team.id)),
        stageSummary: StageParser.summarizeStageProfile(stage.detailsCsvFile, stage.startElevation),
        gcStandings: repo.getPreviousGcStandings(stage.raceId, stage.stageNumber),
        pointsStandings: repo.getPreviousPointsStandings(stage.raceId, stage.stageNumber),
        mountainStandings: repo.getPreviousMountainStandings(stage.raceId, stage.stageNumber),
        youthStandings: repo.getPreviousYouthStandings(stage.raceId, stage.stageNumber),
        classificationLeaders: repo.getPreviousClassificationLeaders(stage.raceId, stage.stageNumber),
        teamStartOrder: resolveRealtimeTeamStartOrder(repo, race, stage.stageNumber, riders),
        skillWeightRules: repo.getSkillWeightRules(),
        stageScoringRules: repo.getStageScoringRules(),
        lieutenants,
      });
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/stages/:stageId/summary', (req: Request, res: Response) => {
    const stageId = Number(req.params['stageId']);
    if (!Number.isFinite(stageId)) return fail(res, 400, 'Ungültige Stage-ID.');

    try {
      const db = dbService.getActiveConnection();
      const repo = new GameRepository(db);
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
            } as any;
          }
        } catch (e) {
          // ignore
        }
      }
      if (!stage) {
        return fail(res, 404, `Stage ${stageId} nicht gefunden.`);
      }

      ok<ParsedStageSummary>(res, StageParser.summarizeStageProfile(stage.detailsCsvFile, stage.startElevation));
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/simulation/roster/:stageId', (req: Request, res: Response) => {
    const stageId = Number(req.params['stageId']);
    if (!Number.isFinite(stageId)) return fail(res, 400, 'Ungültige Stage-ID.');

    try {
      const pendingStageIds = new Set(getGss().loadStatus().pendingStages.map((stage) => stage.stageId));
      if (!pendingStageIds.has(stageId)) {
        return fail(res, 400, 'Diese Etappe ist aktuell nicht fÃ¼r das Starterfeld freigegeben.');
      }

      const db = dbService.getActiveConnection();
      const repo = new GameRepository(db);
      const stage = repo.getStageById(stageId);
      if (!stage) {
        return fail(res, 404, `Stage ${stageId} nicht gefunden.`);
      }

      const race = repo.getRaceById(stage.raceId);
      if (!race) {
        return fail(res, 404, `Rennen ${stage.raceId} nicht gefunden.`);
      }

      ok<RaceRosterEditorPayload>(res, previewRaceRosterEditor(db, repo, race, stage));
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.post('/simulation/roster/:stageId/apply', (req: Request, res: Response) => {
    const stageId = Number(req.params['stageId']);
    if (!Number.isFinite(stageId)) return fail(res, 400, 'UngÃ¼ltige Stage-ID.');

    try {
      const pendingStageIds = new Set(getGss().loadStatus().pendingStages.map((stage) => stage.stageId));
      if (!pendingStageIds.has(stageId)) {
        return fail(res, 400, 'Diese Etappe ist aktuell nicht fÃ¼r das Starterfeld freigegeben.');
      }

      const payload = req.body as RaceRosterSelectionRequest;
      if (!payload || !Array.isArray(payload.riderIds)) {
        return fail(res, 400, 'Es wurden keine Teilnehmer Ã¼bergeben.');
      }

      const db = dbService.getActiveConnection();
      ensureWeatherRolled(db, stageId);
      const repo = new GameRepository(db);
      const stage = repo.getStageById(stageId);
      if (!stage) {
        return fail(res, 404, `Stage ${stageId} nicht gefunden.`);
      }

      const race = repo.getRaceById(stage.raceId);
      if (!race) {
        return fail(res, 404, `Rennen ${stage.raceId} nicht gefunden.`);
      }

      const riders = applyRaceRosterSelection(db, repo, race, stage, payload.riderIds);
      if (riders.length === 0) {
        return fail(res, 400, 'FÃ¼r diese Etappe konnte keine Startliste gespeichert werden.');
      }

      const ALL_SKILL_KEYS: import('../../../shared/types').RiderSkillKey[] = ['flat', 'mountain', 'mediumMountain', 'hill', 'timeTrial', 'prologue', 'cobble', 'sprint', 'acceleration', 'downhill', 'attack', 'stamina', 'resistance', 'recuperation'];
      for (const rider of riders) {
        if (rider.age && rider.age <= 22) {
          const mentors = riders.filter(m => 
            m.id !== rider.id &&
            m.activeTeamId === rider.activeTeamId &&
            m.age && m.age > 32 &&
            m.overallRating >= 73 &&
            (
              m.riderType === rider.riderType ||
              (rider.specialization1 && m.riderType === rider.specialization1) ||
              (rider.specialization2 && m.riderType === rider.specialization2) ||
              (rider.specialization3 && m.riderType === rider.specialization3)
            )
          );

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

      const season = db.prepare('SELECT season FROM game_state WHERE id = 1').get() as { season: number };
      const lieutenants = db.prepare('SELECT leader_id AS leaderId, lieutenant_id AS lieutenantId FROM rider_lieutenants WHERE season = ?').all(season?.season || 2026) as any[];

      ok<RealtimeSimulationBootstrap>(res, {
        race,
        stage,
        riders,
        teams: repo.getTeams().filter((team: any) => riders.some((rider: any) => rider.activeTeamId === team.id)),
        stageSummary: StageParser.summarizeStageProfile(stage.detailsCsvFile, stage.startElevation),
        gcStandings: repo.getPreviousGcStandings(stage.raceId, stage.stageNumber),
        pointsStandings: repo.getPreviousPointsStandings(stage.raceId, stage.stageNumber),
        mountainStandings: repo.getPreviousMountainStandings(stage.raceId, stage.stageNumber),
        youthStandings: repo.getPreviousYouthStandings(stage.raceId, stage.stageNumber),
        classificationLeaders: repo.getPreviousClassificationLeaders(stage.raceId, stage.stageNumber),
        teamStartOrder: resolveRealtimeTeamStartOrder(repo, race, stage.stageNumber, riders),
        skillWeightRules: repo.getSkillWeightRules(),
        stageScoringRules: repo.getStageScoringRules(),
        lieutenants,
      });
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.post('/simulation/realtime/:stageId/complete', (req: Request, res: Response) => {
    const stageId = Number(req.params['stageId']);
    if (!Number.isFinite(stageId)) return fail(res, 400, 'UngÃ¼ltige Stage-ID.');

    try {
      const pendingStageIds = new Set(getGss().loadStatus().pendingStages.map((stage) => stage.stageId));
      if (!pendingStageIds.has(stageId)) {
        return fail(res, 400, 'Diese Etappe ist aktuell nicht zur Live-Simulation freigegeben.');
      }

      const payload = req.body as RealtimeStageCommitRequest;
      if (!payload || !Array.isArray(payload.entries) || payload.entries.length === 0) {
        return fail(res, 400, 'Es wurden keine Live-Ergebnisse Ã¼bergeben.');
      }

      const db = dbService.getActiveConnection();
      ok<StageResultCommitResponse>(res, new StageResultCommitService(db).commitRealtimeStage(
        stageId,
        payload.entries,
        payload.markerClassifications ?? [],
        payload.incidents ?? [],
        payload.events ?? [],
        payload.leadoutContributions,
        payload.superTeamId
      ));
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/results/:stageId', (req: Request, res: Response) => {
    const stageId = Number(req.params['stageId']);
    if (!Number.isFinite(stageId)) return fail(res, 400, 'UngÃ¼ltige Stage-ID.');

    try {
      const db = dbService.getActiveConnection();
      const payload = new ResultRepository(db).getStageResults(stageId);
      if (!payload) return fail(res, 404, `Keine Ergebnisse für Stage ${stageId} gefunden.`);
      ok<StageResultsPayload>(res, payload);
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/season-standings', (req: Request, res: Response) => {
    try {
      const db = dbService.getActiveConnection();
      const seasonQuery = req.query['season'];
      const season = seasonQuery ? Number(seasonQuery) : undefined;
      ok<SeasonStandingsPayload>(res, new ResultRepository(db).getSeasonStandings(season));
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/leaderboards', (req: Request, res: Response) => {
    const scope = req.query['scope'] as 'riders' | 'teams';
    const metricKey = req.query['metricKey'] as string;
    const period = req.query['period'] as 'season' | 'alltime' | 'live';

    if (!scope || !metricKey || !period) {
      return fail(res, 400, 'Missing scope, metricKey, or period parameter.');
    }

    try {
      const db = dbService.getActiveConnection();
      const gameState = db.prepare('SELECT season FROM game_state').get() as { season: number } | undefined;
      const currentSeason = gameState?.season ?? 2026;
      const includeAll = req.query['all'] === '1' || req.query['all'] === 'true';
      const data = new LeaderboardRepository(db).getLeaderboard(scope, metricKey, period, currentSeason, includeAll);
      ok(res, data);
    } catch (e) {
      fail(res, 400, (e as Error).message);
    }
  });

  // Halter eines (bespoke) Hall-of-Fame-Badges aus der materialisierten
  // Tabelle rider_badges — inkl. WorldTour/ProTour/sonstige/zurueckgetreten.
  router.get('/badges/holders', (req: Request, res: Response) => {
    const badgeKey = req.query['badgeKey'] as string;
    if (!badgeKey) {
      return fail(res, 400, 'Missing badgeKey parameter.');
    }
    try {
      const db = dbService.getActiveConnection();
      ok(res, new BadgeRepository(db).getBadgeHolders(badgeKey));
    } catch (e) {
      fail(res, 400, (e as Error).message);
    }
  });

  router.post('/state/advance', (_req: Request, res: Response) => {
    try { ok<GameState>(res, getGss().advanceDay()); }
    catch (e) { fail(res, 400, (e as Error).message); }
  });

  // Spieler-Vertragsverlängerungen: Auswahlfenster (10.01.)
  router.get('/contract-renewals', (_req: Request, res: Response) => {
    try { ok(res, getRenewalSelectionPayload(dbService.getActiveConnection())); }
    catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.post('/contract-renewals/select', (req: Request, res: Response) => {
    try {
      const riderIds = Array.isArray(req.body?.riderIds) ? req.body.riderIds.map((n: any) => Number(n)) : [];
      saveRenewalSelection(dbService.getActiveConnection(), riderIds);
      ok(res, getRenewalSelectionPayload(dbService.getActiveConnection()));
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  
  router.get('/draft/:season', (req: Request, res: Response) => {
    try {
      const db = dbService.getActiveConnection();
      const season = parseInt(req.params.season, 10);
      const repo = new GameRepository(db);

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
      `).all(season) as any[];

      ok<DraftHistoryPayload>(res, {
        season,
        rows
      });
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/draft/:season/details', (req: Request, res: Response) => {
    try {
      const db = dbService.getActiveConnection();
      const season = parseInt(req.params.season, 10);
      
      // UCI-Ranks für das Vorjahr ermitteln
      const uciPointsRows = db.prepare(`
        SELECT rider_id, SUM(points_awarded) AS points
        FROM season_point_events
        WHERE season = ?
        GROUP BY rider_id
        ORDER BY points DESC
      `).all(season - 1) as Array<{ rider_id: number, points: number }>;
      
      const uciRanks = new Map<number, number>();
      uciPointsRows.forEach((row, index) => {
        uciRanks.set(row.rider_id, index + 1);
      });

      // Draft-Historie abfragen
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
          ot.name AS oldTeamName,
          
          spec.display_name AS riderSpecialization
          
        FROM draft_history d
        JOIN riders r ON d.rider_id = r.id
        JOIN sta_country c ON r.country_id = c.id
        JOIN teams t ON d.team_id = t.id
        LEFT JOIN teams ot ON d.old_team_id = ot.id
        LEFT JOIN type_rider spec ON r.specialization_1_id = spec.id
        WHERE d.season = ?
        ORDER BY d.pick_number ASC
      `).all(season) as any[];

      // Kandidaten-Pools abfragen
      const candidatesRaw = db.prepare(`
        SELECT 
          p.pick_number AS pickNumber,
          p.rider_id AS riderId,
          p.weight AS weight,
          p.probability AS probability,
          COALESCE(p.old_team_id, (
            SELECT team_id FROM contracts 
            WHERE rider_id = p.rider_id AND end_season = ? - 1
            ORDER BY end_season DESC LIMIT 1
          )) AS oldTeamId,
          COALESCE(ot.name, (
            SELECT name FROM teams 
            WHERE id = (
              SELECT team_id FROM contracts 
              WHERE rider_id = p.rider_id AND end_season = ? - 1
              ORDER BY end_season DESC LIMIT 1
            )
          )) AS oldTeamName,
          r.first_name AS firstName,
          r.last_name AS lastName,
          r.overall_rating AS overallRating,
          r.pot_overall AS potential,
          r.birth_year AS birthYear,
          spec1.display_name AS specialization1,
          spec2.display_name AS specialization2,
          spec3.display_name AS specialization3,
          c.code_3 AS countryCode
        FROM draft_picks_pool p
        JOIN riders r ON p.rider_id = r.id
        LEFT JOIN teams ot ON p.old_team_id = ot.id
        LEFT JOIN type_rider spec1 ON r.specialization_1_id = spec1.id
        LEFT JOIN type_rider spec2 ON r.specialization_2_id = spec2.id
        LEFT JOIN type_rider spec3 ON r.specialization_3_id = spec3.id
        JOIN sta_country c ON r.country_id = c.id
        WHERE p.season = ?
        ORDER BY p.pick_number ASC, p.probability DESC
      `).all(season, season, season) as any[];

      // Extrahieren aller Rider-IDs für die Sieges-Abfrage
      const riderIdsSet = new Set<number>();
      for (const row of rows) riderIdsSet.add(row.riderId);
      for (const row of candidatesRaw) riderIdsSet.add(row.riderId);
      const riderIds = Array.from(riderIdsSet);

      // Karrieresiege nur für benötigte Fahrer abfragen
      const winsMap = new Map<number, number>();
      if (riderIds.length > 0) {
        const chunkSize = 500;
        for (let i = 0; i < riderIds.length; i += chunkSize) {
          const chunk = riderIds.slice(i, i + chunkSize);
          const placeholders = chunk.map(() => '?').join(',');
          
          const winsRows = db.prepare(`
            SELECT rider_id, SUM(gc_wins + stage_wins + one_day_wins) AS wins
            FROM rider_career_category_stats
            WHERE rider_id IN (${placeholders})
            GROUP BY rider_id
          `).all(...chunk) as Array<{ rider_id: number; wins: number }>;

          for (const row of winsRows) {
            winsMap.set(row.rider_id, (winsMap.get(row.rider_id) ?? 0) + row.wins);
          }
        }
      }

      const candidatesByPick = new Map<number, any[]>();
      for (const cand of candidatesRaw) {
        const uciRank = uciRanks.get(cand.riderId) ?? null;
        const wins = winsMap.get(cand.riderId) ?? 0;
        const candidateObj = {
          riderId: cand.riderId,
          firstName: cand.firstName,
          lastName: cand.lastName,
          countryCode: cand.countryCode,
          specialization1: cand.specialization1 || null,
          specialization2: cand.specialization2 || null,
          specialization3: cand.specialization3 || null,
          overallRating: cand.overallRating,
          potential: cand.potential,
          probability: cand.probability,
          oldTeamId: cand.oldTeamId,
          oldTeamName: cand.oldTeamName,
          birthYear: cand.birthYear,
          uciRank,
          wins
        };
        
        if (!candidatesByPick.has(cand.pickNumber)) {
          candidatesByPick.set(cand.pickNumber, []);
        }
        candidatesByPick.get(cand.pickNumber)!.push(candidateObj);
      }
      
      const picksWithCandidates = rows.map(r => {
        return {
          ...r,
          candidates: candidatesByPick.get(r.pickNumber) ?? []
        };
      });

      ok(res, {
        season,
        picks: picksWithCandidates
      });
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/draft/:season/state', (req: Request, res: Response) => {
    try {
      const db = dbService.getActiveConnection();
      const season = parseInt(req.params.season, 10);
      const draftService = new RiderDraftService(db);
      const state = draftService.getNextPickState(season);

      let candidates: any[] = [];
      let nextTeamName: string | null = null;
      if (state.nextTeamId !== null) {
        const teamRow = db.prepare('SELECT name FROM teams WHERE id = ?').get(state.nextTeamId) as { name: string } | undefined;
        nextTeamName = teamRow?.name ?? null;

        // If it's the player team, load candidates
        if (state.isPlayerTeam) {
          candidates = draftService.getDraftCandidatesForNextPick(season);
        }
      }

      ok(res, {
        season,
        nextTeamId: state.nextTeamId,
        nextTeamName,
        isPlayerTeam: state.isPlayerTeam,
        currentRound: state.currentRound,
        currentPickNumber: state.currentPickNumber,
        finished: state.finished,
        candidates
      });
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.post('/draft/:season/pick', (req: Request, res: Response) => {
    try {
      const db = dbService.getActiveConnection();
      const season = parseInt(req.params.season, 10);
      const { riderId } = req.body;
      if (!riderId) {
        return fail(res, 400, 'Fahrer-ID fehlt.');
      }

      const draftService = new RiderDraftService(db);
      const state = draftService.getNextPickState(season);
      if (state.finished) {
        return fail(res, 400, 'Der Draft ist bereits beendet.');
      }
      if (!state.isPlayerTeam) {
        return fail(res, 400, 'Nicht der Zug des Spieler-Teams.');
      }

      const pickNumber = state.currentPickNumber;

      // Execute only the player's pick
      draftService.executeSingleDraftPick(season, state.nextTeamId!, state.currentRound, pickNumber, riderId);

      // Check new pick state after the player pick
      const nextState = draftService.getNextPickState(season);

      // If finished, complete the draft & season initialization
      if (nextState.finished) {
        const nextDate = getGss().loadState().currentDate;
        getGss().completeDraftAndInitializeSeason(season, nextDate);
      }

      // Get the details of the pick just made
      const pickDetails = getSinglePickDetails(db, season, pickNumber);

      ok(res, {
        finished: nextState.finished,
        playerTurn: nextState.isPlayerTeam,
        nextPickState: nextState,
        pick: pickDetails
      });
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.post('/draft/:season/simulate-next', (req: Request, res: Response) => {
    try {
      const db = dbService.getActiveConnection();
      const season = parseInt(req.params.season, 10);
      const draftService = new RiderDraftService(db);
      const state = draftService.getNextPickState(season);
      if (state.finished) {
        return fail(res, 400, 'Der Draft ist bereits beendet.');
      }
      if (state.isPlayerTeam) {
        return fail(res, 400, 'Das Spieler-Team ist an der Reihe.');
      }

      const pickNumber = state.currentPickNumber;

      // Execute one AI pick
      draftService.executeSingleDraftPick(season, state.nextTeamId!, state.currentRound, pickNumber);

      // Check new pick state after the AI pick
      const nextState = draftService.getNextPickState(season);

      // If finished, complete the draft & season initialization
      if (nextState.finished) {
        const nextDate = getGss().loadState().currentDate;
        getGss().completeDraftAndInitializeSeason(season, nextDate);
      }

      // Get the details of the pick just made
      const pickDetails = getSinglePickDetails(db, season, pickNumber);

      ok(res, {
        finished: nextState.finished,
        playerTurn: nextState.isPlayerTeam,
        nextPickState: nextState,
        pick: pickDetails
      });
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.post('/draft/:season/quick-complete', (req: Request, res: Response) => {
    try {
      const db = dbService.getActiveConnection();
      const season = parseInt(req.params.season, 10);

      const draftService = new RiderDraftService(db);
      const result = draftService.executeNextPicksUntilPlayer(season, true);

      // Complete the season initialization
      const nextDate = getGss().loadState().currentDate;
      getGss().completeDraftAndInitializeSeason(season, nextDate);

      ok(res, {
        finished: true,
        playerTurn: false
      });
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  
  router.get('/injuries', (_req: Request, res: Response) => {
      try {
        const db = dbService.getActiveConnection();
        
        const stateRow = db.prepare(`SELECT season, "current_date" AS current_date FROM game_state WHERE id = 1`).get() as { season: number, current_date: string } | undefined;
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
      `).all() as any[];

      if (rows.length > 0) {
        const riderIds = rows.map((r: any) => r.riderId);
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
        `).all(season, currentDate, ...riderIds) as any[];

        for (const row of rows) {
          if (!row.fitDate) continue;
          row.missedRaces = missedRacesRows
            .filter((m: any) => m.rider_id === row.riderId && m.startDate <= row.fitDate)
            .map((m: any) => ({
              name: m.name,
              startDate: m.startDate,
              isStageRace: m.isStageRace === 1,
              categoryName: m.categoryName,
              countryCode: m.countryCode,
            }));
        }
      }

      ok<InjuryRow[]>(res, rows);
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.post('/debug/sql-raw', (req: Request, res: Response) => {
    try {
      const { filename, sql } = req.body;
      const Database = require('better-sqlite3');
      const path = require('path');
      const os = require('os');
      const fs = require('fs');

      // Try to resolve the savegames directory within the repository workspace
      let savegamesDir = path.join(os.homedir(), '.velo', 'savegames');
      let current = __dirname;
      while (true) {
        if (fs.existsSync(path.join(current, 'backend')) && fs.existsSync(path.join(current, 'frontend'))) {
          const repoSaveDir = path.join(current, 'savegames');
          if (fs.existsSync(repoSaveDir)) {
            savegamesDir = repoSaveDir;
          }
          break;
        }
        const parent = path.dirname(current);
        if (parent === current) {
          break;
        }
        current = parent;
      }

      const savePath = path.join(savegamesDir, filename);
      const db = new Database(savePath);
      let result;
      try {
        result = db.prepare(sql).all();
      } finally {
        db.close();
      }
      ok(res, result);
    } catch (e) {
      fail(res, 400, (e as Error).message);
    }
  });

  return router;
}

function ensureWeatherRolled(db: any, stageId: number): void {
  const row = db.prepare('SELECT rolled_weather_id, allowed_weather FROM stages WHERE id = ?').get(stageId) as { rolled_weather_id: number | null, allowed_weather: string } | undefined;
  if (!row) {
    return;
  }
  if (row.rolled_weather_id != null) {
    return;
  }

  const allowed = row.allowed_weather.split('|').map((id: string) => parseInt(id.trim(), 10)).filter(Number.isFinite);
  if (allowed.length === 0) {
    allowed.push(1);
  }

  const randomIndex = Math.floor(Math.random() * allowed.length);
  const rolledId = allowed[randomIndex];

  db.prepare('UPDATE stages SET rolled_weather_id = ? WHERE id = ?').run(rolledId, stageId);
}
