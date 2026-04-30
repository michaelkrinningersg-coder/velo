// ============================================================
//  SHARED TYPES – verwendet von Backend und Frontend
// ============================================================

// ------ Fahrer -----------------------------------------------

export type Nationality =
  | 'BEL' | 'FRA' | 'ITA' | 'ESP' | 'NED' | 'GER' | 'GBR' | 'USA'
  | 'COL' | 'AUS' | 'DEN' | 'NOR' | 'SLO' | 'POR' | 'SUI' | 'POL'
  | 'AUT' | 'LUX' | 'IRE' | 'CZE' | 'SVK' | 'KAZ' | 'RSA' | 'UAE'
  | 'BHR' | 'HUN' | 'OTH';

export interface Country {
  id: number;
  name: string;
  code3: Nationality;
  continent: string;
  regenRating: number;
  numberRegenMin: number;
  numberRegenMax: number;
}

export interface Role {
  id: number;
  name: string;
  weighting: number;
}

export interface TypeRider {
  id: number;
  key: RiderSpecialization;
  displayName: string;
  isStageFocus: boolean;
  isOneDayFocus: boolean;
}

export type RiderSkillKey =
  | 'flat'
  | 'mountain'
  | 'mediumMountain'
  | 'hill'
  | 'timeTrial'
  | 'prologue'
  | 'cobble'
  | 'sprint'
  | 'acceleration'
  | 'downhill'
  | 'attack'
  | 'stamina'
  | 'resistance'
  | 'recuperation'
  | 'bikeHandling';

export type RiderSpecialization =
  | 'Cobble'
  | 'Berg'
  | 'Hill'
  | 'Sprint'
  | 'Timetrial'
  | 'Attacker';

export type RiderSkills = Record<RiderSkillKey, number>;
export type RiderPotentials = Record<RiderSkillKey, number>;

export type ContractStatus = 'active' | 'expired' | 'future';

export interface Contract {
  id: number;
  riderId: number;
  teamId: number;
  startSeason: number;
  endSeason: number;
  status: ContractStatus;
}

export interface Rider {
  id: number;
  firstName: string;
  lastName: string;
  nationality: Nationality;
  countryId?: number;
  country?: Country;
  roleId?: number | null;
  role?: Role;
  riderTypeId?: number;
  specialization1Id?: number | null;
  specialization2Id?: number | null;
  specialization3Id?: number | null;
  birthYear: number;
  age?: number;
  peakAge?: number;
  declineAge?: number;
  retirementAge?: number;
  skillDevelopment?: number;
  potential: number;
  overallRating: number;
  skills: RiderSkills;
  potentials: RiderPotentials;
  riderType: RiderSpecialization;
  specialization1: RiderSpecialization | null;
  specialization2: RiderSpecialization | null;
  specialization3: RiderSpecialization | null;
  isStageRacer: boolean;
  isOneDayRacer: boolean;
  hasGrandTourTag: boolean;
  hasStageRaceTag: boolean;
  hasOneDayClassicTag: boolean;
  favoriteRaces: number[];
  nonFavoriteRaces: number[];
  activeTeamId: number | null;
  activeContractId: number | null;
  contractEndSeason?: number | null;
  seasonPoints?: number;
}

// ------ Team -------------------------------------------------

export type DivisionLevel = 'WorldTour' | 'ProTour' | 'U23';

export interface Team {
  id: number;
  name: string;
  abbreviation: string;
  divisionId: number;
  u23TeamId: number | null;
  mainTeamId?: number | null;
  isPlayerTeam: boolean;
  countryCode: Nationality;
  countryId?: number;
  country?: Country;
  colorPrimary: string;
  colorSecondary: string;
  aiFocus1: number;
  aiFocus2: number;
  aiFocus3: number;
  u23TeamName?: string;
  mainTeamName?: string;
  divisionName?: string;
  shortName?: string;
  nationality?: Nationality;
  division?: DivisionLevel;
  riderIds?: number[];
}

export interface DivisionTeam {
  id: number;
  name: string;
  tier: number;
  maxTeams: number;
  minRosterSize: number;
  maxRosterSize: number;
}

// ------ Rennen -----------------------------------------------

export type RaceCategoryTier = 1 | 2 | 3;

export type StageProfile =
  | 'Flat'
  | 'Rolling'
  | 'Hilly'
  | 'Hilly_Difficult'
  | 'Medium_Mountain'
  | 'Mountain'
  | 'High_Mountain'
  | 'ITT'
  | 'TTT'
  | 'Cobble'
  | 'Cobble_Hill';

export type StageTerrain =
  | 'Flat'
  | 'Hill'
  | 'Medium_Mountain'
  | 'Mountain'
  | 'High_Mountain'
  | 'Cobble'
  | 'Cobble_Hill'
  | 'Abfahrt'
  | 'Sprint';

export type StageFinishMarkerType = 'finish_flat' | 'finish_TT' | 'finish_hill' | 'finish_mountain';

export type StageMarkerType =
  | 'start'
  | 'climb_start'
  | 'climb_top'
  | 'sprint_intermediate'
  | StageFinishMarkerType;

export type StageMarkerCategory = 'HC' | '1' | '2' | '3' | '4' | 'Sprint';

export interface StageMarker {
  type: StageMarkerType;
  name: string | null;
  cat: StageMarkerCategory | null;
}

export interface StageProfilePoint {
  kmMark: number;
  elevation: number;
  terrain: StageTerrain;
  techLevel: number;
  windExp: number;
  markers: StageMarker[];
}

export interface ParsedStageSegment {
  start_km: number;
  end_km: number;
  length_km: number;
  start_elevation: number;
  end_elevation: number;
  gradient_percent: number;
  terrain: StageTerrain;
  tech_level: number;
  wind_exp: number;
  start_markers?: StageMarker[];
  end_markers?: StageMarker[];
}

export interface RaceCategoryBonus {
  id: number;
  name: string;
  bonusSecondsFinal: string;
  bonusSecondsIntermediate: string;
  pointsStage: string;
  pointsSprintFinish: string;
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

export interface RaceCategory {
  id: number;
  name: string;
  tier: RaceCategoryTier;
  numberOfTeams: number;
  numberOfRiders: number;
  bonusSystemId: number;
  bonusSystem?: RaceCategoryBonus;
}

export interface RaceStageSummary {
  stageId: number;
  stageNumber: number;
  date: string;
  profile: StageProfile;
  detailsCsvFile: string;
  distanceKm: number;
  elevationGainMeters: number;
}

export interface Race {
  id: number;
  name: string;
  countryId: number;
  categoryId: number;
  isStageRace: boolean;
  numberOfStages: number;
  startDate: string;
  endDate: string;
  prestige: number;
  country?: Country;
  category?: RaceCategory;
  stages?: Stage[];
  upcomingStage?: RaceStageSummary;
}

export interface Stage {
  id: number;
  raceId: number;
  stageNumber: number;
  date: string;
  profile: StageProfile;
  detailsCsvFile: string;
}

// ------ Simulation -------------------------------------------

export interface TimeTrialEntry {
  rider: Rider;
  dayFormFactor: number;
  finishTimeSeconds: number;
  gapSeconds: number;
  finishTimeFormatted: string;
  gapFormatted: string;
}

export interface TimeTrialResult {
  raceId: number;
  raceName: string;
  distanceKm: number;
  season: number;
  date: string;
  entries: TimeTrialEntry[];
}

// ------ Savegame / Karriere ----------------------------------

export interface SavegameMeta {
  id: number;
  filename: string;
  careerName: string;
  teamName: string;
  currentSeason: number;
  lastSaved: string;
}

// ------ Globaler Spielzustand --------------------------------

export interface GameState {
  currentDate: string;
  season: number;
  isGameOver: boolean;
  formattedDate: string;
  hasRaceToday: boolean;
  racesTodayCount: number;
}

export interface PendingStage {
  stageId: number;
  raceId: number;
  raceName: string;
  stageNumber: number;
  date: string;
  profile: StageProfile;
  detailsCsvFile: string;
  isStageRace: boolean;
}

export interface GameStatus {
  currentDate: string;
  season: number;
  isRaceDay: boolean;
  currentStageId: number | null;
  pendingStages: PendingStage[];
}

export interface ResultType {
  id: number;
  name: string;
}

export interface RaceClassificationRow {
  rank: number;
  riderId: number | null;
  riderName: string | null;
  teamId: number | null;
  teamName: string;
  timeSeconds: number | null;
  gapSeconds: number | null;
  points: number | null;
  uciPoints: number | null;
}

export type StageResultRow = RaceClassificationRow;

export interface StageClassification {
  resultTypeId: number;
  resultTypeName: string;
  rows: RaceClassificationRow[];
}

export interface StageResultsPayload {
  raceId: number;
  raceName: string;
  stageId: number;
  stageNumber: number;
  date: string;
  profile: StageProfile;
  resultTypes: ResultType[];
  classifications: StageClassification[];
}

export interface QuickSimResponse {
  raceId: number;
  raceName: string;
  stageId: number;
  stageNumber: number;
  date: string;
  profile: StageProfile;
  resultTypes: ResultType[];
}

export type SeasonPointAwardType =
  | 'stage_result'
  | 'one_day_result'
  | 'gc_leader_day'
  | 'points_leader_day'
  | 'mountain_leader_day'
  | 'youth_leader_day'
  | 'gc_final'
  | 'points_final'
  | 'mountain_final'
  | 'youth_final';

export interface SeasonStandingRow {
  rank: number;
  riderId: number | null;
  riderName: string | null;
  teamId: number | null;
  teamName: string;
  countryCode: Nationality | null;
  points: number;
  gapPoints: number;
}

export interface SeasonStandingsPayload {
  season: number;
  riderStandings: SeasonStandingRow[];
  teamStandings: SeasonStandingRow[];
}

// ------ Generische API-Response ------------------------------

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ------ Stage Editor ----------------------------------------

export type RouteImportFormat = 'gpx' | 'tcx';

export interface StageEditorWaypoint {
  kmMark: number;
  elevation: number;
  terrain: StageTerrain;
  techLevel: number;
  windExp: number;
  markers: StageMarker[];
}

export interface StageEditorClimb {
  startKm: number;
  endKm: number;
  distanceKm: number;
  gainMeters: number;
  avgGradient: number;
  category: Extract<StageMarkerCategory, 'HC' | '1' | '2' | '3' | '4'>;
}

export interface StageEditorDraft {
  routeName: string;
  sourceFormat: RouteImportFormat;
  totalDistanceKm: number;
  elevationGainMeters: number;
  suggestedProfile: StageProfile;
  waypoints: StageEditorWaypoint[];
  climbs: StageEditorClimb[];
  warnings: string[];
}

export interface StageEditorImportRequest {
  fileName: string;
  fileContent: string;
}

export interface StageEditorMetadata {
  stageId: number;
  raceId: number;
  stageNumber: number;
  date: string;
  profile: StageProfile;
  detailsCsvFile: string;
}

export interface StageEditorExportRequest {
  metadata: StageEditorMetadata;
  draft: StageEditorDraft;
}

export interface StageEditorExportPayload {
  stagesCsv: string;
  stageDetailsCsv: string;
  stagesFileName: string;
  stageDetailsFileName: string;
 }
