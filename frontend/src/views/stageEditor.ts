import { api } from '../api';
import {
  $,
  esc,
  state,
  formatDate,
  renderFlag,
  isActiveView,
  activateView,
  showModal,
  hideModal,
  showLoading,
  hideLoading,
  downloadTextFile,
} from '../state';
import type {
  StageEditorStagesSortKey,
  StageEditorClimbsSortKey,
} from '../state';
import type {
  StageEditorDraft,
  StageEditorExistingStageOption,
  StageEditorStageOverviewRow,
  StageEditorClimbOverviewRow,
  StageEditorSegment,
  StageEditorMetadata,
  StageEditorWaypoint,
  StageMarker,
  StageMarkerCategory,
  StageMarkerType,
  StageProfile,
  StageTerrain,
  StageEditorClimb,
} from '../../../shared/types';
import {
  getStageDisplayName,
  buildDashboardStageProfileLabel,
  renderStageProfileBadge,
  openDashboardStageProfile,
} from './dashboard';

// Constants
export const STAGE_PROFILE_OPTIONS: StageProfile[] = [
  'Flat',
  'Rolling',
  'Hilly',
  'Hilly_Difficult',
  'Medium_Mountain',
  'Mountain',
  'High_Mountain',
  'ITT',
  'TTT',
  'Cobble',
  'Cobble_Hill',
];

export const STAGE_TERRAIN_OPTIONS: StageTerrain[] = ['Flat', 'Hill', 'Medium_Mountain', 'Mountain', 'High_Mountain', 'Cobble', 'Cobble_Hill', 'Abfahrt', 'Sprint'];
export const STAGE_MARKER_TYPES: StageMarkerType[] = ['start', 'climb_start', 'climb_top', 'sprint_intermediate', 'finish_flat', 'finish_TT', 'finish_hill', 'finish_mountain'];
export const STAGE_MARKER_CATEGORIES: StageMarkerCategory[] = ['Sprint', '4', '3', '2', '1', 'HC'];
export const STAGE_EDITOR_MIN_SEGMENT_KM = 0.2;
export const STAGE_EDITOR_SPRINT_CUT_KM = 0.3;
export const STAGE_EDITOR_TABLE_COLUMN_COUNT = 7;
export const STAGE_EDITOR_CLIMB_MIN_GAIN_METERS = 100;
export const STAGE_EDITOR_CLIMB_MIN_AVG_GRADIENT = 3;
export const STAGE_EDITOR_CLIMB_BREAK_DESCENT_METERS = 50;
export const STAGE_EDITOR_AUTO_DESCENT_MIN_GRADIENT = -2;
export const STAGE_EDITOR_AUTO_DESCENT_MIN_DISTANCE_KM = 1;
export const STAGE_EDITOR_AUTO_FLAT_MAX_GRADIENT = 2.5;
export const STAGE_EDITOR_AUTO_DESCENT_STRONG_GRADIENT = -3;
export const STAGE_EDITOR_SEGMENT_MIN_HILL_GAIN_METERS = 15;
export const STAGE_EDITOR_AUTO_MEDIUM_MIN_GAIN_METERS = 200;
export const STAGE_EDITOR_AUTO_MOUNTAIN_MIN_GAIN_METERS = 600;
export const STAGE_EDITOR_AUTO_MOUNTAIN_MIN_TOP_METERS = 850;

// Type Helpers
export function isFinishMarkerType(markerType: StageMarkerType): markerType is Extract<StageMarkerType, 'finish_flat' | 'finish_TT' | 'finish_hill' | 'finish_mountain'> {
  return ['finish_flat', 'finish_TT', 'finish_hill', 'finish_mountain'].includes(markerType);
}

export function isMountainFinishMarkerType(markerType: StageMarkerType): boolean {
  return markerType === 'finish_hill' || markerType === 'finish_mountain';
}

export function hasClimbMarkerCategory(category: StageMarkerCategory | null | undefined): category is Exclude<StageMarkerCategory, 'Sprint'> {
  return category != null && ['HC', '1', '2', '3', '4'].includes(category);
}

export function isMountainClassificationMarkerType(markerType: StageMarkerType, markerCategory: StageMarkerCategory | null | undefined): boolean {
  return markerType === 'climb_top' || (isMountainFinishMarkerType(markerType) && hasClimbMarkerCategory(markerCategory));
}

// Helpers
export function roundStageEditorOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

export function roundStageEditorKm(value: number): number {
  return Number(value.toFixed(2));
}

export function formatKm(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} km`;
}

export function formatElevationGain(value: number): string {
  return `${Math.round(value)} hm`;
}

export function formatGradient(value: number): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1).replace('.', ',')}%`;
}

export function slugifyFileName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60) || 'stage_details';
}

export function stageProfileOptionsHtml(selected?: StageProfile): string {
  return STAGE_PROFILE_OPTIONS.map((profile) =>
    `<option value="${profile}"${profile === selected ? ' selected' : ''}>${esc(profile)}</option>`).join('');
}

export function terrainOptionsHtml(selected: StageTerrain): string {
  return STAGE_TERRAIN_OPTIONS.map((terrain) =>
    `<option value="${terrain}"${terrain === selected ? ' selected' : ''}>${esc(terrain)}</option>`).join('');
}

export function markerTypeOptionsHtml(selected: StageMarkerType, scope: 'start' | 'end' = 'start', segmentIndex = 0, totalSegments = 1): string {
  const allowedTypes = STAGE_MARKER_TYPES.filter((markerType) => {
    if (scope === 'start') {
      if (markerType === 'start') return segmentIndex === 0;
      return markerType === 'climb_start';
    }

    if (markerType === 'start' || markerType === 'climb_start') {
      return false;
    }
    if (isFinishMarkerType(markerType)) {
      return segmentIndex === totalSegments - 1;
    }
    return markerType === 'climb_top' || markerType === 'sprint_intermediate';
  });

  const optionTypes = allowedTypes.includes(selected)
    ? allowedTypes
    : [selected, ...allowedTypes.filter((markerType) => markerType !== selected)];

  return optionTypes.map((markerType) =>
    `<option value="${markerType}"${markerType === selected ? ' selected' : ''}>${esc(markerType)}</option>`).join('');
}

export function markerCategoryOptionsHtml(selected: StageMarkerCategory | null): string {
  return ['<option value="">–</option>', ...STAGE_MARKER_CATEGORIES.map((category) =>
    `<option value="${category}"${category === selected ? ' selected' : ''}>${esc(category)}</option>`),
  ].join('');
}

export function markerTypeSortValue(markerType: StageMarkerType): number {
  return STAGE_MARKER_TYPES.indexOf(markerType);
}

export function sortStageMarkers(markers: StageMarker[]): StageMarker[] {
  return [...markers].sort((left, right) => markerTypeSortValue(left.type) - markerTypeSortValue(right.type));
}

export function buildStageEditorWaypointsFromSegments(segments: StageEditorSegment[]): StageEditorWaypoint[] {
  if (segments.length === 0) return [];

  const waypoints: StageEditorWaypoint[] = [{
    kmMark: 0,
    elevation: segments[0].startElevation,
    terrain: segments[0].terrain,
    techLevel: segments[0].techLevel,
    windExp: segments[0].windExp,
    markers: sortStageMarkers(segments[0].markers),
  }];

  let cumulativeKm = 0;
  segments.forEach((segment) => {
    cumulativeKm = roundStageEditorKm(cumulativeKm + segment.lengthKm);
    const endElevation = Math.round(segment.startElevation + ((segment.lengthKm * 1000) * (segment.gradientPercent / 100)));
    const previousWaypoint = waypoints[waypoints.length - 1];
    previousWaypoint.terrain = segment.terrain;
    previousWaypoint.techLevel = segment.techLevel;
    previousWaypoint.windExp = segment.windExp;
    previousWaypoint.markers = sortStageMarkers([...previousWaypoint.markers, ...segment.markers]);

    waypoints.push({
      kmMark: cumulativeKm,
      elevation: endElevation,
      terrain: segment.terrain,
      techLevel: segment.techLevel,
      windExp: segment.windExp,
      markers: sortStageMarkers(segment.endMarkers),
    });
  });

  return waypoints;
}

export function stageEditorFieldErrorClass(hasError: boolean): string {
  return hasError ? ' stage-editor-input-invalid' : '';
}

export function getStageEditorSegmentIssuesAt(draft: StageEditorDraft, segmentIndex: number): string[] {
  const segment = draft.segments[segmentIndex];
  if (!segment) return [];
  const issues: string[] = [];
  const climbPairIssues = collectStageEditorClimbPairIssues(draft).get(segmentIndex) ?? [];
  if (segment.lengthKm < STAGE_EDITOR_MIN_SEGMENT_KM) {
    issues.push(`Laenge unter ${STAGE_EDITOR_MIN_SEGMENT_KM.toFixed(1).replace('.', ',')} km.`);
  }
  if (segment.techLevel < 1 || segment.techLevel > 10) {
    issues.push('Tech ausserhalb 1-10.');
  }
  if (segment.windExp < 1 || segment.windExp > 10) {
    issues.push('Wind ausserhalb 1-10.');
  }
  if (segmentIndex === 0 && !segment.markers.some((marker) => marker.type === 'start')) {
    issues.push('Startmarker fehlt am ersten Segment.');
  }
  if (segmentIndex < draft.segments.length - 1 && segment.endMarkers.some((marker) => isFinishMarkerType(marker.type))) {
    issues.push('Finish nur am Endmarker des letzten Segments.');
  }
  if (segmentIndex > 0 && segment.markers.some((marker) => marker.type === 'start')) {
    issues.push('Startmarker nur am ersten Segment erlaubt.');
  }
  if (segmentIndex === draft.segments.length - 1 && !segment.endMarkers.some((marker) => isFinishMarkerType(marker.type))) {
    issues.push('Finishmarker fehlt am letzten Segmentende.');
  }

  segment.markers.forEach((marker) => {
    if (isFinishMarkerType(marker.type)) {
      issues.push('Finishmarker gehoert in den Endmarker-Slot.');
    }
    if (marker.type === 'climb_top') {
      issues.push('climb_top gehoert in den Endmarker-Slot.');
    }
    if (marker.type === 'sprint_intermediate') {
      issues.push('Sprintmarker gehoert in den Endmarker-Slot.');
    }
  });

  segment.endMarkers.forEach((marker) => {
    if (marker.type === 'start' || marker.type === 'climb_start') {
      issues.push(`${marker.type} gehoert in den Startmarker-Slot.`);
    }
    if (isMountainClassificationMarkerType(marker.type, marker.cat) && !hasClimbMarkerCategory(marker.cat)) {
      issues.push(`${marker.type} braucht Kategorie HC oder 1-4.`);
    }
  });

  [...segment.markers, ...segment.endMarkers].forEach((marker) => {
    if (marker.type === 'sprint_intermediate' && marker.cat != null && marker.cat !== 'Sprint') {
      issues.push('Sprintmarker erlaubt nur Kategorie Sprint.');
    }
    if (isFinishMarkerType(marker.type) && !isMountainFinishMarkerType(marker.type) && marker.cat != null) {
      issues.push('finish_flat und finish_TT duerfen keine Kategorie haben.');
    }
    if (isMountainFinishMarkerType(marker.type) && marker.cat != null && !hasClimbMarkerCategory(marker.cat)) {
      issues.push(`${marker.type} erlaubt nur Kategorie HC oder 1-4.`);
    }
  });

  issues.push(...climbPairIssues);

  return [...new Set(issues)];
}

export function collectStageEditorClimbPairIssues(draft: StageEditorDraft): Map<number, string[]> {
  const issuesBySegment = new Map<number, string[]>();
  const openClimbs: Array<{ name: string | null; segmentIndex: number }> = [];

  const pushIssue = (segmentIndex: number, issue: string): void => {
    const bucket = issuesBySegment.get(segmentIndex) ?? [];
    bucket.push(issue);
    issuesBySegment.set(segmentIndex, bucket);
  };

  draft.segments.forEach((segment, segmentIndex) => {
    segment.markers.forEach((marker) => {
      if (marker.type !== 'climb_start') {
        return;
      }

      openClimbs.push({ name: marker.name ?? null, segmentIndex });
    });

    segment.endMarkers.forEach((marker) => {
      if (!isMountainClassificationMarkerType(marker.type, marker.cat)) {
        return;
      }

      if (!marker.name) {
        pushIssue(segmentIndex, `${marker.type} braucht einen Namen fuer die Paarbildung.`);
        return;
      }

      let matchingIndex = -1;
      for (let index = openClimbs.length - 1; index >= 0; index -= 1) {
        if (openClimbs[index]?.name === marker.name) {
          matchingIndex = index;
          break;
        }
      }

      const openIndex = matchingIndex >= 0 ? matchingIndex : openClimbs.length - 1;
      if (openIndex < 0) {
        pushIssue(segmentIndex, `${marker.type} "${marker.name}" braucht einen vorherigen climb_start.`);
        return;
      }

      openClimbs.splice(openIndex, 1);
    });
  });

  openClimbs.forEach((openClimb) => {
    const climbLabel = openClimb.name ? ` "${openClimb.name}"` : '';
    pushIssue(openClimb.segmentIndex, `climb_start${climbLabel} braucht einen spaeteren climb_top oder kategorisierten finish_hill/finish_mountain.`);
  });

  return issuesBySegment;
}

export function normalizeMarkerForType(marker: StageMarker): StageMarker {
  if (marker.type === 'climb_top') {
    return { ...marker, cat: marker.cat && ['HC', '1', '2', '3', '4'].includes(marker.cat) ? marker.cat : '4' };
  }
  if (isMountainFinishMarkerType(marker.type)) {
    return { ...marker, cat: hasClimbMarkerCategory(marker.cat) ? marker.cat : null };
  }
  if (marker.type === 'sprint_intermediate') {
    return { ...marker, cat: marker.cat === 'Sprint' ? marker.cat : 'Sprint' };
  }
  return { ...marker, cat: null };
}

export function normalizeStageEditorDraft(draft: StageEditorDraft): StageEditorDraft {
  const normalizedDraft = {
    ...draft,
    segments: (draft.segments?.length
      ? draft.segments
      : buildStageEditorSegmentsFromWaypoints(draft.waypoints ?? [])
    ).map((segment) => ({
      ...segment,
      startElevation: Math.round(segment.startElevation),
      lengthKm: Number.isFinite(segment.lengthKm) ? roundStageEditorKm(segment.lengthKm) : STAGE_EDITOR_MIN_SEGMENT_KM,
      gradientPercent: Number.isFinite(segment.gradientPercent) ? roundStageEditorOneDecimal(segment.gradientPercent) : 0,
      techLevel: Number.isFinite(segment.techLevel) ? segment.techLevel : 5,
      windExp: Number.isFinite(segment.windExp) ? segment.windExp : 5,
      markers: normalizeSegmentMarkers(segment.markers),
      endMarkers: normalizeSegmentMarkers(segment.endMarkers),
    })),
    waypoints: [],
  };
  syncStageEditorDerivedState(normalizedDraft);
  return normalizedDraft;
}

function buildStageEditorSegmentsFromWaypoints(waypoints: StageEditorWaypoint[]): StageEditorSegment[] {
  if (waypoints.length < 2) return [];
  const segments: StageEditorSegment[] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const current = waypoints[i];
    const next = waypoints[i + 1];
    const lengthKm = roundStageEditorKm(next.kmMark - current.kmMark);
    const gainMeters = next.elevation - current.elevation;
    const gradientPercent = roundStageEditorOneDecimal(lengthKm > 0 ? gainMeters / (lengthKm * 10) : 0);
    segments.push({
      startElevation: current.elevation,
      lengthKm,
      gradientPercent,
      techLevel: current.techLevel ?? 5,
      windExp: current.windExp ?? 5,
      terrain: current.terrain ?? 'Flat',
      markers: current.markers ?? [],
      endMarkers: next.markers ?? [],
    });
  }
  return segments;
}

function normalizeSegmentMarkers(markers?: StageMarker[]): StageMarker[] {
  if (!markers) return [];
  return markers.map((marker) => ({
    type: marker.type,
    name: marker.name ?? null,
    cat: marker.cat ?? null,
  }));
}

interface DetectedStageEditorClimb extends StageEditorClimb {
  startIndex: number;
  topIndex: number;
  topElevation: number;
}

function classifyStageEditorClimb(distanceKm: number, gainMeters: number, avgGradient: number): Extract<StageMarkerCategory, 'HC' | '1' | '2' | '3' | '4'> {
  const score = distanceKm * avgGradient * 8 + gainMeters / 12;
  if (score >= 95) return 'HC';
  if (score >= 68) return '1';
  if (score >= 46) return '2';
  if (score >= 28) return '3';
  return '4';
}

function detectStageEditorClimbs(waypoints: StageEditorWaypoint[]): DetectedStageEditorClimb[] {
  const climbs: DetectedStageEditorClimb[] = [];
  let startIndex: number | null = null;
  let topIndex: number | null = null;
  let descentMeters = 0;

  const commitClimb = (resolvedTopIndex: number | null): void => {
    if (startIndex == null || resolvedTopIndex == null || resolvedTopIndex <= startIndex) {
      startIndex = null;
      topIndex = null;
      descentMeters = 0;
      return;
    }

    const startPoint = waypoints[startIndex];
    const topPoint = waypoints[resolvedTopIndex];
    const distanceKm = topPoint.kmMark - startPoint.kmMark;
    const netGainMeters = Math.max(0, topPoint.elevation - startPoint.elevation);
    const avgGradient = distanceKm > 0 ? netGainMeters / (distanceKm * 10) : 0;
    if (netGainMeters >= STAGE_EDITOR_CLIMB_MIN_GAIN_METERS && avgGradient >= STAGE_EDITOR_CLIMB_MIN_AVG_GRADIENT) {
      climbs.push({
        startKm: roundStageEditorKm(startPoint.kmMark),
        endKm: roundStageEditorKm(topPoint.kmMark),
        distanceKm: roundStageEditorKm(distanceKm),
        gainMeters: Math.round(netGainMeters),
        avgGradient: roundStageEditorOneDecimal(avgGradient),
        category: classifyStageEditorClimb(distanceKm, netGainMeters, avgGradient),
        startIndex,
        topIndex: resolvedTopIndex,
        topElevation: Math.round(topPoint.elevation),
      });
    }

    startIndex = null;
    topIndex = null;
    descentMeters = 0;
  };

  for (let index = 1; index < waypoints.length; index += 1) {
    const previous = waypoints[index - 1];
    const current = waypoints[index];
    const deltaElevation = current.elevation - previous.elevation;
    if (startIndex == null && deltaElevation > 0) {
      startIndex = index - 1;
      topIndex = index;
      descentMeters = 0;
      continue;
    }

    if (startIndex == null) {
      continue;
    }

    if (deltaElevation >= 0) {
      if (topIndex == null || current.elevation >= waypoints[topIndex].elevation) {
        topIndex = index;
      }
      descentMeters = 0;
      continue;
    }

    descentMeters += Math.abs(deltaElevation);
    if (descentMeters >= STAGE_EDITOR_CLIMB_BREAK_DESCENT_METERS) {
      commitClimb(topIndex);
    }
  }

  commitClimb(topIndex);
  return climbs;
}

function suggestStageEditorProfile(draft: StageEditorDraft): StageProfile {
  const hasCobbleHill = draft.segments.some((segment) => segment.terrain === 'Cobble_Hill');
  const hasCobble = draft.segments.some((segment) => segment.terrain === 'Cobble');
  const hasHcOrCat1 = draft.climbs.some((climb) => climb.category === 'HC' || climb.category === '1');

  if (hasCobbleHill) return 'Cobble_Hill';
  if (hasCobble) return 'Cobble';
  if (draft.totalDistanceKm <= 25 && draft.elevationGainMeters < 250) return 'ITT';
  if (hasHcOrCat1 && draft.elevationGainMeters >= 2800) return 'High_Mountain';
  if (hasHcOrCat1 || draft.elevationGainMeters >= 1800) return 'Mountain';
  if (draft.elevationGainMeters >= 1100) return 'Medium_Mountain';
  if (draft.elevationGainMeters >= 700) return 'Hilly';
  if (draft.elevationGainMeters >= 350) return 'Rolling';
  return 'Flat';
}

function isManualStageEditorTerrain(terrain: StageTerrain): boolean {
  return terrain === 'Cobble' || terrain === 'Cobble_Hill' || terrain === 'Sprint';
}

function classifyAutoClimbTerrain(climb: DetectedStageEditorClimb): StageTerrain | null {
  if (climb.gainMeters >= STAGE_EDITOR_AUTO_MOUNTAIN_MIN_GAIN_METERS && climb.topElevation >= STAGE_EDITOR_AUTO_MOUNTAIN_MIN_TOP_METERS) {
    return 'Mountain';
  }
  if (climb.gainMeters > STAGE_EDITOR_AUTO_MEDIUM_MIN_GAIN_METERS) {
    return 'Medium_Mountain';
  }
  return 'Hill';
}

function classifyAutoStageEditorBaseTerrain(segment: StageEditorSegment): StageTerrain {
  if (segment.gradientPercent < STAGE_EDITOR_AUTO_DESCENT_STRONG_GRADIENT) {
    return 'Abfahrt';
  }
  if (
    segment.gradientPercent < STAGE_EDITOR_AUTO_FLAT_MAX_GRADIENT
    || Math.max(0, (segment.lengthKm * 1000) * (segment.gradientPercent / 100)) < STAGE_EDITOR_SEGMENT_MIN_HILL_GAIN_METERS
  ) {
    return 'Flat';
  }
  return 'Hill';
}

export function applyAutomaticStageEditorTerrain(draft: StageEditorDraft): void {
  if (draft.segments.length === 0) return;

  draft.waypoints = buildStageEditorWaypointsFromSegments(draft.segments);
  if (draft.sourceFormat === 'csv') {
    const climbs = detectStageEditorClimbs(draft.waypoints);
    draft.climbs = climbs.map(({ startIndex: _startIndex, topIndex: _topIndex, topElevation: _topElevation, ...climb }) => climb);
    return;
  }

  const nextTerrains = draft.segments.map((segment) => (segment.manualTerrain || isManualStageEditorTerrain(segment.terrain)
    ? segment.terrain
    : classifyAutoStageEditorBaseTerrain(segment)));
  const climbs = detectStageEditorClimbs(draft.waypoints);
  draft.climbs = climbs.map(({ startIndex: _startIndex, topIndex: _topIndex, topElevation: _topElevation, ...climb }) => climb);

  climbs.forEach((climb) => {
    const climbTerrain = classifyAutoClimbTerrain(climb);
    if (!climbTerrain) return;
    for (let index = climb.startIndex; index < climb.topIndex; index += 1) {
      if (!(draft.segments[index].manualTerrain || isManualStageEditorTerrain(nextTerrains[index]))) {
        nextTerrains[index] = climbTerrain;
      }
    }
  });

  let descentStartIndex: number | null = null;
  let descentDistanceKm = 0;
  const commitDescent = (endExclusive: number): void => {
    if (descentStartIndex == null || descentDistanceKm <= STAGE_EDITOR_AUTO_DESCENT_MIN_DISTANCE_KM) {
      descentStartIndex = null;
      descentDistanceKm = 0;
      return;
    }

    for (let index = descentStartIndex; index < endExclusive; index += 1) {
      if (!(draft.segments[index].manualTerrain || isManualStageEditorTerrain(nextTerrains[index])) && nextTerrains[index] === 'Flat') {
        nextTerrains[index] = 'Abfahrt';
      }
    }

    descentStartIndex = null;
    descentDistanceKm = 0;
  };

  for (let index = 0; index < draft.segments.length; index += 1) {
    const segment = draft.segments[index];
    if (segment && segment.gradientPercent < STAGE_EDITOR_AUTO_DESCENT_MIN_GRADIENT) {
      if (descentStartIndex == null) descentStartIndex = index;
      descentDistanceKm += segment.lengthKm;
      continue;
    }
    commitDescent(index);
  }
  commitDescent(draft.segments.length);

  draft.segments.forEach((segment, index) => {
    if (!isManualStageEditorTerrain(segment.terrain)) {
      segment.terrain = nextTerrains[index];
    }
  });

  draft.waypoints = buildStageEditorWaypointsFromSegments(draft.segments);

  draft.suggestedProfile = suggestStageEditorProfile(draft);
}

export function syncStageEditorDerivedState(draft: StageEditorDraft): void {
  recalculateStageEditorSegmentStartElevations(draft);
  syncStageEditorDraftStats(draft);
  applyAutomaticStageEditorTerrain(draft);
  draft.waypoints = buildStageEditorWaypointsFromSegments(draft.segments);
  syncStageEditorDraftStats(draft);
}

export function recalculateStageEditorSegmentStartElevations(draft: StageEditorDraft): void {
  if (draft.segments.length === 0) {
    draft.waypoints = [];
    return;
  }

  let startElevation = draft.segments[0].startElevation;
  draft.segments = draft.segments.map((segment, index) => {
    const nextSegment: StageEditorSegment = {
      ...segment,
      startElevation: Math.round(index === 0 ? segment.startElevation : startElevation),
      lengthKm: roundStageEditorKm(segment.lengthKm),
      gradientPercent: roundStageEditorOneDecimal(segment.gradientPercent),
      markers: sortStageMarkers(segment.markers),
      endMarkers: sortStageMarkers(segment.endMarkers),
    };
    startElevation = Math.round(nextSegment.startElevation + ((nextSegment.lengthKm * 1000) * (nextSegment.gradientPercent / 100)));
    return nextSegment;
  });
  draft.waypoints = buildStageEditorWaypointsFromSegments(draft.segments);
}

export function syncStageEditorDraftStats(draft: StageEditorDraft): void {
  draft.totalDistanceKm = roundStageEditorKm(draft.segments.reduce((sum, segment) => sum + segment.lengthKm, 0));
  draft.elevationGainMeters = draft.waypoints.reduce((sum, waypoint, index) => {
    if (index === 0) return 0;
    const gain = waypoint.elevation - draft.waypoints[index - 1].elevation;
    return sum + Math.max(0, gain);
  }, 0);
}

export function ensureStageEditorBoundaryMarkers(draft: StageEditorDraft): void {
  const firstSegment = draft.segments[0];
  const lastSegment = draft.segments[draft.segments.length - 1];
  if (!firstSegment || !lastSegment) return;

  if (!firstSegment.markers.some((marker) => marker.type === 'start')) {
    firstSegment.markers = sortStageMarkers([{ type: 'start', name: null, cat: null }, ...firstSegment.markers]);
  }

  if (!lastSegment.endMarkers.some((marker) => isFinishMarkerType(marker.type))) {
    lastSegment.endMarkers = sortStageMarkers([...lastSegment.endMarkers, { type: 'finish_flat', name: null, cat: null }]);
  }

  draft.waypoints = buildStageEditorWaypointsFromSegments(draft.segments);
}

export function renderSegmentMarkerRows(markers: StageMarker[], segmentIndex: number, totalSegments: number, scope: 'start' | 'end'): string {
  if (markers.length === 0) {
    return '';
  }

  return `<div class="stage-editor-marker-list">${markers.map((marker, markerIndex) => {
    const lockedStart = scope === 'start' && segmentIndex === 0 && marker.type === 'start';
    const finishMarkerCount = markers.filter((entry) => isFinishMarkerType(entry.type)).length;
    const lockedFinish = scope === 'end' && segmentIndex === totalSegments - 1 && isFinishMarkerType(marker.type) && finishMarkerCount === 1;
    const canRemove = !(lockedStart || lockedFinish);

    return `
      <div class="stage-editor-marker-row">
        <select data-field="markerType" data-marker-scope="${scope}" data-marker-index="${markerIndex}">${markerTypeOptionsHtml(marker.type, scope, segmentIndex, totalSegments)}</select>
        <input type="text" value="${esc(marker.name ?? '')}" data-field="markerName" data-marker-scope="${scope}" data-marker-index="${markerIndex}" placeholder="Name" />
        <select data-field="markerCat" data-marker-scope="${scope}" data-marker-index="${markerIndex}">${markerCategoryOptionsHtml(marker.cat)}</select>
        <button type="button" class="btn btn-danger btn-xs" data-segment-action="remove-marker" data-marker-scope="${scope}" data-marker-index="${markerIndex}" data-segment-index="${segmentIndex}" ${canRemove ? '' : 'disabled'}>✕</button>
      </div>`;
  }).join('')}</div>`;
}

export function renderSegmentMarkerBlock(markers: StageMarker[], segmentIndex: number, totalSegments: number, scope: 'start' | 'end'): string {
  const addLabel = scope === 'start' ? 'Start / Berg+' : 'Sprint / Berg / Ziel+';
  return `
    <div class="stage-editor-marker-block">
      ${renderSegmentMarkerRows(markers, segmentIndex, totalSegments, scope)}
      <button type="button" class="btn btn-secondary btn-xs stage-editor-marker-add" data-segment-action="add-marker" data-marker-scope="${scope}" data-segment-index="${segmentIndex}">${addLabel}</button>
    </div>`;
}

export function describeMarkerScope(scope: 'start' | 'end', segmentIndex: number, totalSegments: number): string {
  if (scope === 'start') {
    return segmentIndex === 0 ? 'Startgrenze · Pflichtmarker Start oder Bergbeginn' : 'Startgrenze · Bergbeginn';
  }

  return segmentIndex === totalSegments - 1
    ? 'Endgrenze · Ziel oder Wertungsende'
    : 'Endgrenze · Sprint oder Bergwertung';
}

export function updateStageEditorMarker(segmentIndex: number, markerIndex: number, scope: 'start' | 'end', field: 'markerType' | 'markerName' | 'markerCat', rawValue: string): void {
  if (!state.stageEditorDraft) return;
  const segment = state.stageEditorDraft.segments[segmentIndex];
  if (!segment) return;
  const markers = scope === 'start' ? segment.markers : segment.endMarkers;
  const marker = markers[markerIndex];
  if (!marker) return;

  if (field === 'markerType') {
    marker.type = rawValue as StageMarkerType;
    const normalizedMarker = normalizeMarkerForType(marker);
    marker.name = normalizedMarker.name;
    marker.cat = normalizedMarker.cat;
    if (isFinishMarkerType(marker.type)) {
      const nextMarkers = markers.filter((entry, index) => index === markerIndex || !isFinishMarkerType(entry.type));
      if (scope === 'start') {
        segment.markers = nextMarkers;
      } else {
        segment.endMarkers = nextMarkers;
      }
    }
  } else if (field === 'markerName') {
    marker.name = rawValue.trim() || null;
  } else if (field === 'markerCat') {
    marker.cat = rawValue ? rawValue as StageMarkerCategory : null;
  }

  if (scope === 'start') {
    segment.markers = sortStageMarkers(segment.markers);
  } else {
    segment.endMarkers = sortStageMarkers(segment.endMarkers);
  }
  syncStageEditorDerivedState(state.stageEditorDraft);
  ensureStageEditorBoundaryMarkers(state.stageEditorDraft);
  renderStageEditor();
}

export function addStageEditorMarker(segmentIndex: number, scope: 'start' | 'end'): void {
  if (!state.stageEditorDraft) return;
  const segment = state.stageEditorDraft.segments[segmentIndex];
  if (!segment) return;
  const nextMarker: StageMarker = scope === 'start'
    ? (segmentIndex === 0 && !segment.markers.some((marker) => marker.type === 'start')
      ? { type: 'start', name: 'Start', cat: null }
      : { type: 'climb_start', name: null, cat: null })
    : (segmentIndex === state.stageEditorDraft.segments.length - 1 && !segment.endMarkers.some((marker) => isFinishMarkerType(marker.type))
      ? { type: 'finish_flat', name: 'Ziel', cat: null }
      : { type: 'sprint_intermediate', name: null, cat: 'Sprint' as StageMarkerCategory });
  if (scope === 'start') {
    segment.markers.push(nextMarker);
    segment.markers = sortStageMarkers(segment.markers);
  } else {
    segment.endMarkers.push(nextMarker);
    segment.endMarkers = sortStageMarkers(segment.endMarkers);
  }
  syncStageEditorDerivedState(state.stageEditorDraft);
  ensureStageEditorBoundaryMarkers(state.stageEditorDraft);
  renderStageEditor();
}

export function removeStageEditorMarker(segmentIndex: number, markerIndex: number, scope: 'start' | 'end'): void {
  if (!state.stageEditorDraft) return;
  const segment = state.stageEditorDraft.segments[segmentIndex];
  if (!segment) return;
  if (scope === 'start') {
    segment.markers.splice(markerIndex, 1);
  } else {
    segment.endMarkers.splice(markerIndex, 1);
  }
  syncStageEditorDerivedState(state.stageEditorDraft);
  ensureStageEditorBoundaryMarkers(state.stageEditorDraft);
  renderStageEditor();
}

let prevStageId = 0;
let prevRaceId = 0;

export async function initializeStageEditorForm(): Promise<void> {
  $<HTMLSelectElement>('stage-editor-profile').innerHTML = stageProfileOptionsHtml('Flat');
  $('stage-editor-chart').innerHTML = '<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';
  $('stage-editor-climbs').innerHTML = '<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>';

  // Load countries, categories, programs, and existing stages dynamically from backend
  const [countriesRes, categoriesRes, programsRes] = await Promise.all([
    api.listStageEditorCountries(),
    api.listStageEditorRaceCategories(),
    api.listStageEditorRacePrograms(),
    loadStageEditorExistingStages(),
  ]);

  if (countriesRes.success && countriesRes.data) {
    const countrySelect = $<HTMLSelectElement>('stage-editor-race-country');
    countrySelect.innerHTML = countriesRes.data
      .map(c => `<option value="${c.id}">${esc(c.name)} (${esc(c.code3)})</option>`)
      .join('');
  }

  if (categoriesRes.success && categoriesRes.data) {
    const catSelect = $<HTMLSelectElement>('stage-editor-race-category');
    catSelect.innerHTML = categoriesRes.data
      .map(c => `<option value="${c.id}">${esc(c.name)}</option>`)
      .join('');
  }

  if (programsRes.success && programsRes.data) {
    state.stageEditorPrograms = programsRes.data;
    renderProgramsDropdown();
  }
}

export function renderProgramsDropdown(): void {
  const container = $('stage-editor-programs-list');
  if (!state.stageEditorPrograms) return;

  container.innerHTML = state.stageEditorPrograms
    .map((prog) => `
      <label style="display: flex; align-items: center; gap: 0.35rem; font-weight: normal; cursor: pointer; user-select: none; padding: 0.15rem 0;">
        <input type="checkbox" name="stage-editor-program-selection" value="${prog.id}" style="width: auto; margin: 0;" />
        <span style="font-size: 0.85rem;">${prog.id}: ${esc(prog.name)}</span>
      </label>
    `)
    .join('');
}

export function updateSelectedProgramsText(): void {
  const checked = document.querySelectorAll('input[name="stage-editor-program-selection"]:checked') as NodeListOf<HTMLInputElement>;
  const selectedTextSpan = $('stage-editor-programs-selected-text');

  if (checked.length === 0) {
    selectedTextSpan.textContent = 'Keine Programme ausgewählt';
    selectedTextSpan.classList.add('text-muted');
  } else {
    const names = Array.from(checked).map(cb => {
      const prog = state.stageEditorPrograms?.find((p) => String(p.id) === cb.value);
      return prog ? prog.name : cb.value;
    });
    selectedTextSpan.textContent = `${checked.length} ausgewählt: ${names.join(', ')}`;
    selectedTextSpan.classList.remove('text-muted');
  }
}


export function getStageEditorSegmentStartKm(draft: StageEditorDraft, index: number): number {
  let kmMark = 0;
  for (let segmentIndex = 0; segmentIndex < index; segmentIndex += 1) {
    kmMark += draft.segments[segmentIndex]?.lengthKm ?? 0;
  }
  return roundStageEditorKm(kmMark);
}

export function getStageEditorSegmentEndElevation(segment: StageEditorSegment): number {
  return Math.round(segment.startElevation + ((segment.lengthKm * 1000) * (segment.gradientPercent / 100)));
}

export function resolveFirstFreePositiveInteger(values: number[]): number {
  const used = new Set(values.filter((value) => Number.isInteger(value) && value > 0));
  let candidate = 1;
  while (used.has(candidate)) {
    candidate += 1;
  }
  return candidate;
}

export function resolveNextFreeStageEditorStageId(): number {
  const ids = state.stageEditorExistingStages.map((stage) => stage.stageId);
  return ids.length > 0 ? Math.max(...ids) + 1 : 1;
}

export function resolveNextFreeStageEditorRaceId(): number {
  const ids = [
    ...state.stageEditorExistingStages.map((stage) => stage.raceId),
    ...state.races.map((race) => race.id),
  ];
  return ids.length > 0 ? Math.max(...ids) + 1 : 1;
}

export function findNextFreeStageId(startId: number, direction: number): number {
  let candidate = startId;
  const existingIds = new Set(state.stageEditorExistingStages.map((s) => s.stageId));
  while (candidate > 0 && existingIds.has(candidate)) {
    candidate += direction;
  }
  if (candidate <= 0) {
    candidate = 1;
    while (existingIds.has(candidate)) {
      candidate += 1;
    }
  }
  return candidate;
}

export function findNextFreeRaceId(startId: number, direction: number): number {
  let candidate = startId;
  const existingIds = new Set([
    ...state.stageEditorExistingStages.map((s) => s.raceId),
    ...state.races.map((r) => r.id),
  ]);
  while (candidate > 0 && existingIds.has(candidate)) {
    candidate += direction;
  }
  if (candidate <= 0) {
    candidate = 1;
    while (existingIds.has(candidate)) {
      candidate += 1;
    }
  }
  return candidate;
}

export function updateRaceDatesFromStageDate(): void {
  const stageDateInput = $<HTMLInputElement>('stage-editor-date');
  if (!stageDateInput) return;
  const stageDate = stageDateInput.value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(stageDate)) {
    return;
  }

  const newRaceCb = document.getElementById('stage-editor-new-race-checkbox') as HTMLInputElement | null;
  if (!newRaceCb || !newRaceCb.checked) {
    return;
  }

  const isStageRaceSelect = document.getElementById('stage-editor-race-is-stage-race') as HTMLSelectElement | null;
  if (!isStageRaceSelect) return;
  const isStageRace = Number(isStageRaceSelect.value) === 1;
  const startDateInput = $<HTMLInputElement>('stage-editor-race-start-date');
  const endDateInput = $<HTMLInputElement>('stage-editor-race-end-date');

  if (!startDateInput || !endDateInput) return;

  if (!isStageRace) {
    startDateInput.value = stageDate;
    endDateInput.value = stageDate;
  } else {
    startDateInput.value = stageDate;
    const numStagesInput = document.getElementById('stage-editor-race-num-stages') as HTMLInputElement | null;
    const numStages = numStagesInput ? (Number(numStagesInput.value) || 1) : 1;

    const [year, month, day] = stageDate.split('-').map(Number);
    const d = new Date(year, month - 1, day);

    let extraDays = 0;
    if (numStages === 21) {
      extraDays = 2;
    } else if (numStages >= 14) {
      extraDays = 1;
    }
    const totalDays = numStages + extraDays;

    d.setDate(d.getDate() + totalDays - 1);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    endDateInput.value = `${yyyy}-${mm}-${dd}`;
  }
}

export function setStageEditorDefaults(draft: StageEditorDraft): void {
  const profileSelect = $<HTMLSelectElement>('stage-editor-profile');
  profileSelect.innerHTML = stageProfileOptionsHtml(draft.suggestedProfile);
  profileSelect.value = draft.suggestedProfile;

  const nextStageId = resolveNextFreeStageEditorStageId();
  const nextRaceId = resolveNextFreeStageEditorRaceId();
  $<HTMLInputElement>('stage-editor-stage-id').value = String(nextStageId);
  $<HTMLInputElement>('stage-editor-race-id').value = String(nextRaceId);
  prevStageId = nextStageId;
  prevRaceId = nextRaceId;

  const detailsFileInput = $<HTMLInputElement>('stage-editor-details-file');
  if (!detailsFileInput.value.trim()) {
    detailsFileInput.value = `${slugifyFileName(draft.routeName)}.csv`;
  }

  const dateInput = $<HTMLInputElement>('stage-editor-date');
  if (!dateInput.value && state.gameState?.currentDate) {
    dateInput.value = state.gameState.currentDate;
  }

  const checkboxes = document.querySelectorAll('input[name="stage-editor-weather"]') as NodeListOf<HTMLInputElement>;
  checkboxes.forEach((cb) => {
    cb.checked = true;
  });

  updateRaceDatesFromStageDate();
}

export function setStageEditorMetadataFields(metadata: StageEditorMetadata): void {
  $<HTMLInputElement>('stage-editor-stage-id').value = String(metadata.stageId);
  $<HTMLInputElement>('stage-editor-race-id').value = String(metadata.raceId);
  prevStageId = metadata.stageId;
  prevRaceId = metadata.raceId;
  $<HTMLInputElement>('stage-editor-stage-number').value = String(metadata.stageNumber);
  $<HTMLInputElement>('stage-editor-date').value = metadata.date;
  $<HTMLInputElement>('stage-editor-details-file').value = metadata.detailsCsvFile;
  const profileSelect = $<HTMLSelectElement>('stage-editor-profile');
  profileSelect.innerHTML = stageProfileOptionsHtml(metadata.profile);
  profileSelect.value = metadata.profile;
  $<HTMLInputElement>('stage-editor-final-spread-start').value = String(metadata.finalSpreadStartPercent);
  $<HTMLInputElement>('stage-editor-final-push-start').value = String(metadata.finalPushStartPercent);
  $<HTMLInputElement>('stage-editor-final-spread-difficulty').value = String(metadata.finalSpreadDifficultyMultiplier);
  $<HTMLInputElement>('stage-editor-crash-multiplier').value = String(metadata.crashIncidentMultiplier);
  $<HTMLInputElement>('stage-editor-mechanical-multiplier').value = String(metadata.mechanicalIncidentMultiplier);

  const allowed = (metadata.allowedWeather || '1|2|3|4|5|6|7').split('|').map((s) => s.trim());
  const checkboxes = document.querySelectorAll('input[name="stage-editor-weather"]') as NodeListOf<HTMLInputElement>;
  checkboxes.forEach((cb) => {
    cb.checked = allowed.includes(cb.value);
  });

  updateRaceDatesFromStageDate();
}

export function getStageEditorIssues(draft: StageEditorDraft | null): string[] {
  if (!draft) return ['Noch keine Strecke importiert.'];

  const issues: string[] = [];
  if (draft.segments.length === 0) {
    issues.push('Mindestens ein Segment ist erforderlich.');
    return issues;
  }

  if (!draft.segments[0]?.markers.some((marker) => marker.type === 'start')) {
    issues.push('Das erste Segment muss als Start markiert sein.');
  }

  const lastSegment = draft.segments[draft.segments.length - 1];
  if (!(lastSegment.endMarkers ?? []).some((marker) => isFinishMarkerType(marker.type))) {
    issues.push('Das letzte Segment muss per Endmarker als Ziel markiert sein.');
  }

  draft.segments.forEach((segment, segmentIndex) => {
    getStageEditorSegmentIssuesAt(draft, segmentIndex).forEach((issue) => {
      issues.push(`Segment ${segmentIndex + 1}: ${issue}`);
    });

    [...(segment.markers ?? []), ...(segment.endMarkers ?? [])].forEach((marker) => {
      if (marker.cat != null && !STAGE_MARKER_CATEGORIES.includes(marker.cat)) {
        issues.push(`Segment ${segmentIndex + 1}: Ungültige Marker-Kategorie ${marker.cat}.`);
      }
    });
  });

  return issues;
}

export function getStageEditorMetadataErrors(): string[] {
  const errors: string[] = [];
  const stageId = Number($<HTMLInputElement>('stage-editor-stage-id').value);
  const raceId = Number($<HTMLInputElement>('stage-editor-race-id').value);
  const stageNumber = Number($<HTMLInputElement>('stage-editor-stage-number').value);
  const date = $<HTMLInputElement>('stage-editor-date').value.trim();
  const detailsFile = $<HTMLInputElement>('stage-editor-details-file').value.trim();
  const finalSpreadStartPercent = Number($<HTMLInputElement>('stage-editor-final-spread-start').value);
  const finalPushStartPercent = Number($<HTMLInputElement>('stage-editor-final-push-start').value);
  const finalSpreadDifficultyMultiplier = Number($<HTMLInputElement>('stage-editor-final-spread-difficulty').value);
  const crashIncidentMultiplier = Number($<HTMLInputElement>('stage-editor-crash-multiplier').value);
  const mechanicalIncidentMultiplier = Number($<HTMLInputElement>('stage-editor-mechanical-multiplier').value);

  if (!Number.isInteger(stageId) || stageId <= 0) errors.push('Stage-ID fehlt oder ist ungültig.');
  if (!Number.isInteger(raceId) || raceId <= 0) errors.push('Race-ID fehlt oder ist ungültig.');
  if (!Number.isInteger(stageNumber) || stageNumber <= 0) errors.push('Etappennummer fehlt oder ist ungültig.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push('Datum muss im Format YYYY-MM-DD vorliegen.');
  if (!/^[A-Za-z0-9_.-]+\.csv$/.test(detailsFile) || detailsFile.includes('/')) {
    errors.push('Details-Datei muss ein Dateiname mit .csv-Endung ohne Pfad sein.');
  }
  if (!Number.isFinite(finalSpreadStartPercent) || finalSpreadStartPercent < 0 || finalSpreadStartPercent > 100) {
    errors.push('Final Spread Start % muss zwischen 0 und 100 liegen.');
  }
  if (!Number.isFinite(finalPushStartPercent) || finalPushStartPercent < 0 || finalPushStartPercent > 100) {
    errors.push('Final Push Start % muss zwischen 0 und 100 liegen.');
  }
  if (!Number.isFinite(finalSpreadDifficultyMultiplier) || finalSpreadDifficultyMultiplier <= 0) {
    errors.push('Final Spread Multiplikator muss groesser als 0 sein.');
  }
  if (!Number.isFinite(crashIncidentMultiplier) || crashIncidentMultiplier <= 0) {
    errors.push('Sturz-Multiplikator muss groesser als 0 sein.');
  }
  if (!Number.isFinite(mechanicalIncidentMultiplier) || mechanicalIncidentMultiplier <= 0) {
    errors.push('Defekt-Multiplikator muss groesser als 0 sein.');
  }

  const checkedWeather = document.querySelectorAll('input[name="stage-editor-weather"]:checked');
  if (checkedWeather.length === 0) {
    errors.push('Mindestens eine Wetterart muss ausgewählt sein.');
  }

  // Already existing Stage-ID check
  const existingStageIds = state.stageEditorExistingStages.map(s => s.stageId);
  if (existingStageIds.includes(stageId)) {
    errors.push(`Die Stage-ID ${stageId} existiert bereits in stages.csv.`);
  }

  // Race-ID checks depending on new race flag
  const isNewRace = $<HTMLInputElement>('stage-editor-new-race-checkbox').checked;
  const existingRaceIds = [
    ...state.stageEditorExistingStages.map(s => s.raceId),
    ...state.races.map(r => r.id)
  ];

  if (isNewRace) {
    if (existingRaceIds.includes(raceId)) {
      errors.push(`Die Race-ID ${raceId} existiert bereits.`);
    }

    const raceName = $<HTMLInputElement>('stage-editor-race-name').value.trim();
    const countryId = Number($<HTMLSelectElement>('stage-editor-race-country').value);
    const categoryId = Number($<HTMLSelectElement>('stage-editor-race-category').value);
    const numStages = Number($<HTMLInputElement>('stage-editor-race-num-stages').value);
    const startDate = $<HTMLInputElement>('stage-editor-race-start-date').value.trim();
    const endDate = $<HTMLInputElement>('stage-editor-race-end-date').value.trim();
    const prestige = Number($<HTMLInputElement>('stage-editor-race-prestige').value);

    if (!raceName) errors.push('Rennname fehlt.');
    if (!Number.isInteger(countryId) || countryId <= 0) errors.push('Land fehlt oder ist ungültig.');
    if (!Number.isInteger(categoryId) || categoryId <= 0) errors.push('Kategorie fehlt oder ist ungültig.');
    if (!Number.isInteger(numStages) || numStages <= 0) errors.push('Etappenanzahl muss eine positive Ganzzahl sein.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) errors.push('Startdatum muss im Format YYYY-MM-DD vorliegen.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) errors.push('Enddatum muss im Format YYYY-MM-DD vorliegen.');
    if (!Number.isInteger(prestige) || prestige < 1 || prestige > 100) errors.push('Prestige muss zwischen 1 und 100 liegen.');
  } else {
    if (!existingRaceIds.includes(raceId)) {
      errors.push(`Die Race-ID ${raceId} existiert nicht. Wenn Sie ein neues Rennen erstellen möchten, aktivieren Sie bitte 'Neues Rennen anlegen'.`);
    }
  }

  // Program mapping check
  const updatePrograms = $<HTMLInputElement>('stage-editor-program-checkbox').checked;
  if (updatePrograms) {
    const checkedPrograms = document.querySelectorAll('input[name="stage-editor-program-selection"]:checked');
    if (checkedPrograms.length === 0) {
      errors.push('Mindestens ein Programm muss ausgewählt sein.');
    }
  }

  return errors;
}

export function readStageEditorMetadata(): StageEditorMetadata {
  const weatherInputs = document.querySelectorAll('input[name="stage-editor-weather"]:checked') as NodeListOf<HTMLInputElement>;
  const allowedWeather = Array.from(weatherInputs).map((input) => input.value).join('|');

  return {
    stageId: Number($<HTMLInputElement>('stage-editor-stage-id').value),
    raceId: Number($<HTMLInputElement>('stage-editor-race-id').value),
    stageNumber: Number($<HTMLInputElement>('stage-editor-stage-number').value),
    date: $<HTMLInputElement>('stage-editor-date').value.trim(),
    profile: $<HTMLSelectElement>('stage-editor-profile').value as StageProfile,
    detailsCsvFile: $<HTMLInputElement>('stage-editor-details-file').value.trim(),
    startElevation: state.stageEditorDraft?.segments[0]?.startElevation ?? 0,
    finalSpreadStartPercent: Number($<HTMLInputElement>('stage-editor-final-spread-start').value),
    finalPushStartPercent: Number($<HTMLInputElement>('stage-editor-final-push-start').value),
    finalSpreadDifficultyMultiplier: Number($<HTMLInputElement>('stage-editor-final-spread-difficulty').value),
    crashIncidentMultiplier: Number($<HTMLInputElement>('stage-editor-crash-multiplier').value),
    mechanicalIncidentMultiplier: Number($<HTMLInputElement>('stage-editor-mechanical-multiplier').value),
    allowedWeather,
  };
}

// Sorting Overview Helpers
export function getDefaultStageEditorStagesSortDirection(sortKey: StageEditorStagesSortKey): 'asc' | 'desc' {
  return ['distanceKm', 'elevationGainMeters', 'sprintCount', 'climbCount', 'profileScore'].includes(sortKey) ? 'desc' : 'asc';
}

export function getDefaultStageEditorClimbsSortDirection(sortKey: StageEditorClimbsSortKey): 'asc' | 'desc' {
  return ['gainMeters', 'elevationAtTop', 'distanceKm', 'avgGradient', 'maxGradient', 'climbScore'].includes(sortKey) ? 'desc' : 'asc';
}

export function renderStageEditorScoreBadge(score: number, minScore: number, maxScore: number): string {
  const stoppedValue = Math.max(minScore, Math.min(maxScore, score));
  const ratio = (stoppedValue - minScore) / Math.max(1, maxScore - minScore);
  const hue = Math.round(124 - (ratio * 118));
  const lightness = 54;
  const bgAlpha = 0.14 + (ratio * 0.12);
  const borderAlpha = 0.26 + (ratio * 0.18);
  const style = `--stage-editor-score-hue:${hue};--stage-editor-score-lightness:${lightness}%;--stage-editor-score-bg-alpha:${bgAlpha};--stage-editor-score-border-alpha:${borderAlpha};`;
  return `<span class="stage-editor-score-badge" style="${style}">${Math.round(score)}</span>`;
}

export function renderClimbScoreBadge(score: number): string {
  // Non-linear scale: 0-100 strong gradient, 100-250 medium, 250+ slow, dark red >= 300
  let ratio: number;
  if (score <= 100) {
    ratio = (score / 100) * 0.45; // 0..0.45
  } else if (score <= 250) {
    ratio = 0.45 + ((score - 100) / 150) * 0.35; // 0.45..0.80
  } else {
    ratio = 0.80 + (Math.min(score - 250, 100) / 100) * 0.20; // 0.80..1.0
  }
  // hue: 122 (green) -> 50 (yellow) -> 28 (orange) -> 0 (red/dark-red)
  const hue = Math.round(122 - (ratio * 122));
  // lightness: green is 40%, dark red at 300+ is 18%
  const lightness = Math.round(40 - (ratio * 22));
  const bgAlpha = 0.18 + (ratio * 0.30);
  const borderAlpha = 0.30 + (ratio * 0.40);
  const style = `--stage-editor-score-hue:${hue};--stage-editor-score-lightness:${lightness}%;--stage-editor-score-bg-alpha:${bgAlpha};--stage-editor-score-border-alpha:${borderAlpha};`;
  return `<span class="stage-editor-score-badge" style="${style}">${Math.round(score)}</span>`;
}

export function renderStageEditorCategoryBadge(category: StageEditorClimbOverviewRow['category']): string {
  if (category == null) return '<span class="stage-editor-category-empty">—</span>';
  const catClass = category === 'HC' ? 'is-hc' : `is-cat-${category}`;
  const displayValue = category === 'HC' ? 'HC' : String(category);
  return `<span class="stage-editor-climb-category-badge ${catClass}">${displayValue}</span>`;
}

export function renderStageEditorProfileOpenButton(content: string, stageId: number, title: string, climbId?: string): string {
  const datasetclimb = climbId != null ? ` data-stage-profile-open-climb-id="${esc(climbId)}"` : '';
  return `<button class="dashboard-stage-profile-link" type="button" data-stage-profile-open-stage-id="${stageId}"${datasetclimb}>${content}</button>`;
}

export function renderStageEditorStageScorePopover(row: any): string {
  const fmtKm = (v: number | undefined) => v != null ? `${v.toFixed(1).replace('.', ',')} km` : '—';
  const fmtM = (v: number | undefined) => v != null ? `${Math.round(v).toLocaleString('de-DE')} m` : '—';
  const score = row.profileScore ?? row.score;

  // Collect climbs for this stage from global state
  const stageClimbs = [...(state.stageEditorClimbRows ?? [])]
    .filter((c) => c.stageId === row.stageId)
    .sort((a, b) => a.climbIndex - b.climbIndex);

  const climbsHtml = stageClimbs.length === 0
    ? `<div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact"><span class="text-muted" style="grid-column:1/-1">Keine Bergwertungen</span></div>`
    : `
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-climbs stage-editor-score-popover-grid-head">
        <span>Nr.</span>
        <span>Name</span>
        <span class="text-right">Score</span>
        <span class="text-right">Länge</span>
        <span class="text-right">Ø %</span>
      </div>
      ${stageClimbs.map((climb) => `
        <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-climbs">
          <span class="text-muted">${climb.climbIndex}</span>
          <span>${esc(climb.name)}</span>
          <span class="text-right">${renderClimbScoreBadge(climb.climbScore)}</span>
          <strong class="text-right">${fmtKm(climb.distanceKm)}</strong>
          <strong class="text-right">${climb.avgGradient.toFixed(1).replace('.', ',')} %</strong>
        </div>`).join('')}`;

  return `
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>Stage Score</strong>
        ${renderStageEditorScoreBadge(score, 0, 100)}
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact stage-editor-score-popover-grid-head stage-editor-score-popover-grid-head-compact">
        <span>Kriterium</span>
        <span class="text-right">Wert</span>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact">
        <span>Distanz</span>
        <strong class="text-right">${fmtKm(row.distanceKm)}</strong>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact">
        <span>Höhenmeter</span>
        <strong class="text-right">${fmtM(row.elevationGainMeters)}</strong>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact">
        <span>Profil</span>
        <strong class="text-right">${row.profile ?? '—'}</strong>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact">
        <span>Sprints</span>
        <strong class="text-right">${row.sprintCount ?? '—'}</strong>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact" style="margin-bottom:0.5rem">
        <span>Anstiege</span>
        <strong class="text-right">${row.climbCount ?? '—'}</strong>
      </div>
      ${climbsHtml}
    </div>`;
}

export function renderStageEditorClimbScorePopover(row: any): string {
  const fmtKm = (v: number | undefined) => v != null ? `${v.toFixed(1).replace('.', ',')} km` : '—';
  const fmtM = (v: number | undefined) => v != null ? `${Math.round(v).toLocaleString('de-DE')} m` : '—';
  const fmtPct = (v: number | undefined) => v != null ? `${v.toFixed(1).replace('.', ',')} %` : '—';
  return `
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>${row.name ?? 'Climb Score'}</strong>
        ${renderClimbScoreBadge(row.climbScore ?? 0)}
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact stage-editor-score-popover-grid-head stage-editor-score-popover-grid-head-compact">
        <span>Kriterium</span>
        <span class="text-right">Wert</span>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact">
        <span>Länge</span>
        <strong class="text-right">${fmtKm(row.distanceKm)}</strong>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact">
        <span>Höhenmeter</span>
        <strong class="text-right">${fmtM(row.gainMeters)}</strong>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact">
        <span>Ø Steigung</span>
        <strong class="text-right">${fmtPct(row.avgGradient)}</strong>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact">
        <span>Max Steigung</span>
        <strong class="text-right">${fmtPct(row.maxGradient)}</strong>
      </div>
    </div>`;
}

export function renderStageEditorScoreControl(
  score: number,
  minScore: number,
  maxScore: number,
  stageId: number,
  popoverContent: string,
  title: string,
  climbId?: string,
  customBadgeHtml?: string,
): string {
  const badgeHtml = customBadgeHtml ?? renderStageEditorScoreBadge(score, minScore, maxScore);
  const openButton = renderStageEditorProfileOpenButton(badgeHtml, stageId, title, climbId);
  return `
    <div class="season-standings-country-anchor stage-editor-score-anchor" tabindex="0">
      ${openButton}
      <div class="season-standings-country-popover stage-editor-score-popover">
        ${popoverContent}
      </div>
    </div>`;
}


export function renderStageEditorOverviewHeader<TSortKey extends string>(label: string, sortKey: TSortKey, activeKey: TSortKey, direction: 'asc' | 'desc', table: 'stages' | 'climbs'): string {
  const activeClass = activeKey === sortKey ? ' stage-editor-overview-sort-active' : '';
  const indicator = activeKey === sortKey ? (direction === 'asc' ? '↑' : '↓') : '↕';
  return `
    <th>
      <button type="button" class="stage-editor-overview-sort${activeClass}" data-stage-editor-${table}-sort="${sortKey}">
        <span class="team-table-sort-label">${esc(label)}</span>
        <span class="team-table-sort-indicator${activeKey === sortKey ? ' team-table-sort-indicator-active' : ''}">${indicator}</span>
      </button>
    </th>`;
}

export function renderStageEditorStagesOverview(): void {
  const view = $('stage-editor-stages-table');
  const empty = $('stage-editor-stages-empty');
  const meta = $('stage-editor-stages-meta');
  const thead = view.querySelector('thead');
  const tbody = view.querySelector('tbody');
  if (!tbody) return;

  const sk = state.stageEditorStagesSort.key;
  const sd = state.stageEditorStagesSort.direction;
  if (thead) {
    thead.innerHTML = `<tr>
      ${renderStageEditorOverviewHeader('ID', 'stageId', sk, sd, 'stages')}
      ${renderStageEditorOverviewHeader('Land', 'countryCode', sk, sd, 'stages')}
      ${renderStageEditorOverviewHeader('Rennen', 'raceName', sk, sd, 'stages')}
      ${renderStageEditorOverviewHeader('Etappe', 'stageNumber', sk, sd, 'stages')}
      ${renderStageEditorOverviewHeader('Score', 'profileScore', sk, sd, 'stages')}
      ${renderStageEditorOverviewHeader('Profil', 'profile', sk, sd, 'stages')}
      ${renderStageEditorOverviewHeader('Distanz', 'distanceKm', sk, sd, 'stages')}
      ${renderStageEditorOverviewHeader('Höhenmeter', 'elevationGainMeters', sk, sd, 'stages')}
      ${renderStageEditorOverviewHeader('Sprints', 'sprintCount', sk, sd, 'stages')}
      ${renderStageEditorOverviewHeader('Climbs', 'climbCount', sk, sd, 'stages')}
    </tr>`;
  }

  const rows = sortStageEditorStageRows(state.stageEditorStageRows);
  tbody.innerHTML = rows.map((row) => `
    <tr>
      <td>${row.stageId}</td>
      <td>${renderFlag(row.countryCode || '')}</td>
      <td><strong>${esc(row.raceName)}</strong></td>
      <td><strong>${esc(getStageDisplayName({ stageNumber: row.stageNumber } as any))}</strong></td>
      <td>${renderStageEditorScoreControl(row.profileScore, 0, 100, row.stageId, renderStageEditorStageScorePopover(row), buildDashboardStageProfileLabel({ name: row.raceName } as any, { stageNumber: row.stageNumber, profile: row.profile } as any))}</td>
      <td>${renderStageProfileBadge(row.profile)}</td>
      <td>${formatKm(row.distanceKm)}</td>
      <td>${formatElevationGain(row.elevationGainMeters)}</td>
      <td>${row.sprintCount} Sprints</td>
      <td>${row.climbCount} Climbs</td>
    </tr>`).join('');

  empty.classList.toggle('hidden', rows.length > 0 || state.stageEditorOverviewLoading);
  meta.textContent = state.stageEditorOverviewLoading
    ? 'Etappenübersicht wird geladen...'
    : `${state.stageEditorStageRows.length} vorhandene Etappen`;
}

export function renderStageEditorClimbsOverview(): void {
  const view = $('stage-editor-climbs-table');
  const empty = $('stage-editor-climbs-empty');
  const meta = $('stage-editor-climbs-meta');
  const thead = view.querySelector('thead');
  const tbody = view.querySelector('tbody');
  if (!tbody) return;

  const ck = state.stageEditorClimbsSort.key;
  const cd = state.stageEditorClimbsSort.direction;
  if (thead) {
    thead.innerHTML = `<tr>
      ${renderStageEditorOverviewHeader('km', 'placementKm', ck, cd, 'climbs')}
      ${renderStageEditorOverviewHeader('Name', 'name', ck, cd, 'climbs')}
      ${renderStageEditorOverviewHeader('Kat.', 'category', ck, cd, 'climbs')}
      ${renderStageEditorOverviewHeader('Score', 'climbScore', ck, cd, 'climbs')}
      ${renderStageEditorOverviewHeader('Land', 'countryCode', ck, cd, 'climbs')}
      ${renderStageEditorOverviewHeader('Rennen', 'raceName', ck, cd, 'climbs')}
      ${renderStageEditorOverviewHeader('Etappe', 'stageNumber', ck, cd, 'climbs')}
      ${renderStageEditorOverviewHeader('Höhenmeter', 'gainMeters', ck, cd, 'climbs')}
      ${renderStageEditorOverviewHeader('Höhe (Top)', 'elevationAtTop', ck, cd, 'climbs')}
      ${renderStageEditorOverviewHeader('Distanz', 'distanceKm', ck, cd, 'climbs')}
      ${renderStageEditorOverviewHeader('Ø Steigung', 'avgGradient', ck, cd, 'climbs')}
      ${renderStageEditorOverviewHeader('Max Steigung', 'maxGradient', ck, cd, 'climbs')}
    </tr>`;
  }

  const rows = sortStageEditorClimbRows(state.stageEditorClimbRows);
  tbody.innerHTML = rows.map((row) => `
    <tr>
      <td>${row.placementKm.toFixed(1).replace('.', ',')} km</td>
      <td><strong>${esc(row.name)}</strong></td>
      <td>${renderStageEditorCategoryBadge(row.category)}</td>
      <td>${renderStageEditorScoreControl(row.climbScore, 0, 350, row.stageId, renderStageEditorClimbScorePopover(row), buildDashboardStageProfileLabel({ name: row.raceName } as any, { stageNumber: row.stageNumber, profile: 'Mountain' as any } as any), row.id, renderClimbScoreBadge(row.climbScore))}</td>
      <td>${renderFlag(row.countryCode || '')}</td>
      <td><strong>${esc(row.raceName)}</strong></td>
      <td><strong>${esc(getStageDisplayName({ stageNumber: row.stageNumber } as any))}</strong></td>
      <td>${formatElevationGain(row.gainMeters)}</td>
      <td>${Math.round(row.elevationAtTop).toLocaleString('de-DE')} m</td>
      <td>${formatKm(row.distanceKm)}</td>
      <td>${row.avgGradient.toFixed(1).replace('.', ',')}%</td>
      <td>${row.maxGradient.toFixed(1).replace('.', ',')}%</td>
    </tr>`).join('');

  empty.classList.toggle('hidden', rows.length > 0 || state.stageEditorOverviewLoading);
  meta.textContent = state.stageEditorOverviewLoading
    ? 'Climb-Übersicht wird geladen...'
    : `${state.stageEditorClimbRows.length} Anstiege (Bergwertungen/Bergankünfte)`;
}

export async function loadStageEditorOverview(force = false): Promise<void> {
  if (state.stageEditorOverviewLoaded && !force) {
    renderStageEditorStagesOverview();
    renderStageEditorClimbsOverview();
    return;
  }

  state.stageEditorOverviewLoading = true;
  renderStageEditorStagesOverview();
  renderStageEditorClimbsOverview();
  const res = await api.getStageEditorOverview();
  state.stageEditorOverviewLoading = false;
  state.stageEditorOverviewLoaded = true;
  if (!res.success || !res.data) {
    state.stageEditorOverviewLoaded = false;
    alert(`Übersicht konnte nicht geladen werden: ${res.error ?? 'Unbekannter Fehler'}`);
    renderStageEditorStagesOverview();
    renderStageEditorClimbsOverview();
    return;
  }

  state.stageEditorStageRows = res.data.stages;
  state.stageEditorClimbRows = res.data.climbs;
  renderStageEditorStagesOverview();
  renderStageEditorClimbsOverview();
}

export async function loadStageEditorExistingStages(force = false): Promise<void> {
  const container = $('stage-editor-existing-stage-wrap');
  if (state.stageEditorExistingStagesLoaded && !force) {
    renderStageEditorExistingStages();
    return;
  }

  container.classList.add('loading');
  const select = $<HTMLSelectElement>('stage-editor-existing-stage');
  select.innerHTML = '<option value="">Lade vorhandene CSV-Stages...</option>';
  const res = await api.listStageEditorStages();
  container.classList.remove('loading');
  state.stageEditorExistingStagesLoaded = true;
  if (!res.success || !res.data) {
    state.stageEditorExistingStagesLoaded = false;
    select.innerHTML = '<option value="">Laden fehlgeschlagen</option>';
    return;
  }

  state.stageEditorExistingStages = res.data.stages;
  renderStageEditorExistingStages();
}

export function renderStageEditorExistingStages(): void {
  const select = $<HTMLSelectElement>('stage-editor-existing-stage');
  const currentVal = select.value;
  select.innerHTML = '<option value="">– Vorhandene CSV-Stage auswählen –</option>' +
    state.stageEditorExistingStages.map(stage => {
      const activeText = (stage as any).hasDetails ? '' : ' (Details fehlen)';
      return `<option value="${stage.stageId}"${String(stage.stageId) === currentVal ? ' selected' : ''}>${stage.stageId} · ${esc(stage.raceName)} · Etappe ${stage.stageNumber}${activeText}</option>`;
    }).join('');
}

export function sortStageEditorStageRows(rows: StageEditorStageOverviewRow[]): StageEditorStageOverviewRow[] {
  const directionFactor = state.stageEditorStagesSort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((left, right) => {
    let comparison = 0;
    switch (state.stageEditorStagesSort.key) {
      case 'stageId':
        comparison = left.stageId - right.stageId;
        break;
      case 'countryCode':
        comparison = (left.countryCode || '').localeCompare(right.countryCode || '', 'de');
        break;
      case 'raceName':
        comparison = left.raceName.localeCompare(right.raceName, 'de');
        break;
      case 'stageNumber':
        comparison = left.stageNumber - right.stageNumber;
        break;
      case 'profile':
        comparison = left.profile.localeCompare(right.profile, 'de');
        break;
      case 'distanceKm':
        comparison = left.distanceKm - right.distanceKm;
        break;
      case 'elevationGainMeters':
        comparison = left.elevationGainMeters - right.elevationGainMeters;
        break;
      case 'sprintCount':
        comparison = left.sprintCount - right.sprintCount;
        break;
      case 'climbCount':
        comparison = left.climbCount - right.climbCount;
        break;
      case 'profileScore':
        comparison = left.profileScore - right.profileScore;
        break;
    }
    return comparison * directionFactor || left.stageId - right.stageId;
  });
}

export function sortStageEditorClimbRows(rows: StageEditorClimbOverviewRow[]): StageEditorClimbOverviewRow[] {
  const directionFactor = state.stageEditorClimbsSort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((left, right) => {
    let comparison = 0;
    switch (state.stageEditorClimbsSort.key) {
      case 'placementKm':
        comparison = left.placementKm - right.placementKm;
        break;
      case 'name':
        comparison = left.name.localeCompare(right.name, 'de');
        break;
      case 'category':
        comparison = (left.category ?? '').localeCompare(right.category ?? '', 'de');
        break;
      case 'countryCode':
        comparison = (left.countryCode || '').localeCompare(right.countryCode || '', 'de');
        break;
      case 'raceName':
        comparison = left.raceName.localeCompare(right.raceName, 'de');
        break;
      case 'stageNumber':
        comparison = left.stageNumber - right.stageNumber;
        break;
      case 'gainMeters':
        comparison = left.gainMeters - right.gainMeters;
        break;
      case 'elevationAtTop':
        comparison = left.elevationAtTop - right.elevationAtTop;
        break;
      case 'distanceKm':
        comparison = left.distanceKm - right.distanceKm;
        break;
      case 'avgGradient':
        comparison = left.avgGradient - right.avgGradient;
        break;
      case 'maxGradient':
        comparison = left.maxGradient - right.maxGradient;
        break;
      case 'climbScore':
        comparison = left.climbScore - right.climbScore;
        break;
    }
    return comparison * directionFactor || left.placementKm - right.placementKm;
  });
}

function markerLabelValue(markers: StageMarker[]): string {
  return markers.map((marker) => marker.type).join(' | ');
}

export interface PairedClimb {
  name: string;
  startKm: number;
  endKm: number;
  distanceKm: number;
  gainMeters: number;
  avgGradient: number;
  category: StageMarkerCategory;
}

export interface IntermediateSprint {
  name: string;
  kmMark: number;
}

export function getPairedClimbs(draft: StageEditorDraft): PairedClimb[] {
  const climbs: PairedClimb[] = [];
  const openClimbs: Array<{ name: string; segmentIndex: number; startKm: number; startElevation: number }> = [];

  let currentKm = 0;
  draft.segments.forEach((segment, segmentIndex) => {
    const segmentStartKm = currentKm;
    const segmentEndKm = roundStageEditorKm(segmentStartKm + segment.lengthKm);
    const segmentEndElevation = getStageEditorSegmentEndElevation(segment);

    segment.markers.forEach((marker) => {
      if (marker.type === 'climb_start' && marker.name) {
        openClimbs.push({
          name: marker.name,
          segmentIndex,
          startKm: segmentStartKm,
          startElevation: segment.startElevation,
        });
      }
    });

    segment.endMarkers.forEach((marker) => {
      if (isMountainClassificationMarkerType(marker.type, marker.cat) && marker.name) {
        let matchingIndex = -1;
        for (let i = openClimbs.length - 1; i >= 0; i--) {
          if (openClimbs[i].name === marker.name) {
            matchingIndex = i;
            break;
          }
        }

        if (matchingIndex >= 0) {
          const start = openClimbs[matchingIndex];
          openClimbs.splice(matchingIndex, 1);

          const distanceKm = roundStageEditorKm(segmentEndKm - start.startKm);
          const gainMeters = Math.max(0, segmentEndElevation - start.startElevation);
          const avgGradient = distanceKm > 0 ? roundStageEditorOneDecimal(gainMeters / (distanceKm * 10)) : 0;

          climbs.push({
            name: marker.name,
            startKm: start.startKm,
            endKm: segmentEndKm,
            distanceKm,
            gainMeters,
            avgGradient,
            category: marker.cat || '4',
          });
        }
      }
    });

    currentKm = segmentEndKm;
  });

  return climbs;
}

export function getIntermediateSprints(draft: StageEditorDraft): IntermediateSprint[] {
  const sprints: IntermediateSprint[] = [];
  let currentKm = 0;
  draft.segments.forEach((segment) => {
    const segmentEndKm = roundStageEditorKm(currentKm + segment.lengthKm);
    segment.endMarkers.forEach((marker) => {
      if (marker.type === 'sprint_intermediate') {
        sprints.push({
          name: marker.name || 'Zwischensprint',
          kmMark: segmentEndKm,
        });
      }
    });
    currentKm = segmentEndKm;
  });
  return sprints;
}

export function getSegmentsInClimbsIndices(draft: StageEditorDraft): Set<number> {
  const indices = new Set<number>();
  const openClimbs: Array<{ name: string; segmentIndex: number }> = [];

  let currentKm = 0;
  draft.segments.forEach((segment, segmentIndex) => {
    const segmentStartKm = currentKm;
    const segmentEndKm = roundStageEditorKm(segmentStartKm + segment.lengthKm);

    segment.markers.forEach((marker) => {
      if (marker.type === 'climb_start' && marker.name) {
        openClimbs.push({
          name: marker.name,
          segmentIndex,
        });
      }
    });

    if (openClimbs.length > 0) {
      indices.add(segmentIndex);
    }

    segment.endMarkers.forEach((marker) => {
      if (isMountainClassificationMarkerType(marker.type, marker.cat) && marker.name) {
        let matchingIndex = -1;
        for (let i = openClimbs.length - 1; i >= 0; i--) {
          if (openClimbs[i].name === marker.name) {
            matchingIndex = i;
            break;
          }
        }
        if (matchingIndex >= 0) {
          openClimbs.splice(matchingIndex, 1);
        }
      }
    });

    currentKm = segmentEndKm;
  });

  return indices;
}

export function shouldHideStageEditorSegment(draft: StageEditorDraft, index: number, climbIndices: Set<number>): boolean {
  const segment = draft.segments[index];
  if (!segment) return false;

  // 1. Must not lie in an assigned Climb
  if (climbIndices.has(index)) {
    return false;
  }

  // 2. Must not have any marker on it
  if (segment.markers.length > 0 || segment.endMarkers.length > 0) {
    return false;
  }

  // 3. Terrain Flat and Gradient -3 to +1.5%, OR Terrain Abfahrt and Gradient <= -3%
  const isFlatMatch = segment.terrain === 'Flat' && segment.gradientPercent >= -3.0 && segment.gradientPercent <= 1.5;
  const isAbfahrtMatch = segment.terrain === 'Abfahrt' && segment.gradientPercent <= -3.0;

  return isFlatMatch || isAbfahrtMatch;
}

export function renderStageEditor(): void {
  renderStageEditorExistingStages();
  const draft = state.stageEditorDraft;
  const summary = $('stage-editor-import-summary');
  const warnings = $('stage-editor-warnings');
  const climbs = $('stage-editor-climbs');
  const emptyState = $('stage-editor-empty');
  const chart = $('stage-editor-chart');
  const tbody = $('stage-editor-waypoints-body');
  const exportHint = $('stage-editor-export-hint');
  const exportButton = $<HTMLButtonElement>('btn-stage-editor-export');

  if (!draft) {
    summary.innerHTML = '';
    warnings.innerHTML = '';
    climbs.innerHTML = '<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>';
    emptyState.classList.remove('hidden');
    chart.innerHTML = renderStageEditorChart(null);
    tbody.innerHTML = `<tr><td colspan="${STAGE_EDITOR_TABLE_COLUMN_COUNT}" class="text-muted">Keine Segmente vorhanden.</td></tr>`;
    exportHint.textContent = 'Importiere oder lade zuerst eine Strecke. Export erzeugt Downloads und überschreibt keine Masterdateien automatisch.';
    exportButton.disabled = true;
    return;
  }

  emptyState.classList.add('hidden');
  const issues = getStageEditorIssues(draft);
  const metadataErrors = getStageEditorMetadataErrors();
  const profileSelectEl = document.getElementById('stage-editor-profile') as HTMLSelectElement | null;
  const currentProfile = profileSelectEl && profileSelectEl.value ? profileSelectEl.value : draft.suggestedProfile;

  summary.innerHTML = `
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Route</span><strong>${esc(draft.routeName)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Distanz</span><strong>${formatKm(draft.totalDistanceKm)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Anstieg</span><strong>${draft.elevationGainMeters} m</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Profil</span><strong>${esc(currentProfile)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Segmente</span><strong>${draft.segments.length}</strong></div>`;

  const alertItems = [...draft.warnings, ...issues, ...metadataErrors];
  warnings.innerHTML = alertItems.length === 0
    ? '<div class="stage-editor-alert stage-editor-alert-ok">Export bereit. Keine Validierungsfehler.</div>'
    : alertItems.map((item) => `<div class="stage-editor-alert">${esc(item)}</div>`).join('');

  const pairedClimbs = getPairedClimbs(draft);
  const intermediateSprints = getIntermediateSprints(draft);

  let sidebarContent = '';

  if (pairedClimbs.length > 0) {
    sidebarContent += `
      <div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--accent-h);">
        Bergwertungen (${pairedClimbs.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${pairedClimbs.map((climb) => `
          <div class="stage-editor-climb" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--accent);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <strong style="color: #fff; font-size: 0.85rem;">${esc(climb.name)}</strong>
              <span class="stage-editor-climb-category-badge ${climb.category === 'HC' ? 'is-hc' : `is-cat-${climb.category}`}" style="font-size: 0.7rem; padding: 0.1rem 0.35rem;">
                Kat. ${esc(climb.category)}
              </span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-300); display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <span>${formatKm(climb.startKm)} - ${formatKm(climb.endKm)}</span>
              <span>·</span>
              <span><strong>${climb.distanceKm.toFixed(1).replace('.', ',')} km</strong></span>
              <span>·</span>
              <span><strong>${climb.gainMeters} hm</strong></span>
              <span>·</span>
              <span><strong>${climb.avgGradient.toFixed(1).replace('.', ',')}%</strong></span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else {
    sidebarContent += `
      <div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--accent-h);">
        Bergwertungen (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Bergwertungen definiert (climb_start und climb_top Marker mit gleichem Namen paaren).</p>
    `;
  }

  if (intermediateSprints.length > 0) {
    sidebarContent += `
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (${intermediateSprints.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${intermediateSprints.map((sprint) => `
          <div class="stage-editor-sprint" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--success); display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: #fff; font-size: 0.85rem;">${esc(sprint.name)}</strong>
            <span style="font-size: 0.75rem; color: var(--text-300); font-weight: bold;">
              ${formatKm(sprint.kmMark)}
            </span>
          </div>
        `).join('')}
      </div>
    `;
  } else {
    sidebarContent += `
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Zwischensprints definiert (sprint_intermediate Marker hinzufügen).</p>
    `;
  }

  const hideBoringCheckbox = $<HTMLInputElement>('stage-editor-hide-boring-segments-checkbox');
  if (hideBoringCheckbox) {
    hideBoringCheckbox.checked = state.stageEditorHideBoringSegments;
  }

  climbs.innerHTML = sidebarContent;

  chart.innerHTML = renderStageEditorChart(draft);
  const climbIndices = getSegmentsInClimbsIndices(draft);
  tbody.innerHTML = draft.segments.map((segment, index) => {
    const isHidden = state.stageEditorHideBoringSegments && shouldHideStageEditorSegment(draft, index, climbIndices);
    return `
    <tr data-segment-index="${index}" class="${getStageEditorSegmentIssuesAt(draft, index).length > 0 ? 'stage-editor-segment-row-invalid' : ''}" style="height: 3.5rem;${isHidden ? ' display: none;' : ''}">
      <td class="stage-editor-cell-nr text-muted" style="text-align:center; font-weight:700;">${index + 1}</td>
      <td class="stage-editor-cell-length"><input type="number" step="0.01" min="0.2" value="${segment.lengthKm.toFixed(2)}" data-field="segmentLengthKm" class="${stageEditorFieldErrorClass(segment.lengthKm < STAGE_EDITOR_MIN_SEGMENT_KM)}"></td>
      <td class="stage-editor-cell-gradient"><input type="number" step="0.1" value="${segment.gradientPercent.toFixed(1)}" data-field="segmentGradientPercent"></td>
      <td class="stage-editor-cell-terrain"><select data-field="terrain">${terrainOptionsHtml(segment.terrain)}</select></td>
      <td class="stage-editor-cell-start-markers">
        ${renderSegmentMarkerBlock(segment.markers, index, draft.segments.length, 'start')}
      </td>
      <td class="stage-editor-cell-end-markers">
        ${renderSegmentMarkerBlock(segment.endMarkers, index, draft.segments.length, 'end')}
      </td>
      <td class="stage-editor-row-actions">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <div style="display: flex; flex-direction: column; min-width: 3.5rem; justify-content: center; line-height: 1.2;">
            <span class="text-muted" style="font-size: 0.85rem;">${getStageEditorSegmentEndElevation(segment)} m</span>
            <span style="font-size: 0.7rem; color: #888; font-weight: normal;">${formatKm(getStageEditorSegmentStartKm(draft, index) + segment.lengthKm)}</span>
          </div>
          ${renderStageEditorSegmentIssues(draft, index)}
          <button type="button" class="btn btn-secondary btn-xs" data-segment-action="insert" data-segment-index="${index}">+</button>
          ${index === draft.segments.length - 1 ? `<button type="button" class="btn btn-secondary btn-xs" data-segment-action="append" data-segment-index="${index}">+ Ende</button>` : ''}
          ${draft.segments.length > 1 ? `<button type="button" class="btn btn-danger btn-xs" data-segment-action="delete" data-segment-index="${index}">✕</button>` : ''}
        </div>
      </td>
    </tr>`;
  }).join('');

  exportButton.disabled = alertItems.length > 0;
  exportHint.textContent = alertItems.length > 0
    ? `${alertItems.length} Validierungshinweise vor dem Export.`
    : `Exportiert ${$<HTMLInputElement>('stage-editor-details-file').value || 'stage_details.csv'} und eine stages-Row als Download.`;
}

function renderStageEditorSegmentIssues(draft: StageEditorDraft, segmentIndex: number): string {
  const issues = getStageEditorSegmentIssuesAt(draft, segmentIndex);
  if (issues.length === 0) {
    return '<div class="stage-editor-segment-status">OK</div>';
  }

  return `<div class="stage-editor-segment-issues">${issues.map((issue) => `<div>${esc(issue)}</div>`).join('')}</div>`;
}

function renderStageEditorChart(draft: StageEditorDraft | null): string {
  if (!draft || draft.waypoints.length < 2) {
    return '<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';
  }

  const width = 920;
  const height = 280;
  const paddingX = 24;
  const paddingY = 20;
  const waypoints = draft.waypoints;
  const totalDistanceKm = waypoints[waypoints.length - 1].kmMark;
  const minElevation = Math.min(...waypoints.map((waypoint) => waypoint.elevation));
  const maxElevation = Math.max(...waypoints.map((waypoint) => waypoint.elevation));
  const elevationRange = Math.max(1, maxElevation - minElevation);
  const points = waypoints.map((waypoint) => {
    const x = paddingX + (waypoint.kmMark / Math.max(totalDistanceKm, 0.1)) * (width - paddingX * 2);
    const y = height - paddingY - ((waypoint.elevation - minElevation) / elevationRange) * (height - paddingY * 2);
    return { x, y, waypoint };
  });

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${(width - paddingX).toFixed(1)} ${(height - paddingY).toFixed(1)} L ${paddingX.toFixed(1)} ${(height - paddingY).toFixed(1)} Z`;
  const markerLines = points
    .filter((point) => point.waypoint.markers.length > 0)
    .map((point) => `
      <line x1="${point.x.toFixed(1)}" y1="${paddingY}" x2="${point.x.toFixed(1)}" y2="${(height - paddingY).toFixed(1)}" class="stage-editor-chart-marker-line" />
      <text x="${point.x.toFixed(1)}" y="14" class="stage-editor-chart-marker-label">${esc(markerLabelValue(point.waypoint.markers))}</text>`)
    .join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Stage-Profil ${esc(draft.routeName)}">
      <defs>
        <linearGradient id="stage-editor-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="rgba(96, 165, 250, 0.38)"></stop>
          <stop offset="100%" stop-color="rgba(14, 165, 233, 0.04)"></stop>
        </linearGradient>
      </defs>
      <line x1="${paddingX}" y1="${height - paddingY}" x2="${width - paddingX}" y2="${height - paddingY}" class="stage-editor-chart-axis" />
      <line x1="${paddingX}" y1="${paddingY}" x2="${paddingX}" y2="${height - paddingY}" class="stage-editor-chart-axis" />
      ${markerLines}
      <path d="${areaPath}" fill="url(#stage-editor-area)"></path>
      <path d="${linePath}" class="stage-editor-chart-line"></path>
      ${points.map((point) => `<circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="3.5" class="stage-editor-chart-point"></circle>`).join('')}
      <text x="${paddingX}" y="${paddingY - 4}" class="stage-editor-chart-scale">${Math.round(maxElevation)} m</text>
      <text x="${paddingX}" y="${height - 4}" class="stage-editor-chart-scale">${Math.round(minElevation)} m</text>
      <text x="${width - paddingX}" y="${height - 4}" text-anchor="end" class="stage-editor-chart-scale">${formatKm(totalDistanceKm)}</text>
    </svg>`;
}

export function renderStageEditorAutomaticClimbs(draft: StageEditorDraft): string {
  const climbs = draft.climbs ?? [];
  if (climbs.length === 0) {
    return `
      <div class="team-detail-header">
        <h3>Höhenprofil-Analyse</h3>
      </div>
      <p class="text-muted" style="padding:1rem 0">Es wurden keine nennenswerten Anstiege (mehr als 100 hm und mind. 3% Steigung) auf dieser Etappenstrecke entdeckt.</p>`;
  }

  return `
    <div class="team-detail-header">
      <h3>Gefundene Berge (${climbs.length})</h3>
    </div>
    <div class="stage-editor-sidebar-climb-list">
      ${climbs.map((climb, index) => {
    const catNode = climb.category ? `<span class="badge badge-live">Kat. ${climb.category}</span>` : '';
    return `
          <div class="stage-editor-sidebar-climb-item">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <strong>Anstieg ${index + 1}</strong>
                <p class="text-muted text-xs" style="margin-top:0.15rem">${climb.startKm.toFixed(1).replace('.', ',')} km bis ${climb.endKm.toFixed(1).replace('.', ',')} km</p>
              </div>
              ${catNode}
            </div>
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-top:0.5rem; text-align:center;">
              <div class="text-xs">
                <span class="text-muted" style="display:block">Länge</span>
                <strong>${climb.distanceKm.toFixed(1).replace('.', ',')} km</strong>
              </div>
              <div class="text-xs">
                <span class="text-muted" style="display:block">Höhenm.</span>
                <strong>+${climb.gainMeters} hm</strong>
              </div>
              <div class="text-xs">
                <span class="text-muted" style="display:block">Ø Steigung</span>
                <strong>${climb.avgGradient.toFixed(1).replace('.', ',')}%</strong>
              </div>
            </div>
          </div>`;
  }).join('')}
    </div>`;
}

export function updateStageEditorWaypoint(index: number, field: 'startElevation' | keyof StageEditorSegment, rawValue: string): void {
  const draft = state.stageEditorDraft;
  if (!draft) return;
  const segment = draft.segments[index];
  if (!segment) return;

  if (field === 'startElevation') {
    segment.startElevation = Math.max(-500, Math.min(9000, Number.parseInt(rawValue || '0', 10)));
  } else if (field === 'lengthKm') {
    segment.lengthKm = Math.max(0.01, Number.parseFloat(rawValue || '0.1'));
  } else if (field === 'gradientPercent') {
    segment.gradientPercent = Number.parseFloat(rawValue || '0');
  } else if (field === 'terrain') {
    segment.terrain = rawValue as StageTerrain;
    segment.manualTerrain = true;
  } else if (field === 'techLevel') {
    segment.techLevel = Math.max(1, Math.min(10, Number.parseInt(rawValue || '5', 10)));
  } else if (field === 'windExp') {
    segment.windExp = Math.max(1, Math.min(10, Number.parseInt(rawValue || '5', 10)));
  }

  syncStageEditorDerivedState(draft);
  ensureStageEditorBoundaryMarkers(draft);
  renderStageEditor();
}

export function insertStageEditorWaypoint(index: number): void {
  const draft = state.stageEditorDraft;
  if (!draft) return;
  const currentSegment = draft.segments[index];
  if (!currentSegment) return;

  const newSegment: StageEditorSegment = {
    startElevation: currentSegment.startElevation,
    lengthKm: 1.0,
    gradientPercent: 0,
    techLevel: 5,
    windExp: 5,
    terrain: 'Flat',
    markers: [],
    endMarkers: [],
  };

  draft.segments.splice(index, 0, newSegment);
  syncStageEditorDerivedState(draft);
  ensureStageEditorBoundaryMarkers(draft);
  renderStageEditor();
}

export function appendStageEditorWaypoint(): void {
  const draft = state.stageEditorDraft;
  if (!draft) return;
  const lastSegment = draft.segments[draft.segments.length - 1];
  const startElevation = lastSegment ? getStageEditorSegmentEndElevation(lastSegment) : 100;

  const newSegment: StageEditorSegment = {
    startElevation,
    lengthKm: 1.0,
    gradientPercent: 0,
    techLevel: 5,
    windExp: 5,
    terrain: 'Flat',
    markers: [],
    endMarkers: [],
  };

  draft.segments.push(newSegment);
  syncStageEditorDerivedState(draft);
  ensureStageEditorBoundaryMarkers(draft);
  renderStageEditor();
}

export function deleteStageEditorWaypoint(index: number): void {
  const draft = state.stageEditorDraft;
  if (!draft) return;
  if (draft.segments.length <= 1) return;

  draft.segments.splice(index, 1);
  syncStageEditorDerivedState(draft);
  ensureStageEditorBoundaryMarkers(draft);
  renderStageEditor();
}

// REST endpoints callbacks
export async function onStageEditorImport(): Promise<void> {
  const input = $<HTMLInputElement>('stage-editor-file');
  const file = input.files?.[0];
  if (!file) {
    alert('Bitte zuerst eine GPX- oder TCX-Datei auswählen.');
    return;
  }

  $('stage-editor-file-hint').textContent = `${file.name} · ${(file.size / 1024).toFixed(1).replace('.', ',')} KB`;
  showLoading('Route wird importiert……');
  try {
    const fileContent = await file.text();
    const res = await api.importStageRoute({ fileName: file.name, fileContent });
    if (!res.success || !res.data) {
      alert(`Import fehlgeschlagen: ${res.error ?? 'Unbekannter Fehler'}`);
      return;
    }

    const normalizedDraft = normalizeStageEditorDraft(res.data);
    state.stageEditorDraft = normalizedDraft;
    ensureStageEditorBoundaryMarkers(normalizedDraft);
    setStageEditorDefaults(normalizedDraft);
    renderStageEditor();
    activateView('stage-editor');
  } finally {
    hideLoading();
  }
}

export async function onStageEditorLoadExisting(): Promise<void> {
  const stageId = Number($<HTMLSelectElement>('stage-editor-existing-stage').value);
  if (!Number.isInteger(stageId) || stageId <= 0) {
    alert('Bitte zuerst eine vorhandene CSV-Stage auswählen.');
    return;
  }

  showLoading('CSV-Stage wird geladen...');
  try {
    const res = await api.loadStageEditorStage(stageId);
    if (!res.success || !res.data) {
      alert(`Stage konnte nicht geladen werden: ${res.error ?? 'Unbekannter Fehler'}`);
      return;
    }

    const normalizedDraft = normalizeStageEditorDraft(res.data.draft);
    state.stageEditorDraft = normalizedDraft;
    ensureStageEditorBoundaryMarkers(normalizedDraft);
    setStageEditorMetadataFields(res.data.metadata);
    renderStageEditor();
    activateView('stage-editor');
  } finally {
    hideLoading();
  }
}

export async function onStageEditorExport(): Promise<void> {
  if (!state.stageEditorDraft) {
    alert('Es gibt noch keine importierte oder geladene Strecke.');
    return;
  }

  const issues = [...getStageEditorIssues(state.stageEditorDraft), ...getStageEditorMetadataErrors()];
  if (issues.length > 0) {
    alert(`Export blockiert:\n\n${issues.join('\n')}`);
    renderStageEditor();
    return;
  }

  const newRace = $<HTMLInputElement>('stage-editor-new-race-checkbox').checked;
  const updatePrograms = $<HTMLInputElement>('stage-editor-program-checkbox').checked;

  let raceDetails = undefined;
  if (newRace) {
    raceDetails = {
      name: $<HTMLInputElement>('stage-editor-race-name').value.trim(),
      countryId: Number($<HTMLSelectElement>('stage-editor-race-country').value),
      categoryId: Number($<HTMLSelectElement>('stage-editor-race-category').value),
      isStageRace: Number($<HTMLSelectElement>('stage-editor-race-is-stage-race').value) === 1,
      numberOfStages: Number($<HTMLInputElement>('stage-editor-race-num-stages').value),
      startDate: $<HTMLInputElement>('stage-editor-race-start-date').value.trim(),
      endDate: $<HTMLInputElement>('stage-editor-race-end-date').value.trim(),
      prestige: Number($<HTMLInputElement>('stage-editor-race-prestige').value),
    };
  }

  let programIds = undefined;
  if (updatePrograms) {
    const checked = document.querySelectorAll('input[name="stage-editor-program-selection"]:checked') as NodeListOf<HTMLInputElement>;
    programIds = Array.from(checked).map(cb => Number(cb.value));
  }

  showLoading('CSV-Dateien werden erstellt……');
  try {
    const res = await api.exportStageRoute({
      metadata: readStageEditorMetadata(),
      draft: state.stageEditorDraft,
      newRace,
      raceDetails,
      updatePrograms,
      programIds,
    });
    if (!res.success || !res.data) {
      alert(`Export fehlgeschlagen: ${res.error ?? 'Unbekannter Fehler'}`);
      return;
    }

    downloadTextFile(res.data.stagesFileName, res.data.stagesCsv);
    downloadTextFile(res.data.stageDetailsFileName, res.data.stageDetailsCsv);

    // Post-export auto-increment and reload logic
    const stageNumInput = $<HTMLInputElement>('stage-editor-stage-number');
    const stageNum = Number(stageNumInput.value) || 1;
    stageNumInput.value = String(stageNum + 1);

    const dateInput = $<HTMLInputElement>('stage-editor-date');
    const currentDateVal = dateInput.value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(currentDateVal)) {
      const d = new Date(currentDateVal);
      d.setDate(d.getDate() + 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      dateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    await Promise.all([
      loadStageEditorOverview(true),
      loadStageEditorExistingStages(true),
    ]);

    const nextStageId = resolveNextFreeStageEditorStageId();
    $<HTMLInputElement>('stage-editor-stage-id').value = String(nextStageId);
    prevStageId = nextStageId;

    const newRaceCheckbox = $<HTMLInputElement>('stage-editor-new-race-checkbox');
    if (newRaceCheckbox) newRaceCheckbox.checked = false;
    const newRaceDetails = $('stage-editor-new-race-details');
    if (newRaceDetails) {
      newRaceDetails.classList.add('hidden');
      newRaceDetails.style.display = 'none';
    }

    const programCheckbox = $<HTMLInputElement>('stage-editor-program-checkbox');
    if (programCheckbox) programCheckbox.checked = false;
    const programDetails = $('stage-editor-program-details');
    if (programDetails) {
      programDetails.classList.add('hidden');
      programDetails.style.display = 'none';
    }

    const raceIdVal = Number($<HTMLInputElement>('stage-editor-race-id').value);
    prevRaceId = raceIdVal;

    renderStageEditor();
  } finally {
    hideLoading();
  }
}

export function initStageEditorListeners(): void {
  // Stage Editor Table overview sorting
  const stagesTable = document.getElementById('stage-editor-stages-table');
  if (stagesTable) {
    stagesTable.addEventListener('click', (event) => {
      const profileButton = (event.target as Element).closest<HTMLButtonElement>('button[data-stage-profile-open-stage-id]');
      if (profileButton) {
        const stageId = Number(profileButton.dataset['stageProfileOpenStageId']);
        if (Number.isFinite(stageId)) {
          void openDashboardStageProfile(stageId);
        }
        return;
      }

      const sortButton = (event.target as Element).closest<HTMLButtonElement>('button[data-stage-editor-stages-sort]');
      if (!sortButton) return;

      const sortKey = sortButton.dataset['stageEditorStagesSort'] as StageEditorStagesSortKey;
      if (state.stageEditorStagesSort.key === sortKey) {
        state.stageEditorStagesSort.direction = state.stageEditorStagesSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        state.stageEditorStagesSort = {
          key: sortKey,
          direction: getDefaultStageEditorStagesSortDirection(sortKey),
        };
      }
      renderStageEditorStagesOverview();
    });
  }

  const climbsTable = document.getElementById('stage-editor-climbs-table');
  if (climbsTable) {
    climbsTable.addEventListener('click', (event) => {
      const profileButton = (event.target as Element).closest<HTMLButtonElement>('button[data-stage-profile-open-stage-id]');
      if (profileButton) {
        const stageId = Number(profileButton.dataset['stageProfileOpenStageId']);
        const climbId = profileButton.dataset['stageProfileOpenClimbId'] ?? null;
        if (Number.isFinite(stageId)) {
          let selectedClimb: StageEditorClimbOverviewRow | null = null;
          if (climbId && state.stageEditorClimbRows) {
            selectedClimb = state.stageEditorClimbRows.find((c) => c.id === climbId) ?? null;
          }
          void openDashboardStageProfile(stageId, selectedClimb);
        }
        return;
      }

      const sortButton = (event.target as Element).closest<HTMLButtonElement>('button[data-stage-editor-climbs-sort]');
      if (!sortButton) return;

      const sortKey = sortButton.dataset['stageEditorClimbsSort'] as StageEditorClimbsSortKey;
      if (state.stageEditorClimbsSort.key === sortKey) {
        state.stageEditorClimbsSort.direction = state.stageEditorClimbsSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        state.stageEditorClimbsSort = {
          key: sortKey,
          direction: getDefaultStageEditorClimbsSortDirection(sortKey),
        };
      }
      renderStageEditorClimbsOverview();
    });
  }

  const importBtn = document.getElementById('btn-stage-editor-import');
  if (importBtn) {
    importBtn.addEventListener('click', () => {
      void onStageEditorImport();
    });
  }

  const loadExistingBtn = document.getElementById('btn-stage-editor-load-existing');
  if (loadExistingBtn) {
    loadExistingBtn.addEventListener('click', () => {
      void onStageEditorLoadExisting();
    });
  }

  const exportBtn = document.getElementById('btn-stage-editor-export');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      void onStageEditorExport();
    });
  }

  const fileInput = document.getElementById('stage-editor-file');
  if (fileInput) {
    fileInput.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files?.[0] ?? null;
      $('stage-editor-file-hint').textContent = file
        ? `${file.name} · ${(file.size / 1024).toFixed(1).replace('.', ',')} KB`
        : 'Noch keine Datei ausgewählt.';
    });
  }

  const waypoints = document.getElementById('stage-editor-waypoints');
  if (waypoints) {
    waypoints.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement | HTMLSelectElement;
      const row = target.closest<HTMLTableRowElement>('tr[data-segment-index]');
      const field = target.dataset['field'] as any;
      if (!row || !field) return;
      const index = Number(row.dataset['segmentIndex']);
      if (!Number.isInteger(index)) return;

      if (field === 'markerType' || field === 'markerName' || field === 'markerCat') {
        const markerIndex = Number(target.dataset['markerIndex']);
        const markerScope = target.dataset['markerScope'];
        if (!Number.isInteger(markerIndex)) return;
        if (markerScope !== 'start' && markerScope !== 'end') return;
        updateStageEditorMarker(index, markerIndex, markerScope, field, target.value);
        return;
      }

      updateStageEditorWaypoint(index, field, target.value);
    });

    waypoints.addEventListener('click', (event) => {
      const button = (event.target as Element).closest<HTMLButtonElement>('button[data-segment-action]');
      if (!button) return;
      const index = Number(button.dataset['segmentIndex']);
      if (!Number.isInteger(index)) return;
      if (button.dataset['segmentAction'] === 'insert') {
        insertStageEditorWaypoint(index);
        return;
      }
      if (button.dataset['segmentAction'] === 'append') {
        appendStageEditorWaypoint();
        return;
      }
      if (button.dataset['segmentAction'] === 'add-marker') {
        const markerScope = button.dataset['markerScope'];
        if (markerScope !== 'start' && markerScope !== 'end') return;
        addStageEditorMarker(index, markerScope);
        return;
      }
      if (button.dataset['segmentAction'] === 'remove-marker') {
        const markerIndex = Number(button.dataset['markerIndex']);
        const markerScope = button.dataset['markerScope'];
        if (!Number.isInteger(markerIndex)) return;
        if (markerScope !== 'start' && markerScope !== 'end') return;
        removeStageEditorMarker(index, markerIndex, markerScope);
        return;
      }
      if (button.dataset['segmentAction'] === 'delete') {
        deleteStageEditorWaypoint(index);
      }
    });
  }

  ['stage-editor-stage-id', 'stage-editor-race-id', 'stage-editor-stage-number', 'stage-editor-date', 'stage-editor-details-file', 'stage-editor-profile'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        if (id === 'stage-editor-date') {
          updateRaceDatesFromStageDate();
        }
        renderStageEditor();
      });
    }
  });

  const weatherInputs = document.querySelectorAll('input[name="stage-editor-weather"]');
  weatherInputs.forEach((cb) => {
    cb.addEventListener('change', () => renderStageEditor());
  });

  // Toggle fields for Neues Rennen
  const newRaceCb = $<HTMLInputElement>('stage-editor-new-race-checkbox');
  const newRaceDetails = $('stage-editor-new-race-details');
  const programCb = $<HTMLInputElement>('stage-editor-program-checkbox');
  const programDetails = $('stage-editor-program-details');

  if (newRaceCb) {
    newRaceCb.addEventListener('change', () => {
      const checked = newRaceCb.checked;
      if (checked) {
        if (newRaceDetails) {
          newRaceDetails.classList.remove('hidden');
          newRaceDetails.style.display = 'grid';
        }
        if (programCb) {
          programCb.checked = true;
          if (programDetails) {
            programDetails.classList.remove('hidden');
            programDetails.style.display = 'block';
          }
        }
        updateRaceDatesFromStageDate();
      } else {
        if (newRaceDetails) {
          newRaceDetails.classList.add('hidden');
          newRaceDetails.style.display = 'none';
        }
      }
      renderStageEditor();
    });
  }

  const isStageRaceSelect = document.getElementById('stage-editor-race-is-stage-race');
  if (isStageRaceSelect) {
    isStageRaceSelect.addEventListener('change', () => {
      updateRaceDatesFromStageDate();
    });
  }

  const numStagesInput = document.getElementById('stage-editor-race-num-stages');
  if (numStagesInput) {
    numStagesInput.addEventListener('input', () => {
      updateRaceDatesFromStageDate();
    });
  }

  const startDateInput = document.getElementById('stage-editor-race-start-date');
  if (startDateInput) {
    startDateInput.addEventListener('change', () => {
      const startDate = (startDateInput as HTMLInputElement).value.trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
        const isStageRaceSel = document.getElementById('stage-editor-race-is-stage-race') as HTMLSelectElement | null;
        const isStageRace = isStageRaceSel ? Number(isStageRaceSel.value) === 1 : false;
        const endDateInput = $<HTMLInputElement>('stage-editor-race-end-date');
        if (endDateInput) {
          if (!isStageRace) {
            endDateInput.value = startDate;
          } else {
            const numStagesIn = document.getElementById('stage-editor-race-num-stages') as HTMLInputElement | null;
            const numStages = numStagesIn ? (Number(numStagesIn.value) || 1) : 1;
            const [year, month, day] = startDate.split('-').map(Number);
            const d = new Date(year, month - 1, day);
            let extraDays = 0;
            if (numStages === 21) {
              extraDays = 2;
            } else if (numStages >= 14) {
              extraDays = 1;
            }
            const totalDays = numStages + extraDays;
            d.setDate(d.getDate() + totalDays - 1);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            endDateInput.value = `${yyyy}-${mm}-${dd}`;
          }
        }
      }
    });
  }

  if (programCb) {
    programCb.addEventListener('change', () => {
      const checked = programCb.checked;
      if (checked) {
        if (programDetails) {
          programDetails.classList.remove('hidden');
          programDetails.style.display = 'block';
        }
      } else {
        if (programDetails) {
          programDetails.classList.add('hidden');
          programDetails.style.display = 'none';
        }
      }
      renderStageEditor();
    });
  }

  // Custom multi-select programs dropdown trigger/OK/click outside
  const trigger = $('stage-editor-programs-dropdown-trigger');
  const menu = $('stage-editor-programs-dropdown-menu');
  const okBtn = $('btn-stage-editor-programs-ok');

  if (trigger && menu) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = menu.style.display === 'none' || !menu.style.display;
      menu.style.display = isHidden ? 'flex' : 'none';
    });

    if (okBtn) {
      okBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.style.display = 'none';
        renderStageEditor();
      });
    }

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (menu.style.display === 'flex' && !menu.contains(target) && target !== trigger && !trigger.contains(target)) {
        menu.style.display = 'none';
        renderStageEditor();
      }
    });
  }

  const programList = $('stage-editor-programs-list');
  if (programList) {
    programList.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.name === 'stage-editor-program-selection') {
        updateSelectedProgramsText();
      }
    });
  }

  // Arrow up/down & spinner skipping for Stage ID & Race ID
  let isTyping = false;
  let typingTimeout: any = null;

  const stageIdInput = $<HTMLInputElement>('stage-editor-stage-id');
  const raceIdInput = $<HTMLInputElement>('stage-editor-race-id');

  if (stageIdInput && raceIdInput) {
    [stageIdInput, raceIdInput].forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          isTyping = false;
          if (typingTimeout) clearTimeout(typingTimeout);
        } else {
          isTyping = true;
          if (typingTimeout) clearTimeout(typingTimeout);
        }
      });
      input.addEventListener('keyup', (e) => {
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
          if (typingTimeout) clearTimeout(typingTimeout);
          typingTimeout = setTimeout(() => {
            isTyping = false;
          }, 150);
        }
      });
      input.addEventListener('mousedown', () => {
        isTyping = false;
      });
      input.addEventListener('blur', () => {
        isTyping = false;
      });
    });

    const handleIdInput = (input: HTMLInputElement, type: 'stage' | 'race') => {
      const val = Number(input.value);
      if (!Number.isInteger(val) || val <= 0) {
        if (type === 'stage') prevStageId = val;
        else prevRaceId = val;
        return;
      }

      const prevVal = type === 'stage' ? prevStageId : prevRaceId;
      const diff = val - prevVal;

      if (!isTyping && (diff === 1 || diff === -1)) {
        let nextVal = val;
        if (type === 'stage') {
          nextVal = findNextFreeStageId(val, diff);
        } else {
          const isNewRace = $<HTMLInputElement>('stage-editor-new-race-checkbox').checked;
          if (isNewRace) {
            nextVal = findNextFreeRaceId(val, diff);
          }
        }
        input.value = String(nextVal);
      }

      if (type === 'stage') {
        prevStageId = Number(input.value);
      } else {
        prevRaceId = Number(input.value);
      }
    };

    stageIdInput.addEventListener('input', () => {
      handleIdInput(stageIdInput, 'stage');
      renderStageEditor();
    });

    raceIdInput.addEventListener('input', () => {
      handleIdInput(raceIdInput, 'race');
      renderStageEditor();
    });
  }

  const hideBoringCheckbox = $<HTMLInputElement>('stage-editor-hide-boring-segments-checkbox');
  if (hideBoringCheckbox) {
    hideBoringCheckbox.addEventListener('change', () => {
      state.stageEditorHideBoringSegments = hideBoringCheckbox.checked;
      renderStageEditor();
    });
  }
}

