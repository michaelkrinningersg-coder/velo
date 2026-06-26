const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const dbPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/assets/world_data.db';
const db = new Database(dbPath);

const races = db.prepare(`
  SELECT id, name, start_date, end_date, category_id, number_of_stages
  FROM races
  WHERE start_date LIKE '2026-04-%'
  ORDER BY start_date ASC
`).all();

console.log(JSON.stringify(races, null, 2));
db.close();
