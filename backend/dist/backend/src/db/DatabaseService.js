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
        const masterDb = new better_sqlite3_1.default(this.masterDbPath, { readonly: true });
        try {
            if (!tableExists(masterDb, 'race_categories_bonus') || !columnExists(masterDb, 'race_categories_bonus', 'points_sprint_finish')) {
                return;
            }
            const rows = masterDb.prepare(`
        SELECT id, points_sprint_finish
        FROM race_categories_bonus
      `).all();
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
        this.ensureRaceCategoryBonusSchema(this.activeConnection);
        this.ensureReferenceData(this.activeConnection);
        const gameState = new GameStateService_1.GameStateService(this.activeConnection).ensureState();
        new ContractService_1.ContractService(this.activeConnection).checkContractStatuses(gameState.season);
        return this.activeConnection;
    }
    getActiveConnection() {
        if (!this.activeConnection) {
            throw new Error('Kein Savegame geladen. Bitte zuerst ein Savegame laden.');
        }
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
