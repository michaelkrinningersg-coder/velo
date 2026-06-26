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

function overlaps(r1, r2) {
  return r1.start_date <= r2.end_date && r1.end_date >= r2.start_date;
}

function hasOverlap(list, newRace) {
  for (const r of list) {
    if (overlaps(r, newRace)) return true;
  }
  return false;
}

const wtCobbles = [15, 21, 45, 46, 25, 27];
const proCobblesPool = [70, 72, 79, 87, 93];

function findSchedule(wtFixed, proFixed, excludeWt, excludePro, minWt, maxWt, minPro, maxPro, minTotal, maxTotal) {
  const baseWt = wtFixed.map(id => races.find(r => r.id === id));
  const basePro = proFixed.map(id => races.find(r => r.id === id));
  
  // check base overlaps
  const allBase = [...baseWt, ...basePro];
  for (let i = 0; i < allBase.length; i++) {
    for (let j = i + 1; j < allBase.length; j++) {
      if (overlaps(allBase[i], allBase[j])) {
        console.log(`Base overlap: ${allBase[i].name} and ${allBase[j].name}`);
        return null;
      }
    }
  }
  
  // Filter candidates
  const wtCandidates = races.filter(r => {
    if ([5, 8].includes(r.category_id)) return false;
    if (wtFixed.includes(r.id)) return false;
    if (excludeWt.includes(r.id)) return false;
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
  
  if (wtSols.length === 0) {
    console.log("No WT solutions found.");
    return null;
  }
  
  console.log(`Found ${wtSols.length} WT solutions. Trying to match with Pro...`);
  
  for (const wtSol of wtSols) {
    const wtStages = wtSol.reduce((sum, r) => sum + r.number_of_stages, 0);
    
    const proCandidates = races.filter(r => {
      if (![5, 8].includes(r.category_id)) return false;
      if (proFixed.includes(r.id)) return false;
      if (excludePro.includes(r.id)) return false;
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

const sol22 = findSchedule(
  [...wtCobbles, 1, 54, 20], // fixed WT
  [70, 72, 79, 87, 22, 11], // fixed Pro
  [10], // exclude UAE (used in 23)
  [5, 8, 9, 3, 12, 93], // exclude used in 23/24
  75, 85, // WT stages
  35, 45, // Pro stages
  120, 130 // total stages
);

if (sol22) {
  console.log("SUCCESS P22:");
  console.log("WT Days:", sol22.wt.reduce((a,b)=>a+b.number_of_stages,0));
  console.log("Pro Days:", sol22.pro.reduce((a,b)=>a+b.number_of_stages,0));
} else {
  console.log("P22 failed!");
}
