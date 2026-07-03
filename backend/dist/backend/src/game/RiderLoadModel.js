"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveLongTermFatigueMalus = resolveLongTermFatigueMalus;
exports.resolveShortTermFatigueMalus = resolveShortTermFatigueMalus;
exports.resolveShortTermFatigueWarning = resolveShortTermFatigueWarning;
exports.buildRiderLoadSummary = buildRiderLoadSummary;
function roundToTwoDecimals(value) {
    return Math.round(value * 100) / 100;
}
function resolveLongTermFatigueMalus(seasonRaceDaysTotal, age = 25) {
    if (seasonRaceDaysTotal < 50) {
        return 0;
    }
    const overloadDays = seasonRaceDaysTotal - 50;
    const baseMalus = (0.0004 * (overloadDays ** 2)) + (0.05 * overloadDays);
    return roundToTwoDecimals(age <= 22 ? baseMalus * 1.5 : baseMalus);
}
function resolveShortTermFatigueMalus(rolling30dRaceDays, age = 25) {
    return 0;
}
function resolveShortTermFatigueWarning(rolling30dRaceDays) {
    return 'none';
}
function buildRiderLoadSummary(seasonRaceDaysTotal, rolling30dRaceDays, age = 25) {
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
