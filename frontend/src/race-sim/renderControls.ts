import type { SimulationFrameSnapshot } from './SimulationEngine';

export const TIME_CONTROL_VALUES = [1, 2, 5, 10, 25, 50, 100, 250, 500] as const;

export type TimeControlValue = (typeof TIME_CONTROL_VALUES)[number];

interface ControlRenderState {
  isRunning: boolean;
  timeMultiplier: TimeControlValue;
  snapshot: SimulationFrameSnapshot;
  totalRiders: number;
  perf: {
    engineStepMs: number;
    snapshotBuildMs: number;
    profileRenderMs: number;
    sidebarRenderMs: number;
    sidebarWriteMs: number;
    sidebarPaintMs: number;
    sidebarPrepMs: number;
    sidebarSortMs: number;
    sidebarLayoutMs: number;
    sidebarCreateRowsMs: number;
    sidebarRemoveRowsMs: number;
    sidebarOrderCheckMs: number;
    sidebarReorderMs: number;
    sidebarVisibilityMs: number;
    sidebarUpdateRowsMs: number;
    sidebarFinalizeMs: number;
    sidebarRowsTotal: number;
    sidebarRowsCreated: number;
    sidebarRowsRemoved: number;
    sidebarRowsUpdated: number;
    sidebarRowsSkippedInvisible: number;
    sidebarOrderChanged: number;
  };
}

interface ControlElements {
  timeField: HTMLElement | null;
  finishedField: HTMLElement | null;
  distanceField: HTMLElement | null;
  toggleButton: HTMLButtonElement | null;
  speedButtons: HTMLButtonElement[];
}

const controlElementsByContainer = new WeakMap<HTMLElement, ControlElements>();

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

function ensureControlsMarkup(container: HTMLElement): ControlElements {
  const cached = controlElementsByContainer.get(container);
  if (cached) {
    return cached;
  }

  container.dataset['raceSimMounted'] = 'true';
  container.innerHTML = `
    <div class="race-sim-control-header-row">
      <button type="button" class="race-sim-speed-btn race-sim-speed-btn-toggle" data-race-sim-action="toggle">Start</button>
      <div class="race-sim-speed-strip">
        ${TIME_CONTROL_VALUES.map((value) => `
          <button
            type="button"
            class="race-sim-speed-btn"
            data-race-sim-speed="${value}"
          >${value}x</button>
        `).join('')}
      </div>
      <strong class="race-sim-control-meta" data-race-sim-field="time">00:00:00</strong>
      <strong class="race-sim-control-meta" data-race-sim-field="finished">0 / 0 im Ziel</strong>
      <strong class="race-sim-control-distance" data-race-sim-field="distance">0,0 km / 0,0 km</strong>
    </div>`;

  const elements: ControlElements = {
    timeField: container.querySelector<HTMLElement>('[data-race-sim-field="time"]'),
    finishedField: container.querySelector<HTMLElement>('[data-race-sim-field="finished"]'),
    distanceField: container.querySelector<HTMLElement>('[data-race-sim-field="distance"]'),
    toggleButton: container.querySelector<HTMLButtonElement>('[data-race-sim-action="toggle"]'),
    speedButtons: Array.from(container.querySelectorAll<HTMLButtonElement>('[data-race-sim-speed]')),
  };
  controlElementsByContainer.set(container, elements);
  return elements;
}

export function renderRaceSimControls(container: HTMLElement, state: ControlRenderState): void {
  const elements = ensureControlsMarkup(container);

  if (elements.timeField) {
    elements.timeField.textContent = formatTime(state.snapshot.elapsedSeconds);
  }
  if (elements.finishedField) {
    elements.finishedField.textContent = `${state.snapshot.finishedRiders} / ${state.totalRiders} im Ziel`;
  }
  if (elements.distanceField) {
    elements.distanceField.textContent = `${formatKm(state.snapshot.leaderDistanceMeters)} / ${formatKm(state.snapshot.stageDistanceMeters)}`;
  }
  if (elements.toggleButton) {
    elements.toggleButton.textContent = state.isRunning ? 'Pause' : state.snapshot.isFinished ? 'Fertig' : 'Start';
    elements.toggleButton.classList.toggle('active', !state.isRunning && !state.snapshot.isFinished);
  }

  elements.speedButtons.forEach((button) => {
    const speedValue = Number(button.dataset['raceSimSpeed']);
    button.classList.toggle('active', speedValue === state.timeMultiplier);
  });
}