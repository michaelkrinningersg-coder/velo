import type { RiderSkillKey, RiderSkills, SkillWeightRule, SkillWeightSimulationMode, StageProfile, StageTerrain } from './types';

export type { SkillWeightRule, SkillWeightSimulationMode } from './types';

export interface SkillWeightComponent {
  key: RiderSkillKey;
  weight: number;
}

export const SKILL_WEIGHT_RIDER_COLUMNS = [
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
] as const satisfies ReadonlyArray<readonly [RiderSkillKey, string]>;

const DEFAULT_TTT_SPEED_MULTIPLIERS: Record<StageTerrain, number> = {
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

function createSkillWeightRule(
  id: number,
  simulationMode: SkillWeightSimulationMode,
  terrain: StageTerrain,
  weights: Partial<Record<RiderSkillKey, number>>,
): SkillWeightRule {
  return {
    id,
    simulationMode,
    terrain,
    weights,
    tttSpeedMultiplier: simulationMode === 'ttt' ? DEFAULT_TTT_SPEED_MULTIPLIERS[terrain] : 1,
  };
}

export const DEFAULT_SKILL_WEIGHT_RULES: SkillWeightRule[] = [
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

const DEFAULT_SKILL_WEIGHT_RULE_MAP = new Map(
  DEFAULT_SKILL_WEIGHT_RULES.map((rule) => [buildSkillWeightLookupKey(rule.simulationMode, rule.terrain), rule.weights]),
);

export function resolveSkillWeightSimulationMode(stageProfile: StageProfile): SkillWeightSimulationMode {
  if (stageProfile === 'ITT') {
    return 'itt';
  }
  if (stageProfile === 'TTT') {
    return 'ttt';
  }
  return 'road';
}

export function buildSkillWeightLookupKey(mode: SkillWeightSimulationMode, terrain: StageTerrain): string {
  return `${mode}:${terrain}`;
}

export function buildSkillWeightRuleMap(rules: SkillWeightRule[]): Map<string, SkillWeightRule['weights']> {
  return new Map(rules.map((rule) => [buildSkillWeightLookupKey(rule.simulationMode, rule.terrain), rule.weights]));
}

export function resolvePrimaryTerrainSkillKey(terrain: StageTerrain): RiderSkillKey {
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

export function resolveSkillWeightComponents(
  mode: SkillWeightSimulationMode,
  terrain: StageTerrain,
  rulesByKey?: Map<string, SkillWeightRule['weights']>,
): SkillWeightComponent[] {
  const weights = rulesByKey?.get(buildSkillWeightLookupKey(mode, terrain))
    ?? DEFAULT_SKILL_WEIGHT_RULE_MAP.get(buildSkillWeightLookupKey(mode, terrain));

  if (!weights) {
    return [{ key: resolvePrimaryTerrainSkillKey(terrain), weight: 1 }];
  }

  const components = SKILL_WEIGHT_RIDER_COLUMNS
    .map(([key]) => ({ key, weight: weights[key] ?? 0 }))
    .filter((component) => component.weight > 0);

  return components.length > 0 ? components : [{ key: resolvePrimaryTerrainSkillKey(terrain), weight: 1 }];
}

export function resolveWeightedSkillFromSkills(
  skills: RiderSkills,
  mode: SkillWeightSimulationMode,
  terrain: StageTerrain,
  rulesByKey?: Map<string, SkillWeightRule['weights']>,
): number {
  const components = resolveSkillWeightComponents(mode, terrain, rulesByKey);
  const totalWeight = components.reduce((sum, component) => sum + component.weight, 0);
  if (totalWeight <= 0) {
    return skills[resolvePrimaryTerrainSkillKey(terrain)];
  }

  const weightedSum = components.reduce((sum, component) => sum + (skills[component.key] * component.weight), 0);
  return weightedSum / totalWeight;
}

export function resolveTttTerrainSpeedMultiplier(
  terrain: StageTerrain,
  rules: SkillWeightRule[] = DEFAULT_SKILL_WEIGHT_RULES,
): number {
  const rule = rules.find((candidate) => candidate.simulationMode === 'ttt' && candidate.terrain === terrain);
  return rule?.tttSpeedMultiplier ?? DEFAULT_TTT_SPEED_MULTIPLIERS[terrain] ?? 1.05;
}