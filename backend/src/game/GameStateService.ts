import Database from 'better-sqlite3';
import { EventEmitter } from 'events';
import { GameState, GameStatus, LastStageWinner, PendingStage } from '../../../shared/types';
import { ensureContractRenewals } from '../simulation/contractRenewalSchedule';
import { isRenewalSelectionPending } from '../simulation/contractRenewalSelection';
import { ensureNationalChampionships } from '../simulation/nationalChampionshipsSchedule';
import { ensureOlympicGames } from '../simulation/olympicGamesSchedule';
import { OLYMPIC_CATEGORY_IDS, isOlympicSeason } from '../simulation/championships';
import { GameStateRepository } from "../db/repositories/GameStateRepository";
import { RaceRepository } from "../db/repositories/RaceRepository";
import { ResultRepository } from "../db/repositories/ResultRepository";
import { RiderRepository } from "../db/repositories/RiderRepository";
import { TeamRepository } from "../db/repositories/TeamRepository";


import { getDeterministicWeatherEffect, isWinterBreak } from '../db/mappers';
import { ContractService } from './ContractService';
import { RiderDevelopmentService, type RiderDevelopmentDailyContext } from './RiderDevelopmentService';
import { RiderProgramService } from './RiderProgramService';
import { RiderRoleService } from './RiderRoleService';
import { RiderDraftService } from './RiderDraftService';
import { RiderNewgenService } from './RiderNewgenService';
import { BadgeMaterializationService } from './BadgeMaterializationService';
import { RivalryService } from './RivalryService';

const DEFAULT_START_DATE = '2026-01-01';
const DEFAULT_START_SEASON = 2026;
const SEASON_FORM_MIN_RAW = 0;
const SEASON_FORM_MAX_RAW = 4;
const SEASON_FORM_RISE_DAYS = 56;
const SEASON_FORM_RISE_STEP_RAW = SEASON_FORM_MAX_RAW / SEASON_FORM_RISE_DAYS;
const SEASON_FORM_FALL_DAYS = 14;
const RACE_FORM_BUILD_STEP = 0.25;
const RACE_FORM_FREE_STEP = 0.15;
const BUILD_R_FORM_EXPIRY_DAYS = 56;
const FREE_R_FORM_EXPIRY_DAYS = 25;
const PEAK_MIN_SPACING_DAYS = 28;
// Ein Rennen kommt als Peak nur infrage, wenn der Fahrer im Teilnehmerfeld
// seines Teams (Fahrer mit diesem Rennen im Programm) nach OVR unter den besten
// N liegt — regulaer Top 10, bei der Tour de France Top 14.
const PEAK_QUALIFY_TOP_N = 10;
const PEAK_QUALIFY_TOP_N_TDF = 14;
const TOUR_DE_FRANCE_CATEGORY_ID = 1;
// Fallback, wenn kein Rennen mit ausreichendem Team-Rang gefunden wird: Peaks
// zufaellig aus den prestigetraechtigsten N Rennen des Fahrers waehlen.
const PEAK_PRESTIGE_POOL_SIZE = 15;
const ILLNESS_CHANCE = 0.0025;
const INJURY_CHANCE = 0.002;

type DayAdvancedListener = (state: GameState) => void;

interface GameStateRow {
  current_date: string;
  season: number;
  is_game_over: number;
  draft_status?: string;
  draft_current_pick_number?: number;
  draft_season?: number | null;
}

interface DailyCheckSummary {
  hasRaceToday: boolean;
  racesTodayCount: number;
}

interface PendingStageRow {
  stage_id: number;
  race_id: number;
  race_name: string;
  stage_number: number;
  date: string;
  profile: PendingStage['profile'];
  start_elevation: number;
  details_csv_file: string;
  is_stage_race: number;
}

interface RiderDailyStateRow {
  rider_id: number;
  season: number;
  form_bonus: number;
  race_form_bonus: number;
  peak_s_form: number;
  peak_r_form: number;
  active_peak_date: string | null;
  peak_dates_json: string;
  health_status: 'healthy' | 'ill' | 'injured';
  unavailable_until: string | null;
  unavailable_days_remaining: number;
  season_race_days_total: number;
  rolling_30d_race_days: number;
  short_term_fatigue: number;
  long_term_fatigue_decayable: number;
  long_term_fatigue_locked: number;
  skill_recuperation?: number;
  consecutive_non_race_days?: number;
  birth_year?: number;
  active_team_id?: number | null;
  team_tier?: number | null;
  is_player_team?: number | null;
}

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type IN ('table', 'view') AND name = ?").get(tableName) as { name: string } | undefined;
  return row != null;
}

function columnExists(db: Database.Database, tableName: string, columnName: string): boolean {
  if (!tableExists(db, tableName)) {
    return false;
  }

  const rows = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
  return rows.some((row: any) => row.name === columnName);
}

export class GameStateService {
  private readonly db: Database.Database;
  private readonly events = new EventEmitter();
  private syncedStateDate: string | null = null;
  private seasonWinsBackfillChecked = false;

  // Caches to avoid repeated schema/peak-date work in the day-change hot path.
  private schemaReady = false;
  private readonly knownTables = new Set<string>();
  private readonly knownColumns = new Set<string>();
  private readonly peakDatesBySeason = new Map<number, Map<number, string[]>>();
  private readonly programWindowsBySeason = new Map<number, Map<number, ProgramPeakWindows>>();
  // Tracks the last (s_form, r_form) we wrote into rider_form_history so we can
  // skip writing when nothing changed for the day.
  private lastFormHistoryHash = '';
  private formHistoryHashKnown = false;

  constructor(db: Database.Database) {
    this.db = db;
  }

  private isTable(name: string): boolean {
    if (this.knownTables.has(name)) return true;
    if (!tableExists(this.db, name)) return false;
    this.knownTables.add(name);
    return true;
  }

  private isColumn(tableName: string, columnName: string): boolean {
    const key = `${tableName}.${columnName}`;
    if (this.knownColumns.has(key)) return true;
    if (!this.isTable(tableName)) return false;
    if (!columnExists(this.db, tableName, columnName)) return false;
    this.knownColumns.add(key);
    return true;
  }

  private ensureSchemaOnce(): void {
    if (this.schemaReady) return;
    this.ensureRiderDailyStateTable();
    this.ensureRiderFormTables();
    this.knownTables.add('game_state');
    this.knownTables.add('rider_daily_state');
    this.knownTables.add('rider_r_form_events');
    this.knownTables.add('rider_form_history');
    this.knownTables.add('rider_r_form_daily_awards');
    this.knownTables.add('rider_peak_awards');
    this.knownColumns.add('rider_daily_state.season_points');
    this.knownColumns.add('rider_daily_state.season_race_days_total');
    this.knownColumns.add('rider_daily_state.rolling_30d_race_days');
    this.knownColumns.add('rider_daily_state.race_form_bonus');
    this.knownColumns.add('rider_daily_state.peak_s_form');
    this.knownColumns.add('rider_daily_state.peak_r_form');
    this.knownColumns.add('rider_daily_state.active_peak_date');
    this.knownColumns.add('rider_daily_state.peak_dates_json');
    this.knownColumns.add('rider_daily_state.form_bonus');
    this.knownColumns.add('rider_daily_state.health_status');
    this.knownColumns.add('rider_daily_state.unavailable_until');
    this.knownColumns.add('rider_daily_state.unavailable_days_remaining');
    this.knownColumns.add('rider_daily_state.short_term_fatigue');
    this.knownColumns.add('rider_daily_state.long_term_fatigue_decayable');
    this.knownColumns.add('rider_daily_state.long_term_fatigue_locked');
    this.knownColumns.add('rider_daily_state.consecutive_non_race_days');
    this.schemaReady = true;
  }

  /**
   * Returns a Map<riderId, ProgramPeakWindows> for the given season, loaded in
   * a single SQL query and cached in-memory. This is the bulk equivalent of
   * `loadProgramPeakWindows` and is the main N+1 fix for the day-change path.
   */
  private getProgramWindowsForSeason(season: number): Map<number, ProgramPeakWindows> {
    const cached = this.programWindowsBySeason.get(season);
    if (cached) return cached;
    const fresh = loadProgramPeakWindowsForSeason(this.db, season);
    this.programWindowsBySeason.set(season, fresh);
    return fresh;
  }

  public ensureState(): GameState {
    this.ensureSchemaOnce();
    const state = this.loadState();
    this.repairMissingRaceProgramRaces();
    new RiderProgramService(this.db).ensureSeasonPrograms(state.season, state.currentDate);

    // Einmalige Peak-Neuausrichtung fuer Altbestaende: aeltere Saves haben durch
    // den frueheren Peak-Churn (fehlende Programm-Verknuepfungen) fehlplatzierte
    // Season-Form-Peaks. Nachdem Reparatur + Programme geladen sind, richten wir
    // die laufende Saison EINMALIG an den Programmrennen aus (danach uebernehmen
    // Saisonwechsel/Draft die Ausrichtung).
    const alignFlag = this.db.prepare("SELECT value FROM career_meta WHERE key = 'peakAlignmentFix'").get() as { value: string } | undefined;
    if (!alignFlag) {
      try {
        this.realignAllSeasonFormPeaks(state.season, state.currentDate);
      } catch (e) {
        console.error('Einmalige Peak-Neuausrichtung fehlgeschlagen:', e);
      }
      this.db.prepare("INSERT OR REPLACE INTO career_meta (key, value) VALUES ('peakAlignmentFix', '1')").run();
    }

    if (this.syncedStateDate !== state.currentDate) {
      this.syncCurrentSeasonFormState(state.currentDate, state.season);
      this.syncDailyFormHistory(state.currentDate);

      // Lazily populate yearly_baseline_skills for current season if missing
      const missingBaseline = this.db.prepare(`
        SELECT COUNT(*) as c FROM riders WHERE is_retired = 0 AND yearly_baseline_skills IS NULL
      `).get() as { c: number };
      if (missingBaseline.c > 0) {
        this.snapshotYearlyBaselineSkills();
      }

      this.syncedStateDate = state.currentDate;
    }

    this.db.prepare(`
      INSERT INTO career_meta (key, value) VALUES ('current_season', ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(String(state.season));
    return state;
  }

  public loadState(): GameState {
    this.ensureSchemaOnce();
    const row = this.db.prepare(
      'SELECT "current_date" AS current_date, season, is_game_over, draft_status, draft_current_pick_number, draft_season FROM game_state WHERE id = 1',
    ).get() as GameStateRow | undefined;
    if (!row) throw new Error('game_state konnte nicht geladen werden.');
    return this.mapState(row);
  }

  public loadStatus(): GameStatus {
    const state = this.loadState();
    const pendingStages = this.getPendingStages(state.currentDate);
    return {
      currentDate: state.currentDate,
      season: state.season,
      isRaceDay: pendingStages.length > 0,
      currentStageId: pendingStages[0]?.stageId ?? null,
      pendingStages,
      draftStatus: state.draftStatus,
      draftCurrentPickNumber: state.draftCurrentPickNumber,
      draftSeason: state.draftSeason,
      renewalSelectionPending: isRenewalSelectionPending(this.db),
      lastStageWinner: this.loadLastStageWinner(),
    };
  }

  /** Sieger der zuletzt simulierten Etappe (vom Ergebnis-Commit hinterlegt). */
  private loadLastStageWinner(): LastStageWinner | null {
    if (!tableExists(this.db, 'career_meta')) return null;
    const row = this.db
      .prepare(`SELECT value FROM career_meta WHERE key = 'last_stage_winner'`)
      .get() as { value: string } | undefined;
    if (!row?.value) return null;
    try {
      const parsed = JSON.parse(row.value) as LastStageWinner;
      return parsed?.riderId != null ? parsed : null;
    } catch {
      return null;
    }
  }

  public advanceDay(): GameState {
    ResultRepository.clearInMemoryStageEvents();
    let isNewSeason = false;
    let oldSeason = 0;
    const nextState = this.db.transaction(() => {
      this.ensureStateRow();
      const currentRow = this.db.prepare(
        'SELECT "current_date" AS current_date, season, is_game_over, draft_status, draft_current_pick_number, draft_season FROM game_state WHERE id = 1',
      ).get() as GameStateRow | undefined;
      if (!currentRow) throw new Error('game_state nicht ladbar.');

      const pendingStages = this.getPendingStages(currentRow.current_date);
      if (pendingStages.length > 0) {
        throw new Error('Der Tag kann nicht beendet werden, solange offene Rennen oder Etappen simuliert werden muessen.');
      }

      // Blockierendes Auswahlfenster (10.01.): der Spieler muss zuerst seine
      // Vertragsverlängerungs-Ziele wählen und bestätigen.
      if (isRenewalSelectionPending(this.db)) {
        throw new Error('Bitte zuerst die Ziele für Vertragsverlängerungen auswählen und bestätigen.');
      }

      const nextDate = addDaysIso(currentRow.current_date, 1);
      const nextSeason = resolveSeason(nextDate, currentRow.season);
      if (nextSeason !== currentRow.season) {
        isNewSeason = true;
        oldSeason = currentRow.season;
        // Standings-Snapshot für die abgelaufene Saison sichern
        try {
          const resultRepo = new ResultRepository(this.db);
          const standings = resultRepo.getSeasonStandings(currentRow.season);
          this.db.prepare(`
            INSERT OR REPLACE INTO season_standings_snapshots (season, payload_json)
            VALUES (?, ?)
          `).run(currentRow.season, JSON.stringify(standings));
        } catch (e) {
          console.error('Fehler beim Erstellen des Season Standings Snapshots:', e);
        }

        // Ergebnisse der abgelaufenen Saison in die Historie verschieben
        try {
          this.db.prepare(`
            INSERT INTO results_history (
              race_id, stage_id, rider_id, team_id, result_type_id, rank, 
              time_seconds, points, is_breakaway, leadout_rider_id, 
              leadout_bonus, breakaway_kms, event_ids, jerseys_worn
            )
            SELECT 
              race_id, stage_id, rider_id, team_id, result_type_id, rank, 
              time_seconds, points, is_breakaway, leadout_rider_id, 
              leadout_bonus, breakaway_kms, event_ids, jerseys_worn
            FROM results
            WHERE race_id IN (SELECT id FROM races WHERE start_date LIKE ?)
          `).run(`${currentRow.season}-%`);

          this.db.prepare(`
            DELETE FROM results
            WHERE race_id IN (SELECT id FROM races WHERE start_date LIKE ?)
          `).run(`${currentRow.season}-%`);

          this.db.prepare(`
            DELETE FROM stage_entries
            WHERE race_id IN (SELECT id FROM races WHERE start_date LIKE ?)
          `).run(`${currentRow.season}-%`);
          console.log(`Ergebnisse und Etappeneinträge der Saison ${currentRow.season} erfolgreich archiviert/bereinigt.`);

          // Prune race_results_compact for the elapsed season to keep only point-scoring results
          try {
            console.log(`Pruning race results compact for season ${currentRow.season}...`);
            const pointsEvents = this.db.prepare(`
              SELECT stage_id, rider_id, team_id
              FROM season_point_events
              WHERE season = ? AND points_awarded > 0
            `).all(currentRow.season) as Array<{ stage_id: number; rider_id: number | null; team_id: number }>;

            const riderPointsKeys = new Set<string>();
            const teamPointsKeys = new Set<string>();
            for (const p of pointsEvents) {
              if (p.rider_id != null) {
                riderPointsKeys.add(`${p.stage_id}_${p.rider_id}`);
              } else {
                teamPointsKeys.add(`${p.stage_id}_${p.team_id}`);
              }
            }

            const compactRows = this.db.prepare(`
              SELECT race_id, payload FROM race_results_compact WHERE season = ?
            `).all(currentRow.season) as Array<{ race_id: number; payload: string }>;

            const updateStmt = this.db.prepare(`
              UPDATE race_results_compact SET payload = ? WHERE race_id = ?
            `);

            for (const row of compactRows) {
              const groups = JSON.parse(row.payload);
              for (const typeKey of Object.keys(groups)) {
                if (Array.isArray(groups[typeKey])) {
                  groups[typeKey] = groups[typeKey].filter((r: any) => {
                    const stageId = r[0];
                    const riderId = r[1];
                    const teamId = r[2];
                    const rank = r[3];
                    if (rank === 1) return true; // Sieger immer behalten
                    if (riderId != null) {
                      return riderPointsKeys.has(`${stageId}_${riderId}`);
                    } else {
                      return teamPointsKeys.has(`${stageId}_${teamId}`);
                    }
                  });
                }
              }
              updateStmt.run(JSON.stringify(groups), row.race_id);
            }
            console.log(`Pruning finished for season ${currentRow.season}.`);

            // results_flat mit derselben Regel prunen wie die Kompakt-Payloads:
            // Rang-1-Zeilen immer behalten, sonst nur Zeilen mit Saisonpunkten.
            // stage_entries_flat bleibt unangetastet (wie stage_entries_compact),
            // damit DNF-Eintraege in der Fahrer-Historie sichtbar bleiben.
            if (tableExists(this.db, 'results_flat')) {
              const pruned = this.db.prepare(`
                DELETE FROM results_flat
                WHERE race_id IN (SELECT id FROM races WHERE start_date LIKE ?)
                  AND (rank IS NULL OR rank != 1)
                  AND NOT EXISTS (
                    SELECT 1 FROM season_point_events p
                    WHERE p.season = ?
                      AND p.points_awarded > 0
                      AND p.stage_id = results_flat.stage_id
                      AND (
                        (results_flat.rider_id IS NOT NULL AND p.rider_id = results_flat.rider_id)
                        OR (results_flat.rider_id IS NULL AND p.rider_id IS NULL AND p.team_id = results_flat.team_id)
                      )
                  )
              `).run(`${currentRow.season}-%`, currentRow.season);
              console.log(`results_flat geprunt: ${pruned.changes} Zeilen der Saison ${currentRow.season} entfernt.`);
            }
          } catch (pe) {
            console.error('Fehler beim Bereinigen der Saisonergebnisse:', pe);
          }
        } catch (e) {
          console.error('Fehler beim Archivieren der Saisonergebnisse:', e);
        }

        // Duplicate calendar dates (stages and races) to the new season's year
        this.duplicateCalendarForSeason(currentRow.season, nextSeason);

        new ContractService(this.db).checkContractStatuses(nextSeason, true);
        const draftService = new RiderDraftService(this.db);
        draftService.prepareDraft(nextSeason);

        this.db.prepare(`
          UPDATE game_state
          SET draft_status = 'active',
              draft_current_pick_number = 1,
              draft_season = ?
          WHERE id = 1
        `).run(nextSeason);

        // Hall-of-Fame-Badges einmal jaehrlich beim Saisonwechsel neu
        // materialisieren (die Karrierestatistiken der abgeschlossenen Saison
        // sind hier final). Bewusst nur hier statt bei jedem Load — der volle
        // Rebuild ist teuer (~26 Queries je Fahrer).
        new BadgeMaterializationService(this.db).rebuildAllRiderBadges();
        // Liga-Rivalitaeten der abgeschlossenen Saison neu materialisieren.
        new RivalryService(this.db).rebuildRivalries();
      }
      this.ensureRiderDailyStateTable();
      this.ensureRiderDailyStateRows(currentRow.season);
      this.advanceRiderDailyStates(nextDate, nextSeason);
      new GameStateRepository(this.db).markUnavailableStageRaceParticipantsAsDnf();
      this.db.prepare(
        'UPDATE game_state SET "current_date" = ?, season = ?, is_game_over = ? WHERE id = 1',
      ).run(nextDate, nextSeason, currentRow.is_game_over);
      this.db.prepare(`
        INSERT INTO career_meta (key, value) VALUES ('current_season', ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `).run(String(nextSeason));

      const checks = this.runDailyChecks(nextDate);
      return this.mapState({ current_date: nextDate, season: nextSeason, is_game_over: currentRow.is_game_over }, checks);
    })();

    if (isNewSeason) {
      try {
        console.log(`Running post-season VACUUM for season ${oldSeason}...`);
        this.db.prepare('VACUUM').run();
      } catch (e) {
        console.error('Failed to run post-season VACUUM:', e);
      }
    }

    // Nationale Meisterschaften erzeugen, sobald der 01.06. erreicht ist —
    // auch mitten im Spiel (nicht nur beim Laden). Idempotent.
    try {
      ensureNationalChampionships(this.db);
    } catch (e) {
      console.error('Nationale Meisterschaften konnten nicht erzeugt werden:', e);
    }

    // Olympische Spiele erzeugen, sobald der 22.06. eines Olympia-Jahres
    // erreicht ist — auch mitten im Spiel. Idempotent.
    try {
      ensureOlympicGames(this.db);
    } catch (e) {
      console.error('Olympische Spiele konnten nicht erzeugt werden:', e);
    }

    // Automatische Vertragsverlaengerung erzeugen, sobald der 01.08. erreicht
    // ist — auch mitten im Spiel (nicht nur beim Laden). Idempotent.
    try {
      ensureContractRenewals(this.db);
    } catch (e) {
      console.error('Vertragsverlaengerungen konnten nicht verarbeitet werden:', e);
    }

    // advanceDay stellt den kompletten Tageszustand her (Leutnant-Peaks, Load-
    // State, Form/Fatigue, Form-History). Den Sync-Marker direkt setzen, damit
    // der erste ensureState()-Aufruf danach (z.B. GET /riders im Frontend-
    // Reload) nicht dieselbe Arbeit via syncCurrentSeasonFormState wiederholt
    // (~650ms pro Tageswechsel eingespart).
    this.syncedStateDate = nextState.currentDate;

    this.events.emit('dayAdvanced', nextState);
    return nextState;
  }

  public onDayAdvanced(listener: DayAdvancedListener): () => void {
    this.events.on('dayAdvanced', listener);
    return () => this.events.off('dayAdvanced', listener);
  }

  private duplicateCalendarForSeason(oldYear: number, newYear: number): void {
    const oldYearStr = String(oldYear);
    const newYearStr = String(newYear);

    // 1. Duplicate races
    const oldRaces = this.db.prepare(`
      SELECT * FROM races WHERE start_date LIKE ?
    `).all(`${oldYearStr}-%`) as any[];

    const hasBonusOverride = columnExists(this.db, 'races', 'bonus_system_id');
    const insertRace = this.db.prepare(`
      INSERT INTO races (
        name, country_id, category_id, is_stage_race, number_of_stages, start_date, end_date, prestige, preferred_nationality_group, required_specs${hasBonusOverride ? ', bonus_system_id' : ''}
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?${hasBonusOverride ? ', ?' : ''})
    `);

    const raceMap = new Map<number, number>();
    // Olympische Spiele finden nur alle 4 Jahre statt (durch 4 teilbare Saisons).
    // Sie werden NICHT ins Folgejahr geklont, sondern in Olympia-Jahren eigens von
    // ensureOlympicGames erzeugt. So verschwinden sie im Jahr nach Olympia wieder
    // aus dem Kalender (2032 -> nicht 2033; erst 2036 wieder).
    const cloneNewSeasonIsOlympic = isOlympicSeason(newYear);

    for (const r of oldRaces) {
      if (OLYMPIC_CATEGORY_IDS.includes(r.category_id) && !cloneNewSeasonIsOlympic) {
        continue; // Olympia nicht in ein Nicht-Olympia-Jahr uebernehmen
      }
      const newStartDate = r.start_date.replace(oldYearStr, newYearStr);
      const newEndDate = r.end_date.replace(oldYearStr, newYearStr);
      const args: any[] = [
        r.name,
        r.country_id,
        r.category_id,
        r.is_stage_race,
        r.number_of_stages,
        newStartDate,
        newEndDate,
        r.prestige,
        r.preferred_nationality_group || null,
        r.required_specs || null,
      ];
      if (hasBonusOverride) args.push(r.bonus_system_id ?? null);
      const res = insertRace.run(...args);
      raceMap.set(r.id, res.lastInsertRowid as number);
    }

    // 2. Duplicate stages
    const oldStages = this.db.prepare(`
      SELECT * FROM stages WHERE date LIKE ?
    `).all(`${oldYearStr}-%`) as any[];

    const insertStage = this.db.prepare(`
      INSERT INTO stages (
        race_id, stage_number, date, profile, start_elevation, details_csv_file,
        final_spread_start_percent, final_push_start_percent, final_spread_difficulty_multiplier,
        crash_incident_multiplier, mechanical_incident_multiplier, stage_score, allowed_weather
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const stageMap = new Map<number, number>();

    for (const s of oldStages) {
      const newRaceId = raceMap.get(s.race_id);
      if (newRaceId === undefined) continue;

      const newDate = s.date.replace(oldYearStr, newYearStr);
      const res = insertStage.run(
        newRaceId,
        s.stage_number,
        newDate,
        s.profile,
        s.start_elevation,
        s.details_csv_file,
        s.final_spread_start_percent,
        s.final_push_start_percent,
        s.final_spread_difficulty_multiplier,
        s.crash_incident_multiplier,
        s.mechanical_incident_multiplier,
        s.stage_score,
        s.allowed_weather
      );
      stageMap.set(s.id, res.lastInsertRowid as number);
    }

    // 3. Duplicate stage climb scores
    if (this.isTable('stage_climb_scores')) {
      const oldClimbs = this.db.prepare(`
        SELECT scs.* FROM stage_climb_scores scs
        JOIN stages s ON s.id = scs.stage_id
        WHERE s.date LIKE ?
      `).all(`${oldYearStr}-%`) as any[];

      const insertClimb = this.db.prepare(`
        INSERT INTO stage_climb_scores (
          stage_id, climb_index, name, category, start_km, end_km, climb_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const c of oldClimbs) {
        const newStageId = stageMap.get(c.stage_id);
        if (newStageId === undefined) continue;

        insertClimb.run(
          newStageId,
          c.climb_index,
          c.name,
          c.category,
          c.start_km,
          c.end_km,
          c.climb_score
        );
      }
    }

    // 4. Duplicate race program races
    if (this.isTable('race_program_races')) {
      const oldProgramRaces = this.db.prepare(`
        SELECT rpr.* FROM race_program_races rpr
        JOIN races r ON r.id = rpr.race_id
        WHERE r.start_date LIKE ?
      `).all(`${oldYearStr}-%`) as any[];

      const insertProgramRace = this.db.prepare(`
        INSERT OR IGNORE INTO race_program_races (
          program_id, race_id, allowed_program_group_ids
        ) VALUES (?, ?, ?)
      `);

      for (const pr of oldProgramRaces) {
        const newRaceId = raceMap.get(pr.race_id);
        if (newRaceId === undefined) continue;

        insertProgramRace.run(pr.program_id, newRaceId, pr.allowed_program_group_ids ?? null);
      }
    }
  }

  /**
   * Selbstheilende Reparatur: Aeltere Saves haben den Saisonwechsel unter Code
   * durchlaufen, der `race_program_races` beim Kalender-Duplizieren noch nicht
   * mitkopiert hat. Betroffene Saisons haben dann Rennen, aber keinerlei
   * Programm-Verknuepfungen — Folge: im Programm-Tab ist jeder Fahrer "nicht
   * dabei" und es gibt keine Form-Peaks/Grenzen (die aus den Programmfenstern
   * abgeleitet werden). Fehlt fuer eine Saison JEDE Verknuepfung, werden sie
   * aus einer Vorlagensaison uebernommen (Rennen per Name+Kategorie gematcht;
   * duplizierte Rennen behalten Name und Kategorie). Der Check ist eine
   * einzelne guenstige Aggregat-Query; ohne Schaden ist der Aufwand minimal.
   */
  private repairMissingRaceProgramRaces(): void {
    if (!tableExists(this.db, 'races') || !tableExists(this.db, 'race_program_races')) {
      return;
    }

    const perSeason = this.db.prepare(`
      SELECT substr(r.start_date, 1, 4) AS yr,
             COUNT(DISTINCT r.id) AS race_count,
             COUNT(rpr.id) AS rpr_count
      FROM races r
      LEFT JOIN race_program_races rpr ON rpr.race_id = r.id
      GROUP BY yr
    `).all() as Array<{ yr: string; race_count: number; rpr_count: number }>;

    const withLinks = perSeason.filter((s) => s.rpr_count > 0);
    // Nur ganz fehlende Saisons reparieren (rpr_count === 0) — partielle
    // Zustaende koennten gewollt sein und werden nicht angetastet.
    const broken = perSeason.filter((s) => s.race_count > 0 && s.rpr_count === 0);
    if (broken.length === 0 || withLinks.length === 0) {
      return;
    }

    const copyStmt = this.db.prepare(`
      INSERT OR IGNORE INTO race_program_races (program_id, race_id, allowed_program_group_ids)
      SELECT src_rpr.program_id, dst.id, src_rpr.allowed_program_group_ids
      FROM races dst
      JOIN races src
        ON src.name = dst.name
       AND src.category_id = dst.category_id
       AND substr(src.start_date, 1, 4) = ?
      JOIN race_program_races src_rpr ON src_rpr.race_id = src.id
      WHERE substr(dst.start_date, 1, 4) = ?
    `);

    this.db.transaction(() => {
      for (const target of broken) {
        // Vorlage: naechstgelegene Saison mit Links (bevorzugt frueher).
        const template = withLinks
          .slice()
          .sort((a, b) => Math.abs(Number(a.yr) - Number(target.yr)) - Math.abs(Number(b.yr) - Number(target.yr))
            || Number(a.yr) - Number(b.yr))[0];
        const res = copyStmt.run(template.yr, target.yr);
        console.log(`race_program_races repariert: Saison ${target.yr} aus Vorlage ${template.yr} — ${res.changes} Verknuepfungen erzeugt.`);
      }
    })();

    // Peak-Fenster-Cache invalidieren, damit die frisch verknuepften Programme
    // sofort greifen.
    this.programWindowsBySeason.clear();
  }

  public refreshRiderLoadState(currentDate: string, currentSeason: number): void {
    this.ensureRiderDailyStateTable();
    this.ensureRiderDailyStateRows(currentSeason);
    this.syncRiderLoadState(currentDate, currentSeason);
  }

  private ensureStateRow(): void {
    // Lightweight idempotent INSERT-OR-IGNORE for game_state. CREATE TABLE IF NOT EXISTS
    // and other heavy idempotent schema work is handled in ensureSchemaOnce().
    this.db.prepare(
      'INSERT OR IGNORE INTO game_state (id, "current_date", season, is_game_over) VALUES (1, ?, ?, 0)',
    ).run(DEFAULT_START_DATE, DEFAULT_START_SEASON);
  }

  private ensureRiderDailyStateTable(): void {
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
        season_points INTEGER NOT NULL DEFAULT 0,
        season_wins INTEGER NOT NULL DEFAULT 0,
        season_race_days_total INTEGER NOT NULL DEFAULT 0 CHECK(season_race_days_total >= 0),
        rolling_30d_race_days INTEGER NOT NULL DEFAULT 0 CHECK(rolling_30d_race_days >= 0),
        short_term_fatigue REAL NOT NULL DEFAULT 0.0,
        long_term_fatigue_decayable REAL NOT NULL DEFAULT 0.0,
        long_term_fatigue_locked REAL NOT NULL DEFAULT 0.0,
        consecutive_non_race_days INTEGER NOT NULL DEFAULT 0
      )
    `).run();

    if (!columnExists(this.db, 'rider_daily_state', 'season_race_days_total')) {
      this.db.prepare(`
        ALTER TABLE rider_daily_state
        ADD COLUMN season_race_days_total INTEGER NOT NULL DEFAULT 0 CHECK(season_race_days_total >= 0)
      `).run();
    }

    if (!columnExists(this.db, 'rider_daily_state', 'season_points')) {
      this.db.prepare(`
        ALTER TABLE rider_daily_state
        ADD COLUMN season_points INTEGER NOT NULL DEFAULT 0
      `).run();

      // Migrate existing points
      this.db.prepare(`
        UPDATE rider_daily_state
        SET season_points = COALESCE((
          SELECT SUM(points_awarded)
          FROM season_point_events
          WHERE season_point_events.rider_id = rider_daily_state.rider_id
            AND season_point_events.season = rider_daily_state.season
        ), 0)
      `).run();
    }

    if (!columnExists(this.db, 'rider_daily_state', 'season_wins')) {
      this.db.prepare(`
        ALTER TABLE rider_daily_state
        ADD COLUMN season_wins INTEGER NOT NULL DEFAULT 0
      `).run();

      // Migrate existing wins
      this.db.prepare(`
        WITH individual_wins AS (
          SELECT results.rider_id AS rider_id, COUNT(*) AS wins
          FROM results
          JOIN stages ON stages.id = results.stage_id
          WHERE results.result_type_id = 1 AND results.rank = 1 AND results.rider_id IS NOT NULL
          GROUP BY results.rider_id
        ),
        ttt_wins AS (
          SELECT all_stage_entries.rider_id AS rider_id, COUNT(*) AS wins
          FROM results
          JOIN stages ON stages.id = results.stage_id
          JOIN all_stage_entries ON all_stage_entries.stage_id = results.stage_id AND all_stage_entries.team_id = results.team_id
          WHERE results.result_type_id = 1 AND results.rank = 1 AND results.rider_id IS NULL
            AND all_stage_entries.status = 'finished'
          GROUP BY all_stage_entries.rider_id
        ),
        gc_wins AS (
          SELECT results.rider_id AS rider_id, COUNT(*) AS wins
          FROM results
          JOIN stages ON stages.id = results.stage_id
          JOIN races ON races.id = stages.race_id
          WHERE results.result_type_id = 2 AND results.rank = 1 AND results.rider_id IS NOT NULL
            AND races.is_stage_race = 1 AND stages.stage_number = races.number_of_stages
          GROUP BY results.rider_id
        ),
        total_wins AS (
          SELECT rider_id, SUM(wins) AS wins
          FROM (
            SELECT rider_id, wins FROM individual_wins
            UNION ALL
            SELECT rider_id, wins FROM ttt_wins
            UNION ALL
            SELECT rider_id, wins FROM gc_wins
          )
          GROUP BY rider_id
        )
        UPDATE rider_daily_state
        SET season_wins = COALESCE((
          SELECT wins FROM total_wins WHERE total_wins.rider_id = rider_daily_state.rider_id
        ), 0)
      `).run();
    }

    if (!columnExists(this.db, 'rider_daily_state', 'rolling_30d_race_days')) {
      this.db.prepare(`
        ALTER TABLE rider_daily_state
        ADD COLUMN rolling_30d_race_days INTEGER NOT NULL DEFAULT 0 CHECK(rolling_30d_race_days >= 0)
      `).run();
    }

    if (!columnExists(this.db, 'rider_daily_state', 'short_term_fatigue')) {
      this.db.prepare(`
        ALTER TABLE rider_daily_state
        ADD COLUMN short_term_fatigue REAL NOT NULL DEFAULT 0.0
      `).run();
    }

    if (!columnExists(this.db, 'rider_daily_state', 'long_term_fatigue_decayable')) {
      this.db.prepare(`
        ALTER TABLE rider_daily_state
        ADD COLUMN long_term_fatigue_decayable REAL NOT NULL DEFAULT 0.0
      `).run();
    }

    if (!columnExists(this.db, 'rider_daily_state', 'long_term_fatigue_locked')) {
      this.db.prepare(`
        ALTER TABLE rider_daily_state
        ADD COLUMN long_term_fatigue_locked REAL NOT NULL DEFAULT 0.0
      `).run();
    }

    if (!columnExists(this.db, 'rider_daily_state', 'consecutive_non_race_days')) {
      this.db.prepare(`
        ALTER TABLE rider_daily_state
        ADD COLUMN consecutive_non_race_days INTEGER NOT NULL DEFAULT 0
      `).run();
    }

    if (!columnExists(this.db, 'rider_daily_state', 'season_ttt_wins')) {
      this.db.prepare(`
        ALTER TABLE rider_daily_state
        ADD COLUMN season_ttt_wins INTEGER NOT NULL DEFAULT 0
      `).run();
    }

    // Korrektur veralteter Saves: Frueher wurde beim Saisonwechsel season_wins
    // auf 0 gesetzt, season_ttt_wins aber nicht — dadurch wurden die effektiven
    // Team-Siege (wins - ttt + ...) negativ ("-2" nach dem Draft). Da die
    // TTT-Siege stets Teil der Saisonsiege sind, kann season_ttt_wins nie groesser
    // als season_wins sein; solche Zeilen werden hier idempotent bereinigt.
    this.db.prepare(`
      UPDATE rider_daily_state SET season_ttt_wins = 0 WHERE season_ttt_wins > season_wins
    `).run();

    // Einmaliger, korrekter Neuaufbau der Saisonsiege (inkl. kompaktierter
    // Rennen) fuer bestehende Saves — danach wird nur noch inkrementell gezaehlt.
    this.backfillSeasonWinsV2();

    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_fatigue_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        date TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('race', 'decay')),
        race_name TEXT,
        stage_number INTEGER,
        stage_score REAL,
        short_change REAL NOT NULL,
        long_decayable_change REAL NOT NULL,
        long_locked_change REAL NOT NULL,
        short_after REAL NOT NULL,
        long_after REAL NOT NULL
      )
    `).run();

    this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_rider_fatigue_history_rider_date
      ON rider_fatigue_history(rider_id, date)
    `).run();
  }

  /**
   * Einmaliger Neuaufbau von season_wins/season_ttt_wins fuer die laufende
   * Saison. Noetig, weil die fruehere taegliche Voll-Aggregation nur die Live-
   * Tabelle `results` zaehlte — Siege bereits abgeschlossener (kompaktierter)
   * Rennen gingen dadurch verloren (Bug: Saisonsiege im Fahrer-Header blieben
   * hinter den Karrieresiegen zurueck). Zaehlt Live-Ergebnisse UND die
   * race_results_compact-Payloads einmalig zusammen; danach pflegt der
   * StageResultCommitService die Zaehler inkrementell.
   */
  private backfillSeasonWinsV2(): void {
    if (this.seasonWinsBackfillChecked) {
      return;
    }
    this.seasonWinsBackfillChecked = true;

    if (!tableExists(this.db, 'career_meta') || !tableExists(this.db, 'results') || !tableExists(this.db, 'stages') || !tableExists(this.db, 'races')) {
      return;
    }
    const flag = this.db.prepare(`SELECT value FROM career_meta WHERE key = 'season_wins_backfill_v2'`).get() as { value: string } | undefined;
    if (flag) {
      return;
    }

    const stateRow = this.db.prepare('SELECT season FROM game_state WHERE id = 1').get() as { season: number } | undefined;
    if (!stateRow) {
      return;
    }
    const season = stateRow.season;
    const seasonPrefix = `${season}-%`;

    const wins = new Map<number, number>();
    const tttWins = new Map<number, number>();
    const bump = (map: Map<number, number>, riderId: number): void => {
      map.set(riderId, (map.get(riderId) ?? 0) + 1);
    };

    // 1) Live-Tabelle: Etappensiege (Einzel)
    const liveStageWins = this.db.prepare(`
      SELECT r.rider_id FROM results r
      JOIN stages s ON s.id = r.stage_id
      WHERE r.result_type_id = 1 AND r.rank = 1 AND r.rider_id IS NOT NULL AND s.date LIKE ?
    `).all(seasonPrefix) as Array<{ rider_id: number }>;
    for (const row of liveStageWins) bump(wins, row.rider_id);

    // 2) Live-Tabelle: GC-Finalsiege
    const liveGcWins = this.db.prepare(`
      SELECT r.rider_id FROM results r
      JOIN stages s ON s.id = r.stage_id
      JOIN races ra ON ra.id = s.race_id
      WHERE r.result_type_id = 2 AND r.rank = 1 AND r.rider_id IS NOT NULL
        AND ra.is_stage_race = 1 AND s.stage_number = ra.number_of_stages AND s.date LIKE ?
    `).all(seasonPrefix) as Array<{ rider_id: number }>;
    for (const row of liveGcWins) bump(wins, row.rider_id);

    // 3) Live-Tabelle: TTT-Siege (je gefinishtem Fahrer des Teams)
    const liveTttWins = this.db.prepare(`
      SELECT se.rider_id FROM results r
      JOIN stages s ON s.id = r.stage_id
      JOIN stage_entries se ON se.stage_id = r.stage_id AND se.team_id = r.team_id AND se.status = 'finished'
      WHERE r.result_type_id = 1 AND r.rank = 1 AND r.rider_id IS NULL AND s.date LIKE ?
    `).all(seasonPrefix) as Array<{ rider_id: number }>;
    for (const row of liveTttWins) {
      bump(wins, row.rider_id);
      bump(tttWins, row.rider_id);
    }

    // 4) Kompaktierte Rennen der Saison
    if (tableExists(this.db, 'race_results_compact')) {
      const finalStageByRace = new Map<number, number>();
      const finals = this.db.prepare(`
        SELECT s.race_id AS race_id, s.id AS stage_id
        FROM stages s JOIN races ra ON ra.id = s.race_id
        WHERE ra.is_stage_race = 1 AND s.stage_number = ra.number_of_stages AND s.date LIKE ?
      `).all(seasonPrefix) as Array<{ race_id: number; stage_id: number }>;
      for (const row of finals) finalStageByRace.set(row.race_id, row.stage_id);

      const entriesCompactByRace = new Map<number, any[]>();
      if (tableExists(this.db, 'stage_entries_compact')) {
        const entryRows = this.db.prepare(`SELECT race_id, payload FROM stage_entries_compact WHERE season = ?`).all(season) as Array<{ race_id: number; payload: string }>;
        for (const row of entryRows) {
          try { entriesCompactByRace.set(row.race_id, JSON.parse(row.payload)); } catch { /* korrupte Payload ueberspringen */ }
        }
      }

      const compactRows = this.db.prepare(`SELECT race_id, payload FROM race_results_compact WHERE season = ?`).all(season) as Array<{ race_id: number; payload: string }>;
      for (const row of compactRows) {
        let groups: Record<string, any[]>;
        try { groups = JSON.parse(row.payload); } catch { continue; }

        // Etappensiege + TTT (type1: [stage_id, rider_id, team_id, rank, ...])
        for (const res of groups['type1'] ?? []) {
          if (res[3] !== 1) continue;
          const riderId = res[1];
          if (riderId != null) {
            bump(wins, riderId);
          } else {
            const teamId = res[2];
            const stageId = res[0];
            // Finisher des Teams aus stage_entries_compact: [stage_id, team_id, rider_id, status, reason]
            for (const entry of entriesCompactByRace.get(row.race_id) ?? []) {
              if (entry[0] === stageId && entry[1] === teamId && entry[3] === 'finished' && entry[2] != null) {
                bump(wins, entry[2]);
                bump(tttWins, entry[2]);
              }
            }
          }
        }

        // GC-Finalsieg (type2 rank 1 auf der letzten Etappe)
        const finalStageId = finalStageByRace.get(row.race_id);
        if (finalStageId != null) {
          for (const res of groups['type2'] ?? []) {
            if (res[3] === 1 && res[0] === finalStageId && res[1] != null) {
              bump(wins, res[1]);
            }
          }
        }
      }
    }

    if (tableExists(this.db, 'rider_daily_state')) {
      const resetStmt = this.db.prepare('UPDATE rider_daily_state SET season_wins = 0, season_ttt_wins = 0');
      const setStmt = this.db.prepare('UPDATE rider_daily_state SET season_wins = ?, season_ttt_wins = ? WHERE rider_id = ?');
      this.db.transaction(() => {
        resetStmt.run();
        for (const [riderId, count] of wins.entries()) {
          setStmt.run(count, tttWins.get(riderId) ?? 0, riderId);
        }
        this.db.prepare(`
          INSERT INTO career_meta (key, value) VALUES ('season_wins_backfill_v2', '1')
          ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `).run();
      })();
      console.log(`Saisonsiege neu aufgebaut (Backfill v2): ${wins.size} Fahrer mit Siegen in Saison ${season}.`);
    }
  }

  private ensureRiderFormTables(): void {
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_r_form_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        source_date TEXT NOT NULL,
        expires_on TEXT NOT NULL,
        amount REAL NOT NULL CHECK(amount >= 0),
        event_type TEXT NOT NULL CHECK(event_type IN ('race_day'))
      )
    `).run();

    this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_rider_r_form_events_rider_date
      ON rider_r_form_events(rider_id, source_date, expires_on)
    `).run();

    this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_rider_r_form_events_expires_on
      ON rider_r_form_events(expires_on)
    `).run();

    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_form_history (
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        date TEXT NOT NULL,
        s_form REAL NOT NULL,
        r_form REAL NOT NULL,
        total_form REAL NOT NULL,
        short_fatigue REAL NOT NULL DEFAULT 0.0,
        long_fatigue REAL NOT NULL DEFAULT 0.0,
        combined_fatigue REAL NOT NULL DEFAULT 0.0,
        PRIMARY KEY (rider_id, date)
      )
    `).run();

    const colExists = (tableName: string, colName: string): boolean => {
      try {
        const info = this.db.prepare(`PRAGMA table_info(${tableName})`).all() as any[];
        return info.some((c) => c.name === colName);
      } catch (e) {
        return false;
      }
    };
    if (!colExists('rider_form_history', 'short_fatigue')) {
      this.db.prepare('ALTER TABLE rider_form_history ADD COLUMN short_fatigue REAL NOT NULL DEFAULT 0.0').run();
    }
    if (!colExists('rider_form_history', 'long_fatigue')) {
      this.db.prepare('ALTER TABLE rider_form_history ADD COLUMN long_fatigue REAL NOT NULL DEFAULT 0.0').run();
    }
    if (!colExists('rider_form_history', 'combined_fatigue')) {
      this.db.prepare('ALTER TABLE rider_form_history ADD COLUMN combined_fatigue REAL NOT NULL DEFAULT 0.0').run();
    }

    this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_rider_form_history_date
      ON rider_form_history(date, rider_id)
    `).run();

    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_r_form_daily_awards (
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        award_date TEXT NOT NULL,
        award_type TEXT NOT NULL CHECK(award_type IN ('build', 'free')),
        PRIMARY KEY (rider_id, award_date)
      )
    `).run();

    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_peak_awards (
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        season INTEGER NOT NULL,
        peak_date TEXT NOT NULL,
        PRIMARY KEY (rider_id, season, peak_date)
      )
    `).run();
  }

  private ensureRiderDailyStateRows(season: number): void {
    if (!tableExists(this.db, 'riders')) {
      return;
    }

    const missingRows = this.db.prepare(`
      SELECT riders.id AS id
      FROM riders
      LEFT JOIN rider_daily_state existing_state ON existing_state.rider_id = riders.id
      WHERE riders.is_retired = 0
        AND existing_state.rider_id IS NULL
      ORDER BY riders.id ASC
    `).all() as Array<{ id: number }>;
    if (missingRows.length === 0) {
      return;
    }

    // Use cached program windows (or the slow-path loader as a fallback) so we
    // avoid one SQL per newly-inserted rider.
    const programWindows = this.getProgramWindowsForSeason(season);
    const insertState = this.db.prepare(`
      INSERT INTO rider_daily_state (
        rider_id, season, form_bonus, race_form_bonus, peak_s_form, peak_r_form, active_peak_date, peak_dates_json, health_status, unavailable_until, unavailable_days_remaining, season_race_days_total, rolling_30d_race_days
      ) VALUES (?, ?, ?, 0, 0, 0, NULL, ?, 'healthy', NULL, 0, 0, 0)
    `);

    for (const rider of missingRows) {
      const windows = programWindows.get(rider.id) ?? null;
      const peakDates = resolveSeasonPeakDatesFromWindows([], season, windows, this.db, rider.id);
      insertState.run(rider.id, season, SEASON_FORM_MIN_RAW, JSON.stringify(peakDates));
    }
  }

  private syncCurrentSeasonFormState(currentDate: string, currentSeason: number): void {
    if (!this.isTable('rider_daily_state')) {
      return;
    }

    this.ensureRiderDailyStateRows(currentSeason);
    this.syncLieutenantPeakState(currentSeason);
    this.syncRiderLoadState(currentDate, currentSeason);

    const rows = this.db.prepare(`
      SELECT rds.rider_id, rds.season, rds.form_bonus, rds.race_form_bonus, rds.peak_s_form, rds.peak_r_form, rds.active_peak_date, rds.peak_dates_json, rds.health_status, rds.unavailable_until, rds.unavailable_days_remaining, rds.season_race_days_total, rds.rolling_30d_race_days,
             r.active_team_id,
             dt.tier AS team_tier
      FROM rider_daily_state rds
      JOIN riders r ON r.id = rds.rider_id
      LEFT JOIN teams t ON t.id = r.active_team_id
      LEFT JOIN division_teams dt ON dt.id = t.division_id
    `).all() as RiderDailyStateRow[];
    const updateState = this.db.prepare(`
      UPDATE rider_daily_state
      SET season = ?,
          form_bonus = ?,
          peak_s_form = ?,
          active_peak_date = ?,
          peak_dates_json = ?
      WHERE rider_id = ?
    `);

    // Bulk-load program windows once, then look up per rider from the in-memory map.
    const programWindows = this.getProgramWindowsForSeason(currentSeason);

    for (const row of rows) {
      const seasonChanged = row.season !== currentSeason;
      const isTier1 = row.active_team_id != null && row.team_tier === 1;
      const storedPeaks = parsePeakDates(row.peak_dates_json);
      // Veraltete Peaks (kein Termin in der laufenden Saison — z.B. alte Saves,
      // deren Peaks beim Saisonwechsel nie neu abgeleitet wurden) auch fuer
      // Nicht-Tier-1-Fahrer heilen, sonst bleibt deren Season-Form dauerhaft 0.
      const peaksStale = !seasonChanged && !storedPeaks.some((d) => d.startsWith(`${currentSeason}-`));
      if (!isTier1 && !seasonChanged && !peaksStale) {
        continue;
      }

      const windows = seasonChanged ? null : (programWindows.get(row.rider_id) ?? null);
      const peakDates = resolveSeasonPeakDatesFromWindows(
        seasonChanged || peaksStale ? [] : storedPeaks,
        currentSeason,
        windows,
        this.db,
        row.rider_id,
      );
      const phase = resolvePeakPhase(currentDate, peakDates);
      let formBonus = row.form_bonus;
      let peakSForm = row.peak_s_form;
      let activePeakDate = row.active_peak_date;

      if (phase?.phase === 'build') {
        activePeakDate = null;
        peakSForm = 0;
        // Season-Form am Fahrplan ausrichten: Wert der aktuellen Position im
        // (kanonischen) Aufbaufenster setzen, statt den gespeicherten Wert nur
        // nach oben zu deckeln. So zeigt ein frisch geladener Spielstand die
        // Season-Form passend zu den angezeigten Peaks (und nicht 0/veraltet).
        formBonus = scheduledBuildForm(currentDate, phase.actualBuildStartDay, phase.peakDate);
      } else if (phase?.phase === 'decline') {
        // Von einem echten (aufgezeichneten) Peakwert abbauen, sonst vom
        // planmaessigen Peakwert — damit der Abbau zu den Peaks passt, auch wenn
        // der Peaktag in dieser Sitzung nie durchlaufen wurde.
        peakSForm = row.active_peak_date === phase.peakDate && row.peak_s_form > 0
          ? row.peak_s_form
          : scheduledPeakForm(phase.peakDate, phase.actualBuildStartDay);
        formBonus = resolveDeclineValue(peakSForm, phase.elapsedDays);
        activePeakDate = phase.peakDate;
      } else {
        formBonus = 0;
        peakSForm = 0;
        activePeakDate = null;
      }

      const roundedFormBonus = roundFormBonus(formBonus);
      const roundedPeakSForm = roundFormBonus(peakSForm);
      const peakDatesJson = JSON.stringify(peakDates);
      // Skip the UPDATE on quiet days where form is stable.
      if (
        seasonChanged
        || row.form_bonus !== roundedFormBonus
        || row.peak_s_form !== roundedPeakSForm
        || row.active_peak_date !== activePeakDate
        || row.peak_dates_json !== peakDatesJson
      ) {
        updateState.run(
          currentSeason,
          roundedFormBonus,
          roundedPeakSForm,
          activePeakDate,
          peakDatesJson,
          row.rider_id,
        );
      }
    }
  }

  /**
   * Kopiert die Formpeak-Daten der Kapitaene auf ihre Leutnants und pflegt die
   * All-Time-Bestwerte der Leutnants. Wird sowohl beim Save-Sync (ensureState)
   * als auch im Tageswechsel genutzt, damit advanceDay den kompletten Zustand
   * herstellt und der Re-Sync danach entfallen kann.
   */
  private syncLieutenantPeakState(currentSeason: number): void {
    if (!this.isTable('rider_lieutenants')) {
      return;
    }

    this.db.prepare(`
      UPDATE rider_daily_state
      SET peak_dates_json = (
        SELECT lds.peak_dates_json
        FROM rider_lieutenants rl
        JOIN rider_daily_state lds ON lds.rider_id = rl.leader_id
        WHERE rl.lieutenant_id = rider_daily_state.rider_id AND rl.season = ?
      )
      WHERE EXISTS (
        SELECT 1
        FROM rider_lieutenants rl
        JOIN rider_daily_state lds ON lds.rider_id = rl.leader_id
        WHERE rl.lieutenant_id = rider_daily_state.rider_id AND rl.season = ?
          AND lds.peak_dates_json IS NOT NULL AND lds.peak_dates_json != '[]'
      )
    `).run(currentSeason, currentSeason);

    if (this.isTable('lieutenant_all_time_peaks')) {
      this.db.prepare(`
        INSERT INTO lieutenant_all_time_peaks (rider_id, max_overall_rating, leader_id, season)
        SELECT rl.lieutenant_id, r.overall_rating, rl.leader_id, rl.season
        FROM rider_lieutenants rl
        JOIN riders r ON r.id = rl.lieutenant_id
        WHERE rl.season = ?
        ON CONFLICT(rider_id) DO UPDATE SET
          leader_id = CASE WHEN excluded.max_overall_rating > max_overall_rating THEN excluded.leader_id ELSE leader_id END,
          season = CASE WHEN excluded.max_overall_rating > max_overall_rating THEN excluded.season ELSE season END,
          max_overall_rating = CASE WHEN excluded.max_overall_rating > max_overall_rating THEN excluded.max_overall_rating ELSE max_overall_rating END
      `).run(currentSeason);
    }
  }

  private advanceRiderDailyStates(nextDate: string, nextSeason: number): void {
    if (!this.isTable('rider_daily_state')) {
      return;
    }

    this.ensureRiderDailyStateRows(nextSeason);
    this.syncLieutenantPeakState(nextSeason);
    this.removeExpiredRaceFormEvents(nextDate);
    this.syncRiderLoadState(nextDate, nextSeason);

    const rows = this.db.prepare(`
      SELECT rds.rider_id, rds.season, rds.form_bonus, rds.race_form_bonus, rds.peak_s_form, rds.peak_r_form, rds.active_peak_date, rds.peak_dates_json, rds.health_status, rds.unavailable_until, rds.unavailable_days_remaining, rds.season_race_days_total, rds.rolling_30d_race_days,
             rds.short_term_fatigue, rds.long_term_fatigue_decayable, rds.long_term_fatigue_locked, rds.consecutive_non_race_days,
             r.skill_recuperation, r.birth_year,
             r.active_team_id,
             dt.tier AS team_tier,
             t.is_player_team AS is_player_team
      FROM rider_daily_state rds
      JOIN riders r ON r.id = rds.rider_id
      LEFT JOIN teams t ON t.id = r.active_team_id
      LEFT JOIN division_teams dt ON dt.id = t.division_id
    `).all() as RiderDailyStateRow[];
    const updateState = this.db.prepare(`
      UPDATE rider_daily_state
      SET season = ?,
          form_bonus = ?,
          race_form_bonus = ?,
          peak_s_form = ?,
          peak_r_form = ?,
          active_peak_date = ?,
          peak_dates_json = ?,
          health_status = ?,
          unavailable_until = ?,
          unavailable_days_remaining = ?,
          short_term_fatigue = ?,
          long_term_fatigue_decayable = ?,
          long_term_fatigue_locked = ?,
          consecutive_non_race_days = ?
      WHERE rider_id = ?
    `);



    const racingRidersRow = this.db.prepare(`
      SELECT se.rider_id FROM stage_entries se
      JOIN stages s ON s.id = se.stage_id
      WHERE s.date = ? AND se.status IN ('scheduled', 'started')
    `).all(nextDate) as Array<{ rider_id: number }>;
    const racingRiderIds = new Set(racingRidersRow.map((r: any) => r.rider_id));

    const yesterday = addDaysIso(nextDate, -1);
    // Performance: NICHT ueber die all_stage_entries-View gehen (sie entpackt bei
    // jeder Query ALLE stage_entries_compact-Payloads per json_each, ~370ms).
    // Stattdessen live-Tabelle + gezieltes Entpacken NUR der Rennen, die gestern
    // eine Etappe hatten (idx_stages_date treibt die Suche, 0-3 Payloads).
    const racedYesterdayRow = (tableExists(this.db, 'stage_entries_compact')
      ? this.db.prepare(`
          SELECT se.rider_id, s.stage_score FROM stage_entries se
          JOIN stages s ON s.id = se.stage_id
          WHERE s.date = ? AND se.status IN ('finished', 'dnf')
          UNION ALL
          SELECT CAST(j.value->>2 AS INTEGER) AS rider_id, s.stage_score
          FROM stages s
          JOIN stage_entries_compact c ON c.race_id = s.race_id, json_each(c.payload) j
          WHERE s.date = ?
            AND CAST(j.value->>0 AS INTEGER) = s.id
            AND j.value->>3 IN ('finished', 'dnf')
        `).all(yesterday, yesterday)
      : this.db.prepare(`
          SELECT se.rider_id, s.stage_score FROM stage_entries se
          JOIN stages s ON s.id = se.stage_id
          WHERE s.date = ? AND se.status IN ('finished', 'dnf')
        `).all(yesterday)) as Array<{ rider_id: number; stage_score: number }>;
    const racedYesterdayRiderIds = new Set(racedYesterdayRow.map((r: any) => r.rider_id));
    const racedYesterdayMap = new Map<number, number>();
    for (const r of racedYesterdayRow) {
      const currentScore = racedYesterdayMap.get(r.rider_id);
      if (currentScore === undefined || r.stage_score > currentScore) {
        racedYesterdayMap.set(r.rider_id, r.stage_score);
      }
    }

    // Bulk-load program windows for the current season ONCE instead of doing
    // a per-rider SELECT in `loadProgramPeakWindows` (the previous N+1 hot spot).
    const programWindows = this.getProgramWindowsForSeason(nextSeason);
    const seasonChangedRiderIds: number[] = [];
    const developmentContexts: RiderDevelopmentDailyContext[] = [];
    const deleteFormEvents = this.db.prepare(`
      DELETE FROM rider_r_form_events
      WHERE rider_id = ?
    `);
    const updates: any[][] = [];

    for (const row of rows) {
      const seasonChanged = row.season !== nextSeason;
      const isTier1 = row.active_team_id != null && row.team_tier === 1;
      if (!isTier1 && !seasonChanged) {
        continue;
      }

      const riderProgramWindows = seasonChanged ? null : (programWindows.get(row.rider_id) ?? null);
      const peakDates = resolveSeasonPeakDatesFromWindows(
        seasonChanged ? [] : parsePeakDates(row.peak_dates_json),
        nextSeason,
        riderProgramWindows,
        this.db,
        row.rider_id,
      );
      let formBonus = seasonChanged ? SEASON_FORM_MIN_RAW : row.form_bonus;
      let raceFormBonus = seasonChanged ? 0 : row.race_form_bonus;
      let peakSForm = seasonChanged ? 0 : row.peak_s_form;
      let peakRForm = seasonChanged ? 0 : row.peak_r_form;
      let activePeakDate = seasonChanged ? null : row.active_peak_date;
      let healthStatus = row.health_status;
      let remainingDays = row.unavailable_days_remaining;
      let unavailableUntil = row.unavailable_until;

      if (seasonChanged) {
        seasonChangedRiderIds.push(row.rider_id);
      }

      if (remainingDays > 0) {
        remainingDays = Math.max(remainingDays - 1, 0);
        unavailableUntil = remainingDays > 0 ? addDaysIso(nextDate, remainingDays - 1) : null;
        if (remainingDays === 0) {
          healthStatus = 'healthy';
          unavailableUntil = null;
        }
      }

      if (healthStatus === 'healthy') {
        const newCondition = rollDailyCondition(nextDate);
        if (newCondition) {
          healthStatus = newCondition.status;
          remainingDays = newCondition.durationDays;
          unavailableUntil = addDaysIso(nextDate, newCondition.durationDays - 1);

          // Update career stats in the database
          if (tableExists(this.db, 'rider_career_stats')) {
            const isIll = newCondition.status === 'ill';
            this.db.prepare(`
              INSERT INTO rider_career_stats (
                rider_id, illnesses, illness_days, injuries, injury_days
              ) VALUES (?, ?, ?, ?, ?)
              ON CONFLICT(rider_id) DO UPDATE SET
                illnesses = illnesses + excluded.illnesses,
                illness_days = illness_days + excluded.illness_days,
                injuries = injuries + excluded.injuries,
                injury_days = injury_days + excluded.injury_days
            `).run(
              row.rider_id,
              isIll ? 1 : 0,
              isIll ? newCondition.durationDays : 0,
              isIll ? 0 : 1,
              isIll ? 0 : newCondition.durationDays
            );
          }
          if (tableExists(this.db, 'rider_season_stats')) {
            const isIll = newCondition.status === 'ill';
            this.db.prepare(`
              INSERT INTO rider_season_stats (
                rider_id, season, illnesses, illness_days, injuries, injury_days
              ) VALUES (?, ?, ?, ?, ?, ?)
              ON CONFLICT(rider_id, season) DO UPDATE SET
                illnesses = illnesses + excluded.illnesses,
                illness_days = illness_days + excluded.illness_days,
                injuries = injuries + excluded.injuries,
                injury_days = injury_days + excluded.injury_days
            `).run(
              row.rider_id,
              nextSeason,
              isIll ? 1 : 0,
              isIll ? newCondition.durationDays : 0,
              isIll ? 0 : 1,
              isIll ? 0 : newCondition.durationDays
            );
          }
        }
      }

      const phase = resolvePeakPhase(nextDate, peakDates);
      if (phase?.phase === 'decline' && phase.elapsedDays === 0) {
        activePeakDate = phase.peakDate;
        peakSForm = formBonus;
        peakRForm = roundFormBonus(Math.max(0, raceFormBonus));
      } else if (phase?.phase === 'decline') {
        activePeakDate = phase.peakDate;
        formBonus = resolveDeclineValue(peakSForm, phase.elapsedDays);
        raceFormBonus = resolveRaceDeclineValue(peakRForm, phase.elapsedDays);
        if (phase.elapsedDays >= SEASON_FORM_FALL_DAYS) {
          activePeakDate = null;
          peakSForm = 0;
          peakRForm = 0;
        }
      } else if (phase?.phase === 'build') {
        activePeakDate = null;
        peakSForm = 0;
        peakRForm = 0;
        // Aufbaufenster-Start = kanonischer actualBuildStartDay (fruehestens
        // Saisonstart bzw. Ende der Abbauphase des vorherigen Peaks), damit der
        // Formaufbau exakt auf denselben Fenstern laeuft wie die angezeigten
        // Peaks. Vorher wurde stur peak-56 (nur auf Saisonstart gedeckelt)
        // verwendet — dadurch lief der Aufbau auf anderen Daten.
        const seasonStart2Day = isoDateToDayNumber(`${nextSeason}-01-01`);
        const nextDayNum = isoDateToDayNumber(nextDate);
        const effectiveBuildStart = phase.actualBuildStartDay ?? Math.max(isoDateToDayNumber(phase.peakDate) - SEASON_FORM_RISE_DAYS, seasonStart2Day);
        if (nextDayNum >= effectiveBuildStart && healthStatus === 'healthy') {
          formBonus = roundFormBonus(Math.min(SEASON_FORM_MAX_RAW, formBonus + SEASON_FORM_RISE_STEP_RAW));
        } else if (nextDayNum < effectiveBuildStart) {
          formBonus = SEASON_FORM_MIN_RAW;
        }
      } else {
        activePeakDate = null;
        peakSForm = 0;
        peakRForm = 0;
        formBonus = 0;
        raceFormBonus = 0;
      }

      // Jahresstart: ALLE Fahrer beginnen bei 0 Season-Form. Die am 01.01. (vor
      // dem Draft, ohne Programme) nur zufaellig gesetzten Peaks duerfen noch
      // keinen Formaufbau ausloesen — die echten Peaks und der Aufbau werden
      // erst beim Draft-Abschluss gesetzt (realignAllSeasonFormPeaks).
      if (seasonChanged) {
        formBonus = 0;
        peakSForm = 0;
        peakRForm = 0;
        activePeakDate = null;
      }

      developmentContexts.push({
        riderId: row.rider_id,
        healthStatus,
        unavailableDaysRemaining: remainingDays,
        formPhase: phase?.phase ?? null,
        isInRaceToday: racingRiderIds.has(row.rider_id),
        isPeakStartDay: phase?.phase === 'decline' && phase.elapsedDays === 0,
        peakDate: phase?.peakDate ?? null,
      });

      // Daily Fatigue Decay / Season Resets
      let consecutiveNonRaceDays = row.consecutive_non_race_days ?? 0;
      if (seasonChanged) {
        consecutiveNonRaceDays = 0;
      } else if (racedYesterdayRiderIds.has(row.rider_id)) {
        consecutiveNonRaceDays = 0;
      } else {
        consecutiveNonRaceDays++;
      }

      let shortTermFatigue = row.short_term_fatigue ?? 0.0;
      let longTermDecayable = row.long_term_fatigue_decayable ?? 0.0;
      let longTermLocked = row.long_term_fatigue_locked ?? 0.0;

      let shortChange = 0;
      let longDecayableChange = 0;

      if (seasonChanged) {
        shortChange = -shortTermFatigue;
        longDecayableChange = -longTermDecayable;
        const longLockedChange = -longTermLocked;
        shortTermFatigue = 0.0;
        longTermDecayable = 0.0;
        longTermLocked = 0.0;

      } else {
        const oldShort = shortTermFatigue;
        const oldLongDecayable = longTermDecayable;

        const age = nextSeason - (row.birth_year ?? 0);
        let recoveryShort: number;
        let recoveryLong: number;

        if (consecutiveNonRaceDays >= 14) {
          const extraDays = consecutiveNonRaceDays - 14;
          if (age < 24) {
            const randShort = (Math.random() * 0.1) - 0.05; // -0.05 to 0.05
            recoveryShort = Math.min((0.3 + randShort) + extraDays * 0.01, 0.45);
            const randLong = (Math.random() * 0.01) - 0.005; // -0.005 to 0.005
            recoveryLong = Math.min((0.02 + randLong) + extraDays * 0.001, 0.025);
          } else {
            recoveryShort = Math.min(0.2 + extraDays * 0.01, 0.35);
            recoveryLong = Math.min(0.015 + extraDays * 0.001, 0.02);
          }
        } else {
          const R = row.skill_recuperation ?? 65;
          const decayMultiplier = 1 + (R - 65) * 0.01;
          recoveryShort = 0.2 * decayMultiplier;
          recoveryLong = 0.01 * decayMultiplier;
        }

        let shortTermMult = 1.0;
        let longTermMult = 1.0;

        if (consecutiveNonRaceDays >= 1) {
          shortTermMult = 1.25;
          longTermMult = 1.15;
        } else {
          const stageScore = racedYesterdayMap.get(row.rider_id) ?? 0;
          if (stageScore < 10) {
            shortTermMult = 1.20;
            longTermMult = 1.10;
          } else if (stageScore < 25) {
            shortTermMult = 1.15;
            longTermMult = 1.05;
          } else if (stageScore < 50) {
            shortTermMult = 1.05;
            longTermMult = 1.00;
          } else {
            shortTermMult = 1.00;
            longTermMult = 1.00;
          }
        }

        recoveryShort *= shortTermMult;
        recoveryLong *= longTermMult;

        // Double fatigue recovery in November and December
        const month = nextDate.slice(5, 7);
        if (month === '11' || month === '12') {
          recoveryShort *= 2.0;
          recoveryLong *= 2.0;
        }

        shortTermFatigue = Math.max(0.0, shortTermFatigue - recoveryShort);
        longTermDecayable = Math.max(0.0, longTermDecayable - recoveryLong);

        shortTermFatigue = roundToThreeDecimals(shortTermFatigue);
        longTermDecayable = roundToThreeDecimals(longTermDecayable);

        shortChange = roundToThreeDecimals(shortTermFatigue - oldShort);
        longDecayableChange = roundToThreeDecimals(longTermDecayable - oldLongDecayable);

      }

      // Skip the UPDATE if nothing actually changed. This saves ~5000 redundant
      // row updates on quiet days where most riders have stable state.
      const roundedFormBonus = roundFormBonus(formBonus);
      const roundedPeakSForm = roundFormBonus(peakSForm);
      const peakDatesJson = JSON.stringify(peakDates);
      if (
        seasonChanged
        || row.form_bonus !== roundedFormBonus
        || row.race_form_bonus !== raceFormBonus
        || row.peak_s_form !== roundedPeakSForm
        || row.peak_r_form !== peakRForm
        || row.active_peak_date !== activePeakDate
        || row.peak_dates_json !== peakDatesJson
        || row.health_status !== healthStatus
        || row.unavailable_until !== unavailableUntil
        || row.unavailable_days_remaining !== remainingDays
        || row.short_term_fatigue !== shortTermFatigue
        || row.long_term_fatigue_decayable !== longTermDecayable
        || row.long_term_fatigue_locked !== longTermLocked
        || row.consecutive_non_race_days !== consecutiveNonRaceDays
      ) {
        updates.push([
          nextSeason,
          roundedFormBonus,
          raceFormBonus,
          roundedPeakSForm,
          peakRForm,
          activePeakDate,
          peakDatesJson,
          healthStatus,
          unavailableUntil,
          remainingDays,
          shortTermFatigue,
          longTermDecayable,
          longTermLocked,
          consecutiveNonRaceDays,
          row.rider_id,
        ]);
      }
    }

    if (updates.length > 0) {
      this.db.transaction(() => {
        for (const u of updates) {
          updateState.run(...u);
        }
      })();
    }

    if (seasonChangedRiderIds.length > 0) {
      const resetSeasonStats = this.db.prepare(`
        UPDATE rider_daily_state
        SET season_points = 0,
            season_wins = 0,
            season_ttt_wins = 0,
            season_race_days_total = 0,
            rolling_30d_race_days = 0
        WHERE rider_id = ?
      `);

      // Use one prepared statement inside a tight loop instead of building a
      // giant IN(...) query; SQLite is happy with this when bound individually.
      for (const riderId of seasonChangedRiderIds) {
        deleteFormEvents.run(riderId);
        resetSeasonStats.run(riderId);
      }

      if (this.isTable('rider_form_history')) {
        this.db.prepare('DELETE FROM rider_form_history').run();
      }
      if (this.isTable('rider_fatigue_history')) {
        this.db.prepare('DELETE FROM rider_fatigue_history').run();
      }
    }

    // Retention policy: delete rider_fatigue_history entries older than 30 days
    if (this.isTable('rider_fatigue_history')) {
      this.db.prepare(`
        DELETE FROM rider_fatigue_history
        WHERE date < date(?, '-30 days')
      `).run(nextDate);
    }

    this.syncDailyFormHistory(nextDate);

    new RiderDevelopmentService(this.db).advanceDailyDevelopment(nextDate, nextSeason, developmentContexts);
  }

  private syncRiderLoadState(currentDate: string, currentSeason: number): void {
    if (!this.isTable('rider_daily_state') || !this.isTable('rider_season_stats')) {
      return;
    }

    this.db.prepare(`
      UPDATE rider_daily_state
      SET season_race_days_total = COALESCE((
        SELECT race_days
        FROM rider_season_stats
        WHERE rider_season_stats.rider_id = rider_daily_state.rider_id
          AND rider_season_stats.season = ?
      ), 0),
      rolling_30d_race_days = 0
    `).run(currentSeason);

    // season_wins wird nicht mehr taeglich per Voll-Aggregation neu berechnet
    // (die alte CTE joinete gegen die all_stage_entries-View und kostete ~370ms
    // pro Aufruf — und verlor Siege bereits kompaktierter Rennen, weil sie nur
    // die Live-Tabelle `results` zaehlte). Stattdessen wird season_wins beim
    // Ergebnis-Commit inkrementell gepflegt (StageResultCommitService) und beim
    // Laden alter Saves einmalig korrekt aufgefuellt (backfillSeasonWinsV2).
  }


  private removeExpiredRaceFormEvents(currentDate: string): void {
    if (tableExists(this.db, 'rider_r_form_events')) {
      this.db.prepare('DELETE FROM rider_r_form_events WHERE expires_on <= ?').run(currentDate);
    }
    if (tableExists(this.db, 'rider_r_form_daily_awards')) {
      this.db.prepare('DELETE FROM rider_r_form_daily_awards WHERE award_date < ?').run(currentDate);
    }
  }

  private syncDailyFormHistory(currentDate: string): void {
    if (!this.isTable('rider_daily_state') || !this.isTable('rider_form_history') || !this.isTable('riders')) {
      return;
    }

    if (isWinterBreak(currentDate)) {
      return;
    }

    const isFirstDay = currentDate.endsWith('-01-01');
    const dayOfWeek = new Date(currentDate + 'T00:00:00Z').getUTCDay();
    if (!isFirstDay && dayOfWeek !== 0) {
      return;
    }

    // Single INSERT...SELECT with UPSERT. The aggregation and the write happen
    // in one statement instead of a per-rider JS loop.
    this.db.prepare(`
      INSERT INTO rider_form_history (
        rider_id, date, s_form, r_form, total_form, short_fatigue, long_fatigue, combined_fatigue
      )
      SELECT
        rds.rider_id,
        @date AS date,
        ROUND(MIN(@seasonFormMax, MAX(0, rds.form_bonus)) * 100) / 100 AS s_form,
        MIN(4.0, ROUND((COALESCE(SUM(rfe.amount), 0)) * 100) / 100) AS r_form,
        ROUND(MIN(@seasonFormMax, MAX(0, rds.form_bonus)) * 100) / 100
          + MIN(4.0, ROUND((COALESCE(SUM(rfe.amount), 0)) * 100) / 100)
          AS total_form,
        ROUND(rds.short_term_fatigue * 100) / 100 AS short_fatigue,
        ROUND((rds.long_term_fatigue_decayable + rds.long_term_fatigue_locked) * 100) / 100 AS long_fatigue,
        ROUND((rds.short_term_fatigue + rds.long_term_fatigue_decayable + rds.long_term_fatigue_locked) * 100) / 100 AS combined_fatigue
      FROM rider_daily_state rds
      JOIN riders ON riders.id = rds.rider_id
      LEFT JOIN rider_r_form_events rfe ON rfe.rider_id = rds.rider_id
      WHERE riders.active_team_id IS NOT NULL AND riders.is_retired = 0
      GROUP BY rds.rider_id, rds.form_bonus, rds.race_form_bonus, rds.short_term_fatigue, rds.long_term_fatigue_decayable, rds.long_term_fatigue_locked
      ON CONFLICT(rider_id, date) DO UPDATE SET
        s_form = excluded.s_form,
        r_form = excluded.r_form,
        total_form = excluded.total_form,
        short_fatigue = excluded.short_fatigue,
        long_fatigue = excluded.long_fatigue,
        combined_fatigue = excluded.combined_fatigue
    `).run({
      date: currentDate,
      seasonFormMax: SEASON_FORM_MAX_RAW,
    });
  }

  public applyRaceDayFormBonuses(raceDate: string, riderIds: number[]): void {
    if (riderIds.length === 0 || !tableExists(this.db, 'rider_daily_state')) {
      return;
    }

    this.ensureRiderFormTables();
    this.removeExpiredRaceFormEvents(raceDate);

    const uniqueRiderIds = [...new Set(riderIds)];
    const selectState = this.db.prepare(`
      SELECT rider_id, season, form_bonus, race_form_bonus, peak_s_form, peak_r_form, active_peak_date, peak_dates_json, health_status, unavailable_until, unavailable_days_remaining
      FROM rider_daily_state
      WHERE rider_id = ?
    `);
    const selectAward = this.db.prepare(`
      SELECT 1
      FROM rider_r_form_daily_awards
      WHERE rider_id = ? AND award_date = ?
    `);
    const insertAward = this.db.prepare(`
      INSERT INTO rider_r_form_daily_awards (rider_id, award_date, award_type)
      VALUES (?, ?, ?)
    `);
    const updateRaceForm = this.db.prepare(`
      UPDATE rider_daily_state
      SET race_form_bonus = ?
      WHERE rider_id = ?
    `);
    const insertFreeRaceForm = this.db.prepare(`
      INSERT INTO rider_r_form_events (rider_id, source_date, expires_on, amount, event_type)
      VALUES (?, ?, ?, ?, 'race_day')
    `);

    this.db.transaction(() => {
      for (const riderId of uniqueRiderIds) {
        const row = selectState.get(riderId) as RiderDailyStateRow | undefined;
        if (!row || row.health_status !== 'healthy' || row.unavailable_days_remaining > 0) {
          continue;
        }
        if (selectAward.get(riderId, raceDate)) {
          continue;
        }

        const peakDates = resolveSeasonPeakDates(parsePeakDates(row.peak_dates_json), row.season, this.db, riderId);
        const phase = resolvePeakPhase(raceDate, peakDates);
        
        let expiresOnIso = addDaysIso(raceDate, phase?.phase === 'build' ? BUILD_R_FORM_EXPIRY_DAYS : FREE_R_FORM_EXPIRY_DAYS);
        
        if (phase) {
          const peakPlus14 = addDaysIso(phase.peakDate, 14);
          if (isoDateToDayNumber(peakPlus14) < isoDateToDayNumber(expiresOnIso)) {
            expiresOnIso = peakPlus14;
          }
        }

        if (phase?.phase === 'build') {
          // Instead of updating the legacy column, insert a trackable event
          insertFreeRaceForm.run(riderId, raceDate, expiresOnIso, RACE_FORM_BUILD_STEP);
          insertAward.run(riderId, raceDate, 'build');
          continue;
        }

        if (phase == null) {
          insertFreeRaceForm.run(riderId, raceDate, expiresOnIso, RACE_FORM_FREE_STEP);
          insertAward.run(riderId, raceDate, 'free');
        }
      }
    })();
  }

  private runDailyChecks(currentDate: string): DailyCheckSummary {
    const row = this.db.prepare(
      'SELECT COUNT(DISTINCT race_id) AS count FROM stages WHERE date = ?',
    ).get(currentDate) as { count: number } | undefined;
    return {
      hasRaceToday: (row?.count ?? 0) > 0,
      racesTodayCount: row?.count ?? 0,
    };
  }

  private getPendingStages(currentDate: string): PendingStage[] {
    if (!tableExists(this.db, 'stages') || !tableExists(this.db, 'races')) {
      return [];
    }

    // Performance: kein LEFT JOIN auf die all_results-View (deren json_each-Zweig
    // entpackt bei jeder Query alle race_results_compact-Payloads, ~70ms).
    // Semantisch aequivalent: eine Etappe ist erledigt, wenn ein Tageswertungs-
    // Ergebnis in der Live-Tabelle liegt ODER das Rennen bereits kompaktiert
    // wurde (Kompaktierung passiert nur beim Rennabschluss, d.h. alle Etappen
    // sind dann gefahren).
    const hasResultsTable = tableExists(this.db, 'results');
    const hasCompactTable = tableExists(this.db, 'race_results_compact');
    const rows = hasResultsTable
      ? this.db.prepare(`
          SELECT
            stages.id AS stage_id,
            stages.race_id AS race_id,
            races.name AS race_name,
            stages.stage_number AS stage_number,
            stages.date AS date,
            stages.profile AS profile,
            stages.start_elevation AS start_elevation,
            stages.details_csv_file AS details_csv_file,
            races.is_stage_race AS is_stage_race
          FROM stages
          JOIN races ON races.id = stages.race_id
          WHERE stages.date = ?
            AND NOT EXISTS (
              SELECT 1 FROM results r
              WHERE r.stage_id = stages.id AND r.result_type_id = 1
            )
            ${hasCompactTable ? `AND NOT EXISTS (
              SELECT 1 FROM race_results_compact c
              WHERE c.race_id = stages.race_id
            )` : ''}
          ORDER BY races.id ASC, stages.stage_number ASC
        `).all(currentDate) as PendingStageRow[]
      : this.db.prepare(`
          SELECT
            stages.id AS stage_id,
            stages.race_id AS race_id,
            races.name AS race_name,
            stages.stage_number AS stage_number,
            stages.date AS date,
            stages.profile AS profile,
            stages.start_elevation AS start_elevation,
            stages.details_csv_file AS details_csv_file,
            races.is_stage_race AS is_stage_race
          FROM stages
          JOIN races ON races.id = stages.race_id
          WHERE stages.date = ?
          ORDER BY races.id ASC, stages.stage_number ASC
        `).all(currentDate) as PendingStageRow[];

    return rows.map((row: any) => ({
      stageId: row.stage_id,
      raceId: row.race_id,
      raceName: row.race_name,
      stageNumber: row.stage_number,
      date: row.date,
      profile: row.profile,
      startElevation: row.start_elevation,
      detailsCsvFile: row.details_csv_file,
      isStageRace: row.is_stage_race === 1,
    }));
  }

  private mapState(row: GameStateRow, dailyChecks = this.runDailyChecks(row.current_date)): GameState {
    return {
      currentDate:    row.current_date,
      season:         row.season,
      isGameOver:     row.is_game_over === 1,
      formattedDate:  formatDateForUi(row.current_date),
      hasRaceToday:   dailyChecks.hasRaceToday,
      racesTodayCount: dailyChecks.racesTodayCount,
      draftStatus:    (row.draft_status as any) ?? 'completed',
      draftCurrentPickNumber: row.draft_current_pick_number ?? 1,
      draftSeason:    row.draft_season ?? null,
      renewalSelectionPending: isRenewalSelectionPending(this.db),
    };
  }

  public applyStageFatigue(stageId: number, completedRiderIds: number[], dnfRiderIds: number[]): void {
    if (!this.isTable('rider_daily_state') || !this.isTable('rider_fatigue_history')) {
      return;
    }

    const stageRow = this.db.prepare(`
      SELECT s.id, s.stage_score, s.stage_number, r.name AS race_name, s.date,
             s.rolled_weather_id, w.effekt_fatigue_min, w.effekt_fatigue_max,
             r.category_id AS category_id
      FROM stages s
      JOIN races r ON r.id = s.race_id
      LEFT JOIN wetter w ON w.id = s.rolled_weather_id
      WHERE s.id = ?
    `).get(stageId) as {
      id: number;
      stage_score: number;
      stage_number: number;
      race_name: string;
      date: string;
      rolled_weather_id: number | null;
      effekt_fatigue_min: number | null;
      effekt_fatigue_max: number | null;
      category_id: number;
    } | undefined;

    if (!stageRow) {
      return;
    }

    const stageScore = stageRow.stage_score ?? 0;
    const stageNumber = stageRow.stage_number;
    const raceName = stageRow.race_name;
    const stageDate = stageRow.date;

    const participatedRiderIds = [...new Set([...completedRiderIds, ...dnfRiderIds])];
    if (participatedRiderIds.length === 0) {
      return;
    }

    const stmtSelect = this.db.prepare(`
      SELECT r.id, r.skill_recuperation, r.birth_year,
             rds.short_term_fatigue, rds.long_term_fatigue_decayable, rds.long_term_fatigue_locked,
             rds.season_race_days_total,
             t.is_player_team AS is_player_team
      FROM riders r
      LEFT JOIN rider_daily_state rds ON rds.rider_id = r.id
      LEFT JOIN teams t ON t.id = r.active_team_id
      WHERE r.id = ?
    `);

    const stmtUpdate = this.db.prepare(`
      UPDATE rider_daily_state
      SET short_term_fatigue = ?,
          long_term_fatigue_decayable = ?,
          long_term_fatigue_locked = ?,
          consecutive_non_race_days = 0
      WHERE rider_id = ?
    `);


    this.db.transaction(() => {
      for (const riderId of participatedRiderIds) {
        const row = stmtSelect.get(riderId) as {
          id: number;
          skill_recuperation: number;
          birth_year: number;
          short_term_fatigue: number | null;
          long_term_fatigue_decayable: number | null;
          long_term_fatigue_locked: number | null;
          season_race_days_total: number | null;
          is_player_team: number | null;
        } | undefined;

        if (!row) continue;

        let currentShort = row.short_term_fatigue ?? 0.0;
        let currentLongDecayable = row.long_term_fatigue_decayable ?? 0.0;
        const currentLongLocked = row.long_term_fatigue_locked ?? 0.0;

        // Apply newly started race additions if stageNumber === 1
        if (stageNumber === 1) {
          const transferShortChange = 0.5;
          const transferLongDecayableChange = 0.05;

          currentShort = roundToTwoDecimals(currentShort + transferShortChange);
          currentLongDecayable = roundToTwoDecimals(currentLongDecayable + transferLongDecayableChange);

          stmtUpdate.run(currentShort, currentLongDecayable, currentLongLocked, riderId);

        }

        const R = row.skill_recuperation;
        const multiplier = R >= 65
          ? 1 - (R - 65) * 0.02
          : 1 + (65 - R) * 0.02;

        let addedShort = stageScore >= 10 ? (stageScore / 100) * 0.55 * multiplier : 0;
        let addedLongDecayable = stageScore >= 10 ? (stageScore / 1000) * 0.75 * multiplier : 0;

        const age = Number(stageDate.slice(0, 4)) - row.birth_year;
        if (age >= 30 && age <= 34) {
          const reductionPercent = randomInteger(8, 12) / 100;
          addedShort *= (1 - reductionPercent);
          addedLongDecayable *= (1 - reductionPercent);
        } else if (age < 24) {
          const yearsUnder24 = 24 - age;
          let increasePerYearPercent: number;
          if (stageScore > 300) {
            increasePerYearPercent = 6 + (Math.random() * 6 - 3); // 6 +- 3%
          } else {
            increasePerYearPercent = 3 + (Math.random() * 4 - 2); // 3 +- 2%
          }
          const totalIncreasePercent = (increasePerYearPercent * yearsUnder24) / 100;
          addedShort *= (1 + totalIncreasePercent);
          addedLongDecayable *= (1 + totalIncreasePercent);
        }

        if (stageRow.rolled_weather_id != null) {
          const rolledEffektFatigue = getDeterministicWeatherEffect(
            stageRow.id,
            'fatigue',
            stageRow.effekt_fatigue_min ?? 0,
            stageRow.effekt_fatigue_max ?? 0
          );
          addedShort *= (1 + rolledEffektFatigue / 100);
          addedLongDecayable *= (1 + rolledEffektFatigue / 100);
        }

        // Apply category multipliers
        let shortMult = 1.0;
        let longMult = 1.0;
        const catId = stageRow.category_id;

        if (catId === 6 || catId === 9) {
          shortMult = 0.9;
          longMult = 0.9;
        } else if (catId === 5 || catId === 8) {
          shortMult = 0.95;
          longMult = 1.0;
        } else if (catId === 4 || catId === 7) {
          shortMult = 1.0;
          longMult = 1.1;
        } else if (catId === 3) {
          shortMult = 1.15;
          longMult = 1.25;
        } else if (catId === 2) {
          shortMult = 1.1;
          longMult = 1.15;
        } else if (catId === 1) {
          shortMult = 1.15;
          longMult = 1.3;
        }

        addedShort *= shortMult;
        addedLongDecayable *= longMult;

        let shortLimit = 2.5;
        let longLimit = 0.3;
        if (catId === 1 || catId === 3) {
          shortLimit = 3.0;
          longLimit = 0.4;
        } else if (catId === 2) {
          shortLimit = 2.8;
          longLimit = 0.35;
        } else if (catId === 4 || catId === 7) {
          shortLimit = 2.7;
          longLimit = 0.33;
        }

        addedShort = Math.min(shortLimit, addedShort);
        addedLongDecayable = Math.min(longLimit, addedLongDecayable);

        addedShort = roundToTwoDecimals(addedShort);
        addedLongDecayable = roundToTwoDecimals(addedLongDecayable);
        
        // n is season race days total. Note: refreshRiderLoadState already updated season_race_days_total
        // so it already includes the current stage!
        const n = row.season_race_days_total ?? 0;
        const addedLongLocked = resolveLockedFatigueAddition(n);

        const newShort = roundToTwoDecimals(currentShort + addedShort);
        const newLongDecayable = roundToTwoDecimals(currentLongDecayable + addedLongDecayable);
        const newLongLocked = roundToTwoDecimals(currentLongLocked + addedLongLocked);

        stmtUpdate.run(newShort, newLongDecayable, newLongLocked, riderId);

      }
    })();
  }

  private snapshotYearlyBaselineSkills(): void {
    console.log("Snapshotting active riders' skills as yearly baseline...");
    const riders = this.db.prepare(`
      SELECT id, overall_rating, skill_flat, skill_mountain, skill_medium_mountain, skill_hill,
             skill_time_trial, skill_prologue, skill_cobble, skill_sprint, skill_acceleration,
             skill_downhill, skill_attack, skill_stamina, skill_resistance, skill_recuperation,
             skill_bike_handling
      FROM riders
      WHERE is_retired = 0
    `).all() as any[];

    const update = this.db.prepare(`
      UPDATE riders
      SET yearly_baseline_skills = ?
      WHERE id = ?
    `);

    this.db.transaction(() => {
      for (const r of riders) {
        const baseline = {
          overall_rating: r.overall_rating,
          flat: r.skill_flat,
          mountain: r.skill_mountain,
          medium_mountain: r.skill_medium_mountain,
          hill: r.skill_hill,
          time_trial: r.skill_time_trial,
          prologue: r.skill_prologue,
          cobble: r.skill_cobble,
          sprint: r.skill_sprint,
          acceleration: r.skill_acceleration,
          downhill: r.skill_downhill,
          attack: r.skill_attack,
          stamina: r.skill_stamina,
          resistance: r.skill_resistance,
          recuperation: r.skill_recuperation,
          bike_handling: r.skill_bike_handling,
        };
        update.run(JSON.stringify(baseline), r.id);
      }
    })();
  }

  /**
   * Leitet die Season-Form-Peaks ALLER Fahrer mit Tageszustand neu aus ihren
   * (frisch zugewiesenen) Rennprogrammen ab und setzt die Form passend zum
   * aktuellen Datum. Wird nach der Rollen-/Programmvergabe beim Draft-Abschluss
   * aufgerufen, damit die Peaks zur neuen Saison und zum Programm passen.
   */
  private realignAllSeasonFormPeaks(season: number, currentDate: string): void {
    if (!this.isTable('rider_daily_state')) {
      return;
    }
    // Frisch verknuepfte Programme: Peak-Fenster-Cache invalidieren.
    this.programWindowsBySeason.clear();

    const rows = this.db.prepare('SELECT rider_id FROM rider_daily_state').all() as Array<{ rider_id: number }>;
    const update = this.db.prepare(`
      UPDATE rider_daily_state
      SET season = ?, form_bonus = ?, peak_s_form = ?, active_peak_date = ?, peak_dates_json = ?
      WHERE rider_id = ?
    `);

    this.db.transaction(() => {
      for (const row of rows) {
        // [] erzwingt die Neuableitung aus dem aktuellen Programm (Highlight-Rennen).
        const peakDates = resolveSeasonPeakDatesFromWindows([], season, null, this.db, row.rider_id);
        const phase = resolvePeakPhase(currentDate, peakDates);
        let formBonus = 0;
        let peakSForm = 0;
        let activePeakDate: string | null = null;
        if (phase?.phase === 'build') {
          formBonus = scheduledBuildForm(currentDate, phase.actualBuildStartDay, phase.peakDate);
        } else if (phase?.phase === 'decline') {
          peakSForm = scheduledPeakForm(phase.peakDate, phase.actualBuildStartDay);
          formBonus = resolveDeclineValue(peakSForm, phase.elapsedDays);
          activePeakDate = phase.peakDate;
        }
        update.run(
          season,
          roundFormBonus(formBonus),
          roundFormBonus(peakSForm),
          activePeakDate,
          JSON.stringify(peakDates),
          row.rider_id,
        );
      }
    })();

    // Leutnants erben die frischen Peaks ihrer Kapitaene.
    this.syncLieutenantPeakState(season);
  }

  public completeDraftAndInitializeSeason(season: number, nextDate: string): void {
    this.db.transaction(() => {
      new ContractService(this.db).checkContractStatuses(season); // activate new draft contracts
      new RiderDevelopmentService(this.db).recalculateSpecializations(season);
      new RiderRoleService(this.db).recalculateAllTeamRoles();
      new RiderProgramService(this.db).ensureSeasonPrograms(season, nextDate);

      // Newgens für die nächste Saison erzeugen
      new RiderNewgenService(this.db).createYearStartNewgens(season);
      new RiderDevelopmentService(this.db).initializeRiders(season);

      // Skill-Development aller aktiven Fahrer neu auswürfeln (±3, max 20, min 1)
      this.db.prepare(`
        UPDATE riders
        SET skill_development = MAX(1, MIN(20, skill_development + CAST((ABS(RANDOM()) % 7) - 3 AS INTEGER)))
        WHERE is_retired = 0 AND skill_development > 0
      `).run();

      // Snapshot der Fahrer-Werte als Baseline für die Saison in der UI abspeichern
      this.snapshotYearlyBaselineSkills();

      // Initialize rider daily states for newly drafted riders
      this.ensureRiderDailyStateRows(season);

      // Season-Form-Peaks JETZT — nach der Rollen- und Programmvergabe — fuer alle
      // Fahrer aus ihrem frisch zugewiesenen Rennprogramm neu ableiten. Die am
      // 01.01. (vor dem Draft, ohne Programme) gesetzten Peaks waren nur zufaellig;
      // hier greift die korrekte Reihenfolge Rollen -> Programme -> Peaks.
      this.realignAllSeasonFormPeaks(season, nextDate);

      // Set draft_status to completed
      this.db.prepare(`
        UPDATE game_state
        SET draft_status = 'completed',
            draft_season = NULL
        WHERE id = 1
      `).run();
    })();
  }
}

function addDaysIso(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function resolveSeason(nextDate: string, currentSeason: number): number {
  const year = Number(nextDate.slice(0, 4));
  return year > currentSeason ? year : currentSeason;
}

function formatDateForUi(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(date);
}

function parsePeakDates(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((entry: any): entry is string => typeof entry === 'string') : [];
  } catch {
    return [];
  }
}

function roundFormBonus(value: number): number {
  return Math.round(value * 100) / 100;
}

function isoDateToDayNumber(isoDate: string): number {
  return Math.floor(new Date(`${isoDate}T00:00:00.000Z`).getTime() / 86400000);
}

// Kanonische Formphasen-Aufloesung — identisch zu resolvePeakPhase in
// db/mappers.ts, das die im Chart gezeichnete Formkurve speist. WICHTIG: Peaks
// werden sortiert betrachtet und das Aufbaufenster startet fruehestens am
// Saisonanfang bzw. am Ende der Abbauphase des vorherigen Peaks (prevDeclineEnd).
// Frueher lief die Spiel-Logik auf einer vereinfachten Variante (Aufbau stur
// peak-56, unsortiert) — dadurch liefen Formaufbau/-abbau auf anderen Fenstern
// als die angezeigten Peaks.
function resolvePeakPhase(currentDate: string, peakDates: string[]): { phase: 'build' | 'decline'; peakDate: string; elapsedDays: number; actualBuildStartDay?: number } | null {
  const currentDay = isoDateToDayNumber(currentDate);
  const sortedPeaks = [...peakDates].sort((a, b) => isoDateToDayNumber(a) - isoDateToDayNumber(b));

  for (let i = 0; i < sortedPeaks.length; i++) {
    const peakDate = sortedPeaks[i];
    const peakDay = isoDateToDayNumber(peakDate);
    const prevPeakDay = i > 0 ? isoDateToDayNumber(sortedPeaks[i - 1]) : Number.NEGATIVE_INFINITY;

    if (currentDay >= peakDay && currentDay < peakDay + SEASON_FORM_FALL_DAYS) {
      return { phase: 'decline', peakDate, elapsedDays: currentDay - peakDay };
    }

    const seasonYear = peakDate.slice(0, 4);
    const seasonStartDay = isoDateToDayNumber(`${seasonYear}-01-01`);
    const idealBuildStart = Math.max(seasonStartDay, peakDay - SEASON_FORM_RISE_DAYS);
    const prevDeclineEnd = prevPeakDay + SEASON_FORM_FALL_DAYS;
    const actualBuildStartDay = Math.max(idealBuildStart, prevDeclineEnd);

    if (currentDay >= actualBuildStartDay && currentDay < peakDay) {
      return { phase: 'build', peakDate, elapsedDays: peakDay - currentDay, actualBuildStartDay };
    }
  }

  return null;
}

// Plan-Formwert am Peak = Anzahl Aufbautage (Fensterstart..Peak) * Aufbauschritt,
// gedeckelt auf das Maximum. Fruehe Peaks (Fenster durch Saisonstart gekuerzt)
// erreichen dadurch bewusst nicht die volle Form.
function scheduledPeakForm(peakDate: string, actualBuildStartDay: number | undefined): number {
  const peakDay = isoDateToDayNumber(peakDate);
  const startDay = actualBuildStartDay ?? (peakDay - SEASON_FORM_RISE_DAYS);
  return roundFormBonus(Math.min(SEASON_FORM_MAX_RAW, Math.max(SEASON_FORM_MIN_RAW, (peakDay - startDay) * SEASON_FORM_RISE_STEP_RAW)));
}

// Plan-Formwert an einem Tag innerhalb der Aufbauphase.
function scheduledBuildForm(currentDate: string, actualBuildStartDay: number | undefined, peakDate: string): number {
  const peakDay = isoDateToDayNumber(peakDate);
  const startDay = actualBuildStartDay ?? (peakDay - SEASON_FORM_RISE_DAYS);
  const daysBuilt = isoDateToDayNumber(currentDate) - startDay + 1;
  return roundFormBonus(Math.min(SEASON_FORM_MAX_RAW, Math.max(SEASON_FORM_MIN_RAW, daysBuilt * SEASON_FORM_RISE_STEP_RAW)));
}

function resolveDeclineValue(peakValue: number, elapsedDays: number): number {
  if (elapsedDays >= SEASON_FORM_FALL_DAYS) {
    return 0;
  }

  const boundedPeakValue = Math.min(SEASON_FORM_MAX_RAW, Math.max(0, peakValue));
  return roundFormBonus(Math.max(0, boundedPeakValue * (1 - (elapsedDays / SEASON_FORM_FALL_DAYS))));
}

function resolveBuildValue(elapsedDays: number): number {
  return roundFormBonus(
    Math.min(
      SEASON_FORM_MAX_RAW,
      Math.max(0, (SEASON_FORM_RISE_DAYS - elapsedDays + 1) * SEASON_FORM_RISE_STEP_RAW),
    ),
  );
}

function resolveRaceDeclineValue(peakValue: number, elapsedDays: number): number {
  if (elapsedDays >= SEASON_FORM_FALL_DAYS) {
    return 0;
  }

  return roundFormBonus(Math.max(0, peakValue * (1 - (elapsedDays / SEASON_FORM_FALL_DAYS))));
}

function resolveEffectiveSeasonForm(rawSeasonForm: number): number {
  return roundFormBonus(Math.min(SEASON_FORM_MAX_RAW, Math.max(0, rawSeasonForm)));
}

type ProgramPeakWindows = {
  peak1Min: number;
  peak1Max: number;
  peak2Min: number;
  peak2Max: number;
  peak3Min: number;
  peak3Max: number;
};

function isoWeekStartDayNumber(season: number, isoWeek: number): number {
  const jan4 = new Date(Date.UTC(season, 0, 4));
  const jan4Weekday = jan4.getUTCDay() || 7;
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - jan4Weekday + 1);
  week1Monday.setUTCDate(week1Monday.getUTCDate() + ((isoWeek - 1) * 7));
  return Math.floor(week1Monday.getTime() / 86400000);
}

function resolveIsoWeekDayBounds(season: number, minWeek: number, maxWeek: number): { startDay: number; endDay: number } {
  const seasonStartDay = isoDateToDayNumber(`${season}-01-01`);
  const seasonEndDay = isoDateToDayNumber(`${season}-12-31`);
  const rangeStartDay = isoWeekStartDayNumber(season, minWeek);
  const rangeEndDay = isoWeekStartDayNumber(season, maxWeek) + 6;
  return {
    startDay: Math.max(seasonStartDay, rangeStartDay),
    endDay: Math.min(seasonEndDay, rangeEndDay),
  };
}

function loadProgramPeakWindows(db: Database.Database | undefined, season: number, riderId: number | undefined): ProgramPeakWindows | null {
  return null;
}

/**
 * Bulk-load all program peak windows for the given season in a single query.
 * Returns a Map keyed by rider_id. This is the N+1 fix for `loadProgramPeakWindows`.
 */
function loadProgramPeakWindowsForSeason(
  db: Database.Database,
  season: number,
): Map<number, ProgramPeakWindows> {
  return new Map<number, ProgramPeakWindows>();
}

function generateProgramSeasonPeakDates(season: number, windows: ProgramPeakWindows): string[] {
  const ranges = [
    resolveIsoWeekDayBounds(season, windows.peak1Min, windows.peak1Max),
    resolveIsoWeekDayBounds(season, windows.peak2Min, windows.peak2Max),
    resolveIsoWeekDayBounds(season, windows.peak3Min, windows.peak3Max),
  ];

  const randomAttempts = 1000;
  for (let attempt = 0; attempt < randomAttempts; attempt += 1) {
    const picked: number[] = [];
    let valid = true;

    for (const range of ranges) {
      const candidate = randomInteger(range.startDay, range.endDay);
      if (picked.some((existing: any) => Math.abs(existing - candidate) < PEAK_MIN_SPACING_DAYS)) {
        valid = false;
        break;
      }
      picked.push(candidate);
    }

    if (valid) {
      return picked.sort((left: any, right: any) => left - right).map(dayNumberToIsoDate);
    }
  }

  const picked: number[] = [];
  for (const range of ranges) {
    let bestCandidate: number | null = null;
    let bestDistance = -1;
    const target = Math.floor((range.startDay + range.endDay) / 2);
    for (let candidate = range.startDay; candidate <= range.endDay; candidate += 1) {
      const minDistance = picked.length === 0
        ? Number.POSITIVE_INFINITY
        : Math.min(...picked.map((existing: any) => Math.abs(existing - candidate)));
      if (picked.length > 0 && minDistance < PEAK_MIN_SPACING_DAYS) {
        continue;
      }
      const score = (minDistance * 10) - Math.abs(candidate - target);
      if (score > bestDistance) {
        bestDistance = score;
        bestCandidate = candidate;
      }
    }

    if (bestCandidate == null) {
      break;
    }

    picked.push(bestCandidate);
  }

  if (picked.length === 3) {
    return picked.sort((left: any, right: any) => left - right).map(dayNumberToIsoDate);
  }

  const seasonStartDay = isoDateToDayNumber(`${season}-01-01`);
  const seasonEndDay = isoDateToDayNumber(`${season}-12-31`);
  const targetDays = ranges.map((range: any) => Math.floor((range.startDay + range.endDay) / 2));
  const fallbackPicked: number[] = [];
  for (const targetDay of targetDays) {
    let bestCandidate: number | null = null;
    let bestDistance = -1;
    for (let candidate = seasonStartDay; candidate <= seasonEndDay; candidate += 1) {
      const minDistance = fallbackPicked.length === 0
        ? Number.POSITIVE_INFINITY
        : Math.min(...fallbackPicked.map((existing: any) => Math.abs(existing - candidate)));
      if (fallbackPicked.length > 0 && minDistance < PEAK_MIN_SPACING_DAYS) {
        continue;
      }
      const score = (minDistance * 10) - Math.abs(candidate - targetDay);
      if (score > bestDistance) {
        bestDistance = score;
        bestCandidate = candidate;
      }
    }

    if (bestCandidate == null) {
      return generateSeasonPeakDates(season);
    }
    fallbackPicked.push(bestCandidate);
  }

  return fallbackPicked.sort((left: any, right: any) => left - right).map(dayNumberToIsoDate);
}

function isWithinDayRange(isoDate: string, range: { startDay: number; endDay: number }): boolean {
  const day = isoDateToDayNumber(isoDate);
  return day >= range.startDay && day <= range.endDay;
}

function generateSeasonPeakDates(season: number): string[] {
  const firstPeakWindowStart = isoDateToDayNumber(`${season}-02-15`);
  const lastPeakWindowEnd = isoDateToDayNumber(`${season}-10-05`);
  const peakDays: number[] = [];
  let attempts = 0;

  while (peakDays.length < 3 && attempts < 500) {
    const candidate = firstPeakWindowStart + Math.floor(Math.random() * (lastPeakWindowEnd - firstPeakWindowStart + 1));
    if (peakDays.every((existing: any) => Math.abs(existing - candidate) >= PEAK_MIN_SPACING_DAYS)) {
      peakDays.push(candidate);
    }
    attempts += 1;
  }

  if (peakDays.length < 3) {
    const fallback = [firstPeakWindowStart + 10, firstPeakWindowStart + 90, firstPeakWindowStart + 170];
    peakDays.splice(0, peakDays.length, ...fallback);
  }

  return peakDays
    .sort((left: any, right: any) => left - right)
    .slice(0, 3)
    .map(dayNumberToIsoDate);
}

function resolveSeasonPeakDates(peakDates: string[], season: number, db?: Database.Database, riderId?: number): string[] {
  const programWindows = loadProgramPeakWindows(db, season, riderId);
  return resolveSeasonPeakDatesFromWindows(peakDates, season, programWindows, db, riderId);
}

type PeakRaceCandidate = { id: number; prestige: number; startDay: number; qualifies: boolean };

// Greedy: nimmt die Rennen mit dem hoechsten Prestige zuerst und ueberspringt
// jedes, das den Mindestabstand zu einem bereits gewaehlten Peak verletzt
// ("das naechst bessere Rennen"). `pool` muss nach Prestige absteigend sortiert
// sein. `into` erlaubt das Auffuellen einer bereits teilweise gewaehlten Liste.
function pickPeaksByPrestige(
  pool: PeakRaceCandidate[],
  need: number,
  minSpacingDays: number,
  into: PeakRaceCandidate[] = [],
): PeakRaceCandidate[] {
  const chosen = [...into];
  for (const race of pool) {
    if (chosen.length >= need) break;
    if (chosen.some((c) => c.id === race.id)) continue;
    if (chosen.every((c) => Math.abs(c.startDay - race.startDay) >= minSpacingDays)) {
      chosen.push(race);
    }
  }
  return chosen;
}

// Zufaellig: fuellt die Peak-Liste aus dem Pool auf, solange der Mindestabstand
// eingehalten wird. Wird fuer die Fallbacks (Top-15-Prestige bzw. alle Rennen)
// genutzt.
function pickPeaksRandomly(
  pool: PeakRaceCandidate[],
  need: number,
  minSpacingDays: number,
  into: PeakRaceCandidate[] = [],
): PeakRaceCandidate[] {
  const chosen = [...into];
  while (chosen.length < need) {
    const candidates = pool.filter(
      (race) => !chosen.some((c) => c.id === race.id)
        && chosen.every((c) => Math.abs(c.startDay - race.startDay) >= minSpacingDays),
    );
    if (candidates.length === 0) break;
    chosen.push(candidates[Math.floor(Math.random() * candidates.length)]);
  }
  return chosen;
}

// Verschiebt jeden Peak um ±14 Tage (wie bisher) und stellt anschliessend den
// Mindestabstand zwischen den Peaks sicher.
function finalizePeakDates(picked: PeakRaceCandidate[]): string[] {
  const days = picked
    .map((race) => race.startDay + (Math.floor(Math.random() * 29) - 14))
    .sort((a, b) => a - b);
  for (let i = 1; i < days.length; i += 1) {
    if (days[i] - days[i - 1] < PEAK_MIN_SPACING_DAYS) {
      days[i] = days[i - 1] + PEAK_MIN_SPACING_DAYS;
    }
  }
  return days.map(dayNumberToIsoDate);
}

function matchesProgramRaces(db: Database.Database | undefined, riderId: number | undefined, season: number, peakDates: string[]): boolean {
  if (!db || riderId == null) return true;
  if (!tableExists(db, 'rider_season_programs') || !tableExists(db, 'race_program_races') || !tableExists(db, 'races')) {
    return true;
  }
  try {
    const rows = db.prepare(`
      SELECT r.start_date, r.end_date, r.is_stage_race
      FROM rider_season_programs rsp
      JOIN race_program_races rpr ON rpr.program_id = rsp.program_id
      JOIN races r ON r.id = rpr.race_id
      JOIN riders ON riders.id = rsp.rider_id
      JOIN sta_country ON sta_country.id = riders.country_id
      WHERE rsp.rider_id = ? AND rsp.season = ?
        AND substr(r.start_date, 1, 4) = ?
        AND (
          rpr.allowed_program_group_ids IS NULL
          OR rpr.allowed_program_group_ids = ''
          OR ('|' || rpr.allowed_program_group_ids || '|') LIKE ('%|' || sta_country.program_group_id || '|%')
        )
    `).all(riderId, season, String(season)) as Array<{ start_date: string; end_date: string; is_stage_race: number }>;

    if (rows.length < 3) return false;
    const raceDays = rows.map(r => {
      let startDay = isoDateToDayNumber(r.start_date);
      if (r.is_stage_race === 1 && r.end_date) {
        const endDay = isoDateToDayNumber(r.end_date);
        if (!isNaN(endDay)) {
          startDay = Math.floor((startDay + endDay) / 2);
        }
      }
      return startDay;
    }).filter(d => !isNaN(d));
    const peakDays = peakDates.map(d => isoDateToDayNumber(d));

    const used = new Set<number>();
    const match = (idx: number): boolean => {
      if (idx === peakDays.length) return true;
      for (let i = 0; i < raceDays.length; i++) {
        if (!used.has(i) && Math.abs(peakDays[idx] - raceDays[i]) <= 14) {
          used.add(i);
          if (match(idx + 1)) return true;
          used.delete(i);
        }
      }
      return false;
    };
    return match(0);
  } catch {
    return false;
  }
}

function generateHighlightBasedPeakDates(
  db: Database.Database,
  riderId: number,
  season: number,
  programWindows: ProgramPeakWindows | null
): string[] | null {
  if (!tableExists(db, 'rider_season_programs') || !tableExists(db, 'race_program_races') || !tableExists(db, 'races')) {
    return null;
  }
  try {
    // Je Programmrennen: Prestige, Kategorie und der OVR-Rang des Fahrers im
    // Teilnehmerfeld seines Teams (= Teamkollegen mit demselben Rennen im
    // Programm). teammates_stronger = Anzahl staerkerer Teamkollegen; Rang =
    // teammates_stronger + 1.
    const rows = db.prepare(`
      SELECT r.id, r.start_date, r.end_date, r.is_stage_race, r.prestige, r.category_id,
        (
          SELECT COUNT(*)
          FROM rider_season_programs rsp2
          JOIN race_program_races rpr2 ON rpr2.program_id = rsp2.program_id AND rpr2.race_id = r.id
          JOIN riders ri2 ON ri2.id = rsp2.rider_id
          JOIN sta_country c2 ON c2.id = ri2.country_id
          WHERE rsp2.season = ?
            AND me.active_team_id IS NOT NULL
            AND ri2.active_team_id = me.active_team_id
            AND ri2.is_retired = 0
            AND ri2.overall_rating > me.overall_rating
            AND (
              rpr2.allowed_program_group_ids IS NULL
              OR rpr2.allowed_program_group_ids = ''
              OR ('|' || rpr2.allowed_program_group_ids || '|') LIKE ('%|' || c2.program_group_id || '|%')
            )
        ) AS teammates_stronger
      FROM rider_season_programs rsp
      JOIN race_program_races rpr ON rpr.program_id = rsp.program_id
      JOIN races r ON r.id = rpr.race_id
      JOIN riders me ON me.id = rsp.rider_id
      JOIN sta_country ON sta_country.id = me.country_id
      WHERE rsp.rider_id = ? AND rsp.season = ?
        AND substr(r.start_date, 1, 4) = ?
        AND (
          rpr.allowed_program_group_ids IS NULL
          OR rpr.allowed_program_group_ids = ''
          OR ('|' || rpr.allowed_program_group_ids || '|') LIKE ('%|' || sta_country.program_group_id || '|%')
        )
    `).all(season, riderId, season, String(season)) as Array<{
      id: number; start_date: string; end_date: string; is_stage_race: number;
      prestige: number; category_id: number; teammates_stronger: number;
    }>;

    if (rows.length < 3) {
      return null;
    }

    const races: PeakRaceCandidate[] = rows
      .map((row) => {
        let startDay = isoDateToDayNumber(row.start_date);
        if (row.is_stage_race === 1 && row.end_date) {
          const endDay = isoDateToDayNumber(row.end_date);
          if (!isNaN(endDay)) {
            startDay = Math.floor((startDay + endDay) / 2);
          }
        }
        const topN = row.category_id === TOUR_DE_FRANCE_CATEGORY_ID
          ? PEAK_QUALIFY_TOP_N_TDF
          : PEAK_QUALIFY_TOP_N;
        return {
          id: row.id,
          prestige: row.prestige,
          startDay,
          qualifies: (row.teammates_stronger + 1) <= topN,
        };
      })
      .filter((r) => !isNaN(r.startDay));

    // Prestige absteigend (bei Gleichstand frueheres Rennen, dann ID) — so nimmt
    // die Auswahl immer "das naechst bessere Rennen".
    races.sort((a, b) => b.prestige - a.prestige || a.startDay - b.startDay || a.id - b.id);

    // 1) Primaer: nur Rennen, bei denen der Fahrer im Team-Rang unter der Grenze
    //    liegt, hoechstes Prestige zuerst, Mindestabstand eingehalten.
    const qualified = races.filter((r) => r.qualifies);
    let picked = pickPeaksByPrestige(qualified, 3, PEAK_MIN_SPACING_DAYS);

    // 2) Reichen die qualifizierten Rennen nicht fuer drei Peaks, zufaellig aus
    //    den Top-15-Prestige-Rennen auffuellen.
    if (picked.length < 3) {
      picked = pickPeaksRandomly(races.slice(0, PEAK_PRESTIGE_POOL_SIZE), 3, PEAK_MIN_SPACING_DAYS, picked);
    }

    // 3) Immer noch keine drei Peaks: auf alle Rennen des Fahrers erweitern.
    if (picked.length < 3) {
      picked = pickPeaksRandomly(races, 3, PEAK_MIN_SPACING_DAYS, picked);
    }

    if (picked.length === 3) {
      return finalizePeakDates(picked);
    }
  } catch (err) {
    console.error(`Error generating highlight-based peaks for rider ${riderId}:`, err);
  }
  return null;
}

/**
 * Like `resolveSeasonPeakDates` but takes pre-loaded program windows for the rider,
 * avoiding an N+1 query against `rider_season_programs` / `race_programs`.
 */
function resolveSeasonPeakDatesFromWindows(
  peakDates: string[],
  season: number,
  programWindows: ProgramPeakWindows | null,
  db?: Database.Database,
  riderId?: number,
): string[] {
  const normalized = [...new Set(peakDates)]
    .filter((peakDate: any) => peakDate.startsWith(`${season}-`))
    .sort((left: any, right: any) => isoDateToDayNumber(left) - isoDateToDayNumber(right));

  if (normalized.length !== 3) {
    if (db && riderId != null) {
      const generated = generateHighlightBasedPeakDates(db, riderId, season, programWindows);
      if (generated) return generated;
    }
    return programWindows ? generateProgramSeasonPeakDates(season, programWindows) : generateSeasonPeakDates(season);
  }

  const hasValidSpacing = normalized.every((peakDate: any, index: any) => {
    if (index === 0) {
      return true;
    }

    const previousPeak = normalized[index - 1];
    return isoDateToDayNumber(peakDate) - isoDateToDayNumber(previousPeak) >= PEAK_MIN_SPACING_DAYS;
  });

  // WICHTIG: Sind bereits 3 gueltig verteilte Peaks der laufenden Saison
  // gespeichert, werden sie BEHALTEN — auch wenn sie (noch) nicht exakt an
  // Programmrennen liegen. Frueher wurde hier zusaetzlich matchesProgramRaces
  // geprueft und bei Fehlschlag jeden Tag neu (zufaellig) gewuerfelt; fehlten
  // die Programm-Verknuepfungen (alte Saves), driftete das Aufbaufenster
  // taeglich und die Season-Form baute nie auf. Die Ausrichtung an
  // Programmrennen passiert jetzt gezielt bei der Neuvergabe (Saisonwechsel,
  // Draft-Abschluss, Programm-Reparatur), nicht mehr im Tageslauf.
  if (hasValidSpacing) {
    return normalized;
  }

  if (db && riderId != null) {
    const generated = generateHighlightBasedPeakDates(db, riderId, season, programWindows);
    if (generated) return generated;
  }
  return programWindows ? generateProgramSeasonPeakDates(season, programWindows) : generateSeasonPeakDates(season);
}

function dayNumberToIsoDate(dayNumber: number): string {
  return new Date(dayNumber * 86400000).toISOString().slice(0, 10);
}

function rollDailyCondition(currentDate: string): { status: 'ill' | 'injured'; durationDays: number } | null {
  if (Math.random() < ILLNESS_CHANCE) {
    return {
      status: 'ill',
      durationDays: randomInteger(1, 14),
    };
  }

  if (Math.random() < INJURY_CHANCE) {
    const isLongInjury = Math.random() < 0.1;
    return {
      status: 'injured',
      durationDays: isLongInjury ? randomInteger(6, 30) : randomInteger(2, 14),
    };
  }

  return null;
}

function randomInteger(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

function resolveLockedFatigueAddition(n: number): number {
  if (n < 30) return 0.0;
  if (n < 40) return 0.01;
  if (n < 50) return 0.02;
  if (n <= 60) return 0.03;
  if (n <= 70) return 0.04;
  if (n <= 80) return 0.05;
  if (n <= 90) return 0.06;
  if (n <= 100) return 0.08;
  if (n <= 110) return 0.10;
  if (n <= 120) return 0.13;
  if (n <= 130) return 0.17;
  if (n <= 140) return 0.22;
  return 0.28;
}

function roundToThreeDecimals(value: number): number {
  return Math.round(value * 1000) / 1000;
}
