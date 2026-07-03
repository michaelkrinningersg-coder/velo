export type RiderLoadWarningLevel = 'none' | 'warning' | 'critical';

export interface RiderLoadSummary {
  seasonRaceDaysTotal: number;
  rolling30dRaceDays: number;
  longTermFatigueMalus: number;
  shortTermFatigueMalus: number;
  totalFatigueLoadMalus: number;
  shortTermFatigueWarning: RiderLoadWarningLevel;
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export function resolveLongTermFatigueMalus(seasonRaceDaysTotal: number, age = 25): number {
  if (seasonRaceDaysTotal < 50) {
    return 0;
  }

  const overloadDays = seasonRaceDaysTotal - 50;
  const baseMalus = (0.0004 * (overloadDays ** 2)) + (0.05 * overloadDays);
  return roundToTwoDecimals(age <= 22 ? baseMalus * 1.5 : baseMalus);
}

export function resolveShortTermFatigueMalus(rolling30dRaceDays: number, age = 25): number {
  return 0;
}

export function resolveShortTermFatigueWarning(rolling30dRaceDays: number): RiderLoadWarningLevel {
  return 'none';
}

export function buildRiderLoadSummary(seasonRaceDaysTotal: number, rolling30dRaceDays: number, age = 25): RiderLoadSummary {
  const longTermFatigueMalus = resolveLongTermFatigueMalus(seasonRaceDaysTotal, age);
  const shortTermFatigueMalus = resolveShortTermFatigueMalus(rolling30dRaceDays, age);
  return {
    seasonRaceDaysTotal,
    rolling30dRaceDays,
    longTermFatigueMalus,
    shortTermFatigueMalus,
    totalFatigueLoadMalus: roundToTwoDecimals(longTermFatigueMalus + shortTermFatigueMalus),
    shortTermFatigueWarning: resolveShortTermFatigueWarning(rolling30dRaceDays),
  };
}
