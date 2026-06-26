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

// We define the core races for each program
// WT Cobbles are always in 13, 14, 15: [15, 21, 45, 46, 25, 27] (Omloop, E3, Wevelgem, Dwars, Flanders, Roubaix)
const wtCobbles = [15, 21, 45, 46, 25, 27];

// Pro cobbled candidates: Kuurne (70), Nokere (72), Tro-Bro (79), Flandrien (87), Paris-Tours (93)
const proCobblesPool = [70, 72, 79, 87, 93];

// We search for Pro cobbles selections for 13, 14, 15
// 13: 4 races of proCobblesPool
// 14: 3 races of proCobblesPool, overlap with 13 <= 2
// 15: 3 races of proCobblesPool, overlap with 13 <= 2, overlap with 14 <= 1
const proCobbleOptions = [
  {
    13: [70, 72, 79, 87],
    14: [70, 72, 93],
    15: [79, 87, 93]
  }
];

// Preps options:
// 13 Tour prep: Dauphine (53, WT, 8 stages)
// 14 Tour prep: Suisse (54, WT, 5 stages)
// 15 Tour prep: Baloise (109, Pro, 5 stages) or other

// Cobble preps options:
// We can define potential prep combinations:
// 13: UAE Tour (10, WT, 7) + Algarve (3, Pro, 5). Overlap! So we can't do that.
// Let's try:
// Combination A:
// 13: UAE Tour (10, WT, 7) + Figueira (9, Pro, 1) or Almeria (8, Pro, 1) or Antalya (no, not in db?). Let's check Algarve (3, Pro, 5) without UAE (10).
// If 13 has Algarve (3, Pro, 5) and we find another WT prep or WT candidate.
// Let's try:
// 13: Algarve (3, Pro, 5) + UAE Tour (10, WT, 7)? No, they overlap.
// What about:
// 13: UAE Tour (10, WT, 7) + Almeria (8, Pro, 1)?
// 14: TDU (1, WT, 6) + Oman (11, Pro, 5)?
// 15: Valencia (5, Pro, 5)?
// Let's test these!

const cobblePrepsOptions = [
  {
    13: { wt: [10], pro: [3] }, // Wait, if we use 3 (Algarve) in 13, it overlaps with 10 (UAE). What if 13 has 10 (UAE Tour, WT) and 8 (Almeria, Pro) or 9 (Figueira, Pro)?
    14: { wt: [1], pro: [11] }, // TDU (1, WT), Oman (11, Pro)
    15: { wt: [], pro: [5] }    // Valencia (5, Pro)
  },
  {
    13: { wt: [], pro: [3] },    // 13 has Algarve (3, Pro), no UAE.
    14: { wt: [10], pro: [11] }, // 14 has UAE (10, WT), Oman (11, Pro)
    15: { wt: [1], pro: [5] }    // 15 has TDU (1, WT), Valencia (5, Pro)
  },
  {
    // Try:
    13: { wt: [10], pro: [8] },  // UAE (10, WT), Almeria (8, Pro)
    14: { wt: [1], pro: [3] },   // TDU (1, WT), Algarve (3, Pro)
    15: { wt: [], pro: [5, 11] } // Valencia (5, Pro), Oman (11, Pro)
  }
];

// Let's also define choices for autumn classics:
// We partition WT autumn classics:
// 13: [62, 63] (Quebec, Montreal)
// 14: [58, 64] (Cyclassics, Lombardia)
// 15: [56, 61] (DSSK, Bretagne)
// Let's partition Pro autumn classics:
// Remaining Pro autumn classics: [84, 85, 86, 89, 90, 91, 92, 94, 96]
// 13: [90, 91, 92]
// 14: [89, 94, 96]
// 15: [84, 85, 86]

function solveProgram(wtFixedIds, proFixedIds, targetWt, targetPro, excludeWtIds, excludeProIds) {
  const baseWt = wtFixedIds.map(id => races.find(r => r.id === id));
  const basePro = proFixedIds.map(id => races.find(r => r.id === id));
  
  // Cross-check overlaps in base
  const allBase = [...baseWt, ...basePro];
  for (let i = 0; i < allBase.length; i++) {
    for (let j = i + 1; j < allBase.length; j++) {
      if (overlaps(allBase[i], allBase[j])) return null;
    }
  }
  
  const currentWtStages = baseWt.reduce((sum, r) => sum + r.number_of_stages, 0);
  const currentProStages = basePro.reduce((sum, r) => sum + r.number_of_stages, 0);
  
  if (currentWtStages > targetWt || currentProStages > targetPro) return null;
  
  const neededWt = targetWt - currentWtStages;
  const neededPro = targetPro - currentProStages;
  
  const wtCandidates = races.filter(r => {
    if ([5, 8].includes(r.category_id)) return false;
    if (wtFixedIds.includes(r.id)) return false;
    if (excludeWtIds.includes(r.id)) return false;
    if (allAutumnIds.includes(r.id)) return false; // exclude all autumn classics
    if (r.id === 23 || r.id === 55 || r.id === 60) return false; // Giro, Tour, Vuelta
    return !hasOverlap(baseWt, r);
  });
  
  const wtSol = solveIntervalSubsetSum(wtCandidates, neededWt);
  if (!wtSol) return null;
  
  const fullWt = [...baseWt, ...wtSol];
  
  const proCandidates = races.filter(r => {
    if (![5, 8].includes(r.category_id)) return false;
    if (proFixedIds.includes(r.id)) return false;
    if (excludeProIds.includes(r.id)) return false;
    if (allAutumnIds.includes(r.id)) return false; // exclude all autumn classics
    if (hasOverlap(fullWt, r)) return false;
    return !hasOverlap(basePro, r);
  });
  
  const proSol = solveIntervalSubsetSum(proCandidates, neededPro);
  if (!proSol) return null;
  
  return {
    wt: fullWt,
    pro: [...basePro, ...proSol]
  };
}

console.log("Starting full search...");

let found = false;

for (const cobbleOpt of proCobbleOptions) {
  for (const prepOpt of cobblePrepsOptions) {
    // 13 Fixed Lists:
    const p13WtFixed = [55, 23, ...wtCobbles, ...prepOpt[13].wt, 53, 62, 63];
    const p13ProFixed = [...cobbleOpt[13], ...prepOpt[13].pro, 90, 91, 92];
    
    // 14 Fixed Lists:
    const p14WtFixed = [55, 23, ...wtCobbles, ...prepOpt[14].wt, 54, 58, 64];
    const p14ProFixed = [...cobbleOpt[14], ...prepOpt[14].pro, 89, 94, 96];
    
    // 15 Fixed Lists:
    const p15WtFixed = [55, ...wtCobbles, ...prepOpt[15].wt, 56, 61];
    const p15ProFixed = [...cobbleOpt[15], ...prepOpt[15].pro, 109, 84, 85, 86];
    
    const sol13 = solveProgram(p13WtFixed, p13ProFixed, 104, 20, [60], []);
    const sol14 = solveProgram(p14WtFixed, p14ProFixed, 104, 20, [60], []);
    const sol15 = solveProgram(p15WtFixed, p15ProFixed, 44, 81, [23, 60], []);
    
    if (sol13 && sol14 && sol15) {
      console.log("FOUND COMPATIBLE TRIPLE!");
      console.log("Prep option used:", JSON.stringify(prepOpt));
      
      function printSolution(name, sol) {
        console.log(`\n=== ${name} ===`);
        console.log("WT Races:");
        sol.wt.sort((a,b)=>a.start_date.localeCompare(b.start_date)).forEach(r => {
          console.log(`  ${r.start_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages}`);
        });
        console.log("Pro Races:");
        sol.pro.sort((a,b)=>a.start_date.localeCompare(b.start_date)).forEach(r => {
          console.log(`  ${r.start_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages}`);
        });
      }
      
      printSolution("Program 13", sol13);
      printSolution("Program 14", sol14);
      printSolution("Program 15", sol15);
      
      function getIds(sol) {
        return sol.wt.map(r => r.id).concat(sol.pro.map(r => r.id)).sort((a, b) => a - b);
      }
      
      console.log("\nRebuild arrays:");
      console.log(`const prog13Races = [${getIds(sol13).join(', ')}];`);
      console.log(`const prog14Races = [${getIds(sol14).join(', ')}];`);
      console.log(`const prog15Races = [${getIds(sol15).join(', ')}];`);
      
      found = true;
      break;
    }
  }
  if (found) break;
}

if (!found) {
  console.log("Could not find a valid triple with disjoint autumn classics and prep options.");
}
