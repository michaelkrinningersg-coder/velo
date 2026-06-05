import { api } from './api';
import {
  buildRaceCategoryBadgeCssVariables,
  renderRiderNameLink,
  resolveRaceCategoryBadgeStyle,
} from './riderStatsUi';
import type {
  GameStatus,
  GameState,
  ParsedStageSummary,
  StageResultCommitResponse,
  PrecalculatedRaceIncident,
  PendingStage,
  RaceRosterEditorPayload,
  RealtimeSimulationBootstrap,
  RiderStatsPayload,
  RiderTeamEditorPayload,
  RiderTeamEditorRiderRow,
  RiderTeamEditorTeamSummary,
  SeasonStandingCountryRow,
  SavegameMeta,
  SeasonStandingsPayload,
  Team,
  Rider,
  Race,
  RaceProgramParticipant,
  RiderProgramRaceSummary,
  Stage,
  StageClassification,
  StageFinishMarkerType,
  StageMarker,
  StageEditorClimb,
  StageEditorDraft,
  StageEditorExistingStageOption,
  StageEditorStageOverviewRow,
  StageEditorClimbOverviewRow,
  StageEditorSegment,
  StageEditorMetadata,
  StageEditorWaypoint,
  StageMarkerClassification,
  StageMarkerCategory,
  StageMarkerType,
  StageProfile,
  RealtimeStageCommitEntry,
  StageResultsPayload,
  StageTerrain,
} from '../../shared/types';
import { RaceSimView } from './race-sim/RaceSimView';
import type { SimulationSnapshot } from './race-sim/SimulationEngine';
import { runInstantSimulation } from './race-sim/runInstantSimulation';
import { renderStaticStageProfile } from './race-sim/renderProfile';

// ============================================================
//  State
// ============================================================

const state: {
  currentSave: SavegameMeta | null;
  gameState: GameState | null;
  gameStatus: GameStatus | null;
  races: Race[];
  riders: Rider[];
  teams: Team[];
  selectedResultsRaceId: number | null;
  selectedResultsStageId: number | null;
  selectedResultTypeId: number;
  selectedResultsMarkerKey: string | null;
  selectedResultsSpecialView: 'nonFinishers' | null;
  selectedDashboardRaceId: number | null;
  selectedRaceParticipantsRaceId: number | null;
  selectedDashboardProfileStageId: number | null;
  stageSummariesByStageId: Record<number, ParsedStageSummary | undefined>;
  stageSummaryErrorsByStageId: Record<number, string | undefined>;
  selectedRealtimeStageId: number | null;
  stageResults: StageResultsPayload | null;
  seasonStandings: SeasonStandingsPayload | null;
  selectedSeasonStandingScope: 'riders' | 'teams' | 'countries';
  teamTableSort: {
    key: TeamTableSortKey;
    direction: 'asc' | 'desc';
  };
  teamDetailPage: TeamDetailPage;
  riderMenuTableSort: {
    key: TeamTableSortKey;
    direction: 'asc' | 'desc';
  };
  riderMenuDetailPage: TeamDetailPage;
  riderMenuPage: number;
  stageEditorDraft: StageEditorDraft | null;
  stageEditorExistingStages: StageEditorExistingStageOption[];
  stageEditorExistingStagesLoaded: boolean;
  stageEditorOverviewLoaded: boolean;
  stageEditorOverviewLoading: boolean;
  stageEditorStageRows: StageEditorStageOverviewRow[];
  stageEditorClimbRows: StageEditorClimbOverviewRow[];
  stageEditorStagesSort: {
    key: StageEditorStagesSortKey;
    direction: 'asc' | 'desc';
  };
  stageEditorClimbsSort: {
    key: StageEditorClimbsSortKey;
    direction: 'asc' | 'desc';
  };
  realtimeBootstrap: RealtimeSimulationBootstrap | null;
  realtimeError: string | null;
  rosterEditor: RaceRosterEditorPayload | null;
  rosterEditorSelectedRiderIds: number[];
  raceParticipants: RaceProgramParticipant[];
  raceParticipantsSort: {
    key: RaceParticipantsSortKey;
    direction: 'asc' | 'desc';
  };
  riderStatsPayload: RiderStatsPayload | null;
  riderStatsTab: RiderStatsTab;
  riderStatsSelectedRiderId: number | null;
  riderTeamEditorPayload: RiderTeamEditorPayload | null;
  riderTeamEditorSelectedTeamKey: string;
  riderTeamEditorSort: {
    key: RiderTeamEditorSortKey;
    direction: 'asc' | 'desc';
  };
  riderTeamEditorDirtyRiderIds: number[];
  riderTeamEditorSaving: boolean;
  riderTeamEditorExporting: boolean;
} = {
  currentSave: null,
  gameState: null,
  gameStatus: null,
  races: [],
  riders: [],
  teams: [],
  selectedResultsRaceId: null,
  selectedResultsStageId: null,
  selectedResultTypeId: 1,
  selectedResultsMarkerKey: null,
  selectedResultsSpecialView: null,
  selectedDashboardRaceId: null,
  selectedRaceParticipantsRaceId: null,
  selectedDashboardProfileStageId: null,
  stageSummariesByStageId: {},
  stageSummaryErrorsByStageId: {},
  selectedRealtimeStageId: null,
  stageResults: null,
  seasonStandings: null,
  selectedSeasonStandingScope: 'riders',
  teamTableSort: {
    key: 'name',
    direction: 'asc',
  },
  teamDetailPage: 'skills',
  riderMenuTableSort: {
    key: 'name',
    direction: 'asc',
  },
  riderMenuDetailPage: 'skills',
  riderMenuPage: 1,
  stageEditorDraft: null,
  stageEditorExistingStages: [],
  stageEditorExistingStagesLoaded: false,
  stageEditorOverviewLoaded: false,
  stageEditorOverviewLoading: false,
  stageEditorStageRows: [],
  stageEditorClimbRows: [],
  stageEditorStagesSort: {
    key: 'stageId',
    direction: 'asc',
  },
  stageEditorClimbsSort: {
    key: 'placementKm',
    direction: 'asc',
  },
  realtimeBootstrap: null,
  realtimeError: null,
  rosterEditor: null,
  rosterEditorSelectedRiderIds: [],
  raceParticipants: [],
  raceParticipantsSort: {
    key: 'team',
    direction: 'asc',
  },
  riderStatsPayload: null,
  riderStatsTab: 'results',
  riderStatsSelectedRiderId: null,
  riderTeamEditorPayload: null,
  riderTeamEditorSelectedTeamKey: '',
  riderTeamEditorSort: {
    key: 'lastName',
    direction: 'asc',
  },
  riderTeamEditorDirtyRiderIds: [],
  riderTeamEditorSaving: false,
  riderTeamEditorExporting: false,
};

let raceSimView: RaceSimView | null = null;

let realtimeCompletionInFlight = false;

let instantStageInFlightId: number | null = null;

let realtimeStageLoadInFlightId: number | null = null;

const RESULTS_STAGE_OVERVIEW_KEY = '__stage_overview__';
const RESULTS_NON_FINISHERS_KEY = '__non_finishers__';

const STAGE_PROFILE_OPTIONS: StageProfile[] = [
  'Flat',
  'Rolling',
  'Hilly',
  'Hilly_Difficult',
  'Medium_Mountain',
  'Mountain',
  'High_Mountain',
  'ITT',
  'TTT',
  'Cobble',
  'Cobble_Hill',
];

const STAGE_TERRAIN_OPTIONS: StageTerrain[] = ['Flat', 'Hill', 'Medium_Mountain', 'Mountain', 'High_Mountain', 'Cobble', 'Cobble_Hill', 'Abfahrt', 'Sprint'];
const STAGE_MARKER_TYPES: StageMarkerType[] = ['start', 'climb_start', 'climb_top', 'sprint_intermediate', 'finish_flat', 'finish_TT', 'finish_hill', 'finish_mountain'];
const STAGE_MARKER_CATEGORIES: StageMarkerCategory[] = ['Sprint', '4', '3', '2', '1', 'HC'];
const STAGE_EDITOR_MIN_SEGMENT_KM = 0.2;
const STAGE_EDITOR_SPRINT_CUT_KM = 0.3;
const STAGE_EDITOR_TABLE_COLUMN_COUNT = 10;
const STAGE_EDITOR_CLIMB_MIN_GAIN_METERS = 100;
const STAGE_EDITOR_CLIMB_MIN_AVG_GRADIENT = 3;
const STAGE_EDITOR_CLIMB_BREAK_DESCENT_METERS = 50;
const STAGE_EDITOR_AUTO_DESCENT_MIN_GRADIENT = -2;
const STAGE_EDITOR_AUTO_DESCENT_MIN_DISTANCE_KM = 1;
const STAGE_EDITOR_AUTO_FLAT_MAX_GRADIENT = 2.5;
const STAGE_EDITOR_AUTO_DESCENT_STRONG_GRADIENT = -3;
const STAGE_EDITOR_SEGMENT_MIN_HILL_GAIN_METERS = 15;
const STAGE_EDITOR_AUTO_MEDIUM_MIN_GAIN_METERS = 200;
const STAGE_EDITOR_AUTO_MOUNTAIN_MIN_GAIN_METERS = 600;
const STAGE_EDITOR_AUTO_MOUNTAIN_MIN_TOP_METERS = 850;

function isFinishMarkerType(markerType: StageMarkerType): markerType is StageFinishMarkerType {
  return ['finish_flat', 'finish_TT', 'finish_hill', 'finish_mountain'].includes(markerType);
}

function isMountainFinishMarkerType(markerType: StageMarkerType): markerType is Extract<StageFinishMarkerType, 'finish_hill' | 'finish_mountain'> {
  return markerType === 'finish_hill' || markerType === 'finish_mountain';
}

function hasClimbMarkerCategory(category: StageMarkerCategory | null | undefined): category is Exclude<StageMarkerCategory, 'Sprint'> {
  return category != null && ['HC', '1', '2', '3', '4'].includes(category);
}

function isMountainClassificationMarkerType(markerType: StageMarkerType, markerCategory: StageMarkerCategory | null | undefined): boolean {
  return markerType === 'climb_top' || (isMountainFinishMarkerType(markerType) && hasClimbMarkerCategory(markerCategory));
}

// ============================================================
//  DOM-Helpers
// ============================================================

function $<T extends HTMLElement = HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function esc(str: unknown): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatRaceTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const mm = String(minutes).padStart(2, '0');
  const ss = String(remainingSeconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${minutes}:${ss}`;
}

function formatRaceGap(seconds: number | null): string {
  if (seconds == null) return 'Ã¢â‚¬â€œ';
  if (seconds === 0) return 'Ã¢â‚¬â€';
  return `+${formatRaceTime(seconds)}`;
}

const GC_RESULT_TYPE_ID = 2;
const POINTS_RESULT_TYPE_ID = 3;
const MOUNTAIN_RESULT_TYPE_ID = 4;

function resolveTeamJerseyAssetPath(teamId: number): string {
  return `/jersey/Jer_${teamId}.png`;
}

function renderMiniJersey(teamId: number | null | undefined, teamName: string | null | undefined): string {
  if (teamId == null) {
    return '<span class="results-team-jersey-placeholder" aria-hidden="true"></span>';
  }

  const resolvedTeamName = teamName ?? state.teams.find((team) => team.id === teamId)?.name ?? `Team ${teamId}`;
  return `
    <span class="results-team-jersey" title="${esc(resolvedTeamName)}" aria-label="${esc(resolvedTeamName)}">
      <img
        class="results-team-jersey-img"
        src="${esc(resolveTeamJerseyAssetPath(teamId))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`;
}

function renderResultsJerseyColumn(teamId: number | null | undefined, teamName: string | null | undefined): string {
  return `<span class="results-jersey-cell">${renderMiniJersey(teamId, teamName)}</span>`;
}

function renderResultsFlagColumn(countryCode: string | null | undefined): string {
  if (!countryCode) {
    return '<span class="results-flag-placeholder" aria-hidden="true"></span>';
  }

  const flag = renderFlag(countryCode);
  return flag || '<span class="results-flag-placeholder" aria-hidden="true"></span>';
}

function resolveRiderCountryCode(riderId: number | null | undefined): string | null {
  if (riderId == null) {
    return null;
  }

  const rider = findRiderById(riderId);
  return rider?.country?.code3 ?? rider?.nationality ?? null;
}

function findRiderById(riderId: number | null | undefined): Rider | null {
  if (riderId == null) {
    return null;
  }

  return state.riders.find((candidate) => candidate.id === riderId) ?? null;
}

function renderResultsParticipant(
  name: string,
  strong = true,
  isBreakaway = false,
  riderId: number | null = null,
  teamId: number | null = null,
): string {
  const label = renderRiderNameLink(name, {
    riderId,
    teamId,
    strong,
    linkClassName: 'results-rider-link',
    labelClassName: 'results-participant-label',
  });
  return `<span class="results-participant${isBreakaway ? ' is-breakaway' : ''}">${label}</span>`;
}

function renderNonFinisherStatusBadge(isOtl: boolean): string {
  return `<span class="results-status-badge ${isOtl ? 'results-status-badge-otl' : 'results-status-badge-dnf'}">${isOtl ? 'OTL' : 'DNF'}</span>`;
}

function formatNonFinisherReason(reason: string | null | undefined, isOtl: boolean): string {
  if (!reason) {
    return isOtl ? 'AuÃƒÅ¸erhalb des Zeitlimits' : 'Aufgegeben';
  }
  if (reason.startsWith('crash:')) {
    return `Sturz Ã‚Â· ${reason.slice('crash:'.length)}`;
  }
  if (reason === 'mechanical') {
    return 'Defekt';
  }
  return reason;
}

function renderGcRankDelta(previousRank: number | null | undefined, delta: number | null | undefined): string {
  if (previousRank == null || delta == null || delta === 0) {
    return '<span class="results-gc-delta results-gc-delta-neutral">Ã¢â€”Â</span>';
  }

  if (delta > 0) {
    return `<span class="results-gc-delta results-gc-delta-up"><span class="results-gc-delta-symbol">Ã¢â€“Â²</span><span>${delta}</span></span>`;
  }

  return `<span class="results-gc-delta results-gc-delta-down"><span class="results-gc-delta-symbol">Ã¢â€“Â¼</span><span>${Math.abs(delta)}</span></span>`;
}

function resolveGcRankDelta(
  row: StageResultsPayload['classifications'][number]['rows'][number],
  previousGcRanks: Map<number, number>,
): { previousRank: number | null; delta: number | null } {
  if (row.riderId == null) {
    return { previousRank: null, delta: null };
  }

  const previousRank = previousGcRanks.get(row.riderId) ?? row.gcPreviousRank ?? null;
  if (previousRank == null) {
    return { previousRank: null, delta: null };
  }

  return {
    previousRank,
    delta: previousRank - row.rank,
  };
}

function formatMarkerLabel(markerType: StageMarkerType, label: string): string {
  if (markerType === 'sprint_intermediate') {
    return `Sprint Ã‚Â· ${label}`;
  }
  if (markerType === 'climb_top' || markerType === 'finish_hill' || markerType === 'finish_mountain') {
    return `Bergwertung Ã‚Â· ${label}`;
  }
  return label;
}

function resolveMarkerResultsSortPriority(classification: StageMarkerClassification): number {
  if (isMountainClassificationMarkerType(classification.markerType, classification.markerCategory)) return 0;
  if (classification.markerType === 'sprint_intermediate') return 1;
  return 2;
}

function sortStageMarkerClassifications(classifications: StageMarkerClassification[]): StageMarkerClassification[] {
  return [...classifications].sort((left, right) => (
    resolveMarkerResultsSortPriority(left) - resolveMarkerResultsSortPriority(right)
    || left.kmMark - right.kmMark
    || left.markerLabel.localeCompare(right.markerLabel, 'de')
    || left.markerKey.localeCompare(right.markerKey, 'de')
  ));
}

function renderMarkerClassificationsHtml(classifications: StageMarkerClassification[]): string {
  if (classifications.length === 0) {
    return '';
  }

  return sortStageMarkerClassifications(classifications).map((classification) => {
    const rows = classification.entries.map((entry) => {
      const rider = state.riders.find((candidate) => candidate.id === entry.riderId) ?? null;
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
          <div class="results-marker-points">${entry.pointsAwarded != null && entry.pointsAwarded > 0 ? entry.pointsAwarded : 'Ã¢â‚¬â€œ'}</div>
        </div>`;
    }).join('');

    const categoryText = classification.markerCategory ? ` Ã‚Â· Kat. ${classification.markerCategory}` : '';
    return `
      <section class="results-marker-card">
        <div class="results-marker-card-head">
          <h4>${esc(formatMarkerLabel(classification.markerType, classification.markerLabel))}</h4>
          <div class="results-marker-card-meta">${esc(`${classification.kmMark.toFixed(1).replace('.', ',')} km${categoryText}`)}</div>
        </div>
        <div class="results-marker-list">${rows}</div>
      </section>`;
  }).join('');
}

function renderSingleMarkerClassificationHtml(classification: StageMarkerClassification): string {
  const categoryText = classification.markerCategory ? ` Ã‚Â· Kat. ${classification.markerCategory}` : '';
  const rows = classification.entries.map((entry) => {
    const rider = state.riders.find((candidate) => candidate.id === entry.riderId) ?? null;
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
        <div class="results-marker-points">${entry.pointsAwarded != null && entry.pointsAwarded > 0 ? entry.pointsAwarded : 'Ã¢â‚¬â€œ'}</div>
      </div>`;
  }).join('');

  return `
    <section class="results-marker-card">
      <div class="results-marker-card-head">
        <h4>${esc(formatMarkerLabel(classification.markerType, classification.markerLabel))}</h4>
        <div class="results-marker-card-meta">${esc(`${classification.kmMark.toFixed(1).replace('.', ',')} km${categoryText}`)}</div>
      </div>
      <div class="results-marker-list">${rows}</div>
    </section>`;
}

function resolveMarkerResultButtonLabel(classification: StageMarkerClassification): string {
  const markerPrefix = classification.markerType === 'sprint_intermediate' ? 'Sprint' : 'Berg';
  const categorySuffix = isMountainClassificationMarkerType(classification.markerType, classification.markerCategory) && classification.markerCategory
    ? ` ${classification.markerCategory}`
    : '';
  return `${markerPrefix}${categorySuffix} Ã‚Â· ${classification.markerLabel}`;
}

function formatAverageSpeed(distanceKm: number, timeSeconds: number): string {
  if (!(distanceKm > 0) || !(timeSeconds > 0)) {
    return '';
  }
  return `${((distanceKm / timeSeconds) * 3600).toFixed(1).replace('.', ',')} km/h`;
}

function formatPointsGap(points: number): string {
  if (points === 0) return 'Ã¢â‚¬â€';
  return `-${points}`;
}

function renderSeasonCountryTopRiders(topRiders: SeasonStandingCountryRow['topRiders']): string {
  if (topRiders.length === 0) {
    return '<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>';
  }

  return `
    <div class="season-standings-country-popover-card">
      <div class="season-standings-country-popover-head">
        <strong>Top 20 Fahrer</strong>
      </div>
      <div class="season-standings-country-popover-grid season-standings-country-popover-grid-head">
        <span>Platz</span>
        <span>Flagge</span>
        <span>Fahrer</span>
        <span>Punkte</span>
      </div>
      ${topRiders.map((rider) => `
        <div class="season-standings-country-popover-grid">
          <strong>${rider.rank}</strong>
          <span class="results-flag-col-cell">${renderResultsFlagColumn(rider.countryCode)}</span>
          <span class="season-standings-country-rider-name">${renderRiderNameLink(rider.riderName, { riderId: rider.riderId, strong: false })}</span>
          <strong>${rider.points}</strong>
        </div>
      `).join('')}
    </div>`;
}

function renderSeasonCountryNameCell(row: SeasonStandingCountryRow): string {
  return `
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${esc(row.countryName)}</span>
      <div class="season-standings-country-popover">
        ${renderSeasonCountryTopRiders(row.topRiders)}
      </div>
    </div>`;
}

function renderSeasonTeamTopRiders(
  teamRow: SeasonStandingsPayload['teamStandings'][number],
  riderStandings: SeasonStandingsPayload['riderStandings'],
): string {
  const topRiders = riderStandings
    .filter((rider) => rider.teamId != null && teamRow.teamId != null && rider.teamId === teamRow.teamId)
    .slice(0, 30);

  if (topRiders.length === 0) {
    return '<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>';
  }

  return `
    <div class="season-standings-country-popover-card">
      <div class="season-standings-country-popover-head">
        <strong>Top 30 Fahrer</strong>
      </div>
      <div class="season-standings-country-popover-grid season-standings-country-popover-grid-head">
        <span>Platz</span>
        <span>Flagge</span>
        <span>Fahrer</span>
        <span>Punkte</span>
      </div>
      ${topRiders.map((rider) => `
        <div class="season-standings-country-popover-grid">
          <strong>${rider.rank}</strong>
          <span class="results-flag-col-cell">${renderResultsFlagColumn(rider.countryCode)}</span>
          <span class="season-standings-country-rider-name">${renderRiderNameLink(rider.riderName ?? 'Ã¢â‚¬â€', { riderId: rider.riderId, teamId: rider.teamId, strong: false })}</span>
          <strong>${rider.points}</strong>
        </div>
      `).join('')}
    </div>`;
}

function renderSeasonTeamNameCell(
  row: SeasonStandingsPayload['teamStandings'][number],
  riderStandings: SeasonStandingsPayload['riderStandings'],
): string {
  return `
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${esc(row.teamName)}</span>
      <div class="season-standings-country-popover">
        ${renderSeasonTeamTopRiders(row, riderStandings)}
      </div>
    </div>`;
}

function raceCategoryBadge(race: Race): string {
  const categoryStyle = resolveRaceCategoryBadgeStyle(race.category?.name);
  const badgeStyle = buildRaceCategoryBadgeCssVariables(categoryStyle);
  if (race.isStageRace) {
    return `<span class="badge badge-race-category" style="${badgeStyle}">Etappenrennen Ã‚Â· ${race.numberOfStages} Etappen</span>`;
  }
  return `<span class="badge badge-race-category" style="${badgeStyle}">Eintagesrennen</span>`;
}

function getRaceStageDateRange(race: Race): { startDate: string; endDate: string } {
  const stages = race.stages ?? [];
  if (stages.length === 0) {
    return { startDate: race.startDate, endDate: race.endDate };
  }

  const sortedDates = stages.map((stage) => stage.date).sort((left, right) => left.localeCompare(right));
  return {
    startDate: sortedDates[0] ?? race.startDate,
    endDate: sortedDates[sortedDates.length - 1] ?? race.endDate,
  };
}

function formatRaceDateRange(race: Race): string {
  const { startDate, endDate } = getRaceStageDateRange(race);
  return startDate === endDate
    ? formatDate(startDate)
    : `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

function attrBar(value: number): string {
  const pct = Math.min(100, Math.max(0, value));
  const displayValue = Math.round(value);
  return `
    <div class="attr-bar-wrap">
      <span style="width:2.2em;text-align:right">${displayValue}</span>
      <div class="attr-bar"><div class="attr-bar-fill" style="width:${pct}%"></div></div>
    </div>`;
}

const TEAM_SKILL_COLUMNS: Array<{ key: keyof Rider['skills']; label: string }> = [
  { key: 'flat', label: 'Fl' },
  { key: 'mountain', label: 'Berg' },
  { key: 'mediumMountain', label: 'MB' },
  { key: 'hill', label: 'Hgl' },
  { key: 'timeTrial', label: 'ZF' },
  { key: 'prologue', label: 'Pro' },
  { key: 'cobble', label: 'Pf' },
  { key: 'sprint', label: 'Spr' },
  { key: 'acceleration', label: 'Acc' },
  { key: 'downhill', label: 'Abf' },
  { key: 'attack', label: 'Atk' },
  { key: 'stamina', label: 'Sta' },
  { key: 'resistance', label: 'Res' },
  { key: 'recuperation', label: 'Rec' },
  { key: 'bikeHandling', label: 'Ftg' },
];

type TeamDetailPage = 'skills' | 'form' | 'profile' | 'preferences';
type RiderStatsTab = 'results' | 'program';
type RiderTeamEditorSortKey = keyof RiderTeamEditorRiderRow | 'teamName';

type TeamTableSortKey = 'name' | 'countryCode' | 'birthYear' | 'age' | 'overallRating' | 'formBonus' | 'raceFormBonus' | 'longTermFatigueMalus' | 'shortTermFatigueMalus' | 'seasonPoints' | 'seasonRaceDays' | 'seasonWins' | 'contractEndSeason' | 'roleName' | 'riderType' | 'specialization1' | 'specialization2' | 'specialization3' | 'skillDevelopment' | 'peak1' | 'peak2' | 'peak3' | keyof Rider['skills'];
type RaceParticipantsSortKey = 'team' | 'rider' | 'spec1' | 'role' | 'overall' | 'phase' | 'program';
type StageEditorStagesSortKey = 'stageId' | 'countryCode' | 'raceName' | 'stageNumber' | 'profile' | 'distanceKm' | 'elevationGainMeters' | 'sprintCount' | 'climbCount' | 'profileScore';
type StageEditorClimbsSortKey = 'placementKm' | 'name' | 'category' | 'countryCode' | 'raceName' | 'stageNumber' | 'gainMeters' | 'distanceKm' | 'avgGradient' | 'maxGradient' | 'climbScore';

interface TeamTableColumn {
  id: string;
  label: string;
  title: string;
  sortKey?: TeamTableSortKey;
  className?: string;
}

const TEAM_SKILL_TITLES: Record<keyof Rider['skills'], string> = {
  flat: 'Flach',
  mountain: 'Berg',
  mediumMountain: 'Mittlere Berge',
  hill: 'HÃƒÂ¼gel',
  timeTrial: 'Zeitfahren',
  prologue: 'Prolog',
  cobble: 'Pflaster',
  sprint: 'Sprint',
  acceleration: 'Antritt',
  downhill: 'Abfahrt',
  attack: 'Attacke',
  stamina: 'Stamina',
  resistance: 'Widerstand',
  recuperation: 'Regeneration',
  bikeHandling: 'Fahrtechnik',
};

const TEAM_TABLE_COLUMNS: TeamTableColumn[] = [
  { id: 'name', label: 'Name', title: 'Name - Nachname, Vorname', sortKey: 'name', className: 'team-table-col-name' },
  { id: 'country', label: 'Country', title: 'Country - Flagge und 3er-Code', sortKey: 'countryCode', className: 'team-table-col-country' },
  { id: 'age', label: 'Alt', title: 'Alter', sortKey: 'age', className: 'team-table-col-age' },
  { id: 'roleName', label: 'Rolle', title: 'Teamrolle des Fahrers', sortKey: 'roleName', className: 'team-table-col-role' },
];

const TEAM_DETAIL_PAGE_COLUMNS: Record<TeamDetailPage, TeamTableColumn[]> = {
  skills: [
  { id: 'overallRating', label: 'Ges', title: 'GesamtstÃƒÂ¤rke', sortKey: 'overallRating', className: 'team-table-col-overall' },
  ...TEAM_SKILL_COLUMNS.map((column) => ({
    id: column.key,
    label: column.label,
    title: `${column.label} - ${TEAM_SKILL_TITLES[column.key]}`,
    sortKey: column.key,
    className: 'team-table-col-skill',
  })),
  ],
  form: [
    { id: 'birthYear', label: 'Jg', title: 'Geburtsjahr', sortKey: 'birthYear', className: 'team-table-col-year' },
    { id: 'contractEndSeason', label: 'V-Ende', title: 'Vertragsende - Ende des aktiven Vertrags', sortKey: 'contractEndSeason', className: 'team-table-col-contract' },
    { id: 'formBonus', label: 'S-Form', title: 'Saisonformbonus', sortKey: 'formBonus', className: 'team-table-col-points' },
    { id: 'raceFormBonus', label: 'R-Form', title: 'Rennbonus aus saisonalem Formfenster', sortKey: 'raceFormBonus', className: 'team-table-col-points' },
    { id: 'longTermFatigueMalus', label: 'L-Ersch', title: 'Langzeit-ErschÃƒÂ¶pfung ab dem 50. Saisonrenntag', sortKey: 'longTermFatigueMalus', className: 'team-table-col-points' },
    { id: 'shortTermFatigueMalus', label: 'Akut', title: 'Akuter VerschleiÃƒÅ¸ im rollenden 30-Tage-Fenster', sortKey: 'shortTermFatigueMalus', className: 'team-table-col-points' },
    { id: 'seasonFormPhase', label: 'Phase', title: 'Formphase', className: 'team-table-col-phase' },
    { id: 'seasonPoints', label: 'Pkt', title: 'Saisonpunkte - kumulierte Punkte der aktuellen Saison', sortKey: 'seasonPoints', className: 'team-table-col-points' },
    { id: 'seasonRaceDays', label: 'Renntage', title: 'Renntage in der laufenden Saison', sortKey: 'seasonRaceDays', className: 'team-table-col-points' },
    { id: 'seasonWins', label: 'Siege', title: 'Siege in der laufenden Saison', sortKey: 'seasonWins', className: 'team-table-col-points' },
    { id: 'peak1', label: 'Peak 1', title: 'Erster FormhÃƒÂ¶hepunkt', sortKey: 'peak1', className: 'team-table-col-date' },
    { id: 'peak2', label: 'Peak 2', title: 'Zweiter FormhÃƒÂ¶hepunkt', sortKey: 'peak2', className: 'team-table-col-date' },
    { id: 'peak3', label: 'Peak 3', title: 'Dritter FormhÃƒÂ¶hepunkt', sortKey: 'peak3', className: 'team-table-col-date' },
  ],
  profile: [
    { id: 'specialization1', label: 'Spec1', title: 'Spezialisierung 1', sortKey: 'specialization1', className: 'team-table-col-profile' },
    { id: 'specialization2', label: 'Spec2', title: 'Spezialisierung 2', sortKey: 'specialization2', className: 'team-table-col-profile' },
    { id: 'specialization3', label: 'Spec3', title: 'Spezialisierung 3', sortKey: 'specialization3', className: 'team-table-col-profile' },
    { id: 'skillDevelopment', label: 'Entw.', title: 'Skill Development', sortKey: 'skillDevelopment', className: 'team-table-col-points' },
  ],
  preferences: [
    { id: 'seasonProgram', label: 'Programm', title: 'Saisonprogramm', className: 'team-table-col-program' },
    { id: 'mentorName', label: 'Mentor', title: 'Entwicklungs-Mentor im Team', sortKey: 'mentorName', className: 'team-table-col-mentor' },
  ],
};

const TEAM_DETAIL_PAGE_LABELS: Record<TeamDetailPage, string> = {
  skills: 'Skills',
  form: 'Form',
  profile: 'Profil',
  preferences: 'Vorlieben',
};

const TEAM_DETAIL_PAGE_ORDER: TeamDetailPage[] = ['skills', 'form', 'profile', 'preferences'];
const RIDER_MENU_PAGE_SIZE = 50;

function getActiveTeamTableColumns(): TeamTableColumn[] {
  return [...TEAM_TABLE_COLUMNS, ...TEAM_DETAIL_PAGE_COLUMNS[state.teamDetailPage]];
}

function getActiveRiderMenuTableColumns(): TeamTableColumn[] {
  return [...TEAM_TABLE_COLUMNS, ...TEAM_DETAIL_PAGE_COLUMNS[state.riderMenuDetailPage]];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function interpolateChannel(start: number, end: number, ratio: number): number {
  return Math.round(start + (end - start) * ratio);
}

function interpolateColor(start: [number, number, number], end: [number, number, number], ratio: number): string {
  return `rgb(${interpolateChannel(start[0], end[0], ratio)} ${interpolateChannel(start[1], end[1], ratio)} ${interpolateChannel(start[2], end[2], ratio)})`;
}

function getSkillColor(value: number): string {
  const colorStops: Array<{ value: number; color: [number, number, number] }> = [
    { value: 40, color: [86, 16, 28] },
    { value: 50, color: [132, 24, 38] },
    { value: 60, color: [185, 72, 18] },
    { value: 70, color: [212, 145, 24] },
    { value: 78, color: [88, 191, 92] },
    { value: 85, color: [196, 255, 188] },
  ];

  const boundedValue = clamp(value, colorStops[0].value, colorStops[colorStops.length - 1].value);

  for (let index = 1; index < colorStops.length; index += 1) {
    const previousStop = colorStops[index - 1];
    const currentStop = colorStops[index];
    if (boundedValue <= currentStop.value) {
      const ratio = (boundedValue - previousStop.value) / (currentStop.value - previousStop.value);
      return interpolateColor(previousStop.color, currentStop.color, ratio);
    }
  }

  return interpolateColor(colorStops[colorStops.length - 1].color, colorStops[colorStops.length - 1].color, 1);
}

function renderSkillValue(value: number, potential?: number): string {
  const titleAttr = potential != null ? ` title="Potential: ${potential.toFixed(2).replace('.', ',')}"` : '';
  return `<span class="skill-value" style="color:${getSkillColor(value)}"${titleAttr}>${value.toFixed(2).replace('.', ',')}</span>`;
}

function renderSkillValueWithDelta(value: number, yearStart?: number, potential?: number): string {
  if (yearStart == null) {
    return renderSkillValue(value, potential);
  }
  const delta = Math.round((value - yearStart) * 100) / 100;
  const deltaClass = delta > 0 ? 'skill-delta-positive' : delta < 0 ? 'skill-delta-negative' : 'skill-delta-neutral';
  const sign = delta > 0 ? '+' : '';
  const deltaText = `<span class="skill-delta ${deltaClass}">${sign}${delta.toFixed(2).replace('.', ',')}</span>`;
  return `
    <span class="skill-value" style="color:${getSkillColor(value)}" title="Potential: ${potential.toFixed(2).replace('.', ',')}">${value.toFixed(2).replace('.', ',')}</span>
    ${deltaText}
  `;
}

function renderRaceFormBonusValue(value: number | undefined): string {
  const amount = value ?? 0;
  if (amount < 0) {
    return `${amount.toFixed(1).replace('.', ',')}`;
  }
  if (amount === 0) {
    return '0,0';
  }
  return `<span class="race-sim-form-positive">+${amount.toFixed(1).replace('.', ',')}</span>`;
}

function renderSeasonFormValue(value: number | undefined): string {
  const amount = value ?? 0;
  if (amount === 0) {
    return '0,0';
  }
  const className = amount > 0 ? 'race-sim-form-positive' : 'race-sim-form-negative';
  const prefix = amount > 0 ? '+' : '';
  return `<span class="${className}">${prefix}${amount.toFixed(1).replace('.', ',')}</span>`;
}

function renderLoadMalusValue(value: number | undefined, warning: Rider['shortTermFatigueWarning'] = 'none', title?: string): string {
  const amount = value ?? 0;
  const classNames = ['race-sim-form-negative'];
  if (warning === 'warning') {
    classNames.push('load-warning');
  }
  if (warning === 'critical') {
    classNames.push('load-warning-critical');
  }
  const titleAttr = title ? ` title="${esc(title)}"` : '';
  if (amount === 0) {
    return `<span class="${classNames.join(' ')}"${titleAttr}>0,0</span>`;
  }
  return `<span class="${classNames.join(' ')}"${titleAttr}>-${amount.toFixed(1).replace('.', ',')}</span>`;
}

function renderSeasonFormPhase(rider: Rider): string {
  const phase = rider.seasonFormPhase ?? 'neutral';
  return renderSeasonFormPhaseIndicator(phase);
}

function renderSeasonFormPhaseIndicator(phase: Rider['seasonFormPhase']): string {
  const meta: Record<string, { symbol: string; label: string; className: string }> = {
    rise: { symbol: 'Ã¢â€ â€˜', label: 'Aufbau', className: 'team-form-phase-rise' },
    fall: { symbol: 'Ã¢â€ â€œ', label: 'Abbau', className: 'team-form-phase-fall' },
    neutral: { symbol: 'Ã¢â€”Â', label: 'Neutral', className: 'team-form-phase-neutral' },
  };
  const item = meta[phase ?? 'neutral'] ?? meta['neutral'];
  return `<span class="team-form-phase ${item.className}" title="${esc(item.label)}">${item.symbol}</span>`;
}

function renderRiderProgramButton(rider: Rider): string {
  if (!rider.seasonProgram) {
    return 'Ã¢â‚¬â€œ';
  }
  return `<button type="button" class="team-program-button" data-rider-program-id="${rider.id}">${esc(rider.seasonProgram.name)}</button>`;
}

const FLAG_CODE_BY_CODE3: Record<string, string> = {
  BEL: 'be',
  FRA: 'fr',
  ITA: 'it',
  ESP: 'es',
  NED: 'nl',
  GER: 'de',
  GBR: 'gb',
  USA: 'us',
  CAN: 'ca',
  MEX: 'mx',
  COL: 'co',
  ECU: 'ec',
  VEN: 've',
  ARG: 'ar',
  AUS: 'au',
  NZL: 'nz',
  DEN: 'dk',
  NOR: 'no',
  SLO: 'si',
  POR: 'pt',
  SWI: 'ch',
  POL: 'pl',
  AUT: 'at',
  LUX: 'lu',
  IRL: 'ie',
  EST: 'ee',
  LTU: 'lt',
  LAT: 'lv',
  CZE: 'cz',
  SVK: 'sk',
  KAZ: 'kz',
  SWD: 'se',
  FIN: 'fi',
  UKR: 'ua',
  MOL: 'md',
  CRO: 'hr',
  HUN: 'hu',
  ERI: 'er',
  RWA: 'rw',
  ETH: 'et',
  CMR: 'cm',
  SAR: 'za',
  JPN: 'jp',
  UAE: 'ae',
  BHR: 'bh',
  SUI: 'ch',
  IRE: 'ie',
  RSA: 'za',
  OTH: 'un',
};

function renderFlag(code3: string): string {
  const alpha2 = FLAG_CODE_BY_CODE3[code3] ?? null;
  if (!alpha2) return '';
  return `<span class="fi fi-${alpha2} country-flag" aria-hidden="true"></span>`;
}

function renderCountry(country?: Team['country'] | Rider['country'], fallbackCode?: string): string {
  if (!country) return fallbackCode ? esc(fallbackCode) : 'Ã¢â‚¬â€œ';
  return `<span class="country-chip">${renderFlag(country.code3)}<span>${esc(country.name)}</span></span>`;
}

function formatKm(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} km`;
}

function formatElevationGain(value: number): string {
  return `${Math.round(value)} hm`;
}

function formatGradient(value: number): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1).replace('.', ',')}%`;
}

function slugifyFileName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60) || 'stage_details';
}

function stageProfileOptionsHtml(selected?: StageProfile): string {
  return STAGE_PROFILE_OPTIONS.map((profile) =>
    `<option value="${profile}"${profile === selected ? ' selected' : ''}>${esc(profile)}</option>`).join('');
}

function terrainOptionsHtml(selected: StageTerrain): string {
  return STAGE_TERRAIN_OPTIONS.map((terrain) =>
    `<option value="${terrain}"${terrain === selected ? ' selected' : ''}>${esc(terrain)}</option>`).join('');
}

function markerTypeOptionsHtml(selected: StageMarkerType, scope: 'start' | 'end' = 'start', segmentIndex = 0, totalSegments = 1): string {
  const allowedTypes = STAGE_MARKER_TYPES.filter((markerType) => {
    if (scope === 'start') {
      if (markerType === 'start') return segmentIndex === 0;
      return markerType === 'climb_start' || markerType === 'sprint_intermediate';
    }

    if (markerType === 'start' || markerType === 'climb_start') {
      return false;
    }
    if (isFinishMarkerType(markerType)) {
      return segmentIndex === totalSegments - 1;
    }
    return markerType === 'climb_top' || markerType === 'sprint_intermediate';
  });

  const optionTypes = allowedTypes.includes(selected)
    ? allowedTypes
    : [selected, ...allowedTypes.filter((markerType) => markerType !== selected)];

  return optionTypes.map((markerType) =>
    `<option value="${markerType}"${markerType === selected ? ' selected' : ''}>${esc(markerType)}</option>`).join('');
}

function markerCategoryOptionsHtml(selected: StageMarkerCategory | null): string {
  return ['<option value="">Ã¢â‚¬â€œ</option>', ...STAGE_MARKER_CATEGORIES.map((category) =>
    `<option value="${category}"${category === selected ? ' selected' : ''}>${esc(category)}</option>`),
  ].join('');
}

function markerTypeSortValue(markerType: StageMarkerType): number {
  return STAGE_MARKER_TYPES.indexOf(markerType);
}

function normalizeIncomingMarkerType(markerType: string | null | undefined): StageMarkerType | null {
  if (!markerType) return null;
  if (markerType === 'finish') return 'finish_flat';
  return STAGE_MARKER_TYPES.includes(markerType as StageMarkerType) ? markerType as StageMarkerType : null;
}

function normalizeWaypointMarkers(waypoint: StageEditorWaypoint & {
  markerType?: string | null;
  markerName?: string | null;
  markerCat?: StageMarkerCategory | null;
  markers?: StageMarker[];
}): StageMarker[] {
  if (Array.isArray(waypoint.markers)) {
    return sortStageMarkers(waypoint.markers);
  }

  const markerType = normalizeIncomingMarkerType(waypoint.markerType);
  if (!markerType) return [];

  return [{
    type: markerType,
    name: waypoint.markerName?.trim() || null,
    cat: waypoint.markerCat ?? null,
  }];
}

function normalizeSegmentMarkers(markers: StageMarker[] | undefined): StageMarker[] {
  return sortStageMarkers(Array.isArray(markers) ? markers : []);
}

function buildStageEditorSegmentsFromWaypoints(waypoints: StageEditorWaypoint[]): StageEditorSegment[] {
  return waypoints.slice(0, -1).map((waypoint, index) => {
    const nextWaypoint = waypoints[index + 1];
    const lengthKm = roundStageEditorKm(nextWaypoint.kmMark - waypoint.kmMark);
    const gradientPercent = lengthKm > 0
      ? roundStageEditorOneDecimal(((nextWaypoint.elevation - waypoint.elevation) / (lengthKm * 1000)) * 100)
      : 0;

    return {
      startElevation: waypoint.elevation,
      lengthKm,
      gradientPercent,
      terrain: waypoint.terrain,
      techLevel: waypoint.techLevel,
      windExp: waypoint.windExp,
      markers: sortStageMarkers(waypoint.markers),
      endMarkers: sortStageMarkers(nextWaypoint.markers),
    };
  });
}

function buildStageEditorWaypointsFromSegments(segments: StageEditorSegment[]): StageEditorWaypoint[] {
  if (segments.length === 0) return [];

  const waypoints: StageEditorWaypoint[] = [{
    kmMark: 0,
    elevation: segments[0].startElevation,
    terrain: segments[0].terrain,
    techLevel: segments[0].techLevel,
    windExp: segments[0].windExp,
    markers: sortStageMarkers(segments[0].markers),
  }];

  let cumulativeKm = 0;
  segments.forEach((segment) => {
    cumulativeKm = roundStageEditorKm(cumulativeKm + segment.lengthKm);
    const endElevation = Math.round(segment.startElevation + ((segment.lengthKm * 1000) * (segment.gradientPercent / 100)));
    const previousWaypoint = waypoints[waypoints.length - 1];
    previousWaypoint.terrain = segment.terrain;
    previousWaypoint.techLevel = segment.techLevel;
    previousWaypoint.windExp = segment.windExp;
    previousWaypoint.markers = sortStageMarkers([...previousWaypoint.markers, ...segment.markers]);

    waypoints.push({
      kmMark: cumulativeKm,
      elevation: endElevation,
      terrain: segment.terrain,
      techLevel: segment.techLevel,
      windExp: segment.windExp,
      markers: sortStageMarkers(segment.endMarkers),
    });
  });

  return waypoints;
}

function recalculateStageEditorSegmentStartElevations(draft: StageEditorDraft): void {
  if (draft.segments.length === 0) {
    draft.waypoints = [];
    return;
  }

  let startElevation = draft.segments[0].startElevation;
  draft.segments = draft.segments.map((segment, index) => {
    const nextSegment: StageEditorSegment = {
      ...segment,
      startElevation: Math.round(index === 0 ? segment.startElevation : startElevation),
      lengthKm: roundStageEditorKm(segment.lengthKm),
      gradientPercent: roundStageEditorOneDecimal(segment.gradientPercent),
      markers: sortStageMarkers(segment.markers),
      endMarkers: sortStageMarkers(segment.endMarkers),
    };
    startElevation = Math.round(nextSegment.startElevation + ((nextSegment.lengthKm * 1000) * (nextSegment.gradientPercent / 100)));
    return nextSegment;
  });
  draft.waypoints = buildStageEditorWaypointsFromSegments(draft.segments);
}

function normalizeStageEditorDraft(draft: StageEditorDraft): StageEditorDraft {
  const normalizedDraft = {
    ...draft,
    segments: (draft.segments?.length
      ? draft.segments
      : buildStageEditorSegmentsFromWaypoints(draft.waypoints ?? [])
    ).map((segment) => ({
      ...segment,
      startElevation: Math.round(segment.startElevation),
      lengthKm: Number.isFinite(segment.lengthKm) ? roundStageEditorKm(segment.lengthKm) : STAGE_EDITOR_MIN_SEGMENT_KM,
      gradientPercent: Number.isFinite(segment.gradientPercent) ? roundStageEditorOneDecimal(segment.gradientPercent) : 0,
      techLevel: Number.isFinite(segment.techLevel) ? segment.techLevel : 5,
      windExp: Number.isFinite(segment.windExp) ? segment.windExp : 5,
      markers: normalizeSegmentMarkers(segment.markers),
      endMarkers: normalizeSegmentMarkers(segment.endMarkers),
    })),
    waypoints: [],
  };
  syncStageEditorDerivedState(normalizedDraft);
  return normalizedDraft;
}

function sortStageMarkers(markers: StageMarker[]): StageMarker[] {
  return [...markers].sort((left, right) => markerTypeSortValue(left.type) - markerTypeSortValue(right.type));
}

function parseMarkerTextList(rawValue: string): Array<string | null> {
  const trimmed = rawValue.trim();
  if (!trimmed) return [];
  return trimmed.split('|').map((part) => {
    const value = part.trim();
    return value.length === 0 || value.toLowerCase() === 'null' ? null : value;
  });
}

function markerInputValue(markers: StageMarker[], key: 'name' | 'cat'): string {
  return markers.map((marker) => marker[key] ?? 'null').join('|');
}

function markerLabelValue(markers: StageMarker[]): string {
  return markers.map((marker) => marker.type).join(' | ');
}

function describeMarkerScope(scope: 'start' | 'end', segmentIndex: number, totalSegments: number): string {
  if (scope === 'start') {
    return segmentIndex === 0 ? 'Startgrenze Ã‚Â· Pflichtmarker Start oder Bergbeginn' : 'Startgrenze Ã‚Â· Bergbeginn';
  }

  return segmentIndex === totalSegments - 1
    ? 'Endgrenze Ã‚Â· Ziel oder Wertungsende'
    : 'Endgrenze Ã‚Â· Sprint oder Bergwertung';
}

function collectStageEditorClimbPairIssues(draft: StageEditorDraft): Map<number, string[]> {
  const issuesBySegment = new Map<number, string[]>();
  const openClimbs: Array<{ name: string | null; segmentIndex: number }> = [];

  const pushIssue = (segmentIndex: number, issue: string): void => {
    const bucket = issuesBySegment.get(segmentIndex) ?? [];
    bucket.push(issue);
    issuesBySegment.set(segmentIndex, bucket);
  };

  draft.segments.forEach((segment, segmentIndex) => {
    segment.markers.forEach((marker) => {
      if (marker.type !== 'climb_start') {
        return;
      }

      openClimbs.push({ name: marker.name ?? null, segmentIndex });
    });

    segment.endMarkers.forEach((marker) => {
      if (!isMountainClassificationMarkerType(marker.type, marker.cat)) {
        return;
      }

      if (!marker.name) {
        pushIssue(segmentIndex, `${marker.type} braucht einen Namen fuer die Paarbildung.`);
        return;
      }

      let matchingIndex = -1;
      for (let index = openClimbs.length - 1; index >= 0; index -= 1) {
        if (openClimbs[index]?.name === marker.name) {
          matchingIndex = index;
          break;
        }
      }

      const openIndex = matchingIndex >= 0 ? matchingIndex : openClimbs.length - 1;
      if (openIndex < 0) {
        pushIssue(segmentIndex, `${marker.type} \"${marker.name}\" braucht einen vorherigen climb_start.`);
        return;
      }

      openClimbs.splice(openIndex, 1);
    });
  });

  openClimbs.forEach((openClimb) => {
    const climbLabel = openClimb.name ? ` \"${openClimb.name}\"` : '';
    pushIssue(openClimb.segmentIndex, `climb_start${climbLabel} braucht einen spaeteren climb_top oder kategorisierten finish_hill/finish_mountain.`);
  });

  return issuesBySegment;
}

function normalizeMarkerForType(marker: StageMarker): StageMarker {
  if (marker.type === 'climb_top') {
    return { ...marker, cat: marker.cat && ['HC', '1', '2', '3', '4'].includes(marker.cat) ? marker.cat : '4' };
  }
  if (isMountainFinishMarkerType(marker.type)) {
    return { ...marker, cat: hasClimbMarkerCategory(marker.cat) ? marker.cat : null };
  }
  if (marker.type === 'sprint_intermediate') {
    return { ...marker, cat: marker.cat === 'Sprint' ? marker.cat : 'Sprint' };
  }
  return { ...marker, cat: null };
}

function getStageEditorSegmentIssuesAt(draft: StageEditorDraft, segmentIndex: number): string[] {
  const segment = draft.segments[segmentIndex];
  if (!segment) return [];

  const issues: string[] = [];
  const climbPairIssues = collectStageEditorClimbPairIssues(draft).get(segmentIndex) ?? [];
  if (segment.lengthKm < STAGE_EDITOR_MIN_SEGMENT_KM) {
    issues.push(`Laenge unter ${STAGE_EDITOR_MIN_SEGMENT_KM.toFixed(1).replace('.', ',')} km.`);
  }
  if (segment.techLevel < 1 || segment.techLevel > 10) {
    issues.push('Tech ausserhalb 1-10.');
  }
  if (segment.windExp < 1 || segment.windExp > 10) {
    issues.push('Wind ausserhalb 1-10.');
  }
  if (segmentIndex === 0 && !segment.markers.some((marker) => marker.type === 'start')) {
    issues.push('Startmarker fehlt am ersten Segment.');
  }
  if (segmentIndex < draft.segments.length - 1 && segment.endMarkers.some((marker) => isFinishMarkerType(marker.type))) {
    issues.push('Finish nur am Endmarker des letzten Segments.');
  }
  if (segmentIndex > 0 && segment.markers.some((marker) => marker.type === 'start')) {
    issues.push('Startmarker nur am ersten Segment erlaubt.');
  }
  if (segmentIndex === draft.segments.length - 1 && !segment.endMarkers.some((marker) => isFinishMarkerType(marker.type))) {
    issues.push('Finishmarker fehlt am letzten Segmentende.');
  }

  segment.markers.forEach((marker) => {
    if (isFinishMarkerType(marker.type)) {
      issues.push('Finishmarker gehoert in den Endmarker-Slot.');
    }
    if (marker.type === 'climb_top') {
      issues.push('climb_top gehoert in den Endmarker-Slot.');
    }
    if (marker.type === 'sprint_intermediate') {
      issues.push('Sprintmarker gehoert in den Endmarker-Slot.');
    }
  });

  segment.endMarkers.forEach((marker) => {
    if (marker.type === 'start' || marker.type === 'climb_start') {
      issues.push(`${marker.type} gehoert in den Startmarker-Slot.`);
    }
    if (isMountainClassificationMarkerType(marker.type, marker.cat) && !hasClimbMarkerCategory(marker.cat)) {
      issues.push(`${marker.type} braucht Kategorie HC oder 1-4.`);
    }
  });

  [...segment.markers, ...segment.endMarkers].forEach((marker) => {
    if (marker.type === 'sprint_intermediate' && marker.cat != null && marker.cat !== 'Sprint') {
      issues.push('Sprintmarker erlaubt nur Kategorie Sprint.');
    }
    if (isFinishMarkerType(marker.type) && !isMountainFinishMarkerType(marker.type) && marker.cat != null) {
      issues.push('finish_flat und finish_TT duerfen keine Kategorie haben.');
    }
    if (isMountainFinishMarkerType(marker.type) && marker.cat != null && !hasClimbMarkerCategory(marker.cat)) {
      issues.push(`${marker.type} erlaubt nur Kategorie HC oder 1-4.`);
    }
  });

  issues.push(...climbPairIssues);

  return [...new Set(issues)];
}

function stageEditorFieldErrorClass(hasError: boolean): string {
  return hasError ? ' stage-editor-input-invalid' : '';
}

function renderStageEditorSegmentIssues(draft: StageEditorDraft, segmentIndex: number): string {
  const issues = getStageEditorSegmentIssuesAt(draft, segmentIndex);
  if (issues.length === 0) {
    return '<div class="stage-editor-segment-status">OK</div>';
  }

  return `<div class="stage-editor-segment-issues">${issues.map((issue) => `<div>${esc(issue)}</div>`).join('')}</div>`;
}

function renderSegmentMarkerBlock(markers: StageMarker[], segmentIndex: number, totalSegments: number, scope: 'start' | 'end'): string {
  const title = scope === 'start' ? 'Startmarker' : 'Endmarker';
  const addLabel = scope === 'start' ? 'Start / Berg+' : 'Sprint / Berg / Ziel+';
  return `
    <div class="stage-editor-marker-block">
      <div class="stage-editor-marker-block-head">
        <strong>${title}</strong>
        <span>${esc(describeMarkerScope(scope, segmentIndex, totalSegments))}</span>
      </div>
      ${renderSegmentMarkerRows(markers, segmentIndex, totalSegments, scope)}
      <button type="button" class="btn btn-secondary btn-xs stage-editor-marker-add" data-segment-action="add-marker" data-marker-scope="${scope}" data-segment-index="${segmentIndex}">${addLabel}</button>
    </div>`;
}

function roundStageEditorOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

function roundStageEditorKm(value: number): number {
  return Number(value.toFixed(2));
}

function syncStageEditorDraftStats(draft: StageEditorDraft): void {
  draft.totalDistanceKm = roundStageEditorKm(draft.segments.reduce((sum, segment) => sum + segment.lengthKm, 0));
  draft.elevationGainMeters = draft.waypoints.reduce((sum, waypoint, index) => {
    if (index === 0) return 0;
    const gain = waypoint.elevation - draft.waypoints[index - 1].elevation;
    return sum + Math.max(0, gain);
  }, 0);
}

interface DetectedStageEditorClimb extends StageEditorClimb {
  startIndex: number;
  topIndex: number;
  topElevation: number;
}

function classifyStageEditorClimb(distanceKm: number, gainMeters: number, avgGradient: number): Extract<StageMarkerCategory, 'HC' | '1' | '2' | '3' | '4'> {
  const score = distanceKm * avgGradient * 8 + gainMeters / 12;
  if (score >= 95) return 'HC';
  if (score >= 68) return '1';
  if (score >= 46) return '2';
  if (score >= 28) return '3';
  return '4';
}

function detectStageEditorClimbs(waypoints: StageEditorWaypoint[]): DetectedStageEditorClimb[] {
  const climbs: DetectedStageEditorClimb[] = [];
  let startIndex: number | null = null;
  let topIndex: number | null = null;
  let descentMeters = 0;

  const commitClimb = (resolvedTopIndex: number | null): void => {
    if (startIndex == null || resolvedTopIndex == null || resolvedTopIndex <= startIndex) {
      startIndex = null;
      topIndex = null;
      descentMeters = 0;
      return;
    }

    const startPoint = waypoints[startIndex];
    const topPoint = waypoints[resolvedTopIndex];
    const distanceKm = topPoint.kmMark - startPoint.kmMark;
    const netGainMeters = Math.max(0, topPoint.elevation - startPoint.elevation);
    const avgGradient = distanceKm > 0 ? netGainMeters / (distanceKm * 10) : 0;
    if (netGainMeters >= STAGE_EDITOR_CLIMB_MIN_GAIN_METERS && avgGradient >= STAGE_EDITOR_CLIMB_MIN_AVG_GRADIENT) {
      climbs.push({
        startKm: roundStageEditorKm(startPoint.kmMark),
        endKm: roundStageEditorKm(topPoint.kmMark),
        distanceKm: roundStageEditorKm(distanceKm),
        gainMeters: Math.round(netGainMeters),
        avgGradient: roundStageEditorOneDecimal(avgGradient),
        category: classifyStageEditorClimb(distanceKm, netGainMeters, avgGradient),
        startIndex,
        topIndex: resolvedTopIndex,
        topElevation: Math.round(topPoint.elevation),
      });
    }

    startIndex = null;
    topIndex = null;
    descentMeters = 0;
  };

  for (let index = 1; index < waypoints.length; index += 1) {
    const previous = waypoints[index - 1];
    const current = waypoints[index];
    const deltaElevation = current.elevation - previous.elevation;
    if (startIndex == null && deltaElevation > 0) {
      startIndex = index - 1;
      topIndex = index;
      descentMeters = 0;
      continue;
    }

    if (startIndex == null) {
      continue;
    }

    if (deltaElevation >= 0) {
      if (topIndex == null || current.elevation >= waypoints[topIndex].elevation) {
        topIndex = index;
      }
      descentMeters = 0;
      continue;
    }

    descentMeters += Math.abs(deltaElevation);
    if (descentMeters >= STAGE_EDITOR_CLIMB_BREAK_DESCENT_METERS) {
      commitClimb(topIndex);
    }
  }

  commitClimb(topIndex);
  return climbs;
}

function suggestStageEditorProfile(draft: StageEditorDraft): StageProfile {
  const hasCobbleHill = draft.segments.some((segment) => segment.terrain === 'Cobble_Hill');
  const hasCobble = draft.segments.some((segment) => segment.terrain === 'Cobble');
  const hasHcOrCat1 = draft.climbs.some((climb) => climb.category === 'HC' || climb.category === '1');

  if (hasCobbleHill) return 'Cobble_Hill';
  if (hasCobble) return 'Cobble';
  if (draft.totalDistanceKm <= 25 && draft.elevationGainMeters < 250) return 'ITT';
  if (hasHcOrCat1 && draft.elevationGainMeters >= 2800) return 'High_Mountain';
  if (hasHcOrCat1 || draft.elevationGainMeters >= 1800) return 'Mountain';
  if (draft.elevationGainMeters >= 1100) return 'Medium_Mountain';
  if (draft.elevationGainMeters >= 700) return 'Hilly';
  if (draft.elevationGainMeters >= 350) return 'Rolling';
  return 'Flat';
}

function isManualStageEditorTerrain(terrain: StageTerrain): boolean {
  return terrain === 'Cobble' || terrain === 'Cobble_Hill' || terrain === 'Sprint';
}

function classifyAutoClimbTerrain(climb: DetectedStageEditorClimb): StageTerrain | null {
  if (climb.gainMeters >= STAGE_EDITOR_AUTO_MOUNTAIN_MIN_GAIN_METERS && climb.topElevation >= STAGE_EDITOR_AUTO_MOUNTAIN_MIN_TOP_METERS) {
    return 'Mountain';
  }
  if (climb.gainMeters > STAGE_EDITOR_AUTO_MEDIUM_MIN_GAIN_METERS) {
    return 'Medium_Mountain';
  }
  return 'Hill';
}

function classifyAutoStageEditorBaseTerrain(segment: StageEditorSegment): StageTerrain {
  if (segment.gradientPercent < STAGE_EDITOR_AUTO_DESCENT_STRONG_GRADIENT) {
    return 'Abfahrt';
  }
  if (
    segment.gradientPercent < STAGE_EDITOR_AUTO_FLAT_MAX_GRADIENT
    || Math.max(0, (segment.lengthKm * 1000) * (segment.gradientPercent / 100)) < STAGE_EDITOR_SEGMENT_MIN_HILL_GAIN_METERS
  ) {
    return 'Flat';
  }
  return 'Hill';
}

function applyAutomaticStageEditorTerrain(draft: StageEditorDraft): void {
  if (draft.segments.length === 0) return;

  draft.waypoints = buildStageEditorWaypointsFromSegments(draft.segments);
  if (draft.sourceFormat === 'csv') {
    const climbs = detectStageEditorClimbs(draft.waypoints);
    draft.climbs = climbs.map(({ startIndex: _startIndex, topIndex: _topIndex, topElevation: _topElevation, ...climb }) => climb);
    return;
  }

  const nextTerrains = draft.segments.map((segment) => (isManualStageEditorTerrain(segment.terrain)
    ? segment.terrain
    : classifyAutoStageEditorBaseTerrain(segment)));
  const climbs = detectStageEditorClimbs(draft.waypoints);
  draft.climbs = climbs.map(({ startIndex: _startIndex, topIndex: _topIndex, topElevation: _topElevation, ...climb }) => climb);

  climbs.forEach((climb) => {
    const climbTerrain = classifyAutoClimbTerrain(climb);
    if (!climbTerrain) return;
    for (let index = climb.startIndex; index < climb.topIndex; index += 1) {
      if (!isManualStageEditorTerrain(nextTerrains[index])) {
        nextTerrains[index] = climbTerrain;
      }
    }
  });

  let descentStartIndex: number | null = null;
  let descentDistanceKm = 0;
  const commitDescent = (endExclusive: number): void => {
    if (descentStartIndex == null || descentDistanceKm <= STAGE_EDITOR_AUTO_DESCENT_MIN_DISTANCE_KM) {
      descentStartIndex = null;
      descentDistanceKm = 0;
      return;
    }

    for (let index = descentStartIndex; index < endExclusive; index += 1) {
      if (!isManualStageEditorTerrain(nextTerrains[index]) && nextTerrains[index] === 'Flat') {
        nextTerrains[index] = 'Abfahrt';
      }
    }

    descentStartIndex = null;
    descentDistanceKm = 0;
  };

  for (let index = 0; index < draft.segments.length; index += 1) {
    const segment = draft.segments[index];
    if (segment && segment.gradientPercent < STAGE_EDITOR_AUTO_DESCENT_MIN_GRADIENT) {
      if (descentStartIndex == null) descentStartIndex = index;
      descentDistanceKm += segment.lengthKm;
      continue;
    }
    commitDescent(index);
  }
  commitDescent(draft.segments.length);

  draft.segments.forEach((segment, index) => {
    if (!isManualStageEditorTerrain(segment.terrain)) {
      segment.terrain = nextTerrains[index];
    }
  });

  draft.waypoints = buildStageEditorWaypointsFromSegments(draft.segments);

  draft.suggestedProfile = suggestStageEditorProfile(draft);
}

function syncStageEditorDerivedState(draft: StageEditorDraft): void {
  recalculateStageEditorSegmentStartElevations(draft);
  syncStageEditorDraftStats(draft);
  applyAutomaticStageEditorTerrain(draft);
  draft.waypoints = buildStageEditorWaypointsFromSegments(draft.segments);
  syncStageEditorDraftStats(draft);
}

function ensureStageEditorBoundaryMarkers(draft: StageEditorDraft): void {
  const firstSegment = draft.segments[0];
  const lastSegment = draft.segments[draft.segments.length - 1];
  if (!firstSegment || !lastSegment) return;

  if (!firstSegment.markers.some((marker) => marker.type === 'start')) {
    firstSegment.markers = sortStageMarkers([{ type: 'start', name: null, cat: null }, ...firstSegment.markers]);
  }

  if (!lastSegment.endMarkers.some((marker) => isFinishMarkerType(marker.type))) {
    lastSegment.endMarkers = sortStageMarkers([...lastSegment.endMarkers, { type: 'finish_flat', name: null, cat: null }]);
  }

  draft.waypoints = buildStageEditorWaypointsFromSegments(draft.segments);
}

function renderSegmentMarkerRows(markers: StageMarker[], segmentIndex: number, totalSegments: number, scope: 'start' | 'end'): string {
  if (markers.length === 0) {
    return '<div class="stage-editor-marker-empty">Keine Marker</div>';
  }

  return `<div class="stage-editor-marker-list">${markers.map((marker, markerIndex) => {
    const lockedStart = scope === 'start' && segmentIndex === 0 && marker.type === 'start';
    const finishMarkerCount = markers.filter((entry) => isFinishMarkerType(entry.type)).length;
    const lockedFinish = scope === 'end' && segmentIndex === totalSegments - 1 && isFinishMarkerType(marker.type) && finishMarkerCount === 1;
    const canRemove = !(lockedStart || lockedFinish);

    return `
      <div class="stage-editor-marker-row">
        <select data-field="markerType" data-marker-scope="${scope}" data-marker-index="${markerIndex}">${markerTypeOptionsHtml(marker.type, scope, segmentIndex, totalSegments)}</select>
        <input type="text" value="${esc(marker.name ?? '')}" data-field="markerName" data-marker-scope="${scope}" data-marker-index="${markerIndex}" placeholder="Name" />
        <select data-field="markerCat" data-marker-scope="${scope}" data-marker-index="${markerIndex}">${markerCategoryOptionsHtml(marker.cat)}</select>
        <button type="button" class="btn btn-danger btn-xs" data-segment-action="remove-marker" data-marker-scope="${scope}" data-marker-index="${markerIndex}" data-segment-index="${segmentIndex}" ${canRemove ? '' : 'disabled'}>Ãƒâ€”</button>
      </div>`;
  }).join('')}</div>`;
}

function updateStageEditorMarker(segmentIndex: number, markerIndex: number, scope: 'start' | 'end', field: 'markerType' | 'markerName' | 'markerCat', rawValue: string): void {
  if (!state.stageEditorDraft) return;
  const segment = state.stageEditorDraft.segments[segmentIndex];
  if (!segment) return;
  const markers = scope === 'start' ? segment.markers : segment.endMarkers;
  const marker = markers[markerIndex];
  if (!marker) return;

  if (field === 'markerType') {
    marker.type = rawValue as StageMarkerType;
    const normalizedMarker = normalizeMarkerForType(marker);
    marker.name = normalizedMarker.name;
    marker.cat = normalizedMarker.cat;
    if (isFinishMarkerType(marker.type)) {
      const nextMarkers = markers.filter((entry, index) => index === markerIndex || !isFinishMarkerType(entry.type));
      if (scope === 'start') {
        segment.markers = nextMarkers;
      } else {
        segment.endMarkers = nextMarkers;
      }
    }
  } else if (field === 'markerName') {
    marker.name = rawValue.trim() || null;
  } else if (field === 'markerCat') {
    marker.cat = rawValue ? rawValue as StageMarkerCategory : null;
  }

  if (scope === 'start') {
    segment.markers = sortStageMarkers(segment.markers);
  } else {
    segment.endMarkers = sortStageMarkers(segment.endMarkers);
  }
  syncStageEditorDerivedState(state.stageEditorDraft);
  ensureStageEditorBoundaryMarkers(state.stageEditorDraft);
  renderStageEditor();
}

function addStageEditorMarker(segmentIndex: number, scope: 'start' | 'end'): void {
  if (!state.stageEditorDraft) return;
  const segment = state.stageEditorDraft.segments[segmentIndex];
  if (!segment) return;
  const nextMarker: StageMarker = scope === 'start'
    ? (segmentIndex === 0 && !segment.markers.some((marker) => marker.type === 'start')
        ? { type: 'start', name: 'Start', cat: null }
        : { type: 'climb_start', name: null, cat: null })
    : (segmentIndex === state.stageEditorDraft.segments.length - 1 && !segment.endMarkers.some((marker) => isFinishMarkerType(marker.type))
        ? { type: 'finish_flat', name: 'Ziel', cat: null }
        : { type: 'sprint_intermediate', name: null, cat: 'Sprint' as StageMarkerCategory });
  if (scope === 'start') {
    segment.markers.push(nextMarker);
    segment.markers = sortStageMarkers(segment.markers);
  } else {
    segment.endMarkers.push(nextMarker);
    segment.endMarkers = sortStageMarkers(segment.endMarkers);
  }
  syncStageEditorDerivedState(state.stageEditorDraft);
  ensureStageEditorBoundaryMarkers(state.stageEditorDraft);
  renderStageEditor();
}

function removeStageEditorMarker(segmentIndex: number, markerIndex: number, scope: 'start' | 'end'): void {
  if (!state.stageEditorDraft) return;
  const segment = state.stageEditorDraft.segments[segmentIndex];
  if (!segment) return;
  if (scope === 'start') {
    segment.markers.splice(markerIndex, 1);
  } else {
    segment.endMarkers.splice(markerIndex, 1);
  }
  syncStageEditorDerivedState(state.stageEditorDraft);
  ensureStageEditorBoundaryMarkers(state.stageEditorDraft);
  renderStageEditor();
}

function initializeStageEditorForm(): void {
  $<HTMLSelectElement>('stage-editor-profile').innerHTML = stageProfileOptionsHtml('Flat');
  $('stage-editor-chart').innerHTML = '<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';
  $('stage-editor-climbs').innerHTML = '<p class="text-muted">Climb-VorschlÃƒÂ¤ge erscheinen nach dem Import.</p>';
}

function getStageEditorSegmentStartKm(draft: StageEditorDraft, index: number): number {
  let kmMark = 0;
  for (let segmentIndex = 0; segmentIndex < index; segmentIndex += 1) {
    kmMark += draft.segments[segmentIndex]?.lengthKm ?? 0;
  }
  return roundStageEditorKm(kmMark);
}

function getStageEditorSegmentEndElevation(segment: StageEditorSegment): number {
  return Math.round(segment.startElevation + ((segment.lengthKm * 1000) * (segment.gradientPercent / 100)));
}

function resolveFirstFreePositiveInteger(values: number[]): number {
  const used = new Set(values.filter((value) => Number.isInteger(value) && value > 0));
  let candidate = 1;
  while (used.has(candidate)) {
    candidate += 1;
  }
  return candidate;
}

function resolveNextFreeStageEditorStageId(): number {
  return resolveFirstFreePositiveInteger(state.stageEditorExistingStages.map((stage) => stage.stageId));
}

function resolveNextFreeStageEditorRaceId(): number {
  return resolveFirstFreePositiveInteger([
    ...state.stageEditorExistingStages.map((stage) => stage.raceId),
    ...state.races.map((race) => race.id),
  ]);
}

function setStageEditorDefaults(draft: StageEditorDraft): void {
  const profileSelect = $<HTMLSelectElement>('stage-editor-profile');
  profileSelect.innerHTML = stageProfileOptionsHtml(draft.suggestedProfile);
  profileSelect.value = draft.suggestedProfile;

  $<HTMLInputElement>('stage-editor-stage-id').value = String(resolveNextFreeStageEditorStageId());
  $<HTMLInputElement>('stage-editor-race-id').value = String(resolveNextFreeStageEditorRaceId());

  const detailsFileInput = $<HTMLInputElement>('stage-editor-details-file');
  if (!detailsFileInput.value.trim()) {
    detailsFileInput.value = `${slugifyFileName(draft.routeName)}.csv`;
  }

  const dateInput = $<HTMLInputElement>('stage-editor-date');
  if (!dateInput.value && state.gameState?.currentDate) {
    dateInput.value = state.gameState.currentDate;
  }
}

function setStageEditorMetadataFields(metadata: StageEditorMetadata): void {
  $<HTMLInputElement>('stage-editor-stage-id').value = String(metadata.stageId);
  $<HTMLInputElement>('stage-editor-race-id').value = String(metadata.raceId);
  $<HTMLInputElement>('stage-editor-stage-number').value = String(metadata.stageNumber);
  $<HTMLInputElement>('stage-editor-date').value = metadata.date;
  $<HTMLInputElement>('stage-editor-details-file').value = metadata.detailsCsvFile;
  const profileSelect = $<HTMLSelectElement>('stage-editor-profile');
  profileSelect.innerHTML = stageProfileOptionsHtml(metadata.profile);
  profileSelect.value = metadata.profile;
  $<HTMLInputElement>('stage-editor-final-spread-start').value = String(metadata.finalSpreadStartPercent);
  $<HTMLInputElement>('stage-editor-final-push-start').value = String(metadata.finalPushStartPercent);
  $<HTMLInputElement>('stage-editor-final-spread-difficulty').value = String(metadata.finalSpreadDifficultyMultiplier);
  $<HTMLInputElement>('stage-editor-crash-multiplier').value = String(metadata.crashIncidentMultiplier);
  $<HTMLInputElement>('stage-editor-mechanical-multiplier').value = String(metadata.mechanicalIncidentMultiplier);
}

function renderStageEditorExistingStages(): void {
  const select = $<HTMLSelectElement>('stage-editor-existing-stage');
  const button = $<HTMLButtonElement>('btn-stage-editor-load-existing');
  const hint = $('stage-editor-existing-hint');

  if (!state.stageEditorExistingStagesLoaded) {
    select.innerHTML = '<option value="">CSV-Stages werden geladen...</option>';
    button.disabled = true;
    hint.textContent = 'CSV-Stages werden beim Ãƒâ€“ffnen des Editors geladen.';
    return;
  }

  if (state.stageEditorExistingStages.length === 0) {
    select.innerHTML = '<option value="">Keine CSV-Stages gefunden</option>';
    button.disabled = true;
    hint.textContent = 'Keine EintrÃƒÂ¤ge in data/csv/stages.csv gefunden.';
    return;
  }

  select.innerHTML = state.stageEditorExistingStages.map((stage) => {
    const label = [
      stage.raceName ?? `Race ${stage.raceId}`,
      `Etappe ${stage.stageNumber}`,
      stage.date,
      stage.profile,
      stage.detailsCsvFile,
    ].join(' Ã‚Â· ');
    return `<option value="${stage.stageId}">${esc(label)}</option>`;
  }).join('');
  button.disabled = false;
  hint.textContent = `${state.stageEditorExistingStages.length} CSV-Stages verfÃƒÂ¼gbar. Export lÃƒÂ¤dt neue Dateien herunter und schreibt nichts automatisch.`;
}

async function loadStageEditorExistingStages(force = false): Promise<void> {
  if (state.stageEditorExistingStagesLoaded && !force) {
    renderStageEditorExistingStages();
    return;
  }

  state.stageEditorExistingStagesLoaded = false;
  renderStageEditorExistingStages();
  const res = await api.listStageEditorStages();
  state.stageEditorExistingStagesLoaded = true;
  if (!res.success || !res.data) {
    state.stageEditorExistingStages = [];
    renderStageEditorExistingStages();
    $('stage-editor-existing-hint').textContent = `CSV-Stages konnten nicht geladen werden: ${res.error ?? 'Unbekannter Fehler'}`;
    return;
  }
  state.stageEditorExistingStages = res.data.stages;
  renderStageEditorExistingStages();
}

function renderStageEditorScoreBadge(score: number, minScore: number, maxScore: number): string {
  let relativeRatio = 0;
  if (maxScore > minScore) {
    relativeRatio = Math.max(0, Math.min(1, (score - minScore) / (maxScore - minScore)));
  } else if (maxScore > 0) {
    relativeRatio = 1;
  }

  const colorFactor = Math.cbrt(relativeRatio);
  const hue = Math.round(128 - (colorFactor * 128));
  const lightness = Math.round(38 - (colorFactor * 14));
  const backgroundAlpha = 0.2 + (colorFactor * 0.18);
  const borderAlpha = 0.32 + (colorFactor * 0.24);
  const style = `--stage-editor-score-hue:${hue};--stage-editor-score-lightness:${lightness}%;--stage-editor-score-bg-alpha:${backgroundAlpha.toFixed(2)};--stage-editor-score-border-alpha:${borderAlpha.toFixed(2)};`;
  return `<span class="stage-editor-score-badge" style="${style}">${score}</span>`;
}

function resolveStageEditorCategoryClassName(category: StageMarkerCategory | null | undefined): string | null {
  if (category == null || category === 'Sprint') {
    return null;
  }
  if (category === 'HC') {
    return 'is-hc';
  }
  return `is-cat-${category}`;
}

function renderStageEditorCategoryBadge(category: StageEditorClimbOverviewRow['category']): string {
  const className = resolveStageEditorCategoryClassName(category);
  if (!className || category == null) {
    return '<span class="stage-editor-category-empty" title="Keine Kategorie am Climb-Endmarker gepflegt">Ã¢â‚¬â€œ</span>';
  }
  return `<span class="race-sim-stage-points-category-badge ${className}">Kat. ${esc(category)}</span>`;
}

function renderStageEditorProfileOpenButton(content: string, stageId: number, title: string, climbId?: string): string {
  const climbAttr = climbId ? ` data-stage-profile-open-climb-id="${esc(climbId)}"` : '';
  return `<button type="button" class="stage-editor-inline-button" data-stage-profile-open-stage-id="${stageId}"${climbAttr} title="${esc(title)}">${content}</button>`;
}

function renderStageEditorStageScorePopover(row: StageEditorStageOverviewRow): string {
  const climbs = state.stageEditorClimbRows
    .filter((climb) => climb.stageId === row.stageId && climb.category != null)
    .sort((left, right) => left.climbIndex - right.climbIndex || left.endKm - right.endKm);

  if (climbs.length === 0) {
    return '<div class="season-standings-country-popover-card"><div class="season-standings-country-popover-empty">Keine kategorisierten Anstiege in dieser Etappe.</div></div>';
  }

  return `
    <div class="season-standings-country-popover-card">
      <div class="season-standings-country-popover-head"><strong>Kategorisierte Anstiege</strong></div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-climb stage-editor-score-popover-grid-head">
        <span>Nr.</span>
        <span>Pos.</span>
        <span>Anstieg</span>
        <span>LÃƒÂ¤nge</span>
        <span>ÃƒËœ</span>
        <span>Score</span>
        <span>Kat.</span>
      </div>
      ${climbs.map((climb) => `
        <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-climb">
          <strong>${climb.climbIndex}.</strong>
          <span>${climb.placementKm.toFixed(1).replace('.', ',')}</span>
          <span>${esc(climb.name)}</span>
          <span>${formatKm(climb.distanceKm)}</span>
          <span>${formatGradient(climb.avgGradient)}</span>
          <strong>${climb.climbScore}</strong>
          <span>${renderStageEditorCategoryBadge(climb.category)}</span>
        </div>
      `).join('')}
    </div>`;
}

function renderStageEditorClimbScorePopover(row: StageEditorClimbOverviewRow): string {
  const stage = state.stageEditorStageRows.find((entry) => entry.stageId === row.stageId);
  return `
    <div class="season-standings-country-popover-card">
      <div class="season-standings-country-popover-head"><strong>Etappenkontext</strong></div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-head stage-editor-score-popover-grid-head-compact">
        <span>Etappe</span>
        <span>Stage Score</span>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact">
        <span>${esc(row.raceName)} Ã‚Â· ${row.stageNumber}</span>
        <strong>${stage?.profileScore ?? 0}</strong>
      </div>
    </div>`;
}

function renderStageEditorScoreControl(score: number, minScore: number, maxScore: number, stageId: number, popoverContent: string, title: string, climbId?: string): string {
  return `
    <div class="season-standings-country-anchor stage-editor-score-anchor" tabindex="0">
      ${renderStageEditorProfileOpenButton(renderStageEditorScoreBadge(score, minScore, maxScore), stageId, title, climbId)}
      <div class="season-standings-country-popover">
        ${popoverContent}
      </div>
    </div>`;
}

function renderStageEditorStagesOverview(): void {
  const head = $('stage-editor-stages-head');
  const body = $('stage-editor-stages-body');
  const empty = $('stage-editor-stages-empty');
  const meta = $('stage-editor-stages-meta');
  const rows = sortStageEditorStageRows(state.stageEditorStageRows);
  const minStageScore = rows.length > 0 ? Math.min(...rows.map((row) => row.profileScore)) : 0;
  const maxStageScore = Math.max(0, ...state.stageEditorStageRows.map((row) => row.profileScore));

  head.innerHTML = `<tr>
    ${renderStageEditorOverviewHeader('Nummer', 'stageId', state.stageEditorStagesSort.key, state.stageEditorStagesSort.direction, 'stages')}
    ${renderStageEditorOverviewHeader('Flagge', 'countryCode', state.stageEditorStagesSort.key, state.stageEditorStagesSort.direction, 'stages')}
    ${renderStageEditorOverviewHeader('Rennen', 'raceName', state.stageEditorStagesSort.key, state.stageEditorStagesSort.direction, 'stages')}
    ${renderStageEditorOverviewHeader('Etappe', 'stageNumber', state.stageEditorStagesSort.key, state.stageEditorStagesSort.direction, 'stages')}
    ${renderStageEditorOverviewHeader('Stage Score', 'profileScore', state.stageEditorStagesSort.key, state.stageEditorStagesSort.direction, 'stages')}
    ${renderStageEditorOverviewHeader('Profil', 'profile', state.stageEditorStagesSort.key, state.stageEditorStagesSort.direction, 'stages')}
    ${renderStageEditorOverviewHeader('LÃƒÂ¤nge', 'distanceKm', state.stageEditorStagesSort.key, state.stageEditorStagesSort.direction, 'stages')}
    ${renderStageEditorOverviewHeader('HÃƒÂ¶henmeter', 'elevationGainMeters', state.stageEditorStagesSort.key, state.stageEditorStagesSort.direction, 'stages')}
    ${renderStageEditorOverviewHeader('Sprints', 'sprintCount', state.stageEditorStagesSort.key, state.stageEditorStagesSort.direction, 'stages')}
    ${renderStageEditorOverviewHeader('Bergwertungen', 'climbCount', state.stageEditorStagesSort.key, state.stageEditorStagesSort.direction, 'stages')}
  </tr>`;

  body.innerHTML = rows.map((row) => `
    <tr>
      <td>${row.stageId}</td>
      <td class="results-flag-col-cell">${renderResultsFlagColumn(row.countryCode)}</td>
      <td>${renderStageEditorProfileOpenButton(`<strong>${esc(row.raceName)}</strong>`, row.stageId, `${row.raceName} Ã‚Â· Etappe ${row.stageNumber} ÃƒÂ¶ffnen`)}</td>
      <td>${row.stageNumber}</td>
      <td>${renderStageEditorScoreControl(row.profileScore, minStageScore, maxStageScore, row.stageId, renderStageEditorStageScorePopover(row), `${row.raceName} Ã‚Â· Etappe ${row.stageNumber} ÃƒÂ¶ffnen`)}</td>
      <td>${renderStageEditorProfileOpenButton(renderStageProfileBadge(row.profile), row.stageId, `${row.raceName} Ã‚Â· Etappe ${row.stageNumber} ÃƒÂ¶ffnen`)}</td>
      <td>${formatKm(row.distanceKm)}</td>
      <td>${row.elevationGainMeters.toLocaleString('de-DE')} m</td>
      <td>${row.sprintCount}</td>
      <td>${row.climbCount}</td>
    </tr>`).join('');

  empty.classList.toggle('hidden', rows.length > 0 || state.stageEditorOverviewLoading);
  meta.textContent = state.stageEditorOverviewLoading
    ? 'CSV-Etappen werden geladen.'
    : `${rows.length} Etappen aus den CSV-Daten.`;
}

function renderStageEditorClimbsOverview(): void {
  const head = $('stage-editor-climbs-head');
  const body = $('stage-editor-climbs-body');
  const empty = $('stage-editor-climbs-empty');
  const meta = $('stage-editor-climbs-meta');
  const rows = sortStageEditorClimbRows(state.stageEditorClimbRows);
  const minClimbScore = rows.length > 0 ? Math.min(...rows.map((row) => row.climbScore)) : 0;
  const maxClimbScore = Math.max(0, ...state.stageEditorClimbRows.map((row) => row.climbScore));

  head.innerHTML = `<tr>
    ${renderStageEditorOverviewHeader('Platzierung', 'placementKm', state.stageEditorClimbsSort.key, state.stageEditorClimbsSort.direction, 'climbs')}
    ${renderStageEditorOverviewHeader('Name', 'name', state.stageEditorClimbsSort.key, state.stageEditorClimbsSort.direction, 'climbs')}
    ${renderStageEditorOverviewHeader('Kat.', 'category', state.stageEditorClimbsSort.key, state.stageEditorClimbsSort.direction, 'climbs')}
    ${renderStageEditorOverviewHeader('Climb Score', 'climbScore', state.stageEditorClimbsSort.key, state.stageEditorClimbsSort.direction, 'climbs')}
    ${renderStageEditorOverviewHeader('Flagge', 'countryCode', state.stageEditorClimbsSort.key, state.stageEditorClimbsSort.direction, 'climbs')}
    ${renderStageEditorOverviewHeader('Rennen', 'raceName', state.stageEditorClimbsSort.key, state.stageEditorClimbsSort.direction, 'climbs')}
    ${renderStageEditorOverviewHeader('Etappe', 'stageNumber', state.stageEditorClimbsSort.key, state.stageEditorClimbsSort.direction, 'climbs')}
    ${renderStageEditorOverviewHeader('HÃƒÂ¶henmeter', 'gainMeters', state.stageEditorClimbsSort.key, state.stageEditorClimbsSort.direction, 'climbs')}
    ${renderStageEditorOverviewHeader('LÃƒÂ¤nge', 'distanceKm', state.stageEditorClimbsSort.key, state.stageEditorClimbsSort.direction, 'climbs')}
    ${renderStageEditorOverviewHeader('ÃƒËœ-Steigung', 'avgGradient', state.stageEditorClimbsSort.key, state.stageEditorClimbsSort.direction, 'climbs')}
    ${renderStageEditorOverviewHeader('Steilster Abschnitt', 'maxGradient', state.stageEditorClimbsSort.key, state.stageEditorClimbsSort.direction, 'climbs')}
  </tr>`;

  body.innerHTML = rows.map((row) => `
    <tr>
      <td>km ${row.placementKm.toFixed(1).replace('.', ',')}</td>
      <td><strong>${esc(row.name)}</strong></td>
      <td>${renderStageEditorCategoryBadge(row.category)}</td>
      <td>${renderStageEditorScoreControl(row.climbScore, minClimbScore, maxClimbScore, row.stageId, renderStageEditorClimbScorePopover(row), `${row.raceName} Ã‚Â· Etappe ${row.stageNumber} Ã‚Â· ${row.name} ÃƒÂ¶ffnen`, row.id)}</td>
      <td class="results-flag-col-cell">${renderResultsFlagColumn(row.countryCode)}</td>
      <td>${renderStageEditorProfileOpenButton(esc(row.raceName), row.stageId, `${row.raceName} Ã‚Â· Etappe ${row.stageNumber} Ã‚Â· ${row.name} ÃƒÂ¶ffnen`, row.id)}</td>
      <td>${row.stageNumber}</td>
      <td>${row.gainMeters.toLocaleString('de-DE')} m</td>
      <td>${formatKm(row.distanceKm)}</td>
      <td>${formatGradient(row.avgGradient)}</td>
      <td>${formatGradient(row.maxGradient)}</td>
    </tr>`).join('');

  empty.classList.toggle('hidden', rows.length > 0 || state.stageEditorOverviewLoading);
  meta.textContent = state.stageEditorOverviewLoading
    ? 'CSV-Anstiege werden geladen.'
    : `${rows.length} Anstiege aus den CSV-Daten.`;
}

async function loadStageEditorOverview(force = false): Promise<void> {
  if (state.stageEditorOverviewLoaded && !force) {
    renderStageEditorStagesOverview();
    renderStageEditorClimbsOverview();
    return;
  }

  state.stageEditorOverviewLoading = true;
  renderStageEditorStagesOverview();
  renderStageEditorClimbsOverview();
  const res = await api.getStageEditorOverview();
  state.stageEditorOverviewLoading = false;
  state.stageEditorOverviewLoaded = true;

  if (!res.success || !res.data) {
    state.stageEditorOverviewLoaded = false;
    state.stageEditorStageRows = [];
    state.stageEditorClimbRows = [];
    renderStageEditorStagesOverview();
    renderStageEditorClimbsOverview();
    $('stage-editor-stages-meta').textContent = `Stages konnten nicht geladen werden: ${res.error ?? 'Unbekannter Fehler'}`;
    $('stage-editor-climbs-meta').textContent = `Climbs konnten nicht geladen werden: ${res.error ?? 'Unbekannter Fehler'}`;
    return;
  }

  state.stageEditorStageRows = res.data.stages;
  state.stageEditorClimbRows = res.data.climbs;
  renderStageEditorStagesOverview();
  renderStageEditorClimbsOverview();
}

function updateStageEditorSegment(index: number, field: 'segmentLengthKm' | 'segmentGradientPercent', rawValue: string): void {
  if (!state.stageEditorDraft) return;
  const segment = state.stageEditorDraft.segments[index];
  if (!segment) return;

  if (field === 'segmentLengthKm') {
    const nextLengthKm = Number.parseFloat(rawValue || String(segment.lengthKm));
    if (!Number.isFinite(nextLengthKm)) return;
    segment.lengthKm = roundStageEditorKm(nextLengthKm);
  }

  if (field === 'segmentGradientPercent') {
    const nextGradientPercent = Number.parseFloat(rawValue || '0');
    if (!Number.isFinite(nextGradientPercent) || segment.lengthKm <= 0) return;
    segment.gradientPercent = roundStageEditorOneDecimal(nextGradientPercent);
  }

  syncStageEditorDerivedState(state.stageEditorDraft);
  ensureStageEditorBoundaryMarkers(state.stageEditorDraft);
  renderStageEditor();
}

function getStageEditorIssues(draft: StageEditorDraft | null): string[] {
  if (!draft) return ['Noch keine Strecke importiert.'];

  const issues: string[] = [];
  if (draft.segments.length === 0) {
    issues.push('Mindestens ein Segment ist erforderlich.');
    return issues;
  }

  if (!draft.segments[0]?.markers.some((marker) => marker.type === 'start')) {
    issues.push('Das erste Segment muss als Start markiert sein.');
  }

  const lastSegment = draft.segments[draft.segments.length - 1];
  if (!(lastSegment.endMarkers ?? []).some((marker) => isFinishMarkerType(marker.type))) {
    issues.push('Das letzte Segment muss per Endmarker als Ziel markiert sein.');
  }

  draft.segments.forEach((segment, segmentIndex) => {
    getStageEditorSegmentIssuesAt(draft, segmentIndex).forEach((issue) => {
      issues.push(`Segment ${segmentIndex + 1}: ${issue}`);
    });

    [...(segment.markers ?? []), ...(segment.endMarkers ?? [])].forEach((marker) => {
      if (marker.cat != null && !STAGE_MARKER_CATEGORIES.includes(marker.cat)) {
        issues.push(`Segment ${segmentIndex + 1}: UngÃƒÂ¼ltige Marker-Kategorie ${marker.cat}.`);
      }
    });
  });

  return issues;
}

function getStageEditorMetadataErrors(): string[] {
  const errors: string[] = [];
  const stageId = Number($<HTMLInputElement>('stage-editor-stage-id').value);
  const raceId = Number($<HTMLInputElement>('stage-editor-race-id').value);
  const stageNumber = Number($<HTMLInputElement>('stage-editor-stage-number').value);
  const date = $<HTMLInputElement>('stage-editor-date').value.trim();
  const detailsFile = $<HTMLInputElement>('stage-editor-details-file').value.trim();
  const finalSpreadStartPercent = Number($<HTMLInputElement>('stage-editor-final-spread-start').value);
  const finalPushStartPercent = Number($<HTMLInputElement>('stage-editor-final-push-start').value);
  const finalSpreadDifficultyMultiplier = Number($<HTMLInputElement>('stage-editor-final-spread-difficulty').value);
  const crashIncidentMultiplier = Number($<HTMLInputElement>('stage-editor-crash-multiplier').value);
  const mechanicalIncidentMultiplier = Number($<HTMLInputElement>('stage-editor-mechanical-multiplier').value);

  if (!Number.isInteger(stageId) || stageId <= 0) errors.push('Stage-ID fehlt oder ist ungÃƒÂ¼ltig.');
  if (!Number.isInteger(raceId) || raceId <= 0) errors.push('Race-ID fehlt oder ist ungÃƒÂ¼ltig.');
  if (!Number.isInteger(stageNumber) || stageNumber <= 0) errors.push('Etappennummer fehlt oder ist ungÃƒÂ¼ltig.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push('Datum muss im Format YYYY-MM-DD vorliegen.');
  if (!/^[A-Za-z0-9_.-]+\.csv$/.test(detailsFile) || detailsFile.includes('/')) {
    errors.push('Details-Datei muss ein Dateiname mit .csv-Endung ohne Pfad sein.');
  }
  if (!Number.isFinite(finalSpreadStartPercent) || finalSpreadStartPercent < 0 || finalSpreadStartPercent > 100) {
    errors.push('Final Spread Start % muss zwischen 0 und 100 liegen.');
  }
  if (!Number.isFinite(finalPushStartPercent) || finalPushStartPercent < 0 || finalPushStartPercent > 100) {
    errors.push('Final Push Start % muss zwischen 0 und 100 liegen.');
  }
  if (!Number.isFinite(finalSpreadDifficultyMultiplier) || finalSpreadDifficultyMultiplier <= 0) {
    errors.push('Final Spread Multiplikator muss groesser als 0 sein.');
  }
  if (!Number.isFinite(crashIncidentMultiplier) || crashIncidentMultiplier <= 0) {
    errors.push('Sturz-Multiplikator muss groesser als 0 sein.');
  }
  if (!Number.isFinite(mechanicalIncidentMultiplier) || mechanicalIncidentMultiplier <= 0) {
    errors.push('Defekt-Multiplikator muss groesser als 0 sein.');
  }

  return errors;
}

function readStageEditorMetadata(): StageEditorMetadata {
  return {
    stageId: Number($<HTMLInputElement>('stage-editor-stage-id').value),
    raceId: Number($<HTMLInputElement>('stage-editor-race-id').value),
    stageNumber: Number($<HTMLInputElement>('stage-editor-stage-number').value),
    date: $<HTMLInputElement>('stage-editor-date').value.trim(),
    profile: $<HTMLSelectElement>('stage-editor-profile').value as StageProfile,
    detailsCsvFile: $<HTMLInputElement>('stage-editor-details-file').value.trim(),
    startElevation: state.stageEditorDraft?.segments[0]?.startElevation ?? 0,
    finalSpreadStartPercent: Number($<HTMLInputElement>('stage-editor-final-spread-start').value),
    finalPushStartPercent: Number($<HTMLInputElement>('stage-editor-final-push-start').value),
    finalSpreadDifficultyMultiplier: Number($<HTMLInputElement>('stage-editor-final-spread-difficulty').value),
    crashIncidentMultiplier: Number($<HTMLInputElement>('stage-editor-crash-multiplier').value),
    mechanicalIncidentMultiplier: Number($<HTMLInputElement>('stage-editor-mechanical-multiplier').value),
  };
}

function downloadTextFile(fileName: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function renderStageEditorChart(draft: StageEditorDraft | null): string {
  if (!draft || draft.waypoints.length < 2) {
    return '<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';
  }

  const width = 920;
  const height = 280;
  const paddingX = 24;
  const paddingY = 20;
  const waypoints = draft.waypoints;
  const totalDistanceKm = waypoints[waypoints.length - 1].kmMark;
  const minElevation = Math.min(...waypoints.map((waypoint) => waypoint.elevation));
  const maxElevation = Math.max(...waypoints.map((waypoint) => waypoint.elevation));
  const elevationRange = Math.max(1, maxElevation - minElevation);
  const points = waypoints.map((waypoint) => {
    const x = paddingX + (waypoint.kmMark / Math.max(totalDistanceKm, 0.1)) * (width - paddingX * 2);
    const y = height - paddingY - ((waypoint.elevation - minElevation) / elevationRange) * (height - paddingY * 2);
    return { x, y, waypoint };
  });

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${(width - paddingX).toFixed(1)} ${(height - paddingY).toFixed(1)} L ${paddingX.toFixed(1)} ${(height - paddingY).toFixed(1)} Z`;
  const markerLines = points
    .filter((point) => point.waypoint.markers.length > 0)
    .map((point) => `
      <line x1="${point.x.toFixed(1)}" y1="${paddingY}" x2="${point.x.toFixed(1)}" y2="${(height - paddingY).toFixed(1)}" class="stage-editor-chart-marker-line" />
      <text x="${point.x.toFixed(1)}" y="14" class="stage-editor-chart-marker-label">${esc(markerLabelValue(point.waypoint.markers))}</text>`)
    .join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Stage-Profil ${esc(draft.routeName)}">
      <defs>
        <linearGradient id="stage-editor-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="rgba(96, 165, 250, 0.38)"></stop>
          <stop offset="100%" stop-color="rgba(14, 165, 233, 0.04)"></stop>
        </linearGradient>
      </defs>
      <line x1="${paddingX}" y1="${height - paddingY}" x2="${width - paddingX}" y2="${height - paddingY}" class="stage-editor-chart-axis" />
      <line x1="${paddingX}" y1="${paddingY}" x2="${paddingX}" y2="${height - paddingY}" class="stage-editor-chart-axis" />
      ${markerLines}
      <path d="${areaPath}" fill="url(#stage-editor-area)"></path>
      <path d="${linePath}" class="stage-editor-chart-line"></path>
      ${points.map((point) => `<circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="3.5" class="stage-editor-chart-point"></circle>`).join('')}
      <text x="${paddingX}" y="${paddingY - 4}" class="stage-editor-chart-scale">${Math.round(maxElevation)} m</text>
      <text x="${paddingX}" y="${height - 4}" class="stage-editor-chart-scale">${Math.round(minElevation)} m</text>
      <text x="${width - paddingX}" y="${height - 4}" text-anchor="end" class="stage-editor-chart-scale">${formatKm(totalDistanceKm)}</text>
    </svg>`;
}

function renderStageEditor(): void {
  renderStageEditorExistingStages();
  const draft = state.stageEditorDraft;
  const summary = $('stage-editor-import-summary');
  const warnings = $('stage-editor-warnings');
  const climbs = $('stage-editor-climbs');
  const emptyState = $('stage-editor-empty');
  const chart = $('stage-editor-chart');
  const tbody = $('stage-editor-waypoints-body');
  const exportHint = $('stage-editor-export-hint');
  const exportButton = $<HTMLButtonElement>('btn-stage-editor-export');

  if (!draft) {
    summary.innerHTML = '';
    warnings.innerHTML = '';
    climbs.innerHTML = '<p class="text-muted">Climb-VorschlÃƒÂ¤ge erscheinen nach dem Import.</p>';
    emptyState.classList.remove('hidden');
    chart.innerHTML = renderStageEditorChart(null);
    tbody.innerHTML = `<tr><td colspan="${STAGE_EDITOR_TABLE_COLUMN_COUNT}" class="text-muted">Keine Segmente vorhanden.</td></tr>`;
    exportHint.textContent = 'Importiere oder lade zuerst eine Strecke. Export erzeugt Downloads und ÃƒÂ¼berschreibt keine Masterdateien automatisch.';
    exportButton.disabled = true;
    return;
  }

  emptyState.classList.add('hidden');
  const issues = getStageEditorIssues(draft);
  const metadataErrors = getStageEditorMetadataErrors();

  summary.innerHTML = `
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Route</span><strong>${esc(draft.routeName)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Distanz</span><strong>${formatKm(draft.totalDistanceKm)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Anstieg</span><strong>${draft.elevationGainMeters} m</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Profil</span><strong>${esc(draft.suggestedProfile)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Segmente</span><strong>${draft.segments.length}</strong></div>`;

  const alertItems = [...draft.warnings, ...issues, ...metadataErrors];
  warnings.innerHTML = alertItems.length === 0
    ? '<div class="stage-editor-alert stage-editor-alert-ok">Export bereit. Keine Validierungsfehler.</div>'
    : alertItems.map((item) => `<div class="stage-editor-alert">${esc(item)}</div>`).join('');

  climbs.innerHTML = draft.climbs.length === 0
    ? '<p class="text-muted">Keine relevanten Climb-VorschlÃƒÂ¤ge erkannt.</p>'
    : draft.climbs.map((climb) => `
      <div class="stage-editor-climb">
        <strong>Kat. ${esc(climb.category)}</strong>
        <span>${formatKm(climb.startKm)} - ${formatKm(climb.endKm)}</span>
        <span>${climb.gainMeters} hm Ã‚Â· ${climb.avgGradient.toFixed(1).replace('.', ',')}%</span>
      </div>`).join('');

  chart.innerHTML = renderStageEditorChart(draft);
  tbody.innerHTML = draft.segments.map((segment, index) => `
    <tr data-segment-index="${index}" class="${getStageEditorSegmentIssuesAt(draft, index).length > 0 ? 'stage-editor-segment-row-invalid' : ''}">
      <td class="stage-editor-cell-length"><input type="number" step="0.01" min="0.2" value="${segment.lengthKm.toFixed(2)}" data-field="segmentLengthKm" class="${stageEditorFieldErrorClass(segment.lengthKm < STAGE_EDITOR_MIN_SEGMENT_KM)}"></td>
      <td class="stage-editor-cell-gradient"><input type="number" step="0.1" value="${segment.gradientPercent.toFixed(1)}" data-field="segmentGradientPercent"></td>
      <td class="stage-editor-cell-terrain"><select data-field="terrain">${terrainOptionsHtml(segment.terrain)}</select></td>
      <td class="stage-editor-cell-tech"><input type="number" step="1" min="1" max="10" value="${segment.techLevel}" data-field="techLevel" class="${stageEditorFieldErrorClass(segment.techLevel < 1 || segment.techLevel > 10)}"></td>
      <td class="stage-editor-cell-wind"><input type="number" step="1" min="1" max="10" value="${segment.windExp}" data-field="windExp" class="${stageEditorFieldErrorClass(segment.windExp < 1 || segment.windExp > 10)}"></td>
      <td class="stage-editor-cell-start-markers">
        ${renderSegmentMarkerBlock(segment.markers, index, draft.segments.length, 'start')}
      </td>
      <td class="stage-editor-cell-end-markers">
        ${renderSegmentMarkerBlock(segment.endMarkers, index, draft.segments.length, 'end')}
      </td>
      <td class="stage-editor-row-actions">
        <div class="text-muted">${getStageEditorSegmentEndElevation(segment)} m</div>
        ${renderStageEditorSegmentIssues(draft, index)}
        <button type="button" class="btn btn-secondary btn-xs" data-segment-action="insert" data-segment-index="${index}">+</button>
        ${index === draft.segments.length - 1 ? `<button type="button" class="btn btn-secondary btn-xs" data-segment-action="append" data-segment-index="${index}">+ Ende</button>` : ''}
        ${draft.segments.length > 1 ? `<button type="button" class="btn btn-danger btn-xs" data-segment-action="delete" data-segment-index="${index}">Ãƒâ€”</button>` : ''}
      </td>
    </tr>`).join('');

  exportButton.disabled = alertItems.length > 0;
  exportHint.textContent = alertItems.length > 0
    ? `${alertItems.length} Validierungshinweise vor dem Export.`
    : `Exportiert ${$<HTMLInputElement>('stage-editor-details-file').value || 'stage_details.csv'} und eine stages-Row als Download.`;
}

function updateStageEditorWaypoint(index: number, field: 'startElevation' | keyof StageEditorSegment | 'segmentLengthKm' | 'segmentGradientPercent', rawValue: string): void {
  if (!state.stageEditorDraft) return;
  const segment = state.stageEditorDraft.segments[index];
  if (!segment) return;

  switch (field) {
    case 'startElevation':
      if (index === 0) {
        segment.startElevation = Number.parseInt(rawValue || '0', 10);
      }
      break;
    case 'terrain':
      segment.terrain = rawValue as StageTerrain;
      break;
    case 'techLevel':
      segment.techLevel = Number.parseInt(rawValue || '0', 10);
      break;
    case 'windExp':
      segment.windExp = Number.parseInt(rawValue || '0', 10);
      break;
    case 'segmentLengthKm':
    case 'segmentGradientPercent':
      updateStageEditorSegment(index, field, rawValue);
      return;
    default:
      break;
  }

  syncStageEditorDerivedState(state.stageEditorDraft);
  ensureStageEditorBoundaryMarkers(state.stageEditorDraft);
  renderStageEditor();
}

function insertStageEditorWaypoint(index: number): void {
  if (!state.stageEditorDraft) return;
  const current = state.stageEditorDraft.segments[index];
  if (!current) return;
  const firstLengthKm = roundStageEditorKm(current.lengthKm / 2);
  const secondLengthKm = roundStageEditorKm(current.lengthKm - firstLengthKm);
  if (firstLengthKm < STAGE_EDITOR_MIN_SEGMENT_KM || secondLengthKm < STAGE_EDITOR_MIN_SEGMENT_KM) return;

  const insertedSegment: StageEditorSegment = {
    startElevation: Math.round(current.startElevation + ((firstLengthKm * 1000) * (current.gradientPercent / 100))),
    lengthKm: secondLengthKm,
    gradientPercent: current.gradientPercent,
    terrain: current.terrain,
    techLevel: current.techLevel,
    windExp: current.windExp,
    markers: [],
    endMarkers: [...current.endMarkers],
  };
  current.lengthKm = firstLengthKm;
  current.endMarkers = [];
  state.stageEditorDraft.segments.splice(index + 1, 0, insertedSegment);
  syncStageEditorDerivedState(state.stageEditorDraft);
  ensureStageEditorBoundaryMarkers(state.stageEditorDraft);
  renderStageEditor();
}

function appendStageEditorWaypoint(): void {
  if (!state.stageEditorDraft) return;
  const segments = state.stageEditorDraft.segments;
  const last = segments[segments.length - 1];
  const previous = segments[segments.length - 2] ?? null;
  if (!last) return;

  const previousSegmentLength = previous ? Math.max(STAGE_EDITOR_MIN_SEGMENT_KM, previous.lengthKm) : 1;
  const finishMarkers = last.endMarkers.filter((marker) => isFinishMarkerType(marker.type));
  last.endMarkers = last.endMarkers.filter((marker) => !isFinishMarkerType(marker.type));
  const lastEndElevation = getStageEditorSegmentEndElevation(last);

  segments.push({
    startElevation: lastEndElevation,
    lengthKm: roundStageEditorKm(previousSegmentLength),
    gradientPercent: last.gradientPercent,
    terrain: last.terrain,
    techLevel: last.techLevel,
    windExp: last.windExp,
    markers: [],
    endMarkers: finishMarkers.length > 0 ? finishMarkers : [{ type: 'finish_flat', name: null, cat: null }],
  });

  syncStageEditorDerivedState(state.stageEditorDraft);
  ensureStageEditorBoundaryMarkers(state.stageEditorDraft);
  renderStageEditor();
}

function deleteStageEditorWaypoint(index: number): void {
  if (!state.stageEditorDraft) return;
  if (state.stageEditorDraft.segments.length <= 1) return;
  state.stageEditorDraft.segments.splice(index, 1);
  syncStageEditorDerivedState(state.stageEditorDraft);
  ensureStageEditorBoundaryMarkers(state.stageEditorDraft);
  renderStageEditor();
}

async function onStageEditorImport(): Promise<void> {
  const input = $<HTMLInputElement>('stage-editor-file');
  const file = input.files?.[0];
  if (!file) {
    alert('Bitte zuerst eine GPX- oder TCX-Datei auswÃƒÂ¤hlen.');
    return;
  }

  $('stage-editor-file-hint').textContent = `${file.name} Ã‚Â· ${(file.size / 1024).toFixed(1).replace('.', ',')} KB`;
  showLoading('Route wird importiertÃ¢â‚¬Â¦');
  try {
    const fileContent = await file.text();
    const res = await api.importStageRoute({ fileName: file.name, fileContent });
    if (!res.success || !res.data) {
      alert(`Import fehlgeschlagen: ${res.error ?? 'Unbekannter Fehler'}`);
      return;
    }

    const normalizedDraft = normalizeStageEditorDraft(res.data);
    state.stageEditorDraft = normalizedDraft;
    ensureStageEditorBoundaryMarkers(normalizedDraft);
    setStageEditorDefaults(normalizedDraft);
    renderStageEditor();
    activateView('stage-editor');
  } finally {
    hideLoading();
  }
}

async function onStageEditorLoadExisting(): Promise<void> {
  const stageId = Number($<HTMLSelectElement>('stage-editor-existing-stage').value);
  if (!Number.isInteger(stageId) || stageId <= 0) {
    alert('Bitte zuerst eine vorhandene CSV-Stage auswÃƒÂ¤hlen.');
    return;
  }

  showLoading('CSV-Stage wird geladen...');
  try {
    const res = await api.loadStageEditorStage(stageId);
    if (!res.success || !res.data) {
      alert(`Stage konnte nicht geladen werden: ${res.error ?? 'Unbekannter Fehler'}`);
      return;
    }

    const normalizedDraft = normalizeStageEditorDraft(res.data.draft);
    state.stageEditorDraft = normalizedDraft;
    ensureStageEditorBoundaryMarkers(normalizedDraft);
    setStageEditorMetadataFields(res.data.metadata);
    renderStageEditor();
    activateView('stage-editor');
  } finally {
    hideLoading();
  }
}

async function onStageEditorExport(): Promise<void> {
  if (!state.stageEditorDraft) {
    alert('Es gibt noch keine importierte oder geladene Strecke.');
    return;
  }

  const issues = [...getStageEditorIssues(state.stageEditorDraft), ...getStageEditorMetadataErrors()];
  if (issues.length > 0) {
    alert(`Export blockiert:\n\n${issues.join('\n')}`);
    renderStageEditor();
    return;
  }

  showLoading('CSV-Dateien werden erstelltÃ¢â‚¬Â¦');
  try {
    const res = await api.exportStageRoute({
      metadata: readStageEditorMetadata(),
      draft: state.stageEditorDraft,
    });
    if (!res.success || !res.data) {
      alert(`Export fehlgeschlagen: ${res.error ?? 'Unbekannter Fehler'}`);
      return;
    }

    downloadTextFile(res.data.stagesFileName, res.data.stagesCsv);
    downloadTextFile(res.data.stageDetailsFileName, res.data.stageDetailsCsv);
  } finally {
    hideLoading();
  }
}

function getRiderCountryCode(rider: Rider): string {
  return rider.country?.code3 ?? rider.nationality;
}

function formatRiderName(rider: Rider): string {
  return `${rider.lastName} ${rider.firstName}`;
}

function renderRiderAvailabilityMarker(rider: Rider): string {
  if (!rider.isUnavailable) {
    return '';
  }

  const label = rider.healthStatus === 'injured' ? 'Verletzung' : 'Krankheit';
  const remainingDays = rider.unavailableDaysRemaining ?? 0;
  const untilText = rider.unavailableUntil ? ` bis ${formatDate(rider.unavailableUntil)}` : '';
  const title = `${label}: noch ${remainingDays} Tag${remainingDays === 1 ? '' : 'e'}${untilText}`;
  return `<span class="rider-availability-marker" title="${esc(title)}" aria-label="${esc(title)}">Ã¢Å“Å¡</span>`;
}

function getRiderRoleName(rider: Rider): string {
  return rider.role?.name ?? (rider.roleId != null ? `Rolle ${rider.roleId}` : 'Ã¢â‚¬â€œ');
}

function getTeamTopAverage(teamId: number, limit = 12): number | null {
  const teamRiders = state.riders
    .filter(rider => rider.activeTeamId === teamId)
    .sort((left, right) => right.overallRating - left.overallRating)
    .slice(0, limit);

  if (teamRiders.length === 0) return null;
  const total = teamRiders.reduce((sum, rider) => sum + rider.overallRating, 0);
  return total / teamRiders.length;
}

function getTeamAverage(teamId: number): number | null {
  const teamRiders = state.riders.filter(rider => rider.activeTeamId === teamId);
  if (teamRiders.length === 0) return null;
  const total = teamRiders.reduce((sum, rider) => sum + rider.overallRating, 0);
  return total / teamRiders.length;
}

function formatTeamTopAverage(teamId: number): string {
  const average = getTeamTopAverage(teamId);
  return average == null ? 'Ã¢â‚¬â€œ' : average.toFixed(1).replace('.', ',');
}

function formatTeamAverage(teamId: number): string {
  const average = getTeamAverage(teamId);
  return average == null ? 'Ã¢â‚¬â€œ' : average.toFixed(1).replace('.', ',');
}

function compareStrings(left: string, right: string): number {
  return left.localeCompare(right, 'de', { sensitivity: 'base' });
}

function compareOptionalStrings(left: string | null | undefined, right: string | null | undefined): number {
  if (left == null && right == null) return 0;
  if (left == null) return 1;
  if (right == null) return -1;
  return compareStrings(left, right);
}

function getPeakDate(rider: Rider, index: number): string | undefined {
  return rider.seasonFormPeakDates?.[index];
}

function getSpecializationSortLabel(value: Rider['specialization1']): string | undefined {
  return value == null ? undefined : getRiderSpecializationLabel(value);
}

function getDefaultTeamSortDirection(sortKey: TeamTableSortKey): 'asc' | 'desc' {
  return ['birthYear', 'age', 'overallRating', 'formBonus', 'raceFormBonus', 'seasonPoints', 'seasonRaceDays', 'seasonWins', 'skillDevelopment', ...TEAM_SKILL_COLUMNS.map((column) => column.key)].includes(sortKey)
    ? 'desc'
    : 'asc';
}

function getSortIndicator(sortKey: TeamTableSortKey): string {
  if (state.teamTableSort.key !== sortKey) return '<span class="team-table-sort-indicator">Ã¢â€ â€¢</span>';
  return `<span class="team-table-sort-indicator team-table-sort-indicator-active">${state.teamTableSort.direction === 'asc' ? 'Ã¢â€ â€˜' : 'Ã¢â€ â€œ'}</span>`;
}

function getRiderMenuSortIndicator(sortKey: TeamTableSortKey): string {
  if (state.riderMenuTableSort.key !== sortKey) return '<span class="team-table-sort-indicator">Ã¢â€ â€¢</span>';
  return `<span class="team-table-sort-indicator team-table-sort-indicator-active">${state.riderMenuTableSort.direction === 'asc' ? 'Ã¢â€ â€˜' : 'Ã¢â€ â€œ'}</span>`;
}

function getRaceParticipantsSortIndicator(sortKey: RaceParticipantsSortKey): string {
  if (state.raceParticipantsSort.key !== sortKey) return '<span class="team-table-sort-indicator">Ã¢â€ â€¢</span>';
  return `<span class="team-table-sort-indicator team-table-sort-indicator-active">${state.raceParticipantsSort.direction === 'asc' ? 'Ã¢â€ â€˜' : 'Ã¢â€ â€œ'}</span>`;
}

function renderRaceParticipantsHeader(label: string, sortKey: RaceParticipantsSortKey, title: string): string {
  const activeClass = state.raceParticipantsSort.key === sortKey ? ' race-participants-sort-active' : '';
  return `
    <th>
      <button
        type="button"
        class="race-participants-sort${activeClass}"
        data-race-participants-sort="${sortKey}"
        title="${esc(title)}"
        aria-label="${esc(title)}"
      >
        <span>${esc(label)}</span>
        ${getRaceParticipantsSortIndicator(sortKey)}
      </button>
    </th>`;
}

function renderStageEditorOverviewHeader<TSortKey extends string>(label: string, sortKey: TSortKey, activeKey: TSortKey, direction: 'asc' | 'desc', table: 'stages' | 'climbs'): string {
  const activeClass = activeKey === sortKey ? ' stage-editor-overview-sort-active' : '';
  const indicator = activeKey === sortKey ? (direction === 'asc' ? 'Ã¢â€ â€˜' : 'Ã¢â€ â€œ') : 'Ã¢â€ â€¢';
  return `
    <th>
      <button type="button" class="stage-editor-overview-sort${activeClass}" data-stage-editor-${table}-sort="${sortKey}">
        <span>${esc(label)}</span>
        <span class="team-table-sort-indicator${activeKey === sortKey ? ' team-table-sort-indicator-active' : ''}">${indicator}</span>
      </button>
    </th>`;
}

function getDefaultStageEditorStagesSortDirection(sortKey: StageEditorStagesSortKey): 'asc' | 'desc' {
  return ['distanceKm', 'elevationGainMeters', 'sprintCount', 'climbCount'].includes(sortKey) ? 'desc' : 'asc';
}

function getDefaultStageEditorClimbsSortDirection(sortKey: StageEditorClimbsSortKey): 'asc' | 'desc' {
  return ['gainMeters', 'distanceKm', 'avgGradient', 'maxGradient'].includes(sortKey) ? 'desc' : 'asc';
}

function compareStageEditorStageRows(left: StageEditorStageOverviewRow, right: StageEditorStageOverviewRow): number {
  switch (state.stageEditorStagesSort.key) {
    case 'stageId': return left.stageId - right.stageId;
    case 'countryCode': return compareOptionalStrings(left.countryCode, right.countryCode);
    case 'raceName': return compareStrings(left.raceName, right.raceName);
    case 'stageNumber': return left.stageNumber - right.stageNumber;
    case 'profile': return compareStrings(left.profile, right.profile);
    case 'distanceKm': return left.distanceKm - right.distanceKm;
    case 'elevationGainMeters': return left.elevationGainMeters - right.elevationGainMeters;
    case 'sprintCount': return left.sprintCount - right.sprintCount;
    case 'climbCount': return left.climbCount - right.climbCount;
    case 'profileScore': return left.profileScore - right.profileScore;
    default: return 0;
  }
}

function compareStageEditorClimbRows(left: StageEditorClimbOverviewRow, right: StageEditorClimbOverviewRow): number {
  switch (state.stageEditorClimbsSort.key) {
    case 'placementKm': return left.placementKm - right.placementKm;
    case 'name': return compareStrings(left.name, right.name);
    case 'category': return compareOptionalStrings(left.category, right.category);
    case 'countryCode': return compareOptionalStrings(left.countryCode, right.countryCode);
    case 'raceName': return compareStrings(left.raceName, right.raceName);
    case 'stageNumber': return left.stageNumber - right.stageNumber;
    case 'gainMeters': return left.gainMeters - right.gainMeters;
    case 'distanceKm': return left.distanceKm - right.distanceKm;
    case 'avgGradient': return left.avgGradient - right.avgGradient;
    case 'maxGradient': return left.maxGradient - right.maxGradient;
    case 'climbScore': return left.climbScore - right.climbScore;
    default: return 0;
  }
}

function sortStageEditorStageRows(rows: StageEditorStageOverviewRow[]): StageEditorStageOverviewRow[] {
  const direction = state.stageEditorStagesSort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((left, right) => (compareStageEditorStageRows(left, right) || left.stageId - right.stageId) * direction);
}

function sortStageEditorClimbRows(rows: StageEditorClimbOverviewRow[]): StageEditorClimbOverviewRow[] {
  const direction = state.stageEditorClimbsSort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((left, right) => (compareStageEditorClimbRows(left, right) || left.placementKm - right.placementKm || compareStrings(left.name, right.name)) * direction);
}

function getDefaultRaceParticipantsSortDirection(sortKey: RaceParticipantsSortKey): 'asc' | 'desc' {
  return sortKey === 'overall' ? 'desc' : 'asc';
}

function getSpecLabel(rider: Rider): string {
  if (rider.specialization1) {
    return rider.specialization1;
  }

  return getSpecIdLabel(rider.specialization1Id);
}

function getSpecIdLabel(specId: number | null | undefined): string {
  switch (specId) {
    case 1:
      return 'Berg';
    case 2:
      return 'Hill';
    case 3:
      return 'Sprint';
    case 4:
      return 'Timetrial';
    case 5:
      return 'Cobble';
    case 6:
      return 'Attacker';
    default:
      return 'Keine Spezialisierung';
  }
}

function getRaceParticipantPhaseRank(participant: RaceProgramParticipant): number {
  const order: Record<string, number> = { rise: 0, neutral: 1, fall: 2 };
  return order[participant.rider.seasonFormPhase ?? 'neutral'] ?? order['neutral'];
}

function sortRaceParticipants(participants: RaceProgramParticipant[]): RaceProgramParticipant[] {
  const direction = state.raceParticipantsSort.direction === 'asc' ? 1 : -1;
  return [...participants].sort((left, right) => {
    let result = 0;
    switch (state.raceParticipantsSort.key) {
      case 'team':
        result = compareOptionalStrings(left.team?.name, right.team?.name) || compareOptionalStrings(left.team?.abbreviation, right.team?.abbreviation);
        break;
      case 'rider':
        result = compareStrings(formatRiderName(left.rider), formatRiderName(right.rider));
        break;
      case 'spec1':
        result = compareStrings(getSpecLabel(left.rider), getSpecLabel(right.rider));
        break;
      case 'role':
        result = compareStrings(getRiderRoleName(left.rider), getRiderRoleName(right.rider));
        break;
      case 'overall':
        result = left.rider.overallRating - right.rider.overallRating;
        break;
      case 'phase':
        result = getRaceParticipantPhaseRank(left) - getRaceParticipantPhaseRank(right);
        break;
      case 'program':
        result = compareStrings(left.program.name, right.program.name);
        break;
      default:
        result = 0;
    }

    return (result || compareStrings(formatRiderName(left.rider), formatRiderName(right.rider))) * direction;
  });
}

function renderTeamTableHeader(column: TeamTableColumn): string {
  if (!column.sortKey) {
    return `<th class="${column.className ?? ''}"></th>`;
  }

  const activeClass = state.teamTableSort.key === column.sortKey ? ' team-table-sort-active' : '';
  return `
    <th class="${column.className ?? ''}">
      <button
        type="button"
        class="team-table-sort${activeClass}"
        data-team-sort="${column.sortKey}"
        title="${esc(column.title)}"
        aria-label="${esc(column.title)}"
      >
        <span class="team-table-sort-label">${esc(column.label)}</span>
        ${getSortIndicator(column.sortKey)}
      </button>
    </th>`;
}

function renderRiderMenuTableHeader(column: TeamTableColumn): string {
  if (!column.sortKey) {
    return `<th class="${column.className ?? ''}"></th>`;
  }

  const activeClass = state.riderMenuTableSort.key === column.sortKey ? ' team-table-sort-active' : '';
  return `
    <th class="${column.className ?? ''}">
      <button
        type="button"
        class="team-table-sort${activeClass}"
        data-riders-sort="${column.sortKey}"
        title="${esc(column.title)}"
        aria-label="${esc(column.title)}"
      >
        <span class="team-table-sort-label">${esc(column.label)}</span>
        ${getRiderMenuSortIndicator(column.sortKey)}
      </button>
    </th>`;
}

function renderTeamDetailPageTabs(): string {
  return `
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahrer-Detailseite">
      ${TEAM_DETAIL_PAGE_ORDER.map((page) => `
        <button
          type="button"
          class="team-detail-page-tab${state.teamDetailPage === page ? ' team-detail-page-tab-active' : ''}"
          data-team-detail-page="${page}"
          aria-selected="${state.teamDetailPage === page ? 'true' : 'false'}"
        >${esc(TEAM_DETAIL_PAGE_LABELS[page])}</button>
      `).join('')}
    </div>`;
}

function renderRiderMenuDetailPageTabs(): string {
  return `
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahreransicht Detailseite">
      ${TEAM_DETAIL_PAGE_ORDER.map((page) => `
        <button
          type="button"
          class="team-detail-page-tab${state.riderMenuDetailPage === page ? ' team-detail-page-tab-active' : ''}"
          data-riders-detail-page="${page}"
          aria-selected="${state.riderMenuDetailPage === page ? 'true' : 'false'}"
        >${esc(TEAM_DETAIL_PAGE_LABELS[page])}</button>
      `).join('')}
    </div>`;
}

function renderTeamCountryCell(rider: Rider): string {
  const countryCode = getRiderCountryCode(rider);
  return `<span class="team-table-country-cell">${renderFlag(countryCode)}<span>${esc(countryCode)}</span></span>`;
}

function renderRiderTags(rider: Rider): string {
  const tags = [
    rider.hasGrandTourTag ? 'Grand Tour' : null,
    rider.hasStageRaceTag ? 'Etappenrennen' : null,
    rider.hasOneDayClassicTag ? 'One Day Classic' : null,
  ].filter((value): value is string => value != null);
  return tags.length > 0 ? tags.map(esc).join(', ') : 'Ã¢â‚¬â€œ';
}

function renderRiderRaceFocus(rider: Rider): string {
  const focus = [
    rider.isStageRacer ? 'Etappenrennen' : null,
    rider.isOneDayRacer ? 'Eintagesrennen' : null,
  ].filter((value): value is string => value != null);
  return focus.length > 0 ? focus.join(', ') : 'Ã¢â‚¬â€œ';
}

function renderRaceFormSourceList(rider: Rider): string {
  const sources = rider.raceFormSources ?? [];
  if (sources.length === 0) {
    return 'Ã¢â‚¬â€œ';
  }

  return `<div class="team-table-source-list">${sources.map((source) => `
    <span class="team-table-source-item" title="${esc(source.date)} Ã‚Â· +${source.amount.toFixed(2).replace('.', ',')}">
      ${esc(formatDate(source.date))}: ${esc(source.label)} <span class="text-muted">+${source.amount.toFixed(2).replace('.', ',')}</span>
    </span>
  `).join('')}</div>`;
}

function renderTeamTableCell(rider: Rider, column: TeamTableColumn): string {
  switch (column.id) {
    case 'name':
      return `<td class="team-table-name-cell">${renderRiderNameLink(formatRiderName(rider), {
        riderId: rider.id,
        teamId: rider.activeTeamId,
        strong: true,
      })}${renderRiderAvailabilityMarker(rider)}</td>`;
    case 'country':
      return `<td>${renderTeamCountryCell(rider)}</td>`;
    case 'age':
      return `<td>${rider.age ?? 'Ã¢â‚¬â€œ'}</td>`;
    case 'roleName':
      return `<td>${esc(getRiderRoleName(rider))}</td>`;
    case 'overallRating':
      return `<td>${renderSkillValue(rider.overallRating)}</td>`;
    case 'birthYear':
      return `<td>${rider.birthYear}</td>`;
    case 'mentorName':
      if ((rider.age ?? 0) <= 22) {
        const top3Specs = [rider.specialization1Id, rider.specialization2Id, rider.specialization3Id].filter((s) => s != null);
        const mentors = state.riders.filter((r) => r.activeTeamId === rider.activeTeamId && (r.age ?? 0) > 32 && r.overallRating >= 73 && r.specialization1Id != null && top3Specs.includes(r.specialization1Id));
        if (mentors.length > 0) {
          return `<td class="team-table-wrap-cell">${esc(mentors.map(m => formatRiderName(m)).join(', '))}</td>`;
        }
      }
      return `<td>Ã¢â‚¬â€œ</td>`;
    case 'contractEndSeason':
      return `<td>${rider.contractEndSeason ?? 'Ã¢â‚¬â€œ'}</td>`;
    case 'formBonus':
      return `<td>${renderSeasonFormValue(rider.formBonus)}</td>`;
    case 'raceFormBonus':
      return `<td>${renderRaceFormBonusValue(rider.raceFormBonus)}</td>`;
    case 'longTermFatigueMalus':
      return `<td>${renderLoadMalusValue(rider.longTermFatigueMalus, 'none', `Saisonrenntage: ${rider.seasonRaceDaysTotal ?? 0}`)}</td>`;
    case 'shortTermFatigueMalus':
      return `<td>${renderLoadMalusValue(rider.shortTermFatigueMalus, rider.shortTermFatigueWarning ?? 'none', `30-Tage-Renntage: ${rider.rolling30dRaceDays ?? 0}`)}</td>`;
    case 'seasonFormPhase':
      return `<td>${renderSeasonFormPhase(rider)}</td>`;
    case 'raceFormSources':
      return `<td class="team-table-wrap-cell">${renderRaceFormSourceList(rider)}</td>`;
    case 'seasonPoints':
      return `<td>${rider.seasonPoints ?? 0}</td>`;
    case 'seasonRaceDays':
      return `<td>${rider.seasonRaceDays ?? 0}</td>`;
    case 'seasonWins':
      return `<td>${rider.seasonWins ?? 0}</td>`;
    case 'peak1':
      return `<td>${esc(getPeakDate(rider, 0) ?? 'Ã¢â‚¬â€œ')}</td>`;
    case 'peak2':
      return `<td>${esc(getPeakDate(rider, 1) ?? 'Ã¢â‚¬â€œ')}</td>`;
    case 'peak3':
      return `<td>${esc(getPeakDate(rider, 2) ?? 'Ã¢â‚¬â€œ')}</td>`;
    case 'riderType':
      return `<td>${esc(getRiderSpecializationLabel(rider.riderType))}</td>`;
    case 'specialization1':
      return `<td>${esc(rider.specialization1 ? getRiderSpecializationLabel(rider.specialization1) : 'Ã¢â‚¬â€œ')}</td>`;
    case 'specialization2':
      return `<td>${esc(rider.specialization2 ? getRiderSpecializationLabel(rider.specialization2) : 'Ã¢â‚¬â€œ')}</td>`;
    case 'specialization3':
      return `<td>${esc(rider.specialization3 ? getRiderSpecializationLabel(rider.specialization3) : 'Ã¢â‚¬â€œ')}</td>`;
    case 'tags':
      return `<td class="team-table-wrap-cell">${renderRiderTags(rider)}</td>`;
    case 'raceFocus':
      return `<td class="team-table-wrap-cell">${renderRiderRaceFocus(rider)}</td>`;
    case 'skillDevelopment':
      return `<td>${rider.skillDevelopment ?? 'Ã¢â‚¬â€œ'}</td>`;
    case 'favoriteRaces':
      return `<td class="team-table-wrap-cell">${renderRacePrefs(rider.favoriteRaces)}</td>`;
    case 'nonFavoriteRaces':
      return `<td class="team-table-wrap-cell">${renderRacePrefs(rider.nonFavoriteRaces)}</td>`;
    case 'seasonProgram':
      return `<td>${renderRiderProgramButton(rider)}</td>`;
    default:
      if (column.id in rider.skills) {
        const skillKey = column.id as keyof Rider['skills'];
        return `<td>${renderSkillValueWithDelta(rider.skills[skillKey], rider.yearStartSkills?.[skillKey], rider.potentials[skillKey])}</td>`;
      }
      return '<td>Ã¢â‚¬â€œ</td>';
  }
}

function getTeamSortLabel(sortKey: TeamTableSortKey): string {
  if (sortKey === 'name') return 'Nachname';
  if (sortKey === 'countryCode') return 'Country';
  if (sortKey === 'birthYear') return 'Jahrgang';
  if (sortKey === 'age') return 'Alter';
  if (sortKey === 'overallRating') return 'Gesamt';
  if (sortKey === 'formBonus') return 'Saisonform';
  if (sortKey === 'raceFormBonus') return 'Rennbonus';
  if (sortKey === 'longTermFatigueMalus') return 'Langzeit-ErschÃƒÂ¶pfung';
  if (sortKey === 'shortTermFatigueMalus') return 'Akuter VerschleiÃƒÅ¸';
  if (sortKey === 'seasonPoints') return 'Saisonpunkte';
  if (sortKey === 'seasonRaceDays') return 'Renntage';
  if (sortKey === 'seasonWins') return 'Siege';
  if (sortKey === 'contractEndSeason') return 'Vertragsende';
  if (sortKey === 'roleName') return 'Rolle';
  if (sortKey === 'riderType') return 'Profil';
  if (sortKey === 'specialization1') return 'Spec1';
  if (sortKey === 'specialization2') return 'Spec2';
  if (sortKey === 'specialization3') return 'Spec3';
  if (sortKey === 'skillDevelopment') return 'Skill Development';
  if (sortKey === 'peak1') return 'Peak 1';
  if (sortKey === 'peak2') return 'Peak 2';
  if (sortKey === 'peak3') return 'Peak 3';
  return TEAM_SKILL_TITLES[sortKey];
}

function sortTeamRiders(riders: Rider[]): Rider[] {
  const sortedRiders = [...riders];
  const directionFactor = state.teamTableSort.direction === 'asc' ? 1 : -1;

  sortedRiders.sort((left, right) => {
    let comparison = 0;

    switch (state.teamTableSort.key) {
      case 'name':
        comparison = compareStrings(left.lastName, right.lastName) || compareStrings(left.firstName, right.firstName);
        break;
      case 'countryCode':
        comparison = compareStrings(getRiderCountryCode(left), getRiderCountryCode(right));
        break;
      case 'birthYear':
        comparison = left.birthYear - right.birthYear;
        break;
      case 'age':
        comparison = (left.age ?? 0) - (right.age ?? 0);
        break;
      case 'overallRating':
        comparison = left.overallRating - right.overallRating;
        break;
      case 'formBonus':
        comparison = (left.formBonus ?? 0) - (right.formBonus ?? 0);
        break;
      case 'raceFormBonus':
        comparison = (left.raceFormBonus ?? 0) - (right.raceFormBonus ?? 0);
        break;
      case 'longTermFatigueMalus':
        comparison = (left.longTermFatigueMalus ?? 0) - (right.longTermFatigueMalus ?? 0);
        break;
      case 'shortTermFatigueMalus':
        comparison = (left.shortTermFatigueMalus ?? 0) - (right.shortTermFatigueMalus ?? 0);
        break;
      case 'seasonPoints':
        comparison = (left.seasonPoints ?? 0) - (right.seasonPoints ?? 0);
        break;
      case 'seasonRaceDays':
        comparison = (left.seasonRaceDays ?? 0) - (right.seasonRaceDays ?? 0);
        break;
      case 'seasonWins':
        comparison = (left.seasonWins ?? 0) - (right.seasonWins ?? 0);
        break;
      case 'contractEndSeason':
        comparison = (left.contractEndSeason ?? Number.MAX_SAFE_INTEGER) - (right.contractEndSeason ?? Number.MAX_SAFE_INTEGER);
        break;
      case 'roleName':
        comparison = compareStrings(getRiderRoleName(left), getRiderRoleName(right));
        break;
      case 'riderType':
        comparison = compareStrings(left.riderType, right.riderType)
          || compareStrings(formatRiderName(left), formatRiderName(right));
        break;
      case 'skillDevelopment':
        comparison = (left.skillDevelopment ?? 0) - (right.skillDevelopment ?? 0);
        break;
      case 'specialization1':
        comparison = compareOptionalStrings(getSpecializationSortLabel(left.specialization1), getSpecializationSortLabel(right.specialization1));
        break;
      case 'specialization2':
        comparison = compareOptionalStrings(getSpecializationSortLabel(left.specialization2), getSpecializationSortLabel(right.specialization2));
        break;
      case 'specialization3':
        comparison = compareOptionalStrings(getSpecializationSortLabel(left.specialization3), getSpecializationSortLabel(right.specialization3));
        break;
      case 'peak1':
        comparison = compareOptionalStrings(getPeakDate(left, 0), getPeakDate(right, 0));
        break;
      case 'peak2':
        comparison = compareOptionalStrings(getPeakDate(left, 1), getPeakDate(right, 1));
        break;
      case 'peak3':
        comparison = compareOptionalStrings(getPeakDate(left, 2), getPeakDate(right, 2));
        break;
      default:
        comparison = left.skills[state.teamTableSort.key] - right.skills[state.teamTableSort.key];
        break;
    }

    if (comparison === 0) {
      comparison = compareStrings(left.lastName, right.lastName) || compareStrings(left.firstName, right.firstName);
    }

    return comparison * directionFactor;
  });

  return sortedRiders;
}

function sortRiderMenuRiders(riders: Rider[]): Rider[] {
  const sortedRiders = [...riders];
  const directionFactor = state.riderMenuTableSort.direction === 'asc' ? 1 : -1;

  sortedRiders.sort((left, right) => {
    let comparison = 0;

    switch (state.riderMenuTableSort.key) {
      case 'name':
        comparison = compareStrings(left.lastName, right.lastName) || compareStrings(left.firstName, right.firstName);
        break;
      case 'countryCode':
        comparison = compareStrings(getRiderCountryCode(left), getRiderCountryCode(right));
        break;
      case 'birthYear':
        comparison = left.birthYear - right.birthYear;
        break;
      case 'age':
        comparison = (left.age ?? 0) - (right.age ?? 0);
        break;
      case 'overallRating':
        comparison = left.overallRating - right.overallRating;
        break;
      case 'formBonus':
        comparison = (left.formBonus ?? 0) - (right.formBonus ?? 0);
        break;
      case 'raceFormBonus':
        comparison = (left.raceFormBonus ?? 0) - (right.raceFormBonus ?? 0);
        break;
      case 'longTermFatigueMalus':
        comparison = (left.longTermFatigueMalus ?? 0) - (right.longTermFatigueMalus ?? 0);
        break;
      case 'shortTermFatigueMalus':
        comparison = (left.shortTermFatigueMalus ?? 0) - (right.shortTermFatigueMalus ?? 0);
        break;
      case 'seasonPoints':
        comparison = (left.seasonPoints ?? 0) - (right.seasonPoints ?? 0);
        break;
      case 'seasonRaceDays':
        comparison = (left.seasonRaceDays ?? 0) - (right.seasonRaceDays ?? 0);
        break;
      case 'seasonWins':
        comparison = (left.seasonWins ?? 0) - (right.seasonWins ?? 0);
        break;
      case 'contractEndSeason':
        comparison = (left.contractEndSeason ?? Number.MAX_SAFE_INTEGER) - (right.contractEndSeason ?? Number.MAX_SAFE_INTEGER);
        break;
      case 'roleName':
        comparison = compareStrings(getRiderRoleName(left), getRiderRoleName(right));
        break;
      case 'riderType':
        comparison = compareStrings(left.riderType, right.riderType)
          || compareStrings(formatRiderName(left), formatRiderName(right));
        break;
      case 'skillDevelopment':
        comparison = (left.skillDevelopment ?? 0) - (right.skillDevelopment ?? 0);
        break;
      case 'specialization1':
        comparison = compareOptionalStrings(getSpecializationSortLabel(left.specialization1), getSpecializationSortLabel(right.specialization1));
        break;
      case 'specialization2':
        comparison = compareOptionalStrings(getSpecializationSortLabel(left.specialization2), getSpecializationSortLabel(right.specialization2));
        break;
      case 'specialization3':
        comparison = compareOptionalStrings(getSpecializationSortLabel(left.specialization3), getSpecializationSortLabel(right.specialization3));
        break;
      case 'peak1':
        comparison = compareOptionalStrings(getPeakDate(left, 0), getPeakDate(right, 0));
        break;
      case 'peak2':
        comparison = compareOptionalStrings(getPeakDate(left, 1), getPeakDate(right, 1));
        break;
      case 'peak3':
        comparison = compareOptionalStrings(getPeakDate(left, 2), getPeakDate(right, 2));
        break;
      default:
        comparison = left.skills[state.riderMenuTableSort.key] - right.skills[state.riderMenuTableSort.key];
        break;
    }

    if (comparison === 0) {
      comparison = compareStrings(left.lastName, right.lastName) || compareStrings(left.firstName, right.firstName);
    }

    return comparison * directionFactor;
  });

  return sortedRiders;
}

function renderRacePrefs(raceIds: number[]): string {
  if (raceIds.length === 0) return 'Ã¢â‚¬â€œ';
  return raceIds.map(raceId => {
    const race = state.races.find(entry => entry.id === raceId);
    return race ? esc(race.name) : `Rennen ${raceId}`;
  }).join(', ');
}

function renderPeakDatesSummary(rider: Rider): string {
  const peakDates = rider.seasonFormPeakDates ?? [];
  if (peakDates.length === 0) {
    return 'Ã¢â‚¬â€œ';
  }
  return peakDates.join(' Ã‚Â· ');
}

interface RiderTeamEditorColumn {
  key: RiderTeamEditorSortKey;
  label: string;
  title: string;
  inputType: 'number' | 'text' | 'team' | 'readonly';
  className?: string;
}

const RIDER_TEAM_EDITOR_COLUMNS: RiderTeamEditorColumn[] = [
  { key: 'riderId', label: 'ID', title: 'Fahrer-ID', inputType: 'number', className: 'team-table-col-year' },
  { key: 'firstName', label: 'Vorname', title: 'Vorname', inputType: 'text', className: 'team-table-col-name' },
  { key: 'lastName', label: 'Nachname', title: 'Nachname', inputType: 'text', className: 'team-table-col-name' },
  { key: 'countryId', label: 'Land', title: 'Country-ID', inputType: 'number', className: 'team-table-col-year' },
  { key: 'birthYear', label: 'Jg', title: 'Geburtsjahr', inputType: 'number', className: 'team-table-col-year' },
  { key: 'teamName', label: 'Team', title: 'Teamzuordnung', inputType: 'team', className: 'team-table-col-program' },
  { key: 'overallRating', label: 'Ges', title: 'GesamtstÃƒÂ¤rke wie im Teams-MenÃƒÂ¼', inputType: 'readonly', className: 'team-table-col-overall' },
  { key: 'skillFlat', label: 'Fl', title: 'Flach', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillMountain', label: 'Berg', title: 'Berg', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillMediumMountain', label: 'MB', title: 'Mittlere Berge', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillHill', label: 'Hgl', title: 'HÃƒÂ¼gel', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillTimeTrial', label: 'ZF', title: 'Zeitfahren', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillPrologue', label: 'Pro', title: 'Prolog', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillCobble', label: 'Pf', title: 'Pflaster', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillSprint', label: 'Spr', title: 'Sprint', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillAcceleration', label: 'Acc', title: 'Antritt', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillDownhill', label: 'Abf', title: 'Abfahrt', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillAttack', label: 'Atk', title: 'Attacke', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillStamina', label: 'Sta', title: 'Stamina', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillResistance', label: 'Res', title: 'Widerstand', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillRecuperation', label: 'Rec', title: 'Regeneration', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'favoriteRaces', label: 'Favs', title: 'Lieblingsrennen', inputType: 'text', className: 'team-table-col-preferences' },
  { key: 'nonFavoriteRaces', label: 'Nos', title: 'Nicht bevorzugte Rennen', inputType: 'text', className: 'team-table-col-preferences' },
];

function resolveRiderTeamEditorTeamKey(teamId: number | null): string {
  return teamId == null ? 'free-agents' : String(teamId);
}

function getRiderTeamEditorTeamName(teamId: number | null): string {
  const payload = state.riderTeamEditorPayload;
  if (!payload) {
    return teamId == null ? 'Free Agents' : 'Ã¢â‚¬â€œ';
  }
  return payload.teams.find((team) => team.teamId === teamId)?.name ?? (teamId == null ? 'Free Agents' : `Team ${teamId}`);
}

function calculateEditorOverall(rider: RiderTeamEditorRiderRow): number {
  const values = [
    rider.skillFlat,
    rider.skillMountain,
    rider.skillMediumMountain,
    rider.skillHill,
    rider.skillTimeTrial,
    rider.skillCobble,
    rider.skillSprint,
    rider.skillStamina,
    rider.skillResistance,
    rider.skillRecuperation,
  ];
  return clamp(values.reduce((sum, value) => sum + value, 0) / values.length, 0, 100);
}

function getDefaultRiderTeamEditorSortDirection(sortKey: RiderTeamEditorSortKey): 'asc' | 'desc' {
  return [
    'riderId',
    'countryId',
    'birthYear',
    'overallRating',
    'skillFlat',
    'skillMountain',
    'skillMediumMountain',
    'skillHill',
    'skillTimeTrial',
    'skillPrologue',
    'skillCobble',
    'skillSprint',
    'skillAcceleration',
    'skillDownhill',
    'skillAttack',
    'skillStamina',
    'skillResistance',
    'skillRecuperation',
  ].includes(sortKey) ? 'desc' : 'asc';
}

function getRiderTeamEditorSortIndicator(sortKey: RiderTeamEditorSortKey): string {
  if (state.riderTeamEditorSort.key !== sortKey) return '<span class="team-table-sort-indicator">Ã¢â€ â€¢</span>';
  return `<span class="team-table-sort-indicator team-table-sort-indicator-active">${state.riderTeamEditorSort.direction === 'asc' ? 'Ã¢â€ â€˜' : 'Ã¢â€ â€œ'}</span>`;
}

function renderRiderTeamEditorHeader(column: RiderTeamEditorColumn): string {
  const activeClass = state.riderTeamEditorSort.key === column.key ? ' team-table-sort-active' : '';
  return `
    <th class="${column.className ?? ''}">
      <button
        type="button"
        class="team-table-sort${activeClass}"
        data-rider-team-editor-sort="${column.key}"
        title="${esc(column.title)}"
        aria-label="${esc(column.title)}"
      >
        <span class="team-table-sort-label">${esc(column.label)}</span>
        ${getRiderTeamEditorSortIndicator(column.key)}
      </button>
    </th>`;
}

function compareRiderTeamEditorRows(left: RiderTeamEditorRiderRow, right: RiderTeamEditorRiderRow): number {
  switch (state.riderTeamEditorSort.key) {
    case 'riderId': return left.riderId - right.riderId;
    case 'firstName': return compareStrings(left.firstName, right.firstName);
    case 'lastName': return compareStrings(left.lastName, right.lastName);
    case 'countryId': return left.countryId - right.countryId;
    case 'birthYear': return left.birthYear - right.birthYear;
    case 'teamName': return compareStrings(getRiderTeamEditorTeamName(left.teamId), getRiderTeamEditorTeamName(right.teamId));
    case 'overallRating': return left.overallRating - right.overallRating;
    case 'skillFlat': return left.skillFlat - right.skillFlat;
    case 'skillMountain': return left.skillMountain - right.skillMountain;
    case 'skillMediumMountain': return left.skillMediumMountain - right.skillMediumMountain;
    case 'skillHill': return left.skillHill - right.skillHill;
    case 'skillTimeTrial': return left.skillTimeTrial - right.skillTimeTrial;
    case 'skillPrologue': return left.skillPrologue - right.skillPrologue;
    case 'skillCobble': return left.skillCobble - right.skillCobble;
    case 'skillSprint': return left.skillSprint - right.skillSprint;
    case 'skillAcceleration': return left.skillAcceleration - right.skillAcceleration;
    case 'skillDownhill': return left.skillDownhill - right.skillDownhill;
    case 'skillAttack': return left.skillAttack - right.skillAttack;
    case 'skillStamina': return left.skillStamina - right.skillStamina;
    case 'skillResistance': return left.skillResistance - right.skillResistance;
    case 'skillRecuperation': return left.skillRecuperation - right.skillRecuperation;
    case 'favoriteRaces': return compareStrings(left.favoriteRaces, right.favoriteRaces);
    case 'nonFavoriteRaces': return compareStrings(left.nonFavoriteRaces, right.nonFavoriteRaces);
    default: return 0;
  }
}

function sortRiderTeamEditorRows(rows: RiderTeamEditorRiderRow[]): RiderTeamEditorRiderRow[] {
  const direction = state.riderTeamEditorSort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((left, right) => (
    (compareRiderTeamEditorRows(left, right)
      || compareStrings(left.lastName, right.lastName)
      || compareStrings(left.firstName, right.firstName)
      || left.riderId - right.riderId) * direction
  ));
}

function getFilteredRiderTeamEditorRows(payload: RiderTeamEditorPayload): RiderTeamEditorRiderRow[] {
  const selectedKey = state.riderTeamEditorSelectedTeamKey;
  if (!selectedKey) {
    return [];
  }
  const baseRows = payload.riders.filter((rider) => resolveRiderTeamEditorTeamKey(rider.teamId) === selectedKey);
  return sortRiderTeamEditorRows(baseRows);
}

function renderRiderTeamEditorTeamOptions(teamId: number | null): string {
  const payload = state.riderTeamEditorPayload;
  if (!payload) {
    return '<option value="free-agents">Free Agents</option>';
  }

  return payload.teams.map((team) => {
    const key = resolveRiderTeamEditorTeamKey(team.teamId);
    return `<option value="${key}"${team.teamId === teamId ? ' selected' : ''}>${esc(team.name)}</option>`;
  }).join('');
}

function isDirtyRiderTeamEditorRow(riderId: number): boolean {
  return state.riderTeamEditorDirtyRiderIds.includes(riderId);
}

function renderRiderTeamEditorCell(rider: RiderTeamEditorRiderRow, column: RiderTeamEditorColumn): string {
  const dirtyClass = isDirtyRiderTeamEditorRow(rider.riderId) ? ' rider-team-editor-input-dirty' : '';
  switch (column.inputType) {
    case 'readonly':
      return `<td><span class="skill-value" style="color:${getSkillColor(rider.overallRating)}">${Math.round(rider.overallRating)}</span></td>`;
    case 'team':
      return `<td><select class="rider-team-editor-input${dirtyClass}" data-rider-team-editor-field="teamId" data-rider-team-editor-rider-id="${rider.riderId}">${renderRiderTeamEditorTeamOptions(rider.teamId)}</select></td>`;
    case 'number': {
      const value = rider[column.key as keyof RiderTeamEditorRiderRow] as number;
      return `<td><input type="number" class="rider-team-editor-input${dirtyClass}" data-rider-team-editor-field="${column.key}" data-rider-team-editor-rider-id="${rider.riderId}" value="${value}"></td>`;
    }
    case 'text': {
      const value = String(rider[column.key as keyof RiderTeamEditorRiderRow] ?? '');
      return `<td><input type="text" class="rider-team-editor-input${dirtyClass}" data-rider-team-editor-field="${column.key}" data-rider-team-editor-rider-id="${rider.riderId}" value="${esc(value)}"></td>`;
    }
    default:
      return '<td>Ã¢â‚¬â€œ</td>';
  }
}

function renderRiderTeamEditorSidebar(payload: RiderTeamEditorPayload): string {
  const teams = [...payload.teams].sort((left, right) => left.rank - right.rank || compareStrings(left.name, right.name));
  return `
    <aside class="rider-team-editor-sidebar">
      <div class="team-detail-card">
        <div class="team-detail-header">
          <h3>TeamÃƒÂ¼bersicht</h3>
        </div>
        <div class="rider-team-editor-sidebar-list">
          <div class="rider-team-editor-sidebar-item rider-team-editor-sidebar-summary">
            <span>Alle Teams</span>
            <strong>${payload.riders.length}</strong>
          </div>
          ${teams.map((team) => `
            <button type="button" class="rider-team-editor-sidebar-item${state.riderTeamEditorSelectedTeamKey === resolveRiderTeamEditorTeamKey(team.teamId) ? ' is-active' : ''}" data-rider-team-editor-team-filter="${resolveRiderTeamEditorTeamKey(team.teamId)}">
              <span class="rider-team-editor-sidebar-main">
                <span>${esc(team.name)}</span>
                <span class="text-muted">${esc(team.abbreviation)} Ã‚Â· ${esc(team.divisionName)}</span>
              </span>
              <span class="rider-team-editor-sidebar-stats">
                <strong>${team.riderCount}</strong>
                <span>ÃƒËœ ${team.averageOverall != null ? team.averageOverall.toFixed(1).replace('.', ',') : 'Ã¢â‚¬â€œ'} Ã‚Â· #${team.rank}</span>
              </span>
            </button>
          `).join('')}
        </div>
      </div>
    </aside>`;
}

function renderRiderTeamEditor(): void {
  const root = $('rider-team-editor-root');
  const meta = $('rider-team-editor-meta');
  const payload = state.riderTeamEditorPayload;
  if (!payload) {
    root.innerHTML = '<div class="results-empty">Editor wird geladen.</div>';
    meta.textContent = 'Masterdaten aus riders.csv bearbeiten.';
    return;
  }

  const selectedTeam = state.riderTeamEditorSelectedTeamKey
    ? payload.teams.find((team) => resolveRiderTeamEditorTeamKey(team.teamId) === state.riderTeamEditorSelectedTeamKey) ?? null
    : null;
  const rows = getFilteredRiderTeamEditorRows(payload);
  const dirtyCount = state.riderTeamEditorDirtyRiderIds.length;
  const selectedTeamText = selectedTeam == null
    ? 'Kein Team gewÃƒÂ¤hlt'
    : `${selectedTeam.riderCount} Fahrer Ã‚Â· ÃƒËœ ${selectedTeam.averageOverall != null ? selectedTeam.averageOverall.toFixed(1).replace('.', ',') : 'Ã¢â‚¬â€œ'} Ã‚Â· Rang #${selectedTeam.rank}`;

  meta.textContent = selectedTeam == null
    ? 'Masterdaten aus riders.csv bearbeiten. Fahrer werden erst nach Teamauswahl geladen.'
    : `${selectedTeam.name} Ã‚Â· ${selectedTeamText}`;

  root.innerHTML = `
    <div class="rider-team-editor-layout">
      <section class="rider-team-editor-main">
        <div class="team-detail-card">
          <div class="rider-team-editor-toolbar">
            <div class="teams-selector rider-team-editor-selector">
              <label for="rider-team-editor-team-select">Team auswÃƒÂ¤hlen</label>
              <select id="rider-team-editor-team-select">
                <option value=""${state.riderTeamEditorSelectedTeamKey === '' ? ' selected' : ''}>Ã¢â‚¬â€œ Team auswÃƒÂ¤hlen Ã¢â‚¬â€œ</option>
                ${payload.teams.map((team) => `
                  <option value="${resolveRiderTeamEditorTeamKey(team.teamId)}"${state.riderTeamEditorSelectedTeamKey === resolveRiderTeamEditorTeamKey(team.teamId) ? ' selected' : ''}>${esc(team.name)} (${team.riderCount})</option>
                `).join('')}
              </select>
            </div>
            <div class="team-detail-meta">
              <span>${selectedTeamText}</span>
              <span class="text-muted">Sortierung: ${esc(state.riderTeamEditorSort.key === 'teamName' ? 'Team' : RIDER_TEAM_EDITOR_COLUMNS.find((column) => column.key === state.riderTeamEditorSort.key)?.title ?? state.riderTeamEditorSort.key)} ${state.riderTeamEditorSort.direction === 'asc' ? 'aufsteigend' : 'absteigend'}</span>
              <span class="text-muted">Ungespeichert: ${dirtyCount}</span>
            </div>
            <div class="rider-team-editor-actions">
              <button type="button" class="btn btn-secondary" data-rider-team-editor-action="reload">Neu laden</button>
              <button type="button" class="btn btn-secondary" data-rider-team-editor-action="export" ${state.riderTeamEditorExporting ? 'disabled' : ''}>${state.riderTeamEditorExporting ? 'ExportiertÃ¢â‚¬Â¦' : 'riders.csv exportieren'}</button>
              <button type="button" class="btn btn-primary" data-rider-team-editor-action="save" ${dirtyCount === 0 || state.riderTeamEditorSaving ? 'disabled' : ''}>${state.riderTeamEditorSaving ? 'SpeichertÃ¢â‚¬Â¦' : 'Ãƒâ€žnderungen speichern'}</button>
            </div>
          </div>
          <div class="team-detail-table-scroll rider-team-editor-table-scroll">
            <table class="data-table data-table-teams rider-team-editor-table">
              <thead>
                <tr>
                  ${RIDER_TEAM_EDITOR_COLUMNS.map(renderRiderTeamEditorHeader).join('')}
                </tr>
              </thead>
              <tbody>
                ${rows.length === 0
                  ? `<tr><td colspan="${RIDER_TEAM_EDITOR_COLUMNS.length}" class="text-muted">${state.riderTeamEditorSelectedTeamKey ? 'Keine Fahrer im aktuellen Team.' : 'Bitte zuerst ein Team im Dropdown auswÃƒÂ¤hlen.'}</td></tr>`
                  : rows.map((rider) => `
                    <tr class="team-detail-row${isDirtyRiderTeamEditorRow(rider.riderId) ? ' rider-team-editor-row-dirty' : ''}">
                      ${RIDER_TEAM_EDITOR_COLUMNS.map((column) => renderRiderTeamEditorCell(rider, column)).join('')}
                    </tr>
                  `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      ${renderRiderTeamEditorSidebar(payload)}
    </div>`;
}

function formatFormDebugValue(value: number | undefined): string {
  const amount = value ?? 0;
  const prefix = amount > 0 ? '+' : '';
  return `${prefix}${amount.toFixed(2).replace('.', ',')}`;
}

function buildFormSparklinePath(points: Array<{ totalForm: number }>, width: number, height: number, minValue: number, maxValue: number): string {
  if (points.length === 0) {
    return '';
  }

  const chartWidth = width - 20;
  const chartHeight = height - 20;
  return points.map((point, index) => {
    const x = 10 + ((chartWidth * index) / Math.max(1, points.length - 1));
    const normalized = (point.totalForm - minValue) / (maxValue - minValue);
    const y = 10 + chartHeight - (Math.max(0, Math.min(1, normalized)) * chartHeight);
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');
}

function renderRiderFormSparkline(rider: Rider): string {
  const points = rider.formForecast ?? [];
  if (points.length === 0) {
    return '<div class="text-muted">Noch keine Form-Historie vorhanden.</div>';
  }

  const width = 320;
  const height = 110;
  const chartMinForm = -1;
  const chartMaxForm = 8;
  const historyPoints = points.filter((point) => !point.isProjection);
  const projectionStartIndex = Math.max(0, historyPoints.length - 1);
  const projectionPoints = points.slice(projectionStartIndex);
  const peakMarkers = (rider.seasonFormPeakDates ?? []).map((peakDate) => {
    const index = points.findIndex((point) => point.date === peakDate);
    if (index < 0) {
      return '';
    }

    const x = 10 + (((width - 20) * index) / Math.max(1, points.length - 1));
    return `<line class="rider-form-peak-marker" x1="${x.toFixed(2)}" y1="8" x2="${x.toFixed(2)}" y2="102"></line>`;
  }).join('');

  return `
    <div class="rider-form-debug-meta">
      <span><span class="text-muted">S-Form:</span> ${formatFormDebugValue(rider.formBonus)}</span>
      <span><span class="text-muted">R-Form:</span> ${formatFormDebugValue(rider.raceFormBonus)}</span>
      <span><span class="text-muted">Peak:</span> ${esc((rider.seasonFormPeakDates ?? []).join(' Ã‚Â· ') || 'Ã¢â‚¬â€œ')}</span>
    </div>
    <svg class="rider-form-sparkline" viewBox="0 0 ${width} ${height}" role="img" aria-label="Formverlauf Januar bis Oktober">
      <line class="rider-form-axis" x1="10" y1="100" x2="310" y2="100"></line>
      <line class="rider-form-axis" x1="10" y1="10" x2="10" y2="100"></line>
      ${peakMarkers}
      <path class="rider-form-line rider-form-line-history" d="${buildFormSparklinePath(historyPoints, width, height, chartMinForm, chartMaxForm)}"></path>
      <path class="rider-form-line rider-form-line-projection" d="${buildFormSparklinePath(projectionPoints, width, height, chartMinForm, chartMaxForm)}"></path>
      <text class="rider-form-axis-label" x="10" y="108">01.01.</text>
      <text class="rider-form-axis-label" x="286" y="108">31.10.</text>
      <text class="rider-form-axis-label" x="2" y="16">8,0</text>
      <text class="rider-form-axis-label" x="2" y="100">-1,0</text>
    </svg>
    <div class="text-muted">Durchgezogen = Ist, gestrichelt = Prognose.</div>
  `;
}

function getRiderSpecializationLabel(value: Rider['riderType'] | Rider['specialization1']): string {
  switch (value) {
    case 'Berg':
      return 'Bergfahrer';
    case 'Hill':
      return 'HÃƒÂ¼gelspezialist';
    case 'Sprint':
      return 'Sprinter';
    case 'Timetrial':
      return 'Zeitfahrer';
    case 'Cobble':
      return 'Pflasterspezialist';
    case 'Attacker':
      return 'Angreifer';
    default:
      return value ?? 'Keine Spezialisierung';
  }
}

// ============================================================
//  Screens / Modals / Loading
// ============================================================

function showScreen(name: 'menu' | 'game'): void {
  document.querySelectorAll<HTMLElement>('.screen').forEach(s => s.classList.add('hidden'));
  ($(`screen-${name}`)).classList.remove('hidden');
}

function showModal(name: string): void { $(`modal-${name}`).classList.remove('hidden'); }
function hideModal(name: string): void { $(`modal-${name}`).classList.add('hidden'); }

function renderRiderStatsCategoryBadge(categoryName: string | null | undefined): string {
  const categoryStyle = resolveRaceCategoryBadgeStyle(categoryName);
  const badgeStyle = buildRaceCategoryBadgeCssVariables(categoryStyle);
  return `<span class="badge badge-race-category rider-stats-category-badge" style="${badgeStyle}">${esc(categoryName ?? 'Unbekannte Kategorie')}</span>`;
}

function resolveRiderStatsFinalTypeClassName(rowType: RiderStatsPayload['seasons'][number]['raceBlocks'][number]['rows'][number]['rowType']): string {
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

function getRiderStatsRowTypeLabel(rowType: RiderStatsPayload['seasons'][number]['raceBlocks'][number]['rows'][number]['rowType']): string {
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

function renderRiderStatsFinalTypeBadge(rowType: RiderStatsPayload['seasons'][number]['raceBlocks'][number]['rows'][number]['rowType']): string {
  const className = resolveRiderStatsFinalTypeClassName(rowType);
  return `<span class="rider-stats-final-type ${className}">${esc(getRiderStatsRowTypeLabel(rowType))}</span>`;
}

function formatRiderStatsRaceBlockMeta(block: RiderStatsPayload['seasons'][number]['raceBlocks'][number]): string {
  const dateLabel = block.startDate === block.endDate
    ? formatDate(block.startDate)
    : `${formatDate(block.startDate)} - ${formatDate(block.endDate)}`;
  return `${dateLabel} Ã‚Â· ${block.isStageRace ? 'Etappenrennen' : 'Eintagesrennen'}`;
}

function resolveCurrentSeasonRank(riderId: number | null | undefined): number | null {
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

function getRiderStatsFinalTypeSortOrder(rowType: RiderStatsPayload['seasons'][number]['raceBlocks'][number]['rows'][number]['rowType']): number {
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

function sortRiderStatsRowsNewestFirst(rows: RiderStatsPayload['seasons'][number]['raceBlocks'][number]['rows']): RiderStatsPayload['seasons'][number]['raceBlocks'][number]['rows'] {
  return [...rows].sort((left, right) => (
    right.date.localeCompare(left.date)
    || (right.stageNumber ?? -1) - (left.stageNumber ?? -1)
    || getRiderStatsFinalTypeSortOrder(left.rowType) - getRiderStatsFinalTypeSortOrder(right.rowType)
    || (left.resultRank ?? 999) - (right.resultRank ?? 999)
  ));
}

function sortRiderStatsRaceBlocksNewestFirst(blocks: RiderStatsPayload['seasons'][number]['raceBlocks']): RiderStatsPayload['seasons'][number]['raceBlocks'] {
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

function formatRiderStatsCareerRaceDaysTooltip(payload: RiderStatsPayload | null): string {
  const rows = payload?.careerRaceDaysBySeason ?? [];
  if (rows.length === 0) {
    return 'Karriere-Renntage\nNoch keine Renntage erfasst';
  }

  return `Karriere-Renntage\n${rows.map((row) => `${row.season}: ${row.raceDays}`).join('\n')}`;
}

function formatRiderStatsAvailabilityTitle(
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

function renderRiderStatsAvailabilityMarker(rider: Rider | null, payload: RiderStatsPayload | null): string {
  const title = formatRiderStatsAvailabilityTitle(
    payload?.isUnavailable ?? rider?.isUnavailable === true,
    payload?.healthStatusLabel ?? rider?.healthStatusLabel ?? null,
    payload?.unavailableUntil ?? rider?.unavailableUntil ?? null,
    payload?.unavailableDaysRemaining ?? rider?.unavailableDaysRemaining ?? 0,
  );
  if (!title) {
    return '';
  }

  return `<span class="rider-availability-marker" title="${esc(title)}" aria-label="${esc(title)}">Ã¢Å“Å¡</span>`;
}

function renderRiderStatsTitle(rider: Rider | null, payload: RiderStatsPayload | null): string {
  const riderName = payload?.riderName ?? (rider ? formatRiderName(rider) : 'Fahrerstatistik');
  return `${esc(riderName)}${renderRiderStatsAvailabilityMarker(rider, payload)}`;
}

function renderRiderStatsHeatPill(label: string, value: number, maxValue: number): string {
  const ratio = maxValue > 0 ? Math.max(0, Math.min(1, value / maxValue)) : 0.5;
  const hue = Math.round(6 + (ratio * 118));
  const borderAlpha = 0.26 + (ratio * 0.18);
  const bgAlpha = 0.14 + (ratio * 0.12);
  const style = `--rider-stats-pill-hue:${hue};--rider-stats-pill-border-alpha:${borderAlpha.toFixed(2)};--rider-stats-pill-bg-alpha:${bgAlpha.toFixed(2)};`;
  return `<span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${style}">${esc(label)} ${esc(String(value))}</span>`;
}

function renderRiderStatsTerrainSources(payload: RiderStatsPayload | null): string {
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

function renderRiderStatsRaceFormatSources(payload: RiderStatsPayload | null): string {
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

function renderRiderStatsTabs(payload: RiderStatsPayload | null): string {
  const hasProgram = (payload?.programRaces.length ?? 0) > 0;
  return `
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Riderstats Tabs">
      <button type="button" class="team-detail-page-tab${state.riderStatsTab === 'results' ? ' team-detail-page-tab-active' : ''}" data-rider-stats-tab="results" aria-selected="${state.riderStatsTab === 'results' ? 'true' : 'false'}">Ergebnisse</button>
      <button type="button" class="team-detail-page-tab${state.riderStatsTab === 'program' ? ' team-detail-page-tab-active' : ''}" data-rider-stats-tab="program" aria-selected="${state.riderStatsTab === 'program' ? 'true' : 'false'}"${hasProgram ? '' : ' disabled'}>Programm</button>
    </div>`;
}

function renderRiderStatsProgramTab(payload: RiderStatsPayload | null): string {
  const races = payload?.programRaces ?? [];
  if (!payload?.program) {
    return `
      <section class="rider-stats-placeholder">
        <h3>Kein Programm hinterlegt</h3>
        <p>FÃƒÂ¼r diesen Fahrer ist aktuell kein Saisonprogramm vorhanden.</p>
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
                <td class="results-flag-col-cell">${race.country?.code3 ? renderFlag(race.country.code3) : 'Ã¢â‚¬â€œ'}</td>
                <td><strong>${esc(race.name)}</strong></td>
                <td>${renderRiderStatsCategoryBadge(race.category?.name ?? null)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>`;
}

function renderRiderStatsSummary(rider: Rider | null, payload: RiderStatsPayload | null, teamName: string | null, countryCode: string | null, countryFlag: string): string {
  const resolvedCountryCode = payload?.countryCode ?? countryCode ?? null;
  const resolvedCountryFlag = resolvedCountryCode ? renderFlag(resolvedCountryCode) : countryFlag;
  const resolvedRoleName = payload?.roleName ?? rider?.role?.name ?? 'Ohne Rolle';
  const resolvedOverallRating = payload?.overallRating ?? rider?.overallRating ?? 0;
  const resolvedTeamId = payload?.teamId ?? rider?.activeTeamId ?? null;
  const resolvedTeamName = payload?.teamName ?? teamName ?? 'Ohne aktives Team';
  const resolvedSeasonPhase = payload?.seasonFormPhase ?? rider?.seasonFormPhase ?? 'neutral';
  const programName = payload?.program?.name ?? rider?.seasonProgram?.name ?? 'Ã¢â‚¬â€œ';
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
  return `
    <div class="rider-stats-summary">
      <div class="rider-stats-summary-row">
        <span class="rider-stats-summary-pill">${resolvedCountryFlag}<span>${esc(resolvedCountryCode ?? 'Land offen')}</span></span>
        <span class="rider-stats-summary-pill rider-stats-summary-pill-team">${renderMiniJersey(resolvedTeamId, resolvedTeamName)}<span>${esc(resolvedTeamName)}</span></span>
        <span class="rider-stats-summary-pill">${esc(resolvedRoleName)}</span>
        <span class="rider-stats-summary-pill" title="Formphase">${renderSeasonFormPhaseIndicator(resolvedSeasonPhase)}<span>Form</span></span>
        <span class="rider-stats-summary-pill">OVR ${Math.round(resolvedOverallRating)}</span>
        <span class="rider-stats-summary-pill">Saisonpunkte ${esc(String(currentSeasonPoints))}</span>
        <span class="rider-stats-summary-pill">Saisonplatzierung ${currentSeasonRank != null ? `${esc(String(currentSeasonRank))}.` : 'Ã¢â‚¬â€œ'}</span>
        <span class="rider-stats-summary-pill" title="${esc(formatRiderStatsCareerRaceDaysTooltip(payload))}">Renntage ${esc(String(currentSeasonRaceDays))}</span>
        <span class="rider-stats-summary-pill">Siege ${esc(String(careerWins))}</span>
        <span class="rider-stats-summary-pill">AusreiÃƒÅ¸versuche ${esc(String(currentSeasonBreakawayAttempts))}</span>
      </div>
      <div class="rider-stats-summary-row rider-stats-summary-row-secondary">
        <span class="rider-stats-summary-pill">S-Form ${renderSeasonFormValue(formBonus)}</span>
        <span class="rider-stats-summary-pill">R-Form ${renderRaceFormBonusValue(raceFormBonus)}</span>
        <span class="rider-stats-summary-pill">S-Tage ${esc(String(seasonRaceDaysTotal))}</span>
        <span class="rider-stats-summary-pill${shortTermFatigueWarning === 'warning' ? ' rider-stats-summary-pill-warning' : shortTermFatigueWarning === 'critical' ? ' rider-stats-summary-pill-critical' : ''}">${shortTermFatigueWarning === 'critical' ? 'Zusammenbruch' : '30T'} ${esc(String(rolling30dRaceDays))}</span>
        <span class="rider-stats-summary-pill">Langzeit ${renderLoadMalusValue(longTermFatigueMalus)}</span>
        <span class="rider-stats-summary-pill${shortTermFatigueWarning === 'warning' ? ' rider-stats-summary-pill-warning' : shortTermFatigueWarning === 'critical' ? ' rider-stats-summary-pill-critical' : ''}">Akut ${renderLoadMalusValue(shortTermFatigueMalus, shortTermFatigueWarning)}</span>
        <span class="rider-stats-summary-pill">Programm ${esc(programName)}</span>
        ${renderRiderStatsTerrainSources(payload)}
        ${renderRiderStatsRaceFormatSources(payload)}
      </div>
    </div>`;
}

function renderRiderStatsRankBadge(label: string, variant: 'place' | 'gc'): string {
  return `<span class="rider-stats-rank-badge rider-stats-rank-badge-${variant}">${esc(label)}</span>`;
}

function renderRiderStatsBreakaway(row: RiderStatsPayload['seasons'][number]['raceBlocks'][number]['rows'][number]): string {
  if (!row.isBreakaway || row.rowType !== 'stage_result' || row.finishStatus !== 'classified') {
    return 'Ã¢â‚¬â€œ';
  }

  return '<span class="rider-stats-breakaway-icon" aria-label="AusreiÃƒÅ¸er" title="AusreiÃƒÅ¸er">Ã¢â€“Â¼</span>';
}

function renderRiderStatsPlacement(row: RiderStatsPayload['seasons'][number]['raceBlocks'][number]['rows'][number]): string {
  if (row.finishStatus === 'otl') {
    return renderRiderStatsRankBadge('OTL', 'place');
  }
  if (row.finishStatus === 'dnf') {
    return renderRiderStatsRankBadge('DNF', 'place');
  }
  if (row.resultRank == null) {
    return 'Ã¢â‚¬â€œ';
  }
  const topRankClassName = row.resultRank <= 3 ? ` rider-stats-rank-badge-top-${row.resultRank}` : '';
  return `<span class="rider-stats-rank-badge rider-stats-rank-badge-place${topRankClassName}">${esc(String(row.resultRank))}</span>`;
}

function renderRiderStatsGcPlacement(row: RiderStatsPayload['seasons'][number]['raceBlocks'][number]['rows'][number]): string {
  if (row.finishStatus !== 'classified' || row.gcRank == null) {
    return 'Ã¢â‚¬â€œ';
  }
  return renderRiderStatsRankBadge(String(row.gcRank), 'gc');
}

function formatRiderStatsResultDetail(row: RiderStatsPayload['seasons'][number]['raceBlocks'][number]['rows'][number]): string {
  if (row.finishStatus === 'otl') {
    return formatNonFinisherReason(row.statusReason, true);
  }
  if (row.finishStatus === 'dnf') {
    return formatNonFinisherReason(row.statusReason, false);
  }
  if (row.stageTimeSeconds != null) {
    return `${row.resultLabel} Ã‚Â· ${formatRaceTime(row.stageTimeSeconds)}`;
  }
  return row.resultLabel;
}

function renderRiderStatsBody(rider: Rider | null, payload: RiderStatsPayload | null, isLoading = false): string {
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
        <p>FÃƒÂ¼r diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
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
        <p>FÃƒÂ¼r diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
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
                    <col style="width: 8%;">
                    <col style="width: 5%;">
                    <col style="width: 5%;">
                    <col style="width: 3%;">`n                    <col style="width: 15%;">`n                    <col style="width: 35%;">
                    <col style="width: 6%;">
                    <col style="width: 6%;">
                    <col style="width: 5%;">
                    <col style="width: 8%;">
                    <col style="width: 4%;">
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
                    ${block.rows.map((row) => {
                      const isFinalRow = row.rowType !== 'stage_result';
                      const raceStageLabel = isFinalRow
                        ? `${row.raceName} Ã‚Â· ${getRiderStatsRowTypeLabel(row.rowType)}`
                        : (row.stageName ? `${row.raceName} Ã‚Â· ${row.stageName}` : row.raceName);
                      return `
                        <tr class="rider-stats-row${isFinalRow ? ' rider-stats-row-final' : ''}">
                          <td>${esc(formatDate(row.date))}</td>
                          <td>${renderRiderStatsPlacement(row)}</td>
                          <td>${renderRiderStatsGcPlacement(row)}</td>
                          <td class="rider-stats-breakaway-col">${renderRiderStatsBreakaway(row)}</td>
                          <td>${isFinalRow ? renderRiderStatsFinalTypeBadge(row.rowType) : renderRiderStatsCategoryBadge(row.raceCategoryName)}</td>
                          <td>${esc(raceStageLabel)}</td>
                          <td>${row.profile ? renderStageProfileBadge(row.profile) : 'Ã¢â‚¬â€œ'}</td>
                          <td>${row.distanceKm != null ? esc(row.distanceKm.toFixed(1).replace('.', ',')) : 'Ã¢â‚¬â€œ'}</td>
                          <td>${row.elevationGainMeters != null ? esc(String(row.elevationGainMeters)) : 'Ã¢â‚¬â€œ'}</td>
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

async function openRiderStats(riderId: number): Promise<void> {
  const rider = findRiderById(riderId);
  const teamName = rider?.activeTeamId != null
    ? state.teams.find((team) => team.id === rider.activeTeamId)?.name ?? null
    : null;

  state.riderStatsSelectedRiderId = riderId;
  state.riderStatsPayload = null;
  state.riderStatsTab = 'results';
  $('rider-stats-title').innerHTML = renderRiderStatsTitle(rider, null);
  $('rider-stats-meta').textContent = rider
    ? `${rider.role?.name ?? 'Fahrer'} Ã‚Â· ${teamName ?? 'Team unbekannt'}`
    : 'Historie wird geladen';
  $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, null, true);
  showModal('riderStats');

  const res = await api.getRiderStats(riderId);
  if (state.riderStatsSelectedRiderId !== riderId) {
    return;
  }

  if (!res.success || !res.data) {
    $('rider-stats-meta').textContent = rider
      ? `${rider.role?.name ?? 'Fahrer'} Ã‚Â· ${teamName ?? 'Team unbekannt'}`
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
  $('rider-stats-meta').textContent = `${rider?.role?.name ?? 'Fahrer'} Ã‚Â· ${res.data.teamName ?? teamName ?? 'Ohne aktives Team'} Ã‚Â· ${res.data.seasons.length} Saisons`;
  $('rider-stats-body').innerHTML = renderRiderStatsBody(rider, res.data, false);
}

function showLoading(msg = 'LadeÃ¢â‚¬Â¦'): void {
  $('loading-msg').textContent = msg;
  $('loading-progress').classList.add('hidden');
  $('loading-overlay').classList.remove('hidden');
}
function hideLoading(): void { $('loading-overlay').classList.add('hidden'); }

function showInstantProgress(progress: number): void {
  $('loading-progress').classList.remove('hidden');
  $('loading-overlay').classList.remove('hidden');
  updateInstantProgress(progress);
}
function updateInstantProgress(progress: number): void {
  const percent = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  $('loading-msg').textContent = `Instant-Simulation lÃƒÂ¤uft Ã¢â‚¬Â¦ ${percent}%`;
  $<HTMLDivElement>('loading-progress-bar').style.width = `${percent}%`;
}

function showError(elemId: string, msg: string): void {
  const el = $(elemId);
  el.textContent = msg;
  el.classList.remove('hidden');
}
function hideError(elemId: string): void { $(elemId).classList.add('hidden'); }

function activateView(name: string): void {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll<HTMLElement>('.nav-btn').forEach(b => b.classList.remove('active'));
  $(`view-${name}`).classList.add('active');
  document.querySelector<HTMLElement>(`.nav-btn[data-view="${name}"]`)?.classList.add('active');
  $('game-state-bar').classList.toggle('hidden', name === 'live-race');
  if (name === 'stage-editor') {
    void loadStageEditorExistingStages();
  }
  if (name === 'stage-editor-stages' || name === 'stage-editor-climbs') {
    void loadStageEditorOverview();
  }
  if (name !== 'live-race') {
    raceSimView?.pause();
    return;
  }

  if (
    state.selectedRealtimeStageId != null
    && realtimeStageLoadInFlightId !== state.selectedRealtimeStageId
    && (!state.realtimeBootstrap || state.realtimeBootstrap.stage.id !== state.selectedRealtimeStageId)
  ) {
    void openRealtimeStage(state.selectedRealtimeStageId, false);
  }
}

function isActiveView(name: string): boolean {
  return document.getElementById(`view-${name}`)?.classList.contains('active') === true;
}

function getRaceSimView(): RaceSimView {
  if (!raceSimView) {
    raceSimView = new RaceSimView({
      layout: $('race-sim-layout'),
      emptyState: $('race-sim-empty'),
      controlsHeader: $('race-sim-controls-header'),
      profile: $('race-sim-profile'),
      groupBox: $('race-sim-group-box'),
      messages: $('race-sim-messages-body'),
      favorites: $('race-sim-favorites-body'),
      sidebar: $('race-sim-sidebar-body'),
      controls: $('race-sim-controls'),
      meta: $('race-sim-stage-meta'),
    }, {
      onFinishRequested: (snapshot, bootstrap) => {
        const entries = buildRealtimeCommitEntries(snapshot, bootstrap);
        void completeRealtimeStage(bootstrap.stage.id, entries, snapshot.markerClassifications, snapshot.incidents);
      },
    });
  }
  return raceSimView;
}

function formatPendingStageLabel(raceName: string, stageNumber: number, profile: StageProfile): string {
  return `${raceName} Ã‚Â· Etappe ${stageNumber} Ã‚Â· ${profile}`;
}

function buildRealtimeCommitEntries(
  snapshot: SimulationSnapshot,
  bootstrap: RealtimeSimulationBootstrap,
): RealtimeStageCommitEntry[] {
  return snapshot.riders
    .map((rider) => ({
      riderId: rider.riderId,
      finishTimeSeconds: bootstrap.stage.profile === 'ITT' || bootstrap.stage.profile === 'TTT'
        ? rider.riderClockSeconds
        : rider.finishTimeSeconds,
      finishStatus: rider.finishStatus ?? 'finished',
      isBreakaway: rider.isBreakaway,
      statusReason: rider.statusReason ?? null,
      photoFinishScore: rider.photoFinishScore,
    } satisfies RealtimeStageCommitEntry))
    .filter((entry) => entry.finishStatus === 'dnf' || entry.finishTimeSeconds != null);
}

async function openInstantStage(stageId: number): Promise<void> {
  if (instantStageInFlightId != null || realtimeCompletionInFlight) {
    return;
  }

  instantStageInFlightId = stageId;
  showInstantProgress(0);
  try {
    const res = await api.getRealtimeSimulation(stageId);
    if (!res.success || !res.data) {
      alert('Instant-Simulation fehlgeschlagen:\n' + (res.error ?? 'Unbekannter Fehler'));
      return;
    }

    const bootstrap = res.data;
    const snapshot = await runInstantSimulation(bootstrap, (progress) => updateInstantProgress(progress));
    const entries = buildRealtimeCommitEntries(snapshot, bootstrap);
    await completeRealtimeStage(stageId, entries, snapshot.markerClassifications, snapshot.incidents);
  } catch (error) {
    alert('Unerwarteter Fehler bei der Instant-Simulation: ' + (error as Error).message);
  } finally {
    instantStageInFlightId = null;
    hideLoading();
  }
}

function canEditPendingStage(stage: PendingStage): boolean {
  return stage.stageId > 0;
}

function getRosterEditorSelectedCount(teamId: number): number {
  const team = state.rosterEditor?.teams.find((entry) => entry.team.id === teamId);
  if (!team) return 0;
  const selected = new Set(state.rosterEditorSelectedRiderIds);
  return team.riders.filter((riderOption) => selected.has(riderOption.rider.id)).length;
}

function isRosterEditorSelectionValid(): boolean {
  if (!state.rosterEditor) return false;
  return state.rosterEditor.teams.every((team) => getRosterEditorSelectedCount(team.team.id) === team.riderLimit);
}

function renderRosterEditor(): void {
  const title = $('roster-editor-title');
  const meta = $('roster-editor-meta');
  const body = $('roster-editor-body');
  const applyButton = $<HTMLButtonElement>('btn-apply-roster-editor');
  const payload = state.rosterEditor;

  if (!payload) {
    title.textContent = 'Starterfeld bearbeiten';
    meta.textContent = '';
    body.innerHTML = '<div class="results-empty">Kein Starterfeld geladen.</div>';
    applyButton.disabled = true;
    return;
  }

  title.textContent = 'Starterfeld bearbeiten';
  meta.textContent = payload.race.isStageRace
    ? `${payload.race.name} Ã‚Â· Etappe ${payload.stage.stageNumber} Ã‚Â· ${payload.stage.profile}`
    : `${payload.race.name} Ã‚Â· ${payload.stage.profile}`;

  const selectedIds = new Set(state.rosterEditorSelectedRiderIds);
  body.innerHTML = payload.teams.map((teamEntry) => {
    const selectedCount = getRosterEditorSelectedCount(teamEntry.team.id);
    const selectionStateClass = selectedCount === teamEntry.riderLimit
      ? 'roster-editor-team-count-ok'
      : 'roster-editor-team-count-bad';

    return `
      <section class="roster-editor-team">
        <div class="roster-editor-team-head">
          <div>
            <h3>${esc(teamEntry.team.name)}</h3>
            <p class="text-muted">${esc(teamEntry.team.abbreviation)} Ã‚Â· ${esc(teamEntry.team.division ?? teamEntry.team.divisionName ?? 'Team')}</p>
          </div>
          <div class="roster-editor-team-count ${selectionStateClass}">${selectedCount} / ${teamEntry.riderLimit}</div>
        </div>
        <div class="roster-editor-riders">
          ${teamEntry.riders.map((riderOption) => {
            const isSelected = selectedIds.has(riderOption.rider.id);
            const classes = [
              'roster-editor-rider',
              isSelected ? 'roster-editor-rider-selected' : '',
              riderOption.isLocked ? 'roster-editor-rider-locked' : '',
            ].filter(Boolean).join(' ');
            const flag = riderOption.rider.country ? renderFlag(riderOption.rider.country.code3) : '';
            const subtitle = [riderOption.rider.role?.name ?? 'Ohne Rolle', `OVR ${Math.round(riderOption.rider.overallRating)}`].join(' Ã‚Â· ');
            const lockReason = riderOption.lockReason ? `<span class="roster-editor-rider-lock">${esc(riderOption.lockReason)}</span>` : '';
            return `
              <button
                type="button"
                class="${classes}"
                data-roster-team-id="${teamEntry.team.id}"
                data-roster-rider-id="${riderOption.rider.id}"
                ${riderOption.isLocked ? 'disabled' : ''}
              >
                <span class="roster-editor-rider-name">${flag}<span>${esc(riderOption.rider.firstName)} ${esc(riderOption.rider.lastName)}</span></span>
                <span class="roster-editor-rider-meta">${esc(subtitle)}</span>
                ${lockReason}
              </button>`;
          }).join('')}
        </div>
      </section>`;
  }).join('');

  applyButton.disabled = !isRosterEditorSelectionValid();
}

function hideRosterEditor(): void {
  state.rosterEditor = null;
  state.rosterEditorSelectedRiderIds = [];
  hideError('roster-editor-error');
  hideModal('rosterEditor');
}

function startRealtimeSimulation(bootstrap: RealtimeSimulationBootstrap, activateLiveView: boolean): void {
  state.selectedRealtimeStageId = bootstrap.stage.id;
  state.realtimeBootstrap = bootstrap;
  state.realtimeError = null;
  if (activateLiveView) {
    activateView('live-race');
  }
  getRaceSimView().load(bootstrap, { autoplay: true, resetSpeed: true });
  renderRealtimeRaceView();
}

async function openRosterEditor(stageId: number): Promise<void> {
  showLoading('Starterfeld wird geladen...');
  hideError('roster-editor-error');
  try {
    const res = await api.getRosterEditor(stageId);
    if (!res.success || !res.data) {
      showError('roster-editor-error', res.error ?? 'Starterfeld konnte nicht geladen werden.');
      showModal('rosterEditor');
      renderRosterEditor();
      return;
    }

    state.rosterEditor = res.data;
    state.rosterEditorSelectedRiderIds = res.data.teams
      .flatMap((team) => team.riders.filter((riderOption) => riderOption.isSelected).map((riderOption) => riderOption.rider.id));
    renderRosterEditor();
    showModal('rosterEditor');
  } catch (error) {
    state.rosterEditor = null;
    state.rosterEditorSelectedRiderIds = [];
    showError('roster-editor-error', (error as Error).message);
    showModal('rosterEditor');
    renderRosterEditor();
  } finally {
    hideLoading();
  }
}

async function applyRosterEditor(): Promise<void> {
  const payload = state.rosterEditor;
  if (!payload) {
    return;
  }
  if (!isRosterEditorSelectionValid()) {
    showError('roster-editor-error', 'Dein Team muss genau die erlaubte Zahl an Fahrern stellen.');
    return;
  }

  hideError('roster-editor-error');
  showLoading('Starterfeld wird ÃƒÂ¼bernommen...');
  try {
    const res = await api.applyRosterEditor(payload.stage.id, { riderIds: state.rosterEditorSelectedRiderIds });
    if (!res.success || !res.data) {
      showError('roster-editor-error', res.error ?? 'Starterfeld konnte nicht ÃƒÂ¼bernommen werden.');
      return;
    }

    hideRosterEditor();
    startRealtimeSimulation(res.data, true);
  } catch (error) {
    showError('roster-editor-error', (error as Error).message);
  } finally {
    hideLoading();
  }
}

function renderRealtimeRaceView(): void {
  const select = $<HTMLSelectElement>('race-sim-stage-select');
  const pendingStages = state.gameStatus?.pendingStages ?? [];
  const selectedStillAvailable = pendingStages.some((stage) => stage.stageId === state.selectedRealtimeStageId);

  if (!selectedStillAvailable) {
    state.selectedRealtimeStageId = pendingStages[0]?.stageId ?? null;
    if (state.realtimeBootstrap && state.realtimeBootstrap.stage.id !== state.selectedRealtimeStageId) {
      state.realtimeBootstrap = null;
    }
  }

  select.innerHTML = pendingStages.length === 0
    ? '<option value="">Ã¢â‚¬â€œ Keine offenen Etappen Ã¢â‚¬â€œ</option>'
    : pendingStages.map((stage) => `
      <option value="${stage.stageId}"${stage.stageId === state.selectedRealtimeStageId ? ' selected' : ''}>${esc(formatPendingStageLabel(stage.raceName, stage.stageNumber, stage.profile))}</option>
    `).join('');
  select.disabled = pendingStages.length === 0;

  const selectedStage = pendingStages.find((stage) => stage.stageId === state.selectedRealtimeStageId) ?? null;
  const simView = getRaceSimView();

  if (!selectedStage) {
    state.realtimeBootstrap = null;
    state.realtimeError = null;
    simView.clear('Heute gibt es keine offenen Etappen fÃƒÂ¼r die Live-Simulation.');
    return;
  }

  if (!state.realtimeBootstrap || state.realtimeBootstrap.stage.id !== selectedStage.stageId) {
    if (state.realtimeError) {
      simView.clear(state.realtimeError);
    } else {
      simView.hide();
    }
  }
}

async function openRealtimeStage(stageId: number, activateLiveView: boolean): Promise<void> {
  if (realtimeStageLoadInFlightId === stageId) {
    return;
  }

  realtimeStageLoadInFlightId = stageId;
  state.selectedRealtimeStageId = stageId;
  if (activateLiveView) {
    activateView('live-race');
  }
  renderRealtimeRaceView();
  showLoading('Live-Simulation wird geladen...');
  try {
    const res = await api.getRealtimeSimulation(stageId);
    if (!res.success || !res.data) {
      state.realtimeBootstrap = null;
      state.realtimeError = res.error ?? 'Live-Simulation konnte nicht geladen werden.';
      renderRealtimeRaceView();
      alert('Live-Simulation fehlgeschlagen:\n' + (res.error ?? 'Unbekannter Fehler'));
      return;
    }

    startRealtimeSimulation(res.data, false);
  } catch (error) {
    state.realtimeBootstrap = null;
    state.realtimeError = (error as Error).message;
    renderRealtimeRaceView();
    alert('Unerwarteter Fehler bei der Live-Simulation: ' + (error as Error).message);
  } finally {
    if (realtimeStageLoadInFlightId === stageId) {
      realtimeStageLoadInFlightId = null;
    }
    hideLoading();
  }
}

function findRaceById(raceId: number | null): Race | null {
  if (raceId == null) return null;
  return state.races.find((race) => race.id === raceId) ?? null;
}

function findStageById(stageId: number | null): { race: Race; stage: NonNullable<Race['stages']>[number] } | null {
  if (stageId == null) return null;
  for (const race of state.races) {
    const stage = race.stages?.find((candidate) => candidate.id === stageId);
    if (stage) {
      return { race, stage };
    }
  }
  return null;
}

function formatResultsStageLabel(race: Race, stage: NonNullable<Race['stages']>[number]): string {
  const stageLabel = race.isStageRace ? `Etappe ${stage.stageNumber}` : 'Renntag';
  return `${race.name} Ã‚Â· ${stageLabel} Ã‚Â· ${formatDate(stage.date)}`;
}

// ============================================================
//  Save-Liste
// ============================================================

async function loadSavesList(): Promise<void> {
  const res = await api.listSaves();
  const container = $('saves-list');
  const deleteAllButton = $('btn-delete-all-careers');
  if (!res.success || !res.data || res.data.length === 0) {
    container.classList.add('hidden');
    deleteAllButton.classList.add('hidden');
    return;
  }
  container.classList.remove('hidden');
  deleteAllButton.classList.remove('hidden');
  container.innerHTML = res.data.map(save => `
    <div class="save-card">
      <h3>${esc(save.careerName)}</h3>
      <p class="save-meta">
        ${esc(save.teamName)} Ã‚Â· Saison ${save.currentSeason}
        ${save.lastSaved ? 'Ã‚Â· ' + formatDate(save.lastSaved) : ''}
      </p>
      <div class="save-actions">
        <button class="btn btn-primary btn-sm" data-save-action="load" data-filename="${esc(save.filename)}">Laden</button>
        <button class="btn btn-danger btn-sm" data-save-action="delete" data-filename="${esc(save.filename)}" data-career-name="${esc(save.careerName)}">LÃƒÂ¶schen</button>
      </div>
    </div>
  `).join('');
}

async function onLoadSave(filename: string): Promise<void> {
  showLoading('Karriere wird geladenÃ¢â‚¬Â¦');
  const res = await api.loadSave(filename);
  hideLoading();
  if (!res.success) { alert('Fehler beim Laden: ' + res.error); return; }
  state.currentSave = res.data ?? null;
  await enterGameScreen();
}

async function onDeleteSave(filename: string, name: string): Promise<void> {
  if (!confirm(`Karriere "${name}" wirklich lÃƒÂ¶schen?`)) return;
  showLoading('LÃƒÂ¶schenÃ¢â‚¬Â¦');
  const res = await api.deleteSave(filename);
  hideLoading();
  if (!res.success) { alert('Fehler: ' + res.error); return; }
  await loadSavesList();
}

async function onDeleteAllSaves(): Promise<void> {
  const res = await api.listSaves();
  const saves = res.success ? (res.data ?? []) : [];
  if (saves.length === 0) {
    $('btn-delete-all-careers').classList.add('hidden');
    $('saves-list').classList.add('hidden');
    return;
  }

  if (!confirm(`Wirklich alle ${saves.length} Karrieren lÃƒÂ¶schen?`)) return;
  if (!confirm('Dieser Schritt lÃƒÂ¶scht alle SpielstÃƒÂ¤nde dauerhaft. Wirklich fortfahren?')) return;

  showLoading('Alle Karrieren werden gelÃƒÂ¶schtÃ¢â‚¬Â¦');
  try {
    for (const save of saves) {
      const deleteRes = await api.deleteSave(save.filename);
      if (!deleteRes.success) {
        alert(`Fehler beim LÃƒÂ¶schen von "${save.careerName}": ${deleteRes.error ?? 'Unbekannter Fehler'}`);
        break;
      }
    }
  } finally {
    hideLoading();
  }

  await loadSavesList();
}

// ============================================================
//  Neue Karriere
// ============================================================

$('btn-new-career').addEventListener('click', async () => {
  hideError('new-career-error');
  ($<HTMLInputElement>('input-career-name')).value = '';
  const select = $<HTMLSelectElement>('input-team-id');
  select.innerHTML = '<option value="">Wird geladenÃ¢â‚¬Â¦</option>';
  showModal('newCareer');
  const res = await api.getAvailableTeams();
  if (!res.success || !res.data?.length) {
    select.innerHTML = '<option value="">Fehler beim Laden der Teams</option>';
    return;
  }
  select.innerHTML = res.data.map(t =>
    `<option value="${t.id}">${esc(t.name)} (${esc(t.division ?? t.divisionName ?? '')})</option>`,
  ).join('');
});
$('btn-cancel-new').addEventListener('click', () => hideModal('newCareer'));
$('btn-close-race-stages').addEventListener('click', () => hideModal('raceStages'));
$('btn-close-stage-profile').addEventListener('click', () => hideModal('stageProfile'));
$('btn-close-rider-program').addEventListener('click', () => hideModal('riderProgram'));
$('btn-close-rider-stats').addEventListener('click', () => hideModal('riderStats'));
$('btn-close-race-participants').addEventListener('click', () => hideModal('raceParticipants'));
$('btn-close-roster-editor').addEventListener('click', () => hideRosterEditor());
$('btn-cancel-roster-editor').addEventListener('click', () => hideRosterEditor());
$('btn-apply-roster-editor').addEventListener('click', () => {
  void applyRosterEditor();
});

$('roster-editor-body').addEventListener('click', (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button[data-roster-rider-id]');
  if (!button || button.disabled || !state.rosterEditor) return;

  const teamId = Number(button.dataset['rosterTeamId']);
  const riderId = Number(button.dataset['rosterRiderId']);
  if (!Number.isFinite(teamId) || !Number.isFinite(riderId)) return;

  const team = state.rosterEditor.teams.find((entry) => entry.team.id === teamId);
  if (!team) return;

  const selected = new Set(state.rosterEditorSelectedRiderIds);
  if (selected.has(riderId)) {
    state.rosterEditorSelectedRiderIds = state.rosterEditorSelectedRiderIds.filter((id) => id !== riderId);
    renderRosterEditor();
    return;
  }

  if (getRosterEditorSelectedCount(teamId) >= team.riderLimit) {
    showError('roster-editor-error', `${team.team.name} darf nur ${team.riderLimit} Fahrer nominieren.`);
    return;
  }

  hideError('roster-editor-error');
  state.rosterEditorSelectedRiderIds = [...state.rosterEditorSelectedRiderIds, riderId];
  renderRosterEditor();
});

$('btn-confirm-new').addEventListener('click', async () => {
  const careerName = ($<HTMLInputElement>('input-career-name')).value.trim();
  const teamIdVal  = ($<HTMLSelectElement>('input-team-id')).value;
  if (!careerName || !teamIdVal) {
    showError('new-career-error', 'Bitte Karriere-Name und Team auswÃƒÂ¤hlen.');
    return;
  }
  const teamId = Number(teamIdVal);
  const slug     = careerName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20);
  const filename = `${slug}_${Date.now()}.db`;
  hideError('new-career-error');
  showLoading('Neue Karriere wird erstelltÃ¢â‚¬Â¦');
  const res = await api.createSave(filename, careerName, teamId);
  if (!res.success) { hideLoading(); showError('new-career-error', res.error ?? 'Unbekannter Fehler.'); return; }
  const loadRes = await api.loadSave(filename);
  hideLoading();
  hideModal('newCareer');
  if (!loadRes.success) { alert('Fehler: ' + loadRes.error); return; }
  state.currentSave = loadRes.data ?? null;
  await enterGameScreen();
});

// ============================================================
//  Karriere laden
// ============================================================

$('btn-load-career').addEventListener('click', () => loadSavesList());
$('btn-delete-all-careers').addEventListener('click', () => {
  void onDeleteAllSaves();
});

$('saves-list').addEventListener('click', async (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button[data-save-action]');
  if (!button) return;
  const { saveAction, filename, careerName } = button.dataset;
  if (!filename) return;
  if (saveAction === 'load') { await onLoadSave(filename); return; }
  if (saveAction === 'delete') { await onDeleteSave(filename, careerName ?? filename); }
});

// ============================================================
//  Game Screen
// ============================================================

async function enterGameScreen(): Promise<void> {
  showScreen('game');
  $('meta-career').textContent = state.currentSave?.careerName ?? '';
  activateView('dashboard');
  showLoading('Spiel wird geladenÃ¢â‚¬Â¦');
  try {
    await loadGameState();
    await loadRaces();
    renderDashboard();
  } catch (e) {
    alert('Fehler beim Laden des Spiels: ' + (e as Error).message);
  } finally {
    hideLoading();
  }
}

document.querySelectorAll<HTMLElement>('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const view = btn.dataset['view'] ?? '';
    activateView(view);
    if (view === 'dashboard') renderDashboard();
    if (view === 'teams') void refreshTeamsViewData(); // immer neu laden bei Nav-Klick
    if (view === 'riders') void refreshTeamsViewData();
    if (view === 'rider-team-editor') void loadRiderTeamEditorData();
    if (view === 'live-race') renderRealtimeRaceView();
    if (view === 'results') renderResultsView();
    if (view === 'season-standings') void loadSeasonStandings(true);
  });
});

document.body.addEventListener('click', (event) => {
  const riderButton = (event.target as Element).closest<HTMLButtonElement>('button.app-rider-link[data-rider-id]');
  if (!riderButton) {
    return;
  }

  const riderId = Number(riderButton.dataset['riderId']);
  if (!Number.isFinite(riderId)) {
    return;
  }

  openRiderStats(riderId);
});

$('stage-editor-stages-table').addEventListener('click', (event) => {
  const sortButton = (event.target as Element).closest<HTMLButtonElement>('button[data-stage-editor-stages-sort]');
  if (!sortButton) return;

  const sortKey = sortButton.dataset['stageEditorStagesSort'] as StageEditorStagesSortKey;
  if (state.stageEditorStagesSort.key === sortKey) {
    state.stageEditorStagesSort.direction = state.stageEditorStagesSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    state.stageEditorStagesSort = {
      key: sortKey,
      direction: getDefaultStageEditorStagesSortDirection(sortKey),
    };
  }
  renderStageEditorStagesOverview();
});

$('stage-editor-stages-table').addEventListener('click', async (event) => {
  const profileButton = (event.target as Element).closest<HTMLButtonElement>('button[data-stage-profile-open-stage-id]');
  if (!profileButton) {
    return;
  }

  const stageId = Number(profileButton.dataset['stageProfileOpenStageId']);
  if (!Number.isFinite(stageId)) {
    return;
  }

  await openDashboardStageProfile(stageId);
});

$('stage-editor-climbs-table').addEventListener('click', (event) => {
  const sortButton = (event.target as Element).closest<HTMLButtonElement>('button[data-stage-editor-climbs-sort]');
  if (!sortButton) return;

  const sortKey = sortButton.dataset['stageEditorClimbsSort'] as StageEditorClimbsSortKey;
  if (state.stageEditorClimbsSort.key === sortKey) {
    state.stageEditorClimbsSort.direction = state.stageEditorClimbsSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    state.stageEditorClimbsSort = {
      key: sortKey,
      direction: getDefaultStageEditorClimbsSortDirection(sortKey),
    };
  }
  renderStageEditorClimbsOverview();
});

$('stage-editor-climbs-table').addEventListener('click', async (event) => {
  const profileButton = (event.target as Element).closest<HTMLButtonElement>('button[data-stage-profile-open-stage-id]');
  if (!profileButton) {
    return;
  }

  const stageId = Number(profileButton.dataset['stageProfileOpenStageId']);
  if (!Number.isFinite(stageId)) {
    return;
  }

  const climbId = profileButton.dataset['stageProfileOpenClimbId'] ?? null;
  const selectedClimb = climbId != null
    ? state.stageEditorClimbRows.find((row) => row.id === climbId) ?? null
    : null;
  await openDashboardStageProfile(stageId, selectedClimb);
});

$<HTMLSelectElement>('teams-dropdown').addEventListener('change', (e) => {
  const val = (e.target as HTMLSelectElement).value;
  state.teamDetailPage = 'skills';
  renderTeamDetail(val ? Number(val) : null);
});

$('teams-detail').addEventListener('click', (event) => {
  const programButton = (event.target as Element).closest<HTMLButtonElement>('button[data-rider-program-id]');
  if (programButton) {
    const riderId = Number(programButton.dataset['riderProgramId']);
    if (Number.isFinite(riderId)) {
      void openRiderProgram(riderId);
    }
    return;
  }

  const pageButton = (event.target as Element).closest<HTMLButtonElement>('button[data-team-detail-page]');
  if (pageButton) {
    const nextPage = pageButton.dataset['teamDetailPage'] as TeamDetailPage;
    if (TEAM_DETAIL_PAGE_ORDER.includes(nextPage)) {
      state.teamDetailPage = nextPage;
      const visibleSortKeys = new Set(getActiveTeamTableColumns().map((column) => column.sortKey).filter((sortKey): sortKey is TeamTableSortKey => sortKey != null));
      if (!visibleSortKeys.has(state.teamTableSort.key)) {
        state.teamTableSort = { key: 'name', direction: 'asc' };
      }
      const selectedTeamId = Number($<HTMLSelectElement>('teams-dropdown').value);
      renderTeamDetail(Number.isFinite(selectedTeamId) ? selectedTeamId : null);
    }
    return;
  }

  const sortButton = (event.target as Element).closest<HTMLButtonElement>('button[data-team-sort]');
  if (sortButton) {
    const sortKey = sortButton.dataset['teamSort'] as TeamTableSortKey;
    if (state.teamTableSort.key === sortKey) {
      state.teamTableSort.direction = state.teamTableSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      state.teamTableSort = {
        key: sortKey,
        direction: getDefaultTeamSortDirection(sortKey),
      };
    }
    const selectedTeamId = Number($<HTMLSelectElement>('teams-dropdown').value);
    renderTeamDetail(Number.isFinite(selectedTeamId) ? selectedTeamId : null);
    return;
  }
});

$('riders-detail').addEventListener('click', (event) => {
  const programButton = (event.target as Element).closest<HTMLButtonElement>('button[data-rider-program-id]');
  if (programButton) {
    const riderId = Number(programButton.dataset['riderProgramId']);
    if (Number.isFinite(riderId)) {
      void openRiderProgram(riderId);
    }
    return;
  }

  const pageButton = (event.target as Element).closest<HTMLButtonElement>('button[data-riders-detail-page]');
  if (pageButton) {
    const nextPage = pageButton.dataset['ridersDetailPage'] as TeamDetailPage;
    if (TEAM_DETAIL_PAGE_ORDER.includes(nextPage)) {
      state.riderMenuDetailPage = nextPage;
      const visibleSortKeys = new Set(getActiveRiderMenuTableColumns().map((column) => column.sortKey).filter((sortKey): sortKey is TeamTableSortKey => sortKey != null));
      if (!visibleSortKeys.has(state.riderMenuTableSort.key)) {
        state.riderMenuTableSort = { key: 'name', direction: 'asc' };
      }
      state.riderMenuPage = 1;
      renderRidersMenu();
    }
    return;
  }

  const sortButton = (event.target as Element).closest<HTMLButtonElement>('button[data-riders-sort]');
  if (sortButton) {
    const sortKey = sortButton.dataset['ridersSort'] as TeamTableSortKey;
    if (state.riderMenuTableSort.key === sortKey) {
      state.riderMenuTableSort.direction = state.riderMenuTableSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      state.riderMenuTableSort = {
        key: sortKey,
        direction: getDefaultTeamSortDirection(sortKey),
      };
    }
    state.riderMenuPage = 1;
    renderRidersMenu();
    return;
  }

  const paginationButton = (event.target as Element).closest<HTMLButtonElement>('button[data-riders-page-action]');
  if (paginationButton) {
    const action = paginationButton.dataset['ridersPageAction'];
    const totalPages = Math.max(1, Math.ceil(state.riders.length / RIDER_MENU_PAGE_SIZE));
    if (action === 'prev') {
      state.riderMenuPage = Math.max(1, state.riderMenuPage - 1);
    }
    if (action === 'next') {
      state.riderMenuPage = Math.min(totalPages, state.riderMenuPage + 1);
    }
    renderRidersMenu();
    return;
  }
});

$('view-rider-team-editor').addEventListener('click', (event) => {
  const sortButton = (event.target as Element).closest<HTMLButtonElement>('button[data-rider-team-editor-sort]');
  if (sortButton) {
    const sortKey = sortButton.dataset['riderTeamEditorSort'] as RiderTeamEditorSortKey;
    if (state.riderTeamEditorSort.key === sortKey) {
      state.riderTeamEditorSort.direction = state.riderTeamEditorSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      state.riderTeamEditorSort = {
        key: sortKey,
        direction: getDefaultRiderTeamEditorSortDirection(sortKey),
      };
    }
    renderRiderTeamEditor();
    return;
  }

  const filterButton = (event.target as Element).closest<HTMLButtonElement>('button[data-rider-team-editor-team-filter]');
  if (filterButton) {
    state.riderTeamEditorSelectedTeamKey = filterButton.dataset['riderTeamEditorTeamFilter'] ?? '';
    renderRiderTeamEditor();
    return;
  }

  const actionButton = (event.target as Element).closest<HTMLButtonElement>('button[data-rider-team-editor-action]');
  if (actionButton) {
    const action = actionButton.dataset['riderTeamEditorAction'];
    if (action === 'reload') {
      void loadRiderTeamEditorData(true);
      return;
    }
    if (action === 'export') {
      void exportRiderTeamEditorData();
      return;
    }
    if (action === 'save') {
      void saveRiderTeamEditorData();
    }
  }
});

$('view-rider-team-editor').addEventListener('change', (event) => {
  const filterSelect = (event.target as Element).closest<HTMLSelectElement>('#rider-team-editor-team-select');
  if (filterSelect) {
    state.riderTeamEditorSelectedTeamKey = filterSelect.value;
    renderRiderTeamEditor();
    return;
  }

  const fieldInput = (event.target as Element).closest<HTMLInputElement | HTMLSelectElement>('[data-rider-team-editor-field][data-rider-team-editor-rider-id]');
  if (!fieldInput) {
    return;
  }

  const riderId = Number(fieldInput.dataset['riderTeamEditorRiderId']);
  const field = fieldInput.dataset['riderTeamEditorField'] as keyof RiderTeamEditorRiderRow;
  if (!Number.isFinite(riderId) || !field) {
    return;
  }

  updateRiderTeamEditorField(riderId, field, fieldInput.value);
});

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

$('btn-back-menu').addEventListener('click', () => {
  raceSimView?.pause();
  showScreen('menu');
  loadSavesList();
});

$('pending-stages-list').addEventListener('click', (event) => {
  const editButton = (event.target as Element).closest<HTMLButtonElement>('button[data-edit-stage-roster]');
  if (editButton) {
    const stageId = Number(editButton.dataset['editStageRoster']);
    if (!Number.isFinite(stageId)) return;
    void openRosterEditor(stageId);
    return;
  }

  const liveButton = (event.target as Element).closest<HTMLButtonElement>('button[data-live-stage]');
  if (liveButton) {
    const stageId = Number(liveButton.dataset['liveStage']);
    if (!Number.isFinite(stageId)) return;
    void openRealtimeStage(stageId, true);
    return;
  }

  const instantButton = (event.target as Element).closest<HTMLButtonElement>('button[data-instant-stage]');
  if (instantButton) {
    const stageId = Number(instantButton.dataset['instantStage']);
    if (!Number.isFinite(stageId)) return;
    void openInstantStage(stageId);
  }
});

$<HTMLSelectElement>('race-sim-stage-select').addEventListener('change', (event) => {
  const stageId = Number((event.target as HTMLSelectElement).value);
  state.selectedRealtimeStageId = Number.isFinite(stageId) ? stageId : null;
  if (state.realtimeBootstrap && state.realtimeBootstrap.stage.id !== state.selectedRealtimeStageId) {
    state.realtimeBootstrap = null;
  }
  state.realtimeError = null;
  if (state.selectedRealtimeStageId == null) {
    renderRealtimeRaceView();
    return;
  }
  void openRealtimeStage(state.selectedRealtimeStageId, false);
});

$<HTMLSelectElement>('results-race-select').addEventListener('change', (event) => {
  const raceId = Number((event.target as HTMLSelectElement).value);
  state.selectedResultsRaceId = Number.isFinite(raceId) ? raceId : null;
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

$('dashboard-races-tbody').addEventListener('click', (event) => {
  const participantsButton = (event.target as Element).closest<HTMLButtonElement>('button[data-dashboard-race-participants-id]');
  if (participantsButton) {
    const raceId = Number(participantsButton.dataset['dashboardRaceParticipantsId']);
    if (Number.isFinite(raceId)) {
      void openRaceProgramParticipants(raceId);
    }
    return;
  }

  const raceButton = (event.target as Element).closest<HTMLButtonElement>('button[data-dashboard-race-id]');
  if (!raceButton) {
    return;
  }

  const raceId = Number(raceButton.dataset['dashboardRaceId']);
  if (!Number.isFinite(raceId)) {
    return;
  }

  void openDashboardRaceStages(raceId);
});

$('race-stages-body').addEventListener('click', (event) => {
  const profileButton = (event.target as Element).closest<HTMLButtonElement>('button[data-dashboard-stage-profile-id]');
  if (!profileButton) {
    return;
  }

  const stageId = Number(profileButton.dataset['dashboardStageProfileId']);
  if (!Number.isFinite(stageId)) {
    return;
  }

  void openDashboardStageProfile(stageId);
});

$('race-participants-body').addEventListener('click', (event) => {
  const programButton = (event.target as Element).closest<HTMLButtonElement>('button[data-rider-program-id]');
  if (programButton) {
    const riderId = Number(programButton.dataset['riderProgramId']);
    if (Number.isFinite(riderId)) {
      void openRiderProgram(riderId);
    }
    return;
  }

  const sortButton = (event.target as Element).closest<HTMLButtonElement>('button[data-race-participants-sort]');
  if (!sortButton) {
    return;
  }

  const sortKey = sortButton.dataset['raceParticipantsSort'] as RaceParticipantsSortKey;
  if (state.raceParticipantsSort.key === sortKey) {
    state.raceParticipantsSort.direction = state.raceParticipantsSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    state.raceParticipantsSort = {
      key: sortKey,
      direction: getDefaultRaceParticipantsSortDirection(sortKey),
    };
  }
  void refreshRaceProgramParticipants();
});

$<HTMLSelectElement>('results-stage-select').addEventListener('change', (event) => {
  const stageId = Number((event.target as HTMLSelectElement).value);
  state.selectedResultsStageId = Number.isFinite(stageId) ? stageId : null;
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
  if (!button) return;
  const resultTypeId = Number(button.dataset['resultTypeId']);
  if (!Number.isFinite(resultTypeId)) return;
  state.selectedResultTypeId = resultTypeId;
  state.selectedResultsMarkerKey = resultTypeId === 1 ? RESULTS_STAGE_OVERVIEW_KEY : null;
  state.selectedResultsSpecialView = null;
  renderResultsView();
});

$('results-type-tabs').addEventListener('click', (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button[data-results-special-view]');
  if (!button) return;
  const specialView = button.dataset['resultsSpecialView'];
  if (specialView !== RESULTS_NON_FINISHERS_KEY) return;
  state.selectedResultsSpecialView = 'nonFinishers';
  state.selectedResultsMarkerKey = null;
  renderResultsView();
});

$('results-marker-tabs').addEventListener('click', (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button[data-marker-key]');
  if (!button) return;
  state.selectedResultsMarkerKey = button.dataset['markerKey'] ?? null;
  renderResultsView();
});

$('season-standings-scope-tabs').addEventListener('click', (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button[data-season-scope]');
  if (!button) return;
  const scope = button.dataset['seasonScope'];
  if (scope !== 'riders' && scope !== 'teams' && scope !== 'countries') return;
  state.selectedSeasonStandingScope = scope;
  renderSeasonStandingsView();
});

$('btn-stage-editor-import').addEventListener('click', () => {
  void onStageEditorImport();
});

$('btn-stage-editor-load-existing').addEventListener('click', () => {
  void onStageEditorLoadExisting();
});

$('btn-stage-editor-export').addEventListener('click', () => {
  void onStageEditorExport();
});

$('stage-editor-file').addEventListener('change', (event) => {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null;
  $('stage-editor-file-hint').textContent = file
    ? `${file.name} Ã‚Â· ${(file.size / 1024).toFixed(1).replace('.', ',')} KB`
    : 'Noch keine Datei ausgewÃƒÂ¤hlt.';
});

$('stage-editor-waypoints').addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement;
  const row = target.closest<HTMLTableRowElement>('tr[data-segment-index]');
  const field = target.dataset['field'] as ('startElevation' | keyof StageEditorSegment | 'segmentLengthKm' | 'segmentGradientPercent' | 'markerType' | 'markerName' | 'markerCat') | undefined;
  if (!row || !field) return;
  const index = Number(row.dataset['segmentIndex']);
  if (!Number.isInteger(index)) return;

  if (field === 'markerType' || field === 'markerName' || field === 'markerCat') {
    const markerIndex = Number(target.dataset['markerIndex']);
    const markerScope = target.dataset['markerScope'];
    if (!Number.isInteger(markerIndex)) return;
    if (markerScope !== 'start' && markerScope !== 'end') return;
    updateStageEditorMarker(index, markerIndex, markerScope, field, target.value);
    return;
  }

  updateStageEditorWaypoint(index, field, target.value);
});

$('stage-editor-waypoints').addEventListener('click', (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button[data-segment-action]');
  if (!button) return;
  const index = Number(button.dataset['segmentIndex']);
  if (!Number.isInteger(index)) return;
  if (button.dataset['segmentAction'] === 'insert') {
    insertStageEditorWaypoint(index);
    return;
  }
  if (button.dataset['segmentAction'] === 'append') {
    appendStageEditorWaypoint();
    return;
  }
  if (button.dataset['segmentAction'] === 'add-marker') {
    const markerScope = button.dataset['markerScope'];
    if (markerScope !== 'start' && markerScope !== 'end') return;
    addStageEditorMarker(index, markerScope);
    return;
  }
  if (button.dataset['segmentAction'] === 'remove-marker') {
    const markerIndex = Number(button.dataset['markerIndex']);
    const markerScope = button.dataset['markerScope'];
    if (!Number.isInteger(markerIndex)) return;
    if (markerScope !== 'start' && markerScope !== 'end') return;
    removeStageEditorMarker(index, markerIndex, markerScope);
    return;
  }
  if (button.dataset['segmentAction'] === 'delete') {
    deleteStageEditorWaypoint(index);
  }
});

['stage-editor-stage-id', 'stage-editor-race-id', 'stage-editor-stage-number', 'stage-editor-date', 'stage-editor-details-file', 'stage-editor-profile'].forEach((id) => {
  $(id).addEventListener('change', () => renderStageEditor());
});

$('btn-advance-day').addEventListener('click', async () => {
  showLoading('Tag wird fortgeschrieben...');
  try {
    const res = await api.advanceDay();
    if (!res.success) {
      alert('Tageswechsel fehlgeschlagen:\n' + (res.error ?? 'Unbekannter Fehler'));
      return;
    }
    if (state.currentSave && res.data) state.currentSave.currentSeason = res.data.season;
    await loadGameState();
    await loadRaces();
    if (isActiveView('teams')) {
      await refreshTeamsViewData();
    }
  } catch (e) {
    alert('Unerwarteter Fehler beim Tageswechsel: ' + (e as Error).message);
  } finally {
    hideLoading();
  }
});

async function loadGameState(): Promise<void> {
  const [gameStateRes, gameStatusRes] = await Promise.all([api.getGameState(), api.getGameStatus()]);
  if (!gameStateRes.success) { console.error(gameStateRes.error); return; }
  state.gameState = gameStateRes.data ?? null;
  state.gameStatus = gameStatusRes.success ? gameStatusRes.data ?? null : null;
  renderGameState();
  if (isActiveView('dashboard')) {
    renderDashboard();
  }
  if (isActiveView('results')) {
    renderResultsView();
  }
  if (isActiveView('live-race')) {
    renderRealtimeRaceView();
  }
  if (isActiveView('season-standings')) {
    renderSeasonStandingsView();
  }
  if (state.selectedRaceParticipantsRaceId != null && !$('modal-raceParticipants').classList.contains('hidden')) {
    void refreshRaceProgramParticipants();
  }
  if (state.currentSave && gameStateRes.data) state.currentSave.currentSeason = gameStateRes.data.season;
}

function renderGameState(): void {
  if (!state.gameState) return;
  $('meta-date').textContent = state.gameState.formattedDate;
  $('meta-season').textContent = `Saison ${state.gameState.season}`;
  const hint = $('meta-race-hint');
  const advanceButton = $<HTMLButtonElement>('btn-advance-day');
  const pendingStagesContainer = $('pending-stages-list');
  const pendingStages = state.gameStatus?.pendingStages ?? [];
  if (pendingStages.length > 0) {
    hint.textContent = `${pendingStages.length} offene Etappe${pendingStages.length === 1 ? '' : 'n'} heute. Tageswechsel ist gesperrt.`;
    hint.classList.remove('hidden');
    pendingStagesContainer.innerHTML = pendingStages.map((pendingStage) => {
      const subtitle = pendingStage.isStageRace
        ? `Etappe ${pendingStage.stageNumber} Ã‚Â· ${pendingStage.profile} Ã‚Â· ${formatDate(pendingStage.date)}`
        : `${pendingStage.profile} Ã‚Â· ${formatDate(pendingStage.date)}`;
      const rosterButton = canEditPendingStage(pendingStage)
        ? `<button class="btn btn-ghost btn-sm" data-edit-stage-roster="${pendingStage.stageId}">Starterfeld bearbeiten</button>`
        : '';
      return `
        <div class="pending-stage-item">
          <div class="pending-stage-meta">
            <div class="pending-stage-title">${esc(pendingStage.raceName)}</div>
            <div class="pending-stage-subtitle">${esc(subtitle)}</div>
          </div>
          <div class="pending-stage-actions">
            ${rosterButton}
            <button class="btn btn-secondary btn-sm" data-live-stage="${pendingStage.stageId}">Live-Sim</button>
            <button class="btn btn-secondary btn-sm" data-instant-stage="${pendingStage.stageId}">Instant</button>
          </div>
        </div>`;
    }).join('');
    pendingStagesContainer.classList.remove('hidden');
    advanceButton.disabled = true;
  } else if (state.gameState.hasRaceToday) {
    hint.textContent = 'Heutige Rennen sind abgeschlossen. Tageswechsel ist wieder freigegeben.';
    hint.classList.remove('hidden');
    pendingStagesContainer.innerHTML = '';
    pendingStagesContainer.classList.add('hidden');
    advanceButton.disabled = false;
  } else {
    hint.textContent = '';
    hint.classList.add('hidden');
    pendingStagesContainer.innerHTML = '';
    pendingStagesContainer.classList.add('hidden');
    advanceButton.disabled = false;
  }
}

function renderDashboard(): void {
  const playerTeam = state.teams.find(t => t.isPlayerTeam)
    ?? state.teams.find(t => t.name === state.currentSave?.teamName)
    ?? null;
  $('dashboard-career').textContent   = state.currentSave?.careerName ?? 'Ã¢â‚¬â€œ';
  $('dashboard-team').textContent     = playerTeam?.name ?? state.currentSave?.teamName ?? 'Ã¢â‚¬â€œ';
  $('dashboard-date').textContent     = state.gameState?.formattedDate ?? 'Ã¢â‚¬â€œ';
  $('dashboard-season').textContent   = state.gameState ? `Saison ${state.gameState.season}` : 'Ã¢â‚¬â€œ';
  $('dashboard-races-today').textContent = String(state.gameStatus?.pendingStages.length ?? state.gameState?.racesTodayCount ?? 0);
  renderDashboardRaces();
}

async function completeRealtimeStage(
  stageId: number,
  entries: RealtimeStageCommitEntry[],
  markerClassifications: StageMarkerClassification[],
  incidents: PrecalculatedRaceIncident[],
): Promise<void> {
  if (realtimeCompletionInFlight) {
    return;
  }

  realtimeCompletionInFlight = true;
  showLoading('Live-Ergebnis wird gespeichert...');
  try {
    const res = await api.completeRealtimeSimulation(stageId, { entries, markerClassifications, incidents });
    if (!res.success) {
      alert('Live-Ergebnis konnte nicht gespeichert werden:\n' + (res.error ?? 'Unbekannter Fehler'));
      return;
    }

    const data = res.data as StageResultCommitResponse | undefined;
    state.selectedResultsRaceId = data?.raceId ?? state.selectedResultsRaceId;
    state.selectedResultsStageId = data?.stageId ?? stageId;
    state.selectedResultTypeId = 1;
    state.realtimeBootstrap = null;
    state.realtimeError = null;
    await loadStageResults(stageId, false);
    await loadGameState();
    await loadRaces();
    await loadRoster();
    if (state.seasonStandings != null) {
      await loadSeasonStandings(true);
    }
    renderRealtimeRaceView();
    activateView('results');
  } catch (error) {
    alert('Unerwarteter Fehler beim Speichern des Live-Ergebnisses: ' + (error as Error).message);
  } finally {
    realtimeCompletionInFlight = false;
    hideLoading();
  }
}

async function loadStageResults(stageId: number, silentIfMissing: boolean): Promise<void> {
  const location = findStageById(stageId);
  if (location) {
    state.selectedResultsRaceId = location.race.id;
    state.selectedResultsStageId = stageId;
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
  renderResultsView();
}

function renderResultsView(): void {
  const raceSelect = $<HTMLSelectElement>('results-race-select');
  const stageSelect = $<HTMLSelectElement>('results-stage-select');
  const tabs = $('results-type-tabs');
  const markerTabs = $('results-marker-tabs');
  const meta = $('results-stage-meta');
  const empty = $('results-empty');
  const table = $('results-table');
  const headerRow = table.querySelector('thead tr');
  const tbody = $('results-tbody');
  const markerClassifications = $('results-marker-classifications');

  if (state.stageResults) {
    state.selectedResultsRaceId = state.stageResults.raceId;
    state.selectedResultsStageId = state.stageResults.stageId;
  }

  raceSelect.innerHTML = '<option value="">Ã¢â‚¬â€œ Rennen auswÃƒÂ¤hlen Ã¢â‚¬â€œ</option>' + state.races
    .filter((race) => (race.stages?.length ?? 0) > 0)
    .map((race) => `<option value="${race.id}"${race.id === state.selectedResultsRaceId ? ' selected' : ''}>${esc(race.name)}</option>`)
    .join('');

  const selectedRace = findRaceById(state.selectedResultsRaceId);
  const stageOptions = selectedRace == null
    ? ''
    : (selectedRace.stages ?? [])
      .map((stage) => `<option value="${stage.id}"${stage.id === state.selectedResultsStageId ? ' selected' : ''}>${esc(formatResultsStageLabel(selectedRace, stage))}</option>`)
      .join('');
  stageSelect.innerHTML = '<option value="">Ã¢â‚¬â€œ Etappe auswÃƒÂ¤hlen Ã¢â‚¬â€œ</option>' + stageOptions;

  const selectedClassification = state.stageResults?.classifications.find(
    (classification) => classification.resultTypeId === state.selectedResultTypeId,
  ) ?? state.stageResults?.classifications[0] ?? null;
  const showNonFinishers = state.selectedResultsSpecialView === 'nonFinishers';
  if (selectedClassification && !showNonFinishers) {
    state.selectedResultTypeId = selectedClassification.resultTypeId;
  }

  if (!state.stageResults || (!selectedClassification && !showNonFinishers)) {
    const selectedStage = findStageById(state.selectedResultsStageId);
    meta.textContent = selectedStage
      ? `${selectedStage.race.name} Ã‚Â· ${selectedStage.stage.profile} Ã‚Â· ${formatDate(selectedStage.stage.date)}`
      : 'Noch keine Etappe ausgewÃƒÂ¤hlt.';
    tabs.innerHTML = '';
    markerTabs.innerHTML = '';
    markerTabs.classList.add('hidden');
    tbody.innerHTML = '';
    markerClassifications.innerHTML = '';
    markerClassifications.classList.add('hidden');
    table.classList.add('hidden');
    empty.classList.remove('hidden');
    empty.textContent = state.selectedResultsStageId != null
      ? 'FÃƒÂ¼r diese Etappe liegen noch keine Ergebnisse vor.'
      : 'Noch keine Ergebnisse geladen.';
    return;
  }

  meta.textContent = `${state.stageResults.raceName} Ã‚Â· Etappe ${state.stageResults.stageNumber} Ã‚Â· ${state.stageResults.profile} Ã‚Â· ${formatDate(state.stageResults.date)}`;
  const resultStage = findStageById(state.stageResults.stageId);
  const stageDistanceKm = resultStage?.stage.distanceKm ?? null;
  const isGcClassification = selectedClassification?.resultTypeId === GC_RESULT_TYPE_ID;
  const isPointsLikeClassification = selectedClassification?.resultTypeId === POINTS_RESULT_TYPE_ID
    || selectedClassification?.resultTypeId === MOUNTAIN_RESULT_TYPE_ID;
  const previousGcRanks = new Map((state.stageResults.previousGcStandings ?? []).map((standing) => [standing.riderId, standing.rank] as const));
  const resultTypeButtons = state.stageResults.classifications.map((classification) => `
    <button
      type="button"
      class="results-type-btn${!showNonFinishers && classification.resultTypeId === state.selectedResultTypeId ? ' active' : ''}"
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
  const teamButtonIndex = state.stageResults.classifications.findIndex((classification) => classification.resultTypeName.toLocaleLowerCase('de').includes('team'));
  if (teamButtonIndex >= 0) {
    resultTypeButtons.splice(teamButtonIndex + 1, 0, nonFinishersButton);
  } else {
    resultTypeButtons.push(nonFinishersButton);
  }
  tabs.innerHTML = resultTypeButtons.join('');

  const stageMarkerClassifications = sortStageMarkerClassifications(state.stageResults.markerClassifications ?? []);
  const showMarkerTabs = !showNonFinishers && selectedClassification?.resultTypeId === 1 && stageMarkerClassifications.length > 0;
  const selectedStageSubViewKey = showMarkerTabs
    ? (state.selectedResultsMarkerKey ?? RESULTS_STAGE_OVERVIEW_KEY)
    : null;
  const selectedMarkerClassification = showMarkerTabs && selectedStageSubViewKey !== RESULTS_STAGE_OVERVIEW_KEY
    ? stageMarkerClassifications.find((classification) => classification.markerKey === selectedStageSubViewKey) ?? null
    : null;
  if (showMarkerTabs) {
    state.selectedResultsMarkerKey = selectedMarkerClassification?.markerKey ?? RESULTS_STAGE_OVERVIEW_KEY;
  }
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
  markerTabs.classList.toggle('hidden', !showMarkerTabs);

  const showStageOverviewTable = showNonFinishers || !showMarkerTabs || state.selectedResultsMarkerKey === RESULTS_STAGE_OVERVIEW_KEY;

  if (headerRow && showStageOverviewTable) {
    headerRow.innerHTML = showNonFinishers
      ? `
        <th>Etappe</th>
        <th>Status</th>
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Grund</th>
      `
      : isGcClassification
      ? `
        <th>Platz</th>
        <th>GC</th>
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer / Team</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Zeit</th>
        <th>RÃƒÂ¼ckstand</th>
        <th>Punktewertung</th>
        <th>UCI Punkte</th>
      `
      : isPointsLikeClassification
        ? `
          <th>Platz</th>
          <th class="results-jersey-col">Trikot</th>
          <th>Fahrer / Team</th>
          <th class="results-flag-col">Flagge</th>
          <th>Team</th>
          <th>Punkte</th>
          <th>UCI Punkte</th>
        `
      : `
        <th>Platz</th>
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer / Team</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Zeit</th>
        <th>RÃƒÂ¼ckstand</th>
        <th>Punktewertung</th>
        <th>UCI Punkte</th>
      `;
  }

  tbody.innerHTML = showNonFinishers
    ? (state.stageResults.nonFinishers ?? []).map((row) => `
      <tr>
        <td>${row.stageNumber}</td>
        <td>${renderNonFinisherStatusBadge(row.isOtl)}</td>
        <td class="results-jersey-col-cell">${renderResultsJerseyColumn(row.teamId, row.teamName)}</td>
        <td>${renderResultsParticipant(row.riderName, true, false, row.riderId, row.teamId)}</td>
        <td class="results-flag-col-cell">${renderResultsFlagColumn(row.countryCode)}</td>
        <td>${esc(row.teamName || 'Ã¢â‚¬â€')}</td>
        <td>${esc(formatNonFinisherReason(row.statusReason, row.isOtl))}</td>
      </tr>
    `).join('') || '<tr><td colspan="7" class="results-empty-cell">Keine OTL/DNF bis zu dieser Etappe.</td></tr>'
    : showStageOverviewTable && selectedClassification
    ? selectedClassification.rows.map((row) => {
      const participant = row.riderName ?? row.teamName;
      const teamName = row.riderName ? row.teamName : 'Ã¢â‚¬â€';
      const jerseyCell = renderResultsJerseyColumn(row.teamId, row.teamName);
      const participantCell = renderResultsParticipant(participant, true, row.isBreakaway === true, row.riderId, row.teamId);
      const flagCell = renderResultsFlagColumn(resolveRiderCountryCode(row.riderId));
      const showAverageSpeed = selectedClassification.resultTypeId === 1 && row.rank === 1 && row.timeSeconds != null && stageDistanceKm != null;
      const timeCell = row.timeSeconds != null
        ? `${formatRaceTime(row.timeSeconds)}${showAverageSpeed ? ` (${formatAverageSpeed(stageDistanceKm, row.timeSeconds)})` : ''}`
        : 'Ã¢â‚¬â€œ';
      const gcDelta = resolveGcRankDelta(row, previousGcRanks);
      const gcDeltaCell = isGcClassification
        ? `<td class="results-gc-delta-cell">${renderGcRankDelta(gcDelta.previousRank, gcDelta.delta)}</td>`
        : '';
      if (isPointsLikeClassification) {
        return `
          <tr>
            <td class="pos-${Math.min(row.rank, 3)}">${row.rank}</td>
            <td class="results-jersey-col-cell">${jerseyCell}</td>
            <td>${participantCell}</td>
            <td class="results-flag-col-cell">${flagCell}</td>
            <td>${esc(teamName)}</td>
            <td>${row.points != null ? row.points : 'Ã¢â‚¬â€œ'}</td>
            <td>${row.uciPoints != null ? row.uciPoints : 'Ã¢â‚¬â€œ'}</td>
          </tr>`;
      }

      return `
        <tr>
          <td class="pos-${Math.min(row.rank, 3)}">${row.rank}</td>
          ${gcDeltaCell}
          <td class="results-jersey-col-cell">${jerseyCell}</td>
          <td>${participantCell}</td>
          <td class="results-flag-col-cell">${flagCell}</td>
          <td>${esc(teamName)}</td>
          <td>${esc(timeCell)}</td>
          <td>${esc(formatRaceGap(row.gapSeconds))}</td>
          <td>${row.points != null ? row.points : 'Ã¢â‚¬â€œ'}</td>
          <td>${row.uciPoints != null ? row.uciPoints : 'Ã¢â‚¬â€œ'}</td>
        </tr>`;
    }).join('')
    : '';

  markerClassifications.innerHTML = !showNonFinishers && showMarkerTabs && selectedMarkerClassification
    ? renderSingleMarkerClassificationHtml(selectedMarkerClassification)
    : '';
  markerClassifications.classList.toggle('hidden', showNonFinishers || !showMarkerTabs || selectedMarkerClassification == null);

  empty.classList.add('hidden');
  table.classList.toggle('hidden', !showStageOverviewTable);
}

async function loadSeasonStandings(silent: boolean): Promise<void> {
  const res = await api.getSeasonStandings();
  if (!res.success) {
    state.seasonStandings = null;
    if (isActiveView('season-standings')) {
      renderSeasonStandingsView();
    }
    if (!silent && res.error) {
      alert('Saisonwertung konnte nicht geladen werden:\n' + res.error);
    }
    return;
  }

  state.seasonStandings = res.data ?? null;
  if (isActiveView('season-standings')) {
    renderSeasonStandingsView();
  }
}

function renderSeasonStandingsView(): void {
  const meta = $('season-standings-meta');
  const tabs = $('season-standings-scope-tabs');
  const empty = $('season-standings-empty');
  const table = $('season-standings-table');
  const tbody = $('season-standings-tbody');
  const jerseyHeader = $('season-standings-jersey-header');
  const primaryHeader = $('season-standings-primary-header');
  const flagHeader = $('season-standings-flag-header');
  const secondaryHeader = $('season-standings-secondary-header');

  const season = state.seasonStandings?.season ?? state.gameState?.season ?? state.currentSave?.currentSeason ?? null;
  meta.textContent = season != null
    ? `Saison ${season} Ã‚Â· Ergebnis- und Trikotpunkte kumuliert`
    : 'Noch keine Saisonwertung geladen.';

  tabs.innerHTML = `
    <button
      type="button"
      class="results-type-btn${state.selectedSeasonStandingScope === 'riders' ? ' active' : ''}"
      data-season-scope="riders"
    >Fahrer</button>
    <button
      type="button"
      class="results-type-btn${state.selectedSeasonStandingScope === 'teams' ? ' active' : ''}"
      data-season-scope="teams"
    >Teams</button>
    <button
      type="button"
      class="results-type-btn${state.selectedSeasonStandingScope === 'countries' ? ' active' : ''}"
      data-season-scope="countries"
    >Country</button>
  `;

  const isCountryScope = state.selectedSeasonStandingScope === 'countries';
  const rows = isCountryScope
    ? (state.seasonStandings?.countryStandings ?? [])
    : state.selectedSeasonStandingScope === 'teams'
      ? (state.seasonStandings?.teamStandings ?? [])
      : (state.seasonStandings?.riderStandings ?? []);
  const countryRows = isCountryScope ? (rows as SeasonStandingCountryRow[]) : [];
  const standardRows = isCountryScope ? [] : (rows as SeasonStandingsPayload['riderStandings']);

  jerseyHeader.textContent = 'Trikot';
  primaryHeader.textContent = isCountryScope ? 'Land' : state.selectedSeasonStandingScope === 'teams' ? 'Team' : 'Fahrer';
  flagHeader.textContent = 'Flagge';
  secondaryHeader.textContent = state.selectedSeasonStandingScope === 'teams' ? 'Land' : 'Team';
  jerseyHeader.classList.toggle('hidden', isCountryScope);
  secondaryHeader.classList.toggle('hidden', isCountryScope);

  if (!state.seasonStandings || rows.length === 0) {
    tbody.innerHTML = '';
    table.classList.add('hidden');
    empty.classList.remove('hidden');
    empty.textContent = 'Noch keine Saisonpunkte vorhanden.';
    return;
  }

  tbody.innerHTML = isCountryScope
    ? countryRows.map((row) => `
      <tr>
        <td class="pos-${Math.min(row.rank, 3)}">${row.rank}</td>
        <td class="results-jersey-col-cell hidden"></td>
        <td class="season-standings-country-cell">${renderSeasonCountryNameCell(row)}</td>
        <td class="results-flag-col-cell">${renderResultsFlagColumn(row.countryCode)}</td>
        <td class="hidden"></td>
        <td>${row.points}</td>
        <td>${esc(formatPointsGap(row.gapPoints))}</td>
      </tr>`).join('')
    : standardRows.map((row) => {
      const primary = row.riderName ?? row.teamName;
      const jerseyCell = renderResultsJerseyColumn(row.teamId, row.teamName);
      const primaryCell = state.selectedSeasonStandingScope === 'teams'
        ? renderSeasonTeamNameCell(row, state.seasonStandings?.riderStandings ?? [])
        : renderResultsParticipant(primary, true, false, row.riderId, row.teamId);
      const flagCell = renderResultsFlagColumn(row.countryCode);
      const secondary = state.selectedSeasonStandingScope === 'teams'
        ? (row.countryName ?? row.countryCode ?? 'Ã¢â‚¬â€')
        : row.teamName;
      return `
        <tr>
          <td class="pos-${Math.min(row.rank, 3)}">${row.rank}</td>
          <td class="results-jersey-col-cell">${jerseyCell}</td>
          <td>${primaryCell}</td>
          <td class="results-flag-col-cell">${flagCell}</td>
          <td>${esc(secondary)}</td>
          <td>${row.points}</td>
          <td>${esc(formatPointsGap(row.gapPoints))}</td>
        </tr>`;
    }).join('');

  empty.classList.add('hidden');
  table.classList.remove('hidden');
}

// ============================================================
//  Rennen
// ============================================================

async function loadRaces(): Promise<void> {
  const res = await api.getRaces();
  if (!res.success) { console.error(res.error); return; }
  state.races = res.data ?? [];
  if (isActiveView('dashboard')) {
    renderDashboard();
  }
  if (isActiveView('results')) {
    renderResultsView();
  }
}

function renderDashboardRaces(): void {
  const tbody = $('dashboard-races-tbody');
  const visibleRaces = state.races
    .filter(race => !state.gameState || race.endDate >= state.gameState.currentDate)
    .slice(0, 8);

  if (visibleRaces.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-muted">Keine kommenden Rennen.</td></tr>';
    return;
  }

  tbody.innerHTML = visibleRaces.map(race => {
    const isLive = state.gameState != null
      && race.startDate <= state.gameState.currentDate
      && race.endDate >= state.gameState.currentDate;
    const isDone = state.gameState != null && race.endDate < state.gameState.currentDate;
    const statusBadge = isDone
      ? `<span class="badge badge-done">Abgeschlossen</span>`
      : isLive
        ? `<span class="badge badge-live">Läuft</span>`
        : `<span class="badge badge-todo">Geplant</span>`;
    const location = race.country?.name ?? `Land ${race.countryId}`;
    const locationFlag = race.country?.code3 ? renderFlag(race.country.code3) : '';
    const categoryName = race.category?.name ?? `Kategorie ${race.categoryId}`;
    const totalDistanceKm = race.isStageRace
      ? (race.stages ?? []).reduce((sum, stage) => sum + (stage.distanceKm ?? 0), 0)
      : (race.upcomingStage?.distanceKm ?? null);
    const totalElevationGain = race.isStageRace
      ? (race.stages ?? []).reduce((sum, stage) => sum + (stage.elevationGainMeters ?? 0), 0)
      : (race.upcomingStage?.elevationGainMeters ?? null);
    const distance = totalDistanceKm != null ? String(totalDistanceKm.toFixed(1)).replace('.', ',') : '-';
    const elevation = totalElevationGain != null ? String(Math.round(totalElevationGain)) : '-';
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
        <td>${esc(categoryName)}</td>
        <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${race.id}">Teilnehmer</button></td>
        <td>${distance}</td>
        <td>${elevation}</td>
        <td>${statusBadge}</td>
      </tr>`;
  }).join('');
}

function getStageDisplayName(stage: Stage): string {
  return `Etappe ${stage.stageNumber}`;
}

function summarizeStageProfiles(stages: Stage[]): string {
  if (stages.length === 0) {
    return 'Keine Etappen';
  }

  const counts = new Map<string, number>();
  stages.forEach((stage) => {
    counts.set(stage.profile, (counts.get(stage.profile) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }
      return left[0].localeCompare(right[0]);
    })
    .map(([profile, count]) => `${count}Ãƒâ€” ${profile}`)
    .join(' Ã‚Â· ');
}

function getStageProfileClassName(profile: StageProfile): string {
  return `stage-profile-badge-${profile.toLowerCase().replace(/_/g, '-')}`;
}

function renderStageProfileBadge(profile: StageProfile): string {
  return `<span class="stage-profile-badge ${getStageProfileClassName(profile)}">${esc(profile)}</span>`;
}

function buildDashboardStageProfileLabel(race: Race, stage: Stage): string {
  return `${race.name} Ã‚Â· ${getStageDisplayName(stage)} Ã‚Â· ${stage.profile}`;
}

async function ensureStageSummaryLoaded(stageId: number): Promise<ParsedStageSummary | null> {
  const cachedSummary = state.stageSummariesByStageId[stageId];
  if (cachedSummary) {
    return cachedSummary;
  }

  const res = await api.getStageSummary(stageId);
  if (res.success && res.data) {
    state.stageSummariesByStageId[stageId] = res.data;
    delete state.stageSummaryErrorsByStageId[stageId];
    return res.data;
  }

  const realtimeFallback = await api.getRealtimeSimulation(stageId);
  if (realtimeFallback.success && realtimeFallback.data?.stageSummary) {
    state.stageSummariesByStageId[stageId] = realtimeFallback.data.stageSummary;
    delete state.stageSummaryErrorsByStageId[stageId];
    return realtimeFallback.data.stageSummary;
  }

  state.stageSummaryErrorsByStageId[stageId] = res.error ?? realtimeFallback.error ?? 'Etappenprofil konnte nicht geladen werden.';
  console.error('Stage-Summary-Laden fehlgeschlagen:', {
    stageId,
    stageSummaryError: res.error,
    realtimeFallbackError: realtimeFallback.error,
  });
  delete state.stageSummariesByStageId[stageId];
  if (!res.success || !res.data) {
    return null;
  }

  return res.data;
}

function renderDashboardRaceStagesModal(): void {
  const title = $('race-stages-title');
  const meta = $('race-stages-meta');
  const body = $('race-stages-body');
  const race = findRaceById(state.selectedDashboardRaceId);

  if (!race) {
    title.textContent = 'Etappen';
    meta.textContent = '';
    body.innerHTML = '<div class="results-empty">Rennen nicht gefunden.</div>';
    return;
  }

  const stages = race.stages ?? [];
  const totalDistanceKm = stages.reduce((sum, stage) => sum + (stage.distanceKm ?? 0), 0);
  const totalElevationGain = stages.reduce((sum, stage) => sum + (stage.elevationGainMeters ?? 0), 0);
  const stageTypeSummary = summarizeStageProfiles(stages);
  title.textContent = race.name;
  meta.textContent = `${formatRaceDateRange(race)} Ã‚Â· ${race.country?.name ?? `Land ${race.countryId}`} Ã‚Â· ${race.isStageRace ? `${race.numberOfStages} Etappen` : 'Eintagesrennen'} Ã‚Â· ${formatKm(totalDistanceKm)} Ã‚Â· ${formatElevationGain(totalElevationGain)} Ã‚Â· ${stageTypeSummary}`;

  if (stages.length === 0) {
    body.innerHTML = '<div class="results-empty">FÃƒÂ¼r dieses Rennen sind keine Etappen vorhanden.</div>';
    return;
  }

  body.innerHTML = `
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Name</th>
            <th>Profil</th>
            <th>Distanz</th>
            <th>HÃƒÂ¶henmeter</th>
            <th>Profil</th>
          </tr>
        </thead>
        <tbody>
          ${stages.map((stage) => {
            return `
              <tr class="dashboard-race-stage-row">
                <td>${formatDate(stage.date)}</td>
                <td><strong>${esc(getStageDisplayName(stage))}</strong></td>
                <td>${renderStageProfileBadge(stage.profile)}</td>
                <td>${stage.distanceKm != null ? formatKm(stage.distanceKm) : 'Ã¢â‚¬â€œ'}</td>
                <td>${stage.elevationGainMeters != null ? formatElevationGain(stage.elevationGainMeters) : 'Ã¢â‚¬â€œ'}</td>
                <td>
                  <button
                    type="button"
                    class="dashboard-stage-profile-link"
                    data-dashboard-stage-profile-id="${stage.id}"
                    aria-label="Profil von ${esc(buildDashboardStageProfileLabel(race, stage))} ÃƒÂ¶ffnen"
                  >
                    Profil anzeigen
                  </button>
                </td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

async function openDashboardRaceStages(raceId: number): Promise<void> {
  const race = findRaceById(raceId);
  if (!race) {
    return;
  }

  state.selectedDashboardRaceId = raceId;
  renderDashboardRaceStagesModal();
  showModal('raceStages');
}

function renderProgramRaceRows(payload: RiderProgramRaceSummary): string {
  if (payload.races.length === 0) {
    return '<div class="results-empty">Keine Rennen in diesem Programm.</div>';
  }

  return `
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table">
        <thead><tr><th>Datum</th><th>Land</th><th>Rennen</th><th>Kategorie</th><th>Format</th></tr></thead>
        <tbody>
          ${payload.races.map((race) => `
            <tr>
              <td>${formatRaceDateRange(race)}</td>
              <td><span class="dashboard-race-country">${race.country?.code3 ? renderFlag(race.country.code3) : ''}<span>${esc(race.country?.name ?? `Land ${race.countryId}`)}</span></span></td>
              <td><strong>${esc(race.name)}</strong></td>
              <td>${esc(race.category?.name ?? `Kategorie ${race.categoryId}`)}</td>
              <td>${raceCategoryBadge(race)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

async function openRiderProgram(riderId: number): Promise<void> {
  const rider = state.riders.find((entry) => entry.id === riderId);
  $('rider-program-title').textContent = rider ? formatRiderName(rider) : 'Programm';
  $('rider-program-meta').textContent = 'Lade Programmrennen ...';
  $('rider-program-body').innerHTML = '';
  showModal('riderProgram');

  const res = await api.getRiderProgramRaces(riderId);
  if (!res.success || !res.data) {
    $('rider-program-meta').textContent = '';
    $('rider-program-body').innerHTML = `<div class="results-empty">${esc(res.error ?? 'Programm konnte nicht geladen werden.')}</div>`;
    return;
  }

  $('rider-program-title').textContent = res.data.program.name;
  $('rider-program-meta').textContent = rider ? formatRiderName(rider) : '';
  $('rider-program-body').innerHTML = renderProgramRaceRows(res.data);
}

function renderRaceParticipantRows(participants: RaceProgramParticipant[]): string {
  if (participants.length === 0) {
    return '<div class="results-empty">Keine Programmfahrer fÃƒÂ¼r dieses Rennen.</div>';
  }

  const sortedParticipants = sortRaceParticipants(participants);

  return `
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table race-participants-table">
        <thead><tr>
          ${renderRaceParticipantsHeader('Team', 'team', 'Team')}
          ${renderRaceParticipantsHeader('Fahrer', 'rider', 'Fahrer')}
          ${renderRaceParticipantsHeader('Spec1', 'spec1', 'Spezialisierung 1')}
          ${renderRaceParticipantsHeader('Rolle', 'role', 'Rolle')}
          ${renderRaceParticipantsHeader('Ges', 'overall', 'GesamtstÃƒÂ¤rke')}
          ${renderRaceParticipantsHeader('Phase', 'phase', 'Formphase')}
          ${renderRaceParticipantsHeader('Programm', 'program', 'Saisonprogramm')}
        </tr></thead>
        <tbody>
          ${sortedParticipants.map((participant) => `
            <tr class="race-participants-row">
              <td class="race-participants-team-cell">${renderMiniJersey(participant.team?.id, participant.team?.name)}</td>
              <td><span class="race-participant-rider-cell">${renderFlag(getRiderCountryCode(participant.rider))}<strong>${esc(formatRiderName(participant.rider))}</strong></span></td>
              <td>${esc(getSpecLabel(participant.rider))}</td>
              <td>${esc(getRiderRoleName(participant.rider))}</td>
              <td>${renderSkillValue(participant.rider.overallRating)}</td>
              <td>${renderSeasonFormPhase(participant.rider)}</td>
              <td><button type="button" class="team-program-button" data-rider-program-id="${participant.rider.id}">${esc(participant.program.name)}</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

async function openRaceProgramParticipants(raceId: number): Promise<void> {
  const race = findRaceById(raceId);
  state.selectedRaceParticipantsRaceId = raceId;
  $('race-participants-title').textContent = race?.name ?? 'Teilnehmer';
  $('race-participants-meta').textContent = 'Lade Programmfahrer ...';
  $('race-participants-body').innerHTML = '';
  state.raceParticipants = [];
  showModal('raceParticipants');

  await refreshRaceProgramParticipants();
}

async function refreshRaceProgramParticipants(showLoadingState = false): Promise<void> {
  const raceId = state.selectedRaceParticipantsRaceId;
  if (raceId == null) {
    return;
  }

  const race = findRaceById(raceId);
  if (showLoadingState) {
    $('race-participants-meta').textContent = 'Lade Programmfahrer ...';
  }

  const res = await api.getRaceProgramParticipants(raceId);
  if (!res.success || !res.data) {
    $('race-participants-meta').textContent = '';
    $('race-participants-body').innerHTML = `<div class="results-empty">${esc(res.error ?? 'Teilnehmer konnten nicht geladen werden.')}</div>`;
    return;
  }

  state.raceParticipants = res.data;
  $('race-participants-title').textContent = race?.name ?? 'Teilnehmer';
  $('race-participants-meta').textContent = `${res.data.length} Programmfahrer Ã‚Â· ${race ? formatRaceDateRange(race) : ''}`;
  $('race-participants-body').innerHTML = renderRaceParticipantRows(state.raceParticipants);
}

async function openDashboardStageProfile(stageId: number, selectedClimb: StageEditorClimbOverviewRow | null = null): Promise<void> {
  const location = findStageById(stageId);
  if (!location) {
    return;
  }

  const summary = await ensureStageSummaryLoaded(stageId);
  if (!summary) {
    alert(state.stageSummaryErrorsByStageId[stageId] ?? 'Etappenprofil konnte nicht geladen werden.');
    return;
  }

  state.selectedDashboardProfileStageId = stageId;
  $('stage-profile-title').textContent = `${location.race.name} Ã‚Â· ${getStageDisplayName(location.stage)}`;
  const climbMeta = selectedClimb != null
    ? ` Ã‚Â· Anstieg ${selectedClimb.climbIndex}: ${selectedClimb.name}${selectedClimb.category != null ? ` Ã‚Â· Kat. ${selectedClimb.category}` : ''} Ã‚Â· ${selectedClimb.startKm.toFixed(1).replace('.', ',')}-${selectedClimb.endKm.toFixed(1).replace('.', ',')} km Ã‚Â· Climb Score ${selectedClimb.climbScore}`
    : '';
  $('stage-profile-meta').textContent = `${formatDate(location.stage.date)} Ã‚Â· ${location.stage.profile} Ã‚Â· ${location.stage.distanceKm != null ? formatKm(location.stage.distanceKm) : 'Ã¢â‚¬â€œ'} Ã‚Â· ${location.stage.elevationGainMeters != null ? formatElevationGain(location.stage.elevationGainMeters) : 'Ã¢â‚¬â€œ'}${climbMeta}`;
  renderStaticStageProfile(
    $('stage-profile-view'),
    summary,
    location.stage.profile,
    buildDashboardStageProfileLabel(location.race, location.stage),
    selectedClimb != null
      ? { selectedClimbRange: { startKm: selectedClimb.startKm, endKm: selectedClimb.endKm } }
      : undefined,
  );
  showModal('stageProfile');
}

// ============================================================
//  Roster & Teams
// ============================================================

async function loadRoster(options: { render?: boolean } = {}): Promise<void> {
  const res = await api.getRiders();
  if (!res.success) { console.error(res.error); return; }
  state.riders = res.data ?? [];
  if (options.render !== false) {
    if (isActiveView('teams')) {
      renderTeams();
    }
    if (isActiveView('riders')) {
      renderRidersMenu();
    }
  }
  if (isActiveView('dashboard')) {
    renderDashboard();
  }
  if (isActiveView('season-standings')) {
    renderSeasonStandingsView();
  }
}

async function refreshTeamsViewData(): Promise<void> {
  await loadTeams({ render: false });
  await loadRoster({ render: false });

  if (isActiveView('teams')) {
    renderTeams();
  }
  if (isActiveView('riders')) {
    renderRidersMenu();
  }
}

function rebuildRiderTeamEditorTeams(payload: RiderTeamEditorPayload): RiderTeamEditorTeamSummary[] {
  const realTeams = payload.teams.filter((team) => !team.isFreeAgents).map((team) => ({
    teamId: team.teamId,
    name: team.name,
    abbreviation: team.abbreviation,
    divisionName: team.divisionName,
    isFreeAgents: false,
  }));

  const summaries = realTeams.map((team) => {
    const teamRiders = payload.riders.filter((rider) => rider.teamId === team.teamId);
    const averageOverall = teamRiders.length === 0
      ? null
      : Math.round((teamRiders.reduce((sum, rider) => sum + rider.overallRating, 0) / teamRiders.length) * 100) / 100;
    return {
      ...team,
      riderCount: teamRiders.length,
      averageOverall,
      rank: 0,
    } satisfies RiderTeamEditorTeamSummary;
  });

  const freeAgents = payload.riders.filter((rider) => rider.teamId == null);
  summaries.push({
    teamId: null,
    name: 'Free Agents',
    abbreviation: 'FA',
    divisionName: 'Free Agents',
    riderCount: freeAgents.length,
    averageOverall: freeAgents.length === 0 ? null : Math.round((freeAgents.reduce((sum, rider) => sum + rider.overallRating, 0) / freeAgents.length) * 100) / 100,
    rank: 0,
    isFreeAgents: true,
  });

  const ranked = [...summaries].sort((left, right) => {
    const leftAverage = left.averageOverall ?? -1;
    const rightAverage = right.averageOverall ?? -1;
    return rightAverage - leftAverage || right.riderCount - left.riderCount || compareStrings(left.name, right.name);
  });
  const rankByKey = new Map(ranked.map((entry, index) => [resolveRiderTeamEditorTeamKey(entry.teamId), index + 1]));
  return summaries.map((team) => ({
    ...team,
    rank: rankByKey.get(resolveRiderTeamEditorTeamKey(team.teamId)) ?? summaries.length,
  }));
}

async function loadRiderTeamEditorData(force = false): Promise<void> {
  if (state.riderTeamEditorPayload && !force) {
    renderRiderTeamEditor();
    return;
  }

  $('rider-team-editor-root').innerHTML = '<div class="results-empty">Editor wird geladen.</div>';
  const res = await api.getRiderTeamEditor();
  if (!res.success || !res.data) {
    $('rider-team-editor-root').innerHTML = `<div class="results-empty">${esc(res.error ?? 'Editor konnte nicht geladen werden.')}</div>`;
    return;
  }

  state.riderTeamEditorPayload = res.data;
  state.riderTeamEditorDirtyRiderIds = [];
  state.riderTeamEditorSaving = false;
  state.riderTeamEditorExporting = false;
  if (state.riderTeamEditorSelectedTeamKey) {
    const exists = res.data.teams.some((team) => resolveRiderTeamEditorTeamKey(team.teamId) === state.riderTeamEditorSelectedTeamKey);
    if (!exists) {
      state.riderTeamEditorSelectedTeamKey = '';
    }
  }
  renderRiderTeamEditor();
}

function updateRiderTeamEditorField(riderId: number, field: keyof RiderTeamEditorRiderRow, rawValue: string): void {
  const payload = state.riderTeamEditorPayload;
  if (!payload) {
    return;
  }

  const rider = payload.riders.find((entry) => entry.riderId === riderId);
  if (!rider) {
    return;
  }

  if (field === 'teamId') {
    rider.teamId = rawValue === 'free-agents' ? null : Number.parseInt(rawValue, 10);
  } else if (typeof rider[field] === 'number') {
    (rider[field] as number) = Number.parseInt(rawValue || '0', 10);
  } else {
    (rider[field] as string) = rawValue;
  }

  rider.overallRating = calculateEditorOverall(rider);
  payload.teams = rebuildRiderTeamEditorTeams(payload);
  if (!state.riderTeamEditorDirtyRiderIds.includes(riderId)) {
    state.riderTeamEditorDirtyRiderIds = [...state.riderTeamEditorDirtyRiderIds, riderId];
  }
  renderRiderTeamEditor();
}

async function saveRiderTeamEditorData(): Promise<void> {
  if (!state.riderTeamEditorPayload || state.riderTeamEditorSaving) {
    return;
  }

  state.riderTeamEditorSaving = true;
  renderRiderTeamEditor();
  const res = await api.saveRiderTeamEditor({ riders: state.riderTeamEditorPayload.riders });
  state.riderTeamEditorSaving = false;
  if (!res.success || !res.data) {
    alert(`Editor konnte nicht gespeichert werden:\n${res.error ?? 'Unbekannter Fehler'}`);
    renderRiderTeamEditor();
    return;
  }

  state.riderTeamEditorPayload = res.data;
  state.riderTeamEditorDirtyRiderIds = [];
  renderRiderTeamEditor();
}

async function exportRiderTeamEditorData(): Promise<void> {
  if (!state.riderTeamEditorPayload || state.riderTeamEditorExporting) {
    return;
  }

  state.riderTeamEditorExporting = true;
  renderRiderTeamEditor();
  const res = await api.exportRiderTeamEditor({ riders: state.riderTeamEditorPayload.riders });
  state.riderTeamEditorExporting = false;
  if (!res.success || !res.data) {
    alert(`riders.csv konnte nicht exportiert werden:\n${res.error ?? 'Unbekannter Fehler'}`);
    renderRiderTeamEditor();
    return;
  }

  downloadTextFile(res.data.fileName, res.data.content);
  renderRiderTeamEditor();
}

async function loadTeams(options: { render?: boolean } = {}): Promise<void> {
  const res = await api.getTeams();
  if (!res.success) {
    console.error('loadTeams Fehler:', res.error);
    $('teams-detail').innerHTML = `<p class="error-msg">Teams konnten nicht geladen werden: ${esc(res.error ?? 'Unbekannt')}</p>`;
    return;
  }
  state.teams = res.data ?? [];
  if (options.render !== false && isActiveView('teams')) {
    renderTeams();
  }
  if (isActiveView('dashboard')) {
    renderDashboard();
  }
  if (isActiveView('results')) {
    renderResultsView();
  }
}

function renderTeams(): void {
  const dropdown = $<HTMLSelectElement>('teams-dropdown');
  const currentVal = dropdown.value;
  dropdown.innerHTML = '<option value="">Ã¢â‚¬â€œ Team auswÃƒÂ¤hlen Ã¢â‚¬â€œ</option>' +
    state.teams.map(t =>
      `<option value="${t.id}"${String(t.id) === currentVal ? ' selected' : ''}>${esc(t.name)} (${esc(t.division ?? t.divisionName ?? '')}) Ã‚Â· ${esc(t.abbreviation)}</option>`,
    ).join('');
  const selectedId = currentVal ? Number(currentVal) : null;
  renderTeamDetail(selectedId);
}

function renderRidersMenu(): void {
  const detail = $('riders-detail');
  const activeColumns = getActiveRiderMenuTableColumns();
  const sortedRiders = sortRiderMenuRiders(state.riders);
  const totalRiders = sortedRiders.length;
  const totalPages = Math.max(1, Math.ceil(totalRiders / RIDER_MENU_PAGE_SIZE));
  state.riderMenuPage = Math.min(totalPages, Math.max(1, state.riderMenuPage));
  const startIndex = (state.riderMenuPage - 1) * RIDER_MENU_PAGE_SIZE;
  const endIndex = Math.min(totalRiders, startIndex + RIDER_MENU_PAGE_SIZE);
  const pageRiders = sortedRiders.slice(startIndex, endIndex);

  detail.innerHTML = `
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>Alle Fahrer</h3>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${totalRiders} Fahrer</span>
        <span class="text-muted">Sortierung: ${esc(getTeamSortLabel(state.riderMenuTableSort.key))} ${state.riderMenuTableSort.direction === 'asc' ? 'aufsteigend' : 'absteigend'}</span>
      </div>
      ${renderRiderMenuDetailPageTabs()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${activeColumns.map(renderRiderMenuTableHeader).join('')}
          </tr></thead>
          <tbody>
            ${pageRiders.length === 0
              ? `<tr><td colspan="${activeColumns.length}" class="text-muted">Keine Fahrer.</td></tr>`
              : pageRiders.map((rider) => `
                <tr class="team-detail-row">
                  ${activeColumns.map((column) => renderTeamTableCell(rider, column)).join('')}
                </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="team-detail-meta riders-pagination" style="margin-top:0.75rem">
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="prev" ${state.riderMenuPage <= 1 ? 'disabled' : ''}>Ã¢â€ Â ZurÃƒÂ¼ck</button>
        <span>Seite ${state.riderMenuPage} / ${totalPages} Ã‚Â· Fahrer ${totalRiders === 0 ? 0 : startIndex + 1}-${endIndex} von ${totalRiders}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="next" ${state.riderMenuPage >= totalPages ? 'disabled' : ''}>Weiter Ã¢â€ â€™</button>
      </div>
    </div>`;
}

function renderTeamDetail(teamId: number | null): void {
  const detail = $('teams-detail');
  if (teamId === null) {
    detail.innerHTML = '<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswÃƒÂ¤hlen.</p>';
    return;
  }
  const team = state.teams.find(t => t.id === teamId);
  if (!team) { detail.innerHTML = ''; return; }
  const riders = sortTeamRiders(state.riders.filter(r => r.activeTeamId === teamId));
  const divBadge = team.division === 'U23' ? 'badge-u23' : 'badge-classics';
  const activeColumns = getActiveTeamTableColumns();
  detail.innerHTML = `
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${esc(team.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${divBadge}">${esc(team.division ?? team.divisionName ?? '')}</span>
          <span>${renderCountry(team.country, team.countryCode)}</span>
          <span>KÃƒÂ¼rzel: ${esc(team.abbreviation)} Ã‚Â· Top 12 ${esc(formatTeamTopAverage(team.id))} (${esc(formatTeamAverage(team.id))})</span>
          ${team.isPlayerTeam ? '<span class="badge badge-live">Spielerteam</span>' : ''}
        </div>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${riders.length} Fahrer</span>
        <span class="text-muted">Sortierung: ${esc(getTeamSortLabel(state.teamTableSort.key))} ${state.teamTableSort.direction === 'asc' ? 'aufsteigend' : 'absteigend'}</span>
      </div>
      ${renderTeamDetailPageTabs()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${activeColumns.map(renderTeamTableHeader).join('')}
          </tr></thead>
          <tbody>
            ${riders.length === 0
              ? `<tr><td colspan="${activeColumns.length}" class="text-muted">Keine Fahrer.</td></tr>`
              : riders.map(r => {
                return `
                <tr class="team-detail-row">
                  ${activeColumns.map((column) => renderTeamTableCell(r, column)).join('')}
                </tr>`;
              }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

// ============================================================
//  Init
// ============================================================

(async () => {
  initializeStageEditorForm();
  renderStageEditor();
  showScreen('menu');
  await loadSavesList();
})();

const RIDER_STATS_ICONS = {
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
  breakaway: '<span class="rider-stats-breakaway-icon" aria-label="AusreiÃŸer" title="AusreiÃŸer" style="margin-right: 0.4rem;">??</span>',
};

function renderRiderOverallRatingBadge(score: number): string {
  const minScore = 50;
  const maxScore = 85;
  const clampedScore = Math.max(minScore, Math.min(maxScore, score));
  const relativeRatio = (clampedScore - minScore) / (maxScore - minScore);
  const colorFactor = Math.cbrt(relativeRatio);
  const hue = Math.round(colorFactor * 128);
  const lightness = Math.round(38 + (colorFactor * 10));
  const backgroundAlpha = 0.6 + (colorFactor * 0.4);
  const borderAlpha = 0.8;
  const style = \--stage-editor-score-hue:\;--stage-editor-score-lightness:\%;--stage-editor-score-bg-alpha:\;--stage-editor-score-border-alpha:\;\;
  return \<span class="stage-editor-score-badge" style="\">\</span>\;
}

function renderRiderStatsIconHeatPill(icon: string, title: string, value: number, maxValue: number): string {
  const ratio = maxValue > 0 ? Math.max(0, Math.min(1, value / maxValue)) : 0.5;
  const hue = Math.round(6 + (ratio * 118));
  const borderAlpha = 0.26 + (ratio * 0.18);
  const bgAlpha = 0.14 + (ratio * 0.12);
  const style = \--rider-stats-pill-hue:\;--rider-stats-pill-border-alpha:\;--rider-stats-pill-bg-alpha:\;\;
  return \<span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="\" title="\">\ \</span>\;
}

function renderRiderStatsSummary(rider: Rider | null, payload: RiderStatsPayload | null, teamName: string | null, countryCode: string | null, countryFlag: string): string {
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

  return \
    <div class="rider-stats-header-grid">
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Land">\<span>\</span></span>
        <span class="rider-stats-icon-pill" title="Team">\<span>\</span></span>
        <span class="rider-stats-icon-pill" title="Rolle">\</span>
        <span class="rider-stats-icon-pill" title="Formphase">\<span>Form</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;" title="Overall-StÃ¤rke">\</span>
        <span class="rider-stats-icon-pill" title="Season-Form">\\</span>
        <span class="rider-stats-icon-pill" title="Rennform">\\</span>
        <span class="rider-stats-icon-pill" title="Programm">\</span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Saisonrenntage">\\</span>
        <span class="rider-stats-icon-pill\" title="30-Tage Renntage">\\</span>
        <span class="rider-stats-icon-pill" title="Langzeit-Fatigue">\\</span>
        <span class="rider-stats-icon-pill\" title="Kurzzeitfatigue">\\</span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Saisonpunkte">\\</span>
        <span class="rider-stats-icon-pill" title="Saisonplatzierung">\\</span>
        <span class="rider-stats-icon-pill" title="Renntage">\\</span>
        <span class="rider-stats-icon-pill" title="Siege">\\</span>
      </div>
        <div class="rider-stats-header-col align-left">
          <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:124;--rider-stats-pill-border-alpha:0.44;--rider-stats-pill-bg-alpha:0.26; font-weight: 500;" title="Spezialisierung 1">${rider?.specialization1 ? esc(getRiderSpecializationLabel(rider.specialization1)) : '-'}</span>
          <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:41;--rider-stats-pill-border-alpha:0.31;--rider-stats-pill-bg-alpha:0.18; font-weight: 500;" title="Spezialisierung 2">${rider?.specialization2 ? esc(getRiderSpecializationLabel(rider.specialization2)) : '-'}</span>
          <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:6;--rider-stats-pill-border-alpha:0.26;--rider-stats-pill-bg-alpha:0.14; font-weight: 500;" title="Spezialisierung 3">${rider?.specialization3 ? esc(getRiderSpecializationLabel(rider.specialization3)) : '-'}</span>
          <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
        </div>
      <div class="rider-stats-header-col align-left">
        \
        \
        <span class="rider-stats-icon-pill" title="AusreiÃŸversuche">\\</span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        \
        \
        \
        \
      </div>
    </div>\;
}

