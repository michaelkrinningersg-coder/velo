const Database = require('better-sqlite3');
const fs = require('fs');

const originalPath = 'C:\\Users\\micha\\.velo\\savegames\\a_1782806075476.db';
const testPath = 'C:\\Users\\micha\\.velo\\savegames\\a_1782806075476_vacuum_test.db';

if (!fs.existsSync(originalPath)) {
  console.error('Savegame not found!');
  process.exit(1);
}

fs.copyFileSync(originalPath, testPath);

const db = new Database(testPath);

try {
  const initialVacuum = db.pragma('auto_vacuum', { simple: true });
  console.log(`Initial auto_vacuum: ${initialVacuum}`);

  if (initialVacuum === 0) {
    console.log('Setting auto_vacuum = FULL...');
    db.pragma('auto_vacuum = FULL');
    
    console.log('Running VACUUM to apply auto-vacuum format...');
    db.prepare('VACUUM').run();
  }

  const afterVacuum = db.pragma('auto_vacuum', { simple: true });
  console.log(`After auto_vacuum: ${afterVacuum}`);

  // Measure size before delete
  const sizeBefore = fs.statSync(testPath).size;
  console.log(`Size before delete: ${sizeBefore} bytes`);

  // Delete some rows from rider_fatigue_history
  console.log('Deleting rows older than 2026-03-15...');
  db.prepare("DELETE FROM rider_fatigue_history WHERE date < '2026-03-15'").run();

  const freelistCount = db.pragma('freelist_count', { simple: true });
  console.log(`Freelist count after delete: ${freelistCount}`);

  // Try closing the connection to see if it truncates on close
  db.close();
  const sizeAfterClose = fs.statSync(testPath).size;
  console.log(`Size after close: ${sizeAfterClose} bytes`);
  console.log(`Shrunk by: ${sizeBefore - sizeAfterClose} bytes`);

} catch (e) {
  console.error('Error:', e.message);
} finally {
  try { db.close(); } catch(e) {}
  fs.unlinkSync(testPath);
}
