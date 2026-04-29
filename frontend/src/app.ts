import { api } from './api';
import type {
  GameState,
  SavegameMeta,
  Team,
  Rider,
  Race,
  StageFinishMarkerType,
  StageMarker,
  StageEditorDraft,
  StageEditorMetadata,
  StageEditorWaypoint,
  StageMarkerCategory,
  StageMarkerType,
  StageProfile,
  StageTerrain,
} from '../../shared/types';

// ============================================================
//  State
// ============================================================

const state: {
  currentSave: SavegameMeta | null;
  gameState: GameState | null;
  races: Race[];
  riders: Rider[];
  teams: Team[];
  teamTableSort: {
    key: TeamTableSortKey;
    direction: 'asc' | 'desc';
  };
  teamDetailsRiderId: number | null;
  stageEditorDraft: StageEditorDraft | null;
} = {
  currentSave: null,
  gameState: null,
  races: [],
  riders: [],
  teams: [],
  teamTableSort: {
    key: 'name',
    direction: 'asc',
  },
  teamDetailsRiderId: null,
  stageEditorDraft: null,
};

const STAGE_PROFILE_OPTIONS: StageProfile[] = [
  'Flat',
  'Rolling',
  'Hilly',
  'Hilly_Difficult',
  'Medium_Mountain',
  'Mountain',
  'High_Mountain',
  'ITT',
  'TTT',
  'Cobble',
  'Cobble_Hill',
];

const STAGE_TERRAIN_OPTIONS: StageTerrain[] = ['Flat', 'Hill', 'Medium_Mountain', 'Mountain', 'High_Mountain', 'Cobble', 'Cobble_Hill', 'Abfahrt', 'Sprint'];
const STAGE_MARKER_TYPES: StageMarkerType[] = ['start', 'climb_start', 'climb_top', 'sprint_intermediate', 'finish_flat', 'finish_TT', 'finish_hill', 'finish_mountain'];
const STAGE_MARKER_CATEGORIES: StageMarkerCategory[] = ['Sprint', '4', '3', '2', '1', 'HC'];
const STAGE_EDITOR_MIN_SEGMENT_KM = 0.2;
const STAGE_EDITOR_SPRINT_CUT_KM = 0.3;

function isFinishMarkerType(markerType: StageMarkerType): markerType is StageFinishMarkerType {
  return ['finish_flat', 'finish_TT', 'finish_hill', 'finish_mountain'].includes(markerType);
}

// ============================================================
//  DOM-Helpers
// ============================================================

function $<T extends HTMLElement = HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function esc(str: unknown): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function raceCategoryBadge(race: Race): string {
  if (race.isStageRace) {
    return `<span class="badge badge-live">Etappenrennen · ${race.numberOfStages} Etappen</span>`;
  }
  return '<span class="badge badge-todo">Eintagesrennen</span>';
}

function formatRaceDateRange(race: Race): string {
  return race.startDate === race.endDate
    ? formatDate(race.startDate)
    : `${formatDate(race.startDate)} - ${formatDate(race.endDate)}`;
}

function attrBar(value: number): string {
  const pct = Math.min(100, Math.max(0, value));
  const displayValue = Math.round(value);
  return `
    <div class="attr-bar-wrap">
      <span style="width:2.2em;text-align:right">${displayValue}</span>
      <div class="attr-bar"><div class="attr-bar-fill" style="width:${pct}%"></div></div>
    </div>`;
}

const TEAM_SKILL_COLUMNS: Array<{ key: keyof Rider['skills']; label: string }> = [
  { key: 'flat', label: 'Fl' },
  { key: 'mountain', label: 'Berg' },
  { key: 'mediumMountain', label: 'MB' },
  { key: 'hill', label: 'Hgl' },
  { key: 'timeTrial', label: 'ZF' },
  { key: 'prologue', label: 'Pro' },
  { key: 'cobble', label: 'Pf' },
  { key: 'sprint', label: 'Spr' },
  { key: 'acceleration', label: 'Acc' },
  { key: 'downhill', label: 'Abf' },
  { key: 'attack', label: 'Atk' },
  { key: 'stamina', label: 'Sta' },
  { key: 'resistance', label: 'Res' },
  { key: 'recuperation', label: 'Rec' },
  { key: 'bikeHandling', label: 'Ftg' },
];

type TeamTableSortKey = 'name' | 'countryCode' | 'birthYear' | 'age' | 'overallRating' | 'contractEndSeason' | 'roleName' | 'riderType' | keyof Rider['skills'];

interface TeamTableColumn {
  id: string;
  label: string;
  title: string;
  sortKey?: TeamTableSortKey;
  className?: string;
}

const TEAM_SKILL_TITLES: Record<keyof Rider['skills'], string> = {
  flat: 'Flach',
  mountain: 'Berg',
  mediumMountain: 'Mittlere Berge',
  hill: 'Hügel',
  timeTrial: 'Zeitfahren',
  prologue: 'Prolog',
  cobble: 'Pflaster',
  sprint: 'Sprint',
  acceleration: 'Antritt',
  downhill: 'Abfahrt',
  attack: 'Attacke',
  stamina: 'Stamina',
  resistance: 'Widerstand',
  recuperation: 'Regeneration',
  bikeHandling: 'Fahrtechnik',
};

const TEAM_TABLE_COLUMNS: TeamTableColumn[] = [
  { id: 'name', label: 'Name', title: 'Name - Nachname, Vorname', sortKey: 'name', className: 'team-table-col-name' },
  { id: 'flag', label: '', title: '', className: 'team-table-col-flag' },
  { id: 'code', label: 'Country', title: 'Country - Sortierung nach 3er-Code', sortKey: 'countryCode', className: 'team-table-col-code' },
  { id: 'birthYear', label: 'Jg', title: 'Geburtsjahr', sortKey: 'birthYear', className: 'team-table-col-year' },
  { id: 'age', label: 'Alt', title: 'Alter', sortKey: 'age', className: 'team-table-col-age' },
  { id: 'overallRating', label: 'Ges', title: 'Gesamtstärke', sortKey: 'overallRating', className: 'team-table-col-overall' },
  { id: 'contractEndSeason', label: 'V-Ende', title: 'Vertragsende - Ende des aktiven Vertrags', sortKey: 'contractEndSeason', className: 'team-table-col-contract' },
  { id: 'roleName', label: 'Rolle', title: 'Teamrolle des Fahrers', sortKey: 'roleName', className: 'team-table-col-role' },
  ...TEAM_SKILL_COLUMNS.map((column) => ({
    id: column.key,
    label: column.label,
    title: `${column.label} - ${TEAM_SKILL_TITLES[column.key]}`,
    sortKey: column.key,
    className: 'team-table-col-skill',
  })),
  { id: 'info', label: 'Info', title: 'Info - Profil und Vorlieben anzeigen', sortKey: 'riderType', className: 'team-table-col-info' },
];

const TEAM_TABLE_COLUMN_COUNT = TEAM_TABLE_COLUMNS.length;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function interpolateChannel(start: number, end: number, ratio: number): number {
  return Math.round(start + (end - start) * ratio);
}

function interpolateColor(start: [number, number, number], end: [number, number, number], ratio: number): string {
  return `rgb(${interpolateChannel(start[0], end[0], ratio)} ${interpolateChannel(start[1], end[1], ratio)} ${interpolateChannel(start[2], end[2], ratio)})`;
}

function getSkillColor(value: number): string {
  const colorStops: Array<{ value: number; color: [number, number, number] }> = [
    { value: 40, color: [86, 16, 28] },
    { value: 50, color: [132, 24, 38] },
    { value: 60, color: [185, 72, 18] },
    { value: 70, color: [212, 145, 24] },
    { value: 78, color: [88, 191, 92] },
    { value: 85, color: [196, 255, 188] },
  ];

  const boundedValue = clamp(value, colorStops[0].value, colorStops[colorStops.length - 1].value);

  for (let index = 1; index < colorStops.length; index += 1) {
    const previousStop = colorStops[index - 1];
    const currentStop = colorStops[index];
    if (boundedValue <= currentStop.value) {
      const ratio = (boundedValue - previousStop.value) / (currentStop.value - previousStop.value);
      return interpolateColor(previousStop.color, currentStop.color, ratio);
    }
  }

  return interpolateColor(colorStops[colorStops.length - 1].color, colorStops[colorStops.length - 1].color, 1);
}

function renderSkillValue(value: number): string {
  return `<span class="skill-value" style="color:${getSkillColor(value)}">${Math.round(value)}</span>`;
}

const FLAG_CODE_BY_CODE3: Record<string, string> = {
  BEL: 'be',
  FRA: 'fr',
  ITA: 'it',
  ESP: 'es',
  NED: 'nl',
  GER: 'de',
  GBR: 'gb',
  USA: 'us',
  COL: 'co',
  AUS: 'au',
  DEN: 'dk',
  NOR: 'no',
  SLO: 'si',
  POR: 'pt',
  SUI: 'ch',
  POL: 'pl',
  AUT: 'at',
  LUX: 'lu',
  IRE: 'ie',
  CZE: 'cz',
  SVK: 'sk',
  KAZ: 'kz',
  RSA: 'za',
  UAE: 'ae',
  BHR: 'bh',
  HUN: 'hu',
  OTH: 'un',
};

function renderFlag(code3: string): string {
  const alpha2 = FLAG_CODE_BY_CODE3[code3] ?? null;
  if (!alpha2) return '';
  return `<span class="fi fi-${alpha2} country-flag" aria-hidden="true"></span>`;
}

function renderCountry(country?: Team['country'] | Rider['country'], fallbackCode?: string): string {
  if (!country) return fallbackCode ? esc(fallbackCode) : '–';
  return `<span class="country-chip">${renderFlag(country.code3)}<span>${esc(country.name)}</span></span>`;
}

function formatKm(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} km`;
}

function formatElevationGain(value: number): string {
  return `${Math.round(value)} hm`;
}

function formatGradient(value: number): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1).replace('.', ',')}%`;
}

function slugifyFileName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60) || 'stage_details';
}

function stageProfileOptionsHtml(selected?: StageProfile): string {
  return STAGE_PROFILE_OPTIONS.map((profile) =>
    `<option value="${profile}"${profile === selected ? ' selected' : ''}>${esc(profile)}</option>`).join('');
}

function terrainOptionsHtml(selected: StageTerrain): string {
  return STAGE_TERRAIN_OPTIONS.map((terrain) =>
    `<option value="${terrain}"${terrain === selected ? ' selected' : ''}>${esc(terrain)}</option>`).join('');
}

function markerTypeSortValue(markerType: StageMarkerType): number {
  return STAGE_MARKER_TYPES.indexOf(markerType);
}

function normalizeIncomingMarkerType(markerType: string | null | undefined): StageMarkerType | null {
  if (!markerType) return null;
  if (markerType === 'finish') return 'finish_flat';
  return STAGE_MARKER_TYPES.includes(markerType as StageMarkerType) ? markerType as StageMarkerType : null;
}

function normalizeWaypointMarkers(waypoint: StageEditorWaypoint & {
  markerType?: string | null;
  markerName?: string | null;
  markerCat?: StageMarkerCategory | null;
  markers?: StageMarker[];
}): StageMarker[] {
  if (Array.isArray(waypoint.markers)) {
    return sortStageMarkers(waypoint.markers);
  }

  const markerType = normalizeIncomingMarkerType(waypoint.markerType);
  if (!markerType) return [];

  return [{
    type: markerType,
    name: waypoint.markerName?.trim() || null,
    cat: waypoint.markerCat ?? null,
  }];
}

function normalizeStageEditorDraft(draft: StageEditorDraft): StageEditorDraft {
  return {
    ...draft,
    waypoints: draft.waypoints.map((waypoint) => ({
      ...waypoint,
      techLevel: Number.isFinite(waypoint.techLevel) ? waypoint.techLevel : 5,
      windExp: Number.isFinite(waypoint.windExp) ? waypoint.windExp : 5,
      markers: normalizeWaypointMarkers(waypoint),
    })),
  };
}

function sortStageMarkers(markers: StageMarker[]): StageMarker[] {
  return [...markers].sort((left, right) => markerTypeSortValue(left.type) - markerTypeSortValue(right.type));
}

function parseMarkerTextList(rawValue: string): Array<string | null> {
  const trimmed = rawValue.trim();
  if (!trimmed) return [];
  return trimmed.split('|').map((part) => {
    const value = part.trim();
    return value.length === 0 || value.toLowerCase() === 'null' ? null : value;
  });
}

function markerInputValue(markers: StageMarker[], key: 'name' | 'cat'): string {
  return markers.map((marker) => marker[key] ?? 'null').join('|');
}

function markerLabelValue(markers: StageMarker[]): string {
  return markers.map((marker) => marker.type).join(' | ');
}

function markerCheckboxesHtml(waypoint: StageEditorWaypoint, index: number, totalWaypoints: number): string {
  return `<div class="stage-editor-marker-grid">${STAGE_MARKER_TYPES.map((markerType) => {
    const checked = waypoint.markers.some((marker) => marker.type === markerType);
    const locked = index === 0 && markerType === 'start';
    return `
      <label class="stage-editor-marker-option${locked ? ' is-locked' : ''}">
        <input
          type="checkbox"
          data-field="markerToggle"
          data-marker-type="${markerType}"
          ${checked ? 'checked' : ''}
          ${locked ? 'disabled' : ''}
        >
        <span>${esc(markerType)}</span>
      </label>`;
  }).join('')}</div>`;
}

function syncWaypointMarkerText(waypoint: StageEditorWaypoint, field: 'name' | 'cat', rawValue: string): void {
  const values = parseMarkerTextList(rawValue);
  waypoint.markers = sortStageMarkers(waypoint.markers.map((marker, index) => ({
    ...marker,
    [field]: values[index] ?? null,
  })));
}

function toggleWaypointMarker(index: number, markerType: StageMarkerType, checked: boolean): void {
  if (!state.stageEditorDraft) return;
  const waypoint = state.stageEditorDraft.waypoints[index];
  if (!waypoint) return;

  const existing = new Map(waypoint.markers.map((marker) => [marker.type, marker]));
  const selectedTypes = new Set(waypoint.markers.map((marker) => marker.type));
  if (checked) selectedTypes.add(markerType);
  else selectedTypes.delete(markerType);

  if (index === 0) selectedTypes.add('start');
  if (index === state.stageEditorDraft.waypoints.length - 1 && !Array.from(selectedTypes).some((type) => isFinishMarkerType(type))) {
    selectedTypes.add('finish_flat');
  }

  if (checked && isFinishMarkerType(markerType)) {
    Array.from(selectedTypes)
      .filter((type) => isFinishMarkerType(type) && type !== markerType)
      .forEach((type) => selectedTypes.delete(type));
  }

  waypoint.markers = sortStageMarkers(Array.from(selectedTypes).map((type) => existing.get(type) ?? {
    type,
    name: null,
    cat: null,
  }));

  renderStageEditor();
}

function initializeStageEditorForm(): void {
  $<HTMLSelectElement>('stage-editor-profile').innerHTML = stageProfileOptionsHtml('Flat');
  $('stage-editor-chart').innerHTML = '<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';
  $('stage-editor-climbs').innerHTML = '<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>';
}

function getWaypointSegmentInfo(waypoints: StageEditorWaypoint[], index: number): { lengthKm: number; gradientPercent: number } | null {
  const start = waypoints[index];
  const end = waypoints[index + 1];
  if (!start || !end) return null;
  const lengthKm = end.kmMark - start.kmMark;
  if (lengthKm <= 0) return null;
  const gradientPercent = ((end.elevation - start.elevation) / (lengthKm * 1000)) * 100;
  return { lengthKm, gradientPercent };
}

function setStageEditorDefaults(draft: StageEditorDraft): void {
  const profileSelect = $<HTMLSelectElement>('stage-editor-profile');
  profileSelect.innerHTML = stageProfileOptionsHtml(draft.suggestedProfile);
  profileSelect.value = draft.suggestedProfile;

  const detailsFileInput = $<HTMLInputElement>('stage-editor-details-file');
  if (!detailsFileInput.value.trim()) {
    detailsFileInput.value = `${slugifyFileName(draft.routeName)}.csv`;
  }

  const dateInput = $<HTMLInputElement>('stage-editor-date');
  if (!dateInput.value && state.gameState?.currentDate) {
    dateInput.value = state.gameState.currentDate;
  }
}

function getStageEditorIssues(draft: StageEditorDraft | null): string[] {
  if (!draft) return ['Noch keine Strecke importiert.'];

  const issues: string[] = [];
  if (draft.waypoints.length < 2) {
    issues.push('Mindestens zwei Wegpunkte sind erforderlich.');
    return issues;
  }

  if (draft.waypoints[0]?.kmMark !== 0) {
    issues.push('Der erste Wegpunkt muss bei 0,00 km liegen.');
  }

  if (!(draft.waypoints[0]?.markers ?? []).some((marker) => marker.type === 'start')) {
    issues.push('Der erste Wegpunkt muss als Start markiert sein.');
  }

  const lastWaypoint = draft.waypoints[draft.waypoints.length - 1];
  if (!(lastWaypoint.markers ?? []).some((marker) => isFinishMarkerType(marker.type))) {
    issues.push('Der letzte Wegpunkt muss als Ziel markiert sein.');
  }

  for (let index = 1; index < draft.waypoints.length; index += 1) {
    const previous = draft.waypoints[index - 1];
    const current = draft.waypoints[index];
    const deltaKm = Number((current.kmMark - previous.kmMark).toFixed(2));
    if (deltaKm < STAGE_EDITOR_MIN_SEGMENT_KM) {
      issues.push(`Segment ${index} ist mit ${deltaKm.toFixed(2)} km zu kurz.`);
    }
  }

  draft.waypoints.forEach((waypoint, waypointIndex) => {
    if (waypoint.techLevel < 1 || waypoint.techLevel > 10) {
      issues.push(`Wegpunkt ${waypointIndex + 1}: Tech muss zwischen 1 und 10 liegen.`);
    }
    if (waypoint.windExp < 1 || waypoint.windExp > 10) {
      issues.push(`Wegpunkt ${waypointIndex + 1}: Wind muss zwischen 1 und 10 liegen.`);
    }

    (waypoint.markers ?? []).forEach((marker) => {
      if (marker.cat != null && !STAGE_MARKER_CATEGORIES.includes(marker.cat)) {
        issues.push(`Wegpunkt ${waypointIndex + 1}: Ungültige Marker-Kategorie ${marker.cat}.`);
      }
    });
  });

  return issues;
}

function getStageEditorMetadataErrors(): string[] {
  const errors: string[] = [];
  const stageId = Number($<HTMLInputElement>('stage-editor-stage-id').value);
  const raceId = Number($<HTMLInputElement>('stage-editor-race-id').value);
  const stageNumber = Number($<HTMLInputElement>('stage-editor-stage-number').value);
  const date = $<HTMLInputElement>('stage-editor-date').value.trim();
  const detailsFile = $<HTMLInputElement>('stage-editor-details-file').value.trim();

  if (!Number.isInteger(stageId) || stageId <= 0) errors.push('Stage-ID fehlt oder ist ungültig.');
  if (!Number.isInteger(raceId) || raceId <= 0) errors.push('Race-ID fehlt oder ist ungültig.');
  if (!Number.isInteger(stageNumber) || stageNumber <= 0) errors.push('Etappennummer fehlt oder ist ungültig.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push('Datum muss im Format YYYY-MM-DD vorliegen.');
  if (!/^[A-Za-z0-9_.-]+\.csv$/.test(detailsFile) || detailsFile.includes('/')) {
    errors.push('Details-Datei muss ein Dateiname mit .csv-Endung ohne Pfad sein.');
  }

  return errors;
}

function readStageEditorMetadata(): StageEditorMetadata {
  return {
    stageId: Number($<HTMLInputElement>('stage-editor-stage-id').value),
    raceId: Number($<HTMLInputElement>('stage-editor-race-id').value),
    stageNumber: Number($<HTMLInputElement>('stage-editor-stage-number').value),
    date: $<HTMLInputElement>('stage-editor-date').value.trim(),
    profile: $<HTMLSelectElement>('stage-editor-profile').value as StageProfile,
    detailsCsvFile: $<HTMLInputElement>('stage-editor-details-file').value.trim(),
  };
}

function downloadTextFile(fileName: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function renderStageEditorChart(draft: StageEditorDraft | null): string {
  if (!draft || draft.waypoints.length < 2) {
    return '<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';
  }

  const width = 920;
  const height = 280;
  const paddingX = 24;
  const paddingY = 20;
  const waypoints = draft.waypoints;
  const totalDistanceKm = waypoints[waypoints.length - 1].kmMark;
  const minElevation = Math.min(...waypoints.map((waypoint) => waypoint.elevation));
  const maxElevation = Math.max(...waypoints.map((waypoint) => waypoint.elevation));
  const elevationRange = Math.max(1, maxElevation - minElevation);
  const points = waypoints.map((waypoint) => {
    const x = paddingX + (waypoint.kmMark / Math.max(totalDistanceKm, 0.1)) * (width - paddingX * 2);
    const y = height - paddingY - ((waypoint.elevation - minElevation) / elevationRange) * (height - paddingY * 2);
    return { x, y, waypoint };
  });

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${(width - paddingX).toFixed(1)} ${(height - paddingY).toFixed(1)} L ${paddingX.toFixed(1)} ${(height - paddingY).toFixed(1)} Z`;
  const markerLines = points
    .filter((point) => point.waypoint.markers.length > 0)
    .map((point) => `
      <line x1="${point.x.toFixed(1)}" y1="${paddingY}" x2="${point.x.toFixed(1)}" y2="${(height - paddingY).toFixed(1)}" class="stage-editor-chart-marker-line" />
      <text x="${point.x.toFixed(1)}" y="14" class="stage-editor-chart-marker-label">${esc(markerLabelValue(point.waypoint.markers))}</text>`)
    .join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Stage-Profil ${esc(draft.routeName)}">
      <defs>
        <linearGradient id="stage-editor-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="rgba(96, 165, 250, 0.38)"></stop>
          <stop offset="100%" stop-color="rgba(14, 165, 233, 0.04)"></stop>
        </linearGradient>
      </defs>
      <line x1="${paddingX}" y1="${height - paddingY}" x2="${width - paddingX}" y2="${height - paddingY}" class="stage-editor-chart-axis" />
      <line x1="${paddingX}" y1="${paddingY}" x2="${paddingX}" y2="${height - paddingY}" class="stage-editor-chart-axis" />
      ${markerLines}
      <path d="${areaPath}" fill="url(#stage-editor-area)"></path>
      <path d="${linePath}" class="stage-editor-chart-line"></path>
      ${points.map((point) => `<circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="3.5" class="stage-editor-chart-point"></circle>`).join('')}
      <text x="${paddingX}" y="${paddingY - 4}" class="stage-editor-chart-scale">${Math.round(maxElevation)} m</text>
      <text x="${paddingX}" y="${height - 4}" class="stage-editor-chart-scale">${Math.round(minElevation)} m</text>
      <text x="${width - paddingX}" y="${height - 4}" text-anchor="end" class="stage-editor-chart-scale">${formatKm(totalDistanceKm)}</text>
    </svg>`;
}

function renderStageEditor(): void {
  const draft = state.stageEditorDraft;
  const summary = $('stage-editor-import-summary');
  const warnings = $('stage-editor-warnings');
  const climbs = $('stage-editor-climbs');
  const emptyState = $('stage-editor-empty');
  const chart = $('stage-editor-chart');
  const tbody = $('stage-editor-waypoints-body');
  const exportHint = $('stage-editor-export-hint');
  const exportButton = $<HTMLButtonElement>('btn-stage-editor-export');

  if (!draft) {
    summary.innerHTML = '';
    warnings.innerHTML = '';
    climbs.innerHTML = '<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>';
    emptyState.classList.remove('hidden');
    chart.innerHTML = renderStageEditorChart(null);
    tbody.innerHTML = '<tr><td colspan="11" class="text-muted">Keine Wegpunkte vorhanden.</td></tr>';
    exportHint.textContent = 'Importiere zuerst eine Datei.';
    exportButton.disabled = true;
    return;
  }

  emptyState.classList.add('hidden');
  const issues = getStageEditorIssues(draft);
  const metadataErrors = getStageEditorMetadataErrors();

  summary.innerHTML = `
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Route</span><strong>${esc(draft.routeName)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Distanz</span><strong>${formatKm(draft.totalDistanceKm)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Anstieg</span><strong>${draft.elevationGainMeters} m</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Profil</span><strong>${esc(draft.suggestedProfile)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Wegpunkte</span><strong>${draft.waypoints.length}</strong></div>`;

  const alertItems = [...draft.warnings, ...issues, ...metadataErrors];
  warnings.innerHTML = alertItems.length === 0
    ? '<div class="stage-editor-alert stage-editor-alert-ok">Export bereit. Keine Validierungsfehler.</div>'
    : alertItems.map((item) => `<div class="stage-editor-alert">${esc(item)}</div>`).join('');

  climbs.innerHTML = draft.climbs.length === 0
    ? '<p class="text-muted">Keine relevanten Climb-Vorschläge erkannt.</p>'
    : draft.climbs.map((climb) => `
      <div class="stage-editor-climb">
        <strong>Kat. ${esc(climb.category)}</strong>
        <span>${formatKm(climb.startKm)} - ${formatKm(climb.endKm)}</span>
        <span>${climb.gainMeters} hm · ${climb.avgGradient.toFixed(1).replace('.', ',')}%</span>
      </div>`).join('');

  chart.innerHTML = renderStageEditorChart(draft);
  tbody.innerHTML = draft.waypoints.map((waypoint, index) => `
    <tr data-waypoint-index="${index}">
      <td><input type="number" step="0.01" min="0" value="${waypoint.kmMark.toFixed(2)}" data-field="kmMark" ${index === 0 ? 'readonly' : ''}></td>
      <td><input type="number" step="1" value="${waypoint.elevation}" data-field="elevation"></td>
      <td><input type="text" value="${esc(getWaypointSegmentInfo(draft.waypoints, index)?.lengthKm != null ? formatKm(getWaypointSegmentInfo(draft.waypoints, index)!.lengthKm) : '–')}" readonly></td>
      <td><input type="text" value="${esc(getWaypointSegmentInfo(draft.waypoints, index)?.gradientPercent != null ? formatGradient(getWaypointSegmentInfo(draft.waypoints, index)!.gradientPercent) : '–')}" readonly></td>
      <td><select data-field="terrain">${terrainOptionsHtml(waypoint.terrain)}</select></td>
      <td><input type="number" step="1" min="1" max="10" value="${waypoint.techLevel}" data-field="techLevel"></td>
      <td><input type="number" step="1" min="1" max="10" value="${waypoint.windExp}" data-field="windExp"></td>
      <td>${markerCheckboxesHtml(waypoint, index, draft.waypoints.length)}</td>
      <td><input type="text" value="${esc(markerInputValue(waypoint.markers, 'name'))}" data-field="markerNames" placeholder="Name|Name oder null"></td>
      <td><input type="text" value="${esc(markerInputValue(waypoint.markers, 'cat'))}" data-field="markerCats" placeholder="HC|null"></td>
      <td class="stage-editor-row-actions">
        ${index < draft.waypoints.length - 1 ? `<button type="button" class="btn btn-secondary btn-xs" data-waypoint-action="insert" data-waypoint-index="${index}">+</button>` : ''}
        ${index > 0 && index < draft.waypoints.length - 1 ? `<button type="button" class="btn btn-danger btn-xs" data-waypoint-action="delete" data-waypoint-index="${index}">×</button>` : ''}
      </td>
    </tr>`).join('');

  exportButton.disabled = alertItems.length > 0;
  exportHint.textContent = alertItems.length > 0
    ? `${alertItems.length} Validierungshinweise vor dem Export.`
    : `Exportiert ${$<HTMLInputElement>('stage-editor-details-file').value || 'stage_details.csv'} und eine stages-Row.`;
}

function updateStageEditorWaypoint(index: number, field: keyof StageEditorWaypoint | 'markerNames' | 'markerCats', rawValue: string): void {
  if (!state.stageEditorDraft) return;
  const waypoint = state.stageEditorDraft.waypoints[index];
  if (!waypoint) return;

  switch (field) {
    case 'kmMark':
      waypoint.kmMark = Number.parseFloat(rawValue || '0');
      break;
    case 'elevation':
      waypoint.elevation = Number.parseInt(rawValue || '0', 10);
      break;
    case 'terrain':
      waypoint.terrain = rawValue as StageTerrain;
      break;
    case 'techLevel':
      waypoint.techLevel = Number.parseInt(rawValue || '0', 10);
      break;
    case 'windExp':
      waypoint.windExp = Number.parseInt(rawValue || '0', 10);
      break;
    case 'markerNames':
      syncWaypointMarkerText(waypoint, 'name', rawValue);
      break;
    case 'markerCats':
      syncWaypointMarkerText(waypoint, 'cat', rawValue);
      break;
    default:
      break;
  }

  renderStageEditor();
}

function insertStageEditorWaypoint(index: number): void {
  if (!state.stageEditorDraft) return;
  const current = state.stageEditorDraft.waypoints[index];
  const next = state.stageEditorDraft.waypoints[index + 1];
  if (!current || !next) return;
  const newWaypoint: StageEditorWaypoint = {
    kmMark: Number(((current.kmMark + next.kmMark) / 2).toFixed(2)),
    elevation: Math.round((current.elevation + next.elevation) / 2),
    terrain: current.terrain,
    techLevel: Math.round((current.techLevel + next.techLevel) / 2),
    windExp: Math.round((current.windExp + next.windExp) / 2),
    markers: [],
  };
  state.stageEditorDraft.waypoints.splice(index + 1, 0, newWaypoint);
  renderStageEditor();
}

function deleteStageEditorWaypoint(index: number): void {
  if (!state.stageEditorDraft) return;
  if (index <= 0 || index >= state.stageEditorDraft.waypoints.length - 1) return;
  state.stageEditorDraft.waypoints.splice(index, 1);
  renderStageEditor();
}

async function onStageEditorImport(): Promise<void> {
  const input = $<HTMLInputElement>('stage-editor-file');
  const file = input.files?.[0];
  if (!file) {
    alert('Bitte zuerst eine GPX- oder TCX-Datei auswählen.');
    return;
  }

  $('stage-editor-file-hint').textContent = `${file.name} · ${(file.size / 1024).toFixed(1).replace('.', ',')} KB`;
  showLoading('Route wird importiert…');
  try {
    const fileContent = await file.text();
    const res = await api.importStageRoute({ fileName: file.name, fileContent });
    if (!res.success || !res.data) {
      alert(`Import fehlgeschlagen: ${res.error ?? 'Unbekannter Fehler'}`);
      return;
    }

    const normalizedDraft = normalizeStageEditorDraft(res.data);
    state.stageEditorDraft = normalizedDraft;
    setStageEditorDefaults(normalizedDraft);
    renderStageEditor();
    activateView('stage-editor');
  } finally {
    hideLoading();
  }
}

async function onStageEditorExport(): Promise<void> {
  if (!state.stageEditorDraft) {
    alert('Es gibt noch keine importierte Strecke.');
    return;
  }

  const issues = [...getStageEditorIssues(state.stageEditorDraft), ...getStageEditorMetadataErrors()];
  if (issues.length > 0) {
    alert(`Export blockiert:\n\n${issues.join('\n')}`);
    renderStageEditor();
    return;
  }

  showLoading('CSV-Dateien werden erstellt…');
  try {
    const res = await api.exportStageRoute({
      metadata: readStageEditorMetadata(),
      draft: state.stageEditorDraft,
    });
    if (!res.success || !res.data) {
      alert(`Export fehlgeschlagen: ${res.error ?? 'Unbekannter Fehler'}`);
      return;
    }

    downloadTextFile(res.data.stagesFileName, res.data.stagesCsv);
    downloadTextFile(res.data.stageDetailsFileName, res.data.stageDetailsCsv);
  } finally {
    hideLoading();
  }
}

function getRiderCountryCode(rider: Rider): string {
  return rider.country?.code3 ?? rider.nationality;
}

function formatRiderName(rider: Rider): string {
  return `${rider.lastName} ${rider.firstName}`;
}

function getRiderRoleName(rider: Rider): string {
  return rider.role?.name ?? (rider.roleId != null ? `Rolle ${rider.roleId}` : '–');
}

function getTeamTopAverage(teamId: number, limit = 12): number | null {
  const teamRiders = state.riders
    .filter(rider => rider.activeTeamId === teamId)
    .sort((left, right) => right.overallRating - left.overallRating)
    .slice(0, limit);

  if (teamRiders.length === 0) return null;
  const total = teamRiders.reduce((sum, rider) => sum + rider.overallRating, 0);
  return total / teamRiders.length;
}

function getTeamAverage(teamId: number): number | null {
  const teamRiders = state.riders.filter(rider => rider.activeTeamId === teamId);
  if (teamRiders.length === 0) return null;
  const total = teamRiders.reduce((sum, rider) => sum + rider.overallRating, 0);
  return total / teamRiders.length;
}

function formatTeamTopAverage(teamId: number): string {
  const average = getTeamTopAverage(teamId);
  return average == null ? '–' : average.toFixed(1).replace('.', ',');
}

function formatTeamAverage(teamId: number): string {
  const average = getTeamAverage(teamId);
  return average == null ? '–' : average.toFixed(1).replace('.', ',');
}

function compareStrings(left: string, right: string): number {
  return left.localeCompare(right, 'de', { sensitivity: 'base' });
}

function getSortIndicator(sortKey: TeamTableSortKey): string {
  if (state.teamTableSort.key !== sortKey) return '<span class="team-table-sort-indicator">↕</span>';
  return `<span class="team-table-sort-indicator team-table-sort-indicator-active">${state.teamTableSort.direction === 'asc' ? '↑' : '↓'}</span>`;
}

function renderTeamTableHeader(column: TeamTableColumn): string {
  if (!column.sortKey) {
    return `<th class="${column.className ?? ''}"></th>`;
  }

  const activeClass = state.teamTableSort.key === column.sortKey ? ' team-table-sort-active' : '';
  return `
    <th class="${column.className ?? ''}">
      <button
        type="button"
        class="team-table-sort${activeClass}"
        data-team-sort="${column.sortKey}"
        title="${esc(column.title)}"
        aria-label="${esc(column.title)}"
      >
        <span class="team-table-sort-label">${esc(column.label)}</span>
        ${getSortIndicator(column.sortKey)}
      </button>
    </th>`;
}

function sortTeamRiders(riders: Rider[]): Rider[] {
  const sortedRiders = [...riders];
  const directionFactor = state.teamTableSort.direction === 'asc' ? 1 : -1;

  sortedRiders.sort((left, right) => {
    let comparison = 0;

    switch (state.teamTableSort.key) {
      case 'name':
        comparison = compareStrings(left.lastName, right.lastName) || compareStrings(left.firstName, right.firstName);
        break;
      case 'countryCode':
        comparison = compareStrings(getRiderCountryCode(left), getRiderCountryCode(right));
        break;
      case 'birthYear':
        comparison = left.birthYear - right.birthYear;
        break;
      case 'age':
        comparison = (left.age ?? 0) - (right.age ?? 0);
        break;
      case 'overallRating':
        comparison = left.overallRating - right.overallRating;
        break;
      case 'contractEndSeason':
        comparison = (left.contractEndSeason ?? Number.MAX_SAFE_INTEGER) - (right.contractEndSeason ?? Number.MAX_SAFE_INTEGER);
        break;
      case 'roleName':
        comparison = compareStrings(getRiderRoleName(left), getRiderRoleName(right));
        break;
      case 'riderType':
        comparison = compareStrings(left.riderType, right.riderType)
          || compareStrings(formatRiderName(left), formatRiderName(right));
        break;
      default:
        comparison = left.skills[state.teamTableSort.key] - right.skills[state.teamTableSort.key];
        break;
    }

    if (comparison === 0) {
      comparison = compareStrings(left.lastName, right.lastName) || compareStrings(left.firstName, right.firstName);
    }

    return comparison * directionFactor;
  });

  return sortedRiders;
}

function renderRacePrefs(raceIds: number[]): string {
  if (raceIds.length === 0) return '–';
  return raceIds.map(raceId => {
    const race = state.races.find(entry => entry.id === raceId);
    return race ? esc(race.name) : `Rennen ${raceId}`;
  }).join(', ');
}

function getRiderSpecializationLabel(value: Rider['riderType'] | Rider['specialization1']): string {
  switch (value) {
    case 'Berg':
      return 'Bergfahrer';
    case 'Hill':
      return 'Hügelspezialist';
    case 'Sprint':
      return 'Sprinter';
    case 'Timetrial':
      return 'Zeitfahrer';
    case 'Cobble':
      return 'Pflasterspezialist';
    case 'Attacker':
      return 'Angreifer';
    default:
      return value ?? 'Keine Spezialisierung';
  }
}

function renderRiderInsightRow(rider: Rider): string {
  const riderTags = [
    rider.hasGrandTourTag ? 'Grand Tour' : null,
    rider.hasStageRaceTag ? 'Etappenrennen' : null,
    rider.hasOneDayClassicTag ? 'One Day Classic' : null,
  ].filter(Boolean).join(' · ');
  const riderSpecializations = [rider.specialization1, rider.specialization2, rider.specialization3]
    .filter((value): value is NonNullable<typeof value> => value != null)
    .map(getRiderSpecializationLabel)
    .join(' · ');

  return `
    <tr class="team-detail-expansion-row">
      <td colspan="${TEAM_TABLE_COLUMN_COUNT}">
        <div class="rider-insight-panel">
          <div class="rider-insight-group">
            <div class="rider-insight-title">Profil</div>
            <div><span class="text-muted">Rolle:</span> ${esc(getRiderRoleName(rider))}</div>
            <div><strong>${esc(getRiderSpecializationLabel(rider.riderType))}</strong></div>
            <div class="text-muted">${esc(riderSpecializations || 'Keine Spezialisierung')}</div>
            <div class="text-muted">Tags: ${esc(riderTags || 'Keine Tags')}</div>
            <div class="text-muted">Skill-Development: ${rider.skillDevelopment ?? '–'}</div>
            <div class="text-muted">${rider.isStageRacer ? 'Etappenfahrer' : 'Kein Etappenfokus'} / ${rider.isOneDayRacer ? 'Eintagesfahrer' : 'Kein Eintagesfokus'}</div>
            <div class="text-muted">Vertragsende: ${rider.contractEndSeason ?? '–'}</div>
          </div>
          <div class="rider-insight-group">
            <div class="rider-insight-title">Vorlieben</div>
            <div><span class="text-muted">Fav:</span> ${renderRacePrefs(rider.favoriteRaces)}</div>
            <div><span class="text-muted">No:</span> ${renderRacePrefs(rider.nonFavoriteRaces)}</div>
          </div>
        </div>
      </td>
    </tr>`;
}

// ============================================================
//  Screens / Modals / Loading
// ============================================================

function showScreen(name: 'menu' | 'game'): void {
  document.querySelectorAll<HTMLElement>('.screen').forEach(s => s.classList.add('hidden'));
  ($(`screen-${name}`)).classList.remove('hidden');
}

function showModal(name: string): void { $(`modal-${name}`).classList.remove('hidden'); }
function hideModal(name: string): void { $(`modal-${name}`).classList.add('hidden'); }

function showLoading(msg = 'Lade…'): void {
  $('loading-msg').textContent = msg;
  $('loading-overlay').classList.remove('hidden');
}
function hideLoading(): void { $('loading-overlay').classList.add('hidden'); }

function showError(elemId: string, msg: string): void {
  const el = $(elemId);
  el.textContent = msg;
  el.classList.remove('hidden');
}
function hideError(elemId: string): void { $(elemId).classList.add('hidden'); }

function activateView(name: string): void {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll<HTMLElement>('.nav-btn').forEach(b => b.classList.remove('active'));
  $(`view-${name}`).classList.add('active');
  document.querySelector<HTMLElement>(`.nav-btn[data-view="${name}"]`)?.classList.add('active');
}

// ============================================================
//  Save-Liste
// ============================================================

async function loadSavesList(): Promise<void> {
  const res = await api.listSaves();
  const container = $('saves-list');
  if (!res.success || !res.data || res.data.length === 0) {
    container.classList.add('hidden');
    return;
  }
  container.classList.remove('hidden');
  container.innerHTML = res.data.map(save => `
    <div class="save-card">
      <h3>${esc(save.careerName)}</h3>
      <p class="save-meta">
        ${esc(save.teamName)} · Saison ${save.currentSeason}
        ${save.lastSaved ? '· ' + formatDate(save.lastSaved) : ''}
      </p>
      <div class="save-actions">
        <button class="btn btn-primary btn-sm" data-save-action="load" data-filename="${esc(save.filename)}">Laden</button>
        <button class="btn btn-danger btn-sm" data-save-action="delete" data-filename="${esc(save.filename)}" data-career-name="${esc(save.careerName)}">Löschen</button>
      </div>
    </div>
  `).join('');
}

async function onLoadSave(filename: string): Promise<void> {
  showLoading('Karriere wird geladen…');
  const res = await api.loadSave(filename);
  hideLoading();
  if (!res.success) { alert('Fehler beim Laden: ' + res.error); return; }
  state.currentSave = res.data ?? null;
  await enterGameScreen();
}

async function onDeleteSave(filename: string, name: string): Promise<void> {
  if (!confirm(`Karriere "${name}" wirklich löschen?`)) return;
  showLoading('Löschen…');
  const res = await api.deleteSave(filename);
  hideLoading();
  if (!res.success) { alert('Fehler: ' + res.error); return; }
  await loadSavesList();
}

// ============================================================
//  Neue Karriere
// ============================================================

$('btn-new-career').addEventListener('click', async () => {
  hideError('new-career-error');
  ($<HTMLInputElement>('input-career-name')).value = '';
  const select = $<HTMLSelectElement>('input-team-id');
  select.innerHTML = '<option value="">Wird geladen…</option>';
  showModal('newCareer');
  const res = await api.getAvailableTeams();
  if (!res.success || !res.data?.length) {
    select.innerHTML = '<option value="">Fehler beim Laden der Teams</option>';
    return;
  }
  select.innerHTML = res.data.map(t =>
    `<option value="${t.id}">${esc(t.name)} (${esc(t.division ?? t.divisionName ?? '')})</option>`,
  ).join('');
});
$('btn-cancel-new').addEventListener('click', () => hideModal('newCareer'));

$('btn-confirm-new').addEventListener('click', async () => {
  const careerName = ($<HTMLInputElement>('input-career-name')).value.trim();
  const teamIdVal  = ($<HTMLSelectElement>('input-team-id')).value;
  if (!careerName || !teamIdVal) {
    showError('new-career-error', 'Bitte Karriere-Name und Team auswählen.');
    return;
  }
  const teamId = Number(teamIdVal);
  const slug     = careerName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20);
  const filename = `${slug}_${Date.now()}.db`;
  hideError('new-career-error');
  showLoading('Neue Karriere wird erstellt…');
  const res = await api.createSave(filename, careerName, teamId);
  if (!res.success) { hideLoading(); showError('new-career-error', res.error ?? 'Unbekannter Fehler.'); return; }
  const loadRes = await api.loadSave(filename);
  hideLoading();
  hideModal('newCareer');
  if (!loadRes.success) { alert('Fehler: ' + loadRes.error); return; }
  state.currentSave = loadRes.data ?? null;
  await enterGameScreen();
});

// ============================================================
//  Karriere laden
// ============================================================

$('btn-load-career').addEventListener('click', () => loadSavesList());

$('saves-list').addEventListener('click', async (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button[data-save-action]');
  if (!button) return;
  const { saveAction, filename, careerName } = button.dataset;
  if (!filename) return;
  if (saveAction === 'load') { await onLoadSave(filename); return; }
  if (saveAction === 'delete') { await onDeleteSave(filename, careerName ?? filename); }
});

// ============================================================
//  Game Screen
// ============================================================

async function enterGameScreen(): Promise<void> {
  showScreen('game');
  $('meta-career').textContent = state.currentSave?.careerName ?? '';
  activateView('dashboard');
  showLoading('Spiel wird geladen…');
  try {
    await loadGameState();
    await loadRaces();
    await loadTeams();   // erst Teams laden
    await loadRoster();  // dann Kader (renderTeams hat dann vollst. Daten)
    renderDashboard();
  } catch (e) {
    alert('Fehler beim Laden des Spiels: ' + (e as Error).message);
  } finally {
    hideLoading();
  }
}

document.querySelectorAll<HTMLElement>('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const view = btn.dataset['view'] ?? '';
    activateView(view);
    if (view === 'teams') loadTeams(); // immer neu laden bei Nav-Klick
  });
});

$<HTMLSelectElement>('teams-dropdown').addEventListener('change', (e) => {
  const val = (e.target as HTMLSelectElement).value;
  state.teamDetailsRiderId = null;
  renderTeamDetail(val ? Number(val) : null);
});

$('teams-detail').addEventListener('click', (event) => {
  const sortButton = (event.target as Element).closest<HTMLButtonElement>('button[data-team-sort]');
  if (sortButton) {
    const sortKey = sortButton.dataset['teamSort'] as TeamTableSortKey;
    if (state.teamTableSort.key === sortKey) {
      state.teamTableSort.direction = state.teamTableSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      state.teamTableSort = {
        key: sortKey,
        direction: sortKey === 'birthYear' || sortKey === 'age' || sortKey === 'overallRating' ? 'desc' : 'asc',
      };
    }
    const selectedTeamId = Number($<HTMLSelectElement>('teams-dropdown').value);
    renderTeamDetail(Number.isFinite(selectedTeamId) ? selectedTeamId : null);
    return;
  }

  const infoButton = (event.target as Element).closest<HTMLButtonElement>('button[data-rider-info]');
  if (!infoButton) return;

  const riderId = Number(infoButton.dataset['riderInfo']);
  state.teamDetailsRiderId = state.teamDetailsRiderId === riderId ? null : riderId;
  const selectedTeamId = Number($<HTMLSelectElement>('teams-dropdown').value);
  renderTeamDetail(Number.isFinite(selectedTeamId) ? selectedTeamId : null);
});

$('btn-back-menu').addEventListener('click', () => {
  showScreen('menu');
  loadSavesList();
});

$('btn-stage-editor-import').addEventListener('click', () => {
  void onStageEditorImport();
});

$('btn-stage-editor-export').addEventListener('click', () => {
  void onStageEditorExport();
});

$('stage-editor-file').addEventListener('change', (event) => {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null;
  $('stage-editor-file-hint').textContent = file
    ? `${file.name} · ${(file.size / 1024).toFixed(1).replace('.', ',')} KB`
    : 'Noch keine Datei ausgewählt.';
});

$('stage-editor-waypoints').addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement;
  const row = target.closest<HTMLTableRowElement>('tr[data-waypoint-index]');
  const field = target.dataset['field'] as (keyof StageEditorWaypoint | 'markerNames' | 'markerCats' | 'markerToggle') | undefined;
  if (!row || !field) return;
  const index = Number(row.dataset['waypointIndex']);
  if (!Number.isInteger(index)) return;
  if (field === 'markerToggle') {
    const markerType = target.dataset['markerType'] as StageMarkerType | undefined;
    if (!markerType || !(target instanceof HTMLInputElement)) return;
    toggleWaypointMarker(index, markerType, target.checked);
    return;
  }
  updateStageEditorWaypoint(index, field, target.value);
});

$('stage-editor-waypoints').addEventListener('click', (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button[data-waypoint-action]');
  if (!button) return;
  const index = Number(button.dataset['waypointIndex']);
  if (!Number.isInteger(index)) return;
  if (button.dataset['waypointAction'] === 'insert') {
    insertStageEditorWaypoint(index);
    return;
  }
  if (button.dataset['waypointAction'] === 'delete') {
    deleteStageEditorWaypoint(index);
  }
});

['stage-editor-stage-id', 'stage-editor-race-id', 'stage-editor-stage-number', 'stage-editor-date', 'stage-editor-details-file', 'stage-editor-profile'].forEach((id) => {
  $(id).addEventListener('change', () => renderStageEditor());
});

$('btn-advance-day').addEventListener('click', async () => {
  showLoading('Tag wird fortgeschrieben...');
  try {
    const res = await api.advanceDay();
    if (!res.success) {
      alert('Tageswechsel fehlgeschlagen:\n' + (res.error ?? 'Unbekannter Fehler'));
      return;
    }
    state.gameState = res.data ?? null;
    renderGameState();
    if (state.currentSave && res.data) state.currentSave.currentSeason = res.data.season;
    // Rennen immer neu laden – haelt den Kalenderstatus aktuell
    await loadRaces();
  } catch (e) {
    alert('Unerwarteter Fehler beim Tageswechsel: ' + (e as Error).message);
  } finally {
    hideLoading();
  }
});

async function loadGameState(): Promise<void> {
  const res = await api.getGameState();
  if (!res.success) { console.error(res.error); return; }
  state.gameState = res.data ?? null;
  renderGameState();
  renderDashboard();
  if (state.currentSave && res.data) state.currentSave.currentSeason = res.data.season;
}

function renderGameState(): void {
  if (!state.gameState) return;
  $('meta-date').textContent = state.gameState.formattedDate;
  $('meta-season').textContent = `Saison ${state.gameState.season}`;
  const hint = $('meta-race-hint');
  if (state.gameState.hasRaceToday) {
    hint.textContent = `${state.gameState.racesTodayCount} Rennen für heute im Kalender`;
    hint.classList.remove('hidden');
  } else {
    hint.textContent = '';
    hint.classList.add('hidden');
  }
}

function renderDashboard(): void {
  const playerTeam = state.teams.find(t => t.isPlayerTeam)
    ?? state.teams.find(t => t.name === state.currentSave?.teamName)
    ?? null;
  $('dashboard-career').textContent   = state.currentSave?.careerName ?? '–';
  $('dashboard-team').textContent     = playerTeam?.name ?? state.currentSave?.teamName ?? '–';
  $('dashboard-date').textContent     = state.gameState?.formattedDate ?? '–';
  $('dashboard-season').textContent   = state.gameState ? `Saison ${state.gameState.season}` : '–';
  $('dashboard-races-today').textContent = String(state.gameState?.racesTodayCount ?? 0);
  renderDashboardRaces();
}

// ============================================================
//  Rennen
// ============================================================

async function loadRaces(): Promise<void> {
  const res = await api.getRaces();
  if (!res.success) { console.error(res.error); return; }
  state.races = res.data ?? [];
  renderDashboard();
}

function renderDashboardRaces(): void {
  const tbody = $('dashboard-races-tbody');
  const visibleRaces = state.races
    .filter(race => !state.gameState || race.endDate >= state.gameState.currentDate)
    .slice(0, 8);

  if (visibleRaces.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-muted">Keine kommenden Rennen.</td></tr>';
    return;
  }

  tbody.innerHTML = visibleRaces.map(race => {
    const isLive = state.gameState != null
      && race.startDate <= state.gameState.currentDate
      && race.endDate >= state.gameState.currentDate;
    const isDone = state.gameState != null && race.endDate < state.gameState.currentDate;
    const statusBadge = isDone
      ? `<span class="badge badge-done">Abgeschlossen</span>`
      : isLive
        ? `<span class="badge badge-live">Läuft</span>`
        : `<span class="badge badge-todo">Geplant</span>`;
    const location = race.country?.name ?? `Land ${race.countryId}`;
    const categoryName = race.category?.name ?? `Kategorie ${race.categoryId}`;
    const distance = race.upcomingStage?.distanceKm != null ? formatKm(race.upcomingStage.distanceKm) : '–';
    const elevation = race.upcomingStage?.elevationGainMeters != null ? formatElevationGain(race.upcomingStage.elevationGainMeters) : '–';
    const stageHint = race.isStageRace && race.upcomingStage
      ? `<div class="text-muted">Etappe ${race.upcomingStage.stageNumber} · ${esc(race.upcomingStage.profile)}</div>`
      : '';
    return `
      <tr>
        <td>${formatRaceDateRange(race)}</td>
        <td><strong>${esc(race.name)}</strong>${stageHint}</td>
        <td>${raceCategoryBadge(race)}</td>
        <td>${esc(location)}</td>
        <td>${esc(categoryName)}</td>
        <td>${distance}</td>
        <td>${elevation}</td>
        <td>${statusBadge}</td>
      </tr>`;
  }).join('');
}

// ============================================================
//  Roster & Teams
// ============================================================

async function loadRoster(): Promise<void> {
  const res = await api.getRiders();
  if (!res.success) { console.error(res.error); return; }
  state.riders = res.data ?? [];
  renderTeams();
  renderDashboard();
}

async function loadTeams(): Promise<void> {
  const res = await api.getTeams();
  if (!res.success) {
    console.error('loadTeams Fehler:', res.error);
    $('teams-detail').innerHTML = `<p class="error-msg">Teams konnten nicht geladen werden: ${esc(res.error ?? 'Unbekannt')}</p>`;
    return;
  }
  state.teams = res.data ?? [];
  renderTeams();
  renderDashboard();
}

function renderTeams(): void {
  const dropdown = $<HTMLSelectElement>('teams-dropdown');
  const currentVal = dropdown.value;
  dropdown.innerHTML = '<option value="">– Team auswählen –</option>' +
    state.teams.map(t =>
      `<option value="${t.id}"${String(t.id) === currentVal ? ' selected' : ''}>${esc(t.name)} (${esc(t.division ?? t.divisionName ?? '')}) · ${esc(t.abbreviation)}</option>`,
    ).join('');
  const selectedId = currentVal ? Number(currentVal) : null;
  renderTeamDetail(selectedId);
}

function renderTeamDetail(teamId: number | null): void {
  const detail = $('teams-detail');
  if (teamId === null) {
    detail.innerHTML = '<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswählen.</p>';
    return;
  }
  const team = state.teams.find(t => t.id === teamId);
  if (!team) { detail.innerHTML = ''; return; }
  const riders = sortTeamRiders(state.riders.filter(r => r.activeTeamId === teamId));
  const divBadge = team.division === 'U23' ? 'badge-u23' : 'badge-classics';
  detail.innerHTML = `
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${esc(team.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${divBadge}">${esc(team.division ?? team.divisionName ?? '')}</span>
          <span>${renderCountry(team.country, team.countryCode)}</span>
          <span>Kürzel: ${esc(team.abbreviation)} · Top 12 ${esc(formatTeamTopAverage(team.id))} (${esc(formatTeamAverage(team.id))})</span>
          ${team.isPlayerTeam ? '<span class="badge badge-live">Spielerteam</span>' : ''}
        </div>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${riders.length} Fahrer</span>
        <span class="text-muted">Sortierung: ${esc(state.teamTableSort.key === 'name' ? 'Nachname' : state.teamTableSort.key === 'countryCode' ? 'Country' : state.teamTableSort.key === 'birthYear' ? 'Jahrgang' : state.teamTableSort.key === 'age' ? 'Alter' : state.teamTableSort.key === 'overallRating' ? 'Gesamt' : state.teamTableSort.key === 'contractEndSeason' ? 'Vertragsende' : state.teamTableSort.key === 'roleName' ? 'Rolle' : state.teamTableSort.key === 'riderType' ? 'Profil' : TEAM_SKILL_TITLES[state.teamTableSort.key])} ${state.teamTableSort.direction === 'asc' ? 'aufsteigend' : 'absteigend'}</span>
      </div>
      <table class="data-table data-table-teams" style="margin-top:1rem">
        <thead><tr>
          ${TEAM_TABLE_COLUMNS.map(renderTeamTableHeader).join('')}
        </tr></thead>
        <tbody>
          ${riders.length === 0
            ? `<tr><td colspan="${TEAM_TABLE_COLUMN_COUNT}" class="text-muted">Keine Fahrer.</td></tr>`
            : riders.map(r => {
              const countryCode = getRiderCountryCode(r);
              const isExpanded = state.teamDetailsRiderId === r.id;
              return `
              <tr class="team-detail-row${isExpanded ? ' team-detail-row-expanded' : ''}">
                <td class="team-table-name-cell"><strong>${esc(formatRiderName(r))}</strong></td>
                <td class="team-table-flag-cell">${renderFlag(countryCode)}</td>
                <td class="team-table-code-cell">${esc(countryCode)}</td>
                <td>${r.birthYear}</td>
                <td>${r.age ?? '–'}</td>
                <td>${renderSkillValue(r.overallRating)}</td>
                <td>${r.contractEndSeason ?? '–'}</td>
                <td>${esc(getRiderRoleName(r))}</td>
                ${TEAM_SKILL_COLUMNS.map(column => `<td>${renderSkillValue(r.skills[column.key])}</td>`).join('')}
                <td class="team-table-info-cell">
                  <button
                    type="button"
                    class="info-toggle${isExpanded ? ' info-toggle-active' : ''}"
                    data-rider-info="${r.id}"
                    title="Profil und Vorlieben ${isExpanded ? 'ausblenden' : 'anzeigen'}"
                    aria-expanded="${isExpanded ? 'true' : 'false'}"
                    aria-label="Profil und Vorlieben ${isExpanded ? 'ausblenden' : 'anzeigen'}"
                  >i</button>
                </td>
              </tr>
              ${isExpanded ? renderRiderInsightRow(r) : ''}`;
            }).join('')}
        </tbody>
      </table>
    </div>`;
}

// ============================================================
//  Init
// ============================================================

(async () => {
  initializeStageEditorForm();
  renderStageEditor();
  showScreen('menu');
  await loadSavesList();
})();
