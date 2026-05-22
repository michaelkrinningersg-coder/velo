import type { RealtimeSimulationBootstrap, Rider, Team } from '../../../shared/types';
import type { RealtimeRiderSnapshot, SimulationSnapshot } from './SimulationEngine';
import { renderFlag } from './flags';
import { buildIntermediateSplitLabels } from './stageSummary';

interface LeaderboardColumn {
  label: string;
  displayLabel?: string;
  width: string;
  className?: string;
  sortKey?: string;
}

interface BootstrapSidebarData {
  splitLabels: string[];
  columns: LeaderboardColumn[];
  riderById: Map<number, Rider>;
  teamById: Map<number, Team>;
  teamAbbreviationById: Map<number, string>;
  teamNameById: Map<number, string>;
  gcByRiderId: Map<number, { rank: number; gapSeconds: number }>;
}

interface SidebarRenderCache {
  layoutKey: string;
  orderedRiderIds: number[];
  rowsByRiderId: Map<number, SidebarRowCache>;
  openDetailRiderId: number | null;
  openTeamId: number | null;
}

interface SidebarRowCache {
  row: HTMLElement;
  rankField: HTMLElement;
  nameButton: HTMLButtonElement;
  gapField: HTMLElement;
  clockField: HTMLElement;
  splitFields: HTMLElement[];
  effectiveSkillField: HTMLElement;
  gcRankField: HTMLElement;
  gcGapField: HTMLElement;
  gradientPercentField: HTMLElement;
  speedField: HTMLElement;
  detailPanel: HTMLElement;
  initialized: boolean;
  lastValues: Record<string, string | number | null>;
}

interface LeaderboardSortState {
  autoSort: boolean;
  manualSortKey: string | null;
  manualSortDirection: 'asc' | 'desc';
  frozenOrder: number[];
}

export interface SidebarRenderTelemetry {
  totalMs: number;
  prepMs: number;
  sortMs: number;
  layoutMs: number;
  createRowsMs: number;
  removeRowsMs: number;
  orderCheckMs: number;
  reorderMs: number;
  visibilityMs: number;
  updateRowsMs: number;
  finalizeMs: number;
  rowsTotal: number;
  rowsCreated: number;
  rowsRemoved: number;
  rowsUpdated: number;
  rowsSkippedInvisible: number;
  orderChanged: number;
}

interface TeamTimeTrialRow {
  team: Team;
  riders: RealtimeRiderSnapshot[];
  representative: RealtimeRiderSnapshot;
  teamClockSeconds: number | null;
  teamDistanceMeters: number;
  teamEffectiveSkill: number;
  teamSpeedMps: number;
  splitTimes: Record<string, number>;
  finishedRiders: number;
}

const bootstrapSidebarDataCache = new WeakMap<RealtimeSimulationBootstrap, BootstrapSidebarData>();
const sidebarRenderCache = new WeakMap<HTMLElement, SidebarRenderCache>();
const leaderboardSortStateCache = new WeakMap<HTMLElement, LeaderboardSortState>();
const numberFormatter = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function esc(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function formatGap(meters: number): string {
  if (meters <= 0) {
    return '—';
  }
  return `+${Math.round(meters)} m`;
}

function formatSigned(value: number): string {
  const formatted = numberFormatter.format(value);
  return value > 0 ? `+${formatted}` : formatted;
}

function formatFatigue(value: number): string {
  return value <= 0 ? '0,0' : `-${value.toFixed(1).replace('.', ',')}`;
}

function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

function formatClock(seconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function formatStartOffset(seconds: number): string {
  return `+${formatClock(seconds)}`;
}

function formatGcGap(seconds: number): string {
  if (seconds <= 0) {
    return '—';
  }

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (minutes > 0) {
    return `+${minutes}:${String(remainder).padStart(2, '0')}`;
  }
  return `+${remainder}s`;
}

function formatSpeed(speedMps: number): string {
  return `${(speedMps * 3.6).toFixed(1)} km/h`;
}

function formatGradientPercent(value: number): string {
  return `${formatSigned(value)}%`;
}

function formatKmValue(value: number): string {
  return `${value.toFixed(1).replace('.', ',')} km`;
}

function formatSegmentWindow(rider: RealtimeRiderSnapshot): string {
  return `${formatKmValue(rider.segmentStartKm)} - ${formatKmValue(rider.segmentEndKm)}`;
}

function formatSegmentElevationBand(rider: RealtimeRiderSnapshot): string {
  return `${Math.round(rider.segmentStartElevation)} - ${Math.round(rider.segmentEndElevation)} m`;
}

function labelValue(value: string): string {
  return value.replace(/_/g, ' ');
}

function formatTerrain(value: RealtimeRiderSnapshot['activeTerrain']): string {
  return labelValue(value);
}

function formatSkill(value: RealtimeRiderSnapshot['skillName']): string {
  return labelValue(value);
}

function getEffectiveSkillClassName(rider: RealtimeRiderSnapshot): string {
  if (rider.effectiveSkill > rider.baseSkill) {
    return 'race-sim-skill-effective-good';
  }
  if (rider.effectiveSkill < rider.baseSkill) {
    return 'race-sim-skill-effective-bad';
  }
  return 'race-sim-skill-effective-equal';
}

function getFormClassName(value: number): string {
  if (value > 0.5) {
    return 'race-sim-form-positive';
  }
  if (value < -0.5) {
    return 'race-sim-form-negative';
  }
  return '';
}

function getSlopeClassName(value: number): string {
  if (value > 10) {
    return 'race-sim-slope-climb-hard';
  }
  if (value > 3) {
    return 'race-sim-slope-climb-light';
  }
  if (value < -10) {
    return 'race-sim-slope-descent-hard';
  }
  if (value < -3) {
    return 'race-sim-slope-descent-light';
  }
  return '';
}

function getRiderCountryCode(rider: Rider): string {
  return rider.country?.code3 ?? rider.nationality;
}

function buildIntermediateLabels(bootstrap: RealtimeSimulationBootstrap): string[] {
  return buildIntermediateSplitLabels(bootstrap.stageSummary);
}

function buildMarkerRankLookup(snapshot: SimulationSnapshot): Map<string, Map<number, number>> {
  return new Map(snapshot.markerClassifications.map((classification) => [
    classification.markerLabel,
    new Map(classification.entries.map((entry) => [entry.riderId, entry.rank])),
  ]));
}

function resolveSplitSortValue(
  rider: RealtimeRiderSnapshot,
  label: string,
  stageProfile: RealtimeSimulationBootstrap['stage']['profile'],
  markerRanksByLabel: Map<string, Map<number, number>>,
): number | null {
  if (stageProfile !== 'ITT' && stageProfile !== 'TTT') {
    return markerRanksByLabel.get(label)?.get(rider.riderId) ?? null;
  }

  return rider.splitTimes[label] ?? null;
}

function buildColumns(bootstrap: RealtimeSimulationBootstrap, splitLabels: string[]): LeaderboardColumn[] {
  const columns: LeaderboardColumn[] = [
    { label: 'Pos', width: '50px', className: 'race-sim-col-rank', sortKey: 'gap' },
    { label: 'Flag', width: '40px', className: 'race-sim-col-flag' },
    { label: 'Fahrer', width: '196px', className: 'race-sim-col-name', sortKey: 'name' },
    { label: 'Jersey', displayLabel: 'Jer', width: '46px', className: 'race-sim-col-team-visual', sortKey: 'team' },
    { label: 'Team', width: '58px', className: 'race-sim-col-team', sortKey: 'team' },
    { label: 'Gap', width: '72px', sortKey: 'gap' },
    { label: 'Uhr', width: '96px', sortKey: 'clock' },
    ...splitLabels.map((splitLabel) => ({ label: splitLabel, width: '92px', className: 'race-sim-col-split', sortKey: `split:${splitLabel}` })),
    { label: 'Eff.', width: '74px', sortKey: 'effectiveSkill' },
    { label: 'GC', width: '52px', sortKey: 'gcRank' },
    { label: 'GC Gap', width: '70px', sortKey: 'gcGap' },
    { label: 'Aktive Segment-Steigung', displayLabel: 'Grad', width: '72px', sortKey: 'gradientPercent' },
    { label: 'Speed', width: '82px', sortKey: 'speed' },
  ];

  return columns;
}

function buildColumnsKey(columns: LeaderboardColumn[]): string {
  return columns.map((column) => `${column.label}:${column.width}:${column.className ?? ''}`).join('|');
}

function buildLayoutKey(columnsKey: string, sortState: LeaderboardSortState): string {
  return `${columnsKey}|${sortState.autoSort ? 'auto' : 'manual'}|${sortState.manualSortKey ?? ''}|${sortState.manualSortDirection}`;
}

function getBootstrapSidebarData(bootstrap: RealtimeSimulationBootstrap): BootstrapSidebarData {
  const cached = bootstrapSidebarDataCache.get(bootstrap);
  if (cached) {
    return cached;
  }

  const splitLabels = buildIntermediateLabels(bootstrap);
  const data: BootstrapSidebarData = {
    splitLabels,
    columns: buildColumns(bootstrap, splitLabels),
    riderById: new Map(bootstrap.riders.map((rider) => [rider.id, rider])),
    teamById: new Map((bootstrap.teams ?? []).map((team) => [team.id, team])),
    teamAbbreviationById: new Map((bootstrap.teams ?? []).map((team) => [team.id, team.abbreviation])),
    teamNameById: new Map((bootstrap.teams ?? []).map((team) => [team.id, team.name])),
    gcByRiderId: new Map((bootstrap.gcStandings ?? []).map((row) => [row.riderId, row])),
  };

  bootstrapSidebarDataCache.set(bootstrap, data);
  return data;
}

function applyLeaderboardLayout(container: HTMLElement, columns: LeaderboardColumn[]): string {
  const scrollContainer = container.parentElement;
  const header = scrollContainer?.querySelector<HTMLElement>('.race-sim-leaderboard-head');
  if (!scrollContainer || !header) {
    return '';
  }

  const toolbar = scrollContainer.querySelector<HTMLElement>('.race-sim-leaderboard-toolbar')
    ?? (() => {
      const nextToolbar = document.createElement('div');
      nextToolbar.className = 'race-sim-leaderboard-toolbar';
      header.insertAdjacentElement('beforebegin', nextToolbar);
      return nextToolbar;
    })();

  const sortState = getLeaderboardSortState(container);

  const columnsKey = buildColumnsKey(columns);
  const layoutKey = buildLayoutKey(columnsKey, sortState);
  const cached = sidebarRenderCache.get(container);

  if (cached?.layoutKey === layoutKey) {
    return layoutKey;
  }

  scrollContainer.style.setProperty('--race-sim-leaderboard-columns', columns.map((column) => column.width).join(' '));
  toolbar.innerHTML = `
    <button
      type="button"
      class="race-sim-leaderboard-auto-sort-btn${sortState.autoSort ? ' active' : ''}"
      data-race-sim-auto-sort="toggle"
      aria-pressed="${sortState.autoSort ? 'true' : 'false'}"
    >Auto-Sort ${sortState.autoSort ? 'AN' : 'AUS'}</button>`;
  header.innerHTML = columns.map((column) => renderHeaderCell(column, sortState)).join('');
  sidebarRenderCache.set(container, {
    layoutKey,
    orderedRiderIds: cached?.orderedRiderIds ?? [],
    rowsByRiderId: cached?.rowsByRiderId ?? new Map(),
    openDetailRiderId: cached?.openDetailRiderId ?? null,
    openTeamId: cached?.openTeamId ?? null,
  });
  return layoutKey;
}

function updateText(element: HTMLElement, value: string): void {
  if (element.textContent !== value) {
    element.textContent = value;
  }
}

function updateTitle(element: HTMLElement, value: string): void {
  if (element.title !== value) {
    element.title = value;
  }
}

function updateClassName(element: HTMLElement, value: string): void {
  if (element.className !== value) {
    element.className = value;
  }
}

function hasChanged(rowCache: SidebarRowCache, key: string, value: string | number | null): boolean {
  return rowCache.lastValues[key] !== value;
}

function commitValue(rowCache: SidebarRowCache, key: string, value: string | number | null): void {
  rowCache.lastValues[key] = value;
}

function getLeaderboardSortState(container: HTMLElement): LeaderboardSortState {
  const cached = leaderboardSortStateCache.get(container);
  if (cached) {
    return cached;
  }

  const initialState: LeaderboardSortState = {
    autoSort: true,
    manualSortKey: null,
    manualSortDirection: 'asc',
    frozenOrder: [],
  };
  leaderboardSortStateCache.set(container, initialState);
  return initialState;
}

function renderHeaderCell(column: LeaderboardColumn, sortState: LeaderboardSortState): string {
  const label = column.displayLabel ?? column.label;
  if (!column.sortKey) {
    return `<span class="${column.className ?? ''}" title="${esc(column.label)}">${esc(label)}</span>`;
  }

  const isActive = !sortState.autoSort && sortState.manualSortKey === column.sortKey;
  const indicator = isActive ? (sortState.manualSortDirection === 'asc' ? ' ▲' : ' ▼') : '';
  return `
    <button
      type="button"
      class="race-sim-leaderboard-sort-btn ${column.className ?? ''}${isActive ? ' race-sim-leaderboard-sort-active' : ''}${sortState.autoSort ? ' is-disabled' : ''}"
      title="${esc(sortState.autoSort ? `${column.label} · nur manuell sortierbar, wenn Auto-Sort aus ist` : `${column.label} sortieren`)}"
      data-race-sim-sort-key="${esc(column.sortKey)}"
      ${sortState.autoSort ? 'disabled' : ''}
    >${esc(label)}<span class="race-sim-leaderboard-sort-indicator">${esc(indicator)}</span></button>`;
}

function resolveDefaultSortDirection(sortKey: string): 'asc' | 'desc' {
  if (
    sortKey === 'name'
    || sortKey === 'team'
    || sortKey === 'terrainSkill'
    || sortKey === 'clock'
    || sortKey === 'gap'
    || sortKey === 'gcRank'
    || sortKey === 'gcGap'
    || sortKey.startsWith('split:')
  ) {
    return 'asc';
  }

  return 'desc';
}

function compareValues(left: string | number | null, right: string | number | null): number {
  if (left == null && right == null) return 0;
  if (left == null) return 1;
  if (right == null) return -1;
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }
  return String(left).localeCompare(String(right), 'de');
}

function buildRiderComparator(
  bootstrap: RealtimeSimulationBootstrap,
  splitLabels: string[],
  markerRanksByLabel: Map<string, Map<number, number>>,
  sortState: LeaderboardSortState,
  riderById: Map<number, Rider>,
  gcByRiderId: Map<number, { rank: number; gapSeconds: number }>,
  teamAbbreviationById: Map<number, string>,
): ((left: RealtimeRiderSnapshot, right: RealtimeRiderSnapshot) => number) | null {
  if (sortState.autoSort) {
    return (left, right) => (
      bootstrap.stage.profile === 'ITT'
        ? compareIttLeaderboard(left, right, splitLabels)
        : compareStandardLeaderboard(left, right)
    );
  }

  if (!sortState.manualSortKey) {
    return null;
  }

  const directionFactor = sortState.manualSortDirection === 'asc' ? 1 : -1;
  return (left, right) => {
    const leftSourceRider = riderById.get(left.riderId) ?? null;
    const rightSourceRider = riderById.get(right.riderId) ?? null;
    const leftValue = resolveSortValue(left, leftSourceRider, sortState.manualSortKey ?? '', bootstrap, markerRanksByLabel, gcByRiderId, teamAbbreviationById);
    const rightValue = resolveSortValue(right, rightSourceRider, sortState.manualSortKey ?? '', bootstrap, markerRanksByLabel, gcByRiderId, teamAbbreviationById);
    return (compareValues(leftValue, rightValue) * directionFactor) || left.riderId - right.riderId;
  };
}

function canReuseOrderedRiders(
  previousOrderedRiderIds: number[],
  ridersById: Map<number, RealtimeRiderSnapshot>,
  comparator: (left: RealtimeRiderSnapshot, right: RealtimeRiderSnapshot) => number,
): boolean {
  if (previousOrderedRiderIds.length !== ridersById.size) {
    return false;
  }

  let previousRider: RealtimeRiderSnapshot | null = null;
  for (const riderId of previousOrderedRiderIds) {
    const rider = ridersById.get(riderId);
    if (!rider) {
      return false;
    }

    if (previousRider && comparator(previousRider, rider) > 0) {
      return false;
    }
    previousRider = rider;
  }

  return true;
}

function resolveSortValue(
  rider: RealtimeRiderSnapshot,
  sourceRider: Rider | null,
  sortKey: string,
  bootstrap: RealtimeSimulationBootstrap,
  markerRanksByLabel: Map<string, Map<number, number>>,
  gcByRiderId: Map<number, { rank: number; gapSeconds: number }>,
  teamAbbreviationById: Map<number, string>,
): string | number | null {
  const gcStanding = bootstrap.race.isStageRace && bootstrap.stage.stageNumber > 1 ? gcByRiderId.get(rider.riderId) ?? null : null;
  switch (sortKey) {
    case 'name':
      return rider.riderName;
    case 'team':
      return sourceRider?.activeTeamId != null ? (teamAbbreviationById.get(sourceRider.activeTeamId) ?? '') : null;
    case 'gap':
      return rider.gapToLeaderMeters;
    case 'clock':
      return bootstrap.stage.profile === 'ITT'
        ? (rider.riderClockSeconds ?? (!rider.hasStarted ? rider.startOffsetSeconds : null))
        : rider.finishTimeSeconds;
    case 'terrainSkill':
      return `${rider.activeTerrain}-${rider.skillName}`;
    case 'baseSkill':
      return rider.baseSkill;
    case 'effectiveSkill':
      return rider.effectiveSkill;
    case 'teamBonus':
      return rider.teamGroupBonus;
    case 'seasonForm':
      return sourceRider?.formBonus ?? 0;
    case 'raceForm':
      return sourceRider?.raceFormBonus ?? 0;
    case 'fatigue':
      return sourceRider?.fatigueMalus ?? 0;
    case 'staminaPenalty':
      return rider.staminaPenalty;
    case 'elevationPenalty':
      return rider.elevationPenalty;
    case 'dailyForm':
      return rider.dailyForm;
    case 'microForm':
      return rider.microForm;
    case 'gcRank':
      return gcStanding?.rank ?? null;
    case 'gcGap':
      return gcStanding?.gapSeconds ?? null;
    case 'gradientPercent':
      return rider.gradientPercent;
    case 'gradientModifier':
      return rider.gradientModifier;
    case 'windModifier':
      return rider.windModifier;
    case 'draftModifier':
      return rider.draftModifier;
    case 'speed':
      return rider.currentSpeedMps;
    default:
      if (sortKey.startsWith('split:')) {
        return resolveSplitSortValue(rider, sortKey.slice('split:'.length), bootstrap.stage.profile, markerRanksByLabel);
      }
      return null;
  }
}

function sortRiders(
  riders: RealtimeRiderSnapshot[],
  bootstrap: RealtimeSimulationBootstrap,
  splitLabels: string[],
  markerRanksByLabel: Map<string, Map<number, number>>,
  sortState: LeaderboardSortState,
  riderById: Map<number, Rider>,
  gcByRiderId: Map<number, { rank: number; gapSeconds: number }>,
  teamAbbreviationById: Map<number, string>,
  previousOrderedRiderIds: number[],
): RealtimeRiderSnapshot[] {
  if (!sortState.manualSortKey) {
    if (sortState.autoSort) {
      const comparator = buildRiderComparator(bootstrap, splitLabels, markerRanksByLabel, sortState, riderById, gcByRiderId, teamAbbreviationById);
      if (!comparator) {
        return [...riders];
      }

      return [...riders].sort(comparator);
    }

    const frozenOrderIndexByRiderId = new Map(sortState.frozenOrder.map((riderId, index) => [riderId, index]));
    return [...riders].sort((left, right) => (
      (frozenOrderIndexByRiderId.get(left.riderId) ?? Number.MAX_SAFE_INTEGER)
      - (frozenOrderIndexByRiderId.get(right.riderId) ?? Number.MAX_SAFE_INTEGER)
      || left.riderId - right.riderId
    ));
  }

  const comparator = buildRiderComparator(bootstrap, splitLabels, markerRanksByLabel, sortState, riderById, gcByRiderId, teamAbbreviationById);
  if (!comparator) {
    return [...riders];
  }

  const ridersById = new Map(riders.map((rider) => [rider.riderId, rider]));
  if (canReuseOrderedRiders(previousOrderedRiderIds, ridersById, comparator)) {
    return previousOrderedRiderIds.map((riderId) => ridersById.get(riderId)).filter((rider): rider is RealtimeRiderSnapshot => rider != null);
  }

  return [...riders].sort(comparator);
}

export function handleRaceSimSidebarInteraction(container: HTMLElement, target: Element): boolean {
  const teamToggleButton = target.closest<HTMLButtonElement>('button[data-race-sim-ttt-team-toggle]');
  if (teamToggleButton) {
    const teamId = Number(teamToggleButton.dataset['raceSimTttTeamToggle']);
    if (!Number.isFinite(teamId)) {
      return false;
    }

    const cached = sidebarRenderCache.get(container);
    if (!cached) {
      return false;
    }

    cached.openTeamId = cached.openTeamId === teamId ? null : teamId;
    if (cached.openTeamId == null) {
      cached.openDetailRiderId = null;
    }
    return true;
  }

  const detailToggleButton = target.closest<HTMLButtonElement>('button[data-race-sim-rider-toggle]');
  if (detailToggleButton) {
    const riderId = Number(detailToggleButton.dataset['raceSimRiderToggle']);
    if (!Number.isFinite(riderId)) {
      return false;
    }

    const cached = sidebarRenderCache.get(container);
    if (!cached) {
      return false;
    }

    cached.openDetailRiderId = cached.openDetailRiderId === riderId ? null : riderId;
    return true;
  }

  const sortState = getLeaderboardSortState(container);
  const autoSortButton = target.closest<HTMLButtonElement>('button[data-race-sim-auto-sort]');
  if (autoSortButton) {
    sortState.autoSort = !sortState.autoSort;
    if (sortState.autoSort) {
      sortState.manualSortKey = null;
      sortState.frozenOrder = [];
    } else {
      sortState.manualSortKey = null;
      sortState.manualSortDirection = 'asc';
      sortState.frozenOrder = Array.from(container.querySelectorAll<HTMLElement>('[data-race-sim-rider-row]'))
        .map((row) => Number(row.dataset['raceSimRiderRow']))
        .filter((value) => Number.isFinite(value));
    }
    return true;
  }

  const sortButton = target.closest<HTMLButtonElement>('button[data-race-sim-sort-key]');
  if (!sortButton || sortState.autoSort) {
    return false;
  }

  const sortKey = sortButton.dataset['raceSimSortKey'];
  if (!sortKey) {
    return false;
  }

  if (sortState.manualSortKey === sortKey) {
    sortState.manualSortDirection = sortState.manualSortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.manualSortKey = sortKey;
    sortState.manualSortDirection = resolveDefaultSortDirection(sortKey);
  }
  sortState.frozenOrder = [];
  return true;
}

function hasAnySplitTime(rider: RealtimeRiderSnapshot, splitLabels: string[]): boolean {
  return splitLabels.some((label) => rider.splitTimes[label] != null);
}

function compareIttLeaderboard(left: RealtimeRiderSnapshot, right: RealtimeRiderSnapshot, splitLabels: string[]): number {
  if (left.finishTimeSeconds != null && right.finishTimeSeconds != null) {
    return (left.riderClockSeconds ?? left.finishTimeSeconds ?? Number.POSITIVE_INFINITY)
      - (right.riderClockSeconds ?? right.finishTimeSeconds ?? Number.POSITIVE_INFINITY)
      || left.riderId - right.riderId;
  }
  if (left.finishTimeSeconds != null) return -1;
  if (right.finishTimeSeconds != null) return 1;

  for (let index = splitLabels.length - 1; index >= 0; index -= 1) {
    const label = splitLabels[index];
    if (!label) {
      continue;
    }
    const leftTime = left.splitTimes[label];
    const rightTime = right.splitTimes[label];
    if (leftTime != null && rightTime != null && leftTime !== rightTime) {
      return leftTime - rightTime;
    }
    if (leftTime != null && rightTime == null) return -1;
    if (leftTime == null && rightTime != null) return 1;
  }

  const leftHasTime = hasAnySplitTime(left, splitLabels);
  const rightHasTime = hasAnySplitTime(right, splitLabels);
  if (leftHasTime !== rightHasTime) {
    return leftHasTime ? -1 : 1;
  }

  const leftClock = left.riderClockSeconds;
  const rightClock = right.riderClockSeconds;
  if (leftClock != null && rightClock != null && leftClock !== rightClock) {
    return leftClock - rightClock;
  }
  if (leftClock != null && rightClock == null) return -1;
  if (leftClock == null && rightClock != null) return 1;

  return left.startOffsetSeconds - right.startOffsetSeconds || left.riderId - right.riderId;
}

function compareStandardLeaderboard(left: RealtimeRiderSnapshot, right: RealtimeRiderSnapshot): number {
  if (left.isFinished !== right.isFinished) {
    return left.isFinished ? -1 : 1;
  }

  if (left.isFinished && right.isFinished) {
    return (left.finishTimeSeconds ?? Number.POSITIVE_INFINITY) - (right.finishTimeSeconds ?? Number.POSITIVE_INFINITY)
      || left.riderId - right.riderId;
  }

  return left.gapToLeaderMeters - right.gapToLeaderMeters || left.riderId - right.riderId;
}

function buildEffectiveSkillTitle(rider: RealtimeRiderSnapshot, sourceRider: Rider | null): string {
  const seasonForm = sourceRider?.formBonus ?? 0;
  const raceForm = sourceRider?.raceFormBonus ?? 0;
  const fatigue = sourceRider?.fatigueMalus ?? 0;
  const teamBonus = rider.teamGroupBonus;
  const scaledMicroForm = Math.max(-2.5, Math.min(2.5, rider.microForm * 2.5));
  const attackBonus = rider.isAttacking ? 10 : 0;
  const baseWithoutStamina = rider.baseSkill + attackBonus + seasonForm + raceForm + rider.dailyForm + rider.microForm + teamBonus - fatigue;
  const afterStamina = Math.max(0, baseWithoutStamina - rider.staminaPenalty);
  const staminaImpact = baseWithoutStamina - afterStamina;
  const heightImpact = afterStamina - rider.effectiveSkill;

  return [
    `Basis ${formatNumber(rider.baseSkill)}`,
    rider.isAttacking ? `+ Attacke ${formatNumber(attackBonus)}` : null,
    `+ S-Form ${formatNumber(seasonForm)}`,
    `+ R-Form ${formatNumber(raceForm)}`,
    `+ T-Form ${formatNumber(rider.dailyForm)}`,
    `+ Zufällige Form ${formatNumber(scaledMicroForm)} (skaliert)`,
    `+ Teambonus ${formatNumber(teamBonus)}`,
    `- Fatigue ${formatNumber(fatigue)}`,
    `- Stamina ${formatNumber(staminaImpact)}`,
    `- HM ${formatNumber(heightImpact)}`,
    `= Effektiv ${formatNumber(rider.effectiveSkill)}`,
  ].filter((line): line is string => line != null).join('\n');
}

function formatScaledMicroForm(value: number): string {
  return formatSigned(Math.max(-2.5, Math.min(2.5, value * 2.5)));
}

function formatDraftPackInfluence(rider: RealtimeRiderSnapshot): string {
  if (rider.draftNearbyRiderCount <= 0 || rider.draftModifier <= 1) {
    return '—';
  }

  return `${rider.draftNearbyRiderCount} · x${rider.draftPackFactor.toFixed(2).replace('.', ',')}`;
}

function renderRiderButton(rider: RealtimeRiderSnapshot, isOpen: boolean): string {
  const classNames = ['race-sim-row-name-btn'];
  if (rider.isAttacking) {
    classNames.push('is-attacking');
  }
  if (rider.isBreakaway) {
    classNames.push('is-breakaway');
  }
  return `<button type="button" class="${classNames.join(' ')}" data-race-sim-rider-toggle="${rider.riderId}" aria-expanded="${isOpen ? 'true' : 'false'}" title="${esc(rider.riderName)}">${esc(rider.riderName)}</button>`;
}

function renderTeamCell(sourceRider: Rider | null, teamAbbreviationById: Map<number, string>, teamNameById: Map<number, string>): string {
  if (sourceRider?.activeTeamId == null) {
    return '—';
  }

  const abbreviation = teamAbbreviationById.get(sourceRider.activeTeamId) ?? '—';
  const teamName = teamNameById.get(sourceRider.activeTeamId) ?? abbreviation;
  return `<span class="race-sim-team-code" title="${esc(teamName)}">${esc(abbreviation)}</span>`;
}

function resolveTeamJerseyAssetPath(teamId: number): string {
  return `/jersey/Jer_${teamId}.png`;
}

function renderTeamJerseyCell(sourceRider: Rider | null, teamById: Map<number, Team>, teamNameById: Map<number, string>): string {
  if (sourceRider?.activeTeamId == null) {
    return '—';
  }

  const team = teamById.get(sourceRider.activeTeamId);
  if (!team) {
    return '—';
  }

  const teamName = teamNameById.get(sourceRider.activeTeamId) ?? team.name;
  const jerseyPath = resolveTeamJerseyAssetPath(sourceRider.activeTeamId);
  return `
    <span class="race-sim-team-visual" title="${esc(teamName)}">
      <img
        class="race-sim-team-jersey-img"
        src="${esc(jerseyPath)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`;
}

function renderSplitCell(
  rider: RealtimeRiderSnapshot,
  label: string,
  stageProfile: RealtimeSimulationBootstrap['stage']['profile'],
  markerRanksByLabel: Map<string, Map<number, number>>,
): string {
  if (stageProfile !== 'ITT' && stageProfile !== 'TTT') {
    const rank = markerRanksByLabel.get(label)?.get(rider.riderId);
    return rank != null ? `${rank}.` : '—';
  }

  const value = rider.splitTimes[label];
  return value != null ? formatClock(value) : '—';
}

function renderDetailPanel(rider: RealtimeRiderSnapshot, sourceRider: Rider | null, gcStanding: { rank: number; gapSeconds: number } | null): string {
  const detailItems = [
    { label: 'Terrain / Skill', value: `${formatTerrain(rider.activeTerrain)} / ${formatSkill(rider.skillName)}` },
    { label: 'Aktiver Abschnitt', value: formatSegmentWindow(rider) },
    { label: 'Segmenthöhe', value: formatSegmentElevationBand(rider) },
    { label: 'Basis', value: formatNumber(rider.baseSkill) },
    { label: 'Team+', value: rider.teamGroupBonus > 0 ? `+${formatNumber(rider.teamGroupBonus)}` : '—' },
    { label: 'S-Form', value: formatSigned(sourceRider?.formBonus ?? 0) },
    { label: 'R-Form', value: formatSigned(sourceRider?.raceFormBonus ?? 0) },
    { label: 'Fatigue', value: formatFatigue(sourceRider?.fatigueMalus ?? 0) },
    { label: 'Stamina', value: formatNumber(rider.staminaPenalty) },
    { label: 'HM', value: formatNumber(rider.elevationPenalty) },
    { label: 'T-Form', value: formatSigned(rider.dailyForm) },
    { label: 'Zufall', value: formatScaledMicroForm(rider.microForm) },
    { label: 'M_grad', value: `x${rider.gradientModifier.toFixed(2).replace('.', ',')}` },
    { label: 'M_wind', value: `x${rider.windModifier.toFixed(2).replace('.', ',')}` },
    { label: 'Draft', value: `x${rider.draftModifier.toFixed(2).replace('.', ',')}` },
    { label: 'Draft Pack', value: formatDraftPackInfluence(rider) },
    { label: 'GC', value: gcStanding ? String(gcStanding.rank) : '—' },
    { label: 'GC Gap', value: gcStanding ? formatGcGap(gcStanding.gapSeconds) : '—' },
  ];

  return `
    <section class="race-sim-rider-detail-panel" aria-label="Fahrerdetails ${esc(rider.riderName)}">
      <div class="race-sim-rider-detail-head">
        <strong>${esc(rider.riderName)}</strong>
        <button type="button" class="race-sim-rider-detail-close" data-race-sim-rider-toggle="${rider.riderId}" aria-label="Details schließen">×</button>
      </div>
      <div class="race-sim-rider-detail-grid">
        ${detailItems.map((item) => `<div class="race-sim-rider-detail-item"><span>${esc(item.label)}</span><strong>${esc(item.value)}</strong></div>`).join('')}
      </div>
      <div class="race-sim-rider-detail-foot">${esc(rider.skillBreakdown || 'Primärskill ohne Mischgewichtung')}</div>
    </section>`;
}

function buildSidebarRowCache(
  rider: RealtimeRiderSnapshot,
  sourceRider: Rider | null,
  isOpen: boolean,
  splitLabels: string[],
  teamById: Map<number, Team>,
  teamAbbreviationById: Map<number, string>,
  teamNameById: Map<number, string>,
): SidebarRowCache {
  const row = document.createElement('article');
  row.dataset['raceSimRiderRow'] = String(rider.riderId);

  const grid = document.createElement('div');
  grid.className = 'race-sim-row-grid';
  row.appendChild(grid);

  const rankField = document.createElement('strong');
  rankField.className = 'race-sim-row-rank';
  rankField.textContent = '0.';
  grid.appendChild(rankField);

  const flagField = document.createElement('span');
  flagField.className = 'race-sim-row-flag';
  flagField.innerHTML = sourceRider ? renderFlag(getRiderCountryCode(sourceRider)) : '—';
  grid.appendChild(flagField);

  const nameField = document.createElement('span');
  nameField.className = 'race-sim-row-name';
  nameField.innerHTML = renderRiderButton(rider, isOpen);
  grid.appendChild(nameField);

  const nameButton = nameField.querySelector<HTMLButtonElement>('.race-sim-row-name-btn');
  if (!nameButton) {
    throw new Error('race-sim-row-name-btn not found');
  }

  const teamVisualField = document.createElement('span');
  teamVisualField.className = 'race-sim-row-team-visual';
  teamVisualField.innerHTML = renderTeamJerseyCell(sourceRider, teamById, teamNameById);
  grid.appendChild(teamVisualField);

  const teamField = document.createElement('strong');
  teamField.className = 'race-sim-row-team';
  teamField.innerHTML = renderTeamCell(sourceRider, teamAbbreviationById, teamNameById);
  grid.appendChild(teamField);

  const makeStrong = (className = ''): HTMLElement => {
    const element = document.createElement('strong');
    if (className) {
      element.className = className;
    }
    grid.appendChild(element);
    return element;
  };

  const gapField = makeStrong('race-sim-gap');
  const clockField = makeStrong();
  const splitFields = splitLabels.map(() => makeStrong());
  const effectiveSkillField = makeStrong('race-sim-cell-effective-skill');
  const gcRankField = makeStrong();
  const gcGapField = makeStrong();
  const gradientPercentField = makeStrong();
  const speedField = makeStrong();

  const detailPanel = document.createElement('div');
  detailPanel.className = 'race-sim-row-detail-popover hidden';
  row.appendChild(detailPanel);

  return {
    row,
    rankField,
    nameButton,
    gapField,
    clockField,
    splitFields,
    effectiveSkillField,
    gcRankField,
    gcGapField,
    gradientPercentField,
    speedField,
    detailPanel,
    initialized: false,
    lastValues: {},
  };
}

function updateSidebarRow(
  rowCache: SidebarRowCache,
  position: number,
  rider: RealtimeRiderSnapshot,
  sourceRider: Rider | null,
  isDetailOpen: boolean,
  splitLabels: string[],
  stageProfile: RealtimeSimulationBootstrap['stage']['profile'],
  markerRanksByLabel: Map<string, Map<number, number>>,
  raceIsStageRace: boolean,
  stageNumber: number,
  gcByRiderId: Map<number, { rank: number; gapSeconds: number }>,
): void {
  const seasonForm = sourceRider?.formBonus ?? 0;
  const raceForm = sourceRider?.raceFormBonus ?? 0;
  const gcStanding = raceIsStageRace && stageNumber > 1 ? gcByRiderId.get(rider.riderId) ?? null : null;
  const clockValue = stageProfile !== 'ITT' && stageProfile !== 'TTT'
    ? '—'
    : !rider.hasStarted
      ? formatStartOffset(rider.startOffsetSeconds)
      : rider.riderClockSeconds != null
        ? formatClock(rider.riderClockSeconds)
        : '—';
  updateClassName(rowCache.row, `race-sim-row${position === 1 ? ' race-sim-row-leader' : ''}${isDetailOpen ? ' race-sim-row-detail-open' : ''}`);
  updateText(rowCache.rankField, `${position}.`);
  updateText(rowCache.gapField, formatGap(rider.gapToLeaderMeters));
  updateText(rowCache.clockField, clockValue);
  rowCache.nameButton.setAttribute('aria-expanded', isDetailOpen ? 'true' : 'false');
  updateClassName(rowCache.nameButton, `race-sim-row-name-btn${rider.isAttacking ? ' is-attacking' : ''}${rider.isBreakaway ? ' is-breakaway' : ''}`);
  updateTitle(rowCache.nameButton, rider.isBreakaway
    ? `${rider.riderName} (Ausreißer)`
    : rider.isAttacking
      ? `${rider.riderName} (Attacke aktiv)`
      : rider.riderName);

  splitLabels.forEach((label, index) => {
    const splitField = rowCache.splitFields[index];
    if (!splitField) {
      return;
    }
    const splitValue = renderSplitCell(rider, label, stageProfile, markerRanksByLabel);
    updateText(splitField, splitValue);
    updateTitle(splitField, label);
  });

  if (hasChanged(rowCache, 'effectiveSkillValue', rider.effectiveSkill)) {
    updateText(rowCache.effectiveSkillField, formatNumber(rider.effectiveSkill));
    commitValue(rowCache, 'effectiveSkillValue', rider.effectiveSkill);
  }

  const effectiveSkillClass = `race-sim-cell-effective-skill ${getEffectiveSkillClassName(rider)}`;
  if (hasChanged(rowCache, 'effectiveSkillClass', effectiveSkillClass)) {
    updateClassName(rowCache.effectiveSkillField, effectiveSkillClass);
    commitValue(rowCache, 'effectiveSkillClass', effectiveSkillClass);
  }

  const effectiveSkillTitleKey = [
    rider.baseSkill,
    rider.effectiveSkill,
    rider.teamGroupBonus,
    seasonForm,
    raceForm,
    rider.dailyForm,
    rider.microForm,
    sourceRider?.fatigueMalus ?? 0,
    rider.staminaPenalty,
  ].join('|');
  if (hasChanged(rowCache, 'effectiveSkillTitleKey', effectiveSkillTitleKey)) {
    updateTitle(rowCache.effectiveSkillField, buildEffectiveSkillTitle(rider, sourceRider));
    commitValue(rowCache, 'effectiveSkillTitleKey', effectiveSkillTitleKey);
  }
  updateText(rowCache.gcRankField, gcStanding ? String(gcStanding.rank) : '—');
  updateText(rowCache.gcGapField, gcStanding ? formatGcGap(gcStanding.gapSeconds) : '—');
  updateText(rowCache.gradientPercentField, formatGradientPercent(rider.gradientPercent));
  updateClassName(rowCache.gradientPercentField, getSlopeClassName(rider.gradientPercent));
  updateTitle(rowCache.gradientPercentField, `${formatTerrain(rider.activeTerrain)} · ${formatSegmentWindow(rider)}`);
  updateText(rowCache.speedField, formatSpeed(rider.currentSpeedMps));

  const detailKey = [
    isDetailOpen ? 'open' : 'closed',
    rider.activeTerrain,
    rider.segmentStartKm,
    rider.segmentEndKm,
    rider.segmentStartElevation,
    rider.segmentEndElevation,
    rider.skillName,
    rider.baseSkill,
    rider.teamGroupBonus,
    seasonForm,
    raceForm,
    sourceRider?.fatigueMalus ?? 0,
    rider.staminaPenalty,
    rider.elevationPenalty,
    rider.dailyForm,
    rider.microForm,
    rider.gradientModifier,
    rider.windModifier,
    rider.draftModifier,
    rider.draftNearbyRiderCount,
    rider.draftPackFactor,
    gcStanding?.rank ?? '—',
    gcStanding?.gapSeconds ?? '—',
    rider.skillBreakdown,
  ].join('|');
  if (hasChanged(rowCache, 'detailKey', detailKey)) {
    rowCache.detailPanel.innerHTML = isDetailOpen ? renderDetailPanel(rider, sourceRider, gcStanding) : '';
    rowCache.detailPanel.classList.toggle('hidden', !isDetailOpen);
    commitValue(rowCache, 'detailKey', detailKey);
  }
  rowCache.detailPanel.classList.toggle('hidden', !isDetailOpen);
  rowCache.initialized = true;
}

function renderTeamTimeTrialButton(team: Team, isOpen: boolean): string {
  return `<button type="button" class="race-sim-row-name-btn" data-race-sim-ttt-team-toggle="${team.id}" aria-expanded="${isOpen ? 'true' : 'false'}" title="${esc(team.name)}">${esc(team.name)}</button>`;
}

function renderTeamJerseyCellByTeam(team: Team): string {
  const jerseyPath = resolveTeamJerseyAssetPath(team.id);
  return `
    <span class="race-sim-team-visual" title="${esc(team.name)}">
      <img
        class="race-sim-team-jersey-img"
        src="${esc(jerseyPath)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`;
}

function buildTeamTimeTrialRows(
  snapshot: SimulationSnapshot,
  bootstrap: RealtimeSimulationBootstrap,
  riderById: Map<number, Rider>,
): TeamTimeTrialRow[] {
  const ridersByTeamId = new Map<number, RealtimeRiderSnapshot[]>();

  for (const rider of snapshot.riders) {
    const sourceRider = riderById.get(rider.riderId);
    const teamId = sourceRider?.activeTeamId;
    if (teamId == null) {
      continue;
    }

    const bucket = ridersByTeamId.get(teamId) ?? [];
    bucket.push(rider);
    ridersByTeamId.set(teamId, bucket);
  }

  return bootstrap.teams
    .filter((team) => ridersByTeamId.has(team.id))
    .map((team) => {
      const riders = (ridersByTeamId.get(team.id) ?? [])
        .slice()
        .sort((left, right) => right.effectiveSkill - left.effectiveSkill || left.riderId - right.riderId);
      const representative = riders[0] ?? snapshot.riders[0];
      const topCount = Math.min(5, riders.length);
      const averageTopEffectiveSkill = riders
        .slice(0, topCount)
        .reduce((sum, rider) => sum + rider.effectiveSkill, 0) / Math.max(topCount, 1);
      const missingRiderMalus = Math.max(0, 8 - riders.length);

      return {
        team,
        riders,
        representative,
        teamClockSeconds: representative?.riderClockSeconds ?? null,
        teamDistanceMeters: representative?.distanceCoveredMeters ?? 0,
        teamEffectiveSkill: Math.max(1, averageTopEffectiveSkill - missingRiderMalus),
        teamSpeedMps: representative?.currentSpeedMps ?? 0,
        splitTimes: representative?.splitTimes ?? {},
        finishedRiders: riders.filter((rider) => rider.isFinished).length,
      } satisfies TeamTimeTrialRow;
    })
    .sort((left, right) => compareIttLeaderboard(left.representative, right.representative, buildIntermediateSplitLabels(bootstrap.stageSummary)) || left.team.id - right.team.id);
}

function renderTeamTimeTrialDetail(
  row: TeamTimeTrialRow,
  sidebarData: BootstrapSidebarData,
  raceIsStageRace: boolean,
  stageNumber: number,
  openDetailRiderId: number | null,
): string {
  return `
    <section class="race-sim-rider-detail-panel" aria-label="Teamdetails ${esc(row.team.name)}">
      <div class="race-sim-rider-detail-head">
        <strong>${esc(row.team.name)}</strong>
        <span>${row.finishedRiders}/${row.riders.length} im Ziel</span>
      </div>
      <div class="race-sim-rider-detail-grid">
        <div class="race-sim-rider-detail-item"><span>Tempo-Skill</span><strong>${esc(formatNumber(row.teamEffectiveSkill))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Speed</span><strong>${esc(formatSpeed(row.teamSpeedMps))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Teamuhr</span><strong>${esc(row.teamClockSeconds != null ? formatClock(row.teamClockSeconds) : '—')}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Distanz</span><strong>${esc(formatKmValue(row.teamDistanceMeters / 1000))}</strong></div>
      </div>
      <div class="race-sim-rider-detail-foot">Fahrer nach aktueller effektiver Fähigkeit sortiert</div>
      <div class="race-sim-ttt-team-detail-list">
        ${row.riders.map((rider) => {
          const sourceRider = sidebarData.riderById.get(rider.riderId) ?? null;
          const gcStanding = raceIsStageRace && stageNumber > 1 ? sidebarData.gcByRiderId.get(rider.riderId) ?? null : null;
          const isOpen = openDetailRiderId === rider.riderId;
          return `
            <article class="race-sim-ttt-team-rider">
              <div class="race-sim-ttt-team-rider-head">
                ${renderRiderButton(rider, isOpen)}
                <strong>${esc(formatNumber(rider.effectiveSkill))}</strong>
                <span>${esc(rider.riderClockSeconds != null ? formatClock(rider.riderClockSeconds) : '—')}</span>
              </div>
              ${isOpen ? renderDetailPanel(rider, sourceRider, gcStanding) : ''}
            </article>`;
        }).join('')}
      </div>
    </section>`;
}

function renderTeamTimeTrialSidebar(
  container: HTMLElement,
  snapshot: SimulationSnapshot,
  bootstrap: RealtimeSimulationBootstrap,
): SidebarRenderTelemetry {
  const totalStartMs = performance.now();
  const sidebarData = getBootstrapSidebarData(bootstrap);
  const splitLabels = sidebarData.splitLabels;
  const columns: LeaderboardColumn[] = [
    { label: 'Pos', width: '50px', className: 'race-sim-col-rank' },
    { label: 'Team', width: '220px', className: 'race-sim-col-name' },
    { label: 'Jer', width: '46px', className: 'race-sim-col-team-visual' },
    { label: 'Abr.', width: '58px', className: 'race-sim-col-team' },
    { label: 'Gap', width: '72px' },
    { label: 'Uhr', width: '96px' },
    ...splitLabels.map((splitLabel) => ({ label: splitLabel, width: '92px', className: 'race-sim-col-split' })),
    { label: 'Eff.', width: '74px' },
    { label: 'Speed', width: '82px' },
  ];
  const previousLayoutKey = sidebarRenderCache.get(container)?.layoutKey;
  const layoutKey = applyLeaderboardLayout(container, columns);
  const cached = sidebarRenderCache.get(container) ?? {
    layoutKey,
    orderedRiderIds: [],
    rowsByRiderId: new Map(),
    openDetailRiderId: null,
    openTeamId: null,
  };

  if (previousLayoutKey != null && previousLayoutKey !== layoutKey) {
    container.innerHTML = '';
  }

  const teamRows = buildTeamTimeTrialRows(snapshot, bootstrap, sidebarData.riderById);
  const leaderDistance = teamRows[0]?.teamDistanceMeters ?? 0;
  container.innerHTML = teamRows.map((row, index) => {
    const isOpen = cached.openTeamId === row.team.id;
    return `
      <article class="race-sim-row${index === 0 ? ' race-sim-row-leader' : ''}${isOpen ? ' race-sim-row-detail-open' : ''}">
        <div class="race-sim-row-grid">
          <strong class="race-sim-row-rank">${index + 1}.</strong>
          <span class="race-sim-row-name">${renderTeamTimeTrialButton(row.team, isOpen)}</span>
          <span class="race-sim-row-team-visual">${renderTeamJerseyCellByTeam(row.team)}</span>
          <strong class="race-sim-row-team"><span class="race-sim-team-code" title="${esc(row.team.name)}">${esc(row.team.abbreviation)}</span></strong>
          <strong class="race-sim-gap">${esc(formatGap(Math.max(0, leaderDistance - row.teamDistanceMeters)))}</strong>
          <strong>${esc(row.teamClockSeconds != null ? formatClock(row.teamClockSeconds) : formatStartOffset(row.representative.startOffsetSeconds))}</strong>
          ${splitLabels.map((label) => `<strong>${esc(row.splitTimes[label] != null ? formatClock(row.splitTimes[label] as number) : '—')}</strong>`).join('')}
          <strong class="race-sim-cell-effective-skill ${getEffectiveSkillClassName(row.representative)}">${esc(formatNumber(row.teamEffectiveSkill))}</strong>
          <strong>${esc(formatSpeed(row.teamSpeedMps))}</strong>
        </div>
        <div class="race-sim-row-detail-popover${isOpen ? '' : ' hidden'}">${isOpen ? renderTeamTimeTrialDetail(row, sidebarData, bootstrap.race.isStageRace, bootstrap.stage.stageNumber, cached.openDetailRiderId) : ''}</div>
      </article>`;
  }).join('');

  sidebarRenderCache.set(container, {
    layoutKey,
    orderedRiderIds: [],
    rowsByRiderId: new Map(),
    openDetailRiderId: cached.openDetailRiderId,
    openTeamId: cached.openTeamId,
  });

  const totalMs = performance.now() - totalStartMs;
  return {
    totalMs,
    prepMs: 0,
    sortMs: 0,
    layoutMs: 0,
    createRowsMs: 0,
    removeRowsMs: 0,
    orderCheckMs: 0,
    reorderMs: 0,
    visibilityMs: 0,
    updateRowsMs: 0,
    finalizeMs: 0,
    rowsTotal: teamRows.length,
    rowsCreated: teamRows.length,
    rowsRemoved: 0,
    rowsUpdated: teamRows.length,
    rowsSkippedInvisible: 0,
    orderChanged: 1,
  };
}

export function renderRaceSimSidebar(
  container: HTMLElement,
  snapshot: SimulationSnapshot,
  bootstrap: RealtimeSimulationBootstrap,
): SidebarRenderTelemetry {
  if (bootstrap.stage.profile === 'TTT') {
    return renderTeamTimeTrialSidebar(container, snapshot, bootstrap);
  }

  const totalStartMs = performance.now();
  const telemetry: SidebarRenderTelemetry = {
    totalMs: 0,
    prepMs: 0,
    sortMs: 0,
    layoutMs: 0,
    createRowsMs: 0,
    removeRowsMs: 0,
    orderCheckMs: 0,
    reorderMs: 0,
    visibilityMs: 0,
    updateRowsMs: 0,
    finalizeMs: 0,
    rowsTotal: snapshot.riders.length,
    rowsCreated: 0,
    rowsRemoved: 0,
    rowsUpdated: 0,
    rowsSkippedInvisible: 0,
    orderChanged: 0,
  };
  const prepStartMs = performance.now();
  const sidebarData = getBootstrapSidebarData(bootstrap);
  const { splitLabels } = sidebarData;
  const markerRanksByLabel = buildMarkerRankLookup(snapshot);
  const sortState = getLeaderboardSortState(container);
  const previousCache = sidebarRenderCache.get(container);
  telemetry.prepMs = performance.now() - prepStartMs;

  const sortStartMs = performance.now();
  const sortedRiders = sortRiders(
    snapshot.riders,
    bootstrap,
    splitLabels,
    markerRanksByLabel,
    sortState,
    sidebarData.riderById,
    sidebarData.gcByRiderId,
    sidebarData.teamAbbreviationById,
    previousCache?.orderedRiderIds ?? [],
  );
  telemetry.sortMs = performance.now() - sortStartMs;

  const previousLayoutKey = previousCache?.layoutKey;
  const layoutStartMs = performance.now();
  const layoutKey = applyLeaderboardLayout(container, sidebarData.columns);
  telemetry.layoutMs = performance.now() - layoutStartMs;
  const cached = sidebarRenderCache.get(container) ?? {
    layoutKey,
    orderedRiderIds: [],
    rowsByRiderId: new Map(),
    openDetailRiderId: null,
    openTeamId: null,
  };

  if (previousLayoutKey != null && previousLayoutKey !== layoutKey) {
    container.innerHTML = '';
    cached.rowsByRiderId.clear();
    cached.orderedRiderIds = [];
  }

  const nextRiderIds = sortedRiders.map((rider) => rider.riderId);
  const activeRiderIdSet = new Set(nextRiderIds);

  const removeRowsStartMs = performance.now();
  for (const [riderId, rowCache] of cached.rowsByRiderId) {
    if (activeRiderIdSet.has(riderId)) {
      continue;
    }
    rowCache.row.remove();
    cached.rowsByRiderId.delete(riderId);
    telemetry.rowsRemoved += 1;
  }
  telemetry.removeRowsMs = performance.now() - removeRowsStartMs;

  const createRowsStartMs = performance.now();
  for (let index = 0; index < sortedRiders.length; index += 1) {
    const rider = sortedRiders[index];
    const sourceRider = sidebarData.riderById.get(rider.riderId) ?? null;
    let rowCache = cached.rowsByRiderId.get(rider.riderId);
    if (!rowCache) {
      rowCache = buildSidebarRowCache(
        rider,
        sourceRider,
        cached.openDetailRiderId === rider.riderId,
        splitLabels,
        sidebarData.teamById,
        sidebarData.teamAbbreviationById,
        sidebarData.teamNameById,
      );
      cached.rowsByRiderId.set(rider.riderId, rowCache);
      telemetry.rowsCreated += 1;
    }
  }
  telemetry.createRowsMs = performance.now() - createRowsStartMs;

  const orderCheckStartMs = performance.now();
  const isSameOrder = cached.orderedRiderIds.length === nextRiderIds.length
    && cached.orderedRiderIds.every((riderId, index) => riderId === nextRiderIds[index]);
  telemetry.orderCheckMs = performance.now() - orderCheckStartMs;

  const reorderStartMs = performance.now();
  if (!isSameOrder) {
    const fragment = document.createDocumentFragment();
    for (const riderId of nextRiderIds) {
      const rowCache = cached.rowsByRiderId.get(riderId);
      if (rowCache) {
        fragment.appendChild(rowCache.row);
      }
    }
    container.replaceChildren(fragment);
    telemetry.orderChanged = 1;
  }
  telemetry.reorderMs = performance.now() - reorderStartMs;

  for (let index = 0; index < sortedRiders.length; index += 1) {
    const rider = sortedRiders[index];
    const rowCache = cached.rowsByRiderId.get(rider.riderId);
    const sourceRider = sidebarData.riderById.get(rider.riderId) ?? null;
    if (!rowCache) {
      continue;
    }

    const updateStartMs = performance.now();
    updateSidebarRow(
      rowCache,
      index + 1,
      rider,
      sourceRider,
      cached.openDetailRiderId === rider.riderId,
      splitLabels,
      bootstrap.stage.profile,
      markerRanksByLabel,
      bootstrap.race.isStageRace,
      bootstrap.stage.stageNumber,
      sidebarData.gcByRiderId,
    );
    telemetry.updateRowsMs += performance.now() - updateStartMs;
    telemetry.rowsUpdated += 1;
  }

  sidebarRenderCache.set(container, {
    layoutKey,
    orderedRiderIds: nextRiderIds,
    rowsByRiderId: cached.rowsByRiderId,
    openDetailRiderId: cached.openDetailRiderId,
    openTeamId: cached.openTeamId,
  });
  telemetry.finalizeMs = performance.now() - (totalStartMs + telemetry.prepMs + telemetry.sortMs + telemetry.layoutMs + telemetry.removeRowsMs + telemetry.createRowsMs + telemetry.orderCheckMs + telemetry.reorderMs + telemetry.visibilityMs + telemetry.updateRowsMs);

  telemetry.totalMs = performance.now() - totalStartMs;
  telemetry.finalizeMs = Math.max(0, telemetry.totalMs - telemetry.prepMs - telemetry.sortMs - telemetry.layoutMs - telemetry.removeRowsMs - telemetry.createRowsMs - telemetry.orderCheckMs - telemetry.reorderMs - telemetry.visibilityMs - telemetry.updateRowsMs);
  return telemetry;
}
