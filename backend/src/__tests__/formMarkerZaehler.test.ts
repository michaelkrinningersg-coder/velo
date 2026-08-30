import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import type { RaceSimMessage } from '../../../shared/types';
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
 * Der Etappen-Commit zaehlt die Tageszaehler fuer Heimvorteil, Heimdruck,
 * Superform und Supermalus aus den Ereignissen der Simulation.
 *
 * Frueher las er dafuer Ueberschrift und Detailtext. Die Quick Simulation
 * formulierte anders als die Live-Simulation — und so blieben die Zaehler im
 * Auto-Weiter dauerhaft auf null, waehrend die Effekte sehr wohl auf das
 * Ergebnis wirkten. Ueber 6,5 gemessene Spieljahre kein einziger gezaehlter
 * Tag bei 473 303 Renntagen.
 *
 * Jetzt traegt jedes Ereignis ein `formMarker`-Feld. Der Test haelt fest, dass
 * danach gezaehlt wird — und dass der Rueckfall auf die alten Texte noch
 * greift, falls eine Browser-Sitzung mit altem Bundle Ereignisse ohne Feld
 * schickt.
 */
describe('Tageszaehler aus formMarker', () => {
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
      getRaceEntryIds: (raceId: number) => raceRepo.getRaceEntryIds(raceId),
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
    for (let i = 0; i < 6; i += 1) {
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

  function ereignis(riderId: number, teil: Partial<RaceSimMessage>): RaceSimMessage {
    return {
      id: riderId * 10,
      elapsedSeconds: 0,
      riderId,
      riderName: 'x',
      riderTeamId: null,
      type: 'support_resume',
      tone: 'neutral',
      title: '',
      detail: '',
      ...teil,
    } as RaceSimMessage;
  }

  function fahreMit(events: RaceSimMessage[]): void {
    const repo = makeRepo();
    const race = repo.getRaceById(RACE_ID);
    const stage = repo.getStageById(STAGE_ID);
    const starter = ensureRaceEntries(db, repo, race, stage);
    const entries = starter.map((r: any, i: number) => ({
      riderId: r.id,
      finishStatus: 'finished' as const,
      finishTimeSeconds: 10000 + i,
      photoFinishScore: 500 - i,
      isBreakaway: false,
    }));
    new StageResultCommitService(db).commitRealtimeStage(STAGE_ID, entries, [], [], events);
  }

  const zaehler = (riderId: number) => db.prepare(`
    SELECT superform_days, supermalus_days, home_advantage_days,
           super_home_advantage_days, home_pressure_days
    FROM rider_career_stats WHERE rider_id = ?
  `).get(riderId) as Record<string, number>;

  it('zaehlt alle fuenf Zustaende ueber das Feld, unabhaengig vom Wortlaut', () => {
    fahreMit([
      // Bewusst nichtssagende Texte: allein das Feld darf zaehlen.
      ereignis(riderIds[0]!, { formMarker: 'superform', title: 'irgendwas', detail: 'irgendwas' }),
      ereignis(riderIds[1]!, { formMarker: 'supermalus', title: 'irgendwas', detail: 'irgendwas' }),
      ereignis(riderIds[2]!, { formMarker: 'home_advantage', title: 'irgendwas', detail: 'irgendwas' }),
      ereignis(riderIds[3]!, { formMarker: 'super_home_advantage', title: 'irgendwas', detail: 'irgendwas' }),
      ereignis(riderIds[4]!, { formMarker: 'home_pressure', title: 'irgendwas', detail: 'irgendwas' }),
    ]);

    expect(zaehler(riderIds[0]!)!['superform_days']).toBe(1);
    expect(zaehler(riderIds[1]!)!['supermalus_days']).toBe(1);
    expect(zaehler(riderIds[2]!)!['home_advantage_days']).toBe(1);
    expect(zaehler(riderIds[3]!)!['super_home_advantage_days']).toBe(1);
    expect(zaehler(riderIds[4]!)!['home_pressure_days']).toBe(1);
    // Wer kein Ereignis hatte, bekommt auch keinen Tag.
    expect(zaehler(riderIds[5]!)!['home_advantage_days']).toBe(0);
  });

  it('faellt auf die alten Texte zurueck, wenn das Feld fehlt', () => {
    fahreMit([
      ereignis(riderIds[0]!, { title: 'A hat heute einen guten Tag', detail: 'Superform aktiv.' }),
      ereignis(riderIds[1]!, { title: 'B hat heute Super-Heimvorteil!', detail: 'x' }),
      ereignis(riderIds[2]!, { title: 'C leidet unter Heimdruck!', detail: 'x' }),
      ereignis(riderIds[3]!, { title: 'D hat heute Heimvorteil!', detail: 'x' }),
    ]);

    expect(zaehler(riderIds[0]!)!['superform_days']).toBe(1);
    expect(zaehler(riderIds[1]!)!['super_home_advantage_days']).toBe(1);
    // "Super-Heimvorteil" darf nicht zusaetzlich als normaler Heimvorteil zaehlen.
    expect(zaehler(riderIds[1]!)!['home_advantage_days']).toBe(0);
    expect(zaehler(riderIds[2]!)!['home_pressure_days']).toBe(1);
    expect(zaehler(riderIds[3]!)!['home_advantage_days']).toBe(1);
  });
});
