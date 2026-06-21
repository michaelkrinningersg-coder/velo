import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { GameStateService } from '../backend/src/game/GameStateService';

const debugDir = __dirname;
const savegamesDir = path.join('C:', 'Users', 'micha', '.velo', 'savegames');
const tempDbPath = path.join(debugDir, 'stages_test.db');

function findLatestSavegame(): string {
  const files = fs.readdirSync(savegamesDir)
    .filter(f => f.endsWith('.db') && !f.includes('tmp'))
    .map(f => ({
      name: f,
      path: path.join(savegamesDir, f),
      size: fs.statSync(path.join(savegamesDir, f)).size
    }));
  files.sort((a, b) => b.size - a.size);
  return files[0].path;
}

async function main() {
  const srcDbPath = findLatestSavegame();
  console.log(`Copying database from ${srcDbPath} to ${tempDbPath}...`);
  fs.copyFileSync(srcDbPath, tempDbPath);

  const db = new Database(tempDbPath);

  try {
    // Check initial state
    const initGameState = db.prepare('SELECT * FROM game_state').all();
    console.log("Initial game_state table:", initGameState);

    // Set date to season end
    db.prepare("UPDATE game_state SET current_date = '2026-12-31', season = 2026 WHERE id = 1").run();
    console.log("Updated game_state to 2026-12-31");

    const preGameState = db.prepare('SELECT * FROM game_state').all();
    console.log("Pre-advance game_state table:", preGameState);

    // Instantiate GameStateService and call advanceDay()
    console.log("Advancing day to trigger season transition...");
    const gss = new GameStateService(db);
    const nextState = gss.advanceDay();
    console.log(`advanceDay() returned: date=${nextState.currentDate}, season=${nextState.season}`);
    
    // Check new state in DB
    const postGameState = db.prepare('SELECT * FROM game_state').all();
    console.log("Post-advance game_state table:", postGameState);

    // Check unique years in stages table after transition
    const yearsAfter = db.prepare("SELECT DISTINCT substr(date, 1, 4) as yr FROM stages ORDER BY yr").all();
    console.log("Years in stages AFTER transition:", yearsAfter);

  } catch (err) {
    console.error("Error during stage check:", err);
  } finally {
    db.close();
    // Do not delete for now so we can inspect
    console.log("Cleanup skipped (stages_test.db preserved).");
  }
}

main().catch(err => console.error("Fatal error:", err));
