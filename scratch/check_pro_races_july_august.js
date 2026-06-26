const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const dbPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/assets/world_data.db';
const db = new Database(dbPath);

const races = db.prepare(`
  SELECT r.id, r.name, r.category_id, cat.name AS cat_name, r.start_date, r.end_date, r.number_of_stages
  FROM races r
  JOIN race_categories cat ON cat.id = r.category_id
  WHERE r.category_id IN (5, 8) 
    AND (r.start_date LIKE '2026-07%' OR r.start_date LIKE '2026-08%')
  ORDER BY r.start_date ASC
`).all();

races.forEach(r => {
  console.log(`ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(50)} | Stages: ${r.number_of_stages} | ${r.start_date} -> ${r.end_date}`);
});

db.close();
