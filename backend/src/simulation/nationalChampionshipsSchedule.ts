import Database from 'better-sqlite3';
import { tableExists } from '../db/mappers';
import { readStageScoreSegments } from '../bootstrapper';
import { calculateClimbScoresForStage, calculateStageScore } from './StageScoreCalculator';
import {
  NATIONAL_CHAMPIONSHIP_CATEGORY_DEFS,
  NATIONAL_CHAMPIONSHIP_GENERATION_MONTH_DAY,
  NATIONAL_CHAMPIONSHIP_ITT_MONTH_DAY,
  NATIONAL_CHAMPIONSHIP_MIN_TEAM_RIDERS,
  NATIONAL_CHAMPIONSHIP_ROAD_MONTH_DAY,
  NATIONAL_CHAMPIONSHIP_TOP_STANDINGS,
  nationalChampionshipStageProfile,
} from './championships';

// Erzeugt die nationalen Meisterschaften (je qualifiziertem Land ITT 25.06. +
// Strasse 28.06.) fuer alle faelligen Saisons anhand der Nationenwertung.
// Faellig = vergangene Saison ODER aktuelle Saison ab dem 01.06. Idempotent
// (Erkennung ueber die Kategorien 14/15 je Saisonjahr). Wird sowohl beim Laden
// des Spielstands als auch beim taeglichen Fortschreiten aufgerufen, damit die
// Rennen auch dann entstehen, wenn der 01.06. mitten im Spiel ueberschritten
// wird (ohne Neuladen).
export function ensureNationalChampionships(db: Database.Database): void {
  if (!tableExists(db, 'races') || !tableExists(db, 'stages')) return;
  if (!tableExists(db, 'race_categories') || !tableExists(db, 'race_categories_bonus')) return;
  if (!tableExists(db, 'season_point_events') || !tableExists(db, 'game_state')) return;

  // 1. Kategorien + Bonus-Systeme (idempotent).
  const insertBonus = db.prepare(`
    INSERT OR IGNORE INTO race_categories_bonus (
      id, name, bonus_seconds_final, bonus_seconds_intermediate, points_stage,
      points_mountainstage, points_sprint_finish, points_one_day, points_gc_final,
      points_jersey_leader_day, points_jersey_sprint_day, points_jersey_mountain_day,
      points_jersey_youth_day, points_sprint_intermediate, points_mountain_hc,
      points_mountain_cat1, points_mountain_cat2, points_mountain_cat3, points_mountain_cat4,
      points_jersey_sprint_final, points_jersey_mountain_final, points_jersey_youth_final
    ) VALUES (
      @id, @name, '0', '0', '0', '0', '0', @pointsOneDay, '0',
      0, 0, 0, 0, '0', '0', '0', '0', '0', '0', '0', '0', '0'
    )
  `);
  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO race_categories (
      id, name, tier, number_of_teams, number_of_riders, bonus_system_id, home_selection_probability
    ) VALUES (@id, @name, 1, 30, 8, @bonusSystemId, 0.0)
  `);
  for (const def of NATIONAL_CHAMPIONSHIP_CATEGORY_DEFS) {
    insertBonus.run({ id: def.bonusSystemId, name: def.bonusName, pointsOneDay: def.pointsOneDay });
    insertCategory.run({ id: def.categoryId, name: def.categoryName, bonusSystemId: def.bonusSystemId });
  }

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

  const hasNationalStage = db.prepare(`
    SELECT 1 FROM stages JOIN races ON races.id = stages.race_id
    WHERE races.category_id IN (14, 15) AND CAST(substr(stages.date, 1, 4) AS INTEGER) = ? LIMIT 1
  `);
  const insertRace = db.prepare(`
    INSERT INTO races (
      name, country_id, category_id, is_stage_race, number_of_stages,
      start_date, end_date, prestige, preferred_nationality_group, required_specs
    ) VALUES (@name, @countryId, @categoryId, 0, 1, @date, @date, @prestige, NULL, NULL)
  `);
  const insertStage = db.prepare(`
    INSERT INTO stages (
      race_id, stage_number, date, profile, start_elevation, details_csv_file,
      final_spread_start_percent, final_push_start_percent, final_spread_difficulty_multiplier,
      crash_incident_multiplier, mechanical_incident_multiplier, stage_score, allowed_weather
    ) VALUES (@raceId, 1, @date, @profile, 50, @detailsFile, 70, 90, 1, 1, 1, @stageScore, '1|3')
  `);
  const insertClimb = tableExists(db, 'stage_climb_scores')
    ? db.prepare(`INSERT INTO stage_climb_scores (stage_id, climb_index, name, category, start_km, end_km, climb_score) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    : null;
  const countryNameById = new Map(
    (db.prepare('SELECT id, name FROM sta_country').all() as Array<{ id: number; name: string }>).map((r) => [r.id, r.name]),
  );

  for (const season of seasons) {
    if (season > gameState.season) continue; // Zukunft ueberspringen
    // Aktuelle Saison erst ab dem 01.06. erzeugen; vergangene Saisons sofort.
    if (season === gameState.season && gameState.d < `${season}-${NATIONAL_CHAMPIONSHIP_GENERATION_MONTH_DAY}`) {
      continue;
    }
    if (hasNationalStage.get(season)) continue;

    // Qualifizierte Laender: Top 40 der Nationenwertung ODER >= 15 Fahrer mit Team.
    const topCountries = db.prepare(`
      SELECT country.id AS id
      FROM season_point_events spe
      JOIN riders r ON r.id = spe.rider_id
      JOIN sta_country country ON country.id = r.country_id
      WHERE spe.season = ?
      GROUP BY country.id
      ORDER BY SUM(spe.points_awarded) DESC
      LIMIT ${NATIONAL_CHAMPIONSHIP_TOP_STANDINGS}
    `).all(season) as Array<{ id: number }>;
    const bigCountries = db.prepare(`
      SELECT country_id AS id FROM riders
      WHERE active_team_id IS NOT NULL AND is_retired = 0
      GROUP BY country_id HAVING COUNT(*) >= ${NATIONAL_CHAMPIONSHIP_MIN_TEAM_RIDERS}
    `).all() as Array<{ id: number }>;
    const qualifying = new Set<number>([...topCountries, ...bigCountries].map((c) => c.id));
    if (qualifying.size === 0) continue;

    db.transaction(() => {
      for (const countryId of qualifying) {
        const countryName = countryNameById.get(countryId) ?? `Land ${countryId}`;
        for (const def of NATIONAL_CHAMPIONSHIP_CATEGORY_DEFS) {
          const monthDay = def.discipline === 'ITT'
            ? NATIONAL_CHAMPIONSHIP_ITT_MONTH_DAY
            : NATIONAL_CHAMPIONSHIP_ROAD_MONTH_DAY;
          const date = `${season}-${monthDay}`;
          const { profile, detailsFile } = nationalChampionshipStageProfile(def.discipline, season, countryId);
          const segments = readStageScoreSegments(detailsFile, `national championship ${countryName} ${season}`);
          const stageScore = calculateStageScore(segments, 50);
          const raceResult = insertRace.run({
            name: `Nationale Meisterschaft ${def.discipline === 'ITT' ? 'ITT' : 'Strasse'} – ${countryName}`,
            countryId,
            categoryId: def.categoryId,
            date,
            prestige: def.discipline === 'ITT' ? 45 : 55,
          });
          const raceId = raceResult.lastInsertRowid as number;
          const stageResult = insertStage.run({ raceId, date, profile, detailsFile, stageScore });
          const stageId = stageResult.lastInsertRowid as number;
          if (insertClimb) {
            for (const climb of calculateClimbScoresForStage(segments, 50)) {
              insertClimb.run(stageId, climb.climbIndex, climb.name, climb.category, climb.startKm, climb.endKm, climb.score);
            }
          }
        }
      }
    })();
  }
}
