import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { Country, Race, RaceCategory, RaceCategoryBonus, RaceStageSummary, Rider, RiderPotentials, RiderSkillKey, RiderSkills, Role, Stage, Team } from '../../../shared/types';
import { summarizeStageProfile } from '../simulation/StageParser';

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

interface RiderRow {
  id: number;
  first_name: string;
  last_name: string;
  country_id: number;
  role_id: number | null;
  role_name: string | null;
  role_weighting: number | null;
  rider_type_id: number;
  rider_type: Rider['riderType'];
  specialization_1_id: number | null;
  country_name: string;
  country_code_3: Country['code3'];
  country_continent: string;
  country_regen_rating: number;
  country_number_regen_min: number;
  country_number_regen_max: number;
  birth_year: number;
  peak_age: number;
  decline_age: number;
  retirement_age: number;
  skill_development: number;
  pot_overall: number;
  overall_rating: number;
  skill_flat: number;
  skill_mountain: number;
  skill_medium_mountain: number;
  skill_hill: number;
  skill_time_trial: number;
  skill_prologue: number;
  skill_cobble: number;
  skill_sprint: number;
  skill_acceleration: number;
  skill_downhill: number;
  skill_attack: number;
  skill_stamina: number;
  skill_resistance: number;
  skill_recuperation: number;
  skill_bike_handling: number;
  pot_flat: number;
  pot_mountain: number;
  pot_medium_mountain: number;
  pot_hill: number;
  pot_time_trial: number;
  pot_prologue: number;
  pot_cobble: number;
  pot_sprint: number;
  pot_acceleration: number;
  pot_downhill: number;
  pot_attack: number;
  pot_stamina: number;
  pot_resistance: number;
  pot_recuperation: number;
  pot_bike_handling: number;
  specialization_1: Rider['specialization1'];
  specialization_2_id: number | null;
  specialization_2: Rider['specialization2'];
  specialization_3_id: number | null;
  specialization_3: Rider['specialization3'];
  is_stage_racer: number;
  is_one_day_racer: number;
  has_grand_tour_tag: number;
  has_stage_race_tag: number;
  has_one_day_classic_tag: number;
  favorite_races: string;
  non_favorite_races: string;
  active_team_id: number | null;
  active_contract_id: number | null;
  contract_end_season: number | null;
}

interface TeamRow {
  id: number;
  name: string;
  abbreviation: string;
  division_id: number;
  u23_team: number | null;
  main_team_id: number | null;
  is_player_team: number;
  country_id: number;
  country_name: string;
  country_code_3: Country['code3'];
  country_continent: string;
  country_regen_rating: number;
  country_number_regen_min: number;
  country_number_regen_max: number;
  color_primary: string;
  color_secondary: string;
  ai_focus_1: number;
  ai_focus_2: number;
  ai_focus_3: number;
  u23_team_name: string | null;
  main_team_name: string | null;
  division_name: string;
}

interface RaceRow {
  id: number;
  name: string;
  country_id: number;
  category_id: number;
  is_stage_race: number;
  number_of_stages: number;
  start_date: string;
  end_date: string;
  prestige: number;
  country_name: string;
  country_code_3: Country['code3'];
  country_continent: string;
  country_regen_rating: number;
  country_number_regen_min: number;
  country_number_regen_max: number;
  category_name: string;
  category_tier: RaceCategory['tier'];
  category_number_of_teams: number;
  category_number_of_riders: number;
  category_bonus_system_id: number;
  bonus_name: string;
  bonus_seconds_final: string;
  bonus_seconds_intermediate: string;
  points_stage: string;
  points_one_day: string;
  points_gc_final: string;
  points_jersey_leader_day: number;
  points_jersey_sprint_day: number;
  points_jersey_mountain_day: number;
  points_jersey_youth_day: number;
  points_sprint_intermediate: string;
  points_mountain_hc: string;
  points_mountain_cat1: string;
  points_mountain_cat2: string;
  points_mountain_cat3: string;
  points_mountain_cat4: string;
  points_jersey_sprint_final: string;
  points_jersey_mountain_final: string;
  points_jersey_youth_final: string;
}

interface StageRow {
  id: number;
  race_id: number;
  stage_number: number;
  date: string;
  profile: Stage['profile'];
  details_csv_file: string;
}

function resolveDataCsvDir(): string {
  const candidates = [
    path.resolve(__dirname, '..', '..', '..', 'data', 'csv'),
    path.resolve(__dirname, '..', '..', '..', '..', 'data', 'csv'),
    path.resolve(process.cwd(), 'data', 'csv'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'stages.csv'))) {
      return candidate;
    }
  }

  return candidates[0];
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

function parseRaceList(value: string): number[] {
  if (!value.trim()) return [];
  return value.split(',').map(part => Number.parseInt(part.trim(), 10)).filter(Number.isFinite);
}

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName) as { name: string } | undefined;
  return row != null;
}

function mapSkillObject<T extends RiderSkills | RiderPotentials>(row: RiderRow, prefix = ''): T {
  const entries = RIDER_SKILL_COLUMNS.map(([key, column]) => [key, row[`${prefix}${column}` as keyof RiderRow]]);
  return Object.fromEntries(entries) as T;
}

function mapCountry(row: Pick<RiderRow, 'country_id' | 'country_name' | 'country_code_3' | 'country_continent' | 'country_regen_rating' | 'country_number_regen_min' | 'country_number_regen_max'>): Country {
  return {
    id: row.country_id,
    name: row.country_name,
    code3: row.country_code_3,
    continent: row.country_continent,
    regenRating: row.country_regen_rating,
    numberRegenMin: row.country_number_regen_min,
    numberRegenMax: row.country_number_regen_max,
  };
}

function mapRole(row: Pick<RiderRow, 'role_id' | 'role_name' | 'role_weighting'>): Role | undefined {
  if (row.role_id == null || row.role_name == null || row.role_weighting == null) {
    return undefined;
  }

  return {
    id: row.role_id,
    name: row.role_name,
    weighting: row.role_weighting,
  };
}

function mapRider(row: RiderRow, currentYear: number): Rider {
  const country = mapCountry(row);
  const role = mapRole(row);
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    nationality: country.code3,
    countryId: country.id,
    country,
    riderTypeId: row.rider_type_id,
    specialization1Id: row.specialization_1_id,
    specialization2Id: row.specialization_2_id,
    specialization3Id: row.specialization_3_id,
    birthYear: row.birth_year,
    peakAge: row.peak_age,
    declineAge: row.decline_age,
    retirementAge: row.retirement_age,
    skillDevelopment: row.skill_development,
    roleId: row.role_id,
    role,
    age: currentYear - row.birth_year,
    potential: row.pot_overall,
    overallRating: row.overall_rating,
    skills: mapSkillObject<RiderSkills>(row, 'skill_'),
    potentials: mapSkillObject<RiderPotentials>(row, 'pot_'),
    riderType: row.rider_type,
    specialization1: row.specialization_1,
    specialization2: row.specialization_2,
    specialization3: row.specialization_3,
    isStageRacer: row.is_stage_racer === 1,
    isOneDayRacer: row.is_one_day_racer === 1,
    hasGrandTourTag: row.has_grand_tour_tag === 1,
    hasStageRaceTag: row.has_stage_race_tag === 1,
    hasOneDayClassicTag: row.has_one_day_classic_tag === 1,
    favoriteRaces: parseRaceList(row.favorite_races),
    nonFavoriteRaces: parseRaceList(row.non_favorite_races),
    activeTeamId: row.active_team_id,
    activeContractId: row.active_contract_id,
    contractEndSeason: row.contract_end_season,
  };
}

function mapTeam(row: TeamRow): Team {
  const country = mapCountry(row);
  return {
    id: row.id,
    name: row.name,
    abbreviation: row.abbreviation,
    divisionId: row.division_id,
    u23TeamId: row.u23_team,
    mainTeamId: row.main_team_id,
    isPlayerTeam: row.is_player_team === 1,
    countryCode: country.code3,
    countryId: country.id,
    country,
    colorPrimary: row.color_primary,
    colorSecondary: row.color_secondary,
    aiFocus1: row.ai_focus_1,
    aiFocus2: row.ai_focus_2,
    aiFocus3: row.ai_focus_3,
    u23TeamName: row.u23_team_name ?? undefined,
    mainTeamName: row.main_team_name ?? undefined,
    divisionName: row.division_name,
    shortName: row.abbreviation,
    nationality: country.code3,
    division: row.division_name as Team['division'],
  };
}

function mapRaceCategoryBonus(row: RaceRow): RaceCategoryBonus {
  return {
    id: row.category_bonus_system_id,
    name: row.bonus_name,
    bonusSecondsFinal: row.bonus_seconds_final,
    bonusSecondsIntermediate: row.bonus_seconds_intermediate,
    pointsStage: row.points_stage,
    pointsOneDay: row.points_one_day,
    pointsGcFinal: row.points_gc_final,
    pointsJerseyLeaderDay: row.points_jersey_leader_day,
    pointsJerseySprintDay: row.points_jersey_sprint_day,
    pointsJerseyMountainDay: row.points_jersey_mountain_day,
    pointsJerseyYouthDay: row.points_jersey_youth_day,
    pointsSprintIntermediate: row.points_sprint_intermediate,
    pointsMountainHc: row.points_mountain_hc,
    pointsMountainCat1: row.points_mountain_cat1,
    pointsMountainCat2: row.points_mountain_cat2,
    pointsMountainCat3: row.points_mountain_cat3,
    pointsMountainCat4: row.points_mountain_cat4,
    pointsJerseySprintFinal: row.points_jersey_sprint_final,
    pointsJerseyMountainFinal: row.points_jersey_mountain_final,
    pointsJerseyYouthFinal: row.points_jersey_youth_final,
  };
}

function mapRaceCategory(row: RaceRow): RaceCategory {
  const bonusSystem = mapRaceCategoryBonus(row);
  return {
    id: row.category_id,
    name: row.category_name,
    tier: row.category_tier,
    numberOfTeams: row.category_number_of_teams,
    numberOfRiders: row.category_number_of_riders,
    bonusSystemId: row.category_bonus_system_id,
    bonusSystem,
  };
}

function mapStage(row: StageRow): Stage {
  return {
    id: row.id,
    raceId: row.race_id,
    stageNumber: row.stage_number,
    date: row.date,
    profile: row.profile,
    detailsCsvFile: row.details_csv_file,
  };
}

function loadFallbackStages(raceIds: number[]): StageRow[] {
  if (raceIds.length === 0) return [];

  const filePath = path.join(resolveDataCsvDir(), 'stages.csv');
  if (!fs.existsSync(filePath)) return [];

  const lines = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  if (lines.length <= 1) return [];

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1)
    .map((line) => {
      const values = parseCsvLine(line);
      const record = headers.reduce<Record<string, string>>((acc, header, index) => {
        acc[header] = values[index] ?? '';
        return acc;
      }, {});
      return {
        id: Number(record['id']),
        race_id: Number(record['race_id']),
        stage_number: Number(record['stage_number']),
        date: record['date'] ?? '',
        profile: record['profile'] as Stage['profile'],
        details_csv_file: record['details_csv_file'] ?? '',
      } satisfies StageRow;
    })
    .filter((row) => raceIds.includes(row.race_id) && Number.isFinite(row.id) && Number.isFinite(row.race_id));
}

function mapRace(row: RaceRow, stages: Stage[]): Race {
  const country = mapCountry(row);
  const category = mapRaceCategory(row);
  return {
    id: row.id,
    name: row.name,
    countryId: row.country_id,
    categoryId: row.category_id,
    isStageRace: row.is_stage_race === 1,
    numberOfStages: row.number_of_stages,
    startDate: row.start_date,
    endDate: row.end_date,
    prestige: row.prestige,
    country,
    category,
    stages,
  };
}

function mapRaceWithSummary(row: RaceRow, stages: Stage[], upcomingStage: RaceStageSummary | undefined): Race {
  return {
    ...mapRace(row, stages),
    ...(upcomingStage ? { upcomingStage } : {}),
  };
}

function buildRaceSelect(): string {
  return `
    SELECT races.*,
           country.name AS country_name,
           country.code_3 AS country_code_3,
           country.continent AS country_continent,
           country.regen_rating AS country_regen_rating,
           country.number_regen_min AS country_number_regen_min,
           country.number_regen_max AS country_number_regen_max,
           race_categories.name AS category_name,
           race_categories.tier AS category_tier,
           race_categories.number_of_teams AS category_number_of_teams,
           race_categories.number_of_riders AS category_number_of_riders,
           race_categories.bonus_system_id AS category_bonus_system_id,
           race_categories_bonus.name AS bonus_name,
           race_categories_bonus.bonus_seconds_final,
           race_categories_bonus.bonus_seconds_intermediate,
           race_categories_bonus.points_stage,
           race_categories_bonus.points_one_day,
           race_categories_bonus.points_gc_final,
           race_categories_bonus.points_jersey_leader_day,
           race_categories_bonus.points_jersey_sprint_day,
           race_categories_bonus.points_jersey_mountain_day,
           race_categories_bonus.points_jersey_youth_day,
           race_categories_bonus.points_sprint_intermediate,
           race_categories_bonus.points_mountain_hc,
           race_categories_bonus.points_mountain_cat1,
           race_categories_bonus.points_mountain_cat2,
           race_categories_bonus.points_mountain_cat3,
           race_categories_bonus.points_mountain_cat4,
           race_categories_bonus.points_jersey_sprint_final,
           race_categories_bonus.points_jersey_mountain_final,
           race_categories_bonus.points_jersey_youth_final
    FROM races
    JOIN sta_country country ON country.id = races.country_id
    JOIN race_categories ON race_categories.id = races.category_id
    JOIN race_categories_bonus ON race_categories_bonus.id = race_categories.bonus_system_id
  `;
}

export class GameRepository {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  public getCurrentSeason(): number {
    const row = this.db
      .prepare('SELECT season FROM game_state WHERE id = 1')
      .get() as { season: number } | undefined;
    if (row) return row.season;
    const legacy = this.db
      .prepare(`SELECT value FROM career_meta WHERE key = 'current_season'`)
      .get() as { value: string } | undefined;
    return legacy ? Number(legacy.value) : 2026;
  }

  public getCurrentDate(): string {
    const row = this.db
      .prepare('SELECT current_date FROM game_state WHERE id = 1')
      .get() as { current_date: string } | undefined;
    if (row?.current_date) return row.current_date;
    return `${this.getCurrentSeason()}-01-01`;
  }

  private getRidersQuery(useContracts: boolean, filterByTeam: boolean): string {
    const countrySelect = `
      riders.*,
      role.name AS role_name,
      role.weighting AS role_weighting,
      rider_type.type_key AS rider_type,
      specialization_1.type_key AS specialization_1,
      specialization_2.type_key AS specialization_2,
      specialization_3.type_key AS specialization_3,
      country.name AS country_name,
      country.code_3 AS country_code_3,
      country.continent AS country_continent,
      country.regen_rating AS country_regen_rating,
      country.number_regen_min AS country_number_regen_min,
      country.number_regen_max AS country_number_regen_max
    `;

    if (!useContracts) {
      return filterByTeam
        ? `SELECT ${countrySelect}, NULL AS contract_end_season FROM riders JOIN sta_country country ON country.id = riders.country_id LEFT JOIN sta_role role ON role.id = riders.role_id LEFT JOIN type_rider rider_type ON rider_type.id = riders.rider_type_id LEFT JOIN type_rider specialization_1 ON specialization_1.id = riders.specialization_1_id LEFT JOIN type_rider specialization_2 ON specialization_2.id = riders.specialization_2_id LEFT JOIN type_rider specialization_3 ON specialization_3.id = riders.specialization_3_id WHERE active_team_id = ? AND is_retired = 0 ORDER BY overall_rating DESC`
        : `SELECT ${countrySelect}, NULL AS contract_end_season FROM riders JOIN sta_country country ON country.id = riders.country_id LEFT JOIN sta_role role ON role.id = riders.role_id LEFT JOIN type_rider rider_type ON rider_type.id = riders.rider_type_id LEFT JOIN type_rider specialization_1 ON specialization_1.id = riders.specialization_1_id LEFT JOIN type_rider specialization_2 ON specialization_2.id = riders.specialization_2_id LEFT JOIN type_rider specialization_3 ON specialization_3.id = riders.specialization_3_id WHERE is_retired = 0 ORDER BY overall_rating DESC`;
    }

    const activeContractJoin = `
      LEFT JOIN contracts current_contract
        ON current_contract.id = (
          SELECT c.id
          FROM contracts c
          WHERE c.rider_id = riders.id
            AND c.start_season <= ?
            AND c.end_season >= ?
          ORDER BY c.start_season DESC, c.id DESC
          LIMIT 1
        )
    `;

    const selectWithResolvedContract = `
      SELECT ${countrySelect},
             COALESCE(current_contract.team_id, riders.active_team_id) AS active_team_id,
             COALESCE(current_contract.id, riders.active_contract_id) AS active_contract_id,
             COALESCE(current_contract.end_season, (
               SELECT c.end_season
               FROM contracts c
               WHERE c.id = riders.active_contract_id
             )) AS contract_end_season
      FROM riders
      JOIN sta_country country ON country.id = riders.country_id
      LEFT JOIN sta_role role ON role.id = riders.role_id
      LEFT JOIN type_rider rider_type ON rider_type.id = riders.rider_type_id
      LEFT JOIN type_rider specialization_1 ON specialization_1.id = riders.specialization_1_id
      LEFT JOIN type_rider specialization_2 ON specialization_2.id = riders.specialization_2_id
      LEFT JOIN type_rider specialization_3 ON specialization_3.id = riders.specialization_3_id
      ${activeContractJoin}
    `;

    return filterByTeam
      ? `${selectWithResolvedContract} WHERE COALESCE(current_contract.team_id, riders.active_team_id) = ? AND riders.is_retired = 0 ORDER BY riders.overall_rating DESC`
      : `${selectWithResolvedContract} WHERE riders.is_retired = 0 ORDER BY riders.overall_rating DESC`;
  }

  public getRiders(teamId?: number): Rider[] {
    const season = this.getCurrentSeason();
    const useContracts = tableExists(this.db, 'contracts');
    const rows: RiderRow[] = teamId != null
      ? (useContracts
          ? this.db.prepare(this.getRidersQuery(true, true)).all(season, season, teamId)
          : this.db.prepare(this.getRidersQuery(false, true)).all(teamId)
        ) as RiderRow[]
      : (useContracts
          ? this.db.prepare(this.getRidersQuery(true, false)).all(season, season)
          : this.db.prepare(this.getRidersQuery(false, false)).all()
        ) as RiderRow[];
    return rows.map(row => mapRider(row, season));
  }

  public getRiderById(id: number): Rider | null {
    const season = this.getCurrentSeason();
    const row = this.db.prepare(`
      SELECT riders.*,
             role.name AS role_name,
             role.weighting AS role_weighting,
             rider_type.type_key AS rider_type,
             specialization_1.type_key AS specialization_1,
             specialization_2.type_key AS specialization_2,
             specialization_3.type_key AS specialization_3,
             country.name AS country_name,
             country.code_3 AS country_code_3,
             country.continent AS country_continent,
             country.regen_rating AS country_regen_rating,
             country.number_regen_min AS country_number_regen_min,
             country.number_regen_max AS country_number_regen_max,
             (
               SELECT c.end_season
               FROM contracts c
               WHERE c.id = riders.active_contract_id
             ) AS contract_end_season
      FROM riders
      JOIN sta_country country ON country.id = riders.country_id
      LEFT JOIN sta_role role ON role.id = riders.role_id
      LEFT JOIN type_rider rider_type ON rider_type.id = riders.rider_type_id
      LEFT JOIN type_rider specialization_1 ON specialization_1.id = riders.specialization_1_id
      LEFT JOIN type_rider specialization_2 ON specialization_2.id = riders.specialization_2_id
      LEFT JOIN type_rider specialization_3 ON specialization_3.id = riders.specialization_3_id
      WHERE riders.id = ?
    `).get(id) as RiderRow | undefined;
    return row ? mapRider(row, season) : null;
  }

  public getTeams(): Team[] {
    const rows = this.db.prepare(`
      SELECT t.id, t.name, t.abbreviation, t.division_id, t.u23_team,
             main.id AS main_team_id,
             t.is_player_team, t.country_id,
             country.name AS country_name,
             country.code_3 AS country_code_3,
             country.continent AS country_continent,
             country.regen_rating AS country_regen_rating,
             country.number_regen_min AS country_number_regen_min,
             country.number_regen_max AS country_number_regen_max,
             t.color_primary, t.color_secondary,
             t.ai_focus_1, t.ai_focus_2, t.ai_focus_3,
             u23.name AS u23_team_name,
             main.name AS main_team_name,
             dt.name AS division_name
      FROM teams t
      JOIN division_teams dt ON dt.id = t.division_id
      JOIN sta_country country ON country.id = t.country_id
      LEFT JOIN teams u23 ON u23.id = t.u23_team
      LEFT JOIN teams main ON main.u23_team = t.id
      ORDER BY dt.tier ASC, t.name ASC
    `).all() as TeamRow[];
    return rows.map(mapTeam);
  }

  public getTeamById(id: number): Team | null {
    const row = this.db.prepare(`
      SELECT t.id, t.name, t.abbreviation, t.division_id, t.u23_team,
             main.id AS main_team_id,
             t.is_player_team, t.country_id,
             country.name AS country_name,
             country.code_3 AS country_code_3,
             country.continent AS country_continent,
             country.regen_rating AS country_regen_rating,
             country.number_regen_min AS country_number_regen_min,
             country.number_regen_max AS country_number_regen_max,
             t.color_primary, t.color_secondary,
             t.ai_focus_1, t.ai_focus_2, t.ai_focus_3,
             u23.name AS u23_team_name,
             main.name AS main_team_name,
             dt.name AS division_name
      FROM teams t
      JOIN division_teams dt ON dt.id = t.division_id
      JOIN sta_country country ON country.id = t.country_id
      LEFT JOIN teams u23 ON u23.id = t.u23_team
      LEFT JOIN teams main ON main.u23_team = t.id
      WHERE t.id = ?
    `).get(id) as TeamRow | undefined;
    return row ? mapTeam(row) : null;
  }

  public getRaces(season?: number): Race[] {
    const requestedSeason = season ?? this.getCurrentSeason();
    const currentDate = this.getCurrentDate();
    const rows = this.db.prepare(`
      ${buildRaceSelect()}
      WHERE CAST(substr(races.start_date, 1, 4) AS INTEGER) = ?
      ORDER BY races.start_date ASC, races.id ASC
    `).all(requestedSeason) as RaceRow[];
    const stagesByRaceId = this.getStagesByRaceIds(rows.map(row => row.id));
    return rows.map((row) => {
      const stages = stagesByRaceId.get(row.id) ?? [];
      return mapRaceWithSummary(row, stages, this.getUpcomingStageSummary(stages, row.is_stage_race === 1, currentDate));
    });
  }

  public getRaceById(id: number): Race | null {
    const row = this.db.prepare(`
      ${buildRaceSelect()}
      WHERE races.id = ?
    `).get(id) as RaceRow | undefined;
    if (!row) return null;
    const currentDate = this.getCurrentDate();
    const stagesByRaceId = this.getStagesByRaceIds([id]);
    const stages = stagesByRaceId.get(id) ?? [];
    return mapRaceWithSummary(row, stages, this.getUpcomingStageSummary(stages, row.is_stage_race === 1, currentDate));
  }

  public getRaceRiders(raceId: number): Rider[] {
    const season = this.getCurrentSeason();
    const rows = this.db.prepare(`
      SELECT r.*,
             role.name AS role_name,
             role.weighting AS role_weighting,
             rider_type.type_key AS rider_type,
             specialization_1.type_key AS specialization_1,
             specialization_2.type_key AS specialization_2,
             specialization_3.type_key AS specialization_3,
             country.name AS country_name,
             country.code_3 AS country_code_3,
             country.continent AS country_continent,
             country.regen_rating AS country_regen_rating,
             country.number_regen_min AS country_number_regen_min,
             country.number_regen_max AS country_number_regen_max,
             (
               SELECT c.end_season
               FROM contracts c
               WHERE c.id = r.active_contract_id
             ) AS contract_end_season
      FROM riders r
      JOIN sta_country country ON country.id = r.country_id
      LEFT JOIN sta_role role ON role.id = r.role_id
      LEFT JOIN type_rider rider_type ON rider_type.id = r.rider_type_id
      LEFT JOIN type_rider specialization_1 ON specialization_1.id = r.specialization_1_id
      LEFT JOIN type_rider specialization_2 ON specialization_2.id = r.specialization_2_id
      LEFT JOIN type_rider specialization_3 ON specialization_3.id = r.specialization_3_id
      INNER JOIN race_entries re ON re.rider_id = r.id
      WHERE re.race_id = ? AND r.is_retired = 0
      ORDER BY r.overall_rating DESC
    `).all(raceId) as RiderRow[];
    return rows.map(row => mapRider(row, season));
  }

  public getStagesForRace(raceId: number): Stage[] {
    return this.getStagesByRaceIds([raceId]).get(raceId) ?? [];
  }

  private getStagesByRaceIds(raceIds: number[]): Map<number, Stage[]> {
    const stagesByRaceId = new Map<number, Stage[]>();
    if (raceIds.length === 0) return stagesByRaceId;

    const placeholders = raceIds.map(() => '?').join(', ');
    const stageRows = this.db.prepare(`
      SELECT id, race_id, stage_number, date, profile, details_csv_file
      FROM stages
      WHERE race_id IN (${placeholders})
      ORDER BY race_id ASC, stage_number ASC
    `).all(...raceIds) as StageRow[];

    for (const row of stageRows) {
      const stages = stagesByRaceId.get(row.race_id) ?? [];
      stages.push(mapStage(row));
      stagesByRaceId.set(row.race_id, stages);
    }

    const missingRaceIds = raceIds.filter((raceId) => !stagesByRaceId.has(raceId));
    if (missingRaceIds.length > 0) {
      for (const row of loadFallbackStages(missingRaceIds)) {
        const stages = stagesByRaceId.get(row.race_id) ?? [];
        stages.push(mapStage(row));
        stagesByRaceId.set(row.race_id, stages);
      }
    }

    return stagesByRaceId;
  }

  private getUpcomingStageSummary(stages: Stage[], isStageRace: boolean, currentDate: string): RaceStageSummary | undefined {
    if (stages.length === 0) return undefined;

    const selectedStage = isStageRace
      ? stages.find((stage) => stage.date >= currentDate) ?? stages[stages.length - 1]
      : stages[0];
    if (!selectedStage) return undefined;

    const summary = summarizeStageProfile(selectedStage.detailsCsvFile);
    return {
      stageId: selectedStage.id,
      stageNumber: selectedStage.stageNumber,
      date: selectedStage.date,
      profile: selectedStage.profile,
      detailsCsvFile: selectedStage.detailsCsvFile,
      distanceKm: summary.distanceKm,
      elevationGainMeters: summary.elevationGainMeters,
    };
  }
}
