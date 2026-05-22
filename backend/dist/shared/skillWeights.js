"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SKILL_WEIGHT_RULES = exports.SKILL_WEIGHT_RIDER_COLUMNS = void 0;
exports.resolveSkillWeightSimulationMode = resolveSkillWeightSimulationMode;
exports.buildSkillWeightLookupKey = buildSkillWeightLookupKey;
exports.buildSkillWeightRuleMap = buildSkillWeightRuleMap;
exports.buildSkillWeightConfigMap = buildSkillWeightConfigMap;
exports.resolvePrimaryTerrainSkillKey = resolvePrimaryTerrainSkillKey;
exports.resolveSkillWeightComponents = resolveSkillWeightComponents;
exports.resolveWeightedSkillFromSkills = resolveWeightedSkillFromSkills;
exports.resolveTttTerrainSpeedMultiplier = resolveTttTerrainSpeedMultiplier;
exports.resolveFinalSpreadConfig = resolveFinalSpreadConfig;
exports.SKILL_WEIGHT_RIDER_COLUMNS = [
    ['flat', 'flat'],
    ['mountain', 'mountain'],
    ['mediumMountain', 'medium_mountain'],
    ['hill', 'hill'],
    ['timeTrial', 'time_trial'],
    ['prologue', 'prologue'],
    ['cobble', 'cobble'],
    ['sprint', 'sprint'],
    ['acceleration', 'acceleration'],
    ['downhill', 'downhill'],
    ['attack', 'attack'],
    ['stamina', 'stamina'],
    ['resistance', 'resistance'],
    ['recuperation', 'recuperation'],
    ['bikeHandling', 'bike_handling'],
];
const DEFAULT_TTT_SPEED_MULTIPLIERS = {
    Flat: 1.25,
    Hill: 1.1,
    Medium_Mountain: 1.05,
    Mountain: 1.05,
    High_Mountain: 1.05,
    Cobble: 1.05,
    Cobble_Hill: 1.05,
    Abfahrt: 1.2,
    Sprint: 1.05,
};
const DEFAULT_FINAL_SPREAD_CONFIGS = {
    Flat: { lateMultiplier: 1, peakMultiplier: 1 },
    Hill: { lateMultiplier: 1.1, peakMultiplier: 1.6 },
    Medium_Mountain: { lateMultiplier: 1.6, peakMultiplier: 2.5 },
    Mountain: { lateMultiplier: 1.6, peakMultiplier: 2.5 },
    High_Mountain: { lateMultiplier: 1.6, peakMultiplier: 2.5 },
    Cobble: { lateMultiplier: 1.5, peakMultiplier: 1.5 },
    Cobble_Hill: { lateMultiplier: 1.5, peakMultiplier: 1.5 },
    Abfahrt: { lateMultiplier: 1, peakMultiplier: 1 },
    Sprint: { lateMultiplier: 1, peakMultiplier: 1 },
};
function createSkillWeightRule(id, simulationMode, terrain, weights) {
    const finalSpreadConfig = DEFAULT_FINAL_SPREAD_CONFIGS[terrain];
    return {
        id,
        simulationMode,
        terrain,
        weights,
        finalSpreadLateMultiplier: finalSpreadConfig.lateMultiplier,
        finalSpreadPeakMultiplier: finalSpreadConfig.peakMultiplier,
        tttSpeedMultiplier: simulationMode === 'ttt' ? DEFAULT_TTT_SPEED_MULTIPLIERS[terrain] : 1,
    };
}
exports.DEFAULT_SKILL_WEIGHT_RULES = [
    createSkillWeightRule(1, 'road', 'Flat', { flat: 1 }),
    createSkillWeightRule(2, 'road', 'Hill', { hill: 1 }),
    createSkillWeightRule(3, 'road', 'Medium_Mountain', { mediumMountain: 0.7, mountain: 0.3 }),
    createSkillWeightRule(4, 'road', 'Mountain', { mountain: 1 }),
    createSkillWeightRule(5, 'road', 'High_Mountain', { mountain: 1 }),
    createSkillWeightRule(6, 'road', 'Cobble', { cobble: 1 }),
    createSkillWeightRule(7, 'road', 'Cobble_Hill', { cobble: 0.6, hill: 0.4 }),
    createSkillWeightRule(8, 'road', 'Abfahrt', { downhill: 1 }),
    createSkillWeightRule(9, 'road', 'Sprint', { sprint: 0.7, acceleration: 0.3 }),
    createSkillWeightRule(10, 'itt', 'Flat', { timeTrial: 0.625, flat: 0.25, stamina: 0.125 }),
    createSkillWeightRule(11, 'itt', 'Hill', { timeTrial: 0.5, hill: 0.375, stamina: 0.125 }),
    createSkillWeightRule(12, 'itt', 'Medium_Mountain', { timeTrial: 1 / 3, mediumMountain: 0.5, stamina: 1 / 6 }),
    createSkillWeightRule(13, 'itt', 'Mountain', { timeTrial: 1 / 6, mountain: 2 / 3, stamina: 1 / 6 }),
    createSkillWeightRule(14, 'itt', 'High_Mountain', { timeTrial: 1 / 6, mountain: 2 / 3, stamina: 1 / 6 }),
    createSkillWeightRule(15, 'itt', 'Cobble', { timeTrial: 0.5, cobble: 0.375, stamina: 0.125 }),
    createSkillWeightRule(16, 'itt', 'Cobble_Hill', { timeTrial: 0.5, cobble: 0.25, hill: 0.125, stamina: 0.125 }),
    createSkillWeightRule(17, 'itt', 'Abfahrt', { timeTrial: 2 / 3, downhill: 2 / 9, flat: 1 / 9 }),
    createSkillWeightRule(18, 'itt', 'Sprint', { timeTrial: 0.625, flat: 0.25, stamina: 0.125 }),
    createSkillWeightRule(19, 'ttt', 'Flat', { timeTrial: 0.625, flat: 0.25, stamina: 0.125 }),
    createSkillWeightRule(20, 'ttt', 'Hill', { timeTrial: 0.5, hill: 0.375, stamina: 0.125 }),
    createSkillWeightRule(21, 'ttt', 'Medium_Mountain', { timeTrial: 1 / 3, mediumMountain: 0.5, stamina: 1 / 6 }),
    createSkillWeightRule(22, 'ttt', 'Mountain', { timeTrial: 1 / 6, mountain: 2 / 3, stamina: 1 / 6 }),
    createSkillWeightRule(23, 'ttt', 'High_Mountain', { timeTrial: 1 / 6, mountain: 2 / 3, stamina: 1 / 6 }),
    createSkillWeightRule(24, 'ttt', 'Cobble', { timeTrial: 0.5, cobble: 0.375, stamina: 0.125 }),
    createSkillWeightRule(25, 'ttt', 'Cobble_Hill', { timeTrial: 0.5, cobble: 0.25, hill: 0.125, stamina: 0.125 }),
    createSkillWeightRule(26, 'ttt', 'Abfahrt', { timeTrial: 2 / 3, downhill: 2 / 9, flat: 1 / 9 }),
    createSkillWeightRule(27, 'ttt', 'Sprint', { timeTrial: 0.625, flat: 0.25, stamina: 0.125 }),
];
const DEFAULT_SKILL_WEIGHT_RULE_MAP = new Map(exports.DEFAULT_SKILL_WEIGHT_RULES.map((rule) => [buildSkillWeightLookupKey(rule.simulationMode, rule.terrain), rule.weights]));
const DEFAULT_SKILL_WEIGHT_CONFIG_MAP = new Map(exports.DEFAULT_SKILL_WEIGHT_RULES.map((rule) => [buildSkillWeightLookupKey(rule.simulationMode, rule.terrain), rule]));
function resolveSkillWeightSimulationMode(stageProfile) {
    if (stageProfile === 'ITT') {
        return 'itt';
    }
    if (stageProfile === 'TTT') {
        return 'ttt';
    }
    return 'road';
}
function buildSkillWeightLookupKey(mode, terrain) {
    return `${mode}:${terrain}`;
}
function buildSkillWeightRuleMap(rules) {
    return new Map(rules.map((rule) => [buildSkillWeightLookupKey(rule.simulationMode, rule.terrain), rule.weights]));
}
function buildSkillWeightConfigMap(rules) {
    return new Map(rules.map((rule) => [buildSkillWeightLookupKey(rule.simulationMode, rule.terrain), rule]));
}
function resolvePrimaryTerrainSkillKey(terrain) {
    switch (terrain) {
        case 'Flat':
            return 'flat';
        case 'Hill':
            return 'hill';
        case 'Medium_Mountain':
            return 'mediumMountain';
        case 'Mountain':
        case 'High_Mountain':
            return 'mountain';
        case 'Cobble':
        case 'Cobble_Hill':
            return 'cobble';
        case 'Sprint':
            return 'sprint';
        case 'Abfahrt':
            return 'downhill';
        default:
            return 'flat';
    }
}
function resolveSkillWeightComponents(mode, terrain, rulesByKey) {
    const weights = rulesByKey?.get(buildSkillWeightLookupKey(mode, terrain))
        ?? DEFAULT_SKILL_WEIGHT_RULE_MAP.get(buildSkillWeightLookupKey(mode, terrain));
    if (!weights) {
        return [{ key: resolvePrimaryTerrainSkillKey(terrain), weight: 1 }];
    }
    const components = exports.SKILL_WEIGHT_RIDER_COLUMNS
        .map(([key]) => ({ key, weight: weights[key] ?? 0 }))
        .filter((component) => component.weight > 0);
    return components.length > 0 ? components : [{ key: resolvePrimaryTerrainSkillKey(terrain), weight: 1 }];
}
function resolveWeightedSkillFromSkills(skills, mode, terrain, rulesByKey) {
    const components = resolveSkillWeightComponents(mode, terrain, rulesByKey);
    const totalWeight = components.reduce((sum, component) => sum + component.weight, 0);
    if (totalWeight <= 0) {
        return skills[resolvePrimaryTerrainSkillKey(terrain)];
    }
    const weightedSum = components.reduce((sum, component) => sum + (skills[component.key] * component.weight), 0);
    return weightedSum / totalWeight;
}
function resolveTttTerrainSpeedMultiplier(terrain, rules = exports.DEFAULT_SKILL_WEIGHT_RULES) {
    const rule = rules.find((candidate) => candidate.simulationMode === 'ttt' && candidate.terrain === terrain);
    return rule?.tttSpeedMultiplier ?? DEFAULT_TTT_SPEED_MULTIPLIERS[terrain] ?? 1.05;
}
function resolveFinalSpreadConfig(mode, terrain, rulesByKey) {
    const rule = rulesByKey?.get(buildSkillWeightLookupKey(mode, terrain))
        ?? DEFAULT_SKILL_WEIGHT_CONFIG_MAP.get(buildSkillWeightLookupKey(mode, terrain));
    return {
        lateMultiplier: rule?.finalSpreadLateMultiplier ?? DEFAULT_FINAL_SPREAD_CONFIGS[terrain].lateMultiplier,
        peakMultiplier: rule?.finalSpreadPeakMultiplier ?? DEFAULT_FINAL_SPREAD_CONFIGS[terrain].peakMultiplier,
    };
}
