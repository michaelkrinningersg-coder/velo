/**
 * bootstrapper.ts
 *
 * Liest CSV-Dateien und erstellt die Master-DB (world_data.db).
 * Wird beim Serverstart ausgeführt wenn die DB fehlt.
 */

import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import type { RiderPotentials, RiderSkillKey, RiderSkills, RiderSpecialization } from '../../shared/types';

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
const ASSETS_DIR  = path.join(BACKEND_ROOT, 'assets');
const CSV_DIR     = path.join(BACKEND_ROOT, '..', 'data', 'csv');
const SCHEMA_PATH = path.join(ASSETS_DIR, 'schema.sql');
const DB_PATH     = path.join(ASSETS_DIR, 'world_data.db');
const RIDER_STAT_MAX = 85;

// ------ Hilfsfunktionen ----------------------------------------

function clamp(v: number, min = 0, max = RIDER_STAT_MAX): number {
  return Math.max(min, Math.min(max, Math.round(v)));
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calcOverall(attrs: number[]): number {
  return clamp(Math.round(attrs.reduce((s, v) => s + v, 0) / attrs.length));
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

function parseCsv(content: string): Array<Record<string, string>> {
  const normalized = content.replace(/^\uFEFF/, '').trim();
  if (!normalized) return [];
  const lines = normalized.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) throw new Error('CSV muss Header und mindestens eine Datenzeile enthalten.');
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line);
    if (values.length > headers.length) {
      throw new Error(`CSV-Zeile ${index + 2} hat ${values.length} Spalten, erwartet höchstens ${headers.length}.`);
    }
    while (values.length < headers.length) values.push('');
    return headers.reduce<Record<string, string>>((rec, h, i) => { rec[h] = values[i]; return rec; }, {});
  });
}

function readCsv(fileName: string): Array<Record<string, string>> {
  const filePath = path.join(CSV_DIR, fileName);
  if (!fs.existsSync(filePath)) throw new Error(`CSV nicht gefunden: ${filePath}`);
  return parseCsv(fs.readFileSync(filePath, 'utf8'));
}

function req(row: Record<string, string>, key: string, ctx: string): string {
  const v = row[key]?.trim();
  if (!v) throw new Error(`${ctx}: Pflichtfeld "${key}" fehlt.`);
  return v;
}

function int(value: string, ctx: string): number {
  const n = Number.parseInt(value, 10);
  if (!Number.isInteger(n)) throw new Error(`${ctx}: Ganzzahl erwartet, erhalten "${value}".`);
  return n;
}

function optionalInt(value: string | undefined): number | null {
  if (value == null || value.trim().length === 0) return null;
  const n = Number.parseInt(value, 10);
  return Number.isInteger(n) ? n : null;
}

function boolFlag(value: string, ctx: string): number {
  if (value === '0' || value === '1') return Number(value);
  throw new Error(`${ctx}: Feld muss 0 oder 1 sein, erhalten "${value}".`);
}

function parseIdList(value: string): number[] {
  return value
    .split(',')
    .map(part => part.trim())
    .filter(part => part.length > 0)
    .map(part => {
      const parsed = Number.parseInt(part, 10);
      if (!Number.isInteger(parsed)) throw new Error(`Ungültige race_id-Liste: "${value}".`);
      return parsed;
    });
}

function normalizeIdList(value: string): string {
  if (!value.trim()) return '';
  return parseIdList(value).join(',');
}

interface CountrySeed {
  id: number;
  name: string;
  code3: string;
  continent: string;
  regenRating: number;
  numberRegenMin: number;
  numberRegenMax: number;
}

function parseCountrySeeds(): CountrySeed[] {
  return readCsv('sta_country.csv').map((row, index) => {
    const ctx = `sta_country.csv Zeile ${index + 2}`;
    const code3 = req(row, 'code_3', ctx).toUpperCase();
    if (code3.length !== 3) throw new Error(`${ctx}: code_3 muss 3 Zeichen haben.`);
    const numberRegenMin = int(req(row, 'number_regen_min', ctx), ctx);
    const numberRegenMax = int(req(row, 'number_regen_max', ctx), ctx);
    if (numberRegenMax < numberRegenMin) throw new Error(`${ctx}: number_regen_max muss >= number_regen_min sein.`);
    return {
      id: int(req(row, 'id', ctx), ctx),
      name: req(row, 'name', ctx),
      code3,
      continent: req(row, 'continent', ctx),
      regenRating: int(req(row, 'regen_rating', ctx), ctx),
      numberRegenMin,
      numberRegenMax,
    };
  });
}

// ------ U23-Abkürzung ------------------------------------------

function createU23Abbreviation(base: string, used: Set<string>): string {
  const n = base.toUpperCase().replace(/[^A-Z0-9]/g, '').padEnd(3, 'X').slice(0, 3);
  const candidates = [`U${n.slice(0, 2)}`, `${n[0]}U${n[1]}`, `${n.slice(0, 2)}U`, `U${n[0]}${n[2]}`];
  for (const c of candidates) {
    if (c.length === 3 && !used.has(c)) { used.add(c); return c; }
  }
  for (let i = 0; i <= 9; i++) {
    const c = `U${n[0]}${i}`;
    if (!used.has(c)) { used.add(c); return c; }
  }
  throw new Error(`Keine freie U23-Abkürzung für ${base}.`);
}

// ------ Rider-Seeding ----------------------------------------

const RIDER_SKILL_COLUMNS = [
  ['flat', 'flat'],
  ['mountain', 'mountain'],
  ['mediumMountain', 'medium_mountain'],
  ['hill', 'hill'],
  ['timeTrial', 'time_trial'],
  ['prologue', 'prologue'],
  ['cobble', 'cobble'],
  ['sprint', 'sprint'],
  ['acceleration', 'acceleration'],
  ['downhill', 'downhill'],
  ['attack', 'attack'],
  ['stamina', 'stamina'],
  ['resistance', 'resistance'],
  ['recuperation', 'recuperation'],
  ['bikeHandling', 'bike_handling'],
] as const satisfies ReadonlyArray<readonly [RiderSkillKey, string]>;

const STAGE_SPECIALIZATIONS: RiderSpecialization[] = ['GrandTour', 'Etappenrennen', 'Berg', 'Timetrial'];
const ONE_DAY_SPECIALIZATIONS: RiderSpecialization[] = ['Cobble', 'Hill', 'Sprint', 'Attacker', 'One-Day-Classic'];

interface RiderSeedInput {
  riderId: number;
  firstName: string;
  lastName: string;
  countryId: number;
  birthYear: number;
  activeTeamId: number;
  contractStartSeason: number;
  contractEndSeason: number;
  skills: RiderSkills;
  potentials: Partial<RiderPotentials>;
  potential: number | null;
  favoriteRaces: string;
  nonFavoriteRaces: string;
}

interface RiderSeed extends RiderSeedInput {
  potentials: RiderPotentials;
  overallRating: number;
  potential: number;
  riderType: RiderSpecialization;
  specialization1: RiderSpecialization | null;
  specialization2: RiderSpecialization | null;
  specialization3: RiderSpecialization | null;
  isStageRacer: number;
  isOneDayRacer: number;
}

function scoreProfile(skills: RiderSkills, weights: Array<[RiderSkillKey, number]>): number {
  return weights.reduce((sum, [key, weight]) => sum + skills[key] * weight, 0);
}

function calculateSkillPotential(skill: number): number {
  if (skill > 80) return clamp(skill + rand(0, 3));
  if (skill < 75) return clamp(skill + rand(5, 15));
  return clamp(skill + rand(2, 8));
}

function buildPotentials(skills: RiderSkills, existing: Partial<RiderPotentials> = {}): RiderPotentials {
  const entries = RIDER_SKILL_COLUMNS.map(([key]) => [key, existing[key] ?? calculateSkillPotential(skills[key])]);
  return Object.fromEntries(entries) as RiderPotentials;
}

function getSpecializationScores(skills: RiderSkills): Array<{ specialization: RiderSpecialization; score: number }> {
  const scores: Array<{ specialization: RiderSpecialization; score: number }> = [
    { specialization: 'GrandTour', score: scoreProfile(skills, [['mountain', 0.28], ['mediumMountain', 0.2], ['stamina', 0.2], ['resistance', 0.17], ['recuperation', 0.15]]) },
    { specialization: 'Etappenrennen', score: scoreProfile(skills, [['mediumMountain', 0.22], ['hill', 0.16], ['timeTrial', 0.16], ['stamina', 0.16], ['resistance', 0.15], ['recuperation', 0.15]]) },
    { specialization: 'Berg', score: scoreProfile(skills, [['mountain', 0.4], ['mediumMountain', 0.2], ['stamina', 0.15], ['attack', 0.15], ['downhill', 0.1]]) },
    { specialization: 'Hill', score: scoreProfile(skills, [['hill', 0.35], ['acceleration', 0.2], ['mediumMountain', 0.15], ['attack', 0.15], ['bikeHandling', 0.15]]) },
    { specialization: 'Sprint', score: scoreProfile(skills, [['sprint', 0.4], ['acceleration', 0.25], ['flat', 0.15], ['bikeHandling', 0.1], ['resistance', 0.1]]) },
    { specialization: 'Timetrial', score: scoreProfile(skills, [['timeTrial', 0.5], ['prologue', 0.2], ['flat', 0.1], ['resistance', 0.1], ['bikeHandling', 0.1]]) },
    { specialization: 'Cobble', score: scoreProfile(skills, [['cobble', 0.4], ['flat', 0.2], ['resistance', 0.15], ['bikeHandling', 0.15], ['hill', 0.1]]) },
    { specialization: 'Attacker', score: scoreProfile(skills, [['attack', 0.35], ['acceleration', 0.2], ['hill', 0.15], ['mediumMountain', 0.15], ['resistance', 0.15]]) },
    { specialization: 'One-Day-Classic', score: scoreProfile(skills, [['hill', 0.2], ['cobble', 0.2], ['flat', 0.15], ['resistance', 0.2], ['bikeHandling', 0.15], ['sprint', 0.1]]) },
  ];
  return scores.sort((left, right) => right.score - left.score);
}

function assignRiderType(input: Pick<RiderSeedInput, 'skills' | 'potentials' | 'potential'>): Omit<RiderSeed, 'riderId' | 'firstName' | 'lastName' | 'countryId' | 'birthYear' | 'activeTeamId' | 'contractStartSeason' | 'contractEndSeason' | 'skills' | 'favoriteRaces' | 'nonFavoriteRaces'> {
  const { skills } = input;
  const specializationScores = getSpecializationScores(skills);
  const [first, second, third] = specializationScores;
  const potentials = buildPotentials(skills, input.potentials);
  const topThree = specializationScores.slice(0, 3).map(entry => entry.specialization);
  const isStageRacer = topThree.some(specialization => STAGE_SPECIALIZATIONS.includes(specialization)) ? 1 : 0;
  const isOneDayRacer = topThree.some(specialization => ONE_DAY_SPECIALIZATIONS.includes(specialization)) ? 1 : 0;
  return {
    potentials,
    overallRating: calcOverall(RIDER_SKILL_COLUMNS.map(([key]) => skills[key])),
    potential: input.potential ?? calcOverall(RIDER_SKILL_COLUMNS.map(([key]) => potentials[key])),
    riderType: first.specialization,
    specialization1: first?.specialization ?? null,
    specialization2: second?.specialization ?? null,
    specialization3: third?.specialization ?? null,
    isStageRacer,
    isOneDayRacer,
  };
}

function parseRiderSeeds(): RiderSeedInput[] {
  return readCsv('riders.csv').map((row, index) => {
    const ctx = `riders.csv Zeile ${index + 2}`;
    const skills = Object.fromEntries(
      RIDER_SKILL_COLUMNS.map(([key, column]) => [key, clamp(int(req(row, `skill_${column}`, ctx), ctx))]),
    ) as RiderSkills;
    const potentials = Object.fromEntries(
      RIDER_SKILL_COLUMNS
        .map(([key, column]) => {
          const value = optionalInt(row[`pot_${column}`]);
          return [key, value == null ? null : clamp(value)];
        })
        .filter(([, value]) => value != null),
    ) as Partial<RiderPotentials>;

    return {
      riderId: int(req(row, 'rider_id', ctx), ctx),
      firstName: req(row, 'first_name', ctx),
      lastName: req(row, 'last_name', ctx),
      countryId: int(req(row, 'country_id', ctx), ctx),
      birthYear: int(req(row, 'birth_year', ctx), ctx),
      activeTeamId: int(req(row, 'team_id', ctx), ctx),
      contractStartSeason: int(req(row, 'contract_start_season', ctx), ctx),
      contractEndSeason: int(req(row, 'contract_end_season', ctx), ctx),
      skills,
      potentials,
      potential: (() => {
        const value = optionalInt(row['pot_overall']);
        return value == null ? null : clamp(value);
      })(),
      favoriteRaces: normalizeIdList(row['favorite_races'] ?? ''),
      nonFavoriteRaces: normalizeIdList(row['non_favorite_races'] ?? ''),
    };
  });
}

function syncActiveContractCache(db: Database.Database, season: number): void {
  db.prepare(`
    UPDATE riders
    SET active_contract_id = (
      SELECT c.id
      FROM contracts c
      WHERE c.rider_id = riders.id
        AND c.start_season <= ?
        AND c.end_season >= ?
      ORDER BY c.start_season DESC, c.id DESC
      LIMIT 1
    ),
    active_team_id = (
      SELECT c.team_id
      FROM contracts c
      WHERE c.rider_id = riders.id
        AND c.start_season <= ?
        AND c.end_season >= ?
      ORDER BY c.start_season DESC, c.id DESC
      LIMIT 1
    )
  `).run(season, season, season, season);
}

interface RaceDef {
  name: string; type: string; date: string; dist: number; elev: number; grad: number; ttType?: string;
}

const RACES: RaceDef[] = [
  { name: 'Australian Open TT',                   type: 'TimeTrial', date: '2026-01-11', dist: 18.0, elev: 110,  grad: 0.6, ttType: 'ITT' },
  { name: 'Prologue – Chrono de Genève',          type: 'TimeTrial', date: '2026-03-01', dist: 7.5,  elev: 80,   grad: 1.2, ttType: 'ITT' },
  { name: 'Grand Prix du Rhin – Einzelzeitfahren', type: 'TimeTrial', date: '2026-04-15', dist: 42.0, elev: 350,  grad: 2.1, ttType: 'ITT' },
  { name: 'Tour des Alpes – Einzelzeitfahren',     type: 'TimeTrial', date: '2026-05-20', dist: 28.5, elev: 620,  grad: 4.8, ttType: 'ITT' },
  { name: 'Criterium du Nord',                     type: 'Flat',      date: '2026-03-15', dist: 185,  elev: 720,  grad: 1.1 },
  { name: 'Klassieker van Vlaanderen',             type: 'Classics',  date: '2026-04-05', dist: 265,  elev: 2400, grad: 6.5 },
  { name: 'Giro di Montagna – Etappe 12',          type: 'Mountain',  date: '2026-05-28', dist: 172,  elev: 4800, grad: 7.2 },
];

// ------ Bootstrap-Funktion ------------------------------------

export function bootstrap(force = false): void {
  if (!force && fs.existsSync(DB_PATH)) {
    console.log('Bootstrap: world_data.db bereits vorhanden, übersprungen.');
    return;
  }

  console.log('Bootstrap: Erstelle world_data.db …');

  if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });
  for (const suffix of ['', '-wal', '-shm']) {
    const filePath = DB_PATH + suffix;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  const db = new Database(DB_PATH);

  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  db.exec(schema);
  console.log('  Schema angewendet.');

  const gsRows = readCsv('game_state.csv');
  const gsRow = gsRows[0];
  const currentDate = gsRow ? req(gsRow, 'current_date', 'game_state.csv Zeile 2') : '2026-01-01';
  const currentSeason = gsRow ? int(req(gsRow, 'season', 'game_state.csv Zeile 2'), 'game_state.csv Zeile 2') : 2026;
  const isGameOver = gsRow ? boolFlag(req(gsRow, 'is_game_over', 'game_state.csv Zeile 2'), 'game_state.csv Zeile 2') : 0;

  // Laender-Stammdaten
  const countrySeeds = parseCountrySeeds();
  const seenCountryIds = new Set<number>();
  const seenCountryCodes = new Set<string>();
  for (const country of countrySeeds) {
    if (country.id <= 0) throw new Error(`Country-ID ${country.id} muss positiv sein.`);
    if (seenCountryIds.has(country.id)) throw new Error(`Doppelte Country-ID ${country.id} in sta_country.csv.`);
    if (seenCountryCodes.has(country.code3)) throw new Error(`Doppelter code_3 ${country.code3} in sta_country.csv.`);
    seenCountryIds.add(country.id);
    seenCountryCodes.add(country.code3);
  }
  const insCountry = db.prepare(
    'INSERT INTO sta_country (id, name, code_3, continent, regen_rating, number_regen_min, number_regen_max) VALUES (?, ?, ?, ?, ?, ?, ?)',
  );
  for (const country of countrySeeds) {
    insCountry.run(country.id, country.name, country.code3, country.continent, country.regenRating, country.numberRegenMin, country.numberRegenMax);
  }

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

  const insDivision = db.prepare(
    'INSERT INTO division_teams (name, tier, max_teams, min_roster_size, max_roster_size) VALUES (?, ?, ?, ?, ?)',
  );
  for (const d of divisions) insDivision.run(d.name, d.tier, d.maxTeams, d.minRosterSize, d.maxRosterSize);

  const divMap = new Map<string, number>();
  for (const row of db.prepare('SELECT id, name FROM division_teams').all() as Array<{ id: number; name: string }>) {
    divMap.set(row.name, row.id);
  }

  // Teams aus CSV
  const teamSeeds = readCsv('teams.csv').map((row, i) => {
    const ctx = `teams.csv Zeile ${i + 2}`;
    const teamId = int(req(row, 'team_id', ctx), ctx);
    const abbr = req(row, 'abbreviation', ctx).toUpperCase();
    if (abbr.length !== 3) throw new Error(`${ctx}: abbreviation muss 3 Zeichen haben.`);
    return {
      teamId,
      name: req(row, 'name', ctx), abbreviation: abbr,
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

  const usedTeamIds = new Set<number>();
  for (const team of teamSeeds) {
    if (team.teamId <= 0) throw new Error(`Team-ID ${team.teamId} für Team "${team.name}" muss positiv sein.`);
    if (usedTeamIds.has(team.teamId)) throw new Error(`Doppelte team_id ${team.teamId} in teams.csv.`);
    if (!seenCountryIds.has(team.countryId)) throw new Error(`Unbekannte country_id ${team.countryId} für Team "${team.name}".`);
    usedTeamIds.add(team.teamId);
  }

  const mainTeams = teamSeeds.filter(t => t.divisionName !== 'U23');
  const usedAbbr = new Set(mainTeams.map(t => t.abbreviation));
  let nextGeneratedTeamId = Math.max(...teamSeeds.map(t => t.teamId)) + 1;
  const u23Teams = mainTeams.map(t => ({
    teamId: nextGeneratedTeamId++,
    mainTeamName: t.name,
    name: `${t.name} U23`,
    abbreviation: createU23Abbreviation(t.abbreviation, usedAbbr),
    divisionName: 'U23',
    isPlayerTeam: 0,
    countryId: t.countryId,
    colorPrimary: t.colorPrimary,
    colorSecondary: t.colorSecondary,
    aiFocus1: t.aiFocus1, aiFocus2: t.aiFocus2, aiFocus3: t.aiFocus3,
  }));

  const insTeam = db.prepare(
    `INSERT INTO teams (id, name, abbreviation, division_id, u23_team, is_player_team, country_id, color_primary, color_secondary, ai_focus_1, ai_focus_2, ai_focus_3)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const linkU23 = db.prepare('UPDATE teams SET u23_team = ? WHERE id = ?');
  const mainTeamIds = new Map<string, number>();
  const u23TeamIds = new Map<string, number>();

  for (const t of mainTeams) {
    const divId = divMap.get(t.divisionName);
    if (divId == null) throw new Error(`Unbekannte Division "${t.divisionName}" für Team "${t.name}".`);
    insTeam.run(t.teamId, t.name, t.abbreviation, divId, null, t.isPlayerTeam, t.countryId, t.colorPrimary, t.colorSecondary, t.aiFocus1, t.aiFocus2, t.aiFocus3);
    mainTeamIds.set(t.name, t.teamId);
  }
  for (const t of u23Teams) {
    const divId = divMap.get(t.divisionName);
    if (divId == null) throw new Error(`Unbekannte Division "${t.divisionName}" für U23-Team "${t.name}".`);
    insTeam.run(t.teamId, t.name, t.abbreviation, divId, null, t.isPlayerTeam, t.countryId, t.colorPrimary, t.colorSecondary, t.aiFocus1, t.aiFocus2, t.aiFocus3);
    u23TeamIds.set(t.mainTeamName, t.teamId);
  }
  for (const [teamName, mainId] of mainTeamIds) {
    const u23Id = u23TeamIds.get(teamName);
    if (u23Id != null) linkU23.run(u23Id, mainId);
  }
  console.log(`  ${mainTeams.length} Hauptteams + ${u23Teams.length} U23-Teams eingefügt.`);

  // Fahrer aus CSV
  const seededRiders = parseRiderSeeds().map(rider => ({
    ...rider,
    ...assignRiderType({ skills: rider.skills, potentials: rider.potentials, potential: rider.potential }),
  }));
  const knownTeamIds = new Set((db.prepare('SELECT id FROM teams').all() as Array<{ id: number }>).map(team => team.id));
  const usedRiderIds = new Set<number>();

  const riderColumns = RIDER_SKILL_COLUMNS.map(([, column]) => `skill_${column}`).join(', ');
  const riderPotentialColumns = RIDER_SKILL_COLUMNS.map(([, column]) => `pot_${column}`).join(', ');
  const riderPlaceholders = RIDER_SKILL_COLUMNS.map(() => '?').join(', ');
  const riderPotentialPlaceholders = RIDER_SKILL_COLUMNS.map(() => '?').join(', ');
  const insRider = db.prepare(`
    INSERT INTO riders (
      id, first_name, last_name, country_id, birth_year, pot_overall, overall_rating,
      ${riderColumns},
      ${riderPotentialColumns},
      rider_type, specialization_1, specialization_2, specialization_3,
      is_stage_racer, is_one_day_racer, favorite_races, non_favorite_races,
      active_team_id, active_contract_id, is_retired
    )
    VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ${riderPlaceholders},
      ${riderPotentialPlaceholders},
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);
  const insContract = db.prepare(
    'INSERT INTO contracts (rider_id, team_id, start_season, end_season) VALUES (?, ?, ?, ?)',
  );

  for (const rider of seededRiders) {
    if (usedRiderIds.has(rider.riderId)) throw new Error(`Doppelte rider_id ${rider.riderId} in riders.csv.`);
    if (!knownTeamIds.has(rider.activeTeamId)) throw new Error(`Unbekannte team_id ${rider.activeTeamId} für Fahrer ${rider.firstName} ${rider.lastName}.`);
    if (!seenCountryIds.has(rider.countryId)) throw new Error(`Unbekannte country_id ${rider.countryId} für Fahrer ${rider.firstName} ${rider.lastName}.`);
    usedRiderIds.add(rider.riderId);

    const skillValues = RIDER_SKILL_COLUMNS.map(([key]) => rider.skills[key]);
    const potentialValues = RIDER_SKILL_COLUMNS.map(([key]) => rider.potentials[key]);
    insRider.run(
      rider.riderId,
      rider.firstName,
      rider.lastName,
      rider.countryId,
      rider.birthYear,
      rider.potential,
      rider.overallRating,
      ...skillValues,
      ...potentialValues,
      rider.riderType,
      rider.specialization1,
      rider.specialization2,
      rider.specialization3,
      rider.isStageRacer,
      rider.isOneDayRacer,
      rider.favoriteRaces,
      rider.nonFavoriteRaces,
      null,
      null,
      0,
    );
    insContract.run(rider.riderId, rider.activeTeamId, rider.contractStartSeason, rider.contractEndSeason);
  }
  syncActiveContractCache(db, currentSeason);
  console.log(`  ${seededRiders.length} Fahrer eingefügt.`);

  // Rennen
  const insRace = db.prepare(
    'INSERT INTO races (name, type, season, date, distance_km, elevation_gain, avg_gradient, tt_type) VALUES (?, ?, 2026, ?, ?, ?, ?, ?)',
  );
  for (const race of RACES) insRace.run(race.name, race.type, race.date, race.dist, race.elev, race.grad, race.ttType ?? null);
  console.log(`  ${RACES.length} Rennen eingefügt.`);

  // Initialer Spielzustand aus CSV
  db.prepare(
    'INSERT OR REPLACE INTO game_state (id, "current_date", season, is_game_over) VALUES (1, ?, ?, ?)',
  ).run(currentDate, currentSeason, isGameOver);
  console.log(`  Spielzustand gesetzt: ${currentDate}, Saison ${currentSeason}.`);

  // Race-Entries
  const raceRows  = db.prepare('SELECT id FROM races').all() as Array<{ id: number }>;
  const riderRows = db.prepare('SELECT id, active_team_id FROM riders WHERE active_team_id IS NOT NULL').all() as Array<{ id: number; active_team_id: number }>;
  const insEntry  = db.prepare('INSERT OR IGNORE INTO race_entries (race_id, team_id, rider_id) VALUES (?,?,?)');
  db.transaction(() => {
    for (const race of raceRows) for (const rider of riderRows) insEntry.run(race.id, rider.active_team_id, rider.id);
  })();
  console.log('  Race-Entries angelegt.');

  // Die Master-DB dient als Kopiervorlage. Daher alle WAL-Änderungen vor dem Schließen
  // in die Hauptdatei schreiben, damit Savegames nie aus einem unvollständigen Stand entstehen.
  db.pragma('wal_checkpoint(TRUNCATE)');
  db.pragma('journal_mode = DELETE');

  db.close();
  console.log('✅  world_data.db erstellt:', DB_PATH);
}
