"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderTeamEditorService = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const RIDERS_HEADER = [
    'rider_id',
    'first_name',
    'last_name',
    'country_id',
    'birth_year',
    'team_id',
    'skill_flat',
    'skill_mountain',
    'skill_medium_mountain',
    'skill_hill',
    'skill_time_trial',
    'skill_prologue',
    'skill_cobble',
    'skill_sprint',
    'skill_acceleration',
    'skill_downhill',
    'skill_attack',
    'skill_stamina',
    'skill_resistance',
    'skill_recuperation',
    'favorite_races',
    'non_favorite_races',
];
function resolveDataCsvDir() {
    const candidates = [
        path_1.default.resolve(__dirname, '..', '..', '..', 'data', 'csv'),
        path_1.default.resolve(__dirname, '..', '..', '..', '..', 'data', 'csv'),
        path_1.default.resolve(__dirname, '..', '..', '..', '..', '..', 'data', 'csv'),
        path_1.default.resolve(process.cwd(), 'data', 'csv'),
    ];
    for (const candidate of candidates) {
        if ((0, fs_1.existsSync)(path_1.default.join(candidate, 'riders.csv')) && (0, fs_1.existsSync)(path_1.default.join(candidate, 'teams.csv'))) {
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
    if (lines.length < 2) {
        throw new Error('CSV muss Header und mindestens eine Datenzeile enthalten.');
    }
    const delimiter = detectCsvDelimiter(lines[0]);
    const headers = parseCsvLine(lines[0], delimiter).map((value) => value.trim());
    const rows = lines.slice(1).map((line, index) => {
        const values = parseCsvLine(line, delimiter);
        if (values.length !== headers.length) {
            throw new Error(`CSV-Zeile ${index + 2} hat ${values.length} Spalten, erwartet ${headers.length}.`);
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
function parseRequiredInteger(value, field) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isInteger(parsed)) {
        throw new Error(`Ungültiger Ganzzahlwert für ${field}: ${value}`);
    }
    return parsed;
}
function parseOptionalInteger(value) {
    const trimmed = value?.trim() ?? '';
    if (!trimmed) {
        return null;
    }
    const parsed = Number.parseInt(trimmed, 10);
    return Number.isInteger(parsed) ? parsed : null;
}
function clamp(value, min = 0, max = 85) {
    return Math.max(min, Math.min(max, Math.round(value * 100) / 100));
}
function calculateOverall(row) {
    const sum = row.skillFlat +
        row.skillMountain +
        row.skillMediumMountain +
        row.skillHill +
        row.skillTimeTrial +
        row.skillCobble +
        row.skillSprint * 1.2 +
        row.skillStamina +
        row.skillResistance +
        row.skillRecuperation +
        row.skillAcceleration;
    return clamp(sum / 11.2);
}
function compareStrings(left, right) {
    return left.localeCompare(right, 'de', { sensitivity: 'base' });
}
class RiderTeamEditorService {
    constructor() {
        this.dataCsvDir = resolveDataCsvDir();
    }
    load() {
        const riders = this.loadRiders();
        const teams = this.buildTeamSummaries(riders, this.loadTeams());
        return { riders, teams };
    }
    save(payload) {
        const teams = this.loadTeams();
        const teamIds = new Set(teams.map((team) => team.teamId));
        const seenRiderIds = new Set();
        const countryMap = this.loadCountryMap();
        const normalizedRiders = payload.riders.map((rider, index) => {
            this.validateRider(rider, index, teamIds, seenRiderIds);
            const normalized = {
                ...rider,
                firstName: rider.firstName.trim(),
                lastName: rider.lastName.trim(),
                favoriteRaces: rider.favoriteRaces.trim(),
                nonFavoriteRaces: rider.nonFavoriteRaces.trim(),
                overallRating: calculateOverall(rider),
            };
            normalized.countryCode = countryMap.get(normalized.countryId) ?? 'UNK';
            return normalized;
        });
        this.writeRiders(normalizedRiders);
        return {
            riders: normalizedRiders,
            teams: this.buildTeamSummaries(normalizedRiders, teams),
        };
    }
    export(payload) {
        const teams = this.loadTeams();
        const teamIds = new Set(teams.map((team) => team.teamId));
        const seenRiderIds = new Set();
        const countryMap = this.loadCountryMap();
        const normalizedRiders = payload.riders.map((rider, index) => {
            this.validateRider(rider, index, teamIds, seenRiderIds);
            const normalized = {
                ...rider,
                firstName: rider.firstName.trim(),
                lastName: rider.lastName.trim(),
                favoriteRaces: rider.favoriteRaces.trim(),
                nonFavoriteRaces: rider.nonFavoriteRaces.trim(),
                overallRating: calculateOverall(rider),
            };
            normalized.countryCode = countryMap.get(normalized.countryId) ?? 'UNK';
            return normalized;
        });
        return {
            fileName: 'riders.csv',
            content: this.serializeRiders(normalizedRiders),
        };
    }
    loadCountryMap() {
        const countryPath = path_1.default.join(this.dataCsvDir, 'country.csv');
        const countryMap = new Map();
        if ((0, fs_1.existsSync)(countryPath)) {
            const { rows } = parseCsv((0, fs_1.readFileSync)(countryPath, 'utf8'));
            for (const row of rows) {
                const id = parseInt(row['id'] ?? '', 10);
                const code3 = (row['code_3'] ?? '').trim();
                if (Number.isFinite(id) && code3) {
                    countryMap.set(id, code3);
                }
            }
        }
        return countryMap;
    }
    loadRiders() {
        const ridersPath = path_1.default.join(this.dataCsvDir, 'riders.csv');
        const { rows } = parseCsv((0, fs_1.readFileSync)(ridersPath, 'utf8'));
        const countryMap = this.loadCountryMap();
        return rows.map((row, index) => {
            const mapped = this.mapRiderRow(row, index);
            mapped.countryCode = countryMap.get(mapped.countryId) ?? 'UNK';
            return mapped;
        });
    }
    loadTeams() {
        const teamsPath = path_1.default.join(this.dataCsvDir, 'teams.csv');
        const { rows } = parseCsv((0, fs_1.readFileSync)(teamsPath, 'utf8'));
        return rows.map((row, index) => ({
            teamId: parseRequiredInteger(row['team_id'] ?? '', `teams.csv Zeile ${index + 2} / team_id`),
            name: (row['name'] ?? '').trim(),
            abbreviation: (row['abbreviation'] ?? '').trim(),
            divisionName: (row['division_name'] ?? '').trim(),
        }));
    }
    mapRiderRow(row, index) {
        const line = index + 2;
        const mapped = {
            riderId: parseRequiredInteger(row['rider_id'] ?? '', `riders.csv Zeile ${line} / rider_id`),
            firstName: (row['first_name'] ?? '').trim(),
            lastName: (row['last_name'] ?? '').trim(),
            countryId: parseRequiredInteger(row['country_id'] ?? '', `riders.csv Zeile ${line} / country_id`),
            birthYear: parseRequiredInteger(row['birth_year'] ?? '', `riders.csv Zeile ${line} / birth_year`),
            teamId: parseOptionalInteger(row['team_id']),
            skillFlat: parseRequiredInteger(row['skill_flat'] ?? '', `riders.csv Zeile ${line} / skill_flat`),
            skillMountain: parseRequiredInteger(row['skill_mountain'] ?? '', `riders.csv Zeile ${line} / skill_mountain`),
            skillMediumMountain: parseRequiredInteger(row['skill_medium_mountain'] ?? '', `riders.csv Zeile ${line} / skill_medium_mountain`),
            skillHill: parseRequiredInteger(row['skill_hill'] ?? '', `riders.csv Zeile ${line} / skill_hill`),
            skillTimeTrial: parseRequiredInteger(row['skill_time_trial'] ?? '', `riders.csv Zeile ${line} / skill_time_trial`),
            skillPrologue: parseRequiredInteger(row['skill_prologue'] ?? '', `riders.csv Zeile ${line} / skill_prologue`),
            skillCobble: parseRequiredInteger(row['skill_cobble'] ?? '', `riders.csv Zeile ${line} / skill_cobble`),
            skillSprint: parseRequiredInteger(row['skill_sprint'] ?? '', `riders.csv Zeile ${line} / skill_sprint`),
            skillAcceleration: parseRequiredInteger(row['skill_acceleration'] ?? '', `riders.csv Zeile ${line} / skill_acceleration`),
            skillDownhill: parseRequiredInteger(row['skill_downhill'] ?? '', `riders.csv Zeile ${line} / skill_downhill`),
            skillAttack: parseRequiredInteger(row['skill_attack'] ?? '', `riders.csv Zeile ${line} / skill_attack`),
            skillStamina: parseRequiredInteger(row['skill_stamina'] ?? '', `riders.csv Zeile ${line} / skill_stamina`),
            skillResistance: parseRequiredInteger(row['skill_resistance'] ?? '', `riders.csv Zeile ${line} / skill_resistance`),
            skillRecuperation: parseRequiredInteger(row['skill_recuperation'] ?? '', `riders.csv Zeile ${line} / skill_recuperation`),
            favoriteRaces: (row['favorite_races'] ?? '').trim(),
            nonFavoriteRaces: (row['non_favorite_races'] ?? '').trim(),
            overallRating: 0,
        };
        mapped.overallRating = calculateOverall(mapped);
        return mapped;
    }
    buildTeamSummaries(riders, teams) {
        const summaries = teams.map((team) => this.buildSingleTeamSummary(team.teamId, team.name, team.abbreviation, team.divisionName, false, riders));
        summaries.push(this.buildSingleTeamSummary(null, 'Free Agents', 'FA', 'Free Agents', true, riders));
        const ranked = [...summaries].sort((left, right) => {
            const leftAverage = left.averageOverall ?? -1;
            const rightAverage = right.averageOverall ?? -1;
            return rightAverage - leftAverage
                || right.riderCount - left.riderCount
                || compareStrings(left.name, right.name);
        });
        const rankByKey = new Map(ranked.map((entry, index) => [entry.teamId == null ? 'free-agents' : String(entry.teamId), index + 1]));
        return summaries.map((summary) => ({
            ...summary,
            rank: rankByKey.get(summary.teamId == null ? 'free-agents' : String(summary.teamId)) ?? summaries.length,
        }));
    }
    buildSingleTeamSummary(teamId, name, abbreviation, divisionName, isFreeAgents, riders) {
        const teamRiders = riders.filter((rider) => rider.teamId === teamId);
        const averageOverall = teamRiders.length === 0
            ? null
            : Math.round((teamRiders.reduce((sum, rider) => sum + rider.overallRating, 0) / teamRiders.length) * 100) / 100;
        return {
            teamId,
            name,
            abbreviation,
            divisionName,
            riderCount: teamRiders.length,
            averageOverall,
            rank: 0,
            isFreeAgents,
        };
    }
    validateRider(rider, index, teamIds, seenRiderIds) {
        const line = index + 1;
        if (!Number.isInteger(rider.riderId) || rider.riderId <= 0) {
            throw new Error(`Fahrer ${line}: riderId muss eine positive Ganzzahl sein.`);
        }
        if (seenRiderIds.has(rider.riderId)) {
            throw new Error(`Fahrer ${line}: riderId ${rider.riderId} ist doppelt vergeben.`);
        }
        seenRiderIds.add(rider.riderId);
        if (!rider.firstName.trim() || !rider.lastName.trim()) {
            throw new Error(`Fahrer ${line}: Vorname und Nachname dürfen nicht leer sein.`);
        }
        if (!Number.isInteger(rider.countryId) || rider.countryId <= 0) {
            throw new Error(`Fahrer ${line}: countryId muss eine positive Ganzzahl sein.`);
        }
        if (!Number.isInteger(rider.birthYear) || rider.birthYear < 1900 || rider.birthYear > 2100) {
            throw new Error(`Fahrer ${line}: birthYear ist ungültig.`);
        }
        if (rider.teamId != null && (!Number.isInteger(rider.teamId) || !teamIds.has(rider.teamId))) {
            throw new Error(`Fahrer ${line}: teamId ${rider.teamId} existiert nicht in teams.csv.`);
        }
        const skillValues = [
            rider.skillFlat,
            rider.skillMountain,
            rider.skillMediumMountain,
            rider.skillHill,
            rider.skillTimeTrial,
            rider.skillPrologue,
            rider.skillCobble,
            rider.skillSprint,
            rider.skillAcceleration,
            rider.skillDownhill,
            rider.skillAttack,
            rider.skillStamina,
            rider.skillResistance,
            rider.skillRecuperation,
        ];
        if (skillValues.some((value) => !Number.isInteger(value) || value < 0 || value > 100)) {
            throw new Error(`Fahrer ${line}: alle Skillwerte müssen Ganzzahlen zwischen 0 und 100 sein.`);
        }
    }
    writeRiders(riders) {
        const ridersPath = path_1.default.join(this.dataCsvDir, 'riders.csv');
        (0, fs_1.writeFileSync)(ridersPath, this.serializeRiders(riders), 'utf8');
    }
    serializeRiders(riders) {
        const ridersPath = path_1.default.join(this.dataCsvDir, 'riders.csv');
        const rawContent = (0, fs_1.readFileSync)(ridersPath, 'utf8');
        const format = this.detectRiderCsvFormat(rawContent);
        const header = RIDERS_HEADER.join(format.delimiter);
        const body = riders.map((rider) => this.serializeRiderRow(rider, format.delimiter)).join(format.lineEnding);
        const csv = `${header}${format.lineEnding}${body}${format.lineEnding}`;
        return format.hasBom ? `\uFEFF${csv}` : csv;
    }
    serializeRiderRow(rider, delimiter) {
        return [
            rider.riderId,
            rider.firstName,
            rider.lastName,
            rider.countryId,
            rider.birthYear,
            rider.teamId ?? '',
            rider.skillFlat,
            rider.skillMountain,
            rider.skillMediumMountain,
            rider.skillHill,
            rider.skillTimeTrial,
            rider.skillPrologue,
            rider.skillCobble,
            rider.skillSprint,
            rider.skillAcceleration,
            rider.skillDownhill,
            rider.skillAttack,
            rider.skillStamina,
            rider.skillResistance,
            rider.skillRecuperation,
            rider.favoriteRaces,
            rider.nonFavoriteRaces,
        ].map((value) => escapeCsvValue(value, delimiter)).join(delimiter);
    }
    detectRiderCsvFormat(rawContent) {
        const contentWithoutBom = rawContent.replace(/^\uFEFF/, '');
        const firstLine = contentWithoutBom.split(/\r?\n/, 1)[0] ?? '';
        return {
            delimiter: detectCsvDelimiter(firstLine),
            lineEnding: rawContent.includes('\r\n') ? '\r\n' : '\n',
            hasBom: rawContent.startsWith('\uFEFF'),
        };
    }
}
exports.RiderTeamEditorService = RiderTeamEditorService;
