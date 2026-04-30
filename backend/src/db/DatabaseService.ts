import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
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
    if (!tableExists(db, 'race_categories_bonus') || columnExists(db, 'race_categories_bonus', 'points_sprint_finish')) {
      return;
    }

    db.prepare(`
      ALTER TABLE race_categories_bonus
      ADD COLUMN points_sprint_finish TEXT NOT NULL DEFAULT ''
    `).run();

    if (!fs.existsSync(this.masterDbPath)) {
      return;
    }

    const masterDb = new Database(this.masterDbPath, { readonly: true });
    try {
      if (!tableExists(masterDb, 'race_categories_bonus') || !columnExists(masterDb, 'race_categories_bonus', 'points_sprint_finish')) {
        return;
      }

      const rows = masterDb.prepare(`
        SELECT id, points_sprint_finish
        FROM race_categories_bonus
      `).all() as Array<{ id: number; points_sprint_finish: string }>;

      const update = db.prepare(`
        UPDATE race_categories_bonus
        SET points_sprint_finish = ?
        WHERE id = ?
      `);

      db.transaction(() => {
        for (const row of rows) {
          update.run(row.points_sprint_finish, row.id);
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
    this.ensureRaceCategoryBonusSchema(this.activeConnection);
    this.ensureReferenceData(this.activeConnection);
    const gameState = new GameStateService(this.activeConnection).ensureState();
    new ContractService(this.activeConnection).checkContractStatuses(gameState.season);
    return this.activeConnection;
  }

  public getActiveConnection(): Database.Database {
    if (!this.activeConnection) {
      throw new Error('Kein Savegame geladen. Bitte zuerst ein Savegame laden.');
    }
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
