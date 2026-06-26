const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const dbPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/assets/world_data.db';
const db = new Database(dbPath);

const wtRaces = db.prepare(`
  SELECT id, name, number_of_stages, start_date, end_date, category_id
  FROM races
  WHERE category_id NOT IN (5, 8)
`).all();

const proRaces = db.prepare(`
  SELECT id, name, number_of_stages, start_date, end_date, category_id
  FROM races
  WHERE category_id IN (5, 8)
`).all();

const cobbleRaces = [
  15, 21, 45, 46, 25, 27, 20
];

function overlaps(r1, r2) {
  return r1.start_date <= r2.end_date && r1.end_date >= r2.start_date;
}

function hasOverlap(list, newRace) {
  for (const r of list) {
    if (overlaps(r, newRace)) return true;
  }
  return false;
}

const forbiddenPeriod = { start: '2026-07-27', end: '2026-08-21' };

// -------------------------------------------------------------
// Interval Subset Sum Solver (Dynamic Programming)
// -------------------------------------------------------------
function solveIntervalSubsetSum(candidates, targetStages, dropProbability = 0.0) {
  // Filter out randomly dropped candidates to get diverse solutions
  const filtered = candidates.filter(r => Math.random() >= dropProbability);
  
  // Sort chronologically
  const sorted = [...filtered].sort((a, b) => a.start_date.localeCompare(b.start_date));
  const N = sorted.length;
  
  // Find next compatible index for each candidate
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
      // Option 1: skip race i
      if (dp[i + 1][s]) {
        dp[i][s] = true;
        choice[i][s] = false;
      }
      // Option 2: include race i
      else if (s >= stages && dp[nextI][s - stages]) {
        dp[i][s] = true;
        choice[i][s] = true;
      }
    }
  }
  
  if (!dp[0][targetStages]) {
    return null;
  }
  
  // Reconstruct
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

// -------------------------------------------------------------
// Solve Program 10 (125 days, WT: 106, Pro: 19)
// -------------------------------------------------------------
function solveProg10() {
  const mandWtIds = [55, 60, 29, 30, 28, 56]; // Tour, Vuelta, AGR, Fleche, Liege, DSSK
  const foundPrepIds = [1, 10, 53]; // TDU, UAE, Dauphine
  const initialWt = wtRaces.filter(r => mandWtIds.includes(r.id) || foundPrepIds.includes(r.id));
  
  let initialStages = 0;
  initialWt.forEach(r => initialStages += r.number_of_stages);
  const neededWt = 106 - initialStages; // 39 stages needed

  const candidatesWt = wtRaces.filter(r => {
    if (mandWtIds.includes(r.id)) return false;
    if (foundPrepIds.includes(r.id)) return false;
    if (cobbleRaces.includes(r.id)) return false;
    if (overlaps(r, forbiddenPeriod)) return false;
    return !hasOverlap(initialWt, r);
  });

  const candidatesPro = proRaces.filter(r => {
    if (cobbleRaces.includes(r.id)) return false;
    if (overlaps(r, forbiddenPeriod)) return false;
    return true;
  });

  for (let trial = 0; trial < 1000; trial++) {
    const wtSol = solveIntervalSubsetSum(candidatesWt, neededWt, 0.1);
    if (!wtSol) continue;
    
    const fullWt = [...initialWt, ...wtSol];
    const proSol = solveIntervalSubsetSum(candidatesPro.filter(r => !hasOverlap(fullWt, r)), 19, 0.1);
    if (proSol) {
      return { wt: fullWt, pro: proSol };
    }
  }
  return null;
}

// -------------------------------------------------------------
// Solve Program 11 (125 days, WT: 106, Pro: 19)
// -------------------------------------------------------------
function solveProg11() {
  const mandWtIds = [55, 60, 29, 30, 28, 56]; // Tour, Vuelta, AGR, Fleche, Liege, DSSK
  const mandProIds = [26]; // Brabantse Pijl
  const prepIds = [54]; // Tour de Suisse
  
  const initialWt = wtRaces.filter(r => mandWtIds.includes(r.id) || prepIds.includes(r.id));
  const initialPro = proRaces.filter(r => mandProIds.includes(r.id));
  
  let initialWtStages = 0;
  initialWt.forEach(r => initialWtStages += r.number_of_stages);
  const neededWt = 106 - initialWtStages; // 55 stages needed

  const candidatesWt = wtRaces.filter(r => {
    if (mandWtIds.includes(r.id)) return false;
    if (prepIds.includes(r.id)) return false;
    if (cobbleRaces.includes(r.id)) return false;
    if (overlaps(r, forbiddenPeriod)) return false;
    return !hasOverlap(initialWt, r);
  });

  const candidatesPro = proRaces.filter(r => {
    if (mandProIds.includes(r.id)) return false;
    if (cobbleRaces.includes(r.id)) return false;
    if (overlaps(r, forbiddenPeriod)) return false;
    return true;
  });

  for (let trial = 0; trial < 1000; trial++) {
    const wtSol = solveIntervalSubsetSum(candidatesWt, neededWt, 0.1);
    if (!wtSol) continue;
    
    const fullWt = [...initialWt, ...wtSol];

    // Must have mid-spring race ("Rennen im mittleren Frühjahr" - PN, Tirreno, Basque, Romandie)
    const hasMidSpring = fullWt.some(r => [19, 18, 51, 52].includes(r.id));
    if (!hasMidSpring) continue;

    const proSol = solveIntervalSubsetSum(candidatesPro.filter(r => !hasOverlap(fullWt, r) && !hasOverlap(initialPro, r)), 18, 0.1);
    if (proSol) {
      return { wt: fullWt, pro: [...initialPro, ...proSol] };
    }
  }
  return null;
}

// -------------------------------------------------------------
// Solve Program 12 (145 days, WT: 51, Pro: 94)
// -------------------------------------------------------------
function solveProg12(p10SpringIds, p11SpringIds) {
  const mandWtIds = [55, 60, 29, 30, 28]; // Tour, Vuelta, AGR, Fleche, Liege
  const mandProIds = [26]; // Brabantse Pijl
  const initialWt = wtRaces.filter(r => mandWtIds.includes(r.id));
  const initialPro = proRaces.filter(r => mandProIds.includes(r.id));
  
  let initialWtStages = 0;
  initialWt.forEach(r => initialWtStages += r.number_of_stages);
  const neededWt = 51 - initialWtStages; // 6 stages needed

  const candidatesWt = wtRaces.filter(r => {
    if (mandWtIds.includes(r.id)) return false;
    if (cobbleRaces.includes(r.id)) return false;
    return !hasOverlap(initialWt, r);
  });

  const candidatesPro = proRaces.filter(r => {
    if (mandProIds.includes(r.id)) return false;
    if (cobbleRaces.includes(r.id)) return false;
    return true;
  });

  const unionSpringIds = new Set([...p10SpringIds, ...p11SpringIds]);

  for (let trial = 0; trial < 10000; trial++) {
    const wtSol = solveIntervalSubsetSum(candidatesWt, neededWt, 0.1);
    if (!wtSol) continue;
    
    const fullWt = [...initialWt, ...wtSol];
    
    const proSol = solveIntervalSubsetSum(candidatesPro.filter(r => !hasOverlap(fullWt, r) && !hasOverlap(initialPro, r)), 93, 0.1);
    if (!proSol) continue;

    const fullPro = [...initialPro, ...proSol];
    const allSelected = [...fullWt, ...fullPro];

    // A. "Vorbereitungsrennen vor der Tour im Juni"
    const hasJunePrep = allSelected.some(r => r.start_date >= '2026-06-01' && r.end_date <= '2026-06-30');
    if (!hasJunePrep) continue;

    // B. "nach der Vuelta wird die form noch genutzt"
    const hasPostVuelta = allSelected.some(r => r.start_date >= '2026-09-14');
    if (!hasPostVuelta) continue;

    // C. Overlap in spring: max 50% overlap with 10 & 11 in spring (March - May)
    const p12SpringRaces = allSelected.filter(r => r.start_date >= '2026-03-01' && r.end_date <= '2026-05-31');
    let springStagesCount = 0;
    let overlapStagesCount = 0;
    p12SpringRaces.forEach(r => {
      springStagesCount += r.number_of_stages;
      if (unionSpringIds.has(r.id)) {
        overlapStagesCount += r.number_of_stages;
      }
    });

    if (springStagesCount > 0 && overlapStagesCount / springStagesCount > 0.5) {
      continue;
    }

    return { wt: fullWt, pro: fullPro };
  }
  return null;
}

console.log("Searching Program 10...");
const sol10 = solveProg10();
if (!sol10) {
  console.log("No Program 10 solution!");
  process.exit(1);
}
console.log("Program 10 found!");

const p10SpringIds = sol10.wt.concat(sol10.pro)
  .filter(r => r.start_date >= '2026-03-01' && r.end_date <= '2026-05-31')
  .map(r => r.id);

console.log("Searching Program 11...");
const sol11 = solveProg11();
if (!sol11) {
  console.log("No Program 11 solution!");
  process.exit(1);
}
console.log("Program 11 found!");

const p11SpringIds = sol11.wt.concat(sol11.pro)
  .filter(r => r.start_date >= '2026-03-01' && r.end_date <= '2026-05-31')
  .map(r => r.id);

console.log("Searching Program 12...");
const sol12 = solveProg12(p10SpringIds, p11SpringIds);
if (!sol12) {
  console.log("No Program 12 solution!");
  process.exit(1);
}
console.log("Program 12 found!");

// Print solutions
function printSolution(name, sol) {
  console.log(`\n=== ${name} ===`);
  console.log("WT Races:");
  let wtTotal = 0;
  sol.wt.sort((a, b) => a.start_date.localeCompare(b.start_date)).forEach(r => {
    console.log(`  ${r.start_date} - ${r.end_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages}`);
    wtTotal += r.number_of_stages;
  });
  
  console.log("\nProSeries Races:");
  let proTotal = 0;
  sol.pro.sort((a, b) => a.start_date.localeCompare(b.start_date)).forEach(r => {
    console.log(`  ${r.start_date} - ${r.end_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages}`);
    proTotal += r.number_of_stages;
  });
  
  console.log(`Grand Total: WT: ${wtTotal} days, Pro: ${proTotal} days, Total: ${wtTotal + proTotal} days`);
}

printSolution("Program 10", sol10);
printSolution("Program 11", sol11);
printSolution("Program 12", sol12);

// Output JS arrays format:
console.log("\nCopy-paste arrays:");
console.log(`const prog10Races = [${sol10.wt.map(r => r.id).concat(sol10.pro.map(r => r.id)).sort((a, b) => a - b).join(', ')}];`);
console.log(`const prog11Races = [${sol11.wt.map(r => r.id).concat(sol11.pro.map(r => r.id)).sort((a, b) => a - b).join(', ')}];`);
console.log(`const prog12Races = [${sol12.wt.map(r => r.id).concat(sol12.pro.map(r => r.id)).sort((a, b) => a - b).join(', ')}];`);

db.close();
