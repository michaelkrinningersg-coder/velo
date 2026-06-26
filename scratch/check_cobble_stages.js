const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const dbPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/assets/world_data.db';
const db = new Database(dbPath);

const allCobbles = db.prepare(`
  SELECT r.id, r.name, r.category_id, r.is_stage_race, COUNT(s.id) AS cobble_stages
  FROM races r
  JOIN stages s ON s.race_id = r.id
  WHERE (s.profile = 'Cobble' OR s.profile = 'Cobble_Hill')
  GROUP BY r.id
`).all();

console.log("=== All races with cobble stages ===");
allCobbles.forEach(r => {
  const isPro = [5, 8].includes(r.category_id);
  console.log(`ID: ${String(r.id).padStart(3)} | Name: ${r.name.padEnd(50)} | Cat: ${r.category_id} | StageRace: ${r.is_stage_race} | Pro: ${isPro ? 'Yes' : 'No'} | Cobble Stages: ${r.cobble_stages}`);
});

db.close();
