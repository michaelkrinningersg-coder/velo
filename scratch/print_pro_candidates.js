const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const dbPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/assets/world_data.db';
const db = new Database(dbPath);

const races = db.prepare(`
  SELECT r.id, r.name, r.category_id, cat.name AS cat_name, r.start_date, r.end_date, r.number_of_stages, r.is_stage_race
  FROM races r
  JOIN race_categories cat ON cat.id = r.category_id
  ORDER BY r.start_date ASC
`).all();

db.close();

const wtFixed = [17, 28, 29, 30, 56, 64];
const baseWt = wtFixed.map(id => races.find(r => r.id === id));
const excludedRaces = [15, 21, 45, 46, 25, 27, 70, 72, 79, 87, 93, 23, 55, 60];

function overlaps(r1, r2) {
  return r1.start_date <= r2.end_date && r1.end_date >= r2.start_date;
}

function hasOverlap(list, newRace) {
  for (const r of list) {
    if (overlaps(r, newRace)) return true;
  }
  return false;
}

const proCandidates = races.filter(r => {
  if (![5, 8].includes(r.category_id)) return false;
  if (excludedRaces.includes(r.id)) return false;
  const overlapsWt = hasOverlap(baseWt, r);
  if (overlapsWt) {
    console.log(`Excluded due to overlap with fixed WT: ${r.id} | ${r.name} (${r.start_date} to ${r.end_date})`);
  }
  return !overlapsWt;
});

console.log("\nPro Candidates:");
proCandidates.forEach(r => {
  console.log(`  ${r.start_date} | ${r.end_date} | ID: ${r.id} | Stages: ${r.number_of_stages} | ${r.name}`);
});
