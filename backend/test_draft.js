const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const masterDbPath = './assets/world_data.db';
const tempDbPath = './assets/world_data_test_draft.db';

// Copy clean master DB
fs.copyFileSync(masterDbPath, tempDbPath);
console.log('Copied database to test environment.');

const db = new Database(tempDbPath);

// Free up some spots in teams 2, 7, 25 so they can draft
db.prepare(`
  DELETE FROM contracts 
  WHERE id IN (
    SELECT id FROM contracts 
    WHERE team_id IN (2, 7, 25) 
    LIMIT 10
  )
`).run();
console.log('Freed roster spots for teams 2, 7, and 25.');

// Import RiderDraftService from compiled files
const { RiderDraftService } = require('./dist/backend/src/game/RiderDraftService.js');

try {
  const service = new RiderDraftService(db);
  console.log('Running executeDraft(2027)...');
  service.executeDraft(2027);
  console.log('Draft completed successfully.');
} catch (err) {
  console.error('Error during draft:', err);
} finally {
  db.close();
  // Cleanup test database
  if (fs.existsSync(tempDbPath)) {
    fs.unlinkSync(tempDbPath);
    console.log('Cleaned up test database.');
  }
}
