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

const forbiddenPeriod = { start: '2026-07-27', end: '2026-08-21' };

// -------------------------------------------------------------
// PROGRAM 10 SEARCH
// -------------------------------------------------------------
function solveProg10() {
  const mandWtIds = [55, 60, 29, 30, 28, 56]; // Tour, Vuelta, AGR, Fleche, Liege, DSSK
  const foundPrepIds = [1, 10, 53]; // TDU, UAE, Dauphine
  const initialWt = wtRaces.filter(r => mandWtIds.includes(r.id) || foundPrepIds.includes(r.id));
  
  let initialStages = 0;
  initialWt.forEach(r => initialStages += r.number_of_stages);
  const neededWt = 106 - initialStages;

  const candidatesWt = wtRaces.filter(r => {
    if (mandWtIds.includes(r.id)) return false;
    if (foundPrepIds.includes(r.id)) return false;
    if (cobbleRaces.includes(r.id)) return false;
    if (overlaps(r, forbiddenPeriod)) return false;
    return !hasOverlap(initialWt, r);
  });

  const candidatesPro = proRaces.filter(r => {
    if (cobbleRaces.includes(r.id)) return false;
    if (overlaps(r, forbiddenPeriod)) return false;
    return true;
  });

  // Randomized trials
  for (let trial = 0; trial < 100000; trial++) {
    // 1. Shuffle WT
    const shufWt = [...candidatesWt].sort(() => Math.random() - 0.5);
    const selectedWt = [...initialWt];
    let wtStages = initialStages;
    
    for (const r of shufWt) {
      if (wtStages === 106) break;
      if (wtStages + r.number_of_stages <= 106 && !hasOverlap(selectedWt, r)) {
        selectedWt.push(r);
        wtStages += r.number_of_stages;
      }
    }
    
    if (wtStages !== 106) continue;

    // 2. Shuffle Pro
    const shufPro = candidatesPro.filter(r => !hasOverlap(selectedWt, r)).sort(() => Math.random() - 0.5);
    const selectedPro = [];
    let proStages = 0;
    
    for (const r of shufPro) {
      if (proStages === 19) break;
      if (proStages + r.number_of_stages <= 19 && !hasOverlap(selectedPro, r)) {
        selectedPro.push(r);
        proStages += r.number_of_stages;
      }
    }

    if (proStages === 19) {
      return { wt: selectedWt, pro: selectedPro };
    }
  }
  return null;
}

// -------------------------------------------------------------
// PROGRAM 11 SEARCH
// -------------------------------------------------------------
function solveProg11() {
  const mandWtIds = [55, 60, 29, 30, 28, 56]; // Tour, Vuelta, AGR, Fleche, Liege, DSSK
  const mandProIds = [26]; // Brabantse Pijl
  const prepIds = [54]; // Tour de Suisse (diff from 10)
  
  const initialWt = wtRaces.filter(r => mandWtIds.includes(r.id) || prepIds.includes(r.id));
  const initialPro = proRaces.filter(r => mandProIds.includes(r.id));
  
  let initialWtStages = 0;
  initialWt.forEach(r => initialWtStages += r.number_of_stages);
  const neededWt = 106 - initialWtStages;

  const candidatesWt = wtRaces.filter(r => {
    if (mandWtIds.includes(r.id)) return false;
    if (prepIds.includes(r.id)) return false;
    if (cobbleRaces.includes(r.id)) return false;
    if (overlaps(r, forbiddenPeriod)) return false;
    return !hasOverlap(initialWt, r);
  });

  const candidatesPro = proRaces.filter(r => {
    if (mandProIds.includes(r.id)) return false;
    if (cobbleRaces.includes(r.id)) return false;
    if (overlaps(r, forbiddenPeriod)) return false;
    return true;
  });

  for (let trial = 0; trial < 100000; trial++) {
    const shufWt = [...candidatesWt].sort(() => Math.random() - 0.5);
    const selectedWt = [...initialWt];
    let wtStages = initialWtStages;
    
    for (const r of shufWt) {
      if (wtStages === 106) break;
      if (wtStages + r.number_of_stages <= 106 && !hasOverlap(selectedWt, r)) {
        selectedWt.push(r);
        wtStages += r.number_of_stages;
      }
    }
    
    if (wtStages !== 106) continue;

    // Must have mid-spring race ("Rennen im mittleren Frühjahr" - March/April stage races like Paris-Nice, Tirreno, Basque, Romandie)
    const hasMidSpring = selectedWt.some(r => [19, 18, 51, 52].includes(r.id));
    if (!hasMidSpring) continue;

    const shufPro = candidatesPro.filter(r => !hasOverlap(selectedWt, r) && !hasOverlap(initialPro, r)).sort(() => Math.random() - 0.5);
    const selectedPro = [...initialPro];
    let proStages = 1;
    
    for (const r of shufPro) {
      if (proStages === 19) break;
      if (proStages + r.number_of_stages <= 19 && !hasOverlap(selectedPro, r)) {
        selectedPro.push(r);
        proStages += r.number_of_stages;
      }
    }

    if (proStages === 19) {
      return { wt: selectedWt, pro: selectedPro };
    }
  }
  return null;
}

// -------------------------------------------------------------
// PROGRAM 12 SEARCH
// -------------------------------------------------------------
function solveProg12(p10SpringIds, p11SpringIds) {
  const mandWtIds = [55, 60, 29, 30, 28]; // Tour, Vuelta, AGR, Fleche, Liege (NO DSSK)
  const mandProIds = [26]; // Brabantse Pijl
  
  const initialWt = wtRaces.filter(r => mandWtIds.includes(r.id));
  const initialPro = proRaces.filter(r => mandProIds.includes(r.id));
  
  let initialWtStages = 0;
  initialWt.forEach(r => initialWtStages += r.number_of_stages);
  const neededWt = 51 - initialWtStages; // 51 - 45 = 6 stages needed.

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

  const unionSpringIds = new Set([...p10SpringIds, ...p11SpringIds]);

  for (let trial = 0; trial < 200000; trial++) {
    // 1. WT Search
    const shufWt = [...candidatesWt].sort(() => Math.random() - 0.5);
    const selectedWt = [...initialWt];
    let wtStages = initialWtStages;
    
    for (const r of shufWt) {
      if (wtStages === 51) break;
      if (wtStages + r.number_of_stages <= 51 && !hasOverlap(selectedWt, r)) {
        selectedWt.push(r);
        wtStages += r.number_of_stages;
      }
    }
    
    if (wtStages !== 51) continue;

    // 2. Pro Search
    const shufPro = candidatesPro.filter(r => !hasOverlap(selectedWt, r) && !hasOverlap(initialPro, r)).sort(() => Math.random() - 0.5);
    const selectedPro = [...initialPro];
    let proStages = 1;
    
    for (const r of shufPro) {
      if (proStages === 94) break;
      if (proStages + r.number_of_stages <= 94 && !hasOverlap(selectedPro, r)) {
        selectedPro.push(r);
        proStages += r.number_of_stages;
      }
    }

    if (proStages !== 94) continue;

    // 3. Verify Program 12 constraints
    // A. "Vorbereitungsrennen vor der Tour im Juni"
    // Tour starts July 4. June prep is typically in June: e.g. Baloise Belgium Tour (109), Slovenia (110), Suisse (54), Dauphiné (53).
    // Let's check if there is a race in June (start_date between 2026-06-01 and 2026-06-30)
    const allSelected = [...selectedWt, ...selectedPro];
    const hasJunePrep = allSelected.some(r => r.start_date >= '2026-06-01' && r.end_date <= '2026-06-30');
    if (!hasJunePrep) continue;

    // B. "nach der Vuelta wird die form noch genutzt"
    // Vuelta ends Sept 13. Check if there are races in late September or October
    const hasPostVuelta = allSelected.some(r => r.start_date >= '2026-09-14');
    if (!hasPostVuelta) continue;

    // C. Overlap in spring: max 50% overlap with 10 & 11 in spring (March - May)
    // Spring period: March 1 - May 31
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
      continue; // Overlap too high!
    }

    return { wt: selectedWt, pro: selectedPro };
  }
  return null;
}

// Run searches
console.log("Searching Program 10...");
const sol10 = solveProg10();
if (!sol10) {
  console.log("No Program 10 solution!");
  process.exit(1);
}

// Spring races for 10
const p10SpringIds = sol10.wt.concat(sol10.pro)
  .filter(r => r.start_date >= '2026-03-01' && r.end_date <= '2026-05-31')
  .map(r => r.id);

console.log("Searching Program 11...");
const sol11 = solveProg11();
if (!sol11) {
  console.log("No Program 11 solution!");
  process.exit(1);
}

// Spring races for 11
const p11SpringIds = sol11.wt.concat(sol11.pro)
  .filter(r => r.start_date >= '2026-03-01' && r.end_date <= '2026-05-31')
  .map(r => r.id);

console.log("Searching Program 12...");
const sol12 = solveProg12(p10SpringIds, p11SpringIds);
if (!sol12) {
  console.log("No Program 12 solution!");
  process.exit(1);
}

// Print solutions
function printSolution(name, sol) {
  console.log(`\n=== ${name} ===`);
  console.log("WT Races:");
  let wtTotal = 0;
  sol.wt.sort((a, b) => a.start_date.localeCompare(b.start_date)).forEach(r => {
    console.log(`  ${r.start_date} - ${r.end_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages}`);
    wtTotal += r.number_of_stages;
  });
  
  console.log("\nProSeries Races:");
  let proTotal = 0;
  sol.pro.sort((a, b) => a.start_date.localeCompare(b.start_date)).forEach(r => {
    console.log(`  ${r.start_date} - ${r.end_date} | ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(45)} | Stages: ${r.number_of_stages}`);
    proTotal += r.number_of_stages;
  });
  
  console.log(`Grand Total: WT: ${wtTotal} days, Pro: ${proTotal} days, Total: ${wtTotal + proTotal} days`);
}

printSolution("Program 10", sol10);
printSolution("Program 11", sol11);
printSolution("Program 12", sol12);

// Output JS arrays format for pasting into rebuild script:
console.log("\nCopy-paste arrays:");
console.log(`const prog10Races = [${sol10.wt.map(r => r.id).concat(sol10.pro.map(r => r.id)).join(', ')}];`);
console.log(`const prog11Races = [${sol11.wt.map(r => r.id).concat(sol11.pro.map(r => r.id)).join(', ')}];`);
console.log(`const prog12Races = [${sol12.wt.map(r => r.id).concat(sol12.pro.map(r => r.id)).join(', ')}];`);

db.close();
