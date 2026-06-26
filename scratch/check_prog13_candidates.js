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

const baseWt = [55, 23, 15, 21, 45, 46, 25, 27, 10, 53, 62, 63].map(id => races.find(r => r.id === id));
const allAutumnIds = [56, 58, 61, 62, 63, 64, 84, 85, 86, 87, 89, 90, 91, 92, 93, 94, 96];

const wtCandidates = races.filter(r => {
  if ([5, 8].includes(r.category_id)) return false; // not WT
  if (baseWt.some(x => x.id === r.id)) return false; // already base
  if (r.id === 60) return false; // Vuelta
  if (allAutumnIds.includes(r.id)) return false; // no autumn classics
  return !hasOverlap(baseWt, r);
});

console.log("WT Candidates for Prog 13:");
wtCandidates.forEach(c => {
  console.log(`  ID: ${c.id} | ${c.name} | Stages: ${c.number_of_stages} | ${c.start_date} to ${c.end_date}`);
});

const totalStages = wtCandidates.reduce((sum, r) => sum + r.number_of_stages, 0);
console.log("Total Stages available:", totalStages, "(Needed: 39)");
