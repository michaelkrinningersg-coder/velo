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

// Let's define the fixed parts:
// Program 13:
// WT fixed: Tour (55), Giro (23), WT cobbles (15, 21, 45, 46, 25, 27), UAE (10), Dauphiné (53)
const p13WtFixed = [55, 23, 15, 21, 45, 46, 25, 27, 10, 53].map(id => races.find(r => r.id === id));
// Pro fixed: Kuurne (70), Nokere (72), Tro-Bro (79), Flandrien (87), Algarve (3)
const p13ProFixed = [70, 72, 79, 87, 3].map(id => races.find(r => r.id === id));

// Program 14:
// WT fixed: Tour (55), Giro (23), WT cobbles (15, 21, 45, 46, 25, 27), TDU (1), Suisse (54)
const p14WtFixed = [55, 23, 15, 21, 45, 46, 25, 27, 1, 54].map(id => races.find(r => r.id === id));
// Pro fixed: Kuurne (70), Nokere (72), Paris-Tours (93), Oman (11)
const p14ProFixed = [70, 72, 93, 11].map(id => races.find(r => r.id === id));

// Program 15:
// WT fixed: Tour (55), WT cobbles (15, 21, 45, 46, 25, 27)
const p15WtFixed = [55, 15, 21, 45, 46, 25, 27].map(id => races.find(r => r.id === id));
// Pro fixed: Tro-Bro (79), Flandrien (87), Paris-Tours (93), Valencia (5), Baloise Belgium Tour (109)
const p15ProFixed = [79, 87, 93, 5, 109].map(id => races.find(r => r.id === id));

// Target days:
// 13: WT = 104, Pro = 20
// 14: WT = 104, Pro = 20
// 15: WT = 44, Pro = 81

// Let's divide WT autumn classics:
// 13: [62, 63] (Quebec, Montreal)
// 14: [58, 64] (Cyclassics, Lombardia)
// 15: [56, 61] (DSSK, Bretagne)
const wtAutumnPartition = {
  13: [62, 63],
  14: [58, 64],
  15: [56, 61]
};

// Let's divide Pro autumn classics:
// We need to make sure Pro autumn classics are assigned so that Pro targets are met, and overlap is <= 50%.
// Pro autumn classics pool: [84, 85, 86, 87, 89, 90, 91, 92, 93, 94, 96]
// Note: 13 fixed has Flandrien (87). 14 fixed has Paris-Tours (93). 15 fixed has Flandrien (87) and Paris-Tours (93).
// Let's try assigning other Pro autumn classics:
// Let's search over possible partitions or subsets of Pro autumn classics!
// There are 9 remaining Pro autumn classics (84, 85, 86, 89, 90, 91, 92, 94, 96).
// We can test different subsets for 13, 14, 15.
// Since the search space of subsets is small, we can write a solver.

function solveProgram(programId, wtFixedIds, proFixedIds, wtAutumnIds, proAutumnIds, targetWt, targetPro, excludeWtIds, excludeProIds) {
  // Combine fixed and forced autumn classics
  const baseWt = [...wtFixedIds, ...wtAutumnIds].map(id => races.find(r => r.id === id));
  const basePro = [...proFixedIds, ...proAutumnIds].map(id => races.find(r => r.id === id));
  
  // Check for internal overlap of base races
  const allBase = [...baseWt, ...basePro];
  for (let i = 0; i < allBase.length; i++) {
    for (let j = i + 1; j < allBase.length; j++) {
      if (overlaps(allBase[i], allBase[j])) {
        // console.log(`Overlap in base for Program ${programId}: ${allBase[i].name} and ${allBase[j].name}`);
        return null;
      }
    }
  }
  
  const currentWtStages = baseWt.reduce((sum, r) => sum + r.number_of_stages, 0);
  const currentProStages = basePro.reduce((sum, r) => sum + r.number_of_stages, 0);
  
  if (currentWtStages > targetWt || currentProStages > targetPro) return null;
  
  const neededWt = targetWt - currentWtStages;
  const neededPro = targetPro - currentProStages;
  
  // Candidates: WT races that do not overlap with base WT, aren't cobbles (already handled), aren't in excludeWtIds, and aren't autumn classics
  const wtCandidates = races.filter(r => {
    if ([5, 8].includes(r.category_id)) return false; // not WT
    if (wtFixedIds.includes(r.id)) return false;
    if (excludeWtIds.includes(r.id)) return false;
    if (wtAutumnIds.includes(r.id)) return false;
    if (wtAutumnIds.concat(wtFixedIds).includes(r.id)) return false; // already assigned
    if (allAutumnIds.includes(r.id)) return false; // exclude all autumn classics from free search
    if (r.id === 23 || r.id === 55 || r.id === 60) return false; // Giro, Tour, Vuelta
    return !hasOverlap(baseWt, r);
  });
  
  const wtSol = solveIntervalSubsetSum(wtCandidates, neededWt);
  if (!wtSol) return null;
  
  const fullWt = [...baseWt, ...wtSol];
  
  // Pro candidates: Pro races that do not overlap with fullWt, aren't in excludeProIds, aren't autumn classics
  const proCandidates = races.filter(r => {
    if (![5, 8].includes(r.category_id)) return false; // not Pro
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

// Let's test combinations of Pro autumn classics.
// To keep things simple and avoid overlap, let's assign disjoint sets of Pro autumn classics:
// Remaining Pro autumn: [84 (Sabatini), 85 (Fourmies), 86 (Wallonie), 89 (Münsterland), 90 (Bernocchi), 91 (Varesine), 92 (Piemonte), 94 (Giro del Veneto), 96 (Veneto Classic)]
// Let's assign:
// 13: [90, 91, 92] (Bernocchi, Varesine, Piemonte)
// 14: [89, 94, 96] (Münsterland, Giro del Veneto, Veneto Classic)
// 15: [84, 85, 86] (Sabatini, Fourmies, Wallonie)
// Let's test if this combination works!

const p13ProAutumn = [90, 91, 92];
const p14ProAutumn = [89, 94, 96];
const p15ProAutumn = [84, 85, 86];

console.log("Testing exact classic splits...");
const sol13 = solveProgram(13, [55, 23, 15, 21, 45, 46, 25, 27, 10, 53], [70, 72, 79, 87, 3], [62, 63], p13ProAutumn, 104, 20, [60], []);
const sol14 = solveProgram(14, [55, 23, 15, 21, 45, 46, 25, 27, 1, 54], [70, 72, 93, 11], [58, 64], p14ProAutumn, 104, 20, [60], []);
const sol15 = solveProgram(15, [55, 15, 21, 45, 46, 25, 27], [79, 87, 93, 5, 109], [56, 61], p15ProAutumn, 44, 81, [23, 60], []);

if (sol13) console.log("Program 13 solved!");
if (sol14) console.log("Program 14 solved!");
if (sol15) console.log("Program 15 solved!");

if (sol13 && sol14 && sol15) {
  console.log("SUCCESS! Found perfect triple with disjoint autumn classics!");
  
  function getIds(sol) {
    return sol.wt.map(r => r.id).concat(sol.pro.map(r => r.id)).sort((a, b) => a - b);
  }
  
  console.log(`const prog13Races = [${getIds(sol13).join(', ')}];`);
  console.log(`const prog14Races = [${getIds(sol14).join(', ')}];`);
  console.log(`const prog15Races = [${getIds(sol15).join(', ')}];`);
}
