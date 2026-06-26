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

// Find all non-overlapping subsets using backtracking or DFS since N is small
const sorted = [...candidates].sort((a, b) => a.start_date.localeCompare(b.start_date));
const N = sorted.length;

const validSplits = new Set();

function getSplit(subset) {
  let wt = baseWt.reduce((sum, r) => sum + r.number_of_stages, 0);
  let pro = 0;
  subset.forEach(r => {
    const isPro = [5, 8].includes(r.category_id);
    if (isPro) pro += r.number_of_stages;
    else wt += r.number_of_stages;
  });
  return { wt, pro, total: wt + pro };
}

function findSolutions(idx, currentSubset) {
  const split = getSplit(currentSubset);
  if (split.total >= 145 && split.total <= 155) {
    validSplits.add(`${split.wt},${split.pro}`);
  }
  if (split.total > 155) return;

  for (let i = idx; i < N; i++) {
    if (!hasOverlap(currentSubset, sorted[i])) {
      currentSubset.push(sorted[i]);
      findSolutions(i + 1, currentSubset);
      currentSubset.pop();
    }
  }
}

findSolutions(0, []);

console.log("Achievable WT, Pro splits for 145-155 total days:");
const sortedSplits = Array.from(validSplits).map(s => {
  const [wt, pro] = s.split(',').map(Number);
  return { wt, pro, total: wt + pro, proPercent: (pro / (wt + pro) * 100).toFixed(1) };
}).sort((a, b) => b.pro - a.pro);

sortedSplits.forEach(s => {
  console.log(`  WT: ${s.wt.toString().padStart(2)} (${(100 - parseFloat(s.proPercent)).toFixed(1)}%) | Pro: ${s.pro.toString().padStart(3)} (${s.proPercent}%) | Total: ${s.total}`);
});
