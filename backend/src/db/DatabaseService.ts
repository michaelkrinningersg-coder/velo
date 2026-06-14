import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { DEFAULT_SKILL_WEIGHT_RULES } from '../../../shared/skillWeights';
import { SavegameMeta } from '../../../shared/types';
import { bootstrap } from '../bootstrapper';
import { ContractService } from '../game/ContractService';
import { GameStateService } from '../game/GameStateService';
import { RiderProgramService } from '../game/RiderProgramService';

const MASTER_DB_NAME = 'world_data.db';
const RESULT_TYPE_ROWS = [
  { id: 1, name: 'Stage' },
  { id: 2, name: 'GC' },
  { id: 3, name: 'Points' },
  { id: 4, name: 'Mountain' },
  { id: 5, name: 'Youth' },
  { id: 6, name: 'Team' },
] as const;

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName) as { name: string } | undefined;
  return row != null;
}

function columnExists(db: Database.Database, tableName: string, columnName: string): boolean {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
  return columns.some((column) => column.name === columnName);
}

function resolveAssetsDir(): string {
  const candidates = [
    path.resolve(__dirname, '..', '..', 'assets'),
    path.resolve(__dirname, '..', '..', '..', 'assets'),
    path.resolve(__dirname, '..', '..', '..', '..', 'assets'),
    path.resolve(process.cwd(), 'assets'),
    path.resolve(process.cwd(), 'backend', 'assets'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'schema.sql'))) {
      return candidate;
    }
  }

  throw new Error('Konnte backend/assets mit schema.sql nicht finden.');
}

export class DatabaseService {
  private readonly masterDbPath: string;
  private readonly schemaPath: string;
  private readonly savegamesDir: string;
  private activeConnection: Database.Database | null = null;
  private activeSaveName: string | null = null;

  constructor() {
    const assetsDir = resolveAssetsDir();
    this.masterDbPath = (process as any).pkg
      ? path.join(path.dirname(process.execPath), MASTER_DB_NAME)
      : path.join(assetsDir, MASTER_DB_NAME);
    this.schemaPath = path.join(assetsDir, 'schema.sql');
    this.savegamesDir = process.env['SAVEGAME_DIR']
      ?? path.join(os.homedir(), '.velo', 'savegames');
    this.ensureSavegamesDir();
  }

  private applyLatestSchema(db: Database.Database): void {
    const schema = fs.readFileSync(this.schemaPath, 'utf8');
    db.exec(schema);
  }

  private ensureReferenceData(db: Database.Database): void {
    if (!tableExists(db, 'result_types')) {
      return;
    }

    const insert = db.prepare('INSERT OR IGNORE INTO result_types (id, name) VALUES (?, ?)');
    db.transaction(() => {
      for (const row of RESULT_TYPE_ROWS) {
        insert.run(row.id, row.name);
      }
    })();
  }

  private ensureRaceCategoryBonusSchema(db: Database.Database): void {
    if (!tableExists(db, 'race_categories_bonus')) {
      return;
    }

    const missingColumns = [
      ['points_sprint_finish', "TEXT NOT NULL DEFAULT ''"],
      ['points_mountainstage', "TEXT NOT NULL DEFAULT ''"],
    ] as const;

    for (const [columnName, columnDefinition] of missingColumns) {
      if (!columnExists(db, 'race_categories_bonus', columnName)) {
        db.prepare(`
          ALTER TABLE race_categories_bonus
          ADD COLUMN ${columnName} ${columnDefinition}
        `).run();
      }
    }

    if (!fs.existsSync(this.masterDbPath)) {
      return;
    }

    const masterDb = new Database(this.masterDbPath, { readonly: true });
    try {
      if (!tableExists(masterDb, 'race_categories_bonus') || !columnExists(masterDb, 'race_categories_bonus', 'points_sprint_finish')) {
        return;
      }

      const hasMountainStagePoints = columnExists(masterDb, 'race_categories_bonus', 'points_mountainstage');

      const rows = masterDb.prepare(`
        SELECT id, points_sprint_finish, ${hasMountainStagePoints ? 'points_mountainstage' : "'' AS points_mountainstage"}
        FROM race_categories_bonus
      `).all() as Array<{ id: number; points_sprint_finish: string; points_mountainstage: string }>;

      const update = db.prepare(`
        UPDATE race_categories_bonus
        SET points_sprint_finish = ?, points_mountainstage = ?
        WHERE id = ?
      `);

      db.transaction(() => {
        for (const row of rows) {
          update.run(row.points_sprint_finish, row.points_mountainstage, row.id);
        }
      })();
    } finally {
      masterDb.close();
    }
  }

  private ensureRulesData(db: Database.Database): void {
    if (!tableExists(db, 'rules')) {
      return;
    }

    const existingCount = db.prepare('SELECT COUNT(*) AS count FROM rules').get() as { count: number } | undefined;
    if ((existingCount?.count ?? 0) > 0) {
      return;
    }

    if (!fs.existsSync(this.masterDbPath)) {
      return;
    }

    const masterDb = new Database(this.masterDbPath, { readonly: true });
    try {
      if (!tableExists(masterDb, 'rules')) {
        return;
      }

      const rows = masterDb.prepare(`
        SELECT id,
               rule_key,
               applies_to,
               marker_type,
               marker_category,
               weight_flat,
               weight_mountain,
               weight_medium_mountain,
               weight_hill,
               weight_time_trial,
               weight_prologue,
               weight_cobble,
               weight_sprint,
               weight_acceleration,
               weight_downhill,
               weight_attack,
               weight_stamina,
               weight_resistance,
               weight_recuperation,
               weight_bike_handling
        FROM rules
      `).all() as Array<{
        id: number;
        rule_key: string;
        applies_to: string;
        marker_type: string;
        marker_category: string | null;
        weight_flat: number;
        weight_mountain: number;
        weight_medium_mountain: number;
        weight_hill: number;
        weight_time_trial: number;
        weight_prologue: number;
        weight_cobble: number;
        weight_sprint: number;
        weight_acceleration: number;
        weight_downhill: number;
        weight_attack: number;
        weight_stamina: number;
        weight_resistance: number;
        weight_recuperation: number;
        weight_bike_handling: number;
      }>;

      const insert = db.prepare(`
        INSERT OR REPLACE INTO rules (
          id, rule_key, applies_to, marker_type, marker_category,
          weight_flat, weight_mountain, weight_medium_mountain, weight_hill,
          weight_time_trial, weight_prologue, weight_cobble, weight_sprint,
          weight_acceleration, weight_downhill, weight_attack, weight_stamina,
          weight_resistance, weight_recuperation, weight_bike_handling
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      db.transaction(() => {
        for (const row of rows) {
          insert.run(
            row.id,
            row.rule_key,
            row.applies_to,
            row.marker_type,
            row.marker_category,
            row.weight_flat,
            row.weight_mountain,
            row.weight_medium_mountain,
            row.weight_hill,
            row.weight_time_trial,
            row.weight_prologue,
            row.weight_cobble,
            row.weight_sprint,
            row.weight_acceleration,
            row.weight_downhill,
            row.weight_attack,
            row.weight_stamina,
            row.weight_resistance,
            row.weight_recuperation,
            row.weight_bike_handling,
          );
        }
      })();
    } finally {
      masterDb.close();
    }
  }

  private ensureSkillWeightsData(db: Database.Database): void {
    if (!tableExists(db, 'skill_weights')) {
      return;
    }

    const missingColumns = [
      ['ttt_speed_multiplier', 'REAL NOT NULL DEFAULT 1 CHECK(ttt_speed_multiplier > 0)'],
      ['final_spread_late_multiplier', 'REAL NOT NULL DEFAULT 1 CHECK(final_spread_late_multiplier > 0)'],
      ['final_spread_peak_multiplier', 'REAL NOT NULL DEFAULT 1 CHECK(final_spread_peak_multiplier > 0)'],
    ] as const;

    for (const [columnName, columnDefinition] of missingColumns) {
      if (!columnExists(db, 'skill_weights', columnName)) {
        db.prepare(`
          ALTER TABLE skill_weights
          ADD COLUMN ${columnName} ${columnDefinition}
        `).run();
      }
    }

    const existingCount = db.prepare('SELECT COUNT(*) AS count FROM skill_weights').get() as { count: number } | undefined;
    const fallbackRuleByKey = new Map<string, (typeof DEFAULT_SKILL_WEIGHT_RULES)[number]>(
      DEFAULT_SKILL_WEIGHT_RULES.map((rule) => [`${rule.simulationMode}:${rule.terrain}`, rule] as const),
    );

    const updateMultiplier = db.prepare(`
      UPDATE skill_weights
      SET ttt_speed_multiplier = ?,
          final_spread_late_multiplier = ?,
          final_spread_peak_multiplier = ?
      WHERE simulation_mode = ? AND terrain = ?
    `);

    const applyMultiplierFallbacks = (rows: Array<{
      simulation_mode: string;
      terrain: string;
      ttt_speed_multiplier?: number;
      final_spread_late_multiplier?: number;
      final_spread_peak_multiplier?: number;
    }>): void => {
      db.transaction(() => {
        for (const row of rows) {
          const key = `${row.simulation_mode}:${row.terrain}`;
          const fallbackRule = fallbackRuleByKey.get(key);
          updateMultiplier.run(
            row.ttt_speed_multiplier ?? fallbackRule?.tttSpeedMultiplier ?? 1,
            row.final_spread_late_multiplier ?? fallbackRule?.finalSpreadLateMultiplier ?? 1,
            row.final_spread_peak_multiplier ?? fallbackRule?.finalSpreadPeakMultiplier ?? 1,
            row.simulation_mode,
            row.terrain,
          );
        }
      })();
    };

    if ((existingCount?.count ?? 0) > 0) {
      if (fs.existsSync(this.masterDbPath)) {
        const masterDb = new Database(this.masterDbPath, { readonly: true });
        try {
          if (tableExists(masterDb, 'skill_weights')) {
            const masterHasMultiplierColumn = columnExists(masterDb, 'skill_weights', 'ttt_speed_multiplier');
            const masterHasLateSpreadColumn = columnExists(masterDb, 'skill_weights', 'final_spread_late_multiplier');
            const masterHasPeakSpreadColumn = columnExists(masterDb, 'skill_weights', 'final_spread_peak_multiplier');
            const masterRows = masterDb.prepare(`
              SELECT simulation_mode,
                     terrain${masterHasMultiplierColumn ? ', ttt_speed_multiplier' : ''}${masterHasLateSpreadColumn ? ', final_spread_late_multiplier' : ''}${masterHasPeakSpreadColumn ? ', final_spread_peak_multiplier' : ''}
              FROM skill_weights
            `).all() as Array<{
              simulation_mode: string;
              terrain: string;
              ttt_speed_multiplier?: number;
              final_spread_late_multiplier?: number;
              final_spread_peak_multiplier?: number;
            }>;
            applyMultiplierFallbacks(masterRows);
            return;
          }
        } finally {
          masterDb.close();
        }
      }

      applyMultiplierFallbacks(DEFAULT_SKILL_WEIGHT_RULES.map((rule) => ({
        simulation_mode: rule.simulationMode,
        terrain: rule.terrain,
        ttt_speed_multiplier: rule.tttSpeedMultiplier,
        final_spread_late_multiplier: rule.finalSpreadLateMultiplier,
        final_spread_peak_multiplier: rule.finalSpreadPeakMultiplier,
      })));
      return;
    }

    if (!fs.existsSync(this.masterDbPath)) {
      return;
    }

    const masterDb = new Database(this.masterDbPath, { readonly: true });
    try {
      if (!tableExists(masterDb, 'skill_weights')) {
        return;
      }

      const rows = masterDb.prepare(`
        SELECT id,
               simulation_mode,
               terrain,
               weight_flat,
               weight_mountain,
               weight_medium_mountain,
               weight_hill,
               weight_time_trial,
               weight_prologue,
               weight_cobble,
               weight_sprint,
               weight_acceleration,
               weight_downhill,
               weight_attack,
               weight_stamina,
               weight_resistance,
               weight_recuperation,
               weight_bike_handling,
               ${columnExists(masterDb, 'skill_weights', 'final_spread_late_multiplier') ? 'final_spread_late_multiplier' : '1 AS final_spread_late_multiplier'},
               ${columnExists(masterDb, 'skill_weights', 'final_spread_peak_multiplier') ? 'final_spread_peak_multiplier' : '1 AS final_spread_peak_multiplier'},
               ${columnExists(masterDb, 'skill_weights', 'ttt_speed_multiplier') ? 'ttt_speed_multiplier' : '1 AS ttt_speed_multiplier'}
        FROM skill_weights
      `).all() as Array<{
        id: number;
        simulation_mode: string;
        terrain: string;
        weight_flat: number;
        weight_mountain: number;
        weight_medium_mountain: number;
        weight_hill: number;
        weight_time_trial: number;
        weight_prologue: number;
        weight_cobble: number;
        weight_sprint: number;
        weight_acceleration: number;
        weight_downhill: number;
        weight_attack: number;
        weight_stamina: number;
        weight_resistance: number;
        weight_recuperation: number;
        weight_bike_handling: number;
        final_spread_late_multiplier: number;
        final_spread_peak_multiplier: number;
        ttt_speed_multiplier: number;
      }>;

      const insert = db.prepare(`
        INSERT OR REPLACE INTO skill_weights (
          id, simulation_mode, terrain,
          weight_flat, weight_mountain, weight_medium_mountain, weight_hill, weight_time_trial,
          weight_prologue, weight_cobble, weight_sprint, weight_acceleration, weight_downhill,
          weight_attack, weight_stamina, weight_resistance, weight_recuperation, weight_bike_handling,
          final_spread_late_multiplier, final_spread_peak_multiplier,
          ttt_speed_multiplier
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      db.transaction(() => {
        for (const row of rows) {
          insert.run(
            row.id,
            row.simulation_mode,
            row.terrain,
            row.weight_flat,
            row.weight_mountain,
            row.weight_medium_mountain,
            row.weight_hill,
            row.weight_time_trial,
            row.weight_prologue,
            row.weight_cobble,
            row.weight_sprint,
            row.weight_acceleration,
            row.weight_downhill,
            row.weight_attack,
            row.weight_stamina,
            row.weight_resistance,
            row.weight_recuperation,
            row.weight_bike_handling,
            row.final_spread_late_multiplier ?? fallbackRuleByKey.get(`${row.simulation_mode}:${row.terrain}`)?.finalSpreadLateMultiplier ?? 1,
            row.final_spread_peak_multiplier ?? fallbackRuleByKey.get(`${row.simulation_mode}:${row.terrain}`)?.finalSpreadPeakMultiplier ?? 1,
            row.ttt_speed_multiplier ?? fallbackRuleByKey.get(`${row.simulation_mode}:${row.terrain}`)?.tttSpeedMultiplier ?? 1,
          );
        }
      })();
    } finally {
      masterDb.close();
    }
  }

  private ensureStageSpreadData(db: Database.Database): void {
    if (!tableExists(db, 'stages')) {
      return;
    }

    const missingColumns = [
      ['final_spread_start_percent', 'REAL NOT NULL DEFAULT 70 CHECK(final_spread_start_percent BETWEEN 0 AND 100)'],
      ['final_push_start_percent', 'REAL NOT NULL DEFAULT 90 CHECK(final_push_start_percent BETWEEN 0 AND 100)'],
      ['final_spread_difficulty_multiplier', 'REAL NOT NULL DEFAULT 1 CHECK(final_spread_difficulty_multiplier > 0)'],
      ['crash_incident_multiplier', 'REAL NOT NULL DEFAULT 1 CHECK(crash_incident_multiplier > 0)'],
      ['mechanical_incident_multiplier', 'REAL NOT NULL DEFAULT 1 CHECK(mechanical_incident_multiplier > 0)'],
      ['stage_score', 'INTEGER NOT NULL DEFAULT 0 CHECK(stage_score BETWEEN 0 AND 1000)'],
    ] as const;

    for (const [columnName, columnDefinition] of missingColumns) {
      if (!columnExists(db, 'stages', columnName)) {
        db.prepare(`
          ALTER TABLE stages
          ADD COLUMN ${columnName} ${columnDefinition}
        `).run();
      }
    }

    if (!fs.existsSync(this.masterDbPath)) {
      return;
    }

    const existingCount = db.prepare('SELECT COUNT(*) AS count FROM stages').get() as { count: number } | undefined;
    if ((existingCount?.count ?? 0) <= 0) {
      return;
    }

    const masterDb = new Database(this.masterDbPath, { readonly: true });
    try {
      if (!tableExists(masterDb, 'stages')) {
        return;
      }

      const rows = masterDb.prepare(`
        SELECT id,
               ${columnExists(masterDb, 'stages', 'final_spread_start_percent') ? 'final_spread_start_percent' : '70 AS final_spread_start_percent'},
               ${columnExists(masterDb, 'stages', 'final_push_start_percent') ? 'final_push_start_percent' : '90 AS final_push_start_percent'},
               ${columnExists(masterDb, 'stages', 'final_spread_difficulty_multiplier') ? 'final_spread_difficulty_multiplier' : '1 AS final_spread_difficulty_multiplier'},
               ${columnExists(masterDb, 'stages', 'crash_incident_multiplier') ? 'crash_incident_multiplier' : '1 AS crash_incident_multiplier'},
               ${columnExists(masterDb, 'stages', 'mechanical_incident_multiplier') ? 'mechanical_incident_multiplier' : '1 AS mechanical_incident_multiplier'},
               ${columnExists(masterDb, 'stages', 'stage_score') ? 'stage_score' : '0 AS stage_score'}
        FROM stages
      `).all() as Array<{
        id: number;
        final_spread_start_percent: number;
        final_push_start_percent: number;
        final_spread_difficulty_multiplier: number;
        crash_incident_multiplier: number;
        mechanical_incident_multiplier: number;
        stage_score: number;
      }>;

      const update = db.prepare(`
        UPDATE stages
        SET final_spread_start_percent = ?,
            final_push_start_percent = ?,
            final_spread_difficulty_multiplier = ?,
            crash_incident_multiplier = ?,
            mechanical_incident_multiplier = ?,
            stage_score = ?
        WHERE id = ?
      `);

      db.transaction(() => {
        for (const row of rows) {
          update.run(
            row.final_spread_start_percent ?? 70,
            row.final_push_start_percent ?? 90,
            row.final_spread_difficulty_multiplier ?? 1,
            row.crash_incident_multiplier ?? 1,
            row.mechanical_incident_multiplier ?? 1,
            row.stage_score ?? 0,
            row.id,
          );
        }
      })();
    } finally {
      masterDb.close();
    }
  }

  private ensureStageRaceStateSchema(db: Database.Database): void {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_stage_race_state (
        race_id INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        accumulated_random_fatigue REAL NOT NULL DEFAULT 0,
        last_applied_stage_number INTEGER NOT NULL DEFAULT 0,
        incident_day_form_penalty REAL NOT NULL DEFAULT 0,
        incident_micro_form_penalty REAL NOT NULL DEFAULT 0,
        incident_stamina_penalty REAL NOT NULL DEFAULT 0,
        incident_day_form_cap REAL,
        race_recuperation_penalty REAL NOT NULL DEFAULT 0,
        current_recovery_penalty REAL NOT NULL DEFAULT 0,
        pending_recovery_penalty_1 REAL NOT NULL DEFAULT 0,
        pending_recovery_penalty_2 REAL NOT NULL DEFAULT 0,
        pending_recovery_penalty_3 REAL NOT NULL DEFAULT 0,
        PRIMARY KEY (race_id, rider_id)
      )
    `).run();

    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_rider_stage_race_state_race
      ON rider_stage_race_state(race_id, rider_id)
    `).run();

    const missingColumns = [
      ['incident_day_form_penalty', 'REAL NOT NULL DEFAULT 0'],
      ['incident_micro_form_penalty', 'REAL NOT NULL DEFAULT 0'],
      ['incident_stamina_penalty', 'REAL NOT NULL DEFAULT 0'],
      ['incident_day_form_cap', 'REAL'],
      ['race_recuperation_penalty', 'REAL NOT NULL DEFAULT 0'],
      ['current_recovery_penalty', 'REAL NOT NULL DEFAULT 0'],
      ['pending_recovery_penalty_1', 'REAL NOT NULL DEFAULT 0'],
      ['pending_recovery_penalty_2', 'REAL NOT NULL DEFAULT 0'],
      ['pending_recovery_penalty_3', 'REAL NOT NULL DEFAULT 0'],
    ] as const;

    for (const [columnName, columnDefinition] of missingColumns) {
      if (!columnExists(db, 'rider_stage_race_state', columnName)) {
        db.prepare(`
          ALTER TABLE rider_stage_race_state
          ADD COLUMN ${columnName} ${columnDefinition}
        `).run();
      }
    }
  }

  private ensureResultsSchema(db: Database.Database): void {
    if (!tableExists(db, 'results')) {
      return;
    }

    if (!columnExists(db, 'results', 'is_breakaway')) {
      db.prepare(`
        ALTER TABLE results
        ADD COLUMN is_breakaway INTEGER NOT NULL DEFAULT 0 CHECK(is_breakaway IN (0, 1))
      `).run();
    }

    if (!columnExists(db, 'results', 'leadout_rider_id')) {
      db.prepare(`
        ALTER TABLE results
        ADD COLUMN leadout_rider_id INTEGER REFERENCES riders(id) ON DELETE SET NULL
      `).run();
    }

    if (!columnExists(db, 'results', 'leadout_bonus')) {
      db.prepare(`
        ALTER TABLE results
        ADD COLUMN leadout_bonus REAL
      `).run();
    }

    const row = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'results'").get() as { sql: string | null } | undefined;
    const createSql = row?.sql ?? '';
    const needsMigration = createSql.includes('(result_type_id = 6 AND rider_id IS NULL AND team_id IS NOT NULL)')
      || createSql.includes('(result_type_id != 6 AND rider_id IS NOT NULL AND team_id IS NOT NULL)')
      || createSql.includes('(result_type_id IN (1, 6) AND rider_id IS NULL AND team_id IS NOT NULL)')
      || createSql.includes('(result_type_id NOT IN (1, 6) AND rider_id IS NOT NULL AND team_id IS NOT NULL)');

    if (!needsMigration) {
      return;
    }

    db.transaction(() => {
      db.exec(`
        CREATE TABLE results_new (
          id               INTEGER PRIMARY KEY AUTOINCREMENT,
          race_id          INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
          stage_id         INTEGER NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
          rider_id         INTEGER REFERENCES riders(id) ON DELETE CASCADE,
          team_id          INTEGER REFERENCES teams(id) ON DELETE CASCADE,
          result_type_id   INTEGER NOT NULL REFERENCES result_types(id),
          rank             INTEGER NOT NULL CHECK(rank > 0),
          time_seconds     INTEGER,
          points           INTEGER,
          is_breakaway     INTEGER NOT NULL DEFAULT 0 CHECK(is_breakaway IN (0, 1)),
          leadout_rider_id INTEGER REFERENCES riders(id) ON DELETE SET NULL,
          leadout_bonus    REAL,
          CHECK(
            (result_type_id = 1 AND team_id IS NOT NULL)
            OR
            (result_type_id = 6 AND rider_id IS NULL AND team_id IS NOT NULL)
            OR
            (result_type_id NOT IN (1, 6) AND rider_id IS NOT NULL AND team_id IS NOT NULL)
          )
        );

        INSERT INTO results_new (
          id, race_id, stage_id, rider_id, team_id, result_type_id, rank, time_seconds, points, is_breakaway, leadout_rider_id, leadout_bonus
        )
        SELECT
          id, race_id, stage_id, rider_id, team_id, result_type_id, rank, time_seconds, points, is_breakaway, leadout_rider_id, leadout_bonus
        FROM results;

        DROP TABLE results;
        ALTER TABLE results_new RENAME TO results;

        CREATE UNIQUE INDEX IF NOT EXISTS idx_results_stage_rider_type
          ON results(stage_id, rider_id, result_type_id)
          WHERE rider_id IS NOT NULL;
      `);
    })();
  }

  private ensureRiderFormSchema(db: Database.Database): void {
    if (tableExists(db, 'rider_daily_state')) {
      if (!columnExists(db, 'rider_daily_state', 'race_form_bonus')) {
        db.prepare(`
          ALTER TABLE rider_daily_state
          ADD COLUMN race_form_bonus REAL NOT NULL DEFAULT 0.0
        `).run();
      }
      if (!columnExists(db, 'rider_daily_state', 'peak_s_form')) {
        db.prepare(`
          ALTER TABLE rider_daily_state
          ADD COLUMN peak_s_form REAL NOT NULL DEFAULT 0.0
        `).run();
      }
      if (!columnExists(db, 'rider_daily_state', 'peak_r_form')) {
        db.prepare(`
          ALTER TABLE rider_daily_state
          ADD COLUMN peak_r_form REAL NOT NULL DEFAULT 0.0
        `).run();
      }
      if (!columnExists(db, 'rider_daily_state', 'active_peak_date')) {
        db.prepare(`
          ALTER TABLE rider_daily_state
          ADD COLUMN active_peak_date TEXT
        `).run();
      }
      if (!columnExists(db, 'rider_daily_state', 'season_race_days_total')) {
        db.prepare(`
          ALTER TABLE rider_daily_state
          ADD COLUMN season_race_days_total INTEGER NOT NULL DEFAULT 0
        `).run();
      }
      if (!columnExists(db, 'rider_daily_state', 'rolling_30d_race_days')) {
        db.prepare(`
          ALTER TABLE rider_daily_state
          ADD COLUMN rolling_30d_race_days INTEGER NOT NULL DEFAULT 0
        `).run();
      }
    }

    db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_r_form_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        source_date TEXT NOT NULL,
        expires_on TEXT NOT NULL,
        amount REAL NOT NULL CHECK(amount >= 0),
        event_type TEXT NOT NULL CHECK(event_type IN ('race_day'))
      )
    `).run();

    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_rider_r_form_events_rider_date
      ON rider_r_form_events(rider_id, source_date, expires_on)
    `).run();

    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_rider_r_form_events_expires_on
      ON rider_r_form_events(expires_on)
    `).run();

    db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_form_history (
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        date TEXT NOT NULL,
        s_form REAL NOT NULL,
        r_form REAL NOT NULL,
        total_form REAL NOT NULL,
        PRIMARY KEY (rider_id, date)
      )
    `).run();

    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_rider_form_history_date
      ON rider_form_history(date, rider_id)
    `).run();

    if (tableExists(db, 'rider_daily_state')) {
      db.prepare(`
        UPDATE rider_daily_state
        SET form_bonus = 0
        WHERE form_bonus = -1
      `).run();
    }

    db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_r_form_daily_awards (
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        award_date TEXT NOT NULL,
        award_type TEXT NOT NULL CHECK(award_type IN ('build', 'free')),
        PRIMARY KEY (rider_id, award_date)
      )
    `).run();
  }

  private ensureRiderCareerStatsSchema(db: Database.Database): void {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_career_stats (
        rider_id INTEGER PRIMARY KEY REFERENCES riders(id) ON DELETE CASCADE,
        breakaway_attempts INTEGER NOT NULL DEFAULT 0,
        attacks INTEGER NOT NULL DEFAULT 0,
        counter_attacks INTEGER NOT NULL DEFAULT 0,
        crashes INTEGER NOT NULL DEFAULT 0,
        defects INTEGER NOT NULL DEFAULT 0,
        illnesses INTEGER NOT NULL DEFAULT 0,
        illness_days INTEGER NOT NULL DEFAULT 0,
        injuries INTEGER NOT NULL DEFAULT 0,
        injury_days INTEGER NOT NULL DEFAULT 0
      )
    `).run();

    if (!columnExists(db, 'rider_career_stats', 'illnesses')) {
      db.prepare('ALTER TABLE rider_career_stats ADD COLUMN illnesses INTEGER NOT NULL DEFAULT 0').run();
    }
    if (!columnExists(db, 'rider_career_stats', 'illness_days')) {
      db.prepare('ALTER TABLE rider_career_stats ADD COLUMN illness_days INTEGER NOT NULL DEFAULT 0').run();
    }
    if (!columnExists(db, 'rider_career_stats', 'injuries')) {
      db.prepare('ALTER TABLE rider_career_stats ADD COLUMN injuries INTEGER NOT NULL DEFAULT 0').run();
    }
    if (!columnExists(db, 'rider_career_stats', 'injury_days')) {
      db.prepare('ALTER TABLE rider_career_stats ADD COLUMN injury_days INTEGER NOT NULL DEFAULT 0').run();
    }
  }

  private ensureRaceProgramSchema(db: Database.Database): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS race_programs (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        peak1_min INTEGER NOT NULL DEFAULT 1 CHECK(peak1_min BETWEEN 1 AND 53),
        peak1_max INTEGER NOT NULL DEFAULT 1 CHECK(peak1_max BETWEEN 1 AND 53),
        peak2_min INTEGER NOT NULL DEFAULT 1 CHECK(peak2_min BETWEEN 1 AND 53),
        peak2_max INTEGER NOT NULL DEFAULT 1 CHECK(peak2_max BETWEEN 1 AND 53),
        peak3_min INTEGER NOT NULL DEFAULT 1 CHECK(peak3_min BETWEEN 1 AND 53),
        peak3_max INTEGER NOT NULL DEFAULT 1 CHECK(peak3_max BETWEEN 1 AND 53),
        CHECK(peak1_min <= peak1_max),
        CHECK(peak2_min <= peak2_max),
        CHECK(peak3_min <= peak3_max)
      );

      CREATE TABLE IF NOT EXISTS race_program_races (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        program_id INTEGER NOT NULL REFERENCES race_programs(id) ON DELETE CASCADE,
        race_id INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
        UNIQUE(program_id, race_id)
      );

      CREATE INDEX IF NOT EXISTS idx_race_program_races_race
        ON race_program_races(race_id, program_id);

      CREATE TABLE IF NOT EXISTS race_program_probability_rules (
        id INTEGER PRIMARY KEY,
        role_name TEXT NOT NULL,
        spec_1 INTEGER REFERENCES type_rider(id),
        spec_2 INTEGER REFERENCES type_rider(id),
        spec_3 INTEGER REFERENCES type_rider(id),
        program_id INTEGER NOT NULL REFERENCES race_programs(id) ON DELETE CASCADE,
        probability REAL NOT NULL CHECK(probability >= 0)
      );

      CREATE INDEX IF NOT EXISTS idx_race_program_probability_rules_lookup
        ON race_program_probability_rules(role_name, spec_1, spec_2, spec_3);

      CREATE TABLE IF NOT EXISTS rider_season_programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        season INTEGER NOT NULL,
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        program_id INTEGER NOT NULL REFERENCES race_programs(id),
        assigned_on TEXT NOT NULL,
        UNIQUE(season, rider_id)
      );

      CREATE INDEX IF NOT EXISTS idx_rider_season_programs_program
        ON rider_season_programs(season, program_id);
    `);

    if (!columnExists(db, 'race_programs', 'peak1_min')) {
      db.prepare('ALTER TABLE race_programs ADD COLUMN peak1_min INTEGER NOT NULL DEFAULT 1 CHECK(peak1_min BETWEEN 1 AND 53)').run();
    }
    if (!columnExists(db, 'race_programs', 'peak1_max')) {
      db.prepare('ALTER TABLE race_programs ADD COLUMN peak1_max INTEGER NOT NULL DEFAULT 1 CHECK(peak1_max BETWEEN 1 AND 53)').run();
    }
    if (!columnExists(db, 'race_programs', 'peak2_min')) {
      db.prepare('ALTER TABLE race_programs ADD COLUMN peak2_min INTEGER NOT NULL DEFAULT 1 CHECK(peak2_min BETWEEN 1 AND 53)').run();
    }
    if (!columnExists(db, 'race_programs', 'peak2_max')) {
      db.prepare('ALTER TABLE race_programs ADD COLUMN peak2_max INTEGER NOT NULL DEFAULT 1 CHECK(peak2_max BETWEEN 1 AND 53)').run();
    }
    if (!columnExists(db, 'race_programs', 'peak3_min')) {
      db.prepare('ALTER TABLE race_programs ADD COLUMN peak3_min INTEGER NOT NULL DEFAULT 1 CHECK(peak3_min BETWEEN 1 AND 53)').run();
    }
    if (!columnExists(db, 'race_programs', 'peak3_max')) {
      db.prepare('ALTER TABLE race_programs ADD COLUMN peak3_max INTEGER NOT NULL DEFAULT 1 CHECK(peak3_max BETWEEN 1 AND 53)').run();
    }

    const ruleColumns = db.prepare('PRAGMA table_info(race_program_probability_rules)').all() as Array<{ name: string; type: string }>;
    const specColumns = ruleColumns.filter((column) => ['spec_1', 'spec_2', 'spec_3'].includes(column.name));
    const needsRuleTableRebuild = specColumns.length !== 3 || specColumns.some((column) => column.type.toUpperCase() !== 'INTEGER');

    if (needsRuleTableRebuild) {
      db.exec(`
        DROP TABLE IF EXISTS race_program_probability_rules;

        CREATE TABLE race_program_probability_rules (
          id INTEGER PRIMARY KEY,
          role_name TEXT NOT NULL,
          spec_1 INTEGER REFERENCES type_rider(id),
          spec_2 INTEGER REFERENCES type_rider(id),
          spec_3 INTEGER REFERENCES type_rider(id),
          program_id INTEGER NOT NULL REFERENCES race_programs(id) ON DELETE CASCADE,
          probability REAL NOT NULL CHECK(probability >= 0)
        );

        CREATE INDEX IF NOT EXISTS idx_race_program_probability_rules_lookup
          ON race_program_probability_rules(role_name, spec_1, spec_2, spec_3);
      `);
    }

    if (!fs.existsSync(this.masterDbPath)) {
      return;
    }

    const masterDb = new Database(this.masterDbPath, { readonly: true });
    try {
      if (!tableExists(masterDb, 'race_programs') || !tableExists(masterDb, 'race_program_races') || !tableExists(masterDb, 'race_program_probability_rules')) {
        return;
      }

      const masterHasPeakWeeks = columnExists(masterDb, 'race_programs', 'peak1_min')
        && columnExists(masterDb, 'race_programs', 'peak1_max')
        && columnExists(masterDb, 'race_programs', 'peak2_min')
        && columnExists(masterDb, 'race_programs', 'peak2_max')
        && columnExists(masterDb, 'race_programs', 'peak3_min')
        && columnExists(masterDb, 'race_programs', 'peak3_max');

      const programs = (masterHasPeakWeeks
        ? masterDb.prepare(`
            SELECT id, name, peak1_min, peak1_max, peak2_min, peak2_max, peak3_min, peak3_max
            FROM race_programs
            ORDER BY id ASC
          `).all()
        : masterDb.prepare(`
            SELECT id,
                   name,
                   1 AS peak1_min,
                   1 AS peak1_max,
                   1 AS peak2_min,
                   1 AS peak2_max,
                   1 AS peak3_min,
                   1 AS peak3_max
            FROM race_programs
            ORDER BY id ASC
          `).all()) as Array<{
            id: number;
            name: string;
            peak1_min: number;
            peak1_max: number;
            peak2_min: number;
            peak2_max: number;
            peak3_min: number;
            peak3_max: number;
          }>;
      const programRaces = masterDb.prepare('SELECT id, program_id, race_id FROM race_program_races ORDER BY id ASC').all() as Array<{ id: number; program_id: number; race_id: number }>;
      const rules = masterDb.prepare(`
        SELECT id, role_name, spec_1, spec_2, spec_3, program_id, probability
        FROM race_program_probability_rules
        ORDER BY id ASC
      `).all() as Array<{ id: number; role_name: string; spec_1: number | null; spec_2: number | null; spec_3: number | null; program_id: number; probability: number }>;

      const insertProgram = db.prepare(`
        INSERT INTO race_programs (
          id, name, peak1_min, peak1_max, peak2_min, peak2_max, peak3_min, peak3_max
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          peak1_min = excluded.peak1_min,
          peak1_max = excluded.peak1_max,
          peak2_min = excluded.peak2_min,
          peak2_max = excluded.peak2_max,
          peak3_min = excluded.peak3_min,
          peak3_max = excluded.peak3_max
      `);
      const insertProgramRace = db.prepare('INSERT OR REPLACE INTO race_program_races (id, program_id, race_id) VALUES (?, ?, ?)');
      const insertRule = db.prepare(`
        INSERT OR REPLACE INTO race_program_probability_rules (id, role_name, spec_1, spec_2, spec_3, program_id, probability)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      db.transaction(() => {
        db.prepare('DELETE FROM race_program_probability_rules').run();
        db.prepare('DELETE FROM race_program_races').run();
        for (const program of programs) {
          insertProgram.run(
            program.id,
            program.name,
            program.peak1_min,
            program.peak1_max,
            program.peak2_min,
            program.peak2_max,
            program.peak3_min,
            program.peak3_max,
          );
        }
        for (const row of programRaces) {
          insertProgramRace.run(row.id, row.program_id, row.race_id);
        }
        for (const row of rules) {
          insertRule.run(row.id, row.role_name, row.spec_1, row.spec_2, row.spec_3, row.program_id, row.probability);
        }
      })();
    } finally {
      masterDb.close();
    }
  }

  private ensureSavegamesDir(): void {
    if (!fs.existsSync(this.savegamesDir)) {
      fs.mkdirSync(this.savegamesDir, { recursive: true });
    }
  }

  private resolveSavePath(filename: string): string {
    const safeName = path.basename(filename);
    if (safeName !== filename || !/^[\w\-]+\.db$/.test(safeName)) {
      throw new Error(
        `Ungültiger Savegame-Dateiname: "${filename}". Erlaubt: Alphanumerisch, Bindestriche, Unterstriche, Endung .db`,
      );
    }
    return path.join(this.savegamesDir, safeName);
  }

  public createNewSave(filename: string, careerName: string, teamId: number): void {
    const savePath = this.resolveSavePath(filename);

    if (fs.existsSync(savePath)) {
      throw new Error(`Savegame "${filename}" existiert bereits.`);
    }

    // Jede neue Karriere soll auf einer frisch erzeugten Master-DB basieren.
    bootstrap(true);

    if (!fs.existsSync(this.masterDbPath)) {
      throw new Error(
        `Master-Datenbank nicht gefunden unter: ${this.masterDbPath}. ` +
        'Führe zuerst den Bootstrapper aus.',
      );
    }

    const tempPath = savePath + '.tmp';
    try {
      fs.copyFileSync(this.masterDbPath, tempPath);
      fs.renameSync(tempPath, savePath);
    } catch (err) {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      throw new Error(`Fehler beim Erstellen des Savegames: ${(err as Error).message}`);
    }

    const db = new Database(savePath);
    try {
      // Spielerteam setzen
      const teamRow = db.prepare('SELECT name FROM teams WHERE id = ?').get(teamId) as { name: string } | undefined;
      if (!teamRow) throw new Error(`Team-ID ${teamId} nicht gefunden.`);
      db.prepare('UPDATE teams SET is_player_team = 0').run();
      db.prepare('UPDATE teams SET is_player_team = 1 WHERE id = ?').run(teamId);
      const teamName = teamRow.name;

      const gss = new GameStateService(db);
      const gameState = gss.ensureState();
      new RiderProgramService(db).ensureSeasonPrograms(gameState.season, gameState.currentDate);
      db.prepare(`
        INSERT OR REPLACE INTO career_meta (key, value)
        VALUES ('career_name', ?), ('team_name', ?), ('current_season', '2026'), ('last_saved', ?)
      `).run(careerName, teamName, new Date().toISOString());
    } finally {
      db.close();
    }
  }

  public loadSave(filename: string): Database.Database {
    const savePath = this.resolveSavePath(filename);
    if (!fs.existsSync(savePath)) {
      throw new Error(`Savegame "${filename}" nicht gefunden.`);
    }
    this.closeActive();
    this.activeConnection = new Database(savePath);
    this.activeSaveName = filename;
    this.activeConnection.pragma('journal_mode = WAL');
    this.activeConnection.pragma('synchronous = NORMAL');
    this.activeConnection.pragma('foreign_keys = ON');
    this.applyLatestSchema(this.activeConnection);
    this.ensureResultsSchema(this.activeConnection);
    this.ensureRaceCategoryBonusSchema(this.activeConnection);
    this.ensureRulesData(this.activeConnection);
    this.ensureSkillWeightsData(this.activeConnection);
    this.ensureStageSpreadData(this.activeConnection);
    this.ensureStageRaceStateSchema(this.activeConnection);
    this.ensureRiderFormSchema(this.activeConnection);
    this.ensureRaceProgramSchema(this.activeConnection);
    this.ensureRiderCareerStatsSchema(this.activeConnection);
    this.ensureReferenceData(this.activeConnection);
    this.ensureDayChangeIndexes(this.activeConnection);
    const gameState = new GameStateService(this.activeConnection).ensureState();
    new RiderProgramService(this.activeConnection).ensureSeasonPrograms(gameState.season, gameState.currentDate);
    new ContractService(this.activeConnection).checkContractStatuses(gameState.season);
    return this.activeConnection;
  }

  /**
   * Idempotent index creation for the hot path of the day-change transaction.
   * These cover the new CTE-based `syncRiderLoadState` aggregation and the
   * bulk program-window lookup in `GameStateService`. Skipped when the
   * underlying tables don't exist (e.g. fresh master DB).
   */
  private ensureDayChangeIndexes(db: Database.Database): void {
    const createIfTable = (table: string, sql: string): void => {
      if (!tableExists(db, table)) return;
      try {
        db.exec(sql);
      } catch {
        // Ignore - the index might already exist with a different definition.
      }
    };

    createIfTable('stage_entries', `
      CREATE INDEX IF NOT EXISTS idx_stage_entries_rider_status
        ON stage_entries(rider_id, status, stage_id);
    `);
    createIfTable('stages', `
      CREATE INDEX IF NOT EXISTS idx_stages_date_id
        ON stages(date, id);
    `);
    createIfTable('riders', `
      CREATE INDEX IF NOT EXISTS idx_riders_active
        ON riders(is_retired, id) WHERE is_retired = 0;
    `);
            createIfTable('rider_season_programs', `
      CREATE INDEX IF NOT EXISTS idx_rider_season_programs_season_rider
        ON rider_season_programs(season, rider_id);
    `);
    createIfTable('results', `
      CREATE INDEX IF NOT EXISTS idx_results_rider_type
        ON results(rider_id, result_type_id)
        WHERE rider_id IS NOT NULL;
    `);
    createIfTable('season_point_events', `
      CREATE INDEX IF NOT EXISTS idx_season_points_rider
        ON season_point_events(rider_id);
    `);
  }

  public getActiveConnection(): Database.Database {
    if (!this.activeConnection) {
      throw new Error('Kein Savegame geladen. Bitte zuerst ein Savegame laden.');
    }

    this.applyLatestSchema(this.activeConnection);
    this.ensureResultsSchema(this.activeConnection);
    this.ensureStageRaceStateSchema(this.activeConnection);
    this.ensureRaceProgramSchema(this.activeConnection);
    this.ensureRiderCareerStatsSchema(this.activeConnection);
    this.ensureStageSpreadData(this.activeConnection);

    return this.activeConnection;
  }

  public getMasterConnection(): Database.Database {
    if (!fs.existsSync(this.masterDbPath)) {
      throw new Error('Master-Datenbank nicht gefunden. Führe zuerst den Bootstrapper aus.');
    }
    return new Database(this.masterDbPath, { readonly: true });
  }

  public getActiveSaveName(): string | null {
    return this.activeSaveName;
  }

  public closeActive(): void {
    if (this.activeConnection) {
      this.activeConnection.close();
      this.activeConnection = null;
      this.activeSaveName = null;
    }
  }

  public deleteSave(filename: string): void {
    const savePath = this.resolveSavePath(filename);
    if (this.activeSaveName === filename) this.closeActive();
    for (const ext of ['', '-wal', '-shm']) {
      const p = savePath + ext;
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
  }

  public listSaves(): SavegameMeta[] {
    if (!fs.existsSync(this.savegamesDir)) return [];
    const files = fs.readdirSync(this.savegamesDir).filter(f => /^[\w\-]+\.db$/.test(f));
    const metas: SavegameMeta[] = [];

    for (const [index, filename] of files.entries()) {
      const savePath = path.join(this.savegamesDir, filename);
      let meta: SavegameMeta = {
        id: index + 1,
        filename,
        careerName: filename.replace('.db', ''),
        teamName: '–',
        currentSeason: 2026,
        lastSaved: '',
      };
      try {
        const db = new Database(savePath, { readonly: true });
        const rows = db.prepare('SELECT key, value FROM career_meta').all() as Array<{ key: string; value: string }>;
        const stateRow = db.prepare('SELECT season FROM game_state WHERE id = 1').get() as { season: number } | undefined;
        db.close();
        const map = Object.fromEntries(rows.map(r => [r.key, r.value]));
        meta = {
          ...meta,
          careerName: map['career_name'] ?? meta.careerName,
          teamName: map['team_name'] ?? meta.teamName,
          currentSeason: stateRow?.season ?? Number(map['current_season'] ?? 2026),
          lastSaved: map['last_saved'] ?? '',
        };
      } catch {
        // Beschädigte DB → Fallback
      }
      metas.push(meta);
    }
    return metas;
  }

  public getMasterDbPath(): string {
    return this.masterDbPath;
  }
}
