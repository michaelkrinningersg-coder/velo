import { api } from '../api';
import {
  $,
  esc,
  state,
  renderRiderNameLink,
  renderTeamNameLink,
  formatDate,
  formatRaceTime,
  renderFlag,
  renderMiniJersey,
  findRiderById,
  showModal,
  resolveRaceCategoryBadgeStyle,
  buildRaceCategoryBadgeCssVariables,
  formatNonFinisherReason,
  renderSeasonFormPhaseIndicator,
  resolveTeamJerseyAssetPath,
} from '../state';
import { formatRaceDateRange, renderStageProfileBadge, raceCategoryBadge, raceCategoryNameBadge, openDashboardStageProfile } from './dashboard';
import type { Rider, RiderStatsPayload, RiderFormHistoryEntry } from '../../../shared/types';
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
  seasonForm: false,
  raceForm: false,
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

export function renderFilterButton(
  label: string,
  isActive: boolean,
  activeBg: string,
  activeText: string,
  hoverBorderColor: string,
  dataAttr: string,
  dataValue: string
): string {
  const baseStyle = isActive
    ? `background: ${activeBg}; border: 1px solid transparent; color: ${activeText}; box-shadow: 0 0 8px ${hoverBorderColor}; font-weight: 700;`
    : `background: var(--bg-800); border: 1px solid var(--border); color: var(--text-300);`;
  
  return `
    <button type="button"
      class="results-type-btn"
      ${dataAttr}="${esc(dataValue)}"
      style="width: 120px; height: 24px; padding: 0; font-size: 0.8rem; font-weight: ${isActive ? '700' : '500'}; line-height: 22px; text-align: center; border-radius: 999px; transition: all 0.15s ease; cursor: pointer; display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ${baseStyle}"
      onmouseenter="if(!${isActive}) this.style.borderColor='${hoverBorderColor}'"
      onmouseleave="if(!${isActive}) this.style.borderColor='var(--border)'"
    >${esc(label)}</button>
  `;
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
      case 'Flat': return 'Flachlandspezialist';
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
    case 'Flat': return RIDER_STATS_ICONS.flat;
    default: return '';
  }
}

// Conic-Ring (Broadcast): Segmente als [Farbe, Anteil-0..1]-Paare
function renderBroadcastRing(segments: Array<[string, number]>, label: string, inner: string, title = ''): string {
  let acc = 0;
  const stops: string[] = [];
  for (const [color, frac] of segments) {
    const f = Math.max(0, Math.min(1, frac));
    if (f <= 0) continue;
    const start = acc;
    acc = Math.min(1, acc + f);
    stops.push(`${color} ${start}turn ${acc}turn`);
  }
  stops.push(`#16223a ${acc}turn 1turn`);
  const grad = `conic-gradient(${stops.join(', ')})`;
  return `
    <div style="display:flex; flex-direction:column; align-items:center; gap:6px;"${title ? ` title="${esc(title)}"` : ''}>
      <div style="width:66px; height:66px; border-radius:50%; background:${grad}; display:flex; align-items:center; justify-content:center;">
        <div style="width:52px; height:52px; border-radius:50%; background:#0b1424; display:flex; flex-direction:column; align-items:center; justify-content:center; line-height:1;">${inner}</div>
      </div>
      <span style="font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.12em; color:#6a7a95;">${label}</span>
    </div>`;
}

export function renderRiderStatsSummary(rider: Rider | null, payload: RiderStatsPayload | null, teamName: string | null, countryCode: string | null, countryFlag: string): string {
  const resolvedCountryCode = payload?.countryCode ?? countryCode ?? null;
  const resolvedCountryFlag = resolvedCountryCode ? renderFlag(resolvedCountryCode) : countryFlag;
  const resolvedRoleName = payload?.roleName ?? rider?.role?.name ?? 'Ohne Rolle';
  const resolvedRoleId = rider?.roleId ?? null;
  const resolvedOverallRating = payload?.overallRating ?? rider?.overallRating ?? 0;
  const resolvedTeamId = payload?.teamId ?? rider?.activeTeamId ?? null;
  const resolvedTeamName = payload?.teamName ?? teamName ?? 'Ohne aktives Team';
  const resolvedSeasonPhase = payload?.seasonFormPhase ?? rider?.seasonFormPhase ?? 'neutral';
  const programName = payload?.program?.name ?? rider?.seasonProgram?.name ?? '-';
  const formBonus = payload?.formBonus ?? rider?.formBonus ?? 0;
  const raceFormBonus = payload?.raceFormBonus ?? rider?.raceFormBonus ?? 0;
  const shortTermFatigueMalus = payload?.shortTermFatigueMalus ?? rider?.shortTermFatigueMalus ?? 0;
  const longTermLocked = payload?.longTermFatigueLocked ?? rider?.longTermFatigueLocked ?? 0;
  const longTermDecayable = payload?.longTermFatigueDecayable ?? rider?.longTermFatigueDecayable ?? 0;
  const totalFatigue = payload?.totalFatigueLoadMalus ?? (shortTermFatigueMalus + longTermLocked + longTermDecayable);
  const currentSeasonPoints = payload?.currentSeasonPoints ?? rider?.seasonPoints ?? 0;
  const currentSeasonRank = payload?.currentSeasonRank ?? resolveCurrentSeasonRank(rider?.id ?? payload?.riderId ?? null);
  const currentSeasonRaceDays = payload?.currentSeasonRaceDays ?? rider?.seasonRaceDays ?? 0;
  const seasonWins = rider?.seasonWins ?? 0;
  const careerWins = payload?.careerWins ?? 0;
  const currentSeasonBreakawayAttempts = payload?.currentSeasonBreakawayAttempts ?? 0;
  const age = payload?.age ?? rider?.age
    ?? (rider?.birthYear ? ((state.gameState?.season ?? new Date().getFullYear()) - rider.birthYear) : null);

  const isCaptain = resolvedRoleId === 1 || payload?.lieutenantInfo != null;

  // --- OVR-Ring: Fuellgrad = OVR/100 ---
  const ovrColor = resolvedOverallRating >= 75 ? '#4ade80'
    : resolvedOverallRating >= 70 ? '#a3e635'
    : resolvedOverallRating >= 65 ? '#facc15'
    : resolvedOverallRating >= 60 ? '#fb923c' : '#f87171';
  const ovrRing = renderBroadcastRing(
    [[ovrColor, resolvedOverallRating / 100]],
    'OVR',
    `<span style="font-family:'JetBrains Mono',monospace; font-size:22px; font-weight:800; color:${ovrColor};">${Math.round(resolvedOverallRating)}</span>`,
    `Overall-Stärke ${Math.round(resolvedOverallRating)}`,
  );

  // --- FORM-Ring: Season-Form (gruen) + Rennform (blau), max 8 ---
  const formRing = renderBroadcastRing(
    [['#22c55e', Math.max(0, formBonus) / 8], ['#3b82f6', Math.max(0, raceFormBonus) / 8]],
    'FORM',
    `<span style="font-family:'JetBrains Mono',monospace; font-size:15px; font-weight:800; color:#4ade80;">${formBonus >= 0 ? '+' : ''}${formBonus}</span>
     <span style="font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:800; color:#60a5fa; margin-top:1px;">${raceFormBonus >= 0 ? '+' : ''}${raceFormBonus}</span>`,
    `Season-Form ${formBonus >= 0 ? '+' : ''}${formBonus} · Rennform ${raceFormBonus >= 0 ? '+' : ''}${raceFormBonus} · max 8`,
  );

  // --- FATIGUE-Ring: Kurzzeit (gelb) · gesperrte Langzeit (lila) · Langzeit (rot), dynamischer Max ---
  const fatigueMax = Math.max(25, Math.ceil(totalFatigue / 5) * 5);
  const fatigueRing = renderBroadcastRing(
    [['#eab308', shortTermFatigueMalus / fatigueMax], ['#a855f7', longTermLocked / fatigueMax], ['#ef4444', longTermDecayable / fatigueMax]],
    'FATIGUE',
    `<span style="font-family:'JetBrains Mono',monospace; font-size:20px; font-weight:800; color:#e2e8f0;">${Math.round(totalFatigue)}</span>`,
    `Gesamtfatigue ${totalFatigue.toFixed(2)} / ${fatigueMax} — Kurzzeit ${shortTermFatigueMalus} (gelb) · gesperrte Langzeit ${longTermLocked} (lila) · Langzeit ${longTermDecayable} (rot)`,
  );

  // --- Identitaets-Pills (Rolle / Formphase / Programm / Kapitaen / Leutnant / Mentor) ---
  const pill = (content: string, color: string, bg: string, border: string, title = ''): string =>
    `<span style="font-size:11px; font-weight:700; color:${color}; background:${bg}; border:1px solid ${border}; padding:4px 11px; border-radius:99px; display:inline-flex; align-items:center; gap:6px;"${title ? ` title="${esc(title)}"` : ''}>${content}</span>`;

  const pills: string[] = [];
  if (isCaptain) {
    pills.push(pill(
      `<span style="display:inline-flex; align-items:center; justify-content:center; width:15px; height:15px; border-radius:4px; background:#eab308; color:#1a1300; font-family:'JetBrains Mono',monospace; font-weight:800; font-size:9px;">K</span>Kapitän`,
      '#fcd34d', 'rgba(234,179,8,.14)', 'rgba(234,179,8,.34)',
    ));
  }
  pills.push(pill(`${renderSeasonFormPhaseIndicator(resolvedSeasonPhase)} Formphase`, '#86efac', 'rgba(34,197,94,.14)', 'rgba(34,197,94,.32)', 'Aktuelle Formphase'));
  if (programName && programName !== '-') {
    pills.push(pill(`Programm: ${esc(programName)}`, '#9fb0c9', '#0c1729', '#24344f'));
  }
  if (payload?.lieutenantInfo) {
    pills.push(pill(`<span style="font-family:'JetBrains Mono',monospace; font-size:8px; font-weight:800; letter-spacing:.06em; opacity:.75;">LT</span>Leutnant: ${esc(payload.lieutenantInfo.name)}`, '#93c5fd', 'rgba(59,130,246,.14)', 'rgba(59,130,246,.34)', 'Sein Leutnant'));
  } else if (payload?.leaderInfo) {
    pills.push(pill(`<span style="font-family:'JetBrains Mono',monospace; font-size:8px; font-weight:800; letter-spacing:.06em; opacity:.75;">C</span>Fährt für: ${esc(payload.leaderInfo.name)}`, '#93c5fd', 'rgba(59,130,246,.14)', 'rgba(59,130,246,.34)', 'Kapitän'));
  }
  const mentored = payload?.mentoredRiderNames ?? [];
  if (mentored.length > 0) {
    pills.push(pill(`<span style="font-family:'JetBrains Mono',monospace; font-size:8px; font-weight:800; letter-spacing:.06em; opacity:.75;">M</span>Mentor für: ${esc(mentored.join(', '))}`, '#6ee7b7', 'rgba(16,185,129,.12)', 'rgba(16,185,129,.3)', 'Betreut Nachwuchsfahrer'));
  }

  const jerseyHtml = resolvedTeamId
    ? `<img src="${esc(resolveTeamJerseyAssetPath(resolvedTeamId))}" alt="${esc(resolvedTeamName)}" style="width:76px; height:76px; object-fit:contain; flex:0 0 auto; filter:drop-shadow(0 3px 6px rgba(0,0,0,.55));" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';" />`
    : '<span style="width:76px; height:76px; flex:0 0 auto;"></span>';

  const identityLine = `
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:5px; font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.1em; color:#22d3ee; text-transform:uppercase;">
      <span>${esc(resolvedTeamName)}</span>
      <span style="color:#3a4a63;">·</span>
      <span style="display:inline-flex; align-items:center; gap:5px;">${resolvedCountryFlag}${esc(resolvedCountryCode || '')}</span>
      ${age != null ? `<span style="color:#3a4a63;">·</span><span style="color:#fcd34d; font-weight:800;">${age}</span>` : ''}
    </div>`;

  // --- Stat-Strip ---
  const statCell = (label: string, value: string, color = '#f1f5f9', last = false): string =>
    `<div style="padding:12px 16px;${last ? '' : ' border-right:1px solid #16233c;'}"><div style="font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.12em; color:#6a7a95;">${label}</div><div style="font-family:'JetBrains Mono',monospace; font-size:21px; font-weight:800; color:${color}; margin-top:3px;">${value}</div></div>`;

  return `
    <div style="border-radius:14px; overflow:hidden; border:1px solid #223354; background:linear-gradient(135deg,#101f36,#0c1526); margin-bottom:14px;">
      <div style="display:flex; align-items:center; gap:20px; padding:18px 22px; flex-wrap:wrap;">
        ${jerseyHtml}
        <div style="flex:1; min-width:220px;">
          ${identityLine}
          <div style="font-size:15px; font-weight:700; color:#e2e8f0;">${esc(resolvedRoleName)}</div>
          <div style="display:flex; gap:8px; margin-top:11px; flex-wrap:wrap;">${pills.join('')}</div>
        </div>
        <div style="display:flex; gap:16px; align-items:flex-start; flex:0 0 auto;">
          ${ovrRing}
          ${formRing}
          ${fatigueRing}
        </div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(6,1fr); border-top:1px solid #1c2b47;">
        ${statCell('SAISONPUNKTE', String(currentSeasonPoints))}
        ${statCell('SAISON-RANG', currentSeasonRank != null ? `#${currentSeasonRank}` : '–')}
        ${statCell('SIEGE', String(seasonWins), '#fbbf24')}
        ${statCell('KARRIERESIEGE', String(careerWins), '#fbbf24')}
        ${statCell('RENNTAGE', String(currentSeasonRaceDays))}
        ${statCell('AUSREISSER', String(currentSeasonBreakawayAttempts), '#f1f5f9', true)}
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
      <button type="button" class="team-detail-page-tab${state.riderStatsTab === 'contracts' ? ' team-detail-page-tab-active' : ''}" data-rider-stats-tab="contracts" aria-selected="${state.riderStatsTab === 'contracts' ? 'true' : 'false'}">Verträge</button>
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
        <stop offset="0%" stop-color="rgba(16,29,51,0.95)" />
        <stop offset="100%" stop-color="rgba(11,20,36,0.98)" />
      </radialGradient>
      <linearGradient id="riderFillGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(34,211,238,0.42)" />
        <stop offset="100%" stop-color="rgba(8,145,178,0.18)" />
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
    riderDots.push(`<circle cx="${px}" cy="${py}" r="5" fill="#22d3ee" stroke="#fff" stroke-width="2" filter="url(#dotGlow)"><title>${labels[i]}: ${val}</title></circle>`);
  });

  const riderPolygonHtml = `<polygon points="${riderPts.join(' ')}" fill="url(#riderFillGrad)" stroke="#22d3ee" stroke-width="2.5" stroke-linejoin="round" filter="url(#radarGlow)" />`;

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

  // Broadcast: diskrete Farbschwellen fuer die Skill-Werte
  const skillBadgeColor = (score: number): string => {
    if (score >= 75) return '#16a34a';
    if (score >= 73) return '#65a30d';
    if (score >= 70) return '#ca8a04';
    return '#ea580c';
  };

  const skillRowsHtml = sortedSkills.map((skill) => {
    const score = (riderSkills as any)[skill.key] ?? 60;
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; background:#0b1424; border:1px solid #1c2b47; border-radius:8px; padding:9px 12px;">
        <span style="font-size:12.5px; font-weight:600; color:#cbd5e1;">${skill.label}</span>
        <span style="font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:800; color:#fff; background:${skillBadgeColor(score)}; padding:2px 9px; border-radius:6px; min-width:34px; text-align:center;">${score.toFixed(0)}</span>
      </div>`;
  }).join('');

  // SPEC-Karten (1-3)
  const specDefs: Array<{ label: string; border: string; value: string }> = [
    { label: 'SPEC 1', border: '#22d3ee', value: rider?.specialization1 ? getRiderSpecializationLabel(rider.specialization1) : '–' },
    { label: 'SPEC 2', border: '#818cf8', value: rider?.specialization2 ? getRiderSpecializationLabel(rider.specialization2) : '–' },
    { label: 'SPEC 3', border: '#5f6f8a', value: rider?.specialization3 ? getRiderSpecializationLabel(rider.specialization3) : '–' },
  ];
  const specCardsHtml = specDefs.map((spec) => `
    <div style="flex:1; min-width:0; background:#0b1424; border:1px solid #1c2b47; border-top:2px solid ${spec.border}; border-radius:9px; padding:8px 11px;">
      <div style="font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.12em; color:#6a7a95;">${spec.label}</div>
      <div style="font-size:13px; font-weight:700; color:#e8edf5; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(spec.value)}</div>
    </div>`).join('');

  const legendHtml = `
    <div style="display:flex; gap:16px; margin-top:14px; padding-top:13px; border-top:1px solid #1c2b47; font-size:11px; color:#7c8aa3; flex-wrap:wrap;">
      <span style="display:inline-flex; align-items:center; gap:6px;"><span style="width:10px;height:10px;border-radius:3px;background:#16a34a;"></span>75+</span>
      <span style="display:inline-flex; align-items:center; gap:6px;"><span style="width:10px;height:10px;border-radius:3px;background:#65a30d;"></span>73–74</span>
      <span style="display:inline-flex; align-items:center; gap:6px;"><span style="width:10px;height:10px;border-radius:3px;background:#ca8a04;"></span>70–72</span>
      <span style="display:inline-flex; align-items:center; gap:6px;"><span style="width:10px;height:10px;border-radius:3px;background:#ea580c;"></span>&lt;70</span>
    </div>`;

  // Terrain-Band (Saisonpunkte nach Terrain, absteigend)
  const terrainPoints = payload?.pointsByTerrain ?? { flat: 0, hilly: 0, mediumMountain: 0, mountain: 0, timetrial: 0, cobble: 0 };
  const terrainRows: Array<{ label: string; value: number }> = [
    { label: 'Hügelig', value: terrainPoints.hilly },
    { label: 'Mittelgebirge', value: terrainPoints.mediumMountain },
    { label: 'Flach', value: terrainPoints.flat },
    { label: 'Hochgebirge', value: terrainPoints.mountain },
    { label: 'Kopfsteinpfl.', value: terrainPoints.cobble },
    { label: 'Zeitfahren', value: terrainPoints.timetrial },
  ].sort((a, b) => b.value - a.value);
  const maxTerrain = Math.max(1, ...terrainRows.map((t) => t.value));
  const terrainBarsHtml = terrainRows.map((t) => {
    const pct = Math.round((t.value / maxTerrain) * 100);
    return `
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="width:104px; font-size:12px; color:#9fb0c9; flex:0 0 auto;">${t.label}</span>
        <div style="flex:1; height:9px; background:#0b1424; border-radius:99px; overflow:hidden;"><div style="width:${pct}%; height:100%; background:linear-gradient(90deg,#22d3ee,#0891b2);"></div></div>
        <span style="font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:700; color:#e2e8f0; width:40px; text-align:right;">${t.value}</span>
      </div>`;
  }).join('');

  // Format & Profil
  const formatPoints = payload?.pointsByRaceFormat ?? { stageRace: 0, oneDay: 0 };
  const profileId = rider?.weatherProfileId ?? payload?.weatherProfileId ?? 1;
  const weatherProfile = WEATHER_PROFILES[profileId] || WEATHER_PROFILES[1];
  const pref1Id = weatherProfile.pref[0];
  const pref2Id = weatherProfile.pref[1];
  const pref1Name = WEATHER_NAMES[pref1Id];
  const pref2Name = WEATHER_NAMES[pref2Id];

  return `
    <section class="rider-stats-skills-tab" style="margin-top: 1rem;">
      <div style="display:grid; grid-template-columns:480px 1fr; gap:16px; align-items:stretch; margin-bottom:16px;">
        <div style="border-radius:14px; border:1px solid #223354; background:linear-gradient(160deg,#101d33,#0b1424); padding:18px; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-size:13px; font-weight:800; color:#e2e8f0;">Skill-Radar</span>
            <span style="font-family:'JetBrains Mono',monospace; font-size:10px; color:#5f6f8a; letter-spacing:.1em;">6 KERN-ACHSEN · 60–85</span>
          </div>
          <div style="flex:1; display:flex; align-items:center; justify-content:center;">
            <svg width="100%" height="440" viewBox="0 0 ${SVG_W} ${SVG_H}" style="overflow: visible; max-width:540px;">
              ${defsHtml}
              ${bgCircle}
              ${gridPathsHtml}
              ${spokesHtml}
              ${riderPolygonHtml}
              ${riderDots.join('')}
              ${labelsHtml}
            </svg>
          </div>
        </div>

        <div style="border-radius:14px; border:1px solid #1e2c49; background:#0c1526; padding:16px 18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:13px;">
            <span style="font-size:13px; font-weight:800; color:#e2e8f0;">Alle Fähigkeiten</span>
            <span style="font-family:'JetBrains Mono',monospace; font-size:10px; color:#5f6f8a; letter-spacing:.1em;">STÄRKSTE ZUERST</span>
          </div>
          <div style="display:flex; gap:8px; margin-bottom:13px;">${specCardsHtml}</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:9px 14px;">${skillRowsHtml}</div>
          ${legendHtml}
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1.4fr 1fr; gap:16px;">
        <div style="border-radius:14px; border:1px solid #1e2c49; background:#0c1526; padding:16px 18px;">
          <div style="font-size:13px; font-weight:800; color:#e2e8f0; margin-bottom:13px;">Saisonpunkte nach Terrain</div>
          <div style="display:flex; flex-direction:column; gap:10px;">${terrainBarsHtml}</div>
        </div>

        <div style="border-radius:14px; border:1px solid #1e2c49; background:#0c1526; padding:16px 18px;">
          <div style="font-size:13px; font-weight:800; color:#e2e8f0; margin-bottom:13px;">Format &amp; Profil</div>
          <div style="display:flex; gap:10px; margin-bottom:14px;">
            <div style="flex:1; background:#0b1424; border:1px solid #1c2b47; border-radius:10px; padding:11px 13px;"><div style="font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.1em; color:#6a7a95;">RUNDFAHRTEN</div><div style="font-family:'JetBrains Mono',monospace; font-size:19px; font-weight:800; color:#22d3ee; margin-top:4px;">${formatPoints.stageRace}</div></div>
            <div style="flex:1; background:#0b1424; border:1px solid #1c2b47; border-radius:10px; padding:11px 13px;"><div style="font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.1em; color:#6a7a95;">EINTAGES</div><div style="font-family:'JetBrains Mono',monospace; font-size:19px; font-weight:800; color:#e2e8f0; margin-top:4px;">${formatPoints.oneDay}</div></div>
          </div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.1em; color:#6a7a95; margin-bottom:8px;">WETTER-PRÄFERENZ</div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <span style="display:inline-flex; align-items:center; gap:6px; font-size:11px; color:#cbd5e1; background:#0b1424; border:1px solid #1c2b47; padding:5px 11px; border-radius:99px;">${renderWeatherIcon(pref1Id, pref1Name)}${esc(pref1Name)}</span>
            <span style="display:inline-flex; align-items:center; gap:6px; font-size:11px; color:#cbd5e1; background:#0b1424; border:1px solid #1c2b47; padding:5px 11px; border-radius:99px;">${renderWeatherIcon(pref2Id, pref2Name)}${esc(pref2Name)}</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function renderRiderStatsFatigueTab(rider: Rider | null, payload: RiderStatsPayload): string {
  const shortTermFatigue = payload.shortTermFatigueMalus ?? 0;
  const longTermDecayable = payload.longTermFatigueDecayable ?? 0;
  const longTermLocked = payload.longTermFatigueLocked ?? 0;
  const totalMalus = payload.totalFatigueLoadMalus ?? 0;

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

  // Broadcast-Werte: Zusammensetzung + dynamischer Max + Renntage
  const fatShort = shortTermFatigue;
  const fatLocked = longTermLocked;
  const fatLong = longTermDecayable;
  const fatTotal = totalMalus || (fatShort + fatLocked + fatLong);
  const fatMax = Math.max(25, Math.ceil(fatTotal / 5) * 5);
  const seasonRaceDays = payload.seasonRaceDaysTotal ?? payload.currentSeasonRaceDays ?? 0;
  const pct = (v: number): number => Math.max(0, Math.min(100, (v / fatMax) * 100));

  // Last-Ampel
  const warn = payload.shortTermFatigueWarning;
  const lastLabel = warn === 'critical' ? 'Hoch' : (warn === 'warning' ? 'Mittel' : 'Niedrig');
  const lastColor = warn === 'critical' ? '#fca5a5' : (warn === 'warning' ? '#fcd34d' : '#86efac');
  const lastBg = warn === 'critical' ? 'rgba(239,68,68,.14)' : (warn === 'warning' ? 'rgba(234,179,8,.14)' : 'rgba(34,197,94,.14)');
  const lastBorder = warn === 'critical' ? 'rgba(239,68,68,.32)' : (warn === 'warning' ? 'rgba(234,179,8,.32)' : 'rgba(34,197,94,.32)');

  // Conic-Ring (Kurzzeit gelb · gesperrte Langzeit lila · Langzeit rot)
  const t1 = fatShort / fatMax;
  const t2 = t1 + fatLocked / fatMax;
  const t3 = Math.min(1, t2 + fatLong / fatMax);
  const fatRing = `conic-gradient(#eab308 0turn ${t1}turn, #a855f7 ${t1}turn ${t2}turn, #ef4444 ${t2}turn ${t3}turn, #16223a ${t3}turn 1turn)`;

  return `
    <section class="rider-stats-fatigue-tab" style="margin-top: 1rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <span style="font-size:14px; font-weight:800; color:#e2e8f0;">Erschöpfung <span style="font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:600; color:#6a7a95;">· aktueller Stand</span></span>
        <span style="font-size:11px; font-weight:700; color:${lastColor}; background:${lastBg}; border:1px solid ${lastBorder}; padding:4px 11px; border-radius:99px;">Last: ${lastLabel}</span>
      </div>
      <div style="display:grid; grid-template-columns:280px 1fr; gap:16px; margin-bottom:1.5rem;">
        <!-- Ring-Karte -->
        <div style="border-radius:14px; border:1px solid #1e2c49; background:#0c1526; padding:18px; display:flex; flex-direction:column; align-items:center; gap:14px;">
          <div style="width:128px; height:128px; border-radius:50%; background:${fatRing}; display:flex; align-items:center; justify-content:center;">
            <div style="width:94px; height:94px; border-radius:50%; background:#0b1424; display:flex; flex-direction:column; align-items:center; justify-content:center; line-height:1;">
              <span style="font-family:'JetBrains Mono',monospace; font-size:24px; font-weight:800; color:#e2e8f0;">${fatTotal.toFixed(2).replace('.', ',')}</span>
              <span style="font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.1em; color:#6a7a95; margin-top:2px;">/ ${fatMax} GESAMT</span>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px; width:100%; font-size:11px; color:#cbd5e1;">
            <span style="display:flex; align-items:center; gap:7px;"><span style="width:10px;height:10px;border-radius:3px;background:#eab308;"></span>Kurzzeit <b style="margin-left:auto; font-family:'JetBrains Mono',monospace;">${fatShort.toFixed(2).replace('.', ',')}</b></span>
            <span style="display:flex; align-items:center; gap:7px;"><span style="width:10px;height:10px;border-radius:3px;background:#a855f7;"></span>Gesperrte Langzeit <b style="margin-left:auto; font-family:'JetBrains Mono',monospace;">${fatLocked.toFixed(2).replace('.', ',')}</b></span>
            <span style="display:flex; align-items:center; gap:7px;"><span style="width:10px;height:10px;border-radius:3px;background:#ef4444;"></span>Langzeit <b style="margin-left:auto; font-family:'JetBrains Mono',monospace;">${fatLong.toFixed(2).replace('.', ',')}</b></span>
          </div>
        </div>
        <!-- Zusammensetzung -->
        <div style="border-radius:14px; border:1px solid #1e2c49; background:#0c1526; padding:18px;">
          <div style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.12em; color:#6a7a95; margin-bottom:10px;">ZUSAMMENSETZUNG (0–${fatMax})</div>
          <div style="display:flex; height:14px; border-radius:7px; overflow:hidden; background:#0b1424; margin-bottom:16px;">
            <div style="width:${pct(fatShort)}%; background:#eab308;"></div><div style="width:${pct(fatLocked)}%; background:#a855f7;"></div><div style="width:${pct(fatLong)}%; background:#ef4444;"></div>
          </div>
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:16px;">
            <div style="background:#0b1424; border:1px solid #1c2b47; border-top:2px solid #eab308; border-radius:10px; padding:11px 13px;"><div style="font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.08em; color:#6a7a95;">KURZZEIT</div><div style="font-family:'JetBrains Mono',monospace; font-size:18px; font-weight:800; color:#facc15; margin-top:3px;">${fatShort.toFixed(2).replace('.', ',')}</div></div>
            <div style="background:#0b1424; border:1px solid #1c2b47; border-top:2px solid #a855f7; border-radius:10px; padding:11px 13px;"><div style="font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.08em; color:#6a7a95;">GESPERRT</div><div style="font-family:'JetBrains Mono',monospace; font-size:18px; font-weight:800; color:#c4b5fd; margin-top:3px;">${fatLocked.toFixed(2).replace('.', ',')}</div></div>
            <div style="background:#0b1424; border:1px solid #1c2b47; border-top:2px solid #ef4444; border-radius:10px; padding:11px 13px;"><div style="font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.08em; color:#6a7a95;">LANGZEIT</div><div style="font-family:'JetBrains Mono',monospace; font-size:18px; font-weight:800; color:#fca5a5; margin-top:3px;">${fatLong.toFixed(2).replace('.', ',')}</div></div>
          </div>
          <div style="padding-top:14px; border-top:1px solid #1c2b47; display:flex; align-items:center; gap:12px;">
            <span style="font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.08em; color:#6a7a95;">RENNTAGE GESAMT (SAISON)</span>
            <span style="font-family:'JetBrains Mono',monospace; font-size:20px; font-weight:800; color:#f1f5f9; margin-left:auto;">${seasonRaceDays}</span>
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

  // Season-Form (sForm) und Rennform (rForm) — Komponenten der Gesamtform (0-8)
  const buildFormComponent = (getVal: (e: RiderFormHistoryEntry) => number, stroke: string, label: string): string => {
    const cpts = history.map((entry) => {
      const dayOfYear = (new Date(entry.date).getTime() - yearStart) / msPerDay;
      const x = padL + (dayOfYear / 365) * chartW;
      const val = getVal(entry);
      const y = padT + chartH - (Math.min(8, Math.max(0, val)) / 8) * chartH;
      return { x, y, val, date: entry.date };
    });
    if (cpts.length === 0) return '';
    const path = `<path d="M ${cpts.map((p) => `${p.x},${p.y}`).join(' L ')}" fill="none" stroke="${stroke}" stroke-width="2" stroke-dasharray="5,3" />`;
    const dots = cpts.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#fff" stroke="${stroke}" stroke-width="2"><title>${label} (${p.date}): ${p.val.toFixed(2)}</title></circle>`).join('');
    return path + dots;
  };
  const seasonFormHtml = (chartToggles.seasonForm && pts.length > 0)
    ? buildFormComponent((e) => e.sForm ?? 0, '#fb923c', 'Season-Form') : '';
  const raceFormHtml = (chartToggles.raceForm && pts.length > 0)
    ? buildFormComponent((e) => e.rForm ?? 0, '#4ade80', 'Rennform') : '';

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
    <div class="rider-stats-compare-legend" style="background: #0c1526; border-radius: 14px; padding: 1rem; border: 1px solid #1e2c49; max-height: 460px; overflow-y: auto; display: flex; flex-direction: column;">
      <h4 style="margin-top: 0; margin-bottom: 0.75rem; font-size: 0.95rem; border-bottom: 1px solid #1c2b47; padding-bottom: 0.5rem; color: #e2e8f0; font-weight: bold;">Legende</h4>
      
      <!-- Chart Line Toggle Checkboxes -->
      <div class="chart-line-toggles" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-form" ${chartToggles.form ? 'checked' : ''} style="cursor: pointer; width: 14px; height: 14px; accent-color: var(--accent-primary);" />
          <span style="display: inline-block; width: 8px; height: 8px; background: var(--accent-primary); border-radius: 50%;"></span>
          Form (0-8)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-season-form" ${chartToggles.seasonForm ? 'checked' : ''} style="cursor: pointer; width: 14px; height: 14px; accent-color: #fb923c;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #fb923c; border-radius: 50%;"></span>
          Season-Form (0-8)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-race-form" ${chartToggles.raceForm ? 'checked' : ''} style="cursor: pointer; width: 14px; height: 14px; accent-color: #4ade80;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #4ade80; border-radius: 50%;"></span>
          Rennform (0-8)
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
        <div class="rider-stats-chart-wrapper" style="overflow-x: auto; background: #0c1526; border-radius: 14px; padding: 1rem; border: 1px solid #1e2c49;">
          <svg width="100%" height="460" viewBox="0 0 1350 444" style="min-width: 1300px;">
            ${phaseBackgroundsHtml}
            ${gridHtml}
            ${xAxisHtml}
            ${peaksHtml}
            ${fillPath ? `<path d="${fillPath}" fill="${fillColor}" />` : ''}
            ${pathData ? `<path d="${pathData}" fill="none" stroke="var(--accent-primary)" stroke-width="2" />` : ''}
            ${pointsHtml}
            ${seasonFormHtml}
            ${raceFormHtml}
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

  const MONOF = "font-family:'JetBrains Mono',monospace";
  const today = state.gameState?.currentDate ?? '';
  const season = state.gameState?.season
    ?? (races[0]?.startDate ? Number(races[0].startDate.slice(0, 4)) : new Date().getFullYear());
  const yearStart = Date.UTC(season, 0, 1);
  const msDay = 86400000;
  const dayOfYear = (dateStr: string): number => Math.max(0, Math.min(365, (Date.parse(dateStr + 'T00:00:00Z') - yearStart) / msDay));

  // Ziele = Top-5 nach Prestige
  const goalIds = new Set([...races].sort((a, b) => (b.prestige ?? 0) - (a.prestige ?? 0)).slice(0, 5).map((r) => r.id));
  // Tatsaechlich gefahrene Rennen dieser Saison (aus den Ergebnis-Bloecken)
  const racedIds = new Set<number>();
  const seasonBlocks = (payload.seasons ?? []).find((s) => s.season === season);
  for (const b of seasonBlocks?.raceBlocks ?? []) racedIds.add(b.raceId);

  // --- Timeline-SVG ---
  const W = 1200, H = 116, padL = 12, padR = 12, axisY = 78, innerW = W - padL - padR;
  const xAt = (d: number): number => padL + (d / 365) * innerW;
  const monthTicks = Array.from({ length: 12 }, (_, m) => {
    const x = xAt((Date.UTC(season, m, 1) - yearStart) / msDay);
    return `<line x1="${x}" y1="20" x2="${x}" y2="${axisY}" stroke="#16233c" stroke-width="1"/><text x="${x + 3}" y="${axisY + 14}" fill="#5f6f8a" font-size="9" font-family="'JetBrains Mono',monospace">${['J','F','M','A','M','J','J','A','S','O','N','D'][m]}</text>`;
  }).join('');
  const raceMarks = races.map((race) => {
    const x1 = xAt(dayOfYear(race.startDate));
    const x2 = xAt(dayOfYear(race.endDate));
    const col = resolveRaceCategoryBadgeStyle(race.category?.name).border;
    const isGoal = goalIds.has(race.id);
    const star = isGoal ? `<text x="${(x1 + x2) / 2}" y="30" fill="#fbbf24" font-size="12" text-anchor="middle">★</text>` : '';
    const body = race.isStageRace && x2 - x1 > 2
      ? `<rect x="${x1}" y="${axisY - 12}" width="${Math.max(3, x2 - x1)}" height="12" rx="3" fill="${col}"><title>${esc(race.name)}</title></rect>`
      : `<circle cx="${x1}" cy="${axisY - 6}" r="5" fill="${col}"><title>${esc(race.name)}</title></circle>`;
    return star + body;
  }).join('');
  const peakMarks = (payload.peakDates ?? []).map((d) => {
    if (!d.startsWith(String(season))) return '';
    const x = xAt(dayOfYear(d.slice(0, 10)));
    return `<path d="M ${x - 5} ${axisY + 2} Q ${x} ${axisY - 10} ${x + 5} ${axisY + 2} Z" fill="rgba(34,197,94,.5)" stroke="#22c55e" stroke-width="1"><title>Formpeak ${d.slice(0, 10)}</title></path>`;
  }).join('');
  const todayLine = today.startsWith(String(season))
    ? (() => { const x = xAt(dayOfYear(today.slice(0, 10))); return `<line x1="${x}" y1="16" x2="${x}" y2="${axisY + 4}" stroke="#22d3ee" stroke-width="1.5" stroke-dasharray="3,3"/><text x="${x}" y="12" fill="#22d3ee" font-size="9" text-anchor="middle" font-family="'JetBrains Mono',monospace">HEUTE</text>`; })()
    : '';

  const timelineSvg = `
    <div style="border-radius:14px;border:1px solid #1e2c49;background:#0c1526;padding:14px 16px;margin-bottom:16px;overflow-x:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-size:13px;font-weight:800;color:#e2e8f0;">Saison-Timeline</span>
        <span style="${MONOF};font-size:10px;color:#5f6f8a;">★ Ziel · ▲ Formpeak</span>
      </div>
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;min-width:640px;height:auto;display:block;">
        <line x1="${padL}" y1="${axisY}" x2="${W - padR}" y2="${axisY}" stroke="#1c2b47" stroke-width="1"/>
        ${monthTicks}${raceMarks}${peakMarks}${todayLine}
      </svg>
    </div>`;

  // --- Rennliste im Renn-Radar-Stil mit Status ---
  const MONTH_ABBR = ['JAN', 'FEB', 'MRZ', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'];
  const listHtml = races.map((race) => {
    const isInjured = payload.unavailableUntil ? (race.startDate <= payload.unavailableUntil && race.endDate >= today) : false;
    const live = today !== '' && race.startDate <= today && race.endDate >= today;
    const done = today !== '' && race.endDate < today;
    let status: string;
    if (live) status = '<span style="font-size:10px;font-weight:700;color:#fca5a5;background:rgba(239,68,68,.12);padding:4px 10px;border-radius:99px;animation:velopulse 1.6s ease-in-out infinite;">LÄUFT</span>';
    else if (isInjured) status = '<span style="font-size:10px;font-weight:700;color:#fcd34d;background:rgba(234,179,8,.12);padding:4px 10px;border-radius:99px;">FÄLLT AUS</span>';
    else if (done) status = racedIds.has(race.id)
      ? '<span style="font-size:10px;font-weight:700;color:#86efac;background:rgba(34,197,94,.12);padding:4px 10px;border-radius:99px;">GEFAHREN</span>'
      : '<span style="font-size:10px;font-weight:700;color:#93a3bd;border:1px solid #2b3a55;padding:4px 10px;border-radius:99px;">NICHT DABEI</span>';
    else status = '<span style="font-size:10px;font-weight:700;color:#93a3bd;border:1px solid #2b3a55;padding:4px 10px;border-radius:99px;">GEPLANT</span>';

    const [, mm, dd] = race.startDate.split('-');
    const mon = MONTH_ABBR[Number(mm) - 1] ?? '';
    const col = resolveRaceCategoryBadgeStyle(race.category?.name).border;
    const country = race.country?.name ?? '';
    const isGoal = goalIds.has(race.id);
    const nameColor = done && !racedIds.has(race.id) && !live ? '#8a97ad' : '#e2e8f0';
    return `
      <button type="button" data-dashboard-race-id="${race.id}" style="width:100%;text-align:left;background:none;cursor:pointer;display:flex;align-items:center;gap:14px;padding:11px 14px;border:none;border-top:1px solid #14203a;${live ? 'box-shadow:inset 3px 0 0 #ef4444;background:linear-gradient(90deg,rgba(239,68,68,.10),transparent 55%);' : ''}">
        <span style="text-align:center;min-width:38px;"><span style="display:block;font-size:18px;font-weight:800;color:${nameColor};line-height:1;">${dd}</span><span style="display:block;font-size:9px;color:#7c8aa3;letter-spacing:.1em;">${mon}</span></span>
        <span style="width:5px;height:34px;border-radius:3px;background:${col};flex:0 0 auto;" title="${race.category?.name ?? ''}"></span>
        <span style="flex:1;min-width:0;"><span style="display:block;font-size:14px;font-weight:700;color:${nameColor};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${isGoal ? '<span style="color:#fbbf24;">★</span> ' : ''}${esc(race.name)}</span><span style="display:block;${MONOF};font-size:11px;color:#8494ad;">${esc(country)}${race.category?.name ? ' · ' + esc(race.category.name.replace(/^world\s*tour\s*-\s*/i, '')) : ''}</span></span>
        ${status}
      </button>`;
  }).join('');

  return `
    <section class="rider-stats-program" style="margin-top:1rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <span style="font-size:14px;font-weight:800;color:#e2e8f0;">${esc(payload.program.name)}</span>
        <span style="${MONOF};font-size:11px;color:#6a7a95;">${races.length} Rennen · ${goalIds.size} Ziele</span>
      </div>
      ${timelineSvg}
      <div style="border-radius:14px;overflow:hidden;border:1px solid #1e2c49;background:#0c1526;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #1c2b47;">
          <span style="font-size:13px;font-weight:800;color:#e2e8f0;">Programmrennen</span>
          <span style="${MONOF};font-size:10px;letter-spacing:.12em;color:#5f6f8a;text-transform:uppercase;">Status</span>
        </div>
        ${listHtml}
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

  if (state.riderStatsTab === 'contracts') {
    return `
      ${renderRiderStatsSummary(rider, payload, teamName, countryCode, countryFlag)}
      ${renderRiderStatsTabs(payload)}
      ${renderRiderStatsContractsTab(payload)}`;
  }

  const currentSeason = state.gameState?.season ?? 2026;
  const availableYears = Array.from(new Set([
    currentSeason,
    ...seasons.map(s => s.season)
  ])).sort((a, b) => b - a);

  if (state.riderStatsSelectedSeason === null || !availableYears.includes(state.riderStatsSelectedSeason)) {
    state.riderStatsSelectedSeason = currentSeason;
  }

  const selectedYear = state.riderStatsSelectedSeason;
  const seasonToRender = seasons.find(s => s.season === selectedYear);

  if (payload.seasons.length === 0) {
    return `
      ${renderRiderStatsSummary(rider, payload, teamName, countryCode, countryFlag)}
      ${renderRiderStatsTabs(payload)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`;
  }

  const MONOF = "font-family:'JetBrains Mono',monospace";
  // Broadcast-Grid fuer die Ergebnis-Zeilen (12 Spalten)
  const RES_COLS = 'grid-template-columns:92px 46px 40px 28px minmax(120px,1fr) 78px 46px 46px 34px 118px 88px 40px;';

  const dropdownHtml = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; gap:12px; flex-wrap:wrap;">
      <span style="font-size:14px; font-weight:800; color:#e2e8f0;">Rennergebnisse</span>
      <div style="display:flex; align-items:center; gap:7px;">
        <span style="${MONOF}; font-size:10px; letter-spacing:.1em; color:#6a7a95;">SAISON</span>
        <select id="rider-stats-results-season-select" style="${MONOF}; font-size:11px; font-weight:700; color:#e2e8f0; background:#0a1122; border:1px solid #1c2b47; border-radius:8px; padding:6px 9px; cursor:pointer;">
          ${availableYears.map(yr => `<option value="${yr}" ${yr === selectedYear ? 'selected' : ''}>${yr}</option>`).join('')}
        </select>
      </div>
    </div>
  `;

  const renderResultBlock = (block: any): string => {
    const barColor = resolveRaceCategoryBadgeStyle(block.raceCategoryName).border;
    const places = block.rows
      .map((r: any) => (r.rowType === 'stage_result' ? r.resultRank : (r.rowType === 'gc_final' ? r.resultRank : null)))
      .filter((n: any) => n != null && n > 0) as number[];
    const best = places.length ? Math.min(...places) : null;
    const bestText = best != null ? (best === 1 ? '★ Sieg' : `Bester P${best}`) : '';
    const stageCount = block.rows.filter((r: any) => r.rowType === 'stage_result').length || null;

    const rowsHtml = block.rows.map((row: any) => {
      const isFinalRow = row.rowType !== 'stage_result';
      const label = isFinalRow
        ? getRiderStatsRowTypeLabel(row.rowType)
        : (row.stageNumber && row.isStageRace ? `Etappe ${row.stageNumber}` : (row.raceName ?? ''));
      const rowStyle = `display:grid; ${RES_COLS} gap:9px; align-items:center; padding:9px 14px; border-top:1px solid #14203a;${isFinalRow ? 'background:rgba(34,211,238,.06);' : ''}`;
      const finalBadge = isFinalRow ? `<span style="margin-right:6px;flex:0 0 auto;">${renderRiderStatsFinalTypeBadge(row.rowType)}</span>` : '';
      const profileCell = isFinalRow
        ? '<span style="justify-self:center;color:#5f6f8a;">–</span>'
        : (row.profile ? `<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${row.stageId}" style="background:none;border:none;padding:0;cursor:pointer;display:inline-flex;justify-self:center;">${renderStageProfileBadge(row.profile)}</button>` : '<span style="justify-self:center;color:#5f6f8a;">–</span>');
      const km = isFinalRow ? '–' : (row.distanceKm != null ? esc(row.distanceKm.toFixed(0)) : '–');
      const hm = isFinalRow ? '–' : (row.elevationGainMeters != null ? esc(String(Math.round(row.elevationGainMeters))) : '–');
      const weatherCell = isFinalRow ? '<span style="justify-self:center;"></span>' : `<span style="justify-self:center;">${renderWeatherIcon(row.rolledWeatherId, row.rolledWetterName)}</span>`;
      return `
        <div style="${rowStyle}">
          <span style="${MONOF}; font-size:11px; color:#8494ad; white-space:nowrap;">${esc(formatDate(row.date))}</span>
          <span style="justify-self:center;">${renderRiderStatsPlacement(row)}</span>
          <span style="justify-self:center;">${renderRiderStatsGcPlacement(row)}</span>
          <span style="justify-self:center;">${renderRiderStatsBreakaway(row)}</span>
          <span style="font-size:12.5px; font-weight:600; color:#e2e8f0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:flex; align-items:center; min-width:0;">${finalBadge}${esc(label)}</span>
          ${profileCell}
          <span style="${MONOF}; font-size:11px; color:#9fb0c9; justify-self:end;">${km}</span>
          <span style="${MONOF}; font-size:11px; color:#7c8aa3; justify-self:end;">${hm}</span>
          ${weatherCell}
          <span style="min-width:0; overflow:hidden;">${renderStatusDotsColumn(row)}</span>
          <span style="${MONOF}; font-size:11px; color:#cbd5e1; justify-self:end; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${esc(formatRiderStatsResultDetail(row))}</span>
          <span style="${MONOF}; font-size:12px; font-weight:800; color:${(row.seasonPoints ?? 0) > 0 ? '#22d3ee' : '#5f6f8a'}; justify-self:end;">${row.seasonPoints ?? 0}</span>
        </div>`;
    }).join('');

    return `
      <div style="border-radius:14px; overflow:hidden; border:1px solid #1e2c49; background:#0c1526; margin-bottom:12px;">
        <div style="display:flex; align-items:stretch;">
          <span style="width:5px; background:${barColor}; flex:0 0 auto;"></span>
          <div style="flex:1; min-width:0; display:flex; justify-content:space-between; align-items:center; padding:12px 16px; gap:12px;">
            <div style="min-width:0; overflow:hidden;">
              <div style="font-size:15px; font-weight:800; color:#f1f5f9; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(block.raceName)}</div>
              <div style="${MONOF}; font-size:11px; color:#8494ad; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(formatRiderStatsRaceBlockMeta(block))}</div>
            </div>
            <div style="display:flex; align-items:center; gap:12px; flex:0 0 auto;">
              ${bestText ? `<span style="${MONOF}; font-size:11px; color:${best === 1 ? '#fbbf24' : '#7c8aa3'}; white-space:nowrap;">${bestText}</span>` : ''}
              ${renderRiderStatsRaceBadge(block.raceCategoryName, block.isStageRace, stageCount)}
            </div>
          </div>
        </div>
        <div style="display:grid; ${RES_COLS} gap:9px; padding:8px 14px; ${MONOF}; font-size:9px; letter-spacing:.05em; color:#5a6a85; border-bottom:1px solid #16233c; border-top:1px solid #16233c;">
          <span>DATUM</span><span style="justify-self:center;">PLATZ</span><span style="justify-self:center;">GC</span><span style="justify-self:center;">AUS</span><span>RENNEN / ETAPPE</span><span style="justify-self:center;">PROFIL</span><span style="justify-self:end;">KM</span><span style="justify-self:end;">HM</span><span style="justify-self:center;">WTR</span><span>EREIGNIS</span><span style="justify-self:end;">ERGEBNIS</span><span style="justify-self:end;">PKT</span>
        </div>
        ${rowsHtml}
      </div>`;
  };

  const contentHtml = seasonToRender ? `
    <section class="rider-stats-season" style="margin-top: 0;">
      ${seasonToRender.raceBlocks.map(renderResultBlock).join('')}
    </section>
  ` : `
    <section class="rider-stats-placeholder" style="margin-top: 1rem;">
      <h3>Keine Rennergebnisse</h3>
      <p>Dieser Fahrer hat in der Saison ${selectedYear} keine Rennen bestritten.</p>
    </section>
  `;

  return `
    ${renderRiderStatsSummary(rider, payload, teamName, countryCode, countryFlag)}
    ${renderRiderStatsTabs(payload)}
    ${dropdownHtml}
    ${contentHtml}
  `;
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

function getRoleBadge(roleName: string, roleId: number | null): string {
  let color = 'var(--text-200)';
  let bg = 'rgba(255, 255, 255, 0.05)';
  if (roleId === 1) { color = '#fbbf24'; bg = 'rgba(251, 191, 36, 0.1)'; }
  else if (roleId === 2) { color = '#cbd5e1'; bg = 'rgba(203, 213, 225, 0.1)'; }
  else if (roleId === 6) { color = '#4ade80'; bg = 'rgba(74, 222, 128, 0.1)'; }
  else if (roleId === 3) { color = '#c084fc'; bg = 'rgba(192, 132, 252, 0.1)'; }
  else if (roleId === 4) { color = '#38bdf8'; bg = 'rgba(56, 189, 248, 0.1)'; }
  else if (roleId === 5) { color = '#fb923c'; bg = 'rgba(251, 146, 60, 0.1)'; }
  return `<span style="color: ${color}; background: ${bg}; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.05); font-weight: bold; font-size: 0.85rem; display: inline-block; line-height: 1;">${esc(roleName)}</span>`;
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
  state.riderStatsSelectedSeason = state.gameState?.season ?? 2026;
  updateRiderStatsModalWidth();
  state.riderStatsTopResultsFilterCategory = null;
  state.riderStatsTopResultsFilterSeason = null;
  state.riderStatsTopResultsFilterRank = null;
  state.riderStatsTopResultsFilterProfile = null;
  state.riderStatsTopResultsPage = 1;
  $('rider-stats-title').innerHTML = renderRiderStatsTitle(rider, null);
  $('rider-stats-jersey').innerHTML = '';
  const roleHtml = rider ? getRoleBadge(rider.role?.name ?? 'Fahrer', rider.roleId ?? null) : 'Fahrer';
  const ageLabel = rider?.age ? ` · <span style="color: #fbbf24; font-weight: 600;">Alter ${rider.age}</span>` : '';
  $('rider-stats-meta').innerHTML = rider
    ? `${roleHtml}${ageLabel}`
    : 'Historie wird geladen';
  $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, null, true);
  showModal('riderStats');

  const res = await api.getRiderStats(riderId);
  if (state.riderStatsSelectedRiderId !== riderId) {
    return;
  }

  if (!res.success || !res.data) {
    const errRoleHtml = rider ? getRoleBadge(rider.role?.name ?? 'Fahrer', rider.roleId ?? null) : 'Fahrer';
    const errAgeLabel = rider?.age ? ` · <span style="color: #fbbf24; font-weight: 600;">Alter ${rider.age}</span>` : '';
    $('rider-stats-meta').innerHTML = rider
      ? `${errRoleHtml}${errAgeLabel}`
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
  const finalAge = res.data.age ? res.data.age : (rider?.age ? rider.age : null);
  const finalAgeHtml = finalAge ? ` · <span style="color: #fbbf24; font-weight: 600;">Alter ${finalAge}</span>` : '';
  const mentorLabel = res.data.mentorName ? ` · Mentor: ${res.data.mentorName}` : '';
  const mentoredLabel = res.data.mentoredRiderNames && res.data.mentoredRiderNames.length > 0 ? ` · Mentor von: ${res.data.mentoredRiderNames.join(' - ')}` : '';
  const finalRoleHtml = getRoleBadge(rider?.role?.name ?? 'Fahrer', rider?.roleId ?? null);
  $('rider-stats-meta').innerHTML = `${finalRoleHtml}${finalAgeHtml} · ${res.data.seasons.length} Saisons${mentorLabel}${mentoredLabel}`;
  $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, res.data, false);
}

export function initRiderStatsListeners(): void {
  // Ereignis-Quadrat-Tooltip: beim Hover als position:fixed rendern, damit es
  // nie vom overflow:hidden der Ergebnis-Karte abgeschnitten wird (z.B. bei der
  // ersten Etappe direkt unter dem Stage-Race-Header) und immer oben liegt.
  const positionStatusTooltip = (container: HTMLElement): void => {
    const tip = container.querySelector<HTMLElement>('.status-tooltip');
    if (!tip) return;
    tip.style.position = 'fixed';
    tip.style.bottom = 'auto';
    tip.style.margin = '0';
    tip.style.opacity = '1';
    tip.style.visibility = 'visible';
    tip.style.zIndex = '99999';
    tip.style.transform = 'translateX(-50%)';
    const c = container.getBoundingClientRect();
    const t = tip.getBoundingClientRect();
    let top = c.top - t.height - 8;
    if (top < 8) top = c.bottom + 8;
    let left = c.left + c.width / 2;
    const half = t.width / 2;
    if (left - half < 8) left = 8 + half;
    if (left + half > window.innerWidth - 8) left = window.innerWidth - 8 - half;
    tip.style.left = `${Math.round(left)}px`;
    tip.style.top = `${Math.round(top)}px`;
  };
  $('rider-stats-body').addEventListener('mouseover', (event) => {
    const container = (event.target as Element).closest<HTMLElement>('.status-dots-container');
    if (container) positionStatusTooltip(container);
  });
  $('rider-stats-body').addEventListener('mouseout', (event) => {
    const container = (event.target as Element).closest<HTMLElement>('.status-dots-container');
    if (!container) return;
    const related = event.relatedTarget as Element | null;
    if (related && container.contains(related)) return;
    const tip = container.querySelector<HTMLElement>('.status-tooltip');
    if (tip) tip.style.cssText = '';
  });

  $('rider-stats-body').addEventListener('click', (event) => {
    const rankBtn = (event.target as Element).closest<HTMLButtonElement>('button[data-top-results-rank]');
    if (rankBtn) {
      const val = rankBtn.dataset['topResultsRank'];
      const selectedRank = val === 'all' ? null : Number(val);
      state.riderStatsTopResultsFilterRank = state.riderStatsTopResultsFilterRank === selectedRank ? null : selectedRank;
      state.riderStatsTopResultsPage = 1;
      const rider = findRiderById(state.riderStatsSelectedRiderId);
      $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, state.riderStatsPayload, false);
      return;
    }

    const filterBtn = (event.target as Element).closest<HTMLButtonElement>('button[data-top-results-filter]');
    if (filterBtn) {
      const filterType = filterBtn.dataset['topResultsFilter'] as 'gc' | 'mountain' | 'points' | 'youth' | 'breakaway' | 'oneDay' | 'stage';
      state.riderStatsTopResultsFilters[filterType] = !state.riderStatsTopResultsFilters[filterType];
      state.riderStatsTopResultsPage = 1;
      const rider = findRiderById(state.riderStatsSelectedRiderId);
      $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, state.riderStatsPayload, false);
      return;
    }

    // Handle chart toggle checkbox changes
    if (event.target && (event.target as Element).id && (event.target as Element).id.startsWith('toggle-chart-')) {
      const targetId = (event.target as HTMLInputElement).id;
      const checked = (event.target as HTMLInputElement).checked;
      if (targetId === 'toggle-chart-form') {
        chartToggles.form = checked;
      } else if (targetId === 'toggle-chart-season-form') {
        chartToggles.seasonForm = checked;
      } else if (targetId === 'toggle-chart-race-form') {
        chartToggles.raceForm = checked;
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
    if (nextTab !== 'results' && nextTab !== 'program' && nextTab !== 'form' && nextTab !== 'topResults' && nextTab !== 'skills' && nextTab !== 'career' && nextTab !== 'fatigue' && nextTab !== 'contracts') {
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
    } else if (target.id === 'rider-stats-filter-profile') {
      state.riderStatsTopResultsFilterProfile = target.value === 'all' ? null : target.value;
      state.riderStatsTopResultsPage = 1;
      const rider = findRiderById(state.riderStatsSelectedRiderId);
      $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, state.riderStatsPayload, false);
    } else if (target.id === 'rider-stats-results-season-select') {
      state.riderStatsSelectedSeason = Number(target.value);
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
      if (r.rowType === 'breakaway_final') return state.riderStatsTopResultsFilters.breakaway;
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
  if (state.riderStatsTopResultsFilterRank != null && !isNaN(state.riderStatsTopResultsFilterRank)) {
    filteredRows = filteredRows.filter(r => r.resultRank != null && r.resultRank <= state.riderStatsTopResultsFilterRank!);
  }
  if (state.riderStatsTopResultsFilterProfile) {
    filteredRows = filteredRows.filter(r => r.profile === state.riderStatsTopResultsFilterProfile);
  }
  // Top-Results zeigt nur punktebringende Ergebnisse (Design-Vorgabe).
  filteredRows = filteredRows.filter(r => (r.seasonPoints ?? 0) > 0);

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

  const itemsPerPage = 25;
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

  const MONOF = "font-family:'JetBrains Mono',monospace";
  const selStyle = `${MONOF}; font-size:11px; font-weight:700; color:#e2e8f0; background:#0a1122; border:1px solid #1c2b47; border-radius:8px; padding:6px 9px; cursor:pointer;`;
  const labStyle = `${MONOF}; font-size:10px; letter-spacing:.1em; color:#6a7a95;`;

  const filtersHtml = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; gap:16px; flex-wrap:wrap;">
      <span style="font-size:14px; font-weight:800; color:#e2e8f0;">Top-Results <span style="${MONOF}; font-size:11px; font-weight:600; color:#6a7a95;">· nur Punkte-Ergebnisse · beste zuerst</span></span>
      <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:7px;">
          <span style="${labStyle}">SAISON</span>
          <select id="rider-stats-filter-season" style="${selStyle}">
            <option value="all">Gesamt</option>
            ${seasonsList.map(yr => `<option value="${yr}" ${state.riderStatsTopResultsFilterSeason === yr ? 'selected' : ''}>${yr}</option>`).join('')}
          </select>
        </div>
        <div style="display:flex; align-items:center; gap:7px;">
          <span style="${labStyle}">KLASSE</span>
          <select id="rider-stats-filter-category" style="${selStyle}">
            <option value="all">Alle</option>
            ${categoryOptionsHtml}
          </select>
        </div>
        <div style="display:flex; align-items:center; gap:7px;">
          <span style="${labStyle}">PROFIL</span>
          <select id="rider-stats-filter-profile" style="${selStyle}">
            <option value="all">Alle</option>
            ${['Flat','Rolling','Hilly','Hilly Difficult','Medium Mountain','Mountain','High Mountain','Cobble','Cobble Hill','ITT','TTT'].map(p => `<option value="${p}" ${state.riderStatsTopResultsFilterProfile === p ? 'selected' : ''}>${p}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>
    <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap; margin-bottom:14px;">
      <div style="display:flex; align-items:center; gap:7px;">
        <span style="${labStyle}">WERTUNG</span>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          ${renderFilterButton('GC', state.riderStatsTopResultsFilters.gc, 'linear-gradient(135deg, #facc15, #ca8a04)', '#000', 'rgba(234, 179, 8, 0.4)', 'data-top-results-filter', 'gc')}
          ${renderFilterButton('Punkte', state.riderStatsTopResultsFilters.points, 'linear-gradient(135deg, #4ade80, #16a34a)', '#fff', 'rgba(74, 222, 128, 0.4)', 'data-top-results-filter', 'points')}
          ${renderFilterButton('Berg', state.riderStatsTopResultsFilters.mountain, 'linear-gradient(135deg, #f87171, #dc2626)', '#fff', 'rgba(239, 68, 68, 0.4)', 'data-top-results-filter', 'mountain')}
          ${renderFilterButton('Nachwuchs', state.riderStatsTopResultsFilters.youth, 'linear-gradient(135deg, #ffffff, #e2e8f0)', '#0f172a', 'rgba(255, 255, 255, 0.4)', 'data-top-results-filter', 'youth')}
          ${renderFilterButton('Ausreißer', state.riderStatsTopResultsFilters.breakaway, 'linear-gradient(135deg, #c084fc, #7c3aed)', '#fff', 'rgba(168, 85, 247, 0.4)', 'data-top-results-filter', 'breakaway')}
          ${renderFilterButton('Etappen', state.riderStatsTopResultsFilters.stage, 'linear-gradient(135deg, #60a5fa, #2563eb)', '#fff', 'rgba(59, 130, 246, 0.4)', 'data-top-results-filter', 'stage')}
          ${renderFilterButton('One Day', state.riderStatsTopResultsFilters.oneDay, 'linear-gradient(135deg, #b91c1c, #7f1d1d)', '#fff', 'rgba(185, 28, 28, 0.4)', 'data-top-results-filter', 'oneDay')}
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:7px;">
        <span style="${labStyle}">RANG</span>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          ${renderFilterButton('Siege', state.riderStatsTopResultsFilterRank === 1, 'linear-gradient(135deg, #fbbf24, #d4af37)', '#000', 'rgba(251, 191, 36, 0.4)', 'data-top-results-rank', '1')}
          ${renderFilterButton('Top 3', state.riderStatsTopResultsFilterRank === 3, 'linear-gradient(135deg, #e2e8f0, #94a3b8)', '#000', 'rgba(148, 163, 184, 0.4)', 'data-top-results-rank', '3')}
          ${renderFilterButton('Top 5', state.riderStatsTopResultsFilterRank === 5, 'linear-gradient(135deg, #d97706, #b45309)', '#fff', 'rgba(217, 119, 6, 0.4)', 'data-top-results-rank', '5')}
          ${renderFilterButton('Top 10', state.riderStatsTopResultsFilterRank === 10, 'linear-gradient(135deg, #a16207, #78350f)', '#fff', 'rgba(161, 98, 7, 0.4)', 'data-top-results-rank', '10')}
        </div>
      </div>
    </div>
  `;

  const TR_COLS = 'grid-template-columns:56px 46px minmax(150px,1.4fr) 132px 80px 56px 34px 46px;';

  const rowsHtml = paginatedRows.length === 0
    ? '<div style="padding:20px;text-align:center;color:#6a7a95;font-size:13px;">Keine Ergebnisse für diese Filterkombination.</div>'
    : paginatedRows.map(row => {
        const isFinalRow = row.rowType !== 'stage_result';
        const label = isFinalRow
          ? `${row.raceName} · ${getRiderStatsRowTypeLabel(row.rowType)}`
          : (row.stageNumber && row.isStageRace ? `${row.raceName} · Etappe ${row.stageNumber}` : row.raceName);

        let placeCell = '<span style="justify-self:center;color:#5f6f8a;">–</span>';
        if (row.finishStatus === 'otl') {
          placeCell = `<span style="justify-self:center;">${renderRiderStatsRankBadge('OTL', 'place')}</span>`;
        } else if (row.finishStatus === 'dnf') {
          placeCell = `<span style="justify-self:center;">${renderRiderStatsRankBadge('DNF', 'place')}</span>`;
        } else if (row.resultRank != null && isFinalRow) {
          placeCell = `<span style="justify-self:center;"><span class="rider-stats-final-type ${resolveRiderStatsFinalTypeClassName(row.rowType)}" style="font-weight:700;padding:.15rem .45rem;border-radius:4px;border:1px solid;display:inline-block;min-width:1.8rem;text-align:center;">${row.resultRank}</span></span>`;
        } else if (row.resultRank != null) {
          const topCls = row.resultRank <= 3 ? ` rider-stats-rank-badge-top-${row.resultRank}` : '';
          placeCell = `<span style="justify-self:center;"><span class="rider-stats-rank-badge rider-stats-rank-badge-place${topCls}">${esc(String(row.resultRank))}</span></span>`;
        }

        const profileCell = isFinalRow
          ? '<span style="justify-self:center;color:#5f6f8a;">–</span>'
          : (row.profile ? `<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${row.stageId}" style="background:none;border:none;padding:0;cursor:pointer;display:inline-flex;justify-self:center;">${renderStageProfileBadge(row.profile)}</button>` : '<span style="justify-self:center;color:#5f6f8a;">–</span>');
        const scoreCell = !isFinalRow && row.stageScore != null && row.stageScore > 0
          ? `<span style="justify-self:center;">${renderStageEditorScoreBadge(row.stageScore, 0, 350)}</span>`
          : '<span style="justify-self:center;color:#5f6f8a;">–</span>';
        const weatherCell = isFinalRow ? '<span style="justify-self:center;"></span>' : `<span style="justify-self:center;">${renderWeatherIcon(row.rolledWeatherId, row.rolledWetterName)}</span>`;
        const categoryChip = renderRiderStatsRaceBadge(row.raceCategoryName ? row.raceCategoryName.replace(/^world\s*tour\s*-\s*/i, '') : row.raceCategoryName, row.isStageRace, null);

        return `
          <div style="display:grid; ${TR_COLS} gap:9px; align-items:center; padding:9px 14px; border-top:1px solid #14203a;${isFinalRow ? 'background:rgba(34,211,238,.06);' : ''}">
            <span style="${MONOF}; font-size:11px; color:#8494ad;">${row.season}</span>
            ${placeCell}
            <span style="font-size:12.5px; font-weight:600; color:#e2e8f0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0;">${esc(label)}</span>
            <span style="min-width:0; overflow:hidden;">${categoryChip}</span>
            ${profileCell}
            ${scoreCell}
            ${weatherCell}
            <span style="${MONOF}; font-size:12px; font-weight:800; color:${(row.seasonPoints ?? 0) > 0 ? '#22d3ee' : '#5f6f8a'}; justify-self:end;">${row.seasonPoints ?? 0}</span>
          </div>`;
      }).join('');

  const pageInfo = `${activeRows.length} Ergebnis${activeRows.length === 1 ? '' : 'se'}${totalPages > 1 ? ` · Seite ${state.riderStatsTopResultsPage}/${totalPages}` : ''}`;
  const pagerHtml = `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; border-top:1px solid #16233c; ${MONOF};">
      <span style="font-size:11px; color:#6a7a95;">${pageInfo}</span>
      ${totalPages > 1 ? `
        <div style="display:flex; gap:6px;">
          <button type="button" data-top-results-page="${state.riderStatsTopResultsPage - 1}" ${state.riderStatsTopResultsPage === 1 ? 'disabled' : ''} style="border:1px solid #2b3a55; background:transparent; color:${state.riderStatsTopResultsPage === 1 ? '#4a5670' : '#9fb0c9'}; cursor:${state.riderStatsTopResultsPage === 1 ? 'default' : 'pointer'}; font-size:12px; padding:5px 12px; border-radius:6px;">‹ Zurück</button>
          <button type="button" data-top-results-page="${state.riderStatsTopResultsPage + 1}" ${state.riderStatsTopResultsPage === totalPages ? 'disabled' : ''} style="border:1px solid #2b3a55; background:transparent; color:${state.riderStatsTopResultsPage === totalPages ? '#4a5670' : '#9fb0c9'}; cursor:${state.riderStatsTopResultsPage === totalPages ? 'default' : 'pointer'}; font-size:12px; padding:5px 12px; border-radius:6px;">Weiter ›</button>
        </div>` : ''}
    </div>
  `;

  return `
    <section class="rider-stats-top-results" style="margin-top: 1rem;">
      ${filtersHtml}
      <div style="border-radius:14px; overflow:hidden; border:1px solid #1e2c49; background:#0c1526;">
        <div style="display:grid; ${TR_COLS} gap:9px; padding:8px 14px; ${MONOF}; font-size:9px; letter-spacing:.05em; color:#5a6a85; border-bottom:1px solid #16233c;">
          <span>SAISON</span><span style="justify-self:center;">PLATZ</span><span>RENNEN / ETAPPE</span><span>KLASSE</span><span style="justify-self:center;">PROFIL</span><span style="justify-self:center;">SCORE</span><span style="justify-self:center;">WTR</span><span style="justify-self:end;">PKT</span>
        </div>
        ${rowsHtml}
        ${pagerHtml}
      </div>
    </section>
  `;
}

export function renderRiderStatsContractsTab(payload: RiderStatsPayload | null): string {
  const contracts = payload?.contracts || [];

  if (contracts.length === 0) {
    return `
      <section class="rider-stats-placeholder">
        <h3>Keine Vertragsdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden keine Verträge in der Datenbank erfasst.</p>
      </section>
    `;
  }

  const currentSeason = state.gameState?.season ?? 2026;

  // Per-Saison-Aggregation aus dem Payload (keine Datenfeld-Aenderung noetig)
  const raceDaysBySeason = new Map<number, number>((payload?.careerRaceDaysBySeason ?? []).map((r) => [r.season, r.raceDays]));
  const seasonAgg = new Map<number, { wins: number; points: number }>();
  for (const s of payload?.seasons ?? []) {
    let wins = 0;
    let points = 0;
    for (const block of s.raceBlocks ?? []) {
      for (const row of block.rows ?? []) {
        points += row.seasonPoints ?? 0;
        if ((row.rowType === 'stage_result' && row.resultRank === 1) || (row.rowType === 'gc_final' && row.resultRank === 1)) wins++;
      }
    }
    seasonAgg.set(s.season, { wins, points });
  }

  const yearlySteps: Array<{
    season: number;
    teamId: number | null;
    teamName: string | null;
    roleName: string | null;
    status: 'active' | 'future' | 'expired';
  }> = [];

  for (const c of contracts) {
    for (let yr = c.startSeason; yr <= c.endSeason; yr++) {
      let roleName: string | null = null;
      if (yr > currentSeason) {
        roleName = '-';
      } else if (yr === currentSeason) {
        roleName = payload?.roleName || payload?.seasonRoles?.find(sr => sr.season === yr)?.roleName || '-';
      } else {
        roleName = payload?.seasonRoles?.find(sr => sr.season === yr)?.roleName || '-';
      }
      yearlySteps.push({
        season: yr,
        teamId: c.teamId,
        teamName: c.teamName,
        roleName,
        status: yr === currentSeason ? 'active' : (yr > currentSeason ? 'future' : 'expired'),
      });
    }
  }
  yearlySteps.sort((a, b) => b.season - a.season);

  // Kopf: aktuelles Team + Vertragslaufzeit
  const activeContract = contracts.find((c) => c.startSeason <= currentSeason && c.endSeason >= currentSeason) ?? null;
  const headerTeamId = activeContract?.teamId ?? payload?.teamId ?? null;
  const headerTeamName = activeContract?.teamName ?? payload?.teamName ?? 'Ohne Team';
  const headerJersey = headerTeamId
    ? `<img src="${esc(resolveTeamJerseyAssetPath(headerTeamId))}" alt="${esc(headerTeamName)}" style="width:40px;height:40px;object-fit:contain;flex:0 0 auto;filter:drop-shadow(0 2px 4px rgba(0,0,0,.5));" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';" />`
    : '';

  const statusPill = (status: 'active' | 'future' | 'expired'): string => {
    if (status === 'active') return '<span style="font-size:11px;font-weight:700;color:#86efac;background:rgba(34,197,94,.14);border:1px solid rgba(34,197,94,.32);padding:3px 10px;border-radius:99px;">Aktiv</span>';
    if (status === 'future') return '<span style="font-size:11px;font-weight:700;color:#93c5fd;background:rgba(59,130,246,.14);border:1px solid rgba(59,130,246,.34);padding:3px 10px;border-radius:99px;">Zukünftig</span>';
    return '<span style="font-size:11px;font-weight:700;color:#93a3bd;border:1px solid #2b3a55;padding:3px 10px;border-radius:99px;">Ausgelaufen</span>';
  };

  const GRID = 'display:grid;grid-template-columns:70px minmax(120px,1fr) 96px 104px 74px 56px 82px 52px;gap:10px;align-items:center;';
  const MONOF = "font-family:'JetBrains Mono',monospace";

  const rowsHtml = yearlySteps.map((step) => {
    const agg = seasonAgg.get(step.season);
    const raceDays = raceDaysBySeason.get(step.season) ?? (step.season === currentSeason ? (payload?.currentSeasonRaceDays ?? 0) : 0);
    const wins = step.status === 'future' ? '–' : String(agg?.wins ?? 0);
    const points = step.status === 'future' ? '–' : String(agg?.points ?? (step.season === currentSeason ? (payload?.currentSeasonPoints ?? 0) : 0));
    const uci = step.season === currentSeason && payload?.currentSeasonRank != null ? `#${payload.currentSeasonRank}` : '–';
    const teamCell = step.teamId
      ? `<span style="display:inline-flex;align-items:center;gap:9px;min-width:0;">${renderMiniJersey(step.teamId, step.teamName)}<span style="font-size:12.5px;color:#cbd5e1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(step.teamName ?? '')}</span></span>`
      : '<span style="font-size:12.5px;color:#94a3b8;font-style:italic;">Free Agent</span>';
    return `
      <div style="${GRID}padding:9px 14px;border-top:1px solid #14203a;">
        <span style="${MONOF};font-size:13px;font-weight:700;color:#e2e8f0;">${step.season}</span>
        ${teamCell}
        <span style="font-size:12px;color:#9fb0c9;">${esc(step.roleName || '-')}</span>
        <span>${statusPill(step.status)}</span>
        <span style="${MONOF};font-size:12px;color:#e2e8f0;justify-self:end;">${step.status === 'future' ? '–' : raceDays}</span>
        <span style="${MONOF};font-size:12px;color:#fbbf24;justify-self:end;">${wins}</span>
        <span style="${MONOF};font-size:12px;color:#e2e8f0;justify-self:end;">${points}</span>
        <span style="${MONOF};font-size:12px;color:#22d3ee;justify-self:end;">${uci}</span>
      </div>`;
  }).join('');

  return `
    <section class="rider-stats-section" style="margin-top: 1rem;">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
        ${headerJersey}
        <div style="flex:1;min-width:0;">
          <div style="font-size:16px;font-weight:800;color:#f1f5f9;">${esc(headerTeamName)}</div>
          <div style="${MONOF};font-size:11px;color:#8494ad;">${activeContract ? `aktueller Vertrag bis ${activeContract.endSeason}` : 'kein aktiver Vertrag'}</div>
        </div>
        ${activeContract ? '<span style="font-size:11px;font-weight:700;color:#86efac;background:rgba(34,197,94,.14);border:1px solid rgba(34,197,94,.32);padding:5px 12px;border-radius:99px;">Vertrag aktiv</span>' : ''}
      </div>
      <div style="border-radius:14px;border:1px solid #1e2c49;background:#0c1526;padding:16px 18px;">
        <div style="${MONOF};font-size:10px;letter-spacing:.12em;color:#6a7a95;margin-bottom:13px;">VERTRÄGE &amp; SAISON-BILANZ</div>
        <div style="border-radius:12px;overflow:hidden;border:1px solid #16233c;">
          <div style="${GRID}padding:8px 14px;${MONOF};font-size:9px;letter-spacing:.05em;color:#5a6a85;background:#0a1122;border-bottom:1px solid #16233c;">
            <span>SAISON</span><span>TEAM</span><span>ROLLE</span><span>STATUS</span><span style="justify-self:end;">RENNTAGE</span><span style="justify-self:end;">SIEGE</span><span style="justify-self:end;">PUNKTE</span><span style="justify-self:end;">UCI</span>
          </div>
          ${rowsHtml}
        </div>
      </div>
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

  // Broadcast-Highlights (5 grosse Karten)
  const MONOF = "font-family:'JetBrains Mono',monospace";
  const highlight = (value: string, label: string, color: string): string => `
    <div style="border-radius:12px;border:1px solid #1e2c49;background:#0c1526;padding:15px 16px;text-align:center;">
      <div style="${MONOF};font-size:26px;font-weight:800;color:${color};letter-spacing:-.02em;">${value}</div>
      <div style="${MONOF};font-size:9px;letter-spacing:.06em;color:#8494ad;margin-top:5px;text-transform:uppercase;">${label}</div>
    </div>`;

  // Broadcast-Panel (Titel + Zeilen aus Punkt/Label/optionaler Sub/Wert)
  const panel = (title: string, items: Array<{ label: string; value: string; color: string; sub?: string }>): string => `
    <div style="border-radius:12px;border:1px solid #1e2c49;background:#0c1526;padding:14px 16px;">
      <div style="${MONOF};font-size:10px;letter-spacing:.12em;color:#6a7a95;margin-bottom:6px;text-transform:uppercase;">${title}</div>
      ${items.map((it) => `
        <div style="display:flex;align-items:center;gap:9px;padding:7px 0;border-top:1px solid #131f34;">
          <span style="width:8px;height:8px;border-radius:2px;background:${it.color};flex:0 0 auto;"></span>
          <span style="font-size:12.5px;color:#9fb0c9;flex:1;">${it.label}</span>
          ${it.sub ? `<span style="${MONOF};font-size:10px;color:#6a7a95;margin-right:8px;">${it.sub}</span>` : ''}
          <span style="${MONOF};font-size:13px;font-weight:800;color:${it.color};">${it.value}</span>
        </div>`).join('')}
    </div>`;

  const jerseyTotals = Object.values(stats.categories || {}).reduce(
    (acc, c: any) => ({
      yellow: acc.yellow + (c.leaderJerseys || 0),
      green: acc.green + (c.pointsJerseys || 0),
      mountain: acc.mountain + (c.mountainJerseys || 0),
      youth: acc.youth + (c.youthJerseys || 0),
      breakaway: acc.breakaway + (c.breakawayJerseys || 0),
    }),
    { yellow: 0, green: 0, mountain: 0, youth: 0, breakaway: 0 }
  );

  return `
    <section class="rider-stats-career" style="margin-top: 1rem;">
      <div style="font-size:14px;font-weight:800;color:#e2e8f0;margin-bottom:14px;">Karrierestatistiken</div>
      <!-- Highlights -->
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;">
        ${highlight(String(payload.careerWins ?? 0), 'Karriere-Siege', '#fbbf24')}
        ${highlight(String(careerRaceDays), 'Renntage', '#a855f7')}
        ${highlight((stats.totalKm ?? 0).toLocaleString('de-DE'), 'Gesamt-km', '#22d3ee')}
        ${highlight(Math.round(stats.breakawayKms ?? 0).toLocaleString('de-DE'), 'Ausreißer-km', '#c084fc')}
        ${highlight(String(stats.superteamCount ?? 0), 'Superteam-Starts', '#6366f1')}
      </div>

      <!-- Gruppierte Panels -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;margin-top:16px;align-items:start;">
        ${panel('Aggressivität', [
          { label: 'Ausreißversuche', value: String(stats.breakawayAttempts), color: '#3498db' },
          { label: 'Erfolgreiche Ausreißer', value: String(stats.successfulBreakaways ?? 0), color: '#2ecc71' },
          { label: 'Attacken', value: String(stats.attacks), color: '#ffd700' },
          { label: 'Konterattacken', value: String(stats.counterAttacks), color: '#e67e22' },
        ])}
        ${panel('Ausfälle', [
          { label: 'DNS', value: String(stats.dnsCount ?? 0), color: '#fc8181' },
          { label: 'DNF', value: String(stats.dnfCount ?? 0), color: '#f56565' },
          { label: 'OTL', value: String(stats.otlCount ?? 0), color: '#e53e3e' },
          { label: 'Stürze', value: String(stats.crashes), color: '#e74c3c' },
          { label: 'Defekte', value: String(stats.defects), color: '#95a5a6' },
        ])}
        ${panel('Gesundheit', [
          { label: 'Krankheiten', value: String(stats.illnesses ?? 0), sub: `${stats.illnessDays ?? 0} Tage`, color: '#ed64a6' },
          { label: 'Verletzungen', value: String(stats.injuries ?? 0), sub: `${stats.injuryDays ?? 0} Tage`, color: '#f6ad55' },
        ])}
        ${panel('Heim', [
          { label: 'Heimvorteil', value: String(stats.homeAdvantageDays ?? 0), sub: 'Tage', color: '#38bdf8' },
          { label: 'Heimbonus', value: String(stats.superHomeAdvantageDays ?? 0), sub: 'Tage', color: '#facc15' },
          { label: 'Heimmalus', value: String(stats.homePressureDays ?? 0), sub: 'Tage', color: '#fb7185' },
        ])}
        ${panel('Getragene Wertungstrikots', [
          { label: 'Gelbes Trikot', value: String(jerseyTotals.yellow), sub: 'Tage', color: '#fbbf24' },
          { label: 'Grünes Trikot', value: String(jerseyTotals.green), sub: 'Tage', color: '#4ade80' },
          { label: 'Bergtrikot', value: String(jerseyTotals.mountain), sub: 'Tage', color: '#f87171' },
          { label: 'Weißes Trikot', value: String(jerseyTotals.youth), sub: 'Tage', color: '#e2e8f0' },
          { label: 'Lila Trikot', value: String(jerseyTotals.breakaway), sub: 'Tage', color: '#a855f7' },
        ])}
      </div>

      <!-- Categories details -->
      <h3 style="font-size:13px;font-weight:800;color:#e2e8f0;margin:22px 0 12px;padding-bottom:8px;border-bottom:1px solid #1c2b47;">Ergebnisse nach Rennklasse <span style="${MONOF};font-size:10px;font-weight:600;color:#6a7a95;">· Podestplätze</span></h3>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;align-items:start;">
        ${categoriesToShow.map(cat => {
          const catData: any = stats.categories[cat.key] || {};
          const num = (k: string): number => catData[k] || 0;
          const placeRow = (title: string, w: number, s: number, t: number, x: number): string => `
            <div style="${MONOF};font-size:9px;letter-spacing:.08em;color:#6a7a95;margin:6px 0 4px;">${title}</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <span style="display:inline-flex;align-items:center;gap:4px;${MONOF};font-size:11px;font-weight:800;color:#e2e8f0;" title="1. Plätze"><span style="width:11px;height:11px;border-radius:3px;background:#ffd700;"></span>${w}</span>
              <span style="display:inline-flex;align-items:center;gap:4px;${MONOF};font-size:11px;font-weight:800;color:#e2e8f0;" title="2. Plätze"><span style="width:11px;height:11px;border-radius:3px;background:#cbd5e1;"></span>${s}</span>
              <span style="display:inline-flex;align-items:center;gap:4px;${MONOF};font-size:11px;font-weight:800;color:#e2e8f0;" title="3. Plätze"><span style="width:11px;height:11px;border-radius:3px;background:#d08b5b;"></span>${t}</span>
              <span style="display:inline-flex;align-items:center;gap:4px;${MONOF};font-size:11px;font-weight:800;color:#67e8f9;" title="Top 10 (Plätze 4–10)"><span style="width:11px;height:11px;border-radius:3px;background:#22d3ee;"></span>${x}</span>
            </div>`;
          const sections = cat.isStage
            ? placeRow('GC', num('gcWins'), num('gcSecond'), num('gcThird'), num('gcTopTen')) + placeRow('Etappen', num('stageWins'), num('stageSecond'), num('stageThird'), num('stageTopTen'))
            : placeRow('One-Day', num('oneDayWins'), num('oneDaySecond'), num('oneDayThird'), num('oneDayTopTen'));
          const jerseyDef: Array<[string, string, number]> = [
            ['#fbbf24', 'Gelbes Trikot (GC-Führung) · Tage', num('leaderJerseys')],
            ['#4ade80', 'Grünes Trikot (Punktewertung) · Tage', num('pointsJerseys')],
            ['#f87171', 'Bergtrikot (Bergwertung) · Tage', num('mountainJerseys')],
            ['#e2e8f0', 'Weißes Trikot (Nachwuchswertung) · Tage', num('youthJerseys')],
            ['#a855f7', 'Ausreißer-Trikot (Aktivster Fahrer) · Tage', num('breakawayJerseys')],
          ];
          const jerseys = cat.isStage ? `
            <div style="${MONOF};font-size:9px;letter-spacing:.08em;color:#6a7a95;margin:9px 0 4px;">TRIKOT-TAGE</div>
            <div style="display:flex;gap:7px;flex-wrap:wrap;">
              ${jerseyDef.map(([c, t, v]) => `<span style="display:inline-flex;align-items:center;gap:4px;${MONOF};font-size:11px;font-weight:800;color:${c === '#a855f7' ? '#c4b5fd' : '#cbd5e1'};" title="${esc(t)}"><span style="width:10px;height:10px;border-radius:2px;background:${c};"></span>${v}</span>`).join('')}
            </div>` : '';
          return `
            <div style="background:#0c1526;border:1px solid #1e2c49;border-radius:12px;padding:14px 16px;">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;">
                <span style="font-size:13px;font-weight:700;color:#e2e8f0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(cat.name)}">${esc(cat.name)}</span>
                <span style="${MONOF};font-size:10px;color:#8494ad;flex:0 0 auto;">${num('raceDays')} Tage</span>
              </div>
              ${sections}
              ${jerseys}
            </div>`;
        }).join('')}
      </div>
    </section>
  `;
}

(window as any).openRiderStatsFromRiderStats = openRiderStats;
