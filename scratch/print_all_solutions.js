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

const forbiddenPeriod = { start_date: '2026-07-27', end_date: '2026-08-21' };

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

// Program 10: 125 days, 85/15 WT/Pro (106 WT, 19 Pro)
// Vuelta, Tour, early spring foundation, Dauphine prep, Ardennes, DSSK, late autumn
const m10 = [55, 60, 29, 30, 28, 56]; // Tour, Vuelta, AGR, Fleche, Liege, DSSK
const fp10 = [1, 10, 53]; // TDU, UAE, Dauphine
const initWt10 = wtRaces.filter(r => m10.includes(r.id) || fp10.includes(r.id));
const cWt10 = wtRaces.filter(r => !m10.includes(r.id) && !fp10.includes(r.id) && !cobbleRaces.includes(r.id) && !overlaps(r, forbiddenPeriod) && !hasOverlap(initWt10, r));
const cPro10 = proRaces.filter(r => !cobbleRaces.includes(r.id) && !overlaps(r, forbiddenPeriod));
const wtSol10 = solveIntervalSubsetSum(cWt10, 39);
const fullWt10 = [...initWt10, ...wtSol10];
const proSol10 = solveIntervalSubsetSum(cPro10.filter(r => !hasOverlap(fullWt10, r)), 19);
const sol10 = { wt: fullWt10, pro: proSol10 };

// Program 11: 125 days, 85/15 WT/Pro (106 WT, 19 Pro)
// Vuelta, Tour, Brabantse Pijl (26, Pro), Suisse prep, mid-spring WT, late autumn
const m11 = [55, 60, 29, 30, 28, 56];
const mp11 = [26];
const prep11 = [54];
const initWt11 = wtRaces.filter(r => m11.includes(r.id) || prep11.includes(r.id));
const initPro11 = proRaces.filter(r => mp11.includes(r.id));
const cWt11 = wtRaces.filter(r => !m11.includes(r.id) && !prep11.includes(r.id) && !cobbleRaces.includes(r.id) && !overlaps(r, forbiddenPeriod) && !hasOverlap(initWt11, r));
const cPro11 = proRaces.filter(r => !mp11.includes(r.id) && !cobbleRaces.includes(r.id) && !overlaps(r, forbiddenPeriod));
const wtSol11 = solveIntervalSubsetSum(cWt11, 55);
const fullWt11 = [...initWt11, ...wtSol11];
const proSol11 = solveIntervalSubsetSum(cPro11.filter(r => !hasOverlap(fullWt11, r)), 18);
const sol11 = { wt: fullWt11, pro: [...initPro11, ...proSol11] };

// Program 12: 145 days, 35/65 WT/Pro (53 WT, 92 Pro)
const m12 = [55, 60, 29, 30, 28]; // Tour, Vuelta, AGR, Fleche, Liege
const mp12 = [26]; // Brabantse Pijl
const initialWt12 = wtRaces.filter(r => m12.includes(r.id));
const initialPro12 = proRaces.filter(r => mp12.includes(r.id));

const candidatesWt12 = wtRaces.filter(r => !m12.includes(r.id) && !cobbleRaces.includes(r.id) && !hasOverlap(initialWt12, r));
const candidatesPro12 = proRaces.filter(r => !mp12.includes(r.id) && !cobbleRaces.includes(r.id));

const p10Spring = sol10.wt.concat(sol10.pro).filter(r => r.start_date >= '2026-03-01' && r.end_date <= '2026-05-31').map(r => r.id);
const p11Spring = sol11.wt.concat(sol11.pro).filter(r => r.start_date >= '2026-03-01' && r.end_date <= '2026-05-31').map(r => r.id);
const unionSpringIds = new Set([...p10Spring, ...p11Spring]);

// Find WT combinations summing to 8 stages for 53 WT total (8 + 45 = 53)
const wtCombs12 = [];
function backtrackWt(idx, current, stages) {
  if (stages === 8) {
    wtCombs12.push([...current]);
    return;
  }
  if (stages > 8 || idx >= candidatesWt12.length) return;
  const r = candidatesWt12[idx];
  if (!hasOverlap(current, r)) {
    current.push(r);
    backtrackWt(idx + 1, current, stages + r.number_of_stages);
    current.pop();
  }
  backtrackWt(idx + 1, current, stages);
}
backtrackWt(0, [], 0);

let sol12 = null;
for (const wtComb of wtCombs12) {
  const fullWt = [...initialWt12, ...wtComb];
  const availablePro = candidatesPro12.filter(r => !hasOverlap(fullWt, r));
  const proSol = solveIntervalSubsetSum(availablePro, 91); // 91 + 1 = 92
  if (!proSol) continue;

  const fullPro = [...initialPro12, ...proSol];
  const allSelected = [...fullWt, ...fullPro];

  // June prep
  const hasJunePrep = allSelected.some(r => r.start_date >= '2026-06-01' && r.end_date <= '2026-06-30');
  if (!hasJunePrep) continue;

  // Post-Vuelta
  const hasPostVuelta = allSelected.some(r => r.start_date >= '2026-09-14');
  if (!hasPostVuelta) continue;

  // Spring overlap
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

  sol12 = { wt: fullWt, pro: fullPro };
  break;
}

function getIds(sol) {
  return sol.wt.map(r => r.id).concat(sol.pro.map(r => r.id)).sort((a, b) => a - b);
}

console.log(`const prog10Races = [${getIds(sol10).join(', ')}];`);
console.log(`const prog11Races = [${getIds(sol11).join(', ')}];`);
console.log(`const prog12Races = [${getIds(sol12).join(', ')}];`);

db.close();
