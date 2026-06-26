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

function solveMinCostDP(candidates, targetStages, customWeights) {
  if (targetStages === 0) return { races: [], cost: 0 };
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
  
  const dp = Array.from({ length: N + 1 }, () => new Array(targetStages + 1).fill(Infinity));
  const choice = Array.from({ length: N + 1 }, () => new Array(targetStages + 1).fill(false));
  
  dp[N][0] = 0;
  
  for (let i = N - 1; i >= 0; i--) {
    const stages = sorted[i].number_of_stages;
    const nextI = nextCompat[i];
    const cost = customWeights[sorted[i].id] || 0;
    
    for (let s = 0; s <= targetStages; s++) {
      let minCost = dp[i + 1][s];
      choice[i][s] = false;
      
      if (s >= stages) {
        const takeCost = dp[nextI][s - stages] + cost;
        if (takeCost < minCost) {
          minCost = takeCost;
          choice[i][s] = true;
        }
      }
      dp[i][s] = minCost;
    }
  }
  
  if (dp[0][targetStages] === Infinity) return null;
  
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
  return {
    races: selected,
    cost: dp[0][targetStages]
  };
}

function solveProgram(wtFixedIds, proFixedIds, customWeights, minWt, maxWt, minPro, maxPro, minTotal, maxTotal) {
  const baseWt = wtFixedIds.map(id => races.find(r => r.id === id));
  const basePro = proFixedIds.map(id => races.find(r => r.id === id));
  
  const currentWt = baseWt.reduce((sum, r) => sum + r.number_of_stages, 0);
  const currentPro = basePro.reduce((sum, r) => sum + r.number_of_stages, 0);
  
  const excludedRaces = [15, 21, 45, 46, 25, 27, 70, 72, 79, 87, 93, 23, 55, 60];
  
  const wtCandidates = races.filter(r => {
    if ([5, 8].includes(r.category_id)) return false;
    if (wtFixedIds.includes(r.id)) return false;
    if (excludedRaces.includes(r.id)) return false;
    if (hasOverlap(basePro, r)) return false;
    return !hasOverlap(baseWt, r);
  });
  
  let bestSol = null;
  let minCost = Infinity;
  
  for (let targetWt = minWt - currentWt; targetWt <= maxWt - currentWt; targetWt++) {
    if (targetWt < 0) continue;
    
    const wtSol = solveMinCostDP(wtCandidates, targetWt, customWeights);
    if (!wtSol) continue;
    
    const combinedWt = baseWt.concat(wtSol.races);
    
    const proCandidates = races.filter(r => {
      if (![5, 8].includes(r.category_id)) return false;
      if (proFixedIds.includes(r.id)) return false;
      if (excludedRaces.includes(r.id)) return false;
      if (hasOverlap(combinedWt, r)) return false;
      return !hasOverlap(basePro, r);
    });
    
    for (let targetPro = minPro - currentPro; targetPro <= maxPro - currentPro; targetPro++) {
      if (targetPro < 0) continue;
      const totalStages = (currentWt + targetWt) + (currentPro + targetPro);
      if (totalStages >= minTotal && totalStages <= maxTotal) {
        const proSol = solveMinCostDP(proCandidates, targetPro, customWeights);
        if (proSol) {
          const cost = wtSol.cost + proSol.cost;
          if (cost < minCost) {
            minCost = cost;
            bestSol = {
              wt: combinedWt,
              pro: basePro.concat(proSol.races),
              cost
            };
          }
        }
      }
    }
  }
  
  return bestSol;
}

const wtFixed = [17, 28, 29, 30, 56, 64];
const weights = {};
races.forEach(r => { weights[r.id] = 0; });

console.log("Solving relaxed P27...");
const sol = solveProgram(wtFixed, [], weights, 40, 55, 95, 105, 145, 155);
if (sol) {
  console.log("Solvable!");
  console.log(`WT days: ${sol.wt.reduce((sum,r)=>sum+r.number_of_stages,0)}`);
  console.log(`Pro days: ${sol.pro.reduce((sum,r)=>sum+r.number_of_stages,0)}`);
  console.log(`Total days: ${sol.wt.reduce((sum,r)=>sum+r.number_of_stages,0) + sol.pro.reduce((sum,r)=>sum+r.number_of_stages,0)}`);
} else {
  console.log("Still unsolvable!");
}
