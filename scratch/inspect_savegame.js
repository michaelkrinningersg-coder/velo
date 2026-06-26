const Database = require('better-sqlite3');
const path = require('path');

const dbPath = 'C:/Users/mkrinninger/.velo/savegames/a_1781271884931.db';
const db = new Database(dbPath);

console.log('Connecting to database:', dbPath);

// Find stage races
const stageRaces = db.prepare(`
  SELECT id, name, is_stage_race, number_of_stages, start_date, end_date
  FROM races
  WHERE is_stage_race = 1
  ORDER BY start_date DESC
  LIMIT 5
`).all();

console.log('\n--- LATEST STAGE RACES ---');
console.log(stageRaces);

if (stageRaces.length > 0) {
  const latestRace = stageRaces[0];
  const raceId = latestRace.id;
  console.log(`\nInspecting latest race ID: ${raceId} (${latestRace.name})`);

  // Find stages
  const stages = db.prepare(`
    SELECT id, stage_number, date, profile
    FROM stages
    WHERE race_id = ?
    ORDER BY stage_number ASC
  `).all(raceId);
  console.log('\n--- STAGES ---');
  console.log(stages);

  // Check stage entries for each stage of this race
  console.log('\n--- STAGE ENTRIES COUNT BY STAGE ---');
  for (const stage of stages) {
    const activeCount = db.prepare('SELECT count(*) as cnt FROM stage_entries WHERE stage_id = ?').get(stage.id).cnt;
    const historyCount = db.prepare('SELECT count(*) as cnt FROM stage_entries_history WHERE stage_id = ?').get(stage.id).cnt;
    const finishedCount = db.prepare('SELECT count(*) as cnt FROM stage_entries WHERE stage_id = ? AND status = "finished"').get(stage.id).cnt;
    const finishedHistCount = db.prepare('SELECT count(*) as cnt FROM stage_entries_history WHERE stage_id = ? AND status = "finished"').get(stage.id).cnt;
    console.log(`Stage ${stage.stage_number} (ID: ${stage.id}): Active=${activeCount} (Finished=${finishedCount}), History=${historyCount} (Finished=${finishedHistCount})`);
  }

  // Run the getFullyClassifiedStageRaceRiderIds query manually
  console.log('\n--- RUNNING getFullyClassifiedStageRaceRiderIds FOR STAGE NUMBER AND COUNTS ---');
  const upToStageNumber = latestRace.number_of_stages;
  const expectedStageCount = db.prepare(`
    SELECT COUNT(*) AS stage_count
    FROM stages
    WHERE race_id = ?
      AND stage_number <= ?
  `).get(raceId, upToStageNumber).stage_count;

  console.log(`upToStageNumber: ${upToStageNumber}, expectedStageCount: ${expectedStageCount}`);

  // Query table list
  const hasAllStageEntries = db.prepare("SELECT name FROM sqlite_master WHERE type = 'view' AND name = 'all_stage_entries'").get();
  console.log('all_stage_entries view exists:', !!hasAllStageEntries);

  const tableName = hasAllStageEntries ? 'all_stage_entries' : 'stage_entries';

  // Manual query
  const rows = db.prepare(`
    SELECT ${tableName}.rider_id AS rider_id, COUNT(*) as cnt, SUM(CASE WHEN ${tableName}.status = 'finished' THEN 1 ELSE 0 END) as finished_cnt
    FROM ${tableName}
    JOIN stages ON stages.id = ${tableName}.stage_id
    WHERE ${tableName}.race_id = ?
      AND stages.stage_number <= ?
    GROUP BY ${tableName}.rider_id
    LIMIT 10
  `).all(raceId, upToStageNumber);
  console.log('\n--- SAMPLE GROUP BY RIDERS FROM VIEW ---');
  console.log(rows);

  const eligibleRows = db.prepare(`
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

  console.log(`\nFully classified riders returned: ${eligibleRows.length}`);
  if (eligibleRows.length > 0) {
    console.log('First 5 rider IDs:', eligibleRows.slice(0, 5).map(r => r.rider_id));
  }

  // Let's also check results table for this race
  const resultsCount = db.prepare('SELECT count(*) as cnt FROM results WHERE race_id = ?').get(raceId).cnt;
  const resultsHistCount = db.prepare('SELECT count(*) as cnt FROM results_history WHERE race_id = ?').get(raceId).cnt;
  console.log(`\nResults count: Active=${resultsCount}, History=${resultsHistCount}`);
  
  const sampleResults = db.prepare(`
    SELECT result_type_id, count(*) as cnt
    FROM results
    WHERE race_id = ?
    GROUP BY result_type_id
  `).all(raceId);
  console.log('Active results breakdown by type:', sampleResults);
}

db.close();
