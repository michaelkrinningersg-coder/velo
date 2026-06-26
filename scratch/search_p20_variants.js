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
const proCobbles = [70, 72, 79, 87, 93];

// We want to try various exclusions for WT races to find a solution for P20
// P20 requires: Giro (23), Vuelta (60), Copenhagen Sprint (32), AlUla (122, Pro), Valencia (5, Pro), Scheldeprijs (77, Pro)
// Target WT: 104, Target Pro: 21

function searchP20(excludeWtList) {
  const baseWt = [23, 60, 32].map(id => races.find(r => r.id === id));
  const basePro = [122, 5, 77].map(id => races.find(r => r.id === id));
  
  const currentWt = baseWt.reduce((sum, r) => sum + r.number_of_stages, 0);
  const currentPro = basePro.reduce((sum, r) => sum + r.number_of_stages, 0);
  
  const targetWt = 104;
  const targetPro = 21;
  
  const neededWt = targetWt - currentWt;
  const neededPro = targetPro - currentPro;
  
  const wtCandidates = races.filter(r => {
    if ([5, 8].includes(r.category_id)) return false;
    if ([23, 60, 32].includes(r.id)) return false;
    if (excludeWtList.includes(r.id)) return false;
    if (wtCobbles.includes(r.id)) return false;
    if (r.id === 55) return false; // Tour de France
    if (hasOverlap(basePro, r)) return false;
    return !hasOverlap(baseWt, r);
  });
  
  const wtSols = [];
  function recurseWt(idx, current, stages) {
    if (stages === targetWt) {
      wtSols.push([...current]);
      return;
    }
    if (stages > targetWt || idx >= wtCandidates.length) return;
    if (wtSols.length >= 10) return; // just get a few solutions
    
    // skip
    recurseWt(idx + 1, current, stages);
    // take
    const r = wtCandidates[idx];
    if (!hasOverlap(current, r)) {
      recurseWt(idx + 1, [...current, r], stages + r.number_of_stages);
    }
  }
  recurseWt(0, baseWt, currentWt);
  
  if (wtSols.length === 0) return null;
  
  for (const wtSol of wtSols) {
    const proCandidates = races.filter(r => {
      if (![5, 8].includes(r.category_id)) return false;
      if ([122, 5, 77].includes(r.id)) return false;
      if (proCobbles.includes(r.id)) return false;
      if (hasOverlap(wtSol, r)) return false;
      return !hasOverlap(basePro, r);
    });
    
    const proSol = solveIntervalSubsetSum(proCandidates, neededPro);
    if (proSol) {
      return {
        wt: wtSol,
        pro: [...basePro, ...proSol]
      };
    }
  }
  return null;
}

// Let's test combinations of exclusions of [1, 10, 52, 57]
// We can exclude some of them but not all, to see which subsets yield a solution.
const candidatesToExclude = [1, 10, 52, 57];
// Generate power set
const subsets = [[]];
for (const item of candidatesToExclude) {
  const len = subsets.length;
  for (let i = 0; i < len; i++) {
    subsets.push([...subsets[i], item]);
  }
}

// Sort subsets by length descending (we want to exclude as many as possible)
subsets.sort((a, b) => b.length - a.length);

for (const subset of subsets) {
  const sol = searchP20(subset);
  if (sol) {
    console.log(`Found solution for P20 excluding: [${subset.join(', ')}]`);
  }
}
