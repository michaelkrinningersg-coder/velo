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
import { formatRaceDateRange, renderStageProfileBadge, raceCategoryBadge, raceCategoryNameBadge } from './dashboard';
import type { Rider, RiderStatsPayload } from '../../../shared/types';
import type { RiderStatsTab } from '../state';

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
  return `<span class="badge badge-race-category" style="${badgeStyle}">${esc(name)}</span>`;
}

/** Legacy wrapper – kept for injuries.ts compatibility. */
export function renderRiderStatsCategoryBadge(categoryName: string | null | undefined): string {
  if (!categoryName) return '-';
  const categoryStyle = resolveRaceCategoryBadgeStyle(categoryName);
  const badgeStyle = buildRaceCategoryBadgeCssVariables(categoryStyle);
  return `<span class="badge badge-race-category" style="${badgeStyle}">${esc(categoryName)}</span>`;
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
    default:
      return 'Etappe';
  }
}

export function renderRiderStatsFinalTypeBadge(rowType: string): string {
  const className = resolveRiderStatsFinalTypeClassName(rowType);
  return `<span class="rider-stats-final-type ${className}">${esc(getRiderStatsRowTypeLabel(rowType))}</span>`;
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
    default:
      return 4;
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

  return `
    <div class="rider-stats-header-grid">
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Land">${resolvedCountryFlag} <span>${esc(resolvedCountryCode || '-')}</span></span>
        <span class="rider-stats-icon-pill" title="Team">${resolvedTeamId ? renderMiniJersey(resolvedTeamId, resolvedTeamName) : ''} <span>${esc(resolvedTeamName)}</span></span>
        <span class="rider-stats-icon-pill" title="Rolle">${esc(resolvedRoleName)}</span>
        <span class="rider-stats-icon-pill" title="Formphase">${renderSeasonFormPhaseIndicator(resolvedSeasonPhase)} <span>Form</span></span>
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
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
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
      <button type="button" class="team-detail-page-tab${state.riderStatsTab === 'program' ? ' team-detail-page-tab-active' : ''}" data-rider-stats-tab="program" aria-selected="${state.riderStatsTab === 'program' ? 'true' : 'false'}"${hasProgram ? '' : ' disabled'}>Programm</button>
      <button type="button" class="team-detail-page-tab${state.riderStatsTab === 'form' ? ' team-detail-page-tab-active' : ''}" data-rider-stats-tab="form" aria-selected="${state.riderStatsTab === 'form' ? 'true' : 'false'}">Form</button>
    </div>`;
}

export function renderRiderStatsFormTab(payload: RiderStatsPayload | null): string {
  if (!payload) {
    return `
      <section class="rider-stats-placeholder">
        <h3>Keine Formdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Saison noch keine Formdaten aufgezeichnet.</p>
      </section>`;
  }

  const history = payload.formHistory ?? [];
  const currentDateStr = state.gameState?.currentDate ?? new Date().toISOString();
  const currentYear = history.length > 0 
    ? new Date(history[history.length - 1].date).getUTCFullYear()
    : new Date(currentDateStr).getUTCFullYear();
  const yearStart = new Date(Date.UTC(currentYear, 0, 1)).getTime();
  const msPerDay = 86400000;
  
  const chartW = 500;
  const chartH = 120;
  const padL = 30;
  const padT = 20;

  const pts = history.map((entry) => {
    const entryDate = new Date(entry.date).getTime();
    const dayOfYear = (entryDate - yearStart) / msPerDay;
    const x = padL + (dayOfYear / 365) * chartW;
    const y = padT + chartH - (Math.min(12, Math.max(0, entry.totalForm)) / 12) * chartH;
    return { x, y, form: entry.totalForm, date: entry.date };
  });

  let pathData = '';
  let pointsHtml = '';
  let fillPath = '';

  if (pts.length > 0) {
    pathData = `M ${pts.map((p) => `${p.x},${p.y}`).join(' L ')}`;
    pointsHtml = pts.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#fff" stroke="var(--accent-primary)" stroke-width="2"><title>${p.date}: ${p.form}</title></circle>`).join('');
    fillPath = `${pathData} L ${pts[pts.length - 1].x},${padT + chartH} L ${pts[0].x},${padT + chartH} Z`;
  }

  const phaseColors: Record<string, string> = {
    build: 'rgba(16, 185, 129, 0.3)',
    peak: 'rgba(16, 185, 129, 0.3)',
    decline: 'rgba(239, 68, 68, 0.3)',
    neutral: 'rgba(245, 158, 11, 0.3)',
  };
  const fillColor = phaseColors[payload.seasonFormPhase] ?? phaseColors.neutral;

  let gridHtml = '';
  for (let i = 0; i <= 12; i += 2) {
    const y = padT + chartH - (i / 12) * chartH;
    gridHtml += `<line x1="${padL}" y1="${y}" x2="${padL + chartW}" y2="${y}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`;
    gridHtml += `<text x="${padL - 5}" y="${y + 4}" fill="var(--text-secondary)" font-size="10" text-anchor="end">${i}</text>`;
  }

  let xAxisHtml = '';
  for (let week = 0; week <= 52; week += 5) {
    const x = padL + (week / 52) * chartW;
    xAxisHtml += `<text x="${x}" y="${padT + chartH + 15}" fill="var(--text-secondary)" font-size="10" text-anchor="middle">W${week}</text>`;
  }

  let peaksHtml = '';
  let phaseBackgroundsHtml = '';
  if (payload.peakDates) {
    for (const pDate of payload.peakDates) {
      const pTime = new Date(pDate).getTime();
      const pDay = (pTime - yearStart) / msPerDay;
      const x = padL + (pDay / 365) * chartW;
      peaksHtml += `<line x1="${x}" y1="${padT}" x2="${x}" y2="${padT + chartH}" stroke="#ffffff" stroke-width="2"><title>Peak: ${pDate}</title></line>`;
      
      // Build phase (14 days before peak)
      const buildStartDay = pDay - 14;
      const buildX = padL + (buildStartDay / 365) * chartW;
      const buildW = (14 / 365) * chartW;
      phaseBackgroundsHtml += `<rect x="${buildX}" y="${padT}" width="${buildW}" height="${chartH}" fill="rgba(16, 185, 129, 0.1)" />`;

      // Decline phase (28 days after peak)
      const declineW = (28 / 365) * chartW;
      phaseBackgroundsHtml += `<rect x="${x}" y="${padT}" width="${declineW}" height="${chartH}" fill="rgba(239, 68, 68, 0.1)" />`;
    }
  }

  return `
    <section class="rider-stats-form-tab">
      <div class="rider-stats-season-head">
        <h3>Formverlauf (Saison ${currentYear})</h3>
      </div>
      <div class="rider-stats-chart-wrapper" style="margin-top: 1rem; overflow-x: auto; background: var(--bg-secondary); border-radius: 8px; padding: 1rem;">
        <svg width="100%" height="200" viewBox="0 0 540 180" style="min-width: 500px;">
          ${phaseBackgroundsHtml}
          ${gridHtml}
          ${xAxisHtml}
          ${peaksHtml}
          ${fillPath ? `<path d="${fillPath}" fill="${fillColor}" />` : ''}
          ${pathData ? `<path d="${pathData}" fill="none" stroke="var(--accent-primary)" stroke-width="2" />` : ''}
          ${pointsHtml}
        </svg>
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
                    <col style="width: 10%;">
                    <col style="width: 5%;">
                    <col style="width: 5%;">
                    <col style="width: 4%;">
                    <col style="width: 13%;">
                    <col style="width: 20%;">
                    <col style="width: 6%;">
                    <col style="width: 6%;">
                    <col style="width: 6%;">
                    <col style="width: 20%;">
                    <col style="width: 5%;">
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Datum</th>
                      <th>Platz</th>
                      <th>GC</th>
                      <th class="rider-stats-breakaway-col"></th>
                      <th>Klasse</th>
                      <th>Rennen / Etappe</th>
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
                          <td>${isFinalRow ? renderRiderStatsFinalTypeBadge(row.rowType) : renderRiderStatsRaceBadge(row.raceCategoryName, row.isStageRace, null)}</td>
                          <td>${esc(raceStageLabel)}</td>
                          <td>${row.profile ? renderStageProfileBadge(row.profile) : '–'}</td>
                          <td>${row.distanceKm != null ? esc(row.distanceKm.toFixed(1).replace('.', ',')) : '–'}</td>
                          <td>${row.elevationGainMeters != null ? esc(String(Math.round(row.elevationGainMeters))) : '–'}</td>
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

export async function openRiderStats(riderId: number): Promise<void> {
  const rider = findRiderById(riderId);
  const teamName = rider?.activeTeamId != null
    ? state.teams.find((team) => team.id === rider.activeTeamId)?.name ?? null
    : null;

  state.riderStatsSelectedRiderId = riderId;
  state.riderStatsPayload = null;
  state.riderStatsTab = 'results';
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
    const tabButton = (event.target as Element).closest<HTMLButtonElement>('button[data-rider-stats-tab]');
    if (!tabButton) {
      return;
    }

    const nextTab = tabButton.dataset['riderStatsTab'] as RiderStatsTab;
    if (nextTab !== 'results' && nextTab !== 'program' && nextTab !== 'form') {
      return;
    }

    if (nextTab === 'program' && (state.riderStatsPayload?.programRaces.length ?? 0) === 0) {
      return;
    }

    state.riderStatsTab = nextTab;
    const rider = findRiderById(state.riderStatsSelectedRiderId);
    $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, state.riderStatsPayload, false);
  });
}
