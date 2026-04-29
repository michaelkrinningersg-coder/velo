import type {
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
} from '../../shared/types';

async function call<T>(method: string, url: string, body?: unknown): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
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
  getRaces:            () => call<Race[]>('GET', '/api/races'),
  getGameState:        () => call<GameState>('GET', '/api/state'),
  advanceDay:          () => call<GameState>('POST', '/api/state/advance'),
  importStageRoute:    (payload: StageEditorImportRequest) => call<StageEditorDraft>('POST', '/api/stage-editor/import', payload),
  exportStageRoute:    (payload: StageEditorExportRequest) => call<StageEditorExportPayload>('POST', '/api/stage-editor/export', payload),
};
