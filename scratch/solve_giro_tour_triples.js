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
    if (wtCobbles.includes(r.id)) return false; // exclude cobbles
    if (r.id === 23 || r.id === 55 || r.id === 60) return false; // Giro, Tour, Vuelta
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
    if (proCobbles.includes(r.id)) return false; // exclude cobbles
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

console.log("Solving Program 16...");
// 16: Giro (23), Tour (55)
// preps: Giro prep = Romandie (52), Tour prep = Dauphine (53)
// ardennes: AGR (29), Fleche (30), LBL (28)
// autumn: Lombardia (64), San Sebastian (56)
// spring: Tirreno (18), Strade (16), MSR (17)
// Italian autumn: Emilia (88), Bernocchi (90), Varesine (91), Piemonte (92), Veneto (94), Veneto Classic (96)
const p16WtFixed = [55, 23, 52, 53, 29, 30, 28, 64, 56, 18, 16, 17];
const p16ProFixed = [88, 90, 91, 92, 94, 96];
const sol16 = solveProgram(16, p16WtFixed, p16ProFixed, 104, 21, [60], []);

console.log("\nSolving Program 17...");
// 17: Giro (23), Tour (55)
// preps: Giro prep = Romandie (52), Tour prep = Suisse (54)
// ardennes: AGR (29), Fleche (30), LBL (28)
// exclude: Lombardia (64), San Sebastian (56), Italian autumn (88, 90, 91, 92, 94, 96)
// spring: Paris-Nice (19), Drome (14), Ardeche (13), UAE (10), MSR (17)
const p17WtFixed = [55, 23, 52, 54, 29, 30, 28, 19, 10, 17];
const p17ProFixed = [14, 13];
// We want to exclude Lombardia, San Sebastian, and Italian autumn classics
const excludeWt17 = [64, 56];
const excludePro17 = [88, 90, 91, 92, 94, 96];
const sol17 = solveProgram(17, p17WtFixed, p17ProFixed, 104, 21, [60, ...excludeWt17], excludePro17);

console.log("\nSolving Program 18...");
// 18: Giro (23), Tour (55)
// ardennes: AGR (29), LBL (28) (no Fleche 30)
// autumn: Lombardia (64) and Italian autumn (88, 90, 91, 92, 94, 96)
// spring: Tirreno (18), MSR (17), TOA (102)
// 145 renntage, 45% WT (65 WT stages), 55% PT (80 Pro stages)
const p18WtFixed = [55, 23, 18, 17, 29, 28, 64];
const p18ProFixed = [102, 88, 90, 91, 92, 94, 96];
const sol18 = solveProgram(18, p18WtFixed, p18ProFixed, 65, 80, [60, 30], []);

if (sol16 && sol17 && sol18) {
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
  
  printSolution("Program 16", sol16);
  printSolution("Program 17", sol17);
  printSolution("Program 18", sol18);
  
  function getIds(sol) {
    return sol.wt.map(r => r.id).concat(sol.pro.map(r => r.id)).sort((a, b) => a - b);
  }
  
  console.log("\nRebuild arrays:");
  console.log(`const prog16Races = [${getIds(sol16).join(', ')}];`);
  console.log(`const prog17Races = [${getIds(sol17).join(', ')}];`);
  console.log(`const prog18Races = [${getIds(sol18).join(', ')}];`);
}
