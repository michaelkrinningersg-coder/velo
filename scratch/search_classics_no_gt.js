const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const dbPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/assets/world_data.db';
const db = new Database(dbPath);

const races = db.prepare(`
  SELECT r.id, r.name, r.category_id, cat.name AS cat_name, r.start_date, r.end_date, r.number_of_stages, r.is_stage_race
  FROM races r
  JOIN race_categories cat ON cat.id = r.category_id
  ORDER BY r.start_date ASC
`).all();

// Count current assignments in database (programs 1-21)
const assignmentCounts = {};
races.forEach(r => {
  const row = db.prepare(`SELECT COUNT(*) as count FROM race_program_races WHERE race_id = ?`).get(r.id);
  assignmentCounts[r.id] = row ? row.count : 0;
});

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

// Global lists
const wtCobbles = [15, 21, 45, 46, 25, 27];
const proCobblesPool = [70, 72, 79, 87, 93];

// We want to find a program schedule
// Fixed WT: [15, 21, 45, 46, 25, 27] and some specific preps/classics.
// Fixed Pro: a subset of proCobblesPool.
function solveProgram(params) {
  const {
    wtFixedIds,
    proFixedIds,
    excludeWtIds,
    excludeProIds,
    minWt,
    maxWt,
    minPro,
    maxPro,
    minTotal,
    maxTotal
  } = params;

  const baseWt = wtFixedIds.map(id => races.find(r => r.id === id));
  const basePro = proFixedIds.map(id => races.find(r => r.id === id));

  // Base overlaps check
  const allBase = [...baseWt, ...basePro];
  for (let i = 0; i < allBase.length; i++) {
    for (let j = i + 1; j < allBase.length; j++) {
      if (overlaps(allBase[i], allBase[j])) return null;
    }
  }

  // Filter candidates
  // Exclude Grand Tours (23, 55, 60)
  const wtCandidates = races.filter(r => {
    if ([5, 8].includes(r.category_id)) return false; // exclude pro
    if (wtFixedIds.includes(r.id)) return false;
    if (excludeWtIds.includes(r.id)) return false;
    if (r.id === 23 || r.id === 55 || r.id === 60) return false;
    if (hasOverlap(basePro, r)) return false;
    return !hasOverlap(baseWt, r);
  });

  // Sort WT candidates by assignment counts ascending to prioritize low assignment races
  wtCandidates.sort((a, b) => assignmentCounts[a.id] - assignmentCounts[b.id] || a.start_date.localeCompare(b.start_date));

  const currentWt = baseWt.reduce((sum, r) => sum + r.number_of_stages, 0);

  const wtSols = [];
  function recurseWt(idx, current, stages) {
    if (wtSols.length >= 100) return;
    if (stages >= minWt && stages <= maxWt) {
      wtSols.push([...current]);
    }
    if (stages > maxWt || idx >= wtCandidates.length) return;

    // take
    const r = wtCandidates[idx];
    if (!hasOverlap(current, r)) {
      recurseWt(idx + 1, [...current, r], stages + r.number_of_stages);
    }
    // skip
    recurseWt(idx + 1, current, stages);
  }
  recurseWt(0, baseWt, currentWt);

  if (wtSols.length === 0) return null;

  // For each WT solution, search Pro
  for (const wtSol of wtSols) {
    const wtStages = wtSol.reduce((sum, r) => sum + r.number_of_stages, 0);

    const proCandidates = races.filter(r => {
      if (![5, 8].includes(r.category_id)) return false; // only pro
      if (proFixedIds.includes(r.id)) return false;
      if (excludeProIds.includes(r.id)) return false;
      if (hasOverlap(wtSol, r)) return false;
      return !hasOverlap(basePro, r);
    });

    // Sort Pro candidates by assignment counts ascending
    proCandidates.sort((a, b) => assignmentCounts[a.id] - assignmentCounts[b.id] || a.start_date.localeCompare(b.start_date));

    const currentPro = basePro.reduce((sum, r) => sum + r.number_of_stages, 0);

    let foundPro = null;
    function recursePro(idx, current, stages) {
      if (foundPro) return;
      if (stages >= minPro && stages <= maxPro) {
        const total = wtStages + stages;
        if (total >= minTotal && total <= maxTotal) {
          foundPro = [...current];
        }
        return;
      }
      if (stages > maxPro || idx >= proCandidates.length) return;

      // take
      const r = proCandidates[idx];
      if (!hasOverlap(current, r)) {
        recursePro(idx + 1, [...current, r], stages + r.number_of_stages);
      }
      // skip
      recursePro(idx + 1, current, stages);
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

// Early season preps candidates (Jan/Feb)
// Let's define disjoint sets of early preps for 22, 23, 24
// 22 early preps:
// TDU (1, WT, 6), Muscat (22, Pro, 1), Oman (11, Pro, 5). Wait! TDU + Muscat + Oman do not overlap with each other:
// TDU (Jan 20-25), Muscat (Feb 6), Oman (Feb 7-11). (Btw, Muscat and Oman do not overlap, Muscat is Feb 6, Oman is Feb 7).
// 23 early preps:
// UAE (10, WT, 7), Valencia (5, Pro, 5), Almeria (8, Pro, 1), Figueira (9, Pro, 1). (Valencia is Feb 4-8, Almeria is Feb 15, Figueira is Feb 14. They do not overlap with UAE Feb 16-22).
// 24 early preps:
// Cadel Evans (4, WT, 1), Surf Coast (2, Pro, 1), Algarve (3, Pro, 5) or Andalucia (12, Pro, 5)

console.log("=== Testing search for P22 ===");
// June coverage: Dauphine (53, WT, 8) or Suisse (54, WT, 5). Let's use 53 or 54.
// Let's select Pro cobbles for P22: [70, 72, 79, 87] (4 races)
const sol22 = solveProgram({
  wtFixedIds: [...wtCobbles, 1, 54, 20], // Brugge (20) has only 1 assignment, TDU (1), Suisse (54)
  proFixedIds: [70, 72, 79, 87, 22, 11], // KBK (70), Nokere (72), Tro-Bro (79), Flandrien (87). Preps: Muscat (22), Oman (11)
  excludeWtIds: [10], // exclude UAE (used in 23)
  excludeProIds: [5, 8, 9, 3, 12, 93], // exclude Valencia, Almeria, Figueira, Algarve, Andalucia (used in 23/24), and Paris-Tours
  minWt: 80, maxWt: 95,
  minPro: 30, maxPro: 40,
  minTotal: 120, maxTotal: 130
});
if (sol22) {
  console.log("P22 Found!");
  const p22ProCobbles = sol22.pro.filter(r => proCobblesPool.includes(r.id)).map(r => r.id);
  console.log("P22 Pro Cobbles:", p22ProCobbles);
}

console.log("\n=== Testing search for P23 ===");
// May/June coverage: Boucles de la Mayenne (106, Pro, 4) starts May 28, Slovenia (110, Pro, 5) starts Jun 17, Norway (107, Pro, 4) starts May 28
// Pro cobbles for P23: [70, 72, 93] (3 races. Overlap with P22: [70, 72] - which is 2 races, exactly 50% of 23's cobble list, or 50% of 22's cobble list).
// Preps for P23: UAE (10, WT), Valencia (5, Pro), Almeria (8, Pro), Figueira (9, Pro)
const sol23 = solveProgram({
  wtFixedIds: [...wtCobbles, 10], // UAE (10)
  proFixedIds: [70, 72, 93, 5, 8, 9, 106, 110], // Valencia (5), Almeria (8), Figueira (9), Mayenne (106, low assignments), Slovenia (110, low assignments)
  excludeWtIds: [1, 54, 20], // exclude P22 fixed WT
  excludeProIds: [22, 11, 79, 87, 3, 12], // exclude P22 fixed Pro
  minWt: 80, maxWt: 95,
  minPro: 30, maxPro: 40,
  minTotal: 120, maxTotal: 130
});
if (sol23) {
  console.log("P23 Found!");
  const p23ProCobbles = sol23.pro.filter(r => proCobblesPool.includes(r.id)).map(r => r.id);
  console.log("P23 Pro Cobbles:", p23ProCobbles);
}

console.log("\n=== Testing search for P24 ===");
// 150 days (145-155), 20% WT / 80% Pro -> WT: 25-35, Pro: 110-125
// Pro cobbles: [79, 87, 93] (3 races. Overlap with 22: [79, 87] (2); overlap with 23: [93] (1). Max overlap is 2, which is <= 50% of 22/23 pool).
// Preps: Cadel Evans (4, WT), Surf Coast (2, Pro), Algarve (3, Pro) or Andalucia (12, Pro)
// P24 has many Pro Series races since it is Pro heavy.
const sol24 = solveProgram({
  wtFixedIds: [...wtCobbles, 4], // WT Cobbles + Cadel Evans (4)
  proFixedIds: [79, 87, 93, 2, 3, 12, 103], // Pro Cobbles, Surf Coast (2), Algarve (3), Andalucia (12), Turkey (103)
  excludeWtIds: [1, 10, 20, 54], // exclude P22/23 fixed WT
  excludeProIds: [70, 72, 22, 11, 5, 8, 9], // exclude P22/23 fixed Pro
  minWt: 22, maxWt: 38,
  minPro: 110, maxPro: 130,
  minTotal: 145, maxTotal: 155
});
if (sol24) {
  console.log("P24 Found!");
}
