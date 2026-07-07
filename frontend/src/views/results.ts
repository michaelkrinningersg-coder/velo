import { api } from '../api';
import { setReigningChampionMarkers } from '../riderStatsUi';
import {
  $,
  esc,
  state,
  formatDate,
  formatRaceTime,
  formatRaceGap,
  renderFlag,
  renderCountry,
  renderMiniJersey,
  renderResultsJerseyColumn,
  renderResultsFlagColumn,
  resolveRiderCountryCode,
  findRiderById,
  findRaceById,
  findStageById,
  renderResultsParticipant,
  renderRiderNameLink,
  renderTeamNameLink,
  renderNonFinisherStatusBadge,
  formatNonFinisherReason,
  renderRankDelta,
  formatMarkerLabel,
  FLAG_CODE_BY_CODE3,
  GC_RESULT_TYPE_ID,
  POINTS_RESULT_TYPE_ID,
  MOUNTAIN_RESULT_TYPE_ID,
  isActiveView,
  showLoading,
  hideLoading,
  getRiderSpecializationLabel,
  getRidersByTeam,
} from '../state';
import type {
  StageResultsPayload,
  StageMarkerClassification,
  Race,
  RaceRosterEntry,
} from '../../../shared/types';
import { renderWeatherIcon } from './riderStats';

export const RESULTS_STAGE_OVERVIEW_KEY = '__stage_overview__';
export const RESULTS_NON_FINISHERS_KEY = '__non_finishers__';
export const RESULTS_EVENTS_KEY = '__events__';
export const RESULTS_ROSTER_KEY = '__roster__';

let selectedEventFilter = 'all';

/** CSS-Klasse für die Podium-Hervorhebung einer Ergebniszeile (Top-3). */
export function resultsRowRankClass(rank: number | null | undefined): string {
  if (rank === 1) return ' results-row-rank-1';
  if (rank === 2) return ' results-row-rank-2';
  if (rank === 3) return ' results-row-rank-3';
  return '';
}

/** Platz-Zelle mit Medaillen-Badge für Top-3, sonst nur die Zahl. */
export function renderRankCell(rank: number): string {
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
  const medalHtml = medal ? `<span class="rank-medal">${medal}</span>` : '';
  return `<td class="pos-${Math.min(rank, 3)}">${medalHtml}${rank}</td>`;
}

export function isMountainClassificationMarkerType(markerType: string, markerCategory: string | null | undefined): boolean {
  if (markerType === 'climb_top' || markerType === 'finish_hill' || markerType === 'finish_mountain') {
    return true;
  }
  return false;
}

export function resolveMarkerResultsSortPriority(classification: StageMarkerClassification): number {
  if (isMountainClassificationMarkerType(classification.markerType, classification.markerCategory)) return 0;
  if (classification.markerType === 'sprint_intermediate') return 1;
  return 2;
}

export function sortStageMarkerClassifications(classifications: StageMarkerClassification[]): StageMarkerClassification[] {
  return [...classifications].sort((left, right) => (
    resolveMarkerResultsSortPriority(left) - resolveMarkerResultsSortPriority(right)
    || left.kmMark - right.kmMark
    || left.markerLabel.localeCompare(right.markerLabel, 'de')
    || left.markerKey.localeCompare(right.markerKey, 'de')
  ));
}

export function resolveMarkerResultButtonLabel(classification: StageMarkerClassification): string {
  const markerPrefix = classification.markerType === 'sprint_intermediate' ? 'Sprint' : 'Berg';
  const categorySuffix = isMountainClassificationMarkerType(classification.markerType, classification.markerCategory) && classification.markerCategory
    ? ` ${classification.markerCategory}`
    : '';
  return `${markerPrefix}${categorySuffix} · ${classification.markerLabel}`;
}

export function formatAverageSpeed(distanceKm: number, timeSeconds: number): string {
  if (!(distanceKm > 0) || !(timeSeconds > 0)) {
    return '';
  }
  return `${((distanceKm / timeSeconds) * 3600).toFixed(1).replace('.', ',')} km/h`;
}

export function formatResultsStageLabel(race: Race, stage: NonNullable<Race['stages']>[number]): string {
  const stageLabel = race.isStageRace ? `Etappe ${stage.stageNumber}` : 'Renntag';
  return `${race.name} · ${stageLabel} · ${formatDate(stage.date)}`;
}

function getFlagEmoji(code3: string | null | undefined): string {
  if (!code3) return '';
  const alpha2 = FLAG_CODE_BY_CODE3[code3] ?? null;
  if (!alpha2) return '';
  const codePoints = alpha2
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export async function loadStageResults(stageId: number, silentIfMissing: boolean): Promise<void> {
  const location = findStageById(stageId);
  if (location) {
    state.selectedResultsRaceId = location.race.id;
    state.selectedResultsStageId = stageId;
  }

  if (state.riders.length === 0) {
    const ridersRes = await api.getRiders();
    if (ridersRes.success) {
      state.riders = ridersRes.data ?? [];
    }
  }

  const res = await api.getStageResults(stageId);
  if (!res.success) {
    state.stageResults = null;
    renderResultsView();
    if (!silentIfMissing && res.error) {
      alert('Ergebnisse konnten nicht geladen werden:\n' + res.error);
    }
    return;
  }

  state.stageResults = res.data ?? null;
  if (state.stageResults) {
    state.selectedResultsRaceId = state.stageResults.raceId;
    state.selectedResultsStageId = state.stageResults.stageId;
    state.selectedResultTypeId = state.stageResults.classifications[0]?.resultTypeId ?? 1;
    state.selectedResultsMarkerKey = RESULTS_STAGE_OVERVIEW_KEY;
    state.selectedResultsSpecialView = null;
  }

  // Also try to load roster for this race
  if (state.selectedResultsRaceId != null) {
    void loadRaceRoster(state.selectedResultsRaceId);
  }

  renderResultsView();
}

export async function loadRaceRoster(raceId: number): Promise<void> {
  // Load season standings first to support sorting teams in the roster
  if (!state.seasonStandings) {
    const standingsRes = await api.getSeasonStandings();
    if (standingsRes.success && standingsRes.data) {
      state.seasonStandings = standingsRes.data;
      setReigningChampionMarkers(standingsRes.data.reigningChampions);
    }
  }

  const res = await api.getRaceResultsRoster(raceId);
  if (res.success && res.data) {
    state.resultsRoster = res.data;
  } else {
    state.resultsRoster = null;
  }
}

// --- Roster Color Coding: 15 spec/role combinations ----
// Role IDs: 1=Kapitän, 2=Co-Kapitän, 3=Edelhelfer, 4=Starker Helfer, 5=Wasserträger, 6=Sprinter
// Specs: Berg, Hill, Sprint, Timetrial, Cobble, Attacker
// Color matrix for rider name/role by [spec1, spec2] combination (order-independent)
type SpecPair = string; // e.g. "Berg+Sprint"

function normalizeSpecPair(spec1: string | null, spec2: string | null): SpecPair {
  const s1 = spec1 ?? '';
  const s2 = spec2 ?? '';
  const parts = [s1, s2].filter(Boolean).sort();
  return parts.join('+');
}

const SPEC_PAIR_COLORS: Record<SpecPair, { color: string; bg: string }> = {
  'Attacker+Berg':      { color: '#c084fc', bg: 'rgba(192,132,252,0.1)' },
  'Attacker+Cobble':    { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)' },
  'Attacker+Hill':      { color: '#f472b6', bg: 'rgba(244,114,182,0.1)' },
  'Attacker+Sprint':    { color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
  'Attacker+Timetrial': { color: '#fda4af', bg: 'rgba(253,164,175,0.1)' },
  'Berg+Cobble':        { color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
  'Berg+Hill':          { color: '#38bdf8', bg: 'rgba(56,189,248,0.1)' },
  'Berg+Sprint':        { color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
  'Berg+Timetrial':     { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  'Cobble+Hill':        { color: '#ea580c', bg: 'rgba(234,88,12,0.1)' },
  'Cobble+Sprint':      { color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  'Cobble+Timetrial':   { color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
  'Hill+Sprint':        { color: '#2dd4bf', bg: 'rgba(45,212,191,0.1)' },
  'Hill+Timetrial':     { color: '#818cf8', bg: 'rgba(129,140,248,0.1)' },
  'Sprint+Timetrial':   { color: '#fde047', bg: 'rgba(253,224,71,0.1)' },
};

function getRoleStyle(roleId: number | null): { color: string; bg: string } {
  if (roleId === 1) return { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' }; // Kapitän: Gelb
  if (roleId === 2) return { color: '#cbd5e1', bg: 'rgba(203, 213, 225, 0.1)' }; // Co-Kapitän: Silber
  if (roleId === 6) return { color: '#4ade80', bg: 'rgba(74, 222, 128, 0.1)' }; // Sprinter: Grün
  if (roleId === 3) return { color: '#c084fc', bg: 'rgba(192, 132, 252, 0.1)' }; // Edelhelfer: Violett
  if (roleId === 4) return { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)' }; // Starker Helfer: Hellblau
  if (roleId === 5) return { color: '#fb923c', bg: 'rgba(251, 146, 60, 0.1)' }; // Wasserträger: Orange
  return { color: 'var(--text-300)', bg: 'transparent' };
}

// Role sort order: 1=Kapitän first, then 2,3,4,5,6
function getRoleOrder(roleId: number | null): number {
  if (roleId == null) return 99;
  const order: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };
  return order[roleId] ?? 99;
}

function renderRaceRoster(): string {
  const roster = state.resultsRoster;
  if (!roster || roster.entries.length === 0) {
    return '<div class="results-roster-empty">Noch keine Teilnehmerdaten (Rennen noch nicht gestartet oder kein Starterfeld gefunden).</div>';
  }

  const currentRace = findRaceById(state.selectedResultsRaceId);
  const isStageRace = currentRace?.isStageRace ?? false;


  // Find the top 5 strongest riders in the entire race
  const sortedAllRiders = [...roster.entries].sort((a, b) => b.overallRating - a.overallRating);
  const top5RiderIds = new Set(sortedAllRiders.slice(0, 5).map(r => r.riderId));

  const getSprintSkill = (riderId: number): number => {
    const r = state.riders.find(x => x.id === riderId);
    return r?.skills?.sprint ?? 0;
  };

  // Find the top 5 sprinters (sprint skill) who are not in the top 5 overall
  const remainingRiders = roster.entries.filter(r => !top5RiderIds.has(r.riderId));
  const sortedBySprint = [...remainingRiders].sort((a, b) => {
    const sprintA = getSprintSkill(a.riderId);
    const sprintB = getSprintSkill(b.riderId);
    if (sprintB !== sprintA) {
      return sprintB - sprintA;
    }
    return b.overallRating - a.overallRating;
  });
  const top5SprinterIds = new Set(sortedBySprint.slice(0, 5).map(r => r.riderId));

  function getRosterSpecializationLabel(spec: string): string {
    switch (spec) {
      case 'Berg':
        return 'Berg';
      case 'Hill':
        return 'Hügel';
      case 'Sprint':
        return 'Sprinter';
      case 'Cobble':
        return 'Pflaster';
      case 'Timetrial':
        return 'Zeitfahrer';
      case 'Attacker':
        return 'Ausreißer';
      default:
        return spec;
    }
  }

  // Group riders by team
  const teamMap = new Map<number | null, { teamId: number | null; teamName: string | null; riders: RaceRosterEntry[]; avgRating: number }>();
  for (const entry of roster.entries) {
    const key = entry.teamId;
    if (!teamMap.has(key)) {
      teamMap.set(key, { teamId: entry.teamId, teamName: entry.teamName, riders: [], avgRating: 0 });
    }
    teamMap.get(key)!.riders.push(entry);
  }

  // Calculate team average overall rating
  for (const team of teamMap.values()) {
    team.avgRating = team.riders.reduce((sum, r) => sum + r.overallRating, 0) / team.riders.length;
  }

  const getBestGCRank = (teamRiders: RaceRosterEntry[]): number => {
    let best = Number.POSITIVE_INFINITY;
    for (const r of teamRiders) {
      if (!r.hasDropped && r.gcRank != null && r.gcRank < best) {
        best = r.gcRank;
      }
    }
    return best;
  };

  const getBestSeasonStandingPoints = (teamRiders: RaceRosterEntry[]): number => {
    if (!state.seasonStandings?.riderStandings) return 0;
    let maxPts = 0;
    for (const r of teamRiders) {
      const standing = state.seasonStandings.riderStandings.find(s => s.riderId === r.riderId);
      if (standing && standing.points > maxPts) {
        maxPts = standing.points;
      }
    }
    return maxPts;
  };

  const getTeamTop10Average = (teamId: number | null): number => {
    if (teamId == null) return 0;
    const teamRiders = getRidersByTeam(teamId);
    if (teamRiders.length === 0) return 0;

    const scores = teamRiders.map(r => r.overallRating ?? 0);
    scores.sort((a, b) => b - a);
    const top10 = scores.slice(0, 10);
    if (top10.length === 0) return 0;
    return top10.reduce((sum, s) => sum + s, 0) / top10.length;
  };

  // Sort teams: by best GC rider rank, then by best participating rider's season standings points, then by average overall rating of the best 10 riders
  const teams = [...teamMap.values()].sort((a, b) => {
    const gcRankA = getBestGCRank(a.riders);
    const gcRankB = getBestGCRank(b.riders);

    if (gcRankA !== Number.POSITIVE_INFINITY || gcRankB !== Number.POSITIVE_INFINITY) {
      if (gcRankA !== gcRankB) {
        return gcRankA - gcRankB;
      }
    }

    const maxPtsA = getBestSeasonStandingPoints(a.riders);
    const maxPtsB = getBestSeasonStandingPoints(b.riders);

    if (maxPtsA > 0 || maxPtsB > 0) {
      if (maxPtsA !== maxPtsB) {
        return maxPtsB - maxPtsA;
      }
    }

    const avgA = getTeamTop10Average(a.teamId);
    const avgB = getTeamTop10Average(b.teamId);

    if (Math.abs(avgA - avgB) > 0.0001) {
      return avgB - avgA;
    }

    return (a.teamName ?? '').localeCompare(b.teamName ?? '', 'de');
  });

  // Sort riders within each team by role then overallRating desc
  for (const team of teams) {
    team.riders.sort((a, b) =>
      getRoleOrder(a.roleId) - getRoleOrder(b.roleId) ||
      b.overallRating - a.overallRating ||
      a.lastName.localeCompare(b.lastName, 'de'),
    );
  }

  // Render each team card
  const teamsHtml = teams.map((team) => {
    const jerseyHtml = team.teamId != null
      ? renderMiniJersey(team.teamId, team.teamName)
      : '';

    const ridersHtml = team.riders.map((entry) => {
      const roleStyle = getRoleStyle(entry.roleId);
      const flagAlpha2 = entry.countryCode ? (FLAG_CODE_BY_CODE3[entry.countryCode] ?? entry.countryCode.slice(0, 2).toLowerCase()) : null;
      const flagHtml = flagAlpha2
        ? `<span class="fi fi-${flagAlpha2} results-roster-flag" title="${esc(entry.countryCode ?? '')}"></span>`
        : '<span class="results-roster-flag-placeholder"></span>';
      
      const nameText = `${entry.firstName.charAt(0)}. ${entry.lastName}`;
      const roleName = entry.roleName ?? '–';
      
      // Spec 1 and Spec 2
      const specLabel1 = entry.specialization1 ? getRosterSpecializationLabel(entry.specialization1) : null;
      const specLabel2 = entry.specialization2 ? getRosterSpecializationLabel(entry.specialization2) : null;
      let roleAndSpec = roleName;
      if (specLabel1) {
        roleAndSpec += ` · ${specLabel1}`;
      }
      if (specLabel2) {
        roleAndSpec += ` · ${specLabel2}`;
      }

      const overallHtml = `<span class="results-roster-overall-badge" style="color:${getSkillColorForRating(entry.overallRating)}" title="Gesamtstärke: ${entry.overallRating.toFixed(2)}">${entry.overallRating.toFixed(2)}</span>`;
      const droppedClass = entry.hasDropped ? ' dropped' : '';
      
      let gcText = '';
      if (entry.hasDropped) {
        if (entry.dropoutStatus === 'dns') {
          gcText = 'DNS';
        } else if (entry.dropoutStatus === 'dnf') {
          const isOtl = entry.dropoutReason?.startsWith('OTL') ?? false;
          gcText = isOtl ? 'OTL' : 'DNF';
        } else {
          gcText = 'OUT';
        }
      } else if (entry.gcRank != null) {
        gcText = `${entry.gcRank}`;
      }

      let gcBadgeHtml = '';
      if (entry.hasDropped) {
        gcBadgeHtml = `<span class="rider-stats-rank-badge" style="color: var(--danger, #ef4444); border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1);" title="Ausgeschieden: ${esc(entry.dropoutReason || '')}">${gcText}</span>`;
      } else if (entry.gcRank != null) {
        let rankClass = 'rider-stats-rank-badge-gc';
        if (entry.gcRank === 1) {
          rankClass = 'rider-stats-rank-badge-place rider-stats-rank-badge-top-1';
        } else if (entry.gcRank === 2) {
          rankClass = 'rider-stats-rank-badge-place rider-stats-rank-badge-top-2';
        } else if (entry.gcRank === 3) {
          rankClass = 'rider-stats-rank-badge-place rider-stats-rank-badge-top-3';
        }
        gcBadgeHtml = `<span class="rider-stats-rank-badge ${rankClass}" title="GC Stand: Platz ${entry.gcRank}">${entry.gcRank}</span>`;
      }

      const color = entry.hasDropped ? 'var(--text-500)' : roleStyle.color;
      const roleStyleAttr = `style="color: ${color}; font-weight: bold;"`;
      const isTop5Strongest = top5RiderIds.has(entry.riderId);
      const isTop5Sprinter = top5SprinterIds.has(entry.riderId);
      const highlightClass = isTop5Strongest ? ' strongest-rider' : (isTop5Sprinter ? ' best-sprinter' : '');

      return `<div class="results-roster-rider${droppedClass}">
        <div class="results-roster-rider-info">
          <div class="results-roster-rider-top">
            ${flagHtml}
            <span class="results-roster-name${highlightClass}">
              ${renderRiderNameLink(nameText, {
                riderId: entry.riderId,
                teamId: entry.teamId,
                strong: true,
                linkClassName: 'results-rider-link',
                labelClassName: 'results-participant-label',
              })}
              ${renderLeaderDots(entry.riderId)}
            </span>
          </div>
          <div class="results-roster-rider-meta">
            <span class="results-roster-role-spec" ${roleStyleAttr}>${esc(roleAndSpec)}</span>
          </div>
        </div>
        <div class="results-roster-rider-badges${isStageRace ? '' : ' results-roster-rider-badges-oneday'}">
          ${isStageRace ? `${gcBadgeHtml ? gcBadgeHtml : '<span class="results-roster-gc-placeholder"></span>'}<span class="results-roster-badge-divider"></span>` : ''}
          ${overallHtml}
        </div>
      </div>`;
    }).join('');

    const avgStrStr = team.avgRating.toFixed(1).replace('.', ',');

    return `<div class="results-roster-team">
      <div class="results-roster-team-header">
        <div class="results-roster-jersey">${jerseyHtml}</div>
        <div class="results-roster-team-name" title="${esc(team.teamName ?? '–')}">${renderTeamNameLink(team.teamName ?? '–', team.teamId)} <span style="font-size: 0.7rem; color: var(--text-400); font-weight: 500;">(Ø ${avgStrStr})</span></div>
      </div>
      <div class="results-roster-riders${isStageRace ? '' : ' results-roster-riders-oneday'}">${ridersHtml}</div>
    </div>`;
  }).join('');

  return `<div class="results-roster-grid">${teamsHtml}</div>`;
}

function getSkillColorForRating(value: number): string {
  if (value >= 90) return '#22c55e';
  if (value >= 80) return '#86efac';
  if (value >= 70) return '#fbbf24';
  if (value >= 60) return '#fb923c';
  if (value >= 50) return '#f87171';
  return '#94a3b8';
}

function renderLeadoutPopover(row: any): string {
  if (row.leadoutBonus == null || !(row.leadoutBonus > 0) || row.leadoutRiderId == null || row.teamId == null) {
    return '';
  }

  // 1. Get active teammate riders who finished this stage
  const stageClassification = state.stageResults?.classifications.find(c => c.resultTypeId === 1);
  const activeRaceRiderIds = new Set(
    stageClassification
      ? stageClassification.rows.map(r => r.riderId).filter((id): id is number => id != null)
      : []
  );
  const teammates = state.riders.filter(r => 
    r.activeTeamId === row.teamId && 
    activeRaceRiderIds.has(r.id)
  );
  const droppedIds = new Set((state.stageResults?.nonFinishers ?? []).map(nf => nf.riderId));

  // 2. Identify potential contributors
  const contributors: Array<{
    id: number;
    firstName: string;
    lastName: string;
    countryCode: string | null;
    isSprinter: boolean;
    multiplier: number;
    contribution: number;
  }> = [];

  for (const r of teammates) {
    if (r.id === row.riderId || droppedIds.has(r.id)) {
      continue;
    }

    let metCount = 0;
    const c1 = r.skills.sprint >= 72;
    const c2 = r.skills.flat >= 78;
    const c3 = r.skills.timeTrial >= 76;
    const c4 = r.skills.acceleration >= 80;

    if (c1) metCount++;
    if (c2) metCount++;
    if (c3) metCount++;
    if (c4) metCount++;

    if (metCount > 0) {
      let multiplier = 1.0;
      if (metCount === 2) {
        multiplier = 1.25;
      } else if (metCount === 3) {
        multiplier = 1.5;
      } else if (metCount === 4) {
        multiplier = 2.0;
      }
      contributors.push({
        id: r.id,
        firstName: r.firstName,
        lastName: r.lastName,
        countryCode: r.nationality ?? null,
        isSprinter: c1,
        multiplier,
        contribution: 0,
      });
    }
  }

  const T = row.leadoutBonus;

  if (contributors.length > 0) {
    // 3. Solve for sprint/special base values
    const sprintersMultSum = contributors.filter(c => c.isSprinter).reduce((sum, c) => sum + c.multiplier, 0);
    const specialsMultSum = contributors.filter(c => !c.isSprinter).reduce((sum, c) => sum + c.multiplier, 0);

    let x = 0; // special base
    let y = 0; // sprint base

    if (sprintersMultSum > 0 && specialsMultSum > 0) {
      x = T / (2.125 * sprintersMultSum + specialsMultSum);
      y = 2.125 * x;
      x = Math.max(0.1, Math.min(0.3, x));
      y = Math.max(0.25, Math.min(0.6, y));
    } else if (sprintersMultSum > 0) {
      y = T / sprintersMultSum;
      y = Math.max(0.25, Math.min(0.6, y));
      x = y / 2.125;
    } else if (specialsMultSum > 0) {
      x = T / specialsMultSum;
      x = Math.max(0.1, Math.min(0.3, x));
      y = 2.125 * x;
    }

    for (const c of contributors) {
      c.contribution = c.isSprinter ? (y * c.multiplier) : (x * c.multiplier);
    }

    // 4. Adjust sum to match T exactly
    const sum = contributors.reduce((s, c) => s + c.contribution, 0);
    if (sum > 0) {
      const scale = T / sum;
      for (const c of contributors) {
        c.contribution *= scale;
      }
    }

    // Sort by contribution desc
    contributors.sort((a, b) => b.contribution - a.contribution);
  } else {
    // Fallback if no teammates match or state.riders is empty
    contributors.push({
      id: row.leadoutRiderId,
      firstName: '',
      lastName: row.leadoutRiderLastName ?? 'Teampartner',
      countryCode: row.leadoutRiderCountryCode,
      isSprinter: false,
      multiplier: 1.0,
      contribution: T,
    });
  }

  const formattedTotalBonus = T.toFixed(2).replace('.', ',');

  const rowsHtml = contributors.map((c) => {
    const flagHtml = renderResultsFlagColumn(resolveRiderCountryCode(c.id) ?? c.countryCode);
    const nameStr = c.firstName ? `${c.firstName.charAt(0)}. ${c.lastName}` : c.lastName;
    const bonusStr = c.contribution.toFixed(2).replace('.', ',');
    return `
      <div class="leadout-bonus-popover-grid">
        <span class="results-flag-col-cell">${flagHtml}</span>
        <span class="leadout-bonus-rider-name">${esc(nameStr)}</span>
        <strong>+${bonusStr}</strong>
      </div>
    `;
  }).join('');

  return `
    <div class="leadout-bonus-popover">
      <div class="leadout-bonus-popover-card">
        <div class="leadout-bonus-popover-head">
          <strong>Leadout-Bonus Details (Gesamt: +${formattedTotalBonus})</strong>
        </div>
        <div class="leadout-bonus-popover-grid leadout-bonus-popover-grid-head">
          <span>Land</span>
          <span>Fahrer</span>
          <span>Beitrag</span>
        </div>
        ${rowsHtml}
      </div>
    </div>
  `;
}

function getKmZeroEventPriority(row: { title?: string | null }): number {
  const title = row.title || '';
  if (title.includes('guten Tag')) {
    return 1; // Superform
  }
  if (title.includes('schlechten Tag')) {
    return 2; // Supermalus
  }
  if (title.includes('Formhöhepunkt') || title.includes('Formhoehepunkt')) {
    return 3; // Form Peak
  }
  if (title.includes('nicht am Start')) {
    return 4; // DNS
  }
  return 5;
}

function renderLeaderDots(riderId: number | null): string {
  if (riderId == null || !state.stageResults) return '';
  const currentRace = findRaceById(state.selectedResultsRaceId);
  const isStageRace = currentRace?.isStageRace ?? false;

  const classifications = state.stageResults.classifications;
  const gcLeader = classifications.find(c => c.resultTypeId === GC_RESULT_TYPE_ID)?.rows.find(r => r.rank === 1)?.riderId;
  const pointsLeader = classifications.find(c => c.resultTypeId === POINTS_RESULT_TYPE_ID)?.rows.find(r => r.rank === 1)?.riderId;
  const mountainLeader = classifications.find(c => c.resultTypeId === MOUNTAIN_RESULT_TYPE_ID)?.rows.find(r => r.rank === 1)?.riderId;
  const youthLeader = classifications.find(c => c.resultTypeId === 5)?.rows.find(r => r.rank === 1)?.riderId;
  const breakawayLeader = classifications.find(c => c.resultTypeId === 7)?.rows.find(r => r.rank === 1)?.riderId;

  const dots: string[] = [];
  const currentTypeId = state.selectedResultTypeId;

  // Yellow Dot (GC leader):
  if (riderId === gcLeader) {
    if (currentTypeId === GC_RESULT_TYPE_ID || (currentTypeId === 1 && isStageRace) || (currentTypeId !== 1 && currentTypeId !== GC_RESULT_TYPE_ID)) {
      dots.push('<span class="jersey-dot jersey-dot-yellow" title="Gelbes Trikot (Gesamtwertung)"></span>');
    }
  }
  // Green Dot (Points leader):
  if (riderId === pointsLeader) {
    dots.push('<span class="jersey-dot jersey-dot-green" title="Grünes Trikot (Punktewertung)"></span>');
  }
  // Red Dot (Mountain leader):
  if (riderId === mountainLeader) {
    dots.push('<span class="jersey-dot jersey-dot-red" title="Rotes Trikot (Bergwertung)"></span>');
  }
  // White Dot (Youth leader):
  if (riderId === youthLeader) {
    dots.push('<span class="jersey-dot jersey-dot-white" title="Weißes Trikot (Nachwuchswertung)"></span>');
  }
  // Purple Dot (Breakaway leader):
  if (riderId === breakawayLeader) {
    dots.push('<span class="jersey-dot jersey-dot-purple" title="Ausreißertrikot (Aktivste Fahrer)"></span>');
  }

  if (dots.length === 0) return '';
  return `<span class="jersey-dots-wrapper">${dots.join('')}</span>`;
}

function formatEventTextWithAllRiders(text: string): string {
  if (!text) return '';

  let tempText = text;
  const placeholders: string[] = [];

  // Sort riders by name length descending to avoid partial replacements (e.g. "David Gaudu" before "David")
  const riders = [...state.riders].sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`;
    const nameB = `${b.firstName} ${b.lastName}`;
    return nameB.length - nameA.length;
  });

  for (const rider of riders) {
    const name = `${rider.firstName} ${rider.lastName}`;

    // Escape name for regex
    const escapedName = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`${escapedName}(\\s+\\(\\d+\\.\\))?`, 'g');

    if (regex.test(tempText)) {
      tempText = tempText.replace(regex, (match) => {
        const placeholder = `__RIDER_LINK_${placeholders.length}__`;
        const linkHtml = renderRiderNameLink(match, {
          riderId: rider.id,
          teamId: rider.activeTeamId,
          strong: true,
          linkClassName: 'results-rider-link',
          labelClassName: 'results-participant-label',
        });
        placeholders.push(linkHtml);
        return placeholder;
      });
    }
  }

  let escapedHtml = esc(tempText);
  for (let i = 0; i < placeholders.length; i++) {
    escapedHtml = escapedHtml.replace(`__RIDER_LINK_${i}__`, placeholders[i]);
  }

  return escapedHtml;
}

/**
 * Auswaehlbare Rennen fuer das Results-Menue, chronologisch nach Startdatum
 * sortiert (nur Rennen mit mindestens einer Etappe). Basis fuer das Dropdown
 * und die Vor-/Zurueck-Durchschaltung.
 */
function resultsRaceList(): Race[] {
  return state.races
    .filter((race) => (race.stages?.length ?? 0) > 0)
    .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.name.localeCompare(b.name, 'de'));
}

/**
 * Schaltet im Results-Menue ein Rennen weiter (direction -1 = zurueck,
 * +1 = vor) entlang der nach Startdatum sortierten Rennliste und laedt das
 * erste (Etappen-)Ergebnis des Zielrennens.
 */
function navigateResultsRace(direction: -1 | 1): void {
  const list = resultsRaceList();
  if (list.length === 0) return;
  const idx = list.findIndex((race) => race.id === state.selectedResultsRaceId);
  let nextIdx: number;
  if (idx === -1) {
    nextIdx = direction === 1 ? 0 : list.length - 1;
  } else {
    nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= list.length) return; // an den Enden nicht umbrechen
  }
  const race = list[nextIdx];
  state.selectedResultsRaceId = race.id;
  state.selectedResultsStageId = race.stages?.[0]?.id ?? null;
  state.selectedResultTypeId = 1;
  state.selectedResultsMarkerKey = RESULTS_STAGE_OVERVIEW_KEY;
  state.selectedResultsSpecialView = null;
  state.stageResults = null;
  renderResultsView();
  if (state.selectedResultsStageId != null) {
    void loadStageResults(state.selectedResultsStageId, true);
  }
}

export function renderResultsView(): void {
  // If state.riders is empty, trigger a fetch so that links are rendered properly when data arrives
  if (state.riders.length === 0) {
    void api.getRiders().then((res) => {
      if (res.success && res.data) {
        state.riders = res.data;
        renderResultsView();
      }
    });
  }

  const raceSelect = $<HTMLSelectElement>('results-race-select');
  const stageSelect = $<HTMLSelectElement>('results-stage-select');
  const tabs = $('results-type-tabs');
  const markerTabs = $('results-marker-tabs');
  const meta = $('results-stage-meta');
  const empty = $('results-empty');
  const tableCard = $('results-table-card');
  const gridHead = $('results-grid-head');
  const cardTitle = $('results-card-title');
  const cardCount = $('results-card-count');
  const tbody = $('results-tbody');
  const markerClassifications = $('results-marker-classifications');
  const rosterContainer = $('results-roster');

  if (state.stageResults) {
    state.selectedResultsRaceId = state.stageResults.raceId;
    state.selectedResultsStageId = state.stageResults.stageId;
  }

  const raceList = resultsRaceList();
  raceSelect.innerHTML = '<option value="">– Rennen auswählen –</option>' + raceList
    .map((race) => `<option value="${race.id}"${race.id === state.selectedResultsRaceId ? ' selected' : ''}>${esc(race.name)}</option>`)
    .join('');

  // Durchschalt-Buttons: an den Enden der (nach Startdatum sortierten) Liste
  // deaktivieren; ohne Auswahl beide aktiv (springt an Anfang/Ende).
  const racePrevBtn = $<HTMLButtonElement>('results-race-prev');
  const raceNextBtn = $<HTMLButtonElement>('results-race-next');
  const currentRaceIndex = raceList.findIndex((race) => race.id === state.selectedResultsRaceId);
  racePrevBtn.disabled = raceList.length === 0 || currentRaceIndex === 0;
  raceNextBtn.disabled = raceList.length === 0 || (currentRaceIndex >= 0 && currentRaceIndex === raceList.length - 1);

  const selectedRace = findRaceById(state.selectedResultsRaceId);
  const stageOptions = selectedRace == null
    ? ''
    : (selectedRace.stages ?? [])
      .map((stage) => `<option value="${stage.id}"${stage.id === state.selectedResultsStageId ? ' selected' : ''}>${esc(formatResultsStageLabel(selectedRace, stage))}</option>`)
      .join('');
  stageSelect.innerHTML = '<option value="">– Etappe auswählen –</option>' + stageOptions;

  // Broadcast-Kopf: Rennname als Titel + Kategorie-Pill (aus dem gewaehlten Rennen)
  const raceTitleEl = $('results-race-title');
  const categoryPillEl = $('results-category-pill');
  const headerRaceName = state.stageResults?.raceName
    ?? state.resultsRoster?.raceName
    ?? selectedRace?.name
    ?? null;
  raceTitleEl.textContent = headerRaceName ?? 'Results';
  const headerCategory = selectedRace?.category?.name ?? null;
  if (headerCategory) {
    categoryPillEl.textContent = headerCategory.replace(/^world\s*tour\s*-\s*/i, '');
    categoryPillEl.classList.remove('hidden');
  } else {
    categoryPillEl.textContent = '';
    categoryPillEl.classList.add('hidden');
  }

  const visibleClassifications = state.stageResults?.classifications.filter(c => {
    if (selectedRace && !selectedRace.isStageRace && c.resultTypeId !== 1 && c.resultTypeId !== 6) {
      return false;
    }
    return true;
  }) ?? [];

  const selectedClassification = visibleClassifications.find(
    (classification) => classification.resultTypeId === state.selectedResultTypeId,
  ) ?? visibleClassifications[0] ?? null;
  const showNonFinishers = state.selectedResultsSpecialView === 'nonFinishers';
  const showEvents = state.selectedResultsSpecialView === 'events';
  const showRoster = state.selectedResultsSpecialView === 'roster';
  if (selectedClassification && !showNonFinishers && !showEvents && !showRoster) {
    state.selectedResultTypeId = selectedClassification.resultTypeId;
  }

  if ((!state.stageResults && !showRoster) || (!selectedClassification && !showNonFinishers && !showEvents && !showRoster)) {
    const selectedStage = findStageById(state.selectedResultsStageId);
    meta.textContent = selectedStage
      ? `${selectedStage.stage.profile} · ${formatDate(selectedStage.stage.date)}`
      : 'Noch keine Etappe ausgewählt.';
    tabs.innerHTML = '';
    markerTabs.innerHTML = '';
    markerTabs.classList.add('hidden');
    tbody.innerHTML = '';
    markerClassifications.innerHTML = '';
    markerClassifications.classList.add('hidden');
    tableCard.classList.add('hidden');
    rosterContainer.innerHTML = '';
    rosterContainer.classList.add('hidden');
    empty.classList.remove('hidden');
    empty.textContent = state.selectedResultsStageId != null
      ? 'Für diese Etappe liegen noch keine Ergebnisse vor.'
      : 'Noch keine Ergebnisse geladen.';
    return;
  }

  // Roster can be shown without stageResults
  if (showRoster) {
    if (state.resultsRoster) {
      meta.textContent = 'Starterfeld';
    }
    // Roster rendering handled after tab setup below
  } else if (state.stageResults) {
    meta.textContent = `Etappe ${state.stageResults.stageNumber} · ${state.stageResults.profile} · ${formatDate(state.stageResults.date)}`;
  }

  const resultStage = state.stageResults ? findStageById(state.stageResults.stageId) : null;
  const stageDistanceKm = resultStage?.stage.distanceKm ?? null;

  const stagePointsMap = new Map<number, number>();
  const stageMountainPointsMap = new Map<number, number>();
  const stageBreakawayKmsMap = new Map<number, number>();

  if (state.stageResults) {
    const stageResultClassification = state.stageResults.classifications.find(c => c.resultTypeId === 1);
    if (stageResultClassification) {
      for (const r of stageResultClassification.rows) {
        if (r.riderId != null && r.points != null && r.points > 0) {
          stagePointsMap.set(r.riderId, r.points);
        }
        if (r.riderId != null && r.breakawayKms != null && r.breakawayKms > 0) {
          stageBreakawayKmsMap.set(r.riderId, r.breakawayKms);
        }
      }
    }
    if (state.stageResults.markerClassifications) {
      for (const mc of state.stageResults.markerClassifications) {
        if (isMountainClassificationMarkerType(mc.markerType, mc.markerCategory)) {
          for (const entry of mc.entries) {
            if (entry.riderId != null && entry.pointsAwarded != null && entry.pointsAwarded > 0) {
              const current = stageMountainPointsMap.get(entry.riderId) ?? 0;
              stageMountainPointsMap.set(entry.riderId, current + entry.pointsAwarded);
            }
          }
        }
      }
    }
  }

  const isGcClassification = selectedClassification?.resultTypeId === GC_RESULT_TYPE_ID;
  const isPointsLikeClassification = selectedClassification?.resultTypeId === POINTS_RESULT_TYPE_ID
    || selectedClassification?.resultTypeId === MOUNTAIN_RESULT_TYPE_ID;
  const isYouthClassification = selectedClassification?.resultTypeId === 5;
  const isTeamClassification = selectedClassification?.resultTypeId === 6;
  const isBreakawayClassification = selectedClassification?.resultTypeId === 7;
  const showTrendColumn = isGcClassification || isPointsLikeClassification || isYouthClassification || isTeamClassification || isBreakawayClassification;

  // ---- Broadcast-Grid-Helfer (Ergebnis-Tabelle als Grid statt <table>) ----
  const RMONO = "font-family:'JetBrains Mono',monospace";
  const gridRank = (rank: number): string => {
    const color = rank === 1 ? '#fbbf24' : rank === 2 ? '#cbd5e1' : rank === 3 ? '#d08b5b' : '#9fb0c9';
    return `<span style="text-align:center;${RMONO};font-size:15px;font-weight:800;color:${color};">${rank}</span>`;
  };
  const cCenter = (h: string): string => `<span style="display:flex;justify-content:center;align-items:center;min-width:0;">${h}</span>`;
  const cRight = (h: string): string => `<span style="text-align:right;${RMONO};font-size:12px;color:#e2e8f0;justify-self:end;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${h}</span>`;
  const cTeam = (h: string): string => `<span style="${RMONO};font-size:11px;color:#9fb0c9;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${h}</span>`;
  const hSpan = (label: string, align: 'l' | 'c' | 'r' = 'l'): string =>
    `<span style="${align === 'c' ? 'text-align:center;' : align === 'r' ? 'text-align:right;' : ''}">${label}</span>`;

  let resultsCols: string;
  if (showNonFinishers) {
    resultsCols = '52px 84px 44px minmax(140px,1fr) 40px minmax(110px,.7fr) minmax(150px,1fr)';
  } else if (showEvents) {
    resultsCols = '96px 236px 1fr';
  } else if (isGcClassification) {
    resultsCols = '50px 46px 44px minmax(150px,1fr) 40px minmax(110px,.8fr) 82px 82px 96px 54px';
  } else if (isPointsLikeClassification || isBreakawayClassification) {
    resultsCols = '50px 52px 44px minmax(150px,1fr) 40px minmax(110px,.8fr) 100px 54px';
  } else if (isTeamClassification) {
    resultsCols = '50px 52px 44px minmax(150px,1fr) 40px 82px 82px 54px';
  } else {
    resultsCols = `50px ${showTrendColumn ? '52px ' : ''}44px minmax(150px,1fr) 40px minmax(110px,.8fr) 82px 82px 96px 54px`;
  }
  const rowBase = `display:grid;grid-template-columns:${resultsCols};gap:9px;align-items:center;padding:10px 16px;border-top:1px solid #14203a;`;

  const resultTypeButtons = visibleClassifications.map((classification) => `
    <button
      type="button"
      class="results-type-btn${!showNonFinishers && !showEvents && !showRoster && classification.resultTypeId === state.selectedResultTypeId ? ' active' : ''}"
      data-result-type-id="${classification.resultTypeId}"
    >${esc(classification.resultTypeName)}</button>
  `);
  const nonFinishersButton = `
    <button
      type="button"
      class="results-type-btn${showNonFinishers ? ' active' : ''}"
      data-results-special-view="${RESULTS_NON_FINISHERS_KEY}"
    >OTL/DNF</button>
  `;
  const eventsButton = `
    <button
      type="button"
      class="results-type-btn${showEvents ? ' active' : ''}"
      data-results-special-view="${RESULTS_EVENTS_KEY}"
    >Ereignisse</button>
  `;
  const rosterButton = `
    <button
      type="button"
      class="results-type-btn${showRoster ? ' active' : ''}"
      data-results-special-view="${RESULTS_ROSTER_KEY}"
    >Teilnehmer</button>
  `;
  const teamButtonIndex = visibleClassifications.findIndex((classification) => classification.resultTypeName.toLocaleLowerCase('de').includes('team'));
  if (teamButtonIndex >= 0) {
    resultTypeButtons.splice(teamButtonIndex + 1, 0, nonFinishersButton, eventsButton, rosterButton);
  } else {
    resultTypeButtons.push(nonFinishersButton, eventsButton, rosterButton);
  }
  tabs.innerHTML = resultTypeButtons.join('');

  const stageMarkerClassifications = sortStageMarkerClassifications(state.stageResults?.markerClassifications ?? []);

  // Show roster view if requested
  if (showRoster) {
    rosterContainer.innerHTML = renderRaceRoster();
    rosterContainer.classList.remove('hidden');
    tableCard.classList.add('hidden');
    markerTabs.innerHTML = '';
    markerTabs.classList.add('hidden');
    markerClassifications.innerHTML = '';
    markerClassifications.classList.add('hidden');
    empty.classList.add('hidden');
    return;
  } else {
    rosterContainer.innerHTML = '';
    rosterContainer.classList.add('hidden');
  }
  const showMarkerTabs = !showNonFinishers && !showEvents && !showRoster && selectedClassification?.resultTypeId === 1 && stageMarkerClassifications.length > 0;
  const selectedStageSubViewKey = showMarkerTabs
    ? (state.selectedResultsMarkerKey ?? RESULTS_STAGE_OVERVIEW_KEY)
    : null;
  const selectedMarkerClassification = showMarkerTabs && selectedStageSubViewKey !== RESULTS_STAGE_OVERVIEW_KEY
    ? stageMarkerClassifications.find((classification) => classification.markerKey === selectedStageSubViewKey) ?? null
    : null;
  if (showMarkerTabs) {
    state.selectedResultsMarkerKey = selectedMarkerClassification?.markerKey ?? RESULTS_STAGE_OVERVIEW_KEY;
  }
  if (showEvents) {
    const filters = [
      { key: 'all', label: 'Alle' },
      { key: 'form', label: 'Tagesform' },
      { key: 'attack', label: 'Attacken' },
      { key: 'breakaway', label: 'Fluchtgruppe' },
      { key: 'incident', label: 'Stürze/Defekte' },
      { key: 'exit', label: 'Ausgeschieden' },
      { key: 'home', label: 'Heimvorteil' },
      { key: 'weather', label: 'Wetter' },
      { key: 'superteam', label: 'Superteam' },
    ];
    markerTabs.innerHTML = filters.map((filter) => `
      <button
        type="button"
        class="results-type-btn${filter.key === selectedEventFilter ? ' active' : ''}"
        data-event-filter="${filter.key}"
      >${esc(filter.label)}</button>
    `).join('');
  } else {
    markerTabs.innerHTML = showMarkerTabs
      ? [`
        <button
          type="button"
          class="results-type-btn${state.selectedResultsMarkerKey === RESULTS_STAGE_OVERVIEW_KEY ? ' active' : ''}"
          data-marker-key="${RESULTS_STAGE_OVERVIEW_KEY}"
        >Tageswertung</button>`, ...stageMarkerClassifications.map((classification) => `
        <button
          type="button"
          class="results-type-btn${classification.markerKey === state.selectedResultsMarkerKey ? ' active' : ''}"
          data-marker-key="${classification.markerKey}"
        >${esc(resolveMarkerResultButtonLabel(classification))}</button>
      `)].join('')
      : '';
  }
  markerTabs.classList.toggle('hidden', !showEvents && !showMarkerTabs);

  const showStageOverviewTable = showNonFinishers || showEvents || !showMarkerTabs || state.selectedResultsMarkerKey === RESULTS_STAGE_OVERVIEW_KEY;

  if (showStageOverviewTable) {
    const headHtml = showNonFinishers
      ? `${hSpan('Et.', 'c')}${hSpan('Status', 'c')}${hSpan('Trikot', 'c')}${hSpan('Fahrer')}${hSpan('Land', 'c')}${hSpan('Team')}${hSpan('Grund')}`
      : showEvents
      ? `${hSpan('km Marke')}${hSpan('Fahrer')}${hSpan('Ereignis')}`
      : isGcClassification
      ? `${hSpan('Pl.', 'c')}${hSpan('GC', 'c')}${hSpan('Trikot', 'c')}${hSpan('Fahrer / Team')}${hSpan('Land', 'c')}${hSpan('Team')}${hSpan('Zeit', 'r')}${hSpan('Rückstand', 'r')}${hSpan('Punkte', 'r')}${hSpan('UCI', 'r')}`
      : isPointsLikeClassification
      ? `${hSpan('Pl.', 'c')}${hSpan('Trend', 'c')}${hSpan('Trikot', 'c')}${hSpan('Fahrer / Team')}${hSpan('Land', 'c')}${hSpan('Team')}${hSpan('Punkte', 'r')}${hSpan('UCI', 'r')}`
      : isBreakawayClassification
      ? `${hSpan('Pl.', 'c')}${hSpan('Trend', 'c')}${hSpan('Trikot', 'c')}${hSpan('Fahrer / Team')}${hSpan('Land', 'c')}${hSpan('Team')}${hSpan('Kilometer', 'r')}${hSpan('UCI', 'r')}`
      : isTeamClassification
      ? `${hSpan('Pl.', 'c')}${hSpan('Trend', 'c')}${hSpan('Trikot', 'c')}${hSpan('Team')}${hSpan('Land', 'c')}${hSpan('Zeit', 'r')}${hSpan('Rückstand', 'r')}${hSpan('UCI', 'r')}`
      : `${hSpan('Pl.', 'c')}${showTrendColumn ? hSpan('Trend', 'c') : ''}${hSpan('Trikot', 'c')}${hSpan('Fahrer / Team')}${hSpan('Land', 'c')}${hSpan('Team')}${hSpan('Zeit', 'r')}${hSpan('Rückstand', 'r')}${hSpan('Punkte', 'r')}${hSpan('UCI', 'r')}`;
    gridHead.style.gridTemplateColumns = resultsCols;
    gridHead.innerHTML = headHtml;

    // Karten-Kopf: Titel + Anzahl
    const stageLabel = state.stageResults ? `Etappe ${state.stageResults.stageNumber}` : '';
    const cardTitleText = showNonFinishers
      ? 'Nicht im Ziel · OTL / DNF'
      : showEvents
      ? 'Renn-Ereignisse'
      : `${selectedClassification?.resultTypeName ?? 'Ergebnis'}${stageLabel ? ` · ${stageLabel}` : ''}`;
    let cardCountN = 0;
    if (showNonFinishers) cardCountN = state.stageResults?.nonFinishers?.length ?? 0;
    else if (showEvents) cardCountN = state.stageResults?.events?.length ?? 0;
    else cardCountN = selectedClassification?.rows.length ?? 0;
    cardTitle.textContent = cardTitleText;
    cardCount.textContent = showEvents ? `${cardCountN} Ereignisse` : `${cardCountN} ${showNonFinishers ? 'Fahrer' : 'Fahrer'}`;
  }

  tbody.innerHTML = showNonFinishers
    ? (state.stageResults?.nonFinishers ?? []).map((row) => `
      <div style="${rowBase}">
        <span style="text-align:center;${RMONO};font-size:12px;color:#9fb0c9;">${row.stageNumber}</span>
        ${cCenter(renderNonFinisherStatusBadge(row.isOtl))}
        ${cCenter(renderResultsJerseyColumn(row.teamId, row.teamName))}
        <span style="min-width:0;overflow:hidden;">${renderResultsParticipant(row.riderName, true, false, row.riderId, row.teamId)}</span>
        ${cCenter(renderResultsFlagColumn(row.countryCode))}
        ${cTeam(renderTeamNameLink(row.teamName || '–', row.teamId))}
        <span style="${RMONO};font-size:11px;color:#8494ad;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(formatNonFinisherReason(row.statusReason, row.isOtl))}</span>
      </div>
    `).join('') || '<div style="padding:20px;text-align:center;color:#6a7a95;font-size:13px;">Keine OTL/DNF bis zu dieser Etappe.</div>'
    : showEvents
    ? [...(state.stageResults?.events ?? [])]
      .filter((row) => {
        if (selectedEventFilter === 'all') {
          return true;
        }
        if (selectedEventFilter === 'form') {
          return !!(row.title && (row.title.includes('guten Tag') || row.title.includes('schlechten Tag') || row.title.includes('Formhöhepunkt') || row.title.includes('Formhoehepunkt')));
        }
        if (selectedEventFilter === 'attack') {
          return (row.type === 'attack' || row.type === 'counter_attack') && !(row.title && (row.title.toLowerCase().includes('ausreiß') || row.title.toLowerCase().includes('ausreiss')));
        }
        if (selectedEventFilter === 'breakaway') {
          return !!(row.title && (row.title.toLowerCase().includes('ausreiß') || row.title.toLowerCase().includes('ausreiss')));
        }
        if (selectedEventFilter === 'incident') {
          return (row.type === 'incident' || !!(row.title && row.title.includes('Massensturz'))) && !(row.title && (row.title.toLowerCase().includes('ausreiß') || row.title.toLowerCase().includes('ausreiss')));
        }
        if (selectedEventFilter === 'exit') {
          return row.type === 'dnf' || !!(row.title && row.title.includes('nicht am Start'));
        }
        if (selectedEventFilter === 'home') {
          return !!(row.title && (row.title.includes('Heimvorteil') || row.title.includes('Heimdruck')));
        }
        if (selectedEventFilter === 'weather') {
          return !!(row.title && row.title.startsWith('Wetterbericht:'));
        }
        if (selectedEventFilter === 'superteam') {
          return row.type === 'superteam';
        }
        return true;
      })
      .sort((a, b) => {
        const kmA = a.kmMark ?? 0;
        const kmB = b.kmMark ?? 0;
        if (Math.abs(kmA - kmB) > 0.0001) {
          return kmA - kmB;
        }
        if (kmA === 0) {
          const prioA = getKmZeroEventPriority(a);
          const prioB = getKmZeroEventPriority(b);
          if (prioA !== prioB) {
            return prioA - prioB;
          }
        }
        const nameA = a.riderName ?? '';
        const nameB = b.riderName ?? '';
        return nameA.localeCompare(nameB, 'de');
      }).map((row) => {
        const kmFormatted = row.kmMark != null ? `${row.kmMark.toFixed(1).replace('.', ',')} km` : '0,0 km';
        const riderId = row.riderId;
        const riderObj = riderId != null ? findRiderById(riderId) : null;
        const teamId = row.riderTeamId ?? riderObj?.activeTeamId ?? null;
        const teamName = teamId != null ? (state.teams.find((t) => t.id === teamId)?.name ?? null) : null;

        let jerseyHtml = renderResultsJerseyColumn(teamId, teamName);
        const isWeatherReport = !!(row.title && row.title.startsWith('Wetterbericht:'));
        let eventTitle = row.title || '';
        if (isWeatherReport) {
          const weatherId = state.stageResults?.rolledWeatherId;
          const weatherName = state.stageResults?.rolledWetterName;
          jerseyHtml = `<span class="results-jersey-cell">${renderWeatherIcon(weatherId, weatherName)}</span>`;
          if (weatherName) {
            eventTitle = `Wetterbericht: ${weatherName}`;
          }
        }
        const isSuperteam = row.type === 'superteam';
        const isSuperTeamTeamEvent = isSuperteam && riderId == null;
        const flagHtml = (isWeatherReport || isSuperTeamTeamEvent) ? '' : renderResultsFlagColumn(riderId != null ? resolveRiderCountryCode(riderId) : null);
        const riderHtml = isWeatherReport ? '' : (isSuperTeamTeamEvent ? renderTeamNameLink(teamName || '–', teamId) : (riderId != null ? renderResultsParticipant(row.riderName ?? '', true, false, riderId, teamId) : esc(row.riderName || '–')));

        let badgeHtml = '';
        if (row.title && row.title.includes('guten Tag')) {
          badgeHtml = `<span class="event-badge event-badge-superform"><span class="event-icon">▲</span> Guten Tag</span>`;
        } else if (row.title && row.title.includes('schlechten Tag')) {
          badgeHtml = `<span class="event-badge event-badge-supermalus"><span class="event-icon">▼</span> Schlechten Tag</span>`;
        } else if (row.title && (row.title.includes('Formhöhepunkt') || row.title.includes('Formhoehepunkt'))) {
          badgeHtml = `<span class="event-badge event-badge-peak"><span class="event-icon">★</span> Formhöhepunkt</span>`;
        } else if (row.title && row.title.includes('nicht am Start')) {
          badgeHtml = `<span class="event-badge event-badge-dns">DNS</span>`;
        } else if (row.title && row.title.includes('Massensturz')) {
          badgeHtml = `<span class="event-badge event-badge-masscrash">Massensturz</span>`;
        } else if (row.type === 'dnf') {
          badgeHtml = `<span class="event-badge event-badge-dnf">DNF</span>`;
        } else if (row.title && (row.title.toLowerCase().includes('ausreiß') || row.title.toLowerCase().includes('ausreiss'))) {
          badgeHtml = `<span class="event-badge event-badge-breakaway">Fluchtgruppe</span>`;
        } else if (row.type === 'attack') {
          badgeHtml = `<span class="event-badge event-badge-attack">Attacke</span>`;
        } else if (row.type === 'counter_attack') {
          badgeHtml = `<span class="event-badge event-badge-counter">Konterattacke</span>`;
        } else if (row.type === 'incident') {
          const isDefect = row.title && (row.title.toLowerCase().includes('defekt') || row.title.toLowerCase().includes('panne') || row.title.toLowerCase().includes('technisch'));
          if (isDefect) {
            badgeHtml = `<span class="event-badge event-badge-defect">Defekt</span>`;
          } else {
            badgeHtml = `<span class="event-badge event-badge-crash">Sturz</span>`;
          }
        } else if (row.title && row.title.includes('Super-Heimvorteil')) {
          badgeHtml = `<span class="event-badge event-badge-superhome"><span class="event-icon">♥</span> Heimbonus</span>`;
        } else if (row.title && row.title.includes('Heimdruck')) {
          badgeHtml = `<span class="event-badge event-badge-homepressure"><span class="event-icon">♦</span> Heimmalus</span>`;
        } else if (row.title && row.title.includes('Heimvorteil')) {
          badgeHtml = `<span class="event-badge event-badge-normalhome"><span class="event-icon">♥</span> Heimvorteil</span>`;
        } else if (row.title && row.title.startsWith('Wetterbericht:')) {
          badgeHtml = `<span class="event-badge event-badge-weather"><span class="event-icon">🌤️</span> Wetter</span>`;
        } else if (isSuperteam) {
          badgeHtml = `<span class="event-badge event-badge-superteam"><span class="event-icon">⚡</span> Superteam</span>`;
        }

        return `
          <div style="display:grid;grid-template-columns:${resultsCols};gap:12px;align-items:center;padding:11px 16px;border-top:1px solid #14203a;">
            <span style="${RMONO};font-size:12px;color:#22d3ee;">${kmFormatted}</span>
            <div class="event-rider-info">
              ${jerseyHtml}
              ${flagHtml}
              ${riderHtml}
            </div>
            <div class="event-content">
              <div class="event-title-wrapper">
                <span class="event-title">${formatEventTextWithAllRiders(eventTitle)}</span>
                ${badgeHtml}
              </div>
              ${row.detail ? `<div class="event-detail">${formatEventTextWithAllRiders(row.detail)}</div>` : ''}
            </div>
          </div>`;
      }).join('') || '<div style="padding:20px;text-align:center;color:#6a7a95;font-size:13px;">Keine Ereignisse für diese Etappe.</div>'
    : showStageOverviewTable && selectedClassification
    ? (() => {
        const rows = selectedClassification.rows;
        // Regierender Weltmeister (Strassen-WM = Regenbogentrikot) fuer den
        // kleinen Marker hinter den Punkten (nur Stage- und GC-Wertung).
        const worldChampionRiderId = state.seasonStandings?.reigningChampions
          ?.find((c) => c.type === 'WM' && c.discipline === 'ROAD')?.riderId ?? null;
        const worldChampionBadge = '<span title="Regierender Weltmeister" style="display:inline-block;width:16px;height:11px;margin-left:5px;border-radius:2px;vertical-align:middle;background:#fff;background-image:linear-gradient(#0d6bb0 0 20%,#00a3e0 20% 40%,#c8102e 40% 60%,#ffd200 60% 80%,#009639 80% 100%);border:1px solid rgba(0,0,0,.25);"></span>';
        return rows.map((row) => {
          const participant = row.riderName ?? row.teamName;
          const teamName = row.riderName ? row.teamName : '–';
          const jerseyCell = renderResultsJerseyColumn(row.teamId, row.teamName);
          const participantCell = renderResultsParticipant(participant, true, row.isBreakaway === true, row.riderId, row.teamId);
          const flagCell = renderResultsFlagColumn(resolveRiderCountryCode(row.riderId));
          const showAverageSpeed = selectedClassification.resultTypeId === 1 && row.rank === 1 && row.timeSeconds != null && stageDistanceKm != null;
          const timeCell = row.timeSeconds != null
            ? `${formatRaceTime(row.timeSeconds)}${showAverageSpeed ? ` (${formatAverageSpeed(stageDistanceKm, row.timeSeconds)})` : ''}`
            : '–';
      const trendCell = showTrendColumn ? cCenter(renderRankDelta(row.previousRank, row.rankDelta)) : '';
      const podium = row.rank === 1 ? 'box-shadow:inset 3px 0 0 #fbbf24;background:linear-gradient(90deg,rgba(251,191,36,.08),transparent 55%);'
        : row.rank === 2 ? 'box-shadow:inset 3px 0 0 #cbd5e1;background:linear-gradient(90deg,rgba(203,213,225,.07),transparent 55%);'
        : row.rank === 3 ? 'box-shadow:inset 3px 0 0 #d08b5b;background:linear-gradient(90deg,rgba(208,139,91,.08),transparent 55%);' : '';
      const participantWithDots = `<span style="display:flex;align-items:center;gap:6px;min-width:0;overflow:hidden;">${participantCell}${renderLeaderDots(row.riderId)}</span>`;
      const gapCell = `<span style="text-align:right;${RMONO};font-size:12px;color:#8494ad;justify-self:end;">${esc(formatRaceGap(row.gapSeconds))}</span>`;
      const uciCell = `<span style="text-align:right;${RMONO};font-size:11px;color:#6a7a95;justify-self:end;">${row.uciPoints != null ? row.uciPoints : '–'}</span>`;
      const valueCell = (h: string): string => `<span style="text-align:right;${RMONO};font-size:13px;font-weight:700;color:#e2e8f0;justify-self:end;">${h}</span>`;
      if (isPointsLikeClassification) {
        let pointsHtml = row.points != null ? String(row.points) : '–';
        if (row.points != null && row.riderId != null && selectedClassification) {
          const isPoints = selectedClassification.resultTypeId === POINTS_RESULT_TYPE_ID;
          const stagePoints = isPoints ? (stagePointsMap.get(row.riderId) ?? 0) : (stageMountainPointsMap.get(row.riderId) ?? 0);
          if (stagePoints > 0) {
            pointsHtml += ` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${stagePoints}</span>`;
          }
        }
        return `
          <div style="${rowBase}${podium}">
            ${gridRank(row.rank)}${trendCell}${cCenter(jerseyCell)}${participantWithDots}${cCenter(flagCell)}${cTeam(renderTeamNameLink(teamName, row.teamId))}${valueCell(pointsHtml)}${uciCell}
          </div>`;
      }
      if (isBreakawayClassification) {
        let kmsHtml = row.breakawayKms != null ? `${row.breakawayKms.toFixed(1).replace('.', ',')} km` : '–';
        if (row.breakawayKms != null && row.riderId != null) {
          const stageKms = stageBreakawayKmsMap.get(row.riderId) ?? 0;
          if (stageKms > 0) {
            kmsHtml += ` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${stageKms.toFixed(1).replace('.', ',')} km</span>`;
          }
        }
        return `
          <div style="${rowBase}${podium}">
            ${gridRank(row.rank)}${trendCell}${cCenter(jerseyCell)}${participantWithDots}${cCenter(flagCell)}${cTeam(renderTeamNameLink(teamName, row.teamId))}${valueCell(kmsHtml)}${uciCell}
          </div>`;
      }
      if (isTeamClassification) {
        return `
          <div style="${rowBase}${podium}">
            ${gridRank(row.rank)}${trendCell}${cCenter(jerseyCell)}${cTeam(renderTeamNameLink(row.teamName, row.teamId))}${cCenter(flagCell)}${cRight(timeCell)}${gapCell}${uciCell}
          </div>`;
      }
      let pointsCellContent = row.points != null ? String(row.points) : '–';
      if (row.leadoutBonus != null && row.leadoutBonus > 0 && row.leadoutRiderId != null) {
        const popoverHtml = renderLeadoutPopover(row);
        pointsCellContent = `<span class="leadout-bonus-anchor">${row.points != null ? row.points : '–'}${popoverHtml}</span>`;
      }
      // Regenbogen-Marker des regierenden Weltmeisters — nur in Stage- und
      // GC-Wertung, direkt hinter den Punkten.
      if (worldChampionRiderId != null && row.riderId === worldChampionRiderId
        && (selectedClassification?.resultTypeId === 1 || selectedClassification?.resultTypeId === GC_RESULT_TYPE_ID)) {
        pointsCellContent += worldChampionBadge;
      }

          return `
            <div style="${rowBase}${podium}">
              ${gridRank(row.rank)}${trendCell}${cCenter(jerseyCell)}${participantWithDots}${cCenter(flagCell)}${cTeam(renderTeamNameLink(teamName, row.teamId))}${cRight(timeCell)}${gapCell}${valueCell(pointsCellContent)}${uciCell}
            </div>`;
        }).join('');
      })()
    : '';

  empty.classList.toggle('hidden', !!selectedClassification || showNonFinishers || showEvents || showRoster);
  tableCard.classList.toggle('hidden', !showStageOverviewTable || showRoster);

  if (selectedMarkerClassification) {
    const headerHtml = `
      <section class="results-marker-card">
        <div class="results-results-view-marker-card-head">
          <h4>${esc(formatMarkerLabel(selectedMarkerClassification.markerType, selectedMarkerClassification.markerLabel))}</h4>
          <div class="results-marker-card-meta">${esc(`${selectedMarkerClassification.kmMark.toFixed(1).replace('.', ',')} km${selectedMarkerClassification.markerCategory ? ` · Kat. ${selectedMarkerClassification.markerCategory}` : ''}`)}</div>
        </div>
      </section>`;

    const entries = selectedMarkerClassification.entries;

    const rowsHtml = entries.map((entry) => {
      const rider = findRiderById(entry.riderId);
      const riderName = rider ? `${rider.firstName} ${rider.lastName}` : `Fahrer ${entry.riderId}`;
      const teamName = rider?.activeTeamId != null
        ? state.teams.find((team) => team.id === rider.activeTeamId)?.name ?? null
        : null;
      return `
        <div class="results-marker-row">
          <div class="results-marker-rank">${entry.rank}.</div>
          <div class="results-marker-jersey">${renderResultsJerseyColumn(rider?.activeTeamId, teamName)}</div>
          <div class="results-marker-name">${renderResultsParticipant(riderName, false, false, rider?.id ?? null, rider?.activeTeamId ?? null)}</div>
          <div class="results-marker-flag">${renderResultsFlagColumn(resolveRiderCountryCode(rider?.id))}</div>
          <div class="results-marker-time">${esc(formatRaceTime(entry.crossingTimeSeconds))}</div>
          <div class="results-marker-gap">${esc(formatRaceGap(entry.gapSeconds))}</div>
          <div class="results-marker-points">${entry.pointsAwarded != null && entry.pointsAwarded > 0 ? entry.pointsAwarded : '–'}</div>
        </div>`;
    }).join('');

    markerClassifications.innerHTML = `${headerHtml}<div class="results-marker-list">${rowsHtml}</div>`;
  } else {
    markerClassifications.innerHTML = '';
  }
  markerClassifications.classList.toggle('hidden', !selectedMarkerClassification);
}

export function initResultsListeners(): void {

  $('results-race-select').addEventListener('change', (e) => {
    const val = (e.target as HTMLSelectElement).value;
    state.selectedResultsRaceId = val ? Number(val) : null;
    const race = findRaceById(state.selectedResultsRaceId);
    state.selectedResultsStageId = race?.stages?.[0]?.id ?? null;
    state.selectedResultTypeId = 1;
    state.selectedResultsMarkerKey = RESULTS_STAGE_OVERVIEW_KEY;
    state.selectedResultsSpecialView = null;
    state.stageResults = null;
    renderResultsView();
    if (state.selectedResultsStageId != null) {
      void loadStageResults(state.selectedResultsStageId, true);
    }
  });

  $('results-race-prev').addEventListener('click', () => navigateResultsRace(-1));
  $('results-race-next').addEventListener('click', () => navigateResultsRace(1));

  $('results-stage-select').addEventListener('change', (e) => {
    const val = (e.target as HTMLSelectElement).value;
    state.selectedResultsStageId = val ? Number(val) : null;
    state.selectedResultTypeId = 1;
    state.selectedResultsMarkerKey = RESULTS_STAGE_OVERVIEW_KEY;
    state.selectedResultsSpecialView = null;
    state.stageResults = null;
    renderResultsView();
    if (state.selectedResultsStageId != null) {
      void loadStageResults(state.selectedResultsStageId, true);
    }
  });

  $('results-type-tabs').addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-result-type-id]');
    if (button) {
      state.selectedResultsSpecialView = null;
      state.selectedResultTypeId = Number(button.dataset['resultTypeId']);
      renderResultsView();
      return;
    }

    const specialButton = (event.target as Element).closest<HTMLButtonElement>('button[data-results-special-view]');
    if (specialButton) {
      const special = specialButton.dataset['resultsSpecialView'];
      if (special === RESULTS_NON_FINISHERS_KEY) {
        state.selectedResultsSpecialView = 'nonFinishers';
        renderResultsView();
      } else if (special === RESULTS_EVENTS_KEY) {
        state.selectedResultsSpecialView = 'events';
        selectedEventFilter = 'all';
        renderResultsView();
      } else if (special === RESULTS_ROSTER_KEY) {
        state.selectedResultsSpecialView = 'roster';
        // If roster not loaded yet for this race, fetch it
        if (state.selectedResultsRaceId != null && state.resultsRoster?.raceId !== state.selectedResultsRaceId) {
          void loadRaceRoster(state.selectedResultsRaceId).then(() => renderResultsView());
        }
        renderResultsView();
      }
    }
  });

  $('results-marker-tabs').addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-marker-key]');
    if (button) {
      const key = button.dataset['markerKey'];
      state.selectedResultsMarkerKey = key ?? RESULTS_STAGE_OVERVIEW_KEY;
      renderResultsView();
      return;
    }

    const filterButton = (event.target as Element).closest<HTMLButtonElement>('button[data-event-filter]');
    if (filterButton) {
      const filter = filterButton.dataset['eventFilter'];
      selectedEventFilter = filter ?? 'all';
      renderResultsView();
    }
  });
}
