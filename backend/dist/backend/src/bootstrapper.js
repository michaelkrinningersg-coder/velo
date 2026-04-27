"use strict";
/**
 * bootstrapper.ts
 *
 * Liest CSV-Dateien und erstellt die Master-DB (world_data.db).
 * Wird beim Serverstart ausgeführt wenn die DB fehlt.
 */
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
exports.bootstrap = bootstrap;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function resolveBackendRoot() {
    const candidates = [
        path.resolve(__dirname, '..', '..'),
        path.resolve(__dirname, '..', '..', '..'),
        path.resolve(__dirname, '..', '..', '..', '..'),
        process.cwd(),
    ];
    for (const candidate of candidates) {
        if (fs.existsSync(path.join(candidate, 'assets', 'schema.sql'))) {
            return candidate;
        }
    }
    return candidates[0];
}
const BACKEND_ROOT = resolveBackendRoot();
const ASSETS_DIR = path.join(BACKEND_ROOT, 'assets');
const CSV_DIR = path.join(BACKEND_ROOT, '..', 'data', 'csv');
const SCHEMA_PATH = path.join(ASSETS_DIR, 'schema.sql');
const DB_PATH = path.join(ASSETS_DIR, 'world_data.db');
// ------ Hilfsfunktionen ----------------------------------------
function clamp(v, min = 0, max = 100) {
    return Math.max(min, Math.min(max, Math.round(v)));
}
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function calcOverall(attrs) {
    return clamp(Math.round(attrs.reduce((s, v) => s + v, 0) / attrs.length));
}
function parseCsv(content) {
    const normalized = content.replace(/^\uFEFF/, '').trim();
    if (!normalized)
        return [];
    const lines = normalized.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2)
        throw new Error('CSV muss Header und mindestens eine Datenzeile enthalten.');
    const headers = lines[0].split(',').map(v => v.trim());
    return lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        if (values.length !== headers.length) {
            throw new Error(`CSV-Zeile ${index + 2} hat ${values.length} Spalten, erwartet ${headers.length}.`);
        }
        return headers.reduce((rec, h, i) => { rec[h] = values[i]; return rec; }, {});
    });
}
function readCsv(fileName) {
    const filePath = path.join(CSV_DIR, fileName);
    if (!fs.existsSync(filePath))
        throw new Error(`CSV nicht gefunden: ${filePath}`);
    return parseCsv(fs.readFileSync(filePath, 'utf8'));
}
function req(row, key, ctx) {
    const v = row[key]?.trim();
    if (!v)
        throw new Error(`${ctx}: Pflichtfeld "${key}" fehlt.`);
    return v;
}
function int(value, ctx) {
    const n = Number.parseInt(value, 10);
    if (!Number.isInteger(n))
        throw new Error(`${ctx}: Ganzzahl erwartet, erhalten "${value}".`);
    return n;
}
function boolFlag(value, ctx) {
    if (value === '0' || value === '1')
        return Number(value);
    throw new Error(`${ctx}: Feld muss 0 oder 1 sein, erhalten "${value}".`);
}
// ------ Nationen -----------------------------------------------
const NATIONS = [
    ['BEL', 'Belgien'], ['FRA', 'Frankreich'], ['ITA', 'Italien'],
    ['ESP', 'Spanien'], ['NED', 'Niederlande'], ['GER', 'Deutschland'],
    ['GBR', 'Großbritannien'], ['USA', 'Vereinigte Staaten'], ['COL', 'Kolumbien'],
    ['AUS', 'Australien'], ['DEN', 'Dänemark'], ['NOR', 'Norwegen'],
    ['SLO', 'Slowenien'], ['POR', 'Portugal'], ['SUI', 'Schweiz'],
    ['POL', 'Polen'], ['AUT', 'Österreich'], ['LUX', 'Luxemburg'],
    ['IRE', 'Irland'], ['CZE', 'Tschechien'], ['SVK', 'Slowakei'],
    ['KAZ', 'Kasachstan'], ['RSA', 'Südafrika'], ['OTHER', 'Andere'],
];
// ------ U23-Abkürzung ------------------------------------------
function createU23Abbreviation(base, used) {
    const n = base.toUpperCase().replace(/[^A-Z0-9]/g, '').padEnd(3, 'X').slice(0, 3);
    const candidates = [`U${n.slice(0, 2)}`, `${n[0]}U${n[1]}`, `${n.slice(0, 2)}U`, `U${n[0]}${n[2]}`];
    for (const c of candidates) {
        if (c.length === 3 && !used.has(c)) {
            used.add(c);
            return c;
        }
    }
    for (let i = 0; i <= 9; i++) {
        const c = `U${n[0]}${i}`;
        if (!used.has(c)) {
            used.add(c);
            return c;
        }
    }
    throw new Error(`Keine freie U23-Abkürzung für ${base}.`);
}
function makeRider(first, last, nat, birthYear, archetype) {
    const base = rand(55, 75);
    const high = rand(78, 92);
    return {
        first, last, nat, birthYear, potential: clamp(high + rand(0, 8)),
        attrs: {
            tt: clamp(base + (archetype === 'tt' ? rand(10, 20) : rand(-5, 5))),
            climb: clamp(base + (archetype === 'climber' ? rand(10, 20) : rand(-8, 5))),
            sprint: clamp(base + (archetype === 'sprinter' ? rand(10, 20) : rand(-10, 3))),
            flat: clamp(base + (archetype === 'allrounder' ? rand(5, 12) : rand(-5, 8))),
            stamina: clamp(base + rand(-3, 10)),
            desc: clamp(base + rand(-5, 8)),
            pos: clamp(base + rand(-5, 10)),
            rec: clamp(base + rand(-5, 8)),
        },
    };
}
const RIDERS = [
    makeRider('Lukas', 'Bauer', 'GER', 1995, 'tt'),
    makeRider('Antoine', 'Leroy', 'FRA', 1993, 'tt'),
    makeRider('Filippo', 'Ricci', 'ITA', 1997, 'tt'),
    makeRider('Stefan', 'Küng', 'SUI', 1994, 'tt'),
    makeRider('Remco', 'Van Damme', 'BEL', 1999, 'tt'),
    makeRider('Magnus', 'Larsen', 'DEN', 1998, 'tt'),
    makeRider('Tadej', 'Rozman', 'SLO', 1999, 'climber'),
    makeRider('Miguel', 'Montoya', 'COL', 1997, 'climber'),
    makeRider('Emanuel', 'Bernal', 'COL', 2000, 'climber'),
    makeRider('Guillaume', 'Bardet', 'FRA', 1991, 'climber'),
    makeRider('Enric', 'Caravaggio', 'ESP', 1998, 'climber'),
    makeRider('Jonas', 'Strandvik', 'NOR', 1996, 'climber'),
    makeRider('Caleb', 'Hawkins', 'GBR', 1994, 'sprinter'),
    makeRider('Jasper', 'Bakker', 'NED', 1996, 'sprinter'),
    makeRider('Fernando', 'Gaviria', 'COL', 1994, 'sprinter'),
    makeRider('Sam', 'Walsh', 'AUS', 1997, 'sprinter'),
    makeRider('Tom', 'Pieters', 'BEL', 1990, 'allrounder'),
    makeRider('Chris', 'Frampton', 'GBR', 1988, 'allrounder'),
    makeRider('Geraint', 'James', 'GBR', 1986, 'allrounder'),
    makeRider('Romain', 'Bardet', 'FRA', 1990, 'allrounder'),
    makeRider('Alberto', 'Valverde', 'ESP', 1991, 'allrounder'),
    makeRider('Michael', 'Albers', 'GER', 1997, 'allrounder'),
    makeRider('Wout', 'Van Aert', 'BEL', 1994, 'allrounder'),
    makeRider('Mathieu', 'Vantour', 'NED', 1995, 'allrounder'),
    makeRider('Mikkel', 'Frolich', 'DEN', 1999, 'climber'),
    makeRider('Pavel', 'Sivakov', 'POL', 1997, 'tt'),
    makeRider('Lucas', 'Hamilton', 'AUS', 1996, 'allrounder'),
    makeRider('Nils', 'Politt', 'GER', 1994, 'allrounder'),
    makeRider('Toms', 'Skujins', 'OTHER', 1991, 'allrounder'),
    makeRider('Rohan', 'Dennis', 'AUS', 1990, 'tt'),
    makeRider('Tony', 'Martin', 'GER', 1985, 'tt'),
    makeRider('Sean', 'Kelly', 'IRE', 1999, 'sprinter'),
    makeRider('Dan', 'Martin', 'IRE', 1988, 'climber'),
    makeRider('Felix', 'Grossschartner', 'AUT', 1993, 'climber'),
    makeRider('Patrick', 'Konrad', 'AUT', 1991, 'allrounder'),
    makeRider('Przemyslaw', 'Niec', 'POL', 1992, 'allrounder'),
    makeRider('Sergio', 'Higuita', 'COL', 1998, 'climber'),
    makeRider('Ivan', 'Sosa', 'COL', 1999, 'climber'),
    makeRider('Tao', 'Geoghegan', 'GBR', 1995, 'climber'),
    makeRider('Hugh', 'Carthy', 'GBR', 1994, 'climber'),
];
const RACES = [
    { name: 'Prologue – Chrono de Genève', type: 'TimeTrial', date: '2026-03-01', dist: 7.5, elev: 80, grad: 1.2, ttType: 'ITT' },
    { name: 'Grand Prix du Rhin – Einzelzeitfahren', type: 'TimeTrial', date: '2026-04-15', dist: 42.0, elev: 350, grad: 2.1, ttType: 'ITT' },
    { name: 'Tour des Alpes – Einzelzeitfahren', type: 'TimeTrial', date: '2026-05-20', dist: 28.5, elev: 620, grad: 4.8, ttType: 'ITT' },
    { name: 'Criterium du Nord', type: 'Flat', date: '2026-03-15', dist: 185, elev: 720, grad: 1.1 },
    { name: 'Klassieker van Vlaanderen', type: 'Classics', date: '2026-04-05', dist: 265, elev: 2400, grad: 6.5 },
    { name: 'Giro di Montagna – Etappe 12', type: 'Mountain', date: '2026-05-28', dist: 172, elev: 4800, grad: 7.2 },
];
// ------ Bootstrap-Funktion ------------------------------------
function bootstrap(force = false) {
    if (!force && fs.existsSync(DB_PATH)) {
        console.log('Bootstrap: world_data.db bereits vorhanden, übersprungen.');
        return;
    }
    console.log('Bootstrap: Erstelle world_data.db …');
    if (!fs.existsSync(ASSETS_DIR))
        fs.mkdirSync(ASSETS_DIR, { recursive: true });
    for (const suffix of ['', '-wal', '-shm']) {
        const filePath = DB_PATH + suffix;
        if (fs.existsSync(filePath))
            fs.unlinkSync(filePath);
    }
    const db = new better_sqlite3_1.default(DB_PATH);
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
    db.exec(schema);
    console.log('  Schema angewendet.');
    // Nationen
    const insNation = db.prepare('INSERT OR IGNORE INTO nations (code, name) VALUES (?, ?)');
    for (const [code, name] of NATIONS)
        insNation.run(code, name);
    // Divisionen aus CSV
    const divisions = readCsv('division_teams.csv').map((row, i) => {
        const ctx = `division_teams.csv Zeile ${i + 2}`;
        return {
            name: req(row, 'name', ctx),
            tier: int(req(row, 'tier', ctx), ctx),
            maxTeams: int(req(row, 'max_teams', ctx), ctx),
            minRosterSize: int(req(row, 'min_roster_size', ctx), ctx),
            maxRosterSize: int(req(row, 'max_roster_size', ctx), ctx),
        };
    });
    const insDivision = db.prepare('INSERT INTO division_teams (name, tier, max_teams, min_roster_size, max_roster_size) VALUES (?, ?, ?, ?, ?)');
    for (const d of divisions)
        insDivision.run(d.name, d.tier, d.maxTeams, d.minRosterSize, d.maxRosterSize);
    const divMap = new Map();
    for (const row of db.prepare('SELECT id, name FROM division_teams').all()) {
        divMap.set(row.name, row.id);
    }
    // Teams aus CSV
    const teamSeeds = readCsv('teams.csv').map((row, i) => {
        const ctx = `teams.csv Zeile ${i + 2}`;
        const abbr = req(row, 'abbreviation', ctx).toUpperCase();
        if (abbr.length !== 3)
            throw new Error(`${ctx}: abbreviation muss 3 Zeichen haben.`);
        return {
            name: req(row, 'name', ctx), abbreviation: abbr,
            divisionName: req(row, 'division_name', ctx),
            isPlayerTeam: boolFlag(req(row, 'is_player_team', ctx), ctx),
            countryCode: req(row, 'country_code', ctx),
            colorPrimary: req(row, 'color_primary', ctx),
            colorSecondary: req(row, 'color_secondary', ctx),
            aiFocus1: int(req(row, 'ai_focus_1', ctx), ctx),
            aiFocus2: int(req(row, 'ai_focus_2', ctx), ctx),
            aiFocus3: int(req(row, 'ai_focus_3', ctx), ctx),
        };
    });
    const mainTeams = teamSeeds.filter(t => t.divisionName !== 'U23');
    const usedAbbr = new Set(mainTeams.map(t => t.abbreviation));
    const u23Teams = mainTeams.map(t => ({
        mainTeamName: t.name,
        name: `${t.name} U23`,
        abbreviation: createU23Abbreviation(t.abbreviation, usedAbbr),
        divisionName: 'U23',
        isPlayerTeam: 0,
        countryCode: t.countryCode,
        colorPrimary: t.colorPrimary,
        colorSecondary: t.colorSecondary,
        aiFocus1: t.aiFocus1, aiFocus2: t.aiFocus2, aiFocus3: t.aiFocus3,
    }));
    const insTeam = db.prepare(`INSERT INTO teams (name, abbreviation, division_id, u23_team, is_player_team, country_code, color_primary, color_secondary, ai_focus_1, ai_focus_2, ai_focus_3)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    const linkU23 = db.prepare('UPDATE teams SET u23_team = ? WHERE id = ?');
    const mainTeamIds = new Map();
    const u23TeamIds = new Map();
    for (const t of mainTeams) {
        const divId = divMap.get(t.divisionName);
        if (divId == null)
            throw new Error(`Unbekannte Division "${t.divisionName}" für Team "${t.name}".`);
        const result = insTeam.run(t.name, t.abbreviation, divId, null, t.isPlayerTeam, t.countryCode, t.colorPrimary, t.colorSecondary, t.aiFocus1, t.aiFocus2, t.aiFocus3);
        mainTeamIds.set(t.name, Number(result.lastInsertRowid));
    }
    for (const t of u23Teams) {
        const divId = divMap.get(t.divisionName);
        if (divId == null)
            throw new Error(`Unbekannte Division "${t.divisionName}" für U23-Team "${t.name}".`);
        const result = insTeam.run(t.name, t.abbreviation, divId, null, t.isPlayerTeam, t.countryCode, t.colorPrimary, t.colorSecondary, t.aiFocus1, t.aiFocus2, t.aiFocus3);
        u23TeamIds.set(t.mainTeamName, Number(result.lastInsertRowid));
    }
    for (const [teamName, mainId] of mainTeamIds) {
        const u23Id = u23TeamIds.get(teamName);
        if (u23Id != null)
            linkU23.run(u23Id, mainId);
    }
    console.log(`  ${mainTeams.length} Hauptteams + ${u23Teams.length} U23-Teams eingefügt.`);
    // Fahrer
    const insRider = db.prepare(`
    INSERT INTO riders (first_name, last_name, nationality, birth_year, potential, overall_rating,
      attr_time_trial, attr_climbing, attr_sprint, attr_flat_endur,
      attr_stamina, attr_descending, attr_positioning, attr_recovery, team_id)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);
    const teamRows = db.prepare('SELECT id, name FROM teams').all();
    const worldTourTeams = teamRows.filter(tr => mainTeams.find(m => m.name === tr.name)?.divisionName === 'WorldTour');
    let teamIdx = 0;
    for (const [i, r] of RIDERS.entries()) {
        if (i > 0 && i % 5 === 0)
            teamIdx++;
        const team = worldTourTeams[teamIdx % worldTourTeams.length];
        const overall = calcOverall([r.attrs.tt, r.attrs.climb, r.attrs.sprint, r.attrs.flat, r.attrs.stamina]);
        insRider.run(r.first, r.last, r.nat, r.birthYear, r.potential, overall, r.attrs.tt, r.attrs.climb, r.attrs.sprint, r.attrs.flat, r.attrs.stamina, r.attrs.desc, r.attrs.pos, r.attrs.rec, team.id);
    }
    console.log(`  ${RIDERS.length} Fahrer eingefügt.`);
    // Rennen
    const insRace = db.prepare('INSERT INTO races (name, type, season, date, distance_km, elevation_gain, avg_gradient, tt_type) VALUES (?, ?, 2026, ?, ?, ?, ?, ?)');
    for (const race of RACES)
        insRace.run(race.name, race.type, race.date, race.dist, race.elev, race.grad, race.ttType ?? null);
    console.log(`  ${RACES.length} Rennen eingefügt.`);
    // Initialer Spielzustand aus CSV
    const gsRows = readCsv('game_state.csv');
    if (gsRows.length > 0) {
        const gsRow = gsRows[0];
        const ctx = 'game_state.csv Zeile 2';
        const currentDate = req(gsRow, 'current_date', ctx);
        const season = int(req(gsRow, 'season', ctx), ctx);
        const isGameOver = boolFlag(req(gsRow, 'is_game_over', ctx), ctx);
        db.prepare('INSERT OR REPLACE INTO game_state (id, "current_date", season, is_game_over) VALUES (1, ?, ?, ?)').run(currentDate, season, isGameOver);
        console.log(`  Spielzustand gesetzt: ${currentDate}, Saison ${season}.`);
    }
    // Race-Entries
    const raceRows = db.prepare('SELECT id FROM races').all();
    const riderRows = db.prepare('SELECT id, team_id FROM riders').all();
    const insEntry = db.prepare('INSERT OR IGNORE INTO race_entries (race_id, team_id, rider_id) VALUES (?,?,?)');
    db.transaction(() => {
        for (const race of raceRows)
            for (const rider of riderRows)
                insEntry.run(race.id, rider.team_id, rider.id);
    })();
    console.log('  Race-Entries angelegt.');
    // Die Master-DB dient als Kopiervorlage. Daher alle WAL-Änderungen vor dem Schließen
    // in die Hauptdatei schreiben, damit Savegames nie aus einem unvollständigen Stand entstehen.
    db.pragma('wal_checkpoint(TRUNCATE)');
    db.pragma('journal_mode = DELETE');
    db.close();
    console.log('✅  world_data.db erstellt:', DB_PATH);
}
