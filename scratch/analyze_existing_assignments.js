const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const dbPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/assets/world_data.db';
const db = new Database(dbPath);

const counts = db.prepare(`
  SELECT r.id, r.name, r.category_id, cat.name AS cat_name, r.start_date, r.is_stage_race, r.number_of_stages,
         (SELECT COUNT(*) FROM race_program_races rpr WHERE rpr.race_id = r.id) AS assignments
  FROM races r
  JOIN race_categories cat ON cat.id = r.category_id
  ORDER BY assignments ASC, r.start_date ASC
`).all();

console.log("=== Races with Fewest Assignments ===");
counts.slice(0, 40).forEach(r => {
  console.log(`ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(50)} | Cat: ${r.category_id} | Assignments: ${r.assignments} | Date: ${r.start_date} | Stages: ${r.number_of_stages}`);
});

console.log("\n=== Races with Most Assignments ===");
counts.slice(-20).reverse().forEach(r => {
  console.log(`ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(50)} | Cat: ${r.category_id} | Assignments: ${r.assignments} | Date: ${r.start_date} | Stages: ${r.number_of_stages}`);
});

db.close();
