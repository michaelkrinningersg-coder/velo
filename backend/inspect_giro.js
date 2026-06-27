const fs = require('fs');
const path = require('path');
const os = require('os');
const Database = require('better-sqlite3');

const savePath = path.join(os.homedir(), '.velo', 'savegames', 'a_1782124275996.db');
if (!fs.existsSync(savePath)) {
  console.log('Save file not found.');
  process.exit(1);
}

const db = new Database(savePath);

const raceId = 23; // Giro di Italia in a_1782124275996.db
const stages = db.prepare(`SELECT id, stage_number FROM stages WHERE race_id = ? ORDER BY stage_number ASC`).all(raceId);
console.log(`Giro di Italia (Race ID: ${raceId}) total stages: ${stages.length}`);

stages.forEach(stage => {
  const finishedEntriesCount = db.prepare(`
    SELECT count(*) as c FROM stage_entries WHERE stage_id = ? AND status = 'finished'
  `).get(stage.id).c;
  
  const resultsCount = db.prepare(`
    SELECT count(*) as c FROM results WHERE stage_id = ?
  `).get(stage.id).c;

  console.log(`Stage ${stage.stage_number} (ID ${stage.id}): finished_entries in stage_entries = ${finishedEntriesCount}, results count = ${resultsCount}`);
});

db.close();
