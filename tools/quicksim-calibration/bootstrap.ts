/**
 * Zugang zum Spielstand fuer den Kalibrier-Harness.
 *
 * Der Bootstrap selbst kommt aus `StageBootstrapService` — demselben Dienst,
 * den auch die Route `GET /api/simulation/realtime/:stageId` benutzt. Waeren es
 * zwei Wege, wuerde die Referenzmessung mit der Zeit von dem abweichen, was das
 * Spiel tatsaechlich simuliert, und niemand wuerde es merken.
 */

import Database from 'better-sqlite3';
import type { RealtimeSimulationBootstrap } from '../../shared/types';
import { DatabaseService } from '../../backend/src/db/DatabaseService';
import { GameRepository } from '../../backend/src/db/GameRepository';
import {
  buildStageBootstrap as buildStageBootstrapFromService,
  createStageBootstrapContext,
  type StageBootstrapContext,
} from '../../backend/src/simulation/StageBootstrapService';
import { ensureSimSeedRolled, ensureWeatherRolled } from '../../backend/src/routes/api';

export type { StageBootstrapContext };

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
 * Erzeugt den Bootstrap ueber denselben Dienst, den auch die API-Route
 * benutzt. Achtung: `ensureRaceEntries` schreibt die Startliste in die
 * Datenbank — der Aufrufer muss auf einer Kopie des Spielstands arbeiten.
 */
export function buildStageBootstrap(
  db: Database.Database,
  stageId: number,
  context?: StageBootstrapContext,
): RealtimeSimulationBootstrap | null {
  const simSeed = ensureSimSeedRolled(db, stageId);
  return buildStageBootstrapFromService(db, new GameRepository(db), stageId, { simSeed, context });
}

/**
 * Laedt den etappenunabhaengigen Teil einmal, damit er ueber viele Etappen
 * wiederverwendet werden kann. Bei einem Referenzlauf ueber 80 Etappen spart
 * das 80-mal Teams, Skill-Gewichte, Wertungsregeln und Rivalitaeten.
 */
export function createBootstrapContext(db: Database.Database): StageBootstrapContext {
  return createStageBootstrapContext(db, new GameRepository(db));
}
