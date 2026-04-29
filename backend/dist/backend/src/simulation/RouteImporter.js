"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteImporter = void 0;
const MIN_SEGMENT_KM = 0.2;
const SPRINT_CUT_KM = 0.3;
const DOUGLAS_PEUCKER_EPSILON = 9;
const CLIMB_MIN_GAIN_METERS = 60;
const CLIMB_MIN_AVG_GRADIENT = 3;
const BRIEF_DESCENT_TOLERANCE_METERS = 18;
const BRIEF_DESCENT_TOLERANCE_KM = 0.6;
function round2(value) {
    return Math.round(value * 100) / 100;
}
function round1(value) {
    return Math.round(value * 10) / 10;
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
    let gainMeters = 0;
    let descentMeters = 0;
    let descentDistanceKm = 0;
    for (let index = 1; index < points.length; index += 1) {
        const previous = points[index - 1];
        const current = points[index];
        const deltaElevation = current.elevation - previous.elevation;
        const deltaDistanceKm = current.distanceKm - previous.distanceKm;
        if (startIndex == null && deltaElevation > 0) {
            startIndex = index - 1;
            gainMeters = deltaElevation;
            descentMeters = 0;
            descentDistanceKm = 0;
            continue;
        }
        if (startIndex == null) {
            continue;
        }
        if (deltaElevation >= 0) {
            gainMeters += deltaElevation;
            descentMeters = 0;
            descentDistanceKm = 0;
            continue;
        }
        descentMeters += Math.abs(deltaElevation);
        descentDistanceKm += deltaDistanceKm;
        if (descentMeters <= BRIEF_DESCENT_TOLERANCE_METERS && descentDistanceKm <= BRIEF_DESCENT_TOLERANCE_KM) {
            continue;
        }
        const startPoint = points[startIndex];
        const endPoint = previous;
        const distanceKm = endPoint.distanceKm - startPoint.distanceKm;
        const avgGradient = distanceKm > 0 ? gainMeters / (distanceKm * 10) : 0;
        if (gainMeters >= CLIMB_MIN_GAIN_METERS && avgGradient >= CLIMB_MIN_AVG_GRADIENT) {
            climbs.push({
                startKm: round2(startPoint.distanceKm),
                endKm: round2(endPoint.distanceKm),
                distanceKm: round2(distanceKm),
                gainMeters: Math.round(gainMeters),
                avgGradient: round1(avgGradient),
                category: classifyClimb(distanceKm, gainMeters, avgGradient),
            });
        }
        startIndex = null;
        gainMeters = 0;
        descentMeters = 0;
        descentDistanceKm = 0;
    }
    if (startIndex != null) {
        const startPoint = points[startIndex];
        const endPoint = points[points.length - 1];
        const distanceKm = endPoint.distanceKm - startPoint.distanceKm;
        const avgGradient = distanceKm > 0 ? gainMeters / (distanceKm * 10) : 0;
        if (gainMeters >= CLIMB_MIN_GAIN_METERS && avgGradient >= CLIMB_MIN_AVG_GRADIENT) {
            climbs.push({
                startKm: round2(startPoint.distanceKm),
                endKm: round2(endPoint.distanceKm),
                distanceKm: round2(distanceKm),
                gainMeters: Math.round(gainMeters),
                avgGradient: round1(avgGradient),
                category: classifyClimb(distanceKm, gainMeters, avgGradient),
            });
        }
    }
    return climbs;
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
function sanitizeWaypoints(waypoints) {
    if (waypoints.length < 2) {
        throw new Error('Mindestens zwei Wegpunkte sind erforderlich.');
    }
    const sanitized = [...waypoints]
        .map((waypoint) => ({
        ...waypoint,
        kmMark: round2(waypoint.kmMark),
        elevation: Math.round(waypoint.elevation),
        terrain: waypoint.terrain,
        techLevel: clamp(Math.round(waypoint.techLevel), 1, 10),
        windExp: clamp(Math.round(waypoint.windExp), 1, 10),
        markers: normalizeMarkers(waypoint.markers),
    }))
        .sort((left, right) => left.kmMark - right.kmMark);
    sanitized[0] = {
        ...sanitized[0],
        kmMark: 0,
        markers: ensureMarker(sanitized[0].markers, 'start', 'Start'),
    };
    sanitized[sanitized.length - 1] = {
        ...sanitized[sanitized.length - 1],
        markers: ensureFinishMarker(sanitized[sanitized.length - 1].markers, 'Ziel'),
    };
    for (let index = 1; index < sanitized.length; index += 1) {
        const deltaKm = round2(sanitized[index].kmMark - sanitized[index - 1].kmMark);
        if (deltaKm < MIN_SEGMENT_KM) {
            throw new Error(`Segment ${index} ist zu kurz (${deltaKm.toFixed(2)} km). Minimum sind ${MIN_SEGMENT_KM.toFixed(1)} km.`);
        }
    }
    const totalDistanceKm = sanitized[sanitized.length - 1].kmMark;
    return sanitized.map((waypoint) => {
        return {
            ...waypoint,
            markers: waypoint.markers.filter((marker) => marker.type !== 'sprint_intermediate' || waypoint.kmMark <= totalDistanceKm - SPRINT_CUT_KM),
        };
    });
}
function buildStagesCsv(payload) {
    const { metadata } = payload;
    const header = 'id,race_id,stage_number,date,profile,details_csv_file';
    const row = [
        metadata.stageId,
        metadata.raceId,
        metadata.stageNumber,
        metadata.date,
        metadata.profile,
        metadata.detailsCsvFile,
    ].map(escapeCsv).join(',');
    return `${header}\n${row}\n`;
}
function buildStageDetailsCsv(waypoints) {
    const header = 'km_mark,elevation,terrain,tech_level,wind_exp,marker_type,marker_name,marker_cat';
    const rows = waypoints.map((waypoint) => [
        waypoint.kmMark.toFixed(2),
        waypoint.elevation,
        waypoint.terrain,
        waypoint.techLevel,
        waypoint.windExp,
        joinMarkerValues(waypoint.markers, 'type'),
        joinMarkerValues(waypoint.markers, 'name'),
        joinMarkerValues(waypoint.markers, 'cat'),
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
    return {
        metadata,
        draft: {
            ...draft,
            waypoints: sanitizeWaypoints(draft.waypoints),
        },
    };
}
class RouteImporter {
    importRoute(request) {
        if (!request.fileName.trim() || !request.fileContent.trim()) {
            throw new Error('fileName und fileContent sind erforderlich.');
        }
        const sourceFormat = inferFormat(request.fileName, request.fileContent);
        const parsed = sourceFormat === 'gpx'
            ? parseGpx(request.fileContent)
            : parseTcx(request.fileContent);
        const profile = buildProfile(parsed.points);
        const simplifiedProfile = enforceMinimumSegmentLength(simplifyDouglasPeucker(profile, DOUGLAS_PEUCKER_EPSILON), MIN_SEGMENT_KM);
        const climbs = detectClimbs(simplifiedProfile);
        const elevationGainMeters = calculateElevationGain(profile);
        const waypoints = buildWaypoints(simplifiedProfile);
        const totalDistanceKm = round2(simplifiedProfile[simplifiedProfile.length - 1].distanceKm);
        return {
            routeName: parsed.routeName,
            sourceFormat,
            totalDistanceKm,
            elevationGainMeters,
            suggestedProfile: suggestProfile(totalDistanceKm, elevationGainMeters, climbs),
            waypoints,
            climbs,
            warnings: totalDistanceKm < 5 ? ['Die importierte Strecke ist sehr kurz. Prüfe, ob die Quelldatei vollständig ist.'] : [],
        };
    }
    exportCsv(request) {
        const validated = validateExportRequest(request);
        return {
            stagesCsv: buildStagesCsv(validated),
            stageDetailsCsv: buildStageDetailsCsv(validated.draft.waypoints),
            stagesFileName: `stage_${validated.metadata.stageId}.csv`,
            stageDetailsFileName: validated.metadata.detailsCsvFile,
        };
    }
}
exports.RouteImporter = RouteImporter;
