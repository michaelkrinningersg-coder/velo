import Database from 'better-sqlite3';
import { EventEmitter } from 'events';
import { GameState, GameStatus, PendingStage } from '../../../shared/types';

const DEFAULT_START_DATE = '2026-01-01';
const DEFAULT_START_SEASON = 2026;

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
  details_csv_file: string;
  is_stage_race: number;
}

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName) as { name: string } | undefined;
  return row != null;
}

export class GameStateService {
  private readonly db: Database.Database;
  private readonly events = new EventEmitter();

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
    const state = this.loadState();
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
      const checks = this.runDailyChecks(nextDate);

      this.db.prepare(
        'UPDATE game_state SET "current_date" = ?, season = ?, is_game_over = ? WHERE id = 1',
      ).run(nextDate, nextSeason, currentRow.is_game_over);
      this.db.prepare(`
        INSERT INTO career_meta (key, value) VALUES ('current_season', ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `).run(String(nextSeason));

      return this.mapState({ current_date: nextDate, season: nextSeason, is_game_over: currentRow.is_game_over }, checks);
    })();

    this.events.emit('dayAdvanced', nextState);
    return nextState;
  }

  public onDayAdvanced(listener: DayAdvancedListener): () => void {
    this.events.on('dayAdvanced', listener);
    return () => this.events.off('dayAdvanced', listener);
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
        `).all(currentDate) as PendingStageRow[]
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
        `).all(currentDate) as PendingStageRow[];

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
