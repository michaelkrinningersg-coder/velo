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

db.close();

// Read existing mappings from CSV (including programs 1-27)
const csvPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/data/csv/race_program_races.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');
const csvLines = csvContent.split('\n').map(l => l.trim()).filter(Boolean);
const csvHeaders = csvLines[0].split(',');
const raceIdIdx = csvHeaders.indexOf('race_id');

const baseCounts = {};
races.forEach(r => {
  baseCounts[r.id] = 0;
});
csvLines.slice(1).forEach(line => {
  const cells = line.split(',');
  const raceId = parseInt(cells[raceIdIdx], 10);
  if (baseCounts[raceId] !== undefined) {
    baseCounts[raceId]++;
  }
});

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
  
  const currentWt = baseWt.reduce((sum, r) => sum + r.number_of_stages, 0);
  const currentPro = basePro.reduce((sum, r) => sum + r.number_of_stages, 0);
  
  // Excluded cobbles and GTs
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

// Fixed WT races (Ardennes, Lombardia, MSR, San Sebastian)
const wtFixed = [17, 28, 29, 30, 56, 64];

// Initialize weights
// We add +10 penalty to one-day candidate races to prioritize stage races
const weights = {};
races.forEach(r => {
  let penalty = 0;
  // If it's not a stage race and it's not one of the fixed races, penalize it
  if (!r.is_stage_race && !wtFixed.includes(r.id)) {
    penalty = 10;
  }
  weights[r.id] = baseCounts[r.id] + penalty;
});

console.log("Solving Program 28...");
// P28 WT: 43-61 stages, Pro: 67-89 stages, Total: 123-137 stages
const sol28 = solveProgram(wtFixed, [], weights, 43, 61, 67, 89, 123, 137);
if (!sol28) {
  console.log("Could not solve Program 28!");
  process.exit(1);
}

// Apply overlap penalty of +100 to all races selected in P28 (except fixed ones)
const usedIn28 = sol28.wt.concat(sol28.pro).map(r => r.id).filter(id => !wtFixed.includes(id));
usedIn28.forEach(id => {
  weights[id] += 100;
});

console.log("Solving Program 29...");
// P29 WT: 43-61 stages, Pro: 67-89 stages, Total: 123-137 stages
const sol29 = solveProgram(wtFixed, [], weights, 43, 61, 67, 89, 123, 137);
if (!sol29) {
  console.log("Could not solve Program 29!");
  process.exit(1);
}

// Apply overlap penalty of +100 to all races selected in P29 (except fixed ones)
const usedIn29 = sol29.wt.concat(sol29.pro).map(r => r.id).filter(id => !wtFixed.includes(id));
usedIn29.forEach(id => {
  weights[id] += 100;
});

console.log("Solving Program 30...");
// P30 WT: 64-74 stages, Pro: 76-81 stages, Total: 143-157 stages
const sol30 = solveProgram(wtFixed, [], weights, 64, 74, 76, 81, 143, 157);
if (!sol30) {
  console.log("Could not solve Program 30!");
  process.exit(1);
}

console.log("All solved!");

let outputText = '';
function printSolution(name, sol) {
  outputText += `\n=== ${name} ===\n`;
  outputText += `WT Races:\n`;
  let wtTotal = 0;
  sol.wt.sort((a,b)=>a.start_date.localeCompare(b.start_date)).forEach(r => {
    outputText += `  ${r.start_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages} | Cost: ${baseCounts[r.id]} | StageRace: ${r.is_stage_race}\n`;
    wtTotal += r.number_of_stages;
  });
  outputText += `Pro Races:\n`;
  let proTotal = 0;
  sol.pro.sort((a,b)=>a.start_date.localeCompare(b.start_date)).forEach(r => {
    outputText += `  ${r.start_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages} | Cost: ${baseCounts[r.id]} | StageRace: ${r.is_stage_race}\n`;
    proTotal += r.number_of_stages;
  });
  outputText += `Total Days: WT: ${wtTotal}, Pro: ${proTotal}, Total: ${wtTotal + proTotal}\n`;
  outputText += `IDs: [${sol.wt.map(r=>r.id).concat(sol.pro.map(r=>r.id)).sort((a,b)=>a-b).join(', ')}]\n`;
}

printSolution("Program 28", sol28);
printSolution("Program 29", sol29);
printSolution("Program 30", sol30);

// Compute overlaps of non-fixed races
const ids28 = sol28.wt.concat(sol28.pro).map(r => r.id).filter(id => !wtFixed.includes(id));
const ids29 = sol29.wt.concat(sol29.pro).map(r => r.id).filter(id => !wtFixed.includes(id));
const ids30 = sol30.wt.concat(sol30.pro).map(r => r.id).filter(id => !wtFixed.includes(id));

const overlap28_29 = ids28.filter(id => ids29.includes(id));
const overlap28_30 = ids28.filter(id => ids30.includes(id));
const overlap29_30 = ids29.filter(id => ids30.includes(id));

outputText += `\n=== Overlap Analysis (excluding fixed races) ===\n`;
outputText += `Overlap 28 & 29: count = ${overlap28_29.length}, IDs: [${overlap28_29.join(', ')}]\n`;
outputText += `Overlap 28 & 30: count = ${overlap28_30.length}, IDs: [${overlap28_30.join(', ')}]\n`;
outputText += `Overlap 29 & 30: count = ${overlap29_30.length}, IDs: [${overlap29_30.join(', ')}]\n`;

fs.writeFileSync('scratch/solution_output_v4.txt', outputText, 'utf8');
console.log("Wrote full solution output to scratch/solution_output_v4.txt");
