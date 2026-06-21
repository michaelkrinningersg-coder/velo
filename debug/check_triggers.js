const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const savegamesDir = path.join('C:', 'Users', 'micha', '.velo', 'savegames');
const files = fs.readdirSync(savegamesDir)
  .filter(f => f.endsWith('.db') && !f.includes('tmp'))
  .map(f => ({
    name: f,
    path: path.join(savegamesDir, f),
    size: fs.statSync(path.join(savegamesDir, f)).size
  }));
files.sort((a, b) => b.size - a.size);
const db = new Database(files[0].path, { readonly: true });

console.log("Triggers:");
console.log(db.prepare("SELECT name, tbl_name, sql FROM sqlite_master WHERE type = 'trigger'").all());

db.close();
