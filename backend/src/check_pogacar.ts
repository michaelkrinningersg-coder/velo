import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const savegamesDir = path.join(os.homedir(), '.velo', 'savegames');

async function run() {
  if (!fs.existsSync(savegamesDir)) {
    console.log(`Savegames directory not found: ${savegamesDir}`);
    return;
  }

  const files = fs.readdirSync(savegamesDir).filter(f => /^[\w\-]+\.db$/.test(f));

  for (const filename of files) {
    const dbPath = path.join(savegamesDir, filename);
    const mtime = fs.statSync(dbPath).mtime;
    console.log(`\n=================== SAVE: ${filename} (Modified: ${mtime}) ===================`);

    try {
      const db = new Database(dbPath);
      const rider = db.prepare(`
        SELECT r.id, r.first_name, r.last_name, sr.name as role_name
        FROM riders r
        LEFT JOIN sta_role sr ON sr.id = r.role_id
        WHERE r.last_name LIKE '%Poga%'
      `).get() as any;

      if (!rider) {
        console.log('Pogacar not found');
        db.close();
        continue;
      }

      console.log(`Pogacar: ID=${rider.id}, Name=${rider.first_name} ${rider.last_name}, Role=${rider.role_name}`);

      const prog = db.prepare(`
        SELECT rsp.program_id, rp.name as program_name
        FROM rider_season_programs rsp
        JOIN race_programs rp ON rp.id = rsp.program_id
        WHERE rsp.rider_id = ?
      `).get(rider.id) as any;

      if (!prog) {
        console.log('No season program assigned');
      } else {
        console.log(`Assigned Program: ID=${prog.program_id}, Name=${prog.program_name}`);

        const races = db.prepare(`
          SELECT rpr.race_id, r.name as race_name
          FROM race_program_races rpr
          LEFT JOIN races r ON r.id = rpr.race_id
          WHERE rpr.program_id = ?
        `).all(prog.program_id) as any[];

        const giro = races.find(r => r.race_id === 23);
        if (giro) {
          console.log(`  -> HAS GIRO: ${giro.race_name}`);
        } else {
          console.log('  -> DOES NOT HAVE GIRO');
        }
      }
      db.close();
    } catch (err) {
      console.log(`Error reading save: ${(err as Error).message}`);
    }
  }
}

run().catch(console.error);
