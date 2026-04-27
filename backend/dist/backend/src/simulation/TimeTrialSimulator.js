"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeTrialSimulator = void 0;
const SPEED_BASE_FLAT = 50.0;
const SPEED_BASE_HILLY = 41.0;
const SPEED_BASE_MOUNTAIN = 30.0;
const ATTR_SPEED_FACTOR = 0.28;
const FORM_MIN = 0.88;
const FORM_MAX = 1.12;
const NOISE_RANGE = 0.015;
class TimeTrialSimulator {
    static simulate(race, riders) {
        const { distanceKm, avgGradientKey } = race.profile;
        const baseSpeed = TimeTrialSimulator.resolveBaseSpeed(avgGradientKey);
        const entries = riders.map(rider => TimeTrialSimulator.simulateRider(rider, distanceKm, baseSpeed));
        entries.sort((a, b) => a.finishTimeSeconds - b.finishTimeSeconds);
        const leaderTime = entries[0].finishTimeSeconds;
        for (const entry of entries) {
            entry.gapSeconds = entry.finishTimeSeconds - leaderTime;
            entry.gapFormatted = entry.gapSeconds === 0
                ? 'Führend'
                : '+' + TimeTrialSimulator.formatGap(entry.gapSeconds);
        }
        return { raceId: race.id, raceName: race.name, distanceKm, season: race.season, date: race.date, entries };
    }
    static resolveBaseSpeed(avgGradient) {
        if (avgGradient >= 5.0)
            return SPEED_BASE_MOUNTAIN;
        if (avgGradient >= 2.0)
            return SPEED_BASE_HILLY;
        return SPEED_BASE_FLAT;
    }
    static simulateRider(rider, distanceKm, baseSpeed) {
        const attrDelta = (rider.attributes.timeTrial - 50) * ATTR_SPEED_FACTOR;
        const noise = (Math.random() * 2 - 1) * NOISE_RANGE;
        const dayForm = FORM_MIN + Math.random() * (FORM_MAX - FORM_MIN);
        const speed = Math.max(15, (baseSpeed + attrDelta) * dayForm * (1 + noise));
        const timeSec = (distanceKm / speed) * 3600;
        return {
            rider,
            dayFormFactor: Math.round(dayForm * 1000) / 1000,
            finishTimeSeconds: timeSec,
            gapSeconds: 0,
            finishTimeFormatted: TimeTrialSimulator.formatTime(timeSec),
            gapFormatted: '',
        };
    }
    static formatTime(totalSec) {
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = Math.floor(totalSec % 60);
        const ms = Math.round((totalSec % 1) * 10);
        const mm = String(m).padStart(2, '0');
        const ss = String(s).padStart(2, '0');
        return h > 0 ? `${h}:${mm}:${ss}.${ms}` : `${mm}:${ss}.${ms}`;
    }
    static formatGap(gapSec) {
        const m = Math.floor(gapSec / 60);
        const s = Math.floor(gapSec % 60);
        const ms = Math.round((gapSec % 1) * 10);
        const ss = String(s).padStart(2, '0');
        return `${m}:${ss}.${ms}`;
    }
}
exports.TimeTrialSimulator = TimeTrialSimulator;
