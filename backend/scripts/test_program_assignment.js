const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Create a copy of world_data.db for testing
const masterDbPath = path.resolve(__dirname, '..', 'assets', 'world_data.db');
const testDbPath = path.resolve(__dirname, '..', 'assets', 'test_assignment.db');

if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}
fs.copyFileSync(masterDbPath, testDbPath);

console.log('Copied world_data.db to test_assignment.db');

// Run ts-node to execute the assignment
const db = new Database(testDbPath);

// Create the tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS rider_season_programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    season INTEGER NOT NULL,
    rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
    program_id INTEGER NOT NULL REFERENCES race_programs(id),
    assigned_on TEXT NOT NULL,
    UNIQUE(season, rider_id)
  );
  CREATE INDEX IF NOT EXISTS idx_rider_season_programs_program ON rider_season_programs(season, program_id);
`);

// Load the compiled JS or use TS implementation
// Since we have ts-node registered in project, but here we can just write JavaScript implementation of the assignment directly on the sqlite DB or run it using ts-node.
// Wait, we can compile the project and run it!
// Let's build the project using tsc first to generate the dist directory, then run our test JS script using that!
// This is extremely robust and verifies the compiled files work as expected.
db.close();
