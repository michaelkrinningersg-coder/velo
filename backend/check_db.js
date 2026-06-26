const Database = require('better-sqlite3');
const dbPath = 'C:/Users/mkrinninger/.velo/savegames/a_1781271884931.db';
const db = new Database(dbPath);

const raceId = 1;
const upToStageNumber = 4;

const expectedStageCount = db.prepare(`
  SELECT COUNT(*) AS stage_count
  FROM stages
  WHERE race_id = ?
    AND stage_number <= ?
`).get(raceId, upToStageNumber).stage_count;

console.log('expectedStageCount:', expectedStageCount);

const hasEntries = db.prepare(`
  SELECT COUNT(*) AS c FROM stage_entries WHERE race_id = ?
`).get(raceId).c > 0;

console.log('hasEntries:', hasEntries);

const tableName = hasEntries ? 'stage_entries' : 'stage_entries_history';

const rows = db.prepare(`
  SELECT ${tableName}.rider_id AS rider_id
  FROM ${tableName}
  JOIN stages ON stages.id = ${tableName}.stage_id
  WHERE ${tableName}.race_id = ?
    AND stages.stage_number <= ?
  GROUP BY ${tableName}.rider_id
  HAVING COUNT(*) = ?
    AND SUM(CASE WHEN ${tableName}.status = 'finished' THEN 1 ELSE 0 END) = ?
    AND SUM(CASE WHEN ${tableName}.status IN ('dns', 'dnf') THEN 1 ELSE 0 END) = 0
`).all(raceId, upToStageNumber, expectedStageCount, expectedStageCount);

console.log(`Riders found: ${rows.length}`);

db.close();
