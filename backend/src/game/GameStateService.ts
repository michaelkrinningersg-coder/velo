import Database from 'better-sqlite3';
import { EventEmitter } from 'events';
import { GameState, GameStatus, PendingStage } from '../../../shared/types';
import { GameRepository } from '../db/GameRepository';
import { refreshRaceEntriesForRaceStart } from '../simulation/RaceRosterService';
import { ContractService } from './ContractService';
import { buildRiderLoadSummary } from './RiderLoadModel';
import { RiderDevelopmentService, type RiderDevelopmentDailyContext } from './RiderDevelopmentService';
import { RiderProgramService } from './RiderProgramService';
import { RiderRoleService } from './RiderRoleService';

const DEFAULT_START_DATE = '2026-01-01';
const DEFAULT_START_SEASON = 2026;
const SEASON_FORM_MIN_RAW = 0;
const SEASON_FORM_MAX_RAW = 6;
const SEASON_FORM_RISE_DAYS = 42;
const SEASON_FORM_RISE_STEP_RAW = SEASON_FORM_MAX_RAW / SEASON_FORM_RISE_DAYS;
const SEASON_FORM_FALL_DAYS = 14;
const RACE_FORM_BUILD_STEP = 0.25;
const FREE_R_FORM_EXPIRY_DAYS = 20;
const PEAK_MIN_SPACING_DAYS = 56;
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
  return rows.some((row) => row.name === columnName);
}

export class GameStateService {
  private readonly db: Database.Database;
  private readonly events = new EventEmitter();
  private syncedStateDate: string | null = null;

  constructor(db: Database.Database) {
    this.db = db;
  }

  public ensureState(): GameState {
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS game_state (
        id            INTEGER PRIMARY KEY CHECK(id = 1),
        current_date  TEXT    NOT NULL,
        season        INTEGER NOT NULL,
        is_game_over  INTEGER NOT NULL DEFAULT 0 CHECK(is_game_over IN (0, 1))
      )
    `).run();
    this.db.prepare(`
      INSERT OR IGNORE INTO game_state (id, "current_date", season, is_game_over)
      VALUES (1, ?, ?, 0)
    `).run(DEFAULT_START_DATE, DEFAULT_START_SEASON);
    this.ensureRiderDailyStateTable();
    this.ensureRiderFormTables();
    this.ensureRiderDailyStateRows(DEFAULT_START_SEASON);
    const state = this.loadState();
    if (this.syncedStateDate !== state.currentDate) {
      this.syncCurrentSeasonFormState(state.currentDate, state.season);
      this.syncCurrentFormHistory(state.currentDate);
      this.syncedStateDate = state.currentDate;
    }
    this.db.prepare(`
      INSERT INTO career_meta (key, value) VALUES ('current_season', ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(String(state.season));
    return state;
  }

  public loadState(): GameState {
    this.ensureStateRow();
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
      this.ensureRiderDailyStateTable();
      this.ensureRiderDailyStateRows(currentRow.season);
      this.advanceRiderDailyStates(nextDate, nextSeason);
      new GameRepository(this.db).markUnavailableStageRaceParticipantsAsDnf();
      if (nextSeason !== currentRow.season) {
        new ContractService(this.db).checkContractStatuses(nextSeason);
        new RiderDevelopmentService(this.db).recalculateSpecializations(nextSeason);
        new RiderRoleService(this.db).recalculateAllTeamRoles();
        new RiderProgramService(this.db).ensureSeasonPrograms(nextSeason, nextDate);
      }
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
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS game_state (
        id INTEGER PRIMARY KEY CHECK(id = 1),
        current_date TEXT NOT NULL,
        season INTEGER NOT NULL,
        is_game_over INTEGER NOT NULL DEFAULT 0 CHECK(is_game_over IN (0, 1))
      )
    `).run();
    this.db.prepare(
      'INSERT OR IGNORE INTO game_state (id, "current_date", season, is_game_over) VALUES (1, ?, ?, 0)',
    ).run(DEFAULT_START_DATE, DEFAULT_START_SEASON);
    this.ensureRiderDailyStateTable();
    this.ensureRiderFormTables();
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
        rolling_30d_race_days INTEGER NOT NULL DEFAULT 0 CHECK(rolling_30d_race_days >= 0)
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
        PRIMARY KEY (rider_id, date)
      )
    `).run();

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

    const insertState = this.db.prepare(`
      INSERT INTO rider_daily_state (
        rider_id, season, form_bonus, race_form_bonus, peak_s_form, peak_r_form, active_peak_date, peak_dates_json, health_status, unavailable_until, unavailable_days_remaining, season_race_days_total, rolling_30d_race_days
      ) VALUES (?, ?, ?, 0, 0, 0, NULL, ?, 'healthy', NULL, 0, 0, 0)
    `);

    for (const rider of missingRows) {
      insertState.run(rider.id, season, SEASON_FORM_MIN_RAW, JSON.stringify(resolveSeasonPeakDates([], season)));
    }
  }

  private syncCurrentSeasonFormState(currentDate: string, currentSeason: number): void {
    if (!tableExists(this.db, 'rider_daily_state')) {
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

    for (const row of rows) {
      const peakDates = resolveSeasonPeakDates(
        row.season !== currentSeason ? [] : parsePeakDates(row.peak_dates_json),
        currentSeason,
      );
      const phase = resolvePeakPhase(currentDate, peakDates);
      let formBonus = row.form_bonus;
      let peakSForm = row.peak_s_form;
      let activePeakDate = row.active_peak_date;

      if (phase?.phase === 'build') {
        activePeakDate = null;
        peakSForm = 0;
        formBonus = resolveBuildValue(phase.elapsedDays);
      } else if (phase?.phase === 'decline') {
        formBonus = resolveDeclineValue(SEASON_FORM_MAX_RAW, phase.elapsedDays);
        peakSForm = SEASON_FORM_MAX_RAW;
        activePeakDate = phase.peakDate;
      } else {
        formBonus = 0;
        peakSForm = 0;
        activePeakDate = null;
      }

      updateState.run(
        currentSeason,
        roundFormBonus(formBonus),
        roundFormBonus(peakSForm),
        activePeakDate,
        JSON.stringify(peakDates),
        row.rider_id,
      );
    }
  }

  private advanceRiderDailyStates(nextDate: string, nextSeason: number): void {
    if (!tableExists(this.db, 'rider_daily_state')) {
      return;
    }

    this.ensureRiderDailyStateRows(nextSeason);
    this.removeExpiredRaceFormEvents(nextDate);
    this.syncRiderLoadState(nextDate, nextSeason);

    const rows = this.db.prepare(`
      SELECT rider_id, season, form_bonus, race_form_bonus, peak_s_form, peak_r_form, active_peak_date, peak_dates_json, health_status, unavailable_until, unavailable_days_remaining, season_race_days_total, rolling_30d_race_days
      FROM rider_daily_state
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
          unavailable_days_remaining = ?
      WHERE rider_id = ?
    `);
    const seasonChangedRiderIds: number[] = [];
    const developmentContexts: RiderDevelopmentDailyContext[] = [];

    for (const row of rows) {
      const seasonChanged = row.season !== nextSeason;
      const peakDates = seasonChanged
        ? resolveSeasonPeakDates([], nextSeason)
        : resolveSeasonPeakDates(parsePeakDates(row.peak_dates_json), nextSeason);
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
        }
      }

      const phase = resolvePeakPhase(nextDate, peakDates);
      if (phase?.phase === 'decline' && phase.elapsedDays === 0) {
        activePeakDate = phase.peakDate;
        peakSForm = SEASON_FORM_MAX_RAW;
        peakRForm = roundFormBonus(Math.max(0, raceFormBonus));
        formBonus = SEASON_FORM_MAX_RAW;
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
        if (healthStatus === 'healthy') {
          formBonus = roundFormBonus(Math.min(SEASON_FORM_MAX_RAW, formBonus + SEASON_FORM_RISE_STEP_RAW));
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
      });

      updateState.run(
        nextSeason,
        formBonus,
        raceFormBonus,
        peakSForm,
        peakRForm,
        activePeakDate,
        JSON.stringify(peakDates),
        healthStatus,
        unavailableUntil,
        remainingDays,
        row.rider_id,
      );
    }

    if (seasonChangedRiderIds.length > 0) {
      const placeholders = seasonChangedRiderIds.map(() => '?').join(',');
      this.db.prepare(`DELETE FROM rider_r_form_events WHERE rider_id IN (${placeholders})`).run(...seasonChangedRiderIds);
    }

    new RiderDevelopmentService(this.db).advanceDailyDevelopment(nextDate, nextSeason, developmentContexts);
  }

  private syncRiderLoadState(currentDate: string, currentSeason: number): void {
    if (!tableExists(this.db, 'rider_daily_state') || !tableExists(this.db, 'stage_entries') || !tableExists(this.db, 'stages') || !tableExists(this.db, 'riders')) {
      return;
    }

    const rollingWindowStart = addDaysIso(currentDate, -29);
    const rows = this.db.prepare(`
      SELECT
        riders.id AS rider_id,
        COALESCE(SUM(CASE
          WHEN stage_entries.status IN ('finished', 'dnf')
           AND CAST(substr(stages.date, 1, 4) AS INTEGER) = ?
           AND stages.date <= ?
          THEN 1 ELSE 0 END), 0) AS season_race_days_total,
        COALESCE(SUM(CASE
          WHEN stage_entries.status IN ('finished', 'dnf')
           AND stages.date >= ?
           AND stages.date <= ?
          THEN 1 ELSE 0 END), 0) AS rolling_30d_race_days
      FROM riders
      LEFT JOIN stage_entries ON stage_entries.rider_id = riders.id
      LEFT JOIN stages ON stages.id = stage_entries.stage_id
      WHERE riders.is_retired = 0
      GROUP BY riders.id
    `).all(currentSeason, currentDate, rollingWindowStart, currentDate) as Array<{
      rider_id: number;
      season_race_days_total: number;
      rolling_30d_race_days: number;
    }>;

    const updateState = this.db.prepare(`
      UPDATE rider_daily_state
      SET season_race_days_total = ?,
          rolling_30d_race_days = ?
      WHERE rider_id = ?
    `);

    for (const row of rows) {
      const summary = buildRiderLoadSummary(row.season_race_days_total, row.rolling_30d_race_days);
      updateState.run(summary.seasonRaceDaysTotal, summary.rolling30dRaceDays, row.rider_id);
    }
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

    const repo = new GameRepository(this.db);
    for (const row of rows) {
      const race = repo.getRaceById(row.race_id);
      const stage = repo.getStageById(row.stage_id);
      if (!race || !stage) {
        continue;
      }
      refreshRaceEntriesForRaceStart(this.db, repo, race, stage);
    }
  }

  private removeExpiredRaceFormEvents(currentDate: string): void {
    if (!tableExists(this.db, 'rider_r_form_events')) {
      return;
    }

    this.db.prepare('DELETE FROM rider_r_form_events WHERE expires_on <= ?').run(currentDate);
  }

  private syncCurrentFormHistory(currentDate: string): void {
    if (!tableExists(this.db, 'rider_daily_state') || !tableExists(this.db, 'rider_form_history')) {
      return;
    }

    this.removeExpiredRaceFormEvents(currentDate);

    const rows = this.db.prepare(`
      SELECT rider_daily_state.rider_id,
             rider_daily_state.form_bonus,
             rider_daily_state.race_form_bonus,
             COALESCE(SUM(rider_r_form_events.amount), 0) AS free_race_form
      FROM rider_daily_state
      LEFT JOIN rider_r_form_events ON rider_r_form_events.rider_id = rider_daily_state.rider_id
      GROUP BY rider_daily_state.rider_id,
               rider_daily_state.form_bonus,
               rider_daily_state.race_form_bonus
    `).all() as Array<{ rider_id: number; form_bonus: number; race_form_bonus: number; free_race_form: number }>;
    const upsertHistory = this.db.prepare(`
      INSERT INTO rider_form_history (rider_id, date, s_form, r_form, total_form)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(rider_id, date) DO UPDATE SET
        s_form = excluded.s_form,
        r_form = excluded.r_form,
        total_form = excluded.total_form
    `);

    for (const row of rows) {
      const totalRaceForm = roundFormBonus(row.race_form_bonus + row.free_race_form);
      const effectiveSeasonForm = resolveEffectiveSeasonForm(row.form_bonus);
      upsertHistory.run(
        row.rider_id,
        currentDate,
        effectiveSeasonForm,
        totalRaceForm,
        roundFormBonus(effectiveSeasonForm + totalRaceForm),
      );
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
        if (phase?.phase === 'build') {
          updateRaceForm.run(roundFormBonus(row.race_form_bonus + RACE_FORM_BUILD_STEP), riderId);
          insertAward.run(riderId, raceDate, 'build');
          continue;
        }

        if (phase == null) {
          insertFreeRaceForm.run(riderId, raceDate, addDaysIso(raceDate, FREE_R_FORM_EXPIRY_DAYS), 0.05);
          insertAward.run(riderId, raceDate, 'free');
        }
      }

      this.syncCurrentFormHistory(raceDate);
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

    return rows.map((row) => ({
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
    return Array.isArray(parsed) ? parsed.filter((entry): entry is string => typeof entry === 'string') : [];
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

function generateSeasonPeakDates(season: number): string[] {
  const firstPeakWindowStart = isoDateToDayNumber(`${season}-02-15`);
  const lastPeakWindowEnd = isoDateToDayNumber(`${season}-10-05`);
  const peakDays: number[] = [];
  let attempts = 0;

  while (peakDays.length < 3 && attempts < 500) {
    const candidate = firstPeakWindowStart + Math.floor(Math.random() * (lastPeakWindowEnd - firstPeakWindowStart + 1));
    if (peakDays.every((existing) => Math.abs(existing - candidate) >= PEAK_MIN_SPACING_DAYS)) {
      peakDays.push(candidate);
    }
    attempts += 1;
  }

  if (peakDays.length < 3) {
    const fallback = [firstPeakWindowStart + 10, firstPeakWindowStart + 90, firstPeakWindowStart + 170];
    peakDays.splice(0, peakDays.length, ...fallback);
  }

  return peakDays
    .sort((left, right) => left - right)
    .slice(0, 3)
    .map(dayNumberToIsoDate);
}

function resolveSeasonPeakDates(peakDates: string[], season: number): string[] {
  const normalized = [...new Set(peakDates)]
    .filter((peakDate) => peakDate.startsWith(`${season}-`))
    .sort((left, right) => isoDateToDayNumber(left) - isoDateToDayNumber(right));

  if (normalized.length !== 3) {
    return generateSeasonPeakDates(season);
  }

  const hasValidSpacing = normalized.every((peakDate, index) => {
    if (index === 0) {
      return true;
    }

    const previousPeak = normalized[index - 1];
    return isoDateToDayNumber(peakDate) - isoDateToDayNumber(previousPeak) >= PEAK_MIN_SPACING_DAYS;
  });

  return hasValidSpacing ? normalized : generateSeasonPeakDates(season);
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
