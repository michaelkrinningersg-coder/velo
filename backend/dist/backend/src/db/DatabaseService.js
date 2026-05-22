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
    const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName);
    return row != null;
}
function columnExists(db, tableName, columnName) {
    const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
    return columns.some((column) => column.name === columnName);
}
function resolveAssetsDir() {
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
class DatabaseService {
    constructor() {
        this.activeConnection = null;
        this.activeSaveName = null;
        const assetsDir = resolveAssetsDir();
        this.masterDbPath = path.join(assetsDir, MASTER_DB_NAME);
        this.schemaPath = path.join(assetsDir, 'schema.sql');
        this.savegamesDir = process.env['SAVEGAME_DIR']
            ?? path.join(os.homedir(), '.velo', 'savegames');
        this.ensureSavegamesDir();
    }
    applyLatestSchema(db) {
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
    ensureRaceCategoryRoleSchema(db) {
        if (!tableExists(db, 'race_categories') || columnExists(db, 'race_categories', 'role_1')) {
            return;
        }
        const roleColumns = ['role_1', 'role_2', 'role_3', 'role_4', 'role_5', 'role_6'];
        for (const columnName of roleColumns) {
            db.prepare(`
        ALTER TABLE race_categories
        ADD COLUMN ${columnName} INTEGER NOT NULL DEFAULT 0 CHECK(${columnName} >= 0)
      `).run();
        }
        if (!fs.existsSync(this.masterDbPath)) {
            return;
        }
        const masterDb = new better_sqlite3_1.default(this.masterDbPath, { readonly: true });
        try {
            if (!tableExists(masterDb, 'race_categories') || !columnExists(masterDb, 'race_categories', 'role_1')) {
                return;
            }
            const rows = masterDb.prepare(`
        SELECT id, role_1, role_2, role_3, role_4, role_5, role_6
        FROM race_categories
      `).all();
            const update = db.prepare(`
        UPDATE race_categories
        SET role_1 = ?, role_2 = ?, role_3 = ?, role_4 = ?, role_5 = ?, role_6 = ?
        WHERE id = ?
      `);
            db.transaction(() => {
                for (const row of rows) {
                    update.run(row.role_1, row.role_2, row.role_3, row.role_4, row.role_5, row.role_6, row.id);
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
               ${columnExists(masterDb, 'stages', 'mechanical_incident_multiplier') ? 'mechanical_incident_multiplier' : '1 AS mechanical_incident_multiplier'}
        FROM stages
      `).all();
            const update = db.prepare(`
        UPDATE stages
        SET final_spread_start_percent = ?,
            final_push_start_percent = ?,
            final_spread_difficulty_multiplier = ?,
            crash_incident_multiplier = ?,
            mechanical_incident_multiplier = ?
        WHERE id = ?
      `);
            db.transaction(() => {
                for (const row of rows) {
                    update.run(row.final_spread_start_percent ?? 70, row.final_push_start_percent ?? 90, row.final_spread_difficulty_multiplier ?? 1, row.crash_incident_multiplier ?? 1, row.mechanical_incident_multiplier ?? 1, row.id);
                }
            })();
        }
        finally {
            masterDb.close();
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
          CHECK(
            (result_type_id = 1 AND team_id IS NOT NULL)
            OR
            (result_type_id = 6 AND rider_id IS NULL AND team_id IS NOT NULL)
            OR
            (result_type_id NOT IN (1, 6) AND rider_id IS NOT NULL AND team_id IS NOT NULL)
          )
        );

        INSERT INTO results_new (
          id, race_id, stage_id, rider_id, team_id, result_type_id, rank, time_seconds, points
        )
        SELECT
          id, race_id, stage_id, rider_id, team_id, result_type_id, rank, time_seconds, points
        FROM results;

        DROP TABLE results;
        ALTER TABLE results_new RENAME TO results;

        CREATE UNIQUE INDEX IF NOT EXISTS idx_results_stage_rider_type
          ON results(stage_id, rider_id, result_type_id)
          WHERE rider_id IS NOT NULL;
      `);
        })();
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
            // Spielerteam setzen
            const teamRow = db.prepare('SELECT name FROM teams WHERE id = ?').get(teamId);
            if (!teamRow)
                throw new Error(`Team-ID ${teamId} nicht gefunden.`);
            db.prepare('UPDATE teams SET is_player_team = 0').run();
            db.prepare('UPDATE teams SET is_player_team = 1 WHERE id = ?').run(teamId);
            const teamName = teamRow.name;
            const gss = new GameStateService_1.GameStateService(db);
            gss.ensureState();
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
        this.activeConnection.pragma('foreign_keys = ON');
        this.applyLatestSchema(this.activeConnection);
        this.ensureResultsSchema(this.activeConnection);
        this.ensureRaceCategoryBonusSchema(this.activeConnection);
        this.ensureRaceCategoryRoleSchema(this.activeConnection);
        this.ensureRulesData(this.activeConnection);
        this.ensureSkillWeightsData(this.activeConnection);
        this.ensureStageSpreadData(this.activeConnection);
        this.ensureStageRaceStateSchema(this.activeConnection);
        this.ensureRiderFormSchema(this.activeConnection);
        this.ensureReferenceData(this.activeConnection);
        const gameState = new GameStateService_1.GameStateService(this.activeConnection).ensureState();
        new ContractService_1.ContractService(this.activeConnection).checkContractStatuses(gameState.season);
        return this.activeConnection;
    }
    getActiveConnection() {
        if (!this.activeConnection) {
            throw new Error('Kein Savegame geladen. Bitte zuerst ein Savegame laden.');
        }
        this.applyLatestSchema(this.activeConnection);
        this.ensureResultsSchema(this.activeConnection);
        this.ensureStageRaceStateSchema(this.activeConnection);
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
