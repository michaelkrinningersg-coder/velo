import { api } from './api';
import type {
  GameStatus,
  GameState,
  ParsedStageSummary,
  QuickSimResponse,
  PrecalculatedRaceIncident,
  PendingStage,
  RaceRosterEditorPayload,
  RealtimeSimulationBootstrap,
  SeasonStandingCountryRow,
  SavegameMeta,
  SeasonStandingsPayload,
  Team,
  Rider,
  Race,
  Stage,
  StageClassification,
  StageFinishMarkerType,
  StageMarker,
  StageEditorClimb,
  StageEditorDraft,
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
  selectedDashboardRaceId: number | null;
  selectedDashboardProfileStageId: number | null;
  stageSummariesByStageId: Record<number, ParsedStageSummary | undefined>;
  stageSummaryErrorsByStageId: Record<number, string | undefined>;
  realtimeBreakawayRiderIdsByStageId: Record<number, number[] | undefined>;
  selectedRealtimeStageId: number | null;
  stageResults: StageResultsPayload | null;
  seasonStandings: SeasonStandingsPayload | null;
  selectedSeasonStandingScope: 'riders' | 'teams' | 'countries';
  teamTableSort: {
    key: TeamTableSortKey;
    direction: 'asc' | 'desc';
  };
  teamDetailsRiderId: number | null;
  stageEditorDraft: StageEditorDraft | null;
  realtimeBootstrap: RealtimeSimulationBootstrap | null;
  realtimeError: string | null;
  rosterEditor: RaceRosterEditorPayload | null;
  rosterEditorSelectedRiderIds: number[];
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
  selectedDashboardRaceId: null,
  selectedDashboardProfileStageId: null,
  stageSummariesByStageId: {},
  stageSummaryErrorsByStageId: {},
  realtimeBreakawayRiderIdsByStageId: {},
  selectedRealtimeStageId: null,
  stageResults: null,
  seasonStandings: null,
  selectedSeasonStandingScope: 'riders',
  teamTableSort: {
    key: 'name',
    direction: 'asc',
  },
  teamDetailsRiderId: null,
  stageEditorDraft: null,
  realtimeBootstrap: null,
  realtimeError: null,
  rosterEditor: null,
  rosterEditorSelectedRiderIds: [],
};

let raceSimView: RaceSimView | null = null;

let realtimeCompletionInFlight = false;

const RESULTS_STAGE_OVERVIEW_KEY = '__stage_overview__';

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
const STAGE_EDITOR_CLIMB_MIN_GAIN_METERS = 60;
const STAGE_EDITOR_CLIMB_MIN_AVG_GRADIENT = 3;
const STAGE_EDITOR_BRIEF_DESCENT_TOLERANCE_METERS = 18;
const STAGE_EDITOR_BRIEF_DESCENT_TOLERANCE_KM = 0.6;
const STAGE_EDITOR_AUTO_DESCENT_MIN_GRADIENT = -2;
const STAGE_EDITOR_AUTO_DESCENT_MIN_DISTANCE_KM = 1;
const STAGE_EDITOR_AUTO_HILL_MIN_DISTANCE_KM = 0.5;
const STAGE_EDITOR_AUTO_HILL_MIN_GRADIENT = 3;
const STAGE_EDITOR_AUTO_MEDIUM_MIN_DISTANCE_KM = 2.5;
const STAGE_EDITOR_AUTO_MEDIUM_MIN_GRADIENT = 3;
const STAGE_EDITOR_AUTO_MOUNTAIN_MIN_DISTANCE_KM = 6;
const STAGE_EDITOR_AUTO_MOUNTAIN_MIN_GRADIENT = 3.5;
const STAGE_EDITOR_AUTO_HIGH_MOUNTAIN_MIN_DISTANCE_KM = 10;
const STAGE_EDITOR_AUTO_HIGH_MOUNTAIN_MIN_GRADIENT = 4;
const STAGE_EDITOR_AUTO_HIGH_MOUNTAIN_MIN_TOP_METERS = 2000;

function isFinishMarkerType(markerType: StageMarkerType): markerType is StageFinishMarkerType {
  return ['finish_flat', 'finish_TT', 'finish_hill', 'finish_mountain'].includes(markerType);
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
  if (seconds == null) return '–';
  if (seconds === 0) return '—';
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

  const rider = state.riders.find((candidate) => candidate.id === riderId) ?? null;
  return rider?.country?.code3 ?? rider?.nationality ?? null;
}

function renderResultsParticipant(name: string, strong = true, isBreakaway = false): string {
  const label = strong
    ? `<strong class="results-participant-label">${esc(name)}</strong>`
    : `<span class="results-participant-label">${esc(name)}</span>`;
  return `<span class="results-participant${isBreakaway ? ' is-breakaway' : ''}">${label}</span>`;
}

function decorateStageResultsWithRealtimeBreakaways(payload: StageResultsPayload | null): StageResultsPayload | null {
  if (!payload) {
    return null;
  }

  const breakawayRiderIds = state.realtimeBreakawayRiderIdsByStageId[payload.stageId] ?? [];
  if (breakawayRiderIds.length === 0) {
    return payload;
  }

  const breakawayRiderIdSet = new Set(breakawayRiderIds);
  return {
    ...payload,
    classifications: payload.classifications.map((classification) => ({
      ...classification,
      rows: classification.rows.map((row) => ({
        ...row,
        isBreakaway: row.riderId != null && breakawayRiderIdSet.has(row.riderId),
      })),
    })),
  };
}

function renderGcRankDelta(previousRank: number | null | undefined, delta: number | null | undefined): string {
  if (previousRank == null || delta == null || delta === 0) {
    return '<span class="results-gc-delta results-gc-delta-neutral">●</span>';
  }

  if (delta > 0) {
    return `<span class="results-gc-delta results-gc-delta-up"><span class="results-gc-delta-symbol">▲</span><span>${delta}</span></span>`;
  }

  return `<span class="results-gc-delta results-gc-delta-down"><span class="results-gc-delta-symbol">▼</span><span>${Math.abs(delta)}</span></span>`;
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
    return `Sprint · ${label}`;
  }
  if (markerType === 'climb_top') {
    return `Bergwertung · ${label}`;
  }
  return label;
}

function renderMarkerClassificationsHtml(classifications: StageMarkerClassification[]): string {
  if (classifications.length === 0) {
    return '';
  }

  return classifications.map((classification) => {
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
          <div class="results-marker-name">${renderResultsParticipant(riderName, false)}</div>
          <div class="results-marker-flag">${renderResultsFlagColumn(resolveRiderCountryCode(rider?.id))}</div>
          <div class="results-marker-time">${esc(formatRaceTime(entry.crossingTimeSeconds))}</div>
          <div class="results-marker-gap">${esc(formatRaceGap(entry.gapSeconds))}</div>
          <div class="results-marker-points">${entry.pointsAwarded != null && entry.pointsAwarded > 0 ? entry.pointsAwarded : '–'}</div>
        </div>`;
    }).join('');

    const categoryText = classification.markerCategory ? ` · Kat. ${classification.markerCategory}` : '';
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
  const categoryText = classification.markerCategory ? ` · Kat. ${classification.markerCategory}` : '';
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
        <div class="results-marker-name">${renderResultsParticipant(riderName, false)}</div>
        <div class="results-marker-flag">${renderResultsFlagColumn(resolveRiderCountryCode(rider?.id))}</div>
        <div class="results-marker-time">${esc(formatRaceTime(entry.crossingTimeSeconds))}</div>
        <div class="results-marker-gap">${esc(formatRaceGap(entry.gapSeconds))}</div>
        <div class="results-marker-points">${entry.pointsAwarded != null && entry.pointsAwarded > 0 ? entry.pointsAwarded : '–'}</div>
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
  const categorySuffix = classification.markerType === 'climb_top' && classification.markerCategory
    ? ` ${classification.markerCategory}`
    : '';
  return `${markerPrefix}${categorySuffix} · ${classification.markerLabel}`;
}

function formatAverageSpeed(distanceKm: number, timeSeconds: number): string {
  if (!(distanceKm > 0) || !(timeSeconds > 0)) {
    return '';
  }
  return `${((distanceKm / timeSeconds) * 3600).toFixed(1).replace('.', ',')} km/h`;
}

function formatPointsGap(points: number): string {
  if (points === 0) return '—';
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
          <span class="season-standings-country-rider-name">${esc(rider.riderName)}</span>
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
          <span class="season-standings-country-rider-name">${esc(rider.riderName ?? '—')}</span>
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
  if (race.isStageRace) {
    return `<span class="badge badge-live">Etappenrennen · ${race.numberOfStages} Etappen</span>`;
  }
  return '<span class="badge badge-todo">Eintagesrennen</span>';
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

type TeamTableSortKey = 'name' | 'countryCode' | 'birthYear' | 'age' | 'overallRating' | 'formBonus' | 'raceFormBonus' | 'seasonPoints' | 'contractEndSeason' | 'roleName' | 'riderType' | keyof Rider['skills'];

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
  hill: 'Hügel',
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
  { id: 'flag', label: '', title: '', className: 'team-table-col-flag' },
  { id: 'code', label: 'Country', title: 'Country - Sortierung nach 3er-Code', sortKey: 'countryCode', className: 'team-table-col-code' },
  { id: 'birthYear', label: 'Jg', title: 'Geburtsjahr', sortKey: 'birthYear', className: 'team-table-col-year' },
  { id: 'age', label: 'Alt', title: 'Alter', sortKey: 'age', className: 'team-table-col-age' },
  { id: 'overallRating', label: 'Ges', title: 'Gesamtstärke', sortKey: 'overallRating', className: 'team-table-col-overall' },
  { id: 'formBonus', label: 'S-Form', title: 'Saisonformbonus', sortKey: 'formBonus', className: 'team-table-col-points' },
  { id: 'raceFormBonus', label: 'R-Form', title: 'Rennbonus aus saisonalem Formfenster', sortKey: 'raceFormBonus', className: 'team-table-col-points' },
  { id: 'seasonPoints', label: 'Pkt', title: 'Saisonpunkte - kumulierte Punkte der aktuellen Saison', sortKey: 'seasonPoints', className: 'team-table-col-points' },
  { id: 'contractEndSeason', label: 'V-Ende', title: 'Vertragsende - Ende des aktiven Vertrags', sortKey: 'contractEndSeason', className: 'team-table-col-contract' },
  { id: 'roleName', label: 'Rolle', title: 'Teamrolle des Fahrers', sortKey: 'roleName', className: 'team-table-col-role' },
  ...TEAM_SKILL_COLUMNS.map((column) => ({
    id: column.key,
    label: column.label,
    title: `${column.label} - ${TEAM_SKILL_TITLES[column.key]}`,
    sortKey: column.key,
    className: 'team-table-col-skill',
  })),
  { id: 'info', label: 'Info', title: 'Info - Profil und Vorlieben anzeigen', sortKey: 'riderType', className: 'team-table-col-info' },
];

const TEAM_TABLE_COLUMN_COUNT = TEAM_TABLE_COLUMNS.length;

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

function renderSkillValue(value: number): string {
  return `<span class="skill-value" style="color:${getSkillColor(value)}">${Math.round(value)}</span>`;
}

function renderRaceFormBonusValue(value: number | undefined): string {
  const amount = value ?? 0;
  if (amount <= 0) {
    return '–';
  }
  return `<span class="race-sim-form-positive">+${amount.toFixed(1).replace('.', ',')}</span>`;
}

function renderSeasonFormValue(value: number | undefined): string {
  const amount = value ?? 0;
  if (amount === 0) {
    return '–';
  }
  const className = amount > 0 ? 'race-sim-form-positive' : 'race-sim-form-negative';
  const prefix = amount > 0 ? '+' : '';
  return `<span class="${className}">${prefix}${amount.toFixed(1).replace('.', ',')}</span>`;
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
  if (!country) return fallbackCode ? esc(fallbackCode) : '–';
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
  return ['<option value="">–</option>', ...STAGE_MARKER_CATEGORIES.map((category) =>
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
    return segmentIndex === 0 ? 'Startgrenze · Pflichtmarker Start oder Bergbeginn' : 'Startgrenze · Bergbeginn';
  }

  return segmentIndex === totalSegments - 1
    ? 'Endgrenze · Ziel oder Wertungsende'
    : 'Endgrenze · Sprint oder Bergwertung';
}

function collectStageEditorClimbPairIssues(draft: StageEditorDraft): Map<number, string[]> {
  const issuesBySegment = new Map<number, string[]>();
  const openClimbs = new Map<string, number[]>();

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

      if (!marker.name) {
        pushIssue(segmentIndex, 'climb_start braucht einen Namen fuer die Paarbildung.');
        return;
      }

      const bucket = openClimbs.get(marker.name) ?? [];
      bucket.push(segmentIndex);
      openClimbs.set(marker.name, bucket);
    });

    segment.endMarkers.forEach((marker) => {
      if (marker.type !== 'climb_top') {
        return;
      }

      if (!marker.name) {
        pushIssue(segmentIndex, 'climb_top braucht einen Namen fuer die Paarbildung.');
        return;
      }

      const bucket = openClimbs.get(marker.name) ?? [];
      const startSegmentIndex = bucket.pop();
      if (startSegmentIndex == null) {
        pushIssue(segmentIndex, `climb_top \"${marker.name}\" braucht einen vorherigen climb_start mit gleichem Namen.`);
        return;
      }

      if (bucket.length === 0) {
        openClimbs.delete(marker.name);
      } else {
        openClimbs.set(marker.name, bucket);
      }
    });
  });

  openClimbs.forEach((segmentIndexes, climbName) => {
    segmentIndexes.forEach((segmentIndex) => {
      pushIssue(segmentIndex, `climb_start \"${climbName}\" braucht einen spaeteren climb_top mit gleichem Namen.`);
    });
  });

  return issuesBySegment;
}

function normalizeMarkerForType(marker: StageMarker): StageMarker {
  if (marker.type === 'climb_top') {
    return { ...marker, cat: marker.cat && ['HC', '1', '2', '3', '4'].includes(marker.cat) ? marker.cat : '4' };
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
    if (marker.type === 'climb_top' && (marker.cat == null || !['HC', '1', '2', '3', '4'].includes(marker.cat))) {
      issues.push('climb_top braucht Kategorie HC oder 1-4.');
    }
  });

  [...segment.markers, ...segment.endMarkers].forEach((marker) => {
    if (marker.type === 'sprint_intermediate' && marker.cat != null && marker.cat !== 'Sprint') {
      issues.push('Sprintmarker erlaubt nur Kategorie Sprint.');
    }
    if (isFinishMarkerType(marker.type) && marker.cat != null) {
      issues.push('Finishmarker duerfen keine Kategorie haben.');
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
  let gainMeters = 0;
  let descentMeters = 0;
  let descentDistanceKm = 0;

  const commitClimb = (topIndex: number): void => {
    if (startIndex == null) return;

    const startPoint = waypoints[startIndex];
    const topPoint = waypoints[topIndex];
    const distanceKm = topPoint.kmMark - startPoint.kmMark;
    const avgGradient = distanceKm > 0 ? gainMeters / (distanceKm * 10) : 0;
    if (gainMeters >= STAGE_EDITOR_CLIMB_MIN_GAIN_METERS && avgGradient >= STAGE_EDITOR_CLIMB_MIN_AVG_GRADIENT) {
      climbs.push({
        startKm: roundStageEditorKm(startPoint.kmMark),
        endKm: roundStageEditorKm(topPoint.kmMark),
        distanceKm: roundStageEditorKm(distanceKm),
        gainMeters: Math.round(gainMeters),
        avgGradient: roundStageEditorOneDecimal(avgGradient),
        category: classifyStageEditorClimb(distanceKm, gainMeters, avgGradient),
        startIndex,
        topIndex,
        topElevation: Math.round(topPoint.elevation),
      });
    }

    startIndex = null;
    gainMeters = 0;
    descentMeters = 0;
    descentDistanceKm = 0;
  };

  for (let index = 1; index < waypoints.length; index += 1) {
    const previous = waypoints[index - 1];
    const current = waypoints[index];
    const deltaElevation = current.elevation - previous.elevation;
    const deltaDistanceKm = current.kmMark - previous.kmMark;

    if (startIndex == null && deltaElevation > 0) {
      startIndex = index - 1;
      gainMeters = deltaElevation;
      descentMeters = 0;
      descentDistanceKm = 0;
      continue;
    }

    if (startIndex == null) {
      continue;
    }

    if (deltaElevation >= 0) {
      gainMeters += deltaElevation;
      descentMeters = 0;
      descentDistanceKm = 0;
      continue;
    }

    descentMeters += Math.abs(deltaElevation);
    descentDistanceKm += deltaDistanceKm;
    if (descentMeters <= STAGE_EDITOR_BRIEF_DESCENT_TOLERANCE_METERS && descentDistanceKm <= STAGE_EDITOR_BRIEF_DESCENT_TOLERANCE_KM) {
      continue;
    }

    commitClimb(index - 1);
  }

  commitClimb(waypoints.length - 1);
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
  if (
    climb.distanceKm > STAGE_EDITOR_AUTO_HIGH_MOUNTAIN_MIN_DISTANCE_KM
    && climb.avgGradient > STAGE_EDITOR_AUTO_HIGH_MOUNTAIN_MIN_GRADIENT
    && climb.topElevation > STAGE_EDITOR_AUTO_HIGH_MOUNTAIN_MIN_TOP_METERS
  ) {
    return 'High_Mountain';
  }
  if (climb.distanceKm > STAGE_EDITOR_AUTO_MOUNTAIN_MIN_DISTANCE_KM && climb.avgGradient > STAGE_EDITOR_AUTO_MOUNTAIN_MIN_GRADIENT) {
    return 'Mountain';
  }
  if (climb.distanceKm > STAGE_EDITOR_AUTO_MEDIUM_MIN_DISTANCE_KM && climb.avgGradient > STAGE_EDITOR_AUTO_MEDIUM_MIN_GRADIENT) {
    return 'Medium_Mountain';
  }
  if (climb.distanceKm > STAGE_EDITOR_AUTO_HILL_MIN_DISTANCE_KM && climb.avgGradient > STAGE_EDITOR_AUTO_HILL_MIN_GRADIENT) {
    return 'Hill';
  }
  return null;
}

function applyAutomaticStageEditorTerrain(draft: StageEditorDraft): void {
  if (draft.segments.length === 0) return;

  draft.waypoints = buildStageEditorWaypointsFromSegments(draft.segments);
  const nextTerrains = draft.segments.map((segment) => (isManualStageEditorTerrain(segment.terrain) ? segment.terrain : 'Flat' as StageTerrain));
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
        <button type="button" class="btn btn-danger btn-xs" data-segment-action="remove-marker" data-marker-scope="${scope}" data-marker-index="${markerIndex}" data-segment-index="${segmentIndex}" ${canRemove ? '' : 'disabled'}>×</button>
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
  $('stage-editor-climbs').innerHTML = '<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>';
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

function setStageEditorDefaults(draft: StageEditorDraft): void {
  const profileSelect = $<HTMLSelectElement>('stage-editor-profile');
  profileSelect.innerHTML = stageProfileOptionsHtml(draft.suggestedProfile);
  profileSelect.value = draft.suggestedProfile;

  const detailsFileInput = $<HTMLInputElement>('stage-editor-details-file');
  if (!detailsFileInput.value.trim()) {
    detailsFileInput.value = `${slugifyFileName(draft.routeName)}.csv`;
  }

  const dateInput = $<HTMLInputElement>('stage-editor-date');
  if (!dateInput.value && state.gameState?.currentDate) {
    dateInput.value = state.gameState.currentDate;
  }
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
        issues.push(`Segment ${segmentIndex + 1}: Ungültige Marker-Kategorie ${marker.cat}.`);
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

  if (!Number.isInteger(stageId) || stageId <= 0) errors.push('Stage-ID fehlt oder ist ungültig.');
  if (!Number.isInteger(raceId) || raceId <= 0) errors.push('Race-ID fehlt oder ist ungültig.');
  if (!Number.isInteger(stageNumber) || stageNumber <= 0) errors.push('Etappennummer fehlt oder ist ungültig.');
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
    climbs.innerHTML = '<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>';
    emptyState.classList.remove('hidden');
    chart.innerHTML = renderStageEditorChart(null);
    tbody.innerHTML = `<tr><td colspan="${STAGE_EDITOR_TABLE_COLUMN_COUNT}" class="text-muted">Keine Segmente vorhanden.</td></tr>`;
    exportHint.textContent = 'Importiere zuerst eine Datei.';
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
    ? '<p class="text-muted">Keine relevanten Climb-Vorschläge erkannt.</p>'
    : draft.climbs.map((climb) => `
      <div class="stage-editor-climb">
        <strong>Kat. ${esc(climb.category)}</strong>
        <span>${formatKm(climb.startKm)} - ${formatKm(climb.endKm)}</span>
        <span>${climb.gainMeters} hm · ${climb.avgGradient.toFixed(1).replace('.', ',')}%</span>
      </div>`).join('');

  chart.innerHTML = renderStageEditorChart(draft);
  tbody.innerHTML = draft.segments.map((segment, index) => `
    <tr data-segment-index="${index}" class="${getStageEditorSegmentIssuesAt(draft, index).length > 0 ? 'stage-editor-segment-row-invalid' : ''}">
      <td><input type="number" step="0.01" min="0" value="${getStageEditorSegmentStartKm(draft, index).toFixed(2)}" readonly></td>
      <td><input type="number" step="1" value="${segment.startElevation}" data-field="startElevation" class="${index === 0 ? '' : 'stage-editor-input-readonly'}" ${index === 0 ? '' : 'readonly'}></td>
      <td><input type="number" step="0.01" min="0.2" value="${segment.lengthKm.toFixed(2)}" data-field="segmentLengthKm" class="${stageEditorFieldErrorClass(segment.lengthKm < STAGE_EDITOR_MIN_SEGMENT_KM)}"></td>
      <td><input type="number" step="0.1" value="${segment.gradientPercent.toFixed(1)}" data-field="segmentGradientPercent"></td>
      <td><select data-field="terrain">${terrainOptionsHtml(segment.terrain)}</select></td>
      <td><input type="number" step="1" min="1" max="10" value="${segment.techLevel}" data-field="techLevel" class="${stageEditorFieldErrorClass(segment.techLevel < 1 || segment.techLevel > 10)}"></td>
      <td><input type="number" step="1" min="1" max="10" value="${segment.windExp}" data-field="windExp" class="${stageEditorFieldErrorClass(segment.windExp < 1 || segment.windExp > 10)}"></td>
      <td>
        ${renderSegmentMarkerBlock(segment.markers, index, draft.segments.length, 'start')}
      </td>
      <td>
        ${renderSegmentMarkerBlock(segment.endMarkers, index, draft.segments.length, 'end')}
      </td>
      <td class="stage-editor-row-actions">
        <div class="text-muted">${getStageEditorSegmentEndElevation(segment)} m</div>
        ${renderStageEditorSegmentIssues(draft, index)}
        <button type="button" class="btn btn-secondary btn-xs" data-segment-action="insert" data-segment-index="${index}">+</button>
        ${index === draft.segments.length - 1 ? `<button type="button" class="btn btn-secondary btn-xs" data-segment-action="append" data-segment-index="${index}">+ Ende</button>` : ''}
        ${draft.segments.length > 1 ? `<button type="button" class="btn btn-danger btn-xs" data-segment-action="delete" data-segment-index="${index}">×</button>` : ''}
      </td>
    </tr>`).join('');

  exportButton.disabled = alertItems.length > 0;
  exportHint.textContent = alertItems.length > 0
    ? `${alertItems.length} Validierungshinweise vor dem Export.`
    : `Exportiert ${$<HTMLInputElement>('stage-editor-details-file').value || 'stage_details.csv'} und eine stages-Row.`;
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
    alert('Bitte zuerst eine GPX- oder TCX-Datei auswählen.');
    return;
  }

  $('stage-editor-file-hint').textContent = `${file.name} · ${(file.size / 1024).toFixed(1).replace('.', ',')} KB`;
  showLoading('Route wird importiert…');
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

async function onStageEditorExport(): Promise<void> {
  if (!state.stageEditorDraft) {
    alert('Es gibt noch keine importierte Strecke.');
    return;
  }

  const issues = [...getStageEditorIssues(state.stageEditorDraft), ...getStageEditorMetadataErrors()];
  if (issues.length > 0) {
    alert(`Export blockiert:\n\n${issues.join('\n')}`);
    renderStageEditor();
    return;
  }

  showLoading('CSV-Dateien werden erstellt…');
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
  return `<span class="rider-availability-marker" title="${esc(title)}" aria-label="${esc(title)}">✚</span>`;
}

function getRiderRoleName(rider: Rider): string {
  return rider.role?.name ?? (rider.roleId != null ? `Rolle ${rider.roleId}` : '–');
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
  return average == null ? '–' : average.toFixed(1).replace('.', ',');
}

function formatTeamAverage(teamId: number): string {
  const average = getTeamAverage(teamId);
  return average == null ? '–' : average.toFixed(1).replace('.', ',');
}

function compareStrings(left: string, right: string): number {
  return left.localeCompare(right, 'de', { sensitivity: 'base' });
}

function getSortIndicator(sortKey: TeamTableSortKey): string {
  if (state.teamTableSort.key !== sortKey) return '<span class="team-table-sort-indicator">↕</span>';
  return `<span class="team-table-sort-indicator team-table-sort-indicator-active">${state.teamTableSort.direction === 'asc' ? '↑' : '↓'}</span>`;
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
      case 'seasonPoints':
        comparison = (left.seasonPoints ?? 0) - (right.seasonPoints ?? 0);
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

function renderRacePrefs(raceIds: number[]): string {
  if (raceIds.length === 0) return '–';
  return raceIds.map(raceId => {
    const race = state.races.find(entry => entry.id === raceId);
    return race ? esc(race.name) : `Rennen ${raceId}`;
  }).join(', ');
}

function renderPeakDatesSummary(rider: Rider): string {
  const peakDates = rider.seasonFormPeakDates ?? [];
  if (peakDates.length === 0) {
    return '–';
  }
  return peakDates.join(' · ');
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
      <span><span class="text-muted">Peak:</span> ${esc((rider.seasonFormPeakDates ?? []).join(' · ') || '–')}</span>
    </div>
    <svg class="rider-form-sparkline" viewBox="0 0 ${width} ${height}" role="img" aria-label="Formverlauf Januar bis Oktober">
      <line class="rider-form-axis" x1="10" y1="100" x2="310" y2="100"></line>
      <line class="rider-form-axis" x1="10" y1="10" x2="10" y2="100"></line>
      ${peakMarkers}
      <path class="rider-form-line rider-form-line-history" d="${buildFormSparklinePath(historyPoints, width, height, -1, 5)}"></path>
      <path class="rider-form-line rider-form-line-projection" d="${buildFormSparklinePath(projectionPoints, width, height, -1, 5)}"></path>
      <text class="rider-form-axis-label" x="10" y="108">01.01.</text>
      <text class="rider-form-axis-label" x="286" y="108">31.10.</text>
      <text class="rider-form-axis-label" x="2" y="16">5,0</text>
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
      return 'Hügelspezialist';
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

function renderRiderInsightRow(rider: Rider): string {
  const riderTags = [
    rider.hasGrandTourTag ? 'Grand Tour' : null,
    rider.hasStageRaceTag ? 'Etappenrennen' : null,
    rider.hasOneDayClassicTag ? 'One Day Classic' : null,
  ].filter(Boolean).join(' · ');
  const riderSpecializations = [rider.specialization1, rider.specialization2, rider.specialization3]
    .filter((value): value is NonNullable<typeof value> => value != null)
    .map(getRiderSpecializationLabel)
    .join(' · ');

  return `
    <tr class="team-detail-expansion-row">
      <td colspan="${TEAM_TABLE_COLUMN_COUNT}">
        <div class="rider-insight-panel">
          <div class="rider-insight-group">
            <div class="rider-insight-title">Profil</div>
            <div><span class="text-muted">Rolle:</span> ${esc(getRiderRoleName(rider))}</div>
            <div><strong>${esc(getRiderSpecializationLabel(rider.riderType))}</strong></div>
            <div class="text-muted">${esc(riderSpecializations || 'Keine Spezialisierung')}</div>
            <div class="text-muted">Tags: ${esc(riderTags || 'Keine Tags')}</div>
            <div class="text-muted">Formhöhepunkte: ${esc(renderPeakDatesSummary(rider))}</div>
            <div class="text-muted">Skill-Development: ${rider.skillDevelopment ?? '–'}</div>
            <div class="text-muted">${rider.isStageRacer ? 'Etappenfahrer' : 'Kein Etappenfokus'} / ${rider.isOneDayRacer ? 'Eintagesfahrer' : 'Kein Eintagesfokus'}</div>
            <div class="text-muted">Vertragsende: ${rider.contractEndSeason ?? '–'}</div>
          </div>
          <div class="rider-insight-group">
            <div class="rider-insight-title">Vorlieben</div>
            <div><span class="text-muted">Fav:</span> ${renderRacePrefs(rider.favoriteRaces)}</div>
            <div><span class="text-muted">No:</span> ${renderRacePrefs(rider.nonFavoriteRaces)}</div>
          </div>
          <div class="rider-insight-group rider-form-debug-group">
            <div class="rider-insight-title">Form-Debug</div>
            ${renderRiderFormSparkline(rider)}
          </div>
        </div>
      </td>
    </tr>`;
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

function showLoading(msg = 'Lade…'): void {
  $('loading-msg').textContent = msg;
  $('loading-overlay').classList.remove('hidden');
}
function hideLoading(): void { $('loading-overlay').classList.add('hidden'); }

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
  if (name !== 'live-race') {
    raceSimView?.pause();
    return;
  }

  if (state.selectedRealtimeStageId != null && (!state.realtimeBootstrap || state.realtimeBootstrap.stage.id !== state.selectedRealtimeStageId)) {
    void openRealtimeStage(state.selectedRealtimeStageId, false);
  }
}

function getRaceSimView(): RaceSimView {
  if (!raceSimView) {
    raceSimView = new RaceSimView({
      layout: $('race-sim-layout'),
      emptyState: $('race-sim-empty'),
      profile: $('race-sim-profile'),
      messages: $('race-sim-messages-body'),
      favorites: $('race-sim-favorites-body'),
      sidebar: $('race-sim-sidebar-body'),
      controls: $('race-sim-controls'),
      meta: $('race-sim-stage-meta'),
    }, {
      onFinishRequested: (snapshot, bootstrap) => {
        const entries = snapshot.riders
          .map((rider) => ({
            riderId: rider.riderId,
            finishTimeSeconds: bootstrap.stage.profile === 'ITT' || bootstrap.stage.profile === 'TTT'
              ? rider.riderClockSeconds
              : rider.finishTimeSeconds,
            finishStatus: rider.finishStatus ?? 'finished',
            statusReason: rider.statusReason ?? null,
            photoFinishScore: rider.photoFinishScore,
          } satisfies RealtimeStageCommitEntry))
          .filter((entry) => entry.finishStatus === 'dnf' || entry.finishTimeSeconds != null);
        void completeRealtimeStage(
          bootstrap.stage.id,
          entries,
          snapshot.markerClassifications,
          snapshot.incidents,
          snapshot.riders.filter((rider) => rider.isBreakaway).map((rider) => rider.riderId),
        );
      },
    });
  }
  return raceSimView;
}

function formatPendingStageLabel(raceName: string, stageNumber: number, profile: StageProfile): string {
  return `${raceName} · Etappe ${stageNumber} · ${profile}`;
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
    ? `${payload.race.name} · Etappe ${payload.stage.stageNumber} · ${payload.stage.profile}`
    : `${payload.race.name} · ${payload.stage.profile}`;

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
            <p class="text-muted">${esc(teamEntry.team.abbreviation)} · ${esc(teamEntry.team.division ?? teamEntry.team.divisionName ?? 'Team')}</p>
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
            const subtitle = [riderOption.rider.role?.name ?? 'Ohne Rolle', `OVR ${Math.round(riderOption.rider.overallRating)}`].join(' · ');
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
  showLoading('Starterfeld wird übernommen...');
  try {
    const res = await api.applyRosterEditor(payload.stage.id, { riderIds: state.rosterEditorSelectedRiderIds });
    if (!res.success || !res.data) {
      showError('roster-editor-error', res.error ?? 'Starterfeld konnte nicht übernommen werden.');
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
    ? '<option value="">– Keine offenen Etappen –</option>'
    : pendingStages.map((stage) => `
      <option value="${stage.stageId}"${stage.stageId === state.selectedRealtimeStageId ? ' selected' : ''}>${esc(formatPendingStageLabel(stage.raceName, stage.stageNumber, stage.profile))}</option>
    `).join('');
  select.disabled = pendingStages.length === 0;

  const selectedStage = pendingStages.find((stage) => stage.stageId === state.selectedRealtimeStageId) ?? null;
  const simView = getRaceSimView();

  if (!selectedStage) {
    state.realtimeBootstrap = null;
    state.realtimeError = null;
    simView.clear('Heute gibt es keine offenen Etappen für die Live-Simulation.');
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
  return `${race.name} · ${stageLabel} · ${formatDate(stage.date)}`;
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
        ${esc(save.teamName)} · Saison ${save.currentSeason}
        ${save.lastSaved ? '· ' + formatDate(save.lastSaved) : ''}
      </p>
      <div class="save-actions">
        <button class="btn btn-primary btn-sm" data-save-action="load" data-filename="${esc(save.filename)}">Laden</button>
        <button class="btn btn-danger btn-sm" data-save-action="delete" data-filename="${esc(save.filename)}" data-career-name="${esc(save.careerName)}">Löschen</button>
      </div>
    </div>
  `).join('');
}

async function onLoadSave(filename: string): Promise<void> {
  showLoading('Karriere wird geladen…');
  const res = await api.loadSave(filename);
  hideLoading();
  if (!res.success) { alert('Fehler beim Laden: ' + res.error); return; }
  state.currentSave = res.data ?? null;
  await enterGameScreen();
}

async function onDeleteSave(filename: string, name: string): Promise<void> {
  if (!confirm(`Karriere "${name}" wirklich löschen?`)) return;
  showLoading('Löschen…');
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

  if (!confirm(`Wirklich alle ${saves.length} Karrieren löschen?`)) return;
  if (!confirm('Dieser Schritt löscht alle Spielstände dauerhaft. Wirklich fortfahren?')) return;

  showLoading('Alle Karrieren werden gelöscht…');
  try {
    for (const save of saves) {
      const deleteRes = await api.deleteSave(save.filename);
      if (!deleteRes.success) {
        alert(`Fehler beim Löschen von "${save.careerName}": ${deleteRes.error ?? 'Unbekannter Fehler'}`);
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
  select.innerHTML = '<option value="">Wird geladen…</option>';
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
    showError('new-career-error', 'Bitte Karriere-Name und Team auswählen.');
    return;
  }
  const teamId = Number(teamIdVal);
  const slug     = careerName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20);
  const filename = `${slug}_${Date.now()}.db`;
  hideError('new-career-error');
  showLoading('Neue Karriere wird erstellt…');
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
  showLoading('Spiel wird geladen…');
  try {
    await loadGameState();
    await loadRaces();
    await loadTeams();   // erst Teams laden
    await loadRoster();  // dann Kader (renderTeams hat dann vollst. Daten)
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
    if (view === 'teams') loadTeams(); // immer neu laden bei Nav-Klick
    if (view === 'live-race') renderRealtimeRaceView();
    if (view === 'results') renderResultsView();
    if (view === 'season-standings') void loadSeasonStandings(true);
  });
});

$<HTMLSelectElement>('teams-dropdown').addEventListener('change', (e) => {
  const val = (e.target as HTMLSelectElement).value;
  state.teamDetailsRiderId = null;
  renderTeamDetail(val ? Number(val) : null);
});

$('teams-detail').addEventListener('click', (event) => {
  const sortButton = (event.target as Element).closest<HTMLButtonElement>('button[data-team-sort]');
  if (sortButton) {
    const sortKey = sortButton.dataset['teamSort'] as TeamTableSortKey;
    if (state.teamTableSort.key === sortKey) {
      state.teamTableSort.direction = state.teamTableSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      state.teamTableSort = {
        key: sortKey,
        direction: sortKey === 'birthYear' || sortKey === 'age' || sortKey === 'overallRating' || sortKey === 'seasonPoints' ? 'desc' : 'asc',
      };
    }
    const selectedTeamId = Number($<HTMLSelectElement>('teams-dropdown').value);
    renderTeamDetail(Number.isFinite(selectedTeamId) ? selectedTeamId : null);
    return;
  }

  const infoButton = (event.target as Element).closest<HTMLButtonElement>('button[data-rider-info]');
  if (!infoButton) return;

  const riderId = Number(infoButton.dataset['riderInfo']);
  state.teamDetailsRiderId = state.teamDetailsRiderId === riderId ? null : riderId;
  const selectedTeamId = Number($<HTMLSelectElement>('teams-dropdown').value);
  renderTeamDetail(Number.isFinite(selectedTeamId) ? selectedTeamId : null);
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

  const button = (event.target as Element).closest<HTMLButtonElement>('button[data-simulate-stage]');
  if (!button) return;
  const stageId = Number(button.dataset['simulateStage']);
  if (!Number.isFinite(stageId)) return;
  void simulatePendingStage(stageId);
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
  state.stageResults = null;
  renderResultsView();
  if (state.selectedResultsStageId != null) {
    void loadStageResults(state.selectedResultsStageId, true);
  }
});

$('dashboard-races-tbody').addEventListener('click', (event) => {
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

$<HTMLSelectElement>('results-stage-select').addEventListener('change', (event) => {
  const stageId = Number((event.target as HTMLSelectElement).value);
  state.selectedResultsStageId = Number.isFinite(stageId) ? stageId : null;
  state.selectedResultTypeId = 1;
  state.selectedResultsMarkerKey = RESULTS_STAGE_OVERVIEW_KEY;
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

$('btn-stage-editor-export').addEventListener('click', () => {
  void onStageEditorExport();
});

$('stage-editor-file').addEventListener('change', (event) => {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null;
  $('stage-editor-file-hint').textContent = file
    ? `${file.name} · ${(file.size / 1024).toFixed(1).replace('.', ',')} KB`
    : 'Noch keine Datei ausgewählt.';
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
  renderDashboard();
  renderResultsView();
  renderRealtimeRaceView();
  renderSeasonStandingsView();
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
        ? `Etappe ${pendingStage.stageNumber} · ${pendingStage.profile} · ${formatDate(pendingStage.date)}`
        : `${pendingStage.profile} · ${formatDate(pendingStage.date)}`;
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
            <button class="btn btn-primary btn-sm" data-simulate-stage="${pendingStage.stageId}">Quick Sim</button>
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
  $('dashboard-career').textContent   = state.currentSave?.careerName ?? '–';
  $('dashboard-team').textContent     = playerTeam?.name ?? state.currentSave?.teamName ?? '–';
  $('dashboard-date').textContent     = state.gameState?.formattedDate ?? '–';
  $('dashboard-season').textContent   = state.gameState ? `Saison ${state.gameState.season}` : '–';
  $('dashboard-races-today').textContent = String(state.gameStatus?.pendingStages.length ?? state.gameState?.racesTodayCount ?? 0);
  renderDashboardRaces();
}

async function simulatePendingStage(stageId: number): Promise<void> {
  showLoading('Etappe wird simuliert...');
  try {
    const res = await api.quickSimStage(stageId);
    if (!res.success) {
      alert('Simulation fehlgeschlagen:\n' + (res.error ?? 'Unbekannter Fehler'));
      return;
    }

    const data = res.data as QuickSimResponse | undefined;
    state.selectedResultsRaceId = data?.raceId ?? state.selectedResultsRaceId;
    state.selectedResultsStageId = data?.stageId ?? stageId;
    state.selectedResultTypeId = 1;
    await loadStageResults(stageId, false);
    await loadGameState();
    await loadRaces();
    await loadRoster();
    if (state.seasonStandings != null) {
      await loadSeasonStandings(true);
    }
    activateView('results');
  } catch (error) {
    alert('Unerwarteter Fehler bei der Simulation: ' + (error as Error).message);
  } finally {
    hideLoading();
  }
}

async function completeRealtimeStage(
  stageId: number,
  entries: RealtimeStageCommitEntry[],
  markerClassifications: StageMarkerClassification[],
  incidents: PrecalculatedRaceIncident[],
  breakawayRiderIds: number[] = [],
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

    state.realtimeBreakawayRiderIdsByStageId[stageId] = breakawayRiderIds;

    const data = res.data as QuickSimResponse | undefined;
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

  state.stageResults = decorateStageResultsWithRealtimeBreakaways(res.data ?? null);
  if (state.stageResults) {
    state.selectedResultsRaceId = state.stageResults.raceId;
    state.selectedResultsStageId = state.stageResults.stageId;
    state.selectedResultTypeId = state.stageResults.classifications[0]?.resultTypeId ?? 1;
    state.selectedResultsMarkerKey = RESULTS_STAGE_OVERVIEW_KEY;
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

  raceSelect.innerHTML = '<option value="">– Rennen auswählen –</option>' + state.races
    .filter((race) => (race.stages?.length ?? 0) > 0)
    .map((race) => `<option value="${race.id}"${race.id === state.selectedResultsRaceId ? ' selected' : ''}>${esc(race.name)}</option>`)
    .join('');

  const selectedRace = findRaceById(state.selectedResultsRaceId);
  const stageOptions = selectedRace == null
    ? ''
    : (selectedRace.stages ?? [])
      .map((stage) => `<option value="${stage.id}"${stage.id === state.selectedResultsStageId ? ' selected' : ''}>${esc(formatResultsStageLabel(selectedRace, stage))}</option>`)
      .join('');
  stageSelect.innerHTML = '<option value="">– Etappe auswählen –</option>' + stageOptions;

  const selectedClassification = state.stageResults?.classifications.find(
    (classification) => classification.resultTypeId === state.selectedResultTypeId,
  ) ?? state.stageResults?.classifications[0] ?? null;
  if (selectedClassification) {
    state.selectedResultTypeId = selectedClassification.resultTypeId;
  }

  if (!state.stageResults || !selectedClassification) {
    const selectedStage = findStageById(state.selectedResultsStageId);
    meta.textContent = selectedStage
      ? `${selectedStage.race.name} · ${selectedStage.stage.profile} · ${formatDate(selectedStage.stage.date)}`
      : 'Noch keine Etappe ausgewählt.';
    tabs.innerHTML = '';
    markerTabs.innerHTML = '';
    markerTabs.classList.add('hidden');
    tbody.innerHTML = '';
    markerClassifications.innerHTML = '';
    markerClassifications.classList.add('hidden');
    table.classList.add('hidden');
    empty.classList.remove('hidden');
    empty.textContent = state.selectedResultsStageId != null
      ? 'Für diese Etappe liegen noch keine Ergebnisse vor.'
      : 'Noch keine Ergebnisse geladen.';
    return;
  }

  meta.textContent = `${state.stageResults.raceName} · Etappe ${state.stageResults.stageNumber} · ${state.stageResults.profile} · ${formatDate(state.stageResults.date)}`;
  const resultStage = findStageById(state.stageResults.stageId);
  const stageDistanceKm = resultStage?.stage.distanceKm ?? null;
  const isGcClassification = selectedClassification.resultTypeId === GC_RESULT_TYPE_ID;
  const isPointsLikeClassification = selectedClassification.resultTypeId === POINTS_RESULT_TYPE_ID
    || selectedClassification.resultTypeId === MOUNTAIN_RESULT_TYPE_ID;
  const previousGcRanks = new Map((state.stageResults.previousGcStandings ?? []).map((standing) => [standing.riderId, standing.rank] as const));
  tabs.innerHTML = state.stageResults.classifications.map((classification) => `
    <button
      type="button"
      class="results-type-btn${classification.resultTypeId === state.selectedResultTypeId ? ' active' : ''}"
      data-result-type-id="${classification.resultTypeId}"
    >${esc(classification.resultTypeName)}</button>
  `).join('');

  const stageMarkerClassifications = state.stageResults.markerClassifications ?? [];
  const showMarkerTabs = selectedClassification.resultTypeId === 1 && stageMarkerClassifications.length > 0;
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

  const showStageOverviewTable = !showMarkerTabs || state.selectedResultsMarkerKey === RESULTS_STAGE_OVERVIEW_KEY;

  if (headerRow && showStageOverviewTable) {
    headerRow.innerHTML = isGcClassification
      ? `
        <th>Platz</th>
        <th>GC</th>
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer / Team</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Zeit</th>
        <th>Rückstand</th>
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
        <th>Rückstand</th>
        <th>Punktewertung</th>
        <th>UCI Punkte</th>
      `;
  }

  tbody.innerHTML = showStageOverviewTable
    ? selectedClassification.rows.map((row) => {
      const participant = row.riderName ?? row.teamName;
      const teamName = row.riderName ? row.teamName : '—';
      const jerseyCell = renderResultsJerseyColumn(row.teamId, row.teamName);
      const participantCell = renderResultsParticipant(participant, true, row.isBreakaway === true);
      const flagCell = renderResultsFlagColumn(resolveRiderCountryCode(row.riderId));
      const showAverageSpeed = selectedClassification.resultTypeId === 1 && row.rank === 1 && row.timeSeconds != null && stageDistanceKm != null;
      const timeCell = row.timeSeconds != null
        ? `${formatRaceTime(row.timeSeconds)}${showAverageSpeed ? ` (${formatAverageSpeed(stageDistanceKm, row.timeSeconds)})` : ''}`
        : '–';
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
            <td>${row.points != null ? row.points : '–'}</td>
            <td>${row.uciPoints != null ? row.uciPoints : '–'}</td>
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
          <td>${row.points != null ? row.points : '–'}</td>
          <td>${row.uciPoints != null ? row.uciPoints : '–'}</td>
        </tr>`;
    }).join('')
    : '';

  markerClassifications.innerHTML = showMarkerTabs && selectedMarkerClassification
    ? renderSingleMarkerClassificationHtml(selectedMarkerClassification)
    : '';
  markerClassifications.classList.toggle('hidden', !showMarkerTabs || selectedMarkerClassification == null);

  empty.classList.add('hidden');
  table.classList.toggle('hidden', !showStageOverviewTable);
}

async function loadSeasonStandings(silent: boolean): Promise<void> {
  const res = await api.getSeasonStandings();
  if (!res.success) {
    state.seasonStandings = null;
    renderSeasonStandingsView();
    if (!silent && res.error) {
      alert('Saisonwertung konnte nicht geladen werden:\n' + res.error);
    }
    return;
  }

  state.seasonStandings = res.data ?? null;
  renderSeasonStandingsView();
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
    ? `Saison ${season} · Ergebnis- und Trikotpunkte kumuliert`
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
        : renderResultsParticipant(primary);
      const flagCell = renderResultsFlagColumn(row.countryCode);
      const secondary = state.selectedSeasonStandingScope === 'teams'
        ? (row.countryName ?? row.countryCode ?? '—')
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
  renderDashboard();
  renderResultsView();
}

function renderDashboardRaces(): void {
  const tbody = $('dashboard-races-tbody');
  const visibleRaces = state.races
    .filter(race => !state.gameState || race.endDate >= state.gameState.currentDate)
    .slice(0, 8);

  if (visibleRaces.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-muted">Keine kommenden Rennen.</td></tr>';
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
    const distance = totalDistanceKm != null ? formatKm(totalDistanceKm) : '–';
    const elevation = totalElevationGain != null ? formatElevationGain(totalElevationGain) : '–';
    return `
      <tr>
        <td>${formatRaceDateRange(race)}</td>
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
    .map(([profile, count]) => `${count}× ${profile}`)
    .join(' · ');
}

function buildDashboardStageProfileLabel(race: Race, stage: Stage): string {
  return `${race.name} · ${getStageDisplayName(stage)} · ${stage.profile}`;
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
  meta.textContent = `${formatRaceDateRange(race)} · ${race.country?.name ?? `Land ${race.countryId}`} · ${race.isStageRace ? `${race.numberOfStages} Etappen` : 'Eintagesrennen'} · ${formatKm(totalDistanceKm)} · ${formatElevationGain(totalElevationGain)} · ${stageTypeSummary}`;

  if (stages.length === 0) {
    body.innerHTML = '<div class="results-empty">Für dieses Rennen sind keine Etappen vorhanden.</div>';
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
            <th>Höhenmeter</th>
            <th>Profil</th>
          </tr>
        </thead>
        <tbody>
          ${stages.map((stage) => {
            return `
              <tr class="dashboard-race-stage-row">
                <td>${formatDate(stage.date)}</td>
                <td><strong>${esc(getStageDisplayName(stage))}</strong></td>
                <td>${esc(stage.profile)}</td>
                <td>${stage.distanceKm != null ? formatKm(stage.distanceKm) : '–'}</td>
                <td>${stage.elevationGainMeters != null ? formatElevationGain(stage.elevationGainMeters) : '–'}</td>
                <td>
                  <button
                    type="button"
                    class="dashboard-stage-profile-link"
                    data-dashboard-stage-profile-id="${stage.id}"
                    aria-label="Profil von ${esc(buildDashboardStageProfileLabel(race, stage))} öffnen"
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

async function openDashboardStageProfile(stageId: number): Promise<void> {
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
  $('stage-profile-title').textContent = `${location.race.name} · ${getStageDisplayName(location.stage)}`;
  $('stage-profile-meta').textContent = `${formatDate(location.stage.date)} · ${location.stage.profile} · ${location.stage.distanceKm != null ? formatKm(location.stage.distanceKm) : '–'} · ${location.stage.elevationGainMeters != null ? formatElevationGain(location.stage.elevationGainMeters) : '–'}`;
  renderStaticStageProfile($('stage-profile-view'), summary, location.stage.profile, buildDashboardStageProfileLabel(location.race, location.stage));
  showModal('stageProfile');
}

// ============================================================
//  Roster & Teams
// ============================================================

async function loadRoster(): Promise<void> {
  const res = await api.getRiders();
  if (!res.success) { console.error(res.error); return; }
  state.riders = res.data ?? [];
  renderTeams();
  renderDashboard();
  renderSeasonStandingsView();
}

async function loadTeams(): Promise<void> {
  const res = await api.getTeams();
  if (!res.success) {
    console.error('loadTeams Fehler:', res.error);
    $('teams-detail').innerHTML = `<p class="error-msg">Teams konnten nicht geladen werden: ${esc(res.error ?? 'Unbekannt')}</p>`;
    return;
  }
  state.teams = res.data ?? [];
  renderTeams();
  renderDashboard();
  renderResultsView();
}

function renderTeams(): void {
  const dropdown = $<HTMLSelectElement>('teams-dropdown');
  const currentVal = dropdown.value;
  dropdown.innerHTML = '<option value="">– Team auswählen –</option>' +
    state.teams.map(t =>
      `<option value="${t.id}"${String(t.id) === currentVal ? ' selected' : ''}>${esc(t.name)} (${esc(t.division ?? t.divisionName ?? '')}) · ${esc(t.abbreviation)}</option>`,
    ).join('');
  const selectedId = currentVal ? Number(currentVal) : null;
  renderTeamDetail(selectedId);
}

function renderTeamDetail(teamId: number | null): void {
  const detail = $('teams-detail');
  if (teamId === null) {
    detail.innerHTML = '<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswählen.</p>';
    return;
  }
  const team = state.teams.find(t => t.id === teamId);
  if (!team) { detail.innerHTML = ''; return; }
  const riders = sortTeamRiders(state.riders.filter(r => r.activeTeamId === teamId));
  const divBadge = team.division === 'U23' ? 'badge-u23' : 'badge-classics';
  detail.innerHTML = `
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${esc(team.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${divBadge}">${esc(team.division ?? team.divisionName ?? '')}</span>
          <span>${renderCountry(team.country, team.countryCode)}</span>
          <span>Kürzel: ${esc(team.abbreviation)} · Top 12 ${esc(formatTeamTopAverage(team.id))} (${esc(formatTeamAverage(team.id))})</span>
          ${team.isPlayerTeam ? '<span class="badge badge-live">Spielerteam</span>' : ''}
        </div>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${riders.length} Fahrer</span>
        <span class="text-muted">Sortierung: ${esc(state.teamTableSort.key === 'name' ? 'Nachname' : state.teamTableSort.key === 'countryCode' ? 'Country' : state.teamTableSort.key === 'birthYear' ? 'Jahrgang' : state.teamTableSort.key === 'age' ? 'Alter' : state.teamTableSort.key === 'overallRating' ? 'Gesamt' : state.teamTableSort.key === 'formBonus' ? 'Saisonform' : state.teamTableSort.key === 'raceFormBonus' ? 'Rennbonus' : state.teamTableSort.key === 'seasonPoints' ? 'Saisonpunkte' : state.teamTableSort.key === 'contractEndSeason' ? 'Vertragsende' : state.teamTableSort.key === 'roleName' ? 'Rolle' : state.teamTableSort.key === 'riderType' ? 'Profil' : TEAM_SKILL_TITLES[state.teamTableSort.key])} ${state.teamTableSort.direction === 'asc' ? 'aufsteigend' : 'absteigend'}</span>
      </div>
      <table class="data-table data-table-teams" style="margin-top:1rem">
        <thead><tr>
          ${TEAM_TABLE_COLUMNS.map(renderTeamTableHeader).join('')}
        </tr></thead>
        <tbody>
          ${riders.length === 0
            ? `<tr><td colspan="${TEAM_TABLE_COLUMN_COUNT}" class="text-muted">Keine Fahrer.</td></tr>`
            : riders.map(r => {
              const countryCode = getRiderCountryCode(r);
              const isExpanded = state.teamDetailsRiderId === r.id;
              return `
              <tr class="team-detail-row${isExpanded ? ' team-detail-row-expanded' : ''}">
                <td class="team-table-name-cell"><strong>${esc(formatRiderName(r))}</strong>${renderRiderAvailabilityMarker(r)}</td>
                <td class="team-table-flag-cell">${renderFlag(countryCode)}</td>
                <td class="team-table-code-cell">${esc(countryCode)}</td>
                <td>${r.birthYear}</td>
                <td>${r.age ?? '–'}</td>
                <td>${renderSkillValue(r.overallRating)}</td>
                <td>${renderSeasonFormValue(r.formBonus)}</td>
                <td>${renderRaceFormBonusValue(r.raceFormBonus)}</td>
                <td>${r.seasonPoints ?? 0}</td>
                <td>${r.contractEndSeason ?? '–'}</td>
                <td>${esc(getRiderRoleName(r))}</td>
                ${TEAM_SKILL_COLUMNS.map(column => `<td>${renderSkillValue(r.skills[column.key])}</td>`).join('')}
                <td class="team-table-info-cell">
                  <button
                    type="button"
                    class="info-toggle${isExpanded ? ' info-toggle-active' : ''}"
                    data-rider-info="${r.id}"
                    title="Profil und Vorlieben ${isExpanded ? 'ausblenden' : 'anzeigen'} · Peaks: ${esc(renderPeakDatesSummary(r))}"
                    aria-expanded="${isExpanded ? 'true' : 'false'}"
                    aria-label="Profil und Vorlieben ${isExpanded ? 'ausblenden' : 'anzeigen'}"
                  >i</button>
                </td>
              </tr>
              ${isExpanded ? renderRiderInsightRow(r) : ''}`;
            }).join('')}
        </tbody>
      </table>
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
