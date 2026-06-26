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

function overlaps(r1, r2) {
  return r1.start_date <= r2.end_date && r1.end_date >= r2.start_date;
}

function hasOverlap(list, newRace) {
  for (const r of list) {
    if (overlaps(r, newRace)) return true;
  }
  return false;
}

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

// -------------------------------------------------------------
// Program 13 (Cobble_Tour_1): 125 days (+-5: 120-130), 85% WT (+-3%: 82-88%)
// -------------------------------------------------------------
console.log("=== Testing Program 13 WT capacities ===");
const m13WtIds = [55, 15, 21, 45, 46, 25, 27]; // Tour (21) + 6 WT cobbles = 27 stages
const initialWt13 = wtRaces.filter(r => m13WtIds.includes(r.id));
const m13ProIds = [70, 72, 79, 87]; // 4 Pro cobble races = 4 stages

// Try finding solutions with and without Giro/Vuelta
for (const includeGiro of [false, true]) {
  console.log(`\n--- Trial with includeGiro = ${includeGiro} ---`);
  
  const candidatesWt = wtRaces.filter(r => {
    if (m13WtIds.includes(r.id)) return false;
    if (r.id === 23 && !includeGiro) return false; // Giro d'Italia
    if (r.id === 60) return false; // La Vuelta Ciclista a España (usually not in Tour-only cobble programs)
    return !hasOverlap(initialWt13, r);
  });
  
  // Find max possible WT stages
  let maxWt = 27;
  for (let target = 110; target >= 50; target--) {
    if (solveIntervalSubsetSum(candidatesWt, target - 27)) {
      maxWt = target;
      break;
    }
  }
  console.log(`Max possible WT stages: ${maxWt}`);
  
  // Try to find a valid combination of total days (120 to 130) and WT ratio (82% to 88%)
  let found = false;
  for (let total = 120; total <= 130; total++) {
    for (let wt = Math.ceil(total * 0.82); wt <= Math.floor(total * 0.88); wt++) {
      if (wt <= maxWt) {
        const neededWtExtra = wt - 27;
        const proNeeded = total - wt;
        
        // Find WT subset
        const wtSol = solveIntervalSubsetSum(candidatesWt, neededWtExtra);
        if (!wtSol) continue;
        
        const fullWt = [...initialWt13, ...wtSol];
        
        // Filter Pro candidates
        const candidatesPro = proRaces.filter(r => {
          if (m13ProIds.includes(r.id)) return false;
          return !hasOverlap(fullWt, r);
        });
        
        const proSol = solveIntervalSubsetSum(candidatesPro, proNeeded - 4);
        if (proSol) {
          console.log(`FOUND SOLUTION! Total days: ${total}, WT: ${wt} (${((wt/total)*100).toFixed(1)}%), Pro: ${proNeeded}`);
          console.log("WT Races in solution:");
          fullWt.sort((a,b)=>a.start_date.localeCompare(b.start_date)).forEach(r=>console.log(`  ${r.start_date} | ID: ${r.id} | ${r.name} (${r.number_of_stages})`));
          console.log("Pro Races in solution:");
          const fullPro = [...proRaces.filter(r => m13ProIds.includes(r.id)), ...proSol].sort((a,b)=>a.start_date.localeCompare(b.start_date));
          fullPro.forEach(r=>console.log(`  ${r.start_date} | ID: ${r.id} | ${r.name} (${r.number_of_stages})`));
          found = true;
          break;
        }
      }
    }
    if (found) break;
  }
}

db.close();
