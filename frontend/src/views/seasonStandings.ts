import { api } from '../api';
import { setReigningChampionMarkers } from '../riderStatsUi';
import {
  $,
  esc,
  state,
  formatDate,
  renderFlag,
  renderMiniJersey,
  renderResultsJerseyColumn,
  renderResultsFlagColumn,
  resolveRiderCountryCode,
  findRiderById,
  findRaceById,
  findStageById,
  renderResultsParticipant,
  isActiveView,
} from '../state';
import { renderRiderNameLink, renderTeamNameLink } from '../state';
import {
  formatRaceDateRange,
  raceCategoryBadge,
} from './dashboard';
import type {
  SeasonStandingsPayload,
  SeasonStandingCountryRow,
  SeasonNationalChampionGroup,
  SeasonReigningTitle,
  SeasonChampionHolder,
  ChampionTitleType,
  RaceWinnerEntry,
  PalmaresRiderRef,
} from '../../../shared/types';

export function formatPointsGap(points: number): string {
  if (points === 0) return '–';
  return `-${points}`;
}

export function renderSeasonCountryTopRiders(topRiders: SeasonStandingCountryRow['topRiders']): string {
  if (topRiders.length === 0) {
    return '<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>';
  }

  return `
    <div class="season-standings-country-popover-card">
      <div class="season-standings-country-popover-head">
        <strong>Top 20 Fahrer</strong>
      </div>
      <div class="season-standings-country-popover-grid season-standings-country-popover-grid-head">
        <span>Platz</span>
        <span>Flagge</span>
        <span>Fahrer</span>
        <span>Punkte</span>
      </div>
      ${topRiders.map((rider) => `
        <div class="season-standings-country-popover-grid">
          <strong>${rider.rank}</strong>
          <span class="results-flag-col-cell">${renderResultsFlagColumn(rider.countryCode)}</span>
          <span class="season-standings-country-rider-name">${renderRiderNameLink(rider.riderName, { riderId: rider.riderId, strong: false })}</span>
          <strong>${rider.points}</strong>
        </div>
      `).join('')}
    </div>`;
}

export function renderSeasonCountryNameCell(row: SeasonStandingCountryRow): string {
  return `
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${esc(row.countryName)}</span>
      <div class="season-standings-country-popover">
        ${renderSeasonCountryTopRiders(row.topRiders)}
      </div>
    </div>`;
}

export function renderSeasonTeamTopRiders(
  teamRow: SeasonStandingsPayload['teamStandings'][number],
  riderStandings: SeasonStandingsPayload['riderStandings'],
): string {
  const topRiders = riderStandings
    .filter((rider) => rider.teamId != null && teamRow.teamId != null && rider.teamId === teamRow.teamId)
    .slice(0, 30);

  if (topRiders.length === 0) {
    return '<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>';
  }

  return `
    <div class="season-standings-country-popover-card">
      <div class="season-standings-country-popover-head">
        <strong>Top 30 Fahrer</strong>
      </div>
      <div class="season-standings-country-popover-grid season-standings-country-popover-grid-head">
        <span>Platz</span>
        <span>Flagge</span>
        <span>Fahrer</span>
        <span>Punkte</span>
      </div>
      ${topRiders.map((rider) => `
        <div class="season-standings-country-popover-grid">
          <strong>${rider.rank}</strong>
          <span class="results-flag-col-cell">${renderResultsFlagColumn(rider.countryCode)}</span>
          <span class="season-standings-country-rider-name">${renderRiderNameLink(rider.riderName ?? '–', { riderId: rider.riderId, teamId: rider.teamId, strong: false })}</span>
          <strong>${rider.points}</strong>
        </div>
      `).join('')}
    </div>`;
}

export function renderSeasonTeamNameCell(
  row: SeasonStandingsPayload['teamStandings'][number],
  riderStandings: SeasonStandingsPayload['riderStandings'],
): string {
  return `
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${renderTeamNameLink(row.teamName, row.teamId, false)}</span>
      <div class="season-standings-country-popover">
        ${renderSeasonTeamTopRiders(row, riderStandings)}
      </div>
    </div>`;
}

export async function loadSeasonStandings(silent: boolean): Promise<void> {
  const selectedSeason = state.seasonStandingsSelectedSeason ?? undefined;
  const res = await api.getSeasonStandings(selectedSeason);
  if (!res.success) {
    state.seasonStandings = null;
    if (isActiveView('season-standings')) {
      renderSeasonStandingsView();
    }
    if (!silent && res.error) {
      alert('Saisonwertung konnte nicht geladen werden:\n' + res.error);
    }
    return;
  }

  state.seasonStandings = res.data ?? null;
  setReigningChampionMarkers(res.data?.reigningChampions);
  if (isActiveView('season-standings')) {
    renderSeasonStandingsView();
  }
}

export function renderSeasonStandingsView(): void {
  const meta = $('season-standings-meta');
  const tabs = $('season-standings-scope-tabs');
  const empty = $('season-standings-empty');
  const tableCard = $('season-standings-table-card');
  const gridHead = $('season-standings-grid-head');
  const tbody = $('season-standings-tbody');
  const cardTitle = $('season-standings-card-title');
  const cardCount = $('season-standings-card-count');

  const season = state.seasonStandings?.season ?? state.gameState?.season ?? state.currentSave?.currentSeason ?? null;
  meta.textContent = season != null
    ? `Saison ${season} · Ergebnis- und Trikotpunkte kumuliert`
    : 'Noch keine Saisonwertung geladen.';

  const yearSelect = $('season-standings-year-select') as HTMLSelectElement | null;
  if (yearSelect) {
    const seasons = state.seasonStandings?.availableSeasons || [];
    const selected = state.seasonStandingsSelectedSeason ?? state.gameState?.season ?? 2026;
    yearSelect.innerHTML = seasons.map(yr => `
      <option value="${yr}" ${yr === selected ? 'selected' : ''}>Saison ${yr}</option>
    `).join('');
  }

  const scope = state.selectedSeasonStandingScope;
  tabs.innerHTML = `
    <button
      type="button"
      class="results-type-btn${scope === 'riders' ? ' active' : ''}"
      data-season-scope="riders"
    >Fahrer</button>
    <button
      type="button"
      class="results-type-btn${scope === 'teams' ? ' active' : ''}"
      data-season-scope="teams"
    >Teams</button>
    <button
      type="button"
      class="results-type-btn${scope === 'countries' ? ' active' : ''}"
      data-season-scope="countries"
    >Country</button>
    <button
      type="button"
      class="results-type-btn${scope === 'nationalChampions' ? ' active' : ''}"
      data-season-scope="nationalChampions"
    >Nationale Meister</button>
    <button
      type="button"
      class="results-type-btn${scope === 'internationalChampions' ? ' active' : ''}"
      data-season-scope="internationalChampions"
    >WM / EM / Olympia</button>
    <button
      type="button"
      class="results-type-btn${scope === 'raceWinners' ? ' active' : ''}"
      data-season-scope="raceWinners"
    >Jahressieger</button>
  `;

  // Eigenständige Layouts ohne Broadcast-Grid.
  if (scope === 'nationalChampions' || scope === 'internationalChampions') {
    renderChampionsScope(scope);
    return;
  }
  if (scope === 'raceWinners') {
    renderRaceWinnersScope();
    return;
  }

  const isCountryScope = scope === 'countries';
  const rows = isCountryScope
    ? (state.seasonStandings?.countryStandings ?? [])
    : scope === 'teams'
      ? (state.seasonStandings?.teamStandings ?? [])
      : (state.seasonStandings?.riderStandings ?? []);
  const countryRows = isCountryScope ? (rows as SeasonStandingCountryRow[]) : [];
  const standardRows = isCountryScope ? [] : (rows as SeasonStandingsPayload['riderStandings']);

  // Broadcast-Grid: Spalten je Scope + Kopfzeile
  const COLS = isCountryScope
    ? '52px minmax(180px,1.6fr) 44px 84px 96px'
    : '52px 44px minmax(160px,1.4fr) 44px minmax(130px,1fr) 84px 96px';
  const MONO = "font-family:'JetBrains Mono',monospace;";
  const primaryLabel = isCountryScope ? 'LAND' : scope === 'teams' ? 'TEAM' : 'FAHRER';
  const secondaryLabel = scope === 'teams' ? 'LAND' : 'TEAM';

  cardTitle.textContent = isCountryScope ? 'Länder-Wertung' : scope === 'teams' ? 'Team-Wertung' : 'Fahrer-Wertung';
  cardCount.textContent = `${rows.length} ${isCountryScope ? 'Länder' : scope === 'teams' ? 'Teams' : 'Fahrer'}`;

  gridHead.style.display = '';
  gridHead.style.gridTemplateColumns = COLS;
  gridHead.innerHTML = isCountryScope
    ? `<span>PL.</span><span>${primaryLabel}</span><span style="justify-self:center;">FLAGGE</span><span style="justify-self:end;">PUNKTE</span><span style="justify-self:end;">RÜCKSTAND</span>`
    : `<span>PL.</span><span style="justify-self:center;">TRIKOT</span><span>${primaryLabel}</span><span style="justify-self:center;">FLAGGE</span><span>${secondaryLabel}</span><span style="justify-self:end;">PUNKTE</span><span style="justify-self:end;">RÜCKSTAND</span>`;

  if (!state.seasonStandings || rows.length === 0) {
    tbody.innerHTML = '';
    tableCard.classList.add('hidden');
    empty.classList.remove('hidden');
    empty.textContent = 'Noch keine Saisonpunkte vorhanden.';
    return;
  }

  const rankColor = (r: number): string => r === 1 ? '#fbbf24' : r === 2 ? '#cbd5e1' : r === 3 ? '#d08b5b' : '#9fb0c9';
  const podium = (r: number): string => r === 1
    ? 'box-shadow:inset 3px 0 0 #fbbf24;background:linear-gradient(90deg,rgba(251,191,36,.08),transparent 55%);'
    : r === 2 ? 'box-shadow:inset 3px 0 0 #cbd5e1;background:linear-gradient(90deg,rgba(203,213,225,.07),transparent 55%);'
    : r === 3 ? 'box-shadow:inset 3px 0 0 #d08b5b;background:linear-gradient(90deg,rgba(208,139,91,.07),transparent 55%);'
    : '';
  const rowBase = (r: number): string => `display:grid;grid-template-columns:${COLS};gap:9px;align-items:center;padding:9px 16px;border-top:1px solid #14203a;${podium(r)}`;
  const rank = (r: number): string => `<span style="text-align:center;${MONO}font-size:15px;font-weight:800;color:${rankColor(r)};">${r}</span>`;
  const center = (h: string): string => `<span style="display:flex;justify-content:center;min-width:0;">${h}</span>`;
  const pts = (v: number): string => `<span style="${MONO}font-weight:800;color:#e2e8f0;justify-self:end;">${v}</span>`;
  const gap = (v: number): string => `<span style="${MONO}color:#6a7a95;justify-self:end;">${esc(formatPointsGap(v))}</span>`;

  tbody.innerHTML = isCountryScope
    ? countryRows.map((row) => `
      <div style="${rowBase(row.rank)}">
        ${rank(row.rank)}
        <span style="min-width:0;overflow:hidden;">${renderSeasonCountryNameCell(row)}</span>
        ${center(renderResultsFlagColumn(row.countryCode))}
        ${pts(row.points)}
        ${gap(row.gapPoints)}
      </div>`).join('')
    : standardRows.map((row) => {
      const primary = row.riderName ?? row.teamName;
      const jerseyCell = renderResultsJerseyColumn(row.teamId, row.teamName);
      const primaryCell = scope === 'teams'
        ? renderSeasonTeamNameCell(row, state.seasonStandings?.riderStandings ?? [])
        : renderResultsParticipant(primary, true, false, row.riderId, row.teamId);
      const secondaryCell = scope === 'teams'
        ? `<span style="color:#9fb0c9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(row.countryName ?? row.countryCode ?? '–')}</span>`
        : renderTeamNameLink(row.teamName ?? '–', row.teamId, false);
      return `
        <div style="${rowBase(row.rank)}">
          ${rank(row.rank)}
          ${center(jerseyCell)}
          <span style="min-width:0;overflow:hidden;">${primaryCell}</span>
          ${center(renderResultsFlagColumn(row.countryCode))}
          <span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${secondaryCell}</span>
          ${pts(row.points)}
          ${gap(row.gapPoints)}
        </div>`;
    }).join('');

  empty.classList.add('hidden');
  tableCard.classList.remove('hidden');
}

// Emoji-Signatur je internationalem Titeltyp (Regenbogen/Euro-Stern/Gold).
const CHAMPION_TITLE_BADGE: Record<ChampionTitleType, string> = {
  WM: '<span title="Weltmeister" style="font-size:15px;filter:drop-shadow(0 0 3px rgba(236,72,153,.6));">🌈</span>',
  WM_U23: '<span title="Weltmeister U23" style="font-size:15px;filter:drop-shadow(0 0 3px rgba(236,72,153,.6));">🌈</span>',
  WM_JUN: '<span title="Weltmeister Junioren" style="font-size:15px;filter:drop-shadow(0 0 3px rgba(236,72,153,.6));">🌈</span>',
  EM: '<span title="Europameister" style="font-size:15px;filter:drop-shadow(0 0 3px rgba(59,130,246,.7));">⭐</span>',
  EM_U23: '<span title="Europameister U23" style="font-size:15px;filter:drop-shadow(0 0 3px rgba(59,130,246,.7));">⭐</span>',
  EM_JUN: '<span title="Europameister Junioren" style="font-size:15px;filter:drop-shadow(0 0 3px rgba(59,130,246,.7));">⭐</span>',
  OLY: '<span title="Olympiasieger" style="font-size:15px;filter:drop-shadow(0 0 3px rgba(251,191,36,.7));">🥇</span>',
  NAT: '<span title="Nationaler Meister" style="font-size:15px;">🏅</span>',
};

const RAINBOW_ACCENT = 'linear-gradient(90deg,#3b82f6,#22d3ee,#4ade80,#facc15,#fb923c,#ef4444)';

// Reihenfolge + Beschriftung der internationalen Titelgruppen.
const INTERNATIONAL_GROUPS: Array<{ type: ChampionTitleType; title: string; accent: string }> = [
  { type: 'OLY', title: 'Olympische Spiele', accent: '#fbbf24' },
  { type: 'WM', title: 'Weltmeisterschaft', accent: RAINBOW_ACCENT },
  { type: 'EM', title: 'Europameisterschaft', accent: '#3b82f6' },
  { type: 'WM_U23', title: 'Weltmeisterschaft U23', accent: RAINBOW_ACCENT },
  { type: 'EM_U23', title: 'Europameisterschaft U23', accent: '#3b82f6' },
  { type: 'WM_JUN', title: 'Weltmeisterschaft Junioren', accent: RAINBOW_ACCENT },
  { type: 'EM_JUN', title: 'Europameisterschaft Junioren', accent: '#3b82f6' },
];

function renderChampionHolderCell(holder: SeasonChampionHolder | null): string {
  if (!holder) {
    return '<span style="color:#5f6f8a;font-size:13px;">—</span>';
  }
  const flag = holder.countryCode ? renderResultsFlagColumn(holder.countryCode) : '';
  const nameHtml = renderRiderNameLink(holder.riderName, { riderId: holder.riderId, strong: true });
  return `
    <span style="display:inline-flex;align-items:center;gap:8px;min-width:0;">
      <span style="flex:0 0 auto;">${flag}</span>
      <span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:700;color:#e2e8f0;">${nameHtml}</span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#8494ad;flex:0 0 auto;">'${String(holder.season).slice(-2)}</span>
    </span>`;
}

function renderDisciplineLine(badge: string, label: string, holder: SeasonChampionHolder | null): string {
  return `
    <div style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-top:1px solid #14203a;">
      ${badge}
      <span style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.1em;color:#5f6f8a;flex:0 0 74px;">${esc(label)}</span>
      ${renderChampionHolderCell(holder)}
    </div>`;
}

function renderNationalChampionsScope(groups: SeasonNationalChampionGroup[]): string {
  if (groups.length === 0) {
    return '<div style="padding:16px;color:#6a7a95;font-size:13px;">Noch keine nationalen Meister.</div>';
  }
  const cards = groups.map((g) => {
    const flag = g.countryCode ? renderResultsFlagColumn(g.countryCode) : '';
    return `
      <section style="border-radius:12px;border:1px solid #1e2c49;background:#0c1526;overflow:hidden;">
        <div style="display:flex;align-items:center;gap:9px;padding:10px 12px;border-bottom:1px solid #1c2b47;">
          <span style="flex:0 0 auto;">${flag}</span>
          <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:800;color:#f1f5f9;">${esc(g.countryName)}</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#8494ad;flex:0 0 auto;">${g.points} Pkt.</span>
        </div>
        ${renderDisciplineLine(CHAMPION_TITLE_BADGE.NAT, 'Straße', g.road)}
        ${renderDisciplineLine(CHAMPION_TITLE_BADGE.NAT, 'Zeitfahren', g.itt)}
      </section>`;
  }).join('');
  return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;padding:4px;">${cards}</div>`;
}

function renderInternationalChampionsScope(titles: SeasonReigningTitle[]): string {
  const byType = new Map<string, SeasonReigningTitle[]>();
  for (const t of titles) {
    const bucket = byType.get(t.type) ?? [];
    bucket.push(t);
    byType.set(t.type, bucket);
  }
  const sections = INTERNATIONAL_GROUPS
    .filter((group) => (byType.get(group.type) ?? []).length > 0)
    .map((group) => {
      const list = byType.get(group.type) ?? [];
      const road = list.find((t) => t.discipline === 'ROAD')?.holder ?? null;
      const itt = list.find((t) => t.discipline === 'ITT')?.holder ?? null;
      const badge = CHAMPION_TITLE_BADGE[group.type];
      return `
        <section style="border-radius:14px;border:1px solid #223354;background:linear-gradient(160deg,#101d33,#0b1424);overflow:hidden;">
          <div style="height:4px;background:${group.accent};"></div>
          <div style="padding:12px 16px;">
            <h3 style="margin:0 0 8px;font-size:15px;font-weight:800;color:#f1f5f9;">${esc(group.title)}</h3>
            ${renderDisciplineLine(badge, 'Straße', road)}
            ${renderDisciplineLine(badge, 'Zeitfahren', itt)}
          </div>
        </section>`;
    }).join('');
  if (!sections) {
    return '<div style="padding:16px;color:#6a7a95;font-size:13px;">Noch keine internationalen Titel vergeben.</div>';
  }
  return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;padding:4px;">${sections}</div>`;
}

function renderChampionsScope(scope: 'nationalChampions' | 'internationalChampions'): void {
  const empty = $('season-standings-empty');
  const tableCard = $('season-standings-table-card');
  const gridHead = $('season-standings-grid-head');
  const tbody = $('season-standings-tbody');
  const cardTitle = $('season-standings-card-title');
  const cardCount = $('season-standings-card-count');

  gridHead.style.display = 'none';

  if (scope === 'nationalChampions') {
    const groups = state.seasonStandings?.nationalChampions ?? [];
    cardTitle.textContent = 'Nationale Meister';
    cardCount.textContent = `${groups.length} ${groups.length === 1 ? 'Land' : 'Länder'}`;
    tbody.innerHTML = renderNationalChampionsScope(groups);
  } else {
    const titles = state.seasonStandings?.reigningTitles ?? [];
    cardTitle.textContent = 'WM / EM / Olympia';
    cardCount.textContent = `${titles.length} ${titles.length === 1 ? 'Titel' : 'Titel'}`;
    tbody.innerHTML = renderInternationalChampionsScope(titles);
  }

  empty.classList.add('hidden');
  tableCard.classList.remove('hidden');
}

// Jahresuebersicht der Renn-Sieger nach Prestige-Stufe (Design: Sektionen,
// Plaetze 1/2/3 in eigenen Spalten einzeilig nebeneinander).
const WINNER_TIERS: Array<{ ids: number[]; label: string; color: string }> = [
  { ids: [1], label: 'Tour de France', color: '#facc15' },
  { ids: [2], label: 'Grand Tours', color: '#fb923c' },
  { ids: [3], label: 'Monumente', color: '#f472b6' },
  { ids: [4], label: 'World Tour High', color: '#22d3ee' },
  { ids: [7], label: 'One Day High', color: '#a78bfa' },
];

function renderWinnerCell(ref: PalmaresRiderRef | null, medalColor: string): string {
  if (!ref) return '<span style="color:#4a5a75;font-size:13px;">–</span>';
  const flag = ref.countryCode ? renderResultsFlagColumn(ref.countryCode) : '';
  const name = renderRiderNameLink(ref.lastName, { riderId: ref.riderId, strong: medalColor === '#facc15' });
  return `<span style="display:inline-flex;align-items:center;gap:7px;min-width:0;border-left:2px solid ${medalColor};padding-left:8px;">${flag}<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${name}</span>${renderMiniJersey(ref.teamId, ref.teamName)}</span>`;
}

function renderRaceWinnersScope(): void {
  const empty = $('season-standings-empty');
  const tableCard = $('season-standings-table-card');
  const gridHead = $('season-standings-grid-head');
  const tbody = $('season-standings-tbody');
  const cardTitle = $('season-standings-card-title');
  const cardCount = $('season-standings-card-count');

  gridHead.style.display = 'none';
  const winners = state.seasonStandings?.raceWinners ?? [];
  cardTitle.textContent = 'Jahressieger';
  cardCount.textContent = `${winners.length} ${winners.length === 1 ? 'Rennen' : 'Rennen'}`;

  const COLS = 'grid-template-columns:minmax(150px,1.25fr) 1fr 1fr 1fr;gap:14px;';
  const sections = WINNER_TIERS.map((tier) => {
    const races = winners.filter((w) => tier.ids.includes(w.categoryId));
    if (races.length === 0) return '';
    const header = `<div style="display:grid;${COLS}padding:6px 14px;">
      <span style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.12em;color:#6a7a95;text-transform:uppercase;">Rennen</span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.12em;color:#facc15;text-transform:uppercase;">Sieger</span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.12em;color:#cbd5e1;text-transform:uppercase;">2. Platz</span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.12em;color:#cd7c3b;text-transform:uppercase;">3. Platz</span>
    </div>`;
    const rows = races.map((w) => `<div style="display:grid;${COLS}padding:10px 14px;border-top:1px solid #14203a;align-items:center;">
      <span style="font-weight:800;font-size:13px;color:#e8eef7;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(w.raceName)}</span>
      ${renderWinnerCell(w.winner, '#facc15')}
      ${renderWinnerCell(w.second, '#cbd5e1')}
      ${renderWinnerCell(w.third, '#cd7c3b')}
    </div>`).join('');
    return `<section style="border:1px solid #1e2c49;border-radius:12px;background:#0c1526;overflow:hidden;margin-bottom:14px;">
      <div style="display:flex;align-items:center;gap:9px;padding:10px 14px;border-bottom:1px solid #1c2b47;background:linear-gradient(90deg,${tier.color}22,transparent 60%);">
        <span style="width:8px;height:20px;border-radius:3px;background:${tier.color};"></span>
        <span style="font-weight:800;font-size:14px;color:#f1f5f9;">${tier.label}</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#6a7a95;letter-spacing:.1em;">${races.length} RENNEN</span>
      </div>${header}${rows}</section>`;
  }).join('');

  tbody.innerHTML = sections || '<div style="padding:16px;color:#6a7a95;font-size:13px;">Noch keine Sieger in dieser Saison.</div>';
  empty.classList.add('hidden');
  tableCard.classList.remove('hidden');
}

export function initSeasonStandingsListeners(): void {
  $('season-standings-scope-tabs').addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-season-scope]');
    if (!button) return;
    const scope = button.dataset['seasonScope'];
    if (scope !== 'riders' && scope !== 'teams' && scope !== 'countries'
      && scope !== 'nationalChampions' && scope !== 'internationalChampions' && scope !== 'raceWinners') return;
    state.selectedSeasonStandingScope = scope;
    renderSeasonStandingsView();
  });

  const yearSelect = $('season-standings-year-select');
  if (yearSelect) {
    yearSelect.addEventListener('change', (event) => {
      const select = event.target as HTMLSelectElement;
      state.seasonStandingsSelectedSeason = Number(select.value);
      void loadSeasonStandings(false);
    });
  }
}
