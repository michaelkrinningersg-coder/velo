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

// Let's run a test trial of WT & Pro search for Program 12 and log statistics
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

console.log("Total Pro candidates:", candidatesPro.length);
let totalProStages = 0;
candidatesPro.forEach(r => totalProStages += r.number_of_stages);
console.log("Total Pro stages available:", totalProStages);

// Let's run a simple search for WT combinations:
const wtSolutions12 = [];
function searchWt12(index, currentList, currentStages) {
  if (currentStages === 6) {
    wtSolutions12.push([...currentList]);
    return;
  }
  if (currentStages > 6 || index >= candidatesWt.length) return;

  const race = candidatesWt[index];
  if (!hasOverlap(currentList, race)) {
    currentList.push(race);
    searchWt12(index + 1, currentList, currentStages + race.number_of_stages);
    currentList.pop();
  }
  searchWt12(index + 1, currentList, currentStages);
}
searchWt12(0, [], 0);
console.log("Found WT combinations:", wtSolutions12.length);

// Let's print the first WT comb:
if (wtSolutions12.length > 0) {
  console.log("First WT combination:", wtSolutions12[0].map(r => r.name));
  const fullWt = [...initialWt, ...wtSolutions12[0]];
  const availablePro = candidatesPro.filter(r => !hasOverlap(fullWt, r));
  console.log("Available Pro candidates for this WT comb:", availablePro.length);
  let availProStages = 0;
  availablePro.forEach(r => availProStages += r.number_of_stages);
  console.log("Available Pro stages for this WT comb:", availProStages);

  // Let's try to search Pro stages using a basic DFS without random to see if a solution exists
  let proSol = null;
  function searchPro(idx, currentList, currentStages) {
    if (currentStages === 93) {
      proSol = [...currentList];
      return true;
    }
    if (currentStages > 93 || idx >= availablePro.length) return false;
    
    const r = availablePro[idx];
    if (!hasOverlap(currentList, r)) {
      currentList.push(r);
      if (searchPro(idx + 1, currentList, currentStages + r.number_of_stages)) return true;
      currentList.pop();
    }
    return searchPro(idx + 1, currentList, currentStages);
  }
  
  if (searchPro(0, [], 0)) {
    console.log("SUCCESS! Found Pro combination of size 93!");
    console.log("Pro races in solution:", proSol.map(r => r.name));
  } else {
    console.log("FAILED to find any Pro combination of size 93.");
  }
}

db.close();
