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

const candidatesWt = wtRaces.filter(r => {
  if (mandWtIds.includes(r.id)) return false;
  if (cobbleRaces.includes(r.id)) return false;
  return !hasOverlap(initialWt, r);
});

const candidatesPro = proRaces.filter(r => {
  if (mandProIds.includes(r.id)) return false;
  if (cobbleRaces.includes(r.id)) return false;
  return true;
});

// Find WT combinations summing to 6 additional stages:
const wtSolutions = [];
function searchWt12(index, currentList, currentStages) {
  if (currentStages === 6) {
    wtSolutions.push([...currentList]);
    return;
  }
  if (currentStages > 6 || index >= candidatesWt.length) return;

  const race = candidatesWt[index];
  if (!hasOverlap(currentList, race)) {
    currentList.push(race);
    searchWt12(index + 1, currentList, currentStages + race.number_of_stages);
    currentList.pop();
  }
  searchWt12(index + 1, currentList, currentStages);
}
searchWt12(0, [], 0);
console.log(`Found ${wtSolutions.length} WT combinations for Program 12.`);

// For each WT comb, find max Pro stages using a fast branch-and-bound
let absoluteMaxPro = 0;
let bestWtComb = null;
let bestProComb = null;

wtSolutions.forEach((wtComb, wtIdx) => {
  const fullWt = [...initialWt, ...wtComb];
  const availablePro = candidatesPro.filter(r => {
    if (hasOverlap(fullWt, r)) return false;
    return true;
  }).sort((a, b) => a.start_date.localeCompare(b.start_date));
  
  // Greedy lower bound
  const greedy = [...initialPro];
  let greedyStages = 1;
  availablePro.forEach(r => {
    if (!hasOverlap(greedy, r)) {
      greedy.push(r);
      greedyStages += r.number_of_stages;
    }
  });
  
  let localMax = greedyStages;
  let localBest = [...greedy];
  
  const remaining = [];
  let sum = 0;
  for (let i = availablePro.length - 1; i >= 0; i--) {
    sum += availablePro[i].number_of_stages;
    remaining[i] = sum;
  }
  
  function searchMax(idx, selected, current) {
    if (current > localMax) {
      localMax = current;
      localBest = [...selected];
    }
    if (idx >= availablePro.length) return;
    if (current + 1 + remaining[idx] <= localMax) return;
    
    const r = availablePro[idx];
    if (!hasOverlap(selected, r) && !hasOverlap(initialPro, r)) {
      selected.push(r);
      searchMax(idx + 1, selected, current + r.number_of_stages);
      selected.pop();
    }
    searchMax(idx + 1, selected, current);
  }
  
  searchMax(0, [], 1);
  
  console.log(`WT Comb ${wtIdx+1}/${wtSolutions.length} (${wtComb.map(r=>r.name).join(', ')}): max Pro stages = ${localMax}`);
  
  if (localMax > absoluteMaxPro) {
    absoluteMaxPro = localMax;
    bestWtComb = wtComb;
    bestProComb = localBest;
  }
});

console.log("\n=== Absolute Maximum Pro Stages Found ===");
console.log("Max Pro Stages:", absoluteMaxPro);
console.log("WT Comb:", bestWtComb ? bestWtComb.map(r=>r.name) : "None");
console.log("Pro Comb size:", bestProComb ? bestProComb.length : 0);

db.close();
