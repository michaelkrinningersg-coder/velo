import type { StageMarker, StageMarkerCategory } from '../../../shared/types';

export interface StageScoreSegment {
  lengthKm: number;
  gradientPercent: number;
  markers: StageMarker[];
  endMarkers: StageMarker[];
  terrain?: string;
}

export interface StageClimbScore {
  climbIndex: number;
  startKm: number;
  endKm: number;
  name: string;
  category: Extract<StageMarkerCategory, 'HC' | '1' | '2' | '3' | '4'> | null;
  score: number;
}

interface PositionedScoreSegment {
  startKm: number;
  endKm: number;
  startElevation: number;
  endElevation: number;
  gradientPercent: number;
  markers: StageMarker[];
  endMarkers: StageMarker[];
  terrain?: string;
}

interface OpenClimb {
  startKm: number;
  name: string | null;
}

const SCORE_CALIBRATION_DIVISOR = 8.9051;
const STAGE_SCORE_MAX = 1000;

function isClassifiedClimbEnd(marker: StageMarker): boolean {
  return marker.type === 'climb_top'
    || marker.type === 'finish_hill'
    || marker.type === 'finish_mountain';
}

function normalizeClimbCategory(category: StageMarkerCategory | null): Extract<StageMarkerCategory, 'HC' | '1' | '2' | '3' | '4'> | null {
  return category != null && category !== 'Sprint' ? category : null;
}

function resolveClimbEndCategory(
  marker: StageMarker,
  lastSeenCategory: Extract<StageMarkerCategory, 'HC' | '1' | '2' | '3' | '4'> | null,
): Extract<StageMarkerCategory, 'HC' | '1' | '2' | '3' | '4'> | null {
  const explicitCategory = normalizeClimbCategory(marker.cat);
  if (explicitCategory != null) {
    return explicitCategory;
  }

  if ((marker.type === 'finish_hill' || marker.type === 'finish_mountain') && lastSeenCategory != null) {
    return lastSeenCategory;
  }

  return null;
}

function buildPositionedScoreSegments(segments: StageScoreSegment[], startElevation: number): PositionedScoreSegment[] {
  let currentKm = 0;
  let currentElevation = startElevation;

  return segments.map((segment) => {
    const startKm = currentKm;
    const endKm = currentKm + segment.lengthKm;
    const endElevation = currentElevation + ((segment.lengthKm * 1000) * (segment.gradientPercent / 100));
    const positionedSegment: PositionedScoreSegment = {
      startKm,
      endKm,
      startElevation: currentElevation,
      endElevation,
      gradientPercent: segment.gradientPercent,
      markers: segment.markers,
      endMarkers: segment.endMarkers,
      terrain: segment.terrain,
    };
    currentKm = endKm;
    currentElevation = endElevation;
    return positionedSegment;
  });
}

function calculateSegmentScore(
  lengthKm: number,
  gradientPercent: number,
  endKm: number,
  endElevation: number,
  totalDistanceKm: number,
  terrain?: string,
): number {
  if (lengthKm <= 0 || totalDistanceKm <= 0) {
    return 0;
  }

  const baseFactor = gradientPercent >= 0
    ? lengthKm * (1 + (gradientPercent ** 2))
    : lengthKm * 0.1;
  const progress = endKm / totalDistanceKm;
  const positionMultiplier = 0.1 + (1.9 * (progress ** 1.8));

  let terrainMultiplier = 1.0;
  if (terrain) {
    const norm = terrain.toLowerCase();
    if (norm === 'cobble') {
      terrainMultiplier = 2.0;
    } else if (norm === 'cobble_hill' || norm === 'cobblehill') {
      terrainMultiplier = 2.5;
    }
  }

  const distanceFactor = 0.5 + (0.25 * (endKm / 150));
  const altitudeFactor = 1 + (0.08 * ((endElevation / 1000) ** 2));

  return (baseFactor * positionMultiplier * terrainMultiplier * distanceFactor * altitudeFactor) / SCORE_CALIBRATION_DIVISOR;
}

function calculateScoreForRange(positionedSegments: PositionedScoreSegment[], totalDistanceKm: number, startKm: number, endKm: number): number {
  return positionedSegments.reduce((sum, segment) => {
    const clippedStartKm = Math.max(startKm, segment.startKm);
    const clippedEndKm = Math.min(endKm, segment.endKm);
    const clippedLengthKm = clippedEndKm - clippedStartKm;
    if (clippedLengthKm <= 0) {
      return sum;
    }

    const segmentLengthKm = segment.endKm - segment.startKm;
    const startRatio = segmentLengthKm > 0 ? (clippedStartKm - segment.startKm) / segmentLengthKm : 0;
    const endRatio = segmentLengthKm > 0 ? (clippedEndKm - segment.startKm) / segmentLengthKm : 0;
    const clippedStartElevation = segment.startElevation + ((segment.endElevation - segment.startElevation) * startRatio);
    const clippedEndElevation = segment.startElevation + ((segment.endElevation - segment.startElevation) * endRatio);
    const clippedGradientPercent = clippedLengthKm > 0
      ? ((clippedEndElevation - clippedStartElevation) / (clippedLengthKm * 1000)) * 100
      : segment.gradientPercent;

    return sum + calculateSegmentScore(
      clippedLengthKm,
      clippedGradientPercent,
      clippedEndKm,
      clippedEndElevation,
      totalDistanceKm,
      segment.terrain,
    );
  }, 0);
}

export function calculateStageScore(segments: StageScoreSegment[], startElevation: number): number {
  const totalDistanceKm = segments.reduce((sum, segment) => sum + segment.lengthKm, 0);
  const positionedSegments = buildPositionedScoreSegments(segments, startElevation);
  const rawScore = calculateScoreForRange(positionedSegments, totalDistanceKm, 0, totalDistanceKm);
  return Math.min(STAGE_SCORE_MAX, Math.round(rawScore));
}

export function calculateClimbScoresForStage(segments: StageScoreSegment[], startElevation: number): StageClimbScore[] {
  const totalDistanceKm = segments.reduce((sum, segment) => sum + segment.lengthKm, 0);
  const positionedSegments = buildPositionedScoreSegments(segments, startElevation);
  const climbs: StageClimbScore[] = [];
  let openClimb: OpenClimb | null = null;
  let lastSeenCategory: Extract<StageMarkerCategory, 'HC' | '1' | '2' | '3' | '4'> | null = null;

  for (const segment of positionedSegments) {
    for (const marker of segment.markers) {
      const markerCategory = normalizeClimbCategory(marker.cat);
      if (markerCategory != null) {
        lastSeenCategory = markerCategory;
      }

      if (marker.type === 'climb_start' && openClimb == null) {
        openClimb = {
          startKm: segment.startKm,
          name: marker.name,
        };
      }
    }

    for (const marker of segment.endMarkers) {
      const markerCategory = normalizeClimbCategory(marker.cat);
      if (!isClassifiedClimbEnd(marker) || openClimb == null || segment.endKm <= openClimb.startKm) {
        if (markerCategory != null) {
          lastSeenCategory = markerCategory;
        }
        continue;
      }

      const resolvedCategory = resolveClimbEndCategory(marker, lastSeenCategory);
      const score = calculateScoreForRange(positionedSegments, totalDistanceKm, openClimb.startKm, segment.endKm);
      climbs.push({
        climbIndex: climbs.length + 1,
        startKm: Math.round(openClimb.startKm * 100) / 100,
        endKm: Math.round(segment.endKm * 100) / 100,
        name: marker.name ?? openClimb.name ?? `Climb ${climbs.length + 1}`,
        category: resolvedCategory,
        score: Math.round(score),
      });
      if (resolvedCategory != null) {
        lastSeenCategory = resolvedCategory;
      }
      openClimb = null;
    }
  }

  return climbs;
}
