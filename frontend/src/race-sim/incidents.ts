import type { CrashSeverity, PrecalculatedRaceIncident, Rider, Stage, StageProfile } from '../../../shared/types';

const WEATHER_PROFILES: Record<number, { pref: number[]; malus: number[]; neutral: number[] }> = {
  1: { pref: [1, 2], malus: [4, 7], neutral: [3, 5, 6] },
  2: { pref: [3, 5], malus: [2, 7], neutral: [1, 4, 6] },
  3: { pref: [4, 7], malus: [2, 5], neutral: [1, 3, 6] },
  4: { pref: [6, 7], malus: [2, 5], neutral: [1, 3, 4] },
  5: { pref: [1, 5], malus: [6, 7], neutral: [2, 3, 4] },
  6: { pref: [1, 3], malus: [4, 7], neutral: [2, 5, 6] },
  7: { pref: [3, 4], malus: [2, 7], neutral: [1, 5, 6] },
};

function getWeatherRelation(profileId: number, weatherId: number): 'pref' | 'malus' | 'neutral' {
  const profile = WEATHER_PROFILES[profileId] || WEATHER_PROFILES[1];
  if (profile.pref.includes(weatherId)) return 'pref';
  if (profile.malus.includes(weatherId)) return 'malus';
  return 'neutral';
}

const BASE_CRASH_CHANCE = 0.005;
const BASE_MECHANICAL_CHANCE = 0.005;
const EARLY_INCIDENT_THRESHOLD_PERCENT = 70;
const EARLY_RECOVERY_SECONDS = 1000;
const EARLY_RECOVERY_FORM_BONUS = 15;
const LATE_RECOVERY_SECONDS = 360;
const LATE_RECOVERY_FORM_BONUS = 8;
const BASE_DAY_FORM_PENALTY = -0.75;
const BASE_STAMINA_PENALTY = 10;

function randomBetween(min: number, max: number): number {
  return min + (Math.random() * (max - min));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function isIncidentFreeStage(profile: StageProfile): boolean {
  return profile === 'ITT' || profile === 'TTT';
}

function resolveSupportRiderIds(rider: Rider, riders: Rider[]): number[] {
  if (rider.role?.name !== 'Kapitaen' || rider.activeTeamId == null) {
    return [];
  }

  return riders
    .filter((candidate) => (
      candidate.id !== rider.id
      && candidate.activeTeamId === rider.activeTeamId
      && (
        candidate.role?.name === 'Edelhelfer'
        || candidate.role?.name === 'Starke Helfer'
        || candidate.role?.name === 'Wassertraeger'
      )
    ))
    .map((candidate) => candidate.id);
}

function resolveCrashSeverity(): CrashSeverity {
  const roll = Math.random();
  if (roll < 0.1) {
    return 'severe';
  }
  if (roll < 0.35) {
    return 'medium';
  }
  return 'light';
}

function buildIncident(
  rider: Rider,
  riders: Rider[],
  stageLengthKm: number,
  type: 'crash' | 'mechanical',
): PrecalculatedRaceIncident {
  const severity = type === 'crash' ? resolveCrashSeverity() : null;
  const triggerDistanceKm = Number(randomBetween(0.5, Math.max(0.6, stageLengthKm - 0.25)).toFixed(2));
  const triggerDistanceMeters = Math.round(triggerDistanceKm * 1000);
  const triggerDistancePercent = clamp((triggerDistanceKm / Math.max(0.1, stageLengthKm)) * 100, 0, 100);
  const isEarlyIncident = triggerDistancePercent <= EARLY_INCIDENT_THRESHOLD_PERCENT;

  return {
    riderId: rider.id,
    type,
    severity,
    triggerDistanceKm,
    triggerDistanceMeters,
    triggerDistancePercent,
    waitDurationSeconds: type === 'crash'
      ? Math.round(randomBetween(10, 60))
      : Math.round(randomBetween(10, 45)),
    recoverySeconds: isEarlyIncident ? EARLY_RECOVERY_SECONDS : LATE_RECOVERY_SECONDS,
    recoveryFormBonus: isEarlyIncident ? EARLY_RECOVERY_FORM_BONUS : LATE_RECOVERY_FORM_BONUS,
    dayFormPenalty: BASE_DAY_FORM_PENALTY,
    staminaPenalty: BASE_STAMINA_PENALTY,
    recoveryPenaltyStages: type === 'crash'
      ? (severity === 'light' ? [10, 5, 2] : [])
      : [],
    raceRecuperationPenalty: type === 'crash' ? (severity === 'medium' ? 15 : 0) : 0,
    supportRiderIds: resolveSupportRiderIds(rider, riders),
  };
}

export function precalculateRaceIncidents(riders: Rider[], stage: Stage, stageLengthKm: number): PrecalculatedRaceIncident[] {
  if (isIncidentFreeStage(stage.profile) || stageLengthKm <= 0) {
    return [];
  }

  const incidents: PrecalculatedRaceIncident[] = [];
  for (const rider of riders) {
    const crashRoll = Math.random();
    const mechanicalRoll = Math.random();
    const baseCrashChance = BASE_CRASH_CHANCE * Math.max(0, stage.crashIncidentMultiplier ?? 1);
    const baseMechanicalChance = BASE_MECHANICAL_CHANCE * Math.max(0, stage.mechanicalIncidentMultiplier ?? 1);
    let crashChance = baseCrashChance + (stage.rolledEffektSturz ?? 0) / 100;
    let mechanicalChance = baseMechanicalChance + (stage.rolledEffektDefekt ?? 0) / 100;

    const weatherId = stage.rolledWeatherId || 1;
    const profileId = rider.weatherProfileId || 1;
    const relation = getWeatherRelation(profileId, weatherId);
    if (relation === 'pref') {
      crashChance *= 0.5;
      mechanicalChance *= 0.5;
    }

    const crashHit = crashRoll < crashChance;
    const mechanicalHit = mechanicalRoll < mechanicalChance;

    if (!crashHit && !mechanicalHit) {
      continue;
    }

    const incidentType = crashHit && mechanicalHit
      ? (crashRoll <= mechanicalRoll ? 'crash' : 'mechanical')
      : crashHit
        ? 'crash'
        : 'mechanical';

    const incident = buildIncident(rider, riders, stageLengthKm, incidentType);

    if (incidentType === 'crash' && Math.random() < 0.01) {
      incident.isMassCrashTrigger = true;
      const numAffected = Math.floor(randomBetween(2, 26)); // 2 to 25
      const potentialVictims = riders.filter(r => r.id !== rider.id);
      const shuffled = [...potentialVictims].sort(() => 0.5 - Math.random());
      incident.massCrashPotentialRiderIds = shuffled.slice(0, numAffected).map(r => r.id);

      if (Math.random() < 0.20) {
        incident.hasAdditionalMechanical = true;
        incident.waitDurationSeconds += Math.round(randomBetween(10, 45));
      }
    }

    incidents.push(incident);
  }

  return incidents;
}

export function buildDynamicCrashIncident(
  rider: Rider,
  riders: Rider[],
  triggerDistanceKm: number,
  stageLengthKm: number
): PrecalculatedRaceIncident {
  const severity = resolveCrashSeverity();
  const triggerDistanceMeters = Math.round(triggerDistanceKm * 1000);
  const triggerDistancePercent = clamp((triggerDistanceKm / Math.max(0.1, stageLengthKm)) * 100, 0, 100);
  const isEarlyIncident = triggerDistancePercent <= EARLY_INCIDENT_THRESHOLD_PERCENT;

  let waitDurationSeconds = Math.round(randomBetween(10, 60));
  let hasAdditionalMechanical = false;
  if (Math.random() < 0.20) {
    hasAdditionalMechanical = true;
    waitDurationSeconds += Math.round(randomBetween(10, 45));
  }

  return {
    riderId: rider.id,
    type: 'crash',
    severity,
    triggerDistanceKm,
    triggerDistanceMeters,
    triggerDistancePercent,
    waitDurationSeconds,
    recoverySeconds: isEarlyIncident ? EARLY_RECOVERY_SECONDS : LATE_RECOVERY_SECONDS,
    recoveryFormBonus: isEarlyIncident ? EARLY_RECOVERY_FORM_BONUS : LATE_RECOVERY_FORM_BONUS,
    dayFormPenalty: BASE_DAY_FORM_PENALTY,
    staminaPenalty: BASE_STAMINA_PENALTY,
    recoveryPenaltyStages: severity === 'light' ? [10, 5, 2] : [],
    raceRecuperationPenalty: severity === 'medium' ? 15 : 0,
    supportRiderIds: resolveSupportRiderIds(rider, riders),
    hasAdditionalMechanical
  };
}

export function precalculate_race_incidents(rider_list: Rider[], stage_length: number, stage_profile: StageProfile): PrecalculatedRaceIncident[] {
  return precalculateRaceIncidents(
    rider_list,
    {
      id: 0,
      raceId: 0,
      stageNumber: 1,
      date: '',
      profile: stage_profile,
      detailsCsvFile: '',
      startElevation: 0,
      finalSpreadStartPercent: 70,
      finalPushStartPercent: 90,
      finalSpreadDifficultyMultiplier: 1,
      crashIncidentMultiplier: 1,
      mechanicalIncidentMultiplier: 1,
    },
    stage_length,
  );
}