import Database from 'better-sqlite3';
import { tableExists } from '../mappers';

export interface LeaderboardRow {
  rank: number;
  riderId?: number;
  teamId?: number;
  firstName?: string;
  lastName?: string;
  nationality?: string;
  teamAbbr?: string;
  teamName?: string;
  jerseyPath?: string;
  value: string | number;
  rawValue: number;
}

export class LeaderboardRepository {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  public getLeaderboard(
    scope: 'riders' | 'teams',
    metricKey: string,
    period: 'season' | 'alltime' | 'live',
    currentSeason: number
  ): LeaderboardRow[] {
    if (period === 'live' && scope === 'teams') {
      return []; // Live metrics only supported for riders
    }

    if (scope === 'riders') {
      return this.getRiderLeaderboard(metricKey, period, currentSeason);
    } else {
      return this.getTeamLeaderboard(metricKey, period as 'season' | 'alltime', currentSeason);
    }
  }

  private getRiderLeaderboard(metricKey: string, period: 'season' | 'alltime' | 'live', currentSeason: number): LeaderboardRow[] {
    let query = '';
    let params: any[] = [];
    let valueFormatter: (row: any) => string | number = (r) => r.val;

    // 1. Live Metrics (Physis & Form)
    if (period === 'live') {
      if (!tableExists(this.db, 'rider_daily_state')) {
        return [];
      }
      let selectVal = '';
      if (metricKey === 'fatigue_short') {
        selectVal = 'rds.short_term_fatigue';
      } else if (metricKey === 'fatigue_long') {
        selectVal = 'rds.long_term_fatigue_decayable';
      } else if (metricKey === 'fatigue_combined') {
        selectVal = 'rds.short_term_fatigue + rds.long_term_fatigue_decayable';
      } else if (metricKey === 'form_r') {
        selectVal = 'rds.race_form_bonus';
      } else if (metricKey === 'form_s') {
        selectVal = 'rds.form_bonus';
      } else if (metricKey === 'form_combined') {
        selectVal = 'rds.form_bonus + rds.race_form_bonus';
      } else {
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
          ${selectVal} AS val
        FROM riders r
        JOIN sta_country c ON c.id = r.country_id
        JOIN rider_daily_state rds ON rds.rider_id = r.id
        LEFT JOIN teams t ON t.id = r.active_team_id
        WHERE rds.season = ? AND r.is_retired = 0
        ORDER BY val DESC, r.last_name ASC
        LIMIT 100
      `;
      params = [currentSeason];
      valueFormatter = (r) => typeof r.val === 'number' ? r.val.toFixed(2) : r.val;

    } else if (metricKey === 'mentors_ranking') {
      // Custom mentor calculations done in JS for U23 mentor count
      return this.getMentorsLeaderboard(currentSeason);
    } else if (metricKey === 'youngest_winners') {
      // 2. Custom All-Time Youngest Winners
      query = `
        WITH rider_wins AS (
          SELECT
            res.rider_id,
            s.date AS stage_date,
            ra.category_id,
            (CAST(substr(s.date, 1, 4) AS INTEGER) - r.birth_year) AS age_at_win,
            ROW_NUMBER() OVER (PARTITION BY res.rider_id ORDER BY (CAST(substr(s.date, 1, 4) AS INTEGER) - r.birth_year) ASC) as rn
          FROM results res
          JOIN stages s ON s.id = res.stage_id
          JOIN races ra ON ra.id = s.race_id
          JOIN riders r ON r.id = res.rider_id
          WHERE res.rank = 1 AND res.result_type_id = 1 AND r.is_retired = 0
        )
        SELECT
          r.id AS id,
          r.first_name,
          r.last_name,
          c.code_3 AS nationality,
          t.abbreviation AS team_abbr,
          t.name AS team_name,
          t.id AS team_id,
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

    } else if (metricKey.startsWith('wins_terrain_') || metricKey.startsWith('wins_weather_') || metricKey === 'wins') {
      // 3. Stage Wins
      let extraFilter = '';
      if (metricKey.startsWith('wins_terrain_')) {
        const terrain = metricKey.replace('wins_terrain_', '');
        extraFilter = `AND s.profile = ?`;
        params.push(terrain);
      } else if (metricKey.startsWith('wins_weather_')) {
        const weatherId = parseInt(metricKey.replace('wins_weather_', ''), 10);
        extraFilter = `AND s.rolled_weather_id = ?`;
        params.push(weatherId);
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
            COUNT(*) AS val
          FROM results res
          JOIN stages s ON s.id = res.stage_id
          JOIN riders r ON r.id = res.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE res.rank = 1 AND res.result_type_id = 1 AND r.is_retired = 0
            AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
            ${extraFilter}
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
        params.push(currentSeason);
      } else {
        query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            COUNT(*) AS val
          FROM results res
          JOIN stages s ON s.id = res.stage_id
          JOIN riders r ON r.id = res.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE res.rank = 1 AND res.result_type_id = 1 AND r.is_retired = 0
            ${extraFilter}
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
      }
      valueFormatter = (r) => `${r.val} Sieg${r.val !== 1 ? 'e' : ''}`;

    } else if (metricKey === 'uci_points') {
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
      } else {
        query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            SUM(spe.points_awarded) AS val
          FROM season_point_events spe
          JOIN riders r ON r.id = spe.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE r.is_retired = 0
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
      }
      valueFormatter = (r) => `${r.val} Pkt.`;

    } else if (metricKey === 'stage_scores') {
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
            SUM(s.stage_score) AS val
          FROM stage_entries se
          JOIN stages s ON s.id = se.stage_id
          JOIN riders r ON r.id = se.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE se.status = 'finished' AND r.is_retired = 0
            AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
        params.push(currentSeason);
      } else {
        query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            SUM(s.stage_score) AS val
          FROM stage_entries se
          JOIN stages s ON s.id = se.stage_id
          JOIN riders r ON r.id = se.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE se.status = 'finished' AND r.is_retired = 0
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
      }
      valueFormatter = (r) => `${r.val}`;

    } else if (metricKey === 'race_days' || metricKey.startsWith('race_days_terrain_')) {
      // 6. Race Days
      let extraFilter = '';
      if (metricKey.startsWith('race_days_terrain_')) {
        const terrain = metricKey.replace('race_days_terrain_', '');
        extraFilter = `AND s.profile = ?`;
        params.push(terrain);
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
            COUNT(*) AS val
          FROM stage_entries se
          JOIN stages s ON s.id = se.stage_id
          JOIN riders r ON r.id = se.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE se.status != 'dns' AND r.is_retired = 0
            AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
            ${extraFilter}
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
        params.push(currentSeason);
      } else {
        query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            COUNT(*) AS val
          FROM stage_entries se
          JOIN stages s ON s.id = se.stage_id
          JOIN riders r ON r.id = se.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE se.status != 'dns' AND r.is_retired = 0
            ${extraFilter}
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
      }
      valueFormatter = (r) => `${r.val} Tag${r.val !== 1 ? 'e' : ''}`;

    } else if (metricKey.startsWith('jersey_')) {
      // 7. Classification Jersey Wear Days
      let typeId = 2; // GC
      let label = 'Tage';
      if (metricKey === 'jersey_points') {
        typeId = 3;
      } else if (metricKey === 'jersey_mountain') {
        typeId = 4;
      } else if (metricKey === 'jersey_youth') {
        typeId = 5;
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
            COUNT(*) AS val
          FROM results res
          JOIN stages s ON s.id = res.stage_id
          JOIN riders r ON r.id = res.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE res.rank = 1 AND res.result_type_id = ? AND r.is_retired = 0
            AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
        params.push(typeId, currentSeason);
      } else {
        query = `
          SELECT 
            r.id AS id,
            r.first_name,
            r.last_name,
            c.code_3 AS nationality,
            t.abbreviation AS team_abbr,
            t.name AS team_name,
            t.id AS team_id,
            COUNT(*) AS val
          FROM results res
          JOIN riders r ON r.id = res.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE res.rank = 1 AND res.result_type_id = ? AND r.is_retired = 0
          GROUP BY r.id
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
        params.push(typeId);
      }
      valueFormatter = (r) => `${r.val} ${label}`;

    } else if (metricKey.startsWith('max_')) {
      // 8. Peak Fatigue & Form All-time
      if (!tableExists(this.db, 'rider_career_stats')) {
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
          rcs.${metricKey} AS val
        FROM riders r
        JOIN sta_country c ON c.id = r.country_id
        JOIN rider_career_stats rcs ON rcs.rider_id = r.id
        LEFT JOIN teams t ON t.id = r.active_team_id
        WHERE r.is_retired = 0 AND val > 0
        ORDER BY val DESC, r.last_name ASC
        LIMIT 100
      `;
      valueFormatter = (r) => r.val.toFixed(1);

    } else {
      // 9. Season stats / Career stats (crashes, defects, breakaway kms etc.)
      const isCareerField = [
        'breakaway_attempts', 'attacks', 'counter_attacks', 'crashes', 'defects',
        'illnesses', 'illness_days', 'injuries', 'injury_days'
      ].includes(metricKey);

      let selectExp = `rss.${metricKey}`;
      if (metricKey === 'superform_malus_days') {
        selectExp = 'rss.superform_days + rss.supermalus_days';
      } else if (metricKey === 'home_advantage_days_total') {
        selectExp = 'rss.home_advantage_days + rss.super_home_advantage_days + rss.home_pressure_days';
      }

      if (period === 'season') {
        if (!tableExists(this.db, 'rider_season_stats')) {
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
            ${selectExp} AS val
          FROM rider_season_stats rss
          JOIN riders r ON r.id = rss.rider_id
          JOIN sta_country c ON c.id = r.country_id
          LEFT JOIN teams t ON t.id = r.active_team_id
          WHERE rss.season = ? AND r.is_retired = 0 AND val > 0
          ORDER BY val DESC, r.last_name ASC
          LIMIT 100
        `;
        params.push(currentSeason);
      } else {
        // All-Time
        if (isCareerField && tableExists(this.db, 'rider_career_stats')) {
          query = `
            SELECT 
              r.id AS id,
              r.first_name,
              r.last_name,
              c.code_3 AS nationality,
              t.abbreviation AS team_abbr,
              t.name AS team_name,
              t.id AS team_id,
              rcs.${metricKey} AS val
            FROM rider_career_stats rcs
            JOIN riders r ON r.id = rcs.rider_id
            JOIN sta_country c ON c.id = r.country_id
            LEFT JOIN teams t ON t.id = r.active_team_id
            WHERE r.is_retired = 0 AND val > 0
            ORDER BY val DESC, r.last_name ASC
            LIMIT 100
          `;
        } else {
          // Sum from season stats
          if (!tableExists(this.db, 'rider_season_stats')) {
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
              SUM(${selectExp}) AS val
            FROM rider_season_stats rss
            JOIN riders r ON r.id = rss.rider_id
            JOIN sta_country c ON c.id = r.country_id
            LEFT JOIN teams t ON t.id = r.active_team_id
            WHERE r.is_retired = 0
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
      } else if (metricKey.includes('days')) {
        valueFormatter = (r) => `${r.val} Tag${r.val !== 1 ? 'e' : ''}`;
      } else if (metricKey === 'crashes') {
        valueFormatter = (r) => `${r.val} Sturz${r.val !== 1 ? 'e' : ''}`;
      } else if (metricKey === 'defects') {
        valueFormatter = (r) => `${r.val} Defekt${r.val !== 1 ? 'e' : ''}`;
      } else {
        valueFormatter = (r) => `${r.val}`;
      }
    }

    if (!query) {
      return [];
    }

    try {
      const rows = this.db.prepare(query).all(...params) as any[];
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
        rawValue: r.val ?? 0
      }));
    } catch (e: any) {
      console.error('Leaderboard query error:', e.message);
      return [];
    }
  }

  private getTeamLeaderboard(metricKey: string, period: 'season' | 'alltime', currentSeason: number): LeaderboardRow[] {
    let query = '';
    let params: any[] = [];
    let valueFormatter: (row: any) => string | number = (r) => r.val;

    if (metricKey.startsWith('wins_terrain_') || metricKey.startsWith('wins_weather_') || metricKey === 'wins') {
      // Stage wins: Rider wins + TTT wins
      let extraFilter = '';
      if (metricKey.startsWith('wins_terrain_')) {
        const terrain = metricKey.replace('wins_terrain_', '');
        extraFilter = `AND s.profile = ?`;
        params.push(terrain);
      } else if (metricKey.startsWith('wins_weather_')) {
        const weatherId = parseInt(metricKey.replace('wins_weather_', ''), 10);
        extraFilter = `AND s.rolled_weather_id = ?`;
        params.push(weatherId);
      }

      if (period === 'season') {
        query = `
          SELECT team_id, COUNT(*) AS val
          FROM (
            SELECT r.active_team_id AS team_id
            FROM results res
            JOIN stages s ON s.id = res.stage_id
            JOIN riders r ON r.id = res.rider_id
            WHERE res.rank = 1 AND res.result_type_id = 1
              AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
              ${extraFilter}
            UNION ALL
            SELECT res.team_id
            FROM results res
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
        params.push(currentSeason, currentSeason);
      } else {
        query = `
          SELECT team_id, COUNT(*) AS val
          FROM (
            SELECT r.active_team_id AS team_id
            FROM results res
            JOIN stages s ON s.id = res.stage_id
            JOIN riders r ON r.id = res.rider_id
            WHERE res.rank = 1 AND res.result_type_id = 1
              ${extraFilter}
            UNION ALL
            SELECT res.team_id
            FROM results res
            JOIN stages s ON s.id = res.stage_id
            WHERE res.rank = 1 AND res.result_type_id = 1 AND res.rider_id IS NULL
              ${extraFilter}
          )
          WHERE team_id IS NOT NULL
          GROUP BY team_id
          ORDER BY val DESC
          LIMIT 100
        `;
      }
      valueFormatter = (r) => `${r.val} Sieg${r.val !== 1 ? 'e' : ''}`;

    } else if (metricKey === 'uci_points') {
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
      } else {
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

    } else if (metricKey === 'stage_scores') {
      // Stage scores: Sum scores of team riders
      if (period === 'season') {
        query = `
          SELECT r.active_team_id AS team_id, SUM(s.stage_score) AS val
          FROM stage_entries se
          JOIN stages s ON s.id = se.stage_id
          JOIN riders r ON r.id = se.rider_id
          WHERE se.status = 'finished' AND r.active_team_id IS NOT NULL
            AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
          GROUP BY r.active_team_id
          ORDER BY val DESC
          LIMIT 100
        `;
        params.push(currentSeason);
      } else {
        query = `
          SELECT r.active_team_id AS team_id, SUM(s.stage_score) AS val
          FROM stage_entries se
          JOIN stages s ON s.id = se.stage_id
          JOIN riders r ON r.id = se.rider_id
          WHERE se.status = 'finished' AND r.active_team_id IS NOT NULL
          GROUP BY r.active_team_id
          ORDER BY val DESC
          LIMIT 100
        `;
      }
      valueFormatter = (r) => `${r.val}`;

    } else if (metricKey === 'race_days' || metricKey.startsWith('race_days_terrain_')) {
      // Race days: Sum race days of team riders
      let extraFilter = '';
      if (metricKey.startsWith('race_days_terrain_')) {
        const terrain = metricKey.replace('race_days_terrain_', '');
        extraFilter = `AND s.profile = ?`;
        params.push(terrain);
      }

      if (period === 'season') {
        query = `
          SELECT r.active_team_id AS team_id, COUNT(*) AS val
          FROM stage_entries se
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
      } else {
        query = `
          SELECT r.active_team_id AS team_id, COUNT(*) AS val
          FROM stage_entries se
          JOIN stages s ON s.id = se.stage_id
          JOIN riders r ON r.id = se.rider_id
          WHERE se.status != 'dns' AND r.active_team_id IS NOT NULL
            ${extraFilter}
          GROUP BY r.active_team_id
          ORDER BY val DESC
          LIMIT 100
        `;
      }
      valueFormatter = (r) => `${r.val} Tag${r.val !== 1 ? 'e' : ''}`;

    } else if (metricKey.startsWith('jersey_')) {
      // Trikottage (classification leadership)
      let typeId = 2; // GC
      if (metricKey === 'jersey_points') {
        typeId = 3;
      } else if (metricKey === 'jersey_mountain') {
        typeId = 4;
      } else if (metricKey === 'jersey_youth') {
        typeId = 5;
      }

      if (period === 'season') {
        query = `
          SELECT r.active_team_id AS team_id, COUNT(*) AS val
          FROM results res
          JOIN stages s ON s.id = res.stage_id
          JOIN riders r ON r.id = res.rider_id
          WHERE res.rank = 1 AND res.result_type_id = ? AND r.active_team_id IS NOT NULL
            AND CAST(substr(s.date, 1, 4) AS INTEGER) = ?
          GROUP BY r.active_team_id
          ORDER BY val DESC
          LIMIT 100
        `;
        params.push(typeId, currentSeason);
      } else {
        query = `
          SELECT r.active_team_id AS team_id, COUNT(*) AS val
          FROM results res
          JOIN riders r ON r.id = res.rider_id
          WHERE res.rank = 1 AND res.result_type_id = ? AND r.active_team_id IS NOT NULL
          GROUP BY r.active_team_id
          ORDER BY val DESC
          LIMIT 100
        `;
        params.push(typeId);
      }
      valueFormatter = (r) => `${r.val} Tage`;

    } else {
      // Sum other fields (breakaways, crashes etc.) from season stats
      let selectExp = `rss.${metricKey}`;
      if (metricKey === 'superform_malus_days') {
        selectExp = 'rss.superform_days + rss.supermalus_days';
      } else if (metricKey === 'home_advantage_days_total') {
        selectExp = 'rss.home_advantage_days + rss.super_home_advantage_days + rss.home_pressure_days';
      }

      if (period === 'season') {
        if (!tableExists(this.db, 'rider_season_stats')) {
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
      } else {
        if (!tableExists(this.db, 'rider_season_stats')) {
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
      } else if (metricKey.includes('days')) {
        valueFormatter = (r) => `${r.val} Tag${r.val !== 1 ? 'e' : ''}`;
      } else if (metricKey === 'crashes') {
        valueFormatter = (r) => `${r.val} Sturz${r.val !== 1 ? 'e' : ''}`;
      } else if (metricKey === 'defects') {
        valueFormatter = (r) => `${r.val} Defekt${r.val !== 1 ? 'e' : ''}`;
      } else {
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
      `).all(...params) as any[];

      return rows.map((r, idx) => ({
        rank: idx + 1,
        teamId: r.team_id,
        teamName: r.team_name,
        value: valueFormatter(r),
        rawValue: r.val ?? 0
      }));
    } catch (e: any) {
      console.error('Leaderboard query error:', e.message);
      return [];
    }
  }

  private getMentorsLeaderboard(currentSeason: number): LeaderboardRow[] {
    // Custom logic to rank veteran mentors by how many young riders (age <= 23) they mentor on their team
    if (!tableExists(this.db, 'riders')) {
      return [];
    }

    const riders = this.db.prepare(`
      SELECT riders.id, first_name, last_name, country.code_3 AS nationality, active_team_id, birth_year, overall_rating, specialization_1_id, specialization_2_id, specialization_3_id, 
             (SELECT abbreviation FROM teams WHERE id = riders.active_team_id) AS team_abbr,
             (SELECT name FROM teams WHERE id = riders.active_team_id) AS team_name
      FROM riders
      LEFT JOIN sta_country country ON country.id = riders.country_id
      WHERE is_retired = 0
    `).all() as any[];

    // Group riders by team
    const teamRidersMap = new Map<number, any[]>();
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
    const SPEC_TO_TYPE: Record<number, string> = {
      1: 'flat',
      2: 'mountain',
      3: 'mediumMountain',
      4: 'hill',
      5: 'timeTrial',
      6: 'sprint',
      7: 'cobble'
    };

    // Calculate U23 mentors
    const mentorCounts = new Map<number, number>(); // mentor_id -> count of mentored U23 riders

    for (const [teamId, teamRiders] of teamRidersMap.entries()) {
      const u23s = teamRiders.filter(r => (currentSeason - r.birth_year) <= 23);
      const veterans = teamRiders.filter(r => (currentSeason - r.birth_year) >= 31 && r.overall_rating >= 73);

      if (u23s.length === 0 || veterans.length === 0) continue;

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
    const rows: LeaderboardRow[] = [];
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

    rows.sort((a, b) => b.rawValue - a.rawValue || a.lastName!.localeCompare(b.lastName!));
    return rows.map((r, idx) => ({ ...r, rank: idx + 1 }));
  }
}
