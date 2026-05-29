import type { RealtimeClassificationLeaders, RealtimeClassificationStanding, RealtimeGcStanding, RealtimeSimulationBootstrap, StageMarkerClassification } from '../../../shared/types';
import { isTimeTrialProfile, rankStageResultEntries, resolveStageTimeLimitSeconds, roundStageResultSeconds } from '../../../shared/stageResultRules';
import type { SimulationSnapshot } from './SimulationEngine';
import type { FavoriteItem } from './stageFavorites';
import { collectStageBoundaryMarkers, isMountainClassificationMarker } from './stageSummary';

interface ScoringEventPointEntry {
  riderId: number;
  rank: number;
  points: number;
  pointsKind: 'points' | 'mountain';
  crossingTimeSeconds: number | null;
  gapSeconds: number | null;
}

interface ScoringEventBadge {
  points: number;
  pointsKind: 'points' | 'mountain';
}

interface ScoringEvent {
  key: string;
  title: string;
  label: string;
  categoryLabel: string | null;
  categoryClassName: string | null;
  kmMark: number;
  kmToFinish: number;
  climbLengthKm: number | null;
  averageGradient: number | null;
  steepestSegmentLengthKm: number | null;
  steepestSegmentGradient: number | null;
  highlightMeta: boolean;
  leaderRiderId: number | null;
  displayBadges: ScoringEventBadge[];
  entries: ScoringEventPointEntry[];
  timingEntries: StageMarkerClassification['entries'];
  accent: 'mountain' | 'sprint' | 'finish';
}

type SnapshotRider = SimulationSnapshot['riders'][number];

interface LiveClassificationStanding extends RealtimeClassificationStanding {
  stagePoints: number;
}

interface StandingRenderOptions {
  limit?: number;
  distanceGapsByRiderId?: Map<number, number>;
  distanceGapClassName?: string;
}

interface FinishRankingEntry {
  rider: SnapshotRider;
  stageTimeSeconds: number;
  photoFinishScore: number;
  riderId: number;
}

function esc(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function resolveTeamJerseyAssetPath(teamId: number): string {
  return `/jersey/Jer_${teamId}.png`;
}

function renderJersey(teamId: number | null | undefined, teamName: string | null | undefined): string {
  if (teamId == null || teamId <= 0) {
    return '—';
  }

  return `
    <span class="race-sim-team-visual" title="${esc(teamName ?? `Team ${teamId}`)}">
      <img
        class="race-sim-team-jersey-img"
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

function formatSkill(value: number): string {
  return value.toFixed(1).replace('.', ',');
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

function formatClockGap(seconds: number | null | undefined): string {
  if (seconds == null || seconds <= 0) {
    return '—';
  }

  const roundedSeconds = Math.round(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const remainder = roundedSeconds % 60;
  return `+${minutes}:${String(remainder).padStart(2, '0')}`;
}

function formatKmMark(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) {
    return '—';
  }

  return `${value.toFixed(1).replace('.', ',')} km`;
}

function formatPoints(points: number | null | undefined): string {
  return `${points ?? 0} Pkt.`;
}

function formatDistanceGapMeters(meters: number | null | undefined): string {
  if (meters == null || !Number.isFinite(meters)) {
    return '—';
  }

  const roundedMeters = Math.round(meters);
  if (roundedMeters === 0) {
    return '—';
  }

  return roundedMeters > 0
    ? `+${roundedMeters} m`
    : `-${Math.abs(roundedMeters)} m`;
}

function resolveDistanceGapToneClassName(meters: number | null | undefined): string {
  if (meters == null || !Number.isFinite(meters)) {
    return '';
  }
  if (meters < -100) {
    return 'is-ahead';
  }
  if (meters > 100) {
    return 'is-behind';
  }
  return '';
}

function formatClock(seconds: number): string {
  const totalSeconds = Math.max(0, Math.round(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function formatTimeGap(seconds: number | null | undefined): string {
  if (seconds == null || seconds <= 0) return formatClock(0);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return minutes > 0 ? `+${minutes}:${String(remainingSeconds).padStart(2, '0')}` : `+${remainingSeconds}s`;
}

function parseRankedValues(value: string | undefined): number[] {
  if (!value) return [];
  return value.split('|').map((part) => Number.parseInt(part.trim(), 10)).filter(Number.isFinite);
}

function formatKm(value: number): string {
  return `${value.toFixed(1).replace('.', ',')} km`;
}

function formatGradient(value: number): string {
  return `${value.toFixed(1).replace('.', ',')}%`;
}

function buildScoringBadges(values: number[], pointsKind: ScoringEventBadge['pointsKind']): ScoringEventBadge[] {
  return values
    .filter((points) => Number.isFinite(points) && points > 0)
    .map((points) => ({ points, pointsKind }));
}

function resolveCategoryClassName(category: string | null | undefined): string | null {
  if (category == null) return null;
  if (category === 'HC') return 'is-hc';
  return `is-cat-${category}`;
}

function resolveScoringEventBadge(event: ScoringEvent): { label: string; className: string } | null {
  if (event.accent === 'sprint') {
    return { label: 'Sprint', className: 'is-sprint' };
  }
  if (event.categoryLabel && event.categoryClassName) {
    return { label: event.categoryLabel, className: event.categoryClassName };
  }
  return null;
}

function resolveLeaderKey(item: FavoriteItem, classificationLeaders: RealtimeClassificationLeaders): 'gc' | 'points' | 'mountain' | 'youth' | null {
  if (item.riderId == null) {
    return null;
  }
  if (classificationLeaders.gcLeaderRiderId === item.riderId) {
    return 'gc';
  }
  if (classificationLeaders.pointsLeaderRiderId === item.riderId) {
    return 'points';
  }
  if (classificationLeaders.mountainLeaderRiderId === item.riderId) {
    return 'mountain';
  }
  if (classificationLeaders.youthLeaderRiderId === item.riderId) {
    return 'youth';
  }
  return null;
}

function chunkItems<T>(items: T[], columnCount: number, rowsPerColumn: number): T[][] {
  return Array.from({ length: columnCount }, (_entry, columnIndex) => items.slice(columnIndex * rowsPerColumn, (columnIndex + 1) * rowsPerColumn));
}

function renderStageFavoriteGrid(favorites: FavoriteItem[], gcStandings: RealtimeGcStanding[], classificationLeaders: RealtimeClassificationLeaders): string {
  if (favorites.length === 0) {
    return '<div class="race-sim-favorites-empty">Noch keine Favoriten für diese Etappe.</div>';
  }

  const columns = chunkItems(favorites, 4, 5);
  const gcByRiderId = new Map(gcStandings.map((standing) => [standing.riderId, standing]));
  return `<div class="race-sim-stage-favorites-grid">${columns.map((column) => `
    <div class="race-sim-favorites-column">
      ${column.map((item) => `
        <article class="race-sim-favorite-item${(() => {
          const leaderKey = resolveLeaderKey(item, classificationLeaders);
          return leaderKey ? ` is-${leaderKey}-leader` : '';
        })()}">
          <strong class="race-sim-favorite-rank">${item.rank}.</strong>
          ${renderJersey(item.teamId, item.teamName)}
          <div class="race-sim-favorite-main">
            <span class="race-sim-favorite-name" title="${esc(item.displayName)}">${esc(item.displayName)}</span>
            <span class="race-sim-favorite-role" title="${esc(item.roleLabel)}">${esc(item.roleLabel)}</span>
            ${(() => {
              const standing = item.riderId != null ? gcByRiderId.get(item.riderId) ?? null : null;
              if (!standing) {
                return '';
              }
              return `<span class="race-sim-favorite-gc">GC ${standing.rank} · ${esc(formatGcGap(standing.gapSeconds))}</span>`;
            })()}
          </div>
          <strong class="race-sim-favorite-skill">${formatSkill(item.effectiveSkill)}</strong>
        </article>
      `).join('')}
    </div>
  `).join('')}</div>`;
}

function resolveRiderName(bootstrap: RealtimeSimulationBootstrap, riderId: number): string {
  const rider = bootstrap.riders.find((candidate) => candidate.id === riderId);
  return rider ? `${rider.firstName} ${rider.lastName}` : `Fahrer ${riderId}`;
}

function resolveRiderTeam(bootstrap: RealtimeSimulationBootstrap, riderId: number): { teamId: number | null; teamName: string | null } {
  const rider = bootstrap.riders.find((candidate) => candidate.id === riderId);
  const teamId = rider?.activeTeamId ?? null;
  const team = teamId != null ? bootstrap.teams.find((candidate) => candidate.id === teamId) ?? null : null;
  return { teamId, teamName: team?.name ?? null };
}

function renderStandingRows(
  bootstrap: RealtimeSimulationBootstrap,
  standings: Array<RealtimeGcStanding | RealtimeClassificationStanding> | undefined,
  detail: (standing: RealtimeGcStanding | RealtimeClassificationStanding) => string,
  options: StandingRenderOptions = {},
): string {
  const visibleStandings = (standings ?? []).slice(0, options.limit ?? 8);
  if (visibleStandings.length === 0) {
    return '<div class="race-sim-classification-empty">Noch keine Vorwertung.</div>';
  }

  return `<div class="race-sim-classification-grid">${visibleStandings.map((standing) => {
    const team = resolveRiderTeam(bootstrap, standing.riderId);
    const riderName = resolveRiderName(bootstrap, standing.riderId);
    const distanceGap = options.distanceGapsByRiderId?.get(standing.riderId) ?? null;
    const distanceGapClassName = [
      options.distanceGapClassName ?? '',
      resolveDistanceGapToneClassName(distanceGap),
    ].filter((className) => className.length > 0).join(' ');
    return `
      <article class="race-sim-classification-row">
        <strong class="race-sim-favorite-rank">${standing.rank}.</strong>
        ${renderJersey(team.teamId, team.teamName)}
        <span class="race-sim-classification-main">
          <span class="race-sim-classification-name" title="${esc(riderName)}">${esc(riderName)}</span>
          <span class="race-sim-classification-value">${detail(standing)}</span>
        </span>
        ${options.distanceGapsByRiderId ? `<span class="race-sim-classification-distance-gap ${distanceGapClassName}">${esc(formatDistanceGapMeters(distanceGap))}</span>` : ''}
      </article>`;
  }).join('')}</div>`;
}

function renderClassificationBox(
  title: string,
  modifier: string,
  bootstrap: RealtimeSimulationBootstrap,
  standings: Array<RealtimeGcStanding | RealtimeClassificationStanding> | undefined,
  detail: (standing: RealtimeGcStanding | RealtimeClassificationStanding) => string,
  options: StandingRenderOptions = {},
): string {
  return `
    <section class="race-sim-classification-box race-sim-classification-box-${modifier}">
      <h4>${esc(title)}</h4>
      ${renderStandingRows(bootstrap, standings, detail, options)}
    </section>`;
}

function buildLiveClassificationStandings(
  bootstrap: RealtimeSimulationBootstrap,
  baseStandings: RealtimeClassificationStanding[],
  stagePointsByRiderId: Map<number, { points: number; mountain: number }>,
  kind: 'points' | 'mountain',
): LiveClassificationStanding[] {
  const baseByRiderId = new Map(baseStandings.map((standing) => [standing.riderId, standing]));
  return bootstrap.riders
    .map((rider) => {
      const base = baseByRiderId.get(rider.id) ?? null;
      const stagePoints = stagePointsByRiderId.get(rider.id)?.[kind] ?? 0;
      return {
        riderId: rider.id,
        rank: base?.rank ?? Number.MAX_SAFE_INTEGER,
        points: (base?.points ?? 0) + stagePoints,
        timeSeconds: base?.timeSeconds ?? null,
        gapSeconds: base?.gapSeconds ?? null,
        stagePoints,
      } satisfies LiveClassificationStanding;
    })
    .sort((left, right) => (
      (right.points ?? 0) - (left.points ?? 0)
      || left.rank - right.rank
      || resolveRiderName(bootstrap, left.riderId).localeCompare(resolveRiderName(bootstrap, right.riderId), 'de')
    ))
    .map((standing, index) => ({ ...standing, rank: index + 1 }));
}

function renderLivePointsDetail(standing: RealtimeGcStanding | RealtimeClassificationStanding): string {
  const stagePoints = isLiveClassificationStanding(standing) ? standing.stagePoints : 0;
  return `${esc(formatPoints('points' in standing ? standing.points : null))}${stagePoints > 0 ? `<span class="race-sim-classification-stage-gain"><span class="race-sim-classification-stage-gain-arrow">▲</span><span class="race-sim-classification-stage-gain-amount">+${esc(stagePoints)}</span></span>` : ''}`;
}

function isLiveClassificationStanding(standing: RealtimeGcStanding | RealtimeClassificationStanding): standing is LiveClassificationStanding {
  return 'stagePoints' in standing && typeof standing.stagePoints === 'number';
}

function buildRelativeDistanceGapsByRiderId(snapshot: SimulationSnapshot, referenceRiderId: number | null | undefined): Map<number, number> {
  if (referenceRiderId == null) {
    return new Map();
  }

  const referenceRider = snapshot.riders.find((rider) => rider.riderId === referenceRiderId) ?? null;
  if (!referenceRider) {
    return new Map();
  }

  return new Map(snapshot.riders.map((rider) => [
    rider.riderId,
    referenceRider.distanceCoveredMeters - rider.distanceCoveredMeters,
  ]));
}

function resolveClimbSegment(bootstrap: RealtimeSimulationBootstrap, kmMark: number) {
  return bootstrap.stageSummary.segments.find((segment) => kmMark >= segment.start_km && kmMark <= segment.end_km)
    ?? bootstrap.stageSummary.segments.find((segment) => segment.end_km >= kmMark)
    ?? bootstrap.stageSummary.segments[bootstrap.stageSummary.segments.length - 1]
    ?? null;
}

function resolveMountainPointValues(bootstrap: RealtimeSimulationBootstrap, category: StageMarkerClassification['markerCategory']): number[] {
  const bonusSystem = bootstrap.race.category?.bonusSystem;
  if (!bonusSystem || category == null || category === 'Sprint') return [];
  if (category === 'HC') return parseRankedValues(bonusSystem.pointsMountainHc);
  if (category === '1') return parseRankedValues(bonusSystem.pointsMountainCat1);
  if (category === '2') return parseRankedValues(bonusSystem.pointsMountainCat2);
  if (category === '3') return parseRankedValues(bonusSystem.pointsMountainCat3);
  return parseRankedValues(bonusSystem.pointsMountainCat4);
}

function resolveFinishPointValues(bootstrap: RealtimeSimulationBootstrap): number[] {
  const bonusSystem = bootstrap.race.category?.bonusSystem;
  if (!bootstrap.race.isStageRace || !bonusSystem || bootstrap.stage.profile === 'TTT') return [];
  const usesMountainStagePoints = !['ITT', 'TTT', 'Flat', 'Rolling', 'Hilly'].includes(bootstrap.stage.profile);
  return parseRankedValues(usesMountainStagePoints ? bonusSystem.pointsMountainStage : bonusSystem.pointsSprintFinish);
}

function resolveIntermediateSprintPointValues(bootstrap: RealtimeSimulationBootstrap): number[] {
  if (bootstrap.stage.profile === 'ITT' || bootstrap.stage.profile === 'TTT') {
    return [];
  }
  return parseRankedValues(bootstrap.race.category?.bonusSystem?.pointsSprintIntermediate);
}

function resolveSteepestClimbSegment(bootstrap: RealtimeSimulationBootstrap, startKm: number, endKm: number): { lengthKm: number; gradient: number } | null {
  let steepest: { lengthKm: number; gradient: number } | null = null;

  for (const segment of bootstrap.stageSummary.segments) {
    const overlapStartKm = Math.max(startKm, segment.start_km);
    const overlapEndKm = Math.min(endKm, segment.end_km);
    const overlapLengthKm = Math.max(0, overlapEndKm - overlapStartKm);
    if (overlapLengthKm <= 0) {
      continue;
    }

    const candidate = {
      lengthKm: overlapLengthKm,
      gradient: segment.gradient_percent,
    };
    if (
      steepest == null
      || candidate.gradient > steepest.gradient
      || (candidate.gradient === steepest.gradient && candidate.lengthKm > steepest.lengthKm)
    ) {
      steepest = candidate;
    }
  }

  return steepest;
}

function buildMarkerPointEntries(
  classification: StageMarkerClassification,
  values: number[],
  pointsKind: ScoringEventPointEntry['pointsKind'],
  classifiedRiderIds: Set<number> | null = null,
): ScoringEventPointEntry[] {
  return classification.entries
    .filter((entry) => classifiedRiderIds == null || classifiedRiderIds.has(entry.riderId))
    .map((entry, index) => ({
      riderId: entry.riderId,
      rank: entry.rank,
      points: values[index] ?? 0,
      pointsKind,
      crossingTimeSeconds: entry.crossingTimeSeconds,
      gapSeconds: entry.gapSeconds,
    }))
    .filter((entry) => entry.points > 0);
}

function resolveStagePointTotalsByRiderId(events: ScoringEvent[]): Map<number, { points: number; mountain: number }> {
  const totals = new Map<number, { points: number; mountain: number }>();
  for (const event of events) {
    for (const entry of event.entries) {
      const current = totals.get(entry.riderId) ?? { points: 0, mountain: 0 };
      if (entry.pointsKind === 'mountain') {
        current.mountain += entry.points;
      } else {
        current.points += entry.points;
      }
      totals.set(entry.riderId, current);
    }
  }
  return totals;
}

function resolveFinishMarker(bootstrap: RealtimeSimulationBootstrap) {
  return collectStageBoundaryMarkers(bootstrap.stageSummary)
    .filter(({ marker }) => marker.type === 'finish_flat' || marker.type === 'finish_TT' || marker.type === 'finish_hill' || marker.type === 'finish_mountain')
    .sort((left, right) => right.kmMark - left.kmMark)[0] ?? null;
}

function resolveCommitStageTimeSeconds(bootstrap: RealtimeSimulationBootstrap, rider: SnapshotRider): number | null {
  const rawSeconds = isTimeTrialProfile(bootstrap.stage.profile) ? rider.riderClockSeconds : rider.finishTimeSeconds;
  return rawSeconds != null && Number.isFinite(rawSeconds) ? roundStageResultSeconds(rawSeconds) : null;
}

function getClassifiedFinishedRiders(bootstrap: RealtimeSimulationBootstrap, snapshot: SimulationSnapshot): SnapshotRider[] {
  const finished = snapshot.riders
    .filter((rider) => rider.finishStatus !== 'dnf')
    .map((rider) => {
      const stageTimeSeconds = resolveCommitStageTimeSeconds(bootstrap, rider);
      return stageTimeSeconds == null
        ? null
        : { rider, stageTimeSeconds, photoFinishScore: rider.photoFinishScore, riderId: rider.riderId } satisfies FinishRankingEntry;
    })
    .filter((entry): entry is FinishRankingEntry => entry != null);

  if (finished.length === 0) {
    return [];
  }

  const winnerTimeSeconds = Math.min(...finished.map((entry) => entry.stageTimeSeconds));
  if (!Number.isFinite(winnerTimeSeconds) || winnerTimeSeconds <= 0) {
    return rankStageResultEntries(finished, bootstrap.stage.profile).map((entry) => entry.rider);
  }

  const timeLimitSeconds = resolveStageTimeLimitSeconds(bootstrap.stage.profile, finished.map((entry) => entry.stageTimeSeconds));
  if (timeLimitSeconds == null) {
    return rankStageResultEntries(finished, bootstrap.stage.profile).map((entry) => entry.rider);
  }

  return rankStageResultEntries(
    finished.filter((entry) => entry.stageTimeSeconds <= timeLimitSeconds),
    bootstrap.stage.profile,
  ).map((entry) => entry.rider);
}

function buildFinishPointEntries(bootstrap: RealtimeSimulationBootstrap, snapshot: SimulationSnapshot): ScoringEventPointEntry[] {
  const finishPointValues = resolveFinishPointValues(bootstrap);
  if (finishPointValues.length === 0) return [];
  return getClassifiedFinishedRiders(bootstrap, snapshot)
    .map((rider, index) => ({
      riderId: rider.riderId,
      rank: index + 1,
      points: finishPointValues[index] ?? 0,
      pointsKind: 'points' as const,
      crossingTimeSeconds: resolveCommitStageTimeSeconds(bootstrap, rider),
      gapSeconds: null,
    }))
    .filter((entry) => entry.points > 0);
}

function buildFinishTimingEntries(bootstrap: RealtimeSimulationBootstrap, snapshot: SimulationSnapshot): StageMarkerClassification['entries'] {
  const finishedRiders = getClassifiedFinishedRiders(bootstrap, snapshot).slice(0, 20);
  const leaderTimeSeconds = finishedRiders[0] != null ? resolveCommitStageTimeSeconds(bootstrap, finishedRiders[0]) ?? 0 : 0;
  return finishedRiders.map((rider, index) => {
    const stageTimeSeconds = resolveCommitStageTimeSeconds(bootstrap, rider) ?? 0;
    return {
      riderId: rider.riderId,
      rank: index + 1,
      crossingTimeSeconds: stageTimeSeconds,
      gapSeconds: Math.max(0, stageTimeSeconds - leaderTimeSeconds),
      photoFinishScore: rider.photoFinishScore,
    };
  });
}

function resolveFinishWinnerRiderId(bootstrap: RealtimeSimulationBootstrap, snapshot: SimulationSnapshot): number | null {
  return getClassifiedFinishedRiders(bootstrap, snapshot)[0]?.riderId ?? null;
}

function buildScoringEvents(bootstrap: RealtimeSimulationBootstrap, markerClassifications: StageMarkerClassification[], snapshot: SimulationSnapshot): ScoringEvent[] {
  const boundaryMarkers = collectStageBoundaryMarkers(bootstrap.stageSummary);
  const lastQuarterStartKm = bootstrap.stageSummary.distanceKm * 0.75;
  const classifiedRiderIds = snapshot.isFinished
    ? new Set(getClassifiedFinishedRiders(bootstrap, snapshot).map((rider) => rider.riderId))
    : null;
  const climbStarts = boundaryMarkers.filter(({ marker }) => marker.type === 'climb_start');
  const climbs: ScoringEvent[] = boundaryMarkers
    .filter(({ marker }) => isMountainClassificationMarker(marker))
    .sort((left, right) => left.kmMark - right.kmMark)
    .map((climbTop, index) => {
      const start = [...climbStarts].reverse().find((candidate) => candidate.kmMark <= climbTop.kmMark) ?? null;
      const segment = resolveClimbSegment(bootstrap, climbTop.kmMark);
      const startKm = start?.kmMark ?? segment?.start_km ?? climbTop.kmMark;
      const startElevation = start?.elevation ?? segment?.start_elevation ?? climbTop.elevation;
      const lengthKm = Math.max(0, climbTop.kmMark - startKm);
      const averageGradient = lengthKm > 0
        ? ((climbTop.elevation - startElevation) / (lengthKm * 1000)) * 100
        : segment?.gradient_percent ?? 0;
      const steepestSegment = resolveSteepestClimbSegment(bootstrap, startKm, climbTop.kmMark);
      const classification = markerClassifications.find((entry) => entry.markerKey === climbTop.key) ?? null;
      const pointValues = resolveMountainPointValues(bootstrap, classification?.markerCategory ?? climbTop.marker.cat ?? null);
      const entries = classification ? buildMarkerPointEntries(classification, pointValues, 'mountain', classifiedRiderIds) : [];
      const category = classification?.markerCategory ?? climbTop.marker.cat ?? null;
      return {
        key: climbTop.key,
        title: `${index + 1}. Bergwertung`,
        label: climbTop.label,
        categoryLabel: category ? `Kat. ${category}` : null,
        categoryClassName: resolveCategoryClassName(category),
        kmMark: climbTop.kmMark,
        kmToFinish: Math.max(0, bootstrap.stageSummary.distanceKm - climbTop.kmMark),
        climbLengthKm: lengthKm,
        averageGradient,
        steepestSegmentLengthKm: steepestSegment?.lengthKm ?? null,
        steepestSegmentGradient: steepestSegment?.gradient ?? null,
        highlightMeta: climbTop.kmMark >= lastQuarterStartKm,
        leaderRiderId: entries[0]?.riderId ?? classification?.entries[0]?.riderId ?? null,
        displayBadges: buildScoringBadges(pointValues, 'mountain'),
        entries,
        timingEntries: classification?.entries ?? [],
        accent: 'mountain',
      } satisfies ScoringEvent;
    });

  const sprints: ScoringEvent[] = boundaryMarkers
    .filter(({ marker }) => marker.type === 'sprint_intermediate')
    .sort((left, right) => left.kmMark - right.kmMark)
    .map((sprint, index) => {
      const classification = markerClassifications.find((entry) => entry.markerKey === sprint.key) ?? null;
      const pointValues = resolveIntermediateSprintPointValues(bootstrap);
      const entries = classification ? buildMarkerPointEntries(classification, pointValues, 'points', classifiedRiderIds) : [];
      return {
        key: sprint.key,
        title: `${index + 1}. Zwischensprint`,
        label: sprint.label,
        categoryLabel: null,
        categoryClassName: null,
        kmMark: sprint.kmMark,
        kmToFinish: Math.max(0, bootstrap.stageSummary.distanceKm - sprint.kmMark),
        climbLengthKm: null,
        averageGradient: null,
        steepestSegmentLengthKm: null,
        steepestSegmentGradient: null,
        highlightMeta: false,
        leaderRiderId: entries[0]?.riderId ?? classification?.entries[0]?.riderId ?? null,
        displayBadges: buildScoringBadges(pointValues, 'points'),
        entries,
        timingEntries: classification?.entries ?? [],
        accent: 'sprint',
      } satisfies ScoringEvent;
    });

  const finishMarker = resolveFinishMarker(bootstrap);
  const finishEntries = buildFinishPointEntries(bootstrap, snapshot);
  const finishMountainClassification = finishMarker ? markerClassifications.find((entry) => entry.markerKey === finishMarker.key) ?? null : null;
  const finishMountainEntries = finishMountainClassification
    ? buildMarkerPointEntries(finishMountainClassification, resolveMountainPointValues(bootstrap, finishMountainClassification.markerCategory), 'mountain', classifiedRiderIds)
    : [];
  const finishPointValues = resolveFinishPointValues(bootstrap);
  const finishMountainPointValues = finishMountainClassification
    ? resolveMountainPointValues(bootstrap, finishMountainClassification.markerCategory)
    : [];
  const finishTimingEntries = (bootstrap.stage.profile === 'ITT' || bootstrap.stage.profile === 'TTT')
    ? buildFinishTimingEntries(bootstrap, snapshot)
    : finishMountainClassification?.entries ?? [];
  const finishLeaderId = finishEntries[0]?.riderId ?? finishMountainEntries[0]?.riderId ?? resolveFinishWinnerRiderId(bootstrap, snapshot);
  const finishEvent: ScoringEvent = {
    key: 'finish',
    title: 'Zielsprint',
    label: finishMarker?.label ?? 'Ziel',
    categoryLabel: finishMountainClassification?.markerCategory ? `Kat. ${finishMountainClassification.markerCategory}` : null,
    categoryClassName: resolveCategoryClassName(finishMountainClassification?.markerCategory ?? null),
    kmMark: finishMarker?.kmMark ?? bootstrap.stageSummary.distanceKm,
    kmToFinish: 0,
    climbLengthKm: null,
    averageGradient: null,
    steepestSegmentLengthKm: null,
    steepestSegmentGradient: null,
    highlightMeta: Boolean(finishMountainClassification?.markerCategory),
    leaderRiderId: finishLeaderId,
    displayBadges: [
      ...buildScoringBadges(finishPointValues, 'points'),
      ...buildScoringBadges(finishMountainPointValues, 'mountain'),
    ],
    entries: [...finishEntries, ...finishMountainEntries],
    timingEntries: finishTimingEntries,
    accent: 'finish',
  };

  const regularEvents = [...sprints, ...climbs].sort((left, right) => left.kmMark - right.kmMark || left.title.localeCompare(right.title, 'de'));
  return [...regularEvents, finishEvent].filter((event) => event.entries.length > 0 || event.timingEntries.length > 0 || event.accent !== 'finish' || snapshot.isFinished);
}

function renderScoringEventPopover(bootstrap: RealtimeSimulationBootstrap, event: ScoringEvent): string {
  const pointEntryByRiderId = new Map(event.entries.map((entry) => [entry.riderId, entry]));
  const maxRows = (bootstrap.stage.profile === 'ITT' || bootstrap.stage.profile === 'TTT') && event.key === 'finish' ? 20 : 15;
  const timingRows = event.timingEntries.length > 0
    ? [...event.timingEntries]
      .sort((left, right) => left.crossingTimeSeconds - right.crossingTimeSeconds || left.riderId - right.riderId)
      .slice(0, maxRows)
    : event.entries.slice(0, maxRows).map((entry) => ({
      riderId: entry.riderId,
      rank: entry.rank,
      crossingTimeSeconds: entry.crossingTimeSeconds ?? 0,
      gapSeconds: entry.gapSeconds ?? 0,
      photoFinishScore: 0,
      pointsAwarded: entry.points,
    })).sort((left, right) => left.crossingTimeSeconds - right.crossingTimeSeconds || left.riderId - right.riderId);

  if (timingRows.length === 0) {
    return '<div class="race-sim-stage-points-popover-empty">Noch keine Punkte vergeben.</div>';
  }
  return `
    <div class="race-sim-stage-points-popover-list">
      ${timingRows.map((entry) => {
        const team = resolveRiderTeam(bootstrap, entry.riderId);
        const pointEntry = pointEntryByRiderId.get(entry.riderId) ?? null;
        return `
          <div class="race-sim-stage-points-popover-row">
            <strong>${entry.rank}.</strong>
            ${renderJersey(team.teamId, team.teamName)}
            <span>${esc(resolveRiderName(bootstrap, entry.riderId))}</span>
            <strong>${entry.rank === 1 ? esc(formatClock(entry.crossingTimeSeconds)) : esc(formatTimeGap(entry.gapSeconds))}</strong>
            ${pointEntry ? `<strong class="race-sim-stage-points-value-${pointEntry.pointsKind}">${pointEntry.points}</strong>` : '<strong>—</strong>'}
          </div>`;
      }).join('')}
    </div>`;
}

function resolveStandingPoints(standings: RealtimeClassificationStanding[] | undefined, riderId: number): number {
  return standings?.find((standing) => standing.riderId === riderId)?.points ?? 0;
}

function renderBreakawayBox(bootstrap: RealtimeSimulationBootstrap, snapshot: SimulationSnapshot, events: ScoringEvent[]): string {
  const breakawayRiders = snapshot.riders.filter((rider) => rider.isBreakaway);
  if (breakawayRiders.length === 0) {
    return '';
  }

  const breakawayGapStatus = snapshot.breakawayGapStatus;
  const breakawayGapSummary = breakawayGapStatus != null && breakawayGapStatus.gapSeconds != null
    ? `${formatClockGap(breakawayGapStatus.gapSeconds)} (${formatKmMark(breakawayGapStatus.kmMark)})`
    : null;
  const breakawayGapTooltip = breakawayGapStatus != null && breakawayGapStatus.gapSeconds != null
    ? `Zeitabstand des führenden Ausreißers zum ersten Nicht-Ausreißer: ${formatClockGap(breakawayGapStatus.gapSeconds)} an ${formatKmMark(breakawayGapStatus.kmMark)}`
    : '';

  const gcByRiderId = new Map(bootstrap.gcStandings.map((standing) => [standing.riderId, standing]));
  const stagePointsByRiderId = resolveStagePointTotalsByRiderId(events);
  const ordered = [...breakawayRiders].sort((left, right) => (
    (gcByRiderId.get(left.riderId)?.rank ?? Number.MAX_SAFE_INTEGER) - (gcByRiderId.get(right.riderId)?.rank ?? Number.MAX_SAFE_INTEGER)
    || left.riderName.localeCompare(right.riderName, 'de')
  ));

  return `
    <section class="race-sim-classification-box race-sim-classification-box-breakaway">
      <h4>Ausreißer${breakawayGapSummary != null ? `<span class="race-sim-breakaway-header-gap" title="${esc(breakawayGapTooltip)}">${esc(breakawayGapSummary)}</span>` : ''}</h4>
      <div class="race-sim-breakaway-grid">
        ${ordered.map((rider) => {
          const standing = gcByRiderId.get(rider.riderId) ?? null;
          const team = resolveRiderTeam(bootstrap, rider.riderId);
          const sprintTotal = resolveStandingPoints(bootstrap.pointsStandings, rider.riderId);
          const mountainTotal = resolveStandingPoints(bootstrap.mountainStandings, rider.riderId);
          const stageTotals = stagePointsByRiderId.get(rider.riderId) ?? { points: 0, mountain: 0 };
          return `
            <article class="race-sim-breakaway-row">
              <strong class="race-sim-favorite-rank">${standing ? standing.rank : '—'}.</strong>
              ${renderJersey(team.teamId, team.teamName)}
              <span class="race-sim-classification-main">
                <span class="race-sim-classification-name" title="${esc(rider.riderName)}">${esc(rider.riderName)}</span>
                <strong class="race-sim-breakaway-gap">${esc(standing ? formatGcGap(standing.gapSeconds) : '—')} · ${esc(rider.gapToLeaderMeters > 0 ? `+${Math.round(rider.gapToLeaderMeters)} m` : '—')}</strong>
              </span>
              <span class="race-sim-breakaway-points-panel">
                <span class="race-sim-breakaway-badges">
                  <span class="race-sim-stage-points-header-badge is-points">Sprint ${sprintTotal + stageTotals.points}</span>
                  <span class="race-sim-stage-points-header-badge is-mountain">Berg ${mountainTotal + stageTotals.mountain}</span>
                </span>
                <span class="race-sim-breakaway-stage-gains">
                  <span class="race-sim-breakaway-stage-gain">${stageTotals.points > 0 ? `▲ +${stageTotals.points}` : ' '}</span>
                  <span class="race-sim-breakaway-stage-gain">${stageTotals.mountain > 0 ? `▲ +${stageTotals.mountain}` : ' '}</span>
                </span>
              </span>
            </article>`;
        }).join('')}
      </div>
    </section>`;
}

function renderPointBadges(entries: ScoringEventBadge[]): string {
  if (entries.length === 0) return '';
  return entries.map((entry) => `<span class="race-sim-stage-points-badge race-sim-stage-points-badge-${entry.pointsKind}">${entry.points}</span>`).join('');
}

function resolveStageMaxPointsTotals(bootstrap: RealtimeSimulationBootstrap): { points: number; mountain: number } {
  const boundaryMarkers = collectStageBoundaryMarkers(bootstrap.stageSummary);
  const sprintTop = resolveIntermediateSprintPointValues(bootstrap)[0] ?? 0;
  const finishTop = resolveFinishPointValues(bootstrap)[0] ?? 0;
  const mountain = boundaryMarkers
    .filter(({ marker }) => isMountainClassificationMarker(marker))
    .reduce((sum, { marker }) => sum + (resolveMountainPointValues(bootstrap, marker.cat ?? null)[0] ?? 0), 0);

  return {
    points: (boundaryMarkers.filter(({ marker }) => marker.type === 'sprint_intermediate').length * sprintTop) + finishTop,
    mountain,
  };
}

function renderStageScoringSummaryBadges(bootstrap: RealtimeSimulationBootstrap): string {
  const totals = resolveStageMaxPointsTotals(bootstrap);
  return `
    <span class="race-sim-stage-points-header-badges">
      <span class="race-sim-stage-points-header-badge is-points">Sprint ${totals.points}</span>
      <span class="race-sim-stage-points-header-badge is-mountain">Berg ${totals.mountain}</span>
    </span>`;
}

function renderScoringEventMeta(event: ScoringEvent): string {
  const badge = resolveScoringEventBadge(event);
  const metaPills = [
    `<span class="race-sim-stage-points-meta-pill">${esc(formatKm(event.kmMark))}</span>`,
    `<span class="race-sim-stage-points-meta-pill">${esc(`${formatKm(event.kmToFinish)} bis Ziel`)}</span>`,
    event.climbLengthKm != null ? `<span class="race-sim-stage-points-meta-pill">${esc(`Länge ${formatKm(event.climbLengthKm)}`)}</span>` : '',
    event.averageGradient != null ? `<span class="race-sim-stage-points-meta-pill">${esc(`Ø ${formatGradient(event.averageGradient)}`)}</span>` : '',
    event.steepestSegmentLengthKm != null && event.steepestSegmentGradient != null ? `<span class="race-sim-stage-points-meta-pill is-steepest">${esc(`Steilstes ${formatKm(event.steepestSegmentLengthKm)}`)}</span>` : '',
    event.steepestSegmentLengthKm != null && event.steepestSegmentGradient != null ? `<span class="race-sim-stage-points-meta-pill is-steepest">${esc(formatGradient(event.steepestSegmentGradient))}</span>` : '',
  ].filter((entry) => entry.length > 0);
  return `
    <span class="race-sim-stage-points-title-line">
      <strong>${esc(event.title)}</strong>
      ${badge ? `<span class="race-sim-stage-points-category-badge ${badge.className}">${esc(badge.label)}</span>` : ''}
      <span class="race-sim-stage-points-title-name" title="${esc(event.label)}">${esc(event.label)}</span>
    </span>
    <span class="race-sim-stage-points-meta${event.highlightMeta ? ' is-final-quarter' : ''}">
      ${metaPills.map((entry, index) => `${index > 0 ? '<span class="race-sim-stage-points-meta-separator">•</span>' : ''}${entry}`).join('')}
    </span>`;
}

function renderStageScoringBox(bootstrap: RealtimeSimulationBootstrap, markerClassifications: StageMarkerClassification[], snapshot: SimulationSnapshot, scoringEvents: ScoringEvent[] | null = null): string {
  const events = scoringEvents ?? buildScoringEvents(bootstrap, markerClassifications, snapshot);

  if (events.length === 0) {
    return `
      <section class="race-sim-mountain-primes-box">
        <h4>Etappenwertungen${renderStageScoringSummaryBadges(bootstrap)}</h4>
        <div class="race-sim-classification-empty">Keine Sprint- oder Bergwertungen auf dieser Etappe.</div>
      </section>`;
  }

  return `
    <section class="race-sim-mountain-primes-box">
      <h4>Etappenwertungen${renderStageScoringSummaryBadges(bootstrap)}</h4>
      <div class="race-sim-mountain-primes-list">
        ${events.map((event) => {
          const leaderTeam = event.leaderRiderId != null ? resolveRiderTeam(bootstrap, event.leaderRiderId) : { teamId: null, teamName: null };
          const leaderName = event.leaderRiderId != null ? resolveRiderName(bootstrap, event.leaderRiderId) : 'Noch offen';
          return `
          <details class="race-sim-mountain-prime-row race-sim-stage-points-event race-sim-stage-points-event-${event.accent}">
            <summary>
            <span class="race-sim-mountain-prime-title">
              ${renderScoringEventMeta(event)}
            </span>
            <span class="race-sim-stage-points-awards">
              ${renderPointBadges(event.displayBadges)}
            </span>
            <span class="race-sim-stage-points-leader">
              ${renderJersey(leaderTeam.teamId, leaderTeam.teamName)}
              <strong>${esc(leaderName)}</strong>
            </span>
            </summary>
            <div class="race-sim-stage-points-popover">
              ${renderScoringEventPopover(bootstrap, event)}
            </div>
          </details>`;
        }).join('')}
      </div>
    </section>`;
}

export function renderStageFavorites(
  container: HTMLElement,
  favorites: FavoriteItem[],
  bootstrap: RealtimeSimulationBootstrap,
  markerClassifications: StageMarkerClassification[],
  snapshot: SimulationSnapshot,
): void {
  const scoringEvents = buildScoringEvents(bootstrap, markerClassifications, snapshot);
  const stagePointsByRiderId = resolveStagePointTotalsByRiderId(scoringEvents);
  const livePointsStandings = buildLiveClassificationStandings(bootstrap, bootstrap.pointsStandings, stagePointsByRiderId, 'points');
  const liveMountainStandings = buildLiveClassificationStandings(bootstrap, bootstrap.mountainStandings, stagePointsByRiderId, 'mountain');
  const gcDistanceGapsByRiderId = buildRelativeDistanceGapsByRiderId(snapshot, bootstrap.gcStandings[0]?.riderId ?? null);
  const youthDistanceGapsByRiderId = buildRelativeDistanceGapsByRiderId(snapshot, bootstrap.youthStandings[0]?.riderId ?? null);
  container.innerHTML = `
    <section class="race-sim-favorites-section">
      <h4>Stage Favorites</h4>
      ${renderStageFavoriteGrid(favorites, bootstrap.gcStandings, bootstrap.classificationLeaders)}
    </section>
    <section class="race-sim-classifications-section">
      ${renderClassificationBox('GC', 'gc', bootstrap, bootstrap.gcStandings, (standing) => esc(`GC ${standing.rank} · ${formatGcGap(standing.gapSeconds)}`), { limit: 20, distanceGapsByRiderId: gcDistanceGapsByRiderId })}
      ${renderClassificationBox('Punktewertung', 'points', bootstrap, livePointsStandings, renderLivePointsDetail)}
      ${renderClassificationBox('Bergwertung', 'mountain', bootstrap, liveMountainStandings, renderLivePointsDetail)}
      ${renderClassificationBox('Nachwuchsfahrerwertung', 'youth', bootstrap, bootstrap.youthStandings, (standing) => esc(`${standing.rank}. · ${formatGcGap(standing.gapSeconds)}`), { distanceGapsByRiderId: youthDistanceGapsByRiderId, distanceGapClassName: 'is-compact' })}
      ${renderBreakawayBox(bootstrap, snapshot, scoringEvents)}
    </section>
    ${renderStageScoringBox(bootstrap, markerClassifications, snapshot, scoringEvents)}
  `;
}