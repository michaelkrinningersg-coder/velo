import { isTimeTrialProfile, rankStageResultEntries, resolveStageTimeLimitSeconds, roundStageResultSeconds } from '../../../shared/stageResultRules';
import { buildNamedRaceGroups, mergeDisplayedClusters, resolveDefaultRaceGroupLabel } from './groupClusters';
import { collectStageBoundaryMarkers, isMountainClassificationMarker } from './stageSummary';
function esc(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}
function resolveTeamJerseyAssetPath(teamId) {
    return `/jersey/Jer_${teamId}.png`;
}
function renderJersey(teamId, teamName) {
    if (teamId == null || teamId <= 0) {
        return '—';
    }
    return `
    <span class="race-sim-team-visual" title="${esc(teamName ?? `Team ${teamId}`)}">
      <img
        class="race-sim-team-jersey-img"
        src="${esc(resolveTeamJerseyAssetPath(teamId))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`;
}
function renderRiderGroupButton(riderId, label, className) {
    if (riderId == null) {
        return `<span class="${className}" title="${esc(label)}">${esc(label)}</span>`;
    }
    return `<button type="button" class="${className} race-sim-stage-overview-rider-link" data-race-sim-group-rider-id="${riderId}" title="${esc(label)}">${esc(label)}</button>`;
}
function formatSkill(value) {
    return value.toFixed(1).replace('.', ',');
}
function formatGcGap(seconds) {
    if (seconds == null || seconds <= 0) {
        return '—';
    }
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    if (minutes > 0) {
        return `+${minutes}:${String(remainder).padStart(2, '0')}`;
    }
    return `+${remainder}s`;
}
function formatClockGap(seconds) {
    if (seconds == null || seconds <= 0) {
        return '—';
    }
    const roundedSeconds = Math.round(seconds);
    const minutes = Math.floor(roundedSeconds / 60);
    const remainder = roundedSeconds % 60;
    return `+${minutes}:${String(remainder).padStart(2, '0')}`;
}
function formatKmMark(value) {
    if (value == null || !Number.isFinite(value)) {
        return '—';
    }
    return `${value.toFixed(1).replace('.', ',')} km`;
}
function formatPoints(points) {
    return `${points ?? 0} Pkt.`;
}
function formatDistanceGapMeters(meters) {
    if (meters == null || !Number.isFinite(meters)) {
        return '—';
    }
    const roundedMeters = Math.round(meters);
    if (roundedMeters === 0) {
        return '—';
    }
    return roundedMeters > 0
        ? `+${roundedMeters} m`
        : `-${Math.abs(roundedMeters)} m`;
}
function resolveDistanceGapToneClassName(meters) {
    if (meters == null || !Number.isFinite(meters)) {
        return '';
    }
    if (meters < -100) {
        return 'is-ahead';
    }
    if (meters > 100) {
        return 'is-behind';
    }
    return '';
}
function formatClock(seconds) {
    const totalSeconds = Math.max(0, Math.round(seconds));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
function formatTimeGap(seconds) {
    if (seconds == null || seconds <= 0)
        return formatClock(0);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return minutes > 0 ? `+${minutes}:${String(remainingSeconds).padStart(2, '0')}` : `+${remainingSeconds}s`;
}
function parseRankedValues(value) {
    if (!value)
        return [];
    return value.split('|').map((part) => Number.parseInt(part.trim(), 10)).filter(Number.isFinite);
}
function formatKm(value) {
    return `${value.toFixed(1).replace('.', ',')} km`;
}
function formatGradient(value) {
    return `${value.toFixed(1).replace('.', ',')}%`;
}
function buildScoringBadges(values, pointsKind) {
    return values
        .filter((points) => Number.isFinite(points) && points > 0)
        .map((points) => ({ points, pointsKind }));
}
function resolveCategoryClassName(category) {
    if (category == null)
        return null;
    if (category === 'HC')
        return 'is-hc';
    return `is-cat-${category}`;
}
function resolveScoringEventBadge(event) {
    if (event.accent === 'sprint') {
        return { label: 'Sprint', className: 'is-sprint' };
    }
    if (event.categoryLabel && event.categoryClassName) {
        return { label: event.categoryLabel, className: event.categoryClassName };
    }
    return null;
}
function resolveLeaderKey(item, classificationLeaders) {
    if (item.riderId == null) {
        return null;
    }
    if (classificationLeaders.gcLeaderRiderId === item.riderId) {
        return 'gc';
    }
    if (classificationLeaders.pointsLeaderRiderId === item.riderId) {
        return 'points';
    }
    if (classificationLeaders.mountainLeaderRiderId === item.riderId) {
        return 'mountain';
    }
    if (classificationLeaders.youthLeaderRiderId === item.riderId) {
        return 'youth';
    }
    return null;
}
function chunkItems(items, columnCount, rowsPerColumn) {
    return Array.from({ length: columnCount }, (_entry, columnIndex) => items.slice(columnIndex * rowsPerColumn, (columnIndex + 1) * rowsPerColumn));
}
function renderStageFavoriteGrid(favorites, gcStandings, classificationLeaders) {
    if (favorites.length === 0) {
        return '<div class="race-sim-favorites-empty">Noch keine Favoriten für diese Etappe.</div>';
    }
    const columns = chunkItems(favorites, 4, 5);
    const gcByRiderId = new Map(gcStandings.map((standing) => [standing.riderId, standing]));
    return `<div class="race-sim-stage-favorites-grid">${columns.map((column) => `
    <div class="race-sim-favorites-column">
      ${column.map((item) => `
        <article class="race-sim-favorite-item${(() => {
        const leaderKey = resolveLeaderKey(item, classificationLeaders);
        return leaderKey ? ` is-${leaderKey}-leader` : '';
    })()}">
          <strong class="race-sim-favorite-rank">${item.rank}.</strong>
          ${renderJersey(item.teamId, item.teamName)}
          <div class="race-sim-favorite-main">
                    ${renderRiderGroupButton(item.riderId, item.displayName, 'race-sim-favorite-name')}
            <span class="race-sim-favorite-role" title="${esc(item.roleLabel)}">${esc(item.roleLabel)}</span>
            ${(() => {
        const standing = item.riderId != null ? gcByRiderId.get(item.riderId) ?? null : null;
        if (!standing) {
            return '';
        }
        return `<span class="race-sim-favorite-gc">GC ${standing.rank} · ${esc(formatGcGap(standing.gapSeconds))}</span>`;
    })()}
          </div>
          <strong class="race-sim-favorite-skill">${formatSkill(item.effectiveSkill)}</strong>
        </article>
      `).join('')}
    </div>
  `).join('')}</div>`;
}
function resolveRiderName(bootstrap, riderId) {
    const rider = bootstrap.riders.find((candidate) => candidate.id === riderId);
    return rider ? `${rider.firstName} ${rider.lastName}` : `Fahrer ${riderId}`;
}
function resolveRiderTeam(bootstrap, riderId) {
    const rider = bootstrap.riders.find((candidate) => candidate.id === riderId);
    const teamId = rider?.activeTeamId ?? null;
    const team = teamId != null ? bootstrap.teams.find((candidate) => candidate.id === teamId) ?? null : null;
    return { teamId, teamName: team?.name ?? null };
}
function renderStandingRows(bootstrap, standings, detail, options = {}) {
    const visibleStandings = (standings ?? []).slice(0, options.limit ?? 8);
    if (visibleStandings.length === 0) {
        return '<div class="race-sim-classification-empty">Noch keine Vorwertung.</div>';
    }
    return `<div class="race-sim-classification-grid">${visibleStandings.map((standing) => {
        const riderId = standing.riderId ?? 0;
        const team = resolveRiderTeam(bootstrap, riderId);
        const riderName = resolveRiderName(bootstrap, riderId);
        const distanceGap = options.distanceGapsByRiderId?.get(riderId) ?? null;
        const distanceGapClassName = [
            options.distanceGapClassName ?? '',
            resolveDistanceGapToneClassName(distanceGap),
        ].filter((className) => className.length > 0).join(' ');
        return `
      <article class="race-sim-classification-row">
        <strong class="race-sim-favorite-rank">${standing.rank}.</strong>
        ${renderJersey(team.teamId, team.teamName)}
        <span class="race-sim-classification-main">
          ${renderRiderGroupButton(standing.riderId, riderName, 'race-sim-classification-name')}
          <span class="race-sim-classification-value">${detail(standing)}</span>
        </span>
        ${options.distanceGapsByRiderId ? `<span class="race-sim-classification-distance-gap ${distanceGapClassName}">${esc(formatDistanceGapMeters(distanceGap))}</span>` : ''}
      </article>`;
    }).join('')}</div>`;
}
function renderClassificationBox(title, modifier, bootstrap, standings, detail, options = {}) {
    return `
    <section class="race-sim-classification-box race-sim-classification-box-${modifier}">
      <h4>${esc(title)}</h4>
      ${renderStandingRows(bootstrap, standings, detail, options)}
    </section>`;
}
function renderCollapsibleOverviewBox(title, content, className, sectionKey, open = true) {
    return `
    <details class="race-sim-overview-details ${className}" data-race-sim-overview-section="${sectionKey}" ${open ? 'open' : ''}>
      <summary class="race-sim-overview-summary" data-race-sim-overview-summary="${sectionKey}">
        <span class="race-sim-overview-arrow">›</span>
        <span>${esc(title)}</span>
      </summary>
      ${content}
    </details>`;
}
function buildLiveClassificationStandings(bootstrap, baseStandings, stagePointsByRiderId, kind) {
    const baseByRiderId = new Map(baseStandings.map((standing) => [standing.riderId, standing]));
    return bootstrap.riders
        .map((rider) => {
        const base = baseByRiderId.get(rider.id) ?? null;
        const stagePoints = stagePointsByRiderId.get(rider.id)?.[kind] ?? 0;
        return {
            riderId: rider.id,
            rank: base?.rank ?? Number.MAX_SAFE_INTEGER,
            points: (base?.points ?? 0) + stagePoints,
            timeSeconds: base?.timeSeconds ?? null,
            gapSeconds: base?.gapSeconds ?? null,
            stagePoints,
        };
    })
        .sort((left, right) => ((right.points ?? 0) - (left.points ?? 0)
        || left.rank - right.rank
        || resolveRiderName(bootstrap, left.riderId).localeCompare(resolveRiderName(bootstrap, right.riderId), 'de')))
        .map((standing, index) => ({ ...standing, rank: index + 1 }));
}
function renderLivePointsDetail(standing) {
    const stagePoints = isLiveClassificationStanding(standing) ? standing.stagePoints : 0;
    return `${esc(formatPoints('points' in standing ? standing.points : null))}${stagePoints > 0 ? `<span class="race-sim-classification-stage-gain"><span class="race-sim-classification-stage-gain-arrow">▲</span><span class="race-sim-classification-stage-gain-amount">+${esc(stagePoints)}</span></span>` : ''}`;
}
function isLiveClassificationStanding(standing) {
    return 'stagePoints' in standing && typeof standing.stagePoints === 'number';
}
function buildRelativeDistanceGapsByRiderId(snapshot, referenceRiderId) {
    if (referenceRiderId == null) {
        return new Map();
    }
    const referenceRider = snapshot.riders.find((rider) => rider.riderId === referenceRiderId) ?? null;
    if (!referenceRider) {
        return new Map();
    }
    return new Map(snapshot.riders.map((rider) => [
        rider.riderId,
        referenceRider.distanceCoveredMeters - rider.distanceCoveredMeters,
    ]));
}
function resolveClimbSegment(bootstrap, kmMark) {
    return bootstrap.stageSummary.segments.find((segment) => kmMark >= segment.start_km && kmMark <= segment.end_km)
        ?? bootstrap.stageSummary.segments.find((segment) => segment.end_km >= kmMark)
        ?? bootstrap.stageSummary.segments[bootstrap.stageSummary.segments.length - 1]
        ?? null;
}
function resolveMountainPointValues(bootstrap, category) {
    const bonusSystem = bootstrap.race.category?.bonusSystem;
    if (!bonusSystem || category == null || category === 'Sprint')
        return [];
    if (category === 'HC')
        return parseRankedValues(bonusSystem.pointsMountainHc);
    if (category === '1')
        return parseRankedValues(bonusSystem.pointsMountainCat1);
    if (category === '2')
        return parseRankedValues(bonusSystem.pointsMountainCat2);
    if (category === '3')
        return parseRankedValues(bonusSystem.pointsMountainCat3);
    return parseRankedValues(bonusSystem.pointsMountainCat4);
}
function resolveFinishPointValues(bootstrap) {
    const bonusSystem = bootstrap.race.category?.bonusSystem;
    if (!bonusSystem || bootstrap.stage.profile === 'TTT')
        return [];
    if (!bootstrap.race.isStageRace) {
        return parseRankedValues(bonusSystem.pointsOneDay);
    }
    const usesMountainStagePoints = !['ITT', 'TTT', 'Flat', 'Rolling', 'Hilly'].includes(bootstrap.stage.profile);
    return parseRankedValues(usesMountainStagePoints ? bonusSystem.pointsMountainStage : bonusSystem.pointsSprintFinish);
}
function resolveIntermediateSprintPointValues(bootstrap) {
    if (bootstrap.stage.profile === 'ITT' || bootstrap.stage.profile === 'TTT') {
        return [];
    }
    return parseRankedValues(bootstrap.race.category?.bonusSystem?.pointsSprintIntermediate);
}
function resolveSteepestClimbSegment(bootstrap, startKm, endKm) {
    let steepest = null;
    for (const segment of bootstrap.stageSummary.segments) {
        const overlapStartKm = Math.max(startKm, segment.start_km);
        const overlapEndKm = Math.min(endKm, segment.end_km);
        const overlapLengthKm = Math.max(0, overlapEndKm - overlapStartKm);
        if (overlapLengthKm <= 0) {
            continue;
        }
        const candidate = {
            lengthKm: overlapLengthKm,
            gradient: segment.gradient_percent,
        };
        if (steepest == null
            || candidate.gradient > steepest.gradient
            || (candidate.gradient === steepest.gradient && candidate.lengthKm > steepest.lengthKm)) {
            steepest = candidate;
        }
    }
    return steepest;
}
function buildMarkerPointEntries(classification, values, pointsKind, classifiedRiderIds = null) {
    return classification.entries
        .filter((entry) => classifiedRiderIds == null || classifiedRiderIds.has(entry.riderId))
        .map((entry, index) => ({
        riderId: entry.riderId,
        rank: entry.rank,
        points: values[index] ?? 0,
        pointsKind,
        crossingTimeSeconds: entry.crossingTimeSeconds,
        gapSeconds: entry.gapSeconds,
    }))
        .filter((entry) => entry.points > 0);
}
function resolveStagePointTotalsByRiderId(events) {
    const totals = new Map();
    for (const event of events) {
        for (const entry of event.entries) {
            const current = totals.get(entry.riderId) ?? { points: 0, mountain: 0 };
            if (entry.pointsKind === 'mountain') {
                current.mountain += entry.points;
            }
            else {
                current.points += entry.points;
            }
            totals.set(entry.riderId, current);
        }
    }
    return totals;
}
function resolveFinishMarker(bootstrap) {
    return collectStageBoundaryMarkers(bootstrap.stageSummary)
        .filter(({ marker }) => marker.type === 'finish_flat' || marker.type === 'finish_TT' || marker.type === 'finish_hill' || marker.type === 'finish_mountain')
        .sort((left, right) => right.kmMark - left.kmMark)[0] ?? null;
}
function resolveCommitStageTimeSeconds(bootstrap, rider) {
    const rawSeconds = isTimeTrialProfile(bootstrap.stage.profile) ? rider.riderClockSeconds : rider.finishTimeSeconds;
    return rawSeconds != null && Number.isFinite(rawSeconds) ? roundStageResultSeconds(rawSeconds) : null;
}
function getClassifiedFinishedRiders(bootstrap, snapshot) {
    const finished = snapshot.riders
        .filter((rider) => rider.finishStatus !== 'dnf')
        .map((rider) => {
        const stageTimeSeconds = resolveCommitStageTimeSeconds(bootstrap, rider);
        return stageTimeSeconds == null
            ? null
            : { rider, stageTimeSeconds, photoFinishScore: rider.photoFinishScore, riderId: rider.riderId };
    })
        .filter((entry) => entry != null);
    if (finished.length === 0) {
        return [];
    }
    const winnerTimeSeconds = Math.min(...finished.map((entry) => entry.stageTimeSeconds));
    if (!Number.isFinite(winnerTimeSeconds) || winnerTimeSeconds <= 0) {
        return rankStageResultEntries(finished, bootstrap.stage.profile).map((entry) => entry.rider);
    }
    const timeLimitSeconds = resolveStageTimeLimitSeconds(bootstrap.stage.profile, finished.map((entry) => entry.stageTimeSeconds));
    if (timeLimitSeconds == null) {
        return rankStageResultEntries(finished, bootstrap.stage.profile).map((entry) => entry.rider);
    }
    return rankStageResultEntries(finished.filter((entry) => entry.stageTimeSeconds <= timeLimitSeconds), bootstrap.stage.profile).map((entry) => entry.rider);
}
function buildFinishPointEntries(bootstrap, snapshot) {
    const finishPointValues = resolveFinishPointValues(bootstrap);
    if (finishPointValues.length === 0)
        return [];
    return getClassifiedFinishedRiders(bootstrap, snapshot)
        .map((rider, index) => ({
        riderId: rider.riderId,
        rank: index + 1,
        points: finishPointValues[index] ?? 0,
        pointsKind: 'points',
        crossingTimeSeconds: resolveCommitStageTimeSeconds(bootstrap, rider),
        gapSeconds: null,
    }))
        .filter((entry) => entry.points > 0);
}
function buildFinishTimingEntries(bootstrap, snapshot) {
    const finishedRiders = getClassifiedFinishedRiders(bootstrap, snapshot).slice(0, 20);
    const leaderTimeSeconds = finishedRiders[0] != null ? resolveCommitStageTimeSeconds(bootstrap, finishedRiders[0]) ?? 0 : 0;
    return finishedRiders.map((rider, index) => {
        const stageTimeSeconds = resolveCommitStageTimeSeconds(bootstrap, rider) ?? 0;
        return {
            riderId: rider.riderId,
            rank: index + 1,
            crossingTimeSeconds: stageTimeSeconds,
            gapSeconds: Math.max(0, stageTimeSeconds - leaderTimeSeconds),
            photoFinishScore: rider.photoFinishScore,
        };
    });
}
function resolveFinishWinnerRiderId(bootstrap, snapshot) {
    return getClassifiedFinishedRiders(bootstrap, snapshot)[0]?.riderId ?? null;
}
function buildScoringEvents(bootstrap, markerClassifications, snapshot) {
    const boundaryMarkers = collectStageBoundaryMarkers(bootstrap.stageSummary);
    const lastQuarterStartKm = bootstrap.stageSummary.distanceKm * 0.75;
    const classifiedRiderIds = snapshot.isFinished
        ? new Set(getClassifiedFinishedRiders(bootstrap, snapshot).map((rider) => rider.riderId))
        : null;
    const climbStarts = boundaryMarkers.filter(({ marker }) => marker.type === 'climb_start');
    const climbs = boundaryMarkers
        .filter(({ marker }) => isMountainClassificationMarker(marker))
        .sort((left, right) => left.kmMark - right.kmMark)
        .map((climbTop, index) => {
        const start = [...climbStarts].reverse().find((candidate) => candidate.kmMark <= climbTop.kmMark) ?? null;
        const segment = resolveClimbSegment(bootstrap, climbTop.kmMark);
        const startKm = start?.kmMark ?? segment?.start_km ?? climbTop.kmMark;
        const startElevation = start?.elevation ?? segment?.start_elevation ?? climbTop.elevation;
        const lengthKm = Math.max(0, climbTop.kmMark - startKm);
        const averageGradient = lengthKm > 0
            ? ((climbTop.elevation - startElevation) / (lengthKm * 1000)) * 100
            : segment?.gradient_percent ?? 0;
        const steepestSegment = resolveSteepestClimbSegment(bootstrap, startKm, climbTop.kmMark);
        const classification = markerClassifications.find((entry) => entry.markerKey === climbTop.key) ?? null;
        const pointValues = resolveMountainPointValues(bootstrap, classification?.markerCategory ?? climbTop.marker.cat ?? null);
        const entries = classification ? buildMarkerPointEntries(classification, pointValues, 'mountain', classifiedRiderIds) : [];
        const category = classification?.markerCategory ?? climbTop.marker.cat ?? null;
        return {
            key: climbTop.key,
            title: `${index + 1}. Bergwertung`,
            label: climbTop.label,
            categoryLabel: category ? `Kat. ${category}` : null,
            categoryClassName: resolveCategoryClassName(category),
            kmMark: climbTop.kmMark,
            kmToFinish: Math.max(0, bootstrap.stageSummary.distanceKm - climbTop.kmMark),
            climbLengthKm: lengthKm,
            averageGradient,
            steepestSegmentLengthKm: steepestSegment?.lengthKm ?? null,
            steepestSegmentGradient: steepestSegment?.gradient ?? null,
            highlightMeta: climbTop.kmMark >= lastQuarterStartKm,
            leaderRiderId: entries[0]?.riderId ?? classification?.entries[0]?.riderId ?? null,
            displayBadges: buildScoringBadges(pointValues, 'mountain'),
            entries,
            timingEntries: classification?.entries ?? [],
            accent: 'mountain',
        };
    });
    const sprints = boundaryMarkers
        .filter(({ marker }) => marker.type === 'sprint_intermediate')
        .sort((left, right) => left.kmMark - right.kmMark)
        .map((sprint, index) => {
        const classification = markerClassifications.find((entry) => entry.markerKey === sprint.key) ?? null;
        const pointValues = resolveIntermediateSprintPointValues(bootstrap);
        const entries = classification ? buildMarkerPointEntries(classification, pointValues, 'points', classifiedRiderIds) : [];
        return {
            key: sprint.key,
            title: `${index + 1}. Zwischensprint`,
            label: sprint.label,
            categoryLabel: null,
            categoryClassName: null,
            kmMark: sprint.kmMark,
            kmToFinish: Math.max(0, bootstrap.stageSummary.distanceKm - sprint.kmMark),
            climbLengthKm: null,
            averageGradient: null,
            steepestSegmentLengthKm: null,
            steepestSegmentGradient: null,
            highlightMeta: false,
            leaderRiderId: entries[0]?.riderId ?? classification?.entries[0]?.riderId ?? null,
            displayBadges: buildScoringBadges(pointValues, 'points'),
            entries,
            timingEntries: classification?.entries ?? [],
            accent: 'sprint',
        };
    });
    const finishMarker = resolveFinishMarker(bootstrap);
    const finishEntries = buildFinishPointEntries(bootstrap, snapshot);
    const finishMountainClassification = finishMarker ? markerClassifications.find((entry) => entry.markerKey === finishMarker.key) ?? null : null;
    const finishMountainEntries = finishMountainClassification
        ? buildMarkerPointEntries(finishMountainClassification, resolveMountainPointValues(bootstrap, finishMountainClassification.markerCategory), 'mountain', classifiedRiderIds)
        : [];
    const finishPointValues = resolveFinishPointValues(bootstrap);
    const finishMountainPointValues = finishMountainClassification
        ? resolveMountainPointValues(bootstrap, finishMountainClassification.markerCategory)
        : [];
    const finishTimingEntries = (bootstrap.stage.profile === 'ITT' || bootstrap.stage.profile === 'TTT')
        ? buildFinishTimingEntries(bootstrap, snapshot)
        : finishMountainClassification?.entries ?? [];
    const finishLeaderId = finishEntries[0]?.riderId ?? finishMountainEntries[0]?.riderId ?? resolveFinishWinnerRiderId(bootstrap, snapshot);
    const finishEvent = {
        key: 'finish',
        title: 'Zielsprint',
        label: finishMarker?.label ?? 'Ziel',
        categoryLabel: finishMountainClassification?.markerCategory ? `Kat. ${finishMountainClassification.markerCategory}` : null,
        categoryClassName: resolveCategoryClassName(finishMountainClassification?.markerCategory ?? null),
        kmMark: finishMarker?.kmMark ?? bootstrap.stageSummary.distanceKm,
        kmToFinish: 0,
        climbLengthKm: null,
        averageGradient: null,
        steepestSegmentLengthKm: null,
        steepestSegmentGradient: null,
        highlightMeta: Boolean(finishMountainClassification?.markerCategory),
        leaderRiderId: finishLeaderId,
        displayBadges: [
            ...buildScoringBadges(finishPointValues, 'points'),
            ...buildScoringBadges(finishMountainPointValues, 'mountain'),
        ],
        entries: [...finishEntries, ...finishMountainEntries],
        timingEntries: finishTimingEntries,
        accent: 'finish',
    };
    const regularEvents = [...sprints, ...climbs].sort((left, right) => left.kmMark - right.kmMark || left.title.localeCompare(right.title, 'de'));
    return [...regularEvents, finishEvent].filter((event) => event.entries.length > 0 || event.timingEntries.length > 0 || event.accent !== 'finish' || finishMarker != null || snapshot.isFinished);
}
function renderScoringEventPopover(bootstrap, event) {
    const pointEntryByRiderId = new Map(event.entries.map((entry) => [entry.riderId, entry]));
    const maxRows = (bootstrap.stage.profile === 'ITT' || bootstrap.stage.profile === 'TTT') && event.key === 'finish' ? 20 : 15;
    const timingRows = event.timingEntries.length > 0
        ? [...event.timingEntries]
            .sort((left, right) => left.rank - right.rank || left.crossingTimeSeconds - right.crossingTimeSeconds || left.riderId - right.riderId)
            .slice(0, maxRows)
        : event.entries.slice(0, maxRows).map((entry) => ({
            riderId: entry.riderId,
            rank: entry.rank,
            crossingTimeSeconds: entry.crossingTimeSeconds ?? 0,
            gapSeconds: entry.gapSeconds ?? 0,
            photoFinishScore: 0,
            pointsAwarded: entry.points,
        })).sort((left, right) => left.rank - right.rank || left.crossingTimeSeconds - right.crossingTimeSeconds || left.riderId - right.riderId);
    if (timingRows.length === 0) {
        return '<div class="race-sim-stage-points-popover-empty">Noch keine Punkte vergeben.</div>';
    }
    return `
    <div class="race-sim-stage-points-popover-list">
      ${timingRows.map((entry) => {
        const team = resolveRiderTeam(bootstrap, entry.riderId);
        const pointEntry = pointEntryByRiderId.get(entry.riderId) ?? null;
        return `
          <div class="race-sim-stage-points-popover-row">
            <strong>${entry.rank}.</strong>
            ${renderJersey(team.teamId, team.teamName)}
            ${renderRiderGroupButton(entry.riderId, resolveRiderName(bootstrap, entry.riderId), 'race-sim-stage-scoring-name')}
            <strong>${entry.rank === 1 ? esc(formatClock(entry.crossingTimeSeconds)) : esc(formatTimeGap(entry.gapSeconds))}</strong>
            ${pointEntry ? `<strong class="race-sim-stage-points-value-${pointEntry.pointsKind}">${pointEntry.points}</strong>` : '<strong>—</strong>'}
          </div>`;
    }).join('')}
    </div>`;
}
function resolveStandingPoints(standings, riderId) {
    return standings?.find((standing) => standing.riderId === riderId)?.points ?? 0;
}
function resolveBestStandingRiderInGroup(standings, groupRiderIds) {
    return standings
        .filter((standing) => standing.riderId != null && groupRiderIds.has(standing.riderId))
        .sort((left, right) => left.rank - right.rank || left.riderId - right.riderId)[0]?.riderId ?? null;
}
function replaceOrAppendGroupSpecialRider(displayRiders, rider, slotIndex) {
    if (!rider || displayRiders.some((entry) => entry.riderId === rider.riderId)) {
        return;
    }
    if (displayRiders.length < 25) {
        displayRiders.push(rider);
        return;
    }
    displayRiders[slotIndex] = rider;
}
function resolveGroupDisplayRiders(group, snapshot, gcByRiderId, livePointsStandings, liveMountainStandings) {
    const groupRiderIds = new Set(group.riderIds);
    const riderById = new Map(snapshot.riders.map((rider) => [rider.riderId, rider]));
    const ordered = group.riderIds
        .map((riderId) => riderById.get(riderId) ?? null)
        .filter((rider) => rider != null)
        .sort((left, right) => ((gcByRiderId.get(left.riderId)?.rank ?? Number.MAX_SAFE_INTEGER) - (gcByRiderId.get(right.riderId)?.rank ?? Number.MAX_SAFE_INTEGER)
        || left.riderName.localeCompare(right.riderName, 'de')
        || left.riderId - right.riderId));
    const displayRiders = ordered.slice(0, 25);
    const bestPointsRider = riderById.get(resolveBestStandingRiderInGroup(livePointsStandings, groupRiderIds) ?? -1) ?? null;
    const bestMountainRider = riderById.get(resolveBestStandingRiderInGroup(liveMountainStandings, groupRiderIds) ?? -1) ?? null;
    const missingPoints = bestPointsRider != null && !displayRiders.some((rider) => rider.riderId === bestPointsRider.riderId);
    const missingMountain = bestMountainRider != null && !displayRiders.some((rider) => rider.riderId === bestMountainRider.riderId);
    if (displayRiders.length >= 25 && missingPoints && missingMountain && bestPointsRider.riderId !== bestMountainRider.riderId) {
        replaceOrAppendGroupSpecialRider(displayRiders, bestPointsRider, 23);
        replaceOrAppendGroupSpecialRider(displayRiders, bestMountainRider, 24);
        return displayRiders;
    }
    replaceOrAppendGroupSpecialRider(displayRiders, bestPointsRider, 24);
    replaceOrAppendGroupSpecialRider(displayRiders, bestMountainRider, 24);
    return displayRiders;
}
function resolveGroupLeaderRoles(riderId, leaders) {
    const roles = [];
    if (leaders.gcLeaderRiderId === riderId)
        roles.push('gc');
    if (leaders.mountainLeaderRiderId === riderId)
        roles.push('mountain');
    if (leaders.pointsLeaderRiderId === riderId)
        roles.push('points');
    if (leaders.youthLeaderRiderId === riderId)
        roles.push('youth');
    return roles;
}
function resolveGroupPositionClassName(roles) {
    if (roles.includes('gc'))
        return ' is-gc-leader';
    if (roles.includes('mountain'))
        return ' is-mountain-leader';
    if (roles.includes('points'))
        return ' is-points-leader';
    if (roles.includes('youth'))
        return ' is-youth-leader';
    return '';
}
function formatGroupGap(meters) {
    return meters == null ? '—' : `${Math.round(meters)} m`;
}
function formatSignedGroupGap(meters, sign) {
    return meters == null ? '—' : `${sign}${Math.round(meters)} m`;
}
function formatLeaderGroupGap(group, snapshot) {
    const groupFrontDistanceMeters = snapshot.riders
        .filter((rider) => group.riderIds.includes(rider.riderId))
        .reduce((frontDistanceMeters, rider) => Math.max(frontDistanceMeters, rider.distanceCoveredMeters), 0);
    const gapToStageLeaderMeters = Math.max(0, snapshot.leaderDistanceMeters - groupFrontDistanceMeters);
    return gapToStageLeaderMeters > 0 ? `-${Math.round(gapToStageLeaderMeters)} m` : '—';
}
function renderSelectedGroupBox(bootstrap, snapshot, groups, selectedGroupLabel, livePointsStandings, liveMountainStandings, events) {
    if (groups.length === 0 || bootstrap.stage.profile === 'ITT' || bootstrap.stage.profile === 'TTT') {
        return '';
    }
    const resolvedLabel = resolveDefaultRaceGroupLabel(groups, selectedGroupLabel);
    const selectedGroup = groups.find((group) => group.label === resolvedLabel) ?? groups[0];
    const gcByRiderId = new Map(bootstrap.gcStandings.map((standing) => [standing.riderId, standing]));
    const stagePointsByRiderId = resolveStagePointTotalsByRiderId(events);
    const displayRiders = resolveGroupDisplayRiders(selectedGroup, snapshot, gcByRiderId, livePointsStandings, liveMountainStandings);
    return `
    <section class="race-sim-classification-box race-sim-classification-box-group">
      <h4>
        <span>Gruppe ${esc(selectedGroup.label)} <span class="race-sim-group-count">(${selectedGroup.riderCount})</span></span>
        <span class="race-sim-group-nav">
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="prev" aria-label="Vorherige Gruppe">‹</button>
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="next" aria-label="Nächste Gruppe">›</button>
        </span>
      </h4>
      <div class="race-sim-group-gap-row">
        <span>Vorne ${esc(formatSignedGroupGap(selectedGroup.previousGapMeters, '-'))}</span>
        <span>Leader ${esc(formatLeaderGroupGap(selectedGroup, snapshot))}</span>
        <span>Hinten ${esc(formatSignedGroupGap(selectedGroup.nextGapMeters, '+'))}</span>
      </div>
      <div class="race-sim-group-grid">
        ${displayRiders.map((rider, index) => {
        const standing = gcByRiderId.get(rider.riderId) ?? null;
        const team = resolveRiderTeam(bootstrap, rider.riderId);
        const stageTotals = stagePointsByRiderId.get(rider.riderId) ?? { points: 0, mountain: 0 };
        const sprintTotal = resolveStandingPoints(livePointsStandings, rider.riderId);
        const mountainTotal = resolveStandingPoints(liveMountainStandings, rider.riderId);
        const roles = resolveGroupLeaderRoles(rider.riderId, bootstrap.classificationLeaders);
        const roleTitle = roles.length > 0 ? roles.map((role) => ({ gc: 'GC-Leader', mountain: 'Bergwertungs-Leader', points: 'Punktewertungs-Leader', youth: 'Nachwuchs-Leader' }[role])).join(', ') : '';
        return `
            <article class="race-sim-group-row">
              <strong class="race-sim-group-position${resolveGroupPositionClassName(roles)}" title="${esc(roleTitle)}">${index + 1}.</strong>
              ${renderJersey(team.teamId, team.teamName)}
              <span class="race-sim-classification-main">
                ${renderRiderGroupButton(rider.riderId, rider.riderName, `race-sim-group-rider-name${rider.isBreakaway ? ' is-breakaway' : ''}`)}
                <strong class="race-sim-group-detail">GC ${standing ? standing.rank : '—'} · ${esc(standing ? formatGcGap(standing.gapSeconds) : '—')} · ${esc(rider.gapToLeaderMeters > 0 ? `+${Math.round(rider.gapToLeaderMeters)} m` : '—')}</strong>
              </span>
              <span class="race-sim-breakaway-points-panel">
                <span class="race-sim-breakaway-badges">
                  <span class="race-sim-stage-points-header-badge is-points">Sprint ${sprintTotal}</span>
                  <span class="race-sim-stage-points-header-badge is-mountain">Berg ${mountainTotal}</span>
                </span>
                <span class="race-sim-breakaway-stage-gains">
                  <span class="race-sim-breakaway-stage-gain">${stageTotals.points > 0 ? `▲ +${stageTotals.points}` : ' '}</span>
                  <span class="race-sim-breakaway-stage-gain">${stageTotals.mountain > 0 ? `▲ +${stageTotals.mountain}` : ' '}</span>
                </span>
              </span>
            </article>`;
    }).join('')}
      </div>
    </section>`;
}
export function renderSelectedRaceGroupBox(container, bootstrap, snapshot, selectedGroupLabel) {
    const scoringEvents = buildScoringEvents(bootstrap, snapshot.markerClassifications, snapshot);
    const stagePointsByRiderId = resolveStagePointTotalsByRiderId(scoringEvents);
    const livePointsStandings = buildLiveClassificationStandings(bootstrap, bootstrap.pointsStandings, stagePointsByRiderId, 'points');
    const liveMountainStandings = buildLiveClassificationStandings(bootstrap, bootstrap.mountainStandings, stagePointsByRiderId, 'mountain');
    const groups = buildNamedRaceGroups(mergeDisplayedClusters(snapshot.clusters));
    container.innerHTML = renderSelectedGroupBox(bootstrap, snapshot, groups, selectedGroupLabel, livePointsStandings, liveMountainStandings, scoringEvents);
}
function renderPointBadges(entries) {
    if (entries.length === 0)
        return '';
    return entries.map((entry) => `<span class="race-sim-stage-points-badge race-sim-stage-points-badge-${entry.pointsKind}">${entry.points}</span>`).join('');
}
function resolveStageMaxPointsTotals(bootstrap) {
    const boundaryMarkers = collectStageBoundaryMarkers(bootstrap.stageSummary);
    const sprintTop = resolveIntermediateSprintPointValues(bootstrap)[0] ?? 0;
    const finishTop = resolveFinishPointValues(bootstrap)[0] ?? 0;
    const mountain = boundaryMarkers
        .filter(({ marker }) => isMountainClassificationMarker(marker))
        .reduce((sum, { marker }) => sum + (resolveMountainPointValues(bootstrap, marker.cat ?? null)[0] ?? 0), 0);
    return {
        points: (boundaryMarkers.filter(({ marker }) => marker.type === 'sprint_intermediate').length * sprintTop) + finishTop,
        mountain,
    };
}
function renderStageScoringSummaryBadges(bootstrap) {
    const totals = resolveStageMaxPointsTotals(bootstrap);
    return `
    <span class="race-sim-stage-points-header-badges">
      <span class="race-sim-stage-points-header-badge is-points">Sprint ${totals.points}</span>
      <span class="race-sim-stage-points-header-badge is-mountain">Berg ${totals.mountain}</span>
    </span>`;
}
function renderScoringEventMeta(event) {
    const badge = resolveScoringEventBadge(event);
    const metaPills = [
        `<span class="race-sim-stage-points-meta-pill">${esc(formatKm(event.kmMark))}</span>`,
        `<span class="race-sim-stage-points-meta-pill">${esc(`${formatKm(event.kmToFinish)} bis Ziel`)}</span>`,
        event.climbLengthKm != null ? `<span class="race-sim-stage-points-meta-pill">${esc(`Länge ${formatKm(event.climbLengthKm)}`)}</span>` : '',
        event.averageGradient != null ? `<span class="race-sim-stage-points-meta-pill">${esc(`Ø ${formatGradient(event.averageGradient)}`)}</span>` : '',
        event.steepestSegmentLengthKm != null && event.steepestSegmentGradient != null ? `<span class="race-sim-stage-points-meta-pill is-steepest">${esc(`Steilstes ${formatKm(event.steepestSegmentLengthKm)}`)}</span>` : '',
        event.steepestSegmentLengthKm != null && event.steepestSegmentGradient != null ? `<span class="race-sim-stage-points-meta-pill is-steepest">${esc(formatGradient(event.steepestSegmentGradient))}</span>` : '',
    ].filter((entry) => entry.length > 0);
    return `
    <span class="race-sim-stage-points-title-line">
      <strong>${esc(event.title)}</strong>
      ${badge ? `<span class="race-sim-stage-points-category-badge ${badge.className}">${esc(badge.label)}</span>` : ''}
      <span class="race-sim-stage-points-title-name" title="${esc(event.label)}">${esc(event.label)}</span>
    </span>
    <span class="race-sim-stage-points-meta${event.highlightMeta ? ' is-final-quarter' : ''}">
      ${metaPills.map((entry, index) => `${index > 0 ? '<span class="race-sim-stage-points-meta-separator">•</span>' : ''}${entry}`).join('')}
    </span>`;
}
function renderStageScoringBox(bootstrap, markerClassifications, snapshot, scoringEvents = null) {
    const events = scoringEvents ?? buildScoringEvents(bootstrap, markerClassifications, snapshot);
    if (events.length === 0) {
        return `
      <section class="race-sim-mountain-primes-box">
        <h4>Etappenwertungen${renderStageScoringSummaryBadges(bootstrap)}</h4>
        <div class="race-sim-classification-empty">Keine Sprint- oder Bergwertungen auf dieser Etappe.</div>
      </section>`;
    }
    return `
    <section class="race-sim-mountain-primes-box">
      <h4>Etappenwertungen${renderStageScoringSummaryBadges(bootstrap)}</h4>
      <div class="race-sim-mountain-primes-list">
        ${events.map((event) => {
        const leaderTeam = event.leaderRiderId != null ? resolveRiderTeam(bootstrap, event.leaderRiderId) : { teamId: null, teamName: null };
        const leaderName = event.leaderRiderId != null ? resolveRiderName(bootstrap, event.leaderRiderId) : 'Noch offen';
        return `
          <details class="race-sim-mountain-prime-row race-sim-stage-points-event race-sim-stage-points-event-${event.accent}">
            <summary>
            <span class="race-sim-mountain-prime-title">
              ${renderScoringEventMeta(event)}
            </span>
            <span class="race-sim-stage-points-awards">
              ${renderPointBadges(event.displayBadges)}
            </span>
            <span class="race-sim-stage-points-leader">
              ${renderJersey(leaderTeam.teamId, leaderTeam.teamName)}
              ${event.leaderRiderId != null ? renderRiderGroupButton(event.leaderRiderId, leaderName, 'race-sim-stage-scoring-leader-name') : `<strong>${esc(leaderName)}</strong>`}
            </span>
            </summary>
            <div class="race-sim-stage-points-popover">
              ${renderScoringEventPopover(bootstrap, event)}
            </div>
          </details>`;
    }).join('')}
      </div>
    </section>`;
}
export function renderStageFavorites(container, favorites, bootstrap, markerClassifications, snapshot, collapsedSectionKeys = new Set()) {
    const scoringEvents = buildScoringEvents(bootstrap, markerClassifications, snapshot);
    const stagePointsByRiderId = resolveStagePointTotalsByRiderId(scoringEvents);
    const livePointsStandings = buildLiveClassificationStandings(bootstrap, bootstrap.pointsStandings, stagePointsByRiderId, 'points');
    const liveMountainStandings = buildLiveClassificationStandings(bootstrap, bootstrap.mountainStandings, stagePointsByRiderId, 'mountain');
    const gcDistanceGapsByRiderId = buildRelativeDistanceGapsByRiderId(snapshot, bootstrap.gcStandings[0]?.riderId ?? null);
    const youthDistanceGapsByRiderId = buildRelativeDistanceGapsByRiderId(snapshot, bootstrap.youthStandings[0]?.riderId ?? null);
    const isSectionOpen = (sectionKey) => !collapsedSectionKeys.has(sectionKey);
    container.innerHTML = `
    ${renderCollapsibleOverviewBox('Stage Favorites', renderStageFavoriteGrid(favorites, bootstrap.gcStandings, bootstrap.classificationLeaders), 'race-sim-favorites-section', 'favorites', isSectionOpen('favorites'))}
    <section class="race-sim-classifications-section">
      ${renderCollapsibleOverviewBox('GC', renderClassificationBox('GC', 'gc', bootstrap, bootstrap.gcStandings, (standing) => esc(`GC ${standing.rank} · ${formatGcGap(standing.gapSeconds)}`), { limit: 20, distanceGapsByRiderId: gcDistanceGapsByRiderId }), 'race-sim-overview-classification race-sim-overview-gc', 'gc', isSectionOpen('gc'))}
      ${renderCollapsibleOverviewBox('Punktewertung', renderClassificationBox('Punktewertung', 'points', bootstrap, livePointsStandings, renderLivePointsDetail), 'race-sim-overview-classification race-sim-overview-points', 'points', isSectionOpen('points'))}
      ${renderCollapsibleOverviewBox('Bergwertung', renderClassificationBox('Bergwertung', 'mountain', bootstrap, liveMountainStandings, renderLivePointsDetail), 'race-sim-overview-classification race-sim-overview-mountain', 'mountain', isSectionOpen('mountain'))}
      ${renderCollapsibleOverviewBox('Nachwuchsfahrerwertung', renderClassificationBox('Nachwuchsfahrerwertung', 'youth', bootstrap, bootstrap.youthStandings, (standing) => esc(`${standing.rank}. · ${formatGcGap(standing.gapSeconds)}`), { distanceGapsByRiderId: youthDistanceGapsByRiderId, distanceGapClassName: 'is-compact' }), 'race-sim-overview-classification race-sim-overview-youth', 'youth', isSectionOpen('youth'))}
    </section>
    ${renderCollapsibleOverviewBox('Etappenwertungen', renderStageScoringBox(bootstrap, markerClassifications, snapshot, scoringEvents), 'race-sim-overview-stage-scoring', 'stageScoring', isSectionOpen('stageScoring'))}
  `;
}
