const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '..', 'assets', 'world_data.db');
const db = new Database(dbPath);

const SPECIALIZATION_IDS = [1, 2, 3, 4, 5, 6];
const specAbbrMap = { 1: 'B', 2: 'H', 3: 'S', 4: 'T', 5: 'P', 6: 'A' };

function resolveSkillScores(row) {
  return {
    1: row.skill_mountain * 0.45 + row.skill_medium_mountain * 0.25 + row.skill_recuperation * 0.15 + row.skill_stamina * 0.15,
    2: row.skill_hill * 0.4 + row.skill_medium_mountain * 0.2 + row.skill_acceleration * 0.15 + row.skill_attack * 0.15 + row.skill_resistance * 0.1,
    3: row.skill_sprint * 0.4 + row.skill_acceleration * 0.25 + row.skill_flat * 0.15 + row.skill_bike_handling * 0.1 + row.skill_resistance * 0.1,
    4: row.skill_time_trial * 0.45 + row.skill_prologue * 0.25 + row.skill_flat * 0.15 + row.skill_stamina * 0.15,
    5: row.skill_cobble * 0.55 + row.skill_flat * 0.15 + row.skill_bike_handling * 0.15 + row.skill_resistance * 0.15,
    6: (row.skill_attack * 0.35 + row.skill_stamina * 0.2 + row.skill_resistance * 0.2 + row.skill_hill * 0.15 + row.skill_acceleration * 0.1) * 0.97,
  };
}

function resolveBestSpecIds(row) {
  const seededSpecs = [
    row.specialization_1_id,
    row.specialization_2_id,
    row.specialization_3_id,
  ].filter(id => id != null);

  if (seededSpecs.length >= 3) {
    return seededSpecs.slice(0, 3);
  }

  const scores = resolveSkillScores(row);
  const missingSpecs = SPECIALIZATION_IDS
    .filter(id => !seededSpecs.includes(id))
    .sort((a, b) => scores[b] - scores[a] || a - b);

  return [...seededSpecs, ...missingSpecs.slice(0, 3 - seededSpecs.length)];
}

const riders = db.prepare(`
  SELECT id, specialization_1_id, specialization_2_id, specialization_3_id,
         skill_flat, skill_mountain, skill_medium_mountain, skill_hill,
         skill_time_trial, skill_prologue, skill_cobble, skill_sprint,
         skill_acceleration, skill_downhill, skill_attack, skill_stamina,
         skill_resistance, skill_recuperation, skill_bike_handling
  FROM riders
  WHERE is_retired = 0
`).all();

const orderedCounts = {};
const sortedCounts = {};

for (const r of riders) {
  const specs = resolveBestSpecIds(r);
  const orderedAbbr = specs.map(id => specAbbrMap[id]).join('');
  const sortedAbbr = [...specs].sort((a, b) => a - b).map(id => specAbbrMap[id]).join('');

  orderedCounts[orderedAbbr] = (orderedCounts[orderedAbbr] || 0) + 1;
  sortedCounts[sortedAbbr] = (sortedCounts[sortedAbbr] || 0) + 1;
}

console.log('=== ORDERED COMBINATIONS (EXACT MATCH) ===');
const orderedEntries = Object.entries(orderedCounts).sort((a, b) => b[1] - a[1]);
for (const [combo, count] of orderedEntries) {
  console.log(`${combo}: ${count}`);
}

console.log('\n=== SORTED COMBINATIONS ===');
const sortedEntries = Object.entries(sortedCounts).sort((a, b) => b[1] - a[1]);
for (const [combo, count] of sortedEntries) {
  console.log(`${combo}: ${count}`);
}

db.close();
