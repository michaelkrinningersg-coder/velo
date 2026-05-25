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
}

interface ScoringEvent {
  key: string;
  title: string;
  subtitle: string;
  leaderRiderId: number | null;
  leaderPoints: ScoringEventPointEntry[];
  entries: ScoringEventPointEntry[];
  accent: 'mountain' | 'sprint' | 'finish';
}

type SnapshotRider = SimulationSnapshot['riders'][number];

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

function formatPoints(points: number | null | undefined): string {
  return `${points ?? 0} Pkt.`;
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
): string {
  const topEight = (standings ?? []).slice(0, 8);
  if (topEight.length === 0) {
    return '<div class="race-sim-classification-empty">Noch keine Vorwertung.</div>';
  }

  return `<div class="race-sim-classification-grid">${topEight.map((standing) => {
    const team = resolveRiderTeam(bootstrap, standing.riderId);
    const riderName = resolveRiderName(bootstrap, standing.riderId);
    return `
      <article class="race-sim-classification-row">
        <strong class="race-sim-favorite-rank">${standing.rank}.</strong>
        ${renderJersey(team.teamId, team.teamName)}
        <span class="race-sim-classification-main">
          <span class="race-sim-classification-name" title="${esc(riderName)}">${esc(riderName)}</span>
          <strong class="race-sim-classification-value">${esc(detail(standing))}</strong>
        </span>
      </article>`;
  }).join('')}</div>`;
}

function renderClassificationBox(
  title: string,
  modifier: string,
  bootstrap: RealtimeSimulationBootstrap,
  standings: Array<RealtimeGcStanding | RealtimeClassificationStanding> | undefined,
  detail: (standing: RealtimeGcStanding | RealtimeClassificationStanding) => string,
): string {
  return `
    <section class="race-sim-classification-box race-sim-classification-box-${modifier}">
      <h4>${esc(title)}</h4>
      ${renderStandingRows(bootstrap, standings, detail)}
    </section>`;
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
  return parseRankedValues(bootstrap.race.category?.bonusSystem?.pointsSprintIntermediate);
}

function buildMarkerPointEntries(
  classification: StageMarkerClassification,
  values: number[],
  pointsKind: ScoringEventPointEntry['pointsKind'],
  classifiedRiderIds: Set<number> | null = null,
): ScoringEventPointEntry[] {
  return classification.entries
    .filter((entry) => classifiedRiderIds == null || classifiedRiderIds.has(entry.riderId))
    .map((entry, index) => ({ riderId: entry.riderId, rank: entry.rank, points: values[index] ?? 0, pointsKind }))
    .filter((entry) => entry.points > 0);
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
    .map((rider, index) => ({ riderId: rider.riderId, rank: index + 1, points: finishPointValues[index] ?? 0, pointsKind: 'points' as const }))
    .filter((entry) => entry.points > 0);
}

function resolveFinishWinnerRiderId(bootstrap: RealtimeSimulationBootstrap, snapshot: SimulationSnapshot): number | null {
  return getClassifiedFinishedRiders(bootstrap, snapshot)[0]?.riderId ?? null;
}

function buildScoringEvents(bootstrap: RealtimeSimulationBootstrap, markerClassifications: StageMarkerClassification[], snapshot: SimulationSnapshot): ScoringEvent[] {
  const boundaryMarkers = collectStageBoundaryMarkers(bootstrap.stageSummary);
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
      const classification = markerClassifications.find((entry) => entry.markerKey === climbTop.key) ?? null;
      const entries = classification ? buildMarkerPointEntries(classification, resolveMountainPointValues(bootstrap, classification.markerCategory), 'mountain', classifiedRiderIds) : [];
      return {
        key: climbTop.key,
        title: `${index + 1}. Bergwertung`,
        subtitle: `${climbTop.label} · ${formatKm(climbTop.kmMark)} · Kat. ${climbTop.marker.cat ?? '–'} · ${formatKm(lengthKm)} · ${formatGradient(averageGradient)}`,
        leaderRiderId: entries[0]?.riderId ?? null,
        leaderPoints: entries.slice(0, 1),
        entries,
        accent: 'mountain',
      } satisfies ScoringEvent;
    });

  const sprints: ScoringEvent[] = boundaryMarkers
    .filter(({ marker }) => marker.type === 'sprint_intermediate')
    .sort((left, right) => left.kmMark - right.kmMark)
    .map((sprint, index) => {
      const classification = markerClassifications.find((entry) => entry.markerKey === sprint.key) ?? null;
      const entries = classification ? buildMarkerPointEntries(classification, resolveIntermediateSprintPointValues(bootstrap), 'points', classifiedRiderIds) : [];
      return {
        key: sprint.key,
        title: `${index + 1}. Zwischensprint`,
        subtitle: `${sprint.label} · ${formatKm(sprint.kmMark)}`,
        leaderRiderId: entries[0]?.riderId ?? null,
        leaderPoints: entries.slice(0, 1),
        entries,
        accent: 'sprint',
      } satisfies ScoringEvent;
    });

  const finishMarker = resolveFinishMarker(bootstrap);
  const finishEntries = buildFinishPointEntries(bootstrap, snapshot);
  const finishMountainClassification = finishMarker ? markerClassifications.find((entry) => entry.markerKey === finishMarker.key) ?? null : null;
  const finishMountainEntries = finishMountainClassification
    ? buildMarkerPointEntries(finishMountainClassification, resolveMountainPointValues(bootstrap, finishMountainClassification.markerCategory), 'mountain', classifiedRiderIds)
    : [];
  const finishLeaderId = finishEntries[0]?.riderId ?? finishMountainEntries[0]?.riderId ?? resolveFinishWinnerRiderId(bootstrap, snapshot);
  const finishEvent: ScoringEvent = {
    key: 'finish',
    title: 'Zielsprint',
    subtitle: finishMarker ? `${finishMarker.label} · ${formatKm(finishMarker.kmMark)}` : 'Ziel',
    leaderRiderId: finishLeaderId,
    leaderPoints: [...finishEntries, ...finishMountainEntries].filter((entry) => entry.riderId === finishLeaderId),
    entries: [...finishEntries, ...finishMountainEntries],
    accent: 'finish',
  };

  return [...sprints, ...climbs, finishEvent].filter((event) => event.entries.length > 0 || event.accent !== 'finish' || snapshot.isFinished);
}

function renderScoringEventPopover(bootstrap: RealtimeSimulationBootstrap, entries: ScoringEventPointEntry[]): string {
  if (entries.length === 0) {
    return '<div class="race-sim-stage-points-popover-empty">Noch keine Punkte vergeben.</div>';
  }
  return `
    <div class="race-sim-stage-points-popover-list">
      ${entries.map((entry) => {
        const team = resolveRiderTeam(bootstrap, entry.riderId);
        return `
          <div class="race-sim-stage-points-popover-row">
            <strong>${entry.rank}.</strong>
            ${renderJersey(team.teamId, team.teamName)}
            <span>${esc(resolveRiderName(bootstrap, entry.riderId))}</span>
            <strong class="race-sim-stage-points-value-${entry.pointsKind}">${entry.points}</strong>
          </div>`;
      }).join('')}
    </div>`;
}

function renderPointBadges(entries: ScoringEventPointEntry[]): string {
  if (entries.length === 0) return '';
  return entries.map((entry) => `<span class="race-sim-stage-points-badge race-sim-stage-points-badge-${entry.pointsKind}">${entry.points}</span>`).join('');
}

function renderStageScoringBox(bootstrap: RealtimeSimulationBootstrap, markerClassifications: StageMarkerClassification[], snapshot: SimulationSnapshot): string {
  const events = buildScoringEvents(bootstrap, markerClassifications, snapshot);

  if (events.length === 0) {
    return `
      <section class="race-sim-mountain-primes-box">
        <h4>Etappenwertungen</h4>
        <div class="race-sim-classification-empty">Keine Sprint- oder Bergwertungen auf dieser Etappe.</div>
      </section>`;
  }

  return `
    <section class="race-sim-mountain-primes-box">
      <h4>Etappenwertungen</h4>
      <div class="race-sim-mountain-primes-list">
        ${events.map((event) => {
          const leaderTeam = event.leaderRiderId != null ? resolveRiderTeam(bootstrap, event.leaderRiderId) : { teamId: null, teamName: null };
          const leaderName = event.leaderRiderId != null ? resolveRiderName(bootstrap, event.leaderRiderId) : 'Noch offen';
          return `
          <details class="race-sim-mountain-prime-row race-sim-stage-points-event race-sim-stage-points-event-${event.accent}">
            <summary>
            <span class="race-sim-mountain-prime-title">
              <strong>${esc(event.title)}</strong>
              <span title="${esc(event.subtitle)}">${esc(event.subtitle)}</span>
            </span>
            <span class="race-sim-stage-points-leader">
              ${renderJersey(leaderTeam.teamId, leaderTeam.teamName)}
              <strong>${esc(leaderName)}</strong>
              ${renderPointBadges(event.leaderPoints)}
            </span>
            </summary>
            <div class="race-sim-stage-points-popover">
              ${renderScoringEventPopover(bootstrap, event.entries)}
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
  container.innerHTML = `
    <section class="race-sim-favorites-section">
      <h4>Stage Favorites</h4>
      ${renderStageFavoriteGrid(favorites, bootstrap.gcStandings, bootstrap.classificationLeaders)}
    </section>
    <section class="race-sim-classifications-section">
      ${renderClassificationBox('GC', 'gc', bootstrap, bootstrap.gcStandings, (standing) => `GC ${standing.rank} · ${formatGcGap(standing.gapSeconds)}`)}
      ${renderClassificationBox('Punktewertung', 'points', bootstrap, bootstrap.pointsStandings, (standing) => formatPoints('points' in standing ? standing.points : null))}
      ${renderClassificationBox('Bergwertung', 'mountain', bootstrap, bootstrap.mountainStandings, (standing) => formatPoints('points' in standing ? standing.points : null))}
      ${renderClassificationBox('Nachwuchsfahrerwertung', 'youth', bootstrap, bootstrap.youthStandings, (standing) => `${standing.rank}. · ${formatGcGap(standing.gapSeconds)}`)}
    </section>
    ${renderStageScoringBox(bootstrap, markerClassifications, snapshot)}
  `;
}