"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStateService = void 0;
const events_1 = require("events");
const DEFAULT_START_DATE = '2026-01-01';
const DEFAULT_START_SEASON = 2026;
const FORM_MIN_BONUS = -1;
const FORM_MAX_BONUS = 3;
const FORM_RISE_DAYS = 42;
const FORM_RISE_STEP = 0.1;
const FORM_FALL_DAYS = 14;
const FORM_FALL_STEP = 0.25;
const PEAK_MIN_SPACING_DAYS = 56;
const ILLNESS_CHANCE = 0.0025;
const INJURY_CHANCE = 0.002;
function tableExists(db, tableName) {
    const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName);
    return row != null;
}
class GameStateService {
    constructor(db) {
        this.events = new events_1.EventEmitter();
        this.db = db;
    }
    ensureState() {
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
        this.ensureRiderDailyStateRows(DEFAULT_START_SEASON);
        const state = this.loadState();
        this.db.prepare(`
      INSERT INTO career_meta (key, value) VALUES ('current_season', ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(String(state.season));
        return state;
    }
    loadState() {
        this.ensureStateRow();
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
            this.ensureRiderDailyStateTable();
            this.ensureRiderDailyStateRows(currentRow.season);
            this.advanceRiderDailyStates(nextDate, nextSeason);
            const checks = this.runDailyChecks(nextDate);
            this.db.prepare('UPDATE game_state SET "current_date" = ?, season = ?, is_game_over = ? WHERE id = 1').run(nextDate, nextSeason, currentRow.is_game_over);
            this.db.prepare(`
        INSERT INTO career_meta (key, value) VALUES ('current_season', ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `).run(String(nextSeason));
            return this.mapState({ current_date: nextDate, season: nextSeason, is_game_over: currentRow.is_game_over }, checks);
        })();
        this.events.emit('dayAdvanced', nextState);
        return nextState;
    }
    onDayAdvanced(listener) {
        this.events.on('dayAdvanced', listener);
        return () => this.events.off('dayAdvanced', listener);
    }
    ensureStateRow() {
        this.db.prepare(`
      CREATE TABLE IF NOT EXISTS game_state (
        id INTEGER PRIMARY KEY CHECK(id = 1),
        current_date TEXT NOT NULL,
        season INTEGER NOT NULL,
        is_game_over INTEGER NOT NULL DEFAULT 0 CHECK(is_game_over IN (0, 1))
      )
    `).run();
        this.db.prepare('INSERT OR IGNORE INTO game_state (id, "current_date", season, is_game_over) VALUES (1, ?, ?, 0)').run(DEFAULT_START_DATE, DEFAULT_START_SEASON);
        this.ensureRiderDailyStateTable();
    }
    ensureRiderDailyStateTable() {
        this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_daily_state (
        rider_id INTEGER PRIMARY KEY REFERENCES riders(id) ON DELETE CASCADE,
        season INTEGER NOT NULL,
        form_bonus REAL NOT NULL DEFAULT -1.0,
        peak_dates_json TEXT NOT NULL DEFAULT '[]',
        health_status TEXT NOT NULL DEFAULT 'healthy' CHECK(health_status IN ('healthy', 'ill', 'injured')),
        unavailable_until TEXT,
        unavailable_days_remaining INTEGER NOT NULL DEFAULT 0 CHECK(unavailable_days_remaining >= 0)
      )
    `).run();
    }
    ensureRiderDailyStateRows(season) {
        if (!tableExists(this.db, 'riders')) {
            return;
        }
        const riderRows = this.db.prepare('SELECT id FROM riders WHERE is_retired = 0').all();
        const selectState = this.db.prepare(`
      SELECT rider_id, season, form_bonus, peak_dates_json, health_status, unavailable_until, unavailable_days_remaining
      FROM rider_daily_state
      WHERE rider_id = ?
    `);
        const insertState = this.db.prepare(`
      INSERT INTO rider_daily_state (
        rider_id, season, form_bonus, peak_dates_json, health_status, unavailable_until, unavailable_days_remaining
      ) VALUES (?, ?, ?, ?, 'healthy', NULL, 0)
    `);
        for (const rider of riderRows) {
            const existing = selectState.get(rider.id);
            if (!existing) {
                insertState.run(rider.id, season, FORM_MIN_BONUS, JSON.stringify(generateSeasonPeakDates(season)));
            }
        }
    }
    advanceRiderDailyStates(nextDate, nextSeason) {
        if (!tableExists(this.db, 'rider_daily_state')) {
            return;
        }
        this.ensureRiderDailyStateRows(nextSeason);
        const rows = this.db.prepare(`
      SELECT rider_id, season, form_bonus, peak_dates_json, health_status, unavailable_until, unavailable_days_remaining
      FROM rider_daily_state
    `).all();
        const updateState = this.db.prepare(`
      UPDATE rider_daily_state
      SET season = ?,
          form_bonus = ?,
          peak_dates_json = ?,
          health_status = ?,
          unavailable_until = ?,
          unavailable_days_remaining = ?
      WHERE rider_id = ?
    `);
        for (const row of rows) {
            const seasonChanged = row.season !== nextSeason;
            const peakDates = seasonChanged ? generateSeasonPeakDates(nextSeason) : parsePeakDates(row.peak_dates_json);
            let formBonus = seasonChanged ? FORM_MIN_BONUS : row.form_bonus;
            let healthStatus = row.health_status;
            let remainingDays = row.unavailable_days_remaining;
            let unavailableUntil = row.unavailable_until;
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
            if (isWithinPeakDeclineWindow(nextDate, peakDates)) {
                formBonus = roundFormBonus(Math.max(0, formBonus - FORM_FALL_STEP));
            }
            else if (healthStatus === 'healthy' && isWithinPeakBuildWindow(nextDate, peakDates)) {
                formBonus = roundFormBonus(Math.min(FORM_MAX_BONUS, formBonus + FORM_RISE_STEP));
            }
            updateState.run(nextSeason, formBonus, JSON.stringify(peakDates), healthStatus, unavailableUntil, remainingDays, row.rider_id);
        }
        this.removeUnavailableRidersFromFutureRaceEntries(nextDate);
    }
    removeUnavailableRidersFromFutureRaceEntries(currentDate) {
        if (!tableExists(this.db, 'race_entries') || !tableExists(this.db, 'stages') || !tableExists(this.db, 'results')) {
            return;
        }
        this.db.prepare(`
      DELETE FROM race_entries
      WHERE rider_id IN (
        SELECT rider_id
        FROM rider_daily_state
        WHERE unavailable_days_remaining > 0
      )
        AND race_id IN (
          SELECT DISTINCT stage_races.id
          FROM races stage_races
          WHERE EXISTS (
            SELECT 1
            FROM stages remaining_stage
            WHERE remaining_stage.race_id = stage_races.id
              AND remaining_stage.date >= ?
              AND NOT EXISTS (
                SELECT 1
                FROM results remaining_result
                WHERE remaining_result.stage_id = remaining_stage.id
                  AND remaining_result.result_type_id = 1
              )
          )
        )
    `).run(currentDate);
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
function isWithinPeakBuildWindow(currentDate, peakDates) {
    const currentDay = isoDateToDayNumber(currentDate);
    return peakDates.some((peakDate) => {
        const peakDay = isoDateToDayNumber(peakDate);
        return currentDay >= peakDay - FORM_RISE_DAYS && currentDay < peakDay;
    });
}
function isWithinPeakDeclineWindow(currentDate, peakDates) {
    const currentDay = isoDateToDayNumber(currentDate);
    return peakDates.some((peakDate) => {
        const peakDay = isoDateToDayNumber(peakDate);
        return currentDay >= peakDay && currentDay < peakDay + FORM_FALL_DAYS;
    });
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
