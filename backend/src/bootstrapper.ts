/**
 * bootstrapper.ts
 *
 * Liest CSV-Dateien und erstellt die Master-DB (world_data.db).
 * Wird beim Serverstart oder vor dem Anlegen einer neuen Karriere ausgefuehrt.
 */

import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { ContractService } from './game/ContractService';
import { RiderDevelopmentService } from './game/RiderDevelopmentService';

type CsvRow = Record<string, string>;

interface TeamSeed {
  id: number;
  name: string;
  abbreviation: string;
  divisionName: string;
  isPlayerTeam: number;
  countryId: number;
  colorPrimary: string;
  colorSecondary: string;
  aiFocus1: number;
  aiFocus2: number;
  aiFocus3: number;
}

interface TeamAllocationRow {
  id: number;
  division_name: string;
  tier: number;
}

interface RiderAllocationRow {
  id: number;
  overall_rating: number;
}

function resolveBackendRoot(): string {
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
] as const;
const RULE_SPREAD_COLUMNS = [
  'final_spread_late_multiplier',
  'final_spread_peak_multiplier',
] as const;
const SKILL_WEIGHT_SIMULATION_MODES = new Set(['road', 'itt', 'ttt']);
const SKILL_WEIGHT_TERRAINS = new Set(['Flat', 'Hill', 'Medium_Mountain', 'Mountain', 'High_Mountain', 'Cobble', 'Cobble_Hill', 'Abfahrt', 'Sprint']);

function clamp(value: number, min = 0, max = 85): number {
  return Math.max(min, Math.min(max, Math.round(value * 100) / 100));
}

function detectCsvDelimiter(line: string): ',' | ';' {
  let commaCount = 0;
  let semicolonCount = 0;
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes) {
      if (char === ',') commaCount += 1;
      if (char === ';') semicolonCount += 1;
    }
  }

  return semicolonCount > commaCount ? ';' : ',';
}

function parseCsvLine(line: string, delimiter: ',' | ';'): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
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

function parseCsv(content: string): CsvRow[] {
  const normalized = content.replace(/^\uFEFF/, '').trim();
  if (!normalized) return [];

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

    return headers.reduce<CsvRow>((record, header, headerIndex) => {
      record[header] = values[headerIndex] ?? '';
      return record;
    }, {});
  });
}

function readCsv(fileName: string): CsvRow[] {
  const filePath = path.join(CSV_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV nicht gefunden: ${filePath}`);
  }
  return parseCsv(fs.readFileSync(filePath, 'utf8'));
}

function req(row: CsvRow, key: string, ctx: string): string {
  const value = row[key]?.trim();
  if (!value) {
    throw new Error(`${ctx}: Pflichtfeld "${key}" fehlt.`);
  }
  return value;
}

function int(value: string, ctx: string): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed)) {
    throw new Error(`${ctx}: Ganzzahl erwartet, erhalten "${value}".`);
  }
  return parsed;
}

function real(value: string, ctx: string): number {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${ctx}: Zahl erwartet, erhalten "${value}".`);
  }
  return parsed;
}

function boolFlag(value: string, ctx: string): number {
  if (value === '0' || value === '1') {
    return Number(value);
  }
  throw new Error(`${ctx}: Feld muss 0 oder 1 sein, erhalten "${value}".`);
}

function optionalInt(value: string | undefined): number | null {
  const normalized = value?.trim();
  if (!normalized) {
    return null;
  }

  const parsed = Number.parseInt(normalized, 10);
  return Number.isInteger(parsed) ? parsed : null;
}

function createDeterministicRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function shuffleDeterministically<T>(items: T[], seed: number): T[] {
  const shuffled = [...items];
  const random = createDeterministicRandom(seed);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function seedStaCountry(db: Database.Database): void {
  const rows = readCsv('sta_country.csv');
  const insert = db.prepare(`
    INSERT INTO sta_country (id, name, code_3, continent, regen_rating, number_regen_min, number_regen_max)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const [index, row] of rows.entries()) {
    const ctx = `sta_country.csv Zeile ${index + 2}`;
    insert.run(
      int(req(row, 'id', ctx), ctx),
      req(row, 'name', ctx),
      req(row, 'code_3', ctx),
      req(row, 'continent', ctx),
      int(req(row, 'regen_rating', ctx), ctx),
      int(req(row, 'number_regen_min', ctx), ctx),
      int(req(row, 'number_regen_max', ctx), ctx),
    );
  }

  console.log(`  ${rows.length} Laender eingefuegt.`);
}

function seedTypeRider(db: Database.Database): void {
  const rows = readCsv('type_rider.csv');
  const insert = db.prepare(`
    INSERT INTO type_rider (id, type_key, display_name, is_stage_focus, is_one_day_focus)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const [index, row] of rows.entries()) {
    const ctx = `type_rider.csv Zeile ${index + 2}`;
    insert.run(
      int(req(row, 'id', ctx), ctx),
      req(row, 'key', ctx),
      req(row, 'display_name', ctx),
      boolFlag(req(row, 'is_stage_focus', ctx), ctx),
      boolFlag(req(row, 'is_one_day_focus', ctx), ctx),
    );
  }

  console.log(`  ${rows.length} Fahrertypen eingefuegt.`);
}

function seedStaRole(db: Database.Database): void {
  const rows = readCsv('sta_role.csv');
  const insert = db.prepare('INSERT INTO sta_role (id, name, weighting) VALUES (?, ?, ?)');

  for (const [index, row] of rows.entries()) {
    const ctx = `sta_role.csv Zeile ${index + 2}`;
    insert.run(
      int(req(row, 'id', ctx), ctx),
      req(row, 'name', ctx),
      int(req(row, 'weighting', ctx), ctx),
    );
  }

  console.log(`  ${rows.length} Rollen eingefuegt.`);
}

function seedResultTypes(db: Database.Database): void {
  const rows = readCsv('result_types.csv');
  const insert = db.prepare('INSERT INTO result_types (id, name) VALUES (?, ?)');

  for (const [index, row] of rows.entries()) {
    const ctx = `result_types.csv Zeile ${index + 2}`;
    insert.run(
      int(req(row, 'id', ctx), ctx),
      req(row, 'name', ctx),
    );
  }

  console.log(`  ${rows.length} Ergebnisarten eingefuegt.`);
}

function seedDivisionTeams(db: Database.Database): Map<string, number> {
  const rows = readCsv('division_teams.csv');
  const insert = db.prepare(`
    INSERT INTO division_teams (name, tier, max_teams, min_roster_size, max_roster_size)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const [index, row] of rows.entries()) {
    const ctx = `division_teams.csv Zeile ${index + 2}`;
    insert.run(
      req(row, 'name', ctx),
      int(req(row, 'tier', ctx), ctx),
      int(req(row, 'max_teams', ctx), ctx),
      int(req(row, 'min_roster_size', ctx), ctx),
      int(req(row, 'max_roster_size', ctx), ctx),
    );
  }

  const divisionIdByName = new Map<string, number>();
  const divisionRows = db.prepare('SELECT id, name FROM division_teams').all() as Array<{ id: number; name: string }>;
  for (const row of divisionRows) {
    divisionIdByName.set(row.name, row.id);
  }

  console.log(`  ${rows.length} Divisionen eingefuegt.`);
  return divisionIdByName;
}

function readTeamSeeds(): TeamSeed[] {
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

function seedTeams(db: Database.Database, divisionIdByName: Map<string, number>): void {
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
    insert.run(
      team.id,
      team.name,
      team.abbreviation,
      divisionId,
      team.isPlayerTeam,
      team.countryId,
      team.colorPrimary,
      team.colorSecondary,
      team.aiFocus1,
      team.aiFocus2,
      team.aiFocus3,
    );
  }

  console.log(`  ${mainTeams.length} Teams eingefuegt.`);
}

function seedRaceCategoriesBonus(db: Database.Database): void {
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
    insert.run(
      int(req(row, 'id', ctx), ctx),
      req(row, 'name', ctx),
      req(row, 'bonus_seconds_final', ctx),
      req(row, 'bonus_seconds_intermediate', ctx),
      req(row, 'points_stage', ctx),
      req(row, 'points_mountainstage', ctx),
      req(row, 'points_sprint_finish', ctx),
      req(row, 'points_one_day', ctx),
      req(row, 'points_gc_final', ctx),
      int(req(row, 'points_jersey_leader_day', ctx), ctx),
      int(req(row, 'points_jersey_sprint_day', ctx), ctx),
      int(req(row, 'points_jersey_mountain_day', ctx), ctx),
      int(req(row, 'points_jersey_youth_day', ctx), ctx),
      req(row, 'points_sprint_intermediate', ctx),
      req(row, 'points_mountain_hc', ctx),
      req(row, 'points_mountain_cat1', ctx),
      req(row, 'points_mountain_cat2', ctx),
      req(row, 'points_mountain_cat3', ctx),
      req(row, 'points_mountain_cat4', ctx),
      req(row, 'points_jersey_sprint_final', ctx),
      req(row, 'points_jersey_mountain_final', ctx),
      req(row, 'points_jersey_youth_final', ctx),
    );
  }

  console.log(`  ${rows.length} Kategorie-Bonussysteme eingefuegt.`);
}

function seedRules(db: Database.Database): void {
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
  const seenContextKeys = new Set<string>();

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

    insert.run(
      int(req(row, 'id', ctx), ctx),
      req(row, 'rule_key', ctx),
      appliesTo,
      markerType,
      markerCategory,
      ...weightValues,
    );
  }

  console.log(`  ${rows.length} Regelprofile eingefuegt.`);
}

function seedSkillWeights(db: Database.Database): void {
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

    insert.run(
      int(req(row, 'id', ctx), ctx),
      simulationMode,
      terrain,
      ...weightValues,
      ...spreadValues,
      tttSpeedMultiplier,
    );
  }

  console.log(`  ${rows.length} Skill-Gewichte eingefuegt.`);
}

function seedRaceCategories(db: Database.Database): void {
  const rows = readCsv('race_categories.csv');
  const insert = db.prepare(`
    INSERT INTO race_categories (id, name, tier, number_of_teams, number_of_riders, bonus_system_id, role_1, role_2, role_3, role_4, role_5, role_6)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const [index, row] of rows.entries()) {
    const ctx = `race_categories.csv Zeile ${index + 2}`;
    const roleRequirements = [1, 2, 3, 4, 5, 6].map((roleId) => int(req(row, `role_${roleId}`, ctx), ctx));
    const roleRequirementSum = roleRequirements.reduce((sum, value) => sum + value, 0);
    const riderCount = int(req(row, 'number_of_riders', ctx), ctx);
    if (roleRequirementSum > riderCount) {
      throw new Error(`${ctx}: Summe der role_* Werte (${roleRequirementSum}) darf number_of_riders (${riderCount}) nicht ueberschreiten.`);
    }

    insert.run(
      int(req(row, 'id', ctx), ctx),
      req(row, 'name', ctx),
      int(req(row, 'tier', ctx), ctx),
      int(req(row, 'number_of_teams', ctx), ctx),
      riderCount,
      int(req(row, 'bonus_system_id', ctx), ctx),
      ...roleRequirements,
    );
  }

  console.log(`  ${rows.length} Rennkategorien eingefuegt.`);
}

function seedRaces(db: Database.Database): void {
  const rows = readCsv('races.csv');
  const insert = db.prepare(`
    INSERT INTO races (
      id, name, country_id, category_id, is_stage_race, number_of_stages, start_date, end_date, prestige
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const [index, row] of rows.entries()) {
    const ctx = `races.csv Zeile ${index + 2}`;
    insert.run(
      int(req(row, 'id', ctx), ctx),
      req(row, 'name', ctx),
      int(req(row, 'country_id', ctx), ctx),
      int(req(row, 'category_id', ctx), ctx),
      boolFlag(req(row, 'is_stage_race', ctx), ctx),
      int(req(row, 'number_of_stages', ctx), ctx),
      req(row, 'start_date', ctx),
      req(row, 'end_date', ctx),
      int(req(row, 'prestige', ctx), ctx),
    );
  }

  console.log(`  ${rows.length} Rennen eingefuegt.`);
}

function seedStages(db: Database.Database): void {
  const rows = readCsv('stages.csv');
  const insert = db.prepare(`
    INSERT INTO stages (
      id, race_id, stage_number, date, profile, start_elevation, details_csv_file,
      final_spread_start_percent, final_push_start_percent, final_spread_difficulty_multiplier,
      crash_incident_multiplier, mechanical_incident_multiplier
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const [index, row] of rows.entries()) {
    const ctx = `stages.csv Zeile ${index + 2}`;
    const finalSpreadStartPercent = real(row['final_spread_start_percent'] ?? '70', `${ctx} / final_spread_start_percent`);
    if (finalSpreadStartPercent < 0 || finalSpreadStartPercent > 100) {
      throw new Error(`${ctx}: final_spread_start_percent muss zwischen 0 und 100 liegen.`);
    }

    const finalPushStartPercent = real(row['final_push_start_percent'] ?? '90', `${ctx} / final_push_start_percent`);
    if (finalPushStartPercent < 0 || finalPushStartPercent > 100) {
      throw new Error(`${ctx}: final_push_start_percent muss zwischen 0 und 100 liegen.`);
    }

    const finalSpreadDifficultyMultiplier = real(
      row['final_spread_difficulty_multiplier'] ?? '1',
      `${ctx} / final_spread_difficulty_multiplier`,
    );
    if (finalSpreadDifficultyMultiplier <= 0) {
      throw new Error(`${ctx}: final_spread_difficulty_multiplier muss groesser als 0 sein.`);
    }

    const crashIncidentMultiplier = real(
      row['crash_incident_multiplier'] ?? '1',
      `${ctx} / crash_incident_multiplier`,
    );
    if (crashIncidentMultiplier <= 0) {
      throw new Error(`${ctx}: crash_incident_multiplier muss groesser als 0 sein.`);
    }

    const mechanicalIncidentMultiplier = real(
      row['mechanical_incident_multiplier'] ?? '1',
      `${ctx} / mechanical_incident_multiplier`,
    );
    if (mechanicalIncidentMultiplier <= 0) {
      throw new Error(`${ctx}: mechanical_incident_multiplier muss groesser als 0 sein.`);
    }

    insert.run(
      int(req(row, 'id', ctx), ctx),
      int(req(row, 'race_id', ctx), ctx),
      int(req(row, 'stage_number', ctx), ctx),
      req(row, 'date', ctx),
      req(row, 'profile', ctx),
      int(req(row, 'start_elevation', ctx), ctx),
      req(row, 'details_csv_file', ctx),
      finalSpreadStartPercent,
      finalPushStartPercent,
      finalSpreadDifficultyMultiplier,
      crashIncidentMultiplier,
      mechanicalIncidentMultiplier,
    );
  }

  console.log(`  ${rows.length} Etappen eingefuegt.`);
}

function provisionalOverall(row: CsvRow, ctx: string): number {
  const values = [
    int(req(row, 'skill_flat', ctx), ctx),
    int(req(row, 'skill_mountain', ctx), ctx),
    int(req(row, 'skill_medium_mountain', ctx), ctx),
    int(req(row, 'skill_hill', ctx), ctx),
    int(req(row, 'skill_time_trial', ctx), ctx),
    int(req(row, 'skill_cobble', ctx), ctx),
    int(req(row, 'skill_sprint', ctx), ctx),
    int(req(row, 'skill_stamina', ctx), ctx),
    int(req(row, 'skill_resistance', ctx), ctx),
    int(req(row, 'skill_recuperation', ctx), ctx),
  ];
  return clamp(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function seedRiders(db: Database.Database): void {
  const rows = readCsv('riders.csv');
  const insert = db.prepare(`
    INSERT INTO riders (
      id, first_name, last_name, country_id, rider_type_id, birth_year, overall_rating,
      skill_flat, skill_mountain, skill_medium_mountain, skill_hill, skill_time_trial,
      skill_prologue, skill_cobble, skill_sprint, skill_acceleration, skill_downhill,
      skill_attack, skill_stamina, skill_resistance, skill_recuperation,
      active_team_id, favorite_races, non_favorite_races
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const [index, row] of rows.entries()) {
    const ctx = `riders.csv Zeile ${index + 2}`;
    const seededTeamId = optionalInt(row['team_id']);
    insert.run(
      int(req(row, 'rider_id', ctx), ctx),
      req(row, 'first_name', ctx),
      req(row, 'last_name', ctx),
      int(req(row, 'country_id', ctx), ctx),
      DEFAULT_RIDER_TYPE_ID,
      int(req(row, 'birth_year', ctx), ctx),
      provisionalOverall(row, ctx),
      int(req(row, 'skill_flat', ctx), ctx),
      int(req(row, 'skill_mountain', ctx), ctx),
      int(req(row, 'skill_medium_mountain', ctx), ctx),
      int(req(row, 'skill_hill', ctx), ctx),
      int(req(row, 'skill_time_trial', ctx), ctx),
      int(req(row, 'skill_prologue', ctx), ctx),
      int(req(row, 'skill_cobble', ctx), ctx),
      int(req(row, 'skill_sprint', ctx), ctx),
      int(req(row, 'skill_acceleration', ctx), ctx),
      int(req(row, 'skill_downhill', ctx), ctx),
      int(req(row, 'skill_attack', ctx), ctx),
      int(req(row, 'skill_stamina', ctx), ctx),
      int(req(row, 'skill_resistance', ctx), ctx),
      int(req(row, 'skill_recuperation', ctx), ctx),
      seededTeamId,
      row['favorite_races']?.trim() ?? '',
      row['non_favorite_races']?.trim() ?? '',
    );
  }

  console.log(`  ${rows.length} Fahrer eingefuegt.`);
}

function seedContracts(db: Database.Database): void {
  const currentSeason = db.prepare('SELECT season FROM game_state WHERE id = 1').get() as { season: number } | undefined;
  if (!currentSeason) {
    throw new Error('game_state muss vor contracts gesetzt sein.');
  }

  const teams = db.prepare(`
    SELECT teams.id, division_teams.name AS division_name, division_teams.tier AS tier
    FROM teams
    JOIN division_teams ON division_teams.id = teams.division_id
    WHERE division_teams.name IN ('WorldTour', 'ProTour')
    ORDER BY division_teams.tier ASC, teams.id ASC
  `).all() as TeamAllocationRow[];

  const assignedRiders = db.prepare(`
    SELECT id, active_team_id
    FROM riders
    WHERE is_retired = 0
      AND active_team_id IS NOT NULL
    ORDER BY active_team_id ASC, overall_rating DESC, id ASC
  `).all() as Array<{ id: number; active_team_id: number }>;

  const riderCountByTeam = new Map<number, number>();
  for (const rider of assignedRiders) {
    riderCountByTeam.set(rider.active_team_id, (riderCountByTeam.get(rider.active_team_id) ?? 0) + 1);
  }

  for (const team of teams) {
    const riderCount = riderCountByTeam.get(team.id) ?? 0;
    if (riderCount !== 30) {
      throw new Error(`Team ${team.id} (${team.division_name}) hat ${riderCount} gesetzte Fahrer in riders.csv, erwartet 30.`);
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

function seedGameState(db: Database.Database): number {
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
    INSERT OR REPLACE INTO game_state (id, current_date, season, is_game_over)
    VALUES (1, ?, ?, ?)
  `).run(currentDate, season, isGameOver);

  console.log(`  Spielzustand gesetzt: ${currentDate}, Saison ${season}.`);
  return season;
}

function seedRaceEntries(db: Database.Database): void {
  const races = db.prepare(`
    SELECT races.id, race_categories.number_of_teams, race_categories.number_of_riders
    FROM races
    JOIN race_categories ON race_categories.id = races.category_id
    ORDER BY races.id ASC
  `).all() as Array<{ id: number; number_of_teams: number; number_of_riders: number }>;

  const teams = db.prepare(`
    SELECT teams.id
    FROM teams
    JOIN division_teams ON division_teams.id = teams.division_id
    WHERE division_teams.name != 'U23'
    ORDER BY division_teams.tier ASC, teams.id ASC
  `).all() as Array<{ id: number }>;

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
        const riders = selectRiders.all(team.id, race.number_of_riders) as Array<{ id: number }>;
        for (const rider of riders) {
          insertEntry.run(race.id, team.id, rider.id);
        }
      }
    }
  })();

  console.log('  Race-Entries angelegt.');
}

function cleanupDatabaseFiles(): void {
  for (const suffix of ['', '-wal', '-shm']) {
    const filePath = DB_PATH + suffix;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

export function bootstrap(force = false): void {
  if (!force && fs.existsSync(DB_PATH)) {
    console.log('Bootstrap: world_data.db bereits vorhanden, uebersprungen.');
    return;
  }

  console.log('Bootstrap: Erstelle world_data.db ...');

  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  cleanupDatabaseFiles();

  let db: Database.Database | null = null;

  try {
    db = new Database(DB_PATH);
    db.pragma('foreign_keys = ON');

    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
    db.exec(schema);
    console.log('  Schema angewendet.');

    seedStaCountry(db);
    seedTypeRider(db);
    seedStaRole(db);
    seedResultTypes(db);
    const divisionIdByName = seedDivisionTeams(db);
    seedTeams(db, divisionIdByName);
    seedRaceCategoriesBonus(db);
    seedRules(db);
    seedRaceCategories(db);
    seedSkillWeights(db);
    seedRaces(db);
    seedStages(db);
    seedRiders(db);
    const currentSeason = seedGameState(db);

    new RiderDevelopmentService(db).initializeRiders(currentSeason, true);
    seedContracts(db);
    new ContractService(db).checkContractStatuses(currentSeason);

    db.pragma('wal_checkpoint(TRUNCATE)');
    db.pragma('journal_mode = DELETE');
    db.close();
    db = null;

    console.log(`✅  world_data.db erstellt: ${DB_PATH}`);
  } catch (error) {
    try {
      db?.close();
    } catch {
      // Ignorieren, wir bereinigen die Dateien ohnehin.
    }
    cleanupDatabaseFiles();
    throw error;
  }
}