const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const dbPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/assets/world_data.db';
const db = new Database(dbPath);

const races = db.prepare(`
  SELECT r.id, r.name, r.category_id, cat.name AS cat_name, r.start_date, r.end_date, r.number_of_stages
  FROM races r
  JOIN race_categories cat ON cat.id = r.category_id
  ORDER BY r.start_date ASC
`).all();

db.close();

function overlaps(r1, r2) {
  return r1.start_date <= r2.end_date && r1.end_date >= r2.start_date;
}

// WT races for P20 (104 stages)
const p20WtIds = [1, 4, 10, 16, 17, 19, 23, 28, 29, 30, 32, 50, 52, 54, 56, 57, 58, 60, 64, 65];
const p20Wt = p20WtIds.map(id => races.find(r => r.id === id));

console.log("=== Pro Series races compatible with P20 WT races ===");
const compatiblePro = [];
races.forEach(r => {
  if ([5, 8].includes(r.category_id)) {
    let overlap = false;
    for (const wt of p20Wt) {
      if (overlaps(wt, r)) {
        overlap = true;
        break;
      }
    }
    if (!overlap) {
      console.log(`ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(50)} | Stages: ${r.number_of_stages} | ${r.start_date} -> ${r.end_date}`);
      compatiblePro.push(r);
    }
  }
});

console.log(`\nTotal compatible Pro races: ${compatiblePro.length}`);
