import {
  $,
  esc,
  state,
  formatDate,
  isActiveView,
} from '../state';
import {
  openDashboardRaceStages,
  startAutoProgress,
} from './dashboard';
import { resolveRaceCategoryBadgeStyle } from '../riderStatsUi';
import type { Race } from '../../../shared/types';

const MONO = "font-family:'JetBrains Mono',monospace";
const MONTH_ABBR = ['JAN', 'FEB', 'MRZ', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'];

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

function handleCalendarDateClick(dateStr: string): void {
  const currentDate = state.gameState?.currentDate;
  if (!currentDate) return;

  if (dateStr <= currentDate) {
    return;
  }

  const formattedTarget = formatDate(dateStr);
  const ok = confirm(`Möchtest du automatisch bis zum ${formattedTarget} simulieren?`);
  if (ok) {
    state.autoProgressTargetDate = dateStr;
    startAutoProgress();
  }
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

  // Click handler on calendar weeks (event bars or day cells)
  $('calendar-weeks').addEventListener('click', (event) => {
    const bar = (event.target as Element).closest<HTMLElement>('.calendar-event-bar');
    if (bar) {
      const raceId = Number(bar.dataset['raceId']);
      if (Number.isFinite(raceId)) {
        void openDashboardRaceStages(raceId);
      }
      return;
    }

    const dayCell = (event.target as Element).closest<HTMLElement>('[data-calendar-date]');
    if (dayCell) {
      const dateStr = dayCell.dataset['calendarDate'];
      if (dateStr) {
        handleCalendarDateClick(dateStr);
      }
    }
  });

  // Click handler on the races list (Renn-Radar-Stil) on the right
  $('calendar-races-list').addEventListener('click', (event) => {
    const raceBtn = (event.target as Element).closest<HTMLButtonElement>('[data-dashboard-race-id]');
    if (raceBtn) {
      const raceId = Number(raceBtn.dataset['dashboardRaceId']);
      if (Number.isFinite(raceId)) {
        void openDashboardRaceStages(raceId);
      }
      return;
    }
  });

  // Saison-Ribbon: Klick auf einen Monat navigiert den Kalender dorthin
  $('calendar-season-ribbon').addEventListener('click', (event) => {
    const cell = (event.target as Element).closest<HTMLElement>('[data-ribbon-month]');
    if (!cell) return;
    const monthIdx = Number(cell.dataset['ribbonMonth']);
    if (!Number.isFinite(monthIdx)) return;
    currentMonthIndex = monthIdx;
    renderCalendar();
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

  const monthYearLabel = `${MONTH_NAMES[currentMonthIndex]} ${currentYear}`;
  $('calendar-month-label').textContent = monthYearLabel;
  $('calendar-card-month').textContent = monthYearLabel;
  const seasonYear = state.gameState?.season ?? currentYear;
  $('calendar-year-title').textContent = `Saison ${seasonYear}`;

  renderSeasonRibbon();

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

    // Allocate slots (0, 1, 2, 3)
    const occupied = Array.from({ length: 4 }, () => Array(7).fill(false));
    for (const ev of overlapping) {
      let allocatedSlot = 3; // fallback
      for (let s = 0; s < 4; s++) {
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
      const isFuture = dayStr > currentDate;
      const classes = [
        'calendar-day-cell',
        isOtherMonth ? 'other-month' : '',
        isToday ? 'today' : '',
        isFuture ? 'is-future' : '',
      ].filter(Boolean).join(' ');

      return `
        <div class="${classes}" data-calendar-date="${dayStr}">
          <span class="calendar-day-number" data-calendar-date="${dayStr}">${day.getDate()}</span>
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

function raceTotalKm(race: Race): number {
  return race.isStageRace
    ? (race.stages ?? []).reduce((sum, stage) => sum + (stage.distanceKm ?? 0), 0)
    : (race.upcomingStage?.distanceKm ?? 0);
}

// Rennliste im Renn-Radar-Stil (Datumsblock + Kategorie-Farbbalken + Status).
// Standardmaessig auf den angezeigten Monat begrenzt (wie Design "Rennen im Mai");
// bei aktiver Suche wird ueber die ganze Saison gesucht.
export function renderCalendarRaceList(): void {
  const searchInput = $('calendar-race-search') as HTMLInputElement | null;
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  const listEl = $('calendar-races-list');
  const titleEl = $('calendar-list-title');
  const countEl = $('calendar-list-count');
  const currentDate = state.gameState?.currentDate ?? '';

  const monthFirst = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const monthLast = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const filteredRaces = state.races
    .filter((race) => {
      if (query) {
        return race.name.toLowerCase().includes(query)
          || (race.category?.name != null && race.category.name.toLowerCase().includes(query));
      }
      // Rennen, die den angezeigten Monat ueberschneiden
      return race.startDate <= monthLast && race.endDate >= monthFirst;
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  titleEl.textContent = query ? 'Suchergebnisse' : `Rennen im ${MONTH_NAMES[currentMonthIndex]}`;
  countEl.textContent = `${filteredRaces.length} ${filteredRaces.length === 1 ? 'Rennen' : 'Rennen'}`;

  if (filteredRaces.length === 0) {
    listEl.innerHTML = `<div style="padding:20px;text-align:center;color:#6a7a95;font-size:13px;">${query ? 'Keine Rennen gefunden.' : 'Keine Rennen in diesem Monat.'}</div>`;
    return;
  }

  listEl.innerHTML = filteredRaces.map((race) => {
    const isLive = currentDate >= race.startDate && currentDate <= race.endDate;
    const isDone = currentDate > race.endDate;
    const [, mm, dd] = race.startDate.split('-');
    const mon = MONTH_ABBR[Number(mm) - 1] ?? '';
    const catStyle = resolveRaceCategoryBadgeStyle(race.category?.name);
    const country = race.country?.name ?? `Land ${race.countryId}`;
    const km = raceTotalKm(race);

    const status = isDone
      ? '<span style="font-size:10px;font-weight:700;color:#93a3bd;background:rgba(148,163,184,.12);padding:4px 10px;border-radius:99px;letter-spacing:.04em;">FERTIG</span>'
      : isLive
        ? '<span style="font-size:10px;font-weight:700;color:#fca5a5;background:rgba(239,68,68,.12);padding:4px 10px;border-radius:99px;letter-spacing:.04em;animation:velopulse 1.6s ease-in-out infinite;">LÄUFT</span>'
        : '<span style="font-size:10px;font-weight:700;color:#93a3bd;border:1px solid #2b3a55;padding:4px 10px;border-radius:99px;letter-spacing:.04em;">GEPLANT</span>';

    const nameColor = isDone ? '#8a97ad' : (isLive ? '#f1f5f9' : '#e2e8f0');

    return `
      <button type="button" data-dashboard-race-id="${race.id}" data-race-id="${race.id}"
        style="width:100%;text-align:left;background:none;cursor:pointer;display:flex;align-items:center;gap:14px;padding:11px 14px;border:none;border-top:1px solid #14203a;${isDone ? 'opacity:.65;' : ''}${isLive ? 'box-shadow:inset 3px 0 0 #ef4444;background:linear-gradient(90deg,rgba(239,68,68,.10),transparent 55%);' : ''}"
        title="${esc(race.name)} (${formatDate(race.startDate)} - ${formatDate(race.endDate)})">
        <span style="text-align:center;min-width:38px;"><span style="display:block;font-size:19px;font-weight:800;color:${nameColor};line-height:1;">${dd}</span><span style="display:block;font-size:9px;color:#7c8aa3;letter-spacing:.1em;">${mon}</span></span>
        <span style="width:5px;height:34px;border-radius:3px;background:${catStyle.border};flex:0 0 auto;" title="${esc(race.category?.name ?? '')}"></span>
        <span style="flex:1;min-width:0;"><span style="display:block;font-size:14px;font-weight:700;color:${nameColor};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(race.name)}</span><span style="display:block;${MONO};font-size:11px;color:#8494ad;">${esc(country)}${km ? ' · ' + km.toFixed(0) + ' km' : ''}</span></span>
        ${status}
      </button>
    `;
  }).join('');
}

// Saison-Ribbon: Renndichte je Monat des aktuell angezeigten Jahres (Design #3a).
function renderSeasonRibbon(): void {
  const ribbon = $('calendar-season-ribbon');
  const yearStr = String(currentYear);

  // Rennen je Monat (nach Startdatum) im angezeigten Jahr zaehlen.
  const counts = new Array(12).fill(0);
  for (const race of state.races) {
    if (!race.startDate.startsWith(yearStr + '-')) continue;
    const monthIdx = Number(race.startDate.slice(5, 7)) - 1;
    if (monthIdx >= 0 && monthIdx < 12) counts[monthIdx]++;
  }
  const maxCount = Math.max(1, ...counts);
  const MAX_BAR = 40; // px, wie im Design

  ribbon.innerHTML = counts.map((count, idx) => {
    const isActive = idx === currentMonthIndex;
    const barPx = count > 0 ? Math.max(5, Math.round((count / maxCount) * MAX_BAR)) : 3;
    const barBg = isActive
      ? 'linear-gradient(180deg,#22d3ee,#0891b2)'
      : (count > 0 ? '#26374f' : '#1c2740');
    const glow = isActive ? 'box-shadow:0 0 12px rgba(34,211,238,.5);' : '';
    const labelColor = isActive ? '#22d3ee' : '#5f6f8a';
    const labelWeight = isActive ? '700' : '400';
    return `
      <button type="button" data-ribbon-month="${idx}"
        style="display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:none;cursor:pointer;padding:0;"
        title="${MONTH_NAMES[idx]}: ${count} ${count === 1 ? 'Rennen' : 'Rennen'}">
        <span style="width:70%;height:${barPx}px;background:${barBg};border-radius:3px;${glow}"></span>
        <span style="${MONO};font-size:9px;font-weight:${labelWeight};color:${labelColor};">${MONTH_ABBR[idx]}</span>
      </button>
    `;
  }).join('');

  const currentEl = document.getElementById('calendar-ribbon-current');
  if (currentEl) {
    currentEl.textContent = `▮ ${MONTH_NAMES[currentMonthIndex]} · aktuell`;
  }
}
