const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const dbPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/assets/world_data.db';
const db = new Database(dbPath);

const races = db.prepare(`
  SELECT r.id, r.name, r.category_id, cat.name AS cat_name, r.start_date, r.end_date, r.number_of_stages, r.is_stage_race
  FROM races r
  JOIN race_categories cat ON cat.id = r.category_id
`).all();

const stages = db.prepare(`SELECT id, race_id, profile FROM stages`).all();

const raceProfiles = new Map();
races.forEach(r => {
  raceProfiles.set(r.id, {
    flat: 0,
    rolling: 0,
    hilly: 0,
    mountain: 0,
    other: 0
  });
});

stages.forEach(s => {
  const prof = raceProfiles.get(s.race_id);
  if (prof) {
    const p = s.profile.toLowerCase();
    if (p.includes('flat')) prof.flat++;
    else if (p.includes('roll')) prof.rolling++;
    else if (p.includes('hill')) prof.hilly++;
    else if (p.includes('mountain') || p.includes('pass')) prof.mountain++;
    else prof.other++;
  }
});

const enrichedRaces = races.map(r => {
  const prof = raceProfiles.get(r.id);
  const total = r.number_of_stages;
  const flatRollingPct = total > 0 ? (prof.flat + prof.rolling) / total : 1.0; // classics are 1 stage
  return {
    ...r,
    profiles: prof,
    flatRollingPct,
    isSprinterFriendly: prof.mountain === 0 && (prof.flat + prof.rolling) >= (total / 2)
  };
});

console.log("=== Sprinter Friendly Stage Races and Classics ===");
enrichedRaces.forEach(r => {
  if (r.isSprinterFriendly) {
    console.log(`ID: ${String(r.id).padStart(3)} | ${r.name.padEnd(50)} | Cat: ${r.category_id} | Stages: ${r.number_of_stages} | F/R Pct: ${(r.flatRollingPct * 100).toFixed(0)}% | Flat: ${r.profiles.flat}, Roll: ${r.profiles.rolling}, Hill: ${r.profiles.hilly}, Mtn: ${r.profiles.mountain}`);
  }
});

db.close();
