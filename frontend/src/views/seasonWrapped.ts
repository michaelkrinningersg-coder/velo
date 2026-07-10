import { api } from '../api';
import { esc, renderFlag, renderMiniJersey } from '../state';
import { resolveRaceCategoryBadgeStyle } from '../riderStatsUi';
import type {
  SeasonWrappedPayload, PalmaresRiderRef, RaceWinnerEntry,
  WrappedWinsEntry, WrappedTeamStat, WrappedNewcomer, WrappedRetiree,
} from '../../../shared/types';

// Saison-Rückblick ("Wrapped") als Vollbild-Overlay, gezeigt beim Jahreswechsel
// direkt vor dem Draft. Die Promise löst auf, wenn der Nutzer weitergeht.

const MONO = "font-family:'JetBrains Mono',monospace";
const MEDAL = ['#fbbf24', '#cbd5e1', '#cd7c3b'];

function riderChip(r: PalmaresRiderRef | null, bold = true): string {
  if (!r) return '<span style="color:#5f6f8a;">–</span>';
  return `<span style="display:inline-flex;align-items:center;gap:7px;min-width:0;">${renderFlag(r.countryCode ?? '')}<span style="font-weight:${bold ? 700 : 500};color:#e6ecf6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(r.firstName)} ${esc(r.lastName)}</span>${renderMiniJersey(r.teamId, r.teamName)}</span>`;
}

function catBadge(categoryId: number): string {
  const name = categoryId === 1 ? 'Tour de France' : categoryId === 2 ? 'Grand Tour' : categoryId === 3 ? 'Monument' : categoryId === 4 ? 'Stage Race High' : 'One Day High';
  const s = resolveRaceCategoryBadgeStyle(name);
  return `<span style="${MONO};font-size:8px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:${s.color};border:1px solid ${s.border};background:${s.background};border-radius:5px;padding:2px 7px;white-space:nowrap;">${esc(name.replace('Stage Race High', 'WT High'))}</span>`;
}

function sectionTitle(label: string): string {
  return `<div style="display:flex;align-items:center;gap:12px;margin:30px 0 14px;${MONO};font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#5f6f8a;"><span>${esc(label)}</span><span style="flex:1;height:1px;background:#14203a;"></span></div>`;
}

function winnersGrid(winners: RaceWinnerEntry[]): string {
  if (winners.length === 0) return `<div style="color:#5f6f8a;font-size:12.5px;padding:8px 0;">Keine großen Rennen gewertet.</div>`;
  return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;">${winners.map((w) => `
    <div style="border:1px solid #1e2c49;border-radius:10px;background:#0b1120;padding:11px 13px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">${catBadge(w.categoryId)}<span style="font-weight:700;font-size:12.5px;color:#e6ecf6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(w.raceName)}</span></div>
      ${riderChip(w.winner)}
    </div>`).join('')}</div>`;
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

function newcomers(list: WrappedNewcomer[]): string {
  if (list.length === 0) return `<div style="color:#5f6f8a;font-size:12.5px;">Keine Newcomer mit Punkten.</div>`;
  return podium(list.map((n) => ({ label: riderChip(n.rider), sub: `${n.uciPoints.toLocaleString('de-DE')} UCI` })));
}

function retirees(list: WrappedRetiree[]): string {
  if (list.length === 0) return '';
  const rows = list.map((r, i) => `
    <div style="border:1px solid #1e2c49;border-radius:12px;background:#0b1120;padding:13px 15px;margin-bottom:10px;">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <span style="${MONO};font-size:15px;font-weight:800;color:${MEDAL[i] ?? '#5f6f8a'};">#${i + 1}</span>
        <span style="flex:1;min-width:160px;font-size:15px;">${riderChip(r.rider)}</span>
        <span style="${MONO};font-size:11px;color:#8b9ab4;">${r.allTimeUciPoints.toLocaleString('de-DE')} All-Time-UCI · ${r.careerWins} Karrieresiege</span>
      </div>
      ${r.bestResults.length ? `<div style="margin-top:10px;display:flex;flex-direction:column;gap:4px;">${r.bestResults.map((b) => `
        <div style="display:flex;align-items:center;gap:9px;${MONO};font-size:10.5px;color:#8b9ab4;">
          <span style="color:#22d3ee;font-weight:800;width:52px;">${b.points} P</span>
          <span style="flex:1;color:#cbd5e1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(b.raceName)}</span>
          <span style="color:#5f6f8a;">${b.type} · P${b.rank} · ${b.season}</span>
        </div>`).join('')}</div>` : ''}
    </div>`).join('');
  return sectionTitle('In den Ruhestand · Top 5 nach All-Time-UCI') + rows;
}

function buildHtml(w: SeasonWrappedPayload): string {
  return `
    <div style="max-width:1000px;margin:0 auto;padding:36px 22px 40px;">
      <div style="${MONO};font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#22d3ee;">Velo · Saison-Rückblick</div>
      <h1 style="font-size:34px;font-weight:800;letter-spacing:-.02em;margin:.35rem 0 .3rem;">Saison ${w.season}</h1>
      <p style="color:#8b9ab4;font-size:13.5px;max-width:64ch;margin:0;">Die Höhepunkte der abgelaufenen Saison — bevor der Draft die Karten neu mischt.</p>

      ${sectionTitle('Jahressieger · Große Rennen')}
      ${winnersGrid(w.raceWinners)}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;">
        <div>${sectionTitle('Meiste Siege · Fahrer')}${podium(w.topRidersByWins.map((e: WrappedWinsEntry) => ({ label: riderChip(e.rider), sub: `${e.wins}` })))}</div>
        <div>${sectionTitle('Meiste Siege · Teams')}${podium(w.topTeamsByWins.map((t) => ({ label: teamChip(t), sub: `${t.value}` })))}</div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;">
        <div>${sectionTitle('Meiste Punkte · Teams')}${podium(w.topTeamsByPoints.map((t) => ({ label: teamChip(t), sub: t.value.toLocaleString('de-DE') })))}</div>
        <div>${sectionTitle('Beste Newcomer')}${newcomers(w.bestNewcomers)}</div>
      </div>

      ${retirees(w.retirees)}

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
