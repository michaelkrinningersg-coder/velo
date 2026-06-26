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

const mandWtIds = [55, 60, 29, 30, 28]; // Tour, Vuelta, AGR, Fleche, Liege
const mandProIds = [26]; // Brabantse Pijl
const initialWt = wtRaces.filter(r => mandWtIds.includes(r.id));
const initialPro = proRaces.filter(r => mandProIds.includes(r.id));

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

// DP solver
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

// We need Program 10 & 11 spring IDs for overlap check:
const forbiddenPeriod = { start_date: '2026-07-27', end_date: '2026-08-21' };

function getP10P11SpringIds() {
  const p10 = solveProg10_inline();
  const p11 = solveProg11_inline();
  const p10Spring = p10.wt.concat(p10.pro).filter(r => r.start_date >= '2026-03-01' && r.end_date <= '2026-05-31').map(r => r.id);
  const p11Spring = p11.wt.concat(p11.pro).filter(r => r.start_date >= '2026-03-01' && r.end_date <= '2026-05-31').map(r => r.id);
  return new Set([...p10Spring, ...p11Spring]);
}

function solveProg10_inline() {
  const m = [55, 60, 29, 30, 28, 56];
  const fp = [1, 10, 53];
  const initWt = wtRaces.filter(r => m.includes(r.id) || fp.includes(r.id));
  const cWt = wtRaces.filter(r => !m.includes(r.id) && !fp.includes(r.id) && !cobbleRaces.includes(r.id) && !overlaps(r, forbiddenPeriod) && !hasOverlap(initWt, r));
  const cPro = proRaces.filter(r => !cobbleRaces.includes(r.id) && !overlaps(r, forbiddenPeriod));
  const wtSol = solveIntervalSubsetSum(cWt, 39);
  const fullWt = [...initWt, ...wtSol];
  const proSol = solveIntervalSubsetSum(cPro.filter(r => !hasOverlap(fullWt, r)), 19);
  return { wt: fullWt, pro: proSol };
}

function solveProg11_inline() {
  const m = [55, 60, 29, 30, 28, 56];
  const mp = [26];
  const prep = [54];
  const initWt = wtRaces.filter(r => m.includes(r.id) || prep.includes(r.id));
  const initPro = proRaces.filter(r => mp.includes(r.id));
  const cWt = wtRaces.filter(r => !m.includes(r.id) && !prep.includes(r.id) && !cobbleRaces.includes(r.id) && !overlaps(r, forbiddenPeriod) && !hasOverlap(initWt, r));
  const cPro = proRaces.filter(r => !mp.includes(r.id) && !cobbleRaces.includes(r.id) && !overlaps(r, forbiddenPeriod));
  const wtSol = solveIntervalSubsetSum(cWt, 55);
  const fullWt = [...initWt, ...wtSol];
  const proSol = solveIntervalSubsetSum(cPro.filter(r => !hasOverlap(fullWt, r)), 18);
  return { wt: fullWt, pro: [...initPro, ...proSol] };
}

const unionSpringIds = getP10P11SpringIds();
console.log("Union Spring IDs from P10 and P11:", Array.from(unionSpringIds));

// Find WT combinations summing to target stages:
function getWtCombinations(neededWtStages) {
  const list = [];
  function backtrack(idx, current, stages) {
    if (stages === neededWtStages) {
      list.push([...current]);
      return;
    }
    if (stages > neededWtStages || idx >= candidatesWt.length) return;
    const r = candidatesWt[idx];
    if (!hasOverlap(current, r)) {
      current.push(r);
      backtrack(idx + 1, current, stages + r.number_of_stages);
      current.pop();
    }
    backtrack(idx + 1, current, stages);
  }
  backtrack(0, [], 0);
  return list;
}

function findProg12(neededWt, neededPro) {
  console.log(`\n--- Searching for P12: WT needed: ${neededWt} (+45), Pro needed: ${neededPro} (+1) ---`);
  const wtCombs = getWtCombinations(neededWt);
  console.log(`Found ${wtCombs.length} WT combinations.`);

  for (const wtComb of wtCombs) {
    const fullWt = [...initialWt, ...wtComb];
    const availablePro = candidatesPro.filter(r => !hasOverlap(fullWt, r));
    
    // We run DP solver to get exactly neededPro stages
    const proSol = solveIntervalSubsetSum(availablePro, neededPro);
    if (!proSol) continue;

    const fullPro = [...initialPro, ...proSol];
    const allSelected = [...fullWt, ...fullPro];

    // Check June prep
    const hasJunePrep = allSelected.some(r => r.start_date >= '2026-06-01' && r.end_date <= '2026-06-30');
    if (!hasJunePrep) continue;

    // Check post-Vuelta
    const hasPostVuelta = allSelected.some(r => r.start_date >= '2026-09-14');
    if (!hasPostVuelta) continue;

    // Check Spring overlap
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

    console.log(`SUCCESS! Found solution for WT: ${neededWt+45}, Pro: ${neededPro+1}`);
    return { wt: fullWt, pro: fullPro };
  }
  console.log(`FAILED to find solution for WT: ${neededWt+45}, Pro: ${neededPro+1}`);
  return null;
}

const sol_51_92 = findProg12(6, 91); // 51 WT, 92 Pro (143 total)
const sol_53_92 = findProg12(8, 91); // 53 WT, 92 Pro (145 total)

if (sol_51_92) {
  console.log("\n=== 51 WT / 92 Pro (143 days) Solution ===");
  printSolution(sol_51_92);
}
if (sol_53_92) {
  console.log("\n=== 53 WT / 92 Pro (145 days) Solution ===");
  printSolution(sol_53_92);
}

function printSolution(sol) {
  console.log("WT Races:");
  let wtTotal = 0;
  sol.wt.sort((a, b) => a.start_date.localeCompare(b.start_date)).forEach(r => {
    console.log(`  ${r.start_date} - ${r.end_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages}`);
    wtTotal += r.number_of_stages;
  });
  console.log("Pro Races:");
  let proTotal = 0;
  sol.pro.sort((a, b) => a.start_date.localeCompare(b.start_date)).forEach(r => {
    console.log(`  ${r.start_date} - ${r.end_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages}`);
    proTotal += r.number_of_stages;
  });
  console.log(`Grand Total: WT: ${wtTotal}, Pro: ${proTotal}, Total: ${wtTotal + proTotal}`);
}

db.close();
