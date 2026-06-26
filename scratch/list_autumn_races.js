const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const db = new Database('backend/assets/world_data.db');

const races = db.prepare(`
  SELECT id, name, start_date, end_date, category_id, number_of_stages
  FROM races
  WHERE start_date >= '2026-08-01'
  ORDER BY start_date ASC
`).all();

console.log(JSON.stringify(races, null, 2));
db.close();
