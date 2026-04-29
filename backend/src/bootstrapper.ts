/**
 * bootstrapper.ts
 *
 * Liest CSV-Dateien und erstellt die Master-DB (world_data.db).
 * Wird beim Serverstart ausgeführt wenn die DB fehlt.
 */

import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import type { ContractStatus, RaceCategoryTier, RiderPotentials, RiderSkillKey, RiderSkills, RiderSpecialization, StageProfile } from '../../shared/types';
import { ContractService } from './game/ContractService';
import { deriveRiderTags, type RiderTagFlags } from './game/RiderTagService';

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
const STAGES_DIR  = path.join(BACKEND_ROOT, '..', 'data', 'stages');
const SCHEMA_PATH = path.join(ASSETS_DIR, 'schema.sql');
const DB_PATH     = path.join(ASSETS_DIR, 'world_data.db');
const RIDER_STAT_MAX = 85;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// ------ Hilfsfunktionen ----------------------------------------

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function clamp(v: number, min = 0, max = RIDER_STAT_MAX): number {
  return round2(Math.max(min, Math.min(max, v)));
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function calcBikeHandling(skills: Pick<RiderSkills, 'downhill' | 'sprint' | 'attack' | 'resistance'>): number {
  return clamp(skills.downhill * 0.7 + skills.sprint * 0.15 + skills.attack * 0.05 + skills.resistance * 0.1);
}

function calcOverall(skills: Pick<RiderSkills, 'flat' | 'mountain' | 'mediumMountain' | 'hill' | 'timeTrial' | 'cobble' | 'sprint' | 'stamina' | 'resistance' | 'recuperation'>): number {
  const includedSkills = [
    ['mountain', skills.mountain, 1.8],
    ['hill', skills.hill, 1],
    ['sprint', skills.sprint, 1],
    ['timeTrial', skills.timeTrial, 2 / 3],
    ['cobble', skills.cobble, 4 / 5],
    ['mediumMountain', skills.mediumMountain, 0.2],
    ['stamina', skills.stamina, 0.1],
    ['resistance', skills.resistance, 0.1],
    ['recuperation', skills.recuperation, 0.1],
    ['flat', skills.flat, 0.15],
  ] as const;

  const weightedTotal = includedSkills.reduce((sum, [, value, weight]) => sum + value * weight, 0);

  let topSkillValue = -Infinity;
  let secondSkillValue = -Infinity;

  for (const [, value] of includedSkills) {
    if (value > topSkillValue) {
      secondSkillValue = topSkillValue;
      topSkillValue = value;
      continue;
    }

    if (value > secondSkillValue) {
      secondSkillValue = value;
    }
  }

  const bonusTotal = topSkillValue * 1.5 + secondSkillValue * 1.25;
  const totalWeight = 1.8 + 1 + 1 + (2 / 3) + (4 / 5) + 0.2 + 0.1 + 0.1 + 0.1 + 0.15 + 1.5 + 1.25;
  return clamp(Math.round((weightedTotal + bonusTotal) / totalWeight));
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

function isoDate(value: string, ctx: string): string {
  if (!ISO_DATE_PATTERN.test(value)) {
    throw new Error(`${ctx}: ISO-Datum YYYY-MM-DD erwartet, erhalten "${value}".`);
  }
  return value;
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

type TeamRoleName = 'Kapitaen' | 'Co-Kapitaen' | 'Edelhelfer' | 'Starke Helfer' | 'Wassertraeger' | 'Sprinter';

interface RoleSeed {
  id: number;
  name: TeamRoleName;
  weighting: number;
}

interface ContractSeed {
  riderId: number;
  teamId: number;
  startSeason: number;
  endSeason: number;
  status: ContractStatus;
}

interface TypeRiderSeed {
  id: number;
  key: RiderSpecialization;
  displayName: string;
  isStageFocus: number;
  isOneDayFocus: number;
}

interface RaceCategoryBonusSeed {
  id: number;
  name: string;
  bonusSecondsFinal: string;
  bonusSecondsIntermediate: string;
  pointsStage: string;
  pointsOneDay: string;
  pointsGcFinal: string;
  pointsJerseyLeaderDay: number;
  pointsJerseySprintDay: number;
  pointsJerseyMountainDay: number;
  pointsJerseyYouthDay: number;
  pointsSprintIntermediate: string;
  pointsMountainHc: string;
  pointsMountainCat1: string;
  pointsMountainCat2: string;
  pointsMountainCat3: string;
  pointsMountainCat4: string;
  pointsJerseySprintFinal: string;
  pointsJerseyMountainFinal: string;
  pointsJerseyYouthFinal: string;
}

interface RaceCategorySeed {
  id: number;
  name: string;
  tier: RaceCategoryTier;
  numberOfTeams: number;
  numberOfRiders: number;
  bonusSystemId: number;
}

interface RaceSeed {
  id: number;
  name: string;
  countryId: number;
  categoryId: number;
  isStageRace: number;
  numberOfStages: number;
  startDate: string;
  endDate: string;
  prestige: number;
}

interface StageSeed {
  id: number;
  raceId: number;
  stageNumber: number;
  date: string;
  profile: StageProfile;
  detailsCsvFile: string;
}

const STAGE_PROFILES: StageProfile[] = [
  'Flat',
  'Rolling',
  'Hilly',
  'Hilly_Difficult',
  'Medium_Mountain',
  'Mountain',
  'High_Mountain',
  'ITT',
  'TTT',
  'Cobble',
  'Cobble_Hill',
];

const ROLE_NAME_CAPTAIN: TeamRoleName = 'Kapitaen';
const ROLE_NAME_CO_CAPTAIN: TeamRoleName = 'Co-Kapitaen';
const ROLE_NAME_ROAD_CAPTAIN: TeamRoleName = 'Edelhelfer';
const ROLE_NAME_STRONG_HELPER: TeamRoleName = 'Starke Helfer';
const ROLE_NAME_DOMESTIQUE: TeamRoleName = 'Wassertraeger';
const ROLE_NAME_SPRINTER: TeamRoleName = 'Sprinter';

const REQUIRED_ROLE_NAMES: TeamRoleName[] = [
  ROLE_NAME_CAPTAIN,
  ROLE_NAME_CO_CAPTAIN,
  ROLE_NAME_ROAD_CAPTAIN,
  ROLE_NAME_STRONG_HELPER,
  ROLE_NAME_DOMESTIQUE,
  ROLE_NAME_SPRINTER,
];

function parseRoleSeeds(): RoleSeed[] {
  return readCsv('sta_role.csv').map((row, index) => {
    const ctx = `sta_role.csv Zeile ${index + 2}`;
    const name = req(row, 'name', ctx) as TeamRoleName;
    if (!REQUIRED_ROLE_NAMES.includes(name)) {
      throw new Error(`${ctx}: Unbekannte Rolle "${name}".`);
    }
    return {
      id: int(req(row, 'id', ctx), ctx),
      name,
      weighting: int(req(row, 'weighting', ctx), ctx),
    };
  });
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

function parseContractSeeds(): ContractSeed[] {
  return readCsv('contracts.csv').map((row, index) => {
    const ctx = `contracts.csv Zeile ${index + 2}`;
    const status = req(row, 'status', ctx) as ContractStatus;
    if (!['active', 'expired', 'future'].includes(status)) {
      throw new Error(`${ctx}: Ungueltiger Vertragsstatus "${status}".`);
    }

    const startSeason = int(req(row, 'start_season', ctx), ctx);
    const endSeason = int(req(row, 'end_season', ctx), ctx);
    if (endSeason < startSeason) {
      throw new Error(`${ctx}: end_season muss >= start_season sein.`);
    }

    return {
      riderId: int(req(row, 'rider_id', ctx), ctx),
      teamId: int(req(row, 'team_id', ctx), ctx),
      startSeason,
      endSeason,
      status,
    };
  });
}

function parseTypeRiderSeeds(): TypeRiderSeed[] {
  return readCsv('type_rider.csv').map((row, index) => {
    const ctx = `type_rider.csv Zeile ${index + 2}`;
    const key = req(row, 'key', ctx) as RiderSpecialization;
    const supportedKeys: RiderSpecialization[] = [
      'Berg',
      'Hill',
      'Sprint',
      'Timetrial',
      'Cobble',
      'Attacker',
    ];
    if (!supportedKeys.includes(key)) {
      throw new Error(`${ctx}: Unbekannter rider_type key "${key}".`);
    }

    return {
      id: int(req(row, 'id', ctx), ctx),
      key,
      displayName: req(row, 'display_name', ctx),
      isStageFocus: boolFlag(req(row, 'is_stage_focus', ctx), ctx),
      isOneDayFocus: boolFlag(req(row, 'is_one_day_focus', ctx), ctx),
    };
  });
}

function parseRaceCategoryBonusSeeds(): RaceCategoryBonusSeed[] {
  return readCsv('race_categories_bonus.csv').map((row, index) => {
    const ctx = `race_categories_bonus.csv Zeile ${index + 2}`;
    return {
      id: int(req(row, 'id', ctx), ctx),
      name: req(row, 'name', ctx),
      bonusSecondsFinal: req(row, 'bonus_seconds_final', ctx),
      bonusSecondsIntermediate: req(row, 'bonus_seconds_intermediate', ctx),
      pointsStage: req(row, 'points_stage', ctx),
      pointsOneDay: req(row, 'points_one_day', ctx),
      pointsGcFinal: req(row, 'points_gc_final', ctx),
      pointsJerseyLeaderDay: int(req(row, 'points_jersey_leader_day', ctx), ctx),
      pointsJerseySprintDay: int(req(row, 'points_jersey_sprint_day', ctx), ctx),
      pointsJerseyMountainDay: int(req(row, 'points_jersey_mountain_day', ctx), ctx),
      pointsJerseyYouthDay: int(req(row, 'points_jersey_youth_day', ctx), ctx),
      pointsSprintIntermediate: req(row, 'points_sprint_intermediate', ctx),
      pointsMountainHc: req(row, 'points_mountain_hc', ctx),
      pointsMountainCat1: req(row, 'points_mountain_cat1', ctx),
      pointsMountainCat2: req(row, 'points_mountain_cat2', ctx),
      pointsMountainCat3: req(row, 'points_mountain_cat3', ctx),
      pointsMountainCat4: req(row, 'points_mountain_cat4', ctx),
      pointsJerseySprintFinal: req(row, 'points_jersey_sprint_final', ctx),
      pointsJerseyMountainFinal: req(row, 'points_jersey_mountain_final', ctx),
      pointsJerseyYouthFinal: req(row, 'points_jersey_youth_final', ctx),
    };
  });
}

function parseRaceCategorySeeds(): RaceCategorySeed[] {
  return readCsv('race_categories.csv').map((row, index) => {
    const ctx = `race_categories.csv Zeile ${index + 2}`;
    const tier = int(req(row, 'tier', ctx), ctx);
    if (![1, 2, 3].includes(tier)) {
      throw new Error(`${ctx}: tier muss 1, 2 oder 3 sein.`);
    }

    return {
      id: int(req(row, 'id', ctx), ctx),
      name: req(row, 'name', ctx),
      tier: tier as RaceCategoryTier,
      numberOfTeams: int(req(row, 'number_of_teams', ctx), ctx),
      numberOfRiders: int(req(row, 'number_of_riders', ctx), ctx),
      bonusSystemId: int(req(row, 'bonus_system_id', ctx), ctx),
    };
  });
}

function parseRaceSeeds(): RaceSeed[] {
  return readCsv('races.csv').map((row, index) => {
    const ctx = `races.csv Zeile ${index + 2}`;
    const startDate = isoDate(req(row, 'start_date', ctx), ctx);
    const endDate = isoDate(req(row, 'end_date', ctx), ctx);
    if (endDate < startDate) {
      throw new Error(`${ctx}: end_date muss >= start_date sein.`);
    }

    return {
      id: int(req(row, 'id', ctx), ctx),
      name: req(row, 'name', ctx),
      countryId: int(req(row, 'country_id', ctx), ctx),
      categoryId: int(req(row, 'category_id', ctx), ctx),
      isStageRace: boolFlag(req(row, 'is_stage_race', ctx), ctx),
      numberOfStages: int(req(row, 'number_of_stages', ctx), ctx),
      startDate,
      endDate,
      prestige: int(req(row, 'prestige', ctx), ctx),
    };
  });
}

function parseStageSeeds(): StageSeed[] {
  return readCsv('stages.csv').map((row, index) => {
    const ctx = `stages.csv Zeile ${index + 2}`;
    const profile = req(row, 'profile', ctx) as StageProfile;
    if (!STAGE_PROFILES.includes(profile)) {
      throw new Error(`${ctx}: Ungueltiges Stage-Profil "${profile}".`);
    }

    const detailsCsvFile = req(row, 'details_csv_file', ctx);
    if (detailsCsvFile.includes('/') || detailsCsvFile.includes('\\')) {
      throw new Error(`${ctx}: details_csv_file darf keinen Pfad enthalten.`);
    }
    if (!fs.existsSync(path.join(STAGES_DIR, detailsCsvFile))) {
      throw new Error(`${ctx}: Stage-Datei fehlt unter data/stages/${detailsCsvFile}.`);
    }

    return {
      id: int(req(row, 'id', ctx), ctx),
      raceId: int(req(row, 'race_id', ctx), ctx),
      stageNumber: int(req(row, 'stage_number', ctx), ctx),
      date: isoDate(req(row, 'date', ctx), ctx),
      profile,
      detailsCsvFile,
    };
  });
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

const RIDER_IMPORTED_SKILL_COLUMNS = RIDER_SKILL_COLUMNS.filter(([key]) => key !== 'bikeHandling');

interface RiderSeedInput {
  riderId: number;
  firstName: string;
  lastName: string;
  countryId: number;
  birthYear: number;
  activeTeamId: number;
  skills: RiderSkills;
  favoriteRaces: string;
  nonFavoriteRaces: string;
}

interface RiderSeed extends RiderSeedInput {
  roleId: number | null;
  potentials: RiderPotentials;
  overallRating: number;
  potential: number;
  peakAge: number;
  declineAge: number;
  retirementAge: number;
  skillDevelopment: number;
  riderType: RiderSpecialization;
  specialization1: RiderSpecialization | null;
  specialization2: RiderSpecialization | null;
  specialization3: RiderSpecialization | null;
  isStageRacer: number;
  isOneDayRacer: number;
  hasGrandTourTag: number;
  hasStageRaceTag: number;
  hasOneDayClassicTag: number;
}

interface AssignedRiderType extends RiderTagFlags {
  potentials: RiderPotentials;
  overallRating: number;
  potential: number;
  peakAge: number;
  declineAge: number;
  retirementAge: number;
  skillDevelopment: number;
  riderType: RiderSpecialization;
  specialization1: RiderSpecialization | null;
  specialization2: RiderSpecialization | null;
  specialization3: RiderSpecialization | null;
  isStageRacer: number;
  isOneDayRacer: number;
}

function buildRoleMaps(roleSeeds: RoleSeed[]): {
  idByName: Map<TeamRoleName, number>;
  weightingByName: Map<TeamRoleName, number>;
} {
  const idByName = new Map<TeamRoleName, number>();
  const weightingByName = new Map<TeamRoleName, number>();

  for (const role of roleSeeds) {
    if (idByName.has(role.name)) throw new Error(`Doppelte Rollenbezeichnung ${role.name} in sta_role.csv.`);
    idByName.set(role.name, role.id);
    weightingByName.set(role.name, role.weighting);
  }

  for (const requiredRoleName of REQUIRED_ROLE_NAMES) {
    if (!idByName.has(requiredRoleName)) throw new Error(`Pflichtrolle ${requiredRoleName} fehlt in sta_role.csv.`);
  }

  return { idByName, weightingByName };
}

function getRoleScore(rider: RiderSeedInput): number {
  return (
    rider.skills.mountain * 2
    + rider.skills.hill
    + rider.skills.sprint
    + rider.skills.timeTrial
    + rider.skills.cobble
  ) / 6;
}

function getRoundedRoleCount(teamSize: number, percentage: number): number {
  return Math.max(0, Math.round(teamSize * (percentage / 100)));
}

function compareByRoleRanking(left: RiderSeedInput, right: RiderSeedInput): number {
  return getRoleScore(right) - getRoleScore(left)
    || right.skills.sprint - left.skills.sprint
    || left.riderId - right.riderId;
}

function compareBySprintRanking(left: RiderSeedInput, right: RiderSeedInput): number {
  return right.skills.sprint - left.skills.sprint
    || getRoleScore(right) - getRoleScore(left)
    || left.riderId - right.riderId;
}

function assignTeamRoleIds(riders: RiderSeedInput[], roleSeeds: RoleSeed[]): Map<number, number> {
  const { idByName, weightingByName } = buildRoleMaps(roleSeeds);
  const riderRoleIds = new Map<number, number>();
  const ridersByTeam = new Map<number, RiderSeedInput[]>();

  for (const rider of riders) {
    const teamRiders = ridersByTeam.get(rider.activeTeamId) ?? [];
    teamRiders.push(rider);
    ridersByTeam.set(rider.activeTeamId, teamRiders);
  }

  for (const teamRiders of ridersByTeam.values()) {
    const teamSize = teamRiders.length;
    const availableRiders = [...teamRiders].sort(compareByRoleRanking);
    const captainCount = Math.min(
      teamSize,
      teamSize >= 25
        ? Math.max(getRoundedRoleCount(teamSize, weightingByName.get(ROLE_NAME_CAPTAIN) ?? 0), 3)
        : getRoundedRoleCount(teamSize, weightingByName.get(ROLE_NAME_CAPTAIN) ?? 0),
    );

    const captainIds = new Set<number>();
    const coCaptainIds = new Set<number>();
    const sprinterIds = new Set<number>();

    for (const rider of availableRiders.slice(0, captainCount)) {
      riderRoleIds.set(rider.riderId, idByName.get(ROLE_NAME_CAPTAIN)!);
      captainIds.add(rider.riderId);
    }

    const coCaptainCount = Math.min(
      teamSize - captainIds.size,
      teamSize >= 25
        ? Math.max(getRoundedRoleCount(teamSize, weightingByName.get(ROLE_NAME_CO_CAPTAIN) ?? 0), 3)
        : getRoundedRoleCount(teamSize, weightingByName.get(ROLE_NAME_CO_CAPTAIN) ?? 0),
    );

    const coCaptainPool = availableRiders.filter(rider => !captainIds.has(rider.riderId));
    for (const rider of coCaptainPool.slice(0, coCaptainCount)) {
      riderRoleIds.set(rider.riderId, idByName.get(ROLE_NAME_CO_CAPTAIN)!);
      coCaptainIds.add(rider.riderId);
    }

    const sprintPool = [...teamRiders]
      .filter(rider => !captainIds.has(rider.riderId) && !coCaptainIds.has(rider.riderId) && rider.skills.sprint > 70)
      .sort(compareBySprintRanking)
      .slice(0, 5);

    for (const rider of sprintPool) {
      riderRoleIds.set(rider.riderId, idByName.get(ROLE_NAME_SPRINTER)!);
      sprinterIds.add(rider.riderId);
    }

    const helperPool = availableRiders.filter(
      rider => !captainIds.has(rider.riderId) && !coCaptainIds.has(rider.riderId) && !sprinterIds.has(rider.riderId),
    );

    const roadCaptainCount = Math.min(helperPool.length, getRoundedRoleCount(teamSize, weightingByName.get(ROLE_NAME_ROAD_CAPTAIN) ?? 0));
    const roadCaptainRiders = helperPool.slice(0, roadCaptainCount);
    for (const rider of roadCaptainRiders) {
      riderRoleIds.set(rider.riderId, idByName.get(ROLE_NAME_ROAD_CAPTAIN)!);
    }

    const strongHelperPool = helperPool.slice(roadCaptainCount);
    const strongHelperCount = Math.min(strongHelperPool.length, getRoundedRoleCount(teamSize, weightingByName.get(ROLE_NAME_STRONG_HELPER) ?? 0));
    const strongHelperRiders = strongHelperPool.slice(0, strongHelperCount);
    for (const rider of strongHelperRiders) {
      riderRoleIds.set(rider.riderId, idByName.get(ROLE_NAME_STRONG_HELPER)!);
    }

    const domestiquePool = strongHelperPool.slice(strongHelperCount);
    for (const rider of domestiquePool) {
      riderRoleIds.set(rider.riderId, idByName.get(ROLE_NAME_DOMESTIQUE)!);
    }
  }

  return riderRoleIds;
}

function scoreProfile(skills: RiderSkills, weights: Array<[RiderSkillKey, number]>): number {
  return weights.reduce((sum, [key, weight]) => sum + skills[key] * weight, 0);
}

function buildAgeProfile(): { peakAge: number; declineAge: number; retirementAge: number } {
  const peakAge = rand(24, 28);
  const declineAge = rand(Math.max(peakAge + 1, 26), 32);
  const retirementAge = rand(Math.max(declineAge + 1, 32), 38);
  return { peakAge, declineAge, retirementAge };
}

function buildPotentials(skills: RiderSkills, age: number, skillDevelopment: number): RiderPotentials {
  if (age >= 26) {
    return Object.fromEntries(RIDER_SKILL_COLUMNS.map(([key]) => [key, skills[key]])) as RiderPotentials;
  }

  const ageFactor = Math.max(0.15, (26 - age) / 8);
  const developmentFactor = skillDevelopment / 20;
  const entries = RIDER_SKILL_COLUMNS.map(([key]) => {
    const current = skills[key];
    const headroom = Math.max(0, RIDER_STAT_MAX - current);
    if (headroom <= 0.01) return [key, current];
    const growthBase = headroom * (0.14 + ageFactor * 0.24 + developmentFactor * 0.22);
    const growth = Math.max(Math.min(headroom, growthBase * randomBetween(0.75, 1.25)), Math.min(headroom, 0.25));
    return [key, clamp(current + growth)];
  });
  return Object.fromEntries(entries) as RiderPotentials;
}

function buildHybridSkills(skills: RiderSkills, potentials: RiderPotentials): RiderSkills {
  const entries = RIDER_SKILL_COLUMNS.map(([key]) => {
    const baseValue = skills[key];
    const potentialValue = potentials[key];
    return [key, clamp(baseValue * 0.65 + potentialValue * 0.35)];
  });
  return Object.fromEntries(entries) as RiderSkills;
}

function getSpecializationScores(skills: RiderSkills): Array<{ specialization: RiderSpecialization; score: number }> {
  const scores: Array<{ specialization: RiderSpecialization; score: number }> = [
    { specialization: 'Berg', score: scoreProfile(skills, [['mountain', 0.4], ['mediumMountain', 0.2], ['stamina', 0.15], ['attack', 0.15], ['downhill', 0.1]]) },
    { specialization: 'Hill', score: scoreProfile(skills, [['hill', 0.35], ['acceleration', 0.2], ['mediumMountain', 0.15], ['attack', 0.15], ['bikeHandling', 0.15]]) },
    { specialization: 'Sprint', score: scoreProfile(skills, [['sprint', 0.4], ['acceleration', 0.25], ['flat', 0.15], ['bikeHandling', 0.1], ['resistance', 0.1]]) },
    { specialization: 'Timetrial', score: scoreProfile(skills, [['timeTrial', 0.5], ['prologue', 0.2], ['flat', 0.1], ['resistance', 0.1], ['bikeHandling', 0.1]]) },
    { specialization: 'Cobble', score: scoreProfile(skills, [['cobble', 0.4], ['flat', 0.2], ['resistance', 0.15], ['bikeHandling', 0.15], ['hill', 0.1]]) },
    { specialization: 'Attacker', score: scoreProfile(skills, [['attack', 0.35], ['acceleration', 0.2], ['hill', 0.15], ['mediumMountain', 0.15], ['resistance', 0.15]]) },
  ];
  return scores.sort((left, right) => right.score - left.score);
}

function assignRiderType(input: Pick<RiderSeedInput, 'skills' | 'birthYear'>, currentSeason: number): AssignedRiderType {
  const { skills } = input;
  const age = currentSeason - input.birthYear;
  const skillDevelopment = rand(1, 20);
  const { peakAge, declineAge, retirementAge } = buildAgeProfile();
  const potentials = buildPotentials(skills, age, skillDevelopment);
  const hybridSkills = buildHybridSkills(skills, potentials);
  const specializationScores = getSpecializationScores(hybridSkills);
  const [first, second, third] = specializationScores;
  const topThree = specializationScores.slice(0, 3).map(entry => entry.specialization);
  const tags = deriveRiderTags(topThree, skills.recuperation);
  return {
    potentials,
    overallRating: calcOverall(skills),
    potential: calcOverall(potentials),
    peakAge,
    declineAge,
    retirementAge,
    skillDevelopment,
    riderType: first.specialization,
    specialization1: first?.specialization ?? null,
    specialization2: second?.specialization ?? null,
    specialization3: third?.specialization ?? null,
    ...tags,
  };
}

function parseRiderSeeds(): RiderSeedInput[] {
  return readCsv('riders.csv').map((row, index) => {
    const ctx = `riders.csv Zeile ${index + 2}`;
    const importedSkills = Object.fromEntries(
      RIDER_IMPORTED_SKILL_COLUMNS.map(([key, column]) => [key, clamp(int(req(row, `skill_${column}`, ctx), ctx))]),
    ) as Omit<RiderSkills, 'bikeHandling'>;
    const skills: RiderSkills = {
      ...importedSkills,
      bikeHandling: calcBikeHandling(importedSkills),
    };

    return {
      riderId: int(req(row, 'rider_id', ctx), ctx),
      firstName: req(row, 'first_name', ctx),
      lastName: req(row, 'last_name', ctx),
      countryId: int(req(row, 'country_id', ctx), ctx),
      birthYear: int(req(row, 'birth_year', ctx), ctx),
      activeTeamId: int(req(row, 'team_id', ctx), ctx),
      skills,
      favoriteRaces: normalizeIdList(row['favorite_races'] ?? ''),
      nonFavoriteRaces: normalizeIdList(row['non_favorite_races'] ?? ''),
    };
  });
}

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
  const roleSeeds = parseRoleSeeds();
  const typeRiderSeeds = parseTypeRiderSeeds();
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

  const seenRoleIds = new Set<number>();
  const insRole = db.prepare(
    'INSERT INTO sta_role (id, name, weighting) VALUES (?, ?, ?)',
  );
  for (const role of roleSeeds) {
    if (role.id <= 0) throw new Error(`Role-ID ${role.id} muss positiv sein.`);
    if (seenRoleIds.has(role.id)) throw new Error(`Doppelte Role-ID ${role.id} in sta_role.csv.`);
    seenRoleIds.add(role.id);
    insRole.run(role.id, role.name, role.weighting);
  }

  const seenTypeRiderIds = new Set<number>();
  const seenTypeRiderKeys = new Set<RiderSpecialization>();
  const typeRiderIdByKey = new Map<RiderSpecialization, number>();
  const insTypeRider = db.prepare(
    'INSERT INTO type_rider (id, type_key, display_name, is_stage_focus, is_one_day_focus) VALUES (?, ?, ?, ?, ?)',
  );
  for (const typeRider of typeRiderSeeds) {
    if (typeRider.id <= 0) throw new Error(`Type-Rider-ID ${typeRider.id} muss positiv sein.`);
    if (seenTypeRiderIds.has(typeRider.id)) throw new Error(`Doppelte Type-Rider-ID ${typeRider.id} in type_rider.csv.`);
    if (seenTypeRiderKeys.has(typeRider.key)) throw new Error(`Doppelter rider_type key ${typeRider.key} in type_rider.csv.`);
    seenTypeRiderIds.add(typeRider.id);
    seenTypeRiderKeys.add(typeRider.key);
    typeRiderIdByKey.set(typeRider.key, typeRider.id);
    insTypeRider.run(typeRider.id, typeRider.key, typeRider.displayName, typeRider.isStageFocus, typeRider.isOneDayFocus);
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
    if (team.divisionName === 'U23') throw new Error(`U23-Teams werden nicht mehr unterstützt: "${team.name}".`);
    for (const focusId of [team.aiFocus1, team.aiFocus2, team.aiFocus3]) {
      if (!seenTypeRiderIds.has(focusId)) throw new Error(`Unbekannte ai_focus-ID ${focusId} für Team "${team.name}".`);
    }
    usedTeamIds.add(team.teamId);
  }

  const insTeam = db.prepare(
    `INSERT INTO teams (id, name, abbreviation, division_id, u23_team, is_player_team, country_id, color_primary, color_secondary, ai_focus_1, ai_focus_2, ai_focus_3)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  for (const t of teamSeeds) {
    const divId = divMap.get(t.divisionName);
    if (divId == null) throw new Error(`Unbekannte Division "${t.divisionName}" für Team "${t.name}".`);
    insTeam.run(t.teamId, t.name, t.abbreviation, divId, null, t.isPlayerTeam, t.countryId, t.colorPrimary, t.colorSecondary, t.aiFocus1, t.aiFocus2, t.aiFocus3);
  }
  console.log(`  ${teamSeeds.length} Profiteams eingefügt.`);

  // Fahrer aus CSV
  const riderSeeds = parseRiderSeeds();
  const contractSeeds = parseContractSeeds();
  const teamRoleIds = assignTeamRoleIds(riderSeeds, roleSeeds);
  const seededRiders = riderSeeds.map(rider => ({
    ...rider,
    roleId: teamRoleIds.get(rider.riderId) ?? null,
    ...assignRiderType({ skills: rider.skills, birthYear: rider.birthYear }, currentSeason),
  }));
  const knownTeamIds = new Set((db.prepare('SELECT id FROM teams').all() as Array<{ id: number }>).map(team => team.id));
  const knownRiderIds = new Set(riderSeeds.map(rider => rider.riderId));
  const usedRiderIds = new Set<number>();
  const usedContractKeys = new Set<string>();

  const riderColumns = RIDER_SKILL_COLUMNS.map(([, column]) => `skill_${column}`).join(', ');
  const riderPotentialColumns = RIDER_SKILL_COLUMNS.map(([, column]) => `pot_${column}`).join(', ');
  const riderPlaceholders = RIDER_SKILL_COLUMNS.map(() => '?').join(', ');
  const riderPotentialPlaceholders = RIDER_SKILL_COLUMNS.map(() => '?').join(', ');
  const insRider = db.prepare(`
    INSERT INTO riders (
      id, first_name, last_name, country_id, role_id, birth_year, peak_age, decline_age, retirement_age, skill_development, pot_overall, overall_rating,
      ${riderColumns},
      ${riderPotentialColumns},
      rider_type_id, specialization_1_id, specialization_2_id, specialization_3_id,
      is_stage_racer, is_one_day_racer, has_grand_tour_tag, has_stage_race_tag, has_one_day_classic_tag, favorite_races, non_favorite_races,
      active_team_id, active_contract_id, is_retired
    )
    VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ${riderPlaceholders},
      ${riderPotentialPlaceholders},
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);
  for (const rider of seededRiders) {
    if (usedRiderIds.has(rider.riderId)) throw new Error(`Doppelte rider_id ${rider.riderId} in riders.csv.`);
    if (!knownTeamIds.has(rider.activeTeamId)) throw new Error(`Unbekannte team_id ${rider.activeTeamId} für Fahrer ${rider.firstName} ${rider.lastName}.`);
    if (!seenCountryIds.has(rider.countryId)) throw new Error(`Unbekannte country_id ${rider.countryId} für Fahrer ${rider.firstName} ${rider.lastName}.`);
    usedRiderIds.add(rider.riderId);

    const skillValues = RIDER_SKILL_COLUMNS.map(([key]) => rider.skills[key]);
    const potentialValues = RIDER_SKILL_COLUMNS.map(([key]) => rider.potentials[key]);
    const riderTypeId = typeRiderIdByKey.get(rider.riderType);
    const specialization1Id = rider.specialization1 == null ? null : typeRiderIdByKey.get(rider.specialization1);
    const specialization2Id = rider.specialization2 == null ? null : typeRiderIdByKey.get(rider.specialization2);
    const specialization3Id = rider.specialization3 == null ? null : typeRiderIdByKey.get(rider.specialization3);
    if (riderTypeId == null) throw new Error(`Kein rider_type Mapping für ${rider.riderType} bei Fahrer ${rider.firstName} ${rider.lastName}.`);
    if (rider.specialization1 != null && specialization1Id == null) throw new Error(`Kein specialization_1 Mapping für ${rider.specialization1} bei Fahrer ${rider.firstName} ${rider.lastName}.`);
    if (rider.specialization2 != null && specialization2Id == null) throw new Error(`Kein specialization_2 Mapping für ${rider.specialization2} bei Fahrer ${rider.firstName} ${rider.lastName}.`);
    if (rider.specialization3 != null && specialization3Id == null) throw new Error(`Kein specialization_3 Mapping für ${rider.specialization3} bei Fahrer ${rider.firstName} ${rider.lastName}.`);
    insRider.run(
      rider.riderId,
      rider.firstName,
      rider.lastName,
      rider.countryId,
      rider.roleId,
      rider.birthYear,
      rider.peakAge,
      rider.declineAge,
      rider.retirementAge,
      rider.skillDevelopment,
      rider.potential,
      rider.overallRating,
      ...skillValues,
      ...potentialValues,
      riderTypeId,
      specialization1Id,
      specialization2Id,
      specialization3Id,
      rider.isStageRacer,
      rider.isOneDayRacer,
      rider.hasGrandTourTag,
      rider.hasStageRaceTag,
      rider.hasOneDayClassicTag,
      rider.favoriteRaces,
      rider.nonFavoriteRaces,
      null,
      null,
      0,
    );
  }

  const insContract = db.prepare(
    'INSERT INTO contracts (rider_id, team_id, start_season, end_season, status) VALUES (?, ?, ?, ?, ?)',
  );

  for (const contract of contractSeeds) {
    if (!knownRiderIds.has(contract.riderId)) {
      throw new Error(`Unbekannte rider_id ${contract.riderId} in contracts.csv.`);
    }
    if (!knownTeamIds.has(contract.teamId)) {
      throw new Error(`Unbekannte team_id ${contract.teamId} in contracts.csv fuer rider_id ${contract.riderId}.`);
    }

    const contractKey = `${contract.riderId}:${contract.startSeason}`;
    if (usedContractKeys.has(contractKey)) {
      throw new Error(`Doppelter Vertrag fuer rider_id ${contract.riderId} und start_season ${contract.startSeason} in contracts.csv.`);
    }
    usedContractKeys.add(contractKey);

    insContract.run(contract.riderId, contract.teamId, contract.startSeason, contract.endSeason, contract.status);
  }

  new ContractService(db).checkContractStatuses(currentSeason);
  console.log(`  ${seededRiders.length} Fahrer eingefügt.`);

  const raceCategoryBonusSeeds = parseRaceCategoryBonusSeeds();
  const raceCategorySeeds = parseRaceCategorySeeds();
  const raceSeeds = parseRaceSeeds();
  const stageSeeds = parseStageSeeds();

  const knownBonusIds = new Set<number>();
  const insRaceCategoryBonus = db.prepare(
    `INSERT INTO race_categories_bonus (
      id, name, bonus_seconds_final, bonus_seconds_intermediate, points_stage, points_one_day, points_gc_final,
      points_jersey_leader_day, points_jersey_sprint_day, points_jersey_mountain_day, points_jersey_youth_day,
      points_sprint_intermediate, points_mountain_hc, points_mountain_cat1, points_mountain_cat2, points_mountain_cat3, points_mountain_cat4,
      points_jersey_sprint_final, points_jersey_mountain_final, points_jersey_youth_final
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const bonus of raceCategoryBonusSeeds) {
    if (bonus.id <= 0) throw new Error(`RaceCategoryBonus-ID ${bonus.id} muss positiv sein.`);
    if (knownBonusIds.has(bonus.id)) throw new Error(`Doppelte race_categories_bonus id ${bonus.id}.`);
    knownBonusIds.add(bonus.id);
    insRaceCategoryBonus.run(
      bonus.id,
      bonus.name,
      bonus.bonusSecondsFinal,
      bonus.bonusSecondsIntermediate,
      bonus.pointsStage,
      bonus.pointsOneDay,
      bonus.pointsGcFinal,
      bonus.pointsJerseyLeaderDay,
      bonus.pointsJerseySprintDay,
      bonus.pointsJerseyMountainDay,
      bonus.pointsJerseyYouthDay,
      bonus.pointsSprintIntermediate,
      bonus.pointsMountainHc,
      bonus.pointsMountainCat1,
      bonus.pointsMountainCat2,
      bonus.pointsMountainCat3,
      bonus.pointsMountainCat4,
      bonus.pointsJerseySprintFinal,
      bonus.pointsJerseyMountainFinal,
      bonus.pointsJerseyYouthFinal,
    );
  }

  const knownRaceCategoryIds = new Set<number>();
  const insRaceCategory = db.prepare(
    'INSERT INTO race_categories (id, name, tier, number_of_teams, number_of_riders, bonus_system_id) VALUES (?, ?, ?, ?, ?, ?)',
  );
  for (const category of raceCategorySeeds) {
    if (category.id <= 0) throw new Error(`RaceCategory-ID ${category.id} muss positiv sein.`);
    if (knownRaceCategoryIds.has(category.id)) throw new Error(`Doppelte race_categories id ${category.id}.`);
    if (!knownBonusIds.has(category.bonusSystemId)) {
      throw new Error(`Unbekannte bonus_system_id ${category.bonusSystemId} fuer RaceCategory ${category.name}.`);
    }
    knownRaceCategoryIds.add(category.id);
    insRaceCategory.run(category.id, category.name, category.tier, category.numberOfTeams, category.numberOfRiders, category.bonusSystemId);
  }

  const knownRaceIds = new Set<number>();
  const insRace = db.prepare(
    'INSERT INTO races (id, name, country_id, category_id, is_stage_race, number_of_stages, start_date, end_date, prestige) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
  );
  for (const race of raceSeeds) {
    if (race.id <= 0) throw new Error(`Race-ID ${race.id} muss positiv sein.`);
    if (knownRaceIds.has(race.id)) throw new Error(`Doppelte races id ${race.id}.`);
    if (!seenCountryIds.has(race.countryId)) throw new Error(`Unbekannte country_id ${race.countryId} fuer Rennen ${race.name}.`);
    if (!knownRaceCategoryIds.has(race.categoryId)) throw new Error(`Unbekannte category_id ${race.categoryId} fuer Rennen ${race.name}.`);
    knownRaceIds.add(race.id);
    insRace.run(race.id, race.name, race.countryId, race.categoryId, race.isStageRace, race.numberOfStages, race.startDate, race.endDate, race.prestige);
  }

  const stageCountsByRace = new Map<number, number>();
  const usedStageIds = new Set<number>();
  const usedStageKeys = new Set<string>();
  const insStage = db.prepare(
    'INSERT INTO stages (id, race_id, stage_number, date, profile, details_csv_file) VALUES (?, ?, ?, ?, ?, ?)',
  );
  for (const stage of stageSeeds) {
    if (stage.id <= 0) throw new Error(`Stage-ID ${stage.id} muss positiv sein.`);
    if (usedStageIds.has(stage.id)) throw new Error(`Doppelte stages id ${stage.id}.`);
    if (!knownRaceIds.has(stage.raceId)) throw new Error(`Unbekannte race_id ${stage.raceId} in stages.csv.`);
    const stageKey = `${stage.raceId}:${stage.stageNumber}`;
    if (usedStageKeys.has(stageKey)) throw new Error(`Doppelte Stage-Nummer ${stage.stageNumber} fuer race_id ${stage.raceId}.`);
    usedStageIds.add(stage.id);
    usedStageKeys.add(stageKey);
    stageCountsByRace.set(stage.raceId, (stageCountsByRace.get(stage.raceId) ?? 0) + 1);
    insStage.run(stage.id, stage.raceId, stage.stageNumber, stage.date, stage.profile, stage.detailsCsvFile);
  }

  for (const race of raceSeeds) {
    const stageCount = stageCountsByRace.get(race.id) ?? 0;
    if (stageCount !== race.numberOfStages) {
      throw new Error(`Rennen ${race.name} erwartet ${race.numberOfStages} Stages, gefunden ${stageCount}.`);
    }
  }
  console.log(`  ${raceCategoryBonusSeeds.length} Bonus-Systeme, ${raceCategorySeeds.length} Kategorien, ${raceSeeds.length} Rennen und ${stageSeeds.length} Stages eingefügt.`);

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
