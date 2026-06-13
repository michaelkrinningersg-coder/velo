async function call(method, url, body) {
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
        return res.json();
    }
    catch (err) {
        return { success: false, error: `Netzwerkfehler: ${err.message}` };
    }
}
export const api = {
    listSaves: () => call('GET', '/api/saves'),
    createSave: (filename, careerName, teamId) => call('POST', '/api/saves', { filename, careerName, teamId }),
    loadSave: (filename) => call('POST', `/api/saves/${encodeURIComponent(filename)}/load`),
    deleteSave: (filename) => call('DELETE', `/api/saves/${encodeURIComponent(filename)}`),
    getAvailableTeams: () => call('GET', '/api/teams/available'),
    getTeams: () => call('GET', '/api/teams'),
    getTeam: (teamId) => call('GET', `/api/teams/${teamId}`),
    getRiders: (teamId) => call('GET', `/api/riders${teamId != null ? `?teamId=${teamId}` : ''}`),
    getRiderStats: (riderId) => call('GET', `/api/riders/${riderId}/stats`),
    getRiderProgramRaces: (riderId) => call('GET', `/api/riders/${riderId}/program-races`),
    getRiderTeamEditor: () => call('GET', '/api/rider-team-editor'),
    saveRiderTeamEditor: (payload) => call('POST', '/api/rider-team-editor', payload),
    exportRiderTeamEditor: (payload) => call('POST', '/api/rider-team-editor/export', payload),
    getRaces: () => call('GET', '/api/races'),
    getRaceProgramParticipants: (raceId) => call('GET', `/api/races/${raceId}/program-participants`),
    getRaceResultsRoster: (raceId) => call('GET', `/api/races/${raceId}/results-roster`),
    getGameState: () => call('GET', '/api/state'),
    getGameStatus: () => call('GET', '/api/game/status'),
    getStageSummary: (stageId) => call('GET', `/api/stages/${stageId}/summary`),
    getRealtimeSimulation: (stageId) => call('GET', `/api/simulation/realtime/${stageId}`),
    getRosterEditor: (stageId) => call('GET', `/api/simulation/roster/${stageId}`),
    applyRosterEditor: (stageId, payload) => call('POST', `/api/simulation/roster/${stageId}/apply`, payload),
    completeRealtimeSimulation: (stageId, payload) => call('POST', `/api/simulation/realtime/${stageId}/complete`, payload),
    advanceDay: () => call('POST', '/api/state/advance'),
    getStageResults: (stageId) => call('GET', `/api/results/${stageId}`),
    getSeasonStandings: () => call('GET', '/api/season-standings'),
    listStageEditorStages: () => call('GET', '/api/stage-editor/stages'),
    getStageEditorOverview: () => call('GET', '/api/stage-editor/overview'),
    loadStageEditorStage: (stageId) => call('GET', `/api/stage-editor/stages/${stageId}`),
    importStageRoute: (payload) => call('POST', '/api/stage-editor/import', payload),
    exportStageRoute: (payload) => call('POST', '/api/stage-editor/export', payload),
    getInjuries: () => call('GET', '/api/injuries'),
    getDraftHistory: (season) => call('GET', `/api/draft/${season}`),
};
