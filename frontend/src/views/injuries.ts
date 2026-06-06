import { api } from '../api';
import {
  $,
  esc,
  state,
  renderFlag,
  renderMiniJersey,
  isActiveView,
} from '../state';
import type { InjuryRow } from '../../../shared/types';

export let currentInjuriesSort: { key: keyof InjuryRow, asc: boolean } = { key: 'unavailableDays', asc: false };

export async function loadInjuries(silent = false): Promise<void> {
  const res = await api.getInjuries();
  if (!res.success) {
    state.injuries = null;
    if (isActiveView('injuries')) {
      renderInjuriesView();
    }
    if (!silent && res.error) {
      alert('Verletzungen konnten nicht geladen werden:\n' + res.error);
    }
    return;
  }
  state.injuries = res.data ?? [];
  if (isActiveView('injuries')) {
    renderInjuriesView();
  }
}

export function renderInjuriesView(): void {
  const container = $('injuries-table-container');

  if (!state.injuries) {
    container.innerHTML = '<div class="alert alert-info">Lade Daten...</div>';
    return;
  }

  $('injuries-meta').textContent = state.injuries.length + ' Ausfälle';

  if (state.injuries.length === 0) {
    container.innerHTML = '<div class="alert alert-info">Aktuell gibt es keine kranken oder verletzten Fahrer.</div>';
    return;
  }

  const sortedRows = [...state.injuries].sort((a, b) => {
    let comparison = 0;
    const key = currentInjuriesSort.key;
    if (key === 'riderLastName') {
      comparison = a.riderLastName.localeCompare(b.riderLastName);
    } else if (key === 'teamAbbreviation') {
      comparison = (a.teamAbbreviation || '').localeCompare(b.teamAbbreviation || '');
    } else if (key === 'countryCode') {
      comparison = a.countryCode.localeCompare(b.countryCode);
    } else if (key === 'healthStatus') {
      comparison = a.healthStatus.localeCompare(b.healthStatus);
    } else {
      comparison = ((a as any)[key] ?? 0) - ((b as any)[key] ?? 0);
    }
    return currentInjuriesSort.asc ? comparison : -comparison;
  });

  const getSortIcon = (key: string) => {
    if (currentInjuriesSort.key !== key) return '<span class="sort-icon-placeholder"></span>';
    return currentInjuriesSort.asc ? ' ▲' : ' ▼';
  };

  const setSort = (key: any) => {
    if (currentInjuriesSort.key === key) {
      currentInjuriesSort.asc = !currentInjuriesSort.asc;
    } else {
      currentInjuriesSort.key = key;
      currentInjuriesSort.asc = false;
    }
    renderInjuriesView();
  };

  (window as any).setInjuriesSort = setSort;

  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th class="text-center">#</th>
          <th class="sortable text-center" onclick="setInjuriesSort('countryCode')">Land${getSortIcon('countryCode')}</th>
          <th class="sortable" onclick="setInjuriesSort('riderLastName')">Fahrer${getSortIcon('riderLastName')}</th>
          <th class="sortable text-center" onclick="setInjuriesSort('teamAbbreviation')">Team${getSortIcon('teamAbbreviation')}</th>
          <th class="sortable text-center" onclick="setInjuriesSort('unavailableDays')">Ausfallzeit${getSortIcon('unavailableDays')}</th>
          <th class="sortable text-center" onclick="setInjuriesSort('healthStatus')">Typ${getSortIcon('healthStatus')}</th>
        </tr>
      </thead>
      <tbody>
  `;

  let idx = 1;
  for (const row of sortedRows) {
    let teamId: number | null = null;
    if (row.teamJersey) {
      const match = row.teamJersey.match(/Jer_(\d+)\.png/);
      if (match) teamId = parseInt(match[1], 10);
    }

    let teamHtml = '-';
    if (row.teamAbbreviation) {
      teamHtml = `<div style="display:flex; align-items:center; justify-content:center; gap:0.5rem;">${renderMiniJersey(teamId, row.teamAbbreviation)} ${esc(row.teamAbbreviation)}</div>`;
    }

    const typeHtml = row.healthStatus === 'injured' 
      ? '<span class="badge badge-error">Verletzung 🤕</span>' 
      : '<span class="badge badge-warning">Krankheit 🤒</span>';

    html += `
      <tr>
        <td class="text-center">${idx++}</td>
        <td class="text-center">${renderFlag(row.countryCode)}</td>
        <td>${esc(row.riderFirstName)} ${esc(row.riderLastName)}</td>
        <td class="text-center">${teamHtml}</td>
        <td class="text-center"><strong>${row.unavailableDays} Tage</strong></td>
        <td class="text-center">${typeHtml}</td>
      </tr>
    `;
  }

  html += `</tbody></table>`;
  container.innerHTML = html;
}
