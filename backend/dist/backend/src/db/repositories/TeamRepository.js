"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRepository = void 0;
const mappers_1 = require("../mappers");
const RiderRepository_1 = require("./RiderRepository");
class TeamRepository {
    constructor(db) {
        this.db = db;
    }
    getTeams() {
        const rows = this.db.prepare(`
      SELECT t.id, t.name, t.abbreviation, t.division_id, t.u23_team,
             main.id AS main_team_id,
             t.is_player_team, t.country_id,
             country.name AS country_name,
             country.code_3 AS country_code_3,
             country.continent AS country_continent,
             country.regen_rating AS country_regen_rating,
             country.number_regen_min AS country_number_regen_min,
             country.number_regen_max AS country_number_regen_max,
             t.color_primary, t.color_secondary,
             t.ai_focus_1, t.ai_focus_2, t.ai_focus_3,
             u23.name AS u23_team_name,
             main.name AS main_team_name,
             dt.name AS division_name
      FROM teams t
      JOIN division_teams dt ON dt.id = t.division_id
      JOIN sta_country country ON country.id = t.country_id
      LEFT JOIN teams u23 ON u23.id = t.u23_team
      LEFT JOIN teams main ON main.u23_team = t.id
      ORDER BY dt.tier ASC, t.name ASC
    `).all();
        return rows.map(mappers_1.mapTeam);
    }
    getTeamById(id) {
        const row = this.db.prepare(`
      SELECT t.id, t.name, t.abbreviation, t.division_id, t.u23_team,
             main.id AS main_team_id,
             t.is_player_team, t.country_id,
             country.name AS country_name,
             country.code_3 AS country_code_3,
             country.continent AS country_continent,
             country.regen_rating AS country_regen_rating,
             country.number_regen_min AS country_number_regen_min,
             country.number_regen_max AS country_number_regen_max,
             t.color_primary, t.color_secondary,
             t.ai_focus_1, t.ai_focus_2, t.ai_focus_3,
             u23.name AS u23_team_name,
             main.name AS main_team_name,
             dt.name AS division_name
      FROM teams t
      JOIN division_teams dt ON dt.id = t.division_id
      JOIN sta_country country ON country.id = t.country_id
      LEFT JOIN teams u23 ON u23.id = t.u23_team
      LEFT JOIN teams main ON main.u23_team = t.id
      WHERE t.id = ?
    `).get(id);
        return row ? (0, mappers_1.mapTeam)(row) : null;
    }
    getTeamStats(teamId) {
        const team = this.getTeamById(teamId);
        if (!team) {
            return null;
        }
        const riders = new RiderRepository_1.RiderRepository(this.db).getRiders(teamId);
        // 1. Map Riders
        const teamRiders = riders.map((rider) => ({
            id: rider.id,
            firstName: rider.firstName,
            lastName: rider.lastName,
            age: rider.age ?? 0,
            nationality: rider.nationality,
            overallRating: rider.overallRating,
            seasonPoints: rider.seasonPoints ?? 0,
            seasonWins: rider.seasonWins ?? 0,
            formBonus: rider.formBonus ?? 0,
            raceFormBonus: rider.raceFormBonus ?? 0,
            skills: rider.skills,
            contractEndSeason: rider.contractEndSeason ?? null,
        }));
        // 2. Query Top Results (points > 0)
        const topResultsRows = this.db.prepare(`
      SELECT
        spe.season,
        spe.race_id,
        spe.stage_id,
        spe.rider_id,
        r.first_name AS rider_first_name,
        r.last_name AS rider_last_name,
        c.code_3 AS rider_country_code,
        races.name AS race_name,
        cat.name AS race_category_name,
        races.is_stage_race AS is_stage_race,
        stages.stage_number AS stage_number,
        stages.date AS date,
        stages.profile AS profile,
        spe.award_type,
        spe.rank AS result_rank,
        spe.points_awarded AS season_points,
        stages.stage_score AS stage_score,
        results.event_ids AS event_ids,
        results.jerseys_worn AS jerseys_worn,
        stages.super_team_id AS super_team_id,
        spe.team_id AS team_id
      FROM season_point_events spe
      JOIN riders r ON r.id = spe.rider_id
      JOIN sta_country c ON c.id = r.country_id
      JOIN stages ON stages.id = spe.stage_id
      JOIN races ON races.id = spe.race_id
      JOIN race_categories cat ON cat.id = races.category_id
      LEFT JOIN results ON results.stage_id = spe.stage_id AND results.rider_id = spe.rider_id AND results.result_type_id = 1
      WHERE spe.team_id = ?
        AND spe.points_awarded > 0
        AND spe.award_type IN ('stage_result', 'one_day_result', 'gc_final', 'points_final', 'mountain_final', 'youth_final')
      ORDER BY spe.points_awarded DESC, stages.date DESC
    `).all(teamId);
        const topResults = topResultsRows.map((row) => {
            let rowType = 'stage_result';
            if (row.award_type === 'gc_final')
                rowType = 'gc_final';
            else if (row.award_type === 'points_final')
                rowType = 'points_final';
            else if (row.award_type === 'mountain_final')
                rowType = 'mountain_final';
            else if (row.award_type === 'youth_final')
                rowType = 'youth_final';
            return {
                riderId: row.rider_id,
                riderName: `${row.rider_first_name} ${row.rider_last_name}`,
                riderCountryCode: row.rider_country_code,
                rowType,
                date: row.date,
                raceId: row.race_id,
                raceName: row.race_name,
                raceCategoryName: row.race_category_name,
                stageId: row.stage_id,
                stageNumber: row.stage_number,
                resultRank: row.result_rank,
                gcRank: null,
                finishStatus: 'classified',
                statusReason: null,
                profile: row.profile,
                seasonPoints: row.season_points,
                season: row.season,
                stageScore: row.stage_score,
                eventIds: row.event_ids,
                jerseysWorn: row.jerseys_worn,
                superTeamId: row.super_team_id ?? null,
                teamId: row.team_id ?? null,
            };
        });
        // Query TTT team results directly from results table
        const tttRows = this.db.prepare(`
      SELECT
        CAST(substr(stages.date, 1, 4) AS INTEGER) AS season,
        races.id AS race_id,
        stages.id AS stage_id,
        races.name AS race_name,
        cat.name AS race_category_name,
        races.is_stage_race AS is_stage_race,
        stages.stage_number AS stage_number,
        stages.date AS date,
        stages.profile AS profile,
        results.rank AS result_rank,
        stages.stage_score AS stage_score,
        cat_bonus.points_stage AS points_stage,
        stages.super_team_id AS super_team_id,
        results.team_id AS team_id
      FROM results
      JOIN stages ON stages.id = results.stage_id
      JOIN races ON races.id = stages.race_id
      JOIN race_categories cat ON cat.id = races.category_id
      JOIN race_categories_bonus cat_bonus ON cat_bonus.id = cat.bonus_system_id
      WHERE results.team_id = ?
        AND results.rider_id IS NULL
        AND results.result_type_id = 1
        AND stages.profile = 'TTT'
    `).all(teamId);
        for (const row of tttRows) {
            const pointsList = (0, mappers_1.parseRankedValues)(row.points_stage);
            const points = pointsList[row.result_rank - 1] ?? 0;
            if (points > 0) {
                topResults.push({
                    riderId: null,
                    riderName: 'Mannschaftszeitfahren',
                    riderCountryCode: null,
                    rowType: 'stage_result',
                    date: row.date,
                    raceId: row.race_id,
                    raceName: row.race_name,
                    raceCategoryName: row.race_category_name,
                    stageId: row.stage_id,
                    stageNumber: row.stage_number,
                    resultRank: row.result_rank,
                    gcRank: null,
                    finishStatus: 'classified',
                    statusReason: null,
                    profile: row.profile,
                    seasonPoints: points,
                    season: row.season,
                    stageScore: row.stage_score,
                    superTeamId: row.super_team_id ?? null,
                    teamId: row.team_id ?? null,
                });
            }
        }
        // Sort descending by points, then date
        topResults.sort((a, b) => b.seasonPoints - a.seasonPoints || b.date.localeCompare(a.date));
        // 3. Build successStats by season & 'all'
        const successStats = {};
        const seasonsRows = this.db.prepare(`
      SELECT DISTINCT CAST(substr(date, 1, 4) AS INTEGER) AS season FROM stages
    `).all();
        const activeSeasons = seasonsRows.map((r) => r.season).sort((a, b) => b - a);
        const initSuccessStats = () => {
            const categories = {};
            const knownCategories = [
                'World Tour - Tour de France',
                'World Tour - Grand Tour',
                'World Tour - Monument',
                'World Tour - Stage Race High',
                'World Tour - Stage Race Middle',
                'World Tour - Stage Race Low',
                'World Tour - One Day High',
                'World Tour - One Day Middle',
                'World Tour - One Day Low'
            ];
            for (const cat of knownCategories) {
                categories[cat] = {
                    gcWins: 0,
                    gcSecond: 0,
                    gcThird: 0,
                    gcTopTen: 0,
                    stageWins: 0,
                    stageSecond: 0,
                    stageThird: 0,
                    stageTopTen: 0,
                    oneDayWins: 0,
                    oneDaySecond: 0,
                    oneDayThird: 0,
                    oneDayTopTen: 0,
                    mountainWins: 0,
                    pointsWins: 0,
                    youthWins: 0,
                    breakawayWins: 0,
                    raceDays: 0,
                    leaderJerseys: 0,
                    pointsJerseys: 0,
                    mountainJerseys: 0,
                    youthJerseys: 0,
                    breakawayJerseys: 0,
                    sprintWins: 0,
                    climbWinsHC: 0,
                    climbWins1: 0,
                    climbWins2: 0,
                    climbWins3: 0,
                    climbWins4: 0,
                    winFlat: 0,
                    winRolling: 0,
                    winHilly: 0,
                    winHillyDifficult: 0,
                    winMediumMountain: 0,
                    winMountain: 0,
                    winHighMountain: 0,
                    winCobble: 0,
                    winCobbleHill: 0,
                    winITT: 0,
                    winTTT: 0,
                    winWeather1: 0,
                    winWeather2: 0,
                    winWeather3: 0,
                    winWeather4: 0,
                    winWeather5: 0,
                    winWeather6: 0,
                    winWeather7: 0,
                };
            }
            return {
                breakawayAttempts: 0,
                attacks: 0,
                counterAttacks: 0,
                crashes: 0,
                defects: 0,
                illnesses: 0,
                illnessDays: 0,
                injuries: 0,
                injuryDays: 0,
                dnsCount: 0,
                dnfCount: 0,
                otlCount: 0,
                totalGcWins: 0,
                totalStageWins: 0,
                successfulBreakaways: 0,
                raceDays: 0,
                superteamCount: 0,
                categories,
            };
        };
        // Initialize map
        successStats['all'] = initSuccessStats();
        for (const yr of activeSeasons) {
            successStats[String(yr)] = initSuccessStats();
        }
        // A. Query career stats (lifetime totals for team riders)
        const careerStatsStmt = this.db.prepare(`
      SELECT
        SUM(breakaway_attempts) AS breakaway_attempts,
        SUM(attacks) AS attacks,
        SUM(counter_attacks) AS counter_attacks,
        SUM(crashes) AS crashes,
        SUM(defects) AS defects,
        SUM(illnesses) AS illnesses,
        SUM(illness_days) AS illness_days,
        SUM(injuries) AS injuries,
        SUM(injury_days) AS injury_days
      FROM rider_career_stats
      WHERE rider_id IN (SELECT id FROM riders WHERE active_team_id = ? AND is_retired = 0)
    `);
        const cStatsRow = careerStatsStmt.get(teamId);
        if (cStatsRow) {
            const allStats = successStats['all'];
            allStats.breakawayAttempts = cStatsRow.breakaway_attempts ?? 0;
            allStats.attacks = cStatsRow.attacks ?? 0;
            allStats.counterAttacks = cStatsRow.counter_attacks ?? 0;
            allStats.crashes = cStatsRow.crashes ?? 0;
            allStats.defects = cStatsRow.defects ?? 0;
            allStats.illnesses = cStatsRow.illnesses ?? 0;
            allStats.illnessDays = cStatsRow.illness_days ?? 0;
            allStats.injuries = cStatsRow.injuries ?? 0;
            allStats.injuryDays = cStatsRow.injury_days ?? 0;
        }
        // B. Query DNS / DNF / OTL
        const nonFinisherRows = this.db.prepare(`
      SELECT
        CAST(substr(stages.date, 1, 4) AS INTEGER) AS season,
        stage_entries.status,
        stage_entries.status_reason
      FROM stage_entries
      JOIN stages ON stages.id = stage_entries.stage_id
      WHERE stage_entries.team_id = ? AND stage_entries.status IN ('dns', 'dnf')
    `).all(teamId);
        for (const row of nonFinisherRows) {
            const statsList = [successStats['all'], successStats[String(row.season)]].filter(Boolean);
            for (const stats of statsList) {
                if (row.status === 'dns') {
                    stats.dnsCount++;
                }
                else if (row.status === 'dnf') {
                    if (row.status_reason?.startsWith('OTL ')) {
                        stats.otlCount++;
                    }
                    else {
                        stats.dnfCount++;
                    }
                }
            }
        }
        // C. Query Race Days
        const raceDaysRows = this.db.prepare(`
      SELECT
        CAST(substr(stages.date, 1, 4) AS INTEGER) AS season,
        COUNT(DISTINCT se.stage_id) AS race_days
      FROM stage_entries se
      JOIN stages ON stages.id = se.stage_id
      WHERE se.team_id = ? AND se.status != 'dns'
      GROUP BY season
    `).all(teamId);
        for (const row of raceDaysRows) {
            const statsList = [successStats['all'], successStats[String(row.season)]].filter(Boolean);
            for (const stats of statsList) {
                stats.raceDays += row.race_days;
            }
        }
        // D. Query category race days
        const catRaceDaysRows = this.db.prepare(`
      SELECT
        CAST(substr(stages.date, 1, 4) AS INTEGER) AS season,
        cat.name AS category_name,
        COUNT(DISTINCT se.stage_id) AS race_days
      FROM stage_entries se
      JOIN stages ON stages.id = se.stage_id
      JOIN races ON races.id = stages.race_id
      JOIN race_categories cat ON cat.id = races.category_id
      WHERE se.team_id = ? AND se.status != 'dns'
      GROUP BY season, category_name
    `).all(teamId);
        for (const row of catRaceDaysRows) {
            const statsList = [successStats['all'], successStats[String(row.season)]].filter(Boolean);
            for (const stats of statsList) {
                let catStats = stats.categories[row.category_name];
                if (catStats) {
                    catStats.raceDays += row.race_days;
                }
            }
        }
        // E. Query breakaway attempts (seasonal)
        const breakawayRows = this.db.prepare(`
      SELECT
        CAST(substr(stages.date, 1, 4) AS INTEGER) AS season,
        COUNT(*) AS count
      FROM results
      JOIN stages ON stages.id = results.stage_id
      WHERE results.team_id = ? AND results.result_type_id = 1 AND results.is_breakaway = 1
      GROUP BY season
    `).all(teamId);
        for (const row of breakawayRows) {
            const statsList = [successStats['all'], successStats[String(row.season)]].filter(Boolean);
            for (const stats of statsList) {
                stats.breakawayAttempts += row.count;
            }
        }
        // F. Query successful breakaways
        const successfulBreakawayRows = this.db.prepare(`
      SELECT
        CAST(substr(s.date, 1, 4) AS INTEGER) AS season,
        COUNT(*) AS count
      FROM results r1
      JOIN stages s ON s.id = r1.stage_id
      WHERE r1.team_id = ?
        AND r1.result_type_id = 1
        AND r1.is_breakaway = 1
        AND NOT EXISTS (
          SELECT 1 FROM results r2
          WHERE r2.stage_id = r1.stage_id
            AND r2.result_type_id = 1
            AND r2.rank < r1.rank
            AND r2.is_breakaway = 0
        )
      GROUP BY season
    `).all(teamId);
        for (const row of successfulBreakawayRows) {
            const statsList = [successStats['all'], successStats[String(row.season)]].filter(Boolean);
            for (const stats of statsList) {
                stats.successfulBreakaways += row.count;
            }
        }
        // G. Query GC & Stage results
        const resultsRows = this.db.prepare(`
      SELECT
        CAST(substr(stages.date, 1, 4) AS INTEGER) AS season,
        r.result_type_id AS result_type_id,
        r.rank AS rank,
        races.is_stage_race AS is_stage_race,
        races.number_of_stages AS number_of_stages,
        stages.stage_number AS stage_number,
        stages.profile AS profile,
        cat.name AS category_name,
        stages.rolled_weather_id AS rolled_weather_id
      FROM results r
      JOIN stages ON stages.id = r.stage_id
      JOIN races ON races.id = stages.race_id
      JOIN race_categories cat ON cat.id = races.category_id
      WHERE r.team_id = ?
    `).all(teamId);
        for (const row of resultsRows) {
            const statsList = [successStats['all'], successStats[String(row.season)]].filter(Boolean);
            for (const stats of statsList) {
                let catStats = stats.categories[row.category_name];
                if (!catStats) {
                    continue;
                }
                const rank = row.rank;
                const isStageRace = row.is_stage_race === 1;
                const isFinalStage = row.stage_number === row.number_of_stages;
                if (row.result_type_id === 1) { // Stage result
                    if (rank === 1) {
                        const profile = row.profile;
                        if (profile === 'Flat')
                            catStats.winFlat++;
                        else if (profile === 'Rolling')
                            catStats.winRolling++;
                        else if (profile === 'Hilly')
                            catStats.winHilly++;
                        else if (profile === 'Hilly_Difficult')
                            catStats.winHillyDifficult++;
                        else if (profile === 'Medium_Mountain')
                            catStats.winMediumMountain++;
                        else if (profile === 'Mountain')
                            catStats.winMountain++;
                        else if (profile === 'High_Mountain')
                            catStats.winHighMountain++;
                        else if (profile === 'Cobble')
                            catStats.winCobble++;
                        else if (profile === 'Cobble_Hill')
                            catStats.winCobbleHill++;
                        else if (profile === 'ITT')
                            catStats.winITT++;
                        else if (profile === 'TTT')
                            catStats.winTTT++;
                        if (row.rolled_weather_id != null && row.rolled_weather_id >= 1 && row.rolled_weather_id <= 7) {
                            const weatherKey = `winWeather${row.rolled_weather_id}`;
                            catStats[weatherKey]++;
                        }
                    }
                    if (!isStageRace) {
                        if (rank === 1)
                            catStats.oneDayWins++;
                        else if (rank === 2)
                            catStats.oneDaySecond++;
                        else if (rank === 3)
                            catStats.oneDayThird++;
                        else if (rank > 3 && rank <= 10)
                            catStats.oneDayTopTen++;
                    }
                    else {
                        if (rank === 1)
                            catStats.stageWins++;
                        else if (rank === 2)
                            catStats.stageSecond++;
                        else if (rank === 3)
                            catStats.stageThird++;
                        else if (rank > 3 && rank <= 10)
                            catStats.stageTopTen++;
                    }
                }
                else if ((row.result_type_id === 2 || row.result_type_id === 6) && isStageRace && isFinalStage) { // GC
                    if (rank === 1)
                        catStats.gcWins++;
                    else if (rank === 2)
                        catStats.gcSecond++;
                    else if (rank === 3)
                        catStats.gcThird++;
                    else if (rank > 3 && rank <= 10)
                        catStats.gcTopTen++;
                }
                else if (row.result_type_id === 3 && isStageRace && isFinalStage) { // Points
                    if (rank === 1)
                        catStats.pointsWins++;
                }
                else if (row.result_type_id === 4 && isStageRace && isFinalStage) { // Mountain
                    if (rank === 1)
                        catStats.mountainWins++;
                }
                else if (row.result_type_id === 5 && isStageRace && isFinalStage) { // Youth
                    if (rank === 1)
                        catStats.youthWins++;
                }
                else if (row.result_type_id === 7 && isStageRace && isFinalStage) { // Breakaway
                    if (rank === 1)
                        catStats.breakawayWins = (catStats.breakawayWins ?? 0) + 1;
                }
            }
        }
        // H. Query leader jerseys
        const leaderJerseyRows = this.db.prepare(`
      SELECT
        CAST(substr(stages.date, 1, 4) AS INTEGER) AS season,
        cat.name AS category_name,
        r.result_type_id,
        COUNT(*) AS count
      FROM results r
      JOIN stages ON stages.id = r.stage_id
      JOIN races ON races.id = stages.race_id
      JOIN race_categories cat ON cat.id = races.category_id
      WHERE r.team_id = ?
        AND r.result_type_id IN (2, 3, 4, 5, 7)
        AND r.rank = 1
        AND races.is_stage_race = 1
      GROUP BY season, category_name, r.result_type_id
    `).all(teamId);
        for (const row of leaderJerseyRows) {
            const statsList = [successStats['all'], successStats[String(row.season)]].filter(Boolean);
            for (const stats of statsList) {
                let catStats = stats.categories[row.category_name];
                if (catStats) {
                    if (row.result_type_id === 2) {
                        catStats.leaderJerseys = row.count;
                    }
                    else if (row.result_type_id === 3) {
                        catStats.pointsJerseys = row.count;
                    }
                    else if (row.result_type_id === 4) {
                        catStats.mountainJerseys = row.count;
                    }
                    else if (row.result_type_id === 5) {
                        catStats.youthJerseys = row.count;
                    }
                    else if (row.result_type_id === 7) {
                        catStats.breakawayJerseys = row.count;
                    }
                }
            }
        }
        // I. Query Checkpoint Wins
        const checkpointWinsRows = this.db.prepare(`
      SELECT
        CAST(substr(stages.date, 1, 4) AS INTEGER) AS season,
        cat.name AS category_name,
        smr.marker_type,
        smr.marker_category,
        COUNT(*) AS count
      FROM stage_marker_results smr
      JOIN stages ON stages.id = smr.stage_id
      JOIN races ON races.id = smr.race_id
      JOIN race_categories cat ON cat.id = races.category_id
      WHERE smr.team_id = ? AND smr.rank = 1
      GROUP BY season, category_name, smr.marker_type, smr.marker_category
    `).all(teamId);
        for (const row of checkpointWinsRows) {
            const statsList = [successStats['all'], successStats[String(row.season)]].filter(Boolean);
            for (const stats of statsList) {
                let catStats = stats.categories[row.category_name];
                if (catStats) {
                    const mType = row.marker_type;
                    const mCat = row.marker_category;
                    if (mType === 'sprint_intermediate' || mCat === 'Sprint') {
                        catStats.sprintWins += row.count;
                    }
                    if (mCat === 'HC') {
                        catStats.climbWinsHC += row.count;
                    }
                    else if (mCat === '1') {
                        catStats.climbWins1 += row.count;
                    }
                    else if (mCat === '2') {
                        catStats.climbWins2 += row.count;
                    }
                    else if (mCat === '3') {
                        catStats.climbWins3 += row.count;
                    }
                    else if (mCat === '4') {
                        catStats.climbWins4 += row.count;
                    }
                }
            }
        }
        // J. Query superteam counts from stages
        if ((0, mappers_1.tableExists)(this.db, 'stages')) {
            const superteamCountRows = this.db.prepare(`
        SELECT CAST(substr(date, 1, 4) AS INTEGER) AS season, COUNT(*) AS count
        FROM stages
        WHERE super_team_id = ?
        GROUP BY season
      `).all(teamId);
            for (const row of superteamCountRows) {
                const yrStr = String(row.season);
                if (successStats[yrStr]) {
                    successStats[yrStr].superteamCount = row.count;
                }
                successStats['all'].superteamCount += row.count;
            }
        }
        // Calculate totalGcWins & totalStageWins for each season / all
        for (const key of Object.keys(successStats)) {
            const stats = successStats[key];
            let totalGcWins = 0;
            let totalStageWins = 0;
            for (const catName of Object.keys(stats.categories)) {
                totalGcWins += stats.categories[catName].gcWins + stats.categories[catName].oneDayWins;
                totalStageWins += stats.categories[catName].stageWins;
            }
            stats.totalGcWins = totalGcWins;
            stats.totalStageWins = totalStageWins;
        }
        return {
            teamId: team.id,
            teamName: team.name,
            abbreviation: team.abbreviation,
            divisionName: team.divisionName ?? null,
            countryCode: team.country?.code3 ?? null,
            riders: teamRiders,
            topResults,
            successStats,
        };
    }
}
exports.TeamRepository = TeamRepository;
