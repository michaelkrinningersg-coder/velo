import { api } from '../api';
import {
  $,
  esc,
  state,
  formatDate,
  formatKm,
  formatElevationGain,
  isActiveView,
  showModal,
  showLoading,
  hideLoading,
  renderFlag,
  renderMiniJersey,
  findRaceById,
  findStageById,
  formatRiderName,
  getRiderCountryCode,
  getRiderRoleName,
  renderSkillValue,
  renderSeasonFormPhase,
  renderSeasonFormPhaseIndicator,
  resolveRaceCategoryBadgeStyle,
  buildRaceCategoryBadgeCssVariables,
  renderRiderNameLink,
  getRiderSpecializationLabel,
  autoProgressActive,
  setAutoProgressActive,
} from '../state';
import type {
  Race,
  Stage,
  PendingStage,
  RaceProgramParticipant,
  RiderProgramRaceSummary,
  StageProfile,
  ParsedStageSummary,
  StageEditorClimbOverviewRow,
  Rider,
} from '../../../shared/types';
import { renderStaticStageProfile } from '../race-sim/renderProfile';

// Dynamically imported or declared interfaces to avoid circular import issues
import { openRosterEditor, openRealtimeStage, openInstantStage } from './liveRace';

export function raceCategoryBadge(race: Race): string {
  const categoryStyle = resolveRaceCategoryBadgeStyle(race.category?.name);
  const badgeStyle = buildRaceCategoryBadgeCssVariables(categoryStyle);
  if (race.isStageRace) {
    return `<span class="badge badge-race-category" style="${badgeStyle}">Etappenrennen · ${race.numberOfStages} · Etappen</span>`;
  }
  return `<span class="badge badge-race-category" style="${badgeStyle}">Eintagesrennen</span>`;
}

export function raceCategoryNameBadge(race: Race): string {
  const categoryStyle = resolveRaceCategoryBadgeStyle(race.category?.name);
  const badgeStyle = buildRaceCategoryBadgeCssVariables(categoryStyle);
  const name = race.category?.name ?? `Kategorie ${race.categoryId}`;
  return `<span class="badge badge-race-category" style="${badgeStyle}">${esc(name)}</span>`;
}

export function getRaceStageDateRange(race: Race): { startDate: string; endDate: string } {
  const stages = race.stages ?? [];
  if (stages.length === 0) {
    return { startDate: race.startDate, endDate: race.endDate };
  }

  const sortedDates = stages.map((stage) => stage.date).sort((left, right) => left.localeCompare(right));
  return {
    startDate: sortedDates[0] ?? race.startDate,
    endDate: sortedDates[sortedDates.length - 1] ?? race.endDate,
  };
}

export function formatRaceDateRange(race: Race): string {
  const { startDate, endDate } = getRaceStageDateRange(race);
  return startDate === endDate
    ? formatDate(startDate)
    : `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function canEditPendingStage(stage: PendingStage): boolean {
  return stage.stageId > 0;
}

export async function loadGameState(): Promise<void> {
  const [gameStateRes, gameStatusRes] = await Promise.all([api.getGameState(), api.getGameStatus()]);
  if (!gameStateRes.success) { console.error(gameStateRes.error); return; }
  state.gameState = gameStateRes.data ?? null;
  state.gameStatus = gameStatusRes.success ? gameStatusRes.data ?? null : null;
  renderGameState();
  if (isActiveView('dashboard')) {
    renderDashboard();
  }
}

export function renderGameState(): void {
  if (!state.gameState) return;
  $('meta-date').textContent = state.gameState.formattedDate;
  $('meta-season').textContent = `Saison ${state.gameState.season}`;
  const hint = $('meta-race-hint');
  const advanceButton = $<HTMLButtonElement>('btn-advance-day');
  const pendingStagesContainer = $('pending-stages-list');
  const pendingStages = state.gameStatus?.pendingStages ?? [];
  if (pendingStages.length > 0) {
    hint.textContent = `${pendingStages.length} offene Etappe${pendingStages.length === 1 ? '' : 'n'} heute. Tageswechsel ist gesperrt.`;
    hint.classList.remove('hidden');
    pendingStagesContainer.innerHTML = pendingStages.map((pendingStage) => {
      const subtitle = pendingStage.isStageRace
        ? `Etappe ${pendingStage.stageNumber} · ${pendingStage.profile} · ${formatDate(pendingStage.date)}`
        : `${pendingStage.profile} · ${formatDate(pendingStage.date)}`;
      const rosterButton = canEditPendingStage(pendingStage)
        ? `<button class="btn btn-ghost btn-sm" data-edit-stage-roster="${pendingStage.stageId}">Starterfeld bearbeiten</button>`
        : '';
      return `
        <div class="pending-stage-item">
          <div class="pending-stage-meta">
            <div class="pending-stage-title">${esc(pendingStage.raceName)}</div>
            <div class="pending-stage-subtitle">${esc(subtitle)}</div>
          </div>
          <div class="pending-stage-actions">
            ${rosterButton}
            <button class="btn btn-secondary btn-sm" data-live-stage="${pendingStage.stageId}">Live-Sim</button>
            <button class="btn btn-secondary btn-sm" data-instant-stage="${pendingStage.stageId}">Instant</button>
          </div>
        </div>`;
    }).join('');
    pendingStagesContainer.classList.remove('hidden');
    advanceButton.disabled = true;
  } else if (state.gameState.hasRaceToday) {
    hint.textContent = 'Heutige Rennen sind abgeschlossen. Tageswechsel ist wieder freigegeben.';
    hint.classList.remove('hidden');
    pendingStagesContainer.innerHTML = '';
    pendingStagesContainer.classList.add('hidden');
    advanceButton.disabled = false;
  } else {
    hint.textContent = '';
    hint.classList.add('hidden');
    pendingStagesContainer.innerHTML = '';
    pendingStagesContainer.classList.add('hidden');
    advanceButton.disabled = false;
  }
}

export function renderDashboard(): void {
  const playerTeam = state.teams.find(t => t.isPlayerTeam)
    ?? state.teams.find(t => t.name === state.currentSave?.teamName)
    ?? null;
  $('dashboard-career').textContent   = state.currentSave?.careerName ?? '–';
  $('dashboard-team').textContent     = playerTeam?.name ?? state.currentSave?.teamName ?? '–';
  $('dashboard-date').textContent     = state.gameState?.formattedDate ?? '–';
  $('dashboard-season').textContent   = state.gameState ? `Saison ${state.gameState.season}` : '–';
  $('dashboard-races-today').textContent = String(state.gameStatus?.pendingStages.length ?? state.gameState?.racesTodayCount ?? 0);
  renderDashboardRaces();
}

export async function loadRaces(): Promise<void> {
  const res = await api.getRaces();
  if (!res.success) { console.error(res.error); return; }
  state.races = res.data ?? [];
  if (isActiveView('dashboard')) {
    renderDashboard();
  }
  void logParticipantCountsOnce();
  void logProgramAssignmentsOnce();
}

async function logParticipantCountsOnce(): Promise<void> {
  const season = state.gameState?.season;
  if (!season || state.races.length === 0) return;

  const storageKey = `participantCountsLogged_${season}`;
  if (localStorage.getItem(storageKey)) return;

  // Fetch participant counts for all upcoming races in parallel (batched to avoid overloading)
  const upcomingRaces = state.races.slice(0, 30);
  const results = await Promise.all(
    upcomingRaces.map(async (race) => {
      const res = await api.getRaceProgramParticipants(race.id);
      return { race, count: res.success ? (res.data?.length ?? 0) : -1 };
    }),
  );

  // Only log if we got any non-zero participants (i.e., programs are rolled)
  const hasParticipants = results.some((r) => r.count > 0);
  if (!hasParticipants) return;

  console.group(`[Velo] Teilnehmeranzahl Saison ${season}`);
  for (const { race, count } of results) {
    if (count >= 0) {
      console.log(`${race.name} (${race.startDate}): ${count} Programmfahrer`);
    }
  }
  console.groupEnd();

  localStorage.setItem(storageKey, '1');
}

export async function logProgramAssignmentsOnce(): Promise<void> {
  const season = state.gameState?.season;
  if (!season) return;

  const storageKey = `programAssignmentsLogged_${season}`;
  if (localStorage.getItem(storageKey)) return;

  const res = await api.getRiders();
  if (!res.success || !res.data) return;

  const riders = res.data;
  // Group riders by program
  const assignmentsByProgram = new Map<number, { name: string; riders: Rider[] }>();

  for (const r of riders) {
    if (r.seasonProgram) {
      const prog = r.seasonProgram;
      if (!assignmentsByProgram.has(prog.id)) {
        assignmentsByProgram.set(prog.id, { name: prog.name, riders: [] });
      }
      assignmentsByProgram.get(prog.id)!.riders.push(r);
    }
  }

  if (assignmentsByProgram.size === 0) return;

  console.group(`[Velo] Programmzuweisungen Saison ${season}`);
  const sortedProgIds = Array.from(assignmentsByProgram.keys()).sort((a, b) => a - b);
  for (const progId of sortedProgIds) {
    const prog = assignmentsByProgram.get(progId)!;
    console.log(`Program: ${progId} - ${prog.name} (Count: ${prog.riders.length})`);
  }
  console.groupEnd();

  localStorage.setItem(storageKey, '1');
}

function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function renderRaceRowHtml(race: Race): string {
  const isLive = state.gameState != null
    && race.startDate <= state.gameState.currentDate
    && race.endDate >= state.gameState.currentDate;
  const isDone = state.gameState != null && race.endDate < state.gameState.currentDate;
  const statusBadge = isDone
    ? `<span class="badge badge-done">Abgeschlossen</span>`
    : isLive
      ? `<span class="badge badge-live">Läuft</span>`
      : `<span class="badge badge-todo">Geplant</span>`;
  const location = race.country?.name ?? `Land ${race.countryId}`;
  const locationFlag = race.country?.code3 ? renderFlag(race.country.code3) : '';
  const totalDistanceKm = race.isStageRace
    ? (race.stages ?? []).reduce((sum, stage) => sum + (stage.distanceKm ?? 0), 0)
    : (race.upcomingStage?.distanceKm ?? null);
  const totalElevationGain = race.isStageRace
    ? (race.stages ?? []).reduce((sum, stage) => sum + (stage.elevationGainMeters ?? 0), 0)
    : (race.upcomingStage?.elevationGainMeters ?? null);
  const distance = totalDistanceKm != null ? String(totalDistanceKm.toFixed(1)).replace('.', ',') : '-';
  const elevation = totalElevationGain != null ? String(Math.round(totalElevationGain)) : '-';
  return `
    <tr>
      <td>${formatDate(race.startDate)}</td>
      <td>
        <button type="button" class="dashboard-race-link" data-dashboard-race-id="${race.id}">
          <strong>${esc(race.name)}</strong>
        </button>
      </td>
      <td>
        <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${race.id}">
          ${raceCategoryBadge(race)}
        </button>
      </td>
      <td><span class="dashboard-race-country">${locationFlag}<span>${esc(location)}</span></span></td>
      <td>${raceCategoryNameBadge(race)}</td>
      <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${race.id}">Teilnehmer</button></td>
      <td>${distance}</td>
      <td>${elevation}</td>
      <td>${statusBadge}</td>
    </tr>`;
}

export function renderDashboardRaces(): void {
  const tbody = $('dashboard-races-tbody');
  if (!state.gameState) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-muted">Kein Spiel geladen.</td></tr>';
    return;
  }

  const currentDate = state.gameState.currentDate;
  const maxDateStr = addDays(currentDate, 7);

  const inProgressRaces = state.races.filter(race =>
    race.startDate <= currentDate && race.endDate >= currentDate
  );

  const upcomingRaces = state.races.filter(race =>
    race.startDate > currentDate && race.startDate <= maxDateStr
  );

  let html = '';

  // In Progress
  html += `
    <tr class="table-subsection-header">
      <td colspan="9"><strong>In Progress</strong></td>
    </tr>
  `;
  if (inProgressRaces.length === 0) {
    html += `
      <tr>
        <td colspan="9" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine laufenden Rennen.</td>
      </tr>
    `;
  } else {
    html += inProgressRaces.map(race => renderRaceRowHtml(race)).join('');
  }

  // Upcoming
  html += `
    <tr class="table-subsection-header">
      <td colspan="9"><strong>Geplant (Nächste 7 Tage)</strong></td>
    </tr>
  `;
  if (upcomingRaces.length === 0) {
    html += `
      <tr>
        <td colspan="9" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine geplanten Rennen in den nächsten 7 Tagen.</td>
      </tr>
    `;
  } else {
    html += upcomingRaces.map(race => renderRaceRowHtml(race)).join('');
  }

  tbody.innerHTML = html;
}

export function getStageDisplayName(stage: Stage): string {
  return `Etappe ${stage.stageNumber}`;
}

export function summarizeStageProfiles(stages: Stage[]): string {
  if (stages.length === 0) {
    return 'Keine Etappen';
  }

  const counts = new Map<string, number>();
  stages.forEach((stage) => {
    counts.set(stage.profile, (counts.get(stage.profile) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }
      return left[0].localeCompare(right[0]);
    })
    .map(([profile, count]) => `${count}x ${profile}`)
    .join(' · ');
}

export function getStageProfileClassName(profile: StageProfile): string {
  return `stage-profile-badge-${profile.toLowerCase().replace(/_/g, '-')}`;
}

export function renderStageProfileBadge(profile: StageProfile): string {
  return `<span class="stage-profile-badge ${getStageProfileClassName(profile)}">${esc(profile)}</span>`;
}

export function buildDashboardStageProfileLabel(race: Race, stage: Stage): string {
  return `${race.name} · ${getStageDisplayName(stage)} · ${stage.profile}`;
}

export async function ensureStageSummaryLoaded(stageId: number): Promise<ParsedStageSummary | null> {
  const cachedSummary = state.stageSummariesByStageId[stageId];
  if (cachedSummary) {
    return cachedSummary;
  }

  const res = await api.getStageSummary(stageId);
  if (res.success && res.data) {
    state.stageSummariesByStageId[stageId] = res.data;
    if (state.stageSummaryErrorsByStageId) {
      delete state.stageSummaryErrorsByStageId[stageId];
    }
    return res.data;
  }

  const realtimeFallback = await api.getRealtimeSimulation(stageId);
  if (realtimeFallback.success && realtimeFallback.data?.stageSummary) {
    state.stageSummariesByStageId[stageId] = realtimeFallback.data.stageSummary;
    if (state.stageSummaryErrorsByStageId) {
      delete state.stageSummaryErrorsByStageId[stageId];
    }
    return realtimeFallback.data.stageSummary;
  }

  if (state.stageSummaryErrorsByStageId) {
    state.stageSummaryErrorsByStageId[stageId] = res.error ?? realtimeFallback.error ?? 'Etappenprofil konnte nicht geladen werden.';
  }
  console.error('Stage-Summary-Laden fehlgeschlagen:', {
    stageId,
    stageSummaryError: res.error,
    realtimeFallbackError: realtimeFallback.error,
  });
  if (state.stageSummariesByStageId) {
    delete state.stageSummariesByStageId[stageId];
  }
  if (!res.success || !res.data) {
    return null;
  }

  return res.data;
}

export function renderDashboardRaceStagesModal(): void {
  const title = $('race-stages-title');
  const meta = $('race-stages-meta');
  const body = $('race-stages-body');
  const race = findRaceById(state.selectedDashboardRaceId);

  if (!race) {
    title.textContent = 'Etappen';
    meta.textContent = '';
    body.innerHTML = '<div class="results-empty">Rennen nicht gefunden.</div>';
    return;
  }

  const stages = race.stages ?? [];
  const totalDistanceKm = stages.reduce((sum, stage) => sum + (stage.distanceKm ?? 0), 0);
  const totalElevationGain = stages.reduce((sum, stage) => sum + (stage.elevationGainMeters ?? 0), 0);
  const stageTypeSummary = summarizeStageProfiles(stages);
  title.textContent = race.name;
  meta.textContent = `${formatRaceDateRange(race)} · ${race.country?.name ?? `Land ${race.countryId}`} · ${race.isStageRace ? `${race.numberOfStages} Etappen` : 'Eintagesrennen'} · ${formatKm(totalDistanceKm)} · ${formatElevationGain(totalElevationGain)} · ${stageTypeSummary}`;

  if (stages.length === 0) {
    body.innerHTML = '<div class="results-empty">Für dieses Rennen sind keine Etappen vorhanden.</div>';
    return;
  }

  body.innerHTML = `
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Name</th>
            <th>Profil</th>
            <th>Distanz</th>
            <th>Höhenmeter</th>
            <th>Profil</th>
          </tr>
        </thead>
        <tbody>
          ${stages.map((stage) => {
            return `
              <tr class="dashboard-race-stage-row">
                <td>${formatDate(stage.date)}</td>
                <td><strong>${esc(getStageDisplayName(stage))}</strong></td>
                <td>${renderStageProfileBadge(stage.profile)}</td>
                <td>${stage.distanceKm != null ? formatKm(stage.distanceKm) : '–'}</td>
                <td>${stage.elevationGainMeters != null ? formatElevationGain(stage.elevationGainMeters) : '–'}</td>
                <td>
                  <button
                    type="button"
                    class="dashboard-stage-profile-link"
                    data-dashboard-stage-profile-id="${stage.id}"
                    aria-label="Profil von ${esc(buildDashboardStageProfileLabel(race, stage))} öffnen"
                  >
                    Profil anzeigen
                  </button>
                </td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

export async function openDashboardRaceStages(raceId: number): Promise<void> {
  const race = findRaceById(raceId);
  if (!race) {
    return;
  }

  state.selectedDashboardRaceId = raceId;
  renderDashboardRaceStagesModal();
  showModal('raceStages');
}

export function renderProgramRaceRows(payload: RiderProgramRaceSummary): string {
  if (payload.races.length === 0) {
    return '<div class="results-empty">Keine Rennen in diesem Programm.</div>';
  }

  return `
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table">
        <thead><tr><th>Datum</th><th>Land</th><th>Rennen</th><th>Kategorie</th><th>Format</th></tr></thead>
        <tbody>
          ${payload.races.map((race) => `
            <tr>
              <td>${formatRaceDateRange(race)}</td>
              <td><span class="dashboard-race-country">${race.country?.code3 ? renderFlag(race.country.code3) : ''}<span>${esc(race.country?.name ?? `Land ${race.countryId}`)}</span></span></td>
              <td><strong>${esc(race.name)}</strong></td>
              <td>${raceCategoryNameBadge(race)}</td>
              <td>${raceCategoryBadge(race)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

export async function openRiderProgram(riderId: number): Promise<void> {
  const rider = state.riders.find((entry) => entry.id === riderId);
  $('rider-program-title').textContent = rider ? formatRiderName(rider) : 'Programm';
  $('rider-program-meta').textContent = 'Lade Programmrennen ...';
  $('rider-program-body').innerHTML = '';
  showModal('riderProgram');

  const res = await api.getRiderProgramRaces(riderId);
  if (!res.success || !res.data) {
    $('rider-program-meta').textContent = '';
    $('rider-program-body').innerHTML = `<div class="results-empty">${esc(res.error ?? 'Programm konnte nicht geladen werden.')}</div>`;
    return;
  }

  $('rider-program-title').textContent = res.data.program.name;
  $('rider-program-meta').textContent = rider ? formatRiderName(rider) : '';
  $('rider-program-body').innerHTML = renderProgramRaceRows(res.data);
}

export function renderRaceParticipantRows(participants: RaceProgramParticipant[]): string {
  if (participants.length === 0) {
    return '<div class="results-empty">Keine Programmfahrer für dieses Rennen.</div>';
  }

  const sortedParticipants = sortRaceParticipants(participants);

  return `
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table race-participants-table">
        <thead><tr>
          ${renderRaceParticipantsHeader('Team', 'team', 'Team')}
          ${renderRaceParticipantsHeader('Fahrer', 'rider', 'Fahrer')}
          ${renderRaceParticipantsHeader('Spec1', 'spec1', 'Spezialisierung 1')}
          ${renderRaceParticipantsHeader('Rolle', 'role', 'Rolle')}
          ${renderRaceParticipantsHeader('Ges', 'overall', 'Gesamtstärke')}
          ${renderRaceParticipantsHeader('Phase', 'phase', 'Formphase')}
          ${renderRaceParticipantsHeader('Programm', 'program', 'Saisonprogramm')}
        </tr></thead>
        <tbody>
          ${sortedParticipants.map((participant) => `
            <tr class="race-participants-row">
              <td class="race-participants-team-cell">${renderMiniJersey(participant.team?.id, participant.team?.name)}</td>
              <td><span class="race-participant-rider-cell">${renderFlag(getRiderCountryCode(participant.rider))}<strong>${esc(formatRiderName(participant.rider))}</strong></span></td>
              <td>${esc(getSpecLabel(participant.rider))}</td>
              <td>${esc(getRiderRoleName(participant.rider))}</td>
              <td>${renderSkillValue(participant.rider.overallRating)}</td>
              <td>${renderSeasonFormPhase(participant.rider)}</td>
              <td><button type="button" class="team-program-button" data-rider-program-id="${participant.rider.id}">${esc(participant.program.name)}</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

export function renderRaceParticipantsHeader(label: string, sortKey: string, title?: string): string {
  const activeClass = state.raceParticipantsSort.key === sortKey ? ' race-participants-sort-active' : '';
  const indicator = state.raceParticipantsSort.key === sortKey ? (state.raceParticipantsSort.direction === 'asc' ? '↑' : '↓') : '↕';
  const titleAttr = title ? ` title="${esc(title)}"` : '';
  return `
    <th${titleAttr}>
      <button
        type="button"
        class="race-participants-sort${activeClass}"
        data-race-participants-sort="${sortKey}"
      >
        <span class="team-table-sort-label">${esc(label)}</span>
        <span class="team-table-sort-indicator${state.raceParticipantsSort.key === sortKey ? ' team-table-sort-indicator-active' : ''}">${indicator}</span>
      </button>
    </th>`;
}

export function sortRaceParticipants(participants: RaceProgramParticipant[]): RaceProgramParticipant[] {
  const directionFactor = state.raceParticipantsSort.direction === 'asc' ? 1 : -1;
  return [...participants].sort((left, right) => {
    let comparison = 0;
    switch (state.raceParticipantsSort.key) {
      case 'team':
        comparison = (left.team?.name ?? '').localeCompare(right.team?.name ?? '', 'de');
        break;
      case 'rider':
        comparison = formatRiderName(left.rider).localeCompare(formatRiderName(right.rider), 'de');
        break;
      case 'spec1':
        comparison = getSpecLabel(left.rider).localeCompare(getSpecLabel(right.rider), 'de');
        break;
      case 'role':
        comparison = getRiderRoleName(left.rider).localeCompare(getRiderRoleName(right.rider), 'de');
        break;
      case 'overall':
        comparison = left.rider.overallRating - right.rider.overallRating;
        break;
      case 'phase':
        comparison = (left.rider.seasonFormPhase ?? 'neutral').localeCompare(right.rider.seasonFormPhase ?? 'neutral', 'de');
        break;
      default:
        comparison = (left.program?.name ?? '').localeCompare(right.program?.name ?? '', 'de');
    }
    return comparison * directionFactor || formatRiderName(left.rider).localeCompare(formatRiderName(right.rider), 'de');
  });
}

export function getSpecLabel(rider: Rider): string {
  if (rider.specialization1 != null) {
    return getRiderSpecializationLabel(rider.specialization1);
  }

  return '–';
}

export async function openRaceProgramParticipants(raceId: number): Promise<void> {
  const race = findRaceById(raceId);
  state.selectedRaceParticipantsRaceId = raceId;
  $('race-participants-title').textContent = race?.name ?? 'Teilnehmer';
  $('race-participants-meta').textContent = 'Lade Programmfahrer ...';
  $('race-participants-body').innerHTML = '';
  state.raceParticipants = [];
  showModal('raceParticipants');

  await refreshRaceProgramParticipants();
}

export async function refreshRaceProgramParticipants(showLoadingState = false): Promise<void> {
  const raceId = state.selectedRaceParticipantsRaceId;
  if (raceId == null) {
    return;
  }

  const race = findRaceById(raceId);
  if (showLoadingState) {
    $('race-participants-meta').textContent = 'Lade Programmfahrer ...';
  }

  const res = await api.getRaceProgramParticipants(raceId);
  if (!res.success || !res.data) {
    $('race-participants-meta').textContent = '';
    $('race-participants-body').innerHTML = `<div class="results-empty">${esc(res.error ?? 'Teilnehmer konnten nicht geladen werden.')}</div>`;
    return;
  }

  state.raceParticipants = res.data;
  $('race-participants-title').textContent = race?.name ?? 'Teilnehmer';
  $('race-participants-meta').textContent = `${res.data.length} Programmfahrer · ${race ? formatRaceDateRange(race) : ''}`;
  $('race-participants-body').innerHTML = renderRaceParticipantRows(state.raceParticipants);
}

export async function openDashboardStageProfile(stageId: number, selectedClimb: StageEditorClimbOverviewRow | null = null): Promise<void> {
  let location = findStageById(stageId);
  if (!location && state.stageEditorStageRows) {
    const editorRow = state.stageEditorStageRows.find((r) => r.stageId === stageId);
    if (editorRow) {
      location = {
        race: {
          id: editorRow.raceId,
          name: editorRow.raceName,
          countryId: 0,
          categoryId: 0,
          isStageRace: true,
          numberOfStages: 1,
          startDate: '',
          endDate: '',
          prestige: 0,
        } as any,
        stage: {
          id: editorRow.stageId,
          raceId: editorRow.raceId,
          stageNumber: editorRow.stageNumber,
          date: '2026-01-01',
          profile: editorRow.profile,
          startElevation: 0,
          detailsCsvFile: '',
          distanceKm: editorRow.distanceKm,
          elevationGainMeters: editorRow.elevationGainMeters,
        } as any,
      };
    }
  }

  if (!location) {
    return;
  }

  const summary = await ensureStageSummaryLoaded(stageId);
  if (!summary) {
    alert(state.stageSummaryErrorsByStageId[stageId] ?? 'Etappenprofil konnte nicht geladen werden.');
    return;
  }

  state.selectedDashboardProfileStageId = stageId;
  $('stage-profile-title').textContent = `${location.race.name} · ${getStageDisplayName(location.stage)}`;
  const climbMeta = selectedClimb != null
    ? ` · Anstieg ${selectedClimb.climbIndex}: ${selectedClimb.name}${selectedClimb.category != null ? ` · Kat. ${selectedClimb.category}` : ''} · ${selectedClimb.startKm.toFixed(1).replace('.', ',')}-${selectedClimb.endKm.toFixed(1).replace('.', ',')} km · Climb Score ${selectedClimb.climbScore}`
    : '';
  $('stage-profile-meta').textContent = `${formatDate(location.stage.date)} · ${location.stage.profile} · ${location.stage.distanceKm != null ? formatKm(location.stage.distanceKm) : '–'} · ${location.stage.elevationGainMeters != null ? formatElevationGain(location.stage.elevationGainMeters) : '–'}${climbMeta}`;
  renderStaticStageProfile(
    $('stage-profile-view'),
    summary,
    location.stage.profile,
    buildDashboardStageProfileLabel(location.race, location.stage),
    selectedClimb != null
      ? { selectedClimbRange: { startKm: selectedClimb.startKm, endKm: selectedClimb.endKm } }
      : undefined,
  );
  showModal('stageProfile');
}

export function initDashboardListeners(): void {
  $('pending-stages-list').addEventListener('click', (event) => {
    const editButton = (event.target as Element).closest<HTMLButtonElement>('button[data-edit-stage-roster]');
    if (editButton) {
      const stageId = Number(editButton.dataset['editStageRoster']);
      if (!Number.isFinite(stageId)) return;
      void openRosterEditor(stageId);
      return;
    }

    const liveButton = (event.target as Element).closest<HTMLButtonElement>('button[data-live-stage]');
    if (liveButton) {
      const stageId = Number(liveButton.dataset['liveStage']);
      if (!Number.isFinite(stageId)) return;
      void openRealtimeStage(stageId, true);
      return;
    }

    const instantButton = (event.target as Element).closest<HTMLButtonElement>('button[data-instant-stage]');
    if (instantButton) {
      const stageId = Number(instantButton.dataset['instantStage']);
      if (!Number.isFinite(stageId)) return;
      void openInstantStage(stageId);
    }
  });

  $('dashboard-races-tbody').addEventListener('click', (event) => {
    const participantsButton = (event.target as Element).closest<HTMLButtonElement>('button[data-dashboard-race-participants-id]');
    if (participantsButton) {
      const raceId = Number(participantsButton.dataset['dashboardRaceParticipantsId']);
      if (Number.isFinite(raceId)) {
        void openRaceProgramParticipants(raceId);
      }
      return;
    }

    const raceButton = (event.target as Element).closest<HTMLButtonElement>('button[data-dashboard-race-id]');
    if (!raceButton) {
      return;
    }

    const raceId = Number(raceButton.dataset['dashboardRaceId']);
    if (!Number.isFinite(raceId)) {
      return;
    }

    void openDashboardRaceStages(raceId);
  });

  $('race-stages-body').addEventListener('click', (event) => {
    const profileButton = (event.target as Element).closest<HTMLButtonElement>('button[data-dashboard-stage-profile-id]');
    if (!profileButton) {
      return;
    }

    const stageId = Number(profileButton.dataset['dashboardStageProfileId']);
    if (!Number.isFinite(stageId)) {
      return;
    }

    void openDashboardStageProfile(stageId);
  });

  $('race-participants-body').addEventListener('click', (event) => {
    const programButton = (event.target as Element).closest<HTMLButtonElement>('button[data-rider-program-id]');
    if (programButton) {
      const riderId = Number(programButton.dataset['riderProgramId']);
      if (Number.isFinite(riderId)) {
        void openRiderProgram(riderId);
      }
      return;
    }

    const sortButton = (event.target as Element).closest<HTMLButtonElement>('button[data-race-participants-sort]');
    if (!sortButton) {
      return;
    }

    const sortKey = sortButton.dataset['raceParticipantsSort'] as any;
    if (state.raceParticipantsSort.key === sortKey) {
      state.raceParticipantsSort.direction = state.raceParticipantsSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      state.raceParticipantsSort = {
        key: sortKey,
        direction: 'asc',
      };
    }
    void refreshRaceProgramParticipants();
  });

  $('btn-advance-day').addEventListener('click', async () => {
    await executeDayAdvance();
  });

  $('btn-auto-progress').addEventListener('click', () => {
    toggleAutoProgress();
  });
}

export async function executeDayAdvance(): Promise<boolean> {
  showLoading('Tag wird fortgeschrieben...');
  try {
    const res = await api.advanceDay();
    if (!res.success) {
      alert('Tageswechsel fehlgeschlagen:\n' + (res.error ?? 'Unbekannter Fehler'));
      return false;
    }
    if (state.currentSave && res.data) state.currentSave.currentSeason = res.data.season;
    await loadGameState();
    await loadRaces();
    if (isActiveView('teams')) {
      const { refreshTeamsViewData } = await import('./teams');
      await refreshTeamsViewData();
    }
    return true;
  } catch (e) {
    alert('Unerwarteter Fehler beim Tageswechsel: ' + (e as Error).message);
    return false;
  } finally {
    hideLoading();
  }
}

export function updateAutoProgressUI(): void {
  const btn = document.getElementById('btn-auto-progress') as HTMLButtonElement | null;
  if (!btn) return;
  if (autoProgressActive) {
    btn.textContent = 'Stoppen (Leertaste)';
    btn.classList.remove('btn-secondary');
    btn.classList.add('btn-danger');
  } else {
    btn.textContent = 'Auto Progress';
    btn.classList.remove('btn-danger');
    btn.classList.add('btn-secondary');
  }
}

export function toggleAutoProgress(): void {
  if (autoProgressActive) {
    stopAutoProgress();
  } else {
    startAutoProgress();
  }
}

export function startAutoProgress(): void {
  if (autoProgressActive) return;
  setAutoProgressActive(true);
  updateAutoProgressUI();
  void runAutoProgressLoop();
}

export function stopAutoProgress(): void {
  if (!autoProgressActive) return;
  setAutoProgressActive(false);
  state.autoProgressTargetDate = null;
  updateAutoProgressUI();
}

async function runAutoProgressLoop(): Promise<void> {
  while (autoProgressActive) {
    const currentDate = state.gameState?.currentDate;
    if (state.autoProgressTargetDate && currentDate && currentDate >= state.autoProgressTargetDate) {
      stopAutoProgress();
      break;
    }

    const pendingStages = state.gameStatus?.pendingStages ?? [];
    let success = false;
    if (pendingStages.length > 0) {
      const nextStage = pendingStages[0];
      success = await openInstantStage(nextStage.stageId, true);
    } else {
      success = await executeDayAdvance();
    }

    if (!success) {
      stopAutoProgress();
      break;
    }

    await new Promise<void>((resolve) => setTimeout(resolve, 100));
  }
  updateAutoProgressUI();
}

// Window event listener for stopping auto progress via Spacebar
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space' || event.key === ' ') {
    if (autoProgressActive) {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }
      event.preventDefault();
      stopAutoProgress();
    }
  }
});
