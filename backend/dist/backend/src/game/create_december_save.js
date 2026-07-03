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
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseService_1 = require("../db/DatabaseService");
const fs = __importStar(require("fs"));
function run() {
    const source = 'C:/Users/mkrinninger/.velo/savegames/test_career_1781271978877.db';
    const dest = 'C:/Users/mkrinninger/.velo/savegames/draft-test-december.db';
    if (!fs.existsSync(source)) {
        console.error("Source file does not exist.");
        process.exit(1);
    }
    // Copy the source file to dest
    fs.copyFileSync(source, dest);
    // Drop legacy tables before initializing so they are recreated cleanly with standard schemas
    const Database = require('better-sqlite3');
    const legacyDb = new Database(dest);
    legacyDb.pragma('foreign_keys = OFF');
    legacyDb.exec(`
    DROP TABLE IF EXISTS rider_season_programs;
    DROP TABLE IF EXISTS race_programs;
    DROP TABLE IF EXISTS race_program_races;
    DROP TABLE IF EXISTS race_program_probability_rules;
  `);
    legacyDb.close();
    // Load the savegame using DatabaseService to run all migrations automatically
    const dbService = new DatabaseService_1.DatabaseService();
    const db = dbService.loadSave('draft-test-december.db');
    // Update career metadata
    db.prepare("INSERT OR REPLACE INTO career_meta (key, value) VALUES ('career_name', 'Draft Test December')").run();
    // Set date to December 1st, 2026, so they can advance calendar and trigger the draft
    db.prepare(`
    UPDATE game_state
    SET current_date = '2026-12-01',
        season = 2026,
        draft_status = 'completed',
        draft_current_pick_number = 1,
        draft_season = NULL
    WHERE id = 1
  `).run();
    console.log("Savegame draft-test-december.db successfully loaded, migrated and updated!");
    console.log("Game state:", db.prepare("SELECT * FROM game_state").get());
    dbService.closeActive();
}
try {
    run();
    process.exit(0);
}
catch (e) {
    console.error("Failed:", e);
    process.exit(1);
}
