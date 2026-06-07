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
    for (const tid of sortedTeamIds) {
      const riders = grouped.get(tid)!;
      const abbr = riders[0].teamAbbreviation;
      html += `
        <div style="margin-bottom: 2rem;">
          <div style="display:flex; align-items:center; gap: 1rem; margin-bottom: 0.5rem;">
            <img src="/jersey/Jer_${tid}.png" style="width: 128px; height: 128px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));" onerror="this.style.display='none'">
            <h3 style="margin: 0; font-size: 1.5rem;">${esc(abbr ?? 'Team ' + tid)}</h3>
          </div>
          <table class="data-table injuries-table">
            <colgroup>
              <col style="width: 8%;">
              <col style="width: 28%;">
              <col style="width: 8%;">
              <col style="width: 14%;">
              <col style="width: 12%;">
              <col style="width: 12%;">
              <col style="width: 18%;">
            </colgroup>
            <thead>
              <tr>
                <th>Land</th>
                <th>Fahrer</th>
                <th>Alter</th>
                <th>Gesamt</th>
                <th>Typ</th>
                <th>Ausfallzeit</th>
                <th>Fit</th>
              </tr>
            </thead>
            <tbody>
      `;
      for (const row of riders) {
        const typeHtml = row.healthStatus === 'injured' 
          ? '<span class="badge badge-error">Verletzung 🤕</span>' 
          : '<span class="badge badge-warning">Krankheit 🤒</span>';
          
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
          <tr>
            <td>${renderFlag(row.countryCode)}</td>
            <td><a href="#" onclick="event.preventDefault(); openRiderStatsFromInjuries(${row.riderId})" style="color: inherit; text-decoration: none;"><strong>${esc(row.riderFirstName)} ${esc(row.riderLastName)}</strong></a></td>
            <td>${row.age}</td>
            <td><span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;">${renderRiderOverallRatingBadge(row.overallRating)}</span></td>
            <td>${typeHtml}</td>
            <td><strong>${row.unavailableDays} Tage</strong></td>
            <td>${fitHtml}</td>
          </tr>
        `;
      }
      html += `</tbody></table></div>`;
    }
  }

  container.innerHTML = html;
}
