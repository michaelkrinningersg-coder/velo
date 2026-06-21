import {
  $,
  state,
  raceSimView,
  activateView,
  showScreen,
  hideModal,
  showLoading,
  hideLoading,
} from './state';
import {
  loadSavesList,
  initSavegameListeners,
} from './views/savegame';
import {
  loadGameState,
  loadRaces,
  renderDashboard,
  initDashboardListeners,
} from './views/dashboard';
import {
  refreshTeamsViewData,
  initTeamsListeners,
} from './views/teams';
import {
  renderRidersMenu,
  initRidersListeners,
} from './views/riders';
import {
  loadRiderTeamEditorData,
  initRiderTeamEditorListeners,
} from './views/riderTeamEditor';
import {
  renderRealtimeRaceView,
  initLiveRaceListeners,
  hideRosterEditor,
  applyRosterEditor,
} from './views/liveRace';
import {
  renderResultsView,
  initResultsListeners,
} from './views/results';
import {
  loadDraftHistory,
  initDraftListeners,
} from './views/draft';
import {
  loadInjuries,
} from './views/injuries';
import {
  loadSeasonStandings,
  initSeasonStandingsListeners,
} from './views/seasonStandings';
import {
  initializeStageEditorForm,
  renderStageEditor,
  loadStageEditorExistingStages,
  loadStageEditorOverview,
  initStageEditorListeners,
} from './views/stageEditor';
import {
  openRiderStats,
  initRiderStatsListeners,
} from './views/riderStats';
import {
  openTeamStats,
  initTeamStatsListeners,
} from './views/teamStats';
import {
  initLeaderboardsView,
  showLeaderboardsView,
} from './views/leaderboards';
import {
  initCalendarView,
  showCalendarView,
} from './views/calendar';
import { RaceSimView } from './race-sim/RaceSimView';
import {
  initRaceProgramsView,
  loadRaceProgramsData,
} from './views/racePrograms';

(window as any).openTeamStats = openTeamStats;

// ============================================================
//  Routing / Screen Navigation Context Bridging
// ============================================================

export async function enterGameScreen(): Promise<void> {
  // Clear any logged keys to ensure logs show on enter
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('programAssignmentsLogged_') || key.startsWith('participantCountsLogged_'))) {
      localStorage.removeItem(key);
    }
  }
  showScreen('game');
  $('meta-career').textContent = state.currentSave?.careerName ?? '';
  state.seasonStandingsSelectedSeason = null;
  state.riderStatsSelectedSeason = null;
  activateView('dashboard');
  showLoading('Spiel wird geladen…');
  try {
    await loadGameState();
    await loadRaces();
    renderDashboard();
  } catch (e) {
    alert('Fehler beim Laden des Spiels: ' + (e as Error).message);
  } finally {
    hideLoading();
  }
}

// Register all modular listen hooks
function initAppListeners(): void {
  // Navigation event dispatching
  document.querySelectorAll<HTMLElement>('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = btn.dataset['view'] ?? '';
      activateView(view as any);
      if (view === 'dashboard') renderDashboard();
      if (view === 'teams') void refreshTeamsViewData();
      if (view === 'riders') void refreshTeamsViewData();
      if (view === 'rider-team-editor') void loadRiderTeamEditorData();
      if (view === 'live-race') renderRealtimeRaceView();
      if (view === 'results') renderResultsView();
      if (view === 'draft') void loadDraftHistory(state.draftSelectedSeason || state.currentSave?.currentSeason || 2026);
      if (view === 'injuries') void loadInjuries();
      if (view === 'season-standings') void loadSeasonStandings(true);
      if (view === 'leaderboards') void showLeaderboardsView();
      if (view === 'calendar') showCalendarView();
      if (view === 'race-programs') void loadRaceProgramsData();
      if (view === 'stage-editor-stages' || view === 'stage-editor-climbs') void loadStageEditorOverview();
    });
  });

  // Global shared body rider link click listener
  document.body.addEventListener('click', (event) => {
    const riderButton = (event.target as Element).closest<HTMLButtonElement>('button.app-rider-link[data-rider-id]');
    if (!riderButton) {
      return;
    }

    const riderId = Number(riderButton.dataset['riderId']);
    if (!Number.isFinite(riderId)) {
      return;
    }

    openRiderStats(riderId);
  });

  // Global shared body team link click listener
  document.body.addEventListener('click', (event) => {
    const teamButton = (event.target as Element).closest<HTMLButtonElement>('button.app-team-link[data-team-id]');
    if (!teamButton) {
      return;
    }

    const teamId = Number(teamButton.dataset['teamId']);
    if (!Number.isFinite(teamId)) {
      return;
    }

    openTeamStats(teamId);
  });

  // Global modals closes events registration
  $('btn-cancel-new').addEventListener('click', () => hideModal('newCareer'));
  $('btn-close-race-stages').addEventListener('click', () => hideModal('raceStages'));
  $('btn-close-stage-profile').addEventListener('click', () => hideModal('stageProfile'));
  $('btn-close-rider-program').addEventListener('click', () => hideModal('riderProgram'));
  $('btn-close-rider-stats').addEventListener('click', () => hideModal('riderStats'));
  $('btn-close-team-stats').addEventListener('click', () => hideModal('teamStats'));
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
  initCalendarView();
  initTeamsListeners();
  initRidersListeners();
  initRiderTeamEditorListeners();
  initLiveRaceListeners();
  initResultsListeners();
  initStageEditorListeners();
  initRiderStatsListeners();
  initTeamStatsListeners();
  initSeasonStandingsListeners();
  initLeaderboardsView();
  initRaceProgramsView();
  initDraftListeners();
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
