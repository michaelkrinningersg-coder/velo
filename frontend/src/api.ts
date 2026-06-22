import type {
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
  RiderStatsPayload,
  RiderProgramRaceSummary,
  RiderTeamEditorExportPayload,
  RiderTeamEditorPayload,
  RiderTeamEditorSaveRequest,
  RealtimeStageCommitRequest,
  RealtimeSimulationBootstrap,
  StageEditorDraft,
  StageEditorExistingStageListResponse,
  StageEditorExistingStageLoadResponse,
  StageEditorExportPayload,
  StageEditorExportRequest,
  StageEditorImportRequest,
  StageEditorOverviewResponse,
  SeasonStandingsPayload,
  StageResultsPayload,
  DraftHistoryPayload,
  DraftHistoryRow,
  InjuryRow,
  RaceRosterPayload,
  TeamStatsPayload,
} from '../../shared/types';

async function call<T>(method: string, url: string, body?: unknown): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().includes('application/json')) {
      const text = await res.text();
      return {
        success: false,
        error: res.ok
          ? 'Antwort war kein JSON.'
          : `HTTP ${res.status}: ${text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || 'Unerwartete Antwort vom Server.'}`,
      };
    }
    return res.json() as Promise<ApiResponse<T>>;
  } catch (err) {
    return { success: false, error: `Netzwerkfehler: ${(err as Error).message}` };
  }
}

export const api = {
  listSaves:           () => call<SavegameMeta[]>('GET', '/api/saves'),
  createSave:          (filename: string, careerName: string, teamId: number) =>
    call<void>('POST', '/api/saves', { filename, careerName, teamId }),
  loadSave:            (filename: string) => call<SavegameMeta>('POST', `/api/saves/${encodeURIComponent(filename)}/load`),
  deleteSave:          (filename: string) => call<void>('DELETE', `/api/saves/${encodeURIComponent(filename)}`),
  getAvailableTeams:   () => call<Team[]>('GET', '/api/teams/available'),
  getTeams:            () => call<Team[]>('GET', '/api/teams'),
  getTeam:             (teamId: number) => call<Team & { riders: Rider[] }>('GET', `/api/teams/${teamId}`),
  getTeamStats:        (teamId: number) => call<TeamStatsPayload>('GET', `/api/teams/${teamId}/stats`),
  getRiders:           (teamId?: number, onlyWithTeam = false, summary = true, season?: number) => {
    const params = new URLSearchParams();
    if (teamId != null) params.set('teamId', String(teamId));
    if (onlyWithTeam) params.set('onlyWithTeam', 'true');
    if (season != null) params.set('season', String(season));
    if (summary) params.set('summary', 'true');
    const qs = params.toString();
    return call<Rider[]>('GET', `/api/riders${qs ? `?${qs}` : ''}`);
  },
  getRiderStats:       (riderId: number, excludeFatigue = false) => call<RiderStatsPayload>('GET', `/api/riders/${riderId}/stats${excludeFatigue ? '?excludeFatigue=true' : ''}`),
  getRiderProgramRaces: (riderId: number) => call<RiderProgramRaceSummary>('GET', `/api/riders/${riderId}/program-races`),
  getRiderTeamEditor:  () => call<RiderTeamEditorPayload>('GET', '/api/rider-team-editor'),
  saveRiderTeamEditor: (payload: RiderTeamEditorSaveRequest) => call<RiderTeamEditorPayload>('POST', '/api/rider-team-editor', payload),
  exportRiderTeamEditor: (payload: RiderTeamEditorSaveRequest) => call<RiderTeamEditorExportPayload>('POST', '/api/rider-team-editor/export', payload),
  getRaces:            () => call<Race[]>('GET', '/api/races'),
  getRaceProgramParticipants: (raceId: number) => call<RaceProgramParticipant[]>('GET', `/api/races/${raceId}/program-participants`),
  getRaceResultsRoster:       (raceId: number) => call<RaceRosterPayload>('GET', `/api/races/${raceId}/results-roster`),
  getGameState:        () => call<GameState>('GET', '/api/state'),
  getGameStatus:       () => call<GameStatus>('GET', '/api/game/status'),
  getStageSummary:     (stageId: number) => call<ParsedStageSummary>('GET', `/api/stages/${stageId}/summary`),
  getRealtimeSimulation: (stageId: number) => call<RealtimeSimulationBootstrap>('GET', `/api/simulation/realtime/${stageId}`),
  getRosterEditor:     (stageId: number) => call<RaceRosterEditorPayload>('GET', `/api/simulation/roster/${stageId}`),
  applyRosterEditor:   (stageId: number, payload: RaceRosterSelectionRequest) => call<RealtimeSimulationBootstrap>('POST', `/api/simulation/roster/${stageId}/apply`, payload),
  completeRealtimeSimulation: (stageId: number, payload: RealtimeStageCommitRequest) => call<StageResultCommitResponse>('POST', `/api/simulation/realtime/${stageId}/complete`, payload),
  advanceDay:          () => call<GameState>('POST', '/api/state/advance'),
  getStageResults:     (stageId: number) => call<StageResultsPayload>('GET', `/api/results/${stageId}`),
  getSeasonStandings:  (season?: number) => call<SeasonStandingsPayload>('GET', `/api/season-standings${season ? `?season=${season}` : ''}`),
  listStageEditorStages: () => call<StageEditorExistingStageListResponse>('GET', '/api/stage-editor/stages'),
  listStageEditorCountries: () => call<Array<{ id: number; name: string; code3: string }>>('GET', '/api/stage-editor/countries'),
  listStageEditorRaceCategories: () => call<Array<{ id: number; name: string }>>('GET', '/api/stage-editor/race-categories'),
  listStageEditorRacePrograms: () => call<Array<{ id: number; name: string }>>('GET', '/api/stage-editor/race-programs'),
  getStageEditorOverview: () => call<StageEditorOverviewResponse>('GET', '/api/stage-editor/overview'),
  loadStageEditorStage:  (stageId: number) => call<StageEditorExistingStageLoadResponse>('GET', `/api/stage-editor/stages/${stageId}`),
  importStageRoute:    (payload: StageEditorImportRequest) => call<StageEditorDraft>('POST', '/api/stage-editor/import', payload),
  exportStageRoute:    (payload: StageEditorExportRequest) => call<StageEditorExportPayload>('POST', '/api/stage-editor/export', payload),
  getInjuries:         () => call<InjuryRow[]>('GET', '/api/injuries'),
  getDraftHistory:     (season: number) => call<DraftHistoryPayload>('GET', `/api/draft/${season}`),
  getDraftDetails:     (season: number) => call<any>('GET', `/api/draft/${season}/details`),
  getLeaderboards:     (scope: 'riders' | 'teams', metricKey: string, period: 'season' | 'alltime' | 'live') =>
    call<any[]>('GET', `/api/leaderboards?scope=${scope}&metricKey=${encodeURIComponent(metricKey)}&period=${period}`),
  getRaceProgramsEditor: () => call<any>('GET', '/api/race-programs-editor'),
  saveRaceProgramsEditor: (payload: any) => call<void>('POST', '/api/race-programs-editor/save', payload),
};
