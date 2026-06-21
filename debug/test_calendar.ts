import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { GameStateService } from '../backend/src/game/GameStateService';

const debugDir = __dirname;
const savegamesDir = path.join('C:', 'Users', 'micha', '.velo', 'savegames');
const tempDbPath = path.join(debugDir, 'calendar_test.db');

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
  fs.copyFileSync(srcDbPath, tempDbPath);
  const db = new Database(tempDbPath);

  try {
    const gss = new GameStateService(db);
    
    // Set game date to 2026-12-31 to trigger transition on advance
    db.prepare("UPDATE game_state SET current_date = '2026-12-31', season = 2026 WHERE id = 1").run();
    console.log("Advancing to 2027-01-01...");
    gss.advanceDay();

    // Now advance day-by-day in 2027 and see if any races are found
    // Santos Tour Down Under starts around Jan 11 (2026-01-11)
    // In 2027, the corresponding dates would be 2027-01-11
    console.log("Simulating first 20 days of 2027...");
    for (let day = 1; day <= 20; day++) {
      const state = db.prepare('SELECT "current_date" AS current_date, season FROM game_state WHERE id = 1').get() as { current_date: string, season: number };
      
      // Check if there is a race today in the DB stages
      const stagesToday = db.prepare('SELECT * FROM stages WHERE date = ?').all(state.current_date);
      
      console.log(`Day ${day}: Date = ${state.current_date}, Stages today count = ${stagesToday.length}`);
      if (stagesToday.length > 0) {
        console.log(`  Found stages: ${stagesToday.map(s => `Stage ID ${s.id} (Race ID ${s.race_id})`).join(', ')}`);
      }

      gss.advanceDay();
    }

  } catch (err) {
    console.error("Calendar test error:", err);
  } finally {
    db.close();
    if (fs.existsSync(tempDbPath)) fs.unlinkSync(tempDbPath);
  }
}

main();
