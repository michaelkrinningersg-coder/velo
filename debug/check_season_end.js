const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const savegamesDir = path.join('C:', 'Users', 'micha', '.velo', 'savegames');
const file = 'a_1781957994019.db'; // let's check this database (the largest one)
const dbPath = path.join(savegamesDir, file);

try {
  const db = new Database(dbPath, { readonly: true });
  const gameState = db.prepare('SELECT current_date, season FROM game_state WHERE id = 1').get();
  console.log(`Current state: date=${gameState.current_date}, season=${gameState.season}`);

  const maxStageDate = db.prepare('SELECT MAX(date) AS max_date FROM stages').get();
  console.log(`Max stage date in DB: ${maxStageDate.max_date}`);

  const nextStages = db.prepare('SELECT id, date, race_id FROM stages WHERE date >= ? ORDER BY date ASC LIMIT 10').all(gameState.current_date);
  console.log(`Next stages starting from current date:`);
  for (const s of nextStages) {
    const race = db.prepare('SELECT name FROM races WHERE id = ?').get(s.race_id);
    console.log(`  Stage ID: ${s.id}, Date: ${s.date}, Race: ${race ? race.name : 'Unknown'}`);
  }

  const finishedCount = db.prepare("SELECT COUNT(*) AS c FROM stage_entries WHERE status = 'finished'").get();
  const scheduledCount = db.prepare("SELECT COUNT(*) AS c FROM stage_entries WHERE status = 'scheduled'").get();
  console.log(`Stage entries: finished=${finishedCount.c}, scheduled=${scheduledCount.c}`);

  db.close();
} catch (err) {
  console.error(err);
}
