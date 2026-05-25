"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderDevelopmentService = void 0;
const RiderTagService_1 = require("./RiderTagService");
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
];
function tableExists(db, tableName) {
    const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName);
    return row != null;
}
function columnExists(db, tableName, columnName) {
    const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
    return columns.some(column => column.name === columnName);
}
function round2(value) {
    return Math.round(value * 100) / 100;
}
function clamp(value, min = 0, max = RIDER_STAT_MAX) {
    return round2(Math.max(min, Math.min(max, value)));
}
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}
function calcBikeHandling(skills) {
    return clamp(skills.downhill * 0.7 + skills.sprint * 0.15 + skills.attack * 0.05 + skills.resistance * 0.1);
}
function calcOverall(skills) {
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
    ];
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
function scoreProfile(skills, weights) {
    return weights.reduce((sum, [key, weight]) => sum + skills[key] * weight, 0);
}
function buildHybridSkills(skills, potentials) {
    const entries = RIDER_SKILL_COLUMNS.map(([key]) => {
        const baseValue = skills[key];
        const potentialValue = potentials[key];
        return [key, clamp(baseValue * 0.65 + potentialValue * 0.35)];
    });
    return Object.fromEntries(entries);
}
function getSpecializationScores(skills) {
    const scores = [
        { specialization: 'Berg', score: scoreProfile(skills, [['mountain', 0.4], ['mediumMountain', 0.2], ['stamina', 0.15], ['attack', 0.15], ['downhill', 0.1]]) },
        { specialization: 'Hill', score: scoreProfile(skills, [['hill', 0.35], ['acceleration', 0.2], ['mediumMountain', 0.15], ['attack', 0.15], ['bikeHandling', 0.15]]) },
        { specialization: 'Sprint', score: scoreProfile(skills, [['sprint', 0.4], ['acceleration', 0.25], ['flat', 0.15], ['bikeHandling', 0.1], ['resistance', 0.1]]) },
        { specialization: 'Timetrial', score: scoreProfile(skills, [['timeTrial', 0.5], ['prologue', 0.2], ['flat', 0.1], ['resistance', 0.1], ['bikeHandling', 0.1]]) },
        { specialization: 'Cobble', score: scoreProfile(skills, [['cobble', 0.4], ['flat', 0.2], ['resistance', 0.15], ['bikeHandling', 0.15], ['hill', 0.1]]) },
        { specialization: 'Attacker', score: scoreProfile(skills, [['attack', 0.28], ['acceleration', 0.18], ['hill', 0.18], ['mediumMountain', 0.18], ['resistance', 0.18]]) },
    ];
    return scores.sort((left, right) => right.score - left.score);
}
function buildAgeProfile() {
    const peakAge = rand(24, 28);
    const declineAge = rand(Math.max(peakAge + 1, 26), 32);
    const retirementAge = rand(Math.max(declineAge + 1, 32), 38);
    return { peakAge, declineAge, retirementAge };
}
function buildPotentials(skills, age, skillDevelopment, peakAge) {
    if (age >= peakAge) {
        return Object.fromEntries(RIDER_SKILL_COLUMNS.map(([key]) => [key, skills[key]]));
    }
    const ageFactor = Math.max(0.15, (peakAge - age) / 8);
    const developmentFactor = skillDevelopment / 20;
    const entries = RIDER_SKILL_COLUMNS.map(([key]) => {
        const current = skills[key];
        const headroom = Math.max(0, RIDER_STAT_MAX - current);
        if (headroom <= 0.01)
            return [key, current];
        const growthBase = headroom * (0.14 + ageFactor * 0.24 + developmentFactor * 0.22);
        const growth = Math.max(Math.min(headroom, growthBase * randomBetween(0.75, 1.25)), Math.min(headroom, 0.25));
        return [key, clamp(current + growth)];
    });
    return Object.fromEntries(entries);
}
function buildCurrentSkills(row) {
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
    };
    return {
        ...baseSkills,
        bikeHandling: calcBikeHandling(baseSkills),
    };
}
function buildCurrentSkillsFromDailyRow(row) {
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
function buildPotentialsFromDailyRow(row) {
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
function isOffseasonDevelopmentBlocked(currentDate) {
    const monthDay = currentDate.slice(5, 10);
    return monthDay >= '11-01' && monthDay <= '12-31';
}
function resolveDevelopmentBlockReason(row, context, currentDate, age) {
    if (row.is_retired === 1)
        return 'retired';
    if (context?.healthStatus === 'ill')
        return 'ill';
    if (context?.healthStatus === 'injured')
        return 'injured';
    if ((context?.unavailableDaysRemaining ?? 0) > 0)
        return 'unavailable';
    if (context?.formPhase === 'decline')
        return 'form_decline';
    if (isOffseasonDevelopmentBlocked(currentDate))
        return 'offseason';
    if (age >= row.peak_age)
        return 'peak_age_reached';
    return 'healthy';
}
function resolveAgeGrowthFactor(age, peakAge) {
    if (age >= peakAge)
        return 0;
    const yearsUntilPeak = Math.max(0, peakAge - age);
    return Math.max(0.18, Math.min(1.15, yearsUntilPeak / 7));
}
function resolveSkillDevelopmentFactor(skillDevelopment) {
    return 0.65 + (Math.max(1, Math.min(20, skillDevelopment)) / 20) * 0.7;
}
function resolveSkillFocusFactor(riderType, skillKey) {
    const factors = {
        Berg: { mountain: 1.35, mediumMountain: 1.2, stamina: 1.15, attack: 1.12, downhill: 1.05 },
        Hill: { hill: 1.35, acceleration: 1.2, mediumMountain: 1.12, attack: 1.12, bikeHandling: 1.05 },
        Sprint: { sprint: 1.35, acceleration: 1.25, flat: 1.15, resistance: 1.05 },
        Timetrial: { timeTrial: 1.35, prologue: 1.25, flat: 1.1, resistance: 1.1 },
        Cobble: { cobble: 1.35, flat: 1.15, resistance: 1.15, hill: 1.05, bikeHandling: 1.08 },
        Attacker: { attack: 1.35, acceleration: 1.15, hill: 1.12, mediumMountain: 1.1, resistance: 1.1 },
    };
    return factors[riderType][skillKey] ?? 0.78;
}
function resolveSkillDeclineFactor(skillKey) {
    const factors = {
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
function randomNoise(min, max) {
    return randomBetween(min, max);
}
function buildUpdatedSpecializationIds(skills, typeIdByKey) {
    const specializations = getSpecializationScores(skills).slice(0, 3).map(entry => entry.specialization);
    const riderTypeId = typeIdByKey.get(specializations[0]);
    const specialization1Id = specializations[0] == null ? null : typeIdByKey.get(specializations[0]) ?? null;
    const specialization2Id = specializations[1] == null ? null : typeIdByKey.get(specializations[1]) ?? null;
    const specialization3Id = specializations[2] == null ? null : typeIdByKey.get(specializations[2]) ?? null;
    if (riderTypeId == null || specialization1Id == null)
        return null;
    return { riderTypeId, specialization1Id, specialization2Id, specialization3Id };
}
class RiderDevelopmentService {
    constructor(db) {
        this.db = db;
    }
    advanceDailyDevelopment(currentDate, season, contexts, dayMultiplier = 1) {
        if (!tableExists(this.db, 'riders') || !tableExists(this.db, 'type_rider'))
            return;
        const boundedDayMultiplier = Math.max(1, Math.min(31, Math.floor(dayMultiplier)));
        const contextByRiderId = new Map(contexts.map((context) => [context.riderId, context]));
        const rows = this.db.prepare(`
      SELECT riders.id, riders.birth_year, riders.skill_development, riders.peak_age, riders.decline_age, riders.retirement_age,
             riders.is_retired, type_rider.type_key AS rider_type,
             riders.skill_flat, riders.skill_mountain, riders.skill_medium_mountain, riders.skill_hill, riders.skill_time_trial,
             riders.skill_prologue, riders.skill_cobble, riders.skill_sprint, riders.skill_acceleration, riders.skill_downhill,
             riders.skill_attack, riders.skill_stamina, riders.skill_resistance, riders.skill_recuperation, riders.skill_bike_handling,
             riders.pot_flat, riders.pot_mountain, riders.pot_medium_mountain, riders.pot_hill, riders.pot_time_trial,
             riders.pot_prologue, riders.pot_cobble, riders.pot_sprint, riders.pot_acceleration, riders.pot_downhill,
             riders.pot_attack, riders.pot_stamina, riders.pot_resistance, riders.pot_recuperation, riders.pot_bike_handling
      FROM riders
      JOIN type_rider ON type_rider.id = riders.rider_type_id
    `).all();
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
        for (const row of rows) {
            const age = season - row.birth_year;
            const context = contextByRiderId.get(row.id);
            const currentSkills = buildCurrentSkillsFromDailyRow(row);
            const potentialSkills = buildPotentialsFromDailyRow(row);
            const blockedReason = resolveDevelopmentBlockReason(row, context, currentDate, age);
            const deltas = {};
            let growthTotal = 0;
            let declineTotal = 0;
            if (blockedReason === 'healthy') {
                const ageFactor = resolveAgeGrowthFactor(age, row.peak_age);
                const developmentFactor = resolveSkillDevelopmentFactor(row.skill_development);
                for (const [skillKey] of RIDER_SKILL_COLUMNS) {
                    if (skillKey === 'bikeHandling')
                        continue;
                    const headroom = Math.max(0, potentialSkills[skillKey] - currentSkills[skillKey]);
                    if (headroom <= 0.01)
                        continue;
                    const dailyGrowth = Math.min(DAILY_GROWTH_CAP * boundedDayMultiplier, headroom * 0.0023 * ageFactor * developmentFactor * resolveSkillFocusFactor(row.rider_type, skillKey) * boundedDayMultiplier * randomNoise(0.75, 1.25));
                    if (dailyGrowth <= 0)
                        continue;
                    const applied = clamp(Math.min(potentialSkills[skillKey], currentSkills[skillKey] + dailyGrowth)) - currentSkills[skillKey];
                    if (applied > 0) {
                        deltas[skillKey] = round2(applied);
                        growthTotal += applied;
                    }
                }
            }
            if (row.is_retired !== 1 && age >= row.decline_age) {
                const yearsAfterDecline = Math.max(0, age - row.decline_age + 1);
                const ageDeclineFactor = Math.min(2.4, 0.35 + yearsAfterDecline * 0.22);
                for (const [skillKey] of RIDER_SKILL_COLUMNS) {
                    if (skillKey === 'bikeHandling')
                        continue;
                    const dailyDecline = Math.min(DAILY_DECLINE_CAP * boundedDayMultiplier, 0.00135 * ageDeclineFactor * resolveSkillDeclineFactor(skillKey) * boundedDayMultiplier * randomNoise(0.75, 1.25));
                    if (dailyDecline <= 0)
                        continue;
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
            for (const [skillKey, delta] of Object.entries(deltas)) {
                if (skillKey === 'bikeHandling')
                    continue;
                updatedSkills[skillKey] = clamp(updatedSkills[skillKey] + delta);
            }
            updatedSkills.bikeHandling = calcBikeHandling(updatedSkills);
            update.run(calcOverall(updatedSkills), updatedSkills.flat, updatedSkills.mountain, updatedSkills.mediumMountain, updatedSkills.hill, updatedSkills.timeTrial, updatedSkills.prologue, updatedSkills.cobble, updatedSkills.sprint, updatedSkills.acceleration, updatedSkills.downhill, updatedSkills.attack, updatedSkills.stamina, updatedSkills.resistance, updatedSkills.recuperation, updatedSkills.bikeHandling, row.id);
        }
    }
    recalculateSpecializations(_currentSeason) {
        if (!tableExists(this.db, 'riders') || !tableExists(this.db, 'type_rider'))
            return;
        const requiredColumns = [
            'rider_type_id',
            'specialization_1_id',
            'specialization_2_id',
            'specialization_3_id',
        ];
        if (requiredColumns.some(column => !columnExists(this.db, 'riders', column)))
            return;
        const typeIdByKey = new Map();
        const typeRows = this.db.prepare('SELECT id, type_key FROM type_rider').all();
        for (const row of typeRows)
            typeIdByKey.set(row.type_key, row.id);
        const rows = this.db.prepare(`
      SELECT id, birth_year, skill_development, peak_age, decline_age, retirement_age,
             skill_flat, skill_mountain, skill_medium_mountain, skill_hill, skill_time_trial,
             skill_prologue, skill_cobble, skill_sprint, skill_acceleration, skill_downhill,
             skill_attack, skill_stamina, skill_resistance, skill_recuperation
      FROM riders
      WHERE is_retired = 0
    `).all();
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
                update.run(calcOverall(currentSkills), currentSkills.bikeHandling, specializationIds.riderTypeId, specializationIds.specialization1Id, specializationIds.specialization2Id, specializationIds.specialization3Id, row.id);
            }
        })();
        new RiderTagService_1.RiderTagService(this.db).recalculateAllTags();
    }
    initializeRiders(currentSeason, force = false) {
        if (!tableExists(this.db, 'riders') || !tableExists(this.db, 'type_rider'))
            return;
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
        if (requiredColumns.some(column => !columnExists(this.db, 'riders', column)))
            return;
        const typeIdByKey = new Map();
        const typeRows = this.db.prepare('SELECT id, type_key FROM type_rider').all();
        for (const row of typeRows)
            typeIdByKey.set(row.type_key, row.id);
        const rows = this.db.prepare(`
      SELECT id, birth_year, skill_development, peak_age, decline_age, retirement_age,
             skill_flat, skill_mountain, skill_medium_mountain, skill_hill, skill_time_trial,
             skill_prologue, skill_cobble, skill_sprint, skill_acceleration, skill_downhill,
             skill_attack, skill_stamina, skill_resistance, skill_recuperation
      FROM riders
    `).all();
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
                if (!needsInitialization)
                    continue;
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
                update.run(ageProfile.peakAge, ageProfile.declineAge, ageProfile.retirementAge, skillDevelopment, calcOverall(currentSkills), calcOverall(potentials), currentSkills.bikeHandling, potentials.flat, potentials.mountain, potentials.mediumMountain, potentials.hill, potentials.timeTrial, potentials.prologue, potentials.cobble, potentials.sprint, potentials.acceleration, potentials.downhill, potentials.attack, potentials.stamina, potentials.resistance, potentials.recuperation, potentials.bikeHandling, riderTypeId, specialization1Id, specialization2Id, specialization3Id, row.id);
            }
        })();
        new RiderTagService_1.RiderTagService(this.db).recalculateAllTags();
    }
}
exports.RiderDevelopmentService = RiderDevelopmentService;
