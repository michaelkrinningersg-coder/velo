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

export type RaceType = 'TimeTrial' | 'Flat' | 'Hilly' | 'Mountain' | 'Classics';

export interface RaceProfile {
  distanceKm: number;
  elevationGain: number;
  avgGradientKey: number;
  ttType?: 'ITT' | 'TTT';
}

export interface Race {
  id: number;
  name: string;
  type: RaceType;
  profile: RaceProfile;
  season: number;
  date: string;
  isCompleted: boolean;
  participatingTeamIds: number[];
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

// ------ Generische API-Response ------------------------------

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
