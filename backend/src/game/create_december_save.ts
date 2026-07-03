import { DatabaseService } from '../db/DatabaseService';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

function run() {
  // Try to resolve the savegames directory within the repository workspace
  let savegamesDir = path.join(os.homedir(), '.velo', 'savegames');
  let current = __dirname;
  while (true) {
    if (fs.existsSync(path.join(current, 'backend')) && fs.existsSync(path.join(current, 'frontend'))) {
      const repoSaveDir = path.join(current, 'savegames');
      if (fs.existsSync(repoSaveDir)) {
        savegamesDir = repoSaveDir;
      }
      break;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  const source = path.join(savegamesDir, 'test_career_1781271978877.db');
  const dest = path.join(savegamesDir, 'draft-test-december.db');

  if (!fs.existsSync(source)) {
    console.error(`Source file does not exist at: ${source}`);
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
  const dbService = new DatabaseService();
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
} catch (e) {
  console.error("Failed:", e);
  process.exit(1);
}
