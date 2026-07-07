import { api } from '../api';
import {
  $,
  esc,
  renderFlag,
  renderMiniJersey,
  isActiveView,
} from '../state';
import { openRiderStats } from './riderStats';
import { openTeamStats } from './teamStats';

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
  (window as any).openTeamStatsFromLeaderboard = openTeamStats;

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
    'mentors_ranking',
    'gt_stage_win_slam',
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

  // Broadcast-Grid: Kopf + Zeilen
  const isLeadout = activeMetricKey === 'highest_leadout_bonus';
  const isSpeed = activeMetricKey === 'fastest_avg_speed_stage' || activeMetricKey === 'fastest_avg_speed_oneday'
    || activeMetricKey === 'slowest_avg_speed_stage' || activeMetricKey === 'slowest_avg_speed_oneday';
  const isGtSlam = activeMetricKey === 'gt_stage_win_slam';
  // Zeigen eine Detailspalte (nur Fahrer-Scope): Rennen/Etappe/Jahr bzw. bei
  // Grand Tour Slam die Etappensiege je Grand Tour.
  const showRaceDetail = isLeadout || isSpeed || isGtSlam;
  const isLieutenant = activeMetricKey === 'strongest_lieutenants';
  const MONO = "font-family:'JetBrains Mono',monospace;";

  const cardTitle = $('leaderboard-card-title');
  const cardCount = $('leaderboard-card-count');
  if (cardTitle) cardTitle.textContent = activeScope === 'teams' ? 'Team-Rangliste' : 'Fahrer-Rangliste';
  if (cardCount) cardCount.textContent = `${filteredData.length} ${activeScope === 'teams' ? 'Teams' : 'Fahrer'}`;

  const cols = (activeScope === 'riders'
    ? ['52px', '44px', '44px', 'minmax(150px,1.4fr)', 'minmax(90px,.8fr)',
        ...(showRaceDetail ? ['minmax(160px,1fr)'] : []),
        ...(isLieutenant ? ['minmax(150px,1fr)'] : []),
        '130px']
    : ['52px', '44px', 'minmax(180px,1fr)',
        ...(isLeadout ? ['minmax(150px,1fr)'] : []),
        '130px']).join(' ');

  const raceDetailHeader = isGtSlam ? 'TDF · GIRO · VUELTA' : (isSpeed ? 'RENNEN / JAHR' : 'RENNEN / ETAPPE / JAHR');
  theadEl.style.gridTemplateColumns = cols;
  theadEl.innerHTML = activeScope === 'riders'
    ? `<span>PLATZ</span><span style="justify-self:center;">TRIKOT</span><span style="justify-self:center;">LAND</span><span>FAHRER</span><span>TEAM</span>${showRaceDetail ? `<span>${raceDetailHeader}</span>` : ''}${isLieutenant ? '<span>FÄHRT FÜR</span>' : ''}<span style="justify-self:end;">WERT</span>`
    : `<span>PLATZ</span><span style="justify-self:center;">TRIKOT</span><span>TEAM</span>${isLeadout ? '<span>RENNEN / ETAPPE / JAHR</span>' : ''}<span style="justify-self:end;">WERT</span>`;

  const rankColor = (r: number): string => r === 1 ? '#fbbf24' : r === 2 ? '#cbd5e1' : r === 3 ? '#d08b5b' : '#9fb0c9';
  const podium = (r: number): string => r === 1
    ? 'box-shadow:inset 3px 0 0 #fbbf24;background:linear-gradient(90deg,rgba(251,191,36,.08),transparent 55%);'
    : r === 2 ? 'box-shadow:inset 3px 0 0 #cbd5e1;background:linear-gradient(90deg,rgba(203,213,225,.07),transparent 55%);'
    : r === 3 ? 'box-shadow:inset 3px 0 0 #d08b5b;background:linear-gradient(90deg,rgba(208,139,91,.07),transparent 55%);'
    : '';
  const rowAlign = activeScope === 'teams' ? 'start' : 'center';

  // Render rows
  let html = '';
  let rank = 1;
  for (const row of filteredData) {
    const displayRank = rank++;
    const rankHtml = `<span style="text-align:center;${MONO}font-size:15px;font-weight:800;color:${rankColor(displayRank)};">${displayRank}</span>`;
    const jerseyHtml = `<span style="display:flex;justify-content:center;">${renderMiniJersey(row.teamId, row.teamName)}</span>`;
    const rowStyle = `display:grid;grid-template-columns:${cols};gap:9px;align-items:${rowAlign};padding:9px 16px;border-top:1px solid #14203a;${podium(displayRank)}`;
    const valueHtml = `<span style="${MONO}text-align:right;justify-self:end;font-weight:800;color:#4ade80;">${esc(String(row.value))}</span>`;

    let leadoutCell = '';
    if (isGtSlam) {
      const gt = row.gtSlamDetails;
      const parts = gt ? [`TdF ${gt.tdf}`, `Giro ${gt.giro}`, `Vuelta ${gt.vuelta}`] : ['–'];
      leadoutCell = `<span style="color:#9fb0c9;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${parts.map((p) => esc(String(p))).join(' · ')}</span>`;
    } else if (showRaceDetail) {
      // Eintagesrennen haben keine sinnvolle Etappennummer -> nur Rennen + Jahr.
      const isOnedaySpeed = activeMetricKey === 'fastest_avg_speed_oneday' || activeMetricKey === 'slowest_avg_speed_oneday';
      const parts = isSpeed && isOnedaySpeed
        ? [row.raceName ?? '–', String(row.season ?? '–')]
        : [row.raceName ?? '–', row.stageNumber != null ? `Etappe ${row.stageNumber}` : '–', String(row.season ?? '–')];
      leadoutCell = `<span style="color:#9fb0c9;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${parts.map((p) => esc(String(p))).join(' · ')}</span>`;
    }

    let lieutenantCell = '';
    if (isLieutenant) {
      if (row.lieutenantDetails) {
        const det = row.lieutenantDetails;
        const leaderFlag = det.leaderNationality ? renderFlag(det.leaderNationality) : '';
        const roleLabel = det.leaderRoleName ? ` (${det.leaderRoleName})` : '';
        lieutenantCell = `
          <span style="min-width:0;overflow:hidden;display:inline-flex; align-items: center; gap: 0.25rem;">
            ${leaderFlag}
            <a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${det.leaderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">
              ${esc(det.leaderFirstName)} ${esc(det.leaderLastName)}
            </a>
            <span class="text-muted" style="font-size: 0.85em;">${esc(roleLabel)}</span>
          </span>
        `;
      } else {
        lieutenantCell = `<span style="color:#5f6f8a;">–</span>`;
      }
    }

    if (activeScope === 'riders') {
      const flagHtml = `<span style="display:flex;justify-content:center;">${row.nationality ? renderFlag(row.nationality) : '—'}</span>`;
      const riderName = `<a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${row.riderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${esc(row.firstName)} ${esc(row.lastName)}</a>`;
      const teamHtml = (row.teamAbbr && row.teamId != null)
        ? `<a href="#" onclick="event.preventDefault(); openTeamStatsFromLeaderboard(${row.teamId})" style="color: #94a3b8; text-decoration: none; hover: text-decoration: underline;" title="${esc(row.teamName ?? '')}">${esc(row.teamAbbr)}</a>`
        : (row.teamAbbr ? `<span class="text-muted" title="${esc(row.teamName ?? '')}">${esc(row.teamAbbr)}</span>` : '—');

      html += `
        <div style="${rowStyle}">
          ${rankHtml}
          ${jerseyHtml}
          ${flagHtml}
          <span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${riderName}</span>
          <span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${teamHtml}</span>
          ${leadoutCell}
          ${lieutenantCell}
          ${valueHtml}
        </div>
      `;
    } else {
      let teamNameHtml = '';
      if (row.leadoutDetails) {
        const det = row.leadoutDetails;
        const sprinterFlag = det.sprinterNationality ? renderFlag(det.sprinterNationality) : '';

        teamNameHtml = `
          <div style="font-weight: bold; font-size: 0.95rem; color: #fff;">
            <a href="#" onclick="event.preventDefault(); openTeamStatsFromLeaderboard(${row.teamId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">
              ${esc(row.teamName.split(' (Sprinter:')[0])}
            </a>
          </div>
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
        teamNameHtml = `<strong><a href="#" onclick="event.preventDefault(); openTeamStatsFromLeaderboard(${row.teamId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${esc(row.teamName ?? '')}</a></strong>`;
      }

      html += `
        <div style="${rowStyle}">
          ${rankHtml}
          ${jerseyHtml}
          <span style="min-width:0;">${teamNameHtml}</span>
          ${leadoutCell}
          ${valueHtml}
        </div>
      `;
    }
  }

  tbodyEl.innerHTML = html;
}
