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

const totalResults = db.prepare('SELECT count(*) as c FROM results').get().c;
const totalHistory = db.prepare('SELECT count(*) as c FROM results_history').get().c;

console.log(`Total rows in results table: ${totalResults}`);
console.log(`Total rows in results_history table: ${totalHistory}`);

if (totalResults > 0) {
  const distinctRaces = db.prepare('SELECT DISTINCT race_id FROM results').all();
  console.log('Races with results:', distinctRaces);
}

if (totalHistory > 0) {
  const distinctHistoryRaces = db.prepare('SELECT DISTINCT race_id FROM results_history LIMIT 10').all();
  console.log('Some races in results_history:', distinctHistoryRaces);
}

db.close();
