"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageParser = void 0;
exports.parseStageProfile = parseStageProfile;
exports.summarizeStageProfile = summarizeStageProfile;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const STAGE_FILE_HEADERS = [
    'length_km',
    'gradient_percent',
    'terrain',
    'tech_level',
    'wind_exp',
    'marker_type',
    'marker_name',
    'marker_cat',
    'end_marker_type',
    'end_marker_name',
    'end_marker_cat',
];
const STAGE_MARKER_TYPES = ['start', 'climb_start', 'climb_top', 'sprint_intermediate', 'finish_flat', 'finish_TT', 'finish_hill', 'finish_mountain'];
const STAGE_MARKER_CATEGORIES = ['HC', '1', '2', '3', '4', 'Sprint'];
const STAGE_CLIMB_CATEGORIES = ['HC', '1', '2', '3', '4'];
const STAGE_TERRAINS = ['Flat', 'Hill', 'Medium_Mountain', 'Mountain', 'High_Mountain', 'Cobble', 'Cobble_Hill', 'Abfahrt', 'Sprint'];
const STAGE_FINISH_MARKER_TYPES = ['finish_flat', 'finish_TT', 'finish_hill', 'finish_mountain'];
const STAGE_ELEVATION_TOLERANCE_METERS = 0.5;
function isFinishMarkerType(markerType) {
    return STAGE_FINISH_MARKER_TYPES.includes(markerType);
}
function isMountainFinishMarkerType(markerType) {
    return markerType === 'finish_hill' || markerType === 'finish_mountain';
}
function hasClimbMarkerCategory(markerCategory) {
    return markerCategory != null && STAGE_CLIMB_CATEGORIES.includes(markerCategory);
}
function isMountainClassificationMarker(markerType, markerCategory) {
    return markerType === 'climb_top' || (isMountainFinishMarkerType(markerType) && hasClimbMarkerCategory(markerCategory));
}
function resolveStagesDir() {
    const candidates = [
        path.resolve(__dirname, '..', '..', '..', 'data', 'stages'),
        path.resolve(__dirname, '..', '..', '..', '..', 'data', 'stages'),
        path.resolve(__dirname, '..', '..', '..', '..', '..', 'data', 'stages'),
        path.resolve(process.cwd(), 'data', 'stages'),
        path.resolve(process.cwd(), '..', 'data', 'stages'),
    ];
    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }
    return candidates[0];
}
function parseCsvLine(line) {
    const cells = [];
    let current = '';
    let inQuotes = false;
    for (let index = 0; index < line.length; index += 1) {
        const char = line[index];
        const next = line[index + 1];
        if (char === '"') {
            if (inQuotes && next === '"') {
                current += '"';
                index += 1;
            }
            else {
                inQuotes = !inQuotes;
            }
            continue;
        }
        if (char === ',' && !inQuotes) {
            cells.push(current.trim());
            current = '';
            continue;
        }
        current += char;
    }
    cells.push(current.trim());
    return cells;
}
function int(value, ctx) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isInteger(parsed)) {
        throw new Error(`${ctx}: Ganzzahl erwartet, erhalten "${value}".`);
    }
    return parsed;
}
function float(value, ctx) {
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) {
        throw new Error(`${ctx}: Zahl erwartet, erhalten "${value}".`);
    }
    return parsed;
}
function optionalText(value) {
    const trimmed = value?.trim() ?? '';
    return trimmed.length === 0 ? null : trimmed;
}
function parsePipeValues(value) {
    const trimmed = value?.trim() ?? '';
    if (trimmed.length === 0)
        return [];
    return trimmed.split('|').map((part) => part.trim());
}
function optionalPipeValue(value) {
    if (value.length === 0 || value.toLowerCase() === 'null')
        return null;
    return value;
}
function validateMarkerPlacement(markerType, scope, ctx) {
    if (scope === 'start') {
        if (markerType === 'sprint_intermediate') {
            throw new Error(`${ctx}: sprint_intermediate ist nur als Endmarker erlaubt.`);
        }
        if (markerType === 'climb_top') {
            throw new Error(`${ctx}: climb_top ist nur als Endmarker erlaubt.`);
        }
        if (isFinishMarkerType(markerType)) {
            throw new Error(`${ctx}: Finish-Marker sind nur als Endmarker erlaubt.`);
        }
        return;
    }
    if (markerType === 'start' || markerType === 'climb_start') {
        throw new Error(`${ctx}: ${markerType} ist nur als Startmarker erlaubt.`);
    }
}
function validateMarkerCategory(markerType, markerCategory, ctx) {
    if (isMountainClassificationMarker(markerType, markerCategory)) {
        if (!hasClimbMarkerCategory(markerCategory)) {
            throw new Error(`${ctx}: ${markerType} verlangt marker_cat HC, 1, 2, 3 oder 4.`);
        }
        return;
    }
    if (markerType === 'sprint_intermediate') {
        if (markerCategory != null && markerCategory !== 'Sprint') {
            throw new Error(`${ctx}: sprint_intermediate erlaubt nur marker_cat Sprint oder leer.`);
        }
        return;
    }
    if (isFinishMarkerType(markerType) && markerCategory != null) {
        throw new Error(`${ctx}: Finish-Marker erlauben nur fuer finish_hill/finish_mountain die marker_cat HC, 1, 2, 3 oder 4.`);
    }
    if (markerCategory != null && !STAGE_MARKER_CATEGORIES.includes(markerCategory)) {
        throw new Error(`${ctx}: Ungueltige marker_cat "${markerCategory}".`);
    }
}
function parseMarkers(typeValue, nameValue, categoryValue, scope, ctx) {
    const markerTypeValues = parsePipeValues(typeValue);
    const markerNameValues = parsePipeValues(nameValue);
    const markerCategoryValues = parsePipeValues(categoryValue);
    if (markerTypeValues.length === 0) {
        if (markerNameValues.length > 0 || markerCategoryValues.length > 0) {
            throw new Error(`${ctx}: marker_name/marker_cat ohne marker_type ist nicht erlaubt.`);
        }
        return [];
    }
    if (markerNameValues.length > 0 && markerNameValues.length !== markerTypeValues.length) {
        throw new Error(`${ctx}: marker_name muss gleich viele Pipe-Werte wie marker_type enthalten.`);
    }
    if (markerCategoryValues.length > 0 && markerCategoryValues.length !== markerTypeValues.length) {
        throw new Error(`${ctx}: marker_cat muss gleich viele Pipe-Werte wie marker_type enthalten.`);
    }
    return markerTypeValues.map((markerTypeValue, index) => {
        if (!STAGE_MARKER_TYPES.includes(markerTypeValue)) {
            throw new Error(`${ctx}: Ungueltiger marker_type "${markerTypeValue}".`);
        }
        const markerType = markerTypeValue;
        const markerName = optionalPipeValue(markerNameValues[index] ?? '');
        const markerCategoryValue = optionalPipeValue(markerCategoryValues[index] ?? '');
        const markerCategory = markerCategoryValue;
        validateMarkerPlacement(markerType, scope, ctx);
        validateMarkerCategory(markerType, markerCategory, ctx);
        return {
            type: markerType,
            name: markerName,
            cat: markerCategory,
        };
    });
}
function parseSegmentRow(row, index, startElevation) {
    const ctx = `Stage-Zeile ${index + 2}`;
    const lengthKm = float(row['length_km'] ?? '', ctx);
    if (lengthKm <= 0) {
        throw new Error(`${ctx}: length_km muss groesser als 0 sein.`);
    }
    const gradientPercent = float(row['gradient_percent'] ?? '', ctx);
    const terrainValue = (row['terrain'] ?? '').trim();
    if (terrainValue.length === 0) {
        throw new Error(`${ctx}: terrain fehlt.`);
    }
    if (!STAGE_TERRAINS.includes(terrainValue)) {
        throw new Error(`${ctx}: Ungueltiges terrain "${terrainValue}".`);
    }
    const terrain = terrainValue;
    const techLevel = int(row['tech_level'] ?? '', ctx);
    if (techLevel < 1 || techLevel > 10) {
        throw new Error(`${ctx}: tech_level muss zwischen 1 und 10 liegen.`);
    }
    const windExp = int(row['wind_exp'] ?? '', ctx);
    if (windExp < 1 || windExp > 10) {
        throw new Error(`${ctx}: wind_exp muss zwischen 1 und 10 liegen.`);
    }
    return {
        startElevation,
        lengthKm,
        gradientPercent,
        terrain,
        techLevel,
        windExp,
        markers: parseMarkers(row['marker_type'], row['marker_name'], row['marker_cat'], 'start', ctx),
        endMarkers: parseMarkers(row['end_marker_type'], row['end_marker_name'], row['end_marker_cat'], 'end', `${ctx} (Endmarker)`),
    };
}
function validateClimbPairs(segments, filename) {
    const openClimbs = [];
    const openClimb = (marker, ctx) => {
        if (marker.type !== 'climb_start') {
            return;
        }
        openClimbs.push({ name: marker.name ?? null, segmentIndex: Number.parseInt(ctx.match(/Segment (\d+)/)?.[1] ?? '0', 10) });
    };
    const closeClimb = (marker, ctx) => {
        if (!isMountainClassificationMarker(marker.type, marker.cat)) {
            return;
        }
        if (!marker.name) {
            throw new Error(`${ctx}: ${marker.type} braucht einen Namen fuer die Paarbildung.`);
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
            throw new Error(`${ctx}: ${marker.type} "${marker.name}" hat keinen vorherigen climb_start.`);
        }
        openClimbs.splice(openIndex, 1);
    };
    segments.forEach((segment, index) => {
        const rowCtx = `Stage-Datei ${filename}, Segment ${index + 1}`;
        segment.markers.forEach((marker) => openClimb(marker, `${rowCtx} Startmarker`));
        segment.endMarkers.forEach((marker) => closeClimb(marker, `${rowCtx} Endmarker`));
    });
    const danglingClimb = openClimbs[0];
    if (danglingClimb) {
        const climbLabel = danglingClimb.name ? ` \"${danglingClimb.name}\"` : '';
        throw new Error(`Stage-Datei ${filename}: climb_start${climbLabel} hat keinen spaeteren climb_top oder kategorisierten finish_hill/finish_mountain.`);
    }
}
function toRecords(content, filename) {
    const normalized = content.replace(/^\uFEFF/, '').trim();
    if (!normalized) {
        throw new Error(`Stage-Datei ${filename} ist leer.`);
    }
    const lines = normalized.split(/\r?\n/).map(line => line.trim());
    if (lines.length < 3) {
        throw new Error(`Stage-Datei ${filename} braucht Header und mindestens zwei Datenzeilen.`);
    }
    const headers = parseCsvLine(lines[0]);
    if (headers.length !== STAGE_FILE_HEADERS.length || headers.some((header, index) => header !== STAGE_FILE_HEADERS[index])) {
        throw new Error(`Stage-Datei ${filename} hat einen ungueltigen Header.`);
    }
    return lines.slice(1).map((line, index) => {
        const values = parseCsvLine(line);
        if (values.length !== headers.length) {
            throw new Error(`Stage-Datei ${filename}, Zeile ${index + 2}: ${headers.length} Spalten erwartet, erhalten ${values.length}.`);
        }
        return headers.reduce((record, header, headerIndex) => {
            record[header] = values[headerIndex] ?? '';
            return record;
        }, {});
    });
}
function calculateSegmentEndElevation(startElevation, lengthKm, gradientPercent) {
    return startElevation + ((lengthKm * 1000) * (gradientPercent / 100));
}
function createParsedSegment(segment, startKm, index) {
    const endKm = startKm + segment.lengthKm;
    const endElevation = calculateSegmentEndElevation(segment.startElevation, segment.lengthKm, segment.gradientPercent);
    return {
        start_km: startKm,
        end_km: endKm,
        length_km: segment.lengthKm,
        start_elevation: segment.startElevation,
        end_elevation: endElevation,
        gradient_percent: segment.gradientPercent,
        terrain: segment.terrain,
        tech_level: segment.techLevel,
        wind_exp: segment.windExp,
        ...(segment.markers.length > 0 ? { start_markers: segment.markers } : {}),
        ...(segment.endMarkers.length > 0 ? { end_markers: segment.endMarkers } : {}),
    };
}
function derivePoints(segments, filename) {
    if (segments.length === 0) {
        throw new Error(`Stage-Datei ${filename}: Mindestens ein Segment ist erforderlich.`);
    }
    const points = [];
    let currentKm = 0;
    let currentElevation = segments[0].startElevation;
    points.push({
        kmMark: 0,
        elevation: currentElevation,
        terrain: segments[0].terrain,
        techLevel: segments[0].techLevel,
        windExp: segments[0].windExp,
        markers: [...segments[0].markers],
    });
    segments.forEach((segment, index) => {
        if (index === 0) {
            currentElevation = segment.startElevation;
        }
        currentElevation = segment.startElevation;
        const endKm = currentKm + segment.lengthKm;
        const endElevation = calculateSegmentEndElevation(segment.startElevation, segment.lengthKm, segment.gradientPercent);
        currentKm = endKm;
        currentElevation = endElevation;
        const previousPoint = points[points.length - 1];
        if (previousPoint) {
            previousPoint.terrain = segment.terrain;
            previousPoint.techLevel = segment.techLevel;
            previousPoint.windExp = segment.windExp;
            previousPoint.markers = [...previousPoint.markers, ...segment.markers];
        }
        points.push({
            kmMark: endKm,
            elevation: endElevation,
            terrain: segment.terrain,
            techLevel: segment.techLevel,
            windExp: segment.windExp,
            markers: [...segment.endMarkers],
        });
    });
    if (!points[0]?.markers.some((marker) => marker.type === 'start')) {
        throw new Error(`Stage-Datei ${filename}: Das erste Segment muss marker_type start tragen.`);
    }
    if (!points[points.length - 1]?.markers.some((marker) => isFinishMarkerType(marker.type))) {
        throw new Error(`Stage-Datei ${filename}: Das letzte Segment muss per end_marker_type einen Finish-Marker tragen.`);
    }
    return points;
}
function readStageSegments(filename, initialStartElevation) {
    if (filename.includes('/') || filename.includes('\\')) {
        throw new Error(`Stage-Dateiname darf keinen Pfad enthalten: ${filename}`);
    }
    const stagesDir = resolveStagesDir();
    const filePath = path.join(stagesDir, filename);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Stage-Datei nicht gefunden: ${filePath}`);
    }
    const rows = toRecords(fs.readFileSync(filePath, 'utf8'), filename);
    let currentStartElevation = initialStartElevation;
    const segments = rows.map((row, index) => {
        if (currentStartElevation == null) {
            throw new Error(`Stage-Datei ${filename}: initiale Starthoehe fehlt.`);
        }
        const segment = parseSegmentRow(row, index, currentStartElevation);
        currentStartElevation = calculateSegmentEndElevation(segment.startElevation, segment.lengthKm, segment.gradientPercent);
        return segment;
    });
    validateClimbPairs(segments, filename);
    return segments;
}
function calculateElevationGain(points) {
    let gain = 0;
    for (let index = 1; index < points.length; index += 1) {
        gain += Math.max(0, points[index].elevation - points[index - 1].elevation);
    }
    return gain;
}
class StageParser {
    static parseStageProfile(filename, initialStartElevation) {
        return StageParser.summarizeStageProfile(filename, initialStartElevation).segments;
    }
    static summarizeStageProfile(filename, initialStartElevation) {
        const cacheKey = `${filename}:${initialStartElevation}`;
        let summary = StageParser.summaryCache.get(cacheKey);
        if (!summary) {
            const stageSegments = readStageSegments(filename, initialStartElevation);
            const points = derivePoints(stageSegments, filename);
            summary = {
                distanceKm: points[points.length - 1]?.kmMark ?? 0,
                elevationGainMeters: calculateElevationGain(points),
                points,
                segments: stageSegments.map((segment, index) => createParsedSegment(segment, points[index]?.kmMark ?? 0, index)),
            };
            StageParser.summaryCache.set(cacheKey, summary);
        }
        return summary;
    }
}
exports.StageParser = StageParser;
StageParser.summaryCache = new Map();
function parseStageProfile(filename, initialStartElevation) {
    return StageParser.parseStageProfile(filename, initialStartElevation);
}
function summarizeStageProfile(filename, initialStartElevation) {
    return StageParser.summarizeStageProfile(filename, initialStartElevation);
}
