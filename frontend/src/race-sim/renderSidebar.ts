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

function formatNumber(value: number): string {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function labelValue(value: string): string {
  return value.replace(/_/g, ' ');
}

function formatTerrain(value: RealtimeRiderSnapshot['activeTerrain']): string {
  return labelValue(value);
}

function formatSkill(value: RealtimeRiderSnapshot['skillName']): string {
  return labelValue(value);
}

function renderBaseSkillCell(rider: RealtimeRiderSnapshot): string {
  if (!rider.skillBreakdown) {
    return formatNumber(rider.baseSkill);
  }

  return `${formatNumber(rider.baseSkill)}<span class="race-sim-row-detail">${esc(rider.skillBreakdown)}</span>`;
}

function getEffectiveSkillClassName(rider: RealtimeRiderSnapshot): string {
  if (rider.effectiveSkill > rider.baseSkill) {
    return 'race-sim-skill-effective-good';
  }
  if (rider.effectiveSkill < rider.baseSkill) {
    return 'race-sim-skill-effective-bad';
  }
  return 'race-sim-skill-effective-equal';
}

function getFormClassName(value: number): string {
  if (value > 0.5) {
    return 'race-sim-form-positive';
  }
  if (value < -0.5) {
    return 'race-sim-form-negative';
  }
  return '';
}

function getSlopeClassName(value: number): string {
  if (value > 10) {
    return 'race-sim-slope-climb-hard';
  }
  if (value > 3) {
    return 'race-sim-slope-climb-light';
  }
  if (value < -10) {
    return 'race-sim-slope-descent-hard';
  }
  if (value < -3) {
    return 'race-sim-slope-descent-light';
  }
  return '';
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
  const splitDetail = rider.lastSplitLabel && rider.lastSplitTimeSeconds != null
    ? `<span class="race-sim-row-detail">${esc(rider.lastSplitLabel)} · ${esc(formatClock(rider.lastSplitTimeSeconds))}</span>`
    : '';
  return `<span class="race-sim-row-rank">${position}.</span>${flag}<span>${esc(rider.riderName)}${teamSuffix}</span>${leadingBadge}${splitDetail}`;
}

function formatSpeed(speedMps: number): string {
  return `${(speedMps * 3.6).toFixed(1)} km/h`;
}

function formatGradientPercent(value: number): string {
  return `${formatSigned(value)}%`;
}

function formatClock(seconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function formatStartOffset(seconds: number): string {
  return `+${formatClock(seconds)}`;
}

function formatGcGap(seconds: number): string {
  if (seconds <= 0) {
    return '—';
  }

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (minutes > 0) {
    return `+${minutes}:${String(remainder).padStart(2, '0')}`;
  }
  return `+${remainder}s`;
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
    <div class="race-sim-row-grid">
      <span class="race-sim-row-name" data-race-sim-field="name"></span>
      <strong class="race-sim-gap" data-race-sim-field="gap"></strong>
      <strong data-race-sim-field="clock"></strong>
      <strong data-race-sim-field="terrain"></strong>
      <strong data-race-sim-field="base-skill"></strong>
      <strong data-race-sim-field="team-bonus"></strong>
      <strong data-race-sim-field="season-form-bonus"></strong>
      <strong data-race-sim-field="race-form-bonus"></strong>
      <strong data-race-sim-field="effective-skill"></strong>
      <strong data-race-sim-field="stamina"></strong>
      <strong data-race-sim-field="height-factor"></strong>
      <strong data-race-sim-field="daily-form"></strong>
      <strong data-race-sim-field="micro-form"></strong>
      <strong data-race-sim-field="gc-rank"></strong>
      <strong data-race-sim-field="gc-gap"></strong>
      <strong data-race-sim-field="slope"></strong>
      <strong data-race-sim-field="gradient"></strong>
      <strong data-race-sim-field="wind"></strong>
      <strong data-race-sim-field="draft"></strong>
      <strong data-race-sim-field="speed"></strong>
    </div>`;
  container.appendChild(row);
  return row;
}

export function renderRaceSimSidebar(
  container: HTMLElement,
  snapshot: SimulationSnapshot,
  bootstrap: RealtimeSimulationBootstrap,
): void {
  const sortedRiders = [...snapshot.riders].sort((left, right) => {
    if (left.isFinished !== right.isFinished) {
      return left.isFinished ? 1 : -1;
    }

    if (left.isFinished && right.isFinished) {
      return (left.finishTimeSeconds ?? Number.POSITIVE_INFINITY) - (right.finishTimeSeconds ?? Number.POSITIVE_INFINITY)
        || left.riderId - right.riderId;
    }

    return right.distanceCoveredMeters - left.distanceCoveredMeters
      || left.riderId - right.riderId;
  });

  const riderById = new Map(bootstrap.riders.map((rider) => [rider.id, rider]));
  const teamAbbreviationById = new Map((bootstrap.teams ?? []).map((team) => [team.id, team.abbreviation]));
  const gcByRiderId = new Map((bootstrap.gcStandings ?? []).map((row) => [row.riderId, row]));
  const visibleRiderIds = new Set(sortedRiders.map((rider) => rider.riderId));

  container.querySelectorAll<HTMLElement>('[data-race-sim-rider-row]').forEach((row) => {
    const riderId = Number(row.dataset['raceSimRiderRow']);
    if (!visibleRiderIds.has(riderId)) {
      row.remove();
    }
  });

  for (const [index, rider] of sortedRiders.entries()) {
    const row = ensureSidebarRow(container, rider.riderId);
    row.classList.toggle('race-sim-row-leader', index === 0);
    const sourceRider = riderById.get(rider.riderId) ?? null;

    const nameField = row.querySelector<HTMLElement>('[data-race-sim-field="name"]');
    const gapField = row.querySelector<HTMLElement>('[data-race-sim-field="gap"]');
    const clockField = row.querySelector<HTMLElement>('[data-race-sim-field="clock"]');
    const terrainField = row.querySelector<HTMLElement>('[data-race-sim-field="terrain"]');
    const baseSkillField = row.querySelector<HTMLElement>('[data-race-sim-field="base-skill"]');
    const teamBonusField = row.querySelector<HTMLElement>('[data-race-sim-field="team-bonus"]');
    const seasonFormBonusField = row.querySelector<HTMLElement>('[data-race-sim-field="season-form-bonus"]');
    const raceFormBonusField = row.querySelector<HTMLElement>('[data-race-sim-field="race-form-bonus"]');
    const effectiveSkillField = row.querySelector<HTMLElement>('[data-race-sim-field="effective-skill"]');
    const staminaField = row.querySelector<HTMLElement>('[data-race-sim-field="stamina"]');
    const heightFactorField = row.querySelector<HTMLElement>('[data-race-sim-field="height-factor"]');
    const dailyFormField = row.querySelector<HTMLElement>('[data-race-sim-field="daily-form"]');
    const microFormField = row.querySelector<HTMLElement>('[data-race-sim-field="micro-form"]');
    const gcRankField = row.querySelector<HTMLElement>('[data-race-sim-field="gc-rank"]');
    const gcGapField = row.querySelector<HTMLElement>('[data-race-sim-field="gc-gap"]');
    const slopeField = row.querySelector<HTMLElement>('[data-race-sim-field="slope"]');
    const gradientField = row.querySelector<HTMLElement>('[data-race-sim-field="gradient"]');
    const windField = row.querySelector<HTMLElement>('[data-race-sim-field="wind"]');
    const draftField = row.querySelector<HTMLElement>('[data-race-sim-field="draft"]');
    const speedField = row.querySelector<HTMLElement>('[data-race-sim-field="speed"]');

    if (nameField) {
      const teamAbbreviation = sourceRider?.activeTeamId != null
        ? teamAbbreviationById.get(sourceRider.activeTeamId) ?? null
        : null;
      nameField.innerHTML = renderRiderLabel(index + 1, rider, sourceRider, teamAbbreviation);
    }
    if (gapField) {
      gapField.textContent = formatGap(rider.gapToLeaderMeters);
    }
    if (clockField) {
      if (bootstrap.stage.profile !== 'ITT') {
        clockField.textContent = '—';
      } else if (!rider.hasStarted) {
        clockField.textContent = formatStartOffset(rider.startOffsetSeconds);
      } else if (rider.riderClockSeconds != null) {
        clockField.textContent = formatClock(rider.riderClockSeconds);
      } else {
        clockField.textContent = '—';
      }
    }
    if (terrainField) {
      terrainField.textContent = `${formatTerrain(rider.activeTerrain)} / ${formatSkill(rider.skillName)}`;
    }
    if (baseSkillField) {
      baseSkillField.innerHTML = renderBaseSkillCell(rider);
    }
    if (teamBonusField) {
      teamBonusField.textContent = rider.teamGroupBonus > 0 ? `+${formatNumber(rider.teamGroupBonus)}` : '—';
      teamBonusField.className = rider.teamGroupBonus > 0 ? 'race-sim-team-bonus' : '';
    }
    if (seasonFormBonusField) {
      const seasonFormBonus = sourceRider?.formBonus ?? 0;
      seasonFormBonusField.textContent = seasonFormBonus !== 0 ? formatSigned(seasonFormBonus) : '—';
      seasonFormBonusField.className = getFormClassName(seasonFormBonus);
    }
    if (raceFormBonusField) {
      const raceFormBonus = sourceRider?.raceFormBonus ?? 0;
      raceFormBonusField.textContent = raceFormBonus > 0 ? `+${formatNumber(raceFormBonus)}` : '—';
      raceFormBonusField.className = raceFormBonus > 0 ? 'race-sim-form-positive' : '';
    }
    if (effectiveSkillField) {
      effectiveSkillField.textContent = formatNumber(rider.effectiveSkill);
      effectiveSkillField.classList.remove(
        'race-sim-skill-effective-good',
        'race-sim-skill-effective-equal',
        'race-sim-skill-effective-bad',
      );
      effectiveSkillField.classList.add(getEffectiveSkillClassName(rider));
    }
    if (staminaField) {
      staminaField.textContent = `x${rider.staminaModifier.toFixed(2)}`;
    }
    if (heightFactorField) {
      heightFactorField.textContent = `x${rider.elevationGainModifier.toFixed(2)}`;
    }
    if (dailyFormField) {
      dailyFormField.textContent = formatSigned(rider.dailyForm);
      dailyFormField.className = getFormClassName(rider.dailyForm);
    }
    if (microFormField) {
      microFormField.textContent = formatSigned(rider.microForm);
      microFormField.className = getFormClassName(rider.microForm);
    }
    if (gcRankField) {
      const gcStanding = bootstrap.race.isStageRace && bootstrap.stage.stageNumber > 1 ? gcByRiderId.get(rider.riderId) ?? null : null;
      gcRankField.textContent = gcStanding ? String(gcStanding.rank) : '—';
    }
    if (gcGapField) {
      const gcStanding = bootstrap.race.isStageRace && bootstrap.stage.stageNumber > 1 ? gcByRiderId.get(rider.riderId) ?? null : null;
      gcGapField.textContent = gcStanding ? formatGcGap(gcStanding.gapSeconds) : '—';
    }
    if (slopeField) {
      slopeField.textContent = formatGradientPercent(rider.gradientPercent);
      slopeField.className = getSlopeClassName(rider.gradientPercent);
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