import Database from 'better-sqlite3';
import { GameStateRepository } from "../db/repositories/GameStateRepository";
import { RaceRepository } from "../db/repositories/RaceRepository";
import { ResultRepository } from "../db/repositories/ResultRepository";
import { RiderRepository } from "../db/repositories/RiderRepository";
import { TeamRepository } from "../db/repositories/TeamRepository";

import { GameStateService } from '../game/GameStateService';
import type {
  PrecalculatedRaceIncident,
  StageResultCommitResponse,
  Race,
  RealtimeStageCommitEntry,
  ResultType,
  Rider,
  Stage,
  StageMarkerCategory,
  StageMarkerClassification,
  Team,
  RaceSimMessage,
} from '../../../shared/types';
import {
  TIME_TIE_THRESHOLD_SECONDS,
  isTimeTrialProfile,
  rankStageResultEntries,
  resolveStageTimeLimitSeconds,
  resolveTimeLimitPercent,
  roundStageResultSeconds,
} from '../../../shared/stageResultRules';
import { ensureRaceEntries } from './RaceRosterService';

const RESULT_TYPES = {
  stage: 1,
  gc: 2,
  points: 3,
  mountain: 4,
  youth: 5,
  team: 6,
} as const;

const SUPPORTED_RESULT_TYPES: ResultType[] = [
  { id: RESULT_TYPES.stage, name: 'Stage' },
  { id: RESULT_TYPES.gc, name: 'GC' },
  { id: RESULT_TYPES.points, name: 'Points' },
  { id: RESULT_TYPES.mountain, name: 'Mountain' },
  { id: RESULT_TYPES.youth, name: 'Youth' },
  { id: RESULT_TYPES.team, name: 'Team' },
];

interface PerformanceEntry {
  riderId: number;
  rider: Rider;
  team: Team;
  dayForm: number;
  performanceScore: number;
  rawTimeSeconds: number;
  stageTimeSeconds: number;
  photoFinishScore: number;
  points: number;
  gcBonusSeconds: number;
  mountainPoints: number;
  isBreakaway?: boolean;
}

interface OtlEntry {
  riderId: number;
  statusReason: string;
}

interface RiderMetricRow {
  rider_id: number;
  team_id: number;
  time_seconds: number | null;
  points: number | null;
}

interface TeamMetricRow {
  team_id: number;
  time_seconds: number | null;
  points: number | null;
}

interface ResultInsertRow {
  rank: number;
  riderId?: number | null;
  teamId: number | null;
  timeSeconds: number | null;
  points: number | null;
  isBreakaway?: boolean;
}

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName) as { name: string } | undefined;
  return row != null;
}

function parseRankedValues(serialized: string | undefined): number[] {
  if (!serialized) return [];
  return serialized
    .split('|')
    .map((value: any) => Number.parseInt(value.trim(), 10))
    .filter((value: any) => Number.isFinite(value));
}

function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

function addDaysIso(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map((value: any) => Number(value));
  const date = new Date(Date.UTC(year, Math.max(0, month - 1), day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function rankPerformanceEntries(entries: PerformanceEntry[], profile: Stage['profile']): PerformanceEntry[] {
  return rankStageResultEntries(entries, profile);
}

function resolveTimeLimitSeconds(stage: Stage, performance: PerformanceEntry[]): number | null {
  return resolveStageTimeLimitSeconds(stage.profile, performance.map((entry: any) => entry.stageTimeSeconds));
}

function splitOtlPerformance(stage: Stage, performance: PerformanceEntry[]): { classifiedPerformance: PerformanceEntry[]; otlEntries: OtlEntry[] } {
  const timeLimitSeconds = resolveTimeLimitSeconds(stage, performance);
  if (timeLimitSeconds == null) {
    return { classifiedPerformance: performance, otlEntries: [] };
  }

  const classifiedPerformance: PerformanceEntry[] = [];
  const otlEntries: OtlEntry[] = [];
  const timeLimitPercent = resolveTimeLimitPercent(stage.profile);
  for (const entry of performance) {
    if (entry.stageTimeSeconds <= timeLimitSeconds) {
      classifiedPerformance.push(entry);
      continue;
    }

    otlEntries.push({
      riderId: entry.rider.id,
      statusReason: `OTL +${Math.round(entry.stageTimeSeconds - timeLimitSeconds)}s ueber Zeitlimit (${timeLimitPercent}%)`,
    });
  }

  return { classifiedPerformance, otlEntries };
}

function filterMarkerClassificationsForClassifiedRiders(classifications: StageMarkerClassification[], classifiedRiderIds: Set<number>): StageMarkerClassification[] {
  return classifications.map((classification: any) => ({
    ...classification,
    entries: classification.entries.filter((entry: any) => classifiedRiderIds.has(entry.riderId)),
  }));
}

function normalizeRoadStageTimeGroups(entries: PerformanceEntry[], profile: Stage['profile']): void {
  if (isTimeTrialProfile(profile)) {
    return;
  }

  const sortedByTime = [...entries].sort((left: any, right: any) => left.stageTimeSeconds - right.stageTimeSeconds || right.photoFinishScore - left.photoFinishScore || left.riderId - right.riderId);
  let groupTime: number | null = null;
  let previousTime: number | null = null;

  for (const entry of sortedByTime) {
    const originalTime = entry.stageTimeSeconds;
    if (groupTime == null || previousTime == null || originalTime - previousTime > TIME_TIE_THRESHOLD_SECONDS) {
      groupTime = originalTime;
    }
    entry.stageTimeSeconds = groupTime;
    previousTime = originalTime;
  }
}

function normalizeTimeRows<T extends { timeSeconds: number; riderId: number }>(rows: T[], applyTimeTieGroups: boolean): T[] {
  if (!applyTimeTieGroups) {
    return [...rows].sort((left: any, right: any) => left.timeSeconds - right.timeSeconds || left.riderId - right.riderId);
  }

  const sortedByTime = [...rows].sort((left: any, right: any) => left.timeSeconds - right.timeSeconds || left.riderId - right.riderId);
  const normalized: T[] = [];
  let groupTime: number | null = null;
  let previousTime: number | null = null;

  for (const row of sortedByTime) {
    if (groupTime == null || previousTime == null || row.timeSeconds - previousTime > TIME_TIE_THRESHOLD_SECONDS) {
      groupTime = row.timeSeconds;
    }
    normalized.push({ ...row, timeSeconds: groupTime });
    previousTime = row.timeSeconds;
  }

  return normalized.sort((left: any, right: any) => left.timeSeconds - right.timeSeconds || left.riderId - right.riderId);
}

function normalizeMarkerEntries(entries: StageMarkerClassification['entries'], applyTimeTieGroups: boolean): StageMarkerClassification['entries'] {
  if (!applyTimeTieGroups) {
    return [...entries].sort((left: any, right: any) => left.rank - right.rank || left.crossingTimeSeconds - right.crossingTimeSeconds || right.photoFinishScore - left.photoFinishScore || left.riderId - right.riderId);
  }

  const sortedByTime = [...entries].sort((left: any, right: any) => left.crossingTimeSeconds - right.crossingTimeSeconds || right.photoFinishScore - left.photoFinishScore || left.riderId - right.riderId);
  const leaderTime = sortedByTime[0]?.crossingTimeSeconds ?? 0;
  const ranked: StageMarkerClassification['entries'] = [];
  let group: StageMarkerClassification['entries'] = [];
  let groupLeaderTime = 0;
  let previousTime: number | null = null;

  const flushGroup = (): void => {
    const gapSeconds = Math.max(0, groupLeaderTime - leaderTime);
    const orderedGroup = group.sort((left: any, right: any) => right.photoFinishScore - left.photoFinishScore || left.riderId - right.riderId);
    for (const entry of orderedGroup) {
      ranked.push({
        ...entry,
        rank: ranked.length + 1,
        gapSeconds,
      });
    }
  };

  for (const entry of sortedByTime) {
    if (group.length === 0) {
      group = [entry];
      groupLeaderTime = entry.crossingTimeSeconds;
      previousTime = entry.crossingTimeSeconds;
      continue;
    }

    if (previousTime != null && entry.crossingTimeSeconds - previousTime <= TIME_TIE_THRESHOLD_SECONDS) {
      group.push(entry);
      previousTime = entry.crossingTimeSeconds;
      continue;
    }

    flushGroup();
    group = [entry];
    groupLeaderTime = entry.crossingTimeSeconds;
    previousTime = entry.crossingTimeSeconds;
  }

  if (group.length > 0) {
    flushGroup();
  }

  return ranked;
}

function normalizeMarkerClassifications(classifications: StageMarkerClassification[], applyTimeTieGroups: boolean): StageMarkerClassification[] {
  return classifications.map((classification: any) => ({
    ...classification,
    entries: normalizeMarkerEntries(classification.entries, applyTimeTieGroups),
  }));
}

function usesMountainStageSprintFinishPoints(profile: Stage['profile']): boolean {
  return !['ITT', 'TTT', 'Flat', 'Rolling', 'Hilly'].includes(profile);
}

export class StageResultCommitService {
  private readonly repo: any;

  constructor(db: Database.Database) {
    this.db = db;
    const raceRepo = new RaceRepository(db);
    const teamRepo = new TeamRepository(db);
    const gsRepo = new GameStateRepository(db);
    const riderRepo = new RiderRepository(db);
    this.repo = {
      // RaceRepository methods
      getStageById: (id: number) => raceRepo.getStageById(id),
      getRaceById: (id: number) => raceRepo.getRaceById(id),
      getRaceRiders: (raceId: number) => raceRepo.getRaceRiders(raceId),
      getRaceProgramsForRace: (raceId: number) => raceRepo.getRaceProgramsForRace(raceId),
      getStageRiders: (stageId: number) => raceRepo.getStageRiders(stageId),
      // TeamRepository methods
      getTeams: (teamId?: number) => (teamRepo as any).getTeams(teamId),
      // RiderRepository methods
      getRiders: (teamId?: number) => (riderRepo as any).getRiders(teamId),
      // GameStateRepository methods
      getCurrentSeason: () => gsRepo.getCurrentSeason(),
      getCurrentDate: () => gsRepo.getCurrentDate(),
      getFullyClassifiedStageRaceRiderIds: (raceId: number, upTo: number) => gsRepo.getFullyClassifiedStageRaceRiderIds(raceId, upTo),
      applyIncidentRaceState: (raceId: number, incidents: any[]) => gsRepo.applyIncidentRaceState(raceId, incidents),
      markStageEntriesFinished: (stageId: number, riderIds: number[]) => gsRepo.markStageEntriesFinished(stageId, riderIds),
      updateStageEntryStatus: (stageId: number, riderId: number, status: any, reason: any) => gsRepo.updateStageEntryStatus(stageId, riderId, status, reason),
      syncSeasonPointEventsForSeason: (season?: number) => gsRepo.syncSeasonPointEventsForSeason(season),
      ensureStageEntries: (stage: any) => gsRepo.ensureStageEntries(stage),
      prepareStageRaceFatigue: (raceId: number, stageNumber: number, riderIds: number[]) => gsRepo.prepareStageRaceFatigue(raceId, stageNumber, riderIds),
      attachStageRaceFatigue: (raceId: number, riders: any[], stageNumber: number) => (raceRepo as any).attachStageRaceFatigue(raceId, riders, stageNumber),
      clearStageEntries: (stageId: number) => (gsRepo as any).clearStageEntries(stageId),
    };
  }

  private readonly db: Database.Database;

  public commitRealtimeStage(
    stageId: number,
    entries: RealtimeStageCommitEntry[],
    markerClassifications: StageMarkerClassification[] = [],
    incidents: PrecalculatedRaceIncident[] = [],
    events: RaceSimMessage[] = [],
  ): StageResultCommitResponse {
    const { race, stage, riders, teamsById } = this.loadStageContext(stageId);
    const rosterById = new Map(riders.map((rider: any) => [rider.id, rider]));
    const sanitizedEntries = [...entries]
      .filter((entry: any) => Number.isFinite(entry.riderId))
      .map((entry: any) => ({
        riderId: entry.riderId,
        finishStatus: entry.finishStatus,
        isBreakaway: entry.isBreakaway === true,
        statusReason: entry.statusReason ?? null,
        finishTimeSeconds: entry.finishStatus === 'finished' && entry.finishTimeSeconds != null && Number.isFinite(entry.finishTimeSeconds)
          ? roundStageResultSeconds(entry.finishTimeSeconds)
          : null,
        photoFinishScore: Number.isFinite(entry.photoFinishScore) ? entry.photoFinishScore : 0,
      }))
      .sort((left: any, right: any) => (left.finishTimeSeconds ?? Number.POSITIVE_INFINITY) - (right.finishTimeSeconds ?? Number.POSITIVE_INFINITY) || (right.photoFinishScore ?? 0) - (left.photoFinishScore ?? 0) || left.riderId - right.riderId);

    if (sanitizedEntries.length !== riders.length) {
      throw new Error('Die Live-Simulation muss genau einen Zielstatus für jeden Starter übergeben.');
    }

    const seenRiderIds = new Set<number>();
    for (const entry of sanitizedEntries) {
      if (seenRiderIds.has(entry.riderId)) {
        throw new Error(`Live-Ergebnis für Fahrer ${entry.riderId} wurde doppelt übergeben.`);
      }
      if (entry.finishStatus === 'finished' && entry.finishTimeSeconds == null) {
        throw new Error(`Fahrer ${entry.riderId} wurde als Finisher ohne Zielzeit uebergeben.`);
      }
      seenRiderIds.add(entry.riderId);
    }

    const finishedEntries = sanitizedEntries.filter((entry: any) => entry.finishStatus === 'finished');
    const dnfEntries = sanitizedEntries.filter((entry: any) => entry.finishStatus === 'dnf');

    const performance = finishedEntries.map((entry: any) => {
      const rider = rosterById.get(entry.riderId);
      if (!rider) {
        throw new Error(`Live-Ergebnis für unbekannten Fahrer ${entry.riderId} erhalten.`);
      }

      const team = teamsById.get(rider.activeTeamId ?? -1);
      if (!team) {
        throw new Error(`Team für Fahrer ${rider.firstName} ${rider.lastName} konnte nicht geladen werden.`);
      }

      return {
        rider,
        riderId: rider.id,
        team,
        dayForm: 1,
        performanceScore: 0,
        rawTimeSeconds: entry.finishTimeSeconds ?? 0,
        stageTimeSeconds: entry.finishTimeSeconds ?? 0,
        photoFinishScore: entry.photoFinishScore ?? 0,
        points: 0,
        gcBonusSeconds: 0,
        mountainPoints: 0,
        isBreakaway: entry.isBreakaway === true,
      } satisfies PerformanceEntry;
    });

    if (seenRiderIds.size !== riders.length) {
      throw new Error('Die Live-Simulation hat nicht alle Starter geliefert.');
    }

    const { classifiedPerformance, otlEntries } = splitOtlPerformance(stage, performance);
    const classifiedRiderIds = new Set(classifiedPerformance.map((entry: any) => entry.rider.id));
    const normalizedMarkerClassifications = filterMarkerClassificationsForClassifiedRiders(
      normalizeMarkerClassifications(markerClassifications, !isTimeTrialProfile(stage.profile)),
      classifiedRiderIds,
    );
    const awardedMarkerClassifications = this.applyMarkerClassificationAwards(race, stage, classifiedPerformance, normalizedMarkerClassifications);

    normalizeRoadStageTimeGroups(classifiedPerformance, stage.profile);

    this.applyFinishLineAwards(race, stage, classifiedPerformance, {
      awardPoints: stage.profile !== 'TTT',
      awardTimeBonuses: stage.profile !== 'ITT' && stage.profile !== 'TTT',
    });

    const dnsEvents = this.loadDnsEvents(race, stage);
    const combinedEvents = [...dnsEvents, ...events];
    ResultRepository.inMemoryStageEvents.set(stageId, combinedEvents);

    const breakawayRiderIds = new Set<number>();
    for (const entry of sanitizedEntries) {
      if (entry.isBreakaway) {
        breakawayRiderIds.add(entry.riderId);
      }
    }

    return this.persistStagePerformance(
      race,
      stage,
      classifiedPerformance,
      awardedMarkerClassifications,
      [...dnfEntries, ...otlEntries],
      incidents,
      breakawayRiderIds,
      events,
    );
  }

  private loadDnsEvents(race: Race, stage: Stage): RaceSimMessage[] {
    const tableExists = (db: Database.Database, name: string): boolean => {
      const row = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(name);
      return !!row;
    };
    if (!tableExists(this.db, 'rider_daily_state')) {
      return [];
    }
    const dnsRows = this.db.prepare(`
      SELECT r.id, r.first_name, r.last_name, rds.health_status, re.team_id
      FROM race_entries re
      JOIN riders r ON r.id = re.rider_id
      JOIN rider_daily_state rds ON rds.rider_id = re.rider_id
      WHERE re.race_id = ?
        AND rds.unavailable_days_remaining > 0
        AND re.rider_id NOT IN (
          SELECT DISTINCT se.rider_id
          FROM stage_entries se
          JOIN stages s ON s.id = se.stage_id
          WHERE se.race_id = ?
            AND s.stage_number < ?
            AND se.status IN ('dns', 'dnf')
        )
    `).all(race.id, race.id, stage.stageNumber) as Array<{
      id: number;
      first_name: string;
      last_name: string;
      health_status: string;
      team_id: number;
    }>;

    const previousGcStandings = new ResultRepository(this.db).getPreviousGcStandings(race.id, stage.stageNumber);
    const previousGcMap = new Map<number, number>(previousGcStandings.map(s => [s.riderId, s.rank]));

    return dnsRows.map((row, index) => {
      const riderName = `${row.first_name} ${row.last_name}`;
      const gcRank = previousGcMap.get(row.id);
      const riderNameFormatted = gcRank != null ? `${riderName} (${gcRank}.)` : riderName;
      const reason = row.health_status === 'ill' ? 'Krankheitsbedingt' : 'Verletzungsbedingt';
      return {
        id: -1000 - index,
        elapsedSeconds: 0,
        riderId: row.id,
        riderName: riderName,
        riderTeamId: row.team_id,
        type: 'dnf' as const,
        tone: 'danger' as const,
        title: `${riderNameFormatted} nicht am Start`,
        detail: `${reason} nicht am Start der Etappe.`,
        kmMark: 0,
      };
    });
  }

  private loadStageContext(stageId: number): {
    race: Race;
    stage: Stage;
    riders: Rider[];
    teamsById: Map<number, Team>;
  } {
    if (!tableExists(this.db, 'results') || !tableExists(this.db, 'result_types')) {
      throw new Error('Das Savegame verwendet noch kein Results-Schema. Bitte eine neue Karriere mit dem aktuellen Build anlegen.');
    }

    const stage = this.repo.getStageById(stageId);
    if (!stage) {
      throw new Error(`Stage ${stageId} wurde nicht gefunden.`);
    }

    const race = this.repo.getRaceById(stage.raceId);
    if (!race || !race.category?.bonusSystem) {
      throw new Error(`Rennen ${stage.raceId} konnte nicht vollständig geladen werden.`);
    }

    this.ensureStageCanBeSimulated(stage);

    const riders = ensureRaceEntries(this.db, this.repo, race, stage);
    if (riders.length === 0) {
      throw new Error('Für dieses Rennen konnten keine Fahrer für die Startliste bestimmt werden.');
    }

    const teamsById = new Map<number, Team>(this.repo.getTeams().map((team: any) => [team.id, team]));
    const missingTeam = riders.find((rider: any) => rider.activeTeamId == null || !teamsById.has(rider.activeTeamId));
    if (missingTeam) {
      throw new Error(`Team für Fahrer ${missingTeam.firstName} ${missingTeam.lastName} konnte nicht aufgelöst werden.`);
    }

    return { race, stage, riders, teamsById };
  }

  private applyFinishLineAwards(
    race: Race,
    stage: Stage,
    performance: PerformanceEntry[],
    options: { awardPoints: boolean; awardTimeBonuses: boolean } = { awardPoints: true, awardTimeBonuses: true },
  ): void {
    if (!race.category?.bonusSystem) {
      return;
    }

    const finishPointValues = options.awardPoints && race.isStageRace
      ? parseRankedValues(
          usesMountainStageSprintFinishPoints(stage.profile)
            ? race.category.bonusSystem.pointsMountainStage
            : race.category.bonusSystem.pointsSprintFinish,
        )
      : [];
    const finishBonusValues = options.awardTimeBonuses
      ? parseRankedValues(race.category.bonusSystem.bonusSecondsFinal)
      : [];
    const sorted = rankPerformanceEntries(performance, stage.profile);

    finishPointValues.forEach((points: any, index: any) => {
      const entry = sorted[index];
      if (!entry) return;
      entry.points += points;
    });

    finishBonusValues.forEach((bonusSeconds: any, index: any) => {
      const entry = sorted[index];
      if (!entry) return;
      entry.gcBonusSeconds += bonusSeconds;
    });
  }

  private applyMarkerClassificationAwards(
    race: Race,
    stage: Stage,
    performance: PerformanceEntry[],
    markerClassifications: StageMarkerClassification[],
  ): StageMarkerClassification[] {
    if (markerClassifications.length === 0) {
      return [];
    }

    if (!race.isStageRace || !race.category?.bonusSystem) {
      return markerClassifications.map((classification: any) => ({
        ...classification,
        entries: classification.entries.map((entry: any) => ({
          ...entry,
          pointsAwarded: entry.pointsAwarded ?? 0,
        })),
      }));
    }

    const sprintPointValues = parseRankedValues(race.category.bonusSystem.pointsSprintIntermediate);
    const sprintBonusValues = parseRankedValues(race.category.bonusSystem.bonusSecondsIntermediate);
    const mountainPointValues = {
      HC: parseRankedValues(race.category.bonusSystem.pointsMountainHc),
      '1': parseRankedValues(race.category.bonusSystem.pointsMountainCat1),
      '2': parseRankedValues(race.category.bonusSystem.pointsMountainCat2),
      '3': parseRankedValues(race.category.bonusSystem.pointsMountainCat3),
      '4': parseRankedValues(race.category.bonusSystem.pointsMountainCat4),
    } satisfies Record<Exclude<StageMarkerCategory, 'Sprint'>, number[]>;

    const performanceByRiderId = new Map(performance.map((entry: any) => [entry.rider.id, entry]));

    return markerClassifications.map((classification: any) => {
      const awardedEntries = classification.entries.map((markerEntry: any, index: any) => {
        let pointsAwarded = 0;
        const performanceEntry = performanceByRiderId.get(markerEntry.riderId) ?? null;

        if (classification.markerType === 'sprint_intermediate' && stage.profile !== 'ITT' && stage.profile !== 'TTT') {
          pointsAwarded = sprintPointValues[index] ?? 0;
          if (performanceEntry) {
            performanceEntry.points += pointsAwarded;
            performanceEntry.gcBonusSeconds += sprintBonusValues[index] ?? 0;
          }
        }

        if ((classification.markerType === 'climb_top' || classification.markerType === 'finish_hill' || classification.markerType === 'finish_mountain')
          && classification.markerCategory != null
          && classification.markerCategory !== 'Sprint') {
          pointsAwarded = mountainPointValues[classification.markerCategory as Exclude<StageMarkerCategory, 'Sprint'>][index] ?? 0;
          if (performanceEntry) {
            performanceEntry.mountainPoints += pointsAwarded;
          }
        }

        return {
          ...markerEntry,
          pointsAwarded,
        };
      });

      return {
        ...classification,
        entries: awardedEntries,
      };
    });
  }

  private persistStagePerformance(
    race: Race,
    stage: Stage,
    performance: PerformanceEntry[],
    markerClassifications: StageMarkerClassification[] = [],
    dnfEntries: Array<{ riderId: number; statusReason: string | null }> = [],
    incidents: PrecalculatedRaceIncident[] = [],
    breakawayRiderIds: Set<number> = new Set(),
    events: RaceSimMessage[] = [],
  ): StageResultCommitResponse {
    const rankedPerformance = rankPerformanceEntries(performance, stage.profile);

    const previousStageId = this.getPreviousSimulatedStageId(stage.raceId, stage.stageNumber);
    const previousGc = this.loadPreviousRiderMetricMap(previousStageId, RESULT_TYPES.gc, 'time_seconds');
    const previousPoints = this.loadPreviousRiderMetricMap(previousStageId, RESULT_TYPES.points, 'points');
    const previousMountain = this.loadPreviousRiderMetricMap(previousStageId, RESULT_TYPES.mountain, 'points');
    const previousTeam = this.loadPreviousTeamMetricMap(previousStageId, RESULT_TYPES.team, 'time_seconds');
    const classificationEligibility = race.isStageRace && stage.stageNumber > 1
      ? new Set(this.repo.getFullyClassifiedStageRaceRiderIds(race.id, stage.stageNumber - 1))
      : null;
    const classificationPerformance = classificationEligibility == null
      ? performance
      : performance.filter((entry: any) => classificationEligibility.has(entry.rider.id));
    const ridersById = new Map(performance.map((entry: any) => [entry.rider.id, entry.rider]));

    const stageRows = stage.profile === 'TTT'
      ? [...new Map(
          rankedPerformance.map((entry: any) => [entry.team.id, {
            teamId: entry.team.id,
            timeSeconds: entry.stageTimeSeconds,
          }]),
        ).values()]
          .sort((left: any, right: any) => left.timeSeconds - right.timeSeconds || left.teamId - right.teamId)
          .map((entry: any, index: any) => ({
            rank: index + 1,
            riderId: null,
            teamId: entry.teamId,
            timeSeconds: entry.timeSeconds,
            points: null,
          }))
      : rankedPerformance.map((entry: any, index: any) => ({
          rank: index + 1,
          riderId: entry.rider.id,
          teamId: entry.team.id,
          timeSeconds: entry.stageTimeSeconds,
          points: race.isStageRace ? entry.points : null,
          isBreakaway: entry.isBreakaway === true,
        }));

    const gcRows = normalizeTimeRows([...classificationPerformance]
      .map((entry: any) => ({
        riderId: entry.rider.id,
        teamId: entry.team.id,
        timeSeconds: (previousGc.get(entry.rider.id) ?? 0) + entry.stageTimeSeconds - entry.gcBonusSeconds,
      })), !isTimeTrialProfile(stage.profile))
      .map((entry: any, index: any) => ({ ...entry, rank: index + 1, points: null as number | null }));

    const pointsRows = race.isStageRace
      ? [...classificationPerformance]
          .map((entry: any) => ({
            riderId: entry.rider.id,
            teamId: entry.team.id,
            points: (previousPoints.get(entry.rider.id) ?? 0) + entry.points,
          }))
          .sort((left: any, right: any) => right.points - left.points || left.riderId - right.riderId)
          .map((entry: any, index: any) => ({ ...entry, rank: index + 1, timeSeconds: null as number | null }))
      : [];

    // For mountain classification tie-breaking: when points are equal, use stage
    // finish rank (crossing order). This is especially important at mountain finishes
    // where the finish line IS the mountain top.
    const stageRankByRiderId = new Map(
      stageRows
        .filter((r: any) => r.riderId != null)
        .map((r: any) => [r.riderId as number, r.rank as number]),
    );
    const mountainRows = race.isStageRace
      ? [...classificationPerformance]
          .map((entry: any) => ({
            riderId: entry.rider.id,
            teamId: entry.team.id,
            points: (previousMountain.get(entry.rider.id) ?? 0) + entry.mountainPoints,
          }))
          .sort((left: any, right: any) =>
            right.points - left.points
            || (stageRankByRiderId.get(left.riderId) ?? 9999) - (stageRankByRiderId.get(right.riderId) ?? 9999)
            || left.riderId - right.riderId)
          .map((entry: any, index: any) => ({ ...entry, rank: index + 1, timeSeconds: null as number | null }))
      : [];

    const currentSeason = this.repo.getCurrentSeason();
    const youthRows = race.isStageRace
      ? gcRows
          .filter((entry: any) => {
            const rider = ridersById.get(entry.riderId);
            return rider != null && currentSeason - rider.birthYear <= 25;
          })
          .map((entry: any, index: any) => ({
            rank: index + 1,
            riderId: entry.riderId,
            teamId: entry.teamId,
            timeSeconds: entry.timeSeconds,
            points: null as number | null,
          }))
      : [];

    const teamIds = [...new Set(rankedPerformance.map((entry: any) => entry.team.id))];
    const stageTeamTimes = new Map<number, number>();
    for (const teamId of teamIds) {
      const teamEntries = rankedPerformance
        .filter((entry: any) => entry.team.id === teamId)
        .sort((left: any, right: any) => left.stageTimeSeconds - right.stageTimeSeconds)
        .slice(0, 3);
      if (teamEntries.length < 3) continue;
      stageTeamTimes.set(teamId, teamEntries.reduce((sum: any, entry: any) => sum + entry.stageTimeSeconds, 0));
    }

    const teamRows = [...stageTeamTimes.entries()]
      .map(([teamId, stageTime]: any) => ({
        teamId,
        timeSeconds: (previousTeam.get(teamId) ?? 0) + stageTime,
      }))
      .sort((left: any, right: any) => left.timeSeconds - right.timeSeconds || left.teamId - right.teamId)
      .map((entry: any, index: any) => ({
        rank: index + 1,
        teamId: entry.teamId,
        timeSeconds: entry.timeSeconds,
        points: null as number | null,
      }));

    const insert = this.db.prepare(`
      INSERT INTO results (
        race_id, stage_id, rider_id, team_id, result_type_id, rank, time_seconds, points, is_breakaway
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertMarkerResult = this.db.prepare(`
      INSERT INTO stage_marker_results (
        race_id, stage_id, marker_key, marker_label, marker_type, marker_category, km_mark,
        rider_id, team_id, rank, crossing_time_seconds, gap_seconds, points_awarded, photo_finish_score
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const performanceByRiderId = new Map(performance.map((entry: any) => [entry.rider.id, entry]));
    const completedRiderIds = performance.map((entry: any) => entry.rider.id);
    const severeCrashRiderIds = new Set(incidents.filter((incident: any) => incident.type === 'crash' && incident.severity === 'severe').map((incident: any) => incident.riderId));

    this.db.transaction(() => {
      this.repo.applyIncidentRaceState(race.id, incidents);
      for (const row of stageRows) {
        this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.stage, row);
      }
      for (const row of gcRows) {
        this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.gc, row);
      }
      for (const row of pointsRows) {
        this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.points, row);
      }
      for (const row of mountainRows) {
        this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.mountain, row);
      }
      for (const row of youthRows) {
        this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.youth, row);
      }
      for (const row of teamRows) {
        this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.team, {
          rank: row.rank,
          riderId: null,
          teamId: row.teamId,
          timeSeconds: row.timeSeconds,
          points: row.points,
          isBreakaway: false,
        });
      }
      for (const classification of markerClassifications) {
        for (const entry of classification.entries) {
          const performanceEntry = performanceByRiderId.get(entry.riderId);
          if (!performanceEntry) continue;
          insertMarkerResult.run(
            race.id,
            stage.id,
            classification.markerKey,
            classification.markerLabel,
            classification.markerType,
            classification.markerCategory,
            classification.kmMark,
            entry.riderId,
            performanceEntry.team.id,
            entry.rank,
            entry.crossingTimeSeconds,
            entry.gapSeconds,
            entry.pointsAwarded ?? 0,
            entry.photoFinishScore,
          );
        }
      }
      // Accumulate and update rider career stats (never reset)
      const careerStatsIncrements = new Map<number, {
        breakaway: number;
        attacks: number;
        counterAttacks: number;
        crashes: number;
        defects: number;
      }>();

      const getOrCreateIncrement = (riderId: number) => {
        let inc = careerStatsIncrements.get(riderId);
        if (!inc) {
          inc = { breakaway: 0, attacks: 0, counterAttacks: 0, crashes: 0, defects: 0 };
          careerStatsIncrements.set(riderId, inc);
        }
        return inc;
      };

      // 1. Breakaway attempts
      for (const riderId of breakawayRiderIds) {
        getOrCreateIncrement(riderId).breakaway = 1;
      }

      // 2. Crashes and mechanical defects
      for (const incident of incidents) {
        const inc = getOrCreateIncrement(incident.riderId);
        if (incident.type === 'crash') {
          inc.crashes++;
        } else if (incident.type === 'mechanical') {
          inc.defects++;
        }
      }

      // 3. Attacks and counter-attacks
      for (const event of events) {
        if (event.riderId != null) {
          const inc = getOrCreateIncrement(event.riderId);
          if (event.type === 'attack' && event.title && event.title.includes('attackiert')) {
            inc.attacks++;
          } else if (event.type === 'counter_attack') {
            inc.counterAttacks++;
          }
        }
      }

      // 4. Perform SQLite update
      const updateStatsStmt = this.db.prepare(`
        INSERT INTO rider_career_stats (
          rider_id, breakaway_attempts, attacks, counter_attacks, crashes, defects
        ) VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(rider_id) DO UPDATE SET
          breakaway_attempts = breakaway_attempts + excluded.breakaway_attempts,
          attacks = attacks + excluded.attacks,
          counter_attacks = counter_attacks + excluded.counter_attacks,
          crashes = crashes + excluded.crashes,
          defects = defects + excluded.defects
      `);

      for (const [riderId, inc] of careerStatsIncrements.entries()) {
        updateStatsStmt.run(
          riderId,
          inc.breakaway,
          inc.attacks,
          inc.counterAttacks,
          inc.crashes,
          inc.defects
        );
      }

      this.repo.markStageEntriesFinished(stage.id, completedRiderIds);
      for (const entry of dnfEntries) {
        this.repo.updateStageEntryStatus(stage.id, entry.riderId, 'dnf', entry.statusReason);
      }
      for (const riderId of severeCrashRiderIds) {
        this.applySevereCrashInjury(stage.date, riderId);
      }
    })();

    const gameStateService = new GameStateService(this.db);
    gameStateService.applyRaceDayFormBonuses(stage.date, completedRiderIds);
    gameStateService.refreshRiderLoadState(stage.date, this.repo.getCurrentSeason());

    this.repo.syncSeasonPointEventsForSeason(this.repo.getCurrentSeason());

    this.evaluateU23Breakthroughs(race, stage, stageRows, gcRows, pointsRows, mountainRows, youthRows, ridersById);
    this.evaluateRacePreferences(race, stage, stageRows, gcRows, dnfEntries, ridersById);

    return {
      raceId: race.id,
      raceName: race.name,
      stageId: stage.id,
      stageNumber: stage.stageNumber,
      date: stage.date,
      profile: stage.profile,
      resultTypes: SUPPORTED_RESULT_TYPES,
    };
  }

  private applySevereCrashInjury(currentDate: string, riderId: number): void {
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_daily_state (
        rider_id INTEGER PRIMARY KEY REFERENCES riders(id) ON DELETE CASCADE,
        season INTEGER NOT NULL,
        form_bonus REAL NOT NULL DEFAULT 0.0,
        race_form_bonus REAL NOT NULL DEFAULT 0.0,
        peak_s_form REAL NOT NULL DEFAULT 0.0,
        peak_r_form REAL NOT NULL DEFAULT 0.0,
        active_peak_date TEXT,
        peak_dates_json TEXT NOT NULL DEFAULT '[]',
        health_status TEXT NOT NULL DEFAULT 'healthy' CHECK(health_status IN ('healthy', 'ill', 'injured')),
        unavailable_until TEXT,
        unavailable_days_remaining INTEGER NOT NULL DEFAULT 0 CHECK(unavailable_days_remaining >= 0)
      )
    `).run();

    const isLongInjury = Math.random() < 0.1;
    const durationDays = isLongInjury
      ? randomInteger(6, 30)
      : randomInteger(2, 14);
    const unavailableUntil = addDaysIso(currentDate, durationDays - 1);

    this.db.prepare(`
      UPDATE rider_daily_state
      SET health_status = 'injured',
          unavailable_until = ?,
          unavailable_days_remaining = ?
      WHERE rider_id = ?
    `).run(unavailableUntil, durationDays, riderId);

    // Track crash-induced injury in career stats
    const tableExists = (db: Database.Database, name: string): boolean => {
      const row = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(name);
      return !!row;
    };
    if (tableExists(this.db, 'rider_career_stats')) {
      this.db.prepare(`
        INSERT INTO rider_career_stats (
          rider_id, injuries, injury_days
        ) VALUES (?, 1, ?)
        ON CONFLICT(rider_id) DO UPDATE SET
          injuries = injuries + excluded.injuries,
          injury_days = injury_days + excluded.injury_days
      `).run(riderId, durationDays);
    }
  }

  private ensureStageCanBeSimulated(stage: Stage): void {
    const existing = this.db.prepare(`
      SELECT 1
      FROM results
      WHERE stage_id = ? AND result_type_id = ?
      LIMIT 1
    `).get(stage.id, RESULT_TYPES.stage);
    if (existing) {
      throw new Error('Diese Etappe wurde bereits simuliert.');
    }

    const row = this.db.prepare(`
      SELECT MAX(stages.stage_number) AS last_stage_number
      FROM results
      JOIN stages ON stages.id = results.stage_id
      WHERE stages.race_id = ? AND results.result_type_id = ?
    `).get(stage.raceId, RESULT_TYPES.stage) as { last_stage_number: number | null } | undefined;
    const expectedStageNumber = (row?.last_stage_number ?? 0) + 1;
    if (stage.stageNumber !== expectedStageNumber) {
      throw new Error('Etappen eines Rennens müssen in der vorgesehenen Reihenfolge simuliert werden.');
    }
  }

  private getPreviousSimulatedStageId(raceId: number, stageNumber: number): number | null {
    const row = this.db.prepare(`
      SELECT stages.id AS stage_id
      FROM stages
      JOIN results ON results.stage_id = stages.id
      WHERE stages.race_id = ?
        AND stages.stage_number < ?
        AND results.result_type_id = ?
      GROUP BY stages.id, stages.stage_number
      ORDER BY stages.stage_number DESC
      LIMIT 1
    `).get(raceId, stageNumber, RESULT_TYPES.stage) as { stage_id: number } | undefined;
    return row?.stage_id ?? null;
  }

  private loadPreviousRiderMetricMap(previousStageId: number | null, resultTypeId: number, column: 'time_seconds' | 'points'): Map<number, number> {
    if (previousStageId == null) return new Map<number, any>();
    const rows = this.db.prepare(`
      SELECT rider_id, team_id, time_seconds, points
      FROM results
      WHERE stage_id = ? AND result_type_id = ? AND rider_id IS NOT NULL
    `).all(previousStageId, resultTypeId) as RiderMetricRow[];
    const result = new Map<number, number>();
    for (const row of rows) {
      const value = row[column];
      if (value != null) {
        result.set(row.rider_id, value);
      }
    }
    return result;
  }

  private loadPreviousTeamMetricMap(previousStageId: number | null, resultTypeId: number, column: 'time_seconds' | 'points'): Map<number, number> {
    if (previousStageId == null) return new Map<number, any>();
    const rows = this.db.prepare(`
      SELECT team_id, time_seconds, points
      FROM results
      WHERE stage_id = ? AND result_type_id = ? AND rider_id IS NULL
    `).all(previousStageId, resultTypeId) as TeamMetricRow[];
    const result = new Map<number, number>();
    for (const row of rows) {
      const value = row[column];
      if (value != null) {
        result.set(row.team_id, value);
      }
    }
    return result;
  }

  private insertResultRow(
    insert: Database.Statement,
    raceId: number,
    stageId: number,
    resultTypeId: number,
    row: ResultInsertRow,
  ): void {
    try {
      insert.run(
        raceId,
        stageId,
        row.riderId ?? null,
        row.teamId,
        resultTypeId,
        row.rank,
        row.timeSeconds,
        row.points,
        resultTypeId === RESULT_TYPES.stage && row.isBreakaway === true ? 1 : 0,
      );
    } catch (error) {
      throw new Error(
        `Ergebnis konnte nicht gespeichert werden (type=${resultTypeId}, stage=${stageId}, rank=${row.rank}, rider=${row.riderId ?? 'null'}, team=${row.teamId ?? 'null'}): ${(error as Error).message}`,
      );
    }
  }

  private evaluateRacePreferences(
    race: Race,
    stage: Stage,
    stageRows: any[],
    gcRows: any[],
    dnfEntries: Array<{ riderId: number; statusReason: string | null }>,
    ridersById: Map<number, Rider>
  ): void {
    const isFinalStage = !race.isStageRace || stage.stageNumber === race.numberOfStages;
    const isCat1Or2 = race.categoryId === 1 || race.categoryId === 2 || race.category?.name?.startsWith('1.') || race.category?.name?.startsWith('2.');
    const nameLow = race.name.toLowerCase();
    const isMonument = nameLow.includes('monument') || nameLow.includes('san remo') || nameLow.includes('sanremo') || nameLow.includes('roubaix') || nameLow.includes('vlaanderen') || nameLow.includes('flandern') || nameLow.includes('liège') || nameLow.includes('liege') || nameLow.includes('lombardia');

    const winRiderIds = new Set<number>();
    const dnfRiderIds = new Set<number>();

    if (isFinalStage) {
      const targetRows = race.isStageRace ? gcRows : stageRows;
      for (const row of targetRows) {
        if (row.rank === 1 && row.riderId) {
          winRiderIds.add(row.riderId);
        }
        if ((isCat1Or2 || isMonument) && row.rank <= 3 && row.riderId) {
          winRiderIds.add(row.riderId);
        }
      }
    }

    for (const entry of dnfEntries) {
      if (entry.statusReason === 'crash' && entry.riderId) {
        dnfRiderIds.add(entry.riderId);
      }
    }

    const ridersToUpdate = new Set([...winRiderIds, ...dnfRiderIds]);
    if (ridersToUpdate.size === 0) return;

    for (const riderId of ridersToUpdate) {
      const rider = ridersById.get(riderId);
      if (!rider) continue;
      
      let favs = [...(rider.favoriteRaces ?? [])];
      let nonFavs = [...(rider.nonFavoriteRaces ?? [])];
      let changed = false;

      if (dnfRiderIds.has(riderId)) {
        if (favs.includes(race.id)) {
          favs = favs.filter(id => id !== race.id);
          changed = true;
        }
        if (!nonFavs.includes(race.id)) {
          nonFavs.push(race.id);
          changed = true;
        }
      } else if (winRiderIds.has(riderId)) {
        if (nonFavs.includes(race.id)) {
          nonFavs = nonFavs.filter(id => id !== race.id);
          changed = true;
        }
        if (!favs.includes(race.id)) {
          favs.push(race.id);
          changed = true;
        }
      }

      if (changed) {
        rider.favoriteRaces = favs;
        rider.nonFavoriteRaces = nonFavs;
        this.db.prepare(`
          UPDATE riders
          SET favorite_races = ?, non_favorite_races = ?
          WHERE id = ?
        `).run(favs.join(','), nonFavs.join(','), riderId);
      }
    }
  }

  private evaluateU23Breakthroughs(
    race: Race,
    stage: Stage,
    stageRows: any[],
    gcRows: any[],
    pointsRows: any[],
    mountainRows: any[],
    youthRows: any[],
    ridersById: Map<number, Rider>
  ): void {
    const isCategory1Or2 = race.categoryId === 1 || race.categoryId === 2;
    const isFinalStage = !race.isStageRace || stage.stageNumber === race.numberOfStages;
    const currentSeason = this.repo.getCurrentSeason();
    const breakthroughRiderIds = new Set<number>();

    for (const row of stageRows) {
      if (row.rank === 1 && row.riderId) breakthroughRiderIds.add(row.riderId);
    }

    if (isCategory1Or2) {
      for (const row of stageRows) {
        if (row.rank <= 3 && row.riderId) breakthroughRiderIds.add(row.riderId);
      }
    }

    if (race.isStageRace && isFinalStage) {
      for (const row of gcRows) {
        if (row.rank <= 5 && row.riderId) breakthroughRiderIds.add(row.riderId);
      }
      for (const row of pointsRows) {
        if (row.rank === 1 && row.riderId) breakthroughRiderIds.add(row.riderId);
      }
      for (const row of mountainRows) {
        if (row.rank === 1 && row.riderId) breakthroughRiderIds.add(row.riderId);
      }
      for (const row of youthRows) {
        if (row.rank === 1 && row.riderId) breakthroughRiderIds.add(row.riderId);
      }
    }

    if (breakthroughRiderIds.size === 0) return;

    const validU23RiderIds = Array.from(breakthroughRiderIds).filter((riderId: any) => {
      const rider = ridersById.get(riderId);
      return rider && (currentSeason - rider.birthYear) <= 22;
    });

    if (validU23RiderIds.length === 0) return;

    const potColumns = [
      'pot_flat', 'pot_mountain', 'pot_medium_mountain', 'pot_hill', 'pot_time_trial',
      'pot_prologue', 'pot_cobble', 'pot_sprint', 'pot_acceleration', 'pot_downhill',
      'pot_attack', 'pot_stamina', 'pot_resistance', 'pot_recuperation', 'pot_bike_handling'
    ];

    for (const riderId of validU23RiderIds) {
      const riderPotentials = this.db.prepare(`
        SELECT pot_flat, pot_mountain, pot_medium_mountain, pot_hill, pot_time_trial,
               pot_prologue, pot_cobble, pot_sprint, pot_acceleration, pot_downhill,
               pot_attack, pot_stamina, pot_resistance, pot_recuperation, pot_bike_handling
        FROM riders WHERE id = ?
      `).get(riderId) as Record<string, number> | undefined;

      if (!riderPotentials) continue;

      const validColumns = potColumns.filter((col: any) => riderPotentials[col] < 85);
      if (validColumns.length === 0) continue;

      const selectedColumn = validColumns[Math.floor(Math.random() * validColumns.length)];
      this.db.prepare(`
        UPDATE riders SET ${selectedColumn} = ${selectedColumn} + 1 WHERE id = ?
      `).run(riderId);
    }
  }
}