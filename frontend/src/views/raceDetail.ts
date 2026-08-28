/**
 * RENNDETAILS (Race Detail) — Broadcast-Modal mit Tab-Leiste.
 * Wird per Klick auf einen Rennnamen geoeffnet (Dashboard-Renn-Radar & Kalender).
 *
 * Tab 1 "Renndetails" (Phase 1): linke Etappenliste + grosses Profil (aus Live-Race,
 * skaliert) mit Prev/Next + Etappen-Dropdown, darunter Details (Wertungen, Hoehenmeter, Laenge).
 * Tabs 2-5: Siegerliste (Podium je Saison), Bestenlisten (Rekordsieger je Wertung),
 * Analyse (Startlisten-Qualitaet, Profil-, Nationen- und Teambilanz) und Rekordteilnahme.
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
import type { Race, Stage, ParsedStageSummary, RacePalmaresPayload, PalmaresRiderRef, PalmaresWinRow, RaceRecordsPayload } from '../../../shared/types';

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
  etappensiegeSeite = 0;
  gesamtsiegeAusgeklappt = false;
  state.selectedRaceDetailStageId = sortedStages(race)[0]?.id ?? null;
  renderRaceDetailHeader(race);
  $('race-detail-body').innerHTML = renderRaceDetailBody();
  showModal('raceDetail');
  await ensureSelectedStageSummary(raceId);
}

/**
 * Oeffnet die Rennkarte aus einem Renn-Link heraus.
 *
 * Die ID einer vergangenen Austragung steht nicht mehr im geladenen Kalender —
 * Renn-IDs werden je Saison neu vergeben. Der Name findet dann die aktuelle
 * Austragung; Siegerliste, Bestenlisten und Analyse aggregieren ohnehin ueber
 * alle Jahre, es geht also nichts verloren.
 */
export async function openRaceDetailByRef(raceId: number | null, raceName: string | null): Promise<void> {
  const gefunden = (raceId != null ? findRaceById(raceId) : null)
    ?? (raceName ? state.races.find((r) => r.name === raceName) ?? null : null);
  if (!gefunden) return;
  await openRaceDetail(gefunden.id);
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
    ${tab('bestenlisten', 'Bestenlisten', true)}
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
  if (state.raceDetailTab === 'bestenlisten') return renderBestenlistenTab(palmares);
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
// Klickbarer Fahrername -> oeffnet den riderStats-View (globaler app-rider-link-Listener).
const RIDER_LINK_STYLE = 'background:none;border:none;padding:0;margin:0;font:inherit;cursor:pointer;text-align:left;';
function riderLinkButton(riderId: number, label: string, extraStyle = ''): string {
  return `<button type="button" class="app-rider-link rd-pal-name" data-rider-id="${riderId}" style="${RIDER_LINK_STYLE}${extraStyle}">${label}</button>`;
}

function palmaresRiderCell(ref: PalmaresRiderRef | null, medalColor?: string): string {
  if (!ref) return '<span class="rd-pal-empty">–</span>';
  return `<span class="rd-pal-rider">${renderFlag(ref.countryCode ?? '')}${riderLinkButton(ref.riderId, esc(ref.lastName), medalColor ? `color:${medalColor};` : '')}${renderMiniJersey(ref.teamId, ref.teamName)}</span>`;
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
// Tab 3: Bestenlisten (Rekordsieger je Wertung)
// ============================================================================
// Die Gesamtsieg-Liste zeigt zunaechst 5 Fahrer; der Server liefert 10.
let gesamtsiegeAusgeklappt = false;
// Etappensiege kommen bis Platz 50 und werden zu zehnt geblaettert.
const ETAPPENSIEGE_JE_SEITE = 10;
let etappensiegeSeite = 0;

/**
 * Eine Zeile einer Bestenliste. Die Siegjahre stehen unter dem Namen; die
 * rechte Spalte traegt bei den Gesamtsiegen die zweiten und dritten Plaetze
 * (nur dort erfasst das Spiel Plaetze ausser dem Sieg).
 */
function winsRow(zeile: PalmaresWinRow, rang: number, mitPlaetzen: boolean): string {
  const saisons = [...zeile.seasons].sort((a, b) => a - b);
  // Viele Jahre wuerden die Zeile sprengen — der Rest wird gezaehlt.
  const sichtbareSaisons = saisons.slice(0, 8).join(', ')
    + (saisons.length > 8 ? ` +${saisons.length - 8}` : '');
  const jahre = saisons.length > 0
    ? `<span class="rd-best-years">${esc(sichtbareSaisons)}</span>`
    : '';
  const plaetze = mitPlaetzen
    ? `<span class="rd-best-sub">${zeile.seconds}× 2. · ${zeile.thirds}× 3.</span>`
    : '<span class="rd-best-sub"></span>';
  return `<div class="rd-best-row">
    <span class="rd-best-rank">${rang}</span>
    <span class="rd-best-rider">
      <span class="rd-pal-rider">${renderFlag(zeile.rider.countryCode ?? '')}${riderLinkButton(zeile.rider.riderId, `${esc(zeile.rider.firstName)} ${esc(zeile.rider.lastName)}`)}</span>
      ${jahre}
    </span>
    ${plaetze}
    <span class="rd-best-count">${zeile.wins}×</span>
  </div>`;
}

function bestenlisteKarte(
  titel: string,
  hinweis: string,
  zeilen: PalmaresWinRow[],
  optionen: { mitPlaetzen?: boolean; ausklappbar?: boolean; blaettern?: boolean } = {},
): string {
  if (zeilen.length === 0) return '';

  let sichtbar = zeilen;
  let ersterRang = 1;
  let steuerung = '';

  if (optionen.blaettern) {
    const seiten = Math.max(1, Math.ceil(zeilen.length / ETAPPENSIEGE_JE_SEITE));
    // Die Seite kann nach einem Rennwechsel hinter dem Ende liegen.
    const seite = Math.min(etappensiegeSeite, seiten - 1);
    ersterRang = seite * ETAPPENSIEGE_JE_SEITE + 1;
    sichtbar = zeilen.slice(seite * ETAPPENSIEGE_JE_SEITE, (seite + 1) * ETAPPENSIEGE_JE_SEITE);
    if (seiten > 1) {
      steuerung = `<div class="rd-best-pager">
        <button type="button" class="rd-best-page-btn" data-race-detail-page="prev" ${seite === 0 ? 'disabled' : ''}>‹</button>
        <span class="rd-best-page-label">${ersterRang}–${ersterRang + sichtbar.length - 1} von ${zeilen.length}</span>
        <button type="button" class="rd-best-page-btn" data-race-detail-page="next" ${seite >= seiten - 1 ? 'disabled' : ''}>›</button>
      </div>`;
    }
  } else if (optionen.ausklappbar) {
    sichtbar = gesamtsiegeAusgeklappt ? zeilen : zeilen.slice(0, 5);
    if (zeilen.length > 5) {
      steuerung = `<button type="button" class="rd-best-more" data-race-detail-toggle="gesamtsiege">${gesamtsiegeAusgeklappt ? 'Weniger anzeigen' : `Top ${zeilen.length} anzeigen`}</button>`;
    }
  }

  return `<div class="rd-analysis-card">
    <div class="rd-analysis-title">${esc(titel)} <span class="rd-analysis-hint">· ${esc(hinweis)}</span></div>
    <div class="rd-best-list">${sichtbar.map((z, i) => winsRow(z, ersterRang + i, optionen.mitPlaetzen === true)).join('')}</div>
    ${steuerung}
  </div>`;
}

function renderBestenlistenTab(palmares: RacePalmaresPayload): string {
  const r = palmares.records;
  const karten = [
    bestenlisteKarte('Gesamtsiege', 'mit zweiten und dritten Plätzen', r.overallWins, { mitPlaetzen: true, ausklappbar: true }),
    bestenlisteKarte('Etappensiege', `Top ${r.stageWins.length}`, r.stageWins, { blaettern: true }),
    bestenlisteKarte('Bergtrikot', 'Top 5', r.mountainWins),
    bestenlisteKarte('Weißes Trikot', 'Top 5', r.youthWins),
    bestenlisteKarte('Punktetrikot', 'Top 5', r.pointsWins),
  ].filter(Boolean).join('');

  if (!karten) {
    return '<div class="dashboard-stage-profile-empty" style="padding:24px;">Noch keine Ergebnisse für Bestenlisten vorhanden.</div>';
  }
  const kopf = `<div class="rd-best-head">${r.editions} ${r.editions === 1 ? 'Austragung' : 'Austragungen'} ausgewertet</div>`;
  return `${kopf}<div class="rd-analysis">${karten}</div>`;
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

/**
 * Balken der Startlisten-Qualitaet je Saison. Der Wert ist der Anteil an der
 * staerkstmoeglichen Startliste derselben Saison (100 = die besten Fahrer des
 * Spiels sind alle am Start), berechnet und gespeichert beim Rennstart.
 */
function renderStartlistQuality(records: RaceRecordsPayload): string {
  const werte = records.startlistQuality.filter((q) => q.score != null);
  if (werte.length === 0) {
    return `<div class="rd-analysis-card">
      <div class="rd-analysis-title">Qualität der Startliste</div>
      <div class="rd-analysis-empty">Noch kein Wert erfasst. Er wird beim Start eines Rennens einmalig festgeschrieben.</div>
    </div>`;
  }
  const max = Math.max(...werte.map((q) => q.score ?? 0), 1);
  const balken = werte.map((q) => {
    const score = q.score ?? 0;
    // Feste Pixelhoehe statt Prozent: Wert- und Jahreslabel teilen sich die
    // Spalte mit dem Balken, eine Prozenthoehe liefe darueber hinaus.
    const hoehe = Math.max(2, Math.round((score / max) * 108));
    const farbe = score >= 75 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f97316';
    return `<div class="rd-slq-col" title="${q.season}: ${score.toLocaleString('de-DE')} von 100 · ${q.starters} Starter">
      <span class="rd-slq-value">${score.toLocaleString('de-DE')}</span>
      <span class="rd-slq-bar" style="height:${hoehe}px; background:${farbe};"></span>
      <span class="rd-slq-year">${q.season}</span>
    </div>`;
  }).join('');
  const schnitt = werte.reduce((sum, q) => sum + (q.score ?? 0), 0) / werte.length;
  return `<div class="rd-analysis-card">
    <div class="rd-analysis-title">Qualität der Startliste <span class="rd-analysis-hint">· Anteil am stärkstmöglichen Feld der Saison</span></div>
    <div class="rd-slq-chart">${balken}</div>
    <div class="rd-analysis-sub">Ø ${schnitt.toFixed(1).replace('.', ',')} · ${werte.length} ${werte.length === 1 ? 'Saison' : 'Saisons'}</div>
  </div>`;
}

function bilanzListe(zeilen: Array<{ label: string; flagge: string; wins: number; podiums: number }>): string {
  return zeilen.map((z) => `<div class="rd-listrow">
    <span class="rd-listrow-label">${z.flagge} ${esc(z.label)}</span>
    <span class="rd-listrow-count">${z.wins}× Sieg · ${z.podiums}× Podium</span>
  </div>`).join('');
}

function renderAnalysisTab(palmares: RacePalmaresPayload): string {
  const records = palmares.records;
  const winners = palmares.seasons.map((s) => s.winner).filter((w): w is PalmaresRiderRef => w != null);

  const profilKarte = records.profiles.length > 0
    ? `<div class="rd-analysis-card">
        <div class="rd-analysis-title">Profil der Etappen <span class="rd-analysis-hint">· aktuelle Austragung</span></div>
        ${renderDistributionDonut(records.profiles.map((p) => ({ key: p.profile, count: p.stages })), String(records.stageCount), records.stageCount === 1 ? 'ETAPPE' : 'ETAPPEN')}
      </div>`
    : '';

  const nationenKarte = records.nations.length > 0
    ? `<div class="rd-analysis-card">
        <div class="rd-analysis-title">Nationenbilanz <span class="rd-analysis-hint">· Podestplätze aller Austragungen</span></div>
        ${renderDistributionDonut(records.nations.map((n) => ({ key: n.countryCode ?? '—', count: n.wins })).filter((n) => n.count > 0), String(records.editions), 'SIEGE')}
        <div class="rd-analysis-sub">Nach Land</div>
        <div class="rd-list">${bilanzListe(records.nations.map((n) => ({
          label: n.countryName ?? n.countryCode ?? '—',
          flagge: n.countryCode ? renderFlag(n.countryCode) : '',
          wins: n.wins, podiums: n.podiums,
        })))}</div>
      </div>`
    : '';

  const teamKarte = records.teams.length > 0
    ? `<div class="rd-analysis-card">
        <div class="rd-analysis-title">Teambilanz <span class="rd-analysis-hint">· Team zum Zeitpunkt des Erfolgs</span></div>
        <div class="rd-list">${bilanzListe(records.teams.map((t) => ({
          label: t.teamName ?? 'Unbekannt',
          flagge: renderMiniJersey(t.teamId, t.teamName),
          wins: t.wins, podiums: t.podiums,
        })))}</div>
      </div>`
    : '';

  const siegerKarten = winners.length === 0 ? '' : (() => {
    const specCounts = countBy(winners, (w) => w.specialization1 ?? 'Unbekannt');
    const comboCounts = countBy(winners, (w) => `${w.specialization1 ?? '?'} + ${w.specialization2 ?? '?'}`);
    const comboList = comboCounts.map((c) => `<div class="rd-listrow"><span class="rd-listrow-label">${esc(c.key)}</span><span class="rd-listrow-count">${c.count}×</span></div>`).join('');
    return `<div class="rd-analysis-card">
      <div class="rd-analysis-title">Spec 1 der Sieger <span class="rd-analysis-hint">· aktuelle Spezialisierung</span></div>
      ${renderDistributionDonut(specCounts, String(winners.length), 'SIEGE')}
      <div class="rd-analysis-sub">Spec 1 + 2 Kombinationen</div>
      <div class="rd-list">${comboList}</div>
    </div>`;
  })();

  const karten = `${renderStartlistQuality(records)}${profilKarte}${siegerKarten}${nationenKarte}${teamKarte}`;
  return `<div class="rd-analysis">${karten}</div>`;
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
    <span class="rd-pal-rider">${renderFlag(p.countryCode ?? '')}${riderLinkButton(p.riderId, `${esc(p.firstName)} ${esc(p.lastName)}`)}</span>
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

    const seitenBtn = target.closest<HTMLButtonElement>('button[data-race-detail-page]');
    if (seitenBtn && !seitenBtn.disabled) {
      const richtung = seitenBtn.dataset['raceDetailPage'] === 'next' ? 1 : -1;
      etappensiegeSeite = Math.max(0, etappensiegeSeite + richtung);
      body.innerHTML = renderRaceDetailBody();
      return;
    }

    const toggle = target.closest<HTMLButtonElement>('button[data-race-detail-toggle]');
    if (toggle) {
      gesamtsiegeAusgeklappt = !gesamtsiegeAusgeklappt;
      body.innerHTML = renderRaceDetailBody();
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
