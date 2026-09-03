import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import { StageResultCommitService } from '../simulation/StageResultCommitService';
import { ensureRaceEntries } from '../simulation/RaceRosterService';
import { RaceRepository } from '../db/repositories/RaceRepository';
import { GameStateRepository } from '../db/repositories/GameStateRepository';
import { TeamRepository } from '../db/repositories/TeamRepository';
import {
  createTestDb,
  seedReferenceData,
  seedTeams,
  seedRider,
  seedGameState,
} from './helpers/testDb';

/**
 * Die Renntag-Buchungen des Commits laufen gebuendelt: gesammelt waehrend der
 * Finisher-Schleife, danach in Bloecken geschrieben (siehe `schreibeRenntage`
 * in StageResultCommitService). Vorher war es eine Anweisung je Fahrer und
 * Tabelle.
 *
 * Der Test haelt fest, was dabei gleich bleiben muss: jeder Starter bekommt
 * genau einen Renntag je Etappe — in der Karriere, in der Saison und in beiden
 * Kategorietabellen —, und die Etappendistanz landet nur einmal auf dem Konto.
 * Ein Blockschreiben mit `rider_id IN (...)` wuerde einen doppelt gezaehlten
 * Fahrer verschlucken; ein Rundungsfehler in der Gruppierung faellt hier auf.
 */
describe('Renntage gebuendelt verbuchen', () => {
  let db: Database.Database;
  const RACE_ID = 1;
  const STAGE_IDS = [1, 2];
  const riderIds: number[] = [];

  function makeRepo() {
    const raceRepo = new RaceRepository(db);
    const gsRepo = new GameStateRepository(db);
    const teamRepo = new TeamRepository(db) as any;
    return {
      getRaceById: (id: number) => raceRepo.getRaceById(id),
      getStageById: (id: number) => raceRepo.getStageById(id),
      getRaceRiders: (raceId: number) => raceRepo.getRaceRiders(raceId),
      getRaceEntryIds: (raceId: number) => raceRepo.getRaceEntryIds(raceId),
      getStageRiders: (stageId: number) => raceRepo.getStageRiders(stageId),
      getStageRiderKerne: (stageId: number) => raceRepo.getStageRiderKerne(stageId),
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
      VALUES (1, 'Cat', 1, 3, 9, 1, 0.0)`).run();
    db.prepare(`INSERT INTO races (id, name, country_id, category_id, is_stage_race, number_of_stages, start_date, end_date, prestige)
      VALUES (?, 'Test Rundfahrt', 1, 1, 1, 2, '2026-05-30', '2026-05-31', 50)`).run(RACE_ID);
    db.prepare(`INSERT INTO stages (id, race_id, stage_number, date, profile, start_elevation, details_csv_file)
      VALUES (?, ?, 1, '2026-05-30', 'Flat', 0, 'DDV.csv')`).run(STAGE_IDS[0], RACE_ID);
    db.prepare(`INSERT INTO stages (id, race_id, stage_number, date, profile, start_elevation, details_csv_file)
      VALUES (?, ?, 2, '2026-05-31', 'Flat', 0, 'DDV.csv')`).run(STAGE_IDS[1], RACE_ID);

    riderIds.length = 0;
    for (let i = 0; i < 9; i++) {
      riderIds.push(seedRider(db, { activeTeamId: (i % 3) + 1, overallRating: 78 - i, roleId: 1 }));
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

  function fahreEtappe(stageId: number): void {
    const repo = makeRepo();
    const race = repo.getRaceById(RACE_ID);
    const stage = repo.getStageById(stageId);
    const starter = ensureRaceEntries(db, repo, race, stage);
    const entries = starter.map((r: any, i: number) => ({
      riderId: r.id,
      finishStatus: 'finished' as const,
      finishTimeSeconds: 10000 + i,
      photoFinishScore: 500 - i,
      isBreakaway: false,
    }));
    new StageResultCommitService(db).commitRealtimeStage(stageId, entries);
  }

  it('bucht je Etappe genau einen Renntag je Starter', () => {
    fahreEtappe(STAGE_IDS[0]!);

    const nachEins = db.prepare('SELECT rider_id, race_days FROM rider_career_stats ORDER BY rider_id').all() as Array<{ rider_id: number; race_days: number }>;
    expect(nachEins.length).toBe(riderIds.length);
    for (const zeile of nachEins) expect(zeile.race_days).toBe(1);

    fahreEtappe(STAGE_IDS[1]!);

    const nachZwei = db.prepare('SELECT rider_id, race_days FROM rider_career_stats ORDER BY rider_id').all() as Array<{ rider_id: number; race_days: number }>;
    for (const zeile of nachZwei) expect(zeile.race_days).toBe(2);
  });

  it('zaehlt Saison- und Kategorietabellen im selben Takt mit', () => {
    fahreEtappe(STAGE_IDS[0]!);
    fahreEtappe(STAGE_IDS[1]!);

    const saison = db.prepare('SELECT rider_id, race_days FROM rider_season_stats WHERE season = 2026').all() as Array<{ rider_id: number; race_days: number }>;
    expect(saison.length).toBe(riderIds.length);
    for (const zeile of saison) expect(zeile.race_days).toBe(2);

    const saisonKategorie = db.prepare('SELECT rider_id, race_days FROM rider_season_category_stats WHERE season = 2026').all() as Array<{ rider_id: number; race_days: number }>;
    expect(saisonKategorie.length).toBe(riderIds.length);
    for (const zeile of saisonKategorie) expect(zeile.race_days).toBe(2);

    const karriereKategorie = db.prepare('SELECT rider_id, race_days FROM rider_career_category_stats').all() as Array<{ rider_id: number; race_days: number }>;
    expect(karriereKategorie.length).toBe(riderIds.length);
    for (const zeile of karriereKategorie) expect(zeile.race_days).toBe(2);
  });
});
