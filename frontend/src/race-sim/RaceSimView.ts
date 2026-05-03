import type { RealtimeSimulationBootstrap } from '../../../shared/types';
import { renderRaceSimControls, type TimeControlValue } from './renderControls';
import { renderRaceProfile } from './renderProfile';
import { renderRaceSimSidebar } from './renderSidebar';
import { SimulationEngine, type SimulationSnapshot } from './SimulationEngine';

interface RaceSimElements {
  layout: HTMLElement;
  emptyState: HTMLElement;
  profile: HTMLElement;
  sidebar: HTMLElement;
  controls: HTMLElement;
  meta: HTMLElement;
}

interface LoadOptions {
  autoplay?: boolean;
  resetSpeed?: boolean;
}

interface RaceSimViewOptions {
  onFinishRequested?: (snapshot: SimulationSnapshot, bootstrap: RealtimeSimulationBootstrap) => void;
}

const SIDEBAR_RENDER_INTERVAL_MS = 1000;

export class RaceSimView {
  private engine: SimulationEngine | null = null;

  private snapshot: SimulationSnapshot | null = null;

  private bootstrap: RealtimeSimulationBootstrap | null = null;

  private timeMultiplier: TimeControlValue = 1;

  private isRunning = false;

  private readonly expandedRiderIds = new Set<number>();

  private animationFrameId: number | null = null;

  private lastFrameTime: number | null = null;

  private lastSidebarRenderTime = Number.NEGATIVE_INFINITY;

  private sidebarSnapshot: SimulationSnapshot | null = null;

  constructor(private readonly elements: RaceSimElements, private readonly options: RaceSimViewOptions = {}) {
    this.elements.controls.addEventListener('click', (event) => {
      const actionButton = (event.target as Element).closest<HTMLButtonElement>('button[data-race-sim-action]');
      if (actionButton) {
        const action = actionButton.dataset['raceSimAction'];
        if (action === 'toggle') {
          if (this.snapshot?.isFinished && this.bootstrap) {
            this.options.onFinishRequested?.(this.snapshot, this.bootstrap);
          } else if (this.isRunning) {
            this.pause();
          } else {
            this.play();
          }
        }
        return;
      }

      const speedButton = (event.target as Element).closest<HTMLButtonElement>('button[data-race-sim-speed]');
      if (!speedButton) return;
      const speedValue = Number(speedButton.dataset['raceSimSpeed']) as TimeControlValue;
      if (!Number.isFinite(speedValue)) return;
      this.timeMultiplier = speedValue;
      this.render();
    });

    this.elements.sidebar.addEventListener('click', (event) => {
      const toggleButton = (event.target as Element).closest<HTMLButtonElement>('button[data-race-sim-rider-toggle]');
      if (!toggleButton) return;
      const riderId = Number(toggleButton.dataset['raceSimRiderToggle']);
      if (!Number.isFinite(riderId)) return;
      if (this.expandedRiderIds.has(riderId)) {
        this.expandedRiderIds.delete(riderId);
      } else {
        this.expandedRiderIds.add(riderId);
      }
      this.render(performance.now(), true);
    });
  }

  public load(bootstrap: RealtimeSimulationBootstrap, options: LoadOptions = {}): void {
    this.pause();
    this.bootstrap = bootstrap;
    this.expandedRiderIds.clear();
    if (options.resetSpeed ?? true) {
      this.timeMultiplier = 1;
    }
    this.engine = new SimulationEngine(bootstrap);
    this.snapshot = this.engine.getSnapshot();
    this.sidebarSnapshot = null;
    this.lastSidebarRenderTime = Number.NEGATIVE_INFINITY;
    this.render(performance.now(), true);

    if (options.autoplay ?? true) {
      this.play();
    }
  }

  public clear(message: string): void {
    this.pause();
    this.engine = null;
    this.snapshot = null;
    this.bootstrap = null;
    this.expandedRiderIds.clear();
    this.sidebarSnapshot = null;
    this.lastSidebarRenderTime = Number.NEGATIVE_INFINITY;
    this.elements.layout.classList.add('hidden');
    this.elements.emptyState.classList.remove('hidden');
    this.elements.emptyState.textContent = message;
  }

  public pause(): void {
    this.isRunning = false;
    this.lastFrameTime = null;
    if (this.animationFrameId != null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.render();
  }

  public play(): void {
    if (!this.engine || !this.snapshot || this.snapshot.isFinished || this.isRunning) {
      this.render();
      return;
    }

    this.isRunning = true;
    this.lastFrameTime = null;
    this.animationFrameId = requestAnimationFrame((timestamp) => this.frame(timestamp));
    this.render();
  }

  public destroy(): void {
    this.pause();
    this.engine = null;
    this.snapshot = null;
    this.bootstrap = null;
    this.expandedRiderIds.clear();
  }

  private frame(timestamp: number): void {
    if (!this.isRunning || !this.engine) {
      return;
    }

    if (this.lastFrameTime == null) {
      this.lastFrameTime = timestamp;
      this.animationFrameId = requestAnimationFrame((frameTime) => this.frame(frameTime));
      return;
    }

    const realDeltaSeconds = Math.min(0.25, (timestamp - this.lastFrameTime) / 1000);
    this.lastFrameTime = timestamp;
    this.snapshot = this.engine.step(realDeltaSeconds * this.timeMultiplier);
    this.render(timestamp);

    if (this.snapshot.isFinished) {
      this.pause();
      return;
    }

    this.animationFrameId = requestAnimationFrame((frameTime) => this.frame(frameTime));
  }

  private render(nowMs = performance.now(), forceSidebar = false): void {
    if (!this.bootstrap || !this.snapshot) {
      return;
    }

    this.elements.layout.classList.remove('hidden');
    this.elements.emptyState.classList.add('hidden');
    this.elements.meta.textContent = `${this.bootstrap.race.name} · Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile} · ${(this.bootstrap.stageSummary.distanceKm).toFixed(1).replace('.', ',')} km`;
    renderRaceProfile(this.elements.profile, this.bootstrap.stageSummary, this.snapshot, `${this.bootstrap.race.name} Etappe ${this.bootstrap.stage.stageNumber}`);

    const shouldRenderSidebar = forceSidebar
      || this.sidebarSnapshot == null
      || this.snapshot.isFinished
      || (nowMs - this.lastSidebarRenderTime) >= SIDEBAR_RENDER_INTERVAL_MS;

    if (shouldRenderSidebar) {
      this.sidebarSnapshot = this.snapshot;
      this.lastSidebarRenderTime = nowMs;
      renderRaceSimSidebar(this.elements.sidebar, this.sidebarSnapshot, this.expandedRiderIds, this.bootstrap);
    }

    renderRaceSimControls(this.elements.controls, {
      isRunning: this.isRunning,
      timeMultiplier: this.timeMultiplier,
      snapshot: this.snapshot,
    });
  }
}