const fs = require('fs');
const path = require('path');
const Database = require('../backend/node_modules/better-sqlite3');

const source = 'C:/Users/mkrinninger/.velo/savegames/test_career_1781271978877.db';
const dest = 'C:/Users/mkrinninger/.velo/savegames/draft-test-december.db';

try {
  if (!fs.existsSync(source)) {
    console.error(`Source file ${source} does not exist.`);
    process.exit(1);
  }

  fs.copyFileSync(source, dest);
  const db = new Database(dest);

  // Helper to check column existence
  const columns = db.prepare("PRAGMA table_info(game_state)").all();
  const columnNames = columns.map(c => c.name);

  // Alter game_state table to add new columns if they do not exist
  if (!columnNames.includes('draft_status')) {
    console.log("Adding draft_status column...");
    db.prepare("ALTER TABLE game_state ADD COLUMN draft_status TEXT NOT NULL DEFAULT 'completed'").run();
  }
  if (!columnNames.includes('draft_current_pick_number')) {
    console.log("Adding draft_current_pick_number column...");
    db.prepare("ALTER TABLE game_state ADD COLUMN draft_current_pick_number INTEGER NOT NULL DEFAULT 1").run();
  }
  if (!columnNames.includes('draft_season')) {
    console.log("Adding draft_season column...");
    db.prepare("ALTER TABLE game_state ADD COLUMN draft_season INTEGER DEFAULT NULL").run();
  }

  // Update career metadata
  db.prepare("INSERT OR REPLACE INTO career_meta (key, value) VALUES ('career_name', 'Draft Test December')").run();
  
  // Set date to December 1st, 2026, so they can advance calendar and trigger the draft
  db.prepare("UPDATE game_state SET current_date = '2026-12-01', season = 2026, draft_status = 'completed', draft_current_pick_number = 1, draft_season = NULL WHERE id = 1").run();
  
  console.log("Savegame created successfully!");
  console.log("Game state:", db.prepare("SELECT * FROM game_state").get());
  console.log("Career Meta:", db.prepare("SELECT * FROM career_meta").all());
  
  db.close();
} catch (e) {
  console.error("Failed to create savegame:", e);
}
