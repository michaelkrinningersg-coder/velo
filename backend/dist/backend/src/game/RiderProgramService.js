"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderProgramService = void 0;
exports.normalizeComboKey = normalizeComboKey;
exports.getVariantIndexForRider = getVariantIndexForRider;
const SPECIALIZATION_IDS = [1, 2, 3, 4, 5, 6, 7];
const ROLE_FALLBACK = 'Wassertraeger';
const BASE_PROGRAMS = [
    'Non_Cobble_Tour',
    'Cobble_Giro_Tour',
    'Cobble_Giro_Vuelta',
    'Vuelta_Tour',
    'Cobble_Tour',
    'Non_Cobble Giro_Tour',
    'Sprinter Non_Cobble_Giro_Vuelta',
    'Classic_Cobble_No Grand Tour',
    'Classic_Non_Cobble_No Grand Tour_one day focus',
    'Classic_Non_Cobble_No Grand Tour_stage race foxus'
];
function tableExists(db, tableName) {
    const row = db.prepare("SELECT name FROM sqlite_master WHERE type IN ('table', 'view') AND name = ?").get(tableName);
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
function normalizeComboKey(comboKey) {
    const map = {
        // Berg (B)
        'BFH': 'BHF',
        'BTH': 'BHT',
        'BHA': 'BHP',
        'BFP': 'BHP',
        // Sprint (S)
        'STF': 'SFT',
        'SAF': 'SFA',
        'STA': 'SAT',
        'SHF': 'SFT',
        // Cobble (P)
        'PTF': 'PFT',
        'PTA': 'PAT',
        'PAF': 'PFA',
        'PHF': 'PFH',
        'PHS': 'PFT',
        'PSF': 'PFT',
        'PSG': 'PFT',
        'PSH': 'SPH',
        // Hill (H)
        'HAB': 'HBA',
        'HTF': 'HFT',
        'HSP': 'HSF',
        'HTB': 'HSB',
        'HPS': 'HPF',
        // Time Trial (T)
        'TAF': 'TFA',
        'TBH': 'TBF',
        'THF': 'TFH',
        'TFP': 'TPF',
        'TPH': 'TPF',
        'TFS': 'TFH',
        'TSF': 'TFH',
        // Flat (F)
        'FTA': 'FAT',
        'FSP': 'FPS',
        'FHP': 'FPS',
        'FTP': 'FPS',
        'FST': 'FTS',
        'FSH': 'FTS',
        'FHS': 'FTS'
    };
    return map[comboKey] ?? comboKey;
}
function getVariantIndexForRider(i, N) {
    if (N < 4) {
        return 1;
    }
    if (N < 10) {
        return (i % 2) + 1;
    }
    const half = Math.ceil(N / 2);
    if (i < half) {
        return (i % 2) + 1;
    }
    return ((i - half) % 2) + 3;
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
        // Load all active riders for the season to determine global rankings
        const allActiveRiders = this.db.prepare(`
      SELECT riders.id,
             role.name AS role_name,
             riders.overall_rating,
             riders.skill_cobble,
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
        if (allActiveRiders.length === 0) {
            return;
        }
        // Determine top 10 overall riders globally
        const sortedByOverall = [...allActiveRiders].sort((a, b) => b.overall_rating - a.overall_rating || a.id - b.id);
        const top10OverallIds = new Set(sortedByOverall.slice(0, 10).map(r => r.id));
        // Determine top sprinters globally
        const sprinters = allActiveRiders
            .filter(r => normalizeRoleName(r.role_name) === 'Sprinter')
            .sort((a, b) => b.overall_rating - a.overall_rating || a.id - b.id);
        const top5SprintersIds = new Set(sprinters.slice(0, 5).map(r => r.id));
        const sprinters6to15Ids = new Set(sprinters.slice(5, 15).map(r => r.id));
        // Check which riders actually need assignment
        const missingRiders = this.db.prepare(`
      SELECT riders.id,
             role.name AS role_name,
             riders.overall_rating,
             riders.skill_cobble,
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
        AND NOT EXISTS (
          SELECT 1
          FROM rider_season_programs existing_program
          WHERE existing_program.season = ?
            AND existing_program.rider_id = riders.id
        )
    `).all(season, season, season);
        if (missingRiders.length === 0) {
            return;
        }
        const allPrograms = this.db.prepare('SELECT id, name FROM race_programs').all();
        const programsById = new Map(allPrograms.map(p => [p.id, p.name]));
        const programIdByName = new Map(allPrograms.map(p => [p.name, p.id]));
        // Map variant program_id to its base program name
        const getBaseProgramName = (progId) => {
            const name = programsById.get(progId) || '';
            return name.replace(/_\d+$/, '');
        };
        // Load probability rules
        const dbRules = this.db.prepare(`
      SELECT role_name, program_id, probability
      FROM race_program_probability_rules
    `).all();
        const rulesByRole = new Map();
        for (const rule of dbRules) {
            const role = rule.role_name;
            const baseProgram = getBaseProgramName(rule.program_id);
            if (!rulesByRole.has(role)) {
                rulesByRole.set(role, []);
            }
            rulesByRole.get(role).push({ baseProgram, probability: rule.probability });
        }
        // Exclusions helper
        const isProgramExcluded = (baseProgram, role, skillCobble) => {
            const isCaptainOrCo = role === 'Kapitaen' || role === 'Co-Kapitaen';
            // Classic programs exclude Captains and Co-Captains
            if (baseProgram.startsWith('Classic_') && isCaptainOrCo) {
                return true;
            }
            const isCobbleProgram = baseProgram.includes('Cobble') && !baseProgram.includes('Non_Cobble');
            if (isCobbleProgram) {
                const isWassertraegerOrStarker = role === 'Wassertraeger' || role === 'Starke Helfer';
                if (isWassertraegerOrStarker) {
                    return skillCobble <= 65; // >65 Pflaster
                }
                else {
                    return skillCobble <= 70; // >70 Pflaster
                }
            }
            else {
                if (isCaptainOrCo) {
                    return skillCobble > 72; // kein Pflaster >72
                }
                else {
                    return skillCobble > 70; // kein Pflaster >70
                }
            }
        };
        const TDF_PROGRAMS = ['Non_Cobble_Tour', 'Cobble_Giro_Tour', 'Vuelta_Tour', 'Cobble_Tour', 'Non_Cobble Giro_Tour'];
        const GT_PROGRAMS = [...TDF_PROGRAMS, 'Cobble_Giro_Vuelta', 'Sprinter Non_Cobble_Giro_Vuelta'];
        // Map each missing rider to their chosen base program
        const assignedRiders = [];
        for (const rider of missingRiders) {
            const role = normalizeRoleName(rider.role_name);
            // Get probability rules for role (fallback to Wassertraeger if not defined)
            let rRules = rulesByRole.get(role) || rulesByRole.get('Wassertraeger') || [];
            if (rRules.length === 0) {
                // Uniform fallback over all programs
                rRules = BASE_PROGRAMS.map(base => ({ baseProgram: base, probability: 10 }));
            }
            // Filter and evaluate candidate probabilities
            let candidates = rRules.map(r => ({
                baseProgram: r.baseProgram,
                probability: isProgramExcluded(r.baseProgram, role, rider.skill_cobble) ? 0 : r.probability
            }));
            // Top-Fahrer locks
            if (top10OverallIds.has(rider.id) || top5SprintersIds.has(rider.id)) {
                candidates = candidates.map(c => ({
                    baseProgram: c.baseProgram,
                    probability: TDF_PROGRAMS.includes(c.baseProgram) ? c.probability : 0
                }));
            }
            else if (sprinters6to15Ids.has(rider.id)) {
                candidates = candidates.map(c => ({
                    baseProgram: c.baseProgram,
                    probability: GT_PROGRAMS.includes(c.baseProgram) ? c.probability : 0
                }));
            }
            // Filter candidates with non-zero probability
            let activeCandidates = candidates.filter(c => c.probability > 0);
            let selectedBase = '';
            if (activeCandidates.length === 0) {
                // Fallback: find any program that doesn't exclude this rider, ignoring probability rules
                const fallbackCandidates = BASE_PROGRAMS.filter(base => !isProgramExcluded(base, role, rider.skill_cobble));
                if (fallbackCandidates.length > 0) {
                    // If top overall/sprinter, restrict fallback to TDF if possible, otherwise GT
                    let filteredFallbacks = fallbackCandidates;
                    if (top10OverallIds.has(rider.id) || top5SprintersIds.has(rider.id)) {
                        filteredFallbacks = fallbackCandidates.filter(base => TDF_PROGRAMS.includes(base));
                    }
                    else if (sprinters6to15Ids.has(rider.id)) {
                        filteredFallbacks = fallbackCandidates.filter(base => GT_PROGRAMS.includes(base));
                    }
                    const finalFallbacks = filteredFallbacks.length > 0 ? filteredFallbacks : fallbackCandidates;
                    const riderSeed = `rider-fallback-${rider.id}-${season}`;
                    const randIndex = Math.floor(deterministicUnit(riderSeed) * finalFallbacks.length);
                    selectedBase = finalFallbacks[randIndex];
                }
                else {
                    // Absolute fallback
                    selectedBase = 'Non_Cobble_Tour';
                }
            }
            else {
                const riderSeed = `rider-program-${rider.id}-${season}`;
                const rand = deterministicUnit(riderSeed);
                const sum = activeCandidates.reduce((acc, c) => acc + c.probability, 0);
                const val = rand * sum;
                let acc = 0;
                selectedBase = activeCandidates[0].baseProgram;
                for (const cand of activeCandidates) {
                    acc += cand.probability;
                    if (val <= acc) {
                        selectedBase = cand.baseProgram;
                        break;
                    }
                }
            }
            assignedRiders.push({
                riderId: rider.id,
                teamId: rider.team_id,
                baseProgram: selectedBase,
                roleName: role,
                overall: rider.overall_rating
            });
        }
        // Group assigned riders by (teamId, baseProgram)
        const groups = new Map();
        for (const r of assignedRiders) {
            const key = `${r.teamId}:${r.baseProgram}`;
            if (!groups.has(key)) {
                groups.set(key, []);
            }
            groups.get(key).push(r);
        }
        const insert = this.db.prepare(`
      INSERT OR IGNORE INTO rider_season_programs (season, rider_id, program_id, assigned_on)
      VALUES (?, ?, ?, ?)
    `);
        this.db.transaction(() => {
            for (const [key, groupRiders] of groups.entries()) {
                const [teamIdStr, baseProgram] = key.split(':');
                const leaders = groupRiders.filter(r => r.roleName === 'Kapitaen' || r.roleName === 'Co-Kapitaen' || r.roleName === 'Sprinter');
                const helpers = groupRiders.filter(r => r.roleName !== 'Kapitaen' && r.roleName !== 'Co-Kapitaen' && r.roleName !== 'Sprinter');
                // Sort and assign leaders to Variant 1 or 2 alternatingly
                leaders.sort((a, b) => b.overall - a.overall || a.riderId - b.riderId);
                for (let i = 0; i < leaders.length; i++) {
                    const rider = leaders[i];
                    const variant = (i % 2) + 1;
                    const progName = `${baseProgram}_${variant}`;
                    const programId = programIdByName.get(progName);
                    if (programId != null) {
                        insert.run(season, rider.riderId, programId, assignedDate);
                    }
                }
                // Sort and assign helpers (50% to Variant 1/2 alternatingly, 50% to Variant 3)
                helpers.sort((a, b) => b.overall - a.overall || a.riderId - b.riderId);
                const topCount = Math.ceil(helpers.length / 2);
                for (let i = 0; i < helpers.length; i++) {
                    const rider = helpers[i];
                    let variant = 3;
                    if (i < topCount) {
                        variant = (i % 2) + 1;
                    }
                    const progName = `${baseProgram}_${variant}`;
                    const programId = programIdByName.get(progName);
                    if (programId != null) {
                        insert.run(season, rider.riderId, programId, assignedDate);
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
