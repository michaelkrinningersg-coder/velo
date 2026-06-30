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
      // Find current name first to log
      const currentTeam = db.prepare("SELECT name FROM teams WHERE id = 21").get();
      if (currentTeam) {
        if (currentTeam.name === 'Garmin - Patagonia') {
          console.log(`[Already Done] ${filePath}: Team 21 is already 'Garmin - Patagonia'`);
        } else {
          const result = db.prepare("UPDATE teams SET name = 'Garmin - Patagonia' WHERE id = 21").run();
          console.log(`[SUCCESS] ${filePath}: Rename team from '${currentTeam.name}' to 'Garmin - Patagonia' (${result.changes} row(s) updated)`);
        }
      } else {
        console.log(`[WARNING] ${filePath}: Team 21 not found in 'teams' table`);
      }
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
console.log(`Scanning assets directory: ${assetsDir}`);
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
console.log(`Scanning savegames directory: ${savegamesDir}`);
if (fs.existsSync(savegamesDir)) {
  const files = fs.readdirSync(savegamesDir);
  for (const file of files) {
    if (file.endsWith('.db')) {
      updateDb(path.join(savegamesDir, file));
    }
  }
}

console.log('Database updates completed!');
