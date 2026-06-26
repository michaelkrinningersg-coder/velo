const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const dbPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/assets/world_data.db';
const db = new Database(dbPath);

const ids = [1, 54, 20, 22, 11, 10, 5, 8, 9, 106, 110, 4, 2, 3, 12, 103];
const races = db.prepare(`
  SELECT r.id, r.name, r.category_id, r.start_date, r.end_date, r.number_of_stages
  FROM races r
  WHERE r.id IN (${ids.join(',')})
`).all();

console.log("Prep races details:");
console.log(JSON.stringify(races, null, 2));

db.close();
