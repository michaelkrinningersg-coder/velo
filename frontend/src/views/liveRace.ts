import { api } from '../api';
import {
  $,
  esc,
  state,
  formatDate,
  isActiveView,
  showModal,
  hideModal,
  showLoading,
  hideLoading,
  showError,
  hideError,
  showInstantProgress,
  updateInstantProgress,
  renderFlag,
  raceSimView,
  setRaceSimView,
  setRealtimeCompletionInFlight,
  realtimeCompletionInFlight,
  setInstantStageInFlightId,
  instantStageInFlightId,
  setRealtimeStageLoadInFlightId,
  realtimeStageLoadInFlightId,
  activateView,
} from '../state';
import type {
  RealtimeSimulationBootstrap,
  PendingStage,
  RealtimeStageCommitEntry,
  StageMarkerClassification,
  PrecalculatedRaceIncident,
  StageProfile,
  RaceSimMessage,
  RealtimeLeadoutContribution,
} from '../../../shared/types';
import { runInstantSimulation } from '../race-sim/runInstantSimulation';
import { SimulationSnapshot } from '../race-sim/SimulationEngine';
import { RaceSimView } from '../race-sim/RaceSimView';

// Dynamically or directly imported view updates
import { loadGameState, loadRaces, loadRiders } from './dashboard';
import { loadStageResults } from './results';
import { refreshTeamsViewData } from './teams';

export function formatPendingStageLabel(raceName: string, stageNumber: number, profile: StageProfile): string {
  return `${raceName} · Etappe ${stageNumber} · ${profile}`;
}

export function buildRealtimeCommitEntries(
  snapshot: SimulationSnapshot,
  bootstrap: RealtimeSimulationBootstrap,
): RealtimeStageCommitEntry[] {
  // Der Commit erwartet GENAU einen Zielstatus je Starter (= bootstrap.riders,
  // dieselbe Quelle wie die Startliste beim Speichern). Daher ueber die
  // Startliste iterieren statt einzelne Sim-Ergebnisse zu verwerfen: Ein
  // Starter ohne gueltige Zielzeit, der nicht als DNF markiert ist (Sim-Randfall
  // bei viel Attrition/OTL auf spaeten GT-Etappen), wird als DNF gewertet — so
  // bleibt die Anzahl der uebergebenen Ergebnisse konsistent.
  const isTimeTrial = bootstrap.stage.profile === 'ITT' || bootstrap.stage.profile === 'TTT';
  const snapshotByRiderId = new Map(snapshot.riders.map((rider) => [rider.riderId, rider]));
  return bootstrap.riders.map((starter) => {
    const rider = snapshotByRiderId.get(starter.id);
    const finishTime = rider ? (isTimeTrial ? rider.riderClockSeconds : rider.finishTimeSeconds) : null;
    let finishStatus = rider?.finishStatus ?? 'finished';
    if (finishStatus !== 'dnf' && finishTime == null) {
      finishStatus = 'dnf';
    }
    return {
      riderId: starter.id,
      finishTimeSeconds: finishStatus === 'dnf' ? null : finishTime,
      finishStatus,
      isBreakaway: rider?.isBreakaway,
      statusReason: rider?.statusReason ?? null,
      photoFinishScore: rider?.photoFinishScore,
      leadoutRiderId: rider?.leadoutRiderId,
      leadoutBonus: rider?.leadoutBonus,
    } satisfies RealtimeStageCommitEntry;
  });
}

export function buildRealtimeLeadoutContributions(
  snapshot: SimulationSnapshot,
  bootstrap: RealtimeSimulationBootstrap,
): RealtimeLeadoutContribution[] {
  const contributions: RealtimeLeadoutContribution[] = [];
  for (const r of snapshot.riders) {
    if (r.leadoutBonus != null && r.leadoutBonus > 0 && r.leadoutContributions && r.leadoutContributions.length > 0) {
      const riderObj = bootstrap.riders.find(x => x.id === r.riderId);
      const teamId = riderObj?.activeTeamId ?? null;
      if (teamId != null) {
        contributions.push({
          teamId,
          sprinterId: r.riderId,
          leadoutBonus: r.leadoutBonus,
          contributorsJson: JSON.stringify(r.leadoutContributions),
        });
      }
    }
  }
  return contributions;
}

export async function openInstantStage(stageId: number, skipViewActivation = false): Promise<boolean> {
  if (instantStageInFlightId != null || realtimeCompletionInFlight) {
    return false;
  }

  setInstantStageInFlightId(stageId);
  showInstantProgress(0);
  try {
    const res = await api.getRealtimeSimulation(stageId);
    if (!res.success || !res.data) {
      alert('Instant-Simulation fehlgeschlagen:\n' + (res.error ?? 'Unbekannter Fehler'));
      return false;
    }

    const bootstrap = res.data;
    // Meisterschaft ohne startberechtigte Fahrer wurde serverseitig ergebnislos
    // abgeschlossen (kein Meister) — nicht simulieren, nur Status auffrischen,
    // damit der Spielfortschritt (auch Auto-Weiter) nicht blockiert.
    if (bootstrap.skipped) {
      state.realtimeBootstrap = null;
      await loadGameState();
      await loadRaces();
      return true;
    }
    state.realtimeBootstrap = bootstrap;
    const snapshot = await runInstantSimulation(bootstrap, (progress) => updateInstantProgress(progress));
    const entries = buildRealtimeCommitEntries(snapshot, bootstrap);
    const leadoutContributions = buildRealtimeLeadoutContributions(snapshot, bootstrap);
    await completeRealtimeStage(stageId, entries, snapshot.markerClassifications, snapshot.incidents, snapshot.allEvents, skipViewActivation, leadoutContributions, snapshot.superTeamId);
    return true;
  } catch (error) {
    alert('Unerwarteter Fehler bei der Instant-Simulation: ' + (error as Error).message);
    return false;
  } finally {
    setInstantStageInFlightId(null);
    hideLoading();
  }
}

export function getRosterEditorSelectedCount(teamId: number): number {
  const team = state.rosterEditor?.teams.find((entry) => entry.team.id === teamId);
  if (!team) return 0;
  const selected = new Set(state.rosterEditorSelectedRiderIds);
  return team.riders.filter((riderOption) => selected.has(riderOption.rider.id)).length;
}

export function isRosterEditorSelectionValid(): boolean {
  if (!state.rosterEditor) return false;
  return state.rosterEditor.teams.every((team) => getRosterEditorSelectedCount(team.team.id) === team.riderLimit);
}

export function renderRosterEditor(): void {
  const title = $('roster-editor-title');
  const meta = $('roster-editor-meta');
  const body = $('roster-editor-body');
  const applyButton = $<HTMLButtonElement>('btn-apply-roster-editor');
  const payload = state.rosterEditor;

  if (!payload) {
    title.textContent = 'Starterfeld bearbeiten';
    meta.textContent = '';
    body.innerHTML = '<div class="results-empty">Kein Starterfeld geladen.</div>';
    applyButton.disabled = true;
    return;
  }

  title.textContent = 'Starterfeld bearbeiten';
  meta.textContent = payload.race.isStageRace
    ? `${payload.race.name} · Etappe ${payload.stage.stageNumber} · ${payload.stage.profile}`
    : `${payload.race.name} · ${payload.stage.profile}`;

  const selectedIds = new Set(state.rosterEditorSelectedRiderIds);
  body.innerHTML = payload.teams.map((teamEntry) => {
    const selectedCount = getRosterEditorSelectedCount(teamEntry.team.id);
    const selectionStateClass = selectedCount === teamEntry.riderLimit
      ? 'roster-editor-team-count-ok'
      : 'roster-editor-team-count-bad';

    return `
      <section class="roster-editor-team">
        <div class="roster-editor-team-head">
          <div>
            <h3>${esc(teamEntry.team.name)}</h3>
            <p class="text-muted">${esc(teamEntry.team.abbreviation)} · ${esc(teamEntry.team.division ?? teamEntry.team.divisionName ?? 'Team')}</p>
          </div>
          <div class="roster-editor-team-count ${selectionStateClass}">${selectedCount} / ${teamEntry.riderLimit}</div>
        </div>
        <div class="roster-editor-riders">
          ${teamEntry.riders.map((riderOption) => {
            const isSelected = selectedIds.has(riderOption.rider.id);
            const classes = [
              'roster-editor-rider',
              isSelected ? 'roster-editor-rider-selected' : '',
              riderOption.isLocked ? 'roster-editor-rider-locked' : '',
            ].filter(Boolean).join(' ');
            const flag = riderOption.rider.country ? renderFlag(riderOption.rider.country.code3) : '';
            const subtitle = [riderOption.rider.role?.name ?? 'Ohne Rolle', `OVR ${Math.round(riderOption.rider.overallRating)}`].join(' · ');
            const lockReason = riderOption.lockReason ? `<span class="roster-editor-rider-lock">${esc(riderOption.lockReason)}</span>` : '';
            return `
              <button
                type="button"
                class="${classes}"
                data-roster-team-id="${teamEntry.team.id}"
                data-roster-rider-id="${riderOption.rider.id}"
                ${riderOption.isLocked ? 'disabled' : ''}
              >
                <span class="roster-editor-rider-name">${flag}<span>${esc(riderOption.rider.firstName)} ${esc(riderOption.rider.lastName)}</span></span>
                <span class="roster-editor-rider-meta">${esc(subtitle)}</span>
                ${lockReason}
              </button>`;
          }).join('')}
        </div>
      </section>`;
  }).join('');

  applyButton.disabled = !isRosterEditorSelectionValid();
}

export function hideRosterEditor(): void {
  state.rosterEditor = null;
  state.rosterEditorSelectedRiderIds = [];
  hideError('roster-editor-error');
  hideModal('rosterEditor');
}

export function startRealtimeSimulation(bootstrap: RealtimeSimulationBootstrap, activateLiveView: boolean): void {
  state.selectedRealtimeStageId = bootstrap.stage.id;
  state.realtimeBootstrap = bootstrap;
  state.realtimeError = null;
  if (activateLiveView) {
    activateView('live-race');
  }
  
  // Custom initialization hook
  const viewInstance = loadRaceSimViewInstance();
  viewInstance.load(bootstrap, { autoplay: true, resetSpeed: true });
  renderRealtimeRaceView();
}

function loadRaceSimViewInstance(): RaceSimView {
  let view = raceSimView;
  if (!view) {
    const layout = $('race-sim-layout');
    const emptyState = $('race-sim-empty');
    if (!layout || !emptyState) {
      throw new Error('Simulation HTML elemente fehlen.');
    }
    view = new RaceSimView({
      layout,
      emptyState,
      controlsHeader: $('race-sim-controls-header'),
      profile: $('race-sim-profile'),
      groupBox: $('race-sim-group-box'),
      messages: $('race-sim-messages-body'),
      favorites: $('race-sim-favorites-body'),
      sidebar: $('race-sim-sidebar-body'),
      controls: $('race-sim-controls'),
      meta: $('race-sim-stage-meta'),
    }, {
      onFinishRequested: (snapshot, bootstrap) => {
        const entries = buildRealtimeCommitEntries(snapshot, bootstrap);
        const leadoutContributions = buildRealtimeLeadoutContributions(snapshot, bootstrap);
        void completeRealtimeStage(bootstrap.stage.id, entries, snapshot.markerClassifications, snapshot.incidents, snapshot.allEvents, false, leadoutContributions, snapshot.superTeamId);
      },
    });
    setRaceSimView(view);
  }
  return view;
}

export async function openRosterEditor(stageId: number): Promise<void> {
  showLoading('Starterfeld wird geladen...');
  hideError('roster-editor-error');
  try {
    const res = await api.getRosterEditor(stageId);
    if (!res.success || !res.data) {
      showError('roster-editor-error', res.error ?? 'Starterfeld konnte nicht geladen werden.');
      showModal('rosterEditor');
      renderRosterEditor();
      return;
    }

    state.rosterEditor = res.data;
    state.rosterEditorSelectedRiderIds = res.data.teams
      .flatMap((team) => team.riders.filter((riderOption) => riderOption.isSelected).map((riderOption) => riderOption.rider.id));
    renderRosterEditor();
    showModal('rosterEditor');
  } catch (error) {
    state.rosterEditor = null;
    state.rosterEditorSelectedRiderIds = [];
    showError('roster-editor-error', (error as Error).message);
    showModal('rosterEditor');
    renderRosterEditor();
  } finally {
    hideLoading();
  }
}

export async function applyRosterEditor(): Promise<void> {
  const payload = state.rosterEditor;
  if (!payload) {
    return;
  }
  if (!isRosterEditorSelectionValid()) {
    showError('roster-editor-error', 'Dein Team muss genau die erlaubte Zahl an Fahrern stellen.');
    return;
  }

  hideError('roster-editor-error');
  showLoading('Starterfeld wird übernommen...');
  try {
    const res = await api.applyRosterEditor(payload.stage.id, { riderIds: state.rosterEditorSelectedRiderIds });
    if (!res.success || !res.data) {
      showError('roster-editor-error', res.error ?? 'Starterfeld konnte nicht übernommen werden.');
      return;
    }

    hideRosterEditor();
    startRealtimeSimulation(res.data, true);
  } catch (error) {
    showError('roster-editor-error', (error as Error).message);
  } finally {
    hideLoading();
  }
}

export function renderRealtimeRaceView(): void {
  const select = $<HTMLSelectElement>('race-sim-stage-select');
  const pendingStages = state.gameStatus?.pendingStages ?? [];
  const selectedStillAvailable = pendingStages.some((stage) => stage.stageId === state.selectedRealtimeStageId);

  if (!selectedStillAvailable) {
    state.selectedRealtimeStageId = pendingStages[0]?.stageId ?? null;
    if (state.realtimeBootstrap && state.realtimeBootstrap.stage.id !== state.selectedRealtimeStageId) {
      state.realtimeBootstrap = null;
    }
  }

  select.innerHTML = pendingStages.length === 0
    ? '<option value="">– Keine offenen Etappen –</option>'
    : pendingStages.map((stage) => `
      <option value="${stage.stageId}"${stage.stageId === state.selectedRealtimeStageId ? ' selected' : ''}>${esc(formatPendingStageLabel(stage.raceName, stage.stageNumber, stage.profile))}</option>
    `).join('');
  select.disabled = pendingStages.length === 0;

  const selectedStage = pendingStages.find((stage) => stage.stageId === state.selectedRealtimeStageId) ?? null;
  const simView = loadRaceSimViewInstance();

  if (!selectedStage) {
    state.realtimeBootstrap = null;
    state.realtimeError = null;
    simView.clear('Heute gibt es keine offenen Etappen für die Live-Simulation.');
    return;
  }

  if (!state.realtimeBootstrap || state.realtimeBootstrap.stage.id !== selectedStage.stageId) {
    if (state.realtimeError) {
      simView.clear(state.realtimeError);
    } else {
      simView.hide();
    }
  }
}

export async function openRealtimeStage(stageId: number, activateLiveView: boolean): Promise<void> {
  if (realtimeStageLoadInFlightId === stageId) {
    return;
  }

  setRealtimeStageLoadInFlightId(stageId);
  state.selectedRealtimeStageId = stageId;
  if (activateLiveView) {
    activateView('live-race');
  }
  renderRealtimeRaceView();
  showLoading('Live-Simulation wird geladen...');
  try {
    const res = await api.getRealtimeSimulation(stageId);
    if (!res.success || !res.data) {
      state.realtimeBootstrap = null;
      state.realtimeError = res.error ?? 'Live-Simulation konnte nicht geladen werden.';
      renderRealtimeRaceView();
      alert('Live-Simulation fehlgeschlagen:\n' + (res.error ?? 'Unbekannter Fehler'));
      return;
    }

    startRealtimeSimulation(res.data, false);
  } catch (error) {
    state.realtimeBootstrap = null;
    state.realtimeError = (error as Error).message;
    renderRealtimeRaceView();
    alert('Unerwarteter Fehler bei der Live-Simulation: ' + (error as Error).message);
  } finally {
    if (realtimeStageLoadInFlightId === stageId) {
      setRealtimeStageLoadInFlightId(null);
    }
    hideLoading();
  }
}

export async function completeRealtimeStage(
  stageId: number,
  entries: RealtimeStageCommitEntry[],
  markerClassifications: StageMarkerClassification[],
  incidents: PrecalculatedRaceIncident[],
  events?: RaceSimMessage[],
  skipViewActivation = false,
  leadoutContributions?: RealtimeLeadoutContribution[],
  superTeamId?: number,
): Promise<void> {
  if (realtimeCompletionInFlight) {
    return;
  }

  setRealtimeCompletionInFlight(true);
  showLoading('Live-Ergebnis wird gespeichert...');
  try {
    const res = await api.completeRealtimeSimulation(stageId, {
      entries,
      markerClassifications,
      incidents,
      events,
      leadoutContributions,
      superTeamId,
    });
    if (!res.success) {
      alert('Live-Ergebnis konnte nicht gespeichert werden:\n' + (res.error ?? 'Unbekannter Fehler'));
      return;
    }

    const data = res.data;
    state.selectedResultsRaceId = data?.raceId ?? state.selectedResultsRaceId;
    state.selectedResultsStageId = data?.stageId ?? stageId;
    state.selectedResultTypeId = 1;
    state.realtimeBootstrap = null;
    state.realtimeError = null;
    await loadStageResults(stageId, false);
    await loadRiders();
    await loadGameState();
    await loadRaces();
    if (isActiveView('teams') || isActiveView('riders')) {
      await refreshTeamsViewData();
    }
    renderRealtimeRaceView();
    if (!skipViewActivation) {
      activateView('results');
    }
  } catch (error) {
    alert('Unerwarteter Fehler beim Speichern des Live-Ergebnisses: ' + (error as Error).message);
  } finally {
    setRealtimeCompletionInFlight(false);
    hideLoading();
  }
}

export function handleRosterRiderClick(riderId: number, teamId: number): void {
  if (!state.rosterEditor) return;
  const teamEntry = state.rosterEditor.teams.find(t => t.team.id === teamId);
  if (!teamEntry) return;

  const riderOpt = teamEntry.riders.find(r => r.rider.id === riderId);
  if (!riderOpt || riderOpt.isLocked) return;

  const idx = state.rosterEditorSelectedRiderIds.indexOf(riderId);
  if (idx !== -1) {
    state.rosterEditorSelectedRiderIds.splice(idx, 1);
  } else {
    const selectedCount = getRosterEditorSelectedCount(teamId);
    if (selectedCount >= teamEntry.riderLimit) {
      showError('roster-editor-error', `Du kannst maximal ${teamEntry.riderLimit} Fahrer für ${teamEntry.team.name} auswählen.`);
      return;
    }
    hideError('roster-editor-error');
    state.rosterEditorSelectedRiderIds.push(riderId);
  }

  renderRosterEditor();
}

export function initLiveRaceListeners(): void {
  $<HTMLSelectElement>('race-sim-stage-select').addEventListener('change', (event) => {
    const stageId = Number((event.target as HTMLSelectElement).value);
    state.selectedRealtimeStageId = Number.isFinite(stageId) ? stageId : null;
    if (state.realtimeBootstrap && state.realtimeBootstrap.stage.id !== state.selectedRealtimeStageId) {
      state.realtimeBootstrap = null;
    }
    state.realtimeError = null;
    void openRealtimeStage(stageId, false);
  });

  const rosterEditorBody = $('roster-editor-body');
  if (rosterEditorBody) {
    rosterEditorBody.addEventListener('click', (event) => {
      const button = (event.target as Element).closest<HTMLButtonElement>('button.roster-editor-rider');
      if (!button) return;

      const riderId = Number(button.dataset.rosterRiderId);
      const teamId = Number(button.dataset.rosterTeamId);
      if (Number.isFinite(riderId) && Number.isFinite(teamId)) {
        handleRosterRiderClick(riderId, teamId);
      }
    });
  }
}

