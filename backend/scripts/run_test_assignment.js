const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Copy world_data.db to test_assignment.db
const masterDbPath = path.resolve(__dirname, '..', 'assets', 'world_data.db');
const testDbPath = path.resolve(__dirname, '..', 'assets', 'test_assignment.db');

if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}
fs.copyFileSync(masterDbPath, testDbPath);

console.log('Copied world_data.db to test_assignment.db');

// Run the bootsrapper's table creations if needed
const db = new Database(testDbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS rider_season_programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    season INTEGER NOT NULL,
    rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
    program_id INTEGER NOT NULL REFERENCES race_programs(id),
    assigned_on TEXT NOT NULL,
    UNIQUE(season, rider_id)
  );

  CREATE INDEX IF NOT EXISTS idx_rider_season_programs_program
    ON rider_season_programs(season, program_id);

  CREATE TABLE IF NOT EXISTS rider_lieutenants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    season INTEGER NOT NULL,
    leader_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
    lieutenant_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
    UNIQUE(season, leader_id),
    UNIQUE(season, lieutenant_id)
  );

  CREATE TABLE IF NOT EXISTS lieutenant_all_time_peaks (
    rider_id INTEGER PRIMARY KEY REFERENCES riders(id) ON DELETE CASCADE,
    max_overall_rating INTEGER NOT NULL,
    leader_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
    season INTEGER NOT NULL
  );
`);

// Delete existing assignments for season 2026 to force fresh assignment
db.prepare('DELETE FROM rider_season_programs WHERE season = 2026').run();

// Load the compiled RiderProgramService
const servicePath = path.resolve(__dirname, '..', 'dist', 'backend', 'src', 'game', 'RiderProgramService.js');
const { RiderProgramService } = require(servicePath);

const service = new RiderProgramService(db);
console.log('Running ensureSeasonPrograms for season 2026...');
service.ensureSeasonPrograms(2026);

// Report statistics
const stats = db.prepare(`
  SELECT rp.name AS program_name, COUNT(rsp.id) AS rider_count
  FROM rider_season_programs rsp
  JOIN race_programs rp ON rp.id = rsp.program_id
  WHERE rsp.season = 2026
  GROUP BY rp.name
  ORDER BY rp.name ASC
`).all();

console.log('\n=== RIDER PROGRAM COUNTS ===');
let totalAssigned = 0;
for (const s of stats) {
  console.log(`${s.program_name}: ${s.rider_count} riders`);
  totalAssigned += s.rider_count;
}
console.log(`Total assigned: ${totalAssigned}`);

// Role distribution per program
const roleStats = db.prepare(`
  SELECT rp.name AS program_name, COALESCE(role.name, 'Wassertraeger') AS role_name, COUNT(rsp.id) AS count
  FROM rider_season_programs rsp
  JOIN race_programs rp ON rp.id = rsp.program_id
  JOIN riders r ON r.id = rsp.rider_id
  LEFT JOIN sta_role role ON role.id = r.role_id
  WHERE rsp.season = 2026
  GROUP BY rp.name, role_name
  ORDER BY rp.name ASC, count DESC
`).all();

console.log('\n=== ROLE DISTRIBUTION PER PROGRAM ===');
const programRoles = {};
for (const rs of roleStats) {
  if (!programRoles[rs.program_name]) {
    programRoles[rs.program_name] = [];
  }
  programRoles[rs.program_name].push(`${rs.role_name}: ${rs.count}`);
}

for (const [progName, roles] of Object.entries(programRoles)) {
  console.log(`${progName} -> ${roles.join(', ')}`);
}

// Export detailed role counts to CSV under debug folder
const debugDir = path.resolve(__dirname, '..', '..', 'debug');
if (!fs.existsSync(debugDir)) {
  fs.mkdirSync(debugDir, { recursive: true });
}

const csvRows = [
  'program_id,program_name,total_riders,Kapitaen,Co_Kapitaen,Sprinter,Edelhelfer,Starke_Helfer,Wassertraeger'
];

const roleCounts = db.prepare(`
  SELECT 
    rp.id AS program_id,
    rp.name AS program_name,
    COUNT(rsp.id) AS total_riders,
    SUM(CASE WHEN rsp.id IS NOT NULL AND COALESCE(role.name, 'Wassertraeger') = 'Kapitaen' THEN 1 ELSE 0 END) AS Kapitaen,
    SUM(CASE WHEN rsp.id IS NOT NULL AND COALESCE(role.name, 'Wassertraeger') = 'Co-Kapitaen' THEN 1 ELSE 0 END) AS Co_Kapitaen,
    SUM(CASE WHEN rsp.id IS NOT NULL AND COALESCE(role.name, 'Wassertraeger') = 'Sprinter' THEN 1 ELSE 0 END) AS Sprinter,
    SUM(CASE WHEN rsp.id IS NOT NULL AND COALESCE(role.name, 'Wassertraeger') = 'Edelhelfer' THEN 1 ELSE 0 END) AS Edelhelfer,
    SUM(CASE WHEN rsp.id IS NOT NULL AND COALESCE(role.name, 'Wassertraeger') = 'Starke Helfer' THEN 1 ELSE 0 END) AS Starke_Helfer,
    SUM(CASE WHEN rsp.id IS NOT NULL AND COALESCE(role.name, 'Wassertraeger') = 'Wassertraeger' THEN 1 ELSE 0 END) AS Wassertraeger
  FROM race_programs rp
  LEFT JOIN rider_season_programs rsp ON rsp.program_id = rp.id AND rsp.season = 2026
  LEFT JOIN riders r ON r.id = rsp.rider_id
  LEFT JOIN sta_role role ON role.id = r.role_id
  GROUP BY rp.id, rp.name
  ORDER BY rp.id ASC
`).all();

for (const row of roleCounts) {
  csvRows.push(`${row.program_id},${row.program_name},${row.total_riders},${row.Kapitaen},${row.Co_Kapitaen},${row.Sprinter},${row.Edelhelfer},${row.Starke_Helfer},${row.Wassertraeger}`);
}

const csvPath = path.join(debugDir, 'program_role_counts.csv');
fs.writeFileSync(csvPath, csvRows.join('\n') + '\n', 'utf8');
console.log(`\nSaved role distribution stats to CSV: ${csvPath}`);

db.close();
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}
console.log('\nDone!');
