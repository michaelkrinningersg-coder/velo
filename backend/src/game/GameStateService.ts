import Database from 'better-sqlite3';
import { EventEmitter } from 'events';
import { GameState, GameStatus, PendingStage } from '../../../shared/types';
import { GameStateRepository } from "../db/repositories/GameStateRepository";
import { RaceRepository } from "../db/repositories/RaceRepository";
import { ResultRepository } from "../db/repositories/ResultRepository";
import { RiderRepository } from "../db/repositories/RiderRepository";
import { TeamRepository } from "../db/repositories/TeamRepository";

import { refreshRaceEntriesForRaceStart } from '../simulation/RaceRosterService';
import { getDeterministicWeatherEffect } from '../db/mappers';
import { ContractService } from './ContractService';
import { RiderDevelopmentService, type RiderDevelopmentDailyContext } from './RiderDevelopmentService';
import { RiderProgramService } from './RiderProgramService';
import { RiderRoleService } from './RiderRoleService';
import { RiderDraftService } from './RiderDraftService';
import { RiderNewgenService } from './RiderNewgenService';

const DEFAULT_START_DATE = '2026-01-01';
const DEFAULT_START_SEASON = 2026;
const SEASON_FORM_MIN_RAW = 0;
const SEASON_FORM_MAX_RAW = 4;
const SEASON_FORM_RISE_DAYS = 56;
const SEASON_FORM_RISE_STEP_RAW = SEASON_FORM_MAX_RAW / SEASON_FORM_RISE_DAYS;
const SEASON_FORM_FALL_DAYS = 14;
const RACE_FORM_BUILD_STEP = 0.25;
const RACE_FORM_FREE_STEP = 0.15;
const BUILD_R_FORM_EXPIRY_DAYS = 56;
const FREE_R_FORM_EXPIRY_DAYS = 25;
const PEAK_MIN_SPACING_DAYS = 28;
const ILLNESS_CHANCE = 0.0025;
const INJURY_CHANCE = 0.002;

type DayAdvancedListener = (state: GameState) => void;

interface GameStateRow {
  current_date: string;
  season: number;
  is_game_over: number;
}

interface DailyCheckSummary {
  hasRaceToday: boolean;
  racesTodayCount: number;
}

interface PendingStageRow {
  stage_id: number;
  race_id: number;
  race_name: string;
  stage_number: number;
  date: string;
  profile: PendingStage['profile'];
  start_elevation: number;
  details_csv_file: string;
  is_stage_race: number;
}

interface RiderDailyStateRow {
  rider_id: number;
  season: number;
  form_bonus: number;
  race_form_bonus: number;
  peak_s_form: number;
  peak_r_form: number;
  active_peak_date: string | null;
  peak_dates_json: string;
  health_status: 'healthy' | 'ill' | 'injured';
  unavailable_until: string | null;
  unavailable_days_remaining: number;
  season_race_days_total: number;
  rolling_30d_race_days: number;
  short_term_fatigue: number;
  long_term_fatigue_decayable: number;
  long_term_fatigue_locked: number;
  skill_recuperation?: number;
  consecutive_non_race_days?: number;
  birth_year?: number;
}

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName) as { name: string } | undefined;
  return row != null;
}

function columnExists(db: Database.Database, tableName: string, columnName: string): boolean {
  if (!tableExists(db, tableName)) {
    return false;
  }

  const rows = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
  return rows.some((row: any) => row.name === columnName);
}

export class GameStateService {
  private readonly db: Database.Database;
  private readonly events = new EventEmitter();
  private syncedStateDate: string | null = null;

  // Caches to avoid repeated schema/peak-date work in the day-change hot path.
  private schemaReady = false;
  private readonly knownTables = new Set<string>();
  private readonly knownColumns = new Set<string>();
  private readonly peakDatesBySeason = new Map<number, Map<number, string[]>>();
  private readonly programWindowsBySeason = new Map<number, Map<number, ProgramPeakWindows>>();
  // Tracks the last (s_form, r_form) we wrote into rider_form_history so we can
  // skip writing when nothing changed for the day.
  private lastFormHistoryHash = '';
  private formHistoryHashKnown = false;

  constructor(db: Database.Database) {
    this.db = db;
  }

  private isTable(name: string): boolean {
    if (this.knownTables.has(name)) return true;
    if (!tableExists(this.db, name)) return false;
    this.knownTables.add(name);
    return true;
  }

  private isColumn(tableName: string, columnName: string): boolean {
    const key = `${tableName}.${columnName}`;
    if (this.knownColumns.has(key)) return true;
    if (!this.isTable(tableName)) return false;
    if (!columnExists(this.db, tableName, columnName)) return false;
    this.knownColumns.add(key);
    return true;
  }

  private ensureSchemaOnce(): void {
    if (this.schemaReady) return;
    this.ensureRiderDailyStateTable();
    this.ensureRiderFormTables();
    this.knownTables.add('game_state');
    this.knownTables.add('rider_daily_state');
    this.knownTables.add('rider_r_form_events');
    this.knownTables.add('rider_form_history');
    this.knownTables.add('rider_r_form_daily_awards');
    this.knownTables.add('rider_peak_awards');
    this.knownColumns.add('rider_daily_state.season_race_days_total');
    this.knownColumns.add('rider_daily_state.rolling_30d_race_days');
    this.knownColumns.add('rider_daily_state.race_form_bonus');
    this.knownColumns.add('rider_daily_state.peak_s_form');
    this.knownColumns.add('rider_daily_state.peak_r_form');
    this.knownColumns.add('rider_daily_state.active_peak_date');
    this.knownColumns.add('rider_daily_state.peak_dates_json');
    this.knownColumns.add('rider_daily_state.form_bonus');
    this.knownColumns.add('rider_daily_state.health_status');
    this.knownColumns.add('rider_daily_state.unavailable_until');
    this.knownColumns.add('rider_daily_state.unavailable_days_remaining');
    this.knownColumns.add('rider_daily_state.short_term_fatigue');
    this.knownColumns.add('rider_daily_state.long_term_fatigue_decayable');
    this.knownColumns.add('rider_daily_state.long_term_fatigue_locked');
    this.knownColumns.add('rider_daily_state.consecutive_non_race_days');
    this.schemaReady = true;
  }

  /**
   * Returns a Map<riderId, ProgramPeakWindows> for the given season, loaded in
   * a single SQL query and cached in-memory. This is the bulk equivalent of
   * `loadProgramPeakWindows` and is the main N+1 fix for the day-change path.
   */
  private getProgramWindowsForSeason(season: number): Map<number, ProgramPeakWindows> {
    const cached = this.programWindowsBySeason.get(season);
    if (cached) return cached;
    const fresh = loadProgramPeakWindowsForSeason(this.db, season);
    this.programWindowsBySeason.set(season, fresh);
    return fresh;
  }

  public ensureState(): GameState {
    this.ensureSchemaOnce();
    const state = this.loadState();
    new RiderProgramService(this.db).ensureSeasonPrograms(state.season, state.currentDate);
    if (this.syncedStateDate !== state.currentDate) {
      this.syncCurrentSeasonFormState(state.currentDate, state.season);
      this.syncDailyFormHistory(state.currentDate);
      this.syncedStateDate = state.currentDate;
    }

      // Lazily populate rider_skill_yearly_baseline for current season if missing
      const baselineCount = (this.db.prepare('SELECT count(*) as c FROM rider_skill_yearly_baseline WHERE season = ?').get(state.season) as any).c;
      if (baselineCount === 0) {
        this.db.prepare(`
          INSERT OR IGNORE INTO rider_skill_yearly_baseline (rider_id, season, skill_key, baseline_value)
          SELECT id, ?, 'overall_rating', overall_rating FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'flat', skill_flat FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'mountain', skill_mountain FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'medium_mountain', skill_medium_mountain FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'hill', skill_hill FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'time_trial', skill_time_trial FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'cobble', skill_cobble FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'sprint', skill_sprint FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'acceleration', skill_acceleration FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'downhill', skill_downhill FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'stamina', skill_stamina FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'resistance', skill_resistance FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'recuperation', skill_recuperation FROM riders WHERE is_retired = 0
        `).run(state.season, state.season, state.season, state.season, state.season, state.season, state.season, state.season, state.season, state.season, state.season, state.season, state.season);
      }

    this.db.prepare(`
      INSERT INTO career_meta (key, value) VALUES ('current_season', ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(String(state.season));
    return state;
  }

  public loadState(): GameState {
    this.ensureSchemaOnce();
    const row = this.db.prepare(
      'SELECT "current_date" AS current_date, season, is_game_over FROM game_state WHERE id = 1',
    ).get() as GameStateRow | undefined;
    if (!row) throw new Error('game_state konnte nicht geladen werden.');
    return this.mapState(row);
  }

  public loadStatus(): GameStatus {
    const state = this.loadState();
    const pendingStages = this.getPendingStages(state.currentDate);
    return {
      currentDate: state.currentDate,
      season: state.season,
      isRaceDay: pendingStages.length > 0,
      currentStageId: pendingStages[0]?.stageId ?? null,
      pendingStages,
    };
  }

  public advanceDay(): GameState {
    ResultRepository.clearInMemoryStageEvents();
    const nextState = this.db.transaction(() => {
      this.ensureStateRow();
      const currentRow = this.db.prepare(
        'SELECT "current_date" AS current_date, season, is_game_over FROM game_state WHERE id = 1',
      ).get() as GameStateRow | undefined;
      if (!currentRow) throw new Error('game_state nicht ladbar.');

      const pendingStages = this.getPendingStages(currentRow.current_date);
      if (pendingStages.length > 0) {
        throw new Error('Der Tag kann nicht beendet werden, solange offene Rennen oder Etappen simuliert werden muessen.');
      }

      const nextDate = addDaysIso(currentRow.current_date, 1);
      const nextSeason = resolveSeason(nextDate, currentRow.season);
      if (nextSeason !== currentRow.season) {
        new ContractService(this.db).checkContractStatuses(nextSeason);
        new RiderDraftService(this.db).executeDraft(nextSeason);
        new ContractService(this.db).checkContractStatuses(nextSeason); // activate new draft contracts
        new RiderDevelopmentService(this.db).recalculateSpecializations(nextSeason);
        new RiderRoleService(this.db).recalculateAllTeamRoles();
        new RiderProgramService(this.db).ensureSeasonPrograms(nextSeason, nextDate);

        // Newgens fÃ¼r die nÃ¤chste Saison erzeugen
        new RiderNewgenService(this.db).createYearStartNewgens(nextSeason);

        // Skill-Development aller aktiven Fahrer neu auswÃ¼rfeln (Â±3, max 20, min 1)
        this.db.prepare(`
          UPDATE riders
          SET skill_development = MAX(1, MIN(20, skill_development + CAST((ABS(RANDOM()) % 7) - 3 AS INTEGER)))
          WHERE is_retired = 0 AND skill_development > 0
        `).run();

        // Snapshot der Fahrer-Werte als Baseline fÃ¼r die Saison in der UI abspeichern
        this.db.prepare(`
          INSERT OR REPLACE INTO rider_skill_yearly_baseline (rider_id, season, skill_key, baseline_value)
          SELECT id, ?, 'overall_rating', overall_rating FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'flat', skill_flat FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'mountain', skill_mountain FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'medium_mountain', skill_medium_mountain FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'hill', skill_hill FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'time_trial', skill_time_trial FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'prologue', skill_prologue FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'cobble', skill_cobble FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'sprint', skill_sprint FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'acceleration', skill_acceleration FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'downhill', skill_downhill FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'attack', skill_attack FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'stamina', skill_stamina FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'resistance', skill_resistance FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'recuperation', skill_recuperation FROM riders WHERE is_retired = 0
          UNION ALL SELECT id, ?, 'bike_handling', skill_bike_handling FROM riders WHERE is_retired = 0
        `).run(...Array(16).fill(nextSeason));
      }
      this.ensureRiderDailyStateTable();
      this.ensureRiderDailyStateRows(currentRow.season);
      this.advanceRiderDailyStates(nextDate, nextSeason);
      new GameStateRepository(this.db).markUnavailableStageRaceParticipantsAsDnf();
      this.db.prepare(
        'UPDATE game_state SET "current_date" = ?, season = ?, is_game_over = ? WHERE id = 1',
      ).run(nextDate, nextSeason, currentRow.is_game_over);
      this.db.prepare(`
        INSERT INTO career_meta (key, value) VALUES ('current_season', ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `).run(String(nextSeason));

      this.prepareRaceEntriesForRaceStarts(nextDate);
      const checks = this.runDailyChecks(nextDate);

      return this.mapState({ current_date: nextDate, season: nextSeason, is_game_over: currentRow.is_game_over }, checks);
    })();

    this.events.emit('dayAdvanced', nextState);
    return nextState;
  }

  public onDayAdvanced(listener: DayAdvancedListener): () => void {
    this.events.on('dayAdvanced', listener);
    return () => this.events.off('dayAdvanced', listener);
  }

  public refreshRiderLoadState(currentDate: string, currentSeason: number): void {
    this.ensureRiderDailyStateTable();
    this.ensureRiderDailyStateRows(currentSeason);
    this.syncRiderLoadState(currentDate, currentSeason);
  }

  private ensureStateRow(): void {
    // Lightweight idempotent INSERT-OR-IGNORE for game_state. CREATE TABLE IF NOT EXISTS
    // and other heavy idempotent schema work is handled in ensureSchemaOnce().
    this.db.prepare(
      'INSERT OR IGNORE INTO game_state (id, "current_date", season, is_game_over) VALUES (1, ?, ?, 0)',
    ).run(DEFAULT_START_DATE, DEFAULT_START_SEASON);
  }

  private ensureRiderDailyStateTable(): void {
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_daily_state (
        rider_id INTEGER PRIMARY KEY REFERENCES riders(id) ON DELETE CASCADE,
        season INTEGER NOT NULL,
        form_bonus REAL NOT NULL DEFAULT 0.0,
        race_form_bonus REAL NOT NULL DEFAULT 0.0,
        peak_s_form REAL NOT NULL DEFAULT 0.0,
        peak_r_form REAL NOT NULL DEFAULT 0.0,
        active_peak_date TEXT,
        peak_dates_json TEXT NOT NULL DEFAULT '[]',
        health_status TEXT NOT NULL DEFAULT 'healthy' CHECK(health_status IN ('healthy', 'ill', 'injured')),
        unavailable_until TEXT,
        unavailable_days_remaining INTEGER NOT NULL DEFAULT 0 CHECK(unavailable_days_remaining >= 0),
        season_race_days_total INTEGER NOT NULL DEFAULT 0 CHECK(season_race_days_total >= 0),
        rolling_30d_race_days INTEGER NOT NULL DEFAULT 0 CHECK(rolling_30d_race_days >= 0),
        short_term_fatigue REAL NOT NULL DEFAULT 0.0,
        long_term_fatigue_decayable REAL NOT NULL DEFAULT 0.0,
        long_term_fatigue_locked REAL NOT NULL DEFAULT 0.0,
        consecutive_non_race_days INTEGER NOT NULL DEFAULT 0
      )
    `).run();

    if (!columnExists(this.db, 'rider_daily_state', 'season_race_days_total')) {
      this.db.prepare(`
        ALTER TABLE rider_daily_state
        ADD COLUMN season_race_days_total INTEGER NOT NULL DEFAULT 0 CHECK(season_race_days_total >= 0)
      `).run();
    }

    if (!columnExists(this.db, 'rider_daily_state', 'rolling_30d_race_days')) {
      this.db.prepare(`
        ALTER TABLE rider_daily_state
        ADD COLUMN rolling_30d_race_days INTEGER NOT NULL DEFAULT 0 CHECK(rolling_30d_race_days >= 0)
      `).run();
    }

    if (!columnExists(this.db, 'rider_daily_state', 'short_term_fatigue')) {
      this.db.prepare(`
        ALTER TABLE rider_daily_state
        ADD COLUMN short_term_fatigue REAL NOT NULL DEFAULT 0.0
      `).run();
    }

    if (!columnExists(this.db, 'rider_daily_state', 'long_term_fatigue_decayable')) {
      this.db.prepare(`
        ALTER TABLE rider_daily_state
        ADD COLUMN long_term_fatigue_decayable REAL NOT NULL DEFAULT 0.0
      `).run();
    }

    if (!columnExists(this.db, 'rider_daily_state', 'long_term_fatigue_locked')) {
      this.db.prepare(`
        ALTER TABLE rider_daily_state
        ADD COLUMN long_term_fatigue_locked REAL NOT NULL DEFAULT 0.0
      `).run();
    }

    if (!columnExists(this.db, 'rider_daily_state', 'consecutive_non_race_days')) {
      this.db.prepare(`
        ALTER TABLE rider_daily_state
        ADD COLUMN consecutive_non_race_days INTEGER NOT NULL DEFAULT 0
      `).run();
    }

    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_fatigue_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        date TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('race', 'decay')),
        race_name TEXT,
        stage_number INTEGER,
        stage_score REAL,
        short_change REAL NOT NULL,
        long_decayable_change REAL NOT NULL,
        long_locked_change REAL NOT NULL,
        short_after REAL NOT NULL,
        long_after REAL NOT NULL
      )
    `).run();

    this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_rider_fatigue_history_rider_date
      ON rider_fatigue_history(rider_id, date)
    `).run();
  }

  private ensureRiderFormTables(): void {
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_r_form_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        source_date TEXT NOT NULL,
        expires_on TEXT NOT NULL,
        amount REAL NOT NULL CHECK(amount >= 0),
        event_type TEXT NOT NULL CHECK(event_type IN ('race_day'))
      )
    `).run();

    this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_rider_r_form_events_rider_date
      ON rider_r_form_events(rider_id, source_date, expires_on)
    `).run();

    this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_rider_r_form_events_expires_on
      ON rider_r_form_events(expires_on)
    `).run();

    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_form_history (
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        date TEXT NOT NULL,
        s_form REAL NOT NULL,
        r_form REAL NOT NULL,
        total_form REAL NOT NULL,
        short_fatigue REAL NOT NULL DEFAULT 0.0,
        long_fatigue REAL NOT NULL DEFAULT 0.0,
        combined_fatigue REAL NOT NULL DEFAULT 0.0,
        PRIMARY KEY (rider_id, date)
      )
    `).run();

    const colExists = (tableName: string, colName: string): boolean => {
      try {
        const info = this.db.prepare(`PRAGMA table_info(${tableName})`).all() as any[];
        return info.some((c) => c.name === colName);
      } catch (e) {
        return false;
      }
    };
    if (!colExists('rider_form_history', 'short_fatigue')) {
      this.db.prepare('ALTER TABLE rider_form_history ADD COLUMN short_fatigue REAL NOT NULL DEFAULT 0.0').run();
    }
    if (!colExists('rider_form_history', 'long_fatigue')) {
      this.db.prepare('ALTER TABLE rider_form_history ADD COLUMN long_fatigue REAL NOT NULL DEFAULT 0.0').run();
    }
    if (!colExists('rider_form_history', 'combined_fatigue')) {
      this.db.prepare('ALTER TABLE rider_form_history ADD COLUMN combined_fatigue REAL NOT NULL DEFAULT 0.0').run();
    }

    this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_rider_form_history_date
      ON rider_form_history(date, rider_id)
    `).run();

    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_r_form_daily_awards (
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        award_date TEXT NOT NULL,
        award_type TEXT NOT NULL CHECK(award_type IN ('build', 'free')),
        PRIMARY KEY (rider_id, award_date)
      )
    `).run();

    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_peak_awards (
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        season INTEGER NOT NULL,
        peak_date TEXT NOT NULL,
        PRIMARY KEY (rider_id, season, peak_date)
      )
    `).run();
  }

  private ensureRiderDailyStateRows(season: number): void {
    if (!tableExists(this.db, 'riders')) {
      return;
    }

    const missingRows = this.db.prepare(`
      SELECT riders.id AS id
      FROM riders
      LEFT JOIN rider_daily_state existing_state ON existing_state.rider_id = riders.id
      WHERE riders.is_retired = 0
        AND existing_state.rider_id IS NULL
      ORDER BY riders.id ASC
    `).all() as Array<{ id: number }>;
    if (missingRows.length === 0) {
      return;
    }

    // Use cached program windows (or the slow-path loader as a fallback) so we
    // avoid one SQL per newly-inserted rider.
    const programWindows = this.getProgramWindowsForSeason(season);
    const insertState = this.db.prepare(`
      INSERT INTO rider_daily_state (
        rider_id, season, form_bonus, race_form_bonus, peak_s_form, peak_r_form, active_peak_date, peak_dates_json, health_status, unavailable_until, unavailable_days_remaining, season_race_days_total, rolling_30d_race_days
      ) VALUES (?, ?, ?, 0, 0, 0, NULL, ?, 'healthy', NULL, 0, 0, 0)
    `);

    for (const rider of missingRows) {
      const windows = programWindows.get(rider.id) ?? null;
      const peakDates = resolveSeasonPeakDatesFromWindows([], season, windows);
      insertState.run(rider.id, season, SEASON_FORM_MIN_RAW, JSON.stringify(peakDates));
    }
  }

  private syncCurrentSeasonFormState(currentDate: string, currentSeason: number): void {
    if (!this.isTable('rider_daily_state')) {
      return;
    }

    this.ensureRiderDailyStateRows(currentSeason);
    this.syncRiderLoadState(currentDate, currentSeason);

    const rows = this.db.prepare(`
      SELECT rider_id, season, form_bonus, race_form_bonus, peak_s_form, peak_r_form, active_peak_date, peak_dates_json, health_status, unavailable_until, unavailable_days_remaining, season_race_days_total, rolling_30d_race_days
      FROM rider_daily_state
    `).all() as RiderDailyStateRow[];
    const updateState = this.db.prepare(`
      UPDATE rider_daily_state
      SET season = ?,
          form_bonus = ?,
          peak_s_form = ?,
          active_peak_date = ?,
          peak_dates_json = ?
      WHERE rider_id = ?
    `);

    // Bulk-load program windows once, then look up per rider from the in-memory map.
    const programWindows = this.getProgramWindowsForSeason(currentSeason);

    for (const row of rows) {
      const seasonChanged = row.season !== currentSeason;
      const windows = seasonChanged ? null : (programWindows.get(row.rider_id) ?? null);
      const peakDates = resolveSeasonPeakDatesFromWindows(
        seasonChanged ? [] : parsePeakDates(row.peak_dates_json),
        currentSeason,
        windows,
      );
      const phase = resolvePeakPhase(currentDate, peakDates);
      let formBonus = row.form_bonus;
      let peakSForm = row.peak_s_form;
      let activePeakDate = row.active_peak_date;

      if (phase?.phase === 'build') {
        activePeakDate = null;
        peakSForm = 0;
        // S-Form only accumulates via daily advances (syncRiderDailyStates).
        // Prevent retroactive form from the previous year: if the build window
        // started before Jan 1 of this season, the max legitimate form is
        // (days since Jan 1) * RISE_STEP. If the DB value exceeds this (e.g.
        // from an older run), reset it to 0 so it builds up correctly.
        const peakDayForBuild = isoDateToDayNumber(phase.peakDate);
        const buildWindowStart = peakDayForBuild - SEASON_FORM_RISE_DAYS;
        const seasonStartDay = isoDateToDayNumber(`${currentSeason}-01-01`);
        if (buildWindowStart < seasonStartDay || seasonChanged) {
          const currentDayNum = isoDateToDayNumber(currentDate);
          const daysSinceSeasonStart = Math.max(0, currentDayNum - seasonStartDay);
          const maxLegitForm = roundFormBonus(Math.min(SEASON_FORM_MAX_RAW, daysSinceSeasonStart * SEASON_FORM_RISE_STEP_RAW));
          if (formBonus > maxLegitForm) {
            formBonus = SEASON_FORM_MIN_RAW;
          }
        }
      } else if (phase?.phase === 'decline') {
        peakSForm = row.active_peak_date === phase.peakDate ? row.peak_s_form : row.form_bonus;
        formBonus = resolveDeclineValue(peakSForm, phase.elapsedDays);
        activePeakDate = phase.peakDate;
      } else {
        formBonus = 0;
        peakSForm = 0;
        activePeakDate = null;
      }

      const roundedFormBonus = roundFormBonus(formBonus);
      const roundedPeakSForm = roundFormBonus(peakSForm);
      const peakDatesJson = JSON.stringify(peakDates);
      // Skip the UPDATE on quiet days where form is stable.
      if (
        seasonChanged
        || row.form_bonus !== roundedFormBonus
        || row.peak_s_form !== roundedPeakSForm
        || row.active_peak_date !== activePeakDate
        || row.peak_dates_json !== peakDatesJson
      ) {
        updateState.run(
          currentSeason,
          roundedFormBonus,
          roundedPeakSForm,
          activePeakDate,
          peakDatesJson,
          row.rider_id,
        );
      }
    }
  }

  private advanceRiderDailyStates(nextDate: string, nextSeason: number): void {
    if (!this.isTable('rider_daily_state')) {
      return;
    }

    this.ensureRiderDailyStateRows(nextSeason);
    this.removeExpiredRaceFormEvents(nextDate);
    this.syncRiderLoadState(nextDate, nextSeason);

    const rows = this.db.prepare(`
      SELECT rds.rider_id, rds.season, rds.form_bonus, rds.race_form_bonus, rds.peak_s_form, rds.peak_r_form, rds.active_peak_date, rds.peak_dates_json, rds.health_status, rds.unavailable_until, rds.unavailable_days_remaining, rds.season_race_days_total, rds.rolling_30d_race_days,
             rds.short_term_fatigue, rds.long_term_fatigue_decayable, rds.long_term_fatigue_locked, rds.consecutive_non_race_days,
             r.skill_recuperation, r.birth_year
      FROM rider_daily_state rds
      JOIN riders r ON r.id = rds.rider_id
    `).all() as RiderDailyStateRow[];
    const updateState = this.db.prepare(`
      UPDATE rider_daily_state
      SET season = ?,
          form_bonus = ?,
          race_form_bonus = ?,
          peak_s_form = ?,
          peak_r_form = ?,
          active_peak_date = ?,
          peak_dates_json = ?,
          health_status = ?,
          unavailable_until = ?,
          unavailable_days_remaining = ?,
          short_term_fatigue = ?,
          long_term_fatigue_decayable = ?,
          long_term_fatigue_locked = ?,
          consecutive_non_race_days = ?
      WHERE rider_id = ?
    `);

    const insertFatigueHistory = this.db.prepare(`
      INSERT INTO rider_fatigue_history (
        rider_id, date, type, race_name, stage_number, stage_score,
        short_change, long_decayable_change, long_locked_change,
        short_after, long_after
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const racingRidersRow = this.db.prepare(`
      SELECT se.rider_id FROM stage_entries se
      JOIN stages s ON s.id = se.stage_id
      WHERE s.date = ? AND se.status IN ('scheduled', 'started')
    `).all(nextDate) as Array<{ rider_id: number }>;
    const racingRiderIds = new Set(racingRidersRow.map((r: any) => r.rider_id));

    const yesterday = addDaysIso(nextDate, -1);
    const racedYesterdayRow = this.db.prepare(`
      SELECT se.rider_id FROM stage_entries se
      JOIN stages s ON s.id = se.stage_id
      WHERE s.date = ? AND se.status IN ('finished', 'dnf')
    `).all(yesterday) as Array<{ rider_id: number }>;
    const racedYesterdayRiderIds = new Set(racedYesterdayRow.map((r: any) => r.rider_id));

    // Bulk-load program windows for the current season ONCE instead of doing
    // a per-rider SELECT in `loadProgramPeakWindows` (the previous N+1 hot spot).
    const programWindows = this.getProgramWindowsForSeason(nextSeason);
    const seasonChangedRiderIds: number[] = [];
    const developmentContexts: RiderDevelopmentDailyContext[] = [];
    const deleteFormEvents = this.db.prepare(`
      DELETE FROM rider_r_form_events
      WHERE rider_id = ?
    `);

    for (const row of rows) {
      const seasonChanged = row.season !== nextSeason;
      const riderProgramWindows = seasonChanged ? null : (programWindows.get(row.rider_id) ?? null);
      const peakDates = resolveSeasonPeakDatesFromWindows(
        seasonChanged ? [] : parsePeakDates(row.peak_dates_json),
        nextSeason,
        riderProgramWindows,
      );
      let formBonus = seasonChanged ? SEASON_FORM_MIN_RAW : row.form_bonus;
      let raceFormBonus = seasonChanged ? 0 : row.race_form_bonus;
      let peakSForm = seasonChanged ? 0 : row.peak_s_form;
      let peakRForm = seasonChanged ? 0 : row.peak_r_form;
      let activePeakDate = seasonChanged ? null : row.active_peak_date;
      let healthStatus = row.health_status;
      let remainingDays = row.unavailable_days_remaining;
      let unavailableUntil = row.unavailable_until;

      if (seasonChanged) {
        seasonChangedRiderIds.push(row.rider_id);
      }

      if (remainingDays > 0) {
        remainingDays = Math.max(remainingDays - 1, 0);
        unavailableUntil = remainingDays > 0 ? addDaysIso(nextDate, remainingDays - 1) : null;
        if (remainingDays === 0) {
          healthStatus = 'healthy';
          unavailableUntil = null;
        }
      }

      if (healthStatus === 'healthy') {
        const newCondition = rollDailyCondition(nextDate);
        if (newCondition) {
          healthStatus = newCondition.status;
          remainingDays = newCondition.durationDays;
          unavailableUntil = addDaysIso(nextDate, newCondition.durationDays - 1);

          // Update career stats in the database
          if (tableExists(this.db, 'rider_career_stats')) {
            const isIll = newCondition.status === 'ill';
            this.db.prepare(`
              INSERT INTO rider_career_stats (
                rider_id, illnesses, illness_days, injuries, injury_days
              ) VALUES (?, ?, ?, ?, ?)
              ON CONFLICT(rider_id) DO UPDATE SET
                illnesses = illnesses + excluded.illnesses,
                illness_days = illness_days + excluded.illness_days,
                injuries = injuries + excluded.injuries,
                injury_days = injury_days + excluded.injury_days
            `).run(
              row.rider_id,
              isIll ? 1 : 0,
              isIll ? newCondition.durationDays : 0,
              isIll ? 0 : 1,
              isIll ? 0 : newCondition.durationDays
            );
          }
          if (tableExists(this.db, 'rider_season_stats')) {
            const isIll = newCondition.status === 'ill';
            this.db.prepare(`
              INSERT INTO rider_season_stats (
                rider_id, season, illnesses, illness_days, injuries, injury_days
              ) VALUES (?, ?, ?, ?, ?, ?)
              ON CONFLICT(rider_id, season) DO UPDATE SET
                illnesses = illnesses + excluded.illnesses,
                illness_days = illness_days + excluded.illness_days,
                injuries = injuries + excluded.injuries,
                injury_days = injury_days + excluded.injury_days
            `).run(
              row.rider_id,
              nextSeason,
              isIll ? 1 : 0,
              isIll ? newCondition.durationDays : 0,
              isIll ? 0 : 1,
              isIll ? 0 : newCondition.durationDays
            );
          }
        }
      }

      const phase = resolvePeakPhase(nextDate, peakDates);
      if (phase?.phase === 'decline' && phase.elapsedDays === 0) {
        activePeakDate = phase.peakDate;
        peakSForm = formBonus;
        peakRForm = roundFormBonus(Math.max(0, raceFormBonus));
      } else if (phase?.phase === 'decline') {
        activePeakDate = phase.peakDate;
        formBonus = resolveDeclineValue(peakSForm, phase.elapsedDays);
        raceFormBonus = resolveRaceDeclineValue(peakRForm, phase.elapsedDays);
        if (phase.elapsedDays >= SEASON_FORM_FALL_DAYS) {
          activePeakDate = null;
          peakSForm = 0;
          peakRForm = 0;
        }
      } else if (phase?.phase === 'build') {
        activePeakDate = null;
        peakSForm = 0;
        peakRForm = 0;
        // Only accumulate form after Jan 1 of the current season.
        // If the build window starts in the previous year, riders begin at 0 on Jan 1.
        const peakDayForBuild2 = isoDateToDayNumber(phase.peakDate);
        const buildWindowStartDay = peakDayForBuild2 - SEASON_FORM_RISE_DAYS;
        const seasonStart2Day = isoDateToDayNumber(`${nextSeason}-01-01`);
        const nextDayNum = isoDateToDayNumber(nextDate);
        const effectiveBuildStart = Math.max(buildWindowStartDay, seasonStart2Day);
        if (nextDayNum >= effectiveBuildStart && healthStatus === 'healthy') {
          formBonus = roundFormBonus(Math.min(SEASON_FORM_MAX_RAW, formBonus + SEASON_FORM_RISE_STEP_RAW));
        } else if (nextDayNum < effectiveBuildStart) {
          formBonus = SEASON_FORM_MIN_RAW;
        }
      } else {
        activePeakDate = null;
        peakSForm = 0;
        peakRForm = 0;
        formBonus = 0;
        raceFormBonus = 0;
      }

      developmentContexts.push({
        riderId: row.rider_id,
        healthStatus,
        unavailableDaysRemaining: remainingDays,
        formPhase: phase?.phase ?? null,
        isInRaceToday: racingRiderIds.has(row.rider_id),
        isPeakStartDay: phase?.phase === 'decline' && phase.elapsedDays === 0,
        peakDate: phase?.peakDate ?? null,
      });

      // Daily Fatigue Decay / Season Resets
      let consecutiveNonRaceDays = row.consecutive_non_race_days ?? 0;
      if (seasonChanged) {
        consecutiveNonRaceDays = 0;
      } else if (racedYesterdayRiderIds.has(row.rider_id)) {
        consecutiveNonRaceDays = 0;
      } else {
        consecutiveNonRaceDays++;
      }

      let shortTermFatigue = row.short_term_fatigue ?? 0.0;
      let longTermDecayable = row.long_term_fatigue_decayable ?? 0.0;
      let longTermLocked = row.long_term_fatigue_locked ?? 0.0;

      let shortChange = 0;
      let longDecayableChange = 0;

      if (seasonChanged) {
        shortChange = -shortTermFatigue;
        longDecayableChange = -longTermDecayable;
        const longLockedChange = -longTermLocked;
        shortTermFatigue = 0.0;
        longTermDecayable = 0.0;
        longTermLocked = 0.0;

        if (shortChange !== 0 || longDecayableChange !== 0 || longLockedChange !== 0) {
          insertFatigueHistory.run(
            row.rider_id,
            nextDate,
            'decay',
            'Saisonwechsel',
            null,
            null,
            shortChange,
            longDecayableChange,
            longLockedChange,
            0.0,
            0.0
          );
        }
      } else {
        const oldShort = shortTermFatigue;
        const oldLongDecayable = longTermDecayable;

        const age = nextSeason - (row.birth_year ?? 0);
        let recoveryShort: number;
        let recoveryLong: number;

        if (consecutiveNonRaceDays >= 14) {
          const extraDays = consecutiveNonRaceDays - 14;
          if (age < 24) {
            const randShort = (Math.random() * 0.1) - 0.05; // -0.05 to 0.05
            recoveryShort = Math.min((0.3 + randShort) + extraDays * 0.01, 0.45);
            const randLong = (Math.random() * 0.01) - 0.005; // -0.005 to 0.005
            recoveryLong = Math.min((0.02 + randLong) + extraDays * 0.001, 0.025);
          } else {
            recoveryShort = Math.min(0.2 + extraDays * 0.01, 0.35);
            recoveryLong = Math.min(0.015 + extraDays * 0.001, 0.02);
          }
        } else {
          const R = row.skill_recuperation ?? 65;
          const decayMultiplier = 1 + (R - 65) * 0.01;
          recoveryShort = 0.2 * decayMultiplier;
          recoveryLong = 0.01 * decayMultiplier;
        }

        shortTermFatigue = Math.max(0.0, shortTermFatigue - recoveryShort);
        longTermDecayable = Math.max(0.0, longTermDecayable - recoveryLong);

        shortTermFatigue = roundToThreeDecimals(shortTermFatigue);
        longTermDecayable = roundToThreeDecimals(longTermDecayable);

        shortChange = roundToThreeDecimals(shortTermFatigue - oldShort);
        longDecayableChange = roundToThreeDecimals(longTermDecayable - oldLongDecayable);

        if (shortChange !== 0 || longDecayableChange !== 0) {
          insertFatigueHistory.run(
            row.rider_id,
            nextDate,
            'decay',
            'Regeneration',
            null,
            null,
            shortChange,
            longDecayableChange,
            0.0,
            shortTermFatigue,
            roundToThreeDecimals(longTermDecayable + longTermLocked)
          );
        }
      }

      // Skip the UPDATE if nothing actually changed. This saves ~5000 redundant
      // row updates on quiet days where most riders have stable state.
      const roundedFormBonus = roundFormBonus(formBonus);
      const roundedPeakSForm = roundFormBonus(peakSForm);
      const peakDatesJson = JSON.stringify(peakDates);
      if (
        seasonChanged
        || row.form_bonus !== roundedFormBonus
        || row.race_form_bonus !== raceFormBonus
        || row.peak_s_form !== roundedPeakSForm
        || row.peak_r_form !== peakRForm
        || row.active_peak_date !== activePeakDate
        || row.peak_dates_json !== peakDatesJson
        || row.health_status !== healthStatus
        || row.unavailable_until !== unavailableUntil
        || row.unavailable_days_remaining !== remainingDays
        || row.short_term_fatigue !== shortTermFatigue
        || row.long_term_fatigue_decayable !== longTermDecayable
        || row.long_term_fatigue_locked !== longTermLocked
        || row.consecutive_non_race_days !== consecutiveNonRaceDays
      ) {
        updateState.run(
          nextSeason,
          roundedFormBonus,
          raceFormBonus,
          roundedPeakSForm,
          peakRForm,
          activePeakDate,
          peakDatesJson,
          healthStatus,
          unavailableUntil,
          remainingDays,
          shortTermFatigue,
          longTermDecayable,
          longTermLocked,
          consecutiveNonRaceDays,
          row.rider_id,
        );
      }
    }

    if (seasonChangedRiderIds.length > 0) {
      // Use one prepared statement inside a tight loop instead of building a
      // giant IN(...) query; SQLite is happy with this when bound individually.
      for (const riderId of seasonChangedRiderIds) {
        deleteFormEvents.run(riderId);
      }

      if (this.isTable('rider_form_history')) {
        this.db.prepare('DELETE FROM rider_form_history').run();
      }
    }

    this.syncDailyFormHistory(nextDate);

    new RiderDevelopmentService(this.db).advanceDailyDevelopment(nextDate, nextSeason, developmentContexts);
  }

  private syncRiderLoadState(currentDate: string, currentSeason: number): void {
    if (!this.isTable('rider_daily_state') || !this.isTable('stage_entries') || !this.isTable('stages') || !this.isTable('riders')) {
      return;
    }

    const rollingWindowStart = addDaysIso(currentDate, -29);
    // Single SQL with a CTE: aggregate stage_entries once, then bulk-update
    // rider_daily_state via a row-source join. This replaces ~N+1 per-rider updates
    // with one statement.
    this.db.prepare(`
      WITH stats AS (
        SELECT stage_entries.rider_id AS rider_id,
               SUM(CASE
                 WHEN stage_entries.status IN ('finished', 'dnf')
                  AND CAST(substr(stages.date, 1, 4) AS INTEGER) = @season
                  AND stages.date <= @currentDate
                 THEN 1 ELSE 0
               END) AS season_race_days_total,
               SUM(CASE
                 WHEN stage_entries.status IN ('finished', 'dnf')
                  AND stages.date >= @rollingStart
                  AND stages.date <= @currentDate
                 THEN 1 ELSE 0
               END) AS rolling_30d_race_days
        FROM stage_entries
        JOIN stages ON stages.id = stage_entries.stage_id
        WHERE stage_entries.status IN ('finished', 'dnf')
        GROUP BY stage_entries.rider_id
      )
      UPDATE rider_daily_state
      SET season_race_days_total = COALESCE(stats.season_race_days_total, 0),
          rolling_30d_race_days  = COALESCE(stats.rolling_30d_race_days, 0)
      FROM stats
      WHERE stats.rider_id = rider_daily_state.rider_id
    `).run({
      season: currentSeason,
      currentDate,
      rollingStart: rollingWindowStart,
    });
  }

  private prepareRaceEntriesForRaceStarts(currentDate: string): void {
    if (!tableExists(this.db, 'races') || !tableExists(this.db, 'stages') || !tableExists(this.db, 'race_entries')) {
      return;
    }

    const rows = this.db.prepare(`
      SELECT races.id AS race_id, stages.id AS stage_id
      FROM races
      JOIN stages ON stages.race_id = races.id
      WHERE stages.date = ?
        AND (races.is_stage_race = 0 OR stages.stage_number = 1)
      ORDER BY races.id ASC, stages.stage_number ASC
    `).all(currentDate) as Array<{ race_id: number; stage_id: number }>;

    if (rows.length === 0) {
      return;
    }

    const raceRepo = new RaceRepository(this.db); const riderRepo = new RiderRepository(this.db); const teamRepo = new TeamRepository(this.db);
    const gsRepo = new GameStateRepository(this.db);
    for (const row of rows) {
      const race = raceRepo.getRaceById(row.race_id);
      const stage = raceRepo.getStageById(row.stage_id);
      if (!race || !stage) {
        continue;
      }
      // Build a composite repo that satisfies RaceRosterService's duck-typed `repo` parameter.
      const compositeRepo = {
        getCurrentSeason: () => gsRepo.getCurrentSeason(),
        getCurrentDate: () => gsRepo.getCurrentDate(),
        getRiders: (teamId?: number) => (riderRepo as any).getRiders(teamId),
        getTeams: (teamId?: number) => (teamRepo as any).getTeams(teamId),
        getRaceRiders: (raceId: number) => raceRepo.getRaceRiders(raceId),
        getRaceProgramsForRace: (raceId: number) => raceRepo.getRaceProgramsForRace(raceId),
        getStageRiders: (stageId: number) => raceRepo.getStageRiders(stageId),
        ensureStageEntries: (s: any) => gsRepo.ensureStageEntries(s),
        prepareStageRaceFatigue: (raceId: number, stageNumber: number, riderIds: number[]) => gsRepo.prepareStageRaceFatigue(raceId, stageNumber, riderIds),
        attachStageRaceFatigue: (raceId: number, riders: any[], stageNumber: number) => (raceRepo as any).attachStageRaceFatigue(raceId, riders, stageNumber),
        clearStageEntries: (stageId: number) => (gsRepo as any).clearStageEntries(stageId),
      };
      refreshRaceEntriesForRaceStart(this.db, compositeRepo, race, stage);
    }
  }

  private removeExpiredRaceFormEvents(currentDate: string): void {
    if (!tableExists(this.db, 'rider_r_form_events')) {
      return;
    }

    this.db.prepare('DELETE FROM rider_r_form_events WHERE expires_on <= ?').run(currentDate);
  }

  private syncDailyFormHistory(currentDate: string): void {
    if (!this.isTable('rider_daily_state') || !this.isTable('rider_form_history') || !this.isTable('riders')) {
      return;
    }

    // Single INSERT...SELECT with UPSERT. The aggregation and the write happen
    // in one statement instead of a per-rider JS loop.
    this.db.prepare(`
      INSERT INTO rider_form_history (
        rider_id, date, s_form, r_form, total_form, short_fatigue, long_fatigue, combined_fatigue
      )
      SELECT
        rds.rider_id,
        @date AS date,
        ROUND(MIN(@seasonFormMax, MAX(0, rds.form_bonus)) * 100) / 100 AS s_form,
        MIN(4.0, ROUND((COALESCE(SUM(rfe.amount), 0)) * 100) / 100) AS r_form,
        ROUND(MIN(@seasonFormMax, MAX(0, rds.form_bonus)) * 100) / 100
          + MIN(4.0, ROUND((COALESCE(SUM(rfe.amount), 0)) * 100) / 100)
          AS total_form,
        ROUND(rds.short_term_fatigue * 100) / 100 AS short_fatigue,
        ROUND((rds.long_term_fatigue_decayable + rds.long_term_fatigue_locked) * 100) / 100 AS long_fatigue,
        ROUND((rds.short_term_fatigue + rds.long_term_fatigue_decayable + rds.long_term_fatigue_locked) * 100) / 100 AS combined_fatigue
      FROM rider_daily_state rds
      JOIN riders ON riders.id = rds.rider_id
      LEFT JOIN rider_r_form_events rfe ON rfe.rider_id = rds.rider_id
      WHERE riders.active_team_id IS NOT NULL AND riders.is_retired = 0
      GROUP BY rds.rider_id, rds.form_bonus, rds.race_form_bonus, rds.short_term_fatigue, rds.long_term_fatigue_decayable, rds.long_term_fatigue_locked
      ON CONFLICT(rider_id, date) DO UPDATE SET
        s_form = excluded.s_form,
        r_form = excluded.r_form,
        total_form = excluded.total_form,
        short_fatigue = excluded.short_fatigue,
        long_fatigue = excluded.long_fatigue,
        combined_fatigue = excluded.combined_fatigue
    `).run({
      date: currentDate,
      seasonFormMax: SEASON_FORM_MAX_RAW,
    });

    if (tableExists(this.db, 'rider_career_stats')) {
      this.db.prepare(`
        INSERT INTO rider_career_stats (rider_id, max_s_form, max_r_form, max_combined_form)
        SELECT
          rider_id,
          s_form,
          r_form,
          total_form
        FROM rider_form_history
        WHERE date = @date
        ON CONFLICT(rider_id) DO UPDATE SET
          max_s_form = MAX(max_s_form, excluded.max_s_form),
          max_r_form = MAX(max_r_form, excluded.max_r_form),
          max_combined_form = MAX(max_combined_form, excluded.max_combined_form)
      `).run({
        date: currentDate
      });
    }
  }

  public applyRaceDayFormBonuses(raceDate: string, riderIds: number[]): void {
    if (riderIds.length === 0 || !tableExists(this.db, 'rider_daily_state')) {
      return;
    }

    this.ensureRiderFormTables();
    this.removeExpiredRaceFormEvents(raceDate);

    const uniqueRiderIds = [...new Set(riderIds)];
    const selectState = this.db.prepare(`
      SELECT rider_id, season, form_bonus, race_form_bonus, peak_s_form, peak_r_form, active_peak_date, peak_dates_json, health_status, unavailable_until, unavailable_days_remaining
      FROM rider_daily_state
      WHERE rider_id = ?
    `);
    const selectAward = this.db.prepare(`
      SELECT 1
      FROM rider_r_form_daily_awards
      WHERE rider_id = ? AND award_date = ?
    `);
    const insertAward = this.db.prepare(`
      INSERT INTO rider_r_form_daily_awards (rider_id, award_date, award_type)
      VALUES (?, ?, ?)
    `);
    const updateRaceForm = this.db.prepare(`
      UPDATE rider_daily_state
      SET race_form_bonus = ?
      WHERE rider_id = ?
    `);
    const insertFreeRaceForm = this.db.prepare(`
      INSERT INTO rider_r_form_events (rider_id, source_date, expires_on, amount, event_type)
      VALUES (?, ?, ?, ?, 'race_day')
    `);

    this.db.transaction(() => {
      for (const riderId of uniqueRiderIds) {
        const row = selectState.get(riderId) as RiderDailyStateRow | undefined;
        if (!row || row.health_status !== 'healthy' || row.unavailable_days_remaining > 0) {
          continue;
        }
        if (selectAward.get(riderId, raceDate)) {
          continue;
        }

        const peakDates = resolveSeasonPeakDates(parsePeakDates(row.peak_dates_json), row.season);
        const phase = resolvePeakPhase(raceDate, peakDates);
        
        let expiresOnIso = addDaysIso(raceDate, phase?.phase === 'build' ? BUILD_R_FORM_EXPIRY_DAYS : FREE_R_FORM_EXPIRY_DAYS);
        
        if (phase) {
          const peakPlus14 = addDaysIso(phase.peakDate, 14);
          if (isoDateToDayNumber(peakPlus14) < isoDateToDayNumber(expiresOnIso)) {
            expiresOnIso = peakPlus14;
          }
        }

        if (phase?.phase === 'build') {
          // Instead of updating the legacy column, insert a trackable event
          insertFreeRaceForm.run(riderId, raceDate, expiresOnIso, RACE_FORM_BUILD_STEP);
          insertAward.run(riderId, raceDate, 'build');
          continue;
        }

        if (phase == null) {
          insertFreeRaceForm.run(riderId, raceDate, expiresOnIso, RACE_FORM_FREE_STEP);
          insertAward.run(riderId, raceDate, 'free');
        }
      }
    })();
  }

  private runDailyChecks(currentDate: string): DailyCheckSummary {
    const row = this.db.prepare(
      'SELECT COUNT(DISTINCT race_id) AS count FROM stages WHERE date = ?',
    ).get(currentDate) as { count: number } | undefined;
    return {
      hasRaceToday: (row?.count ?? 0) > 0,
      racesTodayCount: row?.count ?? 0,
    };
  }

  private getPendingStages(currentDate: string): PendingStage[] {
    if (!tableExists(this.db, 'stages') || !tableExists(this.db, 'races')) {
      return [];
    }

    const rows = tableExists(this.db, 'results')
      ? this.db.prepare(`
          SELECT
            stages.id AS stage_id,
            stages.race_id AS race_id,
            races.name AS race_name,
            stages.stage_number AS stage_number,
            stages.date AS date,
            stages.profile AS profile,
            stages.start_elevation AS start_elevation,
            stages.details_csv_file AS details_csv_file,
            races.is_stage_race AS is_stage_race
          FROM stages
          JOIN races ON races.id = stages.race_id
          LEFT JOIN results stage_results
            ON stage_results.stage_id = stages.id
           AND stage_results.result_type_id = 1
          WHERE stages.date = ?
          GROUP BY
            stages.id,
            stages.race_id,
            races.name,
            stages.stage_number,
            stages.date,
            stages.profile,
            stages.start_elevation,
            stages.details_csv_file,
            races.is_stage_race
          HAVING COUNT(stage_results.id) = 0
          ORDER BY races.id ASC, stages.stage_number ASC
        `).all(currentDate) as PendingStageRow[]
      : this.db.prepare(`
          SELECT
            stages.id AS stage_id,
            stages.race_id AS race_id,
            races.name AS race_name,
            stages.stage_number AS stage_number,
            stages.date AS date,
            stages.profile AS profile,
            stages.start_elevation AS start_elevation,
            stages.details_csv_file AS details_csv_file,
            races.is_stage_race AS is_stage_race
          FROM stages
          JOIN races ON races.id = stages.race_id
          WHERE stages.date = ?
          ORDER BY races.id ASC, stages.stage_number ASC
        `).all(currentDate) as PendingStageRow[];

    return rows.map((row: any) => ({
      stageId: row.stage_id,
      raceId: row.race_id,
      raceName: row.race_name,
      stageNumber: row.stage_number,
      date: row.date,
      profile: row.profile,
      startElevation: row.start_elevation,
      detailsCsvFile: row.details_csv_file,
      isStageRace: row.is_stage_race === 1,
    }));
  }

  private mapState(row: GameStateRow, dailyChecks = this.runDailyChecks(row.current_date)): GameState {
    return {
      currentDate:    row.current_date,
      season:         row.season,
      isGameOver:     row.is_game_over === 1,
      formattedDate:  formatDateForUi(row.current_date),
      hasRaceToday:   dailyChecks.hasRaceToday,
      racesTodayCount: dailyChecks.racesTodayCount,
    };
  }

  public applyStageFatigue(stageId: number, completedRiderIds: number[], dnfRiderIds: number[]): void {
    if (!this.isTable('rider_daily_state') || !this.isTable('rider_fatigue_history')) {
      return;
    }

    const stageRow = this.db.prepare(`
      SELECT s.id, s.stage_score, s.stage_number, r.name AS race_name, s.date,
             s.rolled_weather_id, w.effekt_fatigue_min, w.effekt_fatigue_max
      FROM stages s
      JOIN races r ON r.id = s.race_id
      LEFT JOIN wetter w ON w.id = s.rolled_weather_id
      WHERE s.id = ?
    `).get(stageId) as {
      id: number;
      stage_score: number;
      stage_number: number;
      race_name: string;
      date: string;
      rolled_weather_id: number | null;
      effekt_fatigue_min: number | null;
      effekt_fatigue_max: number | null;
    } | undefined;

    if (!stageRow) {
      return;
    }

    const stageScore = stageRow.stage_score ?? 0;
    const stageNumber = stageRow.stage_number;
    const raceName = stageRow.race_name;
    const stageDate = stageRow.date;

    const participatedRiderIds = [...new Set([...completedRiderIds, ...dnfRiderIds])];
    if (participatedRiderIds.length === 0) {
      return;
    }

    const stmtSelect = this.db.prepare(`
      SELECT r.id, r.skill_recuperation, r.birth_year,
             rds.short_term_fatigue, rds.long_term_fatigue_decayable, rds.long_term_fatigue_locked,
             rds.season_race_days_total
      FROM riders r
      LEFT JOIN rider_daily_state rds ON rds.rider_id = r.id
      WHERE r.id = ?
    `);

    const stmtUpdate = this.db.prepare(`
      UPDATE rider_daily_state
      SET short_term_fatigue = ?,
          long_term_fatigue_decayable = ?,
          long_term_fatigue_locked = ?,
          consecutive_non_race_days = 0
      WHERE rider_id = ?
    `);

    const stmtInsertHistory = this.db.prepare(`
      INSERT INTO rider_fatigue_history (
        rider_id, date, type, race_name, stage_number, stage_score,
        short_change, long_decayable_change, long_locked_change,
        short_after, long_after
      ) VALUES (?, ?, 'race', ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    this.db.transaction(() => {
      for (const riderId of participatedRiderIds) {
        const row = stmtSelect.get(riderId) as {
          id: number;
          skill_recuperation: number;
          birth_year: number;
          short_term_fatigue: number | null;
          long_term_fatigue_decayable: number | null;
          long_term_fatigue_locked: number | null;
          season_race_days_total: number | null;
        } | undefined;

        if (!row) continue;

        const R = row.skill_recuperation;
        const multiplier = R >= 65
          ? 1 - (R - 65) * 0.02
          : 1 + (65 - R) * 0.02;

        let addedShort = stageScore >= 10 ? (stageScore / 100) * 0.75 * multiplier : 0;
        let addedLongDecayable = stageScore >= 10 ? (stageScore / 1000) * 0.75 * multiplier : 0;

        const age = Number(stageDate.slice(0, 4)) - row.birth_year;
        if (age >= 30 && age <= 34) {
          const reductionPercent = randomInteger(8, 12) / 100;
          addedShort *= (1 - reductionPercent);
          addedLongDecayable *= (1 - reductionPercent);
        } else if (age < 24) {
          const yearsUnder24 = 24 - age;
          let increasePerYearPercent: number;
          if (stageScore > 300) {
            increasePerYearPercent = 6 + (Math.random() * 6 - 3); // 6 +- 3%
          } else {
            increasePerYearPercent = 3 + (Math.random() * 4 - 2); // 3 +- 2%
          }
          const totalIncreasePercent = (increasePerYearPercent * yearsUnder24) / 100;
          addedShort *= (1 + totalIncreasePercent);
          addedLongDecayable *= (1 + totalIncreasePercent);
        }

        if (stageRow.rolled_weather_id != null) {
          const rolledEffektFatigue = getDeterministicWeatherEffect(
            stageRow.id,
            'fatigue',
            stageRow.effekt_fatigue_min ?? 0,
            stageRow.effekt_fatigue_max ?? 0
          );
          addedShort *= (1 + rolledEffektFatigue / 100);
          addedLongDecayable *= (1 + rolledEffektFatigue / 100);
        }

        addedShort = roundToTwoDecimals(addedShort);
        addedLongDecayable = roundToTwoDecimals(addedLongDecayable);
        
        // n is season race days total. Note: refreshRiderLoadState already updated season_race_days_total
        // so it already includes the current stage!
        const n = row.season_race_days_total ?? 0;
        const addedLongLocked = resolveLockedFatigueAddition(n);

        const currentShort = row.short_term_fatigue ?? 0.0;
        const currentLongDecayable = row.long_term_fatigue_decayable ?? 0.0;
        const currentLongLocked = row.long_term_fatigue_locked ?? 0.0;

        const newShort = roundToTwoDecimals(currentShort + addedShort);
        const newLongDecayable = roundToTwoDecimals(currentLongDecayable + addedLongDecayable);
        const newLongLocked = roundToTwoDecimals(currentLongLocked + addedLongLocked);

        stmtUpdate.run(newShort, newLongDecayable, newLongLocked, riderId);

        stmtInsertHistory.run(
          riderId,
          stageDate,
          raceName,
          stageNumber,
          stageScore,
          addedShort,
          addedLongDecayable,
          addedLongLocked,
          newShort,
          roundToTwoDecimals(newLongDecayable + newLongLocked)
        );
      }
    })();
  }
}

function addDaysIso(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function resolveSeason(nextDate: string, currentSeason: number): number {
  const year = Number(nextDate.slice(0, 4));
  return year > currentSeason ? year : currentSeason;
}

function formatDateForUi(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(date);
}

function parsePeakDates(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((entry: any): entry is string => typeof entry === 'string') : [];
  } catch {
    return [];
  }
}

function roundFormBonus(value: number): number {
  return Math.round(value * 100) / 100;
}

function isoDateToDayNumber(isoDate: string): number {
  return Math.floor(new Date(`${isoDate}T00:00:00.000Z`).getTime() / 86400000);
}

function resolvePeakPhase(currentDate: string, peakDates: string[]): { phase: 'build' | 'decline'; peakDate: string; elapsedDays: number } | null {
  const currentDay = isoDateToDayNumber(currentDate);
  for (const peakDate of peakDates) {
    const peakDay = isoDateToDayNumber(peakDate);
    if (currentDay >= peakDay && currentDay < peakDay + SEASON_FORM_FALL_DAYS) {
      return { phase: 'decline', peakDate, elapsedDays: currentDay - peakDay };
    }
    if (currentDay >= peakDay - SEASON_FORM_RISE_DAYS && currentDay < peakDay) {
      return { phase: 'build', peakDate, elapsedDays: peakDay - currentDay };
    }
  }

  return null;
}

function resolveDeclineValue(peakValue: number, elapsedDays: number): number {
  if (elapsedDays >= SEASON_FORM_FALL_DAYS) {
    return 0;
  }

  const boundedPeakValue = Math.min(SEASON_FORM_MAX_RAW, Math.max(0, peakValue));
  return roundFormBonus(Math.max(0, boundedPeakValue * (1 - (elapsedDays / SEASON_FORM_FALL_DAYS))));
}

function resolveBuildValue(elapsedDays: number): number {
  return roundFormBonus(
    Math.min(
      SEASON_FORM_MAX_RAW,
      Math.max(0, (SEASON_FORM_RISE_DAYS - elapsedDays + 1) * SEASON_FORM_RISE_STEP_RAW),
    ),
  );
}

function resolveRaceDeclineValue(peakValue: number, elapsedDays: number): number {
  if (elapsedDays >= SEASON_FORM_FALL_DAYS) {
    return 0;
  }

  return roundFormBonus(Math.max(0, peakValue * (1 - (elapsedDays / SEASON_FORM_FALL_DAYS))));
}

function resolveEffectiveSeasonForm(rawSeasonForm: number): number {
  return roundFormBonus(Math.min(SEASON_FORM_MAX_RAW, Math.max(0, rawSeasonForm)));
}

type ProgramPeakWindows = {
  peak1Min: number;
  peak1Max: number;
  peak2Min: number;
  peak2Max: number;
  peak3Min: number;
  peak3Max: number;
};

function isoWeekStartDayNumber(season: number, isoWeek: number): number {
  const jan4 = new Date(Date.UTC(season, 0, 4));
  const jan4Weekday = jan4.getUTCDay() || 7;
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - jan4Weekday + 1);
  week1Monday.setUTCDate(week1Monday.getUTCDate() + ((isoWeek - 1) * 7));
  return Math.floor(week1Monday.getTime() / 86400000);
}

function resolveIsoWeekDayBounds(season: number, minWeek: number, maxWeek: number): { startDay: number; endDay: number } {
  const seasonStartDay = isoDateToDayNumber(`${season}-01-01`);
  const seasonEndDay = isoDateToDayNumber(`${season}-12-31`);
  const rangeStartDay = isoWeekStartDayNumber(season, minWeek);
  const rangeEndDay = isoWeekStartDayNumber(season, maxWeek) + 6;
  return {
    startDay: Math.max(seasonStartDay, rangeStartDay),
    endDay: Math.min(seasonEndDay, rangeEndDay),
  };
}

function loadProgramPeakWindows(db: Database.Database | undefined, season: number, riderId: number | undefined): ProgramPeakWindows | null {
  if (!db || riderId == null
    || !tableExists(db, 'rider_season_programs')
    || !tableExists(db, 'race_programs')
    || !columnExists(db, 'race_programs', 'peak1_min')
    || !columnExists(db, 'race_programs', 'peak1_max')
    || !columnExists(db, 'race_programs', 'peak2_min')
    || !columnExists(db, 'race_programs', 'peak2_max')
    || !columnExists(db, 'race_programs', 'peak3_min')
    || !columnExists(db, 'race_programs', 'peak3_max')) {
    return null;
  }

  const row = db.prepare(`
    SELECT race_programs.peak1_min,
           race_programs.peak1_max,
           race_programs.peak2_min,
           race_programs.peak2_max,
           race_programs.peak3_min,
           race_programs.peak3_max
    FROM rider_season_programs
    JOIN race_programs ON race_programs.id = rider_season_programs.program_id
    WHERE rider_season_programs.season = ?
      AND rider_season_programs.rider_id = ?
  `).get(season, riderId) as {
    peak1_min: number;
    peak1_max: number;
    peak2_min: number;
    peak2_max: number;
    peak3_min: number;
    peak3_max: number;
  } | undefined;

  if (!row) {
    return null;
  }

  return {
    peak1Min: row.peak1_min,
    peak1Max: row.peak1_max,
    peak2Min: row.peak2_min,
    peak2Max: row.peak2_max,
    peak3Min: row.peak3_min,
    peak3Max: row.peak3_max,
  };
}

/**
 * Bulk-load all program peak windows for the given season in a single query.
 * Returns a Map keyed by rider_id. This is the N+1 fix for `loadProgramPeakWindows`.
 */
function loadProgramPeakWindowsForSeason(
  db: Database.Database,
  season: number,
): Map<number, ProgramPeakWindows> {
  const result = new Map<number, ProgramPeakWindows>();
  if (!tableExists(db, 'rider_season_programs')
    || !tableExists(db, 'race_programs')
    || !columnExists(db, 'race_programs', 'peak1_min')
    || !columnExists(db, 'race_programs', 'peak1_max')
    || !columnExists(db, 'race_programs', 'peak2_min')
    || !columnExists(db, 'race_programs', 'peak2_max')
    || !columnExists(db, 'race_programs', 'peak3_min')
    || !columnExists(db, 'race_programs', 'peak3_max')) {
    return result;
  }

  const rows = db.prepare(`
    SELECT rider_season_programs.rider_id AS rider_id,
           race_programs.peak1_min,
           race_programs.peak1_max,
           race_programs.peak2_min,
           race_programs.peak2_max,
           race_programs.peak3_min,
           race_programs.peak3_max
    FROM rider_season_programs
    JOIN race_programs ON race_programs.id = rider_season_programs.program_id
    WHERE rider_season_programs.season = ?
  `).all(season) as Array<{
    rider_id: number;
    peak1_min: number;
    peak1_max: number;
    peak2_min: number;
    peak2_max: number;
    peak3_min: number;
    peak3_max: number;
  }>;

  for (const row of rows) {
    result.set(row.rider_id, {
      peak1Min: row.peak1_min,
      peak1Max: row.peak1_max,
      peak2Min: row.peak2_min,
      peak2Max: row.peak2_max,
      peak3Min: row.peak3_min,
      peak3Max: row.peak3_max,
    });
  }

  return result;
}

function generateProgramSeasonPeakDates(season: number, windows: ProgramPeakWindows): string[] {
  const ranges = [
    resolveIsoWeekDayBounds(season, windows.peak1Min, windows.peak1Max),
    resolveIsoWeekDayBounds(season, windows.peak2Min, windows.peak2Max),
    resolveIsoWeekDayBounds(season, windows.peak3Min, windows.peak3Max),
  ];

  const randomAttempts = 1000;
  for (let attempt = 0; attempt < randomAttempts; attempt += 1) {
    const picked: number[] = [];
    let valid = true;

    for (const range of ranges) {
      const candidate = randomInteger(range.startDay, range.endDay);
      if (picked.some((existing: any) => Math.abs(existing - candidate) < PEAK_MIN_SPACING_DAYS)) {
        valid = false;
        break;
      }
      picked.push(candidate);
    }

    if (valid) {
      return picked.sort((left: any, right: any) => left - right).map(dayNumberToIsoDate);
    }
  }

  const picked: number[] = [];
  for (const range of ranges) {
    let bestCandidate: number | null = null;
    let bestDistance = -1;
    const target = Math.floor((range.startDay + range.endDay) / 2);
    for (let candidate = range.startDay; candidate <= range.endDay; candidate += 1) {
      const minDistance = picked.length === 0
        ? Number.POSITIVE_INFINITY
        : Math.min(...picked.map((existing: any) => Math.abs(existing - candidate)));
      if (picked.length > 0 && minDistance < PEAK_MIN_SPACING_DAYS) {
        continue;
      }
      const score = (minDistance * 10) - Math.abs(candidate - target);
      if (score > bestDistance) {
        bestDistance = score;
        bestCandidate = candidate;
      }
    }

    if (bestCandidate == null) {
      break;
    }

    picked.push(bestCandidate);
  }

  if (picked.length === 3) {
    return picked.sort((left: any, right: any) => left - right).map(dayNumberToIsoDate);
  }

  const seasonStartDay = isoDateToDayNumber(`${season}-01-01`);
  const seasonEndDay = isoDateToDayNumber(`${season}-12-31`);
  const targetDays = ranges.map((range: any) => Math.floor((range.startDay + range.endDay) / 2));
  const fallbackPicked: number[] = [];
  for (const targetDay of targetDays) {
    let bestCandidate: number | null = null;
    let bestDistance = -1;
    for (let candidate = seasonStartDay; candidate <= seasonEndDay; candidate += 1) {
      const minDistance = fallbackPicked.length === 0
        ? Number.POSITIVE_INFINITY
        : Math.min(...fallbackPicked.map((existing: any) => Math.abs(existing - candidate)));
      if (fallbackPicked.length > 0 && minDistance < PEAK_MIN_SPACING_DAYS) {
        continue;
      }
      const score = (minDistance * 10) - Math.abs(candidate - targetDay);
      if (score > bestDistance) {
        bestDistance = score;
        bestCandidate = candidate;
      }
    }

    if (bestCandidate == null) {
      return generateSeasonPeakDates(season);
    }
    fallbackPicked.push(bestCandidate);
  }

  return fallbackPicked.sort((left: any, right: any) => left - right).map(dayNumberToIsoDate);
}

function isWithinDayRange(isoDate: string, range: { startDay: number; endDay: number }): boolean {
  const day = isoDateToDayNumber(isoDate);
  return day >= range.startDay && day <= range.endDay;
}

function generateSeasonPeakDates(season: number): string[] {
  const firstPeakWindowStart = isoDateToDayNumber(`${season}-02-15`);
  const lastPeakWindowEnd = isoDateToDayNumber(`${season}-10-05`);
  const peakDays: number[] = [];
  let attempts = 0;

  while (peakDays.length < 3 && attempts < 500) {
    const candidate = firstPeakWindowStart + Math.floor(Math.random() * (lastPeakWindowEnd - firstPeakWindowStart + 1));
    if (peakDays.every((existing: any) => Math.abs(existing - candidate) >= PEAK_MIN_SPACING_DAYS)) {
      peakDays.push(candidate);
    }
    attempts += 1;
  }

  if (peakDays.length < 3) {
    const fallback = [firstPeakWindowStart + 10, firstPeakWindowStart + 90, firstPeakWindowStart + 170];
    peakDays.splice(0, peakDays.length, ...fallback);
  }

  return peakDays
    .sort((left: any, right: any) => left - right)
    .slice(0, 3)
    .map(dayNumberToIsoDate);
}

function resolveSeasonPeakDates(peakDates: string[], season: number, db?: Database.Database, riderId?: number): string[] {
  const programWindows = loadProgramPeakWindows(db, season, riderId);
  return resolveSeasonPeakDatesFromWindows(peakDates, season, programWindows);
}

/**
 * Like `resolveSeasonPeakDates` but takes pre-loaded program windows for the rider,
 * avoiding an N+1 query against `rider_season_programs` / `race_programs`.
 */
function resolveSeasonPeakDatesFromWindows(
  peakDates: string[],
  season: number,
  programWindows: ProgramPeakWindows | null,
): string[] {
  const programRanges = programWindows == null
    ? null
    : [
      resolveIsoWeekDayBounds(season, programWindows.peak1Min, programWindows.peak1Max),
      resolveIsoWeekDayBounds(season, programWindows.peak2Min, programWindows.peak2Max),
      resolveIsoWeekDayBounds(season, programWindows.peak3Min, programWindows.peak3Max),
    ];

  const normalized = [...new Set(peakDates)]
    .filter((peakDate: any) => peakDate.startsWith(`${season}-`))
    .sort((left: any, right: any) => isoDateToDayNumber(left) - isoDateToDayNumber(right));

  if (normalized.length !== 3) {
    return programWindows ? generateProgramSeasonPeakDates(season, programWindows) : generateSeasonPeakDates(season);
  }

  const hasValidSpacing = normalized.every((peakDate: any, index: any) => {
    if (index === 0) {
      return true;
    }

    const previousPeak = normalized[index - 1];
    return isoDateToDayNumber(peakDate) - isoDateToDayNumber(previousPeak) >= PEAK_MIN_SPACING_DAYS;
  });

  const matchesProgramWindows = programRanges == null
    ? true
    : normalized.every((peakDate: any, index: any) => isWithinDayRange(peakDate, programRanges[index]));

  if (hasValidSpacing && matchesProgramWindows) {
    return normalized;
  }

  return programWindows ? generateProgramSeasonPeakDates(season, programWindows) : generateSeasonPeakDates(season);
}

function dayNumberToIsoDate(dayNumber: number): string {
  return new Date(dayNumber * 86400000).toISOString().slice(0, 10);
}

function rollDailyCondition(currentDate: string): { status: 'ill' | 'injured'; durationDays: number } | null {
  if (Math.random() < ILLNESS_CHANCE) {
    return {
      status: 'ill',
      durationDays: randomInteger(1, 14),
    };
  }

  if (Math.random() < INJURY_CHANCE) {
    const isLongInjury = Math.random() < 0.1;
    return {
      status: 'injured',
      durationDays: isLongInjury ? randomInteger(6, 30) : randomInteger(2, 14),
    };
  }

  return null;
}

function randomInteger(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

function resolveLockedFatigueAddition(n: number): number {
  if (n < 30) return 0.0;
  if (n < 40) return 0.01;
  if (n < 50) return 0.02;
  if (n <= 60) return 0.03;
  if (n <= 70) return 0.04;
  if (n <= 80) return 0.05;
  if (n <= 90) return 0.06;
  if (n <= 100) return 0.08;
  if (n <= 110) return 0.10;
  if (n <= 120) return 0.13;
  if (n <= 130) return 0.17;
  if (n <= 140) return 0.22;
  return 0.28;
}

function roundToThreeDecimals(value: number): number {
  return Math.round(value * 1000) / 1000;
}
