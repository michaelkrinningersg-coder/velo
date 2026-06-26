"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardRepository = void 0;
const mappers_1 = require("../mappers");
class LeaderboardRepository {
    constructor(db) {
        this.db = db;
    }
    getLeaderboard(scope, metricKey, period, currentSeason) {
        if (period === 'live' && scope === 'teams') {
            return []; // Live metrics only supported for riders
        }
        if (scope === 'riders') {
            return this.getRiderLeaderboard(metricKey, period, currentSeason);
        }
        else {
            return this.getTeamLeaderboard(metricKey, period, currentSeason);
        }
    }
    getRiderLeaderboard(metricKey, period, currentSeason) {
        let query = '';
        let params = [];
        let valueFormatter = (r) => r.val;
        // 1. Live Metrics (Physis & Form)
        if (period === 'live') {
            if (!(0, mappers_1.tableExists)(this.db, 'rider_daily_state')) {
                return [];
            }
            const useFreeRaceForm = (0, mappers_1.tableExists)(this.db, 'rider_r_form_events');
            let selectVal = '';
            if (metricKey === 'fatigue_short') {
                selectVal = 'rds.short_term_fatigue';
            }
            else if (metricKey === 'fatigue_long') {
                selectVal = 'rds.long_term_fatigue_decayable';
            }
            else if (metricKey === 'fatigue_combined') {
                selectVal = 'rds.short_term_fatigue + rds.long_term_fatigue_decayable';
            }
            else if (metricKey === 'form_r') {
                selectVal = useFreeRaceForm
                    ? 'MIN(4.0, COALESCE(rds.race_form_bonus, 0) + COALESCE(free_r_form.total, 0))'
                    : 'rds.race_form_bonus';
            }
            else if (metricKey === 'form_s') {
                selectVal = 'rds.form_bonus';
            }
            else if (metricKey === 'form_combined') {
                selectVal = useFreeRaceForm
                    ? 'rds.form_bonus + MIN(4.0, COALESCE(rds.race_form_bonus, 0) + COALESCE(free_r_form.total, 0))'
                    : 'rds.form_bonus + rds.race_form_bonus';
            }
            else {
                return [];
            }
            const freeRaceFormJoin = useFreeRaceForm
                ? 'LEFT JOIN (SELECT rider_id, SUM(amount) AS total FROM rider_r_form_events GROUP BY rider_id) free_r_form ON free_r_form.rider_id = r.id'
                : '';
            query = `
        SELECT 
          r.id AS id,
          r.first_name,
          r.last_name,
          c.code_3 AS nationality,
          t.abbreviation AS team_abbr,
          t.name AS team_name,
          t.id AS team_id,
          t.division_id AS team_division_id,
          r.is_retired AS is_retired,
          ${selectVal} AS val
        FROM riders r
        JOIN sta_country c ON c.id = r.country_id
        JOIN rider_daily_state rds ON rds.rider_id = r.id
        LEFT JOIN teams t ON t.id = r.active_team_id
        ${freeRaceFormJoin}
        WHERE rds.season = ? AND r.is_retired = 0
        ORDER BY val DESC, r.last_name ASC
        LIMIT 100
      `;
            params = [currentSeason];
            valueFormatter = (r) => typeof r.val === 'number' ? r.val.toFixed(2) : r.val;
        }
        else if (metricKey === 'mentors_ranking') {
            // Custom mentor calculations done in JS for U23 mentor count
            return this.getMentorsLeaderboard(currentSeason);
        }
        else if (metricKey.startsWith('youngest_winners')) {
            // 2. Custom All-Time Youngest Winners
            let categoryFilter = '';
            const parts = metricKey.split('_');
            if (parts[2]) {
                const catId = parseInt(parts[2], 10);
                categoryFilter = `AND ra.category_id = ${catId}`;
            }
            query = `
        WITH rider_wins AS (
          SELECT
            res.rider_id,
            s.date AS stage_date,
            ra.category_id,
            (CAST(substr(s.date, 1, 4) AS INTEGER) - r.birth_year) AS age_at_win,
            ROW_NUMBER() OVER (PARTITION BY res.rider_id ORDER BY (CAST(substr(s.date, 1, 4) AS INTEGER) - r.birth_year) ASC) as rn
          FROM all_results res
          JOIN stages s ON s.id = res.stage_id
          JOIN races ra ON ra.id = s.race_id
          JOIN riders r ON r.id = res.rider_id
          WHERE res.rank = 1 ${categoryFilter}
            AND (
              (ra.is_stage_race = 1 AND res.result_type_id = 2 AND s.stage_number = ra.number_of_stages)
              OR
              (ra.is_stage_race = 0 AND res.result_type_id = 1)
            )
        )
        SELECT
          r.id AS id,
          r.first_name,
          r.last_name,
          c.code_3 AS nationality,
          t.abbreviation AS team_abbr,
          t.name AS team_name,
          t.id AS team_id,
          t.division_id AS team_division_id,
          r.is_retired AS is_retired,
          rc.name AS race_category,
          rw.stage_date,
          rw.age_at_win AS val
        FROM rider_wins rw
        JOIN riders r ON r.id = rw.rider_id
        JOIN sta_country c ON c.id = r.country_id
        LEFT JOIN teams t ON t.id = r.active_team_id
        JOIN race_categories rc ON rc.id = rw.category_id
        WHERE rw.rn = 1
        ORDER BY val ASC, r.last_name ASC
        LIMIT 100
      `;
            valueFormatter = (r) => `${r.val} J. (${r.race_category.replace('World Tour - ', '')})`;
        }
        else if (metricKey.startsWith('wins_terrain_') || metricKey.startsWith('wins_weather_') || metricKey === 'wins') {
            // 3. Stage Wins
            let extraFilter = '';
            let terrainOrWeather = null;
            if (metricKey.startsWith('wins_terrain_')) {
                terrainOrWeather = metricKey.replace('wins_terrain_', '');
                extraFilter = `AND s.profile = ?`;
            }
            else if (metricKey.startsWith('wins_weather_')) {
                terrainOrWeather = parseInt(metricKey.replace('wins_weather_', ''), 10);
                extraFilter = `AND s.rolled_weather_id = ?`;
            }
            if (period === 'season') {
                query = `
          WITH individual_wins AS (
            SELECT 
              res.rider_id AS rider_id,
              s.id AS stage_id
            FROM all_results res
            JOIN stages s ON s.id = res.stage_id
            WHERE res.rank = 1 
              AND res.result_type_id = 1 
              AND res.rider_id IS NOT NULL
              AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
              ${extraFilter}
            UNION ALL
            SELECT 
              se.rider_id AS rider_id,
              s.id AS stage_id
            FROM all_results res
            JOIN stages s ON s.id = res.stage_id
            JOIN all_stage_entries se ON se.stage_id = res.stage_id AND se.team_id = res.team_id
            WHERE res.rank = 1 
              AND res.result_type_id = 1 
              AND res.rider_id IS NULL
              AND s.profile = 'TTT'
              AND se.status = 'finished'
              AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
              ${extraFilter}
          )
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            t.division_id AS team_division_id,
            r.is_retired AS is_retired,
            COUNT(iw.stage_id) AS val
          FROM riders r
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          JOIN individual_wins iw ON iw.rider_id = r.id
          WHERE r.is_retired = 0
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
                params.push(currentSeason);
                if (terrainOrWeather !== null) {
                    params.push(terrainOrWeather);
                }
                params.push(currentSeason);
                if (terrainOrWeather !== null) {
                    params.push(terrainOrWeather);
                }
            }
            else {
                query = `
          WITH individual_wins AS (
            SELECT 
              res.rider_id AS rider_id,
              s.id AS stage_id
            FROM all_results res
            JOIN stages s ON s.id = res.stage_id
            WHERE res.rank = 1 
              AND res.result_type_id = 1 
              AND res.rider_id IS NOT NULL
              ${extraFilter}
            UNION ALL
            SELECT 
              se.rider_id AS rider_id,
              s.id AS stage_id
            FROM all_results res
            JOIN stages s ON s.id = res.stage_id
            JOIN all_stage_entries se ON se.stage_id = res.stage_id AND se.team_id = res.team_id
            WHERE res.rank = 1 
              AND res.result_type_id = 1 
              AND res.rider_id IS NULL
              AND s.profile = 'TTT'
              AND se.status = 'finished'
              ${extraFilter}
          )
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            t.division_id AS team_division_id,
            r.is_retired AS is_retired,
            COUNT(iw.stage_id) AS val
          FROM riders r
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          JOIN individual_wins iw ON iw.rider_id = r.id
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
                if (terrainOrWeather !== null) {
                    params.push(terrainOrWeather);
                    params.push(terrainOrWeather);
                }
            }
            valueFormatter = (r) => `${r.val} Sieg${r.val !== 1 ? 'e' : ''}`;
        }
        else if (metricKey.startsWith('final_')) {
            // Final classification wins (GC, Points, Mountain, Youth) at end of stage races
            let typeId = 2; // GC
            let label = 'Gesamtsieg';
            let categoryFilter = '';
            const parts = metricKey.split('_');
            const winType = parts[1]; // gc, points, mountain, youth
            if (winType === 'points') {
                typeId = 3;
                label = 'Punktesieg';
            }
            else if (winType === 'mountain') {
                typeId = 4;
                label = 'Bergsieg';
            }
            else if (winType === 'youth') {
                typeId = 5;
                label = 'Nachwuchssieg';
            }
            else if (winType === 'breakaway') {
                typeId = 7;
                label = 'Ausreißersieg';
            }
            if (parts[3]) {
                const catId = parseInt(parts[3], 10);
                categoryFilter = `AND ra.category_id = ${catId}`;
            }
            if (period === 'season') {
                query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            t.division_id AS team_division_id,
            r.is_retired AS is_retired,
            COUNT(*) AS val
          FROM all_results res
          JOIN stages s ON s.id = res.stage_id
          JOIN races ra ON ra.id = s.race_id
          JOIN riders r ON r.id = res.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE res.rank = 1 AND res.result_type_id = ?
            AND ra.is_stage_race = 1 AND s.stage_number = ra.number_of_stages
            AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
            AND r.is_retired = 0
            ${categoryFilter}
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
                params.push(typeId, currentSeason);
            }
            else {
                query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            t.division_id AS team_division_id,
            r.is_retired AS is_retired,
            COUNT(*) AS val
          FROM all_results res
          JOIN stages s ON s.id = res.stage_id
          JOIN races ra ON ra.id = s.race_id
          JOIN riders r ON r.id = res.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE res.rank = 1 AND res.result_type_id = ?
            AND ra.is_stage_race = 1 AND s.stage_number = ra.number_of_stages
            ${categoryFilter}
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
                params.push(typeId);
            }
            valueFormatter = (r) => `${r.val} ${label}${r.val !== 1 ? 'e' : ''}`;
        }
        else if (metricKey === 'uci_points') {
            // 4. UCI Points
            if (period === 'season') {
                query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            t.division_id AS team_division_id,
            r.is_retired AS is_retired,
            SUM(spe.points_awarded) AS val
          FROM season_point_events spe
          JOIN riders r ON r.id = spe.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE spe.season = ? AND r.is_retired = 0
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
                params.push(currentSeason);
            }
            else {
                query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            t.division_id AS team_division_id,
            r.is_retired AS is_retired,
            SUM(spe.points_awarded) AS val
          FROM season_point_events spe
          JOIN riders r ON r.id = spe.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
            }
            valueFormatter = (r) => `${r.val} Pkt.`;
        }
        else if (metricKey === 'stage_scores') {
            // 5. Stage Scores (Summe)
            if (period === 'season') {
                query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            t.division_id AS team_division_id,
            r.is_retired AS is_retired,
            SUM(s.stage_score) AS val
          FROM all_stage_entries se
          JOIN stages s ON s.id = se.stage_id
          JOIN riders r ON r.id = se.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE se.status = 'finished'
            AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
            AND r.is_retired = 0
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
                params.push(currentSeason);
            }
            else {
                query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            t.division_id AS team_division_id,
            r.is_retired AS is_retired,
            SUM(s.stage_score) AS val
          FROM all_stage_entries se
          JOIN stages s ON s.id = se.stage_id
          JOIN riders r ON r.id = se.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE se.status = 'finished'
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
            }
            valueFormatter = (r) => `${r.val}`;
        }
        else if (metricKey === 'successful_breakaways') {
            if (period === 'season') {
                query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            t.division_id AS team_division_id,
            r.is_retired AS is_retired,
            COUNT(*) AS val
          FROM all_results r1
          JOIN stages s ON s.id = r1.stage_id
          JOIN riders r ON r.id = r1.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE r1.result_type_id = 1
            AND r1.is_breakaway = 1
            AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
            AND r.is_retired = 0
            AND NOT EXISTS (
              SELECT 1 FROM all_results r2
              WHERE r2.stage_id = r1.stage_id
                AND r2.result_type_id = 1
                AND r2.rank < r1.rank
                AND r2.is_breakaway = 0
            )
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
                params.push(currentSeason);
            }
            else {
                query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            t.division_id AS team_division_id,
            r.is_retired AS is_retired,
            COUNT(*) AS val
          FROM all_results r1
          JOIN stages s ON s.id = r1.stage_id
          JOIN riders r ON r.id = r1.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE r1.result_type_id = 1
            AND r1.is_breakaway = 1
            AND NOT EXISTS (
              SELECT 1 FROM all_results r2
              WHERE r2.stage_id = r1.stage_id
                AND r2.result_type_id = 1
                AND r2.rank < r1.rank
                AND r2.is_breakaway = 0
            )
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
            }
            valueFormatter = (r) => `${r.val}`;
        }
        else if (metricKey === 'race_days' || metricKey.startsWith('race_days_terrain_')) {
            // 6. Race Days
            let extraFilter = '';
            let terrain = null;
            if (metricKey.startsWith('race_days_terrain_')) {
                terrain = metricKey.replace('race_days_terrain_', '');
                extraFilter = `AND s.profile = ?`;
            }
            if (period === 'season') {
                query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            t.division_id AS team_division_id,
            r.is_retired AS is_retired,
            COUNT(*) AS val
          FROM all_stage_entries se
          JOIN stages s ON s.id = se.stage_id
          JOIN riders r ON r.id = se.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE se.status != 'dns'
            AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
            AND r.is_retired = 0
            ${extraFilter}
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
                params.push(currentSeason);
                if (terrain !== null) {
                    params.push(terrain);
                }
            }
            else {
                query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            t.division_id AS team_division_id,
            r.is_retired AS is_retired,
            COUNT(*) AS val
          FROM all_stage_entries se
          JOIN stages s ON s.id = se.stage_id
          JOIN riders r ON r.id = se.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE se.status != 'dns'
            ${extraFilter}
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
                if (terrain !== null) {
                    params.push(terrain);
                }
            }
            valueFormatter = (r) => `${r.val} Tag${r.val !== 1 ? 'e' : ''}`;
        }
        else if (metricKey.startsWith('jersey_')) {
            // 7. Classification Jersey Wear Days
            let typeId = 2; // GC
            let label = 'Tage';
            let categoryFilter = '';
            const parts = metricKey.split('_');
            const jerseyType = parts[1]; // gc, points, mountain, youth
            if (jerseyType === 'points') {
                typeId = 3;
            }
            else if (jerseyType === 'mountain') {
                typeId = 4;
            }
            else if (jerseyType === 'youth') {
                typeId = 5;
            }
            else if (jerseyType === 'breakaway') {
                typeId = 7;
            }
            if (parts[2]) {
                const catId = parseInt(parts[2], 10);
                categoryFilter = `AND ra.category_id = ${catId}`;
            }
            if (period === 'season') {
                query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            t.division_id AS team_division_id,
            r.is_retired AS is_retired,
            COUNT(*) AS val
          FROM all_results res
          JOIN stages s ON s.id = res.stage_id
          JOIN races ra ON ra.id = s.race_id
          JOIN riders r ON r.id = res.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE res.rank = 1 AND res.result_type_id = ?
            AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
            AND r.is_retired = 0
            ${categoryFilter}
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
                params.push(typeId, currentSeason);
            }
            else {
                query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            t.division_id AS team_division_id,
            r.is_retired AS is_retired,
            COUNT(*) AS val
          FROM all_results res
          JOIN stages s ON s.id = res.stage_id
          JOIN races ra ON ra.id = s.race_id
          JOIN riders r ON r.id = res.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE res.rank = 1 AND res.result_type_id = ?
            ${categoryFilter}
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
                params.push(typeId);
            }
            valueFormatter = (r) => `${r.val} ${label}`;
        }
        else if (metricKey.startsWith('max_')) {
            // 8. Peak Fatigue & Form All-time
            if (!(0, mappers_1.tableExists)(this.db, 'rider_career_stats')) {
                return [];
            }
            query = `
        SELECT 
          r.id AS id,
          r.first_name,
          r.last_name,
          c.code_3 AS nationality,
          t.abbreviation AS team_abbr,
          t.name AS team_name,
          t.id AS team_id,
          t.division_id AS team_division_id,
          r.is_retired AS is_retired,
          rcs.${metricKey} AS val
        FROM riders r
        JOIN sta_country c ON c.id = r.country_id
        JOIN rider_career_stats rcs ON rcs.rider_id = r.id
        LEFT JOIN teams t ON t.id = r.active_team_id
        WHERE val > 0
        ORDER BY val DESC, r.last_name ASC
        LIMIT 100
      `;
            valueFormatter = (r) => r.val.toFixed(2);
        }
        else if (metricKey === 'highest_leadout_bonus') {
            if (!(0, mappers_1.tableExists)(this.db, 'stage_leadouts')) {
                return [];
            }
            query = `
        SELECT 
          r.id AS id,
          r.first_name,
          r.last_name,
          c.code_3 AS nationality,
          t.abbreviation AS team_abbr,
          t.name AS team_name,
          t.id AS team_id,
          t.division_id AS team_division_id,
          r.is_retired AS is_retired,
          sl.season AS season,
          ra.name AS race_name,
          st.stage_number AS stage_number,
          MAX(sl.leadout_bonus) AS val
        FROM stage_leadouts sl
        JOIN riders r ON r.id = sl.sprinter_id
        JOIN sta_country c ON c.id = r.country_id
        LEFT JOIN teams t ON t.id = r.active_team_id
        JOIN races ra ON ra.id = sl.race_id
        JOIN stages st ON st.id = sl.stage_id
        WHERE 1=1
        ${period === 'season' ? 'AND sl.season = ? AND r.is_retired = 0' : ''}
        GROUP BY r.id
        ORDER BY val DESC, r.last_name ASC
        LIMIT 100
      `;
            if (period === 'season') {
                params.push(currentSeason);
            }
            valueFormatter = (r) => typeof r.val === 'number' ? r.val.toFixed(2) : r.val;
        }
        else if (metricKey === 'strongest_lieutenants') {
            if (!(0, mappers_1.tableExists)(this.db, 'rider_lieutenants')) {
                return [];
            }
            if (period === 'season') {
                query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            t.division_id AS team_division_id,
            r.is_retired AS is_retired,
            r.overall_rating AS val,
            
            leader.id AS leader_id,
            leader.first_name AS leader_first_name,
            leader.last_name AS leader_last_name,
            leader_c.code_3 AS leader_nationality,
            leader_role.name AS leader_role_name
          FROM rider_lieutenants rl
          JOIN riders r ON r.id = rl.lieutenant_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          JOIN riders leader ON leader.id = rl.leader_id
          JOIN sta_country leader_c ON leader_c.id = leader.country_id
          LEFT JOIN sta_role leader_role ON leader_role.id = leader.role_id
          WHERE rl.season = ? AND r.is_retired = 0
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
                params.push(currentSeason);
            }
            else {
                if (!(0, mappers_1.tableExists)(this.db, 'lieutenant_all_time_peaks')) {
                    return [];
                }
                query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            t.division_id AS team_division_id,
            r.is_retired AS is_retired,
            latp.max_overall_rating AS val,
            
            leader.id AS leader_id,
            leader.first_name AS leader_first_name,
            leader.last_name AS leader_last_name,
            leader_c.code_3 AS leader_nationality,
            leader_role.name AS leader_role_name
          FROM lieutenant_all_time_peaks latp
          JOIN riders r ON r.id = latp.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          JOIN riders leader ON leader.id = latp.leader_id
          JOIN sta_country leader_c ON leader_c.id = leader.country_id
          LEFT JOIN sta_role leader_role ON leader_role.id = leader.role_id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
            }
            valueFormatter = (r) => typeof r.val === 'number' ? r.val.toFixed(2) : r.val;
        }
        else {
            // 9. Season stats / Career stats (crashes, defects, breakaway kms etc.)
            const isCareerField = [
                'breakaway_attempts', 'attacks', 'counter_attacks', 'crashes', 'defects',
                'illnesses', 'illness_days', 'injuries', 'injury_days', 'superteam_count'
            ].includes(metricKey);
            let selectExp = `rss.${metricKey}`;
            if (metricKey === 'superform_malus_days') {
                selectExp = 'rss.superform_days + rss.supermalus_days';
            }
            else if (metricKey === 'home_advantage_days_total') {
                selectExp = 'rss.home_advantage_days + rss.super_home_advantage_days + rss.home_pressure_days';
            }
            if (period === 'season') {
                if (!(0, mappers_1.tableExists)(this.db, 'rider_season_stats')) {
                    return [];
                }
                query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            t.division_id AS team_division_id,
            r.is_retired AS is_retired,
            ${selectExp} AS val
          FROM rider_season_stats rss
          JOIN riders r ON r.id = rss.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE rss.season = ? AND val > 0 AND r.is_retired = 0
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
                params.push(currentSeason);
            }
            else {
                // All-Time
                if (isCareerField && (0, mappers_1.tableExists)(this.db, 'rider_career_stats')) {
                    query = `
            SELECT 
              r.id AS id,
              r.first_name,
              r.last_name,
              c.code_3 AS nationality,
              t.abbreviation AS team_abbr,
              t.name AS team_name,
              t.id AS team_id,
              t.division_id AS team_division_id,
              r.is_retired AS is_retired,
              rcs.${metricKey} AS val
            FROM rider_career_stats rcs
            JOIN riders r ON r.id = rcs.rider_id
            JOIN sta_country c ON c.id = r.country_id
            LEFT JOIN teams t ON t.id = r.active_team_id
            WHERE val > 0
            ORDER BY val DESC, r.last_name ASC
            LIMIT 100
          `;
                }
                else {
                    // Sum from season stats
                    if (!(0, mappers_1.tableExists)(this.db, 'rider_season_stats')) {
                        return [];
                    }
                    query = `
            SELECT 
              r.id AS id,
              r.first_name,
              r.last_name,
              c.code_3 AS nationality,
              t.abbreviation AS team_abbr,
              t.name AS team_name,
              t.id AS team_id,
              t.division_id AS team_division_id,
              r.is_retired AS is_retired,
              SUM(${selectExp}) AS val
            FROM rider_season_stats rss
            JOIN riders r ON r.id = rss.rider_id
            JOIN sta_country c ON c.id = r.country_id
            LEFT JOIN teams t ON t.id = r.active_team_id
            GROUP BY r.id
            HAVING val > 0
            ORDER BY val DESC, r.last_name ASC
            LIMIT 100
          `;
                }
            }
            // Unit formatting
            if (metricKey === 'breakaway_kms') {
                valueFormatter = (r) => `${r.val.toFixed(1)} km`;
            }
            else if (metricKey.includes('days')) {
                valueFormatter = (r) => `${r.val} Tag${r.val !== 1 ? 'e' : ''}`;
            }
            else if (metricKey === 'crashes') {
                valueFormatter = (r) => `${r.val} Sturz${r.val !== 1 ? 'e' : ''}`;
            }
            else if (metricKey === 'defects') {
                valueFormatter = (r) => `${r.val} Defekt${r.val !== 1 ? 'e' : ''}`;
            }
            else if (metricKey === 'superteam_count') {
                valueFormatter = (r) => `${r.val}x`;
            }
            else {
                valueFormatter = (r) => `${r.val}`;
            }
        }
        if (!query) {
            return [];
        }
        try {
            const rows = this.db.prepare(query).all(...params);
            return rows.map((r, idx) => ({
                rank: idx + 1,
                riderId: r.id,
                teamId: r.team_id ?? undefined,
                firstName: r.first_name,
                lastName: r.last_name,
                nationality: r.nationality ?? undefined,
                teamAbbr: r.team_abbr ?? undefined,
                teamName: r.team_name ?? undefined,
                value: valueFormatter(r),
                rawValue: r.val ?? 0,
                isRetired: r.is_retired === 1,
                teamDivisionId: r.team_division_id !== undefined ? r.team_division_id : null,
                season: r.season !== undefined ? r.season : undefined,
                raceName: r.race_name !== undefined ? r.race_name : undefined,
                stageNumber: r.stage_number !== undefined ? r.stage_number : undefined,
                lieutenantDetails: r.leader_id ? {
                    leaderId: r.leader_id,
                    leaderFirstName: r.leader_first_name,
                    leaderLastName: r.leader_last_name,
                    leaderNationality: r.leader_nationality ?? undefined,
                    leaderRoleName: r.leader_role_name ?? undefined,
                } : undefined,
            }));
        }
        catch (e) {
            console.error('Leaderboard query error:', e.message);
            return [];
        }
    }
    getTeamLeaderboard(metricKey, period, currentSeason) {
        let query = '';
        let params = [];
        let valueFormatter = (r) => r.val;
        if (metricKey.startsWith('wins_terrain_') || metricKey.startsWith('wins_weather_') || metricKey === 'wins') {
            // Stage wins: Rider wins + TTT wins
            let extraFilter = '';
            let terrainOrWeather = null;
            if (metricKey.startsWith('wins_terrain_')) {
                terrainOrWeather = metricKey.replace('wins_terrain_', '');
                extraFilter = `AND s.profile = ?`;
            }
            else if (metricKey.startsWith('wins_weather_')) {
                terrainOrWeather = parseInt(metricKey.replace('wins_weather_', ''), 10);
                extraFilter = `AND s.rolled_weather_id = ?`;
            }
            if (period === 'season') {
                query = `
          SELECT team_id, COUNT(*) AS val
          FROM (
            SELECT r.active_team_id AS team_id
            FROM all_results res
            JOIN stages s ON s.id = res.stage_id
            JOIN riders r ON r.id = res.rider_id
            WHERE res.rank = 1 AND res.result_type_id = 1
              AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
              ${extraFilter}
            UNION ALL
            SELECT res.team_id
            FROM all_results res
            JOIN stages s ON s.id = res.stage_id
            WHERE res.rank = 1 AND res.result_type_id = 1 AND res.rider_id IS NULL
              AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
              ${extraFilter}
          )
          WHERE team_id IS NOT NULL
          GROUP BY team_id
          ORDER BY val DESC
          LIMIT 100
        `;
                params.push(currentSeason);
                if (terrainOrWeather !== null) {
                    params.push(terrainOrWeather);
                }
                params.push(currentSeason);
                if (terrainOrWeather !== null) {
                    params.push(terrainOrWeather);
                }
            }
            else {
                query = `
          SELECT team_id, COUNT(*) AS val
          FROM (
            SELECT r.active_team_id AS team_id
            FROM all_results res
            JOIN stages s ON s.id = res.stage_id
            JOIN riders r ON r.id = res.rider_id
            WHERE res.rank = 1 AND res.result_type_id = 1
              ${extraFilter}
            UNION ALL
            SELECT res.team_id
            FROM all_results res
            JOIN stages s ON s.id = res.stage_id
            WHERE res.rank = 1 AND res.result_type_id = 1 AND res.rider_id IS NULL
              ${extraFilter}
          )
          WHERE team_id IS NOT NULL
          GROUP BY team_id
          ORDER BY val DESC
          LIMIT 100
        `;
                if (terrainOrWeather !== null) {
                    params.push(terrainOrWeather);
                    params.push(terrainOrWeather);
                }
            }
            valueFormatter = (r) => `${r.val} Sieg${r.val !== 1 ? 'e' : ''}`;
        }
        else if (metricKey === 'superteam_count') {
            if (period === 'season') {
                query = `
          SELECT super_team_id AS team_id, COUNT(*) AS val
          FROM stages
          WHERE super_team_id IS NOT NULL
            AND CAST(substr(date, 1, 4) AS INTEGER) = ?
          GROUP BY super_team_id
          ORDER BY val DESC
          LIMIT 100
        `;
                params.push(currentSeason);
            }
            else {
                query = `
          SELECT super_team_id AS team_id, COUNT(*) AS val
          FROM stages
          WHERE super_team_id IS NOT NULL
          GROUP BY super_team_id
          ORDER BY val DESC
          LIMIT 100
        `;
            }
            valueFormatter = (r) => `${r.val}x`;
        }
        else if (metricKey.startsWith('final_')) {
            // Final classification wins (GC, Points, Mountain, Youth) at end of stage races
            let typeId = 2; // GC
            let label = 'Gesamtsieg';
            let categoryFilter = '';
            const parts = metricKey.split('_');
            const winType = parts[1]; // gc, points, mountain, youth
            if (winType === 'points') {
                typeId = 3;
                label = 'Punktesieg';
            }
            else if (winType === 'mountain') {
                typeId = 4;
                label = 'Bergsieg';
            }
            else if (winType === 'youth') {
                typeId = 5;
                label = 'Nachwuchssieg';
            }
            else if (winType === 'breakaway') {
                typeId = 7;
                label = 'Ausreißersieg';
            }
            if (parts[3]) {
                const catId = parseInt(parts[3], 10);
                categoryFilter = `AND ra.category_id = ${catId}`;
            }
            if (winType === 'gc') {
                if (period === 'season') {
                    query = `
            SELECT team_id, COUNT(*) AS val
            FROM (
              SELECT r.active_team_id AS team_id
              FROM all_results res
              JOIN stages s ON s.id = res.stage_id
              JOIN races ra ON ra.id = s.race_id
              JOIN riders r ON r.id = res.rider_id
              WHERE res.rank = 1 AND res.result_type_id = 2
                AND ra.is_stage_race = 1 AND s.stage_number = ra.number_of_stages
                AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
                ${categoryFilter}
              UNION ALL
              SELECT res.team_id
              FROM all_results res
              JOIN stages s ON s.id = res.stage_id
              JOIN races ra ON ra.id = s.race_id
              WHERE res.rank = 1 AND res.result_type_id = 6 AND res.rider_id IS NULL
                AND ra.is_stage_race = 1 AND s.stage_number = ra.number_of_stages
                AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
                ${categoryFilter}
            )
            WHERE team_id IS NOT NULL
            GROUP BY team_id
            ORDER BY val DESC
            LIMIT 100
          `;
                    params.push(currentSeason, currentSeason);
                }
                else {
                    query = `
            SELECT team_id, COUNT(*) AS val
            FROM (
              SELECT r.active_team_id AS team_id
              FROM all_results res
              JOIN stages s ON s.id = res.stage_id
              JOIN races ra ON ra.id = s.race_id
              JOIN riders r ON r.id = res.rider_id
              WHERE res.rank = 1 AND res.result_type_id = 2
                AND ra.is_stage_race = 1 AND s.stage_number = ra.number_of_stages
                ${categoryFilter}
              UNION ALL
              SELECT res.team_id
              FROM all_results res
              JOIN stages s ON s.id = res.stage_id
              JOIN races ra ON ra.id = s.race_id
              WHERE res.rank = 1 AND res.result_type_id = 6 AND res.rider_id IS NULL
                AND ra.is_stage_race = 1 AND s.stage_number = ra.number_of_stages
                ${categoryFilter}
            )
            WHERE team_id IS NOT NULL
            GROUP BY team_id
            ORDER BY val DESC
            LIMIT 100
          `;
                }
            }
            else {
                if (period === 'season') {
                    query = `
            SELECT r.active_team_id AS team_id, COUNT(*) AS val
            FROM all_results res
            JOIN stages s ON s.id = res.stage_id
            JOIN races ra ON ra.id = s.race_id
            JOIN riders r ON r.id = res.rider_id
            WHERE res.rank = 1 AND res.result_type_id = ? AND r.active_team_id IS NOT NULL
              AND ra.is_stage_race = 1 AND s.stage_number = ra.number_of_stages
              AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
              ${categoryFilter}
            GROUP BY r.active_team_id
            ORDER BY val DESC
            LIMIT 100
          `;
                    params.push(typeId, currentSeason);
                }
                else {
                    query = `
            SELECT r.active_team_id AS team_id, COUNT(*) AS val
            FROM all_results res
            JOIN stages s ON s.id = res.stage_id
            JOIN races ra ON ra.id = s.race_id
            JOIN riders r ON r.id = res.rider_id
            WHERE res.rank = 1 AND res.result_type_id = ? AND r.active_team_id IS NOT NULL
              AND ra.is_stage_race = 1 AND s.stage_number = ra.number_of_stages
              ${categoryFilter}
            GROUP BY r.active_team_id
            ORDER BY val DESC
            LIMIT 100
          `;
                    params.push(typeId);
                }
            }
            valueFormatter = (r) => `${r.val} ${label}${r.val !== 1 ? 'e' : ''}`;
        }
        else if (metricKey === 'uci_points') {
            // UCI points: Sum points of events grouped by team_id
            if (period === 'season') {
                query = `
          SELECT team_id, SUM(points_awarded) AS val
          FROM season_point_events
          WHERE season = ? AND team_id IS NOT NULL
          GROUP BY team_id
          ORDER BY val DESC
          LIMIT 100
        `;
                params.push(currentSeason);
            }
            else {
                query = `
          SELECT team_id, SUM(points_awarded) AS val
          FROM season_point_events
          WHERE team_id IS NOT NULL
          GROUP BY team_id
          ORDER BY val DESC
          LIMIT 100
        `;
            }
            valueFormatter = (r) => `${r.val} Pkt.`;
        }
        else if (metricKey === 'stage_scores') {
            // Stage scores: Sum scores of team riders
            if (period === 'season') {
                query = `
          SELECT r.active_team_id AS team_id, SUM(s.stage_score) AS val
          FROM all_stage_entries se
          JOIN stages s ON s.id = se.stage_id
          JOIN riders r ON r.id = se.rider_id
          WHERE se.status = 'finished' AND r.active_team_id IS NOT NULL
            AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
          GROUP BY r.active_team_id
          ORDER BY val DESC
          LIMIT 100
        `;
                params.push(currentSeason);
            }
            else {
                query = `
          SELECT r.active_team_id AS team_id, SUM(s.stage_score) AS val
          FROM all_stage_entries se
          JOIN stages s ON s.id = se.stage_id
          JOIN riders r ON r.id = se.rider_id
          WHERE se.status = 'finished' AND r.active_team_id IS NOT NULL
          GROUP BY r.active_team_id
          ORDER BY val DESC
          LIMIT 100
        `;
            }
            valueFormatter = (r) => `${r.val}`;
        }
        else if (metricKey === 'race_days' || metricKey.startsWith('race_days_terrain_')) {
            // Race days: Sum race days of team riders
            let extraFilter = '';
            let terrain = null;
            if (metricKey.startsWith('race_days_terrain_')) {
                terrain = metricKey.replace('race_days_terrain_', '');
                extraFilter = `AND s.profile = ?`;
            }
            if (period === 'season') {
                query = `
          SELECT r.active_team_id AS team_id, COUNT(DISTINCT se.stage_id) AS val
          FROM all_stage_entries se
          JOIN stages s ON s.id = se.stage_id
          JOIN riders r ON r.id = se.rider_id
          WHERE se.status != 'dns' AND r.active_team_id IS NOT NULL
            AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
            ${extraFilter}
          GROUP BY r.active_team_id
          ORDER BY val DESC
          LIMIT 100
        `;
                params.push(currentSeason);
                if (terrain !== null) {
                    params.push(terrain);
                }
            }
            else {
                query = `
          SELECT r.active_team_id AS team_id, COUNT(DISTINCT se.stage_id) AS val
          FROM all_stage_entries se
          JOIN stages s ON s.id = se.stage_id
          JOIN riders r ON r.id = se.rider_id
          WHERE se.status != 'dns' AND r.active_team_id IS NOT NULL
            ${extraFilter}
          GROUP BY r.active_team_id
          ORDER BY val DESC
          LIMIT 100
        `;
                if (terrain !== null) {
                    params.push(terrain);
                }
            }
            valueFormatter = (r) => `${r.val} Tag${r.val !== 1 ? 'e' : ''}`;
        }
        else if (metricKey.startsWith('jersey_')) {
            // Trikottage (classification leadership)
            let typeId = 2; // GC
            let categoryFilter = '';
            const parts = metricKey.split('_');
            const jerseyType = parts[1]; // gc, points, mountain, youth
            if (jerseyType === 'points') {
                typeId = 3;
            }
            else if (jerseyType === 'mountain') {
                typeId = 4;
            }
            else if (jerseyType === 'youth') {
                typeId = 5;
            }
            else if (jerseyType === 'breakaway') {
                typeId = 7;
            }
            if (parts[2]) {
                const catId = parseInt(parts[2], 10);
                categoryFilter = `AND ra.category_id = ${catId}`;
            }
            if (period === 'season') {
                query = `
          SELECT r.active_team_id AS team_id, COUNT(*) AS val
          FROM all_results res
          JOIN stages s ON s.id = res.stage_id
          JOIN races ra ON ra.id = s.race_id
          JOIN riders r ON r.id = res.rider_id
          WHERE res.rank = 1 AND res.result_type_id = ? AND r.active_team_id IS NOT NULL
            AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
            ${categoryFilter}
          GROUP BY r.active_team_id
          ORDER BY val DESC
          LIMIT 100
        `;
                params.push(typeId, currentSeason);
            }
            else {
                query = `
          SELECT r.active_team_id AS team_id, COUNT(*) AS val
          FROM all_results res
          JOIN stages s ON s.id = res.stage_id
          JOIN races ra ON ra.id = s.race_id
          JOIN riders r ON r.id = res.rider_id
          WHERE res.rank = 1 AND res.result_type_id = ? AND r.active_team_id IS NOT NULL
            ${categoryFilter}
          GROUP BY r.active_team_id
          ORDER BY val DESC
          LIMIT 100
        `;
                params.push(typeId);
            }
            valueFormatter = (r) => `${r.val} Tage`;
        }
        else if (metricKey === 'highest_leadout_bonus') {
            if (!(0, mappers_1.tableExists)(this.db, 'stage_leadouts')) {
                return [];
            }
            const leadoutRowsQuery = `
        SELECT 
          sl.team_id,
          sl.sprinter_id,
          sl.leadout_bonus,
          sl.contributors_json,
          sl.season AS season,
          ra.name AS race_name,
          st.stage_number AS stage_number,
          t.name AS team_name
        FROM stage_leadouts sl
        JOIN teams t ON t.id = sl.team_id
        JOIN races ra ON ra.id = sl.race_id
        JOIN stages st ON st.id = sl.stage_id
        ${period === 'season' ? 'WHERE sl.season = ?' : ''}
        ORDER BY sl.leadout_bonus DESC
        LIMIT 1000
      `;
            const leadoutParams = period === 'season' ? [currentSeason] : [];
            try {
                const leadoutRows = this.db.prepare(leadoutRowsQuery).all(...leadoutParams);
                // Fetch rider last names and nationalities for formatting
                const riders = this.db.prepare(`
          SELECT r.id, r.last_name, c.code_3 AS nationality 
          FROM riders r
          JOIN sta_country c ON c.id = r.country_id
        `).all();
                const riderMap = new Map();
                for (const r of riders) {
                    riderMap.set(r.id, { last_name: r.last_name, nationality: r.nationality });
                }
                const seen = new Set();
                const finalRows = [];
                for (const row of leadoutRows) {
                    let contributors = [];
                    try {
                        contributors = JSON.parse(row.contributors_json);
                    }
                    catch (e) {
                        continue;
                    }
                    // Create unique key based on team_id, sprinter_id, and sorted contributor riderIds
                    const contributorIds = contributors.map(c => c.riderId).sort((a, b) => a - b);
                    const key = `${row.team_id}:${row.sprinter_id}:${contributorIds.join(',')}`;
                    if (seen.has(key)) {
                        continue;
                    }
                    seen.add(key);
                    // Sort contributors by contribution descending
                    contributors.sort((a, b) => b.contribution - a.contribution);
                    const formattedContributors = contributors.map(c => {
                        const helperInfo = riderMap.get(c.riderId);
                        const helperLastName = helperInfo?.last_name || c.name.split(' ').pop() || c.name;
                        return `${helperLastName} (+${c.contribution.toFixed(2)})`;
                    }).join(', ');
                    const sprinterInfo = riderMap.get(row.sprinter_id);
                    const sprinterLastName = sprinterInfo?.last_name || 'Unknown';
                    const sprinterNationality = sprinterInfo?.nationality || '';
                    const formattedTeamName = `${row.team_name} (Sprinter: ${sprinterLastName} [Leadout: ${formattedContributors}])`;
                    const detailContributors = contributors.map(c => {
                        const helperInfo = riderMap.get(c.riderId);
                        return {
                            riderId: c.riderId,
                            lastName: helperInfo?.last_name || c.name.split(' ').pop() || c.name,
                            nationality: helperInfo?.nationality || undefined,
                            contribution: c.contribution
                        };
                    });
                    finalRows.push({
                        rank: finalRows.length + 1,
                        teamId: row.team_id,
                        teamName: formattedTeamName,
                        value: row.leadout_bonus.toFixed(2),
                        rawValue: row.leadout_bonus,
                        season: row.season,
                        raceName: row.race_name,
                        stageNumber: row.stage_number,
                        leadoutDetails: {
                            sprinterLastName,
                            sprinterNationality,
                            contributors: detailContributors
                        }
                    });
                    if (finalRows.length >= 100) {
                        break;
                    }
                }
                return finalRows;
            }
            catch (e) {
                console.error('Team leadout leaderboard query error:', e.message);
                return [];
            }
        }
        else if (metricKey === 'successful_breakaways') {
            if (period === 'season') {
                query = `
          SELECT 
            r.active_team_id AS team_id,
            COUNT(*) AS val
          FROM all_results r1
          JOIN stages s ON s.id = r1.stage_id
          JOIN riders r ON r.id = r1.rider_id
          WHERE r1.result_type_id = 1
            AND r1.is_breakaway = 1
            AND r.active_team_id IS NOT NULL
            AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
            AND NOT EXISTS (
              SELECT 1 FROM all_results r2
              WHERE r2.stage_id = r1.stage_id
                AND r2.result_type_id = 1
                AND r2.rank < r1.rank
                AND r2.is_breakaway = 0
            )
          GROUP BY r.active_team_id
          ORDER BY val DESC
          LIMIT 100
        `;
                params.push(currentSeason);
            }
            else {
                query = `
          SELECT 
            r.active_team_id AS team_id,
            COUNT(*) AS val
          FROM all_results r1
          JOIN stages s ON s.id = r1.stage_id
          JOIN riders r ON r.id = r1.rider_id
          WHERE r1.result_type_id = 1
            AND r1.is_breakaway = 1
            AND r.active_team_id IS NOT NULL
            AND NOT EXISTS (
              SELECT 1 FROM all_results r2
              WHERE r2.stage_id = r1.stage_id
                AND r2.result_type_id = 1
                AND r2.rank < r1.rank
                AND r2.is_breakaway = 0
            )
          GROUP BY r.active_team_id
          ORDER BY val DESC
          LIMIT 100
        `;
            }
            valueFormatter = (r) => `${r.val}`;
        }
        else {
            // Sum other fields (breakaways, crashes etc.) from season stats
            let selectExp = `rss.${metricKey}`;
            if (metricKey === 'superform_malus_days') {
                selectExp = 'rss.superform_days + rss.supermalus_days';
            }
            else if (metricKey === 'home_advantage_days_total') {
                selectExp = 'rss.home_advantage_days + rss.super_home_advantage_days + rss.home_pressure_days';
            }
            if (period === 'season') {
                if (!(0, mappers_1.tableExists)(this.db, 'rider_season_stats')) {
                    return [];
                }
                query = `
          SELECT r.active_team_id AS team_id, SUM(${selectExp}) AS val
          FROM rider_season_stats rss
          JOIN riders r ON r.id = rss.rider_id
          WHERE rss.season = ? AND r.active_team_id IS NOT NULL
          GROUP BY r.active_team_id
          HAVING val > 0
          ORDER BY val DESC
          LIMIT 100
        `;
                params.push(currentSeason);
            }
            else {
                if (!(0, mappers_1.tableExists)(this.db, 'rider_season_stats')) {
                    return [];
                }
                query = `
          SELECT r.active_team_id AS team_id, SUM(${selectExp}) AS val
          FROM rider_season_stats rss
          JOIN riders r ON r.id = rss.rider_id
          WHERE r.active_team_id IS NOT NULL
          GROUP BY r.active_team_id
          HAVING val > 0
          ORDER BY val DESC
          LIMIT 100
        `;
            }
            // Unit formatting
            if (metricKey === 'breakaway_kms') {
                valueFormatter = (r) => `${r.val.toFixed(1)} km`;
            }
            else if (metricKey.includes('days')) {
                valueFormatter = (r) => `${r.val} Tag${r.val !== 1 ? 'e' : ''}`;
            }
            else if (metricKey === 'crashes') {
                valueFormatter = (r) => `${r.val} Sturz${r.val !== 1 ? 'e' : ''}`;
            }
            else if (metricKey === 'defects') {
                valueFormatter = (r) => `${r.val} Defekt${r.val !== 1 ? 'e' : ''}`;
            }
            else {
                valueFormatter = (r) => `${r.val}`;
            }
        }
        if (!query) {
            return [];
        }
        try {
            // Find team details
            const rows = this.db.prepare(`
        SELECT q.team_id, t.name AS team_name, q.val
        FROM (${query}) q
        JOIN teams t ON t.id = q.team_id
        ORDER BY q.val DESC, t.name ASC
      `).all(...params);
            return rows.map((r, idx) => ({
                rank: idx + 1,
                teamId: r.team_id,
                teamName: r.team_name,
                value: valueFormatter(r),
                rawValue: r.val ?? 0
            }));
        }
        catch (e) {
            console.error('Leaderboard query error:', e.message);
            return [];
        }
    }
    getMentorsLeaderboard(currentSeason) {
        // Custom logic to rank veteran mentors by how many young riders (age <= 23) they mentor on their team
        if (!(0, mappers_1.tableExists)(this.db, 'riders')) {
            return [];
        }
        const riders = this.db.prepare(`
      SELECT riders.id, first_name, last_name, country.code_3 AS nationality, active_team_id, birth_year, overall_rating, specialization_1_id, specialization_2_id, specialization_3_id, 
             (SELECT abbreviation FROM teams WHERE id = riders.active_team_id) AS team_abbr,
             (SELECT name FROM teams WHERE id = riders.active_team_id) AS team_name
      FROM riders
      LEFT JOIN sta_country country ON country.id = riders.country_id
      WHERE is_retired = 0
    `).all();
        // Group riders by team
        const teamRidersMap = new Map();
        for (const r of riders) {
            if (r.active_team_id != null) {
                let list = teamRidersMap.get(r.active_team_id);
                if (!list) {
                    list = [];
                    teamRidersMap.set(r.active_team_id, list);
                }
                list.push(r);
            }
        }
        // Resolve spec IDs to rider type strings
        // In this game: spec1 = flat (1), mountain (2), mediumMountain (3), hill (4), timeTrial (5), sprint (6), cobble (7)
        const SPEC_TO_TYPE = {
            1: 'flat',
            2: 'mountain',
            3: 'mediumMountain',
            4: 'hill',
            5: 'timeTrial',
            6: 'sprint',
            7: 'cobble'
        };
        // Calculate U23 mentors
        const mentorCounts = new Map(); // mentor_id -> count of mentored U23 riders
        for (const [teamId, teamRiders] of teamRidersMap.entries()) {
            const u23s = teamRiders.filter(r => (currentSeason - r.birth_year) <= 23);
            const veterans = teamRiders.filter(r => (currentSeason - r.birth_year) >= 31 && r.overall_rating >= 73);
            if (u23s.length === 0 || veterans.length === 0)
                continue;
            for (const u23 of u23s) {
                // Find all eligible mentors for this U23
                const u23Type = SPEC_TO_TYPE[u23.specialization_1_id] || '';
                const eligibleMentors = veterans.filter(m => {
                    const mType = SPEC_TO_TYPE[m.specialization_1_id] || '';
                    return mType === u23Type ||
                        SPEC_TO_TYPE[u23.specialization_1_id] === mType ||
                        SPEC_TO_TYPE[u23.specialization_2_id] === mType ||
                        SPEC_TO_TYPE[u23.specialization_3_id] === mType;
                });
                if (eligibleMentors.length > 0) {
                    // Sort by overall rating descending to find the strongest mentor
                    eligibleMentors.sort((a, b) => b.overall_rating - a.overall_rating);
                    const strongest = eligibleMentors[0];
                    mentorCounts.set(strongest.id, (mentorCounts.get(strongest.id) || 0) + 1);
                }
            }
        }
        // Map to LeaderboardRow and filter/sort
        const rows = [];
        for (const rider of riders) {
            const count = mentorCounts.get(rider.id) ?? 0;
            if (count > 0) {
                rows.push({
                    rank: 0,
                    riderId: rider.id,
                    teamId: rider.active_team_id ?? undefined,
                    firstName: rider.first_name,
                    lastName: rider.last_name,
                    nationality: rider.nationality ?? undefined,
                    teamAbbr: rider.team_abbr ?? undefined,
                    teamName: rider.team_name ?? undefined,
                    value: `${count} Fahrer`,
                    rawValue: count
                });
            }
        }
        rows.sort((a, b) => b.rawValue - a.rawValue || a.lastName.localeCompare(b.lastName));
        return rows.map((r, idx) => ({ ...r, rank: idx + 1 }));
    }
}
exports.LeaderboardRepository = LeaderboardRepository;
