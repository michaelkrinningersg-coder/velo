import { api } from '../api';
import { $, esc, renderFlag, showModal, hideModal } from '../state';
import { loadGameState } from './dashboard';

// Blockierendes Auswahlfenster (10.01.): der Spieler waehlt bis zu 75% seiner
// Fahrer mit auslaufendem Vertrag als Verlaengerungsziele. Am 01.08. verlaengern
// davon zufaellig 35-65% (Backend). Retirement-Faelle sind nicht waehlbar.

let selected = new Set<number>();
let maxSelectable = 0;
let candidates: any[] = [];
let saving = false;
let currentSeason = 0;

export async function openContractRenewalModal(): Promise<void> {
  const res = await api.getContractRenewals();
  if (!res.success || !res.data) return;
  const p = res.data;
  candidates = p.candidates ?? [];
  maxSelectable = p.maxSelectable ?? 0;
  selected = new Set<number>(p.selectedRiderIds ?? []);
  currentSeason = p.season ?? 0;
  render();
  showModal('contractRenewal');
}

function render(): void {
  const sub = $('contract-renewal-subtitle');
  if (sub) sub.textContent = `Saison ${currentSeason} · Auswahl bis 01.08. · max. ${maxSelectable} von ${candidates.length}`;

  const atLimit = selected.size >= maxSelectable;
  const rows = candidates.map((c) => {
    const on = selected.has(c.riderId);
    const disabled = !on && atLimit;
    const border = on ? '#22d3ee' : '#1c2b47';
    const rowBg = on ? 'rgba(34,211,238,.08)' : '#0b1424';
    const mono = "font-family:'JetBrains Mono',monospace";
    const flag = c.countryCode ? renderFlag(c.countryCode) : '';
    // Broadcast-Stat-Kachel (Label oben, Wert im Chip darunter).
    const tile = (label: string, value: string, color: string, borderCol: string, bg: string) => `
      <span style="display:inline-flex;flex-direction:column;align-items:center;gap:2px;">
        <span style="${mono};font-size:8px;letter-spacing:.14em;color:#64748b;">${label}</span>
        <span style="${mono};font-size:13px;font-weight:800;color:${color};border:1px solid ${borderCol};background:${bg};border-radius:6px;padding:2px 9px;min-width:44px;text-align:center;line-height:1.1;">${value}</span>
      </span>`;
    return `
      <div class="contract-renewal-row" data-rider-id="${c.riderId}" style="display:grid;grid-template-columns:24px 1fr auto auto auto;align-items:center;gap:12px;padding:8px 12px;border:1px solid ${border};border-radius:9px;background:${rowBg};cursor:${disabled ? 'not-allowed' : 'pointer'};opacity:${disabled ? 0.5 : 1};">
        <span style="width:18px;height:18px;border-radius:5px;border:2px solid ${on ? '#22d3ee' : '#334155'};background:${on ? '#22d3ee' : 'transparent'};display:flex;align-items:center;justify-content:center;color:#0b1424;font-weight:900;font-size:12px;">${on ? '✓' : ''}</span>
        <span style="display:flex;align-items:center;gap:9px;min-width:0;">
          <span style="flex:none;display:inline-flex;">${flag}</span>
          <span style="font-weight:700;color:#e2e8f0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(c.lastName)} <span style="color:#8494ad;font-weight:500;">${esc(c.firstName)}</span></span>
        </span>
        <span style="${mono};font-size:13px;font-weight:800;color:#facc15;">${c.age}<span style="font-size:9px;font-weight:700;color:#a8862a;"> J</span></span>
        ${tile('POT', Number(c.potential).toFixed(1), '#94a3b8', '#2b3a55', 'rgba(148,163,184,.06)')}
        ${tile('OVR', Number(c.overallRating).toFixed(1), '#fbbf24', 'rgba(251,191,36,.45)', 'rgba(251,191,36,.07)')}
      </div>`;
  }).join('');

  const body = $('contract-renewal-body');
  if (!body) return;
  if (candidates.length === 0) {
    body.innerHTML = `<div style="padding:24px;color:#8494ad;">Keine Fahrer mit auslaufendem Vertrag zur Auswahl.</div>`;
  } else {
    body.innerHTML = `
      <div style="padding:2px 2px 12px;color:#94a3b8;font-size:12.5px;line-height:1.5;">
        Wähle bis zu <strong style="color:#e2e8f0;">${maxSelectable}</strong> (75%) deiner ${candidates.length} Fahrer mit auslaufendem Vertrag als Verlängerungsziele. Am 01.08. verlängern davon zufällig 35–65% ihren Vertrag. Fahrer, die ihr Karriereende erreichen würden, sind nicht wählbar.
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;max-height:52vh;overflow-y:auto;padding-right:4px;">${rows}</div>`;
  }

  // Kopf-/Footerzeile mit Zähler + Bestätigen
  body.insertAdjacentHTML('beforeend', `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px;padding-top:12px;border-top:1px solid #1e2c49;">
      <span style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:800;color:${selected.size >= maxSelectable ? '#fbbf24' : '#22d3ee'};">${selected.size} / ${maxSelectable} ausgewählt</span>
      <button id="contract-renewal-confirm" class="btn btn-primary" ${saving ? 'disabled' : ''} style="padding:0.55rem 1.4rem;font-weight:800;">${saving ? 'Speichere…' : 'Auswahl bestätigen'}</button>
    </div>`);
}

export function initContractRenewalView(): void {
  const body = $('contract-renewal-body');
  if (!body) return;

  body.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;

    const confirmBtn = target.closest('#contract-renewal-confirm');
    if (confirmBtn) {
      if (saving) return;
      saving = true;
      render(); // Button-Status aktualisieren
      const res = await api.saveContractRenewalSelection([...selected]);
      saving = false;
      if (!res.success) {
        alert(res.error || 'Auswahl konnte nicht gespeichert werden.');
        // Payload neu laden, um konsistent zu bleiben
        await openContractRenewalModal();
        return;
      }
      hideModal('contractRenewal');
      await loadGameState(); // pending-Flag zurücksetzen, Tageswechsel wieder freigeben
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
      render();
    }
  });
}
