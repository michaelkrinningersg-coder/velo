const Database = require('better-sqlite3');
const { DatabaseService } = require('./dist/backend/src/db/DatabaseService.js');

const dbPath = 'C:/Users/mkrinninger/.velo/savegames/a_1781271884931.db';
const db = new Database(dbPath);

console.log('Connecting to database:', dbPath);

// Instantiate DatabaseService and run ensureAllSchemas
const dbService = new DatabaseService();
dbService.ensureAllSchemas(db);

console.log('ensureAllSchemas executed.');

const tables = db.prepare("SELECT name, type FROM sqlite_master WHERE type IN ('table', 'view') ORDER BY name ASC").all();
console.log('\n--- TABLES & VIEWS AFTER RUN ---');
console.log(tables);

db.close();
