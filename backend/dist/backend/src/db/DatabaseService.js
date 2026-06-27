"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const skillWeights_1 = require("../../../shared/skillWeights");
const bootstrapper_1 = require("../bootstrapper");
const ContractService_1 = require("../game/ContractService");
const GameStateService_1 = require("../game/GameStateService");
const RiderProgramService_1 = require("../game/RiderProgramService");
const MASTER_DB_NAME = 'world_data.db';
const RESULT_TYPE_ROWS = [
    { id: 1, name: 'Stage' },
    { id: 2, name: 'GC' },
    { id: 3, name: 'Points' },
    { id: 4, name: 'Mountain' },
    { id: 5, name: 'Youth' },
    { id: 6, name: 'Team' },
];
function tableExists(db, tableName) {
    const row = db.prepare("SELECT name FROM sqlite_master WHERE type IN ('table', 'view') AND name = ?").get(tableName);
    return row != null;
}
function columnExists(db, tableName, columnName) {
    const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
    return columns.some((column) => column.name === columnName);
}
function resolveAssetsDir() {
    if (process.pkg) {
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
class DatabaseService {
    constructor() {
        this.activeConnection = null;
        this.activeSaveName = null;
        const assetsDir = resolveAssetsDir();
        this.masterDbPath = process.pkg
            ? path.join(path.dirname(process.execPath), MASTER_DB_NAME)
            : path.join(assetsDir, MASTER_DB_NAME);
        this.schemaPath = path.join(assetsDir, 'schema.sql');
        this.savegamesDir = process.env['SAVEGAME_DIR']
            ?? path.join(os.homedir(), '.velo', 'savegames');
        this.ensureSavegamesDir();
    }
    applyLatestSchema(db) {
        // Migration: If 'race_entries' exists as a table, rename it to 'active_race_entries'
        const raceEntriesType = db.prepare("SELECT type FROM sqlite_master WHERE name = 'race_entries'").get();
        if (raceEntriesType && raceEntriesType.type === 'table') {
            console.log("Migrating 'race_entries' table to 'active_race_entries'...");
            db.prepare("ALTER TABLE race_entries RENAME TO active_race_entries;").run();
            db.prepare("DROP INDEX IF EXISTS idx_race_entries_rider_race;").run();
            db.prepare("CREATE INDEX IF NOT EXISTS idx_active_race_entries_rider_race ON active_race_entries(rider_id, race_id);").run();
        }
        // Migration: If 'stage_entries_history' exists as a table, drop it to let it be recreated as a view
        const stageEntriesHistoryType = db.prepare("SELECT type FROM sqlite_master WHERE name = 'stage_entries_history'").get();
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
        // Force recreation of race_entries view with new schema
        db.prepare("DROP VIEW IF EXISTS race_entries;").run();
        const schema = fs.readFileSync(this.schemaPath, 'utf8');
        db.exec(schema);
    }
    ensureReferenceData(db) {
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
    ensureRaceCategoryBonusSchema(db) {
        if (!tableExists(db, 'race_categories_bonus')) {
            return;
        }
        const missingColumns = [
            ['points_sprint_finish', "TEXT NOT NULL DEFAULT ''"],
            ['points_mountainstage', "TEXT NOT NULL DEFAULT ''"],
        ];
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
        const masterDb = new better_sqlite3_1.default(this.masterDbPath, { readonly: true });
        try {
            if (!tableExists(masterDb, 'race_categories_bonus') || !columnExists(masterDb, 'race_categories_bonus', 'points_sprint_finish')) {
                return;
            }
            const hasMountainStagePoints = columnExists(masterDb, 'race_categories_bonus', 'points_mountainstage');
            const rows = masterDb.prepare(`
        SELECT id, points_sprint_finish, ${hasMountainStagePoints ? 'points_mountainstage' : "'' AS points_mountainstage"}
        FROM race_categories_bonus
      `).all();
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
        }
        finally {
            masterDb.close();
        }
    }
    ensureRaceCategoriesSchema(db) {
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
        const masterDb = new better_sqlite3_1.default(this.masterDbPath, { readonly: true });
        try {
            if (!tableExists(masterDb, 'race_categories') || !columnExists(masterDb, 'race_categories', 'home_selection_probability')) {
                return;
            }
            const rows = masterDb.prepare(`
        SELECT id, home_selection_probability
        FROM race_categories
      `).all();
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
        }
        finally {
            masterDb.close();
        }
    }
    ensureRulesData(db) {
        if (!tableExists(db, 'rules')) {
            return;
        }
        const existingCount = db.prepare('SELECT COUNT(*) AS count FROM rules').get();
        if ((existingCount?.count ?? 0) > 0) {
            return;
        }
        if (!fs.existsSync(this.masterDbPath)) {
            return;
        }
        const masterDb = new better_sqlite3_1.default(this.masterDbPath, { readonly: true });
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
      `).all();
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
                    insert.run(row.id, row.rule_key, row.applies_to, row.marker_type, row.marker_category, row.weight_flat, row.weight_mountain, row.weight_medium_mountain, row.weight_hill, row.weight_time_trial, row.weight_prologue, row.weight_cobble, row.weight_sprint, row.weight_acceleration, row.weight_downhill, row.weight_attack, row.weight_stamina, row.weight_resistance, row.weight_recuperation, row.weight_bike_handling);
                }
            })();
        }
        finally {
            masterDb.close();
        }
    }
    ensureSkillWeightsData(db) {
        if (!tableExists(db, 'skill_weights')) {
            return;
        }
        const missingColumns = [
            ['ttt_speed_multiplier', 'REAL NOT NULL DEFAULT 1 CHECK(ttt_speed_multiplier > 0)'],
            ['final_spread_late_multiplier', 'REAL NOT NULL DEFAULT 1 CHECK(final_spread_late_multiplier > 0)'],
            ['final_spread_peak_multiplier', 'REAL NOT NULL DEFAULT 1 CHECK(final_spread_peak_multiplier > 0)'],
        ];
        for (const [columnName, columnDefinition] of missingColumns) {
            if (!columnExists(db, 'skill_weights', columnName)) {
                db.prepare(`
          ALTER TABLE skill_weights
          ADD COLUMN ${columnName} ${columnDefinition}
        `).run();
            }
        }
        const existingCount = db.prepare('SELECT COUNT(*) AS count FROM skill_weights').get();
        const fallbackRuleByKey = new Map(skillWeights_1.DEFAULT_SKILL_WEIGHT_RULES.map((rule) => [`${rule.simulationMode}:${rule.terrain}`, rule]));
        const updateMultiplier = db.prepare(`
      UPDATE skill_weights
      SET ttt_speed_multiplier = ?,
          final_spread_late_multiplier = ?,
          final_spread_peak_multiplier = ?
      WHERE simulation_mode = ? AND terrain = ?
    `);
        const applyMultiplierFallbacks = (rows) => {
            db.transaction(() => {
                for (const row of rows) {
                    const key = `${row.simulation_mode}:${row.terrain}`;
                    const fallbackRule = fallbackRuleByKey.get(key);
                    updateMultiplier.run(row.ttt_speed_multiplier ?? fallbackRule?.tttSpeedMultiplier ?? 1, row.final_spread_late_multiplier ?? fallbackRule?.finalSpreadLateMultiplier ?? 1, row.final_spread_peak_multiplier ?? fallbackRule?.finalSpreadPeakMultiplier ?? 1, row.simulation_mode, row.terrain);
                }
            })();
        };
        if ((existingCount?.count ?? 0) > 0) {
            if (fs.existsSync(this.masterDbPath)) {
                const masterDb = new better_sqlite3_1.default(this.masterDbPath, { readonly: true });
                try {
                    if (tableExists(masterDb, 'skill_weights')) {
                        const masterHasMultiplierColumn = columnExists(masterDb, 'skill_weights', 'ttt_speed_multiplier');
                        const masterHasLateSpreadColumn = columnExists(masterDb, 'skill_weights', 'final_spread_late_multiplier');
                        const masterHasPeakSpreadColumn = columnExists(masterDb, 'skill_weights', 'final_spread_peak_multiplier');
                        const masterRows = masterDb.prepare(`
              SELECT simulation_mode,
                     terrain${masterHasMultiplierColumn ? ', ttt_speed_multiplier' : ''}${masterHasLateSpreadColumn ? ', final_spread_late_multiplier' : ''}${masterHasPeakSpreadColumn ? ', final_spread_peak_multiplier' : ''}
              FROM skill_weights
            `).all();
                        applyMultiplierFallbacks(masterRows);
                        return;
                    }
                }
                finally {
                    masterDb.close();
                }
            }
            applyMultiplierFallbacks(skillWeights_1.DEFAULT_SKILL_WEIGHT_RULES.map((rule) => ({
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
        const masterDb = new better_sqlite3_1.default(this.masterDbPath, { readonly: true });
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
      `).all();
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
                    insert.run(row.id, row.simulation_mode, row.terrain, row.weight_flat, row.weight_mountain, row.weight_medium_mountain, row.weight_hill, row.weight_time_trial, row.weight_prologue, row.weight_cobble, row.weight_sprint, row.weight_acceleration, row.weight_downhill, row.weight_attack, row.weight_stamina, row.weight_resistance, row.weight_recuperation, row.weight_bike_handling, row.final_spread_late_multiplier ?? fallbackRuleByKey.get(`${row.simulation_mode}:${row.terrain}`)?.finalSpreadLateMultiplier ?? 1, row.final_spread_peak_multiplier ?? fallbackRuleByKey.get(`${row.simulation_mode}:${row.terrain}`)?.finalSpreadPeakMultiplier ?? 1, row.ttt_speed_multiplier ?? fallbackRuleByKey.get(`${row.simulation_mode}:${row.terrain}`)?.tttSpeedMultiplier ?? 1);
                }
            })();
        }
        finally {
            masterDb.close();
        }
    }
    ensureStageSpreadData(db) {
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
        ];
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
        const existingCount = db.prepare('SELECT COUNT(*) AS count FROM stages').get();
        if ((existingCount?.count ?? 0) <= 0) {
            return;
        }
        const masterDb = new better_sqlite3_1.default(this.masterDbPath, { readonly: true });
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
      `).all();
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
                    update.run(row.final_spread_start_percent ?? 70, row.final_push_start_percent ?? 90, row.final_spread_difficulty_multiplier ?? 1, row.crash_incident_multiplier ?? 1, row.mechanical_incident_multiplier ?? 1, row.stage_score ?? 0, row.id);
                }
            })();
        }
        finally {
            masterDb.close();
        }
    }
    ensureWeatherSchema(db) {
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
        ];
        for (const [columnName, columnDefinition] of weatherStageColumns) {
            if (!columnExists(db, 'stages', columnName)) {
                db.prepare(`
          ALTER TABLE stages
          ADD COLUMN ${columnName} ${columnDefinition}
        `).run();
            }
        }
    }
    ensureRiderWeatherProfileSchema(db) {
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
    ensureDraftPicksPoolSchema(db) {
        if (tableExists(db, 'draft_picks_pool')) {
            if (!columnExists(db, 'draft_picks_pool', 'old_team_id')) {
                db.prepare(`
          ALTER TABLE draft_picks_pool
          ADD COLUMN old_team_id INTEGER
        `).run();
            }
        }
    }
    ensureStageRaceStateSchema(db) {
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
        ];
        for (const [columnName, columnDefinition] of missingColumns) {
            if (!columnExists(db, 'rider_stage_race_state', columnName)) {
                db.prepare(`
          ALTER TABLE rider_stage_race_state
          ADD COLUMN ${columnName} ${columnDefinition}
        `).run();
            }
        }
    }
    ensureResultsSchema(db) {
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
        const row = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'results'").get();
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
    ensureResultsHistorySchema(db) {
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
        r.id,
        r.race_id,
        r.stage_id,
        r.rider_id,
        r.team_id,
        5 AS result_type_id,
        ROW_NUMBER() OVER (PARTITION BY r.stage_id ORDER BY r.rank ASC) AS rank,
        r.time_seconds,
        r.points,
        r.is_breakaway,
        r.leadout_rider_id,
        r.leadout_bonus,
        r.breakaway_kms,
        r.event_ids,
        r.jerseys_worn
      FROM results r
      JOIN riders ON riders.id = r.rider_id
      JOIN stages ON stages.id = r.stage_id
      WHERE r.result_type_id = 2
        AND (CAST(SUBSTR(stages.date, 1, 4) AS INTEGER) - riders.birth_year) <= 25
      UNION ALL
      SELECT 
        r.id,
        r.race_id,
        r.stage_id,
        r.rider_id,
        r.team_id,
        5 AS result_type_id,
        ROW_NUMBER() OVER (PARTITION BY r.stage_id ORDER BY r.rank ASC) AS rank,
        r.time_seconds,
        r.points,
        r.is_breakaway,
        r.leadout_rider_id,
        r.leadout_bonus,
        r.breakaway_kms,
        r.event_ids,
        r.jerseys_worn
      FROM results_history r
      JOIN riders ON riders.id = r.rider_id
      JOIN stages ON stages.id = r.stage_id
      WHERE r.result_type_id = 2
        AND (CAST(SUBSTR(stages.date, 1, 4) AS INTEGER) - riders.birth_year) <= 25
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
        5 AS result_type_id,
        ROW_NUMBER() OVER (PARTITION BY j.value->>0 ORDER BY CAST(j.value->>3 AS INTEGER) ASC) AS rank,
        CAST(j.value->>4 AS INTEGER) AS time_seconds,
        CAST(j.value->>5 AS INTEGER) AS points,
        CAST(j.value->>6 AS INTEGER) AS is_breakaway,
        CAST(j.value->>7 AS INTEGER) AS leadout_rider_id,
        CAST(j.value->>8 AS REAL) AS leadout_bonus,
        CAST(j.value->>9 AS REAL) AS breakaway_kms,
        j.value->>10 AS event_ids,
        j.value->>11 AS jerseys_worn
      FROM race_results_compact c
      JOIN stages s ON s.race_id = c.race_id
      JOIN riders r ON r.id = CAST(j.value->>1 AS INTEGER),
      json_each(c.payload, '$.type2') j
      WHERE CAST(j.value->>0 AS INTEGER) = s.id
        AND (CAST(SUBSTR(s.date, 1, 4) AS INTEGER) - r.birth_year) <= 25
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
    ensureRiderFormSchema(db) {
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
    ensureRiderCareerStatsSchema(db) {
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
                }
                catch (e) {
                    console.warn(`Could not drop column ${col}:`, e);
                }
            }
        }
    }
    ensureStageLeadoutsSchema(db) {
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
    ensureRiderSeasonStatsSchema(db) {
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
    ensureRiderSeasonRolesSchema(db) {
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
            const stateRow = db.prepare('SELECT season FROM game_state WHERE id = 1').get();
            if (stateRow) {
                db.prepare(`
          INSERT OR IGNORE INTO rider_season_roles (rider_id, season, role_id)
          SELECT id, ?, role_id FROM riders WHERE role_id IS NOT NULL AND is_retired = 0
        `).run(stateRow.season);
            }
        }
        catch (e) {
            // Ignorieren falls game_state noch nicht existiert (z.B. frische master DB)
        }
    }
    ensureSeasonStandingsSnapshotsSchema(db) {
        db.prepare(`
      CREATE TABLE IF NOT EXISTS season_standings_snapshots (
        season       INTEGER PRIMARY KEY,
        payload_json TEXT NOT NULL
      )
    `).run();
    }
    ensureRaceResultsCompactSchema(db) {
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
    ensureRiderCategoryStatsSchema(db) {
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
        ];
        for (const [colName, colDef] of careerColumns) {
            if (!columnExists(db, 'rider_career_stats', colName)) {
                db.prepare(`ALTER TABLE rider_career_stats ADD COLUMN ${colName} ${colDef}`).run();
            }
        }
        const seasonColumns = [
            ['successful_breakaways', 'INTEGER NOT NULL DEFAULT 0'],
            ['race_days', 'INTEGER NOT NULL DEFAULT 0'],
        ];
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
    migrateSavegameStats(db) {
        db.prepare(`
      INSERT OR IGNORE INTO rider_career_stats (rider_id)
      SELECT id FROM riders WHERE is_retired = 0
    `).run();
        const nonFinisherRows = db.prepare(`
      SELECT rider_id, status, status_reason
      FROM all_stage_entries
      WHERE status IN ('dns', 'dnf')
    `).all();
        const dnsCounts = new Map();
        const dnfCounts = new Map();
        const otlCounts = new Map();
        for (const r of nonFinisherRows) {
            if (r.status === 'dns') {
                dnsCounts.set(r.rider_id, (dnsCounts.get(r.rider_id) ?? 0) + 1);
            }
            else if (r.status === 'dnf') {
                if (r.status_reason?.startsWith('OTL ')) {
                    otlCounts.set(r.rider_id, (otlCounts.get(r.rider_id) ?? 0) + 1);
                }
                else {
                    dnfCounts.set(r.rider_id, (dnfCounts.get(r.rider_id) ?? 0) + 1);
                }
            }
        }
        const raceDaysRows = db.prepare(`
      SELECT rider_id, COUNT(*) AS race_days
      FROM all_stage_entries
      WHERE status != 'dns'
      GROUP BY rider_id
    `).all();
        const raceDaysMap = new Map(raceDaysRows.map(r => [r.rider_id, r.race_days]));
        const updateCareerTotals = db.prepare(`
      UPDATE rider_career_stats
      SET dns_count = ?, dnf_count = ?, otl_count = ?, race_days = ?,
          breakaway_kms = COALESCE((SELECT SUM(breakaway_kms) FROM rider_season_stats WHERE rider_season_stats.rider_id = rider_career_stats.rider_id), 0.0),
          superform_days = COALESCE((SELECT SUM(superform_days) FROM rider_season_stats WHERE rider_season_stats.rider_id = rider_career_stats.rider_id), 0),
          supermalus_days = COALESCE((SELECT SUM(supermalus_days) FROM rider_season_stats WHERE rider_season_stats.rider_id = rider_career_stats.rider_id), 0),
          home_advantage_days = COALESCE((SELECT SUM(home_advantage_days) FROM rider_season_stats WHERE rider_season_stats.rider_id = rider_career_stats.rider_id), 0),
          super_home_advantage_days = COALESCE((SELECT SUM(super_home_advantage_days) FROM rider_season_stats WHERE rider_season_stats.rider_id = rider_career_stats.rider_id), 0),
          home_pressure_days = COALESCE((SELECT SUM(home_pressure_days) FROM rider_season_stats WHERE rider_season_stats.rider_id = rider_career_stats.rider_id), 0)
      WHERE rider_id = ?
    `);
        const riders = db.prepare('SELECT id FROM riders WHERE is_retired = 0').all();
        db.transaction(() => {
            for (const r of riders) {
                updateCareerTotals.run(dnsCounts.get(r.id) ?? 0, dnfCounts.get(r.id) ?? 0, otlCounts.get(r.id) ?? 0, raceDaysMap.get(r.id) ?? 0, r.id);
            }
        })();
        const seasonRaceDays = db.prepare(`
      SELECT se.rider_id, CAST(substr(s.date, 1, 4) AS INTEGER) AS season, COUNT(*) AS race_days
      FROM all_stage_entries se
      JOIN stages s ON s.id = se.stage_id
      WHERE se.status != 'dns'
      GROUP BY se.rider_id, season
    `).all();
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
    `).all();
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
    `).all();
        const stagesMap = new Map(stages.map(s => [s.stage_id, s]));
        const statsMap = new Map();
        const getOrCreateStats = (riderId, season, catName) => {
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
    `).all();
        for (const entry of entries) {
            const stage = stagesMap.get(entry.stage_id);
            if (!stage)
                continue;
            const stats = getOrCreateStats(entry.rider_id, stage.season, stage.category_name);
            stats.race_days++;
        }
        const tttFinisherMap = new Map();
        const tttEntries = db.prepare(`
      SELECT se.stage_id, se.rider_id
      FROM all_stage_entries se
      JOIN stages s ON s.id = se.stage_id
      WHERE s.profile = 'TTT' AND se.status = 'finished'
    `).all();
        for (const e of tttEntries) {
            const set = tttFinisherMap.get(e.stage_id) ?? new Set();
            set.add(e.rider_id);
            tttFinisherMap.set(e.stage_id, set);
        }
        const results = db.prepare(`
      SELECT stage_id, rider_id, team_id, result_type_id, rank
      FROM all_results
    `).all();
        for (const r of results) {
            const stage = stagesMap.get(r.stage_id);
            if (!stage)
                continue;
            if (r.rider_id == null) {
                if (stage.profile === 'TTT' && r.result_type_id === 1) {
                    const finishedRiders = tttFinisherMap.get(r.stage_id);
                    if (finishedRiders) {
                        for (const rId of finishedRiders) {
                            const stats = getOrCreateStats(rId, stage.season, stage.category_name);
                            if (r.rank === 1) {
                                stats.stage_wins++;
                                stats.win_ttt++;
                                if (stage.rolled_weather_id != null && stage.rolled_weather_id >= 1 && stage.rolled_weather_id <= 7) {
                                    stats[`win_weather_${stage.rolled_weather_id}`]++;
                                }
                            }
                            else if (r.rank === 2)
                                stats.stage_second++;
                            else if (r.rank === 3)
                                stats.stage_third++;
                            else if (r.rank > 3 && r.rank <= 10)
                                stats.stage_top_ten++;
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
                    if (prof === 'flat')
                        stats.win_flat++;
                    else if (prof === 'rolling')
                        stats.win_rolling++;
                    else if (prof === 'hilly')
                        stats.win_hilly++;
                    else if (prof === 'hilly_difficult')
                        stats.win_hilly_difficult++;
                    else if (prof === 'medium_mountain')
                        stats.win_medium_mountain++;
                    else if (prof === 'mountain')
                        stats.win_mountain++;
                    else if (prof === 'high_mountain')
                        stats.win_high_mountain++;
                    else if (prof === 'cobble')
                        stats.win_cobble++;
                    else if (prof === 'cobble_hill')
                        stats.win_cobble_hill++;
                    else if (prof === 'itt')
                        stats.win_itt++;
                    else if (prof === 'ttt')
                        stats.win_ttt++;
                    if (stage.rolled_weather_id != null && stage.rolled_weather_id >= 1 && stage.rolled_weather_id <= 7) {
                        stats[`win_weather_${stage.rolled_weather_id}`]++;
                    }
                };
                if (isStageRace) {
                    if (rank === 1) {
                        stats.stage_wins++;
                        applyWinnerDetails();
                    }
                    else if (rank === 2)
                        stats.stage_second++;
                    else if (rank === 3)
                        stats.stage_third++;
                    else if (rank > 3 && rank <= 10)
                        stats.stage_top_ten++;
                }
                else {
                    if (rank === 1) {
                        stats.one_day_wins++;
                        applyWinnerDetails();
                    }
                    else if (rank === 2)
                        stats.one_day_second++;
                    else if (rank === 3)
                        stats.one_day_third++;
                    else if (rank > 3 && rank <= 10)
                        stats.one_day_top_ten++;
                }
            }
            else if (r.result_type_id === 2) {
                if (stage.is_stage_race === 1 && stage.stage_number === stage.number_of_stages) {
                    if (r.rank === 1)
                        stats.gc_wins++;
                    else if (r.rank === 2)
                        stats.gc_second++;
                    else if (r.rank === 3)
                        stats.gc_third++;
                    else if (r.rank > 3 && r.rank <= 10)
                        stats.gc_top_ten++;
                }
            }
            else if (r.result_type_id === 3) {
                if (stage.is_stage_race === 1 && stage.stage_number === stage.number_of_stages && r.rank === 1) {
                    stats.points_wins++;
                }
            }
            else if (r.result_type_id === 4) {
                if (stage.is_stage_race === 1 && stage.stage_number === stage.number_of_stages && r.rank === 1) {
                    stats.mountain_wins++;
                }
            }
            else if (r.result_type_id === 5) {
                if (stage.is_stage_race === 1 && stage.stage_number === stage.number_of_stages && r.rank === 1) {
                    stats.youth_wins++;
                }
            }
            else if (r.result_type_id === 7) {
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
      `).all();
            for (const m of markers) {
                const stage = stagesMap.get(m.stage_id);
                if (!stage)
                    continue;
                const stats = getOrCreateStats(m.rider_id, stage.season, stage.category_name);
                if (m.marker_type === 'sprint_intermediate' || m.marker_category === 'Sprint') {
                    stats.sprint_wins++;
                }
                if (m.marker_category === 'HC')
                    stats.climb_wins_hc++;
                else if (m.marker_category === '1')
                    stats.climb_wins_1++;
                else if (m.marker_category === '2')
                    stats.climb_wins_2++;
                else if (m.marker_category === '3')
                    stats.climb_wins_3++;
                else if (m.marker_category === '4')
                    stats.climb_wins_4++;
            }
        }
        const jerseys = db.prepare(`
      SELECT stage_id, rider_id, result_type_id
      FROM all_results
      WHERE result_type_id IN (2, 3, 4, 5, 7) AND rank = 1
    `).all();
        for (const j of jerseys) {
            if (j.rider_id == null)
                continue;
            const stage = stagesMap.get(j.stage_id);
            if (!stage || stage.is_stage_race !== 1)
                continue;
            const stats = getOrCreateStats(j.rider_id, stage.season, stage.category_name);
            if (j.result_type_id === 2)
                stats.leader_jerseys++;
            else if (j.result_type_id === 3)
                stats.points_jerseys++;
            else if (j.result_type_id === 4)
                stats.mountain_jerseys++;
            else if (j.result_type_id === 5)
                stats.youth_jerseys++;
            else if (j.result_type_id === 7)
                stats.breakaway_jerseys++;
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
                insertSeasonCategory.run(stats.rider_id, stats.season, stats.category_name, stats.gc_wins, stats.gc_second, stats.gc_third, stats.gc_top_ten, stats.stage_wins, stats.stage_second, stats.stage_third, stats.stage_top_ten, stats.one_day_wins, stats.one_day_second, stats.one_day_third, stats.one_day_top_ten, stats.mountain_wins, stats.points_wins, stats.youth_wins, stats.breakaway_wins, stats.race_days, stats.leader_jerseys, stats.points_jerseys, stats.mountain_jerseys, stats.youth_jerseys, stats.breakaway_jerseys, stats.sprint_wins, stats.climb_wins_hc, stats.climb_wins_1, stats.climb_wins_2, stats.climb_wins_3, stats.climb_wins_4, stats.win_flat, stats.win_rolling, stats.win_hilly, stats.win_hilly_difficult, stats.win_medium_mountain, stats.win_mountain, stats.win_high_mountain, stats.win_cobble, stats.win_cobble_hill, stats.win_itt, stats.win_ttt, stats.win_weather_1, stats.win_weather_2, stats.win_weather_3, stats.win_weather_4, stats.win_weather_5, stats.win_weather_6, stats.win_weather_7);
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
    ensureTeamPreferencesData(db) {
        if (!tableExists(db, 'team_preferences')) {
            return;
        }
        if (!fs.existsSync(this.masterDbPath)) {
            return;
        }
        const masterDb = new better_sqlite3_1.default(this.masterDbPath, { readonly: true });
        try {
            if (!tableExists(masterDb, 'team_preferences')) {
                return;
            }
            const rows = masterDb.prepare(`
        SELECT id_pref, team_id, country_id, weight
        FROM team_preferences
      `).all();
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
        }
        finally {
            masterDb.close();
        }
    }
    ensureRaceProgramSchema(db) {
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
        const ruleColumns = db.prepare('PRAGMA table_info(race_program_probability_rules)').all();
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
        const masterDb = new better_sqlite3_1.default(this.masterDbPath, { readonly: true });
        try {
            if (!tableExists(masterDb, 'race_programs') || !tableExists(masterDb, 'race_program_races') || !tableExists(masterDb, 'race_program_probability_rules')) {
                return;
            }
            const programs = masterDb.prepare(`
        SELECT id, name
        FROM race_programs
        ORDER BY id ASC
      `).all();
            const hasAllowedColumnInMaster = columnExists(masterDb, 'race_program_races', 'allowed_program_group_ids');
            const programRaces = masterDb.prepare(`
        SELECT id, program_id, race_id ${hasAllowedColumnInMaster ? ', allowed_program_group_ids' : ''}
        FROM race_program_races
        ORDER BY id ASC
      `).all();
            const rules = masterDb.prepare(`
        SELECT id, role_name, spec_1, spec_2, spec_3, program_id, probability
        FROM race_program_probability_rules
        ORDER BY id ASC
      `).all();
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
                    insertProgram.run(program.id, program.name);
                }
                const validRaceIds = new Set(db.prepare('SELECT id FROM races').all().map((r) => r.id));
                for (const row of programRaces) {
                    if (validRaceIds.has(row.race_id)) {
                        insertProgramRace.run(row.id, row.program_id, row.race_id, row.allowed_program_group_ids ?? null);
                    }
                }
                for (const row of rules) {
                    insertRule.run(row.id, row.role_name, row.spec_1, row.spec_2, row.spec_3, row.program_id, row.probability);
                }
            })();
        }
        finally {
            masterDb.close();
        }
    }
    ensureSavegamesDir() {
        if (!fs.existsSync(this.savegamesDir)) {
            fs.mkdirSync(this.savegamesDir, { recursive: true });
        }
    }
    resolveSavePath(filename) {
        const safeName = path.basename(filename);
        if (safeName !== filename || !/^[\w\-]+\.db$/.test(safeName)) {
            throw new Error(`Ungültiger Savegame-Dateiname: "${filename}". Erlaubt: Alphanumerisch, Bindestriche, Unterstriche, Endung .db`);
        }
        return path.join(this.savegamesDir, safeName);
    }
    ensureAllSchemas(db) {
        this.applyLatestSchema(db);
        this.ensureRiderWeatherProfileSchema(db);
        this.ensureDraftPicksPoolSchema(db);
        this.ensureWeatherSchema(db);
        this.ensureResultsSchema(db);
        this.ensureResultsHistorySchema(db);
        this.ensureRaceCategoryBonusSchema(db);
        this.ensureRaceCategoriesSchema(db);
        this.ensureRulesData(db);
        this.ensureSkillWeightsData(db);
        this.ensureStageSpreadData(db);
        this.ensureStageRaceStateSchema(db);
        this.ensureRiderFormSchema(db);
        this.ensureRaceProgramSchema(db);
        this.ensureRiderCareerStatsSchema(db);
        this.ensureRiderSeasonStatsSchema(db);
        this.ensureRiderCategoryStatsSchema(db);
        this.ensureStageLeadoutsSchema(db);
        this.ensureRiderSeasonRolesSchema(db);
        this.ensureSeasonStandingsSnapshotsSchema(db);
        this.ensureRaceResultsCompactSchema(db);
        this.ensureTeamPreferencesData(db);
        this.ensureReferenceData(db);
        this.ensureDayChangeIndexes(db);
        this.ensurePerformanceIndexes(db);
    }
    createNewSave(filename, careerName, teamId) {
        const savePath = this.resolveSavePath(filename);
        if (fs.existsSync(savePath)) {
            throw new Error(`Savegame "${filename}" existiert bereits.`);
        }
        // Jede neue Karriere soll auf einer frisch erzeugten Master-DB basieren.
        (0, bootstrapper_1.bootstrap)(true);
        if (!fs.existsSync(this.masterDbPath)) {
            throw new Error(`Master-Datenbank nicht gefunden unter: ${this.masterDbPath}. ` +
                'Führe zuerst den Bootstrapper aus.');
        }
        const tempPath = savePath + '.tmp';
        try {
            fs.copyFileSync(this.masterDbPath, tempPath);
            fs.renameSync(tempPath, savePath);
        }
        catch (err) {
            if (fs.existsSync(tempPath))
                fs.unlinkSync(tempPath);
            throw new Error(`Fehler beim Erstellen des Savegames: ${err.message}`);
        }
        const db = new better_sqlite3_1.default(savePath);
        try {
            this.ensureAllSchemas(db);
            // Spielerteam setzen
            const teamRow = db.prepare('SELECT name FROM teams WHERE id = ?').get(teamId);
            if (!teamRow)
                throw new Error(`Team-ID ${teamId} nicht gefunden.`);
            db.prepare('UPDATE teams SET is_player_team = 0').run();
            db.prepare('UPDATE teams SET is_player_team = 1 WHERE id = ?').run(teamId);
            const teamName = teamRow.name;
            const gss = new GameStateService_1.GameStateService(db);
            const gameState = gss.ensureState();
            new RiderProgramService_1.RiderProgramService(db).ensureSeasonPrograms(gameState.season, gameState.currentDate);
            db.prepare(`
        INSERT OR REPLACE INTO career_meta (key, value)
        VALUES ('career_name', ?), ('team_name', ?), ('current_season', '2026'), ('last_saved', ?)
      `).run(careerName, teamName, new Date().toISOString());
        }
        finally {
            db.close();
        }
    }
    loadSave(filename) {
        const savePath = this.resolveSavePath(filename);
        if (!fs.existsSync(savePath)) {
            throw new Error(`Savegame "${filename}" nicht gefunden.`);
        }
        this.closeActive();
        this.activeConnection = new better_sqlite3_1.default(savePath);
        this.activeSaveName = filename;
        this.activeConnection.pragma('journal_mode = WAL');
        this.activeConnection.pragma('synchronous = NORMAL');
        this.activeConnection.pragma('foreign_keys = ON');
        this.ensureAllSchemas(this.activeConnection);
        const gameState = new GameStateService_1.GameStateService(this.activeConnection).ensureState();
        new RiderProgramService_1.RiderProgramService(this.activeConnection).ensureSeasonPrograms(gameState.season, gameState.currentDate);
        new ContractService_1.ContractService(this.activeConnection).checkContractStatuses(gameState.season);
        return this.activeConnection;
    }
    /**
     * Idempotent index creation for the hot path of the day-change transaction.
     * These cover the new CTE-based `syncRiderLoadState` aggregation and the
     * bulk program-window lookup in `GameStateService`. Skipped when the
     * underlying tables don't exist (e.g. fresh master DB).
     */
    ensureDayChangeIndexes(db) {
        const createIfTable = (table, sql) => {
            if (!tableExists(db, table))
                return;
            try {
                db.exec(sql);
            }
            catch {
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
    ensurePerformanceIndexes(db) {
        const createIfTable = (table, sql) => {
            if (!tableExists(db, table))
                return;
            try {
                db.exec(sql);
            }
            catch {
                // Ignore
            }
        };
        createIfTable('contracts', `CREATE INDEX IF NOT EXISTS idx_contracts_team ON contracts(team_id);`);
        createIfTable('stage_entries', `CREATE INDEX IF NOT EXISTS idx_stage_entries_team ON stage_entries(team_id);`);
        createIfTable('results_history', `CREATE INDEX IF NOT EXISTS idx_results_history_team ON results_history(team_id);`);
        createIfTable('results_history', `CREATE INDEX IF NOT EXISTS idx_results_history_stage ON results_history(stage_id, result_type_id, rank);`);
        createIfTable('results', `CREATE INDEX IF NOT EXISTS idx_results_race_id ON results(race_id);`);
        createIfTable('riders', `CREATE INDEX IF NOT EXISTS idx_riders_active_team ON riders(active_team_id);`);
    }
    getActiveConnection() {
        if (!this.activeConnection) {
            throw new Error('Kein Savegame geladen. Bitte zuerst ein Savegame laden.');
        }
        this.ensureAllSchemas(this.activeConnection);
        return this.activeConnection;
    }
    getMasterConnection() {
        if (!fs.existsSync(this.masterDbPath)) {
            throw new Error('Master-Datenbank nicht gefunden. Führe zuerst den Bootstrapper aus.');
        }
        return new better_sqlite3_1.default(this.masterDbPath, { readonly: true });
    }
    getActiveSaveName() {
        return this.activeSaveName;
    }
    closeActive() {
        if (this.activeConnection) {
            this.activeConnection.close();
            this.activeConnection = null;
            this.activeSaveName = null;
        }
    }
    deleteSave(filename) {
        const savePath = this.resolveSavePath(filename);
        if (this.activeSaveName === filename)
            this.closeActive();
        for (const ext of ['', '-wal', '-shm']) {
            const p = savePath + ext;
            if (fs.existsSync(p))
                fs.unlinkSync(p);
        }
    }
    listSaves() {
        if (!fs.existsSync(this.savegamesDir))
            return [];
        const files = fs.readdirSync(this.savegamesDir).filter(f => /^[\w\-]+\.db$/.test(f));
        const metas = [];
        for (const [index, filename] of files.entries()) {
            const savePath = path.join(this.savegamesDir, filename);
            let meta = {
                id: index + 1,
                filename,
                careerName: filename.replace('.db', ''),
                teamName: '–',
                currentSeason: 2026,
                lastSaved: '',
            };
            try {
                const db = new better_sqlite3_1.default(savePath, { readonly: true });
                const rows = db.prepare('SELECT key, value FROM career_meta').all();
                const stateRow = db.prepare('SELECT season FROM game_state WHERE id = 1').get();
                db.close();
                const map = Object.fromEntries(rows.map(r => [r.key, r.value]));
                meta = {
                    ...meta,
                    careerName: map['career_name'] ?? meta.careerName,
                    teamName: map['team_name'] ?? meta.teamName,
                    currentSeason: stateRow?.season ?? Number(map['current_season'] ?? 2026),
                    lastSaved: map['last_saved'] ?? '',
                };
            }
            catch {
                // Beschädigte DB → Fallback
            }
            metas.push(meta);
        }
        return metas;
    }
    getMasterDbPath() {
        return this.masterDbPath;
    }
}
exports.DatabaseService = DatabaseService;
