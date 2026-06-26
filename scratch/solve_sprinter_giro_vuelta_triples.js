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

const wtCobbles = [15, 21, 45, 46, 25, 27];
const proCobbles = [70, 72, 79, 87, 93];

function solveProgram(programId, wtFixedIds, proFixedIds, targetWt, targetPro, excludeWtIds, excludeProIds) {
  const baseWt = wtFixedIds.map(id => races.find(r => r.id === id));
  const basePro = proFixedIds.map(id => races.find(r => r.id === id));
  
  // Cross-check overlaps in base
  const allBase = [...baseWt, ...basePro];
  for (let i = 0; i < allBase.length; i++) {
    for (let j = i + 1; j < allBase.length; j++) {
      if (overlaps(allBase[i], allBase[j])) {
        console.log(`Overlap in base: ${allBase[i].name} and ${allBase[j].name}`);
        return null;
      }
    }
  }
  
  const currentWtStages = baseWt.reduce((sum, r) => sum + r.number_of_stages, 0);
  const currentProStages = basePro.reduce((sum, r) => sum + r.number_of_stages, 0);
  
  if (currentWtStages > targetWt || currentProStages > targetPro) {
    console.log(`Base exceeds target for Prog ${programId}: WT ${currentWtStages} > ${targetWt} or Pro ${currentProStages} > ${targetPro}`);
    return null;
  }
  
  const neededWt = targetWt - currentWtStages;
  const neededPro = targetPro - currentProStages;
  
  const wtCandidates = races.filter(r => {
    if ([5, 8].includes(r.category_id)) return false;
    if (wtFixedIds.includes(r.id)) return false;
    if (excludeWtIds.includes(r.id)) return false;
    // Keep Brugge (20) and Gent-Wevelgem (45) since they are sprinter classics, but exclude monuments if they overlap
    if ([15, 21, 25, 27].includes(r.id)) return false; // exclude core cobble classics except Brugge (20) & Wevelgem (45)
    if (r.id === 55 || r.id === 23 || r.id === 60) return false; // Tour, Giro, Vuelta
    return !hasOverlap(baseWt, r);
  });
  
  const wtSol = solveIntervalSubsetSum(wtCandidates, neededWt);
  if (!wtSol) {
    console.log(`WT DP failed for Prog ${programId} (needed WT: ${neededWt})`);
    return null;
  }
  
  const fullWt = [...baseWt, ...wtSol];
  
  const proCandidates = races.filter(r => {
    if (![5, 8].includes(r.category_id)) return false;
    if (proFixedIds.includes(r.id)) return false;
    if (excludeProIds.includes(r.id)) return false;
    if (proCobbles.filter(id => id !== 93).includes(r.id)) return false; // exclude pro cobbles except Paris-Tours (93) if needed
    if (hasOverlap(fullWt, r)) return false;
    return !hasOverlap(basePro, r);
  });
  
  const proSol = solveIntervalSubsetSum(proCandidates, neededPro);
  if (!proSol) {
    console.log(`Pro DP failed for Prog ${programId} (needed Pro: ${neededPro})`);
    return null;
  }
  
  return {
    wt: fullWt,
    pro: [...basePro, ...proSol]
  };
}

console.log("Solving Program 19...");
// 19: Giro (23), Vuelta (60), TDU (1), UAE (10), Copenhagen (32), Romandie (52), Pologne (57), Strade (16), Tirreno (18), MSR (17), Catalunya (50), AGR (29), Fleche (30), LBL (28), Cyclassics (58), San Sebastian (56), Guangxi (65)
const p19WtFixed = [23, 60, 1, 10, 32, 52, 57, 16, 18, 17, 58, 56, 65];
const p19ProFixed = [77];
const sol19 = solveProgram(19, p19WtFixed, p19ProFixed, 104, 21, [55], []);

console.log("\nSolving Program 20...");
// 20: Giro (23), Vuelta (60), Copenhagen (32), Strade (16), Paris-Nice (19), MSR (17), Cyclassics (58), Guangxi (65)
// Pro: AlUla (122), Valencia (5), Scheldeprijs (77)
const p20WtFixed = [23, 60, 32, 16, 19, 17, 58, 65];
const p20ProFixed = [122, 5, 77];
const sol20 = solveProgram(20, p20WtFixed, p20ProFixed, 104, 21, [55, 1, 10, 52, 57], []);

console.log("\nSolving Program 21...");
// 21: Giro (23), Vuelta (60)
// Pro early preps: Valencia (5), Almeria (8), Figueira (9), Algarve (3), Scheldeprijs (77)
const p21WtFixed = [23, 60];
const p21ProFixed = [77, 5, 8, 9, 3];
const sol21 = solveProgram(21, p21WtFixed, p21ProFixed, 65, 80, [55], []);

if (sol19 && sol20 && sol21) {
  console.log("\nALL PROGRAMS SOLVED SUCCESSFULLY!");
  
  function printSolution(name, sol) {
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
  }
  
  printSolution("Program 19", sol19);
  printSolution("Program 20", sol20);
  printSolution("Program 21", sol21);
  
  function getIds(sol) {
    return sol.wt.map(r => r.id).concat(sol.pro.map(r => r.id)).sort((a, b) => a - b);
  }
  
  console.log("\nRebuild arrays:");
  console.log(`const prog19Races = [${getIds(sol19).join(', ')}];`);
  console.log(`const prog20Races = [${getIds(sol20).join(', ')}];`);
  console.log(`const prog21Races = [${getIds(sol21).join(', ')}];`);
}
