import { api } from '../api';
import {
  $,
  esc,
  state,
  formatDate,
} from '../state';
import { resolveRaceCategoryBadgeStyle } from '../riderStatsUi';

let activePopupRaceId: number | null = null;

// Helpers
function getWeekNumber(dateStr: string): number {
  const d = new Date(dateStr);
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
}

function getWeekStatus(program: any, W: number): 'peak' | 'prep' | 'none' {
  const isPeak =
    (W >= program.peak1_min && W <= program.peak1_max) ||
    (W >= program.peak2_min && W <= program.peak2_max) ||
    (W >= program.peak3_min && W <= program.peak3_max);

  if (isPeak) return 'peak';

  const checkPrep = (peak_min: number) => {
    const start = peak_min - 8;
    const end = peak_min - 1;
    if (start >= 1) {
      return W >= start && W <= end;
    } else {
      const wrappedStart = start + 53;
      return W >= wrappedStart || W <= end;
    }
  };

  const isPrep = checkPrep(program.peak1_min) || checkPrep(program.peak2_min) || checkPrep(program.peak3_min);
  return isPrep ? 'prep' : 'none';
}

function getCellColorClass(status: 'peak' | 'prep' | 'none'): string {
  if (status === 'peak') return 'cell-peak';
  if (status === 'prep') return 'cell-prep';
  return '';
}

// Generate all days of 2026
const DAYS_OF_2026: Array<{ dateStr: string; label: string; weekNum: number }> = (() => {
  const list = [];
  const start = new Date(2026, 0, 1);
  const end = new Date(2026, 11, 31);
  const weekdays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const label = `${weekdays[d.getDay()]}, ${dd}.${String(d.getMonth() + 1).padStart(2, '0')}`;
    list.push({
      dateStr,
      label,
      weekNum: getWeekNumber(dateStr),
    });
  }
  return list;
})();

export async function loadRaceProgramsData(force = false): Promise<void> {
  if (state.raceProgramsPayload && !force) {
    renderRacePrograms();
    return;
  }

  $('race-programs-root').innerHTML = '<div class="results-empty">Programmdaten werden geladen...</div>';
  const res = await api.getRaceProgramsEditor();
  if (!res.success || !res.data) {
    $('race-programs-root').innerHTML = `<div class="results-empty text-danger">${esc(res.error ?? 'Fehler beim Laden.')}</div>`;
    return;
  }

  state.raceProgramsPayload = res.data;
  state.raceProgramsDirty = false;
  state.raceProgramsSaving = false;
  renderRacePrograms();
}

export function initRaceProgramsView(): void {
  // Navigation tabs handler
  $('view-race-programs').addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    // Tab buttons
    const tabBtn = target.closest<HTMLButtonElement>('.results-type-btn[data-tab]');
    if (tabBtn) {
      const tab = tabBtn.dataset['tab'] ?? 'calendar-cols';
      state.raceProgramsActiveTab = tab;
      renderRacePrograms();
      return;
    }

    // Action buttons (save, reload)
    const actionBtn = target.closest<HTMLButtonElement>('.race-programs-action-btn');
    if (actionBtn) {
      const action = actionBtn.dataset['action'];
      if (action === 'reload') {
        void loadRaceProgramsData(true);
      } else if (action === 'save') {
        void saveRaceProgramsData();
      }
      return;
    }

    // Expandable race row details
    const expandBtn = target.closest<HTMLElement>('.race-row-expand-btn');
    if (expandBtn) {
      const raceId = expandBtn.dataset['raceId'];
      const detailsRow = $(`race-details-row-${raceId}`);
      if (detailsRow) {
        detailsRow.classList.toggle('hidden');
        expandBtn.textContent = detailsRow.classList.contains('hidden') ? '▶' : '▼';
      }
      return;
    }

    // Stage Race Click for stages popover
    const racePopoverBtn = target.closest<HTMLButtonElement>('.race-popover-trigger');
    if (racePopoverBtn) {
      event.stopPropagation();
      const raceId = parseInt(racePopoverBtn.dataset['raceId'] ?? '0', 10);
      if (activePopupRaceId === raceId) {
        activePopupRaceId = null;
      } else {
        activePopupRaceId = raceId;
      }
      renderRacePrograms();
      return;
    }

    // Close popover when clicking anywhere else
    if (!target.closest('.race-stages-popover-card')) {
      if (activePopupRaceId !== null) {
        activePopupRaceId = null;
        renderRacePrograms();
      }
    }
  });

  // Event handler for toggling cells
  $('view-race-programs').addEventListener('click', (event) => {
    const cell = (event.target as Element).closest<HTMLElement>('.toggleable-race-cell[data-day]');
    if (!cell) return;

    const day = cell.dataset['day']!;
    const programId = parseInt(cell.dataset['programId']!, 10);
    toggleProgramRaceAssignment(programId, day);
  });

  // Date picker listener in Peak Editor
  $('view-race-programs').addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.classList.contains('peak-date-picker')) {
      const programId = parseInt(input.dataset['programId']!, 10);
      const peakIndex = parseInt(input.dataset['peak']!, 10);
      const dateVal = input.value;
      if (dateVal) {
        const kw = getWeekNumber(dateVal);
        updatePeakKws(programId, peakIndex, kw);
      }
      return;
    }

    // Peak number inputs changes
    if (input.classList.contains('peak-number-input')) {
      const programId = parseInt(input.dataset['programId']!, 10);
      const field = input.dataset['field']!;
      const val = parseInt(input.value || '1', 10);
      updatePeakField(programId, field, val);
    }
  });
}

function updatePeakField(programId: number, field: string, value: number): void {
  const payload = state.raceProgramsPayload;
  if (!payload) return;

  const prog = payload.programs.find((p: any) => p.id === programId);
  if (!prog) return;

  const clamped = Math.max(1, Math.min(53, value));
  prog[field] = clamped;

  // Enforce min <= max constraints
  if (field.endsWith('_min')) {
    const maxField = field.replace('_min', '_max');
    if (prog[maxField] < clamped) {
      prog[maxField] = clamped;
    }
  } else if (field.endsWith('_max')) {
    const minField = field.replace('_max', '_min');
    if (prog[minField] > clamped) {
      prog[minField] = clamped;
    }
  }

  state.raceProgramsDirty = true;
  renderRacePrograms();
}

function updatePeakKws(programId: number, peakIndex: number, kw: number): void {
  const payload = state.raceProgramsPayload;
  if (!payload) return;

  const prog = payload.programs.find((p: any) => p.id === programId);
  if (!prog) return;

  const minField = `peak${peakIndex}_min`;
  const maxField = `peak${peakIndex}_max`;

  prog[minField] = Math.max(1, kw - 2);
  prog[maxField] = Math.min(53, kw + 2);

  state.raceProgramsDirty = true;
  renderRacePrograms();
}

function toggleProgramRaceAssignment(programId: number, dayStr: string): void {
  const payload = state.raceProgramsPayload;
  if (!payload) return;

  const races = payload.races.filter((r: any) => r.start_date <= dayStr && r.end_date >= dayStr);
  if (races.length === 0) return;

  const currentMappingIndex = payload.raceProgramRaces.findIndex(
    (m: any) => m.program_id === programId && races.some((r: any) => r.id === m.race_id)
  );

  if (currentMappingIndex === -1) {
    // 1. Not assigned -> Assign to the first active race
    payload.raceProgramRaces.push({
      program_id: programId,
      race_id: races[0].id,
    });
  } else {
    // 2. Assigned -> Cycle
    const currentMapping = payload.raceProgramRaces[currentMappingIndex];
    const idx = races.findIndex((r: any) => r.id === currentMapping.race_id);

    if (idx < races.length - 1) {
      // Switch to next race
      currentMapping.race_id = races[idx + 1].id;
    } else {
      // Last race -> Unassign completely
      payload.raceProgramRaces.splice(currentMappingIndex, 1);
    }
  }

  state.raceProgramsDirty = true;
  renderRacePrograms();
}

async function saveRaceProgramsData(): Promise<void> {
  if (!state.raceProgramsPayload || state.raceProgramsSaving) return;

  state.raceProgramsSaving = true;
  renderRacePrograms();

  const res = await api.saveRaceProgramsEditor({
    programs: state.raceProgramsPayload.programs,
    raceProgramRaces: state.raceProgramsPayload.raceProgramRaces,
  });

  state.raceProgramsSaving = false;
  if (!res.success) {
    alert(`Fehler beim Speichern:\n${res.error ?? 'Unbekannter Fehler'}`);
    renderRacePrograms();
    return;
  }

  state.raceProgramsDirty = false;
  // Reload fresh stats and allocations
  void loadRaceProgramsData(true);
}

// Calculations for Program Days
function calculateProgramDays(program: any, payload: any): { peak: number; prep: number; none: number } {
  let peak = 0;
  let prep = 0;
  let none = 0;

  // Find all assigned races
  const assignedRaceIds = new Set<number>(
    payload.raceProgramRaces.filter((m: any) => m.program_id === program.id).map((m: any) => m.race_id)
  );

  const assignedRaces = payload.races.filter((r: any) => assignedRaceIds.has(r.id));

  // Loop through all days of each assigned race
  for (const race of assignedRaces) {
    const start = new Date(race.start_date);
    const end = new Date(race.end_date);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const kw = getWeekNumber(`${yyyy}-${mm}-${dd}`);

      const status = getWeekStatus(program, kw);
      if (status === 'peak') peak++;
      else if (status === 'prep') prep++;
      else none++;
    }
  }

  return { peak, prep, none };
}

// RENDERING
export function renderRacePrograms(): void {
  const root = $('race-programs-root');
  const payload = state.raceProgramsPayload;

  if (!payload) {
    root.innerHTML = '<div class="results-empty">Keine Daten geladen.</div>';
    return;
  }

  const dirtyCount = state.raceProgramsDirty;
  const isSaving = state.raceProgramsSaving;
  const activeTab = state.raceProgramsActiveTab;

  // Tab Header HTML
  let html = `
    <div class="race-programs-layout">
      <div class="race-programs-toolbar">
        <div class="results-type-tabs" style="margin: 0;">
          <button class="results-type-btn${activeTab === 'calendar-cols' ? ' active' : ''}" data-tab="calendar-cols">Kalender Programme (Spalten)</button>
          <button class="results-type-btn${activeTab === 'calendar-rows' ? ' active' : ''}" data-tab="calendar-rows">Kalender Programme (Zeilen)</button>
          <button class="results-type-btn${activeTab === 'peak-editor' ? ' active' : ''}" data-tab="peak-editor">Peak-Editor Programme</button>
          <button class="results-type-btn${activeTab === 'rider-role' ? ' active' : ''}" data-tab="rider-role">Rider-Role Programme</button>
        </div>
        <div class="race-programs-actions">
          <button type="button" class="btn btn-secondary race-programs-action-btn" data-action="reload">Neu laden</button>
          <button type="button" class="btn btn-primary race-programs-action-btn" data-action="save" ${!dirtyCount || isSaving ? 'disabled' : ''}>
            ${isSaving ? 'Speichert…' : 'Änderungen exportieren'}
          </button>
        </div>
      </div>
  `;

  // Render individual tabs
  if (activeTab === 'calendar-cols') {
    html += renderTabCalendarCols(payload);
  } else if (activeTab === 'calendar-rows') {
    html += renderTabCalendarRows(payload);
  } else if (activeTab === 'peak-editor') {
    html += renderTabPeakEditor(payload);
  } else if (activeTab === 'rider-role') {
    html += renderTabRiderRole(payload);
  }

  html += `</div>`;
  root.innerHTML = html;
}

// 1. Tab: Calendar Programs (Columns)
function renderTabCalendarCols(payload: any): string {
  const programs = payload.programs;
  const raceProgramRaces = payload.raceProgramRaces;
  const races = payload.races;

  // Calculate day-sums for header
  const programStats = programs.map((p: any) => ({
    id: p.id,
    stats: calculateProgramDays(p, payload),
  }));

  let headerRow = `<tr>
    <th class="sticky-col-header" style="z-index: 15;">Tag / Datum</th>
    <th style="width: 50px; text-align: center;">KW</th>
  `;
  for (const prog of programs) {
    const stats = programStats.find((s: any) => s.id === prog.id)?.stats;
    headerRow += `
      <th style="min-width: 140px; text-align: center;">
        <div style="font-weight: bold; font-size: 0.9rem;">${esc(prog.name)}</div>
        <div class="text-muted" style="font-size: 0.72rem; margin-top: 0.15rem;">
          P: <span style="color: #fb923c; font-weight: bold;">${stats?.peak}</span> | 
          A: <span style="color: #94a3b8; font-weight: bold;">${stats?.prep}</span> | 
          O: <span>${stats?.none}</span>
        </div>
      </th>
    `;
  }
  headerRow += `</tr>`;

  let rowsHtml = '';
  for (const day of DAYS_OF_2026) {
    const racesToday = races.filter((r: any) => r.start_date <= day.dateStr && r.end_date >= day.dateStr);
    const hasRaces = racesToday.length > 0;
    const rowClass = hasRaces ? 'row-has-races' : '';

    let cols = `
      <td class="sticky-col ${rowClass}" style="font-weight: 600;">${day.label}</td>
      <td style="text-align: center; color: var(--text-500); font-variant-numeric: tabular-nums;">${day.weekNum}</td>
    `;

    for (const prog of programs) {
      const status = getWeekStatus(prog, day.weekNum);
      const colorClass = getCellColorClass(status);

      // Find if this program is assigned to any race running today
      const assignedMapping = raceProgramRaces.find(
        (m: any) => m.program_id === prog.id && racesToday.some((r: any) => r.id === m.race_id)
      );

      let content = '';
      let tdClass = `toggleable-race-cell ${colorClass}`;
      let tdAttrs = `data-day="${day.dateStr}" data-program-id="${prog.id}"`;

      if (assignedMapping) {
        const race = races.find((r: any) => r.id === assignedMapping.race_id);
        const style = resolveRaceCategoryBadgeStyle(race?.category?.name);
        content = `
          <span class="race-program-badge" style="background-color: ${style.background}; border: 1px solid ${style.border}; color: ${style.color};" title="${esc(race?.name)}">
            ${esc(race?.name)}
          </span>
        `;
      } else if (hasRaces) {
        content = `<span class="race-cell-placeholder" title="Klicken zum Zuweisen">＋</span>`;
      } else {
        tdClass = colorClass;
        tdAttrs = '';
      }

      cols += `<td class="${tdClass}" ${tdAttrs} style="text-align: center; vertical-align: middle;">${content}</td>`;
    }

    rowsHtml += `<tr>${cols}</tr>`;
  }

  return `
    <div class="team-detail-card" style="margin-top: 1rem;">
      <div class="team-detail-table-scroll" style="max-height: 75vh;">
        <table class="data-table data-table-teams race-programs-calendar-table">
          <thead>
            ${headerRow}
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 2. Tab: Calendar Programs (Rows)
function renderTabCalendarRows(payload: any): string {
  const programs = payload.programs;
  const raceProgramRaces = payload.raceProgramRaces;
  const races = payload.races;

  // Month names banner
  let monthCols = `<th class="sticky-col-header" style="z-index: 15;">Monat</th>`;
  let dayCols = `<th class="sticky-col-header" style="z-index: 15;">Tag / KW</th>`;
  let raceCountCols = `<th class="sticky-col-header" style="z-index: 15;">Rennen Anzahl</th>`;
  let r1Cols = `<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #1</th>`;
  let r2Cols = `<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #2</th>`;
  let r3Cols = `<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #3</th>`;

  // Pre-calculate month headers
  const monthSpans: Array<{ name: string; span: number }> = [];
  const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

  for (const day of DAYS_OF_2026) {
    const mIndex = parseInt(day.dateStr.split('-')[1], 10) - 1;
    const mName = monthNames[mIndex];
    if (monthSpans.length === 0 || monthSpans[monthSpans.length - 1].name !== mName) {
      monthSpans.push({ name: mName, span: 1 });
    } else {
      monthSpans[monthSpans.length - 1].span++;
    }

    const racesToday = races.filter((r: any) => r.start_date <= day.dateStr && r.end_date >= day.dateStr);
    const hasRaces = racesToday.length > 0;
    const rCountText = hasRaces ? `${racesToday.length} R` : '';
    const rCountClass = hasRaces ? 'race-count-active' : '';

    dayCols += `<th style="text-align: center; min-width: 40px; font-variant-numeric: tabular-nums;">
      <div style="font-size: 0.8rem; font-weight: bold;">${day.dateStr.split('-')[2]}</div>
      <div style="font-size: 0.65rem; color: var(--text-500);">W${day.weekNum}</div>
    </th>`;

    raceCountCols += `<th class="${rCountClass}" style="text-align: center; font-size: 0.72rem; font-weight: bold;">${rCountText}</th>`;

    // Render 3 dedicated race rows
    const getRaceBadgeHtml = (index: number) => {
      const race = racesToday[index];
      if (!race) return '';
      const style = resolveRaceCategoryBadgeStyle(race.category?.name);
      const assignedCount = raceProgramRaces.filter((m: any) => m.race_id === race.id).length;
      return `
        <span class="race-id-badge" style="background-color: ${style.background}; border: 1px solid ${style.border}; color: ${style.color}; cursor: help;" 
              title="${esc(race.name)}\nZugelassene Programme: ${assignedCount}">
          R${race.id}
        </span>
      `;
    };

    r1Cols += `<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${getRaceBadgeHtml(0)}</th>`;
    r2Cols += `<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${getRaceBadgeHtml(1)}</th>`;
    r3Cols += `<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${getRaceBadgeHtml(2)}</th>`;
  }

  for (const mSpan of monthSpans) {
    monthCols += `<th colspan="${mSpan.span}" style="text-align: center; font-weight: bold; border-left: 1px solid var(--border);">${mSpan.name}</th>`;
  }

  // Row contents
  let rowsHtml = '';
  for (const prog of programs) {
    const stats = calculateProgramDays(prog, payload);
    let cols = `
      <td class="sticky-col" style="z-index: 5; white-space: nowrap; font-weight: bold; border-right: 2px solid var(--border);">
        <div style="font-size: 0.85rem;">${esc(prog.name)}</div>
        <div class="text-muted" style="font-size: 0.7rem; font-weight: normal; margin-top: 0.1rem;">
          P: <span style="color: #fb923c; font-weight: bold;">${stats.peak}</span> | 
          A: <span style="color: #94a3b8; font-weight: bold;">${stats.prep}</span> | 
          O: <span>${stats.none}</span>
        </div>
      </td>
    `;

    for (const day of DAYS_OF_2026) {
      const status = getWeekStatus(prog, day.weekNum);
      const colorClass = getCellColorClass(status);
      const racesToday = races.filter((r: any) => r.start_date <= day.dateStr && r.end_date >= day.dateStr);
      const hasRaces = racesToday.length > 0;

      const assignedMapping = raceProgramRaces.find(
        (m: any) => m.program_id === prog.id && racesToday.some((r: any) => r.id === m.race_id)
      );

      let cellContent = '';
      let tdClass = `toggleable-race-cell ${colorClass}`;
      let tdAttrs = `data-day="${day.dateStr}" data-program-id="${prog.id}"`;

      if (assignedMapping) {
        const race = races.find((r: any) => r.id === assignedMapping.race_id);
        const style = resolveRaceCategoryBadgeStyle(race?.category?.name);
        cellContent = `
          <span class="race-id-badge" style="background-color: ${style.background}; border: 1px solid ${style.border}; color: ${style.color};" title="${esc(race?.name)}">
            R${race?.id}
          </span>
        `;
      } else if (hasRaces) {
        cellContent = `<span style="font-size: 0.72rem; color: var(--text-500); opacity: 0.5;">＋</span>`;
      } else {
        tdClass = colorClass;
        tdAttrs = '';
      }

      cols += `<td class="${tdClass}" ${tdAttrs} style="text-align: center; vertical-align: middle; padding: 0.35rem 0;">${cellContent}</td>`;
    }

    rowsHtml += `<tr>${cols}</tr>`;
  }

  return `
    <div class="team-detail-card" style="margin-top: 1rem;">
      <div class="team-detail-table-scroll" style="max-height: 75vh; overflow-x: auto;">
        <table class="data-table data-table-teams race-programs-calendar-table">
          <thead>
            <tr class="month-header-row">${monthCols}</tr>
            <tr>${dayCols}</tr>
            <tr style="background: rgba(148, 163, 184, 0.05);">${raceCountCols}</tr>
            <tr>${r1Cols}</tr>
            <tr>${r2Cols}</tr>
            <tr>${r3Cols}</tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 3. Tab: Peak Editor
function renderTabPeakEditor(payload: any): string {
  const programs = payload.programs;

  const rows = programs.map((prog: any) => {
    // Sort peaks for warning validation
    const sortedPeaks = [
      { min: prog.peak1_min, max: prog.peak1_max },
      { min: prog.peak2_min, max: prog.peak2_max },
      { min: prog.peak3_min, max: prog.peak3_max },
    ].sort((a, b) => a.min - b.min);

    const hasWarning1 = sortedPeaks[1].min - sortedPeaks[0].max < 8;
    const hasWarning2 = sortedPeaks[2].min - sortedPeaks[1].max < 8;
    const triggerWarning = hasWarning1 || hasWarning2;

    const warningHtml = triggerWarning
      ? `<span style="color: #f97316; font-size: 1.1rem; cursor: help;" title="Warnung: Peakbereiche liegen weniger als 8 Wochen auseinander!">⚠️</span>`
      : `<span style="color: #22c55e;">✔ OK</span>`;

    const getPeakInputs = (peakIndex: number) => {
      const minVal = prog[`peak${peakIndex}_min`] ?? 1;
      const maxVal = prog[`peak${peakIndex}_max`] ?? 1;
      return `
        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <input type="number" class="peak-number-input form-control" data-program-id="${prog.id}" data-field="peak${peakIndex}_min" min="1" max="53" value="${minVal}" style="width: 55px; text-align: center; padding: 0.2rem;">
          <span class="text-muted">–</span>
          <input type="number" class="peak-number-input form-control" data-program-id="${prog.id}" data-field="peak${peakIndex}_max" min="1" max="53" value="${maxVal}" style="width: 55px; text-align: center; padding: 0.2rem;">
          <input type="date" class="peak-date-picker form-control" data-program-id="${prog.id}" data-peak="${peakIndex}" style="width: 40px; padding: 0.15rem; font-size: 0.8rem; cursor: pointer;" title="KW aus Datum berechnen (-2/+2 Wochen)">
        </div>
      `;
    };

    return `
      <tr>
        <td style="font-weight: bold; color: var(--text-100);">${prog.id}</td>
        <td style="font-weight: bold; min-width: 150px;">${esc(prog.name)}</td>
        <td>${getPeakInputs(1)}</td>
        <td>${getPeakInputs(2)}</td>
        <td>${getPeakInputs(3)}</td>
        <td style="text-align: center;">${warningHtml}</td>
      </tr>
    `;
  });

  return `
    <div class="team-detail-card" style="margin-top: 1rem;">
      <div class="team-detail-table-scroll" style="max-height: 75vh;">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 50px;">ID</th>
              <th>Programm</th>
              <th>Peak 1 (KW Min / Max)</th>
              <th>Peak 2 (KW Min / Max)</th>
              <th>Peak 3 (KW Min / Max)</th>
              <th style="width: 100px; text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows.join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 4. Tab: Rider-Role Details Popover
function getStagesSummaryForRace(raceId: number, stages: any[]): { countHtml: string; stagesListHtml: string } {
  const raceStages = stages.filter((s: any) => s.race_id === raceId).sort((a: any, b: any) => a.stage_number - b.stage_number);
  
  if (raceStages.length === 0) {
    return { countHtml: 'Keine Etappen', stagesListHtml: 'Keine Etappendaten vorhanden.' };
  }

  // Count profiles
  const profileCounts: Record<string, number> = {};
  for (const s of raceStages) {
    profileCounts[s.profile] = (profileCounts[s.profile] || 0) + 1;
  }

  const sortedProfiles = Object.entries(profileCounts).sort((a, b) => b[1] - a[1]);
  const countHtml = sortedProfiles.map(([profile, count]) => `${esc(profile)}: ${count}x`).join('<br>');

  const stagesListHtml = raceStages.map((s: any) => `
    <div class="popover-stage-row">
      <span class="popover-stage-num">Et. ${s.stage_number}:</span>
      <span class="popover-stage-profile">${esc(s.profile)}</span>
    </div>
  `).join('');

  return { countHtml, stagesListHtml };
}

// 4. Tab: Rider-Role
function renderTabRiderRole(payload: any): string {
  const races = [...payload.races].sort((a: any, b: any) => a.start_date.localeCompare(b.start_date));
  const raceProgramRaces = payload.raceProgramRaces;
  const stages = payload.stages;
  const programDistribution = payload.programDistribution;

  const rows = races.map((race: any) => {
    // 1. Find assigned programs
    const assignedProgramIds = new Set<number>(
      raceProgramRaces.filter((m: any) => m.race_id === race.id).map((m: any) => m.program_id)
    );

    const assignedProgramDistributions = programDistribution.filter((row: any) => assignedProgramIds.has(row.program_id));

    // 2. Sum up counts
    let riderCount = 0;
    let captainCount = 0;
    let coCaptainCount = 0;
    let sprinterCount = 0;
    let eliteHelperCount = 0;
    let strongHelperCount = 0;
    let waterCarrierCount = 0;

    // Detailed splits
    const specCounts: Record<string, Record<string, number>> = {
      Kapitaen: {},
      Co_Kapitaen: {},
      Sprinter: {},
      Edelhelfer: {},
      Starke_Helfer: {},
      Wassertraeger: {},
    };

    const rolesList = ['Kapitaen', 'Co_Kapitaen', 'Sprinter', 'Edelhelfer', 'Starke_Helfer', 'Wassertraeger'];
    const specsList = ['Berg', 'Hill', 'Sprint', 'Timetrial', 'Cobble', 'Attacker'];

    for (const dist of assignedProgramDistributions) {
      riderCount += parseInt(dist.deterministic_rider_count || '0', 10);
      captainCount += parseInt(dist.deterministic_role_Kapitaen || '0', 10);
      coCaptainCount += parseInt(dist.deterministic_role_Co_Kapitaen || '0', 10);
      sprinterCount += parseInt(dist.deterministic_role_Sprinter || '0', 10);
      eliteHelperCount += parseInt(dist.deterministic_role_Edelhelfer || '0', 10);
      strongHelperCount += parseInt(dist.deterministic_role_Starke_Helfer || '0', 10);
      waterCarrierCount += parseInt(dist.deterministic_role_Wassertraeger || '0', 10);

      // Sum detailed specs
      for (const role of rolesList) {
        for (const spec of specsList) {
          const key = `deterministic_${role}_spec1_${spec}`;
          const val = parseInt(dist[key] || '0', 10);
          specCounts[role][spec] = (specCounts[role][spec] || 0) + val;
        }
      }
    }

    // 3. One-Day Profile column content
    let oneDayProfile = '—';
    if (race.is_stage_race === 0) {
      const singleStage = stages.find((s: any) => s.race_id === race.id);
      oneDayProfile = singleStage?.profile ?? 'Flat';
    }

    // 4. Popover details logic for Stage Races
    let popupHtml = '';
    let nameColumnContent = `<strong>${esc(race.name)}</strong>`;
    
    if (race.is_stage_race === 1) {
      const isPopupActive = activePopupRaceId === race.id;
      const { countHtml, stagesListHtml } = getStagesSummaryForRace(race.id, stages);

      popupHtml = `
        <div class="race-stages-popover-card ${isPopupActive ? '' : 'hidden'}">
          <div class="popover-head"><strong>${esc(race.name)}</strong> - Etappen</div>
          <div class="popover-stages-list">${stagesListHtml}</div>
          <div class="popover-separator"></div>
          <div class="popover-head">Profile Zusammenfassung</div>
          <div class="popover-profiles-summary">${countHtml}</div>
        </div>
      `;
      nameColumnContent = `
        <button type="button" class="race-popover-trigger btn-link" data-race-id="${race.id}" style="text-align: left; font-weight: bold; border: none; background: transparent; padding: 0; cursor: pointer; color: var(--accent-h);">
          ${esc(race.name)}
        </button>
      `;
    }

    // 5. Expandable detailed combinations rendering
    // Determine sort order of specs
    let specSortOrder = ['Berg', 'Hill', 'Sprint', 'Cobble', 'Timetrial', 'Attacker']; // default
    if (race.is_stage_race === 0) {
      const singleStage = stages.find((s: any) => s.race_id === race.id);
      const profile = (singleStage?.profile ?? '').toLowerCase();
      if (profile.includes('cobble')) {
        specSortOrder = ['Cobble', 'Sprint', 'Hill', 'Attacker', 'Timetrial', 'Berg'];
      } else if (profile.includes('flat') || profile.includes('rolling')) {
        specSortOrder = ['Sprint', 'Timetrial', 'Attacker', 'Hill', 'Cobble', 'Berg'];
      }
    }

    const combinationRows: string[] = [];
    // Roles order: Kapitän, Co-Kapitän, Sprinter, Edelhelfer, Starke Helfer, Wasserträger
    const sortedRoles = ['Kapitaen', 'Co_Kapitaen', 'Sprinter', 'Edelhelfer', 'Starke_Helfer', 'Wassertraeger'];
    const roleLabels: Record<string, string> = {
      Kapitaen: 'Kapitän',
      Co_Kapitaen: 'Co-Kapitän',
      Sprinter: 'Sprinter',
      Edelhelfer: 'Edelhelfer',
      Starke_Helfer: 'Starke Helfer',
      Wassertraeger: 'Wasserträger',
    };

    const specLabels: Record<string, string> = {
      Berg: 'Berg',
      Hill: 'Hügel',
      Sprint: 'Sprint',
      Cobble: 'Cobble',
      Timetrial: 'Timetrial',
      Attacker: 'Attacker',
    };

    for (const role of sortedRoles) {
      for (const spec of specSortOrder) {
        const count = specCounts[role][spec] ?? 0;
        if (count > 0) {
          combinationRows.push(`
            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem;">
              <span style="color: var(--text-100);">${roleLabels[role]} <span class="text-muted">(${specLabels[spec]})</span></span>
              <strong style="color: var(--accent-h);">${count} fahrer</strong>
            </div>
          `);
        }
      }
    }

    const detailBox = combinationRows.length > 0
      ? combinationRows.join('')
      : `<div class="text-muted" style="padding: 0.5rem; font-size: 0.8rem;">Keine Fahrer zugewiesen.</div>`;

    return `
      <tr style="position: relative;">
        <td style="text-align: center; vertical-align: middle;">
          <button type="button" class="btn btn-sm btn-ghost race-row-expand-btn" data-race-id="${race.id}" style="padding: 0.15rem 0.4rem;">▶</button>
        </td>
        <td>${formatDate(race.start_date)}</td>
        <td class="race-programs-popup-anchor" style="position: relative; vertical-align: middle;">
          ${nameColumnContent}
          ${popupHtml}
        </td>
        <td style="font-weight: bold; color: var(--accent-h); text-align: center;">${oneDayProfile}</td>
        <td style="text-align: center; font-weight: bold; font-variant-numeric: tabular-nums;">${riderCount}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${captainCount}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${coCaptainCount}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${sprinterCount}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${eliteHelperCount}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${strongHelperCount}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${waterCarrierCount}</td>
      </tr>
      <tr id="race-details-row-${race.id}" class="hidden" style="background: rgba(15, 23, 42, 0.45);">
        <td colspan="11" style="padding: 0.5rem 1.5rem;">
          <div style="max-width: 450px; background: var(--bg-800); border: 1px solid var(--border); border-radius: var(--radius-sm); box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);">
            <div style="padding: 0.4rem 0.6rem; border-bottom: 1px solid var(--border); font-size: 0.8rem; font-weight: bold; background: rgba(99,102,241,0.08); color: var(--text-100);">Zusammensetzung (Rolle / Spezialisierung)</div>
            ${detailBox}
          </div>
        </td>
      </tr>
    `;
  });

  return `
    <div class="team-detail-card" style="margin-top: 1rem; position: relative;">
      <div class="team-detail-table-scroll" style="max-height: 75vh;">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 40px;"></th>
              <th>Startdatum</th>
              <th>Rennen</th>
              <th style="text-align: center;">Profil (1-Day)</th>
              <th style="text-align: center;">Fahrer gesamt</th>
              <th style="text-align: center;">Kapitän</th>
              <th style="text-align: center;">Co-Kapitän</th>
              <th style="text-align: center;">Sprinter</th>
              <th style="text-align: center;">Edelhelfer</th>
              <th style="text-align: center;">Starke Helfer</th>
              <th style="text-align: center;">Wasserträger</th>
            </tr>
          </thead>
          <tbody>
            ${rows.join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
