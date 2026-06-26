const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const dbPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/assets/world_data.db';
const db = new Database(dbPath);

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
const proCobblesPool = [70, 72, 79, 87, 93];

function overlapFraction(a, b) {
  const sect = a.filter(x => b.includes(x));
  return sect.length / Math.min(a.length, b.length);
}

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

// Find a program calendar using DP and ranges
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
  
  const wtCandidates = races.filter(r => {
    if ([5, 8].includes(r.category_id)) return false; // exclude pro
    if (wtFixedIds.includes(r.id)) return false;
    if (excludeWtIds.includes(r.id)) return false;
    if (r.id === 23 || r.id === 55 || r.id === 60) return false; // no GT
    if (hasOverlap(basePro, r)) return false;
    return !hasOverlap(baseWt, r);
  });
  
  // Prioritize candidates with low assignment counts
  wtCandidates.sort((a, b) => assignmentCounts[a.id] - assignmentCounts[b.id]);
  
  const wtSols = [];
  function recurseWt(idx, current, stages) {
    if (wtSols.length >= 100) return;
    if (stages >= minWt && stages <= maxWt) {
      wtSols.push([...current]);
    }
    if (stages > maxWt || idx >= wtCandidates.length) return;
    
    // take
    const r = wtCandidates[idx];
    if (!hasOverlap(current, r)) {
      recurseWt(idx + 1, [...current, r], stages + r.number_of_stages);
    }
    // skip
    recurseWt(idx + 1, current, stages);
  }
  recurseWt(0, baseWt, currentWt);
  
  if (wtSols.length === 0) return null;
  
  for (const wtSol of wtSols) {
    const wtStages = wtSol.reduce((sum, r) => sum + r.number_of_stages, 0);
    
    const proCandidates = races.filter(r => {
      if (![5, 8].includes(r.category_id)) return false;
      if (proFixedIds.includes(r.id)) return false;
      if (excludeProIds.includes(r.id)) return false;
      if (hasOverlap(wtSol, r)) return false;
      return !hasOverlap(basePro, r);
    });
    
    // Prioritize candidates with low assignment counts
    proCandidates.sort((a, b) => assignmentCounts[a.id] - assignmentCounts[b.id]);
    
    const currentPro = basePro.reduce((sum, r) => sum + r.number_of_stages, 0);
    
    let foundPro = null;
    function recursePro(idx, current, stages) {
      if (foundPro) return;
      if (stages >= minPro && stages <= maxPro) {
        const totalStages = wtStages + stages;
        if (totalStages >= minTotal && totalStages <= maxTotal) {
          foundPro = [...current];
        }
        return;
      }
      if (stages > maxPro || idx >= proCandidates.length) return;
      
      // take
      const r = proCandidates[idx];
      if (!hasOverlap(current, r)) {
        recursePro(idx + 1, [...current, r], stages + r.number_of_stages);
      }
      // skip
      recursePro(idx + 1, current, stages);
    }
    recursePro(0, basePro, currentPro);
    
    if (foundPro) {
      return {
        wt: wtSol,
        pro: foundPro
      };
    }
  }
  return null;
}

console.log("Searching for compatible Cobble subsets...");
let found = false;

for (const c22 of cobbleSubsets) {
  for (const c23 of cobbleSubsets) {
    if (overlapFraction(c22, c23) > 0.5) continue;
    
    for (const c24 of cobbleSubsets) {
      if (overlapFraction(c22, c24) > 0.5) continue;
      if (overlapFraction(c23, c24) > 0.5) continue;
      
      // Try to solve the calendars
      // P22: 125 days (120-130), 70% WT (±5% -> 65-75% WT -> 78-97 WT days, 30-45 Pro days)
      const sol22 = solveProgram(
        [...wtCobbles, 1, 54, 20], // fixed WT (TDU, Suisse, Brugge)
        [...c22, 22, 11],          // fixed Pro (Cobbles, Muscat, Oman)
        [10, 4],                   // exclude WT used in 23/24
        [5, 8, 9, 2, 3, 12],       // exclude Pro used in 23/24
        78, 97,                    // WT range
        30, 45,                    // Pro range
        120, 130                   // total range
      );
      
      if (!sol22) continue;
      
      // P23: 125 days (120-130), 70% WT (±5% -> 65-75% WT -> 78-97 WT days, 30-45 Pro days)
      const sol23 = solveProgram(
        [...wtCobbles, 10],        // fixed WT (UAE)
        [...c23, 5, 8, 9, 106, 110], // fixed Pro (Cobbles, Valencia, Almeria, Figueira, Mayenne, Slovenia)
        [1, 54, 20, 4],            // exclude WT used in 22/24
        [22, 11, 2, 3, 12],        // exclude Pro used in 22/24
        78, 97,
        30, 45,
        120, 130
      );
      
      if (!sol23) continue;
      
      // P24: 150 days (145-155), 20% WT (±5% -> 15-25% WT -> 22-38 WT days, 109-131 Pro days)
      const sol24 = solveProgram(
        [...wtCobbles, 4],         // fixed WT (Cadel)
        [...c24, 2, 3, 12, 103],   // fixed Pro (Cobbles, Surf Coast, Algarve, Andalucia, Turkey)
        [1, 54, 20, 10],           // exclude WT used in 22/23
        [22, 11, 5, 8, 9, 106, 110], // exclude Pro used in 22/23
        22, 38,
        109, 131,
        145, 155
      );
      
      if (!sol24) continue;
      
      console.log("\nFOUND SOLUTION TRIPLE!");
      console.log("P22 Cobbles:", JSON.stringify(c22));
      console.log("P23 Cobbles:", JSON.stringify(c23));
      console.log("P24 Cobbles:", JSON.stringify(c24));
      
      function printSolution(name, sol) {
        console.log(`\n=== ${name} ===`);
        console.log("WT Races:");
        let wtTotal = 0;
        sol.wt.sort((a,b)=>a.start_date.localeCompare(b.start_date)).forEach(r => {
          console.log(`  ${r.start_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages} | Cost: ${assignmentCounts[r.id]}`);
          wtTotal += r.number_of_stages;
        });
        console.log("Pro Races:");
        let proTotal = 0;
        sol.pro.sort((a,b)=>a.start_date.localeCompare(b.start_date)).forEach(r => {
          console.log(`  ${r.start_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages} | Cost: ${assignmentCounts[r.id]}`);
          proTotal += r.number_of_stages;
        });
        console.log(`Total Days: WT: ${wtTotal}, Pro: ${proTotal}, Total: ${wtTotal + proTotal}`);
        console.log(`IDs: [${sol.wt.map(r=>r.id).concat(sol.pro.map(r=>r.id)).sort((a,b)=>a-b).join(', ')}]`);
      }
      
      printSolution("Program 22", sol22);
      printSolution("Program 23", sol23);
      printSolution("Program 24", sol24);
      
      found = true;
      break;
    }
    if (found) break;
  }
  if (found) break;
}

if (!found) {
  console.log("Could not find a valid triple with disjoint preps and overlap fraction <= 0.5.");
}
