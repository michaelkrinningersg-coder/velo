import { Race, Rider, TimeTrialEntry, TimeTrialResult } from '../../../shared/types';

const SPEED_BASE_FLAT     = 50.0;
const SPEED_BASE_HILLY    = 41.0;
const SPEED_BASE_MOUNTAIN = 30.0;
const ATTR_SPEED_FACTOR   = 0.28;
const FORM_MIN  = 0.88;
const FORM_MAX  = 1.12;
const NOISE_RANGE = 0.015;

export class TimeTrialSimulator {
  static simulate(race: Race, riders: Rider[]): TimeTrialResult {
    const { distanceKm, avgGradientKey } = race.profile;
    const baseSpeed = TimeTrialSimulator.resolveBaseSpeed(avgGradientKey);

    const entries: TimeTrialEntry[] = riders.map(rider =>
      TimeTrialSimulator.simulateRider(rider, distanceKm, baseSpeed),
    );
    entries.sort((a, b) => a.finishTimeSeconds - b.finishTimeSeconds);

    const leaderTime = entries[0].finishTimeSeconds;
    for (const entry of entries) {
      entry.gapSeconds   = entry.finishTimeSeconds - leaderTime;
      entry.gapFormatted = entry.gapSeconds === 0
        ? 'Führend'
        : '+' + TimeTrialSimulator.formatGap(entry.gapSeconds);
    }

    return { raceId: race.id, raceName: race.name, distanceKm, season: race.season, date: race.date, entries };
  }

  private static resolveBaseSpeed(avgGradient: number): number {
    if (avgGradient >= 5.0) return SPEED_BASE_MOUNTAIN;
    if (avgGradient >= 2.0) return SPEED_BASE_HILLY;
    return SPEED_BASE_FLAT;
  }

  private static simulateRider(rider: Rider, distanceKm: number, baseSpeed: number): TimeTrialEntry {
    const ttSkill = distanceKm <= 10
      ? rider.skills.timeTrial * 0.55 + rider.skills.prologue * 0.25 + rider.skills.acceleration * 0.1 + rider.skills.bikeHandling * 0.1
      : rider.skills.timeTrial * 0.7 + rider.skills.resistance * 0.15 + rider.skills.flat * 0.1 + rider.skills.prologue * 0.05;
    const attrDelta = (ttSkill - 50) * ATTR_SPEED_FACTOR;
    const noise     = (Math.random() * 2 - 1) * NOISE_RANGE;
    const dayForm   = FORM_MIN + Math.random() * (FORM_MAX - FORM_MIN);
    const speed     = Math.max(15, (baseSpeed + attrDelta) * dayForm * (1 + noise));
    const timeSec   = (distanceKm / speed) * 3600;

    return {
      rider,
      dayFormFactor:       Math.round(dayForm * 1000) / 1000,
      finishTimeSeconds:   timeSec,
      gapSeconds:          0,
      finishTimeFormatted: TimeTrialSimulator.formatTime(timeSec),
      gapFormatted:        '',
    };
  }

  private static formatTime(totalSec: number): string {
    const h  = Math.floor(totalSec / 3600);
    const m  = Math.floor((totalSec % 3600) / 60);
    const s  = Math.floor(totalSec % 60);
    const ms = Math.round((totalSec % 1) * 10);
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}.${ms}` : `${mm}:${ss}.${ms}`;
  }

  private static formatGap(gapSec: number): string {
    const m  = Math.floor(gapSec / 60);
    const s  = Math.floor(gapSec % 60);
    const ms = Math.round((gapSec % 1) * 10);
    const ss = String(s).padStart(2, '0');
    return `${m}:${ss}.${ms}`;
  }
}
