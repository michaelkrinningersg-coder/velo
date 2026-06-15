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
    if (isPhysisMetric(activeMetricKey)) {
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
    'youngest_winners',
    'mentors_ranking',
  ].includes(key);
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

  // Hide empty state, show table
  emptyEl.classList.add('hidden');
  tableEl.classList.remove('hidden');

  // Render headers
  if (activeScope === 'riders') {
    theadEl.innerHTML = `
      <tr>
        <th style="width: 60px; text-align: center;">Platz</th>
        <th style="width: 50px; text-align: center;">Trikot</th>
        <th style="width: 60px; text-align: center;">Land</th>
        <th>Fahrer</th>
        <th>Team</th>
        <th style="text-align: right; width: 180px;">Wert</th>
      </tr>
    `;
  } else {
    theadEl.innerHTML = `
      <tr>
        <th style="width: 60px; text-align: center;">Platz</th>
        <th style="width: 60px; text-align: center;">Trikot</th>
        <th>Team</th>
        <th style="text-align: right; width: 180px;">Wert</th>
      </tr>
    `;
  }

  // Render rows
  let html = '';
  for (const row of res.data) {
    const rankBadgeClass = row.rank === 1 ? 'badge-primary' : row.rank <= 3 ? 'badge-secondary' : 'badge-ghost';
    const rankHtml = `<span class="badge ${rankBadgeClass}" style="min-width: 28px; text-align: center; display: inline-block;">${row.rank}</span>`;
    const jerseyHtml = renderMiniJersey(row.teamId, row.teamName);

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
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${esc(String(row.value))}</td>
        </tr>
      `;
    } else {
      const teamName = `<strong>${esc(row.teamName ?? '')}</strong>`;
      html += `
        <tr>
          <td style="text-align: center; vertical-align: middle;">${rankHtml}</td>
          <td style="text-align: center; vertical-align: middle;">${jerseyHtml}</td>
          <td style="vertical-align: middle;">${teamName}</td>
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${esc(String(row.value))}</td>
        </tr>
      `;
    }
  }

  tbodyEl.innerHTML = html;
}
