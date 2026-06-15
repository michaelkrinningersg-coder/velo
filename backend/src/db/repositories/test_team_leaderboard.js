const Database = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/node_modules/better-sqlite3');
const { LeaderboardRepository } = require('c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/dist/backend/src/db/repositories/LeaderboardRepository');

const savePath = 'C:\\Users\\mkrinninger\\.velo\\savegames\\test_career_1781271978877.db';

try {
  const db = new Database(savePath, { readonly: true });
  const repo = new LeaderboardRepository(db);
  
  console.log('--- TESTING YOUNGEST WINNERS ---');
  const resAll = repo.getLeaderboard('riders', 'youngest_winners', 'alltime', 2026);
  console.log('youngest_winners count:', resAll.length);
  if (resAll.length > 0) console.log('Top youngest winner overall:', resAll[0]);
  
  const resCat1 = repo.getLeaderboard('riders', 'youngest_winners_1', 'alltime', 2026);
  console.log('youngest_winners_1 count:', resCat1.length);
  if (resCat1.length > 0) console.log('Top youngest winner Grand Tour:', resCat1[0]);

} catch (e) {
  console.error(e);
}
