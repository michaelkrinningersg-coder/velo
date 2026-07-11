import { api } from '../api';
import { esc, renderFlag, renderMiniJersey } from '../state';
import { resolveRaceCategoryBadgeStyle } from '../riderStatsUi';
import type {
  SeasonWrappedPayload, PalmaresRiderRef, RaceWinnerEntry, WrappedCareerResult,
  WrappedWinsEntry, WrappedTeamStat, WrappedNewcomer, WrappedRetiree, WrappedLegend,
} from '../../../shared/types';

// Saison-Rückblick ("Wrapped") als Vollbild-Overlay, gezeigt beim Jahreswechsel
// direkt vor dem Draft. Die Promise löst auf, wenn der Nutzer weitergeht.

const MONO = "font-family:'JetBrains Mono',monospace";
const MEDAL = ['#fbbf24', '#cbd5e1', '#cd7c3b'];

function riderChip(r: PalmaresRiderRef | null, bold = true): string {
  if (!r) return '<span style="color:#5f6f8a;">–</span>';
  return `<span style="display:inline-flex;align-items:center;gap:7px;min-width:0;">${renderFlag(r.countryCode ?? '')}<span style="font-weight:${bold ? 700 : 500};color:#e6ecf6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(r.firstName)} ${esc(r.lastName)}</span>${renderMiniJersey(r.teamId, r.teamName)}</span>`;
}

function sectionTitle(label: string): string {
  return `<div style="display:flex;align-items:center;gap:12px;margin:30px 0 14px;${MONO};font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#5f6f8a;"><span>${esc(label)}</span><span style="flex:1;height:1px;background:#14203a;"></span></div>`;
}

// Jahressieger in EXAKT demselben Format wie die Season-Standings-
// Jahresuebersicht (Prestige-Stufen mit Sieger/2./3. in Spalten).
const WINNER_TIERS: Array<{ ids: number[]; label: string; color: string }> = [
  { ids: [1], label: 'Tour de France', color: resolveRaceCategoryBadgeStyle('Tour de France').color },
  { ids: [2], label: 'Grand Tours', color: resolveRaceCategoryBadgeStyle('Grand Tour').color },
  { ids: [3], label: 'Monumente', color: resolveRaceCategoryBadgeStyle('Monument').color },
  { ids: [4], label: 'World Tour High', color: resolveRaceCategoryBadgeStyle('Stage Race High').color },
  { ids: [7], label: 'One Day High', color: resolveRaceCategoryBadgeStyle('One Day High').color },
];

function winnerCell(ref: PalmaresRiderRef | null, medalColor: string): string {
  if (!ref) return '<span style="color:#4a5a75;font-size:13px;">–</span>';
  return `<span style="display:inline-flex;align-items:center;gap:7px;min-width:0;border-left:2px solid ${medalColor};padding-left:8px;">${renderFlag(ref.countryCode ?? '')}<span style="font-weight:${medalColor === '#facc15' ? 800 : 600};color:#e8eef7;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(ref.lastName)}</span>${renderMiniJersey(ref.teamId, ref.teamName)}</span>`;
}

function winnersSections(winners: RaceWinnerEntry[]): string {
  const COLS = 'grid-template-columns:minmax(150px,1.25fr) 1fr 1fr 1fr;gap:14px;';
  const sections = WINNER_TIERS.map((tier) => {
    const races = winners.filter((w) => tier.ids.includes(w.categoryId));
    if (races.length === 0) return '';
    const header = `<div style="display:grid;${COLS}padding:6px 14px;">
      <span style="${MONO};font-size:9px;letter-spacing:.12em;color:#6a7a95;text-transform:uppercase;">Rennen</span>
      <span style="${MONO};font-size:9px;letter-spacing:.12em;color:#facc15;text-transform:uppercase;">Sieger</span>
      <span style="${MONO};font-size:9px;letter-spacing:.12em;color:#cbd5e1;text-transform:uppercase;">2. Platz</span>
      <span style="${MONO};font-size:9px;letter-spacing:.12em;color:#cd7c3b;text-transform:uppercase;">3. Platz</span>
    </div>`;
    const rows = races.map((w) => `<div style="display:grid;${COLS}padding:10px 14px;border-top:1px solid #14203a;align-items:center;">
      <span style="font-weight:800;font-size:13px;color:#e8eef7;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(w.raceName)}</span>
      ${winnerCell(w.winner, '#facc15')}
      ${winnerCell(w.second, '#cbd5e1')}
      ${winnerCell(w.third, '#cd7c3b')}
    </div>`).join('');
    return `<section style="border:1px solid #1e2c49;border-radius:12px;background:#0c1526;overflow:hidden;margin-bottom:14px;">
      <div style="display:flex;align-items:center;gap:9px;padding:10px 14px;border-bottom:1px solid #1c2b47;background:linear-gradient(90deg,${tier.color}22,transparent 60%);">
        <span style="width:8px;height:20px;border-radius:3px;background:${tier.color};"></span>
        <span style="font-weight:800;font-size:14px;color:#f1f5f9;">${esc(tier.label)}</span>
        <span style="${MONO};font-size:10px;color:#6a7a95;letter-spacing:.1em;">${races.length} RENNEN</span>
      </div>${header}${rows}</section>`;
  }).join('');
  return sections || '<div style="padding:16px;color:#6a7a95;font-size:13px;">Noch keine Sieger in dieser Saison.</div>';
}

// Rahmen-Sektion im Stil der Jahressieger-Uebersicht: farbiger Header-Balken +
// Label (+ optionaler Meta-Text), Inhalt darunter.
function wrappedSection(color: string, label: string, meta: string, inner: string): string {
  return `<section style="border:1px solid #1e2c49;border-radius:12px;background:#0c1526;overflow:hidden;margin-bottom:14px;">
    <div style="display:flex;align-items:center;gap:9px;padding:10px 14px;border-bottom:1px solid #1c2b47;background:linear-gradient(90deg,${color}22,transparent 60%);">
      <span style="width:8px;height:20px;border-radius:3px;background:${color};"></span>
      <span style="font-weight:800;font-size:14px;color:#f1f5f9;">${esc(label)}</span>
      ${meta ? `<span style="${MONO};font-size:10px;color:#6a7a95;letter-spacing:.1em;">${esc(meta)}</span>` : ''}
    </div>${inner}</section>`;
}

// Podium-Zeilen (Rang · Fahrer/Team · Wert) im Tabellen-Stil einer Sektion.
function statRows(entries: Array<{ label: string; sub: string }>): string {
  if (entries.length === 0) return `<div style="padding:14px;color:#6a7a95;font-size:13px;">–</div>`;
  return entries.map((e, i) => `<div style="display:grid;grid-template-columns:34px 1fr auto;align-items:center;gap:12px;padding:10px 14px;border-top:1px solid #14203a;">
    <span style="${MONO};font-size:16px;font-weight:800;color:${MEDAL[i] ?? '#5f6f8a'};text-align:center;">${i + 1}</span>
    <span style="min-width:0;">${e.label}</span>
    <span style="${MONO};font-size:15px;font-weight:800;color:#fbbf24;">${e.sub}</span>
  </div>`).join('');
}

function teamChip(t: WrappedTeamStat): string {
  return `<span style="display:inline-flex;align-items:center;gap:8px;min-width:0;">${renderMiniJersey(t.teamId, t.teamName)}<span style="font-weight:700;color:#e6ecf6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(t.teamName ?? '—')}</span></span>`;
}

// Platzierungsfarbe: P1 gold, P2 silber, P3 bronze, Top10 cyan, Top25 lila, danach grau.
function rankColor(rank: number): string {
  if (rank === 1) return '#fbbf24';
  if (rank === 2) return '#cbd5e1';
  if (rank === 3) return '#cd7c3b';
  if (rank <= 10) return '#22d3ee';
  if (rank <= 25) return '#a855f7';
  return '#5f6f8a';
}

function resultsList(results: WrappedCareerResult[]): string {
  if (!results.length) return '';
  return `<div style="margin-top:10px;display:flex;flex-direction:column;gap:4px;">${results.map((b) => `
    <div style="display:flex;align-items:center;gap:9px;${MONO};font-size:10.5px;color:#8b9ab4;">
      <span style="color:#22d3ee;font-weight:800;width:52px;">${b.points} P</span>
      <span style="flex:1;color:#cbd5e1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${b.count > 1 ? `<span style="color:#fbbf24;font-weight:800;">${b.count}×</span> ` : ''}${esc(b.raceName)}</span>
      <span style="color:#5f6f8a;">${esc(b.type)} · <span style="color:${rankColor(b.rank)};font-weight:${b.rank <= 3 ? 800 : 700};">P${b.rank}</span></span>
    </div>`).join('')}</div>`;
}

// Fahrer-Zeile mit verschachtelter Ergebnisliste, als Tabellenzeile einer Sektion.
function detailRow(badge: string, rider: PalmaresRiderRef, statsLine: string, results: WrappedCareerResult[]): string {
  return `<div style="padding:12px 14px;border-top:1px solid #14203a;">
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
      ${badge}
      <span style="flex:1;min-width:160px;font-size:15px;">${riderChip(rider)}</span>
      <span style="${MONO};font-size:11px;color:#8b9ab4;">${statsLine}</span>
    </div>
    ${resultsList(results)}
  </div>`;
}

function rankBadge(i: number): string {
  return `<span style="${MONO};font-size:15px;font-weight:800;color:${MEDAL[i] ?? '#5f6f8a'};">#${i + 1}</span>`;
}

function newcomersSection(list: WrappedNewcomer[]): string {
  if (list.length === 0) return '';
  return wrappedSection('#4ade80', 'Beste Newcomer', 'erste Saison', list.map((n, i) => detailRow(
    rankBadge(i), n.rider,
    `Saison-UCI ${n.seasonUciRank != null ? '#' + n.seasonUciRank : '—'} · ${n.wins} Siege · ${n.uciPoints.toLocaleString('de-DE')} UCI`,
    n.bestResults,
  )).join(''));
}

function tierLabel(t: number): string {
  return t === 1 ? 'Neu · Nr. 1 All-Time' : `Neu in Top ${t} All-Time`;
}

function legendsSection(list: WrappedLegend[]): string {
  if (list.length === 0) return '';
  return wrappedSection('#a855f7', 'Legenden', 'neu in der All-Time-UCI-Elite', list.map((l) => detailRow(
    `<span style="${MONO};font-size:9px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#d8b4fe;border:1px solid rgba(168,85,247,.5);background:rgba(168,85,247,.14);border-radius:6px;padding:3px 8px;">${esc(tierLabel(l.newTier))}</span>`,
    l.rider,
    `#${l.allTimeUciRank} All-Time-UCI · ${l.careerWins} Karrieresiege · ${l.allTimeUciPoints.toLocaleString('de-DE')} UCI`,
    l.bestResults,
  )).join(''));
}

function retireesSection(list: WrappedRetiree[]): string {
  if (list.length === 0) return '';
  return wrappedSection('#94a3b8', 'In den Ruhestand', 'Top 5 nach All-Time-UCI', list.map((r, i) => detailRow(
    rankBadge(i), r.rider,
    `${r.allTimeUciRank != null ? '#' + r.allTimeUciRank + ' All-Time-UCI · ' : ''}${r.careerWins} Karrieresiege · ${r.allTimeUciPoints.toLocaleString('de-DE')} UCI`,
    r.bestResults,
  )).join(''));
}

function buildHtml(w: SeasonWrappedPayload): string {
  return `
    <div style="max-width:1000px;margin:0 auto;padding:36px 22px 40px;">
      <div style="${MONO};font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#22d3ee;">Velo · Saison-Rückblick</div>
      <h1 style="font-size:34px;font-weight:800;letter-spacing:-.02em;margin:.35rem 0 .3rem;">Saison ${w.season}</h1>
      <p style="color:#8b9ab4;font-size:13.5px;max-width:64ch;margin:0;">Die Höhepunkte der abgelaufenen Saison — bevor der Draft die Karten neu mischt.</p>

      ${sectionTitle('Jahressieger · Große Rennen')}
      ${winnersSections(w.raceWinners)}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start;">
        ${wrappedSection('#fbbf24', 'Meiste Siege · Fahrer', '', statRows(w.topRidersByWins.map((e: WrappedWinsEntry) => ({ label: riderChip(e.rider), sub: `${e.wins}` }))))}
        ${wrappedSection('#fbbf24', 'Meiste Siege · Teams', '', statRows(w.topTeamsByWins.map((t) => ({ label: teamChip(t), sub: `${t.value}` }))))}
        ${wrappedSection('#22d3ee', 'Meiste Punkte · Fahrer', '', statRows(w.topRidersByPoints.map((e) => ({ label: riderChip(e.rider), sub: e.points.toLocaleString('de-DE') }))))}
        ${wrappedSection('#22d3ee', 'Meiste Punkte · Teams', '', statRows(w.topTeamsByPoints.map((t) => ({ label: teamChip(t), sub: t.value.toLocaleString('de-DE') }))))}
      </div>

      ${newcomersSection(w.bestNewcomers)}
      ${legendsSection(w.legends)}
      ${retireesSection(w.retirees)}

      <div style="display:flex;justify-content:center;margin-top:34px;">
        <button id="season-wrapped-continue" style="${MONO};font-size:13px;font-weight:800;letter-spacing:.04em;color:#04222b;background:linear-gradient(135deg,#22d3ee,#0891b2);border:none;border-radius:10px;padding:13px 28px;cursor:pointer;">Weiter zum Draft →</button>
      </div>
    </div>`;
}

let overlay: HTMLDivElement | null = null;

export async function showSeasonWrapped(season: number): Promise<void> {
  let payload: SeasonWrappedPayload | null = null;
  try {
    const res = await api.getSeasonWrapped(season);
    if (res.success && res.data) payload = res.data;
  } catch { /* still zeigen wir nichts, wenn es fehlschlaegt */ }
  if (!payload) return;
  // Nichts Nennenswertes -> ueberspringen.
  if (payload.raceWinners.length === 0 && payload.topRidersByWins.length === 0) return;

  return new Promise<void>((resolve) => {
    overlay = document.createElement('div');
    overlay.id = 'season-wrapped-overlay';
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:7000;overflow-y:auto;color:#e6ecf6;font-family:Archivo,system-ui,sans-serif;' +
      'background:radial-gradient(1200px 640px at 82% -12%,rgba(34,211,238,.08),transparent 60%),#080e1a;';
    overlay.innerHTML = buildHtml(payload!);
    document.body.appendChild(overlay);
    const done = () => { overlay?.remove(); overlay = null; resolve(); };
    overlay.querySelector<HTMLButtonElement>('#season-wrapped-continue')?.addEventListener('click', done);
  });
}
