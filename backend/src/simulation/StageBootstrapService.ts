/**
 * Baut den Simulations-Bootstrap einer Etappe.
 *
 * Vorher lag dieser Aufbau direkt in der Route `/simulation/realtime/:stageId`
 * und wurde vom Kalibrier-Werkzeug nachgebaut. Zwei Wege bedeuten Drift: die
 * Referenzmessung haette sich mit der Zeit von dem entfernt, was das Spiel
 * tatsaechlich simuliert. Jetzt gibt es einen Weg, den alle benutzen.
 *
 * Der zweite Zweck ist Geschwindigkeit. Ein grosser Teil des Aufbaus haengt
 * nicht an der Etappe, sondern am Spielstand: Teams, Skill-Gewichte,
 * Wertungsregeln, Rivalitaeten, Edelhelfer-Zuordnung. Werden an einem Renntag
 * mehrere Etappen simuliert — oder in der geplanten Quick Simulation eine ganze
 * Saison —, laesst sich dieser Teil einmal laden statt einmal je Etappe.
 */

import type Database from 'better-sqlite3';
import type {
  Race,
  RealtimeSimulationBootstrap,
  Rider,
  SkillWeightRule,
  StageScoringRule,
  Team,
} from '../../../shared/types';
import { RivalryService } from '../game/RivalryService';
import { ensureRaceEntries } from './RaceRosterService';
import { StageParser } from './StageParser';

/**
 * Der etappenunabhaengige Teil des Bootstraps. Einmal je Spielstand und Saison
 * gueltig; wird ueber mehrere Etappen wiederverwendet.
 */
export interface StageBootstrapContext {
  season: number;
  teams: Team[];
  skillWeightRules: SkillWeightRule[];
  stageScoringRules: StageScoringRule[];
  lieutenants: Array<{ leaderId: number; lieutenantId: number }>;
  rivalries: Array<{ aId: number; bId: number }>;
}

const DEFAULT_SEASON = 2026;

/**
 * Laedt den etappenunabhaengigen Teil. Fuer eine einzelne Etappe kann der
 * Aufruf entfallen — `buildStageBootstrap` legt sich dann selbst einen an.
 */
export function createStageBootstrapContext(db: Database.Database, repo: any): StageBootstrapContext {
  const seasonRow = db.prepare('SELECT season FROM game_state WHERE id = 1').get() as
    { season: number } | undefined;
  const season = seasonRow?.season ?? DEFAULT_SEASON;

  return {
    season,
    teams: repo.getTeams(),
    skillWeightRules: repo.getSkillWeightRules(),
    stageScoringRules: repo.getStageScoringRules(),
    lieutenants: db.prepare(
      'SELECT leader_id AS leaderId, lieutenant_id AS lieutenantId FROM rider_lieutenants WHERE season = ?',
    ).all(season) as Array<{ leaderId: number; lieutenantId: number }>,
    rivalries: new RivalryService(db).getActivePairs(),
  };
}

/**
 * Startreihenfolge der Teams. Unveraendert aus `routes/api.ts` hierher
 * verschoben, damit Route, Kalibrier-Werkzeug und die geplante Quick
 * Simulation dieselbe Reihenfolge benutzen. Kein Verhaltensunterschied.
 */
export function resolveRealtimeTeamStartOrder(repo: any, race: Race, stageNumber: number, riders: Rider[]): number[] {
  const participatingTeams = new Map<number, Team>();
  for (const team of repo.getTeams()) {
    if (riders.some((rider) => rider.activeTeamId === team.id)) {
      participatingTeams.set(team.id, team);
    }
  }

  const participatingTeamIds = new Set(participatingTeams.keys());
  if (participatingTeamIds.size === 0) {
    return [];
  }

  if (race.isStageRace && stageNumber > 1) {
    const previousGcStandings = repo.getPreviousGcStandings(race.id, stageNumber);
    const riderById = new Map(riders.map((rider) => [rider.id, rider]));
    const teamTotals = new Map<number, number[]>();

    for (const standing of previousGcStandings) {
      const rider = riderById.get(standing.riderId);
      const teamId = rider?.activeTeamId;
      if (teamId == null || !participatingTeamIds.has(teamId)) {
        continue;
      }

      const bucket = teamTotals.get(teamId) ?? [];
      bucket.push(standing.timeSeconds);
      teamTotals.set(teamId, bucket);
    }

    return [...participatingTeams.values()]
      .sort((left, right) => {
        const leftTimes = teamTotals.get(left.id);
        const rightTimes = teamTotals.get(right.id);
        const leftTotal = leftTimes?.slice().sort((a, b) => a - b).slice(0, Math.min(3, leftTimes.length)).reduce((sum, value) => sum + value, 0) ?? null;
        const rightTotal = rightTimes?.slice().sort((a, b) => a - b).slice(0, Math.min(3, rightTimes.length)).reduce((sum, value) => sum + value, 0) ?? null;

        if (leftTotal != null && rightTotal != null) {
          return rightTotal - leftTotal || left.name.localeCompare(right.name, 'de');
        }
        if (leftTotal != null) return 1;
        if (rightTotal != null) return -1;
        return left.name.localeCompare(right.name, 'de');
      })
      .map((team) => team.id);
  }

  const seasonTeamPoints = new Map(
    repo.getSeasonStandings().teamStandings
      .filter((row: any) => row.teamId != null && participatingTeamIds.has(row.teamId))
      .map((row: any) => [row.teamId as number, row.points] as const),
  );

  return [...participatingTeams.values()]
    .sort((left, right) => {
      const leftPoints = seasonTeamPoints.get(left.id) ?? 0;
      const rightPoints = seasonTeamPoints.get(right.id) ?? 0;

      if (leftPoints === 0 && rightPoints === 0) {
        return left.name.localeCompare(right.name, 'de');
      }
      if (leftPoints === 0) return -1;
      if (rightPoints === 0) return 1;
      return (leftPoints as number) - (rightPoints as number) || left.name.localeCompare(right.name, 'de');
    })
    .map((team: any) => team.id);
}

export interface BuildStageBootstrapOptions {
  /** Wiederverwendbarer etappenunabhaengiger Teil. Ohne Angabe wird er geladen. */
  context?: StageBootstrapContext;
  /** Seed der Etappe, falls der Aufrufer ihn bereits gezogen hat. */
  simSeed?: number | null;
  /**
   * Startreihenfolge der Teams. Die Route reicht hier ihre eigene Berechnung
   * durch; ohne Angabe wird `resolveRealtimeTeamStartOrder` benutzt.
   */
  teamStartOrder?: number[];
}

/**
 * Baut den vollstaendigen Bootstrap einer Etappe.
 *
 * Achtung: `ensureRaceEntries` legt die Startliste in der Datenbank an, wenn
 * sie noch nicht existiert — der Aufruf schreibt also.
 */
export function buildStageBootstrap(
  db: Database.Database,
  repo: any,
  stageId: number,
  options: BuildStageBootstrapOptions = {},
): RealtimeSimulationBootstrap | null {
  const stage = repo.getStageById(stageId);
  if (!stage) {
    return null;
  }
  const race = repo.getRaceById(stage.raceId);
  if (!race) {
    return null;
  }

  const riders = ensureRaceEntries(db, repo, race, stage);
  if (riders.length === 0) {
    return null;
  }

  const context = options.context ?? createStageBootstrapContext(db, repo);
  const participatingTeams = context.teams.filter(
    (team) => riders.some((rider: any) => rider.activeTeamId === team.id),
  );

  return {
    simSeed: options.simSeed ?? undefined,
    race,
    stage,
    riders,
    teams: participatingTeams,
    stageSummary: StageParser.summarizeStageProfile(stage.detailsCsvFile, stage.startElevation),
    gcStandings: repo.getPreviousGcStandings(stage.raceId, stage.stageNumber),
    pointsStandings: repo.getPreviousPointsStandings(stage.raceId, stage.stageNumber),
    mountainStandings: repo.getPreviousMountainStandings(stage.raceId, stage.stageNumber),
    youthStandings: repo.getPreviousYouthStandings(stage.raceId, stage.stageNumber),
    classificationLeaders: repo.getPreviousClassificationLeaders(stage.raceId, stage.stageNumber),
    teamStartOrder: options.teamStartOrder
      ?? resolveRealtimeTeamStartOrder(repo, race, stage.stageNumber, riders),
    skillWeightRules: context.skillWeightRules,
    stageScoringRules: context.stageScoringRules,
    lieutenants: context.lieutenants,
    rivalries: context.rivalries,
  } as RealtimeSimulationBootstrap;
}
