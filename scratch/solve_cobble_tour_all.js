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

// -------------------------------------------------------------
// Program 13: Cobble_Tour_1 (125 +-5, 85% +-3% WT) -> Target WT: 104, Pro: 20
// Tour (55) + WT Cobbles (15, 21, 45, 46, 25, 27) = 27 WT stages.
// Pro Cobbles (70, 72, 79, 87) = 4 Pro stages.
// Prep before Tour: Dauphine (53) = 8 WT stages.
// Prep before Cobbles: Algarve (3) = 5 Pro stages.
// UAE Tour (10) = 7 WT stages.
// -------------------------------------------------------------
const m13Wt = [55, 15, 21, 45, 46, 25, 27, 53, 10]; // 21 + 6 + 8 + 7 = 42 WT stages
const m13Pro = [70, 72, 79, 87, 3]; // 4 + 5 = 9 Pro stages
const initialWt13 = wtRaces.filter(r => m13Wt.includes(r.id));
const initialPro13 = proRaces.filter(r => m13Pro.includes(r.id));

const candidatesWt13 = wtRaces.filter(r => {
  if (m13Wt.includes(r.id)) return false;
  if (cobbleRaces.includes(r.id)) return false;
  if (r.id === 23 || r.id === 60) return false; // Exclude Giro/Vuelta
  return !hasOverlap(initialWt13, r);
});

const candidatesPro13 = proRaces.filter(r => {
  if (m13Pro.includes(r.id)) return false;
  if (cobbleRaces.includes(r.id)) return false;
  return true;
});

console.log("Solving Program 13...");
// Target total: 124 days (WT: 104, Pro: 20).
// We need 104 - 42 = 62 additional WT stages.
// We need 20 - 9 = 11 additional Pro stages.
const wtSol13 = solveIntervalSubsetSum(candidatesWt13, 62);
const fullWt13 = [...initialWt13, ...wtSol13];
const proSol13 = solveIntervalSubsetSum(candidatesPro13.filter(r => !hasOverlap(fullWt13, r)), 11);
const fullPro13 = [...initialPro13, ...proSol13];

if (!wtSol13 || !proSol13) {
  console.log("No Program 13 solution found!");
  process.exit(1);
}
console.log("Program 13 solved! Days: WT:", fullWt13.reduce((a,b)=>a+b.number_of_stages, 0), "Pro:", fullPro13.reduce((a,b)=>a+b.number_of_stages, 0));

// -------------------------------------------------------------
// Program 14: Cobble_Tour_2 (125 +-5, 85% +-3% WT) -> Target WT: 104, Pro: 20
// Tour (55) + WT Cobbles = 27 WT stages.
// Pro Cobbles: Paris-Tours (93), Kuurne (70), Nokere (72) = 3 Pro stages.
// Prep before Tour: Suisse (54) = 5 WT stages (different from Dauphine).
// Prep before Cobbles: Oman (11) = 5 Pro stages.
// Paris-Nice (19) = 8 WT stages (different from UAE / Tirreno).
// -------------------------------------------------------------
const m14Wt = [55, 15, 21, 45, 46, 25, 27, 54, 19]; // 21 + 6 + 5 + 8 = 40 WT stages
const m14Pro = [93, 70, 72, 11]; // 3 + 5 = 8 Pro stages
const initialWt14 = wtRaces.filter(r => m14Wt.includes(r.id));
const initialPro14 = proRaces.filter(r => m14Pro.includes(r.id));

const candidatesWt14 = wtRaces.filter(r => {
  if (m14Wt.includes(r.id)) return false;
  if (cobbleRaces.includes(r.id)) return false;
  if (r.id === 23 || r.id === 60) return false;
  return !hasOverlap(initialWt14, r);
});

const candidatesPro14 = proRaces.filter(r => {
  if (m14Pro.includes(r.id)) return false;
  if (cobbleRaces.includes(r.id)) return false;
  return true;
});

console.log("Solving Program 14...");
// Target total: 124 days (WT: 104, Pro: 20).
// We need 104 - 40 = 64 WT stages.
// We need 20 - 8 = 12 Pro stages.
const wtSol14 = solveIntervalSubsetSum(candidatesWt14, 64);
const fullWt14 = [...initialWt14, ...wtSol14];
const proSol14 = solveIntervalSubsetSum(candidatesPro14.filter(r => !hasOverlap(fullWt14, r)), 12);
const fullPro14 = [...initialPro14, ...proSol14];

if (!wtSol14 || !proSol14) {
  console.log("No Program 14 solution found!");
  process.exit(1);
}
console.log("Program 14 solved! Days: WT:", fullWt14.reduce((a,b)=>a+b.number_of_stages, 0), "Pro:", fullPro14.reduce((a,b)=>a+b.number_of_stages, 0));

// -------------------------------------------------------------
// Program 15: Cobble_Tour_3 (125 +-5, 35% +-3% WT) -> Target WT: 44, Pro: 81 (total 125)
// Tour (55) + WT Cobbles = 27 WT stages.
// Pro Cobbles: Paris-Tours (93), Tro-Bro (79), Flandrien (87) = 3 Pro stages.
// Prep before Tour: Baloise Belgium Tour (109) = 5 Pro stages.
// Prep before Cobbles: Valencia (5) = 5 Pro stages.
// -------------------------------------------------------------
const m15Wt = [55, 15, 21, 45, 46, 25, 27]; // 27 WT stages
const m15Pro = [93, 79, 87, 109, 5]; // 3 + 5 + 5 = 13 Pro stages
const initialWt15 = wtRaces.filter(r => m15Wt.includes(r.id));
const initialPro15 = proRaces.filter(r => m15Pro.includes(r.id));

const candidatesWt15 = wtRaces.filter(r => {
  if (m15Wt.includes(r.id)) return false;
  if (cobbleRaces.includes(r.id)) return false;
  if (r.id === 23 || r.id === 60) return false;
  return !hasOverlap(initialWt15, r);
});

const candidatesPro15 = proRaces.filter(r => {
  if (m15Pro.includes(r.id)) return false;
  if (cobbleRaces.includes(r.id)) return false;
  return true;
});

console.log("Solving Program 15...");
// Target total: 125 days (WT: 44, Pro: 81).
// We need 44 - 27 = 17 WT stages.
// We need 81 - 13 = 68 Pro stages.
const wtSol15 = solveIntervalSubsetSum(candidatesWt15, 17);
const fullWt15 = [...initialWt15, ...wtSol15];
const proSol15 = solveIntervalSubsetSum(candidatesPro15.filter(r => !hasOverlap(fullWt15, r)), 68);
const fullPro15 = [...initialPro15, ...proSol15];

if (!wtSol15 || !proSol15) {
  console.log("No Program 15 solution found!");
  process.exit(1);
}
console.log("Program 15 solved! Days: WT:", fullWt15.reduce((a,b)=>a+b.number_of_stages, 0), "Pro:", fullPro15.reduce((a,b)=>a+b.number_of_stages, 0));

// Print all solutions
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

printSolution("Program 13", { wt: fullWt13, pro: fullPro13 });
printSolution("Program 14", { wt: fullWt14, pro: fullPro14 });
printSolution("Program 15", { wt: fullWt15, pro: fullPro15 });

function getIds(sol) {
  return sol.wt.map(r => r.id).concat(sol.pro.map(r => r.id)).sort((a, b) => a - b);
}

console.log("\nCopy-paste arrays:");
console.log(`const prog13Races = [${getIds({ wt: fullWt13, pro: fullPro13 }).join(', ')}];`);
console.log(`const prog14Races = [${getIds({ wt: fullWt14, pro: fullPro14 }).join(', ')}];`);
console.log(`const prog12Races = [${getIds({ wt: fullWt15, pro: fullPro15 }).join(', ')}];`); // wait, ID 15

db.close();
