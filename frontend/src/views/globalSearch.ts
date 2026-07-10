import { state, esc, renderFlag, renderMiniJersey } from '../state';

// Globale Schnellsuche (⌘K / Strg+K) über Fahrer, Teams und Rennen.
// Overlay-Palette; Auswahl öffnet den passenden View über die bestehenden
// Opener (dynamischer Import, um Zyklen zu vermeiden).

interface SearchHit {
  type: 'rider' | 'team' | 'race';
  id: number;
  label: string;
  sub: string;
  icon: string;
  rank: number; // kleiner = relevanter
}

let overlay: HTMLDivElement | null = null;
let inputEl: HTMLInputElement | null = null;
let listEl: HTMLDivElement | null = null;
let hits: SearchHit[] = [];
let activeIndex = 0;

const MONO = "font-family:'JetBrains Mono',monospace";

function ensureOverlay(): void {
  if (overlay) return;
  overlay = document.createElement('div');
  overlay.id = 'global-search-overlay';
  overlay.style.cssText =
    'position:fixed;inset:0;z-index:6000;display:none;align-items:flex-start;justify-content:center;' +
    'background:rgba(4,8,16,.66);backdrop-filter:blur(3px);padding-top:12vh;';
  overlay.innerHTML = `
    <div id="global-search-box" style="width:min(640px,92vw);background:#0c1526;border:1px solid #22d3ee55;border-radius:14px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.55);">
      <div style="display:flex;align-items:center;gap:10px;padding:13px 16px;border-bottom:1px solid #1e2c49;">
        <span style="color:#22d3ee;font-size:15px;">⌕</span>
        <input id="global-search-input" type="text" autocomplete="off" spellcheck="false" placeholder="Fahrer, Team oder Rennen suchen…"
          style="flex:1;background:none;border:none;outline:none;color:#e6ecf6;font-size:15px;font-family:inherit;" />
        <span style="${MONO};font-size:9px;color:#5f6f8a;border:1px solid #1e2c49;border-radius:5px;padding:2px 6px;">ESC</span>
      </div>
      <div id="global-search-results" style="max-height:56vh;overflow-y:auto;padding:6px;"></div>
    </div>`;
  document.body.appendChild(overlay);
  inputEl = overlay.querySelector('#global-search-input');
  listEl = overlay.querySelector('#global-search-results');

  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  inputEl!.addEventListener('input', () => { compute(inputEl!.value); render(); });
  inputEl!.addEventListener('keydown', onInputKey);
}

function norm(s: string): string { return s.toLowerCase().trim(); }

function compute(query: string): void {
  const q = norm(query);
  hits = [];
  if (q.length < 1) { activeIndex = 0; return; }

  const scoreName = (hay: string): number => {
    const h = norm(hay);
    if (h === q) return 0;
    if (h.startsWith(q)) return 1;
    if (h.includes(` ${q}`)) return 2; // Wortanfang
    if (h.includes(q)) return 3;
    return -1;
  };

  for (const r of state.riders) {
    const full = `${r.firstName} ${r.lastName}`;
    const s = Math.min(
      scoreName(r.lastName) >= 0 ? scoreName(r.lastName) : 99,
      scoreName(full) >= 0 ? scoreName(full) : 99,
    );
    if (s < 99) {
      hits.push({
        type: 'rider', id: r.id, label: full,
        sub: `Fahrer · OVR ${Math.round(r.overallRating)}`,
        icon: renderFlag(r.country?.code3 ?? r.nationality ?? ''),
        rank: s * 1000 - r.overallRating, // relevanter + staerker zuerst
      });
    }
  }
  for (const t of state.teams) {
    const s = scoreName(t.name);
    if (s >= 0) hits.push({ type: 'team', id: t.id, label: t.name, sub: 'Team', icon: renderMiniJersey(t.id, t.name), rank: s * 1000 - 500 });
  }
  for (const race of state.races) {
    const s = scoreName(race.name);
    if (s >= 0) hits.push({ type: 'race', id: race.id, label: race.name, sub: `Rennen${race.category?.name ? ' · ' + race.category.name.replace(/^World Tour\s*-\s*/i, '') : ''}`, icon: '🏁', rank: s * 1000 });
  }

  hits.sort((a, b) => a.rank - b.rank);
  hits = hits.slice(0, 12);
  activeIndex = 0;
}

function render(): void {
  if (!listEl) return;
  if (!inputEl?.value.trim()) {
    listEl.innerHTML = `<div style="padding:18px;color:#5f6f8a;font-size:12.5px;">Tippe, um zu suchen — Fahrer, Teams und Rennen.</div>`;
    return;
  }
  if (hits.length === 0) {
    listEl.innerHTML = `<div style="padding:18px;color:#5f6f8a;font-size:12.5px;">Kein Treffer.</div>`;
    return;
  }
  listEl.innerHTML = hits.map((h, i) => {
    const active = i === activeIndex;
    return `<div class="global-search-hit" data-idx="${i}" style="display:flex;align-items:center;gap:11px;padding:9px 12px;border-radius:9px;cursor:pointer;background:${active ? 'rgba(34,211,238,.12)' : 'transparent'};border:1px solid ${active ? '#22d3ee55' : 'transparent'};">
      <span style="width:22px;text-align:center;flex:none;">${h.icon}</span>
      <span style="flex:1;min-width:0;"><span style="display:block;font-weight:700;color:#e6ecf6;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(h.label)}</span><span style="${MONO};font-size:10px;color:#8b9ab4;">${esc(h.sub)}</span></span>
      <span style="${MONO};font-size:9px;color:#5f6f8a;text-transform:uppercase;">${h.type === 'rider' ? 'Fahrer' : h.type === 'team' ? 'Team' : 'Rennen'}</span>
    </div>`;
  }).join('');
  listEl.querySelectorAll<HTMLElement>('.global-search-hit').forEach((el) => {
    el.addEventListener('mousemove', () => { const i = Number(el.dataset['idx']); if (i !== activeIndex) { activeIndex = i; render(); } });
    el.addEventListener('click', () => { activeIndex = Number(el.dataset['idx']); void selectActive(); });
  });
  const activeEl = listEl.querySelector<HTMLElement>(`.global-search-hit[data-idx="${activeIndex}"]`);
  activeEl?.scrollIntoView({ block: 'nearest' });
}

async function selectActive(): Promise<void> {
  const hit = hits[activeIndex];
  if (!hit) return;
  close();
  if (hit.type === 'rider') {
    const { openRiderStats } = await import('./riderStats');
    openRiderStats(hit.id);
  } else if (hit.type === 'team') {
    const { openTeamStats } = await import('./teamStats');
    openTeamStats(hit.id);
  } else {
    const { openRaceDetail } = await import('./raceDetail');
    await openRaceDetail(hit.id);
  }
}

function onInputKey(e: KeyboardEvent): void {
  if (e.key === 'Escape') { e.preventDefault(); close(); return; }
  if (e.key === 'ArrowDown') { e.preventDefault(); if (hits.length) { activeIndex = (activeIndex + 1) % hits.length; render(); } return; }
  if (e.key === 'ArrowUp') { e.preventDefault(); if (hits.length) { activeIndex = (activeIndex - 1 + hits.length) % hits.length; render(); } return; }
  if (e.key === 'Enter') { e.preventDefault(); void selectActive(); return; }
}

function open(): void {
  // Nur im Spiel sinnvoll (Daten geladen).
  if (state.riders.length === 0 && state.teams.length === 0) return;
  ensureOverlay();
  overlay!.style.display = 'flex';
  inputEl!.value = '';
  compute('');
  render();
  inputEl!.focus();
}

function close(): void {
  if (overlay) overlay.style.display = 'none';
}

export function initGlobalSearch(): void {
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (overlay && overlay.style.display === 'flex') close(); else open();
    }
  });
}
