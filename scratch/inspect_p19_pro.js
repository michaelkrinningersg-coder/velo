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

// Helper for date overlap
function overlaps(r1, r2) {
  return r1.start_date <= r2.end_date && r1.end_date >= r2.start_date;
}

function hasOverlap(list, newRace) {
  for (const r of list) {
    if (overlaps(r, newRace)) return true;
  }
  return false;
}

const baseWt = [23, 60, 1, 10, 32].map(id => races.find(r => r.id === id));
const proCobbleExcludes = [72, 79, 87]; // keep 77 Scheldeprijs

const proCandidates = races.filter(r => {
  if (![5, 8].includes(r.category_id)) return false; // not Pro
  if (r.id === 77) return false; // already base
  if (proCobbleExcludes.includes(r.id)) return false;
  return !hasOverlap(baseWt, r);
});

console.log("Pro Candidates for Prog 19:");
proCandidates.forEach(c => {
  console.log(`  ID: ${c.id} | ${c.name} | Stages: ${c.number_of_stages} | ${c.start_date} to ${c.end_date}`);
});

const totalPro = proCandidates.reduce((sum, r) => sum + r.number_of_stages, 0);
console.log("Total Pro stages available:", totalPro, "(Needed: 20)");
