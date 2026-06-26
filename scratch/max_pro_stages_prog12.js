const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const dbPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/assets/world_data.db';
const db = new Database(dbPath);

const wtRaces = db.prepare(`
  SELECT id, name, number_of_stages, start_date, end_date, category_id
  FROM races
  WHERE category_id NOT IN (5, 8)
`).all();

const proRaces = db.prepare(`
  SELECT id, name, number_of_stages, start_date, end_date, category_id
  FROM races
  WHERE category_id IN (5, 8)
`).all();

const cobbleRaces = [
  15, 21, 45, 46, 25, 27, 20
];

function overlaps(r1, r2) {
  return r1.start_date <= r2.end_date && r1.end_date >= r2.start_date;
}

function hasOverlap(list, newRace) {
  for (const r of list) {
    if (overlaps(r, newRace)) return true;
  }
  return false;
}

const mandWtIds = [55, 60, 29, 30, 28]; // Tour, Vuelta, AGR, Fleche, Liege
const mandProIds = [26]; // Brabantse Pijl
const initialWt = wtRaces.filter(r => mandWtIds.includes(r.id));
const initialPro = proRaces.filter(r => mandProIds.includes(r.id));

// Find a 6-stage WT race that doesn't overlap
const sixStageWt = wtRaces.find(r => r.number_of_stages === 6 && !hasOverlap(initialWt, r) && !cobbleRaces.includes(r.id));
console.log("Selected 6-stage WT prep race:", sixStageWt ? sixStageWt.name : "None");

const fullWt = [...initialWt, sixStageWt];
const candidatesPro = proRaces.filter(r => {
  if (cobbleRaces.includes(r.id)) return false;
  if (hasOverlap(fullWt, r)) return false;
  return true;
}).sort((a, b) => a.start_date.localeCompare(b.start_date));

console.log("Number of Pro candidates:", candidatesPro.length);

// Greedy initialization
const greedySelected = [...initialPro];
let greedyStages = 1;
candidatesPro.forEach(r => {
  if (!hasOverlap(greedySelected, r)) {
    greedySelected.push(r);
    greedyStages += r.number_of_stages;
  }
});
console.log("Greedy Pro stages lower bound:", greedyStages);

let maxStages = greedyStages;
let bestSelected = [...greedySelected];

const remainingStages = [];
let sum = 0;
for (let i = candidatesPro.length - 1; i >= 0; i--) {
  sum += candidatesPro[i].number_of_stages;
  remainingStages[i] = sum;
}

function searchMaxStages(startIndex, selected, currentStages) {
  if (currentStages > maxStages) {
    maxStages = currentStages;
    bestSelected = [...selected];
  }
  
  if (startIndex >= candidatesPro.length) {
    return;
  }
  
  // Pruning: if currentStages + remaining stages + initial (1 stage) <= maxStages, return
  if (currentStages + 1 + remainingStages[startIndex] <= maxStages) {
    return;
  }
  
  // Try including
  const race = candidatesPro[startIndex];
  if (!hasOverlap(selected, race) && !hasOverlap(initialPro, race)) {
    selected.push(race);
    searchMaxStages(startIndex + 1, selected, currentStages + race.number_of_stages);
    selected.pop();
  }
  
  // Try skipping
  searchMaxStages(startIndex + 1, selected, currentStages);
}

searchMaxStages(0, [], 1); // Start with 1 stage from initialPro

console.log("Maximum non-overlapping Pro stages possible:", maxStages);
console.log("Races in the maximum set:");
const finalSet = [...bestSelected];
if (!finalSet.some(r => r.id === 26)) {
  finalSet.push(initialPro[0]);
}
finalSet.sort((a, b) => a.start_date.localeCompare(b.start_date)).forEach(r => {
  console.log(`  ${r.start_date} - ${r.end_date} | ID: ${r.id} | ${r.name} | Stages: ${r.number_of_stages}`);
});

db.close();
