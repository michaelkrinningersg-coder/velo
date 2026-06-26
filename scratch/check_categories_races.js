const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const dbPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/assets/world_data.db';
const db = new Database(dbPath);

const races = db.prepare(`
  SELECT r.id, r.name, r.category_id, cat.name AS cat_name, r.number_of_stages
  FROM races r
  JOIN race_categories cat ON cat.id = r.category_id
  ORDER BY r.category_id ASC
`).all();

db.close();

const summary = {};
races.forEach(r => {
  if (!summary[r.category_id]) {
    summary[r.category_id] = { name: r.cat_name, count: 0, stages: 0, race_ids: [] };
  }
  summary[r.category_id].count++;
  summary[r.category_id].stages += r.number_of_stages;
  summary[r.category_id].race_ids.push(r.id);
});

console.log(JSON.stringify(summary, null, 2));
