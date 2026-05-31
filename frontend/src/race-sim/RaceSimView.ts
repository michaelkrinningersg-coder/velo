import type { RealtimeSimulationBootstrap } from '../../../shared/types';
import { renderRaceSimControls, type TimeControlValue } from './renderControls';
import type { FavoriteItem } from './stageFavorites';
import { renderRaceMessages, type RaceSimMessageFilter } from './renderMessages';
import { renderRaceProfile, type TimingRailMode } from './renderProfile';
import { renderSelectedRaceGroupBox, renderStageFavorites, type StageOverviewSectionKey } from './renderStageFavorites';
import { handleRaceSimSidebarInteraction, renderRaceSimSidebar, type SidebarRenderTelemetry } from './renderSidebar';
import { SimulationEngine, type SimulationFrameSnapshot, type SimulationSnapshot } from './SimulationEngine';
import { buildNamedRaceGroups, mergeDisplayedClusters, type NamedRaceGroup } from './groupClusters';
import { summarizeStageMarkers } from './stageSummary';

interface RaceSimElements {
  layout: HTMLElement;
  emptyState: HTMLElement;
  controlsHeader: HTMLElement;
  profile: HTMLElement;
  groupBox: HTMLElement;
  messages: HTMLElement;
  favorites: HTMLElement;
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

const PROFILE_RENDER_INTERVAL_MS = 250;
const PROFILE_INTERACTION_HOLD_MS = 1200;
const OVERVIEW_RENDER_INTERVAL_MS = 250;
const OVERVIEW_INTERACTION_HOLD_MS = 1200;
const PERF_SMOOTHING_FACTOR = 0.2;

interface RaceSimPerfTelemetry {
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
}

export class RaceSimView {
  private engine: SimulationEngine | null = null;

  private frameSnapshot: SimulationFrameSnapshot | null = null;

  private detailSnapshot: SimulationSnapshot | null = null;

  private bootstrap: RealtimeSimulationBootstrap | null = null;

  private timeMultiplier: TimeControlValue = 1;

  private isRunning = false;

  private animationFrameId: number | null = null;

  private lastFrameTime: number | null = null;

  private lastSidebarRenderTime = Number.NEGATIVE_INFINITY;

  private timingRailMode: TimingRailMode = 'finish';

  private timingScrollTop = 0;

  private profileInteractionHoldUntilMs = Number.NEGATIVE_INFINITY;

  private lastProfileRenderTime = Number.NEGATIVE_INFINITY;

  private overviewInteractionHoldUntilMs = Number.NEGATIVE_INFINITY;

  private lastOverviewRenderTime = Number.NEGATIVE_INFINITY;

  private sidebarPaintSequence = 0;

  private messageFilter: RaceSimMessageFilter = 'all';

  private favorites: FavoriteItem[] = [];

  private selectedGroupLabel: string | null = null;

  private selectedGroupAnchorRiderId: number | null = null;

  private collapsedOverviewSections = new Set<StageOverviewSectionKey>();

  private perfTelemetry: RaceSimPerfTelemetry = {
    engineStepMs: 0,
    snapshotBuildMs: 0,
    profileRenderMs: 0,
    sidebarRenderMs: 0,
    sidebarWriteMs: 0,
    sidebarPaintMs: 0,
    sidebarPrepMs: 0,
    sidebarSortMs: 0,
    sidebarLayoutMs: 0,
    sidebarCreateRowsMs: 0,
    sidebarRemoveRowsMs: 0,
    sidebarOrderCheckMs: 0,
    sidebarReorderMs: 0,
    sidebarVisibilityMs: 0,
    sidebarUpdateRowsMs: 0,
    sidebarFinalizeMs: 0,
    sidebarRowsTotal: 0,
    sidebarRowsCreated: 0,
    sidebarRowsRemoved: 0,
    sidebarRowsUpdated: 0,
    sidebarRowsSkippedInvisible: 0,
    sidebarOrderChanged: 0,
  };

  constructor(private readonly elements: RaceSimElements, private readonly options: RaceSimViewOptions = {}) {
    this.elements.controls.addEventListener('click', (event) => {
      const actionButton = (event.target as Element).closest<HTMLButtonElement>('button[data-race-sim-action]');
      if (actionButton) {
        const action = actionButton.dataset['raceSimAction'];
        if (action === 'toggle') {
          if (this.frameSnapshot?.isFinished && this.bootstrap) {
            const completedSnapshot = this.engine?.getSnapshot() ?? this.detailSnapshot;
            if (completedSnapshot) {
              this.options.onFinishRequested?.(completedSnapshot, this.bootstrap);
            }
          } else if (this.isRunning) {
            this.pause();
          } else {
            this.play();
          }
        }
        return;
      }

      const speedButton = (event.target as Element).closest<HTMLButtonElement>('button[data-race-sim-speed]');
      if (speedButton) {
        const speedValue = Number(speedButton.dataset['raceSimSpeed']) as TimeControlValue;
        if (!Number.isFinite(speedValue)) return;
        this.timeMultiplier = speedValue;
        this.render();
      }
    });

    this.elements.messages.addEventListener('click', (event) => {
      const riderGroupButton = (event.target as Element).closest<HTMLButtonElement>('button[data-race-sim-group-rider-id]');
      if (riderGroupButton && this.detailSnapshot) {
        const riderId = this.resolveRiderIdFromGroupButton(riderGroupButton);
        if (riderId != null) {
          this.selectGroupByRiderId(riderId, this.detailSnapshot);
        }
        return;
      }

      const riderNameGroupButton = (event.target as Element).closest<HTMLButtonElement>('button[data-race-sim-group-rider-name]');
      if (riderNameGroupButton && this.detailSnapshot) {
        const riderId = this.resolveRiderIdFromGroupButton(riderNameGroupButton);
        if (riderId != null) {
          this.selectGroupByRiderId(riderId, this.detailSnapshot);
        }
        return;
      }

      const filterButton = (event.target as Element).closest<HTMLButtonElement>('button[data-race-sim-message-filter]');
      if (!filterButton || this.detailSnapshot == null) {
        return;
      }

      const nextFilter = filterButton.dataset['raceSimMessageFilter'] as RaceSimMessageFilter | undefined;
      if (!nextFilter) {
        return;
      }

      this.messageFilter = nextFilter;
      this.holdOverviewInteraction();
      renderRaceMessages(this.elements.messages, this.detailSnapshot.messages, this.messageFilter);
    });

    this.elements.favorites.addEventListener('click', (event) => {
      const overviewSummary = (event.target as Element).closest<HTMLElement>('[data-race-sim-overview-summary]');
      if (overviewSummary) {
        const sectionKey = overviewSummary.dataset['raceSimOverviewSummary'] as StageOverviewSectionKey | undefined;
        const detailsElement = overviewSummary.closest<HTMLDetailsElement>('details[data-race-sim-overview-section]');
        if (sectionKey && detailsElement) {
          const willOpen = !detailsElement.open;
          if (willOpen) {
            this.collapsedOverviewSections.delete(sectionKey);
          } else {
            this.collapsedOverviewSections.add(sectionKey);
          }
          this.holdOverviewInteraction();
        }
      }

      this.handleGroupInteraction(event);
    });

    this.elements.groupBox.addEventListener('click', (event) => {
      this.handleGroupInteraction(event);
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
  }

  private handleGroupInteraction(event: Event): void {
    if (!this.detailSnapshot) {
      return;
    }

    const riderGroupButton = (event.target as Element).closest<HTMLButtonElement>('button[data-race-sim-group-rider-id]');
    if (riderGroupButton) {
      const riderId = this.resolveRiderIdFromGroupButton(riderGroupButton);
      if (riderId != null) {
        this.selectGroupByRiderId(riderId, this.detailSnapshot);
      }
      return;
    }

    const groupNavButton = (event.target as Element).closest<HTMLButtonElement>('button[data-race-sim-group-nav]');
    if (!groupNavButton) {
      return;
    }

    const groups = this.buildRaceGroups(this.detailSnapshot);
    if (groups.length === 0) {
      return;
    }

    const currentLabel = this.resolveSelectedGroupLabel(this.detailSnapshot);
    const currentIndex = Math.max(0, groups.findIndex((group) => group.label === currentLabel));
    const direction = groupNavButton.dataset['raceSimGroupNav'] === 'prev' ? -1 : 1;
    const nextIndex = (currentIndex + direction + groups.length) % groups.length;
    const nextLabel = groups[nextIndex]?.label ?? currentLabel;
    this.selectGroupByLabel(nextLabel, this.detailSnapshot);

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

    this.elements.sidebar.parentElement?.addEventListener('click', (event) => {
      if (!this.bootstrap || !this.detailSnapshot) {
        return;
      }

      const handled = handleRaceSimSidebarInteraction(this.elements.sidebar, event.target as Element);
      if (!handled) {
        return;
      }

      const sidebarRenderStartMs = performance.now();
      const sidebarTelemetry = renderRaceSimSidebar(this.elements.sidebar, this.detailSnapshot, this.bootstrap);
      this.recordSidebarPerfTelemetry(sidebarTelemetry);
      const sidebarWriteMs = performance.now() - sidebarRenderStartMs;
      this.recordPerfTelemetry('sidebarWriteMs', sidebarWriteMs);
      this.scheduleSidebarPaintTelemetry(sidebarRenderStartMs, sidebarWriteMs);
      this.lastSidebarRenderTime = performance.now();
    });

  }

  public load(bootstrap: RealtimeSimulationBootstrap, options: LoadOptions = {}): void {
    this.pause();
    this.bootstrap = bootstrap;
    if (options.resetSpeed ?? true) {
      this.timeMultiplier = 1;
    }
    this.timingRailMode = 'finish';
    this.engine = new SimulationEngine(bootstrap);
    this.detailSnapshot = this.engine.getSnapshot();
    this.frameSnapshot = this.detailSnapshot;
    this.favorites = this.detailSnapshot.stageFavorites;
    this.collapsedOverviewSections.clear();
    const initialGroups = this.buildRaceGroups(this.detailSnapshot);
    this.selectGroupByLabel(this.resolveInitialGroupLabel(initialGroups), this.detailSnapshot, false);
    this.lastSidebarRenderTime = Number.NEGATIVE_INFINITY;
    this.lastProfileRenderTime = Number.NEGATIVE_INFINITY;
    this.lastOverviewRenderTime = Number.NEGATIVE_INFINITY;
    this.timingScrollTop = 0;
    this.profileInteractionHoldUntilMs = Number.NEGATIVE_INFINITY;
    this.overviewInteractionHoldUntilMs = Number.NEGATIVE_INFINITY;
    this.resetPerfTelemetry();
    this.render(performance.now(), true);

    if (options.autoplay ?? true) {
      this.play();
    }
  }

  public clear(message: string): void {
    this.pause();
    this.engine = null;
    this.frameSnapshot = null;
    this.detailSnapshot = null;
    this.bootstrap = null;
    this.lastSidebarRenderTime = Number.NEGATIVE_INFINITY;
    this.lastProfileRenderTime = Number.NEGATIVE_INFINITY;
    this.lastOverviewRenderTime = Number.NEGATIVE_INFINITY;
    this.timingScrollTop = 0;
    this.profileInteractionHoldUntilMs = Number.NEGATIVE_INFINITY;
    this.overviewInteractionHoldUntilMs = Number.NEGATIVE_INFINITY;
    this.resetPerfTelemetry();
    this.favorites = [];
    this.selectedGroupLabel = null;
    this.selectedGroupAnchorRiderId = null;
    this.collapsedOverviewSections.clear();
    this.elements.layout.classList.add('hidden');
    this.elements.controlsHeader.classList.add('hidden');
    this.elements.emptyState.classList.remove('hidden');
    this.elements.emptyState.textContent = message;
    this.elements.groupBox.innerHTML = '';
    this.elements.messages.innerHTML = '';
    this.elements.favorites.innerHTML = '';
    this.elements.meta.textContent = '';
  }

  public hide(): void {
    this.pause();
    this.engine = null;
    this.frameSnapshot = null;
    this.detailSnapshot = null;
    this.bootstrap = null;
    this.lastSidebarRenderTime = Number.NEGATIVE_INFINITY;
    this.lastProfileRenderTime = Number.NEGATIVE_INFINITY;
    this.lastOverviewRenderTime = Number.NEGATIVE_INFINITY;
    this.timingScrollTop = 0;
    this.profileInteractionHoldUntilMs = Number.NEGATIVE_INFINITY;
    this.overviewInteractionHoldUntilMs = Number.NEGATIVE_INFINITY;
    this.resetPerfTelemetry();
    this.favorites = [];
    this.selectedGroupLabel = null;
    this.selectedGroupAnchorRiderId = null;
    this.collapsedOverviewSections.clear();
    this.elements.layout.classList.add('hidden');
    this.elements.controlsHeader.classList.add('hidden');
    this.elements.emptyState.classList.add('hidden');
    this.elements.groupBox.innerHTML = '';
    this.elements.messages.innerHTML = '';
    this.elements.favorites.innerHTML = '';
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
    if (!this.engine || !this.frameSnapshot || this.frameSnapshot.isFinished || this.isRunning) {
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
    this.frameSnapshot = null;
    this.detailSnapshot = null;
    this.bootstrap = null;
    this.selectedGroupLabel = null;
    this.selectedGroupAnchorRiderId = null;
    this.collapsedOverviewSections.clear();
    this.elements.controlsHeader.classList.add('hidden');
    this.elements.groupBox.innerHTML = '';
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
    const engineStepStartMs = performance.now();
    this.frameSnapshot = this.engine.step(realDeltaSeconds * this.timeMultiplier);
    this.recordPerfTelemetry('engineStepMs', performance.now() - engineStepStartMs);
    this.render(timestamp);

    if (this.frameSnapshot.isFinished) {
      this.detailSnapshot = this.engine.getSnapshot();
      this.pause();
      return;
    }

    this.animationFrameId = requestAnimationFrame((frameTime) => this.frame(frameTime));
  }

  private render(nowMs = performance.now(), forceSidebar = false): void {
    if (!this.bootstrap || !this.frameSnapshot) {
      return;
    }

    this.elements.layout.classList.remove('hidden');
    this.elements.controlsHeader.classList.remove('hidden');
    this.elements.emptyState.classList.add('hidden');
    const ittSuffix = this.bootstrap.stage.profile === 'ITT'
      ? ' · Einzelzeitfahren · Startintervall 02:00'
      : '';
    const stageMeta = summarizeStageMarkers(this.bootstrap.stageSummary);
    const markerMeta = [
      `${stageMeta.segmentCount} Segmente`,
      stageMeta.sprintCount > 0 ? `${stageMeta.sprintCount} Sprint${stageMeta.sprintCount === 1 ? '' : 's'}` : null,
      stageMeta.climbCount > 0 ? `${stageMeta.climbCount} Bergwertung${stageMeta.climbCount === 1 ? '' : 'en'}` : null,
    ].filter((value): value is string => value != null).join(' · ');
    this.elements.meta.textContent = `${this.bootstrap.race.name} · Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile} · ${(this.bootstrap.stageSummary.distanceKm).toFixed(1).replace('.', ',')} km${ittSuffix}${markerMeta ? ` · ${markerMeta}` : ''}`;

    const shouldRenderProfile = forceSidebar
      || !this.isRunning
      || this.frameSnapshot.isFinished
      || (
        nowMs >= this.profileInteractionHoldUntilMs
        && (nowMs - this.lastProfileRenderTime) >= PROFILE_RENDER_INTERVAL_MS
      );

    const shouldRenderSidebar = forceSidebar
      || this.detailSnapshot == null
      || this.frameSnapshot.isFinished
      || this.isRunning;

    const shouldRenderOverview = forceSidebar
      || !this.isRunning
      || this.frameSnapshot.isFinished
      || (
        nowMs >= this.overviewInteractionHoldUntilMs
        && (nowMs - this.lastOverviewRenderTime) >= OVERVIEW_RENDER_INTERVAL_MS
      );

    if (shouldRenderProfile || shouldRenderSidebar || shouldRenderOverview) {
      const snapshotBuildStartMs = performance.now();
      this.detailSnapshot = this.engine?.getSnapshot() ?? this.detailSnapshot;
      if (this.detailSnapshot) {
        this.selectedGroupLabel = this.resolveSelectedGroupLabel(this.detailSnapshot);
      }
      this.recordPerfTelemetry('snapshotBuildMs', performance.now() - snapshotBuildStartMs);
    }

    if (shouldRenderProfile && this.detailSnapshot) {
      const currentTimingScroll = this.elements.profile.querySelector<HTMLElement>('.race-sim-timing-scroll');
      if (currentTimingScroll) {
        this.timingScrollTop = currentTimingScroll.scrollTop;
      }
      const profileRenderStartMs = performance.now();
      renderRaceProfile(this.elements.profile, this.bootstrap.stageSummary, this.detailSnapshot, `${this.bootstrap.race.name} Etappe ${this.bootstrap.stage.stageNumber}`, this.bootstrap, this.timingRailMode, this.selectedGroupLabel);
      this.recordPerfTelemetry('profileRenderMs', performance.now() - profileRenderStartMs);
      this.lastProfileRenderTime = nowMs;
      const nextTimingScroll = this.elements.profile.querySelector<HTMLElement>('.race-sim-timing-scroll');
      if (nextTimingScroll) {
        nextTimingScroll.scrollTop = this.timingScrollTop;
      }
    }

    if (shouldRenderSidebar && this.detailSnapshot) {
      this.lastSidebarRenderTime = nowMs;
      const sidebarRenderStartMs = performance.now();
      const sidebarTelemetry = renderRaceSimSidebar(this.elements.sidebar, this.detailSnapshot, this.bootstrap);
      this.recordSidebarPerfTelemetry(sidebarTelemetry);
      const sidebarWriteMs = performance.now() - sidebarRenderStartMs;
      this.recordPerfTelemetry('sidebarWriteMs', sidebarWriteMs);
      this.scheduleSidebarPaintTelemetry(sidebarRenderStartMs, sidebarWriteMs);
    }

    if (shouldRenderOverview && this.detailSnapshot) {
      renderRaceMessages(this.elements.messages, this.detailSnapshot.messages, this.messageFilter);
      renderStageFavorites(this.elements.favorites, this.favorites, this.bootstrap, this.detailSnapshot.markerClassifications, this.detailSnapshot, this.collapsedOverviewSections);
      renderSelectedRaceGroupBox(this.elements.groupBox, this.bootstrap, this.detailSnapshot, this.selectedGroupLabel);
      this.lastOverviewRenderTime = nowMs;
    }

    renderRaceSimControls(this.elements.controls, {
      isRunning: this.isRunning,
      timeMultiplier: this.timeMultiplier,
      snapshot: this.frameSnapshot,
      totalRiders: this.bootstrap.riders.length,
      perf: this.perfTelemetry,
    });
  }

  private resolveSelectedGroupLabel(snapshot: SimulationSnapshot): string | null {
    const groups = this.buildRaceGroups(snapshot);
    if (this.selectedGroupAnchorRiderId != null) {
      const anchoredGroup = groups.find((group) => group.riderIds.includes(this.selectedGroupAnchorRiderId ?? -1)) ?? null;
      if (anchoredGroup) {
        return anchoredGroup.label;
      }
    }

    if (this.selectedGroupLabel != null && groups.some((group) => group.label === this.selectedGroupLabel)) {
      return this.selectedGroupLabel;
    }

    return this.resolveInitialGroupLabel(groups);
  }

  private buildRaceGroups(snapshot: SimulationSnapshot): NamedRaceGroup[] {
    return buildNamedRaceGroups(mergeDisplayedClusters(snapshot.clusters));
  }

  private resolveInitialGroupLabel(groups: NamedRaceGroup[]): string | null {
    return groups.find((group) => group.label === 'P')?.label ?? groups[0]?.label ?? null;
  }

  private resolveBestRiderIdInGroup(group: NamedRaceGroup | null): number | null {
    if (!group || !this.bootstrap) {
      return null;
    }

    const gcByRiderId = new Map(this.bootstrap.gcStandings.map((standing) => [standing.riderId, standing]));
    return [...group.riderIds].sort((left, right) => (
      (gcByRiderId.get(left)?.rank ?? Number.MAX_SAFE_INTEGER) - (gcByRiderId.get(right)?.rank ?? Number.MAX_SAFE_INTEGER)
      || left - right
    ))[0] ?? null;
  }

  private selectGroupByLabel(label: string | null, snapshot: SimulationSnapshot, rerender = true): void {
    const groups = this.buildRaceGroups(snapshot);
    const selectedGroup = groups.find((group) => group.label === label) ?? groups.find((group) => group.label === 'P') ?? groups[0] ?? null;
    this.selectedGroupLabel = selectedGroup?.label ?? null;
    this.selectedGroupAnchorRiderId = this.resolveBestRiderIdInGroup(selectedGroup);
    if (rerender) {
      this.profileInteractionHoldUntilMs = performance.now() + PROFILE_INTERACTION_HOLD_MS;
      this.holdOverviewInteraction();
      this.lastProfileRenderTime = Number.NEGATIVE_INFINITY;
      this.render(performance.now(), true);
    }
  }

  private selectGroupByRiderId(riderId: number, snapshot: SimulationSnapshot): void {
    const groups = this.buildRaceGroups(snapshot);
    const selectedGroup = groups.find((group) => group.riderIds.includes(riderId)) ?? null;
    if (!selectedGroup) {
      return;
    }

    this.selectedGroupLabel = selectedGroup.label;
    this.selectedGroupAnchorRiderId = riderId;
    this.profileInteractionHoldUntilMs = performance.now() + PROFILE_INTERACTION_HOLD_MS;
    this.holdOverviewInteraction();
    this.lastProfileRenderTime = Number.NEGATIVE_INFINITY;
    this.render(performance.now(), true);
  }

  private holdOverviewInteraction(): void {
    this.overviewInteractionHoldUntilMs = performance.now() + OVERVIEW_INTERACTION_HOLD_MS;
    this.lastOverviewRenderTime = Number.NEGATIVE_INFINITY;
  }

  private resolveRiderIdFromGroupButton(button: HTMLButtonElement): number | null {
    const riderId = Number(button.dataset['raceSimGroupRiderId']);
    if (Number.isFinite(riderId)) {
      return riderId;
    }

    if (!this.bootstrap) {
      return null;
    }

    const riderName = button.dataset['raceSimGroupRiderName'];
    if (!riderName) {
      return null;
    }

    const riderTeamId = button.dataset['raceSimGroupRiderTeamId'] != null ? Number(button.dataset['raceSimGroupRiderTeamId']) : null;
    const rider = this.bootstrap.riders.find((candidate) => {
      const candidateName = `${candidate.firstName} ${candidate.lastName}`;
      return candidateName === riderName && (riderTeamId == null || candidate.activeTeamId === riderTeamId);
    }) ?? null;
    return rider?.id ?? null;
  }

  private resetPerfTelemetry(): void {
    this.perfTelemetry = {
      engineStepMs: 0,
      snapshotBuildMs: 0,
      profileRenderMs: 0,
      sidebarRenderMs: 0,
      sidebarWriteMs: 0,
      sidebarPaintMs: 0,
      sidebarPrepMs: 0,
      sidebarSortMs: 0,
      sidebarLayoutMs: 0,
      sidebarCreateRowsMs: 0,
      sidebarRemoveRowsMs: 0,
      sidebarOrderCheckMs: 0,
      sidebarReorderMs: 0,
      sidebarVisibilityMs: 0,
      sidebarUpdateRowsMs: 0,
      sidebarFinalizeMs: 0,
      sidebarRowsTotal: 0,
      sidebarRowsCreated: 0,
      sidebarRowsRemoved: 0,
      sidebarRowsUpdated: 0,
      sidebarRowsSkippedInvisible: 0,
      sidebarOrderChanged: 0,
    };
  }

  private recordPerfTelemetry(key: keyof RaceSimPerfTelemetry, sampleMs: number): void {
    const currentValue = this.perfTelemetry[key];
    this.perfTelemetry[key] = currentValue <= 0
      ? sampleMs
      : (currentValue * (1 - PERF_SMOOTHING_FACTOR)) + (sampleMs * PERF_SMOOTHING_FACTOR);
  }

  private recordSidebarPerfTelemetry(telemetry: SidebarRenderTelemetry): void {
    this.recordPerfTelemetry('sidebarRenderMs', telemetry.totalMs);
    this.recordPerfTelemetry('sidebarPrepMs', telemetry.prepMs);
    this.recordPerfTelemetry('sidebarSortMs', telemetry.sortMs);
    this.recordPerfTelemetry('sidebarLayoutMs', telemetry.layoutMs);
    this.recordPerfTelemetry('sidebarCreateRowsMs', telemetry.createRowsMs);
    this.recordPerfTelemetry('sidebarRemoveRowsMs', telemetry.removeRowsMs);
    this.recordPerfTelemetry('sidebarOrderCheckMs', telemetry.orderCheckMs);
    this.recordPerfTelemetry('sidebarReorderMs', telemetry.reorderMs);
    this.recordPerfTelemetry('sidebarVisibilityMs', telemetry.visibilityMs);
    this.recordPerfTelemetry('sidebarUpdateRowsMs', telemetry.updateRowsMs);
    this.recordPerfTelemetry('sidebarFinalizeMs', telemetry.finalizeMs);
    this.perfTelemetry.sidebarRowsTotal = telemetry.rowsTotal;
    this.perfTelemetry.sidebarRowsCreated = telemetry.rowsCreated;
    this.perfTelemetry.sidebarRowsRemoved = telemetry.rowsRemoved;
    this.perfTelemetry.sidebarRowsUpdated = telemetry.rowsUpdated;
    this.perfTelemetry.sidebarRowsSkippedInvisible = telemetry.rowsSkippedInvisible;
    this.perfTelemetry.sidebarOrderChanged = telemetry.orderChanged;
  }

  private scheduleSidebarPaintTelemetry(renderStartMs: number, sidebarWriteMs: number): void {
    const sequence = ++this.sidebarPaintSequence;
    requestAnimationFrame(() => {
      if (sequence !== this.sidebarPaintSequence) {
        return;
      }

      const paintMs = Math.max(0, performance.now() - renderStartMs - sidebarWriteMs);
      this.recordPerfTelemetry('sidebarPaintMs', paintMs);
      this.refreshControls();
    });
  }

  private refreshControls(): void {
    if (!this.bootstrap || !this.frameSnapshot) {
      return;
    }

    renderRaceSimControls(this.elements.controls, {
      isRunning: this.isRunning,
      timeMultiplier: this.timeMultiplier,
      snapshot: this.frameSnapshot,
      totalRiders: this.bootstrap.riders.length,
      perf: this.perfTelemetry,
    });
  }
}