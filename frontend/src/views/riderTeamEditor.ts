import { api } from '../api';
import {
  $,
  esc,
  state,
  clamp,
  getSkillColor,
  downloadTextFile,
} from '../state';
import { compareStrings } from './teams';
import type {
  RiderTeamEditorPayload,
  RiderTeamEditorRiderRow,
  RiderTeamEditorTeamSummary,
} from '../../../shared/types';
import type { RiderTeamEditorSortKey } from '../state';

export interface RiderTeamEditorColumn {
  key: RiderTeamEditorSortKey;
  label: string;
  title: string;
  inputType: 'number' | 'text' | 'team' | 'readonly';
  className?: string;
}

export const RIDER_TEAM_EDITOR_COLUMNS: RiderTeamEditorColumn[] = [
  { key: 'riderId', label: 'ID', title: 'Fahrer-ID', inputType: 'number', className: 'team-table-col-year' },
  { key: 'firstName', label: 'Vorname', title: 'Vorname', inputType: 'text', className: 'team-table-col-name' },
  { key: 'lastName', label: 'Nachname', title: 'Nachname', inputType: 'text', className: 'team-table-col-name' },
  { key: 'countryId', label: 'Land', title: 'Country-ID', inputType: 'number', className: 'team-table-col-year' },
  { key: 'birthYear', label: 'Jg', title: 'Geburtsjahr', inputType: 'number', className: 'team-table-col-year' },
  { key: 'teamName', label: 'Team', title: 'Teamzuordnung', inputType: 'team', className: 'team-table-col-program' },
  { key: 'overallRating', label: 'Ges', title: 'Gesamtstärke wie im Teams-Menü', inputType: 'readonly', className: 'team-table-col-overall' },
  { key: 'skillFlat', label: 'Fl', title: 'Flach', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillMountain', label: 'Berg', title: 'Berg', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillMediumMountain', label: 'MB', title: 'Mittlere Berge', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillHill', label: 'Hgl', title: 'Hügel', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillTimeTrial', label: 'ZF', title: 'Zeitfahren', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillPrologue', label: 'Pro', title: 'Prolog', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillCobble', label: 'Pf', title: 'Pflaster', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillSprint', label: 'Spr', title: 'Sprint', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillAcceleration', label: 'Acc', title: 'Antritt', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillDownhill', label: 'Abf', title: 'Abfahrt', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillAttack', label: 'Atk', title: 'Attacke', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillStamina', label: 'Sta', title: 'Stamina', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillResistance', label: 'Res', title: 'Widerstand', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'skillRecuperation', label: 'Rec', title: 'Regeneration', inputType: 'number', className: 'team-table-col-skill' },
  { key: 'favoriteRaces', label: 'Favs', title: 'Lieblingsrennen', inputType: 'text', className: 'team-table-col-preferences' },
  { key: 'nonFavoriteRaces', label: 'Nos', title: 'Nicht bevorzugte Rennen', inputType: 'text', className: 'team-table-col-preferences' },
];

export function resolveRiderTeamEditorTeamKey(teamId: number | null): string {
  return teamId == null ? 'free-agents' : String(teamId);
}

export function getRiderTeamEditorTeamName(teamId: number | null): string {
  const payload = state.riderTeamEditorPayload;
  if (!payload) {
    return teamId == null ? 'Free Agents' : '–';
  }
  return payload.teams.find((team) => team.teamId === teamId)?.name ?? (teamId == null ? 'Free Agents' : `Team ${teamId}`);
}

export function calculateEditorOverall(rider: RiderTeamEditorRiderRow): number {
  const sum = rider.skillFlat +
    rider.skillMountain +
    rider.skillMediumMountain +
    rider.skillHill +
    rider.skillTimeTrial +
    rider.skillCobble +
    rider.skillSprint * 1.2 +
    rider.skillStamina +
    rider.skillResistance +
    rider.skillRecuperation +
    rider.skillAcceleration;
  return clamp(sum / 11.2, 0, 100);
}

export function getDefaultRiderTeamEditorSortDirection(sortKey: RiderTeamEditorSortKey): 'asc' | 'desc' {
  return [
    'riderId',
    'countryId',
    'birthYear',
    'overallRating',
    'skillFlat',
    'skillMountain',
    'skillMediumMountain',
    'skillHill',
    'skillTimeTrial',
    'skillPrologue',
    'skillCobble',
    'skillSprint',
    'skillAcceleration',
    'skillDownhill',
    'skillAttack',
    'skillStamina',
    'skillResistance',
    'skillRecuperation',
  ].includes(sortKey) ? 'desc' : 'asc';
}

export function getRiderTeamEditorSortIndicator(sortKey: RiderTeamEditorSortKey): string {
  if (state.riderTeamEditorSort.key !== sortKey) return '<span class="team-table-sort-indicator">↕</span>';
  return `<span class="team-table-sort-indicator team-table-sort-indicator-active">${state.riderTeamEditorSort.direction === 'asc' ? '↑' : '↓'}</span>`;
}

export function renderRiderTeamEditorHeader(column: RiderTeamEditorColumn): string {
  const activeClass = state.riderTeamEditorSort.key === column.key ? ' team-table-sort-active' : '';
  return `
    <th class="${column.className ?? ''}">
      <button
        type="button"
        class="team-table-sort${activeClass}"
        data-rider-team-editor-sort="${column.key}"
        title="${esc(column.title)}"
        aria-label="${esc(column.title)}"
      >
        <span class="team-table-sort-label">${esc(column.label)}</span>
        ${getRiderTeamEditorSortIndicator(column.key)}
      </button>
    </th>`;
}

export function compareRiderTeamEditorRows(left: RiderTeamEditorRiderRow, right: RiderTeamEditorRiderRow): number {
  switch (state.riderTeamEditorSort.key) {
    case 'riderId': return left.riderId - right.riderId;
    case 'firstName': return compareStrings(left.firstName, right.firstName);
    case 'lastName': return compareStrings(left.lastName, right.lastName);
    case 'countryId': return left.countryId - right.countryId;
    case 'birthYear': return left.birthYear - right.birthYear;
    case 'teamName': return compareStrings(getRiderTeamEditorTeamName(left.teamId), getRiderTeamEditorTeamName(right.teamId));
    case 'overallRating': return left.overallRating - right.overallRating;
    case 'skillFlat': return left.skillFlat - right.skillFlat;
    case 'skillMountain': return left.skillMountain - right.skillMountain;
    case 'skillMediumMountain': return left.skillMediumMountain - right.skillMediumMountain;
    case 'skillHill': return left.skillHill - right.skillHill;
    case 'skillTimeTrial': return left.skillTimeTrial - right.skillTimeTrial;
    case 'skillPrologue': return left.skillPrologue - right.skillPrologue;
    case 'skillCobble': return left.skillCobble - right.skillCobble;
    case 'skillSprint': return left.skillSprint - right.skillSprint;
    case 'skillAcceleration': return left.skillAcceleration - right.skillAcceleration;
    case 'skillDownhill': return left.skillDownhill - right.skillDownhill;
    case 'skillAttack': return left.skillAttack - right.skillAttack;
    case 'skillStamina': return left.skillStamina - right.skillStamina;
    case 'skillResistance': return left.skillResistance - right.skillResistance;
    case 'skillRecuperation': return left.skillRecuperation - right.skillRecuperation;
    case 'favoriteRaces': return compareStrings(left.favoriteRaces, right.favoriteRaces);
    case 'nonFavoriteRaces': return compareStrings(left.nonFavoriteRaces, right.nonFavoriteRaces);
    default: return 0;
  }
}

export function sortRiderTeamEditorRows(rows: RiderTeamEditorRiderRow[]): RiderTeamEditorRiderRow[] {
  const direction = state.riderTeamEditorSort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((left, right) => (
    (compareRiderTeamEditorRows(left, right)
      || compareStrings(left.lastName, right.lastName)
      || compareStrings(left.firstName, right.firstName)
      || left.riderId - right.riderId) * direction
  ));
}

export function getFilteredRiderTeamEditorRows(payload: RiderTeamEditorPayload): RiderTeamEditorRiderRow[] {
  const selectedKey = state.riderTeamEditorSelectedTeamKey;
  if (!selectedKey) {
    return [];
  }
  const baseRows = payload.riders.filter((rider) => resolveRiderTeamEditorTeamKey(rider.teamId) === selectedKey);
  return sortRiderTeamEditorRows(baseRows);
}

export function renderRiderTeamEditorTeamOptions(teamId: number | null): string {
  const payload = state.riderTeamEditorPayload;
  if (!payload) {
    return '<option value="free-agents">Free Agents</option>';
  }

  return payload.teams.map((team) => {
    const key = resolveRiderTeamEditorTeamKey(team.teamId);
    return `<option value="${key}"${team.teamId === teamId ? ' selected' : ''}>${esc(team.name)}</option>`;
  }).join('');
}

export function isDirtyRiderTeamEditorRow(riderId: number): boolean {
  return state.riderTeamEditorDirtyRiderIds.includes(riderId);
}

export function renderRiderTeamEditorCell(rider: RiderTeamEditorRiderRow, column: RiderTeamEditorColumn): string {
  const dirtyClass = isDirtyRiderTeamEditorRow(rider.riderId) ? ' rider-team-editor-input-dirty' : '';
  switch (column.inputType) {
    case 'readonly':
      return `<td><span class="skill-value" style="color:${getSkillColor(rider.overallRating)}">${Math.round(rider.overallRating)}</span></td>`;
    case 'team':
      return `<td><select class="rider-team-editor-input${dirtyClass}" data-rider-team-editor-field="teamId" data-rider-team-editor-rider-id="${rider.riderId}">${renderRiderTeamEditorTeamOptions(rider.teamId)}</select></td>`;
    case 'number': {
      const value = rider[column.key as keyof RiderTeamEditorRiderRow] as number;
      return `<td><input type="number" class="rider-team-editor-input${dirtyClass}" data-rider-team-editor-field="${column.key}" data-rider-team-editor-rider-id="${rider.riderId}" value="${value}"></td>`;
    }
    case 'text': {
      const value = String(rider[column.key as keyof RiderTeamEditorRiderRow] ?? '');
      return `<td><input type="text" class="rider-team-editor-input${dirtyClass}" data-rider-team-editor-field="${column.key}" data-rider-team-editor-rider-id="${rider.riderId}" value="${esc(value)}"></td>`;
    }
    default:
      return '<td>–</td>';
  }
}

export function renderRiderTeamEditorSidebar(payload: RiderTeamEditorPayload): string {
  const teams = [...payload.teams].sort((left, right) => left.rank - right.rank || compareStrings(left.name, right.name));
  return `
    <aside class="rider-team-editor-sidebar">
      <div class="team-detail-card">
        <div class="team-detail-header">
          <h3>Teamübersicht</h3>
        </div>
        <div class="rider-team-editor-sidebar-list">
          <div class="rider-team-editor-sidebar-item rider-team-editor-sidebar-summary">
            <span>Alle Teams</span>
            <strong>${payload.riders.length}</strong>
          </div>
          ${teams.map((team) => `
            <button type="button" class="rider-team-editor-sidebar-item${state.riderTeamEditorSelectedTeamKey === resolveRiderTeamEditorTeamKey(team.teamId) ? ' is-active' : ''}" data-rider-team-editor-team-filter="${resolveRiderTeamEditorTeamKey(team.teamId)}">
              <span class="rider-team-editor-sidebar-main">
                <span>${esc(team.name)}</span>
                <span class="text-muted">${esc(team.abbreviation)} · ${esc(team.divisionName)}</span>
              </span>
              <span class="rider-team-editor-sidebar-stats">
                <strong>${team.riderCount}</strong>
                <span>Ø ${team.averageOverall != null ? team.averageOverall.toFixed(1).replace('.', ',') : '–'} · #${team.rank}</span>
              </span>
            </button>
          `).join('')}
        </div>
      </div>
    </aside>`;
}

export function renderRiderTeamEditor(): void {
  const root = $('rider-team-editor-root');
  const meta = $('rider-team-editor-meta');
  const payload = state.riderTeamEditorPayload;
  if (!payload) {
    root.innerHTML = '<div class="results-empty">Editor wird geladen.</div>';
    meta.textContent = 'Masterdaten aus riders.csv bearbeiten.';
    return;
  }

  const selectedTeam = state.riderTeamEditorSelectedTeamKey
    ? payload.teams.find((team) => resolveRiderTeamEditorTeamKey(team.teamId) === state.riderTeamEditorSelectedTeamKey) ?? null
    : null;
  const rows = getFilteredRiderTeamEditorRows(payload);
  const dirtyCount = state.riderTeamEditorDirtyRiderIds.length;
  const selectedTeamText = selectedTeam == null
    ? 'Kein Team gewählt'
    : `${selectedTeam.riderCount} Fahrer · Ø ${selectedTeam.averageOverall != null ? selectedTeam.averageOverall.toFixed(1).replace('.', ',') : '–'} · Rang #${selectedTeam.rank}`;

  meta.textContent = selectedTeam == null
    ? 'Masterdaten aus riders.csv bearbeiten. Fahrer werden erst nach Teamauswahl geladen.'
    : `${selectedTeam.name} · ${selectedTeamText}`;

  root.innerHTML = `
    <div class="rider-team-editor-layout">
      <section class="rider-team-editor-main">
        <div class="team-detail-card">
          <div class="rider-team-editor-toolbar">
            <div class="teams-selector rider-team-editor-selector">
              <label for="rider-team-editor-team-select">Team auswählen</label>
              <select id="rider-team-editor-team-select">
                <option value=""${state.riderTeamEditorSelectedTeamKey === '' ? ' selected' : ''}>– Team auswählen –</option>
                ${payload.teams.map((team) => `
                  <option value="${resolveRiderTeamEditorTeamKey(team.teamId)}"${state.riderTeamEditorSelectedTeamKey === resolveRiderTeamEditorTeamKey(team.teamId) ? ' selected' : ''}>${esc(team.name)} (${team.riderCount})</option>
                `).join('')}
              </select>
            </div>
            <div class="team-detail-meta">
              <span>${selectedTeamText}</span>
              <span class="text-muted">Sortierung: ${esc(state.riderTeamEditorSort.key === 'teamName' ? 'Team' : RIDER_TEAM_EDITOR_COLUMNS.find((column) => column.key === state.riderTeamEditorSort.key)?.title ?? state.riderTeamEditorSort.key)} ${state.riderTeamEditorSort.direction === 'asc' ? 'aufsteigend' : 'absteigend'}</span>
              <span class="text-muted">Ungespeichert: ${dirtyCount}</span>
            </div>
            <div class="rider-team-editor-actions">
              <button type="button" class="btn btn-secondary" data-rider-team-editor-action="reload">Neu laden</button>
              <button type="button" class="btn btn-secondary" data-rider-team-editor-action="export" ${state.riderTeamEditorExporting ? 'disabled' : ''}>${state.riderTeamEditorExporting ? 'Exportiert…' : 'riders.csv exportieren'}</button>
              <button type="button" class="btn btn-primary" data-rider-team-editor-action="save" ${dirtyCount === 0 || state.riderTeamEditorSaving ? 'disabled' : ''}>${state.riderTeamEditorSaving ? 'Speichert…' : 'Änderungen speichern'}</button>
            </div>
          </div>
          <div class="team-detail-table-scroll rider-team-editor-table-scroll">
            <table class="data-table data-table-teams rider-team-editor-table">
              <thead>
                <tr>
                  ${RIDER_TEAM_EDITOR_COLUMNS.map(renderRiderTeamEditorHeader).join('')}
                </tr>
              </thead>
              <tbody>
                ${rows.length === 0
                  ? `<tr><td colspan="${RIDER_TEAM_EDITOR_COLUMNS.length}" class="text-muted">${state.riderTeamEditorSelectedTeamKey ? 'Keine Fahrer im aktuellen Team.' : 'Bitte zuerst ein Team im Dropdown auswählen.'}</td></tr>`
                  : rows.map((rider) => `
                    <tr class="team-detail-row${isDirtyRiderTeamEditorRow(rider.riderId) ? ' rider-team-editor-row-dirty' : ''}">
                      ${RIDER_TEAM_EDITOR_COLUMNS.map((column) => renderRiderTeamEditorCell(rider, column)).join('')}
                    </tr>
                  `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      ${renderRiderTeamEditorSidebar(payload)}
    </div>`;
}

export function rebuildRiderTeamEditorTeams(payload: RiderTeamEditorPayload): RiderTeamEditorTeamSummary[] {
  const realTeams = payload.teams.filter((team) => !team.isFreeAgents).map((team) => ({
    teamId: team.teamId,
    name: team.name,
    abbreviation: team.abbreviation,
    divisionName: team.divisionName,
    isFreeAgents: false,
  }));

  const summaries = realTeams.map((team) => {
    const teamRiders = payload.riders.filter((rider) => rider.teamId === team.teamId);
    const averageOverall = teamRiders.length === 0
      ? null
      : Math.round((teamRiders.reduce((sum, rider) => sum + rider.overallRating, 0) / teamRiders.length) * 100) / 100;
    return {
      ...team,
      riderCount: teamRiders.length,
      averageOverall,
      rank: 0,
    } satisfies RiderTeamEditorTeamSummary;
  });

  const freeAgents = payload.riders.filter((rider) => rider.teamId == null);
  summaries.push({
    teamId: null,
    name: 'Free Agents',
    abbreviation: 'FA',
    divisionName: 'Free Agents',
    riderCount: freeAgents.length,
    averageOverall: freeAgents.length === 0 ? null : Math.round((freeAgents.reduce((sum, rider) => sum + rider.overallRating, 0) / freeAgents.length) * 100) / 100,
    rank: 0,
    isFreeAgents: true,
  });

  const ranked = [...summaries].sort((left, right) => {
    const leftAverage = left.averageOverall ?? -1;
    const rightAverage = right.averageOverall ?? -1;
    return rightAverage - leftAverage || right.riderCount - left.riderCount || compareStrings(left.name, right.name);
  });
  const rankByKey = new Map(ranked.map((entry, index) => [resolveRiderTeamEditorTeamKey(entry.teamId), index + 1]));
  return summaries.map((team) => ({
    ...team,
    rank: rankByKey.get(resolveRiderTeamEditorTeamKey(team.teamId)) ?? summaries.length,
  }));
}

export async function loadRiderTeamEditorData(force = false): Promise<void> {
  if (state.riderTeamEditorPayload && !force) {
    renderRiderTeamEditor();
    return;
  }

  $('rider-team-editor-root').innerHTML = '<div class="results-empty">Editor wird geladen.</div>';
  const res = await api.getRiderTeamEditor();
  if (!res.success || !res.data) {
    $('rider-team-editor-root').innerHTML = `<div class="results-empty">${esc(res.error ?? 'Editor konnte nicht geladen werden.')}</div>`;
    return;
  }

  state.riderTeamEditorPayload = res.data;
  state.riderTeamEditorDirtyRiderIds = [];
  state.riderTeamEditorSaving = false;
  state.riderTeamEditorExporting = false;
  if (state.riderTeamEditorSelectedTeamKey) {
    const exists = res.data.teams.some((team) => resolveRiderTeamEditorTeamKey(team.teamId) === state.riderTeamEditorSelectedTeamKey);
    if (!exists) {
      state.riderTeamEditorSelectedTeamKey = '';
    }
  }
  renderRiderTeamEditor();
}

export function updateRiderTeamEditorField(riderId: number, field: keyof RiderTeamEditorRiderRow, rawValue: string): void {
  const payload = state.riderTeamEditorPayload;
  if (!payload) {
    return;
  }

  const rider = payload.riders.find((entry) => entry.riderId === riderId);
  if (!rider) {
    return;
  }

  if (field === 'teamId') {
    rider.teamId = rawValue === 'free-agents' ? null : Number.parseInt(rawValue, 10);
  } else if (typeof rider[field] === 'number') {
    (rider[field] as any) = Number.parseInt(rawValue || '0', 10);
  } else {
    (rider[field] as any) = rawValue;
  }

  rider.overallRating = calculateEditorOverall(rider);
  payload.teams = rebuildRiderTeamEditorTeams(payload);
  if (!state.riderTeamEditorDirtyRiderIds.includes(riderId)) {
    state.riderTeamEditorDirtyRiderIds = [...state.riderTeamEditorDirtyRiderIds, riderId];
  }
  renderRiderTeamEditor();
}

export async function saveRiderTeamEditorData(): Promise<void> {
  if (!state.riderTeamEditorPayload || state.riderTeamEditorSaving) {
    return;
  }

  state.riderTeamEditorSaving = true;
  renderRiderTeamEditor();
  const res = await api.saveRiderTeamEditor({ riders: state.riderTeamEditorPayload.riders });
  state.riderTeamEditorSaving = false;
  if (!res.success || !res.data) {
    alert(`Editor konnte nicht gespeichert werden:\n${res.error ?? 'Unbekannter Fehler'}`);
    renderRiderTeamEditor();
    return;
  }

  state.riderTeamEditorPayload = res.data;
  state.riderTeamEditorDirtyRiderIds = [];
  renderRiderTeamEditor();
}

export async function exportRiderTeamEditorData(): Promise<void> {
  if (!state.riderTeamEditorPayload || state.riderTeamEditorExporting) {
    return;
  }

  state.riderTeamEditorExporting = true;
  renderRiderTeamEditor();
  const res = await api.exportRiderTeamEditor({ riders: state.riderTeamEditorPayload.riders });
  state.riderTeamEditorExporting = false;
  if (!res.success || !res.data) {
    alert(`riders.csv konnte nicht exportiert werden:\n${res.error ?? 'Unbekannter Fehler'}`);
    renderRiderTeamEditor();
    return;
  }

  downloadTextFile(res.data.fileName, res.data.content);
  renderRiderTeamEditor();
}

export function initRiderTeamEditorListeners(): void {
  $('view-rider-team-editor').addEventListener('click', (event) => {
    const sortButton = (event.target as Element).closest<HTMLButtonElement>('button[data-rider-team-editor-sort]');
    if (sortButton) {
      const sortKey = sortButton.dataset['riderTeamEditorSort'] as RiderTeamEditorSortKey;
      if (state.riderTeamEditorSort.key === sortKey) {
        state.riderTeamEditorSort.direction = state.riderTeamEditorSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        state.riderTeamEditorSort = {
          key: sortKey,
          direction: getDefaultRiderTeamEditorSortDirection(sortKey),
        };
      }
      renderRiderTeamEditor();
      return;
    }

    const filterButton = (event.target as Element).closest<HTMLButtonElement>('button[data-rider-team-editor-team-filter]');
    if (filterButton) {
      state.riderTeamEditorSelectedTeamKey = filterButton.dataset['riderTeamEditorTeamFilter'] ?? '';
      renderRiderTeamEditor();
      return;
    }

    const actionButton = (event.target as Element).closest<HTMLButtonElement>('button[data-rider-team-editor-action]');
    if (actionButton) {
      const action = actionButton.dataset['riderTeamEditorAction'];
      if (action === 'reload') {
        void loadRiderTeamEditorData(true);
        return;
      }
      if (action === 'export') {
        void exportRiderTeamEditorData();
        return;
      }
      if (action === 'save') {
        void saveRiderTeamEditorData();
      }
    }
  });

  $('view-rider-team-editor').addEventListener('change', (event) => {
    const filterSelect = (event.target as Element).closest<HTMLSelectElement>('#rider-team-editor-team-select');
    if (filterSelect) {
      state.riderTeamEditorSelectedTeamKey = filterSelect.value;
      renderRiderTeamEditor();
      return;
    }

    const input = (event.target as Element).closest<HTMLInputElement | HTMLSelectElement>('.rider-team-editor-input');
    if (input) {
      const riderId = Number(input.dataset['riderTeamEditorRiderId']);
      const field = input.dataset['riderTeamEditorField'] as keyof RiderTeamEditorRiderRow;
      if (Number.isFinite(riderId) && field) {
        updateRiderTeamEditorField(riderId, field, input.value);
      }
    }
  });
}
