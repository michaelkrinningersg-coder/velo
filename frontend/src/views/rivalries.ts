import { api } from '../api';
import { $, esc, renderFlag, renderMiniJersey } from '../state';
import { resolveRaceCategoryBadgeStyle } from '../riderStatsUi';
import type { RivalryOverviewItem, RivalryDetailPayload, RivalryRiderRef } from '../../../shared/types';

// Liga-Rivalitaeten: Uebersicht als Rangliste, Klick auf ein Duell oeffnet die
// Rivalitaetskarte mit allen direkten Duellen der beiden.

let currentSeason: number | null = null;
let seasons: number[] = [];
let items: RivalryOverviewItem[] = [];
let selectedKey: string | null = null;
let detail: RivalryDetailPayload | null = null;
let loading = false;

const MONO = "font-family:'JetBrains Mono',monospace;font-variant-numeric:tabular-nums";

// Rollen-Farbe wie im teamStats-Header (getRoleStyle).
function roleColor(roleId: number | null): string {
  switch (roleId) {
    case 1: return '#fbbf24'; // Kapitaen
    case 2: return '#cbd5e1'; // Co-Kapitaen
    case 3: return '#c084fc'; // Edelhelfer
    case 4: return '#38bdf8'; // Starke Helfer
    case 5: return '#fb923c'; // Wassertraeger
    case 6: return '#4ade80'; // Sprinter
    default: return '#9fb0c9';
  }
}
function roleLabel(roleName: string | null): string {
  const r = (roleName ?? '').toLowerCase();
  if (r.includes('co')) return 'Co-Kapitän';
  if (r.includes('kapit')) return 'Kapitän';
  if (r.includes('sprint')) return 'Sprinter';
  if (r.includes('edelhelf')) return 'Edelhelfer';
  if (r.includes('stark')) return 'Starker Helfer';
  if (r.includes('wasser')) return 'Wasserträger';
  return roleName ?? '–';
}
function pairKey(a: number, b: number): string { return `${a}-${b}`; }
function ovr(v: number): string { return Math.round(v).toString(); }
function num(v: number): string { return v.toLocaleString('de-DE'); }

function roleBadge(roleId: number | null, roleName: string | null): string {
  const col = roleColor(roleId);
  return `<span style="${MONO};font-size:9px;font-weight:700;letter-spacing:.06em;border:1px solid ${col}55;color:${col};background:${col}12;border-radius:5px;padding:1px 6px;white-space:nowrap;">${esc(roleLabel(roleName))}</span>`;
}
function catBadge(name: string | null): string {
  if (!name) return '';
  const s = resolveRaceCategoryBadgeStyle(name);
  return `<span style="${MONO};font-size:8px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:${s.color};border:1px solid ${s.border};background:${s.background};border-radius:5px;padding:2px 7px;white-space:nowrap;">${esc(name)}</span>`;
}
function teamChip(teamId: number | null, teamName: string | null): string {
  return `<span style="display:inline-flex;align-items:center;gap:5px;${MONO};font-size:9.5px;color:#8b9ab4;white-space:nowrap;">${renderMiniJersey(teamId, teamName)}<span style="overflow:hidden;text-overflow:ellipsis;">${esc(teamName ?? 'Ohne Team')}</span></span>`;
}

// ---- Rangliste (Uebersicht) ------------------------------------------

function renderRow(item: RivalryOverviewItem): string {
  const a = item.riderA, b = item.riderB;
  const total = item.seasonWinA + item.seasonWinB;
  const aPct = total > 0 ? (item.seasonWinA / total) * 100 : 50;
  const top = item.rank === 1;
  const border = top ? 'rgba(251,191,36,.35)' : '#1e2c49';
  const bg = top ? 'linear-gradient(90deg,rgba(251,191,36,.05),transparent 40%),#0b1120' : '#0b1120';
  return `
    <div class="rivalry-row" data-rivalry-open="${pairKey(a.riderId, b.riderId)}" role="button" tabindex="0"
      style="display:grid;grid-template-columns:34px 1fr 176px 1fr 52px;align-items:center;gap:12px;padding:12px 13px;border:1px solid ${border};border-radius:11px;background:${bg};cursor:pointer;margin-bottom:8px;">
      <div style="${MONO};font-size:16px;font-weight:800;color:${top ? '#fbbf24' : '#5f6f8a'};text-align:center;">${item.rank}</div>
      <div style="display:flex;flex-direction:column;gap:4px;min-width:0;">
        <div style="font-weight:700;font-size:14px;color:#e6ecf6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(a.firstName)} ${esc(a.lastName)}</div>
        <div style="display:flex;align-items:center;gap:8px;min-width:0;">${renderFlag(a.countryCode ?? '')}${teamChip(a.teamId, a.teamName)}${roleBadge(a.roleId, a.roleName)}<span style="${MONO};font-size:11px;font-weight:800;color:#fbbf24;">${ovr(a.overallRating)}</span></div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:5px;">
        <div style="width:100%;height:17px;border-radius:5px;overflow:hidden;display:flex;${MONO};font-weight:800;font-size:10px;">
          <div style="width:${aPct}%;background:linear-gradient(90deg,#0e7490,#22d3ee);color:#04222b;display:flex;align-items:center;padding-left:8px;">${item.seasonWinA}</div>
          <div style="flex:1;background:linear-gradient(90deg,#b45309,#fbbf24);color:#3a2606;display:flex;align-items:center;justify-content:flex-end;padding-right:8px;">${item.seasonWinB}</div>
        </div>
        ${catBadge(item.topCategoryName)}
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;min-width:0;align-items:flex-end;text-align:right;">
        <div style="font-weight:700;font-size:14px;color:#e6ecf6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(b.firstName)} ${esc(b.lastName)}</div>
        <div style="display:flex;flex-direction:row-reverse;align-items:center;gap:8px;min-width:0;">${renderFlag(b.countryCode ?? '')}${teamChip(b.teamId, b.teamName)}${roleBadge(b.roleId, b.roleName)}<span style="${MONO};font-size:11px;font-weight:800;color:#fbbf24;">${ovr(b.overallRating)}</span></div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;">
        <span style="${MONO};font-size:7px;letter-spacing:.14em;color:#5f6f8a;">IDX</span>
        <span style="${MONO};font-size:19px;font-weight:800;color:#fbbf24;line-height:1;">${item.index}</span>
      </div>
    </div>`;
}

// ---- Rivalitaetskarte (Detail) ---------------------------------------

function riderHead(r: RivalryDetailPayload['riderA'], side: 'l' | 'r'): string {
  const dir = side === 'r' ? 'row-reverse' : 'row';
  const align = side === 'r' ? 'flex-end' : 'flex-start';
  const txtAlign = side === 'r' ? 'right' : 'left';
  const prog = r.seasonProgram
    ? `<span style="${MONO};font-size:9px;color:#7dd3fc;border:1px solid rgba(56,189,248,.35);background:rgba(56,189,248,.07);border-radius:5px;padding:1px 6px;white-space:nowrap;">▦ ${esc(r.seasonProgram)}</span>`
    : '';
  return `
    <div style="display:flex;flex-direction:${dir};align-items:center;gap:11px;min-width:0;flex:1;">
      <span style="flex:none;">${renderMiniJersey(r.teamId, r.teamName)}</span>
      <div style="min-width:0;text-align:${txtAlign};">
        <div style="font-size:18px;font-weight:800;color:#e6ecf6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(r.firstName)} ${esc(r.lastName)}</div>
        <div style="display:flex;flex-direction:${dir};align-items:center;gap:8px;margin-top:5px;flex-wrap:wrap;justify-content:${align};">
          ${renderFlag(r.countryCode ?? '')}${teamChip(r.teamId, r.teamName)}${roleBadge(r.roleId, r.roleName)}
          <span style="${MONO};font-size:10px;color:#8b9ab4;">${r.age} J</span>
          <span style="${MONO};font-size:13px;font-weight:800;color:#fbbf24;">OVR ${ovr(r.overallRating)}</span>
        </div>
        <div style="display:flex;flex-direction:${dir};margin-top:6px;justify-content:${align};">${prog}</div>
      </div>
    </div>`;
}

function statCol(label: string, a: string, b: string): string {
  return `
    <div style="display:contents;">
      <div style="${MONO};font-size:13px;font-weight:800;color:#22d3ee;text-align:right;padding:7px 14px 7px 0;border-bottom:1px solid #14203a;">${a}</div>
      <div style="${MONO};font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:#5f6f8a;text-align:center;align-self:center;border-bottom:1px solid #14203a;">${esc(label)}</div>
      <div style="${MONO};font-size:13px;font-weight:800;color:#fbbf24;text-align:left;padding:7px 0 7px 14px;border-bottom:1px solid #14203a;">${b}</div>
    </div>`;
}

function duelRow(d: RivalryDetailPayload['duels'][number]): string {
  const pA = d.winner === 'A' ? '#22d3ee' : '#5f6f8a';
  const pB = d.winner === 'B' ? '#fbbf24' : '#5f6f8a';
  return `
    <div style="display:grid;grid-template-columns:64px 1fr 150px 34px 150px;align-items:center;gap:10px;padding:9px 11px;border:1px solid #1e2c49;border-radius:9px;background:#0b1120;margin-bottom:6px;">
      <span style="${MONO};font-size:10px;color:#5f6f8a;">${esc(d.date)}</span>
      <div style="min-width:0;">
        <div style="font-size:12.5px;font-weight:700;color:#e6ecf6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(d.raceName)}</div>
        <div style="display:flex;align-items:center;gap:7px;margin-top:3px;">${catBadge(d.categoryName)}<span style="${MONO};font-size:8.5px;color:#8b9ab4;">${d.type}</span></div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;min-width:0;">
        <span style="${MONO};font-size:15px;font-weight:800;color:${pA};width:30px;text-align:center;">${d.rankA}</span>
        <div style="display:flex;align-items:center;gap:5px;min-width:0;">${renderFlag(detail?.riderA.countryCode ?? '')}${renderMiniJersey(d.teamAId, d.teamAName)}<span style="${MONO};font-size:9px;color:#8b9ab4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(d.teamAName ?? '')}</span></div>
      </div>
      <span style="${MONO};font-size:9px;color:#5f6f8a;text-align:center;">vs</span>
      <div style="display:flex;flex-direction:row-reverse;align-items:center;gap:8px;min-width:0;">
        <span style="${MONO};font-size:15px;font-weight:800;color:${pB};width:30px;text-align:center;">${d.rankB}</span>
        <div style="display:flex;flex-direction:row-reverse;align-items:center;gap:5px;min-width:0;">${renderFlag(detail?.riderB.countryCode ?? '')}${renderMiniJersey(d.teamBId, d.teamBName)}<span style="${MONO};font-size:9px;color:#8b9ab4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(d.teamBName ?? '')}</span></div>
      </div>
    </div>`;
}

function renderDetailCard(): string {
  if (!detail) return '';
  const d = detail;
  const total = d.seasonWinA + d.seasonWinB;
  const aPct = total > 0 ? (d.seasonWinA / total) * 100 : 50;
  const duelsHtml = d.duels.length
    ? d.duels.map(duelRow).join('')
    : `<div style="padding:14px;color:#5f6f8a;${MONO};font-size:11px;">Keine gemeinsamen Duelle gefunden.</div>`;
  return `
    <div id="rivalry-detail-card" style="margin-top:22px;border:1px solid rgba(34,211,238,.32);border-radius:14px;overflow:hidden;background:linear-gradient(180deg,rgba(34,211,238,.04),transparent 30%),#0c1526;">
      <div style="position:relative;padding:16px 16px 14px;border-bottom:1px solid #14203a;">
        <div style="display:inline-block;${MONO};font-weight:800;font-size:11px;color:#080e1a;background:linear-gradient(135deg,#fbbf24,#b45309);padding:3px 10px;border-radius:6px;margin-bottom:12px;">#${d.rank} · RIVALITÄT ${esc(String(d.season))} · ${esc(d.discipline)}</div>
        <div style="position:absolute;top:14px;right:16px;text-align:right;">
          <div style="${MONO};font-size:7px;letter-spacing:.16em;color:#5f6f8a;">INDEX</div>
          <div style="${MONO};font-size:26px;font-weight:800;color:#fbbf24;line-height:.9;">${d.index}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 56px 1fr;align-items:center;gap:0;">
          ${riderHead(d.riderA, 'l')}
          <div style="text-align:center;"><div style="${MONO};font-size:13px;font-weight:800;letter-spacing:.1em;color:#5f6f8a;">VS</div></div>
          ${riderHead(d.riderB, 'r')}
        </div>
      </div>

      <div style="padding:12px 16px;border-bottom:1px solid #14203a;">
        <div style="display:flex;justify-content:space-between;${MONO};font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5f6f8a;margin-bottom:6px;">
          <span>Direkte Duelle · Saison ${esc(String(d.season))}</span><span>${d.seasonEncounters} Begegnungen</span></div>
        <div style="height:20px;border-radius:6px;overflow:hidden;display:flex;${MONO};font-weight:800;font-size:11px;">
          <div style="width:${aPct}%;background:linear-gradient(90deg,#0e7490,#22d3ee);color:#04222b;display:flex;align-items:center;padding-left:9px;">${d.seasonWinA}</div>
          <div style="flex:1;background:linear-gradient(90deg,#b45309,#fbbf24);color:#3a2606;display:flex;align-items:center;justify-content:flex-end;padding-right:9px;">${d.seasonWinB}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr auto 1fr;padding:6px 16px 12px;">
        ${statCol('Siege All-Time', num(d.riderA.careerWins), num(d.riderB.careerWins))}
        ${statCol('UCI-Punkte All-Time', num(d.riderA.allTimeUciPoints), num(d.riderB.allTimeUciPoints))}
        ${statCol('Gesamt-H2H', String(d.gesamtWinA), String(d.gesamtWinB))}
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;padding:13px 16px 4px;${MONO};font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#5f6f8a;">
        <span>Alle Duelle · Gesamt-H2H ${d.gesamtWinA}–${d.gesamtWinB}</span><span>Sieger farbcodiert · neueste zuerst</span></div>
      <div style="padding:6px 16px 16px;max-height:520px;overflow-y:auto;">${duelsHtml}</div>
    </div>`;
}

// ---- Render / Load ---------------------------------------------------

function render(): void {
  const body = $('rivalries-body');
  if (!body) return;
  if (loading) {
    body.innerHTML = `<div style="padding:24px;color:#8b9ab4;">Rivalitäten werden geladen…</div>`;
    return;
  }
  if (items.length === 0) {
    body.innerHTML = `<div style="padding:24px;color:#8b9ab4;">Für diese Saison wurden noch keine Rivalitäten erkannt.</div>`;
    return;
  }
  const switcher = seasons.length > 1
    ? `<div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap;">${seasons.map((s) => `<button class="rivalry-season" data-rivalry-season="${s}" style="${MONO};font-size:11px;font-weight:700;padding:5px 12px;border-radius:8px;cursor:pointer;border:1px solid ${s === currentSeason ? '#22d3ee' : '#1e2c49'};color:${s === currentSeason ? '#22d3ee' : '#8b9ab4'};background:${s === currentSeason ? 'rgba(34,211,238,.1)' : '#0b1120'};">Saison ${s}</button>`).join('')}</div>`
    : '';
  const hint = `<div style="${MONO};font-size:10.5px;color:#5f6f8a;text-align:center;margin:12px 0 4px;">▸ Klick auf eine Zeile öffnet die Rivalitätskarte</div>`;
  body.innerHTML = switcher
    + items.map(renderRow).join('')
    + hint
    + renderDetailCard();

  if (detail) {
    const card = $('rivalry-detail-card');
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

async function loadOverview(season?: number): Promise<void> {
  loading = true;
  render();
  const res = await api.getRivalries(season);
  loading = false;
  if (res.success && res.data) {
    currentSeason = res.data.season;
    seasons = res.data.seasons;
    items = res.data.rivalries;
    // Bei Saisonwechsel bereits geoeffnete Karte schliessen.
    if (!items.some((i) => pairKey(i.riderA.riderId, i.riderB.riderId) === selectedKey)) {
      selectedKey = null; detail = null;
    }
  } else {
    items = []; seasons = []; detail = null; selectedKey = null;
  }
  render();
}

async function openDetail(aId: number, bId: number): Promise<void> {
  const res = await api.getRivalryDetail(aId, bId, currentSeason ?? undefined);
  if (res.success && res.data) {
    detail = res.data;
    selectedKey = pairKey(res.data.riderA.riderId, res.data.riderB.riderId);
  }
  render();
}

export function showRivalriesView(): void {
  void loadOverview(currentSeason ?? undefined);
}

// Von riderStats-Chip: oeffnet direkt die Rivalitaetskarte eines Paares.
export function openRivalryCard(key: string): void {
  const [aId, bId] = key.split('-').map(Number);
  if (!Number.isFinite(aId) || !Number.isFinite(bId)) return;
  void (async () => {
    if (items.length === 0) await loadOverview();
    await openDetail(aId, bId);
  })();
}

export function initRivalriesView(): void {
  const body = $('rivalries-body');
  if (!body) return;
  body.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const seasonBtn = target.closest<HTMLElement>('[data-rivalry-season]');
    if (seasonBtn) {
      const s = Number(seasonBtn.dataset['rivalrySeason']);
      if (Number.isFinite(s)) void loadOverview(s);
      return;
    }
    const row = target.closest<HTMLElement>('[data-rivalry-open]');
    if (row) {
      const [aId, bId] = (row.dataset['rivalryOpen'] ?? '').split('-').map(Number);
      if (Number.isFinite(aId) && Number.isFinite(bId)) void openDetail(aId, bId);
    }
  });
}
