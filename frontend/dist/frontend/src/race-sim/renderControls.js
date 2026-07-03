export const TIME_CONTROL_VALUES = [1, 2, 5, 10, 25, 50, 100, 250, 500];
const controlElementsByContainer = new WeakMap();
function formatTime(seconds) {
    const totalSeconds = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
function formatKm(meters) {
    return `${(meters / 1000).toFixed(1).replace('.', ',')} km`;
}
function ensureControlsMarkup(container) {
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
    const elements = {
        timeField: container.querySelector('[data-race-sim-field="time"]'),
        finishedField: container.querySelector('[data-race-sim-field="finished"]'),
        distanceField: container.querySelector('[data-race-sim-field="distance"]'),
        toggleButton: container.querySelector('[data-race-sim-action="toggle"]'),
        speedButtons: Array.from(container.querySelectorAll('[data-race-sim-speed]')),
    };
    controlElementsByContainer.set(container, elements);
    return elements;
}
export function renderRaceSimControls(container, state) {
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
