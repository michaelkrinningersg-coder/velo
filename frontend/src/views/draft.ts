import { api } from '../api';
import {
  $,
  esc,
  state,
  renderFlag,
  renderMiniJersey,
  isActiveView,
  showLoading,
  hideLoading,
} from '../state';
import type { DraftHistoryPayload, DraftHistoryRow } from '../../../shared/types';

export let currentDraftSort: { key: keyof DraftHistoryRow | 'potOverallAtDraft', asc: boolean } = { key: 'pickNumber', asc: true };

export function getHeatmapStyleForRating(score: number): string {
  const ratio = Math.max(0, Math.min(1, (score - 50) / 35));
  const hue = Math.round(6 + (ratio * 118));
  const borderAlpha = 0.26 + (ratio * 0.18);
  const bgAlpha = 0.14 + (ratio * 0.12);
  return `--rider-stats-pill-hue:${hue};--rider-stats-pill-border-alpha:${borderAlpha};--rider-stats-pill-bg-alpha:${bgAlpha};`;
}

export function getDraftSortIndicator(sortKey: string): string {
  if (currentDraftSort.key !== sortKey) return '<span class="team-table-sort-indicator">↕</span>';
  return `<span class="team-table-sort-indicator team-table-sort-indicator-active">${currentDraftSort.asc ? '↑' : '↓'}</span>`;
}

export function renderDraftHeaderCell(label: string, sortKey: string, className = ''): string {
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

export async function loadDraftHistory(season: number, silent = false): Promise<void> {
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

export function renderDraftView(): void {
  const container = $('draft-table-container');
  const select = $('draft-season-select') as HTMLSelectElement;

  if (!state.currentSave) {
    container.innerHTML = '<div class="alert alert-info">Kein Spiel geladen.</div>';
    return;
  }

  // Populate season select if empty
  if (select.options.length === 0) {
    const startS = ((state.currentSave as any).startSeason ?? 2026) + 1;
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
      const target = e.target as HTMLSelectElement;
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
    } else if (key === 'teamName') {
      comparison = a.teamName.localeCompare(b.teamName);
    } else if (key === 'oldTeamName') {
      comparison = (a.oldTeamName || '').localeCompare(b.oldTeamName || '');
    } else if (key === 'countryCode') {
      comparison = a.countryCode.localeCompare(b.countryCode);
    } else {
      comparison = ((a as any)[key] ?? 0) - ((b as any)[key] ?? 0);
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
            ${esc(row.riderFirstName)} ${esc(row.riderLastName)}
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

export function initDraftListeners(): void {
  const container = $('draft-table-container');
  container.addEventListener('click', (event) => {
    const btn = (event.target as Element).closest<HTMLButtonElement>('button[data-draft-sort]');
    if (btn) {
      const sortKey = btn.dataset['draftSort'] as any;
      if (sortKey) {
        if (currentDraftSort.key === sortKey) {
          currentDraftSort.asc = !currentDraftSort.asc;
        } else {
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
      const select = $('draft-season-select') as HTMLSelectElement | null;
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

function clearDraftTimeouts(): void {
  if ((state as any).draftOverlayTimer1) {
    clearTimeout((state as any).draftOverlayTimer1);
    (state as any).draftOverlayTimer1 = null;
  }
  if ((state as any).draftOverlayTimer2) {
    clearTimeout((state as any).draftOverlayTimer2);
    (state as any).draftOverlayTimer2 = null;
  }
}

export function getOpenSlotsForPick(teamId: number, currentPickIndex: number, picks: any[]): number {
  const team = state.teams.find(t => t.id === teamId);
  const maxRosterSize = team?.division === 'U23' ? 20 : (team?.division === 'ProTour' ? 30 : 32); 
  
  const currentRidersCount = state.riders.filter(r => r.activeTeamId === teamId).length;
  const subsequentPicksCount = picks.slice(currentPickIndex + 1).filter(p => p.teamId === teamId).length;
  
  const rosterSizeAtThisPick = currentRidersCount - subsequentPicksCount;
  return Math.max(0, maxRosterSize - rosterSizeAtThisPick);
}

function getDraftRiderJerseyHtml(teamId: number | null, teamName: string | null): string {
  if (teamId == null || teamId <= 0) {
    return `
      <svg viewBox="0 0 100 100" width="36" height="36" style="display: block;">
        <path d="M 30,20 Q 50,15 70,20 L 80,45 L 65,50 L 60,35 L 60,85 L 40,85 L 40,35 L 35,50 L 20,45 Z" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      </svg>
    `;
  }
  return renderMiniJersey(teamId, teamName || '');
}

function renderDraftCandidateBox(c: any, isSelected: boolean): string {
  const borderStyle = isSelected ? 'border: 2px solid var(--accent, #38bdf8); background: rgba(56, 189, 248, 0.08);' : 'border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02);';
  const uciRankText = c.uciRank ? `UCI: #${c.uciRank}` : 'UCI: -';
  const specText = c.specialization ? esc(c.specialization) : 'Allrounder';
  
  return `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.8rem; border-radius: 8px; transition: all 0.2s; ${borderStyle}">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div style="flex-shrink: 0;">
          ${getDraftRiderJerseyHtml(c.oldTeamId, c.oldTeamName)}
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            ${renderFlag(c.countryCode)}
            <button class="app-rider-link" data-rider-id="${c.riderId}" style="background: none; border: none; padding: 0; color: #60a5fa; font-weight: bold; cursor: pointer; text-align: left; font-size: 0.95rem; text-decoration: none;">
              ${esc(c.firstName)} ${esc(c.lastName)}
            </button>
          </div>
          <div style="font-size: 0.8rem; color: #94a3b8; display: flex; align-items: center; gap: 0.5rem; margin-top: 0.1rem; flex-wrap: wrap;">
            <span>${specText}</span>
            <span>·</span>
            <span>${uciRankText}</span>
            <span>·</span>
            ${c.oldTeamId ? `
              <button class="app-team-link" data-team-id="${c.oldTeamId}" style="background: none; border: none; padding: 0; color: #94a3b8; cursor: pointer; font-size: 0.8rem; text-align: left; text-decoration: none;">
                ${esc(c.oldTeamName)}
              </button>
            ` : '<span style="color: #64748b;">Freier Fahrer</span>'}
          </div>
        </div>
      </div>
      
      <div style="text-align: right;">
        <div style="font-size: 0.95rem; font-weight: 600; color: #fff;">OVR ${c.overallRating.toFixed(1)} <span style="font-size: 0.8rem; color: #94a3b8; font-weight: normal;">(POT ${c.potential.toFixed(1)})</span></div>
        <div style="font-size: 0.8rem; color: var(--accent, #38bdf8); font-weight: 500; margin-top: 0.1rem;">${c.probability.toFixed(1)}%</div>
      </div>
    </div>
  `;
}

function renderDraftSelectedRiderBigBox(pick: any): string {
  const age = state.draftHistory ? state.draftHistory.season - pick.riderBirthYear : 0;
  const specText = pick.riderSpecialization || 'Allrounder';
  
  return `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; text-align: center; animation: scaleIn 0.3s ease-out;">
      <style>
        @keyframes scaleIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      </style>
      
      <div style="transform: scale(3.5); margin-bottom: 2.5rem; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5));">
        ${renderMiniJersey(pick.teamId, pick.teamName)}
      </div>
      
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 2rem; width: 85%; max-width: 460px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3);">
        <div style="font-size: 0.9rem; color: var(--accent, #38bdf8); font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">GEZOGENER FAHRER</div>
        
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.75rem;">
          ${renderFlag(pick.countryCode)}
          <button class="app-rider-link" data-rider-id="${pick.riderId}" style="background: none; border: none; padding: 0; color: #fff; font-weight: 700; font-size: 1.8rem; cursor: pointer; text-decoration: none; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            ${esc(pick.riderFirstName)} ${esc(pick.riderLastName)}
          </button>
        </div>
        
        <div style="font-size: 1.1rem; color: #94a3b8; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <span>${specText}</span>
          <span>·</span>
          <span>${age} Jahre</span>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 1rem 0; margin-bottom: 1.5rem;">
          <div>
            <div style="font-size: 0.8rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Stärke (OVR)</div>
            <div style="font-size: 1.6rem; font-weight: 700; color: #fff;">${pick.overallAtDraft.toFixed(1)}</div>
          </div>
          <div>
            <div style="font-size: 0.8rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Potenzial (POT)</div>
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

function createDraftOverlayElement(season: number): HTMLElement {
  let overlay = document.getElementById('draft-overlay');
  if (overlay) return overlay;
  
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
    <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem; margin-bottom: 1.5rem; flex-shrink: 0;">
      <div style="display: flex; align-items: center; gap: 1.5rem;">
        <div id="draft-overlay-team-jersey-wrap" style="transform: scale(1.4); transform-origin: left center;"></div>
        <div>
          <h2 id="draft-overlay-round-title" style="margin: 0; font-size: 1.6rem; font-weight: 700;">-</h2>
          <p id="draft-overlay-team-subtitle" style="margin: 0.2rem 0 0; color: #94a3b8; font-size: 1rem;">-</p>
        </div>
      </div>
      
      <div style="display: flex; align-items: center; gap: 2rem;">
        <div style="text-align: right;">
          <div style="font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">Offene Plätze</div>
          <div id="draft-overlay-roster-slots" style="font-size: 1.3rem; font-weight: 600; color: var(--accent, #38bdf8);">-</div>
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
      <div style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
        <h3 style="margin: 0 0 0.75rem 0; font-size: 1rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; flex-shrink: 0;">Kandidaten-Pool</h3>
        <div id="draft-overlay-candidates-list" style="display: flex; flex-direction: column; gap: 0.6rem; overflow-y: auto; flex: 1; padding-right: 0.5rem;"></div>
      </div>
      
      <!-- Rechte Spalte: Auswahl -->
      <div style="flex: 1.3; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(255,255,255,0.01); border: 2px dashed rgba(255,255,255,0.08); border-radius: 12px; padding: 2rem; position: relative; min-height: 0;">
        <div id="draft-overlay-pick-display" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0;"></div>
      </div>
    </div>
  `;
  
  overlay.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    
    if (target.id === 'draft-overlay-quick-btn') {
      closeDraftOverlay();
      return;
    }
    
    if (target.id === 'draft-overlay-prev-btn' || target.closest('#draft-overlay-prev-btn')) {
      if (state.draftOverlayCurrentIndex > 0) {
        const autoCheckbox = document.getElementById('draft-overlay-auto-checkbox') as HTMLInputElement;
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
        const autoCheckbox = document.getElementById('draft-overlay-auto-checkbox') as HTMLInputElement;
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
    const target = event.target as HTMLInputElement;
    if (target.id === 'draft-overlay-auto-checkbox') {
      state.draftOverlayAuto = target.checked;
      if (state.draftOverlayAuto) {
        showDraftPick(state.draftOverlayCurrentIndex);
      } else {
        clearDraftTimeouts();
      }
    }
  });
  
  return overlay;
}

export function showDraftPick(index: number): void {
  if (!state.draftOverlayPicks || index < 0 || index >= state.draftOverlayPicks.length) return;
  
  clearDraftTimeouts();
  state.draftOverlayCurrentIndex = index;
  
  const pick = state.draftOverlayPicks[index];
  const overlay = document.getElementById('draft-overlay');
  if (!overlay) return;
  
  // Header-Infos aktualisieren
  const roundTitle = document.getElementById('draft-overlay-round-title');
  if (roundTitle) roundTitle.textContent = `Runde ${pick.draftRound} - Pick #${pick.pickNumber}`;
  
  const teamSubtitle = document.getElementById('draft-overlay-team-subtitle');
  if (teamSubtitle) {
    teamSubtitle.innerHTML = `Team: <strong>${esc(pick.teamName)}</strong>`;
  }
  
  const teamJerseyWrap = document.getElementById('draft-overlay-team-jersey-wrap');
  if (teamJerseyWrap) {
    teamJerseyWrap.innerHTML = renderMiniJersey(pick.teamId, pick.teamName);
  }
  
  const progressLabel = document.getElementById('draft-overlay-progress-label');
  if (progressLabel) {
    progressLabel.textContent = `${index + 1} / ${state.draftOverlayPicks.length}`;
  }
  
  const openSlots = getOpenSlotsForPick(pick.teamId, index, state.draftOverlayPicks);
  const slotsVal = document.getElementById('draft-overlay-roster-slots');
  if (slotsVal) slotsVal.textContent = `${openSlots}`;
  
  // Navigation Buttons disabled States
  const prevBtn = document.getElementById('draft-overlay-prev-btn') as HTMLButtonElement;
  if (prevBtn) prevBtn.disabled = index === 0;
  
  const nextBtn = document.getElementById('draft-overlay-next-btn') as HTMLButtonElement;
  if (nextBtn) nextBtn.disabled = index === state.draftOverlayPicks.length - 1;
  
  // Linke Spalte (Kandidaten-Pool) rendern
  const candList = document.getElementById('draft-overlay-candidates-list');
  if (candList) {
    candList.innerHTML = pick.candidates.map((c: any) => {
      const isSelected = c.riderId === pick.riderId;
      return renderDraftCandidateBox(c, isSelected);
    }).join('');
  }
  
  // Rechte Spalte (Wählender Zustand)
  const displayWrap = document.getElementById('draft-overlay-pick-display');
  if (displayWrap) {
    displayWrap.innerHTML = `
      <div style="font-size: 1.3rem; font-weight: 500; color: #94a3b8; display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">
        <div style="transform: scale(2.5); animation: pulse 1s infinite alternate; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5));">
          ${renderMiniJersey(pick.teamId, pick.teamName)}
        </div>
        <style>
          @keyframes pulse {
            from { opacity: 0.3; transform: scale(2.4); }
            to { opacity: 1; transform: scale(2.6); }
          }
        </style>
        <span>Treffe Auswahl...</span>
      </div>
    `;
    
    // Nach 2 Sekunden Verzögerung: gezogenen Fahrer einblenden
    const t1 = window.setTimeout(() => {
      if (!state.draftOverlayActive || state.draftOverlayCurrentIndex !== index) return;
      
      displayWrap.innerHTML = renderDraftSelectedRiderBigBox(pick);
      
      // Nach weiteren 3 Sekunden: Nächster Pick (falls Auto-Progress aktiv)
      if (state.draftOverlayAuto) {
        const t2 = window.setTimeout(() => {
          if (!state.draftOverlayActive || state.draftOverlayCurrentIndex !== index) return;
          if (index + 1 < state.draftOverlayPicks!.length) {
            showDraftPick(index + 1);
          } else {
            closeDraftOverlay();
          }
        }, 3000);
        (state as any).draftOverlayTimer2 = t2;
      }
    }, 2000);
    (state as any).draftOverlayTimer1 = t1;
  }
}

export function closeDraftOverlay(): void {
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

export async function startDraftPresentation(season: number): Promise<void> {
  clearDraftTimeouts();
  state.draftOverlayActive = true;
  state.draftOverlayAuto = true;
  state.draftOverlayCurrentIndex = 0;
  
  showLoading('Draft-Präsentation wird geladen...');
  try {
    const res = await api.getDraftDetails(season);
    if (!res.success || !res.data || !res.data.picks || res.data.picks.length === 0) {
      hideLoading();
      state.draftOverlayActive = false;
      return;
    }
    
    state.draftOverlayPicks = res.data.picks;
    createDraftOverlayElement(season);
    showDraftPick(0);
  } catch (e) {
    console.error(e);
    state.draftOverlayActive = false;
  } finally {
    hideLoading();
  }
}
