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
} from '../state';
import { formatRaceDateRange, renderStageProfileBadge } from './dashboard';
import type { Rider, RiderStatsPayload } from '../../../shared/types';
import type { RiderStatsTab } from '../state';

export const RIDER_STATS_ICONS = {
  seasonPoints: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
  rank: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 2l-3 6h6zM9 10H5l3 8h8l3-8h-4l-3 4-3-4z"/></svg>',
  raceDays: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>',
  wins: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M20.2 2H17V0H7v2H3.8C2.8 2 2 2.8 2 3.8v2.4c0 3.8 2.9 6.9 6.6 7.3.8 2 2.6 3.5 4.9 3.8v2.7H10v3h4v-3h-3.5v-2.7c2.3-.3 4.1-1.8 4.9-3.8 3.7-.4 6.6-3.5 6.6-7.3V3.8C22 2.8 21.2 2 20.2 2zM4 6.2V4h3v5.1C5.3 8.3 4 7.4 4 6.2zm16 0c0 1.2-1.3 2.1-3 2.9V4h3v2.2z"/></svg>',
  seasonForm: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M3 3v18h18v-2H5V3H3zm13.6 7.5L12 15l-4-4-4 4v2.8l4-4 4 4 6-7.5-1.4-1.8z"/></svg>',
  raceForm: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 2c-4.4 3.3-7 8.1-7 12 0 3.9 3.1 7 7 7s7-3.1 7-7c0-3.9-2.6-8.7-7-12zm0 17c-2.8 0-5-2.2-5-5 0-2.6 1.8-6.1 5-9.1 3.2 3 5 6.5 5 9.1 0 2.8-2.2 5-5 5z"/><path d="M11 11h2v5h-2z"/></svg>',
  longFatigue: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M16 4h-2V2h-4v2H8c-.55 0-1 .45-1 1v16c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zm-1 15H9V6h6v13zm-5-3h4v-2h-4v2zm0-4h4V9h-4v3z"/></svg>',
  shortFatigue: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M13 2.05v6.95h5l-7 13v-6.95H6l7-13z"/></svg>',
  rollingRaceDays: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>',
  flat: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M2 11h20v2H2z"/></svg>',
  hilly: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M3 14c2 0 4-3 6-3s4 3 6 3 4-3 6-3v2c-2 0-4 3-6 3s-4-3-6-3-4 3-6 3v-2z"/></svg>',
  mediumMountain: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M6 18l5-7 5 7H6zm6-10l-4 5.6L4 18h16l-4-5.6L12 8z"/></svg>',
  mountain: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 3l-8 15h16L12 3zm0 4.2L16.2 16H7.8L12 7.2z"/></svg>',
  stageRace: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>',
  oneDay: '<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>',
  breakaway: '<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer" style="margin-right: 0.4rem;">✂</span>',
};

export function renderRiderStatsCategoryBadge(categoryName: string | null | undefined): string {
  const categoryStyle = resolveRaceCategoryBadgeStyle(categoryName);
  const badgeStyle = buildRaceCategoryBadgeCssVariables(categoryStyle);
  return `<span class="badge badge-race-category rider-stats-category-badge" style="${badgeStyle}">${esc(categoryName ?? 'Unbekannte Kategorie')}</span>`;
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

  return `<span class="rider-availability-marker" title="${esc(title)}" aria-label="${esc(title)}">✂</span>`;
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
  
  const terrainPoints = payload?.pointsByTerrain ?? { flat: 0, hilly: 0, mediumMountain: 0, mountain: 0 };
  const maxTerrain = Math.max(terrainPoints.flat, terrainPoints.hilly, terrainPoints.mediumMountain, terrainPoints.mountain);
  
  const formatPoints = payload?.pointsByRaceFormat ?? { stageRace: 0, oneDay: 0 };
  const maxFormat = Math.max(formatPoints.stageRace, formatPoints.oneDay);

  const specLabel1 = rider?.specialization1 ? getRiderSpecializationLabel(rider.specialization1) : '-';
  const specLabel2 = rider?.specialization2 ? getRiderSpecializationLabel(rider.specialization2) : '-';
  const specLabel3 = rider?.specialization3 ? getRiderSpecializationLabel(rider.specialization3) : '-';

  return `
    <div class="rider-stats-header-grid">
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Land">${resolvedCountryFlag} <span>${esc(resolvedCountryCode || '-')}</span></span>
        <span class="rider-stats-icon-pill" title="Team">${resolvedTeamId ? renderMiniJersey(resolvedTeamId, resolvedTeamName) : ''} <span>${esc(resolvedTeamName)}</span></span>
        <span class="rider-stats-icon-pill" title="Rolle">${esc(resolvedRoleName)}</span>
        <span class="rider-stats-icon-pill" title="Formphase">${renderRiderStatsFinalTypeBadge(resolvedSeasonPhase)} <span>Form</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;" title="Overall-Stärke">${renderRiderOverallRatingBadge(resolvedOverallRating)}</span>
        <span class="rider-stats-icon-pill" title="Season-Form">${formBonus >= 0 ? '+' : ''}${formBonus}</span>
        <span class="rider-stats-icon-pill" title="Rennform">${raceFormBonus >= 0 ? '+' : ''}${raceFormBonus}</span>
        <span class="rider-stats-icon-pill" title="Programm">${esc(programName)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Saisonrenntage">${seasonRaceDaysTotal}</span>
        <span class="rider-stats-icon-pill ${rolling30dRaceDays > 14 ? 'text-warning' : ''}" title="30-Tage Renntage">${rolling30dRaceDays}</span>
        <span class="rider-stats-icon-pill" title="Langzeit-Fatigue">${longTermFatigueMalus}</span>
        <span class="rider-stats-icon-pill ${shortTermFatigueWarning !== 'none' ? 'text-error' : ''}" title="Kurzzeitfatigue">${shortTermFatigueMalus}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Saisonpunkte">${currentSeasonPoints}</span>
        <span class="rider-stats-icon-pill" title="Saisonplatzierung">${currentSeasonRank ? '#' + currentSeasonRank : '-'}</span>
        <span class="rider-stats-icon-pill" title="Renntage">${currentSeasonRaceDays}</span>
        <span class="rider-stats-icon-pill" title="Siege">${careerWins}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:124;--rider-stats-pill-border-alpha:0.44;--rider-stats-pill-bg-alpha:0.26; font-weight: 500;" title="Spezialisierung 1">${esc(specLabel1)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:41;--rider-stats-pill-border-alpha:0.31;--rider-stats-pill-bg-alpha:0.18; font-weight: 500;" title="Spezialisierung 2">${esc(specLabel2)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:6;--rider-stats-pill-border-alpha:0.26;--rider-stats-pill-bg-alpha:0.14; font-weight: 500;" title="Spezialisierung 3">${esc(specLabel3)}</span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${renderRiderStatsIconHeatPill(RIDER_STATS_ICONS.stageRace, 'Rundfahrten Punkte', formatPoints.stageRace, maxFormat)}
        ${renderRiderStatsIconHeatPill(RIDER_STATS_ICONS.oneDay, 'Eintagesrennen Punkte', formatPoints.oneDay, maxFormat)}
        <span class="rider-stats-icon-pill" title="Ausreißversuche">${RIDER_STATS_ICONS.breakaway} ${currentSeasonBreakawayAttempts}</span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${renderRiderStatsIconHeatPill(RIDER_STATS_ICONS.flat, 'Flach-Punkte', terrainPoints.flat, maxTerrain)}
        ${renderRiderStatsIconHeatPill(RIDER_STATS_ICONS.hilly, 'Hügel-Punkte', terrainPoints.hilly, maxTerrain)}
        ${renderRiderStatsIconHeatPill(RIDER_STATS_ICONS.mediumMountain, 'Mittelgebirge-Punkte', terrainPoints.mediumMountain, maxTerrain)}
        ${renderRiderStatsIconHeatPill(RIDER_STATS_ICONS.mountain, 'Hochgebirge-Punkte', terrainPoints.mountain, maxTerrain)}
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
    </div>`;
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
          <thead><tr><th>Datum</th><th>Land</th><th>Rennen</th><th>Rennklasse</th></tr></thead>
          <tbody>
            ${races.map((race) => `
              <tr>
                <td>${esc(formatRaceDateRange(race))}</td>
                <td class="results-flag-col-cell">${race.country?.code3 ? renderFlag(race.country.code3) : '–'}</td>
                <td><strong>${esc(race.name)}</strong></td>
                <td>${renderRiderStatsCategoryBadge(race.category?.name ?? null)}</td>
              </tr>
            `).join('')}
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

  return '<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer">✂</span>';
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
                ${renderRiderStatsCategoryBadge(block.raceCategoryName)}
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
                          <td>${isFinalRow ? renderRiderStatsFinalTypeBadge(row.rowType) : renderRiderStatsCategoryBadge(row.raceCategoryName)}</td>
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
  $('rider-stats-meta').textContent = rider
    ? `${rider.role?.name ?? 'Fahrer'} · ${teamName ?? 'Team unbekannt'}`
    : 'Historie wird geladen';
  $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, null, true);
  showModal('riderStats');

  const res = await api.getRiderStats(riderId);
  if (state.riderStatsSelectedRiderId !== riderId) {
    return;
  }

  if (!res.success || !res.data) {
    $('rider-stats-meta').textContent = rider
      ? `${rider.role?.name ?? 'Fahrer'} · ${teamName ?? 'Team unbekannt'}`
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
  $('rider-stats-meta').textContent = `${rider?.role?.name ?? 'Fahrer'} · ${res.data.teamName ?? teamName ?? 'Ohne aktives Team'} · ${res.data.seasons.length} Saisons`;
  $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, res.data, false);
}

export function initRiderStatsListeners(): void {
  $('rider-stats-body').addEventListener('click', (event) => {
    const tabButton = (event.target as Element).closest<HTMLButtonElement>('button[data-rider-stats-tab]');
    if (!tabButton) {
      return;
    }

    const nextTab = tabButton.dataset['riderStatsTab'] as RiderStatsTab;
    if (nextTab !== 'results' && nextTab !== 'program') {
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
