import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import { StageResultCommitService } from './StageResultCommitService';
import {
  createTestDb,
  seedReferenceData,
  seedTeams,
  seedRider,
  seedGameState,
} from '../__tests__/helpers/testDb';

/**
 * Smoke test for the results write-back path. Seeds a minimal one-day flat race
 * with a pre-registered start list (so roster building takes the existing-entries
 * short path), commits a simple finish, and asserts results persist and rank.
 */
describe('StageResultCommitService.commitRealtimeStage', () => {
  let db: Database.Database;
  const RACE_ID = 1;
  const STAGE_ID = 1;
  const riderIds: number[] = [];

  beforeEach(() => {
    db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 2, playerTeamId: 1 });
    seedGameState(db, { date: '2026-04-01', season: 2026 });

    // Bonus system + category (tier/number_of_teams/riders satisfy CHECKs).
    db.prepare(`
      INSERT INTO race_categories_bonus (id, name, bonus_seconds_final, points_one_day, points_gc_final)
      VALUES (1, 'OneDayBonus', '10|6|4', '25|20|15|10', '')
    `).run();
    db.prepare(`
      INSERT INTO race_categories (id, name, tier, number_of_teams, number_of_riders, bonus_system_id, home_selection_probability)
      VALUES (1, 'OneDayCat', 1, 2, 4, 1, 0.0)
    `).run();

    // One-day race with a single flat stage referencing a real stage profile CSV.
    db.prepare(`
      INSERT INTO races (id, name, country_id, category_id, is_stage_race, number_of_stages, start_date, end_date, prestige)
      VALUES (?, 'Test One Day', 1, 1, 0, 1, '2026-04-01', '2026-04-01', 50)
    `).run(RACE_ID);
    db.prepare(`
      INSERT INTO stages (id, race_id, stage_number, date, profile, start_elevation, details_csv_file)
      VALUES (?, ?, 1, '2026-04-01', 'Flat', 0, 'DDV.csv')
    `).run(STAGE_ID, RACE_ID);

    // Four riders across the two teams.
    riderIds.length = 0;
    for (let i = 0; i < 4; i++) {
      const teamId = (i % 2) + 1;
      riderIds.push(seedRider(db, { activeTeamId: teamId, overallRating: 70 - i, roleId: 1 }));
    }

    // Pre-register the start list so ensureRaceEntries takes the existing-entries path.
    const insertEntry = db.prepare(
      'INSERT INTO active_race_entries (race_id, team_id, rider_id) VALUES (?, ?, ?)',
    );
    for (const id of riderIds) {
      const teamId = db.prepare('SELECT active_team_id AS t FROM riders WHERE id = ?').get(id) as any;
      insertEntry.run(RACE_ID, teamId.t, id);
    }
  });

  afterEach(() => {
    db.close();
  });

  it('commits a flat-stage finish and persists ranked stage results', () => {
    const service = new StageResultCommitService(db);

    // One entry per registered starter; distinct finish times → deterministic order.
    const entries = riderIds.map((riderId, index) => ({
      riderId,
      finishStatus: 'finished' as const,
      finishTimeSeconds: 10000 + index, // rider[0] fastest
      photoFinishScore: 1000 - index,
      isBreakaway: false,
    }));

    const response = service.commitRealtimeStage(STAGE_ID, entries);
    expect(response).toBeTruthy();

    // Stage results are read through the `all_results` view, which unions the
    // relational `results` table with the compacted JSON the commit writes for
    // finished races. Every finisher should appear with a stage result.
    const stageResults = db
      .prepare('SELECT rider_id, rank FROM all_results WHERE stage_id = ? AND result_type_id = 1 ORDER BY rank')
      .all(STAGE_ID) as Array<{ rider_id: number; rank: number }>;
    expect(stageResults.length).toBe(4);

    // The fastest rider (index 0) should take rank 1.
    expect(stageResults[0].rider_id).toBe(riderIds[0]);
    expect(stageResults[0].rank).toBe(1);

    // Committing the same stage again must be rejected.
    expect(() => service.commitRealtimeStage(STAGE_ID, entries)).toThrow();
  });
});
