import { api } from '../api';
import { $, esc, state, renderFlag, renderMiniJersey, isActiveView, } from '../state';
export let currentDraftSort = { key: 'pickNumber', asc: true };
export function getHeatmapStyleForRating(score) {
    // Map rating [50-85] to ratio [0-1]
    const ratio = Math.max(0, Math.min(1, (score - 50) / 35));
    const hue = Math.round(6 + (ratio * 118));
    const borderAlpha = 0.26 + (ratio * 0.18);
    const bgAlpha = 0.14 + (ratio * 0.12);
    return `--rider-stats-pill-hue:${hue};--rider-stats-pill-border-alpha:${borderAlpha};--rider-stats-pill-bg-alpha:${bgAlpha};`;
}
export async function loadDraftHistory(season, silent = false) {
    const res = await api.getDraftHistory(season);
    if (!res.success) {
        state.draftHistory = null;
        if (isActiveView('draft')) {
            renderDraftView();
        }
        if (!silent && res.error) {
            alert('Draft Historie konnte nicht geladen werden:\n' + res.error);
        }
        return;
    }
    state.draftHistory = res.data ?? null;
    if (isActiveView('draft')) {
        renderDraftView();
    }
}
export function renderDraftView() {
    const container = $('draft-table-container');
    const select = $('draft-season-select');
    if (!state.currentSave) {
        container.innerHTML = '<div class="alert alert-info">Kein Spiel geladen.</div>';
        return;
    }
    // Populate season select if empty
    if (select.options.length === 0) {
        // startSeason might not be on currentSave, let's fall back to 2026 or currentSave.startSeason
        const startS = state.currentSave.startSeason ?? 2026;
        for (let s = state.currentSave.currentSeason; s >= startS; s--) {
            const opt = document.createElement('option');
            opt.value = s.toString();
            opt.textContent = `Saison ${s}`;
            select.appendChild(opt);
        }
        if (!state.draftSelectedSeason) {
            state.draftSelectedSeason = state.currentSave.currentSeason;
        }
        select.value = state.draftSelectedSeason.toString();
        select.onchange = (e) => {
            const target = e.target;
            state.draftSelectedSeason = parseInt(target.value, 10);
            void loadDraftHistory(state.draftSelectedSeason);
        };
    }
    if (!state.draftHistory) {
        container.innerHTML = '<div class="alert alert-info">Lade Draft Historie...</div>';
        return;
    }
    if (state.draftHistory.rows.length === 0) {
        container.innerHTML = '<div class="alert alert-info">Keine Draft-Einträge für diese Saison vorhanden.</div>';
        return;
    }
    const sortedRows = [...state.draftHistory.rows].sort((a, b) => {
        let comparison = 0;
        const key = currentDraftSort.key;
        if (key === 'riderLastName') {
            comparison = a.riderLastName.localeCompare(b.riderLastName);
        }
        else if (key === 'teamName') {
            comparison = a.teamName.localeCompare(b.teamName);
        }
        else if (key === 'oldTeamName') {
            comparison = (a.oldTeamName || '').localeCompare(b.oldTeamName || '');
        }
        else if (key === 'countryCode') {
            comparison = a.countryCode.localeCompare(b.countryCode);
        }
        else {
            comparison = (a[key] ?? 0) - (b[key] ?? 0);
        }
        return currentDraftSort.asc ? comparison : -comparison;
    });
    const getSortIcon = (key) => {
        if (currentDraftSort.key !== key)
            return '<span class="sort-icon-placeholder"></span>';
        return currentDraftSort.asc ? ' ▲' : ' ▼';
    };
    const setSort = (key) => {
        if (currentDraftSort.key === key) {
            currentDraftSort.asc = !currentDraftSort.asc;
        }
        else {
            currentDraftSort.key = key;
            currentDraftSort.asc = true;
        }
        renderDraftView();
    };
    window.setDraftSort = setSort;
    let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th class="sortable text-center" onclick="setDraftSort('pickNumber')">Pick${getSortIcon('pickNumber')}</th>
          <th class="sortable text-center" onclick="setDraftSort('draftRound')">Runde${getSortIcon('draftRound')}</th>
          <th class="sortable" onclick="setDraftSort('teamName')">Neues Team${getSortIcon('teamName')}</th>
          <th class="sortable" onclick="setDraftSort('oldTeamName')">Altes Team${getSortIcon('oldTeamName')}</th>
          <th class="sortable text-center" onclick="setDraftSort('countryCode')">Land${getSortIcon('countryCode')}</th>
          <th class="sortable" onclick="setDraftSort('riderLastName')">Fahrer${getSortIcon('riderLastName')}</th>
          <th class="sortable text-center" onclick="setDraftSort('riderBirthYear')">Alter${getSortIcon('riderBirthYear')}</th>
          <th class="sortable text-center" onclick="setDraftSort('contractLength')">Vertrag${getSortIcon('contractLength')}</th>
          <th class="sortable text-center" onclick="setDraftSort('overallAtDraft')">Stärke${getSortIcon('overallAtDraft')}</th>
          <th class="sortable text-center" onclick="setDraftSort('potOverallAtDraft')">Potenzial${getSortIcon('potOverallAtDraft')}</th>
        </tr>
      </thead>
      <tbody>
  `;
    for (const row of sortedRows) {
        const age = state.draftHistory.season - row.riderBirthYear;
        // Altes Team String
        let oldTeamHtml = '-';
        if (row.oldTeamName) {
            oldTeamHtml = `<div style="display:flex; align-items:center; gap:0.5rem;">${renderMiniJersey(row.oldTeamId, row.oldTeamName)} ${esc(row.oldTeamName)}</div>`;
        }
        // Neues Team String
        const newTeamHtml = `<div style="display:flex; align-items:center; gap:0.5rem;">${renderMiniJersey(row.teamId, row.teamName)} ${esc(row.teamName)}</div>`;
        html += `
      <tr>
        <td class="text-center">#${row.pickNumber}</td>
        <td class="text-center">Runde ${row.draftRound}</td>
        <td>${newTeamHtml}</td>
        <td>${oldTeamHtml}</td>
        <td class="text-center">${renderFlag(row.countryCode)}</td>
        <td>${esc(row.riderFirstName)} ${esc(row.riderLastName)}</td>
        <td class="text-center">${age} J.</td>
        <td class="text-center">${row.contractLength} Jahre</td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${getHeatmapStyleForRating(row.overallAtDraft)}">${row.overallAtDraft.toFixed(1)}</span></td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${getHeatmapStyleForRating(row.potOverallAtDraft)}">${row.potOverallAtDraft.toFixed(1)}</span></td>
      </tr>
    `;
    }
    html += `</tbody></table>`;
    container.innerHTML = html;
}
