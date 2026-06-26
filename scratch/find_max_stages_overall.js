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

function overlaps(r1, r2) {
  return r1.start_date <= r2.end_date && r1.end_date >= r2.start_date;
}

function hasOverlap(list, newRace) {
  for (const r of list) {
    if (overlaps(r, newRace)) return true;
  }
  return false;
}

const candidates = races.filter(r => {
  if (wtFixed.includes(r.id)) return false;
  if (excludedRaces.includes(r.id)) return false;
  return !hasOverlap(baseWt, r);
});

// DP to find the maximum possible stages (regardless of WT/Pro split)
function maxStagesOverall(candidatesList) {
  const sorted = [...candidatesList].sort((a, b) => a.start_date.localeCompare(b.start_date));
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
  
  const dp = new Array(N + 1).fill(0);
  for (let i = N - 1; i >= 0; i--) {
    dp[i] = Math.max(dp[i + 1], sorted[i].number_of_stages + dp[nextCompat[i]]);
  }
  return dp[0];
}

const fixedStages = baseWt.reduce((sum, r) => sum + r.number_of_stages, 0);
console.log(`Fixed stages: ${fixedStages}`);
console.log(`Max possible stages from other candidates: ${maxStagesOverall(candidates)}`);
console.log(`Max possible total stages: ${fixedStages + maxStagesOverall(candidates)}`);
