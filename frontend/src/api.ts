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
  RiderProgramRaceSummary,
  RealtimeStageCommitRequest,
  RealtimeSimulationBootstrap,
  StageEditorDraft,
  StageEditorExistingStageListResponse,
  StageEditorExistingStageLoadResponse,
  StageEditorExportPayload,
  StageEditorExportRequest,
  StageEditorImportRequest,
  SeasonStandingsPayload,
  StageResultsPayload,
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
  getRiders:           (teamId?: number) => call<Rider[]>('GET', `/api/riders${teamId != null ? `?teamId=${teamId}` : ''}`),
  getRiderProgramRaces: (riderId: number) => call<RiderProgramRaceSummary>('GET', `/api/riders/${riderId}/program-races`),
  getRaces:            () => call<Race[]>('GET', '/api/races'),
  getRaceProgramParticipants: (raceId: number) => call<RaceProgramParticipant[]>('GET', `/api/races/${raceId}/program-participants`),
  getGameState:        () => call<GameState>('GET', '/api/state'),
  getGameStatus:       () => call<GameStatus>('GET', '/api/game/status'),
  getStageSummary:     (stageId: number) => call<ParsedStageSummary>('GET', `/api/stages/${stageId}/summary`),
  getRealtimeSimulation: (stageId: number) => call<RealtimeSimulationBootstrap>('GET', `/api/simulation/realtime/${stageId}`),
  getRosterEditor:     (stageId: number) => call<RaceRosterEditorPayload>('GET', `/api/simulation/roster/${stageId}`),
  applyRosterEditor:   (stageId: number, payload: RaceRosterSelectionRequest) => call<RealtimeSimulationBootstrap>('POST', `/api/simulation/roster/${stageId}/apply`, payload),
  completeRealtimeSimulation: (stageId: number, payload: RealtimeStageCommitRequest) => call<StageResultCommitResponse>('POST', `/api/simulation/realtime/${stageId}/complete`, payload),
  advanceDay:          () => call<GameState>('POST', '/api/state/advance'),
  getStageResults:     (stageId: number) => call<StageResultsPayload>('GET', `/api/results/${stageId}`),
  getSeasonStandings:  () => call<SeasonStandingsPayload>('GET', '/api/season-standings'),
  listStageEditorStages: () => call<StageEditorExistingStageListResponse>('GET', '/api/stage-editor/stages'),
  loadStageEditorStage:  (stageId: number) => call<StageEditorExistingStageLoadResponse>('GET', `/api/stage-editor/stages/${stageId}`),
  importStageRoute:    (payload: StageEditorImportRequest) => call<StageEditorDraft>('POST', '/api/stage-editor/import', payload),
  exportStageRoute:    (payload: StageEditorExportRequest) => call<StageEditorExportPayload>('POST', '/api/stage-editor/export', payload),
};
