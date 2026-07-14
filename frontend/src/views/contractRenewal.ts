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
  if (sub) sub.textContent = `Saison ${currentSeason} · Auswahl bis 01.08. · alle ${candidates.length} wählbar`;

  const atLimit = selected.size >= maxSelectable;
  const mono = "font-family:'JetBrains Mono',monospace;font-variant-numeric:tabular-nums";
  // Telemetrie-Balken: Skala 60-85. OVR = cyanfarbene Fuellung, POT = gruene Marke
  // davor, die schraffierte Luecke dazwischen ist der Entwicklungsspielraum (+Δ).
  const SCALE_MIN = 60;
  const SCALE_MAX = 85;
  const pct = (v: number) => Math.max(0, Math.min(100, ((v - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100));
  const rows = candidates.map((c) => {
    const on = selected.has(c.riderId);
    const disabled = !on && atLimit;
    const border = on ? '#22d3ee' : '#1e2c49';
    const rowBg = on ? 'rgba(34,211,238,.07)' : '#0b1120';
    const selShadow = on ? 'box-shadow:inset 3px 0 0 #22d3ee;' : '';
    const flag = c.countryCode ? renderFlag(c.countryCode) : '';
    const ovr = Number(c.overallRating);
    const pot = Number(c.potential);
    const delta = pot - ovr;
    const ovrPct = pct(ovr);
    const potPct = pct(pot);
    const deltaLabel = delta >= 0.05 ? `+${delta.toFixed(1)}` : delta <= -0.05 ? delta.toFixed(1) : '±0.0';
    return `
      <div class="contract-renewal-row" data-rider-id="${c.riderId}" style="display:grid;grid-template-columns:24px minmax(120px,1fr) 40px minmax(160px,230px);align-items:center;gap:13px;padding:10px 13px;border:1px solid ${border};border-radius:10px;background:${rowBg};${selShadow}cursor:${disabled ? 'not-allowed' : 'pointer'};opacity:${disabled ? 0.5 : 1};">
        <span style="width:18px;height:18px;border-radius:5px;border:2px solid ${on ? '#22d3ee' : '#33415a'};background:${on ? '#22d3ee' : 'transparent'};display:flex;align-items:center;justify-content:center;color:#0b1120;font-weight:900;font-size:12px;flex:none;">${on ? '✓' : ''}</span>
        <span style="display:flex;align-items:center;gap:9px;min-width:0;">
          <span style="flex:none;display:inline-flex;">${flag}</span>
          <span style="font-weight:700;color:#e6ecf6;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(c.lastName)} <span style="color:#8b9ab4;font-weight:500;">${esc(c.firstName)}</span></span>
        </span>
        <span style="${mono};font-size:13px;font-weight:800;color:#fbbf24;">${c.age}<span style="font-size:9px;font-weight:700;color:#a8862a;"> J</span></span>
        <div style="display:flex;flex-direction:column;gap:5px;">
          <div style="display:flex;justify-content:space-between;${mono};font-size:11px;">
            <span style="color:#fbbf24;font-weight:800;">OVR ${ovr.toFixed(1)}</span>
            <span><span style="color:#a7b4cc;font-weight:700;">POT ${pot.toFixed(1)}</span> <span style="color:#4ade80;font-weight:800;">${deltaLabel}</span></span>
          </div>
          <div style="position:relative;height:7px;border-radius:99px;background:#101d33;border:1px solid #14203a;overflow:hidden;">
            <span style="position:absolute;top:0;bottom:0;left:${ovrPct}%;right:0;background:repeating-linear-gradient(90deg,rgba(74,222,128,.16) 0 3px,transparent 3px 6px);"></span>
            <span style="position:absolute;inset:0 auto 0 0;width:${ovrPct}%;border-radius:99px;background:linear-gradient(90deg,#0e7490,#22d3ee);"></span>
            <span style="position:absolute;top:-3px;left:${potPct}%;width:2px;height:13px;background:#4ade80;box-shadow:0 0 6px #4ade80;"></span>
          </div>
        </div>
      </div>`;
  }).join('');

  const body = $('contract-renewal-body');
  if (!body) return;
  if (candidates.length === 0) {
    body.innerHTML = `<div style="padding:24px;color:#8494ad;">Keine Fahrer mit auslaufendem Vertrag zur Auswahl.</div>`;
  } else {
    body.innerHTML = `
      <div style="padding:2px 2px 12px;color:#94a3b8;font-size:12.5px;line-height:1.5;">
        Wähle beliebig viele — bis zu <strong style="color:#e2e8f0;">alle ${candidates.length}</strong> deiner Fahrer mit auslaufendem Vertrag als Verlängerungsziele. Am 01.08. verlängern davon zufällig 50–80% ihren Vertrag. Fahrer, die ihr Karriereende erreichen würden, sind nicht wählbar.
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
