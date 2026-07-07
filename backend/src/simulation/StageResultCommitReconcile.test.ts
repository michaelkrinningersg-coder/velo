import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import { StageResultCommitService } from './StageResultCommitService';
import { ensureRaceEntries } from './RaceRosterService';
import { RaceRepository } from '../db/repositories/RaceRepository';
import { GameStateRepository } from '../db/repositories/GameStateRepository';
import { TeamRepository } from '../db/repositories/TeamRepository';
import {
  createTestDb,
  seedReferenceData,
  seedTeams,
  seedRider,
  seedGameState,
} from '../__tests__/helpers/testDb';

/**
 * Regression: Live-/Instant-Sim-Commit darf nicht das komplette Etappenergebnis
 * verwerfen, wenn sich die Startliste zwischen Bootstrap (auf dem die Sim lief)
 * und Commit um einzelne Fahrer unterscheidet — etwa weil ein Fahrer krankheits-/
 * verletzungsbedingt oder wegen Erschoepfung nachtraeglich auf DNS gesetzt wird
 * und aus getStageRiders faellt. Der Commit gleicht die Ergebnisse nun gegen die
 * aktuelle Startliste ab, statt mit "genau einen Zielstatus je Starter" abzubrechen.
 */
describe('StageResultCommitService reconcile roster drift', () => {
  let db: Database.Database;
  const RACE_ID = 1;
  const STAGE_ID = 1;
  const riderIds: number[] = [];

  function makeRepo() {
    const raceRepo = new RaceRepository(db);
    const gsRepo = new GameStateRepository(db);
    const teamRepo = new TeamRepository(db) as any;
    return {
      getRaceById: (id: number) => raceRepo.getRaceById(id),
      getStageById: (id: number) => raceRepo.getStageById(id),
      getRaceRiders: (raceId: number) => raceRepo.getRaceRiders(raceId),
      getStageRiders: (stageId: number) => raceRepo.getStageRiders(stageId),
      prepareStageRaceFatigue: (raceId: number, sn: number, ids: number[]) => gsRepo.prepareStageRaceFatigue(raceId, sn, ids),
      ensureStageEntries: (stage: any) => gsRepo.ensureStageEntries(stage),
      getTeams: (teamId?: number) => teamRepo.getTeams(teamId),
    } as any;
  }

  beforeEach(() => {
    db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 3, playerTeamId: 1 });
    seedGameState(db, { date: '2026-05-30', season: 2026 });

    db.prepare(`INSERT INTO race_categories_bonus (id, name, bonus_seconds_final, points_one_day, points_gc_final, points_stage, points_sprint_finish)
      VALUES (1, 'B', '10|6|4', '25|20|15|10', '50|30|20', '25|20|15|10', '25|20|15|10')`).run();
    db.prepare(`INSERT INTO race_categories (id, name, tier, number_of_teams, number_of_riders, bonus_system_id, home_selection_probability)
      VALUES (1, 'Cat', 1, 3, 6, 1, 0.0)`).run();
    db.prepare(`INSERT INTO races (id, name, country_id, category_id, is_stage_race, number_of_stages, start_date, end_date, prestige)
      VALUES (?, 'Test One Day', 1, 1, 0, 1, '2026-05-30', '2026-05-30', 50)`).run(RACE_ID);
    db.prepare(`INSERT INTO stages (id, race_id, stage_number, date, profile, start_elevation, details_csv_file)
      VALUES (?, ?, 1, '2026-05-30', 'Flat', 0, 'DDV.csv')`).run(STAGE_ID, RACE_ID);

    riderIds.length = 0;
    for (let i = 0; i < 6; i++) {
      riderIds.push(seedRider(db, { activeTeamId: (i % 3) + 1, overallRating: 75 - i, roleId: 1 }));
    }
    const insertEntry = db.prepare('INSERT INTO active_race_entries (race_id, team_id, rider_id) VALUES (?, ?, ?)');
    for (const id of riderIds) {
      const t = db.prepare('SELECT active_team_id AS t FROM riders WHERE id = ?').get(id) as any;
      insertEntry.run(RACE_ID, t.t, id);
    }
    const upsert = db.prepare(`INSERT INTO rider_daily_state (rider_id, season, form_bonus, race_form_bonus, peak_s_form, peak_r_form, active_peak_date, peak_dates_json, health_status, unavailable_until, unavailable_days_remaining, season_race_days_total, rolling_30d_race_days, short_term_fatigue, long_term_fatigue_decayable, long_term_fatigue_locked)
      VALUES (?, 2026, 0,0,0,0,NULL,'[]','healthy',NULL,0,0,0,0,0,0)`);
    for (const id of riderIds) upsert.run(id);
  });

  afterEach(() => db.close());

  it('speichert das Etappenergebnis, auch wenn ein Starter nach dem Bootstrap DNS wird', () => {
    const repo = makeRepo();
    const race = repo.getRaceById(RACE_ID);
    const stage = repo.getStageById(STAGE_ID);

    // Bootstrap: alle 6 sind Starter; Frontend liefert je Starter ein Ergebnis.
    const bootstrapRiders = ensureRaceEntries(db, repo, race, stage);
    expect(bootstrapRiders.length).toBe(6);
    const entries = bootstrapRiders.map((r: any, i: number) => ({
      riderId: r.id,
      finishStatus: 'finished' as const,
      finishTimeSeconds: 10000 + i,
      photoFinishScore: 500 - i,
      isBreakaway: false,
    }));

    // Fahrer 3 wird zwischen Bootstrap und Commit krank -> beim Commit DNS.
    db.prepare(`UPDATE rider_daily_state SET health_status='ill', unavailable_days_remaining=5 WHERE rider_id=?`).run(riderIds[2]);

    const service = new StageResultCommitService(db);
    expect(() => service.commitRealtimeStage(STAGE_ID, entries)).not.toThrow();

    // Die 5 verbliebenen Starter haben ein Etappenergebnis, der DNS-Fahrer nicht.
    const results = db
      .prepare('SELECT rider_id FROM all_results WHERE stage_id = ? AND result_type_id = 1')
      .all(STAGE_ID) as Array<{ rider_id: number }>;
    const resultRiderIds = new Set(results.map((r) => r.rider_id));
    expect(resultRiderIds.has(riderIds[2])).toBe(false);
    expect(resultRiderIds.size).toBe(5);
  });
});
