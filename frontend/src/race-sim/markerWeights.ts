/**
 * Gewichtungsprofile der Wertungspunkte.
 *
 * Lagen als modulprivate Konstanten in `SimulationEngine.ts`. Die Quick
 * Simulation braucht dieselben Gewichte, um dieselben Zwischenwertungen zu
 * vergeben — und eine zweite Kopie waere genau die Doppelpflege, die mit der
 * Zeit auseinanderlaeuft, ohne dass es jemand merkt.
 *
 * Die Werte hier sind die Vorgabe; die Tabelle `stage_scoring_rules`
 * ueberschreibt sie je Etappentyp (siehe `buildStageScoringWeightMap`).
 */

import type {
  RiderSkillKey,
  StageMarkerCategory,
  StageMarkerType,
  StageScoringRule,
} from '../../../shared/types';


export type MarkerWeightProfile = Partial<Record<RiderSkillKey, number>>;

export const SPRINT_INTERMEDIATE_WEIGHTS: MarkerWeightProfile = {
  sprint: 0.46,
  acceleration: 0.24,
  hill: 0.06,
  attack: 0.08,
  resistance: 0.08,
  stamina: 0.04,
  flat: 0.04,
};

export const FINISH_FLAT_WEIGHTS: MarkerWeightProfile = {
  sprint: 0.45,
  acceleration: 0.2,
  hill: 0.04,
  attack: 0.06,
  resistance: 0.06,
  stamina: 0.04,
  flat: 0.15,
};

export const FINISH_HILL_WEIGHTS: MarkerWeightProfile = {
  mountain: 0.05,
  mediumMountain: 0.05,
  hill: 0.28,
  sprint: 0.18,
  acceleration: 0.12,
  attack: 0.12,
  resistance: 0.1,
  stamina: 0.06,
  flat: 0.04,
};

export const FINISH_MOUNTAIN_WEIGHTS: MarkerWeightProfile = {
  mountain: 0.38,
  mediumMountain: 0.2,
  hill: 0.1,
  sprint: 0.03,
  acceleration: 0.03,
  attack: 0.12,
  resistance: 0.08,
  stamina: 0.06,
};

export const CLIMB_TOP_WEIGHTS: Record<Exclude<StageMarkerCategory, 'Sprint'>, MarkerWeightProfile> = {
  HC: {
    mountain: 0.4,
    mediumMountain: 0.2,
    hill: 0.07,
    sprint: 0.01,
    acceleration: 0.02,
    attack: 0.16,
    resistance: 0.08,
    stamina: 0.06,
  },
  '1': {
    mountain: 0.31,
    mediumMountain: 0.18,
    hill: 0.12,
    sprint: 0.03,
    acceleration: 0.04,
    attack: 0.16,
    resistance: 0.09,
    stamina: 0.07,
  },
  '2': {
    mountain: 0.2,
    mediumMountain: 0.14,
    hill: 0.22,
    sprint: 0.08,
    acceleration: 0.08,
    attack: 0.15,
    resistance: 0.08,
    stamina: 0.05,
  },
  '3': {
    mountain: 0.05,
    mediumMountain: 0.09,
    hill: 0.27,
    sprint: 0.14,
    acceleration: 0.12,
    attack: 0.16,
    resistance: 0.1,
    stamina: 0.07,
  },
  '4': {
    hill: 0.3,
    sprint: 0.18,
    acceleration: 0.16,
    attack: 0.16,
    resistance: 0.12,
    stamina: 0.08,
  },
};

export function buildStageScoringWeightMap(rules: StageScoringRule[]): Map<string, MarkerWeightProfile> {
  const map = new Map<string, MarkerWeightProfile>();
  for (const rule of rules) {
    const weights = rule.weights as MarkerWeightProfile;
    if (rule.appliesTo === 'sprint_intermediate') {
      map.set('sprint_intermediate', weights);
    } else if (rule.appliesTo === 'climb_top') {
      const category = (!rule.markerCategory || rule.markerCategory === 'Sprint') ? 'HC' : rule.markerCategory;
      map.set(`climb_top|${category}`, weights);
    } else if (rule.appliesTo === 'finish') {
      map.set(rule.markerType, weights);
    }
  }
  return map;
}

/**
 * Gewichte eines Markers: erst die Etappenregel, sonst die Vorgabe.
 * Dieselbe Aufloesung wie `resolveSprintWeightProfile` und
 * `resolveClimbWeightProfile` in der Engine.
 */
export function resolveMarkerWeightProfile(
  weightMap: ReadonlyMap<string, MarkerWeightProfile>,
  markerType: StageMarkerType,
  markerCategory: StageMarkerCategory | null,
): MarkerWeightProfile {
  if (markerType === 'sprint_intermediate') {
    return weightMap.get('sprint_intermediate') ?? SPRINT_INTERMEDIATE_WEIGHTS;
  }
  const normalized = (!markerCategory || markerCategory === 'Sprint') ? 'HC' : markerCategory;
  return weightMap.get(`climb_top|${normalized}`) ?? CLIMB_TOP_WEIGHTS[normalized];
}

/**
 * Gewichteter Wert aus rohen Faehigkeiten.
 *
 * Die Engine rechnet mit ihrem Fahrerzustand (Ermuedung, Mikroform,
 * Teamgruppenbonus). Die Quick Simulation hat den nicht — sie kennt nur die
 * Faehigkeiten und die Tagesform. Genau dafuer ist diese Fassung da.
 */
export function resolveWeightProfileValue(
  skills: Record<RiderSkillKey, number>,
  weights: MarkerWeightProfile,
  formBonus = 0,
): number {
  const entries = resolveWeightProfileEntries(weights);
  let sum = 0;
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index] as { skillKey: RiderSkillKey; weight: number };
    sum += Math.max(0, (skills[entry.skillKey] ?? 0) + formBonus) * entry.weight;
  }
  return sum;
}

/**
 * Gewichte einmal in ein Array uebersetzen und am Profil merken.
 * `Object.entries` je Aufruf ist bei ein paar tausend Bewertungen je Etappe
 * der teuerste Teil der ganzen Rechnung.
 */
const weightProfileEntriesCache = new WeakMap<
  MarkerWeightProfile,
  Array<{ skillKey: RiderSkillKey; weight: number }>
>();

function resolveWeightProfileEntries(
  weights: MarkerWeightProfile,
): Array<{ skillKey: RiderSkillKey; weight: number }> {
  let entries = weightProfileEntriesCache.get(weights);
  if (!entries) {
    entries = Object.entries(weights)
      .filter((entry): entry is [string, number] => Boolean(entry[1]))
      .map(([skillKey, weight]) => ({ skillKey: skillKey as RiderSkillKey, weight }));
    weightProfileEntriesCache.set(weights, entries);
  }
  return entries;
}
