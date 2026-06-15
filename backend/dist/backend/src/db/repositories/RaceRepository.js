"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaceRepository = void 0;
const mappers_1 = require("../mappers");
const GameStateRepository_1 = require("./GameStateRepository");
const RiderRepository_1 = require("./RiderRepository");
const TeamRepository_1 = require("./TeamRepository");
class RaceRepository {
    constructor(db) {
        this.db = db;
    }
    getRaceProgramsForRace(raceId) {
        if (!(0, mappers_1.tableExists)(this.db, 'race_programs') || !(0, mappers_1.tableExists)(this.db, 'race_program_races')) {
            return [];
        }
        const rows = this.db.prepare(`
      SELECT race_programs.id,
             race_programs.name,
             race_programs.peak1_min,
             race_programs.peak1_max,
             race_programs.peak2_min,
             race_programs.peak2_max,
             race_programs.peak3_min,
             race_programs.peak3_max
      FROM race_programs
      JOIN race_program_races ON race_program_races.program_id = race_programs.id
      WHERE race_program_races.race_id = ?
      ORDER BY race_programs.id ASC
    `).all(raceId);
        return rows.map(mappers_1.mapRaceProgram);
    }
    getRaceProgramParticipants(raceId) {
        const season = new GameStateRepository_1.GameStateRepository(this.db).getCurrentSeason();
        if (!(0, mappers_1.tableExists)(this.db, 'rider_season_programs') || !(0, mappers_1.tableExists)(this.db, 'race_program_races')) {
            return [];
        }
        const race = this.getRaces().find((entry) => entry.id === raceId);
        const targetDivision = race?.category?.tier != null ? mappers_1.DIVISION_BY_TIER[race.category.tier] : undefined;
        const rows = this.db.prepare(`
      SELECT rider_season_programs.rider_id,
             race_programs.id AS program_id,
             race_programs.name AS program_name,
             race_programs.peak1_min,
             race_programs.peak1_max,
             race_programs.peak2_min,
             race_programs.peak2_max,
             race_programs.peak3_min,
             race_programs.peak3_max
      FROM rider_season_programs
      JOIN race_programs ON race_programs.id = rider_season_programs.program_id
      JOIN race_program_races ON race_program_races.program_id = rider_season_programs.program_id
      WHERE rider_season_programs.season = ?
        AND race_program_races.race_id = ?
      ORDER BY race_programs.id ASC, rider_season_programs.rider_id ASC
    `).all(season, raceId);
        const ridersById = new Map(new RiderRepository_1.RiderRepository(this.db).getRiders().map((rider) => [rider.id, rider]));
        const teamsById = new Map(new TeamRepository_1.TeamRepository(this.db).getTeams().map((team) => [team.id, team]));
        const participants = [];
        for (const row of rows) {
            const rider = ridersById.get(row.rider_id);
            if (!rider) {
                continue;
            }
            participants.push({
                rider,
                team: rider.activeTeamId != null ? teamsById.get(rider.activeTeamId) ?? null : null,
                program: {
                    id: row.program_id,
                    name: row.program_name,
                    peak1Min: row.peak1_min,
                    peak1Max: row.peak1_max,
                    peak2Min: row.peak2_min,
                    peak2Max: row.peak2_max,
                    peak3Min: row.peak3_min,
                    peak3Max: row.peak3_max,
                },
            });
        }
        if (race && (0, mappers_1.isWinterBreak)(race.startDate)) {
            return [];
        }
        const ridersByTeamId = new Map();
        for (const rider of ridersById.values()) {
            if (rider.activeTeamId == null)
                continue;
            const teamRiders = ridersByTeamId.get(rider.activeTeamId) ?? [];
            teamRiders.push(rider);
            ridersByTeamId.set(rider.activeTeamId, teamRiders);
        }
        const winterLockedRiderIds = new Set();
        for (const teamRiders of ridersByTeamId.values()) {
            const topTwo = [...teamRiders].sort((a, b) => b.overallRating - a.overallRating).slice(0, 2);
            for (const rider of topTwo) {
                winterLockedRiderIds.add(rider.id);
            }
        }
        const excludedRiderIds = new Set();
        if (race && (race.categoryId === 6 || race.categoryId === 9)) {
            for (const teamRiders of ridersByTeamId.values()) {
                // Find best Co-Captain (roleId === 2)
                const coCaptains = teamRiders.filter((r) => r.roleId === 2);
                if (coCaptains.length > 0) {
                    coCaptains.sort((a, b) => b.overallRating - a.overallRating || a.lastName.localeCompare(b.lastName, 'de') || a.firstName.localeCompare(b.firstName, 'de') || a.id - b.id);
                    excludedRiderIds.add(coCaptains[0].id);
                }
                // Find best Sprinter (roleId === 6)
                const sprinters = teamRiders.filter((r) => r.roleId === 6);
                if (sprinters.length > 0) {
                    sprinters.sort((a, b) => b.overallRating - a.overallRating || a.lastName.localeCompare(b.lastName, 'de') || a.firstName.localeCompare(b.firstName, 'de') || a.id - b.id);
                    excludedRiderIds.add(sprinters[0].id);
                }
                // Lock all Captains (roleId === 1)
                const captains = teamRiders.filter((r) => r.roleId === 1);
                for (const cap of captains) {
                    excludedRiderIds.add(cap.id);
                }
            }
        }
        for (let i = participants.length - 1; i >= 0; i--) {
            const riderId = participants[i].rider.id;
            if (winterLockedRiderIds.has(riderId) || excludedRiderIds.has(riderId)) {
                participants.splice(i, 1);
            }
        }
        return participants
            .filter((entry) => targetDivision == null || entry.team?.division === targetDivision)
            .sort((left, right) => {
            const teamCompare = (left.team?.name ?? '').localeCompare(right.team?.name ?? '', 'de');
            if (teamCompare !== 0)
                return teamCompare;
            const roleCompare = (left.rider.roleId ?? 99) - (right.rider.roleId ?? 99);
            if (roleCompare !== 0)
                return roleCompare;
            return right.rider.overallRating - left.rider.overallRating || left.rider.lastName.localeCompare(right.rider.lastName, 'de');
        });
    }
    getRaces(season) {
        const requestedSeason = season ?? new GameStateRepository_1.GameStateRepository(this.db).getCurrentSeason();
        const currentDate = new GameStateRepository_1.GameStateRepository(this.db).getCurrentDate();
        const rows = this.db.prepare(`
      ${(0, mappers_1.buildRaceSelect)()}
      WHERE CAST(substr(races.start_date, 1, 4) AS INTEGER) = ?
      ORDER BY races.start_date ASC, races.id ASC
    `).all(requestedSeason);
        const stagesByRaceId = new RaceRepository(this.db).getStagesByRaceIds(rows.map(row => row.id));
        return rows.map((row) => {
            const stages = stagesByRaceId.get(row.id) ?? [];
            return (0, mappers_1.mapRaceWithSummary)(row, stages, new RiderRepository_1.RiderRepository(this.db).getUpcomingStageSummary(stages, row.is_stage_race === 1, currentDate));
        });
    }
    getRaceById(id) {
        const row = this.db.prepare(`
      ${(0, mappers_1.buildRaceSelect)()}
      WHERE races.id = ?
    `).get(id);
        if (!row)
            return null;
        const currentDate = new GameStateRepository_1.GameStateRepository(this.db).getCurrentDate();
        const stagesByRaceId = new RaceRepository(this.db).getStagesByRaceIds([id]);
        const stages = stagesByRaceId.get(id) ?? [];
        return (0, mappers_1.mapRaceWithSummary)(row, stages, new RiderRepository_1.RiderRepository(this.db).getUpcomingStageSummary(stages, row.is_stage_race === 1, currentDate));
    }
    getRaceRiders(raceId) {
        const season = new GameStateRepository_1.GameStateRepository(this.db).getCurrentSeason();
        const currentDate = new GameStateRepository_1.GameStateRepository(this.db).getCurrentDate();
        const useDailyState = (0, mappers_1.tableExists)(this.db, 'rider_daily_state');
        new GameStateRepository_1.GameStateRepository(this.db).ensureStageRaceStateSchema();
        const useStageRaceState = (0, mappers_1.tableExists)(this.db, 'rider_stage_race_state');
        const useFreeRaceForm = (0, mappers_1.tableExists)(this.db, 'rider_r_form_events');
        const rows = this.db.prepare(`
      SELECT r.*,
             role.name AS role_name,
             role.weighting AS role_weighting,
             rider_type.type_key AS rider_type,
             specialization_1.type_key AS specialization_1,
             specialization_2.type_key AS specialization_2,
             specialization_3.type_key AS specialization_3,
             country.name AS country_name,
             country.code_3 AS country_code_3,
             country.continent AS country_continent,
             country.regen_rating AS country_regen_rating,
             country.number_regen_min AS country_number_regen_min,
             country.number_regen_max AS country_number_regen_max,
             ${useDailyState ? 'rider_state.form_bonus' : '-1.0'} AS form_bonus,
             ${useDailyState ? 'rider_state.race_form_bonus' : '0'} AS race_form_bonus,
             ${useDailyState ? 'rider_state.peak_s_form' : '0'} AS peak_s_form,
             ${useDailyState ? 'rider_state.peak_r_form' : '0'} AS peak_r_form,
             ${useDailyState ? 'rider_state.active_peak_date' : 'NULL'} AS active_peak_date,
             ${useFreeRaceForm ? 'COALESCE(free_r_form.total, 0)' : '0'} AS free_r_form_bonus,
             ${useDailyState ? 'rider_state.peak_dates_json' : "'[]'"} AS peak_dates_json,
             ${useDailyState ? 'rider_state.health_status' : "'healthy'"} AS health_status,
             ${useDailyState ? 'rider_state.unavailable_until' : 'NULL'} AS unavailable_until,
             ${useDailyState ? 'rider_state.unavailable_days_remaining' : '0'} AS unavailable_days_remaining,
             ${useDailyState ? 'rider_state.season_race_days_total' : '0'} AS season_race_days_total,
             ${useDailyState ? 'rider_state.rolling_30d_race_days' : '0'} AS rolling_30d_race_days,
              ${useDailyState ? 'rider_state.short_term_fatigue' : '0.0'} AS short_term_fatigue,
              ${useDailyState ? 'rider_state.long_term_fatigue_decayable' : '0.0'} AS long_term_fatigue_decayable,
              ${useDailyState ? 'rider_state.long_term_fatigue_locked' : '0.0'} AS long_term_fatigue_locked,
             ${useStageRaceState ? 'COALESCE(race_state.accumulated_random_fatigue, 0)' : '0'} AS accumulated_random_fatigue,
             ${useStageRaceState ? 'COALESCE(race_state.incident_day_form_penalty, 0)' : '0'} AS incident_day_form_penalty,
             ${useStageRaceState ? 'COALESCE(race_state.incident_micro_form_penalty, 0)' : '0'} AS incident_micro_form_penalty,
             ${useStageRaceState ? 'COALESCE(race_state.incident_stamina_penalty, 0)' : '0'} AS incident_stamina_penalty,
             ${useStageRaceState && (0, mappers_1.columnExists)(this.db, 'rider_stage_race_state', 'incident_day_form_cap') ? 'race_state.incident_day_form_cap' : 'NULL'} AS incident_day_form_cap,
             ${useStageRaceState ? 'COALESCE(race_state.race_recuperation_penalty, 0)' : '0'} AS race_recuperation_penalty,
             ${useStageRaceState ? 'COALESCE(race_state.current_recovery_penalty, 0)' : '0'} AS current_recovery_penalty,
             (
               SELECT c.end_season
               FROM contracts c
               WHERE c.id = r.active_contract_id
             ) AS contract_end_season
      FROM riders r
      JOIN sta_country country ON country.id = r.country_id
      LEFT JOIN sta_role role ON role.id = r.role_id
      LEFT JOIN type_rider rider_type ON rider_type.id = r.rider_type_id
      LEFT JOIN type_rider specialization_1 ON specialization_1.id = r.specialization_1_id
      LEFT JOIN type_rider specialization_2 ON specialization_2.id = r.specialization_2_id
      LEFT JOIN type_rider specialization_3 ON specialization_3.id = r.specialization_3_id
      ${useDailyState ? 'LEFT JOIN rider_daily_state rider_state ON rider_state.rider_id = r.id' : ''}
      ${useFreeRaceForm ? 'LEFT JOIN (SELECT rider_id, SUM(amount) AS total FROM rider_r_form_events GROUP BY rider_id) free_r_form ON free_r_form.rider_id = r.id' : ''}
      INNER JOIN race_entries re ON re.rider_id = r.id
      ${useStageRaceState ? 'LEFT JOIN rider_stage_race_state race_state ON race_state.rider_id = r.id AND race_state.race_id = re.race_id' : ''}
      WHERE re.race_id = ? AND r.is_retired = 0
      ORDER BY r.overall_rating DESC
    `).all(raceId);
        const seasonPointsByRiderId = new RiderRepository_1.RiderRepository(this.db).getSeasonPointsByRiderId(season);
        const stageRow = this.db.prepare('SELECT stage_number FROM stages WHERE race_id = ? AND date = ? ORDER BY stage_number ASC LIMIT 1').get(raceId, currentDate);
        return rows.map((row) => (0, mappers_1.mapRider)(row, season, currentDate, seasonPointsByRiderId.get(row.id) ?? 0, stageRow?.stage_number));
    }
    getStageRiders(stageId) {
        const season = new GameStateRepository_1.GameStateRepository(this.db).getCurrentSeason();
        const currentDate = new GameStateRepository_1.GameStateRepository(this.db).getCurrentDate();
        const useDailyState = (0, mappers_1.tableExists)(this.db, 'rider_daily_state');
        new GameStateRepository_1.GameStateRepository(this.db).ensureStageRaceStateSchema();
        const useStageRaceState = (0, mappers_1.tableExists)(this.db, 'rider_stage_race_state');
        const useFreeRaceForm = (0, mappers_1.tableExists)(this.db, 'rider_r_form_events');
        const stage = new RaceRepository(this.db).getStageById(stageId);
        if (!stage) {
            return [];
        }
        new GameStateRepository_1.GameStateRepository(this.db).ensureStageEntries(stage);
        const rows = this.db.prepare(`
      SELECT r.*,
             role.name AS role_name,
             role.weighting AS role_weighting,
             rider_type.type_key AS rider_type,
             specialization_1.type_key AS specialization_1,
             specialization_2.type_key AS specialization_2,
             specialization_3.type_key AS specialization_3,
             country.name AS country_name,
             country.code_3 AS country_code_3,
             country.continent AS country_continent,
             country.regen_rating AS country_regen_rating,
             country.number_regen_min AS country_number_regen_min,
             country.number_regen_max AS country_number_regen_max,
             ${useDailyState ? 'rider_state.form_bonus' : '-1.0'} AS form_bonus,
             ${useDailyState ? 'rider_state.race_form_bonus' : '0'} AS race_form_bonus,
             ${useDailyState ? 'rider_state.peak_s_form' : '0'} AS peak_s_form,
             ${useDailyState ? 'rider_state.peak_r_form' : '0'} AS peak_r_form,
             ${useDailyState ? 'rider_state.active_peak_date' : 'NULL'} AS active_peak_date,
             ${useFreeRaceForm ? 'COALESCE(free_r_form.total, 0)' : '0'} AS free_r_form_bonus,
             ${useDailyState ? 'rider_state.peak_dates_json' : "'[]'"} AS peak_dates_json,
             ${useDailyState ? 'rider_state.health_status' : "'healthy'"} AS health_status,
             ${useDailyState ? 'rider_state.unavailable_until' : 'NULL'} AS unavailable_until,
             ${useDailyState ? 'rider_state.unavailable_days_remaining' : '0'} AS unavailable_days_remaining,
             ${useDailyState ? 'rider_state.season_race_days_total' : '0'} AS season_race_days_total,
             ${useDailyState ? 'rider_state.rolling_30d_race_days' : '0'} AS rolling_30d_race_days,
              ${useDailyState ? 'rider_state.short_term_fatigue' : '0.0'} AS short_term_fatigue,
              ${useDailyState ? 'rider_state.long_term_fatigue_decayable' : '0.0'} AS long_term_fatigue_decayable,
              ${useDailyState ? 'rider_state.long_term_fatigue_locked' : '0.0'} AS long_term_fatigue_locked,
             ${useStageRaceState ? 'COALESCE(race_state.accumulated_random_fatigue, 0)' : '0'} AS accumulated_random_fatigue,
             ${useStageRaceState ? 'COALESCE(race_state.incident_day_form_penalty, 0)' : '0'} AS incident_day_form_penalty,
             ${useStageRaceState ? 'COALESCE(race_state.incident_micro_form_penalty, 0)' : '0'} AS incident_micro_form_penalty,
             ${useStageRaceState ? 'COALESCE(race_state.incident_stamina_penalty, 0)' : '0'} AS incident_stamina_penalty,
             ${useStageRaceState && (0, mappers_1.columnExists)(this.db, 'rider_stage_race_state', 'incident_day_form_cap') ? 'race_state.incident_day_form_cap' : 'NULL'} AS incident_day_form_cap,
             ${useStageRaceState ? 'COALESCE(race_state.race_recuperation_penalty, 0)' : '0'} AS race_recuperation_penalty,
             ${useStageRaceState ? 'COALESCE(race_state.current_recovery_penalty, 0)' : '0'} AS current_recovery_penalty,
             (
               SELECT c.end_season
               FROM contracts c
               WHERE c.id = r.active_contract_id
             ) AS contract_end_season
      FROM riders r
      JOIN sta_country country ON country.id = r.country_id
      LEFT JOIN sta_role role ON role.id = r.role_id
      LEFT JOIN type_rider rider_type ON rider_type.id = r.rider_type_id
      LEFT JOIN type_rider specialization_1 ON specialization_1.id = r.specialization_1_id
      LEFT JOIN type_rider specialization_2 ON specialization_2.id = r.specialization_2_id
      LEFT JOIN type_rider specialization_3 ON specialization_3.id = r.specialization_3_id
      ${useDailyState ? 'LEFT JOIN rider_daily_state rider_state ON rider_state.rider_id = r.id' : ''}
      ${useFreeRaceForm ? 'LEFT JOIN (SELECT rider_id, SUM(amount) AS total FROM rider_r_form_events GROUP BY rider_id) free_r_form ON free_r_form.rider_id = r.id' : ''}
      JOIN stage_entries ON stage_entries.rider_id = r.id
      ${useStageRaceState ? 'LEFT JOIN rider_stage_race_state race_state ON race_state.rider_id = r.id AND race_state.race_id = stage_entries.race_id' : ''}
      WHERE stage_entries.stage_id = ?
        AND stage_entries.status IN ('scheduled', 'started', 'finished')
        AND r.is_retired = 0
      ORDER BY r.overall_rating DESC
    `).all(stageId);
        const seasonPointsByRiderId = new RiderRepository_1.RiderRepository(this.db).getSeasonPointsByRiderId(season);
        return rows.map((row) => (0, mappers_1.mapRider)(row, season, currentDate, seasonPointsByRiderId.get(row.id) ?? 0, stage.stageNumber));
    }
    getStageById(id) {
        const row = this.db.prepare(`
      SELECT s.id, s.race_id, s.stage_number, s.date, s.profile, s.start_elevation, s.details_csv_file,
             s.final_spread_start_percent, s.final_push_start_percent, s.final_spread_difficulty_multiplier,
             s.crash_incident_multiplier, s.mechanical_incident_multiplier, s.stage_score,
             s.allowed_weather, s.rolled_weather_id, w.wetter_name,
             w.effekt_sturz_min, w.effekt_sturz_max, w.effekt_defekt_min, w.effekt_defekt_max,
             w.windkanten_gefahr_min, w.windkanten_gefahr_max, w.effekt_fatigue_min, w.effekt_fatigue_max,
             w.breakaway_bonus_min, w.breakaway_bonus_max
      FROM stages s
      LEFT JOIN wetter w ON w.id = s.rolled_weather_id
      WHERE s.id = ?
    `).get(id);
        return row ? (0, mappers_1.mapStage)(row) : null;
    }
    getStagesForRace(raceId) {
        return new RaceRepository(this.db).getStagesByRaceIds([raceId]).get(raceId) ?? [];
    }
    getStagesByRaceIds(raceIds) {
        const stagesByRaceId = new Map();
        if (raceIds.length === 0)
            return stagesByRaceId;
        const placeholders = raceIds.map(() => '?').join(', ');
        const stageRows = this.db.prepare(`
      SELECT s.id, s.race_id, s.stage_number, s.date, s.profile, s.start_elevation, s.details_csv_file,
             s.final_spread_start_percent, s.final_push_start_percent, s.final_spread_difficulty_multiplier,
             s.crash_incident_multiplier, s.mechanical_incident_multiplier, s.stage_score,
             s.allowed_weather, s.rolled_weather_id, w.wetter_name,
             w.effekt_sturz_min, w.effekt_sturz_max, w.effekt_defekt_min, w.effekt_defekt_max,
             w.windkanten_gefahr_min, w.windkanten_gefahr_max, w.effekt_fatigue_min, w.effekt_fatigue_max,
             w.breakaway_bonus_min, w.breakaway_bonus_max
      FROM stages s
      LEFT JOIN wetter w ON w.id = s.rolled_weather_id
      WHERE s.race_id IN (${placeholders})
      ORDER BY s.race_id ASC, s.stage_number ASC
    `).all(...raceIds);
        for (const row of stageRows) {
            const stages = stagesByRaceId.get(row.race_id) ?? [];
            stages.push((0, mappers_1.mapStage)(row));
            stagesByRaceId.set(row.race_id, stages);
        }
        const missingRaceIds = raceIds.filter((raceId) => !stagesByRaceId.has(raceId));
        if (missingRaceIds.length > 0) {
            for (const row of (0, mappers_1.loadFallbackStages)(missingRaceIds)) {
                const stages = stagesByRaceId.get(row.race_id) ?? [];
                stages.push((0, mappers_1.mapStage)(row));
                stagesByRaceId.set(row.race_id, stages);
            }
        }
        return stagesByRaceId;
    }
}
exports.RaceRepository = RaceRepository;
