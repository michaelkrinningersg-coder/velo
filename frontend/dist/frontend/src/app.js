import { $, state, raceSimView, activateView, showScreen, hideModal, showLoading, hideLoading, } from './state';
import { loadSavesList, initSavegameListeners, } from './views/savegame';
import { loadGameState, loadRaces, renderDashboard, initDashboardListeners, } from './views/dashboard';
import { refreshTeamsViewData, initTeamsListeners, } from './views/teams';
import { initRidersListeners, } from './views/riders';
import { loadRiderTeamEditorData, initRiderTeamEditorListeners, } from './views/riderTeamEditor';
import { renderRealtimeRaceView, initLiveRaceListeners, hideRosterEditor, applyRosterEditor, } from './views/liveRace';
import { renderResultsView, initResultsListeners, } from './views/results';
import { loadDraftHistory, } from './views/draft';
import { loadInjuries, } from './views/injuries';
import { loadSeasonStandings, initSeasonStandingsListeners, } from './views/seasonStandings';
import { initializeStageEditorForm, renderStageEditor, loadStageEditorOverview, initStageEditorListeners, } from './views/stageEditor';
import { openRiderStats, initRiderStatsListeners, } from './views/riderStats';
// ============================================================
//  Routing / Screen Navigation Context Bridging
// ============================================================
export async function enterGameScreen() {
    // Clear any logged keys to ensure logs show on enter
    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('programAssignmentsLogged_') || key.startsWith('participantCountsLogged_'))) {
            localStorage.removeItem(key);
        }
    }
    showScreen('game');
    $('meta-career').textContent = state.currentSave?.careerName ?? '';
    activateView('dashboard');
    showLoading('Spiel wird geladen…');
    try {
        await loadGameState();
        await loadRaces();
        renderDashboard();
    }
    catch (e) {
        alert('Fehler beim Laden des Spiels: ' + e.message);
    }
    finally {
        hideLoading();
    }
}
// Register all modular listen hooks
function initAppListeners() {
    // Navigation event dispatching
    document.querySelectorAll('.nav-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const view = btn.dataset['view'] ?? '';
            activateView(view);
            if (view === 'dashboard')
                renderDashboard();
            if (view === 'teams')
                void refreshTeamsViewData();
            if (view === 'riders')
                void refreshTeamsViewData();
            if (view === 'rider-team-editor')
                void loadRiderTeamEditorData();
            if (view === 'live-race')
                renderRealtimeRaceView();
            if (view === 'results')
                renderResultsView();
            if (view === 'draft')
                void loadDraftHistory(state.draftSelectedSeason || state.currentSave?.currentSeason || 2026);
            if (view === 'injuries')
                void loadInjuries();
            if (view === 'season-standings')
                void loadSeasonStandings(true);
            if (view === 'stage-editor-stages' || view === 'stage-editor-climbs')
                void loadStageEditorOverview();
        });
    });
    // Global shared body rider link click listener
    document.body.addEventListener('click', (event) => {
        const riderButton = event.target.closest('button.app-rider-link[data-rider-id]');
        if (!riderButton) {
            return;
        }
        const riderId = Number(riderButton.dataset['riderId']);
        if (!Number.isFinite(riderId)) {
            return;
        }
        openRiderStats(riderId);
    });
    // Global modals closes events registration
    $('btn-cancel-new').addEventListener('click', () => hideModal('newCareer'));
    $('btn-close-race-stages').addEventListener('click', () => hideModal('raceStages'));
    $('btn-close-stage-profile').addEventListener('click', () => hideModal('stageProfile'));
    $('btn-close-rider-program').addEventListener('click', () => hideModal('riderProgram'));
    $('btn-close-rider-stats').addEventListener('click', () => hideModal('riderStats'));
    $('btn-close-race-participants').addEventListener('click', () => hideModal('raceParticipants'));
    $('btn-close-roster-editor').addEventListener('click', () => hideRosterEditor());
    $('btn-cancel-roster-editor').addEventListener('click', () => hideRosterEditor());
    $('btn-apply-roster-editor').addEventListener('click', () => {
        void applyRosterEditor();
    });
    $('btn-back-menu').addEventListener('click', () => {
        raceSimView?.pause();
        showScreen('menu');
        loadSavesList();
    });
    // Views specfics event registration initialization
    initSavegameListeners();
    initDashboardListeners();
    initTeamsListeners();
    initRidersListeners();
    initRiderTeamEditorListeners();
    initLiveRaceListeners();
    initResultsListeners();
    initStageEditorListeners();
    initRiderStatsListeners();
    initSeasonStandingsListeners();
}
// ============================================================
//  Initialization / Bootstrap Entrypoint
// ============================================================
(async () => {
    initializeStageEditorForm();
    renderStageEditor();
    initAppListeners();
    showScreen('menu');
    await loadSavesList();
})();
