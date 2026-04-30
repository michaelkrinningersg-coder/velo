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

function clamp(value: number, min = 0, max = 85): number {
  return Math.max(min, Math.min(max, Math.round(value * 100) / 100));
}

function parseCsvLine(line: string): string[] {
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

    if (char === ',' && !inQuotes) {
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

  const headers = parseCsvLine(lines[0]).map(value => value.trim());
  return lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line);
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

function boolFlag(value: string, ctx: string): number {
  if (value === '0' || value === '1') {
    return Number(value);
  }
  throw new Error(`${ctx}: Feld muss 0 oder 1 sein, erhalten "${value}".`);
}

function createU23Abbreviation(base: string, used: Set<string>): string {
  const normalized = base.toUpperCase().replace(/[^A-Z0-9]/g, '').padEnd(3, 'X').slice(0, 3);
  const candidates = [
    `U${normalized.slice(0, 2)}`,
    `${normalized[0]}U${normalized[1]}`,
    `${normalized.slice(0, 2)}U`,
    `U${normalized[0]}${normalized[2]}`,
  ];

  for (const candidate of candidates) {
    if (candidate.length === 3 && !used.has(candidate)) {
      used.add(candidate);
      return candidate;
    }
  }

  for (let suffix = 0; suffix <= 9; suffix += 1) {
    const candidate = `U${normalized[0]}${suffix}`;
    if (!used.has(candidate)) {
      used.add(candidate);
      return candidate;
    }
  }

  throw new Error(`Keine freie U23-Abkuerzung fuer ${base}.`);
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
  const usedAbbreviations = new Set(mainTeams.map(team => team.abbreviation));
  let nextTeamId = Math.max(...mainTeams.map(team => team.id)) + 1;

  const generatedU23Teams = mainTeams.map((team) => ({
    id: nextTeamId++,
    mainTeamId: team.id,
    name: `${team.name} U23`,
    abbreviation: createU23Abbreviation(team.abbreviation, usedAbbreviations),
    divisionName: 'U23',
    isPlayerTeam: 0,
    countryId: team.countryId,
    colorPrimary: team.colorPrimary,
    colorSecondary: team.colorSecondary,
    aiFocus1: team.aiFocus1,
    aiFocus2: team.aiFocus2,
    aiFocus3: team.aiFocus3,
  }));

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

  for (const team of generatedU23Teams) {
    const divisionId = divisionIdByName.get(team.divisionName);
    if (divisionId == null) {
      throw new Error(`Unbekannte Division "${team.divisionName}" fuer U23-Team "${team.name}".`);
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

  const linkU23 = db.prepare('UPDATE teams SET u23_team = ? WHERE id = ?');
  for (const team of generatedU23Teams) {
    linkU23.run(team.id, team.mainTeamId);
  }

  console.log(`  ${mainTeams.length} Hauptteams + ${generatedU23Teams.length} U23-Teams eingefuegt.`);
}

function seedRaceCategoriesBonus(db: Database.Database): void {
  const rows = readCsv('race_categories_bonus.csv');
  const insert = db.prepare(`
    INSERT INTO race_categories_bonus (
      id, name, bonus_seconds_final, bonus_seconds_intermediate, points_stage,
      points_sprint_finish, points_one_day, points_gc_final, points_jersey_leader_day, points_jersey_sprint_day,
      points_jersey_mountain_day, points_jersey_youth_day, points_sprint_intermediate,
      points_mountain_hc, points_mountain_cat1, points_mountain_cat2, points_mountain_cat3,
      points_mountain_cat4, points_jersey_sprint_final, points_jersey_mountain_final,
      points_jersey_youth_final
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const [index, row] of rows.entries()) {
    const ctx = `race_categories_bonus.csv Zeile ${index + 2}`;
    insert.run(
      int(req(row, 'id', ctx), ctx),
      req(row, 'name', ctx),
      req(row, 'bonus_seconds_final', ctx),
      req(row, 'bonus_seconds_intermediate', ctx),
      req(row, 'points_stage', ctx),
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

function seedRaceCategories(db: Database.Database): void {
  const rows = readCsv('race_categories.csv');
  const insert = db.prepare(`
    INSERT INTO race_categories (id, name, tier, number_of_teams, number_of_riders, bonus_system_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const [index, row] of rows.entries()) {
    const ctx = `race_categories.csv Zeile ${index + 2}`;
    insert.run(
      int(req(row, 'id', ctx), ctx),
      req(row, 'name', ctx),
      int(req(row, 'tier', ctx), ctx),
      int(req(row, 'number_of_teams', ctx), ctx),
      int(req(row, 'number_of_riders', ctx), ctx),
      int(req(row, 'bonus_system_id', ctx), ctx),
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
    INSERT INTO stages (id, race_id, stage_number, date, profile, details_csv_file)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const [index, row] of rows.entries()) {
    const ctx = `stages.csv Zeile ${index + 2}`;
    insert.run(
      int(req(row, 'id', ctx), ctx),
      int(req(row, 'race_id', ctx), ctx),
      int(req(row, 'stage_number', ctx), ctx),
      req(row, 'date', ctx),
      req(row, 'profile', ctx),
      req(row, 'details_csv_file', ctx),
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
      int(req(row, 'team_id', ctx), ctx),
      row['favorite_races']?.trim() ?? '',
      row['non_favorite_races']?.trim() ?? '',
    );
  }

  console.log(`  ${rows.length} Fahrer eingefuegt.`);
}

function seedContracts(db: Database.Database): void {
  const rows = readCsv('contracts.csv');
  const insert = db.prepare(`
    INSERT INTO contracts (rider_id, team_id, start_season, end_season, status)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const [index, row] of rows.entries()) {
    const ctx = `contracts.csv Zeile ${index + 2}`;
    insert.run(
      int(req(row, 'rider_id', ctx), ctx),
      int(req(row, 'team_id', ctx), ctx),
      int(req(row, 'start_season', ctx), ctx),
      int(req(row, 'end_season', ctx), ctx),
      req(row, 'status', ctx),
    );
  }

  console.log(`  ${rows.length} Vertraege eingefuegt.`);
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
    seedRaceCategories(db);
    seedRaces(db);
    seedStages(db);
    seedRiders(db);
    seedContracts(db);
    const currentSeason = seedGameState(db);

    new RiderDevelopmentService(db).initializeRiders(currentSeason, true);
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