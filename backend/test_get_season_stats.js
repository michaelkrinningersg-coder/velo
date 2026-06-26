const { GameRepository } = require('./dist/backend/src/db/GameRepository_actual.js');
const Database = require('better-sqlite3');
const db = new Database('C:/Users/mkrinninger/.velo/savegames/a_1781271884931.db');

const repo = new GameRepository(db);
try {
  const stats = repo.getSeasonRaceStatsByRiderId(2026, [1], true);
  console.log('Stats:', stats);
} catch (e) {
  console.error('Error calling getSeasonRaceStatsByRiderId:', e);
}
db.close();
