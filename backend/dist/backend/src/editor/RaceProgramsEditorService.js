"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaceProgramsEditorService = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function resolveDataCsvDir() {
    const candidates = [
        path_1.default.resolve(__dirname, '..', '..', '..', 'data', 'csv'),
        path_1.default.resolve(__dirname, '..', '..', '..', '..', 'data', 'csv'),
        path_1.default.resolve(__dirname, '..', '..', '..', '..', '..', 'data', 'csv'),
        path_1.default.resolve(process.cwd(), 'data', 'csv'),
    ];
    for (const candidate of candidates) {
        if ((0, fs_1.existsSync)(path_1.default.join(candidate, 'race_programs.csv')) && (0, fs_1.existsSync)(path_1.default.join(candidate, 'race_program_races.csv'))) {
            return candidate;
        }
    }
    return candidates[0];
}
function resolveDebugDir() {
    const candidates = [
        path_1.default.resolve(__dirname, '..', '..', '..', 'debug'),
        path_1.default.resolve(__dirname, '..', '..', '..', '..', 'debug'),
        path_1.default.resolve(__dirname, '..', '..', '..', '..', '..', 'debug'),
        path_1.default.resolve(process.cwd(), 'debug'),
    ];
    for (const candidate of candidates) {
        if ((0, fs_1.existsSync)(path_1.default.join(candidate, 'program_distribution_deterministic.csv'))) {
            return candidate;
        }
    }
    return candidates[0];
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
    if (!normalized) {
        return { rows: [], delimiter: ';', headers: [] };
    }
    const lines = normalized
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    if (lines.length < 1) {
        return { rows: [], delimiter: ';', headers: [] };
    }
    const delimiter = detectCsvDelimiter(lines[0]);
    const headers = parseCsvLine(lines[0], delimiter).map((value) => value.trim());
    const rows = lines.slice(1).map((line, index) => {
        const values = parseCsvLine(line, delimiter);
        // If the line is short, pad it
        while (values.length < headers.length) {
            values.push('');
        }
        return headers.reduce((record, header, headerIndex) => {
            record[header] = values[headerIndex] ?? '';
            return record;
        }, {});
    });
    return { rows, delimiter, headers };
}
function escapeCsvValue(value, delimiter) {
    const text = String(value);
    if (!text.includes('"') && !text.includes('\n') && !text.includes('\r') && !text.includes(delimiter)) {
        return text;
    }
    return `"${text.replace(/"/g, '""')}"`;
}
class RaceProgramsEditorService {
    constructor() {
        this.dataCsvDir = resolveDataCsvDir();
        this.debugDir = resolveDebugDir();
    }
    load(activeDb) {
        const programs = this.loadPrograms();
        const races = this.loadRaces();
        const raceProgramRaces = this.loadRaceProgramRaces();
        const raceCategories = this.loadRaceCategories();
        const stages = this.loadStages();
        const programDistribution = this.loadProgramDistribution();
        let roleSpecCombinations = [];
        if (activeDb) {
            try {
                roleSpecCombinations = this.getRoleSpecCombinationsFromDb(activeDb);
            }
            catch (e) {
                console.error('Error fetching role/spec combinations from DB:', e);
            }
        }
        // Fallback: build combinations from programDistribution (only has spec1)
        if (roleSpecCombinations.length === 0 && programDistribution.length > 0) {
            const rolesList = ['Kapitaen', 'Co_Kapitaen', 'Sprinter', 'Edelhelfer', 'Starke_Helfer', 'Wassertraeger'];
            const specsList = ['Berg', 'Hill', 'Sprint', 'Timetrial', 'Cobble', 'Attacker'];
            for (const dist of programDistribution) {
                const programId = dist.program_id;
                for (const role of rolesList) {
                    for (const spec of specsList) {
                        const key = `deterministic_${role}_spec1_${spec}`;
                        const count = parseInt(dist[key] || '0', 10);
                        if (count > 0) {
                            roleSpecCombinations.push({
                                program_id: programId,
                                role,
                                spec1: spec,
                                spec2: null,
                                spec3: null,
                                count,
                            });
                        }
                    }
                }
            }
        }
        return {
            programs,
            races,
            raceProgramRaces,
            raceCategories,
            stages,
            programDistribution,
            roleSpecCombinations,
        };
    }
    getRoleSpecCombinationsFromDb(activeDb) {
        const rolesMap = {
            1: 'Kapitaen',
            2: 'Co_Kapitaen',
            3: 'Edelhelfer',
            4: 'Starke_Helfer',
            5: 'Wassertraeger',
            6: 'Sprinter'
        };
        const specsMap = {
            1: 'Berg',
            2: 'Hill',
            3: 'Sprint',
            4: 'Timetrial',
            5: 'Cobble',
            6: 'Attacker'
        };
        const rows = activeDb.prepare(`
      SELECT
        program_id,
        role_id,
        specialization_1_id,
        specialization_2_id,
        specialization_3_id,
        COUNT(*) as count
      FROM rider_season_programs
      JOIN riders ON riders.id = rider_season_programs.rider_id
      WHERE season = (SELECT current_season FROM game_state LIMIT 1)
      GROUP BY program_id, role_id, specialization_1_id, specialization_2_id, specialization_3_id
    `).all();
        return rows.map((row) => ({
            program_id: row.program_id,
            role: rolesMap[row.role_id] ?? 'Wassertraeger',
            spec1: specsMap[row.specialization_1_id] ?? 'Flat',
            spec2: specsMap[row.specialization_2_id] ?? null,
            spec3: specsMap[row.specialization_3_id] ?? null,
            count: row.count,
        }));
    }
    save(payload, activeDb) {
        // 1. Assign continuous IDs (1, 2, ...) to the race-program mapping
        const newRaceProgramRaces = payload.raceProgramRaces.map((item, index) => ({
            id: index + 1,
            program_id: item.program_id,
            race_id: item.race_id,
        }));
        // 2. Write CSV Files to disk
        this.writePrograms(payload.programs);
        this.writeRaceProgramRaces(newRaceProgramRaces);
        // 3. Update SQLite database of current session if active connection exists
        if (activeDb) {
            activeDb.transaction(() => {
                // Clear and refill race_program_races
                activeDb.prepare('DELETE FROM race_program_races').run();
                const insertMapping = activeDb.prepare('INSERT INTO race_program_races (id, program_id, race_id) VALUES (?, ?, ?)');
                for (const row of newRaceProgramRaces) {
                    insertMapping.run(row.id, row.program_id, row.race_id);
                }
                // Update race_programs
                const updateProgram = activeDb.prepare(`
          UPDATE race_programs SET
            peak1_min = ?, peak1_max = ?,
            peak2_min = ?, peak2_max = ?,
            peak3_min = ?, peak3_max = ?
          WHERE id = ?
        `);
                for (const prog of payload.programs) {
                    updateProgram.run(prog.peak1_min, prog.peak1_max, prog.peak2_min, prog.peak2_max, prog.peak3_min, prog.peak3_max, prog.id);
                }
            })();
        }
    }
    loadPrograms() {
        const csvPath = path_1.default.join(this.dataCsvDir, 'race_programs.csv');
        if (!(0, fs_1.existsSync)(csvPath))
            return [];
        const { rows } = parseCsv((0, fs_1.readFileSync)(csvPath, 'utf8'));
        return rows.map((row) => ({
            id: parseInt(row['id'] ?? '0', 10),
            name: (row['name'] ?? '').trim(),
            peak1_min: parseInt(row['peak1_min'] ?? '1', 10),
            peak1_max: parseInt(row['peak1_max'] ?? '1', 10),
            peak2_min: parseInt(row['peak2_min'] ?? '1', 10),
            peak2_max: parseInt(row['peak2_max'] ?? '1', 10),
            peak3_min: parseInt(row['peak3_min'] ?? '1', 10),
            peak3_max: parseInt(row['peak3_max'] ?? '1', 10),
        }));
    }
    loadRaces() {
        const csvPath = path_1.default.join(this.dataCsvDir, 'races.csv');
        if (!(0, fs_1.existsSync)(csvPath))
            return [];
        const { rows } = parseCsv((0, fs_1.readFileSync)(csvPath, 'utf8'));
        return rows.map((row) => ({
            id: parseInt(row['id'] ?? '0', 10),
            name: (row['name'] ?? '').trim(),
            country_id: parseInt(row['country_id'] ?? '0', 10),
            category_id: parseInt(row['category_id'] ?? '0', 10),
            is_stage_race: parseInt(row['is_stage_race'] ?? '0', 10),
            number_of_stages: parseInt(row['number_of_stages'] ?? '0', 10),
            start_date: (row['start_date'] ?? '').trim(),
            end_date: (row['end_date'] ?? '').trim(),
            prestige: parseInt(row['prestige'] ?? '0', 10),
        }));
    }
    loadRaceProgramRaces() {
        const csvPath = path_1.default.join(this.dataCsvDir, 'race_program_races.csv');
        if (!(0, fs_1.existsSync)(csvPath))
            return [];
        const { rows } = parseCsv((0, fs_1.readFileSync)(csvPath, 'utf8'));
        return rows.map((row) => ({
            id: parseInt(row['id'] ?? '0', 10),
            program_id: parseInt(row['program_id'] ?? '0', 10),
            race_id: parseInt(row['race_id'] ?? '0', 10),
        }));
    }
    loadRaceCategories() {
        const csvPath = path_1.default.join(this.dataCsvDir, 'race_categories.csv');
        if (!(0, fs_1.existsSync)(csvPath))
            return [];
        const { rows } = parseCsv((0, fs_1.readFileSync)(csvPath, 'utf8'));
        return rows.map((row) => ({
            id: parseInt(row['id'] ?? '0', 10),
            name: (row['name'] ?? '').trim(),
        }));
    }
    loadStages() {
        const csvPath = path_1.default.join(this.dataCsvDir, 'stages.csv');
        if (!(0, fs_1.existsSync)(csvPath))
            return [];
        const { rows } = parseCsv((0, fs_1.readFileSync)(csvPath, 'utf8'));
        return rows.map((row) => ({
            id: parseInt(row['id'] ?? '0', 10),
            race_id: parseInt(row['race_id'] ?? '0', 10),
            stage_number: parseInt(row['stage_number'] ?? '0', 10),
            date: (row['date'] ?? '').trim(),
            profile: (row['profile'] ?? '').trim(),
        }));
    }
    loadProgramDistribution() {
        const csvPath = path_1.default.join(this.debugDir, 'program_distribution_deterministic.csv');
        if (!(0, fs_1.existsSync)(csvPath))
            return [];
        const content = (0, fs_1.readFileSync)(csvPath, 'utf8');
        const normalized = content.replace(/^\uFEFF/, '').trim();
        if (!normalized)
            return [];
        const lines = normalized.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length < 2)
            return [];
        const delimiter = ';';
        const headers = lines[0].split(delimiter).map(h => h.trim());
        return lines.slice(1).map((line) => {
            const cells = line.split(delimiter).map(c => c.trim());
            const record = {};
            headers.forEach((header, index) => {
                record[header] = cells[index] ?? '';
            });
            // Handle the duplicate program_id issue (use first column always for index 0)
            record['program_id'] = parseInt(cells[0] || '0', 10);
            return record;
        });
    }
    writePrograms(programs) {
        const csvPath = path_1.default.join(this.dataCsvDir, 'race_programs.csv');
        let content = 'id,name,peak1_min,peak1_max,peak2_min,peak2_max,peak3_min,peak3_max\n';
        for (const prog of programs) {
            content += `${prog.id},${prog.name},${prog.peak1_min},${prog.peak1_max},${prog.peak2_min},${prog.peak2_max},${prog.peak3_min},${prog.peak3_max}\n`;
        }
        (0, fs_1.writeFileSync)(csvPath, content, 'utf8');
    }
    writeRaceProgramRaces(mappings) {
        const csvPath = path_1.default.join(this.dataCsvDir, 'race_program_races.csv');
        let content = 'id,program_id,race_id\n';
        for (const item of mappings) {
            content += `${item.id},${item.program_id},${item.race_id}\n`;
        }
        (0, fs_1.writeFileSync)(csvPath, content, 'utf8');
    }
}
exports.RaceProgramsEditorService = RaceProgramsEditorService;
