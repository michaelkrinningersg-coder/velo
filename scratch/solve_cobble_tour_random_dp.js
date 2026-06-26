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

// Autumn classics lists
const wtAutumnIds = [56, 58, 61, 62, 63, 64];
const proAutumnIds = [84, 85, 86, 87, 89, 90, 91, 92, 93, 94, 96];
const allAutumnIds = [...wtAutumnIds, ...proAutumnIds];

function getAutumnClassics(list) {
  return list.filter(r => allAutumnIds.includes(r.id)).map(r => r.id);
}

// Define fixed parts for each program:
// Program 13:
// WT fixed: Tour (55), Giro (23), WT cobbles (15, 21, 45, 46, 25, 27), UAE (10), Dauphiné (53)
const p13WtFixed = [55, 23, 15, 21, 45, 46, 25, 27, 10, 53];
// Pro fixed: Kuurne (70), Nokere (72), Tro-Bro (79), Flandrien (87), Almeria (8), Figueira (9)
const p13ProFixed = [70, 72, 79, 87, 8, 9];

// Program 14:
// WT fixed: Tour (55), Giro (23), WT cobbles (15, 21, 45, 46, 25, 27), TDU (1), Suisse (54)
const p14WtFixed = [55, 23, 15, 21, 45, 46, 25, 27, 1, 54];
// Pro fixed: Kuurne (70), Nokere (72), Paris-Tours (93), Oman (11)
const p14ProFixed = [70, 72, 93, 11];

// Program 15:
// WT fixed: Tour (55), WT cobbles (15, 21, 45, 46, 25, 27)
const p15WtFixed = [55, 15, 21, 45, 46, 25, 27];
// Pro fixed: Tro-Bro (79), Flandrien (87), Paris-Tours (93), Valencia (5), Baloise Belgium Tour (109)
const p15ProFixed = [79, 87, 93, 5, 109];

// We search for random solutions for each program.
// A solution consists of a set of WT and Pro races.
function generateRandomSolutions(programId, wtFixedIds, proFixedIds, targetWt, targetPro, excludeWtIds, excludeProIds, iterations = 1000) {
  const baseWt = wtFixedIds.map(id => races.find(r => r.id === id));
  const basePro = proFixedIds.map(id => races.find(r => r.id === id));
  
  const currentWtStages = baseWt.reduce((sum, r) => sum + r.number_of_stages, 0);
  const currentProStages = basePro.reduce((sum, r) => sum + r.number_of_stages, 0);
  
  const neededWt = targetWt - currentWtStages;
  const neededPro = targetPro - currentProStages;
  
  const solutions = [];
  const seenKeys = new Set();
  
  for (let iter = 0; iter < iterations; iter++) {
    // Randomly disable some candidate races
    const wtCandidates = races.filter(r => {
      if ([5, 8].includes(r.category_id)) return false;
      if (wtFixedIds.includes(r.id)) return false;
      if (excludeWtIds.includes(r.id)) return false;
      if (r.id === 23 || r.id === 55 || r.id === 60) return false; // Giro, Tour, Vuelta
      if (hasOverlap(baseWt, r)) return false;
      
      // Randomly drop with 20% probability (unless it's a candidate we really want to keep, but random drop is fine)
      return Math.random() > 0.20;
    });
    
    const wtSol = solveIntervalSubsetSum(wtCandidates, neededWt);
    if (!wtSol) continue;
    
    const fullWt = [...baseWt, ...wtSol];
    
    const proCandidates = races.filter(r => {
      if (![5, 8].includes(r.category_id)) return false;
      if (proFixedIds.includes(r.id)) return false;
      if (excludeProIds.includes(r.id)) return false;
      if (hasOverlap(fullWt, r)) return false;
      if (hasOverlap(basePro, r)) return false;
      
      // Randomly drop with 20% probability
      return Math.random() > 0.20;
    });
    
    const proSol = solveIntervalSubsetSum(proCandidates, neededPro);
    if (!proSol) continue;
    
    const fullPro = [...basePro, ...proSol];
    
    // Create unique key
    const wtIds = fullWt.map(r => r.id).sort((a,b)=>a-b);
    const proIds = fullPro.map(r => r.id).sort((a,b)=>a-b);
    const key = wtIds.join(',') + '|' + proIds.join(',');
    
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      solutions.push({
        wt: fullWt,
        pro: fullPro,
        wtIds,
        proIds
      });
    }
  }
  
  return solutions;
}

console.log("Generating solutions for Program 13...");
const sols13 = generateRandomSolutions(13, p13WtFixed, p13ProFixed, 104, 20, [60], [], 5000);
console.log(`Generated ${sols13.length} unique solutions for Program 13.`);

console.log("Generating solutions for Program 14...");
const sols14 = generateRandomSolutions(14, p14WtFixed, p14ProFixed, 104, 20, [60], [], 5000);
console.log(`Generated ${sols14.length} unique solutions for Program 14.`);

console.log("Generating solutions for Program 15...");
const sols15 = generateRandomSolutions(15, p15WtFixed, p15ProFixed, 44, 81, [23, 60], [], 5000);
console.log(`Generated ${sols15.length} unique solutions for Program 15.`);

// Now we search for a compatible triple.
// Constraints:
// For any pair, the number of overlapping autumn classics must be <= 50% of the size of the smaller set of autumn classics.
console.log("Searching for compatible triple...");
let foundTriple = null;

for (const s13 of sols13) {
  const ac13 = getAutumnClassics([...s13.wt, ...s13.pro]);
  for (const s14 of sols14) {
    const ac14 = getAutumnClassics([...s14.wt, ...s14.pro]);
    
    // Check overlap between 13 and 14
    const overlap13_14 = ac13.filter(id => ac14.includes(id));
    const limit13_14 = 0.5 * Math.min(ac13.length, ac14.length);
    if (overlap13_14.length > limit13_14) continue;
    
    for (const s15 of sols15) {
      const ac15 = getAutumnClassics([...s15.wt, ...s15.pro]);
      
      // Check overlap between 13 and 15
      const overlap13_15 = ac13.filter(id => ac15.includes(id));
      const limit13_15 = 0.5 * Math.min(ac13.length, ac15.length);
      if (overlap13_15.length > limit13_15) continue;
      
      // Check overlap between 14 and 15
      const overlap14_15 = ac14.filter(id => ac15.includes(id));
      const limit14_15 = 0.5 * Math.min(ac14.length, ac15.length);
      if (overlap14_15.length > limit14_15) continue;
      
      // Check if they are compatible!
      foundTriple = { s13, s14, s15, ac13, ac14, ac15, overlap13_14, overlap13_15, overlap14_15 };
      break;
    }
    if (foundTriple) break;
  }
  if (foundTriple) break;
}

if (foundTriple) {
  console.log("SUCCESS! Found compatible triple:");
  printSolution("Program 13", foundTriple.s13);
  printSolution("Program 14", foundTriple.s14);
  printSolution("Program 15", foundTriple.s15);
  
  console.log("\nAutumn Classics check:");
  console.log("Prog 13 AC:", foundTriple.ac13.join(', '));
  console.log("Prog 14 AC:", foundTriple.ac14.join(', '));
  console.log("Prog 15 AC:", foundTriple.ac15.join(', '));
  console.log("Overlap 13-14:", foundTriple.overlap13_14.join(', '), `(Count: ${foundTriple.overlap13_14.length}, Max allowed: ${0.5 * Math.min(foundTriple.ac13.length, foundTriple.ac14.length)})`);
  console.log("Overlap 13-15:", foundTriple.overlap13_15.join(', '), `(Count: ${foundTriple.overlap13_15.length}, Max allowed: ${0.5 * Math.min(foundTriple.ac13.length, foundTriple.ac15.length)})`);
  console.log("Overlap 14-15:", foundTriple.overlap14_15.join(', '), `(Count: ${foundTriple.overlap14_15.length}, Max allowed: ${0.5 * Math.min(foundTriple.ac14.length, foundTriple.ac15.length)})`);
  
  console.log("\nRebuild arrays:");
  console.log(`const prog13Races = [${foundTriple.s13.wtIds.concat(foundTriple.s13.proIds).sort((a,b)=>a-b).join(', ')}];`);
  console.log(`const prog14Races = [${foundTriple.s14.wtIds.concat(foundTriple.s14.proIds).sort((a,b)=>a-b).join(', ')}];`);
  console.log(`const prog15Races = [${foundTriple.s15.wtIds.concat(foundTriple.s15.proIds).sort((a,b)=>a-b).join(', ')}];`);
} else {
  console.log("Could not find a valid triple with autumn classics constraints.");
}

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
