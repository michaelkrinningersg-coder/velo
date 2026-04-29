import { api } from './api';
import type { GameState, SavegameMeta, Team, Rider, Race, TimeTrialResult } from '../../shared/types';

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
};

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

function raceTypeBadge(type: string): string {
  const map: Record<string, [string, string]> = {
    TimeTrial: ['badge-tt',       'Zeitfahren'],
    Flat:      ['badge-flat',     'Flach'],
    Hilly:     ['badge-hilly',    'Hügelig'],
    Mountain:  ['badge-mountain', 'Berge'],
    Classics:  ['badge-classics', 'Klassiker'],
  };
  const [cls, label] = map[type] ?? ['badge-todo', type];
  return `<span class="badge ${cls}">${label}</span>`;
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
    // Rennen immer neu laden – hält isCompleted aktuell
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
    .filter(race => !state.gameState || race.isCompleted || race.date >= state.gameState.currentDate)
    .slice(0, 8);

  if (visibleRaces.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-muted">Keine kommenden Rennen.</td></tr>';
    return;
  }

  tbody.innerHTML = visibleRaces.map(race => {
    const isToday = state.gameState?.currentDate === race.date;
    const canRun  = race.type === 'TimeTrial' && isToday && !race.isCompleted;
    const canShowResults = race.type === 'TimeTrial' && race.isCompleted;
    const statusBadge = race.isCompleted
      ? `<span class="badge badge-done">Abgeschlossen</span>`
      : isToday
        ? `<span class="badge badge-live">Heute</span>`
        : `<span class="badge badge-todo">Ausstehend</span>`;
    let actionBtn = `<button class="btn btn-secondary btn-xs" disabled>–</button>`;
    if (canRun)         actionBtn = `<button class="btn btn-primary btn-xs" data-race-action="run-tt" data-race-id="${race.id}">▶ Starten</button>`;
    if (canShowResults) actionBtn = `<button class="btn btn-ghost btn-xs" data-race-action="show-results" data-race-id="${race.id}">Ergebnisse</button>`;
    return `
      <tr>
        <td>${formatDate(race.date)}</td>
        <td><strong>${esc(race.name)}</strong></td>
        <td>${raceTypeBadge(race.type)}</td>
        <td>${race.profile.distanceKm.toFixed(1)} km</td>
        <td>${race.profile.elevationGain.toLocaleString('de-DE')} m</td>
        <td>${statusBadge}</td>
        <td>${actionBtn}</td>
      </tr>`;
  }).join('');
}

$('dashboard-races-tbody').addEventListener('click', async (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button[data-race-action]');
  if (!button) return;
  const raceId = Number(button.dataset['raceId']);
  if (!Number.isFinite(raceId)) return;
  if (button.dataset['raceAction'] === 'run-tt')       await onRunTimeTrial(raceId);
  if (button.dataset['raceAction'] === 'show-results') await onShowRaceResults(raceId);
});

async function onRunTimeTrial(raceId: number): Promise<void> {
  showLoading('Zeitfahren wird simuliert…');
  const res = await api.runTimeTrial(raceId);
  hideLoading();
  if (!res.success || !res.data) { alert('Fehler: ' + res.error); return; }
  renderTTResult(res.data);
  showModal('ttResult');
  await loadRaces(); // Rennen als abgeschlossen markieren
}

async function onShowRaceResults(raceId: number): Promise<void> {
  showLoading('Ergebnisse werden geladen…');
  const res = await api.getRaceResults(raceId);
  hideLoading();
  if (!res.success || !res.data) { alert('Keine Ergebnisse verfügbar.'); return; }
  renderTTResult(res.data);
  showModal('ttResult');
}

// ============================================================
//  TT-Ergebnis Modal
// ============================================================

$('btn-close-tt').addEventListener('click', () => hideModal('ttResult'));

function renderTTResult(result: TimeTrialResult): void {
  $('tt-result-race-name').textContent = result.raceName;
  $('tt-result-meta').textContent =
    `${formatDate(result.date)} · ${result.distanceKm.toFixed(1)} km · Saison ${result.season}`;

  $('tt-result-tbody').innerHTML = result.entries.map((entry, idx) => {
    const pos = idx + 1;
    const posClass = pos <= 3 ? `pos-${pos}` : '';
    const formVal = entry.dayFormFactor;
    const form = formVal >= 1.08
      ? `<span style="color:var(--success)">↑${formVal.toFixed(3)}</span>`
      : formVal <= 0.92
        ? `<span style="color:var(--danger)">↓${formVal.toFixed(3)}</span>`
        : formVal.toFixed(3);

      const team = state.teams.find(t => t.id === entry.rider.activeTeamId);
    return `
      <tr>
        <td class="${posClass}">${pos}</td>
        <td><strong>${esc(entry.rider.firstName)} ${esc(entry.rider.lastName)}</strong></td>
        <td>${renderCountry(entry.rider.country, entry.rider.nationality)}</td>
        <td>${team ? esc(team.abbreviation) : '–'}</td>
          <td>${attrBar(entry.rider.skills.timeTrial)}</td>
        <td>${form}</td>
        <td style="font-family:var(--font-mono)">${esc(entry.finishTimeFormatted)}</td>
        <td style="font-family:var(--font-mono);color:var(--text-500)">${esc(entry.gapFormatted)}</td>
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
  showScreen('menu');
  await loadSavesList();
})();
