const fs = require('fs');
const path = require('path');
const os = require('os');
const Database = require('better-sqlite3');

const savePath = path.join(os.homedir(), '.velo', 'savegames', 'a_1782215328548.db');
if (!fs.existsSync(savePath)) {
  console.log('Save file not found.');
  process.exit(1);
}

const db = new Database(savePath);

const stageId = 14;

const meta = db.prepare(`
  SELECT 
    stages.id AS stage_id,
    stages.race_id AS race_id,
    races.name AS race_name,
    stages.stage_number AS stage_number,
    stages.date AS date,
    stages.profile AS profile,
    races.is_stage_race AS is_stage_race
  FROM stages
  JOIN races ON races.id = stages.race_id
  WHERE stages.id = ?
`).get(stageId);

console.log('Meta:', meta);

const expectedStageCount = db.prepare(`
  SELECT COUNT(*) AS stage_count
  FROM stages
  WHERE race_id = ?
    AND stage_number <= ?
`).get(meta.race_id, meta.stage_number).stage_count;

console.log('Expected Stage Count:', expectedStageCount);

const tableName = 'all_stage_entries';

// Let's run query WITHOUT HAVING clause
const rowsNoHaving = db.prepare(`
  SELECT ${tableName}.rider_id AS rider_id,
         COUNT(*) as cnt,
         SUM(CASE WHEN ${tableName}.status = 'finished' THEN 1 ELSE 0 END) as finished_cnt,
         SUM(CASE WHEN ${tableName}.status IN ('dns', 'dnf') THEN 1 ELSE 0 END) as dnf_dns_cnt
  FROM ${tableName}
  JOIN stages ON stages.id = ${tableName}.stage_id
  WHERE ${tableName}.race_id = ?
    AND stages.stage_number <= ?
  GROUP BY ${tableName}.rider_id
`).all(meta.race_id, meta.stage_number);

console.log(`Rows without HAVING count: ${rowsNoHaving.length}`);
console.log('Sample rows without HAVING (first 10):');
console.log(rowsNoHaving.slice(0, 10));

// Let's run with HAVING clause
const rowsWithHaving = db.prepare(`
  SELECT ${tableName}.rider_id AS rider_id
  FROM ${tableName}
  JOIN stages ON stages.id = ${tableName}.stage_id
  WHERE ${tableName}.race_id = ?
    AND stages.stage_number <= ?
  GROUP BY ${tableName}.rider_id
  HAVING COUNT(*) = ?
    AND SUM(CASE WHEN ${tableName}.status = 'finished' THEN 1 ELSE 0 END) = ?
    AND SUM(CASE WHEN ${tableName}.status IN ('dns', 'dnf') THEN 1 ELSE 0 END) = 0
`).all(meta.race_id, meta.stage_number, expectedStageCount, expectedStageCount);

console.log(`Rows with HAVING count: ${rowsWithHaving.length}`);

db.close();
