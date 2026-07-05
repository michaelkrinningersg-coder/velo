import { summarizeStageProfile } from '../../simulation/StageParser';
import Database from 'better-sqlite3';
import { Country, FormDebugPoint, Nationality, PrecalculatedRaceIncident, Race, RaceCategory, RaceCategoryBonus, RaceClassificationRow, RaceProgram, RaceProgramParticipant, RaceStageSummary, RealtimeClassificationLeaders, RealtimeClassificationStanding, RealtimeGcStanding, ResultType, Rider, RiderFormSnapshot, RiderHealthStatus, RiderPotentials, RiderProgramRaceSummary, RiderRaceFormSource, RiderSeasonFormPhase, RiderSkillKey, RiderSkills, RiderStatsPayload, RiderStatsPointsByRaceFormat, RiderStatsPointsByTerrain, RiderStatsRaceBlock, RiderStatsRow, RiderStatsRowType, RiderStatsSeason, Role, SeasonPointAwardType, SeasonStandingCountryRow, SeasonStandingCountryRiderRow, SeasonStandingRow, SeasonStandingsPayload, Stage, StageClassification, StageMarkerCategory, StageMarkerClassification, StageNonFinisherRow, StageResultsPayload, StageScoringRule, Team, RiderCareerStats, RiderFatigueHistoryEntry } from '../../../../shared/types';
import { SKILL_WEIGHT_RIDER_COLUMNS, SkillWeightRule } from '../../../../shared/skillWeights';
import { RESULT_TYPE_IDS, RACE_FORM_BUILD_SOURCE_AMOUNT, isMountainClassificationType, resolveMarkerResultsSortPriority, SEASON_POINT_AWARD_TYPES, RIDER_SKILL_COLUMNS, SEASON_FORM_RISE_DAYS, SEASON_FORM_FALL_DAYS, SEASON_FORM_MAX_RAW, SEASON_FORM_RISE_STEP_RAW, DIVISION_BY_TIER, RiderRow, RiderSeasonRaceStats, CareerRaceDaysSeasonRow, RaceProgramRow, RiderSeasonProgramRow, TeamRow, RaceRow, StageRow, StageResultsMetaRow, RuleRow, SkillWeightRow, StageEntryStatus, ResultTypeRow, StageResultDbRow, StageNonFinisherDbRow, StageMarkerResultDbRow, StageSeasonPointDbRow, StageTeamSeasonPointDbRow, SeasonPointStageRow, SeasonPointResultRow, RiderSeasonStandingDbRow, TeamSeasonStandingDbRow, CountrySeasonStandingDbRow, RiderStatsStageDbRow, RiderStatsFinalDbRow, emptyRiderStatsPointsByTerrain, emptyRiderStatsPointsByRaceFormat, resolveRiderStatsTerrainBucket, resolveDataCsvDir, parseCsvLine, parseRaceList, parseRankedValues, parsePeakDates, usesMountainStagePoints, resolveStageResultPointValues, isoDateToDayNumber, randomBetween, roundToTwoDecimals, addDaysIso, resolveStageRaceBaseFatigue, resolveStageRaceFatigueMalus, resolveEffectiveRecuperationSkill, resolvePeakPhase, resolveDeclineValue, resolveEffectiveSeasonForm, resolveProjectionPoint, resolveRiderSeasonFormPhase, tableExists, columnExists, mapSkillObject, mapCountry, mapRole, mapRider, mapTeam, mapRaceCategoryBonus, mapRaceCategory, mapSkillWeightRule, mapStage, loadFallbackStages, mapRace, buildRaceSelect, mapRaceProgram, mapRaceWithSummary } from '../mappers';
import { GameStateRepository } from './GameStateRepository';
import { ResultRepository } from './ResultRepository';
import { RaceRepository } from './RaceRepository';
import { TeamRepository } from './TeamRepository';


export class RiderRepository {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }


  private getRidersQuery(useContracts: boolean, filterByTeam: boolean, onlyWithTeam = false, isCurrentSeason = true): string {
    const useDailyState = tableExists(this.db, 'rider_daily_state');
    const useFreeRaceForm = tableExists(this.db, 'rider_r_form_events');
    const countrySelect = `
      riders.*,
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
      ${useDailyState ? 'rider_state.season_points' : '0'} AS season_points,
      ${useDailyState ? 'rider_state.season_wins' : '0'} AS season_wins,
      ${useDailyState ? 'rider_state.season_race_days_total' : '0'} AS season_race_days_total,
      ${useDailyState ? 'rider_state.rolling_30d_race_days' : '0'} AS rolling_30d_race_days,
      ${useDailyState ? 'rider_state.short_term_fatigue' : '0.0'} AS short_term_fatigue,
      ${useDailyState ? 'rider_state.long_term_fatigue_decayable' : '0.0'} AS long_term_fatigue_decayable,
      ${useDailyState ? 'rider_state.long_term_fatigue_locked' : '0.0'} AS long_term_fatigue_locked
    `;
    const riderStateJoin = useDailyState ? 'LEFT JOIN rider_daily_state rider_state ON rider_state.rider_id = riders.id' : '';
    const freeRaceFormJoin = useFreeRaceForm ? 'LEFT JOIN (SELECT rider_id, SUM(amount) AS total FROM rider_r_form_events GROUP BY rider_id) free_r_form ON free_r_form.rider_id = riders.id' : '';

    if (!useContracts) {
      if (filterByTeam) {
        return `SELECT ${countrySelect}, NULL AS contract_end_season FROM riders JOIN sta_country country ON country.id = riders.country_id LEFT JOIN sta_role role ON role.id = riders.role_id LEFT JOIN type_rider rider_type ON rider_type.id = riders.rider_type_id LEFT JOIN type_rider specialization_1 ON specialization_1.id = riders.specialization_1_id LEFT JOIN type_rider specialization_2 ON specialization_2.id = riders.specialization_2_id LEFT JOIN type_rider specialization_3 ON specialization_3.id = riders.specialization_3_id ${riderStateJoin} ${freeRaceFormJoin} WHERE active_team_id = ? AND is_retired = 0 ORDER BY overall_rating DESC`;
      } else {
        const teamFilter = onlyWithTeam ? 'AND active_team_id IS NOT NULL' : '';
        return `SELECT ${countrySelect}, NULL AS contract_end_season FROM riders JOIN sta_country country ON country.id = riders.country_id LEFT JOIN sta_role role ON role.id = riders.role_id LEFT JOIN type_rider rider_type ON rider_type.id = riders.rider_type_id LEFT JOIN type_rider specialization_1 ON specialization_1.id = riders.specialization_1_id LEFT JOIN type_rider specialization_2 ON specialization_2.id = riders.specialization_2_id LEFT JOIN type_rider specialization_3 ON specialization_3.id = riders.specialization_3_id ${riderStateJoin} ${freeRaceFormJoin} WHERE is_retired = 0 ${teamFilter} ORDER BY overall_rating DESC`;
      }
    }

    if (isCurrentSeason) {
      const activeContractJoin = `
        LEFT JOIN contracts current_contract
          ON current_contract.id = riders.active_contract_id
      `;

      const selectWithResolvedContract = `
        SELECT ${countrySelect},
               riders.active_team_id AS active_team_id,
               riders.active_contract_id AS active_contract_id,
               current_contract.end_season AS contract_end_season
        FROM riders
        JOIN sta_country country ON country.id = riders.country_id
        LEFT JOIN sta_role role ON role.id = riders.role_id
        LEFT JOIN type_rider rider_type ON rider_type.id = riders.rider_type_id
        LEFT JOIN type_rider specialization_1 ON specialization_1.id = riders.specialization_1_id
        LEFT JOIN type_rider specialization_2 ON specialization_2.id = riders.specialization_2_id
        LEFT JOIN type_rider specialization_3 ON specialization_3.id = riders.specialization_3_id
        ${riderStateJoin}
        ${activeContractJoin}
      `;

      if (filterByTeam) {
        return `${selectWithResolvedContract} ${freeRaceFormJoin} WHERE riders.active_team_id = ? AND riders.is_retired = 0 ORDER BY riders.overall_rating DESC`;
      } else {
        const teamFilter = onlyWithTeam ? 'AND riders.active_team_id IS NOT NULL' : '';
        return `${selectWithResolvedContract} ${freeRaceFormJoin} WHERE riders.is_retired = 0 ${teamFilter} ORDER BY riders.overall_rating DESC`;
      }
    }

    const activeContractJoin = `
      LEFT JOIN contracts current_contract
        ON current_contract.id = (
          SELECT c.id
          FROM contracts c
          WHERE c.rider_id = riders.id
            AND c.start_season <= ?
            AND c.end_season >= ?
          ORDER BY c.start_season DESC, c.id DESC
          LIMIT 1
        )
    `;

    const selectWithResolvedContract = `
      SELECT ${countrySelect},
             COALESCE(current_contract.team_id, riders.active_team_id) AS active_team_id,
             COALESCE(current_contract.id, riders.active_contract_id) AS active_contract_id,
             COALESCE(current_contract.end_season, (
               SELECT c.end_season
               FROM contracts c
               WHERE c.id = riders.active_contract_id
             )) AS contract_end_season
      FROM riders
      JOIN sta_country country ON country.id = riders.country_id
      LEFT JOIN sta_role role ON role.id = riders.role_id
      LEFT JOIN type_rider rider_type ON rider_type.id = riders.rider_type_id
      LEFT JOIN type_rider specialization_1 ON specialization_1.id = riders.specialization_1_id
      LEFT JOIN type_rider specialization_2 ON specialization_2.id = riders.specialization_2_id
      LEFT JOIN type_rider specialization_3 ON specialization_3.id = riders.specialization_3_id
      ${riderStateJoin}
      ${activeContractJoin}
    `;

    if (filterByTeam) {
      return `${selectWithResolvedContract} ${freeRaceFormJoin} WHERE COALESCE(current_contract.team_id, riders.active_team_id) = ? AND riders.is_retired = 0 ORDER BY riders.overall_rating DESC`;
    } else {
      const teamFilter = onlyWithTeam ? 'AND COALESCE(current_contract.team_id, riders.active_team_id) IS NOT NULL' : '';
      return `${selectWithResolvedContract} ${freeRaceFormJoin} WHERE riders.is_retired = 0 ${teamFilter} ORDER BY riders.overall_rating DESC`;
    }
  }


  public getRiders(teamId?: number, includeFormDebug = false, onlyWithTeam = false, season?: number, includeDetailedStats = true): Rider[] {
    const gameStateRepo = new GameStateRepository(this.db);
    const activeSeason = season ?? gameStateRepo.getCurrentSeason();
    const currentDate = gameStateRepo.getCurrentDate();
    const useContracts = tableExists(this.db, 'contracts');
    const isCurrentSeason = activeSeason === gameStateRepo.getCurrentSeason();

    let rows: RiderRow[];
    if (teamId != null) {
      if (useContracts) {
        if (isCurrentSeason) {
          rows = this.db.prepare(this.getRidersQuery(true, true, false, true)).all(teamId) as RiderRow[];
        } else {
          rows = this.db.prepare(this.getRidersQuery(true, true, false, false)).all(activeSeason, activeSeason, teamId) as RiderRow[];
        }
      } else {
        rows = this.db.prepare(this.getRidersQuery(false, true, false)).all(teamId) as RiderRow[];
      }
    } else {
      if (useContracts) {
        if (isCurrentSeason) {
          rows = this.db.prepare(this.getRidersQuery(true, false, onlyWithTeam, true)).all() as RiderRow[];
        } else {
          rows = this.db.prepare(this.getRidersQuery(true, false, onlyWithTeam, false)).all(activeSeason, activeSeason) as RiderRow[];
        }
      } else {
        rows = this.db.prepare(this.getRidersQuery(false, false, onlyWithTeam)).all() as RiderRow[];
      }
    }
    
    const riderIdsForStats = teamId != null ? rows.map(row => row.id) : undefined;
    const seasonPointsByRiderId = (includeDetailedStats && !isCurrentSeason) ? this.getSeasonPointsByRiderId(activeSeason, riderIdsForStats) : new Map();
    const raceFormSourcesByRiderId = includeDetailedStats ? this.loadRaceFormSourcesByRiderId(rows.map((row) => row.id), activeSeason, currentDate) : new Map();
    const seasonRaceStatsByRiderId = (includeDetailedStats && !isCurrentSeason) ? this.getSeasonRaceStatsByRiderId(activeSeason, riderIdsForStats, isCurrentSeason) : new Map();
    const riders = rows.map((row) => ({
      ...mapRider(row, activeSeason, currentDate, isCurrentSeason ? (row.season_points ?? 0) : (seasonPointsByRiderId.get(row.id) ?? 0)),
      raceFormSources: raceFormSourcesByRiderId.get(row.id) ?? [],
      seasonRaceDays: isCurrentSeason ? (row.season_race_days_total ?? 0) : (seasonRaceStatsByRiderId.get(row.id)?.raceDays ?? 0),
      seasonWins: isCurrentSeason ? (row.season_wins ?? 0) : (seasonRaceStatsByRiderId.get(row.id)?.wins ?? 0),
    }));
    const ridersWithPrograms = includeDetailedStats ? this.attachProgramData(riders, activeSeason) : riders;
    const ridersWithMentors = this.attachMentorData(ridersWithPrograms);
    return includeFormDebug ? this.attachFormDebugData(ridersWithMentors, activeSeason, currentDate) : ridersWithMentors;
  }


  private attachMentorData(riders: Rider[]): Rider[] {
    const ridersByTeam = new Map<number, Rider[]>();
    for (const rider of riders) {
      if (rider.activeTeamId != null) {
        let teamRiders = ridersByTeam.get(rider.activeTeamId);
        if (!teamRiders) {
          teamRiders = [];
          ridersByTeam.set(rider.activeTeamId, teamRiders);
        }
        teamRiders.push(rider);
      }
    }

    return riders.map((rider) => {
      if ((rider.age ?? 0) <= 23 && rider.activeTeamId != null) {
        const teamRiders = ridersByTeam.get(rider.activeTeamId) ?? [];
        const mentors = teamRiders.filter(m =>
          m.id !== rider.id &&
          (m.age ?? 0) >= 31 &&
          m.overallRating >= 73 &&
          (
            m.riderType === rider.riderType ||
            (rider.specialization1 && m.riderType === rider.specialization1) ||
            (rider.specialization2 && m.riderType === rider.specialization2) ||
            (rider.specialization3 && m.riderType === rider.specialization3)
          )
        );

        if (mentors.length > 0) {
          mentors.sort((a, b) => b.overallRating - a.overallRating);
          const strongestMentor = mentors[0];
          return {
            ...rider,
            mentorName: `${strongestMentor.firstName.charAt(0)}. ${strongestMentor.lastName}`,
            mentorCountryCode: strongestMentor.nationality || strongestMentor.country?.code3,
            mentorAge: strongestMentor.age,
          };
        }
      }
      return rider;
    });
  }





  private attachProgramData(riders: Rider[], season: number): Rider[] {
    if (riders.length === 0 || !tableExists(this.db, 'rider_season_programs') || !tableExists(this.db, 'race_programs')) {
      return riders;
    }

    const riderIds = riders.map((rider) => rider.id);
    const programRows: Array<RiderSeasonProgramRow & RaceProgramRow> = [];
    const raceRows: Array<{ rider_id: number; race_id: number }> = [];

    const chunkSize = 500;
    for (let i = 0; i < riderIds.length; i += chunkSize) {
      const chunk = riderIds.slice(i, i + chunkSize);
      const placeholders = chunk.map(() => '?').join(', ');
      
      const chunkPrograms = this.db.prepare(`
        SELECT rider_season_programs.rider_id,
               rider_season_programs.program_id,
               race_programs.name AS program_name
        FROM rider_season_programs
        JOIN race_programs ON race_programs.id = rider_season_programs.program_id
        WHERE rider_season_programs.season = ?
          AND rider_season_programs.rider_id IN (${placeholders})
      `).all(season, ...chunk) as any;
      programRows.push(...chunkPrograms);

      if (tableExists(this.db, 'race_program_races')) {
        const chunkRaces = this.db.prepare(`
          SELECT rider_season_programs.rider_id,
                 race_program_races.race_id
          FROM rider_season_programs
          JOIN race_program_races ON race_program_races.program_id = rider_season_programs.program_id
          JOIN riders ON riders.id = rider_season_programs.rider_id
          JOIN sta_country ON sta_country.id = riders.country_id
          WHERE rider_season_programs.season = ?
            AND rider_season_programs.rider_id IN (${placeholders})
            AND (
              race_program_races.allowed_program_group_ids IS NULL
              OR race_program_races.allowed_program_group_ids = ''
              OR ('|' || race_program_races.allowed_program_group_ids || '|') LIKE ('%|' || sta_country.program_group_id || '|%')
            )
          ORDER BY race_program_races.race_id ASC
        `).all(season, ...chunk) as any;
        raceRows.push(...chunkRaces);
      }
    }

    const programByRiderId = new Map(programRows.map((row) => [row.rider_id, {
      id: row.program_id,
      name: row.program_name,
    } satisfies RaceProgram]));

    const raceIdsByRiderId = new Map<number, number[]>();
    for (const row of raceRows) {
      const raceIds = raceIdsByRiderId.get(row.rider_id) ?? [];
      raceIds.push(row.race_id);
      raceIdsByRiderId.set(row.rider_id, raceIds);
    }

    return riders.map((rider) => ({
      ...rider,
      seasonProgram: programByRiderId.get(rider.id) ?? null,
      seasonProgramRaceIds: raceIdsByRiderId.get(rider.id) ?? [],
    }));
  }


  public getRiderProgramRaceSummary(riderId: number): RiderProgramRaceSummary | null {
    const season = new GameStateRepository(this.db).getCurrentSeason();
    if (!tableExists(this.db, 'rider_season_programs') || !tableExists(this.db, 'race_programs')) {
      return null;
    }

    const programRow = this.db.prepare(`
      SELECT race_programs.id,
             race_programs.name
      FROM rider_season_programs
      JOIN race_programs ON race_programs.id = rider_season_programs.program_id
      WHERE rider_season_programs.season = ?
        AND rider_season_programs.rider_id = ?
    `).get(season, riderId) as RaceProgramRow | undefined;
    if (!programRow) {
      return null;
    }

    const raceRows = this.db.prepare(`
      ${buildRaceSelect()}
      JOIN race_program_races ON race_program_races.race_id = races.id
      JOIN riders ON riders.id = ?
      JOIN sta_country ON sta_country.id = riders.country_id
      WHERE race_program_races.program_id = ?
        AND (
          race_program_races.allowed_program_group_ids IS NULL
          OR race_program_races.allowed_program_group_ids = ''
          OR ('|' || race_program_races.allowed_program_group_ids || '|') LIKE ('%|' || sta_country.program_group_id || '|%')
        )
      ORDER BY races.start_date ASC, races.id ASC
    `).all(riderId, programRow.id) as RaceRow[];
    const stagesByRaceId = new RaceRepository(this.db).getStagesByRaceIds(raceRows.map(row => row.id));
    const currentDate = new GameStateRepository(this.db).getCurrentDate();
    return {
      program: mapRaceProgram(programRow),
      races: raceRows.map((row) => {
        const stages = stagesByRaceId.get(row.id) ?? [];
        return mapRaceWithSummary(row, stages, this.getUpcomingStageSummary(stages, row.is_stage_race === 1, currentDate));
      }),
    };
  }


  public getRiderStats(riderId: number, excludeFatigue: boolean = false): RiderStatsPayload | null {
    const rider = this.getRiderById(riderId);
    if (!rider) {
      return null;
    }

    let mentorName: string | null = null;
    let mentoredRiderNames: string[] = [];

    if (rider.activeTeamId != null) {
      const teamRows = this.db.prepare(`
        SELECT r.id, r.first_name, r.last_name, r.overall_rating, 
               CAST(strftime('%Y', 'now') - r.birth_year AS INTEGER) AS age,
               type.type_key AS rider_type
        FROM riders r
        LEFT JOIN type_rider type ON type.id = r.rider_type_id
        WHERE r.active_team_id = ? AND r.is_retired = 0
      `).all(rider.activeTeamId) as any[];

      const riderAge = rider.age ?? (new GameStateRepository(this.db).getCurrentSeason() - rider.birthYear);

      if (riderAge <= 23) {
        const potentialMentors = teamRows.filter(m => 
          m.id !== rider.id && 
          m.age >= 31 && 
          m.overall_rating >= 73 &&
          (
            m.rider_type === rider.riderType ||
            (rider.specialization1 && m.rider_type === rider.specialization1) ||
            (rider.specialization2 && m.rider_type === rider.specialization2) ||
            (rider.specialization3 && m.rider_type === rider.specialization3)
          )
        );
        if (potentialMentors.length > 0) {
          potentialMentors.sort((a, b) => b.overall_rating - a.overall_rating);
          mentorName = `${potentialMentors[0].first_name.charAt(0)}. ${potentialMentors[0].last_name}`;
        }
      }

      if (riderAge >= 31 && rider.overallRating >= 73) {
        mentoredRiderNames = teamRows.filter(m => 
          m.id !== rider.id && 
          m.age <= 23 &&
          (
            rider.riderType === m.rider_type ||
            (rider.specialization1 && m.rider_type === rider.specialization1) ||
            (rider.specialization2 && m.rider_type === rider.specialization2) ||
            (rider.specialization3 && m.rider_type === rider.specialization3)
          )
        ).map(m => `${m.first_name.charAt(0)}. ${m.last_name}`);
      }
    }

    const currentSeason = new GameStateRepository(this.db).getCurrentSeason();
    const currentSeasonRank = new ResultRepository(this.db).getSeasonRankForRider(currentSeason, rider.id);
    const currentSeasonPoints = this.getSeasonPointsByRiderId(currentSeason, [rider.id]).get(rider.id) ?? 0;
    const currentSeasonRaceStats = { raceDays: rider.seasonRaceDaysTotal ?? 0, wins: rider.seasonWins ?? 0 };
    const currentSeasonBreakawayAttempts = this.getSeasonBreakawayAttempts(currentSeason, rider.id);
    const careerWins = this.getCareerWins(rider.id);
    const careerRaceDaysBySeason = this.getCareerRaceDaysBySeason(rider.id);
    const programSummary = this.getRiderProgramRaceSummary(rider.id);
    const pointsByTerrain = emptyRiderStatsPointsByTerrain();
    const pointsByRaceFormat = emptyRiderStatsPointsByRaceFormat();

    if (!tableExists(this.db, 'results') || !tableExists(this.db, 'stages')) {
      return this.createEmptyRiderStatsPayload(
        rider,
        currentSeasonRank,
        currentSeasonPoints,
        currentSeasonRaceStats.raceDays,
        currentSeasonBreakawayAttempts,
        careerWins,
        careerRaceDaysBySeason,
        programSummary,
        mentorName,
        mentoredRiderNames,
      );
    }

    const stageRows = this.db.prepare(`
      SELECT
        CAST(substr(stages.date, 1, 4) AS INTEGER) AS season,
        races.id AS race_id,
        races.name AS race_name,
        race_categories.name AS race_category_name,
        races.is_stage_race AS is_stage_race,
        races.start_date AS start_date,
        races.end_date AS end_date,
        stages.id AS stage_id,
        stages.stage_number AS stage_number,
        stages.date AS date,
        stages.profile AS profile,
        stages.details_csv_file AS details_csv_file,
        stages.start_elevation AS start_elevation,
        COALESCE(rider_stage_results.rank, team_stage_results.rank) AS stage_rank,
        COALESCE(rider_stage_results.time_seconds, team_stage_results.time_seconds) AS stage_time_seconds,
        rider_stage_results.is_breakaway AS is_breakaway,
        rider_stage_results.event_ids AS event_ids,
        rider_stage_results.jerseys_worn AS jerseys_worn,
        gc_results.rank AS gc_rank,
        stage_points.points_awarded AS stage_points,
        stage_entries.status AS stage_entry_status,
        stage_entries.status_reason AS stage_entry_status_reason,
        stages.stage_score AS stage_score,
        stages.rolled_weather_id AS rolled_weather_id,
        wetter.wetter_name AS rolled_wetter_name,
        stages.super_team_id AS super_team_id,
        stage_entries.team_id AS team_id
      FROM all_stage_entries stage_entries
      JOIN stages ON stages.id = stage_entries.stage_id
      JOIN races ON races.id = stages.race_id
      JOIN race_categories ON race_categories.id = races.category_id
      LEFT JOIN wetter ON wetter.id = stages.rolled_weather_id
      LEFT JOIN all_results rider_stage_results
        ON rider_stage_results.stage_id = stages.id
       AND rider_stage_results.rider_id = stage_entries.rider_id
       AND rider_stage_results.result_type_id = ${RESULT_TYPE_IDS.stage}
      LEFT JOIN all_results team_stage_results
        ON team_stage_results.stage_id = stages.id
       AND team_stage_results.team_id = stage_entries.team_id
       AND team_stage_results.rider_id IS NULL
       AND team_stage_results.result_type_id = ${RESULT_TYPE_IDS.stage}
       AND stages.profile = 'TTT'
      LEFT JOIN all_results gc_results
        ON gc_results.stage_id = stages.id
       AND gc_results.rider_id = stage_entries.rider_id
       AND gc_results.result_type_id = ?
      LEFT JOIN season_point_events stage_points
        ON stage_points.stage_id = stages.id
       AND stage_points.rider_id = stage_entries.rider_id
       AND stage_points.award_type = CASE WHEN races.is_stage_race = 1 THEN 'stage_result' ELSE 'one_day_result' END
      WHERE stage_entries.rider_id = ?
        AND stage_entries.status IN ('finished', 'dnf')
        AND (
          COALESCE(rider_stage_results.rank, team_stage_results.rank) IS NOT NULL
          OR stage_entries.status = 'dnf'
        )
      ORDER BY stages.date ASC, races.id ASC, stages.stage_number ASC
    `).all(RESULT_TYPE_IDS.gc, riderId) as RiderStatsStageDbRow[];

    const finalRows = this.db.prepare(`
      SELECT
        CAST(substr(stages.date, 1, 4) AS INTEGER) AS season,
        races.id AS race_id,
        races.name AS race_name,
        race_categories.name AS race_category_name,
        races.start_date AS start_date,
        races.end_date AS end_date,
        stages.id AS stage_id,
        stages.stage_number AS stage_number,
        stages.date AS date,
        stages.profile AS profile,
        stages.details_csv_file AS details_csv_file,
        stages.start_elevation AS start_elevation,
        results.result_type_id AS result_type_id,
        results.rank AS result_rank,
        final_points.points_awarded AS final_points,
        stages.stage_score AS stage_score,
        stages.super_team_id AS super_team_id,
        results.team_id AS team_id
      FROM all_results results
      JOIN stages ON stages.id = results.stage_id
      JOIN races ON races.id = stages.race_id
      JOIN race_categories ON race_categories.id = races.category_id
      LEFT JOIN season_point_events final_points
        ON final_points.stage_id = results.stage_id
       AND final_points.rider_id = results.rider_id
       AND final_points.award_type = CASE results.result_type_id
         WHEN ${RESULT_TYPE_IDS.gc} THEN 'gc_final'
         WHEN ${RESULT_TYPE_IDS.points} THEN 'points_final'
         WHEN ${RESULT_TYPE_IDS.mountain} THEN 'mountain_final'
         WHEN ${RESULT_TYPE_IDS.youth} THEN 'youth_final'
         WHEN ${RESULT_TYPE_IDS.breakaway} THEN 'breakaway_final'
       END
      WHERE results.rider_id = ?
        AND races.is_stage_race = 1
        AND stages.stage_number = races.number_of_stages
        AND results.result_type_id IN (${RESULT_TYPE_IDS.gc}, ${RESULT_TYPE_IDS.points}, ${RESULT_TYPE_IDS.mountain}, ${RESULT_TYPE_IDS.youth}, ${RESULT_TYPE_IDS.breakaway})
      ORDER BY stages.date ASC, races.id ASC, results.result_type_id ASC
    `).all(riderId) as RiderStatsFinalDbRow[];

    const seasons = new Map<number, RiderStatsSeason>();
    const blocks = new Map<string, RiderStatsRaceBlock>();
    const stageSummaryCache = new Map<number, { distanceKm: number; elevationGainMeters: number }>();

    const ensureSeason = (season: number): RiderStatsSeason => {
      const existing = seasons.get(season);
      if (existing) {
        return existing;
      }

      const created: RiderStatsSeason = {
        season,
        raceBlocks: [],
      };
      seasons.set(season, created);
      return created;
    };

    const ensureRaceBlock = (season: number, raceId: number, raceName: string, raceCategoryName: string | null, isStageRace: boolean, startDate: string, endDate: string): RiderStatsRaceBlock => {
      const key = `${season}:${raceId}`;
      const existing = blocks.get(key);
      if (existing) {
        return existing;
      }

      const seasonBucket = ensureSeason(season);
      const created: RiderStatsRaceBlock = {
        raceId,
        raceName,
        raceCategoryName,
        isStageRace,
        startDate,
        endDate,
        rows: [],
      };
      seasonBucket.raceBlocks.push(created);
      blocks.set(key, created);
      return created;
    };

    const getStageSummary = (stageId: number, detailsCsvFile: string, startElevation: number): { distanceKm: number; elevationGainMeters: number } => {
      const cached = stageSummaryCache.get(stageId);
      if (cached) {
        return cached;
      }

      const summary = summarizeStageProfile(detailsCsvFile, startElevation);
      const normalized = {
        distanceKm: summary.distanceKm,
        elevationGainMeters: summary.elevationGainMeters,
      };
      stageSummaryCache.set(stageId, normalized);
      return normalized;
    };

    for (const row of stageRows) {
      const block = ensureRaceBlock(row.season, row.race_id, row.race_name, row.race_category_name, row.is_stage_race === 1, row.start_date, row.end_date);
      const summary = getStageSummary(row.stage_id, row.details_csv_file, row.start_elevation);
      const stagePoints = row.stage_points ?? 0;
      block.rows.push({
        rowType: 'stage_result',
        date: row.date,
        raceId: row.race_id,
        raceName: row.race_name,
        raceCategoryName: row.race_category_name,
        stageId: row.stage_id,
        stageNumber: row.stage_number,
        stageName: row.is_stage_race === 1 ? `Etappe ${row.stage_number}` : row.race_name,
        resultLabel: row.stage_entry_status === 'dnf'
          ? (row.stage_entry_status_reason ?? '')
          : (row.profile === 'TTT' ? 'Teamzeit' : 'Zielzeit'),
        resultRank: row.stage_entry_status === 'dnf' ? null : row.stage_rank,
        gcRank: row.stage_entry_status === 'dnf' ? null : (row.is_stage_race === 1 ? row.gc_rank : null),
        isBreakaway: row.is_breakaway === 1,
        finishStatus: row.stage_entry_status === 'dnf'
          ? (row.stage_entry_status_reason?.startsWith('OTL ') ? 'otl' : 'dnf')
          : 'classified',
        statusReason: row.stage_entry_status === 'dnf' ? row.stage_entry_status_reason : null,
        stageTimeSeconds: row.stage_entry_status === 'dnf' ? null : row.stage_time_seconds,
        profile: row.profile,
        distanceKm: summary.distanceKm,
        elevationGainMeters: summary.elevationGainMeters,
        seasonPoints: stagePoints,
        stageScore: row.stage_score ?? 0,
        rolledWeatherId: row.rolled_weather_id ?? null,
        rolledWetterName: row.rolled_wetter_name ?? null,
        eventIds: (row as any).event_ids ?? null,
        jerseysWorn: (row as any).jerseys_worn ?? null,
        superTeamId: row.super_team_id ?? null,
        teamId: row.team_id ?? null,
        isStageRace: row.is_stage_race === 1,
      } satisfies RiderStatsRow);

      if (row.season === currentSeason) {
        const terrainBucket = resolveRiderStatsTerrainBucket(row.profile);
        pointsByTerrain[terrainBucket] += stagePoints;
        if (row.is_stage_race === 1) {
          pointsByRaceFormat.stageRace += stagePoints;
        } else {
          pointsByRaceFormat.oneDay += stagePoints;
        }
      }
    }

    for (const row of finalRows) {
      const rowType = this.mapResultTypeIdToRiderStatsRowType(row.result_type_id);
      if (!rowType) {
        continue;
      }

      const block = ensureRaceBlock(row.season, row.race_id, row.race_name, row.race_category_name, true, row.start_date, row.end_date);
      const summary = getStageSummary(row.stage_id, row.details_csv_file, row.start_elevation);
      const finalPoints = row.final_points ?? 0;
      block.rows.push({
        rowType,
        date: row.date,
        raceId: row.race_id,
        raceName: row.race_name,
        raceCategoryName: row.race_category_name,
        stageId: row.stage_id,
        stageNumber: row.stage_number,
        stageName: `Etappe ${row.stage_number}`,
        resultLabel: this.getRiderStatsFinalLabel(rowType),
        resultRank: row.result_rank,
        gcRank: null,
        isBreakaway: false,
        finishStatus: 'classified',
        statusReason: null,
        stageTimeSeconds: null,
        profile: row.profile,
        distanceKm: summary.distanceKm,
        elevationGainMeters: summary.elevationGainMeters,
        seasonPoints: finalPoints,
        stageScore: row.stage_score ?? 0,
        superTeamId: row.super_team_id ?? null,
        teamId: row.team_id ?? null,
        isStageRace: true,
      } satisfies RiderStatsRow);

      pointsByTerrain[resolveRiderStatsTerrainBucket(row.profile)] += finalPoints;
      pointsByRaceFormat.stageRace += finalPoints;
    }

    const rowTypeOrder: Record<RiderStatsRowType, number> = {
      stage_result: 0,
      gc_final: 1,
      points_final: 2,
      mountain_final: 3,
      youth_final: 4,
      breakaway_final: 5,
    };

    for (const season of seasons.values()) {
      season.raceBlocks.sort((left, right) => (
        left.startDate.localeCompare(right.startDate)
        || left.raceName.localeCompare(right.raceName, 'de')
        || left.raceId - right.raceId
      ));
      for (const block of season.raceBlocks) {
        block.rows.sort((left, right) => (
          left.date.localeCompare(right.date)
          || (left.stageNumber ?? 999) - (right.stageNumber ?? 999)
          || rowTypeOrder[left.rowType] - rowTypeOrder[right.rowType]
          || (left.resultRank ?? 999) - (right.resultRank ?? 999)
        ));
      }
    }

    const hasLieutenantsTable = tableExists(this.db, 'rider_lieutenants');
    const lieutenantRow = hasLieutenantsTable
      ? (this.db.prepare(`
          SELECT rl.lieutenant_id, r.first_name, r.last_name
          FROM rider_lieutenants rl
          JOIN riders r ON r.id = rl.lieutenant_id
          WHERE rl.leader_id = ? AND rl.season = ?
        `).get(rider.id, currentSeason) as { lieutenant_id: number; first_name: string; last_name: string } | undefined)
      : undefined;

    const leaderRow = hasLieutenantsTable
      ? (this.db.prepare(`
          SELECT rl.leader_id, r.first_name, r.last_name
          FROM rider_lieutenants rl
          JOIN riders r ON r.id = rl.leader_id
          WHERE rl.lieutenant_id = ? AND rl.season = ?
        `).get(rider.id, currentSeason) as { leader_id: number; first_name: string; last_name: string } | undefined)
      : undefined;

    const lieutenantInfo = lieutenantRow ? { id: lieutenantRow.lieutenant_id, name: `${lieutenantRow.first_name} ${lieutenantRow.last_name}` } : null;
    const leaderInfo = leaderRow ? { id: leaderRow.leader_id, name: `${leaderRow.first_name} ${leaderRow.last_name}` } : null;

    const fatigueHistory = !excludeFatigue && tableExists(this.db, 'rider_fatigue_history')
      ? (this.db.prepare(`
          SELECT id, rider_id AS riderId, date, type, race_name AS raceName,
                 stage_number AS stageNumber, stage_score AS stageScore,
                 short_change AS shortChange, long_decayable_change AS longDecayableChange,
                 long_locked_change AS longLockedChange, short_after AS shortAfter,
                 long_after AS longAfter
          FROM rider_fatigue_history
          WHERE rider_id = ?
          ORDER BY date DESC, id DESC
        `).all(rider.id) as RiderFatigueHistoryEntry[])
      : [];

    return {
      lieutenantInfo,
      leaderInfo,
      riderId: rider.id,
      riderName: `${rider.firstName} ${rider.lastName}`,
      age: rider.age ?? (new GameStateRepository(this.db).getCurrentSeason() - rider.birthYear),
      teamId: rider.activeTeamId ?? null,
      teamName: rider.activeTeamId != null ? new TeamRepository(this.db).getTeamById(rider.activeTeamId)?.name ?? null : null,
      weatherProfileId: rider.weatherProfileId,
      countryCode: rider.country?.code3 ?? rider.nationality ?? null,
      roleName: rider.role?.name ?? null,
      mentorName,
      mentoredRiderNames,
      overallRating: rider.overallRating,
      seasonFormPhase: rider.seasonFormPhase ?? 'neutral',
      formBonus: rider.formBonus ?? 0,
      raceFormBonus: rider.raceFormBonus ?? 0,
      program: programSummary?.program ?? rider.seasonProgram ?? null,
      programRaces: programSummary?.races ?? [],
      isUnavailable: rider.isUnavailable === true,
      healthStatusLabel: rider.healthStatusLabel ?? null,
      unavailableUntil: rider.unavailableUntil ?? null,
      unavailableDaysRemaining: rider.unavailableDaysRemaining ?? 0,
      currentSeasonPoints,
      currentSeasonRank,
      currentSeasonRaceDays: currentSeasonRaceStats.raceDays,
      seasonRaceDaysTotal: rider.seasonRaceDaysTotal ?? 0,
      rolling30dRaceDays: rider.rolling30dRaceDays ?? 0,
      longTermFatigueMalus: rider.longTermFatigueMalus ?? 0,
      longTermFatigueDecayable: rider.longTermFatigueDecayable ?? 0,
      longTermFatigueLocked: rider.longTermFatigueLocked ?? 0,
      shortTermFatigueMalus: rider.shortTermFatigueMalus ?? 0,
      totalFatigueLoadMalus: rider.totalFatigueLoadMalus ?? 0,
      shortTermFatigueWarning: rider.shortTermFatigueWarning ?? 'none',
      currentSeasonBreakawayAttempts,
      careerWins,
      pointsByTerrain,
      pointsByRaceFormat,
      careerRaceDaysBySeason,
      seasons: [...seasons.values()].sort((left, right) => left.season - right.season),
      peakDates: tableExists(this.db, 'rider_daily_state') 
        ? parsePeakDates((this.db.prepare('SELECT peak_dates_json FROM rider_daily_state WHERE rider_id = ?').get(rider.id) as { peak_dates_json: string } | undefined)?.peak_dates_json)
        : [],
      formHistory: tableExists(this.db, 'rider_form_history') 
        ? (this.db.prepare(`SELECT date, s_form AS sForm, r_form AS rForm, total_form AS totalForm ${excludeFatigue ? ', 0.0 AS shortFatigue, 0.0 AS longFatigue, 0.0 AS combinedFatigue' : ', short_fatigue AS shortFatigue, long_fatigue AS longFatigue, combined_fatigue AS combinedFatigue'} FROM rider_form_history WHERE rider_id = ? ORDER BY date ASC`).all(rider.id) as Array<{ date: string; sForm: number; rForm: number; totalForm: number; shortFatigue: number; longFatigue: number; combinedFatigue: number }>)
        : [],
      careerStats: this.getRiderCareerStats(rider.id),
      fatigueHistory,
      contracts: this.getRiderContracts(rider.id),
      seasonRoles: this.getRiderSeasonRoles(rider.id),
    } satisfies RiderStatsPayload;
  }

  public getRiderContracts(riderId: number): Array<{ startSeason: number; endSeason: number; teamId: number | null; teamName: string | null; teamAbbreviation: string | null; status: string }> {
    if (!tableExists(this.db, 'contracts')) {
      return [];
    }
    return this.db.prepare(`
      SELECT c.start_season AS startSeason, c.end_season AS endSeason, c.team_id AS teamId, t.name AS teamName, t.abbreviation AS teamAbbreviation, c.status AS status
      FROM contracts c
      LEFT JOIN teams t ON c.team_id = t.id
      WHERE c.rider_id = ?
      ORDER BY c.start_season DESC, c.id DESC
    `).all(riderId) as any[];
  }

  public getRiderSeasonRoles(riderId: number): Array<{ season: number; roleName: string }> {
    if (!tableExists(this.db, 'rider_season_roles') || !tableExists(this.db, 'sta_role')) {
      return [];
    }
    return this.db.prepare(`
      SELECT sr.season, role.name AS roleName
      FROM rider_season_roles sr
      JOIN sta_role role ON sr.role_id = role.id
      WHERE sr.rider_id = ?
      ORDER BY sr.season DESC
    `).all(riderId) as any[];
  }


  private getSeasonRaceStatsByRiderId(season: number, riderIds?: number[], skipRaceDays = false): Map<number, RiderSeasonRaceStats> {
    const statsByRiderId = new Map<number, RiderSeasonRaceStats>();
    if (!tableExists(this.db, 'rider_season_stats') || !tableExists(this.db, 'rider_season_category_stats')) {
      return statsByRiderId;
    }

    if (riderIds && riderIds.length === 0) {
      return statsByRiderId;
    }

    const riderFilter = riderIds ? `AND rider_id IN (${riderIds.map(() => '?').join(',')})` : '';
    const args = riderIds ? [season, ...riderIds] : [season];

    if (!skipRaceDays) {
      const raceDaysRows = this.db.prepare(`
        SELECT rider_id, race_days
        FROM rider_season_stats
        WHERE season = ? ${riderFilter}
      `).all(...args) as Array<{ rider_id: number; race_days: number }>;

      for (const row of raceDaysRows) {
        statsByRiderId.set(row.rider_id, { raceDays: row.race_days, wins: 0 });
      }
    } else if (riderIds) {
      for (const rId of riderIds) {
        statsByRiderId.set(rId, { raceDays: 0, wins: 0 });
      }
    }

    const winsRows = this.db.prepare(`
      SELECT rider_id, SUM(gc_wins + stage_wins + one_day_wins) AS wins
      FROM rider_season_category_stats
      WHERE season = ? ${riderFilter}
      GROUP BY rider_id
    `).all(...args) as Array<{ rider_id: number; wins: number }>;

    for (const row of winsRows) {
      let entry = statsByRiderId.get(row.rider_id);
      if (!entry) {
        entry = { raceDays: 0, wins: 0 };
        statsByRiderId.set(row.rider_id, entry);
      }
      entry.wins = row.wins;
    }

    return statsByRiderId;
  }


  private loadRaceFormSourcesByRiderId(riderIds: number[], season: number, currentDate: string): Map<number, RiderRaceFormSource[]> {
    const sourcesByRiderId = new Map<number, RiderRaceFormSource[]>();
    if (riderIds.length === 0) {
      return sourcesByRiderId;
    }

    const labelsByDate = this.loadRaceFormSourceLabelsByDate(season);
    const seasonStart = `${season}-01-01`;
    const seasonEnd = `${season}-12-31`;

    if (tableExists(this.db, 'rider_r_form_daily_awards')) {
      const chunkSize = 500;
      let awardRows: Array<{ rider_id: number; award_date: string; award_type: 'build' }> = [];
      for (let i = 0; i < riderIds.length; i += chunkSize) {
        const chunk = riderIds.slice(i, i + chunkSize);
        const placeholders = chunk.map(() => '?').join(', ');
        const chunkRows = this.db.prepare(`
          SELECT rider_id, award_date, award_type
          FROM rider_r_form_daily_awards
          WHERE rider_id IN (${placeholders})
            AND award_date >= ?
            AND award_date <= ?
            AND award_type = 'build'
          ORDER BY award_date ASC
        `).all(...chunk, seasonStart, seasonEnd) as any;
        awardRows = awardRows.concat(chunkRows);
      }

      for (const row of awardRows) {
        const sources = sourcesByRiderId.get(row.rider_id) ?? [];
        sources.push({
          date: row.award_date,
          amount: RACE_FORM_BUILD_SOURCE_AMOUNT,
          label: labelsByDate.get(row.award_date) ?? 'Rennbonus-Aufbau',
          type: 'build',
        });
        sourcesByRiderId.set(row.rider_id, sources);
      }
    }

    if (tableExists(this.db, 'rider_r_form_events')) {
      const chunkSize = 500;
      let eventRows: Array<{ rider_id: number; source_date: string; amount: number }> = [];
      for (let i = 0; i < riderIds.length; i += chunkSize) {
        const chunk = riderIds.slice(i, i + chunkSize);
        const placeholders = chunk.map(() => '?').join(', ');
        const chunkRows = this.db.prepare(`
          SELECT rider_id, source_date, amount
          FROM rider_r_form_events
          WHERE rider_id IN (${placeholders})
            AND source_date >= ?
            AND source_date <= ?
            AND expires_on > ?
          ORDER BY source_date ASC
        `).all(...chunk, seasonStart, seasonEnd, currentDate) as any;
        eventRows = eventRows.concat(chunkRows);
      }

      for (const row of eventRows) {
        const sources = sourcesByRiderId.get(row.rider_id) ?? [];
        sources.push({
          date: row.source_date,
          amount: row.amount,
          label: labelsByDate.get(row.source_date) ?? 'Freier Rennbonus',
          type: 'free',
        });
        sourcesByRiderId.set(row.rider_id, sources);
      }
    }

    for (const [riderId, sources] of sourcesByRiderId.entries()) {
      sourcesByRiderId.set(riderId, sources.sort((left, right) => left.date.localeCompare(right.date) || left.label.localeCompare(right.label, 'de')));
    }

    return sourcesByRiderId;
  }


  private loadRaceFormSourceLabelsByDate(season: number): Map<string, string> {
    const labelsByDate = new Map<string, string>();
    if (!tableExists(this.db, 'stages') || !tableExists(this.db, 'races')) {
      return labelsByDate;
    }

    const rows = this.db.prepare(`
      SELECT
        stages.date AS date,
        stages.stage_number AS stage_number,
        races.name AS race_name,
        races.is_stage_race AS is_stage_race
      FROM stages
      JOIN races ON races.id = stages.race_id
      WHERE stages.date >= ?
        AND stages.date <= ?
      ORDER BY stages.date ASC, races.id ASC, stages.stage_number ASC
    `).all(`${season}-01-01`, `${season}-12-31`) as Array<{ date: string; stage_number: number; race_name: string; is_stage_race: number }>;

    for (const row of rows) {
      const label = row.is_stage_race === 1
        ? `${row.race_name} Etappe ${row.stage_number}`
        : row.race_name;
      const existing = labelsByDate.get(row.date);
      labelsByDate.set(row.date, existing ? `${existing} / ${label}` : label);
    }

    return labelsByDate;
  }


  public getRiderById(id: number): Rider | null {
    const season = new GameStateRepository(this.db).getCurrentSeason();
    const currentDate = new GameStateRepository(this.db).getCurrentDate();
    const useDailyState = tableExists(this.db, 'rider_daily_state');
    const useFreeRaceForm = tableExists(this.db, 'rider_r_form_events');
    const row = this.db.prepare(`
      SELECT riders.*,
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
             ${useDailyState ? 'rider_state.season_points' : '0'} AS season_points,
             ${useDailyState ? 'rider_state.season_wins' : '0'} AS season_wins,
             ${useDailyState ? 'rider_state.season_race_days_total' : '0'} AS season_race_days_total,
             ${useDailyState ? 'rider_state.rolling_30d_race_days' : '0'} AS rolling_30d_race_days,
             ${useDailyState ? 'rider_state.short_term_fatigue' : '0.0'} AS short_term_fatigue,
             ${useDailyState ? 'rider_state.long_term_fatigue_decayable' : '0.0'} AS long_term_fatigue_decayable,
             ${useDailyState ? 'rider_state.long_term_fatigue_locked' : '0.0'} AS long_term_fatigue_locked,
             0 AS accumulated_random_fatigue,
             (
               SELECT c.end_season
               FROM contracts c
               WHERE c.id = riders.active_contract_id
             ) AS contract_end_season
      FROM riders
      JOIN sta_country country ON country.id = riders.country_id
      LEFT JOIN sta_role role ON role.id = riders.role_id
      LEFT JOIN type_rider rider_type ON rider_type.id = riders.rider_type_id
      LEFT JOIN type_rider specialization_1 ON specialization_1.id = riders.specialization_1_id
      LEFT JOIN type_rider specialization_2 ON specialization_2.id = riders.specialization_2_id
      LEFT JOIN type_rider specialization_3 ON specialization_3.id = riders.specialization_3_id
      ${useDailyState ? 'LEFT JOIN rider_daily_state rider_state ON rider_state.rider_id = riders.id' : ''}
      ${useFreeRaceForm ? 'LEFT JOIN (SELECT rider_id, SUM(amount) AS total FROM rider_r_form_events GROUP BY rider_id) free_r_form ON free_r_form.rider_id = riders.id' : ''}
      WHERE riders.id = ?
    `).get(id) as RiderRow | undefined;
    return row ? mapRider(row, season, currentDate, 0) : null;
  }


  private attachFormDebugData(riders: Rider[], season: number, currentDate: string): Rider[] {
    if (riders.length === 0) {
      return riders;
    }

    const historyByRiderId = this.loadRiderFormHistoryByRiderId(riders.map((rider) => rider.id), season);
    const seasonStart = `${season}-01-01`;
    const seasonEnd = `${season}-10-31`;

    return riders.map((rider) => {
      const history = historyByRiderId.get(rider.id) ?? [];
      const projection = this.buildFormDebugSeries(rider, history, seasonStart, seasonEnd, currentDate);
      return {
        ...rider,
        formHistory: history,
        formForecast: projection,
      } satisfies Rider;
    });
  }


  private loadRiderFormHistoryByRiderId(riderIds: number[], season: number): Map<number, RiderFormSnapshot[]> {
    const historyByRiderId = new Map<number, RiderFormSnapshot[]>();
    if (riderIds.length === 0 || !tableExists(this.db, 'rider_form_history')) {
      return historyByRiderId;
    }

    const placeholders = riderIds.map(() => '?').join(', ');
    const rows = this.db.prepare(`
      SELECT rider_id, date, s_form, r_form, total_form
      FROM rider_form_history
      WHERE rider_id IN (${placeholders})
        AND date >= ?
        AND date <= ?
      ORDER BY date ASC
    `).all(...riderIds, `${season}-01-01`, `${season}-10-31`) as Array<{
      rider_id: number;
      date: string;
      s_form: number;
      r_form: number;
      total_form: number;
    }>;

    for (const row of rows) {
      const snapshots = historyByRiderId.get(row.rider_id) ?? [];
      snapshots.push({
        date: row.date,
        sForm: row.s_form,
        rForm: row.r_form,
        totalForm: row.total_form,
      });
      historyByRiderId.set(row.rider_id, snapshots);
    }

    return historyByRiderId;
  }


  private buildFormDebugSeries(rider: Rider, history: RiderFormSnapshot[], seasonStart: string, seasonEnd: string, currentDate: string): FormDebugPoint[] {
    const historyByDate = new Map(history.map((entry) => [entry.date, entry]));
    const points: FormDebugPoint[] = [];

    for (let date = seasonStart; date <= seasonEnd; date = addDaysIso(date, 1)) {
      const historyEntry = historyByDate.get(date);
      if (historyEntry) {
        points.push({
          date,
          sForm: historyEntry.sForm,
          rForm: historyEntry.rForm,
          totalForm: historyEntry.totalForm,
          isProjection: date > currentDate,
        });
        continue;
      }

      const projected = resolveProjectionPoint(date, rider.seasonFormPeakDates ?? []);
      points.push({
        date,
        sForm: projected.sForm,
        rForm: projected.rForm,
        totalForm: roundToTwoDecimals(projected.sForm + projected.rForm),
        isProjection: date > currentDate,
      });
    }

    return points;
  }


  private createEmptyRiderStatsPayload(
    rider: Rider,
    currentSeasonRank: number | null,
    currentSeasonPoints: number,
    currentSeasonRaceDays: number,
    currentSeasonBreakawayAttempts: number,
    careerWins: number,
    careerRaceDaysBySeason: CareerRaceDaysSeasonRow[],
    programSummary: RiderProgramRaceSummary | null,
    mentorName: string | null,
    mentoredRiderNames: string[],
  ): RiderStatsPayload {
    return {
      riderId: rider.id,
      riderName: `${rider.firstName} ${rider.lastName}`,
      age: rider.age ?? (new GameStateRepository(this.db).getCurrentSeason() - rider.birthYear),
      teamId: rider.activeTeamId ?? null,
      teamName: rider.activeTeamId != null ? new TeamRepository(this.db).getTeamById(rider.activeTeamId)?.name ?? null : null,
      weatherProfileId: rider.weatherProfileId,
      countryCode: rider.country?.code3 ?? rider.nationality ?? null,
      roleName: rider.role?.name ?? null,
      mentorName,
      mentoredRiderNames,
      overallRating: rider.overallRating,
      seasonFormPhase: rider.seasonFormPhase ?? 'neutral',
      formBonus: rider.formBonus ?? 0,
      raceFormBonus: rider.raceFormBonus ?? 0,
      program: programSummary?.program ?? rider.seasonProgram ?? null,
      programRaces: programSummary?.races ?? [],
      isUnavailable: rider.isUnavailable === true,
      healthStatusLabel: rider.healthStatusLabel ?? null,
      unavailableUntil: rider.unavailableUntil ?? null,
      unavailableDaysRemaining: rider.unavailableDaysRemaining ?? 0,
      currentSeasonPoints,
      currentSeasonRank,
      currentSeasonRaceDays,
      seasonRaceDaysTotal: rider.seasonRaceDaysTotal ?? 0,
      rolling30dRaceDays: rider.rolling30dRaceDays ?? 0,
      longTermFatigueMalus: rider.longTermFatigueMalus ?? 0,
      longTermFatigueDecayable: rider.longTermFatigueDecayable ?? 0,
      longTermFatigueLocked: rider.longTermFatigueLocked ?? 0,
      shortTermFatigueMalus: rider.shortTermFatigueMalus ?? 0,
      totalFatigueLoadMalus: rider.totalFatigueLoadMalus ?? 0,
      shortTermFatigueWarning: rider.shortTermFatigueWarning ?? 'none',
      currentSeasonBreakawayAttempts,
      careerWins,
      pointsByTerrain: emptyRiderStatsPointsByTerrain(),
      pointsByRaceFormat: emptyRiderStatsPointsByRaceFormat(),
      careerRaceDaysBySeason,
      seasons: [],
      careerStats: this.getRiderCareerStats(rider.id),
      fatigueHistory: [],
      contracts: this.getRiderContracts(rider.id),
      seasonRoles: this.getRiderSeasonRoles(rider.id),
    };
  }

  private getRiderCareerStats(riderId: number): RiderCareerStats {
    const careerStatsRow = tableExists(this.db, 'rider_career_stats')
      ? this.db.prepare(`
          SELECT breakaway_attempts, attacks, counter_attacks, crashes, defects,
                 illnesses, illness_days, injuries, injury_days, superteam_count,
                 dns_count, dnf_count, otl_count, breakaway_kms, successful_breakaways,
                 race_days, superform_days, supermalus_days, home_advantage_days,
                 super_home_advantage_days, home_pressure_days, total_km
          FROM rider_career_stats
          WHERE rider_id = ?
        `).get(riderId) as {
          breakaway_attempts: number;
          attacks: number;
          counter_attacks: number;
          crashes: number;
          defects: number;
          illnesses: number;
          illness_days: number;
          injuries: number;
          injury_days: number;
          superteam_count: number;
          dns_count: number;
          dnf_count: number;
          otl_count: number;
          breakaway_kms: number;
          successful_breakaways: number;
          race_days: number;
          superform_days: number;
          supermalus_days: number;
          home_advantage_days: number;
          super_home_advantage_days: number;
          home_pressure_days: number;
          total_km: number;
        } | undefined
      : undefined;

    const breakawayAttempts = careerStatsRow?.breakaway_attempts ?? 0;
    const attacks = careerStatsRow?.attacks ?? 0;
    const counterAttacks = careerStatsRow?.counter_attacks ?? 0;
    const crashes = careerStatsRow?.crashes ?? 0;
    const defects = careerStatsRow?.defects ?? 0;
    const illnesses = careerStatsRow?.illnesses ?? 0;
    const illnessDays = careerStatsRow?.illness_days ?? 0;
    const injuries = careerStatsRow?.injuries ?? 0;
    const injuryDays = careerStatsRow?.injury_days ?? 0;
    const superteamCount = careerStatsRow?.superteam_count ?? 0;
    const dnsCount = careerStatsRow?.dns_count ?? 0;
    const dnfCount = careerStatsRow?.dnf_count ?? 0;
    const otlCount = careerStatsRow?.otl_count ?? 0;
    const breakawayKms = careerStatsRow?.breakaway_kms ?? 0;
    const successfulBreakaways = careerStatsRow?.successful_breakaways ?? 0;
    const homeAdvantageDays = careerStatsRow?.home_advantage_days ?? 0;
    const superHomeAdvantageDays = careerStatsRow?.super_home_advantage_days ?? 0;
    const homePressureDays = careerStatsRow?.home_pressure_days ?? 0;
    const totalKm = careerStatsRow?.total_km ?? 0;

    const categories: RiderCareerStats['categories'] = {};

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

    if (tableExists(this.db, 'rider_career_category_stats')) {
      const catRows = this.db.prepare(`
        SELECT *
        FROM rider_career_category_stats
        WHERE rider_id = ?
      `).all(riderId) as Array<{
        category_name: string;
        gc_wins: number;
        gc_second: number;
        gc_third: number;
        gc_top_ten: number;
        stage_wins: number;
        stage_second: number;
        stage_third: number;
        stage_top_ten: number;
        one_day_wins: number;
        one_day_second: number;
        one_day_third: number;
        one_day_top_ten: number;
        mountain_wins: number;
        points_wins: number;
        youth_wins: number;
        breakaway_wins: number;
        race_days: number;
        leader_jerseys: number;
        points_jerseys: number;
        mountain_jerseys: number;
        youth_jerseys: number;
        breakaway_jerseys: number;
        sprint_wins: number;
        climb_wins_hc: number;
        climb_wins_1: number;
        climb_wins_2: number;
        climb_wins_3: number;
        climb_wins_4: number;
        win_flat: number;
        win_rolling: number;
        win_hilly: number;
        win_hilly_difficult: number;
        win_medium_mountain: number;
        win_mountain: number;
        win_high_mountain: number;
        win_cobble: number;
        win_cobble_hill: number;
        win_itt: number;
        win_ttt: number;
        win_weather_1: number;
        win_weather_2: number;
        win_weather_3: number;
        win_weather_4: number;
        win_weather_5: number;
        win_weather_6: number;
        win_weather_7: number;
      }>;

      for (const row of catRows) {
        categories[row.category_name] = {
          gcWins: row.gc_wins,
          gcSecond: row.gc_second,
          gcThird: row.gc_third,
          gcTopTen: row.gc_top_ten,
          stageWins: row.stage_wins,
          stageSecond: row.stage_second,
          stageThird: row.stage_third,
          stageTopTen: row.stage_top_ten,
          oneDayWins: row.one_day_wins,
          oneDaySecond: row.one_day_second,
          oneDayThird: row.one_day_third,
          oneDayTopTen: row.one_day_top_ten,
          mountainWins: row.mountain_wins,
          pointsWins: row.points_wins,
          youthWins: row.youth_wins,
          breakawayWins: row.breakaway_wins,
          raceDays: row.race_days,
          leaderJerseys: row.leader_jerseys,
          pointsJerseys: row.points_jerseys,
          mountainJerseys: row.mountain_jerseys,
          youthJerseys: row.youth_jerseys,
          breakawayJerseys: row.breakaway_jerseys,
          sprintWins: row.sprint_wins,
          climbWinsHC: row.climb_wins_hc,
          climbWins1: row.climb_wins_1,
          climbWins2: row.climb_wins_2,
          climbWins3: row.climb_wins_3,
          climbWins4: row.climb_wins_4,
          winFlat: row.win_flat,
          winRolling: row.win_rolling,
          winHilly: row.win_hilly,
          winHillyDifficult: row.win_hilly_difficult,
          winMediumMountain: row.win_medium_mountain,
          winMountain: row.win_mountain,
          winHighMountain: row.win_high_mountain,
          winCobble: row.win_cobble,
          winCobbleHill: row.win_cobble_hill,
          winITT: row.win_itt,
          winTTT: row.win_ttt,
          winWeather1: row.win_weather_1,
          winWeather2: row.win_weather_2,
          winWeather3: row.win_weather_3,
          winWeather4: row.win_weather_4,
          winWeather5: row.win_weather_5,
          winWeather6: row.win_weather_6,
          winWeather7: row.win_weather_7,
        };
      }
    }

    let totalGcWins = 0;
    let totalStageWins = 0;
    for (const cat of Object.keys(categories)) {
      totalGcWins += categories[cat].gcWins + categories[cat].oneDayWins;
      totalStageWins += categories[cat].stageWins;
    }

    return {
      breakawayAttempts,
      attacks,
      counterAttacks,
      crashes,
      defects,
      illnesses,
      illnessDays,
      injuries,
      injuryDays,
      dnsCount,
      dnfCount,
      otlCount,
      totalGcWins,
      totalStageWins,
      successfulBreakaways,
      homeAdvantageDays,
      superHomeAdvantageDays,
      homePressureDays,
      breakawayKms,
      superteamCount,
      totalKm,
      categories,
    };
  }

  private getCareerWins(riderId: number): number {
    if (!tableExists(this.db, 'rider_career_category_stats')) {
      return 0;
    }

    const row = this.db.prepare(`
      SELECT SUM(gc_wins + stage_wins + one_day_wins) AS wins
      FROM rider_career_category_stats
      WHERE rider_id = ?
    `).get(riderId) as { wins: number | null } | undefined;

    return row?.wins ?? 0;
  }

  private getSeasonBreakawayAttempts(season: number, riderId: number): number {
    if (!tableExists(this.db, 'rider_season_stats')) {
      return 0;
    }

    const row = this.db.prepare(`
      SELECT breakaway_attempts
      FROM rider_season_stats
      WHERE season = ? AND rider_id = ?
    `).get(season, riderId) as { breakaway_attempts: number } | undefined;

    return row?.breakaway_attempts ?? 0;
  }

  private getCareerRaceDaysBySeason(riderId: number): CareerRaceDaysSeasonRow[] {
    if (!tableExists(this.db, 'rider_season_stats')) {
      return [];
    }

    const rows = this.db.prepare(`
      SELECT season, race_days AS raceDays
      FROM rider_season_stats
      WHERE rider_id = ?
      ORDER BY season DESC
    `).all(riderId) as any[];

    return rows.map(r => ({
      season: Number(r.season),
      raceDays: Number(r.raceDays ?? 0)
    }));
  }


  private mapResultTypeIdToRiderStatsRowType(resultTypeId: number): RiderStatsRowType | null {
    switch (resultTypeId) {
      case RESULT_TYPE_IDS.gc:
        return 'gc_final';
      case RESULT_TYPE_IDS.points:
        return 'points_final';
      case RESULT_TYPE_IDS.mountain:
        return 'mountain_final';
      case RESULT_TYPE_IDS.youth:
        return 'youth_final';
      case RESULT_TYPE_IDS.breakaway:
        return 'breakaway_final';
      default:
        return null;
    }
  }


  private getRiderStatsFinalLabel(rowType: RiderStatsRowType): string {
    switch (rowType) {
      case 'gc_final':
        return 'Gesamtwertung';
      case 'points_final':
        return 'Punktewertung';
      case 'mountain_final':
        return 'Bergwertung';
      case 'youth_final':
        return 'Nachwuchswertung';
      case 'breakaway_final':
        return 'Ausreißerwertung';
      default:
        return 'Ergebnis';
    }
  }


  public getUpcomingStageSummary(stages: Stage[], isStageRace: boolean, currentDate: string): RaceStageSummary | undefined {
    if (stages.length === 0) return undefined;

    const orderedStages = [...stages].sort((left, right) => {
      if (left.stageNumber !== right.stageNumber) {
        return left.stageNumber - right.stageNumber;
      }
      if (left.date !== right.date) {
        return left.date.localeCompare(right.date);
      }
      return left.id - right.id;
    });

    let selectedStage = orderedStages[0];
    if (isStageRace) {
      if (currentDate < orderedStages[0].date) {
        selectedStage = orderedStages[0];
      } else {
        const completedStageIds = tableExists(this.db, 'all_results')
          ? new Set<number>((this.db.prepare(`
            SELECT DISTINCT stage_id
            FROM all_results
            WHERE result_type_id = ?
              AND stage_id IN (${orderedStages.map(() => '?').join(', ')})
          `).all(RESULT_TYPE_IDS.stage, ...orderedStages.map((stage) => stage.id)) as Array<{ stage_id: number }>).map((row) => row.stage_id))
          : new Set<number>();

        selectedStage = orderedStages.find((stage) => stage.date <= currentDate && !completedStageIds.has(stage.id))
          ?? orderedStages.find((stage) => stage.date >= currentDate && !completedStageIds.has(stage.id))
          ?? orderedStages.find((stage) => stage.date >= currentDate)
          ?? orderedStages.find((stage) => !completedStageIds.has(stage.id))
          ?? orderedStages[orderedStages.length - 1];
      }
    }

    if (!selectedStage) return undefined;

    const summary = summarizeStageProfile(selectedStage.detailsCsvFile, selectedStage.startElevation);
    return {
      stageId: selectedStage.id,
      stageNumber: selectedStage.stageNumber,
      date: selectedStage.date,
      profile: selectedStage.profile,
      detailsCsvFile: selectedStage.detailsCsvFile,
      startElevation: selectedStage.startElevation,
      distanceKm: summary.distanceKm,
      elevationGainMeters: summary.elevationGainMeters,
    };
  }


  public getSeasonPointsByRiderId(season: number, riderIds?: number[]): Map<number, number> {
    if (!tableExists(this.db, 'season_point_events')) {
      return new Map();
    }

    let sql: string;
    let args: any[];

    if (riderIds && riderIds.length === 0) {
      return new Map();
    }

    if (riderIds && riderIds.length <= 500) {
      const placeholders = riderIds.map(() => '?').join(',');
      sql = `
        SELECT rider_id, SUM(points_awarded) AS points_total
        FROM season_point_events
        WHERE season = ? AND rider_id IN (${placeholders})
        GROUP BY rider_id
      `;
      args = [season, ...riderIds];
    } else {
      sql = `
        SELECT rider_id, SUM(points_awarded) AS points_total
        FROM season_point_events
        WHERE season = ?
        GROUP BY rider_id
      `;
      args = [season];
    }

    const rows = this.db.prepare(sql).all(...args) as Array<{ rider_id: number; points_total: number }>;

    return new Map(rows.map((row) => [row.rider_id, row.points_total]));
  }

}
