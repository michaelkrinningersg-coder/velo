const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'backend', 'assets', 'world_data.db');
if (!fs.existsSync(dbPath)) {
  console.log('world_data.db not found.');
  process.exit(1);
}

const db = new Database(dbPath);

const teams = db.prepare(`
  SELECT id, name, division_id, is_player_team FROM teams ORDER BY id ASC
`).all();

console.log('Teams count in world_data.db:', teams.length);
console.log('First 30 teams:');
console.log(teams.slice(0, 30));

db.close();
