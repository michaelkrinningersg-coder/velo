import type { RealtimeSimulationBootstrap, Rider, Team } from '../../../shared/types';
import type { RealtimeRiderSnapshot, SimulationSnapshot } from './SimulationEngine';
import { renderFlag } from './flags';

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
}

interface SidebarRowCache {
  row: HTMLElement;
  rankField: HTMLElement;
  gapField: HTMLElement;
  clockField: HTMLElement;
  splitFields: HTMLElement[];
  terrainSkillField: HTMLElement;
  baseSkillField: HTMLElement;
  effectiveSkillField: HTMLElement;
  teamBonusField: HTMLElement;
  seasonFormField: HTMLElement;
  raceFormField: HTMLElement;
  fatigueField: HTMLElement;
  staminaField: HTMLElement;
  elevationField: HTMLElement;
  dailyFormField: HTMLElement;
  microFormField: HTMLElement;
  gcRankField: HTMLElement;
  gcGapField: HTMLElement;
  gradientPercentField: HTMLElement;
  gradientModifierField: HTMLElement;
  windModifierField: HTMLElement;
  draftModifierField: HTMLElement;
  speedField: HTMLElement;
  initialized: boolean;
  lastValues: Record<string, string | number | null>;
}

interface LeaderboardSortState {
  autoSort: boolean;
  manualSortKey: string | null;
  manualSortDirection: 'asc' | 'desc';
  frozenOrder: number[];
}

const bootstrapSidebarDataCache = new WeakMap<RealtimeSimulationBootstrap, BootstrapSidebarData>();
const sidebarRenderCache = new WeakMap<HTMLElement, SidebarRenderCache>();
const leaderboardSortStateCache = new WeakMap<HTMLElement, LeaderboardSortState>();
const SIDEBAR_VISIBILITY_BUFFER_PX = 320;
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
  return bootstrap.stageSummary.points
    .flatMap((point, pointIndex) => point.markers
      .filter((marker) => marker.type === 'sprint_intermediate')
      .map((marker, markerIndex) => marker.name ?? `SZ ${pointIndex + markerIndex + 1}`));
}

function buildColumns(bootstrap: RealtimeSimulationBootstrap, splitLabels: string[]): LeaderboardColumn[] {
  const columns: LeaderboardColumn[] = [
    { label: 'Fahrer', width: '228px', className: 'race-sim-col-name', sortKey: 'name' },
    { label: 'Teamfarben', displayLabel: '//', width: '46px', className: 'race-sim-col-team-visual', sortKey: 'team' },
    { label: 'Team', width: '58px', className: 'race-sim-col-team', sortKey: 'team' },
    { label: 'Gap', width: '72px', sortKey: 'gap' },
    { label: 'Uhr', width: '96px', sortKey: 'clock' },
  ];

  if (bootstrap.stage.profile === 'ITT') {
    for (const splitLabel of splitLabels) {
      columns.push({ label: splitLabel, width: '92px', className: 'race-sim-col-split', sortKey: `split:${splitLabel}` });
    }
  }

  columns.push(
    { label: 'Terrain / Skill', width: '140px', sortKey: 'terrainSkill' },
    { label: 'Basis', width: '68px', sortKey: 'baseSkill' },
    { label: 'Eff.', width: '74px', sortKey: 'effectiveSkill' },
    { label: 'Team+', width: '64px', sortKey: 'teamBonus' },
    { label: 'S-Form', width: '64px', sortKey: 'seasonForm' },
    { label: 'R-Form', width: '64px', sortKey: 'raceForm' },
    { label: 'Fatigue', width: '70px', sortKey: 'fatigue' },
    { label: 'Stamina', width: '72px', sortKey: 'staminaPenalty' },
    { label: 'HM', width: '56px', sortKey: 'elevationPenalty' },
    { label: 'T-Form', width: '66px', sortKey: 'dailyForm' },
    { label: 'Zufall', width: '66px', sortKey: 'microForm' },
    { label: 'GC', width: '52px', sortKey: 'gcRank' },
    { label: 'GC Gap', width: '70px', sortKey: 'gcGap' },
    { label: 'Steigung', width: '72px', sortKey: 'gradientPercent' },
    { label: 'M_grad', width: '66px', sortKey: 'gradientModifier' },
    { label: 'M_wind', width: '66px', sortKey: 'windModifier' },
    { label: 'Draft', width: '60px', sortKey: 'draftModifier' },
    { label: 'Speed', width: '82px', sortKey: 'speed' },
  );

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
    const leftValue = resolveSortValue(left, leftSourceRider, sortState.manualSortKey ?? '', bootstrap, gcByRiderId, teamAbbreviationById);
    const rightValue = resolveSortValue(right, rightSourceRider, sortState.manualSortKey ?? '', bootstrap, gcByRiderId, teamAbbreviationById);
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
        return rider.splitTimes[sortKey.slice('split:'.length)] ?? null;
      }
      return null;
  }
}

function sortRiders(
  riders: RealtimeRiderSnapshot[],
  bootstrap: RealtimeSimulationBootstrap,
  splitLabels: string[],
  sortState: LeaderboardSortState,
  riderById: Map<number, Rider>,
  gcByRiderId: Map<number, { rank: number; gapSeconds: number }>,
  teamAbbreviationById: Map<number, string>,
  previousOrderedRiderIds: number[],
): RealtimeRiderSnapshot[] {
  if (!sortState.manualSortKey) {
    if (sortState.autoSort) {
      const comparator = buildRiderComparator(bootstrap, splitLabels, sortState, riderById, gcByRiderId, teamAbbreviationById);
      if (!comparator) {
        return [...riders];
      }

      const ridersById = new Map(riders.map((rider) => [rider.riderId, rider]));
      if (canReuseOrderedRiders(previousOrderedRiderIds, ridersById, comparator)) {
        return previousOrderedRiderIds.map((riderId) => ridersById.get(riderId)).filter((rider): rider is RealtimeRiderSnapshot => rider != null);
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

  const comparator = buildRiderComparator(bootstrap, splitLabels, sortState, riderById, gcByRiderId, teamAbbreviationById);
  if (!comparator) {
    return [...riders];
  }

  const ridersById = new Map(riders.map((rider) => [rider.riderId, rider]));
  if (canReuseOrderedRiders(previousOrderedRiderIds, ridersById, comparator)) {
    return previousOrderedRiderIds.map((riderId) => ridersById.get(riderId)).filter((rider): rider is RealtimeRiderSnapshot => rider != null);
  }

  return [...riders].sort(comparator);
}

function isRowVisible(row: HTMLElement, scrollContainer: HTMLElement): boolean {
  const viewTop = scrollContainer.scrollTop - SIDEBAR_VISIBILITY_BUFFER_PX;
  const viewBottom = scrollContainer.scrollTop + scrollContainer.clientHeight + SIDEBAR_VISIBILITY_BUFFER_PX;
  const rowTop = row.offsetTop;
  const rowBottom = rowTop + row.offsetHeight;
  return rowBottom >= viewTop && rowTop <= viewBottom;
}

export function handleRaceSimSidebarInteraction(container: HTMLElement, target: Element): boolean {
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

  return left.startOffsetSeconds - right.startOffsetSeconds || left.riderId - right.riderId;
}

function compareStandardLeaderboard(left: RealtimeRiderSnapshot, right: RealtimeRiderSnapshot): number {
  if (left.isFinished !== right.isFinished) {
    return left.isFinished ? 1 : -1;
  }

  if (left.isFinished && right.isFinished) {
    return (left.finishTimeSeconds ?? Number.POSITIVE_INFINITY) - (right.finishTimeSeconds ?? Number.POSITIVE_INFINITY)
      || left.riderId - right.riderId;
  }

  return right.distanceCoveredMeters - left.distanceCoveredMeters || left.riderId - right.riderId;
}

function buildEffectiveSkillTitle(rider: RealtimeRiderSnapshot, sourceRider: Rider | null): string {
  const seasonForm = sourceRider?.formBonus ?? 0;
  const raceForm = sourceRider?.raceFormBonus ?? 0;
  const fatigue = sourceRider?.fatigueMalus ?? 0;
  const teamBonus = rider.teamGroupBonus;
  const baseWithoutStamina = rider.baseSkill + seasonForm + raceForm + rider.dailyForm + rider.microForm + teamBonus - fatigue;
  const afterStamina = Math.max(0, baseWithoutStamina - rider.staminaPenalty);
  const staminaImpact = baseWithoutStamina - afterStamina;
  const heightImpact = afterStamina - rider.effectiveSkill;

  return [
    `Basis ${formatNumber(rider.baseSkill)}`,
    `+ S-Form ${formatNumber(seasonForm)}`,
    `+ R-Form ${formatNumber(raceForm)}`,
    `+ T-Form ${formatNumber(rider.dailyForm)}`,
    `+ Zufällige Form ${formatNumber(rider.microForm)}`,
    `+ Teambonus ${formatNumber(teamBonus)}`,
    `- Fatigue ${formatNumber(fatigue)}`,
    `- Stamina ${formatNumber(staminaImpact)}`,
    `- HM ${formatNumber(heightImpact)}`,
    `= Effektiv ${formatNumber(rider.effectiveSkill)}`,
  ].join('\n');
}

function renderRiderLabel(position: number, rider: RealtimeRiderSnapshot, sourceRider: Rider | null): string {
  const flag = sourceRider ? renderFlag(getRiderCountryCode(sourceRider)) : '';
  return `<span class="race-sim-row-rank">${position}.</span>${flag}<span class="race-sim-row-main-name" title="${esc(rider.riderName)}">${esc(rider.riderName)}</span>`;
}

function renderTeamCell(sourceRider: Rider | null, teamAbbreviationById: Map<number, string>, teamNameById: Map<number, string>): string {
  if (sourceRider?.activeTeamId == null) {
    return '—';
  }

  const abbreviation = teamAbbreviationById.get(sourceRider.activeTeamId) ?? '—';
  const teamName = teamNameById.get(sourceRider.activeTeamId) ?? abbreviation;
  return `<span class="race-sim-team-code" title="${esc(teamName)}">${esc(abbreviation)}</span>`;
}

function renderTeamColorsCell(sourceRider: Rider | null, teamById: Map<number, Team>, teamNameById: Map<number, string>): string {
  if (sourceRider?.activeTeamId == null) {
    return '—';
  }

  const team = teamById.get(sourceRider.activeTeamId);
  if (!team) {
    return '—';
  }

  const teamName = teamNameById.get(sourceRider.activeTeamId) ?? team.name;
  return `
    <span class="race-sim-team-visual" title="${esc(teamName)}">
      <span class="race-sim-team-visual-bar" style="background:${esc(team.colorPrimary)}"></span>
      <span class="race-sim-team-visual-gap"></span>
      <span class="race-sim-team-visual-bar" style="background:${esc(team.colorSecondary)}"></span>
    </span>`;
}

function renderSplitCell(rider: RealtimeRiderSnapshot, label: string): string {
  const value = rider.splitTimes[label];
  return value != null ? formatClock(value) : '—';
}

function buildSidebarRowCache(
  rider: RealtimeRiderSnapshot,
  sourceRider: Rider | null,
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

  const nameField = document.createElement('span');
  nameField.className = 'race-sim-row-name';
  nameField.innerHTML = renderRiderLabel(0, rider, sourceRider);
  grid.appendChild(nameField);

  const rankField = nameField.querySelector<HTMLElement>('.race-sim-row-rank');
  if (!rankField) {
    throw new Error('race-sim-row-rank not found');
  }

  const teamVisualField = document.createElement('span');
  teamVisualField.className = 'race-sim-row-team-visual';
  teamVisualField.innerHTML = renderTeamColorsCell(sourceRider, teamById, teamNameById);
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
  const terrainSkillField = makeStrong();
  const baseSkillField = makeStrong('race-sim-cell-base-skill');
  const effectiveSkillField = makeStrong('race-sim-cell-effective-skill');
  const teamBonusField = makeStrong();
  const seasonFormField = makeStrong();
  const raceFormField = makeStrong();
  const fatigueField = makeStrong();
  const staminaField = makeStrong();
  const elevationField = makeStrong();
  const dailyFormField = makeStrong();
  const microFormField = makeStrong();
  const gcRankField = makeStrong();
  const gcGapField = makeStrong();
  const gradientPercentField = makeStrong();
  const gradientModifierField = makeStrong();
  const windModifierField = makeStrong();
  const draftModifierField = makeStrong();
  const speedField = makeStrong();

  return {
    row,
    rankField,
    gapField,
    clockField,
    splitFields,
    terrainSkillField,
    baseSkillField,
    effectiveSkillField,
    teamBonusField,
    seasonFormField,
    raceFormField,
    fatigueField,
    staminaField,
    elevationField,
    dailyFormField,
    microFormField,
    gcRankField,
    gcGapField,
    gradientPercentField,
    gradientModifierField,
    windModifierField,
    draftModifierField,
    speedField,
    initialized: false,
    lastValues: {},
  };
}

function updateSidebarRow(
  rowCache: SidebarRowCache,
  position: number,
  rider: RealtimeRiderSnapshot,
  sourceRider: Rider | null,
  splitLabels: string[],
  stageProfile: RealtimeSimulationBootstrap['stage']['profile'],
  raceIsStageRace: boolean,
  stageNumber: number,
  gcByRiderId: Map<number, { rank: number; gapSeconds: number }>,
): void {
  const seasonForm = sourceRider?.formBonus ?? 0;
  const raceForm = sourceRider?.raceFormBonus ?? 0;
  const gcStanding = raceIsStageRace && stageNumber > 1 ? gcByRiderId.get(rider.riderId) ?? null : null;
  const clockValue = stageProfile !== 'ITT'
    ? '—'
    : !rider.hasStarted
      ? formatStartOffset(rider.startOffsetSeconds)
      : rider.riderClockSeconds != null
        ? formatClock(rider.riderClockSeconds)
        : '—';
  const terrainSkillValue = `${formatTerrain(rider.activeTerrain)} / ${formatSkill(rider.skillName)}`;

  const teamBonusValue = rider.teamGroupBonus > 0 ? `+${formatNumber(rider.teamGroupBonus)}` : '—';

  updateClassName(rowCache.row, `race-sim-row${position === 1 ? ' race-sim-row-leader' : ''}`);
  updateText(rowCache.rankField, `${position}.`);
  updateText(rowCache.gapField, formatGap(rider.gapToLeaderMeters));
  updateText(rowCache.clockField, clockValue);

  splitLabels.forEach((label, index) => {
    const splitField = rowCache.splitFields[index];
    if (!splitField) {
      return;
    }
    const splitValue = renderSplitCell(rider, label);
    updateText(splitField, splitValue);
    updateTitle(splitField, label);
  });

  if (hasChanged(rowCache, 'terrainSkillValue', terrainSkillValue)) {
    updateText(rowCache.terrainSkillField, terrainSkillValue);
    updateTitle(rowCache.terrainSkillField, terrainSkillValue);
    commitValue(rowCache, 'terrainSkillValue', terrainSkillValue);
  }

  if (hasChanged(rowCache, 'baseSkillValue', rider.baseSkill)) {
    updateText(rowCache.baseSkillField, formatNumber(rider.baseSkill));
    commitValue(rowCache, 'baseSkillValue', rider.baseSkill);
  }

  const baseSkillTitle = rider.skillBreakdown || 'Basis-Skill';
  if (hasChanged(rowCache, 'baseSkillTitle', baseSkillTitle)) {
    updateTitle(rowCache.baseSkillField, baseSkillTitle);
    commitValue(rowCache, 'baseSkillTitle', baseSkillTitle);
  }

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

  updateText(rowCache.teamBonusField, teamBonusValue);
  updateClassName(rowCache.teamBonusField, rider.teamGroupBonus > 0 ? 'race-sim-team-bonus' : '');
  if (hasChanged(rowCache, 'seasonFormValue', seasonForm)) {
    updateText(rowCache.seasonFormField, formatSigned(seasonForm));
    commitValue(rowCache, 'seasonFormValue', seasonForm);
  }
  const seasonFormClass = getFormClassName(seasonForm);
  if (hasChanged(rowCache, 'seasonFormClass', seasonFormClass)) {
    updateClassName(rowCache.seasonFormField, seasonFormClass);
    commitValue(rowCache, 'seasonFormClass', seasonFormClass);
  }
  if (hasChanged(rowCache, 'raceFormValue', raceForm)) {
    updateText(rowCache.raceFormField, formatSigned(raceForm));
    commitValue(rowCache, 'raceFormValue', raceForm);
  }
  const raceFormClass = getFormClassName(raceForm);
  if (hasChanged(rowCache, 'raceFormClass', raceFormClass)) {
    updateClassName(rowCache.raceFormField, raceFormClass);
    commitValue(rowCache, 'raceFormClass', raceFormClass);
  }
  const fatigueValue = sourceRider?.fatigueMalus ?? 0;
  if (hasChanged(rowCache, 'fatigueValue', fatigueValue)) {
    updateText(rowCache.fatigueField, formatFatigue(fatigueValue));
    commitValue(rowCache, 'fatigueValue', fatigueValue);
  }
  updateText(rowCache.staminaField, formatNumber(rider.staminaPenalty));
  updateText(rowCache.elevationField, formatNumber(rider.elevationPenalty));
  updateText(rowCache.dailyFormField, formatSigned(rider.dailyForm));
  updateClassName(rowCache.dailyFormField, getFormClassName(rider.dailyForm));
  updateText(rowCache.microFormField, formatSigned(rider.microForm));
  updateClassName(rowCache.microFormField, getFormClassName(rider.microForm));
  updateText(rowCache.gcRankField, gcStanding ? String(gcStanding.rank) : '—');
  updateText(rowCache.gcGapField, gcStanding ? formatGcGap(gcStanding.gapSeconds) : '—');
  updateText(rowCache.gradientPercentField, formatGradientPercent(rider.gradientPercent));
  updateClassName(rowCache.gradientPercentField, getSlopeClassName(rider.gradientPercent));
  updateText(rowCache.gradientModifierField, `x${rider.gradientModifier.toFixed(2).replace('.', ',')}`);
  updateText(rowCache.windModifierField, `x${rider.windModifier.toFixed(2).replace('.', ',')}`);
  updateText(rowCache.draftModifierField, `x${rider.draftModifier.toFixed(2).replace('.', ',')}`);
  updateText(rowCache.speedField, formatSpeed(rider.currentSpeedMps));
  rowCache.initialized = true;
}

export function renderRaceSimSidebar(
  container: HTMLElement,
  snapshot: SimulationSnapshot,
  bootstrap: RealtimeSimulationBootstrap,
): void {
  const sidebarData = getBootstrapSidebarData(bootstrap);
  const { splitLabels } = sidebarData;
  const sortState = getLeaderboardSortState(container);
  const previousCache = sidebarRenderCache.get(container);
  const sortedRiders = sortRiders(
    snapshot.riders,
    bootstrap,
    splitLabels,
    sortState,
    sidebarData.riderById,
    sidebarData.gcByRiderId,
    sidebarData.teamAbbreviationById,
    previousCache?.orderedRiderIds ?? [],
  );

  const previousLayoutKey = previousCache?.layoutKey;
  const layoutKey = applyLeaderboardLayout(container, sidebarData.columns);
  const cached = sidebarRenderCache.get(container) ?? { layoutKey, orderedRiderIds: [], rowsByRiderId: new Map() };

  if (previousLayoutKey != null && previousLayoutKey !== layoutKey) {
    container.innerHTML = '';
    cached.rowsByRiderId.clear();
    cached.orderedRiderIds = [];
  }

  const nextRiderIds = sortedRiders.map((rider) => rider.riderId);
  const activeRiderIdSet = new Set(nextRiderIds);

  for (const [riderId, rowCache] of cached.rowsByRiderId) {
    if (activeRiderIdSet.has(riderId)) {
      continue;
    }
    rowCache.row.remove();
    cached.rowsByRiderId.delete(riderId);
  }

  for (let index = 0; index < sortedRiders.length; index += 1) {
    const rider = sortedRiders[index];
    const sourceRider = sidebarData.riderById.get(rider.riderId) ?? null;
    let rowCache = cached.rowsByRiderId.get(rider.riderId);
    if (!rowCache) {
      rowCache = buildSidebarRowCache(
        rider,
        sourceRider,
        splitLabels,
        sidebarData.teamById,
        sidebarData.teamAbbreviationById,
        sidebarData.teamNameById,
      );
      cached.rowsByRiderId.set(rider.riderId, rowCache);
    }
  }

  const isSameOrder = cached.orderedRiderIds.length === nextRiderIds.length
    && cached.orderedRiderIds.every((riderId, index) => riderId === nextRiderIds[index]);

  if (!isSameOrder) {
    const fragment = document.createDocumentFragment();
    for (const riderId of nextRiderIds) {
      const rowCache = cached.rowsByRiderId.get(riderId);
      if (rowCache) {
        fragment.appendChild(rowCache.row);
      }
    }
    container.replaceChildren(fragment);
  }

  const scrollContainer = container.parentElement;
  const shouldLimitToVisibleRows = scrollContainer instanceof HTMLElement && scrollContainer.clientHeight > 0;

  for (let index = 0; index < sortedRiders.length; index += 1) {
    const rider = sortedRiders[index];
    const rowCache = cached.rowsByRiderId.get(rider.riderId);
    const sourceRider = sidebarData.riderById.get(rider.riderId) ?? null;
    if (!rowCache) {
      continue;
    }

    if (shouldLimitToVisibleRows && rowCache.initialized && !isRowVisible(rowCache.row, scrollContainer)) {
      continue;
    }

    updateSidebarRow(
      rowCache,
      index + 1,
      rider,
      sourceRider,
      splitLabels,
      bootstrap.stage.profile,
      bootstrap.race.isStageRace,
      bootstrap.stage.stageNumber,
      sidebarData.gcByRiderId,
    );
  }

  sidebarRenderCache.set(container, {
    layoutKey,
    orderedRiderIds: nextRiderIds,
    rowsByRiderId: cached.rowsByRiderId,
  });
}
