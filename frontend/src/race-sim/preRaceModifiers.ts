/**
 * Was vor dem Startschuss an den Fahrern veraendert wird.
 *
 * Drei Zuschlaege, die die volle Simulation bisher im Konstruktor auf die
 * Fahrerliste rechnete:
 *
 *   Heimvorteil    faehrt ein Fahrer im eigenen Land, bekommt er auf fuenf
 *                  Faehigkeiten +1 (90 %), +3/+1 (5 %) oder -0,5 (Heimdruck, 5 %)
 *   Wetterprofil   passt das Wetter zum Fahrer, +0,2..1,0 auf sechs
 *                  Faehigkeiten; passt es nicht, ebenso viel Abzug — und hier
 *                  greift das Leutnant-System: startet der Leutnant eines
 *                  Kapitaens und liegt *ihm* das Wetter, faellt der Abzug um
 *                  40 bis 75 % geringer aus
 *   Rivalendruck   starten beide Fahrer eines Rivalenpaares, bekommt jeder auf
 *                  drei zufaellige Faehigkeiten +0,2..1,0 (80 %) oder Abzug (20 %)
 *
 * Sie lagen im Konstruktor der Engine und fehlten der Quick Simulation damit
 * vollstaendig — ein Kapitaen mit passendem Leutnant war dort nicht besser
 * dran als einer ohne.
 *
 * Die Funktion aendert nichts an Ort und Stelle: sie gibt eine neue
 * Fahrerliste zurueck.
 */

import type {
  Race,
  Rider,
  RiderSkillKey,
  Stage,
} from '../../../shared/types';
import { randomBetween, shuffled, type RandomSource } from '../../../shared/rng';

/** Welches Wetter welchem Fahrerprofil liegt. */
export const WEATHER_PROFILES: Record<number, { pref: number[]; malus: number[]; neutral: number[] }> = {
  1: { pref: [1, 2], malus: [4, 7], neutral: [3, 5, 6] },
  2: { pref: [3, 5], malus: [2, 7], neutral: [1, 4, 6] },
  3: { pref: [4, 7], malus: [2, 5], neutral: [1, 3, 6] },
  4: { pref: [6, 7], malus: [2, 5], neutral: [1, 3, 4] },
  5: { pref: [1, 5], malus: [6, 7], neutral: [2, 3, 4] },
  6: { pref: [1, 3], malus: [4, 7], neutral: [2, 5, 6] },
  7: { pref: [3, 4], malus: [2, 7], neutral: [1, 5, 6] },
};

export function getWeatherRelation(profileId: number, weatherId: number): 'pref' | 'malus' | 'neutral' {
  const profile = WEATHER_PROFILES[profileId] || WEATHER_PROFILES[1];
  if (profile.pref.includes(weatherId)) return 'pref';
  if (profile.malus.includes(weatherId)) return 'malus';
  return 'neutral';
}

const RIVAL_PRESSURE_MALUS_CHANCE = 0.2;
const RIVAL_PRESSURE_SKILL_COUNT = 3;
const ALL_RIDER_SKILL_KEYS: readonly RiderSkillKey[] = [
  'flat', 'mountain', 'mediumMountain', 'hill', 'timeTrial', 'prologue', 'cobble',
  'sprint', 'acceleration', 'downhill', 'attack', 'stamina', 'resistance', 'recuperation', 'bikeHandling',
];

export interface PreRaceModifierInput {
  riders: readonly Rider[];
  race: Race;
  stage: Stage;
  lieutenants?: Array<{ leaderId: number; lieutenantId: number }> | null;
  rivalries?: Array<{ aId: number; bId: number }> | null;
  random: RandomSource;
  /**
   * Heimvorteil und Wetter nicht auf die Faehigkeiten rechnen, sondern als
   * Zuschlag auf den Etappenscore melden.
   *
   * Fuer die Quick Simulation: dort wird der reine Faehigkeitsanteil je
   * Terrain gespreizt (`SKILL_WEIGHT_FACTOR_BY_PROFILE`). Ein Zuschlag, der
   * ueber die Faehigkeiten laeuft, wuerde mitgespreizt — im Hochgebirge
   * anders wirken als auf einer Flachetappe, obwohl das Heimpublikum ueberall
   * dasselbe ist. Als Score-Zuschlag steht er auf jedem Terrain gleich.
   *
   * Die volle Simulation kennt diesen Weg nicht: sie rechnet Schritt fuer
   * Schritt mit den Faehigkeiten und hat keinen Etappenscore, auf den sich
   * etwas aufschlagen liesse. Sie bleibt deshalb beim Faehigkeitsweg.
   */
  effectsAsScoreDelta?: boolean;
}

export interface PreRaceModifierResult {
  riders: Rider[];
  /** Rivalenpaare, bei denen beide starten — fuer die Konterattacken. */
  rivalByRiderId: Map<number, number>;
  /**
   * Zuschlag auf den Etappenscore je Fahrer, nur bei `effectsAsScoreDelta`.
   * Sonst leer, weil die Zuschlaege dann in den Faehigkeiten stecken.
   */
  scoreDeltaByRiderId: Map<number, number>;
}

/**
 * Score-Zuschlaege, wenn `effectsAsScoreDelta` gesetzt ist.
 *
 * Dieselben Groessen wie auf dem Faehigkeitsweg, nur einmal auf den Score
 * statt verteilt auf fuenf beziehungsweise sechs Faehigkeiten.
 */
export const HOME_SCORE_DELTA = {
  /** Heimdruck: das Publikum drueckt statt zu tragen. */
  pressure: -0.5,
  /** Normaler Heimvorteil. */
  normal: 1,
  /** Super-Heimvorteil. */
  super: 3,
} as const;

/** Spanne des Wetterzuschlags. Passt das Wetter, nach oben; passt es nicht, nach unten. */
export const WEATHER_SCORE_DELTA_RANGE = { min: 0.2, max: 1.0 } as const;

export function applyPreRaceRiderModifiers(input: PreRaceModifierInput): PreRaceModifierResult {
  const { race, stage, lieutenants, rivalries, random } = input;
  let riders: Rider[] = [...input.riders];
  const rivalByRiderId = new Map<number, number>();

  const scoreDeltaByRiderId = new Map<number, number>();
  const addiere = (riderId: number, delta: number): void => {
    scoreDeltaByRiderId.set(riderId, (scoreDeltaByRiderId.get(riderId) ?? 0) + delta);
  };

  // Apply Home Advantage / Pressure modifications
  const raceCountryCode = race.country?.code3;
  if (raceCountryCode) {
    riders = riders.map((originalRider) => {
      const riderNation = originalRider.nationality || originalRider.country?.code3;
      if (riderNation && riderNation.trim().toUpperCase() === raceCountryCode.trim().toUpperCase()) {
        const clonedRider = {
          ...originalRider,
          skills: { ...originalRider.skills },
        };

        const roll = random();
        const profile = stage.profile;
        const isTimeTrial = profile === 'ITT' || profile === 'TTT';

        // Allowed skills: flat, hill, sprint, acceleration, stamina, resistance, recuperation, bikeHandling
        const allowedPool: RiderSkillKey[] = [
          'flat', 'hill', 'sprint', 'acceleration', 'stamina', 'resistance', 'recuperation', 'bikeHandling'
        ];

        // Add cobble only if stage is Cobble or Cobble_Hill
        if (profile === 'Cobble' || profile === 'Cobble_Hill') {
          allowedPool.push('cobble');
        }

        // Add mountain and mediumMountain only if profile is not flat, rolling, cobble, cobble_hill, itt, ttt
        const excludeMountain = [
          'Flat', 'Rolling', 'Cobble', 'Cobble_Hill', 'ITT', 'TTT'
        ].includes(profile);

        if (!excludeMountain) {
          allowedPool.push('mountain', 'mediumMountain');
        }

        const pickRandomSkills = (n: number): RiderSkillKey[] => {
          const keys = [...allowedPool];
          const result: RiderSkillKey[] = [];

          if (isTimeTrial) {
            // TimeTrial skill is guaranteed to be one of the selected skills.
            result.push('timeTrial');
            // We need to pick n - 1 additional skills from the allowed pool.
            const limit = Math.min(n - 1, keys.length);
            for (let i = 0; i < limit; i++) {
              const idx = Math.floor(random() * keys.length);
              result.push(keys.splice(idx, 1)[0]);
            }
          } else {
            // We pick n skills from the allowed pool.
            const limit = Math.min(n, keys.length);
            for (let i = 0; i < limit; i++) {
              const idx = Math.floor(random() * keys.length);
              result.push(keys.splice(idx, 1)[0]);
            }
          }
          return result;
        };

        const selectedSkills = pickRandomSkills(5);
        // Shuffle to randomize which of the selected skills gets the +3 (which is index 0)
        // Fisher-Yates statt sort(() => rng() - 0.5): letzteres ist keine
        // Gleichverteilung und bevorzugte bisher bestimmte Skills.
        const shuffledSkills = shuffled(random, selectedSkills);
        clonedRider.homeEffectSkills = shuffledSkills;

        // Die Ziehung laeuft in beiden Faellen gleich, damit derselbe Seed
        // denselben Fahrer trifft — nur die Verbuchung unterscheidet sich.
        if (roll < 0.05) {
          // Heimdruck (5% chance): -0.5 on 5 random skills
          clonedRider.homeEffect = 'home_pressure';
          if (input.effectsAsScoreDelta) {
            addiere(clonedRider.id, HOME_SCORE_DELTA.pressure);
          } else {
            for (const key of shuffledSkills) {
              clonedRider.skills[key] = Math.max(0, clonedRider.skills[key] - 0.5);
            }
          }
        } else if (roll < 0.10) {
          // Super Heimvorteil (5% chance): +1 on 4 skills, +3 on 1 skill
          clonedRider.homeEffect = 'super_home';
          if (input.effectsAsScoreDelta) {
            addiere(clonedRider.id, HOME_SCORE_DELTA.super);
          } else {
            const plus3Key = shuffledSkills[0];
            clonedRider.skills[plus3Key] = Math.min(100, clonedRider.skills[plus3Key] + 3);
            for (let i = 1; i < 5; i++) {
              const key = shuffledSkills[i];
              clonedRider.skills[key] = Math.min(100, clonedRider.skills[key] + 1);
            }
          }
        } else {
          // Normal Heimvorteil (90% chance): +1 on 5 random skills
          clonedRider.homeEffect = 'normal_home';
          if (input.effectsAsScoreDelta) {
            addiere(clonedRider.id, HOME_SCORE_DELTA.normal);
          } else {
            for (const key of shuffledSkills) {
              clonedRider.skills[key] = Math.min(100, clonedRider.skills[key] + 1);
            }
          }
        }
        return clonedRider;
      }
      return originalRider;
    });
  }

  // Apply Weather Profile modifications
  const weatherId = stage.rolledWeatherId || 1;
  riders = riders.map((originalRider) => {
    const profileId = originalRider.weatherProfileId || 1;
    const relation = getWeatherRelation(profileId, weatherId);

    if (relation === 'neutral') {
      return originalRider;
    }

    const clonedRider = {
      ...originalRider,
      skills: { ...originalRider.skills },
    };

    const skillsToModify: RiderSkillKey[] = ['flat', 'mountain', 'stamina', 'bikeHandling', 'recuperation', 'downhill'];

    if (relation === 'pref') {
      if (input.effectsAsScoreDelta) {
        addiere(clonedRider.id, randomBetween(random, WEATHER_SCORE_DELTA_RANGE.min, WEATHER_SCORE_DELTA_RANGE.max));
      } else {
        for (const skill of skillsToModify) {
          const mod = randomBetween(random, 0.2, 1.0);
          clonedRider.skills[skill] = Math.min(100, clonedRider.skills[skill] + mod);
        }
      }
    } else if (relation === 'malus') {
      // Check if there is a lieutenant starting the race who has this weather as a preference
      let reduction = 0;
      if (lieutenants) {
        const relationObj = lieutenants.find((l) => l.leaderId === originalRider.id);
        if (relationObj) {
          const hasLtStarting = riders.some((r) => r.id === relationObj.lieutenantId);
          if (hasLtStarting) {
            const ltRider = riders.find((r) => r.id === relationObj.lieutenantId);
            const ltProfileId = ltRider?.weatherProfileId || 1;
            const ltRelation = getWeatherRelation(ltProfileId, weatherId);
            if (ltRelation === 'pref') {
              reduction = randomBetween(random, 0.40, 0.75);
            }
          }
        }
      }

      if (input.effectsAsScoreDelta) {
        // Der Leutnant-Ausgleich wirkt genauso wie auf dem Faehigkeitsweg.
        addiere(
          clonedRider.id,
          -randomBetween(random, WEATHER_SCORE_DELTA_RANGE.min, WEATHER_SCORE_DELTA_RANGE.max) * (1 - reduction),
        );
      } else {
        for (const skill of skillsToModify) {
          const mod = randomBetween(random, 0.2, 1.0) * (1 - reduction);
          clonedRider.skills[skill] = Math.max(0, clonedRider.skills[skill] - mod);
        }
      }
    }

    return clonedRider;
  });

  // Rivalen-Druck: Starten beide Fahrer eines Rivalen-Paares, bekommt jeder
  // auf 3 zufaellige Skills +0.2..1.0 (80%) bzw. -0.2..1.0 (20%, Druck).
  // Nur pro Rennen (geklont), DB unberuehrt. Ausserdem die Rivalen-Map fuer
  // die Konterattacken fuellen (nur Paare, bei denen beide starten).
  if (rivalries && rivalries.length > 0) {
    const startingIds = new Set(riders.map((r) => r.id));
    const pressuredIds = new Set<number>();
    for (const pair of rivalries) {
      if (startingIds.has(pair.aId) && startingIds.has(pair.bId)) {
        rivalByRiderId.set(pair.aId, pair.bId);
        rivalByRiderId.set(pair.bId, pair.aId);
        pressuredIds.add(pair.aId);
        pressuredIds.add(pair.bId);
      }
    }
    if (pressuredIds.size > 0) {
      riders = riders.map((rider) => {
        if (!pressuredIds.has(rider.id)) return rider;
        const cloned = { ...rider, skills: { ...rider.skills } };
        const isMalus = random() < RIVAL_PRESSURE_MALUS_CHANCE;
        const pool = [...ALL_RIDER_SKILL_KEYS];
        for (let k = 0; k < RIVAL_PRESSURE_SKILL_COUNT && pool.length > 0; k++) {
          const idx = Math.floor(random() * pool.length);
          const skill = pool.splice(idx, 1)[0];
          const mod = randomBetween(random, 0.2, 1.0);
          cloned.skills[skill] = isMalus
            ? Math.max(0, cloned.skills[skill] - mod)
            : Math.min(100, cloned.skills[skill] + mod);
        }
        return cloned;
      });
    }
  }

  return { riders, rivalByRiderId, scoreDeltaByRiderId };
}
