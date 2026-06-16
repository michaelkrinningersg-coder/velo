import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { Country, FormDebugPoint, Nationality, PrecalculatedRaceIncident, Race, RaceCategory, RaceCategoryBonus, RaceClassificationRow, RaceProgram, RaceProgramParticipant, RaceStageSummary, RealtimeClassificationLeaders, RealtimeClassificationStanding, RealtimeGcStanding, ResultType, Rider, RiderFormSnapshot, RiderHealthStatus, RiderLoadWarningLevel, RiderPotentials, RiderProgramRaceSummary, RiderRaceFormSource, RiderSeasonFormPhase, RiderSkillKey, RiderSkills, RiderStatsPayload, RiderStatsPointsByRaceFormat, RiderStatsPointsByTerrain, RiderStatsRaceBlock, RiderStatsRow, RiderStatsRowType, RiderStatsSeason, Role, SeasonPointAwardType, SeasonStandingCountryRow, SeasonStandingCountryRiderRow, SeasonStandingRow, SeasonStandingsPayload, Stage, StageClassification, StageMarkerCategory, StageMarkerClassification, StageNonFinisherRow, StageResultsPayload, StageScoringRule, Team } from '../../../shared/types';
import { SKILL_WEIGHT_RIDER_COLUMNS, SkillWeightRule } from '../../../shared/skillWeights';
import { summarizeStageProfile } from '../simulation/StageParser';

export const RESULT_TYPE_IDS = {
  stage: 1,
  gc: 2,
  points: 3,
  mountain: 4,
  youth: 5,
  team: 6,
  breakaway: 7,
} as const;

export const RACE_FORM_BUILD_SOURCE_AMOUNT = 0.25;

export function isMountainClassificationType(markerType: StageMarkerClassification['markerType'], markerCategory: StageMarkerClassification['markerCategory']): boolean {
  return markerType === 'climb_top'
    || ((markerType === 'finish_hill' || markerType === 'finish_mountain') && markerCategory != null && markerCategory !== 'Sprint');
}

export function resolveMarkerResultsSortPriority(classification: StageMarkerClassification): number {
  if (isMountainClassificationType(classification.markerType, classification.markerCategory)) return 0;
  if (classification.markerType === 'sprint_intermediate') return 1;
  return 2;
}

export const SEASON_POINT_AWARD_TYPES = [
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

export const RIDER_SKILL_COLUMNS = [
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

export const SEASON_FORM_RISE_DAYS = 56;
export const SEASON_FORM_FALL_DAYS = 14;
export const SEASON_FORM_MAX_RAW = 4;
export const SEASON_FORM_RISE_STEP_RAW = SEASON_FORM_MAX_RAW / SEASON_FORM_RISE_DAYS;
export const DIVISION_BY_TIER: Record<number, Team['division']> = {
  1: 'WorldTour',
  2: 'ProTour',
  3: 'U23',
};

export interface RiderRow {
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
  season_race_days_total: number | null;
  rolling_30d_race_days: number | null;
  accumulated_random_fatigue: number | null;
  incident_day_form_penalty: number | null;
  incident_micro_form_penalty: number | null;
  incident_stamina_penalty: number | null;
  incident_day_form_cap: number | null;
  race_recuperation_penalty: number | null;
  current_recovery_penalty: number | null;
  short_term_fatigue: number | null;
  long_term_fatigue_decayable: number | null;
  long_term_fatigue_locked: number | null;
}

export interface RiderSeasonRaceStats {
  raceDays: number;
  wins: number;
}

export interface CareerRaceDaysSeasonRow {
  season: number;
  raceDays: number;
}

export interface RaceProgramRow {
  id: number;
  name: string;
  peak1_min: number | null;
  peak1_max: number | null;
  peak2_min: number | null;
  peak2_max: number | null;
  peak3_min: number | null;
  peak3_max: number | null;
}

export interface RiderSeasonProgramRow {
  rider_id: number;
  program_id: number;
  program_name: string;
}

export interface TeamRow {
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

export interface RaceRow {
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

export interface StageRow {
  id: number;
  race_id: number;
  stage_number: number;
  date: string;
  profile: Stage['profile'];
  start_elevation: number;
  details_csv_file: string;
  final_spread_start_percent: number;
  final_push_start_percent: number;
  final_spread_difficulty_multiplier: number;
  crash_incident_multiplier: number;
  mechanical_incident_multiplier: number;
  stage_score?: number;
  allowed_weather?: string;
  rolled_weather_id?: number | null;
  wetter_name?: string | null;
  effekt_sturz_min?: number;
  effekt_sturz_max?: number;
  effekt_defekt_min?: number;
  effekt_defekt_max?: number;
  windkanten_gefahr_min?: number;
  windkanten_gefahr_max?: number;
  effekt_fatigue_min?: number;
  effekt_fatigue_max?: number;
  breakaway_bonus_min?: number;
  breakaway_bonus_max?: number;
}

export interface StageResultsMetaRow {
  stage_id: number;
  race_id: number;
  race_name: string;
  stage_number: number;
  date: string;
  profile: Stage['profile'];
  is_stage_race: number;
  number_of_stages: number;
}

export interface RuleRow {
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

export interface SkillWeightRow {
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
  final_spread_late_multiplier: number;
  final_spread_peak_multiplier: number;
  ttt_speed_multiplier: number;
}

export type StageEntryStatus = 'scheduled' | 'started' | 'finished' | 'dns' | 'dnf';

export interface ResultTypeRow {
  id: number;
  name: string;
}

export interface StageResultDbRow {
  result_type_id: number;
  result_type_name: string;
  rank: number;
  time_seconds: number | null;
  points: number | null;
  is_breakaway: number;
  rider_id: number | null;
  rider_first_name: string | null;
  rider_last_name: string | null;
  team_id: number | null;
  team_name: string | null;
  leadout_rider_id?: number | null;
  leadout_bonus?: number | null;
  leadout_rider_last_name?: string | null;
  leadout_rider_country_code?: string | null;
  breakaway_kms?: number | null;
  event_ids?: string | null;
  jerseys_worn?: string | null;
}

export interface StageNonFinisherDbRow {
  rider_id: number;
  rider_first_name: string;
  rider_last_name: string;
  team_id: number | null;
  team_name: string | null;
  country_code: Nationality | null;
  stage_id: number;
  stage_number: number;
  status: 'dnf';
  status_reason: string | null;
}

export interface StageMarkerResultDbRow {
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

export interface StageSeasonPointDbRow {
  rider_id: number;
  award_type: SeasonPointAwardType;
  points_total: number;
}

export interface StageTeamSeasonPointDbRow {
  team_id: number;
  points_total: number;
}

export interface SeasonPointStageRow {
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

export interface SeasonPointResultRow {
  rider_id: number;
  team_id: number;
  rank: number;
}

export interface RiderSeasonStandingDbRow {
  rider_id: number;
  rider_first_name: string;
  rider_last_name: string;
  team_id: number | null;
  team_name: string | null;
  country_code_3: Nationality;
  country_name: string;
  points_total: number;
}

export interface TeamSeasonStandingDbRow {
  team_id: number;
  team_name: string;
  country_code_3: Nationality;
  country_name: string;
  points_total: number;
}

export interface CountrySeasonStandingDbRow {
  country_code_3: Nationality;
  country_name: string;
  points_total: number;
}

export interface RiderStatsStageDbRow {
  season: number;
  race_id: number;
  race_name: string;
  race_category_name: string | null;
  is_stage_race: number;
  start_date: string;
  end_date: string;
  stage_id: number;
  stage_number: number;
  date: string;
  profile: Stage['profile'];
  details_csv_file: string;
  start_elevation: number;
  stage_rank: number | null;
  stage_time_seconds: number | null;
  is_breakaway: number | null;
  gc_rank: number | null;
  stage_points: number | null;
  stage_entry_status: 'finished' | 'dnf';
  stage_entry_status_reason: string | null;
  stage_score: number;
  rolled_weather_id?: number | null;
  rolled_wetter_name?: string | null;
}

export interface RiderStatsFinalDbRow {
  season: number;
  race_id: number;
  race_name: string;
  race_category_name: string | null;
  start_date: string;
  end_date: string;
  stage_id: number;
  stage_number: number;
  date: string;
  profile: Stage['profile'];
  details_csv_file: string;
  start_elevation: number;
  result_type_id: number;
  result_rank: number;
  final_points: number | null;
  stage_score: number;
}

export function emptyRiderStatsPointsByTerrain(): RiderStatsPointsByTerrain {
  return {
    flat: 0,
    hilly: 0,
    mediumMountain: 0,
    mountain: 0,
    timetrial: 0,
    cobble: 0,
  };
}

export function emptyRiderStatsPointsByRaceFormat(): RiderStatsPointsByRaceFormat {
  return {
    stageRace: 0,
    oneDay: 0,
  };
}

export function resolveRiderStatsTerrainBucket(profile: Stage['profile']): keyof RiderStatsPointsByTerrain {
  switch (profile) {
    case 'ITT':
    case 'TTT':
      return 'timetrial';
    case 'Cobble':
    case 'Cobble_Hill':
      return 'cobble';
    case 'Hilly':
    case 'Hilly_Difficult':
      return 'hilly';
    case 'Medium_Mountain':
      return 'mediumMountain';
    case 'Mountain':
    case 'High_Mountain':
      return 'mountain';
    default:
      return 'flat';
  }
}

export function resolveDataCsvDir(): string {
  const candidates = [
    path.resolve(__dirname, '..', '..', '..', 'data', 'csv'),
    path.resolve(__dirname, '..', '..', '..', '..', 'data', 'csv'),
    path.resolve(__dirname, '..', '..', '..', '..', '..', 'data', 'csv'),
    path.resolve(process.cwd(), 'data', 'csv'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'stages.csv'))) {
      return candidate;
    }
  }

  return candidates[0];
}

export function parseCsvLine(line: string): string[] {
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

export function parseRaceList(value: string): number[] {
  if (!value.trim()) return [];
  return value.split(',').map(part => Number.parseInt(part.trim(), 10)).filter(Number.isFinite);
}

export function parseRankedValues(value: string): number[] {
  if (!value.trim()) return [];
  return value.split('|').map((part) => Number.parseInt(part.trim(), 10)).filter(Number.isFinite);
}

export function parsePeakDates(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((entry): entry is string => typeof entry === 'string') : [];
  } catch {
    return [];
  }
}

export function usesMountainStagePoints(profile: Stage['profile']): boolean {
  return !['ITT', 'Flat', 'Rolling', 'Hilly'].includes(profile);
}

export function resolveStageResultPointValues(stage: SeasonPointStageRow): number[] {
  if (stage.profile === 'TTT') {
    return [];
  }

  return parseRankedValues(stage.points_stage);
}

export function isoDateToDayNumber(isoDate: string): number {
  return Math.floor(new Date(`${isoDate}T00:00:00.000Z`).getTime() / 86400000);
}

export function isWinterBreak(dateString: string): boolean {
  const match = dateString.match(/^\d{4}-(\d{2})-(\d{2})/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);

  if (month === 10 && day >= 15) return true;
  if (month === 11 || month === 12 || month === 1) return true;
  if (month === 2 && day <= 15) return true;
  return false;
}

export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export function addDaysIso(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function resolveStageRaceBaseFatigue(stageNumber: number, recuperationSkill: number): number {
  if (stageNumber <= 1) {
    return 0;
  }

  const cappedRecuperation = Math.min(85, recuperationSkill);
  const completedStages = stageNumber - 1;
  const baseFatigueRate = 0.10 + (((85 - cappedRecuperation) / 35) * 0.75);
  const stageProgressionFatigue = 0.01 * ((stageNumber - 2) * completedStages / 2);
  return (completedStages * baseFatigueRate) + stageProgressionFatigue;
}

export function resolveStageRaceFatigueMalus(stageNumber: number | undefined, recuperationSkill: number, accumulatedRandomFatigue: number): number {
  if (stageNumber == null) {
    return 0;
  }

  return roundToTwoDecimals(resolveStageRaceBaseFatigue(stageNumber, recuperationSkill) + accumulatedRandomFatigue);
}

export function resolveEffectiveRecuperationSkill(recuperationSkill: number, stageRaceRecuperationPenalty: number): number {
  return Math.max(0, recuperationSkill - stageRaceRecuperationPenalty);
}

export function resolvePeakPhase(currentDate: string, peakDates: string[]): { phase: 'build' | 'decline'; peakDate: string; elapsedDays: number; actualBuildStartDay?: number } | null {
  const currentDay = isoDateToDayNumber(currentDate);
  const sortedPeaks = [...peakDates].sort((a, b) => isoDateToDayNumber(a) - isoDateToDayNumber(b));

  for (let i = 0; i < sortedPeaks.length; i++) {
    const peakDate = sortedPeaks[i];
    const peakDay = isoDateToDayNumber(peakDate);
    const prevPeakDay = i > 0 ? isoDateToDayNumber(sortedPeaks[i - 1]) : Number.NEGATIVE_INFINITY;

    if (currentDay >= peakDay && currentDay < peakDay + SEASON_FORM_FALL_DAYS) {
      return { phase: 'decline', peakDate, elapsedDays: currentDay - peakDay };
    }

    const seasonYear = peakDate.slice(0, 4);
    const seasonStartDay = isoDateToDayNumber(`${seasonYear}-01-01`);
    const idealBuildStart = Math.max(seasonStartDay, peakDay - SEASON_FORM_RISE_DAYS);
    const prevDeclineEnd = prevPeakDay + SEASON_FORM_FALL_DAYS;
    const actualBuildStartDay = Math.max(idealBuildStart, prevDeclineEnd);

    if (currentDay >= actualBuildStartDay && currentDay < peakDay) {
      return { phase: 'build', peakDate, elapsedDays: peakDay - currentDay, actualBuildStartDay };
    }
  }

  return null;
}

export function resolveDeclineValue(peakValue: number, elapsedDays: number): number {
  if (elapsedDays >= SEASON_FORM_FALL_DAYS) {
    return 0;
  }

  const boundedPeakValue = Math.min(SEASON_FORM_MAX_RAW, Math.max(0, peakValue));
  return roundToTwoDecimals(Math.max(0, boundedPeakValue * (1 - (elapsedDays / SEASON_FORM_FALL_DAYS))));
}

export function resolveEffectiveSeasonForm(rawSeasonForm: number): number {
  return roundToTwoDecimals(Math.min(SEASON_FORM_MAX_RAW, Math.max(0, rawSeasonForm)));
}

export function resolveProjectionPoint(date: string, peakDates: string[]): { sForm: number; rForm: number } {
  const phase = resolvePeakPhase(date, peakDates);
  if (!phase) {
    return { sForm: 0, rForm: 0 };
  }

  if (phase.phase === 'build') {
    const currentDay = isoDateToDayNumber(date);
    const actualBuildStartDay = phase.actualBuildStartDay ?? (isoDateToDayNumber(phase.peakDate) - SEASON_FORM_RISE_DAYS);
    const daysSinceBuildStarted = currentDay - actualBuildStartDay + 1;
    const sFormRaw = roundToTwoDecimals(Math.min(SEASON_FORM_MAX_RAW, Math.max(0, daysSinceBuildStarted * SEASON_FORM_RISE_STEP_RAW)));
    const sForm = resolveEffectiveSeasonForm(sFormRaw);
    return { sForm, rForm: 0 };
  }

  return {
    sForm: resolveEffectiveSeasonForm(resolveDeclineValue(SEASON_FORM_MAX_RAW, phase.elapsedDays)),
    rForm: 0,
  };
}

export function resolveRiderSeasonFormPhase(currentDate: string, peakDates: string[]): RiderSeasonFormPhase {
  const phase = resolvePeakPhase(currentDate, peakDates);
  if (!phase) return 'neutral';
  if (phase.phase === 'build') return 'rise';
  return 'fall';
}

export function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName) as { name: string } | undefined;
  return row != null;
}

export function columnExists(db: Database.Database, tableName: string, columnName: string): boolean {
  if (!tableExists(db, tableName)) {
    return false;
  }

  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
  return columns.some((column) => column.name === columnName);
}

export function mapSkillObject<T extends RiderSkills | RiderPotentials>(row: RiderRow, prefix = ''): T {
  const entries = RIDER_SKILL_COLUMNS.map(([key, column]) => [key, row[`${prefix}${column}` as keyof RiderRow]]);
  return Object.fromEntries(entries) as T;
}

export function mapCountry(row: Pick<RiderRow, 'country_id' | 'country_name' | 'country_code_3' | 'country_continent' | 'country_regen_rating' | 'country_number_regen_min' | 'country_number_regen_max'>): Country {
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

export function mapRole(row: Pick<RiderRow, 'role_id' | 'role_name' | 'role_weighting'>): Role | undefined {
  if (row.role_id == null || row.role_name == null || row.role_weighting == null) {
    return undefined;
  }

  return {
    id: row.role_id,
    name: row.role_name,
    weighting: row.role_weighting,
  };
}

export function mapRider(row: RiderRow, currentYear: number, _currentDate: string, seasonPoints = 0, stageNumber?: number): Rider {
  const country = mapCountry(row);
  const role = mapRole(row);
  const peakDates = parsePeakDates(row.peak_dates_json);
  const accumulatedRandomFatigue = row.accumulated_random_fatigue ?? 0;
  const stageRaceRecuperationPenalty = (row.race_recuperation_penalty ?? 0) + (row.current_recovery_penalty ?? 0);
  const totalRaceFormBonus = Math.min(4.0, roundToTwoDecimals((row.race_form_bonus ?? 0) + (row.free_r_form_bonus ?? 0)));
  
  const shortTermFatigueMalus = row.short_term_fatigue ?? 0.0;
  const longTermFatigueMalus = roundToTwoDecimals((row.long_term_fatigue_decayable ?? 0.0) + (row.long_term_fatigue_locked ?? 0.0));
  const totalFatigueLoadMalus = roundToTwoDecimals(shortTermFatigueMalus + longTermFatigueMalus);
  
  let shortTermFatigueWarning: RiderLoadWarningLevel = 'none';
  if (shortTermFatigueMalus > 3.5) {
    shortTermFatigueWarning = 'critical';
  } else if (shortTermFatigueMalus > 1.0) {
    shortTermFatigueWarning = 'warning';
  }

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
    seasonRaceDaysTotal: row.season_race_days_total ?? 0,
    rolling30dRaceDays: row.rolling_30d_race_days ?? 0,
    formBonus: resolveEffectiveSeasonForm(row.form_bonus ?? 0),
    raceFormBonus: totalRaceFormBonus,
    longTermFatigueMalus,
    longTermFatigueDecayable: row.long_term_fatigue_decayable ?? 0.0,
    longTermFatigueLocked: row.long_term_fatigue_locked ?? 0.0,
    shortTermFatigueMalus,
    totalFatigueLoadMalus,
    shortTermFatigueWarning,
    peakSForm: resolveEffectiveSeasonForm(row.peak_s_form ?? 0),
    peakRForm: row.peak_r_form ?? 0,
    activePeakDate: row.active_peak_date,
    fatigueMalus: resolveStageRaceFatigueMalus(
      stageNumber,
      resolveEffectiveRecuperationSkill(row.skill_recuperation, stageRaceRecuperationPenalty),
      accumulatedRandomFatigue,
    ),
    accumulatedRandomFatigue,
    stageRaceDayFormPenalty: row.incident_day_form_penalty ?? 0,
    stageRaceMicroFormPenalty: row.incident_micro_form_penalty ?? 0,
    stageRaceStaminaPenalty: row.incident_stamina_penalty ?? 0,
    stageRaceDayFormCap: row.incident_day_form_cap,
    stageRaceRecuperationPenalty,
    seasonFormPeakDates: peakDates,
    seasonFormPhase: resolveRiderSeasonFormPhase(_currentDate, peakDates),
    healthStatus: row.health_status ?? 'healthy',
    unavailableUntil: row.unavailable_until,
    unavailableDaysRemaining: row.unavailable_days_remaining ?? 0,
    healthStatusLabel: row.health_status === 'ill' ? 'Krankheit' : row.health_status === 'injured' ? 'Verletzung' : null,
    isUnavailable: (row.unavailable_days_remaining ?? 0) > 0,
  };
}

export function mapTeam(row: TeamRow): Team {
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

export function mapRaceCategoryBonus(row: RaceRow): RaceCategoryBonus {
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

export function mapRaceCategory(row: RaceRow): RaceCategory {
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

export function mapStageScoringRule(row: RuleRow): StageScoringRule {
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

export function mapSkillWeightRule(row: SkillWeightRow): SkillWeightRule {
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
    finalSpreadLateMultiplier: row.final_spread_late_multiplier,
    finalSpreadPeakMultiplier: row.final_spread_peak_multiplier,
    tttSpeedMultiplier: row.ttt_speed_multiplier,
  };
}

export function getDeterministicRandom(seedStr: string): number {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

export function getDeterministicWeatherEffect(stageId: number, effectKey: string, min: number, max: number): number {
  if (min === max) return min;
  return min + getDeterministicRandom(`${stageId}:${effectKey}`) * (max - min);
}

export function mapStage(row: StageRow): Stage {
  const summary = summarizeStageProfile(row.details_csv_file, row.start_elevation);
  
  const rolledWeatherId = row.rolled_weather_id ?? null;
  const rolledWetterName = row.wetter_name ?? null;

  // Compute effects deterministically if weather is rolled
  let rolledEffektSturz = 0;
  let rolledEffektDefekt = 0;
  let rolledWindkantenGefahr = 0;
  let rolledEffektFatigue = 0;
  let rolledBreakawayBonus = 0;

  if (rolledWeatherId != null) {
    rolledEffektSturz = getDeterministicWeatherEffect(row.id, 'sturz', row.effekt_sturz_min ?? 0, row.effekt_sturz_max ?? 0);
    rolledEffektDefekt = getDeterministicWeatherEffect(row.id, 'defekt', row.effekt_defekt_min ?? 0, row.effekt_defekt_max ?? 0);
    rolledWindkantenGefahr = getDeterministicWeatherEffect(row.id, 'windkante', row.windkanten_gefahr_min ?? 0, row.windkanten_gefahr_max ?? 0);
    rolledEffektFatigue = getDeterministicWeatherEffect(row.id, 'fatigue', row.effekt_fatigue_min ?? 0, row.effekt_fatigue_max ?? 0);
    rolledBreakawayBonus = getDeterministicWeatherEffect(row.id, 'breakaway', row.breakaway_bonus_min ?? 0, row.breakaway_bonus_max ?? 0);
  }

  return {
    id: row.id,
    raceId: row.race_id,
    stageNumber: row.stage_number,
    date: row.date,
    profile: row.profile,
    detailsCsvFile: row.details_csv_file,
    startElevation: row.start_elevation,
    finalSpreadStartPercent: row.final_spread_start_percent,
    finalPushStartPercent: row.final_push_start_percent,
    finalSpreadDifficultyMultiplier: row.final_spread_difficulty_multiplier,
    crashIncidentMultiplier: row.crash_incident_multiplier,
    mechanicalIncidentMultiplier: row.mechanical_incident_multiplier,
    distanceKm: summary.distanceKm,
    elevationGainMeters: summary.elevationGainMeters,
    profileScore: row.stage_score,
    allowedWeather: row.allowed_weather,
    rolledWeatherId,
    rolledWetterName,
    rolledEffektSturz,
    rolledEffektDefekt,
    rolledWindkantenGefahr,
    rolledEffektFatigue,
    rolledBreakawayBonus,
  };
}

export function loadFallbackStages(raceIds: number[]): StageRow[] {
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
        final_spread_start_percent: Number(record['final_spread_start_percent'] ?? '70') || 70,
        final_push_start_percent: Number(record['final_push_start_percent'] ?? '90') || 90,
        final_spread_difficulty_multiplier: Number(record['final_spread_difficulty_multiplier'] ?? '1') || 1,
        crash_incident_multiplier: Number(record['crash_incident_multiplier'] ?? '1') || 1,
        mechanical_incident_multiplier: Number(record['mechanical_incident_multiplier'] ?? '1') || 1,
        allowed_weather: record['allowed_weather'] ?? '1|2|3|4|5|6|7',
      } satisfies StageRow;
    })
    .filter((row) => raceIds.includes(row.race_id) && Number.isFinite(row.id) && Number.isFinite(row.race_id));
}

export function mapRace(row: RaceRow, stages: Stage[]): Race {
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

export function mapRaceProgram(row: RaceProgramRow): RaceProgram {
  return {
    id: row.id,
    name: row.name,
    peak1Min: row.peak1_min,
    peak1Max: row.peak1_max,
    peak2Min: row.peak2_min,
    peak2Max: row.peak2_max,
    peak3Min: row.peak3_min,
    peak3Max: row.peak3_max,
  };
}

export function mapRaceWithSummary(row: RaceRow, stages: Stage[], upcomingStage: RaceStageSummary | undefined): Race {
  return {
    ...mapRace(row, stages),
    ...(upcomingStage ? { upcomingStage } : {}),
  };
}

export function buildRaceSelect(): string {
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

