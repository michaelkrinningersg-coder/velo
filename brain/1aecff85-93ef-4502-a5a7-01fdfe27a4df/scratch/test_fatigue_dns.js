const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'test_run.db');
const db = new Database(dbPath);

console.log('--- Testing Fatigue Roster Lock & DNS Updates ---');

const rider = db.prepare('SELECT id, first_name, last_name FROM riders LIMIT 1').get();
if (!rider) {
  console.log('No riders found.');
  process.exit(1);
}
console.log(`Using rider: ${rider.first_name} ${rider.last_name} (ID: ${rider.id})`);

db.prepare(`
  INSERT OR IGNORE INTO rider_daily_state (rider_id, short_term_fatigue, long_term_fatigue_decayable, long_term_fatigue_locked)
  VALUES (?, 0, 0, 0)
`).run(rider.id);

db.prepare(`
  UPDATE rider_daily_state
  SET short_term_fatigue = 15, long_term_fatigue_decayable = 11, long_term_fatigue_locked = 0
  WHERE rider_id = ?
`).run(rider.id);

const stage = db.prepare('SELECT id, race_id, stage_number FROM stages LIMIT 1').get();
if (!stage) {
  console.log('No stages found.');
  process.exit(1);
}
console.log(`Using stage: ID ${stage.id}, Race ID ${stage.race_id}, Stage Number ${stage.stage_number}`);

db.prepare(`
  INSERT OR IGNORE INTO race_entries (race_id, team_id, rider_id)
  VALUES (?, 1, ?)
`).run(stage.race_id, rider.id);

db.prepare('DELETE FROM stage_entries WHERE stage_id = ?').run(stage.id);

db.prepare(`
  INSERT INTO stage_entries (stage_id, race_id, team_id, rider_id, status)
  VALUES (?, ?, 1, ?, 'scheduled')
`).run(stage.id, stage.race_id, rider.id);

db.prepare(`
  UPDATE stage_entries
  SET status = 'dns', status_reason = 'Erschöpfung'
  WHERE stage_id = ?
    AND status = 'scheduled'
    AND rider_id IN (
      SELECT rider_id
      FROM rider_daily_state
      WHERE (short_term_fatigue + long_term_fatigue_decayable + long_term_fatigue_locked) >= 25.0
    )
`).run(stage.id);

const entry = db.prepare('SELECT status, status_reason FROM stage_entries WHERE stage_id = ? AND rider_id = ?').get(stage.id, rider.id);
console.log(`Updated status: ${entry?.status}, reason: ${entry?.status_reason}`);
if (entry?.status === 'dns' && entry?.status_reason === 'Erschöpfung') {
  console.log('SUCCESS: Fatigue DNS update test passed!');
} else {
  console.log('FAILURE: Fatigue DNS update test failed.');
  process.exit(1);
}

db.prepare('DELETE FROM stage_entries WHERE stage_id = ?').run(stage.id);
db.prepare('DELETE FROM race_entries WHERE race_id = ? AND rider_id = ?').run(stage.race_id, rider.id);

console.log('All tests completed successfully!');
