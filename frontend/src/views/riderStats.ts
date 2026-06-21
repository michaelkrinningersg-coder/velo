import { api } from '../api';
import {
  $,
  esc,
  state,
  formatDate,
  formatRaceTime,
  renderFlag,
  renderMiniJersey,
  findRiderById,
  showModal,
  resolveRaceCategoryBadgeStyle,
  buildRaceCategoryBadgeCssVariables,
  renderRiderNameLink,
  formatNonFinisherReason,
  renderSeasonFormPhaseIndicator,
} from '../state';
import { formatRaceDateRange, renderStageProfileBadge, raceCategoryBadge, raceCategoryNameBadge, openDashboardStageProfile } from './dashboard';
import type { Rider, RiderStatsPayload } from '../../../shared/types';
import type { RiderStatsTab } from '../state';
import { renderStageEditorScoreBadge } from './stageEditor';

let comparedRiders: Array<{
  riderId: number;
  riderName: string;
  teamId: number | null;
  teamName: string | null;
  formHistory: any[];
  peakDates?: string[];
  currentSeasonPoints: number;
  currentSeasonRank: number | null;
}> = [];
let selectedCompareTeamId: number | null = null;
let chartToggles = {
  form: true,
  combinedFatigue: true,
  shortFatigue: false,
  longFatigue: false
};

const COMPARE_COLORS = [
  '#3b82f6', // blue
  '#ec4899', // pink
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#10b981', // green
  '#f43f5e', // rose
  '#ef4444', // red
  '#f59e0b', // amber
  '#84cc16', // lime
  '#a855f7', // purple-light
];

const WEATHER_PROFILES: Record<number, { pref: number[]; malus: number[]; neutral: number[] }> = {
  1: { pref: [1, 2], malus: [4, 7], neutral: [3, 5, 6] },
  2: { pref: [3, 5], malus: [2, 7], neutral: [1, 4, 6] },
  3: { pref: [4, 7], malus: [2, 5], neutral: [1, 3, 6] },
  4: { pref: [6, 7], malus: [2, 5], neutral: [1, 3, 4] },
  5: { pref: [1, 5], malus: [6, 7], neutral: [2, 3, 4] },
  6: { pref: [1, 3], malus: [4, 7], neutral: [2, 5, 6] },
  7: { pref: [3, 4], malus: [2, 7], neutral: [1, 5, 6] },
};

const WEATHER_NAMES: Record<number, string> = {
  1: 'Sonnig',
  2: 'Extreme Hitze',
  3: 'Leichter Regen',
  4: 'Starkregen',
  5: 'Starker Wind',
  6: 'Dichter Nebel',
  7: 'Schnee/Eis',
};

export function renderWeatherIcon(weatherId: number | null | undefined, weatherName: string | null | undefined): string {
  if (weatherId == null) return '';
  const title = weatherName ? esc(weatherName) : 'Wetter';
  switch (weatherId) {
    case 1: // Sonnig
      return `
        <svg class="rider-stats-icon weather-icon" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 4px;" title="${title}">
          <circle cx="12" cy="12" r="4" fill="rgba(234, 179, 8, 0.2)"></circle>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
        </svg>
      `;
    case 2: // Extreme Hitze
      return `
        <svg class="rider-stats-icon weather-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 4px;" title="${title}">
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" fill="rgba(239, 68, 68, 0.2)"></path>
          <line x1="12" y1="9" x2="12" y2="15"></line>
        </svg>
      `;
    case 3: // Leichter Regen
      return `
        <svg class="rider-stats-icon weather-icon" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 4px;" title="${title}">
          <path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2" stroke="#eab308"></path>
          <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" stroke="#94a3b8" fill="rgba(148, 163, 184, 0.2)"></path>
          <line x1="8" y1="20" x2="8" y2="22"></line>
          <line x1="12" y1="20" x2="12" y2="22"></line>
        </svg>
      `;
    case 4: // Starkregen
      return `
        <svg class="rider-stats-icon weather-icon" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 4px;" title="${title}">
          <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" stroke="#64748b" fill="rgba(100, 116, 139, 0.2)"></path>
          <line x1="8" y1="19" x2="6" y2="22"></line>
          <line x1="12" y1="19" x2="10" y2="22"></line>
          <line x1="16" y1="19" x2="14" y2="22"></line>
        </svg>
      `;
    case 5: // Starker Wind
      return `
        <svg class="rider-stats-icon weather-icon" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 4px;" title="${title}">
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59-3.41A2 2 0 1 1 14 7h-2M12.59 15.41A2 2 0 1 0 14 12H2m12.59 3.41A2 2 0 1 0 11 16h2"></path>
        </svg>
      `;
    case 6: // Dichter Nebel
      return `
        <svg class="rider-stats-icon weather-icon" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 4px;" title="${title}">
          <line x1="5" y1="8" x2="19" y2="8"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="6" y1="16" x2="18" y2="16"></line>
          <line x1="8" y1="20" x2="16" y2="20"></line>
        </svg>
      `;
    case 7: // Schnee/Eis
      return `
        <svg class="rider-stats-icon weather-icon" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 4px;" title="${title}">
          <line x1="12" y1="2" x2="12" y2="22"></line>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M20 16l-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4"></path>
        </svg>
      `;
    default:
      return '';
  }
}

export const RIDER_STATS_ICONS = {
  seasonPoints: '<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  rank: '<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6"/></svg>',
  raceDays: '<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/></svg>',
  wins: '<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/><path d="M8 5h8M8 8h8"/></svg>',
  seasonForm: '<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  raceForm: '<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>',
  longFatigue: '<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/></svg>',
  shortFatigue: '<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/></svg>',
  rollingRaceDays: '<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/><text x="16" y="22" font-size="9" font-weight="bold" fill="#ef4444" stroke="none" text-anchor="middle">30</text></svg>',
  flat: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M2 11h20v2H2z"/></svg>',
  hilly: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M3 14c2 0 4-3 6-3s4 3 6 3 4-3 6-3v2c-2 0-4 3-6 3s-4-3-6-3-4 3-6 3v-2z"/></svg>',
  mediumMountain: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M6 18l5-7 5 7H6zm6-10l-4 5.6L4 18h16l-4-5.6L12 8z"/></svg>',
  mountain: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 3l-8 15h16L12 3zm0 4.2L16.2 16H7.8L12 7.2z"/></svg>',
  stageRace: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>',
  oneDay: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>',
  sprint: '<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2.05v6.95h5l-7 13v-6.95H6l7-13z"/></svg>',
  timetrial: '<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  cobble: '<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  attacker: '<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  breakaway: '<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer" style="margin-right: 0.4rem;"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>',
};

/**
 * Renders a race category + format badge using the same CSS-variable system as
 * raceCategoryBadge() in dashboard.ts. Each race class gets its own colour.
 */
export function renderRiderStatsRaceBadge(
  categoryName: string | null | undefined,
  isStageRace: boolean,
  numberOfStages?: number | null,
): string {
  const categoryStyle = resolveRaceCategoryBadgeStyle(categoryName ?? null);
  const badgeStyle = buildRaceCategoryBadgeCssVariables(categoryStyle);
  const name = categoryName ?? 'Unbekannt';
  return `<span class="badge badge-race-category" style="${badgeStyle}; white-space: nowrap; display: inline-block;">${esc(name)}</span>`;
}

/** Legacy wrapper – kept for injuries.ts compatibility. */
export function renderRiderStatsCategoryBadge(categoryName: string | null | undefined): string {
  if (!categoryName) return '-';
  const categoryStyle = resolveRaceCategoryBadgeStyle(categoryName);
  const badgeStyle = buildRaceCategoryBadgeCssVariables(categoryStyle);
  return `<span class="badge badge-race-category" style="${badgeStyle}; white-space: nowrap; display: inline-block;">${esc(categoryName)}</span>`;
}

export function getRankColor(rank: number): string {
  if (rank <= 1) return 'rgb(34, 197, 94)'; // Green
  if (rank <= 100) {
    const ratio = (rank - 1) / 99;
    return `rgb(${Math.round(34 + ratio * 200)}, ${Math.round(197 - ratio * 18)}, ${Math.round(94 - ratio * 86)})`; // Green to Yellow
  }
  if (rank <= 250) {
    const ratio = (rank - 100) / 150;
    return `rgb(${Math.round(234 + ratio * 5)}, ${Math.round(179 - ratio * 111)}, ${Math.round(8 + ratio * 60)})`; // Yellow to Red
  }
  if (rank <= 750) {
    const ratio = (rank - 250) / 500;
    return `rgb(${Math.round(239 - ratio * 112)}, ${Math.round(68 - ratio * 39)}, ${Math.round(68 - ratio * 39)})`; // Red to Dark Red
  }
  return 'rgb(127, 29, 29)'; // Dark Red
}

export function renderRiderRankBadge(rank: number | null | undefined): string {
  if (rank == null) return '-';
  const color = getRankColor(rank);
  return `<span class="rider-stats-icon-pill" style="padding: 0.2rem 0.6rem; border: none; background: ${color}; color: #fff; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">${rank}</span>`;
}

export function resolveRiderStatsFinalTypeClassName(rowType: string): string {
  switch (rowType) {
    case 'gc_final':
      return 'is-gc';
    case 'points_final':
      return 'is-points';
    case 'mountain_final':
      return 'is-mountain';
    case 'youth_final':
      return 'is-youth';
    case 'breakaway_final':
      return 'is-breakaway';
    default:
      return '';
  }
}

export function getRiderStatsRowTypeLabel(rowType: string): string {
  switch (rowType) {
    case 'gc_final':
      return 'Gesamtwertung';
    case 'points_final':
      return 'Punktewertung';
    case 'mountain_final':
      return 'Bergwertung';
    case 'youth_final':
      return 'Nachwuchs';
    case 'breakaway_final':
      return 'Ausreißer';
    default:
      return 'Etappe';
  }
}

export function renderRiderStatsFinalTypeBadge(rowType: string): string {
  const className = resolveRiderStatsFinalTypeClassName(rowType);
  return `<span class="rider-stats-final-type ${className}">${esc(getRiderStatsRowTypeLabel(rowType))}</span>`;
}

export function renderProfileWinBadge(
  value: number,
  profileType: 'flat' | 'rolling' | 'hilly' | 'hilly_difficult' | 'medium_mountain' | 'mountain' | 'high_mountain' | 'cobble' | 'cobble_hill' | 'itt' | 'ttt',
  label: string
): string {
  let style = 'padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;';
  if (value === 0) {
    style += 'background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);';
  } else {
    if (profileType === 'flat' || profileType === 'rolling') {
      style += 'background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);';
    } else if (profileType === 'hilly' || profileType === 'hilly_difficult') {
      style += 'background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 5px rgba(250, 204, 21, 0.4);';
    } else if (profileType === 'medium_mountain') {
      style += 'background: #e67e22; color: #fff; box-shadow: 0 0 5px rgba(230, 126, 34, 0.4);';
    } else if (profileType === 'mountain' || profileType === 'high_mountain') {
      style += 'background: #95a5a6; color: #fff; box-shadow: 0 0 5px rgba(149, 165, 166, 0.4);';
    } else if (profileType === 'cobble' || profileType === 'cobble_hill') {
      style += 'background: #34495e; color: #fff; box-shadow: 0 0 5px rgba(52, 73, 94, 0.4);';
    } else if (profileType === 'itt' || profileType === 'ttt') {
      style += 'background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);';
    }
  }
  return `<span style="${style}" title="${esc(label)}: ${value} Siege">${value}</span>`;
}

export function renderWeatherWinBadge(
  value: number,
  weatherId: number,
  label: string
): string {
  let style = 'padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;';
  if (value === 0) {
    style += 'background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);';
  } else {
    if (weatherId === 1) { // Sonnig
      style += 'background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; box-shadow: 0 0 5px rgba(251, 191, 36, 0.4);';
    } else if (weatherId === 2) { // Extreme Hitze
      style += 'background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 0 5px rgba(249, 115, 22, 0.4);';
    } else if (weatherId === 3) { // Leichter Regen
      style += 'background: linear-gradient(135deg, #38bdf8, #0284c7); color: #fff; box-shadow: 0 0 5px rgba(56, 189, 248, 0.4);';
    } else if (weatherId === 4) { // Starkregen
      style += 'background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; box-shadow: 0 0 5px rgba(37, 99, 235, 0.4);';
    } else if (weatherId === 5) { // Starker Wind
      style += 'background: linear-gradient(135deg, #0d9488, #0f766e); color: #fff; box-shadow: 0 0 5px rgba(13, 148, 136, 0.4);';
    } else if (weatherId === 6) { // Dichter Nebel
      style += 'background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: #fff; box-shadow: 0 0 5px rgba(139, 92, 246, 0.4);';
    } else if (weatherId === 7) { // Schnee/Eis
      style += 'background: linear-gradient(135deg, #cbd5e1, #94a3b8); color: #000; box-shadow: 0 0 5px rgba(203, 213, 225, 0.4);';
    }
  }
  return `<span style="${style}" title="${esc(label)}: ${value} Siege">${value}</span>`;
}

export function formatRiderStatsRaceBlockMeta(block: any): string {
  const dateLabel = block.startDate === block.endDate
    ? formatDate(block.startDate)
    : `${formatDate(block.startDate)} - ${formatDate(block.endDate)}`;
  return `${dateLabel} · ${block.isStageRace ? 'Etappenrennen' : 'Eintagesrennen'}`;
}

export function resolveCurrentSeasonRank(riderId: number | null | undefined): number | null {
  if (riderId == null || state.riders.length === 0) {
    return null;
  }

  const orderedRiders = [...state.riders].sort((left, right) => (
    (right.seasonPoints ?? 0) - (left.seasonPoints ?? 0)
    || (right.seasonWins ?? 0) - (left.seasonWins ?? 0)
    || right.overallRating - left.overallRating
    || `${left.lastName} ${left.firstName}`.localeCompare(`${right.lastName} ${right.firstName}`, 'de')
    || left.id - right.id
  ));
  const rank = orderedRiders.findIndex((candidate) => candidate.id === riderId);
  return rank >= 0 ? rank + 1 : null;
}

export function getRiderStatsFinalTypeSortOrder(rowType: string): number {
  switch (rowType) {
    case 'gc_final':
      return 0;
    case 'points_final':
      return 1;
    case 'mountain_final':
      return 2;
    case 'youth_final':
      return 3;
    case 'breakaway_final':
      return 4;
    default:
      return 5;
  }
}

export function sortRiderStatsRowsNewestFirst(rows: any[]): any[] {
  return [...rows].sort((left, right) => (
    right.date.localeCompare(left.date)
    || (right.stageNumber ?? -1) - (left.stageNumber ?? -1)
    || getRiderStatsFinalTypeSortOrder(left.rowType) - getRiderStatsFinalTypeSortOrder(right.rowType)
    || (left.resultRank ?? 999) - (right.resultRank ?? 999)
  ));
}

export function sortRiderStatsRaceBlocksNewestFirst(blocks: any[]): any[] {
  return [...blocks]
    .map((block) => ({
      ...block,
      rows: sortRiderStatsRowsNewestFirst(block.rows),
    }))
    .sort((left, right) => (
      right.endDate.localeCompare(left.endDate)
      || right.startDate.localeCompare(left.startDate)
      || right.raceName.localeCompare(left.raceName, 'de')
      || right.raceId - left.raceId
    ));
}

export function formatRiderStatsCareerRaceDaysTooltip(payload: RiderStatsPayload | null): string {
  const rows = payload?.careerRaceDaysBySeason ?? [];
  if (rows.length === 0) {
    return 'Karriere-Renntage\nNoch keine Renntage erfasst';
  }

  return `Karriere-Renntage\n${rows.map((row) => `${row.season}: ${row.raceDays}`).join('\n')}`;
}

export function formatRiderStatsAvailabilityTitle(
  isUnavailable: boolean,
  healthStatusLabel: string | null,
  unavailableUntil: string | null,
  unavailableDaysRemaining: number,
): string | null {
  if (!isUnavailable) {
    return null;
  }

  const label = healthStatusLabel ?? 'Ausfall';
  const untilText = unavailableUntil ? ` bis ${formatDate(unavailableUntil)}` : '';
  return `${label}: noch ${unavailableDaysRemaining} Tag${unavailableDaysRemaining === 1 ? '' : 'e'}${untilText}`;
}

export function renderRiderStatsAvailabilityMarker(rider: Rider | null, payload: RiderStatsPayload | null): string {
  const title = formatRiderStatsAvailabilityTitle(
    payload?.isUnavailable ?? rider?.isUnavailable === true,
    payload?.healthStatusLabel ?? rider?.healthStatusLabel ?? null,
    payload?.unavailableUntil ?? rider?.unavailableUntil ?? null,
    payload?.unavailableDaysRemaining ?? rider?.unavailableDaysRemaining ?? 0,
  );
  if (!title) {
    return '';
  }

  return `<span class="rider-availability-marker" title="${esc(title)}" aria-label="${esc(title)}"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>`;
}

export function renderRiderOverallRatingBadge(score: number): string {
  const stops = [
    { score: 50, hue: 0, lightness: 28 }, // dark red
    { score: 55, hue: 0, lightness: 40 }, // red
    { score: 65, hue: 30, lightness: 42 }, // orange
    { score: 75, hue: 60, lightness: 42 }, // yellow
    { score: 85, hue: 120, lightness: 36 } // green
  ];
  
  let hue = 120;
  let lightness = 36;
  
  const clamped = Math.max(50, Math.min(85, score));
  for (let i = 1; i < stops.length; i++) {
    const prev = stops[i - 1];
    const curr = stops[i];
    if (clamped <= curr.score) {
      const ratio = (clamped - prev.score) / (curr.score - prev.score);
      hue = Math.round(prev.hue + (curr.hue - prev.hue) * ratio);
      lightness = Math.round(prev.lightness + (curr.lightness - prev.lightness) * ratio);
      break;
    }
  }

  const backgroundAlpha = 0.44;
  const borderAlpha = 0.72;
  const style = `--stage-editor-score-hue:${hue};--stage-editor-score-lightness:${lightness}%;--stage-editor-score-bg-alpha:${backgroundAlpha};--stage-editor-score-border-alpha:${borderAlpha};`;
  return `<span class="stage-editor-score-badge" style="${style}">${score.toFixed(1)}</span>`;
}

export function renderRiderStatsIconHeatPill(icon: string, title: string, value: number, maxValue: number): string {
  const ratio = maxValue > 0 ? Math.max(0, Math.min(1, value / maxValue)) : 0.5;
  const hue = Math.round(6 + (ratio * 118));
  const borderAlpha = 0.26 + (ratio * 0.18);
  const bgAlpha = 0.14 + (ratio * 0.12);
  const style = `--rider-stats-pill-hue:${hue};--rider-stats-pill-border-alpha:${borderAlpha};--rider-stats-pill-bg-alpha:${bgAlpha};`;
  return `<span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="${style}" title="${esc(title)}">${icon} ${value}</span>`;
}

export function getRiderSpecializationLabel(specialization: { id: number; name: string } | string): string {
  if (typeof specialization === 'string') {
    switch (specialization) {
      case 'Berg': return 'Bergfahrer';
      case 'Hill': return 'Hügelspezialist';
      case 'Sprint': return 'Sprinter';
      case 'Timetrial': return 'Zeitfahrer';
      case 'Cobble': return 'Pflasterspezialist';
      case 'Attacker': return 'Angreifer';
      default: return specialization;
    }
  }
  return specialization.name;
}

export function getSpecializationIcon(specialization: { id: number; name: string; key?: string } | string | null): string {
  if (!specialization) return '';
  const key = typeof specialization === 'string' ? specialization : (specialization.key || specialization.name);
  switch (key) {
    case 'Berg': return RIDER_STATS_ICONS.mountain;
    case 'Hill': return RIDER_STATS_ICONS.hilly;
    case 'Sprint': return RIDER_STATS_ICONS.sprint;
    case 'Timetrial': return RIDER_STATS_ICONS.timetrial;
    case 'Cobble': return RIDER_STATS_ICONS.cobble;
    case 'Attacker': return RIDER_STATS_ICONS.attacker;
    default: return '';
  }
}

export function renderRiderStatsSummary(rider: Rider | null, payload: RiderStatsPayload | null, teamName: string | null, countryCode: string | null, countryFlag: string): string {
  const resolvedCountryCode = payload?.countryCode ?? countryCode ?? null;
  const resolvedCountryFlag = resolvedCountryCode ? renderFlag(resolvedCountryCode) : countryFlag;
  const resolvedRoleName = payload?.roleName ?? rider?.role?.name ?? 'Ohne Rolle';
  const resolvedOverallRating = payload?.overallRating ?? rider?.overallRating ?? 0;
  const resolvedTeamId = payload?.teamId ?? rider?.activeTeamId ?? null;
  const resolvedTeamName = payload?.teamName ?? teamName ?? 'Ohne aktives Team';
  const resolvedSeasonPhase = payload?.seasonFormPhase ?? rider?.seasonFormPhase ?? 'neutral';
  const programName = payload?.program?.name ?? rider?.seasonProgram?.name ?? '-';
  const formBonus = payload?.formBonus ?? rider?.formBonus ?? 0;
  const raceFormBonus = payload?.raceFormBonus ?? rider?.raceFormBonus ?? 0;
  const seasonRaceDaysTotal = payload?.seasonRaceDaysTotal ?? rider?.seasonRaceDaysTotal ?? 0;
  const rolling30dRaceDays = payload?.rolling30dRaceDays ?? rider?.rolling30dRaceDays ?? 0;
  const longTermFatigueMalus = payload?.longTermFatigueMalus ?? rider?.longTermFatigueMalus ?? 0;
  const shortTermFatigueMalus = payload?.shortTermFatigueMalus ?? rider?.shortTermFatigueMalus ?? 0;
  const shortTermFatigueWarning = payload?.shortTermFatigueWarning ?? rider?.shortTermFatigueWarning ?? 'none';
  const currentSeasonPoints = payload?.currentSeasonPoints ?? rider?.seasonPoints ?? 0;
  const currentSeasonRank = payload?.currentSeasonRank ?? resolveCurrentSeasonRank(rider?.id ?? payload?.riderId ?? null);
  const currentSeasonRaceDays = payload?.currentSeasonRaceDays ?? rider?.seasonRaceDays ?? 0;
  const careerWins = payload?.careerWins ?? rider?.seasonWins ?? 0;
  const currentSeasonBreakawayAttempts = payload?.currentSeasonBreakawayAttempts ?? 0;
  
  const terrainPoints = payload?.pointsByTerrain ?? { flat: 0, hilly: 0, mediumMountain: 0, mountain: 0, timetrial: 0, cobble: 0 };
  const maxTerrain = Math.max(terrainPoints.flat, terrainPoints.hilly, terrainPoints.mediumMountain, terrainPoints.mountain, terrainPoints.timetrial, terrainPoints.cobble);
  
  const formatPoints = payload?.pointsByRaceFormat ?? { stageRace: 0, oneDay: 0 };
  const maxFormat = Math.max(formatPoints.stageRace, formatPoints.oneDay);

  const specLabel1 = rider?.specialization1 ? getRiderSpecializationLabel(rider.specialization1) : '-';
  const specLabel2 = rider?.specialization2 ? getRiderSpecializationLabel(rider.specialization2) : '-';
  const specLabel3 = rider?.specialization3 ? getRiderSpecializationLabel(rider.specialization3) : '-';
  
  const specIcon1 = getSpecializationIcon(rider?.specialization1 ?? null);
  const specIcon2 = getSpecializationIcon(rider?.specialization2 ?? null);
  const specIcon3 = getSpecializationIcon(rider?.specialization3 ?? null);

  const profileId = rider?.weatherProfileId ?? payload?.weatherProfileId ?? 1;
  const weatherProfile = WEATHER_PROFILES[profileId] || WEATHER_PROFILES[1];
  const pref1Id = weatherProfile.pref[0];
  const pref2Id = weatherProfile.pref[1];
  const pref1Name = WEATHER_NAMES[pref1Id];
  const pref2Name = WEATHER_NAMES[pref2Id];

  let lieutenantPill = '';
  if (payload?.lieutenantInfo) {
    lieutenantPill = `
      <span class="rider-stats-icon-pill" title="Leutnant">🎖️ <span>Leutnant: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${payload.lieutenantInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${esc(payload.lieutenantInfo.name)}</a></span></span>
    `;
  } else if (payload?.leaderInfo) {
    lieutenantPill = `
      <span class="rider-stats-icon-pill" title="Kapitän/Sprinter">🛡️ <span>Fährt für: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${payload.leaderInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${esc(payload.leaderInfo.name)}</a></span></span>
    `;
  }

  return `
    <div class="rider-stats-header-grid">
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Land">${resolvedCountryFlag} <span>${esc(resolvedCountryCode || '-')}</span></span>
        <span class="rider-stats-icon-pill" title="Team">${resolvedTeamId ? renderMiniJersey(resolvedTeamId, resolvedTeamName) : ''} <span>${esc(resolvedTeamName)}</span></span>
        <span class="rider-stats-icon-pill" title="Rolle">${esc(resolvedRoleName)}</span>
        <span class="rider-stats-icon-pill" title="Formphase">${renderSeasonFormPhaseIndicator(resolvedSeasonPhase)} <span>Form</span></span>
        ${lieutenantPill}
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;" title="Overall-Stärke">${renderRiderOverallRatingBadge(resolvedOverallRating)}</span>
        <span class="rider-stats-icon-pill" title="Season-Form">${RIDER_STATS_ICONS.seasonForm} ${formBonus >= 0 ? '+' : ''}${formBonus}</span>
        <span class="rider-stats-icon-pill" title="Rennform">${RIDER_STATS_ICONS.raceForm} ${raceFormBonus >= 0 ? '+' : ''}${raceFormBonus}</span>
        <span class="rider-stats-icon-pill" title="Programm">${esc(programName)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonrenntage">${RIDER_STATS_ICONS.raceDays} <span class="rider-stats-icon-pill-value">${seasonRaceDaysTotal}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${rolling30dRaceDays > 14 ? 'text-warning' : ''}" title="30-Tage Renntage">${RIDER_STATS_ICONS.rollingRaceDays} <span class="rider-stats-icon-pill-value">${rolling30dRaceDays}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Langzeit-Fatigue">${RIDER_STATS_ICONS.longFatigue} <span class="rider-stats-icon-pill-value">${longTermFatigueMalus}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${shortTermFatigueWarning !== 'none' ? 'text-error' : ''}" title="Kurzzeitfatigue">${RIDER_STATS_ICONS.shortFatigue} <span class="rider-stats-icon-pill-value">${shortTermFatigueMalus}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonpunkte">${RIDER_STATS_ICONS.seasonPoints} <span class="rider-stats-icon-pill-value">${currentSeasonPoints}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonplatzierung">${RIDER_STATS_ICONS.rank} <span class="rider-stats-icon-pill-value">${renderRiderRankBadge(currentSeasonRank)}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Renntage">${RIDER_STATS_ICONS.raceDays} <span class="rider-stats-icon-pill-value">${currentSeasonRaceDays}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Siege">${RIDER_STATS_ICONS.wins} <span class="rider-stats-icon-pill-value">${careerWins}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:124;--rider-stats-pill-border-alpha:0.44;--rider-stats-pill-bg-alpha:0.26; font-weight: 500;" title="Spezialisierung 1">${specIcon1} ${esc(specLabel1)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:41;--rider-stats-pill-border-alpha:0.31;--rider-stats-pill-bg-alpha:0.18; font-weight: 500;" title="Spezialisierung 2">${specIcon2} ${esc(specLabel2)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:6;--rider-stats-pill-border-alpha:0.26;--rider-stats-pill-bg-alpha:0.14; font-weight: 500;" title="Spezialisierung 3">${specIcon3} ${esc(specLabel3)}</span>
        <span class="rider-stats-icon-pill" title="Wetterpräferenzen" style="display: inline-flex; align-items: center; gap: 4px; padding: 0.2rem 0.6rem;">🌤️ ${renderWeatherIcon(pref1Id, pref1Name)} ${renderWeatherIcon(pref2Id, pref2Name)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${renderRiderStatsIconHeatPill(RIDER_STATS_ICONS.stageRace, 'Rundfahrten Punkte', formatPoints.stageRace, maxFormat)}
        ${renderRiderStatsIconHeatPill(RIDER_STATS_ICONS.oneDay, 'Eintagesrennen Punkte', formatPoints.oneDay, maxFormat)}
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Ausreißversuche">${RIDER_STATS_ICONS.breakaway} <span class="rider-stats-icon-pill-value">${currentSeasonBreakawayAttempts}</span></span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${renderRiderStatsIconHeatPill(RIDER_STATS_ICONS.flat, 'Flach-Punkte', terrainPoints.flat, maxTerrain)}
        ${renderRiderStatsIconHeatPill(RIDER_STATS_ICONS.hilly, 'Hügel-Punkte', terrainPoints.hilly, maxTerrain)}
        ${renderRiderStatsIconHeatPill(RIDER_STATS_ICONS.mediumMountain, 'Mittelgebirge-Punkte', terrainPoints.mediumMountain, maxTerrain)}
      </div>
      <div class="rider-stats-header-col align-left">
        ${renderRiderStatsIconHeatPill(RIDER_STATS_ICONS.mountain, 'Hochgebirge-Punkte', terrainPoints.mountain, maxTerrain)}
        ${renderRiderStatsIconHeatPill(RIDER_STATS_ICONS.timetrial, 'Zeitfahren-Punkte', terrainPoints.timetrial, maxTerrain)}
        ${renderRiderStatsIconHeatPill(RIDER_STATS_ICONS.cobble, 'Kopfsteinpflaster-Punkte', terrainPoints.cobble, maxTerrain)}
      </div>
    </div>
  `;
}

export function renderRiderStatsTitle(rider: Rider | null, payload: RiderStatsPayload | null): string {
  const firstName = (payload as any)?.firstName ?? rider?.firstName ?? '';
  const lastName = (payload as any)?.lastName ?? rider?.lastName ?? '';
  return `${esc(firstName)} <strong>${esc(lastName)}</strong>`;
}

export function renderRiderStatsHeatPill(label: string, value: number, maxValue: number): string {
  const ratio = maxValue > 0 ? Math.max(0, Math.min(1, value / maxValue)) : 0.5;
  const hue = Math.round(6 + (ratio * 118));
  const borderAlpha = 0.26 + (ratio * 0.18);
  const bgAlpha = 0.14 + (ratio * 0.12);
  const style = `--rider-stats-pill-hue:${hue};--rider-stats-pill-border-alpha:${borderAlpha};--rider-stats-pill-bg-alpha:${bgAlpha};`;
  return `<span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${style}">${esc(label)} ${esc(String(value))}</span>`;
}

export function renderRiderStatsTerrainSources(payload: RiderStatsPayload | null): string {
  const points = payload?.pointsByTerrain;
  if (!points) {
    return '';
  }

  const maxValue = Math.max(points.flat, points.hilly, points.mediumMountain, points.mountain);
  return `
    <div class="rider-stats-summary-group">
      <span class="rider-stats-summary-group-label">Terrain</span>
      ${renderRiderStatsHeatPill('Flat', points.flat, maxValue)}
      ${renderRiderStatsHeatPill('Hilly', points.hilly, maxValue)}
      ${renderRiderStatsHeatPill('Medium Mountain', points.mediumMountain, maxValue)}
      ${renderRiderStatsHeatPill('Mountain', points.mountain, maxValue)}
    </div>`;
}

export function renderRiderStatsRaceFormatSources(payload: RiderStatsPayload | null): string {
  const points = payload?.pointsByRaceFormat;
  if (!points) {
    return '';
  }

  const maxValue = Math.max(points.stageRace, points.oneDay);
  return `
    <div class="rider-stats-summary-group">
      <span class="rider-stats-summary-group-label">Format</span>
      ${renderRiderStatsHeatPill('Etappenrennen', points.stageRace, maxValue)}
      ${renderRiderStatsHeatPill('Eintagesrennen', points.oneDay, maxValue)}
    </div>`;
}

export function renderRiderStatsTabs(payload: RiderStatsPayload | null): string {
  const hasProgram = (payload?.programRaces.length ?? 0) > 0;
  return `
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Riderstats Tabs">
      <button type="button" class="team-detail-page-tab${state.riderStatsTab === 'results' ? ' team-detail-page-tab-active' : ''}" data-rider-stats-tab="results" aria-selected="${state.riderStatsTab === 'results' ? 'true' : 'false'}">Ergebnisse</button>
      <button type="button" class="team-detail-page-tab${state.riderStatsTab === 'topResults' ? ' team-detail-page-tab-active' : ''}" data-rider-stats-tab="topResults" aria-selected="${state.riderStatsTab === 'topResults' ? 'true' : 'false'}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${state.riderStatsTab === 'program' ? ' team-detail-page-tab-active' : ''}" data-rider-stats-tab="program" aria-selected="${state.riderStatsTab === 'program' ? 'true' : 'false'}"${hasProgram ? '' : ' disabled'}>Programm</button>
      <button type="button" class="team-detail-page-tab${state.riderStatsTab === 'form' ? ' team-detail-page-tab-active' : ''}" data-rider-stats-tab="form" aria-selected="${state.riderStatsTab === 'form' ? 'true' : 'false'}">Form</button>
      <button type="button" class="team-detail-page-tab${state.riderStatsTab === 'skills' ? ' team-detail-page-tab-active' : ''}" data-rider-stats-tab="skills" aria-selected="${state.riderStatsTab === 'skills' ? 'true' : 'false'}">Skills</button>
      <button type="button" class="team-detail-page-tab${state.riderStatsTab === 'fatigue' ? ' team-detail-page-tab-active' : ''}" data-rider-stats-tab="fatigue" aria-selected="${state.riderStatsTab === 'fatigue' ? 'true' : 'false'}">Erschöpfung</button>
      <button type="button" class="team-detail-page-tab${state.riderStatsTab === 'career' ? ' team-detail-page-tab-active' : ''}" data-rider-stats-tab="career" aria-selected="${state.riderStatsTab === 'career' ? 'true' : 'false'}">Karrierestatistiken</button>
    </div>`;
}

export function renderRiderSkillBadge(score: number): string {
  const stops = [
    { score: 55, hue: 0, lightness: 28 }, // dark red (55 and less)
    { score: 60, hue: 0, lightness: 40 }, // red
    { score: 68, hue: 30, lightness: 42 }, // orange
    { score: 74, hue: 60, lightness: 42 }, // yellow
    { score: 80, hue: 120, lightness: 36 } // green (80 and more)
  ];
  
  let hue = 120;
  let lightness = 36;
  
  const clamped = Math.max(55, Math.min(80, score));
  for (let i = 1; i < stops.length; i++) {
    const prev = stops[i - 1];
    const curr = stops[i];
    if (clamped <= curr.score) {
      const ratio = (clamped - prev.score) / (curr.score - prev.score);
      hue = Math.round(prev.hue + (curr.hue - prev.hue) * ratio);
      lightness = Math.round(prev.lightness + (curr.lightness - prev.lightness) * ratio);
      break;
    }
  }

  const backgroundAlpha = 0.44;
  const borderAlpha = 0.72;
  const style = `--stage-editor-score-hue:${hue};--stage-editor-score-lightness:${lightness}%;--stage-editor-score-bg-alpha:${backgroundAlpha};--stage-editor-score-border-alpha:${borderAlpha};`;
  return `<span class="stage-editor-score-badge" style="${style}">${score.toFixed(0)}</span>`;
}

export function renderRiderStatsSkillsTab(rider: Rider | null, payload: RiderStatsPayload | null): string {
  const riderSkills = rider?.skills ?? {
    mountain: 60, hill: 60, sprint: 60, timeTrial: 60, cobble: 60, attack: 60,
    mediumMountain: 60, flat: 60, prologue: 60, acceleration: 60
  };

  const skillsToDraw = ['mountain', 'hill', 'sprint', 'timeTrial', 'cobble', 'attack'];
  const labels = ['Berg (MTN)', 'Hügel (HIL)', 'Sprint (SPR)', 'Zeitfahren (TT)', 'Pflaster (COB)', 'Angriff (ATT)'];
  
  // Wider viewBox so labels are never clipped
  const SVG_W = 540;
  const SVG_H = 440;
  const CX = SVG_W / 2;   // 270
  const CY = SVG_H / 2;   // 220
  const R = 160;
  const minVal = 60;
  const maxVal = 85;
  const range = maxVal - minVal; // 25

  // Helper: compute hexagon points for a given radius
  const hexPoints = (radius: number): string[] => {
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI / 3) - (Math.PI / 2);
      pts.push(`${CX + radius * Math.cos(angle)},${CY + radius * Math.sin(angle)}`);
    }
    return pts;
  };

  // SVG defs: gradient fill for rider polygon, glow filter
  const defsHtml = `
    <defs>
      <radialGradient id="radarBgGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(30,32,48,0.95)" />
        <stop offset="100%" stop-color="rgba(15,16,28,0.98)" />
      </radialGradient>
      <linearGradient id="riderFillGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(129,140,248,0.45)" />
        <stop offset="100%" stop-color="rgba(79,70,229,0.20)" />
      </linearGradient>
      <filter id="radarGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>`;

  // Background circle (subtle dark disc behind the web)
  const bgCircle = `<circle cx="${CX}" cy="${CY}" r="${R + 8}" fill="url(#radarBgGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`;

  // ---------- Iso-lines ----------
  // Every 2.5 points: dashed white lines; every 5 points: solid white lines
  let gridPathsHtml = '';
  for (let level = minVal; level <= maxVal; level += 2.5) {
    const r = R * ((level - minVal) / range);
    if (r < 1) {
      gridPathsHtml += `<circle cx="${CX}" cy="${CY}" r="2" fill="rgba(255,255,255,0.25)" />`;
      continue;
    }
    const pts = hexPoints(r);
    const isMajor = level % 5 === 0;
    const strokeW = isMajor ? 1 : 0.6;
    const strokeDash = isMajor ? 'none' : '4,4';
    const opacity = isMajor ? 0.4 : 0.18;
    gridPathsHtml += `<polygon points="${pts.join(' ')}" fill="none" stroke="rgba(255,255,255,${opacity})" stroke-width="${strokeW}" stroke-dasharray="${strokeDash}" />`;

    // Value labels along the top axis for major levels
    if (isMajor && level > minVal) {
      gridPathsHtml += `<text x="${CX + 5}" y="${CY - r + 4}" fill="rgba(255,255,255,0.45)" font-size="9" font-family="Inter, sans-serif" text-anchor="start">${level}</text>`;
    }
  }

  // ---------- Spoke lines ----------
  let spokesHtml = '';
  let labelsHtml = '';
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI / 3) - (Math.PI / 2);
    const outerX = CX + R * Math.cos(angle);
    const outerY = CY + R * Math.sin(angle);
    spokesHtml += `<line x1="${CX}" y1="${CY}" x2="${outerX}" y2="${outerY}" stroke="rgba(255,255,255,0.15)" stroke-width="1" />`;

    // Labels – placed further out so they never clip
    const labelR = R + 28;
    const lx = CX + labelR * Math.cos(angle);
    const ly = CY + labelR * Math.sin(angle);
    const cosVal = Math.cos(angle);
    let anchor = 'middle';
    if (cosVal > 0.15) anchor = 'start';
    else if (cosVal < -0.15) anchor = 'end';

    // Show skill value next to label
    const skillVal = (riderSkills as any)[skillsToDraw[i]] ?? minVal;
    labelsHtml += `<text x="${lx}" y="${ly}" fill="rgba(255,255,255,0.92)" font-size="11.5" font-weight="700" font-family="Inter, sans-serif" text-anchor="${anchor}" dominant-baseline="middle">${labels[i]}</text>`;
    labelsHtml += `<text x="${lx}" y="${ly + 14}" fill="rgba(255,255,255,0.50)" font-size="10" font-weight="500" font-family="Inter, sans-serif" text-anchor="${anchor}" dominant-baseline="middle">${skillVal}</text>`;
  }

  // ---------- Rider polygon ----------
  const riderPts: string[] = [];
  const riderDots: string[] = [];
  
  skillsToDraw.forEach((skillKey, i) => {
    const val = (riderSkills as any)[skillKey] ?? minVal;
    const r = R * ((Math.max(minVal, Math.min(maxVal, val)) - minVal) / range);
    const angle = (i * Math.PI / 3) - (Math.PI / 2);
    const px = CX + r * Math.cos(angle);
    const py = CY + r * Math.sin(angle);
    riderPts.push(`${px},${py}`);
    riderDots.push(`<circle cx="${px}" cy="${py}" r="5" fill="#818cf8" stroke="#fff" stroke-width="2" filter="url(#dotGlow)"><title>${labels[i]}: ${val}</title></circle>`);
  });

  const riderPolygonHtml = `<polygon points="${riderPts.join(' ')}" fill="url(#riderFillGrad)" stroke="#818cf8" stroke-width="2.5" stroke-linejoin="round" filter="url(#radarGlow)" />`;

  // ---------- Skills list: 2 columns, sorted strongest → weakest ----------
  const skillsList = [
    { key: 'mountain', label: 'Berg (MTN)' },
    { key: 'hill', label: 'Hügel (HIL)' },
    { key: 'sprint', label: 'Sprint (SPR)' },
    { key: 'timeTrial', label: 'Zeitfahren (TT)' },
    { key: 'cobble', label: 'Pflaster (COB)' },
    { key: 'attack', label: 'Angriff (ATT)' },
    { key: 'mediumMountain', label: 'Mittelgebirge (MDM)' },
    { key: 'flat', label: 'Flach (FLA)' },
    { key: 'prologue', label: 'Prolog (PRO)' },
    { key: 'acceleration', label: 'Beschleunigung (ACC)' }
  ];

  // Sort by score descending
  const sortedSkills = [...skillsList].sort((a, b) => {
    const sa = (riderSkills as any)[a.key] ?? 60;
    const sb = (riderSkills as any)[b.key] ?? 60;
    return sb - sa;
  });

  // Fill two columns: left col gets indices 0,2,4,6,8 – right col gets 1,3,5,7,9
  const colLeft: string[] = [];
  const colRight: string[] = [];
  sortedSkills.forEach((skill, idx) => {
    const score = (riderSkills as any)[skill.key] ?? 60;
    const html = `
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-900); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-primary); margin-bottom: 0.75rem;">
        <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-300);">${skill.label}</span>
        ${renderRiderSkillBadge(score)}
      </div>
    `;
    if (idx % 2 === 0) colLeft.push(html);
    else colRight.push(html);
  });

  const skillsGridHtml = `
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; width: 100%; align-content: start;">
      <div class="skills-col">${colLeft.join('')}</div>
      <div class="skills-col">${colRight.join('')}</div>
    </div>
  `;

  return `
    <section class="rider-stats-skills-tab" style="margin-top: 1rem;">
      <div class="rider-stats-skills-container" style="display: grid; grid-template-columns: 540px 1fr; gap: 2rem; align-items: start; background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-primary);">
        <div class="skills-radar-wrapper" style="display: flex; justify-content: center; align-items: center; background: var(--bg-900); padding: 1.25rem; border-radius: 10px; border: 1px solid var(--border-primary);">
          <svg width="540" height="440" viewBox="0 0 ${SVG_W} ${SVG_H}" style="overflow: visible;">
            ${defsHtml}
            ${bgCircle}
            ${gridPathsHtml}
            ${spokesHtml}
            ${riderPolygonHtml}
            ${riderDots.join('')}
            ${labelsHtml}
          </svg>
        </div>
        <div class="skills-list-wrapper" style="display: flex; flex-direction: column; height: 100%; justify-content: start;">
          <h4 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.05rem; color: var(--text-100); border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; font-weight: bold;">Fahrer-Skills</h4>
          ${skillsGridHtml}
        </div>
      </div>
    </section>
  `;
}

export function renderRiderStatsFatigueTab(rider: Rider | null, payload: RiderStatsPayload): string {
  const shortTermFatigue = payload.shortTermFatigueMalus ?? 0;
  const longTermDecayable = payload.longTermFatigueDecayable ?? 0;
  const longTermLocked = payload.longTermFatigueLocked ?? 0;
  const longTermTotal = payload.longTermFatigueMalus ?? 0;
  const totalMalus = payload.totalFatigueLoadMalus ?? 0;

  const shortRecoveryDays = (shortTermFatigue / 0.2).toFixed(1).replace('.', ',');
  const longDecayableRecoveryDays = (longTermDecayable / 0.01).toFixed(0);

  let shortTermFatigueColor = '#fff';
  if (payload.shortTermFatigueWarning === 'critical') {
    shortTermFatigueColor = '#ef4444';
  } else if (payload.shortTermFatigueWarning === 'warning') {
    shortTermFatigueColor = '#fbbf24';
  }

  const fatigueHistory = payload.fatigueHistory ?? [];

  let historyRowsHtml = '';
  if (fatigueHistory.length === 0) {
    historyRowsHtml = `<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem; color: #888;">Keine Erschöpfungshistorie für diesen Fahrer vorhanden.</td></tr>`;
  } else {
    historyRowsHtml = fatigueHistory.map((entry) => {
      const formattedDate = formatDate(entry.date);
      let eventLabel = '';
      if (entry.type === 'race') {
        eventLabel = `${esc(entry.raceName)}${entry.stageNumber != null ? ` - Etappe ${entry.stageNumber}` : ''}`;
      } else {
        eventLabel = entry.raceName ? esc(entry.raceName) : 'Regeneration';
      }

      const stageScoreHtml = entry.type === 'race' && entry.stageScore != null
        ? `<span class="badge" style="background: rgba(255,255,255,0.08); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600;">${entry.stageScore.toFixed(0)}</span>`
        : `<span style="color: #666;">–</span>`;

      // Short change format
      let shortChangeHtml = '';
      if (entry.shortChange > 0) {
        shortChangeHtml = `<span style="color: #ef4444; font-weight: 600;">+${entry.shortChange.toFixed(2).replace('.', ',')}</span>`;
      } else if (entry.shortChange < 0) {
        shortChangeHtml = `<span style="color: #2ecc71; font-weight: 600;">${entry.shortChange.toFixed(2).replace('.', ',')}</span>`;
      } else {
        shortChangeHtml = `<span style="color: #666;">0,00</span>`;
      }

      // Long change formats
      const longChanges: string[] = [];
      if (entry.longDecayableChange !== 0) {
        const sign = entry.longDecayableChange > 0 ? '+' : '';
        const color = entry.longDecayableChange > 0 ? '#ef4444' : '#2ecc71';
        longChanges.push(`<span style="color: ${color}; font-weight: 500;">${sign}${entry.longDecayableChange.toFixed(2).replace('.', ',')} <span style="font-size: 0.8rem; color: #999;">(Abbau.)</span></span>`);
      }
      if (entry.longLockedChange !== 0) {
        const sign = entry.longLockedChange > 0 ? '+' : '';
        const color = entry.longLockedChange > 0 ? '#a855f7' : '#2ecc71';
        longChanges.push(`<span style="color: ${color}; font-weight: 500;">${sign}${entry.longLockedChange.toFixed(2).replace('.', ',')} <span style="font-size: 0.8rem; color: #999;">(Gesp.)</span></span>`);
      }

      const longChangeHtml = longChanges.length > 0
        ? `<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem;">${longChanges.join('')}</div>`
        : `<span style="color: #666;">0,00</span>`;

      const currentTotal = (entry.shortAfter + entry.longAfter);

      return `
        <tr>
          <td style="color: #ccc; font-weight: 500; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${formattedDate}</td>
          <td style="color: #fff; font-weight: 600; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${eventLabel}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${stageScoreHtml}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem;">
              ${shortChangeHtml}
              <span style="font-size: 0.85rem; color: #888;">(${entry.shortAfter.toFixed(2).replace('.', ',')})</span>
            </div>
          </td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem; justify-content: flex-end; width: 100%;">
              ${longChangeHtml}
              <span style="font-size: 0.85rem; color: #888;">(${entry.longAfter.toFixed(2).replace('.', ',')})</span>
            </div>
          </td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <strong style="color: #ef4444; font-size: 0.95rem;">-${currentTotal.toFixed(2).replace('.', ',')}</strong>
            <span style="font-size: 0.8rem; color: #888; margin-left: 0.3rem;">(K: ${entry.shortAfter.toFixed(2).replace('.', ',')} | L: ${entry.longAfter.toFixed(2).replace('.', ',')})</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  return `
    <section class="rider-stats-fatigue-tab" style="padding: 1.5rem 0.5rem;">
      <!-- Main Penalty Box -->
      <div class="rider-stats-fatigue-total" style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h3 style="margin: 0 0 0.25rem 0; font-size: 1.15rem; font-weight: 700; color: #fff;">Gesamt-Abzug auf alle Skills</h3>
          <p style="margin: 0; font-size: 0.85rem; color: #bbb;">
            Die Summe aus akuter und langfristiger Erschöpfung wird direkt von allen Attributwerten abgezogen.
          </p>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 2rem; font-weight: 800; color: #ef4444; text-shadow: 0 0 15px rgba(239, 68, 68, 0.25);">
            -${totalMalus.toFixed(2).replace('.', ',')}
          </span>
          <div style="font-size: 0.8rem; color: #888; margin-top: 0.1rem;">
            (Kurzzeit -${shortTermFatigue.toFixed(2).replace('.', ',')} | Langzeit -${longTermTotal.toFixed(2).replace('.', ',')})
          </div>
        </div>
      </div>

      <!-- Fatigue Metric Cards -->
      <div class="rider-stats-fatigue-summary" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        
        <!-- Card 1: Short-term Fatigue -->
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; background: rgba(251, 191, 36, 0.1); color: #fbbf24;">
                ${RIDER_STATS_ICONS.shortFatigue}
              </span>
              <h4 style="margin: 0; font-size: 1rem; font-weight: 600; color: #fff;">Akute Erschöpfung (Kurzzeit)</h4>
            </div>
            <p style="margin: 0 0 1rem 0; font-size: 0.8rem; color: #999; line-height: 1.4;">
              Steigt durch Rennbelastungen proportional zum Stage Score (ab 10 Pkt.). Sinkt um 0,2 pro tageswechsel.
            </p>
          </div>
          <div>
            <div style="font-size: 1.6rem; font-weight: 700; color: ${shortTermFatigueColor}; margin-bottom: 0.25rem;">
              -${shortTermFatigue.toFixed(2).replace('.', ',')} <span style="font-size: 0.85rem; font-weight: 400; color: #888;">Abzug</span>
            </div>
            <div style="font-size: 0.8rem; color: #aaa;">
              Erholungszeit: <strong style="color: #fff;">${shortRecoveryDays} Tage</strong> (ohne Belastung)
            </div>
          </div>
        </div>

        <!-- Card 2: Long-term Decayable Fatigue -->
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; background: rgba(239, 68, 68, 0.1); color: #ef4444;">
                ${RIDER_STATS_ICONS.longFatigue}
              </span>
              <h4 style="margin: 0; font-size: 1rem; font-weight: 600; color: #fff;">Langzeit (Abbaubar)</h4>
            </div>
            <p style="margin: 0 0 1rem 0; font-size: 0.8rem; color: #999; line-height: 1.4;">
              Steigt durch Rennbelastungen proportional zum Stage Score. Regeneriert langsam um 0,01 pro tageswechsel.
            </p>
          </div>
          <div>
            <div style="font-size: 1.6rem; font-weight: 700; color: #ef4444; margin-bottom: 0.25rem;">
              -${longTermDecayable.toFixed(2).replace('.', ',')} <span style="font-size: 0.85rem; font-weight: 400; color: #888;">Abzug</span>
            </div>
            <div style="font-size: 0.8rem; color: #aaa;">
              Erholungszeit: <strong style="color: #fff;">${longDecayableRecoveryDays} Tage</strong> (ohne Belastung)
            </div>
          </div>
        </div>

        <!-- Card 3: Long-term Locked Fatigue -->
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; background: rgba(168, 85, 247, 0.1); color: #a855f7;">
                <svg class="rider-stats-icon" style="stroke: #a855f7;" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <h4 style="margin: 0; font-size: 1rem; font-weight: 600; color: #fff;">Langzeit (Gesperrt)</h4>
            </div>
            <p style="margin: 0 0 1rem 0; font-size: 0.8rem; color: #999; line-height: 1.4;">
              Steigt mit zunehmender Anzahl an Renntagen (ab 30 Renntagen). Kann unter der Saison nicht abgebaut werden.
            </p>
          </div>
          <div>
            <div style="font-size: 1.6rem; font-weight: 700; color: #a855f7; margin-bottom: 0.25rem;">
              -${longTermLocked.toFixed(2).replace('.', ',')} <span style="font-size: 0.85rem; font-weight: 400; color: #888;">Abzug</span>
            </div>
            <div style="font-size: 0.8rem; color: #aaa;">
              Status: <strong style="color: #a855f7;">Gesperrt bis Saisonende</strong>
            </div>
          </div>
        </div>

      </div>

      <!-- Chronological History Table -->
      <h3 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.75rem; padding-left: 0.25rem;">Chronologischer Erschöpfungsverlauf</h3>
      <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap" style="margin-top: 0.5rem;">
        <table class="data-table rider-stats-table">
          <colgroup>
            <col style="width: 14%;">
            <col style="width: 26%;">
            <col style="width: 10%;">
            <col style="width: 18%;">
            <col style="width: 18%;">
            <col style="width: 14%;">
          </colgroup>
          <thead>
            <tr>
              <th style="padding: 0.75rem 0.5rem;">Datum</th>
              <th style="padding: 0.75rem 0.5rem;">Ereignis</th>
              <th style="text-align: right; padding: 0.75rem 0.5rem;">Stage Score</th>
              <th style="text-align: right; padding: 0.75rem 0.5rem;">Kurzzeit-Änderung</th>
              <th style="text-align: right; padding: 0.75rem 0.5rem;">Langzeit-Änderung</th>
              <th style="text-align: right; padding: 0.75rem 0.5rem;">Neue Erschöpfung</th>
            </tr>
          </thead>
          <tbody>
            ${historyRowsHtml}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

export function renderRiderStatsFormTab(payload: RiderStatsPayload | null): string {
  if (!payload) {
    return `
      <section class="rider-stats-placeholder">
        <h3>Keine Formdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Saison noch keine Formdaten aufgezeichnet.</p>
      </section>`;
  }

  const fullHistory = payload.formHistory ?? [];
  const history = fullHistory.filter((_, idx) => idx % 2 === 0);
  const currentDateStr = state.gameState?.currentDate ?? new Date().toISOString();
  const currentYear = history.length > 0 
    ? new Date(history[history.length - 1].date).getUTCFullYear()
    : new Date(currentDateStr).getUTCFullYear();
  const yearStart = new Date(Date.UTC(currentYear, 0, 1)).getTime();
  const msPerDay = 86400000;
  
  // Adjusted dimensions (width 1260, height 384, padL 40)
  const chartW = 1260;
  const chartH = 384;
  const padL = 40;
  const padT = 20;

  const pts = history.map((entry) => {
    const entryDate = new Date(entry.date).getTime();
    const dayOfYear = (entryDate - yearStart) / msPerDay;
    const x = padL + (dayOfYear / 365) * chartW;
    const y = padT + chartH - (Math.min(8, Math.max(0, entry.totalForm)) / 8) * chartH;
    return { x, y, form: entry.totalForm, date: entry.date };
  });

  let pathData = '';
  let pointsHtml = '';
  let fillPath = '';

  if (chartToggles.form && pts.length > 0) {
    pathData = `M ${pts.map((p) => `${p.x},${p.y}`).join(' L ')}`;
    pointsHtml = pts.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#fff" stroke="var(--accent-primary)" stroke-width="2"><title>${payload.riderName} (${p.date}): ${p.form}</title></circle>`).join('');
    fillPath = `${pathData} L ${pts[pts.length - 1].x},${padT + chartH} L ${pts[0].x},${padT + chartH} Z`;
  }

  // Combined Fatigue
  let combinedFatiguePathHtml = '';
  let combinedFatiguePointsHtml = '';
  if (chartToggles.combinedFatigue && pts.length > 0) {
    const cfPts = history.map((entry) => {
      const entryDate = new Date(entry.date).getTime();
      const dayOfYear = (entryDate - yearStart) / msPerDay;
      const x = padL + (dayOfYear / 365) * chartW;
      const val = (entry.shortFatigue ?? 0.0) + (entry.longFatigue ?? 0.0);
      const y = padT + chartH - (Math.min(25, Math.max(0, val)) / 25) * chartH;
      return { x, y, val, date: entry.date };
    });
    const cfPathData = `M ${cfPts.map((p) => `${p.x},${p.y}`).join(' L ')}`;
    combinedFatiguePathHtml = `<path d="${cfPathData}" fill="none" stroke="#ef4444" stroke-width="2" />`;
    combinedFatiguePointsHtml = cfPts.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#fff" stroke="#ef4444" stroke-width="2"><title>Gesamtfatigue (${p.date}): ${p.val.toFixed(2)}</title></circle>`).join('');
  }

  // Short Fatigue
  let shortFatiguePathHtml = '';
  let shortFatiguePointsHtml = '';
  if (chartToggles.shortFatigue && pts.length > 0) {
    const sfPts = history.map((entry) => {
      const entryDate = new Date(entry.date).getTime();
      const dayOfYear = (entryDate - yearStart) / msPerDay;
      const x = padL + (dayOfYear / 365) * chartW;
      const val = entry.shortFatigue ?? 0.0;
      const y = padT + chartH - (Math.min(25, Math.max(0, val)) / 25) * chartH;
      return { x, y, val, date: entry.date };
    });
    const sfPathData = `M ${sfPts.map((p) => `${p.x},${p.y}`).join(' L ')}`;
    shortFatiguePathHtml = `<path d="${sfPathData}" fill="none" stroke="#facc15" stroke-width="2" />`;
    shortFatiguePointsHtml = sfPts.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#fff" stroke="#facc15" stroke-width="2"><title>Kurzzeitfatigue (${p.date}): ${p.val.toFixed(2)}</title></circle>`).join('');
  }

  // Long Fatigue
  let longFatiguePathHtml = '';
  let longFatiguePointsHtml = '';
  if (chartToggles.longFatigue && pts.length > 0) {
    const lfPts = history.map((entry) => {
      const entryDate = new Date(entry.date).getTime();
      const dayOfYear = (entryDate - yearStart) / msPerDay;
      const x = padL + (dayOfYear / 365) * chartW;
      const val = entry.longFatigue ?? 0.0;
      const y = padT + chartH - (Math.min(25, Math.max(0, val)) / 25) * chartH;
      return { x, y, val, date: entry.date };
    });
    const lfPathData = `M ${lfPts.map((p) => `${p.x},${p.y}`).join(' L ')}`;
    longFatiguePathHtml = `<path d="${lfPathData}" fill="none" stroke="#a855f7" stroke-width="2" />`;
    longFatiguePointsHtml = lfPts.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#fff" stroke="#a855f7" stroke-width="2"><title>Langzeitfatigue (${p.date}): ${p.val.toFixed(2)}</title></circle>`).join('');
  }

  // Draw area under curve ONLY for the original rider, in warm yellow
  const fillColor = 'rgba(251, 191, 36, 0.15)'; 

  let gridHtml = '';
  // Left Axis: Form (0 to 8, steps of 2)
  for (let i = 0; i <= 8; i += 2) {
    const y = padT + chartH - (i / 8) * chartH;
    gridHtml += `<line x1="${padL}" y1="${y}" x2="${padL + chartW}" y2="${y}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`;
    gridHtml += `<text x="${padL - 5}" y="${y + 4}" fill="#ffffff" font-size="10" text-anchor="end">${i}</text>`;
  }

  // Right Axis: Fatigue (0 to 25, steps of 5) in #ef4444
  for (let i = 0; i <= 25; i += 5) {
    const y = padT + chartH - (i / 25) * chartH;
    gridHtml += `<text x="${padL + chartW + 5}" y="${y + 4}" fill="#ef4444" font-size="10" text-anchor="start">${i}</text>`;
  }

  let xAxisHtml = '';
  for (let week = 0; week <= 52; week += 5) {
    const x = padL + (week / 52) * chartW;
    gridHtml += `<line x1="${x}" y1="${padT}" x2="${x}" y2="${padT + chartH}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`;
    xAxisHtml += `<text x="${x}" y="${padT + chartH + 15}" fill="#ffffff" font-size="10" text-anchor="middle">W${week}</text>`;
  }

  let peaksHtml = '';
  let phaseBackgroundsHtml = '';
  if (payload.peakDates) {
    const sortedPeaks = [...payload.peakDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    for (let i = 0; i < sortedPeaks.length; i++) {
      const pDate = sortedPeaks[i];
      const pTime = new Date(pDate).getTime();
      const pDay = (pTime - yearStart) / msPerDay;
      const x = padL + (pDay / 365) * chartW;
      peaksHtml += `<line x1="${x}" y1="${padT}" x2="${x}" y2="${padT + chartH}" stroke="#ffffff" stroke-width="2"><title>Peak: ${pDate}</title></line>`;
      
      const prevPDay = i > 0 ? (new Date(sortedPeaks[i - 1]).getTime() - yearStart) / msPerDay : Number.NEGATIVE_INFINITY;
      const idealBuildStartDay = pDay - 56;
      const prevDeclineEnd = prevPDay + 14;
      const actualBuildStartDay = Math.max(0, Math.max(idealBuildStartDay, prevDeclineEnd));
      const actualBuildDays = pDay - actualBuildStartDay;

      const buildX = padL + (actualBuildStartDay / 365) * chartW;
      const buildW = (actualBuildDays / 365) * chartW;
      phaseBackgroundsHtml += `<rect x="${buildX}" y="${padT}" width="${buildW}" height="${chartH}" fill="rgba(16, 185, 129, 0.1)" />`;

      // Decline phase (14 days after peak)
      const declineW = (14 / 365) * chartW;
      phaseBackgroundsHtml += `<rect x="${x}" y="${padT}" width="${declineW}" height="${chartH}" fill="rgba(239, 68, 68, 0.1)" />`;
    }
  }

  const currentTime = new Date(currentDateStr).getTime();
  const currentDay = (currentTime - yearStart) / msPerDay;
  const currentX = padL + (currentDay / 365) * chartW;
  peaksHtml += `<line x1="${currentX}" y1="${padT}" x2="${currentX}" y2="${padT + chartH}" stroke="#ef4444" stroke-width="3"><title>Heute: ${currentDateStr}</title></line>`;

  // Show peak dates for compared riders as vertical dashed lines in their colors
  comparedRiders.forEach((cr, index) => {
    const color = COMPARE_COLORS[index % COMPARE_COLORS.length];
    if (cr.peakDates) {
      cr.peakDates.forEach((pDate) => {
        const pTime = new Date(pDate).getTime();
        const pDay = (pTime - yearStart) / msPerDay;
        const x = padL + (pDay / 365) * chartW;
        peaksHtml += `<line x1="${x}" y1="${padT}" x2="${x}" y2="${padT + chartH}" stroke="${color}" stroke-width="1.5" stroke-dasharray="3,3"><title>${cr.riderName} Peak: ${pDate}</title></line>`;
      });
    }
  });

  // Compared riders lines and points (no fills)
  let comparedPathsHtml = '';
  let comparedPointsHtml = '';
  comparedRiders.forEach((cr, index) => {
    const color = COMPARE_COLORS[index % COMPARE_COLORS.length];
    const crPts = cr.formHistory.filter((_, idx) => idx % 2 === 0).map((entry) => {
      const entryDate = new Date(entry.date).getTime();
      const dayOfYear = (entryDate - yearStart) / msPerDay;
      const x = padL + (dayOfYear / 365) * chartW;
      const y = padT + chartH - (Math.min(8, Math.max(0, entry.totalForm)) / 8) * chartH;
      return { x, y, form: entry.totalForm, date: entry.date };
    });

    if (crPts.length > 0) {
      const pathDataCr = `M ${crPts.map((p) => `${p.x},${p.y}`).join(' L ')}`;
      comparedPathsHtml += `<path d="${pathDataCr}" fill="none" stroke="${color}" stroke-width="2" />`;
      comparedPointsHtml += crPts.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#fff" stroke="${color}" stroke-width="2"><title>${cr.riderName} (${p.date}): ${p.form}</title></circle>`).join('');
    }
  });

  // Controls for team and rider select (Tier 1 teams only)
  const worldTourTeams = state.teams.filter(t => t.division === 'WorldTour' || t.divisionName === 'WorldTour');
  
  let teamOptions = '<option value="">-- Team auswählen --</option>';
  for (const t of worldTourTeams) {
    const isSelected = selectedCompareTeamId === t.id ? ' selected' : '';
    teamOptions += `<option value="${t.id}"${isSelected}>${esc(t.name)}</option>`;
  }

  let riderOptions = '<option value="">-- Fahrer auswählen --</option>';
  if (selectedCompareTeamId != null) {
    const teamRiders = state.riders.filter(r => r.activeTeamId === selectedCompareTeamId && r.id !== payload.riderId && !comparedRiders.some(cr => cr.riderId === r.id));
    for (const r of teamRiders) {
      riderOptions += `<option value="${r.id}">${esc(r.firstName)} ${esc(r.lastName)}</option>`;
    }
  }

  const selectorsHtml = `
    <div class="rider-compare-controls" style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1rem; background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-primary);">
      <span style="font-weight: 600; color: var(--text-100); font-size: 0.95rem;">Mit anderem Fahrer vergleichen:</span>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-team-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Team (Tier 1):</label>
        <select id="rider-compare-team-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);">
          ${teamOptions}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-rider-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Fahrer:</label>
        <select id="rider-compare-rider-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);" ${selectedCompareTeamId == null ? 'disabled' : ''}>
          ${riderOptions}
        </select>
      </div>
    </div>
  `;

  // Sidebar legend right of the chart
  const mainRank = payload.currentSeasonRank ?? resolveCurrentSeasonRank(payload.riderId) ?? '–';
  const legendItemsHtml = [
    `
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0;">
      <span style="display: inline-block; width: 12px; height: 12px; background: var(--accent-primary); border-radius: 2px; flex-shrink: 0;"></span>
      <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-100); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${esc(payload.riderName)} (${payload.currentSeasonPoints}/${mainRank})">${esc(payload.riderName)} <span style="font-weight: normal; color: var(--text-500);">(${payload.currentSeasonPoints}/${mainRank})</span></span>
    </div>
    `
  ];

  comparedRiders.forEach((cr, index) => {
    const color = COMPARE_COLORS[index % COMPARE_COLORS.length];
    const crRank = cr.currentSeasonRank ?? resolveCurrentSeasonRank(cr.riderId) ?? '–';
    legendItemsHtml.push(`
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0; border-top: 1px solid rgba(255,255,255,0.05);">
        <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
          <span style="display: inline-block; width: 12px; height: 12px; background: ${color}; border-radius: 2px; flex-shrink: 0;"></span>
          <span style="font-size: 0.9rem; color: var(--text-300); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${esc(cr.riderName)} (${cr.currentSeasonPoints}/${crRank})">${esc(cr.riderName)} <span style="color: var(--text-500);">(${cr.currentSeasonPoints}/${crRank})</span></span>
        </div>
        <button type="button" class="compare-remove-btn" data-remove-compare-id="${cr.riderId}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 0.25rem; font-weight: bold; display: flex; align-items: center;" title="Vergleich entfernen">×</button>
      </div>
    `);
  });

  const legendContainerHtml = `
    <div class="rider-stats-compare-legend" style="background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary); max-height: 460px; overflow-y: auto; display: flex; flex-direction: column;">
      <h4 style="margin-top: 0; margin-bottom: 0.75rem; font-size: 0.95rem; border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; color: var(--text-100); font-weight: bold;">Legende</h4>
      
      <!-- Chart Line Toggle Checkboxes -->
      <div class="chart-line-toggles" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-form" ${chartToggles.form ? 'checked' : ''} style="cursor: pointer; width: 14px; height: 14px; accent-color: var(--accent-primary);" />
          <span style="display: inline-block; width: 8px; height: 8px; background: var(--accent-primary); border-radius: 50%;"></span>
          Form (0-8)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-combined-fatigue" ${chartToggles.combinedFatigue ? 'checked' : ''} style="cursor: pointer; width: 14px; height: 14px; accent-color: #ef4444;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #ef4444; border-radius: 50%;"></span>
          Gesamtfatigue (0-25)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-short-fatigue" ${chartToggles.shortFatigue ? 'checked' : ''} style="cursor: pointer; width: 14px; height: 14px; accent-color: #facc15;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #facc15; border-radius: 50%;"></span>
          Kurzzeitfatigue (0-25)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-long-fatigue" ${chartToggles.longFatigue ? 'checked' : ''} style="cursor: pointer; width: 14px; height: 14px; accent-color: #a855f7;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #a855f7; border-radius: 50%;"></span>
          Langzeitfatigue (0-25)
        </label>
      </div>

      <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-500); font-weight: bold; margin-bottom: 0.5rem; letter-spacing: 0.5px;">Fahrer</div>
      ${legendItemsHtml.join('')}
    </div>
  `;

  return `
    <section class="rider-stats-form-tab">
      <div class="rider-stats-season-head">
        <h3>Formverlauf (Saison ${currentYear})</h3>
      </div>
      ${selectorsHtml}
      <div class="rider-stats-form-container" style="display: grid; grid-template-columns: 1fr 240px; gap: 1rem; align-items: start; margin-top: 1rem;">
        <div class="rider-stats-chart-wrapper" style="overflow-x: auto; background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary);">
          <svg width="100%" height="460" viewBox="0 0 1350 444" style="min-width: 1300px;">
            ${phaseBackgroundsHtml}
            ${gridHtml}
            ${xAxisHtml}
            ${peaksHtml}
            ${fillPath ? `<path d="${fillPath}" fill="${fillColor}" />` : ''}
            ${pathData ? `<path d="${pathData}" fill="none" stroke="var(--accent-primary)" stroke-width="2" />` : ''}
            ${pointsHtml}
            ${combinedFatiguePathHtml}
            ${combinedFatiguePointsHtml}
            ${shortFatiguePathHtml}
            ${shortFatiguePointsHtml}
            ${longFatiguePathHtml}
            ${longFatiguePointsHtml}
            ${comparedPathsHtml}
            ${comparedPointsHtml}
          </svg>
        </div>
        ${legendContainerHtml}
      </div>
    </section>
  `;
}

export function renderRiderStatsProgramTab(payload: RiderStatsPayload | null): string {
  const races = payload?.programRaces ?? [];
  if (!payload?.program) {
    return `
      <section class="rider-stats-placeholder">
        <h3>Kein Programm hinterlegt</h3>
        <p>Für diesen Fahrer ist aktuell kein Saisonprogramm vorhanden.</p>
      </section>`;
  }

  if (races.length === 0) {
    return `
      <section class="rider-stats-placeholder">
        <h3>${esc(payload.program.name)}</h3>
        <p>Diesem Programm sind aktuell keine Rennen zugeordnet.</p>
      </section>`;
  }

  return `
    <section class="rider-stats-program">
      <div class="rider-stats-season-head">
        <h3>${esc(payload.program.name)}</h3>
        <span>${races.length} Rennen</span>
      </div>
      <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
        <table class="data-table rider-stats-table rider-stats-program-table">
          <thead><tr><th>Datum</th><th class="text-center">Status</th><th>Land</th><th>Rennen</th><th>Rennklasse</th></tr></thead>
          <tbody>
            ${races.map((race) => {
              const isInjured = payload.unavailableUntil ? (race.startDate <= payload.unavailableUntil && race.endDate >= state.gameState!.currentDate) : false;
              return `
              <tr>
                <td>${esc(formatRaceDateRange(race))}</td>
                <td class="text-center" style="font-size: 1.1rem;">${isInjured ? '<span title="Fällt aus (Verletzung/Krankheit)">🏥</span>' : ''}</td>
                <td class="results-flag-col-cell">${race.country?.code3 ? renderFlag(race.country.code3) : '–'}</td>
                <td><strong>${esc(race.name)}</strong></td>
                <td>${raceCategoryNameBadge(race)}</td>
              </tr>
            `}).join('')}
          </tbody>
        </table>
      </div>
    </section>`;
}

const EVENT_LABELS: Record<string, string> = {
  '1': 'Sturz',
  '2': 'Defekt',
  '3': 'Superform',
  '4': 'Supermalus',
  '5': 'Attacken',
  '6': 'Konterattacken',
  '7': 'Heimvorteil',
  '8': 'Heimbonus',
  '9': 'Heimmalus',
};

const JERSEY_LABELS: Record<string, string> = {
  'yellow': 'Gelbes Trikot (Gesamtwertung)',
  'green': 'Grünes Trikot (Punktewertung)',
  'red': 'Bergtrikot (Bergwertung)',
  'white': 'Weißes Trikot (Nachwuchswertung)',
  'purple': 'Lila Trikot (Aktivste Fahrer)',
};

export function renderStatusDotsColumn(row: any): string {
  const activeJerseys = new Set<string>();
  if (row.jerseysWorn) {
    const keys = row.jerseysWorn.split(',').map((k: string) => k.trim()).filter(Boolean);
    for (const jerseyKey of keys) {
      activeJerseys.add(jerseyKey);
    }
  }

  const eventCounts = new Map<string, number>();
  if (row.eventIds) {
    const parts = row.eventIds.split('|');
    for (const part of parts) {
      const [eventId, countStr] = part.split(':');
      if (eventId) {
        eventCounts.set(eventId, countStr ? parseInt(countStr, 10) : 1);
      }
    }
  }

  const orderList = [
    { type: 'jersey', key: 'yellow', label: 'Gelbes Trikot (Gesamtwertung)', colorClass: 'jersey-dot-yellow' },
    { type: 'jersey', key: 'green', label: 'Grünes Trikot (Punktewertung)', colorClass: 'jersey-dot-green' },
    { type: 'jersey', key: 'red', label: 'Bergtrikot (Bergwertung)', colorClass: 'jersey-dot-red' },
    { type: 'jersey', key: 'white', label: 'Weißes Trikot (Nachwuchswertung)', colorClass: 'jersey-dot-white' },
    { type: 'jersey', key: 'purple', label: 'Lila Trikot (Aktivste Fahrer)', colorClass: 'jersey-dot-purple-worn' },
    { type: 'event', key: '3', label: 'Superform', colorClass: 'event-dot-3' },
    { type: 'event', key: '4', label: 'Supermalus', colorClass: 'event-dot-4' },
    { type: 'event', key: '1', label: 'Sturz', colorClass: 'event-dot-1' },
    { type: 'event', key: '2', label: 'Defekt', colorClass: 'event-dot-2' },
    { type: 'event', key: '7', label: 'Heimvorteil', colorClass: 'event-dot-7' },
    { type: 'event', key: '8', label: 'Heimbonus', colorClass: 'event-dot-8' },
    { type: 'event', key: '9', label: 'Heimmalus', colorClass: 'event-dot-9' },
    { type: 'event', key: '5', label: 'Attacken', colorClass: 'event-dot-5' },
    { type: 'event', key: '6', label: 'Konterattacken', colorClass: 'event-dot-6' }
  ];

  const renderedDots: string[] = [];
  const tooltipRows: string[] = [];

  for (const item of orderList) {
    if (item.type === 'jersey') {
      if (activeJerseys.has(item.key)) {
        renderedDots.push(`<span class="status-dot ${item.colorClass}"></span>`);
        tooltipRows.push(`
          <div class="status-tooltip-row">
            <span class="status-dot ${item.colorClass}"></span>
            <span>${esc(item.label)}</span>
          </div>
        `);
      }
    } else {
      const count = eventCounts.get(item.key);
      if (count !== undefined && count > 0) {
        const countSuffix = count > 1 ? ` (${count}x)` : '';
        renderedDots.push(`<span class="status-dot ${item.colorClass}"></span>`);
        tooltipRows.push(`
          <div class="status-tooltip-row">
            <span class="status-dot ${item.colorClass}"></span>
            <span>${esc(item.label)}${esc(countSuffix)}</span>
          </div>
        `);
      }
    }
  }

  if (row.superTeamId != null && row.teamId != null && row.superTeamId === row.teamId) {
    renderedDots.push(`<span class="status-dot status-dot-superteam"></span>`);
    tooltipRows.push(`
      <div class="status-tooltip-row">
        <span class="status-dot status-dot-superteam"></span>
        <span>Superteam-Teilnahme</span>
      </div>
    `);
  }

  if (renderedDots.length === 0) {
    return '';
  }

  return `
    <div class="status-dots-container">
      ${renderedDots.join('')}
      <div class="status-tooltip">
        <div class="status-tooltip-title">Status Details</div>
        ${tooltipRows.join('')}
      </div>
    </div>
  `;
}

export function renderRiderStatsRankBadge(label: string, variant: 'place' | 'gc'): string {
  return `<span class="rider-stats-rank-badge rider-stats-rank-badge-${variant}">${esc(label)}</span>`;
}

export function renderRiderStatsBreakaway(row: any): string {
  if (!row.isBreakaway || row.rowType !== 'stage_result' || row.finishStatus !== 'classified') {
    return '–';
  }

  return '<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>';
}

export function renderRiderStatsPlacement(row: any): string {
  if (row.finishStatus === 'otl') {
    return renderRiderStatsRankBadge('OTL', 'place');
  }
  if (row.finishStatus === 'dnf') {
    return renderRiderStatsRankBadge('DNF', 'place');
  }
  if (row.resultRank == null) {
    return '–';
  }
  const topRankClassName = row.resultRank <= 3 ? ` rider-stats-rank-badge-top-${row.resultRank}` : '';
  return `<span class="rider-stats-rank-badge rider-stats-rank-badge-place${topRankClassName}">${esc(String(row.resultRank))}</span>`;
}

export function renderRiderStatsGcPlacement(row: any): string {
  if (row.finishStatus !== 'classified' || row.gcRank == null) {
    return '–';
  }
  return renderRiderStatsRankBadge(String(row.gcRank), 'gc');
}

export function formatRiderStatsResultDetail(row: any): string {
  if (row.finishStatus === 'otl') {
    return formatNonFinisherReason(row.statusReason, true);
  }
  if (row.finishStatus === 'dnf') {
    return formatNonFinisherReason(row.statusReason, false);
  }
  if (row.stageTimeSeconds != null) {
    return `${row.resultLabel} · ${formatRaceTime(row.stageTimeSeconds)}`;
  }
  return row.resultLabel;
}

export function renderRiderStatsBody(rider: Rider | null, payload: RiderStatsPayload | null, isLoading = false): string {
  const teamName = rider?.activeTeamId != null
    ? state.teams.find((team) => team.id === rider.activeTeamId)?.name ?? null
    : null;
  const countryCode = rider?.country?.code3 ?? rider?.nationality ?? null;
  const countryFlag = countryCode ? renderFlag(countryCode) : '';
  const seasons = payload == null
    ? []
    : [...payload.seasons]
      .map((season) => ({
        ...season,
        raceBlocks: sortRiderStatsRaceBlocksNewestFirst(season.raceBlocks),
      }))
      .sort((left, right) => right.season - left.season);

  if (isLoading) {
    return `
      ${renderRiderStatsSummary(rider, payload, teamName, countryCode, countryFlag)}
      ${renderRiderStatsTabs(payload)}
      <section class="rider-stats-placeholder">
        <h3>Historie wird geladen</h3>
        <p>Die Karriereergebnisse dieses Fahrers werden zusammengestellt.</p>
      </section>`;
  }

  if (!payload) {
    return `
      ${renderRiderStatsSummary(rider, payload, teamName, countryCode, countryFlag)}
      ${renderRiderStatsTabs(payload)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`;
  }

  if (state.riderStatsTab === 'skills') {
    return `
      ${renderRiderStatsSummary(rider, payload, teamName, countryCode, countryFlag)}
      ${renderRiderStatsTabs(payload)}
      ${renderRiderStatsSkillsTab(rider, payload)}`;
  }

  if (state.riderStatsTab === 'fatigue') {
    return `
      ${renderRiderStatsSummary(rider, payload, teamName, countryCode, countryFlag)}
      ${renderRiderStatsTabs(payload)}
      ${renderRiderStatsFatigueTab(rider, payload)}`;
  }

  if (state.riderStatsTab === 'program') {
    return `
      ${renderRiderStatsSummary(rider, payload, teamName, countryCode, countryFlag)}
      ${renderRiderStatsTabs(payload)}
      ${renderRiderStatsProgramTab(payload)}`;
  }

  if (state.riderStatsTab === 'form') {
    return `
      ${renderRiderStatsSummary(rider, payload, teamName, countryCode, countryFlag)}
      ${renderRiderStatsTabs(payload)}
      ${renderRiderStatsFormTab(payload)}`;
  }

  if (state.riderStatsTab === 'topResults') {
    return `
      ${renderRiderStatsSummary(rider, payload, teamName, countryCode, countryFlag)}
      ${renderRiderStatsTabs(payload)}
      ${renderRiderStatsTopResultsTab(payload)}`;
  }

  if (state.riderStatsTab === 'career') {
    return `
      ${renderRiderStatsSummary(rider, payload, teamName, countryCode, countryFlag)}
      ${renderRiderStatsTabs(payload)}
      ${renderRiderStatsCareerTab(payload)}`;
  }

  if (payload.seasons.length === 0) {
    return `
      ${renderRiderStatsSummary(rider, payload, teamName, countryCode, countryFlag)}
      ${renderRiderStatsTabs(payload)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`;
  }

  return `
    ${renderRiderStatsSummary(rider, payload, teamName, countryCode, countryFlag)}
    ${renderRiderStatsTabs(payload)}
    ${seasons.map((season) => `
      <section class="rider-stats-season">
        <div class="rider-stats-season-head">
          <h3>Saison ${season.season}</h3>
          <span>${season.raceBlocks.length} Rennen</span>
        </div>
        <div class="rider-stats-race-list">
          ${season.raceBlocks.map((block) => `
            <section class="rider-stats-race-block">
              <div class="rider-stats-race-head">
                <div>
                  <h4>${esc(block.raceName)}</h4>
                  <p>${esc(formatRiderStatsRaceBlockMeta(block))}</p>
                </div>
                ${renderRiderStatsRaceBadge(block.raceCategoryName, block.isStageRace, block.rows.filter((r: any) => r.rowType === 'stage_result').length || null)}
              </div>
              <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
                <table class="data-table rider-stats-table">
                  <colgroup>
                    <col style="width: 8%;">
                    <col style="width: 4.5%;">
                    <col style="width: 3.5%;">
                    <col style="width: 2.5%;">
                    <col style="width: 3.5%;">
                    <col style="width: 11%;">
                    <col style="width: 20%;">
                    <col style="width: 8%;">
                    <col style="width: 9.5%;">
                    <col style="width: 4.5%;">
                    <col style="width: 4.5%;">
                    <col style="width: 15%;">
                    <col style="width: 5%;">
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Datum</th>
                      <th>Platz</th>
                      <th>GC</th>
                      <th class="rider-stats-breakaway-col"></th>
                      <th>Wetter</th>
                      <th>Klasse</th>
                      <th>Rennen / Etappe</th>
                      <th>Status</th>
                      <th>Profil</th>
                      <th>km</th>
                      <th>HM</th>
                      <th>Ergebnis</th>
                      <th>Punkte</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${block.rows.map((row: any) => {
                      const isFinalRow = row.rowType !== 'stage_result';
                      const raceStageLabel = isFinalRow
                        ? `${row.raceName} · ${getRiderStatsRowTypeLabel(row.rowType)}`
                        : (row.stageName ? `${row.raceName} · ${row.stageName}` : row.raceName);
                      return `
                        <tr class="rider-stats-row${isFinalRow ? ' rider-stats-row-final' : ''}">
                          <td>${esc(formatDate(row.date))}</td>
                          <td>${renderRiderStatsPlacement(row)}</td>
                          <td>${renderRiderStatsGcPlacement(row)}</td>
                          <td class="rider-stats-breakaway-col">${renderRiderStatsBreakaway(row)}</td>
                          <td>${isFinalRow ? '' : renderWeatherIcon(row.rolledWeatherId, row.rolledWetterName)}</td>
                          <td>${isFinalRow ? renderRiderStatsFinalTypeBadge(row.rowType) : renderRiderStatsRaceBadge(row.raceCategoryName ? row.raceCategoryName.replace(/^world\s*tour\s*-\s*/i, '') : row.raceCategoryName, row.isStageRace, null)}</td>
                          <td>${esc(raceStageLabel)}</td>
                          <td class="status-cell">${renderStatusDotsColumn(row)}</td>
                          <td>${isFinalRow ? '–' : (row.profile ? `<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${row.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${renderStageProfileBadge(row.profile)}</button>` : '–')}</td>
                          <td>${isFinalRow ? '-' : (row.distanceKm != null ? esc(row.distanceKm.toFixed(1).replace('.', ',')) : '–')}</td>
                          <td>${isFinalRow ? '-' : (row.elevationGainMeters != null ? esc(String(Math.round(row.elevationGainMeters))) : '–')}</td>
                          <td>${esc(formatRiderStatsResultDetail(row))}</td>
                          <td>${row.seasonPoints}</td>
                        </tr>`;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </section>`).join('')}
        </div>
      </section>`).join('')}`;
}

function updateRiderStatsModalWidth(): void {
  const card = document.querySelector('.rider-stats-modal-card') as HTMLElement | null;
  if (!card) return;
  const wideTabs = ['results', 'topResults', 'career', 'form', 'fatigue'];
  if (wideTabs.includes(state.riderStatsTab)) {
    card.style.minWidth = 'min(1475px, 95vw)';
    card.style.maxWidth = '1687px';
  } else {
    card.style.minWidth = '';
    card.style.maxWidth = '';
  }
}

export async function openRiderStats(riderId: number): Promise<void> {
  const rider = findRiderById(riderId);
  const teamName = rider?.activeTeamId != null
    ? state.teams.find((team) => team.id === rider.activeTeamId)?.name ?? null
    : null;

  comparedRiders = [];
  selectedCompareTeamId = null;
  state.riderStatsSelectedRiderId = riderId;
  state.riderStatsTab = 'results';
  updateRiderStatsModalWidth();
  state.riderStatsTopResultsFilterCategory = null;
  state.riderStatsTopResultsFilterSeason = null;
  state.riderStatsTopResultsPage = 1;
  $('rider-stats-title').innerHTML = renderRiderStatsTitle(rider, null);
  $('rider-stats-jersey').innerHTML = '';
  const ageLabel = rider?.age ? ` · Alter ${rider.age}` : '';
  $('rider-stats-meta').textContent = rider
    ? `${rider.role?.name ?? 'Fahrer'} · ${teamName ?? 'Team unbekannt'}${ageLabel}`
    : 'Historie wird geladen';
  $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, null, true);
  showModal('riderStats');

  const res = await api.getRiderStats(riderId);
  if (state.riderStatsSelectedRiderId !== riderId) {
    return;
  }

  if (!res.success || !res.data) {
    const errAgeLabel = rider?.age ? ` · Alter ${rider.age}` : '';
    $('rider-stats-meta').textContent = rider
      ? `${rider.role?.name ?? 'Fahrer'} · ${teamName ?? 'Team unbekannt'}${errAgeLabel}`
      : 'Fehler beim Laden';
    $('rider-stats-body').innerHTML = `
      <section class="rider-stats-placeholder">
        <h3>Historie konnte nicht geladen werden</h3>
        <p>${esc(res.error ?? 'Unbekannter Fehler')}</p>
      </section>`;
    return;
  }

  state.riderStatsPayload = res.data;
  updateRiderStatsModalWidth();
  $('rider-stats-title').innerHTML = renderRiderStatsTitle(rider, res.data);
  $('rider-stats-jersey').innerHTML = '';
  const finalAgeLabel = res.data.age ? ` · Alter ${res.data.age}` : (rider?.age ? ` · Alter ${rider.age}` : '');
  const mentorLabel = res.data.mentorName ? ` · Mentor: ${res.data.mentorName}` : '';
  const mentoredLabel = res.data.mentoredRiderNames && res.data.mentoredRiderNames.length > 0 ? ` · Mentor von: ${res.data.mentoredRiderNames.join(' - ')}` : '';
  $('rider-stats-meta').textContent = `${rider?.role?.name ?? 'Fahrer'} · ${res.data.teamName ?? teamName ?? 'Ohne aktives Team'}${finalAgeLabel} · ${res.data.seasons.length} Saisons${mentorLabel}${mentoredLabel}`;
  $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, res.data, false);
}

export function initRiderStatsListeners(): void {
  $('rider-stats-body').addEventListener('click', (event) => {
    // Handle chart toggle checkbox changes
    if (event.target && (event.target as Element).id && (event.target as Element).id.startsWith('toggle-chart-')) {
      const targetId = (event.target as HTMLInputElement).id;
      const checked = (event.target as HTMLInputElement).checked;
      if (targetId === 'toggle-chart-form') {
        chartToggles.form = checked;
      } else if (targetId === 'toggle-chart-combined-fatigue') {
        chartToggles.combinedFatigue = checked;
      } else if (targetId === 'toggle-chart-short-fatigue') {
        chartToggles.shortFatigue = checked;
      } else if (targetId === 'toggle-chart-long-fatigue') {
        chartToggles.longFatigue = checked;
      }
      const rider = findRiderById(state.riderStatsSelectedRiderId);
      $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, state.riderStatsPayload, false);
      return;
    }

    const tabButton = (event.target as Element).closest<HTMLButtonElement>('button[data-rider-stats-tab]');
    if (!tabButton) {
      // Handle remove click
      const removeBtn = (event.target as Element).closest<HTMLButtonElement>('button[data-remove-compare-id]');
      if (removeBtn) {
        const idToRemove = Number(removeBtn.dataset['removeCompareId']);
        comparedRiders = comparedRiders.filter(r => r.riderId !== idToRemove);
        const rider = findRiderById(state.riderStatsSelectedRiderId);
        $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, state.riderStatsPayload, false);
        return;
      }

      // Handle pagination click
      const pageButton = (event.target as Element).closest<HTMLButtonElement>('button[data-top-results-page]');
      if (pageButton) {
        const newPage = Number(pageButton.dataset['topResultsPage']);
        if (!isNaN(newPage) && newPage >= 1) {
          state.riderStatsTopResultsPage = newPage;
          const rider = findRiderById(state.riderStatsSelectedRiderId);
          $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, state.riderStatsPayload, false);
        }
        return;
      }

      // Handle stage profile click
      const profileLinkButton = (event.target as Element).closest<HTMLButtonElement>('button[data-stage-profile-id]');
      if (profileLinkButton) {
        const stageId = Number(profileLinkButton.dataset['stageProfileId']);
        if (Number.isFinite(stageId)) {
          void openDashboardStageProfile(stageId);
        }
        return;
      }
      return;
    }

    const nextTab = tabButton.dataset['riderStatsTab'] as RiderStatsTab;
    if (nextTab !== 'results' && nextTab !== 'program' && nextTab !== 'form' && nextTab !== 'topResults' && nextTab !== 'skills' && nextTab !== 'career' && nextTab !== 'fatigue') {
      return;
    }

    if (nextTab === 'program' && (state.riderStatsPayload?.programRaces.length ?? 0) === 0) {
      return;
    }

    state.riderStatsTab = nextTab;
    updateRiderStatsModalWidth();
    const rider = findRiderById(state.riderStatsSelectedRiderId);
    $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, state.riderStatsPayload, false);
  });

  $('rider-stats-body').addEventListener('change', async (event) => {
    const target = event.target as HTMLInputElement;
    if (target.id === 'rider-stats-filter-category') {
      state.riderStatsTopResultsFilterCategory = target.value === 'all' ? null : target.value;
      state.riderStatsTopResultsPage = 1;
      const rider = findRiderById(state.riderStatsSelectedRiderId);
      $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, state.riderStatsPayload, false);
    } else if (target.id === 'rider-stats-filter-season') {
      state.riderStatsTopResultsFilterSeason = target.value === 'all' ? null : Number(target.value);
      state.riderStatsTopResultsPage = 1;
      const rider = findRiderById(state.riderStatsSelectedRiderId);
      $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, state.riderStatsPayload, false);
    } else if (target.classList.contains('rider-stats-filter-checkbox')) {
      const filterType = target.dataset['filterType'] as 'gc' | 'mountain' | 'points' | 'youth' | 'oneDay' | 'stage';
      state.riderStatsTopResultsFilters[filterType] = target.checked;
      state.riderStatsTopResultsPage = 1;
      const rider = findRiderById(state.riderStatsSelectedRiderId);
      $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, state.riderStatsPayload, false);
    } else if (target.id === 'rider-compare-team-select') {
      const val = target.value;
      selectedCompareTeamId = val ? Number(val) : null;
      const rider = findRiderById(state.riderStatsSelectedRiderId);
      $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, state.riderStatsPayload, false);
    } else if (target.id === 'rider-compare-rider-select') {
      const val = target.value;
      if (val) {
        const riderId = Number(val);
        if (comparedRiders.length >= 10) {
          alert('Sie können maximal 10 Fahrer vergleichen.');
          target.value = '';
          return;
        }
        
        // Fetch rider stats
        const res = await api.getRiderStats(riderId, true);
        if (res.success && res.data) {
          comparedRiders.push({
            riderId: res.data.riderId,
            riderName: res.data.riderName,
            teamId: res.data.teamId,
            teamName: res.data.teamName,
            formHistory: res.data.formHistory ?? [],
            peakDates: res.data.peakDates ?? [],
            currentSeasonPoints: res.data.currentSeasonPoints ?? 0,
            currentSeasonRank: res.data.currentSeasonRank ?? null,
          });
        } else {
          alert('Formverlauf konnte nicht geladen werden: ' + (res.error ?? ''));
        }
        
        const rider = findRiderById(state.riderStatsSelectedRiderId);
        $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, state.riderStatsPayload, false);
      }
    }
  });
}

function getCategoryPriority(categoryName: string | null | undefined): number {
  const norm = (categoryName ?? '').toLowerCase();
  if (norm.includes('tour de france')) return 0;
  if (norm.includes('grand tour')) return 1;
  if (norm.includes('monument')) return 2;
  if (norm.includes('stage race high')) return 3;
  if (norm.includes('one day high')) return 4;
  if (norm.includes('stage race middle')) return 5;
  if (norm.includes('one day middle')) return 6;
  if (norm.includes('stage race low')) return 7;
  if (norm.includes('one day low')) return 8;
  return 9;
}

export function renderRiderStatsTopResultsTab(payload: RiderStatsPayload): string {
  const allRows: any[] = [];
  for (const s of payload.seasons) {
    for (const block of s.raceBlocks) {
      for (const row of block.rows) {
        allRows.push({
          ...row,
          season: s.season,
          isStageRace: block.isStageRace,
        });
      }
    }
  }

  const categories = Array.from(new Set(allRows.map(r => r.raceCategoryName).filter(Boolean))) as string[];
  categories.sort((a, b) => a.localeCompare(b, 'de'));

  const seasonsList = Array.from(new Set(allRows.map(r => r.season))).sort((a, b) => b - a);

  let filteredRows = allRows.filter(r => {
    const isFinalRow = r.rowType !== 'stage_result';
    if (isFinalRow) {
      if (r.rowType === 'gc_final') return state.riderStatsTopResultsFilters.gc;
      if (r.rowType === 'mountain_final') return state.riderStatsTopResultsFilters.mountain;
      if (r.rowType === 'points_final') return state.riderStatsTopResultsFilters.points;
      if (r.rowType === 'youth_final') return state.riderStatsTopResultsFilters.youth;
      return true;
    } else {
      if (r.isStageRace) {
        return state.riderStatsTopResultsFilters.stage;
      } else {
        return state.riderStatsTopResultsFilters.oneDay;
      }
    }
  });

  if (state.riderStatsTopResultsFilterCategory) {
    const filterVal = state.riderStatsTopResultsFilterCategory;
    if (filterVal.endsWith('-etappen')) {
      const catName = filterVal.substring(0, filterVal.length - '-etappen'.length);
      filteredRows = filteredRows.filter(r => r.raceCategoryName === catName && r.rowType === 'stage_result');
    } else if (filterVal.endsWith('-gc')) {
      const catName = filterVal.substring(0, filterVal.length - '-gc'.length);
      filteredRows = filteredRows.filter(r => r.raceCategoryName === catName && r.rowType !== 'stage_result');
    } else {
      filteredRows = filteredRows.filter(r => r.raceCategoryName === filterVal);
    }
  }
  if (state.riderStatsTopResultsFilterSeason != null) {
    filteredRows = filteredRows.filter(r => r.season === state.riderStatsTopResultsFilterSeason);
  }

  filteredRows.sort((a, b) => {
    if (b.seasonPoints !== a.seasonPoints) {
      return b.seasonPoints - a.seasonPoints;
    }

    const aIsFinal = a.rowType !== 'stage_result';
    const bIsFinal = b.rowType !== 'stage_result';
    const rankA = a.resultRank ?? 9999;
    const rankB = b.resultRank ?? 9999;

    if (!state.riderStatsTopResultsFilterCategory) {
      const prioA = getCategoryPriority(a.raceCategoryName);
      const prioB = getCategoryPriority(b.raceCategoryName);
      if (prioA !== prioB) {
        return prioA - prioB;
      }
      if (aIsFinal !== bIsFinal) {
        return aIsFinal ? -1 : 1;
      }
      return rankA - rankB;
    } else {
      if (rankA !== rankB) {
        return rankA - rankB;
      }
      if (aIsFinal !== bIsFinal) {
        return aIsFinal ? -1 : 1;
      }
      return 0;
    }
  });

  const itemsPerPage = 200;
  const activeRows = filteredRows.slice(0, 1000);
  const totalPages = Math.max(1, Math.ceil(activeRows.length / itemsPerPage));
  if (state.riderStatsTopResultsPage > totalPages) {
    state.riderStatsTopResultsPage = totalPages;
  }
  const startIndex = (state.riderStatsTopResultsPage - 1) * itemsPerPage;
  const paginatedRows = activeRows.slice(startIndex, startIndex + itemsPerPage);

  const categoryOptionsHtml = categories.map(cat => {
    const isStage = cat.toLowerCase().includes('stage race') || cat.toLowerCase().includes('grand tour') || cat.toLowerCase().includes('tour de france');
    if (isStage) {
      const valEtappen = `${cat}-etappen`;
      const valGc = `${cat}-gc`;
      return `
        <option value="${esc(valEtappen)}" ${state.riderStatsTopResultsFilterCategory === valEtappen ? 'selected' : ''}>${esc(cat)} - Etappen</option>
        <option value="${esc(valGc)}" ${state.riderStatsTopResultsFilterCategory === valGc ? 'selected' : ''}>${esc(cat)} - GC</option>
      `;
    } else {
      return `<option value="${esc(cat)}" ${state.riderStatsTopResultsFilterCategory === cat ? 'selected' : ''}>${esc(cat)}</option>`;
    }
  }).join('');

  const filtersHtml = `
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="rider-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${categoryOptionsHtml}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Saison:</label>
        <select id="rider-stats-filter-season" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">All Time</option>
          ${seasonsList.map(yr => `<option value="${yr}" ${state.riderStatsTopResultsFilterSeason === yr ? 'selected' : ''}>Saison ${yr}</option>`).join('')}
        </select>
      </div>
      
      <div class="top-results-checkboxes" style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; border-left: 1px solid rgba(255, 255, 255, 0.15); padding-left: 1rem;">
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="rider-stats-filter-checkbox" data-filter-type="gc" ${state.riderStatsTopResultsFilters.gc ? 'checked' : ''} style="accent-color: #ffd700; width: 14px; height: 14px; cursor: pointer;">
          nur GC
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="rider-stats-filter-checkbox" data-filter-type="mountain" ${state.riderStatsTopResultsFilters.mountain ? 'checked' : ''} style="accent-color: #ff4d4d; width: 14px; height: 14px; cursor: pointer;">
          nur Bergwertung
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="rider-stats-filter-checkbox" data-filter-type="points" ${state.riderStatsTopResultsFilters.points ? 'checked' : ''} style="accent-color: #2ecc71; width: 14px; height: 14px; cursor: pointer;">
          nur Punktewertung
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="rider-stats-filter-checkbox" data-filter-type="youth" ${state.riderStatsTopResultsFilters.youth ? 'checked' : ''} style="accent-color: #ffffff; width: 14px; height: 14px; cursor: pointer;">
          nur Nachwuchs
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="rider-stats-filter-checkbox" data-filter-type="oneDay" ${state.riderStatsTopResultsFilters.oneDay ? 'checked' : ''} style="accent-color: #9b59b6; width: 14px; height: 14px; cursor: pointer;">
          One Day Races
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="rider-stats-filter-checkbox" data-filter-type="stage" ${state.riderStatsTopResultsFilters.stage ? 'checked' : ''} style="accent-color: #3498db; width: 14px; height: 14px; cursor: pointer;">
          Etappenwertungen
        </label>
      </div>
    </div>
  `;

  const tableRowsHtml = paginatedRows.length === 0
    ? `<tr><td colspan="9" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>`
    : paginatedRows.map(row => {
        const isFinalRow = row.rowType !== 'stage_result';
        const raceStageLabel = isFinalRow
          ? `${row.raceName} · ${getRiderStatsRowTypeLabel(row.rowType)}`
          : (row.stageNumber && row.isStageRace ? `${row.raceName} · Etappe ${row.stageNumber}` : row.raceName);

        let stagePlacementHtml = '–';
        let gcPlacementHtml = '–';

        if (row.finishStatus === 'otl') {
          stagePlacementHtml = renderRiderStatsRankBadge('OTL', 'place');
        } else if (row.finishStatus === 'dnf') {
          stagePlacementHtml = renderRiderStatsRankBadge('DNF', 'place');
        } else if (row.resultRank == null) {
          // Keep -
        } else if (isFinalRow) {
          const className = resolveRiderStatsFinalTypeClassName(row.rowType);
          gcPlacementHtml = `<span class="rider-stats-final-type ${className}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${row.resultRank}</span>`;
        } else {
          const topRankClassName = row.resultRank <= 3 ? ` rider-stats-rank-badge-top-${row.resultRank}` : '';
          stagePlacementHtml = `<span class="rider-stats-rank-badge rider-stats-rank-badge-place${topRankClassName}">${esc(String(row.resultRank))}</span>`;
        }

        const profileBadgeHtml = isFinalRow ? '–' : (row.profile ? `<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${row.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${renderStageProfileBadge(row.profile)}</button>` : '–');
        const stageScoreBadgeHtml = !isFinalRow && row.stageScore != null && row.stageScore > 0 ? renderStageEditorScoreBadge(row.stageScore, 0, 350) : '–';
        const categoryBadgeHtml = renderRiderStatsRaceBadge(row.raceCategoryName ? row.raceCategoryName.replace(/^world\s*tour\s*-\s*/i, '') : row.raceCategoryName, row.isStageRace, null);

        return `
          <tr class="rider-stats-row${isFinalRow ? ' rider-stats-row-final' : ''}">
            <td>${stagePlacementHtml}</td>
            <td>${gcPlacementHtml}</td>
            <td><strong>${esc(raceStageLabel)}</strong>${isFinalRow ? '' : renderWeatherIcon(row.rolledWeatherId, row.rolledWetterName)}</td>
            <td class="status-cell">${renderStatusDotsColumn(row)}</td>
            <td>${profileBadgeHtml}</td>
            <td>${stageScoreBadgeHtml}</td>
            <td>${categoryBadgeHtml}</td>
            <td>Saison ${row.season}</td>
            <td><strong>${row.seasonPoints}</strong></td>
          </tr>
        `;
      }).join('');

  const paginationHtml = totalPages > 1
    ? `
      <div class="pagination-wrap" style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem; align-items: center;">
        <button type="button" class="btn btn-secondary btn-sm" data-top-results-page="${state.riderStatsTopResultsPage - 1}" ${state.riderStatsTopResultsPage === 1 ? 'disabled' : ''}>&laquo; Zurück</button>
        <span style="font-weight: 600; color: #ccc;">Seite ${state.riderStatsTopResultsPage} von ${totalPages}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-top-results-page="${state.riderStatsTopResultsPage + 1}" ${state.riderStatsTopResultsPage === totalPages ? 'disabled' : ''}>Weiter &raquo;</button>
      </div>
    `
    : '';

  return `
    <section class="rider-stats-top-results" style="margin-top: 1.5rem;">
      ${filtersHtml}
      <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
        <table class="data-table rider-stats-table">
          <colgroup>
            <col style="width: 6%;">
            <col style="width: 9%;">
            <col style="width: 28%;">
            <col style="width: 10%;">
            <col style="width: 10%;">
            <col style="width: 5%;">
            <col style="width: 18%;">
            <col style="width: 7%;">
            <col style="width: 7%;">
          </colgroup>
          <thead>
            <tr>
              <th>Platz</th>
              <th>GC / Wertung</th>
              <th>Rennen</th>
              <th>Status</th>
              <th>Profil</th>
              <th>Score</th>
              <th>Klasse</th>
              <th>Saison</th>
              <th>Punkte</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
      </div>
      ${paginationHtml}
    </section>
  `;
}

export function renderRiderStatsCareerTab(payload: RiderStatsPayload): string {
  const stats = payload.careerStats || {
    breakawayAttempts: 0,
    attacks: 0,
    counterAttacks: 0,
    crashes: 0,
    defects: 0,
    illnesses: 0,
    illnessDays: 0,
    injuries: 0,
    injuryDays: 0,
    dnsCount: 0,
    dnfCount: 0,
    otlCount: 0,
    totalGcWins: 0,
    totalStageWins: 0,
    successfulBreakaways: 0,
    superteamCount: 0,
    categories: {}
  };

  const careerRaceDays = (payload.careerRaceDaysBySeason || []).reduce((sum, r) => {
    const days = r.raceDays ?? (r as any).race_days ?? (r as any).racedays ?? 0;
    return sum + Number(days);
  }, 0);

  // Helper function to render badge
  const renderCareerBadge = (
    displayValue: string | number,
    type: 'gold' | 'silver' | 'bronze' | 'green' | 'red' | 'white' | 'purple' | 'breakaway',
    title: string,
    value?: number
  ): string => {
    const checkVal = value !== undefined ? value : (typeof displayValue === 'number' ? displayValue : parseFloat(String(displayValue)) || 0);
    let style = 'padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;';
    if (checkVal === 0) {
      style += 'background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);';
    } else {
      if (type === 'gold') {
        style += 'background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);';
      } else if (type === 'silver') {
        style += 'background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);';
      } else if (type === 'bronze') {
        style += 'background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);';
      } else if (type === 'purple') {
        style += 'background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);';
      } else if (type === 'green') {
        style += 'background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);';
      } else if (type === 'red') {
        style += 'background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);';
      } else if (type === 'white') {
        style += 'background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);';
      } else if (type === 'breakaway') {
        style += 'background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);';
      }
    }
    return `<span style="${style}" title="${esc(title)}">${displayValue}</span>`;
  };

  const categoriesToShow = [
    { key: 'World Tour - Tour de France', name: 'Tour de France', isStage: true },
    { key: 'World Tour - Grand Tour', name: 'Grand Tour', isStage: true },
    { key: 'World Tour - Monument', name: 'Monumente', isStage: false },
    { key: 'World Tour - Stage Race High', name: 'Stage Race (High)', isStage: true },
    { key: 'World Tour - Stage Race Middle', name: 'Stage Race (Middle)', isStage: true },
    { key: 'World Tour - Stage Race Low', name: 'Stage Race (Low)', isStage: true },
    { key: 'World Tour - One Day High', name: 'One Day (High)', isStage: false },
    { key: 'World Tour - One Day Middle', name: 'One Day (Middle)', isStage: false },
    { key: 'World Tour - One Day Low', name: 'One Day (Low)', isStage: false }
  ];

  return `
    <section class="rider-stats-career" style="margin-top: 1.5rem;">
      <!-- Career Summary cards -->
      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Siege</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #fbbf24;">${payload.careerWins ?? 0}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Renntage</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #a855f7;">${careerRaceDays}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Ausreißversuche</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #3498db;">${stats.breakawayAttempts}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Erf. Ausreißer</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #2ecc71;">${stats.successfulBreakaways ?? 0}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Ausreißer-Kms</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #c084fc; line-height: 1.25;">${Math.round(stats.breakawayKms ?? 0)}</div>
          <div style="font-size: 0.85rem; font-weight: 500; color: #cbd5e0; line-height: 1.25;">km</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Attacken</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #ffd700;">${stats.attacks}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Konterattacken</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #e67e22;">${stats.counterAttacks}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Stürze</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #e74c3c;">${stats.crashes}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Defekte</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #95a5a6;">${stats.defects}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">DNS</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #fc8181;">${stats.dnsCount ?? 0}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">DNF</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #f56565;">${stats.dnfCount ?? 0}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">OTL</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #e53e3e;">${stats.otlCount ?? 0}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Krankheiten</div>
          <div style="font-size: 1.45rem; font-weight: bold; color: #ed64a6; line-height: 1.25;">${stats.illnesses ?? 0}</div>
          <div style="font-size: 0.85rem; font-weight: 500; color: #cbd5e0; line-height: 1.25;">${stats.illnessDays ?? 0} Tage</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Verletzungen</div>
          <div style="font-size: 1.45rem; font-weight: bold; color: #f6ad55; line-height: 1.25;">${stats.injuries ?? 0}</div>
          <div style="font-size: 0.85rem; font-weight: 500; color: #cbd5e0; line-height: 1.25;">${stats.injuryDays ?? 0} Tage</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Heimvorteil</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #38bdf8; line-height: 1.25;">${stats.homeAdvantageDays ?? 0}</div>
          <div style="font-size: 0.85rem; font-weight: 500; color: #cbd5e0; line-height: 1.25;">Tage</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Heimbonus</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #facc15; line-height: 1.25;">${stats.superHomeAdvantageDays ?? 0}</div>
          <div style="font-size: 0.85rem; font-weight: 500; color: #cbd5e0; line-height: 1.25;">Tage</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Heimmalus</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #fb7185; line-height: 1.25;">${stats.homePressureDays ?? 0}</div>
          <div style="font-size: 0.85rem; font-weight: 500; color: #cbd5e0; line-height: 1.25;">Tage</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Superteam</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #6366f1;">${stats.superteamCount ?? 0}</div>
        </div>
      </div>

      <!-- Categories details -->
      <h3 style="margin-bottom: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 0.5rem; font-weight: 500; font-size: 1.15rem; color: #fff;">Ergebnisse nach Rennklasse</h3>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 1fr; gap: 1.25rem;">
        ${categoriesToShow.map(cat => {
          const catData = stats.categories[cat.key] || {
            gcWins: 0,
            gcSecond: 0,
            gcThird: 0,
            gcTopTen: 0,
            stageWins: 0,
            stageSecond: 0,
            stageThird: 0,
            stageTopTen: 0,
            oneDayWins: 0,
            oneDaySecond: 0,
            oneDayThird: 0,
            oneDayTopTen: 0,
            mountainWins: 0,
            pointsWins: 0,
            youthWins: 0,
            breakawayWins: 0,
            raceDays: 0,
            leaderJerseys: 0,
            pointsJerseys: 0,
            mountainJerseys: 0,
            youthJerseys: 0,
            breakawayJerseys: 0,
            sprintWins: 0,
            climbWinsHC: 0,
            climbWins1: 0,
            climbWins2: 0,
            climbWins3: 0,
            climbWins4: 0,
            winFlat: 0,
            winRolling: 0,
            winHilly: 0,
            winHillyDifficult: 0,
            winMediumMountain: 0,
            winMountain: 0,
            winHighMountain: 0,
            winCobble: 0,
            winCobbleHill: 0,
            winITT: 0,
            winTTT: 0,
            winWeather1: 0,
            winWeather2: 0,
            winWeather3: 0,
            winWeather4: 0,
            winWeather5: 0,
            winWeather6: 0,
            winWeather7: 0,
          };

          return `
            <div style="position: relative; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; height: 415px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem; overflow: hidden; white-space: nowrap;">
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${esc(cat.name)}">${esc(cat.name)}</span>
                ${renderRiderStatsCategoryBadge(cat.key)}
              </div>
              
              ${cat.isStage ? `
                <!-- Stage Race layout: GC & Classifications -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">GC & Wertungen</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${renderCareerBadge(catData.gcWins, 'gold', 'Gesamtwertung Siege')}
                    ${renderCareerBadge(catData.gcSecond, 'silver', 'Gesamtwertung Platz 2')}
                    ${renderCareerBadge(catData.gcThird, 'bronze', 'Gesamtwertung Platz 3')}
                    ${renderCareerBadge(catData.gcTopTen || 0, 'purple', 'Gesamtwertung Ränge 4-10')}
                    <span style="border-left: 1px solid rgba(255,255,255,0.15); height: 1rem; margin: 0 0.1rem; display: inline-block;"></span>
                    ${renderCareerBadge(catData.mountainWins, 'red', 'Bergwertung Siege')}
                    ${renderCareerBadge(catData.pointsWins, 'green', 'Punktewertung Siege')}
                    ${renderCareerBadge(catData.youthWins, 'white', 'Nachwuchswertung Siege')}
                    ${renderCareerBadge(catData.breakawayWins || 0, 'breakaway', 'Ausreißerwertung Siege')}
                  </div>
                </div>
                
                <!-- Etappenergebnisse -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Etappenergebnisse</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${renderCareerBadge(catData.stageWins, 'gold', 'Etappensiege')}
                    ${renderCareerBadge(catData.stageSecond, 'silver', 'Etappen Platz 2')}
                    ${renderCareerBadge(catData.stageThird, 'bronze', 'Etappen Platz 3')}
                    ${renderCareerBadge(catData.stageTopTen || 0, 'purple', 'Etappen Ränge 4-10')}
                  </div>
                </div>

                <!-- Führungstrikots -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Führungstrikot Tage</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    <!-- Gelbes Trikot (GC) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${
                      (catData.leaderJerseys || 0) === 0
                        ? 'background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);'
                        : 'background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 4px rgba(250, 204, 21, 0.4);'
                    }" title="Tage im Gelben Trikot (GC)">
                      🎽 ${catData.leaderJerseys || 0}
                    </span>
                    <!-- Grünes Trikot (Punkte) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${
                      (catData.pointsJerseys || 0) === 0
                        ? 'background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);'
                        : 'background: linear-gradient(135deg, #bbf7d0, #4ade80); color: #14532d; border: 1px solid #22c55e; box-shadow: 0 0 4px rgba(74, 222, 128, 0.4);'
                    }" title="Tage im Grünen Trikot (Punkte)">
                      🎽 ${catData.pointsJerseys || 0}
                    </span>
                    <!-- Rotes Trikot (Berg) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${
                      (catData.mountainJerseys || 0) === 0
                        ? 'background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);'
                        : 'background: linear-gradient(135deg, #fecaca, #f87171); color: #7f1d1d; border: 1px solid #ef4444; box-shadow: 0 0 4px rgba(248, 113, 113, 0.4);'
                    }" title="Tage im Berg- / Roten Trikot (Berg)">
                      🎽 ${catData.mountainJerseys || 0}
                    </span>
                    <!-- Weißes Trikot (Nachwuchs) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${
                      (catData.youthJerseys || 0) === 0
                        ? 'background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);'
                        : 'background: linear-gradient(135deg, #ffffff, #e2e8f0); color: #1e293b; border: 1px solid #94a3b8; box-shadow: 0 0 4px rgba(255, 255, 255, 0.4);'
                    }" title="Tage im Weißen Trikot (Nachwuchs)">
                      🎽 ${catData.youthJerseys || 0}
                    </span>
                    <!-- Ausreißertrikot (Aktivste Fahrer) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${
                      (catData.breakawayJerseys || 0) === 0
                        ? 'background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);'
                        : 'background: linear-gradient(135deg, #f3e8ff, #d8b4fe); color: #581c87; border: 1px solid #a855f7; box-shadow: 0 0 4px rgba(168, 85, 247, 0.4);'
                    }" title="Tage im Ausreißertrikot (Aktivste Fahrer)">
                      🎽 ${catData.breakawayJerseys || 0}
                    </span>
                  </div>
                </div>
              ` : `
                <!-- One Day Race layout: Platzierungen -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Platzierungen</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${renderCareerBadge(catData.oneDayWins, 'gold', 'Siege')}
                    ${renderCareerBadge(catData.oneDaySecond, 'silver', 'Platz 2')}
                    ${renderCareerBadge(catData.oneDayThird, 'bronze', 'Platz 3')}
                    ${renderCareerBadge(catData.oneDayTopTen || 0, 'purple', 'Ränge 4-10')}
                  </div>
                </div>
                
                <!-- Spacer for Stage results -->
                <div style="visibility: hidden; font-size: 0.7rem; margin-bottom: 0.2rem; white-space: nowrap;">&nbsp;</div>
                
                <!-- Spacer for Jerseys -->
                <div style="visibility: hidden; font-size: 0.7rem; margin-bottom: 0.2rem; white-space: nowrap;">&nbsp;</div>
              `}
              
              <!-- Checkpoint-Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Checkpoint-Siege</div>
                <div style="display: flex; gap: 0.3rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${renderCareerBadge(catData.sprintWins || 0, 'green', 'Sprint: Gewonnene Zwischensprints')}
                  ${renderCareerBadge(catData.climbWinsHC || 0, 'red', 'HC: Gewonnene HC-Bergwertungen')}
                  ${renderCareerBadge(catData.climbWins1 || 0, 'red', 'C1: Gewonnene Bergwertungen Kategorie 1')}
                  ${renderCareerBadge(catData.climbWins2 || 0, 'red', 'C2: Gewonnene Bergwertungen Kategorie 2')}
                  ${renderCareerBadge(catData.climbWins3 || 0, 'red', 'C3: Gewonnene Bergwertungen Kategorie 3')}
                  ${renderCareerBadge(catData.climbWins4 || 0, 'red', 'C4: Gewonnene Bergwertungen Kategorie 4')}
                </div>
              </div>

              <!-- Profil Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Profil Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${renderProfileWinBadge(catData.winFlat || 0, 'flat', 'Flach (Flat)')}
                  ${renderProfileWinBadge(catData.winRolling || 0, 'rolling', 'Hügelig leicht (Rolling)')}
                  ${renderProfileWinBadge(catData.winHilly || 0, 'hilly', 'Hügelig (Hilly)')}
                  ${renderProfileWinBadge(catData.winHillyDifficult || 0, 'hilly_difficult', 'Hügelig schwer (Hilly Difficult)')}
                  ${renderProfileWinBadge(catData.winMediumMountain || 0, 'medium_mountain', 'Mittelgebirge (Medium Mountain)')}
                  ${renderProfileWinBadge(catData.winMountain || 0, 'mountain', 'Hochgebirge (Mountain)')}
                  ${renderProfileWinBadge(catData.winHighMountain || 0, 'high_mountain', 'Hochgebirge schwer (High Mountain)')}
                  ${renderProfileWinBadge(catData.winCobble || 0, 'cobble', 'Kopfsteinpflaster (Cobble)')}
                  ${renderProfileWinBadge(catData.winCobbleHill || 0, 'cobble_hill', 'Kopfsteinpflaster Hügel (Cobble Hill)')}
                  ${renderProfileWinBadge(catData.winITT || 0, 'itt', 'Einzelzeitfahren (ITT)')}
                  ${renderProfileWinBadge(catData.winTTT || 0, 'ttt', 'Mannschaftszeitfahren (TTT)')}
                </div>
              </div>

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${renderWeatherWinBadge(catData.winWeather1 || 0, 1, 'Sonnig')}
                  ${renderWeatherWinBadge(catData.winWeather2 || 0, 2, 'Extreme Hitze')}
                  ${renderWeatherWinBadge(catData.winWeather3 || 0, 3, 'Leichter Regen')}
                  ${renderWeatherWinBadge(catData.winWeather4 || 0, 4, 'Starkregen')}
                  ${renderWeatherWinBadge(catData.winWeather5 || 0, 5, 'Starker Wind')}
                  ${renderWeatherWinBadge(catData.winWeather6 || 0, 6, 'Dichter Nebel')}
                  ${renderWeatherWinBadge(catData.winWeather7 || 0, 7, 'Schnee/Eis')}
                </div>
              </div>
              
              <!-- Race Days in bottom right -->
              <div style="display: flex; justify-content: flex-end; align-items: center; font-size: 0.8rem; color: #888; white-space: nowrap;" title="Renntage in dieser Rennklasse">
                ${RIDER_STATS_ICONS.raceDays}
                <span style="font-weight: bold; color: #a855f7; margin-left: 0.25rem;">${catData.raceDays || 0} Tage</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

(window as any).openRiderStatsFromRiderStats = openRiderStats;
