import { api } from '../api';
import {
  $,
  esc,
  state,
  formatDate,
} from '../state';
import { resolveRaceCategoryBadgeStyle } from '../riderStatsUi';

let activePopupRaceId: number | null = null;
let activeRiderCountPopupRaceId: number | null = null;
let programRolesSortKey = 'id';
let programRolesSortAsc = true;

// Global filter states
let filterSpecs: Record<string, boolean> = { B: true, H: true, P: true, S: true, T: true, A: true };
let filterVariants: Record<number, boolean> = {
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
};
let popoverShowV1_3 = true;
let popoverShowV4_6 = true;

// Helper to extract variant suffix from program name (e.g. 1 from SHP_1)
function getProgramVariant(name: string): number {
  const parts = name.split('_');
  const last = parts[parts.length - 1];
  const v = parseInt(last, 10);
  return isNaN(v) ? 1 : v;
}

// Helper to extract the character at pos (1-indexed) in the prefix (e.g. S at pos 1 for SHP_1)
function getLetterAt(name: string, pos: number): string {
  const prefix = name.split('_')[0] || '';
  return prefix.charAt(pos - 1) || '';
}

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

function isRaceInActivePhase(program: any, race: any): boolean {
  const start = new Date(race.start_date);
  const end = new Date(race.end_date);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const kw = getWeekNumber(dateStr);
    const status = getWeekStatus(program, kw);
    if (status === 'peak' || status === 'prep') {
      return true;
    }
  }
  return false;
}

function isWeekInPeakOr6WeeksAnstieg(program: any, W: number): boolean {
  const isPeak =
    (W >= program.peak1_min && W <= program.peak1_max) ||
    (W >= program.peak2_min && W <= program.peak2_max) ||
    (W >= program.peak3_min && W <= program.peak3_max);

  if (isPeak) return true;

  const checkAnstieg = (peak_min: number) => {
    const start = peak_min - 6;
    const end = peak_min - 1;
    if (start >= 1) {
      return W >= start && W <= end;
    } else {
      const wrappedStart = start + 53;
      return W >= wrappedStart || W <= end;
    }
  };

  return checkAnstieg(program.peak1_min) || checkAnstieg(program.peak2_min) || checkAnstieg(program.peak3_min);
}

function isRaceInPeakOr6WeeksAnstieg(program: any, race: any): boolean {
  const start = new Date(race.start_date);
  const end = new Date(race.end_date);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const kw = getWeekNumber(dateStr);
    if (isWeekInPeakOr6WeeksAnstieg(program, kw)) {
      return true;
    }
  }
  return false;
}

function getProgramDaysPerPhase(program: any, assignedRaceIds: Set<number>, payload: any): { phase1: number; phase2: number; phase3: number; phase4: number } {
  const peaks = [
    { min: program.peak1_min, max: program.peak1_max },
    { min: program.peak2_min, max: program.peak2_max },
    { min: program.peak3_min, max: program.peak3_max }
  ].sort((a, b) => a.min - b.min);

  let phase1 = 0;
  let phase2 = 0;
  let phase3 = 0;
  let phase4 = 0;

  const assignedRaces = payload.races.filter((r: any) => assignedRaceIds.has(r.id));

  for (const race of assignedRaces) {
    const start = new Date(race.start_date);
    const end = new Date(race.end_date);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const kw = getWeekNumber(dateStr);

      if (kw <= peaks[0].max) {
        phase1++;
      } else if (kw <= peaks[1].max) {
        phase2++;
      } else if (kw <= peaks[2].max) {
        phase3++;
      } else {
        phase4++;
      }
    }
  }

  return { phase1, phase2, phase3, phase4 };
}

function checkCanAssignProgram(program: any, race: any, payload: any): boolean {
  const assignedRaceIds = new Set<number>(
    payload.raceProgramRaces
      .filter((m: any) => m.program_id === program.id && m.race_id !== race.id)
      .map((m: any) => m.race_id)
  );

  const daysPerPhase = getProgramDaysPerPhase(program, assignedRaceIds, payload);

  const touchedPhases = new Set<string>();
  const start = new Date(race.start_date);
  const end = new Date(race.end_date);
  
  const peaks = [
    { min: program.peak1_min, max: program.peak1_max },
    { min: program.peak2_min, max: program.peak2_max },
    { min: program.peak3_min, max: program.peak3_max }
  ].sort((a, b) => a.min - b.min);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const kw = getWeekNumber(dateStr);

    if (kw <= peaks[0].max) {
      touchedPhases.add('phase1');
    } else if (kw <= peaks[1].max) {
      touchedPhases.add('phase2');
    } else if (kw <= peaks[2].max) {
      touchedPhases.add('phase3');
    } else {
      touchedPhases.add('phase4');
    }
  }

  const isStageRace = race.is_stage_race === 1;

  for (const phase of touchedPhases) {
    if (phase === 'phase1') {
      if (isStageRace && daysPerPhase.phase1 > 35) return false;
      if (!isStageRace && daysPerPhase.phase1 > 36) return false;
    } else if (phase === 'phase2') {
      if (isStageRace && daysPerPhase.phase2 > 35) return false;
      if (!isStageRace && daysPerPhase.phase2 > 36) return false;
    } else if (phase === 'phase3') {
      if (isStageRace && daysPerPhase.phase3 > 35) return false;
      if (!isStageRace && daysPerPhase.phase3 > 36) return false;
    }
  }

  return true;
}

function toggleProgramRaceDirect(programId: number, raceId: number): void {
  const payload = state.raceProgramsPayload;
  if (!payload) return;

  const idx = payload.raceProgramRaces.findIndex(
    (m: any) => m.program_id === programId && m.race_id === raceId
  );

  if (idx === -1) {
    const targetRace = payload.races.find((r: any) => r.id === raceId);
    if (targetRace) {
      const start = targetRace.start_date;
      const end = targetRace.end_date;

      // Find all overlapping assignments for this program (excluding the same race)
      const toRemove: number[] = [];
      payload.raceProgramRaces.forEach((m: any, index: number) => {
        if (m.program_id === programId && m.race_id !== raceId) {
          const otherRace = payload.races.find((r: any) => r.id === m.race_id);
          if (otherRace) {
            const overlap = otherRace.start_date <= end && otherRace.end_date >= start;
            if (overlap) {
              toRemove.push(index);
            }
          }
        }
      });

      // Remove overlapping assignments in reverse order
      toRemove.sort((a, b) => b - a).forEach((index) => {
        payload.raceProgramRaces.splice(index, 1);
      });
    }

    // Add new assignment
    payload.raceProgramRaces.push({
      program_id: programId,
      race_id: raceId,
    });
  } else {
    payload.raceProgramRaces.splice(idx, 1);
  }

  state.raceProgramsDirty = true;
  renderRacePrograms();
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
  activePopupRaceId = null;
  activeRiderCountPopupRaceId = null;
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

    // Expandable program row details
    const progExpandBtn = target.closest<HTMLElement>('.program-row-expand-btn');
    if (progExpandBtn) {
      const programId = progExpandBtn.dataset['programId'];
      const detailsRow = $(`program-details-row-${programId}`);
      if (detailsRow) {
        detailsRow.classList.toggle('hidden');
        progExpandBtn.textContent = detailsRow.classList.contains('hidden') ? '▶' : '▼';
      }
      return;
    }

    // Click on sort headers in Tab 5 (Programm-Rollen)
    const sortHeader = target.closest<HTMLElement>('.program-roles-sort-header');
    if (sortHeader) {
      const key = sortHeader.dataset['sortKey']!;
      if (programRolesSortKey === key) {
        programRolesSortAsc = !programRolesSortAsc;
      } else {
        programRolesSortKey = key;
        programRolesSortAsc = key === 'name' || key === 'id'; // default asc for name/id, desc for counts
      }
      renderRacePrograms();
      return;
    }

    // Click on combo count to toggle origin info
    const originTrigger = target.closest<HTMLElement>('.combo-origin-trigger');
    if (originTrigger) {
      const raceId = originTrigger.dataset['raceId'];
      const comboKey = originTrigger.dataset['comboKey'];
      const detailsEl = $(`combo-origin-${raceId}-${comboKey}`);
      if (detailsEl) {
        detailsEl.classList.toggle('hidden');
      }
      return;
    }

    // Stage Race Click for stages popover
    const racePopoverBtn = target.closest<HTMLButtonElement>('.race-popover-trigger');
    if (racePopoverBtn) {
      event.stopPropagation();
      const raceId = parseInt(racePopoverBtn.dataset['raceId'] ?? '0', 10);
      activeRiderCountPopupRaceId = null;
      if (activePopupRaceId === raceId) {
        activePopupRaceId = null;
      } else {
        activePopupRaceId = raceId;
      }
      renderRacePrograms();
      return;
    }

    // Click for rider count program popover
    const riderCountPopoverBtn = target.closest<HTMLButtonElement>('.race-rider-count-trigger');
    if (riderCountPopoverBtn) {
      event.stopPropagation();
      const raceId = parseInt(riderCountPopoverBtn.dataset['raceId'] ?? '0', 10);
      activePopupRaceId = null;
      if (activeRiderCountPopupRaceId === raceId) {
        activeRiderCountPopupRaceId = null;
      } else {
        activeRiderCountPopupRaceId = raceId;
      }
      renderRacePrograms();
      return;
    }

    // Toggle program assignment inside the rider count popover
    const progToggle = target.closest<HTMLElement>('.popover-program-toggle');
    if (progToggle) {
      event.stopPropagation();
      if (progToggle.classList.contains('disabled')) {
        return;
      }
      const programId = parseInt(progToggle.dataset['programId'] ?? '0', 10);
      const raceId = parseInt(progToggle.dataset['raceId'] ?? '0', 10);
      toggleProgramRaceDirect(programId, raceId);
      return;
    }

    // Close popover when clicking anywhere else
    if (!target.closest('.race-stages-popover-card') && !target.closest('.race-rider-programs-popover-card')) {
      if (activePopupRaceId !== null || activeRiderCountPopupRaceId !== null) {
        activePopupRaceId = null;
        activeRiderCountPopupRaceId = null;
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

  // Listen for checkbox changes in filter card and popover filters
  $('view-race-programs').addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    if (target.classList.contains('filter-spec-checkbox')) {
      const spec = target.dataset['spec']!;
      filterSpecs[spec] = target.checked;
      renderRacePrograms();
      return;
    }
    if (target.classList.contains('filter-variant-checkbox')) {
      const variant = parseInt(target.dataset['variant']!, 10);
      filterVariants[variant] = target.checked;
      renderRacePrograms();
      return;
    }
    if (target.classList.contains('filter-group-checkbox')) {
      const group = target.dataset['group'];
      if (group === '1-3') {
        filterVariants[1] = target.checked;
        filterVariants[2] = target.checked;
        filterVariants[3] = target.checked;
      } else if (group === '4-6') {
        filterVariants[4] = target.checked;
        filterVariants[5] = target.checked;
        filterVariants[6] = target.checked;
      }
      renderRacePrograms();
      return;
    }
    if (target.classList.contains('popover-filter-v13')) {
      popoverShowV1_3 = target.checked;
      renderRacePrograms();
      return;
    }
    if (target.classList.contains('popover-filter-v46')) {
      popoverShowV4_6 = target.checked;
      renderRacePrograms();
      return;
    }
  });
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

  // Save scroll positions
  const savedWindowX = window.scrollX;
  const savedWindowY = window.scrollY;

  const scrollPositions: Record<string, { scrollTop: number; scrollLeft: number }> = {};

  const tableScroll = document.querySelector('.team-detail-table-scroll');
  if (tableScroll) {
    scrollPositions['table'] = {
      scrollTop: tableScroll.scrollTop,
      scrollLeft: tableScroll.scrollLeft
    };
  }

  const popoverScrolls = document.querySelectorAll('.popover-program-list-scroll');
  popoverScrolls.forEach((el) => {
    const raceId = el.getAttribute('data-race-id');
    if (raceId) {
      scrollPositions[`popover-${raceId}`] = {
        scrollTop: el.scrollTop,
        scrollLeft: el.scrollLeft
      };
    }
  });

  const dirtyCount = state.raceProgramsDirty;
  const isSaving = state.raceProgramsSaving;
  const activeTab = state.raceProgramsActiveTab;

function renderFilterCard(): string {
  return `
    <div class="race-programs-filters-card" style="margin-top: 1rem; padding: 0.8rem; background: var(--bg-800); border: 1px solid var(--border); border-radius: var(--radius-md);">
      <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
        
        <!-- Spec Filters -->
        <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
          <span style="font-weight: bold; font-size: 0.85rem; color: var(--text-300);">Spezialisierungen:</span>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="checkbox" class="filter-spec-checkbox" data-spec="B" ${filterSpecs.B ? 'checked' : ''}> B (Berg)
          </label>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="checkbox" class="filter-spec-checkbox" data-spec="H" ${filterSpecs.H ? 'checked' : ''}> H (Hügel)
          </label>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="checkbox" class="filter-spec-checkbox" data-spec="P" ${filterSpecs.P ? 'checked' : ''}> P (Pflaster)
          </label>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="checkbox" class="filter-spec-checkbox" data-spec="S" ${filterSpecs.S ? 'checked' : ''}> S (Sprint)
          </label>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="checkbox" class="filter-spec-checkbox" data-spec="T" ${filterSpecs.T ? 'checked' : ''}> T (Zeitfahren)
          </label>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="checkbox" class="filter-spec-checkbox" data-spec="A" ${filterSpecs.A ? 'checked' : ''}> A (Attacker)
          </label>
        </div>

        <!-- Variant Filters -->
        <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
          <span style="font-weight: bold; font-size: 0.85rem; color: var(--text-300);">Varianten:</span>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="checkbox" class="filter-variant-checkbox" data-variant="1" ${filterVariants[1] ? 'checked' : ''}> 1
          </label>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="checkbox" class="filter-variant-checkbox" data-variant="2" ${filterVariants[2] ? 'checked' : ''}> 2
          </label>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="checkbox" class="filter-variant-checkbox" data-variant="3" ${filterVariants[3] ? 'checked' : ''}> 3
          </label>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="checkbox" class="filter-variant-checkbox" data-variant="4" ${filterVariants[4] ? 'checked' : ''}> 4
          </label>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="checkbox" class="filter-variant-checkbox" data-variant="5" ${filterVariants[5] ? 'checked' : ''}> 5
          </label>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="checkbox" class="filter-variant-checkbox" data-variant="6" ${filterVariants[6] ? 'checked' : ''}> 6
          </label>
        </div>

        <!-- Bulk Variant Groups -->
        <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
          <span style="font-weight: bold; font-size: 0.85rem; color: var(--text-300);">Gruppen:</span>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="checkbox" class="filter-group-checkbox" data-group="1-3" ${filterVariants[1] && filterVariants[2] && filterVariants[3] ? 'checked' : ''}> Varianten 1-3
          </label>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="checkbox" class="filter-group-checkbox" data-group="4-6" ${filterVariants[4] && filterVariants[5] && filterVariants[6] ? 'checked' : ''}> Varianten 4-6
          </label>
        </div>

      </div>
    </div>
  `;
}

  // Tab Header HTML
  let html = `
    <div class="race-programs-layout">
      <div class="race-programs-toolbar">
        <div class="results-type-tabs" style="margin: 0;">
          <button class="results-type-btn${activeTab === 'calendar-cols' ? ' active' : ''}" data-tab="calendar-cols">Kalender Programme (Spalten)</button>
          <button class="results-type-btn${activeTab === 'calendar-rows' ? ' active' : ''}" data-tab="calendar-rows">Kalender Programme (Zeilen)</button>
          <button class="results-type-btn${activeTab === 'rider-role' ? ' active' : ''}" data-tab="rider-role">Rider-Role Programme</button>
          <button class="results-type-btn${activeTab === 'program-roles' ? ' active' : ''}" data-tab="program-roles">Programm-Rollen</button>
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
    html += renderFilterCard();
    html += renderTabCalendarCols(payload);
  } else if (activeTab === 'calendar-rows') {
    html += renderFilterCard();
    html += renderTabCalendarRows(payload);
  } else if (activeTab === 'rider-role') {
    html += renderTabRiderRole(payload);
  } else if (activeTab === 'program-roles') {
    html += renderTabProgramRoles(payload);
  }

  html += `</div>`;
  root.innerHTML = html;

  // Restore scroll positions
  const newTableScroll = document.querySelector('.team-detail-table-scroll');
  if (newTableScroll && scrollPositions['table']) {
    newTableScroll.scrollTop = scrollPositions['table'].scrollTop;
    newTableScroll.scrollLeft = scrollPositions['table'].scrollLeft;
  }

  const newPopoverScrolls = document.querySelectorAll('.popover-program-list-scroll');
  newPopoverScrolls.forEach((el) => {
    const raceId = el.getAttribute('data-race-id');
    if (raceId && scrollPositions[`popover-${raceId}`]) {
      el.scrollTop = scrollPositions[`popover-${raceId}`].scrollTop;
      el.scrollLeft = scrollPositions[`popover-${raceId}`].scrollLeft;
    }
  });

  window.scrollTo(savedWindowX, savedWindowY);
}

// 1. Tab: Calendar Programs (Columns)
function renderTabCalendarCols(payload: any): string {
  const allPrograms = payload.programs;
  const raceProgramRaces = payload.raceProgramRaces;
  const races = payload.races;
  const programDistribution = payload.programDistribution;

  const programs = allPrograms.filter((p: any) => {
    const hasSpec = (p.name.includes('B') && filterSpecs.B) ||
                    (p.name.includes('H') && filterSpecs.H) ||
                    (p.name.includes('P') && filterSpecs.P) ||
                    (p.name.includes('S') && filterSpecs.S) ||
                    (p.name.includes('T') && filterSpecs.T) ||
                    (p.name.includes('A') && filterSpecs.A);
    const variant = getProgramVariant(p.name);
    return hasSpec && filterVariants[variant];
  });

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
    const dist = programDistribution.find((row: any) => row.program_id === prog.id);
    const riderCount = dist ? parseInt(dist.deterministic_rider_count || '0', 10) : 0;
    headerRow += `
      <th style="min-width: 140px; text-align: center;">
        <div style="font-weight: bold; font-size: 0.9rem;">${esc(prog.name)} (${riderCount} F)</div>
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

    let raceBadges = '';
    if (hasRaces) {
      raceBadges = '<div style="display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.15rem;">';
      for (const r of racesToday) {
        const rStyle = resolveRaceCategoryBadgeStyle(r.category?.name);
        raceBadges += `
          <span class="race-id-badge" style="background-color: ${rStyle.background}; border: 1px solid ${rStyle.border}; color: ${rStyle.color}; font-size: 0.65rem; padding: 0.05rem 0.2rem; text-align: left; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;" title="${esc(r.name)}">
            ${esc(r.name)}
          </span>
        `;
      }
      raceBadges += '</div>';
    }

    let cols = `
      <td class="sticky-col ${rowClass}" style="font-weight: 600; vertical-align: top; padding: 0.4rem 0.6rem;">
        <div>${day.label}</div>
        ${raceBadges}
      </td>
      <td style="text-align: center; color: var(--text-500); font-variant-numeric: tabular-nums; vertical-align: top; padding-top: 0.4rem;">${day.weekNum}</td>
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
  const allPrograms = payload.programs;
  const raceProgramRaces = payload.raceProgramRaces;
  const races = payload.races;
  const programDistribution = payload.programDistribution;

  const programs = allPrograms.filter((p: any) => {
    const hasSpec = (p.name.includes('B') && filterSpecs.B) ||
                    (p.name.includes('H') && filterSpecs.H) ||
                    (p.name.includes('P') && filterSpecs.P) ||
                    (p.name.includes('S') && filterSpecs.S) ||
                    (p.name.includes('T') && filterSpecs.T) ||
                    (p.name.includes('A') && filterSpecs.A);
    const variant = getProgramVariant(p.name);
    return hasSpec && filterVariants[variant];
  });

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
    const dist = programDistribution.find((row: any) => row.program_id === prog.id);
    const riderCount = dist ? parseInt(dist.deterministic_rider_count || '0', 10) : 0;
    let cols = `
      <td class="sticky-col" style="z-index: 5; white-space: nowrap; font-weight: bold; border-right: 2px solid var(--border);">
        <div style="font-size: 0.85rem;">${esc(prog.name)} (${riderCount} F)</div>
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

    let targetLetter: 'P' | 'S' | 'H' | 'B' | 'T' | null = null;
    if (race.is_stage_race === 0) {
      const singleStage = stages.find((s: any) => s.race_id === race.id);
      const profile = (singleStage?.profile ?? '').toLowerCase();
      if (profile === 'cobble' || profile === 'cobble_hill' || profile === 'cobblehill') {
        targetLetter = 'P';
      } else if (profile === 'flat' || profile === 'rolling') {
        targetLetter = 'S';
      } else if (profile === 'hilly' || profile === 'hilly_difficult') {
        targetLetter = 'H';
      } else if (profile === 'medium_mountain' || profile === 'high_mountain' || profile === 'mountain') {
        targetLetter = 'B';
      } else if (profile === 'itt' || profile === 'ttt') {
        targetLetter = 'T';
      }
    }

    const programItems = payload.programs.map((p: any) => {
      const isAssigned = raceProgramRaces.some((m: any) => m.program_id === p.id && m.race_id === race.id);
      const dist = programDistribution.find((row: any) => row.program_id === p.id);
      
      const count = dist ? parseInt(dist.deterministic_rider_count || '0', 10) : 0;
      
      const capt = dist ? parseInt(dist.deterministic_role_Kapitaen || '0', 10) : 0;
      const coCapt = dist ? parseInt(dist.deterministic_role_Co_Kapitaen || '0', 10) : 0;
      const elite = dist ? parseInt(dist.deterministic_role_Edelhelfer || '0', 10) : 0;
      const strong = dist ? parseInt(dist.deterministic_role_Starke_Helfer || '0', 10) : 0;
      const water = dist ? parseInt(dist.deterministic_role_Wassertraeger || '0', 10) : 0;
      const sprint = dist ? parseInt(dist.deterministic_role_Sprinter || '0', 10) : 0;

      const rolesDesc: string[] = [];
      if (capt > 0) rolesDesc.push(`${capt} Kapitän`);
      if (coCapt > 0) rolesDesc.push(`${coCapt} Co-Kapitän`);
      if (elite > 0) rolesDesc.push(`${elite} Edelhelfer`);
      if (strong > 0) rolesDesc.push(`${strong} Starke Helfer`);
      if (water > 0) rolesDesc.push(`${water} Wasserträger`);
      if (sprint > 0) rolesDesc.push(`${sprint} Sprinter`);
      const rolesStr = rolesDesc.length > 0 ? `(${rolesDesc.join(', ')})` : '';

      const stats = calculateProgramDays(p, payload);
      const totalDays = stats.peak + stats.prep + stats.none;

      return {
        program: p,
        isAssigned,
        count,
        rolesStr,
        totalDays,
      };
    });

    if (targetLetter !== null) {
      const targetL = targetLetter; // local binding for type inference
      programItems.sort((a: any, b: any) => {
        let bucketA = 3;
        if (getLetterAt(a.program.name, 1) === targetL) bucketA = 0;
        else if (getLetterAt(a.program.name, 2) === targetL) bucketA = 1;
        else if (getLetterAt(a.program.name, 3) === targetL) bucketA = 2;

        let bucketB = 3;
        if (getLetterAt(b.program.name, 1) === targetL) bucketB = 0;
        else if (getLetterAt(b.program.name, 2) === targetL) bucketB = 1;
        else if (getLetterAt(b.program.name, 3) === targetL) bucketB = 2;

        if (bucketA !== bucketB) {
          return bucketA - bucketB;
        }
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        const varA = getProgramVariant(a.program.name);
        const varB = getProgramVariant(b.program.name);
        if (varA !== varB) {
          return varA - varB;
        }
        return a.program.id - b.program.id;
      });
    } else {
      programItems.sort((a: any, b: any) => {
        if (a.isAssigned !== b.isAssigned) {
          return a.isAssigned ? -1 : 1;
        }
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        const varA = getProgramVariant(a.program.name);
        const varB = getProgramVariant(b.program.name);
        if (varA !== varB) {
          return varA - varB;
        }
        return a.program.id - b.program.id;
      });
    }

    const filteredProgramItems = programItems.filter((item: any) => {
      const variant = getProgramVariant(item.program.name);
      if (variant >= 1 && variant <= 3 && !popoverShowV1_3) return false;
      if (variant >= 4 && variant <= 6 && !popoverShowV4_6) return false;
      return true;
    });

    const programItemsHtml = filteredProgramItems.map((item: any) => {
      const p = item.program;
      const inActive = isRaceInActivePhase(p, race);
      
      let warnHtml = '';
      if (!inActive) {
        warnHtml = `<span style="color: #fb923c; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(251, 146, 60, 0.15); border: 1px solid #fb923c; border-radius: 50%; font-size: 0.65rem;" title="Dieses Rennen liegt außerhalb der Peak- und Aufbauphase dieses Programms!">!</span>`;
      }

      let purpleWarnHtml = '';
      const inPeakOr6Weeks = isRaceInPeakOr6WeeksAnstieg(p, race);
      if (!inPeakOr6Weeks) {
        purpleWarnHtml = `<span style="color: #c084fc; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(192, 132, 252, 0.15); border: 1px solid #c084fc; border-radius: 50%; font-size: 0.65rem;" title="Dieses Rennen liegt außerhalb des Peakbereichs und der 6-wöchigen Anstiegsphase dieses Programms!">!</span>`;
      }

      let blueWarnHtml = '';
      const canAssign = checkCanAssignProgram(p, race, payload);
      if (!canAssign) {
        blueWarnHtml = `<span style="color: #38bdf8; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; border-radius: 50%; font-size: 0.65rem;" title="Achtung: Dieses Programm hat in diesem Saisonabschnitt bereits das Limit an Renntagen erreicht (max. 36 Tage bzw. 35 Tage für Rundfahrten)!">!</span>`;
      }

      let conflictHtml = '';
      if (!item.isAssigned) {
        const otherAssignments = raceProgramRaces.filter((m: any) => m.program_id === p.id && m.race_id !== race.id);
        const overlappingRaces = otherAssignments
          .map((m: any) => payload.races.find((r: any) => r.id === m.race_id))
          .filter((r: any) => r && r.start_date <= race.end_date && r.end_date >= race.start_date);
        
        if (overlappingRaces.length > 0) {
          const raceNames = overlappingRaces.map((r: any) => r.name).join(', ');
          conflictHtml = `<span style="color: #ef4444; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 50%; font-size: 0.65rem;" title="Kollision: Dieses Programm ist bereits einem zeitlich parallelen Rennen zugewiesen: ${esc(raceNames)}!">!</span>`;
        }
      }

      const variant = getProgramVariant(p.name);
      const colorVal = (variant >= 1 && variant <= 3) ? '#f97316' : '#22c55e';
      const activeStyle = item.isAssigned ? `font-weight: bold; color: ${colorVal}; text-shadow: 0 0 1px ${colorVal};` : `color: ${colorVal}; opacity: 0.75;`;
      const checkboxText = item.isAssigned ? '☑' : '☐';

      const isSelectable = true;
      const pointerStyle = 'cursor: pointer;';
      const extraClass = '';

      return `
        <div class="popover-program-toggle${extraClass}" data-program-id="${p.id}" data-race-id="${race.id}" 
             style="${pointerStyle} padding: 0.45rem 0.6rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); transition: background-color 0.15s; white-space: nowrap;"
             onmouseover="this.style.backgroundColor='rgba(99, 102, 241, 0.08)'"
             onmouseout="this.style.backgroundColor='transparent'">
          <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; overflow: hidden;">
            <span style="font-size: 1.15rem; line-height: 1; user-select: none; color: ${item.isAssigned ? 'var(--accent-h)' : 'var(--text-500)'};">${checkboxText}</span>
            <span style="${activeStyle} font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis;" title="${esc(p.name)} (${item.totalDays} Renntage)">
              ${esc(p.name)} (${item.totalDays} RT)
            </span>
            ${warnHtml}
            ${purpleWarnHtml}
            ${blueWarnHtml}
            ${conflictHtml}
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0;">
            <strong style="font-size: 0.8rem; color: var(--accent-h);">${item.count} Fahrer</strong>
            <span style="font-size: 0.72rem; color: var(--text-500); font-weight: normal;" title="${esc(item.rolesStr)}">${esc(item.rolesStr)}</span>
          </div>
        </div>
      `;
    }).join('');

    const isRiderPopupActive = activeRiderCountPopupRaceId === race.id;

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

    // Check stage race flat/rolling count
    let flatRollingStagesCount = 0;
    if (race.is_stage_race === 1) {
      const raceStages = stages.filter((s: any) => s.race_id === race.id);
      flatRollingStagesCount = raceStages.filter((s: any) => {
        const p = (s.profile || '').toLowerCase();
        return p === 'flat' || p === 'rolling';
      }).length;
    }

    // Check one-day cobble count
    let isCobbleRace = false;
    let cobbleRidersCount = 0;
    if (race.is_stage_race === 0) {
      const singleStage = stages.find((s: any) => s.race_id === race.id);
      const profile = (singleStage?.profile || '').toLowerCase();
      isCobbleRace = profile === 'cobble' || profile === 'cobble_hill';

      if (isCobbleRace) {
        // Count assigned riders with spec1, spec2 or spec3 === 'Cobble'
        const roleSpecCombosFiltered = (payload.roleSpecCombinations || []).filter((c: any) => assignedProgramIds.has(c.program_id));
        cobbleRidersCount = roleSpecCombosFiltered
          .filter((c: any) => c.spec1 === 'Cobble' || c.spec2 === 'Cobble' || c.spec3 === 'Cobble')
          .reduce((sum: number, c: any) => sum + c.count, 0);
      }
    }

    // Header for rider program popover including warning for cobble count
    let popoverTitleHtml = '<strong>Rennprogramme verwalten</strong>';
    if (race.is_stage_race === 0 && isCobbleRace) {
      const totalRidersColor = cobbleRidersCount < 20 ? '#ef4444' : 'var(--accent-h)';
      popoverTitleHtml = `
        <strong>Rennprogramme verwalten 
          (<span style="color: ${totalRidersColor}; font-weight: bold;" title="Kopfsteinpflaster-Spezialisten: ${cobbleRidersCount} / min. 20">Gesamtfahrer: ${riderCount}</span>)
        </strong>
      `;
    } else {
      popoverTitleHtml = `<strong>Rennprogramme verwalten (Gesamtfahrer: ${riderCount})</strong>`;
    }

    const riderCountPopupHtml = `
      <div class="race-rider-programs-popover-card ${isRiderPopupActive ? '' : 'hidden'}"
           style="position: absolute; top: calc(100% + 0.45rem); right: 0; z-index: 120; min-width: 600px; max-width: 750px; padding: 0.8rem 0.9rem; border: 1px solid rgba(148, 163, 184, 0.18); border-radius: var(--radius-md); background: linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 0.98) 100%); box-shadow: var(--shadow); text-align: left; font-weight: normal;">
        <div class="popover-head" style="border-bottom: 1px solid rgba(148, 163, 184, 0.12); padding-bottom: 0.4rem; margin-bottom: 0.4rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          ${popoverTitleHtml}
          <div style="display: flex; gap: 0.8rem; font-size: 0.75rem; align-items: center;">
            <label style="display: inline-flex; align-items: center; gap: 0.2rem; cursor: pointer; user-select: none; margin: 0;">
              <input type="checkbox" class="popover-filter-v13" ${popoverShowV1_3 ? 'checked' : ''}> v1-3
            </label>
            <label style="display: inline-flex; align-items: center; gap: 0.2rem; cursor: pointer; user-select: none; margin: 0;">
              <input type="checkbox" class="popover-filter-v46" ${popoverShowV4_6 ? 'checked' : ''}> v4-6
            </label>
          </div>
        </div>
        <div class="popover-program-list-scroll" data-race-id="${race.id}" style="display: flex; flex-direction: column; gap: 0.2rem; max-height: 350px; overflow-y: auto;">
          ${programItemsHtml}
        </div>
      </div>
    `;

    let sprinterCellStyle = 'text-align: center; font-variant-numeric: tabular-nums;';
    if (race.is_stage_race === 1 && flatRollingStagesCount >= 2) {
      if (sprinterCount <= 7) {
        sprinterCellStyle += ' background-color: rgba(239, 68, 68, 0.2); color: #ef4444; font-weight: bold;';
      } else if (sprinterCount > 7 && sprinterCount < 10) {
        sprinterCellStyle += ' background-color: rgba(234, 179, 8, 0.2); color: #eab308; font-weight: bold;';
      }
    }

    let riderCountCellStyle = 'position: relative; text-align: center; font-variant-numeric: tabular-nums; vertical-align: middle;';
    let riderCountBtnStyle = 'font-weight: bold; border: none; background: transparent; padding: 0.15rem 0.4rem; cursor: pointer; color: var(--accent-h); text-decoration: underline;';
    if (race.is_stage_race === 0 && isCobbleRace && cobbleRidersCount < 20) {
      riderCountCellStyle += ' background-color: rgba(239, 68, 68, 0.2);';
      riderCountBtnStyle += ' color: #ef4444; font-weight: bold;';
    }

    const riderCountTrigger = `
      <button type="button" class="race-rider-count-trigger btn-link" data-race-id="${race.id}" 
              style="${riderCountBtnStyle}">
        ${riderCount}
      </button>
    `;

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

    const roleSpecCombosFiltered = (payload.roleSpecCombinations || []).filter((c: any) => assignedProgramIds.has(c.program_id));

    const comboMap = new Map<string, number>();
    for (const item of roleSpecCombosFiltered) {
      const spec2Val = item.spec2 || '—';
      const key = `${item.role}|${item.spec1}|${spec2Val}`;
      comboMap.set(key, (comboMap.get(key) || 0) + item.count);
    }

    const sortedCombos = [...comboMap.entries()].map(([key, count]) => {
      const [role, spec1, spec2] = key.split('|');
      return { role, spec1, spec2, count };
    }).sort((a, b) => {
      const roleDiff = sortedRoles.indexOf(a.role) - sortedRoles.indexOf(b.role);
      if (roleDiff !== 0) return roleDiff;

      const specDiff = specSortOrder.indexOf(a.spec1) - specSortOrder.indexOf(b.spec1);
      if (specDiff !== 0) return specDiff;

      return b.count - a.count;
    });

    const translateSpecs = (spec1: string, spec2: string) => {
      const s1 = specLabels[spec1] ?? spec1;
      const s2 = spec2 !== '—' ? (specLabels[spec2] ?? spec2) : '—';
      return `${s1} / ${s2}`;
    };

    for (const combo of sortedCombos) {
      if (combo.count > 0) {
        const isOrange = (combo.spec1 === 'Berg' && combo.spec2 === 'Cobble') || (combo.spec1 === 'Cobble' && combo.spec2 === 'Berg');
        const itemStyle = isOrange
          ? 'display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem; background: rgba(249, 115, 22, 0.12); color: #f97316;'
          : 'display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem;';
        const textStyle = isOrange ? 'color: #f97316; font-weight: bold;' : 'color: var(--text-100);';
        const countStyle = isOrange ? 'color: #f97316; font-weight: bold;' : 'color: var(--accent-h);';

        const cleanKey = `${combo.role}_${combo.spec1}_${combo.spec2.replace(/[^a-zA-Z0-9]/g, '_')}`;

        // Find which programs these riders belong to
        const origins = roleSpecCombosFiltered.filter((c: any) => {
          return c.role === combo.role && c.spec1 === combo.spec1 && (c.spec2 || '—') === combo.spec2;
        });

        const originDetails = origins.map((c: any) => {
          const prog = payload.programs.find((p: any) => p.id === c.program_id);
          return `<span style="white-space: nowrap; margin-right: 0.8rem;">${esc(prog?.name ?? 'Unbekannt')}: <strong>${c.count}</strong></span>`;
        }).join(' ');

        combinationRows.push(`
          <div style="${itemStyle}">
            <span style="${textStyle}">${roleLabels[combo.role] || combo.role} <span class="text-muted">(${translateSpecs(combo.spec1, combo.spec2)})</span></span>
            <strong style="${countStyle} cursor: pointer; text-decoration: underline;" class="combo-origin-trigger" data-race-id="${race.id}" data-combo-key="${cleanKey}">
              ${combo.count} Fahrer
            </strong>
          </div>
          <div id="combo-origin-${race.id}-${cleanKey}" class="hidden" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--text-400); background: rgba(0, 0, 0, 0.18); border-left: 2px solid var(--accent-h); text-align: left; line-height: 1.4;">
            Herkunft: ${originDetails}
          </div>
        `);
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
        <td class="race-programs-popup-anchor" style="${riderCountCellStyle}">
          ${riderCountTrigger}
          ${riderCountPopupHtml}
        </td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${captainCount}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${coCaptainCount}</td>
        <td style="${sprinterCellStyle}">${sprinterCount}</td>
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

function getProgramRolesSortIndicator(key: string): string {
  if (programRolesSortKey !== key) return '<span style="opacity:0.35; margin-left:4px;">↕</span>';
  return `<span style="color:var(--accent-h); margin-left:4px; font-weight:bold;">${programRolesSortAsc ? '↑' : '↓'}</span>`;
}

function renderSortHeader(key: string, label: string, extraStyle = ''): string {
  const activeClass = programRolesSortKey === key ? 'sort-active' : '';
  return `
    <th style="cursor: pointer; user-select: none; ${extraStyle}" class="program-roles-sort-header ${activeClass}" data-sort-key="${key}">
      <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
        <span>${esc(label)}</span>
        ${getProgramRolesSortIndicator(key)}
      </div>
    </th>
  `;
}

function renderSortHeaderLeft(key: string, label: string, extraStyle = ''): string {
  const activeClass = programRolesSortKey === key ? 'sort-active' : '';
  return `
    <th style="cursor: pointer; user-select: none; ${extraStyle}" class="program-roles-sort-header ${activeClass}" data-sort-key="${key}">
      <div style="display: flex; align-items: center; justify-content: flex-start; gap: 2px;">
        <span>${esc(label)}</span>
        ${getProgramRolesSortIndicator(key)}
      </div>
    </th>
  `;
}

// 5. Tab: Program Roles Info
function renderTabProgramRoles(payload: any): string {
  const programs = payload.programs;
  const roleSpecCombinations = payload.roleSpecCombinations || [];

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

  // Pre-calculate counts, filter combinations and calculate race days per program
  const programDataList = programs.map((prog: any) => {
    const progCombos = roleSpecCombinations.filter((c: any) => c.program_id === prog.id);
    
    let totalRiders = 0;
    const roleCounts: Record<string, number> = {
      Kapitaen: 0,
      Co_Kapitaen: 0,
      Sprinter: 0,
      Edelhelfer: 0,
      Starke_Helfer: 0,
      Wassertraeger: 0,
    };

    for (const item of progCombos) {
      totalRiders += item.count;
      if (roleCounts[item.role] !== undefined) {
        roleCounts[item.role] += item.count;
      }
    }

    const stats = calculateProgramDays(prog, payload);
    const raceDays = stats.peak + stats.prep + stats.none;

    return {
      program: prog,
      totalRiders,
      roleCounts,
      progCombos,
      raceDays,
    };
  });

  // Sort programDataList based on programRolesSortKey & programRolesSortAsc
  programDataList.sort((a: any, b: any) => {
    let comparison = 0;
    if (programRolesSortKey === 'id') {
      comparison = a.program.id - b.program.id;
    } else if (programRolesSortKey === 'name') {
      comparison = a.program.name.localeCompare(b.program.name);
    } else if (programRolesSortKey === 'total') {
      comparison = a.totalRiders - b.totalRiders;
    } else if (programRolesSortKey === 'raceDays') {
      comparison = a.raceDays - b.raceDays;
    } else {
      // It's a role count key: Kapitaen, Co_Kapitaen, etc.
      comparison = (a.roleCounts[programRolesSortKey] || 0) - (b.roleCounts[programRolesSortKey] || 0);
    }

    if (comparison === 0) {
      // secondary sort by id
      comparison = a.program.id - b.program.id;
    }

    return programRolesSortAsc ? comparison : -comparison;
  });

  const rows = programDataList.map((item: any) => {
    const prog = item.program;
    const progCombos = item.progCombos;
    const totalRiders = item.totalRiders;
    const roleCounts = item.roleCounts;
    const raceDays = item.raceDays;

    const assignedRaceIds = new Set<number>(
      payload.raceProgramRaces.filter((m: any) => m.program_id === prog.id).map((m: any) => m.race_id)
    );
    const phaseDays = getProgramDaysPerPhase(prog, assignedRaceIds, payload);

    // Sort combinations by role and then by spec1
    const sortedRoles = ['Kapitaen', 'Co_Kapitaen', 'Sprinter', 'Edelhelfer', 'Starke_Helfer', 'Wassertraeger'];
    const specSortOrder = ['Berg', 'Hill', 'Sprint', 'Cobble', 'Timetrial', 'Attacker'];

    // Group and sum combinations by role, spec1, and spec2
    const comboMap5 = new Map<string, number>();
    for (const item of progCombos) {
      const spec2Val = item.spec2 || '—';
      const key = `${item.role}|${item.spec1}|${spec2Val}`;
      comboMap5.set(key, (comboMap5.get(key) || 0) + item.count);
    }

    const sortedCombos = [...comboMap5.entries()].map(([key, count]) => {
      const [role, spec1, spec2] = key.split('|');
      return { role, spec1, spec2, count };
    }).sort((a, b) => {
      const roleDiff = sortedRoles.indexOf(a.role) - sortedRoles.indexOf(b.role);
      if (roleDiff !== 0) return roleDiff;

      const specDiff = specSortOrder.indexOf(a.spec1) - specSortOrder.indexOf(b.spec1);
      if (specDiff !== 0) return specDiff;

      return b.count - a.count;
    });

    const translateSpecs = (spec1: string, spec2: string) => {
      const s1 = specLabels[spec1] ?? spec1;
      const s2 = spec2 !== '—' ? (specLabels[spec2] ?? spec2) : '—';
      return `${s1} / ${s2}`;
    };

    const combinationRows: string[] = [];
    for (const combo of sortedCombos) {
      if (combo.count > 0) {
        const isOrange = (combo.spec1 === 'Berg' && combo.spec2 === 'Cobble') || (combo.spec1 === 'Cobble' && combo.spec2 === 'Berg');
        const itemStyle = isOrange
          ? 'display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem; background: rgba(249, 115, 22, 0.12); color: #f97316;'
          : 'display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem;';
        const textStyle = isOrange ? 'color: #f97316; font-weight: bold;' : 'color: var(--text-100);';
        const countStyle = isOrange ? 'color: #f97316; font-weight: bold;' : 'color: var(--accent-h);';

        const cleanKey = `${combo.role}_${combo.spec1}_${combo.spec2.replace(/[^a-zA-Z0-9]/g, '_')}`;

        combinationRows.push(`
          <div style="${itemStyle}">
            <span style="${textStyle}">${roleLabels[combo.role] || combo.role} <span class="text-muted">(${translateSpecs(combo.spec1, combo.spec2)})</span></span>
            <strong style="${countStyle} cursor: pointer; text-decoration: underline;" class="combo-origin-trigger" data-race-id="prog-${prog.id}" data-combo-key="${cleanKey}">
              ${combo.count} Fahrer
            </strong>
          </div>
          <div id="combo-origin-prog-${prog.id}-${cleanKey}" class="hidden" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--text-400); background: rgba(0, 0, 0, 0.18); border-left: 2px solid var(--accent-h); text-align: left; line-height: 1.4;">
            Herkunft: <span style="white-space: nowrap; margin-right: 0.8rem;">${esc(prog.name)}: <strong>${combo.count}</strong></span>
          </div>
        `);
      }
    }

    const detailBox = combinationRows.length > 0
      ? combinationRows.join('')
      : `<div class="text-muted" style="padding: 0.5rem; font-size: 0.8rem;">Keine Fahrer zugewiesen.</div>`;

    return `
      <tr style="position: relative;">
        <td style="text-align: center; vertical-align: middle;">
          <button type="button" class="btn btn-sm btn-ghost program-row-expand-btn" data-program-id="${prog.id}" style="padding: 0.15rem 0.4rem;">▶</button>
        </td>
        <td style="font-weight: bold; color: var(--text-100);">${prog.id}</td>
        <td style="font-weight: bold; min-width: 150px;">${esc(prog.name)}</td>
        <td style="text-align: center; font-weight: bold; color: var(--accent-h); font-variant-numeric: tabular-nums;">${totalRiders}</td>
        <td style="text-align: center; font-weight: bold; color: var(--text-100); font-variant-numeric: tabular-nums;" title="Abschnitts-Renntage:\nStart bis Peak 1: ${phaseDays.phase1} Tage\nPeak 1 bis Peak 2: ${phaseDays.phase2} Tage\nPeak 2 bis Peak 3: ${phaseDays.phase3} Tage\nJenseits Peak 3: ${phaseDays.phase4} Tage">
          ${raceDays} <span style="font-size: 0.72rem; color: var(--text-500); font-weight: normal; display: block; margin-top: 0.15rem;">${phaseDays.phase1} / ${phaseDays.phase2} / ${phaseDays.phase3} / ${phaseDays.phase4}</span>
        </td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${roleCounts.Kapitaen || '—'}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${roleCounts.Co_Kapitaen || '—'}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${roleCounts.Sprinter || '—'}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${roleCounts.Edelhelfer || '—'}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${roleCounts.Starke_Helfer || '—'}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${roleCounts.Wassertraeger || '—'}</td>
      </tr>
      <tr id="program-details-row-${prog.id}" class="hidden" style="background: rgba(15, 23, 42, 0.45);">
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
    <div class="team-detail-card" style="margin-top: 1rem;">
      <div class="team-detail-table-scroll" style="max-height: 75vh;">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 40px;"></th>
              ${renderSortHeader('id', 'ID', 'width: 50px;')}
              ${renderSortHeaderLeft('name', 'Programm')}
              ${renderSortHeader('total', 'Fahrer gesamt', 'width: 110px; text-align: center; font-weight: bold;')}
              ${renderSortHeader('raceDays', 'Renntage', 'width: 100px; text-align: center; font-weight: bold;')}
              ${renderSortHeader('Kapitaen', 'Kapitän', 'width: 90px; text-align: center;')}
              ${renderSortHeader('Co_Kapitaen', 'Co-Kapitän', 'width: 90px; text-align: center;')}
              ${renderSortHeader('Sprinter', 'Sprinter', 'width: 90px; text-align: center;')}
              ${renderSortHeader('Edelhelfer', 'Edelhelfer', 'width: 90px; text-align: center;')}
              ${renderSortHeader('Starke_Helfer', 'Starke Helfer', 'width: 100px; text-align: center;')}
              ${renderSortHeader('Wassertraeger', 'Wasserträger', 'width: 100px; text-align: center;')}
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
