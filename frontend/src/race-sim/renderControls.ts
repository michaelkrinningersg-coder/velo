import type { SimulationSnapshot } from './SimulationEngine';

export const TIME_CONTROL_VALUES = [1, 2, 5, 10, 25, 50, 100, 250, 500] as const;

export type TimeControlValue = (typeof TIME_CONTROL_VALUES)[number];

interface ControlRenderState {
  isRunning: boolean;
  timeMultiplier: TimeControlValue;
  snapshot: SimulationSnapshot;
}

function formatTime(seconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function formatKm(meters: number): string {
  return `${(meters / 1000).toFixed(1).replace('.', ',')} km`;
}

function ensureControlsMarkup(container: HTMLElement): void {
  if (container.dataset['raceSimMounted'] === 'true') {
    return;
  }

  container.dataset['raceSimMounted'] = 'true';
  container.innerHTML = `
    <div class="race-sim-control-summary">
      <div class="race-sim-stat-card">
        <span class="race-sim-stat-label">Sim-Zeit</span>
        <strong data-race-sim-field="time">00:00:00</strong>
      </div>
      <div class="race-sim-stat-card">
        <span class="race-sim-stat-label">Leader</span>
        <strong data-race-sim-field="leader">0,0 km / 0,0 km</strong>
      </div>
      <div class="race-sim-stat-card">
        <span class="race-sim-stat-label">Im Ziel</span>
        <strong data-race-sim-field="finished">0 / 0</strong>
      </div>
    </div>
    <div class="race-sim-speed-strip">
      <button type="button" class="race-sim-speed-btn race-sim-speed-btn-toggle" data-race-sim-action="toggle">Start</button>
      ${TIME_CONTROL_VALUES.map((value) => `
        <button
          type="button"
          class="race-sim-speed-btn"
          data-race-sim-speed="${value}"
        >${value}x</button>
      `).join('')}
    </div>`;
}

export function renderRaceSimControls(container: HTMLElement, state: ControlRenderState): void {
  ensureControlsMarkup(container);

  const timeField = container.querySelector<HTMLElement>('[data-race-sim-field="time"]');
  const leaderField = container.querySelector<HTMLElement>('[data-race-sim-field="leader"]');
  const finishedField = container.querySelector<HTMLElement>('[data-race-sim-field="finished"]');
  const toggleButton = container.querySelector<HTMLButtonElement>('[data-race-sim-action="toggle"]');

  if (timeField) {
    timeField.textContent = formatTime(state.snapshot.elapsedSeconds);
  }
  if (leaderField) {
    leaderField.textContent = `${formatKm(state.snapshot.leaderDistanceMeters)} / ${formatKm(state.snapshot.stageDistanceMeters)}`;
  }
  if (finishedField) {
    finishedField.textContent = `${state.snapshot.finishedRiders} / ${state.snapshot.riders.length}`;
  }
  if (toggleButton) {
    toggleButton.textContent = state.isRunning ? 'Pause' : state.snapshot.isFinished ? 'Fertig' : 'Start';
    toggleButton.classList.toggle('active', !state.isRunning && !state.snapshot.isFinished);
  }

  container.querySelectorAll<HTMLButtonElement>('[data-race-sim-speed]').forEach((button) => {
    const speedValue = Number(button.dataset['raceSimSpeed']);
    button.classList.toggle('active', speedValue === state.timeMultiplier);
  });
}