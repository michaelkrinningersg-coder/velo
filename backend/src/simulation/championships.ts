// Welt- und Europameisterschaften (WM/EM).
//
// Fahrer treten hier fuer ihre LAENDER an (nicht fuer ihre Trade-Teams). Es
// gibt pro Saison vier Titelkaempfe: EM-Einzelzeitfahren, EM-Strassenrennen,
// WM-Einzelzeitfahren und WM-Strassenrennen. Nominierung, Roster und
// Punktevergabe laufen komplett getrennt vom normalen Rennprogramm.
//
// Zentrale Wahrheitsquelle fuer:
//   * die vier Meisterschaftskategorien (inkl. UCI-Punktetabellen),
//   * den festen Kalender (Datum je Saison + Streckenprofile),
//   * die Nominierungsregeln (Kadergroessen, Ausschluesse, Europa-Filter).
//
// Erkennung im gesamten Code laeuft ueber die KATEGORIE-ID (stabil ueber
// Saisonwechsel hinweg — Rennen-IDs werden beim Saison-Rollover neu vergeben).

export type ChampionshipType = 'WM' | 'EM';
export type ChampionshipDiscipline = 'ITT' | 'ROAD';

export type ChampionshipRoadProfile =
  | 'Rolling'
  | 'Hilly'
  | 'Hilly_Difficult'
  | 'Medium_Mountain';

// Erste Saison des Basiskalenders. In dieser Saison ist das WM/EM-Strassenprofil
// fest "Hilly"; ab der Folgesaison rotiert es deterministisch.
export const CHAMPIONSHIP_FIRST_SEASON = 2026;

const EUROPE_CONTINENT = 'Europe';

// ---------------------------------------------------------------------------
// Kategorien + UCI-Punkte
// ---------------------------------------------------------------------------

export interface ChampionshipCategoryDef {
  categoryId: number;
  bonusSystemId: number;
  type: ChampionshipType;
  discipline: ChampionshipDiscipline;
  categoryName: string;
  bonusName: string;
  /** UCI-Punkte je Zielplatzierung (Pipe-getrennt, absteigend ab Platz 1). */
  pointsOneDay: string;
}

export const CHAMPIONSHIP_CATEGORY_DEFS: ChampionshipCategoryDef[] = [
  {
    categoryId: 10,
    bonusSystemId: 10,
    type: 'WM',
    discipline: 'ROAD',
    categoryName: 'Weltmeisterschaft - Strasse',
    bonusName: 'Weltmeisterschaft Strasse Punkte',
    pointsOneDay:
      '900|700|575|475|400|330|275|225|185|150|125|105|90|78|68|58|50|42|35|28|24|20|17|14|12|10|9|8|7|6|5|5|4|4|3|3|2|2|1|1',
  },
  {
    categoryId: 11,
    bonusSystemId: 11,
    type: 'WM',
    discipline: 'ITT',
    categoryName: 'Weltmeisterschaft - Einzelzeitfahren',
    bonusName: 'Weltmeisterschaft ITT Punkte',
    pointsOneDay:
      '450|350|290|240|200|165|140|115|95|75|62|52|45|39|34|29|25|21|18|14',
  },
  {
    categoryId: 12,
    bonusSystemId: 12,
    type: 'EM',
    discipline: 'ROAD',
    categoryName: 'Europameisterschaft - Strasse',
    bonusName: 'Europameisterschaft Strasse Punkte',
    pointsOneDay:
      '375|290|240|200|165|135|110|90|75|60|50|42|36|31|27|23|20|17|14|11',
  },
  {
    categoryId: 13,
    bonusSystemId: 13,
    type: 'EM',
    discipline: 'ITT',
    categoryName: 'Europameisterschaft - Einzelzeitfahren',
    bonusName: 'Europameisterschaft ITT Punkte',
    pointsOneDay:
      '188|145|120|100|82|68|55|45|37|30|25|21|18|15|13|11|10|8|7|5',
  },
];

// Kategorie-IDs + Erkennung liegen in shared/types, damit Frontend und Backend
// dieselbe Quelle nutzen; hier nur re-exportiert.
export { CHAMPIONSHIP_CATEGORY_IDS, isChampionshipCategory } from '../../../shared/types';

export function getChampionshipCategoryDef(
  categoryId: number | null | undefined,
): ChampionshipCategoryDef | undefined {
  if (categoryId == null) return undefined;
  return CHAMPIONSHIP_CATEGORY_DEFS.find((def) => def.categoryId === categoryId);
}

// ---------------------------------------------------------------------------
// Nationale Meisterschaften
// ---------------------------------------------------------------------------
//
// Anders als WM/EM: Fahrer treten fuer ihre TRADE-TEAMS an (normaler Teambonus).
// Je qualifiziertem Land eigenes ITT (25.06.) + Strassenrennen (28.06.). Erzeugt
// am 01.06. anhand der Nationenwertung der laufenden Saison. Qualifiziert sind
// Laender unter den Top 40 der Nationenwertung ODER mit >= 15 Fahrern mit Team.
// Es starten ALLE verfuegbaren Fahrer des Landes mit Team; Ausschluss nur bei
// Verletzung/Krankheit oder kombinierter Ermuedung > 12.

export interface NationalChampionshipCategoryDef {
  categoryId: number;
  bonusSystemId: number;
  discipline: ChampionshipDiscipline;
  categoryName: string;
  bonusName: string;
  pointsOneDay: string;
}

// Reale UCI-Punkte nationaler Meisterschaften (Kategorie A).
export const NATIONAL_CHAMPIONSHIP_CATEGORY_DEFS: NationalChampionshipCategoryDef[] = [
  {
    categoryId: 14,
    bonusSystemId: 14,
    discipline: 'ROAD',
    categoryName: 'Nationale Meisterschaft - Strasse',
    bonusName: 'Nationale Meisterschaft Strasse Punkte',
    pointsOneDay: '100|75|50|40|30|25|20|15|10|5',
  },
  {
    categoryId: 15,
    bonusSystemId: 15,
    discipline: 'ITT',
    categoryName: 'Nationale Meisterschaft - Einzelzeitfahren',
    bonusName: 'Nationale Meisterschaft ITT Punkte',
    pointsOneDay: '50|40|30|25|20|15|10|5',
  },
];

export const NATIONAL_CHAMPIONSHIP_CATEGORY_IDS: number[] = NATIONAL_CHAMPIONSHIP_CATEGORY_DEFS.map(
  (def) => def.categoryId,
);

export function isNationalChampionshipCategory(categoryId: number | null | undefined): boolean {
  return categoryId != null && NATIONAL_CHAMPIONSHIP_CATEGORY_IDS.includes(categoryId);
}

export function getNationalChampionshipCategoryDef(
  categoryId: number | null | undefined,
): NationalChampionshipCategoryDef | undefined {
  if (categoryId == null) return undefined;
  return NATIONAL_CHAMPIONSHIP_CATEGORY_DEFS.find((def) => def.categoryId === categoryId);
}

// Erzeugungsdatum, Renn-Termine und Qualifikationsregeln.
export const NATIONAL_CHAMPIONSHIP_GENERATION_MONTH_DAY = '06-01';
export const NATIONAL_CHAMPIONSHIP_ITT_MONTH_DAY = '06-25';
export const NATIONAL_CHAMPIONSHIP_ROAD_MONTH_DAY = '06-28';
export const NATIONAL_CHAMPIONSHIP_TOP_STANDINGS = 40;
export const NATIONAL_CHAMPIONSHIP_MIN_TEAM_RIDERS = 15;
export const NATIONAL_CHAMPIONSHIP_FATIGUE_THRESHOLD = 12; // Ausschluss ab > 12

// ---------------------------------------------------------------------------
// Kalender
// ---------------------------------------------------------------------------

export interface ChampionshipRaceDef {
  categoryId: number;
  type: ChampionshipType;
  discipline: ChampionshipDiscipline;
  raceName: string;
  /** Fester Termin (MM-DD) je Saison. */
  monthDay: string;
  startElevation: number;
  prestige: number;
  /** Nur ITT: fester Streckensatz (>= 30 km). */
  ittDetailsFile?: string;
}

// EM im August (10./12.), WM im September (21./23.). Reihenfolge chronologisch.
export const CHAMPIONSHIP_RACE_DEFS: ChampionshipRaceDef[] = [
  {
    categoryId: 13,
    type: 'EM',
    discipline: 'ITT',
    raceName: 'EM Einzelzeitfahren',
    monthDay: '08-10',
    startElevation: 50,
    prestige: 85,
    ittDetailsFile: 'dummy_itt_k.csv', // ~31 km
  },
  {
    categoryId: 12,
    type: 'EM',
    discipline: 'ROAD',
    raceName: 'EM Strassenrennen',
    monthDay: '08-12',
    startElevation: 50,
    prestige: 90,
  },
  {
    categoryId: 11,
    type: 'WM',
    discipline: 'ITT',
    raceName: 'WM Einzelzeitfahren',
    monthDay: '09-21',
    startElevation: 50,
    prestige: 95,
    ittDetailsFile: 'dummy_itt_l.csv', // ~41 km
  },
  {
    categoryId: 10,
    type: 'WM',
    discipline: 'ROAD',
    raceName: 'WM Strassenrennen',
    monthDay: '09-23',
    startElevation: 50,
    prestige: 100,
  },
];

// Cro Race muss dem WM-Fenster (21./23.09.) weichen. Es startet urspruenglich am
// 22.09. und haette damit eine Etappe auf dem WM-Strassentermin (23.09.). Daher
// wird es so verschoben, dass es ERST NACH dem WM-Strassenrennen beginnt
// (24.09.), womit der 23.09. komplett frei bleibt.
export const CRO_RACE_NAME = 'CRO Race';
export const CRO_RACE_ORIGINAL_START_DAY = 22; // urspruenglich 22.09.
export const CRO_RACE_TARGET_START_DAY = 24; // nach WM-Strasse (23.09.)

// Streckenprofil-Rotation des Strassenrennens.
export const CHAMPIONSHIP_ROAD_PROFILES: ChampionshipRoadProfile[] = [
  'Rolling',
  'Hilly',
  'Hilly_Difficult',
  'Medium_Mountain',
];

// Passende Streckensaetze (>= 190 km) je Typ und Profil.
export const CHAMPIONSHIP_ROAD_DETAILS: Record<
  ChampionshipType,
  Record<ChampionshipRoadProfile, string>
> = {
  WM: {
    Rolling: 'cadel_evans_great_ocean_road_race.csv', // 231 km
    Hilly: 'msr.csv', // 298 km
    Hilly_Difficult: 'giro02.csv', // 219 km
    Medium_Mountain: 'liegebastogneliege.csv', // 259 km
  },
  EM: {
    Rolling: 'faun_drome.csv', // 218 km
    Hilly: 'tirreno_03.csv', // 225 km
    Hilly_Difficult: 'clasica_almeria.csv', // 213 km
    Medium_Mountain: 'faun_ardeche.csv', // 196 km
  },
};

function deterministicUnit(seed: number): number {
  let state = (seed >>> 0) || 1;
  state = (state * 1664525 + 1013904223) >>> 0;
  state = (state ^ (state >>> 15)) >>> 0;
  state = (state * 1664525 + 1013904223) >>> 0;
  return state / 0x100000000;
}

// Deterministisches Strassenprofil je Saison. Saison 1 (Basiskalender) ist fest
// "Hilly", danach rotiert es zufaellig-deterministisch ueber alle vier Profile.
export function championshipRoadProfileForSeason(season: number): ChampionshipRoadProfile {
  if (season <= CHAMPIONSHIP_FIRST_SEASON) {
    return 'Hilly';
  }
  const index = Math.floor(deterministicUnit(season * 2654435761) * CHAMPIONSHIP_ROAD_PROFILES.length);
  return CHAMPIONSHIP_ROAD_PROFILES[Math.min(index, CHAMPIONSHIP_ROAD_PROFILES.length - 1)];
}

// Profil + Streckensatz einer Meisterschaft in einer bestimmten Saison.
export function championshipStageProfile(
  def: ChampionshipRaceDef,
  season: number,
): { profile: string; detailsFile: string } {
  if (def.discipline === 'ITT') {
    return { profile: 'ITT', detailsFile: def.ittDetailsFile! };
  }
  const roadProfile = championshipRoadProfileForSeason(season);
  return { profile: roadProfile, detailsFile: CHAMPIONSHIP_ROAD_DETAILS[def.type][roadProfile] };
}

// Profil + Streckensatz einer nationalen Meisterschaft. Deterministisch je
// (Saison, Land), damit sich Profilart und -laenge ueber die Jahre und zwischen
// den Laendern zufaellig-stabil unterscheiden (wie bei EM/WM rotierend).
const NATIONAL_ITT_DETAILS = ['dummy_itt_k.csv', 'dummy_itt_l.csv'];

export function nationalChampionshipStageProfile(
  discipline: ChampionshipDiscipline,
  season: number,
  countryId: number,
): { profile: string; detailsFile: string } {
  const seed = ((season * 1000003) ^ (countryId * 2654435761)) >>> 0;
  if (discipline === 'ITT') {
    const idx = Math.floor(deterministicUnit(seed ^ 0x9e3779b9) * NATIONAL_ITT_DETAILS.length);
    return { profile: 'ITT', detailsFile: NATIONAL_ITT_DETAILS[Math.min(idx, NATIONAL_ITT_DETAILS.length - 1)] };
  }
  const roadProfile = CHAMPIONSHIP_ROAD_PROFILES[
    Math.min(Math.floor(deterministicUnit(seed) * CHAMPIONSHIP_ROAD_PROFILES.length), CHAMPIONSHIP_ROAD_PROFILES.length - 1)
  ];
  // Streckensatz aus dem EM- oder WM-Pool (variiert die Laenge je Land/Saison).
  const pool = (deterministicUnit(seed ^ 0x5bd1e995) < 0.5 ? 'EM' : 'WM') as ChampionshipType;
  return { profile: roadProfile, detailsFile: CHAMPIONSHIP_ROAD_DETAILS[pool][roadProfile] };
}

// ---------------------------------------------------------------------------
// Nominierung
// ---------------------------------------------------------------------------

export const CHAMPIONSHIP_EUROPE_CONTINENT = EUROPE_CONTINENT;

// Nur europaeische Laender nehmen an der EM teil; die WM ist offen.
export function championshipRestrictsToEurope(type: ChampionshipType): boolean {
  return type === 'EM';
}

// Kombinierte-Ermuedungs-Schwelle als Ausschlusskriterium (>= Schwelle => raus).
export const CHAMPIONSHIP_FATIGUE_THRESHOLD: Record<ChampionshipType, number> = {
  WM: 8,
  EM: 10,
};

// Kadergroesse nach Rang in der (ggf. europaeisch gefilterten) Nationenwertung.
export interface KaderBracket {
  maxRank: number;
  riders: number;
}

export const CHAMPIONSHIP_KADER_BRACKETS: KaderBracket[] = [
  { maxRank: 8, riders: 12 },
  { maxRank: 10, riders: 10 },
  { maxRank: 15, riders: 8 },
  { maxRank: 20, riders: 5 },
  { maxRank: 25, riders: 4 },
  { maxRank: 30, riders: 3 },
  { maxRank: 40, riders: 2 },
  { maxRank: 60, riders: 1 },
];

// Kadergroesse nach Rang und Disziplin. Im Einzelzeitfahren darf jede Nation nur
// halb so viele Fahrer stellen wie im Strassenrennen (.5 abgerundet):
// 12->6, 10->5, 8->4, 5->2, 4->2, 3->1, 2->1, 1->0.
export function kaderSizeForRank(rank: number, discipline: ChampionshipDiscipline = 'ROAD'): number {
  let road = 0;
  for (const bracket of CHAMPIONSHIP_KADER_BRACKETS) {
    if (rank <= bracket.maxRank) {
      road = bracket.riders;
      break;
    }
  }
  return discipline === 'ITT' ? Math.floor(road / 2) : road;
}
