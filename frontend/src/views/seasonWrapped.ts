import { api } from '../api';
import { esc, renderFlag, renderMiniJersey } from '../state';
import { resolveRaceCategoryBadgeStyle } from '../riderStatsUi';
import type {
  SeasonWrappedPayload, PalmaresRiderRef, RaceWinnerEntry, WrappedCareerResult,
  WrappedWinsEntry, WrappedTeamStat, WrappedNewcomer, WrappedRetiree, WrappedLegend,
  WrappedFallenLegend,
} from '../../../shared/types';

// Saison-Rückblick ("Wrapped") als Vollbild-Overlay, gezeigt beim Jahreswechsel
// direkt vor dem Draft. Die Promise löst auf, wenn der Nutzer weitergeht.

const MONO = "font-family:'JetBrains Mono',monospace";
const MEDAL = ['#fbbf24', '#cbd5e1', '#cd7c3b'];

const LINK = 'background:none;border:none;padding:0;margin:0;font:inherit;cursor:pointer;text-align:left;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
function riderChip(r: PalmaresRiderRef | null, bold = true): string {
  if (!r) return '<span style="color:#5f6f8a;">–</span>';
  const name = `<button type="button" class="app-rider-link" data-rider-id="${r.riderId}" style="${LINK}font-weight:${bold ? 700 : 500};color:#e6ecf6;">${esc(r.firstName)} ${esc(r.lastName)}</button>`;
  return `<span style="display:inline-flex;align-items:center;gap:7px;min-width:0;">${renderFlag(r.countryCode ?? '')}${name}${renderMiniJersey(r.teamId, r.teamName)}</span>`;
}

function sectionTitle(label: string): string {
  return `<div style="display:flex;align-items:center;gap:12px;margin:30px 0 14px;${MONO};font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#5f6f8a;"><span>${esc(label)}</span><span style="flex:1;height:1px;background:#14203a;"></span></div>`;
}

// Jahressieger in EXAKT demselben Format wie die Season-Standings-
// Jahresuebersicht (Prestige-Stufen mit Sieger/2./3. in Spalten).
const WINNER_TIERS: Array<{ ids: number[]; label: string; color: string }> = [
  { ids: [10, 11], label: '🌈 Weltmeisterschaft', color: '#ec4899' },
  { ids: [12, 13], label: '⭐ Europameisterschaft', color: '#3b82f6' },
  { ids: [28, 29], label: '🌏 Asien-Ozeanien-Meisterschaft', color: '#06b6d4' },
  { ids: [34, 35], label: '🌎 Amerika-Meisterschaft', color: '#ef4444' },
  { ids: [40, 41], label: '🌍 Afrika-Meisterschaft', color: '#f59e0b' },
  { ids: [24, 25], label: '🥇 Olympische Spiele', color: '#fbbf24' },
  { ids: [1], label: 'Tour de France', color: resolveRaceCategoryBadgeStyle('Tour de France').color },
  { ids: [2], label: 'Grand Tours', color: resolveRaceCategoryBadgeStyle('Grand Tour').color },
  { ids: [3], label: 'Monumente', color: resolveRaceCategoryBadgeStyle('Monument').color },
  { ids: [4], label: 'World Tour High', color: resolveRaceCategoryBadgeStyle('Stage Race High').color },
  { ids: [7], label: 'One Day High', color: resolveRaceCategoryBadgeStyle('One Day High').color },
];

function winnerCell(ref: PalmaresRiderRef | null, medalColor: string): string {
  if (!ref) return '<span style="color:#4a5a75;font-size:13px;">–</span>';
  const name = `<button type="button" class="app-rider-link" data-rider-id="${ref.riderId}" style="${LINK}font-weight:${medalColor === '#facc15' ? 800 : 600};color:#e8eef7;">${esc(ref.lastName)}</button>`;
  return `<span style="display:inline-flex;align-items:center;gap:7px;min-width:0;border-left:2px solid ${medalColor};padding-left:8px;">${renderFlag(ref.countryCode ?? '')}${name}${renderMiniJersey(ref.teamId, ref.teamName)}</span>`;
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

// Ergebnisliste nach RENNEN gruppiert (Rennen nach Prestige absteigend, innerhalb
// eines Rennens zuerst die Wertungen, dann die Etappen/Eintagesergebnisse — die
// Reihenfolge liefert das Backend). Ein Rennen-Kopf je Gruppe, darunter die
// Ergebniszeilen ohne wiederholten Rennnamen. Fuer Legenden/Retirees/
// Herausgefallene (bis zu 100 Ergebnisse).
function groupedResultsList(results: WrappedCareerResult[]): string {
  if (!results.length) return '';
  const groups: Array<{ raceName: string; rows: WrappedCareerResult[] }> = [];
  for (const r of results) {
    const last = groups[groups.length - 1];
    if (last && last.raceName === r.raceName) last.rows.push(r);
    else groups.push({ raceName: r.raceName, rows: [r] });
  }
  const resultRow = (b: WrappedCareerResult): string => `
    <div style="display:flex;align-items:center;gap:9px;${MONO};font-size:10.5px;color:#8b9ab4;padding-left:10px;">
      <span style="color:#22d3ee;font-weight:800;width:52px;">${b.points} P</span>
      <span style="flex:1;color:${b.isClassification ? '#e9d5ff' : '#cbd5e1'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${b.count > 1 ? `<span style="color:#fbbf24;font-weight:800;">${b.count}×</span> ` : ''}${esc(b.type)}</span>
      <span style="color:#5f6f8a;">P<span style="color:${rankColor(b.rank)};font-weight:${b.rank <= 3 ? 800 : 700};">${b.rank}</span></span>
    </div>`;
  return `<div style="margin-top:10px;display:flex;flex-direction:column;gap:7px;">${groups.map((g) => `
    <div style="display:flex;flex-direction:column;gap:3px;">
      <div style="${MONO};font-size:10px;font-weight:800;letter-spacing:.04em;color:#cbd5e1;border-left:2px solid #22d3ee;padding-left:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(g.raceName)}</div>
      ${g.rows.map(resultRow).join('')}
    </div>`).join('')}</div>`;
}

// Fahrer-Zeile mit verschachtelter Ergebnisliste, als Tabellenzeile einer Sektion.
// grouped = true rendert die Ergebnisse nach Rennen gruppiert (Legenden/Retirees/
// Herausgefallene mit bis zu 100 Ergebnissen); sonst flach (Newcomer, Top 10).
function detailRow(badge: string, rider: PalmaresRiderRef, statsLine: string, results: WrappedCareerResult[], subLine = '', grouped = false): string {
  return `<div style="padding:12px 14px;border-top:1px solid #14203a;">
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
      ${badge}
      <span style="flex:1;min-width:160px;font-size:15px;">${riderChip(rider)}</span>
      <span style="${MONO};font-size:11px;color:#8b9ab4;">${statsLine}</span>
    </div>
    ${subLine ? `<div style="${MONO};font-size:10px;color:#6a7a95;margin-top:5px;">${subLine}</div>` : ''}
    ${grouped ? groupedResultsList(results) : resultsList(results)}
  </div>`;
}

// Highlight-Zeile (Label · Fahrer/Team · Wert) fuer Ueberraschung/Rekorde.
function highlightRow(label: string, entity: string, detail: string, value: string): string {
  return `<div style="display:grid;grid-template-columns:minmax(140px,200px) 1fr auto;align-items:center;gap:12px;padding:12px 14px;border-top:1px solid #14203a;">
    <span style="${MONO};font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#8b9ab4;">${esc(label)}</span>
    <span style="min-width:0;display:flex;align-items:center;gap:9px;flex-wrap:wrap;">${entity}${detail ? `<span style="${MONO};font-size:10px;color:#6a7a95;">${esc(detail)}</span>` : ''}</span>
    <span style="${MONO};font-size:15px;font-weight:800;color:#fbbf24;">${esc(value)}</span>
  </div>`;
}

function surpriseSection(s: SeasonWrappedPayload['surprise']): string {
  const rows: string[] = [];
  if (s.lowestOvrWinner) rows.push(highlightRow('Underdog-Sieg', riderChip(s.lowestOvrWinner.rider), s.lowestOvrWinner.raceName, `OVR ${s.lowestOvrWinner.value}`));
  if (s.youngestMonumentWinner) rows.push(highlightRow('Jüngster Monument-Sieger', riderChip(s.youngestMonumentWinner.rider), s.youngestMonumentWinner.raceName, `${s.youngestMonumentWinner.value} J`));
  if (rows.length === 0) return '';
  return wrappedSection('#f97316', 'Überraschung des Jahres', '', rows.join(''));
}

function recordsSection(r: SeasonWrappedPayload['records']): string {
  const rows: string[] = [];
  if (r.mostWins) rows.push(highlightRow('Meiste Siege', riderChip(r.mostWins.rider), '', `${r.mostWins.wins} Siege`));
  if (r.teamDominance) rows.push(highlightRow('Dominantestes Team', teamChip(r.teamDominance.team), 'Punktevorsprung', `+${r.teamDominance.lead.toLocaleString('de-DE')}`));
  if (r.longestStreak) rows.push(highlightRow('Längste Siegesserie', riderChip(r.longestStreak.rider), 'Renntags-Siege in Folge', `${r.longestStreak.streak}×`));
  if (rows.length === 0) return '';
  return wrappedSection('#22d3ee', 'Rekorde der Saison', '', rows.join(''));
}

function careerLine(r: WrappedRetiree): string {
  const parts: string[] = [];
  if (r.careerFromSeason != null) parts.push(`Karriere ${r.careerFromSeason}–${r.careerToSeason}`);
  parts.push(`${r.grandTourWins} GT-Siege`);
  parts.push(`${r.monumentWins} Monument-Siege`);
  return '▪ ' + parts.join(' · ');
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
    `${l.age != null ? l.age + ' J · ' : ''}#${l.allTimeUciRank} All-Time-UCI · ${l.careerWins} Karrieresiege · ${l.allTimeUciPoints.toLocaleString('de-DE')} UCI`,
    l.bestResults,
    '',
    true,
  )).join(''));
}

function retireesSection(list: WrappedRetiree[]): string {
  if (list.length === 0) return '';
  return wrappedSection('#94a3b8', 'In den Ruhestand', 'Top 5 nach All-Time-UCI', list.map((r, i) => detailRow(
    rankBadge(i), r.rider,
    `${r.allTimeUciRank != null ? '#' + r.allTimeUciRank + ' All-Time-UCI · ' : ''}${r.careerWins} Karrieresiege · ${r.allTimeUciPoints.toLocaleString('de-DE')} UCI`,
    r.bestResults,
    careerLine(r),
    true,
  )).join(''));
}

// Herausgefallene Legenden: bis zur Vorsaison in den Top 25 All-Time, jetzt
// dahinter. Eigene Seite mit denselben Details wie Retirees/Legenden.
function fallenLegendsSection(list: WrappedFallenLegend[]): string {
  if (list.length === 0) return '';
  return wrappedSection('#f43f5e', 'Aus den Top 25 gefallen', 'nicht mehr in der All-Time-UCI-Elite', list.map((r) => detailRow(
    `<span style="${MONO};font-size:9px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#fda4af;border:1px solid rgba(244,63,94,.5);background:rgba(244,63,94,.14);border-radius:6px;padding:3px 8px;">#${r.previousRank} → ${r.currentRank != null ? '#' + r.currentRank : 'raus'}</span>`,
    r.rider,
    `${r.currentRank != null ? '#' + r.currentRank + ' All-Time-UCI · ' : ''}${r.careerWins} Karrieresiege · ${r.allTimeUciPoints.toLocaleString('de-DE')} UCI`,
    r.bestResults,
    fallenCareerLine(r),
    true,
  )).join(''));
}

function fallenCareerLine(r: WrappedFallenLegend): string {
  const parts: string[] = [];
  if (r.careerFromSeason != null) parts.push(`Karriere ${r.careerFromSeason}–${r.careerToSeason}`);
  parts.push(`${r.grandTourWins} GT-Siege`);
  parts.push(`${r.monumentWins} Monument-Siege`);
  return '▪ ' + parts.join(' · ');
}

function overviewGrid(...sections: string[]): string {
  return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start;">${sections.join('')}</div>`;
}

function introBody(w: SeasonWrappedPayload): string {
  return `<div style="text-align:center;padding:8vh 0 4vh;">
    <div style="${MONO};font-size:12px;letter-spacing:.32em;text-transform:uppercase;color:#22d3ee;">Velo · Saison-Rückblick</div>
    <div style="font-size:clamp(48px,9vw,86px);font-weight:800;letter-spacing:-.03em;margin:.15em 0 .12em;background:linear-gradient(120deg,#22d3ee,#a855f7 60%,#fbbf24);-webkit-background-clip:text;background-clip:text;color:transparent;">Saison ${w.season}</div>
    <p style="color:#8b9ab4;font-size:14px;max-width:54ch;margin:0 auto;line-height:1.55;">Die Höhepunkte der abgelaufenen Saison — bevor der Draft die Karten neu mischt. Blättere mit ‹ › oder den Pfeiltasten.</p>
  </div>`;
}

interface WrappedSlide { body: string; }
function buildSlides(w: SeasonWrappedPayload): WrappedSlide[] {
  const slides: WrappedSlide[] = [{ body: introBody(w) }];
  const push = (body: string) => { if (body) slides.push({ body }); };
  push(winnersSections(w.raceWinners));
  push(overviewGrid(
    wrappedSection('#fbbf24', 'Meiste Siege · Fahrer', '', statRows(w.topRidersByWins.map((e) => ({ label: riderChip(e.rider), sub: `${e.wins}` })))),
    wrappedSection('#fbbf24', 'Meiste Siege · Teams', '', statRows(w.topTeamsByWins.map((t) => ({ label: teamChip(t), sub: `${t.value}` })))),
  ));
  push(overviewGrid(
    wrappedSection('#22d3ee', 'Meiste Punkte · Fahrer', '', statRows(w.topRidersByPoints.map((e) => ({ label: riderChip(e.rider), sub: e.points.toLocaleString('de-DE') })))),
    wrappedSection('#22d3ee', 'Meiste Punkte · Teams', '', statRows(w.topTeamsByPoints.map((t) => ({ label: teamChip(t), sub: t.value.toLocaleString('de-DE') })))),
  ));
  push(surpriseSection(w.surprise));
  push(recordsSection(w.records));
  push(newcomersSection(w.bestNewcomers));
  push(legendsSection(w.legends));
  push(fallenLegendsSection(w.fallenLegends));
  push(retireesSection(w.retirees));
  return slides;
}

let overlay: HTMLDivElement | null = null;

// Story-Modus: ein Abschnitt pro Slide, mit Prev/Next, Fortschrittspunkten,
// Tastatur (Pfeile) und "Überspringen". Loest auf, wenn der Nutzer weitergeht.
export async function showSeasonWrapped(season: number): Promise<void> {
  let payload: SeasonWrappedPayload | null = null;
  try {
    const res = await api.getSeasonWrapped(season);
    if (res.success && res.data) payload = res.data;
  } catch { /* still zeigen wir nichts, wenn es fehlschlaegt */ }
  if (!payload) return;
  if (payload.raceWinners.length === 0 && payload.topRidersByWins.length === 0) return;
  const slides = buildSlides(payload);

  return new Promise<void>((resolve) => {
    let idx = 0;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const riderStatsEl = document.getElementById('modal-riderStats');

    overlay = document.createElement('div');
    overlay.id = 'season-wrapped-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:7000;display:flex;flex-direction:column;color:#e6ecf6;'
      + 'font-family:Archivo,system-ui,sans-serif;background:radial-gradient(1200px 640px at 82% -12%,rgba(34,211,238,.08),transparent 60%),#080e1a;';
    overlay.innerHTML = `
      <div id="ws-content" style="flex:1;overflow-y:auto;"></div>
      <div style="flex:none;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 22px;border-top:1px solid #14203a;background:#0b1120;">
        <button id="ws-skip" style="${MONO};font-size:11px;color:#8b9ab4;background:none;border:1px solid #1e2c49;border-radius:8px;padding:8px 14px;cursor:pointer;">Überspringen</button>
        <div id="ws-dots" style="display:flex;gap:7px;align-items:center;"></div>
        <div style="display:flex;gap:8px;">
          <button id="ws-prev" style="${MONO};font-size:14px;font-weight:800;color:#8b9ab4;background:#0c1526;border:1px solid #1e2c49;border-radius:8px;padding:8px 15px;cursor:pointer;">‹</button>
          <button id="ws-next" style="${MONO};font-size:13px;font-weight:800;color:#04222b;background:linear-gradient(135deg,#22d3ee,#0891b2);border:none;border-radius:8px;padding:9px 18px;cursor:pointer;"></button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    // riderStats-Modal ueber das Overlay heben, damit klickbare Namen sichtbar sind.
    if (riderStatsEl) riderStatsEl.style.zIndex = '8000';

    const content = overlay.querySelector<HTMLElement>('#ws-content')!;
    const dotsEl = overlay.querySelector<HTMLElement>('#ws-dots')!;
    const prevBtn = overlay.querySelector<HTMLButtonElement>('#ws-prev')!;
    const nextBtn = overlay.querySelector<HTMLButtonElement>('#ws-next')!;

    const done = () => {
      if (riderStatsEl) riderStatsEl.style.zIndex = '';
      document.removeEventListener('keydown', onKey);
      overlay?.remove(); overlay = null; resolve();
    };
    const render = () => {
      const eyebrow = idx === 0 ? '' : `<div style="${MONO};font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#22d3ee;margin-bottom:14px;">Saison ${payload!.season} · ${idx}/${slides.length - 1}</div>`;
      content.innerHTML = `<div style="max-width:1000px;margin:0 auto;padding:34px 22px 30px;">${eyebrow}${slides[idx].body}</div>`;
      content.scrollTop = 0;
      if (!reduce) { content.style.opacity = '0'; requestAnimationFrame(() => { content.style.transition = 'opacity .28s ease'; content.style.opacity = '1'; }); }
      dotsEl.innerHTML = slides.map((_, i) => `<span data-dot="${i}" style="width:${i === idx ? 20 : 8}px;height:8px;border-radius:99px;background:${i === idx ? '#22d3ee' : '#26364f'};cursor:pointer;transition:width .2s;"></span>`).join('');
      prevBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';
      nextBtn.textContent = idx === slides.length - 1 ? 'Weiter zum Draft →' : 'Weiter ›';
    };
    const go = (n: number) => { idx = Math.max(0, Math.min(slides.length - 1, n)); render(); };
    const next = () => { if (idx === slides.length - 1) done(); else go(idx + 1); };
    const onKey = (e: KeyboardEvent) => {
      if (riderStatsEl && !riderStatsEl.classList.contains('hidden')) return; // riderStats offen -> Pfeile ignorieren
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
    };
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', () => go(idx - 1));
    overlay.querySelector<HTMLButtonElement>('#ws-skip')!.addEventListener('click', done);
    dotsEl.addEventListener('click', (e) => { const d = (e.target as HTMLElement).closest<HTMLElement>('[data-dot]'); if (d) go(Number(d.dataset['dot'])); });
    document.addEventListener('keydown', onKey);
    render();
  });
}
