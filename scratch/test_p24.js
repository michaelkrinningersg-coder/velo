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

const wtCobbles = [15, 21, 45, 46, 25, 27];

function findP24() {
  const wtFixedIds = [...wtCobbles, 4];
  const proFixedIds = [79, 87, 93, 2, 3, 12, 103];
  
  const baseWt = wtFixedIds.map(id => races.find(r => r.id === id));
  const basePro = proFixedIds.map(id => races.find(r => r.id === id));
  
  const currentWt = baseWt.reduce((sum, r) => sum + r.number_of_stages, 0);
  
  const wtCandidates = races.filter(r => {
    if ([5, 8].includes(r.category_id)) return false;
    if (wtFixedIds.includes(r.id)) return false;
    if ([1, 54, 20, 10].includes(r.id)) return false; // exclusions
    if (r.id === 23 || r.id === 55 || r.id === 60) return false;
    if (hasOverlap(basePro, r)) return false;
    return !hasOverlap(baseWt, r);
  });
  
  const wtSols = [];
  function recurseWt(idx, current, stages) {
    if (wtSols.length >= 100) return;
    if (stages >= 22 && stages <= 38) {
      wtSols.push([...current]);
    }
    if (stages > 38 || idx >= wtCandidates.length) return;
    
    // take
    const r = wtCandidates[idx];
    if (!hasOverlap(current, r)) {
      recurseWt(idx + 1, [...current, r], stages + r.number_of_stages);
    }
    // skip
    recurseWt(idx + 1, current, stages);
  }
  recurseWt(0, baseWt, currentWt);
  
  console.log(`Found ${wtSols.length} WT solutions for P24.`);
  
  for (const wtSol of wtSols) {
    const wtStages = wtSol.reduce((sum, r) => sum + r.number_of_stages, 0);
    
    const proCandidates = races.filter(r => {
      if (![5, 8].includes(r.category_id)) return false;
      if (proFixedIds.includes(r.id)) return false;
      if ([22, 11, 5, 8, 9, 106, 110].includes(r.id)) return false; // exclusions
      if (hasOverlap(wtSol, r)) return false;
      return !hasOverlap(basePro, r);
    });
    
    const currentPro = basePro.reduce((sum, r) => sum + r.number_of_stages, 0);
    
    // Find a Pro solution using DP
    // We try to find a solution for pro stages such that total is in [145, 155]
    // proStages must be in [109, 131]
    for (let targetPro = 109 - currentPro; targetPro <= 131 - currentPro; targetPro++) {
      if (wtStages + currentPro + targetPro >= 145 && wtStages + currentPro + targetPro <= 155) {
        const proSol = solveIntervalSubsetSum(proCandidates, targetPro);
        if (proSol) {
          console.log(`P24 SOLVED! WT Stages: ${wtStages}, Pro Stages: ${currentPro + targetPro}, Total: ${wtStages + currentPro + targetPro}`);
          return;
        }
      }
    }
  }
  console.log("P24 is UNSOLVABLE!");
}

findP24();
