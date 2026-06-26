const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const dbPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/assets/world_data.db';
const db = new Database(dbPath);
const fs = require('fs');

const races = db.prepare(`
  SELECT r.id, r.name, r.category_id, cat.name AS cat_name, r.start_date, r.end_date, r.number_of_stages, r.is_stage_race
  FROM races r
  JOIN race_categories cat ON cat.id = r.category_id
  ORDER BY r.start_date ASC
`).all();

// Count current assignments in database (programs 1-24)
const baseCounts = {};
races.forEach(r => {
  const row = db.prepare('SELECT COUNT(*) as count FROM race_program_races WHERE race_id = ?').get(r.id);
  baseCounts[r.id] = row ? row.count : 0;
});

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

// Solve min cost DP with custom weights
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
    const cost = customWeights[sorted[i].id];
    
    for (let s = 0; s <= targetStages; s++) {
      // Option 1: Skip
      let minCost = dp[i + 1][s];
      choice[i][s] = false;
      
      // Option 2: Take
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

// Find a program calendar using custom weights
function solveProgram(wtFixedIds, proFixedIds, customWeights, minWt, maxWt, minPro, maxPro, minTotal, maxTotal) {
  const baseWt = wtFixedIds.map(id => races.find(r => r.id === id));
  const basePro = proFixedIds.map(id => races.find(r => r.id === id));
  
  // Base overlaps check
  const allBase = [...baseWt, ...basePro];
  for (let i = 0; i < allBase.length; i++) {
    for (let j = i + 1; j < allBase.length; j++) {
      if (overlaps(allBase[i], allBase[j])) {
        console.log(`Base overlap detected: ${allBase[i].name} and ${allBase[j].name}`);
        return null;
      }
    }
  }
  
  const currentWt = baseWt.reduce((sum, r) => sum + r.number_of_stages, 0);
  const currentPro = basePro.reduce((sum, r) => sum + r.number_of_stages, 0);
  
  // Excluded cobbles (15, 21, 45, 46, 25, 27, 70, 72, 79, 87, 93) and GTs (23, 55, 60)
  const excludedRaces = [15, 21, 45, 46, 25, 27, 70, 72, 79, 87, 93, 23, 55, 60];
  
  const wtCandidates = races.filter(r => {
    if ([5, 8].includes(r.category_id)) return false; // exclude pro
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

// Fixed WT races for 25, 26, 27 (Ardennes, Lombardia, MSR, San Sebastian)
const wtFixed = [17, 28, 29, 30, 56, 64];
const proFixed = [];

// Initialize weights with base assignment counts (plus a small penalty for high baseline to prioritize under-assigned)
const weights = {};
races.forEach(r => {
  weights[r.id] = baseCounts[r.id];
});

console.log("Solving Program 25...");
const sol25 = solveProgram(wtFixed, proFixed, weights, 45, 58, 72, 85, 125, 135);
if (!sol25) {
  console.log("Could not solve Program 25!");
  process.exit(1);
}

// Apply penalty of +100 to all races selected in P25 (except fixed ones)
const usedIn25 = sol25.wt.concat(sol25.pro).map(r => r.id).filter(id => !wtFixed.includes(id));
usedIn25.forEach(id => {
  weights[id] += 100;
});

console.log("Solving Program 26...");
const sol26 = solveProgram(wtFixed, proFixed, weights, 45, 58, 72, 85, 125, 135);
if (!sol26) {
  console.log("Could not solve Program 26!");
  process.exit(1);
}

// Apply penalty of +100 to all races selected in P26 (except fixed ones)
const usedIn26 = sol26.wt.concat(sol26.pro).map(r => r.id).filter(id => !wtFixed.includes(id));
usedIn26.forEach(id => {
  weights[id] += 100;
});

console.log("Solving Program 27...");
// P27 WT: 64-74 stages, Pro: 76-81 stages, Total: 145-155 stages
const sol27 = solveProgram(wtFixed, proFixed, weights, 64, 74, 76, 81, 145, 155);
if (!sol27) {
  console.log("Could not solve Program 27!");
  process.exit(1);
}

console.log("All solved!");

let outputText = '';
function printSolution(name, sol) {
  outputText += `\n=== ${name} ===\n`;
  outputText += `WT Races:\n`;
  let wtTotal = 0;
  sol.wt.sort((a,b)=>a.start_date.localeCompare(b.start_date)).forEach(r => {
    outputText += `  ${r.start_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages} | Cost: ${baseCounts[r.id]}\n`;
    wtTotal += r.number_of_stages;
  });
  outputText += `Pro Races:\n`;
  let proTotal = 0;
  sol.pro.sort((a,b)=>a.start_date.localeCompare(b.start_date)).forEach(r => {
    outputText += `  ${r.start_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages} | Cost: ${baseCounts[r.id]}\n`;
    proTotal += r.number_of_stages;
  });
  outputText += `Total Days: WT: ${wtTotal}, Pro: ${proTotal}, Total: ${wtTotal + proTotal}\n`;
  outputText += `IDs: [${sol.wt.map(r=>r.id).concat(sol.pro.map(r=>r.id)).sort((a,b)=>a-b).join(', ')}]\n`;
}

printSolution("Program 25", sol25);
printSolution("Program 26", sol26);
printSolution("Program 27", sol27);

// Compute overlaps of non-fixed races
const ids25 = sol25.wt.concat(sol25.pro).map(r => r.id).filter(id => !wtFixed.includes(id));
const ids26 = sol26.wt.concat(sol26.pro).map(r => r.id).filter(id => !wtFixed.includes(id));
const ids27 = sol27.wt.concat(sol27.pro).map(r => r.id).filter(id => !wtFixed.includes(id));

const overlap25_26 = ids25.filter(id => ids26.includes(id));
const overlap25_27 = ids25.filter(id => ids27.includes(id));
const overlap26_27 = ids26.filter(id => ids27.includes(id));

outputText += `\n=== Overlap Analysis (excluding fixed races) ===\n`;
outputText += `Overlap 25 & 26: count = ${overlap25_26.length}, IDs: [${overlap25_26.join(', ')}]\n`;
outputText += `Overlap 25 & 27: count = ${overlap25_27.length}, IDs: [${overlap25_27.join(', ')}]\n`;
outputText += `Overlap 26 & 27: count = ${overlap26_27.length}, IDs: [${overlap26_27.join(', ')}]\n`;

fs.writeFileSync('scratch/solution_output_v3.txt', outputText, 'utf8');
console.log("Wrote full solution output to scratch/solution_output_v3.txt");
