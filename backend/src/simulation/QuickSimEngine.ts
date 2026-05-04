import Database from 'better-sqlite3';
import { GameRepository } from '../db/GameRepository';
import { ensureRaceEntries } from './RaceRosterService';
import { StageParser } from './StageParser';
import { TimeTrialSimulator } from './TimeTrialSimulator';
import {
  ParsedStageSegment,
  QuickSimResponse,
  Race,
  RealtimeStageCommitEntry,
  ResultType,
  Rider,
  Stage,
  StageMarker,
  StageMarkerCategory,
  Team,
} from '../../../shared/types';

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

const FLAT_BASE_SPEED = 45;
const DOWNHILL_BASE_SPEED = 60;
const MOUNTAIN_BASE_SPEED_AT_10_PERCENT = 15;
const ACTIVE_SKILL_SPEED_FACTOR = 0.28;
const FORM_MIN = 0.97;
const FORM_MAX = 1.03;
const ALTITUDE_THRESHOLD_METERS = 1500;
const FATIGUE_THRESHOLD_KM = 150;
const COBBLE_FATIGUE_THRESHOLD_KM = 10;
const TECH_PENALTY_FACTOR = 0.002;
const WIND_FACTOR = 0.0025;
const MIN_SEGMENT_SPEED_KMH = 6;

interface PerformanceEntry {
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
}

interface RiderStageState extends PerformanceEntry {
  currentKm: number;
  cobbleKm: number;
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

interface MarkerAtKm {
  kmMark: number;
  marker: StageMarker;
}

interface ResultInsertRow {
  rank: number;
  riderId?: number | null;
  teamId: number | null;
  timeSeconds: number | null;
  points: number | null;
}

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName) as { name: string } | undefined;
  return row != null;
}

function parseRankedValues(serialized: string | undefined): number[] {
  if (!serialized) return [];
  return serialized
    .split('|')
    .map((value) => Number.parseInt(value.trim(), 10))
    .filter((value) => Number.isFinite(value));
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function roundSeconds(value: number): number {
  return Math.max(0, Math.round(value));
}

function appendToNumberMap(target: Map<number, number>, key: number, value: number): void {
  if (value === 0) return;
  target.set(key, (target.get(key) ?? 0) + value);
}

function comparePerformanceEntries(left: Pick<PerformanceEntry, 'stageTimeSeconds' | 'photoFinishScore' | 'rider'>, right: Pick<PerformanceEntry, 'stageTimeSeconds' | 'photoFinishScore' | 'rider'>): number {
  return left.stageTimeSeconds - right.stageTimeSeconds
    || right.photoFinishScore - left.photoFinishScore
    || left.rider.id - right.rider.id;
}

function resolveFormBonus(rider: Rider): number {
  return (rider.formBonus ?? 0) + (rider.raceFormBonus ?? 0);
}

export class QuickSimEngine {
  private readonly repo: GameRepository;

  constructor(private readonly db: Database.Database) {
    this.repo = new GameRepository(db);
  }

  public simulateStage(stageId: number): QuickSimResponse {
    const { race, stage, riders, teamsById } = this.loadSimulatableStageContext(stageId);

    const performance = stage.profile === 'ITT'
      ? this.simulateTimeTrialStage(race, stage, riders, teamsById)
      : this.simulateMassStartStage(race, stage, riders, teamsById);

    return this.persistStagePerformance(race, stage, performance);
  }

  public commitRealtimeStage(stageId: number, entries: RealtimeStageCommitEntry[]): QuickSimResponse {
    const { race, stage, riders, teamsById } = this.loadSimulatableStageContext(stageId);
    const rosterById = new Map(riders.map((rider) => [rider.id, rider]));
    const sanitizedEntries = [...entries]
      .filter((entry) => Number.isFinite(entry.riderId) && Number.isFinite(entry.finishTimeSeconds))
      .map((entry) => ({
        riderId: entry.riderId,
        finishTimeSeconds: roundSeconds(entry.finishTimeSeconds),
        photoFinishScore: Number.isFinite(entry.photoFinishScore) ? entry.photoFinishScore : 0,
      }))
      .sort((left, right) => left.finishTimeSeconds - right.finishTimeSeconds || (right.photoFinishScore ?? 0) - (left.photoFinishScore ?? 0) || left.riderId - right.riderId);

    if (sanitizedEntries.length !== riders.length) {
      throw new Error('Die Live-Simulation muss genau eine Zielzeit für jeden Starter übergeben.');
    }

    const seenRiderIds = new Set<number>();
    const performance = sanitizedEntries.map((entry) => {
      const rider = rosterById.get(entry.riderId);
      if (!rider) {
        throw new Error(`Live-Ergebnis für unbekannten Fahrer ${entry.riderId} erhalten.`);
      }
      if (seenRiderIds.has(entry.riderId)) {
        throw new Error(`Live-Ergebnis für Fahrer ${entry.riderId} wurde doppelt übergeben.`);
      }
      seenRiderIds.add(entry.riderId);

      const team = teamsById.get(rider.activeTeamId ?? -1);
      if (!team) {
        throw new Error(`Team für Fahrer ${rider.firstName} ${rider.lastName} konnte nicht geladen werden.`);
      }

      return {
        rider,
        team,
        dayForm: 1,
        performanceScore: 0,
        rawTimeSeconds: entry.finishTimeSeconds,
        stageTimeSeconds: entry.finishTimeSeconds,
        photoFinishScore: entry.photoFinishScore ?? 0,
        points: 0,
        gcBonusSeconds: 0,
        mountainPoints: 0,
      } satisfies PerformanceEntry;
    });

    if (seenRiderIds.size !== riders.length) {
      throw new Error('Die Live-Simulation hat nicht alle Starter geliefert.');
    }

    this.applyFinishLineAwards(race, performance, {
      awardPoints: stage.profile !== 'TTT',
      awardTimeBonuses: stage.profile !== 'ITT' && stage.profile !== 'TTT',
    });

    return this.persistStagePerformance(race, stage, performance);
  }

  private loadSimulatableStageContext(stageId: number): {
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

    const riders = ensureRaceEntries(this.db, this.repo, race);
    if (riders.length === 0) {
      throw new Error('Für dieses Rennen konnten keine Fahrer für die Startliste bestimmt werden.');
    }

    const teamsById = new Map(this.repo.getTeams().map((team) => [team.id, team]));
    const missingTeam = riders.find((rider) => rider.activeTeamId == null || !teamsById.has(rider.activeTeamId));
    if (missingTeam) {
      throw new Error(`Team für Fahrer ${missingTeam.firstName} ${missingTeam.lastName} konnte nicht aufgelöst werden.`);
    }

    return { race, stage, riders, teamsById };
  }

  private applyFinishLineAwards(
    race: Race,
    performance: PerformanceEntry[],
    options: { awardPoints: boolean; awardTimeBonuses: boolean } = { awardPoints: true, awardTimeBonuses: true },
  ): void {
    if (!race.category?.bonusSystem) {
      return;
    }

    const finishPointValues = options.awardPoints && race.isStageRace
      ? parseRankedValues(race.category.bonusSystem.pointsSprintFinish)
      : [];
    const finishBonusValues = options.awardTimeBonuses
      ? parseRankedValues(race.category.bonusSystem.bonusSecondsFinal)
      : [];
    const sorted = [...performance].sort(comparePerformanceEntries);

    finishPointValues.forEach((points, index) => {
      const entry = sorted[index];
      if (!entry) return;
      entry.points += points;
    });

    finishBonusValues.forEach((bonusSeconds, index) => {
      const entry = sorted[index];
      if (!entry) return;
      entry.gcBonusSeconds += bonusSeconds;
    });
  }

  private persistStagePerformance(race: Race, stage: Stage, performance: PerformanceEntry[]): QuickSimResponse {
    const rankedPerformance = [...performance].sort(comparePerformanceEntries);

    const previousStageId = this.getPreviousSimulatedStageId(stage.raceId, stage.stageNumber);
    const previousGc = this.loadPreviousRiderMetricMap(previousStageId, RESULT_TYPES.gc, 'time_seconds');
    const previousPoints = this.loadPreviousRiderMetricMap(previousStageId, RESULT_TYPES.points, 'points');
    const previousMountain = this.loadPreviousRiderMetricMap(previousStageId, RESULT_TYPES.mountain, 'points');
    const previousTeam = this.loadPreviousTeamMetricMap(previousStageId, RESULT_TYPES.team, 'time_seconds');

    const stageRows = rankedPerformance.map((entry, index) => ({
      rank: index + 1,
      riderId: entry.rider.id,
      teamId: entry.team.id,
      timeSeconds: entry.stageTimeSeconds,
      points: race.isStageRace ? entry.points : null,
    }));

    const gcRows = [...performance]
      .map((entry) => ({
        riderId: entry.rider.id,
        teamId: entry.team.id,
        timeSeconds: (previousGc.get(entry.rider.id) ?? 0) + entry.stageTimeSeconds - entry.gcBonusSeconds,
      }))
      .sort((left, right) => left.timeSeconds - right.timeSeconds || left.riderId - right.riderId)
      .map((entry, index) => ({ ...entry, rank: index + 1, points: null as number | null }));

    const pointsRows = race.isStageRace
      ? [...performance]
          .map((entry) => ({
            riderId: entry.rider.id,
            teamId: entry.team.id,
            points: (previousPoints.get(entry.rider.id) ?? 0) + entry.points,
          }))
          .sort((left, right) => right.points - left.points || left.riderId - right.riderId)
          .map((entry, index) => ({ ...entry, rank: index + 1, timeSeconds: null as number | null }))
      : [];

    const mountainRows = race.isStageRace
      ? [...performance]
          .map((entry) => ({
            riderId: entry.rider.id,
            teamId: entry.team.id,
            points: (previousMountain.get(entry.rider.id) ?? 0) + entry.mountainPoints,
          }))
          .sort((left, right) => right.points - left.points || left.riderId - right.riderId)
          .map((entry, index) => ({ ...entry, rank: index + 1, timeSeconds: null as number | null }))
      : [];

    const currentSeason = this.repo.getCurrentSeason();
    const youthRows = race.isStageRace
      ? gcRows
          .filter((entry) => {
            const rider = rankedPerformance.find((candidate) => candidate.rider.id === entry.riderId)?.rider;
            return rider != null && currentSeason - rider.birthYear <= 25;
          })
          .map((entry, index) => ({
            rank: index + 1,
            riderId: entry.riderId,
            teamId: entry.teamId,
            timeSeconds: entry.timeSeconds,
            points: null as number | null,
          }))
      : [];

    const teamIds = [...new Set(rankedPerformance.map((entry) => entry.team.id))];
    const stageTeamTimes = new Map<number, number>();
    for (const teamId of teamIds) {
      const teamEntries = rankedPerformance
        .filter((entry) => entry.team.id === teamId)
        .sort((left, right) => left.stageTimeSeconds - right.stageTimeSeconds)
        .slice(0, 3);
      if (teamEntries.length < 3) continue;
      stageTeamTimes.set(teamId, teamEntries.reduce((sum, entry) => sum + entry.stageTimeSeconds, 0));
    }

    const teamRows = [...stageTeamTimes.entries()]
      .map(([teamId, stageTime]) => ({
        teamId,
        timeSeconds: (previousTeam.get(teamId) ?? 0) + stageTime,
      }))
      .sort((left, right) => left.timeSeconds - right.timeSeconds || left.teamId - right.teamId)
      .map((entry, index) => ({
        rank: index + 1,
        teamId: entry.teamId,
        timeSeconds: entry.timeSeconds,
        points: null as number | null,
      }));

    const insert = this.db.prepare(`
      INSERT INTO results (
        race_id, stage_id, rider_id, team_id, result_type_id, rank, time_seconds, points
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    this.db.transaction(() => {
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
        });
      }
    })();

    this.repo.syncSeasonPointEventsForSeason(this.repo.getCurrentSeason());

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

  private simulateTimeTrialStage(
    race: Race,
    stage: Stage,
    riders: Rider[],
    teamsById: Map<number, Team>,
  ): PerformanceEntry[] {
    const ttResult = TimeTrialSimulator.simulate(race, stage, riders);
    return ttResult.entries.map((entry) => {
      const team = teamsById.get(entry.rider.activeTeamId ?? -1);
      if (!team) {
        throw new Error(`Team für Fahrer ${entry.rider.firstName} ${entry.rider.lastName} konnte nicht geladen werden.`);
      }
      return {
        rider: entry.rider,
        team,
        dayForm: entry.dayFormFactor,
        performanceScore: 0,
        rawTimeSeconds: entry.finishTimeSeconds,
        stageTimeSeconds: roundSeconds(entry.finishTimeSeconds),
        photoFinishScore: 0,
        points: 0,
        gcBonusSeconds: 0,
        mountainPoints: 0,
      } satisfies PerformanceEntry;
    });
  }

  private simulateMassStartStage(
    race: Race,
    stage: Stage,
    riders: Rider[],
    teamsById: Map<number, Team>,
  ): PerformanceEntry[] {
    const summary = StageParser.summarizeStageProfile(stage.detailsCsvFile);
    const markers = summary.points.flatMap((point) => point.markers.map((marker) => ({ kmMark: point.kmMark, marker })));
    const sprintPointValues = race.isStageRace
      ? parseRankedValues(race.category?.bonusSystem?.pointsSprintIntermediate)
      : [];
    const sprintBonusValues = race.isStageRace
      ? parseRankedValues(race.category?.bonusSystem?.bonusSecondsIntermediate)
      : [];
    const finishBonusValues = parseRankedValues(race.category?.bonusSystem?.bonusSecondsFinal);
    // Finish-line sprint points feed the race-internal points jersey, not season stage awards.
    const finishPointValues = race.isStageRace
      ? parseRankedValues(race.category?.bonusSystem?.pointsSprintFinish)
      : [];
    const mountainPointValues = {
      HC: parseRankedValues(race.category?.bonusSystem?.pointsMountainHc),
      '1': parseRankedValues(race.category?.bonusSystem?.pointsMountainCat1),
      '2': parseRankedValues(race.category?.bonusSystem?.pointsMountainCat2),
      '3': parseRankedValues(race.category?.bonusSystem?.pointsMountainCat3),
      '4': parseRankedValues(race.category?.bonusSystem?.pointsMountainCat4),
    } satisfies Record<Exclude<StageMarkerCategory, 'Sprint'>, number[]>;

    const states = riders.map((rider) => {
      const team = teamsById.get(rider.activeTeamId ?? -1);
      if (!team) {
        throw new Error(`Team für Fahrer ${rider.firstName} ${rider.lastName} konnte nicht geladen werden.`);
      }
      const dayForm = randomBetween(FORM_MIN, FORM_MAX);
      return {
        rider,
        team,
        dayForm,
        performanceScore: 0,
        rawTimeSeconds: 0,
        stageTimeSeconds: 0,
        photoFinishScore: 0,
        points: 0,
        gcBonusSeconds: 0,
        mountainPoints: 0,
        currentKm: 0,
        cobbleKm: 0,
      } satisfies RiderStageState;
    });

    for (const segment of summary.segments) {
      for (const entry of states) {
        entry.rawTimeSeconds += this.simulateMassStartSegment(
          entry.rider,
          segment,
          entry.dayForm,
          entry.currentKm,
          entry.cobbleKm,
        );
        entry.currentKm += segment.length_km;
        if (segment.terrain === 'Cobble' || segment.terrain === 'Cobble_Hill') {
          entry.cobbleKm += segment.length_km;
        }
      }

      this.applyPelotonEffect(states, segment);
    }

    const sorted = [...states]
      .sort((left, right) => left.rawTimeSeconds - right.rawTimeSeconds || this.resolvePhotoFinishScore(right.rider, right.dayForm, summary.distanceKm) - this.resolvePhotoFinishScore(left.rider, left.dayForm, summary.distanceKm) || left.rider.id - right.rider.id)
      .map((entry) => ({
        ...entry,
        stageTimeSeconds: roundSeconds(entry.rawTimeSeconds),
        photoFinishScore: this.resolvePhotoFinishScore(entry.rider, entry.dayForm, summary.distanceKm),
      }));

    finishPointValues.forEach((points, index) => {
      const entry = sorted[index];
      if (!entry) return;
      entry.points += points;
    });
    finishBonusValues.forEach((bonusSeconds, index) => {
      const entry = sorted[index];
      if (!entry) return;
      entry.gcBonusSeconds += bonusSeconds;
    });

    const sprintPointsByRider = new Map<number, number>();
    const sprintBonusesByRider = new Map<number, number>();
    for (const marker of markers.filter((candidate) => candidate.marker.type === 'sprint_intermediate')) {
      const sprintRanking = [...sorted]
        .sort((left, right) => this.resolveSprintScore(right.rider, marker.kmMark / summary.distanceKm, right.dayForm) - this.resolveSprintScore(left.rider, marker.kmMark / summary.distanceKm, left.dayForm));
      sprintPointValues.forEach((points, index) => {
        const entry = sprintRanking[index];
        if (!entry) return;
        appendToNumberMap(sprintPointsByRider, entry.rider.id, points);
      });
      sprintBonusValues.forEach((bonusSeconds, index) => {
        const entry = sprintRanking[index];
        if (!entry) return;
        appendToNumberMap(sprintBonusesByRider, entry.rider.id, bonusSeconds);
      });
    }

    const mountainPointsByRider = new Map<number, number>();
    for (const marker of markers.filter((candidate) => candidate.marker.type === 'climb_top' && candidate.marker.cat != null && candidate.marker.cat !== 'Sprint')) {
      const pointValues = mountainPointValues[marker.marker.cat as Exclude<StageMarkerCategory, 'Sprint'>];
      const climbingRanking = [...sorted]
        .sort((left, right) => this.resolveClimbScore(right.rider, marker.kmMark / summary.distanceKm, right.dayForm) - this.resolveClimbScore(left.rider, marker.kmMark / summary.distanceKm, left.dayForm));
      pointValues.forEach((points, index) => {
        const entry = climbingRanking[index];
        if (!entry) return;
        appendToNumberMap(mountainPointsByRider, entry.rider.id, points);
      });
    }

    return sorted.map((entry) => ({
      ...entry,
      points: entry.points + (sprintPointsByRider.get(entry.rider.id) ?? 0),
      gcBonusSeconds: entry.gcBonusSeconds + (sprintBonusesByRider.get(entry.rider.id) ?? 0),
      mountainPoints: mountainPointsByRider.get(entry.rider.id) ?? 0,
    }));
  }

  private simulateMassStartSegment(
    rider: Rider,
    segment: ParsedStageSegment,
    dayForm: number,
    currentKm: number,
    cobbleKm: number,
  ): number {
    const activeSkill = this.resolveActiveSkill(rider, segment);
    const baseSpeed = this.resolveSegmentBaseSpeed(segment);
    const averageKm = currentKm + (segment.length_km / 2);
    const averageCobbleKm = cobbleKm + ((segment.terrain === 'Cobble' || segment.terrain === 'Cobble_Hill') ? (segment.length_km / 2) : 0);
    const techFactor = 1 - ((segment.tech_level - 1) * TECH_PENALTY_FACTOR);
    const windFactor = 1 - ((segment.wind_exp - 1) * WIND_FACTOR);
    const speed = Math.max(
      MIN_SEGMENT_SPEED_KMH,
      (baseSpeed + ((activeSkill - 50) * ACTIVE_SKILL_SPEED_FACTOR))
        * this.resolveAltitudeSpeedFactor(rider, segment)
        * this.resolveFatigueSpeedFactor(rider, averageKm)
        * this.resolveCobbleFatigueSpeedFactor(rider, averageCobbleKm)
        * this.resolveClimbStrainSpeedFactor(rider, segment)
        * techFactor
        * windFactor
        * dayForm,
    );
    return (segment.length_km / speed) * 3600;
  }

  private resolveSegmentBaseSpeed(segment: ParsedStageSegment): number {
    const positiveGradient = Math.max(segment.gradient_percent, 0);
    const climbingBaseSpeed = Math.max(
      MOUNTAIN_BASE_SPEED_AT_10_PERCENT,
      FLAT_BASE_SPEED - ((FLAT_BASE_SPEED - MOUNTAIN_BASE_SPEED_AT_10_PERCENT) * Math.min(positiveGradient, 10) / 10),
    );

    switch (segment.terrain) {
      case 'Abfahrt':
        return DOWNHILL_BASE_SPEED;
      case 'Flat':
        return FLAT_BASE_SPEED;
      case 'Hill':
      case 'Medium_Mountain':
      case 'Mountain':
      case 'High_Mountain':
        return climbingBaseSpeed;
      case 'Cobble':
        return FLAT_BASE_SPEED - 2;
      case 'Cobble_Hill':
        return Math.max(MOUNTAIN_BASE_SPEED_AT_10_PERCENT, climbingBaseSpeed - 2);
      case 'Sprint':
        return FLAT_BASE_SPEED + 1.5;
      default:
        return FLAT_BASE_SPEED;
    }
  }

  private resolveActiveSkill(rider: Rider, segment: ParsedStageSegment): number {
    const formBonus = resolveFormBonus(rider);
    switch (segment.terrain) {
      case 'Flat':
        return rider.skills.flat + formBonus;
      case 'Hill':
        return rider.skills.hill + formBonus;
      case 'Medium_Mountain':
        return rider.skills.mediumMountain * 0.7 + rider.skills.mountain * 0.3 + formBonus;
      case 'Mountain':
      case 'High_Mountain':
        return rider.skills.mountain + formBonus;
      case 'Cobble':
        return rider.skills.cobble + formBonus;
      case 'Cobble_Hill':
        return rider.skills.cobble * 0.6 + rider.skills.hill * 0.4 + formBonus;
      case 'Abfahrt':
        return rider.skills.downhill + formBonus;
      case 'Sprint':
        return rider.skills.sprint * 0.7 + rider.skills.acceleration * 0.3 + formBonus;
      default:
        return rider.skills.flat + formBonus;
    }
  }

  private resolveAltitudeSpeedFactor(rider: Rider, segment: ParsedStageSegment): number {
    const averageElevation = (segment.start_elevation + segment.end_elevation) / 2;
    if (averageElevation <= ALTITUDE_THRESHOLD_METERS) {
      return 1;
    }

    const altitudePenalty = Math.min(
      0.14,
      ((averageElevation - ALTITUDE_THRESHOLD_METERS) / 1800) * (1 - (rider.skills.mountain / 150)),
    );
    return 1 - Math.max(0, altitudePenalty);
  }

  private resolveFatigueSpeedFactor(rider: Rider, currentKm: number): number {
    if (currentKm <= FATIGUE_THRESHOLD_KM) {
      return 1;
    }

    const fatiguePenalty = Math.min(
      0.18,
      ((currentKm - FATIGUE_THRESHOLD_KM) / 75) * (1 - (rider.skills.stamina / 145)),
    );
    return 1 - Math.max(0, fatiguePenalty);
  }

  private resolveCobbleFatigueSpeedFactor(rider: Rider, cobbleKm: number): number {
    if (cobbleKm <= COBBLE_FATIGUE_THRESHOLD_KM) {
      return 1;
    }

    const cobblePenalty = Math.min(
      0.28,
      ((cobbleKm - COBBLE_FATIGUE_THRESHOLD_KM) / 20) * (1 - (rider.skills.cobble / 150)),
    );
    return 1 - Math.max(0, cobblePenalty);
  }

  private resolveClimbStrainSpeedFactor(rider: Rider, segment: ParsedStageSegment): number {
    if (!['Hill', 'Medium_Mountain', 'Mountain', 'High_Mountain'].includes(segment.terrain)) {
      return 1;
    }

    const lengthFactor = Math.pow((segment.length_km / 10), 1.5);
    const gradientFactor = Math.max(segment.gradient_percent, 0) / 10;
    const climbDefense = (rider.skills.resistance * 0.5) + (rider.skills.mountain * 0.5);
    const defenseFactor = 1.0 - (climbDefense / 100);
    const penalty = Math.min(0.8, lengthFactor * gradientFactor * defenseFactor);
    return 1.0 - penalty;
  }

  private applyPelotonEffect(entries: RiderStageState[], segment: ParsedStageSegment): void {
    const thresholdSeconds = this.resolvePelotonThresholdSeconds(segment);
    const sorted = [...entries].sort((left, right) => left.rawTimeSeconds - right.rawTimeSeconds || left.rider.id - right.rider.id);

    for (let index = 1; index < sorted.length; index += 1) {
      const frontRider = sorted[index - 1];
      const chasingRider = sorted[index];
      if (chasingRider.rawTimeSeconds - frontRider.rawTimeSeconds < thresholdSeconds) {
        chasingRider.rawTimeSeconds = frontRider.rawTimeSeconds;
      }
    }
  }

  private resolvePelotonThresholdSeconds(segment: ParsedStageSegment): number {
    if (['Hill', 'Medium_Mountain', 'Mountain', 'High_Mountain', 'Cobble_Hill'].includes(segment.terrain)) {
      return 1;
    }

    return 2;
  }

  private resolveSprintScore(rider: Rider, stageFraction: number, dayForm: number): number {
    const formBonus = resolveFormBonus(rider);
    const fatigueBoost = 1 + ((rider.skills.stamina - 50) / 250) * stageFraction;
    return (
      (rider.skills.sprint + formBonus) * 0.45
      + (rider.skills.acceleration + formBonus) * 0.25
      + (rider.skills.flat + formBonus) * 0.1
      + (rider.skills.resistance + formBonus) * 0.1
      + (rider.skills.bikeHandling + formBonus) * 0.1
    ) * fatigueBoost * dayForm;
  }

  private resolvePhotoFinishScore(rider: Rider, dayForm: number, stageDistanceKm: number): number {
    const staminaModifier = this.resolveStaminaModifier(rider, dayForm, stageDistanceKm);
    const formBonus = resolveFormBonus(rider);
    const effectiveSprint = ((rider.skills.sprint + formBonus) * dayForm) * staminaModifier;
    const effectiveAcceleration = ((rider.skills.acceleration + formBonus) * dayForm) * staminaModifier;
    const effectiveFlat = ((rider.skills.flat + formBonus) * dayForm) * staminaModifier;
    return (effectiveSprint * 0.6) + (effectiveAcceleration * 0.2) + (effectiveFlat * 0.2);
  }

  private resolveStaminaModifier(rider: Rider, dayForm: number, stageDistanceKm: number): number {
    if (stageDistanceKm <= 150) {
      return 1;
    }

    const distanceFactor = 1.05 + (((stageDistanceKm - 150) / 10) * 0.015);
    return (((rider.skills.stamina + resolveFormBonus(rider)) * dayForm) / 90) * distanceFactor;
  }

  private resolveClimbScore(rider: Rider, stageFraction: number, dayForm: number): number {
    const formBonus = resolveFormBonus(rider);
    const fatigueBoost = 1 + ((rider.skills.stamina - 50) / 220) * stageFraction;
    return (
      (rider.skills.mountain + formBonus) * 0.45
      + (rider.skills.mediumMountain + formBonus) * 0.2
      + (rider.skills.hill + formBonus) * 0.1
      + (rider.skills.attack + formBonus) * 0.1
      + (rider.skills.resistance + formBonus) * 0.15
    ) * fatigueBoost * dayForm;
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
    if (previousStageId == null) return new Map();
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
    if (previousStageId == null) return new Map();
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
      insert.run(raceId, stageId, row.riderId ?? null, row.teamId, resultTypeId, row.rank, row.timeSeconds, row.points);
    } catch (error) {
      throw new Error(
        `Ergebnis konnte nicht gespeichert werden (type=${resultTypeId}, stage=${stageId}, rank=${row.rank}, rider=${row.riderId ?? 'null'}, team=${row.teamId ?? 'null'}): ${(error as Error).message}`,
      );
    }
  }
}