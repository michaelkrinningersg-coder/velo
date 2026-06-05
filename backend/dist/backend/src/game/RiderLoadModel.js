"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveLongTermFatigueMalus = resolveLongTermFatigueMalus;
exports.resolveShortTermFatigueMalus = resolveShortTermFatigueMalus;
exports.resolveShortTermFatigueWarning = resolveShortTermFatigueWarning;
exports.buildRiderLoadSummary = buildRiderLoadSummary;
function roundToTwoDecimals(value) {
    return Math.round(value * 100) / 100;
}
function resolveLongTermFatigueMalus(seasonRaceDaysTotal) {
    if (seasonRaceDaysTotal < 50) {
        return 0;
    }
    const overloadDays = seasonRaceDaysTotal - 50;
    return roundToTwoDecimals((0.0004 * (overloadDays ** 2)) + (0.05 * overloadDays));
}
function resolveShortTermFatigueMalus(rolling30dRaceDays) {
    if (rolling30dRaceDays <= 10) {
        return 0;
    }
    if (rolling30dRaceDays <= 15) {
        return roundToTwoDecimals((rolling30dRaceDays - 10) * 0.1);
    }
    if (rolling30dRaceDays <= 20) {
        return roundToTwoDecimals(0.5 + ((rolling30dRaceDays - 15) * 0.1));
    }
    if (rolling30dRaceDays <= 25) {
        return roundToTwoDecimals(1 + ((rolling30dRaceDays - 20) * 0.5));
    }
    return roundToTwoDecimals(3.5 + ((rolling30dRaceDays - 25) * 0.75));
}
function resolveShortTermFatigueWarning(rolling30dRaceDays) {
    if (rolling30dRaceDays > 25) {
        return 'critical';
    }
    if (rolling30dRaceDays > 20) {
        return 'warning';
    }
    return 'none';
}
function buildRiderLoadSummary(seasonRaceDaysTotal, rolling30dRaceDays) {
    const longTermFatigueMalus = resolveLongTermFatigueMalus(seasonRaceDaysTotal);
    const shortTermFatigueMalus = resolveShortTermFatigueMalus(rolling30dRaceDays);
    return {
        seasonRaceDaysTotal,
        rolling30dRaceDays,
        longTermFatigueMalus,
        shortTermFatigueMalus,
        totalFatigueLoadMalus: roundToTwoDecimals(longTermFatigueMalus + shortTermFatigueMalus),
        shortTermFatigueWarning: resolveShortTermFatigueWarning(rolling30dRaceDays),
    };
}
