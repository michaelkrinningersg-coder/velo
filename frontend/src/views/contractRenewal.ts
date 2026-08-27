import { api } from '../api';
import { $, esc, renderFlag, showModal, hideModal, getRiderSpecializationLabel } from '../state';
import { loadGameState } from './dashboard';
import {
  AUTO_SELECT_AFTER_MS,
  AUTO_SELECT_MAX_AGE,
  AUTO_SELECT_SHARE,
  resolveAutoSelection,
} from '../../../shared/contractRenewalAutoSelect';

// Blockierendes Auswahlfenster (10.01.): der Spieler waehlt seine Fahrer mit
// auslaufendem Vertrag als Verlaengerungsziele. Am 01.08. verlaengern davon
// zufaellig 50-80% (Backend). Retirement-Faelle sind nicht waehlbar.
//
// Weil das Fenster den Tageswechsel blockiert, darf es nicht ewig offen
// stehen bleiben: nach fuenf Minuten ohne Bestaetigung waehlt es selbst aus
// und bestaetigt. Eine Uhr in der Ecke zaehlt sichtbar herunter.

let selected = new Set<number>();
let maxSelectable = 0;
let candidates: RenewalCandidateView[] = [];
let saving = false;
let currentSeason = 0;
let geoeffnet = false;

interface RenewalCandidateView {
  riderId: number;
  firstName: string;
  lastName: string;
  countryCode: string | null;
  overallRating: number;
  potential: number;
  age: number;
  specialization1?: string | null;
}

let autoTimer: ReturnType<typeof setTimeout> | null = null;
let uhrTimer: ReturnType<typeof setInterval> | null = null;
let ablaufZeit = 0;

function stoppeUhr(): void {
  if (autoTimer != null) { clearTimeout(autoTimer); autoTimer = null; }
  if (uhrTimer != null) { clearInterval(uhrTimer); uhrTimer = null; }
}

/** Bricht eine laufende Uhr ab — etwa wenn das Fenster nicht mehr ansteht. */
export function cancelRenewalAutoSelect(): void {
  stoppeUhr();
  geoeffnet = false;
}

function zeichneUhr(): void {
  const uhr = document.getElementById('contract-renewal-clock');
  if (!uhr) return;
  const rest = Math.max(0, ablaufZeit - Date.now());
  const sek = Math.ceil(rest / 1000);
  const knapp = sek <= 30;
  uhr.textContent = `${Math.floor(sek / 60)}:${String(sek % 60).padStart(2, '0')}`;
  uhr.style.color = knapp ? '#f87171' : '#8b9ab4';
  uhr.style.borderColor = knapp ? '#7f1d1d' : '#1e2c49';
}

function starteUhr(): void {
  stoppeUhr();
  ablaufZeit = Date.now() + AUTO_SELECT_AFTER_MS;
  zeichneUhr();
  uhrTimer = setInterval(zeichneUhr, 1000);
  autoTimer = setTimeout(() => { void automatischWaehlen(); }, AUTO_SELECT_AFTER_MS);
}

async function automatischWaehlen(): Promise<void> {
  stoppeUhr();
  if (saving) return;
  selected = new Set(resolveAutoSelection(candidates));
  await bestaetige();
}

export async function openContractRenewalModal(): Promise<void> {
  if (geoeffnet) return; // nicht bei jedem Dashboard-Rendern neu aufziehen
  const res = await api.getContractRenewals();
  if (!res.success || !res.data) return;
  const p = res.data;
  candidates = (p.candidates ?? []) as RenewalCandidateView[];
  maxSelectable = p.maxSelectable ?? 0;
  selected = new Set<number>(p.selectedRiderIds ?? []);
  currentSeason = p.season ?? 0;
  geoeffnet = true;
  render();
  showModal('contractRenewal');
  starteUhr();
}

// Telemetrie-Balken: Skala 55-85. OVR = cyanfarbene Fuellung, POT = gruene
// Marke davor, die schraffierte Luecke dazwischen ist der Spielraum (+Δ).
const SCALE_MIN = 55;
const SCALE_MAX = 85;
const MONO = "font-family:'JetBrains Mono',monospace;font-variant-numeric:tabular-nums";
const pct = (v: number) => Math.max(0, Math.min(100, ((v - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100));

/** Nachname plus abgekuerzter Vorname — die Namensplatte bleibt schmal. */
function kurzerName(c: RenewalCandidateView): string {
  const vorname = (c.firstName ?? '').trim();
  const initial = vorname ? `${vorname.charAt(0)}.` : '';
  return `<span style="font-weight:700;color:#e6ecf6;">${esc(c.lastName)}</span>`
    + (initial ? ` <span style="color:#8b9ab4;font-weight:500;">${esc(initial)}</span>` : '');
}

function karte(c: RenewalCandidateView): string {
  const on = selected.has(c.riderId);
  const disabled = !on && selected.size >= maxSelectable;
  const flag = c.countryCode ? renderFlag(c.countryCode) : '';
  const ovr = Number(c.overallRating);
  const pot = Number(c.potential);
  const delta = pot - ovr;
  const deltaLabel = delta >= 0.05 ? `+${delta.toFixed(1)}` : delta <= -0.05 ? delta.toFixed(1) : '±0.0';
  const spez = c.specialization1 ? getRiderSpecializationLabel(c.specialization1) : '';
  return `
    <div class="contract-renewal-row" data-rider-id="${c.riderId}" data-on="${on ? '1' : '0'}" style="display:grid;grid-template-columns:20px minmax(0,1fr) 34px minmax(120px,1fr);align-items:center;gap:9px;padding:7px 10px;border:1px solid ${on ? '#22d3ee' : '#1e2c49'};border-radius:9px;background:${on ? 'rgba(34,211,238,.07)' : '#0b1120'};${on ? 'box-shadow:inset 3px 0 0 #22d3ee;' : ''}cursor:${disabled ? 'not-allowed' : 'pointer'};opacity:${disabled ? 0.5 : 1};">
      <span data-role="box" style="width:17px;height:17px;border-radius:5px;border:2px solid ${on ? '#22d3ee' : '#33415a'};background:${on ? '#22d3ee' : 'transparent'};display:flex;align-items:center;justify-content:center;color:#0b1120;font-weight:900;font-size:11px;flex:none;">${on ? '✓' : ''}</span>
      <span style="display:flex;align-items:center;gap:7px;min-width:0;">
        <span style="flex:none;display:inline-flex;">${flag}</span>
        <span style="min-width:0;line-height:1.15;">
          <span style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12.5px;">${kurzerName(c)}</span>
          <span style="display:block;font-size:9.5px;color:#6a7a95;letter-spacing:.04em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(spez)}</span>
        </span>
      </span>
      <span style="${MONO};font-size:12px;font-weight:800;color:#fbbf24;">${c.age}<span style="font-size:8px;font-weight:700;color:#a8862a;">J</span></span>
      <div style="display:flex;flex-direction:column;gap:4px;min-width:0;">
        <div style="display:flex;justify-content:space-between;gap:6px;${MONO};font-size:10px;">
          <span style="color:#fbbf24;font-weight:800;">${ovr.toFixed(1)}</span>
          <span><span style="color:#a7b4cc;font-weight:700;">${pot.toFixed(1)}</span> <span style="color:#4ade80;font-weight:800;">${deltaLabel}</span></span>
        </div>
        <div style="position:relative;height:6px;border-radius:99px;background:#101d33;border:1px solid #14203a;overflow:hidden;">
          <span style="position:absolute;top:0;bottom:0;left:${pct(ovr)}%;right:0;background:repeating-linear-gradient(90deg,rgba(74,222,128,.16) 0 3px,transparent 3px 6px);"></span>
          <span style="position:absolute;inset:0 auto 0 0;width:${pct(ovr)}%;border-radius:99px;background:linear-gradient(90deg,#0e7490,#22d3ee);"></span>
          <span style="position:absolute;top:-3px;left:${pct(pot)}%;width:2px;height:12px;background:#4ade80;box-shadow:0 0 6px #4ade80;"></span>
        </div>
      </div>
    </div>`;
}

function render(): void {
  const sub = $('contract-renewal-subtitle');
  if (sub) sub.textContent = `Saison ${currentSeason} · Auswahl bis 01.08. · alle ${candidates.length} wählbar`;

  const body = $('contract-renewal-body');
  if (!body) return;
  if (candidates.length === 0) {
    body.innerHTML = `<div style="padding:24px;color:#8494ad;">Keine Fahrer mit auslaufendem Vertrag zur Auswahl.</div>`;
  } else {
    body.innerHTML = `
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:2px 2px 10px;">
        <div style="color:#94a3b8;font-size:12px;line-height:1.5;">
          Wähle beliebig viele — bis zu <strong style="color:#e2e8f0;">alle ${candidates.length}</strong> deiner Fahrer mit auslaufendem Vertrag. Am 01.08. verlängern davon zufällig 50–80%. Fahrer, die ihr Karriereende erreichen würden, sind nicht wählbar.
          <br><span style="color:#6a7a95;">Ohne Bestätigung wählt das Spiel nach Ablauf der Uhr selbst: keine Fahrer ab ${AUTO_SELECT_MAX_AGE}, von den übrigen die besten ${Math.round(AUTO_SELECT_SHARE * 100)}%.</span>
        </div>
        <span id="contract-renewal-clock" title="Bis zur automatischen Auswahl" style="${MONO};flex:none;font-size:13px;font-weight:800;color:#8b9ab4;border:1px solid #1e2c49;border-radius:8px;padding:4px 9px;background:#0b1120;">5:00</span>
      </div>
      <div id="contract-renewal-list" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;max-height:56vh;overflow-y:auto;padding-right:4px;">${candidates.map(karte).join('')}</div>`;
  }

  body.insertAdjacentHTML('beforeend', `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px;padding-top:12px;border-top:1px solid #1e2c49;">
      <span id="contract-renewal-counter" style="${MONO};font-size:12px;font-weight:800;color:${selected.size >= maxSelectable ? '#fbbf24' : '#22d3ee'};">${selected.size} / ${maxSelectable} ausgewählt</span>
      <button id="contract-renewal-confirm" class="btn btn-primary" ${saving ? 'disabled' : ''} style="padding:0.55rem 1.4rem;font-weight:800;">${saving ? 'Speichere…' : 'Auswahl bestätigen'}</button>
    </div>`);
  zeichneUhr();
}

/**
 * Nur die angeklickte Karte und den Zaehler nachziehen.
 *
 * Frueher wurde bei jedem Klick die ganze Liste neu gebaut — damit war der
 * Scrollcontainer weg und die Liste sprang an den Anfang zurueck. Wer weiter
 * unten auswaehlte, musste sich jedes Mal neu herunterscrollen.
 */
function aktualisiereKarte(riderId: number): void {
  const row = document.querySelector<HTMLElement>(`.contract-renewal-row[data-rider-id="${riderId}"]`);
  const c = candidates.find((k) => k.riderId === riderId);
  if (row && c) {
    row.outerHTML = karte(c);
  }
  // Die Deckelung kann andere Karten sperren oder freigeben.
  const atLimit = selected.size >= maxSelectable;
  document.querySelectorAll<HTMLElement>('.contract-renewal-row').forEach((el) => {
    const on = el.dataset['on'] === '1';
    const disabled = !on && atLimit;
    el.style.cursor = disabled ? 'not-allowed' : 'pointer';
    el.style.opacity = disabled ? '0.5' : '1';
  });
  const counter = document.getElementById('contract-renewal-counter');
  if (counter) {
    counter.textContent = `${selected.size} / ${maxSelectable} ausgewählt`;
    counter.style.color = atLimit ? '#fbbf24' : '#22d3ee';
  }
}

async function bestaetige(): Promise<void> {
  if (saving) return;
  saving = true;
  const btn = document.getElementById('contract-renewal-confirm') as HTMLButtonElement | null;
  if (btn) { btn.disabled = true; btn.textContent = 'Speichere…'; }
  const res = await api.saveContractRenewalSelection([...selected]);
  saving = false;
  if (!res.success) {
    alert(res.error || 'Auswahl konnte nicht gespeichert werden.');
    geoeffnet = false;
    await openContractRenewalModal();
    return;
  }
  stoppeUhr();
  geoeffnet = false;
  hideModal('contractRenewal');
  await loadGameState(); // pending-Flag zuruecksetzen, Tageswechsel wieder freigeben
}

export function initContractRenewalView(): void {
  const body = $('contract-renewal-body');
  if (!body) return;

  body.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;

    if (target.closest('#contract-renewal-confirm')) {
      await bestaetige();
      return;
    }

    const row = target.closest<HTMLElement>('.contract-renewal-row');
    if (row) {
      const id = Number(row.dataset['riderId']);
      if (!Number.isFinite(id)) return;
      if (selected.has(id)) {
        selected.delete(id);
      } else {
        if (selected.size >= maxSelectable) return; // Limit
        selected.add(id);
      }
      aktualisiereKarte(id);
    }
  });
}
