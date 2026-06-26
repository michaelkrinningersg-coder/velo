const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const dbPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/assets/world_data.db';
const db = new Database(dbPath);

const races = db.prepare(`
  SELECT r.id, r.name, r.category_id, cat.name AS cat_name, r.start_date, r.end_date, r.number_of_stages, r.is_stage_race
  FROM races r
  JOIN race_categories cat ON cat.id = r.category_id
  ORDER BY r.start_date ASC
`).all();

function overlaps(r1, r2) {
  return r1.start_date <= r2.end_date && r1.end_date >= r2.start_date;
}

function hasOverlap(list, newRace) {
  for (const r of list) {
    if (overlaps(r, newRace)) return true;
  }
  return false;
}

const wtCobbles = [15, 21, 45, 46, 25, 27];
const wtFixedIds = [...wtCobbles, 4];
const proFixedIds = [79, 87, 93, 2, 3, 12, 103];

const baseWt = wtFixedIds.map(id => races.find(r => r.id === id));
const basePro = proFixedIds.map(id => races.find(r => r.id === id));

console.log("WT Fixed:");
baseWt.forEach(r => console.log(`  ${r.id}: ${r.name} (${r.start_date} to ${r.end_date}, ${r.number_of_stages} stages)`));
console.log("\nPro Fixed:");
basePro.forEach(r => console.log(`  ${r.id}: ${r.name} (${r.start_date} to ${r.end_date}, ${r.number_of_stages} stages)`));

// Which WT candidates do NOT overlap with Pro Fixed?
console.log("\nWT Candidates not overlapping with Pro Fixed:");
const wtCandidates = races.filter(r => {
  if ([5, 8].includes(r.category_id)) return false; // is WT
  if (wtFixedIds.includes(r.id)) return false; // not fixed
  if ([23, 55, 60].includes(r.id)) return false; // no GT
  return !hasOverlap(basePro, r);
});

wtCandidates.forEach(r => {
  console.log(`  ${r.id}: ${r.name} (${r.start_date} to ${r.end_date}, ${r.number_of_stages} stages)`);
});

db.close();
