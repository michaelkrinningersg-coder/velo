import type { RealtimeSimulationBootstrap, Rider } from '../../../shared/types';
import type { RealtimeRiderSnapshot, SimulationSnapshot } from './SimulationEngine';
import { renderFlag } from './flags';

function esc(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function formatGap(meters: number): string {
  if (meters <= 0) {
    return '—';
  }
  return `+${Math.round(meters)} m`;
}

function formatSigned(value: number): string {
  const formatted = value.toLocaleString('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return value > 0 ? `+${formatted}` : formatted;
}

function labelValue(value: string): string {
  return value.replace(/_/g, ' ');
}

function formatTerrainAndSkill(rider: RealtimeRiderSnapshot): string {
  if (rider.isFinished) {
    return 'Finish';
  }

  const terrainLabel = labelValue(rider.activeTerrain);
  const skillLabel = labelValue(rider.skillName);
  return terrainLabel === skillLabel ? terrainLabel : `${terrainLabel} -> ${skillLabel}`;
}

function getRiderCountryCode(rider: Rider): string {
  return rider.country?.code3 ?? rider.nationality;
}

function renderRiderLabel(position: number, rider: RealtimeRiderSnapshot, sourceRider: Rider | null, teamAbbreviation: string | null): string {
  const flag = sourceRider ? renderFlag(getRiderCountryCode(sourceRider)) : '';
  const teamSuffix = teamAbbreviation ? ` (${esc(teamAbbreviation)})` : '';
  const leadingBadge = rider.isLeadingGroup && !rider.isFinished
    ? '<span class="race-sim-leading-badge">Leading Group</span>'
    : '';
  return `<span class="race-sim-row-rank">${position}.</span>${flag}<span>${esc(rider.riderName)}${teamSuffix}</span>${leadingBadge}`;
}

function formatSpeed(speedMps: number): string {
  return `${(speedMps * 3.6).toFixed(1)} km/h`;
}

function ensureSidebarRow(container: HTMLElement, riderId: number): HTMLElement {
  const existingRow = container.querySelector<HTMLElement>(`[data-race-sim-rider-row="${riderId}"]`);
  if (existingRow) {
    return existingRow;
  }

  const row = document.createElement('article');
  row.dataset['raceSimRiderRow'] = String(riderId);
  row.className = 'race-sim-row';
  row.innerHTML = `
    <button type="button" class="race-sim-row-toggle" data-race-sim-rider-toggle="${riderId}" aria-expanded="false">
      <span class="race-sim-row-name" data-race-sim-field="name"></span>
      <span class="race-sim-row-headline">
        <span class="race-sim-gap" data-race-sim-field="gap"></span>
        <span class="race-sim-row-caret" data-race-sim-field="caret">▸</span>
      </span>
    </button>
    <div class="race-sim-row-grid" hidden>
      <span class="race-sim-metric-label">Terrain / Skill</span>
      <strong data-race-sim-field="terrain-skill"></strong>
      <span class="race-sim-metric-label">Base Skill</span>
      <strong data-race-sim-field="base-skill"></strong>
      <span class="race-sim-metric-label">Form</span>
      <strong data-race-sim-field="form"></strong>
      <span class="race-sim-metric-label">M_grad</span>
      <strong data-race-sim-field="gradient"></strong>
      <span class="race-sim-metric-label">M_wind</span>
      <strong data-race-sim-field="wind"></strong>
      <span class="race-sim-metric-label">Draft</span>
      <strong data-race-sim-field="draft"></strong>
      <span class="race-sim-metric-label">Speed</span>
      <strong data-race-sim-field="speed"></strong>
    </div>`;
  container.appendChild(row);
  return row;
}

export function renderRaceSimSidebar(
  container: HTMLElement,
  snapshot: SimulationSnapshot,
  expandedRiderIds: ReadonlySet<number>,
  bootstrap: RealtimeSimulationBootstrap,
): void {
  const riderById = new Map(bootstrap.riders.map((rider) => [rider.id, rider]));
  const teamAbbreviationById = new Map((bootstrap.teams ?? []).map((team) => [team.id, team.abbreviation]));
  const visibleRiderIds = new Set(snapshot.riders.map((rider) => rider.riderId));

  container.querySelectorAll<HTMLElement>('[data-race-sim-rider-row]').forEach((row) => {
    const riderId = Number(row.dataset['raceSimRiderRow']);
    if (!visibleRiderIds.has(riderId)) {
      row.remove();
    }
  });

  for (const [index, rider] of snapshot.riders.entries()) {
    const row = ensureSidebarRow(container, rider.riderId);
    const isExpanded = expandedRiderIds.has(rider.riderId);
    row.classList.toggle('race-sim-row-leader', index === 0);
    row.classList.toggle('race-sim-row-expanded', isExpanded);

    const toggleButton = row.querySelector<HTMLButtonElement>('[data-race-sim-rider-toggle]');
    const detailGrid = row.querySelector<HTMLElement>('.race-sim-row-grid');
    const nameField = row.querySelector<HTMLElement>('[data-race-sim-field="name"]');
    const gapField = row.querySelector<HTMLElement>('[data-race-sim-field="gap"]');
    const caretField = row.querySelector<HTMLElement>('[data-race-sim-field="caret"]');
    const terrainSkillField = row.querySelector<HTMLElement>('[data-race-sim-field="terrain-skill"]');
    const baseSkillField = row.querySelector<HTMLElement>('[data-race-sim-field="base-skill"]');
    const formField = row.querySelector<HTMLElement>('[data-race-sim-field="form"]');
    const gradientField = row.querySelector<HTMLElement>('[data-race-sim-field="gradient"]');
    const windField = row.querySelector<HTMLElement>('[data-race-sim-field="wind"]');
    const draftField = row.querySelector<HTMLElement>('[data-race-sim-field="draft"]');
    const speedField = row.querySelector<HTMLElement>('[data-race-sim-field="speed"]');

    if (toggleButton) {
      toggleButton.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    }
    if (detailGrid) {
      detailGrid.hidden = !isExpanded;
    }
    if (nameField) {
      const sourceRider = riderById.get(rider.riderId) ?? null;
      const teamAbbreviation = sourceRider?.activeTeamId != null
        ? teamAbbreviationById.get(sourceRider.activeTeamId) ?? null
        : null;
      nameField.innerHTML = renderRiderLabel(index + 1, rider, sourceRider, teamAbbreviation);
    }
    if (gapField) {
      gapField.textContent = formatGap(rider.gapToLeaderMeters);
    }
    if (caretField) {
      caretField.textContent = isExpanded ? '▾' : '▸';
    }
    if (terrainSkillField) {
      terrainSkillField.textContent = formatTerrainAndSkill(rider);
    }
    if (baseSkillField) {
      baseSkillField.textContent = String(rider.baseSkill);
    }
    if (formField) {
      formField.textContent = `${formatSigned(rider.dailyForm)} / ${formatSigned(rider.microForm)}`;
    }
    if (gradientField) {
      gradientField.textContent = `x${rider.gradientModifier.toFixed(2)}`;
    }
    if (windField) {
      windField.textContent = `x${rider.windModifier.toFixed(2)}`;
    }
    if (draftField) {
      draftField.textContent = `x${rider.draftModifier.toFixed(2)}`;
    }
    if (speedField) {
      speedField.textContent = formatSpeed(rider.currentSpeedMps);
    }

    container.appendChild(row);
  }
}