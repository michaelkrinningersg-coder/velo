/**
 * RENNDETAILS (Race Detail) — Broadcast-Modal mit Tab-Leiste.
 * Wird per Klick auf einen Rennnamen geoeffnet (Dashboard-Renn-Radar & Kalender).
 *
 * Tab 1 "Renndetails" (Phase 1): linke Etappenliste + grosses Profil (aus Live-Race,
 * skaliert) mit Prev/Next + Etappen-Dropdown, darunter Details (Wertungen, Hoehenmeter, Laenge).
 * Tabs 2–4 (Siegerliste / Analyse / Rekordteilnahme) folgen in Phase 2 (hier deaktiviert).
 */
import { state, $, esc, showModal, findRaceById, formatDate, formatKm, formatElevationGain, renderFlag, renderMiniJersey } from '../state';
import { api } from '../api';
import {
  raceCategoryNameBadge,
  getStageDisplayName,
  renderStageProfileBadge,
  buildDashboardStageProfileLabel,
  formatRaceDateRange,
  ensureStageSummaryLoaded,
} from './dashboard';
import { renderStaticStageProfileMarkup, extractStageFeatures } from '../race-sim/renderProfile';
import type { Race, Stage, ParsedStageSummary, RacePalmaresPayload, PalmaresRiderRef } from '../../../shared/types';

// Palmarès-Cache je Rennen (lazy geladen beim ersten Tab-Wechsel).
const palmaresCache = new Map<number, RacePalmaresPayload>();
const palmaresInFlight = new Set<number>();

const CAT_COLOR: Record<string, string> = { HC: '#ef4444', '1': '#f97316', '2': '#fbbf24', '3': '#a3e635', '4': '#4ade80' };
const SPRINT_COLOR = '#4ade80';

function sortedStages(race: Race): Stage[] {
  return [...(race.stages ?? [])].sort((a, b) => a.date.localeCompare(b.date) || a.stageNumber - b.stageNumber);
}

function currentRace(): Race | null {
  return findRaceById(state.selectedRaceDetailRaceId);
}

function currentStage(race: Race): Stage | null {
  const stages = sortedStages(race);
  return stages.find((s) => s.id === state.selectedRaceDetailStageId) ?? stages[0] ?? null;
}

// --- Public entry -----------------------------------------------------------
export async function openRaceDetail(raceId: number): Promise<void> {
  const race = findRaceById(raceId);
  if (!race) return;
  state.selectedRaceDetailRaceId = raceId;
  state.raceDetailTab = 'detail';
  state.selectedRaceDetailStageId = sortedStages(race)[0]?.id ?? null;
  renderRaceDetailHeader(race);
  $('race-detail-body').innerHTML = renderRaceDetailBody();
  showModal('raceDetail');
  await ensureSelectedStageSummary(raceId);
}

function raceDetailOpenFor(raceId: number): boolean {
  return state.selectedRaceDetailRaceId === raceId && !$('modal-raceDetail').classList.contains('hidden');
}

// Laedt das Profil der aktuell gewaehlten Etappe (gecacht) und rendert danach neu.
async function ensureSelectedStageSummary(raceId: number): Promise<void> {
  const stageId = state.selectedRaceDetailStageId;
  if (stageId == null) return;
  if (!state.stageSummariesByStageId[stageId] && !state.stageSummaryErrorsByStageId[stageId]) {
    await ensureStageSummaryLoaded(stageId);
  }
  if (raceDetailOpenFor(raceId)) {
    $('race-detail-body').innerHTML = renderRaceDetailBody();
  }
}

// --- Header (Modal-Kopf: Kategorie-Badge + Name + Meta) ----------------------
function renderRaceDetailHeader(race: Race): void {
  const stages = sortedStages(race);
  const totalKm = stages.reduce((s, st) => s + (st.distanceKm ?? 0), 0);
  const totalHm = stages.reduce((s, st) => s + (st.elevationGainMeters ?? 0), 0);
  const meta = [
    formatRaceDateRange(race),
    race.country?.name ?? '',
    race.isStageRace ? `${race.numberOfStages} Etappen` : 'Eintagesrennen',
    totalKm ? formatKm(totalKm) : '',
    totalHm ? formatElevationGain(totalHm) : '',
  ].filter(Boolean).join(' · ');
  $('race-detail-header').innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
      ${race.category?.name ? raceCategoryNameBadge(race) : ''}
      <h2 style="margin:0;">${esc(race.name)}</h2>
    </div>
    <p class="text-muted" style="margin:4px 0 0; font-family:'JetBrains Mono',monospace; font-size:12px;">${esc(meta)}</p>`;
}

// --- Body: Tab-Leiste + Inhalt ----------------------------------------------
function renderRaceDetailBody(): string {
  const race = currentRace();
  if (!race) return '<div class="dashboard-stage-profile-empty">Rennen nicht gefunden.</div>';
  return `${renderTabs()}${renderTabContent(race)}`;
}

function renderTabs(): string {
  const tab = (key: string, label: string, enabled: boolean): string => {
    const active = state.raceDetailTab === key ? ' team-detail-page-tab-active' : '';
    const dis = enabled ? '' : ' disabled title="folgt in Kürze"';
    return `<button type="button" class="team-detail-page-tab${active}" data-race-detail-tab="${key}"${dis}>${label}</button>`;
  };
  return `<div class="team-detail-page-tabs race-detail-tabs" role="tablist" aria-label="Renndetails Tabs">
    ${tab('detail', 'Renndetails', true)}
    ${tab('palmares', 'Siegerliste', true)}
    ${tab('analysis', 'Analyse', true)}
    ${tab('record', 'Rekordteilnahme', true)}
  </div>`;
}

function renderTabContent(race: Race): string {
  if (state.raceDetailTab === 'detail') return renderDetailTab(race);
  // Datengetriebene Tabs: Palmarès lazy laden.
  const palmares = palmaresCache.get(race.id);
  if (!palmares) {
    return '<div class="race-detail-profile-loading" style="height:180px;">DATEN WERDEN GELADEN…</div>';
  }
  if (state.raceDetailTab === 'palmares') return renderPalmaresTab(race, palmares);
  if (state.raceDetailTab === 'analysis') return renderAnalysisTab(palmares);
  if (state.raceDetailTab === 'record') return renderRecordTab(palmares);
  return '';
}

// --- Palmarès lazy-load ------------------------------------------------------
async function ensurePalmaresLoaded(raceId: number): Promise<void> {
  if (palmaresCache.has(raceId) || palmaresInFlight.has(raceId)) return;
  palmaresInFlight.add(raceId);
  try {
    const res = await api.getRacePalmares(raceId);
    if (res.success && res.data) palmaresCache.set(raceId, res.data);
  } finally {
    palmaresInFlight.delete(raceId);
  }
  if (raceDetailOpenFor(raceId) && state.raceDetailTab !== 'detail') {
    $('race-detail-body').innerHTML = renderRaceDetailBody();
  }
}

// --- Tab 1: Renndetails ------------------------------------------------------
function renderDetailTab(race: Race): string {
  const stages = sortedStages(race);
  if (stages.length === 0) return '<div class="dashboard-stage-profile-empty" style="padding:24px;">Keine Etappendaten vorhanden.</div>';
  const stage = currentStage(race)!;

  // Linke Spalte: Etappenliste (nach Datum aufsteigend)
  const stageList = stages.map((st) => {
    const active = st.id === stage.id ? ' race-detail-stage-row-active' : '';
    const label = race.isStageRace ? getStageDisplayName(st) : 'Eintagesrennen';
    // Zweizeilig: 1. Zeile Datum + "Etappe x", 2. Zeile Profil-Badge — damit
    // bei schmaler Spalte nichts abgeschnitten wird.
    return `<button type="button" class="race-detail-stage-row${active}" data-race-detail-stage-id="${st.id}">
      <span class="rd-stage-line1">
        <span class="rd-stage-date">${esc(formatDate(st.date))}</span>
        <span class="rd-stage-name">${esc(label)}</span>
      </span>
      <span class="rd-stage-line2">${renderStageProfileBadge(st.profile)}</span>
    </button>`;
  }).join('');

  // Rechte Spalte: Switcher + Profil + Details
  const idx = stages.findIndex((s) => s.id === stage.id);
  const stageOptions = stages.map((st) => {
    const label = race.isStageRace ? getStageDisplayName(st) : 'Eintagesrennen';
    return `<option value="${st.id}" ${st.id === stage.id ? 'selected' : ''}>${esc(label)} · ${esc(formatDate(st.date))}</option>`;
  }).join('');
  const navDisabledPrev = idx <= 0 ? 'disabled' : '';
  const navDisabledNext = idx >= stages.length - 1 ? 'disabled' : '';

  const summary = state.stageSummariesByStageId[stage.id];
  let profileBlock: string;
  let detailsBlock: string;
  if (summary) {
    profileBlock = renderStaticStageProfileMarkup(summary, stage.profile, buildDashboardStageProfileLabel(race, stage));
    detailsBlock = renderStageDetails(summary);
  } else if (state.stageSummaryErrorsByStageId[stage.id]) {
    profileBlock = '<div class="dashboard-stage-profile-empty" style="padding:24px;">Profil nicht verfügbar.</div>';
    detailsBlock = '';
  } else {
    profileBlock = '<div class="race-detail-profile-loading">HÖHENPROFIL WIRD GELADEN…</div>';
    detailsBlock = '';
  }

  return `<div class="race-detail-layout">
    <div class="race-detail-stage-col">${stageList}</div>
    <div class="race-detail-main-col">
      <div class="results-race-nav race-detail-nav">
        <button type="button" class="results-race-nav-btn" data-race-detail-stage-nav="prev" ${navDisabledPrev}>‹</button>
        <select id="race-detail-stage-select">${stageOptions}</select>
        <button type="button" class="results-race-nav-btn" data-race-detail-stage-nav="next" ${navDisabledNext}>›</button>
      </div>
      <div class="race-detail-profile">${profileBlock}</div>
      ${detailsBlock}
    </div>
  </div>`;
}

function renderStageDetails(summary: ParsedStageSummary): string {
  const features = extractStageFeatures(summary);
  const statChip = (label: string, value: string, color = '#e2e8f0') =>
    `<div class="race-detail-stat"><span class="rd-stat-label">${label}</span><span class="rd-stat-value" style="color:${color};">${value}</span></div>`;

  const climbRows = features.climbs.map((c) => {
    const col = CAT_COLOR[c.category ?? ''] ?? '#94a3b8';
    const cat = c.category && c.category !== 'Sprint' ? `Kat. ${c.category}` : 'Anstieg';
    return `<div class="race-detail-climb-row">
      <span class="rd-climb-dot" style="background:${col};"></span>
      <span class="rd-climb-name">${c.finish ? '🏁 ' : ''}${esc(c.name)}</span>
      <span class="rd-climb-meta">${esc(cat)} · ${Math.round(c.topElevation)} m · ${c.lengthKm.toFixed(1).replace('.', ',')} km · ${c.avgGradient.toFixed(1).replace('.', ',')}%</span>
    </div>`;
  }).join('');

  const sprintRows = features.sprints.map((s) =>
    `<div class="race-detail-climb-row">
      <span class="rd-climb-dot" style="background:transparent; border:1.6px solid ${SPRINT_COLOR};"></span>
      <span class="rd-climb-name">${esc(s.name)}</span>
      <span class="rd-climb-meta">Zwischensprint · km ${Math.round(s.km)} · ${Math.round(s.elevation)} m</span>
    </div>`).join('');

  const climbsSection = features.climbs.length
    ? `<div class="race-detail-detail-group"><div class="rd-group-title" style="color:#fecaca;">Bergwertungen</div>${climbRows}</div>` : '';
  const sprintsSection = features.sprints.length
    ? `<div class="race-detail-detail-group"><div class="rd-group-title" style="color:#bbf7d0;">Zwischensprints</div>${sprintRows}</div>` : '';

  return `<div class="race-detail-details">
    <div class="race-detail-stats-row">
      ${statChip('LÄNGE', formatKm(summary.distanceKm))}
      ${statChip('HÖHENMETER', formatElevationGain(summary.elevationGainMeters), '#fbbf24')}
      ${statChip('BERGWERTUNGEN', String(features.climbs.length), '#ef4444')}
      ${statChip('ZWISCHENSPRINTS', String(features.sprints.length), SPRINT_COLOR)}
    </div>
    ${climbsSection}${sprintsSection}
  </div>`;
}

// ============================================================================
// Tab 2: Siegerliste (Palmarès)
// ============================================================================
function palmaresRiderCell(ref: PalmaresRiderRef | null, medalColor?: string): string {
  if (!ref) return '<span class="rd-pal-empty">–</span>';
  return `<span class="rd-pal-rider">${renderFlag(ref.countryCode ?? '')}<span class="rd-pal-name"${medalColor ? ` style="color:${medalColor};"` : ''}>${esc(ref.lastName)}</span>${renderMiniJersey(ref.teamId, ref.teamName)}</span>`;
}

function renderPalmaresTab(race: Race, palmares: RacePalmaresPayload): string {
  if (palmares.seasons.length === 0) {
    return '<div class="dashboard-stage-profile-empty" style="padding:24px;">Noch keine Renn-Historie vorhanden.</div>';
  }
  const stageRace = palmares.isStageRace;
  const cols = stageRace ? '72px 1.4fr 1fr 1fr 1.1fr 1.1fr 1.1fr' : '72px 1.6fr 1.2fr 1.2fr';
  const headerCells = stageRace
    ? ['<div class="rd-pal-th">JAHR</div>', '<div class="rd-pal-th">SIEGER</div>', '<div class="rd-pal-th">2. PLATZ</div>', '<div class="rd-pal-th">3. PLATZ</div>',
       '<div class="rd-pal-th"><span class="rider-stats-final-type is-points">Punkte</span></div>',
       '<div class="rd-pal-th"><span class="rider-stats-final-type is-mountain">Berg</span></div>',
       '<div class="rd-pal-th"><span class="rider-stats-final-type is-youth">Nachwuchs</span></div>']
    : ['<div class="rd-pal-th">JAHR</div>', '<div class="rd-pal-th">SIEGER</div>', '<div class="rd-pal-th">2. PLATZ</div>', '<div class="rd-pal-th">3. PLATZ</div>'];
  const header = `<div class="rd-pal-row rd-pal-header" style="grid-template-columns:${cols};">${headerCells.join('')}</div>`;
  const rows = palmares.seasons.map((s) => {
    const base = `<div class="rd-pal-year">${s.season}</div>${palmaresRiderCell(s.winner, '#fbbf24')}${palmaresRiderCell(s.second, '#cbd5e1')}${palmaresRiderCell(s.third, '#cd7c3b')}`;
    const extra = stageRace ? `${palmaresRiderCell(s.pointsChampion)}${palmaresRiderCell(s.mountainChampion)}${palmaresRiderCell(s.youthChampion)}` : '';
    return `<div class="rd-pal-row" style="grid-template-columns:${cols};">${base}${extra}</div>`;
  }).join('');
  return `<div class="rd-pal-table">${header}${rows}</div>`;
}

// ============================================================================
// Tab 3: Analyse (Spec 1 + Nationalität der Sieger)
// ============================================================================
const DONUT_PALETTE = ['#22d3ee', '#fbbf24', '#a855f7', '#4ade80', '#f97316', '#ef4444', '#60a5fa', '#f472b6', '#a3e635', '#2dd4bf', '#c084fc', '#fb7185'];

function countBy<T>(items: T[], keyFn: (t: T) => string): Array<{ key: string; count: number }> {
  const map = new Map<string, number>();
  for (const it of items) { const k = keyFn(it); map.set(k, (map.get(k) ?? 0) + 1); }
  return [...map.entries()].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count || a.key.localeCompare(b.key, 'de'));
}

function renderDistributionDonut(items: Array<{ key: string; count: number }>, centerTop: string, centerBottom: string): string {
  const total = items.reduce((s, i) => s + i.count, 0) || 1;
  let acc = 0;
  const stops: string[] = [];
  const legend: string[] = [];
  items.forEach((it, i) => {
    const color = DONUT_PALETTE[i % DONUT_PALETTE.length];
    const start = acc / total; acc += it.count; const end = acc / total;
    stops.push(`${color} ${start}turn ${end}turn`);
    legend.push(`<div class="rd-legend-row"><span class="rd-legend-dot" style="background:${color};"></span><span class="rd-legend-label">${esc(it.key)}</span><span class="rd-legend-count">${it.count}× · ${Math.round((it.count / total) * 100)}%</span></div>`);
  });
  const grad = `conic-gradient(${stops.join(', ')})`;
  return `<div class="rd-donut-wrap">
    <div class="rd-donut" style="background:${grad};"><div class="rd-donut-hole"><span class="rd-donut-top">${esc(centerTop)}</span><span class="rd-donut-bottom">${esc(centerBottom)}</span></div></div>
    <div class="rd-legend">${legend.join('')}</div>
  </div>`;
}

function renderAnalysisTab(palmares: RacePalmaresPayload): string {
  const winners = palmares.seasons.map((s) => s.winner).filter((w): w is PalmaresRiderRef => w != null);
  if (winners.length === 0) {
    return '<div class="dashboard-stage-profile-empty" style="padding:24px;">Noch keine Sieger für eine Analyse vorhanden.</div>';
  }
  const specCounts = countBy(winners, (w) => w.specialization1 ?? 'Unbekannt');
  const comboCounts = countBy(winners, (w) => `${w.specialization1 ?? '?'} + ${w.specialization2 ?? '?'}`);
  const natCounts = countBy(winners, (w) => w.countryCode ?? '—');

  const comboList = comboCounts.map((c) => `<div class="rd-listrow"><span class="rd-listrow-label">${esc(c.key)}</span><span class="rd-listrow-count">${c.count}×</span></div>`).join('');
  const natFlags = (code: string) => code === '—' ? '' : renderFlag(code);
  const natList = natCounts.map((c) => `<div class="rd-listrow"><span class="rd-listrow-label">${natFlags(c.key)} ${esc(c.key)}</span><span class="rd-listrow-count">${c.count}×</span></div>`).join('');

  return `<div class="rd-analysis">
    <div class="rd-analysis-card">
      <div class="rd-analysis-title">Spec 1 der Sieger <span class="rd-analysis-hint">· aktuelle Spezialisierung</span></div>
      ${renderDistributionDonut(specCounts, String(winners.length), 'SIEGE')}
      <div class="rd-analysis-sub">Spec 1 + 2 Kombinationen</div>
      <div class="rd-list">${comboList}</div>
    </div>
    <div class="rd-analysis-card">
      <div class="rd-analysis-title">Nationalität der Sieger</div>
      ${renderDistributionDonut(natCounts, String(winners.length), 'SIEGE')}
      <div class="rd-analysis-sub">Nach Land</div>
      <div class="rd-list">${natList}</div>
    </div>
  </div>`;
}

// ============================================================================
// Tab 4: Rekordteilnahme
// ============================================================================
function renderRecordTab(palmares: RacePalmaresPayload): string {
  if (palmares.participation.length === 0) {
    return '<div class="dashboard-stage-profile-empty" style="padding:24px;">Kein Fahrer mit mindestens 3 Teilnahmen (mit erzielten UCI-Punkten).</div>';
  }
  const rows = palmares.participation.map((p, i) => `<div class="rd-record-row">
    <span class="rd-record-rank">${i + 1}</span>
    <span class="rd-pal-rider">${renderFlag(p.countryCode ?? '')}<span class="rd-pal-name">${esc(p.firstName)} ${esc(p.lastName)}</span></span>
    <span class="rd-record-seasons">${p.seasons}× Teilnahme</span>
    <span class="rd-record-points">${p.totalPoints.toLocaleString('de-DE')} Pkt</span>
  </div>`).join('');
  return `<div class="rd-record">
    <div class="rd-record-head">Teilnahme mit erzielten UCI-Punkten <span class="rd-record-sub">· ab 3 Saisons</span></div>
    ${rows}
  </div>`;
}

// --- Listener (einmalig in app.ts registriert) ------------------------------
export function initRaceDetailListeners(): void {
  const body = $('race-detail-body');

  body.addEventListener('click', (event) => {
    const target = event.target as Element;
    const raceId = state.selectedRaceDetailRaceId;
    if (raceId == null) return;

    const tabBtn = target.closest<HTMLButtonElement>('button[data-race-detail-tab]');
    if (tabBtn && !tabBtn.disabled) {
      state.raceDetailTab = tabBtn.dataset['raceDetailTab'] as typeof state.raceDetailTab;
      body.innerHTML = renderRaceDetailBody();
      if (state.raceDetailTab !== 'detail') void ensurePalmaresLoaded(raceId);
      return;
    }

    const stageRow = target.closest<HTMLButtonElement>('button[data-race-detail-stage-id]');
    if (stageRow) {
      selectStage(Number(stageRow.dataset['raceDetailStageId']), raceId);
      return;
    }

    const navBtn = target.closest<HTMLButtonElement>('button[data-race-detail-stage-nav]');
    if (navBtn && !navBtn.disabled) {
      navigateStage(navBtn.dataset['raceDetailStageNav'] === 'next' ? 1 : -1, raceId);
      return;
    }
  });

  body.addEventListener('change', (event) => {
    const target = event.target as HTMLElement;
    const raceId = state.selectedRaceDetailRaceId;
    if (raceId == null) return;
    if (target.id === 'race-detail-stage-select') {
      selectStage(Number((target as HTMLSelectElement).value), raceId);
    }
  });
}

function selectStage(stageId: number, raceId: number): void {
  if (!Number.isFinite(stageId)) return;
  state.selectedRaceDetailStageId = stageId;
  $('race-detail-body').innerHTML = renderRaceDetailBody();
  void ensureSelectedStageSummary(raceId);
}

function navigateStage(direction: -1 | 1, raceId: number): void {
  const race = currentRace();
  if (!race) return;
  const stages = sortedStages(race);
  const idx = stages.findIndex((s) => s.id === state.selectedRaceDetailStageId);
  const next = stages[idx + direction];
  if (next) selectStage(next.id, raceId);
}
