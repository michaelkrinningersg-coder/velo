import Database from 'better-sqlite3';
import * as fs from 'fs';
import { DatabaseService } from '../../db/DatabaseService';

/**
 * Test fixture: builds an in-memory SQLite database whose schema matches
 * production exactly.
 *
 * Rather than re-declaring tables (which would drift from the app), it reuses
 * the real `DatabaseService.applySchemaTo`, which runs `schema.sql` plus every
 * runtime `ensure*` migration. Steps that depend on the master DB
 * (`world_data.db`) are guarded internally and skipped safely for an in-memory
 * DB, so no master file is required.
 */

let sharedSchemaService: DatabaseService | null = null;

function schemaService(): DatabaseService {
  // DatabaseService's constructor resolves asset paths relative to the repo;
  // it is side-effect free beyond ensuring the savegames dir exists. Reuse a
  // single instance across tests.
  if (!sharedSchemaService) {
    sharedSchemaService = new DatabaseService();
  }
  return sharedSchemaService;
}

export function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  // WAL/foreign-key pragmas can misbehave for :memory: DBs; the app sets these
  // on file-backed connections. Keep foreign keys off during seeding so we can
  // insert rows in a convenient order.
  db.pragma('journal_mode = MEMORY');
  db.pragma('foreign_keys = OFF');

  const svc = schemaService();
  // Apply the canonical base schema first so the column-migration ALTERs in
  // `applySchemaTo` (which assume the tables already exist, as on a real
  // savegame) become no-ops rather than failing on an empty DB.
  const baseSchema = fs
    .readFileSync(svc.getSchemaPath(), 'utf8')
    .replace(/PRAGMA journal_mode = WAL;/g, '')
    .replace(/PRAGMA foreign_keys = ON;/g, '');
  db.exec(baseSchema);

  // Now run the full production migration path (idempotent on top of the base).
  svc.applySchemaTo(db);
  return db;
}

// ---------------------------------------------------------------------------
// Reference data (rider types + roles) required by most services.
// ---------------------------------------------------------------------------

export function seedReferenceData(db: Database.Database): void {
  db.prepare(`INSERT OR IGNORE INTO type_rider (id, type_key, display_name, is_stage_focus, is_one_day_focus) VALUES
    (1, 'climber', 'Bergfahrer', 1, 0),
    (2, 'puncher', 'Huegelspezialist', 0, 1),
    (3, 'sprinter', 'Sprinter', 0, 1),
    (4, 'timetrialist', 'Zeitfahrer', 1, 0),
    (5, 'classic', 'Cobble', 0, 1)
  `).run();

  db.prepare(`INSERT OR IGNORE INTO sta_role (id, name, weighting) VALUES
    (1, 'Leader', 100),
    (2, 'Co-Leader', 80),
    (3, 'Domestique', 50)
  `).run();

  db.prepare(`INSERT OR IGNORE INTO program_groups (id, name) VALUES (1, 'Europe')`).run();

  db.prepare(`INSERT OR IGNORE INTO sta_country
    (id, name, code_3, continent, regen_rating, number_regen_min, number_regen_max, program_group_id)
    VALUES (1, 'Deutschland', 'GER', 'Europe', 80, 2, 5, 1)
  `).run();

  db.prepare(`INSERT OR IGNORE INTO division_teams
    (id, name, tier, max_teams, min_roster_size, max_roster_size)
    VALUES (1, 'WorldTour', 1, 25, 20, 40)
  `).run();
}

// ---------------------------------------------------------------------------
// Seed builders.
// ---------------------------------------------------------------------------

export interface SeedTeamsOptions {
  count?: number;
  playerTeamId?: number;
}

/** Seeds `count` teams (ids 1..count). Team `playerTeamId` is the player team. */
export function seedTeams(db: Database.Database, opts: SeedTeamsOptions = {}): void {
  const count = opts.count ?? 25;
  const playerTeamId = opts.playerTeamId ?? 1;
  const insert = db.prepare(`
    INSERT INTO teams (id, name, abbreviation, division_id, is_player_team, country_id,
      color_primary, color_secondary, ai_focus_1, ai_focus_2, ai_focus_3)
    VALUES (?, ?, ?, 1, ?, 1, '#ffffff', '#000000', 1, 2, 3)
  `);
  const tx = db.transaction(() => {
    for (let i = 1; i <= count; i++) {
      const abbr = `T${String(i).padStart(2, '0')}`.slice(0, 3);
      insert.run(i, `Team ${i}`, abbr, i === playerTeamId ? 1 : 0);
    }
  });
  tx();
}

export interface SeedRiderOptions {
  id?: number;
  firstName?: string;
  lastName?: string;
  countryId?: number;
  roleId?: number | null;
  riderTypeId?: number;
  birthYear?: number;
  peakAge?: number;
  declineAge?: number;
  retirementAge?: number;
  skillDevelopment?: number;
  potOverall?: number;
  overallRating?: number;
  activeTeamId?: number | null;
  isRetired?: 0 | 1;
  spec1?: number;
  spec2?: number;
  spec3?: number;
}

/** Inserts one rider with sensible defaults; returns the rider id. */
export function seedRider(db: Database.Database, opts: SeedRiderOptions = {}): number {
  const info = db.prepare(`
    INSERT INTO riders (
      id, first_name, last_name, country_id, role_id, rider_type_id, birth_year,
      peak_age, decline_age, retirement_age, skill_development,
      pot_overall, overall_rating,
      specialization_1_id, specialization_2_id, specialization_3_id,
      active_team_id, is_retired
    ) VALUES (
      @id, @firstName, @lastName, @countryId, @roleId, @riderTypeId, @birthYear,
      @peakAge, @declineAge, @retirementAge, @skillDevelopment,
      @potOverall, @overallRating,
      @spec1, @spec2, @spec3,
      @activeTeamId, @isRetired
    )
  `).run({
    id: opts.id ?? null,
    firstName: opts.firstName ?? 'Fahrer',
    lastName: opts.lastName ?? `${opts.id ?? 'X'}`,
    countryId: opts.countryId ?? 1,
    roleId: opts.roleId === undefined ? 3 : opts.roleId,
    riderTypeId: opts.riderTypeId ?? 1,
    birthYear: opts.birthYear ?? 1998,
    peakAge: opts.peakAge ?? 25,
    declineAge: opts.declineAge ?? 30,
    retirementAge: opts.retirementAge ?? 35,
    skillDevelopment: opts.skillDevelopment ?? 10,
    potOverall: opts.potOverall ?? 70,
    overallRating: opts.overallRating ?? 65,
    spec1: opts.spec1 ?? 1,
    spec2: opts.spec2 ?? 2,
    spec3: opts.spec3 ?? 3,
    activeTeamId: opts.activeTeamId === undefined ? null : opts.activeTeamId,
    isRetired: opts.isRetired ?? 0,
  });
  return Number(info.lastInsertRowid);
}

export interface SeedGameStateOptions {
  date: string;
  season: number;
  draftStatus?: 'completed' | 'active' | 'pending';
  draftSeason?: number | null;
}

export function seedGameState(db: Database.Database, opts: SeedGameStateOptions): void {
  db.prepare(`
    INSERT OR REPLACE INTO game_state
      (id, current_date, season, is_game_over, draft_status, draft_current_pick_number, draft_season)
    VALUES (1, ?, ?, 0, ?, 1, ?)
  `).run(opts.date, opts.season, opts.draftStatus ?? 'completed', opts.draftSeason ?? null);
}
