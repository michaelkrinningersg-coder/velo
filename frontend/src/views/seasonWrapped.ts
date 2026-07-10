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

function podium(entries: Array<{ label: string; sub: string }>): string {
  if (entries.length === 0) return `<div style="color:#5f6f8a;font-size:12.5px;">–</div>`;
  return `<div style="display:flex;flex-direction:column;gap:8px;">${entries.map((e, i) => `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 13px;border:1px solid ${i === 0 ? MEDAL[0] + '55' : '#1e2c49'};border-radius:10px;background:${i === 0 ? 'rgba(251,191,36,.05)' : '#0b1120'};">
      <span style="${MONO};font-size:18px;font-weight:800;color:${MEDAL[i] ?? '#5f6f8a'};width:22px;text-align:center;flex:none;">${i + 1}</span>
      <span style="flex:1;min-width:0;">${e.label}</span>
      <span style="${MONO};font-size:15px;font-weight:800;color:#fbbf24;flex:none;">${e.sub}</span>
    </div>`).join('')}</div>`;
}

function teamChip(t: WrappedTeamStat): string {
  return `<span style="display:inline-flex;align-items:center;gap:8px;min-width:0;">${renderMiniJersey(t.teamId, t.teamName)}<span style="font-weight:700;color:#e6ecf6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(t.teamName ?? '—')}</span></span>`;
}

function resultsList(results: WrappedCareerResult[]): string {
  if (!results.length) return '';
  return `<div style="margin-top:10px;display:flex;flex-direction:column;gap:4px;">${results.map((b) => `
    <div style="display:flex;align-items:center;gap:9px;${MONO};font-size:10.5px;color:#8b9ab4;">
      <span style="color:#22d3ee;font-weight:800;width:52px;">${b.points} P</span>
      <span style="flex:1;color:#cbd5e1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(b.raceName)}</span>
      <span style="color:#5f6f8a;">${esc(b.type)} · P${b.rank} · ${b.season}</span>
    </div>`).join('')}</div>`;
}

function detailCard(badge: string, rider: PalmaresRiderRef, statsLine: string, results: WrappedCareerResult[], accent?: string): string {
  return `<div style="border:1px solid ${accent ? accent + '55' : '#1e2c49'};border-radius:12px;background:${accent ? 'rgba(168,85,247,.04)' : '#0b1120'};padding:13px 15px;margin-bottom:10px;">
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
  return sectionTitle('Beste Newcomer · erste Saison') + list.map((n, i) => detailCard(
    rankBadge(i), n.rider,
    `Saison-UCI ${n.seasonUciRank != null ? '#' + n.seasonUciRank : '—'} · ${n.wins} Siege · ${n.uciPoints.toLocaleString('de-DE')} UCI`,
    n.bestResults,
  )).join('');
}

function tierLabel(t: number): string {
  return t === 1 ? 'Neu · Nr. 1 All-Time' : `Neu in Top ${t} All-Time`;
}

function legendsSection(list: WrappedLegend[]): string {
  if (list.length === 0) return '';
  return sectionTitle('Legenden · neu in der All-Time-UCI-Elite') + list.map((l) => detailCard(
    `<span style="${MONO};font-size:9px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#d8b4fe;border:1px solid rgba(168,85,247,.5);background:rgba(168,85,247,.14);border-radius:6px;padding:3px 8px;">${esc(tierLabel(l.newTier))}</span>`,
    l.rider,
    `#${l.allTimeUciRank} All-Time-UCI · ${l.careerWins} Karrieresiege · ${l.allTimeUciPoints.toLocaleString('de-DE')} UCI`,
    l.bestResults, '#a855f7',
  )).join('');
}

function retireesSection(list: WrappedRetiree[]): string {
  if (list.length === 0) return '';
  return sectionTitle('In den Ruhestand · Top 5 nach All-Time-UCI') + list.map((r, i) => detailCard(
    rankBadge(i), r.rider,
    `${r.allTimeUciRank != null ? '#' + r.allTimeUciRank + ' All-Time-UCI · ' : ''}${r.careerWins} Karrieresiege · ${r.allTimeUciPoints.toLocaleString('de-DE')} UCI`,
    r.bestResults,
  )).join('');
}

function buildHtml(w: SeasonWrappedPayload): string {
  return `
    <div style="max-width:1000px;margin:0 auto;padding:36px 22px 40px;">
      <div style="${MONO};font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#22d3ee;">Velo · Saison-Rückblick</div>
      <h1 style="font-size:34px;font-weight:800;letter-spacing:-.02em;margin:.35rem 0 .3rem;">Saison ${w.season}</h1>
      <p style="color:#8b9ab4;font-size:13.5px;max-width:64ch;margin:0;">Die Höhepunkte der abgelaufenen Saison — bevor der Draft die Karten neu mischt.</p>

      ${sectionTitle('Jahressieger · Große Rennen')}
      ${winnersSections(w.raceWinners)}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;">
        <div>${sectionTitle('Meiste Siege · Fahrer')}${podium(w.topRidersByWins.map((e: WrappedWinsEntry) => ({ label: riderChip(e.rider), sub: `${e.wins}` })))}</div>
        <div>${sectionTitle('Meiste Siege · Teams')}${podium(w.topTeamsByWins.map((t) => ({ label: teamChip(t), sub: `${t.value}` })))}</div>
      </div>

      ${sectionTitle('Meiste Punkte · Teams')}
      <div style="max-width:520px;">${podium(w.topTeamsByPoints.map((t) => ({ label: teamChip(t), sub: t.value.toLocaleString('de-DE') })))}</div>

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
