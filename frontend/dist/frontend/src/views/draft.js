import { api } from '../api';
import { $, esc, state, renderFlag, renderMiniJersey, isActiveView, showLoading, hideLoading, } from '../state';
export let currentDraftSort = { key: 'pickNumber', asc: true };
export function getHeatmapStyleForRating(score) {
    const ratio = Math.max(0, Math.min(1, (score - 50) / 35));
    const hue = Math.round(6 + (ratio * 118));
    const borderAlpha = 0.26 + (ratio * 0.18);
    const bgAlpha = 0.14 + (ratio * 0.12);
    return `--rider-stats-pill-hue:${hue};--rider-stats-pill-border-alpha:${borderAlpha};--rider-stats-pill-bg-alpha:${bgAlpha};`;
}
export function getDraftSortIndicator(sortKey) {
    if (currentDraftSort.key !== sortKey)
        return '<span class="team-table-sort-indicator">↕</span>';
    return `<span class="team-table-sort-indicator team-table-sort-indicator-active">${currentDraftSort.asc ? '↑' : '↓'}</span>`;
}
export function renderDraftHeaderCell(label, sortKey, className = '') {
    const activeClass = currentDraftSort.key === sortKey ? ' team-table-sort-active' : '';
    return `
    <th class="${esc(className)}">
      <button
        type="button"
        class="team-table-sort${activeClass}"
        data-draft-sort="${esc(sortKey)}"
      >
        <span class="team-table-sort-label">${esc(label)}</span>
        ${getDraftSortIndicator(sortKey)}
      </button>
    </th>`;
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
        const startS = (state.currentSave.startSeason ?? 2026) + 1;
        for (let s = state.currentSave.currentSeason; s >= startS; s--) {
            const opt = document.createElement('option');
            opt.value = s.toString();
            opt.textContent = `Saison ${s}`;
            select.appendChild(opt);
        }
        if (!state.draftSelectedSeason) {
            state.draftSelectedSeason = Math.max(startS, state.currentSave.currentSeason);
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
    let html = `
    <table class="data-table">
      <thead>
        <tr>
          ${renderDraftHeaderCell('Pick', 'pickNumber', 'text-center')}
          ${renderDraftHeaderCell('Runde', 'draftRound', 'text-center')}
          ${renderDraftHeaderCell('Neues Team', 'teamName')}
          ${renderDraftHeaderCell('Altes Team', 'oldTeamName')}
          ${renderDraftHeaderCell('Land', 'countryCode', 'text-center')}
          ${renderDraftHeaderCell('Fahrer', 'riderLastName')}
          ${renderDraftHeaderCell('Alter', 'riderBirthYear', 'text-center')}
          ${renderDraftHeaderCell('Vertrag', 'contractLength', 'text-center')}
          ${renderDraftHeaderCell('Stärke', 'overallAtDraft', 'text-center')}
          ${renderDraftHeaderCell('Potenzial', 'potOverallAtDraft', 'text-center')}
        </tr>
      </thead>
      <tbody>
  `;
    for (const row of sortedRows) {
        const age = state.draftHistory.season - row.riderBirthYear;
        // Altes Team String
        let oldTeamHtml = '-';
        if (row.oldTeamName) {
            oldTeamHtml = `
        <div style="display:flex; align-items:center; gap:0.5rem;">
          ${renderMiniJersey(row.oldTeamId, row.oldTeamName)}
          <button class="app-team-link" data-team-id="${row.oldTeamId}" style="background: none; border: none; padding: 0; color: #94a3b8; font-weight: normal; cursor: pointer; text-align: left; font-size: inherit;">
            ${esc(row.oldTeamName)}
          </button>
        </div>`;
        }
        // Neues Team String
        const newTeamHtml = `
      <div style="display:flex; align-items:center; gap:0.5rem;">
        ${renderMiniJersey(row.teamId, row.teamName)}
        <button class="app-team-link" data-team-id="${row.teamId}" style="background: none; border: none; padding: 0; color: #60a5fa; font-weight: bold; cursor: pointer; text-align: left; font-size: inherit;">
          ${esc(row.teamName)}
        </button>
      </div>`;
        html += `
      <tr>
        <td class="text-center">#${row.pickNumber}</td>
        <td class="text-center">Runde ${row.draftRound}</td>
        <td>${newTeamHtml}</td>
        <td>${oldTeamHtml}</td>
        <td class="text-center">${renderFlag(row.countryCode)}</td>
        <td>
          <button class="app-rider-link" data-rider-id="${row.riderId}" style="background: none; border: none; padding: 0; color: #60a5fa; font-weight: bold; cursor: pointer; text-align: left; font-size: inherit;">
            ${esc(row.riderLastName)}
          </button>
        </td>
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
export function initDraftListeners() {
    const container = $('draft-table-container');
    container.addEventListener('click', (event) => {
        const btn = event.target.closest('button[data-draft-sort]');
        if (btn) {
            const sortKey = btn.dataset['draftSort'];
            if (sortKey) {
                if (currentDraftSort.key === sortKey) {
                    currentDraftSort.asc = !currentDraftSort.asc;
                }
                else {
                    currentDraftSort.key = sortKey;
                    currentDraftSort.asc = true;
                }
                renderDraftView();
            }
        }
    });
    const replayBtn = $('draft-replay-btn');
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            const select = $('draft-season-select');
            if (select) {
                const season = Number(select.value);
                if (!isNaN(season)) {
                    void startDraftPresentation(season);
                }
            }
        });
    }
}
// ============================================================
//  DRAFT INTERACTIVE OVERLAY SYSTEM
// ============================================================
function clearDraftTimeouts() {
    if (state.draftOverlayTimer1) {
        clearTimeout(state.draftOverlayTimer1);
        state.draftOverlayTimer1 = null;
    }
    if (state.draftOverlayTimer2) {
        clearTimeout(state.draftOverlayTimer2);
        state.draftOverlayTimer2 = null;
    }
}
export function getOpenSlotsForPick(teamId, currentPickIndex, picks) {
    const team = state.teams.find(t => t.id === teamId);
    const maxRosterSize = team?.division === 'U23' ? 20 : (team?.division === 'ProTour' ? 30 : 32);
    const currentRidersCount = state.riders.filter(r => r.activeTeamId === teamId).length;
    const subsequentPicksCount = picks.slice(currentPickIndex + 1).filter(p => p.teamId === teamId).length;
    const rosterSizeAtThisPick = currentRidersCount - subsequentPicksCount;
    return Math.max(0, maxRosterSize - rosterSizeAtThisPick);
}
function getDraftRiderJerseyHtml(teamId, teamName, size = 50) {
    const resolvedTeamName = (teamId == null || teamId <= 0) ? 'Freier Fahrer' : (teamName ?? state.teams.find((team) => team.id === teamId)?.name ?? `Team ${teamId}`);
    const src = (teamId == null || teamId <= 0) ? '/jersey/Jer_placeholder.svg' : `/jersey-large/Jer_${teamId}.png`;
    return `
    <span class="results-team-jersey" title="${esc(resolvedTeamName)}" aria-label="${esc(resolvedTeamName)}" style="width: ${size}px; height: ${size}px; display: inline-block;">
      <img
        class="results-team-jersey-img"
        src="${esc(src)}"
        alt=""
        width="${size}"
        height="${size}"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
        style="width: ${size}px; height: ${size}px; border-radius: 4px; object-fit: contain;"
      >
    </span>`;
}
function getRosterForTeamAtPick(teamId, pickIndex, includeCurrentPick = false) {
    if (!state.draftOverlayPicks)
        return [];
    const teamRiders = state.riders.filter(r => r.activeTeamId === teamId);
    const startIndex = includeCurrentPick ? pickIndex + 1 : pickIndex;
    const subsequentPicks = state.draftOverlayPicks.slice(startIndex);
    const subsequentRiderIds = new Set(subsequentPicks.filter(p => p.teamId === teamId).map(p => p.riderId));
    return teamRiders.filter(r => !subsequentRiderIds.has(r.id));
}
function getSpecCounts(roster) {
    const counts = {
        'Berg': { spec1: 0, spec23: 0 },
        'Hill': { spec1: 0, spec23: 0 },
        'Sprint': { spec1: 0, spec23: 0 },
        'Timetrial': { spec1: 0, spec23: 0 },
        'Cobble': { spec1: 0, spec23: 0 }
    };
    for (const r of roster) {
        const s1 = r.specialization1;
        const s2 = r.specialization2;
        const s3 = r.specialization3;
        if (s1 && counts[s1] !== undefined)
            counts[s1].spec1++;
        if (s2 && counts[s2] !== undefined)
            counts[s2].spec23++;
        if (s3 && counts[s3] !== undefined)
            counts[s3].spec23++;
    }
    return counts;
}
function renderSpecsHeaderHtml(teamId, countsBefore, countsAfter, showAnimation) {
    const specs = ['Berg', 'Hill', 'Sprint', 'Timetrial', 'Cobble'];
    const getLabel = (s) => {
        if (s === 'Hill')
            return 'Hügel';
        if (s === 'Timetrial')
            return 'ZF';
        return s;
    };
    const hasMet = (s, spec1, spec23) => {
        if (s === 'Timetrial')
            return spec1 >= 4 || (spec1 >= 2 && spec23 >= 2);
        if (s === 'Cobble')
            return spec1 >= 4 || (spec1 >= 3 && spec23 >= 2);
        return spec1 >= 4;
    };
    const items = specs.map(s => {
        const cb = countsBefore[s] || { spec1: 0, spec23: 0 };
        const ca = countsAfter[s] || { spec1: 0, spec23: 0 };
        const met = hasMet(s, ca.spec1, ca.spec23);
        const color = met ? '#4ade80' : '#f87171';
        const text = String(showAnimation ? ca.spec1 : cb.spec1);
        let animSpan = '';
        if (showAnimation) {
            const diff1 = ca.spec1 - cb.spec1;
            if (diff1 > 0) {
                animSpan = `<span class="count-anim" style="color: #4ade80; font-weight: bold; margin-left: 0.15rem; animation: fadeUp 1.5s forwards;">(+1)</span>`;
            }
        }
        return `<div style="display: flex; align-items: center;"><span style="color: #94a3b8; margin-right: 0.25rem;">${getLabel(s)}:</span><strong style="color: ${color};">${text}</strong>${animSpan}</div>`;
    });
    const team = state.teams.find(t => t.id === teamId);
    const maxRosterSize = team?.division === 'U23' ? 20 : (team?.division === 'ProTour' ? 30 : 32);
    const sizeBefore = getRosterForTeamAtPick(teamId, state.draftOverlayCurrentIndex, false).length;
    const sizeAfter = getRosterForTeamAtPick(teamId, state.draftOverlayCurrentIndex, true).length;
    let sizeAnim = '';
    if (showAnimation && sizeAfter > sizeBefore) {
        sizeAnim = `<span class="count-anim" style="color: #4ade80; font-weight: bold; margin-left: 0.15rem; animation: fadeUp 1.5s forwards;">(+1)</span>`;
    }
    const sizeText = showAnimation ? sizeAfter : sizeBefore;
    items.push(`<div style="display: flex; align-items: center; border-left: 1px solid rgba(255,255,255,0.15); padding-left: 1rem;"><span style="color: #94a3b8; margin-right: 0.25rem;">Kader:</span><strong style="color: #fbbf24;">${sizeText}/${maxRosterSize}</strong>${sizeAnim}</div>`);
    return items.join('<span style="color: rgba(255,255,255,0.15); margin: 0 0.25rem;">|</span>');
}
function renderRiderRow(r, displayRank, index, targetRiderId, teamId) {
    const isNewCurrent = r.id === targetRiderId;
    const isNewDrafted = state.draftOverlayPicks.slice(0, index + 1).some(p => p.riderId === r.id && p.teamId === teamId);
    let nameColor = '#fff';
    let ratingColor = '#94a3b8';
    let nameWeight = 'normal';
    if (isNewCurrent) {
        nameColor = '#4ade80'; // Green for selected rider
        ratingColor = '#4ade80'; // Green for overall rating of selected rider
        nameWeight = 'bold';
    }
    else if (isNewDrafted) {
        nameColor = '#facc15'; // Yellow for other newly drafted riders
        ratingColor = '#facc15'; // Yellow for overall rating of other newly drafted riders
        nameWeight = 'bold';
    }
    const rowStyle = isNewCurrent
        ? 'border-left: 3px solid #4ade80; padding: 0.25rem 0.4rem 0.25rem 0.2rem; background: rgba(74, 222, 128, 0.08); border-radius: 4px;'
        : 'padding: 0.25rem 0.4rem; background: transparent; border-radius: 4px;';
    return `
    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; transition: all 0.2s; ${rowStyle}">
      <div style="display: flex; align-items: center; gap: 0.4rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        <span style="font-family: monospace; text-align: right; width: 1.25rem; display: inline-block; color: #64748b; font-weight: bold; margin-right: 0.2rem;">${String(displayRank).padStart(2, '0')}</span>
        ${renderFlag(r.countryCode || r.nationality)}
        <span style="color: ${nameColor}; font-weight: ${nameWeight}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${esc(r.lastName)}
        </span>
      </div>
      <span style="color: ${ratingColor}; font-weight: bold;">${r.overallRating.toFixed(1)}</span>
    </div>
  `;
}
function formatSpecName(spec) {
    if (!spec)
        return null;
    const norm = spec.toLowerCase();
    if (norm === 'berg' || norm === 'climber' || norm === 'bergfahrer')
        return 'Berg';
    if (norm === 'hill' || norm === 'puncher' || norm === 'huegelspezialist')
        return 'Hügel';
    if (norm === 'sprint' || norm === 'sprinter')
        return 'Sprint';
    if (norm === 'timetrial' || norm === 'time_trial' || norm === 'time trialist' || norm === 'zf' || norm === 'zeitfahrer')
        return 'Zeitfahren';
    if (norm === 'cobble' || norm === 'classic' || norm === 'pave' || norm === 'pflasterspezialist')
        return 'Cobble';
    if (norm === 'attacker' || norm === 'angreifer')
        return 'Angreifer';
    return spec;
}
function renderDraftCandidateBox(c, isSelected, currentTeamId) {
    const borderStyle = isSelected ? 'border: 2px solid var(--accent, #38bdf8); background: rgba(56, 189, 248, 0.08);' : 'border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02);';
    const specs = [];
    const s1 = formatSpecName(c.specialization1);
    const s2 = formatSpecName(c.specialization2);
    const s3 = formatSpecName(c.specialization3);
    if (s1)
        specs.push(s1);
    if (s2)
        specs.push(s2);
    if (s3)
        specs.push(s3);
    const specText = specs.length > 0 ? specs.map(s => esc(s)).join(' · ') : 'Allrounder';
    const uciRankText = c.uciRank ? `<span style="color: #4ade80; font-weight: bold;">${c.uciRank}</span>` : '—';
    const season = state.draftSelectedSeason ?? state.currentSave?.currentSeason ?? 2026;
    const age = season - c.birthYear;
    const winsHtml = c.wins && c.wins > 0
        ? `<span>·</span><span style="color: #4ade80;">${c.wins === 1 ? '1 Sieg' : c.wins + ' Siege'}</span>`
        : '';
    let jerseyHtml = '';
    if (c.oldTeamId === currentTeamId) {
        // contract extension: show placeholder jersey
        jerseyHtml = getDraftRiderJerseyHtml(null, null, 32);
    }
    else if (c.oldTeamId && c.oldTeamId > 0) {
        // transfer: show old team's jersey
        jerseyHtml = getDraftRiderJerseyHtml(c.oldTeamId, c.oldTeamName, 32);
    }
    else {
        // free agent / others: hide jersey icon
        jerseyHtml = '';
    }
    return `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.35rem 0.5rem; border-radius: 6px; transition: all 0.2s; ${borderStyle}">
      <div style="display: flex; align-items: center; gap: 0.6rem;">
        ${jerseyHtml ? `
        <div style="flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
          ${jerseyHtml}
        </div>
        ` : ''}
        <div>
          <div style="display: flex; align-items: center; gap: 0.35rem;">
            ${renderFlag(c.countryCode)}
            <button class="app-rider-link" data-rider-id="${c.riderId}" style="background: none; border: none; padding: 0; color: #60a5fa; font-weight: bold; cursor: pointer; text-align: left; font-size: 0.88rem; text-decoration: none;">
              ${esc(c.lastName)}
            </button>
            <span style="color: #60a5fa; font-weight: bold; font-size: 0.85rem; margin-left: 0.15rem;">(</span><span style="color: #facc15; font-weight: bold; font-size: 0.85rem;">${age}</span><span style="color: #60a5fa; font-weight: bold; font-size: 0.85rem;">)</span>
          </div>
          <div style="font-size: 0.75rem; color: #facc15; font-weight: bold; display: flex; align-items: center; gap: 0.4rem; margin-top: 0.1rem; flex-wrap: wrap;">
            <span>${specText}</span>
            <span>·</span>
            <span>UCI: ${uciRankText}</span>
            ${winsHtml}
          </div>
        </div>
      </div>
      
      <div style="display: flex; align-items: center; gap: 0.6rem;">
        <div style="text-align: right;">
          <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase;">POT</div>
          <div style="font-size: 0.8rem; font-weight: 500; color: #94a3b8;">${c.potential.toFixed(1)}</div>
          <div style="font-size: 0.7rem; color: var(--accent, #38bdf8); font-weight: 500; margin-top: 0.1rem;">${c.probability.toFixed(1)}%</div>
        </div>
        <div style="border: 1.5px solid #fbbf24; border-radius: 5px; padding: 0.25rem 0.4rem; color: #fbbf24; font-weight: bold; font-size: 0.95rem; min-width: 2.6rem; text-align: center; background: rgba(251, 191, 36, 0.05); line-height: 1.1;">
          ${c.overallRating.toFixed(1)}
        </div>
      </div>
    </div>
  `;
}
function renderDraftSelectedRiderBigBox(pick) {
    const season = state.draftSelectedSeason ?? state.currentSave?.currentSeason ?? 2026;
    const age = season - pick.riderBirthYear;
    const specText = formatSpecName(pick.riderSpecialization) || 'Allrounder';
    let jerseyComparisonHtml = '';
    if (pick.oldTeamId === pick.teamId) {
        // Verlängerung: Placeholder ➔ Team
        jerseyComparisonHtml = `
      ${getDraftRiderJerseyHtml(null, null, 95)}
      <span style="font-size: 2.5rem; color: #94a3b8; font-weight: bold; display: flex; align-items: center;">➔</span>
      ${getDraftRiderJerseyHtml(pick.teamId, pick.teamName, 95)}
    `;
    }
    else if (pick.oldTeamId && pick.oldTeamId > 0) {
        // Echter Transfer: Alt-Team ➔ Neu-Team
        jerseyComparisonHtml = `
      ${getDraftRiderJerseyHtml(pick.oldTeamId, pick.oldTeamName, 95)}
      <span style="font-size: 2.5rem; color: #94a3b8; font-weight: bold; display: flex; align-items: center;">➔</span>
      ${getDraftRiderJerseyHtml(pick.teamId, pick.teamName, 95)}
    `;
    }
    else {
        // Neuer Draft / free agency (no placeholder jersey): Nur Neu-Team Jersey anzeigen
        jerseyComparisonHtml = `
      ${getDraftRiderJerseyHtml(pick.teamId, pick.teamName, 95)}
    `;
    }
    return `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; text-align: center; animation: scaleIn 0.3s ease-out;">
      <style>
        @keyframes scaleIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      </style>
      
      <div style="display: flex; align-items: center; justify-content: center; gap: 4.5rem; margin-bottom: 2.5rem; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5));">
        ${jerseyComparisonHtml}
      </div>
      
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 1.5rem; width: 95%; max-width: 420px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3);">
        <div style="font-size: 0.9rem; color: var(--accent, #38bdf8); font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">GEZOGENER FAHRER</div>
        
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.75rem;">
          ${renderFlag(pick.countryCode)}
          <button class="app-rider-link" data-rider-id="${pick.riderId}" style="background: none; border: none; padding: 0; color: #fff; font-weight: 700; font-size: 1.8rem; cursor: pointer; text-decoration: none; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            ${esc(pick.riderLastName)}
          </button>
        </div>
        
        <div style="font-size: 1.1rem; color: #94a3b8; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <span>${specText}</span>
          <span>·</span>
          <span>${age} Jahre</span>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 0.75rem 0; margin-bottom: 1.25rem;">
          <div style="border: 1.5px solid #fbbf24; border-radius: 8px; padding: 0.5rem; background: rgba(251, 191, 36, 0.05);">
            <div style="font-size: 0.8rem; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold;">Stärke</div>
            <div style="font-size: 1.6rem; font-weight: 700; color: #fbbf24;">${pick.overallAtDraft.toFixed(1)}</div>
          </div>
          <div style="border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0.5rem; background: rgba(255,255,255,0.02);">
            <div style="font-size: 0.8rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Potenzial</div>
            <div style="font-size: 1.6rem; font-weight: 700; color: #fff;">${pick.potOverallAtDraft.toFixed(1)}</div>
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.95rem;">
          <div style="display: flex; justify-content: space-between; color: #94a3b8;">
            <span>Vertragslaufzeit:</span>
            <strong style="color: #fff;">${pick.contractLength} Jahre</strong>
          </div>
          <div style="display: flex; justify-content: space-between; color: #94a3b8;">
            <span>Altes Team:</span>
            ${pick.oldTeamId ? `
              <button class="app-team-link" data-team-id="${pick.oldTeamId}" style="background: none; border: none; padding: 0; color: #60a5fa; cursor: pointer; font-weight: 600; text-decoration: none;">
                ${esc(pick.oldTeamName)}
              </button>
            ` : '<strong style="color: #64748b;">Freier Fahrer</strong>'}
          </div>
          <div style="display: flex; justify-content: space-between; color: #94a3b8;">
            <span>Neues Team:</span>
            <button class="app-team-link" data-team-id="${pick.teamId}" style="background: none; border: none; padding: 0; color: #60a5fa; cursor: pointer; font-weight: 600; text-decoration: none;">
              ${esc(pick.teamName)}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
function createDraftOverlayElement(season) {
    let overlay = document.getElementById('draft-overlay');
    if (overlay)
        return overlay;
    overlay = document.createElement('div');
    overlay.id = 'draft-overlay';
    overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(15, 23, 42, 0.98); z-index: 10000;
    display: flex; flex-direction: column; padding: 2rem; color: #fff;
    font-family: inherit; overflow: hidden; box-sizing: border-box;
  `;
    document.body.appendChild(overlay);
    overlay.innerHTML = `
    <style>
      @keyframes fadeUp {
        0% { opacity: 0; transform: translateY(3px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; }
        100% { opacity: 0; transform: translateY(-8px); }
      }
    </style>
    <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem; margin-bottom: 1.5rem; flex-shrink: 0;">
      <div style="display: flex; align-items: center; gap: 2.25rem;">
        <div id="draft-overlay-team-jersey-wrap" style="display: flex; align-items: center; justify-content: center; width: 72px; height: 72px; flex-shrink: 0;"></div>
        <div>
          <h2 id="draft-overlay-round-title" style="margin: 0; font-size: 1.6rem; font-weight: 700;">-</h2>
          <p id="draft-overlay-team-subtitle" style="margin: 0.2rem 0 0; color: #d97706; font-weight: bold; font-size: 1.1rem;">-</p>
        </div>
      </div>
      
      <div id="draft-overlay-specs-header" style="display: flex; align-items: center; gap: 0.75rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.9rem;">
        <!-- Specs counts displayed here -->
      </div>
      
      <div style="display: flex; align-items: center; gap: 1.5rem;">
        <div style="display: flex; align-items: center; gap: 0.25rem; background: rgba(255,255,255,0.05); padding: 0.25rem; border-radius: 8px;">
          <button id="draft-overlay-pause-btn" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.9rem; font-weight: bold; min-width: 4rem;">Pause</button>
          <span style="border-left: 1px solid rgba(255,255,255,0.15); height: 1.5rem; margin: 0 0.25rem;"></span>
          <button class="btn btn-secondary draft-speed-btn" data-speed="0.25" style="padding: 0.4rem 0.6rem; font-size: 0.85rem;">x0.25</button>
          <button class="btn btn-secondary draft-speed-btn" data-speed="0.5" style="padding: 0.4rem 0.6rem; font-size: 0.85rem;">x0.5</button>
          <button class="btn btn-secondary draft-speed-btn draft-speed-btn-active" data-speed="1" style="padding: 0.4rem 0.6rem; font-size: 0.85rem; font-weight: bold; color: var(--accent, #38bdf8);">x1</button>
          <button class="btn btn-secondary draft-speed-btn" data-speed="2" style="padding: 0.4rem 0.6rem; font-size: 0.85rem;">x2</button>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.05); padding: 0.5rem 1rem; border-radius: 8px;">
          <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; user-select: none; margin: 0; font-size: 0.9rem; color: #fff;">
            <input type="checkbox" id="draft-overlay-auto-checkbox" ${state.draftOverlayAuto ? 'checked' : ''} style="cursor: pointer; width: 16px; height: 16px; margin: 0;" />
            Auto Progress
          </label>
        </div>
        
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <button id="draft-overlay-prev-btn" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 1rem;">◀</button>
          <span id="draft-overlay-progress-label" style="font-size: 0.95rem; min-width: 60px; text-align: center; color: #94a3b8;">- / -</span>
          <button id="draft-overlay-next-btn" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 1rem;">▶</button>
        </div>
        
        <button id="draft-overlay-quick-btn" class="btn btn-danger" style="font-weight: 600; padding: 0.5rem 1rem;">Quick Finish</button>
      </div>
    </header>
    
    <div style="display: flex; flex: 1; gap: 2rem; overflow: hidden; min-height: 0;">
      <!-- Linke Spalte: Kandidaten -->
      <div style="flex: 2.0; display: flex; flex-direction: column; min-height: 0;">
        <h3 style="margin: 0 0 0.75rem 0; font-size: 1rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; flex-shrink: 0;">Kandidaten-Pool</h3>
        <div id="draft-overlay-candidates-list" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.45rem 0.75rem; overflow-y: auto; flex: 1; padding-right: 0.5rem;"></div>
      </div>
      
      <!-- Rechte Spalte: Auswahl -->
      <div style="flex: 1.0; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(255,255,255,0.01); border: 2px dashed rgba(255,255,255,0.08); border-radius: 12px; padding: 1.5rem; position: relative; min-height: 0;">
        <div id="draft-overlay-pick-display" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0;"></div>
      </div>
    </div>
  `;
    overlay.addEventListener('click', (event) => {
        const target = event.target;
        if (target.id === 'draft-overlay-quick-btn') {
            closeDraftOverlay();
            return;
        }
        if (target.id === 'draft-overlay-pause-btn') {
            state.draftPaused = !state.draftPaused;
            target.textContent = state.draftPaused ? 'Weiter' : 'Pause';
            target.classList.toggle('btn-primary', state.draftPaused);
            triggerDraftSchedule();
            return;
        }
        const speedBtn = target.closest('.draft-speed-btn');
        if (speedBtn) {
            const speed = parseFloat(speedBtn.dataset['speed'] || '1');
            state.draftSpeedMultiplier = speed;
            overlay.querySelectorAll('.draft-speed-btn').forEach(btn => {
                btn.classList.remove('draft-speed-btn-active');
                btn.style.color = '';
                btn.style.fontWeight = '';
            });
            speedBtn.classList.add('draft-speed-btn-active');
            speedBtn.style.color = 'var(--accent, #38bdf8)';
            speedBtn.style.fontWeight = 'bold';
            triggerDraftSchedule();
            return;
        }
        if (target.id === 'draft-overlay-prev-btn' || target.closest('#draft-overlay-prev-btn')) {
            if (state.draftOverlayCurrentIndex > 0) {
                const autoCheckbox = document.getElementById('draft-overlay-auto-checkbox');
                if (autoCheckbox) {
                    autoCheckbox.checked = false;
                    state.draftOverlayAuto = false;
                }
                showDraftPick(state.draftOverlayCurrentIndex - 1);
            }
            return;
        }
        if (target.id === 'draft-overlay-next-btn' || target.closest('#draft-overlay-next-btn')) {
            if (state.draftOverlayPicks && state.draftOverlayCurrentIndex + 1 < state.draftOverlayPicks.length) {
                const autoCheckbox = document.getElementById('draft-overlay-auto-checkbox');
                if (autoCheckbox) {
                    autoCheckbox.checked = false;
                    state.draftOverlayAuto = false;
                }
                showDraftPick(state.draftOverlayCurrentIndex + 1);
            }
            return;
        }
    });
    overlay.addEventListener('change', (event) => {
        const target = event.target;
        if (target.id === 'draft-overlay-auto-checkbox') {
            state.draftOverlayAuto = target.checked;
            if (state.draftOverlayAuto) {
                triggerDraftSchedule();
            }
            else {
                clearDraftTimeouts();
            }
        }
    });
    return overlay;
}
export function triggerDraftSchedule() {
    clearDraftTimeouts();
    if (state.draftPaused)
        return;
    const speed = state.draftSpeedMultiplier;
    const index = state.draftOverlayCurrentIndex;
    if (!state.draftRevealShown) {
        const delay = 2000 / speed;
        state.draftOverlayTimer1 = window.setTimeout(() => {
            revealCurrentPick();
        }, delay);
    }
    else {
        if (state.draftOverlayAuto) {
            const delay = 3000 / speed;
            state.draftOverlayTimer2 = window.setTimeout(() => {
                const nextIndex = index + 1;
                if (nextIndex < state.draftOverlayPicks.length) {
                    showDraftPick(nextIndex);
                }
                else {
                    closeDraftOverlay();
                }
            }, delay);
        }
    }
}
export function revealCurrentPick() {
    const index = state.draftOverlayCurrentIndex;
    const pick = state.draftOverlayPicks[index];
    state.draftRevealShown = true;
    // 1. Roster counts update including new drafted rider
    const rosterBefore = getRosterForTeamAtPick(pick.teamId, index, false);
    const rosterAfter = getRosterForTeamAtPick(pick.teamId, index, true);
    const countsBefore = getSpecCounts(rosterBefore);
    const countsAfter = getSpecCounts(rosterAfter);
    const specsHeader = document.getElementById('draft-overlay-specs-header');
    if (specsHeader) {
        specsHeader.innerHTML = renderSpecsHeaderHtml(pick.teamId, countsBefore, countsAfter, true);
    }
    // 2. Render 3 column reveal layout
    const displayWrap = document.getElementById('draft-overlay-pick-display');
    if (displayWrap) {
        // Sort roster after pick by strength descending
        const sortedRoster = [...rosterAfter].sort((a, b) => b.overallRating - a.overallRating);
        const top10 = sortedRoster.slice(0, 10);
        const isRiderInTop10 = top10.some(r => r.id === pick.riderId);
        const rankInTeam = sortedRoster.findIndex(r => r.id === pick.riderId) + 1;
        let top10Html = top10.map((r, i) => renderRiderRow(r, i + 1, index, pick.riderId, pick.teamId)).join('');
        if (!isRiderInTop10) {
            const newlyDraftedRider = sortedRoster.find(r => r.id === pick.riderId);
            if (newlyDraftedRider) {
                top10Html += `
          <div style="border-top: 1px dashed rgba(255,255,255,0.15); margin: 0.3rem 0; padding-top: 0.3rem;"></div>
          ${renderRiderRow(newlyDraftedRider, rankInTeam, index, pick.riderId, pick.teamId)}
        `;
            }
        }
        // Find drafted rider's Spec 1
        const draftedRiderDetails = state.riders.find(r => r.id === pick.riderId);
        const draftedRiderSpec1 = draftedRiderDetails?.specialization1;
        const specLabel = formatSpecName(draftedRiderSpec1) || 'Allrounder';
        // Find spec companions (r.spec1 or r.spec2 matches draftedRiderSpec1, including the drafted rider)
        const specCompanions = sortedRoster.filter(r => draftedRiderSpec1 &&
            (r.specialization1 === draftedRiderSpec1 || r.specialization2 === draftedRiderSpec1)).slice(0, 10); // cap at 10 to keep layout readable
        let specCompanionsHtml = specCompanions.map((r) => {
            const companionRank = sortedRoster.findIndex(x => x.id === r.id) + 1;
            return renderRiderRow(r, companionRank, index, pick.riderId, pick.teamId);
        }).join('');
        if (specCompanions.length === 0) {
            specCompanionsHtml = '<div style="font-size: 0.8rem; color: #64748b; font-style: italic; padding: 0.5rem; text-align: center;">Keine Partner im Team</div>';
        }
        displayWrap.innerHTML = `
      <div style="display: flex; width: 100%; height: 100%; gap: 1rem; overflow: hidden; animation: scaleIn 0.3s ease-out;">
        <!-- Left Column: Both Gesamtstärke and Spec Box -->
        <div style="flex: 1.25; display: flex; flex-direction: column; gap: 1rem; min-height: 0;">
          
          <!-- Top Box: Gesamtstärkenrangliste -->
          <div style="flex: 1; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 0.75rem; display: flex; flex-direction: column; overflow: hidden; min-height: 0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);">
            <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.25rem;">Kader Top 10</h4>
            <div style="overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 0.35rem; padding-right: 0.25rem;">
              ${top10Html}
            </div>
          </div>
          
          <!-- Bottom Box: Spec Rangliste -->
          <div style="flex: 1; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 0.75rem; display: flex; flex-direction: column; overflow: hidden; min-height: 0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);">
            <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span>Spec: ${esc(specLabel)}</span>
              <span style="font-size: 0.75rem; font-weight: normal; color: #64748b;">(max 10)</span>
            </h4>
            <div style="overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 0.35rem; padding-right: 0.25rem;">
              ${specCompanionsHtml}
            </div>
          </div>
          
        </div>
        
        <!-- Right Column: Draft Big Card -->
        <div style="flex: 2.0; display: flex; justify-content: center; align-items: center; min-height: 0;">
          ${renderDraftSelectedRiderBigBox(pick)}
        </div>
      </div>
    `;
    }
    // Continue scheduler for auto progress
    triggerDraftSchedule();
}
function interleaveCandidates(arr) {
    const n = arr.length;
    const half = Math.ceil(n / 2);
    const result = [];
    for (let i = 0; i < half; i++) {
        result.push(arr[i]);
        if (i + half < n) {
            result.push(arr[i + half]);
        }
    }
    return result;
}
export function showDraftPick(index) {
    if (!state.draftOverlayPicks || index < 0 || index >= state.draftOverlayPicks.length)
        return;
    clearDraftTimeouts();
    state.draftOverlayCurrentIndex = index;
    state.draftRevealShown = false;
    const pick = state.draftOverlayPicks[index];
    const overlay = document.getElementById('draft-overlay');
    if (!overlay)
        return;
    // Header Info update
    const roundTitle = document.getElementById('draft-overlay-round-title');
    if (roundTitle)
        roundTitle.textContent = `Runde ${pick.draftRound} - Pick #${pick.pickNumber}`;
    const teamSubtitle = document.getElementById('draft-overlay-team-subtitle');
    if (teamSubtitle) {
        teamSubtitle.textContent = pick.teamName;
    }
    const teamJerseyWrap = document.getElementById('draft-overlay-team-jersey-wrap');
    if (teamJerseyWrap) {
        teamJerseyWrap.innerHTML = getDraftRiderJerseyHtml(pick.teamId, pick.teamName, 72);
    }
    const progressLabel = document.getElementById('draft-overlay-progress-label');
    if (progressLabel) {
        progressLabel.textContent = `${index + 1} / ${state.draftOverlayPicks.length}`;
    }
    // Active spec counts and roster slots before the pick
    const rosterBefore = getRosterForTeamAtPick(pick.teamId, index, false);
    const countsBefore = getSpecCounts(rosterBefore);
    const specsHeader = document.getElementById('draft-overlay-specs-header');
    if (specsHeader) {
        specsHeader.innerHTML = renderSpecsHeaderHtml(pick.teamId, countsBefore, countsBefore, false);
    }
    // Navigation buttons state
    const prevBtn = document.getElementById('draft-overlay-prev-btn');
    if (prevBtn)
        prevBtn.disabled = index === 0;
    const nextBtn = document.getElementById('draft-overlay-next-btn');
    if (nextBtn)
        nextBtn.disabled = index === state.draftOverlayPicks.length - 1;
    // Candidates pool sort by OVR desc
    const sortedPool = [...pick.candidates].sort((a, b) => b.overallRating - a.overallRating);
    const interleavedPool = interleaveCandidates(sortedPool);
    const candList = document.getElementById('draft-overlay-candidates-list');
    if (candList) {
        candList.innerHTML = interleavedPool.map((c) => {
            const isSelected = c.riderId === pick.riderId;
            return renderDraftCandidateBox(c, isSelected, pick.teamId);
        }).join('');
    }
    // Loading selection display
    const displayWrap = document.getElementById('draft-overlay-pick-display');
    if (displayWrap) {
        displayWrap.innerHTML = `
      <div style="font-size: 1.3rem; font-weight: 500; color: #94a3b8; display: flex; flex-direction: column; align-items: center; gap: 2.25rem; transform: translateY(-20px);">
        <div style="animation: pulse 1s infinite alternate; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5)); display: flex; align-items: center; justify-content: center; width: 120px; height: 120px;">
          ${getDraftRiderJerseyHtml(pick.teamId, pick.teamName, 120)}
        </div>
        <style>
          @keyframes pulse {
            from { opacity: 0.4; transform: scale(0.92); }
            to { opacity: 1; transform: scale(1.08); }
          }
        </style>
        <span>Treffe Auswahl...</span>
      </div>
    `;
    }
    // Start tick scheduling
    triggerDraftSchedule();
}
export function closeDraftOverlay() {
    clearDraftTimeouts();
    state.draftOverlayActive = false;
    state.draftOverlayPicks = null;
    const overlay = document.getElementById('draft-overlay');
    if (overlay) {
        overlay.remove();
    }
    if (state.draftSelectedSeason) {
        void loadDraftHistory(state.draftSelectedSeason);
    }
}
export async function startDraftPresentation(season) {
    clearDraftTimeouts();
    state.draftOverlayActive = true;
    state.draftOverlayAuto = true;
    state.draftOverlayCurrentIndex = 0;
    state.draftSelectedSeason = season;
    state.draftSpeedMultiplier = 1;
    state.draftPaused = false;
    state.draftRevealShown = false;
    showLoading('Draft-Präsentation wird geladen...');
    try {
        const [res, ridersRes, teamsRes] = await Promise.all([
            api.getDraftDetails(season),
            api.getRiders(undefined, false, true, season),
            api.getTeams(),
        ]);
        if (!res.success || !res.data || !res.data.picks || res.data.picks.length === 0) {
            hideLoading();
            state.draftOverlayActive = false;
            return;
        }
        if (ridersRes.success && ridersRes.data) {
            state.riders = ridersRes.data;
        }
        if (teamsRes.success && teamsRes.data) {
            state.teams = teamsRes.data;
        }
        state.draftOverlayPicks = res.data.picks;
        createDraftOverlayElement(season);
        showDraftPick(0);
    }
    catch (e) {
        console.error(e);
        state.draftOverlayActive = false;
    }
    finally {
        hideLoading();
    }
}
