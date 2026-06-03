import type { ParsedStageSummary, RealtimeSimulationBootstrap, Rider, StageMarkerCategory, StageMarkerType, StageProfile } from '../../../shared/types';
import type { RiderCluster, RealtimeRiderSnapshot, SimulationSnapshot } from './SimulationEngine';
import { renderFlag } from './flags';
import { buildNamedRaceGroups, mergeDisplayedClusters } from './groupClusters';
import { buildIntermediateSplitLabels, collectStageBoundaryMarkers, isMountainClassificationMarker } from './stageSummary';

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
  primaryLabel: string;
  secondaryLabel: string | null;
  distanceLabel: string;
  accentColor: string;
}

interface TimingRailEntry {
  rider: RealtimeRiderSnapshot;
  sourceRider: Rider | null;
  teamAbbreviation: string | null;
}

interface StaticStageProfileOptions {
  selectedClimbRange?: {
    startKm: number;
    endKm: number;
  };
}

export type TimingRailMode = 'finish' | `split:${string}`;

function encodeSplitModeValue(label: string): TimingRailMode {
  return `split:${encodeURIComponent(label)}`;
}

function isSplitMode(mode: TimingRailMode): mode is `split:${string}` {
  return mode.startsWith('split:');
}

function splitModeLabel(mode: TimingRailMode): string | null {
  return isSplitMode(mode) ? decodeURIComponent(mode.slice('split:'.length)) : null;
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

function resolveElevationAxis(summary: ParsedStageSummary): { axisMinElevation: number; axisMaxElevation: number } {
  const elevations = summary.points.map((point) => point.elevation);
  const minElevation = Math.min(...elevations);
  const maxElevation = Math.max(...elevations);
  const elevationRange = Math.max(1, maxElevation - minElevation);
  const axisPadding = Math.max(40, elevationRange * 0.08);
  const rawAxisMin = Math.max(0, minElevation - axisPadding);
  const rawAxisMax = maxElevation + axisPadding;
  let axisMinElevation = Math.floor(rawAxisMin / 50) * 50;
  let axisMaxElevation = Math.ceil(rawAxisMax / 50) * 50;

  if (axisMaxElevation <= axisMinElevation) {
    axisMaxElevation = axisMinElevation + 100;
  }

  return { axisMinElevation, axisMaxElevation };
}

function scaleElevation(elevation: number, axisMinElevation: number, axisMaxElevation: number, height: number, paddingTop: number, paddingBottom: number): number {
  const elevationRange = Math.max(1, axisMaxElevation - axisMinElevation);
  return height - paddingBottom - ((elevation - axisMinElevation) / elevationRange) * (height - paddingTop - paddingBottom);
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

function formatProfileCategory(category: StageMarkerCategory | null): string | null {
  if (!category || category === 'Sprint') {
    return null;
  }
  return `Kat. ${category}`;
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

function buildProfileEvents(summary: ParsedStageSummary, stageDistanceMeters: number, width: number, paddingX: number, height: number, paddingTop: number, paddingBottom: number, axisMinElevation: number, axisMaxElevation: number): ProfileEvent[] {
  const rawEvents: ProfileEvent[] = [];
  const pendingClimbs: Array<{ kmMark: number; elevation: number; name: string | null }> = [];
  let finishCategory: StageMarkerCategory | null = null;
  let finishAccentColor = '#b91c1c';

  for (const boundaryMarker of collectStageBoundaryMarkers(summary)) {
    const { marker, kmMark, elevation } = boundaryMarker;
    if (marker.type === 'climb_start') {
      pendingClimbs.push({
        kmMark,
        elevation,
        name: marker.name,
      });
      continue;
    }

    if (isMountainClassificationMarker(marker)) {
      let matchingIndex = -1;
      for (let index = pendingClimbs.length - 1; index >= 0; index -= 1) {
        if (marker.name && pendingClimbs[index]?.name === marker.name) {
          matchingIndex = index;
          break;
        }
      }
      const climbStart = matchingIndex >= 0
        ? pendingClimbs.splice(matchingIndex, 1)[0]
        : pendingClimbs.pop();
      const lengthKm = climbStart ? Math.max(0, kmMark - climbStart.kmMark) : 0;
      const gainMeters = climbStart ? Math.max(0, elevation - climbStart.elevation) : 0;
      const avgGradient = lengthKm > 0 ? gainMeters / (lengthKm * 10) : 0;
      const accent = resolveMarkerAccent(marker.cat, marker.type);
      const categoryLabel = formatProfileCategory(marker.cat);
      if (marker.type === 'finish_hill' || marker.type === 'finish_mountain') {
        finishCategory = marker.cat ?? null;
        finishAccentColor = accent.accentColor;
        continue;
      }
      rawEvents.push({
        x: scaleDistance(kmMark * 1000, stageDistanceMeters, width, paddingX),
        anchorY: scaleElevation(elevation, axisMinElevation, axisMaxElevation, height, paddingTop, paddingBottom),
        primaryLabel: categoryLabel ?? 'Berg',
        secondaryLabel: formatElevationLabel(elevation),
        distanceLabel: `${kmMark.toFixed(1).replace('.', ',')} km`,
        accentColor: accent.accentColor,
      });
      continue;
    }

    if (marker.type === 'sprint_intermediate') {
      const accent = resolveMarkerAccent(marker.cat, marker.type);
      rawEvents.push({
        x: scaleDistance(kmMark * 1000, stageDistanceMeters, width, paddingX),
        anchorY: scaleElevation(elevation, axisMinElevation, axisMaxElevation, height, paddingTop, paddingBottom),
        primaryLabel: 'Sprint',
        secondaryLabel: formatElevationLabel(elevation),
        distanceLabel: `${kmMark.toFixed(1).replace('.', ',')} km`,
        accentColor: accent.accentColor,
      });
    }
  }

  const finishPoint = summary.points[summary.points.length - 1];
  rawEvents.push({
    x: scaleDistance(finishPoint.kmMark * 1000, stageDistanceMeters, width, paddingX),
    anchorY: scaleElevation(finishPoint.elevation, axisMinElevation, axisMaxElevation, height, paddingTop, paddingBottom),
    primaryLabel: finishCategory ? `${formatProfileCategory(finishCategory) ?? 'Ziel'} · Ziel` : 'Ziel',
    secondaryLabel: formatElevationLabel(finishPoint.elevation),
    distanceLabel: `${finishPoint.kmMark.toFixed(1).replace('.', ',')} km`,
    accentColor: finishAccentColor,
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

function renderCompactProfileEvent(event: ProfileEvent, topGuideY: number, baselineY: number): string {
  return `
    <g class="race-sim-marker-group">
      <line x1="${event.x.toFixed(1)}" y1="${topGuideY.toFixed(1)}" x2="${event.x.toFixed(1)}" y2="${(baselineY - 2).toFixed(1)}" stroke="${event.accentColor}" stroke-width="1.5" opacity="0.72"></line>
      <circle cx="${event.x.toFixed(1)}" cy="${event.anchorY.toFixed(1)}" r="2.6" fill="${event.accentColor}" opacity="0.95"></circle>
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
  const markerMeters = new Set(collectStageBoundaryMarkers(summary).map((entry) => Math.round(entry.kmMark * 1000)));
  return tickMeters.map((distanceMeter) => {
    const x = scaleDistance(distanceMeter, stageDistanceMeters, width, paddingX);
    const hasMarker = markerMeters.has(distanceMeter);
    const tickLength = hasMarker ? 18 : 12;
    const labelY = baselineY + tickLength + 26;
    return `
      <g class="race-sim-distance-tick">
        <line x1="${x.toFixed(1)}" y1="${baselineY.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(baselineY + tickLength).toFixed(1)}" class="race-sim-axis"></line>
        <text x="${x.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" class="race-sim-grid-label">${esc(formatKm(distanceMeter))}</text>
      </g>`;
  }).join('');
}

function renderCluster(cluster: RiderCluster, summary: ParsedStageSummary, stageDistanceMeters: number, width: number, height: number, paddingX: number, paddingTop: number, paddingBottom: number, axisMinElevation: number, axisMaxElevation: number, isSelected: boolean): string {
  const x = scaleDistance(cluster.distanceMeter, stageDistanceMeters, width, paddingX);
  const elevation = interpolateElevation(summary, cluster.distanceMeter);
  const y = scaleElevation(elevation, axisMinElevation, axisMaxElevation, height, paddingTop, paddingBottom);
  const radius = cluster.riderCount === 1 ? 2.2 : Math.min(6.6, 3.4 + cluster.riderCount * 0.28);
  const badge = cluster.riderCount > 1
    ? `<text x="${x.toFixed(1)}" y="${(y + 2.6).toFixed(1)}" class="race-sim-cluster-label">${cluster.riderCount}</text>`
    : '';

  return `
    <g class="race-sim-cluster-group">
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius.toFixed(1)}" class="race-sim-cluster-dot${cluster.riderCount > 1 ? ' race-sim-cluster-dot-group' : ''}${isSelected ? ' race-sim-cluster-dot-selected' : ''}"></circle>
      ${badge}
    </g>`;
}

function formatClock(seconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function formatTimingClock(seconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  if (totalSeconds < 3600) {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function formatFinishGap(seconds: number): string {
  return `+${Math.max(0, Math.round(seconds))}s`;
}

function buildSplitLabels(summary: ParsedStageSummary): string[] {
  return buildIntermediateSplitLabels(summary);
}

function buildTimingEntries(snapshot: SimulationSnapshot, bootstrap: RealtimeSimulationBootstrap): { finishedEntries: TimingRailEntry[]; splitEntries: TimingRailEntry[] } {
  const riderById = new Map(bootstrap.riders.map((rider) => [rider.id, rider]));
  const teamAbbreviationById = new Map((bootstrap.teams ?? []).map((team) => [team.id, team.abbreviation]));
  const mapEntry = (rider: RealtimeRiderSnapshot): TimingRailEntry => {
    const sourceRider = riderById.get(rider.riderId) ?? null;
    const teamAbbreviation = sourceRider?.activeTeamId != null
      ? teamAbbreviationById.get(sourceRider.activeTeamId) ?? null
      : null;
    return { rider, sourceRider, teamAbbreviation };
  };

  const finishedEntries = snapshot.riders
    .filter((rider) => rider.finishTimeSeconds != null)
    .sort((left, right) => (left.finishTimeSeconds ?? 0) - (right.finishTimeSeconds ?? 0) || right.photoFinishScore - left.photoFinishScore || left.riderId - right.riderId)
    .map(mapEntry);

  const splitEntries = snapshot.riders
    .filter((rider) => rider.lastSplitTimeSeconds != null && rider.lastSplitLabel != null)
    .sort((left, right) => (left.lastSplitTimeSeconds ?? 0) - (right.lastSplitTimeSeconds ?? 0) || left.riderId - right.riderId)
    .map(mapEntry);

  return { finishedEntries, splitEntries };
}

function findMarkerClassification(snapshot: SimulationSnapshot, label: string) {
  return snapshot.markerClassifications.find((classification) => classification.markerLabel === label) ?? null;
}

function renderFinishRail(snapshot: SimulationSnapshot, bootstrap: RealtimeSimulationBootstrap): string {
  const { finishedEntries } = buildTimingEntries(snapshot, bootstrap);
  if (finishedEntries.length === 0) {
    return '<div class="race-sim-cluster-rail-empty">Noch keine Fahrer im Ziel</div>';
  }

  const leaderTime = finishedEntries[0]?.rider.finishTimeSeconds ?? 0;

  return `
    <div class="race-sim-cluster-rail-list">
      ${finishedEntries.map((entry, index) => {
        const flag = entry.sourceRider ? renderFlag(entry.sourceRider.country?.code3 ?? entry.sourceRider.nationality) : '';
        const riderName = entry.sourceRider?.lastName ?? entry.rider.riderName;
        const teamTag = entry.teamAbbreviation ? `<span class="race-sim-timing-team">${esc(entry.teamAbbreviation)}</span>` : '';
        const timeValue = index === 0
          ? formatClock(entry.rider.finishTimeSeconds ?? 0)
          : formatFinishGap((entry.rider.finishTimeSeconds ?? leaderTime) - leaderTime);
        return `
          <div class="race-sim-cluster-rail-row${index < 3 ? ' race-sim-timing-highlight' : ''}">
            <div class="race-sim-cluster-rail-gap">${index + 1}.</div>
            <div class="race-sim-cluster-rail-main">
              <span class="race-sim-timing-rider">${flag}<span class="race-sim-timing-name">${esc(riderName)}</span>${teamTag}</span>
              <span class="race-sim-timing-time">${esc(timeValue)}</span>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

function renderTimingRail(summary: ParsedStageSummary, snapshot: SimulationSnapshot, bootstrap: RealtimeSimulationBootstrap, mode: TimingRailMode): string {
  const { finishedEntries, splitEntries } = buildTimingEntries(snapshot, bootstrap);
  const splitLabels = buildSplitLabels(summary);
  const activeSplitLabel = splitModeLabel(mode);
  const activeClassification = activeSplitLabel ? findMarkerClassification(snapshot, activeSplitLabel) : null;
  const rankingEntries = activeSplitLabel
    ? (activeClassification?.entries ?? [])
        .map((classificationEntry) => splitEntries.find((entry) => entry.rider.riderId === classificationEntry.riderId) ?? null)
        .filter((entry): entry is TimingRailEntry => entry != null)
    : finishedEntries;
  if (rankingEntries.length === 0) {
    return `<div class="race-sim-cluster-rail-empty">${activeSplitLabel ? 'Noch keine Zwischenzeiten an dieser Messung' : 'Noch keine Fahrer im Ziel'}</div>`;
  }

  const latestFive = activeSplitLabel
    ? [...rankingEntries].sort((left, right) => (right.rider.splitTimes[activeSplitLabel] ?? 0) - (left.rider.splitTimes[activeSplitLabel] ?? 0) || right.rider.photoFinishScore - left.rider.photoFinishScore || left.rider.riderId - right.rider.riderId).slice(0, 5)
    : [...rankingEntries].sort((left, right) => (right.rider.finishTimeSeconds ?? 0) - (left.rider.finishTimeSeconds ?? 0)).slice(0, 5);
  const latestIds = new Set(latestFive.map((entry) => entry.rider.riderId));
  const latestTitle = activeSplitLabel ? `Zuletzt bei ${esc(activeSplitLabel)}` : 'Zuletzt im Ziel';
  const rankingTitle = activeSplitLabel ? `${esc(activeSplitLabel)} · Bestzeiten` : 'Im Ziel';

  const formatTimingValue = (entry: TimingRailEntry): string => activeSplitLabel
    ? formatTimingClock(entry.rider.splitTimes[activeSplitLabel] ?? 0)
    : formatTimingClock(entry.rider.riderClockSeconds ?? entry.rider.finishTimeSeconds ?? 0);

  const renderTimingIdentity = (entry: TimingRailEntry): string => {
    const flag = entry.sourceRider ? renderFlag(entry.sourceRider.country?.code3 ?? entry.sourceRider.nationality) : '';
    const teamSuffix = entry.teamAbbreviation ? `<span class="race-sim-timing-team">${esc(entry.teamAbbreviation)}</span>` : '';
    const riderName = entry.sourceRider?.lastName ?? entry.rider.riderName;
    return `<span class="race-sim-timing-rider">${flag}<span class="race-sim-timing-name">${esc(riderName)}</span>${teamSuffix}</span>`;
  };

  return `
    <div class="race-sim-timing-panel">
      <div class="race-sim-timing-toggle">
        <button type="button" class="race-sim-timing-toggle-btn${mode === 'finish' ? ' active' : ''}" data-race-sim-timing-mode="finish">Ziel</button>
        ${splitLabels.map((label) => `<button type="button" class="race-sim-timing-toggle-btn${activeSplitLabel === label ? ' active' : ''}" data-race-sim-timing-mode="${encodeSplitModeValue(label)}">${esc(label)}</button>`).join('')}
      </div>
      <div class="race-sim-timing-scroll">
        <div>
          <div class="race-sim-cluster-rail-title">${latestTitle}</div>
          <div class="race-sim-timing-latest-list">
            ${latestFive.map((entry) => {
              const rank = rankingEntries.findIndex((candidate) => candidate.rider.riderId === entry.rider.riderId) + 1;
              return `
                <div class="race-sim-cluster-rail-row race-sim-timing-latest-row race-sim-timing-highlight">
                  <div class="race-sim-cluster-rail-gap">(${rank}.)</div>
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
                  <div class="race-sim-cluster-rail-gap">(${index + 1}.)</div>
                  <div class="race-sim-cluster-rail-main">
                    ${renderTimingIdentity(entry)}
                    <span class="race-sim-timing-time">${esc(formatTimingValue(entry))}</span>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

function renderIttRiderLabels(clusters: RiderCluster[], summary: ParsedStageSummary, stageDistanceMeters: number, width: number, height: number, paddingX: number, paddingTop: number, paddingBottom: number, axisMinElevation: number, axisMaxElevation: number, bootstrap: RealtimeSimulationBootstrap): string {
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
      const y = scaleElevation(elevation, axisMinElevation, axisMaxElevation, height, paddingTop, paddingBottom);
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

function buildClimbHighlightAreaPath(
  summary: ParsedStageSummary,
  stageDistanceMeters: number,
  width: number,
  paddingX: number,
  height: number,
  paddingTop: number,
  paddingBottom: number,
  axisMinElevation: number,
  axisMaxElevation: number,
  startKm: number,
  endKm: number,
): string | null {
  const boundedStartKm = Math.max(0, Math.min(startKm, summary.distanceKm));
  const boundedEndKm = Math.max(0, Math.min(endKm, summary.distanceKm));
  if (boundedEndKm <= boundedStartKm) {
    return null;
  }

  const points = [
    {
      kmMark: boundedStartKm,
      elevation: interpolateElevation(summary, boundedStartKm * 1000),
    },
    ...summary.points.filter((point) => point.kmMark > boundedStartKm && point.kmMark < boundedEndKm),
    {
      kmMark: boundedEndKm,
      elevation: interpolateElevation(summary, boundedEndKm * 1000),
    },
  ];

  if (points.length < 2) {
    return null;
  }

  const baselineY = height - paddingBottom;
  const linePath = points
    .map((point, index) => {
      const x = scaleDistance(point.kmMark * 1000, stageDistanceMeters, width, paddingX);
      const y = scaleElevation(point.elevation, axisMinElevation, axisMaxElevation, height, paddingTop, paddingBottom);
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
  const startX = scaleDistance(boundedStartKm * 1000, stageDistanceMeters, width, paddingX);
  const endX = scaleDistance(boundedEndKm * 1000, stageDistanceMeters, width, paddingX);
  return `${linePath} L ${endX.toFixed(1)} ${baselineY.toFixed(1)} L ${startX.toFixed(1)} ${baselineY.toFixed(1)} Z`;
}

function buildStaticProfileMarkup(summary: ParsedStageSummary, stageProfile: StageProfile, label: string, compact: boolean, options: StaticStageProfileOptions = {}): string {
  const width = compact ? 312 : 1584;
  const height = compact ? 173 : 634;
  const paddingX = compact ? 12 : 28;
  const paddingTop = compact ? 36 : 168;
  const paddingBottom = compact ? 22 : 101;
  const stageDistanceMeters = summary.distanceKm * 1000;
  const { axisMinElevation, axisMaxElevation } = resolveElevationAxis(summary);
  const baselineY = height - paddingBottom;
  const markerGuideTopY = compact ? 10 : 12;
  const points = summary.points.map((point) => {
    const x = scaleDistance(point.kmMark * 1000, stageDistanceMeters, width, paddingX);
    const y = scaleElevation(point.elevation, axisMinElevation, axisMaxElevation, height, paddingTop, paddingBottom);
    return { x, y };
  });
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${(width - paddingX).toFixed(1)} ${baselineY.toFixed(1)} L ${paddingX.toFixed(1)} ${baselineY.toFixed(1)} Z`;
  const climbHighlightPath = options.selectedClimbRange != null
    ? buildClimbHighlightAreaPath(
      summary,
      stageDistanceMeters,
      width,
      paddingX,
      height,
      paddingTop,
      paddingBottom,
      axisMinElevation,
      axisMaxElevation,
      options.selectedClimbRange.startKm,
      options.selectedClimbRange.endKm,
    )
    : null;
  const markerEvents = buildProfileEvents(summary, stageDistanceMeters, width, paddingX, height, paddingTop, paddingBottom, axisMinElevation, axisMaxElevation)
    .map((event) => compact
      ? renderCompactProfileEvent(event, markerGuideTopY, baselineY)
      : renderProfileEvent(event, markerGuideTopY, baselineY))
    .join('');
  const tickValues = compact
    ? []
    : Array.from({ length: 5 }, (_value, index) => axisMinElevation + (((axisMaxElevation - axisMinElevation) / 4) * index));
  const gridLines = tickValues.map((value) => {
    const y = scaleElevation(value, axisMinElevation, axisMaxElevation, height, paddingTop, paddingBottom);
    return `
      <line x1="${paddingX}" y1="${y.toFixed(1)}" x2="${width - paddingX}" y2="${y.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="${paddingX}" y1="${y.toFixed(1)}" x2="${(paddingX - 8).toFixed(1)}" y2="${y.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${(paddingX - 14).toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${formatElevationLabel(value)}</text>`;
  }).join('');
  const distanceTickMarkup = compact
    ? ''
    : renderDistanceTicks(buildDistanceTicks(summary, stageDistanceMeters), summary, stageDistanceMeters, width, paddingX, baselineY);

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}" class="${compact ? 'dashboard-stage-profile-svg' : 'dashboard-stage-profile-svg dashboard-stage-profile-svg-large'}" data-stage-profile="${stageProfile}">
      <defs>
        <linearGradient id="${compact ? 'dashboard-mini-paper' : 'dashboard-large-paper'}" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#fffdf7"></stop>
          <stop offset="100%" stop-color="#f8f1df"></stop>
        </linearGradient>
        <linearGradient id="${compact ? 'dashboard-mini-area' : 'dashboard-large-area'}" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#fbbf24"></stop>
          <stop offset="100%" stop-color="#f59e0b"></stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#${compact ? 'dashboard-mini-paper' : 'dashboard-large-paper'})"></rect>
      ${gridLines}
      <line x1="${paddingX}" y1="${baselineY}" x2="${width - paddingX}" y2="${baselineY}" class="race-sim-axis"></line>
      ${compact ? '' : `<line x1="${paddingX}" y1="${paddingTop}" x2="${paddingX}" y2="${baselineY}" class="race-sim-axis"></line>`}
      <path d="${areaPath}" fill="url(#${compact ? 'dashboard-mini-area' : 'dashboard-large-area'})"></path>
      ${climbHighlightPath ? `<path d="${climbHighlightPath}" class="dashboard-stage-profile-climb-highlight"></path>` : ''}
      <path d="${linePath}" class="race-sim-profile-line"></path>
      ${markerEvents}
      ${distanceTickMarkup}
      ${compact ? '' : `<text x="${paddingX.toFixed(1)}" y="${(paddingTop - 20).toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>`}
    </svg>`;
}

export function renderStaticStageProfile(container: HTMLElement, summary: ParsedStageSummary, stageProfile: StageProfile, label: string, options?: StaticStageProfileOptions): void {
  if (summary.points.length < 2) {
    container.innerHTML = '<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';
    return;
  }

  container.innerHTML = `<div class="dashboard-stage-profile-wrap">${buildStaticProfileMarkup(summary, stageProfile, label, false, options)}</div>`;
}

export function renderMiniStageProfile(container: HTMLElement, summary: ParsedStageSummary, stageProfile: StageProfile, label: string): void {
  if (summary.points.length < 2) {
    container.innerHTML = '<div class="dashboard-stage-profile-empty">–</div>';
    return;
  }

  container.innerHTML = buildStaticProfileMarkup(summary, stageProfile, label, true);
}

export function renderRaceProfile(container: HTMLElement, summary: ParsedStageSummary, snapshot: SimulationSnapshot, label: string, bootstrap: RealtimeSimulationBootstrap, timingMode: TimingRailMode = 'finish', selectedGroupLabel: string | null = null): void {
  if (summary.points.length < 2) {
    container.innerHTML = '<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';
    return;
  }

  const width = 1584;
  const height = 634;
  const paddingX = 28;
  const paddingTop = 168;
  const paddingBottom = 101;
  const { axisMinElevation, axisMaxElevation } = resolveElevationAxis(summary);
  const baselineY = height - paddingBottom;
  const markerGuideTopY = 12;
  const tickValues = Array.from({ length: 5 }, (_value, index) => axisMinElevation + (((axisMaxElevation - axisMinElevation) / 4) * index));
  const displayClusters = mergeDisplayedClusters(snapshot.clusters);
  const namedGroups = buildNamedRaceGroups(displayClusters);
  const distanceTicks = buildDistanceTicks(summary, snapshot.stageDistanceMeters);
  const points = summary.points.map((point) => {
    const x = scaleDistance(point.kmMark * 1000, snapshot.stageDistanceMeters, width, paddingX);
    const y = scaleElevation(point.elevation, axisMinElevation, axisMaxElevation, height, paddingTop, paddingBottom);
    return { x, y };
  });
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${(width - paddingX).toFixed(1)} ${baselineY.toFixed(1)} L ${paddingX.toFixed(1)} ${baselineY.toFixed(1)} Z`;
  const markerEvents = buildProfileEvents(summary, snapshot.stageDistanceMeters, width, paddingX, height, paddingTop, paddingBottom, axisMinElevation, axisMaxElevation)
    .map((event) => renderProfileEvent(event, markerGuideTopY, baselineY))
    .join('');
  const gridLines = tickValues.map((value) => {
    const y = scaleElevation(value, axisMinElevation, axisMaxElevation, height, paddingTop, paddingBottom);
    return `
      <line x1="${paddingX}" y1="${y.toFixed(1)}" x2="${width - paddingX}" y2="${y.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="${paddingX}" y1="${y.toFixed(1)}" x2="${(paddingX - 8).toFixed(1)}" y2="${y.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${(paddingX - 14).toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${formatElevationLabel(value)}</text>`;
  }).join('');
  const distanceTickMarkup = renderDistanceTicks(distanceTicks, summary, snapshot.stageDistanceMeters, width, paddingX, baselineY);
  const groupByCluster = new Map(displayClusters.map((cluster, index) => [cluster, namedGroups[index] ?? null]));
  const clusters = displayClusters
    .map((cluster) => renderCluster(cluster, summary, snapshot.stageDistanceMeters, width, height, paddingX, paddingTop, paddingBottom, axisMinElevation, axisMaxElevation, groupByCluster.get(cluster)?.label === selectedGroupLabel))
    .join('');
  const ittRiderLabels = bootstrap.stage.profile === 'ITT'
    ? renderIttRiderLabels(displayClusters, summary, snapshot.stageDistanceMeters, width, height, paddingX, paddingTop, paddingBottom, axisMinElevation, axisMaxElevation, bootstrap)
    : '';
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
            <clipPath id="race-sim-profile-plot-clip">
              <rect x="${paddingX}" y="0" width="${width - (paddingX * 2)}" height="${height}"></rect>
            </clipPath>
          </defs>
          <rect x="0" y="0" width="${width}" height="${height}" fill="url(#race-sim-paper)"></rect>
          ${gridLines}
          <line x1="${paddingX}" y1="${baselineY}" x2="${width - paddingX}" y2="${baselineY}" class="race-sim-axis"></line>
          <line x1="${paddingX}" y1="${paddingTop}" x2="${paddingX}" y2="${baselineY}" class="race-sim-axis"></line>
          <g clip-path="url(#race-sim-profile-plot-clip)">
            <path d="${areaPath}" fill="url(#race-sim-area)"></path>
            <path d="${linePath}" class="race-sim-profile-line"></path>
            ${markerEvents}
            ${clusters}
          </g>
          ${ittRiderLabels}
          ${distanceTickMarkup}
          <text x="${paddingX.toFixed(1)}" y="${(paddingTop - 20).toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>
        </svg>
      </div>
    </div>`;
}