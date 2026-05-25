import type { ParsedStageSummary, StageMarker } from '../../../shared/types';

export interface StageBoundaryMarker {
  key: string;
  label: string;
  marker: StageMarker;
  kmMark: number;
  elevation: number;
  boundary: 'start' | 'end';
  sequence: number;
}

export interface StageSummaryMeta {
  segmentCount: number;
  sprintCount: number;
  climbCount: number;
}

export function isMountainClassificationMarker(marker: StageMarker): boolean {
  return marker.type === 'climb_top'
    || ((marker.type === 'finish_hill' || marker.type === 'finish_mountain') && marker.cat != null && marker.cat !== 'Sprint');
}

function buildStageBoundaryMarkerKey(segmentIndex: number, boundary: 'start' | 'end', markerIndex: number, marker: StageMarker): string {
  return `${marker.type}:${segmentIndex}:${boundary}:${markerIndex}`;
}

function buildDefaultMarkerLabel(marker: StageMarker, ordinal: number): string {
  if (marker.type === 'sprint_intermediate') return `SZ ${ordinal}`;
  if (isMountainClassificationMarker(marker)) return `Berg ${ordinal}`;
  if (marker.type === 'climb_start') return `Anstieg ${ordinal}`;
  if (marker.type === 'start') return 'Start';
  return 'Ziel';
}

export function collectStageBoundaryMarkers(summary: ParsedStageSummary): StageBoundaryMarker[] {
  const markers: StageBoundaryMarker[] = [];

  summary.segments.forEach((segment, segmentIndex) => {
    const sequenceBase = segmentIndex * 2;
    (segment.start_markers ?? []).forEach((marker, markerIndex) => {
      markers.push({
        key: buildStageBoundaryMarkerKey(segmentIndex, 'start', markerIndex, marker),
        label: '',
        marker,
        kmMark: segment.start_km,
        elevation: segment.start_elevation,
        boundary: 'start',
        sequence: sequenceBase + (markerIndex / 100),
      });
    });

    (segment.end_markers ?? []).forEach((marker, markerIndex) => {
      markers.push({
        key: buildStageBoundaryMarkerKey(segmentIndex, 'end', markerIndex, marker),
        label: '',
        marker,
        kmMark: segment.end_km,
        elevation: segment.end_elevation,
        boundary: 'end',
        sequence: sequenceBase + 1 + (markerIndex / 100),
      });
    });
  });

  const sorted = markers.sort((left, right) => left.kmMark - right.kmMark || left.sequence - right.sequence);
  const counts = new Map<StageMarker['type'], number>();
  return sorted.map((entry) => {
    const ordinal = (counts.get(entry.marker.type) ?? 0) + 1;
    counts.set(entry.marker.type, ordinal);
    return {
      ...entry,
      label: entry.marker.name ?? buildDefaultMarkerLabel(entry.marker, ordinal),
    };
  });
}

export function buildIntermediateSplitLabels(summary: ParsedStageSummary): string[] {
  return collectStageBoundaryMarkers(summary)
    .filter(({ marker }) => marker.type === 'sprint_intermediate' || isMountainClassificationMarker(marker))
    .map(({ label }) => label);
}

export function summarizeStageMarkers(summary: ParsedStageSummary): StageSummaryMeta {
  const boundaryMarkers = collectStageBoundaryMarkers(summary);
  return {
    segmentCount: summary.segments.length,
    sprintCount: boundaryMarkers.filter(({ marker }) => marker.type === 'sprint_intermediate').length,
    climbCount: boundaryMarkers.filter(({ marker }) => isMountainClassificationMarker(marker)).length,
  };
}
