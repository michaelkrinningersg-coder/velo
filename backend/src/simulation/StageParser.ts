import * as fs from 'fs';
import * as path from 'path';
import type {
  StageCsvSegment,
  ParsedStageSegment,
  ParsedStageSummary,
  StageMarker,
  StageMarkerCategory,
  StageFinishMarkerType,
  StageMarkerType,
  StageProfilePoint,
  StageTerrain,
} from '../../../shared/types';

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
] as const;

const STAGE_MARKER_TYPES: StageMarkerType[] = ['start', 'climb_start', 'climb_top', 'sprint_intermediate', 'finish_flat', 'finish_TT', 'finish_hill', 'finish_mountain'];
const STAGE_MARKER_CATEGORIES: StageMarkerCategory[] = ['HC', '1', '2', '3', '4', 'Sprint'];
const STAGE_CLIMB_CATEGORIES: Array<Exclude<StageMarkerCategory, 'Sprint'>> = ['HC', '1', '2', '3', '4'];
const STAGE_TERRAINS: StageTerrain[] = ['Flat', 'Hill', 'Medium_Mountain', 'Mountain', 'High_Mountain', 'Cobble', 'Cobble_Hill', 'Abfahrt', 'Sprint'];
const STAGE_FINISH_MARKER_TYPES: StageFinishMarkerType[] = ['finish_flat', 'finish_TT', 'finish_hill', 'finish_mountain'];
const STAGE_ELEVATION_TOLERANCE_METERS = 0.5;

function isFinishMarkerType(markerType: StageMarkerType): markerType is StageFinishMarkerType {
  return STAGE_FINISH_MARKER_TYPES.includes(markerType as StageFinishMarkerType);
}

function isMountainFinishMarkerType(markerType: StageMarkerType): markerType is Extract<StageFinishMarkerType, 'finish_hill' | 'finish_mountain'> {
  return markerType === 'finish_hill' || markerType === 'finish_mountain';
}

function hasClimbMarkerCategory(markerCategory: StageMarkerCategory | null): markerCategory is Exclude<StageMarkerCategory, 'Sprint'> {
  return markerCategory != null && STAGE_CLIMB_CATEGORIES.includes(markerCategory as Exclude<StageMarkerCategory, 'Sprint'>);
}

function isMountainClassificationMarker(markerType: StageMarkerType, markerCategory: StageMarkerCategory | null): boolean {
  return markerType === 'climb_top' || (isMountainFinishMarkerType(markerType) && hasClimbMarkerCategory(markerCategory));
}

function resolveStagesDir(): string {
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

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
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

function int(value: string, ctx: string): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed)) {
    throw new Error(`${ctx}: Ganzzahl erwartet, erhalten "${value}".`);
  }
  return parsed;
}

function float(value: string, ctx: string): number {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${ctx}: Zahl erwartet, erhalten "${value}".`);
  }
  return parsed;
}

function optionalText(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? '';
  return trimmed.length === 0 ? null : trimmed;
}

function parsePipeValues(value: string | undefined): string[] {
  const trimmed = value?.trim() ?? '';
  if (trimmed.length === 0) return [];
  return trimmed.split('|').map((part) => part.trim());
}

function optionalPipeValue(value: string): string | null {
  if (value.length === 0 || value.toLowerCase() === 'null') return null;
  return value;
}

function validateMarkerPlacement(markerType: StageMarkerType, scope: 'start' | 'end', ctx: string): void {
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

function validateMarkerCategory(markerType: StageMarkerType, markerCategory: StageMarkerCategory | null, ctx: string): void {
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

function parseMarkers(
  typeValue: string | undefined,
  nameValue: string | undefined,
  categoryValue: string | undefined,
  scope: 'start' | 'end',
  ctx: string,
): StageMarker[] {
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
    if (!STAGE_MARKER_TYPES.includes(markerTypeValue as StageMarkerType)) {
      throw new Error(`${ctx}: Ungueltiger marker_type "${markerTypeValue}".`);
    }

    const markerType = markerTypeValue as StageMarkerType;
    const markerName = optionalPipeValue(markerNameValues[index] ?? '');
    const markerCategoryValue = optionalPipeValue(markerCategoryValues[index] ?? '');
    const markerCategory = markerCategoryValue as StageMarkerCategory | null;
    validateMarkerPlacement(markerType, scope, ctx);
    validateMarkerCategory(markerType, markerCategory, ctx);

    return {
      type: markerType,
      name: markerName,
      cat: markerCategory,
    };
  });
}

function parseSegmentRow(row: Record<string, string>, index: number, startElevation: number): StageCsvSegment {
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
  if (!STAGE_TERRAINS.includes(terrainValue as StageTerrain)) {
    throw new Error(`${ctx}: Ungueltiges terrain "${terrainValue}".`);
  }
  const terrain = terrainValue as StageTerrain;

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

function validateClimbPairs(segments: StageCsvSegment[], filename: string): void {
  const openClimbs: Array<{ name: string | null; segmentIndex: number }> = [];

  const openClimb = (marker: StageMarker, ctx: string): void => {
    if (marker.type !== 'climb_start') {
      return;
    }
    openClimbs.push({ name: marker.name ?? null, segmentIndex: Number.parseInt(ctx.match(/Segment (\d+)/)?.[1] ?? '0', 10) });
  };

  const closeClimb = (marker: StageMarker, ctx: string): void => {
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

function toRecords(content: string, filename: string): Array<Record<string, string>> {
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

    return headers.reduce<Record<string, string>>((record, header, headerIndex) => {
      record[header] = values[headerIndex] ?? '';
      return record;
    }, {});
  });
}

function calculateSegmentEndElevation(startElevation: number, lengthKm: number, gradientPercent: number): number {
  return startElevation + ((lengthKm * 1000) * (gradientPercent / 100));
}

function createParsedSegment(segment: StageCsvSegment, startKm: number, index: number): ParsedStageSegment {
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

function derivePoints(segments: StageCsvSegment[], filename: string): StageProfilePoint[] {
  if (segments.length === 0) {
    throw new Error(`Stage-Datei ${filename}: Mindestens ein Segment ist erforderlich.`);
  }

  const points: StageProfilePoint[] = [];
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

function readStageSegments(filename: string, initialStartElevation: number): StageCsvSegment[] {
  if (filename.includes('/') || filename.includes('\\')) {
    throw new Error(`Stage-Dateiname darf keinen Pfad enthalten: ${filename}`);
  }

  const stagesDir = resolveStagesDir();
  const filePath = path.join(stagesDir, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Stage-Datei nicht gefunden: ${filePath}`);
  }

  const rows = toRecords(fs.readFileSync(filePath, 'utf8'), filename);
  let currentStartElevation: number | null = initialStartElevation;

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

function calculateElevationGain(points: StageProfilePoint[]): number {
  let gain = 0;
  for (let index = 1; index < points.length; index += 1) {
    gain += Math.max(0, points[index].elevation - points[index - 1].elevation);
  }
  return gain;
}

export class StageParser {
  public static parseStageProfile(filename: string, initialStartElevation: number): ParsedStageSegment[] {
    return StageParser.summarizeStageProfile(filename, initialStartElevation).segments;
  }

  public static summarizeStageProfile(filename: string, initialStartElevation: number): ParsedStageSummary {
    const stageSegments = readStageSegments(filename, initialStartElevation);
    const points = derivePoints(stageSegments, filename);
    return {
      distanceKm: points[points.length - 1]?.kmMark ?? 0,
      elevationGainMeters: calculateElevationGain(points),
      points,
      segments: stageSegments.map((segment, index) => createParsedSegment(segment, points[index]?.kmMark ?? 0, index)),
    };
  }
}

export function parseStageProfile(filename: string, initialStartElevation: number): ParsedStageSegment[] {
  return StageParser.parseStageProfile(filename, initialStartElevation);
}

export function summarizeStageProfile(filename: string, initialStartElevation: number): ParsedStageSummary {
  return StageParser.summarizeStageProfile(filename, initialStartElevation);
}