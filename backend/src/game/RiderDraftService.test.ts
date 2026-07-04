import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import { RiderDraftService } from './RiderDraftService';
import { GameStateService } from './GameStateService';
import {
  createTestDb,
  seedReferenceData,
  seedTeams,
  seedGameState,
} from '../__tests__/helpers/testDb';

/**
 * Integration test for the interactive draft flow. Ported from the original
 * standalone `runTest()` script to Vitest, now building its DB from the shared
 * production-equivalent fixture instead of hand-declaring tables.
 */
describe('RiderDraftService — interactive draft flow', () => {
  let db: Database.Database;
  let draftService: RiderDraftService;
  let gameStateService: GameStateService;

  beforeEach(() => {
    db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 25, playerTeamId: 1 });
    // Draft happens at the season boundary; state is 'completed' for the prior season.
    seedGameState(db, { date: '2026-10-15', season: 2026, draftStatus: 'completed' });

    // Seed 150 free-agent riders spanning ages 18–35 with a spread of ratings.
    const insertRider = db.prepare(`
      INSERT INTO riders (
        first_name, last_name, country_id, role_id, rider_type_id, birth_year,
        peak_age, decline_age, retirement_age, skill_development, pot_overall, overall_rating,
        specialization_1_id, specialization_2_id, specialization_3_id, is_retired
      ) VALUES (?, ?, 1, 3, 1, ?, 25, 30, 35, 10, ?, ?, 1, 2, 3, 0)
    `);
    const tx = db.transaction(() => {
      for (let i = 1; i <= 150; i++) {
        const birthYear = 2027 - (18 + (i % 18)); // age 18..35 in season 2027
        const overall = 50 + (i % 15);            // 50..64
        const potential = overall + (i % 10);     // overall + 0..9
        insertRider.run('Fahrer', `${i}`, birthYear, potential, overall);
      }
    });
    tx();

    draftService = new RiderDraftService(db);
    gameStateService = new GameStateService(db);
  });

  afterEach(() => {
    db.close();
  });

  it('prepares the draft and auto-picks up to the player team', () => {
    draftService.prepareDraft(2027);
    draftService.executeNextPicksUntilPlayer(2027, false);

    const nextPickState = draftService.getNextPickState(2027);
    expect(nextPickState.finished).toBe(false);
    expect(nextPickState.isPlayerTeam).toBe(true);
  });

  it('surfaces a 30-candidate pool with correct renewal-team mapping', () => {
    draftService.prepareDraft(2027);
    draftService.executeNextPicksUntilPlayer(2027, false);

    // Rider 10 had an (expired) contract with the player team → renewal candidate.
    db.prepare(`
      INSERT INTO contracts (rider_id, team_id, start_season, end_season, status)
      VALUES (10, 1, 2026, 2026, 'expired')
    `).run();
    db.prepare(`UPDATE riders SET overall_rating = 85, pot_overall = 85 WHERE id = 10`).run();

    const candidates = draftService.getDraftCandidatesForNextPick(2027);
    expect(candidates).toHaveLength(30);

    const cand10 = candidates.find((c) => c.riderId === 10);
    expect(cand10).toBeDefined();
    expect(cand10!.oldTeamId).toBe(1);
    expect(cand10!.oldTeamName).toBe('Team 1');
  });

  it('records a player pick and completes the draft', () => {
    draftService.prepareDraft(2027);
    draftService.executeNextPicksUntilPlayer(2027, false);
    const pickState = draftService.getNextPickState(2027);

    const candidates = draftService.getDraftCandidatesForNextPick(2027);
    const selectedRiderId = candidates[0].riderId;

    draftService.executeSingleDraftPick(
      2027,
      pickState.nextTeamId!,
      pickState.currentRound,
      pickState.currentPickNumber,
      selectedRiderId,
    );

    const historyRow = db
      .prepare('SELECT * FROM draft_history WHERE season = 2027 AND rider_id = ?')
      .get(selectedRiderId);
    expect(historyRow).toBeTruthy();

    // Auto-complete the remaining picks.
    draftService.executeNextPicksUntilPlayer(2027, true);
    expect(draftService.getNextPickState(2027).finished).toBe(true);
  });

  it('initializes the new season after the draft (roles + programs)', () => {
    draftService.prepareDraft(2027);
    draftService.executeNextPicksUntilPlayer(2027, false);
    const pickState = draftService.getNextPickState(2027);
    const candidates = draftService.getDraftCandidatesForNextPick(2027);
    draftService.executeSingleDraftPick(
      2027,
      pickState.nextTeamId!,
      pickState.currentRound,
      pickState.currentPickNumber,
      candidates[0].riderId,
    );
    draftService.executeNextPicksUntilPlayer(2027, true);

    gameStateService.completeDraftAndInitializeSeason(2027, '2027-01-01');

    const gs = db.prepare('SELECT draft_status FROM game_state WHERE id = 1').get() as any;
    expect(gs.draft_status).toBe('completed');

    const roled = db
      .prepare('SELECT COUNT(*) AS c FROM riders WHERE role_id IS NOT NULL AND is_retired = 0')
      .get() as any;
    expect(roled.c).toBeGreaterThan(0);
  });
});
