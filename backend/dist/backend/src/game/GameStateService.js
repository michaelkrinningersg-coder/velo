"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStateService = void 0;
const events_1 = require("events");
const GameStateRepository_1 = require("../db/repositories/GameStateRepository");
const ResultRepository_1 = require("../db/repositories/ResultRepository");
const mappers_1 = require("../db/mappers");
const ContractService_1 = require("./ContractService");
const RiderDevelopmentService_1 = require("./RiderDevelopmentService");
const RiderProgramService_1 = require("./RiderProgramService");
const RiderRoleService_1 = require("./RiderRoleService");
const RiderDraftService_1 = require("./RiderDraftService");
const RiderNewgenService_1 = require("./RiderNewgenService");
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
function tableExists(db, tableName) {
    const row = db.prepare("SELECT name FROM sqlite_master WHERE type IN ('table', 'view') AND name = ?").get(tableName);
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
        this.knownColumns.add('rider_daily_state.season_points');
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
            this.syncDailyFormHistory(state.currentDate);
            // Lazily populate yearly_baseline_skills for current season if missing
            const missingBaseline = this.db.prepare(`
        SELECT COUNT(*) as c FROM riders WHERE is_retired = 0 AND yearly_baseline_skills IS NULL
      `).get();
            if (missingBaseline.c > 0) {
                this.snapshotYearlyBaselineSkills();
            }
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
        ResultRepository_1.ResultRepository.clearInMemoryStageEvents();
        let isNewSeason = false;
        let oldSeason = 0;
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
                isNewSeason = true;
                oldSeason = currentRow.season;
                // Standings-Snapshot für die abgelaufene Saison sichern
                try {
                    const resultRepo = new ResultRepository_1.ResultRepository(this.db);
                    const standings = resultRepo.getSeasonStandings(currentRow.season);
                    this.db.prepare(`
            INSERT OR REPLACE INTO season_standings_snapshots (season, payload_json)
            VALUES (?, ?)
          `).run(currentRow.season, JSON.stringify(standings));
                }
                catch (e) {
                    console.error('Fehler beim Erstellen des Season Standings Snapshots:', e);
                }
                // Ergebnisse der abgelaufenen Saison in die Historie verschieben
                try {
                    this.db.prepare(`
            INSERT INTO results_history (
              race_id, stage_id, rider_id, team_id, result_type_id, rank, 
              time_seconds, points, is_breakaway, leadout_rider_id, 
              leadout_bonus, breakaway_kms, event_ids, jerseys_worn
            )
            SELECT 
              race_id, stage_id, rider_id, team_id, result_type_id, rank, 
              time_seconds, points, is_breakaway, leadout_rider_id, 
              leadout_bonus, breakaway_kms, event_ids, jerseys_worn
            FROM results
            WHERE race_id IN (SELECT id FROM races WHERE start_date LIKE ?)
          `).run(`${currentRow.season}-%`);
                    this.db.prepare(`
            DELETE FROM results
            WHERE race_id IN (SELECT id FROM races WHERE start_date LIKE ?)
          `).run(`${currentRow.season}-%`);
                    this.db.prepare(`
            DELETE FROM stage_entries
            WHERE race_id IN (SELECT id FROM races WHERE start_date LIKE ?)
          `).run(`${currentRow.season}-%`);
                    console.log(`Ergebnisse und Etappeneinträge der Saison ${currentRow.season} erfolgreich archiviert/bereinigt.`);
                    // Prune race_results_compact for the elapsed season to keep only point-scoring results
                    try {
                        console.log(`Pruning race results compact for season ${currentRow.season}...`);
                        const pointsEvents = this.db.prepare(`
              SELECT stage_id, rider_id, team_id
              FROM season_point_events
              WHERE season = ? AND points_awarded > 0
            `).all(currentRow.season);
                        const riderPointsKeys = new Set();
                        const teamPointsKeys = new Set();
                        for (const p of pointsEvents) {
                            if (p.rider_id != null) {
                                riderPointsKeys.add(`${p.stage_id}_${p.rider_id}`);
                            }
                            else {
                                teamPointsKeys.add(`${p.stage_id}_${p.team_id}`);
                            }
                        }
                        const compactRows = this.db.prepare(`
              SELECT race_id, payload FROM race_results_compact WHERE season = ?
            `).all(currentRow.season);
                        const updateStmt = this.db.prepare(`
              UPDATE race_results_compact SET payload = ? WHERE race_id = ?
            `);
                        for (const row of compactRows) {
                            const groups = JSON.parse(row.payload);
                            for (const typeKey of Object.keys(groups)) {
                                if (Array.isArray(groups[typeKey])) {
                                    groups[typeKey] = groups[typeKey].filter((r) => {
                                        const stageId = r[0];
                                        const riderId = r[1];
                                        const teamId = r[2];
                                        const rank = r[3];
                                        if (rank === 1)
                                            return true; // Sieger immer behalten
                                        if (riderId != null) {
                                            return riderPointsKeys.has(`${stageId}_${riderId}`);
                                        }
                                        else {
                                            return teamPointsKeys.has(`${stageId}_${teamId}`);
                                        }
                                    });
                                }
                            }
                            updateStmt.run(JSON.stringify(groups), row.race_id);
                        }
                        console.log(`Pruning finished for season ${currentRow.season}.`);
                    }
                    catch (pe) {
                        console.error('Fehler beim Bereinigen der Saisonergebnisse:', pe);
                    }
                }
                catch (e) {
                    console.error('Fehler beim Archivieren der Saisonergebnisse:', e);
                }
                // Duplicate calendar dates (stages and races) to the new season's year
                this.duplicateCalendarForSeason(currentRow.season, nextSeason);
                new ContractService_1.ContractService(this.db).checkContractStatuses(nextSeason, true);
                new RiderDraftService_1.RiderDraftService(this.db).executeDraft(nextSeason);
                new ContractService_1.ContractService(this.db).checkContractStatuses(nextSeason); // activate new draft contracts
                new RiderDevelopmentService_1.RiderDevelopmentService(this.db).recalculateSpecializations(nextSeason);
                new RiderRoleService_1.RiderRoleService(this.db).recalculateAllTeamRoles();
                new RiderProgramService_1.RiderProgramService(this.db).ensureSeasonPrograms(nextSeason, nextDate);
                // Newgens fÃ¼r die nÃ¤chste Saison erzeugen
                new RiderNewgenService_1.RiderNewgenService(this.db).createYearStartNewgens(nextSeason);
                new RiderDevelopmentService_1.RiderDevelopmentService(this.db).initializeRiders(nextSeason);
                // Skill-Development aller aktiven Fahrer neu auswÃ¼rfeln (Â±3, max 20, min 1)
                this.db.prepare(`
          UPDATE riders
          SET skill_development = MAX(1, MIN(20, skill_development + CAST((ABS(RANDOM()) % 7) - 3 AS INTEGER)))
          WHERE is_retired = 0 AND skill_development > 0
        `).run();
                // Snapshot der Fahrer-Werte als Baseline für die Saison in der UI abspeichern
                this.snapshotYearlyBaselineSkills();
            }
            this.ensureRiderDailyStateTable();
            this.ensureRiderDailyStateRows(currentRow.season);
            this.advanceRiderDailyStates(nextDate, nextSeason);
            new GameStateRepository_1.GameStateRepository(this.db).markUnavailableStageRaceParticipantsAsDnf();
            this.db.prepare('UPDATE game_state SET "current_date" = ?, season = ?, is_game_over = ? WHERE id = 1').run(nextDate, nextSeason, currentRow.is_game_over);
            this.db.prepare(`
        INSERT INTO career_meta (key, value) VALUES ('current_season', ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `).run(String(nextSeason));
            const checks = this.runDailyChecks(nextDate);
            return this.mapState({ current_date: nextDate, season: nextSeason, is_game_over: currentRow.is_game_over }, checks);
        })();
        if (isNewSeason) {
            try {
                console.log(`Running post-season VACUUM for season ${oldSeason}...`);
                this.db.prepare('VACUUM').run();
            }
            catch (e) {
                console.error('Failed to run post-season VACUUM:', e);
            }
        }
        this.events.emit('dayAdvanced', nextState);
        return nextState;
    }
    onDayAdvanced(listener) {
        this.events.on('dayAdvanced', listener);
        return () => this.events.off('dayAdvanced', listener);
    }
    duplicateCalendarForSeason(oldYear, newYear) {
        const oldYearStr = String(oldYear);
        const newYearStr = String(newYear);
        // 1. Duplicate races
        const oldRaces = this.db.prepare(`
      SELECT * FROM races WHERE start_date LIKE ?
    `).all(`${oldYearStr}-%`);
        const insertRace = this.db.prepare(`
      INSERT INTO races (
        name, country_id, category_id, is_stage_race, number_of_stages, start_date, end_date, prestige, preferred_nationality_group, required_specs
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        const raceMap = new Map();
        for (const r of oldRaces) {
            const newStartDate = r.start_date.replace(oldYearStr, newYearStr);
            const newEndDate = r.end_date.replace(oldYearStr, newYearStr);
            const res = insertRace.run(r.name, r.country_id, r.category_id, r.is_stage_race, r.number_of_stages, newStartDate, newEndDate, r.prestige, r.preferred_nationality_group || null, r.required_specs || null);
            raceMap.set(r.id, res.lastInsertRowid);
        }
        // 2. Duplicate stages
        const oldStages = this.db.prepare(`
      SELECT * FROM stages WHERE date LIKE ?
    `).all(`${oldYearStr}-%`);
        const insertStage = this.db.prepare(`
      INSERT INTO stages (
        race_id, stage_number, date, profile, start_elevation, details_csv_file,
        final_spread_start_percent, final_push_start_percent, final_spread_difficulty_multiplier,
        crash_incident_multiplier, mechanical_incident_multiplier, stage_score, allowed_weather
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        const stageMap = new Map();
        for (const s of oldStages) {
            const newRaceId = raceMap.get(s.race_id);
            if (newRaceId === undefined)
                continue;
            const newDate = s.date.replace(oldYearStr, newYearStr);
            const res = insertStage.run(newRaceId, s.stage_number, newDate, s.profile, s.start_elevation, s.details_csv_file, s.final_spread_start_percent, s.final_push_start_percent, s.final_spread_difficulty_multiplier, s.crash_incident_multiplier, s.mechanical_incident_multiplier, s.stage_score, s.allowed_weather);
            stageMap.set(s.id, res.lastInsertRowid);
        }
        // 3. Duplicate stage climb scores
        if (this.isTable('stage_climb_scores')) {
            const oldClimbs = this.db.prepare(`
        SELECT scs.* FROM stage_climb_scores scs
        JOIN stages s ON s.id = scs.stage_id
        WHERE s.date LIKE ?
      `).all(`${oldYearStr}-%`);
            const insertClimb = this.db.prepare(`
        INSERT INTO stage_climb_scores (
          stage_id, climb_index, name, category, start_km, end_km, climb_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
            for (const c of oldClimbs) {
                const newStageId = stageMap.get(c.stage_id);
                if (newStageId === undefined)
                    continue;
                insertClimb.run(newStageId, c.climb_index, c.name, c.category, c.start_km, c.end_km, c.climb_score);
            }
        }
        // 4. Duplicate race program races
        if (this.isTable('race_program_races')) {
            const oldProgramRaces = this.db.prepare(`
        SELECT rpr.* FROM race_program_races rpr
        JOIN races r ON r.id = rpr.race_id
        WHERE r.start_date LIKE ?
      `).all(`${oldYearStr}-%`);
            const insertProgramRace = this.db.prepare(`
        INSERT OR IGNORE INTO race_program_races (
          program_id, race_id, allowed_program_group_ids
        ) VALUES (?, ?, ?)
      `);
            for (const pr of oldProgramRaces) {
                const newRaceId = raceMap.get(pr.race_id);
                if (newRaceId === undefined)
                    continue;
                insertProgramRace.run(pr.program_id, newRaceId, pr.allowed_program_group_ids ?? null);
            }
        }
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
        season_points INTEGER NOT NULL DEFAULT 0,
        season_wins INTEGER NOT NULL DEFAULT 0,
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
        if (!columnExists(this.db, 'rider_daily_state', 'season_points')) {
            this.db.prepare(`
        ALTER TABLE rider_daily_state
        ADD COLUMN season_points INTEGER NOT NULL DEFAULT 0
      `).run();
            // Migrate existing points
            this.db.prepare(`
        UPDATE rider_daily_state
        SET season_points = COALESCE((
          SELECT SUM(points_awarded)
          FROM season_point_events
          WHERE season_point_events.rider_id = rider_daily_state.rider_id
            AND season_point_events.season = rider_daily_state.season
        ), 0)
      `).run();
        }
        if (!columnExists(this.db, 'rider_daily_state', 'season_wins')) {
            this.db.prepare(`
        ALTER TABLE rider_daily_state
        ADD COLUMN season_wins INTEGER NOT NULL DEFAULT 0
      `).run();
            // Migrate existing wins
            this.db.prepare(`
        WITH individual_wins AS (
          SELECT results.rider_id AS rider_id, COUNT(*) AS wins
          FROM results
          JOIN stages ON stages.id = results.stage_id
          WHERE results.result_type_id = 1 AND results.rank = 1 AND results.rider_id IS NOT NULL
          GROUP BY results.rider_id
        ),
        ttt_wins AS (
          SELECT all_stage_entries.rider_id AS rider_id, COUNT(*) AS wins
          FROM results
          JOIN stages ON stages.id = results.stage_id
          JOIN all_stage_entries ON all_stage_entries.stage_id = results.stage_id AND all_stage_entries.team_id = results.team_id
          WHERE results.result_type_id = 1 AND results.rank = 1 AND results.rider_id IS NULL
            AND all_stage_entries.status = 'finished'
          GROUP BY all_stage_entries.rider_id
        ),
        gc_wins AS (
          SELECT results.rider_id AS rider_id, COUNT(*) AS wins
          FROM results
          JOIN stages ON stages.id = results.stage_id
          JOIN races ON races.id = stages.race_id
          WHERE results.result_type_id = 2 AND results.rank = 1 AND results.rider_id IS NOT NULL
            AND races.is_stage_race = 1 AND stages.stage_number = races.number_of_stages
          GROUP BY results.rider_id
        ),
        total_wins AS (
          SELECT rider_id, SUM(wins) AS wins
          FROM (
            SELECT rider_id, wins FROM individual_wins
            UNION ALL
            SELECT rider_id, wins FROM ttt_wins
            UNION ALL
            SELECT rider_id, wins FROM gc_wins
          )
          GROUP BY rider_id
        )
        UPDATE rider_daily_state
        SET season_wins = COALESCE((
          SELECT wins FROM total_wins WHERE total_wins.rider_id = rider_daily_state.rider_id
        ), 0)
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
        short_fatigue REAL NOT NULL DEFAULT 0.0,
        long_fatigue REAL NOT NULL DEFAULT 0.0,
        combined_fatigue REAL NOT NULL DEFAULT 0.0,
        PRIMARY KEY (rider_id, date)
      )
    `).run();
        const colExists = (tableName, colName) => {
            try {
                const info = this.db.prepare(`PRAGMA table_info(${tableName})`).all();
                return info.some((c) => c.name === colName);
            }
            catch (e) {
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
            const peakDates = resolveSeasonPeakDatesFromWindows([], season, windows, this.db, rider.id);
            insertState.run(rider.id, season, SEASON_FORM_MIN_RAW, JSON.stringify(peakDates));
        }
    }
    syncCurrentSeasonFormState(currentDate, currentSeason) {
        if (!this.isTable('rider_daily_state')) {
            return;
        }
        this.ensureRiderDailyStateRows(currentSeason);
        if (this.isTable('rider_lieutenants')) {
            this.db.prepare(`
        UPDATE rider_daily_state
        SET peak_dates_json = (
          SELECT lds.peak_dates_json
          FROM rider_lieutenants rl
          JOIN rider_daily_state lds ON lds.rider_id = rl.leader_id
          WHERE rl.lieutenant_id = rider_daily_state.rider_id AND rl.season = ?
        )
        WHERE EXISTS (
          SELECT 1
          FROM rider_lieutenants rl
          JOIN rider_daily_state lds ON lds.rider_id = rl.leader_id
          WHERE rl.lieutenant_id = rider_daily_state.rider_id AND rl.season = ?
            AND lds.peak_dates_json IS NOT NULL AND lds.peak_dates_json != '[]'
        )
      `).run(currentSeason, currentSeason);
            if (this.isTable('lieutenant_all_time_peaks')) {
                this.db.prepare(`
          INSERT INTO lieutenant_all_time_peaks (rider_id, max_overall_rating, leader_id, season)
          SELECT rl.lieutenant_id, r.overall_rating, rl.leader_id, rl.season
          FROM rider_lieutenants rl
          JOIN riders r ON r.id = rl.lieutenant_id
          WHERE rl.season = ?
          ON CONFLICT(rider_id) DO UPDATE SET
            leader_id = CASE WHEN excluded.max_overall_rating > max_overall_rating THEN excluded.leader_id ELSE leader_id END,
            season = CASE WHEN excluded.max_overall_rating > max_overall_rating THEN excluded.season ELSE season END,
            max_overall_rating = CASE WHEN excluded.max_overall_rating > max_overall_rating THEN excluded.max_overall_rating ELSE max_overall_rating END
        `).run(currentSeason);
            }
        }
        this.syncRiderLoadState(currentDate, currentSeason);
        const rows = this.db.prepare(`
      SELECT rds.rider_id, rds.season, rds.form_bonus, rds.race_form_bonus, rds.peak_s_form, rds.peak_r_form, rds.active_peak_date, rds.peak_dates_json, rds.health_status, rds.unavailable_until, rds.unavailable_days_remaining, rds.season_race_days_total, rds.rolling_30d_race_days,
             r.active_team_id,
             dt.tier AS team_tier
      FROM rider_daily_state rds
      JOIN riders r ON r.id = rds.rider_id
      LEFT JOIN teams t ON t.id = r.active_team_id
      LEFT JOIN division_teams dt ON dt.id = t.division_id
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
            const isTier1 = row.active_team_id != null && row.team_tier === 1;
            if (!isTier1) {
                continue;
            }
            const seasonChanged = row.season !== currentSeason;
            const windows = seasonChanged ? null : (programWindows.get(row.rider_id) ?? null);
            const peakDates = resolveSeasonPeakDatesFromWindows(seasonChanged ? [] : parsePeakDates(row.peak_dates_json), currentSeason, windows, this.db, row.rider_id);
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
            }
            else if (phase?.phase === 'decline') {
                peakSForm = row.active_peak_date === phase.peakDate ? row.peak_s_form : row.form_bonus;
                formBonus = resolveDeclineValue(peakSForm, phase.elapsedDays);
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
      SELECT rds.rider_id, rds.season, rds.form_bonus, rds.race_form_bonus, rds.peak_s_form, rds.peak_r_form, rds.active_peak_date, rds.peak_dates_json, rds.health_status, rds.unavailable_until, rds.unavailable_days_remaining, rds.season_race_days_total, rds.rolling_30d_race_days,
             rds.short_term_fatigue, rds.long_term_fatigue_decayable, rds.long_term_fatigue_locked, rds.consecutive_non_race_days,
             r.skill_recuperation, r.birth_year,
             r.active_team_id,
             dt.tier AS team_tier,
             t.is_player_team AS is_player_team
      FROM rider_daily_state rds
      JOIN riders r ON r.id = rds.rider_id
      LEFT JOIN teams t ON t.id = r.active_team_id
      LEFT JOIN division_teams dt ON dt.id = t.division_id
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
          unavailable_days_remaining = ?,
          short_term_fatigue = ?,
          long_term_fatigue_decayable = ?,
          long_term_fatigue_locked = ?,
          consecutive_non_race_days = ?
      WHERE rider_id = ?
    `);
        const racingRidersRow = this.db.prepare(`
      SELECT se.rider_id FROM stage_entries se
      JOIN stages s ON s.id = se.stage_id
      WHERE s.date = ? AND se.status IN ('scheduled', 'started')
    `).all(nextDate);
        const racingRiderIds = new Set(racingRidersRow.map((r) => r.rider_id));
        const yesterday = addDaysIso(nextDate, -1);
        const racedYesterdayRow = this.db.prepare(`
      SELECT se.rider_id, s.stage_score FROM all_stage_entries se
      JOIN stages s ON s.id = se.stage_id
      WHERE s.date = ? AND se.status IN ('finished', 'dnf')
    `).all(yesterday);
        const racedYesterdayRiderIds = new Set(racedYesterdayRow.map((r) => r.rider_id));
        const racedYesterdayMap = new Map();
        for (const r of racedYesterdayRow) {
            const currentScore = racedYesterdayMap.get(r.rider_id);
            if (currentScore === undefined || r.stage_score > currentScore) {
                racedYesterdayMap.set(r.rider_id, r.stage_score);
            }
        }
        // Bulk-load program windows for the current season ONCE instead of doing
        // a per-rider SELECT in `loadProgramPeakWindows` (the previous N+1 hot spot).
        const programWindows = this.getProgramWindowsForSeason(nextSeason);
        const seasonChangedRiderIds = [];
        const developmentContexts = [];
        const deleteFormEvents = this.db.prepare(`
      DELETE FROM rider_r_form_events
      WHERE rider_id = ?
    `);
        const updates = [];
        for (const row of rows) {
            const isTier1 = row.active_team_id != null && row.team_tier === 1;
            if (!isTier1) {
                continue;
            }
            const seasonChanged = row.season !== nextSeason;
            const riderProgramWindows = seasonChanged ? null : (programWindows.get(row.rider_id) ?? null);
            const peakDates = resolveSeasonPeakDatesFromWindows(seasonChanged ? [] : parsePeakDates(row.peak_dates_json), nextSeason, riderProgramWindows, this.db, row.rider_id);
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
            `).run(row.rider_id, isIll ? 1 : 0, isIll ? newCondition.durationDays : 0, isIll ? 0 : 1, isIll ? 0 : newCondition.durationDays);
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
            `).run(row.rider_id, nextSeason, isIll ? 1 : 0, isIll ? newCondition.durationDays : 0, isIll ? 0 : 1, isIll ? 0 : newCondition.durationDays);
                    }
                }
            }
            const phase = resolvePeakPhase(nextDate, peakDates);
            if (phase?.phase === 'decline' && phase.elapsedDays === 0) {
                activePeakDate = phase.peakDate;
                peakSForm = formBonus;
                peakRForm = roundFormBonus(Math.max(0, raceFormBonus));
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
                // Only accumulate form after Jan 1 of the current season.
                // If the build window starts in the previous year, riders begin at 0 on Jan 1.
                const peakDayForBuild2 = isoDateToDayNumber(phase.peakDate);
                const buildWindowStartDay = peakDayForBuild2 - SEASON_FORM_RISE_DAYS;
                const seasonStart2Day = isoDateToDayNumber(`${nextSeason}-01-01`);
                const nextDayNum = isoDateToDayNumber(nextDate);
                const effectiveBuildStart = Math.max(buildWindowStartDay, seasonStart2Day);
                if (nextDayNum >= effectiveBuildStart && healthStatus === 'healthy') {
                    formBonus = roundFormBonus(Math.min(SEASON_FORM_MAX_RAW, formBonus + SEASON_FORM_RISE_STEP_RAW));
                }
                else if (nextDayNum < effectiveBuildStart) {
                    formBonus = SEASON_FORM_MIN_RAW;
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
            // Daily Fatigue Decay / Season Resets
            let consecutiveNonRaceDays = row.consecutive_non_race_days ?? 0;
            if (seasonChanged) {
                consecutiveNonRaceDays = 0;
            }
            else if (racedYesterdayRiderIds.has(row.rider_id)) {
                consecutiveNonRaceDays = 0;
            }
            else {
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
            }
            else {
                const oldShort = shortTermFatigue;
                const oldLongDecayable = longTermDecayable;
                const age = nextSeason - (row.birth_year ?? 0);
                let recoveryShort;
                let recoveryLong;
                if (consecutiveNonRaceDays >= 14) {
                    const extraDays = consecutiveNonRaceDays - 14;
                    if (age < 24) {
                        const randShort = (Math.random() * 0.1) - 0.05; // -0.05 to 0.05
                        recoveryShort = Math.min((0.3 + randShort) + extraDays * 0.01, 0.45);
                        const randLong = (Math.random() * 0.01) - 0.005; // -0.005 to 0.005
                        recoveryLong = Math.min((0.02 + randLong) + extraDays * 0.001, 0.025);
                    }
                    else {
                        recoveryShort = Math.min(0.2 + extraDays * 0.01, 0.35);
                        recoveryLong = Math.min(0.015 + extraDays * 0.001, 0.02);
                    }
                }
                else {
                    const R = row.skill_recuperation ?? 65;
                    const decayMultiplier = 1 + (R - 65) * 0.01;
                    recoveryShort = 0.2 * decayMultiplier;
                    recoveryLong = 0.01 * decayMultiplier;
                }
                let shortTermMult = 1.0;
                let longTermMult = 1.0;
                if (consecutiveNonRaceDays >= 1) {
                    shortTermMult = 1.25;
                    longTermMult = 1.15;
                }
                else {
                    const stageScore = racedYesterdayMap.get(row.rider_id) ?? 0;
                    if (stageScore < 10) {
                        shortTermMult = 1.20;
                        longTermMult = 1.10;
                    }
                    else if (stageScore < 25) {
                        shortTermMult = 1.15;
                        longTermMult = 1.05;
                    }
                    else if (stageScore < 50) {
                        shortTermMult = 1.05;
                        longTermMult = 1.00;
                    }
                    else {
                        shortTermMult = 1.00;
                        longTermMult = 1.00;
                    }
                }
                recoveryShort *= shortTermMult;
                recoveryLong *= longTermMult;
                // Double fatigue recovery in November and December
                const month = nextDate.slice(5, 7);
                if (month === '11' || month === '12') {
                    recoveryShort *= 2.0;
                    recoveryLong *= 2.0;
                }
                shortTermFatigue = Math.max(0.0, shortTermFatigue - recoveryShort);
                longTermDecayable = Math.max(0.0, longTermDecayable - recoveryLong);
                shortTermFatigue = roundToThreeDecimals(shortTermFatigue);
                longTermDecayable = roundToThreeDecimals(longTermDecayable);
                shortChange = roundToThreeDecimals(shortTermFatigue - oldShort);
                longDecayableChange = roundToThreeDecimals(longTermDecayable - oldLongDecayable);
            }
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
                || row.unavailable_days_remaining !== remainingDays
                || row.short_term_fatigue !== shortTermFatigue
                || row.long_term_fatigue_decayable !== longTermDecayable
                || row.long_term_fatigue_locked !== longTermLocked
                || row.consecutive_non_race_days !== consecutiveNonRaceDays) {
                updates.push([
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
                ]);
            }
        }
        if (updates.length > 0) {
            this.db.transaction(() => {
                for (const u of updates) {
                    updateState.run(...u);
                }
            })();
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
            if (this.isTable('rider_fatigue_history')) {
                this.db.prepare('DELETE FROM rider_fatigue_history').run();
            }
        }
        // Retention policy: delete rider_fatigue_history entries older than 30 days
        if (this.isTable('rider_fatigue_history')) {
            this.db.prepare(`
        DELETE FROM rider_fatigue_history
        WHERE date < date(?, '-30 days')
      `).run(nextDate);
        }
        this.syncDailyFormHistory(nextDate);
        new RiderDevelopmentService_1.RiderDevelopmentService(this.db).advanceDailyDevelopment(nextDate, nextSeason, developmentContexts);
    }
    syncRiderLoadState(currentDate, currentSeason) {
        if (!this.isTable('rider_daily_state') || !this.isTable('rider_season_stats')) {
            return;
        }
        this.db.prepare(`
      UPDATE rider_daily_state
      SET season_race_days_total = COALESCE((
        SELECT race_days
        FROM rider_season_stats
        WHERE rider_season_stats.rider_id = rider_daily_state.rider_id
          AND rider_season_stats.season = ?
      ), 0),
      rolling_30d_race_days = 0
    `).run(currentSeason);
        this.db.prepare(`
      WITH individual_wins AS (
        SELECT results.rider_id, COUNT(*) AS wins
        FROM results
        JOIN stages ON stages.id = results.stage_id
        WHERE results.result_type_id = 1 AND results.rank = 1 AND results.rider_id IS NOT NULL
          AND CAST(substr(stages.date, 1, 4) AS INTEGER) = @season
        GROUP BY results.rider_id
      ),
      ttt_wins AS (
        SELECT all_stage_entries.rider_id, COUNT(*) AS wins
        FROM results
        JOIN stages ON stages.id = results.stage_id
        JOIN all_stage_entries ON all_stage_entries.stage_id = results.stage_id AND all_stage_entries.team_id = results.team_id
        WHERE results.result_type_id = 1 AND results.rank = 1 AND results.rider_id IS NULL
          AND all_stage_entries.status = 'finished'
          AND CAST(substr(stages.date, 1, 4) AS INTEGER) = @season
        GROUP BY all_stage_entries.rider_id
      ),
      gc_wins AS (
        SELECT results.rider_id, COUNT(*) AS wins
        FROM results
        JOIN stages ON stages.id = results.stage_id
        JOIN races ON races.id = stages.race_id
        WHERE results.result_type_id = 2 AND results.rank = 1 AND results.rider_id IS NOT NULL
          AND races.is_stage_race = 1 AND stages.stage_number = races.number_of_stages
          AND CAST(substr(stages.date, 1, 4) AS INTEGER) = @season
        GROUP BY results.rider_id
      ),
      total_wins AS (
        SELECT rider_id, SUM(wins) AS season_wins
        FROM (
          SELECT rider_id, wins FROM individual_wins
          UNION ALL
          SELECT rider_id, wins FROM ttt_wins
          UNION ALL
          SELECT rider_id, wins FROM gc_wins
        )
        GROUP BY rider_id
      )
      UPDATE rider_daily_state
      SET season_wins = COALESCE((SELECT season_wins FROM total_wins WHERE total_wins.rider_id = rider_daily_state.rider_id), 0)
      WHERE season = @season
    `).run({
            season: currentSeason,
        });
    }
    removeExpiredRaceFormEvents(currentDate) {
        if (tableExists(this.db, 'rider_r_form_events')) {
            this.db.prepare('DELETE FROM rider_r_form_events WHERE expires_on <= ?').run(currentDate);
        }
        if (tableExists(this.db, 'rider_r_form_daily_awards')) {
            this.db.prepare('DELETE FROM rider_r_form_daily_awards WHERE award_date < ?').run(currentDate);
        }
    }
    syncDailyFormHistory(currentDate) {
        if (!this.isTable('rider_daily_state') || !this.isTable('rider_form_history') || !this.isTable('riders')) {
            return;
        }
        if ((0, mappers_1.isWinterBreak)(currentDate)) {
            return;
        }
        const isFirstDay = currentDate.endsWith('-01-01');
        const dayOfWeek = new Date(currentDate + 'T00:00:00Z').getUTCDay();
        if (!isFirstDay && dayOfWeek !== 0) {
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
                const peakDates = resolveSeasonPeakDates(parsePeakDates(row.peak_dates_json), row.season, this.db, riderId);
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
        const rows = tableExists(this.db, 'all_results')
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
          LEFT JOIN all_results stage_results
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
          HAVING COUNT(stage_results.stage_id) = 0
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
    applyStageFatigue(stageId, completedRiderIds, dnfRiderIds) {
        if (!this.isTable('rider_daily_state') || !this.isTable('rider_fatigue_history')) {
            return;
        }
        const stageRow = this.db.prepare(`
      SELECT s.id, s.stage_score, s.stage_number, r.name AS race_name, s.date,
             s.rolled_weather_id, w.effekt_fatigue_min, w.effekt_fatigue_max,
             r.category_id AS category_id
      FROM stages s
      JOIN races r ON r.id = s.race_id
      LEFT JOIN wetter w ON w.id = s.rolled_weather_id
      WHERE s.id = ?
    `).get(stageId);
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
             rds.season_race_days_total,
             t.is_player_team AS is_player_team
      FROM riders r
      LEFT JOIN rider_daily_state rds ON rds.rider_id = r.id
      LEFT JOIN teams t ON t.id = r.active_team_id
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
        this.db.transaction(() => {
            for (const riderId of participatedRiderIds) {
                const row = stmtSelect.get(riderId);
                if (!row)
                    continue;
                let currentShort = row.short_term_fatigue ?? 0.0;
                let currentLongDecayable = row.long_term_fatigue_decayable ?? 0.0;
                const currentLongLocked = row.long_term_fatigue_locked ?? 0.0;
                // Apply newly started race additions if stageNumber === 1
                if (stageNumber === 1) {
                    const transferShortChange = 0.5;
                    const transferLongDecayableChange = 0.05;
                    currentShort = roundToTwoDecimals(currentShort + transferShortChange);
                    currentLongDecayable = roundToTwoDecimals(currentLongDecayable + transferLongDecayableChange);
                    stmtUpdate.run(currentShort, currentLongDecayable, currentLongLocked, riderId);
                }
                const R = row.skill_recuperation;
                const multiplier = R >= 65
                    ? 1 - (R - 65) * 0.02
                    : 1 + (65 - R) * 0.02;
                let addedShort = stageScore >= 10 ? (stageScore / 100) * 0.55 * multiplier : 0;
                let addedLongDecayable = stageScore >= 10 ? (stageScore / 1000) * 0.75 * multiplier : 0;
                const age = Number(stageDate.slice(0, 4)) - row.birth_year;
                if (age >= 30 && age <= 34) {
                    const reductionPercent = randomInteger(8, 12) / 100;
                    addedShort *= (1 - reductionPercent);
                    addedLongDecayable *= (1 - reductionPercent);
                }
                else if (age < 24) {
                    const yearsUnder24 = 24 - age;
                    let increasePerYearPercent;
                    if (stageScore > 300) {
                        increasePerYearPercent = 6 + (Math.random() * 6 - 3); // 6 +- 3%
                    }
                    else {
                        increasePerYearPercent = 3 + (Math.random() * 4 - 2); // 3 +- 2%
                    }
                    const totalIncreasePercent = (increasePerYearPercent * yearsUnder24) / 100;
                    addedShort *= (1 + totalIncreasePercent);
                    addedLongDecayable *= (1 + totalIncreasePercent);
                }
                if (stageRow.rolled_weather_id != null) {
                    const rolledEffektFatigue = (0, mappers_1.getDeterministicWeatherEffect)(stageRow.id, 'fatigue', stageRow.effekt_fatigue_min ?? 0, stageRow.effekt_fatigue_max ?? 0);
                    addedShort *= (1 + rolledEffektFatigue / 100);
                    addedLongDecayable *= (1 + rolledEffektFatigue / 100);
                }
                // Apply category multipliers
                let shortMult = 1.0;
                let longMult = 1.0;
                const catId = stageRow.category_id;
                if (catId === 6 || catId === 9) {
                    shortMult = 0.9;
                    longMult = 0.9;
                }
                else if (catId === 5 || catId === 8) {
                    shortMult = 0.95;
                    longMult = 1.0;
                }
                else if (catId === 4 || catId === 7) {
                    shortMult = 1.0;
                    longMult = 1.1;
                }
                else if (catId === 3) {
                    shortMult = 1.15;
                    longMult = 1.25;
                }
                else if (catId === 2) {
                    shortMult = 1.1;
                    longMult = 1.15;
                }
                else if (catId === 1) {
                    shortMult = 1.15;
                    longMult = 1.3;
                }
                addedShort *= shortMult;
                addedLongDecayable *= longMult;
                let shortLimit = 2.5;
                let longLimit = 0.3;
                if (catId === 1 || catId === 3) {
                    shortLimit = 3.0;
                    longLimit = 0.4;
                }
                else if (catId === 2) {
                    shortLimit = 2.8;
                    longLimit = 0.35;
                }
                else if (catId === 4 || catId === 7) {
                    shortLimit = 2.7;
                    longLimit = 0.33;
                }
                addedShort = Math.min(shortLimit, addedShort);
                addedLongDecayable = Math.min(longLimit, addedLongDecayable);
                addedShort = roundToTwoDecimals(addedShort);
                addedLongDecayable = roundToTwoDecimals(addedLongDecayable);
                // n is season race days total. Note: refreshRiderLoadState already updated season_race_days_total
                // so it already includes the current stage!
                const n = row.season_race_days_total ?? 0;
                const addedLongLocked = resolveLockedFatigueAddition(n);
                const newShort = roundToTwoDecimals(currentShort + addedShort);
                const newLongDecayable = roundToTwoDecimals(currentLongDecayable + addedLongDecayable);
                const newLongLocked = roundToTwoDecimals(currentLongLocked + addedLongLocked);
                stmtUpdate.run(newShort, newLongDecayable, newLongLocked, riderId);
            }
        })();
    }
    snapshotYearlyBaselineSkills() {
        console.log("Snapshotting active riders' skills as yearly baseline...");
        const riders = this.db.prepare(`
      SELECT id, overall_rating, skill_flat, skill_mountain, skill_medium_mountain, skill_hill,
             skill_time_trial, skill_prologue, skill_cobble, skill_sprint, skill_acceleration,
             skill_downhill, skill_attack, skill_stamina, skill_resistance, skill_recuperation,
             skill_bike_handling
      FROM riders
      WHERE is_retired = 0
    `).all();
        const update = this.db.prepare(`
      UPDATE riders
      SET yearly_baseline_skills = ?
      WHERE id = ?
    `);
        this.db.transaction(() => {
            for (const r of riders) {
                const baseline = {
                    overall_rating: r.overall_rating,
                    flat: r.skill_flat,
                    mountain: r.skill_mountain,
                    medium_mountain: r.skill_medium_mountain,
                    hill: r.skill_hill,
                    time_trial: r.skill_time_trial,
                    prologue: r.skill_prologue,
                    cobble: r.skill_cobble,
                    sprint: r.skill_sprint,
                    acceleration: r.skill_acceleration,
                    downhill: r.skill_downhill,
                    attack: r.skill_attack,
                    stamina: r.skill_stamina,
                    resistance: r.skill_resistance,
                    recuperation: r.skill_recuperation,
                    bike_handling: r.skill_bike_handling,
                };
                update.run(JSON.stringify(baseline), r.id);
            }
        })();
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
    return null;
}
/**
 * Bulk-load all program peak windows for the given season in a single query.
 * Returns a Map keyed by rider_id. This is the N+1 fix for `loadProgramPeakWindows`.
 */
function loadProgramPeakWindowsForSeason(db, season) {
    return new Map();
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
    return resolveSeasonPeakDatesFromWindows(peakDates, season, programWindows, db, riderId);
}
function findHighlightTriplet(races, minSpacingDays) {
    const n = races.length;
    if (n < 3)
        return null;
    // The highest prestige race is at index 0 because races is sorted by prestige desc.
    // We must anchor the first highlight race at index 0.
    const firstIndex = 0;
    let bestPair = null;
    let maxPrestigeSum = -1;
    for (let j = 1; j < n; j++) {
        if (Math.abs(races[firstIndex].startDay - races[j].startDay) < minSpacingDays) {
            continue;
        }
        for (let k = j + 1; k < n; k++) {
            if (Math.abs(races[firstIndex].startDay - races[k].startDay) < minSpacingDays) {
                continue;
            }
            if (Math.abs(races[j].startDay - races[k].startDay) < minSpacingDays) {
                continue;
            }
            // Found a valid triplet containing index 0!
            const prestigeSum = races[firstIndex].prestige + races[j].prestige + races[k].prestige;
            if (prestigeSum > maxPrestigeSum) {
                maxPrestigeSum = prestigeSum;
                bestPair = [j, k];
            }
        }
    }
    if (bestPair !== null) {
        return [firstIndex, bestPair[0], bestPair[1]];
    }
    return null;
}
function matchesProgramRaces(db, riderId, season, peakDates) {
    if (!db || riderId == null)
        return true;
    if (!tableExists(db, 'rider_season_programs') || !tableExists(db, 'race_program_races') || !tableExists(db, 'races')) {
        return true;
    }
    try {
        const rows = db.prepare(`
      SELECT r.start_date, r.end_date, r.is_stage_race
      FROM rider_season_programs rsp
      JOIN race_program_races rpr ON rpr.program_id = rsp.program_id
      JOIN races r ON r.id = rpr.race_id
      JOIN riders ON riders.id = rsp.rider_id
      JOIN sta_country ON sta_country.id = riders.country_id
      WHERE rsp.rider_id = ? AND rsp.season = ?
        AND (
          rpr.allowed_program_group_ids IS NULL
          OR rpr.allowed_program_group_ids = ''
          OR ('|' || rpr.allowed_program_group_ids || '|') LIKE ('%|' || sta_country.program_group_id || '|%')
        )
    `).all(riderId, season);
        if (rows.length < 3)
            return false;
        const raceDays = rows.map(r => {
            let startDay = isoDateToDayNumber(r.start_date);
            if (r.is_stage_race === 1 && r.end_date) {
                const endDay = isoDateToDayNumber(r.end_date);
                if (!isNaN(endDay)) {
                    startDay = Math.floor((startDay + endDay) / 2);
                }
            }
            return startDay;
        }).filter(d => !isNaN(d));
        const peakDays = peakDates.map(d => isoDateToDayNumber(d));
        const used = new Set();
        const match = (idx) => {
            if (idx === peakDays.length)
                return true;
            for (let i = 0; i < raceDays.length; i++) {
                if (!used.has(i) && Math.abs(peakDays[idx] - raceDays[i]) <= 14) {
                    used.add(i);
                    if (match(idx + 1))
                        return true;
                    used.delete(i);
                }
            }
            return false;
        };
        return match(0);
    }
    catch {
        return false;
    }
}
function generateHighlightBasedPeakDates(db, riderId, season, programWindows) {
    if (!tableExists(db, 'rider_season_programs') || !tableExists(db, 'race_program_races') || !tableExists(db, 'races')) {
        return null;
    }
    try {
        const rows = db.prepare(`
      SELECT r.id, r.name, r.start_date, r.end_date, r.is_stage_race, r.prestige
      FROM rider_season_programs rsp
      JOIN race_program_races rpr ON rpr.program_id = rsp.program_id
      JOIN races r ON r.id = rpr.race_id
      JOIN riders ON riders.id = rsp.rider_id
      JOIN sta_country ON sta_country.id = riders.country_id
      WHERE rsp.rider_id = ? AND rsp.season = ?
        AND (
          rpr.allowed_program_group_ids IS NULL
          OR rpr.allowed_program_group_ids = ''
          OR ('|' || rpr.allowed_program_group_ids || '|') LIKE ('%|' || sta_country.program_group_id || '|%')
        )
    `).all(riderId, season);
        if (rows.length >= 3) {
            const races = rows
                .map(row => {
                let startDay = isoDateToDayNumber(row.start_date);
                if (row.is_stage_race === 1 && row.end_date) {
                    const endDay = isoDateToDayNumber(row.end_date);
                    if (!isNaN(endDay)) {
                        startDay = Math.floor((startDay + endDay) / 2);
                    }
                }
                return {
                    id: row.id,
                    name: row.name,
                    prestige: row.prestige,
                    startDay
                };
            })
                .filter(r => !isNaN(r.startDay));
            races.sort((a, b) => b.prestige - a.prestige || a.startDay - b.startDay || a.id - b.id);
            let chosenIndices = null;
            const thresholds = [70, 56, 42, 28]; // 10, 8, 6, 4 weeks
            for (const spacing of thresholds) {
                chosenIndices = findHighlightTriplet(races, spacing);
                if (chosenIndices !== null) {
                    break;
                }
            }
            if (chosenIndices !== null) {
                const chosenRaces = chosenIndices.map(idx => races[idx]);
                const peakDays = chosenRaces.map(r => {
                    const shift = Math.floor(Math.random() * 29) - 14; // [-14, 14]
                    return r.startDay + shift;
                });
                return peakDays
                    .sort((a, b) => a - b)
                    .map(dayNumberToIsoDate);
            }
        }
    }
    catch (err) {
        console.error(`Error generating highlight-based peaks for rider ${riderId}:`, err);
    }
    return null;
}
/**
 * Like `resolveSeasonPeakDates` but takes pre-loaded program windows for the rider,
 * avoiding an N+1 query against `rider_season_programs` / `race_programs`.
 */
function resolveSeasonPeakDatesFromWindows(peakDates, season, programWindows, db, riderId) {
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
        if (db && riderId != null) {
            const generated = generateHighlightBasedPeakDates(db, riderId, season, programWindows);
            if (generated)
                return generated;
        }
        return programWindows ? generateProgramSeasonPeakDates(season, programWindows) : generateSeasonPeakDates(season);
    }
    const hasValidSpacing = normalized.every((peakDate, index) => {
        if (index === 0) {
            return true;
        }
        const previousPeak = normalized[index - 1];
        return isoDateToDayNumber(peakDate) - isoDateToDayNumber(previousPeak) >= PEAK_MIN_SPACING_DAYS;
    });
    const matchesRaces = db && riderId != null ? matchesProgramRaces(db, riderId, season, normalized) : (programRanges == null
        ? true
        : normalized.every((peakDate, index) => isWithinDayRange(peakDate, programRanges[index])));
    if (hasValidSpacing && matchesRaces) {
        return normalized;
    }
    if (db && riderId != null) {
        const generated = generateHighlightBasedPeakDates(db, riderId, season, programWindows);
        if (generated)
            return generated;
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
function roundToTwoDecimals(value) {
    return Math.round(value * 100) / 100;
}
function resolveLockedFatigueAddition(n) {
    if (n < 30)
        return 0.0;
    if (n < 40)
        return 0.01;
    if (n < 50)
        return 0.02;
    if (n <= 60)
        return 0.03;
    if (n <= 70)
        return 0.04;
    if (n <= 80)
        return 0.05;
    if (n <= 90)
        return 0.06;
    if (n <= 100)
        return 0.08;
    if (n <= 110)
        return 0.10;
    if (n <= 120)
        return 0.13;
    if (n <= 130)
        return 0.17;
    if (n <= 140)
        return 0.22;
    return 0.28;
}
function roundToThreeDecimals(value) {
    return Math.round(value * 1000) / 1000;
}
