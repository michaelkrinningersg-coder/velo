"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamCategoryStatsService = void 0;
class TeamCategoryStatsService {
    constructor(db) {
        this.db = db;
    }
    getProfileColumn(profile) {
        switch (profile) {
            case 'Flat': return 'win_flat';
            case 'Rolling': return 'win_rolling';
            case 'Hilly': return 'win_hilly';
            case 'Hilly_Difficult': return 'win_hilly_difficult';
            case 'Medium_Mountain': return 'win_medium_mountain';
            case 'Mountain': return 'win_mountain';
            case 'High_Mountain': return 'win_high_mountain';
            case 'Cobble': return 'win_cobble';
            case 'Cobble_Hill': return 'win_cobble_hill';
            case 'ITT': return 'win_itt';
            case 'TTT': return 'win_ttt';
            default: return null;
        }
    }
    recordStageResult(teamId, season, categoryName, rank, profile, weatherId, isStageRace) {
        let colToIncrement = '';
        if (!isStageRace) {
            if (rank === 1)
                colToIncrement = 'one_day_wins';
            else if (rank === 2)
                colToIncrement = 'one_day_second';
            else if (rank === 3)
                colToIncrement = 'one_day_third';
            else if (rank > 3 && rank <= 10)
                colToIncrement = 'one_day_top_ten';
        }
        else {
            if (rank === 1)
                colToIncrement = 'stage_wins';
            else if (rank === 2)
                colToIncrement = 'stage_second';
            else if (rank === 3)
                colToIncrement = 'stage_third';
            else if (rank > 3 && rank <= 10)
                colToIncrement = 'stage_top_ten';
        }
        const updates = [];
        if (colToIncrement) {
            updates.push(`${colToIncrement} = ${colToIncrement} + 1`);
        }
        if (rank === 1) {
            const profileCol = this.getProfileColumn(profile);
            if (profileCol) {
                updates.push(`${profileCol} = ${profileCol} + 1`);
            }
            if (weatherId !== null && weatherId >= 1 && weatherId <= 7) {
                updates.push(`win_weather_${weatherId} = win_weather_${weatherId} + 1`);
            }
        }
        if (updates.length === 0)
            return;
        // First ensure the row exists (ON CONFLICT DO UPDATE handles the upsert cleanly)
        const sql = `
      INSERT INTO team_season_category_stats (
        team_id, season, category_name,
        one_day_wins, one_day_second, one_day_third, one_day_top_ten,
        stage_wins, stage_second, stage_third, stage_top_ten,
        gc_wins, gc_second, gc_third, gc_top_ten,
        points_wins, mountain_wins, youth_wins, breakaway_wins,
        win_flat, win_rolling, win_hilly, win_hilly_difficult,
        win_medium_mountain, win_mountain, win_high_mountain,
        win_cobble, win_cobble_hill, win_itt, win_ttt,
        win_weather_1, win_weather_2, win_weather_3, win_weather_4,
        win_weather_5, win_weather_6, win_weather_7
      )
      VALUES (
        ?, ?, ?,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0
      )
      ON CONFLICT(team_id, season, category_name) DO UPDATE SET
        ${updates.join(', ')}
    `;
        this.db.prepare(sql).run(teamId, season, categoryName);
    }
    recordGcResult(teamId, season, categoryName, rank, resultTypeId) {
        let colToIncrement = '';
        if (resultTypeId === 2 || resultTypeId === 6) { // Individual GC or Team GC
            if (rank === 1)
                colToIncrement = 'gc_wins';
            else if (rank === 2)
                colToIncrement = 'gc_second';
            else if (rank === 3)
                colToIncrement = 'gc_third';
            else if (rank > 3 && rank <= 10)
                colToIncrement = 'gc_top_ten';
        }
        else if (resultTypeId === 3) {
            if (rank === 1)
                colToIncrement = 'points_wins';
        }
        else if (resultTypeId === 4) {
            if (rank === 1)
                colToIncrement = 'mountain_wins';
        }
        else if (resultTypeId === 5) {
            if (rank === 1)
                colToIncrement = 'youth_wins';
        }
        else if (resultTypeId === 7) {
            if (rank === 1)
                colToIncrement = 'breakaway_wins';
        }
        if (!colToIncrement)
            return;
        const sql = `
      INSERT INTO team_season_category_stats (
        team_id, season, category_name,
        one_day_wins, one_day_second, one_day_third, one_day_top_ten,
        stage_wins, stage_second, stage_third, stage_top_ten,
        gc_wins, gc_second, gc_third, gc_top_ten,
        points_wins, mountain_wins, youth_wins, breakaway_wins,
        win_flat, win_rolling, win_hilly, win_hilly_difficult,
        win_medium_mountain, win_mountain, win_high_mountain,
        win_cobble, win_cobble_hill, win_itt, win_ttt,
        win_weather_1, win_weather_2, win_weather_3, win_weather_4,
        win_weather_5, win_weather_6, win_weather_7
      )
      VALUES (
        ?, ?, ?,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0
      )
      ON CONFLICT(team_id, season, category_name) DO UPDATE SET
        ${colToIncrement} = ${colToIncrement} + 1
    `;
        this.db.prepare(sql).run(teamId, season, categoryName);
    }
}
exports.TeamCategoryStatsService = TeamCategoryStatsService;
