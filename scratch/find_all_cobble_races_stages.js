const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const db = new Database('backend/assets/world_data.db');

const cobbleRaces = db.prepare(`
  SELECT DISTINCT r.id, r.name, r.category_id, cat.name AS cat_name, r.is_stage_race
  FROM races r
  JOIN race_categories cat ON cat.id = r.category_id
  JOIN stages s ON s.race_id = r.id
  WHERE s.profile = 'Cobble' OR s.profile = 'Cobble_Hill'
`).all();

console.log("Cobble races in database:");
console.log(JSON.stringify(cobbleRaces, null, 2));
db.close();
