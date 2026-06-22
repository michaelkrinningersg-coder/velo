import { $, esc, state, } from '../state';
import { TEAM_DETAIL_PAGE_ORDER, TEAM_TABLE_COLUMNS, TEAM_DETAIL_PAGE_COLUMNS, sortRiderMenuRiders, renderTeamTableCell, getTeamSortLabel, getDefaultTeamSortDirection, } from './teams';
import { openRiderProgram } from './dashboard';
export const RIDER_MENU_PAGE_SIZE = 50;
export function getActiveRiderMenuTableColumns() {
    return [...TEAM_TABLE_COLUMNS, ...TEAM_DETAIL_PAGE_COLUMNS[state.riderMenuDetailPage]];
}
export function getRiderMenuSortIndicator(sortKey) {
    if (state.riderMenuTableSort.key !== sortKey)
        return '<span class="team-table-sort-indicator">↕</span>';
    return `<span class="team-table-sort-indicator team-table-sort-indicator-active">${state.riderMenuTableSort.direction === 'asc' ? '↑' : '↓'}</span>`;
}
export function renderRiderMenuTableHeader(column) {
    if (!column.sortKey) {
        return `<th class="${esc(column.className ?? '')}" title="${esc(column.title)}">${esc(column.label)}</th>`;
    }
    const activeClass = state.riderMenuTableSort.key === column.sortKey ? ' team-table-sort-active' : '';
    return `
    <th class="${esc(column.className ?? '')}" title="${esc(column.title)}">
      <button
        type="button"
        class="team-table-sort${activeClass}"
        data-riders-sort="${column.sortKey}"
      >
        <span class="team-table-sort-label">${esc(column.label)}</span>
        ${getRiderMenuSortIndicator(column.sortKey)}
      </button>
    </th>`;
}
export function renderRiderMenuDetailPageTabs() {
    return `
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahreransicht Detailseite">
      ${TEAM_DETAIL_PAGE_ORDER.map((page) => {
        const labels = {
            skills: 'Werte',
            form: 'Saisonform',
            profile: 'Fahrertyp & Peaks',
            preferences: 'Programm & Mentoren',
        };
        return `
          <button
            type="button"
            class="team-detail-page-tab${state.riderMenuDetailPage === page ? ' team-detail-page-tab-active' : ''}"
            role="tab"
            aria-selected="${state.riderMenuDetailPage === page ? 'true' : 'false'}"
            data-riders-detail-page="${page}"
          >
            ${labels[page]}
          </button>`;
    }).join('')}
    </div>`;
}
export function renderRidersMenu() {
    const detail = $('riders-detail');
    const activeColumns = getActiveRiderMenuTableColumns();
    const sortedRiders = sortRiderMenuRiders(state.riders);
    const totalRiders = sortedRiders.length;
    const totalPages = Math.max(1, Math.ceil(totalRiders / RIDER_MENU_PAGE_SIZE));
    state.riderMenuPage = Math.min(totalPages, Math.max(1, state.riderMenuPage));
    const startIndex = (state.riderMenuPage - 1) * RIDER_MENU_PAGE_SIZE;
    const endIndex = Math.min(totalRiders, startIndex + RIDER_MENU_PAGE_SIZE);
    const pageRiders = sortedRiders.slice(startIndex, endIndex);
    detail.innerHTML = `
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>Alle Fahrer</h3>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${totalRiders} Fahrer</span>
        <span class="text-muted">Sortierung: ${esc(getTeamSortLabel(state.riderMenuTableSort.key))} ${state.riderMenuTableSort.direction === 'asc' ? 'aufsteigend' : 'absteigend'}</span>
      </div>
      ${renderRiderMenuDetailPageTabs()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${activeColumns.map(renderRiderMenuTableHeader).join('')}
          </tr></thead>
          <tbody>
            ${pageRiders.length === 0
        ? `<tr><td colspan="${activeColumns.length}" class="text-muted">Keine Fahrer.</td></tr>`
        : pageRiders.map((rider) => `
                <tr class="team-detail-row">
                  ${activeColumns.map((column) => renderTeamTableCell(rider, column)).join('')}
                </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="team-detail-meta riders-pagination" style="margin-top:0.75rem">
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="prev" ${state.riderMenuPage <= 1 ? 'disabled' : ''}>Zurück</button>
        <span>Seite ${state.riderMenuPage} / ${totalPages} · Fahrer ${totalRiders === 0 ? 0 : startIndex + 1}-${endIndex} von ${totalRiders}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="next" ${state.riderMenuPage >= totalPages ? 'disabled' : ''}>Weiter</button>
      </div>
    </div>`;
}
export function initRidersListeners() {
    $('riders-detail').addEventListener('click', (event) => {
        const programButton = event.target.closest('button[data-rider-program-id]');
        if (programButton) {
            const riderId = Number(programButton.dataset['riderProgramId']);
            if (Number.isFinite(riderId)) {
                void openRiderProgram(riderId);
            }
            return;
        }
        const pageButton = event.target.closest('button[data-riders-detail-page]');
        if (pageButton) {
            const nextPage = pageButton.dataset['ridersDetailPage'];
            if (TEAM_DETAIL_PAGE_ORDER.includes(nextPage)) {
                state.riderMenuDetailPage = nextPage;
                const visibleSortKeys = new Set(getActiveRiderMenuTableColumns().map((column) => column.sortKey).filter((sortKey) => sortKey != null));
                if (!visibleSortKeys.has(state.riderMenuTableSort.key)) {
                    state.riderMenuTableSort = { key: 'name', direction: 'asc' };
                }
                state.riderMenuPage = 1;
                renderRidersMenu();
            }
            return;
        }
        const sortButton = event.target.closest('button[data-riders-sort]');
        if (sortButton) {
            const sortKey = sortButton.dataset['ridersSort'];
            if (state.riderMenuTableSort.key === sortKey) {
                state.riderMenuTableSort.direction = state.riderMenuTableSort.direction === 'asc' ? 'desc' : 'asc';
            }
            else {
                state.riderMenuTableSort = {
                    key: sortKey,
                    direction: getDefaultTeamSortDirection(sortKey),
                };
            }
            state.riderMenuPage = 1;
            renderRidersMenu();
            return;
        }
        const paginationButton = event.target.closest('button[data-riders-page-action]');
        if (paginationButton) {
            const action = paginationButton.dataset['ridersPageAction'];
            const totalPages = Math.max(1, Math.ceil(state.riders.length / RIDER_MENU_PAGE_SIZE));
            if (action === 'prev') {
                state.riderMenuPage = Math.max(1, state.riderMenuPage - 1);
            }
            if (action === 'next') {
                state.riderMenuPage = Math.min(totalPages, state.riderMenuPage + 1);
            }
            renderRidersMenu();
            return;
        }
    });
}
