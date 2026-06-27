const fs = require('fs');
const path = require('path');
const os = require('os');
const Database = require('better-sqlite3');

const savegamesDir = path.join(os.homedir(), '.velo', 'savegames');
const dbFiles = fs.readdirSync(savegamesDir).filter(f => f.endsWith('.db') || f.endsWith('.velo'));

dbFiles.forEach(dbFile => {
  const dbPath = path.join(savegamesDir, dbFile);
  const db = new Database(dbPath);
  
  try {
    const tableExists = (name) => {
      return !!db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(name);
    };

    if (!tableExists('game_state')) {
      db.close();
      return;
    }

    const state = db.prepare('SELECT "current_date" AS cur_date, season FROM game_state WHERE id = 1').get();
    console.log(`Save file: ${dbFile} | actual in-game current_date = ${state?.cur_date} | season = ${state?.season}`);

  } catch (err) {
    console.error(`Error in ${dbFile}:`, err.message);
  }
  db.close();
});
