import type { ParsedStageSummary, StageMarkerCategory, StageMarkerType, StageProfilePoint } from '../../../shared/types';
import type { RiderCluster, SimulationSnapshot } from './SimulationEngine';

function esc(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function formatKm(meters: number): string {
  return `${(meters / 1000).toFixed(1).replace('.', ',')} km`;
}

interface ProfileEvent {
  x: number;
  anchorY: number;
  labelY: number;
  primaryLabel: string;
  secondaryLabel: string | null;
  accentColor: string;
  fillColor: string;
}

function scaleDistance(distanceMeter: number, stageDistanceMeters: number, width: number, paddingX: number): number {
  if (stageDistanceMeters <= 0) {
    return paddingX;
  }
  return paddingX + (distanceMeter / stageDistanceMeters) * (width - paddingX * 2);
}

function interpolateElevation(summary: ParsedStageSummary, distanceMeter: number): number {
  const targetKm = distanceMeter / 1000;
  const points = summary.points;
  if (targetKm <= points[0].kmMark) {
    return points[0].elevation;
  }

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    if (targetKm > next.kmMark) {
      continue;
    }

    const segmentSpan = Math.max(0.0001, next.kmMark - current.kmMark);
    const ratio = (targetKm - current.kmMark) / segmentSpan;
    return current.elevation + ((next.elevation - current.elevation) * ratio);
  }

  return points[points.length - 1].elevation;
}

function scaleElevation(elevation: number, axisMaxElevation: number, height: number, paddingTop: number, paddingBottom: number): number {
  const elevationRange = Math.max(1, axisMaxElevation);
  return height - paddingBottom - (elevation / elevationRange) * (height - paddingTop - paddingBottom);
}

function formatElevationLabel(value: number): string {
  return `${Math.round(value)} m`;
}

function formatClimbLength(lengthKm: number): string {
  return `${lengthKm.toFixed(1).replace('.', ',')} km`;
}

function formatGradient(value: number): string {
  return `${value.toFixed(1).replace('.', ',')}%`;
}

function resolveMarkerAccent(category: StageMarkerCategory | null, markerType: StageMarkerType): { accentColor: string; fillColor: string } {
  if (markerType === 'sprint_intermediate') {
    return {
      accentColor: '#15803d',
      fillColor: '#ecfdf5',
    };
  }

  switch (category) {
    case 'HC':
      return { accentColor: '#b91c1c', fillColor: '#fef2f2' };
    case '1':
      return { accentColor: '#ea580c', fillColor: '#fff7ed' };
    case '2':
      return { accentColor: '#d97706', fillColor: '#fffbeb' };
    case '3':
      return { accentColor: '#ca8a04', fillColor: '#fefce8' };
    case '4':
      return { accentColor: '#65a30d', fillColor: '#f7fee7' };
    default:
      return { accentColor: '#1f2937', fillColor: '#f8fafc' };
  }
}

function estimateLabelWidth(primaryLabel: string, secondaryLabel: string | null): number {
  const primaryWidth = primaryLabel.length * 6.8;
  const secondaryWidth = (secondaryLabel?.length ?? 0) * 6.1;
  return Math.max(84, primaryWidth, secondaryWidth) + 18;
}

function buildProfileEvents(summary: ParsedStageSummary, stageDistanceMeters: number, width: number, paddingX: number, height: number, paddingTop: number, paddingBottom: number, axisMaxElevation: number): ProfileEvent[] {
  const rawEvents: Array<Omit<ProfileEvent, 'labelY'>> = [];
  const pendingClimbs: Array<{ startPoint: StageProfilePoint; name: string | null }> = [];

  for (const point of summary.points) {
    for (const marker of point.markers) {
      if (marker.type === 'climb_start') {
        pendingClimbs.push({
          startPoint: point,
          name: marker.name,
        });
        continue;
      }

      if (marker.type === 'climb_top') {
        let matchingIndex = -1;
        for (let index = pendingClimbs.length - 1; index >= 0; index -= 1) {
          if (pendingClimbs[index]?.name === marker.name) {
            matchingIndex = index;
            break;
          }
        }
        const climbStart = matchingIndex >= 0
          ? pendingClimbs.splice(matchingIndex, 1)[0]
          : pendingClimbs.pop();
        const lengthKm = climbStart ? Math.max(0, point.kmMark - climbStart.startPoint.kmMark) : 0;
        const gainMeters = climbStart ? Math.max(0, point.elevation - climbStart.startPoint.elevation) : 0;
        const avgGradient = lengthKm > 0 ? gainMeters / (lengthKm * 10) : 0;
        const accent = resolveMarkerAccent(marker.cat, marker.type);
        rawEvents.push({
          x: scaleDistance(point.kmMark * 1000, stageDistanceMeters, width, paddingX),
          anchorY: scaleElevation(point.elevation, axisMaxElevation, height, paddingTop, paddingBottom),
          primaryLabel: `${marker.name ?? 'Anstieg'} · Kat. ${marker.cat ?? '?'}`,
          secondaryLabel: lengthKm > 0 ? `${formatClimbLength(lengthKm)} · ${formatGradient(avgGradient)}` : null,
          accentColor: accent.accentColor,
          fillColor: accent.fillColor,
        });
        continue;
      }

      if (marker.type === 'sprint_intermediate') {
        const accent = resolveMarkerAccent(marker.cat, marker.type);
        rawEvents.push({
          x: scaleDistance(point.kmMark * 1000, stageDistanceMeters, width, paddingX),
          anchorY: scaleElevation(point.elevation, axisMaxElevation, height, paddingTop, paddingBottom),
          primaryLabel: marker.name ?? 'Zwischensprint',
          secondaryLabel: 'Sprintwertung',
          accentColor: accent.accentColor,
          fillColor: accent.fillColor,
        });
      }
    }
  }

  const sortedEvents = rawEvents.sort((left, right) => left.x - right.x);
  const bandOffsets = [18, 54, 90];
  const lastEventXByBand = Array.from({ length: bandOffsets.length }, () => -Infinity);

  return sortedEvents.map((event, index) => {
    const preferredGap = event.secondaryLabel ? 160 : 120;
    let bandIndex = bandOffsets.findIndex((_offset, candidateIndex) => event.x - lastEventXByBand[candidateIndex] >= preferredGap);
    if (bandIndex < 0) {
      bandIndex = index % bandOffsets.length;
    }
    lastEventXByBand[bandIndex] = event.x;

    return {
      ...event,
      labelY: bandOffsets[bandIndex],
    };
  });
}

function renderProfileEvent(event: ProfileEvent, width: number, paddingX: number): string {
  const boxWidth = estimateLabelWidth(event.primaryLabel, event.secondaryLabel);
  const boxHeight = event.secondaryLabel ? 38 : 24;
  const left = Math.max(paddingX + 4, Math.min(width - paddingX - boxWidth - 4, event.x - (boxWidth / 2)));
  const centerX = left + (boxWidth / 2);
  const textY = event.labelY + 6;
  const secondaryTextY = event.labelY + 19;

  return `
    <g class="race-sim-marker-group">
      <line x1="${centerX.toFixed(1)}" y1="${(event.labelY + boxHeight + 2).toFixed(1)}" x2="${event.x.toFixed(1)}" y2="${(event.anchorY - 6).toFixed(1)}" stroke="${event.accentColor}" stroke-width="1.5" opacity="0.7"></line>
      <circle cx="${event.x.toFixed(1)}" cy="${event.anchorY.toFixed(1)}" r="3.2" fill="${event.accentColor}" opacity="0.9"></circle>
      <rect x="${left.toFixed(1)}" y="${event.labelY.toFixed(1)}" rx="10" ry="10" width="${boxWidth.toFixed(1)}" height="${boxHeight}" fill="${event.fillColor}" stroke="${event.accentColor}" stroke-width="1.4"></rect>
      <text x="${centerX.toFixed(1)}" y="${textY.toFixed(1)}" text-anchor="middle" class="race-sim-marker-title" fill="${event.accentColor}">${esc(event.primaryLabel)}</text>
      ${event.secondaryLabel != null
        ? `<text x="${centerX.toFixed(1)}" y="${secondaryTextY.toFixed(1)}" text-anchor="middle" class="race-sim-marker-detail">${esc(event.secondaryLabel)}</text>`
        : ''}
    </g>`;
}

function renderCluster(cluster: RiderCluster, summary: ParsedStageSummary, stageDistanceMeters: number, width: number, height: number, paddingX: number, paddingTop: number, paddingBottom: number, axisMaxElevation: number): string {
  const x = scaleDistance(cluster.distanceMeter, stageDistanceMeters, width, paddingX);
  const elevation = interpolateElevation(summary, cluster.distanceMeter);
  const y = scaleElevation(elevation, axisMaxElevation, height, paddingTop, paddingBottom);
  const radius = cluster.riderCount === 1 ? 3.2 : Math.min(8.5, 4.3 + cluster.riderCount * 0.45);
  const badge = cluster.riderCount > 1
    ? `<text x="${x.toFixed(1)}" y="${(y + 3).toFixed(1)}" class="race-sim-cluster-label">${cluster.riderCount}</text>`
    : '';

  return `
    <g class="race-sim-cluster-group">
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius.toFixed(1)}" class="race-sim-cluster-dot${cluster.riderCount > 1 ? ' race-sim-cluster-dot-group' : ''}"></circle>
      ${badge}
    </g>`;
}

export function renderRaceProfile(container: HTMLElement, summary: ParsedStageSummary, snapshot: SimulationSnapshot, label: string): void {
  if (summary.points.length < 2) {
    container.innerHTML = '<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';
    return;
  }

  const width = 1240;
  const height = 440;
  const paddingX = 54;
  const paddingTop = 118;
  const paddingBottom = 40;
  const maxElevation = Math.max(...summary.points.map((point) => point.elevation));
  const axisMaxElevation = Math.max(500, Math.ceil((maxElevation * 1.5) / 50) * 50);
  const baselineY = height - paddingBottom;
  const tickValues = Array.from({ length: 5 }, (_value, index) => (axisMaxElevation / 4) * index);
  const points = summary.points.map((point) => {
    const x = scaleDistance(point.kmMark * 1000, snapshot.stageDistanceMeters, width, paddingX);
    const y = scaleElevation(point.elevation, axisMaxElevation, height, paddingTop, paddingBottom);
    return { x, y, point };
  });
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${(width - paddingX).toFixed(1)} ${baselineY.toFixed(1)} L ${paddingX.toFixed(1)} ${baselineY.toFixed(1)} Z`;
  const markerEvents = buildProfileEvents(summary, snapshot.stageDistanceMeters, width, paddingX, height, paddingTop, paddingBottom, axisMaxElevation)
    .map((event) => renderProfileEvent(event, width, paddingX))
    .join('');
  const gridLines = tickValues.map((value) => {
    const y = scaleElevation(value, axisMaxElevation, height, paddingTop, paddingBottom);
    return `
      <line x1="${paddingX}" y1="${y.toFixed(1)}" x2="${width - paddingX}" y2="${y.toFixed(1)}" class="race-sim-grid-line"></line>
      <text x="${(paddingX - 10).toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label">${formatElevationLabel(value)}</text>`;
  }).join('');
  const clusters = snapshot.clusters
    .map((cluster) => renderCluster(cluster, summary, snapshot.stageDistanceMeters, width, height, paddingX, paddingTop, paddingBottom, axisMaxElevation))
    .join('');

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}">
      <defs>
        <linearGradient id="race-sim-paper" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#fffdf7"></stop>
          <stop offset="100%" stop-color="#f8f1df"></stop>
        </linearGradient>
        <linearGradient id="race-sim-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#fbbf24"></stop>
          <stop offset="100%" stop-color="#f59e0b"></stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#race-sim-paper)"></rect>
      ${gridLines}
      <line x1="${paddingX}" y1="${baselineY}" x2="${width - paddingX}" y2="${baselineY}" class="race-sim-axis"></line>
      <line x1="${paddingX}" y1="${paddingTop}" x2="${paddingX}" y2="${baselineY}" class="race-sim-axis"></line>
      <path d="${areaPath}" fill="url(#race-sim-area)"></path>
      <path d="${linePath}" class="race-sim-profile-line"></path>
      ${markerEvents}
      ${clusters}
      <text x="${paddingX}" y="${(paddingTop - 16).toFixed(1)}" class="race-sim-scale race-sim-scale-title">Profil</text>
      <text x="${(paddingX + 52).toFixed(1)}" y="${(paddingTop - 16).toFixed(1)}" class="race-sim-scale">0-${formatElevationLabel(axisMaxElevation)}</text>
      <text x="${width - paddingX}" y="${height - 8}" class="race-sim-scale" text-anchor="end">${formatKm(snapshot.stageDistanceMeters)}</text>
    </svg>`;
}