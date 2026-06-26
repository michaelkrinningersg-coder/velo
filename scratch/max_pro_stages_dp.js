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

// DP function
function solveIntervalSubsetSum(candidates, targetStages) {
  const sorted = [...candidates].sort((a, b) => a.start_date.localeCompare(b.start_date));
  const N = sorted.length;
  
  const nextCompat = new Array(N);
  for (let i = 0; i < N; i++) {
    let nextIdx = N;
    for (let j = i + 1; j < N; j++) {
      if (sorted[j].start_date > sorted[i].end_date) {
        nextIdx = j;
        break;
      }
    }
    nextCompat[i] = nextIdx;
  }
  
  const dp = Array.from({ length: N + 1 }, () => new Array(targetStages + 1).fill(false));
  dp[N][0] = true;
  
  for (let i = N - 1; i >= 0; i--) {
    const stages = sorted[i].number_of_stages;
    const nextI = nextCompat[i];
    for (let s = 0; s <= targetStages; s++) {
      if (dp[i + 1][s]) {
        dp[i][s] = true;
      } else if (s >= stages && dp[nextI][s - stages]) {
        dp[i][s] = true;
      }
    }
  }
  return dp[0][targetStages];
}

console.log(`Checking ${wtSolutions.length} WT combinations...`);

wtSolutions.forEach((wtComb, wtIdx) => {
  const fullWt = [...initialWt, ...wtComb];
  const availablePro = candidatesPro.filter(r => !hasOverlap(fullWt, r));
  
  // Find max Pro stages (including 1 stage from Brabantse Pijl)
  // The availablePro pool doesn't include Brabantse Pijl, so we want to get target - 1 stages from availablePro.
  let maxPro = 1;
  for (let target = 100; target >= 50; target--) {
    if (solveIntervalSubsetSum(availablePro, target - 1)) {
      maxPro = target;
      break;
    }
  }
  
  console.log(`WT Comb ${wtIdx+1}: [${wtComb.map(r=>r.name).join(', ')}] -> Max Pro Stages = ${maxPro}`);
});

db.close();
