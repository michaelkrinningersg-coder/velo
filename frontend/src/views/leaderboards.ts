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

let activeScope: 'riders' | 'teams' | 'badge' = 'riders';
let activePeriod: 'season' | 'alltime' | 'live' = 'season';
let savedUserPeriod: 'season' | 'alltime' = 'season'; // to restore period when unlocking
let activeMetricKey = '';

// ---- Badge-Tab -------------------------------------------------------------
// Globale Filterung nach Hall-of-Fame-Badge: alle Fahrer mit dem Badge, sortiert
// nach Bedingung absteigend. Reuse des /api/leaderboards-Datenpfads (performant).
// Schwellenbadges: thresholds (5 Tier-Stufen, aufsteigend); ohne thresholds = Halterliste.
interface BadgeDef {
  key: string;
  category: string;
  label: string;
  icon: string;
  metricKey: string;
  thresholds?: number[];
}
const BADGE_DEFS: BadgeDef[] = [
  // Rennerfolg
  { key: 'winTracker', category: 'Rennerfolg', label: 'Win Tracker (Karrieresiege)', icon: '🏆', metricKey: 'wins', thresholds: [10, 25, 50, 75, 100] },
  // Belastung
  { key: 'raceDaySquirrel', category: 'Belastung', label: 'Renntage-Eichhörnchen', icon: '📅', metricKey: 'race_days', thresholds: [350, 450, 550, 650, 750] },
  // Action / Ausreißer
  { key: 'escapeArtist', category: 'Action', label: 'Entfesselungskünstler (Ausreißer-km)', icon: '🧗', metricKey: 'breakaway_kms', thresholds: [10000, 12500, 15000, 17500, 20000] },
  { key: 'baroudeurSupreme', category: 'Action', label: 'Baroudeur Supreme (Ausreißversuche)', icon: '💨', metricKey: 'breakaway_attempts', thresholds: [75, 100, 150, 200, 250] },
  { key: 'restlessLegs', category: 'Action', label: 'Ruhelose Beine (Attacken)', icon: '⚡', metricKey: 'attacks', thresholds: [15, 30, 45, 60, 75] },
  { key: 'notWithoutMe', category: 'Action', label: 'Nicht ohne mich (Konterattacken)', icon: '↩️', metricKey: 'counter_attacks', thresholds: [10, 20, 30, 40, 50] },
  { key: 'breakawayMaster', category: 'Action', label: 'Ausreißer-Meister (erfolgreiche Ausreißer)', icon: '🎯', metricKey: 'successful_breakaways', thresholds: [5, 10, 15, 20, 25] },
  // Wertungen
  { key: 'maillotJaune', category: 'Wertungen', label: 'Maillot Jaune (Gelbe Trikottage)', icon: '💛', metricKey: 'jersey_gc', thresholds: [50, 100, 150, 200, 300] },
  { key: 'summitFinisher', category: 'Rennerfolg', label: 'Summit Finisher (Hochgebirgs-Siege)', icon: '⛰️', metricKey: 'wins_terrain_High_Mountain', thresholds: [5, 10, 20, 30, 40] },
  // Wertungen
  { key: 'greenMachine', category: 'Wertungen', label: 'Green Machine (Grüne Trikottage)', icon: '💚', metricKey: 'jersey_points', thresholds: [25, 50, 75, 100, 150] },
  { key: 'kingOfTheMountains', category: 'Wertungen', label: 'King of the Mountains (Bergtrikottage)', icon: '⛰️', metricKey: 'jersey_mountain', thresholds: [25, 50, 75, 100, 150] },
  { key: 'youngGun', category: 'Wertungen', label: 'Young Gun (Weiße Trikottage)', icon: '🤍', metricKey: 'jersey_youth', thresholds: [25, 50, 75, 100, 125] },
  { key: 'pointsChampion', category: 'Wertungen', label: 'Points Champion (Grüne-Trikot-Titel)', icon: '🟢', metricKey: 'final_points_wins', thresholds: [2, 3, 5, 7, 11] },
  { key: 'polkaDotKing', category: 'Wertungen', label: 'Polka-Dot King (Bergtrikot-Titel)', icon: '🔴', metricKey: 'final_mountain_wins', thresholds: [2, 3, 5, 7, 11] },
  { key: 'bestYoungRider', category: 'Wertungen', label: 'Best Young Rider (Weiße-Trikot-Titel)', icon: '⭐', metricKey: 'final_youth_wins', thresholds: [1, 2, 3, 5, 8] },
  // Ereignisse
  { key: 'pechvogel', category: 'Ereignisse', label: 'Pechvogel (Defekte)', icon: '🔧', metricKey: 'defects', thresholds: [5, 10, 15, 20, 25] },
  { key: 'sturzpilot', category: 'Ereignisse', label: 'Sturzpilot (Stürze)', icon: '🩹', metricKey: 'crashes', thresholds: [5, 10, 15, 20, 25] },
  { key: 'comebackKing', category: 'Ereignisse', label: 'Comeback King (überstandene Verletzungen)', icon: '❤️‍🩹', metricKey: 'injuries', thresholds: [3, 6, 10, 15, 20] },
  { key: 'underTheWeather', category: 'Ereignisse', label: 'Under the Weather (Krankheiten)', icon: '🤒', metricKey: 'illnesses', thresholds: [3, 6, 10, 15, 20] },
  // Rekorde (Rang-Badges, ohne Schwelle → Halterliste)
  { key: 'recUciPoints', category: 'Rekorde', label: 'UCI-Punkte (All-Time)', icon: '📊', metricKey: 'uci_points' },
  { key: 'recStageScores', category: 'Rekorde', label: 'Etappen-Scores (All-Time)', icon: '📈', metricKey: 'stage_scores' },
  { key: 'recSuperteam', category: 'Rekorde', label: 'Superteam-Tage', icon: '🛡️', metricKey: 'superteam_count' },
];
const BADGE_CATEGORIES = Array.from(new Set(BADGE_DEFS.map((b) => b.category)));
let badgeMetricKey = '';
let badgeThreshold: number | null = null;
let badgeLabel = '';
let badgePage = 1;
const BADGE_PAGE_SIZE = 25;

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
        const scope = btn.getAttribute('data-scope') as 'riders' | 'teams' | 'badge';
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

  initBadgeControls();

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

function initBadgeControls(): void {
  const catSel = $('leaderboard-badge-category') as HTMLSelectElement | null;
  const badgeSel = $('leaderboard-badge-badge') as HTMLSelectElement | null;
  const thrSel = $('leaderboard-badge-threshold') as HTMLSelectElement | null;
  if (!catSel || !badgeSel || !thrSel) return;

  catSel.innerHTML = '<option value="">– Wählen –</option>'
    + BADGE_CATEGORIES.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('');

  catSel.addEventListener('change', () => {
    const defs = BADGE_DEFS.filter((b) => b.category === catSel.value);
    badgeSel.innerHTML = '<option value="">– Wählen –</option>'
      + defs.map((b) => `<option value="${b.key}">${b.icon} ${esc(b.label)}</option>`).join('');
    thrSel.innerHTML = '<option value="">– Wählen –</option>';
    badgeMetricKey = ''; badgeThreshold = null; badgeLabel = ''; badgePage = 1;
    renderLeaderboard();
  });

  badgeSel.addEventListener('change', () => {
    const def = BADGE_DEFS.find((b) => b.key === badgeSel.value);
    if (!def) { badgeMetricKey = ''; badgeThreshold = null; badgeLabel = ''; renderLeaderboard(); return; }
    badgeMetricKey = def.metricKey;
    badgeLabel = `${def.icon} ${def.label}`;
    if (def.thresholds && def.thresholds.length) {
      const tiers = ['Lila', 'Cyan', 'Bronze', 'Silber', 'Gold'];
      thrSel.innerHTML = def.thresholds.map((t, i) => `<option value="${t}">≥ ${t.toLocaleString('de-DE')} · ${tiers[i] ?? ''}</option>`).join('');
      badgeThreshold = def.thresholds[0]; // niedrigste Stufe = alle Badge-Halter
    } else {
      thrSel.innerHTML = '<option value="0">Alle Halter</option>';
      badgeThreshold = 0;
    }
    badgePage = 1;
    renderLeaderboard();
  });

  thrSel.addEventListener('change', () => {
    badgeThreshold = thrSel.value === '' ? null : Number(thrSel.value);
    badgePage = 1;
    renderLeaderboard();
  });

  const pager = $('leaderboard-pagination');
  if (pager) {
    pager.addEventListener('click', (event) => {
      const btn = (event.target as Element).closest<HTMLButtonElement>('button[data-badge-page]');
      if (!btn || btn.disabled) return;
      badgePage += btn.dataset['badgePage'] === 'next' ? 1 : -1;
      if (badgePage < 1) badgePage = 1;
      renderLeaderboard();
    });
  }
}

function setScope(scope: 'riders' | 'teams' | 'badge'): void {
  activeScope = scope;

  // Panels je Scope umschalten
  const physisGroup = $('leaderboard-group-physis');
  if (physisGroup) physisGroup.style.display = scope === 'riders' ? 'block' : 'none';
  const metricToolbar = $('leaderboard-metric-toolbar');
  if (metricToolbar) metricToolbar.style.display = scope === 'badge' ? 'none' : 'flex';
  const badgePanel = $('leaderboard-badge-panel');
  if (badgePanel) badgePanel.style.display = scope === 'badge' ? 'flex' : 'none';
  const periodTabs = $('leaderboards-period-tabs');
  if (periodTabs) periodTabs.style.display = scope === 'badge' ? 'none' : 'flex';

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

  const isBadge = activeScope === 'badge';
  const fetchScope: 'riders' | 'teams' = activeScope === 'badge' ? 'riders' : activeScope;
  const metricKey = isBadge ? badgeMetricKey : activeMetricKey;
  const period: 'season' | 'alltime' | 'live' = isBadge ? 'alltime' : activePeriod;

  const filterContainer = $('leaderboard-filter-container');
  if (filterContainer) {
    filterContainer.style.display = (fetchScope === 'teams' || isBadge) ? 'none' : 'flex';
  }

  if (!metricKey) {
    emptyEl.textContent = isBadge
      ? 'Wähle Kategorie, Badge und Schwelle aus, um alle Fahrer mit diesem Badge zu sehen.'
      : 'Wähle eine Statistik aus den Dropdowns oben aus, um die Rangliste zu laden.';
    emptyEl.classList.remove('hidden');
    tableEl.classList.add('hidden');
    return;
  }

  // Show loading state
  emptyEl.textContent = 'Lade Daten...';
  emptyEl.classList.remove('hidden');
  tableEl.classList.add('hidden');

  const res = isBadge
    ? await api.getBadgeLeaderboard(metricKey)
    : await api.getLeaderboards(fetchScope, metricKey, period);

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
  if (isBadge) {
    const thr = badgeThreshold ?? 0;
    filteredData = res.data.filter((row: any) => Number(row.value) >= thr);
    if (filteredData.length === 0) {
      emptyEl.textContent = 'Kein Fahrer erfüllt diese Badge-Bedingung.';
      emptyEl.classList.remove('hidden');
      tableEl.classList.add('hidden');
      return;
    }
  } else if (activeScope === 'riders') {
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
  if (cardTitle) cardTitle.textContent = isBadge ? badgeLabel : (activeScope === 'teams' ? 'Team-Rangliste' : 'Fahrer-Rangliste');
  if (cardCount) cardCount.textContent = `${filteredData.length} ${fetchScope === 'teams' ? 'Teams' : 'Fahrer'}`;

  const cols = (fetchScope === 'riders'
    ? ['52px', '44px', '44px', 'minmax(150px,1.4fr)', 'minmax(90px,.8fr)',
        ...(showRaceDetail ? ['minmax(160px,1fr)'] : []),
        ...(isLieutenant ? ['minmax(150px,1fr)'] : []),
        '130px']
    : ['52px', '44px', 'minmax(180px,1fr)',
        ...(isLeadout ? ['minmax(150px,1fr)'] : []),
        '130px']).join(' ');

  const raceDetailHeader = isGtSlam ? 'TDF · GIRO · VUELTA' : (isSpeed ? 'RENNEN / JAHR' : 'RENNEN / ETAPPE / JAHR');
  theadEl.style.gridTemplateColumns = cols;
  theadEl.innerHTML = fetchScope === 'riders'
    ? `<span>PLATZ</span><span style="justify-self:center;">TRIKOT</span><span style="justify-self:center;">LAND</span><span>FAHRER</span><span>TEAM</span>${showRaceDetail ? `<span>${raceDetailHeader}</span>` : ''}${isLieutenant ? '<span>FÄHRT FÜR</span>' : ''}<span style="justify-self:end;">WERT</span>`
    : `<span>PLATZ</span><span style="justify-self:center;">TRIKOT</span><span>TEAM</span>${isLeadout ? '<span>RENNEN / ETAPPE / JAHR</span>' : ''}<span style="justify-self:end;">WERT</span>`;

  const rankColor = (r: number): string => r === 1 ? '#fbbf24' : r === 2 ? '#cbd5e1' : r === 3 ? '#d08b5b' : '#9fb0c9';
  const podium = (r: number): string => r === 1
    ? 'box-shadow:inset 3px 0 0 #fbbf24;background:linear-gradient(90deg,rgba(251,191,36,.08),transparent 55%);'
    : r === 2 ? 'box-shadow:inset 3px 0 0 #cbd5e1;background:linear-gradient(90deg,rgba(203,213,225,.07),transparent 55%);'
    : r === 3 ? 'box-shadow:inset 3px 0 0 #d08b5b;background:linear-gradient(90deg,rgba(208,139,91,.07),transparent 55%);'
    : '';
  const rowAlign = fetchScope === 'teams' ? 'start' : 'center';

  // Badge-Modus: Paginierung (alle Halter, 25/Seite).
  const pager = $('leaderboard-pagination');
  let displayRows = filteredData;
  let rankOffset = 0;
  if (isBadge) {
    const total = filteredData.length;
    const totalPages = Math.max(1, Math.ceil(total / BADGE_PAGE_SIZE));
    if (badgePage > totalPages) badgePage = totalPages;
    rankOffset = (badgePage - 1) * BADGE_PAGE_SIZE;
    displayRows = filteredData.slice(rankOffset, rankOffset + BADGE_PAGE_SIZE);
    if (pager) {
      pager.style.display = 'block';
      const btnBase = "background:#0a1122;border:1px solid #1c2b47;color:#e2e8f0;width:30px;height:28px;border-radius:7px;cursor:pointer;";
      pager.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;gap:14px;padding:12px;border-top:1px solid #14203a;font-family:'JetBrains Mono',monospace;font-size:12px;color:#9fb0c9;">
        <button type="button" data-badge-page="prev" ${badgePage <= 1 ? 'disabled' : ''} style="${btnBase}${badgePage <= 1 ? 'opacity:.4;cursor:not-allowed;' : ''}">‹</button>
        <span>Seite ${badgePage} / ${totalPages} · ${total.toLocaleString('de-DE')} Fahrer</span>
        <button type="button" data-badge-page="next" ${badgePage >= totalPages ? 'disabled' : ''} style="${btnBase}${badgePage >= totalPages ? 'opacity:.4;cursor:not-allowed;' : ''}">›</button>
      </div>`;
    }
  } else if (pager) {
    pager.style.display = 'none';
    pager.innerHTML = '';
  }

  // Render rows
  let html = '';
  let rank = rankOffset + 1;
  for (const row of displayRows) {
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

    if (fetchScope === 'riders') {
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
