import Database from 'better-sqlite3';
import { tableExists } from '../db/mappers';
import { readStageScoreSegments } from '../bootstrapper';
import { calculateClimbScoresForStage, calculateStageScore } from './StageScoreCalculator';
import { isOlympicSeason, olympicStageProfile, OLYMPIC_RACE_DEFS } from './championships';

// Erzeugt die Olympischen Spiele (ITT 22.06. + Strasse 24.06.) fuer alle
// faelligen Olympia-Saisons (durch 4 teilbar, z.B. 2028/2032). Keine U23-/
// Junioren-Version; alle Altersklassen zugelassen (Roster-Filter regelt das).
// Idempotent (Erkennung ueber die Kategorien 24/25 je Saisonjahr). Wird sowohl
// beim Laden des Spielstands als auch beim taeglichen Fortschreiten aufgerufen,
// damit die Rennen auch dann entstehen, wenn der 22.06. mitten im Spiel
// ueberschritten wird (ohne Neuladen). Kategorie-/Bonus-Zeilen legt bereits
// ensureChampionshipCalendar an (Olympia-Kategorien sind Teil der Defs).
// Entfernt Olympia-Rennen (Kategorien 24/25) aus NICHT-Olympia-Saisons. Solche
// entstehen z. B., wenn der Saison-Klon (duplicateCalendarForSeason) eine
// Olympia-Saison in das Folgejahr kopiert (2032 -> 2033). Nur ungefahrene Rennen
// werden geloescht (Rennen mit Punktevergabe bleiben unangetastet). Idempotent.
export function removeMisscheduledOlympicGames(db: Database.Database): void {
  if (!tableExists(db, 'races') || !tableExists(db, 'stages')) return;
  const races = db.prepare(`
    SELECT id, CAST(substr(start_date, 1, 4) AS INTEGER) AS season
    FROM races WHERE category_id IN (24, 25)
  `).all() as Array<{ id: number; season: number }>;
  const stale = races.filter((r) => Number.isInteger(r.season) && !isOlympicSeason(r.season));
  if (stale.length === 0) return;

  const speExists = tableExists(db, 'season_point_events');
  const hasResults = speExists ? db.prepare('SELECT 1 FROM season_point_events WHERE race_id = ? LIMIT 1') : null;
  const delClimbs = tableExists(db, 'stage_climb_scores')
    ? db.prepare('DELETE FROM stage_climb_scores WHERE stage_id IN (SELECT id FROM stages WHERE race_id = ?)')
    : null;
  const delStageEntries = tableExists(db, 'stage_entries') ? db.prepare('DELETE FROM stage_entries WHERE race_id = ?') : null;
  const delActiveEntries = tableExists(db, 'active_race_entries') ? db.prepare('DELETE FROM active_race_entries WHERE race_id = ?') : null;
  const delProgramRaces = tableExists(db, 'race_program_races') ? db.prepare('DELETE FROM race_program_races WHERE race_id = ?') : null;
  const delStages = db.prepare('DELETE FROM stages WHERE race_id = ?');
  const delRace = db.prepare('DELETE FROM races WHERE id = ?');

  db.transaction(() => {
    for (const r of stale) {
      if (hasResults && hasResults.get(r.id)) continue; // bereits gefahren -> behalten
      delClimbs?.run(r.id);
      delStageEntries?.run(r.id);
      delActiveEntries?.run(r.id);
      delProgramRaces?.run(r.id);
      delStages.run(r.id);
      delRace.run(r.id);
    }
  })();
}

export function ensureOlympicGames(db: Database.Database): void {
  if (!tableExists(db, 'races') || !tableExists(db, 'stages')) return;
  // Falsch eingeplante Olympia-Rennen (z. B. aus einem Saison-Klon) entfernen,
  // bevor die faelligen Olympia-Rennen erzeugt werden.
  removeMisscheduledOlympicGames(db);
  if (!tableExists(db, 'game_state')) return;

  // WICHTIG: "current_date" quoten — unquoted ist es das SQLite-Schluesselwort
  // CURRENT_DATE (echtes Systemdatum) statt der gespeicherten Spielzeit.
  const gameState = db.prepare('SELECT "current_date" AS d, season FROM game_state LIMIT 1').get() as
    | { d: string; season: number }
    | undefined;
  if (!gameState) return;

  const seasonRows = db
    .prepare(`SELECT DISTINCT CAST(substr(date, 1, 4) AS INTEGER) AS season FROM stages WHERE date IS NOT NULL`)
    .all() as Array<{ season: number }>;
  const seasons = seasonRows.map((row) => row.season).filter((season) => Number.isInteger(season));

  const hasOlympicStage = db.prepare(`
    SELECT 1 FROM stages JOIN races ON races.id = stages.race_id
    WHERE races.category_id IN (24, 25) AND CAST(substr(stages.date, 1, 4) AS INTEGER) = ? LIMIT 1
  `);
  const insertRace = db.prepare(`
    INSERT INTO races (
      name, country_id, category_id, is_stage_race, number_of_stages,
      start_date, end_date, prestige, preferred_nationality_group, required_specs
    ) VALUES (@name, 3, @categoryId, 0, 1, @date, @date, @prestige, NULL, NULL)
  `);
  const insertStage = db.prepare(`
    INSERT INTO stages (
      race_id, stage_number, date, profile, start_elevation, details_csv_file,
      final_spread_start_percent, final_push_start_percent, final_spread_difficulty_multiplier,
      crash_incident_multiplier, mechanical_incident_multiplier, stage_score, allowed_weather
    ) VALUES (@raceId, 1, @date, @profile, @startElevation, @detailsFile, 70, 90, 1, 1, 1, @stageScore, '1|3')
  `);
  const insertClimb = tableExists(db, 'stage_climb_scores')
    ? db.prepare(`INSERT INTO stage_climb_scores (stage_id, climb_index, name, category, start_km, end_km, climb_score) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    : null;

  for (const season of seasons) {
    if (!isOlympicSeason(season)) continue; // nur Olympia-Jahre
    if (season > gameState.season) continue; // Zukunft ueberspringen
    // Aktuelle Saison erst ab dem ersten Olympia-Termin (22.06.) erzeugen;
    // vergangene Olympia-Saisons sofort.
    if (season === gameState.season && gameState.d < `${season}-${OLYMPIC_RACE_DEFS[0].monthDay}`) {
      continue;
    }
    if (hasOlympicStage.get(season)) continue;

    db.transaction(() => {
      for (const def of OLYMPIC_RACE_DEFS) {
        const date = `${season}-${def.monthDay}`;
        const { profile, detailsFile } = olympicStageProfile(def, season);
        const segments = readStageScoreSegments(detailsFile, `olympic ${def.raceName} ${season}`);
        const stageScore = calculateStageScore(segments, def.startElevation);
        const raceResult = insertRace.run({
          name: def.raceName,
          categoryId: def.categoryId,
          date,
          prestige: def.prestige,
        });
        const raceId = raceResult.lastInsertRowid as number;
        const stageResult = insertStage.run({
          raceId,
          date,
          profile,
          startElevation: def.startElevation,
          detailsFile,
          stageScore,
        });
        const stageId = stageResult.lastInsertRowid as number;
        if (insertClimb) {
          for (const climb of calculateClimbScoresForStage(segments, def.startElevation)) {
            insertClimb.run(stageId, climb.climbIndex, climb.name, climb.category, climb.startKm, climb.endKm, climb.score);
          }
        }
      }
    })();
  }
}
