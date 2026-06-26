const Database = require('better-sqlite3');
const path = require('path');

const dbPath = 'C:/Users/mkrinninger/.velo/savegames/a_1781271884931.db';
const db = new Database(dbPath);

console.log('--- LATEST STAGE RACES WITH DISPATCHED STATUS OR COMPLETED ---');
// Let's find races that have stages
const stageRaces = db.prepare(`
  SELECT r.id, r.name, r.is_stage_race, r.number_of_stages,
         (SELECT COUNT(*) FROM stages WHERE race_id = r.id) as actual_stages
  FROM races r
  WHERE r.is_stage_race = 1
`).all();

for (const race of stageRaces) {
  // Let's check stage_entries count
  const seCount = db.prepare('SELECT COUNT(*) as c FROM stage_entries WHERE race_id = ?').get(race.id).c;
  // Let's check stage_entries_history count
  const sehCount = db.prepare('SELECT COUNT(*) as c FROM stage_entries_history WHERE race_id = ?').get(race.id).c;
  
  if (seCount > 0 || sehCount > 0) {
    console.log(`Race ID: ${race.id}, Name: ${race.name}, Stages: ${race.number_of_stages}, stage_entries count: ${seCount}, stage_entries_history count: ${sehCount}`);
    
    // Let's print unique status and stage_number counts from stage_entries or stage_entries_history
    const table = seCount > 0 ? 'stage_entries' : 'stage_entries_history';
    const statusCounts = db.prepare(`
      SELECT s.stage_number, se.status, COUNT(*) as count
      FROM ${table} se
      JOIN stages s ON s.id = se.stage_id
      WHERE se.race_id = ?
      GROUP BY s.stage_number, se.status
      ORDER BY s.stage_number ASC
    `).all(race.id);
    console.log(`Status counts in ${table}:`, statusCounts);
  }
}

db.close();
