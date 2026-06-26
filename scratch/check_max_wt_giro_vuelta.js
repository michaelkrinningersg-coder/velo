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
const wtCobbleExcludes = [15, 21, 25, 27];

const wtCandidates = races.filter(r => {
  if ([5, 8].includes(r.category_id)) return false; // not WT
  if (r.id === 23 || r.id === 55 || r.id === 60) return false; // Giro, Tour, Vuelta
  if (baseWt.some(x => x.id === r.id)) return false; // already base
  if (wtCobbleExcludes.includes(r.id)) return false; // cobble excludes
  return !hasOverlap(baseWt, r);
});

console.log("WT Candidates for Prog 19:");
let total = baseWt.reduce((a,b)=>a+b.number_of_stages,0);
console.log(`Base WT stages: ${total}`);
wtCandidates.forEach(c => {
  console.log(`  ID: ${c.id} | ${c.name} | Stages: ${c.number_of_stages} | ${c.start_date} to ${c.end_date}`);
});

// Let's find the max compatible WT stages from this list
const sorted = [...wtCandidates].sort((a,b)=>a.start_date.localeCompare(b.start_date));
const N = sorted.length;
const memo = {};
function getMaxStages(idx, currentList, stages) {
  if (idx >= N) return stages;
  
  // Option 1: skip
  let maxVal = getMaxStages(idx + 1, currentList, stages);
  
  // Option 2: take if compatible
  const r = sorted[idx];
  if (!hasOverlap(currentList, r)) {
    const takeVal = getMaxStages(idx + 1, [...currentList, r], stages + r.number_of_stages);
    if (takeVal > maxVal) maxVal = takeVal;
  }
  return maxVal;
}

console.log("Max compatible WT stages we can get:", getMaxStages(0, baseWt, total));
