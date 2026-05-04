import type { ParsedStageSummary, RealtimeSimulationBootstrap, Rider, StageMarkerCategory, StageMarkerType, StageProfilePoint } from '../../../shared/types';
import type { RiderCluster, RealtimeRiderSnapshot, SimulationSnapshot } from './SimulationEngine';
import { renderFlag } from './flags';

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

function formatMeters(meters: number): string {
  return `${Math.round(meters)} m`;
}

interface ProfileEvent {
  x: number;
  anchorY: number;
  primaryLabel: string;
  secondaryLabel: string | null;
  distanceLabel: string;
  accentColor: string;
}

interface NamedCluster {
  label: string;
  riderCount: number;
}

interface TimingRailEntry {
  rider: RealtimeRiderSnapshot;
  sourceRider: Rider | null;
  teamAbbreviation: string | null;
}

export type TimingRailMode = 'finish' | 'splits';

const DISPLAY_CLUSTER_MIN_GAP_METERS = 200;

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

function buildProfileEvents(summary: ParsedStageSummary, stageDistanceMeters: number, width: number, paddingX: number, height: number, paddingTop: number, paddingBottom: number, axisMaxElevation: number): ProfileEvent[] {
  const rawEvents: ProfileEvent[] = [];
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
          distanceLabel: `${point.kmMark.toFixed(1).replace('.', ',')} km`,
          accentColor: accent.accentColor,
        });
        continue;
      }

      if (marker.type === 'sprint_intermediate') {
        const accent = resolveMarkerAccent(marker.cat, marker.type);
        rawEvents.push({
          x: scaleDistance(point.kmMark * 1000, stageDistanceMeters, width, paddingX),
          anchorY: scaleElevation(point.elevation, axisMaxElevation, height, paddingTop, paddingBottom),
          primaryLabel: marker.name ?? 'Zwischensprint',
          secondaryLabel: formatElevationLabel(point.elevation),
          distanceLabel: `${point.kmMark.toFixed(1).replace('.', ',')} km`,
          accentColor: accent.accentColor,
        });
      }
    }
  }

  const finishPoint = summary.points[summary.points.length - 1];
  rawEvents.push({
    x: scaleDistance(finishPoint.kmMark * 1000, stageDistanceMeters, width, paddingX),
    anchorY: scaleElevation(finishPoint.elevation, axisMaxElevation, height, paddingTop, paddingBottom),
    primaryLabel: 'Ziel',
    secondaryLabel: formatElevationLabel(finishPoint.elevation),
    distanceLabel: `${finishPoint.kmMark.toFixed(1).replace('.', ',')} km`,
    accentColor: '#b91c1c',
  });

  return rawEvents.sort((left, right) => left.x - right.x);
}

function renderProfileEvent(event: ProfileEvent, topGuideY: number, baselineY: number): string {
  const topTextY = topGuideY + 4;
  const bottomGuideY = baselineY + 6;
  const bottomTextY = baselineY + 38;
  const combinedLabel = event.secondaryLabel ? `${event.primaryLabel} · ${event.secondaryLabel}` : event.primaryLabel;

  return `
    <g class="race-sim-marker-group">
      <line x1="${event.x.toFixed(1)}" y1="${topGuideY.toFixed(1)}" x2="${event.x.toFixed(1)}" y2="${(event.anchorY - 10).toFixed(1)}" stroke="${event.accentColor}" stroke-width="1.4" opacity="0.75"></line>
      <line x1="${event.x.toFixed(1)}" y1="${(event.anchorY + 8).toFixed(1)}" x2="${event.x.toFixed(1)}" y2="${(baselineY + 26).toFixed(1)}" stroke="${event.accentColor}" stroke-width="1.2" opacity="0.55"></line>
      <circle cx="${event.x.toFixed(1)}" cy="${event.anchorY.toFixed(1)}" r="3.2" fill="${event.accentColor}" opacity="0.9"></circle>
      <text x="${event.x.toFixed(1)}" y="${topTextY.toFixed(1)}" text-anchor="end" transform="rotate(-90 ${event.x.toFixed(1)} ${topTextY.toFixed(1)})" class="race-sim-marker-title" fill="${event.accentColor}">${esc(combinedLabel)}</text>
      <text x="${event.x.toFixed(1)}" y="${bottomTextY.toFixed(1)}" text-anchor="start" transform="rotate(-90 ${event.x.toFixed(1)} ${bottomTextY.toFixed(1)})" class="race-sim-marker-detail">${esc(event.distanceLabel)}</text>
    </g>`;
}

function buildDistanceTicks(summary: ParsedStageSummary, stageDistanceMeters: number): number[] {
  const tickMeters = new Set<number>();
  const totalKm = stageDistanceMeters / 1000;

  for (let km = 0; km <= totalKm; km += 25) {
    tickMeters.add(Math.round(km * 1000));
  }
  tickMeters.add(Math.round(stageDistanceMeters));

  return [...tickMeters]
    .filter((meter) => meter >= 0 && meter <= stageDistanceMeters)
    .sort((left, right) => left - right);
}

function renderDistanceTicks(tickMeters: number[], summary: ParsedStageSummary, stageDistanceMeters: number, width: number, paddingX: number, baselineY: number): string {
  return tickMeters.map((distanceMeter) => {
    const x = scaleDistance(distanceMeter, stageDistanceMeters, width, paddingX);
    const hasMarker = summary.points.some((point) => Math.round(point.kmMark * 1000) === distanceMeter && (point.markers?.length ?? 0) > 0);
    const tickLength = hasMarker ? 18 : 12;
    const labelY = baselineY + tickLength + 26;
    return `
      <g class="race-sim-distance-tick">
        <line x1="${x.toFixed(1)}" y1="${baselineY.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(baselineY + tickLength).toFixed(1)}" class="race-sim-axis"></line>
        <text x="${x.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" class="race-sim-grid-label">${esc(formatKm(distanceMeter))}</text>
      </g>`;
  }).join('');
}

function renderCluster(cluster: RiderCluster, summary: ParsedStageSummary, stageDistanceMeters: number, width: number, height: number, paddingX: number, paddingTop: number, paddingBottom: number, axisMaxElevation: number): string {
  const x = scaleDistance(cluster.distanceMeter, stageDistanceMeters, width, paddingX);
  const elevation = interpolateElevation(summary, cluster.distanceMeter);
  const y = scaleElevation(elevation, axisMaxElevation, height, paddingTop, paddingBottom);
  const radius = cluster.riderCount === 1 ? 2.2 : Math.min(6.6, 3.4 + cluster.riderCount * 0.28);
  const badge = cluster.riderCount > 1
    ? `<text x="${x.toFixed(1)}" y="${(y + 2.6).toFixed(1)}" class="race-sim-cluster-label">${cluster.riderCount}</text>`
    : '';

  return `
    <g class="race-sim-cluster-group">
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius.toFixed(1)}" class="race-sim-cluster-dot${cluster.riderCount > 1 ? ' race-sim-cluster-dot-group' : ''}"></circle>
      ${badge}
    </g>`;
}

function mergeDisplayedClusters(clusters: RiderCluster[]): RiderCluster[] {
  if (clusters.length === 0) {
    return [];
  }

  const merged: Array<RiderCluster & { distanceSum: number }> = [];

  for (const cluster of clusters) {
    const current = merged[merged.length - 1];
    if (!current || Math.abs(current.distanceMeter - cluster.distanceMeter) >= DISPLAY_CLUSTER_MIN_GAP_METERS) {
      merged.push({
        riderIds: [...cluster.riderIds],
        riderCount: cluster.riderCount,
        distanceMeter: cluster.distanceMeter,
        distanceSum: cluster.distanceMeter * cluster.riderCount,
      });
      continue;
    }

    current.riderIds.push(...cluster.riderIds);
    current.riderCount += cluster.riderCount;
    current.distanceSum += cluster.distanceMeter * cluster.riderCount;
    current.distanceMeter = current.distanceSum / current.riderCount;
  }

  return merged.map(({ distanceSum: _distanceSum, ...cluster }) => cluster);
}

function buildNamedClusters(clusters: RiderCluster[]): NamedCluster[] {
  if (clusters.length === 0) {
    return [];
  }

  let pelotonIndex = 0;
  for (let index = 1; index < clusters.length; index += 1) {
    if (clusters[index].riderCount > clusters[pelotonIndex].riderCount) {
      pelotonIndex = index;
    }
  }

  let escapeCounter = 0;
  let chaseCounter = 0;

  return clusters.map((cluster, index) => {
    if (index === pelotonIndex) {
      return { label: 'P', riderCount: cluster.riderCount };
    }

    if (index < pelotonIndex) {
      escapeCounter += 1;
      return { label: `E${escapeCounter}`, riderCount: cluster.riderCount };
    }

    chaseCounter += 1;
    return { label: `A${chaseCounter}`, riderCount: cluster.riderCount };
  });
}

function renderClusterRail(clusters: RiderCluster[]): string {
  const namedClusters = buildNamedClusters(clusters);
  if (namedClusters.length === 0) {
    return '<div class="race-sim-cluster-rail-empty">Keine Gruppen</div>';
  }

  return `
    <div class="race-sim-cluster-rail-list">
      ${namedClusters.map((entry, index) => {
        const gapText = index === 0
          ? 'Lead'
          : `+${formatMeters(Math.max(0, clusters[index - 1].distanceMeter - clusters[index].distanceMeter))}`;
        const isPeloton = entry.label === 'P';
        return `
          <div class="race-sim-cluster-rail-row">
            <div class="race-sim-cluster-rail-gap">${esc(gapText)}</div>
            <div class="race-sim-cluster-rail-main">
              <span class="race-sim-cluster-pill${isPeloton ? ' race-sim-cluster-pill-peloton' : ''}">${esc(entry.label)}</span>
              <span class="race-sim-cluster-rail-size">${isPeloton ? `Peloton · ${entry.riderCount} Fahrer` : `${entry.riderCount} Fahrer`}</span>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

function formatClock(seconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function renderTimingRail(snapshot: SimulationSnapshot, bootstrap: RealtimeSimulationBootstrap, mode: TimingRailMode): string {
  const riderById = new Map(bootstrap.riders.map((rider) => [rider.id, rider]));
  const teamAbbreviationById = new Map((bootstrap.teams ?? []).map((team) => [team.id, team.abbreviation]));
  const finished = snapshot.riders.filter((rider) => rider.finishTimeSeconds != null);
  const finishedEntries: TimingRailEntry[] = [...finished]
    .sort((left, right) => (left.finishTimeSeconds ?? 0) - (right.finishTimeSeconds ?? 0) || left.riderId - right.riderId)
    .map((rider) => {
      const sourceRider = riderById.get(rider.riderId) ?? null;
      const teamAbbreviation = sourceRider?.activeTeamId != null
        ? teamAbbreviationById.get(sourceRider.activeTeamId) ?? null
        : null;
      return { rider, sourceRider, teamAbbreviation };
    });
  const splitEntries: TimingRailEntry[] = snapshot.riders
    .filter((rider) => rider.lastSplitTimeSeconds != null && rider.lastSplitLabel != null)
    .sort((left, right) => (left.lastSplitTimeSeconds ?? 0) - (right.lastSplitTimeSeconds ?? 0) || left.riderId - right.riderId)
    .map((rider) => {
      const sourceRider = riderById.get(rider.riderId) ?? null;
      const teamAbbreviation = sourceRider?.activeTeamId != null
        ? teamAbbreviationById.get(sourceRider.activeTeamId) ?? null
        : null;
      return { rider, sourceRider, teamAbbreviation };
    });

  const rankingEntries = mode === 'splits' ? splitEntries : finishedEntries;
  if (rankingEntries.length === 0) {
    return `<div class="race-sim-cluster-rail-empty">${mode === 'splits' ? 'Noch keine Zwischenzeiten' : 'Noch keine Fahrer im Ziel'}</div>`;
  }

  const latestFive = mode === 'splits'
    ? [...rankingEntries].sort((left, right) => (right.rider.lastSplitTimeSeconds ?? 0) - (left.rider.lastSplitTimeSeconds ?? 0)).slice(0, 5)
    : [...rankingEntries].sort((left, right) => (right.rider.finishTimeSeconds ?? 0) - (left.rider.finishTimeSeconds ?? 0)).slice(0, 5);
  const latestIds = new Set(latestFive.map((entry) => entry.rider.riderId));
  const latestTitle = mode === 'splits' ? 'Zuletzt an Zeitnahme' : 'Zuletzt über Linie';
  const rankingTitle = mode === 'splits' ? 'Zwischenzeiten' : 'Im Ziel';

  const formatTimingValue = (entry: TimingRailEntry): string => mode === 'splits'
    ? `${entry.rider.lastSplitLabel ?? 'Split'} · ${formatClock(entry.rider.lastSplitTimeSeconds ?? 0)}`
    : formatClock(entry.rider.riderClockSeconds ?? entry.rider.finishTimeSeconds ?? 0);

  const renderTimingIdentity = (entry: TimingRailEntry): string => {
    const flag = entry.sourceRider ? renderFlag(entry.sourceRider.country?.code3 ?? entry.sourceRider.nationality) : '';
    const teamSuffix = entry.teamAbbreviation ? `<span class="race-sim-timing-team">${esc(entry.teamAbbreviation)}</span>` : '';
    return `<span class="race-sim-timing-rider">${flag}<span class="race-sim-timing-name">${esc(entry.rider.riderName)}</span>${teamSuffix}</span>`;
  };

  return `
    <div class="race-sim-timing-panel">
      <div class="race-sim-timing-toggle">
        <button type="button" class="race-sim-timing-toggle-btn${mode === 'finish' ? ' active' : ''}" data-race-sim-timing-mode="finish">Ziel</button>
        <button type="button" class="race-sim-timing-toggle-btn${mode === 'splits' ? ' active' : ''}" data-race-sim-timing-mode="splits">Split</button>
      </div>
      <div>
        <div class="race-sim-cluster-rail-title">${latestTitle}</div>
        <div class="race-sim-timing-latest-list">
          ${latestFive.map((entry) => {
            const rank = rankingEntries.findIndex((candidate) => candidate.rider.riderId === entry.rider.riderId) + 1;
            return `
              <div class="race-sim-cluster-rail-row race-sim-timing-latest-row race-sim-timing-highlight">
                <div class="race-sim-cluster-rail-gap">#${rank}</div>
                <div class="race-sim-cluster-rail-main">
                  ${renderTimingIdentity(entry)}
                  <span class="race-sim-timing-time">${esc(formatTimingValue(entry))}</span>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>
      <div class="race-sim-timing-ranking-wrap">
        <div class="race-sim-cluster-rail-title">${rankingTitle}</div>
        <div class="race-sim-cluster-rail-list">
          ${rankingEntries.map((entry, index) => {
            return `
              <div class="race-sim-cluster-rail-row${latestIds.has(entry.rider.riderId) ? ' race-sim-timing-highlight' : ''}">
                <div class="race-sim-cluster-rail-gap">${index + 1}.</div>
                <div class="race-sim-cluster-rail-main">
                  ${renderTimingIdentity(entry)}
                  <span class="race-sim-timing-time">${esc(formatTimingValue(entry))}</span>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>
    </div>`;
}

function renderIttRiderLabels(clusters: RiderCluster[], summary: ParsedStageSummary, stageDistanceMeters: number, width: number, height: number, paddingX: number, paddingTop: number, paddingBottom: number, axisMaxElevation: number, bootstrap: RealtimeSimulationBootstrap): string {
  const riderById = new Map(bootstrap.riders.map((rider) => [rider.id, rider]));
  const teamAbbreviationById = new Map((bootstrap.teams ?? []).map((team) => [team.id, team.abbreviation]));

  return clusters
    .filter((cluster) => cluster.riderCount === 1)
    .map((cluster) => {
      const riderId = cluster.riderIds[0];
      if (riderId == null) return '';
      const rider = riderById.get(riderId);
      if (!rider) return '';
      const x = scaleDistance(cluster.distanceMeter, stageDistanceMeters, width, paddingX);
      const elevation = interpolateElevation(summary, cluster.distanceMeter);
      const y = scaleElevation(elevation, axisMaxElevation, height, paddingTop, paddingBottom);
      const teamAbbreviation = rider.activeTeamId != null ? teamAbbreviationById.get(rider.activeTeamId) ?? '' : '';
      const label = `${rider.lastName} (${teamAbbreviation})`;
      const lineTopY = y - 34;
      const textY = y - 40;
      return `
        <g class="race-sim-itt-rider-label-group">
          <line x1="${x.toFixed(1)}" y1="${(y - 5).toFixed(1)}" x2="${x.toFixed(1)}" y2="${lineTopY.toFixed(1)}" stroke="rgba(31, 41, 55, .55)" stroke-width="1"></line>
          <text x="${x.toFixed(1)}" y="${textY.toFixed(1)}" text-anchor="middle" class="race-sim-marker-detail">${esc(label)}</text>
        </g>`;
    })
    .join('');
}

export function renderRaceProfile(container: HTMLElement, summary: ParsedStageSummary, snapshot: SimulationSnapshot, label: string, bootstrap: RealtimeSimulationBootstrap, timingMode: TimingRailMode = 'finish'): void {
  if (summary.points.length < 2) {
    container.innerHTML = '<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';
    return;
  }

  const width = 1320;
  const height = 440;
  const paddingX = 28;
  const paddingTop = 74;
  const paddingBottom = 84;
  const maxElevation = Math.max(...summary.points.map((point) => point.elevation));
  const axisScaleFactor = maxElevation >= 500 ? 1.1 : 1.5;
  const axisMaxElevation = Math.max(500, Math.ceil((maxElevation * axisScaleFactor) / 50) * 50);
  const baselineY = height - paddingBottom;
  const markerGuideTopY = 12;
  const tickValues = Array.from({ length: 5 }, (_value, index) => (axisMaxElevation / 4) * index);
  const distanceTicks = buildDistanceTicks(summary, snapshot.stageDistanceMeters);
  const points = summary.points.map((point) => {
    const x = scaleDistance(point.kmMark * 1000, snapshot.stageDistanceMeters, width, paddingX);
    const y = scaleElevation(point.elevation, axisMaxElevation, height, paddingTop, paddingBottom);
    return { x, y, point };
  });
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${(width - paddingX).toFixed(1)} ${baselineY.toFixed(1)} L ${paddingX.toFixed(1)} ${baselineY.toFixed(1)} Z`;
  const markerEvents = buildProfileEvents(summary, snapshot.stageDistanceMeters, width, paddingX, height, paddingTop, paddingBottom, axisMaxElevation)
    .map((event) => renderProfileEvent(event, markerGuideTopY, baselineY))
    .join('');
  const displayClusters = mergeDisplayedClusters(snapshot.clusters);
  const gridLines = tickValues.map((value) => {
    const y = scaleElevation(value, axisMaxElevation, height, paddingTop, paddingBottom);
    return `
      <line x1="${paddingX}" y1="${y.toFixed(1)}" x2="${width - paddingX}" y2="${y.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="${paddingX}" y1="${y.toFixed(1)}" x2="${(paddingX - 8).toFixed(1)}" y2="${y.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${(paddingX - 14).toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label">${formatElevationLabel(value)}</text>`;
  }).join('');
  const distanceTickMarkup = renderDistanceTicks(distanceTicks, summary, snapshot.stageDistanceMeters, width, paddingX, baselineY);
  const clusters = displayClusters
    .map((cluster) => renderCluster(cluster, summary, snapshot.stageDistanceMeters, width, height, paddingX, paddingTop, paddingBottom, axisMaxElevation))
    .join('');
  const ittRiderLabels = bootstrap.stage.profile === 'ITT'
    ? renderIttRiderLabels(displayClusters, summary, snapshot.stageDistanceMeters, width, height, paddingX, paddingTop, paddingBottom, axisMaxElevation, bootstrap)
    : '';
  const clusterRail = bootstrap.stage.profile === 'ITT'
    ? renderTimingRail(snapshot, bootstrap, timingMode)
    : renderClusterRail(displayClusters);

  container.innerHTML = `
    <div class="race-sim-profile-layout${bootstrap.stage.profile === 'ITT' ? ' race-sim-profile-layout-itt' : ''}">
      <div class="race-sim-profile-canvas-wrap">
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
          ${ittRiderLabels}
          ${distanceTickMarkup}
          <text x="${paddingX.toFixed(1)}" y="${(paddingTop - 20).toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>
        </svg>
      </div>
      <aside class="race-sim-cluster-rail${bootstrap.stage.profile === 'ITT' ? ' race-sim-cluster-rail-itt' : ''}" aria-label="${bootstrap.stage.profile === 'ITT' ? 'Timing-Reihenfolge' : 'Gruppenübersicht'}">
        <div class="race-sim-cluster-rail-title">${bootstrap.stage.profile === 'ITT' ? 'Timing' : 'Gruppen'}</div>
        ${clusterRail}
      </aside>
    </div>`;
}