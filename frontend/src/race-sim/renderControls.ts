import type { SimulationFrameSnapshot } from './SimulationEngine';

export const TIME_CONTROL_VALUES = [1, 2, 5, 10, 25, 50, 100, 250, 500] as const;

export type TimeControlValue = (typeof TIME_CONTROL_VALUES)[number];

interface ControlRenderState {
  isRunning: boolean;
  timeMultiplier: TimeControlValue;
  messageSort: 'newest' | 'oldest';
  favoriteSort: 'rank' | 'skill';
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
  leaderField: HTMLElement | null;
  finishedField: HTMLElement | null;
  toggleButton: HTMLButtonElement | null;
  speedButtons: HTMLButtonElement[];
  messageSortButtons: HTMLButtonElement[];
  favoriteSortButtons: HTMLButtonElement[];
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
    </div>
    <div class="race-sim-sort-strip">
      <span class="race-sim-sort-label">Messages</span>
      <button type="button" class="race-sim-speed-btn" data-race-sim-sort-target="messages" data-race-sim-sort-value="newest">Neueste</button>
      <button type="button" class="race-sim-speed-btn" data-race-sim-sort-target="messages" data-race-sim-sort-value="oldest">Älteste</button>
      <span class="race-sim-sort-label">Favorites</span>
      <button type="button" class="race-sim-speed-btn" data-race-sim-sort-target="favorites" data-race-sim-sort-value="rank">Rang</button>
      <button type="button" class="race-sim-speed-btn" data-race-sim-sort-target="favorites" data-race-sim-sort-value="skill">Skill</button>
    </div>`;

  const elements: ControlElements = {
    timeField: container.querySelector<HTMLElement>('[data-race-sim-field="time"]'),
    leaderField: container.querySelector<HTMLElement>('[data-race-sim-field="leader"]'),
    finishedField: container.querySelector<HTMLElement>('[data-race-sim-field="finished"]'),
    toggleButton: container.querySelector<HTMLButtonElement>('[data-race-sim-action="toggle"]'),
    speedButtons: Array.from(container.querySelectorAll<HTMLButtonElement>('[data-race-sim-speed]')),
    messageSortButtons: Array.from(container.querySelectorAll<HTMLButtonElement>('[data-race-sim-sort-target="messages"]')),
    favoriteSortButtons: Array.from(container.querySelectorAll<HTMLButtonElement>('[data-race-sim-sort-target="favorites"]')),
  };
  controlElementsByContainer.set(container, elements);
  return elements;
}

export function renderRaceSimControls(container: HTMLElement, state: ControlRenderState): void {
  const elements = ensureControlsMarkup(container);

  if (elements.timeField) {
    elements.timeField.textContent = formatTime(state.snapshot.elapsedSeconds);
  }
  if (elements.leaderField) {
    elements.leaderField.textContent = `${formatKm(state.snapshot.leaderDistanceMeters)} / ${formatKm(state.snapshot.stageDistanceMeters)}`;
  }
  if (elements.finishedField) {
    elements.finishedField.textContent = `${state.snapshot.finishedRiders} / ${state.totalRiders}`;
  }
  if (elements.toggleButton) {
    elements.toggleButton.textContent = state.isRunning ? 'Pause' : state.snapshot.isFinished ? 'Fertig' : 'Start';
    elements.toggleButton.classList.toggle('active', !state.isRunning && !state.snapshot.isFinished);
  }

  elements.speedButtons.forEach((button) => {
    const speedValue = Number(button.dataset['raceSimSpeed']);
    button.classList.toggle('active', speedValue === state.timeMultiplier);
  });
  elements.messageSortButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset['raceSimSortValue'] === state.messageSort);
  });
  elements.favoriteSortButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset['raceSimSortValue'] === state.favoriteSort);
  });
}