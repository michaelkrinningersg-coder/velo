import Database from 'better-sqlite3';
import type { RiderPotentials, RiderSkillKey, RiderSkills, RiderSpecialization } from '../../../shared/types';
import { RiderTagService } from './RiderTagService';

const RIDER_STAT_MAX = 85;
const DAILY_GROWTH_CAP = 0.018;
const DAILY_DECLINE_CAP = 0.012;

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

export type RiderDevelopmentFormPhase = 'build' | 'decline' | null;

export interface RiderDevelopmentDailyContext {
  riderId: number;
  healthStatus: 'healthy' | 'ill' | 'injured';
  unavailableDaysRemaining: number;
  formPhase: RiderDevelopmentFormPhase;
  isInRaceToday: boolean;
  isPeakStartDay: boolean;
  peakDate: string | null;
}

interface DailyDevelopmentRow extends RiderDevelopmentRow {
  is_retired: number;
  rider_type: RiderSpecialization;
  active_team_id: number | null;
  specialization_1_id: number | null;
  specialization_2_id: number | null;
  specialization_3_id: number | null;
  overall_rating: number;
  skill_bike_handling: number;
  pot_flat: number;
  pot_mountain: number;
  pot_medium_mountain: number;
  pot_hill: number;
  pot_time_trial: number;
  pot_prologue: number;
  pot_cobble: number;
  pot_sprint: number;
  pot_acceleration: number;
  pot_downhill: number;
  pot_attack: number;
  pot_stamina: number;
  pot_resistance: number;
  pot_recuperation: number;
  pot_bike_handling: number;
}

type DevelopmentBlockedReason = 'healthy' | 'retired' | 'ill' | 'injured' | 'unavailable' | 'in_race' | 'form_decline' | 'offseason' | 'peak_age_reached' | 'no_headroom';

export interface DailyDevelopmentBlock {
  canGrow: boolean;
  canDecline: boolean;
  reason: DevelopmentBlockedReason;
}

function isNovember(currentDate: string): boolean {
  // Nur 11-01 bis 11-30 (User-Klärung G1)
  return currentDate.slice(5, 10) >= '11-01' && currentDate.slice(5, 10) <= '11-30';
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
    { specialization: 'Attacker', score: scoreProfile(skills, [['attack', 0.26], ['acceleration', 0.18], ['hill', 0.18], ['mediumMountain', 0.18], ['resistance', 0.18]]) },
  ];
  return scores.sort((left, right) => right.score - left.score);
}

function buildAgeProfile(): { peakAge: number; declineAge: number; retirementAge: number } {
  const peakAge = rand(24, 28);
  const declineAge = rand(Math.max(peakAge + 1, 26), 32);
  const retirementAge = rand(Math.max(declineAge + 1, 32), 38);
  return { peakAge, declineAge, retirementAge };
}

function buildPotentials(skills: RiderSkills, age: number, skillDevelopment: number, peakAge: number): RiderPotentials {
  if (age >= peakAge) {
    return Object.fromEntries(RIDER_SKILL_COLUMNS.map(([key]) => [key, skills[key]])) as RiderPotentials;
  }

  const ageFactor = Math.max(0.15, (peakAge - age) / 8);
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

function buildCurrentSkillsFromDailyRow(row: DailyDevelopmentRow): RiderSkills {
  return {
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
    bikeHandling: row.skill_bike_handling,
  };
}

function buildPotentialsFromDailyRow(row: DailyDevelopmentRow): RiderPotentials {
  return {
    flat: row.pot_flat,
    mountain: row.pot_mountain,
    mediumMountain: row.pot_medium_mountain,
    hill: row.pot_hill,
    timeTrial: row.pot_time_trial,
    prologue: row.pot_prologue,
    cobble: row.pot_cobble,
    sprint: row.pot_sprint,
    acceleration: row.pot_acceleration,
    downhill: row.pot_downhill,
    attack: row.pot_attack,
    stamina: row.pot_stamina,
    resistance: row.pot_resistance,
    recuperation: row.pot_recuperation,
    bikeHandling: row.pot_bike_handling,
  };
}

function isOffseasonDevelopmentBlocked(currentDate: string): boolean {
  return isNovember(currentDate);
}

function resolveDevelopmentBlockReason(row: DailyDevelopmentRow, context: RiderDevelopmentDailyContext | undefined, currentDate: string, age: number): DailyDevelopmentBlock {
  if (row.is_retired === 1) return { canGrow: false, canDecline: false, reason: 'retired' };

  let canGrow = true;
  let canDecline = true;
  let reason: DevelopmentBlockedReason = 'healthy';

  if (context?.healthStatus === 'ill' || context?.healthStatus === 'injured') {
    canGrow = false;
    reason = context.healthStatus;
  }
  if ((context?.unavailableDaysRemaining ?? 0) > 0) {
    canGrow = false;
    reason = 'unavailable';
  }
  if (context?.isInRaceToday) {
    if (age > 22) {
      canGrow = false;
      reason = 'in_race';
    }
    canDecline = false;
  }
  if (context?.formPhase === 'decline') {
    canGrow = false;
    reason = 'form_decline';
  }
  if (context?.formPhase === 'build') {
    canDecline = false;
  }
  if (isOffseasonDevelopmentBlocked(currentDate)) {
    canGrow = false;
    reason = 'offseason';
  }
  if (age >= row.peak_age) {
    canGrow = false;
    if (reason === 'healthy') reason = 'peak_age_reached';
  }

  return { canGrow, canDecline, reason };
}

function resolveAgeGrowthFactor(age: number, peakAge: number): number {
  if (age >= peakAge) return 0;
  const yearsUntilPeak = Math.max(0, peakAge - age);
  return Math.max(0.18, Math.min(1.15, yearsUntilPeak / 7));
}

function resolveSkillDevelopmentFactor(skillDevelopment: number): number {
  return 0.65 + (Math.max(1, Math.min(20, skillDevelopment)) / 20) * 0.7;
}

function resolveSkillFocusFactor(riderType: RiderSpecialization, skillKey: RiderSkillKey): number {
  const factors: Record<RiderSpecialization, Partial<Record<RiderSkillKey, number>>> = {
    Berg: { mountain: 1.35, mediumMountain: 1.2, stamina: 1.15, attack: 1.12, downhill: 1.05 },
    Hill: { hill: 1.35, acceleration: 1.2, mediumMountain: 1.12, attack: 1.12, bikeHandling: 1.05 },
    Sprint: { sprint: 1.35, acceleration: 1.25, flat: 1.15, resistance: 1.05 },
    Timetrial: { timeTrial: 1.35, prologue: 1.25, flat: 1.1, resistance: 1.1 },
    Cobble: { cobble: 1.35, flat: 1.15, resistance: 1.15, hill: 1.05, bikeHandling: 1.08 },
    Attacker: { attack: 1.35, acceleration: 1.15, hill: 1.12, mediumMountain: 1.1, resistance: 1.1 },
  };
  return factors[riderType][skillKey] ?? 0.78;
}

function resolveSkillDeclineFactor(skillKey: RiderSkillKey): number {
  const factors: Record<RiderSkillKey, number> = {
    flat: 0.55,
    mountain: 0.85,
    mediumMountain: 0.8,
    hill: 0.9,
    timeTrial: 0.65,
    prologue: 1.15,
    cobble: 0.85,
    sprint: 1.35,
    acceleration: 1.45,
    downhill: 0.75,
    attack: 0.95,
    stamina: 0.55,
    resistance: 0.6,
    recuperation: 0.65,
    bikeHandling: 0.7,
  };
  return factors[skillKey];
}

function randomNoise(min: number, max: number): number {
  return randomBetween(min, max);
}

function buildUpdatedSpecializationIds(skills: RiderSkills, typeIdByKey: Map<RiderSpecialization, number>): { riderTypeId: number; specialization1Id: number; specialization2Id: number | null; specialization3Id: number | null } | null {
  const specializations = getSpecializationScores(skills).slice(0, 3).map(entry => entry.specialization);
  const riderTypeId = typeIdByKey.get(specializations[0]);
  const specialization1Id = specializations[0] == null ? null : typeIdByKey.get(specializations[0]) ?? null;
  const specialization2Id = specializations[1] == null ? null : typeIdByKey.get(specializations[1]) ?? null;
  const specialization3Id = specializations[2] == null ? null : typeIdByKey.get(specializations[2]) ?? null;
  if (riderTypeId == null || specialization1Id == null) return null;
  return { riderTypeId, specialization1Id, specialization2Id, specialization3Id };
}

export class RiderDevelopmentService {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  public advanceDailyDevelopment(currentDate: string, season: number, contexts: RiderDevelopmentDailyContext[], dayMultiplier = 1): void {
    if (!tableExists(this.db, 'riders') || !tableExists(this.db, 'type_rider')) return;

    const boundedDayMultiplier = Math.max(1, Math.min(31, Math.floor(dayMultiplier)));

    const contextByRiderId = new Map(contexts.map((context) => [context.riderId, context] as const));
    const rows = this.db.prepare(`
      SELECT riders.id, riders.birth_year, riders.skill_development, riders.peak_age, riders.decline_age, riders.retirement_age,
             riders.is_retired, type_rider.type_key AS rider_type, riders.active_team_id, riders.specialization_1_id, riders.specialization_2_id, riders.specialization_3_id, riders.overall_rating,
             riders.skill_flat, riders.skill_mountain, riders.skill_medium_mountain, riders.skill_hill, riders.skill_time_trial,
             riders.skill_prologue, riders.skill_cobble, riders.skill_sprint, riders.skill_acceleration, riders.skill_downhill,
             riders.skill_attack, riders.skill_stamina, riders.skill_resistance, riders.skill_recuperation, riders.skill_bike_handling,
             riders.pot_flat, riders.pot_mountain, riders.pot_medium_mountain, riders.pot_hill, riders.pot_time_trial,
             riders.pot_prologue, riders.pot_cobble, riders.pot_sprint, riders.pot_acceleration, riders.pot_downhill,
             riders.pot_attack, riders.pot_stamina, riders.pot_resistance, riders.pot_recuperation, riders.pot_bike_handling
      FROM riders
      JOIN type_rider ON type_rider.id = riders.rider_type_id
    `).all() as DailyDevelopmentRow[];

    const mentorsByTeam = new Map<number, Array<{ spec1: number }>>();
    for (const row of rows) {
      const age = season - row.birth_year;
      if (age >= 31 && row.overall_rating >= 73 && row.active_team_id != null && row.specialization_1_id != null) {
        if (!mentorsByTeam.has(row.active_team_id)) mentorsByTeam.set(row.active_team_id, []);
        mentorsByTeam.get(row.active_team_id)!.push({ spec1: row.specialization_1_id });
      }
    }

    const update = this.db.prepare(`
      UPDATE riders
      SET overall_rating = ?,
          skill_flat = ?,
          skill_mountain = ?,
          skill_medium_mountain = ?,
          skill_hill = ?,
          skill_time_trial = ?,
          skill_prologue = ?,
          skill_cobble = ?,
          skill_sprint = ?,
          skill_acceleration = ?,
          skill_downhill = ?,
          skill_attack = ?,
          skill_stamina = ?,
          skill_resistance = ?,
          skill_recuperation = ?,
          skill_bike_handling = ?
      WHERE id = ?
    `);

    const insertPeakAward = this.db.prepare(`
      INSERT OR IGNORE INTO rider_peak_awards (rider_id, season, peak_date)
      VALUES (?, ?, ?)
    `);

    for (const row of rows) {
      const age = season - row.birth_year;
      const context = contextByRiderId.get(row.id);
      const currentSkills = buildCurrentSkillsFromDailyRow(row);
      const potentialSkills = buildPotentialsFromDailyRow(row);
      const block = resolveDevelopmentBlockReason(row, context, currentDate, age);
      const deltas: Partial<Record<RiderSkillKey, number>> = {};
      let growthTotal = 0;
      let declineTotal = 0;

      if (block.canGrow) {
        const ageFactor = resolveAgeGrowthFactor(age, row.peak_age);
        let mentorBoost = 0;
        if (age <= 23 && row.active_team_id != null) {
          const teamMentors = mentorsByTeam.get(row.active_team_id) ?? [];
          const top3Specs = [row.specialization_1_id, row.specialization_2_id, row.specialization_3_id].filter(Boolean);
          if (teamMentors.some(m => top3Specs.includes(m.spec1))) {
            mentorBoost = 3;
          }
        }
        const developmentFactor = resolveSkillDevelopmentFactor(Math.min(20, row.skill_development + mentorBoost));
        const u23RaceMultiplier = (age <= 22 && context?.isInRaceToday) ? 1.5 : 1;
        
        let peakBoostMultiplier = 0;
        if (age <= 22 && context?.isInRaceToday && context?.isPeakStartDay && context?.peakDate) {
          const info = insertPeakAward.run(row.id, season, context.peakDate);
          if (info.changes > 0) {
            peakBoostMultiplier = 30;
          }
        }
        
        const localDayMultiplier = boundedDayMultiplier + peakBoostMultiplier;

        for (const [skillKey] of RIDER_SKILL_COLUMNS) {
          if (skillKey === 'bikeHandling') continue;
          const headroom = Math.max(0, potentialSkills[skillKey] - currentSkills[skillKey]);
          if (headroom <= 0.01) continue;
          const dailyGrowth = Math.min(
            DAILY_GROWTH_CAP * localDayMultiplier * (age <= 22 ? 1.5 : 1),
            headroom * 0.0023 * ageFactor * developmentFactor * resolveSkillFocusFactor(row.rider_type, skillKey) * localDayMultiplier * randomNoise(0.75, 1.25) * u23RaceMultiplier,
          );
          if (dailyGrowth <= 0) continue;
          const applied = clamp(Math.min(potentialSkills[skillKey], currentSkills[skillKey] + dailyGrowth)) - currentSkills[skillKey];
          if (applied > 0) {
            deltas[skillKey] = round2(applied);
            growthTotal += applied;
          }
        }
      }

      if (block.canDecline && row.is_retired !== 1 && age >= row.decline_age) {
        const yearsAfterDecline = Math.max(0, age - row.decline_age + 1);
        const ageDeclineFactor = Math.min(2.4, 0.35 + yearsAfterDecline * 0.22);
        for (const [skillKey] of RIDER_SKILL_COLUMNS) {
          if (skillKey === 'bikeHandling') continue;
          const dailyDecline = Math.min(
            DAILY_DECLINE_CAP * boundedDayMultiplier,
            0.00135 * ageDeclineFactor * resolveSkillDeclineFactor(skillKey) * boundedDayMultiplier * randomNoise(0.75, 1.25),
          );
          if (dailyDecline <= 0) continue;
          const applied = currentSkills[skillKey] - clamp(currentSkills[skillKey] - dailyDecline);
          if (applied > 0) {
            deltas[skillKey] = round2((deltas[skillKey] ?? 0) - applied);
            declineTotal += applied;
          }
        }
      }

      const hasDelta = growthTotal > 0 || declineTotal > 0;
      if (!hasDelta) {
        continue;
      }

      const updatedSkills = { ...currentSkills };
      for (const [skillKey, delta] of Object.entries(deltas) as Array<[RiderSkillKey, number]>) {
        if (skillKey === 'bikeHandling') continue;
        updatedSkills[skillKey] = clamp(updatedSkills[skillKey] + delta);
      }
      updatedSkills.bikeHandling = calcBikeHandling(updatedSkills);

      update.run(
        calcOverall(updatedSkills),
        updatedSkills.flat,
        updatedSkills.mountain,
        updatedSkills.mediumMountain,
        updatedSkills.hill,
        updatedSkills.timeTrial,
        updatedSkills.prologue,
        updatedSkills.cobble,
        updatedSkills.sprint,
        updatedSkills.acceleration,
        updatedSkills.downhill,
        updatedSkills.attack,
        updatedSkills.stamina,
        updatedSkills.resistance,
        updatedSkills.recuperation,
        updatedSkills.bikeHandling,
        row.id,
      );
    }
  }

  public recalculateSpecializations(_currentSeason: number): void {
    if (!tableExists(this.db, 'riders') || !tableExists(this.db, 'type_rider')) return;

    const requiredColumns = [
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
      WHERE is_retired = 0
    `).all() as RiderDevelopmentRow[];

    const update = this.db.prepare(`
      UPDATE riders
      SET overall_rating = ?,
          skill_bike_handling = ?,
          rider_type_id = ?,
          specialization_1_id = ?,
          specialization_2_id = ?,
          specialization_3_id = ?
      WHERE id = ?
    `);

    this.db.transaction(() => {
      for (const row of rows) {
        const currentSkills = buildCurrentSkills(row);
        const specializationIds = buildUpdatedSpecializationIds(currentSkills, typeIdByKey);
        if (!specializationIds) {
          continue;
        }

        update.run(
          calcOverall(currentSkills),
          currentSkills.bikeHandling,
          specializationIds.riderTypeId,
          specializationIds.specialization1Id,
          specializationIds.specialization2Id,
          specializationIds.specialization3Id,
          row.id,
        );
      }
    })();

    new RiderTagService(this.db).recalculateAllTags();
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
        const potentials = buildPotentials(currentSkills, age, skillDevelopment, ageProfile.peakAge);
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