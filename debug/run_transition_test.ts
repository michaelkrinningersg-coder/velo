import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { GameStateService } from '../backend/src/game/GameStateService';
import { RiderDevelopmentService } from '../backend/src/game/RiderDevelopmentService';

// Ensure debug directory exists
const debugDir = path.join(__dirname);
const draftOutputDir = path.join(debugDir, 'draft');
if (!fs.existsSync(draftOutputDir)) {
  fs.mkdirSync(draftOutputDir, { recursive: true });
}

const savegamesDir = path.join('C:', 'Users', 'micha', '.velo', 'savegames');
const tempDbPath = path.join(debugDir, 'draft_test.db');

function findLatestSavegame(): string {
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
  console.log(`Found ${files.length} savegame files. Selecting the largest one: ${files[0].name} (${(files[0].size / 1024 / 1024).toFixed(2)} MB)`);
  return files[0].path;
}

// Function to write a team roster to CSV
function writeRosterToCsv(db: Database.Database, teamId: number, fileSlug: string, year: number, suffix: string) {
  const roster = db.prepare(`
    SELECT r.id, r.first_name, r.last_name, r.birth_year, r.overall_rating, r.pot_overall, sr.name as role_name,
           c.start_season, c.end_season, c.status
    FROM riders r
    JOIN contracts c ON c.rider_id = r.id
    LEFT JOIN sta_role sr ON r.role_id = sr.id
    WHERE c.team_id = ? AND c.status = 'active'
    ORDER BY r.overall_rating DESC
  `).all(teamId) as any[];

  const csvPath = path.join(draftOutputDir, `roster_${fileSlug}_${year}_${suffix}.csv`);
  let csvContent = 'Rider ID;First Name;Last Name;Birth Year;Age in Season;Overall Rating;Potential Overall;Role;Contract Start;Contract End\n';
  
  for (const r of roster) {
    const age = year - r.birth_year;
    csvContent += `${r.id};${r.first_name};${r.last_name};${r.birth_year};${age};${r.overall_rating.toFixed(2)};${r.pot_overall.toFixed(2)};${r.role_name || 'None'};${r.start_season};${r.end_season}\n`;
  }
  
  fs.writeFileSync(csvPath, csvContent, 'utf8');
}

async function main() {
  console.log('=== MULTI-SEASON TRANSITION, DEVELOPMENT AND DRAFT SIMULATION (3 SEASONS) ===');
  
  const srcDbPath = findLatestSavegame();
  console.log(`Copying database from ${srcDbPath} to ${tempDbPath}...`);
  fs.copyFileSync(srcDbPath, tempDbPath);
  
  const db = new Database(tempDbPath);
  
  try {
    const targetTeams = [
      { id: 25, name: 'Falke - Scott', fileSlug: 'falke_scott' },
      { id: 7, name: 'Philips - Santander', fileSlug: 'philips_santander' },
      { id: 2, name: 'Decathlon - Renault', fileSlug: 'decathlon_renault' }
    ];

    // 1. Export initial rosters for 2026
    console.log('\n--- EXPORTING INITIAL ROSTERS (2026) ---');
    for (const team of targetTeams) {
      writeRosterToCsv(db, team.id, team.fileSlug, 2026, 'initial');
      console.log(`Initial 2026 roster for ${team.name} written.`);
    }

    let currentSeason = 2026;

    for (let seasonIdx = 1; seasonIdx <= 3; seasonIdx++) {
      const nextSeason = currentSeason + 1;
      console.log(`\n======================================================================`);
      console.log(`=== SEASON SIMULATION ${seasonIdx}: TRANSITION TO ${nextSeason} ===`);
      console.log(`======================================================================`);

      // Store active riders map before transition to check retirements
      const activeRidersBefore = db.prepare(`
        SELECT r.id, r.first_name, r.last_name, r.birth_year, r.is_retired, r.role_id, sr.name as role_name
        FROM riders r
        LEFT JOIN sta_role sr ON r.role_id = sr.id
        WHERE r.is_retired = 0
      `).all() as any[];
      const activeRidersMap = new Map(activeRidersBefore.map(r => [r.id, r]));

      // A. Trigger season transition
      console.log(`Setting date to ${currentSeason}-12-31 in game_state...`);
      db.prepare("UPDATE game_state SET current_date = ?, season = ? WHERE id = 1").run(`${currentSeason}-12-31`, currentSeason);

      console.log('Simulating day advance (season transition to Jan 1st)...');
      const gss = new GameStateService(db);
      const nextState = gss.advanceDay();
      console.log(`Successfully transitioned! Database now set to Date: ${nextState.currentDate}, Season: ${nextState.season}`);

      // B. Analyze Retirements during this transition
      const retiredRiders = db.prepare(`
        SELECT r.id, r.first_name, r.last_name, r.birth_year, r.retirement_age, r.role_id, sr.name as role_name, r.overall_rating, r.pot_overall
        FROM riders r
        LEFT JOIN sta_role sr ON r.role_id = sr.id
        WHERE r.is_retired = 1
      `).all() as any[];
      
      const newlyRetired = retiredRiders.filter(r => {
        const prev = activeRidersMap.get(r.id);
        return prev && prev.is_retired === 0;
      });
      console.log(`Riders retired in this transition: ${newlyRetired.length}`);

      // C. Analyze Draft picks
      const draftPicks = db.prepare(`
        SELECT 
          d.draft_round, d.pick_number, d.contract_length, d.overall_at_draft, d.pot_overall_at_draft, d.draft_value,
          r.id AS rider_id, r.first_name, r.last_name, r.birth_year, r.specialization_1_id, r.country_id,
          t.id AS team_id, t.name AS team_name, t.abbreviation AS team_abbr, t.ai_focus_1, t.ai_focus_2, t.ai_focus_3,
          ot.id AS old_team_id, ot.name AS old_team_name, ot.abbreviation AS old_team_abbr
        FROM draft_history d
        JOIN riders r ON d.rider_id = r.id
        JOIN teams t ON d.team_id = t.id
        LEFT JOIN teams ot ON d.old_team_id = ot.id
        WHERE d.season = ?
        ORDER BY d.pick_number ASC
      `).all(nextSeason) as any[];

      console.log(`Total draft picks executed: ${draftPicks.length}`);

      console.log('\n--- TARGET TEAMS DRAFT PICKS ---');
      for (const pick of draftPicks) {
        const age = nextSeason - pick.birth_year;
        const isExtension = pick.old_team_id === pick.team_id;
        const typeText = isExtension ? 'EXTENDED' : 'DRAFTED';

        if (targetTeams.some(t => t.id === pick.team_id)) {
          console.log(`  [${pick.team_name}] Pick #${pick.pick_number} (Rd ${pick.draft_round}): ${pick.first_name} ${pick.last_name} (OVR: ${pick.overall_at_draft.toFixed(1)}, Age: ${age}, Old Team: ${pick.old_team_name || 'Free Agent'}, Contract: ${pick.contract_length}y) [${typeText}]`);
        }
      }

      // Reconstruct stats for draft
      let aiFocus1Matches = 0;
      let aiFocus2Matches = 0;
      let aiFocus3Matches = 0;
      let nation1Matches = 0;
      let nation2Matches = 0;
      let nation3Matches = 0;
      let extensionsCount = 0;

      // Reconstruct rosters country count
      const preExistingContracts = db.prepare(`
        SELECT c.team_id, r.country_id
        FROM contracts c
        JOIN riders r ON c.rider_id = r.id
        WHERE c.status IN ('active', 'future')
          AND c.rider_id NOT IN (SELECT rider_id FROM draft_history WHERE season = ?)
      `).all(nextSeason) as Array<{ team_id: number; country_id: number }>;
      
      const teamRostersMap = new Map<number, number[]>();
      for (const c of preExistingContracts) {
        if (!teamRostersMap.has(c.team_id)) teamRostersMap.set(c.team_id, []);
        teamRostersMap.get(c.team_id)!.push(c.country_id);
      }

      for (const pick of draftPicks) {
        const rosterCountries = teamRostersMap.get(pick.team_id) || [];
        const countryCounts = new Map<number, number>();
        for (const cid of rosterCountries) {
          countryCounts.set(cid, (countryCounts.get(cid) || 0) + 1);
        }
        const sortedCountries = [...countryCounts.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(e => e[0]);
        
        const top1Country = sortedCountries[0] ?? null;
        const top2Country = sortedCountries[1] ?? null;
        const top3Country = sortedCountries[2] ?? null;

        const isFocus1 = pick.specialization_1_id !== null && pick.specialization_1_id === pick.ai_focus_1;
        const isFocus2 = pick.specialization_1_id !== null && pick.specialization_1_id === pick.ai_focus_2;
        const isFocus3 = pick.specialization_1_id !== null && pick.specialization_1_id === pick.ai_focus_3;

        const isNation1 = pick.country_id !== null && pick.country_id === top1Country;
        const isNation2 = pick.country_id !== null && pick.country_id === top2Country;
        const isNation3 = pick.country_id !== null && pick.country_id === top3Country;

        if (isFocus1) aiFocus1Matches++;
        if (isFocus2) aiFocus2Matches++;
        if (isFocus3) aiFocus3Matches++;
        if (isNation1) nation1Matches++;
        if (isNation2) nation2Matches++;
        if (isNation3) nation3Matches++;
        if (pick.old_team_id === pick.team_id) extensionsCount++;

        rosterCountries.push(pick.country_id);
        teamRostersMap.set(pick.team_id, rosterCountries);
      }

      console.log(`\n--- DRAFT DIAGNOSTICS (Season ${nextSeason}) ---`);
      console.log(`Contract Extensions (Loyalty Rule): ${extensionsCount} (${(extensionsCount / draftPicks.length * 100).toFixed(1)}%)`);
      console.log(`AI Focus Matches:`);
      console.log(`- matched AI Focus 1 (+4 weight): ${aiFocus1Matches} (${(aiFocus1Matches / draftPicks.length * 100).toFixed(1)}%)`);
      console.log(`- matched AI Focus 2 (+2 weight): ${aiFocus2Matches} (${(aiFocus2Matches / draftPicks.length * 100).toFixed(1)}%)`);
      console.log(`- matched AI Focus 3 (+1 weight): ${aiFocus3Matches} (${(aiFocus3Matches / draftPicks.length * 100).toFixed(1)}%)`);
      console.log(`Roster Nationality Matches:`);
      console.log(`- matched Top 1 Nationality (+4 weight): ${nation1Matches} (${(nation1Matches / draftPicks.length * 100).toFixed(1)}%)`);
      console.log(`- matched Top 2 Nationality (+2 weight): ${nation2Matches} (${(nation2Matches / draftPicks.length * 100).toFixed(1)}%)`);
      console.log(`- matched Top 3 Nationality (+1 weight): ${nation3Matches} (${(nation3Matches / draftPicks.length * 100).toFixed(1)}%)`);

      // D. Export Roster Post-Draft
      for (const team of targetTeams) {
        writeRosterToCsv(db, team.id, team.fileSlug, nextSeason, 'post_draft');
      }

      // E. Simulate Rider Development for this season
      console.log(`\nSimulating rider development for season ${nextSeason} (240 days)...`);
      const rds = new RiderDevelopmentService(db);
      
      // Select 5 sample riders to track strength change before and after development
      const sampleRiders = db.prepare(`
        SELECT id, first_name, last_name, overall_rating, pot_overall, birth_year
        FROM riders
        WHERE is_retired = 0 AND active_team_id IS NOT NULL
        ORDER BY overall_rating DESC
        LIMIT 5
      `).all() as any[];

      console.log('Sample riders BEFORE development:');
      sampleRiders.forEach(r => {
        console.log(`  - [ID ${r.id}] ${r.first_name} ${r.last_name} (Age: ${nextSeason - r.birth_year}) | OVR: ${r.overall_rating.toFixed(2)} | POT: ${r.pot_overall.toFixed(2)}`);
      });

      // Run daily development in 10 steps of 24 days each
      const devDate = `${nextSeason}-06-01`;
      for (let i = 0; i < 10; i++) {
        rds.advanceDailyDevelopment(devDate, nextSeason, [], 24);
      }
      rds.recalculateSpecializations(nextSeason);

      console.log('Sample riders AFTER development:');
      for (const r of sampleRiders) {
        const updated = db.prepare('SELECT overall_rating, pot_overall FROM riders WHERE id = ?').get(r.id) as { overall_rating: number, pot_overall: number };
        const diff = updated.overall_rating - r.overall_rating;
        console.log(`  - [ID ${r.id}] ${r.first_name} ${r.last_name} | OVR: ${r.overall_rating.toFixed(2)} -> ${updated.overall_rating.toFixed(2)} (${diff >= 0 ? '+' : ''}${diff.toFixed(2)}) | POT: ${updated.pot_overall.toFixed(2)}`);
      }

      // F. Export Roster Post-Dev
      for (const team of targetTeams) {
        writeRosterToCsv(db, team.id, team.fileSlug, nextSeason, 'post_dev');
      }

      // Update currentSeason for next loop iteration
      currentSeason = nextSeason;
    }

    console.log('\n======================================================================');
    console.log('=== SIMULATION OF 3 SEASONS COMPLETED SUCCESSFULLY ===');
    console.log('======================================================================');

  } catch (err) {
    console.error('An error occurred during verification:', err);
  } finally {
    db.close();
    // Clean up
    console.log(`Cleaning up temporary database at ${tempDbPath}...`);
    try {
      if (fs.existsSync(tempDbPath)) fs.unlinkSync(tempDbPath);
      if (fs.existsSync(tempDbPath + '-wal')) fs.unlinkSync(tempDbPath + '-wal');
      if (fs.existsSync(tempDbPath + '-shm')) fs.unlinkSync(tempDbPath + '-shm');
      console.log('Cleanup completed.');
    } catch (e) {
      console.warn('Could not clean up temp DB files:', (e as Error).message);
    }
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
