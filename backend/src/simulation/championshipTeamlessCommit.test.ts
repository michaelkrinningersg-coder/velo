import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import { StageResultCommitService } from './StageResultCommitService';
import { GameStateService } from '../game/GameStateService';
import { NATIONAL_SELECTION_TEAM_ID } from './championships';
import {
  createTestDb,
  seedReferenceData,
  seedTeams,
  seedRider,
  seedGameState,
} from '../__tests__/helpers/testDb';

/**
 * Regression: teamlose Fahrer starten bei U23-/Junioren-Meisterschaften über das
 * Nationalmannschafts-Pseudo-Team. getStageRiders liefert für sie activeTeamId =
 * null und getTeams blendet das Pseudo-Team aus; ohne Auflösung brach der Commit
 * mit „Team … konnte nicht aufgelöst werden" ab und das Rennen hing fest
 * (betraf EM/WM U23 sowie Junioren). loadStageContext muss teamlose Starter jetzt
 * auf NATIONAL_SELECTION_TEAM_ID mappen.
 */
describe('commitRealtimeStage – teamlose U23-Meisterschaftsfahrer', () => {
  let db: Database.Database;
  const SEASON = 2026;
  const DATE = '2026-09-27';
  const RACE_ID = 700;
  const STAGE_ID = 700;
  const CATEGORY_EM_U23_ROAD = 20;
  let teamlessRiderId: number;

  beforeEach(() => {
    db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 1, playerTeamId: 1 });
    seedGameState(db, { date: DATE, season: SEASON });
    // Produktions-Ladepfad: legt die lazy Form-/Peak-/Daily-State-Spalten an
    // (u.a. season_ttt_wins), die getRiders beim Roster-Aufbau referenziert.
    new GameStateService(db).ensureState();

    // Nationalmannschafts-Pseudo-Team (in der echten DB via
    // ensureNationalSelectionTeam angelegt; hier manuell, da createTestDb die
    // Migration vor dem Team-Seeding ausführt).
    db.prepare(`
      INSERT INTO teams (id, name, abbreviation, division_id, is_player_team, country_id,
        color_primary, color_secondary, ai_focus_1, ai_focus_2, ai_focus_3)
      VALUES (?, 'Nationalauswahl', 'NAT', 1, 0, 1, '#334155', '#e2e8f0', 1, 2, 3)
    `).run(NATIONAL_SELECTION_TEAM_ID);

    // EM-U23-Straßenrennen (Kategorie 20, Eintagesrennen). Kategorie + Bonus
    // werden von createTestDb (ensureChampionshipCalendar) bereitgestellt.
    db.prepare(`
      INSERT INTO races (id, name, country_id, category_id, is_stage_race, number_of_stages, start_date, end_date, prestige)
      VALUES (?, 'EM U23 Straße', 1, ?, 0, 1, ?, ?, 80)
    `).run(RACE_ID, CATEGORY_EM_U23_ROAD, DATE, DATE);
    db.prepare(`
      INSERT INTO stages (id, race_id, stage_number, date, profile, start_elevation, details_csv_file)
      VALUES (?, ?, 1, ?, 'Hilly', 0, 'DDV.csv')
    `).run(STAGE_ID, RACE_ID, DATE);

    // Genau ein wählbarer U23-Fahrer aus GER – teamlos (Alter 21 in 2026).
    teamlessRiderId = seedRider(db, {
      birthYear: 2005,
      activeTeamId: null,
      countryId: 1,
      overallRating: 78,
      roleId: 1,
    });

    // Nationenwertung: GER braucht Punkte > 0, damit das Land nominiert wird.
    db.prepare(`
      INSERT INTO season_point_events (season, race_id, stage_id, rider_id, team_id, award_type, rank, points_awarded, awarded_on)
      VALUES (?, ?, ?, ?, 1, 'one_day_result', 1, 100, ?)
    `).run(SEASON, RACE_ID, STAGE_ID, teamlessRiderId, DATE);
  });

  afterEach(() => db.close());

  it('schließt das Rennen ab und verbucht den teamlosen Sieger unter dem Pseudo-Team', () => {
    const service = new StageResultCommitService(db);

    const response = service.commitRealtimeStage(STAGE_ID, [
      { riderId: teamlessRiderId, finishStatus: 'finished', finishTimeSeconds: 10000, photoFinishScore: 1000, isBreakaway: false },
    ]);
    expect(response).toBeTruthy();

    // Ergebnis persistiert, Rang 1, Team = Nationalauswahl-Pseudo-Team.
    const result = db
      .prepare('SELECT rider_id, team_id, rank FROM all_results WHERE stage_id = ? AND result_type_id = 1 ORDER BY rank')
      .all(STAGE_ID) as Array<{ rider_id: number; team_id: number; rank: number }>;
    expect(result.length).toBe(1);
    expect(result[0].rider_id).toBe(teamlessRiderId);
    expect(result[0].rank).toBe(1);
    expect(result[0].team_id).toBe(NATIONAL_SELECTION_TEAM_ID);
  });
});
