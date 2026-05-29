import type { RaceSimMessage } from './SimulationEngine';

export type RaceSimMessageFilter = 'all' | 'attack' | 'crash' | 'mechanical' | 'breakaway';

const MESSAGE_FILTERS: Array<{ key: RaceSimMessageFilter; label: string }> = [
  { key: 'all', label: 'Alle' },
  { key: 'attack', label: 'Attacken' },
  { key: 'crash', label: 'Stürze' },
  { key: 'mechanical', label: 'Defekte' },
  { key: 'breakaway', label: 'Ausreißer' },
];

function formatElapsedTime(elapsedSeconds: number): string {
  const totalSeconds = Math.max(0, Math.round(elapsedSeconds));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resolveTeamJerseyAssetPath(teamId: number): string {
  return `/jersey/Jer_${teamId}.png`;
}

function renderSingleMessageJersey(teamId: number, className = 'race-sim-message-jersey'): string {
  return `
    <span class="${className}" aria-hidden="true">
      <img
        class="race-sim-message-jersey-img"
        src="${escapeHtml(resolveTeamJerseyAssetPath(teamId))}"
        alt=""
        width="16"
        height="16"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`;
}

function renderMessageJerseys(message: RaceSimMessage): string {
  if (message.riderId == null || message.riderTeamId == null) {
    return '';
  }

  return renderSingleMessageJersey(message.riderTeamId);
}

function matchesMessageFilter(message: RaceSimMessage, filter: RaceSimMessageFilter): boolean {
  if (filter === 'all') {
    return true;
  }

  const kind = resolveMessageKind(message);
  if (filter === 'attack') {
    return kind === 'attack' || kind === 'counter_attack';
  }
  return kind === filter;
}

function renderMessageDetail(message: RaceSimMessage): string {
  const detailPrefix = message.detail ? escapeHtml(message.detail) : '';
  const reactionMarkup = (message.secondaryRiders ?? [])
    .map((rider) => `${rider.riderTeamId != null ? renderSingleMessageJersey(rider.riderTeamId, 'race-sim-message-inline-jersey') : ''}<span class="race-sim-message-inline-name">${escapeHtml(rider.riderName)}</span>`)
    .join(', ');

  if (!detailPrefix && reactionMarkup.length === 0) {
    return '';
  }

  const reactionText = reactionMarkup.length > 0 ? `${detailPrefix.length > 0 ? ' ' : ''}Reaktion: ${reactionMarkup}.` : '';
  return `<span class="race-sim-message-detail"> · ${detailPrefix}${reactionText}</span>`;
}

function resolveMessageKind(message: RaceSimMessage): string {
  if (message.title.includes('stürzt') || message.title.includes('Sturz')) {
    return 'crash';
  }
  if (message.title.includes('Defekt')) {
    return 'mechanical';
  }
  if (message.title.includes('Ausreißer')) {
    return 'breakaway';
  }
  return message.type;
}

export function renderRaceMessages(container: HTMLElement, messages: RaceSimMessage[], activeFilter: RaceSimMessageFilter = 'all'): void {
  const filteredMessages = messages.filter((message) => matchesMessageFilter(message, activeFilter));
  const emptyMessage = messages.length === 0
    ? 'Noch keine Events in dieser Etappe.'
    : 'Keine Meldungen in dieser Kategorie.';

  container.innerHTML = `
    <div class="race-sim-messages-filter" role="toolbar" aria-label="Meldungen filtern">
      ${MESSAGE_FILTERS.map((filter) => `
        <button type="button" class="race-sim-messages-filter-btn${filter.key === activeFilter ? ' active' : ''}" data-race-sim-message-filter="${filter.key}">${filter.label}</button>
      `).join('')}
    </div>
    <div class="race-sim-message-list">
      ${filteredMessages.length === 0 ? `<div class="race-sim-message-empty">${emptyMessage}</div>` : filteredMessages.map((message) => `
        <article class="race-sim-message-item" data-tone="${message.tone}" data-message-kind="${escapeHtml(resolveMessageKind(message))}">
          <span class="race-sim-message-time">t=${formatElapsedTime(message.elapsedSeconds)}</span>
          ${renderMessageJerseys(message)}
          <span class="race-sim-message-text">
            <strong class="race-sim-message-title">${escapeHtml(message.title)}</strong>
            ${renderMessageDetail(message)}
          </span>
        </article>
      `).join('')}
    </div>`;
}