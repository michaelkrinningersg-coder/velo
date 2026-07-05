import { api } from '../api';
import {
  $,
  esc,
  state,
  renderFlag,
  renderMiniJersey,
  isActiveView,
  formatDate,
} from '../state';
import { renderRiderStatsCategoryBadge, renderRiderOverallRatingBadge, openRiderStats } from './riderStats';
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

export let currentInjuriesTab: 'all' | 'teams' = 'all';

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

  (window as any).openRiderStatsFromInjuries = openRiderStats;

  let html = '';

  const teamRows = state.injuries.filter(r => r.teamId != null && r.teamDivisionTier === 1);
  const grouped = new Map<number, InjuryRow[]>();
  for (const r of teamRows) {
    const tid = r.teamId!;
    if (!grouped.has(tid)) grouped.set(tid, []);
    grouped.get(tid)!.push(r);
  }
  
  for (const tid of grouped.keys()) {
    grouped.get(tid)!.sort((a, b) => b.overallRating - a.overallRating);
  }

  const sortedTeamIds = Array.from(grouped.keys()).sort((a, b) => {
    const aName = grouped.get(a)![0].teamAbbreviation || '';
    const bName = grouped.get(b)![0].teamAbbreviation || '';
    return aName.localeCompare(bName);
  });

  if (sortedTeamIds.length === 0) {
    html += '<div class="alert alert-info">Keine verletzten Fahrer in Division 1 Teams.</div>';
  } else {
    const COLS = '44px minmax(150px,1.3fr) 52px 66px 132px 96px minmax(150px,1.2fr)';
    for (const tid of sortedTeamIds) {
      const riders = grouped.get(tid)!;
      const abbr = riders[0].teamAbbreviation;
      html += `
        <div class="results-grid-card" style="margin-bottom:16px;">
          <div class="results-grid-cardhead">
            <span style="display:flex; align-items:center; gap:11px;">
              <img src="/jersey/Jer_${tid}.png" style="width:30px; height:30px; object-fit:contain; flex:0 0 auto;" onerror="this.style.display='none'">
              <span class="results-card-title" style="font-size:15px;">${esc(abbr ?? 'Team ' + tid)}</span>
            </span>
            <span class="results-card-count">${riders.length} Ausfall${riders.length === 1 ? '' : 'e'}</span>
          </div>
          <div class="results-grid-head" style="grid-template-columns:${COLS};">
            <span style="justify-self:center;">LAND</span><span>FAHRER</span><span style="justify-self:center;">ALTER</span><span style="justify-self:center;">GESAMT</span><span>TYP</span><span>AUSFALLZEIT</span><span>FIT</span>
          </div>
          <div class="results-grid-body">
      `;
      for (const row of riders) {
        const typeHtml = row.healthStatus === 'injured'
          ? '<span style="display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:700; color:#fca5a5; background:rgba(239,68,68,.14); border:1px solid rgba(239,68,68,.34); padding:3px 10px; border-radius:99px;">Verletzung 🤕</span>'
          : '<span style="display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:700; color:#fcd34d; background:rgba(234,179,8,.14); border:1px solid rgba(234,179,8,.34); padding:3px 10px; border-radius:99px;">Krankheit 🤒</span>';

        let fitHtml = '';
        if (row.fitDate) {
          const formattedFitDate = formatDate(row.fitDate);
          if (row.missedRaces && row.missedRaces.length > 0) {
            let missedHtml = '';
            for (const r of row.missedRaces) {
              missedHtml += `
                <div class="injury-missed-race">
                  <span style="min-width: 65px; color: var(--text-400);">${formatDate(r.startDate)}</span>
                  ${renderFlag(r.countryCode)}
                  <strong style="color: #fff; flex: 1; margin-right: 0.5rem;">${esc(r.name)}</strong>
                  ${renderRiderStatsCategoryBadge(r.categoryName)}
                </div>
              `;
            }
            fitHtml = `
              <div class="injury-fit-cell">
                <strong>${formattedFitDate}</strong>
                <div class="injury-fit-tooltip">
                  <div style="margin-bottom: 0.4rem; font-weight: 700; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.2rem;">Verpasste Rennen (${row.missedRaces.length})</div>
                  ${missedHtml}
                </div>
              </div>
            `;
          } else {
            fitHtml = `<strong>${formattedFitDate}</strong>`;
          }
        } else {
          fitHtml = 'Unbekannt';
        }

        html += `
          <div style="display:grid; grid-template-columns:${COLS}; gap:9px; align-items:center; padding:9px 16px; border-top:1px solid #14203a;">
            <span style="display:flex; justify-content:center;">${renderFlag(row.countryCode)}</span>
            <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"><a href="#" onclick="event.preventDefault(); openRiderStatsFromInjuries(${row.riderId})" style="color:#e2e8f0; text-decoration:none; font-weight:600;">${esc(row.riderFirstName)} ${esc(row.riderLastName)}</a></span>
            <span style="justify-self:center; font-family:'JetBrains Mono',monospace; color:#9fb0c9;">${row.age}</span>
            <span style="justify-self:center;">${renderRiderOverallRatingBadge(row.overallRating)}</span>
            <span>${typeHtml}</span>
            <span style="font-family:'JetBrains Mono',monospace; font-weight:700; color:#e2e8f0;">${row.unavailableDays} Tage</span>
            <span style="min-width:0;">${fitHtml}</span>
          </div>
        `;
      }
      html += `</div></div>`;
    }
  }

  container.innerHTML = html;
}
