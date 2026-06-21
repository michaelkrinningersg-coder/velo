const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join('C:', 'Users', 'micha', '.velo', 'savegames', 'a_1781957994019.db');
const db = new Database(dbPath, { readonly: true });

try {
  const potPresets = db.prepare('SELECT * FROM newgen_potential_presets').all();
  const startPresets = db.prepare('SELECT * FROM newgen_start_presets').all();
  
  if (potPresets.length > 0) {
    console.log('Columns in newgen_potential_presets:', Object.keys(potPresets[0]));
  }
  if (startPresets.length > 0) {
    console.log('Columns in newgen_start_presets:', Object.keys(startPresets[0]));
  }

  // Write newgen_potential_presets to CSV
  const potCsvPath = path.join(__dirname, 'newgen_potential_presets.csv');
  let potCsvContent = Object.keys(potPresets[0] || {}).join(';') + '\n';
  for (const row of potPresets) {
    potCsvContent += Object.values(row).join(';') + '\n';
  }
  fs.writeFileSync(potCsvPath, potCsvContent, 'utf8');
  console.log(`Saved newgen_potential_presets to ${potCsvPath}`);

  // Write newgen_start_presets to CSV
  const startCsvPath = path.join(__dirname, 'newgen_start_presets.csv');
  let startCsvContent = Object.keys(startPresets[0] || {}).join(';') + '\n';
  for (const row of startPresets) {
    startCsvContent += Object.values(row).join(';') + '\n';
  }
  fs.writeFileSync(startCsvPath, startCsvContent, 'utf8');
  console.log(`Saved newgen_start_presets to ${startCsvPath}`);

  // We check which presets have:
  // 1. max_pot_mountain >= 73 AND max_pot_sprint >= 76
  // 2. max_pot_mountain >= 76 AND max_pot_sprint >= 73
  console.log('\n=== POTENTIAL PRESET ANALYSES ===');
  
  console.log('\n1. Presets with max_pot_mountain >= 73 AND max_pot_sprint >= 76:');
  const matches1 = potPresets.filter(p => p.max_pot_mountain >= 73 && p.max_pot_sprint >= 76);
  if (matches1.length > 0) {
    matches1.forEach(p => {
      console.log(`- Type: ${p.type_key || 'N/A'} (Weight: ${p.weight}) | Pot MOUNTAIN: [${p.min_pot_mountain}, ${p.max_pot_mountain}] | Pot SPRINT: [${p.min_pot_sprint}, ${p.max_pot_sprint}]`);
    });
  } else {
    console.log('None found.');
  }

  console.log('\n2. Presets with max_pot_mountain >= 76 AND max_pot_sprint >= 73:');
  const matches2 = potPresets.filter(p => p.max_pot_mountain >= 76 && p.max_pot_sprint >= 73);
  if (matches2.length > 0) {
    matches2.forEach(p => {
      console.log(`- Type: ${p.type_key || 'N/A'} (Weight: ${p.weight}) | Pot MOUNTAIN: [${p.min_pot_mountain}, ${p.max_pot_mountain}] | Pot SPRINT: [${p.min_pot_sprint}, ${p.max_pot_sprint}]`);
    });
  } else {
    console.log('None found.');
  }

} catch (err) {
  console.error('Error:', err);
} finally {
  db.close();
}
