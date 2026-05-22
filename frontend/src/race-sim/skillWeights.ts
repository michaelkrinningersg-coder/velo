import type { RiderSkillKey, RiderSkills, SkillWeightRule, SkillWeightSimulationMode, StageProfile, StageTerrain } from '../../../shared/types';

export interface SkillWeightComponent {
  key: RiderSkillKey;
  weight: number;
}

export interface FinalSpreadConfig {
  lateMultiplier: number;
  peakMultiplier: number;
}

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

const DEFAULT_FINAL_SPREAD_CONFIGS: Record<StageTerrain, FinalSpreadConfig> = {
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

function resolvePrimaryTerrainSkillKey(terrain: StageTerrain): RiderSkillKey {
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

function buildSkillWeightLookupKey(mode: SkillWeightSimulationMode, terrain: StageTerrain): string {
  return `${mode}:${terrain}`;
}

export function buildSkillWeightRuleMap(rules: SkillWeightRule[]): Map<string, SkillWeightRule['weights']> {
  return new Map(rules.map((rule) => [buildSkillWeightLookupKey(rule.simulationMode, rule.terrain), rule.weights]));
}

export function buildSkillWeightConfigMap(rules: SkillWeightRule[]): Map<string, SkillWeightRule> {
  return new Map(rules.map((rule) => [buildSkillWeightLookupKey(rule.simulationMode, rule.terrain), rule]));
}

export function resolveSkillWeightSimulationMode(stageProfile: StageProfile): SkillWeightSimulationMode {
  if (stageProfile === 'ITT') {
    return 'itt';
  }
  if (stageProfile === 'TTT') {
    return 'ttt';
  }
  return 'road';
}

export function resolveSkillWeightComponents(
  mode: SkillWeightSimulationMode,
  terrain: StageTerrain,
  rulesByKey: Map<string, SkillWeightRule['weights']>,
): SkillWeightComponent[] {
  const weights = rulesByKey.get(buildSkillWeightLookupKey(mode, terrain));
  if (!weights) {
    return [{ key: resolvePrimaryTerrainSkillKey(terrain), weight: 1 }];
  }

  const components = Object.entries(weights)
    .map(([key, weight]) => ({ key: key as RiderSkillKey, weight: weight ?? 0 }))
    .filter((component) => component.weight > 0);

  return components.length > 0 ? components : [{ key: resolvePrimaryTerrainSkillKey(terrain), weight: 1 }];
}

export function resolveWeightedSkillFromSkills(
  skills: RiderSkills,
  mode: SkillWeightSimulationMode,
  terrain: StageTerrain,
  rulesByKey: Map<string, SkillWeightRule['weights']>,
): number {
  const components = resolveSkillWeightComponents(mode, terrain, rulesByKey);
  const totalWeight = components.reduce((sum, component) => sum + component.weight, 0);
  if (totalWeight <= 0) {
    return skills[resolvePrimaryTerrainSkillKey(terrain)];
  }

  const weightedSum = components.reduce((sum, component) => sum + (skills[component.key] * component.weight), 0);
  return weightedSum / totalWeight;
}

export function resolveTttTerrainSpeedMultiplier(terrain: StageTerrain, rules: SkillWeightRule[]): number {
  const rule = rules.find((candidate) => candidate.simulationMode === 'ttt' && candidate.terrain === terrain);
  return rule?.tttSpeedMultiplier ?? DEFAULT_TTT_SPEED_MULTIPLIERS[terrain] ?? 1.05;
}

export function resolveFinalSpreadConfig(
  mode: SkillWeightSimulationMode,
  terrain: StageTerrain,
  rulesByKey?: Map<string, SkillWeightRule>,
): FinalSpreadConfig {
  const rule = rulesByKey?.get(buildSkillWeightLookupKey(mode, terrain));

  return {
    lateMultiplier: rule?.finalSpreadLateMultiplier ?? DEFAULT_FINAL_SPREAD_CONFIGS[terrain].lateMultiplier,
    peakMultiplier: rule?.finalSpreadPeakMultiplier ?? DEFAULT_FINAL_SPREAD_CONFIGS[terrain].peakMultiplier,
  };
}