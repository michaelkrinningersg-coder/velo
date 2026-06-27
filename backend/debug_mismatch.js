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

    const stageRaces = db.prepare(`SELECT id, name, number_of_stages FROM races WHERE is_stage_race = 1`).all();
    for (const race of stageRaces) {
      const histCount = db.prepare(`SELECT count(*) as c FROM stage_entries_history WHERE race_id = ?`).get(race.id).c;
      if (histCount === 0) continue; // Not completed or no entries
      
      const stages = db.prepare(`SELECT id, stage_number FROM stages WHERE race_id = ? ORDER BY stage_number ASC`).all(race.id);
      const lastStage = stages[stages.length - 1];
      if (!lastStage) continue;
      
      // Get riders in GC rows
      const gcRiderIds = db.prepare(`
        SELECT rider_id FROM results WHERE stage_id = ? AND result_type_id = 2
      `).all(lastStage.id).map(r => r.rider_id);
      
      // Get riders from getFullyClassifiedStageRaceRiderIds query
      const tableName = 'all_stage_entries';
      const expectedStageCount = stages.length;

      const fullyClassifiedRiders = db.prepare(`
        SELECT ${tableName}.rider_id AS rider_id,
               COUNT(*) as cnt,
               SUM(CASE WHEN ${tableName}.status = 'finished' THEN 1 ELSE 0 END) as finished_cnt,
               SUM(CASE WHEN ${tableName}.status IN ('dns', 'dnf') THEN 1 ELSE 0 END) as dnf_dns_cnt
        FROM ${tableName}
        JOIN stages ON stages.id = ${tableName}.stage_id
        WHERE ${tableName}.race_id = ?
          AND stages.stage_number <= ?
        GROUP BY ${tableName}.rider_id
      `).all(race.id, expectedStageCount);

      const fullyClassifiedIds = fullyClassifiedRiders.filter(row => 
        row.cnt === expectedStageCount &&
        row.finished_cnt === expectedStageCount &&
        row.dnf_dns_cnt === 0
      ).map(row => row.rider_id);

      if (gcRiderIds.length !== fullyClassifiedIds.length) {
        console.log(`\nMISMATCH FOUND in ${dbFile} for Race ID ${race.id} (${race.name}):`);
        console.log(`  Expected Stages: ${expectedStageCount}`);
        console.log(`  GC rows in results: ${gcRiderIds.length}`);
        console.log(`  Query fully classified count: ${fullyClassifiedIds.length}`);
        
        const inGcButNotQuery = gcRiderIds.filter(id => !fullyClassifiedIds.includes(id));
        const inQueryButNotGc = fullyClassifiedIds.filter(id => !gcRiderIds.includes(id));
        console.log(`  In GC but not in Query:`, inGcButNotQuery.length, inGcButNotQuery);
        console.log(`  In Query but not in GC:`, inQueryButNotGc.length, inQueryButNotGc);
      } else if (gcRiderIds.length === 0 && histCount > 0) {
        console.log(`\nEMPTY RESULTS in ${dbFile} for Race ID ${race.id} (${race.name}):`);
        console.log(`  This race is completed in history (entries: ${histCount}) but has 0 GC rows in results table!`);
      }
    }

  } catch (err) {
    console.error(`Error in ${dbFile}:`, err.message);
  }
  db.close();
});
