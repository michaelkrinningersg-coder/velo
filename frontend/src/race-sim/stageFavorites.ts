import type { Rider, RiderSkillKey, Stage, StageProfile, StageTerrain, Team } from '../../../shared/types';
import { resolveStageScoreWeights, resolveStaminaWeight } from './stageScoreWeights';
import {
  resolveIttScoreWeights,
  resolveTerrainShares,
  type TerrainShares,
} from '../../../shared/quickSim/ittScoreWeights';
import {
  resolveClimbPenaltyForRole,
  resolveSeasonFormFactor,
  resolveSkillWeightFactor,
} from '../../../shared/quickSim/terrainModifiers';

export interface FavoriteItem {
  rank: number;
  kind: 'rider' | 'team';
  effectiveSkill: number;
  teamId: number;
  teamName: string;
  displayName: string;
  roleLabel: string;
  riderId?: number;
}

export interface StageFavoriteOptions {
  distanceKm?: number;
  /**
   * Nur noch historisch: der Zeitfahrscore rechnet ueber `terrainShares`, die
   * Strassenetappen ueber Profil und Distanz. Das Feld bleibt, weil mehrere
   * Aufrufer es setzen, und wird nicht mehr gelesen.
   */
  elevationGainMeters?: number;
  dailyFormByRiderId?: Map<number, number> | Record<number, number>;
  /**
   * Gehoert die Etappe zu einem Etappenrennen? Entscheidet ueber die
   * Gewichtstabelle — siehe `STAGE_RACE_SCORE_WEIGHTS`. Ohne Angabe gilt die
   * Eintagesvariante, weil eine einzelne Etappe ohne Rennkontext nicht als
   * Rundfahrtetappe gelten soll.
   */
  isStageRace?: boolean;
  /**
   * Zuschlag auf den Etappenscore je Fahrer, in Punkten.
   *
   * Fuer Groessen, die den Fahrer treffen und nicht sein Koennen: Heimvorteil,
   * Wetter, die Abstufung innerhalb der Mannschaft. Sie werden bewusst *nach*
   * dem Terrainfaktor addiert — das Heimpublikum ist im Hochgebirge nicht
   * anderthalbmal so laut wie auf einer Flachetappe.
   */
  scoreDeltaByRiderId?: Map<number, number> | Record<number, number>;
  /**
   * Kilometeranteile der Terrains der Strecke. Nur Zeitfahren brauchen sie —
   * dort ersetzen sie die frueheren Hoehenmeter als Grundlage der Gewichtung.
   * Fehlen sie, koennen sie aus `segments` abgeleitet werden; ohne beides
   * gilt die Strecke als flach.
   */
  terrainShares?: TerrainShares;
  /** Streckensegmente, falls die Anteile daraus abgeleitet werden sollen. */
  segments?: ReadonlyArray<{ terrain: StageTerrain; length_km: number }>;
}

interface TeamFavoriteCandidate {
  team: Team;
  score: number;
}

export interface RiderFavoriteCandidate {
  rider: Rider;
  teamName: string;
  effectiveSkill: number;
}

function resolveLookup(riderId: number, input?: Map<number, number> | Record<number, number>): number {
  if (!input) {
    return 0;
  }
  if (input instanceof Map) {
    return input.get(riderId) ?? 0;
  }
  return input[riderId] ?? 0;
}

function resolveDailyForm(riderId: number, input?: Map<number, number> | Record<number, number>): number {
  if (!input) {
    return 0;
  }
  if (input instanceof Map) {
    return input.get(riderId) ?? 0;
  }
  return input[riderId] ?? 0;
}

function roundToOne(value: number): number {
  return Math.round(value * 10) / 10;
}

function resolveDistanceKm(stage: Stage, options?: StageFavoriteOptions): number {
  const stageWithDistance = stage as Stage & { distanceKm?: number };
  return options?.distanceKm ?? stageWithDistance.distanceKm ?? 0;
}

function resolveTerrainSharesFromOptions(options?: StageFavoriteOptions): TerrainShares | null {
  if (options?.terrainShares && options.terrainShares.size > 0) return options.terrainShares;
  if (options?.segments && options.segments.length > 0) return resolveTerrainShares(options.segments);
  return null;
}


/**
 * Formanteil am Etappenscore.
 *
 * Die Tagesform geht immer voll ein — sie ist der Zufall des Tages. Saison-
 * und Rennform dagegen je nach Terrain abgeschwaecht: auf Flach- und
 * Rollingetappen zur Haelfte, auf Huegeletappen zu drei Vierteln. Sonst
 * entscheidet ein Formhoch darueber, wer den Zielsprint erreicht, und der
 * Anfahrtszug bleibt Beiwerk. Siehe `terrainModifiers.ts`.
 */
function resolveFormContribution(rider: Rider, dailyForm: number, profile: StageProfile): number {
  const factor = resolveSeasonFormFactor(profile);
  return dailyForm + (((rider.formBonus ?? 0) + (rider.raceFormBonus ?? 0)) * factor);
}

function resolveStaminaContribution(rider: Rider, distanceKm: number, profile: StageProfile): number {
  return rider.skills.stamina * resolveStaminaWeight(distanceKm, profile);
}

/**
 * Abzug fuer Helferrollen am Berg. Siehe `DOMESTIQUE_CLIMB_PENALTY` und
 * `CLIMB_PENALTY_BY_ROLE`.
 *
 * Der Rollenname kommt aus der Datenbank und steht dort als `Wassertraeger`,
 * kann aber auch `Wasserträger` geschrieben sein. Umlaute werden deshalb
 * zuerst ausgeschrieben und erst danach die restlichen Betonungszeichen
 * entfernt — `normalize('NFD')` allein macht aus dem Umlaut sonst ein
 * blankes `a` und der Vergleich schlaegt fehl.
 */
function resolveDomestiquePenalty(rider: Rider, profile: StageProfile): number {
  const rolle = (rider.role?.name ?? '')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return resolveClimbPenaltyForRole(rolle, profile);
}

/**
 * Etappenscore eines Zeitfahrens.
 *
 * Frueher stand hier `Zeitfahrwert + Form + Bergwert x (Hoehenmeter / 500)`.
 * Das war in zwei Richtungen falsch: der Bergwert bekam Gewicht, wo die volle
 * Simulation ihm keines gibt (kein Zeitfahren des Kalenders hat Bergterrain),
 * und der Massstab des Scores wuchs mit den Hoehenmetern — auf dem WM-Kurs
 * mit 671 Hm zaehlte der Bergwert 1,34, mehr als der Zeitfahrwert selbst, und
 * das Feld wurde dreimal zu weit gespreizt.
 *
 * Jetzt dieselbe Gewichtung wie in der Engine: je Terrain eine Zeile, nach den
 * Kilometeranteilen der Strecke gemittelt, Summe 1. Siehe
 * `ittScoreWeights.ts` — dort steht auch, warum der Bergwert auf Huegelterrain
 * bewusst einen kleinen Anteil bekommt.
 *
 * Der Faehigkeitsanteil wird wie auf den Strassenprofilen gespreizt: die
 * Gewichte summieren sich auf 1 und druecken die Streuung des Koennens damit
 * unter die der Form. `SKILL_WEIGHT_FACTOR_BY_PROFILE` holt das zurueck.
 */
function calculateIttScore(
  rider: Rider,
  dailyForm: number,
  profile: StageProfile,
  terrainShares: TerrainShares | null | undefined,
  scoreDelta: number,
): number {
  const weights = resolveIttScoreWeights(terrainShares);
  let weighted = 0;
  for (const [key, weight] of Object.entries(weights) as Array<[RiderSkillKey, number]>) {
    weighted += rider.skills[key] * weight;
  }
  return (weighted * resolveSkillWeightFactor(profile))
    + resolveFormContribution(rider, dailyForm, profile)
    + scoreDelta;
}

/**
 * Etappenscore einer Strassenetappe.
 *
 * Die Gewichte kommen aus `stageScoreWeights.ts` und haengen an Profil *und*
 * Schwierigkeit je Kilometer. Vorher stand hier je Profil eine feste Formel,
 * in der der Sprint die Flachetappe mit 0,80 dominierte — das ist die
 * Gewichtung eines Zielsprints, nicht die einer 190 Kilometer langen Anfahrt.
 */
function calculateRoadScore(
  rider: Rider,
  stage: Stage,
  distanceKm: number,
  dailyForm: number,
  isStageRace: boolean,
  scoreDelta: number,
): number {
  const weights = resolveStageScoreWeights(
    stage.profile,
    (stage as Stage & { profileScore?: number | null }).profileScore ?? null,
    distanceKm,
    isStageRace,
  );
  let weighted = 0;
  for (const [key, weight] of Object.entries(weights) as Array<[RiderSkillKey, number]>) {
    weighted += rider.skills[key] * weight;
  }
  // Der reine Koennensanteil wird je Terrain gespreizt, damit die Form auf den
  // leichten Profilen nicht mehr Plaetze kostet als am Berg. Siehe
  // `SKILL_WEIGHT_FACTOR_BY_PROFILE`.
  //
  // Der Rollenabzug geht mit: er ist in Punkten der Faehigkeitsskala gedacht
  // ("was der Wassertraeger am Berg nicht fahren darf"), nicht in Punkten der
  // Form. Bliebe er absolut stehen, verloere er auf jedem Terrain genau so
  // viel Wirkung, wie der Faktor die Faehigkeiten spreizt.
  const faktor = resolveSkillWeightFactor(stage.profile);
  const koennen = (weighted + resolveStaminaContribution(rider, distanceKm, stage.profile)) * faktor;
  return koennen
    + resolveFormContribution(rider, dailyForm, stage.profile)
    - (resolveDomestiquePenalty(rider, stage.profile) * faktor)
    + scoreDelta;
}

function calculateRiderScore(
  rider: Rider,
  stage: Stage,
  distanceKm: number,
  terrainShares: TerrainShares | null | undefined,
  dailyForm: number,
  isStageRace: boolean,
  scoreDelta: number,
): number {
  if (stage.profile === 'ITT' || stage.profile === 'TTT') {
    return calculateIttScore(rider, dailyForm, stage.profile, terrainShares, scoreDelta);
  }
  return calculateRoadScore(rider, stage, distanceKm, dailyForm, isStageRace, scoreDelta);
}

function toFavoriteItem(candidate: { rider: Rider; teamName: string; effectiveSkill: number }, rank: number): FavoriteItem {
  return {
    rank,
    kind: 'rider',
    effectiveSkill: roundToOne(candidate.effectiveSkill),
    teamId: candidate.rider.activeTeamId ?? 0,
    teamName: candidate.teamName,
    displayName: `${candidate.rider.firstName} ${candidate.rider.lastName}`,
    roleLabel: candidate.rider.role?.name ?? '–',
    riderId: candidate.rider.id,
  };
}

export function calculateStageFavorites(riders: Rider[], teams: Team[], stage: Stage): FavoriteItem[];
export function calculateStageFavorites(riders: Rider[], teams: Team[], stage: Stage, options: StageFavoriteOptions): FavoriteItem[];
export function calculateStageFavorites(riders: Rider[], teams: Team[], stage: Stage, options?: StageFavoriteOptions): FavoriteItem[] {
  const distanceKm = resolveDistanceKm(stage, options);
  const terrainShares = resolveTerrainSharesFromOptions(options);
  const teamById = new Map(teams.map((team) => [team.id, team]));

  if (stage.profile === 'TTT') {
    const ridersByTeamId = new Map<number, Rider[]>();
    for (const rider of riders) {
      if (rider.activeTeamId == null) {
        continue;
      }
      const existing = ridersByTeamId.get(rider.activeTeamId) ?? [];
      existing.push(rider);
      ridersByTeamId.set(rider.activeTeamId, existing);
    }

    const teamFavorites: TeamFavoriteCandidate[] = [...ridersByTeamId.entries()].map(([teamId, teamRiders]) => {
      const team = teamById.get(teamId);
      const scoredRiders = teamRiders
        .map((rider) => calculateIttScore(
          rider,
          resolveDailyForm(rider.id, options?.dailyFormByRiderId),
          stage.profile,
          terrainShares,
          resolveLookup(rider.id, options?.scoreDeltaByRiderId),
        ))
        .sort((left, right) => right - left);
      const bestFive = scoredRiders.slice(0, 5);
      const availableCount = bestFive.length;
      const average = availableCount > 0
        ? bestFive.reduce((sum, value) => sum + value, 0) / availableCount
        : 0;
      const missingRidersPenalty = Math.max(0, 5 - availableCount) * 2;
      return {
        team: team ?? {
          id: teamId,
          name: `Team ${teamId}`,
          abbreviation: '---',
          divisionId: 0,
          u23TeamId: null,
          isPlayerTeam: false,
          countryCode: '---',
          colorPrimary: '#000000',
          colorSecondary: '#ffffff',
          aiFocus1: 0,
          aiFocus2: 0,
          aiFocus3: 0,
        },
        score: average - missingRidersPenalty,
      } satisfies TeamFavoriteCandidate;
    });

    return teamFavorites
      .sort((left, right) => right.score - left.score || left.team.id - right.team.id)
      .slice(0, 20)
      .map((item, index) => ({
        rank: index + 1,
        kind: 'team',
        effectiveSkill: roundToOne(item.score),
        teamId: item.team.id,
        teamName: item.team.name,
        displayName: item.team.name,
        roleLabel: 'TTT',
      } satisfies FavoriteItem));
  }

  const riderRanking = options != null
    ? calculateStageFavoriteRiderRanking(riders, teams, stage, options)
    : calculateStageFavoriteRiderRanking(riders, teams, stage);

  return riderRanking
    .sort((left, right) => right.effectiveSkill - left.effectiveSkill || left.rider.id - right.rider.id)
    .slice(0, 20)
    .map((candidate, index) => toFavoriteItem(candidate, index + 1));
}

export function calculateStageFavoriteRiderRanking(riders: Rider[], teams: Team[], stage: Stage): RiderFavoriteCandidate[];
export function calculateStageFavoriteRiderRanking(riders: Rider[], teams: Team[], stage: Stage, options: StageFavoriteOptions): RiderFavoriteCandidate[];
export function calculateStageFavoriteRiderRanking(riders: Rider[], teams: Team[], stage: Stage, options?: StageFavoriteOptions): RiderFavoriteCandidate[] {
  const distanceKm = resolveDistanceKm(stage, options);
  const terrainShares = resolveTerrainSharesFromOptions(options);
  const teamById = new Map(teams.map((team) => [team.id, team]));

  return riders
    .map((rider) => ({
      rider,
      teamName: rider.activeTeamId != null ? (teamById.get(rider.activeTeamId)?.name ?? `Team ${rider.activeTeamId}`) : '—',
      effectiveSkill: calculateRiderScore(
        rider,
        stage,
        distanceKm,
        terrainShares,
        resolveDailyForm(rider.id, options?.dailyFormByRiderId),
        options?.isStageRace ?? false,
        resolveLookup(rider.id, options?.scoreDeltaByRiderId),
      ),
    }))
    .sort((left, right) => right.effectiveSkill - left.effectiveSkill || left.rider.id - right.rider.id);
}