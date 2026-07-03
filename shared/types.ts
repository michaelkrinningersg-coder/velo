// ============================================================
//  SHARED TYPES â€“ verwendet von Backend und Frontend
// ============================================================

// ------ Fahrer -----------------------------------------------

export type Nationality = string;

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
  | 'Attacker'
  | 'Flat';

export type RiderSkills = Record<RiderSkillKey, number>;
export type RiderPotentials = Record<RiderSkillKey, number>;
export type RiderHealthStatus = 'healthy' | 'ill' | 'injured';

export type ContractStatus = 'active' | 'expired' | 'future';

export interface Contract {
  id: number;
  riderId: number;
  teamId: number;
  startSeason: number;
  endSeason: number;
  status: ContractStatus;
}

export interface FormDebugPoint {
  date: string;
  totalForm: number;
  sForm: number;
  rForm: number;
  isProjection: boolean;
}

export interface RiderFormSnapshot {
  date: string;
  totalForm: number;
  sForm: number;
  rForm: number;
  shortFatigue?: number;
  longFatigue?: number;
  combinedFatigue?: number;
}

export interface RiderRaceFormSource {
  date: string;
  amount: number;
  label: string;
  type: 'build' | 'free';
}

export type RiderLoadWarningLevel = 'none' | 'warning' | 'critical';

export type RiderSeasonFormPhase = 'rise' | 'fall' | 'neutral';

export interface RaceProgram {
  id: number;
  name: string;
  peak1Min?: number | null;
  peak1Max?: number | null;
  peak2Min?: number | null;
  peak2Max?: number | null;
  peak3Min?: number | null;
  peak3Max?: number | null;
}

export interface RaceProgramRace {
  id: number;
  programId: number;
  raceId: number;
}

export interface RaceProgramProbabilityRule {
  id: number;
  roleName: string;
  spec1: number | null;
  spec2: number | null;
  spec3: number | null;
  programId: number;
  probability: number;
}

export interface RiderSeasonProgram {
  id: number;
  season: number;
  riderId: number;
  programId: number;
  assignedOn: string;
  program?: RaceProgram;
}

export interface RiderProgramRaceSummary {
  program: RaceProgram;
  races: Race[];
}

export interface RiderStatsPointsByTerrain {
  flat: number;
  hilly: number;
  mediumMountain: number;
  mountain: number;
}

export interface RiderStatsPointsByRaceFormat {
  stageRace: number;
  oneDay: number;
}

export interface RaceProgramParticipant {
  rider: Rider;
  team: Team | null;
  program: RaceProgram;
}

export interface RaceRosterEntry {
  riderId: number;
  firstName: string;
  lastName: string;
  countryCode: string | null;
  teamId: number | null;
  teamName: string | null;
  roleId: number | null;
  roleName: string | null;
  overallRating: number;
  specialization1: string | null;
  specialization2: string | null;
  /** Whether this rider has not finished (DNF/OTL) in the race */
  hasDropped: boolean;
  gcRank?: number | null;
  dropoutStatus?: 'dns' | 'dnf' | null;
  dropoutReason?: string | null;
}

export interface RaceRosterPayload {
  raceId: number;
  raceName: string;
  entries: RaceRosterEntry[];
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
  yearStartSkills?: Record<RiderSkillKey, number>;
  mentorBoosts?: Partial<Record<RiderSkillKey, number>>;
  racePreferenceBoosts?: Partial<Record<RiderSkillKey, number>>;
  mentorName?: string;
  mentorCountryCode?: string;
  mentorAge?: number;
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
  seasonRaceDays?: number;
  seasonRaceDaysTotal?: number;
  rolling30dRaceDays?: number;
  seasonWins?: number;
  formBonus?: number;
  raceFormBonus?: number;
  longTermFatigueMalus?: number;
  longTermFatigueDecayable?: number;
  longTermFatigueLocked?: number;
  shortTermFatigueMalus?: number;
  totalFatigueLoadMalus?: number;
  shortTermFatigueWarning?: RiderLoadWarningLevel;
  peakSForm?: number;
  peakRForm?: number;
  activePeakDate?: string | null;
  fatigueMalus?: number;
  homeEffect?: 'normal_home' | 'super_home' | 'home_pressure' | null;
  homeEffectSkills?: RiderSkillKey[] | null;
  accumulatedRandomFatigue?: number;
  stageRaceDayFormPenalty?: number;
  stageRaceMicroFormPenalty?: number;
  stageRaceStaminaPenalty?: number;
  stageRaceDayFormCap?: number | null;
  stageRaceRecuperationPenalty?: number;
  hasSuperform?: boolean;
  hasSupermalus?: boolean;
  specialFormDelta?: number;
  seasonFormPeakDates?: string[];
  seasonFormPhase?: RiderSeasonFormPhase;
  seasonProgram?: RaceProgram | null;
  seasonProgramRaceIds?: number[];
  raceFormSources?: RiderRaceFormSource[];
  formHistory?: RiderFormSnapshot[];
  formForecast?: FormDebugPoint[];
  healthStatus?: RiderHealthStatus;
  unavailableUntil?: string | null;
  unavailableDaysRemaining?: number;
  healthStatusLabel?: string | null;
  isUnavailable?: boolean;
  weatherProfileId?: number;
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

export interface StageMarkerClassificationEntry {
  riderId: number;
  rank: number;
  crossingTimeSeconds: number;
  gapSeconds: number;
  photoFinishScore: number;
  pointsAwarded?: number;
}

export interface StageMarkerClassification {
  markerKey: string;
  markerLabel: string;
  markerType: StageMarkerType;
  markerCategory: StageMarkerCategory | null;
  kmMark: number;
  entries: StageMarkerClassificationEntry[];
}

export interface StageProfilePoint {
  kmMark: number;
  elevation: number;
  terrain: StageTerrain;
  techLevel: number;
  windExp: number;
  markers: StageMarker[];
}

export interface StageCsvSegment {
  startElevation: number;
  lengthKm: number;
  gradientPercent: number;
  terrain: StageTerrain;
  techLevel: number;
  windExp: number;
  markers: StageMarker[];
  endMarkers: StageMarker[];
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
  gradientModifierCached?: number;
  endMeterCached?: number;
}

export interface ParsedStageSummary {
  distanceKm: number;
  elevationGainMeters: number;
  points: StageProfilePoint[];
  segments: ParsedStageSegment[];
}

export interface RaceCategoryBonus {
  id: number;
  name: string;
  bonusSecondsFinal: string;
  bonusSecondsIntermediate: string;
  pointsStage: string;
  pointsMountainStage: string;
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

export type SkillWeightSimulationMode = 'road' | 'itt' | 'ttt';

export interface SkillWeightRule {
  id: number;
  simulationMode: SkillWeightSimulationMode;
  terrain: StageTerrain;
  weights: Partial<Record<RiderSkillKey, number>>;
  finalSpreadLateMultiplier: number;
  finalSpreadPeakMultiplier: number;
  tttSpeedMultiplier: number;
}

export type StageScoringRuleAppliesTo = 'sprint_intermediate' | 'climb_top' | 'finish';

export interface StageScoringRule {
  id: number;
  ruleKey: string;
  appliesTo: StageScoringRuleAppliesTo;
  markerType: 'sprint_intermediate' | 'climb_top' | 'finish_flat' | 'finish_hill' | 'finish_mountain';
  markerCategory: StageMarkerCategory | null;
  weights: Partial<Record<RiderSkillKey, number>>;
}

export interface RaceCategory {
  id: number;
  name: string;
  tier: RaceCategoryTier;
  numberOfTeams: number;
  numberOfRiders: number;
  bonusSystemId: number;
  bonusSystem?: RaceCategoryBonus;
  homeSelectionProbability: number;
}

export interface RaceStageSummary {
  stageId: number;
  stageNumber: number;
  date: string;
  profile: StageProfile;
  detailsCsvFile: string;
  startElevation: number;
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
  startElevation: number;
  finalSpreadStartPercent: number;
  finalPushStartPercent: number;
  finalSpreadDifficultyMultiplier: number;
  crashIncidentMultiplier: number;
  mechanicalIncidentMultiplier: number;
  distanceKm?: number;
  elevationGainMeters?: number;
  profileScore?: number;
  allowedWeather?: string;
  rolledWeatherId?: number | null;
  rolledWetterName?: string | null;
  rolledEffektSturz?: number;
  rolledEffektDefekt?: number;
  rolledWindkantenGefahr?: number;
  rolledEffektFatigue?: number;
  rolledBreakawayBonus?: number;
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

export interface RaceSimMessage {
  id: number;
  elapsedSeconds: number;
  riderId: number | null;
  riderName: string | null;
  riderTeamId: number | null;
  secondaryRiders?: Array<{ riderName: string; riderTeamId: number | null }>;
  type: 'incident' | 'support_wait' | 'support_resume' | 'dnf' | 'attack' | 'counter_attack' | 'superteam';
  tone: 'neutral' | 'warning' | 'danger';
  title: string;
  detail: string;
  kmMark?: number | null;
  isMassCrash?: boolean;
  isMassCrashTrigger?: boolean;
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
  draftStatus?: 'not_started' | 'active' | 'completed';
  draftCurrentPickNumber?: number;
  draftSeason?: number | null;
}

export interface PendingStage {
  stageId: number;
  raceId: number;
  raceName: string;
  stageNumber: number;
  date: string;
  profile: StageProfile;
  detailsCsvFile: string;
  startElevation: number;
  isStageRace: boolean;
}

export interface GameStatus {
  currentDate: string;
  season: number;
  isRaceDay: boolean;
  currentStageId: number | null;
  pendingStages: PendingStage[];
  draftStatus?: 'not_started' | 'active' | 'completed';
  draftCurrentPickNumber?: number;
  draftSeason?: number | null;
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
  isBreakaway?: boolean;
  timeSeconds: number | null;
  gapSeconds: number | null;
  points: number | null;
  uciPoints: number | null;
  previousRank?: number | null;
  rankDelta?: number | null;
  leadoutRiderId?: number | null;
  leadoutBonus?: number | null;
  leadoutRiderLastName?: string | null;
  leadoutRiderCountryCode?: string | null;
  breakawayKms?: number | null;
  eventIds?: string | null;
  jerseysWorn?: string | null;
}

export type StageResultRow = RaceClassificationRow;

export interface StageClassification {
  resultTypeId: number;
  resultTypeName: string;
  rows: RaceClassificationRow[];
}

export interface StageNonFinisherRow {
  riderId: number;
  riderName: string;
  teamId: number | null;
  teamName: string;
  countryCode: string | null;
  stageId: number;
  stageNumber: number;
  status: 'dnf';
  statusReason: string | null;
  isOtl: boolean;
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
  previousGcStandings?: RealtimeGcStanding[];
  markerClassifications?: StageMarkerClassification[];
  nonFinishers?: StageNonFinisherRow[];
  events?: RaceSimMessage[];
  rolledWeatherId?: number | null;
  rolledWetterName?: string | null;
}

export interface StageResultCommitResponse {
  raceId: number;
  raceName: string;
  stageId: number;
  stageNumber: number;
  date: string;
  profile: StageProfile;
  resultTypes: ResultType[];
}

export type RaceIncidentType = 'crash' | 'mechanical';

export type CrashSeverity = 'light' | 'medium' | 'severe';

export type RealtimeFinishStatus = 'finished' | 'dnf';

export interface PrecalculatedRaceIncident {
  riderId: number;
  type: RaceIncidentType;
  severity: CrashSeverity | null;
  triggerDistanceKm: number;
  triggerDistanceMeters: number;
  triggerDistancePercent: number;
  waitDurationSeconds: number;
  recoverySeconds: number;
  recoveryFormBonus: number;
  dayFormPenalty: number;
  staminaPenalty: number;
  recoveryPenaltyStages: number[];
  raceRecuperationPenalty: number;
  supportRiderIds: number[];
  isMassCrashTrigger?: boolean;
  massCrashPotentialRiderIds?: number[];
  hasAdditionalMechanical?: boolean;
}

export interface RealtimeStageCommitEntry {
  riderId: number;
  finishTimeSeconds: number | null;
  finishStatus: RealtimeFinishStatus;
  isBreakaway?: boolean;
  statusReason?: string | null;
  photoFinishScore?: number;
  leadoutRiderId?: number | null;
  leadoutBonus?: number | null;
}

export interface RealtimeGcStanding {
  riderId: number;
  rank: number;
  timeSeconds: number;
  gapSeconds: number;
  previousRank?: number | null;
  rankDelta?: number | null;
}

export interface RealtimeClassificationStanding {
  riderId: number | null;
  teamId?: number | null;
  rank: number;
  points: number | null;
  timeSeconds: number | null;
  gapSeconds: number | null;
  previousRank?: number | null;
  rankDelta?: number | null;
}

export interface RealtimeClassificationLeaders {
  gcLeaderRiderId: number | null;
  pointsLeaderRiderId: number | null;
  mountainLeaderRiderId: number | null;
  youthLeaderRiderId: number | null;
}

export interface RealtimeLeadoutContribution {
  teamId: number;
  sprinterId: number;
  leadoutBonus: number;
  contributorsJson: string;
}

export interface RealtimeStageCommitRequest {
  entries: RealtimeStageCommitEntry[];
  markerClassifications?: StageMarkerClassification[];
  incidents?: PrecalculatedRaceIncident[];
  events?: RaceSimMessage[];
  leadoutContributions?: RealtimeLeadoutContribution[];
  superTeamId?: number;
}

export interface RaceRosterSelectionRequest {
  riderIds: number[];
}

export interface RaceRosterRiderOption {
  rider: Rider;
  isSelected: boolean;
  isLocked: boolean;
  lockReason: string | null;
}

export interface RaceRosterTeamOption {
  team: Team;
  riderLimit: number;
  riders: RaceRosterRiderOption[];
}

export interface RaceRosterEditorPayload {
  race: Race;
  stage: Stage;
  teams: RaceRosterTeamOption[];
}

export interface RealtimeSimulationBootstrap {
  race: Race;
  stage: Stage;
  riders: Rider[];
  teams: Team[];
  stageSummary: ParsedStageSummary;
  gcStandings: RealtimeGcStanding[];
  pointsStandings: RealtimeClassificationStanding[];
  mountainStandings: RealtimeClassificationStanding[];
  youthStandings: RealtimeClassificationStanding[];
  classificationLeaders: RealtimeClassificationLeaders;
  teamStartOrder: number[];
  skillWeightRules: SkillWeightRule[];
  stageScoringRules: StageScoringRule[];
  lieutenants?: Array<{ leaderId: number; lieutenantId: number }> | null;
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
  | 'youth_final'
  | 'breakaway_final';

export type RiderStatsRowType = 'stage_result' | 'gc_final' | 'points_final' | 'mountain_final' | 'youth_final' | 'breakaway_final';

export interface RiderStatsRow {
  rowType: RiderStatsRowType;
  date: string;
  raceId: number;
  raceName: string;
  raceCategoryName: string | null;
  isStageRace?: boolean;
  stageId: number | null;
  stageNumber: number | null;
  stageName: string | null;
  resultLabel: string;
  resultRank: number | null;
  gcRank: number | null;
  isBreakaway: boolean;
  finishStatus: 'classified' | 'otl' | 'dnf';
  statusReason: string | null;
  stageTimeSeconds: number | null;
  profile: StageProfile | null;
  distanceKm: number | null;
  elevationGainMeters: number | null;
  seasonPoints: number;
  superTeamId?: number | null;
  teamId?: number | null;
  stageScore: number;
  rolledWeatherId?: number | null;
  rolledWetterName?: string | null;
  eventIds?: string | null;
  jerseysWorn?: string | null;
}

export interface RiderStatsPointsByTerrain {
  flat: number;
  hilly: number;
  mediumMountain: number;
  mountain: number;
  timetrial: number;
  cobble: number;
}

export interface RiderStatsPointsByRaceFormat {
  stageRace: number;
  oneDay: number;
}

export interface RiderStatsRaceBlock {
  raceId: number;
  raceName: string;
  raceCategoryName?: string | null;
  startDate: string;
  endDate: string;
  isStageRace: boolean;
  rows: RiderStatsRow[];
}

export interface RiderStatsSeason {
  season: number;
  raceBlocks: RiderStatsRaceBlock[];
}

export interface RiderFormHistoryEntry {
  date: string;
  sForm: number;
  rForm: number;
  totalForm: number;
  shortFatigue?: number;
  longFatigue?: number;
  combinedFatigue?: number;
}

export interface RiderCareerStats {
  breakawayAttempts: number;
  attacks: number;
  counterAttacks: number;
  crashes: number;
  defects: number;
  illnesses: number;
  illnessDays: number;
  injuries: number;
  injuryDays: number;
  dnsCount: number;
  dnfCount: number;
  otlCount: number;
  totalGcWins: number;
  totalStageWins: number;
  successfulBreakaways: number;
  homeAdvantageDays?: number;
  superHomeAdvantageDays?: number;
  homePressureDays?: number;
  breakawayKms?: number;
  superteamCount: number;
  categories: Record<string, {
    gcWins: number;
    gcSecond: number;
    gcThird: number;
    gcTopTen: number;
    stageWins: number;
    stageSecond: number;
    stageThird: number;
    stageTopTen: number;
    oneDayWins: number;
    oneDaySecond: number;
    oneDayThird: number;
    oneDayTopTen: number;
    mountainWins: number;
    pointsWins: number;
    youthWins: number;
    breakawayWins?: number;
    raceDays: number;
    leaderJerseys: number;
    pointsJerseys?: number;
    mountainJerseys?: number;
    youthJerseys?: number;
    breakawayJerseys?: number;
    sprintWins: number;
    climbWinsHC: number;
    climbWins1: number;
    climbWins2: number;
    climbWins3: number;
    climbWins4: number;
    winFlat: number;
    winRolling: number;
    winHilly: number;
    winHillyDifficult: number;
    winMediumMountain: number;
    winMountain: number;
    winHighMountain: number;
    winCobble: number;
    winCobbleHill: number;
    winITT: number;
    winTTT: number;
    winWeather1: number;
    winWeather2: number;
    winWeather3: number;
    winWeather4: number;
    winWeather5: number;
    winWeather6: number;
    winWeather7: number;
  }>;
}

export interface RiderStatsPayload {
  riderId: number;
  riderName: string;
  age?: number;
  teamId: number | null;
  teamName: string | null;
  weatherProfileId?: number;
  countryCode: Nationality | null;
  roleName: string | null;
  mentorName?: string | null;
  mentoredRiderNames?: string[];
  overallRating: number;
  seasonFormPhase: RiderSeasonFormPhase;
  formBonus: number;
  raceFormBonus: number;
  program: RaceProgram | null;
  programRaces: Race[];
  isUnavailable: boolean;
  healthStatusLabel: string | null;
  unavailableUntil: string | null;
  unavailableDaysRemaining: number;
  currentSeasonPoints: number;
  currentSeasonRank: number | null;
  currentSeasonRaceDays: number;
  seasonRaceDaysTotal: number;
  rolling30dRaceDays: number;
  longTermFatigueMalus: number;
  longTermFatigueDecayable: number;
  longTermFatigueLocked: number;
  shortTermFatigueMalus: number;
  totalFatigueLoadMalus: number;
  shortTermFatigueWarning: RiderLoadWarningLevel;
  currentSeasonBreakawayAttempts: number;
  careerWins: number;
  pointsByTerrain: RiderStatsPointsByTerrain;
  pointsByRaceFormat: RiderStatsPointsByRaceFormat;
  careerRaceDaysBySeason: Array<{
    season: number;
    raceDays: number;
  }>;
  seasons: RiderStatsSeason[];
  peakDates?: string[];
  formHistory?: RiderFormHistoryEntry[];
  careerStats?: RiderCareerStats;
  fatigueHistory?: RiderFatigueHistoryEntry[];
  lieutenantInfo?: { id: number; name: string } | null;
  leaderInfo?: { id: number; name: string } | null;
  contracts?: Array<{
    startSeason: number;
    endSeason: number;
    teamId: number | null;
    teamName: string | null;
    teamAbbreviation: string | null;
    status: string;
  }>;
  seasonRoles?: Array<{
    season: number;
    roleName: string;
  }>;
}

export interface RiderFatigueHistoryEntry {
  id: number;
  riderId: number;
  date: string;
  type: 'race' | 'decay';
  raceName: string | null;
  stageNumber: number | null;
  stageScore: number | null;
  shortChange: number;
  longDecayableChange: number;
  longLockedChange: number;
  shortAfter: number;
  longAfter: number;
}

export interface SeasonStandingRow {
  rank: number;
  riderId: number | null;
  riderName: string | null;
  teamId: number | null;
  teamName: string;
  countryCode: Nationality | null;
  countryName?: string | null;
  points: number;
  gapPoints: number;
}

export interface SeasonStandingCountryRiderRow {
  rank: number;
  riderId: number;
  riderName: string;
  countryCode: Nationality | null;
  points: number;
}

export interface SeasonStandingCountryRow {
  rank: number;
  countryCode: Nationality | null;
  countryName: string;
  points: number;
  gapPoints: number;
  topRiders: SeasonStandingCountryRiderRow[];
}

export interface SeasonStandingsPayload {
  season: number;
  riderStandings: SeasonStandingRow[];
  teamStandings: SeasonStandingRow[];
  countryStandings: SeasonStandingCountryRow[];
  availableSeasons?: number[];
}

// ------ Generische API-Response ------------------------------

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ------ Stage Editor ----------------------------------------

export type RouteImportFormat = 'gpx' | 'tcx' | 'csv';

export interface StageEditorSegment {
  startElevation: number;
  lengthKm: number;
  gradientPercent: number;
  terrain: StageTerrain;
  manualTerrain?: boolean;
  techLevel: number;
  windExp: number;
  markers: StageMarker[];
  endMarkers: StageMarker[];
}

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
  segments: StageEditorSegment[];
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
  startElevation: number;
  finalSpreadStartPercent: number;
  finalPushStartPercent: number;
  finalSpreadDifficultyMultiplier: number;
  crashIncidentMultiplier: number;
  mechanicalIncidentMultiplier: number;
  allowedWeather: string;
}

export interface StageEditorExistingStageOption extends StageEditorMetadata {
  raceName?: string;
  countryCode?: Nationality | null;
}

export interface StageEditorExistingStageListResponse {
  stages: StageEditorExistingStageOption[];
}

export interface StageEditorStageOverviewRow {
  stageId: number;
  raceId: number;
  countryCode: Nationality | null;
  raceName: string;
  stageNumber: number;
  profile: StageProfile;
  distanceKm: number;
  elevationGainMeters: number;
  sprintCount: number;
  climbCount: number;
  profileScore: number;
}

export interface StageEditorClimbOverviewRow {
  id: string;
  stageId: number;
  raceId: number;
  climbIndex: number;
  startKm: number;
  endKm: number;
  placementKm: number;
  name: string;
  category: Extract<StageMarkerCategory, 'HC' | '1' | '2' | '3' | '4'> | null;
  countryCode: Nationality | null;
  raceName: string;
  stageNumber: number;
  gainMeters: number;
  elevationAtTop: number;
  distanceKm: number;
  avgGradient: number;
  maxGradient: number;
  climbScore: number;
}

export interface StageEditorOverviewResponse {
  stages: StageEditorStageOverviewRow[];
  climbs: StageEditorClimbOverviewRow[];
}

export interface StageEditorExistingStageLoadResponse {
  metadata: StageEditorMetadata;
  draft: StageEditorDraft;
}

export interface StageEditorExportRequest {
  metadata: StageEditorMetadata;
  draft: StageEditorDraft;
  newRace?: boolean;
  raceDetails?: {
    name: string;
    countryId: number;
    categoryId: number;
    isStageRace: boolean;
    numberOfStages: number;
    startDate: string;
    endDate: string;
    prestige: number;
  };
  updatePrograms?: boolean;
  programIds?: number[];
}

export interface StageEditorExportPayload {
  stagesCsv: string;
  stageDetailsCsv: string;
  stagesFileName: string;
  stageDetailsFileName: string;
 }

// ------ Rider / Team Editor -------------------------------

export interface RiderTeamEditorRiderRow {
  riderId: number;
  firstName: string;
  lastName: string;
  countryId: number;
  countryCode?: string;
  birthYear: number;
  teamId: number | null;
  skillFlat: number;
  skillMountain: number;
  skillMediumMountain: number;
  skillHill: number;
  skillTimeTrial: number;
  skillPrologue: number;
  skillCobble: number;
  skillSprint: number;
  skillAcceleration: number;
  skillDownhill: number;
  skillAttack: number;
  skillStamina: number;
  skillResistance: number;
  skillRecuperation: number;
  favoriteRaces: string;
  nonFavoriteRaces: string;
  overallRating: number;
}

export interface RiderTeamEditorTeamSummary {
  teamId: number | null;
  name: string;
  abbreviation: string;
  divisionName: string;
  riderCount: number;
  averageOverall: number | null;
  rank: number;
  isFreeAgents: boolean;
}

export interface RiderTeamEditorPayload {
  riders: RiderTeamEditorRiderRow[];
  teams: RiderTeamEditorTeamSummary[];
}

export interface RiderTeamEditorSaveRequest {
  riders: RiderTeamEditorRiderRow[];
}

export interface RiderTeamEditorExportPayload {
  fileName: string;
  content: string;
}

export interface DraftHistoryRow {
  draftRound: number;
  pickNumber: number;
  contractLength: number;
  overallAtDraft: number;
  potOverallAtDraft: number;
  draftValue: number;
  
  riderId: number;
  riderFirstName: string;
  riderLastName: string;
  riderBirthYear: number;
  countryCode: string;
  countryFlag: string;

  teamId: number;
  teamName: string;
  teamJersey: string;

  oldTeamId: number | null;
  oldTeamName: string | null;
  oldTeamJersey: string | null;
}

export interface DraftHistoryPayload {
  season: number;
  rows: DraftHistoryRow[];
}
export interface InjuryRow {
  riderId: number;
  riderFirstName: string;
  riderLastName: string;
  countryCode: string;
  countryFlag: string;
  teamAbbreviation: string | null;
  teamJersey: string | null;
  teamId: number | null;
  teamDivisionTier: number | null;
  healthStatus: 'ill' | 'injured';
  unavailableDays: number;
  overallRating: number;
  age: number;
  fitDate?: string;
  missedRaces?: {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    categoryName: string;
    countryCode: string;
  }[];
}

export interface TeamStatsRider {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  nationality: Nationality;
  overallRating: number;
  seasonPoints: number;
  seasonWins: number;
  formBonus: number;
  raceFormBonus: number;
  skills: RiderSkills;
  contractEndSeason: number | null;
}

export interface TeamStatsTopResult {
  riderId: number;
  riderName: string;
  riderCountryCode: string | null;
  rowType: RiderStatsRowType;
  isStageRace?: boolean;
  date: string;
  raceId: number;
  raceName: string;
  raceCategoryName: string | null;
  stageId: number | null;
  stageNumber: number | null;
  resultRank: number | null;
  gcRank: number | null;
  finishStatus: 'classified' | 'otl' | 'dnf';
  statusReason: string | null;
  profile: StageProfile | null;
  seasonPoints: number;
  season: number;
  stageScore: number;
  eventIds?: string | null;
  jerseysWorn?: string | null;
  superTeamId?: number | null;
  teamId?: number | null;
}

export interface TeamSuccessStats {
  breakawayAttempts: number;
  attacks: number;
  counterAttacks: number;
  crashes: number;
  defects: number;
  illnesses: number;
  illnessDays: number;
  injuries: number;
  injuryDays: number;
  dnsCount: number;
  dnfCount: number;
  otlCount: number;
  totalGcWins: number;
  totalStageWins: number;
  successfulBreakaways: number;
  raceDays: number;
  superteamCount: number;
  homeAdvantageDays: number;
  superHomeAdvantageDays: number;
  homePressureDays: number;
  breakawayKms: number;
  categories: Record<string, {
    gcWins: number;
    gcSecond: number;
    gcThird: number;
    gcTopTen: number;
    stageWins: number;
    stageSecond: number;
    stageThird: number;
    stageTopTen: number;
    oneDayWins: number;
    oneDaySecond: number;
    oneDayThird: number;
    oneDayTopTen: number;
    mountainWins: number;
    pointsWins: number;
    youthWins: number;
    breakawayWins?: number;
    raceDays: number;
    leaderJerseys: number;
    pointsJerseys?: number;
    mountainJerseys?: number;
    youthJerseys?: number;
    breakawayJerseys?: number;
    sprintWins: number;
    climbWinsHC: number;
    climbWins1: number;
    climbWins2: number;
    climbWins3: number;
    climbWins4: number;
    winFlat: number;
    winRolling: number;
    winHilly: number;
    winHillyDifficult: number;
    winMediumMountain: number;
    winMountain: number;
    winHighMountain: number;
    winCobble: number;
    winCobbleHill: number;
    winITT: number;
    winTTT: number;
    winWeather1: number;
    winWeather2: number;
    winWeather3: number;
    winWeather4: number;
    winWeather5: number;
    winWeather6: number;
    winWeather7: number;
  }>;
}

export interface TeamStatsPayload {
  teamId: number;
  teamName: string;
  abbreviation: string;
  divisionName: string | null;
  countryCode: string | null;
  riders: TeamStatsRider[];
  topResults: TeamStatsTopResult[];
  successStats: {
    [seasonOrAll: string]: TeamSuccessStats;
  };
  historyRosters?: Record<number, Array<{
    riderId: number;
    firstName: string;
    lastName: string;
    nationality: string | null;
    roleName: string | null;
    overallRating: number;
    potential: number | null;
    contractEndSeason: number | null;
  }>>;
  transfers?: Record<number, {
    incoming: Array<{
      id: number;
      firstName: string;
      lastName: string;
      nationality: string | null;
      specialization1: string | null;
      specialization2: string | null;
      specialization3: string | null;
      roleName: string | null;
      overallRating: number;
      fromTeamId?: number | null;
      fromTeamName?: string | null;
    }>;
    outgoing: Array<{
      id: number;
      firstName: string;
      lastName: string;
      nationality: string | null;
      specialization1: string | null;
      specialization2: string | null;
      specialization3: string | null;
      roleName: string | null;
      overallRating: number;
      isRetired: boolean;
      toTeamId?: number | null;
      toTeamName?: string | null;
    }>;
  }>;
}