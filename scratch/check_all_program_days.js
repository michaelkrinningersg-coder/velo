const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const dbPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/assets/world_data.db';
const db = new Database(dbPath);

const programs = db.prepare(`SELECT * FROM race_programs ORDER BY id ASC`).all();

programs.forEach(p => {
  const mappings = db.prepare(`
    SELECT r.id, r.name, r.number_of_stages, r.category_id
    FROM race_program_races m
    JOIN races r ON r.id = m.race_id
    WHERE m.program_id = ?
  `).all(p.id);
  
  let wt = 0;
  let pro = 0;
  mappings.forEach(r => {
    const isPro = [5, 8].includes(r.category_id);
    if (isPro) pro += r.number_of_stages;
    else wt += r.number_of_stages;
  });
  
  console.log(`Program ${p.id.toString().padStart(2)}: ${p.name.padEnd(50)} | Total: ${(wt+pro).toString().padStart(3)} | WT: ${wt.toString().padStart(3)} (${(wt/(wt+pro)*100).toFixed(1)}%) | Pro: ${pro.toString().padStart(3)} (${(pro/(wt+pro)*100).toFixed(1)}%)`);
});

db.close();
