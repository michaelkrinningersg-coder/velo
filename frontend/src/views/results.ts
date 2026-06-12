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
  renderRiderNameLink,
  renderNonFinisherStatusBadge,
  formatNonFinisherReason,
  renderRankDelta,
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
export const RESULTS_EVENTS_KEY = '__events__';

let selectedEventFilter = 'all';

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

  if (state.riders.length === 0) {
    const ridersRes = await api.getRiders();
    if (ridersRes.success) {
      state.riders = ridersRes.data ?? [];
    }
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

function getKmZeroEventPriority(row: { title?: string | null }): number {
  const title = row.title || '';
  if (title.includes('guten Tag')) {
    return 1; // Superform
  }
  if (title.includes('schlechten Tag')) {
    return 2; // Supermalus
  }
  if (title.includes('Formhöhepunkt') || title.includes('Formhoehepunkt')) {
    return 3; // Form Peak
  }
  if (title.includes('nicht am Start')) {
    return 4; // DNS
  }
  return 5;
}

function renderLeaderDots(riderId: number | null): string {
  if (riderId == null || !state.stageResults) return '';
  const currentRace = findRaceById(state.selectedResultsRaceId);
  const isStageRace = currentRace?.isStageRace ?? false;

  const classifications = state.stageResults.classifications;
  const gcLeader = classifications.find(c => c.resultTypeId === GC_RESULT_TYPE_ID)?.rows.find(r => r.rank === 1)?.riderId;
  const pointsLeader = classifications.find(c => c.resultTypeId === POINTS_RESULT_TYPE_ID)?.rows.find(r => r.rank === 1)?.riderId;
  const mountainLeader = classifications.find(c => c.resultTypeId === MOUNTAIN_RESULT_TYPE_ID)?.rows.find(r => r.rank === 1)?.riderId;
  const youthLeader = classifications.find(c => c.resultTypeId === 5)?.rows.find(r => r.rank === 1)?.riderId;

  const dots: string[] = [];
  const currentTypeId = state.selectedResultTypeId;

  // Yellow Dot (GC leader):
  if (riderId === gcLeader) {
    if (currentTypeId === GC_RESULT_TYPE_ID || (currentTypeId === 1 && isStageRace) || (currentTypeId !== 1 && currentTypeId !== GC_RESULT_TYPE_ID)) {
      dots.push('<span class="jersey-dot jersey-dot-yellow" title="Gelbes Trikot (Gesamtwertung)"></span>');
    }
  }
  // Green Dot (Points leader):
  if (riderId === pointsLeader) {
    dots.push('<span class="jersey-dot jersey-dot-green" title="Grünes Trikot (Punktewertung)"></span>');
  }
  // Red Dot (Mountain leader):
  if (riderId === mountainLeader) {
    dots.push('<span class="jersey-dot jersey-dot-red" title="Rotes Trikot (Bergwertung)"></span>');
  }
  // White Dot (Youth leader):
  if (riderId === youthLeader) {
    dots.push('<span class="jersey-dot jersey-dot-white" title="Weißes Trikot (Nachwuchswertung)"></span>');
  }

  if (dots.length === 0) return '';
  return `<span class="jersey-dots-wrapper">${dots.join('')}</span>`;
}

function formatEventTextWithAllRiders(text: string): string {
  if (!text) return '';

  let tempText = text;
  const placeholders: string[] = [];

  // Sort riders by name length descending to avoid partial replacements (e.g. "David Gaudu" before "David")
  const riders = [...state.riders].sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`;
    const nameB = `${b.firstName} ${b.lastName}`;
    return nameB.length - nameA.length;
  });

  for (const rider of riders) {
    const name = `${rider.firstName} ${rider.lastName}`;

    // Escape name for regex
    const escapedName = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`${escapedName}(\\s+\\(\\d+\\.\\))?`, 'g');

    if (regex.test(tempText)) {
      tempText = tempText.replace(regex, (match) => {
        const placeholder = `__RIDER_LINK_${placeholders.length}__`;
        const linkHtml = renderRiderNameLink(match, {
          riderId: rider.id,
          teamId: rider.activeTeamId,
          strong: true,
          linkClassName: 'results-rider-link',
          labelClassName: 'results-participant-label',
        });
        placeholders.push(linkHtml);
        return placeholder;
      });
    }
  }

  let escapedHtml = esc(tempText);
  for (let i = 0; i < placeholders.length; i++) {
    escapedHtml = escapedHtml.replace(`__RIDER_LINK_${i}__`, placeholders[i]);
  }

  return escapedHtml;
}

export function renderResultsView(): void {
  // If state.riders is empty, trigger a fetch so that links are rendered properly when data arrives
  if (state.riders.length === 0) {
    void api.getRiders().then((res) => {
      if (res.success && res.data) {
        state.riders = res.data;
        renderResultsView();
      }
    });
  }

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

  // Clean up colgroup and table layout from previous renders
  const existingColgroup = table.querySelector('colgroup');
  if (existingColgroup) {
    existingColgroup.remove();
  }
  table.style.tableLayout = '';

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

  const visibleClassifications = state.stageResults?.classifications.filter(c => {
    if (selectedRace && !selectedRace.isStageRace && c.resultTypeId !== 1 && c.resultTypeId !== 6) {
      return false;
    }
    return true;
  }) ?? [];

  const selectedClassification = visibleClassifications.find(
    (classification) => classification.resultTypeId === state.selectedResultTypeId,
  ) ?? visibleClassifications[0] ?? null;
  const showNonFinishers = state.selectedResultsSpecialView === 'nonFinishers';
  const showEvents = state.selectedResultsSpecialView === 'events';
  if (selectedClassification && !showNonFinishers && !showEvents) {
    state.selectedResultTypeId = selectedClassification.resultTypeId;
  }

  // Inject colgroup and table-layout if Events view is active
  if (showEvents) {
    table.style.tableLayout = 'fixed';
    const colgroup = document.createElement('colgroup');
    colgroup.innerHTML = `
      <col style="width: 100px;">
      <col style="width: 240px;">
      <col style="width: auto;">
    `;
    table.insertBefore(colgroup, table.firstChild);
  }

  if (!state.stageResults || (!selectedClassification && !showNonFinishers && !showEvents)) {
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

  const stagePointsMap = new Map<number, number>();
  const stageMountainPointsMap = new Map<number, number>();

  if (state.stageResults) {
    const stageResultClassification = state.stageResults.classifications.find(c => c.resultTypeId === 1);
    if (stageResultClassification) {
      for (const r of stageResultClassification.rows) {
        if (r.riderId != null && r.points != null && r.points > 0) {
          stagePointsMap.set(r.riderId, r.points);
        }
      }
    }
    if (state.stageResults.markerClassifications) {
      for (const mc of state.stageResults.markerClassifications) {
        if (isMountainClassificationMarkerType(mc.markerType, mc.markerCategory)) {
          for (const entry of mc.entries) {
            if (entry.riderId != null && entry.pointsAwarded != null && entry.pointsAwarded > 0) {
              const current = stageMountainPointsMap.get(entry.riderId) ?? 0;
              stageMountainPointsMap.set(entry.riderId, current + entry.pointsAwarded);
            }
          }
        }
      }
    }
  }

  const isGcClassification = selectedClassification?.resultTypeId === GC_RESULT_TYPE_ID;
  const isPointsLikeClassification = selectedClassification?.resultTypeId === POINTS_RESULT_TYPE_ID
    || selectedClassification?.resultTypeId === MOUNTAIN_RESULT_TYPE_ID;
  const isYouthClassification = selectedClassification?.resultTypeId === 5;
  const isTeamClassification = selectedClassification?.resultTypeId === 6;
  const showTrendColumn = isGcClassification || isPointsLikeClassification || isYouthClassification || isTeamClassification;

  const resultTypeButtons = visibleClassifications.map((classification) => `
    <button
      type="button"
      class="results-type-btn${!showNonFinishers && !showEvents && classification.resultTypeId === state.selectedResultTypeId ? ' active' : ''}"
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
  const eventsButton = `
    <button
      type="button"
      class="results-type-btn${showEvents ? ' active' : ''}"
      data-results-special-view="${RESULTS_EVENTS_KEY}"
    >Ereignisse</button>
  `;
  const teamButtonIndex = visibleClassifications.findIndex((classification) => classification.resultTypeName.toLocaleLowerCase('de').includes('team'));
  if (teamButtonIndex >= 0) {
    resultTypeButtons.splice(teamButtonIndex + 1, 0, nonFinishersButton, eventsButton);
  } else {
    resultTypeButtons.push(nonFinishersButton, eventsButton);
  }
  tabs.innerHTML = resultTypeButtons.join('');

  const stageMarkerClassifications = sortStageMarkerClassifications(state.stageResults.markerClassifications ?? []);
  const showMarkerTabs = !showNonFinishers && !showEvents && selectedClassification?.resultTypeId === 1 && stageMarkerClassifications.length > 0;
  const selectedStageSubViewKey = showMarkerTabs
    ? (state.selectedResultsMarkerKey ?? RESULTS_STAGE_OVERVIEW_KEY)
    : null;
  const selectedMarkerClassification = showMarkerTabs && selectedStageSubViewKey !== RESULTS_STAGE_OVERVIEW_KEY
    ? stageMarkerClassifications.find((classification) => classification.markerKey === selectedStageSubViewKey) ?? null
    : null;
  if (showMarkerTabs) {
    state.selectedResultsMarkerKey = selectedMarkerClassification?.markerKey ?? RESULTS_STAGE_OVERVIEW_KEY;
  }
  if (showEvents) {
    const filters = [
      { key: 'all', label: 'Alle' },
      { key: 'form', label: 'Tagesform' },
      { key: 'attack', label: 'Attacken' },
      { key: 'breakaway', label: 'Fluchtgruppe' },
      { key: 'incident', label: 'Stürze/Defekte' },
      { key: 'exit', label: 'Ausgeschieden' },
    ];
    markerTabs.innerHTML = filters.map((filter) => `
      <button
        type="button"
        class="results-type-btn${filter.key === selectedEventFilter ? ' active' : ''}"
        data-event-filter="${filter.key}"
      >${esc(filter.label)}</button>
    `).join('');
  } else {
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
  }
  markerTabs.classList.toggle('hidden', !showEvents && !showMarkerTabs);

  const showStageOverviewTable = showNonFinishers || showEvents || !showMarkerTabs || state.selectedResultsMarkerKey === RESULTS_STAGE_OVERVIEW_KEY;

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
      : showEvents
      ? `
        <th>km Marke</th>
        <th>Fahrer</th>
        <th>Ereignis</th>
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
          <th>Trend</th>
          <th class="results-jersey-col">Trikot</th>
          <th>Fahrer / Team</th>
          <th class="results-flag-col">Flagge</th>
          <th>Team</th>
          <th>Punkte</th>
          <th>UCI Punkte</th>
        `
      : isTeamClassification
        ? `
          <th>Platz</th>
          <th>Trend</th>
          <th class="results-jersey-col">Trikot</th>
          <th>Team</th>
          <th class="results-flag-col">Flagge</th>
          <th>Zeit</th>
          <th>Rückstand</th>
          <th>UCI Punkte</th>
        `
      : `
        <th>Platz</th>
        ${showTrendColumn ? '<th>Trend</th>' : ''}
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
    : showEvents
    ? [...(state.stageResults.events ?? [])]
      .filter((row) => {
        if (selectedEventFilter === 'all') {
          return true;
        }
        if (selectedEventFilter === 'form') {
          return !!(row.title && (row.title.includes('guten Tag') || row.title.includes('schlechten Tag') || row.title.includes('Formhöhepunkt') || row.title.includes('Formhoehepunkt')));
        }
        if (selectedEventFilter === 'attack') {
          return (row.type === 'attack' || row.type === 'counter_attack') && !(row.title && (row.title.toLowerCase().includes('ausreiß') || row.title.toLowerCase().includes('ausreiss')));
        }
        if (selectedEventFilter === 'breakaway') {
          return !!(row.title && (row.title.toLowerCase().includes('ausreiß') || row.title.toLowerCase().includes('ausreiss')));
        }
        if (selectedEventFilter === 'incident') {
          return (row.type === 'incident' || !!(row.title && row.title.includes('Massensturz'))) && !(row.title && (row.title.toLowerCase().includes('ausreiß') || row.title.toLowerCase().includes('ausreiss')));
        }
        if (selectedEventFilter === 'exit') {
          return row.type === 'dnf' || !!(row.title && row.title.includes('nicht am Start'));
        }
        return true;
      })
      .sort((a, b) => {
        const kmA = a.kmMark ?? 0;
        const kmB = b.kmMark ?? 0;
        if (Math.abs(kmA - kmB) > 0.0001) {
          return kmA - kmB;
        }
        if (kmA === 0) {
          const prioA = getKmZeroEventPriority(a);
          const prioB = getKmZeroEventPriority(b);
          if (prioA !== prioB) {
            return prioA - prioB;
          }
        }
        const nameA = a.riderName ?? '';
        const nameB = b.riderName ?? '';
        return nameA.localeCompare(nameB, 'de');
      }).map((row) => {
        const kmFormatted = row.kmMark != null ? `${row.kmMark.toFixed(1).replace('.', ',')} km` : '0,0 km';
        const riderId = row.riderId;
        const riderObj = riderId != null ? findRiderById(riderId) : null;
        const teamId = row.riderTeamId ?? riderObj?.activeTeamId ?? null;
        const teamName = teamId != null ? (state.teams.find((t) => t.id === teamId)?.name ?? null) : null;

        const jerseyHtml = renderResultsJerseyColumn(teamId, teamName);
        const flagHtml = renderResultsFlagColumn(riderId != null ? resolveRiderCountryCode(riderId) : null);
        const riderHtml = riderId != null ? renderResultsParticipant(row.riderName ?? '', true, false, riderId, teamId) : esc(row.riderName || '–');

        let badgeHtml = '';
        if (row.title && row.title.includes('guten Tag')) {
          badgeHtml = `<span class="event-badge event-badge-superform"><span class="event-icon">▲</span> Guten Tag</span>`;
        } else if (row.title && row.title.includes('schlechten Tag')) {
          badgeHtml = `<span class="event-badge event-badge-supermalus"><span class="event-icon">▼</span> Schlechten Tag</span>`;
        } else if (row.title && (row.title.includes('Formhöhepunkt') || row.title.includes('Formhoehepunkt'))) {
          badgeHtml = `<span class="event-badge event-badge-peak"><span class="event-icon">★</span> Formhöhepunkt</span>`;
        } else if (row.title && row.title.includes('nicht am Start')) {
          badgeHtml = `<span class="event-badge event-badge-dns">DNS</span>`;
        } else if (row.title && row.title.includes('Massensturz')) {
          badgeHtml = `<span class="event-badge event-badge-masscrash">Massensturz</span>`;
        } else if (row.type === 'dnf') {
          badgeHtml = `<span class="event-badge event-badge-dnf">DNF</span>`;
        } else if (row.title && (row.title.toLowerCase().includes('ausreiß') || row.title.toLowerCase().includes('ausreiss'))) {
          badgeHtml = `<span class="event-badge event-badge-breakaway">Fluchtgruppe</span>`;
        } else if (row.type === 'attack') {
          badgeHtml = `<span class="event-badge event-badge-attack">Attacke</span>`;
        } else if (row.type === 'counter_attack') {
          badgeHtml = `<span class="event-badge event-badge-counter">Konterattacke</span>`;
        } else if (row.type === 'incident') {
          const isDefect = row.title && (row.title.toLowerCase().includes('defekt') || row.title.toLowerCase().includes('panne') || row.title.toLowerCase().includes('technisch'));
          if (isDefect) {
            badgeHtml = `<span class="event-badge event-badge-defect">Defekt</span>`;
          } else {
            badgeHtml = `<span class="event-badge event-badge-crash">Sturz</span>`;
          }
        }

        return `
          <tr>
            <td>${kmFormatted}</td>
            <td>
              <div class="event-rider-info">
                ${jerseyHtml}
                ${flagHtml}
                ${riderHtml}
              </div>
            </td>
            <td>
              <div class="event-content">
                <div class="event-title-wrapper">
                  <span class="event-title">${formatEventTextWithAllRiders(row.title || '')}</span>
                  ${badgeHtml}
                </div>
                ${row.detail ? `<div class="event-detail">${formatEventTextWithAllRiders(row.detail)}</div>` : ''}
              </div>
            </td>
          </tr>`;
      }).join('') || '<tr><td colspan="3" class="results-empty-cell">Keine Ereignisse für diese Etappe.</td></tr>'
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
      const trendCell = showTrendColumn
        ? `<td class="results-gc-delta-cell">${renderRankDelta(row.previousRank, row.rankDelta)}</td>`
        : '';
      if (isPointsLikeClassification) {
        let pointsHtml = row.points != null ? String(row.points) : '–';
        if (row.points != null && row.riderId != null && selectedClassification) {
          const isPoints = selectedClassification.resultTypeId === POINTS_RESULT_TYPE_ID;
          const stagePoints = isPoints ? (stagePointsMap.get(row.riderId) ?? 0) : (stageMountainPointsMap.get(row.riderId) ?? 0);
          if (stagePoints > 0) {
            pointsHtml += ` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${stagePoints}</span>`;
          }
        }
        return `
          <tr>
            <td class="pos-${Math.min(row.rank, 3)}">${row.rank}</td>
            ${trendCell}
            <td class="results-jersey-col-cell">${jerseyCell}</td>
            <td>${participantCell}${renderLeaderDots(row.riderId)}</td>
            <td class="results-flag-col-cell">${flagCell}</td>
            <td>${esc(teamName)}</td>
            <td>${pointsHtml}</td>
            <td>${row.uciPoints != null ? row.uciPoints : '–'}</td>
          </tr>`;
      }
      if (isTeamClassification) {
        return `
          <tr>
            <td class="pos-${Math.min(row.rank, 3)}">${row.rank}</td>
            ${trendCell}
            <td class="results-jersey-col-cell">${jerseyCell}</td>
            <td>${esc(row.teamName)}</td>
            <td class="results-flag-col-cell">${flagCell}</td>
            <td>${timeCell}</td>
            <td>${esc(formatRaceGap(row.gapSeconds))}</td>
            <td>${row.uciPoints != null ? row.uciPoints : '–'}</td>
          </tr>`;
      }
      return `
        <tr>
          <td class="pos-${Math.min(row.rank, 3)}">${row.rank}</td>
          ${trendCell}
          <td class="results-jersey-col-cell">${jerseyCell}</td>
          <td>${participantCell}${renderLeaderDots(row.riderId)}</td>
          <td class="results-flag-col-cell">${flagCell}</td>
          <td>${esc(teamName)}</td>
          <td>${timeCell}</td>
          <td>${esc(formatRaceGap(row.gapSeconds))}</td>
          <td>${row.points != null ? row.points : '–'}</td>
          <td>${row.uciPoints != null ? row.uciPoints : '–'}</td>
        </tr>`;
    }).join('')
    : '';

  empty.classList.toggle('hidden', !!selectedClassification || showNonFinishers || showEvents);
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
      } else if (special === RESULTS_EVENTS_KEY) {
        state.selectedResultsSpecialView = 'events';
        selectedEventFilter = 'all';
        renderResultsView();
      }
    }
  });

  $('results-marker-tabs').addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-marker-key]');
    if (button) {
      const key = button.dataset['markerKey'];
      state.selectedResultsMarkerKey = key ?? RESULTS_STAGE_OVERVIEW_KEY;
      renderResultsView();
      return;
    }

    const filterButton = (event.target as Element).closest<HTMLButtonElement>('button[data-event-filter]');
    if (filterButton) {
      const filter = filterButton.dataset['eventFilter'];
      selectedEventFilter = filter ?? 'all';
      renderResultsView();
    }
  });
}
