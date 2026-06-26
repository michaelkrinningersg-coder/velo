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
const c24 = [70, 72, 79, 93]; // Size 4 subset of Pro Cobbles
const wtFixedIds = [...wtCobbles, 4];
const proFixedIds = [...c24, 2, 3, 103]; // Algarve = 3

const baseWt = wtFixedIds.map(id => races.find(r => r.id === id));
const basePro = proFixedIds.map(id => races.find(r => r.id === id));

console.log("P24 WT Fixed stages total:", baseWt.reduce((sum, r) => sum + r.number_of_stages, 0));
console.log("P24 Pro Fixed stages total:", basePro.reduce((sum, r) => sum + r.number_of_stages, 0));

// Let's assume a minimal WT solution (just baseWt = 7 stages)
const combinedWt = baseWt;

const proCandidates = races.filter(r => {
  if (![5, 8].includes(r.category_id)) return false;
  if (proFixedIds.includes(r.id)) return false;
  if ([22, 11, 5, 8, 9, 106, 110].includes(r.id)) return false; // exclusions
  if (hasOverlap(combinedWt, r)) return false;
  return !hasOverlap(basePro, r);
});

console.log(`Pro Candidates count: ${proCandidates.length}`);
let proSum = proCandidates.reduce((sum, r) => sum + r.number_of_stages, 0);
console.log(`Total Pro Candidate stages: ${proSum}`);

// Let's find the max non-overlapping stages from Pro Candidates
// Sort by end_date for interval scheduling
const sorted = [...proCandidates].sort((a,b)=>a.end_date.localeCompare(b.end_date));
let selected = [];
for (const r of sorted) {
  if (!hasOverlap(selected, r)) {
    selected.push(r);
  }
}
let maxNonOverlap = selected.reduce((sum,r)=>sum+r.number_of_stages,0);
console.log(`Max non-overlapping stages in Pro Candidates: ${maxNonOverlap}`);
console.log("Non-overlapping selected:");
selected.forEach(r => console.log(`  ${r.id}: ${r.name} (${r.number_of_stages} stages) from ${r.start_date} to ${r.end_date}`));

