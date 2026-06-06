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
    if (rolling30dRaceDays <= 10) {
        return 0;
    }
    let baseMalus = 0;
    if (rolling30dRaceDays <= 15) {
        baseMalus = (rolling30dRaceDays - 10) * 0.1;
    }
    else if (rolling30dRaceDays <= 20) {
        baseMalus = 0.5 + ((rolling30dRaceDays - 15) * 0.1);
    }
    else if (rolling30dRaceDays <= 25) {
        baseMalus = 1 + ((rolling30dRaceDays - 20) * 0.5);
    }
    else {
        baseMalus = 3.5 + ((rolling30dRaceDays - 25) * 0.75);
    }
    return roundToTwoDecimals(age <= 22 ? baseMalus * 1.5 : baseMalus);
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
