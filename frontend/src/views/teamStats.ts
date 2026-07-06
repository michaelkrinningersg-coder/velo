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
import { RIDER_STATS_ICONS, getRankColor, renderRiderStatsRaceBadge, renderRiderStatsCategoryBadge, resolveCurrentSeasonRank, renderRiderStatsRankBadge, renderProfileWinBadge, renderWeatherWinBadge, renderStatusDotsColumn, resolveRiderStatsFinalTypeClassName, getRiderStatsRowTypeLabel, renderFilterButton } from './riderStats';
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

  // Stärkste Column
  const overallRiders = [...payload.riders]
    .sort((a, b) => (b.overallRating ?? 0) - (a.overallRating ?? 0))
    .slice(0, 10);

  const overallHtml = overallRiders.map((rider) => {
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
    const valText = rider.overallRating.toFixed(0);

    const fullRider = state.riders.find(r => r.id === rider.id);
    const roleStyle = getRoleStyle(fullRider?.roleId ?? null);

    return `
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${roleStyle.color};">
          ${flagHtml}
          ${link}
        </span>
        <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${valText}</span>
      </li>
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
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; border-top: 1px solid var(--border-primary); padding-top: 0.75rem;">
        <div style="background: rgba(99, 102, 241, 0.02); border: 1px solid rgba(99, 102, 241, 0.08); padding: 0.5rem 0.75rem; border-radius: 6px;">
          <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: var(--accent-h);">Die 10 stärksten Fahrer</h4>
          <ul style="margin: 0; padding: 0; list-style: none;">${overallHtml || '<li class="text-muted" style="font-size:0.85rem;">Keine Daten vorhanden</li>'}</ul>
        </div>
        <div style="background: rgba(251, 191, 36, 0.02); border: 1px solid rgba(251, 191, 36, 0.08); padding: 0.5rem 0.75rem; border-radius: 6px;">
          <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: #fbbf24;">Die 10 formstärksten Fahrer</h4>
          <ul style="margin: 0; padding: 0; list-style: none;">${formHtml || '<li class="text-muted" style="font-size:0.85rem;">Keine Daten vorhanden</li>'}</ul>
        </div>
        <div style="background: rgba(34, 211, 238, 0.03); border: 1px solid rgba(34, 211, 238, 0.14); padding: 0.5rem 0.75rem; border-radius: 6px;">
          <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: #22d3ee;">Die 10 besten Fahrer (UCI Weltrangliste)</h4>
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
      <button type="button" class="team-detail-page-tab${state.teamStatsTab === 'contracts' ? ' team-detail-page-tab-active' : ''}" data-team-stats-tab="contracts" aria-selected="${state.teamStatsTab === 'contracts' ? 'true' : 'false'}">Kader & Verträge</button>
      <button type="button" class="team-detail-page-tab${state.teamStatsTab === 'transfers' ? ' team-detail-page-tab-active' : ''}" data-team-stats-tab="transfers" aria-selected="${state.teamStatsTab === 'transfers' ? 'true' : 'false'}">Transfers</button>
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
      if (r.rowType === 'breakaway_final') return state.teamStatsTopResultsFilters.breakaway;
      return true;
    } else {
      if (r.isStageRace) { // Stage race stage result
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
  if (state.teamStatsTopResultsFilterRank != null && !isNaN(state.teamStatsTopResultsFilterRank)) {
    filteredRows = filteredRows.filter(r => r.resultRank != null && r.resultRank <= state.teamStatsTopResultsFilterRank!);
  }
  if (state.teamStatsTopResultsFilterProfile) {
    filteredRows = filteredRows.filter(r => r.profile === state.teamStatsTopResultsFilterProfile);
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

  const MONOF = "font-family:'JetBrains Mono',monospace;";
  const TR_COLS = 'grid-template-columns:56px 46px minmax(130px,1.1fr) minmax(150px,1.5fr) 120px 60px 52px 46px;';

  const itemsPerPage = 25;
  const activeRows = filteredRows.slice(0, 1000);
  const totalPages = Math.max(1, Math.ceil(activeRows.length / itemsPerPage));
  if (state.teamStatsTopResultsPage > totalPages) {
    state.teamStatsTopResultsPage = totalPages;
  }
  const startIndex = (state.teamStatsTopResultsPage - 1) * itemsPerPage;
  const paginatedRows = activeRows.slice(startIndex, startIndex + itemsPerPage);

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

  const selStyle = "background:#0a1122; border:1px solid #1c2b47; border-radius:8px; color:#e2e8f0; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; padding:6px 9px; cursor:pointer;";
  const labStyle = "font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.08em; text-transform:uppercase; color:#6a7a95; margin-right:8px;";
  const filtersHtml = `
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.25rem; margin-bottom: 1.25rem; align-items: center; flex-wrap: wrap; background:#0c1526; padding: 12px 16px; border-radius: 14px; border: 1px solid #1e2c49;">
      <div style="display:flex; align-items:center;">
        <label style="${labStyle}">Rennklasse</label>
        <select id="team-stats-filter-category" class="form-control" style="width:auto; ${selStyle}">
          <option value="all">Alle Rennklassen</option>
          ${categoryOptionsHtml}
        </select>
      </div>
      <div style="display:flex; align-items:center;">
        <label style="${labStyle}">Saison</label>
        <select id="team-stats-filter-season" class="form-control" style="width:auto; ${selStyle}">
          <option value="all">All Time</option>
          ${seasonsList.map(yr => `<option value="${yr}" ${state.teamStatsTopResultsFilterSeason === yr ? 'selected' : ''}>Saison ${yr}</option>`).join('')}
        </select>
      </div>
      <div style="display:flex; align-items:center;">
        <label style="${labStyle}">Profil</label>
        <select id="team-stats-filter-profile" class="form-control" style="width:auto; ${selStyle}">
          <option value="all">Alle Profile</option>
          <option value="Flat" ${state.teamStatsTopResultsFilterProfile === 'Flat' ? 'selected' : ''}>Flat</option>
          <option value="Rolling" ${state.teamStatsTopResultsFilterProfile === 'Rolling' ? 'selected' : ''}>Rolling</option>
          <option value="Hilly" ${state.teamStatsTopResultsFilterProfile === 'Hilly' ? 'selected' : ''}>Hilly</option>
          <option value="Hilly Difficult" ${state.teamStatsTopResultsFilterProfile === 'Hilly Difficult' ? 'selected' : ''}>Hilly Difficult</option>
          <option value="Medium Mountain" ${state.teamStatsTopResultsFilterProfile === 'Medium Mountain' ? 'selected' : ''}>Medium Mountain</option>
          <option value="Mountain" ${state.teamStatsTopResultsFilterProfile === 'Mountain' ? 'selected' : ''}>Mountain</option>
          <option value="High Mountain" ${state.teamStatsTopResultsFilterProfile === 'High Mountain' ? 'selected' : ''}>High Mountain</option>
          <option value="Cobble" ${state.teamStatsTopResultsFilterProfile === 'Cobble' ? 'selected' : ''}>Cobble</option>
          <option value="Cobble Hill" ${state.teamStatsTopResultsFilterProfile === 'Cobble Hill' ? 'selected' : ''}>Cobble Hill</option>
          <option value="ITT" ${state.teamStatsTopResultsFilterProfile === 'ITT' ? 'selected' : ''}>ITT</option>
          <option value="TTT" ${state.teamStatsTopResultsFilterProfile === 'TTT' ? 'selected' : ''}>TTT</option>
        </select>
      </div>
      
      <div style="display: grid; grid-template-rows: auto auto; grid-template-columns: repeat(6, 130px); gap: 0.5rem; align-items: center; justify-items: center; text-align: center; margin-left: auto; border-left: 1px solid rgba(255, 255, 255, 0.1); padding-left: 1rem;">
        <!-- Column 1: Siege / Top 3 -->
        <div style="grid-row: 1; grid-column: 1;">
          ${renderFilterButton('Siege', state.teamStatsTopResultsFilterRank === 1, 'linear-gradient(135deg, #fbbf24, #d4af37)', '#000', 'rgba(251, 191, 36, 0.4)', 'data-team-top-results-rank', '1')}
        </div>
        <div style="grid-row: 2; grid-column: 1;">
          ${renderFilterButton('Top 3', state.teamStatsTopResultsFilterRank === 3, 'linear-gradient(135deg, #e2e8f0, #94a3b8)', '#000', 'rgba(148, 163, 184, 0.4)', 'data-team-top-results-rank', '3')}
        </div>

        <!-- Column 2: Top 5 / Top 10 -->
        <div style="grid-row: 1; grid-column: 2;">
          ${renderFilterButton('Top 5', state.teamStatsTopResultsFilterRank === 5, 'linear-gradient(135deg, #d97706, #b45309)', '#fff', 'rgba(217, 119, 6, 0.4)', 'data-team-top-results-rank', '5')}
        </div>
        <div style="grid-row: 2; grid-column: 2;">
          ${renderFilterButton('Top 10', state.teamStatsTopResultsFilterRank === 10, 'linear-gradient(135deg, #a16207, #78350f)', '#fff', 'rgba(161, 98, 7, 0.4)', 'data-team-top-results-rank', '10')}
        </div>

        <!-- Column 3: GC / [Empty] -->
        <div style="grid-row: 1; grid-column: 3;">
          ${renderFilterButton('GC', state.teamStatsTopResultsFilters.gc, 'linear-gradient(135deg, #facc15, #ca8a04)', '#000', 'rgba(234, 179, 8, 0.4)', 'data-team-top-results-filter', 'gc')}
        </div>
        <div style="grid-row: 2; grid-column: 3;">
          <!-- Empty for GC single layout -->
        </div>

        <!-- Column 4: Punkte / Berg -->
        <div style="grid-row: 1; grid-column: 4;">
          ${renderFilterButton('Punkte', state.teamStatsTopResultsFilters.points, 'linear-gradient(135deg, #4ade80, #16a34a)', '#fff', 'rgba(74, 222, 128, 0.4)', 'data-team-top-results-filter', 'points')}
        </div>
        <div style="grid-row: 2; grid-column: 4;">
          ${renderFilterButton('Berg', state.teamStatsTopResultsFilters.mountain, 'linear-gradient(135deg, #f87171, #dc2626)', '#fff', 'rgba(239, 68, 68, 0.4)', 'data-team-top-results-filter', 'mountain')}
        </div>

        <!-- Column 5: Nachwuchs / Ausreißer -->
        <div style="grid-row: 1; grid-column: 5;">
          ${renderFilterButton('Nachwuchs', state.teamStatsTopResultsFilters.youth, 'linear-gradient(135deg, #ffffff, #e2e8f0)', '#0f172a', 'rgba(255, 255, 255, 0.4)', 'data-team-top-results-filter', 'youth')}
        </div>
        <div style="grid-row: 2; grid-column: 5;">
          ${renderFilterButton('Ausreißer', state.teamStatsTopResultsFilters.breakaway, 'linear-gradient(135deg, #c084fc, #7c3aed)', '#fff', 'rgba(168, 85, 247, 0.4)', 'data-team-top-results-filter', 'breakaway')}
        </div>

        <!-- Column 6: Etappen / One Day -->
        <div style="grid-row: 1; grid-column: 6;">
          ${renderFilterButton('Etappen', state.teamStatsTopResultsFilters.stage, 'linear-gradient(135deg, #60a5fa, #2563eb)', '#fff', 'rgba(59, 130, 246, 0.4)', 'data-team-top-results-filter', 'stage')}
        </div>
        <div style="grid-row: 2; grid-column: 6;">
          ${renderFilterButton('One Day', state.teamStatsTopResultsFilters.oneDay, 'linear-gradient(135deg, #b91c1c, #7f1d1d)', '#fff', 'rgba(185, 28, 28, 0.4)', 'data-team-top-results-filter', 'oneDay')}
        </div>
      </div>
    </div>
  `;

  const rowsHtml = paginatedRows.length === 0
    ? `<div style="padding:22px 16px; text-align:center; color:#6a7a95; ${MONOF} font-size:11px;">Keine Ergebnisse für diese Filterkombination.</div>`
    : paginatedRows.map(row => {
        const isFinalRow = row.rowType !== 'stage_result';
        const raceStageLabel = isFinalRow
          ? `${row.raceName} · ${getRiderStatsRowTypeLabel(row.rowType)}`
          : (row.stageNumber && row.isStageRace ? `${row.raceName} · Etappe ${row.stageNumber}` : row.raceName);

        let placeHtml = '<span style="justify-self:center; color:#5f6f8a;">–</span>';
        if (row.finishStatus === 'otl') {
          placeHtml = `<span style="justify-self:center;">${renderRiderStatsRankBadge('OTL', 'place')}</span>`;
        } else if (row.finishStatus === 'dnf') {
          placeHtml = `<span style="justify-self:center;">${renderRiderStatsRankBadge('DNF', 'place')}</span>`;
        } else if (row.resultRank == null) {
          // Keep –
        } else if (isFinalRow) {
          const className = resolveRiderStatsFinalTypeClassName(row.rowType);
          placeHtml = `<span class="rider-stats-final-type ${className}" style="justify-self:center; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${row.resultRank}</span>`;
        } else {
          const topRankClassName = row.resultRank <= 3 ? ` rider-stats-rank-badge-top-${row.resultRank}` : '';
          placeHtml = `<span class="rider-stats-rank-badge rider-stats-rank-badge-place${topRankClassName}" style="justify-self:center;">${esc(String(row.resultRank))}</span>`;
        }

        const profileCell = row.profile
          ? `<span style="justify-self:center;">${renderStageProfileBadge(row.profile)}</span>`
          : '<span style="justify-self:center; color:#5f6f8a;">–</span>';
        const scoreCell = !isFinalRow && row.stageScore != null && row.stageScore > 0
          ? `<span style="justify-self:center;">${renderStageEditorScoreBadge(row.stageScore, 0, 350)}</span>`
          : '<span style="justify-self:center; color:#5f6f8a;">–</span>';
        const categoryChip = renderRiderStatsRaceBadge(row.raceCategoryName ? row.raceCategoryName.replace(/^world\s*tour\s*-\s*/i, '') : row.raceCategoryName, true, null);

        const flagAlpha2 = row.riderCountryCode ? FLAG_CODE_BY_CODE3[row.riderCountryCode] ?? row.riderCountryCode.slice(0, 2).toLowerCase() : null;
        const flagHtml = flagAlpha2
          ? `<span class="fi fi-${flagAlpha2} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right:6px; flex:0 0 auto;" title="${esc(row.riderCountryCode ?? '')}"></span>`
          : '';
        const nameLink = renderRiderNameLink(row.riderName, {
          riderId: row.riderId,
          teamId: payload.teamId,
          strong: true,
          linkClassName: 'results-rider-link',
          labelClassName: 'results-participant-label',
        });

        return `
          <div style="display:grid; ${TR_COLS} gap:9px; align-items:center; padding:9px 14px; border-top:1px solid #14203a;${isFinalRow ? 'background:rgba(34,211,238,.06);' : ''}">
            <span style="${MONOF} font-size:11px; color:#8494ad;">${row.season}</span>
            ${placeHtml}
            <span style="display:flex; align-items:center; min-width:0; overflow:hidden;">${flagHtml}<span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${nameLink}</span></span>
            <span style="font-size:12.5px; font-weight:600; color:#e2e8f0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0;">${esc(raceStageLabel)}</span>
            <span style="min-width:0; overflow:hidden;">${categoryChip}</span>
            ${profileCell}
            ${scoreCell}
            <span style="${MONOF} font-size:12px; font-weight:800; color:${(row.seasonPoints ?? 0) > 0 ? '#22d3ee' : '#5f6f8a'}; justify-self:end;">${row.seasonPoints ?? 0}</span>
          </div>`;
      }).join('');

  const pageInfo = `${activeRows.length} Ergebnis${activeRows.length === 1 ? '' : 'se'}${totalPages > 1 ? ` · Seite ${state.teamStatsTopResultsPage}/${totalPages}` : ''}`;
  const pagerHtml = `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; border-top:1px solid #16233c; ${MONOF}">
      <span style="font-size:11px; color:#6a7a95;">${pageInfo}</span>
      ${totalPages > 1 ? `
        <div style="display:flex; gap:6px;">
          <button type="button" data-team-top-results-page="${state.teamStatsTopResultsPage - 1}" ${state.teamStatsTopResultsPage === 1 ? 'disabled' : ''} style="border:1px solid #2b3a55; background:transparent; color:${state.teamStatsTopResultsPage === 1 ? '#4a5670' : '#9fb0c9'}; cursor:${state.teamStatsTopResultsPage === 1 ? 'default' : 'pointer'}; font-size:12px; padding:5px 12px; border-radius:6px;">‹ Zurück</button>
          <button type="button" data-team-top-results-page="${state.teamStatsTopResultsPage + 1}" ${state.teamStatsTopResultsPage === totalPages ? 'disabled' : ''} style="border:1px solid #2b3a55; background:transparent; color:${state.teamStatsTopResultsPage === totalPages ? '#4a5670' : '#9fb0c9'}; cursor:${state.teamStatsTopResultsPage === totalPages ? 'default' : 'pointer'}; font-size:12px; padding:5px 12px; border-radius:6px;">Weiter ›</button>
        </div>` : ''}
    </div>
  `;

  return `
    <section class="rider-stats-top-results" style="margin-top: 1.5rem;">
      ${filtersHtml}
      <div style="border-radius:14px; overflow:hidden; border:1px solid #1e2c49; background:#0c1526;">
        <div style="display:grid; ${TR_COLS} gap:9px; padding:8px 14px; ${MONOF} font-size:9px; letter-spacing:.05em; color:#5a6a85; border-bottom:1px solid #16233c;">
          <span>SAISON</span><span style="justify-self:center;">PLATZ</span><span>FAHRER</span><span>RENNEN / ETAPPE</span><span>KLASSE</span><span style="justify-self:center;">PROFIL</span><span style="justify-self:center;">SCORE</span><span style="justify-self:end;">PKT</span>
        </div>
        ${rowsHtml}
        ${pagerHtml}
      </div>
    </section>
  `;
}

export function renderTeamStatsCareerTab(payload: TeamStatsPayload): string {
  const selectedSeasonKey = String(state.teamStatsSelectedSeason);
  const stats = payload.successStats[selectedSeasonKey] || {
    breakawayAttempts: 0, attacks: 0, counterAttacks: 0, crashes: 0, defects: 0,
    illnesses: 0, illnessDays: 0, injuries: 0, injuryDays: 0, dnsCount: 0, dnfCount: 0, otlCount: 0,
    totalGcWins: 0, totalStageWins: 0, successfulBreakaways: 0, raceDays: 0, superteamCount: 0, categories: {}
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

  const MONOF = "font-family:'JetBrains Mono',monospace;";
  // Broadcast highlight-Karte (grosse Zahl + Label) — wie riderStatsView Karriere
  const highlight = (value: string | number, label: string, color: string): string => `
    <div style="border-radius:12px;border:1px solid #1e2c49;background:#0c1526;padding:15px 16px;text-align:center;">
      <div style="${MONOF} font-size:26px;font-weight:800;color:${color};letter-spacing:-.02em;">${value}</div>
      <div style="${MONOF} font-size:9px;letter-spacing:.06em;color:#8494ad;margin-top:5px;text-transform:uppercase;">${label}</div>
    </div>`;
  // Broadcast-Panel (Titel + Zeilen) — wie riderStatsView Karriere
  const panel = (title: string, items: Array<{ label: string; value: string; color: string; sub?: string }>): string => `
    <div style="border-radius:12px;border:1px solid #1e2c49;background:#0c1526;padding:14px 16px;">
      <div style="${MONOF} font-size:10px;letter-spacing:.12em;color:#6a7a95;margin-bottom:6px;text-transform:uppercase;">${title}</div>
      ${items.map((it) => `
        <div style="display:flex;align-items:center;gap:9px;padding:7px 0;border-top:1px solid #131f34;">
          <span style="width:8px;height:8px;border-radius:2px;background:${it.color};flex:0 0 auto;"></span>
          <span style="font-size:12.5px;color:#9fb0c9;flex:1;">${it.label}</span>
          ${it.sub ? `<span style="${MONOF} font-size:10px;color:#6a7a95;margin-right:8px;">${it.sub}</span>` : ''}
          <span style="${MONOF} font-size:13px;font-weight:800;color:${it.color};">${it.value}</span>
        </div>`).join('')}
    </div>`;

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
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
      <div style="font-size:14px;font-weight:800;color:#e2e8f0;">Erfolgsbilanz (Team)</div>
      <div style="display: flex; align-items: center;">
        <label for="team-stats-success-season-select" style="${MONOF} font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#6a7a95;margin-right:8px;">Saison</label>
        <select id="team-stats-success-season-select" class="form-control" style="width:auto; background:#0a1122; border:1px solid #1c2b47; border-radius:8px; color:#e2e8f0; ${MONOF} font-size:11px; font-weight:700; padding:6px 9px; cursor:pointer;">
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
      
      <!-- Highlights -->
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;">
        ${highlight(String(totalWins), 'Siege', '#fbbf24')}
        ${highlight(String(stats.raceDays), 'Renntage', '#a855f7')}
        ${highlight(Math.round(stats.breakawayKms ?? 0).toLocaleString('de-DE'), 'Ausreißer-km', '#22d3ee')}
        ${highlight(String(stats.successfulBreakaways ?? 0), 'Erf. Ausreißer', '#4ade80')}
        ${highlight(String(stats.superteamCount ?? 0), 'Superteam-Starts', '#6366f1')}
      </div>

      <!-- Gruppierte Panels -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;margin-top:16px;align-items:start;">
        ${panel('Aggressivität', [
          { label: 'Ausreißversuche', value: String(stats.breakawayAttempts), color: '#3498db' },
          { label: 'Erfolgreiche Ausreißer', value: String(stats.successfulBreakaways ?? 0), color: '#2ecc71' },
          { label: 'Attacken', value: String(displayVal(stats.attacks)), color: '#ffd700' },
          { label: 'Konterattacken', value: String(displayVal(stats.counterAttacks)), color: '#e67e22' },
        ])}
        ${panel('Ausfälle', [
          { label: 'DNS', value: String(stats.dnsCount ?? 0), color: '#fc8181' },
          { label: 'DNF', value: String(stats.dnfCount ?? 0), color: '#f56565' },
          { label: 'OTL', value: String(stats.otlCount ?? 0), color: '#e53e3e' },
          { label: 'Stürze', value: String(displayVal(stats.crashes)), color: '#e74c3c' },
          { label: 'Defekte', value: String(displayVal(stats.defects)), color: '#95a5a6' },
        ])}
        ${panel('Gesundheit', [
          { label: 'Krankheiten', value: isAllTime ? String(stats.illnesses) : '–', sub: isAllTime ? `${stats.illnessDays} Tage` : undefined, color: '#ed64a6' },
          { label: 'Verletzungen', value: isAllTime ? String(stats.injuries) : '–', sub: isAllTime ? `${stats.injuryDays} Tage` : undefined, color: '#f6ad55' },
        ])}
        ${panel('Heim', [
          { label: 'Heimvorteil', value: String(stats.homeAdvantageDays ?? 0), sub: 'Tage', color: '#38bdf8' },
          { label: 'Heimbonus', value: String(stats.superHomeAdvantageDays ?? 0), sub: 'Tage', color: '#facc15' },
          { label: 'Heimmalus', value: String(stats.homePressureDays ?? 0), sub: 'Tage', color: '#fb7185' },
        ])}
      </div>

      <!-- Categories details -->
      <h3 style="font-size:13px;font-weight:800;color:#e2e8f0;margin:22px 0 12px;padding-bottom:8px;border-bottom:1px solid #1c2b47;">Ergebnisse nach Rennklasse <span style="${MONOF} font-size:10px;font-weight:600;color:#6a7a95;">· Siege &amp; Platzierungen</span></h3>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 1fr; gap: 12px;">
        ${categoriesToShow.map(cat => {
          const catData = stats.categories[cat.key] || {
            gcWins: 0, gcSecond: 0, gcThird: 0, gcTopTen: 0,
            stageWins: 0, stageSecond: 0, stageThird: 0, stageTopTen: 0,
            oneDayWins: 0, oneDaySecond: 0, oneDayThird: 0, oneDayTopTen: 0,
            mountainWins: 0, pointsWins: 0, youthWins: 0, breakawayWins: 0, raceDays: 0,
            leaderJerseys: 0, pointsJerseys: 0, mountainJerseys: 0, youthJerseys: 0, breakawayJerseys: 0, sprintWins: 0, climbWinsHC: 0, climbWins1: 0, climbWins2: 0, climbWins3: 0, climbWins4: 0,
            winFlat: 0, winRolling: 0, winHilly: 0, winHillyDifficult: 0, winMediumMountain: 0, winMountain: 0, winHighMountain: 0, winCobble: 0, winCobbleHill: 0, winITT: 0, winTTT: 0,
            winWeather1: 0, winWeather2: 0, winWeather3: 0, winWeather4: 0, winWeather5: 0, winWeather6: 0, winWeather7: 0,
          };

          return `
            <div style="position: relative; background:#0c1526; border:1px solid #1e2c49; border-radius:12px; padding: 14px 16px; height: 415px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #16233c; padding-bottom: 0.4rem; overflow: hidden; white-space: nowrap;">
                <span style="font-weight: 700; font-size: 13px; color: #e2e8f0; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${esc(cat.name)}">${esc(cat.name)}</span>
                ${renderRiderStatsCategoryBadge(cat.key)}
              </div>
              
              ${cat.isStage ? `
                <!-- Stage Race layout: GC & Classifications -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #6a7a95; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">GC & Wertungen</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${renderTeamCareerBadge(catData.gcWins, 'gold', 'Gesamtwertung Siege')}
                    ${renderTeamCareerBadge(catData.gcSecond, 'silver', 'Gesamtwertung Platz 2')}
                    ${renderTeamCareerBadge(catData.gcThird, 'bronze', 'Gesamtwertung Platz 3')}
                    ${renderTeamCareerBadge(catData.gcTopTen || 0, 'purple', 'Gesamtwertung Ränge 4-10')}
                    <span style="border-left: 1px solid rgba(255,255,255,0.15); height: 1rem; margin: 0 0.1rem; display: inline-block;"></span>
                    ${renderTeamCareerBadge(catData.mountainWins, 'red', 'Bergwertung Siege')}
                    ${renderTeamCareerBadge(catData.pointsWins, 'green', 'Punktewertung Siege')}
                    ${renderTeamCareerBadge(catData.youthWins, 'white', 'Nachwuchswertung Siege')}
                    ${renderTeamCareerBadge(catData.breakawayWins || 0, 'purple', 'Ausreißerwertung Siege')}
                  </div>
                </div>
                
                <!-- Etappenergebnisse -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #6a7a95; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Etappenergebnisse</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${renderTeamCareerBadge(catData.stageWins, 'gold', 'Etappensiege')}
                    ${renderTeamCareerBadge(catData.stageSecond, 'silver', 'Etappen Platz 2')}
                    ${renderTeamCareerBadge(catData.stageThird, 'bronze', 'Etappen Platz 3')}
                    ${renderTeamCareerBadge(catData.stageTopTen || 0, 'purple', 'Etappen Ränge 4-10')}
                  </div>
                </div>

                <!-- Führungstrikots -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #6a7a95; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Führungstrikot Tage</div>
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
                  <div style="font-size: 0.7rem; color: #6a7a95; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Platzierungen</div>
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
                <div style="font-size: 0.7rem; color: #6a7a95; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Checkpoint-Siege</div>
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
                <div style="font-size: 0.7rem; color: #6a7a95; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Profil Siege</div>
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
                <div style="font-size: 0.7rem; color: #6a7a95; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
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
              <div style="display: flex; justify-content: flex-end; align-items: center; font-size: 0.8rem; color: #6a7a95; white-space: nowrap;" title="Renntage in dieser Rennklasse">
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
  const historyRosters = payload.historyRosters || {};
  const years = Object.keys(historyRosters).map(Number).sort((a, b) => a - b);

  if (years.length === 0) {
    return `
      <section class="rider-stats-placeholder">
        <h3>Keine Kader- und Vertragsdaten vorhanden</h3>
        <p>Für dieses Team wurden keine Verträge in der Datenbank erfasst.</p>
      </section>
    `;
  }

  // Aktuelles Jahr validieren
  if (state.teamStatsSelectedRosterYear === null || !years.includes(state.teamStatsSelectedRosterYear)) {
    const currentSeason = state.gameState?.season ?? 2026;
    if (years.includes(currentSeason)) {
      state.teamStatsSelectedRosterYear = currentSeason;
    } else {
      state.teamStatsSelectedRosterYear = years[0];
    }
  }

  const selectedYear = state.teamStatsSelectedRosterYear;
  const rosterForYear = historyRosters[selectedYear] || [];

  const sortedRoster = [...rosterForYear];
  const sortKey = state.teamStatsRosterSort.key;
  const sortDir = state.teamStatsRosterSort.direction;
  sortedRoster.sort((a, b) => {
    let comparison = 0;
    if (sortKey === 'nationality') {
      const valA = a.nationality || '';
      const valB = b.nationality || '';
      comparison = valA.localeCompare(valB, 'de');
    } else if (sortKey === 'name') {
      const valA = `${a.lastName || ''}, ${a.firstName || ''}`;
      const valB = `${b.lastName || ''}, ${b.firstName || ''}`;
      comparison = valA.localeCompare(valB, 'de');
    } else if (sortKey === 'overallRating') {
      comparison = (a.overallRating || 0) - (b.overallRating || 0);
    } else if (sortKey === 'potential') {
      comparison = (a.potential || 0) - (b.potential || 0);
    } else if (sortKey === 'roleName') {
      const valA = a.roleName || '';
      const valB = b.roleName || '';
      comparison = valA.localeCompare(valB, 'de');
    } else if (sortKey === 'contractEndSeason') {
      comparison = (a.contractEndSeason || 0) - (b.contractEndSeason || 0);
    }
    return sortDir === 'asc' ? comparison : -comparison;
  });

  const yearOptionsHtml = years.map(yr => `
    <option value="${yr}" ${yr === selectedYear ? 'selected' : ''}>Kader ${yr}</option>
  `).join('');

  const getSortIcon = (key: string) => {
    if (state.teamStatsRosterSort.key !== key) return ' <span style="opacity: 0.3; font-size: 0.75rem;">↕</span>';
    return state.teamStatsRosterSort.direction === 'asc' ? ' <span style="font-size: 0.75rem;">▲</span>' : ' <span style="font-size: 0.75rem;">▼</span>';
  };

  const tableRowsHtml = sortedRoster.length === 0
    ? `<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">Keine Fahrer für dieses Jahr unter Vertrag.</td></tr>`
    : sortedRoster.map(rider => {
        const flagAlpha2 = rider.nationality ? FLAG_CODE_BY_CODE3[rider.nationality] ?? rider.nationality.slice(0, 2).toLowerCase() : null;
        const flagHtml = flagAlpha2
          ? `<span class="fi fi-${flagAlpha2} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${esc(rider.nationality)}"></span>`
          : '–';

        const nameLink = renderRiderNameLink(`${rider.firstName} ${rider.lastName}`, {
          riderId: rider.riderId,
          teamId: payload.teamId,
          strong: true,
          linkClassName: 'results-rider-link',
          labelClassName: 'results-participant-label',
        });

        const overallRatingHtml = `<span class="results-roster-overall-badge" style="color:${getSkillColorForRating(rider.overallRating)}" title="Stärke: ${rider.overallRating.toFixed(2)}">${rider.overallRating.toFixed(1)}</span>`;
        
        let potentialRatingHtml = '–';
        if (rider.potential != null) {
          potentialRatingHtml = `<span class="results-roster-overall-badge" style="color:${getSkillColorForRating(rider.potential)}" title="Potential: ${rider.potential.toFixed(2)}">${rider.potential.toFixed(1)}</span>`;
        }

        const roleText = esc(rider.roleName || '-');

        const endText = rider.contractEndSeason ? `Saison ${rider.contractEndSeason}` : 'Ohne Vertrag';
        const isExpiring = rider.contractEndSeason === selectedYear;
        const contractCellHtml = isExpiring
          ? `<span class="badge badge-race-category" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: bold; animation: pulse 2s infinite;" title="Vertrag läuft in dieser Saison aus!">${esc(endText)}</span>`
          : `<span style="font-weight: 500;">${esc(endText)}</span>`;

        return `
          <tr class="rider-stats-row">
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">${flagHtml}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); white-space: nowrap;">${nameLink}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">${overallRatingHtml}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">${potentialRatingHtml}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center; color: #ccc;">${roleText}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">${contractCellHtml}</td>
          </tr>
        `;
      }).join('');

  return `
    <section class="rider-stats-contracts" style="margin-top: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h3 style="margin: 0; font-size: 1.15rem; font-weight: bold; color: #fff;">Kaderzusammensetzung</h3>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <label for="team-stats-roster-year-select" style="font-size: 0.85rem; color: #aaa; font-weight: 500;">Jahr auswählen:</label>
          <select id="team-stats-roster-year-select" class="form-control" style="background: #222; border: 1px solid #444; color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer; width: auto; display: inline-block;">
            ${yearOptionsHtml}
          </select>
        </div>
      </div>
      
      <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
        <table class="data-table rider-stats-table" style="width: 100%; border-collapse: collapse; text-align: left;">
          <colgroup>
            <col style="width: 8%;">
            <col style="width: 32%;">
            <col style="width: 15%;">
            <col style="width: 15%;">
            <col style="width: 15%;">
            <col style="width: 15%;">
          </colgroup>
          <thead>
            <tr style="border-bottom: 2px solid rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.02);">
              <th data-team-roster-sort="nationality" style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: center;">Nat${getSortIcon('nationality')}</th>
              <th data-team-roster-sort="name" style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: left;">Fahrer${getSortIcon('name')}</th>
              <th data-team-roster-sort="overallRating" style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: center;">Gesamtstärke${getSortIcon('overallRating')}</th>
              <th data-team-roster-sort="potential" style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: center;">Pot. Gesamtstärke${getSortIcon('potential')}</th>
              <th data-team-roster-sort="roleName" style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: center;">Rolle${getSortIcon('roleName')}</th>
              <th data-team-roster-sort="contractEndSeason" style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: center;">Vertragsende${getSortIcon('contractEndSeason')}</th>
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

function formatSpecName(spec: string | null): string | null {
  if (!spec) return null;
  const norm = spec.toLowerCase();
  if (norm === 'berg' || norm === 'climber') return 'Berg';
  if (norm === 'hill' || norm === 'puncher') return 'Hügel';
  if (norm === 'sprint' || norm === 'sprinter') return 'Sprint';
  if (norm === 'timetrial' || norm === 'time_trial' || norm === 'time trialist' || norm === 'zf') return 'Zeitfahren';
  if (norm === 'cobble' || norm === 'classic' || norm === 'pave') return 'Cobble';
  if (norm === 'flat' || norm === 'flach' || norm === 'flachlandspezialist' || norm === 'flachland') return 'Flach';
  return spec;
}

function getRolePriority(role: string | null | undefined): number {
  if (!role) return 99;
  const norm = role.toLowerCase().replace(/_/g, ' ').replace(/-/g, ' ');
  if (norm === 'kapitaen' || norm === 'kapitän') return 1;
  if (norm === 'co kapitaen' || norm === 'co kapitän') return 2;
  if (norm === 'sprinter') return 3;
  if (norm === 'edelhelfer') return 4;
  if (norm === 'starke helfer' || norm === 'starker helfer') return 5;
  if (norm === 'wassertraeger' || norm === 'wasserträger') return 6;
  return 98;
}

function translateRoleName(role: string | null | undefined): string {
  if (!role) return 'Helfer';
  const norm = role.toLowerCase().replace(/_/g, ' ').replace(/-/g, ' ');
  if (norm === 'kapitaen' || norm === 'kapitän') return 'Kapitän';
  if (norm === 'co kapitaen' || norm === 'co kapitän') return 'Co-Kapitän';
  if (norm === 'sprinter') return 'Sprinter';
  if (norm === 'edelhelfer') return 'Edelhelfer';
  if (norm === 'starke helfer' || norm === 'starker helfer') return 'Starker Helfer';
  if (norm === 'wassertraeger' || norm === 'wasserträger') return 'Wasserträger';
  return role;
}

export function renderTeamStatsTransfersTab(payload: TeamStatsPayload): string {
  const transfers = payload.transfers || {};
  const seasons = Object.keys(transfers).map(Number).sort((a, b) => b - a);

  if (seasons.length === 0) {
    return `
      <section class="rider-stats-placeholder">
        <h3>Keine Transferdaten vorhanden</h3>
        <p>Für dieses Team wurden keine Transfers erfasst.</p>
      </section>
    `;
  }

  let activeSeason = typeof state.teamStatsSelectedSeason === 'number' ? state.teamStatsSelectedSeason : (state.gameState?.season ?? 2026);
  if (!seasons.includes(activeSeason)) {
    activeSeason = seasons[0];
  }

  const seasonOptionsHtml = seasons.map(yr => `
    <option value="${yr}" ${yr === activeSeason ? 'selected' : ''}>Saison ${yr}</option>
  `).join('');

  const activeTransfers = transfers[activeSeason] || { incoming: [], outgoing: [] };

  const formatSpecs = (rider: any) => {
    const list: string[] = [];
    const s1 = formatSpecName(rider.specialization1);
    const s2 = formatSpecName(rider.specialization2);
    const s3 = formatSpecName(rider.specialization3);
    if (s1) list.push(s1);
    if (s2) list.push(s2);
    if (s3) list.push(s3);
    return list.length > 0 ? list.join(' · ') : 'Allrounder';
  };

  const renderTransferCard = (rider: any, type: 'incoming' | 'outgoing') => {
    const flagAlpha2 = rider.nationality ? FLAG_CODE_BY_CODE3[rider.nationality] ?? rider.nationality.slice(0, 2).toLowerCase() : null;
    const flagHtml = flagAlpha2
      ? `<span class="fi fi-${flagAlpha2} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${esc(rider.nationality)}"></span>`
      : '';
    const specText = formatSpecs(rider);
    const link = renderRiderNameLink(`${rider.firstName} ${rider.lastName}`, {
      riderId: rider.id,
      teamId: payload.teamId,
      strong: true,
      linkClassName: 'results-rider-link',
      labelClassName: 'results-participant-label',
    });

    let teamInfoHtml = '';
    if (type === 'incoming') {
      const fromTeam = rider.fromTeamName ? esc(rider.fromTeamName) : 'Freier Fahrer';
      teamInfoHtml = `<span style="color: #64748b; font-size: 0.8rem; font-weight: normal; margin-left: 0.35rem;">(${fromTeam})</span>`;
    } else {
      const toTeam = rider.toTeamName ? `zu: ${rider.toTeamName}` : (rider.isRetired ? 'Karriereende' : 'Freier Fahrer');
      teamInfoHtml = `<span style="color: #64748b; font-size: 0.8rem; font-weight: normal; margin-left: 0.35rem;">(${esc(toTeam)})</span>`;
    }

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); margin-bottom: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 70%;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.4rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${flagHtml}
              ${link}
              ${teamInfoHtml}
            </div>
            <div style="font-size: 0.8rem; color: #facc15; font-weight: bold; display: flex; align-items: center; gap: 0.5rem; margin-top: 0.1rem; flex-wrap: wrap;">
              <span>${esc(specText)}</span>
            </div>
          </div>
        </div>
        <div style="text-align: right; flex-shrink: 0; margin-left: 0.5rem;">
          <div style="font-size: 0.85rem; font-weight: bold; color: #facc15;">${esc(translateRoleName(rider.roleName))}</div>
        </div>
      </div>
    `;
  };

  const sortTransfers = (list: any[]) => {
    return [...list].sort((a, b) => {
      const priorityA = getRolePriority(a.roleName);
      const priorityB = getRolePriority(b.roleName);
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      return (b.overallRating || 0) - (a.overallRating || 0);
    });
  };

  const sortedIncoming = sortTransfers(activeTransfers.incoming);
  const sortedOutgoing = sortTransfers(activeTransfers.outgoing);

  const incomingHtml = sortedIncoming.length === 0
    ? '<div style="color: #64748b; font-style: italic; text-align: center; padding: 2rem;">Keine Zugänge in dieser Saison.</div>'
    : sortedIncoming.map(r => renderTransferCard(r, 'incoming')).join('');

  const outgoingHtml = sortedOutgoing.length === 0
    ? '<div style="color: #64748b; font-style: italic; text-align: center; padding: 2rem;">Keine Abgänge in dieser Saison.</div>'
    : sortedOutgoing.map(r => renderTransferCard(r, 'outgoing')).join('');

  return `
    <section class="rider-stats-transfers" style="margin-top: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h3 style="margin: 0; font-size: 1.15rem; font-weight: bold; color: #fff;">Saison-Transfers</h3>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <label for="team-stats-transfers-season-select" style="font-size: 0.85rem; color: #aaa; font-weight: 500;">Saison filtern:</label>
          <select id="team-stats-transfers-season-select" class="form-control" style="background: #222; border: 1px solid #444; color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer; width: auto; display: inline-block;">
            ${seasonOptionsHtml}
          </select>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <!-- Zugänge (Left) -->
        <div style="background: rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 1.25rem;">
          <h4 style="margin: 0 0 1rem 0; font-size: 1.05rem; font-weight: bold; color: #4ade80; display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.25rem;">⇦</span> Zugänge (${activeTransfers.incoming.length})
          </h4>
          <div style="display: flex; flex-direction: column;">
            ${incomingHtml}
          </div>
        </div>
        
        <!-- Abgänge (Right) -->
        <div style="background: rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 1.25rem;">
          <h4 style="margin: 0 0 1rem 0; font-size: 1.05rem; font-weight: bold; color: #f87171; display: flex; align-items: center; gap: 0.5rem;">
            Abgänge (${activeTransfers.outgoing.length}) <span style="font-size: 1.25rem;">⇨</span>
          </h4>
          <div style="display: flex; flex-direction: column;">
            ${outgoingHtml}
          </div>
        </div>
      </div>
    </section>
  `;
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

  if (state.teamStatsTab === 'transfers') {
    return `
      ${renderTeamStatsHeader(payload)}
      ${renderTeamStatsTabs()}
      ${renderTeamStatsTransfersTab(payload)}
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
  state.teamStatsTopResultsFilterRank = null;
  state.teamStatsTopResultsFilterProfile = null;
  state.teamStatsSelectedSeason = 'all';
  state.teamStatsSelectedRosterYear = state.gameState?.season ?? 2026;
  state.teamStatsRosterSort = {
    key: 'overallRating',
    direction: 'desc',
  };
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

    // Rank filter buttons
    const rankBtn = target.closest<HTMLButtonElement>('button[data-team-top-results-rank]');
    if (rankBtn) {
      const val = rankBtn.dataset['teamTopResultsRank'];
      const selectedRank = val === 'all' ? null : Number(val);
      state.teamStatsTopResultsFilterRank = state.teamStatsTopResultsFilterRank === selectedRank ? null : selectedRank;
      state.teamStatsTopResultsPage = 1;
      if (state.teamStatsPayload) {
        $('team-stats-body').innerHTML = renderTeamStatsBody(state.teamStatsPayload);
      }
      return;
    }

    const filterBtn = target.closest<HTMLButtonElement>('button[data-team-top-results-filter]');
    if (filterBtn) {
      const filterType = filterBtn.dataset['teamTopResultsFilter'] as 'gc' | 'mountain' | 'points' | 'youth' | 'breakaway' | 'oneDay' | 'stage';
      state.teamStatsTopResultsFilters[filterType] = !state.teamStatsTopResultsFilters[filterType];
      state.teamStatsTopResultsPage = 1;
      if (state.teamStatsPayload) {
        $('team-stats-body').innerHTML = renderTeamStatsBody(state.teamStatsPayload);
      }
      return;
    }

    // Tab buttons
    const tabButton = target.closest<HTMLButtonElement>('button[data-team-stats-tab]');
    if (tabButton) {
      const nextTab = tabButton.dataset['teamStatsTab'] as any;
      if (nextTab === 'topResults' || nextTab === 'career' || nextTab === 'contracts' || nextTab === 'transfers') {
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

    // Roster sorting headers
    const sortHeader = target.closest<HTMLTableCellElement>('th[data-team-roster-sort]');
    if (sortHeader) {
      const key = sortHeader.dataset['teamRosterSort'] as any;
      if (key) {
        if (state.teamStatsRosterSort.key === key) {
          state.teamStatsRosterSort.direction = state.teamStatsRosterSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
          state.teamStatsRosterSort.key = key;
          state.teamStatsRosterSort.direction = (key === 'overallRating' || key === 'potential' || key === 'contractEndSeason') ? 'desc' : 'asc';
        }
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
    } else if (target.id === 'team-stats-filter-profile') {
      const select = target as HTMLSelectElement;
      state.teamStatsTopResultsFilterProfile = select.value === 'all' ? null : select.value;
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
    } else if (target.id === 'team-stats-roster-year-select') {
      const select = target as HTMLSelectElement;
      state.teamStatsSelectedRosterYear = Number(select.value);
      if (state.teamStatsPayload) {
        $('team-stats-body').innerHTML = renderTeamStatsBody(state.teamStatsPayload);
      }
    } else if (target.id === 'team-stats-transfers-season-select') {
      const select = target as HTMLSelectElement;
      state.teamStatsSelectedSeason = Number(select.value);
      if (state.teamStatsPayload) {
        $('team-stats-body').innerHTML = renderTeamStatsBody(state.teamStatsPayload);
      }
    }
  });
}
