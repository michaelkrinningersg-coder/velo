import { api } from '../api';
import {
  $,
  esc,
  state,
  formatDate,
  formatRaceTime,
  formatRaceGap,
  renderFlag,
  renderCountry,
  renderMiniJersey,
  renderResultsJerseyColumn,
  renderResultsFlagColumn,
  resolveRiderCountryCode,
  findRiderById,
  findRaceById,
  findStageById,
  renderResultsParticipant,
  renderNonFinisherStatusBadge,
  formatNonFinisherReason,
  renderGcRankDelta,
  resolveGcRankDelta,
  formatMarkerLabel,
  FLAG_CODE_BY_CODE3,
  GC_RESULT_TYPE_ID,
  POINTS_RESULT_TYPE_ID,
  MOUNTAIN_RESULT_TYPE_ID,
  isActiveView,
  showLoading,
  hideLoading,
} from '../state';
import type {
  StageResultsPayload,
  StageMarkerClassification,
  Race,
} from '../../../shared/types';

export const RESULTS_STAGE_OVERVIEW_KEY = '__stage_overview__';
export const RESULTS_NON_FINISHERS_KEY = '__non_finishers__';

export function isMountainClassificationMarkerType(markerType: string, markerCategory: string | null | undefined): boolean {
  if (markerType === 'climb_top' || markerType === 'finish_hill' || markerType === 'finish_mountain') {
    return true;
  }
  return false;
}

export function resolveMarkerResultsSortPriority(classification: StageMarkerClassification): number {
  if (isMountainClassificationMarkerType(classification.markerType, classification.markerCategory)) return 0;
  if (classification.markerType === 'sprint_intermediate') return 1;
  return 2;
}

export function sortStageMarkerClassifications(classifications: StageMarkerClassification[]): StageMarkerClassification[] {
  return [...classifications].sort((left, right) => (
    resolveMarkerResultsSortPriority(left) - resolveMarkerResultsSortPriority(right)
    || left.kmMark - right.kmMark
    || left.markerLabel.localeCompare(right.markerLabel, 'de')
    || left.markerKey.localeCompare(right.markerKey, 'de')
  ));
}

export function resolveMarkerResultButtonLabel(classification: StageMarkerClassification): string {
  const markerPrefix = classification.markerType === 'sprint_intermediate' ? 'Sprint' : 'Berg';
  const categorySuffix = isMountainClassificationMarkerType(classification.markerType, classification.markerCategory) && classification.markerCategory
    ? ` ${classification.markerCategory}`
    : '';
  return `${markerPrefix}${categorySuffix} · ${classification.markerLabel}`;
}

export function formatAverageSpeed(distanceKm: number, timeSeconds: number): string {
  if (!(distanceKm > 0) || !(timeSeconds > 0)) {
    return '';
  }
  return `${((distanceKm / timeSeconds) * 3600).toFixed(1).replace('.', ',')} km/h`;
}

export function formatResultsStageLabel(race: Race, stage: NonNullable<Race['stages']>[number]): string {
  const stageLabel = race.isStageRace ? `Etappe ${stage.stageNumber}` : 'Renntag';
  return `${race.name} · ${stageLabel} · ${formatDate(stage.date)}`;
}

export async function loadStageResults(stageId: number, silentIfMissing: boolean): Promise<void> {
  const location = findStageById(stageId);
  if (location) {
    state.selectedResultsRaceId = location.race.id;
    state.selectedResultsStageId = stageId;
  }

  const res = await api.getStageResults(stageId);
  if (!res.success) {
    state.stageResults = null;
    renderResultsView();
    if (!silentIfMissing && res.error) {
      alert('Ergebnisse konnten nicht geladen werden:\n' + res.error);
    }
    return;
  }

  state.stageResults = res.data ?? null;
  if (state.stageResults) {
    state.selectedResultsRaceId = state.stageResults.raceId;
    state.selectedResultsStageId = state.stageResults.stageId;
    state.selectedResultTypeId = state.stageResults.classifications[0]?.resultTypeId ?? 1;
    state.selectedResultsMarkerKey = RESULTS_STAGE_OVERVIEW_KEY;
    state.selectedResultsSpecialView = null;
  }
  renderResultsView();
}

export function renderResultsView(): void {
  const raceSelect = $<HTMLSelectElement>('results-race-select');
  const stageSelect = $<HTMLSelectElement>('results-stage-select');
  const tabs = $('results-type-tabs');
  const markerTabs = $('results-marker-tabs');
  const meta = $('results-stage-meta');
  const empty = $('results-empty');
  const table = $('results-table');
  const headerRow = table.querySelector('thead tr');
  const tbody = $('results-tbody');
  const markerClassifications = $('results-marker-classifications');

  if (state.stageResults) {
    state.selectedResultsRaceId = state.stageResults.raceId;
    state.selectedResultsStageId = state.stageResults.stageId;
  }

  raceSelect.innerHTML = '<option value="">– Rennen auswählen –</option>' + state.races
    .filter((race) => (race.stages?.length ?? 0) > 0)
    .map((race) => `<option value="${race.id}"${race.id === state.selectedResultsRaceId ? ' selected' : ''}>${esc(race.name)}</option>`)
    .join('');

  const selectedRace = findRaceById(state.selectedResultsRaceId);
  const stageOptions = selectedRace == null
    ? ''
    : (selectedRace.stages ?? [])
      .map((stage) => `<option value="${stage.id}"${stage.id === state.selectedResultsStageId ? ' selected' : ''}>${esc(formatResultsStageLabel(selectedRace, stage))}</option>`)
      .join('');
  stageSelect.innerHTML = '<option value="">– Etappe auswählen –</option>' + stageOptions;

  const selectedClassification = state.stageResults?.classifications.find(
    (classification) => classification.resultTypeId === state.selectedResultTypeId,
  ) ?? state.stageResults?.classifications[0] ?? null;
  const showNonFinishers = state.selectedResultsSpecialView === 'nonFinishers';
  if (selectedClassification && !showNonFinishers) {
    state.selectedResultTypeId = selectedClassification.resultTypeId;
  }

  if (!state.stageResults || (!selectedClassification && !showNonFinishers)) {
    const selectedStage = findStageById(state.selectedResultsStageId);
    meta.textContent = selectedStage
      ? `${selectedStage.race.name} · ${selectedStage.stage.profile} · ${formatDate(selectedStage.stage.date)}`
      : 'Noch keine Etappe ausgewählt.';
    tabs.innerHTML = '';
    markerTabs.innerHTML = '';
    markerTabs.classList.add('hidden');
    tbody.innerHTML = '';
    markerClassifications.innerHTML = '';
    markerClassifications.classList.add('hidden');
    table.classList.add('hidden');
    empty.classList.remove('hidden');
    empty.textContent = state.selectedResultsStageId != null
      ? 'Für diese Etappe liegen noch keine Ergebnisse vor.'
      : 'Noch keine Ergebnisse geladen.';
    return;
  }

  meta.textContent = `${state.stageResults.raceName} · Etappe ${state.stageResults.stageNumber} · ${state.stageResults.profile} · ${formatDate(state.stageResults.date)}`;
  const resultStage = findStageById(state.stageResults.stageId);
  const stageDistanceKm = resultStage?.stage.distanceKm ?? null;
  const isGcClassification = selectedClassification?.resultTypeId === GC_RESULT_TYPE_ID;
  const isPointsLikeClassification = selectedClassification?.resultTypeId === POINTS_RESULT_TYPE_ID
    || selectedClassification?.resultTypeId === MOUNTAIN_RESULT_TYPE_ID;
  const previousGcRanks = new Map((state.stageResults.previousGcStandings ?? []).map((standing) => [standing.riderId, standing.rank] as const));
  const resultTypeButtons = state.stageResults.classifications.map((classification) => `
    <button
      type="button"
      class="results-type-btn${!showNonFinishers && classification.resultTypeId === state.selectedResultTypeId ? ' active' : ''}"
      data-result-type-id="${classification.resultTypeId}"
    >${esc(classification.resultTypeName)}</button>
  `);
  const nonFinishersButton = `
    <button
      type="button"
      class="results-type-btn${showNonFinishers ? ' active' : ''}"
      data-results-special-view="${RESULTS_NON_FINISHERS_KEY}"
    >OTL/DNF</button>
  `;
  const teamButtonIndex = state.stageResults.classifications.findIndex((classification) => classification.resultTypeName.toLocaleLowerCase('de').includes('team'));
  if (teamButtonIndex >= 0) {
    resultTypeButtons.splice(teamButtonIndex + 1, 0, nonFinishersButton);
  } else {
    resultTypeButtons.push(nonFinishersButton);
  }
  tabs.innerHTML = resultTypeButtons.join('');

  const stageMarkerClassifications = sortStageMarkerClassifications(state.stageResults.markerClassifications ?? []);
  const showMarkerTabs = !showNonFinishers && selectedClassification?.resultTypeId === 1 && stageMarkerClassifications.length > 0;
  const selectedStageSubViewKey = showMarkerTabs
    ? (state.selectedResultsMarkerKey ?? RESULTS_STAGE_OVERVIEW_KEY)
    : null;
  const selectedMarkerClassification = showMarkerTabs && selectedStageSubViewKey !== RESULTS_STAGE_OVERVIEW_KEY
    ? stageMarkerClassifications.find((classification) => classification.markerKey === selectedStageSubViewKey) ?? null
    : null;
  if (showMarkerTabs) {
    state.selectedResultsMarkerKey = selectedMarkerClassification?.markerKey ?? RESULTS_STAGE_OVERVIEW_KEY;
  }
  markerTabs.innerHTML = showMarkerTabs
    ? [`
      <button
        type="button"
        class="results-type-btn${state.selectedResultsMarkerKey === RESULTS_STAGE_OVERVIEW_KEY ? ' active' : ''}"
        data-marker-key="${RESULTS_STAGE_OVERVIEW_KEY}"
      >Tageswertung</button>`, ...stageMarkerClassifications.map((classification) => `
      <button
        type="button"
        class="results-type-btn${classification.markerKey === state.selectedResultsMarkerKey ? ' active' : ''}"
        data-marker-key="${classification.markerKey}"
      >${esc(resolveMarkerResultButtonLabel(classification))}</button>
    `)].join('')
    : '';
  markerTabs.classList.toggle('hidden', !showMarkerTabs);

  const showStageOverviewTable = showNonFinishers || !showMarkerTabs || state.selectedResultsMarkerKey === RESULTS_STAGE_OVERVIEW_KEY;

  if (headerRow && showStageOverviewTable) {
    headerRow.innerHTML = showNonFinishers
      ? `
        <th>Etappe</th>
        <th>Status</th>
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Grund</th>
      `
      : isGcClassification
      ? `
        <th>Platz</th>
        <th>GC</th>
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer / Team</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Zeit</th>
        <th>Rückstand</th>
        <th>Punktewertung</th>
        <th>UCI Punkte</th>
      `
      : isPointsLikeClassification
        ? `
          <th>Platz</th>
          <th class="results-jersey-col">Trikot</th>
          <th>Fahrer / Team</th>
          <th class="results-flag-col">Flagge</th>
          <th>Team</th>
          <th>Punkte</th>
          <th>UCI Punkte</th>
        `
      : `
        <th>Platz</th>
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer / Team</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Zeit</th>
        <th>Rückstand</th>
        <th>Punktewertung</th>
        <th>UCI Punkte</th>
      `;
  }

  tbody.innerHTML = showNonFinishers
    ? (state.stageResults.nonFinishers ?? []).map((row) => `
      <tr>
        <td>${row.stageNumber}</td>
        <td>${renderNonFinisherStatusBadge(row.isOtl)}</td>
        <td class="results-jersey-col-cell">${renderResultsJerseyColumn(row.teamId, row.teamName)}</td>
        <td>${renderResultsParticipant(row.riderName, true, false, row.riderId, row.teamId)}</td>
        <td class="results-flag-col-cell">${renderResultsFlagColumn(row.countryCode)}</td>
        <td>${esc(row.teamName || '–')}</td>
        <td>${esc(formatNonFinisherReason(row.statusReason, row.isOtl))}</td>
      </tr>
    `).join('') || '<tr><td colspan="7" class="results-empty-cell">Keine OTL/DNF bis zu dieser Etappe.</td></tr>'
    : showStageOverviewTable && selectedClassification
    ? selectedClassification.rows.map((row) => {
      const participant = row.riderName ?? row.teamName;
      const teamName = row.riderName ? row.teamName : '–';
      const jerseyCell = renderResultsJerseyColumn(row.teamId, row.teamName);
      const participantCell = renderResultsParticipant(participant, true, row.isBreakaway === true, row.riderId, row.teamId);
      const flagCell = renderResultsFlagColumn(resolveRiderCountryCode(row.riderId));
      const showAverageSpeed = selectedClassification.resultTypeId === 1 && row.rank === 1 && row.timeSeconds != null && stageDistanceKm != null;
      const timeCell = row.timeSeconds != null
        ? `${formatRaceTime(row.timeSeconds)}${showAverageSpeed ? ` (${formatAverageSpeed(stageDistanceKm, row.timeSeconds)})` : ''}`
        : '–';
      const gcDelta = resolveGcRankDelta(row, previousGcRanks);
      const gcDeltaCell = isGcClassification
        ? `<td class="results-gc-delta-cell">${renderGcRankDelta(gcDelta.previousRank, gcDelta.delta)}</td>`
        : '';
      if (isPointsLikeClassification) {
        return `
          <tr>
            <td class="pos-${Math.min(row.rank, 3)}">${row.rank}</td>
            <td class="results-jersey-col-cell">${jerseyCell}</td>
            <td>${participantCell}</td>
            <td class="results-flag-col-cell">${flagCell}</td>
            <td>${esc(teamName)}</td>
            <td>${row.points != null ? row.points : '–'}</td>
            <td>${row.uciPoints != null ? row.uciPoints : '–'}</td>
          </tr>`;
      }
      return `
        <tr>
          <td class="pos-${Math.min(row.rank, 3)}">${row.rank}</td>
          ${gcDeltaCell}
          <td class="results-jersey-col-cell">${jerseyCell}</td>
          <td>${participantCell}</td>
          <td class="results-flag-col-cell">${flagCell}</td>
          <td>${esc(teamName)}</td>
          <td>${timeCell}</td>
          <td>${esc(formatRaceGap(row.gapSeconds))}</td>
          <td>${row.points != null ? row.points : '–'}</td>
          <td>${row.uciPoints != null ? row.uciPoints : '–'}</td>
        </tr>`;
    }).join('')
    : '';

  empty.classList.toggle('hidden', !!selectedClassification || showNonFinishers);
  table.classList.toggle('hidden', !showStageOverviewTable);

  if (selectedMarkerClassification) {
    const headerHtml = `
      <section class="results-marker-card">
        <div class="results-results-view-marker-card-head">
          <h4>${esc(formatMarkerLabel(selectedMarkerClassification.markerType, selectedMarkerClassification.markerLabel))}</h4>
          <div class="results-marker-card-meta">${esc(`${selectedMarkerClassification.kmMark.toFixed(1).replace('.', ',')} km${selectedMarkerClassification.markerCategory ? ` · Kat. ${selectedMarkerClassification.markerCategory}` : ''}`)}</div>
        </div>
      </section>`;

    const rowsHtml = selectedMarkerClassification.entries.map((entry) => {
      const rider = findRiderById(entry.riderId);
      const riderName = rider ? `${rider.firstName} ${rider.lastName}` : `Fahrer ${entry.riderId}`;
      const teamName = rider?.activeTeamId != null
        ? state.teams.find((team) => team.id === rider.activeTeamId)?.name ?? null
        : null;
      return `
        <div class="results-marker-row">
          <div class="results-marker-rank">${entry.rank}.</div>
          <div class="results-marker-jersey">${renderResultsJerseyColumn(rider?.activeTeamId, teamName)}</div>
          <div class="results-marker-name">${renderResultsParticipant(riderName, false, false, rider?.id ?? null, rider?.activeTeamId ?? null)}</div>
          <div class="results-marker-flag">${renderResultsFlagColumn(resolveRiderCountryCode(rider?.id))}</div>
          <div class="results-marker-time">${esc(formatRaceTime(entry.crossingTimeSeconds))}</div>
          <div class="results-marker-gap">${esc(formatRaceGap(entry.gapSeconds))}</div>
          <div class="results-marker-points">${entry.pointsAwarded != null && entry.pointsAwarded > 0 ? entry.pointsAwarded : '–'}</div>
        </div>`;
    }).join('');

    markerClassifications.innerHTML = `${headerHtml}<div class="results-marker-list">${rowsHtml}</div>`;
  } else {
    markerClassifications.innerHTML = '';
  }
  markerClassifications.classList.toggle('hidden', !selectedMarkerClassification);
}

export function initResultsListeners(): void {
  $('results-race-select').addEventListener('change', (e) => {
    const val = (e.target as HTMLSelectElement).value;
    state.selectedResultsRaceId = val ? Number(val) : null;
    const race = findRaceById(state.selectedResultsRaceId);
    state.selectedResultsStageId = race?.stages?.[0]?.id ?? null;
    state.selectedResultTypeId = 1;
    state.selectedResultsMarkerKey = RESULTS_STAGE_OVERVIEW_KEY;
    state.selectedResultsSpecialView = null;
    state.stageResults = null;
    renderResultsView();
    if (state.selectedResultsStageId != null) {
      void loadStageResults(state.selectedResultsStageId, true);
    }
  });

  $('results-stage-select').addEventListener('change', (e) => {
    const val = (e.target as HTMLSelectElement).value;
    state.selectedResultsStageId = val ? Number(val) : null;
    state.selectedResultTypeId = 1;
    state.selectedResultsMarkerKey = RESULTS_STAGE_OVERVIEW_KEY;
    state.selectedResultsSpecialView = null;
    state.stageResults = null;
    renderResultsView();
    if (state.selectedResultsStageId != null) {
      void loadStageResults(state.selectedResultsStageId, true);
    }
  });

  $('results-type-tabs').addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-result-type-id]');
    if (button) {
      state.selectedResultsSpecialView = null;
      state.selectedResultTypeId = Number(button.dataset['resultTypeId']);
      renderResultsView();
      return;
    }

    const specialButton = (event.target as Element).closest<HTMLButtonElement>('button[data-results-special-view]');
    if (specialButton) {
      const special = specialButton.dataset['resultsSpecialView'];
      if (special === RESULTS_NON_FINISHERS_KEY) {
        state.selectedResultsSpecialView = 'nonFinishers';
        renderResultsView();
      }
    }
  });

  $('results-marker-tabs').addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-marker-key]');
    if (!button) {
      return;
    }

    const key = button.dataset['markerKey'];
    state.selectedResultsMarkerKey = key ?? RESULTS_STAGE_OVERVIEW_KEY;
    renderResultsView();
  });
}
