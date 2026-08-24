/**
 * Baut den Bootstrap einer Etappe genau so, wie ihn die Route
 * `GET /api/simulation/realtime/:stageId` baut (backend/src/routes/api.ts).
 *
 * Wichtig fuer die Kalibrierung: es wird bewusst *kein* eigener Aufbau
 * geschrieben, sondern es werden dieselben Funktionen in derselben Reihenfolge
 * aufgerufen. Waeren es zwei Wege, wuerde die Referenzmessung mit der Zeit von
 * dem abweichen, was das Spiel tatsaechlich simuliert — und niemand wuerde es
 * merken.
 */

import Database from 'better-sqlite3';
import type { RealtimeSimulationBootstrap } from '../../shared/types';
import { DatabaseService } from '../../backend/src/db/DatabaseService';
import { GameRepository } from '../../backend/src/db/GameRepository';
import { ensureRaceEntries } from '../../backend/src/simulation/RaceRosterService';
import { StageParser } from '../../backend/src/simulation/StageParser';
import { RivalryService } from '../../backend/src/game/RivalryService';
import { ensureSimSeedRolled, ensureWeatherRolled, resolveRealtimeTeamStartOrder } from '../../backend/src/routes/api';

export interface StageCandidate {
  stageId: number;
  raceId: number;
  raceName: string;
  stageNumber: number;
  profile: string;
  /** Schwierigkeitswert der Etappe aus dem Bootstrapper — Kalibrier-Eingabe. */
  stageScore: number | null;
  isStageRace: boolean;
  /**
   * Wird erst nach dem Bootstrap gefuellt: die Distanz steht nicht in der
   * Tabelle `stages`, sondern ergibt sich aus dem Etappenprofil-CSV.
   */
  distanceKm: number | null;
}

/**
 * Bringt einen direkt geoeffneten Spielstand auf den aktuellen Schemastand —
 * mit derselben Migration, die auch `DatabaseService.loadSave` fuer das Spiel
 * fuehrt. Ohne diesen Schritt fehlen einem Altspielstand Spalten, die der
 * Bootstrap erwartet (etwa `stages.sim_seed`).
 */
export function migrateSavegame(db: Database.Database): void {
  new DatabaseService().ensureAllSchemas(db);
}

/**
 * Listet Etappen des Spielstands, die sich simulieren lassen — also solche mit
 * hinterlegtem Profil und Distanz. Ohne Filter auf den Spieltag: fuer die
 * Referenzmessung ist jede Etappe brauchbar, nicht nur die heutige.
 */
export function listStageCandidates(db: Database.Database): StageCandidate[] {
  return db.prepare(`
    SELECT
      s.id            AS stageId,
      s.race_id       AS raceId,
      r.name          AS raceName,
      s.stage_number  AS stageNumber,
      s.profile       AS profile,
      s.stage_score   AS stageScore,
      r.is_stage_race AS isStageRace
    FROM stages s
    JOIN races r ON r.id = s.race_id
    WHERE s.details_csv_file IS NOT NULL
      AND TRIM(s.details_csv_file) <> ''
    ORDER BY s.id
  `).all().map((row: any) => ({
    stageId: row.stageId,
    raceId: row.raceId,
    raceName: row.raceName,
    stageNumber: row.stageNumber,
    profile: row.profile,
    stageScore: row.stageScore ?? null,
    isStageRace: row.isStageRace === 1,
    distanceKm: null,
  }));
}

/**
 * Wuerfelt das Wetter der Etappe einmal aus, falls noch nicht geschehen, und
 * liefert die gesetzte Wetter-ID zurueck. Fuer die Referenzmessung bleibt das
 * Wetter ueber alle Laeufe einer Etappe konstant, damit sich die Laeufe nur
 * durch den Simulationszufall unterscheiden.
 */
export function rollStageWeatherOnce(db: Database.Database, stageId: number): number | null {
  ensureWeatherRolled(db, stageId);
  const row = db.prepare('SELECT rolled_weather_id AS weatherId FROM stages WHERE id = ?')
    .get(stageId) as { weatherId: number | null } | undefined;
  return row?.weatherId ?? null;
}

/**
 * Erzeugt den Bootstrap. Achtung: `ensureRaceEntries` schreibt Startlisten in
 * die Datenbank — der Aufrufer muss auf einer Kopie des Spielstands arbeiten.
 */
export function buildStageBootstrap(
  db: Database.Database,
  stageId: number,
): RealtimeSimulationBootstrap | null {
  const simSeed = ensureSimSeedRolled(db, stageId);
  const repo = new GameRepository(db);
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

  const seasonRow = db.prepare('SELECT season FROM game_state WHERE id = 1').get() as
    { season: number } | undefined;
  const lieutenants = db.prepare(
    'SELECT leader_id AS leaderId, lieutenant_id AS lieutenantId FROM rider_lieutenants WHERE season = ?',
  ).all(seasonRow?.season ?? 2026) as any[];

  return {
    simSeed: simSeed ?? undefined,
    race,
    stage,
    riders,
    teams: repo.getTeams().filter((team: any) => riders.some((rider: any) => rider.activeTeamId === team.id)),
    stageSummary: StageParser.summarizeStageProfile(stage.detailsCsvFile, stage.startElevation),
    gcStandings: repo.getPreviousGcStandings(stage.raceId, stage.stageNumber),
    pointsStandings: repo.getPreviousPointsStandings(stage.raceId, stage.stageNumber),
    mountainStandings: repo.getPreviousMountainStandings(stage.raceId, stage.stageNumber),
    youthStandings: repo.getPreviousYouthStandings(stage.raceId, stage.stageNumber),
    classificationLeaders: repo.getPreviousClassificationLeaders(stage.raceId, stage.stageNumber),
    teamStartOrder: resolveRealtimeTeamStartOrder(repo, race, stage.stageNumber, riders),
    skillWeightRules: repo.getSkillWeightRules(),
    stageScoringRules: repo.getStageScoringRules(),
    lieutenants,
    rivalries: new RivalryService(db).getActivePairs(),
  } as RealtimeSimulationBootstrap;
}
