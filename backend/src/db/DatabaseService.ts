import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { DEFAULT_SKILL_WEIGHT_RULES } from '../../../shared/skillWeights';
import { SavegameMeta } from '../../../shared/types';
import { bootstrap } from '../bootstrapper';
import { ContractService } from '../game/ContractService';
import { GameStateService } from '../game/GameStateService';

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
    this.masterDbPath = path.join(assetsDir, MASTER_DB_NAME);
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

  private ensureRaceCategoryRoleSchema(db: Database.Database): void {
    if (!tableExists(db, 'race_categories') || columnExists(db, 'race_categories', 'role_1')) {
      return;
    }

    const roleColumns = ['role_1', 'role_2', 'role_3', 'role_4', 'role_5', 'role_6'] as const;
    for (const columnName of roleColumns) {
      db.prepare(`
        ALTER TABLE race_categories
        ADD COLUMN ${columnName} INTEGER NOT NULL DEFAULT 0 CHECK(${columnName} >= 0)
      `).run();
    }

    if (!fs.existsSync(this.masterDbPath)) {
      return;
    }

    const masterDb = new Database(this.masterDbPath, { readonly: true });
    try {
      if (!tableExists(masterDb, 'race_categories') || !columnExists(masterDb, 'race_categories', 'role_1')) {
        return;
      }

      const rows = masterDb.prepare(`
        SELECT id, role_1, role_2, role_3, role_4, role_5, role_6
        FROM race_categories
      `).all() as Array<{ id: number; role_1: number; role_2: number; role_3: number; role_4: number; role_5: number; role_6: number }>;

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

    if (!columnExists(db, 'skill_weights', 'ttt_speed_multiplier')) {
      db.prepare(`
        ALTER TABLE skill_weights
        ADD COLUMN ttt_speed_multiplier REAL NOT NULL DEFAULT 1 CHECK(ttt_speed_multiplier > 0)
      `).run();
    }

    const existingCount = db.prepare('SELECT COUNT(*) AS count FROM skill_weights').get() as { count: number } | undefined;
    const fallbackMultiplierByKey = new Map<string, number>(
      DEFAULT_SKILL_WEIGHT_RULES.map((rule) => [`${rule.simulationMode}:${rule.terrain}`, rule.tttSpeedMultiplier] as const),
    );

    const updateMultiplier = db.prepare(`
      UPDATE skill_weights
      SET ttt_speed_multiplier = ?
      WHERE simulation_mode = ? AND terrain = ?
    `);

    const applyMultiplierFallbacks = (rows: Array<{ simulation_mode: string; terrain: string; ttt_speed_multiplier?: number }>): void => {
      db.transaction(() => {
        for (const row of rows) {
          const key = `${row.simulation_mode}:${row.terrain}`;
          const multiplier = row.ttt_speed_multiplier ?? fallbackMultiplierByKey.get(key) ?? 1;
          updateMultiplier.run(multiplier, row.simulation_mode, row.terrain);
        }
      })();
    };

    if ((existingCount?.count ?? 0) > 0) {
      if (fs.existsSync(this.masterDbPath)) {
        const masterDb = new Database(this.masterDbPath, { readonly: true });
        try {
          if (tableExists(masterDb, 'skill_weights')) {
            const masterHasMultiplierColumn = columnExists(masterDb, 'skill_weights', 'ttt_speed_multiplier');
            const masterRows = masterDb.prepare(`
              SELECT simulation_mode, terrain${masterHasMultiplierColumn ? ', ttt_speed_multiplier' : ''}
              FROM skill_weights
            `).all() as Array<{ simulation_mode: string; terrain: string; ttt_speed_multiplier?: number }>;
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
        ttt_speed_multiplier: number;
      }>;

      const insert = db.prepare(`
        INSERT OR REPLACE INTO skill_weights (
          id, simulation_mode, terrain,
          weight_flat, weight_mountain, weight_medium_mountain, weight_hill, weight_time_trial,
          weight_prologue, weight_cobble, weight_sprint, weight_acceleration, weight_downhill,
          weight_attack, weight_stamina, weight_resistance, weight_recuperation, weight_bike_handling,
          ttt_speed_multiplier
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            row.ttt_speed_multiplier ?? fallbackMultiplierByKey.get(`${row.simulation_mode}:${row.terrain}`) ?? 1,
          );
        }
      })();
    } finally {
      masterDb.close();
    }
  }

  private ensureResultsSchema(db: Database.Database): void {
    if (!tableExists(db, 'results')) {
      return;
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

    db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_r_form_daily_awards (
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        award_date TEXT NOT NULL,
        award_type TEXT NOT NULL CHECK(award_type IN ('build', 'free')),
        PRIMARY KEY (rider_id, award_date)
      )
    `).run();
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
      gss.ensureState();
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
    this.activeConnection.pragma('foreign_keys = ON');
    this.applyLatestSchema(this.activeConnection);
    this.ensureResultsSchema(this.activeConnection);
    this.ensureRaceCategoryBonusSchema(this.activeConnection);
    this.ensureRaceCategoryRoleSchema(this.activeConnection);
    this.ensureRulesData(this.activeConnection);
    this.ensureSkillWeightsData(this.activeConnection);
    this.ensureRiderFormSchema(this.activeConnection);
    this.ensureReferenceData(this.activeConnection);
    const gameState = new GameStateService(this.activeConnection).ensureState();
    new ContractService(this.activeConnection).checkContractStatuses(gameState.season);
    return this.activeConnection;
  }

  public getActiveConnection(): Database.Database {
    if (!this.activeConnection) {
      throw new Error('Kein Savegame geladen. Bitte zuerst ein Savegame laden.');
    }

    this.applyLatestSchema(this.activeConnection);
    this.ensureResultsSchema(this.activeConnection);

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
