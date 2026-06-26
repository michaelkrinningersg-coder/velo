const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const dbPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/assets/world_data.db';
const db = new Database(dbPath);

const races = db.prepare(`
  SELECT r.id, r.name, r.category_id, cat.name AS cat_name, r.start_date, r.end_date, r.number_of_stages
  FROM races r
  JOIN race_categories cat ON cat.id = r.category_id
  ORDER BY r.start_date ASC
`).all();

db.close();

const wtFixed = [17, 28, 29, 30, 56, 64];
const baseWt = wtFixed.map(id => races.find(r => r.id === id));
const excludedRaces = [15, 21, 45, 46, 25, 27, 70, 72, 79, 87, 93, 23, 55, 60];

const candidates = races.filter(r => {
  if (wtFixed.includes(r.id)) return false;
  if (excludedRaces.includes(r.id)) return false;
  return !hasOverlap(baseWt, r);
});

function overlaps(r1, r2) {
  return r1.start_date <= r2.end_date && r1.end_date >= r2.start_date;
}

function hasOverlap(list, newRace) {
  for (const r of list) {
    if (overlaps(r, newRace)) return true;
  }
  return false;
}

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

// dp[i] is a Map: wt -> Set(pro)
// dp[N] has only (0, 0)
let dp = new Array(N + 1);
for (let i = 0; i <= N; i++) {
  dp[i] = new Map();
}

function addState(idx, wt, pro) {
  if (!dp[idx].has(wt)) {
    dp[idx].set(wt, new Set());
  }
  dp[idx].get(wt).add(pro);
}

addState(N, 0, 0);

for (let i = N - 1; i >= 0; i--) {
  const nextI = nextCompat[i];
  const stages = sorted[i].number_of_stages;
  const isPro = [5, 8].includes(sorted[i].category_id);
  
  // 1. Skip sorted[i]: copy all states from dp[i+1]
  for (const [wt, proSet] of dp[i + 1].entries()) {
    for (const pro of proSet) {
      addState(i, wt, pro);
    }
  }
  
  // 2. Take sorted[i]: transition from dp[nextI]
  for (const [wt, proSet] of dp[nextI].entries()) {
    for (const pro of proSet) {
      if (isPro) {
        addState(i, wt, pro + stages);
      } else {
        addState(i, wt + stages, pro);
      }
    }
  }
}

const baseWtStages = baseWt.reduce((sum, r) => sum + r.number_of_stages, 0);

console.log(`Base WT stages (fixed classics): ${baseWtStages}`);
console.log("Achievable WT, Pro splits (including fixed WT races) for 145-155 total days:");

const results = [];
for (const [wt, proSet] of dp[0].entries()) {
  const actualWt = wt + baseWtStages;
  for (const pro of proSet) {
    const total = actualWt + pro;
    if (total >= 145 && total <= 155) {
      results.push({
        wt: actualWt,
        pro: pro,
        total: total,
        proPercent: (pro / total * 100).toFixed(1)
      });
    }
  }
}

results.sort((a, b) => b.pro - a.pro);
results.forEach(s => {
  console.log(`  WT: ${s.wt.toString().padStart(2)} (${(100 - parseFloat(s.proPercent)).toFixed(1)}%) | Pro: ${s.pro.toString().padStart(3)} (${s.proPercent}%) | Total: ${s.total}`);
});
