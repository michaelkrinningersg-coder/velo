import { api } from '../api';
import { esc, renderFlag, renderMiniJersey, renderRaceNameLink } from '../state';
import { resolveRaceCategoryBadgeStyle } from '../riderStatsUi';
import type {
  SeasonWrappedPayload, PalmaresRiderRef, RaceWinnerEntry, WrappedCareerResult,
  WrappedWinsEntry, WrappedTeamStat, WrappedNewcomer, WrappedRetiree, WrappedLegend,
  WrappedFallenLegend, WrappedPlayerTeam, WrappedProgression, WrappedRivalry,
  WrappedJerseyGroup, WrappedGrandTourClassifications, WrappedGrind,
  WrappedStrongestField, WrappedRiderPoints,
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

function winnersSections(
  winners: RaceWinnerEntry[],
  classifications: WrappedGrandTourClassifications[] = [],
): string {
  // Die Wertungstrikots gehoeren zum Rennen, nicht in eine eigene Liste: bei
  // einer Grand Tour sind Gruen, Berg und Nachwuchs eigene Titel.
  const wertungJeRennen = new Map(classifications.map((c) => [c.raceId, c]));
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
    const rows = races.map((w) => `<div style="border-top:1px solid #14203a;">
      <div style="display:grid;${COLS}padding:10px 14px;align-items:center;">
        <span style="font-weight:800;font-size:13px;color:#e8eef7;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${renderRaceNameLink(w.raceName, w.raceId)}</span>
        ${winnerCell(w.winner, '#facc15')}
        ${winnerCell(w.second, '#cbd5e1')}
        ${winnerCell(w.third, '#cd7c3b')}
      </div>
      ${classificationRow(wertungJeRennen.get(w.raceId))}
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
// `versatz` verschiebt die Nummerierung, damit eine lange Liste ueber zwei
// Spalten laufen kann, ohne rechts wieder bei 1 anzufangen. Medaillenfarbe und
// Zeilenhoehe haengen am ABSOLUTEN Platz, nicht an der Position in der Spalte.
//
// `einheitlich` nimmt den Plaetzen 1 bis 3 die groessere Schrift und den
// hoeheren Innenabstand. Noetig, sobald zwei Spalten nebeneinander stehen: die
// Podiumszeilen sind sonst hoeher als die uebrigen, und die rechte Spalte
// verrutscht gegen die linke. Die Medaillenfarbe bleibt — sie kostet keine Hoehe.
function statRows(
  entries: Array<{ label: string; sub: string; delta?: string }>,
  versatz = 0,
  einheitlich = false,
): string {
  if (entries.length === 0) return `<div style="padding:14px;color:#6a7a95;font-size:13px;">–</div>`;
  const mitDelta = entries.some((e) => e.delta);
  const spalten = mitDelta ? '30px 1fr auto 44px' : '34px 1fr auto';
  return entries.map((e, i) => {
    const platz = i + versatz;
    const podium = !einheitlich && platz < 3;
    return `<div style="display:grid;grid-template-columns:${spalten};align-items:center;gap:12px;padding:${podium ? 10 : 7}px 14px;border-top:1px solid #14203a;">
    <span style="${MONO};font-size:${podium ? 16 : 13}px;font-weight:800;color:${MEDAL[platz] ?? '#5f6f8a'};text-align:center;">${platz + 1}</span>
    <span style="min-width:0;">${e.label}</span>
    <span style="${MONO};font-size:${podium ? 15 : 13}px;font-weight:800;color:#fbbf24;">${e.sub}</span>
    ${mitDelta ? `<span style="text-align:right;">${e.delta ?? ''}</span>` : ''}
  </div>`;
  }).join('');
}

// Auf-/Abstieg gegenueber demselben Rang der Vorsaison. `previousRank` ist die
// Platzierung in der VOLLEN Rangliste des Vorjahres, nicht nur in deren Top 10 —
// sonst waere jeder ausserhalb faelschlich "neu".
function rankDelta(index: number, previousRank: number | null | undefined): string {
  const jetzt = index + 1;
  if (previousRank == null) {
    return `<span style="${MONO};font-size:9px;font-weight:800;letter-spacing:.08em;color:#4ade80;">NEU</span>`;
  }
  const diff = previousRank - jetzt;
  if (diff === 0) return `<span style="${MONO};font-size:10px;color:#4a5a75;">–</span>`;
  const hoch = diff > 0;
  return `<span style="${MONO};font-size:10px;font-weight:700;color:${hoch ? '#4ade80' : '#f87171'};">${hoch ? '▲' : '▼'}${Math.abs(diff)}</span>`;
}

const JERSEY_ICON: Record<string, { icon: string; color: string }> = {
  gc: { icon: '🟡', color: '#facc15' },
  points: { icon: '🟢', color: '#4ade80' },
  mountain: { icon: '🔴', color: '#f87171' },
  youth: { icon: '⚪', color: '#e2e8f0' },
};

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
      <span style="flex:1;color:#cbd5e1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${b.count > 1 ? `<span style="color:#fbbf24;font-weight:800;">${b.count}×</span> ` : ''}${renderRaceNameLink(b.raceName, null)}</span>
      <span style="color:#5f6f8a;">${esc(b.type)} · <span style="color:${rankColor(b.rank)};font-weight:${b.rank <= 3 ? 800 : 700};">P${b.rank}</span></span>
    </div>`).join('')}</div>`;
}

// Jahre einer Ergebnisgruppe: "2029, 2031 (2x)". Ohne das sagt "3x Etappe"
// nicht, wann — und die Zeitachse ist bei einer Karriere die halbe Geschichte.
function seasonsText(r: WrappedCareerResult): string {
  const jahre = r.seasons?.length ? r.seasons : [r.season];
  const text = jahre.join(', ');
  return jahre.length > 1 ? `${text} (${jahre.length}×)` : text;
}

// Siege zuerst, als eigener Block ueber der Liste. Wer eine Karriere aufruft,
// will in zwei Sekunden sehen, was der Fahrer gewonnen hat — nicht, wo er
// Zwoelfter wurde. Rennen nach Prestige, wie sie das Backend liefert.
// Ein Gesamtsieg ist ein Sieg, keine Nebenwertung. `isClassification` sagt nur,
// dass das Ergebnis auf `_final` endet — und das tut `gc_final` auch. Ohne diese
// Unterscheidung stuende der Toursieg als Nebenzeile neben dem Bergtrikot.
function istEchterSieg(r: WrappedCareerResult): boolean {
  return !r.isClassification || r.type === 'GC';
}

// Farbe nach Art des Ergebnisses: Siege gold und durchgezogen, Wertungen in der
// Farbe ihres Trikots und gestrichelt. Die Ebene "Sieg oder Wertung" traegt also
// die Farbfamilie, die genaue Art steht zusaetzlich als Text im Chip — sonst
// laegen GC und Etappe in zwei kaum unterscheidbaren Goldtoenen nebeneinander.
const SIEG_FARBE = '#fbbf24';
const WERTUNG_FARBE: Record<string, string> = {
  Punkte: '#4ade80',
  Berg: '#f87171',
  Nachwuchs: '#e2e8f0',
};

function typFarbe(r: WrappedCareerResult): string {
  return istEchterSieg(r) ? SIEG_FARBE : (WERTUNG_FARBE[r.type] ?? '#d8b4fe');
}

// Innerhalb eines Rennens: der Gesamtsieg zuerst, dann die uebrigen Siege, dann
// die Nebenwertungen. Nach Anzahl zu sortieren stellte fuenf Etappensiege vor
// den Toursieg.
const TYP_REIHENFOLGE = ['GC', 'Eintages', 'Etappe', 'Punkte', 'Berg', 'Nachwuchs'];
function typRang(r: WrappedCareerResult): number {
  const index = TYP_REIHENFOLGE.indexOf(r.type);
  return index < 0 ? TYP_REIHENFOLGE.length : index;
}

// "World Tour - Grand Tour" ist als Ueberschrift zu lang; der Teil vor dem
// Bindestrich ist die Ebene, dahinter steht, worum es geht.
function kategorieKurz(name: string | null): string {
  if (!name) return 'Sonstige';
  const teile = name.split(' - ');
  return (teile.length > 1 ? teile.slice(1).join(' - ') : name).trim();
}

interface SiegKategorie {
  name: string | null;
  prestige: number;
  rennen: Array<{ raceName: string; anzahl: number; teile: WrappedCareerResult[] }>;
}

// Siege nach Kategorie gruppiert, darin je Rennen eine Zeile mit der Gesamtzahl
// und den einzelnen Arten. Reihenfolge nach Prestige, wie sie das Backend
// liefert.
function siegeNachKategorie(gewonnen: WrappedCareerResult[]): SiegKategorie[] {
  const kategorien = new Map<string, SiegKategorie>();
  for (const eintrag of gewonnen) {
    const schluessel = eintrag.categoryName ?? '—';
    let kategorie = kategorien.get(schluessel);
    if (!kategorie) {
      kategorie = { name: eintrag.categoryName, prestige: eintrag.prestige, rennen: [] };
      kategorien.set(schluessel, kategorie);
    }
    kategorie.prestige = Math.max(kategorie.prestige, eintrag.prestige);
    let rennen = kategorie.rennen.find((eintragRennen) => eintragRennen.raceName === eintrag.raceName);
    if (!rennen) {
      rennen = { raceName: eintrag.raceName, anzahl: 0, teile: [] };
      kategorie.rennen.push(rennen);
    }
    rennen.anzahl += eintrag.count;
    rennen.teile.push(eintrag);
  }
  for (const kategorie of kategorien.values()) {
    kategorie.rennen.sort((a, b) => b.anzahl - a.anzahl || a.raceName.localeCompare(b.raceName));
    for (const rennen of kategorie.rennen) {
      rennen.teile.sort((a, b) => typRang(a) - typRang(b) || b.count - a.count);
    }
  }
  return [...kategorien.values()].sort((a, b) => b.prestige - a.prestige);
}

// Oberste Ebene der Siegbilanz: Gesamtsiege, Eintagesrennen, Etappensiege,
// Wertungen. Erst darunter wird nach Kategorie gruppiert.
//
// Vorher stand die Kategorie oben. Das beantwortete "wo hat er gewonnen", aber
// nicht die Frage, die man bei einem Ruecktritt zuerst stellt: was fuer ein
// Fahrer war das — Rundfahrer, Klassikerspezialist, Etappenjaeger?
type SiegGruppe = 'GC' | 'Eintages' | 'Etappe' | 'Wertung';

const SIEG_GRUPPEN: Array<{ key: SiegGruppe; label: string; farbe: string }> = [
  { key: 'GC', label: 'Gesamtsiege', farbe: '#fbbf24' },
  { key: 'Eintages', label: 'Eintagesrennen', farbe: '#fb923c' },
  { key: 'Etappe', label: 'Etappensiege', farbe: '#e2e8f0' },
  { key: 'Wertung', label: 'Wertungen', farbe: '#d8b4fe' },
];

function siegGruppe(r: WrappedCareerResult): SiegGruppe {
  if (!istEchterSieg(r)) return 'Wertung';
  if (r.type === 'GC') return 'GC';
  if (r.type === 'Eintages') return 'Eintages';
  return 'Etappe';
}

function winsBlock(results: WrappedCareerResult[]): string {
  const gewonnen = results.filter((r) => r.rank === 1);
  if (gewonnen.length === 0) return '';
  const zaehle = (liste: WrappedCareerResult[]) => liste.reduce((summe, r) => summe + r.count, 0);
  const anzahlSiege = zaehle(gewonnen.filter(istEchterSieg));
  const anzahlWertungen = zaehle(gewonnen.filter((r) => !istEchterSieg(r)));

  // Innerhalb der drei Sieg-Gruppen steht die Art schon in der Ueberschrift; nur
  // bei den Wertungen sagt der Chip noch etwas Neues (Punkte, Berg, Nachwuchs).
  const teilChip = (teil: WrappedCareerResult): string => {
    const farbe = typFarbe(teil);
    return `<span title="${esc(seasonsText(teil))}" style="display:inline-flex;align-items:center;gap:4px;${MONO};font-size:9.5px;font-weight:700;color:${farbe};border:1px solid ${farbe}44;background:${farbe}14;border-radius:5px;padding:2px 6px;border-style:dashed;">
      ${esc(teil.type)}${teil.count > 1 ? ` <span style="opacity:.75;">${teil.count}×</span>` : ''}
    </span>`;
  };

  const gruppen = SIEG_GRUPPEN.map((gruppe) => {
    const eintraege = gewonnen.filter((r) => siegGruppe(r) === gruppe.key);
    if (eintraege.length === 0) return '';
    const anzahl = zaehle(eintraege);
    const zeigeChips = gruppe.key === 'Wertung';

    const kategorien = siegeNachKategorie(eintraege).map((kategorie) => {
      const stil = resolveRaceCategoryBadgeStyle(kategorie.name);
      const zeilen = kategorie.rennen.map((rennen) => `<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:3px 0;">
        <span style="font-size:12.5px;font-weight:700;color:#e8eef7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;">${renderRaceNameLink(rennen.raceName, null)}</span>
        <span style="${MONO};font-size:11px;font-weight:800;color:${gruppe.farbe};">(${rennen.anzahl})</span>
        ${zeigeChips ? `<span style="display:inline-flex;gap:4px;flex-wrap:wrap;">${rennen.teile.map(teilChip).join('')}</span>` : ''}
        <span style="${MONO};font-size:9.5px;color:#5f6f8a;">${esc([...new Set(rennen.teile.flatMap((teil) => teil.seasons ?? [teil.season]))].sort((a, b) => a - b).join(', '))}</span>
      </div>`).join('');
      return `<div style="min-width:0;">
        <div style="display:inline-flex;align-items:center;${MONO};font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${stil.color};background:${stil.background};border:1px solid ${stil.border};border-radius:6px;padding:2px 8px;margin-bottom:5px;">${esc(kategorieKurz(kategorie.name))}</div>
        <div style="border-left:2px solid ${stil.border};padding-left:10px;">${zeilen}</div>
      </div>`;
    }).join('');

    return `<div style="min-width:0;">
      <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:7px;padding-bottom:4px;border-bottom:1px solid ${gruppe.farbe}33;">
        <span style="${MONO};font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:${gruppe.farbe};">${esc(gruppe.label)}</span>
        <span style="font-size:15px;font-weight:800;color:${gruppe.farbe};letter-spacing:-.02em;">${anzahl}</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:9px;padding-left:2px;">${kategorien}</div>
    </div>`;
  }).join('');

  return `<div style="margin-top:11px;border:1px solid rgba(251,191,36,.28);border-radius:10px;background:rgba(251,191,36,.05);padding:11px 13px;">
    <div style="display:flex;align-items:baseline;gap:9px;margin-bottom:12px;flex-wrap:wrap;">
      <span style="font-size:19px;font-weight:800;color:#fbbf24;letter-spacing:-.02em;">${anzahlSiege}</span>
      <span style="${MONO};font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#8b9ab4;">Siege</span>
      ${anzahlWertungen > 0 ? `<span style="font-size:19px;font-weight:800;color:#d8b4fe;letter-spacing:-.02em;margin-left:6px;">${anzahlWertungen}</span>
      <span style="${MONO};font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#8b9ab4;">Wertungen</span>` : ''}
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">${gruppen}</div>
  </div>`;
}

// Ergebnisliste nach RENNEN gruppiert (Rennen nach Prestige absteigend, innerhalb
// eines Rennens zuerst die Wertungen, dann die Etappen/Eintagesergebnisse — die
// Reihenfolge liefert das Backend). Ein Rennen-Kopf je Gruppe, darunter die
// Ergebniszeilen ohne wiederholten Rennnamen.
//
// Zwei Stufen: sichtbar sind die Hoehepunkte (Siege, Podien, Wertungen), der
// Rest steckt hinter einem <details>. Bei einer Fuenfzehn-Jahres-Karriere sind
// hundert Ergebniszeilen sonst eine Wand.
const HIGHLIGHT_RACE_LIMIT = 12;

function isHighlight(r: WrappedCareerResult): boolean {
  return r.rank <= 3 || r.isClassification;
}

function raceGroups(results: WrappedCareerResult[]): Array<{ raceName: string; rows: WrappedCareerResult[] }> {
  const groups: Array<{ raceName: string; rows: WrappedCareerResult[] }> = [];
  for (const r of results) {
    const last = groups[groups.length - 1];
    if (last && last.raceName === r.raceName) last.rows.push(r);
    else groups.push({ raceName: r.raceName, rows: [r] });
  }
  return groups;
}

// Spalten: Punkte | Position (P{Platz}, nach Platzierung eingefaerbt) | Anzahl + Typ | Jahre.
function resultRow(b: WrappedCareerResult): string {
  return `<div style="display:flex;align-items:center;gap:9px;${MONO};font-size:10.5px;color:#8b9ab4;padding-left:10px;">
    <span style="color:#22d3ee;font-weight:800;width:52px;">${b.points} P</span>
    <span style="width:38px;color:${rankColor(b.rank)};font-weight:${b.rank <= 3 ? 800 : 700};">P${b.rank}</span>
    <span style="flex:1;color:${b.isClassification ? '#e9d5ff' : '#cbd5e1'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${b.count > 1 ? `<span style="color:#fbbf24;font-weight:800;">${b.count}×</span> ` : ''}${esc(b.type)}</span>
    <span style="color:#5f6f8a;white-space:nowrap;">${esc(seasonsText(b))}</span>
  </div>`;
}

function groupBlock(g: { raceName: string; rows: WrappedCareerResult[] }): string {
  return `<div style="display:flex;flex-direction:column;gap:3px;">
    <div style="${MONO};font-size:10px;font-weight:800;letter-spacing:.04em;color:#cbd5e1;border-left:2px solid #22d3ee;padding-left:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${renderRaceNameLink(g.raceName, null)}</div>
    ${g.rows.map(resultRow).join('')}
  </div>`;
}

function groupedResultsList(results: WrappedCareerResult[]): string {
  if (!results.length) return '';
  const hoehepunkte = raceGroups(results.filter(isHighlight)).slice(0, HIGHLIGHT_RACE_LIMIT);
  // (Die Reihenfolge der Rennen liefert das Backend nach Prestige.)
  const gezeigt = new Set(hoehepunkte.map((g) => g.raceName));
  const rest = raceGroups(results).filter((g) => !gezeigt.has(g.raceName));
  const restAnzahl = rest.reduce((summe, g) => summe + g.rows.length, 0);

  const liste = (gruppen: typeof hoehepunkte) =>
    `<div style="display:flex;flex-direction:column;gap:7px;">${gruppen.map(groupBlock).join('')}</div>`;

  return `<div style="margin-top:10px;">
    ${hoehepunkte.length > 0 ? liste(hoehepunkte) : ''}
    ${restAnzahl > 0 ? `<details style="margin-top:8px;">
      <summary style="${MONO};font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#6a7a95;cursor:pointer;padding:5px 0;">Alle weiteren ${restAnzahl} Ergebnisse</summary>
      <div style="margin-top:7px;">${liste(rest)}</div>
    </details>` : ''}
  </div>`;
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
    ${grouped ? winsBlock(results) + groupedResultsList(results) : resultsList(results)}
  </div>`;
}

// Highlight-Zeile (Label · Fahrer/Team · Wert) fuer Ueberraschung/Rekorde.
// `detailHtml` ist fertiges Markup (Renn-Link oder mit esc() gesetzter Text).
function highlightRow(label: string, entity: string, detailHtml: string, value: string): string {
  return `<div style="display:grid;grid-template-columns:minmax(140px,200px) 1fr auto;align-items:center;gap:12px;padding:12px 14px;border-top:1px solid #14203a;">
    <span style="${MONO};font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#8b9ab4;">${esc(label)}</span>
    <span style="min-width:0;display:flex;align-items:center;gap:9px;flex-wrap:wrap;">${entity}${detailHtml ? `<span style="${MONO};font-size:10px;color:#6a7a95;">${detailHtml}</span>` : ''}</span>
    <span style="${MONO};font-size:15px;font-weight:800;color:#fbbf24;">${esc(value)}</span>
  </div>`;
}

function surpriseSection(s: SeasonWrappedPayload['surprise']): string {
  const rows: string[] = [];
  if (s.lowestOvrWinner) rows.push(highlightRow('Underdog-Sieg', riderChip(s.lowestOvrWinner.rider), renderRaceNameLink(s.lowestOvrWinner.raceName, null), `OVR ${s.lowestOvrWinner.value}`));
  if (s.youngestMonumentWinner) rows.push(highlightRow('Jüngster Monument-Sieger', riderChip(s.youngestMonumentWinner.rider), renderRaceNameLink(s.youngestMonumentWinner.raceName, null), `${s.youngestMonumentWinner.value} J`));
  if (rows.length === 0) return '';
  return wrappedSection('#f97316', 'Überraschung des Jahres', '', rows.join(''));
}

function recordsSection(r: SeasonWrappedPayload['records']): string {
  const rows: string[] = [];
  if (r.mostWins) rows.push(highlightRow('Meiste Siege', riderChip(r.mostWins.rider), '', `${r.mostWins.wins} Siege`));
  if (r.teamDominance) rows.push(highlightRow('Dominantestes Team', teamChip(r.teamDominance.team), esc('Punktevorsprung'), `+${r.teamDominance.lead.toLocaleString('de-DE')}`));
  if (r.longestStreak) rows.push(highlightRow('Längste Siegesserie', riderChip(r.longestStreak.rider), esc('Renntags-Siege in Folge'), `${r.longestStreak.streak}×`));
  if (rows.length === 0) return '';
  return wrappedSection('#22d3ee', 'Rekorde der Saison', '', rows.join(''));
}

// ---- Punkteverlauf ------------------------------------------------------
//
// Die Serienfarben sind nicht die hellen Akzente der Oberflaeche, sondern eine
// Stufe darunter: geprueft gegen die dunkle Flaeche auf Helligkeitsband,
// Buntheit, Farbfehlsichtigkeit (schlechtestes Nachbarpaar dE 15,3 deutan) und
// Kontrast. Beschriftungen bleiben in Textfarben, die Farbe traegt allein die
// Marke daneben.
const SERIES_COLORS = ['#0e9bb8', '#9333ea', '#d97706'];

function tagNummer(iso: string): number {
  return Date.parse(iso + 'T00:00:00Z') / 86400000;
}

// Achse auf einen runden Schritt bringen: 6434 Punkte ergeben sonst die
// Beschriftungen 1.609 / 3.217 / 4.826, die niemand liest.
function niceAxisMax(max: number, stufen: number): number {
  const roh = Math.max(1, max) / stufen;
  const groesse = Math.pow(10, Math.floor(Math.log10(roh)));
  const schritt = [1, 2, 2.5, 5, 10].map((f) => f * groesse).find((f) => f >= roh) ?? groesse * 10;
  return schritt * stufen;
}

function progressionChart(p: WrappedProgression): string {
  const W = 940, H = 320;
  const PAD = { top: 16, right: 138, bottom: 40, left: 56 };
  const innenW = W - PAD.left - PAD.right;
  const innenH = H - PAD.top - PAD.bottom;
  const STUFEN = 4;
  const achseMax = niceAxisMax(p.maxPoints, STUFEN);
  const von = tagNummer(p.fromDate);
  const bis = Math.max(tagNummer(p.toDate), von + 1);
  const x = (iso: string) => PAD.left + ((tagNummer(iso) - von) / (bis - von)) * innenW;
  const y = (wert: number) => PAD.top + innenH - (wert / achseMax) * innenH;

  // Zurueckhaltendes Raster, beschriftet nur links.
  const raster = Array.from({ length: STUFEN + 1 }, (_, i) => {
    const wert = (achseMax / STUFEN) * i;
    const yy = y(wert);
    return `<line x1="${PAD.left}" y1="${yy}" x2="${PAD.left + innenW}" y2="${yy}" stroke="#16233c" stroke-width="1"/>
      <text x="${PAD.left - 8}" y="${yy + 3.5}" text-anchor="end" fill="#5f6f8a" font-size="9" font-family="JetBrains Mono,monospace">${Math.round(wert).toLocaleString('de-DE')}</text>`;
  }).join('');

  // Grand Tours als senkrechte Marken — Zusammenhang, keine Daten. Die
  // Beschriftung steht unten: oben laeuft sie in die Kurven der Fuehrenden.
  const marken = p.markers.map((m) => {
    const xx = x(m.date);
    if (xx < PAD.left || xx > PAD.left + innenW) return '';
    return `<line x1="${xx}" y1="${PAD.top}" x2="${xx}" y2="${PAD.top + innenH}" stroke="#243352" stroke-width="1" stroke-dasharray="3 4"/>
      <text x="${xx + 4}" y="${PAD.top + innenH - 5}" fill="#4a5a75" font-size="8.5" font-family="JetBrains Mono,monospace">${esc(m.label)}</text>`;
  }).join('');

  const gezeichnet = p.series
    .map((reihe, i) => ({ reihe, farbe: SERIES_COLORS[i] ?? SERIES_COLORS[SERIES_COLORS.length - 1]! }))
    .filter((eintrag) => eintrag.reihe.points.length > 0);

  const linien = gezeichnet.map(({ reihe, farbe }) => {
    // Treppe: Punkte fallen an Renntagen an, dazwischen passiert nichts.
    let d = `M ${x(reihe.points[0]!.date).toFixed(1)} ${y(0).toFixed(1)}`;
    let letztesY = y(0);
    for (const punkt of reihe.points) {
      const px = x(punkt.date).toFixed(1);
      d += ` L ${px} ${letztesY.toFixed(1)}`;
      letztesY = y(punkt.total);
      d += ` L ${px} ${letztesY.toFixed(1)}`;
    }
    const letzter = reihe.points[reihe.points.length - 1]!;
    return `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="2" stroke-linejoin="round"><title>${esc(reihe.rider.lastName)}: ${reihe.total.toLocaleString('de-DE')} Punkte</title></path>
      <circle cx="${x(letzter.date).toFixed(1)}" cy="${y(letzter.total).toFixed(1)}" r="4" fill="${farbe}" stroke="#0c1526" stroke-width="2"/>`;
  }).join('');

  // Endbeschriftungen auseinanderziehen: liegen zwei Fahrer dicht beieinander,
  // legt sich sonst die eine Zahl auf die Linie der anderen.
  const LABEL_HOEHE = 26;
  const marken2 = gezeichnet
    .map(({ reihe }) => {
      const letzter = reihe.points[reihe.points.length - 1]!;
      return { reihe, yRoh: y(letzter.total), xEnde: x(letzter.date) };
    })
    .sort((a, b) => a.yRoh - b.yRoh);
  let untergrenze = PAD.top;
  for (const eintrag of marken2) {
    (eintrag as any).yLabel = Math.max(eintrag.yRoh, untergrenze);
    untergrenze = (eintrag as any).yLabel + LABEL_HOEHE;
  }
  const beschriftungen = marken2.map((eintrag) => {
    const yLabel = (eintrag as any).yLabel as number;
    const lx = PAD.left + innenW + 12;
    // Fuehrungsstrich, wenn die Beschriftung vom Endpunkt weggerueckt ist.
    const strich = `<path d="M ${(eintrag.xEnde + 5).toFixed(1)} ${eintrag.yRoh.toFixed(1)} L ${(lx - 4).toFixed(1)} ${yLabel.toFixed(1)}" fill="none" stroke="#243352" stroke-width="1"/>`;
    return `${strich}
      <text x="${lx}" y="${(yLabel - 2).toFixed(1)}" fill="#cbd5e1" font-size="11" font-weight="700" font-family="Archivo,system-ui,sans-serif">${esc(eintrag.reihe.rider.lastName)}</text>
      <text x="${lx}" y="${(yLabel + 11).toFixed(1)}" fill="#8b9ab4" font-size="9.5" font-family="JetBrains Mono,monospace">${eintrag.reihe.total.toLocaleString('de-DE')} P</text>`;
  }).join('');

  // Legende: bei mehreren Reihen immer vorhanden, damit die Zuordnung nicht
  // allein an der Farbe haengt.
  const legende = gezeichnet.map(({ reihe, farbe }) => `<span style="display:inline-flex;align-items:center;gap:6px;">
    <span style="width:14px;height:3px;border-radius:2px;background:${farbe};"></span>
    <span style="font-size:11px;color:#cbd5e1;">${esc(reihe.rider.firstName)} ${esc(reihe.rider.lastName)}</span>
  </span>`).join('');

  return `<div style="padding:14px;">
    <div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:10px;">${legende}</div>
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block;" role="img" aria-label="Kumulierte UCI-Punkte der drei Besten ueber die Saison">
      ${raster}${marken}${linien}${beschriftungen}
      <line x1="${PAD.left}" y1="${PAD.top + innenH}" x2="${PAD.left + innenW}" y2="${PAD.top + innenH}" stroke="#243352" stroke-width="1"/>
      <text x="${PAD.left}" y="${H - 12}" fill="#5f6f8a" font-size="9" font-family="JetBrains Mono,monospace">${esc(p.fromDate)}</text>
      <text x="${PAD.left + innenW}" y="${H - 12}" text-anchor="end" fill="#5f6f8a" font-size="9" font-family="JetBrains Mono,monospace">${esc(p.toDate)}</text>
    </svg>
  </div>`;
}

function progressionSection(p: WrappedProgression | null): string {
  if (!p || p.series.length === 0) return '';
  return wrappedSection('#0e9bb8', 'Der Verlauf der Saison', 'kumulierte UCI-Punkte', progressionChart(p));
}

// ---- Eigenes Team -------------------------------------------------------
function deltaText(jetzt: number, vorher: number, einheit = ''): string {
  if (vorher === 0) return '';
  const diff = jetzt - vorher;
  if (diff === 0) return `<span style="${MONO};font-size:10px;color:#4a5a75;">gleich wie im Vorjahr</span>`;
  const hoch = diff > 0;
  return `<span style="${MONO};font-size:10px;font-weight:700;color:${hoch ? '#4ade80' : '#f87171'};">${hoch ? '▲ +' : '▼ '}${diff.toLocaleString('de-DE')}${einheit} ggü. Vorjahr</span>`;
}

function kachel(label: string, wert: string, unten: string): string {
  return `<div style="border:1px solid #1e2c49;border-radius:10px;background:#0a1322;padding:13px 15px;min-width:0;">
    <div style="${MONO};font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:#6a7a95;">${esc(label)}</div>
    <div style="font-size:26px;font-weight:800;color:#e8eef7;letter-spacing:-.02em;margin:3px 0 2px;">${wert}</div>
    <div style="min-height:14px;">${unten}</div>
  </div>`;
}

function playerTeamSection(t: WrappedPlayerTeam | null): string {
  if (!t) return '';
  const rangDelta = t.previousRank == null
    ? `<span style="${MONO};font-size:10px;color:#4a5a75;">erste gewertete Saison</span>`
    : deltaText(t.previousRank, t.rank ?? t.previousRank, '');
  const kacheln = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:11px;padding:14px;">
    ${kachel('Platz Teamwertung', t.rank != null ? `#${t.rank}` : '—', rangDelta)}
    ${kachel('UCI-Punkte', t.points.toLocaleString('de-DE'), deltaText(t.points, t.previousPoints))}
    ${kachel('Siege', String(t.wins), deltaText(t.wins, t.previousWins))}
    ${kachel('Fahrer mit Sieg', String(t.ridersWithWin), '')}
  </div>`;
  const zeilen: string[] = [];
  if (t.bestRider) {
    zeilen.push(highlightRow('Bester Fahrer', riderChip(t.bestRider.rider),
      t.bestRider.seasonRank != null ? esc(`#${t.bestRider.seasonRank} der Saisonwertung`) : '',
      `${t.bestRider.points.toLocaleString('de-DE')} P`));
  }
  if (t.biggestWin) {
    zeilen.push(highlightRow('Größter Sieg', riderChip(t.biggestWin.rider),
      `${renderRaceNameLink(t.biggestWin.raceName, null)} <span style="color:#4a5a75;">· ${esc(t.biggestWin.type)}</span>`,
      `${t.biggestWin.points.toLocaleString('de-DE')} P`));
  }
  return wrappedSection('#4ade80', t.teamName, 'deine Saison', kacheln + zeilen.join(''));
}

// ---- Duell des Jahres ---------------------------------------------------
function duelSide(rider: PalmaresRiderRef, siege: number, gesamt: number, rechts: boolean): string {
  const anteil = gesamt > 0 ? Math.round((siege / gesamt) * 100) : 50;
  return `<div style="min-width:0;text-align:${rechts ? 'right' : 'left'};">
    <div style="display:flex;justify-content:${rechts ? 'flex-end' : 'flex-start'};">${riderChip(rider)}</div>
    <div style="font-size:34px;font-weight:800;color:#e8eef7;letter-spacing:-.03em;margin-top:6px;">${siege}</div>
    <div style="${MONO};font-size:10px;color:#6a7a95;">${anteil} % der Duelle</div>
  </div>`;
}

function rivalrySection(r: WrappedRivalry | null): string {
  if (!r) return '';
  const gesamt = r.seasonWinA + r.seasonWinB;
  const anteilA = gesamt > 0 ? (r.seasonWinA / gesamt) * 100 : 50;
  const balken = `<div style="display:flex;height:8px;border-radius:99px;overflow:hidden;background:#14203a;margin:14px 0 6px;">
    <span style="width:${anteilA}%;background:#0e9bb8;"></span>
    <span style="width:${100 - anteilA}%;background:#d97706;"></span>
  </div>`;
  return wrappedSection('#f43f5e', 'Duell des Jahres', r.discipline ? `Schwerpunkt ${r.discipline}` : '', `
    <div style="padding:16px;">
      <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:start;">
        ${duelSide(r.riderA, r.seasonWinA, gesamt, false)}
        <div style="${MONO};font-size:11px;color:#6a7a95;text-align:center;padding-top:26px;">von<br><span style="font-size:20px;font-weight:800;color:#cbd5e1;">${r.encounters}</span><br>Duellen</div>
        ${duelSide(r.riderB, r.seasonWinB, gesamt, true)}
      </div>
      ${balken}
      <div style="${MONO};font-size:10px;color:#5f6f8a;text-align:center;">Über die gesamte Karriere: ${r.careerWinA} : ${r.careerWinB}</div>
    </div>`);
}

// ---- Trikottage ---------------------------------------------------------
function jerseySection(gruppen: WrappedJerseyGroup[]): string {
  if (gruppen.length === 0) return '';
  const spalten = gruppen.map((g) => {
    const symbol = JERSEY_ICON[g.key] ?? { icon: '▪', color: '#8b9ab4' };
    const zeilen = g.holders.map((h, i) => `<div style="display:grid;grid-template-columns:18px 1fr auto;gap:9px;align-items:center;padding:7px 0;border-top:1px solid #14203a;">
      <span style="${MONO};font-size:11px;font-weight:800;color:${MEDAL[i] ?? '#5f6f8a'};">${i + 1}</span>
      <span style="min-width:0;font-size:13px;">${riderChip(h.rider, i === 0)}</span>
      <span style="${MONO};font-size:13px;font-weight:800;color:${symbol.color};">${h.days} T</span>
    </div>`).join('');
    return `<div style="min-width:0;">
      <div style="display:flex;align-items:center;gap:7px;${MONO};font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#8b9ab4;padding-bottom:4px;">
        <span style="font-size:13px;">${symbol.icon}</span>${esc(g.label)}
      </div>${zeilen}</div>`;
  }).join('');
  return wrappedSection('#facc15', 'Tage im Führungstrikot', 'wer die Wertungen am längsten anführte',
    `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(196px,1fr));gap:16px;padding:14px;">${spalten}</div>`);
}

// ---- Pech und Schinderei ------------------------------------------------
function grindSection(g: WrappedGrind): string {
  if (g.unluckiest.length === 0 && g.workhorses.length === 0) return '';
  const pech = statRows(g.unluckiest.map((e) => ({
    label: riderChip(e.rider),
    sub: `${e.value} T`,
  })));
  const dauer = statRows(g.workhorses.map((e) => ({
    label: riderChip(e.rider),
    sub: `${e.value}`,
  })));
  const pechDetail = g.unluckiest.length > 0
    ? `<div style="${MONO};font-size:9.5px;color:#5f6f8a;padding:8px 14px 12px;">Verletzung + Krankheit · ${g.unluckiest.map((e) => `${esc(e.rider.lastName)} ${e.injuryDays}/${e.illnessDays}`).join(' · ')}</div>`
    : '';
  return overviewGrid(
    wrappedSection('#f87171', 'Pechvogel des Jahres', 'Ausfalltage', pech + pechDetail),
    wrappedSection('#38bdf8', 'Dauerläufer', 'Renntage', dauer),
  );
}

// ---- Staerkste Felder ---------------------------------------------------
function strongestFieldsSection(list: WrappedStrongestField[]): string {
  if (list.length === 0) return '';
  const zeilen = list.map((f, i) => {
    const anteil = Math.max(2, Math.min(100, (f.score / Math.max(1, list[0]!.score)) * 100));
    return `<div style="display:grid;grid-template-columns:30px 1fr 120px auto;gap:12px;align-items:center;padding:${i < 3 ? 9 : 7}px 14px;border-top:1px solid #14203a;">
      <span style="${MONO};font-size:${i < 3 ? 15 : 12}px;font-weight:800;color:${MEDAL[i] ?? '#5f6f8a'};text-align:center;">${i + 1}</span>
      <span style="min-width:0;font-weight:700;font-size:13px;color:#e8eef7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${renderRaceNameLink(f.raceName, f.raceId)}</span>
      <span style="height:6px;border-radius:99px;background:#14203a;overflow:hidden;"><span style="display:block;height:100%;width:${anteil}%;background:#a855f7;"></span></span>
      <span style="${MONO};font-size:13px;font-weight:800;color:#d8b4fe;">${f.score.toFixed(1)}</span>
    </div>`;
  }).join('');
  return wrappedSection('#a855f7', 'Die stärksten Felder', 'Startlistenqualität', zeilen);
}

// ---- Wertungstrikots der Grand Tours ------------------------------------
function classificationRow(c: WrappedGrandTourClassifications | undefined): string {
  if (!c) return '';
  const teile: string[] = [];
  const zelle = (key: string, label: string, ref: PalmaresRiderRef | null) => {
    if (!ref) return;
    const symbol = JERSEY_ICON[key] ?? { icon: '▪', color: '#8b9ab4' };
    teile.push(`<span style="display:inline-flex;align-items:center;gap:6px;min-width:0;">
      <span style="font-size:11px;" title="${esc(label)}">${symbol.icon}</span>
      <button type="button" class="app-rider-link" data-rider-id="${ref.riderId}" style="${LINK}font-weight:600;color:#b9c6db;font-size:12px;">${esc(ref.lastName)}</button>
    </span>`);
  };
  zelle('points', 'Punktewertung', c.points);
  zelle('mountain', 'Bergwertung', c.mountain);
  zelle('youth', 'Nachwuchswertung', c.youth);
  if (teile.length === 0) return '';
  return `<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;padding:6px 14px 10px 14px;">
    <span style="${MONO};font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5f6f8a;">Wertungen</span>${teile.join('')}
  </div>`;
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

// Ewige Bestenliste nach dieser Saison, mit Auf-/Abstieg gegenueber dem Stand
// nach der Vorsaison. Steht bewusst VOR den Legenden und den Herausgefallenen:
// beide Abschnitte beziehen sich auf genau diese Tabelle.
function allTimeSection(entries: WrappedRiderPoints[]): string {
  if (entries.length === 0) return '';
  const zeile = (e: WrappedRiderPoints, platz: number) => ({
    label: riderChip(e.rider),
    sub: e.points.toLocaleString('de-DE'),
    delta: rankDelta(platz, e.previousRank),
  });
  const HALB = 25;
  const links = entries.slice(0, HALB);
  const rechts = entries.slice(HALB);
  // Einheitliche Zeilenhoehe (siehe statRows): nur so stehen die Plaetze 26 bis
  // 50 rechts auf derselben Linie wie 1 bis 25 links.
  // In den ersten Saisons stehen noch keine 26 Fahrer in der Wertung — dann
  // bleibt es bei einer Spalte statt einer leeren rechten Haelfte.
  const inner = rechts.length === 0
    ? statRows(links.map((e, i) => zeile(e, i)), 0, true)
    : `<div style="display:grid;grid-template-columns:1fr 1fr;">
        <div>${statRows(links.map((e, i) => zeile(e, i)), 0, true)}</div>
        <div style="border-left:1px solid #1c2b47;">${statRows(rechts.map((e, i) => zeile(e, i + HALB)), HALB, true)}</div>
      </div>`;
  return wrappedSection(
    '#a855f7',
    'Ewige Bestenliste · UCI-Punkte',
    `Top ${entries.length} · Pfeile gegenüber dem Vorjahr`,
    inner,
  );
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

// Jeder Abschied bekommt eine eigene Seite: das vollstaendige Palmares eines
// Fahrers fuellt fuer sich schon einen Bildschirm — zehn davon untereinander
// waeren eine Bildlaufstrecke statt eines Rueckblicks.
function retireeSlides(list: WrappedRetiree[]): string[] {
  return list.map((r, i) => wrappedSection(
    '#94a3b8',
    'In den Ruhestand',
    `Abschied ${i + 1} von ${list.length} · nach All-Time-UCI`,
    detailRow(
      rankBadge(i), r.rider,
      `${r.allTimeUciRank != null ? '#' + r.allTimeUciRank + ' All-Time-UCI · ' : ''}${r.careerWins} Karrieresiege · ${r.allTimeUciPoints.toLocaleString('de-DE')} UCI`,
      r.bestResults,
      careerLine(r),
      true,
    ),
  ));
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
  // Das eigene Team zuerst: alles Weitere ist der Zusammenhang dazu.
  push(playerTeamSection(w.playerTeam));
  push(winnersSections(w.raceWinners, w.grandTourClassifications));
  push(progressionSection(w.progression));
  push(overviewGrid(
    wrappedSection('#fbbf24', 'Meiste Siege · Fahrer', 'Top 10', statRows(w.topRidersByWins.map((e, i) => ({
      label: riderChip(e.rider), sub: `${e.wins}`, delta: rankDelta(i, e.previousRank),
    })))),
    wrappedSection('#fbbf24', 'Meiste Siege · Teams', 'Top 10', statRows(w.topTeamsByWins.map((t, i) => ({
      label: teamChip(t), sub: `${t.value}`, delta: rankDelta(i, t.previousRank),
    })))),
  ));
  push(wrappedSection('#cbd5e1', 'Meiste zweite Plätze', 'so nah dran', statRows(w.topRidersBySecond.map((e) => ({
    label: riderChip(e.rider), sub: `${e.wins}`,
  })))));
  push(overviewGrid(
    wrappedSection('#22d3ee', 'Meiste Punkte · Fahrer', 'Top 10', statRows(w.topRidersByPoints.map((e, i) => ({
      label: riderChip(e.rider), sub: e.points.toLocaleString('de-DE'), delta: rankDelta(i, e.previousRank),
    })))),
    wrappedSection('#22d3ee', 'Meiste Punkte · Teams', 'Top 10', statRows(w.topTeamsByPoints.map((t, i) => ({
      label: teamChip(t), sub: t.value.toLocaleString('de-DE'), delta: rankDelta(i, t.previousRank),
    })))),
  ));
  push(rivalrySection(w.rivalry));
  push(jerseySection(w.jerseyDays));
  push(strongestFieldsSection(w.strongestFields));
  push(grindSection(w.grind));
  push(surpriseSection(w.surprise));
  push(recordsSection(w.records));
  push(newcomersSection(w.bestNewcomers));
  push(allTimeSection(w.allTimeTop));
  push(legendsSection(w.legends));
  push(fallenLegendsSection(w.fallenLegends));
  for (const seite of retireeSlides(w.retirees)) push(seite);
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
