const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const savegamesDir = path.join('C:', 'Users', 'micha', '.velo', 'savegames');
if (!fs.existsSync(savegamesDir)) {
  console.log('Savegames directory does not exist:', savegamesDir);
  process.exit(1);
}

const files = fs.readdirSync(savegamesDir).filter(f => f.endsWith('.db'));
for (const file of files) {
  const dbPath = path.join(savegamesDir, file);
  try {
    const db = new Database(dbPath, { readonly: true });
    const gameState = db.prepare('SELECT current_date, season FROM game_state WHERE id = 1').get();
    const team = db.prepare("SELECT id, name, abbreviation FROM teams WHERE name LIKE '%Falke%' OR name LIKE '%Scott%'").get();
    console.log(`File: ${file}`);
    console.log(`  State: date=${gameState?.current_date}, season=${gameState?.season}`);
    if (team) {
      console.log(`  Found Team: ID=${team.id}, Name="${team.name}", Abbr=${team.abbreviation}`);
    } else {
      console.log('  Team Falke/Scott not found.');
    }
    db.close();
  } catch (err) {
    console.log(`File: ${file} - Error: ${err.message}`);
  }
}
