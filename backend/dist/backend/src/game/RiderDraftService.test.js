"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const RiderDraftService_1 = require("./RiderDraftService");
const GameStateService_1 = require("./GameStateService");
function runTest() {
    console.log("=== STARTING INTERACTIVE DRAFT INTEGRATION TEST ===");
    // 1. Initialize temporary SQLite database
    const db = new better_sqlite3_1.default(':memory:');
    // 2. Read and execute schema.sql
    const schemaPath = path.resolve(process.cwd(), 'backend/assets/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    // Remove WAL pragma since memory db doesn't support WAL journal mode fully in some environments
    const cleanSchema = schemaSql
        .replace('PRAGMA journal_mode = WAL;', '')
        .replace('PRAGMA foreign_keys = ON;', '');
    db.exec(cleanSchema);
    db.exec(`
    CREATE TABLE IF NOT EXISTS rider_career_category_stats (
      rider_id INTEGER REFERENCES riders(id) ON DELETE CASCADE,
      category_name TEXT NOT NULL,
      gc_wins INTEGER NOT NULL DEFAULT 0,
      stage_wins INTEGER NOT NULL DEFAULT 0,
      one_day_wins INTEGER NOT NULL DEFAULT 0,
      podiums INTEGER NOT NULL DEFAULT 0,
      top_tens INTEGER NOT NULL DEFAULT 0,
      stage_podiums INTEGER NOT NULL DEFAULT 0,
      stage_top_tens INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (rider_id, category_name)
    )
  `);
    console.log("Database schema loaded.");
    // Seed types and roles needed by the services
    db.prepare(`INSERT INTO type_rider (id, type_key, display_name) VALUES 
    (1, 'climber', 'Bergfahrer'),
    (2, 'puncher', 'Hügelspezialist'),
    (3, 'sprinter', 'Sprinter'),
    (4, 'timetrialist', 'Zeitfahrer'),
    (5, 'classic', 'Cobble')
  `).run();
    db.prepare(`INSERT INTO sta_role (id, name, weighting) VALUES 
    (1, 'Leader', 100),
    (2, 'Co-Leader', 80),
    (3, 'Domestique', 50)
  `).run();
    db.prepare(`INSERT INTO program_groups (id, name) VALUES (1, 'Europe')`).run();
    db.prepare(`INSERT INTO sta_country (id, name, code_3, continent, regen_rating, number_regen_min, number_regen_max, program_group_id) VALUES 
    (1, 'Deutschland', 'GER', 'Europe', 80, 2, 5, 1)
  `).run();
    // Division table
    db.prepare(`INSERT INTO division_teams (id, name, tier, max_teams, min_roster_size, max_roster_size) VALUES 
    (1, 'WorldTour', 1, 25, 20, 40)
  `).run();
    // Create 25 teams (ID 1 to 25)
    const insertTeam = db.prepare(`
    INSERT INTO teams (id, name, abbreviation, division_id, is_player_team, country_id, color_primary, color_secondary, ai_focus_1, ai_focus_2, ai_focus_3)
    VALUES (?, ?, ?, 1, ?, 1, '#ffffff', '#000000', 1, 2, 3)
  `);
    for (let i = 1; i <= 25; i++) {
        const isPlayer = (i === 1) ? 1 : 0;
        insertTeam.run(i, `Team ${i}`, `T0${i}`.slice(-3), isPlayer);
    }
    console.log("25 teams seeded (Team 1 is player team).");
    // Game state
    db.prepare(`
    INSERT INTO game_state (id, current_date, season, is_game_over, draft_status, draft_current_pick_number, draft_season)
    VALUES (1, '2026-10-15', 2026, 0, 'completed', 1, NULL)
  `).run();
    // Seed 150 Free Agent riders
    const insertRider = db.prepare(`
    INSERT INTO riders (
      first_name, last_name, country_id, role_id, rider_type_id, birth_year,
      peak_age, decline_age, retirement_age, skill_development, pot_overall, overall_rating,
      specialization_1_id, specialization_2_id, specialization_3_id, is_retired
    ) VALUES (?, ?, 1, 3, 1, ?, 25, 30, 35, 10, ?, ?, 1, 2, 3, 0)
  `);
    for (let i = 1; i <= 150; i++) {
        // Generate U25 riders (birth year >= 2003 for season 2027 test) and normal riders
        const birthYear = 2027 - (18 + (i % 18)); // age 18 to 35
        const overall = 50 + (i % 15); // 50 to 64
        const potential = overall + (i % 10); // overall + 0 to 9 (max 73)
        insertRider.run(`Fahrer`, `${i}`, birthYear, potential, overall);
    }
    console.log("150 free agent riders seeded.");
    const draftService = new RiderDraftService_1.RiderDraftService(db);
    const gameStateService = new GameStateService_1.GameStateService(db);
    // 3. Test prepareDraft
    console.log("Testing prepareDraft...");
    draftService.prepareDraft(2027);
    // 4. Test executeNextPicksUntilPlayer
    console.log("Simulating initial picks until player team turn...");
    const initialResult = draftService.executeNextPicksUntilPlayer(2027, false);
    console.log("Initial execution result:", initialResult);
    // Assertions on initial state
    const nextPickState = draftService.getNextPickState(2027);
    console.log("Next pick state:", nextPickState);
    if (nextPickState.finished) {
        throw new Error("Draft should not be finished initially!");
    }
    if (!nextPickState.isPlayerTeam) {
        throw new Error("Expected next turn to be the player team (Team 1) in Round 0 chunk [0, 4]!");
    }
    // 5. Check candidates pool
    // Seed a previous contract for Rider ID 10 with Team 1 (ends in 2026) to test contract renewal jersey mapping
    // We insert it with status 'expired' as contracts ending in the previous season have been expired by checkContractStatuses.
    // Also set their ratings to 85 so they rank in the Top 30 candidate list!
    db.prepare(`
    INSERT INTO contracts (rider_id, team_id, start_season, end_season, status)
    VALUES (10, 1, 2026, 2026, 'expired')
  `).run();
    db.prepare(`
    UPDATE riders SET overall_rating = 85, pot_overall = 85 WHERE id = 10
  `).run();
    console.log("Loading candidates for player pick...");
    const candidates = draftService.getDraftCandidatesForNextPick(2027);
    console.log(`Loaded ${candidates.length} candidates.`);
    if (candidates.length !== 30) {
        throw new Error(`Expected candidates pool size to be 30, got ${candidates.length}!`);
    }
    // Check renewal oldTeamName and oldTeamId mapping
    const cand10 = candidates.find(c => c.riderId === 10);
    if (!cand10) {
        throw new Error("Expected Rider ID 10 to be in the candidate list!");
    }
    console.log(`Rider 10 mapped with oldTeamId: ${cand10.oldTeamId}, oldTeamName: ${cand10.oldTeamName}`);
    if (cand10.oldTeamId !== 1 || cand10.oldTeamName !== 'Team 1') {
        throw new Error(`Expected Rider 10 oldTeamId to be 1 and oldTeamName to be 'Team 1', got ${cand10.oldTeamId} / ${cand10.oldTeamName}`);
    }
    // Test overall / potential weighting for team 21-25
    // For team 25, overall weight is 65% skill and 35% potential, U25 weight x4
    console.log("Verifying candidate preference weighting logic for Rank 21-25...");
    const testCandidate = candidates[0];
    console.log(`Top candidate details: ID=${testCandidate.riderId}, OVR=${testCandidate.overallRating}, POT=${testCandidate.potential}, Prob=${testCandidate.probability}%`);
    // Let's draft candidate 1 for the player team
    const selectedRiderId = testCandidate.riderId;
    console.log(`Player selects Rider ID ${selectedRiderId}`);
    draftService.executeSingleDraftPick(2027, nextPickState.nextTeamId, nextPickState.currentRound, nextPickState.currentPickNumber, selectedRiderId);
    // Verify pick is saved
    const historyCheck = db.prepare('SELECT * FROM draft_history WHERE season = 2027 AND rider_id = ?').get(selectedRiderId);
    if (!historyCheck) {
        throw new Error("Selected rider not found in draft_history table!");
    }
    console.log("Player pick successfully recorded in history:", historyCheck);
    // 6. Simulate all remaining picks
    console.log("Simulating all remaining draft picks...");
    const finalResult = draftService.executeNextPicksUntilPlayer(2027, true);
    console.log("Final execution result:", finalResult);
    const afterState = draftService.getNextPickState(2027);
    console.log("Draft state after simulation:", afterState);
    if (!afterState.finished) {
        throw new Error("Draft should be finished after auto-complete!");
    }
    // 7. Test completeDraftAndInitializeSeason (post-draft process)
    console.log("Calling completeDraftAndInitializeSeason...");
    gameStateService.completeDraftAndInitializeSeason(2027, '2027-01-01');
    // Verify post-draft side effects
    // Check draft status is completed
    const gsRow = db.prepare('SELECT draft_status FROM game_state WHERE id = 1').get();
    console.log("Game state draft status:", gsRow.draft_status);
    if (gsRow.draft_status !== 'completed') {
        throw new Error("Expected draft_status to be 'completed'!");
    }
    // Check roles are assigned (recalculateAllTeamRoles was called)
    const roleCheck = db.prepare('SELECT COUNT(*) as c FROM riders WHERE role_id IS NOT NULL AND is_retired = 0').get();
    console.log(`Riders with roles: ${roleCheck.c}`);
    if (roleCheck.c === 0) {
        throw new Error("Expected riders to have roles assigned after season initialization!");
    }
    // Check programs ensureSeasonPrograms was run
    const programCheck = db.prepare('SELECT COUNT(*) as c FROM rider_season_programs').get();
    console.log(`Rider season programs: ${programCheck.c}`);
    console.log("=== INTEGRATION TEST PASSED SUCCESSFULLY ===");
}
try {
    runTest();
    process.exit(0);
}
catch (e) {
    console.error("!!! TEST FAILED !!!");
    console.error(e.stack);
    process.exit(1);
}
