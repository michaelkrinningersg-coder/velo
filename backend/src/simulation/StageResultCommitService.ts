import Database from 'better-sqlite3';
import { GameStateRepository } from "../db/repositories/GameStateRepository";
import { RaceRepository } from "../db/repositories/RaceRepository";
import { ResultRepository } from "../db/repositories/ResultRepository";
import { RiderRepository } from "../db/repositories/RiderRepository";
import { TeamRepository } from "../db/repositories/TeamRepository";
import { TeamCategoryStatsService } from '../game/TeamCategoryStatsService';

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
  RealtimeLeadoutContribution,
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
  breakaway: 7,
} as const;

const SUPPORTED_RESULT_TYPES: ResultType[] = [
  { id: RESULT_TYPES.stage, name: 'Stage' },
  { id: RESULT_TYPES.gc, name: 'GC' },
  { id: RESULT_TYPES.points, name: 'Points' },
  { id: RESULT_TYPES.mountain, name: 'Mountain' },
  { id: RESULT_TYPES.youth, name: 'Youth' },
  { id: RESULT_TYPES.team, name: 'Team' },
  { id: RESULT_TYPES.breakaway, name: 'Breakaway' },
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
  leadoutRiderId?: number | null;
  leadoutBonus?: number | null;
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
  leadoutRiderId?: number | null;
  leadoutBonus?: number | null;
}

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type IN ('table', 'view') AND name = ?").get(tableName) as { name: string } | undefined;
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
      syncSeasonPointEventsForSeason: (season?: number, stageId?: number) => gsRepo.syncSeasonPointEventsForSeason(season, stageId),
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
    leadoutContributions?: RealtimeLeadoutContribution[],
    superTeamId?: number,
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
        leadoutRiderId: entry.leadoutRiderId ?? null,
        leadoutBonus: entry.leadoutBonus ?? null,
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
        leadoutRiderId: entry.leadoutRiderId,
        leadoutBonus: entry.leadoutBonus,
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
      leadoutContributions,
      superTeamId,
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

    const deletedDnsRows = this.db.prepare(`
      SELECT r.id, r.first_name, r.last_name, rds.health_status, re.team_id
      FROM race_entries re
      JOIN riders r ON r.id = re.rider_id
      JOIN rider_daily_state rds ON rds.rider_id = re.rider_id
      WHERE re.race_id = ?
        AND rds.unavailable_days_remaining > 0
        AND re.rider_id NOT IN (
          SELECT DISTINCT se.rider_id
          FROM stage_entries se
          WHERE se.race_id = ?
            AND se.stage_id = ?
        )
        AND re.rider_id NOT IN (
          SELECT DISTINCT se.rider_id
          FROM stage_entries se
          JOIN stages s ON s.id = se.stage_id
          WHERE se.race_id = ?
            AND s.stage_number < ?
            AND se.status IN ('dns', 'dnf')
        )
    `).all(race.id, race.id, stage.id, race.id, stage.stageNumber) as Array<{
      id: number;
      first_name: string;
      last_name: string;
      health_status: string;
      team_id: number;
    }>;

    const explicitDnsRows = this.db.prepare(`
      SELECT r.id, r.first_name, r.last_name, se.status_reason, se.team_id
      FROM stage_entries se
      JOIN riders r ON r.id = se.rider_id
      WHERE se.stage_id = ?
        AND se.status = 'dns'
    `).all(stage.id) as Array<{
      id: number;
      first_name: string;
      last_name: string;
      status_reason: string | null;
      team_id: number;
    }>;

    const previousGcStandings = new ResultRepository(this.db).getPreviousGcStandings(race.id, stage.stageNumber);
    const previousGcMap = new Map<number, number>(previousGcStandings.map(s => [s.riderId, s.rank]));

    const events: RaceSimMessage[] = [];
    let eventIndex = 0;

    for (const row of deletedDnsRows) {
      const riderName = `${row.first_name} ${row.last_name}`;
      const gcRank = previousGcMap.get(row.id);
      const riderNameFormatted = gcRank != null ? `${riderName} (${gcRank}.)` : riderName;
      const reason = row.health_status === 'ill' ? 'Krankheitsbedingt' : 'Verletzungsbedingt';
      events.push({
        id: -1000 - eventIndex,
        elapsedSeconds: 0,
        riderId: row.id,
        riderName: riderName,
        riderTeamId: row.team_id,
        type: 'dnf' as const,
        tone: 'danger' as const,
        title: `${riderNameFormatted} nicht am Start`,
        detail: `${reason} nicht am Start der Etappe.`,
        kmMark: 0,
      });
      eventIndex++;
    }

    for (const row of explicitDnsRows) {
      const riderName = `${row.first_name} ${row.last_name}`;
      const gcRank = previousGcMap.get(row.id);
      const riderNameFormatted = gcRank != null ? `${riderName} (${gcRank}.)` : riderName;
      const reason = row.status_reason ?? 'Erschöpfungsbedingt';
      events.push({
        id: -1000 - eventIndex,
        elapsedSeconds: 0,
        riderId: row.id,
        riderName: riderName,
        riderTeamId: row.team_id,
        type: 'dnf' as const,
        tone: 'danger' as const,
        title: `${riderNameFormatted} nicht am Start`,
        detail: `${reason} nicht am Start der Etappe.`,
        kmMark: 0,
      });
      eventIndex++;
    }

    return events;
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
    leadoutContributions?: RealtimeLeadoutContribution[],
    superTeamId?: number,
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
          leadoutRiderId: entry.leadoutRiderId,
          leadoutBonus: entry.leadoutBonus,
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

    // Parse breakaway kms, form and home advantage events
    const riderEscapeStart = new Map<number, number>();
    const riderEscapeKms = new Map<number, number>();
    let stageDistance = 0;
    for (const event of events) {
      if (event.kmMark != null && event.kmMark > stageDistance) {
        stageDistance = event.kmMark;
      }
    }
    for (const event of events) {
      if (event.riderId == null) continue;
      const rId = event.riderId;
      const title = event.title ?? '';
      if (title.startsWith('Ausreißversuch:')) {
        if (event.kmMark != null) {
          riderEscapeStart.set(rId, event.kmMark);
        }
      } else if (title.startsWith('Ausreißer eingeholt:')) {
        const startKm = riderEscapeStart.get(rId);
        if (startKm != null) {
          const endKm = event.kmMark ?? startKm;
          riderEscapeKms.set(rId, (riderEscapeKms.get(rId) || 0) + Math.max(0, endKm - startKm));
          riderEscapeStart.delete(rId);
        }
      }
    }
    for (const [rId, startKm] of riderEscapeStart.entries()) {
      riderEscapeKms.set(rId, (riderEscapeKms.get(rId) || 0) + Math.max(0, stageDistance - startKm));
    }

    const crashCounts = new Map<number, number>();
    const defectCounts = new Map<number, number>();
    for (const inc of incidents) {
      if (inc.type === 'crash') {
        crashCounts.set(inc.riderId, (crashCounts.get(inc.riderId) || 0) + 1);
      } else if (inc.type === 'mechanical') {
        defectCounts.set(inc.riderId, (defectCounts.get(inc.riderId) || 0) + 1);
      }
    }

    const superformCounts = new Map<number, number>();
    const supermalusCounts = new Map<number, number>();
    const attackCounts = new Map<number, number>();
    const counterAttackCounts = new Map<number, number>();
    const homeAdvantageCounts = new Map<number, number>();
    const superHomeAdvantageCounts = new Map<number, number>();
    const homePressureCounts = new Map<number, number>();
    const breakawayAttemptCounts = new Map<number, number>();

    for (const ev of events) {
      if (ev.riderId == null) continue;
      const rId = ev.riderId;
      const title = ev.title ?? '';
      const detail = ev.detail ?? '';
      if (ev.type === 'attack') {
        if (title.toLowerCase().includes('ausreiß') || title.toLowerCase().includes('ausreiss')) {
          breakawayAttemptCounts.set(rId, (breakawayAttemptCounts.get(rId) || 0) + 1);
        } else {
          attackCounts.set(rId, (attackCounts.get(rId) || 0) + 1);
        }
      } else if (ev.type === 'counter_attack') {
        counterAttackCounts.set(rId, (counterAttackCounts.get(rId) || 0) + 1);
      } else {
        if (detail === 'Superform aktiv.') {
          superformCounts.set(rId, (superformCounts.get(rId) || 0) + 1);
        } else if (detail === 'Supermalus aktiv.') {
          supermalusCounts.set(rId, (supermalusCounts.get(rId) || 0) + 1);
        } else if (title.includes('Super-Heimvorteil')) {
          superHomeAdvantageCounts.set(rId, (superHomeAdvantageCounts.get(rId) || 0) + 1);
        } else if (title.includes('Heimdruck')) {
          homePressureCounts.set(rId, (homePressureCounts.get(rId) || 0) + 1);
        } else if (title.includes('Heimvorteil') && !title.includes('Super-Heimvorteil')) {
          homeAdvantageCounts.set(rId, (homeAdvantageCounts.get(rId) || 0) + 1);
        }
      }
    }

    const bestPrevStageRank = new Map<number, number>();
    if (race.isStageRace) {
      const prevRanks = this.db.prepare(`
        SELECT rider_id, MIN(rank) as min_rank
        FROM results
        WHERE race_id = ? AND result_type_id = 1 AND rider_id IS NOT NULL
        GROUP BY rider_id
      `).all(race.id) as Array<{ rider_id: number; min_rank: number }>;
      for (const r of prevRanks) {
        bestPrevStageRank.set(r.rider_id, r.min_rank);
      }
    }

    const getBestStagePlacementInRace = (riderId: number): number => {
      const prevBest = bestPrevStageRank.get(riderId) ?? 9999;
      const currentRank = stageRankByRiderId.get(riderId) ?? 9999;
      return Math.min(prevBest, currentRank);
    };

    const gcRankByRiderId = new Map<number, number>(
      gcRows.map((r: any) => [r.riderId as number, r.rank as number])
    );

    const previousBreakaway = this.loadPreviousRiderMetricMap(previousStageId, RESULT_TYPES.breakaway, 'breakaway_kms');
    const breakawayRows = race.isStageRace
      ? [...classificationPerformance]
          .map((entry: any) => {
            const currentStageKms = riderEscapeKms.get(entry.rider.id) ?? 0.0;
            const totalKms = (previousBreakaway.get(entry.rider.id) ?? 0.0) + currentStageKms;
            return {
              riderId: entry.rider.id,
              teamId: entry.team.id,
              breakawayKms: totalKms,
              points: Math.floor(totalKms),
            };
          })
          .filter((entry: any) => entry.breakawayKms > 0)
          .sort((left: any, right: any) => {
            const diff = right.breakawayKms - left.breakawayKms;
            if (Math.abs(diff) > 0.0001) {
              return diff;
            }
            const leftBestStage = getBestStagePlacementInRace(left.riderId);
            const rightBestStage = getBestStagePlacementInRace(right.riderId);
            if (leftBestStage !== rightBestStage) {
              return leftBestStage - rightBestStage;
            }
            const leftGcRank = gcRankByRiderId.get(left.riderId) ?? 9999;
            const rightGcRank = gcRankByRiderId.get(right.riderId) ?? 9999;
            return leftGcRank - rightGcRank || left.riderId - right.riderId;
          })
          .map((entry: any, index: any) => ({ ...entry, rank: index + 1, timeSeconds: null as number | null }))
      : [];

    const leadersAfterStage = new Map<number, string[]>();
    const addLeader = (riderId: number | null | undefined, key: string) => {
      if (riderId == null) return;
      const list = leadersAfterStage.get(riderId) ?? [];
      list.push(key);
      leadersAfterStage.set(riderId, list);
    };

    if (race.isStageRace) {
      const gcLeader = gcRows.find((r: any) => r.rank === 1)?.riderId;
      addLeader(gcLeader, 'yellow');

      const pointsLeader = pointsRows.find((r: any) => r.rank === 1)?.riderId;
      addLeader(pointsLeader, 'green');

      const mountainLeader = mountainRows.find((r: any) => r.rank === 1)?.riderId;
      addLeader(mountainLeader, 'red');

      const youthLeader = youthRows.find((r: any) => r.rank === 1)?.riderId;
      addLeader(youthLeader, 'white');

      const breakawayLeader = breakawayRows.find((r: any) => r.rank === 1)?.riderId;
      addLeader(breakawayLeader, 'purple');
    }

    const insert = this.db.prepare(`
      INSERT INTO results (
        race_id, stage_id, rider_id, team_id, result_type_id, rank, time_seconds, points, is_breakaway, leadout_rider_id, leadout_bonus, breakaway_kms, event_ids, jerseys_worn
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        const riderId = row.riderId;
        let eventIdsStr: string | null = null;
        if (riderId != null) {
          const eventParts: string[] = [];
          if ((crashCounts.get(riderId) ?? 0) > 0) eventParts.push(`1:${crashCounts.get(riderId)}`);
          if ((defectCounts.get(riderId) ?? 0) > 0) eventParts.push(`2:${defectCounts.get(riderId)}`);
          if ((superformCounts.get(riderId) ?? 0) > 0) eventParts.push(`3:${superformCounts.get(riderId)}`);
          if ((supermalusCounts.get(riderId) ?? 0) > 0) eventParts.push(`4:${supermalusCounts.get(riderId)}`);
          if ((attackCounts.get(riderId) ?? 0) > 0) eventParts.push(`5:${attackCounts.get(riderId)}`);
          if ((counterAttackCounts.get(riderId) ?? 0) > 0) eventParts.push(`6:${counterAttackCounts.get(riderId)}`);
          if ((homeAdvantageCounts.get(riderId) ?? 0) > 0) eventParts.push(`7:${homeAdvantageCounts.get(riderId)}`);
          if ((superHomeAdvantageCounts.get(riderId) ?? 0) > 0) eventParts.push(`8:${superHomeAdvantageCounts.get(riderId)}`);
          if ((homePressureCounts.get(riderId) ?? 0) > 0) eventParts.push(`9:${homePressureCounts.get(riderId)}`);
          if ((breakawayAttemptCounts.get(riderId) ?? 0) > 0) eventParts.push(`10:${breakawayAttemptCounts.get(riderId)}`);
          if (eventParts.length > 0) eventIdsStr = eventParts.join('|');
        }
        const breakawayKms = riderId != null ? (riderEscapeKms.get(riderId) ?? null) : null;
        const ledList = riderId != null ? (leadersAfterStage.get(riderId) ?? []) : [];
        const jerseysWorn = ledList.length > 0 ? ledList.join(',') : null;

        this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.stage, row, breakawayKms, eventIdsStr, jerseysWorn);
      }
      for (const row of gcRows) {
        this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.gc, row);
      }
      for (const row of pointsRows) {
        if (row.points != null && row.points > 0) {
          this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.points, row);
        }
      }
      for (const row of mountainRows) {
        if (row.points != null && row.points > 0) {
          this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.mountain, row);
        }
      }

      for (const row of breakawayRows) {
        this.insertResultRow(insert, race.id, stage.id, RESULT_TYPES.breakaway, {
          rank: row.rank,
          riderId: row.riderId,
          teamId: row.teamId,
          timeSeconds: null,
          points: row.points,
        }, row.breakawayKms);
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
        const entriesToSave = classification.entries.filter(
          (entry: any) => (entry.pointsAwarded != null && entry.pointsAwarded > 0) || entry.rank === 1
        );
        for (const entry of entriesToSave) {
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
            const lowerTitle = event.title.toLowerCase();
            if (!lowerTitle.includes('ausreiß') && !lowerTitle.includes('ausreiss')) {
              inc.attacks++;
            }
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

      // 5. Update season stats table (rider_season_stats)
      const currentSeason = this.repo.getCurrentSeason();

      // Ensure stats row exists for the season
      const insertSeasonStatsRowStmt = this.db.prepare(`
        INSERT OR IGNORE INTO rider_season_stats (rider_id, season) VALUES (?, ?)
      `);
      // Update statement for stage results career-like increments in season stats
      const updateSeasonCareerLikeStmt = this.db.prepare(`
        UPDATE rider_season_stats SET
          breakaway_attempts = breakaway_attempts + ?,
          attacks = attacks + ?,
          counter_attacks = counter_attacks + ?,
          crashes = crashes + ?,
          defects = defects + ?
        WHERE rider_id = ? AND season = ?
      `);

      // Fill basic rows
      for (const [riderId, inc] of careerStatsIncrements.entries()) {
        insertSeasonStatsRowStmt.run(riderId, currentSeason);
        updateSeasonCareerLikeStmt.run(
          inc.breakaway,
          inc.attacks,
          inc.counterAttacks,
          inc.crashes,
          inc.defects,
          riderId,
          currentSeason
        );
      }

      // DNS
      const dnsEvents = this.loadDnsEvents(race, stage);
      const updateDnsStmt = this.db.prepare(`
        UPDATE rider_season_stats SET dns_count = dns_count + 1 WHERE rider_id = ? AND season = ?
      `);
      for (const dns of dnsEvents) {
        if (dns.riderId != null) {
          insertSeasonStatsRowStmt.run(dns.riderId, currentSeason);
          updateDnsStmt.run(dns.riderId, currentSeason);
        }
      }

      // DNF / OTL
      const updateDnfStmt = this.db.prepare(`
        UPDATE rider_season_stats SET dnf_count = dnf_count + 1 WHERE rider_id = ? AND season = ?
      `);
      const updateOtlStmt = this.db.prepare(`
        UPDATE rider_season_stats SET otl_count = otl_count + 1 WHERE rider_id = ? AND season = ?
      `);
      for (const entry of dnfEntries) {
        insertSeasonStatsRowStmt.run(entry.riderId, currentSeason);
        if (entry.statusReason?.startsWith('OTL ')) {
          updateOtlStmt.run(entry.riderId, currentSeason);
        } else {
          updateDnfStmt.run(entry.riderId, currentSeason);
        }
      }

      const allEventRiderIds = new Set<number>([
        ...riderEscapeKms.keys(),
        ...superformCounts.keys(),
        ...supermalusCounts.keys(),
        ...superHomeAdvantageCounts.keys(),
        ...homeAdvantageCounts.keys(),
        ...homePressureCounts.keys(),
      ]);

      const updateSeasonEventsStmt = this.db.prepare(`
        UPDATE rider_season_stats SET
          breakaway_kms = breakaway_kms + ?,
          superform_days = superform_days + ?,
          supermalus_days = supermalus_days + ?,
          home_advantage_days = home_advantage_days + ?,
          super_home_advantage_days = super_home_advantage_days + ?,
          home_pressure_days = home_pressure_days + ?
        WHERE rider_id = ? AND season = ?
      `);

      for (const rId of allEventRiderIds) {
        insertSeasonStatsRowStmt.run(rId, currentSeason);
        updateSeasonEventsStmt.run(
          riderEscapeKms.get(rId) ?? 0.0,
          superformCounts.get(rId) ?? 0,
          supermalusCounts.get(rId) ?? 0,
          homeAdvantageCounts.get(rId) ?? 0,
          superHomeAdvantageCounts.get(rId) ?? 0,
          homePressureCounts.get(rId) ?? 0,
          rId,
          currentSeason
        );
      }

      this.repo.markStageEntriesFinished(stage.id, completedRiderIds);
      for (const entry of dnfEntries) {
        this.repo.updateStageEntryStatus(stage.id, entry.riderId, 'dnf', entry.statusReason);
      }
      for (const riderId of severeCrashRiderIds) {
        this.applySevereCrashInjury(stage.date, riderId);
      }

      // Clean up previous leadout contributions for this stage just in case
      this.db.prepare('DELETE FROM stage_leadouts WHERE stage_id = ?').run(stage.id);

      if (leadoutContributions && leadoutContributions.length > 0) {
        const insertLeadoutStmt = this.db.prepare(`
          INSERT INTO stage_leadouts (stage_id, race_id, season, team_id, sprinter_id, leadout_bonus, contributors_json)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        for (const c of leadoutContributions) {
          insertLeadoutStmt.run(stage.id, race.id, currentSeason, c.teamId, c.sprinterId, c.leadoutBonus, c.contributorsJson);
        }

        // 1. Keep only the top 200 leadouts for the current season to prevent database bloat
        this.db.prepare(`
          DELETE FROM stage_leadouts
          WHERE season = ? AND id NOT IN (
            SELECT id
            FROM stage_leadouts
            WHERE season = ?
            ORDER BY leadout_bonus DESC, id DESC
            LIMIT 200
          )
        `).run(currentSeason, currentSeason);

        // 2. Prune old seasons' leadouts that are not in the top 200 all-time
        this.db.prepare(`
          DELETE FROM stage_leadouts
          WHERE season != ? AND id NOT IN (
            SELECT id
            FROM stage_leadouts
            ORDER BY leadout_bonus DESC
            LIMIT 200
          )
        `).run(currentSeason);
      }

      if (superTeamId != null) {
        this.db.prepare('UPDATE stages SET super_team_id = ? WHERE id = ?').run(superTeamId, stage.id);
        const startingTeamRiderRows = this.db.prepare(`
          SELECT rider_id FROM stage_entries
          WHERE stage_id = ? AND team_id = ? AND status != 'dns'
        `).all(stage.id, superTeamId) as Array<{ rider_id: number }>;

        const insertSuperteamCareer = this.db.prepare(`
          INSERT INTO rider_career_stats (rider_id, superteam_count)
          VALUES (?, 1)
          ON CONFLICT(rider_id) DO UPDATE SET superteam_count = superteam_count + 1
        `);
        const updateSuperteamSeason = this.db.prepare(`
          UPDATE rider_season_stats
          SET superteam_count = superteam_count + 1
          WHERE rider_id = ? AND season = ?
        `);

        for (const row of startingTeamRiderRows) {
          const riderId = row.rider_id;
          insertSuperteamCareer.run(riderId);

          insertSeasonStatsRowStmt.run(riderId, currentSeason);
          updateSuperteamSeason.run(riderId, currentSeason);
        }
      }

      // --- INCREMENTAL STATS & ARCHIVING ---
      const categoryName = race.category?.name || "Unbekannt";

      // 1. Record Team Success Stats
      try {
        const statsService = new TeamCategoryStatsService(this.db);
        const isFinalStage = race.isStageRace && stage.stageNumber === race.numberOfStages;

        // Record Stage / One Day results
        for (const row of stageRows) {
          if (row.teamId != null) {
            statsService.recordStageResult(
              row.teamId,
              currentSeason,
              categoryName,
              row.rank,
              stage.profile,
              stage.rolledWeatherId ?? null,
              race.isStageRace
            );
          }
        }

        // Record Final Standings on the last stage of a stage race
        if (isFinalStage) {
          for (const row of gcRows) {
            statsService.recordGcResult(row.teamId, currentSeason, categoryName, row.rank, RESULT_TYPES.gc);
          }
          for (const row of pointsRows) {
            statsService.recordGcResult(row.teamId, currentSeason, categoryName, row.rank, RESULT_TYPES.points);
          }
          for (const row of mountainRows) {
            statsService.recordGcResult(row.teamId, currentSeason, categoryName, row.rank, RESULT_TYPES.mountain);
          }
          for (const row of youthRows) {
            statsService.recordGcResult(row.teamId, currentSeason, categoryName, row.rank, RESULT_TYPES.youth);
          }
          for (const row of breakawayRows) {
            statsService.recordGcResult(row.teamId, currentSeason, categoryName, row.rank, RESULT_TYPES.breakaway);
          }
          for (const row of teamRows) {
            statsService.recordGcResult(row.teamId, currentSeason, categoryName, row.rank, RESULT_TYPES.team);
          }
        }
      } catch (err: any) {
        console.error('Error updating team category stats:', err.message);
      }

      const insertCareerStatsRow = this.db.prepare(`
        INSERT OR IGNORE INTO rider_career_stats (rider_id) VALUES (?)
      `);

      const insertSeasonStatsRow = this.db.prepare(`
        INSERT OR IGNORE INTO rider_season_stats (rider_id, season) VALUES (?, ?)
      `);

      const getOrCreateCategoryStats = this.db.prepare(`
        INSERT OR IGNORE INTO rider_season_category_stats (rider_id, season, category_name) VALUES (?, ?, ?);
      `);

      const getOrCreateCareerCategoryStats = this.db.prepare(`
        INSERT OR IGNORE INTO rider_career_category_stats (rider_id, category_name) VALUES (?, ?);
      `);

      const updateCareerIncrement = this.db.prepare(`
        UPDATE rider_career_stats
        SET dns_count = dns_count + ?,
            dnf_count = dnf_count + ?,
            otl_count = otl_count + ?,
            breakaway_kms = breakaway_kms + ?,
            superform_days = superform_days + ?,
            supermalus_days = supermalus_days + ?,
            home_advantage_days = home_advantage_days + ?,
            super_home_advantage_days = super_home_advantage_days + ?,
            home_pressure_days = home_pressure_days + ?
        WHERE rider_id = ?
      `);

      const winnerRow = stageRows.find((r: any) => r.rank === 1);
      const isBreakawayWinner = winnerRow && winnerRow.riderId != null && breakawayRiderIds.has(winnerRow.riderId);

      const stageDistanceKm = stage.distanceKm ?? 0;

      const updateFinishedStats = this.db.prepare(`
        UPDATE rider_career_stats
        SET race_days = race_days + 1,
            successful_breakaways = successful_breakaways + ?,
            total_km = total_km + ?
        WHERE rider_id = ?
      `);

      const updateFinishedSeasonStats = this.db.prepare(`
        UPDATE rider_season_stats
        SET race_days = race_days + 1,
            successful_breakaways = successful_breakaways + ?,
            total_km = total_km + ?
        WHERE rider_id = ? AND season = ?
      `);

      const updateFinishedCategoryStats = this.db.prepare(`
        UPDATE rider_season_category_stats
        SET race_days = race_days + 1
        WHERE rider_id = ? AND season = ? AND category_name = ?
      `);

      const updateFinishedCareerCategoryStats = this.db.prepare(`
        UPDATE rider_career_category_stats
        SET race_days = race_days + 1
        WHERE rider_id = ? AND category_name = ?
      `);

      const getTeamRidersStmt = this.db.prepare(`
        SELECT rider_id FROM stage_entries
        WHERE stage_id = ? AND team_id = ? AND status NOT IN ('dns', 'dnf')
      `);

      const updateCategoryTttRank = this.db.prepare(`
        UPDATE rider_season_category_stats
        SET stage_wins = stage_wins + ?,
            stage_second = stage_second + ?,
            stage_third = stage_third + ?,
            stage_top_ten = stage_top_ten + ?,
            win_ttt = win_ttt + ?,
            win_weather_1 = win_weather_1 + ?,
            win_weather_2 = win_weather_2 + ?,
            win_weather_3 = win_weather_3 + ?,
            win_weather_4 = win_weather_4 + ?,
            win_weather_5 = win_weather_5 + ?,
            win_weather_6 = win_weather_6 + ?,
            win_weather_7 = win_weather_7 + ?
        WHERE rider_id = ? AND season = ? AND category_name = ?
      `);

      const updateCareerCategoryTttRank = this.db.prepare(`
        UPDATE rider_career_category_stats
        SET stage_wins = stage_wins + ?,
            stage_second = stage_second + ?,
            stage_third = stage_third + ?,
            stage_top_ten = stage_top_ten + ?,
            win_ttt = win_ttt + ?,
            win_weather_1 = win_weather_1 + ?,
            win_weather_2 = win_weather_2 + ?,
            win_weather_3 = win_weather_3 + ?,
            win_weather_4 = win_weather_4 + ?,
            win_weather_5 = win_weather_5 + ?,
            win_weather_6 = win_weather_6 + ?,
            win_weather_7 = win_weather_7 + ?
        WHERE rider_id = ? AND category_name = ?
      `);

      const updateCategoryPlacing = this.db.prepare(`
        UPDATE rider_season_category_stats
        SET stage_wins = stage_wins + ?,
            stage_second = stage_second + ?,
            stage_third = stage_third + ?,
            stage_top_ten = stage_top_ten + ?,
            one_day_wins = one_day_wins + ?,
            one_day_second = one_day_second + ?,
            one_day_third = one_day_third + ?,
            one_day_top_ten = one_day_top_ten + ?,
            win_flat = win_flat + ?,
            win_rolling = win_rolling + ?,
            win_hilly = win_hilly + ?,
            win_hilly_difficult = win_hilly_difficult + ?,
            win_medium_mountain = win_medium_mountain + ?,
            win_mountain = win_mountain + ?,
            win_high_mountain = win_high_mountain + ?,
            win_cobble = win_cobble + ?,
            win_cobble_hill = win_cobble_hill + ?,
            win_itt = win_itt + ?,
            win_weather_1 = win_weather_1 + ?,
            win_weather_2 = win_weather_2 + ?,
            win_weather_3 = win_weather_3 + ?,
            win_weather_4 = win_weather_4 + ?,
            win_weather_5 = win_weather_5 + ?,
            win_weather_6 = win_weather_6 + ?,
            win_weather_7 = win_weather_7 + ?
        WHERE rider_id = ? AND season = ? AND category_name = ?
      `);

      const updateCareerCategoryPlacing = this.db.prepare(`
        UPDATE rider_career_category_stats
        SET stage_wins = stage_wins + ?,
            stage_second = stage_second + ?,
            stage_third = stage_third + ?,
            stage_top_ten = stage_top_ten + ?,
            one_day_wins = one_day_wins + ?,
            one_day_second = one_day_second + ?,
            one_day_third = one_day_third + ?,
            one_day_top_ten = one_day_top_ten + ?,
            win_flat = win_flat + ?,
            win_rolling = win_rolling + ?,
            win_hilly = win_hilly + ?,
            win_hilly_difficult = win_hilly_difficult + ?,
            win_medium_mountain = win_medium_mountain + ?,
            win_mountain = win_mountain + ?,
            win_high_mountain = win_high_mountain + ?,
            win_cobble = win_cobble + ?,
            win_cobble_hill = win_cobble_hill + ?,
            win_itt = win_itt + ?,
            win_weather_1 = win_weather_1 + ?,
            win_weather_2 = win_weather_2 + ?,
            win_weather_3 = win_weather_3 + ?,
            win_weather_4 = win_weather_4 + ?,
            win_weather_5 = win_weather_5 + ?,
            win_weather_6 = win_weather_6 + ?,
            win_weather_7 = win_weather_7 + ?
        WHERE rider_id = ? AND category_name = ?
      `);

      for (const row of stageRows) {
        if (row.riderId == null) {
          if (stage.profile === 'TTT') {
            const teamRiderRows = getTeamRidersStmt.all(stage.id, row.teamId) as Array<{ rider_id: number }>;
            for (const teamRider of teamRiderRows) {
              const rId = teamRider.rider_id;
              insertCareerStatsRow.run(rId);
              insertSeasonStatsRow.run(rId, currentSeason);
              getOrCreateCategoryStats.run(rId, currentSeason, categoryName);
              getOrCreateCareerCategoryStats.run(rId, categoryName);

              const isSuccess = isBreakawayWinner && breakawayRiderIds.has(rId) ? 1 : 0;
              updateFinishedStats.run(isSuccess, stageDistanceKm, rId);
              updateFinishedSeasonStats.run(isSuccess, stageDistanceKm, rId, currentSeason);
              updateFinishedCategoryStats.run(rId, currentSeason, categoryName);
              updateFinishedCareerCategoryStats.run(rId, categoryName);

              const w1 = (row.rank === 1 && stage.rolledWeatherId === 1) ? 1 : 0;
              const w2 = (row.rank === 1 && stage.rolledWeatherId === 2) ? 1 : 0;
              const w3 = (row.rank === 1 && stage.rolledWeatherId === 3) ? 1 : 0;
              const w4 = (row.rank === 1 && stage.rolledWeatherId === 4) ? 1 : 0;
              const w5 = (row.rank === 1 && stage.rolledWeatherId === 5) ? 1 : 0;
              const w6 = (row.rank === 1 && stage.rolledWeatherId === 6) ? 1 : 0;
              const w7 = (row.rank === 1 && stage.rolledWeatherId === 7) ? 1 : 0;

              const valWins = row.rank === 1 ? 1 : 0;
              const valSec = row.rank === 2 ? 1 : 0;
              const valThird = row.rank === 3 ? 1 : 0;
              const valTopTen = (row.rank > 3 && row.rank <= 10) ? 1 : 0;

              updateCategoryTttRank.run(valWins, valSec, valThird, valTopTen, valWins, w1, w2, w3, w4, w5, w6, w7, rId, currentSeason, categoryName);
              updateCareerCategoryTttRank.run(valWins, valSec, valThird, valTopTen, valWins, w1, w2, w3, w4, w5, w6, w7, rId, categoryName);
            }
          }
          continue;
        }

        const rId = row.riderId;
        insertCareerStatsRow.run(rId);
        insertSeasonStatsRow.run(rId, currentSeason);
        getOrCreateCategoryStats.run(rId, currentSeason, categoryName);
        getOrCreateCareerCategoryStats.run(rId, categoryName);

        const isSuccess = isBreakawayWinner && breakawayRiderIds.has(rId) ? 1 : 0;
        updateFinishedStats.run(isSuccess, stageDistanceKm, rId);
        updateFinishedSeasonStats.run(isSuccess, stageDistanceKm, rId, currentSeason);
        updateFinishedCategoryStats.run(rId, currentSeason, categoryName);
        updateFinishedCareerCategoryStats.run(rId, categoryName);

        const escKms = riderEscapeKms.get(rId) ?? 0.0;
        const sform = superformCounts.get(rId) ?? 0;
        const smalus = supermalusCounts.get(rId) ?? 0;
        const homeAdv = homeAdvantageCounts.get(rId) ?? 0;
        const sHomeAdv = superHomeAdvantageCounts.get(rId) ?? 0;
        const homePress = homePressureCounts.get(rId) ?? 0;

        updateCareerIncrement.run(0, 0, 0, escKms, sform, smalus, homeAdv, sHomeAdv, homePress, rId);

        const pWins = row.rank === 1 ? 1 : 0;
        const pSec = row.rank === 2 ? 1 : 0;
        const pThird = row.rank === 3 ? 1 : 0;
        const pTopTen = (row.rank > 3 && row.rank <= 10) ? 1 : 0;

        const stageWins = race.isStageRace ? pWins : 0;
        const stageSecond = race.isStageRace ? pSec : 0;
        const stageThird = race.isStageRace ? pThird : 0;
        const stageTopTen = race.isStageRace ? pTopTen : 0;

        const oneDayWins = !race.isStageRace ? pWins : 0;
        const oneDaySecond = !race.isStageRace ? pSec : 0;
        const oneDayThird = !race.isStageRace ? pThird : 0;
        const oneDayTopTen = !race.isStageRace ? pTopTen : 0;

        const prof = stage.profile.toLowerCase();
        const f = (pWins && prof === 'flat') ? 1 : 0;
        const rol = (pWins && prof === 'rolling') ? 1 : 0;
        const hil = (pWins && prof === 'hilly') ? 1 : 0;
        const hd = (pWins && prof === 'hilly_difficult') ? 1 : 0;
        const mm = (pWins && prof === 'medium_mountain') ? 1 : 0;
        const mtn = (pWins && prof === 'mountain') ? 1 : 0;
        const hm = (pWins && prof === 'high_mountain') ? 1 : 0;
        const cob = (pWins && prof === 'cobble') ? 1 : 0;
        const ch = (pWins && prof === 'cobble_hill') ? 1 : 0;
        const itt = (pWins && prof === 'itt') ? 1 : 0;

        const w1 = (pWins && stage.rolledWeatherId === 1) ? 1 : 0;
        const w2 = (pWins && stage.rolledWeatherId === 2) ? 1 : 0;
        const w3 = (pWins && stage.rolledWeatherId === 3) ? 1 : 0;
        const w4 = (pWins && stage.rolledWeatherId === 4) ? 1 : 0;
        const w5 = (pWins && stage.rolledWeatherId === 5) ? 1 : 0;
        const w6 = (pWins && stage.rolledWeatherId === 6) ? 1 : 0;
        const w7 = (pWins && stage.rolledWeatherId === 7) ? 1 : 0;

        updateCategoryPlacing.run(
          stageWins, stageSecond, stageThird, stageTopTen,
          oneDayWins, oneDaySecond, oneDayThird, oneDayTopTen,
          f, rol, hil, hd, mm, mtn, hm, cob, ch, itt,
          w1, w2, w3, w4, w5, w6, w7,
          rId, currentSeason, categoryName
        );
        updateCareerCategoryPlacing.run(
          stageWins, stageSecond, stageThird, stageTopTen,
          oneDayWins, oneDaySecond, oneDayThird, oneDayTopTen,
          f, rol, hil, hd, mm, mtn, hm, cob, ch, itt,
          w1, w2, w3, w4, w5, w6, w7,
          rId, categoryName
        );
      }

      for (const dns of dnsEvents) {
        if (dns.riderId != null) {
          insertCareerStatsRow.run(dns.riderId);
          insertSeasonStatsRow.run(dns.riderId, currentSeason);
          updateCareerIncrement.run(1, 0, 0, 0.0, 0, 0, 0, 0, 0, dns.riderId);
        }
      }

      for (const entry of dnfEntries) {
        insertCareerStatsRow.run(entry.riderId);
        insertSeasonStatsRow.run(entry.riderId, currentSeason);
        const otl = entry.statusReason?.startsWith('OTL ') ? 1 : 0;
        const dnf = otl ? 0 : 1;
        updateCareerIncrement.run(0, dnf, otl, 0.0, 0, 0, 0, 0, 0, entry.riderId);
      }

      if (race.isStageRace && stage.stageNumber === race.numberOfStages) {
        const updateSeasonFinalClassifications = this.db.prepare(`
          UPDATE rider_season_category_stats
          SET gc_wins = gc_wins + ?,
              gc_second = gc_second + ?,
              gc_third = gc_third + ?,
              gc_top_ten = gc_top_ten + ?,
              points_wins = points_wins + ?,
              mountain_wins = mountain_wins + ?,
              youth_wins = youth_wins + ?,
              breakaway_wins = breakaway_wins + ?
          WHERE rider_id = ? AND season = ? AND category_name = ?
        `);

        const updateCareerFinalClassifications = this.db.prepare(`
          UPDATE rider_career_category_stats
          SET gc_wins = gc_wins + ?,
              gc_second = gc_second + ?,
              gc_third = gc_third + ?,
              gc_top_ten = gc_top_ten + ?,
              points_wins = points_wins + ?,
              mountain_wins = mountain_wins + ?,
              youth_wins = youth_wins + ?,
              breakaway_wins = breakaway_wins + ?
          WHERE rider_id = ? AND category_name = ?
        `);

        const getGCStats = (riderId: number) => {
          const gcR = gcRows.find((r: any) => r.riderId === riderId);
          const gcRank = gcR ? gcR.rank : 9999;
          const gcW = gcRank === 1 ? 1 : 0;
          const gc2 = gcRank === 2 ? 1 : 0;
          const gc3 = gcRank === 3 ? 1 : 0;
          const gcT = (gcRank > 3 && gcRank <= 10) ? 1 : 0;

          const ptsR = pointsRows.find((r: any) => r.riderId === riderId);
          const ptsW = (ptsR && ptsR.rank === 1) ? 1 : 0;

          const mtnR = mountainRows.find((r: any) => r.riderId === riderId);
          const mtnW = (mtnR && mtnR.rank === 1) ? 1 : 0;

          const ythR = youthRows.find((r: any) => r.riderId === riderId);
          const ythW = (ythR && ythR.rank === 1) ? 1 : 0;

          const brkR = breakawayRows.find((r: any) => r.riderId === riderId);
          const brkW = (brkR && brkR.rank === 1) ? 1 : 0;

          return { gcW, gc2, gc3, gcT, ptsW, mtnW, ythW, brkW };
        };

        const finalRiderIds = new Set([
          ...gcRows.map((r: any) => r.riderId as number),
          ...pointsRows.map((r: any) => r.riderId as number),
          ...mountainRows.map((r: any) => r.riderId as number),
          ...youthRows.map((r: any) => r.riderId as number),
          ...breakawayRows.map((r: any) => r.riderId as number)
        ].filter(id => id != null));

        for (const rId of finalRiderIds) {
          getOrCreateCategoryStats.run(rId, currentSeason, categoryName);
          getOrCreateCareerCategoryStats.run(rId, categoryName);

          const { gcW, gc2, gc3, gcT, ptsW, mtnW, ythW, brkW } = getGCStats(rId);
          updateSeasonFinalClassifications.run(gcW, gc2, gc3, gcT, ptsW, mtnW, ythW, brkW, rId, currentSeason, categoryName);
          updateCareerFinalClassifications.run(gcW, gc2, gc3, gcT, ptsW, mtnW, ythW, brkW, rId, categoryName);
        }
      }

      const updateMarkerSeasonWins = this.db.prepare(`
        UPDATE rider_season_category_stats
        SET sprint_wins = sprint_wins + ?,
            climb_wins_hc = climb_wins_hc + ?,
            climb_wins_1 = climb_wins_1 + ?,
            climb_wins_2 = climb_wins_2 + ?,
            climb_wins_3 = climb_wins_3 + ?,
            climb_wins_4 = climb_wins_4 + ?
        WHERE rider_id = ? AND season = ? AND category_name = ?
      `);

      const updateMarkerCareerWins = this.db.prepare(`
        UPDATE rider_career_category_stats
        SET sprint_wins = sprint_wins + ?,
            climb_wins_hc = climb_wins_hc + ?,
            climb_wins_1 = climb_wins_1 + ?,
            climb_wins_2 = climb_wins_2 + ?,
            climb_wins_3 = climb_wins_3 + ?,
            climb_wins_4 = climb_wins_4 + ?
        WHERE rider_id = ? AND category_name = ?
      `);

      const markerWins = new Map<number, { spr: number, hc: number, c1: number, c2: number, c3: number, c4: number }>();
      for (const classification of markerClassifications) {
        for (const entry of classification.entries) {
          if (entry.rank === 1) {
            const rId = entry.riderId;
            let mw = markerWins.get(rId);
            if (!mw) {
              mw = { spr: 0, hc: 0, c1: 0, c2: 0, c3: 0, c4: 0 };
              markerWins.set(rId, mw);
            }
            const mType = classification.markerType;
            const mCat = classification.markerCategory;
            if (mType === 'sprint_intermediate' || mCat === 'Sprint') {
              mw.spr++;
            }
            if (mCat === 'HC') mw.hc++;
            else if (mCat === '1') mw.c1++;
            else if (mCat === '2') mw.c2++;
            else if (mCat === '3') mw.c3++;
            else if (mCat === '4') mw.c4++;
          }
        }
      }

      for (const [rId, mw] of markerWins.entries()) {
        getOrCreateCategoryStats.run(rId, currentSeason, categoryName);
        getOrCreateCareerCategoryStats.run(rId, categoryName);
        updateMarkerSeasonWins.run(mw.spr, mw.hc, mw.c1, mw.c2, mw.c3, mw.c4, rId, currentSeason, categoryName);
        updateMarkerCareerWins.run(mw.spr, mw.hc, mw.c1, mw.c2, mw.c3, mw.c4, rId, categoryName);
      }

      if (race.isStageRace) {
        const updateJerseysSeason = this.db.prepare(`
          UPDATE rider_season_category_stats
          SET leader_jerseys = leader_jerseys + ?,
              points_jerseys = points_jerseys + ?,
              mountain_jerseys = mountain_jerseys + ?,
              youth_jerseys = youth_jerseys + ?,
              breakaway_jerseys = breakaway_jerseys + ?
          WHERE rider_id = ? AND season = ? AND category_name = ?
        `);

        const updateJerseysCareer = this.db.prepare(`
          UPDATE rider_career_category_stats
          SET leader_jerseys = leader_jerseys + ?,
              points_jerseys = points_jerseys + ?,
              mountain_jerseys = mountain_jerseys + ?,
              youth_jerseys = youth_jerseys + ?,
              breakaway_jerseys = breakaway_jerseys + ?
          WHERE rider_id = ? AND category_name = ?
        `);

        for (const [rId, ledList] of leadersAfterStage.entries()) {
          getOrCreateCategoryStats.run(rId, currentSeason, categoryName);
          getOrCreateCareerCategoryStats.run(rId, categoryName);

          const l = ledList.includes('yellow') ? 1 : 0;
          const p = ledList.includes('green') ? 1 : 0;
          const m = ledList.includes('red') ? 1 : 0;
          const y = ledList.includes('white') ? 1 : 0;
          const b = ledList.includes('purple') ? 1 : 0;

          updateJerseysSeason.run(l, p, m, y, b, rId, currentSeason, categoryName);
          updateJerseysCareer.run(l, p, m, y, b, rId, categoryName);
        }
      }

      // Saisonsiege inkrementell pflegen (ersetzt die fruehere taegliche Voll-
      // Aggregation in syncRiderLoadState, die ~370ms kostete und Siege bereits
      // kompaktierter Rennen verlor). Muss VOR der Kompaktierung laufen, solange
      // stage_entries noch als Live-Zeilen vorliegen.
      if (tableExists(this.db, 'rider_daily_state')) {
        const hasTttColumn = (this.db.prepare(
          `SELECT COUNT(*) AS c FROM pragma_table_info('rider_daily_state') WHERE name = 'season_ttt_wins'`,
        ).get() as { c: number }).c > 0;
        const bumpSeasonWin = this.db.prepare(`
          UPDATE rider_daily_state SET season_wins = season_wins + 1 WHERE rider_id = ?
        `);
        const bumpSeasonTttWin = hasTttColumn
          ? this.db.prepare(`
              UPDATE rider_daily_state SET season_wins = season_wins + 1, season_ttt_wins = season_ttt_wins + 1 WHERE rider_id = ?
            `)
          : bumpSeasonWin;

        const stageWinnerRow = stageRows.find((r: any) => r.rank === 1);
        if (stageWinnerRow) {
          if (stage.profile === 'TTT') {
            // Teamsieg: jeder gefinishte Fahrer des Siegerteams erhaelt einen
            // Sieg (gleiche Semantik wie die alte ttt_wins-CTE). Team-Ansichten
            // rechnen TTT-Siege wieder auf 1 Team-Sieg herunter.
            const tttFinishers = this.db.prepare(`
              SELECT rider_id FROM stage_entries
              WHERE stage_id = ? AND team_id = ? AND status = 'finished' AND rider_id IS NOT NULL
            `).all(stage.id, stageWinnerRow.teamId) as Array<{ rider_id: number }>;
            for (const finisher of tttFinishers) {
              bumpSeasonTttWin.run(finisher.rider_id);
            }
          } else if (stageWinnerRow.riderId != null) {
            bumpSeasonWin.run(stageWinnerRow.riderId);
          }
        }

        if (race.isStageRace && stage.stageNumber === race.numberOfStages) {
          const gcWinnerRow = gcRows.find((r: any) => r.rank === 1);
          if (gcWinnerRow?.riderId != null) {
            bumpSeasonWin.run(gcWinnerRow.riderId);
          }
        }
      }

      // "Im Fokus" auf dem Dashboard: Sieger der zuletzt simulierten Etappe
      // merken. Bei TTT gibt es keinen Einzelsieger — dann zaehlt der
      // bestplatzierte Fahrer des Siegerteams laut Etappen-GC.
      if (tableExists(this.db, 'career_meta')) {
        const focusWinnerRow = stageRows.find((r: any) => r.rank === 1);
        let focusRiderId: number | null = null;
        if (focusWinnerRow) {
          if (stage.profile === 'TTT') {
            focusRiderId = gcRows.find((r: any) => r.teamId === focusWinnerRow.teamId)?.riderId ?? null;
          } else {
            focusRiderId = focusWinnerRow.riderId ?? null;
          }
        }
        if (focusRiderId != null) {
          this.db.prepare(`
            INSERT OR REPLACE INTO career_meta (key, value) VALUES ('last_stage_winner', ?)
          `).run(JSON.stringify({
            riderId: focusRiderId,
            raceId: race.id,
            stageId: stage.id,
            raceName: race.name,
            stageNumber: race.isStageRace ? stage.stageNumber : null,
            isStageRace: race.isStageRace,
            isTeamTimeTrial: stage.profile === 'TTT',
          }));
        }
      }

      const isRaceFinished = !race.isStageRace || stage.stageNumber === race.numberOfStages;
      if (isRaceFinished) {
        const currentSeason = this.repo.getCurrentSeason();

        // 1. Archive stage entries
        const stageEntries = this.db.prepare(`
          SELECT stage_id, team_id, rider_id, status, status_reason
          FROM stage_entries
          WHERE race_id = ?
        `).all(race.id) as any[];

        const compactStageEntries = stageEntries.map(row => [
          row.stage_id,
          row.team_id,
          row.rider_id,
          row.status,
          row.status_reason
        ]);

        this.db.prepare(`
          INSERT OR REPLACE INTO stage_entries_compact (race_id, season, payload)
          VALUES (?, ?, ?)
        `).run(race.id, currentSeason, JSON.stringify(compactStageEntries));

        this.db.prepare(`
          DELETE FROM stage_entries
          WHERE race_id = ?
        `).run(race.id);

        // 2. Archive race entries
        const raceEntries = this.db.prepare(`
          SELECT team_id, rider_id
          FROM active_race_entries
          WHERE race_id = ?
        `).all(race.id) as any[];

        const compactRaceEntries = raceEntries.map(row => [
          row.team_id,
          row.rider_id
        ]);

        this.db.prepare(`
          INSERT OR REPLACE INTO race_entries_compact (race_id, season, payload)
          VALUES (?, ?, ?)
        `).run(race.id, currentSeason, JSON.stringify(compactRaceEntries));

        this.db.prepare(`
          DELETE FROM active_race_entries
          WHERE race_id = ?
        `).run(race.id);

        // 3. Clear transient race state
        this.db.prepare(`
          DELETE FROM rider_stage_race_state
          WHERE race_id = ?
        `).run(race.id);

        // 4. Archive active results into compact JSON format
        const activeResults = this.db.prepare(`
          SELECT r.stage_id, r.rider_id, r.team_id, r.result_type_id, r.rank, r.time_seconds, r.points, r.is_breakaway, r.leadout_rider_id, r.leadout_bonus, r.breakaway_kms, r.event_ids, r.jerseys_worn
          FROM results r
          JOIN stages s ON s.id = r.stage_id
          WHERE s.race_id = ?
        `).all(race.id) as any[];

        const groups: Record<string, any[]> = {
          type1: [],
          type2: [],
          type3: [],
          type4: [],
          type6: [],
          type7: []
        };

        for (const row of activeResults) {
          const typeKey = `type${row.result_type_id}`;
          if (groups[typeKey]) {
            groups[typeKey].push([
              row.stage_id,
              row.rider_id,
              row.team_id,
              row.rank,
              row.time_seconds,
              row.points,
              row.is_breakaway,
              row.leadout_rider_id,
              row.leadout_bonus,
              row.breakaway_kms,
              row.event_ids,
              row.jerseys_worn
            ]);
          }
        }

        this.db.prepare(`
          INSERT OR REPLACE INTO race_results_compact (race_id, season, payload)
          VALUES (?, ?, ?)
        `).run(race.id, currentSeason, JSON.stringify(groups));

        this.db.prepare(`
          DELETE FROM results
          WHERE stage_id IN (SELECT id FROM stages WHERE race_id = ?)
        `).run(race.id);
      }
    })();

    const gameStateService = new GameStateService(this.db);
    gameStateService.applyRaceDayFormBonuses(stage.date, completedRiderIds);
    gameStateService.refreshRiderLoadState(stage.date, this.repo.getCurrentSeason());
    gameStateService.applyStageFatigue(stage.id, completedRiderIds, dnfEntries.map((e) => e.riderId));

    this.repo.syncSeasonPointEventsForSeason(this.repo.getCurrentSeason(), stage.id);

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
        unavailable_days_remaining INTEGER NOT NULL DEFAULT 0 CHECK(unavailable_days_remaining >= 0),
        season_race_days_total INTEGER NOT NULL DEFAULT 0 CHECK(season_race_days_total >= 0),
        rolling_30d_race_days INTEGER NOT NULL DEFAULT 0 CHECK(rolling_30d_race_days >= 0),
        short_term_fatigue REAL NOT NULL DEFAULT 0.0,
        long_term_fatigue_decayable REAL NOT NULL DEFAULT 0.0,
        long_term_fatigue_locked REAL NOT NULL DEFAULT 0.0
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
    if (tableExists(this.db, 'rider_season_stats')) {
      const currentSeason = this.repo.getCurrentSeason();
      this.db.prepare(`
        INSERT INTO rider_season_stats (
          rider_id, season, injuries, injury_days
        ) VALUES (?, ?, 1, ?)
        ON CONFLICT(rider_id, season) DO UPDATE SET
          injuries = injuries + excluded.injuries,
          injury_days = injury_days + excluded.injury_days
      `).run(riderId, currentSeason, durationDays);
    }
  }

  private ensureStageCanBeSimulated(stage: Stage): void {
    const existing = this.db.prepare(`
      SELECT 1
      FROM all_results
      WHERE stage_id = ? AND result_type_id = ?
      LIMIT 1
    `).get(stage.id, RESULT_TYPES.stage);
    if (existing) {
      throw new Error('Diese Etappe wurde bereits simuliert.');
    }

    const row = this.db.prepare(`
      SELECT MAX(stages.stage_number) AS last_stage_number
      FROM all_results results
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

  private loadPreviousRiderMetricMap(previousStageId: number | null, resultTypeId: number, column: 'time_seconds' | 'points' | 'breakaway_kms'): Map<number, number> {
    if (previousStageId == null) return new Map<number, any>();
    const rows = this.db.prepare(`
      SELECT rider_id, team_id, time_seconds, points, breakaway_kms
      FROM results
      WHERE stage_id = ? AND result_type_id = ? AND rider_id IS NOT NULL
    `).all(previousStageId, resultTypeId) as any[];
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
    breakawayKms: number | null = null,
    eventIds: string | null = null,
    jerseysWorn: string | null = null,
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
        resultTypeId === RESULT_TYPES.stage && row.leadoutRiderId != null ? row.leadoutRiderId : null,
        resultTypeId === RESULT_TYPES.stage && row.leadoutBonus != null ? row.leadoutBonus : null,
        breakawayKms,
        eventIds,
        jerseysWorn,
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
    const isCat1Or2 = race.categoryId === 1 || race.categoryId === 2 || race.categoryId === 3 || race.category?.name?.startsWith('1.') || race.category?.name?.startsWith('2.');
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

    const updateRiderPrefs = this.db.prepare(`
      UPDATE riders
      SET favorite_races = ?, non_favorite_races = ?
      WHERE id = ?
    `);

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
        updateRiderPrefs.run(favs.join(','), nonFavs.join(','), riderId);
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
    const isCategory1Or2 = race.categoryId === 1 || race.categoryId === 2 || race.categoryId === 3;
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

    const getRiderPotentialsStmt = this.db.prepare(`
      SELECT pot_flat, pot_mountain, pot_medium_mountain, pot_hill, pot_time_trial,
             pot_prologue, pot_cobble, pot_sprint, pot_acceleration, pot_downhill,
             pot_attack, pot_stamina, pot_resistance, pot_recuperation, pot_bike_handling
      FROM riders WHERE id = ?
    `);

    for (const riderId of validU23RiderIds) {
      const riderPotentials = getRiderPotentialsStmt.get(riderId) as Record<string, number> | undefined;

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