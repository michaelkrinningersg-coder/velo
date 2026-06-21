const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const savegamesDir = path.join('C:', 'Users', 'micha', '.velo', 'savegames');

function findLatestSavegame() {
  if (!fs.existsSync(savegamesDir)) {
    throw new Error(`Savegame directory does not exist: ${savegamesDir}`);
  }
  const files = fs.readdirSync(savegamesDir)
    .filter(f => f.endsWith('.db') && !f.includes('tmp'))
    .map(f => ({
      name: f,
      path: path.join(savegamesDir, f),
      size: fs.statSync(path.join(savegamesDir, f)).size
    }));
  
  if (files.length === 0) {
    throw new Error('No savegame databases found.');
  }
  
  files.sort((a, b) => b.size - a.size);
  console.log(`Selecting savegame database: ${files[0].name}`);
  return files[0].path;
}

const dbPath = findLatestSavegame();
const db = new Database(dbPath);

try {
  // Query targets before update
  console.log('\n=== CURRENT VALUES BEFORE UPDATE ===');
  
  const targets = [
    { name: 'Auto Potential 61' },
    { name: 'Auto Potential 146' },
    { name: 'Auto Potential 178' },
    { name: 'Auto Potential 192' },
    { name: 'Hybrid Sprint-Berg Potential' }
  ];

  const getPreset = db.prepare('SELECT preset_id, display_name, min_pot_mountain, max_pot_mountain, min_pot_sprint, max_pot_sprint FROM newgen_potential_presets WHERE display_name = ?');
  
  targets.forEach(t => {
    const row = getPreset.get(t.name);
    if (row) {
      console.log(`- ID: ${row.preset_id} | Name: ${row.display_name} | MOUNTAIN: [${row.min_pot_mountain}, ${row.max_pot_mountain}] | SPRINT: [${row.min_pot_sprint}, ${row.max_pot_sprint}]`);
    } else {
      console.log(`- Not found: ${t.name}`);
    }
  });

  console.log('\nUpdating presets...');

  db.transaction(() => {
    // 1. Auto Potential 61 -> max_pot_sprint = 75
    db.prepare(`
      UPDATE newgen_potential_presets 
      SET max_pot_sprint = 75 
      WHERE display_name = 'Auto Potential 61'
    `).run();

    // 2. Auto Potential 146 -> min_pot_sprint = 70, max_pot_sprint = 75
    db.prepare(`
      UPDATE newgen_potential_presets 
      SET min_pot_sprint = 70, max_pot_sprint = 75 
      WHERE display_name = 'Auto Potential 146'
    `).run();

    // 3. Auto Potential 178 -> max_pot_mountain = 77
    db.prepare(`
      UPDATE newgen_potential_presets 
      SET max_pot_mountain = 77 
      WHERE display_name = 'Auto Potential 178'
    `).run();

    // 4. Auto Potential 192 -> min_pot_sprint = 68, max_pot_sprint = 74
    db.prepare(`
      UPDATE newgen_potential_presets 
      SET min_pot_sprint = 68, max_pot_sprint = 74 
      WHERE display_name = 'Auto Potential 192'
    `).run();

    // 5. Hybrid Sprint-Berg Potential -> max_pot_sprint = 78
    db.prepare(`
      UPDATE newgen_potential_presets 
      SET max_pot_sprint = 78 
      WHERE display_name = 'Hybrid Sprint-Berg Potential'
    `).run();
  })();

  console.log('\n=== VALUES AFTER UPDATE ===');
  targets.forEach(t => {
    const row = getPreset.get(t.name);
    if (row) {
      console.log(`- ID: ${row.preset_id} | Name: ${row.display_name} | MOUNTAIN: [${row.min_pot_mountain}, ${row.max_pot_mountain}] | SPRINT: [${row.min_pot_sprint}, ${row.max_pot_sprint}]`);
    }
  });

} catch (err) {
  console.error('Error during presets update:', err);
} finally {
  db.close();
}
