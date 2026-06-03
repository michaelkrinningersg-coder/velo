"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteImporter = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const MIN_SEGMENT_KM = 0.2;
const SPRINT_CUT_KM = 0.3;
const DOUGLAS_PEUCKER_EPSILON = 9;
const IMPORT_ELEVATION_SMOOTHING_RADIUS = 1;
const CLIMB_MIN_GAIN_METERS = 100;
const CLIMB_MIN_AVG_GRADIENT = 3;
const MEDIUM_MOUNTAIN_MIN_GAIN_METERS = 200;
const MOUNTAIN_MIN_GAIN_METERS = 600;
const MOUNTAIN_MIN_TOP_ELEVATION_METERS = 850;
const CLIMB_BREAK_DESCENT_METERS = 50;
const IMPORT_SEGMENT_MERGE_MAX_GRADIENT_DIFF = 2.5;
const SEGMENT_MIN_HILL_GAIN_METERS = 15;
const STAGES_METADATA_HEADER = 'id,race_id,stage_number,date,profile,start_elevation,details_csv_file,final_spread_start_percent,final_push_start_percent,final_spread_difficulty_multiplier,crash_incident_multiplier,mechanical_incident_multiplier';
const STAGE_DETAILS_HEADER = 'length_km,gradient_percent,terrain,tech_level,wind_exp,marker_type,marker_name,marker_cat,end_marker_type,end_marker_name,end_marker_cat';
function round2(value) {
    return Math.round(value * 100) / 100;
}
function round1(value) {
    return Math.round(value * 10) / 10;
}
function round3(value) {
    return Math.round(value * 1000) / 1000;
}
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
function markerSortValue(type) {
    return ['start', 'climb_start', 'climb_top', 'sprint_intermediate', 'finish_flat', 'finish_TT', 'finish_hill', 'finish_mountain'].indexOf(type);
}
function isFinishMarkerType(type) {
    return ['finish_flat', 'finish_TT', 'finish_hill', 'finish_mountain'].includes(type);
}
function normalizeMarkers(markers) {
    return [...markers]
        .map((marker) => ({
        type: marker.type,
        name: marker.name?.trim() || null,
        cat: marker.cat,
    }))
        .sort((left, right) => markerSortValue(left.type) - markerSortValue(right.type));
}
function ensureMarker(markers, type, fallbackName) {
    const filtered = markers.filter((marker) => marker.type !== type);
    const existing = markers.find((marker) => marker.type === type);
    return normalizeMarkers([...filtered, { type, name: existing?.name ?? fallbackName, cat: null }]);
}
function ensureFinishMarker(markers, fallbackName) {
    const existingFinish = markers.find((marker) => isFinishMarkerType(marker.type));
    const filtered = markers.filter((marker) => !isFinishMarkerType(marker.type));
    return normalizeMarkers([...filtered, { type: existingFinish?.type ?? 'finish_flat', name: existingFinish?.name ?? fallbackName, cat: null }]);
}
function joinMarkerValues(markers, key) {
    return markers.map((marker) => {
        const value = marker[key];
        return value == null ? 'null' : String(value);
    }).join('|');
}
function escapeCsv(value) {
    const text = String(value);
    if (!/[",\n]/.test(text))
        return text;
    return `"${text.replace(/"/g, '""')}"`;
}
function parseCsvRows(content) {
    const rows = [];
    let row = [];
    let value = '';
    let quoted = false;
    for (let index = 0; index < content.length; index += 1) {
        const char = content[index];
        const next = content[index + 1];
        if (quoted) {
            if (char === '"' && next === '"') {
                value += '"';
                index += 1;
            }
            else if (char === '"') {
                quoted = false;
            }
            else {
                value += char;
            }
            continue;
        }
        if (char === '"') {
            quoted = true;
            continue;
        }
        if (char === ',') {
            row.push(value);
            value = '';
            continue;
        }
        if (char === '\n') {
            row.push(value);
            if (row.some((cell) => cell.trim().length > 0)) {
                rows.push(row);
            }
            row = [];
            value = '';
            continue;
        }
        if (char !== '\r') {
            value += char;
        }
    }
    row.push(value);
    if (row.some((cell) => cell.trim().length > 0)) {
        rows.push(row);
    }
    if (quoted) {
        throw new Error('CSV enthält ein nicht geschlossenes Anführungszeichen.');
    }
    return rows;
}
function parseRequiredInteger(value, field) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isInteger(parsed)) {
        throw new Error(`Ungültiger Ganzzahlwert für ${field}: ${value}`);
    }
    return parsed;
}
function parseRequiredNumber(value, field) {
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) {
        throw new Error(`Ungültiger Zahlenwert für ${field}: ${value}`);
    }
    return parsed;
}
function parseNullableCsvValue(value) {
    const normalized = (value ?? '').trim();
    return normalized.length === 0 || normalized.toLowerCase() === 'null' ? null : normalized;
}
function isValidStageProfile(value) {
    return ['Flat', 'Rolling', 'Hilly', 'Hilly_Difficult', 'Medium_Mountain', 'Mountain', 'High_Mountain', 'ITT', 'TTT', 'Cobble', 'Cobble_Hill'].includes(value);
}
function isValidStageTerrain(value) {
    return ['Flat', 'Hill', 'Medium_Mountain', 'Mountain', 'High_Mountain', 'Cobble', 'Cobble_Hill', 'Abfahrt', 'Sprint'].includes(value);
}
function isValidStageMarkerType(value) {
    return ['start', 'climb_start', 'climb_top', 'sprint_intermediate', 'finish_flat', 'finish_TT', 'finish_hill', 'finish_mountain'].includes(value);
}
function isValidStageMarkerCategory(value) {
    return ['HC', '1', '2', '3', '4', 'Sprint'].includes(value);
}
function parseStageMarkers(typesValue, namesValue, categoriesValue, rowLabel) {
    const types = typesValue.split('|').map((value) => value.trim()).filter((value) => value.length > 0);
    if (types.length === 0)
        return [];
    const names = namesValue.split('|');
    const categories = categoriesValue.split('|');
    return types.map((type, index) => {
        if (!isValidStageMarkerType(type)) {
            throw new Error(`${rowLabel}: Ungültiger Marker-Typ ${type}.`);
        }
        const rawCategory = parseNullableCsvValue(categories[index]);
        if (rawCategory != null && !isValidStageMarkerCategory(rawCategory)) {
            throw new Error(`${rowLabel}: Ungültige Marker-Kategorie ${rawCategory}.`);
        }
        return {
            type,
            name: parseNullableCsvValue(names[index]),
            cat: rawCategory,
        };
    });
}
function safeStageDetailsFileName(fileName) {
    const trimmed = fileName.trim();
    if (!/^[A-Za-z0-9_.-]+\.csv$/.test(trimmed) || trimmed.includes('..') || trimmed.includes('/') || trimmed.includes('\\')) {
        throw new Error('details_csv_file muss ein sicherer CSV-Dateiname ohne Pfad sein.');
    }
    return trimmed;
}
function resolveDataRoot() {
    const backendRelative = (0, path_1.resolve)(process.cwd(), '..', 'data');
    if ((0, fs_1.existsSync)(backendRelative))
        return backendRelative;
    return (0, path_1.resolve)(process.cwd(), 'data');
}
function stripNamespaces(xml) {
    return xml.replace(/(<\/?)([A-Za-z0-9_.-]+:)/g, '$1');
}
function matchTag(block, tag) {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    return block.match(regex)?.[1]?.trim() ?? null;
}
function matchAllBlocks(xml, tag) {
    const regex = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
    return Array.from(xml.matchAll(regex), (match) => match[0]);
}
function parseNumeric(value, field) {
    if (value == null || value.trim().length === 0) {
        throw new Error(`Pflichtfeld ${field} fehlt im Streckenformat.`);
    }
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) {
        throw new Error(`Ungültiger Zahlenwert für ${field}: ${value}`);
    }
    return parsed;
}
function haversineKm(lat1, lon1, lat2, lon2) {
    const radiusKm = 6371;
    const toRad = (value) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2
        + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function parseGpx(xml) {
    const normalizedXml = stripNamespaces(xml);
    const pointRegex = /<(trkpt|rtept)\b[^>]*lat="([^"]+)"[^>]*lon="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/gi;
    const points = Array.from(normalizedXml.matchAll(pointRegex), (match) => ({
        lat: parseNumeric(match[2] ?? null, 'lat'),
        lon: parseNumeric(match[3] ?? null, 'lon'),
        elevation: parseNumeric(matchTag(match[4] ?? '', 'ele') ?? '0', 'ele'),
    }));
    const routeName = matchTag(normalizedXml, 'name') ?? 'GPX-Import';
    return { routeName, points };
}
function parseTcx(xml) {
    const normalizedXml = stripNamespaces(xml);
    const blocks = matchAllBlocks(normalizedXml, 'Trackpoint');
    const points = blocks.map((block) => {
        const position = matchTag(block, 'Position') ?? '';
        const distanceMeters = matchTag(block, 'DistanceMeters');
        return {
            lat: parseNumeric(matchTag(position, 'LatitudeDegrees'), 'LatitudeDegrees'),
            lon: parseNumeric(matchTag(position, 'LongitudeDegrees'), 'LongitudeDegrees'),
            elevation: parseNumeric(matchTag(block, 'AltitudeMeters') ?? '0', 'AltitudeMeters'),
            distanceKm: distanceMeters != null ? parseNumeric(distanceMeters, 'DistanceMeters') / 1000 : undefined,
        };
    });
    const routeName = matchTag(normalizedXml, 'Id') ?? matchTag(normalizedXml, 'Name') ?? 'TCX-Import';
    return { routeName, points };
}
function buildProfile(points) {
    if (points.length < 2) {
        throw new Error('Die Datei enthält zu wenige Trackpunkte. Mindestens 2 Punkte sind erforderlich.');
    }
    let cumulativeDistanceKm = 0;
    return points.map((point, index) => {
        if (index === 0) {
            return { distanceKm: 0, elevation: point.elevation };
        }
        const previous = points[index - 1];
        const segmentDistance = point.distanceKm != null && previous.distanceKm != null
            ? Math.max(0, point.distanceKm - previous.distanceKm)
            : haversineKm(previous.lat, previous.lon, point.lat, point.lon);
        cumulativeDistanceKm += segmentDistance;
        return { distanceKm: cumulativeDistanceKm, elevation: point.elevation };
    });
}
function smoothElevationProfile(points, radius) {
    if (points.length <= 2 || radius <= 0) {
        return [...points];
    }
    return points.map((point, index) => {
        let weightedElevationSum = 0;
        let totalWeight = 0;
        for (let offset = -radius; offset <= radius; offset += 1) {
            const neighborIndex = index + offset;
            if (neighborIndex < 0 || neighborIndex >= points.length) {
                continue;
            }
            const weight = radius + 1 - Math.abs(offset);
            weightedElevationSum += points[neighborIndex].elevation * weight;
            totalWeight += weight;
        }
        return {
            distanceKm: point.distanceKm,
            elevation: weightedElevationSum / totalWeight,
        };
    });
}
function perpendicularDistance(point, start, end) {
    const startX = start.distanceKm * 1000;
    const startY = start.elevation;
    const endX = end.distanceKm * 1000;
    const endY = end.elevation;
    const pointX = point.distanceKm * 1000;
    const pointY = point.elevation;
    const denominator = Math.hypot(endX - startX, endY - startY);
    if (denominator === 0) {
        return Math.hypot(pointX - startX, pointY - startY);
    }
    return Math.abs((endY - startY) * pointX - (endX - startX) * pointY + endX * startY - endY * startX) / denominator;
}
function simplifyDouglasPeucker(points, epsilon) {
    if (points.length <= 2)
        return points;
    let maxDistance = 0;
    let splitIndex = 0;
    for (let index = 1; index < points.length - 1; index += 1) {
        const distance = perpendicularDistance(points[index], points[0], points[points.length - 1]);
        if (distance > maxDistance) {
            maxDistance = distance;
            splitIndex = index;
        }
    }
    if (maxDistance <= epsilon) {
        return [points[0], points[points.length - 1]];
    }
    const left = simplifyDouglasPeucker(points.slice(0, splitIndex + 1), epsilon);
    const right = simplifyDouglasPeucker(points.slice(splitIndex), epsilon);
    return [...left.slice(0, -1), ...right];
}
function enforceMinimumSegmentLength(points, minSegmentKm) {
    if (points.length <= 2)
        return points;
    const kept = [points[0]];
    for (let index = 1; index < points.length - 1; index += 1) {
        const current = points[index];
        const lastKept = kept[kept.length - 1];
        if (current.distanceKm - lastKept.distanceKm >= minSegmentKm) {
            kept.push(current);
        }
    }
    const finalPoint = points[points.length - 1];
    if (finalPoint.distanceKm > kept[kept.length - 1].distanceKm) {
        kept.push(finalPoint);
    }
    if (kept.length >= 2) {
        const penultimate = kept[kept.length - 2];
        if (finalPoint.distanceKm - penultimate.distanceKm < minSegmentKm && kept.length > 2) {
            kept.splice(kept.length - 2, 1);
        }
    }
    return kept;
}
function calculateElevationGain(points) {
    let gain = 0;
    for (let index = 1; index < points.length; index += 1) {
        gain += Math.max(0, points[index].elevation - points[index - 1].elevation);
    }
    return Math.round(gain);
}
function classifyClimb(distanceKm, gainMeters, avgGradient) {
    const score = distanceKm * avgGradient * 8 + gainMeters / 12;
    if (score >= 95)
        return 'HC';
    if (score >= 68)
        return '1';
    if (score >= 46)
        return '2';
    if (score >= 28)
        return '3';
    return '4';
}
function detectClimbs(points) {
    const climbs = [];
    let startIndex = null;
    let topIndex = null;
    let descentMeters = 0;
    const commitClimb = (resolvedTopIndex) => {
        if (startIndex == null || resolvedTopIndex == null || resolvedTopIndex <= startIndex) {
            startIndex = null;
            topIndex = null;
            descentMeters = 0;
            return;
        }
        const startPoint = points[startIndex];
        const endPoint = points[resolvedTopIndex];
        const distanceKm = endPoint.distanceKm - startPoint.distanceKm;
        const netGainMeters = Math.max(0, endPoint.elevation - startPoint.elevation);
        const avgGradient = distanceKm > 0 ? netGainMeters / (distanceKm * 10) : 0;
        if (netGainMeters >= CLIMB_MIN_GAIN_METERS && avgGradient >= CLIMB_MIN_AVG_GRADIENT) {
            climbs.push({
                startKm: round2(startPoint.distanceKm),
                endKm: round2(endPoint.distanceKm),
                distanceKm: round2(distanceKm),
                gainMeters: Math.round(netGainMeters),
                avgGradient: round1(avgGradient),
                category: classifyClimb(distanceKm, netGainMeters, avgGradient),
            });
        }
        startIndex = null;
        topIndex = null;
        descentMeters = 0;
    };
    for (let index = 1; index < points.length; index += 1) {
        const previous = points[index - 1];
        const current = points[index];
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
            if (topIndex == null || current.elevation >= points[topIndex].elevation) {
                topIndex = index;
            }
            descentMeters = 0;
            continue;
        }
        descentMeters += Math.abs(deltaElevation);
        if (descentMeters >= CLIMB_BREAK_DESCENT_METERS) {
            commitClimb(topIndex);
        }
    }
    commitClimb(topIndex);
    return climbs;
}
function mergeImportedSegments(segments) {
    if (segments.length <= 1) {
        return segments;
    }
    let merged = [...segments];
    while (true) {
        const candidates = merged
            .slice(0, -1)
            .map((left, index) => {
            const right = merged[index + 1];
            const gradientDiff = Math.abs(left.gradientPercent - right.gradientPercent);
            return {
                index,
                gradientDiff,
                priority: Math.max(left.gradientPercent, right.gradientPercent),
            };
        })
            .filter((candidate) => candidate.gradientDiff <= IMPORT_SEGMENT_MERGE_MAX_GRADIENT_DIFF)
            .sort((left, right) => (right.priority - left.priority
            || left.gradientDiff - right.gradientDiff
            || left.index - right.index));
        if (candidates.length === 0) {
            return merged;
        }
        const selectedIndexes = new Set();
        for (const candidate of candidates) {
            if (selectedIndexes.has(candidate.index) || selectedIndexes.has(candidate.index - 1) || selectedIndexes.has(candidate.index + 1)) {
                continue;
            }
            selectedIndexes.add(candidate.index);
        }
        if (selectedIndexes.size === 0) {
            return merged;
        }
        const nextMerged = [];
        for (let index = 0; index < merged.length; index += 1) {
            if (!selectedIndexes.has(index)) {
                nextMerged.push(merged[index]);
                continue;
            }
            const left = merged[index];
            const right = merged[index + 1];
            const mergedLengthKm = round2(left.lengthKm + right.lengthKm);
            const weightedGradient = mergedLengthKm > 0
                ? round3(((left.gradientPercent * left.lengthKm) + (right.gradientPercent * right.lengthKm)) / mergedLengthKm)
                : 0;
            nextMerged.push({
                startElevation: left.startElevation,
                lengthKm: mergedLengthKm,
                gradientPercent: weightedGradient,
                terrain: left.terrain,
                techLevel: Math.round(((left.techLevel * left.lengthKm) + (right.techLevel * right.lengthKm)) / (left.lengthKm + right.lengthKm)),
                windExp: Math.round(((left.windExp * left.lengthKm) + (right.windExp * right.lengthKm)) / (left.lengthKm + right.lengthKm)),
                markers: left.markers,
                endMarkers: right.endMarkers,
            });
            index += 1;
        }
        merged = nextMerged;
    }
}
function buildSegmentPositions(segments) {
    let startKm = 0;
    return segments.map((segment, index) => {
        const currentStartKm = startKm;
        const endKm = round2(currentStartKm + segment.lengthKm);
        startKm = endKm;
        return { index, startKm: currentStartKm, endKm };
    });
}
function findNearestSegmentStart(positions, targetKm) {
    return positions.reduce((best, position) => {
        if (!best)
            return position;
        return Math.abs(position.startKm - targetKm) < Math.abs(best.startKm - targetKm) ? position : best;
    }, null);
}
function findNearestSegmentEnd(positions, targetKm) {
    return positions.reduce((best, position) => {
        if (!best)
            return position;
        return Math.abs(position.endKm - targetKm) < Math.abs(best.endKm - targetKm) ? position : best;
    }, null);
}
function findClimbForSegment(position, climbs) {
    const segmentMidKm = (position.startKm + position.endKm) / 2;
    return climbs.find((climb) => segmentMidKm >= climb.startKm && segmentMidKm <= climb.endKm) ?? null;
}
function resolveClimbTopElevation(climb, positions, segments) {
    const topPosition = findNearestSegmentEnd(positions, climb.endKm);
    if (!topPosition) {
        return 0;
    }
    const segment = segments[topPosition.index];
    return Math.round(segment.startElevation + ((segment.lengthKm * 1000) * (segment.gradientPercent / 100)));
}
function resolveSegmentGainMeters(segment) {
    return Math.max(0, (segment.lengthKm * 1000) * (segment.gradientPercent / 100));
}
function classifyImportedSegmentTerrain(segment, position, climbs, positions, segments) {
    if (segment.gradientPercent < -3) {
        return 'Abfahrt';
    }
    if (segment.gradientPercent < 2.5 || resolveSegmentGainMeters(segment) < SEGMENT_MIN_HILL_GAIN_METERS) {
        return 'Flat';
    }
    const climb = findClimbForSegment(position, climbs);
    if (!climb) {
        return 'Hill';
    }
    const topElevation = resolveClimbTopElevation(climb, positions, segments);
    if (climb.gainMeters >= MOUNTAIN_MIN_GAIN_METERS && topElevation >= MOUNTAIN_MIN_TOP_ELEVATION_METERS) {
        return 'Mountain';
    }
    if (climb.gainMeters > MEDIUM_MOUNTAIN_MIN_GAIN_METERS) {
        return 'Medium_Mountain';
    }
    return 'Hill';
}
function addMarker(markers, marker) {
    if (markers.some((existing) => existing.type === marker.type && existing.name === marker.name)) {
        return normalizeMarkers(markers);
    }
    return normalizeMarkers([...markers, marker]);
}
function addAutomaticClimbMarkers(segments, climbs) {
    if (segments.length === 0 || climbs.length === 0) {
        return segments;
    }
    const positions = buildSegmentPositions(segments);
    const decorated = [...segments];
    for (const [climbIndex, climb] of climbs.entries()) {
        const climbName = `Anstieg ${climbIndex + 1}`;
        const startPosition = findNearestSegmentStart(positions, climb.startKm);
        const endPosition = findNearestSegmentEnd(positions, climb.endKm);
        if (startPosition) {
            decorated[startPosition.index] = {
                ...decorated[startPosition.index],
                markers: addMarker(decorated[startPosition.index].markers, { type: 'climb_start', name: climbName, cat: null }),
            };
        }
        if (endPosition) {
            decorated[endPosition.index] = {
                ...decorated[endPosition.index],
                endMarkers: addMarker(decorated[endPosition.index].endMarkers, { type: 'climb_top', name: climbName, cat: climb.category }),
            };
        }
    }
    return decorated;
}
function resolveSprintSegmentIndex(segments, positions, climbs, targetKm, usedIndexes) {
    const totalDistanceKm = positions[positions.length - 1]?.endKm ?? 0;
    const candidates = positions.filter((position) => {
        const segment = segments[position.index];
        return segment.terrain === 'Flat'
            && findClimbForSegment(position, climbs) == null
            && position.startKm > 0
            && position.startKm <= totalDistanceKm - SPRINT_CUT_KM
            && !usedIndexes.has(position.index);
    });
    if (candidates.length === 0) {
        return null;
    }
    const best = candidates.sort((left, right) => (Math.abs(left.startKm - targetKm) - Math.abs(right.startKm - targetKm)
        || left.startKm - right.startKm))[0];
    return best?.index ?? null;
}
function addAutomaticSprintMarkers(segments, climbs, totalDistanceKm) {
    if (segments.length === 0 || totalDistanceKm <= 0) {
        return segments;
    }
    const decorated = [...segments];
    const positions = buildSegmentPositions(decorated);
    const usedIndexes = new Set();
    const sprintTargets = [
        { targetKm: totalDistanceKm / 3, name: 'Sprint 1' },
        { targetKm: totalDistanceKm * 3 / 5, name: 'Sprint 2' },
    ];
    for (const sprint of sprintTargets) {
        const segmentIndex = resolveSprintSegmentIndex(decorated, positions, climbs, sprint.targetKm, usedIndexes);
        if (segmentIndex == null) {
            continue;
        }
        usedIndexes.add(segmentIndex);
        decorated[segmentIndex] = {
            ...decorated[segmentIndex],
            endMarkers: addMarker(decorated[segmentIndex].endMarkers, { type: 'sprint_intermediate', name: sprint.name, cat: 'Sprint' }),
        };
    }
    return decorated;
}
function decorateGpxImportedSegments(segments, climbs, totalDistanceKm) {
    const positions = buildSegmentPositions(segments);
    const terrainSegments = segments.map((segment, index) => ({
        ...segment,
        terrain: classifyImportedSegmentTerrain(segment, positions[index], climbs, positions, segments),
    }));
    const withClimbs = addAutomaticClimbMarkers(terrainSegments, climbs);
    return addAutomaticSprintMarkers(withClimbs, climbs, totalDistanceKm);
}
function countMarkers(segments, markerType) {
    return segments.reduce((count, segment) => count
        + segment.markers.filter((marker) => marker.type === markerType).length
        + segment.endMarkers.filter((marker) => marker.type === markerType).length, 0);
}
function buildPositionedClimbMarkers(segments) {
    const markers = [];
    let startKm = 0;
    for (const segment of segments) {
        const endKm = round2(startKm + segment.lengthKm);
        for (const marker of segment.markers) {
            if (marker.type === 'climb_top') {
                markers.push({ kmMark: round2(startKm), name: marker.name });
            }
        }
        for (const marker of segment.endMarkers) {
            if (marker.type === 'climb_top') {
                markers.push({ kmMark: endKm, name: marker.name });
            }
        }
        startKm = endKm;
    }
    return markers;
}
function findClosestClimbMarker(markers, endKm) {
    let closest = null;
    let closestDistance = Number.POSITIVE_INFINITY;
    for (const marker of markers) {
        const distance = Math.abs(marker.kmMark - endKm);
        if (distance < closestDistance) {
            closest = marker;
            closestDistance = distance;
        }
    }
    return closestDistance <= 1 ? closest : null;
}
function resolveMaxGradient(segments, startKm, endKm, fallbackGradient) {
    let segmentStartKm = 0;
    let maxGradient = Number.NEGATIVE_INFINITY;
    for (const segment of segments) {
        const segmentEndKm = segmentStartKm + segment.lengthKm;
        const overlapsClimb = segmentEndKm > startKm && segmentStartKm < endKm;
        if (overlapsClimb && segment.gradientPercent > maxGradient) {
            maxGradient = segment.gradientPercent;
        }
        segmentStartKm = segmentEndKm;
    }
    return Number.isFinite(maxGradient) ? round1(maxGradient) : fallbackGradient;
}
function suggestProfile(totalDistanceKm, elevationGainMeters, climbs) {
    const hasHcOrCat1 = climbs.some((climb) => climb.category === 'HC' || climb.category === '1');
    const hasCobble = false;
    if (hasCobble)
        return 'Cobble';
    if (totalDistanceKm <= 25 && elevationGainMeters < 250)
        return 'ITT';
    if (hasHcOrCat1 && elevationGainMeters >= 2800)
        return 'High_Mountain';
    if (hasHcOrCat1 || elevationGainMeters >= 1800)
        return 'Mountain';
    if (elevationGainMeters >= 1100)
        return 'Medium_Mountain';
    if (elevationGainMeters >= 700)
        return 'Hilly';
    if (elevationGainMeters >= 350)
        return 'Rolling';
    return 'Flat';
}
function buildWaypoints(points) {
    return points.map((point, index) => ({
        kmMark: round2(index === 0 ? 0 : point.distanceKm),
        elevation: Math.round(point.elevation),
        terrain: 'Flat',
        techLevel: 5,
        windExp: 5,
        markers: index === 0
            ? [{ type: 'start', name: 'Start', cat: null }]
            : index === points.length - 1
                ? [{ type: 'finish_flat', name: 'Ziel', cat: null }]
                : [],
    }));
}
function buildSegments(points) {
    return points.slice(0, -1).map((point, index) => {
        const next = points[index + 1];
        const lengthKm = round2(next.distanceKm - point.distanceKm);
        const gradientPercent = lengthKm > 0
            ? round3(((next.elevation - point.elevation) / (lengthKm * 1000)) * 100)
            : 0;
        return {
            startElevation: Math.round(point.elevation),
            lengthKm,
            gradientPercent,
            terrain: 'Flat',
            techLevel: 5,
            windExp: 5,
            markers: index === 0
                ? [{ type: 'start', name: 'Start', cat: null }]
                : [],
            endMarkers: index === points.length - 2
                ? [{ type: 'finish_flat', name: 'Ziel', cat: null }]
                : [],
        };
    });
}
function deriveWaypointsFromSegments(segments) {
    if (segments.length === 0) {
        return [];
    }
    const waypoints = [];
    let kmMark = 0;
    let elevation = segments[0].startElevation;
    waypoints.push({
        kmMark: 0,
        elevation,
        terrain: segments[0].terrain,
        techLevel: segments[0].techLevel,
        windExp: segments[0].windExp,
        markers: normalizeMarkers(segments[0].markers),
    });
    segments.forEach((segment) => {
        const endKm = round2(kmMark + segment.lengthKm);
        const endElevation = Math.round(segment.startElevation + ((segment.lengthKm * 1000) * (segment.gradientPercent / 100)));
        const previousWaypoint = waypoints[waypoints.length - 1];
        previousWaypoint.terrain = segment.terrain;
        previousWaypoint.techLevel = segment.techLevel;
        previousWaypoint.windExp = segment.windExp;
        previousWaypoint.markers = normalizeMarkers([...previousWaypoint.markers, ...segment.markers]);
        waypoints.push({
            kmMark: endKm,
            elevation: endElevation,
            terrain: segment.terrain,
            techLevel: segment.techLevel,
            windExp: segment.windExp,
            markers: normalizeMarkers(segment.endMarkers),
        });
        kmMark = endKm;
        elevation = endElevation;
    });
    return waypoints;
}
function inferFormat(fileName, fileContent) {
    const lowerName = fileName.toLowerCase();
    if (lowerName.endsWith('.gpx'))
        return 'gpx';
    if (lowerName.endsWith('.tcx'))
        return 'tcx';
    if (/<gpx\b/i.test(fileContent))
        return 'gpx';
    if (/<TrainingCenterDatabase\b/i.test(fileContent))
        return 'tcx';
    throw new Error('Nur GPX- und TCX-Dateien werden unterstützt.');
}
function sanitizeSegments(segments) {
    if (segments.length === 0) {
        throw new Error('Mindestens ein Segment ist erforderlich.');
    }
    const sanitized = [...segments]
        .map((segment) => ({
        ...segment,
        startElevation: Math.round(segment.startElevation),
        lengthKm: round2(segment.lengthKm),
        gradientPercent: round3(segment.gradientPercent),
        terrain: segment.terrain,
        techLevel: clamp(Math.round(segment.techLevel), 1, 10),
        windExp: clamp(Math.round(segment.windExp), 1, 10),
        markers: normalizeMarkers(segment.markers),
        endMarkers: normalizeMarkers(segment.endMarkers),
    }))
        .filter((segment) => segment.lengthKm > 0);
    sanitized[0] = {
        ...sanitized[0],
        markers: ensureMarker(sanitized[0].markers, 'start', 'Start'),
    };
    sanitized[sanitized.length - 1] = {
        ...sanitized[sanitized.length - 1],
        endMarkers: ensureFinishMarker(sanitized[sanitized.length - 1].endMarkers, 'Ziel'),
    };
    for (let index = 0; index < sanitized.length; index += 1) {
        if (sanitized[index].lengthKm < MIN_SEGMENT_KM) {
            throw new Error(`Segment ${index + 1} ist zu kurz (${sanitized[index].lengthKm.toFixed(2)} km). Minimum sind ${MIN_SEGMENT_KM.toFixed(1)} km.`);
        }
    }
    const totalDistanceKm = round2(sanitized.reduce((sum, segment) => sum + segment.lengthKm, 0));
    let segmentStartKm = 0;
    return sanitized.map((segment) => {
        const segmentEndKm = round2(segmentStartKm + segment.lengthKm);
        const nextSegment = {
            ...segment,
            startElevation: Math.round(segment.startElevation),
        };
        const filteredMarkers = nextSegment.markers.filter((marker) => marker.type !== 'sprint_intermediate' || segmentStartKm <= totalDistanceKm - SPRINT_CUT_KM);
        const filteredEndMarkers = nextSegment.endMarkers.filter((marker) => marker.type !== 'sprint_intermediate' || segmentEndKm <= totalDistanceKm - SPRINT_CUT_KM);
        segmentStartKm = segmentEndKm;
        return {
            ...nextSegment,
            markers: filteredMarkers,
            endMarkers: filteredEndMarkers,
        };
    });
}
function buildStagesCsv(payload) {
    const { metadata } = payload;
    const header = 'id,race_id,stage_number,date,profile,start_elevation,details_csv_file,final_spread_start_percent,final_push_start_percent,final_spread_difficulty_multiplier,crash_incident_multiplier,mechanical_incident_multiplier';
    const row = [
        metadata.stageId,
        metadata.raceId,
        metadata.stageNumber,
        metadata.date,
        metadata.profile,
        metadata.startElevation,
        metadata.detailsCsvFile,
        metadata.finalSpreadStartPercent,
        metadata.finalPushStartPercent,
        metadata.finalSpreadDifficultyMultiplier,
        metadata.crashIncidentMultiplier,
        metadata.mechanicalIncidentMultiplier,
    ].map(escapeCsv).join(',');
    return `${header}\n${row}\n`;
}
function buildStageDetailsCsv(segments) {
    const header = 'length_km,gradient_percent,terrain,tech_level,wind_exp,marker_type,marker_name,marker_cat,end_marker_type,end_marker_name,end_marker_cat';
    const rows = segments.map((segment) => [
        segment.lengthKm.toFixed(2),
        segment.gradientPercent.toFixed(3),
        segment.terrain,
        segment.techLevel,
        segment.windExp,
        joinMarkerValues(segment.markers, 'type'),
        joinMarkerValues(segment.markers, 'name'),
        joinMarkerValues(segment.markers, 'cat'),
        joinMarkerValues(segment.endMarkers, 'type'),
        joinMarkerValues(segment.endMarkers, 'name'),
        joinMarkerValues(segment.endMarkers, 'cat'),
    ].map(escapeCsv).join(','));
    return `${header}\n${rows.join('\n')}\n`;
}
function validateExportRequest(payload) {
    const { metadata, draft } = payload;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(metadata.date)) {
        throw new Error('Das Stage-Datum muss im Format YYYY-MM-DD vorliegen.');
    }
    if (!/^[A-Za-z0-9_.-]+\.csv$/.test(metadata.detailsCsvFile) || metadata.detailsCsvFile.includes('/')) {
        throw new Error('detailsCsvFile muss ein Dateiname mit .csv-Endung ohne Pfad sein.');
    }
    if (!Number.isInteger(metadata.stageId) || metadata.stageId <= 0) {
        throw new Error('stageId muss eine positive Ganzzahl sein.');
    }
    if (!Number.isInteger(metadata.raceId) || metadata.raceId <= 0) {
        throw new Error('raceId muss eine positive Ganzzahl sein.');
    }
    if (!Number.isInteger(metadata.stageNumber) || metadata.stageNumber <= 0) {
        throw new Error('stageNumber muss eine positive Ganzzahl sein.');
    }
    if (!Number.isFinite(metadata.finalSpreadStartPercent) || metadata.finalSpreadStartPercent < 0 || metadata.finalSpreadStartPercent > 100) {
        throw new Error('finalSpreadStartPercent muss zwischen 0 und 100 liegen.');
    }
    if (!Number.isFinite(metadata.finalPushStartPercent) || metadata.finalPushStartPercent < 0 || metadata.finalPushStartPercent > 100) {
        throw new Error('finalPushStartPercent muss zwischen 0 und 100 liegen.');
    }
    if (!Number.isFinite(metadata.finalSpreadDifficultyMultiplier) || metadata.finalSpreadDifficultyMultiplier <= 0) {
        throw new Error('finalSpreadDifficultyMultiplier muss groesser als 0 sein.');
    }
    if (!Number.isFinite(metadata.crashIncidentMultiplier) || metadata.crashIncidentMultiplier <= 0) {
        throw new Error('crashIncidentMultiplier muss groesser als 0 sein.');
    }
    if (!Number.isFinite(metadata.mechanicalIncidentMultiplier) || metadata.mechanicalIncidentMultiplier <= 0) {
        throw new Error('mechanicalIncidentMultiplier muss groesser als 0 sein.');
    }
    const sanitizedSegments = sanitizeSegments(draft.segments);
    return {
        metadata: {
            ...metadata,
            startElevation: sanitizedSegments[0].startElevation,
        },
        draft: {
            ...draft,
            segments: sanitizedSegments,
            waypoints: deriveWaypointsFromSegments(sanitizedSegments),
        },
    };
}
class RouteImporter {
    constructor(dataRoot = resolveDataRoot()) {
        this.dataRoot = dataRoot;
    }
    listExistingStages() {
        return {
            stages: this.loadStageMetadataRows(),
        };
    }
    listOverview() {
        const stages = this.loadStageMetadataRows();
        const stageRows = [];
        const climbRows = [];
        for (const stage of stages) {
            let segments = [];
            let profilePoints = [];
            let totalDistanceKm = 0;
            let elevationGainMeters = 0;
            let sprintCount = 0;
            let climbCount = 0;
            try {
                segments = this.loadStageDetailSegments(stage);
                const waypoints = deriveWaypointsFromSegments(segments);
                profilePoints = waypoints.map((waypoint) => ({
                    distanceKm: waypoint.kmMark,
                    elevation: waypoint.elevation,
                }));
                totalDistanceKm = round2(segments.reduce((sum, segment) => sum + segment.lengthKm, 0));
                elevationGainMeters = calculateElevationGain(profilePoints);
                sprintCount = countMarkers(segments, 'sprint_intermediate');
                climbCount = countMarkers(segments, 'climb_top');
            }
            catch {
                totalDistanceKm = 0;
                elevationGainMeters = 0;
                sprintCount = 0;
                climbCount = 0;
            }
            stageRows.push({
                stageId: stage.stageId,
                raceId: stage.raceId,
                countryCode: stage.countryCode ?? null,
                raceName: stage.raceName ?? `Race ${stage.raceId}`,
                stageNumber: stage.stageNumber,
                profile: stage.profile,
                distanceKm: totalDistanceKm,
                elevationGainMeters,
                sprintCount,
                climbCount,
                profileScore: 'Platzhalter',
            });
            if (segments.length === 0 || profilePoints.length < 2) {
                continue;
            }
            const climbMarkers = buildPositionedClimbMarkers(segments);
            detectClimbs(profilePoints).forEach((climb, index) => {
                const marker = findClosestClimbMarker(climbMarkers, climb.endKm);
                climbRows.push({
                    id: `${stage.stageId}-${index + 1}`,
                    placementKm: climb.endKm,
                    name: marker?.name ?? `Climb ${index + 1}`,
                    countryCode: stage.countryCode ?? null,
                    raceName: stage.raceName ?? `Race ${stage.raceId}`,
                    stageNumber: stage.stageNumber,
                    gainMeters: climb.gainMeters,
                    distanceKm: climb.distanceKm,
                    avgGradient: climb.avgGradient,
                    maxGradient: resolveMaxGradient(segments, climb.startKm, climb.endKm, climb.avgGradient),
                    climbScore: 'Platzhalter',
                });
            });
        }
        return {
            stages: stageRows,
            climbs: climbRows,
        };
    }
    loadExistingStage(stageId) {
        if (!Number.isInteger(stageId) || stageId <= 0) {
            throw new Error('Ungültige Stage-ID.');
        }
        const metadata = this.loadStageMetadataRows().find((stage) => stage.stageId === stageId);
        if (!metadata) {
            throw new Error(`Stage ${stageId} wurde in data/csv/stages.csv nicht gefunden.`);
        }
        const segments = this.loadStageDetailSegments(metadata);
        const waypoints = deriveWaypointsFromSegments(segments);
        const profilePoints = waypoints.map((waypoint) => ({
            distanceKm: waypoint.kmMark,
            elevation: waypoint.elevation,
        }));
        const elevationGainMeters = calculateElevationGain(profilePoints);
        return {
            metadata,
            draft: {
                routeName: metadata.raceName != null
                    ? `${metadata.raceName} - Etappe ${metadata.stageNumber}`
                    : `Stage ${metadata.stageId}`,
                sourceFormat: 'csv',
                totalDistanceKm: round2(segments.reduce((sum, segment) => sum + segment.lengthKm, 0)),
                elevationGainMeters,
                suggestedProfile: metadata.profile,
                segments,
                waypoints,
                climbs: detectClimbs(profilePoints),
                warnings: [],
            },
        };
    }
    importRoute(request) {
        if (!request.fileName.trim() || !request.fileContent.trim()) {
            throw new Error('fileName und fileContent sind erforderlich.');
        }
        const sourceFormat = inferFormat(request.fileName, request.fileContent);
        const parsed = sourceFormat === 'gpx'
            ? parseGpx(request.fileContent)
            : parseTcx(request.fileContent);
        const profile = smoothElevationProfile(buildProfile(parsed.points), IMPORT_ELEVATION_SMOOTHING_RADIUS);
        const simplifiedProfile = enforceMinimumSegmentLength(simplifyDouglasPeucker(profile, DOUGLAS_PEUCKER_EPSILON), MIN_SEGMENT_KM);
        const elevationGainMeters = calculateElevationGain(profile);
        const totalDistanceKm = round2(simplifiedProfile[simplifiedProfile.length - 1].distanceKm);
        const rawSegments = mergeImportedSegments(buildSegments(simplifiedProfile));
        const rawWaypoints = deriveWaypointsFromSegments(rawSegments);
        const climbs = detectClimbs(rawWaypoints.map((waypoint) => ({
            distanceKm: waypoint.kmMark,
            elevation: waypoint.elevation,
        })));
        const segments = sourceFormat === 'gpx'
            ? decorateGpxImportedSegments(rawSegments, climbs, totalDistanceKm)
            : rawSegments;
        const waypoints = deriveWaypointsFromSegments(segments);
        return {
            routeName: parsed.routeName,
            sourceFormat,
            totalDistanceKm,
            elevationGainMeters,
            suggestedProfile: suggestProfile(totalDistanceKm, elevationGainMeters, climbs),
            segments,
            waypoints,
            climbs,
            warnings: totalDistanceKm < 5 ? ['Die importierte Strecke ist sehr kurz. Prüfe, ob die Quelldatei vollständig ist.'] : [],
        };
    }
    exportCsv(request) {
        const validated = validateExportRequest(request);
        return {
            stagesCsv: buildStagesCsv(validated),
            stageDetailsCsv: buildStageDetailsCsv(validated.draft.segments),
            stagesFileName: `stage_${validated.metadata.stageId}.csv`,
            stageDetailsFileName: validated.metadata.detailsCsvFile,
        };
    }
    loadStageMetadataRows() {
        const stagesPath = (0, path_1.resolve)(this.dataRoot, 'csv', 'stages.csv');
        if (!(0, fs_1.existsSync)(stagesPath)) {
            throw new Error(`stages.csv wurde nicht gefunden: ${stagesPath}`);
        }
        const rows = parseCsvRows((0, fs_1.readFileSync)(stagesPath, 'utf8'));
        const [header, ...dataRows] = rows;
        if (!header || header.join(',') !== STAGES_METADATA_HEADER) {
            throw new Error('data/csv/stages.csv hat nicht den erwarteten Header.');
        }
        const races = this.loadRaceLookupRows();
        return dataRows.map((row, index) => {
            if (row.length !== header.length) {
                throw new Error(`stages.csv Zeile ${index + 2}: Erwartet ${header.length} Spalten, gefunden ${row.length}.`);
            }
            const profile = row[4]?.trim() ?? '';
            if (!isValidStageProfile(profile)) {
                throw new Error(`stages.csv Zeile ${index + 2}: Ungültiges Profil ${profile}.`);
            }
            const raceId = parseRequiredInteger(row[1], `stages.csv Zeile ${index + 2} race_id`);
            const race = races.get(raceId);
            return {
                stageId: parseRequiredInteger(row[0], `stages.csv Zeile ${index + 2} id`),
                raceId,
                stageNumber: parseRequiredInteger(row[2], `stages.csv Zeile ${index + 2} stage_number`),
                date: row[3]?.trim() ?? '',
                profile,
                startElevation: parseRequiredInteger(row[5], `stages.csv Zeile ${index + 2} start_elevation`),
                detailsCsvFile: safeStageDetailsFileName(row[6] ?? ''),
                finalSpreadStartPercent: parseRequiredNumber(row[7], `stages.csv Zeile ${index + 2} final_spread_start_percent`),
                finalPushStartPercent: parseRequiredNumber(row[8], `stages.csv Zeile ${index + 2} final_push_start_percent`),
                finalSpreadDifficultyMultiplier: parseRequiredNumber(row[9], `stages.csv Zeile ${index + 2} final_spread_difficulty_multiplier`),
                crashIncidentMultiplier: parseRequiredNumber(row[10], `stages.csv Zeile ${index + 2} crash_incident_multiplier`),
                mechanicalIncidentMultiplier: parseRequiredNumber(row[11], `stages.csv Zeile ${index + 2} mechanical_incident_multiplier`),
                raceName: race?.name,
                countryCode: race?.countryCode ?? null,
            };
        }).sort((left, right) => left.date.localeCompare(right.date) || left.raceId - right.raceId || left.stageNumber - right.stageNumber || left.stageId - right.stageId);
    }
    loadRaceNames() {
        return new Map([...this.loadRaceLookupRows()].map(([raceId, row]) => [raceId, row.name]));
    }
    loadRaceLookupRows() {
        const racesPath = (0, path_1.resolve)(this.dataRoot, 'csv', 'races.csv');
        if (!(0, fs_1.existsSync)(racesPath))
            return new Map();
        const countries = this.loadCountryCodes();
        const rows = parseCsvRows((0, fs_1.readFileSync)(racesPath, 'utf8'));
        const [header, ...dataRows] = rows;
        const idIndex = header?.indexOf('id') ?? -1;
        const nameIndex = header?.indexOf('name') ?? -1;
        const countryIdIndex = header?.indexOf('country_id') ?? -1;
        if (idIndex < 0 || nameIndex < 0)
            return new Map();
        const result = new Map();
        for (const row of dataRows) {
            const id = Number.parseInt(row[idIndex] ?? '', 10);
            const name = row[nameIndex]?.trim();
            if (Number.isInteger(id) && name) {
                const countryId = countryIdIndex >= 0 ? Number.parseInt(row[countryIdIndex] ?? '', 10) : Number.NaN;
                result.set(id, {
                    name,
                    countryCode: Number.isInteger(countryId) ? countries.get(countryId) ?? null : null,
                });
            }
        }
        return result;
    }
    loadCountryCodes() {
        const countriesPath = (0, path_1.resolve)(this.dataRoot, 'csv', 'sta_country.csv');
        if (!(0, fs_1.existsSync)(countriesPath))
            return new Map();
        const rows = parseCsvRows((0, fs_1.readFileSync)(countriesPath, 'utf8'));
        const [header, ...dataRows] = rows;
        const idIndex = header?.indexOf('id') ?? -1;
        const codeIndex = header?.indexOf('code_3') ?? -1;
        if (idIndex < 0 || codeIndex < 0)
            return new Map();
        const result = new Map();
        for (const row of dataRows) {
            const id = Number.parseInt(row[idIndex] ?? '', 10);
            const code = row[codeIndex]?.trim();
            if (Number.isInteger(id) && code) {
                result.set(id, code);
            }
        }
        return result;
    }
    loadStageDetailSegments(metadata) {
        const detailsPath = (0, path_1.resolve)(this.dataRoot, 'stages', safeStageDetailsFileName(metadata.detailsCsvFile));
        if (!(0, fs_1.existsSync)(detailsPath)) {
            throw new Error(`Detaildatei wurde nicht gefunden: ${metadata.detailsCsvFile}`);
        }
        const rows = parseCsvRows((0, fs_1.readFileSync)(detailsPath, 'utf8'));
        const [header, ...dataRows] = rows;
        if (!header || header.join(',') !== STAGE_DETAILS_HEADER) {
            throw new Error(`${metadata.detailsCsvFile} hat nicht den erwarteten Stage-Detail-Header.`);
        }
        if (dataRows.length === 0) {
            throw new Error(`${metadata.detailsCsvFile} enthält keine Segmente.`);
        }
        let startElevation = metadata.startElevation;
        const segments = dataRows.map((row, index) => {
            if (row.length !== header.length) {
                throw new Error(`${metadata.detailsCsvFile} Zeile ${index + 2}: Erwartet ${header.length} Spalten, gefunden ${row.length}.`);
            }
            const terrain = row[2]?.trim() ?? '';
            if (!isValidStageTerrain(terrain)) {
                throw new Error(`${metadata.detailsCsvFile} Zeile ${index + 2}: Ungültiges Terrain ${terrain}.`);
            }
            const lengthKm = parseRequiredNumber(row[0], `${metadata.detailsCsvFile} Zeile ${index + 2} length_km`);
            const gradientPercent = parseRequiredNumber(row[1], `${metadata.detailsCsvFile} Zeile ${index + 2} gradient_percent`);
            const segment = {
                startElevation: Math.round(startElevation),
                lengthKm,
                gradientPercent,
                terrain,
                techLevel: parseRequiredInteger(row[3], `${metadata.detailsCsvFile} Zeile ${index + 2} tech_level`),
                windExp: parseRequiredInteger(row[4], `${metadata.detailsCsvFile} Zeile ${index + 2} wind_exp`),
                markers: parseStageMarkers(row[5] ?? '', row[6] ?? '', row[7] ?? '', `${metadata.detailsCsvFile} Zeile ${index + 2}`),
                endMarkers: parseStageMarkers(row[8] ?? '', row[9] ?? '', row[10] ?? '', `${metadata.detailsCsvFile} Zeile ${index + 2}`),
            };
            startElevation = Math.round(startElevation + ((lengthKm * 1000) * (gradientPercent / 100)));
            return segment;
        });
        return sanitizeSegments(segments);
    }
}
exports.RouteImporter = RouteImporter;
