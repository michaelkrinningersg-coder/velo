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

// DP to find a subset of candidates that sums to targetStages
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

function searchProgram(wtFixed, proFixed, targetWt, targetPro, excludeWt, excludePro) {
  const baseWt = wtFixed.map(id => races.find(r => r.id === id));
  const basePro = proFixed.map(id => races.find(r => r.id === id));
  
  // check base overlaps
  const allBase = [...baseWt, ...basePro];
  for (let i = 0; i < allBase.length; i++) {
    for (let j = i + 1; j < allBase.length; j++) {
      if (overlaps(allBase[i], allBase[j])) {
        console.log(`Base overlap: ${allBase[i].name} and ${allBase[j].name}`);
        return null;
      }
    }
  }
  
  const currentWt = baseWt.reduce((sum, r) => sum + r.number_of_stages, 0);
  const currentPro = basePro.reduce((sum, r) => sum + r.number_of_stages, 0);
  
  const neededWt = targetWt - currentWt;
  const neededPro = targetPro - currentPro;
  
  if (neededWt < 0 || neededPro < 0) return null;
  
  const wtCandidates = races.filter(r => {
    if ([5, 8].includes(r.category_id)) return false; // exclude pro
    if (wtFixed.includes(r.id)) return false;
    if (excludeWt.includes(r.id)) return false;
    if (wtCobbles.includes(r.id)) return false;
    if (r.id === 23 || r.id === 55 || r.id === 60) return false; // Tour, Giro, Vuelta
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
    if (wtSols.length >= 100) return;
    
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
      if (![5, 8].includes(r.category_id)) return false; // only pro
      if (proFixed.includes(r.id)) return false;
      if (excludePro.includes(r.id)) return false;
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

function printSolution(name, sol) {
  if (!sol) {
    console.log(`${name}: NOT FOUND`);
    return;
  }
  console.log(`\n=== ${name} ===`);
  console.log("WT Races:");
  let wtTotal = 0;
  sol.wt.sort((a,b)=>a.start_date.localeCompare(b.start_date)).forEach(r => {
    console.log(`  ${r.start_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages}`);
    wtTotal += r.number_of_stages;
  });
  console.log("Pro Series Races:");
  let proTotal = 0;
  sol.pro.sort((a,b)=>a.start_date.localeCompare(b.start_date)).forEach(r => {
    console.log(`  ${r.start_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages}`);
    proTotal += r.number_of_stages;
  });
  console.log(`Total Days: WT: ${wtTotal}, Pro: ${proTotal}, Total: ${wtTotal + proTotal}`);
  console.log(`IDs: [${sol.wt.map(r=>r.id).concat(sol.pro.map(r=>r.id)).sort((a,b)=>a-b).join(', ')}]`);
}

console.log("Running search for P19...");
const sol19 = searchProgram([23, 60, 1, 10, 32], [77], 104, 21, [], []);
printSolution("Program 19", sol19);

console.log("\nRunning search for P20...");
// Let's use Romandie (52) excluded to make Giro prep different, and keep UAE (10) to help reach WT days.
// WT: [23, 60, 32] fixed. Exclude Romandie (52) [which is Giro prep in P19].
const sol20 = searchProgram([23, 60, 32], [122, 5, 77], 104, 21, [52], []);
printSolution("Program 20", sol20);

console.log("\nRunning search for P21...");
// 21: Giro (23), Vuelta (60)
// Pro early preps: Valencia (5), Almeria (8), Figueira (9), Algarve (3), Scheldeprijs (77)
const sol21 = searchProgram([23, 60], [77, 5, 8, 9, 3], 65, 80, [], []);
printSolution("Program 21", sol21);

