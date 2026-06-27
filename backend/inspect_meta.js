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

    if (!tableExists('career_meta')) {
      db.close();
      return;
    }

    const meta = db.prepare('SELECT key, value FROM career_meta').all();
    console.log(`Save file: ${dbFile} Metadata:`, meta);

  } catch (err) {
    console.error(`Error in ${dbFile}:`, err.message);
  }
  db.close();
});
