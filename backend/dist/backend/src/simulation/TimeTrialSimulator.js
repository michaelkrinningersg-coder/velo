"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeTrialSimulator = void 0;
const StageParser_1 = require("./StageParser");
const SPEED_BASE_FLAT = 50.0;
const SPEED_BASE_HILLY = 41.0;
const SPEED_BASE_MOUNTAIN = 30.0;
const ATTR_SPEED_FACTOR = 0.28;
const FORM_MIN = 0.88;
const FORM_MAX = 1.12;
const NOISE_RANGE = 0.015;
const TECH_PENALTY_FACTOR = 0.0025;
const WIND_FACTOR = 0.003;
class TimeTrialSimulator {
    static simulate(race, stage, riders) {
        const segments = StageParser_1.StageParser.parseStageProfile(stage.detailsCsvFile);
        const distanceKm = segments.reduce((sum, segment) => sum + segment.length_km, 0);
        const entries = riders.map(rider => TimeTrialSimulator.simulateRider(rider, segments));
        entries.sort((a, b) => a.finishTimeSeconds - b.finishTimeSeconds);
        const leaderTime = entries[0].finishTimeSeconds;
        for (const entry of entries) {
            entry.gapSeconds = entry.finishTimeSeconds - leaderTime;
            entry.gapFormatted = entry.gapSeconds === 0
                ? 'Führend'
                : '+' + TimeTrialSimulator.formatGap(entry.gapSeconds);
        }
        return {
            raceId: race.id,
            raceName: race.isStageRace ? `${race.name} - Etappe ${stage.stageNumber}` : race.name,
            distanceKm,
            season: Number.parseInt(stage.date.slice(0, 4), 10),
            date: stage.date,
            entries,
        };
    }
    static resolveBaseSpeed(segment) {
        if (segment.terrain === 'cobble') {
            return SPEED_BASE_HILLY - 3;
        }
        if (segment.gradient_percent >= 5.0)
            return SPEED_BASE_MOUNTAIN;
        if (segment.gradient_percent >= 2.0)
            return SPEED_BASE_HILLY;
        return SPEED_BASE_FLAT;
    }
    static simulateRider(rider, segments) {
        const dayForm = FORM_MIN + Math.random() * (FORM_MAX - FORM_MIN);
        const finishTimeSeconds = segments.reduce((sum, segment) => sum + TimeTrialSimulator.simulateSegment(rider, segment, dayForm), 0);
        return {
            rider,
            dayFormFactor: Math.round(dayForm * 1000) / 1000,
            finishTimeSeconds,
            gapSeconds: 0,
            finishTimeFormatted: TimeTrialSimulator.formatTime(finishTimeSeconds),
            gapFormatted: '',
        };
    }
    static simulateSegment(rider, segment, dayForm) {
        const baseSpeed = TimeTrialSimulator.resolveBaseSpeed(segment);
        const segmentSkill = TimeTrialSimulator.resolveSegmentSkill(rider, segment);
        const attrDelta = (segmentSkill - 50) * ATTR_SPEED_FACTOR;
        const noise = (Math.random() * 2 - 1) * NOISE_RANGE;
        const techPenalty = 1 - ((segment.tech_level - 1) * TECH_PENALTY_FACTOR);
        const windPenalty = 1 - ((segment.wind_exp - 1) * WIND_FACTOR);
        const speed = Math.max(15, (baseSpeed + attrDelta) * dayForm * (1 + noise) * techPenalty * windPenalty);
        return (segment.length_km / speed) * 3600;
    }
    static resolveSegmentSkill(rider, segment) {
        if (segment.length_km <= 10) {
            return rider.skills.timeTrial * 0.45
                + rider.skills.prologue * 0.25
                + rider.skills.acceleration * 0.1
                + rider.skills.bikeHandling * 0.1
                + rider.skills.flat * 0.1;
        }
        if (segment.gradient_percent >= 5.0) {
            return rider.skills.timeTrial * 0.45
                + rider.skills.mountain * 0.25
                + rider.skills.resistance * 0.15
                + rider.skills.downhill * 0.05
                + rider.skills.bikeHandling * 0.1;
        }
        if (segment.terrain === 'cobble') {
            return rider.skills.timeTrial * 0.4
                + rider.skills.cobble * 0.25
                + rider.skills.flat * 0.15
                + rider.skills.bikeHandling * 0.1
                + rider.skills.resistance * 0.1;
        }
        return rider.skills.timeTrial * 0.6
            + rider.skills.resistance * 0.15
            + rider.skills.flat * 0.15
            + rider.skills.prologue * 0.05
            + rider.skills.bikeHandling * 0.05;
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
