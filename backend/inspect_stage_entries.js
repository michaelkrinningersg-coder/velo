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

    if (!tableExists('stages')) {
      db.close();
      return;
    }

    const stageRaces = db.prepare(`SELECT id, name FROM races WHERE is_stage_race = 1`).all();
    for (const race of stageRaces) {
      const histCount = db.prepare(`SELECT count(*) as c FROM stage_entries_history WHERE race_id = ?`).get(race.id).c;
      const actCount = db.prepare(`SELECT count(*) as c FROM stage_entries WHERE race_id = ?`).get(race.id).c;
      if (histCount === 0 && actCount === 0) continue;

      const nonFinishedInHistory = db.prepare(`
        SELECT status, count(*) as c 
        FROM stage_entries_history 
        WHERE race_id = ? AND status IN ('scheduled', 'started')
        GROUP BY status
      `).all(race.id);
      
      const nonFinishedInActive = db.prepare(`
        SELECT status, count(*) as c 
        FROM stage_entries 
        WHERE race_id = ? AND status IN ('scheduled', 'started')
        GROUP BY status
      `).all(race.id);

      if (nonFinishedInHistory.length > 0) {
        console.log(`\nFound non-finished entries in HISTORY for ${dbFile} | Race ID ${race.id} (${race.name}):`, nonFinishedInHistory);
      }
      
      if (nonFinishedInActive.length > 0) {
        // Only report if this race has some finished stages
        const finishedStagesCount = db.prepare(`
          SELECT count(distinct stage_id) as c 
          FROM stage_entries 
          WHERE race_id = ? AND status = 'finished'
        `).get(race.id).c;
        
        if (finishedStagesCount > 0) {
          console.log(`\nFound non-finished entries in ACTIVE stage_entries for ${dbFile} | Race ID ${race.id} (${race.name}) | Finished stages: ${finishedStagesCount}:`, nonFinishedInActive);
        }
      }
    }

  } catch (err) {
    console.error(`Error in ${dbFile}:`, err.message);
  }
  db.close();
});
