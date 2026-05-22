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

export function renderRaceMessages(container: HTMLElement, messages: RaceSimMessage[]): void {
  if (messages.length === 0) {
    container.innerHTML = '<div class="race-sim-message-empty">Noch keine Events in dieser Etappe.</div>';
    return;
  }

  container.innerHTML = messages.map((message) => `
    <article class="race-sim-message-item" data-tone="${message.tone}">
      <div class="race-sim-message-head">
        <strong class="race-sim-message-title">${escapeHtml(message.title)}</strong>
        <span class="race-sim-message-time">t=${formatElapsedTime(message.elapsedSeconds)}</span>
      </div>
      <div class="race-sim-message-detail">${escapeHtml(message.detail)}</div>
    </article>
  `).join('');
}