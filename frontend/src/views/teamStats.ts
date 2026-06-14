import { api } from '../api';
import {
  $,
  esc,
  state,
  renderFlag,
  renderMiniJersey,
  resolveTeamJerseyAssetPath,
  showModal,
  findRiderById,
  resolveRaceCategoryBadgeStyle,
  buildRaceCategoryBadgeCssVariables,
  renderRiderNameLink,
  formatDate,
  FLAG_CODE_BY_CODE3,
} from '../state';
import { renderStageProfileBadge } from './dashboard';
import type { TeamStatsPayload, TeamStatsRider, TeamStatsTopResult, TeamSuccessStats, RiderSpecialization } from '../../../shared/types';
import { RIDER_STATS_ICONS, getRankColor, renderRiderStatsRaceBadge, renderRiderStatsCategoryBadge, resolveCurrentSeasonRank, renderRiderStatsRankBadge, renderProfileWinBadge } from './riderStats';
import { renderStageEditorScoreBadge } from './stageEditor';

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

function getTopRidersBySpecialization(riders: TeamStatsRider[]) {
  const getGCScore = (r: TeamStatsRider) => r.skills.mountain * 0.7 + r.skills.timeTrial * 0.3;
  const getSprintScore = (r: TeamStatsRider) => r.skills.sprint * 0.7 + r.skills.acceleration * 0.3;

  const gc = [...riders].map(r => ({ rider: r, score: getGCScore(r) })).sort((a, b) => b.score - a.score).slice(0, 10);
  const sprinter = [...riders].map(r => ({ rider: r, score: getSprintScore(r) })).sort((a, b) => b.score - a.score).slice(0, 10);
  const climber = [...riders].map(r => ({ rider: r, score: r.skills.mountain })).sort((a, b) => b.score - a.score).slice(0, 10);
  const puncheur = [...riders].map(r => ({ rider: r, score: r.skills.hill })).sort((a, b) => b.score - a.score).slice(0, 10);
  const cobbler = [...riders].map(r => ({ rider: r, score: r.skills.cobble })).sort((a, b) => b.score - a.score).slice(0, 10);
  const attacker = [...riders].map(r => ({ rider: r, score: r.skills.attack })).sort((a, b) => b.score - a.score).slice(0, 10);

  return {
    'Gesamtklassement': gc,
    'Sprinter': sprinter,
    'Bergfahrer': climber,
    'Hügelspezialist': puncheur,
    'Pflasterspezialist': cobbler,
    'Angreifer': attacker
  };
}

function getTeamSpecializationAverage(teamId: number, specKey: string): number {
  const teamRiders = state.riders.filter(r => r.activeTeamId === teamId);
  if (teamRiders.length === 0) return 0;

  const getGCScore = (r: any) => r.skills.mountain * 0.7 + r.skills.timeTrial * 0.3;
  const getSprintScore = (r: any) => r.skills.sprint * 0.7 + r.skills.acceleration * 0.3;

  let scores: number[] = [];
  if (specKey === 'Gesamtklassement') {
    scores = teamRiders.map(r => getGCScore(r));
  } else if (specKey === 'Sprinter') {
    scores = teamRiders.map(r => getSprintScore(r));
  } else if (specKey === 'Bergfahrer') {
    scores = teamRiders.map(r => r.skills.mountain);
  } else if (specKey === 'Hügelspezialist') {
    scores = teamRiders.map(r => r.skills.hill);
  } else if (specKey === 'Pflasterspezialist') {
    scores = teamRiders.map(r => r.skills.cobble);
  } else if (specKey === 'Angreifer') {
    scores = teamRiders.map(r => r.skills.attack);
  }

  // Sort descending and take top 8
  scores.sort((a, b) => b - a);
  const top8 = scores.slice(0, 8);
  if (top8.length === 0) return 0;
  return top8.reduce((sum, s) => sum + s, 0) / top8.length;
}

function getTeamSpecializationRank(teamId: number, specKey: string): { rank: number; total: number; average: number } {
  const tier1Teams = state.teams.filter(t => t.division === 'WorldTour' || t.divisionName === 'WorldTour');
  const teamScores = tier1Teams.map(t => ({
    teamId: t.id,
    avgScore: getTeamSpecializationAverage(t.id, specKey)
  }));

  // Sort descending
  teamScores.sort((a, b) => b.avgScore - a.avgScore);

  const rank = teamScores.findIndex(x => x.teamId === teamId) + 1;
  const ourScore = teamScores.find(x => x.teamId === teamId)?.avgScore ?? 0;
  return {
    rank,
    total: teamScores.length,
    average: ourScore
  };
}

function getTeamOverallAverage(teamId: number): number {
  const teamRiders = state.riders.filter(r => r.activeTeamId === teamId);
  if (teamRiders.length === 0) return 0;

  const scores = teamRiders.map(r => r.overallRating ?? 0);
  scores.sort((a, b) => b - a);
  const top10 = scores.slice(0, 10);
  if (top10.length === 0) return 0;
  return top10.reduce((sum, s) => sum + s, 0) / top10.length;
}

function getTeamOverallRank(teamId: number): { rank: number; total: number; average: number } {
  const tier1Teams = state.teams.filter(t => t.division === 'WorldTour' || t.divisionName === 'WorldTour');
  const teamScores = tier1Teams.map(t => ({
    teamId: t.id,
    avgScore: getTeamOverallAverage(t.id)
  }));

  // Sort descending
  teamScores.sort((a, b) => b.avgScore - a.avgScore);

  const rank = teamScores.findIndex(x => x.teamId === teamId) + 1;
  const ourScore = teamScores.find(x => x.teamId === teamId)?.avgScore ?? 0;
  return {
    rank,
    total: teamScores.length,
    average: ourScore
  };
}

function getRoleStyle(roleId: number | null): { color: string; bg: string } {
  if (roleId === 1) return { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' }; // Kapitän: Gelb
  if (roleId === 2) return { color: '#cbd5e1', bg: 'rgba(203, 213, 225, 0.1)' }; // Co-Kapitän: Silber
  if (roleId === 6) return { color: '#4ade80', bg: 'rgba(74, 222, 128, 0.1)' }; // Sprinter: Grün
  if (roleId === 3) return { color: '#c084fc', bg: 'rgba(192, 132, 252, 0.1)' }; // Edelhelfer: Violett
  if (roleId === 4) return { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)' }; // Starker Helfer: Hellblau
  if (roleId === 5) return { color: '#fb923c', bg: 'rgba(251, 146, 60, 0.1)' }; // Wasserträger: Orange
  return { color: 'var(--text-200)', bg: 'rgba(255, 255, 255, 0.05)' };
}

export function renderTeamStatsHeader(payload: TeamStatsPayload): string {
  const resolvedCountryFlag = payload.countryCode ? renderFlag(payload.countryCode) : '';
  const specs = getTopRidersBySpecialization(payload.riders);

  // Sorting form-strong: sForm + rForm desc
  const formRiders = [...payload.riders]
    .map(r => ({ rider: r, formValue: r.formBonus + r.raceFormBonus }))
    .sort((a, b) => b.formValue - a.formValue)
    .slice(0, 10);

  // Sorting best UCI standings desc
  const uciRiders = [...payload.riders]
    .map(r => ({ rider: r, uciRank: resolveCurrentSeasonRank(r.id) }))
    .filter(x => x.uciRank !== null)
    .sort((a, b) => (a.uciRank as number) - (b.uciRank as number))
    .slice(0, 10);

  // Specialization cards grid
  const specsHtml = Object.entries(specs).map(([specName, list]) => {
    const stats = getTeamSpecializationRank(payload.teamId, specName);
    const avgText = stats.average.toFixed(1).replace('.', ',');
    const listHtml = list.map(({ rider, score }) => {
      const nameText = `${rider.firstName.charAt(0)}. ${rider.lastName}`;
      const link = renderRiderNameLink(nameText, {
        riderId: rider.id,
        teamId: payload.teamId,
        strong: true,
        linkClassName: 'results-rider-link',
        labelClassName: 'results-participant-label',
      });
      const flagAlpha2 = rider.nationality ? FLAG_CODE_BY_CODE3[rider.nationality] ?? rider.nationality.slice(0, 2).toLowerCase() : null;
      const flagHtml = flagAlpha2
        ? `<span class="fi fi-${flagAlpha2} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${esc(rider.nationality)}"></span>`
        : '';

      const fullRider = state.riders.find(r => r.id === rider.id);
      const roleStyle = getRoleStyle(fullRider?.roleId ?? null);

      return `
        <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%; display: flex; align-items: center; color: ${roleStyle.color};">
            ${flagHtml}
            ${link}
          </span>
          <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${score.toFixed(0)}</span>
        </li>
      `;
    }).join('');

    return `
      <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 0.5rem 0.75rem; border-radius: 6px;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: var(--accent-primary); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.25rem;">
          ${specName}
          <span style="font-size: 0.7rem; font-weight: normal; color: var(--text-400); display: block; margin-top: 0.1rem;">Platz ${stats.rank}/${stats.total} · Ø ${avgText}</span>
        </h4>
        <ul style="margin: 0; padding: 0; list-style: none;">${listHtml}</ul>
      </div>
    `;
  }).join('');

  // Formstärkste Column
  const formHtml = formRiders.map(({ rider, formValue }) => {
    const nameText = `${rider.firstName.charAt(0)}. ${rider.lastName}`;
    const link = renderRiderNameLink(nameText, {
      riderId: rider.id,
      teamId: payload.teamId,
      strong: true,
      linkClassName: 'results-rider-link',
      labelClassName: 'results-participant-label',
    });
    const flagAlpha2 = rider.nationality ? FLAG_CODE_BY_CODE3[rider.nationality] ?? rider.nationality.slice(0, 2).toLowerCase() : null;
    const flagHtml = flagAlpha2
      ? `<span class="fi fi-${flagAlpha2} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${esc(rider.nationality)}"></span>`
      : '';
    const valText = (formValue >= 0 ? '+' : '') + formValue.toFixed(1).replace('.', ',');
    const tooltip = `S-Form: ${rider.formBonus >= 0 ? '+' : ''}${rider.formBonus.toFixed(1)} / R-Form: ${rider.raceFormBonus >= 0 ? '+' : ''}${rider.raceFormBonus.toFixed(1)}`;

    const fullRider = state.riders.find(r => r.id === rider.id);
    const roleStyle = getRoleStyle(fullRider?.roleId ?? null);

    return `
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${roleStyle.color};">
          ${flagHtml}
          ${link}
        </span>
        <span style="font-weight: 700; color: #fbbf24;" title="${tooltip}">${valText}</span>
      </li>
    `;
  }).join('');

  // UCI Weltrangliste Column
  const uciHtml = uciRiders.map(({ rider, uciRank }) => {
    const nameText = `${rider.firstName.charAt(0)}. ${rider.lastName}`;
    const link = renderRiderNameLink(nameText, {
      riderId: rider.id,
      teamId: payload.teamId,
      strong: true,
      linkClassName: 'results-rider-link',
      labelClassName: 'results-participant-label',
    });
    const flagAlpha2 = rider.nationality ? FLAG_CODE_BY_CODE3[rider.nationality] ?? rider.nationality.slice(0, 2).toLowerCase() : null;
    const flagHtml = flagAlpha2
      ? `<span class="fi fi-${flagAlpha2} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${esc(rider.nationality)}"></span>`
      : '';
    let rankClass = 'rider-stats-rank-badge-gc';
    if (uciRank === 1) rankClass = 'rider-stats-rank-badge-place rider-stats-rank-badge-top-1';
    else if (uciRank === 2) rankClass = 'rider-stats-rank-badge-place rider-stats-rank-badge-top-2';
    else if (uciRank === 3) rankClass = 'rider-stats-rank-badge-place rider-stats-rank-badge-top-3';
    const badgeHtml = `<span class="rider-stats-rank-badge ${rankClass}" style="margin: 0; font-size: 0.75rem; padding: 0; min-width: 2rem; height: 1.35rem; display: inline-flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box; line-height: 1;" title="UCI Weltrangliste: Platz ${uciRank}">${uciRank}</span>`;

    const fullRider = state.riders.find(r => r.id === rider.id);
    const roleStyle = getRoleStyle(fullRider?.roleId ?? null);

    return `
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${roleStyle.color};">
          ${flagHtml}
          ${link}
        </span>
        ${badgeHtml}
      </li>
    `;
  }).join('');

  return `
    <div style="background: var(--bg-secondary); border: 1px solid var(--border-primary); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.75rem; margin-bottom: 1rem;">
        ${specsHtml}
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; border-top: 1px solid var(--border-primary); padding-top: 0.75rem;">
        <div style="background: rgba(251, 191, 36, 0.02); border: 1px solid rgba(251, 191, 36, 0.08); padding: 0.5rem 0.75rem; border-radius: 6px;">
          <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: #fbbf24;">Die 10 formstärksten Fahrer</h4>
          <ul style="margin: 0; padding: 0; list-style: none;">${formHtml || '<li class="text-muted" style="font-size:0.85rem;">Keine Daten vorhanden</li>'}</ul>
        </div>
        <div style="background: rgba(59, 130, 246, 0.02); border: 1px solid rgba(59, 130, 246, 0.08); padding: 0.5rem 0.75rem; border-radius: 6px;">
          <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: #3b82f6;">Die 10 besten Fahrer (UCI Weltrangliste)</h4>
          <ul style="margin: 0; padding: 0; list-style: none;">${uciHtml || '<li class="text-muted" style="font-size:0.85rem;">Keine Fahrer platziert</li>'}</ul>
        </div>
      </div>
    </div>
  `;
}

export function renderTeamStatsTabs(): string {
  return `
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Teamstats Tabs">
      <button type="button" class="team-detail-page-tab${state.teamStatsTab === 'topResults' ? ' team-detail-page-tab-active' : ''}" data-team-stats-tab="topResults" aria-selected="${state.teamStatsTab === 'topResults' ? 'true' : 'false'}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${state.teamStatsTab === 'career' ? ' team-detail-page-tab-active' : ''}" data-team-stats-tab="career" aria-selected="${state.teamStatsTab === 'career' ? 'true' : 'false'}">Erfolgsbilanz</button>
      <button type="button" class="team-detail-page-tab${state.teamStatsTab === 'contracts' ? ' team-detail-page-tab-active' : ''}" data-team-stats-tab="contracts" aria-selected="${state.teamStatsTab === 'contracts' ? 'true' : 'false'}">Auslaufende Verträge</button>
    </div>`;
}

export function renderTeamStatsTopResultsTab(payload: TeamStatsPayload): string {
  const categories = Array.from(new Set(payload.topResults.map(r => r.raceCategoryName).filter(Boolean))) as string[];
  categories.sort((a, b) => a.localeCompare(b, 'de'));

  const seasonsList = Array.from(new Set(payload.topResults.map(r => r.season))).sort((a, b) => b - a);

  let filteredRows = payload.topResults.filter(r => {
    const isFinalRow = r.rowType !== 'stage_result';
    if (isFinalRow) {
      if (r.rowType === 'gc_final') return state.teamStatsTopResultsFilters.gc;
      if (r.rowType === 'mountain_final') return state.teamStatsTopResultsFilters.mountain;
      if (r.rowType === 'points_final') return state.teamStatsTopResultsFilters.points;
      if (r.rowType === 'youth_final') return state.teamStatsTopResultsFilters.youth;
      return true;
    } else {
      if (r.profile === 'TTT' || (r as any).isStageRace || r.stageNumber != null) { // Stage race stage result
        return state.teamStatsTopResultsFilters.stage;
      } else {
        return state.teamStatsTopResultsFilters.oneDay;
      }
    }
  });

  if (state.teamStatsTopResultsFilterCategory) {
    const filterVal = state.teamStatsTopResultsFilterCategory;
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
  if (state.teamStatsTopResultsFilterSeason != null) {
    filteredRows = filteredRows.filter(r => r.season === state.teamStatsTopResultsFilterSeason);
  }

  filteredRows.sort((a, b) => {
    if (b.seasonPoints !== a.seasonPoints) {
      return b.seasonPoints - a.seasonPoints;
    }

    const aIsFinal = a.rowType !== 'stage_result';
    const bIsFinal = b.rowType !== 'stage_result';
    const rankA = a.resultRank ?? 9999;
    const rankB = b.resultRank ?? 9999;

    if (!state.teamStatsTopResultsFilterCategory) {
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

  const itemsPerPage = 20;
  const totalPages = Math.max(1, Math.min(10, Math.ceil(filteredRows.length / itemsPerPage)));
  if (state.teamStatsTopResultsPage > totalPages) {
    state.teamStatsTopResultsPage = totalPages;
  }
  const startIndex = (state.teamStatsTopResultsPage - 1) * itemsPerPage;
  const paginatedRows = filteredRows.slice(startIndex, startIndex + itemsPerPage);

  const categoryOptionsHtml = categories.map(cat => {
    const isStage = cat.toLowerCase().includes('stage race') || cat.toLowerCase().includes('grand tour') || cat.toLowerCase().includes('tour de france');
    if (isStage) {
      const valEtappen = `${cat}-etappen`;
      const valGc = `${cat}-gc`;
      return `
        <option value="${esc(valEtappen)}" ${state.teamStatsTopResultsFilterCategory === valEtappen ? 'selected' : ''}>${esc(cat)} - Etappen</option>
        <option value="${esc(valGc)}" ${state.teamStatsTopResultsFilterCategory === valGc ? 'selected' : ''}>${esc(cat)} - GC</option>
      `;
    } else {
      return `<option value="${esc(cat)}" ${state.teamStatsTopResultsFilterCategory === cat ? 'selected' : ''}>${esc(cat)}</option>`;
    }
  }).join('');

  const filtersHtml = `
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="team-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${categoryOptionsHtml}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Saison:</label>
        <select id="team-stats-filter-season" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">All Time</option>
          ${seasonsList.map(yr => `<option value="${yr}" ${state.teamStatsTopResultsFilterSeason === yr ? 'selected' : ''}>Saison ${yr}</option>`).join('')}
        </select>
      </div>
      
      <div class="top-results-checkboxes" style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; border-left: 1px solid rgba(255, 255, 255, 0.15); padding-left: 1rem;">
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="team-stats-filter-checkbox" data-filter-type="gc" ${state.teamStatsTopResultsFilters.gc ? 'checked' : ''} style="accent-color: #ffd700; width: 14px; height: 14px; cursor: pointer;">
          nur GC
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="team-stats-filter-checkbox" data-filter-type="mountain" ${state.teamStatsTopResultsFilters.mountain ? 'checked' : ''} style="accent-color: #ff4d4d; width: 14px; height: 14px; cursor: pointer;">
          nur Bergwertung
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="team-stats-filter-checkbox" data-filter-type="points" ${state.teamStatsTopResultsFilters.points ? 'checked' : ''} style="accent-color: #2ecc71; width: 14px; height: 14px; cursor: pointer;">
          nur Punktewertung
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="team-stats-filter-checkbox" data-filter-type="youth" ${state.teamStatsTopResultsFilters.youth ? 'checked' : ''} style="accent-color: #ffffff; width: 14px; height: 14px; cursor: pointer;">
          nur Nachwuchs
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="team-stats-filter-checkbox" data-filter-type="oneDay" ${state.teamStatsTopResultsFilters.oneDay ? 'checked' : ''} style="accent-color: #9b59b6; width: 14px; height: 14px; cursor: pointer;">
          One Day Races
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="team-stats-filter-checkbox" data-filter-type="stage" ${state.teamStatsTopResultsFilters.stage ? 'checked' : ''} style="accent-color: #3498db; width: 14px; height: 14px; cursor: pointer;">
          Etappenwertungen
        </label>
      </div>
    </div>
  `;

  const tableRowsHtml = paginatedRows.length === 0
    ? `<tr><td colspan="10" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>`
    : paginatedRows.map(row => {
        const isFinalRow = row.rowType !== 'stage_result';
        const raceStageLabel = isFinalRow
          ? `${row.raceName} · ${row.rowType === 'gc_final' ? 'Gesamtwertung' : row.rowType === 'points_final' ? 'Punktewertung' : row.rowType === 'mountain_final' ? 'Bergwertung' : 'Nachwuchs'}`
          : (row.stageNumber ? `${row.raceName} · Etappe ${row.stageNumber}` : row.raceName);

        let stagePlacementHtml = '–';
        let gcPlacementHtml = '–';

        if (row.finishStatus === 'otl') {
          stagePlacementHtml = renderRiderStatsRankBadge('OTL', 'place');
        } else if (row.finishStatus === 'dnf') {
          stagePlacementHtml = renderRiderStatsRankBadge('DNF', 'place');
        } else if (row.resultRank == null) {
          // Keep -
        } else if (isFinalRow) {
          const className = row.rowType === 'gc_final' ? 'is-gc' : row.rowType === 'points_final' ? 'is-points' : row.rowType === 'mountain_final' ? 'is-mountain' : 'is-youth';
          gcPlacementHtml = `<span class="rider-stats-final-type ${className}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${row.resultRank}</span>`;
        } else {
          const topRankClassName = row.resultRank <= 3 ? ` rider-stats-rank-badge-top-${row.resultRank}` : '';
          stagePlacementHtml = `<span class="rider-stats-rank-badge rider-stats-rank-badge-place${topRankClassName}">${esc(String(row.resultRank))}</span>`;
        }

        const profileBadgeHtml = row.profile ? renderStageProfileBadge(row.profile) : '–';
        const stageScoreBadgeHtml = !isFinalRow && row.stageScore != null && row.stageScore > 0 ? renderStageEditorScoreBadge(row.stageScore, 0, 350) : '–';
        const categoryBadgeHtml = renderRiderStatsRaceBadge(row.raceCategoryName, true, null); // uses visual formatting helper

        const flagAlpha2 = row.riderCountryCode ? FLAG_CODE_BY_CODE3[row.riderCountryCode] ?? row.riderCountryCode.slice(0, 2).toLowerCase() : null;
        const flagHtml = flagAlpha2
          ? `<span class="fi fi-${flagAlpha2} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${esc(row.riderCountryCode ?? '')}"></span>`
          : '–';

        const nameLink = renderRiderNameLink(row.riderName, {
          riderId: row.riderId,
          teamId: payload.teamId,
          strong: true,
          linkClassName: 'results-rider-link',
          labelClassName: 'results-participant-label',
        });

        return `
          <tr class="rider-stats-row${isFinalRow ? ' rider-stats-row-final' : ''}">
            <td>${stagePlacementHtml}</td>
            <td>${gcPlacementHtml}</td>
            <td>${flagHtml}</td>
            <td style="white-space: nowrap;">${nameLink}</td>
            <td><strong>${esc(raceStageLabel)}</strong></td>
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
      <div class="pagination-wrap" style="display: flex; justify-content: center; gap: 0.25rem; margin-top: 1rem; align-items: center;">
        <button type="button" class="btn btn-secondary btn-sm" data-team-top-results-page="${state.teamStatsTopResultsPage - 1}" ${state.teamStatsTopResultsPage === 1 ? 'disabled' : ''}>&laquo; Zurück</button>
        ${Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const isActive = state.teamStatsTopResultsPage === pageNum;
          return `<button type="button" class="btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}" data-team-top-results-page="${pageNum}">${pageNum}</button>`;
        }).join('')}
        <button type="button" class="btn btn-secondary btn-sm" data-team-top-results-page="${state.teamStatsTopResultsPage + 1}" ${state.teamStatsTopResultsPage === totalPages ? 'disabled' : ''}>Weiter &raquo;</button>
      </div>
    `
    : '';

  return `
    <section class="rider-stats-top-results" style="margin-top: 1.5rem;">
      ${filtersHtml}
      <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
        <table class="data-table rider-stats-table">
          <colgroup>
            <col style="width: 5%;">
            <col style="width: 8%;">
            <col style="width: 4%;">
            <col style="width: 15%;">
            <col style="width: 32%;">
            <col style="width: 7%;">
            <col style="width: 5%;">
            <col style="width: 12%;">
            <col style="width: 6%;">
            <col style="width: 6%;">
          </colgroup>
          <thead>
            <tr>
              <th>Platz</th>
              <th>GC / Wertung</th>
              <th>Nat</th>
              <th>Fahrer</th>
              <th>Rennen</th>
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

export function renderTeamStatsCareerTab(payload: TeamStatsPayload): string {
  const selectedSeasonKey = String(state.teamStatsSelectedSeason);
  const stats = payload.successStats[selectedSeasonKey] || {
    breakawayAttempts: 0, attacks: 0, counterAttacks: 0, crashes: 0, defects: 0,
    illnesses: 0, illnessDays: 0, injuries: 0, injuryDays: 0, dnsCount: 0, dnfCount: 0, otlCount: 0,
    totalGcWins: 0, totalStageWins: 0, successfulBreakaways: 0, raceDays: 0, categories: {}
  };

  const isAllTime = selectedSeasonKey === 'all';
  const displayVal = (val: number) => isAllTime ? val : `–`;
  const displayValDays = (count: number, days: number) => isAllTime ? `${count} / ${days} T` : `–`;
  const isSeasonalClassifiedTooltip = !isAllTime ? ' title="Dieser Wert wird systemweit nur all-time erfasst."' : '';

  // Helper function to render badge
  const renderTeamCareerBadge = (
    displayValue: string | number,
    type: 'gold' | 'silver' | 'bronze' | 'green' | 'red' | 'white' | 'purple',
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
      }
    }
    return `<span style="${style}" title="${esc(title)}: ${checkVal} Siege">${displayValue}</span>`;
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

  const seasonDropdownHtml = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h3 style="margin: 0; font-size: 1.25rem; font-weight: bold; color: #fff;">Karrierestatistiken (Team)</h3>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <label for="team-stats-success-season-select" style="font-size: 0.85rem; color: #aaa; font-weight: 500;">Saison filtern:</label>
        <select id="team-stats-success-season-select" class="form-control" style="background: var(--bg-tertiary); border: 1px solid var(--border-primary); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer;">
          <option value="all" ${isAllTime ? 'selected' : ''}>Ewig (All-Time)</option>
          ${Object.keys(payload.successStats).filter(k => k !== 'all').sort((a,b) => b.localeCompare(a)).map(yr => `
            <option value="${yr}" ${String(state.teamStatsSelectedSeason) === yr ? 'selected' : ''}>Saison ${yr}</option>
          `).join('')}
        </select>
      </div>
    </div>
  `;

  const totalWins = stats.totalGcWins + stats.totalStageWins;

  return `
    <section class="rider-stats-career" style="margin-top: 1.5rem;">
      ${seasonDropdownHtml}
      
      <!-- Career Summary cards -->
      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Siege</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #fbbf24;">${totalWins}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Renntage</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #a855f7;">${stats.raceDays}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Ausreißversuche</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #3498db;">${stats.breakawayAttempts}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Erf. Ausreißer</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #2ecc71;">${stats.successfulBreakaways}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);" ${isAllTime ? '' : isSeasonalClassifiedTooltip}>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Attacken</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #ffd700;">${displayVal(stats.attacks)}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);" ${isAllTime ? '' : isSeasonalClassifiedTooltip}>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Konterattacken</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #e67e22;">${displayVal(stats.counterAttacks)}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);" ${isAllTime ? '' : isSeasonalClassifiedTooltip}>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Stürze</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #e74c3c;">${displayVal(stats.crashes)}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);" ${isAllTime ? '' : isSeasonalClassifiedTooltip}>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Defekte</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #95a5a6;">${displayVal(stats.defects)}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">DNS</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #fc8181;">${stats.dnsCount}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">DNF</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #f56565;">${stats.dnfCount}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">OTL</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #e53e3e;">${stats.otlCount}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;" ${isAllTime ? '' : isSeasonalClassifiedTooltip}>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Krankheiten</div>
          <div style="font-size: 1.35rem; font-weight: bold; color: #ed64a6; line-height: 1.25;">${displayValDays(stats.illnesses, stats.illnessDays)}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;" ${isAllTime ? '' : isSeasonalClassifiedTooltip}>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Verletzungen</div>
          <div style="font-size: 1.35rem; font-weight: bold; color: #f6ad55; line-height: 1.25;">${displayValDays(stats.injuries, stats.injuryDays)}</div>
        </div>
      </div>

      <!-- Categories details -->
      <h3 style="margin-bottom: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 0.5rem; font-weight: 500; font-size: 1.15rem; color: #fff;">Ergebnisse nach Rennklasse</h3>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 1fr; gap: 1.25rem;">
        ${categoriesToShow.map(cat => {
          const catData = stats.categories[cat.key] || {
            gcWins: 0, gcSecond: 0, gcThird: 0, gcTopTen: 0,
            stageWins: 0, stageSecond: 0, stageThird: 0, stageTopTen: 0,
            oneDayWins: 0, oneDaySecond: 0, oneDayThird: 0, oneDayTopTen: 0,
            mountainWins: 0, pointsWins: 0, youthWins: 0, raceDays: 0,
            leaderJerseys: 0, sprintWins: 0, climbWinsHC: 0, climbWins1: 0, climbWins2: 0, climbWins3: 0, climbWins4: 0,
            winFlat: 0, winRolling: 0, winHilly: 0, winHillyDifficult: 0, winMediumMountain: 0, winMountain: 0, winHighMountain: 0, winCobble: 0, winCobbleHill: 0, winITT: 0, winTTT: 0,
          };

          return `
            <div style="position: relative; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; height: 365px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem; overflow: hidden; white-space: nowrap;">
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${esc(cat.name)}">${esc(cat.name)}</span>
                ${renderRiderStatsCategoryBadge(cat.key)}
              </div>
              
              ${cat.isStage ? `
                <!-- Stage Race layout: GC & Classifications -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">GC & Wertungen</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${renderTeamCareerBadge(catData.gcWins, 'gold', 'Gesamtwertung Siege')}
                    ${renderTeamCareerBadge(catData.gcSecond, 'silver', 'Gesamtwertung Platz 2')}
                    ${renderTeamCareerBadge(catData.gcThird, 'bronze', 'Gesamtwertung Platz 3')}
                    ${renderTeamCareerBadge(catData.gcTopTen || 0, 'purple', 'Gesamtwertung Ränge 4-10')}
                    <span style="border-left: 1px solid rgba(255,255,255,0.15); height: 1rem; margin: 0 0.1rem; display: inline-block;"></span>
                    ${renderTeamCareerBadge(catData.mountainWins, 'red', 'Bergwertung Siege')}
                    ${renderTeamCareerBadge(catData.pointsWins, 'green', 'Punktewertung Siege')}
                    ${renderTeamCareerBadge(catData.youthWins, 'white', 'Nachwuchswertung Siege')}
                  </div>
                </div>
                
                <!-- Etappenergebnisse -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Etappenergebnisse</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${renderTeamCareerBadge(catData.stageWins, 'gold', 'Etappensiege')}
                    ${renderTeamCareerBadge(catData.stageSecond, 'silver', 'Etappen Platz 2')}
                    ${renderTeamCareerBadge(catData.stageThird, 'bronze', 'Etappen Platz 3')}
                    ${renderTeamCareerBadge(catData.stageTopTen || 0, 'purple', 'Etappen Ränge 4-10')}
                  </div>
                </div>

                <!-- Führungstrikots -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Führungstrikot Tage</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${
                      (catData.leaderJerseys || 0) === 0
                        ? 'background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);'
                        : 'background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 4px rgba(250, 204, 21, 0.4);'
                    }" title="Tage im Führungstrikot (P1 GC)">
                      🎽 ${catData.leaderJerseys || 0}
                    </span>
                  </div>
                </div>
              ` : `
                <!-- One Day Race layout: Platzierungen -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Platzierungen</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${renderTeamCareerBadge(catData.oneDayWins, 'gold', 'Siege')}
                    ${renderTeamCareerBadge(catData.oneDaySecond, 'silver', 'Platz 2')}
                    ${renderTeamCareerBadge(catData.oneDayThird, 'bronze', 'Platz 3')}
                    ${renderTeamCareerBadge(catData.oneDayTopTen || 0, 'purple', 'Ränge 4-10')}
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
                  ${renderTeamCareerBadge(catData.sprintWins || 0, 'green', 'Sprint: Gewonnene Zwischensprints')}
                  ${renderTeamCareerBadge(catData.climbWinsHC || 0, 'red', 'HC: Gewonnene HC-Bergwertungen')}
                  ${renderTeamCareerBadge(catData.climbWins1 || 0, 'red', 'C1: Gewonnene Bergwertungen Kategorie 1')}
                  ${renderTeamCareerBadge(catData.climbWins2 || 0, 'red', 'C2: Gewonnene Bergwertungen Kategorie 2')}
                  ${renderTeamCareerBadge(catData.climbWins3 || 0, 'red', 'C3: Gewonnene Bergwertungen Kategorie 3')}
                  ${renderTeamCareerBadge(catData.climbWins4 || 0, 'red', 'C4: Gewonnene Bergwertungen Kategorie 4')}
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

export function renderTeamStatsContractsTab(payload: TeamStatsPayload): string {
  const currentSeason = state.gameState?.season ?? new Date().getFullYear();

  // Sort: expiring contracts first
  const sortedRiders = [...payload.riders].sort((a, b) => {
    const endA = a.contractEndSeason ?? 9999;
    const endB = b.contractEndSeason ?? 9999;
    if (endA !== endB) return endA - endB;
    return b.overallRating - a.overallRating;
  });

  const tableRowsHtml = sortedRiders.length === 0
    ? `<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">Keine Vertragsdaten verfügbar.</td></tr>`
    : sortedRiders.map(rider => {
        const flagAlpha2 = rider.nationality ? FLAG_CODE_BY_CODE3[rider.nationality] ?? rider.nationality.slice(0, 2).toLowerCase() : null;
        const flagHtml = flagAlpha2
          ? `<span class="fi fi-${flagAlpha2} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${esc(rider.nationality)}"></span>`
          : '–';

        const nameLink = renderRiderNameLink(`${rider.firstName} ${rider.lastName}`, {
          riderId: rider.id,
          teamId: payload.teamId,
          strong: true,
          linkClassName: 'results-rider-link',
          labelClassName: 'results-participant-label',
        });

        // Resolve potential overall rating (which is on state.riders since payload only has overallRating)
        const fullRider = state.riders.find(r => r.id === rider.id);
        const overallRatingHtml = `<span class="results-roster-overall-badge" style="color:${getSkillColorForRating(rider.overallRating)}" title="Stärke: ${rider.overallRating.toFixed(2)}">${rider.overallRating.toFixed(1)}</span>`;
        
        let potentialRatingHtml = '–';
        if (fullRider && fullRider.potential != null) {
          potentialRatingHtml = `<span class="results-roster-overall-badge" style="color:${getSkillColorForRating(fullRider.potential)}" title="Potential: ${fullRider.potential.toFixed(2)}">${fullRider.potential.toFixed(1)}</span>`;
        }

        const isExpiringThisSeason = rider.contractEndSeason === currentSeason;
        const endText = rider.contractEndSeason ? `Saison ${rider.contractEndSeason}` : 'Ohne Vertrag';
        const contractCellHtml = isExpiringThisSeason
          ? `<span class="badge badge-race-category" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: bold; animation: pulse 2s infinite;" title="Vertrag läuft in dieser Saison aus!">${esc(endText)}</span>`
          : `<span style="font-weight: 500;">${esc(endText)}</span>`;

        return `
          <tr class="rider-stats-row">
            <td>${flagHtml}</td>
            <td style="white-space: nowrap;">${nameLink}</td>
            <td>${rider.age}</td>
            <td>${overallRatingHtml}</td>
            <td>${potentialRatingHtml}</td>
            <td>${contractCellHtml}</td>
          </tr>
        `;
      }).join('');

  return `
    <section class="rider-stats-contracts" style="margin-top: 1.5rem;">
      <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
        <table class="data-table rider-stats-table">
          <colgroup>
            <col style="width: 8%;">
            <col style="width: 32%;">
            <col style="width: 10%;">
            <col style="width: 15%;">
            <col style="width: 15%;">
            <col style="width: 20%;">
          </colgroup>
          <thead>
            <tr>
              <th>Nat</th>
              <th>Fahrer</th>
              <th>Alter</th>
              <th>Gesamtstärke</th>
              <th>Pot. Gesamtstärke</th>
              <th>Vertragsende</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function getSkillColorForRating(value: number): string {
  if (value >= 85) return '#22c55e';
  if (value >= 78) return '#86efac';
  if (value >= 72) return '#fbbf24';
  if (value >= 66) return '#fb923c';
  if (value >= 60) return '#f87171';
  return '#94a3b8';
}

export function renderTeamStatsBody(payload: TeamStatsPayload): string {
  if (state.teamStatsTab === 'career') {
    return `
      ${renderTeamStatsHeader(payload)}
      ${renderTeamStatsTabs()}
      ${renderTeamStatsCareerTab(payload)}
    `;
  }

  if (state.teamStatsTab === 'contracts') {
    return `
      ${renderTeamStatsHeader(payload)}
      ${renderTeamStatsTabs()}
      ${renderTeamStatsContractsTab(payload)}
    `;
  }

  // Default: 'topResults'
  return `
    ${renderTeamStatsHeader(payload)}
    ${renderTeamStatsTabs()}
    ${renderTeamStatsTopResultsTab(payload)}
  `;
}

function renderLargeJersey(teamId: number | null | undefined, teamName: string | null | undefined): string {
  if (teamId == null) {
    return '<span class="results-team-jersey-placeholder" style="width: 54px; height: 54px; display: inline-block;" aria-hidden="true"></span>';
  }

  const resolvedTeamName = teamName ?? state.teams.find((team) => team.id === teamId)?.name ?? `Team ${teamId}`;
  return `
    <span class="results-team-jersey large-jersey" title="${esc(resolvedTeamName)}" aria-label="${esc(resolvedTeamName)}" style="width: 54px; height: 54px; display: inline-block;">
      <img
        class="results-team-jersey-img"
        src="${esc(resolveTeamJerseyAssetPath(teamId))}"
        alt=""
        width="54"
        height="54"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
        style="width: 54px; height: 54px;"
      >
    </span>`;
}

export async function openTeamStats(teamId: number): Promise<void> {
  state.teamStatsSelectedTeamId = teamId;
  state.teamStatsTab = 'topResults';
  state.teamStatsTopResultsFilterCategory = null;
  state.teamStatsTopResultsFilterSeason = null;
  state.teamStatsSelectedSeason = 'all';
  state.teamStatsTopResultsPage = 1;

  const team = state.teams.find(t => t.id === teamId);

  $('team-stats-title').innerHTML = team ? `Team <strong>${esc(team.name)}</strong>` : 'Teamstatistik';
  $('team-stats-jersey').innerHTML = renderLargeJersey(teamId, team?.name ?? '');
  const overallRank = getTeamOverallRank(teamId);
  const avgText = overallRank.average.toFixed(2).replace('.', ',');
  $('team-stats-meta').innerHTML = team
    ? `${esc(team.abbreviation)} · ${esc(team.divisionName || team.division || '–')} · <strong>Overall-Stärke (Top 10):</strong> Platz ${overallRank.rank}/${overallRank.total} (Ø ${avgText})`
    : 'Daten werden geladen';
  $('team-stats-body').innerHTML = `
    <section class="rider-stats-placeholder">
      <h3>Statistiken werden geladen</h3>
      <p>Die Teamergebnisse und Fahrerdaten werden zusammengestellt.</p>
    </section>
  `;
  showModal('teamStats');

  const res = await api.getTeamStats(teamId);
  if (state.teamStatsSelectedTeamId !== teamId) {
    return;
  }

  if (!res.success || !res.data) {
    $('team-stats-body').innerHTML = `
      <section class="rider-stats-placeholder">
        <h3>Statistiken konnten nicht geladen werden</h3>
        <p>${esc(res.error ?? 'Unbekannter Fehler')}</p>
      </section>
    `;
    return;
  }

  state.teamStatsPayload = res.data;
  $('team-stats-body').innerHTML = renderTeamStatsBody(res.data);
}

export function initTeamStatsListeners(): void {
  // Tabs switching, pagination buttons and dropdowns
  $('team-stats-body').addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    // Tab buttons
    const tabButton = target.closest<HTMLButtonElement>('button[data-team-stats-tab]');
    if (tabButton) {
      const nextTab = tabButton.dataset['teamStatsTab'] as any;
      if (nextTab === 'topResults' || nextTab === 'career' || nextTab === 'contracts') {
        state.teamStatsTab = nextTab;
        if (state.teamStatsPayload) {
          $('team-stats-body').innerHTML = renderTeamStatsBody(state.teamStatsPayload);
        }
      }
      return;
    }

    // Pagination buttons
    const pageButton = target.closest<HTMLButtonElement>('button[data-team-top-results-page]');
    if (pageButton) {
      const newPage = Number(pageButton.dataset['teamTopResultsPage']);
      if (!isNaN(newPage) && newPage >= 1) {
        state.teamStatsTopResultsPage = newPage;
        if (state.teamStatsPayload) {
          $('team-stats-body').innerHTML = renderTeamStatsBody(state.teamStatsPayload);
        }
      }
      return;
    }
  });

  $('team-stats-body').addEventListener('change', (event) => {
    const target = event.target as HTMLElement;

    if (target.id === 'team-stats-filter-category') {
      const select = target as HTMLSelectElement;
      state.teamStatsTopResultsFilterCategory = select.value === 'all' ? null : select.value;
      state.teamStatsTopResultsPage = 1;
      if (state.teamStatsPayload) {
        $('team-stats-body').innerHTML = renderTeamStatsBody(state.teamStatsPayload);
      }
    } else if (target.id === 'team-stats-filter-season') {
      const select = target as HTMLSelectElement;
      state.teamStatsTopResultsFilterSeason = select.value === 'all' ? null : Number(select.value);
      state.teamStatsTopResultsPage = 1;
      if (state.teamStatsPayload) {
        $('team-stats-body').innerHTML = renderTeamStatsBody(state.teamStatsPayload);
      }
    } else if (target.classList.contains('team-stats-filter-checkbox')) {
      const checkbox = target as HTMLInputElement;
      const type = checkbox.dataset['filterType'] as 'gc' | 'mountain' | 'points' | 'youth' | 'oneDay' | 'stage';
      state.teamStatsTopResultsFilters[type] = checkbox.checked;
      state.teamStatsTopResultsPage = 1;
      if (state.teamStatsPayload) {
        $('team-stats-body').innerHTML = renderTeamStatsBody(state.teamStatsPayload);
      }
    } else if (target.id === 'team-stats-success-season-select') {
      const select = target as HTMLSelectElement;
      state.teamStatsSelectedSeason = select.value === 'all' ? 'all' : Number(select.value);
      if (state.teamStatsPayload) {
        $('team-stats-body').innerHTML = renderTeamStatsBody(state.teamStatsPayload);
      }
    }
  });
}
