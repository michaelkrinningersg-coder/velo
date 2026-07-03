const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

function updateDb(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  try {
    const db = new Database(filePath);
    // Check if table teams exists
    const teamsTableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='teams'").get();
    if (teamsTableExists) {
      const result = db.prepare("UPDATE teams SET abbreviation = 'GAP', country_id = 6 WHERE id = 21").run();
      console.log(`[SUCCESS] ${filePath}: Updated abbreviation and country_id for Team 21 (${result.changes} row(s) updated)`);
    } else {
      console.log(`[SKIPPED] ${filePath}: 'teams' table does not exist`);
    }
    db.close();
  } catch (err) {
    console.error(`[ERROR] ${filePath}:`, err.message);
  }
}

// Update DB files in backend/assets
const assetsDir = path.join(__dirname, 'assets');
if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  for (const file of files) {
    if (file.endsWith('.db')) {
      updateDb(path.join(assetsDir, file));
    }
  }
}

// Update DB files in savegames directory
const savegamesDir = 'C:\\Users\\micha\\.velo\\savegames';
if (fs.existsSync(savegamesDir)) {
  const files = fs.readdirSync(savegamesDir);
  for (const file of files) {
    if (file.endsWith('.db')) {
      updateDb(path.join(savegamesDir, file));
    }
  }
}

console.log('Database details sync completed!');
