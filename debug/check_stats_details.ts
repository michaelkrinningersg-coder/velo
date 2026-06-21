import Database from 'better-sqlite3';
import * as path from 'path';

const dbPath = path.join(__dirname, 'stages_test.db');
const db = new Database(dbPath, { readonly: true });

try {
  console.log("=== DB CHECK AFTER TRANSITION TO 2027 ===");

  // 1. Check game state
  const gameState = db.prepare('SELECT * FROM game_state WHERE id = 1').get() as any;
  console.log("Game State:", gameState);

  // 2. Check retired riders count
  const retiredRiders = db.prepare('SELECT id, first_name, last_name FROM riders WHERE is_retired = 1').all() as any[];
  console.log(`Retired riders count: ${retiredRiders.length}`);
  if (retiredRiders.length > 0) {
    console.log("Sample retired riders:", retiredRiders.slice(0, 3));
  }

  // 3. Check if retired riders are present in results (needed for career stats and all-time stats)
  const totalResults = db.prepare('SELECT COUNT(*) as count FROM results').get() as any;
  console.log(`Total results in results table: ${totalResults.count}`);

  const retiredWithResults = db.prepare(`
    SELECT r.id, r.first_name, r.last_name, COUNT(res.id) AS result_count 
    FROM riders r 
    JOIN results res ON res.rider_id = r.id 
    WHERE r.is_retired = 1 
    GROUP BY r.id 
    ORDER BY result_count DESC 
    LIMIT 5
  `).all() as any[];
  console.log("Retired riders with results:", retiredWithResults);

  if (retiredWithResults.length > 0) {
    const sampleRider = retiredWithResults[0];
    const retiredCareer = db.prepare('SELECT * FROM rider_career_stats WHERE rider_id = ?').get(sampleRider.id) as any;
    console.log(`Career stats for retired rider (ID ${sampleRider.id} ${sampleRider.first_name} ${sampleRider.last_name}):`, retiredCareer);
  } else {
    console.log("No retired riders with results found in database. Checking if there are active riders with results...");
    const activeWithResults = db.prepare(`
      SELECT r.id, r.first_name, r.last_name, COUNT(res.id) AS result_count 
      FROM riders r 
      JOIN results res ON res.rider_id = r.id 
      WHERE r.is_retired = 0 
      GROUP BY r.id 
      ORDER BY result_count DESC 
      LIMIT 5
    `).all() as any[];
    console.log("Active riders with results:", activeWithResults);
  }

  // 4. Check season stats tables for 2026 vs 2027
  const seasonStats2026 = db.prepare('SELECT COUNT(*) as count FROM rider_season_stats WHERE season = 2026').get() as any;
  const seasonStats2027 = db.prepare('SELECT COUNT(*) as count FROM rider_season_stats WHERE season = 2027').get() as any;
  console.log(`Rider season stats: 2026 count = ${seasonStats2026.count}, 2027 count = ${seasonStats2027.count}`);

  // 5. Check if form history is cleared (rider_form_history)
  const formHistoryCount = db.prepare('SELECT COUNT(*) as count FROM rider_form_history').get() as any;
  const formHistoryDates = db.prepare('SELECT DISTINCT date FROM rider_form_history').all() as any[];
  console.log(`Rider form history entries: ${formHistoryCount.count} (expected: 1231 if cleared and only 2027-01-01 exists)`);
  console.log("Distinct dates in form history:", formHistoryDates);

  // 6. Check form events in rider_r_form_events for active vs retired
  const formEventsTotal = db.prepare('SELECT COUNT(*) as count FROM rider_r_form_events').get() as any;
  console.log(`Form events in rider_r_form_events: ${formEventsTotal.count}`);

  // 7. Check fatigue values in rider_daily_state (should be reset to 0.0)
  const fatigueSample = db.prepare(`
    SELECT short_term_fatigue, long_term_fatigue_decayable, long_term_fatigue_locked 
    FROM rider_daily_state 
    LIMIT 5
  `).all() as any[];
  console.log("Sample rider fatigue values:", fatigueSample);

  // 8. Check if there are any results in 2027 (re-initialized)
  const results2027 = db.prepare(`
    SELECT COUNT(*) as count 
    FROM results res 
    JOIN stages s ON s.id = res.stage_id 
    WHERE s.date LIKE '2027%'
  `).get() as any;
  console.log(`Results in 2027: ${results2027.count} (expected: 0)`);

  // 9. Extra diagnostic: stages count and results by year
  const stagesCount = db.prepare('SELECT COUNT(*) as count FROM stages').get() as any;
  const uniqueStagesInResults = db.prepare('SELECT COUNT(DISTINCT stage_id) as count FROM results').get() as any;
  const resultsByYear = db.prepare(`
    SELECT CAST(substr(s.date, 1, 4) AS INTEGER) as year, COUNT(*) as count 
    FROM results r 
    JOIN stages s ON s.id = r.stage_id 
    GROUP BY year
  `).all() as any[];
  console.log(`Total stages in DB: ${stagesCount.count}`);
  console.log(`Unique stage_ids in results: ${uniqueStagesInResults.count}`);
  console.log("Results grouped by stage year:", resultsByYear);

} catch (err) {
  console.error("Error during check:", err);
} finally {
  db.close();
}
