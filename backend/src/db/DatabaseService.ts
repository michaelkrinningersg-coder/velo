import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { DEFAULT_SKILL_WEIGHT_RULES } from '../../../shared/skillWeights';
import { SavegameMeta } from '../../../shared/types';
import { bootstrap, readStageScoreSegments } from '../bootstrapper';
import { ContractService } from '../game/ContractService';
import { GameStateService } from '../game/GameStateService';
import { RiderProgramService } from '../game/RiderProgramService';
import { BadgeMaterializationService } from '../game/BadgeMaterializationService';
import { RivalryService } from '../game/RivalryService';
import { summarizeStageProfile } from '../simulation/StageParser';
import {
  CHAMPIONSHIP_CATEGORY_DEFS,
  CHAMPIONSHIP_RACE_DEFS,
  CRO_RACE_NAME,
  CRO_RACE_ORIGINAL_START_DAY,
  CRO_RACE_TARGET_START_DAY,
  championshipStageProfile,
  NATIONAL_SELECTION_TEAM_ID,
  NATIONAL_SELECTION_TEAM_NAME,
} from '../simulation/championships';
import { ensureContractRenewals as ensureContractRenewalsSchedule } from '../simulation/contractRenewalSchedule';
import { ensureNationalChampionships as ensureNationalChampionshipsSchedule } from '../simulation/nationalChampionshipsSchedule';
import { ensureOlympicGames as ensureOlympicGamesSchedule } from '../simulation/olympicGamesSchedule';
import {
  calculateClimbScoresForStage,
  calculateStageScore,
} from '../simulation/StageScoreCalculator';
import { isFullMoonDate } from '../util/moonPhase';

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
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type IN ('table', 'view') AND name = ?").get(tableName) as { name: string } | undefined;
  return row != null;
}

function columnExists(db: Database.Database, tableName: string, columnName: string): boolean {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
  return columns.some((column) => column.name === columnName);
}

function resolveAssetsDir(): string {
  if ((process as any).pkg) {
    let current = __dirname;
    while (true) {
      if (path.basename(current) === 'dist') {
        return path.join(path.dirname(current), 'assets');
      }
      const parent = path.dirname(current);
      if (parent === current) {
        break;
      }
      current = parent;
    }
    return '/snapshot/backend/assets';
  }

  let current = __dirname;
  while (true) {
    const candidate = path.join(current, 'assets');
    if (fs.existsSync(path.join(candidate, 'schema.sql'))) {
      return candidate;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  return path.resolve(__dirname, '..', '..', 'assets');
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

    // Try to resolve the savegames directory within the repository workspace
    let defaultSaveDir = path.join(os.homedir(), '.velo', 'savegames');
    let current = __dirname;
    while (true) {
      if (fs.existsSync(path.join(current, 'backend')) && fs.existsSync(path.join(current, 'frontend'))) {
        const repoSaveDir = path.join(current, 'savegames');
        if (fs.existsSync(repoSaveDir)) {
          defaultSaveDir = repoSaveDir;
        }
        break;
      }
      const parent = path.dirname(current);
      if (parent === current) {
        break;
      }
      current = parent;
    }

    this.savegamesDir = process.env['SAVEGAME_DIR'] ?? defaultSaveDir;
    this.ensureSavegamesDir();
  }

  private applyLatestSchema(db: Database.Database): void {
    // Migration: If 'race_entries' exists as a table, rename it to 'active_race_entries'
    const raceEntriesType = db.prepare("SELECT type FROM sqlite_master WHERE name = 'race_entries'").get() as { type: string } | undefined;
    if (raceEntriesType && raceEntriesType.type === 'table') {
      console.log("Migrating 'race_entries' table to 'active_race_entries'...");
      db.prepare("ALTER TABLE race_entries RENAME TO active_race_entries;").run();
      db.prepare("DROP INDEX IF EXISTS idx_race_entries_rider_race;").run();
      db.prepare("CREATE INDEX IF NOT EXISTS idx_active_race_entries_rider_race ON active_race_entries(rider_id, race_id);").run();
    }

    // Migration: If 'stage_entries_history' exists as a table, drop it to let it be recreated as a view
    const stageEntriesHistoryType = db.prepare("SELECT type FROM sqlite_master WHERE name = 'stage_entries_history'").get() as { type: string } | undefined;
    if (stageEntriesHistoryType && stageEntriesHistoryType.type === 'table') {
      console.log("Dropping old relational table 'stage_entries_history'...");
      db.prepare("DROP TABLE stage_entries_history;").run();
    }

    // Migration: Add yearly_baseline_skills column to riders and drop rider_skill_yearly_baseline
    if (!columnExists(db, 'riders', 'yearly_baseline_skills')) {
      console.log("Adding 'yearly_baseline_skills' column to 'riders' table...");
      db.prepare("ALTER TABLE riders ADD COLUMN yearly_baseline_skills TEXT DEFAULT NULL;").run();
    }
    const hasBaselineTable = db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'rider_skill_yearly_baseline'").get();
    if (hasBaselineTable) {
      console.log("Dropping old table 'rider_skill_yearly_baseline'...");
      db.prepare("DROP TABLE IF EXISTS rider_skill_yearly_baseline;").run();
      db.prepare("DROP INDEX IF EXISTS idx_rider_skill_yearly_baseline_lookup;").run();
    }

    // Migration: Add interactive draft columns to game_state
    if (!columnExists(db, 'game_state', 'draft_status')) {
      console.log("Adding 'draft_status' column to 'game_state' table...");
      db.prepare("ALTER TABLE game_state ADD COLUMN draft_status TEXT NOT NULL DEFAULT 'completed';").run();
    }
    if (!columnExists(db, 'game_state', 'draft_current_pick_number')) {
      console.log("Adding 'draft_current_pick_number' column to 'game_state' table...");
      db.prepare("ALTER TABLE game_state ADD COLUMN draft_current_pick_number INTEGER NOT NULL DEFAULT 1;").run();
    }
    if (!columnExists(db, 'game_state', 'draft_season')) {
      console.log("Adding 'draft_season' column to 'game_state' table...");
      db.prepare("ALTER TABLE game_state ADD COLUMN draft_season INTEGER DEFAULT NULL;").run();
    }

    // Migration: Add program_group_id column to sta_country
    if (!columnExists(db, 'sta_country', 'program_group_id')) {
      console.log("Adding 'program_group_id' column to 'sta_country' table...");
      db.prepare("ALTER TABLE sta_country ADD COLUMN program_group_id INTEGER REFERENCES program_groups(id) DEFAULT NULL;").run();
    }

    // Migration: Add preferred_nationality_group column to races
    if (!columnExists(db, 'races', 'preferred_nationality_group')) {
      console.log("Adding 'preferred_nationality_group' column to 'races' table...");
      db.prepare("ALTER TABLE races ADD COLUMN preferred_nationality_group TEXT DEFAULT NULL;").run();
    }

    // Migration: Add required_specs column to races
    if (!columnExists(db, 'races', 'required_specs')) {
      console.log("Adding 'required_specs' column to 'races' table...");
      db.prepare("ALTER TABLE races ADD COLUMN required_specs TEXT DEFAULT NULL;").run();
    }

    // Force recreation of race_entries view with new schema
    db.prepare("DROP VIEW IF EXISTS race_entries;").run();

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

  private ensureRaceCategoriesSchema(db: Database.Database): void {
    if (!tableExists(db, 'race_categories')) {
      return;
    }

    if (!columnExists(db, 'race_categories', 'home_selection_probability')) {
      db.prepare(`
        ALTER TABLE race_categories
        ADD COLUMN home_selection_probability REAL NOT NULL DEFAULT 0.0 CHECK(home_selection_probability >= 0.0)
      `).run();
    }

    if (!fs.existsSync(this.masterDbPath)) {
      return;
    }

    const masterDb = new Database(this.masterDbPath, { readonly: true });
    try {
      if (!tableExists(masterDb, 'race_categories') || !columnExists(masterDb, 'race_categories', 'home_selection_probability')) {
        return;
      }

      const rows = masterDb.prepare(`
        SELECT id, home_selection_probability
        FROM race_categories
      `).all() as Array<{ id: number; home_selection_probability: number }>;

      const update = db.prepare(`
        UPDATE race_categories
        SET home_selection_probability = ?
        WHERE id = ?
      `);

      db.transaction(() => {
        for (const row of rows) {
          update.run(row.home_selection_probability, row.id);
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
      ['super_team_id', 'INTEGER REFERENCES teams(id)'],
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

  private ensureContractRenewalSchema(db: Database.Database): void {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS contract_renewal_runs (
        season INTEGER PRIMARY KEY
      )
    `).run();
    // Vom Spieler am 10.01. ausgewaehlte Verlaengerungsziele je Saison.
    db.prepare(`
      CREATE TABLE IF NOT EXISTS contract_renewal_selection (
        season INTEGER NOT NULL,
        rider_id INTEGER NOT NULL,
        PRIMARY KEY (season, rider_id)
      )
    `).run();
    // Markiert, dass der Spieler die Auswahl fuer die Saison bestaetigt hat
    // (auch wenn 0 Fahrer gewaehlt wurden) — schliesst das Auswahlfenster.
    db.prepare(`
      CREATE TABLE IF NOT EXISTS contract_renewal_selection_runs (
        season INTEGER PRIMARY KEY
      )
    `).run();
  }

  // Reserviertes Pseudo-Team fuer teamlose Starter der U23-/Junioren-Rennen
  // (active_race_entries.team_id ist NOT NULL). Attribute werden von einem
  // bestehenden Team kopiert, damit alle Fremdschluessel gueltig sind. Wird aus
  // Team-Listen ausgeblendet (getTeams) und faellt aus den Team-Standings, da
  // Meisterschaftspunkte dort ausgeschlossen sind.
  private ensureNationalSelectionTeam(db: Database.Database): void {
    if (!tableExists(db, 'teams')) return;
    const exists = db.prepare('SELECT 1 FROM teams WHERE id = ?').get(NATIONAL_SELECTION_TEAM_ID);
    if (exists) return;
    const template = db
      .prepare('SELECT division_id, country_id, ai_focus_1, ai_focus_2, ai_focus_3 FROM teams ORDER BY id LIMIT 1')
      .get() as
      | { division_id: number; country_id: number; ai_focus_1: number; ai_focus_2: number; ai_focus_3: number }
      | undefined;
    if (!template) return; // Noch keine Teams (frische Master-DB) — nichts zu tun.
    db.prepare(`
      INSERT INTO teams (
        id, name, abbreviation, division_id, is_player_team, country_id,
        color_primary, color_secondary, ai_focus_1, ai_focus_2, ai_focus_3
      ) VALUES (?, ?, 'NAT', ?, 0, ?, '#334155', '#e2e8f0', ?, ?, ?)
    `).run(
      NATIONAL_SELECTION_TEAM_ID,
      NATIONAL_SELECTION_TEAM_NAME,
      template.division_id,
      template.country_id,
      template.ai_focus_1,
      template.ai_focus_2,
      template.ai_focus_3,
    );
  }

  private ensureChampionshipTitlesSchema(db: Database.Database): void {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS championship_titles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        season INTEGER NOT NULL,
        championship_type TEXT NOT NULL,
        discipline TEXT NOT NULL,
        rider_id INTEGER NOT NULL,
        country_id INTEGER,
        race_id INTEGER,
        stage_id INTEGER,
        awarded_on TEXT,
        UNIQUE(season, championship_type, discipline)
      )
    `).run();
    db.prepare(
      'CREATE INDEX IF NOT EXISTS idx_championship_titles_rider ON championship_titles(rider_id)',
    ).run();
  }

  // Ergaenzt den WM/EM-Kalender in einem (neuen wie bestehenden) Spielstand:
  // vier Meisterschaftskategorien inkl. UCI-Punkte, je Saison vier Titelrennen
  // (falls noch nicht vorhanden) und die Verschiebung des Cro Race um einen Tag.
  // Idempotent: Erkennung ueber die stabile Kategorie-ID.
  private ensureChampionshipCalendar(db: Database.Database): void {
    if (!tableExists(db, 'races') || !tableExists(db, 'stages')) {
      return;
    }
    if (!tableExists(db, 'race_categories') || !tableExists(db, 'race_categories_bonus')) {
      return;
    }

    // 1. Bonus-Systeme (nur Zielpunkte, alles andere null).
    const insertBonus = db.prepare(`
      INSERT OR IGNORE INTO race_categories_bonus (
        id, name, bonus_seconds_final, bonus_seconds_intermediate, points_stage,
        points_mountainstage, points_sprint_finish, points_one_day, points_gc_final,
        points_jersey_leader_day, points_jersey_sprint_day, points_jersey_mountain_day,
        points_jersey_youth_day, points_sprint_intermediate, points_mountain_hc,
        points_mountain_cat1, points_mountain_cat2, points_mountain_cat3, points_mountain_cat4,
        points_jersey_sprint_final, points_jersey_mountain_final, points_jersey_youth_final
      ) VALUES (
        @id, @name, '0', '0', '0', '0', '0', @pointsOneDay, '0',
        0, 0, 0, 0, '0', '0', '0', '0', '0', '0', '0', '0', '0'
      )
    `);
    const insertCategory = db.prepare(`
      INSERT OR IGNORE INTO race_categories (
        id, name, tier, number_of_teams, number_of_riders, bonus_system_id, home_selection_probability
      ) VALUES (@id, @name, 1, 60, 12, @bonusSystemId, 0.0)
    `);
    for (const def of CHAMPIONSHIP_CATEGORY_DEFS) {
      insertBonus.run({ id: def.bonusSystemId, name: def.bonusName, pointsOneDay: def.pointsOneDay });
      insertCategory.run({ id: def.categoryId, name: def.categoryName, bonusSystemId: def.bonusSystemId });
    }

    // 2. Distinct-Saisons anhand vorhandener Etappen.
    const seasonRows = db
      .prepare(`SELECT DISTINCT CAST(substr(date, 1, 4) AS INTEGER) AS season FROM stages WHERE date IS NOT NULL`)
      .all() as Array<{ season: number }>;
    const seasons = seasonRows.map((row) => row.season).filter((season) => Number.isInteger(season));
    if (seasons.length === 0) {
      return;
    }

    const hasChampionshipStage = db.prepare(`
      SELECT 1
      FROM stages
      JOIN races ON races.id = stages.race_id
      WHERE races.category_id = ?
        AND CAST(substr(stages.date, 1, 4) AS INTEGER) = ?
      LIMIT 1
    `);
    const insertRace = db.prepare(`
      INSERT INTO races (
        name, country_id, category_id, is_stage_race, number_of_stages,
        start_date, end_date, prestige, preferred_nationality_group, required_specs
      ) VALUES (@name, @countryId, @categoryId, 0, 1, @date, @date, @prestige, NULL, NULL)
    `);
    const insertStage = db.prepare(`
      INSERT INTO stages (
        race_id, stage_number, date, profile, start_elevation, details_csv_file,
        final_spread_start_percent, final_push_start_percent, final_spread_difficulty_multiplier,
        crash_incident_multiplier, mechanical_incident_multiplier, stage_score, allowed_weather
      ) VALUES (@raceId, 1, @date, @profile, @startElevation, @detailsFile, 70, 90, 1, 1, 1, @stageScore, '1|3')
    `);
    const insertClimb = tableExists(db, 'stage_climb_scores')
      ? db.prepare(`
          INSERT INTO stage_climb_scores (
            stage_id, climb_index, name, category, start_km, end_km, climb_score
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
      : null;

    for (const season of seasons) {
      for (const def of CHAMPIONSHIP_RACE_DEFS) {
        if (hasChampionshipStage.get(def.categoryId, season)) {
          continue;
        }
        const date = `${season}-${def.monthDay}`;
        const { profile, detailsFile } = championshipStageProfile(def, season);
        const segments = readStageScoreSegments(detailsFile, `championship ${def.raceName} ${season}`);
        const stageScore = calculateStageScore(segments, def.startElevation);

        const raceResult = insertRace.run({
          name: def.raceName,
          countryId: 3, // neutral (Frankreich); Heimvorteil ist deaktiviert (Wahrscheinlichkeit 0)
          categoryId: def.categoryId,
          date,
          prestige: def.prestige,
        });
        const raceId = raceResult.lastInsertRowid as number;
        const stageResult = insertStage.run({
          raceId,
          date,
          profile,
          startElevation: def.startElevation,
          detailsFile,
          stageScore,
        });
        const stageId = stageResult.lastInsertRowid as number;
        if (insertClimb) {
          for (const climb of calculateClimbScoresForStage(segments, def.startElevation)) {
            insertClimb.run(
              stageId,
              climb.climbIndex,
              climb.name,
              climb.category,
              climb.startKm,
              climb.endKm,
              climb.score,
            );
          }
        }
      }

      // 3. Strassenprofil je Saison an die deterministische Rotation angleichen
      //    (Saison-Rollover klont sonst das Vorjahresprofil).
      this.reconcileChampionshipRoadProfiles(db, season);

      // 4. Cro Race weicht dem WM-Fenster: ein Tag nach hinten (idempotent).
      this.shiftCroRaceForSeason(db, season);
    }
  }

  // Setzt das Strassenprofil (und den passenden Streckensatz) der WM/EM-Strassen-
  // rennen einer Saison auf die deterministisch rotierte Wahl. Bereits gefahrene
  // Editionen (mit Ergebnissen) bleiben unberuehrt.
  private reconcileChampionshipRoadProfiles(db: Database.Database, season: number): void {
    const raced = tableExists(db, 'results')
      ? db.prepare('SELECT 1 FROM results WHERE stage_id = ? LIMIT 1')
      : null;
    const findStage = db.prepare(`
      SELECT s.id AS id, s.profile AS profile, s.details_csv_file AS detailsFile, s.start_elevation AS startElevation
      FROM stages s
      JOIN races r ON r.id = s.race_id
      WHERE r.category_id = ? AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
      LIMIT 1
    `);
    const updateStage = db.prepare(
      'UPDATE stages SET profile = ?, details_csv_file = ?, stage_score = ? WHERE id = ?',
    );
    const hasClimbTable = tableExists(db, 'stage_climb_scores');
    const deleteClimbs = hasClimbTable
      ? db.prepare('DELETE FROM stage_climb_scores WHERE stage_id = ?')
      : null;
    const insertClimb = hasClimbTable
      ? db.prepare(`
          INSERT INTO stage_climb_scores (
            stage_id, climb_index, name, category, start_km, end_km, climb_score
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
      : null;

    for (const def of CHAMPIONSHIP_RACE_DEFS) {
      if (def.discipline !== 'ROAD') {
        continue;
      }
      const stage = findStage.get(def.categoryId, season) as
        | { id: number; profile: string; detailsFile: string; startElevation: number }
        | undefined;
      if (!stage) {
        continue;
      }
      if (raced && raced.get(stage.id)) {
        continue; // bereits gefahren
      }
      const { profile, detailsFile } = championshipStageProfile(def, season);
      if (stage.profile === profile && stage.detailsFile === detailsFile) {
        continue;
      }
      const segments = readStageScoreSegments(detailsFile, `championship reconcile ${def.raceName} ${season}`);
      const stageScore = calculateStageScore(segments, stage.startElevation);
      updateStage.run(profile, detailsFile, stageScore, stage.id);
      if (deleteClimbs && insertClimb) {
        deleteClimbs.run(stage.id);
        for (const climb of calculateClimbScoresForStage(segments, stage.startElevation)) {
          insertClimb.run(
            stage.id,
            climb.climbIndex,
            climb.name,
            climb.category,
            climb.startKm,
            climb.endKm,
            climb.score,
          );
        }
      }
    }
  }

  private shiftCroRaceForSeason(db: Database.Database, season: number): void {
    const croRace = db
      .prepare(
        `SELECT id, start_date, end_date FROM races WHERE name = ? AND substr(start_date, 1, 4) = ?`,
      )
      .get(CRO_RACE_NAME, String(season)) as
      | { id: number; start_date: string; end_date: string }
      | undefined;
    if (!croRace) {
      return;
    }
    const startDay = Number.parseInt(croRace.start_date.slice(8, 10), 10);
    // Nur aus dem Original- (22.) oder dem frueheren Zwischenstand (23.) auf den
    // Zieltag (24.) schieben; ist es bereits verschoben, nichts tun.
    if (startDay < CRO_RACE_ORIGINAL_START_DAY || startDay >= CRO_RACE_TARGET_START_DAY) {
      return;
    }
    const deltaDays = CRO_RACE_TARGET_START_DAY - startDay;
    const shift = (iso: string): string => {
      const [y, m, d] = iso.split('-').map((value) => Number(value));
      const shifted = new Date(Date.UTC(y, m - 1, d + deltaDays));
      const yy = shifted.getUTCFullYear();
      const mm = String(shifted.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(shifted.getUTCDate()).padStart(2, '0');
      return `${yy}-${mm}-${dd}`;
    };
    db.prepare('UPDATE races SET start_date = ?, end_date = ? WHERE id = ?').run(
      shift(croRace.start_date),
      shift(croRace.end_date),
      croRace.id,
    );
    const stages = db
      .prepare('SELECT id, date FROM stages WHERE race_id = ?')
      .all(croRace.id) as Array<{ id: number; date: string }>;
    const updateStage = db.prepare('UPDATE stages SET date = ? WHERE id = ?');
    for (const stage of stages) {
      updateStage.run(shift(stage.date), stage.id);
    }
  }

  private ensureNationalChampionshipTitlesSchema(db: Database.Database): void {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS national_champion_titles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        season INTEGER NOT NULL,
        discipline TEXT NOT NULL,
        country_id INTEGER,
        rider_id INTEGER NOT NULL,
        race_id INTEGER,
        stage_id INTEGER,
        awarded_on TEXT,
        UNIQUE(season, discipline, country_id)
      )
    `).run();
    db.prepare(
      'CREATE INDEX IF NOT EXISTS idx_national_champion_titles_rider ON national_champion_titles(rider_id)',
    ).run();
  }

  // Nationale Meisterschaften (je qualifiziertem Land ITT 25.06. + Strasse
  // 28.06.). Erzeugt am 01.06. der jeweiligen Saison anhand der Nationenwertung.
  // Qualifiziert: Top 40 der Nationenwertung ODER >= 15 Fahrer mit aktivem Team.
  // Idempotent (Erkennung ueber die Kategorien 14/15 je Saisonjahr).
  private ensureNationalChampionships(db: Database.Database): void {
    ensureNationalChampionshipsSchedule(db);
  }

  private ensureWeatherSchema(db: Database.Database): void {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS wetter (
        id INTEGER PRIMARY KEY,
        wetter_name TEXT NOT NULL UNIQUE,
        effekt_sturz_min REAL NOT NULL DEFAULT 0.0,
        effekt_sturz_max REAL NOT NULL DEFAULT 0.0,
        effekt_defekt_min REAL NOT NULL DEFAULT 0.0,
        effekt_defekt_max REAL NOT NULL DEFAULT 0.0,
        windkanten_gefahr_min REAL NOT NULL DEFAULT 0.0,
        windkanten_gefahr_max REAL NOT NULL DEFAULT 0.0,
        effekt_fatigue_min REAL NOT NULL DEFAULT 0.0,
        effekt_fatigue_max REAL NOT NULL DEFAULT 0.0,
        breakaway_bonus_min REAL NOT NULL DEFAULT 0.0,
        breakaway_bonus_max REAL NOT NULL DEFAULT 0.0
      )
    `).run();

    const insert = db.prepare(`
      INSERT OR IGNORE INTO wetter (
        id, wetter_name,
        effekt_sturz_min, effekt_sturz_max,
        effekt_defekt_min, effekt_defekt_max,
        windkanten_gefahr_min, windkanten_gefahr_max,
        effekt_fatigue_min, effekt_fatigue_max,
        breakaway_bonus_min, breakaway_bonus_max
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const weatherRows = [
      [1, 'Sonnig', 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      [2, 'Extreme Hitze', 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 15.0, 30.0, 0.0, 0.0],
      [3, 'Leichter Regen', 1.0, 3.0, 0.5, 1.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      [4, 'Starkregen', 3.0, 7.0, 1.5, 4.0, 0.0, 0.0, 5.0, 15.0, 0.0, 0.0],
      [5, 'Starker Wind', 0.5, 2.0, 0.0, 0.0, 0.05, 0.15, 5.0, 10.0, 0.0, 0.0],
      [6, 'Dichter Nebel', 2.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 3.0],
      [7, 'Schnee/Eis', 5.0, 12.0, 1.0, 3.0, 0.0, 0.0, 15.0, 35.0, 0.0, 0.0],
    ];

    db.transaction(() => {
      for (const row of weatherRows) {
        insert.run(...row);
      }
    })();

    const weatherStageColumns = [
      ['allowed_weather', "TEXT NOT NULL DEFAULT '1|2|3|4|5|6|7'"],
      ['rolled_weather_id', 'INTEGER REFERENCES wetter(id)'],
    ] as const;

    for (const [columnName, columnDefinition] of weatherStageColumns) {
      if (!columnExists(db, 'stages', columnName)) {
        db.prepare(`
          ALTER TABLE stages
          ADD COLUMN ${columnName} ${columnDefinition}
        `).run();
      }
    }
  }

  private ensureRiderWeatherProfileSchema(db: Database.Database): void {
    if (!columnExists(db, 'riders', 'weather_profile_id')) {
      db.prepare(`
        ALTER TABLE riders
        ADD COLUMN weather_profile_id INTEGER NOT NULL DEFAULT 1
      `).run();
      db.prepare(`
        UPDATE riders SET weather_profile_id = (ABS(RANDOM()) % 7) + 1
      `).run();
    }
  }

  private ensureDraftPicksPoolSchema(db: Database.Database): void {
    if (tableExists(db, 'draft_picks_pool')) {
      if (!columnExists(db, 'draft_picks_pool', 'old_team_id')) {
        db.prepare(`
          ALTER TABLE draft_picks_pool
          ADD COLUMN old_team_id INTEGER
        `).run();
      }
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

    if (!columnExists(db, 'results', 'breakaway_kms')) {
      db.prepare(`
        ALTER TABLE results
        ADD COLUMN breakaway_kms REAL
      `).run();
    }

    if (!columnExists(db, 'results', 'event_ids')) {
      db.prepare(`
        ALTER TABLE results
        ADD COLUMN event_ids TEXT
      `).run();
    }

    if (!columnExists(db, 'results', 'jerseys_worn')) {
      db.prepare(`
        ALTER TABLE results
        ADD COLUMN jerseys_worn TEXT
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
        DROP VIEW IF EXISTS all_results;

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
          breakaway_kms    REAL,
          event_ids        TEXT,
          jerseys_worn     TEXT,
          CHECK(
            (result_type_id = 1 AND team_id IS NOT NULL)
            OR
            (result_type_id = 6 AND rider_id IS NULL AND team_id IS NOT NULL)
            OR
            (result_type_id NOT IN (1, 6) AND rider_id IS NOT NULL AND team_id IS NOT NULL)
          )
        );

        INSERT INTO results_new (
          id, race_id, stage_id, rider_id, team_id, result_type_id, rank, time_seconds, points, is_breakaway, leadout_rider_id, leadout_bonus, breakaway_kms, event_ids, jerseys_worn
        )
        SELECT
          id, race_id, stage_id, rider_id, team_id, result_type_id, rank, time_seconds, points, is_breakaway, leadout_rider_id, leadout_bonus, breakaway_kms, event_ids, jerseys_worn
        FROM results;

        DROP TABLE results;
        ALTER TABLE results_new RENAME TO results;

        CREATE UNIQUE INDEX IF NOT EXISTS idx_results_stage_rider_type
          ON results(stage_id, rider_id, result_type_id)
          WHERE rider_id IS NOT NULL;
      `);
    })();
  }

  private ensureResultsHistorySchema(db: Database.Database): void {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS results_history (
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
        breakaway_kms    REAL,
        event_ids        TEXT,
        jerseys_worn     TEXT,
        CHECK(
          (result_type_id = 1 AND team_id IS NOT NULL)
          OR
          (result_type_id = 6 AND rider_id IS NULL AND team_id IS NOT NULL)
          OR
          (result_type_id NOT IN (1, 6) AND rider_id IS NOT NULL AND team_id IS NOT NULL)
        )
      )
    `).run();

    // Create indices on results_history
    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_results_hist_rider_type
        ON results_history(rider_id, result_type_id)
        WHERE rider_id IS NOT NULL;
    `).run();

    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_results_hist_stage_team_type_null 
        ON results_history(stage_id, team_id, result_type_id) 
        WHERE rider_id IS NULL;
    `).run();

    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_results_hist_team_id 
        ON results_history(team_id);
    `).run();

    db.prepare(`DROP VIEW IF EXISTS all_results;`).run();

    db.prepare(`
      CREATE VIEW all_results AS
      SELECT * FROM results
      UNION ALL
      SELECT * FROM results_history
      UNION ALL
      SELECT
        NULL AS id,
        s.race_id AS race_id,
        s.id AS stage_id,
        CAST(j.value->>1 AS INTEGER) AS rider_id,
        CAST(j.value->>2 AS INTEGER) AS team_id,
        1 AS result_type_id,
        CAST(j.value->>3 AS INTEGER) AS rank,
        CAST(j.value->>4 AS INTEGER) AS time_seconds,
        CAST(j.value->>5 AS INTEGER) AS points,
        CAST(j.value->>6 AS INTEGER) AS is_breakaway,
        CAST(j.value->>7 AS INTEGER) AS leadout_rider_id,
        CAST(j.value->>8 AS REAL) AS leadout_bonus,
        CAST(j.value->>9 AS REAL) AS breakaway_kms,
        j.value->>10 AS event_ids,
        j.value->>11 AS jerseys_worn
      FROM race_results_compact c
      JOIN stages s ON s.race_id = c.race_id,
      json_each(c.payload, '$.type1') j
      WHERE CAST(j.value->>0 AS INTEGER) = s.id
      UNION ALL
      SELECT
        NULL AS id,
        s.race_id AS race_id,
        s.id AS stage_id,
        CAST(j.value->>1 AS INTEGER) AS rider_id,
        CAST(j.value->>2 AS INTEGER) AS team_id,
        2 AS result_type_id,
        CAST(j.value->>3 AS INTEGER) AS rank,
        CAST(j.value->>4 AS INTEGER) AS time_seconds,
        CAST(j.value->>5 AS INTEGER) AS points,
        CAST(j.value->>6 AS INTEGER) AS is_breakaway,
        CAST(j.value->>7 AS INTEGER) AS leadout_rider_id,
        CAST(j.value->>8 AS REAL) AS leadout_bonus,
        CAST(j.value->>9 AS REAL) AS breakaway_kms,
        j.value->>10 AS event_ids,
        j.value->>11 AS jerseys_worn
      FROM race_results_compact c
      JOIN stages s ON s.race_id = c.race_id,
      json_each(c.payload, '$.type2') j
      WHERE CAST(j.value->>0 AS INTEGER) = s.id
      UNION ALL
      SELECT
        NULL AS id,
        s.race_id AS race_id,
        s.id AS stage_id,
        CAST(j.value->>1 AS INTEGER) AS rider_id,
        CAST(j.value->>2 AS INTEGER) AS team_id,
        3 AS result_type_id,
        CAST(j.value->>3 AS INTEGER) AS rank,
        CAST(j.value->>4 AS INTEGER) AS time_seconds,
        CAST(j.value->>5 AS INTEGER) AS points,
        CAST(j.value->>6 AS INTEGER) AS is_breakaway,
        CAST(j.value->>7 AS INTEGER) AS leadout_rider_id,
        CAST(j.value->>8 AS REAL) AS leadout_bonus,
        CAST(j.value->>9 AS REAL) AS breakaway_kms,
        j.value->>10 AS event_ids,
        j.value->>11 AS jerseys_worn
      FROM race_results_compact c
      JOIN stages s ON s.race_id = c.race_id,
      json_each(c.payload, '$.type3') j
      WHERE CAST(j.value->>0 AS INTEGER) = s.id
      UNION ALL
      SELECT
        NULL AS id,
        s.race_id AS race_id,
        s.id AS stage_id,
        CAST(j.value->>1 AS INTEGER) AS rider_id,
        CAST(j.value->>2 AS INTEGER) AS team_id,
        4 AS result_type_id,
        CAST(j.value->>3 AS INTEGER) AS rank,
        CAST(j.value->>4 AS INTEGER) AS time_seconds,
        CAST(j.value->>5 AS INTEGER) AS points,
        CAST(j.value->>6 AS INTEGER) AS is_breakaway,
        CAST(j.value->>7 AS INTEGER) AS leadout_rider_id,
        CAST(j.value->>8 AS REAL) AS leadout_bonus,
        CAST(j.value->>9 AS REAL) AS breakaway_kms,
        j.value->>10 AS event_ids,
        j.value->>11 AS jerseys_worn
      FROM race_results_compact c
      JOIN stages s ON s.race_id = c.race_id,
      json_each(c.payload, '$.type4') j
      WHERE CAST(j.value->>0 AS INTEGER) = s.id
      UNION ALL
      SELECT
        NULL AS id,
        s.race_id AS race_id,
        s.id AS stage_id,
        CAST(j.value->>1 AS INTEGER) AS rider_id,
        CAST(j.value->>2 AS INTEGER) AS team_id,
        6 AS result_type_id,
        CAST(j.value->>3 AS INTEGER) AS rank,
        CAST(j.value->>4 AS INTEGER) AS time_seconds,
        CAST(j.value->>5 AS INTEGER) AS points,
        CAST(j.value->>6 AS INTEGER) AS is_breakaway,
        CAST(j.value->>7 AS INTEGER) AS leadout_rider_id,
        CAST(j.value->>8 AS REAL) AS leadout_bonus,
        CAST(j.value->>9 AS REAL) AS breakaway_kms,
        j.value->>10 AS event_ids,
        j.value->>11 AS jerseys_worn
      FROM race_results_compact c
      JOIN stages s ON s.race_id = c.race_id,
      json_each(c.payload, '$.type6') j
      WHERE CAST(j.value->>0 AS INTEGER) = s.id
      UNION ALL
      SELECT
        NULL AS id,
        s.race_id AS race_id,
        s.id AS stage_id,
        CAST(j.value->>1 AS INTEGER) AS rider_id,
        CAST(j.value->>2 AS INTEGER) AS team_id,
        7 AS result_type_id,
        CAST(j.value->>3 AS INTEGER) AS rank,
        CAST(j.value->>4 AS INTEGER) AS time_seconds,
        CAST(j.value->>5 AS INTEGER) AS points,
        CAST(j.value->>6 AS INTEGER) AS is_breakaway,
        CAST(j.value->>7 AS INTEGER) AS leadout_rider_id,
        CAST(j.value->>8 AS REAL) AS leadout_bonus,
        CAST(j.value->>9 AS REAL) AS breakaway_kms,
        j.value->>10 AS event_ids,
        j.value->>11 AS jerseys_worn
      FROM race_results_compact c
      JOIN stages s ON s.race_id = c.race_id,
      json_each(c.payload, '$.type7') j
      WHERE CAST(j.value->>0 AS INTEGER) = s.id;
    `).run();
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
      if (!columnExists(db, 'rider_daily_state', 'season_points')) {
        db.prepare(`
          ALTER TABLE rider_daily_state
          ADD COLUMN season_points INTEGER NOT NULL DEFAULT 0
        `).run();
      }
      if (!columnExists(db, 'rider_daily_state', 'season_wins')) {
        db.prepare(`
          ALTER TABLE rider_daily_state
          ADD COLUMN season_wins INTEGER NOT NULL DEFAULT 0
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
      if (!columnExists(db, 'rider_daily_state', 'short_term_fatigue')) {
        db.prepare(`
          ALTER TABLE rider_daily_state
          ADD COLUMN short_term_fatigue REAL NOT NULL DEFAULT 0.0
        `).run();
      }
      if (!columnExists(db, 'rider_daily_state', 'long_term_fatigue_decayable')) {
        db.prepare(`
          ALTER TABLE rider_daily_state
          ADD COLUMN long_term_fatigue_decayable REAL NOT NULL DEFAULT 0.0
        `).run();
      }
      if (!columnExists(db, 'rider_daily_state', 'long_term_fatigue_locked')) {
        db.prepare(`
          ALTER TABLE rider_daily_state
          ADD COLUMN long_term_fatigue_locked REAL NOT NULL DEFAULT 0.0
        `).run();
      }
    }

    db.prepare(`
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

    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_rider_fatigue_history_rider_date
      ON rider_fatigue_history(rider_id, date)
    `).run();

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
        short_fatigue REAL NOT NULL DEFAULT 0.0,
        long_fatigue REAL NOT NULL DEFAULT 0.0,
        combined_fatigue REAL NOT NULL DEFAULT 0.0,
        PRIMARY KEY (rider_id, date)
      )
    `).run();

    if (!columnExists(db, 'rider_form_history', 'short_fatigue')) {
      db.prepare('ALTER TABLE rider_form_history ADD COLUMN short_fatigue REAL NOT NULL DEFAULT 0.0').run();
    }
    if (!columnExists(db, 'rider_form_history', 'long_fatigue')) {
      db.prepare('ALTER TABLE rider_form_history ADD COLUMN long_fatigue REAL NOT NULL DEFAULT 0.0').run();
    }
    if (!columnExists(db, 'rider_form_history', 'combined_fatigue')) {
      db.prepare('ALTER TABLE rider_form_history ADD COLUMN combined_fatigue REAL NOT NULL DEFAULT 0.0').run();
    }

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
        injury_days INTEGER NOT NULL DEFAULT 0,
        superteam_count INTEGER NOT NULL DEFAULT 0
      )
    `).run();

    if (!columnExists(db, 'rider_career_stats', 'superteam_count')) {
      db.prepare('ALTER TABLE rider_career_stats ADD COLUMN superteam_count INTEGER NOT NULL DEFAULT 0').run();
    }

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

    // Drop Peak fatigue and form triggers
    db.prepare('DROP TRIGGER IF EXISTS trg_update_highest_rider_records_fatigue').run();
    db.prepare('DROP TRIGGER IF EXISTS trg_update_highest_rider_records_form').run();

    // Drop Peak fatigue and form columns if the SQLite version supports it
    const dropColumns = [
      'max_short_term_fatigue',
      'max_long_term_fatigue',
      'max_combined_fatigue',
      'max_s_form',
      'max_r_form',
      'max_combined_form'
    ];
    for (const col of dropColumns) {
      if (columnExists(db, 'rider_career_stats', col)) {
        try {
          db.prepare(`ALTER TABLE rider_career_stats DROP COLUMN ${col}`).run();
        } catch (e) {
          console.warn(`Could not drop column ${col}:`, e);
        }
      }
    }
  }

  private ensureStageLeadoutsSchema(db: Database.Database): void {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS stage_leadouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        stage_id INTEGER NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
        race_id INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
        season INTEGER NOT NULL,
        team_id INTEGER NOT NULL REFERENCES teams(id),
        sprinter_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        leadout_bonus REAL NOT NULL,
        contributors_json TEXT NOT NULL
      )
    `).run();
    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_stage_leadouts_sprinter ON stage_leadouts(sprinter_id)
    `).run();
    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_stage_leadouts_team ON stage_leadouts(team_id)
    `).run();
  }

  /**
   * Rangliste der schnellsten Durchschnittsgeschwindigkeiten (Sieger je Etappe
   * bzw. Eintagesrennen). Wird beim Stage-Commit befuellt und wie beim
   * Leadout-Bonus als Rekordliste gefuehrt — jedoch bewusst klein gehalten:
   * pro Saison und all-time werden nur die Top 50 behalten, der Rest wird nach
   * jedem Eintrag geprunt (siehe StageResultCommitService).
   */
  private ensureStageSpeedRecordsSchema(db: Database.Database): void {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS stage_speed_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        kind TEXT NOT NULL,                 -- 'stage' | 'oneday'
        season INTEGER NOT NULL,
        race_id INTEGER REFERENCES races(id) ON DELETE CASCADE,
        stage_id INTEGER REFERENCES stages(id) ON DELETE CASCADE,
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        team_id INTEGER REFERENCES teams(id),
        race_name TEXT,
        stage_number INTEGER,
        profile TEXT,
        distance_km REAL NOT NULL,
        time_seconds INTEGER NOT NULL,
        avg_speed_kmh REAL NOT NULL,
        date TEXT
      )
    `).run();
    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_stage_speed_records_lookup
        ON stage_speed_records(kind, season, avg_speed_kmh DESC)
    `).run();
    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_stage_speed_records_rider
        ON stage_speed_records(rider_id)
    `).run();
  }

  private ensureRiderSeasonStatsSchema(db: Database.Database): void {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_season_stats (
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        season INTEGER NOT NULL,
        breakaway_attempts INTEGER NOT NULL DEFAULT 0,
        breakaway_kms REAL NOT NULL DEFAULT 0.0,
        attacks INTEGER NOT NULL DEFAULT 0,
        counter_attacks INTEGER NOT NULL DEFAULT 0,
        crashes INTEGER NOT NULL DEFAULT 0,
        defects INTEGER NOT NULL DEFAULT 0,
        illnesses INTEGER NOT NULL DEFAULT 0,
        illness_days INTEGER NOT NULL DEFAULT 0,
        injuries INTEGER NOT NULL DEFAULT 0,
        injury_days INTEGER NOT NULL DEFAULT 0,
        dns_count INTEGER NOT NULL DEFAULT 0,
        dnf_count INTEGER NOT NULL DEFAULT 0,
        otl_count INTEGER NOT NULL DEFAULT 0,
        superform_days INTEGER NOT NULL DEFAULT 0,
        supermalus_days INTEGER NOT NULL DEFAULT 0,
        home_advantage_days INTEGER NOT NULL DEFAULT 0,
        super_home_advantage_days INTEGER NOT NULL DEFAULT 0,
        home_pressure_days INTEGER NOT NULL DEFAULT 0,
        superteam_count INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (rider_id, season)
      )
    `).run();

    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_rider_season_stats_season ON rider_season_stats(season);
    `).run();

    if (!columnExists(db, 'rider_season_stats', 'superteam_count')) {
      db.prepare(`
        ALTER TABLE rider_season_stats
        ADD COLUMN superteam_count INTEGER NOT NULL DEFAULT 0
      `).run();
    }

    if (!columnExists(db, 'rider_season_stats', 'superform_days')) {
      db.prepare(`
        ALTER TABLE rider_season_stats
        ADD COLUMN superform_days INTEGER NOT NULL DEFAULT 0
      `).run();
    }
    if (!columnExists(db, 'rider_season_stats', 'win_streak_best')) {
      db.prepare(`
        ALTER TABLE rider_season_stats
        ADD COLUMN win_streak_best INTEGER NOT NULL DEFAULT 0
      `).run();
    }
    if (!columnExists(db, 'rider_season_stats', 'supermalus_days')) {
      db.prepare(`
        ALTER TABLE rider_season_stats
        ADD COLUMN supermalus_days INTEGER NOT NULL DEFAULT 0
      `).run();
    }
    if (!columnExists(db, 'rider_season_stats', 'home_advantage_days')) {
      db.prepare(`
        ALTER TABLE rider_season_stats
        ADD COLUMN home_advantage_days INTEGER NOT NULL DEFAULT 0
      `).run();
    }
    if (!columnExists(db, 'rider_season_stats', 'super_home_advantage_days')) {
      db.prepare(`
        ALTER TABLE rider_season_stats
        ADD COLUMN super_home_advantage_days INTEGER NOT NULL DEFAULT 0
      `).run();
    }
    if (!columnExists(db, 'rider_season_stats', 'home_pressure_days')) {
      db.prepare(`
        ALTER TABLE rider_season_stats
        ADD COLUMN home_pressure_days INTEGER NOT NULL DEFAULT 0
      `).run();
    }
  }

  private ensureRiderSeasonRolesSchema(db: Database.Database): void {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_season_roles (
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        season   INTEGER NOT NULL,
        role_id  INTEGER REFERENCES sta_role(id),
        PRIMARY KEY (rider_id, season)
      )
    `).run();

    // Initial befüllen mit den aktuellen Rollen für das aktuelle Jahr
    try {
      const stateRow = db.prepare('SELECT season FROM game_state WHERE id = 1').get() as { season: number } | undefined;
      if (stateRow) {
        db.prepare(`
          INSERT OR IGNORE INTO rider_season_roles (rider_id, season, role_id)
          SELECT id, ?, role_id FROM riders WHERE role_id IS NOT NULL AND is_retired = 0
        `).run(stateRow.season);
      }
    } catch (e) {
      // Ignorieren falls game_state noch nicht existiert (z.B. frische master DB)
    }
  }

  private ensureSeasonStandingsSnapshotsSchema(db: Database.Database): void {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS season_standings_snapshots (
        season       INTEGER PRIMARY KEY,
        payload_json TEXT NOT NULL
      )
    `).run();
  }

  private ensureRaceResultsCompactSchema(db: Database.Database): void {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS race_results_compact (
        race_id  INTEGER PRIMARY KEY REFERENCES races(id) ON DELETE CASCADE,
        season   INTEGER NOT NULL,
        payload  TEXT    NOT NULL
      )
    `).run();

    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_race_results_compact_season
        ON race_results_compact(season)
    `).run();
  }

  /**
   * Dauerhafte, schlanke Relational-Kopie aller Ergebnisse und Etappen-
   * Einsaetze ("History-Ablage"). Wird beim Ergebnis-Commit inkrementell
   * gepflegt und ueberlebt die Kompaktierung beim Rennabschluss. Am Saison-
   * ende wird sie mit derselben Regel geprunt wie die Kompakt-Payloads
   * (Rang 1 + Punkte-Zeilen bleiben, siehe advanceDay). Rider-/Team-
   * bezogene Abfragen (z.B. Fahrer-Statistik) muessen damit nicht mehr die
   * json_each-Views entpacken (dort ~600ms pro Aufruf, linear wachsend).
   */
  private ensureResultsFlatSchema(db: Database.Database): void {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS results_flat (
        race_id          INTEGER NOT NULL,
        stage_id         INTEGER NOT NULL,
        rider_id         INTEGER,
        team_id          INTEGER,
        result_type_id   INTEGER NOT NULL,
        rank             INTEGER,
        time_seconds     INTEGER,
        points           INTEGER,
        is_breakaway     INTEGER,
        leadout_rider_id INTEGER,
        leadout_bonus    REAL,
        breakaway_kms    REAL,
        event_ids        TEXT,
        jerseys_worn     TEXT
      )
    `).run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_results_flat_rider_type ON results_flat(rider_id, result_type_id)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_results_flat_stage_type ON results_flat(stage_id, result_type_id)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_results_flat_team ON results_flat(team_id)').run();

    db.prepare(`
      CREATE TABLE IF NOT EXISTS stage_entries_flat (
        stage_id      INTEGER NOT NULL,
        race_id       INTEGER NOT NULL,
        team_id       INTEGER,
        rider_id      INTEGER,
        status        TEXT,
        status_reason TEXT
      )
    `).run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_stage_entries_flat_rider ON stage_entries_flat(rider_id)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_stage_entries_flat_stage ON stage_entries_flat(stage_id)').run();

    // Einmaliger Backfill aus den bestehenden Views (live + kompaktiert +
    // Historie), damit Altdaten vorhandener Saves vollstaendig vorliegen.
    try {
      if (!tableExists(db, 'career_meta') || !tableExists(db, 'results')) {
        return;
      }
      const flag = db.prepare(`SELECT value FROM career_meta WHERE key = 'results_flat_backfill_v1'`).get() as { value: string } | undefined;
      if (flag) {
        return;
      }
      db.prepare('DELETE FROM results_flat').run();
      db.prepare(`
        INSERT INTO results_flat (
          race_id, stage_id, rider_id, team_id, result_type_id, rank, time_seconds,
          points, is_breakaway, leadout_rider_id, leadout_bonus, breakaway_kms, event_ids, jerseys_worn
        )
        SELECT
          race_id, stage_id, rider_id, team_id, result_type_id, rank, time_seconds,
          points, is_breakaway, leadout_rider_id, leadout_bonus, breakaway_kms, event_ids, jerseys_worn
        FROM all_results
      `).run();
      db.prepare('DELETE FROM stage_entries_flat').run();
      db.prepare(`
        INSERT INTO stage_entries_flat (stage_id, race_id, team_id, rider_id, status, status_reason)
        SELECT stage_id, race_id, team_id, rider_id, status, status_reason
        FROM all_stage_entries
      `).run();
      db.prepare(`
        INSERT INTO career_meta (key, value) VALUES ('results_flat_backfill_v1', '1')
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `).run();
    } catch (e) {
      console.error('results_flat-Backfill fehlgeschlagen (wird beim naechsten Start erneut versucht):', e);
    }

    this.ensureYouthResultsFlatBackfill(db);
  }

  /**
   * Die Nachwuchswertung (Ergebnistyp 5) wurde historisch nie als Ergebnis
   * abgelegt (nur Trikot/Statistik). Damit das weisse Trikot auch fuer bereits
   * gefahrene Etappenrennen in der Fahrer-Ergebnisliste erscheint, wird die
   * U25-Schlusswertung einmalig aus den vorhandenen GC-Ergebnissen (Typ 2) der
   * Schlussetappen rekonstruiert (Fahrer <= 25 im Rennjahr, neu durchnummeriert)
   * und in results_flat eingefuegt. Neue Rennen schreiben Typ 5 direkt beim
   * Commit. Nur Schlussetappen, da nur diese in der Ergebnisliste ausgewertet
   * werden.
   */
  private ensureYouthResultsFlatBackfill(db: Database.Database): void {
    try {
      if (!tableExists(db, 'results_flat') || !tableExists(db, 'career_meta')
        || !tableExists(db, 'riders') || !tableExists(db, 'stages') || !tableExists(db, 'races')) {
        return;
      }
      const flag = db.prepare(`SELECT value FROM career_meta WHERE key = 'youth_results_flat_backfill_v1'`).get() as { value: string } | undefined;
      if (flag) {
        return;
      }
      db.prepare(`
        INSERT INTO results_flat (race_id, stage_id, rider_id, team_id, result_type_id, rank, time_seconds, points)
        SELECT gc.race_id, gc.stage_id, gc.rider_id, gc.team_id, 5 AS result_type_id,
               ROW_NUMBER() OVER (PARTITION BY gc.stage_id ORDER BY gc.rank) AS rank,
               gc.time_seconds, NULL
        FROM results_flat gc
        JOIN stages s ON s.id = gc.stage_id
        JOIN races ra ON ra.id = s.race_id
        JOIN riders ri ON ri.id = gc.rider_id
        WHERE gc.result_type_id = 2
          AND gc.rider_id IS NOT NULL
          AND ra.is_stage_race = 1
          AND s.stage_number = ra.number_of_stages
          AND (CAST(substr(s.date, 1, 4) AS INTEGER) - ri.birth_year) <= 25
          AND NOT EXISTS (
            SELECT 1 FROM results_flat y
            WHERE y.stage_id = gc.stage_id AND y.result_type_id = 5
          )
      `).run();
      db.prepare(`
        INSERT INTO career_meta (key, value) VALUES ('youth_results_flat_backfill_v1', '1')
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `).run();
    } catch (e) {
      console.error('Youth-results_flat-Backfill fehlgeschlagen (wird beim naechsten Start erneut versucht):', e);
    }
  }

  /**
   * Einmalige Backfills fuer die abgeleiteten Karrierewerte, die neu am Commit
   * gepflegt werden:
   * - total_km: Historisch nie korrekt akkumuliert (stage.distanceKm war leer).
   *   Wird aus den geparsten Etappendistanzen der beendeten Etappen neu berechnet
   *   (Grundlage fuer "Around the World").
   * - bunch_sprint_wins: Massensprint-Siege (Zielgruppe > 25). Aus results_flat
   *   rekonstruierbar, solange die volle Zielreihenfolge vorliegt (aktuelle,
   *   noch nicht am Saisonende geprunte Saison); aeltere Saisons zaehlen ab
   *   Backfill nur, was an Zieldaten erhalten blieb — vorwaerts zaehlt der
   *   Commit korrekt weiter.
   */
  private ensureCareerDerivedBackfills(db: Database.Database): void {
    if (!tableExists(db, 'career_meta') || !tableExists(db, 'rider_career_stats')) {
      return;
    }

    // --- total_km ---
    try {
      const flag = db.prepare(`SELECT value FROM career_meta WHERE key = 'career_total_km_backfill_v1'`).get() as { value: string } | undefined;
      if (!flag && tableExists(db, 'stage_entries_flat') && tableExists(db, 'stages')) {
        const stages = db.prepare('SELECT id, details_csv_file, start_elevation FROM stages').all() as Array<{ id: number; details_csv_file: string; start_elevation: number }>;
        const distByStage = new Map<number, number>();
        for (const s of stages) {
          try {
            distByStage.set(s.id, summarizeStageProfile(s.details_csv_file, s.start_elevation).distanceKm ?? 0);
          } catch {
            distByStage.set(s.id, 0);
          }
        }
        const entries = db.prepare(`SELECT rider_id, stage_id FROM stage_entries_flat WHERE status = 'finished' AND rider_id IS NOT NULL`).all() as Array<{ rider_id: number; stage_id: number }>;
        const kmByRider = new Map<number, number>();
        for (const e of entries) {
          kmByRider.set(e.rider_id, (kmByRider.get(e.rider_id) ?? 0) + (distByStage.get(e.stage_id) ?? 0));
        }
        const upd = db.prepare('UPDATE rider_career_stats SET total_km = ? WHERE rider_id = ?');
        db.transaction(() => {
          for (const [riderId, km] of kmByRider) {
            upd.run(km, riderId);
          }
        })();
        db.prepare(`INSERT INTO career_meta (key, value) VALUES ('career_total_km_backfill_v1', '1') ON CONFLICT(key) DO UPDATE SET value = excluded.value`).run();
      }
    } catch (e) {
      console.error('total_km-Backfill fehlgeschlagen (wird beim naechsten Start erneut versucht):', e);
    }

    // --- bunch_sprint_wins ---
    try {
      const flag = db.prepare(`SELECT value FROM career_meta WHERE key = 'bunch_sprint_backfill_v2'`).get() as { value: string } | undefined;
      if (!flag && columnExists(db, 'rider_career_stats', 'bunch_sprint_wins') && tableExists(db, 'results_flat')) {
        const rows = db.prepare(`
          SELECT stage_id, rider_id, rank, time_seconds, is_breakaway
          FROM results_flat
          WHERE result_type_id = 1 AND rider_id IS NOT NULL AND time_seconds IS NOT NULL
        `).all() as Array<{ stage_id: number; rider_id: number; rank: number; time_seconds: number; is_breakaway: number }>;
        const byStage = new Map<number, Array<{ rider_id: number; rank: number; time_seconds: number; is_breakaway: number }>>();
        for (const r of rows) {
          let arr = byStage.get(r.stage_id);
          if (!arr) { arr = []; byStage.set(r.stage_id, arr); }
          arr.push(r);
        }
        const bunchByRider = new Map<number, number>();
        for (const arr of byStage.values()) {
          const winner = arr.find((r) => r.rank === 1);
          if (!winner) continue;
          // Tie-Break-Fenster (<= 1 s zum Sieger), mindestens 25 Fahrer.
          // Terrain und Ausreisser-Status spielen keine Rolle.
          const group = arr.filter((r) => (r.time_seconds - winner.time_seconds) <= 1).length;
          if (group >= 25) {
            bunchByRider.set(winner.rider_id, (bunchByRider.get(winner.rider_id) ?? 0) + 1);
          }
        }
        const upd = db.prepare('UPDATE rider_career_stats SET bunch_sprint_wins = ? WHERE rider_id = ?');
        db.transaction(() => {
          for (const [riderId, count] of bunchByRider) {
            upd.run(count, riderId);
          }
        })();
        db.prepare(`INSERT INTO career_meta (key, value) VALUES ('bunch_sprint_backfill_v2', '1') ON CONFLICT(key) DO UPDATE SET value = excluded.value`).run();
      }
    } catch (e) {
      console.error('bunch_sprint-Backfill fehlgeschlagen (wird beim naechsten Start erneut versucht):', e);
    }

    // --- full_moon_wins ---
    // Etappensieger (rank 1) ueberleben das Saison-Pruning immer, daher ist die
    // Vollmond-Siegzahl vollstaendig aus results_flat rekonstruierbar.
    try {
      const flag = db.prepare(`SELECT value FROM career_meta WHERE key = 'full_moon_backfill_v1'`).get() as { value: string } | undefined;
      if (!flag && columnExists(db, 'rider_career_stats', 'full_moon_wins') && tableExists(db, 'results_flat') && tableExists(db, 'stages')) {
        const rows = db.prepare(`
          SELECT rf.rider_id AS rider_id, s.date AS date
          FROM results_flat rf
          JOIN stages s ON s.id = rf.stage_id
          WHERE rf.result_type_id = 1 AND rf.rank = 1 AND rf.rider_id IS NOT NULL
        `).all() as Array<{ rider_id: number; date: string }>;
        const byRider = new Map<number, number>();
        for (const r of rows) {
          if (isFullMoonDate(r.date)) {
            byRider.set(r.rider_id, (byRider.get(r.rider_id) ?? 0) + 1);
          }
        }
        const upd = db.prepare('UPDATE rider_career_stats SET full_moon_wins = ? WHERE rider_id = ?');
        db.transaction(() => {
          for (const [riderId, count] of byRider) {
            upd.run(count, riderId);
          }
        })();
        db.prepare(`INSERT INTO career_meta (key, value) VALUES ('full_moon_backfill_v1', '1') ON CONFLICT(key) DO UPDATE SET value = excluded.value`).run();
      }
    } catch (e) {
      console.error('full_moon-Backfill fehlgeschlagen (wird beim naechsten Start erneut versucht):', e);
    }

    // --- Night Shift: Podium (Top 3) an Vollmondtagen ---
    // Teilweise rekonstruierbar: rank-1-Zeilen ueberleben immer, rank 2/3 nur
    // bei Punktevergabe. Seed aus dem Vorhandenen; ab jetzt wird beim Commit
    // vollstaendig weitergezaehlt.
    try {
      const flag = db.prepare(`SELECT value FROM career_meta WHERE key = 'full_moon_podium_backfill_v1'`).get() as { value: string } | undefined;
      if (!flag && columnExists(db, 'rider_career_stats', 'full_moon_podiums') && tableExists(db, 'results_flat') && tableExists(db, 'stages')) {
        const rows = db.prepare(`
          SELECT rf.rider_id AS rider_id, s.date AS date
          FROM results_flat rf
          JOIN stages s ON s.id = rf.stage_id
          WHERE rf.result_type_id = 1 AND rf.rank <= 3 AND rf.rider_id IS NOT NULL
        `).all() as Array<{ rider_id: number; date: string }>;
        const byRider = new Map<number, number>();
        for (const r of rows) {
          if (isFullMoonDate(r.date)) byRider.set(r.rider_id, (byRider.get(r.rider_id) ?? 0) + 1);
        }
        const upd = db.prepare('UPDATE rider_career_stats SET full_moon_podiums = ? WHERE rider_id = ?');
        db.transaction(() => { for (const [rid, c] of byRider) upd.run(c, rid); })();
        db.prepare(`INSERT INTO career_meta (key, value) VALUES ('full_moon_podium_backfill_v1', '1') ON CONFLICT(key) DO UPDATE SET value = excluded.value`).run();
      }
    } catch (e) {
      console.error('full_moon_podium-Backfill fehlgeschlagen (wird beim naechsten Start erneut versucht):', e);
    }

    // --- Wardrobe Malfunction: mehrere Fuehrungstrikots an einem Tag ---
    // jerseys_worn (kommagetrennt) liegt auf den Etappenzeilen; rank-1 ueberlebt
    // immer, sonst nur bei Punktevergabe. Seed aus dem Vorhandenen.
    try {
      const flag = db.prepare(`SELECT value FROM career_meta WHERE key = 'multi_jersey_backfill_v1'`).get() as { value: string } | undefined;
      if (!flag && columnExists(db, 'rider_career_stats', 'multi_jersey_days') && tableExists(db, 'results_flat')) {
        const rows = db.prepare(`
          SELECT rider_id, jerseys_worn FROM results_flat
          WHERE result_type_id = 1 AND rider_id IS NOT NULL AND jerseys_worn IS NOT NULL AND jerseys_worn != ''
        `).all() as Array<{ rider_id: number; jerseys_worn: string }>;
        const byRider = new Map<number, number>();
        for (const r of rows) {
          if (r.jerseys_worn.split(',').filter((t) => t.trim() !== '').length >= 2) {
            byRider.set(r.rider_id, (byRider.get(r.rider_id) ?? 0) + 1);
          }
        }
        const upd = db.prepare('UPDATE rider_career_stats SET multi_jersey_days = ? WHERE rider_id = ?');
        db.transaction(() => { for (const [rid, c] of byRider) upd.run(c, rid); })();
        db.prepare(`INSERT INTO career_meta (key, value) VALUES ('multi_jersey_backfill_v1', '1') ON CONFLICT(key) DO UPDATE SET value = excluded.value`).run();
      }
    } catch (e) {
      console.error('multi_jersey-Backfill fehlgeschlagen (wird beim naechsten Start erneut versucht):', e);
    }

    // --- Welle 2: Distanz-/Hoehenmeter-Siege (Long Haul / Stamina / Vertical) ---
    // Etappensieger (rank 1, Typ 1) ueberleben das Pruning; Distanz und Anstieg
    // werden aus dem Streckenprofil rekonstruiert. Ein Sieger je Etappe.
    try {
      const flag = db.prepare(`SELECT value FROM career_meta WHERE key = 'wave2_backfill_v1'`).get() as { value: string } | undefined;
      if (!flag && columnExists(db, 'rider_career_stats', 'long_haul_wins') && tableExists(db, 'results_flat') && tableExists(db, 'stages')) {
        const rows = db.prepare(`
          SELECT rf.rider_id AS rider_id, s.details_csv_file AS csv, s.start_elevation AS elev
          FROM results_flat rf JOIN stages s ON s.id = rf.stage_id
          WHERE rf.result_type_id = 1 AND rf.rank = 1 AND rf.rider_id IS NOT NULL
        `).all() as Array<{ rider_id: number; csv: string | null; elev: number | null }>;
        const longH = new Map<number, number>(), stam = new Map<number, number>(), vert = new Map<number, number>();
        for (const r of rows) {
          let dist = 0, gain = 0;
          try {
            const sum = summarizeStageProfile(r.csv ?? '', r.elev ?? 0);
            dist = sum.distanceKm ?? 0; gain = sum.elevationGainMeters ?? 0;
          } catch { continue; }
          if (dist > 200) longH.set(r.rider_id, (longH.get(r.rider_id) ?? 0) + 1);
          if (dist > 240) stam.set(r.rider_id, (stam.get(r.rider_id) ?? 0) + 1);
          if (gain > 4000) vert.set(r.rider_id, (vert.get(r.rider_id) ?? 0) + 1);
        }
        const upd = db.prepare('UPDATE rider_career_stats SET long_haul_wins = ?, stamina_wins = ?, vertical_limit_wins = ? WHERE rider_id = ?');
        const ids = new Set<number>([...longH.keys(), ...stam.keys(), ...vert.keys()]);
        db.transaction(() => { for (const id of ids) upd.run(longH.get(id) ?? 0, stam.get(id) ?? 0, vert.get(id) ?? 0, id); })();
        db.prepare(`INSERT INTO career_meta (key, value) VALUES ('wave2_backfill_v1', '1') ON CONFLICT(key) DO UPDATE SET value = excluded.value`).run();
      }
    } catch (e) {
      console.error('wave2-Backfill fehlgeschlagen (wird beim naechsten Start erneut versucht):', e);
    }

    // --- The Cat: Podium (Top 3) mit Sturz-Event in derselben Etappe ---
    // Top-3-Zeilen ueberleben das Pruning (Punktevergabe), event_ids ist dort
    // hinterlegt (Sturz = Code "1"). Damit vollstaendig rekonstruierbar.
    try {
      const flag = db.prepare(`SELECT value FROM career_meta WHERE key = 'cat_backfill_v1'`).get() as { value: string } | undefined;
      if (!flag && columnExists(db, 'rider_career_stats', 'cat_podiums') && tableExists(db, 'results_flat')) {
        const rows = db.prepare(`
          SELECT rider_id, event_ids FROM results_flat
          WHERE result_type_id = 1 AND rank <= 3 AND rider_id IS NOT NULL AND event_ids IS NOT NULL
        `).all() as Array<{ rider_id: number; event_ids: string }>;
        const hasCrash = (eventIds: string) => eventIds.split('|').some((p) => p.startsWith('1:'));
        const byRider = new Map<number, number>();
        for (const r of rows) {
          if (hasCrash(r.event_ids)) byRider.set(r.rider_id, (byRider.get(r.rider_id) ?? 0) + 1);
        }
        const upd = db.prepare('UPDATE rider_career_stats SET cat_podiums = ? WHERE rider_id = ?');
        db.transaction(() => { for (const [rid, c] of byRider) upd.run(c, rid); })();
        db.prepare(`INSERT INTO career_meta (key, value) VALUES ('cat_backfill_v1', '1') ON CONFLICT(key) DO UPDATE SET value = excluded.value`).run();
      }
    } catch (e) {
      console.error('cat-Backfill fehlgeschlagen (wird beim naechsten Start erneut versucht):', e);
    }

    // --- Ghost: GC-Top-10 an der Schlussetappe ohne je GC-Top-30 ---
    // Nur zaehlbar, wo die GC-Historie der Vor-Etappen erhalten ist (aktuelle,
    // noch nicht am Saisonende geprunte Saison). Fehlt sie, wird abstiniert.
    try {
      const flag = db.prepare(`SELECT value FROM career_meta WHERE key = 'ghost_backfill_v1'`).get() as { value: string } | undefined;
      if (!flag && columnExists(db, 'rider_career_stats', 'ghost_top10') && tableExists(db, 'results_flat') && tableExists(db, 'stages')) {
        const rows = db.prepare(`
          SELECT rf.rider_id AS rider_id, s.race_id AS race_id, s.stage_number AS stage_number,
                 ra.number_of_stages AS num_stages, rf.rank AS rank
          FROM results_flat rf
          JOIN stages s ON s.id = rf.stage_id
          JOIN races ra ON ra.id = s.race_id
          WHERE rf.result_type_id = 2 AND rf.rider_id IS NOT NULL AND ra.is_stage_race = 1
        `).all() as Array<{ rider_id: number; race_id: number; stage_number: number; num_stages: number; rank: number }>;
        // Pro (race, rider): Endrang und bester Vor-Etappen-Rang.
        const acc = new Map<string, { finalRank: number | null; priorBest: number | null; numStages: number }>();
        for (const r of rows) {
          const key = `${r.race_id}:${r.rider_id}`;
          let e = acc.get(key);
          if (!e) { e = { finalRank: null, priorBest: null, numStages: r.num_stages }; acc.set(key, e); }
          if (r.stage_number === r.num_stages) e.finalRank = r.rank;
          else e.priorBest = e.priorBest == null ? r.rank : Math.min(e.priorBest, r.rank);
        }
        const byRider = new Map<number, number>();
        for (const [key, e] of acc) {
          const rid = Number(key.split(':')[1]);
          if (e.finalRank != null && e.finalRank <= 10 && e.priorBest != null && e.priorBest > 30) {
            byRider.set(rid, (byRider.get(rid) ?? 0) + 1);
          }
        }
        const upd = db.prepare('UPDATE rider_career_stats SET ghost_top10 = ? WHERE rider_id = ?');
        db.transaction(() => { for (const [rid, c] of byRider) upd.run(c, rid); })();
        db.prepare(`INSERT INTO career_meta (key, value) VALUES ('ghost_backfill_v1', '1') ON CONFLICT(key) DO UPDATE SET value = excluded.value`).run();
      }
    } catch (e) {
      console.error('ghost-Backfill fehlgeschlagen (wird beim naechsten Start erneut versucht):', e);
    }

    // --- Nation Express: verschiedene Laender mit Rennteilnahme ---
    // Seed aus der besten verfuegbaren Quelle: den Teilnahmelisten
    // (race_entries_compact, vollstaendig fuer die erhaltenen Saisons) und
    // ergaenzend results_flat (deckt aeltere Sieg-/Punktespuren ausserhalb der
    // Compact-Retention ab). Ab dem Seed wird der Zaehler beim Commit gepflegt.
    try {
      const flag = db.prepare(`SELECT value FROM career_meta WHERE key = 'nation_express_backfill_v1'`).get() as { value: string } | undefined;
      if (!flag && columnExists(db, 'rider_career_stats', 'raced_country_ids') && tableExists(db, 'races')) {
        const byRider = new Map<number, Set<number>>();
        const add = (rid: number | null | undefined, cid: number | null | undefined) => {
          if (rid == null || cid == null) return;
          let s = byRider.get(rid);
          if (!s) { s = new Set<number>(); byRider.set(rid, s); }
          s.add(cid);
        };
        const countryByRace = new Map<number, number>();
        for (const r of db.prepare('SELECT id, country_id FROM races').all() as Array<{ id: number; country_id: number | null }>) {
          if (r.country_id != null) countryByRace.set(r.id, r.country_id);
        }
        // Quelle 1: Teilnahmelisten [[team_id, rider_id], ...] pro Rennen.
        if (tableExists(db, 'race_entries_compact')) {
          for (const row of db.prepare('SELECT race_id, payload FROM race_entries_compact').all() as Array<{ race_id: number; payload: string }>) {
            const cid = countryByRace.get(row.race_id);
            if (cid == null) continue;
            try {
              const arr = JSON.parse(row.payload);
              if (Array.isArray(arr)) for (const e of arr) { if (Array.isArray(e)) add(e[1] as number, cid); }
            } catch { /* defektes Payload ueberspringen */ }
          }
        }
        // Quelle 2: results_flat (aeltere erhaltene Spuren).
        if (tableExists(db, 'results_flat') && tableExists(db, 'stages')) {
          for (const r of db.prepare(`
            SELECT DISTINCT rf.rider_id AS rid, ra.country_id AS cid
            FROM results_flat rf
            JOIN stages s ON s.id = rf.stage_id
            JOIN races ra ON ra.id = s.race_id
            WHERE rf.rider_id IS NOT NULL AND ra.country_id IS NOT NULL
          `).all() as Array<{ rid: number; cid: number }>) {
            add(r.rid, r.cid);
          }
        }
        const existing = db.prepare('SELECT rider_id, raced_country_ids FROM rider_career_stats').all() as Array<{ rider_id: number; raced_country_ids: string | null }>;
        const upd = db.prepare('UPDATE rider_career_stats SET raced_country_ids = ? WHERE rider_id = ?');
        db.transaction(() => {
          for (const row of existing) {
            const s = byRider.get(row.rider_id) ?? new Set<number>();
            if (row.raced_country_ids) {
              for (const tok of String(row.raced_country_ids).split(',')) { const n = Number(tok); if (Number.isInteger(n)) s.add(n); }
            }
            if (s.size > 0) upd.run([...s].sort((a, b) => a - b).join(','), row.rider_id);
          }
        })();
        db.prepare(`INSERT INTO career_meta (key, value) VALUES ('nation_express_backfill_v1', '1') ON CONFLICT(key) DO UPDATE SET value = excluded.value`).run();
      }
    } catch (e) {
      console.error('nation-express-Backfill fehlgeschlagen (wird beim naechsten Start erneut versucht):', e);
    }
  }

  private ensureRiderCategoryStatsSchema(db: Database.Database): void {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS stage_entries_compact (
        race_id  INTEGER PRIMARY KEY REFERENCES races(id) ON DELETE CASCADE,
        season   INTEGER NOT NULL,
        payload  TEXT    NOT NULL
      )
    `).run();

    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_stage_entries_compact_season
        ON stage_entries_compact(season)
    `).run();

    db.prepare(`DROP VIEW IF EXISTS stage_entries_history;`).run();

    db.prepare(`
      CREATE VIEW stage_entries_history AS
      SELECT
        s.id AS stage_id,
        c.race_id AS race_id,
        CAST(j.value->>1 AS INTEGER) AS team_id,
        CAST(j.value->>2 AS INTEGER) AS rider_id,
        j.value->>3 AS status,
        j.value->>4 AS status_reason
      FROM stage_entries_compact c
      JOIN stages s ON s.race_id = c.race_id,
      json_each(c.payload) j
      WHERE CAST(j.value->>0 AS INTEGER) = s.id
    `).run();

    db.prepare(`DROP VIEW IF EXISTS all_stage_entries;`).run();

    db.prepare(`
      CREATE VIEW all_stage_entries AS
      SELECT * FROM stage_entries
      UNION ALL
      SELECT * FROM stage_entries_history;
    `).run();

    const careerColumns = [
      ['dns_count', 'INTEGER NOT NULL DEFAULT 0'],
      ['dnf_count', 'INTEGER NOT NULL DEFAULT 0'],
      ['otl_count', 'INTEGER NOT NULL DEFAULT 0'],
      ['breakaway_kms', 'REAL NOT NULL DEFAULT 0.0'],
      ['successful_breakaways', 'INTEGER NOT NULL DEFAULT 0'],
      ['race_days', 'INTEGER NOT NULL DEFAULT 0'],
      ['superform_days', 'INTEGER NOT NULL DEFAULT 0'],
      ['supermalus_days', 'INTEGER NOT NULL DEFAULT 0'],
      ['home_advantage_days', 'INTEGER NOT NULL DEFAULT 0'],
      ['super_home_advantage_days', 'INTEGER NOT NULL DEFAULT 0'],
      ['home_pressure_days', 'INTEGER NOT NULL DEFAULT 0'],
      ['total_km', 'REAL NOT NULL DEFAULT 0'],
      ['bunch_sprint_wins', 'INTEGER NOT NULL DEFAULT 0'],
      ['full_moon_wins', 'INTEGER NOT NULL DEFAULT 0'],
      ['cat_podiums', 'INTEGER NOT NULL DEFAULT 0'],
      ['ghost_top10', 'INTEGER NOT NULL DEFAULT 0'],
      // Nation Express: serialisierte, aufsteigend sortierte Liste der
      // Laender-IDs, in denen der Fahrer an einem Rennen teilgenommen hat
      // (kommagetrennt). Persistenter Akkumulator, da Teilnahme-Rohdaten dem
      // Saison-Pruning zum Opfer fallen.
      ['raced_country_ids', 'TEXT'],
      // Kuriositaeten-Badges Welle B (beim Commit gepflegt).
      ['full_moon_podiums', 'INTEGER NOT NULL DEFAULT 0'],   // Night Shift
      ['clean_streak_current', 'INTEGER NOT NULL DEFAULT 0'], // Iron Horse (laufend)
      ['clean_streak_best', 'INTEGER NOT NULL DEFAULT 0'],    // Iron Horse (Rekord)
      ['grand_tours_finished', 'INTEGER NOT NULL DEFAULT 0'], // Marathon Finisher
      ['multi_jersey_days', 'INTEGER NOT NULL DEFAULT 0'],    // Wardrobe Malfunction
      // Welle 2 (Distanz/Hoehenmeter der Siegetappe).
      ['long_haul_wins', 'INTEGER NOT NULL DEFAULT 0'],       // Long Haul Specialist (> 200 km)
      ['stamina_wins', 'INTEGER NOT NULL DEFAULT 0'],         // Stamina Machine (> 240 km)
      ['vertical_limit_wins', 'INTEGER NOT NULL DEFAULT 0'],  // Vertical Limit (> 4000 hm)
      // Welle 3 (Positionen; ab jetzt beim Commit gepflegt, kein Backfill —
      // Nicht-Sieger-/Endpositionszeilen werden geprunt).
      ['lanterne_rouge_stage', 'INTEGER NOT NULL DEFAULT 0'], // Lanterne Rouge (Etappe/Eintagesrennen)
      ['lanterne_rouge_gt', 'INTEGER NOT NULL DEFAULT 0'],    // Red Lantern Legend (Grand-Tour-GC)
      ['lanterne_rouge_sr', 'INTEGER NOT NULL DEFAULT 0'],    // Broom Wagon Regular (uebrige Stage-Race-GC)
      ['time_cut_finishes', 'INTEGER NOT NULL DEFAULT 0'],    // Time Cut Specialist
      ['team_effort_podiums', 'INTEGER NOT NULL DEFAULT 0'],  // Team Effort
      ['one_man_team', 'INTEGER NOT NULL DEFAULT 0'],         // One Man Team
      ['gc_by_seconds', 'INTEGER NOT NULL DEFAULT 0'],        // GC by Seconds
      ['bitter_end_dnf', 'INTEGER NOT NULL DEFAULT 0'],       // Not to the bitter end
      // Welle 4 (Back-to-Back-Siege): laufende und beste Siegesserie an
      // aufeinanderfolgenden Renntagen des Fahrers (Tage ohne Rennen zaehlen
      // nicht). Ab jetzt gepflegt, kein Backfill (Nicht-Sieg-Renntage geprunt).
      ['win_streak_current', 'INTEGER NOT NULL DEFAULT 0'],
      ['win_streak_best', 'INTEGER NOT NULL DEFAULT 0'],
      // Welle 7 (ab jetzt gepflegt, kein Backfill).
      ['peak_performer_wins', 'INTEGER NOT NULL DEFAULT 0'], // Sieg mit kombinierter R+S-Form > 7,5
      ['yoyo_races', 'INTEGER NOT NULL DEFAULT 0'],          // >= 10 Attacken in einem Etappenrennen
      // Welle 9 (ab jetzt gepflegt, kein Backfill).
      ['escape_to_victory', 'INTEGER NOT NULL DEFAULT 0'],   // Solo-Sieg mit > 1 min Vorsprung
      ['podium_lockout', 'INTEGER NOT NULL DEFAULT 0'],      // Teil eines Team-Dreifachsiegs (1-2-3)
      ['jersey_streak_current', 'INTEGER NOT NULL DEFAULT 0'], // laufende Trikot-Serie
      ['jersey_streak_best', 'INTEGER NOT NULL DEFAULT 0'],  // laengste Trikot-Serie (Jersey Guardian)
      ['photo_finish_wins', 'INTEGER NOT NULL DEFAULT 0'],   // Siege per Zielfoto (Photo Finish King)
      ['so_close', 'INTEGER NOT NULL DEFAULT 0'],            // Zweiter per Zielfoto (So Close)
      // WM/EM-Titel (Karriere-Zaehler; ein Titel je Edition). Speisen die vier
      // HoF-Einzelbadges Weltmeister / Weltmeister ITT / Europameister /
      // Europameister ITT.
      ['world_champion_road_titles', 'INTEGER NOT NULL DEFAULT 0'],
      ['world_champion_itt_titles', 'INTEGER NOT NULL DEFAULT 0'],
      ['euro_champion_road_titles', 'INTEGER NOT NULL DEFAULT 0'],
      ['euro_champion_itt_titles', 'INTEGER NOT NULL DEFAULT 0'],
      // Nationale Meistertitel (Karriere-Zaehler) fuer HoF-Badges.
      ['national_champion_road_titles', 'INTEGER NOT NULL DEFAULT 0'],
      ['national_champion_itt_titles', 'INTEGER NOT NULL DEFAULT 0'],
      // U23-/Junioren-WM+EM sowie Olympia (Karriere-Zaehler) fuer die goldenen
      // Hall-of-Fame-Badges (ein Titel je Edition).
      ['world_u23_champion_road_titles', 'INTEGER NOT NULL DEFAULT 0'],
      ['world_u23_champion_itt_titles', 'INTEGER NOT NULL DEFAULT 0'],
      ['euro_u23_champion_road_titles', 'INTEGER NOT NULL DEFAULT 0'],
      ['euro_u23_champion_itt_titles', 'INTEGER NOT NULL DEFAULT 0'],
      ['world_junior_champion_road_titles', 'INTEGER NOT NULL DEFAULT 0'],
      ['world_junior_champion_itt_titles', 'INTEGER NOT NULL DEFAULT 0'],
      ['euro_junior_champion_road_titles', 'INTEGER NOT NULL DEFAULT 0'],
      ['euro_junior_champion_itt_titles', 'INTEGER NOT NULL DEFAULT 0'],
      ['olympic_champion_road_titles', 'INTEGER NOT NULL DEFAULT 0'],
      ['olympic_champion_itt_titles', 'INTEGER NOT NULL DEFAULT 0'],
    ] as const;

    for (const [colName, colDef] of careerColumns) {
      if (!columnExists(db, 'rider_career_stats', colName)) {
        db.prepare(`ALTER TABLE rider_career_stats ADD COLUMN ${colName} ${colDef}`).run();
      }
    }

    const seasonColumns = [
      ['successful_breakaways', 'INTEGER NOT NULL DEFAULT 0'],
      ['race_days', 'INTEGER NOT NULL DEFAULT 0'],
      ['total_km', 'REAL NOT NULL DEFAULT 0'],
    ] as const;

    for (const [colName, colDef] of seasonColumns) {
      if (!columnExists(db, 'rider_season_stats', colName)) {
        db.prepare(`ALTER TABLE rider_season_stats ADD COLUMN ${colName} ${colDef}`).run();
      }
    }

    const commonCategoryFields = `
      gc_wins INTEGER NOT NULL DEFAULT 0,
      gc_second INTEGER NOT NULL DEFAULT 0,
      gc_third INTEGER NOT NULL DEFAULT 0,
      gc_top_ten INTEGER NOT NULL DEFAULT 0,
      stage_wins INTEGER NOT NULL DEFAULT 0,
      stage_second INTEGER NOT NULL DEFAULT 0,
      stage_third INTEGER NOT NULL DEFAULT 0,
      stage_top_ten INTEGER NOT NULL DEFAULT 0,
      one_day_wins INTEGER NOT NULL DEFAULT 0,
      one_day_second INTEGER NOT NULL DEFAULT 0,
      one_day_third INTEGER NOT NULL DEFAULT 0,
      one_day_top_ten INTEGER NOT NULL DEFAULT 0,
      mountain_wins INTEGER NOT NULL DEFAULT 0,
      points_wins INTEGER NOT NULL DEFAULT 0,
      youth_wins INTEGER NOT NULL DEFAULT 0,
      breakaway_wins INTEGER NOT NULL DEFAULT 0,
      race_days INTEGER NOT NULL DEFAULT 0,
      leader_jerseys INTEGER NOT NULL DEFAULT 0,
      points_jerseys INTEGER NOT NULL DEFAULT 0,
      mountain_jerseys INTEGER NOT NULL DEFAULT 0,
      youth_jerseys INTEGER NOT NULL DEFAULT 0,
      breakaway_jerseys INTEGER NOT NULL DEFAULT 0,
      sprint_wins INTEGER NOT NULL DEFAULT 0,
      climb_wins_hc INTEGER NOT NULL DEFAULT 0,
      climb_wins_1 INTEGER NOT NULL DEFAULT 0,
      climb_wins_2 INTEGER NOT NULL DEFAULT 0,
      climb_wins_3 INTEGER NOT NULL DEFAULT 0,
      climb_wins_4 INTEGER NOT NULL DEFAULT 0,
      win_flat INTEGER NOT NULL DEFAULT 0,
      win_rolling INTEGER NOT NULL DEFAULT 0,
      win_hilly INTEGER NOT NULL DEFAULT 0,
      win_hilly_difficult INTEGER NOT NULL DEFAULT 0,
      win_medium_mountain INTEGER NOT NULL DEFAULT 0,
      win_mountain INTEGER NOT NULL DEFAULT 0,
      win_high_mountain INTEGER NOT NULL DEFAULT 0,
      win_cobble INTEGER NOT NULL DEFAULT 0,
      win_cobble_hill INTEGER NOT NULL DEFAULT 0,
      win_itt INTEGER NOT NULL DEFAULT 0,
      win_ttt INTEGER NOT NULL DEFAULT 0,
      win_weather_1 INTEGER NOT NULL DEFAULT 0,
      win_weather_2 INTEGER NOT NULL DEFAULT 0,
      win_weather_3 INTEGER NOT NULL DEFAULT 0,
      win_weather_4 INTEGER NOT NULL DEFAULT 0,
      win_weather_5 INTEGER NOT NULL DEFAULT 0,
      win_weather_6 INTEGER NOT NULL DEFAULT 0,
      win_weather_7 INTEGER NOT NULL DEFAULT 0
    `;

    db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_season_category_stats (
        rider_id INTEGER REFERENCES riders(id) ON DELETE CASCADE,
        season INTEGER NOT NULL,
        category_name TEXT NOT NULL,
        ${commonCategoryFields},
        PRIMARY KEY (rider_id, season, category_name)
      )
    `).run();

    db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_career_category_stats (
        rider_id INTEGER REFERENCES riders(id) ON DELETE CASCADE,
        category_name TEXT NOT NULL,
        ${commonCategoryFields},
        PRIMARY KEY (rider_id, category_name)
      )
    `).run();

    if (tableExists(db, 'stages') && tableExists(db, 'results')) {
      const hasSimulatedStages = db.prepare("SELECT 1 FROM all_results LIMIT 1").get() != null;
      const isCategoryStatsEmpty = db.prepare("SELECT 1 FROM rider_career_category_stats LIMIT 1").get() == null;
      
      if (hasSimulatedStages && isCategoryStatsEmpty) {
        console.log("Starting savegame stats migration...");
        this.migrateSavegameStats(db);
        console.log("Savegame stats migration completed successfully!");
      }
    }
  }

  private migrateSavegameStats(db: Database.Database): void {
    db.prepare(`
      INSERT OR IGNORE INTO rider_career_stats (rider_id)
      SELECT id FROM riders WHERE is_retired = 0
    `).run();

    const nonFinisherRows = db.prepare(`
      SELECT rider_id, status, status_reason
      FROM all_stage_entries
      WHERE status IN ('dns', 'dnf')
    `).all() as Array<{ rider_id: number; status: string; status_reason: string | null }>;

    const dnsCounts = new Map<number, number>();
    const dnfCounts = new Map<number, number>();
    const otlCounts = new Map<number, number>();

    for (const r of nonFinisherRows) {
      if (r.status === 'dns') {
        dnsCounts.set(r.rider_id, (dnsCounts.get(r.rider_id) ?? 0) + 1);
      } else if (r.status === 'dnf') {
        if (r.status_reason?.startsWith('OTL ')) {
          otlCounts.set(r.rider_id, (otlCounts.get(r.rider_id) ?? 0) + 1);
        } else {
          dnfCounts.set(r.rider_id, (dnfCounts.get(r.rider_id) ?? 0) + 1);
        }
      }
    }

    const raceDaysRows = db.prepare(`
      SELECT rider_id, COUNT(*) AS race_days
      FROM all_stage_entries
      WHERE status != 'dns'
      GROUP BY rider_id
    `).all() as Array<{ rider_id: number; race_days: number }>;
    const raceDaysMap = new Map<number, number>(raceDaysRows.map(r => [r.rider_id, r.race_days]));

    const updateCareerTotals = db.prepare(`
      UPDATE rider_career_stats
      SET dns_count = ?, dnf_count = ?, otl_count = ?, race_days = ?,
          breakaway_kms = COALESCE((SELECT SUM(breakaway_kms) FROM rider_season_stats WHERE rider_season_stats.rider_id = rider_career_stats.rider_id), 0.0),
          superform_days = COALESCE((SELECT SUM(superform_days) FROM rider_season_stats WHERE rider_season_stats.rider_id = rider_career_stats.rider_id), 0),
          supermalus_days = COALESCE((SELECT SUM(supermalus_days) FROM rider_season_stats WHERE rider_season_stats.rider_id = rider_career_stats.rider_id), 0),
          home_advantage_days = COALESCE((SELECT SUM(home_advantage_days) FROM rider_season_stats WHERE rider_season_stats.rider_id = rider_career_stats.rider_id), 0),
          super_home_advantage_days = COALESCE((SELECT SUM(super_home_advantage_days) FROM rider_season_stats WHERE rider_season_stats.rider_id = rider_career_stats.rider_id), 0),
          home_pressure_days = COALESCE((SELECT SUM(home_pressure_days) FROM rider_season_stats WHERE rider_season_stats.rider_id = rider_career_stats.rider_id), 0),
          total_km = COALESCE((SELECT SUM(total_km) FROM rider_season_stats WHERE rider_season_stats.rider_id = rider_career_stats.rider_id), 0)
      WHERE rider_id = ?
    `);

    const riders = db.prepare('SELECT id FROM riders WHERE is_retired = 0').all() as Array<{ id: number }>;
    db.transaction(() => {
      for (const r of riders) {
        updateCareerTotals.run(
          dnsCounts.get(r.id) ?? 0,
          dnfCounts.get(r.id) ?? 0,
          otlCounts.get(r.id) ?? 0,
          raceDaysMap.get(r.id) ?? 0,
          r.id
        );
      }
    })();

    const seasonRaceDays = db.prepare(`
      SELECT se.rider_id, CAST(substr(s.date, 1, 4) AS INTEGER) AS season, COUNT(*) AS race_days
      FROM all_stage_entries se
      JOIN stages s ON s.id = se.stage_id
      WHERE se.status != 'dns'
      GROUP BY se.rider_id, season
    `).all() as Array<{ rider_id: number; season: number; race_days: number }>;

    const updateSeasonRaceDays = db.prepare(`
      INSERT INTO rider_season_stats (rider_id, season, race_days)
      VALUES (?, ?, ?)
      ON CONFLICT(rider_id, season) DO UPDATE SET race_days = excluded.race_days
    `);

    db.transaction(() => {
      for (const r of seasonRaceDays) {
        updateSeasonRaceDays.run(r.rider_id, r.season, r.race_days);
      }
    })();

    const successfulBreakawaysQuery = db.prepare(`
      SELECT r1.rider_id, CAST(substr(s.date, 1, 4) AS INTEGER) AS season, COUNT(*) AS count
      FROM all_results r1
      JOIN stages s ON s.id = r1.stage_id
      WHERE r1.result_type_id = 1
        AND r1.is_breakaway = 1
        AND NOT EXISTS (
          SELECT 1 FROM all_results r2
          WHERE r2.stage_id = r1.stage_id
            AND r2.result_type_id = 1
            AND r2.rank < r1.rank
            AND r2.is_breakaway = 0
        )
      GROUP BY r1.rider_id, season
    `).all() as Array<{ rider_id: number; season: number; count: number }>;

    const updateSeasonBreakaway = db.prepare(`
      UPDATE rider_season_stats
      SET successful_breakaways = ?
      WHERE rider_id = ? AND season = ?
    `);

    const updateCareerBreakaway = db.prepare(`
      UPDATE rider_career_stats
      SET successful_breakaways = COALESCE((SELECT SUM(successful_breakaways) FROM rider_season_stats WHERE rider_season_stats.rider_id = rider_career_stats.rider_id), 0)
      WHERE rider_id = ?
    `);

    db.transaction(() => {
      for (const r of successfulBreakawaysQuery) {
        updateSeasonBreakaway.run(r.count, r.rider_id, r.season);
      }
      for (const r of riders) {
        updateCareerBreakaway.run(r.id);
      }
    })();

    const stages = db.prepare(`
      SELECT s.id AS stage_id, s.stage_number, s.profile, s.rolled_weather_id,
             r.id AS race_id, r.name AS race_name, r.is_stage_race, r.number_of_stages,
             cat.name AS category_name,
             CAST(substr(s.date, 1, 4) AS INTEGER) AS season
      FROM stages s
      JOIN races r ON r.id = s.race_id
      JOIN race_categories cat ON cat.id = r.category_id
    `).all() as any[];
    const stagesMap = new Map<number, any>(stages.map(s => [s.stage_id, s]));

    const statsMap = new Map<string, any>();

    const getOrCreateStats = (riderId: number, season: number, catName: string) => {
      const key = `${riderId}:${season}:${catName}`;
      let stats = statsMap.get(key);
      if (!stats) {
        stats = {
          rider_id: riderId,
          season,
          category_name: catName,
          gc_wins: 0, gc_second: 0, gc_third: 0, gc_top_ten: 0,
          stage_wins: 0, stage_second: 0, stage_third: 0, stage_top_ten: 0,
          one_day_wins: 0, one_day_second: 0, one_day_third: 0, one_day_top_ten: 0,
          mountain_wins: 0, points_wins: 0, youth_wins: 0, breakaway_wins: 0,
          race_days: 0,
          leader_jerseys: 0, points_jerseys: 0, mountain_jerseys: 0, youth_jerseys: 0, breakaway_jerseys: 0,
          sprint_wins: 0,
          climb_wins_hc: 0, climb_wins_1: 0, climb_wins_2: 0, climb_wins_3: 0, climb_wins_4: 0,
          win_flat: 0, win_rolling: 0, win_hilly: 0, win_hilly_difficult: 0, win_medium_mountain: 0, win_mountain: 0, win_high_mountain: 0, win_cobble: 0, win_cobble_hill: 0, win_itt: 0, win_ttt: 0,
          win_weather_1: 0, win_weather_2: 0, win_weather_3: 0, win_weather_4: 0, win_weather_5: 0, win_weather_6: 0, win_weather_7: 0
        };
        statsMap.set(key, stats);
      }
      return stats;
    };

    const entries = db.prepare(`
      SELECT stage_id, rider_id, status
      FROM all_stage_entries
      WHERE status != 'dns'
    `).all() as Array<{ stage_id: number; rider_id: number; status: string }>;

    for (const entry of entries) {
      const stage = stagesMap.get(entry.stage_id);
      if (!stage) continue;
      const stats = getOrCreateStats(entry.rider_id, stage.season, stage.category_name);
      stats.race_days++;
    }

    const tttFinisherMap = new Map<number, Map<number, Set<number>>>();
    const tttEntries = db.prepare(`
      SELECT se.stage_id, se.rider_id, se.team_id
      FROM all_stage_entries se
      JOIN stages s ON s.id = se.stage_id
      WHERE s.profile = 'TTT' AND se.status = 'finished'
    `).all() as Array<{ stage_id: number; rider_id: number; team_id: number }>;
    for (const e of tttEntries) {
      let stageMap = tttFinisherMap.get(e.stage_id);
      if (!stageMap) {
        stageMap = new Map<number, Set<number>>();
        tttFinisherMap.set(e.stage_id, stageMap);
      }
      let teamSet = stageMap.get(e.team_id);
      if (!teamSet) {
        teamSet = new Set<number>();
        stageMap.set(e.team_id, teamSet);
      }
      teamSet.add(e.rider_id);
    }

    const results = db.prepare(`
      SELECT stage_id, rider_id, team_id, result_type_id, rank
      FROM all_results
    `).all() as Array<{ stage_id: number; rider_id: number | null; team_id: number; result_type_id: number; rank: number }>;

    for (const r of results) {
      const stage = stagesMap.get(r.stage_id);
      if (!stage) continue;

      if (r.rider_id == null) {
        if (stage.profile === 'TTT' && r.result_type_id === 1) {
          const stageMap = tttFinisherMap.get(r.stage_id);
          const finishedRiders = stageMap?.get(r.team_id);
          if (finishedRiders) {
            for (const rId of finishedRiders) {
              const stats = getOrCreateStats(rId, stage.season, stage.category_name);
              if (r.rank === 1) {
                stats.stage_wins++;
                stats.win_ttt++;
                if (stage.rolled_weather_id != null && stage.rolled_weather_id >= 1 && stage.rolled_weather_id <= 7) {
                  stats[`win_weather_${stage.rolled_weather_id}`]++;
                }
              } else if (r.rank === 2) stats.stage_second++;
              else if (r.rank === 3) stats.stage_third++;
              else if (r.rank > 3 && r.rank <= 10) stats.stage_top_ten++;
            }
          }
        }
        continue;
      }

      const stats = getOrCreateStats(r.rider_id, stage.season, stage.category_name);

      if (r.result_type_id === 1) {
        const isStageRace = stage.is_stage_race === 1;
        const rank = r.rank;
        const prof = stage.profile.toLowerCase();

        const applyWinnerDetails = () => {
          if (prof === 'flat') stats.win_flat++;
          else if (prof === 'rolling') stats.win_rolling++;
          else if (prof === 'hilly') stats.win_hilly++;
          else if (prof === 'hilly_difficult') stats.win_hilly_difficult++;
          else if (prof === 'medium_mountain') stats.win_medium_mountain++;
          else if (prof === 'mountain') stats.win_mountain++;
          else if (prof === 'high_mountain') stats.win_high_mountain++;
          else if (prof === 'cobble') stats.win_cobble++;
          else if (prof === 'cobble_hill') stats.win_cobble_hill++;
          else if (prof === 'itt') stats.win_itt++;
          else if (prof === 'ttt') stats.win_ttt++;

          if (stage.rolled_weather_id != null && stage.rolled_weather_id >= 1 && stage.rolled_weather_id <= 7) {
            stats[`win_weather_${stage.rolled_weather_id}`]++;
          }
        };

        if (isStageRace) {
          if (rank === 1) {
            stats.stage_wins++;
            applyWinnerDetails();
          } else if (rank === 2) stats.stage_second++;
          else if (rank === 3) stats.stage_third++;
          else if (rank > 3 && rank <= 10) stats.stage_top_ten++;
        } else {
          if (rank === 1) {
            stats.one_day_wins++;
            applyWinnerDetails();
          } else if (rank === 2) stats.one_day_second++;
          else if (rank === 3) stats.one_day_third++;
          else if (rank > 3 && rank <= 10) stats.one_day_top_ten++;
        }
      } else if (r.result_type_id === 2) {
        if (stage.is_stage_race === 1 && stage.stage_number === stage.number_of_stages) {
          if (r.rank === 1) stats.gc_wins++;
          else if (r.rank === 2) stats.gc_second++;
          else if (r.rank === 3) stats.gc_third++;
          else if (r.rank > 3 && r.rank <= 10) stats.gc_top_ten++;
        }
      } else if (r.result_type_id === 3) {
        if (stage.is_stage_race === 1 && stage.stage_number === stage.number_of_stages && r.rank === 1) {
          stats.points_wins++;
        }
      } else if (r.result_type_id === 4) {
        if (stage.is_stage_race === 1 && stage.stage_number === stage.number_of_stages && r.rank === 1) {
          stats.mountain_wins++;
        }
      } else if (r.result_type_id === 5) {
        if (stage.is_stage_race === 1 && stage.stage_number === stage.number_of_stages && r.rank === 1) {
          stats.youth_wins++;
        }
      } else if (r.result_type_id === 7) {
        if (stage.is_stage_race === 1 && stage.stage_number === stage.number_of_stages && r.rank === 1) {
          stats.breakaway_wins++;
        }
      }
    }

    if (tableExists(db, 'stage_marker_results')) {
      const markers = db.prepare(`
        SELECT stage_id, rider_id, marker_type, marker_category
        FROM stage_marker_results
        WHERE rank = 1
      `).all() as Array<{ stage_id: number; rider_id: number; marker_type: string; marker_category: string | null }>;

      for (const m of markers) {
        const stage = stagesMap.get(m.stage_id);
        if (!stage) continue;
        const stats = getOrCreateStats(m.rider_id, stage.season, stage.category_name);
        if (m.marker_type === 'sprint_intermediate' || m.marker_category === 'Sprint') {
          stats.sprint_wins++;
        }
        if (m.marker_category === 'HC') stats.climb_wins_hc++;
        else if (m.marker_category === '1') stats.climb_wins_1++;
        else if (m.marker_category === '2') stats.climb_wins_2++;
        else if (m.marker_category === '3') stats.climb_wins_3++;
        else if (m.marker_category === '4') stats.climb_wins_4++;
      }
    }

    const jerseys = db.prepare(`
      SELECT stage_id, rider_id, result_type_id
      FROM all_results
      WHERE result_type_id IN (2, 3, 4, 5, 7) AND rank = 1
    `).all() as Array<{ stage_id: number; rider_id: number | null; result_type_id: number }>;

    for (const j of jerseys) {
      if (j.rider_id == null) continue;
      const stage = stagesMap.get(j.stage_id);
      if (!stage || stage.is_stage_race !== 1) continue;
      
      const stats = getOrCreateStats(j.rider_id, stage.season, stage.category_name);
      if (j.result_type_id === 2) stats.leader_jerseys++;
      else if (j.result_type_id === 3) stats.points_jerseys++;
      else if (j.result_type_id === 4) stats.mountain_jerseys++;
      else if (j.result_type_id === 5) stats.youth_jerseys++;
      else if (j.result_type_id === 7) stats.breakaway_jerseys++;
    }

    const insertSeasonCategory = db.prepare(`
      INSERT OR REPLACE INTO rider_season_category_stats (
        rider_id, season, category_name,
        gc_wins, gc_second, gc_third, gc_top_ten,
        stage_wins, stage_second, stage_third, stage_top_ten,
        one_day_wins, one_day_second, one_day_third, one_day_top_ten,
        mountain_wins, points_wins, youth_wins, breakaway_wins,
        race_days,
        leader_jerseys, points_jerseys, mountain_jerseys, youth_jerseys, breakaway_jerseys,
        sprint_wins,
        climb_wins_hc, climb_wins_1, climb_wins_2, climb_wins_3, climb_wins_4,
        win_flat, win_rolling, win_hilly, win_hilly_difficult, win_medium_mountain, win_mountain, win_high_mountain, win_cobble, win_cobble_hill, win_itt, win_ttt,
        win_weather_1, win_weather_2, win_weather_3, win_weather_4, win_weather_5, win_weather_6, win_weather_7
      ) VALUES (
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?,
        ?, ?, ?, ?, ?,
        ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?
      )
    `);

    db.transaction(() => {
      for (const stats of statsMap.values()) {
        insertSeasonCategory.run(
          stats.rider_id, stats.season, stats.category_name,
          stats.gc_wins, stats.gc_second, stats.gc_third, stats.gc_top_ten,
          stats.stage_wins, stats.stage_second, stats.stage_third, stats.stage_top_ten,
          stats.one_day_wins, stats.one_day_second, stats.one_day_third, stats.one_day_top_ten,
          stats.mountain_wins, stats.points_wins, stats.youth_wins, stats.breakaway_wins,
          stats.race_days,
          stats.leader_jerseys, stats.points_jerseys, stats.mountain_jerseys, stats.youth_jerseys, stats.breakaway_jerseys,
          stats.sprint_wins,
          stats.climb_wins_hc, stats.climb_wins_1, stats.climb_wins_2, stats.climb_wins_3, stats.climb_wins_4,
          stats.win_flat, stats.win_rolling, stats.win_hilly, stats.win_hilly_difficult, stats.win_medium_mountain, stats.win_mountain, stats.win_high_mountain, stats.win_cobble, stats.win_cobble_hill, stats.win_itt, stats.win_ttt,
          stats.win_weather_1, stats.win_weather_2, stats.win_weather_3, stats.win_weather_4, stats.win_weather_5, stats.win_weather_6, stats.win_weather_7
        );
      }
    })();

    db.prepare(`
      INSERT INTO rider_career_category_stats (
        rider_id, category_name,
        gc_wins, gc_second, gc_third, gc_top_ten,
        stage_wins, stage_second, stage_third, stage_top_ten,
        one_day_wins, one_day_second, one_day_third, one_day_top_ten,
        mountain_wins, points_wins, youth_wins, breakaway_wins,
        race_days,
        leader_jerseys, points_jerseys, mountain_jerseys, youth_jerseys, breakaway_jerseys,
        sprint_wins,
        climb_wins_hc, climb_wins_1, climb_wins_2, climb_wins_3, climb_wins_4,
        win_flat, win_rolling, win_hilly, win_hilly_difficult, win_medium_mountain, win_mountain, win_high_mountain, win_cobble, win_cobble_hill, win_itt, win_ttt,
        win_weather_1, win_weather_2, win_weather_3, win_weather_4, win_weather_5, win_weather_6, win_weather_7
      )
      SELECT
        rider_id, category_name,
        SUM(gc_wins), SUM(gc_second), SUM(gc_third), SUM(gc_top_ten),
        SUM(stage_wins), SUM(stage_second), SUM(stage_third), SUM(stage_top_ten),
        SUM(one_day_wins), SUM(one_day_second), SUM(one_day_third), SUM(one_day_top_ten),
        SUM(mountain_wins), SUM(points_wins), SUM(youth_wins), SUM(breakaway_wins),
        SUM(race_days),
        SUM(leader_jerseys), SUM(points_jerseys), SUM(mountain_jerseys), SUM(youth_jerseys), SUM(breakaway_jerseys),
        SUM(sprint_wins),
        SUM(climb_wins_hc), SUM(climb_wins_1), SUM(climb_wins_2), SUM(climb_wins_3), SUM(climb_wins_4),
        SUM(win_flat), SUM(win_rolling), SUM(win_hilly), SUM(win_hilly_difficult), SUM(win_medium_mountain), SUM(win_mountain), SUM(win_high_mountain), SUM(win_cobble), SUM(win_cobble_hill), SUM(win_itt), SUM(win_ttt),
        SUM(win_weather_1), SUM(win_weather_2), SUM(win_weather_3), SUM(win_weather_4), SUM(win_weather_5), SUM(win_weather_6), SUM(win_weather_7)
      FROM rider_season_category_stats
      GROUP BY rider_id, category_name
    `).run();
  }

  private ensureTeamPreferencesData(db: Database.Database): void {
    if (!tableExists(db, 'team_preferences')) {
      return;
    }

    if (!fs.existsSync(this.masterDbPath)) {
      return;
    }

    const masterDb = new Database(this.masterDbPath, { readonly: true });
    try {
      if (!tableExists(masterDb, 'team_preferences')) {
        return;
      }

      const rows = masterDb.prepare(`
        SELECT id_pref, team_id, country_id, weight
        FROM team_preferences
      `).all() as Array<{ id_pref: number; team_id: number; country_id: number; weight: number }>;

      db.transaction(() => {
        db.prepare('DELETE FROM team_preferences').run();
        const insert = db.prepare(`
          INSERT OR REPLACE INTO team_preferences (id_pref, team_id, country_id, weight)
          VALUES (?, ?, ?, ?)
        `);
        for (const row of rows) {
          insert.run(row.id_pref, row.team_id, row.country_id, row.weight);
        }
      })();
    } finally {
      masterDb.close();
    }
  }


  private ensureRaceProgramSchema(db: Database.Database): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS race_programs (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS race_program_races (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        program_id INTEGER NOT NULL REFERENCES race_programs(id) ON DELETE CASCADE,
        race_id INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
        allowed_program_group_ids TEXT,
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

      CREATE TABLE IF NOT EXISTS rider_lieutenants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        season INTEGER NOT NULL,
        leader_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        lieutenant_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        UNIQUE(season, leader_id),
        UNIQUE(season, lieutenant_id)
      );

      CREATE TABLE IF NOT EXISTS lieutenant_all_time_peaks (
        rider_id INTEGER PRIMARY KEY REFERENCES riders(id) ON DELETE CASCADE,
        max_overall_rating INTEGER NOT NULL,
        leader_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        season INTEGER NOT NULL
      );
    `);

    // Migration: ensure allowed_program_group_ids column exists in race_program_races
    if (!columnExists(db, 'race_program_races', 'allowed_program_group_ids')) {
      db.prepare(`
        ALTER TABLE race_program_races
        ADD COLUMN allowed_program_group_ids TEXT
      `).run();
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

      const programs = masterDb.prepare(`
        SELECT id, name
        FROM race_programs
        ORDER BY id ASC
      `).all() as Array<{
        id: number;
        name: string;
      }>;

      const hasAllowedColumnInMaster = columnExists(masterDb, 'race_program_races', 'allowed_program_group_ids');
      const programRaces = masterDb.prepare(`
        SELECT id, program_id, race_id ${hasAllowedColumnInMaster ? ', allowed_program_group_ids' : ''}
        FROM race_program_races
        ORDER BY id ASC
      `).all() as Array<{ id: number; program_id: number; race_id: number; allowed_program_group_ids?: string | null }>;

      const rules = masterDb.prepare(`
        SELECT id, role_name, spec_1, spec_2, spec_3, program_id, probability
        FROM race_program_probability_rules
        ORDER BY id ASC
      `).all() as Array<{ id: number; role_name: string; spec_1: number | null; spec_2: number | null; spec_3: number | null; program_id: number; probability: number }>;

      const insertProgram = db.prepare(`
        INSERT INTO race_programs (
          id, name
        ) VALUES (?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name
      `);
      const insertProgramRace = db.prepare('INSERT OR REPLACE INTO race_program_races (id, program_id, race_id, allowed_program_group_ids) VALUES (?, ?, ?, ?)');
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
          );
        }
        const validRaceIds = new Set(db.prepare('SELECT id FROM races').all().map((r: any) => r.id));
        for (const row of programRaces) {
          if (validRaceIds.has(row.race_id)) {
            insertProgramRace.run(row.id, row.program_id, row.race_id, row.allowed_program_group_ids ?? null);
          }
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

  /**
   * Applies the full, production-equivalent schema (schema.sql + all runtime
   * `ensure*` migrations and reference data) to an arbitrary database handle.
   *
   * Exposed so the test harness can build an in-memory DB that matches
   * production exactly, without reimplementing (and drifting from) the
   * migration logic. Master-DB-dependent steps guard on `masterDbPath`
   * existence and are safely skipped when it is absent.
   */
  public applySchemaTo(db: Database.Database): void {
    // The schema string re-enables `PRAGMA foreign_keys = ON`; the reference-data
    // sync steps then copy master rows that may reference ids not yet present in
    // a freshly-seeded DB. Structural migration should not be gated by FK
    // enforcement of half-populated data, so disable it for the duration and
    // restore the caller's setting afterwards.
    const previousForeignKeys = db.pragma('foreign_keys', { simple: true });
    try {
      this.ensureAllSchemas(db, { disableForeignKeys: true });
    } finally {
      db.pragma(`foreign_keys = ${previousForeignKeys ? 'ON' : 'OFF'}`);
    }
  }

  /**
   * Materialisierungs-Tabelle fuer Hall-of-Fame-Badges. Wird bei jedem
   * Savegame-Load komplett neu aufgebaut (siehe BadgeMaterializationService).
   * `tier` ist gold/silver/bronze/cyan/purple oder 'earned' fuer Single-/
   * Binaer-Badges ohne Schwellen-Tier.
   */
  private ensureRiderBadgesSchema(db: Database.Database): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS rider_badges (
        rider_id INTEGER NOT NULL,
        badge_key TEXT NOT NULL,
        tier TEXT,
        PRIMARY KEY (rider_id, badge_key)
      );

      CREATE INDEX IF NOT EXISTS idx_rider_badges_key
        ON rider_badges(badge_key);
    `);
  }

  /**
   * Materialisierte Liga-Rivalitaeten je Saison (max. 10). Wird beim
   * Saisonwechsel neu berechnet (RivalryService), analog zu rider_badges.
   */
  private ensureRivalriesSchema(db: Database.Database): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS rivalries (
        season          INTEGER NOT NULL,
        rank            INTEGER NOT NULL,
        rider_a_id      INTEGER NOT NULL,
        rider_b_id      INTEGER NOT NULL,
        idx             INTEGER NOT NULL,
        intensity       REAL    NOT NULL,
        encounters      INTEGER NOT NULL,
        win_a           INTEGER NOT NULL,
        win_b           INTEGER NOT NULL,
        season_win_a    INTEGER NOT NULL,
        season_win_b    INTEGER NOT NULL,
        top_category_id INTEGER,
        discipline      TEXT,
        PRIMARY KEY (season, rider_a_id, rider_b_id)
      );

      CREATE INDEX IF NOT EXISTS idx_rivalries_season_rank
        ON rivalries(season, rank);
      CREATE INDEX IF NOT EXISTS idx_rivalries_rider_a ON rivalries(rider_a_id);
      CREATE INDEX IF NOT EXISTS idx_rivalries_rider_b ON rivalries(rider_b_id);
    `);
  }

  // Retiree-Kohorte je Saison (fuer die Saison-Wrapped): in welcher Saison ein
  // Fahrer zuletzt fuhr, bevor er in Rente ging. Von ContractService gesetzt.
  private ensureRetiredSeasonColumn(db: Database.Database): void {
    if (!tableExists(db, 'riders')) return;
    if (!columnExists(db, 'riders', 'retired_season')) {
      db.prepare('ALTER TABLE riders ADD COLUMN retired_season INTEGER').run();
    }
  }

  private ensureAllSchemas(db: Database.Database, opts: { disableForeignKeys?: boolean } = {}): void {
    this.applyLatestSchema(db);
    // `applyLatestSchema` re-executes schema.sql, which contains
    // `PRAGMA foreign_keys = ON`. When applying to a not-yet-populated DB
    // (test harness), re-assert OFF before the master-reference sync so those
    // inserts aren't rejected by dangling references to master ids.
    if (opts.disableForeignKeys) {
      db.pragma('foreign_keys = OFF');
    }
    this.ensureRiderWeatherProfileSchema(db);
    this.ensureDraftPicksPoolSchema(db);
    this.ensureWeatherSchema(db);
    this.ensureResultsSchema(db);
    this.ensureResultsHistorySchema(db);
    this.ensureRaceCategoryBonusSchema(db);
    this.ensureRaceCategoriesSchema(db);
    this.ensureChampionshipTitlesSchema(db);
    this.ensureChampionshipCalendar(db);
    this.ensureNationalChampionshipTitlesSchema(db);
    this.ensureNationalChampionships(db);
    ensureOlympicGamesSchedule(db);
    this.ensureContractRenewalSchema(db);
    ensureContractRenewalsSchedule(db);
    this.ensureRulesData(db);
    this.ensureSkillWeightsData(db);
    this.ensureStageSpreadData(db);
    this.ensureStageRaceStateSchema(db);
    this.ensureRiderFormSchema(db);
    this.ensureRaceProgramSchema(db);
    this.ensureRiderCareerStatsSchema(db);
    this.ensureRiderSeasonStatsSchema(db);
    this.ensureRiderCategoryStatsSchema(db);
    this.ensureRiderBadgesSchema(db);
    this.ensureRivalriesSchema(db);
    this.ensureRetiredSeasonColumn(db);
    this.ensureStageLeadoutsSchema(db);
    this.ensureStageSpeedRecordsSchema(db);
    this.ensureRiderSeasonRolesSchema(db);
    this.ensureSeasonStandingsSnapshotsSchema(db);
    this.ensureRaceResultsCompactSchema(db);
    // Nach ensureResultsHistorySchema (all_results-View) und
    // ensureRiderCategoryStatsSchema (all_stage_entries-View) aufrufen —
    // der Backfill liest beide Views.
    this.ensureResultsFlatSchema(db);
    this.ensureCareerDerivedBackfills(db);
    this.ensureTeamPreferencesData(db);
    this.ensureReferenceData(db);
    this.ensureNationalSelectionTeam(db);
    this.ensureDayChangeIndexes(db);
    this.ensurePerformanceIndexes(db);
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
      this.ensureAllSchemas(db);

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

    // Performance-Tuning PRAGMAs
    this.activeConnection.pragma('cache_size = -262144');        // 1 GB Cache-Obergrenze (262144 Pages à 4KB)
    this.activeConnection.pragma('mmap_size = 536870912');        // 512 MB Memory Map
    this.activeConnection.pragma('temp_store = MEMORY');          // Temporäre Tabellen im RAM halten
    this.activeConnection.pragma('journal_size_limit = 67108864'); // WAL-Log auf max 64 MB begrenzen
    this.activeConnection.pragma('busy_timeout = 5000');          // Lock-Timeout erhöhen

    // Auto-vacuum deaktivieren, um Write-Performance-Overhead während des Spiels zu minimieren.
    // Stattdessen wird die DB bei jedem Laden manuell per VACUUM aufgeräumt und geschrumpft.
    const currentAutoVacuum = this.activeConnection.pragma('auto_vacuum', { simple: true });
    if (currentAutoVacuum !== 0) {
      this.activeConnection.pragma('auto_vacuum = NONE');
    }
    
    // Spielstand beim Laden bereinigen und verkleinern
    this.activeConnection.prepare('VACUUM').run();

    this.ensureAllSchemas(this.activeConnection);
    const gameState = new GameStateService(this.activeConnection).ensureState();
    new RiderProgramService(this.activeConnection).ensureSeasonPrograms(gameState.season, gameState.currentDate);
    new ContractService(this.activeConnection).checkContractStatuses(gameState.season);
    // Hall-of-Fame-Badges werden regulaer beim Saisonwechsel materialisiert
    // (GameStateService). Hier nur Erstbefuellung, falls die Tabelle noch leer
    // ist (frische bzw. Alt-Savegames) — der volle Rebuild ist teuer (~21 s bei
    // ~2900 Fahrern) und soll nicht jeden Load blockieren.
    const badgeCount = this.activeConnection
      .prepare('SELECT 1 FROM rider_badges LIMIT 1')
      .get();
    if (!badgeCount) {
      new BadgeMaterializationService(this.activeConnection).rebuildAllRiderBadges();
    }
    // Liga-Rivalitaeten: Erstbefuellung, falls noch keine Saison materialisiert
    // ist (regulaer beim Saisonwechsel in GameStateService).
    const rivalryCount = this.activeConnection
      .prepare('SELECT 1 FROM rivalries LIMIT 1')
      .get();
    if (!rivalryCount) {
      new RivalryService(this.activeConnection).rebuildRivalries();
    }
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
      
      CREATE TRIGGER IF NOT EXISTS trg_season_points_insert
      AFTER INSERT ON season_point_events
      FOR EACH ROW
      WHEN (SELECT 1 FROM sqlite_master WHERE type='table' AND name='rider_daily_state') IS NOT NULL
      BEGIN
        UPDATE rider_daily_state
        SET season_points = season_points + NEW.points_awarded
        WHERE rider_id = NEW.rider_id AND season = NEW.season;
      END;

      CREATE TRIGGER IF NOT EXISTS trg_season_points_delete
      AFTER DELETE ON season_point_events
      FOR EACH ROW
      WHEN (SELECT 1 FROM sqlite_master WHERE type='table' AND name='rider_daily_state') IS NOT NULL
      BEGIN
        UPDATE rider_daily_state
        SET season_points = season_points - OLD.points_awarded
        WHERE rider_id = OLD.rider_id AND season = OLD.season;
      END;

      CREATE TRIGGER IF NOT EXISTS trg_season_points_update
      AFTER UPDATE OF points_awarded ON season_point_events
      FOR EACH ROW
      WHEN (SELECT 1 FROM sqlite_master WHERE type='table' AND name='rider_daily_state') IS NOT NULL
      BEGIN
        UPDATE rider_daily_state
        SET season_points = season_points - OLD.points_awarded + NEW.points_awarded
        WHERE rider_id = NEW.rider_id AND season = NEW.season;
      END;
    `);
  }

  private ensurePerformanceIndexes(db: Database.Database): void {
    const createIfTable = (table: string, sql: string): void => {
      if (!tableExists(db, table)) return;
      try {
        db.exec(sql);
      } catch {
        // Ignore
      }
    };

    createIfTable('contracts', `CREATE INDEX IF NOT EXISTS idx_contracts_team ON contracts(team_id);`);
    createIfTable('stage_entries', `CREATE INDEX IF NOT EXISTS idx_stage_entries_team ON stage_entries(team_id);`);
    createIfTable('stage_entries', `CREATE INDEX IF NOT EXISTS idx_stage_entries_covering ON stage_entries(stage_id, team_id, status, rider_id);`);
    createIfTable('results_history', `CREATE INDEX IF NOT EXISTS idx_results_history_team ON results_history(team_id);`);
    createIfTable('results_history', `CREATE INDEX IF NOT EXISTS idx_results_history_stage ON results_history(stage_id, result_type_id, rank);`);
    createIfTable('results', `CREATE INDEX IF NOT EXISTS idx_results_race_id ON results(race_id);`);
    createIfTable('riders', `CREATE INDEX IF NOT EXISTS idx_riders_active_team ON riders(active_team_id);`);
  }

  public getActiveConnection(): Database.Database {
    if (!this.activeConnection) {
      throw new Error('Kein Savegame geladen. Bitte zuerst ein Savegame laden.');
    }

    this.ensureAllSchemas(this.activeConnection);

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

  public getSchemaPath(): string {
    return this.schemaPath;
  }
}
