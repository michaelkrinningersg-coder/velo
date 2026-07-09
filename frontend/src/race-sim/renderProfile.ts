import type { ParsedStageSummary, RealtimeSimulationBootstrap, Rider, StageMarkerCategory, StageProfile } from '../../../shared/types';
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

// ===========================================================================
// BROADCAST-LOOK (Höhenprofil 1b „Analyse-Karte")
// Dunkle Karte, Kategorie-farbige Anstiege, Namens-Chips über dem Gipfel,
// grüne „S"-Sprints, kollisionssichere Label-Entzerrung. Geteilt von Static-,
// Mini- und Live-Race-Profil (renderRaceProfile).
// ===========================================================================

const BROADCAST_SPRINT_COLOR = '#4ade80';
const BROADCAST_CAT: Record<'HC' | '1' | '2' | '3' | '4', { color: string; text: string; label: string }> = {
  HC: { color: '#ef4444', text: '#2a0a0a', label: 'HC' },
  '1': { color: '#f97316', text: '#2a1405', label: '1' },
  '2': { color: '#fbbf24', text: '#2a2205', label: '2' },
  '3': { color: '#a3e635', text: '#16240a', label: '3' },
  '4': { color: '#4ade80', text: '#082013', label: '4' },
};

function broadcastCat(category: StageMarkerCategory | null): { color: string; text: string; label: string } {
  if (category === 'HC' || category === '1' || category === '2' || category === '3' || category === '4') {
    return BROADCAST_CAT[category];
  }
  return { color: '#94a3b8', text: '#0b1424', label: '?' };
}

function hexA(hex: string, alpha: number): string {
  const n = hex.replace('#', '');
  return `rgba(${parseInt(n.slice(0, 2), 16)},${parseInt(n.slice(2, 4), 16)},${parseInt(n.slice(4, 6), 16)},${alpha})`;
}

interface ProfileGeom {
  x: (km: number) => number;
  y: (elevation: number) => number;
  baselineY: number;
  width: number;
  height: number;
  paddingX: number;
  paddingTop: number;
  axisMinElevation: number;
  axisMaxElevation: number;
  distanceKm: number;
}

function buildProfileGeom(summary: ParsedStageSummary, width: number, height: number, paddingX: number, paddingTop: number, paddingBottom: number, stageDistanceMeters: number): ProfileGeom {
  const { axisMinElevation, axisMaxElevation } = resolveElevationAxis(summary);
  return {
    x: (km) => scaleDistance(km * 1000, stageDistanceMeters, width, paddingX),
    y: (elevation) => scaleElevation(elevation, axisMinElevation, axisMaxElevation, height, paddingTop, paddingBottom),
    baselineY: height - paddingBottom,
    width,
    height,
    paddingX,
    paddingTop,
    axisMinElevation,
    axisMaxElevation,
    distanceKm: stageDistanceMeters / 1000,
  };
}

export interface ClimbFeature {
  startKm: number;
  topKm: number;
  startElevation: number;
  topElevation: number;
  category: StageMarkerCategory | null;
  name: string;
  lengthKm: number;
  avgGradient: number;
  finish: boolean;
}
export interface SprintFeature { km: number; elevation: number; name: string; }
export interface StageFeatures { climbs: ClimbFeature[]; sprints: SprintFeature[]; finishHasSummit: boolean; }

// Leitet Anstiege (climb_start↔climb_top/finish-summit), Zwischensprints und
// Bergankunft aus den eingebetteten StageMarkern ab — dieselbe Paarungslogik
// wie zuvor buildProfileEvents, aber mit vollem Start/Top-Bereich für die
// farbige Anstiegs-Schattierung und die Namens-Chips.
export function extractStageFeatures(summary: ParsedStageSummary): StageFeatures {
  const climbs: ClimbFeature[] = [];
  const sprints: SprintFeature[] = [];
  const pending: Array<{ kmMark: number; elevation: number; name: string | null }> = [];
  let finishHasSummit = false;

  for (const boundaryMarker of collectStageBoundaryMarkers(summary)) {
    const { marker, kmMark, elevation } = boundaryMarker;
    if (marker.type === 'climb_start') {
      pending.push({ kmMark, elevation, name: marker.name });
      continue;
    }
    if (isMountainClassificationMarker(marker)) {
      let matchingIndex = -1;
      for (let index = pending.length - 1; index >= 0; index -= 1) {
        if (marker.name && pending[index]?.name === marker.name) { matchingIndex = index; break; }
      }
      const climbStart = matchingIndex >= 0 ? pending.splice(matchingIndex, 1)[0] : pending.pop();
      const lengthKm = climbStart ? Math.max(0, kmMark - climbStart.kmMark) : 0;
      const gainMeters = climbStart ? Math.max(0, elevation - climbStart.elevation) : 0;
      const avgGradient = lengthKm > 0 ? gainMeters / (lengthKm * 10) : 0;
      const finish = marker.type === 'finish_hill' || marker.type === 'finish_mountain';
      if (finish) finishHasSummit = true;
      climbs.push({
        startKm: climbStart?.kmMark ?? kmMark,
        topKm: kmMark,
        startElevation: climbStart?.elevation ?? elevation,
        topElevation: elevation,
        category: marker.cat,
        name: marker.name ?? climbStart?.name ?? 'Anstieg',
        lengthKm,
        avgGradient,
        finish,
      });
      continue;
    }
    if (marker.type === 'sprint_intermediate') {
      sprints.push({ km: kmMark, elevation, name: marker.name ?? 'Zwischensprint' });
    }
  }

  return { climbs, sprints, finishHasSummit };
}

function broadcastGradientDefs(gradientId: string): string {
  return `<linearGradient id="${gradientId}" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="rgba(120,140,175,0.20)"></stop>
      <stop offset="100%" stop-color="rgba(120,140,175,0.015)"></stop>
    </linearGradient>`;
}

function broadcastGrid(summary: ParsedStageSummary, geom: ProfileGeom, compact: boolean): string {
  if (compact) return '';
  const values = Array.from({ length: 5 }, (_v, index) => geom.axisMinElevation + (((geom.axisMaxElevation - geom.axisMinElevation) / 4) * index));
  return values.map((value) => {
    const y = geom.y(value).toFixed(1);
    return `<line x1="${geom.paddingX}" y1="${y}" x2="${(geom.width - geom.paddingX).toFixed(1)}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"></line>
      <text x="${(geom.paddingX + 4).toFixed(1)}" y="${(geom.y(value) - 6).toFixed(1)}" fill="#5f6f8a" font-size="16" font-family="'JetBrains Mono',monospace">${formatElevationLabel(value)}</text>`;
  }).join('');
}

function broadcastLinePath(summary: ParsedStageSummary, geom: ProfileGeom): string {
  return summary.points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${geom.x(point.kmMark).toFixed(1)} ${geom.y(point.elevation).toFixed(1)}`).join(' ');
}

// Kategorie-farbige Anstiegs-Schattierung + farbige Deckstroke über dem Kamm.
function broadcastClimbSegments(summary: ParsedStageSummary, geom: ProfileGeom, features: StageFeatures, compact: boolean): string {
  return features.climbs.map((climb) => {
    const color = broadcastCat(climb.category).color;
    const seg = [
      { km: climb.startKm, elevation: interpolateElevation(summary, climb.startKm * 1000) },
      ...summary.points.filter((point) => point.kmMark > climb.startKm && point.kmMark < climb.topKm).map((point) => ({ km: point.kmMark, elevation: point.elevation })),
      { km: climb.topKm, elevation: interpolateElevation(summary, climb.topKm * 1000) },
    ];
    let area = `M ${geom.x(seg[0].km).toFixed(1)} ${geom.baselineY.toFixed(1)}`;
    seg.forEach((point) => { area += ` L ${geom.x(point.km).toFixed(1)} ${geom.y(point.elevation).toFixed(1)}`; });
    area += ` L ${geom.x(seg[seg.length - 1].km).toFixed(1)} ${geom.baselineY.toFixed(1)} Z`;
    let deck = `M ${geom.x(seg[0].km).toFixed(1)} ${geom.y(seg[0].elevation).toFixed(1)}`;
    seg.forEach((point, index) => { if (index) deck += ` L ${geom.x(point.km).toFixed(1)} ${geom.y(point.elevation).toFixed(1)}`; });
    return `<path d="${area}" fill="${hexA(color, 0.22)}"></path>
      <path d="${deck}" fill="none" stroke="${color}" stroke-width="${compact ? 2 : 3}" stroke-linejoin="round" stroke-linecap="round"></path>`;
  }).join('');
}

function broadcastGuidesAndSprints(geom: ProfileGeom, features: StageFeatures, compact: boolean): string {
  const guide = (km: number, elevation: number, color: string) =>
    `<line x1="${geom.x(km).toFixed(1)}" x2="${geom.x(km).toFixed(1)}" y1="${geom.baselineY.toFixed(1)}" y2="${geom.y(elevation).toFixed(1)}" stroke="${hexA(color, 0.45)}" stroke-width="1.4" stroke-dasharray="3 3"></line>`;
  const climbGuides = features.climbs.map((climb) => guide(climb.topKm, climb.topElevation, broadcastCat(climb.category).color)).join('');
  const sprintGuides = features.sprints.map((sprint) => guide(sprint.km, sprint.elevation, BROADCAST_SPRINT_COLOR)).join('');
  const sprintDots = features.sprints.map((sprint) =>
    `<circle cx="${geom.x(sprint.km).toFixed(1)}" cy="${geom.y(sprint.elevation).toFixed(1)}" r="${compact ? 3 : 4.5}" fill="#061019" stroke="${BROADCAST_SPRINT_COLOR}" stroke-width="2"></circle>`).join('');
  return climbGuides + sprintGuides + sprintDots;
}

// Namens-Chips über den Gipfeln mit kollisionssicherer Entzerrung im SVG-Raum.
function broadcastMarkerChips(summary: ParsedStageSummary, geom: ProfileGeom, features: StageFeatures, compact: boolean): string {
  interface ChipDesc {
    cx: number; elevation: number; kind: 'climb' | 'sprint' | 'finish';
    estW: number; chipH: number; tx: 'center' | 'left' | 'right';
    title: string; inner: (originX: number, originY: number) => string;
    L: number; R: number; markerY: number; top: number; bottom: number;
  }
  const S = compact
    ? { cb: 13, p: 5, gap: 6, nameF: 0, metaF: 0, sprintR: 8, offY: 10, gapX: 16, gapY: 6, finF: 9 }
    : { cb: 24, p: 8, gap: 9, nameF: 20, metaF: 15, sprintR: 13, offY: 16, gapX: 34, gapY: 12, finF: 15 };
  const descs: ChipDesc[] = [];

  const clampTx = (cx: number): 'center' | 'left' | 'right' => {
    const frac = (cx - geom.paddingX) / Math.max(1, geom.width - geom.paddingX * 2);
    if (frac > 0.9) return 'right';
    if (frac < 0.08) return 'left';
    return 'center';
  };
  const leftEdge = (cx: number, estW: number, tx: 'center' | 'left' | 'right') =>
    tx === 'center' ? cx - estW / 2 : tx === 'right' ? cx - estW : cx;

  for (const climb of features.climbs) {
    const cat = broadcastCat(climb.category);
    const cx = geom.x(climb.topKm);
    const name = (climb.finish ? '🏁 ' : '') + climb.name;
    const sub = `${Math.round(climb.topElevation)} m · ${climb.avgGradient.toFixed(1).replace('.', ',')}%`;
    const title = `${climb.name} · ${climb.finish ? 'Bergankunft · ' : ''}Kat. ${cat.label} · ${Math.round(climb.topElevation)} m · ${climb.lengthKm.toFixed(1).replace('.', ',')} km · ${climb.avgGradient.toFixed(1).replace('.', ',')} %`;
    let estW: number; let chipH: number;
    if (compact) {
      estW = S.cb + S.p * 2; chipH = S.cb + S.p * 2;
    } else {
      const textW = Math.max(name.length * S.nameF * 0.56, sub.length * S.metaF * 0.56);
      estW = S.p + S.cb + S.gap + textW + S.p; chipH = S.p * 2 + S.nameF + 3 + S.metaF;
    }
    const tx = clampTx(cx);
    const inner = (ox: number, oy: number): string => {
      const catBox = `<rect x="${(ox + S.p).toFixed(1)}" y="${(oy + (chipH - S.cb) / 2).toFixed(1)}" width="${S.cb}" height="${S.cb}" rx="4" fill="${cat.color}"></rect>
        <text x="${(ox + S.p + S.cb / 2).toFixed(1)}" y="${(oy + chipH / 2).toFixed(1)}" fill="${cat.text}" font-size="${(S.cb * 0.6).toFixed(1)}" font-weight="800" text-anchor="middle" dominant-baseline="central" font-family="'JetBrains Mono',monospace">${cat.label}</text>`;
      const box = `<rect x="${ox.toFixed(1)}" y="${oy.toFixed(1)}" width="${estW.toFixed(1)}" height="${chipH.toFixed(1)}" rx="7" fill="#0c1729" stroke="${climb.finish ? hexA(cat.color, 0.7) : '#223350'}" stroke-width="1"></rect>`;
      if (compact) return `${box}${catBox}`;
      return `${box}${catBox}
        <text x="${(ox + S.p + S.cb + S.gap).toFixed(1)}" y="${(oy + S.p + S.nameF * 0.82).toFixed(1)}" fill="#e8eef7" font-size="${S.nameF}" font-weight="800" font-family="'Archivo',sans-serif">${esc(name)}</text>
        <text x="${(ox + S.p + S.cb + S.gap).toFixed(1)}" y="${(oy + chipH - S.p - 2).toFixed(1)}" fill="${hexA(cat.color, 0.95)}" font-size="${S.metaF}" font-weight="700" font-family="'JetBrains Mono',monospace">${esc(sub)}</text>`;
    };
    descs.push({ cx, elevation: climb.topElevation, kind: 'climb', estW, chipH, tx, title, inner, L: 0, R: 0, markerY: 0, top: 0, bottom: 0 });
  }

  for (const sprint of features.sprints) {
    const cx = geom.x(sprint.km);
    const size = S.sprintR * 2;
    const title = `Zwischensprint${sprint.name && sprint.name !== 'Zwischensprint' ? ' · ' + sprint.name : ''} · km ${Math.round(sprint.km)} · ${Math.round(sprint.elevation)} m`;
    const inner = (ox: number, oy: number): string =>
      `<circle cx="${(ox + S.sprintR).toFixed(1)}" cy="${(oy + S.sprintR).toFixed(1)}" r="${(S.sprintR - 1).toFixed(1)}" fill="#061019" stroke="${BROADCAST_SPRINT_COLOR}" stroke-width="1.6"></circle>
        <text x="${(ox + S.sprintR).toFixed(1)}" y="${(oy + S.sprintR).toFixed(1)}" fill="${BROADCAST_SPRINT_COLOR}" font-size="${(S.sprintR * 1.05).toFixed(1)}" font-weight="800" text-anchor="middle" dominant-baseline="central" font-family="'JetBrains Mono',monospace">S</text>`;
    descs.push({ cx, elevation: sprint.elevation, kind: 'sprint', estW: size, chipH: size, tx: 'center', title, inner, L: 0, R: 0, markerY: 0, top: 0, bottom: 0 });
  }

  if (!features.finishHasSummit && summary.points.length > 0) {
    const finishPoint = summary.points[summary.points.length - 1];
    const cx = geom.x(finishPoint.kmMark);
    const label = 'ZIEL';
    const estW = compact ? 26 : label.length * S.finF * 0.72 + 12;
    const chipH = compact ? 15 : 22;
    const inner = (ox: number, oy: number): string =>
      `<rect x="${ox.toFixed(1)}" y="${oy.toFixed(1)}" width="${estW.toFixed(1)}" height="${chipH.toFixed(1)}" rx="5" fill="#0c1729" stroke="#334a68" stroke-width="1"></rect>
        <text x="${(ox + estW / 2).toFixed(1)}" y="${(oy + chipH / 2).toFixed(1)}" fill="#cbd5e1" font-size="${compact ? 8 : S.finF}" font-weight="800" text-anchor="middle" dominant-baseline="central" font-family="'JetBrains Mono',monospace">${label}</text>`;
    descs.push({ cx, elevation: finishPoint.elevation, kind: 'finish', estW, chipH, tx: 'right', title: `Ziel · km ${Math.round(finishPoint.kmMark)} · ${Math.round(finishPoint.elevation)} m`, inner, L: 0, R: 0, markerY: 0, top: 0, bottom: 0 });
  }

  // Kollisionssichere Entzerrung: jedes Chip über seinen Marker, dann nach oben
  // schieben, bis nichts überlappt (Verbindungsstrich runter zum Gipfel).
  descs.sort((a, b) => a.cx - b.cx);
  const placed: Array<{ L: number; R: number; top: number; bottom: number }> = [];
  for (const desc of descs) {
    desc.L = leftEdge(desc.cx, desc.estW, desc.tx);
    desc.R = desc.L + desc.estW;
    desc.markerY = geom.y(desc.elevation);
    let bottom = desc.markerY - S.offY;
    let top = bottom - desc.chipH;
    let guard = 0; let hit = true;
    while (hit && guard++ < 80) {
      hit = false;
      for (const prev of placed) {
        if (desc.L < prev.R + S.gapX && desc.R > prev.L - S.gapX && top < prev.bottom + S.gapY && bottom > prev.top - S.gapY) {
          bottom = prev.top - S.gapY; top = bottom - desc.chipH; hit = true;
        }
      }
    }
    if (top < 4) { top = 4; bottom = top + desc.chipH; }
    desc.top = top; desc.bottom = bottom;
    placed.push({ L: desc.L, R: desc.R, top, bottom });
  }

  return descs.map((desc) => {
    const connectorTop = desc.bottom;
    const connector = desc.markerY - connectorTop > 4
      ? `<line x1="${desc.cx.toFixed(1)}" x2="${desc.cx.toFixed(1)}" y1="${connectorTop.toFixed(1)}" y2="${desc.markerY.toFixed(1)}" stroke="rgba(255,255,255,0.30)" stroke-width="1" stroke-dasharray="3 3"></line>`
      : '';
    return `<g class="hp-marker-chip">${connector}<title>${esc(desc.title)}</title>${desc.inner(desc.L, desc.top)}</g>`;
  }).join('');
}

function broadcastDistanceTicks(summary: ParsedStageSummary, geom: ProfileGeom, stageDistanceMeters: number, compact: boolean): string {
  if (compact) return '';
  const markerMeters = new Set(collectStageBoundaryMarkers(summary).map((entry) => Math.round(entry.kmMark * 1000)));
  const ticks = buildDistanceTicks(summary, stageDistanceMeters);
  const finishMeter = ticks.length > 0 ? ticks[ticks.length - 1] : stageDistanceMeters;
  // Regel-Labels, die zu nah an der Zielbeschriftung liegen, weglassen (sonst
  // berühren sich z. B. „175 km" und die Zielangabe). Start links-, Ziel rechtsbündig.
  const minGapMeters = Math.max(stageDistanceMeters * 0.06, 12000);
  return ticks.map((distanceMeter, index) => {
    const x = geom.x(distanceMeter / 1000);
    const tickLength = markerMeters.has(distanceMeter) ? 8 : 5;
    const isFinish = index === ticks.length - 1;
    const isStart = index === 0;
    const anchor = isFinish ? 'end' : isStart ? 'start' : 'middle';
    const showLabel = isFinish || (finishMeter - distanceMeter) >= minGapMeters;
    const line = `<line x1="${x.toFixed(1)}" y1="${geom.baselineY.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(geom.baselineY + tickLength).toFixed(1)}" stroke="#334155" stroke-width="1"></line>`;
    const text = showLabel
      ? `<text x="${x.toFixed(1)}" y="${(geom.baselineY + tickLength + 18).toFixed(1)}" text-anchor="${anchor}" fill="#6a7a95" font-size="16" font-family="'JetBrains Mono',monospace">${esc(formatKm(distanceMeter))}</text>`
      : '';
    return line + text;
  }).join('');
}

function buildStaticProfileMarkup(summary: ParsedStageSummary, stageProfile: StageProfile, label: string, compact: boolean, options: StaticStageProfileOptions = {}): string {
  const width = compact ? 600 : 1584;
  const height = compact ? 156 : 634;
  const paddingX = compact ? 12 : 28;
  const paddingTop = compact ? 34 : 168;
  const paddingBottom = compact ? 20 : 101;
  const stageDistanceMeters = summary.distanceKm * 1000;
  const geom = buildProfileGeom(summary, width, height, paddingX, paddingTop, paddingBottom, stageDistanceMeters);
  const features = extractStageFeatures(summary);
  const gradientId = compact ? 'hp-mini-area' : 'hp-large-area';
  const linePath = broadcastLinePath(summary, geom);
  const areaPath = `${linePath} L ${(width - paddingX).toFixed(1)} ${geom.baselineY.toFixed(1)} L ${paddingX.toFixed(1)} ${geom.baselineY.toFixed(1)} Z`;
  const climbHighlightPath = options.selectedClimbRange != null
    ? buildClimbHighlightAreaPath(summary, stageDistanceMeters, width, paddingX, height, paddingTop, paddingBottom, geom.axisMinElevation, geom.axisMaxElevation, options.selectedClimbRange.startKm, options.selectedClimbRange.endKm)
    : null;

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}" class="${compact ? 'dashboard-stage-profile-svg' : 'dashboard-stage-profile-svg dashboard-stage-profile-svg-large'}" data-stage-profile="${stageProfile}">
      <defs>${broadcastGradientDefs(gradientId)}</defs>
      <rect x="0" y="0" width="${width}" height="${height}" fill="#0c1526"></rect>
      ${broadcastGrid(summary, geom, compact)}
      <line x1="${paddingX}" y1="${geom.baselineY}" x2="${width - paddingX}" y2="${geom.baselineY}" stroke="#243352" stroke-width="1.2"></line>
      <path d="${areaPath}" fill="url(#${gradientId})"></path>
      ${broadcastClimbSegments(summary, geom, features, compact)}
      ${climbHighlightPath ? `<path d="${climbHighlightPath}" class="dashboard-stage-profile-climb-highlight"></path>` : ''}
      <path d="${linePath}" fill="none" stroke="rgba(226,232,240,0.85)" stroke-width="${compact ? 1.8 : 2.8}" stroke-linejoin="round" stroke-linecap="round"></path>
      ${broadcastGuidesAndSprints(geom, features, compact)}
      ${broadcastMarkerChips(summary, geom, features, compact)}
      ${broadcastDistanceTicks(summary, geom, stageDistanceMeters, compact)}
      ${compact ? '' : `<text x="${(paddingX + 4).toFixed(1)}" y="${(paddingTop - 18).toFixed(1)}" fill="#5f6f8a" font-size="16" font-weight="700" letter-spacing="1.5" font-family="'JetBrains Mono',monospace">HÖHE</text>`}
    </svg>`;
}

// Grosses statisches Profil als HTML-String (für innerHTML-Einbettung, z. B. Renndetails).
export function renderStaticStageProfileMarkup(summary: ParsedStageSummary, stageProfile: StageProfile, label: string, options?: StaticStageProfileOptions): string {
  if (summary.points.length < 2) {
    return '<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';
  }
  return `<div class="dashboard-stage-profile-wrap">${buildStaticProfileMarkup(summary, stageProfile, label, false, options)}</div>`;
}

export function renderStaticStageProfile(container: HTMLElement, summary: ParsedStageSummary, stageProfile: StageProfile, label: string, options?: StaticStageProfileOptions): void {
  container.innerHTML = renderStaticStageProfileMarkup(summary, stageProfile, label, options);
}

// Kompaktes Mini-Profil als HTML-String (für innerHTML-Einbettung, z. B. Dashboard-Spotlight).
export function renderMiniStageProfileMarkup(summary: ParsedStageSummary, stageProfile: StageProfile, label: string): string {
  if (summary.points.length < 2) {
    return '<div class="dashboard-stage-profile-empty">–</div>';
  }
  return buildStaticProfileMarkup(summary, stageProfile, label, true);
}

export function renderMiniStageProfile(container: HTMLElement, summary: ParsedStageSummary, stageProfile: StageProfile, label: string): void {
  container.innerHTML = renderMiniStageProfileMarkup(summary, stageProfile, label);
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
  const stageDistanceMeters = snapshot.stageDistanceMeters;
  const geom = buildProfileGeom(summary, width, height, paddingX, paddingTop, paddingBottom, stageDistanceMeters);
  const features = extractStageFeatures(summary);
  const gradientId = 'hp-race-area';
  const linePath = broadcastLinePath(summary, geom);
  const areaPath = `${linePath} L ${(width - paddingX).toFixed(1)} ${geom.baselineY.toFixed(1)} L ${paddingX.toFixed(1)} ${geom.baselineY.toFixed(1)} Z`;
  const displayClusters = mergeDisplayedClusters(snapshot.clusters);
  const namedGroups = buildNamedRaceGroups(displayClusters);
  const groupByCluster = new Map(displayClusters.map((cluster, index) => [cluster, namedGroups[index] ?? null]));
  const clusters = displayClusters
    .map((cluster) => renderCluster(cluster, summary, stageDistanceMeters, width, height, paddingX, paddingTop, paddingBottom, geom.axisMinElevation, geom.axisMaxElevation, groupByCluster.get(cluster)?.label === selectedGroupLabel))
    .join('');
  const ittRiderLabels = bootstrap.stage.profile === 'ITT'
    ? renderIttRiderLabels(displayClusters, summary, stageDistanceMeters, width, height, paddingX, paddingTop, paddingBottom, geom.axisMinElevation, geom.axisMaxElevation, bootstrap)
    : '';
  container.innerHTML = `
    <div class="race-sim-profile-layout${bootstrap.stage.profile === 'ITT' ? ' race-sim-profile-layout-itt' : ''}">
      <div class="race-sim-profile-canvas-wrap">
        <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}">
          <defs>
            ${broadcastGradientDefs(gradientId)}
            <clipPath id="race-sim-profile-plot-clip">
              <rect x="${paddingX}" y="0" width="${width - (paddingX * 2)}" height="${height}"></rect>
            </clipPath>
          </defs>
          <rect x="0" y="0" width="${width}" height="${height}" fill="#0c1526"></rect>
          ${broadcastGrid(summary, geom, false)}
          <line x1="${paddingX}" y1="${geom.baselineY}" x2="${width - paddingX}" y2="${geom.baselineY}" stroke="#243352" stroke-width="1.2"></line>
          <g clip-path="url(#race-sim-profile-plot-clip)">
            <path d="${areaPath}" fill="url(#${gradientId})"></path>
            ${broadcastClimbSegments(summary, geom, features, false)}
            <path d="${linePath}" fill="none" stroke="rgba(226,232,240,0.85)" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"></path>
            ${broadcastGuidesAndSprints(geom, features, false)}
            ${clusters}
          </g>
          ${broadcastMarkerChips(summary, geom, features, false)}
          ${ittRiderLabels}
          ${broadcastDistanceTicks(summary, geom, stageDistanceMeters, false)}
          <text x="${(paddingX + 4).toFixed(1)}" y="${(paddingTop - 18).toFixed(1)}" fill="#5f6f8a" font-size="16" font-weight="700" letter-spacing="1.5" font-family="'JetBrains Mono',monospace">HÖHE</text>
        </svg>
      </div>
    </div>`;
}