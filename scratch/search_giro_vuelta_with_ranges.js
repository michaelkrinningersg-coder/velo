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

function overlaps(r1, r2) {
  return r1.start_date <= r2.end_date && r1.end_date >= r2.start_date;
}

function hasOverlap(list, newRace) {
  for (const r of list) {
    if (overlaps(r, newRace)) return true;
  }
  return false;
}

// Function to find a combination of WT and Pro races that hits the day ranges
function findSchedule(wtFixed, proFixed, excludeWt, excludePro, minWt, maxWt, minPro, maxPro, minTotal, maxTotal) {
  const baseWt = wtFixed.map(id => races.find(r => r.id === id));
  const basePro = proFixed.map(id => races.find(r => r.id === id));
  
  // check base overlaps
  const allBase = [...baseWt, ...basePro];
  for (let i = 0; i < allBase.length; i++) {
    for (let j = i + 1; j < allBase.length; j++) {
      if (overlaps(allBase[i], allBase[j])) return null;
    }
  }
  
  const wtCobbles = [15, 21, 45, 46, 25, 27];
  const proCobbles = [70, 72, 79, 87, 93];
  
  // Filter candidates
  const wtCandidates = races.filter(r => {
    if ([5, 8].includes(r.category_id)) return false;
    if (wtFixed.includes(r.id)) return false;
    if (excludeWt.includes(r.id)) return false;
    if (wtCobbles.includes(r.id)) return false;
    if (r.id === 23 || r.id === 55 || r.id === 60) return false;
    if (hasOverlap(basePro, r)) return false;
    return !hasOverlap(baseWt, r);
  });
  
  const currentWt = baseWt.reduce((sum, r) => sum + r.number_of_stages, 0);
  
  const wtSols = [];
  function recurseWt(idx, current, stages) {
    if (wtSols.length >= 200) return;
    if (stages >= minWt && stages <= maxWt) {
      wtSols.push([...current]);
    }
    if (stages > maxWt || idx >= wtCandidates.length) return;
    
    // skip
    recurseWt(idx + 1, current, stages);
    // take
    const r = wtCandidates[idx];
    if (!hasOverlap(current, r)) {
      recurseWt(idx + 1, [...current, r], stages + r.number_of_stages);
    }
  }
  recurseWt(0, baseWt, currentWt);
  
  if (wtSols.length === 0) return null;
  
  // Sort WT solutions by number of stages descending
  wtSols.sort((a, b) => b.reduce((sum, r) => sum + r.number_of_stages, 0) - a.reduce((sum, r) => sum + r.number_of_stages, 0));
  
  for (const wtSol of wtSols) {
    const wtStages = wtSol.reduce((sum, r) => sum + r.number_of_stages, 0);
    
    const proCandidates = races.filter(r => {
      if (![5, 8].includes(r.category_id)) return false;
      if (proFixed.includes(r.id)) return false;
      if (excludePro.includes(r.id)) return false;
      if (proCobbles.includes(r.id)) return false;
      if (hasOverlap(wtSol, r)) return false;
      return !hasOverlap(basePro, r);
    });
    
    const currentPro = basePro.reduce((sum, r) => sum + r.number_of_stages, 0);
    
    let foundPro = null;
    function recursePro(idx, current, stages) {
      if (foundPro) return;
      if (stages >= minPro && stages <= maxPro) {
        const totalStages = wtStages + stages;
        if (totalStages >= minTotal && totalStages <= maxTotal) {
          foundPro = [...current];
        }
        return;
      }
      if (stages > maxPro || idx >= proCandidates.length) return;
      
      // skip
      recursePro(idx + 1, current, stages);
      // take
      const r = proCandidates[idx];
      if (!hasOverlap(current, r)) {
        recursePro(idx + 1, [...current, r], stages + r.number_of_stages);
      }
    }
    recursePro(0, basePro, currentPro);
    
    if (foundPro) {
      return {
        wt: wtSol,
        pro: foundPro
      };
    }
  }
  return null;
}

function printSolution(name, sol) {
  if (!sol) {
    console.log(`${name}: NOT FOUND`);
    return;
  }
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
  console.log(`IDs: [${sol.wt.map(r=>r.id).concat(sol.pro.map(r=>r.id)).sort((a,b)=>a-b).join(', ')}]`);
}

// Target days:
// 19: 125 days (+-5 -> 120-130), 85/15 ratio (+-5% -> 80-90% WT / 10-20% Pro)
// Min WT: 120 * 0.80 = 96, Max WT: 130 * 0.90 = 117
// Min Pro: 120 * 0.10 = 12, Max Pro: 130 * 0.20 = 26
// But we also want total days in [120, 130].

console.log("Searching for P19...");
const sol19 = findSchedule([23, 60, 1, 10, 32], [77], [], [], 100, 110, 18, 25, 120, 130);
printSolution("Program 19", sol19);

console.log("\nSearching for P20...");
// Giro and Vuelta preps different from 19.
// Romandie (52) is the WT Giro prep in 19, so we exclude it from 20.
// Let's also try to exclude Pologne (57) if possible, but if not we can keep it as long as the Giro prep is different.
// Early preps: AlUla (122) and Valencia (5) are fixed Pro races.
const sol20 = findSchedule([23, 60, 32], [122, 5, 77], [52], [], 96, 110, 15, 26, 120, 130);
printSolution("Program 20", sol20);

console.log("\nSearching for P21...");
// 21: Giro and Vuelta. 145 days (+-5 -> 140-150), 45% WT / 55% Pro (+-5% -> 40-50% WT / 50-60% Pro)
// Min WT: 140 * 0.40 = 56, Max WT: 150 * 0.50 = 75
// Min Pro: 140 * 0.50 = 70, Max Pro: 150 * 0.60 = 90
const sol21 = findSchedule([23, 60], [77, 5, 8, 9, 3], [], [], 60, 67, 75, 85, 140, 150);
printSolution("Program 21", sol21);
