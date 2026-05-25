"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIME_LIMIT_PERCENT_BY_PROFILE = exports.TIME_TIE_THRESHOLD_SECONDS = void 0;
exports.roundStageResultSeconds = roundStageResultSeconds;
exports.isTimeTrialProfile = isTimeTrialProfile;
exports.resolveTimeLimitPercent = resolveTimeLimitPercent;
exports.resolveStageTimeLimitSeconds = resolveStageTimeLimitSeconds;
exports.rankStageResultEntries = rankStageResultEntries;
exports.TIME_TIE_THRESHOLD_SECONDS = 1;
exports.TIME_LIMIT_PERCENT_BY_PROFILE = {
    Flat: 13,
    Rolling: 15,
    Hilly: 17,
    Hilly_Difficult: 19,
    Medium_Mountain: 21,
    Mountain: 25,
    High_Mountain: 30,
    ITT: 30,
    TTT: 30,
    Cobble: 18,
    Cobble_Hill: 20,
};
function roundStageResultSeconds(value) {
    return Math.max(0, Math.round(value));
}
function isTimeTrialProfile(profile) {
    return profile === 'ITT' || profile === 'TTT';
}
function resolveTimeLimitPercent(profile) {
    return exports.TIME_LIMIT_PERCENT_BY_PROFILE[profile] ?? 20;
}
function resolveStageTimeLimitSeconds(profile, stageTimesSeconds) {
    if (stageTimesSeconds.length === 0) {
        return null;
    }
    const winnerTimeSeconds = Math.min(...stageTimesSeconds);
    if (!Number.isFinite(winnerTimeSeconds) || winnerTimeSeconds <= 0) {
        return null;
    }
    return Math.floor(winnerTimeSeconds * (1 + (resolveTimeLimitPercent(profile) / 100)));
}
function compareStageResultEntries(left, right) {
    return left.stageTimeSeconds - right.stageTimeSeconds
        || right.photoFinishScore - left.photoFinishScore
        || left.riderId - right.riderId;
}
function compareStageResultEntriesWithinTimeGroup(left, right) {
    return right.photoFinishScore - left.photoFinishScore || left.riderId - right.riderId;
}
function rankStageResultEntries(entries, profile) {
    if (isTimeTrialProfile(profile)) {
        return [...entries].sort(compareStageResultEntries);
    }
    const sortedByTime = [...entries].sort((left, right) => left.stageTimeSeconds - right.stageTimeSeconds || compareStageResultEntriesWithinTimeGroup(left, right));
    const ranked = [];
    let group = [];
    let previousTime = null;
    const flushGroup = () => {
        ranked.push(...group.sort(compareStageResultEntriesWithinTimeGroup));
    };
    for (const entry of sortedByTime) {
        if (group.length === 0) {
            group = [entry];
            previousTime = entry.stageTimeSeconds;
            continue;
        }
        if (previousTime != null && entry.stageTimeSeconds - previousTime <= exports.TIME_TIE_THRESHOLD_SECONDS) {
            group.push(entry);
            previousTime = entry.stageTimeSeconds;
            continue;
        }
        flushGroup();
        group = [entry];
        previousTime = entry.stageTimeSeconds;
    }
    if (group.length > 0) {
        flushGroup();
    }
    return ranked;
}
