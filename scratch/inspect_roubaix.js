const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const db = new Database('backend/assets/world_data.db');

const race = db.prepare(`SELECT * FROM races WHERE id = 27`).get();
const stages = db.prepare(`SELECT * FROM stages WHERE race_id = 27`).all();

console.log("Race:", race);
console.log("Stages:", stages);
db.close();
