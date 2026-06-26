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
  const choice = Array.from({ length: N + 1 }, () => new Array(targetStages + 1).fill(false));
  
  dp[N][0] = true;
  
  for (let i = N - 1; i >= 0; i--) {
    const stages = sorted[i].number_of_stages;
    const nextI = nextCompat[i];
    for (let s = 0; s <= targetStages; s++) {
      if (dp[i + 1][s]) {
        dp[i][s] = true;
        choice[i][s] = false;
      } else if (s >= stages && dp[nextI][s - stages]) {
        dp[i][s] = true;
        choice[i][s] = true;
      }
    }
  }
  
  if (!dp[0][targetStages]) return null;
  
  const selected = [];
  let currS = targetStages;
  let currI = 0;
  while (currI < N && currS > 0) {
    if (choice[currI][currS]) {
      selected.push(sorted[currI]);
      currS -= sorted[currI].number_of_stages;
      currI = nextCompat[currI];
    } else {
      currI += 1;
    }
  }
  return selected;
}

// Autumn classics lists
const wtAutumnIds = [56, 58, 61, 62, 63, 64];
const proAutumnIds = [84, 85, 86, 87, 89, 90, 91, 92, 93, 94, 96];
const allAutumnIds = [...wtAutumnIds, ...proAutumnIds];

function solveProgram(programId, wtFixedIds, proFixedIds, wtAutumnIds, proAutumnIds, targetWt, targetPro, excludeWtIds, excludeProIds) {
  const baseWt = [...wtFixedIds, ...wtAutumnIds].map(id => races.find(r => r.id === id));
  const basePro = [...proFixedIds, ...proAutumnIds].map(id => races.find(r => r.id === id));
  
  const currentWtStages = baseWt.reduce((sum, r) => sum + r.number_of_stages, 0);
  const currentProStages = basePro.reduce((sum, r) => sum + r.number_of_stages, 0);
  
  const neededWt = targetWt - currentWtStages;
  const neededPro = targetPro - currentProStages;
  
  console.log(`Program ${programId}: Current WT stages = ${currentWtStages}, needed = ${neededWt}`);
  console.log(`Program ${programId}: Current Pro stages = ${currentProStages}, needed = ${neededPro}`);
  
  const wtCandidates = races.filter(r => {
    if ([5, 8].includes(r.category_id)) return false;
    if (wtFixedIds.includes(r.id)) return false;
    if (excludeWtIds.includes(r.id)) return false;
    if (wtAutumnIds.includes(r.id)) return false;
    if (allAutumnIds.includes(r.id)) return false;
    if (r.id === 23 || r.id === 55 || r.id === 60) return false;
    return !hasOverlap(baseWt, r);
  });
  
  console.log(`WT candidates count: ${wtCandidates.length}`);
  const wtSol = solveIntervalSubsetSum(wtCandidates, neededWt);
  if (!wtSol) {
    console.log("WT DP solver failed!");
    return null;
  }
  console.log("WT DP solver succeeded!");
  
  const fullWt = [...baseWt, ...wtSol];
  
  const proCandidates = races.filter(r => {
    if (![5, 8].includes(r.category_id)) return false;
    if (proFixedIds.includes(r.id)) return false;
    if (excludeProIds.includes(r.id)) return false;
    if (allAutumnIds.includes(r.id)) return false;
    if (hasOverlap(fullWt, r)) return false;
    return !hasOverlap(basePro, r);
  });
  
  console.log(`Pro candidates count: ${proCandidates.length}`);
  const proSol = solveIntervalSubsetSum(proCandidates, neededPro);
  if (!proSol) {
    console.log("Pro DP solver failed!");
    return null;
  }
  console.log("Pro DP solver succeeded!");
}

solveProgram(13, [55, 23, 15, 21, 45, 46, 25, 27, 10, 53], [70, 72, 79, 87, 3], [62, 63], [90, 91, 92], 104, 20, [60], []);
