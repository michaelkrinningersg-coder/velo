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
  15, 21, 45, 46, 25, 27, 20
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

// We'll hardcode some sample Spring IDs from Program 10 & 11 to analyze
const sampleP10P11SpringIds = new Set([
  29, 30, 28, // AGR, Fleche, Liege (Mandatory spring)
  1, 10, // TDU, UAE (Early foundation, not spring - they are in Jan/Feb)
  16, 17, // Strade, Sanremo (March)
  19, // Paris-Nice (March)
  50, // Catalunya (March)
  51, // Basque Country (April)
  52, // Romandie (April/May)
  26  // Brabantse Pijl
]);

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

console.log("Running Program 12 trials and printing diagnostic details...");

const proStagesCounts = {};

for (let trial = 0; trial < 10000; trial++) {
  // 1. Shuffled WT
  const shufWt = [...candidatesWt].sort(() => Math.random() - 0.5);
  const selectedWt = [...initialWt];
  let wtStages = 45;
  for (const r of shufWt) {
    if (wtStages + r.number_of_stages <= 51 && !hasOverlap(selectedWt, r)) {
      selectedWt.push(r);
      wtStages += r.number_of_stages;
    }
  }
  if (wtStages !== 51) continue;

  // 2. Shuffled Pro
  const shufPro = candidatesPro.filter(r => !hasOverlap(selectedWt, r)).sort(() => Math.random() - 0.5);
  const selectedPro = [...initialPro];
  let proStages = 1;
  for (const r of shufPro) {
    if (proStages + r.number_of_stages <= 94 && !hasOverlap(selectedPro, r)) {
      selectedPro.push(r);
      proStages += r.number_of_stages;
    }
  }
  
  proStagesCounts[proStages] = (proStagesCounts[proStages] || 0) + 1;
}

console.log("Pro stages distribution reached in trials:");
console.log(proStagesCounts);
db.close();
