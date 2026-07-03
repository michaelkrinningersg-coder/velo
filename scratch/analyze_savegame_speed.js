const Database = require('better-sqlite3');
const path = require('path');

const dbPath = 'C:\\Users\\micha\\.velo\\savegames\\a_1782806075476.db';
const db = new Database(dbPath);

console.log('--- Analyzing savegame database row counts ---');
const tables = [
  'riders',
  'teams',
  'results',
  'stage_entries',
  'rider_daily_state',
  'rider_career_stats',
  'rider_season_stats',
  'rider_season_category_stats',
  'rider_career_category_stats',
  'stage_marker_results',
  'stage_leadouts'
];

for (const t of tables) {
  try {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${t}`).get().count;
    console.log(`Table '${t}': ${count} rows`);
  } catch (e) {
    console.log(`Table '${t}': Error/Not existing - ${e.message}`);
  }
}

console.log('\n--- Analyzing indexes ---');
const indexes = db.prepare("SELECT name, tbl_name FROM sqlite_master WHERE type='index'").all();
console.log(`Total indexes: ${indexes.length}`);
for (const idx of indexes.slice(0, 30)) {
  console.log(`Index '${idx.name}' on table '${idx.tbl_name}'`);
}

db.close();
