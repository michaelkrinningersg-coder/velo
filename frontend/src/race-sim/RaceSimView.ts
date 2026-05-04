import type { RealtimeSimulationBootstrap } from '../../../shared/types';
import { renderRaceSimControls, type TimeControlValue } from './renderControls';
import { renderRaceProfile, type TimingRailMode } from './renderProfile';
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
const PROFILE_INTERACTION_HOLD_MS = 1200;

export class RaceSimView {
  private engine: SimulationEngine | null = null;

  private snapshot: SimulationSnapshot | null = null;

  private bootstrap: RealtimeSimulationBootstrap | null = null;

  private timeMultiplier: TimeControlValue = 1;

  private isRunning = false;

  private animationFrameId: number | null = null;

  private lastFrameTime: number | null = null;

  private lastSidebarRenderTime = Number.NEGATIVE_INFINITY;

  private sidebarSnapshot: SimulationSnapshot | null = null;

  private timingRailMode: TimingRailMode = 'finish';

  private timingScrollTop = 0;

  private profileInteractionHoldUntilMs = Number.NEGATIVE_INFINITY;

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

    this.elements.profile.addEventListener('click', (event) => {
      const modeButton = (event.target as Element).closest<HTMLButtonElement>('button[data-race-sim-timing-mode]');
      if (!modeButton) return;
      const nextMode = modeButton.dataset['raceSimTimingMode'];
      if (!nextMode || (nextMode !== 'finish' && !nextMode.startsWith('split:'))) return;
      this.timingRailMode = nextMode as TimingRailMode;
      this.timingScrollTop = 0;
      this.profileInteractionHoldUntilMs = performance.now() + PROFILE_INTERACTION_HOLD_MS;
      this.render();
    });

    this.elements.profile.addEventListener('pointerdown', (event) => {
      const timingScroll = (event.target as Element).closest<HTMLElement>('.race-sim-timing-scroll');
      if (!timingScroll) {
        return;
      }
      this.timingScrollTop = timingScroll.scrollTop;
      this.profileInteractionHoldUntilMs = performance.now() + PROFILE_INTERACTION_HOLD_MS;
    });

    this.elements.profile.addEventListener('wheel', (event) => {
      const timingScroll = (event.target as Element).closest<HTMLElement>('.race-sim-timing-scroll');
      if (!timingScroll) {
        return;
      }
      this.timingScrollTop = timingScroll.scrollTop;
      this.profileInteractionHoldUntilMs = performance.now() + PROFILE_INTERACTION_HOLD_MS;
    }, { passive: true });

    this.elements.profile.addEventListener('scroll', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || !target.classList.contains('race-sim-timing-scroll')) {
        return;
      }
      this.timingScrollTop = target.scrollTop;
      this.profileInteractionHoldUntilMs = performance.now() + PROFILE_INTERACTION_HOLD_MS;
    }, true);

  }

  public load(bootstrap: RealtimeSimulationBootstrap, options: LoadOptions = {}): void {
    this.pause();
    this.bootstrap = bootstrap;
    if (options.resetSpeed ?? true) {
      this.timeMultiplier = 1;
    }
    this.timingRailMode = 'finish';
    this.engine = new SimulationEngine(bootstrap);
    this.snapshot = this.engine.getSnapshot();
    this.sidebarSnapshot = null;
    this.lastSidebarRenderTime = Number.NEGATIVE_INFINITY;
    this.timingScrollTop = 0;
    this.profileInteractionHoldUntilMs = Number.NEGATIVE_INFINITY;
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
    this.sidebarSnapshot = null;
    this.lastSidebarRenderTime = Number.NEGATIVE_INFINITY;
    this.timingScrollTop = 0;
    this.profileInteractionHoldUntilMs = Number.NEGATIVE_INFINITY;
    this.elements.layout.classList.add('hidden');
    this.elements.emptyState.classList.remove('hidden');
    this.elements.emptyState.textContent = message;
    this.elements.meta.textContent = '';
  }

  public hide(): void {
    this.pause();
    this.engine = null;
    this.snapshot = null;
    this.bootstrap = null;
    this.sidebarSnapshot = null;
    this.lastSidebarRenderTime = Number.NEGATIVE_INFINITY;
    this.timingScrollTop = 0;
    this.profileInteractionHoldUntilMs = Number.NEGATIVE_INFINITY;
    this.elements.layout.classList.add('hidden');
    this.elements.emptyState.classList.add('hidden');
    this.elements.meta.textContent = '';
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
    const ittSuffix = this.bootstrap.stage.profile === 'ITT'
      ? ' · Einzelzeitfahren · Startintervall 02:00'
      : '';
    this.elements.meta.textContent = `${this.bootstrap.race.name} · Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile} · ${(this.bootstrap.stageSummary.distanceKm).toFixed(1).replace('.', ',')} km${ittSuffix}`;
    const currentTimingScroll = this.elements.profile.querySelector<HTMLElement>('.race-sim-timing-scroll');
    if (currentTimingScroll) {
      this.timingScrollTop = currentTimingScroll.scrollTop;
    }

    const shouldRenderProfile = forceSidebar
      || !this.isRunning
      || nowMs >= this.profileInteractionHoldUntilMs;

    if (shouldRenderProfile) {
      renderRaceProfile(this.elements.profile, this.bootstrap.stageSummary, this.snapshot, `${this.bootstrap.race.name} Etappe ${this.bootstrap.stage.stageNumber}`, this.bootstrap, this.timingRailMode);
      const nextTimingScroll = this.elements.profile.querySelector<HTMLElement>('.race-sim-timing-scroll');
      if (nextTimingScroll) {
        nextTimingScroll.scrollTop = this.timingScrollTop;
      }
    }

    const shouldRenderSidebar = forceSidebar
      || this.sidebarSnapshot == null
      || this.snapshot.isFinished
      || (nowMs - this.lastSidebarRenderTime) >= SIDEBAR_RENDER_INTERVAL_MS;

    if (shouldRenderSidebar) {
      this.sidebarSnapshot = this.snapshot;
      this.lastSidebarRenderTime = nowMs;
      renderRaceSimSidebar(this.elements.sidebar, this.sidebarSnapshot, this.bootstrap);
    }

    renderRaceSimControls(this.elements.controls, {
      isRunning: this.isRunning,
      timeMultiplier: this.timeMultiplier,
      snapshot: this.snapshot,
    });
  }
}