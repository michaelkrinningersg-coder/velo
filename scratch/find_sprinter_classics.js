const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const dbPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/assets/world_data.db';
const db = new Database(dbPath);

const races = db.prepare(`
  SELECT id, name, start_date, end_date, category_id
  FROM races
  WHERE name LIKE '%Panne%' OR name LIKE '%Brugge%' OR name LIKE '%Cyclassics%' OR name LIKE '%Gent%' OR name LIKE '%Wevelgem%' OR name LIKE '%Schelde%'
`).all();

console.log(JSON.stringify(races, null, 2));
db.close();
