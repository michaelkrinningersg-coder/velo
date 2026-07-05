import { api } from '../api';
import {
  $,
  esc,
  state,
  formatDate,
  renderFlag,
  renderMiniJersey,
  renderResultsJerseyColumn,
  renderResultsFlagColumn,
  resolveRiderCountryCode,
  findRiderById,
  findRaceById,
  findStageById,
  renderResultsParticipant,
  isActiveView,
} from '../state';
import { renderRiderNameLink, renderTeamNameLink } from '../state';
import {
  formatRaceDateRange,
  raceCategoryBadge,
} from './dashboard';
import type {
  SeasonStandingsPayload,
  SeasonStandingCountryRow,
} from '../../../shared/types';

export function formatPointsGap(points: number): string {
  if (points === 0) return '–';
  return `-${points}`;
}

export function renderSeasonCountryTopRiders(topRiders: SeasonStandingCountryRow['topRiders']): string {
  if (topRiders.length === 0) {
    return '<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>';
  }

  return `
    <div class="season-standings-country-popover-card">
      <div class="season-standings-country-popover-head">
        <strong>Top 20 Fahrer</strong>
      </div>
      <div class="season-standings-country-popover-grid season-standings-country-popover-grid-head">
        <span>Platz</span>
        <span>Flagge</span>
        <span>Fahrer</span>
        <span>Punkte</span>
      </div>
      ${topRiders.map((rider) => `
        <div class="season-standings-country-popover-grid">
          <strong>${rider.rank}</strong>
          <span class="results-flag-col-cell">${renderResultsFlagColumn(rider.countryCode)}</span>
          <span class="season-standings-country-rider-name">${renderRiderNameLink(rider.riderName, { riderId: rider.riderId, strong: false })}</span>
          <strong>${rider.points}</strong>
        </div>
      `).join('')}
    </div>`;
}

export function renderSeasonCountryNameCell(row: SeasonStandingCountryRow): string {
  return `
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${esc(row.countryName)}</span>
      <div class="season-standings-country-popover">
        ${renderSeasonCountryTopRiders(row.topRiders)}
      </div>
    </div>`;
}

export function renderSeasonTeamTopRiders(
  teamRow: SeasonStandingsPayload['teamStandings'][number],
  riderStandings: SeasonStandingsPayload['riderStandings'],
): string {
  const topRiders = riderStandings
    .filter((rider) => rider.teamId != null && teamRow.teamId != null && rider.teamId === teamRow.teamId)
    .slice(0, 30);

  if (topRiders.length === 0) {
    return '<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>';
  }

  return `
    <div class="season-standings-country-popover-card">
      <div class="season-standings-country-popover-head">
        <strong>Top 30 Fahrer</strong>
      </div>
      <div class="season-standings-country-popover-grid season-standings-country-popover-grid-head">
        <span>Platz</span>
        <span>Flagge</span>
        <span>Fahrer</span>
        <span>Punkte</span>
      </div>
      ${topRiders.map((rider) => `
        <div class="season-standings-country-popover-grid">
          <strong>${rider.rank}</strong>
          <span class="results-flag-col-cell">${renderResultsFlagColumn(rider.countryCode)}</span>
          <span class="season-standings-country-rider-name">${renderRiderNameLink(rider.riderName ?? '–', { riderId: rider.riderId, teamId: rider.teamId, strong: false })}</span>
          <strong>${rider.points}</strong>
        </div>
      `).join('')}
    </div>`;
}

export function renderSeasonTeamNameCell(
  row: SeasonStandingsPayload['teamStandings'][number],
  riderStandings: SeasonStandingsPayload['riderStandings'],
): string {
  return `
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${renderTeamNameLink(row.teamName, row.teamId, false)}</span>
      <div class="season-standings-country-popover">
        ${renderSeasonTeamTopRiders(row, riderStandings)}
      </div>
    </div>`;
}

export async function loadSeasonStandings(silent: boolean): Promise<void> {
  const selectedSeason = state.seasonStandingsSelectedSeason ?? undefined;
  const res = await api.getSeasonStandings(selectedSeason);
  if (!res.success) {
    state.seasonStandings = null;
    if (isActiveView('season-standings')) {
      renderSeasonStandingsView();
    }
    if (!silent && res.error) {
      alert('Saisonwertung konnte nicht geladen werden:\n' + res.error);
    }
    return;
  }

  state.seasonStandings = res.data ?? null;
  if (isActiveView('season-standings')) {
    renderSeasonStandingsView();
  }
}

export function renderSeasonStandingsView(): void {
  const meta = $('season-standings-meta');
  const tabs = $('season-standings-scope-tabs');
  const empty = $('season-standings-empty');
  const tableCard = $('season-standings-table-card');
  const gridHead = $('season-standings-grid-head');
  const tbody = $('season-standings-tbody');
  const cardTitle = $('season-standings-card-title');
  const cardCount = $('season-standings-card-count');

  const season = state.seasonStandings?.season ?? state.gameState?.season ?? state.currentSave?.currentSeason ?? null;
  meta.textContent = season != null
    ? `Saison ${season} · Ergebnis- und Trikotpunkte kumuliert`
    : 'Noch keine Saisonwertung geladen.';

  const yearSelect = $('season-standings-year-select') as HTMLSelectElement | null;
  if (yearSelect) {
    const seasons = state.seasonStandings?.availableSeasons || [];
    const selected = state.seasonStandingsSelectedSeason ?? state.gameState?.season ?? 2026;
    yearSelect.innerHTML = seasons.map(yr => `
      <option value="${yr}" ${yr === selected ? 'selected' : ''}>Saison ${yr}</option>
    `).join('');
  }

  const scope = state.selectedSeasonStandingScope;
  tabs.innerHTML = `
    <button
      type="button"
      class="results-type-btn${scope === 'riders' ? ' active' : ''}"
      data-season-scope="riders"
    >Fahrer</button>
    <button
      type="button"
      class="results-type-btn${scope === 'teams' ? ' active' : ''}"
      data-season-scope="teams"
    >Teams</button>
    <button
      type="button"
      class="results-type-btn${scope === 'countries' ? ' active' : ''}"
      data-season-scope="countries"
    >Country</button>
  `;

  const isCountryScope = scope === 'countries';
  const rows = isCountryScope
    ? (state.seasonStandings?.countryStandings ?? [])
    : scope === 'teams'
      ? (state.seasonStandings?.teamStandings ?? [])
      : (state.seasonStandings?.riderStandings ?? []);
  const countryRows = isCountryScope ? (rows as SeasonStandingCountryRow[]) : [];
  const standardRows = isCountryScope ? [] : (rows as SeasonStandingsPayload['riderStandings']);

  // Broadcast-Grid: Spalten je Scope + Kopfzeile
  const COLS = isCountryScope
    ? '52px minmax(180px,1.6fr) 44px 84px 96px'
    : '52px 44px minmax(160px,1.4fr) 44px minmax(130px,1fr) 84px 96px';
  const MONO = "font-family:'JetBrains Mono',monospace;";
  const primaryLabel = isCountryScope ? 'LAND' : scope === 'teams' ? 'TEAM' : 'FAHRER';
  const secondaryLabel = scope === 'teams' ? 'LAND' : 'TEAM';

  cardTitle.textContent = isCountryScope ? 'Länder-Wertung' : scope === 'teams' ? 'Team-Wertung' : 'Fahrer-Wertung';
  cardCount.textContent = `${rows.length} ${isCountryScope ? 'Länder' : scope === 'teams' ? 'Teams' : 'Fahrer'}`;

  gridHead.style.gridTemplateColumns = COLS;
  gridHead.innerHTML = isCountryScope
    ? `<span>PL.</span><span>${primaryLabel}</span><span style="justify-self:center;">FLAGGE</span><span style="justify-self:end;">PUNKTE</span><span style="justify-self:end;">RÜCKSTAND</span>`
    : `<span>PL.</span><span style="justify-self:center;">TRIKOT</span><span>${primaryLabel}</span><span style="justify-self:center;">FLAGGE</span><span>${secondaryLabel}</span><span style="justify-self:end;">PUNKTE</span><span style="justify-self:end;">RÜCKSTAND</span>`;

  if (!state.seasonStandings || rows.length === 0) {
    tbody.innerHTML = '';
    tableCard.classList.add('hidden');
    empty.classList.remove('hidden');
    empty.textContent = 'Noch keine Saisonpunkte vorhanden.';
    return;
  }

  const rankColor = (r: number): string => r === 1 ? '#fbbf24' : r === 2 ? '#cbd5e1' : r === 3 ? '#d08b5b' : '#9fb0c9';
  const podium = (r: number): string => r === 1
    ? 'box-shadow:inset 3px 0 0 #fbbf24;background:linear-gradient(90deg,rgba(251,191,36,.08),transparent 55%);'
    : r === 2 ? 'box-shadow:inset 3px 0 0 #cbd5e1;background:linear-gradient(90deg,rgba(203,213,225,.07),transparent 55%);'
    : r === 3 ? 'box-shadow:inset 3px 0 0 #d08b5b;background:linear-gradient(90deg,rgba(208,139,91,.07),transparent 55%);'
    : '';
  const rowBase = (r: number): string => `display:grid;grid-template-columns:${COLS};gap:9px;align-items:center;padding:9px 16px;border-top:1px solid #14203a;${podium(r)}`;
  const rank = (r: number): string => `<span style="text-align:center;${MONO}font-size:15px;font-weight:800;color:${rankColor(r)};">${r}</span>`;
  const center = (h: string): string => `<span style="display:flex;justify-content:center;min-width:0;">${h}</span>`;
  const pts = (v: number): string => `<span style="${MONO}font-weight:800;color:#e2e8f0;justify-self:end;">${v}</span>`;
  const gap = (v: number): string => `<span style="${MONO}color:#6a7a95;justify-self:end;">${esc(formatPointsGap(v))}</span>`;

  tbody.innerHTML = isCountryScope
    ? countryRows.map((row) => `
      <div style="${rowBase(row.rank)}">
        ${rank(row.rank)}
        <span style="min-width:0;overflow:hidden;">${renderSeasonCountryNameCell(row)}</span>
        ${center(renderResultsFlagColumn(row.countryCode))}
        ${pts(row.points)}
        ${gap(row.gapPoints)}
      </div>`).join('')
    : standardRows.map((row) => {
      const primary = row.riderName ?? row.teamName;
      const jerseyCell = renderResultsJerseyColumn(row.teamId, row.teamName);
      const primaryCell = scope === 'teams'
        ? renderSeasonTeamNameCell(row, state.seasonStandings?.riderStandings ?? [])
        : renderResultsParticipant(primary, true, false, row.riderId, row.teamId);
      const secondaryCell = scope === 'teams'
        ? `<span style="color:#9fb0c9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(row.countryName ?? row.countryCode ?? '–')}</span>`
        : renderTeamNameLink(row.teamName ?? '–', row.teamId, false);
      return `
        <div style="${rowBase(row.rank)}">
          ${rank(row.rank)}
          ${center(jerseyCell)}
          <span style="min-width:0;overflow:hidden;">${primaryCell}</span>
          ${center(renderResultsFlagColumn(row.countryCode))}
          <span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${secondaryCell}</span>
          ${pts(row.points)}
          ${gap(row.gapPoints)}
        </div>`;
    }).join('');

  empty.classList.add('hidden');
  tableCard.classList.remove('hidden');
}

export function initSeasonStandingsListeners(): void {
  $('season-standings-scope-tabs').addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-season-scope]');
    if (!button) return;
    const scope = button.dataset['seasonScope'];
    if (scope !== 'riders' && scope !== 'teams' && scope !== 'countries') return;
    state.selectedSeasonStandingScope = scope;
    renderSeasonStandingsView();
  });

  const yearSelect = $('season-standings-year-select');
  if (yearSelect) {
    yearSelect.addEventListener('change', (event) => {
      const select = event.target as HTMLSelectElement;
      state.seasonStandingsSelectedSeason = Number(select.value);
      void loadSeasonStandings(false);
    });
  }
}
