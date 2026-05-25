import type { RealtimeClassificationLeaders, RealtimeClassificationStanding, RealtimeGcStanding, RealtimeSimulationBootstrap, StageMarkerClassification } from '../../../shared/types';
import type { FavoriteItem } from './stageFavorites';
import { collectStageBoundaryMarkers, isMountainClassificationMarker } from './stageSummary';

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
        <span class="race-sim-classification-name" title="${esc(riderName)}">${esc(riderName)}</span>
        <strong class="race-sim-classification-value">${esc(detail(standing))}</strong>
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

function renderMountainPrimesBox(bootstrap: RealtimeSimulationBootstrap, markerClassifications: StageMarkerClassification[]): string {
  const boundaryMarkers = collectStageBoundaryMarkers(bootstrap.stageSummary);
  const climbStarts = boundaryMarkers.filter(({ marker }) => marker.type === 'climb_start');
  const climbs = boundaryMarkers
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
      const leader = classification?.entries[0] ?? null;
      return {
        number: index + 1,
        label: climbTop.label,
        kmMark: climbTop.kmMark,
        category: climbTop.marker.cat ?? '–',
        lengthKm,
        averageGradient,
        leaderName: leader ? resolveRiderName(bootstrap, leader.riderId) : null,
      };
    });

  if (climbs.length === 0) {
    return `
      <section class="race-sim-mountain-primes-box">
        <h4>Bergwertungen der Etappe</h4>
        <div class="race-sim-classification-empty">Keine Bergwertungen auf dieser Etappe.</div>
      </section>`;
  }

  return `
    <section class="race-sim-mountain-primes-box">
      <h4>Bergwertungen der Etappe</h4>
      <div class="race-sim-mountain-primes-list">
        ${climbs.map((climb) => `
          <article class="race-sim-mountain-prime-row">
            <span class="race-sim-mountain-prime-title">
              <strong>${climb.number}. Bergwertung</strong>
              <span title="${esc(climb.label)}">${esc(climb.label)}</span>
            </span>
            <span>${formatKm(climb.kmMark)}</span>
            <span>Kat. ${esc(climb.category)}</span>
            <span>${formatKm(climb.lengthKm)}</span>
            <span>${formatGradient(climb.averageGradient)}</span>
            <span class="race-sim-mountain-prime-leader">${climb.leaderName ? esc(climb.leaderName) : 'Noch offen'}</span>
          </article>
        `).join('')}
      </div>
    </section>`;
}

export function renderStageFavorites(
  container: HTMLElement,
  favorites: FavoriteItem[],
  bootstrap: RealtimeSimulationBootstrap,
  markerClassifications: StageMarkerClassification[],
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
    ${renderMountainPrimesBox(bootstrap, markerClassifications)}
  `;
}