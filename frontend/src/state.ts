import { api } from './api';
import {
  buildRaceCategoryBadgeCssVariables,
  renderRiderNameLink,
  renderTeamNameLink,
  resolveRaceCategoryBadgeStyle,
} from './riderStatsUi';

export {
  buildRaceCategoryBadgeCssVariables,
  renderRiderNameLink,
  renderTeamNameLink,
  resolveRaceCategoryBadgeStyle,
};
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
  TeamStatsPayload,
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
  StageEditorDraft,
  StageEditorExistingStageOption,
  StageEditorStageOverviewRow,
  StageEditorClimbOverviewRow,
  StageEditorSegment,
  StageMarkerClassification,
  StageMarkerCategory,
  StageMarkerType,
  StageProfile,
  RealtimeStageCommitEntry,
  StageResultsPayload,
  StageTerrain,
  DraftHistoryPayload,
  InjuryRow,
  RaceRosterPayload,
} from '../../shared/types';
import { RaceSimView } from './race-sim/RaceSimView';
import { calculateStageFavorites } from './race-sim/stageFavorites';

export type TeamDetailPage = 'skills' | 'form' | 'profile' | 'preferences';
export type RiderStatsTab = 'results' | 'program' | 'form' | 'topResults' | 'skills' | 'career' | 'fatigue' | 'contracts';
export type RiderTeamEditorSortKey = keyof RiderTeamEditorRiderRow | 'teamName';

export type TeamTableSortKey = 'name' | 'countryCode' | 'birthYear' | 'age' | 'overallRating' | 'potOverall' | 'formBonus' | 'raceFormBonus' | 'averageForm' | 'longTermFatigueMalus' | 'shortTermFatigueMalus' | 'seasonFormPhase' | 'seasonPoints' | 'seasonRaceDays' | 'seasonWins' | 'contractEndSeason' | 'roleName' | 'mentorName' | 'riderType' | 'specialization1' | 'specialization2' | 'specialization3' | 'skillDevelopment' | 'peak1' | 'peak2' | 'peak3' | keyof Rider['skills'];
export type RaceParticipantsSortKey = 'team' | 'rider' | 'spec1' | 'role' | 'overall' | 'phase' | 'program';
export type StageEditorStagesSortKey = 'stageId' | 'countryCode' | 'raceName' | 'stageNumber' | 'profile' | 'distanceKm' | 'elevationGainMeters' | 'sprintCount' | 'climbCount' | 'profileScore';
export type StageEditorClimbsSortKey = 'placementKm' | 'name' | 'category' | 'countryCode' | 'raceName' | 'stageNumber' | 'gainMeters' | 'elevationAtTop' | 'distanceKm' | 'avgGradient' | 'maxGradient' | 'climbScore';

export interface TeamTableColumn {
  id: string;
  label: string;
  title: string;
  sortKey?: TeamTableSortKey;
  className?: string;
}

// ============================================================
//  State
// ============================================================

export const state: {
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
  selectedResultsSpecialView: 'nonFinishers' | 'events' | 'roster' | null;
  selectedDashboardRaceId: number | null;
  selectedRaceParticipantsRaceId: number | null;
  selectedDashboardProfileStageId: number | null;
  stageSummariesByStageId: Record<number, ParsedStageSummary | undefined>;
  stageSummaryErrorsByStageId: Record<number, string | undefined>;
  selectedRealtimeStageId: number | null;
  stageResults: StageResultsPayload | null;
  resultsRoster: RaceRosterPayload | null;
  seasonStandings: SeasonStandingsPayload | null;
  seasonStandingsSelectedSeason: number | null;
  draftHistory: DraftHistoryPayload | null;
  injuries: InjuryRow[] | null;
  draftSelectedSeason: number | null;
  draftOverlayActive: boolean;
  draftOverlayAuto: boolean;
  draftOverlayPicks: any[] | null;
  draftOverlayCurrentIndex: number;
  draftSpeedMultiplier: number;
  draftPaused: boolean;
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
  stageEditorPrograms?: Array<{ id: number; name: string }>;
  stageEditorHideBoringSegments: boolean;
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
  riderStatsSelectedSeason: number | null;
  riderStatsTopResultsFilterCategory: string | null;
  riderStatsTopResultsFilterSeason: number | null;
  riderStatsTopResultsPage: number;
  riderStatsTopResultsFilters: {
    gc: boolean;
    mountain: boolean;
    points: boolean;
    youth: boolean;
    oneDay: boolean;
    stage: boolean;
  };
  teamStatsPayload: TeamStatsPayload | null;
  teamStatsTab: 'topResults' | 'career' | 'contracts' | 'transfers';
  teamStatsSelectedTeamId: number | null;
  teamStatsSelectedRosterYear: number | null;
  teamStatsRosterSort: {
    key: 'nationality' | 'name' | 'overallRating' | 'potential' | 'roleName' | 'contractEndSeason';
    direction: 'asc' | 'desc';
  };
  teamStatsSelectedSeason: number | 'all';
  teamStatsTopResultsFilterCategory: string | null;
  teamStatsTopResultsFilterSeason: number | null;
  teamStatsTopResultsPage: number;
  teamStatsTopResultsFilters: {
    gc: boolean;
    mountain: boolean;
    points: boolean;
    youth: boolean;
    oneDay: boolean;
    stage: boolean;
  };
  riderTeamEditorPayload: RiderTeamEditorPayload | null;
  riderTeamEditorSelectedTeamKey: string;
  riderTeamEditorSort: {
    key: RiderTeamEditorSortKey;
    direction: 'asc' | 'desc';
  };
  riderTeamEditorDirtyRiderIds: number[];
  riderTeamEditorSaving: boolean;
  riderTeamEditorExporting: boolean;
  autoProgressTargetDate: string | null;
  raceProgramsPayload: any | null;
  raceProgramsActiveTab: string;
  raceProgramsDirty: boolean;
  raceProgramsSaving: boolean;
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
  resultsRoster: null,
  seasonStandings: null,
  seasonStandingsSelectedSeason: null,
  draftHistory: null,
  injuries: null,
  draftSelectedSeason: null,
  draftOverlayActive: false,
  draftOverlayAuto: true,
  draftOverlayPicks: null,
  draftOverlayCurrentIndex: 0,
  draftSpeedMultiplier: 1,
  draftPaused: false,
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
  stageEditorPrograms: [],
  stageEditorHideBoringSegments: true,
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
  riderStatsSelectedSeason: null,
  riderStatsTopResultsFilterCategory: null,
  riderStatsTopResultsFilterSeason: null,
  riderStatsTopResultsPage: 1,
  riderStatsTopResultsFilters: {
    gc: true,
    mountain: true,
    points: true,
    youth: true,
    oneDay: true,
    stage: true,
  },
  teamStatsPayload: null,
  teamStatsTab: 'topResults',
  teamStatsSelectedTeamId: null,
  teamStatsSelectedRosterYear: null,
  teamStatsRosterSort: {
    key: 'overallRating',
    direction: 'desc',
  },
  teamStatsSelectedSeason: 'all',
  teamStatsTopResultsFilterCategory: null,
  teamStatsTopResultsFilterSeason: null,
  teamStatsTopResultsPage: 1,
  teamStatsTopResultsFilters: {
    gc: true,
    mountain: true,
    points: true,
    youth: true,
    oneDay: true,
    stage: true,
  },
  riderTeamEditorPayload: null,
  riderTeamEditorSelectedTeamKey: '',
  riderTeamEditorSort: {
    key: 'lastName',
    direction: 'asc',
  },
  riderTeamEditorDirtyRiderIds: [],
  riderTeamEditorSaving: false,
  riderTeamEditorExporting: false,
  autoProgressTargetDate: null,
  raceProgramsPayload: null,
  raceProgramsActiveTab: 'calendar-cols',
  raceProgramsDirty: false,
  raceProgramsSaving: false,
};

export let raceSimView: RaceSimView | null = null;
export function setRaceSimView(view: RaceSimView | null): void {
  raceSimView = view;
}

export let realtimeCompletionInFlight = false;
export function setRealtimeCompletionInFlight(val: boolean): void {
  realtimeCompletionInFlight = val;
}

export let instantStageInFlightId: number | null = null;
export function setInstantStageInFlightId(val: number | null): void {
  instantStageInFlightId = val;
}

export let realtimeStageLoadInFlightId: number | null = null;
export function setRealtimeStageLoadInFlightId(val: number | null): void {
  realtimeStageLoadInFlightId = val;
}

export let autoProgressActive = false;
export function setAutoProgressActive(val: boolean): void {
  autoProgressActive = val;
}

// ============================================================
//  DOM-Helpers
// ============================================================

export function $<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`Element mit ID "${id}" wurde nicht gefunden.`);
  }
  return el as T;
}

export function esc(str: unknown): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatRaceTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const mm = String(minutes).padStart(2, '0');
  const ss = String(remainingSeconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${minutes}:${ss}`;
}

export function formatRaceGap(seconds: number | null): string {
  if (seconds == null) return '–';
  if (seconds === 0) return '–';
  return `+${formatRaceTime(seconds)}`;
}

export const GC_RESULT_TYPE_ID = 2;
export const POINTS_RESULT_TYPE_ID = 3;
export const MOUNTAIN_RESULT_TYPE_ID = 4;

export function resolveTeamJerseyAssetPath(teamId: number): string {
  return `/jersey/Jer_${teamId}.png`;
}

export function renderMiniJersey(teamId: number | null | undefined, teamName: string | null | undefined): string {
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

export function renderResultsJerseyColumn(teamId: number | null | undefined, teamName: string | null | undefined): string {
  return `<span class="results-jersey-cell">${renderMiniJersey(teamId, teamName)}</span>`;
}

export function renderResultsFlagColumn(countryCode: string | null | undefined): string {
  if (!countryCode) {
    return '<span class="results-flag-placeholder" aria-hidden="true"></span>';
  }

  const flag = renderFlag(countryCode);
  return flag || '<span class="results-flag-placeholder" aria-hidden="true"></span>';
}

export function resolveRiderCountryCode(riderId: number | null | undefined): string | null {
  if (riderId == null) {
    return null;
  }

  const rider = findRiderById(riderId);
  return rider?.country?.code3 ?? rider?.nationality ?? null;
}

export function findRiderById(riderId: number | null | undefined): Rider | null {
  if (riderId == null) {
    return null;
  }

  return state.riders.find((candidate) => candidate.id === riderId) ?? null;
}

export function findRaceById(raceId: number | null): Race | null {
  if (raceId == null) return null;
  return state.races.find((race) => race.id === raceId) ?? null;
}

export function findStageById(stageId: number | null): { race: Race; stage: NonNullable<Race['stages']>[number] } | null {
  if (stageId == null) return null;
  for (const race of state.races) {
    const stage = race.stages?.find((candidate) => candidate.id === stageId);
    if (stage) {
      return { race, stage };
    }
  }
  return null;
}

export function renderResultsParticipant(
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

export function renderNonFinisherStatusBadge(isOtl: boolean): string {
  return `<span class="results-status-badge ${isOtl ? 'results-status-badge-otl' : 'results-status-badge-dnf'}">${isOtl ? 'OTL' : 'DNF'}</span>`;
}

export function formatNonFinisherReason(reason: string | null | undefined, isOtl: boolean): string {
  if (!reason) {
    return isOtl ? 'Außerhalb des Zeitlimits' : 'Aufgegeben';
  }
  if (reason.startsWith('crash:')) {
    return `Sturz · ${reason.slice('crash:'.length)}`;
  }
  if (reason === 'mechanical') {
    return 'Defekt';
  }
  return reason;
}

export function renderRankDelta(previousRank: number | null | undefined, delta: number | null | undefined): string {
  if (previousRank == null || delta == null || delta === 0) {
    return '<span class="results-gc-delta results-gc-delta-neutral">●</span>';
  }

  if (delta > 0) {
    return `<span class="results-gc-delta results-gc-delta-up"><span class="results-gc-delta-symbol">▲</span><span>${delta}</span></span>`;
  }

  return `<span class="results-gc-delta results-gc-delta-down"><span class="results-gc-delta-symbol">▼</span><span>${Math.abs(delta)}</span></span>`;
}

export function formatMarkerLabel(markerType: StageMarkerType, label: string): string {
  if (markerType === 'sprint_intermediate') {
    return `Sprint · ${label}`;
  }
  if (markerType === 'climb_top' || markerType === 'finish_hill' || markerType === 'finish_mountain') {
    return `Bergwertung · ${label}`;
  }
  return label;
}

export const FLAG_CODE_BY_CODE3: Record<string, string> = {
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
  OMA: 'om',
  OTH: 'un',
};

export function renderFlag(code3: string): string {
  const alpha2 = FLAG_CODE_BY_CODE3[code3] ?? null;
  if (!alpha2) return '';
  return `<span class="fi fi-${alpha2} country-flag" aria-hidden="true"></span>`;
}

export function renderCountry(country?: Team['country'] | Rider['country'], fallbackCode?: string): string {
  if (!country) return fallbackCode ? esc(fallbackCode) : '–';
  return `<span class="country-chip">${renderFlag(country.code3)}<span>${esc(country.name)}</span></span>`;
}

export function formatKm(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} km`;
}

export function formatElevationGain(value: number): string {
  return `${Math.round(value)} hm`;
}

export function formatGradient(value: number): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1).replace('.', ',')}%`;
}

// ============================================================
//  UI-Reactivity / Flow Controlling API
// ============================================================

export type ViewName =
  | 'dashboard'
  | 'calendar'
  | 'teams'
  | 'riders'
  | 'rider-team-editor'
  | 'live-race'
  | 'results'
  | 'draft'
  | 'injuries'
  | 'season-standings'
  | 'stage-editor'
  | 'stage-editor-stages'
  | 'stage-editor-climbs'
  | 'leaderboards'
  | 'race-programs';

interface ActiveViewListener {
  (viewName: ViewName): void;
}

const activeViewListeners = new Set<ActiveViewListener>();

export function addActiveViewListener(listener: ActiveViewListener): void {
  activeViewListeners.add(listener);
}

export function showScreen(name: 'menu' | 'game'): void {
  document.querySelectorAll('.screen').forEach((screen) => screen.classList.add('hidden'));
  $(`screen-${name}`).classList.remove('hidden');
}

export function showModal(name: string): void {
  $(`modal-${name}`).classList.remove('hidden');
}

export function hideModal(name: string): void {
  $(`modal-${name}`).classList.add('hidden');
}

function formatGcGap(seconds: number | null | undefined): string {
  if (seconds == null || seconds <= 0) {
    return '—';
  }
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  if (minutes > 0) {
    return `+${minutes}:${String(remainder).padStart(2, '0')}`;
  }
  return `+${remainder}s`;
}

function renderInstantSimPanel(): void {
  const bootstrap = state.realtimeBootstrap;
  if (!bootstrap) return;

  const fListEl = $('instant-sim-favorites');
  const gcListEl = $('instant-sim-gc');
  const pointsListEl = $('instant-sim-points');
  if (!fListEl || !gcListEl || !pointsListEl) return;

  // Render stage metadata
  const raceEl = $('instant-sim-race');
  const stageDescEl = $('instant-sim-stage-desc');
  const dateEl = $('instant-sim-date');
  if (raceEl) raceEl.textContent = bootstrap.race.name;
  if (stageDescEl) stageDescEl.textContent = `Etappe ${bootstrap.stage.stageNumber} · ${bootstrap.stage.profile}`;
  if (dateEl) dateEl.textContent = formatDate(bootstrap.stage.date);

  // 1. Calculate and display Stage Favorites 1-10
  const favorites = calculateStageFavorites(bootstrap.riders, bootstrap.teams, bootstrap.stage, {
    distanceKm: bootstrap.stageSummary?.distanceKm,
    elevationGainMeters: bootstrap.stageSummary?.elevationGainMeters,
  });
  const topFavs = favorites.slice(0, 10);
  const gcByRiderId = new Map(bootstrap.gcStandings.map((s) => [s.riderId, s]));

  let favsHtml = `
    <h3>
      <span>Etappen-Favoriten</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;

  for (const item of topFavs) {
    const rider = bootstrap.riders.find((r) => r.id === item.riderId);
    if (!rider) continue;

    const flagCode = resolveRiderCountryCode(rider.id) ?? 'un';
    const alpha2 = (FLAG_CODE_BY_CODE3 as Record<string, string>)[flagCode] ?? 'un';
    const team = bootstrap.teams.find((t) => t.id === rider.activeTeamId);
    const teamAbbr = team?.abbreviation ?? '—';
    const gcStanding = gcByRiderId.get(rider.id);
    const gcInfo = gcStanding 
      ? `GC ${gcStanding.rank} (${gcStanding.rank === 1 ? 'Gelb' : formatGcGap(gcStanding.gapSeconds)})`
      : 'GC –';

    favsHtml += `
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${rider.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${item.rank}</span>
            <span class="fi fi-${alpha2} country-flag" style="font-size: 0.8rem;"></span>
            <span class="instant-sim-name">${esc(rider.firstName)} <strong>${esc(rider.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${esc(teamAbbr)}</span>
            <span class="instant-sim-gc-info">${gcInfo}</span>
          </div>
        </div>
      </div>
    `;
  }
  favsHtml += '</div>';
  fListEl.innerHTML = favsHtml;

  // 2. Display GC Top 10
  const topGc = bootstrap.gcStandings.slice(0, 10);
  let gcHtml = `
    <h3>
      <span>Gesamtwertung (GC)</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;

  for (const standing of topGc) {
    const rider = bootstrap.riders.find((r) => r.id === standing.riderId);
    if (!rider) continue;

    const flagCode = resolveRiderCountryCode(rider.id) ?? 'un';
    const alpha2 = (FLAG_CODE_BY_CODE3 as Record<string, string>)[flagCode] ?? 'un';
    const team = bootstrap.teams.find((t) => t.id === rider.activeTeamId);
    const teamAbbr = team?.abbreviation ?? '—';
    const gcInfo = standing.rank === 1 ? 'Gelb' : formatGcGap(standing.gapSeconds);

    gcHtml += `
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${rider.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${standing.rank}</span>
            ${renderRankDelta(standing.previousRank, standing.rankDelta)}
            <span class="fi fi-${alpha2} country-flag" style="font-size: 0.8rem; margin-left: 0.25rem;"></span>
            <span class="instant-sim-name">${esc(rider.firstName)} <strong>${esc(rider.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${esc(teamAbbr)}</span>
            <span class="instant-sim-gc-info">${gcInfo}</span>
          </div>
        </div>
      </div>
    `;
  }
  gcHtml += '</div>';
  gcListEl.innerHTML = gcHtml;

  // 3. Display Points Top 10
  const topPoints = bootstrap.pointsStandings.slice(0, 10);
  let pointsHtml = `
    <h3>
      <span>Punktewertung</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;

  for (const standing of topPoints) {
    if (standing.riderId == null) continue;
    const rider = bootstrap.riders.find((r) => r.id === standing.riderId);
    if (!rider) continue;

    const flagCode = resolveRiderCountryCode(rider.id) ?? 'un';
    const alpha2 = (FLAG_CODE_BY_CODE3 as Record<string, string>)[flagCode] ?? 'un';
    const team = bootstrap.teams.find((t) => t.id === rider.activeTeamId);
    const teamAbbr = team?.abbreviation ?? '—';
    const pointsInfo = `${standing.points ?? 0} Punkte`;

    pointsHtml += `
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${rider.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${standing.rank}</span>
            ${renderRankDelta(standing.previousRank, standing.rankDelta)}
            <span class="fi fi-${alpha2} country-flag" style="font-size: 0.8rem; margin-left: 0.25rem;"></span>
            <span class="instant-sim-name">${esc(rider.firstName)} <strong>${esc(rider.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${esc(teamAbbr)}</span>
            <span class="instant-sim-gc-info">${pointsInfo}</span>
          </div>
        </div>
      </div>
    `;
  }
  pointsHtml += '</div>';
  pointsListEl.innerHTML = pointsHtml;
}

export function showLoading(msg = 'Lade…'): void {
  const suffix = autoProgressActive ? ' (Leertaste zum Stoppen)' : '';
  const defaultLoader = $('default-loader');
  if (defaultLoader) {
    $('loading-msg').textContent = msg + suffix;
    $('loading-progress').classList.add('hidden');
    defaultLoader.classList.remove('hidden');
    $('instant-sim-panel')?.classList.add('hidden');
  }
  $('loading-overlay').classList.remove('hidden');
}

export function hideLoading(): void {
  $('loading-overlay').classList.add('hidden');
}

export function showInstantProgress(progress: number): void {
  $('default-loader')?.classList.add('hidden');
  $('instant-sim-panel')?.classList.remove('hidden');
  $('loading-overlay').classList.remove('hidden');
  if (state.realtimeBootstrap) {
    renderInstantSimPanel();
  } else {
    const favs = $('instant-sim-favorites');
    const gc = $('instant-sim-gc');
    if (favs) favs.innerHTML = '';
    if (gc) gc.innerHTML = '';
  }
  updateInstantProgress(progress);
}

export function updateInstantProgress(progress: number): void {
  const percent = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  const suffix = autoProgressActive ? ' (Leertaste zum Stoppen)' : '';
  const msgText = `Instant-Simulation läuft … ${percent}%${suffix}`;
  
  const defaultMsg = $('loading-msg');
  if (defaultMsg) defaultMsg.textContent = msgText;
  
  const defaultBar = $<HTMLDivElement>('loading-progress-bar');
  if (defaultBar) defaultBar.style.width = `${percent}%`;
  
  const instantMsg = $('instant-loading-msg');
  if (instantMsg) instantMsg.textContent = msgText;
  
  const instantBar = $<HTMLDivElement>('instant-loading-progress-bar');
  if (instantBar) instantBar.style.width = `${percent}%`;

  const fListEl = $('instant-sim-favorites');
  if (fListEl && fListEl.innerHTML.trim() === '' && state.realtimeBootstrap) {
    renderInstantSimPanel();
  }
}

export function showError(elemId: string, msg: string): void {
  const el = $(elemId);
  el.textContent = msg;
  el.classList.remove('hidden');
}

export function hideError(elemId: string): void {
  $(elemId).classList.add('hidden');
}

export function activateView(name: ViewName): void {
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  document.querySelectorAll<HTMLElement>('.nav-btn').forEach((b) => b.classList.remove('active'));

  $(`view-${name}`).classList.add('active');
  document.querySelector<HTMLElement>(`.nav-btn[data-view="${name}"]`)?.classList.add('active');
  $('game-state-bar').classList.toggle('hidden', name === 'live-race');

  // Trigger registration hooks / view specific loading in external views
  for (const listener of activeViewListeners) {
    try {
      listener(name);
    } catch (e) {
      console.error(`Fehler bei View-Aktivierung von "${name}":`, e);
    }
  }
}

export function isActiveView(name: ViewName): boolean {
  return document.getElementById(`view-${name}`)?.classList.contains('active') === true;
}

export function getRiderSpecializationLabel(specialization: string): string {
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


// ============================================================
//  General / Skill Helpers and Formatting
// ============================================================

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function interpolateChannel(start: number, end: number, ratio: number): number {
  return Math.round(start + (end - start) * ratio);
}

export function interpolateColor(start: [number, number, number], end: [number, number, number], ratio: number): string {
  return `rgb(${interpolateChannel(start[0], end[0], ratio)} ${interpolateChannel(start[1], end[1], ratio)} ${interpolateChannel(start[2], end[2], ratio)})`;
}

export function getSkillColor(value: number): string {
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

export function renderSkillValue(value: number, potential?: number): string {
  const titleAttr = potential != null ? ` title="Potential: ${potential.toFixed(2)}"` : '';
  return `<span class="skill-value" style="color:${getSkillColor(value)}"${titleAttr}>${value.toFixed(2)}</span>`;
}

export function renderSkillValueWithDelta(value: number, yearStart?: number, potential?: number): string {
  if (yearStart == null) {
    return renderSkillValue(value, potential);
  }
  const delta = Math.round((value - yearStart) * 100) / 100;
  const deltaClass = delta > 0 ? 'skill-delta-positive' : delta < 0 ? 'skill-delta-negative' : 'skill-delta-neutral';
  const sign = delta > 0 ? '+' : '';
  const deltaText = `<span class="skill-delta ${deltaClass}">${sign}${delta.toFixed(2)}</span>`;
  return `
    <div class="skill-with-delta">
      <span class="skill-value" style="color:${getSkillColor(value)}" title="Potential: ${potential != null ? potential.toFixed(2) : ''}">${value.toFixed(2)}</span>
      ${deltaText}
    </div>
  `;
}

export function renderRaceFormBonusValue(value: number | undefined): string {
  const amount = value ?? 0;
  if (amount < 0) {
    return `${amount.toFixed(1).replace('.', ',')}`;
  }
  if (amount === 0) {
    return '0,0';
  }
  return `<span class="race-sim-form-positive">+${amount.toFixed(1).replace('.', ',')}</span>`;
}

export function renderSeasonFormValue(value: number | undefined): string {
  const amount = value ?? 0;
  if (amount === 0) {
    return '0,0';
  }
  const className = amount > 0 ? 'race-sim-form-positive' : 'race-sim-form-negative';
  const prefix = amount > 0 ? '+' : '';
  return `<span class="${className}">${prefix}${amount.toFixed(1).replace('.', ',')}</span>`;
}

export function renderLoadMalusValue(value: number | undefined, warning: Rider['shortTermFatigueWarning'] = 'none', title?: string): string {
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

export function renderSeasonFormPhase(rider: Rider): string {
  const phase = rider.seasonFormPhase ?? 'neutral';
  return renderSeasonFormPhaseIndicator(phase);
}

export function renderSeasonFormPhaseIndicator(phase: Rider['seasonFormPhase']): string {
  const meta: Record<string, { symbol: string; label: string; className: string }> = {
    rise: { symbol: '▲', label: 'Aufbau', className: 'team-form-phase-rise' },
    fall: { symbol: '▼', label: 'Abbau', className: 'team-form-phase-fall' },
    neutral: { symbol: '●', label: 'Neutral', className: 'team-form-phase-neutral' },
  };
  const item = meta[phase ?? 'neutral'] ?? meta['neutral'];
  return `<span class="team-form-phase ${item.className}" title="${esc(item.label)}">${item.symbol}</span>`;
}

export function renderRiderProgramButton(rider: Rider): string {
  if (!rider.seasonProgram) {
    return '–';
  }
  return `<button type="button" class="team-program-button" data-rider-program-id="${rider.id}">${esc(rider.seasonProgram.name)}</button>`;
}

export function getRiderCountryCode(rider: Rider): string {
  return rider.country?.code3 ?? rider.nationality;
}

export function formatRiderName(rider: Rider): string {
  return `${rider.lastName} ${rider.firstName}`;
}

export function renderRiderAvailabilityMarker(rider: Rider): string {
  if (!rider.isUnavailable) {
    return '';
  }

  const label = rider.healthStatus === 'injured' ? 'Verletzung' : 'Krankheit';
  const remainingDays = rider.unavailableDaysRemaining ?? 0;
  const untilText = rider.unavailableUntil ? ` bis ${formatDate(rider.unavailableUntil)}` : '';
  const titleText = `${label}: noch ${remainingDays} Tag${remainingDays === 1 ? '' : 'e'}${untilText}`;
  return `<span class="rider-availability-marker" title="${esc(titleText)}" aria-label="${esc(titleText)}"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>`;
}

export function getRiderRoleName(rider: Rider): string {
  return rider.role?.name ?? (rider.roleId != null ? `Rolle ${rider.roleId}` : '–');
}

export function downloadTextFile(fileName: string, content: string): void {
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


