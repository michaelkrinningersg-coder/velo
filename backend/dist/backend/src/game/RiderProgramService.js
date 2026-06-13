"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderProgramService = void 0;
const SPECIALIZATION_IDS = [1, 2, 3, 4, 5, 6];
const ROLE_FALLBACK = 'Wassertraeger';
function tableExists(db, tableName) {
    const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName);
    return row != null;
}
function normalizeRoleName(value) {
    return value?.trim() || ROLE_FALLBACK;
}
function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}
function deterministicUnit(seed) {
    return hashString(seed) / 0xffffffff;
}
function isSpecializationId(value) {
    return SPECIALIZATION_IDS.includes(value);
}
function normalizeSpecIds(specIds) {
    const uniqueSpecIds = Array.from(new Set(specIds.filter(isSpecializationId)));
    return SPECIALIZATION_IDS.filter((specId) => uniqueSpecIds.includes(specId));
}
function resolveSkillScores(row) {
    return {
        1: row.skill_mountain * 0.45 + row.skill_medium_mountain * 0.25 + row.skill_recuperation * 0.15 + row.skill_stamina * 0.15,
        2: row.skill_hill * 0.4 + row.skill_medium_mountain * 0.2 + row.skill_acceleration * 0.15 + row.skill_attack * 0.15 + row.skill_resistance * 0.1,
        3: row.skill_sprint * 0.4 + row.skill_acceleration * 0.25 + row.skill_flat * 0.15 + row.skill_bike_handling * 0.1 + row.skill_resistance * 0.1,
        4: row.skill_time_trial * 0.45 + row.skill_prologue * 0.25 + row.skill_flat * 0.15 + row.skill_stamina * 0.15,
        5: row.skill_cobble * 0.55 + row.skill_flat * 0.15 + row.skill_bike_handling * 0.15 + row.skill_resistance * 0.15,
        6: row.skill_attack * 0.35 + row.skill_stamina * 0.2 + row.skill_resistance * 0.2 + row.skill_hill * 0.15 + row.skill_acceleration * 0.1,
    };
}
function resolveBestSpecIds(row) {
    const seededSpecs = normalizeSpecIds([
        row.specialization_1_id,
        row.specialization_2_id,
        row.specialization_3_id,
    ].filter((specId) => specId != null));
    if (seededSpecs.length >= 3) {
        return seededSpecs.slice(0, 3);
    }
    const scores = resolveSkillScores(row);
    const missingSpecs = SPECIALIZATION_IDS
        .filter((specId) => !seededSpecs.includes(specId))
        .sort((left, right) => scores[right] - scores[left] || left - right);
    return normalizeSpecIds([...seededSpecs, ...missingSpecs.slice(0, 3 - seededSpecs.length)]);
}
function ruleMatchesSpecs(rule, specs) {
    const ruleSpecs = normalizeSpecIds([rule.spec_1, rule.spec_2, rule.spec_3].filter((specId) => specId != null));
    return ruleSpecs.every((spec) => specs.includes(spec));
}
function ruleSpecificity(rule) {
    return [rule.spec_1, rule.spec_2, rule.spec_3].filter((spec) => spec != null).length;
}
function selectRulePool(rules, roleName, specs) {
    const matching = rules.filter((rule) => rule.role_name === roleName && ruleMatchesSpecs(rule, specs));
    if (matching.length > 0) {
        const maxSpecificity = Math.max(...matching.map(ruleSpecificity));
        return matching.filter((rule) => ruleSpecificity(rule) === maxSpecificity);
    }
    const fallback = rules.filter((rule) => rule.role_name === ROLE_FALLBACK && ruleMatchesSpecs(rule, specs));
    if (fallback.length > 0) {
        const maxSpecificity = Math.max(...fallback.map(ruleSpecificity));
        return fallback.filter((rule) => ruleSpecificity(rule) === maxSpecificity);
    }
    return rules.filter((rule) => ruleSpecificity(rule) === 0);
}
function chooseProgramId(rules, seed) {
    const totalWeight = rules.reduce((sum, rule) => sum + Math.max(0, rule.probability), 0);
    if (totalWeight <= 0) {
        return null;
    }
    const target = deterministicUnit(seed) * totalWeight;
    let cursor = 0;
    for (const rule of [...rules].sort((left, right) => left.id - right.id)) {
        cursor += Math.max(0, rule.probability);
        if (target <= cursor) {
            return rule.program_id;
        }
    }
    return rules[rules.length - 1]?.program_id ?? null;
}
class RiderProgramService {
    constructor(db) {
        this.db = db;
    }
    ensureSeasonPrograms(season, assignedOn) {
        if (!tableExists(this.db, 'riders') || !tableExists(this.db, 'race_programs') || !tableExists(this.db, 'race_program_probability_rules')) {
            return;
        }
        this.ensureSchema();
        const assignedDate = assignedOn ?? this.resolveAssignedOn(season);
        const missingCount = this.db.prepare(`
      SELECT COUNT(*) AS count
      FROM riders
      LEFT JOIN contracts current_contract
        ON current_contract.id = (
          SELECT contracts.id
          FROM contracts
          WHERE contracts.rider_id = riders.id
            AND contracts.start_season <= ?
            AND contracts.end_season >= ?
          ORDER BY contracts.start_season DESC, contracts.id DESC
          LIMIT 1
        )
      WHERE riders.is_retired = 0
        AND COALESCE(current_contract.team_id, riders.active_team_id) IS NOT NULL
        AND NOT EXISTS (
          SELECT 1
          FROM rider_season_programs existing_program
          WHERE existing_program.season = ?
            AND existing_program.rider_id = riders.id
        )
    `).get(season, season, season)?.count ?? 0;
        if (missingCount === 0) {
            return;
        }
        const rules = this.db.prepare(`
      SELECT id, role_name, spec_1, spec_2, spec_3, program_id, probability
      FROM race_program_probability_rules
      ORDER BY id ASC
    `).all();
        if (rules.length === 0) {
            return;
        }
        // Query all active riders to compute rankings within each team
        const allActiveRiders = this.db.prepare(`
      SELECT riders.id,
             role.name AS role_name,
             riders.overall_rating,
             COALESCE(current_contract.team_id, riders.active_team_id) AS team_id
      FROM riders
      LEFT JOIN sta_role role ON role.id = riders.role_id
      LEFT JOIN contracts current_contract
        ON current_contract.id = (
          SELECT contracts.id
          FROM contracts
          WHERE contracts.rider_id = riders.id
            AND contracts.start_season <= ?
            AND contracts.end_season >= ?
          ORDER BY contracts.start_season DESC, contracts.id DESC
          LIMIT 1
        )
      WHERE riders.is_retired = 0
        AND COALESCE(current_contract.team_id, riders.active_team_id) IS NOT NULL
    `).all(season, season);
        const ridersByTeam = new Map();
        for (const r of allActiveRiders) {
            const teamId = r.team_id;
            if (!ridersByTeam.has(teamId)) {
                ridersByTeam.set(teamId, []);
            }
            ridersByTeam.get(teamId).push(r);
        }
        for (const teamRiders of ridersByTeam.values()) {
            teamRiders.sort((a, b) => b.overall_rating - a.overall_rating || a.id - b.id);
        }
        const bestSprinterByTeam = new Map();
        for (const [teamId, teamRiders] of ridersByTeam.entries()) {
            const sprinters = teamRiders.filter(r => normalizeRoleName(r.role_name) === 'Sprinter');
            if (sprinters.length > 0) {
                bestSprinterByTeam.set(teamId, sprinters[0].id);
            }
        }
        const riders = this.db.prepare(`
      SELECT riders.id,
             role.name AS role_name,
             riders.specialization_1_id,
             riders.specialization_2_id,
             riders.specialization_3_id,
             riders.overall_rating,
             COALESCE(current_contract.team_id, riders.active_team_id) AS team_id,
             riders.skill_flat,
             riders.skill_mountain,
             riders.skill_medium_mountain,
             riders.skill_hill,
             riders.skill_time_trial,
             riders.skill_prologue,
             riders.skill_cobble,
             riders.skill_sprint,
             riders.skill_acceleration,
             riders.skill_downhill,
             riders.skill_attack,
             riders.skill_stamina,
             riders.skill_resistance,
             riders.skill_recuperation,
             riders.skill_bike_handling
      FROM riders
      LEFT JOIN sta_role role ON role.id = riders.role_id
      LEFT JOIN contracts current_contract
        ON current_contract.id = (
          SELECT contracts.id
          FROM contracts
          WHERE contracts.rider_id = riders.id
            AND contracts.start_season <= ?
            AND contracts.end_season >= ?
          ORDER BY contracts.start_season DESC, contracts.id DESC
          LIMIT 1
        )
      WHERE riders.is_retired = 0
        AND COALESCE(current_contract.team_id, riders.active_team_id) IS NOT NULL
        AND NOT EXISTS (
          SELECT 1
          FROM rider_season_programs existing_program
          WHERE existing_program.season = ?
            AND existing_program.rider_id = riders.id
        )
      ORDER BY riders.id ASC
    `).all(season, season, season);
        const insert = this.db.prepare(`
      INSERT OR IGNORE INTO rider_season_programs (season, rider_id, program_id, assigned_on)
      VALUES (?, ?, ?, ?)
    `);
        this.db.transaction(() => {
            for (const rider of riders) {
                const roleName = normalizeRoleName(rider.role_name);
                const specs = resolveBestSpecIds(rider);
                const isBestSprinter = bestSprinterByTeam.get(rider.team_id) === rider.id;
                let rulePool;
                if (isBestSprinter) {
                    rulePool = [
                        { id: -1, role_name: 'Sprinter', spec_1: null, spec_2: null, spec_3: null, program_id: 2, probability: 50 },
                        { id: -2, role_name: 'Sprinter', spec_1: null, spec_2: null, spec_3: null, program_id: 6, probability: 50 },
                    ];
                }
                else {
                    const excludedProgramIds = new Set();
                    if (roleName === 'Kapitaen' || roleName === 'Co-Kapitaen') {
                        [14, 15, 17, 18, 19, 20].forEach(id => excludedProgramIds.add(id));
                    }
                    const teamRiders = ridersByTeam.get(rider.team_id) ?? [];
                    const nonLeaderRiders = teamRiders.filter(r => normalizeRoleName(r.role_name) !== 'Kapitaen' && normalizeRoleName(r.role_name) !== 'Co-Kapitaen');
                    const nonLeaderIndex = nonLeaderRiders.findIndex(r => r.id === rider.id);
                    if (nonLeaderIndex >= 0 && nonLeaderIndex <= 3) {
                        [15, 18, 19, 20].forEach(id => excludedProgramIds.add(id));
                    }
                    const filteredRules = rules.filter(r => !excludedProgramIds.has(r.program_id));
                    rulePool = selectRulePool(filteredRules, roleName, specs);
                }
                const programId = chooseProgramId(rulePool, `${season}|${rider.id}|${roleName}|${specs.join('|')}`);
                if (programId == null) {
                    continue;
                }
                insert.run(season, rider.id, programId, assignedDate);
            }
        })();
        // Debug output: count program assignments and print detailed lists sorted by overall strength
        try {
            const assignments = this.db.prepare(`
        SELECT riders.first_name,
               riders.last_name,
               riders.overall_rating,
               race_programs.name AS program_name,
               race_programs.id AS program_id
        FROM rider_season_programs
        JOIN riders ON riders.id = rider_season_programs.rider_id
        JOIN race_programs ON race_programs.id = rider_season_programs.program_id
        WHERE rider_season_programs.season = ?
      `).all(season);
            const assignmentsByProgram = new Map();
            for (const a of assignments) {
                if (!assignmentsByProgram.has(a.program_name)) {
                    assignmentsByProgram.set(a.program_name, []);
                }
                assignmentsByProgram.get(a.program_name).push(a);
            }
            console.log(`\n=== RACE PROGRAM ASSIGNMENTS FOR SEASON ${season} ===`);
            const sortedProgNames = Array.from(assignmentsByProgram.keys()).sort();
            for (const progName of sortedProgNames) {
                const progRiders = assignmentsByProgram.get(progName);
                progRiders.sort((a, b) => b.overall_rating - a.overall_rating || a.last_name.localeCompare(b.last_name));
                console.log(`Program: ${progName} (Count: ${progRiders.length})`);
                for (const r of progRiders) {
                    console.log(`  - ${r.first_name} ${r.last_name} (OVR: ${r.overall_rating})`);
                }
            }
            console.log(`===================================================\n`);
        }
        catch (error) {
            console.error('Failed to print race program assignment debug log:', error);
        }
    }
    ensureSchema() {
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS rider_season_programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        season INTEGER NOT NULL,
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        program_id INTEGER NOT NULL REFERENCES race_programs(id),
        assigned_on TEXT NOT NULL,
        UNIQUE(season, rider_id)
      );

      CREATE INDEX IF NOT EXISTS idx_rider_season_programs_program
        ON rider_season_programs(season, program_id);
    `);
    }
    resolveAssignedOn(season) {
        const row = this.db.prepare('SELECT "current_date" AS current_date FROM game_state WHERE id = 1').get();
        return row?.current_date ?? `${season}-01-01`;
    }
}
exports.RiderProgramService = RiderProgramService;
