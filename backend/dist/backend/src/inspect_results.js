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
const savegamesDir = path.join(process.env.USERPROFILE || process.env.HOME || '', '.velo', 'savegames');
const files = fs.readdirSync(savegamesDir).filter(f => f.endsWith('.db')).map(f => ({
    name: f,
    path: path.join(savegamesDir, f),
    mtime: fs.statSync(path.join(savegamesDir, f)).mtime
})).sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
if (files.length === 0) {
    console.log('No savegames found.');
    process.exit(0);
}
const findDbWithResults = () => {
    for (const file of files) {
        const db = new better_sqlite3_1.default(file.path, { readonly: true });
        try {
            const row = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='results'").get();
            if (row) {
                const countRow = db.prepare("SELECT COUNT(*) AS cnt FROM results").get();
                if (countRow.cnt > 0) {
                    console.log(`Found DB with results: ${file.name} (count=${countRow.cnt})`);
                    return db;
                }
            }
        }
        catch (e) {
            // ignore
        }
        db.close();
    }
    return null;
};
const db = findDbWithResults();
if (!db) {
    console.log('No savegames with results found.');
    process.exit(0);
}
try {
    // Let's find a rider ID that has some entries in results
    const riderRow = db.prepare(`
    SELECT rider_id, COUNT(*) as cnt
    FROM results
    WHERE rider_id IS NOT NULL
    GROUP BY rider_id
    ORDER BY cnt DESC
    LIMIT 3
  `).all();
    console.log('Riders with most results:', riderRow);
    if (riderRow.length > 0) {
        const riderId = riderRow[0].rider_id;
        const rows = db.prepare(`
      SELECT
        r.result_type_id AS result_type_id,
        r.rank AS rank,
        races.name AS race_name,
        races.is_stage_race AS is_stage_race,
        races.number_of_stages AS number_of_stages,
        stages.stage_number AS stage_number,
        cat.name AS category_name
      FROM results r
      JOIN stages ON stages.id = r.stage_id
      JOIN races ON races.id = stages.race_id
      JOIN race_categories cat ON cat.id = races.category_id
      WHERE r.rider_id = ?
    `).all(riderId);
        console.log(`Results for Rider ${riderId}:`, rows);
    }
}
finally {
    db.close();
}
