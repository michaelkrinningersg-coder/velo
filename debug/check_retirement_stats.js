const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join('C:', 'Users', 'micha', '.velo', 'savegames', 'a_1781957994019.db');
const db = new Database(dbPath, { readonly: true });

const season = 2027;
const freeAgentsAge29Plus = db.prepare(`
  SELECT r.id, r.first_name, r.last_name, (? - r.birth_year) as age, r.role_id, sr.name as role_name
  FROM riders r
  LEFT JOIN sta_role sr ON r.role_id = sr.id
  WHERE r.is_retired = 0
    AND (? - r.birth_year) >= 29
    AND r.id NOT IN (
      SELECT rider_id FROM contracts WHERE status IN ('active', 'future')
    )
`).all(season, season);

console.log(`Riders age >= 29 with no active/future contract: ${freeAgentsAge29Plus.length}`);
for (const c of freeAgentsAge29Plus.slice(0, 10)) {
  console.log(`- ${c.first_name} ${c.last_name}, Age: ${c.age}, Role: ${c.role_name}`);
}

db.close();
