import Database from 'better-sqlite3';
import type { RiderPotentials, RiderSkillKey, RiderSkills, RiderSpecialization } from '../../../shared/types';
import { RiderTagService } from './RiderTagService';

const RIDER_STAT_MAX = 85;

const RIDER_SKILL_COLUMNS = [
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

interface RiderDevelopmentRow {
  id: number;
  birth_year: number;
  skill_development: number;
  peak_age: number;
  decline_age: number;
  retirement_age: number;
  skill_flat: number;
  skill_mountain: number;
  skill_medium_mountain: number;
  skill_hill: number;
  skill_time_trial: number;
  skill_prologue: number;
  skill_cobble: number;
  skill_sprint: number;
  skill_acceleration: number;
  skill_downhill: number;
  skill_attack: number;
  skill_stamina: number;
  skill_resistance: number;
  skill_recuperation: number;
}

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName) as { name: string } | undefined;
  return row != null;
}

function columnExists(db: Database.Database, tableName: string, columnName: string): boolean {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
  return columns.some(column => column.name === columnName);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, min = 0, max = RIDER_STAT_MAX): number {
  return round2(Math.max(min, Math.min(max, value)));
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function calcBikeHandling(skills: Pick<RiderSkills, 'downhill' | 'sprint' | 'attack' | 'resistance'>): number {
  return clamp(skills.downhill * 0.7 + skills.sprint * 0.15 + skills.attack * 0.05 + skills.resistance * 0.1);
}

function calcOverall(skills: Pick<RiderSkills, 'flat' | 'mountain' | 'mediumMountain' | 'hill' | 'timeTrial' | 'cobble' | 'sprint' | 'stamina' | 'resistance' | 'recuperation'>): number {
  const includedSkills = [
    ['mountain', skills.mountain, 1.8],
    ['hill', skills.hill, 1],
    ['sprint', skills.sprint, 1],
    ['timeTrial', skills.timeTrial, 2 / 3],
    ['cobble', skills.cobble, 4 / 5],
    ['mediumMountain', skills.mediumMountain, 0.2],
    ['stamina', skills.stamina, 0.1],
    ['resistance', skills.resistance, 0.1],
    ['recuperation', skills.recuperation, 0.1],
    ['flat', skills.flat, 0.15],
  ] as const;

  const weightedTotal = includedSkills.reduce((sum, [, value, weight]) => sum + value * weight, 0);
  let topSkillValue = -Infinity;
  let secondSkillValue = -Infinity;

  for (const [, value] of includedSkills) {
    if (value > topSkillValue) {
      secondSkillValue = topSkillValue;
      topSkillValue = value;
      continue;
    }

    if (value > secondSkillValue) {
      secondSkillValue = value;
    }
  }

  const bonusTotal = topSkillValue * 1.5 + secondSkillValue * 1.25;
  const totalWeight = 1.8 + 1 + 1 + (2 / 3) + (4 / 5) + 0.2 + 0.1 + 0.1 + 0.1 + 0.15 + 1.5 + 1.25;
  return clamp((weightedTotal + bonusTotal) / totalWeight);
}

function scoreProfile(skills: RiderSkills, weights: Array<[RiderSkillKey, number]>): number {
  return weights.reduce((sum, [key, weight]) => sum + skills[key] * weight, 0);
}

function buildHybridSkills(skills: RiderSkills, potentials: RiderPotentials): RiderSkills {
  const entries = RIDER_SKILL_COLUMNS.map(([key]) => {
    const baseValue = skills[key];
    const potentialValue = potentials[key];
    return [key, clamp(baseValue * 0.65 + potentialValue * 0.35)];
  });
  return Object.fromEntries(entries) as RiderSkills;
}

function getSpecializationScores(skills: RiderSkills): Array<{ specialization: RiderSpecialization; score: number }> {
  const scores: Array<{ specialization: RiderSpecialization; score: number }> = [
    { specialization: 'Berg', score: scoreProfile(skills, [['mountain', 0.4], ['mediumMountain', 0.2], ['stamina', 0.15], ['attack', 0.15], ['downhill', 0.1]]) },
    { specialization: 'Hill', score: scoreProfile(skills, [['hill', 0.35], ['acceleration', 0.2], ['mediumMountain', 0.15], ['attack', 0.15], ['bikeHandling', 0.15]]) },
    { specialization: 'Sprint', score: scoreProfile(skills, [['sprint', 0.4], ['acceleration', 0.25], ['flat', 0.15], ['bikeHandling', 0.1], ['resistance', 0.1]]) },
    { specialization: 'Timetrial', score: scoreProfile(skills, [['timeTrial', 0.5], ['prologue', 0.2], ['flat', 0.1], ['resistance', 0.1], ['bikeHandling', 0.1]]) },
    { specialization: 'Cobble', score: scoreProfile(skills, [['cobble', 0.4], ['flat', 0.2], ['resistance', 0.15], ['bikeHandling', 0.15], ['hill', 0.1]]) },
    { specialization: 'Attacker', score: scoreProfile(skills, [['attack', 0.35], ['acceleration', 0.2], ['hill', 0.15], ['mediumMountain', 0.15], ['resistance', 0.15]]) },
  ];
  return scores.sort((left, right) => right.score - left.score);
}

function buildAgeProfile(): { peakAge: number; declineAge: number; retirementAge: number } {
  const peakAge = rand(24, 28);
  const declineAge = rand(Math.max(peakAge + 1, 26), 32);
  const retirementAge = rand(Math.max(declineAge + 1, 32), 38);
  return { peakAge, declineAge, retirementAge };
}

function buildPotentials(skills: RiderSkills, age: number, skillDevelopment: number): RiderPotentials {
  if (age >= 26) {
    return Object.fromEntries(RIDER_SKILL_COLUMNS.map(([key]) => [key, skills[key]])) as RiderPotentials;
  }

  const ageFactor = Math.max(0.15, (26 - age) / 8);
  const developmentFactor = skillDevelopment / 20;
  const entries = RIDER_SKILL_COLUMNS.map(([key]) => {
    const current = skills[key];
    const headroom = Math.max(0, RIDER_STAT_MAX - current);
    if (headroom <= 0.01) return [key, current];

    const growthBase = headroom * (0.14 + ageFactor * 0.24 + developmentFactor * 0.22);
    const growth = Math.max(Math.min(headroom, growthBase * randomBetween(0.75, 1.25)), Math.min(headroom, 0.25));
    return [key, clamp(current + growth)];
  });
  return Object.fromEntries(entries) as RiderPotentials;
}

function buildCurrentSkills(row: RiderDevelopmentRow): RiderSkills {
  const baseSkills = {
    flat: row.skill_flat,
    mountain: row.skill_mountain,
    mediumMountain: row.skill_medium_mountain,
    hill: row.skill_hill,
    timeTrial: row.skill_time_trial,
    prologue: row.skill_prologue,
    cobble: row.skill_cobble,
    sprint: row.skill_sprint,
    acceleration: row.skill_acceleration,
    downhill: row.skill_downhill,
    attack: row.skill_attack,
    stamina: row.skill_stamina,
    resistance: row.skill_resistance,
    recuperation: row.skill_recuperation,
  } satisfies Omit<RiderSkills, 'bikeHandling'>;

  return {
    ...baseSkills,
    bikeHandling: calcBikeHandling(baseSkills),
  };
}

export class RiderDevelopmentService {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  public initializeRiders(currentSeason: number, force = false): void {
    if (!tableExists(this.db, 'riders') || !tableExists(this.db, 'type_rider')) return;
    const requiredColumns = [
      'peak_age',
      'decline_age',
      'retirement_age',
      'skill_development',
      'pot_overall',
      'pot_flat',
      'pot_bike_handling',
      'rider_type_id',
      'specialization_1_id',
      'specialization_2_id',
      'specialization_3_id',
    ];
    if (requiredColumns.some(column => !columnExists(this.db, 'riders', column))) return;

    const typeIdByKey = new Map<RiderSpecialization, number>();
    const typeRows = this.db.prepare('SELECT id, type_key FROM type_rider').all() as Array<{ id: number; type_key: RiderSpecialization }>;
    for (const row of typeRows) typeIdByKey.set(row.type_key, row.id);

    const rows = this.db.prepare(`
      SELECT id, birth_year, skill_development, peak_age, decline_age, retirement_age,
             skill_flat, skill_mountain, skill_medium_mountain, skill_hill, skill_time_trial,
             skill_prologue, skill_cobble, skill_sprint, skill_acceleration, skill_downhill,
             skill_attack, skill_stamina, skill_resistance, skill_recuperation
      FROM riders
    `).all() as RiderDevelopmentRow[];

    const update = this.db.prepare(`
      UPDATE riders
      SET peak_age = ?,
          decline_age = ?,
          retirement_age = ?,
          skill_development = ?,
          overall_rating = ?,
          pot_overall = ?,
          skill_bike_handling = ?,
          pot_flat = ?,
          pot_mountain = ?,
          pot_medium_mountain = ?,
          pot_hill = ?,
          pot_time_trial = ?,
          pot_prologue = ?,
          pot_cobble = ?,
          pot_sprint = ?,
          pot_acceleration = ?,
          pot_downhill = ?,
          pot_attack = ?,
          pot_stamina = ?,
          pot_resistance = ?,
          pot_recuperation = ?,
          pot_bike_handling = ?,
          rider_type_id = ?,
          specialization_1_id = ?,
          specialization_2_id = ?,
          specialization_3_id = ?
      WHERE id = ?
    `);

    this.db.transaction(() => {
      for (const row of rows) {
        const needsInitialization = force
          || row.skill_development <= 0
          || row.peak_age <= 0
          || row.decline_age <= 0
          || row.retirement_age <= 0;
        if (!needsInitialization) continue;

        const age = currentSeason - row.birth_year;
        const currentSkills = buildCurrentSkills(row);
        const skillDevelopment = rand(1, 20);
        const ageProfile = buildAgeProfile();
        const potentials = buildPotentials(currentSkills, age, skillDevelopment);
        const hybridSkills = buildHybridSkills(currentSkills, potentials);
        const specializations = getSpecializationScores(hybridSkills).slice(0, 3).map(entry => entry.specialization);
        const riderTypeId = typeIdByKey.get(specializations[0]);
        const specialization1Id = specializations[0] == null ? null : typeIdByKey.get(specializations[0]) ?? null;
        const specialization2Id = specializations[1] == null ? null : typeIdByKey.get(specializations[1]) ?? null;
        const specialization3Id = specializations[2] == null ? null : typeIdByKey.get(specializations[2]) ?? null;
        if (riderTypeId == null || specialization1Id == null) {
          throw new Error(`Rider-Type Mapping fehlt fuer Fahrer ${row.id}.`);
        }

        update.run(
          ageProfile.peakAge,
          ageProfile.declineAge,
          ageProfile.retirementAge,
          skillDevelopment,
          calcOverall(currentSkills),
          calcOverall(potentials),
          currentSkills.bikeHandling,
          potentials.flat,
          potentials.mountain,
          potentials.mediumMountain,
          potentials.hill,
          potentials.timeTrial,
          potentials.prologue,
          potentials.cobble,
          potentials.sprint,
          potentials.acceleration,
          potentials.downhill,
          potentials.attack,
          potentials.stamina,
          potentials.resistance,
          potentials.recuperation,
          potentials.bikeHandling,
          riderTypeId,
          specialization1Id,
          specialization2Id,
          specialization3Id,
          row.id,
        );
      }
    })();

    new RiderTagService(this.db).recalculateAllTags();
  }
}