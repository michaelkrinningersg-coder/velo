import { api } from '../api';
import {
  $,
  esc,
  state,
  formatDate,
  renderFlag,
  renderMiniJersey,
  isActiveView,
} from '../state';
import {
  raceCategoryBadge,
  raceCategoryNameBadge,
  openDashboardRaceStages,
  openRaceProgramParticipants,
} from './dashboard';
import { resolveRaceCategoryBadgeStyle } from '../riderStatsUi';
import type { Race } from '../../../shared/types';

let currentYear = 2026;
let currentMonthIndex = 5; // June (0-based)
let initialized = false;

const MONTH_NAMES = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

interface CalendarEvent {
  race: Race;
  startIdx: number;
  endIdx: number;
  slot?: number;
}

function toDateStr(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getCalendarWeeks(year: number, monthIndex: number): Date[][] {
  const weeks: Date[][] = [];
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  let dayOfWeek = firstDay.getDay();
  // Adjust to Monday-start (Monday = 0, ..., Sunday = 6)
  let offset = (dayOfWeek + 6) % 7;

  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - offset);

  const currentDate = new Date(startDate);
  while (currentDate <= lastDay || currentDate.getDay() !== 1) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export function initCalendarView(): void {
  if (initialized) return;
  initialized = true;

  $('calendar-prev-month').addEventListener('click', () => {
    currentMonthIndex--;
    if (currentMonthIndex < 0) {
      currentMonthIndex = 11;
      currentYear--;
    }
    renderCalendar();
  });

  $('calendar-next-month').addEventListener('click', () => {
    currentMonthIndex++;
    if (currentMonthIndex > 11) {
      currentMonthIndex = 0;
      currentYear++;
    }
    renderCalendar();
  });

  $('calendar-today-btn').addEventListener('click', () => {
    if (state.gameState?.currentDate) {
      const [y, m] = state.gameState.currentDate.split('-').map(Number);
      currentYear = y;
      currentMonthIndex = m - 1;
    }
    renderCalendar();
  });

  $('calendar-race-search').addEventListener('input', () => {
    renderCalendarRaceList();
  });

  // Click handler on calendar weeks (event bars)
  $('calendar-weeks').addEventListener('click', (event) => {
    const bar = (event.target as Element).closest<HTMLElement>('.calendar-event-bar');
    if (bar) {
      const raceId = Number(bar.dataset['raceId']);
      if (Number.isFinite(raceId)) {
        void openDashboardRaceStages(raceId);
      }
    }
  });

  // Click handler on the races list table on the right
  $('calendar-races-tbody').addEventListener('click', (event) => {
    const raceBtn = (event.target as Element).closest<HTMLButtonElement>('.dashboard-race-link');
    if (raceBtn) {
      const raceId = Number(raceBtn.dataset['dashboardRaceId']);
      if (Number.isFinite(raceId)) {
        void openDashboardRaceStages(raceId);
      }
      return;
    }

    const partBtn = (event.target as Element).closest<HTMLButtonElement>('button[data-dashboard-race-participants-id]');
    if (partBtn) {
      const raceId = Number(partBtn.dataset['dashboardRaceParticipantsId']);
      if (Number.isFinite(raceId)) {
        void openRaceProgramParticipants(raceId);
      }
    }
  });

  // Hover highlighting (Cross-Highlighting)
  const container = document.querySelector('.calendar-layout-container');
  if (container) {
    container.addEventListener('mouseenter', (event) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-race-id]');
      if (target) {
        const raceId = target.dataset['raceId'];
        if (raceId) {
          document.querySelectorAll(`[data-race-id="${raceId}"]`).forEach((el) => {
            el.classList.add('calendar-highlight');
          });
        }
      }
    }, true);

    container.addEventListener('mouseleave', (event) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-race-id]');
      if (target) {
        const raceId = target.dataset['raceId'];
        if (raceId) {
          document.querySelectorAll(`[data-race-id="${raceId}"]`).forEach((el) => {
            el.classList.remove('calendar-highlight');
          });
        }
      }
    }, true);
  }
}

export function showCalendarView(): void {
  if (state.gameState?.currentDate) {
    const [y, m] = state.gameState.currentDate.split('-').map(Number);
    currentYear = y;
    currentMonthIndex = m - 1;
  }
  renderCalendar();
}

export function renderCalendar(): void {
  if (!isActiveView('calendar')) return;

  $('calendar-month-label').textContent = `${MONTH_NAMES[currentMonthIndex]} ${currentYear}`;

  const weeks = getCalendarWeeks(currentYear, currentMonthIndex);
  const weeksContainer = $('calendar-weeks');
  const currentDate = state.gameState?.currentDate ?? '';

  let html = '';

  for (const week of weeks) {
    const weekStr = week.map(toDateStr);

    // Find overlapping races
    const overlapping: CalendarEvent[] = [];
    for (const race of state.races) {
      if (race.startDate <= weekStr[6] && race.endDate >= weekStr[0]) {
        const startIdx = race.startDate < weekStr[0] ? 0 : weekStr.indexOf(race.startDate);
        const endIdx = race.endDate > weekStr[6] ? 6 : weekStr.indexOf(race.endDate);
        overlapping.push({ race, startIdx, endIdx });
      }
    }

    // Sort: duration DESC, startDate ASC
    overlapping.sort((a, b) => {
      const durA = a.endIdx - a.startIdx + 1;
      const durB = b.endIdx - b.startIdx + 1;
      if (durB !== durA) {
        return durB - durA;
      }
      return a.startIdx - b.startIdx;
    });

    // Allocate slots (0, 1, 2)
    const occupied = Array.from({ length: 3 }, () => Array(7).fill(false));
    for (const ev of overlapping) {
      let allocatedSlot = 2; // fallback
      for (let s = 0; s < 3; s++) {
        let free = true;
        for (let d = ev.startIdx; d <= ev.endIdx; d++) {
          if (occupied[s][d]) {
            free = false;
            break;
          }
        }
        if (free) {
          allocatedSlot = s;
          break;
        }
      }
      for (let d = ev.startIdx; d <= ev.endIdx; d++) {
        occupied[allocatedSlot][d] = true;
      }
      ev.slot = allocatedSlot;
    }

    // Render day cells background/labels
    const dayCellsHtml = week.map((day) => {
      const dayStr = toDateStr(day);
      const isOtherMonth = day.getMonth() !== currentMonthIndex;
      const isToday = dayStr === currentDate;
      const classes = [
        'calendar-day-cell',
        isOtherMonth ? 'other-month' : '',
        isToday ? 'today' : '',
      ].filter(Boolean).join(' ');

      return `
        <div class="${classes}">
          <span class="calendar-day-number">${day.getDate()}</span>
        </div>
      `;
    }).join('');

    // Render event bars
    const eventBarsHtml = overlapping.map((ev) => {
      const race = ev.race;
      const isLive = currentDate >= race.startDate && currentDate <= race.endDate;
      const isDone = currentDate > race.endDate;
      const style = resolveRaceCategoryBadgeStyle(race.category?.name);
      
      const liveDot = isLive ? '<span class="calendar-live-dot"></span>' : '';
      const opacity = isDone ? 'opacity: 0.55;' : '';
      const spanCols = ev.endIdx - ev.startIdx + 1;

      return `
        <div class="calendar-event-bar ${isLive ? 'is-live' : ''}"
             data-race-id="${race.id}"
             style="grid-column: ${ev.startIdx + 1} / span ${spanCols};
                    grid-row: ${ev.slot! + 1};
                    background-color: ${style.background};
                    border: 1px solid ${style.border};
                    color: ${style.color};
                    ${opacity}"
             title="${esc(race.name)} (${formatDate(race.startDate)} - ${formatDate(race.endDate)})">
          ${liveDot}<span class="calendar-event-name">${esc(race.name)}</span>
        </div>
      `;
    }).join('');

    html += `
      <div class="calendar-week">
        <div class="calendar-day-grid">${dayCellsHtml}</div>
        <div class="calendar-event-overlay">${eventBarsHtml}</div>
      </div>
    `;
  }

  weeksContainer.innerHTML = html;

  renderCalendarRaceList();
}

export function renderCalendarRaceList(): void {
  const searchInput = $('calendar-race-search') as HTMLInputElement | null;
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  const tbody = $('calendar-races-tbody');
  const currentDate = state.gameState?.currentDate ?? '';

  // Filter and sort races by date ascending
  const filteredRaces = state.races
    .filter((race) => {
      if (!query) return true;
      return race.name.toLowerCase().includes(query) || (race.category?.name && race.category.name.toLowerCase().includes(query));
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  if (filteredRaces.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-muted" style="text-align: center; padding: 20px;">Keine Rennen gefunden.</td></tr>';
    return;
  }

  tbody.innerHTML = filteredRaces.map((race) => {
    const isLive = currentDate >= race.startDate && currentDate <= race.endDate;
    const isDone = currentDate > race.endDate;
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
      <tr data-race-id="${race.id}">
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
      </tr>
    `;
  }).join('');
}
