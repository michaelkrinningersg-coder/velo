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
    'km_mark',
    'elevation',
    'terrain',
    'tech_level',
    'wind_exp',
    'marker_type',
    'marker_name',
    'marker_cat',
];
const STAGE_MARKER_TYPES = ['start', 'climb_start', 'climb_top', 'sprint_intermediate', 'finish_flat', 'finish_TT', 'finish_hill', 'finish_mountain'];
const STAGE_MARKER_CATEGORIES = ['HC', '1', '2', '3', '4', 'Sprint'];
const STAGE_TERRAINS = ['Flat', 'Hill', 'Medium_Mountain', 'Mountain', 'High_Mountain', 'Cobble', 'Cobble_Hill', 'Abfahrt', 'Sprint'];
const STAGE_FINISH_MARKER_TYPES = ['finish_flat', 'finish_TT', 'finish_hill', 'finish_mountain'];
function isFinishMarkerType(markerType) {
    return STAGE_FINISH_MARKER_TYPES.includes(markerType);
}
function resolveStagesDir() {
    const candidates = [
        path.resolve(__dirname, '..', '..', '..', 'data', 'stages'),
        path.resolve(__dirname, '..', '..', '..', '..', 'data', 'stages'),
        path.resolve(process.cwd(), 'data', 'stages'),
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
function validateMarkerCategory(markerType, markerCategory, ctx) {
    if (markerType === 'climb_top') {
        if (markerCategory == null || !['HC', '1', '2', '3', '4'].includes(markerCategory)) {
            throw new Error(`${ctx}: climb_top verlangt marker_cat HC, 1, 2, 3 oder 4.`);
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
        throw new Error(`${ctx}: Finish-Marker erlauben keine marker_cat.`);
    }
    if (markerCategory != null && !STAGE_MARKER_CATEGORIES.includes(markerCategory)) {
        throw new Error(`${ctx}: Ungueltige marker_cat "${markerCategory}".`);
    }
}
function parseMarkers(typeValue, nameValue, categoryValue, ctx) {
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
        validateMarkerCategory(markerType, markerCategory, ctx);
        return {
            type: markerType,
            name: markerName,
            cat: markerCategory,
        };
    });
}
function parseProfilePoint(row, index) {
    const ctx = `Stage-Zeile ${index + 2}`;
    const kmMark = float(row['km_mark'] ?? '', ctx);
    const elevation = int(row['elevation'] ?? '', ctx);
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
        kmMark,
        elevation,
        terrain,
        techLevel,
        windExp,
        markers: parseMarkers(row['marker_type'], row['marker_name'], row['marker_cat'], ctx),
    };
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
function createSegment(startPoint, endPoint, index) {
    const ctx = `Segment ${index + 1}`;
    const lengthKm = endPoint.kmMark - startPoint.kmMark;
    if (lengthKm <= 0) {
        throw new Error(`${ctx}: km_mark muss strikt aufsteigend sein.`);
    }
    const gradientPercent = ((endPoint.elevation - startPoint.elevation) / (lengthKm * 1000)) * 100;
    return {
        start_km: startPoint.kmMark,
        end_km: endPoint.kmMark,
        length_km: lengthKm,
        start_elevation: startPoint.elevation,
        end_elevation: endPoint.elevation,
        gradient_percent: gradientPercent,
        terrain: startPoint.terrain,
        tech_level: startPoint.techLevel,
        wind_exp: startPoint.windExp,
        ...(startPoint.markers.length > 0 ? { start_markers: startPoint.markers } : {}),
        ...(endPoint.markers.length > 0 ? { end_markers: endPoint.markers } : {}),
    };
}
function readStagePoints(filename) {
    if (filename.includes('/') || filename.includes('\\')) {
        throw new Error(`Stage-Dateiname darf keinen Pfad enthalten: ${filename}`);
    }
    const stagesDir = resolveStagesDir();
    const filePath = path.join(stagesDir, filename);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Stage-Datei nicht gefunden: ${filePath}`);
    }
    const rows = toRecords(fs.readFileSync(filePath, 'utf8'), filename);
    const points = rows.map((row, index) => parseProfilePoint(row, index));
    if (points[0]?.kmMark !== 0) {
        throw new Error(`Stage-Datei ${filename}: Erste Datenzeile muss km_mark 0 haben.`);
    }
    if (!points[0]?.markers.some((marker) => marker.type === 'start')) {
        throw new Error(`Stage-Datei ${filename}: Erste Datenzeile muss marker_type start tragen.`);
    }
    if (!points[points.length - 1]?.markers.some((marker) => isFinishMarkerType(marker.type))) {
        throw new Error(`Stage-Datei ${filename}: Letzte Datenzeile muss einen Finish-Marker tragen.`);
    }
    return points;
}
function calculateElevationGain(points) {
    let gain = 0;
    for (let index = 1; index < points.length; index += 1) {
        gain += Math.max(0, points[index].elevation - points[index - 1].elevation);
    }
    return gain;
}
class StageParser {
    static parseStageProfile(filename) {
        return StageParser.summarizeStageProfile(filename).segments;
    }
    static summarizeStageProfile(filename) {
        const points = readStagePoints(filename);
        return {
            distanceKm: points[points.length - 1]?.kmMark ?? 0,
            elevationGainMeters: calculateElevationGain(points),
            points,
            segments: points.slice(0, -1).map((point, index) => createSegment(point, points[index + 1], index)),
        };
    }
}
exports.StageParser = StageParser;
function parseStageProfile(filename) {
    return StageParser.parseStageProfile(filename);
}
function summarizeStageProfile(filename) {
    return StageParser.summarizeStageProfile(filename);
}
