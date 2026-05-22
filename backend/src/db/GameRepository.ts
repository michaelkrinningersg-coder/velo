import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { Country, FormDebugPoint, Nationality, Race, RaceCategory, RaceCategoryBonus, RaceClassificationRow, RaceStageSummary, RealtimeGcStanding, ResultType, Rider, RiderFormSnapshot, RiderHealthStatus, RiderPotentials, RiderSkillKey, RiderSkills, Role, SeasonPointAwardType, SeasonStandingRow, SeasonStandingsPayload, Stage, StageClassification, StageMarkerCategory, StageMarkerClassification, StageResultsPayload, StageScoringRule, Team } from '../../../shared/types';
import { SKILL_WEIGHT_RIDER_COLUMNS, SkillWeightRule } from '../../../shared/skillWeights';
import { summarizeStageProfile } from '../simulation/StageParser';

const RESULT_TYPE_IDS = {
  stage: 1,
  gc: 2,
  points: 3,
  mountain: 4,
  youth: 5,
  team: 6,
} as const;

const SEASON_POINT_AWARD_TYPES = [
  'stage_result',
  'one_day_result',
  'gc_leader_day',
  'points_leader_day',
  'mountain_leader_day',
  'youth_leader_day',
  'gc_final',
  'points_final',
  'mountain_final',
  'youth_final',
] as const satisfies readonly SeasonPointAwardType[];

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

const FORM_RISE_DAYS = 42;
const FORM_RISE_STEP = 0.1;
const FORM_FALL_DAYS = 10;
const FORM_MAX_BONUS = 3;

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
  form_bonus: number | null;
  race_form_bonus: number | null;
  peak_s_form: number | null;
  peak_r_form: number | null;
  active_peak_date: string | null;
  free_r_form_bonus: number | null;
  peak_dates_json: string | null;
  health_status: RiderHealthStatus | null;
  unavailable_until: string | null;
  unavailable_days_remaining: number | null;
  accumulated_random_fatigue: number | null;
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
  category_role_1: number;
  category_role_2: number;
  category_role_3: number;
  category_role_4: number;
  category_role_5: number;
  category_role_6: number;
  bonus_name: string;
  bonus_seconds_final: string;
  bonus_seconds_intermediate: string;
  points_stage: string;
  points_mountainstage: string;
  points_sprint_finish: string;
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
  start_elevation: number;
  details_csv_file: string;
}

interface StageResultsMetaRow {
  stage_id: number;
  race_id: number;
  race_name: string;
  stage_number: number;
  date: string;
  profile: Stage['profile'];
  is_stage_race: number;
  number_of_stages: number;
}

interface RuleRow {
  id: number;
  rule_key: string;
  applies_to: StageScoringRule['appliesTo'];
  marker_type: StageScoringRule['markerType'];
  marker_category: StageMarkerCategory | null;
  weight_flat: number;
  weight_mountain: number;
  weight_medium_mountain: number;
  weight_hill: number;
  weight_time_trial: number;
  weight_prologue: number;
  weight_cobble: number;
  weight_sprint: number;
  weight_acceleration: number;
  weight_downhill: number;
  weight_attack: number;
  weight_stamina: number;
  weight_resistance: number;
  weight_recuperation: number;
  weight_bike_handling: number;
}

interface SkillWeightRow {
  id: number;
  simulation_mode: SkillWeightRule['simulationMode'];
  terrain: SkillWeightRule['terrain'];
  weight_flat: number;
  weight_mountain: number;
  weight_medium_mountain: number;
  weight_hill: number;
  weight_time_trial: number;
  weight_prologue: number;
  weight_cobble: number;
  weight_sprint: number;
  weight_acceleration: number;
  weight_downhill: number;
  weight_attack: number;
  weight_stamina: number;
  weight_resistance: number;
  weight_recuperation: number;
  weight_bike_handling: number;
  ttt_speed_multiplier: number;
}

type StageEntryStatus = 'scheduled' | 'started' | 'finished' | 'dns' | 'dnf';

interface ResultTypeRow {
  id: number;
  name: string;
}

interface StageResultDbRow {
  result_type_id: number;
  result_type_name: string;
  rank: number;
  time_seconds: number | null;
  points: number | null;
  rider_id: number | null;
  rider_first_name: string | null;
  rider_last_name: string | null;
  team_id: number | null;
  team_name: string | null;
}

interface StageMarkerResultDbRow {
  marker_key: string;
  marker_label: string;
  marker_type: string;
  marker_category: StageMarkerCategory | null;
  km_mark: number;
  rider_id: number;
  rank: number;
  crossing_time_seconds: number;
  gap_seconds: number;
  points_awarded: number;
  photo_finish_score: number;
}

interface StageSeasonPointDbRow {
  rider_id: number;
  award_type: SeasonPointAwardType;
  points_total: number;
}

interface StageTeamSeasonPointDbRow {
  team_id: number;
  points_total: number;
}

interface SeasonPointStageRow {
  stage_id: number;
  race_id: number;
  stage_number: number;
  date: string;
  profile: Stage['profile'];
  is_stage_race: number;
  number_of_stages: number;
  points_stage: string;
  points_mountainstage: string;
  points_one_day: string;
  points_gc_final: string;
  points_jersey_leader_day: number;
  points_jersey_sprint_day: number;
  points_jersey_mountain_day: number;
  points_jersey_youth_day: number;
  points_jersey_sprint_final: string;
  points_jersey_mountain_final: string;
  points_jersey_youth_final: string;
}

interface SeasonPointResultRow {
  rider_id: number;
  team_id: number;
  rank: number;
}

interface RiderSeasonStandingDbRow {
  rider_id: number;
  rider_first_name: string;
  rider_last_name: string;
  team_id: number | null;
  team_name: string | null;
  country_code_3: Nationality;
  points_total: number;
}

interface TeamSeasonStandingDbRow {
  team_id: number;
  team_name: string;
  country_code_3: Nationality;
  points_total: number;
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

function parseRankedValues(value: string): number[] {
  if (!value.trim()) return [];
  return value.split('|').map((part) => Number.parseInt(part.trim(), 10)).filter(Number.isFinite);
}

function parsePeakDates(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((entry): entry is string => typeof entry === 'string') : [];
  } catch {
    return [];
  }
}

function usesMountainStagePoints(profile: Stage['profile']): boolean {
  return !['ITT', 'Flat', 'Rolling', 'Hilly'].includes(profile);
}

function resolveStageResultPointValues(stage: SeasonPointStageRow): number[] {
  if (stage.profile === 'TTT') {
    return [];
  }

  return parseRankedValues(stage.points_stage);
}

function isoDateToDayNumber(isoDate: string): number {
  return Math.floor(new Date(`${isoDate}T00:00:00.000Z`).getTime() / 86400000);
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

function addDaysIso(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function resolveStageRaceBaseFatigue(stageNumber: number, recuperationSkill: number): number {
  if (stageNumber <= 1) {
    return 0;
  }

  const cappedRecuperation = Math.min(85, recuperationSkill);
  return (stageNumber - 1) * (0.01 + ((85 - cappedRecuperation) * 0.01));
}

function resolveStageRaceFatigueMalus(stageNumber: number | undefined, recuperationSkill: number, accumulatedRandomFatigue: number): number {
  if (stageNumber == null) {
    return 0;
  }

  return roundToTwoDecimals(resolveStageRaceBaseFatigue(stageNumber, recuperationSkill) + accumulatedRandomFatigue);
}

function resolvePeakPhase(currentDate: string, peakDates: string[]): { phase: 'build' | 'peak' | 'decline'; peakDate: string; elapsedDays: number } | null {
  const currentDay = isoDateToDayNumber(currentDate);
  for (const peakDate of peakDates) {
    const peakDay = isoDateToDayNumber(peakDate);
    if (currentDay === peakDay) {
      return { phase: 'peak', peakDate, elapsedDays: 0 };
    }
    if (currentDay > peakDay && currentDay <= peakDay + FORM_FALL_DAYS) {
      return { phase: 'decline', peakDate, elapsedDays: currentDay - peakDay };
    }
    if (currentDay >= peakDay - FORM_RISE_DAYS && currentDay < peakDay) {
      return { phase: 'build', peakDate, elapsedDays: peakDay - currentDay };
    }
  }

  return null;
}

function resolveDeclineValue(peakValue: number, elapsedDays: number): number {
  if (elapsedDays >= FORM_FALL_DAYS) {
    return 0;
  }

  return roundToTwoDecimals(Math.max(0, peakValue * (1 - (elapsedDays / FORM_FALL_DAYS))));
}

function resolveProjectionPoint(date: string, peakDates: string[]): { sForm: number; rForm: number } {
  const phase = resolvePeakPhase(date, peakDates);
  if (!phase) {
    return { sForm: 0, rForm: 0 };
  }

  if (phase.phase === 'build') {
    const sForm = roundToTwoDecimals(Math.min(FORM_MAX_BONUS, Math.max(0, (FORM_RISE_DAYS - phase.elapsedDays + 1) * FORM_RISE_STEP)));
    return { sForm, rForm: 0 };
  }

  if (phase.phase === 'peak') {
    return { sForm: FORM_MAX_BONUS, rForm: 0 };
  }

  return {
    sForm: resolveDeclineValue(FORM_MAX_BONUS, phase.elapsedDays),
    rForm: 0,
  };
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

function mapRider(row: RiderRow, currentYear: number, _currentDate: string, seasonPoints = 0, stageNumber?: number): Rider {
  const country = mapCountry(row);
  const role = mapRole(row);
  const peakDates = parsePeakDates(row.peak_dates_json);
  const accumulatedRandomFatigue = row.accumulated_random_fatigue ?? 0;
  const totalRaceFormBonus = roundToTwoDecimals((row.race_form_bonus ?? 0) + (row.free_r_form_bonus ?? 0));
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
    seasonPoints,
    formBonus: row.form_bonus ?? -1,
    raceFormBonus: totalRaceFormBonus,
    peakSForm: row.peak_s_form ?? 0,
    peakRForm: row.peak_r_form ?? 0,
    activePeakDate: row.active_peak_date,
    fatigueMalus: resolveStageRaceFatigueMalus(stageNumber, row.skill_recuperation, accumulatedRandomFatigue),
    accumulatedRandomFatigue,
    seasonFormPeakDates: peakDates,
    healthStatus: row.health_status ?? 'healthy',
    unavailableUntil: row.unavailable_until,
    unavailableDaysRemaining: row.unavailable_days_remaining ?? 0,
    healthStatusLabel: row.health_status === 'ill' ? 'Krankheit' : row.health_status === 'injured' ? 'Verletzung' : null,
    isUnavailable: (row.unavailable_days_remaining ?? 0) > 0,
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
    pointsMountainStage: row.points_mountainstage,
    pointsSprintFinish: row.points_sprint_finish,
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
    roleRequirements: {
      1: row.category_role_1,
      2: row.category_role_2,
      3: row.category_role_3,
      4: row.category_role_4,
      5: row.category_role_5,
      6: row.category_role_6,
    },
    bonusSystem,
  };
}

function mapStageScoringRule(row: RuleRow): StageScoringRule {
  const weights = RIDER_SKILL_COLUMNS.reduce<StageScoringRule['weights']>((result, [skillKey, columnSuffix]) => {
    const value = row[`weight_${columnSuffix}` as keyof RuleRow];
    if (typeof value === 'number' && value > 0) {
      result[skillKey] = value;
    }
    return result;
  }, {});

  return {
    id: row.id,
    ruleKey: row.rule_key,
    appliesTo: row.applies_to,
    markerType: row.marker_type,
    markerCategory: row.marker_category,
    weights,
  };
}

function mapSkillWeightRule(row: SkillWeightRow): SkillWeightRule {
  const weights = SKILL_WEIGHT_RIDER_COLUMNS.reduce<SkillWeightRule['weights']>((result, [skillKey, columnSuffix]) => {
    const value = row[`weight_${columnSuffix}` as keyof SkillWeightRow];
    if (typeof value === 'number' && value > 0) {
      result[skillKey] = value;
    }
    return result;
  }, {});

  return {
    id: row.id,
    simulationMode: row.simulation_mode,
    terrain: row.terrain,
    weights,
    tttSpeedMultiplier: row.ttt_speed_multiplier,
  };
}

function mapStage(row: StageRow): Stage {
  const summary = summarizeStageProfile(row.details_csv_file, row.start_elevation);
  return {
    id: row.id,
    raceId: row.race_id,
    stageNumber: row.stage_number,
    date: row.date,
    profile: row.profile,
    detailsCsvFile: row.details_csv_file,
    startElevation: row.start_elevation,
    distanceKm: summary.distanceKm,
    elevationGainMeters: summary.elevationGainMeters,
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
        start_elevation: Number(record['start_elevation']),
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
           race_categories.role_1 AS category_role_1,
           race_categories.role_2 AS category_role_2,
           race_categories.role_3 AS category_role_3,
           race_categories.role_4 AS category_role_4,
           race_categories.role_5 AS category_role_5,
           race_categories.role_6 AS category_role_6,
           race_categories_bonus.name AS bonus_name,
           race_categories_bonus.bonus_seconds_final,
           race_categories_bonus.bonus_seconds_intermediate,
           race_categories_bonus.points_stage,
           race_categories_bonus.points_mountainstage,
           race_categories_bonus.points_sprint_finish,
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

  public prepareStageRaceFatigue(raceId: number, stageNumber: number, riderIds: number[]): void {
    if (stageNumber < 1 || riderIds.length === 0) {
      return;
    }

    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_stage_race_state (
        race_id INTEGER NOT NULL,
        rider_id INTEGER NOT NULL,
        accumulated_random_fatigue REAL NOT NULL DEFAULT 0,
        last_applied_stage_number INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (race_id, rider_id)
      )
    `).run();

    const insertState = this.db.prepare(`
      INSERT OR IGNORE INTO rider_stage_race_state (
        race_id, rider_id, accumulated_random_fatigue, last_applied_stage_number
      ) VALUES (?, ?, 0, 0)
    `);
    const selectState = this.db.prepare(`
      SELECT rider_id, accumulated_random_fatigue, last_applied_stage_number
      FROM rider_stage_race_state
      WHERE race_id = ? AND rider_id = ?
    `);
    const updateState = this.db.prepare(`
      UPDATE rider_stage_race_state
      SET accumulated_random_fatigue = ?, last_applied_stage_number = ?
      WHERE race_id = ? AND rider_id = ?
    `);

    this.db.transaction(() => {
      for (const riderId of riderIds) {
        insertState.run(raceId, riderId);
        const existing = selectState.get(raceId, riderId) as {
          rider_id: number;
          accumulated_random_fatigue: number;
          last_applied_stage_number: number;
        } | undefined;
        if (!existing || existing.last_applied_stage_number >= stageNumber) {
          continue;
        }

        let accumulatedRandomFatigue = existing.accumulated_random_fatigue;
        if (Math.random() < 0.005) {
          accumulatedRandomFatigue = roundToTwoDecimals(accumulatedRandomFatigue + randomBetween(0.1, 0.3));
        }

        updateState.run(accumulatedRandomFatigue, stageNumber, raceId, riderId);
      }
    })();
  }

  public ensureStageEntries(stage: Stage): void {
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS stage_entries (
        stage_id       INTEGER NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
        race_id        INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
        team_id        INTEGER NOT NULL REFERENCES teams(id),
        rider_id       INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        status         TEXT    NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'started', 'finished', 'dns', 'dnf')),
        status_reason  TEXT,
        PRIMARY KEY (stage_id, rider_id)
      )
    `).run();
    this.db.prepare('CREATE INDEX IF NOT EXISTS idx_stage_entries_race_stage_status ON stage_entries(race_id, stage_id, status)').run();
    this.db.prepare('CREATE INDEX IF NOT EXISTS idx_stage_entries_rider_status ON stage_entries(rider_id, status)').run();

    const inactiveRiderIds = new Set((this.db.prepare(`
      SELECT DISTINCT stage_entries.rider_id AS rider_id
      FROM stage_entries
      JOIN stages ON stages.id = stage_entries.stage_id
      WHERE stage_entries.race_id = ?
        AND stages.stage_number < ?
        AND stage_entries.status IN ('dns', 'dnf')
    `).all(stage.raceId, stage.stageNumber) as Array<{ rider_id: number }>).map((row) => row.rider_id));

    const raceEntries = this.db.prepare(`
      SELECT race_id, team_id, rider_id
      FROM race_entries
      WHERE race_id = ?
      ORDER BY rider_id ASC
    `).all(stage.raceId) as Array<{ race_id: number; team_id: number; rider_id: number }>;

    const insertStageEntry = this.db.prepare(`
      INSERT OR IGNORE INTO stage_entries (stage_id, race_id, team_id, rider_id, status, status_reason)
      VALUES (?, ?, ?, ?, 'scheduled', NULL)
    `);

    this.db.transaction(() => {
      for (const entry of raceEntries) {
        if (inactiveRiderIds.has(entry.rider_id)) {
          continue;
        }
        insertStageEntry.run(stage.id, stage.raceId, entry.team_id, entry.rider_id);
      }
    })();
  }

  public clearStageEntries(stageId: number): void {
    if (!tableExists(this.db, 'stage_entries')) {
      return;
    }
    this.db.prepare('DELETE FROM stage_entries WHERE stage_id = ?').run(stageId);
  }

  public updateStageEntryStatus(stageId: number, riderId: number, status: StageEntryStatus, statusReason: string | null = null): void {
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS stage_entries (
        stage_id       INTEGER NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
        race_id        INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
        team_id        INTEGER NOT NULL REFERENCES teams(id),
        rider_id       INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        status         TEXT    NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'started', 'finished', 'dns', 'dnf')),
        status_reason  TEXT,
        PRIMARY KEY (stage_id, rider_id)
      )
    `).run();

    this.db.prepare(`
      UPDATE stage_entries
      SET status = ?, status_reason = ?
      WHERE stage_id = ? AND rider_id = ?
    `).run(status, statusReason, stageId, riderId);
  }

  public markStageEntriesFinished(stageId: number, riderIds: number[]): void {
    if (riderIds.length === 0) {
      return;
    }

    this.db.transaction(() => {
      for (const riderId of riderIds) {
        this.updateStageEntryStatus(stageId, riderId, 'finished');
      }
    })();
  }

  public attachStageRaceFatigue(raceId: number, riders: Rider[], stageNumber: number): Rider[] {
    if (riders.length === 0 || stageNumber < 1) {
      return riders;
    }

    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_stage_race_state (
        race_id INTEGER NOT NULL,
        rider_id INTEGER NOT NULL,
        accumulated_random_fatigue REAL NOT NULL DEFAULT 0,
        last_applied_stage_number INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (race_id, rider_id)
      )
    `).run();

    const fatigueRows = this.db.prepare(`
      SELECT race_id, rider_id, accumulated_random_fatigue
      FROM rider_stage_race_state
      WHERE race_id = ? AND rider_id = ?
    `);

    return riders.map((rider) => {
      const row = fatigueRows.get(raceId, rider.id) as { race_id: number; rider_id: number; accumulated_random_fatigue: number } | undefined;
      const accumulatedRandomFatigue = row?.accumulated_random_fatigue ?? 0;
      return {
        ...rider,
        accumulatedRandomFatigue,
        fatigueMalus: resolveStageRaceFatigueMalus(stageNumber, rider.skills.recuperation, accumulatedRandomFatigue),
      } satisfies Rider;
    });
  }

  private getRidersQuery(useContracts: boolean, filterByTeam: boolean): string {
    const useDailyState = tableExists(this.db, 'rider_daily_state');
    const useFreeRaceForm = tableExists(this.db, 'rider_r_form_events');
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
      country.number_regen_max AS country_number_regen_max,
      ${useDailyState ? 'rider_state.form_bonus' : '-1.0'} AS form_bonus,
      ${useDailyState ? 'rider_state.race_form_bonus' : '0'} AS race_form_bonus,
      ${useDailyState ? 'rider_state.peak_s_form' : '0'} AS peak_s_form,
      ${useDailyState ? 'rider_state.peak_r_form' : '0'} AS peak_r_form,
      ${useDailyState ? 'rider_state.active_peak_date' : 'NULL'} AS active_peak_date,
      ${useFreeRaceForm ? 'COALESCE(free_r_form.total, 0)' : '0'} AS free_r_form_bonus,
      ${useDailyState ? 'rider_state.peak_dates_json' : "'[]'"} AS peak_dates_json,
      ${useDailyState ? 'rider_state.health_status' : "'healthy'"} AS health_status,
      ${useDailyState ? 'rider_state.unavailable_until' : 'NULL'} AS unavailable_until,
      ${useDailyState ? 'rider_state.unavailable_days_remaining' : '0'} AS unavailable_days_remaining
    `;
    const riderStateJoin = useDailyState ? 'LEFT JOIN rider_daily_state rider_state ON rider_state.rider_id = riders.id' : '';
    const freeRaceFormJoin = useFreeRaceForm ? 'LEFT JOIN (SELECT rider_id, SUM(amount) AS total FROM rider_r_form_events GROUP BY rider_id) free_r_form ON free_r_form.rider_id = riders.id' : '';

    if (!useContracts) {
      return filterByTeam
        ? `SELECT ${countrySelect}, NULL AS contract_end_season FROM riders JOIN sta_country country ON country.id = riders.country_id LEFT JOIN sta_role role ON role.id = riders.role_id LEFT JOIN type_rider rider_type ON rider_type.id = riders.rider_type_id LEFT JOIN type_rider specialization_1 ON specialization_1.id = riders.specialization_1_id LEFT JOIN type_rider specialization_2 ON specialization_2.id = riders.specialization_2_id LEFT JOIN type_rider specialization_3 ON specialization_3.id = riders.specialization_3_id ${riderStateJoin} ${freeRaceFormJoin} WHERE active_team_id = ? AND is_retired = 0 ORDER BY overall_rating DESC`
        : `SELECT ${countrySelect}, NULL AS contract_end_season FROM riders JOIN sta_country country ON country.id = riders.country_id LEFT JOIN sta_role role ON role.id = riders.role_id LEFT JOIN type_rider rider_type ON rider_type.id = riders.rider_type_id LEFT JOIN type_rider specialization_1 ON specialization_1.id = riders.specialization_1_id LEFT JOIN type_rider specialization_2 ON specialization_2.id = riders.specialization_2_id LEFT JOIN type_rider specialization_3 ON specialization_3.id = riders.specialization_3_id ${riderStateJoin} ${freeRaceFormJoin} WHERE is_retired = 0 ORDER BY overall_rating DESC`;
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
      ${riderStateJoin}
      ${activeContractJoin}
    `;

    return filterByTeam
      ? `${selectWithResolvedContract} ${freeRaceFormJoin} WHERE COALESCE(current_contract.team_id, riders.active_team_id) = ? AND riders.is_retired = 0 ORDER BY riders.overall_rating DESC`
      : `${selectWithResolvedContract} ${freeRaceFormJoin} WHERE riders.is_retired = 0 ORDER BY riders.overall_rating DESC`;
  }

  public getRiders(teamId?: number, includeFormDebug = false): Rider[] {
    const season = this.getCurrentSeason();
    const currentDate = this.getCurrentDate();
    this.syncSeasonPointEventsForSeason(season);
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
    const seasonPointsByRiderId = this.getSeasonPointsByRiderId(season);
    const riders = rows.map((row) => mapRider(row, season, currentDate, seasonPointsByRiderId.get(row.id) ?? 0));
    return includeFormDebug ? this.attachFormDebugData(riders, season, currentDate) : riders;
  }

  public getRiderById(id: number): Rider | null {
    const season = this.getCurrentSeason();
    const currentDate = this.getCurrentDate();
    const useDailyState = tableExists(this.db, 'rider_daily_state');
    const useFreeRaceForm = tableExists(this.db, 'rider_r_form_events');
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
             ${useDailyState ? 'rider_state.form_bonus' : '-1.0'} AS form_bonus,
             ${useDailyState ? 'rider_state.race_form_bonus' : '0'} AS race_form_bonus,
             ${useDailyState ? 'rider_state.peak_s_form' : '0'} AS peak_s_form,
             ${useDailyState ? 'rider_state.peak_r_form' : '0'} AS peak_r_form,
             ${useDailyState ? 'rider_state.active_peak_date' : 'NULL'} AS active_peak_date,
             ${useFreeRaceForm ? 'COALESCE(free_r_form.total, 0)' : '0'} AS free_r_form_bonus,
             ${useDailyState ? 'rider_state.peak_dates_json' : "'[]'"} AS peak_dates_json,
             ${useDailyState ? 'rider_state.health_status' : "'healthy'"} AS health_status,
             ${useDailyState ? 'rider_state.unavailable_until' : 'NULL'} AS unavailable_until,
             ${useDailyState ? 'rider_state.unavailable_days_remaining' : '0'} AS unavailable_days_remaining,
             0 AS accumulated_random_fatigue,
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
      ${useDailyState ? 'LEFT JOIN rider_daily_state rider_state ON rider_state.rider_id = riders.id' : ''}
      ${useFreeRaceForm ? 'LEFT JOIN (SELECT rider_id, SUM(amount) AS total FROM rider_r_form_events GROUP BY rider_id) free_r_form ON free_r_form.rider_id = riders.id' : ''}
      WHERE riders.id = ?
    `).get(id) as RiderRow | undefined;
    return row ? mapRider(row, season, currentDate, 0) : null;
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

  public getStageScoringRules(): StageScoringRule[] {
    if (!tableExists(this.db, 'rules')) {
      return [];
    }

    const rows = this.db.prepare(`
      SELECT id,
             rule_key,
             applies_to,
             marker_type,
             marker_category,
             weight_flat,
             weight_mountain,
             weight_medium_mountain,
             weight_hill,
             weight_time_trial,
             weight_prologue,
             weight_cobble,
             weight_sprint,
             weight_acceleration,
             weight_downhill,
             weight_attack,
             weight_stamina,
             weight_resistance,
             weight_recuperation,
             weight_bike_handling
      FROM rules
      ORDER BY id ASC
    `).all() as RuleRow[];

    return rows.map(mapStageScoringRule);
  }

  public getSkillWeightRules(): SkillWeightRule[] {
    if (!tableExists(this.db, 'skill_weights')) {
      return [];
    }

    const rows = this.db.prepare(`
      SELECT id,
             simulation_mode,
             terrain,
             weight_flat,
             weight_mountain,
             weight_medium_mountain,
             weight_hill,
             weight_time_trial,
             weight_prologue,
             weight_cobble,
             weight_sprint,
             weight_acceleration,
             weight_downhill,
             weight_attack,
             weight_stamina,
             weight_resistance,
             weight_recuperation,
             weight_bike_handling,
             ttt_speed_multiplier
      FROM skill_weights
      ORDER BY id ASC
    `).all() as SkillWeightRow[];

    return rows.map(mapSkillWeightRule);
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
    const currentDate = this.getCurrentDate();
    this.syncSeasonPointEventsForSeason(season);
    const useDailyState = tableExists(this.db, 'rider_daily_state');
    const useStageRaceState = tableExists(this.db, 'rider_stage_race_state');
    const useFreeRaceForm = tableExists(this.db, 'rider_r_form_events');
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
             ${useDailyState ? 'rider_state.form_bonus' : '-1.0'} AS form_bonus,
             ${useDailyState ? 'rider_state.race_form_bonus' : '0'} AS race_form_bonus,
             ${useDailyState ? 'rider_state.peak_s_form' : '0'} AS peak_s_form,
             ${useDailyState ? 'rider_state.peak_r_form' : '0'} AS peak_r_form,
             ${useDailyState ? 'rider_state.active_peak_date' : 'NULL'} AS active_peak_date,
             ${useFreeRaceForm ? 'COALESCE(free_r_form.total, 0)' : '0'} AS free_r_form_bonus,
             ${useDailyState ? 'rider_state.peak_dates_json' : "'[]'"} AS peak_dates_json,
             ${useDailyState ? 'rider_state.health_status' : "'healthy'"} AS health_status,
             ${useDailyState ? 'rider_state.unavailable_until' : 'NULL'} AS unavailable_until,
             ${useDailyState ? 'rider_state.unavailable_days_remaining' : '0'} AS unavailable_days_remaining,
             ${useStageRaceState ? 'COALESCE(race_state.accumulated_random_fatigue, 0)' : '0'} AS accumulated_random_fatigue,
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
      ${useDailyState ? 'LEFT JOIN rider_daily_state rider_state ON rider_state.rider_id = r.id' : ''}
      ${useFreeRaceForm ? 'LEFT JOIN (SELECT rider_id, SUM(amount) AS total FROM rider_r_form_events GROUP BY rider_id) free_r_form ON free_r_form.rider_id = r.id' : ''}
      INNER JOIN race_entries re ON re.rider_id = r.id
      ${useStageRaceState ? 'LEFT JOIN rider_stage_race_state race_state ON race_state.rider_id = r.id AND race_state.race_id = re.race_id' : ''}
      WHERE re.race_id = ? AND r.is_retired = 0
      ORDER BY r.overall_rating DESC
    `).all(raceId) as RiderRow[];
    const seasonPointsByRiderId = this.getSeasonPointsByRiderId(season);
    const stageRow = this.db.prepare('SELECT stage_number FROM stages WHERE race_id = ? AND date = ? ORDER BY stage_number ASC LIMIT 1').get(raceId, currentDate) as { stage_number: number } | undefined;
    return rows.map((row) => mapRider(row, season, currentDate, seasonPointsByRiderId.get(row.id) ?? 0, stageRow?.stage_number));
  }

  public getStageRiders(stageId: number): Rider[] {
    const season = this.getCurrentSeason();
    const currentDate = this.getCurrentDate();
    this.syncSeasonPointEventsForSeason(season);
    const useDailyState = tableExists(this.db, 'rider_daily_state');
    const useStageRaceState = tableExists(this.db, 'rider_stage_race_state');
    const useFreeRaceForm = tableExists(this.db, 'rider_r_form_events');

    const stage = this.getStageById(stageId);
    if (!stage) {
      return [];
    }

    this.ensureStageEntries(stage);

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
             ${useDailyState ? 'rider_state.form_bonus' : '-1.0'} AS form_bonus,
             ${useDailyState ? 'rider_state.race_form_bonus' : '0'} AS race_form_bonus,
             ${useDailyState ? 'rider_state.peak_s_form' : '0'} AS peak_s_form,
             ${useDailyState ? 'rider_state.peak_r_form' : '0'} AS peak_r_form,
             ${useDailyState ? 'rider_state.active_peak_date' : 'NULL'} AS active_peak_date,
             ${useFreeRaceForm ? 'COALESCE(free_r_form.total, 0)' : '0'} AS free_r_form_bonus,
             ${useDailyState ? 'rider_state.peak_dates_json' : "'[]'"} AS peak_dates_json,
             ${useDailyState ? 'rider_state.health_status' : "'healthy'"} AS health_status,
             ${useDailyState ? 'rider_state.unavailable_until' : 'NULL'} AS unavailable_until,
             ${useDailyState ? 'rider_state.unavailable_days_remaining' : '0'} AS unavailable_days_remaining,
             ${useStageRaceState ? 'COALESCE(race_state.accumulated_random_fatigue, 0)' : '0'} AS accumulated_random_fatigue,
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
      ${useDailyState ? 'LEFT JOIN rider_daily_state rider_state ON rider_state.rider_id = r.id' : ''}
      ${useFreeRaceForm ? 'LEFT JOIN (SELECT rider_id, SUM(amount) AS total FROM rider_r_form_events GROUP BY rider_id) free_r_form ON free_r_form.rider_id = r.id' : ''}
      JOIN stage_entries ON stage_entries.rider_id = r.id
      ${useStageRaceState ? 'LEFT JOIN rider_stage_race_state race_state ON race_state.rider_id = r.id AND race_state.race_id = stage_entries.race_id' : ''}
      WHERE stage_entries.stage_id = ?
        AND stage_entries.status IN ('scheduled', 'started', 'finished')
        AND r.is_retired = 0
      ORDER BY r.overall_rating DESC
    `).all(stageId) as RiderRow[];

    const seasonPointsByRiderId = this.getSeasonPointsByRiderId(season);
    return rows.map((row) => mapRider(row, season, currentDate, seasonPointsByRiderId.get(row.id) ?? 0, stage.stageNumber));
  }

  private attachFormDebugData(riders: Rider[], season: number, currentDate: string): Rider[] {
    if (riders.length === 0) {
      return riders;
    }

    const historyByRiderId = this.loadRiderFormHistoryByRiderId(riders.map((rider) => rider.id), season);
    const seasonStart = `${season}-01-01`;
    const seasonEnd = `${season}-10-31`;

    return riders.map((rider) => {
      const history = historyByRiderId.get(rider.id) ?? [];
      const projection = this.buildFormDebugSeries(rider, history, seasonStart, seasonEnd, currentDate);
      return {
        ...rider,
        formHistory: history,
        formForecast: projection,
      } satisfies Rider;
    });
  }

  private loadRiderFormHistoryByRiderId(riderIds: number[], season: number): Map<number, RiderFormSnapshot[]> {
    const historyByRiderId = new Map<number, RiderFormSnapshot[]>();
    if (riderIds.length === 0 || !tableExists(this.db, 'rider_form_history')) {
      return historyByRiderId;
    }

    const placeholders = riderIds.map(() => '?').join(', ');
    const rows = this.db.prepare(`
      SELECT rider_id, date, s_form, r_form, total_form
      FROM rider_form_history
      WHERE rider_id IN (${placeholders})
        AND date >= ?
        AND date <= ?
      ORDER BY date ASC
    `).all(...riderIds, `${season}-01-01`, `${season}-10-31`) as Array<{
      rider_id: number;
      date: string;
      s_form: number;
      r_form: number;
      total_form: number;
    }>;

    for (const row of rows) {
      const snapshots = historyByRiderId.get(row.rider_id) ?? [];
      snapshots.push({
        date: row.date,
        sForm: row.s_form,
        rForm: row.r_form,
        totalForm: row.total_form,
      });
      historyByRiderId.set(row.rider_id, snapshots);
    }

    return historyByRiderId;
  }

  private buildFormDebugSeries(rider: Rider, history: RiderFormSnapshot[], seasonStart: string, seasonEnd: string, currentDate: string): FormDebugPoint[] {
    const historyByDate = new Map(history.map((entry) => [entry.date, entry]));
    const points: FormDebugPoint[] = [];

    for (let date = seasonStart; date <= seasonEnd; date = addDaysIso(date, 1)) {
      const historyEntry = historyByDate.get(date);
      if (historyEntry) {
        points.push({
          date,
          sForm: historyEntry.sForm,
          rForm: historyEntry.rForm,
          totalForm: historyEntry.totalForm,
          isProjection: date > currentDate,
        });
        continue;
      }

      const projected = resolveProjectionPoint(date, rider.seasonFormPeakDates ?? []);
      points.push({
        date,
        sForm: projected.sForm,
        rForm: projected.rForm,
        totalForm: roundToTwoDecimals(projected.sForm + projected.rForm),
        isProjection: date > currentDate,
      });
    }

    return points;
  }

  public getSeasonStandings(season = this.getCurrentSeason()): SeasonStandingsPayload {
    this.syncSeasonPointEventsForSeason(season);
    if (!tableExists(this.db, 'season_point_events')) {
      return {
        season,
        riderStandings: [],
        teamStandings: [],
      };
    }

    const riderRows = this.db.prepare(`
      SELECT
        season_point_events.rider_id AS rider_id,
        riders.first_name AS rider_first_name,
        riders.last_name AS rider_last_name,
        teams.id AS team_id,
        teams.name AS team_name,
        country.code_3 AS country_code_3,
        SUM(season_point_events.points_awarded) AS points_total
      FROM season_point_events
      JOIN riders ON riders.id = season_point_events.rider_id
      JOIN sta_country country ON country.id = riders.country_id
      LEFT JOIN teams ON teams.id = riders.active_team_id
      WHERE season_point_events.season = ?
      GROUP BY season_point_events.rider_id, riders.first_name, riders.last_name, teams.id, teams.name, country.code_3
      ORDER BY points_total DESC, riders.last_name ASC, riders.first_name ASC
    `).all(season) as RiderSeasonStandingDbRow[];

    const teamRows = this.db.prepare(`
      SELECT
        season_point_events.team_id AS team_id,
        teams.name AS team_name,
        country.code_3 AS country_code_3,
        SUM(season_point_events.points_awarded) AS points_total
      FROM season_point_events
      JOIN teams ON teams.id = season_point_events.team_id
      JOIN sta_country country ON country.id = teams.country_id
      WHERE season_point_events.season = ?
      GROUP BY season_point_events.team_id, teams.name, country.code_3
      ORDER BY points_total DESC, teams.name ASC
    `).all(season) as TeamSeasonStandingDbRow[];

    return {
      season,
      riderStandings: this.mapRiderSeasonStandings(riderRows),
      teamStandings: this.mapTeamSeasonStandings(teamRows),
    };
  }

  public getStageById(id: number): Stage | null {
    const row = this.db.prepare(`
      SELECT id, race_id, stage_number, date, profile, start_elevation, details_csv_file
      FROM stages
      WHERE id = ?
    `).get(id) as StageRow | undefined;
    return row ? mapStage(row) : null;
  }

  public getPreviousGcStandings(raceId: number, stageNumber: number): RealtimeGcStanding[] {
    if (!tableExists(this.db, 'results')) {
      return [];
    }

    const previousStage = this.db.prepare(`
      SELECT stages.id AS stage_id
      FROM stages
      JOIN results ON results.stage_id = stages.id
      WHERE stages.race_id = ?
        AND stages.stage_number < ?
        AND results.result_type_id = ?
      GROUP BY stages.id, stages.stage_number
      ORDER BY stages.stage_number DESC
      LIMIT 1
    `).get(raceId, stageNumber, RESULT_TYPE_IDS.gc) as { stage_id: number } | undefined;
    if (!previousStage) {
      return [];
    }

    const rows = this.db.prepare(`
      SELECT rider_id, rank, time_seconds
      FROM results
      WHERE stage_id = ?
        AND result_type_id = ?
        AND rider_id IS NOT NULL
      ORDER BY rank ASC
    `).all(previousStage.stage_id, RESULT_TYPE_IDS.gc) as Array<{ rider_id: number; rank: number; time_seconds: number }>;
    const leaderTime = rows[0]?.time_seconds ?? 0;
    return rows.map((row) => ({
      riderId: row.rider_id,
      rank: row.rank,
      timeSeconds: row.time_seconds,
      gapSeconds: row.time_seconds - leaderTime,
    }));
  }

  public getPreviousGcStandingsForStage(stageId: number): RealtimeGcStanding[] {
    const stage = this.getStageById(stageId);
    if (!stage) {
      return [];
    }

    return this.getPreviousGcStandings(stage.raceId, stage.stageNumber);
  }

  public getStageResults(stageId: number): StageResultsPayload | null {
    if (!tableExists(this.db, 'results') || !tableExists(this.db, 'result_types')) {
      return null;
    }

    const meta = this.db.prepare(`
      SELECT
        stages.id AS stage_id,
        stages.race_id AS race_id,
        races.name AS race_name,
        stages.stage_number AS stage_number,
        stages.date AS date,
        stages.profile AS profile,
        races.is_stage_race AS is_stage_race,
        races.number_of_stages AS number_of_stages
      FROM stages
      JOIN races ON races.id = stages.race_id
      WHERE stages.id = ?
    `).get(stageId) as StageResultsMetaRow | undefined;
    if (!meta) return null;

    const season = Number.parseInt(meta.date.slice(0, 4), 10);
    if (Number.isFinite(season)) {
      this.syncSeasonPointEventsForSeason(season);
    }

    const resultTypes = this.db.prepare(`
      SELECT id, name
      FROM result_types
      ORDER BY id ASC
    `).all() as ResultTypeRow[];

    const rows = this.db.prepare(`
      SELECT
        results.result_type_id AS result_type_id,
        result_types.name AS result_type_name,
        results.rank AS rank,
        results.time_seconds AS time_seconds,
        results.points AS points,
        results.rider_id AS rider_id,
        riders.first_name AS rider_first_name,
        riders.last_name AS rider_last_name,
        results.team_id AS team_id,
        teams.name AS team_name
      FROM results
      JOIN result_types ON result_types.id = results.result_type_id
      LEFT JOIN riders ON riders.id = results.rider_id
      LEFT JOIN teams ON teams.id = results.team_id
      WHERE results.stage_id = ?
      ORDER BY results.result_type_id ASC, results.rank ASC
    `).all(stageId) as StageResultDbRow[];
    if (rows.length === 0) return null;

    const uciPointsByRiderAndAwardType = this.loadStageUciPointsByRiderAndAwardType(stageId);
    const uciPointsByTeamId = this.loadStageUciPointsByTeamId(stageId);
    const previousGcStandings = meta.stage_number > 1
      ? this.getPreviousGcStandingsForStage(stageId)
      : [];
    const previousGcRanks = previousGcStandings.length > 0
      ? new Map(
          previousGcStandings.map((standing) => [standing.riderId, standing.rank] as const),
        )
      : new Map<number, number>();

    const groupedRows = new Map<number, StageResultDbRow[]>();
    for (const row of rows) {
      const bucket = groupedRows.get(row.result_type_id) ?? [];
      bucket.push(row);
      groupedRows.set(row.result_type_id, bucket);
    }

    const classifications: StageClassification[] = resultTypes
      .map((resultType) => {
        const typeRows = groupedRows.get(resultType.id) ?? [];
        if (typeRows.length === 0) {
          return null;
        }

        const leaderTime = typeRows[0]?.time_seconds ?? null;
        const isGcClassification = resultType.id === RESULT_TYPE_IDS.gc;
        const mappedRows: RaceClassificationRow[] = typeRows.map((row) => {
          const previousGcRank = isGcClassification && row.rider_id != null
            ? previousGcRanks.get(row.rider_id) ?? null
            : null;

          return {
            rank: row.rank,
            riderId: row.rider_id,
            riderName: row.rider_id == null
              ? null
              : `${row.rider_first_name ?? ''} ${row.rider_last_name ?? ''}`.trim(),
            teamId: row.team_id,
            teamName: row.team_name ?? '',
            timeSeconds: row.time_seconds,
            gapSeconds: leaderTime != null && row.time_seconds != null ? row.time_seconds - leaderTime : null,
            points: row.points,
            uciPoints: this.resolveStageRowUciPoints(meta, row, uciPointsByRiderAndAwardType, uciPointsByTeamId),
            gcPreviousRank: isGcClassification ? previousGcRank : undefined,
            gcRankDelta: isGcClassification && previousGcRank != null ? previousGcRank - row.rank : null,
          };
        });

        return {
          resultTypeId: resultType.id,
          resultTypeName: resultType.name,
          rows: mappedRows,
        } satisfies StageClassification;
      })
      .filter((classification): classification is StageClassification => classification != null);

    return {
      raceId: meta.race_id,
      raceName: meta.race_name,
      stageId: meta.stage_id,
      stageNumber: meta.stage_number,
      date: meta.date,
      profile: meta.profile,
      resultTypes: resultTypes.map((resultType) => ({
        id: resultType.id,
        name: resultType.name,
      })) satisfies ResultType[],
      classifications,
      previousGcStandings,
      markerClassifications: tableExists(this.db, 'stage_marker_results')
        ? this.loadStageMarkerClassifications(stageId)
        : [],
    };
  }

  private loadStageMarkerClassifications(stageId: number): StageMarkerClassification[] {
    const rows = this.db.prepare(`
      SELECT
        marker_key,
        marker_label,
        marker_type,
        marker_category,
        km_mark,
        rider_id,
        rank,
        crossing_time_seconds,
        gap_seconds,
        points_awarded,
        photo_finish_score
      FROM stage_marker_results
      WHERE stage_id = ?
      ORDER BY marker_key ASC, rank ASC
    `).all(stageId) as StageMarkerResultDbRow[];

    const grouped = new Map<string, StageMarkerResultDbRow[]>();
    for (const row of rows) {
      const bucket = grouped.get(row.marker_key) ?? [];
      bucket.push(row);
      grouped.set(row.marker_key, bucket);
    }

    return [...grouped.entries()].map(([markerKey, markerRows]) => ({
      markerKey,
      markerLabel: markerRows[0]?.marker_label ?? markerKey,
      markerType: markerRows[0]?.marker_type as StageMarkerClassification['markerType'],
      markerCategory: markerRows[0]?.marker_category ?? null,
      kmMark: markerRows[0]?.km_mark ?? 0,
      entries: markerRows.map((row) => ({
        riderId: row.rider_id,
        rank: row.rank,
        crossingTimeSeconds: row.crossing_time_seconds,
        gapSeconds: row.gap_seconds,
        pointsAwarded: row.points_awarded,
        photoFinishScore: row.photo_finish_score,
      })),
    }));
  }

  public getStagesForRace(raceId: number): Stage[] {
    return this.getStagesByRaceIds([raceId]).get(raceId) ?? [];
  }

  public syncSeasonPointEventsForSeason(season = this.getCurrentSeason()): void {
    if (!tableExists(this.db, 'season_point_events') || !tableExists(this.db, 'results')) {
      return;
    }

    const stages = this.db.prepare(`
      SELECT
        stages.id AS stage_id,
        stages.race_id AS race_id,
        stages.stage_number AS stage_number,
        stages.date AS date,
        stages.profile AS profile,
        races.is_stage_race AS is_stage_race,
        races.number_of_stages AS number_of_stages,
        race_categories_bonus.points_stage AS points_stage,
        race_categories_bonus.points_mountainstage AS points_mountainstage,
        race_categories_bonus.points_one_day AS points_one_day,
        race_categories_bonus.points_gc_final AS points_gc_final,
        race_categories_bonus.points_jersey_leader_day AS points_jersey_leader_day,
        race_categories_bonus.points_jersey_sprint_day AS points_jersey_sprint_day,
        race_categories_bonus.points_jersey_mountain_day AS points_jersey_mountain_day,
        race_categories_bonus.points_jersey_youth_day AS points_jersey_youth_day,
        race_categories_bonus.points_jersey_sprint_final AS points_jersey_sprint_final,
        race_categories_bonus.points_jersey_mountain_final AS points_jersey_mountain_final,
        race_categories_bonus.points_jersey_youth_final AS points_jersey_youth_final
      FROM stages
      JOIN races ON races.id = stages.race_id
      JOIN race_categories ON race_categories.id = races.category_id
      JOIN race_categories_bonus ON race_categories_bonus.id = race_categories.bonus_system_id
      WHERE CAST(substr(stages.date, 1, 4) AS INTEGER) = ?
        AND EXISTS (
          SELECT 1
          FROM results
          WHERE results.stage_id = stages.id AND results.result_type_id = ?
        )
      ORDER BY stages.date ASC, stages.race_id ASC, stages.stage_number ASC
    `).all(season, RESULT_TYPE_IDS.stage) as SeasonPointStageRow[];

    if (stages.length === 0) {
      return;
    }

    const insert = this.db.prepare(`
      INSERT OR IGNORE INTO season_point_events (
        season, race_id, stage_id, rider_id, team_id, award_type, rank, points_awarded, awarded_on
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    this.db.transaction(() => {
      for (const stage of stages) {
        const stageRows = this.loadSeasonPointResultRows(stage.stage_id, RESULT_TYPE_IDS.stage);
        const gcRows = this.loadSeasonPointResultRows(stage.stage_id, RESULT_TYPE_IDS.gc);
        const pointsRows = this.loadSeasonPointResultRows(stage.stage_id, RESULT_TYPE_IDS.points);
        const mountainRows = this.loadSeasonPointResultRows(stage.stage_id, RESULT_TYPE_IDS.mountain);
        const youthRows = this.loadSeasonPointResultRows(stage.stage_id, RESULT_TYPE_IDS.youth);

        if (stage.is_stage_race === 1) {
          this.insertSeasonPointAwards(insert, season, stage, 'stage_result', stageRows, resolveStageResultPointValues(stage));
          this.insertSeasonPointLeaderAward(insert, season, stage, 'gc_leader_day', gcRows[0], stage.points_jersey_leader_day);
          this.insertSeasonPointLeaderAward(insert, season, stage, 'points_leader_day', pointsRows[0], stage.points_jersey_sprint_day);
          this.insertSeasonPointLeaderAward(insert, season, stage, 'mountain_leader_day', mountainRows[0], stage.points_jersey_mountain_day);
          this.insertSeasonPointLeaderAward(insert, season, stage, 'youth_leader_day', youthRows[0], stage.points_jersey_youth_day);

          if (stage.stage_number === stage.number_of_stages) {
            this.insertSeasonPointAwards(insert, season, stage, 'gc_final', gcRows, parseRankedValues(stage.points_gc_final));
            this.insertSeasonPointAwards(insert, season, stage, 'points_final', pointsRows, parseRankedValues(stage.points_jersey_sprint_final));
            this.insertSeasonPointAwards(insert, season, stage, 'mountain_final', mountainRows, parseRankedValues(stage.points_jersey_mountain_final));
            this.insertSeasonPointAwards(insert, season, stage, 'youth_final', youthRows, parseRankedValues(stage.points_jersey_youth_final));
          }
        } else {
          this.insertSeasonPointAwards(insert, season, stage, 'one_day_result', stageRows, parseRankedValues(stage.points_one_day));
        }
      }
    })();
  }

  private getStagesByRaceIds(raceIds: number[]): Map<number, Stage[]> {
    const stagesByRaceId = new Map<number, Stage[]>();
    if (raceIds.length === 0) return stagesByRaceId;

    const placeholders = raceIds.map(() => '?').join(', ');
    const stageRows = this.db.prepare(`
      SELECT id, race_id, stage_number, date, profile, start_elevation, details_csv_file
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

    const orderedStages = [...stages].sort((left, right) => {
      if (left.stageNumber !== right.stageNumber) {
        return left.stageNumber - right.stageNumber;
      }
      if (left.date !== right.date) {
        return left.date.localeCompare(right.date);
      }
      return left.id - right.id;
    });

    let selectedStage = orderedStages[0];
    if (isStageRace) {
      if (currentDate < orderedStages[0].date) {
        selectedStage = orderedStages[0];
      } else {
      const completedStageIds = tableExists(this.db, 'results')
        ? new Set<number>((this.db.prepare(`
            SELECT DISTINCT stage_id
            FROM results
            WHERE result_type_id = ?
              AND stage_id IN (${orderedStages.map(() => '?').join(', ')})
          `).all(RESULT_TYPE_IDS.stage, ...orderedStages.map((stage) => stage.id)) as Array<{ stage_id: number }>).map((row) => row.stage_id))
        : new Set<number>();

        selectedStage = orderedStages.find((stage) => stage.date <= currentDate && !completedStageIds.has(stage.id))
          ?? orderedStages.find((stage) => stage.date >= currentDate && !completedStageIds.has(stage.id))
          ?? orderedStages.find((stage) => stage.date >= currentDate)
          ?? orderedStages.find((stage) => !completedStageIds.has(stage.id))
          ?? orderedStages[orderedStages.length - 1];
      }
    }

    if (!selectedStage) return undefined;

    const summary = summarizeStageProfile(selectedStage.detailsCsvFile, selectedStage.startElevation);
    return {
      stageId: selectedStage.id,
      stageNumber: selectedStage.stageNumber,
      date: selectedStage.date,
      profile: selectedStage.profile,
      detailsCsvFile: selectedStage.detailsCsvFile,
      startElevation: selectedStage.startElevation,
      distanceKm: summary.distanceKm,
      elevationGainMeters: summary.elevationGainMeters,
    };
  }

  private getSeasonPointsByRiderId(season: number): Map<number, number> {
    if (!tableExists(this.db, 'season_point_events')) {
      return new Map();
    }

    const rows = this.db.prepare(`
      SELECT rider_id, SUM(points_awarded) AS points_total
      FROM season_point_events
      WHERE season = ?
      GROUP BY rider_id
    `).all(season) as Array<{ rider_id: number; points_total: number }>;

    return new Map(rows.map((row) => [row.rider_id, row.points_total]));
  }

  private loadStageUciPointsByRiderAndAwardType(stageId: number): Map<string, number> {
    if (!tableExists(this.db, 'season_point_events')) {
      return new Map();
    }

    const rows = this.db.prepare(`
      SELECT rider_id, award_type, SUM(points_awarded) AS points_total
      FROM season_point_events
      WHERE stage_id = ?
      GROUP BY rider_id, award_type
    `).all(stageId) as StageSeasonPointDbRow[];

    return new Map(
      rows.map((row) => [this.getStageUciPointKey(row.rider_id, row.award_type), row.points_total]),
    );
  }

  private loadStageUciPointsByTeamId(stageId: number): Map<number, number> {
    if (!tableExists(this.db, 'season_point_events')) {
      return new Map();
    }

    const rows = this.db.prepare(`
      SELECT team_id, SUM(points_awarded) AS points_total
      FROM season_point_events
      WHERE stage_id = ? AND team_id IS NOT NULL
      GROUP BY team_id
    `).all(stageId) as StageTeamSeasonPointDbRow[];

    return new Map(rows.map((row) => [row.team_id, row.points_total]));
  }

  private resolveStageRowUciPoints(
    meta: StageResultsMetaRow,
    row: StageResultDbRow,
    uciPointsByRiderAndAwardType: Map<string, number>,
    uciPointsByTeamId: Map<number, number>,
  ): number | null {
    if (row.result_type_id === RESULT_TYPE_IDS.team) {
      return row.team_id == null ? null : (uciPointsByTeamId.get(row.team_id) ?? 0);
    }

    if (row.rider_id == null) {
      return null;
    }

    const awardTypes = this.getAwardTypesForStageResult(meta, row.result_type_id);
    if (awardTypes.length === 0) {
      return 0;
    }

    return awardTypes.reduce(
      (sum, awardType) => sum + (uciPointsByRiderAndAwardType.get(this.getStageUciPointKey(row.rider_id as number, awardType)) ?? 0),
      0,
    );
  }

  private getAwardTypesForStageResult(meta: StageResultsMetaRow, resultTypeId: number): SeasonPointAwardType[] {
    if (meta.is_stage_race !== 1) {
      return resultTypeId === RESULT_TYPE_IDS.stage ? ['one_day_result'] : [];
    }

    switch (resultTypeId) {
      case RESULT_TYPE_IDS.stage:
        return ['stage_result'];
      case RESULT_TYPE_IDS.gc:
        return meta.stage_number === meta.number_of_stages ? ['gc_leader_day', 'gc_final'] : ['gc_leader_day'];
      case RESULT_TYPE_IDS.points:
        return meta.stage_number === meta.number_of_stages ? ['points_leader_day', 'points_final'] : ['points_leader_day'];
      case RESULT_TYPE_IDS.mountain:
        return meta.stage_number === meta.number_of_stages ? ['mountain_leader_day', 'mountain_final'] : ['mountain_leader_day'];
      case RESULT_TYPE_IDS.youth:
        return meta.stage_number === meta.number_of_stages ? ['youth_leader_day', 'youth_final'] : ['youth_leader_day'];
      default:
        return [];
    }
  }

  private getStageUciPointKey(riderId: number, awardType: SeasonPointAwardType): string {
    return `${riderId}:${awardType}`;
  }

  private loadSeasonPointResultRows(stageId: number, resultTypeId: number): SeasonPointResultRow[] {
    return this.db.prepare(`
      SELECT rider_id, team_id, rank
      FROM results
      WHERE stage_id = ? AND result_type_id = ? AND rider_id IS NOT NULL AND team_id IS NOT NULL
      ORDER BY rank ASC
    `).all(stageId, resultTypeId) as SeasonPointResultRow[];
  }

  private insertSeasonPointAwards(
    insert: Database.Statement,
    season: number,
    stage: SeasonPointStageRow,
    awardType: SeasonPointAwardType,
    rows: SeasonPointResultRow[],
    pointValues: number[],
  ): void {
    pointValues.forEach((points, index) => {
      const row = rows[index];
      if (!row || points <= 0) {
        return;
      }

      insert.run(
        season,
        stage.race_id,
        stage.stage_id,
        row.rider_id,
        row.team_id,
        awardType,
        row.rank,
        points,
        stage.date,
      );
    });
  }

  private insertSeasonPointLeaderAward(
    insert: Database.Statement,
    season: number,
    stage: SeasonPointStageRow,
    awardType: SeasonPointAwardType,
    row: SeasonPointResultRow | undefined,
    points: number,
  ): void {
    if (!row || points <= 0) {
      return;
    }

    insert.run(
      season,
      stage.race_id,
      stage.stage_id,
      row.rider_id,
      row.team_id,
      awardType,
      row.rank,
      points,
      stage.date,
    );
  }

  private mapRiderSeasonStandings(rows: RiderSeasonStandingDbRow[]): SeasonStandingRow[] {
    const leaderPoints = rows[0]?.points_total ?? 0;
    return rows.map((row, index) => ({
      rank: index + 1,
      riderId: row.rider_id,
      riderName: `${row.rider_first_name} ${row.rider_last_name}`.trim(),
      teamId: row.team_id,
      teamName: row.team_name ?? '—',
      countryCode: row.country_code_3,
      points: row.points_total,
      gapPoints: leaderPoints - row.points_total,
    }));
  }

  private mapTeamSeasonStandings(rows: TeamSeasonStandingDbRow[]): SeasonStandingRow[] {
    const leaderPoints = rows[0]?.points_total ?? 0;
    return rows.map((row, index) => ({
      rank: index + 1,
      riderId: null,
      riderName: null,
      teamId: row.team_id,
      teamName: row.team_name,
      countryCode: row.country_code_3,
      points: row.points_total,
      gapPoints: leaderPoints - row.points_total,
    }));
  }
}
