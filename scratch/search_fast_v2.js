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
  15, // Omloop Nieuwsblad ME
  21, // E3 Saxo Classic ME
  45, // In Flanders Fields (Gent-Wevelgem)
  46, // Dwars door Vlaanderen
  25, // Ronde van Vlaanderen ME
  27, // Paris-Roubaix
  20  // Ronde Van Brugge - Tour of Bruges ME
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

// -------------------------------------------------------------
// Program 10: 125 days total. WT: 106, Pro: 19
// Tour (55, 21), Vuelta (60, 21), Amstel (29, 1), Fleche (30, 1), Liege (28, 1), DSSK (56, 1) = 46 WT.
// Total WT days = 106. We need 60 additional WT stages.
// Pro days = 19.
// No cobble races.
// TDU (1, 6) and UAE (10, 7) must be in WT list (foundation).
// Dauphine (53, 8) must be in WT list (prep).
// Between Tour and Vuelta: no races except DSSK (so, exclude Poland, Cyclassics, Renewi, etc. between Jul 27 and Aug 21).
// -------------------------------------------------------------

console.log("Setting up Program 10...");

const prog10MandWtIds = [55, 60, 29, 30, 28, 56];
const prog10MandWt = wtRaces.filter(r => prog10MandWtIds.includes(r.id));

// Foundation & Prep WT:
const prog10FoundPrepIds = [1, 10, 53]; // TDU, UAE, Dauphine
const prog10FoundPrep = wtRaces.filter(r => prog10FoundPrepIds.includes(r.id));

const forbiddenPeriod = { start: '2026-07-27', end: '2026-08-21' };

const initialWt10 = [...prog10MandWt, ...prog10FoundPrep];
let initialWt10Stages = 0;
initialWt10.forEach(r => initialWt10Stages += r.number_of_stages);
const neededStages10 = 106 - initialWt10Stages; // 106 - (46 + 21) = 106 - 67 = 39 additional WT stages needed.

// Filter other WT candidate races for 10:
// Exclude cobbles, mandatory, found/prep, and forbidden period races
const otherWt10 = wtRaces.filter(r => {
  if (prog10MandWtIds.includes(r.id)) return false;
  if (prog10FoundPrepIds.includes(r.id)) return false;
  if (cobbleRaces.includes(r.id)) return false;
  if (overlaps(r, forbiddenPeriod)) return false;
  // Also check if overlaps with initialWt10:
  if (hasOverlap(initialWt10, r)) return false;
  return true;
});

console.log(`Other WT candidates for 10 (${otherWt10.length}):`, otherWt10.map(r => r.name));

const wtSolutions10 = [];
function searchWt10(index, currentList, currentStages) {
  if (currentStages === neededStages10) {
    wtSolutions10.push([...currentList]);
    return;
  }
  if (currentStages > neededStages10 || index >= otherWt10.length) return;

  const race = otherWt10[index];
  // Check if it overlaps with any race in currentList
  if (!hasOverlap(currentList, race)) {
    currentList.push(race);
    searchWt10(index + 1, currentList, currentStages + race.number_of_stages);
    currentList.pop();
  }
  searchWt10(index + 1, currentList, currentStages);
}

searchWt10(0, [], 0);
console.log(`Found ${wtSolutions10.length} WT combinations for Program 10.`);

// For Pro races, we need 19 stages.
const otherPro10 = proRaces.filter(r => {
  if (cobbleRaces.includes(r.id)) return false;
  if (overlaps(r, forbiddenPeriod)) return false;
  return true;
});

// Let's find a valid WT + Pro solution for 10
let sol10 = null;
for (const wtComb of wtSolutions10) {
  const fullWt = [...initialWt10, ...wtComb];
  // Filter Pro candidates that don't overlap with fullWt
  const availablePro = otherPro10.filter(r => !hasOverlap(fullWt, r));
  
  // Search for a Pro combination summing to 19 stages
  const proSolutions = [];
  function searchPro(idx, currentList, currentStages) {
    if (currentStages === 19) {
      proSolutions.push([...currentList]);
      return true; // we just need one
    }
    if (currentStages > 19 || idx >= availablePro.length) return false;
    
    const race = availablePro[idx];
    if (!hasOverlap(currentList, race)) {
      currentList.push(race);
      if (searchPro(idx + 1, currentList, currentStages + race.number_of_stages)) return true;
      currentList.pop();
    }
    return searchPro(idx + 1, currentList, currentStages);
  }
  
  const tempPro = [];
  if (searchPro(0, tempPro, 0)) {
    sol10 = { wt: wtComb, pro: tempPro };
    break;
  }
}

// -------------------------------------------------------------
// Program 11: 125 days total. WT: 106, Pro: 19
// Tour (55, 21), Vuelta (60, 21), Amstel (29, 1), Fleche (30, 1), Liege (28, 1), DSSK (56, 1) = 46 WT.
// Brabantse Pijl (26, 1, Pro) is mandatory.
// No cobble races.
// Tour de Suisse (54, 5) must be in WT list (prep, different from 10 which has Dauphine).
// TDU (1, 6) or UAE (10, 7) or Paris-Nice (19, 8) / Tirreno (18, 7) or Basque (51, 6) / Romandie (52, 6) "Rennen im mittleren Frühjahr".
// Between Tour and Vuelta: no races except DSSK (so, exclude Poland, Cyclassics, Renewi, etc.).
// -------------------------------------------------------------

console.log("\nSetting up Program 11...");
const prog11MandWtIds = [55, 60, 29, 30, 28, 56];
const prog11MandWt = wtRaces.filter(r => prog11MandWtIds.includes(r.id));
const prog11MandProIds = [26]; // Brabantse Pijl
const prog11MandPro = proRaces.filter(r => prog11MandProIds.includes(r.id));

// Suisse is mandatory prep for 11:
const prog11PrepIds = [54]; // Tour de Suisse
const prog11Prep = wtRaces.filter(r => prog11PrepIds.includes(r.id));

const initialWt11 = [...prog11MandWt, ...prog11Prep];
let initialWt11Stages = 0;
initialWt11.forEach(r => initialWt11Stages += r.number_of_stages);
const neededStages11 = 106 - initialWt11Stages; // 106 - (46 + 5) = 55 stages needed.

const otherWt11 = wtRaces.filter(r => {
  if (prog11MandWtIds.includes(r.id)) return false;
  if (prog11PrepIds.includes(r.id)) return false;
  if (cobbleRaces.includes(r.id)) return false;
  if (overlaps(r, forbiddenPeriod)) return false;
  if (hasOverlap(initialWt11, r)) return false;
  return true;
});

const wtSolutions11 = [];
function searchWt11(index, currentList, currentStages) {
  if (currentStages === neededStages11) {
    wtSolutions11.push([...currentList]);
    return;
  }
  if (currentStages > neededStages11 || index >= otherWt11.length) return;

  const race = otherWt11[index];
  if (!hasOverlap(currentList, race)) {
    currentList.push(race);
    searchWt11(index + 1, currentList, currentStages + race.number_of_stages);
    currentList.pop();
  }
  searchWt11(index + 1, currentList, currentStages);
}

searchWt11(0, [], 0);
console.log(`Found ${wtSolutions11.length} WT combinations for Program 11.`);

const otherPro11 = proRaces.filter(r => {
  if (prog11MandProIds.includes(r.id)) return false;
  if (cobbleRaces.includes(r.id)) return false;
  if (overlaps(r, forbiddenPeriod)) return false;
  return true;
});

let sol11 = null;
for (const wtComb of wtSolutions11) {
  const fullWt = [...initialWt11, ...wtComb];
  // Filter Pro candidates
  const availablePro = otherPro11.filter(r => !hasOverlap(fullWt, r) && !hasOverlap(prog11MandPro, r));
  
  const proSolutions = [];
  function searchPro(idx, currentList, currentStages) {
    if (currentStages === 18) { // 18 + 1 (Brabantse) = 19
      proSolutions.push([...currentList]);
      return true;
    }
    if (currentStages > 18 || idx >= availablePro.length) return false;
    
    const race = availablePro[idx];
    if (!hasOverlap(currentList, race)) {
      currentList.push(race);
      if (searchPro(idx + 1, currentList, currentStages + race.number_of_stages)) return true;
      currentList.pop();
    }
    return searchPro(idx + 1, currentList, currentStages);
  }
  
  const tempPro = [];
  if (searchPro(0, tempPro, 0)) {
    sol11 = { wt: wtComb, pro: [...prog11MandPro, ...tempPro] };
    break;
  }
}

// -------------------------------------------------------------
// Program 12: 145 days total. WT: 51, Pro: 94
// Tour (55, 21), Vuelta (60, 21), Amstel (29, 1), Fleche (30, 1), Liege (28, 1) = 45 WT.
// Brabantse Pijl (26, 1, Pro) is mandatory.
// No cobble races.
// We need exactly 6 additional WT stages (51 - 45 = 6).
// We need exactly 93 additional Pro stages (94 - 1 = 93).
// June prep before Tour is mandatory (can be a Pro Series race or WT, e.g. Suisse or Dauphine or a Pro race in June).
// Overlap: spring prep max 50% overlap with 10/11 in spring.
// -------------------------------------------------------------

console.log("\nSetting up Program 12...");
const prog12MandWtIds = [55, 60, 29, 30, 28];
const prog12MandWt = wtRaces.filter(r => prog12MandWtIds.includes(r.id));
const prog12MandProIds = [26];
const prog12MandPro = proRaces.filter(r => prog12MandProIds.includes(r.id));

const initialWt12 = [...prog12MandWt];
const neededStages12 = 51 - 45; // 6 stages needed.

const otherWt12 = wtRaces.filter(r => {
  if (prog12MandWtIds.includes(r.id)) return false;
  if (cobbleRaces.includes(r.id)) return false;
  if (hasOverlap(initialWt12, r)) return false;
  return true;
});

const wtSolutions12 = [];
function searchWt12(index, currentList, currentStages) {
  if (currentStages === neededStages12) {
    wtSolutions12.push([...currentList]);
    return;
  }
  if (currentStages > neededStages12 || index >= otherWt12.length) return;

  const race = otherWt12[index];
  if (!hasOverlap(currentList, race)) {
    currentList.push(race);
    searchWt12(index + 1, currentList, currentStages + race.number_of_stages);
    currentList.pop();
  }
  searchWt12(index + 1, currentList, currentStages);
}

searchWt12(0, [], 0);
console.log(`Found ${wtSolutions12.length} WT combinations for Program 12.`);

const otherPro12 = proRaces.filter(r => {
  if (prog12MandProIds.includes(r.id)) return false;
  if (cobbleRaces.includes(r.id)) return false;
  return true;
});

let sol12 = null;
for (const wtComb of wtSolutions12) {
  const fullWt = [...initialWt12, ...wtComb];
  // Filter Pro candidates
  const availablePro = otherPro12.filter(r => !hasOverlap(fullWt, r) && !hasOverlap(prog12MandPro, r));
  
  const proSolutions = [];
  function searchPro(idx, currentList, currentStages) {
    if (currentStages === 93) { // 93 + 1 (Brabantse) = 94
      proSolutions.push([...currentList]);
      return true;
    }
    if (currentStages > 93 || idx >= availablePro.length) return false;
    
    const race = availablePro[idx];
    if (!hasOverlap(currentList, race)) {
      currentList.push(race);
      if (searchPro(idx + 1, currentList, currentStages + race.number_of_stages)) return true;
      currentList.pop();
    }
    return searchPro(idx + 1, currentList, currentStages);
  }
  
  const tempPro = [];
  if (searchPro(0, tempPro, 0)) {
    sol12 = { wt: wtComb, pro: [...prog12MandPro, ...tempPro] };
    break;
  }
}

function printSolution(name, sol, mandWt, mandPro = []) {
  if (!sol) {
    console.log(`\nNo solution found for ${name}`);
    return;
  }
  console.log(`\n=== ${name} ===`);
  console.log("WT Races:");
  let wtTotal = 0;
  const fullWt = [...mandWt, ...sol.wt];
  fullWt.sort((a, b) => a.start_date.localeCompare(b.start_date)).forEach(r => {
    console.log(`  ${r.start_date} - ${r.end_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages}`);
    wtTotal += r.number_of_stages;
  });
  
  console.log("\nProSeries Races:");
  let proTotal = 0;
  const fullPro = [...mandPro, ...sol.pro];
  fullPro.sort((a, b) => a.start_date.localeCompare(b.start_date)).forEach(r => {
    console.log(`  ${r.start_date} - ${r.end_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages}`);
    proTotal += r.number_of_stages;
  });
  
  console.log(`Grand Total: WT: ${wtTotal} days, Pro: ${proTotal} days, Total: ${wtTotal + proTotal} days`);
}

printSolution("Program 10", sol10, initialWt10);
printSolution("Program 11", sol11, initialWt11);
printSolution("Program 12", sol12, initialWt12, prog12MandPro);

db.close();
