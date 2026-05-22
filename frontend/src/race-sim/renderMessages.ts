import type { RaceSimMessage } from './SimulationEngine';

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

function renderMessageJersey(message: RaceSimMessage): string {
  if (message.riderId == null || message.riderTeamId == null) {
    return '';
  }

  return `
    <span class="race-sim-message-jersey" aria-hidden="true">
      <img
        class="race-sim-message-jersey-img"
        src="${escapeHtml(resolveTeamJerseyAssetPath(message.riderTeamId))}"
        alt=""
        width="16"
        height="16"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`;
}

export function renderRaceMessages(container: HTMLElement, messages: RaceSimMessage[]): void {
  if (messages.length === 0) {
    container.innerHTML = '<div class="race-sim-message-empty">Noch keine Events in dieser Etappe.</div>';
    return;
  }

  container.innerHTML = messages.map((message) => `
    <article class="race-sim-message-item" data-tone="${message.tone}">
      <span class="race-sim-message-time">t=${formatElapsedTime(message.elapsedSeconds)}</span>
      ${renderMessageJersey(message)}
      <span class="race-sim-message-text">
        <strong class="race-sim-message-title">${escapeHtml(message.title)}</strong>
        ${message.detail ? `<span class="race-sim-message-detail"> · ${escapeHtml(message.detail)}</span>` : ''}
      </span>
    </article>
  `).join('');
}