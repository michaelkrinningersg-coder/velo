import type { RealtimeClassificationLeaders, RealtimeGcStanding } from '../../../shared/types';
import type { FavoriteItem } from './stageFavorites';

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

function renderFavoriteJersey(item: FavoriteItem): string {
  if (item.teamId <= 0) {
    return '—';
  }

  return `
    <span class="race-sim-team-visual" title="${esc(item.teamName)}">
      <img
        class="race-sim-team-jersey-img"
        src="${esc(resolveTeamJerseyAssetPath(item.teamId))}"
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

function formatGcGap(seconds: number): string {
  if (seconds <= 0) {
    return '—';
  }

  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  if (minutes > 0) {
    return `+${minutes}:${String(remainder).padStart(2, '0')}`;
  }
  return `+${remainder}s`;
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

function chunkFavorites(items: FavoriteItem[]): FavoriteItem[][] {
  return [0, 1, 2, 3].map((columnIndex) => items.slice(columnIndex * 5, (columnIndex + 1) * 5));
}

export function renderStageFavorites(
  container: HTMLElement,
  favorites: FavoriteItem[],
  gcStandings: RealtimeGcStanding[],
  classificationLeaders: RealtimeClassificationLeaders,
): void {
  if (favorites.length === 0) {
    container.innerHTML = '<div class="race-sim-favorites-empty">Noch keine Favoriten für diese Etappe.</div>';
    return;
  }

  const columns = chunkFavorites(favorites);
  const gcByRiderId = new Map(gcStandings.map((standing) => [standing.riderId, standing]));
  container.innerHTML = columns.map((column) => `
    <div class="race-sim-favorites-column">
      ${column.map((item) => `
        <article class="race-sim-favorite-item${(() => {
          const leaderKey = resolveLeaderKey(item, classificationLeaders);
          return leaderKey ? ` is-${leaderKey}-leader` : '';
        })()}">
          <strong class="race-sim-favorite-rank">${item.rank}.</strong>
          ${renderFavoriteJersey(item)}
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
  `).join('');
}