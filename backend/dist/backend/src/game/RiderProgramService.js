"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderProgramService = void 0;
const SPECIALIZATION_IDS = [1, 2, 3, 4, 5, 6, 7];
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
    const uniqueSpecIds = [];
    for (const id of specIds) {
        if (isSpecializationId(id) && !uniqueSpecIds.includes(id)) {
            uniqueSpecIds.push(id);
        }
    }
    return uniqueSpecIds;
}
function resolveSkillScores(row) {
    return {
        1: row.skill_mountain * 0.45 + row.skill_medium_mountain * 0.25 + row.skill_recuperation * 0.15 + row.skill_stamina * 0.15,
        2: row.skill_hill * 0.4 + row.skill_medium_mountain * 0.2 + row.skill_acceleration * 0.15 + row.skill_attack * 0.15 + row.skill_resistance * 0.1,
        3: row.skill_sprint * 0.4 + row.skill_acceleration * 0.25 + row.skill_flat * 0.15 + row.skill_bike_handling * 0.1 + row.skill_resistance * 0.1,
        4: row.skill_time_trial * 0.45 + row.skill_prologue * 0.25 + row.skill_flat * 0.15 + row.skill_stamina * 0.15,
        5: row.skill_cobble * 0.55 + row.skill_flat * 0.15 + row.skill_bike_handling * 0.15 + row.skill_resistance * 0.15,
        6: (row.skill_attack * 0.35 + row.skill_stamina * 0.2 + row.skill_resistance * 0.2 + row.skill_hill * 0.15 + row.skill_acceleration * 0.1) * 0.978,
        7: (row.skill_flat * 0.5 + row.skill_stamina * 0.2 + row.skill_resistance * 0.15 + row.skill_bike_handling * 0.15) * 0.991,
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
class RiderProgramService {
    constructor(db) {
        this.db = db;
    }
    ensureSeasonPrograms(season, assignedOn) {
        if (!tableExists(this.db, 'riders') || !tableExists(this.db, 'race_programs')) {
            return;
        }
        this.ensureSchema();
        // Clean up any existing program assignments for teamless riders
        this.db.prepare(`
      DELETE FROM rider_season_programs
      WHERE season = ? AND rider_id IN (
        SELECT r.id
        FROM riders r
        LEFT JOIN contracts c ON c.id = (
          SELECT contracts.id FROM contracts
          WHERE contracts.rider_id = r.id
            AND contracts.start_season <= ?
            AND contracts.end_season >= ?
          ORDER BY contracts.start_season DESC, contracts.id DESC
          LIMIT 1
        )
        WHERE COALESCE(c.team_id, r.active_team_id) IS NULL
      )
    `).run(season, season, season);
        const assignedDate = assignedOn ?? this.resolveAssignedOn(season);
        const missingCount = this.db.prepare(`
      SELECT COUNT(*) AS count
      FROM riders
      WHERE riders.is_retired = 0
        AND NOT EXISTS (
          SELECT 1
          FROM rider_season_programs existing_program
          WHERE existing_program.season = ?
            AND existing_program.rider_id = riders.id
        )
        AND COALESCE(
          (
            SELECT team_id FROM contracts
            WHERE contracts.rider_id = riders.id
              AND contracts.start_season <= ?
              AND contracts.end_season >= ?
            ORDER BY contracts.start_season DESC, contracts.id DESC
            LIMIT 1
          ),
          riders.active_team_id
        ) IS NOT NULL
    `).get(season, season, season)?.count ?? 0;
        if (missingCount === 0) {
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
             country.program_group_id AS program_group_id,
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
      LEFT JOIN sta_country country ON country.id = riders.country_id
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
        const allPrograms = this.db.prepare('SELECT id, name FROM race_programs').all();
        const programsByName = new Map();
        for (const p of allPrograms) {
            programsByName.set(p.name, p.id);
        }
        const validExactMatchCombos = new Set([
            'SHP', 'HBS', 'SPH', 'HSB', 'HSP', 'BHS', 'BHT', 'HBP', 'PSH', 'BHP',
            'PHS', 'HPS', 'HPB', 'TPH', 'HBT', 'PST', 'PHB', 'PTH', 'SPT', 'TBH', 'HTB', 'BTH',
            'FPS', 'FSP', 'FSH', 'FHS', 'FPH', 'FHP', 'FPT', 'FTP', 'FTS', 'FST',
            'BFH', 'BHF', 'BFS', 'BSF', 'BFT', 'BTF', 'BFP', 'BPF',
            'HFB', 'HBF', 'HFS', 'HSF', 'HFT', 'HTF', 'HFP', 'HPF',
            'SFB', 'SBF', 'SFH', 'SHF', 'SFT', 'STF', 'SFP', 'SPF',
            'TFB', 'TBF', 'TFH', 'THF', 'TFS', 'TSF', 'TFP', 'TPF',
            'PFB', 'PBF', 'PFH', 'PHF', 'PFS', 'PSF', 'PFT', 'PTF'
        ]);
        const specAbbrMap = { 1: 'B', 2: 'H', 3: 'S', 4: 'T', 5: 'P', 6: 'A', 7: 'F' };
        const combosWith3Variants = new Set([
            'HPB', 'TPH', 'HBT', 'PST', 'PHB', 'PTH', 'SPT', 'TBH', 'HTB', 'BTH'
        ]);
        const REGION_NAMES = {
            1: 'BeNeLUX',
            2: 'FraGer',
            3: 'EspSlo',
            4: 'ITAUSA'
        };
        // Group riders by combination key
        const groups = new Map();
        for (const rider of riders) {
            const specs = resolveBestSpecIds(rider);
            const orderedAbbr = specs.map(id => specAbbrMap[id]).join('');
            let comboKey = 'OOO';
            if (validExactMatchCombos.has(orderedAbbr)) {
                comboKey = orderedAbbr;
            }
            else {
                const spec1 = specs[0];
                if (spec1 === 5) {
                    comboKey = 'POO';
                }
                else if (spec1 === 3) {
                    comboKey = 'SOO';
                }
                else if (spec1 === 1) {
                    comboKey = 'BOO';
                }
                else if (spec1 === 2) {
                    comboKey = 'HOO';
                }
                else {
                    comboKey = 'OOO';
                }
            }
            if (!groups.has(comboKey)) {
                groups.set(comboKey, []);
            }
            groups.get(comboKey).push(rider);
        }
        const insert = this.db.prepare(`
      INSERT OR IGNORE INTO rider_season_programs (season, rider_id, program_id, assigned_on)
      VALUES (?, ?, ?, ?)
    `);
        const assignFallback = (rider, originalComboKey) => {
            let assigned = false;
            const specs = resolveBestSpecIds(rider);
            const spec1 = specs[0];
            // Determine fallback key based on spec1
            let fallbackKey = 'OOO';
            if (spec1 === 5) {
                fallbackKey = 'POO';
            }
            else if (spec1 === 3) {
                fallbackKey = 'SOO';
            }
            else if (spec1 === 1) {
                fallbackKey = 'BOO';
            }
            else if (spec1 === 2) {
                fallbackKey = 'HOO';
            }
            else {
                fallbackKey = 'OOO';
            }
            // Try assigning to the specific fallback key first (check for regional or standard variants)
            const availablePrograms = Array.from(programsByName.keys())
                .filter(name => {
                const parts = name.split('_');
                return parts[0] === fallbackKey;
            });
            if (availablePrograms.length > 0) {
                availablePrograms.sort();
                // Check regional group first
                const regionId = rider.program_group_id || 4;
                const regionName = REGION_NAMES[regionId];
                const regionalPrograms = availablePrograms.filter(name => name.includes(`_${regionName}_`));
                const targets = regionalPrograms.length > 0 ? regionalPrograms : availablePrograms;
                const selectedName = targets[rider.id % targets.length];
                const programId = programsByName.get(selectedName);
                insert.run(season, rider.id, programId, assignedDate);
                assigned = true;
            }
            // If not assigned, fall back to OOO
            if (!assigned && fallbackKey !== 'OOO') {
                const availableOoo = Array.from(programsByName.keys())
                    .filter(name => name.startsWith('OOO_'));
                if (availableOoo.length > 0) {
                    availableOoo.sort();
                    const regionId = rider.program_group_id || 4;
                    const regionName = REGION_NAMES[regionId];
                    const regionalOoo = availableOoo.filter(name => name.includes(`_${regionName}_`));
                    const targets = regionalOoo.length > 0 ? regionalOoo : availableOoo;
                    const selectedName = targets[rider.id % targets.length];
                    const programId = programsByName.get(selectedName);
                    insert.run(season, rider.id, programId, assignedDate);
                    assigned = true;
                }
            }
            // If still not assigned, fall back to the first available program in the database
            if (!assigned) {
                const firstProgramId = Array.from(programsByName.values())[0];
                if (firstProgramId != null) {
                    insert.run(season, rider.id, firstProgramId, assignedDate);
                }
            }
        };
        this.db.transaction(() => {
            for (const [comboKey, groupRiders] of groups.entries()) {
                groupRiders.sort((a, b) => b.overall_rating - a.overall_rating || a.id - b.id);
                // Check if there are regional variants in the database for this combination
                const isSplit = Array.from(programsByName.keys()).some(name => name.startsWith(`${comboKey}_BeNeLUX_`));
                if (isSplit) {
                    // Group by regional program group
                    const regionalGroups = { 1: [], 2: [], 3: [], 4: [] };
                    for (const rider of groupRiders) {
                        const regionId = rider.program_group_id || 4; // default to 4 (ITAUSA)
                        if (!regionalGroups[regionId]) {
                            regionalGroups[regionId] = [];
                        }
                        regionalGroups[regionId].push(rider);
                    }
                    for (const [regionIdStr, rList] of Object.entries(regionalGroups)) {
                        const regionId = parseInt(regionIdStr);
                        const regionName = REGION_NAMES[regionId] || 'ITAUSA';
                        // Find all available variants for this comboKey and region in the database
                        const availableVariants = [];
                        for (let v = 1; v <= 6; v++) {
                            const name = `${comboKey}_${regionName}_${v}`;
                            if (programsByName.has(name)) {
                                availableVariants.push(v);
                            }
                        }
                        if (availableVariants.length > 0) {
                            for (let i = 0; i < rList.length; i++) {
                                const rider = rList[i];
                                const variant = (i % 6) + 1;
                                const progName = `${comboKey}_${regionName}_${variant}`;
                                if (programsByName.has(progName)) {
                                    const programId = programsByName.get(progName);
                                    insert.run(season, rider.id, programId, assignedDate);
                                }
                                else {
                                    assignFallback(rider, comboKey);
                                }
                            }
                        }
                        else if (rList.length > 0) {
                            // Fallback to standard/global variants if the entire region was pruned
                            const availableGlobalVariants = [];
                            const maxVariants = combosWith3Variants.has(comboKey) ? 3 : 6;
                            for (let v = 1; v <= maxVariants; v++) {
                                const name = `${comboKey}_${v}`;
                                if (programsByName.has(name)) {
                                    availableGlobalVariants.push(v);
                                }
                            }
                            if (availableGlobalVariants.length > 0) {
                                for (let i = 0; i < rList.length; i++) {
                                    const rider = rList[i];
                                    const variant = (i % maxVariants) + 1;
                                    const progName = `${comboKey}_${variant}`;
                                    if (programsByName.has(progName)) {
                                        const programId = programsByName.get(progName);
                                        insert.run(season, rider.id, programId, assignedDate);
                                    }
                                    else {
                                        assignFallback(rider, comboKey);
                                    }
                                }
                            }
                            else {
                                for (const rider of rList) {
                                    assignFallback(rider, comboKey);
                                }
                            }
                        }
                    }
                }
                else {
                    // Standard / non-split combination
                    const availableGlobalVariants = [];
                    const maxVariants = combosWith3Variants.has(comboKey) ? 3 : 6;
                    for (let v = 1; v <= maxVariants; v++) {
                        const name = `${comboKey}_${v}`;
                        if (programsByName.has(name)) {
                            availableGlobalVariants.push(v);
                        }
                    }
                    if (availableGlobalVariants.length > 0) {
                        for (let i = 0; i < groupRiders.length; i++) {
                            const rider = groupRiders[i];
                            const variant = (i % maxVariants) + 1;
                            const progName = `${comboKey}_${variant}`;
                            if (programsByName.has(progName)) {
                                const programId = programsByName.get(progName);
                                insert.run(season, rider.id, programId, assignedDate);
                            }
                            else {
                                assignFallback(rider, comboKey);
                            }
                        }
                    }
                    else {
                        for (const rider of groupRiders) {
                            assignFallback(rider, comboKey);
                        }
                    }
                }
            }
        })();
        this.ensureLieutenants(season, assignedDate);
        // Debug output: count program assignments and print detailed lists sorted by overall strength
        try {
            const assignments = this.db.prepare(`
        SELECT riders.first_name,
               riders.last_name,
               riders.overall_rating,
               role.name AS role_name,
               race_programs.name AS program_name,
               race_programs.id AS program_id
        FROM rider_season_programs
        JOIN riders ON riders.id = rider_season_programs.rider_id
        LEFT JOIN sta_role role ON role.id = riders.role_id
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
                const rolesCount = {};
                for (const r of progRiders) {
                    const role = r.role_name ?? 'Wassertraeger';
                    rolesCount[role] = (rolesCount[role] || 0) + 1;
                }
                console.log(`  Roles: ${JSON.stringify(rolesCount)}`);
                for (const r of progRiders.slice(0, 5)) {
                    console.log(`  - ${r.first_name} ${r.last_name} (OVR: ${r.overall_rating}, Role: ${r.role_name})`);
                }
                if (progRiders.length > 5) {
                    console.log(`  - ... and ${progRiders.length - 5} more`);
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

      CREATE TABLE IF NOT EXISTS rider_lieutenants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        season INTEGER NOT NULL,
        leader_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        lieutenant_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        UNIQUE(season, leader_id),
        UNIQUE(season, lieutenant_id)
      );

      CREATE TABLE IF NOT EXISTS lieutenant_all_time_peaks (
        rider_id INTEGER PRIMARY KEY REFERENCES riders(id) ON DELETE CASCADE,
        max_overall_rating INTEGER NOT NULL,
        leader_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        season INTEGER NOT NULL
      );
    `);
    }
    resolveAssignedOn(season) {
        const row = this.db.prepare('SELECT "current_date" AS current_date FROM game_state WHERE id = 1').get();
        return row?.current_date ?? `${season}-01-01`;
    }
    ensureLieutenants(season, assignedDate) {
        if (!tableExists(this.db, 'rider_lieutenants')) {
            return;
        }
        // Cleanup any existing lieutenants where the leader is not a Captain (role_id = 1) or Sprinter (role_id = 6)
        this.db.prepare(`
      DELETE FROM rider_lieutenants
      WHERE season = ? AND leader_id IN (
        SELECT id FROM riders WHERE role_id NOT IN (1, 6)
      )
    `).run(season);
        if (tableExists(this.db, 'lieutenant_all_time_peaks')) {
            this.db.prepare(`
        DELETE FROM lieutenant_all_time_peaks
        WHERE season = ? AND leader_id IN (
          SELECT id FROM riders WHERE role_id NOT IN (1, 6)
        )
      `).run(season);
        }
        // Find teams that already have any lieutenant assigned for this season
        const teamsWithLts = new Set(this.db.prepare(`
        SELECT DISTINCT COALESCE(c.team_id, r.active_team_id) AS team_id
        FROM rider_lieutenants rl
        JOIN riders r ON r.id = rl.lieutenant_id
        LEFT JOIN contracts c ON c.rider_id = r.id AND c.start_season <= ? AND c.end_season >= ?
        WHERE rl.season = ? AND COALESCE(c.team_id, r.active_team_id) IS NOT NULL
      `).all(season, season, season).map((row) => row.team_id));
        // Retrieve all active riders with their roles, specs, and details
        const riders = this.db.prepare(`
      SELECT r.id,
             role.name AS role_name,
             r.specialization_1_id,
             r.specialization_2_id,
             r.specialization_3_id,
             r.overall_rating,
             COALESCE(current_contract.team_id, r.active_team_id) AS team_id,
             r.skill_sprint
      FROM riders r
      LEFT JOIN sta_role role ON role.id = r.role_id
      LEFT JOIN contracts current_contract
        ON current_contract.id = (
          SELECT contracts.id
          FROM contracts
          WHERE contracts.rider_id = r.id
            AND contracts.start_season <= ?
            AND contracts.end_season >= ?
          ORDER BY contracts.start_season DESC, contracts.id DESC
          LIMIT 1
        )
      WHERE r.is_retired = 0
        AND COALESCE(current_contract.team_id, r.active_team_id) IS NOT NULL
      ORDER BY r.overall_rating DESC, r.id ASC
    `).all(season, season);
        // Group riders by team
        const ridersByTeam = new Map();
        for (const r of riders) {
            if (!ridersByTeam.has(r.team_id)) {
                ridersByTeam.set(r.team_id, []);
            }
            ridersByTeam.get(r.team_id).push(r);
        }
        const insertLt = this.db.prepare(`
      INSERT OR IGNORE INTO rider_lieutenants (season, leader_id, lieutenant_id)
      VALUES (?, ?, ?)
    `);
        const updateLtProgram = this.db.prepare(`
      INSERT OR REPLACE INTO rider_season_programs (season, rider_id, program_id, assigned_on)
      VALUES (?, ?, ?, ?)
    `);
        const insertPeakInitial = this.db.prepare(`
      INSERT OR IGNORE INTO lieutenant_all_time_peaks (rider_id, max_overall_rating, leader_id, season)
      VALUES (?, ?, ?, ?)
    `);
        this.db.transaction(() => {
            for (const [teamId, teamRiders] of ridersByTeam.entries()) {
                if (teamsWithLts.has(teamId)) {
                    continue; // Already generated for this team
                }
                // Available helpers pool: Edelhelfer, Starke Helfer, Wassertraeger
                const helpers = teamRiders.filter(r => r.role_name === 'Edelhelfer' ||
                    r.role_name === 'Starke Helfer' ||
                    r.role_name === 'Wassertraeger');
                helpers.sort((a, b) => b.overall_rating - a.overall_rating || a.id - b.id);
                const assignedHelperIds = new Set();
                // 1. Process top 3 Captains
                const captains = teamRiders.filter(r => r.role_name === 'Kapitaen');
                captains.sort((a, b) => b.overall_rating - a.overall_rating || a.id - b.id);
                const top3Captains = captains.slice(0, 3);
                for (const captain of top3Captains) {
                    const specTarget = captain.specialization_1_id;
                    if (specTarget == null)
                        continue;
                    let lieutenant = null;
                    // Search steps:
                    // 1. Edelhelfer spec_1 === specTarget
                    lieutenant = helpers.find(r => r.role_name === 'Edelhelfer' && r.specialization_1_id === specTarget && !assignedHelperIds.has(r.id)) || null;
                    // 2. Edelhelfer spec_2 === specTarget
                    if (!lieutenant) {
                        lieutenant = helpers.find(r => r.role_name === 'Edelhelfer' && r.specialization_2_id === specTarget && !assignedHelperIds.has(r.id)) || null;
                    }
                    // 3. Starke Helfer spec_1 === specTarget
                    if (!lieutenant) {
                        lieutenant = helpers.find(r => r.role_name === 'Starke Helfer' && r.specialization_1_id === specTarget && !assignedHelperIds.has(r.id)) || null;
                    }
                    // 4. Starke Helfer spec_2 === specTarget
                    if (!lieutenant) {
                        lieutenant = helpers.find(r => r.role_name === 'Starke Helfer' && r.specialization_2_id === specTarget && !assignedHelperIds.has(r.id)) || null;
                    }
                    // 5. Wassertraeger spec_1 === specTarget
                    if (!lieutenant) {
                        lieutenant = helpers.find(r => r.role_name === 'Wassertraeger' && r.specialization_1_id === specTarget && !assignedHelperIds.has(r.id)) || null;
                    }
                    // 6. Wassertraeger spec_2 === specTarget
                    if (!lieutenant) {
                        lieutenant = helpers.find(r => r.role_name === 'Wassertraeger' && r.specialization_2_id === specTarget && !assignedHelperIds.has(r.id)) || null;
                    }
                    // 7. Union with spec_3 === specTarget
                    if (!lieutenant) {
                        lieutenant = helpers.find(r => r.specialization_3_id === specTarget && !assignedHelperIds.has(r.id)) || null;
                    }
                    if (lieutenant) {
                        assignedHelperIds.add(lieutenant.id);
                        insertLt.run(season, captain.id, lieutenant.id);
                        // Fetch the program of the captain
                        const capProg = this.db.prepare(`
              SELECT program_id FROM rider_season_programs WHERE season = ? AND rider_id = ?
            `).get(season, captain.id);
                        if (capProg) {
                            updateLtProgram.run(season, lieutenant.id, capProg.program_id, assignedDate);
                        }
                        // Populate all time peaks initial entry
                        insertPeakInitial.run(lieutenant.id, lieutenant.overall_rating, captain.id, season);
                    }
                }
                // 2. Process strongest Sprinter
                const sprinters = teamRiders.filter(r => r.role_name === 'Sprinter');
                sprinters.sort((a, b) => b.overall_rating - a.overall_rating || a.id - b.id);
                const strongestSprinter = sprinters[0] ?? null;
                if (strongestSprinter) {
                    const availableForSprint = helpers.filter(r => !assignedHelperIds.has(r.id));
                    if (availableForSprint.length > 0) {
                        availableForSprint.sort((a, b) => b.skill_sprint - a.skill_sprint || b.overall_rating - a.overall_rating || a.id - b.id);
                        const lieutenant = availableForSprint[0];
                        assignedHelperIds.add(lieutenant.id);
                        insertLt.run(season, strongestSprinter.id, lieutenant.id);
                        // Fetch the program of the sprinter
                        const sprinterProg = this.db.prepare(`
              SELECT program_id FROM rider_season_programs WHERE season = ? AND rider_id = ?
            `).get(season, strongestSprinter.id);
                        if (sprinterProg) {
                            updateLtProgram.run(season, lieutenant.id, sprinterProg.program_id, assignedDate);
                        }
                        // Populate all time peaks initial entry
                        insertPeakInitial.run(lieutenant.id, lieutenant.overall_rating, strongestSprinter.id, season);
                    }
                }
            }
        })();
    }
}
exports.RiderProgramService = RiderProgramService;
