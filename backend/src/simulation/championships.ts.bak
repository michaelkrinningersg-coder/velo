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

// Titeltyp (== championship_titles.championship_type). Elite-WM/EM plus die
// Altersklassen-Ableger (U23/Junioren) sowie die Olympischen Spiele.
export type ChampionshipType =
  | 'WM'
  | 'EM'
  | 'WM_U23'
  | 'WM_JUN'
  | 'EM_U23'
  | 'EM_JUN'
  | 'OLY';
export type ChampionshipDiscipline = 'ITT' | 'ROAD';

// Grund-Wettbewerb, der Streckenpool, Europa-Filter und Ermuedungsschwelle
// bestimmt (unabhaengig von der Altersklasse).
export type ChampionshipCourseType = 'WM' | 'EM' | 'OLY';

// Altersklasse fuer die Nominierung. OPEN = keine Altersgrenze (Olympia).
export type ChampionshipAgeClass = 'ELITE' | 'U23' | 'JUNIOR' | 'OPEN';

export type ChampionshipRoadProfile =
  | 'Rolling'
  | 'Hilly'
  | 'Hilly_Difficult'
  | 'Medium_Mountain';

// Erste Saison des Basiskalenders. In dieser Saison ist das WM/EM-Strassenprofil
// fest "Hilly"; ab der Folgesaison rotiert es deterministisch.
export const CHAMPIONSHIP_FIRST_SEASON = 2026;

const EUROPE_CONTINENT = 'Europe';

// Altersgrenzen je Altersklasse (Alter = Saison - Geburtsjahr).
//   ELITE  : >= 23 (schliesst die Luecke zur U23; entspricht der UCI-Praxis)
//   U23    : 20 .. 22 (aelter 19 UND juenger 23)
//   JUNIOR : <= 19 (juenger 20)
//   OPEN   : keine Grenze (Olympia, alle Altersklassen zugelassen)
export function championshipAgeBounds(
  ageClass: ChampionshipAgeClass,
): { minAge: number | null; maxAge: number | null } {
  switch (ageClass) {
    case 'ELITE':
      return { minAge: 23, maxAge: null };
    case 'U23':
      return { minAge: 20, maxAge: 22 };
    case 'JUNIOR':
      return { minAge: null, maxAge: 19 };
    case 'OPEN':
    default:
      return { minAge: null, maxAge: null };
  }
}

// Teamlose Fahrer duerfen nur bei den Altersklassen-Rennen (U23/Junioren) starten.
export function championshipAllowsTeamless(ageClass: ChampionshipAgeClass): boolean {
  return ageClass === 'U23' || ageClass === 'JUNIOR';
}

// ---------------------------------------------------------------------------
// Kategorien + UCI-Punkte
// ---------------------------------------------------------------------------

export interface ChampionshipCategoryDef {
  categoryId: number;
  bonusSystemId: number;
  /** Titeltyp (== championship_titles.championship_type). */
  type: ChampionshipType;
  /** Grund-Wettbewerb (Streckenpool/Europa-Filter/Ermuedung). */
  courseType: ChampionshipCourseType;
  ageClass: ChampionshipAgeClass;
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
    courseType: 'WM',
    ageClass: 'ELITE',
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
    courseType: 'WM',
    ageClass: 'ELITE',
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
    courseType: 'EM',
    ageClass: 'ELITE',
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
    courseType: 'EM',
    ageClass: 'ELITE',
    discipline: 'ITT',
    categoryName: 'Europameisterschaft - Einzelzeitfahren',
    bonusName: 'Europameisterschaft ITT Punkte',
    pointsOneDay:
      '188|145|120|100|82|68|55|45|37|30|25|21|18|15|13|11|10|8|7|5',
  },
  // --- U23 -----------------------------------------------------------------
  {
    categoryId: 16,
    bonusSystemId: 16,
    type: 'WM_U23',
    courseType: 'WM',
    ageClass: 'U23',
    discipline: 'ROAD',
    categoryName: 'Weltmeisterschaft U23 - Strasse',
    bonusName: 'Weltmeisterschaft U23 Strasse Punkte',
    pointsOneDay:
      '300|235|195|160|132|110|92|76|62|50|41|34|29|25|21|18|15|13|10|8',
  },
  {
    categoryId: 17,
    bonusSystemId: 17,
    type: 'WM_U23',
    courseType: 'WM',
    ageClass: 'U23',
    discipline: 'ITT',
    categoryName: 'Weltmeisterschaft U23 - Einzelzeitfahren',
    bonusName: 'Weltmeisterschaft U23 ITT Punkte',
    pointsOneDay: '150|117|97|80|66|55|46|38|31|25|21|17|15|13|11|9|8|7|6|5',
  },
  {
    categoryId: 20,
    bonusSystemId: 20,
    type: 'EM_U23',
    courseType: 'EM',
    ageClass: 'U23',
    discipline: 'ROAD',
    categoryName: 'Europameisterschaft U23 - Strasse',
    bonusName: 'Europameisterschaft U23 Strasse Punkte',
    pointsOneDay: '200|156|129|107|88|72|59|48|40|32|27|22|19|16|14|12|10|9|7|6',
  },
  {
    categoryId: 21,
    bonusSystemId: 21,
    type: 'EM_U23',
    courseType: 'EM',
    ageClass: 'U23',
    discipline: 'ITT',
    categoryName: 'Europameisterschaft U23 - Einzelzeitfahren',
    bonusName: 'Europameisterschaft U23 ITT Punkte',
    pointsOneDay: '100|78|64|53|44|36|29|24|20|16|13|11|9|8|7|6|5|4|3|2',
  },
  // --- Junioren ------------------------------------------------------------
  {
    categoryId: 18,
    bonusSystemId: 18,
    type: 'WM_JUN',
    courseType: 'WM',
    ageClass: 'JUNIOR',
    discipline: 'ROAD',
    categoryName: 'Weltmeisterschaft Junioren - Strasse',
    bonusName: 'Weltmeisterschaft Junioren Strasse Punkte',
    pointsOneDay: '150|117|97|80|66|54|44|36|30|24|20|17|14|12|10|9|8|6|5|4',
  },
  {
    categoryId: 19,
    bonusSystemId: 19,
    type: 'WM_JUN',
    courseType: 'WM',
    ageClass: 'JUNIOR',
    discipline: 'ITT',
    categoryName: 'Weltmeisterschaft Junioren - Einzelzeitfahren',
    bonusName: 'Weltmeisterschaft Junioren ITT Punkte',
    pointsOneDay: '75|58|48|40|33|27|22|18|15|12|10|8|7|6|5|4|4|3|2|2',
  },
  {
    categoryId: 22,
    bonusSystemId: 22,
    type: 'EM_JUN',
    courseType: 'EM',
    ageClass: 'JUNIOR',
    discipline: 'ROAD',
    categoryName: 'Europameisterschaft Junioren - Strasse',
    bonusName: 'Europameisterschaft Junioren Strasse Punkte',
    pointsOneDay: '100|78|64|53|44|36|29|24|20|16|13|11|9|8|7|6|5|4|3|2',
  },
  {
    categoryId: 23,
    bonusSystemId: 23,
    type: 'EM_JUN',
    courseType: 'EM',
    ageClass: 'JUNIOR',
    discipline: 'ITT',
    categoryName: 'Europameisterschaft Junioren - Einzelzeitfahren',
    bonusName: 'Europameisterschaft Junioren ITT Punkte',
    pointsOneDay: '50|39|32|26|22|18|15|12|10|8|7|6|5|4|3|3|2|2|1|1',
  },
  // --- Olympische Spiele (alle 4 Jahre, offene Altersklasse) ---------------
  {
    categoryId: 24,
    bonusSystemId: 24,
    type: 'OLY',
    courseType: 'OLY',
    ageClass: 'OPEN',
    discipline: 'ROAD',
    categoryName: 'Olympische Spiele - Strasse',
    bonusName: 'Olympische Spiele Strasse Punkte',
    pointsOneDay:
      '900|700|575|475|400|330|275|225|185|150|125|105|90|78|68|58|50|42|35|28|24|20|17|14|12|10|9|8|7|6|5|5|4|4|3|3|2|2|1|1',
  },
  {
    categoryId: 25,
    bonusSystemId: 25,
    type: 'OLY',
    courseType: 'OLY',
    ageClass: 'OPEN',
    discipline: 'ITT',
    categoryName: 'Olympische Spiele - Einzelzeitfahren',
    bonusName: 'Olympische Spiele ITT Punkte',
    pointsOneDay:
      '450|350|290|240|200|165|140|115|95|75|62|52|45|39|34|29|25|21|18|14',
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
  courseType: ChampionshipCourseType;
  ageClass: ChampionshipAgeClass;
  discipline: ChampionshipDiscipline;
  raceName: string;
  /** Fester Termin (MM-DD) je Saison. */
  monthDay: string;
  startElevation: number;
  prestige: number;
  /** Nur ITT: fester Streckensatz (>= 30 km). */
  ittDetailsFile?: string;
}

// EM im August (10./12.), WM im September (21./23.). Die U23-/Junioren-Rennen
// laufen am GLEICHEN Tag und auf DERSELBEN Strecke wie die Elite; nur der Kader
// (Altersfilter) unterscheidet sich. Reihenfolge chronologisch.
export const CHAMPIONSHIP_RACE_DEFS: ChampionshipRaceDef[] = [
  // --- EM (August) ---------------------------------------------------------
  {
    categoryId: 13,
    type: 'EM',
    courseType: 'EM',
    ageClass: 'ELITE',
    discipline: 'ITT',
    raceName: 'EM Einzelzeitfahren',
    monthDay: '08-10',
    startElevation: 50,
    prestige: 85,
    ittDetailsFile: 'dummy_itt_k.csv', // ~31 km
  },
  {
    categoryId: 21,
    type: 'EM_U23',
    courseType: 'EM',
    ageClass: 'U23',
    discipline: 'ITT',
    raceName: 'EM U23 Einzelzeitfahren',
    monthDay: '08-10',
    startElevation: 50,
    prestige: 60,
    ittDetailsFile: 'dummy_itt_k.csv',
  },
  {
    categoryId: 23,
    type: 'EM_JUN',
    courseType: 'EM',
    ageClass: 'JUNIOR',
    discipline: 'ITT',
    raceName: 'EM Junioren Einzelzeitfahren',
    monthDay: '08-10',
    startElevation: 50,
    prestige: 45,
    ittDetailsFile: 'dummy_itt_k.csv',
  },
  {
    categoryId: 12,
    type: 'EM',
    courseType: 'EM',
    ageClass: 'ELITE',
    discipline: 'ROAD',
    raceName: 'EM Strassenrennen',
    monthDay: '08-12',
    startElevation: 50,
    prestige: 90,
  },
  {
    categoryId: 20,
    type: 'EM_U23',
    courseType: 'EM',
    ageClass: 'U23',
    discipline: 'ROAD',
    raceName: 'EM U23 Strassenrennen',
    monthDay: '08-12',
    startElevation: 50,
    prestige: 65,
  },
  {
    categoryId: 22,
    type: 'EM_JUN',
    courseType: 'EM',
    ageClass: 'JUNIOR',
    discipline: 'ROAD',
    raceName: 'EM Junioren Strassenrennen',
    monthDay: '08-12',
    startElevation: 50,
    prestige: 50,
  },
  // --- WM (September) ------------------------------------------------------
  {
    categoryId: 11,
    type: 'WM',
    courseType: 'WM',
    ageClass: 'ELITE',
    discipline: 'ITT',
    raceName: 'WM Einzelzeitfahren',
    monthDay: '09-21',
    startElevation: 50,
    prestige: 95,
    ittDetailsFile: 'dummy_itt_l.csv', // ~41 km
  },
  {
    categoryId: 17,
    type: 'WM_U23',
    courseType: 'WM',
    ageClass: 'U23',
    discipline: 'ITT',
    raceName: 'WM U23 Einzelzeitfahren',
    monthDay: '09-21',
    startElevation: 50,
    prestige: 70,
    ittDetailsFile: 'dummy_itt_l.csv',
  },
  {
    categoryId: 19,
    type: 'WM_JUN',
    courseType: 'WM',
    ageClass: 'JUNIOR',
    discipline: 'ITT',
    raceName: 'WM Junioren Einzelzeitfahren',
    monthDay: '09-21',
    startElevation: 50,
    prestige: 55,
    ittDetailsFile: 'dummy_itt_l.csv',
  },
  {
    categoryId: 10,
    type: 'WM',
    courseType: 'WM',
    ageClass: 'ELITE',
    discipline: 'ROAD',
    raceName: 'WM Strassenrennen',
    monthDay: '09-23',
    startElevation: 50,
    prestige: 100,
  },
  {
    categoryId: 16,
    type: 'WM_U23',
    courseType: 'WM',
    ageClass: 'U23',
    discipline: 'ROAD',
    raceName: 'WM U23 Strassenrennen',
    monthDay: '09-23',
    startElevation: 50,
    prestige: 75,
  },
  {
    categoryId: 18,
    type: 'WM_JUN',
    courseType: 'WM',
    ageClass: 'JUNIOR',
    discipline: 'ROAD',
    raceName: 'WM Junioren Strassenrennen',
    monthDay: '09-23',
    startElevation: 50,
    prestige: 60,
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

// Passende Streckensaetze (>= 190 km) je Grund-Wettbewerb und Profil. Olympia
// nutzt bewusst denselben Pool wie die WM ("gleiche Bedingungen wie bei der WM").
export const CHAMPIONSHIP_ROAD_DETAILS: Record<
  ChampionshipCourseType,
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
  OLY: {
    Rolling: 'cadel_evans_great_ocean_road_race.csv',
    Hilly: 'msr.csv',
    Hilly_Difficult: 'giro02.csv',
    Medium_Mountain: 'liegebastogneliege.csv',
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

// Olympia rotiert wie die WM ueber dieselben vier Strassenprofile, aber mit
// eigenem Seed — damit das olympische Rennen nicht zwingend dem WM-Profil
// desselben Jahres gleicht.
export function olympicRoadProfileForSeason(season: number): ChampionshipRoadProfile {
  const index = Math.floor(deterministicUnit(season * 40503 + 0x1b873593) * CHAMPIONSHIP_ROAD_PROFILES.length);
  return CHAMPIONSHIP_ROAD_PROFILES[Math.min(index, CHAMPIONSHIP_ROAD_PROFILES.length - 1)];
}

// Profil + Streckensatz einer Meisterschaft in einer bestimmten Saison. U23/
// Junioren erben ueber den courseType das Strassenprofil der Elite (gleiche
// Strecke am selben Tag); Olympia nutzt seine eigene Rotation.
export function championshipStageProfile(
  def: ChampionshipRaceDef | ChampionshipCategoryDef,
  season: number,
): { profile: string; detailsFile: string } {
  if (def.discipline === 'ITT') {
    return { profile: 'ITT', detailsFile: (def as ChampionshipRaceDef).ittDetailsFile! };
  }
  const roadProfile =
    def.courseType === 'OLY'
      ? olympicRoadProfileForSeason(season)
      : championshipRoadProfileForSeason(season);
  return { profile: roadProfile, detailsFile: CHAMPIONSHIP_ROAD_DETAILS[def.courseType][roadProfile] };
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
  const pool = (deterministicUnit(seed ^ 0x5bd1e995) < 0.5 ? 'EM' : 'WM') as ChampionshipCourseType;
  return { profile: roadProfile, detailsFile: CHAMPIONSHIP_ROAD_DETAILS[pool][roadProfile] };
}

// ---------------------------------------------------------------------------
// Nominierung
// ---------------------------------------------------------------------------

export const CHAMPIONSHIP_EUROPE_CONTINENT = EUROPE_CONTINENT;

// Platzhalter-Team fuer teamlose Starter der U23-/Junioren-Rennen. active_race_
// entries.team_id ist NOT NULL mit FK auf teams — teamlose Fahrer bekommen daher
// dieses reservierte Pseudo-Team als Startplatz-Traeger. Es taucht bewusst nicht
// in Team-Listen/Wertungen auf (Meisterschaftspunkte sind aus den Team-Standings
// ausgeschlossen; Team-Listen filtern die feste ID heraus). Feste, hohe ID —
// Teams werden nur beim Bootstrap (IDs 1..25) erzeugt, nie zur Laufzeit.
export const NATIONAL_SELECTION_TEAM_ID = 90000;
export const NATIONAL_SELECTION_TEAM_NAME = 'Nationalauswahl';

// Nur europaeische Laender nehmen an der EM teil (alle Altersklassen); WM und
// Olympia sind offen.
export function championshipRestrictsToEurope(courseType: ChampionshipCourseType): boolean {
  return courseType === 'EM';
}

// Kombinierte-Ermuedungs-Schwelle als Ausschlusskriterium (>= Schwelle => raus).
export const CHAMPIONSHIP_FATIGUE_THRESHOLD: Record<ChampionshipCourseType, number> = {
  WM: 8,
  EM: 10,
  OLY: 8,
};

// Karriere-Zaehler-Spalte (rider_career_stats) je Titeltyp + Disziplin. Speist
// die goldenen Hall-of-Fame-Badges. null => kein Zaehler (sollte nicht auftreten).
export function championshipTitleColumn(
  type: ChampionshipType,
  discipline: ChampionshipDiscipline,
): string | null {
  const itt = discipline === 'ITT';
  switch (type) {
    case 'WM':
      return itt ? 'world_champion_itt_titles' : 'world_champion_road_titles';
    case 'EM':
      return itt ? 'euro_champion_itt_titles' : 'euro_champion_road_titles';
    case 'WM_U23':
      return itt ? 'world_u23_champion_itt_titles' : 'world_u23_champion_road_titles';
    case 'EM_U23':
      return itt ? 'euro_u23_champion_itt_titles' : 'euro_u23_champion_road_titles';
    case 'WM_JUN':
      return itt ? 'world_junior_champion_itt_titles' : 'world_junior_champion_road_titles';
    case 'EM_JUN':
      return itt ? 'euro_junior_champion_itt_titles' : 'euro_junior_champion_road_titles';
    case 'OLY':
      return itt ? 'olympic_champion_itt_titles' : 'olympic_champion_road_titles';
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Olympische Spiele (alle 4 Jahre)
// ---------------------------------------------------------------------------
//
// ITT am 22.06., Strassenrennen am 24.06. — drei zusammenhaengende, im
// Basiskalender freie Tage (Luecke zwischen Tour de Suisse und den nationalen
// Meisterschaften). Keine U23-/Junioren-Version; alle Altersklassen zugelassen.
export const OLYMPIC_ITT_MONTH_DAY = '06-22';
export const OLYMPIC_ROAD_MONTH_DAY = '06-24';
// Olympia-Jahre: durch 4 teilbar (2028, 2032, ...), analog zur Realitaet.
export const OLYMPIC_CYCLE_BASE = 0;

export function isOlympicSeason(season: number): boolean {
  return ((season % 4) + 4) % 4 === OLYMPIC_CYCLE_BASE;
}

export const OLYMPIC_CATEGORY_IDS: number[] = [24, 25];

export interface OlympicRaceDef {
  categoryId: number;
  discipline: ChampionshipDiscipline;
  raceName: string;
  monthDay: string;
  startElevation: number;
  prestige: number;
  ittDetailsFile?: string;
}

// Profil + Streckensatz eines olympischen Rennens. Strasse rotiert wie die WM
// (eigener Seed), ITT fest.
export function olympicStageProfile(
  def: OlympicRaceDef,
  season: number,
): { profile: string; detailsFile: string } {
  if (def.discipline === 'ITT') {
    return { profile: 'ITT', detailsFile: def.ittDetailsFile! };
  }
  const roadProfile = olympicRoadProfileForSeason(season);
  return { profile: roadProfile, detailsFile: CHAMPIONSHIP_ROAD_DETAILS.OLY[roadProfile] };
}

export const OLYMPIC_RACE_DEFS: OlympicRaceDef[] = [
  {
    categoryId: 25,
    discipline: 'ITT',
    raceName: 'Olympische Spiele Einzelzeitfahren',
    monthDay: OLYMPIC_ITT_MONTH_DAY,
    startElevation: 50,
    prestige: 100,
    ittDetailsFile: 'dummy_itt_l.csv', // ~41 km, wie WM
  },
  {
    categoryId: 24,
    discipline: 'ROAD',
    raceName: 'Olympische Spiele Strassenrennen',
    monthDay: OLYMPIC_ROAD_MONTH_DAY,
    startElevation: 50,
    prestige: 100,
  },
];

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
