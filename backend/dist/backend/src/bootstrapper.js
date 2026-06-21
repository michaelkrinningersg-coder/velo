"use strict";
/**
 * bootstrapper.ts
 *
 * Liest CSV-Dateien und erstellt die Master-DB (world_data.db).
 * Wird beim Serverstart oder vor dem Anlegen einer neuen Karriere ausgefuehrt.
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
const ContractService_1 = require("./game/ContractService");
const RiderDevelopmentService_1 = require("./game/RiderDevelopmentService");
const RiderNewgenService_1 = require("./game/RiderNewgenService");
const StageScoreCalculator_1 = require("./simulation/StageScoreCalculator");
function resolveBackendRoot() {
    if (process.pkg) {
        let current = __dirname;
        while (true) {
            if (path.basename(current) === 'dist') {
                return path.dirname(current);
            }
            const parent = path.dirname(current);
            if (parent === current) {
                break;
            }
            current = parent;
        }
        return '/snapshot/backend';
    }
    let current = __dirname;
    while (true) {
        const candidate = path.join(current, 'assets');
        if (fs.existsSync(path.join(candidate, 'schema.sql'))) {
            return current;
        }
        const parent = path.dirname(current);
        if (parent === current) {
            break;
        }
        current = parent;
    }
    return path.resolve(__dirname, '..', '..');
}
const BACKEND_ROOT = resolveBackendRoot();
const ASSETS_DIR = path.join(BACKEND_ROOT, 'assets');
const CSV_DIR = path.join(BACKEND_ROOT, '..', 'data', 'csv');
const STAGES_DIR = path.join(BACKEND_ROOT, '..', 'data', 'stages');
const SCHEMA_PATH = path.join(ASSETS_DIR, 'schema.sql');
const DB_PATH = process.pkg
    ? path.join(path.dirname(process.execPath), 'world_data.db')
    : path.join(ASSETS_DIR, 'world_data.db');
const DEFAULT_RIDER_TYPE_ID = 1;
const RULE_APPLIES_TO = new Set(['sprint_intermediate', 'climb_top', 'finish']);
const RULE_MARKER_TYPES = new Set(['sprint_intermediate', 'climb_top', 'finish_flat', 'finish_hill', 'finish_mountain']);
const RULE_CLIMB_CATEGORIES = new Set(['HC', '1', '2', '3', '4']);
const RULE_WEIGHT_COLUMNS = [
    'weight_flat',
    'weight_mountain',
    'weight_medium_mountain',
    'weight_hill',
    'weight_time_trial',
    'weight_prologue',
    'weight_cobble',
    'weight_sprint',
    'weight_acceleration',
    'weight_downhill',
    'weight_attack',
    'weight_stamina',
    'weight_resistance',
    'weight_recuperation',
    'weight_bike_handling',
];
const RULE_SPREAD_COLUMNS = [
    'final_spread_late_multiplier',
    'final_spread_peak_multiplier',
];
const SKILL_WEIGHT_SIMULATION_MODES = new Set(['road', 'itt', 'ttt']);
const SKILL_WEIGHT_TERRAINS = new Set(['Flat', 'Hill', 'Medium_Mountain', 'Mountain', 'High_Mountain', 'Cobble', 'Cobble_Hill', 'Abfahrt', 'Sprint']);
function clamp(value, min = 0, max = 85) {
    return Math.max(min, Math.min(max, Math.round(value * 100) / 100));
}
function detectCsvDelimiter(line) {
    let commaCount = 0;
    let semicolonCount = 0;
    let inQuotes = false;
    for (let index = 0; index < line.length; index += 1) {
        const char = line[index];
        const next = line[index + 1];
        if (char === '"') {
            if (inQuotes && next === '"') {
                index += 1;
            }
            else {
                inQuotes = !inQuotes;
            }
            continue;
        }
        if (!inQuotes) {
            if (char === ',')
                commaCount += 1;
            if (char === ';')
                semicolonCount += 1;
        }
    }
    return semicolonCount > commaCount ? ';' : ',';
}
function parseCsvLine(line, delimiter) {
    const cells = [];
    let current = '';
    let inQuotes = false;
    for (let index = 0; index < line.length; index += 1) {
        const char = line[index];
        const next = line[index + 1];
        if (char === '"') {
            if (inQuotes && next === '"') {
                current += '"';
                index += 1;
            }
            else {
                inQuotes = !inQuotes;
            }
            continue;
        }
        if (char === delimiter && !inQuotes) {
            cells.push(current.trim());
            current = '';
            continue;
        }
        current += char;
    }
    cells.push(current.trim());
    return cells;
}
function parseCsv(content) {
    const normalized = content.replace(/^\uFEFF/, '').trim();
    if (!normalized)
        return [];
    const lines = normalized
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0);
    if (lines.length < 2) {
        throw new Error('CSV muss Header und mindestens eine Datenzeile enthalten.');
    }
    const delimiter = detectCsvDelimiter(lines[0]);
    const headers = parseCsvLine(lines[0], delimiter).map(value => value.trim());
    return lines.slice(1).map((line, index) => {
        const values = parseCsvLine(line, delimiter);
        if (values.length !== headers.length) {
            throw new Error(`CSV-Zeile ${index + 2} hat ${values.length} Spalten, erwartet ${headers.length}.`);
        }
        return headers.reduce((record, header, headerIndex) => {
            record[header] = values[headerIndex] ?? '';
            return record;
        }, {});
    });
}
function readCsv(fileName) {
    const filePath = path.join(CSV_DIR, fileName);
    if (!fs.existsSync(filePath)) {
        throw new Error(`CSV nicht gefunden: ${filePath}`);
    }
    return parseCsv(fs.readFileSync(filePath, 'utf8'));
}
function parseNullableCsvValue(value) {
    const normalized = (value ?? '').trim();
    return normalized.length === 0 || normalized.toLowerCase() === 'null' ? null : normalized;
}
function isValidStageMarkerType(value) {
    return ['start', 'climb_start', 'climb_top', 'sprint_intermediate', 'finish_flat', 'finish_TT', 'finish_hill', 'finish_mountain'].includes(value);
}
function isValidStageMarkerCategory(value) {
    return ['HC', '1', '2', '3', '4', 'Sprint'].includes(value);
}
function parseStageDetailMarkers(typesValue, namesValue, categoriesValue, ctx) {
    const types = typesValue.split('|').map((value) => value.trim()).filter((value) => value.length > 0);
    if (types.length === 0)
        return [];
    const names = namesValue.split('|');
    const categories = categoriesValue.split('|');
    return types.map((type, index) => {
        if (!isValidStageMarkerType(type)) {
            throw new Error(`${ctx}: Ungueltiger Marker-Typ ${type}.`);
        }
        const rawCategory = parseNullableCsvValue(categories[index]);
        if (rawCategory != null && !isValidStageMarkerCategory(rawCategory)) {
            throw new Error(`${ctx}: Ungueltige Marker-Kategorie ${rawCategory}.`);
        }
        return {
            type,
            name: parseNullableCsvValue(names[index]),
            cat: rawCategory,
        };
    });
}
function readStageScoreSegments(detailsCsvFile, ctx) {
    const filePath = path.join(STAGES_DIR, detailsCsvFile);
    if (!fs.existsSync(filePath)) {
        throw new Error(`${ctx}: Stage-Detail-CSV nicht gefunden: ${detailsCsvFile}`);
    }
    return parseCsv(fs.readFileSync(filePath, 'utf8')).map((row, index) => {
        const rowCtx = `${detailsCsvFile} Zeile ${index + 2}`;
        const lengthKm = real(req(row, 'length_km', rowCtx), `${rowCtx} / length_km`);
        const gradientPercent = real(req(row, 'gradient_percent', rowCtx), `${rowCtx} / gradient_percent`);
        const segment = {
            lengthKm,
            gradientPercent,
            terrain: row['terrain']?.trim() || undefined,
            markers: parseStageDetailMarkers(row['marker_type'] ?? '', row['marker_name'] ?? '', row['marker_cat'] ?? '', rowCtx),
            endMarkers: parseStageDetailMarkers(row['end_marker_type'] ?? '', row['end_marker_name'] ?? '', row['end_marker_cat'] ?? '', rowCtx),
        };
        return segment;
    });
}
function req(row, key, ctx) {
    const value = row[key]?.trim();
    if (!value) {
        throw new Error(`${ctx}: Pflichtfeld "${key}" fehlt.`);
    }
    return value;
}
function int(value, ctx) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isInteger(parsed)) {
        throw new Error(`${ctx}: Ganzzahl erwartet, erhalten "${value}".`);
    }
    return parsed;
}
function real(value, ctx) {
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) {
        throw new Error(`${ctx}: Zahl erwartet, erhalten "${value}".`);
    }
    return parsed;
}
function boolFlag(value, ctx) {
    if (value === '0' || value === '1') {
        return Number(value);
    }
    throw new Error(`${ctx}: Feld muss 0 oder 1 sein, erhalten "${value}".`);
}
function optionalInt(value) {
    const normalized = value?.trim();
    if (!normalized) {
        return null;
    }
    const parsed = Number.parseInt(normalized, 10);
    return Number.isInteger(parsed) ? parsed : null;
}
function createDeterministicRandom(seed) {
    let state = seed >>> 0;
    return () => {
        state = (state * 1664525 + 1013904223) >>> 0;
        return state / 0x100000000;
    };
}
function shuffleDeterministically(items, seed) {
    const shuffled = [...items];
    const random = createDeterministicRandom(seed);
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
}
function seedStaCountry(db) {
    const rows = readCsv('sta_country.csv');
    const insert = db.prepare(`
    INSERT INTO sta_country (id, name, code_3, continent, regen_rating, number_regen_min, number_regen_max)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
    for (const [index, row] of rows.entries()) {
        const ctx = `sta_country.csv Zeile ${index + 2}`;
        insert.run(int(req(row, 'id', ctx), ctx), req(row, 'name', ctx), req(row, 'code_3', ctx), req(row, 'continent', ctx), int(req(row, 'regen_rating', ctx), ctx), int(req(row, 'number_regen_min', ctx), ctx), int(req(row, 'number_regen_max', ctx), ctx));
    }
    console.log(`  ${rows.length} Laender eingefuegt.`);
}
function seedTypeRider(db) {
    const rows = readCsv('type_rider.csv');
    const insert = db.prepare(`
    INSERT INTO type_rider (id, type_key, display_name, is_stage_focus, is_one_day_focus)
    VALUES (?, ?, ?, ?, ?)
  `);
    for (const [index, row] of rows.entries()) {
        const ctx = `type_rider.csv Zeile ${index + 2}`;
        insert.run(int(req(row, 'id', ctx), ctx), req(row, 'key', ctx), req(row, 'display_name', ctx), boolFlag(req(row, 'is_stage_focus', ctx), ctx), boolFlag(req(row, 'is_one_day_focus', ctx), ctx));
    }
    console.log(`  ${rows.length} Fahrertypen eingefuegt.`);
}
function seedStaRole(db) {
    const rows = readCsv('sta_role.csv');
    const insert = db.prepare('INSERT INTO sta_role (id, name, weighting) VALUES (?, ?, ?)');
    for (const [index, row] of rows.entries()) {
        const ctx = `sta_role.csv Zeile ${index + 2}`;
        insert.run(int(req(row, 'id', ctx), ctx), req(row, 'name', ctx), int(req(row, 'weighting', ctx), ctx));
    }
    console.log(`  ${rows.length} Rollen eingefuegt.`);
}
function seedResultTypes(db) {
    const rows = readCsv('result_types.csv');
    const insert = db.prepare('INSERT INTO result_types (id, name) VALUES (?, ?)');
    for (const [index, row] of rows.entries()) {
        const ctx = `result_types.csv Zeile ${index + 2}`;
        insert.run(int(req(row, 'id', ctx), ctx), req(row, 'name', ctx));
    }
    console.log(`  ${rows.length} Ergebnisarten eingefuegt.`);
}
function seedDivisionTeams(db) {
    const rows = readCsv('division_teams.csv');
    const insert = db.prepare(`
    INSERT INTO division_teams (name, tier, max_teams, min_roster_size, max_roster_size)
    VALUES (?, ?, ?, ?, ?)
  `);
    for (const [index, row] of rows.entries()) {
        const ctx = `division_teams.csv Zeile ${index + 2}`;
        insert.run(req(row, 'name', ctx), int(req(row, 'tier', ctx), ctx), int(req(row, 'max_teams', ctx), ctx), int(req(row, 'min_roster_size', ctx), ctx), int(req(row, 'max_roster_size', ctx), ctx));
    }
    const divisionIdByName = new Map();
    const divisionRows = db.prepare('SELECT id, name FROM division_teams').all();
    for (const row of divisionRows) {
        divisionIdByName.set(row.name, row.id);
    }
    console.log(`  ${rows.length} Divisionen eingefuegt.`);
    return divisionIdByName;
}
function readTeamSeeds() {
    return readCsv('teams.csv').map((row, index) => {
        const ctx = `teams.csv Zeile ${index + 2}`;
        const abbreviation = req(row, 'abbreviation', ctx).toUpperCase();
        if (abbreviation.length !== 3) {
            throw new Error(`${ctx}: abbreviation muss 3 Zeichen haben.`);
        }
        return {
            id: int(req(row, 'team_id', ctx), ctx),
            name: req(row, 'name', ctx),
            abbreviation,
            divisionName: req(row, 'division_name', ctx),
            isPlayerTeam: boolFlag(req(row, 'is_player_team', ctx), ctx),
            countryId: int(req(row, 'country_id', ctx), ctx),
            colorPrimary: req(row, 'color_primary', ctx),
            colorSecondary: req(row, 'color_secondary', ctx),
            aiFocus1: int(req(row, 'ai_focus_1', ctx), ctx),
            aiFocus2: int(req(row, 'ai_focus_2', ctx), ctx),
            aiFocus3: int(req(row, 'ai_focus_3', ctx), ctx),
        };
    });
}
function seedTeams(db, divisionIdByName) {
    const mainTeams = readTeamSeeds().filter(team => team.divisionName !== 'U23');
    const insert = db.prepare(`
    INSERT INTO teams (
      id, name, abbreviation, division_id, u23_team, is_player_team, country_id,
      color_primary, color_secondary, ai_focus_1, ai_focus_2, ai_focus_3
    ) VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?)
  `);
    for (const team of mainTeams) {
        const divisionId = divisionIdByName.get(team.divisionName);
        if (divisionId == null) {
            throw new Error(`Unbekannte Division "${team.divisionName}" fuer Team "${team.name}".`);
        }
        insert.run(team.id, team.name, team.abbreviation, divisionId, team.isPlayerTeam, team.countryId, team.colorPrimary, team.colorSecondary, team.aiFocus1, team.aiFocus2, team.aiFocus3);
    }
    console.log(`  ${mainTeams.length} Teams eingefuegt.`);
}
function seedRaceCategoriesBonus(db) {
    const rows = readCsv('race_categories_bonus.csv');
    const insert = db.prepare(`
    INSERT INTO race_categories_bonus (
      id, name, bonus_seconds_final, bonus_seconds_intermediate, points_stage,
      points_mountainstage, points_sprint_finish, points_one_day, points_gc_final, points_jersey_leader_day, points_jersey_sprint_day,
      points_jersey_mountain_day, points_jersey_youth_day, points_sprint_intermediate,
      points_mountain_hc, points_mountain_cat1, points_mountain_cat2, points_mountain_cat3,
      points_mountain_cat4, points_jersey_sprint_final, points_jersey_mountain_final,
      points_jersey_youth_final
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    for (const [index, row] of rows.entries()) {
        const ctx = `race_categories_bonus.csv Zeile ${index + 2}`;
        insert.run(int(req(row, 'id', ctx), ctx), req(row, 'name', ctx), req(row, 'bonus_seconds_final', ctx), req(row, 'bonus_seconds_intermediate', ctx), req(row, 'points_stage', ctx), req(row, 'points_mountainstage', ctx), req(row, 'points_sprint_finish', ctx), req(row, 'points_one_day', ctx), req(row, 'points_gc_final', ctx), int(req(row, 'points_jersey_leader_day', ctx), ctx), int(req(row, 'points_jersey_sprint_day', ctx), ctx), int(req(row, 'points_jersey_mountain_day', ctx), ctx), int(req(row, 'points_jersey_youth_day', ctx), ctx), req(row, 'points_sprint_intermediate', ctx), req(row, 'points_mountain_hc', ctx), req(row, 'points_mountain_cat1', ctx), req(row, 'points_mountain_cat2', ctx), req(row, 'points_mountain_cat3', ctx), req(row, 'points_mountain_cat4', ctx), req(row, 'points_jersey_sprint_final', ctx), req(row, 'points_jersey_mountain_final', ctx), req(row, 'points_jersey_youth_final', ctx));
    }
    console.log(`  ${rows.length} Kategorie-Bonussysteme eingefuegt.`);
}
function seedRules(db) {
    const rows = readCsv('rules.csv');
    const insert = db.prepare(`
    INSERT INTO rules (
      id, rule_key, applies_to, marker_type, marker_category,
      weight_flat, weight_mountain, weight_medium_mountain, weight_hill,
      weight_time_trial, weight_prologue, weight_cobble, weight_sprint,
      weight_acceleration, weight_downhill, weight_attack, weight_stamina,
      weight_resistance, weight_recuperation, weight_bike_handling
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const seenContextKeys = new Set();
    for (const [index, row] of rows.entries()) {
        const ctx = `rules.csv Zeile ${index + 2}`;
        const appliesTo = req(row, 'applies_to', ctx);
        const markerType = req(row, 'marker_type', ctx);
        const markerCategory = row['marker_category']?.trim() || null;
        if (!RULE_APPLIES_TO.has(appliesTo)) {
            throw new Error(`${ctx}: applies_to "${appliesTo}" ist ungueltig.`);
        }
        if (!RULE_MARKER_TYPES.has(markerType)) {
            throw new Error(`${ctx}: marker_type "${markerType}" ist ungueltig.`);
        }
        if (appliesTo === 'sprint_intermediate' && (markerType !== 'sprint_intermediate' || markerCategory != null)) {
            throw new Error(`${ctx}: Sprint-Zwischenwertungen erwarten marker_type sprint_intermediate ohne marker_category.`);
        }
        if (appliesTo === 'climb_top' && (markerType !== 'climb_top' || markerCategory == null || !RULE_CLIMB_CATEGORIES.has(markerCategory))) {
            throw new Error(`${ctx}: Bergwertungen erwarten marker_type climb_top und marker_category HC/1/2/3/4.`);
        }
        if (appliesTo === 'finish' && (!['finish_flat', 'finish_hill', 'finish_mountain'].includes(markerType) || markerCategory != null)) {
            throw new Error(`${ctx}: Zielregeln erwarten finish_flat/finish_hill/finish_mountain ohne marker_category.`);
        }
        const weightValues = RULE_WEIGHT_COLUMNS.map((columnName) => {
            const value = real(row[columnName] ?? '0', `${ctx} / ${columnName}`);
            if (value < 0) {
                throw new Error(`${ctx}: ${columnName} darf nicht negativ sein.`);
            }
            return value;
        });
        if (weightValues.every((value) => value === 0)) {
            throw new Error(`${ctx}: Mindestens ein Gewicht muss groesser als 0 sein.`);
        }
        const contextKey = `${appliesTo}|${markerType}|${markerCategory ?? ''}`;
        if (seenContextKeys.has(contextKey)) {
            throw new Error(`${ctx}: Doppelte Regel fuer Kontext ${contextKey}.`);
        }
        seenContextKeys.add(contextKey);
        insert.run(int(req(row, 'id', ctx), ctx), req(row, 'rule_key', ctx), appliesTo, markerType, markerCategory, ...weightValues);
    }
    console.log(`  ${rows.length} Regelprofile eingefuegt.`);
}
function seedSkillWeights(db) {
    const rows = readCsv('skill_weights.csv');
    const insert = db.prepare(`
    INSERT INTO skill_weights (
      id, simulation_mode, terrain,
      weight_flat, weight_mountain, weight_medium_mountain, weight_hill, weight_time_trial,
      weight_prologue, weight_cobble, weight_sprint, weight_acceleration, weight_downhill,
      weight_attack, weight_stamina, weight_resistance, weight_recuperation, weight_bike_handling,
      final_spread_late_multiplier, final_spread_peak_multiplier,
      ttt_speed_multiplier
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    for (const [index, row] of rows.entries()) {
        const ctx = `skill_weights.csv Zeile ${index + 2}`;
        const simulationMode = req(row, 'simulation_mode', ctx);
        const terrain = req(row, 'terrain', ctx);
        if (!SKILL_WEIGHT_SIMULATION_MODES.has(simulationMode)) {
            throw new Error(`${ctx}: simulation_mode "${simulationMode}" ist ungueltig.`);
        }
        if (!SKILL_WEIGHT_TERRAINS.has(terrain)) {
            throw new Error(`${ctx}: terrain "${terrain}" ist ungueltig.`);
        }
        const weightValues = RULE_WEIGHT_COLUMNS.map((columnName) => {
            const value = real(row[columnName] ?? '0', `${ctx} / ${columnName}`);
            if (value < 0) {
                throw new Error(`${ctx}: ${columnName} darf nicht negativ sein.`);
            }
            return value;
        });
        if (weightValues.every((value) => value === 0)) {
            throw new Error(`${ctx}: Mindestens ein Gewicht muss groesser als 0 sein.`);
        }
        const spreadValues = RULE_SPREAD_COLUMNS.map((columnName) => {
            const value = real(row[columnName] ?? '1', `${ctx} / ${columnName}`);
            if (value <= 0) {
                throw new Error(`${ctx}: ${columnName} muss groesser als 0 sein.`);
            }
            return value;
        });
        const tttSpeedMultiplier = real(row['ttt_speed_multiplier'] ?? '1', `${ctx} / ttt_speed_multiplier`);
        if (tttSpeedMultiplier <= 0) {
            throw new Error(`${ctx}: ttt_speed_multiplier muss groesser als 0 sein.`);
        }
        insert.run(int(req(row, 'id', ctx), ctx), simulationMode, terrain, ...weightValues, ...spreadValues, tttSpeedMultiplier);
    }
    console.log(`  ${rows.length} Skill-Gewichte eingefuegt.`);
}
function seedRaceCategories(db) {
    const rows = readCsv('race_categories.csv');
    const insert = db.prepare(`
    INSERT INTO race_categories (id, name, tier, number_of_teams, number_of_riders, bonus_system_id, home_selection_probability)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
    for (const [index, row] of rows.entries()) {
        const ctx = `race_categories.csv Zeile ${index + 2}`;
        const riderCount = int(req(row, 'number_of_riders', ctx), ctx);
        insert.run(int(req(row, 'id', ctx), ctx), req(row, 'name', ctx), int(req(row, 'tier', ctx), ctx), int(req(row, 'number_of_teams', ctx), ctx), riderCount, int(req(row, 'bonus_system_id', ctx), ctx), real(req(row, 'home_selection_probability', ctx), ctx));
    }
    console.log(`  ${rows.length} Rennkategorien eingefuegt.`);
}
function seedRaces(db) {
    const rows = readCsv('races.csv');
    const insert = db.prepare(`
    INSERT INTO races (
      id, name, country_id, category_id, is_stage_race, number_of_stages, start_date, end_date, prestige
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    for (const [index, row] of rows.entries()) {
        const ctx = `races.csv Zeile ${index + 2}`;
        insert.run(int(req(row, 'id', ctx), ctx), req(row, 'name', ctx), int(req(row, 'country_id', ctx), ctx), int(req(row, 'category_id', ctx), ctx), boolFlag(req(row, 'is_stage_race', ctx), ctx), int(req(row, 'number_of_stages', ctx), ctx), req(row, 'start_date', ctx), req(row, 'end_date', ctx), int(req(row, 'prestige', ctx), ctx));
    }
    console.log(`  ${rows.length} Rennen eingefuegt.`);
}
function seedRacePrograms(db) {
    const rows = readCsv('race_programs.csv');
    const insert = db.prepare(`
    INSERT INTO race_programs (
      id, name, peak1_min, peak1_max, peak2_min, peak2_max, peak3_min, peak3_max
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
    for (const [index, row] of rows.entries()) {
        const ctx = `race_programs.csv Zeile ${index + 2}`;
        const peak1Min = int(req(row, 'peak1_min', ctx), `${ctx} / peak1_min`);
        const peak1Max = int(req(row, 'peak1_max', ctx), `${ctx} / peak1_max`);
        const peak2Min = int(req(row, 'peak2_min', ctx), `${ctx} / peak2_min`);
        const peak2Max = int(req(row, 'peak2_max', ctx), `${ctx} / peak2_max`);
        const peak3Min = int(req(row, 'peak3_min', ctx), `${ctx} / peak3_min`);
        const peak3Max = int(req(row, 'peak3_max', ctx), `${ctx} / peak3_max`);
        const peaks = [
            ['peak1', peak1Min, peak1Max],
            ['peak2', peak2Min, peak2Max],
            ['peak3', peak3Min, peak3Max],
        ];
        for (const [label, minWeek, maxWeek] of peaks) {
            if (minWeek < 1 || minWeek > 53 || maxWeek < 1 || maxWeek > 53) {
                throw new Error(`${ctx}: ${label}_min und ${label}_max muessen zwischen 1 und 53 liegen.`);
            }
            if (minWeek > maxWeek) {
                throw new Error(`${ctx}: ${label}_min darf nicht groesser als ${label}_max sein.`);
            }
        }
        insert.run(int(req(row, 'id', ctx), ctx), req(row, 'name', ctx), peak1Min, peak1Max, peak2Min, peak2Max, peak3Min, peak3Max);
    }
    console.log(`  ${rows.length} Rennprogramme eingefuegt.`);
}
function seedRaceProgramRaces(db) {
    const rows = readCsv('race_program_races.csv');
    const insert = db.prepare('INSERT INTO race_program_races (id, program_id, race_id) VALUES (?, ?, ?)');
    const hasProgram = db.prepare('SELECT 1 FROM race_programs WHERE id = ?');
    const hasRace = db.prepare('SELECT 1 FROM races WHERE id = ?');
    for (const [index, row] of rows.entries()) {
        const ctx = `race_program_races.csv Zeile ${index + 2}`;
        const id = int(req(row, 'id', ctx), ctx);
        const programId = int(req(row, 'program_id', ctx), ctx);
        const raceId = int(req(row, 'race_id', ctx), ctx);
        if (!hasProgram.get(programId)) {
            throw new Error(`${ctx}: program_id ${programId} existiert nicht.`);
        }
        if (!hasRace.get(raceId)) {
            throw new Error(`${ctx}: race_id ${raceId} existiert nicht.`);
        }
        insert.run(id, programId, raceId);
    }
    console.log(`  ${rows.length} Rennprogramm-Rennen-Zuordnungen eingefuegt.`);
}
function seedRaceProgramProbabilityRules(db) {
    const rows = readCsv('race_program_probability_rules.csv');
    const insert = db.prepare(`
    INSERT INTO race_program_probability_rules (
      id, role_name, spec_1, spec_2, spec_3, program_id, probability
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
    const hasRole = db.prepare('SELECT 1 FROM sta_role WHERE name = ?');
    const hasRiderType = db.prepare('SELECT 1 FROM type_rider WHERE id = ?');
    const programs = db.prepare('SELECT id, name FROM race_programs ORDER BY id ASC').all();
    let insertedRows = 0;
    for (const [index, row] of rows.entries()) {
        const ctx = `race_program_probability_rules.csv Zeile ${index + 2}`;
        const matrixId = int(req(row, 'id', ctx), ctx);
        const roleName = req(row, 'role_name', ctx);
        const specs = [
            int(req(row, 'spec_1', ctx), `${ctx} / spec_1`),
            int(req(row, 'spec_2', ctx), `${ctx} / spec_2`),
            int(req(row, 'spec_3', ctx), `${ctx} / spec_3`),
        ].sort((left, right) => left - right);
        if (!hasRole.get(roleName)) {
            throw new Error(`${ctx}: role_name "${roleName}" existiert nicht in sta_role.`);
        }
        for (const spec of specs) {
            if (!hasRiderType.get(spec)) {
                throw new Error(`${ctx}: spec ${spec} existiert nicht in type_rider.`);
            }
        }
        if (new Set(specs).size !== 3) {
            throw new Error(`${ctx}: spec_1, spec_2 und spec_3 muessen drei unterschiedliche type_rider-IDs sein.`);
        }
        let probabilitySum = 0;
        for (const program of programs) {
            const probability = real(req(row, program.name, ctx), `${ctx} / ${program.name}`);
            if (probability < 0) {
                throw new Error(`${ctx}: ${program.name} muss groesser oder gleich 0 sein.`);
            }
            probabilitySum += probability;
            insertedRows += 1;
            insert.run(insertedRows, roleName, specs[0], specs[1], specs[2], program.id, probability);
        }
        if (Math.abs(probabilitySum - 100) > 0.0001) {
            throw new Error(`${ctx}: Wahrscheinlichkeiten fuer ${roleName}|${specs.join('|')} ergeben ${probabilitySum}, erwartet 100.`);
        }
        if (matrixId !== index + 1) {
            throw new Error(`${ctx}: id ${matrixId} ist nicht fortlaufend, erwartet ${index + 1}.`);
        }
    }
    console.log(`  ${rows.length} Matrixregeln gelesen, ${insertedRows} Rennprogramm-Wahrscheinlichkeiten eingefuegt.`);
}
function seedStages(db) {
    const rows = readCsv('stages.csv');
    const insert = db.prepare(`
    INSERT INTO stages (
      id, race_id, stage_number, date, profile, start_elevation, details_csv_file,
      final_spread_start_percent, final_push_start_percent, final_spread_difficulty_multiplier,
      crash_incident_multiplier, mechanical_incident_multiplier, stage_score, allowed_weather
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const insertClimbScore = db.prepare(`
    INSERT INTO stage_climb_scores (
      stage_id, climb_index, name, category, start_km, end_km, climb_score
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
    for (const [index, row] of rows.entries()) {
        const ctx = `stages.csv Zeile ${index + 2}`;
        const stageId = int(req(row, 'id', ctx), ctx);
        const startElevation = int(req(row, 'start_elevation', ctx), ctx);
        const detailsCsvFile = req(row, 'details_csv_file', ctx);
        const finalSpreadStartPercent = real(row['final_spread_start_percent'] ?? '70', `${ctx} / final_spread_start_percent`);
        if (finalSpreadStartPercent < 0 || finalSpreadStartPercent > 100) {
            throw new Error(`${ctx}: final_spread_start_percent muss zwischen 0 und 100 liegen.`);
        }
        const finalPushStartPercent = real(row['final_push_start_percent'] ?? '90', `${ctx} / final_push_start_percent`);
        if (finalPushStartPercent < 0 || finalPushStartPercent > 100) {
            throw new Error(`${ctx}: final_push_start_percent muss zwischen 0 und 100 liegen.`);
        }
        const finalSpreadDifficultyMultiplier = real(row['final_spread_difficulty_multiplier'] ?? '1', `${ctx} / final_spread_difficulty_multiplier`);
        if (finalSpreadDifficultyMultiplier <= 0) {
            throw new Error(`${ctx}: final_spread_difficulty_multiplier muss groesser als 0 sein.`);
        }
        const crashIncidentMultiplier = real(row['crash_incident_multiplier'] ?? '1', `${ctx} / crash_incident_multiplier`);
        if (crashIncidentMultiplier <= 0) {
            throw new Error(`${ctx}: crash_incident_multiplier muss groesser als 0 sein.`);
        }
        const mechanicalIncidentMultiplier = real(row['mechanical_incident_multiplier'] ?? '1', `${ctx} / mechanical_incident_multiplier`);
        if (mechanicalIncidentMultiplier <= 0) {
            throw new Error(`${ctx}: mechanical_incident_multiplier muss groesser als 0 sein.`);
        }
        const scoreSegments = readStageScoreSegments(detailsCsvFile, ctx);
        const stageScore = (0, StageScoreCalculator_1.calculateStageScore)(scoreSegments, startElevation);
        insert.run(stageId, int(req(row, 'race_id', ctx), ctx), int(req(row, 'stage_number', ctx), ctx), req(row, 'date', ctx), req(row, 'profile', ctx), startElevation, detailsCsvFile, finalSpreadStartPercent, finalPushStartPercent, finalSpreadDifficultyMultiplier, crashIncidentMultiplier, mechanicalIncidentMultiplier, stageScore, row['allowed_weather'] ?? '1|2|3|4|5|6|7');
        for (const climbScore of (0, StageScoreCalculator_1.calculateClimbScoresForStage)(scoreSegments, startElevation)) {
            insertClimbScore.run(stageId, climbScore.climbIndex, climbScore.name, climbScore.category, climbScore.startKm, climbScore.endKm, climbScore.score);
        }
    }
    console.log(`  ${rows.length} Etappen eingefuegt.`);
}
function seedWetter(db) {
    const rows = readCsv('wetter.csv');
    const insert = db.prepare(`
    INSERT INTO wetter (
      id, wetter_name,
      effekt_sturz_min, effekt_sturz_max,
      effekt_defekt_min, effekt_defekt_max,
      windkanten_gefahr_min, windkanten_gefahr_max,
      effekt_fatigue_min, effekt_fatigue_max,
      breakaway_bonus_min, breakaway_bonus_max
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    for (const [index, row] of rows.entries()) {
        const ctx = `wetter.csv Zeile ${index + 2}`;
        insert.run(int(req(row, 'id', ctx), ctx), req(row, 'wetter_name', ctx), real(row['effekt_sturz_min'] ?? '0', `${ctx} / effekt_sturz_min`), real(row['effekt_sturz_max'] ?? '0', `${ctx} / effekt_sturz_max`), real(row['effekt_defekt_min'] ?? '0', `${ctx} / effekt_defekt_min`), real(row['effekt_defekt_max'] ?? '0', `${ctx} / effekt_defekt_max`), real(row['windkanten_gefahr_min'] ?? '0', `${ctx} / windkanten_gefahr_min`), real(row['windkanten_gefahr_max'] ?? '0', `${ctx} / windkanten_gefahr_max`), real(row['effekt_fatigue_min'] ?? '0', `${ctx} / effekt_fatigue_min`), real(row['effekt_fatigue_max'] ?? '0', `${ctx} / effekt_fatigue_max`), real(row['breakaway_bonus_min'] ?? '0', `${ctx} / breakaway_bonus_min`), real(row['breakaway_bonus_max'] ?? '0', `${ctx} / breakaway_bonus_max`));
    }
    console.log(`  ${rows.length} Wetterkonditionen eingefuegt.`);
}
function provisionalOverall(row, ctx) {
    const sum = int(req(row, 'skill_flat', ctx), ctx) +
        int(req(row, 'skill_mountain', ctx), ctx) +
        int(req(row, 'skill_medium_mountain', ctx), ctx) +
        int(req(row, 'skill_hill', ctx), ctx) +
        int(req(row, 'skill_time_trial', ctx), ctx) +
        int(req(row, 'skill_cobble', ctx), ctx) +
        int(req(row, 'skill_sprint', ctx), ctx) * 1.2 +
        int(req(row, 'skill_stamina', ctx), ctx) +
        int(req(row, 'skill_resistance', ctx), ctx) +
        int(req(row, 'skill_recuperation', ctx), ctx) +
        int(req(row, 'skill_acceleration', ctx), ctx);
    return clamp(sum / 11.2);
}
function seedRiders(db) {
    const rows = readCsv('riders.csv');
    const insert = db.prepare(`
    INSERT INTO riders (
      id, first_name, last_name, country_id, rider_type_id, birth_year, overall_rating,
      skill_flat, skill_mountain, skill_medium_mountain, skill_hill, skill_time_trial,
      skill_prologue, skill_cobble, skill_sprint, skill_acceleration, skill_downhill,
      skill_attack, skill_stamina, skill_resistance, skill_recuperation,
      active_team_id, favorite_races, non_favorite_races, weather_profile_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    for (const [index, row] of rows.entries()) {
        const ctx = `riders.csv Zeile ${index + 2}`;
        const seededTeamId = optionalInt(row['team_id']);
        const weatherProfileId = Math.floor(Math.random() * 7) + 1;
        insert.run(int(req(row, 'rider_id', ctx), ctx), req(row, 'first_name', ctx), req(row, 'last_name', ctx), int(req(row, 'country_id', ctx), ctx), DEFAULT_RIDER_TYPE_ID, int(req(row, 'birth_year', ctx), ctx), provisionalOverall(row, ctx), int(req(row, 'skill_flat', ctx), ctx), int(req(row, 'skill_mountain', ctx), ctx), int(req(row, 'skill_medium_mountain', ctx), ctx), int(req(row, 'skill_hill', ctx), ctx), int(req(row, 'skill_time_trial', ctx), ctx), int(req(row, 'skill_prologue', ctx), ctx), int(req(row, 'skill_cobble', ctx), ctx), int(req(row, 'skill_sprint', ctx), ctx), int(req(row, 'skill_acceleration', ctx), ctx), int(req(row, 'skill_downhill', ctx), ctx), int(req(row, 'skill_attack', ctx), ctx), int(req(row, 'skill_stamina', ctx), ctx), int(req(row, 'skill_resistance', ctx), ctx), int(req(row, 'skill_recuperation', ctx), ctx), seededTeamId, row['favorite_races']?.trim() ?? '', row['non_favorite_races']?.trim() ?? '', weatherProfileId);
    }
    console.log(`  ${rows.length} Fahrer eingefuegt.`);
}
function seedContracts(db) {
    const currentSeason = db.prepare('SELECT season FROM game_state WHERE id = 1').get();
    if (!currentSeason) {
        throw new Error('game_state muss vor contracts gesetzt sein.');
    }
    const teams = db.prepare(`
    SELECT teams.id, division_teams.name AS division_name, division_teams.tier AS tier, division_teams.min_roster_size, division_teams.max_roster_size
    FROM teams
    JOIN division_teams ON division_teams.id = teams.division_id
    WHERE division_teams.name IN ('WorldTour', 'ProTour')
    ORDER BY division_teams.tier ASC, teams.id ASC
  `).all();
    const assignedRiders = db.prepare(`
    SELECT id, active_team_id
    FROM riders
    WHERE is_retired = 0
      AND active_team_id IS NOT NULL
    ORDER BY active_team_id ASC, overall_rating DESC, id ASC
  `).all();
    const riderCountByTeam = new Map();
    for (const rider of assignedRiders) {
        riderCountByTeam.set(rider.active_team_id, (riderCountByTeam.get(rider.active_team_id) ?? 0) + 1);
    }
    for (const team of teams) {
        const riderCount = riderCountByTeam.get(team.id) ?? 0;
        const minRosterSize = team.min_roster_size;
        const maxRosterSize = team.max_roster_size;
        if (riderCount < minRosterSize || riderCount > maxRosterSize) {
            throw new Error(`Team ${team.id} (${team.division_name}) hat ${riderCount} gesetzte Fahrer in riders.csv, erwartet zwischen ${minRosterSize} und ${maxRosterSize}.`);
        }
    }
    const insert = db.prepare(`
    INSERT INTO contracts (rider_id, team_id, start_season, end_season, status)
    VALUES (?, ?, ?, ?, ?)
  `);
    const shuffledRiders = shuffleDeterministically(assignedRiders, currentSeason.season + 2026);
    const totalRiders = shuffledRiders.length;
    const contracts2026 = Math.floor(totalRiders * 2 / 5);
    const contracts2027 = Math.floor(totalRiders * 2 / 5);
    for (const [index, rider] of shuffledRiders.entries()) {
        const endSeason = index < contracts2026
            ? currentSeason.season
            : index < contracts2026 + contracts2027
                ? currentSeason.season + 1
                : currentSeason.season + 2;
        insert.run(rider.id, rider.active_team_id, currentSeason.season, endSeason, 'active');
    }
    console.log(`  ${assignedRiders.length} Vertraege fuer ${teams.length} Teams aus riders.csv erzeugt.`);
}
function seedGameState(db) {
    const rows = readCsv('game_state.csv');
    if (rows.length === 0) {
        throw new Error('game_state.csv enthaelt keine Daten.');
    }
    const row = rows[0];
    const ctx = 'game_state.csv Zeile 2';
    const currentDate = req(row, 'current_date', ctx);
    const season = int(req(row, 'season', ctx), ctx);
    const isGameOver = boolFlag(req(row, 'is_game_over', ctx), ctx);
    db.prepare(`
    INSERT OR REPLACE INTO game_state (id, "current_date", season, is_game_over)
    VALUES (1, ?, ?, ?)
  `).run(currentDate, season, isGameOver);
    console.log(`  Spielzustand gesetzt: ${currentDate}, Saison ${season}.`);
    return season;
}
function seedRaceEntries(db) {
    const races = db.prepare(`
    SELECT races.id, race_categories.number_of_teams, race_categories.number_of_riders
    FROM races
    JOIN race_categories ON race_categories.id = races.category_id
    ORDER BY races.id ASC
  `).all();
    const teams = db.prepare(`
    SELECT teams.id
    FROM teams
    JOIN division_teams ON division_teams.id = teams.division_id
    WHERE division_teams.name != 'U23'
    ORDER BY division_teams.tier ASC, teams.id ASC
  `).all();
    const selectRiders = db.prepare(`
    SELECT id
    FROM riders
    WHERE active_team_id = ? AND is_retired = 0
    ORDER BY overall_rating DESC, id ASC
    LIMIT ?
  `);
    const insertEntry = db.prepare('INSERT OR IGNORE INTO race_entries (race_id, team_id, rider_id) VALUES (?, ?, ?)');
    db.transaction(() => {
        for (const race of races) {
            const selectedTeams = teams.slice(0, race.number_of_teams);
            for (const team of selectedTeams) {
                const riders = selectRiders.all(team.id, race.number_of_riders);
                for (const rider of riders) {
                    insertEntry.run(race.id, team.id, rider.id);
                }
            }
        }
    })();
    console.log('  Race-Entries angelegt.');
}
function cleanupDatabaseFiles() {
    for (const suffix of ['', '-wal', '-shm']) {
        const filePath = DB_PATH + suffix;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}
// ---- Newgen: Reihenfolge der Skill-/Pot-Min-Max-Spalten -----
// Definiert die Reihenfolge, in der die min/max-Spalten aus den CSVs
// in die SQL-INSERT-Statements uebernommen werden. Die hier genannten
// Schluessel muessen mit den Spaltennamen in schema.sql uebereinstimmen.
const NEWGEN_SKILL_FIELDS = [
    'flat',
    'mountain',
    'medium_mountain',
    'hill',
    'time_trial',
    'prologue',
    'cobble',
    'sprint',
    'acceleration',
    'downhill',
    'attack',
    'stamina',
    'resistance',
    'recuperation',
    'bike_handling',
];
function newgenInsertColumns(prefix, suffix) {
    return NEWGEN_SKILL_FIELDS
        .map((field) => `${prefix}${field}${suffix}`)
        .join(', ');
}
function seedNewgenStartPresets(db) {
    const rows = readCsv('newgen_start_presets.csv');
    const insertColumns = [
        'preset_id',
        'type_key',
        'display_name',
        'weight',
        newgenInsertColumns('min_', ''),
        newgenInsertColumns('max_', ''),
    ].join(', ');
    const placeholders = new Array(insertColumns.split(',').length).fill('?').join(', ');
    const insert = db.prepare(`INSERT INTO newgen_start_presets (${insertColumns}) VALUES (${placeholders})`);
    for (const [index, row] of rows.entries()) {
        const ctx = `newgen_start_presets.csv Zeile ${index + 2}`;
        const minValues = NEWGEN_SKILL_FIELDS.map((field) => real(req(row, `min_${field}`, `${ctx} / min_${field}`), `${ctx} / min_${field}`));
        const maxValues = NEWGEN_SKILL_FIELDS.map((field) => {
            const value = real(req(row, `max_${field}`, `${ctx} / max_${field}`), `${ctx} / max_${field}`);
            if (value < minValues[NEWGEN_SKILL_FIELDS.indexOf(field)]) {
                throw new Error(`${ctx}: max_${field} (${value}) ist kleiner als min_${field} (${minValues[NEWGEN_SKILL_FIELDS.indexOf(field)]}).`);
            }
            return value;
        });
        insert.run(int(req(row, 'preset_id', ctx), ctx), req(row, 'type_key', ctx), req(row, 'display_name', ctx), int(req(row, 'weight', ctx), ctx), ...minValues, ...maxValues);
    }
    console.log(`  ${rows.length} Newgen-Startwert-Presets eingefuegt.`);
}
function seedNewgenPotentialPresets(db) {
    const rows = readCsv('newgen_potential_presets.csv');
    const insertColumns = [
        'preset_id',
        'display_name',
        'weight',
        newgenInsertColumns('min_pot_', ''),
        newgenInsertColumns('max_pot_', ''),
    ].join(', ');
    const placeholders = new Array(insertColumns.split(',').length).fill('?').join(', ');
    const insert = db.prepare(`INSERT INTO newgen_potential_presets (${insertColumns}) VALUES (${placeholders})`);
    for (const [index, row] of rows.entries()) {
        const ctx = `newgen_potential_presets.csv Zeile ${index + 2}`;
        const minValues = NEWGEN_SKILL_FIELDS.map((field) => real(req(row, `min_pot_${field}`, `${ctx} / min_pot_${field}`), `${ctx} / min_pot_${field}`));
        const maxValues = NEWGEN_SKILL_FIELDS.map((field, fieldIndex) => {
            const value = real(req(row, `max_pot_${field}`, `${ctx} / max_pot_${field}`), `${ctx} / max_pot_${field}`);
            if (value < minValues[fieldIndex]) {
                throw new Error(`${ctx}: max_pot_${field} (${value}) ist kleiner als min_pot_${field} (${minValues[fieldIndex]}).`);
            }
            return value;
        });
        insert.run(int(req(row, 'preset_id', ctx), ctx), req(row, 'display_name', ctx), int(req(row, 'weight', ctx), ctx), ...minValues, ...maxValues);
    }
    console.log(`  ${rows.length} Newgen-Potential-Presets eingefuegt.`);
}
function seedRiderNames(db) {
    const rows = readCsv('rider_names.csv');
    const insert = db.prepare(`
    INSERT INTO rider_names (country_id, type, value, weight)
    VALUES (?, ?, ?, ?)
  `);
    const hasCountry = db.prepare('SELECT 1 FROM sta_country WHERE id = ?');
    const seenKeys = new Set();
    for (const [index, row] of rows.entries()) {
        const ctx = `rider_names.csv Zeile ${index + 2}`;
        const countryId = int(req(row, 'country_id', ctx), ctx);
        const type = req(row, 'type', ctx);
        if (type !== 'first' && type !== 'last') {
            throw new Error(`${ctx}: type muss 'first' oder 'last' sein, erhalten "${type}".`);
        }
        const value = req(row, 'value', ctx);
        if (!hasCountry.get(countryId)) {
            throw new Error(`${ctx}: country_id ${countryId} existiert nicht in sta_country.`);
        }
        const key = `${countryId}|${type}|${value}`;
        if (seenKeys.has(key)) {
            throw new Error(`${ctx}: doppelter Eintrag fuer Schluessel ${key}.`);
        }
        seenKeys.add(key);
        insert.run(countryId, type, value, int(req(row, 'weight', ctx), ctx));
    }
    console.log(`  ${rows.length} Namenseintraege fuer ${seenKeys.size / 1} Zeilen eingefuegt.`);
}
function bootstrap(force = false) {
    if (!force && fs.existsSync(DB_PATH)) {
        console.log('Bootstrap: world_data.db bereits vorhanden, uebersprungen.');
        return;
    }
    console.log('Bootstrap: Erstelle world_data.db ...');
    if (!process.pkg && !fs.existsSync(ASSETS_DIR)) {
        fs.mkdirSync(ASSETS_DIR, { recursive: true });
    }
    cleanupDatabaseFiles();
    let db = null;
    try {
        db = new better_sqlite3_1.default(DB_PATH);
        db.pragma('foreign_keys = ON');
        const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
        db.exec(schema);
        console.log('  Schema angewendet.');
        seedStaCountry(db);
        seedTypeRider(db);
        seedStaRole(db);
        seedResultTypes(db);
        seedNewgenStartPresets(db);
        seedNewgenPotentialPresets(db);
        seedRiderNames(db);
        const divisionIdByName = seedDivisionTeams(db);
        seedTeams(db, divisionIdByName);
        seedRaceCategoriesBonus(db);
        seedRules(db);
        seedRaceCategories(db);
        seedSkillWeights(db);
        seedRaces(db);
        seedRacePrograms(db);
        seedRaceProgramRaces(db);
        seedRaceProgramProbabilityRules(db);
        seedWetter(db);
        seedStages(db);
        seedRiders(db);
        const currentSeason = seedGameState(db);
        new RiderNewgenService_1.RiderNewgenService(db).createYearStartNewgens(currentSeason);
        new RiderDevelopmentService_1.RiderDevelopmentService(db).initializeRiders(currentSeason, true);
        seedContracts(db);
        new ContractService_1.ContractService(db).checkContractStatuses(currentSeason);
        db.pragma('wal_checkpoint(TRUNCATE)');
        db.pragma('journal_mode = DELETE');
        db.close();
        db = null;
        console.log(`✅  world_data.db erstellt: ${DB_PATH}`);
    }
    catch (error) {
        try {
            db?.close();
        }
        catch {
            // Ignorieren, wir bereinigen die Dateien ohnehin.
        }
        cleanupDatabaseFiles();
        throw error;
    }
}
