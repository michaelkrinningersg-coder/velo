import { Router, Request, Response } from 'express';
import { DatabaseService } from '../db/DatabaseService';
import { RiderTeamEditorService } from '../editor/RiderTeamEditorService';
import { GameRepository } from '../db/GameRepository';
import { GameStateService } from '../game/GameStateService';
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
} from '../../../shared/types';

function ok<T>(res: Response, data: T): void {
  const body: ApiResponse<T> = { success: true, data };
  res.json(body);
}

function fail(res: Response, status: number, message: string): void {
  const body: ApiResponse<never> = { success: false, error: message };
  res.status(status).json(body);
}

function resolveRealtimeTeamStartOrder(repo: GameRepository, race: Race, stageNumber: number, riders: Rider[]): number[] {
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
      .filter((row) => row.teamId != null && participatingTeamIds.has(row.teamId))
      .map((row) => [row.teamId as number, row.points] as const),
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
      return leftPoints - rightPoints || left.name.localeCompare(right.name, 'de');
    })
    .map((team) => team.id);
}

export function createRouter(dbService: DatabaseService): Router {
  const router = Router();
  const routeImporter = new RouteImporter();
  const riderTeamEditorService = new RiderTeamEditorService();

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

  // Gibt alle wÃ¤hlbaren (nicht-U23) Teams aus der Master-DB zurÃ¼ck
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
    if (!Number.isFinite(id)) return fail(res, 400, 'UngÃ¼ltige Team-ID.');
    try {
      const db   = dbService.getActiveConnection();
      getGss().ensureState();
      const repo = new GameRepository(db);
      const team = repo.getTeamById(id);
      if (!team) return fail(res, 404, `Team ${id} nicht gefunden.`);
      ok<Team & { riders: Rider[] }>(res, { ...team, riders: repo.getRiders(id, true) });
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  // ---- Riders -------------------------------------------

  router.get('/riders', (req: Request, res: Response) => {
    const teamId = req.query['teamId'] ? Number(req.query['teamId']) : undefined;
    try {
      const db = dbService.getActiveConnection();
      getGss().ensureState();
      ok<Rider[]>(res, new GameRepository(db).getRiders(teamId));
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/riders/:id/program-races', (req: Request, res: Response) => {
    const riderId = Number(req.params['id']);
    if (!Number.isFinite(riderId)) return fail(res, 400, 'UngÃ¼ltige Fahrer-ID.');
    try {
      const db = dbService.getActiveConnection();
      getGss().ensureState();
      const payload = new GameRepository(db).getRiderProgramRaceSummary(riderId);
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
      const payload = new GameRepository(db).getRiderStats(riderId);
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
        return fail(res, 400, 'FÃ¼r diese Etappe konnte keine Startliste bestimmt werden.');
      }

      ok<RealtimeSimulationBootstrap>(res, {
        race,
        stage,
        riders,
        teams: repo.getTeams().filter((team) => riders.some((rider) => rider.activeTeamId === team.id)),
        stageSummary: StageParser.summarizeStageProfile(stage.detailsCsvFile, stage.startElevation),
        gcStandings: repo.getPreviousGcStandings(stage.raceId, stage.stageNumber),
        pointsStandings: repo.getPreviousPointsStandings(stage.raceId, stage.stageNumber),
        mountainStandings: repo.getPreviousMountainStandings(stage.raceId, stage.stageNumber),
        youthStandings: repo.getPreviousYouthStandings(stage.raceId, stage.stageNumber),
        classificationLeaders: repo.getPreviousClassificationLeaders(stage.raceId, stage.stageNumber),
        teamStartOrder: resolveRealtimeTeamStartOrder(repo, race, stage.stageNumber, riders),
        skillWeightRules: repo.getSkillWeightRules(),
        stageScoringRules: repo.getStageScoringRules(),
      });
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/stages/:stageId/summary', (req: Request, res: Response) => {
    const stageId = Number(req.params['stageId']);
    if (!Number.isFinite(stageId)) return fail(res, 400, 'UngÃ¼ltige Stage-ID.');

    try {
      const db = dbService.getActiveConnection();
      const repo = new GameRepository(db);
      const stage = repo.getStageById(stageId);
      if (!stage) {
        return fail(res, 404, `Stage ${stageId} nicht gefunden.`);
      }

      ok<ParsedStageSummary>(res, StageParser.summarizeStageProfile(stage.detailsCsvFile, stage.startElevation));
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/simulation/roster/:stageId', (req: Request, res: Response) => {
    const stageId = Number(req.params['stageId']);
    if (!Number.isFinite(stageId)) return fail(res, 400, 'UngÃ¼ltige Stage-ID.');

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

      ok<RealtimeSimulationBootstrap>(res, {
        race,
        stage,
        riders,
        teams: repo.getTeams().filter((team) => riders.some((rider) => rider.activeTeamId === team.id)),
        stageSummary: StageParser.summarizeStageProfile(stage.detailsCsvFile, stage.startElevation),
        gcStandings: repo.getPreviousGcStandings(stage.raceId, stage.stageNumber),
        pointsStandings: repo.getPreviousPointsStandings(stage.raceId, stage.stageNumber),
        mountainStandings: repo.getPreviousMountainStandings(stage.raceId, stage.stageNumber),
        youthStandings: repo.getPreviousYouthStandings(stage.raceId, stage.stageNumber),
        classificationLeaders: repo.getPreviousClassificationLeaders(stage.raceId, stage.stageNumber),
        teamStartOrder: resolveRealtimeTeamStartOrder(repo, race, stage.stageNumber, riders),
        skillWeightRules: repo.getSkillWeightRules(),
        stageScoringRules: repo.getStageScoringRules(),
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
      ok<StageResultCommitResponse>(res, new StageResultCommitService(db).commitRealtimeStage(stageId, payload.entries, payload.markerClassifications ?? [], payload.incidents ?? []));
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/results/:stageId', (req: Request, res: Response) => {
    const stageId = Number(req.params['stageId']);
    if (!Number.isFinite(stageId)) return fail(res, 400, 'UngÃ¼ltige Stage-ID.');

    try {
      const db = dbService.getActiveConnection();
      const payload = new GameRepository(db).getStageResults(stageId);
      if (!payload) return fail(res, 404, `Keine Ergebnisse fÃ¼r Stage ${stageId} gefunden.`);
      ok<StageResultsPayload>(res, payload);
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.get('/season-standings', (_req: Request, res: Response) => {
    try {
      const db = dbService.getActiveConnection();
      ok<SeasonStandingsPayload>(res, new GameRepository(db).getSeasonStandings());
    } catch (e) { fail(res, 400, (e as Error).message); }
  });

  router.post('/state/advance', (_req: Request, res: Response) => {
    try { ok<GameState>(res, getGss().advanceDay()); }
    catch (e) { fail(res, 400, (e as Error).message); }
  });

  
  router.get('/draft/:season', (req: Request, res: Response) => {
    const season = parseInt(req.params.season, 10);
    const repo = new GameRepository(db);

    const rows = db.prepare(
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
        
        c.code AS countryCode,
        c.flag_svg AS countryFlag,
        
        t.id AS teamId,
        t.name AS teamName,
        t.jersey_svg AS teamJersey,
        
        ot.id AS oldTeamId,
        ot.name AS oldTeamName,
        ot.jersey_svg AS oldTeamJersey
        
      FROM draft_history d
      JOIN riders r ON d.rider_id = r.id
      JOIN sta_country c ON r.country_id = c.id
      JOIN teams t ON d.team_id = t.id
      LEFT JOIN teams ot ON d.old_team_id = ot.id
      WHERE d.season = ?
      ORDER BY d.pick_number ASC
    ).all(season) as any[];

    ok<DraftHistoryPayload>(res, {
      season,
      rows
    });
  });

  
  router.get('/injuries', (_req: Request, res: Response) => {
    const rows = db.prepare(
      SELECT
        r.id AS riderId,
        r.first_name AS riderFirstName,
        r.last_name AS riderLastName,
        c.code AS countryCode,
        c.flag_svg AS countryFlag,
        t.abbreviation AS teamAbbreviation,
        t.jersey_svg AS teamJersey,
        rds.health_status AS healthStatus,
        rds.unavailable_days_remaining AS unavailableDays
      FROM rider_daily_state rds
      JOIN riders r ON rds.rider_id = r.id
      JOIN sta_country c ON r.country_id = c.id
      LEFT JOIN contracts cnt ON r.id = cnt.rider_id AND cnt.status = 'active'
      LEFT JOIN teams t ON cnt.team_id = t.id
      WHERE rds.health_status IN ('ill', 'injured')
      ORDER BY rds.unavailable_days_remaining DESC
    ).all() as any[];

    ok<InjuryRow[]>(res, rows);
  });

  return router;
}
