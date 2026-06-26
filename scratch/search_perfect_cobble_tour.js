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

const wtRaces = races.filter(r => ![5, 8].includes(r.category_id));
const proRaces = races.filter(r => [5, 8].includes(r.category_id));

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

// Autumn classics list
const autumnClassicsIds = [56, 58, 61, 62, 63, 64, 84, 85, 86, 87, 89, 90, 91, 92, 93, 94, 96];

function getAutumnClassics(list) {
  return list.filter(r => autumnClassicsIds.includes(r.id)).map(r => r.id);
}

// Program 13 Initial Config
// WT Cobbles: 15, 21, 45, 46, 25, 27
// Pro Cobbles: 70, 72, 79, 87
// Prep: UAE (10, WT), Algarve (3, Pro), Dauphiné (53, WT)
// Tour: 55 (WT), Giro: 23 (WT)
const init13Wt = [55, 23, 15, 21, 45, 46, 25, 27, 10, 53].map(id => races.find(r => r.id === id));
const init13Pro = [70, 72, 79, 87, 3].map(id => races.find(r => r.id === id));

// Program 14 Initial Config
// WT Cobbles: 15, 21, 45, 46, 25, 27
// Pro Cobbles: 70, 72, 93
// Prep: TDU (1, WT), Oman (11, Pro), Suisse (54, WT)
// Tour: 55 (WT), Giro: 23 (WT)
const init14Wt = [55, 23, 15, 21, 45, 46, 25, 27, 1, 54].map(id => races.find(r => r.id === id));
const init14Pro = [70, 72, 93, 11].map(id => races.find(r => r.id === id));

// Program 15 Initial Config
// WT Cobbles: 15, 21, 45, 46, 25, 27
// Pro Cobbles: 79, 87, 93
// Prep: Valencia (5, Pro), Baloise Belgium Tour (109, Pro)
// Tour: 55 (WT), Giro: none, Vuelta: none
const init15Wt = [55, 15, 21, 45, 46, 25, 27].map(id => races.find(r => r.id === id));
const init15Pro = [79, 87, 93, 5, 109].map(id => races.find(r => r.id === id));

// We want to find sets of races for 13, 14, and 15.
// Let's generate candidates for WT and Pro for each program, keeping in mind that they cannot overlap with the initial sets.
function getCandidates(initialWt, initialPro, excludeIds) {
  const cWt = wtRaces.filter(r => {
    if (excludeIds.includes(r.id)) return false;
    if (initialWt.some(x => x.id === r.id)) return false;
    return !hasOverlap(initialWt, r);
  });
  const cPro = proRaces.filter(r => {
    if (excludeIds.includes(r.id)) return false;
    if (initialPro.some(x => x.id === r.id)) return false;
    return !hasOverlap(initialWt, r); // must not overlap with WT races either
  });
  return { wt: cWt, pro: cPro };
}

// Search function for a single program
// Finds a combination of WT and Pro candidates that:
// - does not overlap with initial sets or with each other
// - sums up to target WT days and target Pro days
function findSchedules(programName, initialWt, initialPro, targetWtDays, targetProDays, candidatesWt, candidatesPro, count = 10) {
  const solutions = [];
  
  function recurseWt(index, currentList, currentStages, neededStages) {
    if (currentStages === neededStages) {
      // WT schedule is complete, now find Pro schedule
      recursePro(0, [], 0, targetProDays, currentList);
      return;
    }
    if (currentStages > neededStages || index >= candidatesWt.length) return;
    if (solutions.length >= count) return;
    
    // Option 1: skip candidatesWt[index]
    recurseWt(index + 1, currentList, currentStages, neededStages);
    
    // Option 2: include candidatesWt[index] if it doesn't overlap
    const race = candidatesWt[index];
    if (!hasOverlap(currentList, race)) {
      recurseWt(index + 1, [...currentList, race], currentStages + race.number_of_stages, neededStages);
    }
  }
  
  function recursePro(index, currentList, currentStages, neededStages, wtList) {
    if (currentStages === neededStages) {
      solutions.push({
        wt: wtList,
        pro: currentList,
        totalWtDays: wtList.reduce((sum, r) => sum + r.number_of_stages, 0),
        totalProDays: currentList.reduce((sum, r) => sum + r.number_of_stages, 0),
        totalDays: wtList.reduce((sum, r) => sum + r.number_of_stages, 0) + currentList.reduce((sum, r) => sum + r.number_of_stages, 0)
      });
      return;
    }
    if (currentStages > neededStages || index >= candidatesPro.length) return;
    if (solutions.length >= count) return;
    
    // Option 1: skip candidatesPro[index]
    recursePro(index + 1, currentList, currentStages, neededStages, wtList);
    
    // Option 2: include candidatesPro[index] if it doesn't overlap with WT or other Pro races
    const race = candidatesPro[index];
    if (!hasOverlap(wtList, race) && !hasOverlap(currentList, race)) {
      recursePro(index + 1, [...currentList, race], currentStages + race.number_of_stages, neededStages, wtList);
    }
  }
  
  const initWtStages = initialWt.reduce((sum, r) => sum + r.number_of_stages, 0);
  const initProStages = initialPro.reduce((sum, r) => sum + r.number_of_stages, 0);
  
  recurseWt(0, initialWt, initWtStages, targetWtDays);
  return solutions;
}

// Let's run a search for 13, 14, 15 and check if we can find combinations that satisfy the autumn overlap constraint!
// Let's print out what we find.
const c13 = getCandidates(init13Wt, init13Pro, [60]); // exclude Vuelta
const c14 = getCandidates(init14Wt, init14Pro, [60]); // exclude Vuelta
const c15 = getCandidates(init15Wt, init15Pro, [23, 60]); // exclude Giro and Vuelta

console.log("C13 candidates count: WT", c13.wt.length, "Pro", c13.pro.length);
console.log("C14 candidates count: WT", c14.wt.length, "Pro", c14.pro.length);
console.log("C15 candidates count: WT", c15.wt.length, "Pro", c15.pro.length);

// We search for multiple solutions for 13, 14, 15 and try to find a compatible triple.
const sols13 = findSchedules("Prog 13", init13Wt, init13Pro, 104, 20, c13.wt, c13.pro, 500);
const sols14 = findSchedules("Prog 14", init14Wt, init14Pro, 104, 20, c14.wt, c14.pro, 500);
const sols15 = findSchedules("Prog 15", init15Wt, init15Pro, 44, 81, c15.wt, c15.pro, 500);

console.log(`Found solutions count: 13: ${sols13.length}, 14: ${sols14.length}, 15: ${sols15.length}`);

// Find a triple that satisfies autumn classics overlap constraint:
// Overlap <= 50% of the size of the smaller set for any pair.
let foundTriple = null;

for (const s13 of sols13) {
  const ac13 = getAutumnClassics([...s13.wt, ...s13.pro]);
  for (const s14 of sols14) {
    const ac14 = getAutumnClassics([...s14.wt, ...s14.pro]);
    
    // Check overlap between 13 and 14
    const overlap13_14 = ac13.filter(id => ac14.includes(id));
    const limit13_14 = 0.5 * Math.min(ac13.length, ac14.length);
    if (overlap13_14.length > limit13_14) continue;
    
    for (const s15 of sols15) {
      const ac15 = getAutumnClassics([...s15.wt, ...s15.pro]);
      
      // Check overlap between 13 and 15
      const overlap13_15 = ac13.filter(id => ac15.includes(id));
      const limit13_15 = 0.5 * Math.min(ac13.length, ac15.length);
      if (overlap13_15.length > limit13_15) continue;
      
      // Check overlap between 14 and 15
      const overlap14_15 = ac14.filter(id => ac15.includes(id));
      const limit14_15 = 0.5 * Math.min(ac14.length, ac15.length);
      if (overlap14_15.length > limit14_15) continue;
      
      // Found!
      foundTriple = { s13, s14, s15, ac13, ac14, ac15, overlap13_14, overlap13_15, overlap14_15 };
      break;
    }
    if (foundTriple) break;
  }
  if (foundTriple) break;
}

if (foundTriple) {
  console.log("SUCCESS! Found compatible triple:");
  printSolution("Program 13", foundTriple.s13);
  printSolution("Program 14", foundTriple.s14);
  printSolution("Program 15", foundTriple.s15);
  
  console.log("\nAutumn Classics check:");
  console.log("Prog 13 AC:", foundTriple.ac13.join(', '));
  console.log("Prog 14 AC:", foundTriple.ac14.join(', '));
  console.log("Prog 15 AC:", foundTriple.ac15.join(', '));
  console.log("Overlap 13-14:", foundTriple.overlap13_14.join(', '), `(Count: ${foundTriple.overlap13_14.length}, Max: ${0.5 * Math.min(foundTriple.ac13.length, foundTriple.ac14.length)})`);
  console.log("Overlap 13-15:", foundTriple.overlap13_15.join(', '), `(Count: ${foundTriple.overlap13_15.length}, Max: ${0.5 * Math.min(foundTriple.ac13.length, foundTriple.ac15.length)})`);
  console.log("Overlap 14-15:", foundTriple.overlap14_15.join(', '), `(Count: ${foundTriple.overlap14_15.length}, Max: ${0.5 * Math.min(foundTriple.ac14.length, foundTriple.ac15.length)})`);
  
  console.log("\nArrays for rebuilding:");
  console.log(`const prog13Races = [${foundTriple.s13.wt.map(r=>r.id).concat(foundTriple.s13.pro.map(r=>r.id)).sort((a,b)=>a-b).join(', ')}];`);
  console.log(`const prog14Races = [${foundTriple.s14.wt.map(r=>r.id).concat(foundTriple.s14.pro.map(r=>r.id)).sort((a,b)=>a-b).join(', ')}];`);
  console.log(`const prog15Races = [${foundTriple.s15.wt.map(r=>r.id).concat(foundTriple.s15.pro.map(r=>r.id)).sort((a,b)=>a-b).join(', ')}];`);
} else {
  console.log("No compatible triple found with strict 104/104/44 WT and 20/20/81 Pro!");
}

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
