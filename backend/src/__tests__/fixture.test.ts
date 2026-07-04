import { describe, it, expect } from 'vitest';
import {
  createTestDb,
  seedReferenceData,
  seedTeams,
  seedRider,
  seedGameState,
} from './helpers/testDb';

describe('test fixture', () => {
  it('builds a production-equivalent in-memory schema', () => {
    const db = createTestDb();
    // A sampling of tables from schema.sql + migrations should all exist.
    for (const table of ['riders', 'teams', 'game_state', 'stages', 'results', 'stage_entries_compact']) {
      const row = db
        .prepare("SELECT name FROM sqlite_master WHERE type IN ('table','view') AND name = ?")
        .get(table);
      expect(row, `expected table/view ${table} to exist`).toBeTruthy();
    }
    db.close();
  });

  it('seed builders insert valid rows', () => {
    const db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 3, playerTeamId: 1 });
    seedGameState(db, { date: '2026-06-15', season: 2026 });
    const riderId = seedRider(db, { activeTeamId: 1, overallRating: 72 });

    expect(db.prepare('SELECT COUNT(*) c FROM teams').get()).toMatchObject({ c: 3 });
    const rider = db.prepare('SELECT overall_rating, active_team_id FROM riders WHERE id = ?').get(riderId) as any;
    expect(rider.overall_rating).toBe(72);
    expect(rider.active_team_id).toBe(1);
    // NB: `current_date` is a SQLite keyword — it must be quoted to read the
    // column rather than the built-in current-date function.
    const gs = db.prepare('SELECT "current_date" AS d, season FROM game_state WHERE id = 1').get() as any;
    expect(gs).toMatchObject({ d: '2026-06-15', season: 2026 });
    db.close();
  });
});
