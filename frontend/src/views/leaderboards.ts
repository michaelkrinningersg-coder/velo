import { api } from '../api';
import {
  $,
  esc,
  renderFlag,
  renderMiniJersey,
  isActiveView,
} from '../state';
import { openRiderStats } from './riderStats';

let activeScope: 'riders' | 'teams' = 'riders';
let activePeriod: 'season' | 'alltime' | 'live' = 'season';
let savedUserPeriod: 'season' | 'alltime' = 'season'; // to restore period when unlocking
let activeMetricKey = '';

// List of all select IDs
const SELECT_IDS = [
  'leaderboard-select-performance',
  'leaderboard-select-load',
  'leaderboard-select-physis',
  'leaderboard-select-action',
  'leaderboard-select-jersey',
  'leaderboard-select-events',
];

export function initLeaderboardsView(): void {
  // Setup listeners for scope tabs
  const scopeTabs = $('leaderboards-scope-tabs');
  if (scopeTabs) {
    const buttons = scopeTabs.querySelectorAll('button');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const scope = btn.getAttribute('data-scope') as 'riders' | 'teams';
        setScope(scope);
      });
    });
  }

  // Setup listeners for period tabs
  const periodTabs = $('leaderboards-period-tabs');
  if (periodTabs) {
    const buttons = periodTabs.querySelectorAll('button');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.hasAttribute('disabled')) return;
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const period = btn.getAttribute('data-period') as 'season' | 'alltime';
        setPeriod(period);
      });
    });
  }

  // Setup listeners for all selects
  SELECT_IDS.forEach((id) => {
    const el = $(id) as HTMLSelectElement;
    if (el) {
      el.addEventListener('change', () => {
        const val = el.value;
        if (val) {
          selectMetric(val, id);
        } else {
          // If cleared, check if any select has a value
          const hasVal = SELECT_IDS.some((sid) => {
            const selectEl = $(sid) as HTMLSelectElement;
            return selectEl && selectEl.value !== '';
          });
          if (!hasVal) {
            activeMetricKey = '';
            renderLeaderboard();
          }
        }
      });
    }
  });

  // Expose global callback for openRiderStats from leaderboard links
  (window as any).openRiderStatsFromLeaderboard = openRiderStats;

  // Setup listeners for checkboxes
  const wtCheckbox = $('leaderboard-filter-wt');
  const ptCheckbox = $('leaderboard-filter-pt');
  const otherCheckbox = $('leaderboard-filter-other');

  [wtCheckbox, ptCheckbox, otherCheckbox].forEach((checkbox) => {
    if (checkbox) {
      checkbox.addEventListener('change', () => {
        renderLeaderboard();
      });
    }
  });
}

export function showLeaderboardsView(): void {
  // Triggered when view is shown
  renderLeaderboard();
}

function setScope(scope: 'riders' | 'teams'): void {
  activeScope = scope;
  
  // Show/hide physis & form select group
  const physisGroup = $('leaderboard-group-physis');
  if (physisGroup) {
    physisGroup.style.display = scope === 'teams' ? 'none' : 'block';
  }

  // Handle teams scope restrictions
  if (scope === 'teams') {
    // If active metric is a physis metric, reset it
    if (isPhysisMetric(activeMetricKey) || activeMetricKey === 'strongest_lieutenants') {
      resetAllSelects();
      activeMetricKey = '';
    }
    // If period is live, restore to saved user period
    if (activePeriod === 'live') {
      activePeriod = savedUserPeriod;
      updatePeriodTabsUI();
    }
  }

  renderLeaderboard();
}

function setPeriod(period: 'season' | 'alltime'): void {
  activePeriod = period;
  savedUserPeriod = period;
  renderLeaderboard();
}

function selectMetric(metricKey: string, sourceSelectId: string): void {
  activeMetricKey = metricKey;

  // Reset all other selects
  SELECT_IDS.forEach((id) => {
    if (id !== sourceSelectId) {
      const el = $(id) as HTMLSelectElement;
      if (el) el.value = '';
    }
  });

  // Apply period locking rules
  if (isLiveMetric(metricKey)) {
    activePeriod = 'live';
    updatePeriodTabsUI();
  } else if (isAllTimeOnlyMetric(metricKey)) {
    activePeriod = 'alltime';
    updatePeriodTabsUI();
  } else {
    // Restore saved period
    activePeriod = savedUserPeriod;
    updatePeriodTabsUI();
  }

  renderLeaderboard();
}

function isLiveMetric(key: string): boolean {
  return [
    'fatigue_short',
    'fatigue_long',
    'fatigue_combined',
    'form_r',
    'form_s',
    'form_combined',
  ].includes(key);
}

function isAllTimeOnlyMetric(key: string): boolean {
  return [
    'max_short_term_fatigue',
    'max_long_term_fatigue',
    'max_combined_fatigue',
    'max_s_form',
    'max_r_form',
    'max_combined_form',
    'mentors_ranking',
  ].includes(key) || key.startsWith('youngest_winners');
}

function isPhysisMetric(key: string): boolean {
  return isLiveMetric(key) || isAllTimeOnlyMetric(key) || key === 'mentors_ranking';
}

function resetAllSelects(): void {
  SELECT_IDS.forEach((id) => {
    const el = $(id) as HTMLSelectElement;
    if (el) el.value = '';
  });
}

function updatePeriodTabsUI(): void {
  const periodTabs = $('leaderboards-period-tabs');
  if (!periodTabs) return;

  const seasonBtn = periodTabs.querySelector('button[data-period="season"]') as HTMLButtonElement;
  const alltimeBtn = periodTabs.querySelector('button[data-period="alltime"]') as HTMLButtonElement;

  if (activePeriod === 'live') {
    // Hide period tabs
    periodTabs.style.display = 'none';
  } else {
    periodTabs.style.display = 'flex';
    
    if (isAllTimeOnlyMetric(activeMetricKey)) {
      // Lock to All-Time
      if (seasonBtn) {
        seasonBtn.disabled = true;
        seasonBtn.classList.remove('active');
        seasonBtn.style.opacity = '0.5';
        seasonBtn.style.cursor = 'not-allowed';
      }
      if (alltimeBtn) {
        alltimeBtn.disabled = false;
        alltimeBtn.classList.add('active');
        alltimeBtn.style.opacity = '1';
        alltimeBtn.style.cursor = 'pointer';
      }
    } else {
      // Normal behavior
      if (seasonBtn) {
        seasonBtn.disabled = false;
        seasonBtn.style.opacity = '1';
        seasonBtn.style.cursor = 'pointer';
      }
      if (alltimeBtn) {
        alltimeBtn.disabled = false;
        alltimeBtn.style.opacity = '1';
        alltimeBtn.style.cursor = 'pointer';
      }

      if (activePeriod === 'season') {
        if (seasonBtn) seasonBtn.classList.add('active');
        if (alltimeBtn) alltimeBtn.classList.remove('active');
      } else {
        if (seasonBtn) seasonBtn.classList.remove('active');
        if (alltimeBtn) alltimeBtn.classList.add('active');
      }
    }
  }
}

export async function renderLeaderboard(): Promise<void> {
  const emptyEl = $('leaderboard-empty');
  const tableEl = $('leaderboard-table');
  const theadEl = $('leaderboard-thead');
  const tbodyEl = $('leaderboard-tbody');

  if (!emptyEl || !tableEl || !theadEl || !tbodyEl) return;

  const filterContainer = $('leaderboard-filter-container');
  if (filterContainer) {
    filterContainer.style.display = activeScope === 'teams' ? 'none' : 'flex';
  }

  if (!activeMetricKey) {
    emptyEl.textContent = 'Wähle eine Statistik aus den Dropdowns oben aus, um die Rangliste zu laden.';
    emptyEl.classList.remove('hidden');
    tableEl.classList.add('hidden');
    return;
  }

  // Show loading state
  emptyEl.textContent = 'Lade Daten...';
  emptyEl.classList.remove('hidden');
  tableEl.classList.add('hidden');

  const res = await api.getLeaderboards(activeScope, activeMetricKey, activePeriod);
  
  if (!isActiveView('leaderboards')) {
    return; // User navigated away
  }

  if (!res.success || !res.data || res.data.length === 0) {
    emptyEl.textContent = res.error || 'Keine Einträge für diese Rangliste gefunden.';
    emptyEl.classList.remove('hidden');
    tableEl.classList.add('hidden');
    return;
  }

  // Live filtering
  let filteredData = res.data;
  if (activeScope === 'riders') {
    const wtChecked = ($('leaderboard-filter-wt') as HTMLInputElement)?.checked ?? true;
    const ptChecked = ($('leaderboard-filter-pt') as HTMLInputElement)?.checked ?? true;
    const otherChecked = ($('leaderboard-filter-other') as HTMLInputElement)?.checked ?? false;

    filteredData = res.data.filter((row: any) => {
      const isWT = row.teamDivisionId === 1 && !row.isRetired;
      const isPT = row.teamDivisionId === 2 && !row.isRetired;
      const isOther = row.teamDivisionId === null || row.teamDivisionId === undefined || row.isRetired || (row.teamDivisionId !== 1 && row.teamDivisionId !== 2);

      if (isWT && wtChecked) return true;
      if (isPT && ptChecked) return true;
      if (isOther && otherChecked) return true;
      return false;
    });

    if (filteredData.length === 0) {
      emptyEl.textContent = 'Keine Einträge für die ausgewählten Filter gefunden.';
      emptyEl.classList.remove('hidden');
      tableEl.classList.add('hidden');
      return;
    }
  }

  // Hide empty state, show table
  emptyEl.classList.add('hidden');
  tableEl.classList.remove('hidden');

  // Render headers
  const isLeadout = activeMetricKey === 'highest_leadout_bonus';
  const isLieutenant = activeMetricKey === 'strongest_lieutenants';
  if (activeScope === 'riders') {
    theadEl.innerHTML = `
      <tr>
        <th style="width: 60px; text-align: center;">Platz</th>
        <th style="width: 50px; text-align: center;">Trikot</th>
        <th style="width: 60px; text-align: center;">Land</th>
        <th>Fahrer</th>
        <th>Team</th>
        ${isLeadout ? '<th>Rennen / Etappe / Jahr</th>' : ''}
        ${isLieutenant ? '<th>Fährt für</th>' : ''}
        <th style="text-align: right; width: 180px;">Wert</th>
      </tr>
    `;
  } else {
    theadEl.innerHTML = `
      <tr>
        <th style="width: 60px; text-align: center;">Platz</th>
        <th style="width: 60px; text-align: center;">Trikot</th>
        <th>Team</th>
        ${isLeadout ? '<th>Rennen / Etappe / Jahr</th>' : ''}
        <th style="text-align: right; width: 180px;">Wert</th>
      </tr>
    `;
  }

  // Render rows
  let html = '';
  let rank = 1;
  for (const row of filteredData) {
    const displayRank = rank++;
    const rankBadgeClass = displayRank === 1 ? 'badge-primary' : displayRank <= 3 ? 'badge-secondary' : 'badge-ghost';
    const rankHtml = `<span class="badge ${rankBadgeClass}" style="min-width: 28px; text-align: center; display: inline-block;">${displayRank}</span>`;
    const jerseyHtml = renderMiniJersey(row.teamId, row.teamName);

    let leadoutCell = '';
    if (isLeadout) {
      const stageLabel = row.stageNumber != null ? `Etappe ${row.stageNumber}` : '–';
      leadoutCell = `<td style="vertical-align: middle;">${esc(row.raceName ?? '–')} · ${esc(stageLabel)} · ${esc(String(row.season ?? '–'))}</td>`;
    }

    let lieutenantCell = '';
    if (isLieutenant) {
      if (row.lieutenantDetails) {
        const det = row.lieutenantDetails;
        const leaderFlag = det.leaderNationality ? renderFlag(det.leaderNationality) : '';
        const roleLabel = det.leaderRoleName ? ` (${det.leaderRoleName})` : '';
        lieutenantCell = `
          <td style="vertical-align: middle;">
            <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
              ${leaderFlag}
              <a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${det.leaderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">
                ${esc(det.leaderFirstName)} ${esc(det.leaderLastName)}
              </a>
              <span class="text-muted" style="font-size: 0.85em;">${esc(roleLabel)}</span>
            </span>
          </td>
        `;
      } else {
        lieutenantCell = `<td style="vertical-align: middle;">–</td>`;
      }
    }

    if (activeScope === 'riders') {
      const flagHtml = row.nationality ? renderFlag(row.nationality) : '—';
      const riderName = `<a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${row.riderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${esc(row.firstName)} ${esc(row.lastName)}</a>`;
      const teamHtml = row.teamAbbr ? `<span class="text-muted" title="${esc(row.teamName ?? '')}">${esc(row.teamAbbr)}</span>` : '—';

      html += `
        <tr>
          <td style="text-align: center; vertical-align: middle;">${rankHtml}</td>
          <td style="text-align: center; vertical-align: middle;">${jerseyHtml}</td>
          <td style="text-align: center; vertical-align: middle;">${flagHtml}</td>
          <td style="vertical-align: middle;">${riderName}</td>
          <td style="vertical-align: middle;">${teamHtml}</td>
          ${leadoutCell}
          ${lieutenantCell}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${esc(String(row.value))}</td>
        </tr>
      `;
    } else {
      let teamNameHtml = '';
      if (row.leadoutDetails) {
        const det = row.leadoutDetails;
        const sprinterFlag = det.sprinterNationality ? renderFlag(det.sprinterNationality) : '';
        
        teamNameHtml = `
          <div style="font-weight: bold; font-size: 0.95rem; color: #fff;">${esc(row.teamName.split(' (Sprinter:')[0])}</div>
          <div style="margin-top: 0.3rem; padding-left: 0.75rem; border-left: 2px solid rgba(255, 255, 255, 0.15); display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.825rem;">
            <div style="color: #94a3b8; display: flex; align-items: center; gap: 0.35rem;">
              <span>Sprinter:</span>
              <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 600; color: #facc15;">
                ${sprinterFlag}${esc(det.sprinterLastName)}
              </span>
            </div>
            <div style="color: #94a3b8; display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.1rem;">
              <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 0.1rem;">Leadout Helfer:</span>
              ${det.contributors.map((c: any) => {
                const helperFlag = c.nationality ? renderFlag(c.nationality) : '';
                return `
                  <div style="display: flex; align-items: center; gap: 0.35rem; padding-left: 0.5rem; color: #cbd5e1;">
                    <span>•</span>
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
                      ${helperFlag}${esc(c.lastName)}
                    </span>
                    <span style="color: #34d399; font-weight: 500;">(+${c.contribution.toFixed(2)})</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      } else {
        teamNameHtml = `<strong>${esc(row.teamName ?? '')}</strong>`;
      }

      html += `
        <tr>
          <td style="text-align: center; vertical-align: middle;">${rankHtml}</td>
          <td style="text-align: center; vertical-align: middle;">${jerseyHtml}</td>
          <td style="vertical-align: middle; padding: 0.6rem 0.75rem;">${teamNameHtml}</td>
          ${leadoutCell}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${esc(String(row.value))}</td>
        </tr>
      `;
    }
  }

  tbodyEl.innerHTML = html;
}
