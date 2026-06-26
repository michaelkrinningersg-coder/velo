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
        const rawPrograms = this.loadPrograms();
        const races = this.loadRaces();
        const raceProgramRaces = this.loadRaceProgramRaces();
        const programs = enrichProgramsWithPeaks(rawPrograms, races, raceProgramRaces);
        const raceCategories = this.loadRaceCategories();
        const stages = this.loadStages();
        let programDistribution = this.loadProgramDistribution();
        let roleSpecCombinations = [];
        if (activeDb) {
            try {
                roleSpecCombinations = this.getRoleSpecCombinationsFromDb(activeDb);
            }
            catch (e) {
                console.error('Error fetching role/spec combinations from DB:', e);
            }
        }
        if (activeDb && roleSpecCombinations.length > 0) {
            const rolesList = ['Kapitaen', 'Co_Kapitaen', 'Sprinter', 'Edelhelfer', 'Starke_Helfer', 'Wassertraeger'];
            const specsList = ['Berg', 'Hill', 'Sprint', 'Timetrial', 'Cobble', 'Attacker'];
            const distMap = new Map();
            for (const prog of rawPrograms) {
                const record = {
                    program_id: prog.id,
                    program_name: prog.name,
                    deterministic_rider_count: 0,
                    deterministic_role_Kapitaen: 0,
                    deterministic_role_Co_Kapitaen: 0,
                    deterministic_role_Edelhelfer: 0,
                    deterministic_role_Starke_Helfer: 0,
                    deterministic_role_Wassertraeger: 0,
                    deterministic_role_Sprinter: 0,
                };
                for (const role of rolesList) {
                    for (const spec of specsList) {
                        record[`deterministic_${role}_spec1_${spec}`] = 0;
                    }
                }
                distMap.set(prog.id, record);
            }
            for (const combo of roleSpecCombinations) {
                const record = distMap.get(combo.program_id);
                if (record) {
                    record.deterministic_rider_count += combo.count;
                    const roleKey = `deterministic_role_${combo.role}`;
                    if (record[roleKey] !== undefined) {
                        record[roleKey] += combo.count;
                    }
                    const specKey = `deterministic_${combo.role}_spec1_${combo.spec1}`;
                    if (record[specKey] !== undefined) {
                        record[specKey] += combo.count;
                    }
                }
            }
            programDistribution = Array.from(distMap.values());
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
      WHERE rider_season_programs.season = (SELECT season FROM game_state LIMIT 1)
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
            allowed_program_group_ids: item.allowed_program_group_ids || null,
        }));
        // 2. Write CSV Files to disk
        this.writePrograms(payload.programs);
        this.writeRaceProgramRaces(newRaceProgramRaces);
        // 3. Update SQLite database of current session if active connection exists
        if (activeDb) {
            activeDb.transaction(() => {
                // Clear and refill race_program_races
                activeDb.prepare('DELETE FROM race_program_races').run();
                // Fetch existing races and programs in the database to prevent foreign key errors
                const existingRaces = new Set(activeDb.prepare('SELECT id FROM races').all().map((r) => r.id));
                const existingPrograms = new Set(activeDb.prepare('SELECT id FROM race_programs').all().map((p) => p.id));
                const insertMapping = activeDb.prepare('INSERT INTO race_program_races (id, program_id, race_id, allowed_program_group_ids) VALUES (?, ?, ?, ?)');
                for (const row of newRaceProgramRaces) {
                    if (existingRaces.has(row.race_id) && existingPrograms.has(row.program_id)) {
                        insertMapping.run(row.id, row.program_id, row.race_id, row.allowed_program_group_ids);
                    }
                }
                // Update race_programs
                const updateProgram = activeDb.prepare(`
          UPDATE race_programs SET name = ? WHERE id = ?
        `);
                for (const prog of payload.programs) {
                    updateProgram.run(prog.name, prog.id);
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
            allowed_program_group_ids: row['allowed_program_group_ids'] ? row['allowed_program_group_ids'].trim() : null,
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
        let content = 'id,name\n';
        for (const prog of programs) {
            content += `${prog.id},${prog.name}\n`;
        }
        (0, fs_1.writeFileSync)(csvPath, content, 'utf8');
    }
    writeRaceProgramRaces(mappings) {
        const csvPath = path_1.default.join(this.dataCsvDir, 'race_program_races.csv');
        let content = 'id,program_id,race_id,allowed_program_group_ids\n';
        for (const item of mappings) {
            const allowedStr = item.allowed_program_group_ids ? item.allowed_program_group_ids : '';
            content += `${item.id},${item.program_id},${item.race_id},${allowedStr}\n`;
        }
        (0, fs_1.writeFileSync)(csvPath, content, 'utf8');
    }
}
exports.RaceProgramsEditorService = RaceProgramsEditorService;
function getIsoWeek(dateStr) {
    const date = new Date(dateStr + 'T00:00:00.000Z');
    const day = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return Math.min(53, Math.max(1, weekNo));
}
function findHighlightTripletForEditor(races, minSpacingDays) {
    const n = races.length;
    if (n < 3)
        return null;
    const firstIndex = 0;
    let bestPair = null;
    let maxPrestigeSum = -1;
    for (let j = 1; j < n; j++) {
        if (Math.abs(races[firstIndex].startDay - races[j].startDay) < minSpacingDays) {
            continue;
        }
        for (let k = j + 1; k < n; k++) {
            if (Math.abs(races[firstIndex].startDay - races[k].startDay) < minSpacingDays) {
                continue;
            }
            if (Math.abs(races[j].startDay - races[k].startDay) < minSpacingDays) {
                continue;
            }
            const prestigeSum = races[firstIndex].prestige + races[j].prestige + races[k].prestige;
            if (prestigeSum > maxPrestigeSum) {
                maxPrestigeSum = prestigeSum;
                bestPair = [j, k];
            }
        }
    }
    if (bestPair !== null) {
        return [firstIndex, bestPair[0], bestPair[1]];
    }
    return null;
}
function enrichProgramsWithPeaks(programs, races, raceProgramRaces) {
    const racesMap = new Map();
    for (const r of races) {
        racesMap.set(r.id, r);
    }
    const programRacesMap = new Map();
    for (const mapping of raceProgramRaces) {
        const race = racesMap.get(mapping.race_id);
        if (race) {
            if (!programRacesMap.has(mapping.program_id)) {
                programRacesMap.set(mapping.program_id, []);
            }
            programRacesMap.get(mapping.program_id).push(race);
        }
    }
    return programs.map((prog) => {
        const progRaces = programRacesMap.get(prog.id) ?? [];
        const parsedRaces = progRaces
            .map(r => {
            let startDay = Math.floor(new Date(`${r.start_date}T00:00:00.000Z`).getTime() / 86400000);
            if (r.is_stage_race === 1 && r.end_date) {
                const endDay = Math.floor(new Date(`${r.end_date}T00:00:00.000Z`).getTime() / 86400000);
                if (!isNaN(endDay)) {
                    startDay = Math.floor((startDay + endDay) / 2);
                }
            }
            return {
                id: r.id,
                name: r.name,
                prestige: r.prestige,
                startDay,
                startDate: r.start_date,
                endDate: r.end_date,
                isStageRace: r.is_stage_race === 1
            };
        })
            .filter(r => !isNaN(r.startDay));
        parsedRaces.sort((a, b) => b.prestige - a.prestige || a.startDay - b.startDay || a.id - b.id);
        let chosenIndices = null;
        const thresholds = [70, 56, 42, 28]; // 10, 8, 6, 4 weeks
        for (const spacing of thresholds) {
            chosenIndices = findHighlightTripletForEditor(parsedRaces, spacing);
            if (chosenIndices !== null) {
                break;
            }
        }
        let peaks = [1, 1, 1];
        const getPeakWeekForRace = (r) => {
            let dateStr = r.startDate;
            if (r.isStageRace && r.endDate) {
                const startMs = new Date(`${r.startDate}T00:00:00.000Z`).getTime();
                const endMs = new Date(`${r.endDate}T00:00:00.000Z`).getTime();
                const middleMs = (startMs + endMs) / 2;
                dateStr = new Date(middleMs).toISOString().slice(0, 10);
            }
            return getIsoWeek(dateStr);
        };
        if (chosenIndices !== null) {
            const chosenRaces = chosenIndices.map(idx => parsedRaces[idx]);
            const weeks = chosenRaces.map(getPeakWeekForRace);
            weeks.sort((a, b) => a - b);
            peaks = weeks;
        }
        else if (parsedRaces.length > 0) {
            const weeks = parsedRaces.slice(0, 3).map(getPeakWeekForRace);
            weeks.sort((a, b) => a - b);
            while (weeks.length < 3) {
                weeks.push(weeks[weeks.length - 1] ?? 1);
            }
            peaks = weeks;
        }
        return {
            ...prog,
            peak1_min: Math.max(1, peaks[0] - 2),
            peak1_max: Math.min(53, peaks[0] + 2),
            peak2_min: Math.max(1, peaks[1] - 2),
            peak2_max: Math.min(53, peaks[1] + 2),
            peak3_min: Math.max(1, peaks[2] - 2),
            peak3_max: Math.min(53, peaks[2] + 2),
        };
    });
}
