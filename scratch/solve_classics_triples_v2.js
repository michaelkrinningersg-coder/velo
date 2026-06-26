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

// Count current assignments in database (programs 1-21)
const assignmentCounts = {};
races.forEach(r => {
  const row = db.prepare('SELECT COUNT(*) as count FROM race_program_races WHERE race_id = ?').get(r.id);
  assignmentCounts[r.id] = row ? row.count : 0;
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

function solveMinCostIntervalSubsetSum(candidates, targetStages) {
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
    const cost = assignmentCounts[sorted[i].id] || 0;
    
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

const wtCobbles = [15, 21, 45, 46, 25, 27];
const proCobblesPool = [70, 72, 79, 87, 93];

function getSubsets(arr, size) {
  const result = [];
  function f(idx, current) {
    if (current.length === size) {
      result.push([...current]);
      return;
    }
    if (idx >= arr.length) return;
    f(idx + 1, [...current, arr[idx]]);
    f(idx + 1, current);
  }
  f(0, []);
  return result;
}

const cobbleSubsets = [...getSubsets(proCobblesPool, 3), ...getSubsets(proCobblesPool, 4)];

function overlapFraction(a, b) {
  const sect = a.filter(x => b.includes(x));
  return sect.length / Math.min(a.length, b.length);
}

// Find a program calendar
function solveProgram(wtFixedIds, proFixedIds, excludeWtIds, excludeProIds, minWt, maxWt, minPro, maxPro, minTotal, maxTotal) {
  const baseWt = wtFixedIds.map(id => races.find(r => r.id === id));
  const basePro = proFixedIds.map(id => races.find(r => r.id === id));
  
  // Base overlaps check
  const allBase = [...baseWt, ...basePro];
  for (let i = 0; i < allBase.length; i++) {
    for (let j = i + 1; j < allBase.length; j++) {
      if (overlaps(allBase[i], allBase[j])) return null;
    }
  }
  
  const currentWt = baseWt.reduce((sum, r) => sum + r.number_of_stages, 0);
  const currentPro = basePro.reduce((sum, r) => sum + r.number_of_stages, 0);
  
  const wtCandidates = races.filter(r => {
    if ([5, 8].includes(r.category_id)) return false; // exclude pro
    if (wtFixedIds.includes(r.id)) return false;
    if (excludeWtIds.includes(r.id)) return false;
    if (r.id === 23 || r.id === 55 || r.id === 60) return false; // no GT
    if (hasOverlap(basePro, r)) return false;
    return !hasOverlap(baseWt, r);
  });
  
  let bestSol = null;
  let minCost = Infinity;
  
  // Try all possible target WT stages
  for (let targetWt = minWt - currentWt; targetWt <= maxWt - currentWt; targetWt++) {
    if (targetWt < 0) continue;
    
    // Find optimal WT candidate set of exactly targetWt stages
    const wtSol = solveMinCostIntervalSubsetSum(wtCandidates, targetWt);
    if (!wtSol) continue;
    
    const combinedWt = baseWt.concat(wtSol.races);
    
    // Filter Pro candidates that don't overlap with the selected WT races
    const proCandidates = races.filter(r => {
      if (![5, 8].includes(r.category_id)) return false;
      if (proFixedIds.includes(r.id)) return false;
      if (excludeProIds.includes(r.id)) return false;
      if (hasOverlap(combinedWt, r)) return false;
      return !hasOverlap(basePro, r);
    });
    
    // Try all target Pro stages that make the total stages within range
    for (let targetPro = minPro - currentPro; targetPro <= maxPro - currentPro; targetPro++) {
      if (targetPro < 0) continue;
      const totalStages = (currentWt + targetWt) + (currentPro + targetPro);
      if (totalStages >= minTotal && totalStages <= maxTotal) {
        const proSol = solveMinCostIntervalSubsetSum(proCandidates, targetPro);
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

console.log("Pre-calculating solutions for Program 22...");
const sols22 = [];
cobbleSubsets.forEach(c22 => {
  const otherCobbles22 = proCobblesPool.filter(id => !c22.includes(id));
  const sol = solveProgram(
    [...wtCobbles, 1, 54, 20], // fixed WT (TDU, Suisse, Brugge)
    [...c22, 22, 11],          // fixed Pro (Muscat, Oman)
    [],                        // NO WT exclusions
    otherCobbles22,            // Exclude non-selected Pro cobbles
    78, 97,                    // WT range
    30, 45,                    // Pro range
    120, 130                   // total range
  );
  if (sol) {
    sols22.push({ c22, sol });
  }
});
console.log(`Found ${sols22.length} solutions for Program 22.`);

console.log("Pre-calculating solutions for Program 23...");
const sols23 = [];
cobbleSubsets.forEach(c23 => {
  const otherCobbles23 = proCobblesPool.filter(id => !c23.includes(id));
  const sol = solveProgram(
    [...wtCobbles, 10],        // fixed WT (UAE)
    [...c23, 5, 8, 9, 106, 110], // fixed Pro (Valencia, Almeria, Figueira, Mayenne, Slovenia)
    [],                        // NO WT exclusions
    otherCobbles23,            // Exclude non-selected Pro cobbles
    78, 97,
    30, 45,
    120, 130
  );
  if (sol) {
    sols23.push({ c23, sol });
  }
});
console.log(`Found ${sols23.length} solutions for Program 23.`);

console.log("Pre-calculating solutions for Program 24...");
const sols24 = [];
cobbleSubsets.forEach(c24 => {
  const otherCobbles24 = proCobblesPool.filter(id => !c24.includes(id));
  for (const p24PrepId of [3, 12]) {
    const sol = solveProgram(
      [...wtCobbles, 4],         // fixed WT (Cadel)
      [...c24, 2, p24PrepId, 103], // fixed Pro (Surf Coast, Algarve/Andalucia, Turkey)
      [],                        // NO WT exclusions
      otherCobbles24,            // Exclude non-selected Pro cobbles
      22, 38,
      109, 131,
      145, 155
    );
    if (sol) {
      sols24.push({ c24, p24PrepId, sol });
    }
  }
});
console.log(`Found ${sols24.length} solutions for Program 24.`);

console.log("Combining solutions and filtering for minimal overlap...");
let foundCount = 0;
let outputText = '';

for (const entry22 of sols22) {
  for (const entry23 of sols23) {
    const overlap22_23 = overlapFraction(entry22.c22, entry23.c23);
    if (overlap22_23 > 0.75) continue; // Allow up to 3 overlapping races in size 4
    
    for (const entry24 of sols24) {
      if (overlapFraction(entry22.c22, entry24.c24) > 0.75) continue;
      if (overlapFraction(entry23.c23, entry24.c24) > 0.75) continue;
      
      outputText += `\nSOLUTION FOUND!\n`;
      outputText += `P22 Cobbles: ${JSON.stringify(entry22.c22)}\n`;
      outputText += `P23 Cobbles: ${JSON.stringify(entry23.c23)}\n`;
      outputText += `P24 Cobbles: ${JSON.stringify(entry24.c24)}\n`;
      
      function printSolution(name, sol) {
        outputText += `\n=== ${name} ===\n`;
        outputText += `WT Races:\n`;
        let wtTotal = 0;
        sol.wt.sort((a,b)=>a.start_date.localeCompare(b.start_date)).forEach(r => {
          outputText += `  ${r.start_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages} | Cost: ${assignmentCounts[r.id]}\n`;
          wtTotal += r.number_of_stages;
        });
        outputText += `Pro Races:\n`;
        let proTotal = 0;
        sol.pro.sort((a,b)=>a.start_date.localeCompare(b.start_date)).forEach(r => {
          outputText += `  ${r.start_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages} | Cost: ${assignmentCounts[r.id]}\n`;
          proTotal += r.number_of_stages;
        });
        outputText += `Total Days: WT: ${wtTotal}, Pro: ${proTotal}, Total: ${wtTotal + proTotal}\n`;
        outputText += `IDs: [${sol.wt.map(r=>r.id).concat(sol.pro.map(r=>r.id)).sort((a,b)=>a-b).join(', ')}]\n`;
      }
      
      printSolution("Program 22", entry22.sol);
      printSolution("Program 23", entry23.sol);
      printSolution("Program 24", entry24.sol);
      
      foundCount++;
      if (foundCount >= 3) {
        break;
      }
    }
    if (foundCount >= 3) break;
  }
  if (foundCount >= 3) break;
}

if (foundCount === 0) {
  outputText = "Could not find any solution triple under these constraints.";
}

fs.writeFileSync('scratch/solution_output.txt', outputText, 'utf8');
console.log("Wrote full solution output to scratch/solution_output.txt");
