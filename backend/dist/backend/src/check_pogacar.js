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
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const savegamesDir = path.join(os.homedir(), '.velo', 'savegames');
async function run() {
    if (!fs.existsSync(savegamesDir)) {
        console.log(`Savegames directory not found: ${savegamesDir}`);
        return;
    }
    const files = fs.readdirSync(savegamesDir).filter(f => /^[\w\-]+\.db$/.test(f));
    for (const filename of files) {
        const dbPath = path.join(savegamesDir, filename);
        const mtime = fs.statSync(dbPath).mtime;
        console.log(`\n=================== SAVE: ${filename} (Modified: ${mtime}) ===================`);
        try {
            const db = new better_sqlite3_1.default(dbPath);
            const rider = db.prepare(`
        SELECT r.id, r.first_name, r.last_name, sr.name as role_name
        FROM riders r
        LEFT JOIN sta_role sr ON sr.id = r.role_id
        WHERE r.last_name LIKE '%Poga%'
      `).get();
            if (!rider) {
                console.log('Pogacar not found');
                db.close();
                continue;
            }
            console.log(`Pogacar: ID=${rider.id}, Name=${rider.first_name} ${rider.last_name}, Role=${rider.role_name}`);
            const prog = db.prepare(`
        SELECT rsp.program_id, rp.name as program_name
        FROM rider_season_programs rsp
        JOIN race_programs rp ON rp.id = rsp.program_id
        WHERE rsp.rider_id = ?
      `).get(rider.id);
            if (!prog) {
                console.log('No season program assigned');
            }
            else {
                console.log(`Assigned Program: ID=${prog.program_id}, Name=${prog.program_name}`);
                const races = db.prepare(`
          SELECT rpr.race_id, r.name as race_name
          FROM race_program_races rpr
          LEFT JOIN races r ON r.id = rpr.race_id
          WHERE rpr.program_id = ?
        `).all(prog.program_id);
                const giro = races.find(r => r.race_id === 23);
                if (giro) {
                    console.log(`  -> HAS GIRO: ${giro.race_name}`);
                }
                else {
                    console.log('  -> DOES NOT HAVE GIRO');
                }
            }
            db.close();
        }
        catch (err) {
            console.log(`Error reading save: ${err.message}`);
        }
    }
}
run().catch(console.error);
