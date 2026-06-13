import { api } from '../api';
import { $, esc, state, renderResultsJerseyColumn, renderResultsFlagColumn, renderResultsParticipant, isActiveView, } from '../state';
import { renderRiderNameLink } from '../state';
export function formatPointsGap(points) {
    if (points === 0)
        return '–';
    return `-${points}`;
}
export function renderSeasonCountryTopRiders(topRiders) {
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
export function renderSeasonCountryNameCell(row) {
    return `
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${esc(row.countryName)}</span>
      <div class="season-standings-country-popover">
        ${renderSeasonCountryTopRiders(row.topRiders)}
      </div>
    </div>`;
}
export function renderSeasonTeamTopRiders(teamRow, riderStandings) {
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
export function renderSeasonTeamNameCell(row, riderStandings) {
    return `
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${esc(row.teamName)}</span>
      <div class="season-standings-country-popover">
        ${renderSeasonTeamTopRiders(row, riderStandings)}
      </div>
    </div>`;
}
export async function loadSeasonStandings(silent) {
    const res = await api.getSeasonStandings();
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
export function renderSeasonStandingsView() {
    const meta = $('season-standings-meta');
    const tabs = $('season-standings-scope-tabs');
    const empty = $('season-standings-empty');
    const table = $('season-standings-table');
    const tbody = $('season-standings-tbody');
    const jerseyHeader = $('season-standings-jersey-header');
    const primaryHeader = $('season-standings-primary-header');
    const flagHeader = $('season-standings-flag-header');
    const secondaryHeader = $('season-standings-secondary-header');
    const season = state.seasonStandings?.season ?? state.gameState?.season ?? state.currentSave?.currentSeason ?? null;
    meta.textContent = season != null
        ? `Saison ${season} · Ergebnis- und Trikotpunkte kumuliert`
        : 'Noch keine Saisonwertung geladen.';
    tabs.innerHTML = `
    <button
      type="button"
      class="results-type-btn${state.selectedSeasonStandingScope === 'riders' ? ' active' : ''}"
      data-season-scope="riders"
    >Fahrer</button>
    <button
      type="button"
      class="results-type-btn${state.selectedSeasonStandingScope === 'teams' ? ' active' : ''}"
      data-season-scope="teams"
    >Teams</button>
    <button
      type="button"
      class="results-type-btn${state.selectedSeasonStandingScope === 'countries' ? ' active' : ''}"
      data-season-scope="countries"
    >Country</button>
  `;
    const isCountryScope = state.selectedSeasonStandingScope === 'countries';
    const rows = isCountryScope
        ? (state.seasonStandings?.countryStandings ?? [])
        : state.selectedSeasonStandingScope === 'teams'
            ? (state.seasonStandings?.teamStandings ?? [])
            : (state.seasonStandings?.riderStandings ?? []);
    const countryRows = isCountryScope ? rows : [];
    const standardRows = isCountryScope ? [] : rows;
    jerseyHeader.textContent = 'Trikot';
    primaryHeader.textContent = isCountryScope ? 'Land' : state.selectedSeasonStandingScope === 'teams' ? 'Team' : 'Fahrer';
    flagHeader.textContent = 'Flagge';
    secondaryHeader.textContent = state.selectedSeasonStandingScope === 'teams' ? 'Land' : 'Team';
    jerseyHeader.classList.toggle('hidden', isCountryScope);
    secondaryHeader.classList.toggle('hidden', isCountryScope);
    if (!state.seasonStandings || rows.length === 0) {
        tbody.innerHTML = '';
        table.classList.add('hidden');
        empty.classList.remove('hidden');
        empty.textContent = 'Noch keine Saisonpunkte vorhanden.';
        return;
    }
    tbody.innerHTML = isCountryScope
        ? countryRows.map((row) => `
      <tr>
        <td class="pos-${Math.min(row.rank, 3)}">${row.rank}</td>
        <td class="results-jersey-col-cell hidden"></td>
        <td class="season-standings-country-cell">${renderSeasonCountryNameCell(row)}</td>
        <td class="results-flag-col-cell">${renderResultsFlagColumn(row.countryCode)}</td>
        <td class="hidden"></td>
        <td>${row.points}</td>
        <td>${esc(formatPointsGap(row.gapPoints))}</td>
      </tr>`).join('')
        : standardRows.map((row) => {
            const primary = row.riderName ?? row.teamName;
            const jerseyCell = renderResultsJerseyColumn(row.teamId, row.teamName);
            const primaryCell = state.selectedSeasonStandingScope === 'teams'
                ? renderSeasonTeamNameCell(row, state.seasonStandings?.riderStandings ?? [])
                : renderResultsParticipant(primary, true, false, row.riderId, row.teamId);
            const flagCell = renderResultsFlagColumn(row.countryCode);
            const secondary = state.selectedSeasonStandingScope === 'teams'
                ? (row.countryName ?? row.countryCode ?? '–')
                : row.teamName;
            return `
        <tr>
          <td class="pos-${Math.min(row.rank, 3)}">${row.rank}</td>
          <td class="results-jersey-col-cell">${jerseyCell}</td>
          <td>${primaryCell}</td>
          <td class="results-flag-col-cell">${flagCell}</td>
          <td>${esc(secondary)}</td>
          <td>${row.points}</td>
          <td>${esc(formatPointsGap(row.gapPoints))}</td>
        </tr>`;
        }).join('');
    empty.classList.add('hidden');
    table.classList.remove('hidden');
}
export function initSeasonStandingsListeners() {
    $('season-standings-scope-tabs').addEventListener('click', (event) => {
        const button = event.target.closest('button[data-season-scope]');
        if (!button)
            return;
        const scope = button.dataset['seasonScope'];
        if (scope !== 'riders' && scope !== 'teams' && scope !== 'countries')
            return;
        state.selectedSeasonStandingScope = scope;
        renderSeasonStandingsView();
    });
}
