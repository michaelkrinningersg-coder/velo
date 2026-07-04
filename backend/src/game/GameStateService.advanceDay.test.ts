import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import { GameStateService } from './GameStateService';
import {
  createTestDb,
  seedReferenceData,
  seedTeams,
  seedRider,
  seedGameState,
} from '../__tests__/helpers/testDb';

/**
 * Smoke tests for the main game-loop tick, `advanceDay()`. Covers the common
 * mid-season case and the season-rollover boundary (the highest-value path,
 * since rollover fans out into archiving, development, newgens and contracts).
 */
describe('GameStateService.advanceDay', () => {
  let db: Database.Database;
  let service: GameStateService;

  beforeEach(() => {
    db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 3, playerTeamId: 1 });
    // A couple of active riders so rollover-time rider processing has data.
    seedRider(db, { activeTeamId: 1, overallRating: 68, birthYear: 1998 });
    seedRider(db, { activeTeamId: 2, overallRating: 71, birthYear: 1996 });
    service = new GameStateService(db);
  });

  afterEach(() => {
    db.close();
  });

  it('advances a single mid-season day', () => {
    seedGameState(db, { date: '2026-06-15', season: 2026 });
    // Mirror the production load path, which creates the lazy form/peak tables.
    service.ensureState();

    const next = service.advanceDay();

    expect(next.currentDate).toBe('2026-06-16');
    expect(next.season).toBe(2026);

    const row = db.prepare('SELECT "current_date" AS d, season FROM game_state WHERE id = 1').get() as any;
    expect(row.d).toBe('2026-06-16');
    expect(row.season).toBe(2026);
  });

  it('rolls over to the next season on Dec 31 → Jan 1', () => {
    seedGameState(db, { date: '2026-12-31', season: 2026 });
    service.ensureState();

    const next = service.advanceDay();

    expect(next.currentDate).toBe('2027-01-01');
    expect(next.season).toBe(2027);

    const row = db.prepare('SELECT "current_date" AS d, season FROM game_state WHERE id = 1').get() as any;
    expect(row.d).toBe('2027-01-01');
    expect(row.season).toBe(2027);
  });
});
