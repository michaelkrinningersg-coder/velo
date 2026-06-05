"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStateService = void 0;
const events_1 = require("events");
const GameRepository_1 = require("../db/GameRepository");
const RaceRosterService_1 = require("../simulation/RaceRosterService");
const ContractService_1 = require("./ContractService");
const RiderDevelopmentService_1 = require("./RiderDevelopmentService");
const RiderProgramService_1 = require("./RiderProgramService");
const RiderRoleService_1 = require("./RiderRoleService");
const RiderDraftService_1 = require("./RiderDraftService");
const RiderNewgenService_1 = require("./RiderNewgenService");
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
function tableExists(db, tableName) {
    const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName);
    return row != null;
}
function columnExists(db, tableName, columnName) {
    if (!tableExists(db, tableName)) {
        return false;
    }
    const rows = db.prepare(`PRAGMA table_info(${tableName})`).all();
    return rows.some((row) => row.name === columnName);
}
class GameStateService {
    constructor(db) {
        this.events = new events_1.EventEmitter();
        this.syncedStateDate = null;
        // Caches to avoid repeated schema/peak-date work in the day-change hot path.
        this.schemaReady = false;
        this.knownTables = new Set();
        this.knownColumns = new Set();
        this.peakDatesBySeason = new Map();
        this.programWindowsBySeason = new Map();
        // Tracks the last (s_form, r_form) we wrote into rider_form_history so we can
        // skip writing when nothing changed for the day.
        this.lastFormHistoryHash = '';
        this.formHistoryHashKnown = false;
        this.db = db;
    }
    isTable(name) {
        if (this.knownTables.has(name))
            return true;
        if (!tableExists(this.db, name))
            return false;
        this.knownTables.add(name);
        return true;
    }
    isColumn(tableName, columnName) {
        const key = `${tableName}.${columnName}`;
        if (this.knownColumns.has(key))
            return true;
        if (!this.isTable(tableName))
            return false;
        if (!columnExists(this.db, tableName, columnName))
            return false;
        this.knownColumns.add(key);
        return true;
    }
    ensureSchemaOnce() {
        if (this.schemaReady)
            return;
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
        this.schemaReady = true;
    }
    /**
     * Returns a Map<riderId, ProgramPeakWindows> for the given season, loaded in
     * a single SQL query and cached in-memory. This is the bulk equivalent of
     * `loadProgramPeakWindows` and is the main N+1 fix for the day-change path.
     */
    getProgramWindowsForSeason(season) {
        const cached = this.programWindowsBySeason.get(season);
        if (cached)
            return cached;
        const fresh = loadProgramPeakWindowsForSeason(this.db, season);
        this.programWindowsBySeason.set(season, fresh);
        return fresh;
    }
    ensureState() {
        this.ensureSchemaOnce();
        const state = this.loadState();
        new RiderProgramService_1.RiderProgramService(this.db).ensureSeasonPrograms(state.season, state.currentDate);
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
    loadState() {
        this.ensureSchemaOnce();
        const row = this.db.prepare('SELECT "current_date" AS current_date, season, is_game_over FROM game_state WHERE id = 1').get();
        if (!row)
            throw new Error('game_state konnte nicht geladen werden.');
        return this.mapState(row);
    }
    loadStatus() {
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
    advanceDay() {
        const nextState = this.db.transaction(() => {
            this.ensureStateRow();
            const currentRow = this.db.prepare('SELECT "current_date" AS current_date, season, is_game_over FROM game_state WHERE id = 1').get();
            if (!currentRow)
                throw new Error('game_state nicht ladbar.');
            const pendingStages = this.getPendingStages(currentRow.current_date);
            if (pendingStages.length > 0) {
                throw new Error('Der Tag kann nicht beendet werden, solange offene Rennen oder Etappen simuliert werden muessen.');
            }
            const nextDate = addDaysIso(currentRow.current_date, 1);
            const nextSeason = resolveSeason(nextDate, currentRow.season);
            if (nextSeason !== currentRow.season) {
                new ContractService_1.ContractService(this.db).checkContractStatuses(nextSeason);
                new RiderDraftService_1.RiderDraftService(this.db).executeDraft(nextSeason);
                new ContractService_1.ContractService(this.db).checkContractStatuses(nextSeason); // activate new draft contracts
                new RiderDevelopmentService_1.RiderDevelopmentService(this.db).recalculateSpecializations(nextSeason);
                new RiderRoleService_1.RiderRoleService(this.db).recalculateAllTeamRoles();
                new RiderProgramService_1.RiderProgramService(this.db).ensureSeasonPrograms(nextSeason, nextDate);
                // Newgens für die nächste Saison erzeugen
                new RiderNewgenService_1.RiderNewgenService(this.db).createYearStartNewgens(nextSeason);
                // Skill-Development aller aktiven Fahrer neu auswürfeln (±3, max 20, min 1)
                this.db.prepare(`
          UPDATE riders
          SET skill_development = MAX(1, MIN(20, skill_development + CAST((ABS(RANDOM()) % 7) - 3 AS INTEGER)))
          WHERE is_retired = 0 AND skill_development > 0
        `).run();
                // Snapshot der Fahrer-Werte als Baseline für die Saison in der UI abspeichern
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
            new GameRepository_1.GameRepository(this.db).markUnavailableStageRaceParticipantsAsDnf();
            this.db.prepare('UPDATE game_state SET "current_date" = ?, season = ?, is_game_over = ? WHERE id = 1').run(nextDate, nextSeason, currentRow.is_game_over);
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
    onDayAdvanced(listener) {
        this.events.on('dayAdvanced', listener);
        return () => this.events.off('dayAdvanced', listener);
    }
    refreshRiderLoadState(currentDate, currentSeason) {
        this.ensureRiderDailyStateTable();
        this.ensureRiderDailyStateRows(currentSeason);
        this.syncRiderLoadState(currentDate, currentSeason);
    }
    ensureStateRow() {
        // Lightweight idempotent INSERT-OR-IGNORE for game_state. CREATE TABLE IF NOT EXISTS
        // and other heavy idempotent schema work is handled in ensureSchemaOnce().
        this.db.prepare('INSERT OR IGNORE INTO game_state (id, "current_date", season, is_game_over) VALUES (1, ?, ?, 0)').run(DEFAULT_START_DATE, DEFAULT_START_SEASON);
    }
    ensureRiderDailyStateTable() {
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
    ensureRiderFormTables() {
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
        this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_peak_awards (
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        season INTEGER NOT NULL,
        peak_date TEXT NOT NULL,
        PRIMARY KEY (rider_id, season, peak_date)
      )
    `).run();
    }
    ensureRiderDailyStateRows(season) {
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
    `).all();
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
    syncCurrentSeasonFormState(currentDate, currentSeason) {
        if (!this.isTable('rider_daily_state')) {
            return;
        }
        this.ensureRiderDailyStateRows(currentSeason);
        this.syncRiderLoadState(currentDate, currentSeason);
        const rows = this.db.prepare(`
      SELECT rider_id, season, form_bonus, race_form_bonus, peak_s_form, peak_r_form, active_peak_date, peak_dates_json, health_status, unavailable_until, unavailable_days_remaining, season_race_days_total, rolling_30d_race_days
      FROM rider_daily_state
    `).all();
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
            const peakDates = resolveSeasonPeakDatesFromWindows(seasonChanged ? [] : parsePeakDates(row.peak_dates_json), currentSeason, windows);
            const phase = resolvePeakPhase(currentDate, peakDates);
            let formBonus = row.form_bonus;
            let peakSForm = row.peak_s_form;
            let activePeakDate = row.active_peak_date;
            if (phase?.phase === 'build') {
                activePeakDate = null;
                peakSForm = 0;
                formBonus = resolveBuildValue(phase.elapsedDays);
            }
            else if (phase?.phase === 'decline') {
                formBonus = resolveDeclineValue(SEASON_FORM_MAX_RAW, phase.elapsedDays);
                peakSForm = SEASON_FORM_MAX_RAW;
                activePeakDate = phase.peakDate;
            }
            else {
                formBonus = 0;
                peakSForm = 0;
                activePeakDate = null;
            }
            const roundedFormBonus = roundFormBonus(formBonus);
            const roundedPeakSForm = roundFormBonus(peakSForm);
            const peakDatesJson = JSON.stringify(peakDates);
            // Skip the UPDATE on quiet days where form is stable.
            if (seasonChanged
                || row.form_bonus !== roundedFormBonus
                || row.peak_s_form !== roundedPeakSForm
                || row.active_peak_date !== activePeakDate
                || row.peak_dates_json !== peakDatesJson) {
                updateState.run(currentSeason, roundedFormBonus, roundedPeakSForm, activePeakDate, peakDatesJson, row.rider_id);
            }
        }
    }
    advanceRiderDailyStates(nextDate, nextSeason) {
        if (!this.isTable('rider_daily_state')) {
            return;
        }
        this.ensureRiderDailyStateRows(nextSeason);
        this.removeExpiredRaceFormEvents(nextDate);
        this.syncRiderLoadState(nextDate, nextSeason);
        const rows = this.db.prepare(`
      SELECT rider_id, season, form_bonus, race_form_bonus, peak_s_form, peak_r_form, active_peak_date, peak_dates_json, health_status, unavailable_until, unavailable_days_remaining, season_race_days_total, rolling_30d_race_days
      FROM rider_daily_state
    `).all();
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
        const racingRidersRow = this.db.prepare(`
      SELECT se.rider_id FROM stage_entries se
      JOIN stages s ON s.id = se.stage_id
      WHERE s.date = ? AND se.status IN ('scheduled', 'started')
    `).all(nextDate);
        const racingRiderIds = new Set(racingRidersRow.map(r => r.rider_id));
        // Bulk-load program windows for the current season ONCE instead of doing
        // a per-rider SELECT in `loadProgramPeakWindows` (the previous N+1 hot spot).
        const programWindows = this.getProgramWindowsForSeason(nextSeason);
        const seasonChangedRiderIds = [];
        const developmentContexts = [];
        const deleteFormEvents = this.db.prepare(`
      DELETE FROM rider_r_form_events
      WHERE rider_id = ?
    `);
        for (const row of rows) {
            const seasonChanged = row.season !== nextSeason;
            const riderProgramWindows = seasonChanged ? null : (programWindows.get(row.rider_id) ?? null);
            const peakDates = resolveSeasonPeakDatesFromWindows(seasonChanged ? [] : parsePeakDates(row.peak_dates_json), nextSeason, riderProgramWindows);
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
            }
            else if (phase?.phase === 'decline') {
                activePeakDate = phase.peakDate;
                formBonus = resolveDeclineValue(peakSForm, phase.elapsedDays);
                raceFormBonus = resolveRaceDeclineValue(peakRForm, phase.elapsedDays);
                if (phase.elapsedDays >= SEASON_FORM_FALL_DAYS) {
                    activePeakDate = null;
                    peakSForm = 0;
                    peakRForm = 0;
                }
            }
            else if (phase?.phase === 'build') {
                activePeakDate = null;
                peakSForm = 0;
                peakRForm = 0;
                if (healthStatus === 'healthy') {
                    formBonus = roundFormBonus(Math.min(SEASON_FORM_MAX_RAW, formBonus + SEASON_FORM_RISE_STEP_RAW));
                }
            }
            else {
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
            // Skip the UPDATE if nothing actually changed. This saves ~5000 redundant
            // row updates on quiet days where most riders have stable state.
            const roundedFormBonus = roundFormBonus(formBonus);
            const roundedPeakSForm = roundFormBonus(peakSForm);
            const peakDatesJson = JSON.stringify(peakDates);
            if (seasonChanged
                || row.form_bonus !== roundedFormBonus
                || row.race_form_bonus !== raceFormBonus
                || row.peak_s_form !== roundedPeakSForm
                || row.peak_r_form !== peakRForm
                || row.active_peak_date !== activePeakDate
                || row.peak_dates_json !== peakDatesJson
                || row.health_status !== healthStatus
                || row.unavailable_until !== unavailableUntil
                || row.unavailable_days_remaining !== remainingDays) {
                updateState.run(nextSeason, roundedFormBonus, raceFormBonus, roundedPeakSForm, peakRForm, activePeakDate, peakDatesJson, healthStatus, unavailableUntil, remainingDays, row.rider_id);
            }
        }
        if (seasonChangedRiderIds.length > 0) {
            // Use one prepared statement inside a tight loop instead of building a
            // giant IN(...) query; SQLite is happy with this when bound individually.
            for (const riderId of seasonChangedRiderIds) {
                deleteFormEvents.run(riderId);
            }
        }
        new RiderDevelopmentService_1.RiderDevelopmentService(this.db).advanceDailyDevelopment(nextDate, nextSeason, developmentContexts);
    }
    syncRiderLoadState(currentDate, currentSeason) {
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
    prepareRaceEntriesForRaceStarts(currentDate) {
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
    `).all(currentDate);
        if (rows.length === 0) {
            return;
        }
        const repo = new GameRepository_1.GameRepository(this.db);
        for (const row of rows) {
            const race = repo.getRaceById(row.race_id);
            const stage = repo.getStageById(row.stage_id);
            if (!race || !stage) {
                continue;
            }
            (0, RaceRosterService_1.refreshRaceEntriesForRaceStart)(this.db, repo, race, stage);
        }
    }
    removeExpiredRaceFormEvents(currentDate) {
        if (!tableExists(this.db, 'rider_r_form_events')) {
            return;
        }
        this.db.prepare('DELETE FROM rider_r_form_events WHERE expires_on <= ?').run(currentDate);
    }
    syncCurrentFormHistory(currentDate) {
        if (!this.isTable('rider_daily_state') || !this.isTable('rider_form_history')) {
            return;
        }
        this.removeExpiredRaceFormEvents(currentDate);
        // Single INSERT...SELECT with UPSERT. The aggregation and the write happen
        // in one statement instead of a per-rider JS loop.
        this.db.prepare(`
      INSERT INTO rider_form_history (rider_id, date, s_form, r_form, total_form)
      SELECT
        rds.rider_id,
        @date AS date,
        ROUND(MIN(@seasonFormMax, MAX(0, rds.form_bonus)) * 100) / 100 AS s_form,
        ROUND((rds.race_form_bonus + COALESCE(SUM(rfe.amount), 0)) * 100) / 100 AS r_form,
        ROUND((
          ROUND(MIN(@seasonFormMax, MAX(0, rds.form_bonus)) * 100) / 100
          + ROUND((rds.race_form_bonus + COALESCE(SUM(rfe.amount), 0)) * 100) / 100
        ) * 100) / 100 AS total_form
      FROM rider_daily_state rds
      LEFT JOIN rider_r_form_events rfe ON rfe.rider_id = rds.rider_id
      GROUP BY rds.rider_id, rds.form_bonus, rds.race_form_bonus
      ON CONFLICT(rider_id, date) DO UPDATE SET
        s_form = excluded.s_form,
        r_form = excluded.r_form,
        total_form = excluded.total_form
    `).run({
            date: currentDate,
            seasonFormMax: SEASON_FORM_MAX_RAW,
        });
    }
    applyRaceDayFormBonuses(raceDate, riderIds) {
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
                const row = selectState.get(riderId);
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
    runDailyChecks(currentDate) {
        const row = this.db.prepare('SELECT COUNT(DISTINCT race_id) AS count FROM stages WHERE date = ?').get(currentDate);
        return {
            hasRaceToday: (row?.count ?? 0) > 0,
            racesTodayCount: row?.count ?? 0,
        };
    }
    getPendingStages(currentDate) {
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
        `).all(currentDate)
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
        `).all(currentDate);
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
    mapState(row, dailyChecks = this.runDailyChecks(row.current_date)) {
        return {
            currentDate: row.current_date,
            season: row.season,
            isGameOver: row.is_game_over === 1,
            formattedDate: formatDateForUi(row.current_date),
            hasRaceToday: dailyChecks.hasRaceToday,
            racesTodayCount: dailyChecks.racesTodayCount,
        };
    }
}
exports.GameStateService = GameStateService;
function addDaysIso(isoDate, days) {
    const date = new Date(`${isoDate}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
}
function resolveSeason(nextDate, currentSeason) {
    const year = Number(nextDate.slice(0, 4));
    return year > currentSeason ? year : currentSeason;
}
function formatDateForUi(isoDate) {
    const date = new Date(`${isoDate}T00:00:00.000Z`);
    return new Intl.DateTimeFormat('de-DE', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    }).format(date);
}
function parsePeakDates(value) {
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === 'string') : [];
    }
    catch {
        return [];
    }
}
function roundFormBonus(value) {
    return Math.round(value * 100) / 100;
}
function isoDateToDayNumber(isoDate) {
    return Math.floor(new Date(`${isoDate}T00:00:00.000Z`).getTime() / 86400000);
}
function resolvePeakPhase(currentDate, peakDates) {
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
function resolveDeclineValue(peakValue, elapsedDays) {
    if (elapsedDays >= SEASON_FORM_FALL_DAYS) {
        return 0;
    }
    const boundedPeakValue = Math.min(SEASON_FORM_MAX_RAW, Math.max(0, peakValue));
    return roundFormBonus(Math.max(0, boundedPeakValue * (1 - (elapsedDays / SEASON_FORM_FALL_DAYS))));
}
function resolveBuildValue(elapsedDays) {
    return roundFormBonus(Math.min(SEASON_FORM_MAX_RAW, Math.max(0, (SEASON_FORM_RISE_DAYS - elapsedDays + 1) * SEASON_FORM_RISE_STEP_RAW)));
}
function resolveRaceDeclineValue(peakValue, elapsedDays) {
    if (elapsedDays >= SEASON_FORM_FALL_DAYS) {
        return 0;
    }
    return roundFormBonus(Math.max(0, peakValue * (1 - (elapsedDays / SEASON_FORM_FALL_DAYS))));
}
function resolveEffectiveSeasonForm(rawSeasonForm) {
    return roundFormBonus(Math.min(SEASON_FORM_MAX_RAW, Math.max(0, rawSeasonForm)));
}
function isoWeekStartDayNumber(season, isoWeek) {
    const jan4 = new Date(Date.UTC(season, 0, 4));
    const jan4Weekday = jan4.getUTCDay() || 7;
    const week1Monday = new Date(jan4);
    week1Monday.setUTCDate(jan4.getUTCDate() - jan4Weekday + 1);
    week1Monday.setUTCDate(week1Monday.getUTCDate() + ((isoWeek - 1) * 7));
    return Math.floor(week1Monday.getTime() / 86400000);
}
function resolveIsoWeekDayBounds(season, minWeek, maxWeek) {
    const seasonStartDay = isoDateToDayNumber(`${season}-01-01`);
    const seasonEndDay = isoDateToDayNumber(`${season}-12-31`);
    const rangeStartDay = isoWeekStartDayNumber(season, minWeek);
    const rangeEndDay = isoWeekStartDayNumber(season, maxWeek) + 6;
    return {
        startDay: Math.max(seasonStartDay, rangeStartDay),
        endDay: Math.min(seasonEndDay, rangeEndDay),
    };
}
function loadProgramPeakWindows(db, season, riderId) {
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
  `).get(season, riderId);
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
function loadProgramPeakWindowsForSeason(db, season) {
    const result = new Map();
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
  `).all(season);
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
function generateProgramSeasonPeakDates(season, windows) {
    const ranges = [
        resolveIsoWeekDayBounds(season, windows.peak1Min, windows.peak1Max),
        resolveIsoWeekDayBounds(season, windows.peak2Min, windows.peak2Max),
        resolveIsoWeekDayBounds(season, windows.peak3Min, windows.peak3Max),
    ];
    const randomAttempts = 1000;
    for (let attempt = 0; attempt < randomAttempts; attempt += 1) {
        const picked = [];
        let valid = true;
        for (const range of ranges) {
            const candidate = randomInteger(range.startDay, range.endDay);
            if (picked.some((existing) => Math.abs(existing - candidate) < PEAK_MIN_SPACING_DAYS)) {
                valid = false;
                break;
            }
            picked.push(candidate);
        }
        if (valid) {
            return picked.sort((left, right) => left - right).map(dayNumberToIsoDate);
        }
    }
    const picked = [];
    for (const range of ranges) {
        let bestCandidate = null;
        let bestDistance = -1;
        const target = Math.floor((range.startDay + range.endDay) / 2);
        for (let candidate = range.startDay; candidate <= range.endDay; candidate += 1) {
            const minDistance = picked.length === 0
                ? Number.POSITIVE_INFINITY
                : Math.min(...picked.map((existing) => Math.abs(existing - candidate)));
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
        return picked.sort((left, right) => left - right).map(dayNumberToIsoDate);
    }
    const seasonStartDay = isoDateToDayNumber(`${season}-01-01`);
    const seasonEndDay = isoDateToDayNumber(`${season}-12-31`);
    const targetDays = ranges.map((range) => Math.floor((range.startDay + range.endDay) / 2));
    const fallbackPicked = [];
    for (const targetDay of targetDays) {
        let bestCandidate = null;
        let bestDistance = -1;
        for (let candidate = seasonStartDay; candidate <= seasonEndDay; candidate += 1) {
            const minDistance = fallbackPicked.length === 0
                ? Number.POSITIVE_INFINITY
                : Math.min(...fallbackPicked.map((existing) => Math.abs(existing - candidate)));
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
    return fallbackPicked.sort((left, right) => left - right).map(dayNumberToIsoDate);
}
function isWithinDayRange(isoDate, range) {
    const day = isoDateToDayNumber(isoDate);
    return day >= range.startDay && day <= range.endDay;
}
function generateSeasonPeakDates(season) {
    const firstPeakWindowStart = isoDateToDayNumber(`${season}-02-15`);
    const lastPeakWindowEnd = isoDateToDayNumber(`${season}-10-05`);
    const peakDays = [];
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
function resolveSeasonPeakDates(peakDates, season, db, riderId) {
    const programWindows = loadProgramPeakWindows(db, season, riderId);
    return resolveSeasonPeakDatesFromWindows(peakDates, season, programWindows);
}
/**
 * Like `resolveSeasonPeakDates` but takes pre-loaded program windows for the rider,
 * avoiding an N+1 query against `rider_season_programs` / `race_programs`.
 */
function resolveSeasonPeakDatesFromWindows(peakDates, season, programWindows) {
    const programRanges = programWindows == null
        ? null
        : [
            resolveIsoWeekDayBounds(season, programWindows.peak1Min, programWindows.peak1Max),
            resolveIsoWeekDayBounds(season, programWindows.peak2Min, programWindows.peak2Max),
            resolveIsoWeekDayBounds(season, programWindows.peak3Min, programWindows.peak3Max),
        ];
    const normalized = [...new Set(peakDates)]
        .filter((peakDate) => peakDate.startsWith(`${season}-`))
        .sort((left, right) => isoDateToDayNumber(left) - isoDateToDayNumber(right));
    if (normalized.length !== 3) {
        return programWindows ? generateProgramSeasonPeakDates(season, programWindows) : generateSeasonPeakDates(season);
    }
    const hasValidSpacing = normalized.every((peakDate, index) => {
        if (index === 0) {
            return true;
        }
        const previousPeak = normalized[index - 1];
        return isoDateToDayNumber(peakDate) - isoDateToDayNumber(previousPeak) >= PEAK_MIN_SPACING_DAYS;
    });
    const matchesProgramWindows = programRanges == null
        ? true
        : normalized.every((peakDate, index) => isWithinDayRange(peakDate, programRanges[index]));
    if (hasValidSpacing && matchesProgramWindows) {
        return normalized;
    }
    return programWindows ? generateProgramSeasonPeakDates(season, programWindows) : generateSeasonPeakDates(season);
}
function dayNumberToIsoDate(dayNumber) {
    return new Date(dayNumber * 86400000).toISOString().slice(0, 10);
}
function rollDailyCondition(currentDate) {
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
function randomInteger(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}
