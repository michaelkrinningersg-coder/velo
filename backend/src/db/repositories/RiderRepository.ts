import { summarizeStageProfile } from '../../simulation/StageParser';
import Database from 'better-sqlite3';
import { Country, FormDebugPoint, Nationality, PrecalculatedRaceIncident, Race, RaceCategory, RaceCategoryBonus, RaceClassificationRow, RaceProgram, RaceProgramParticipant, RaceStageSummary, RealtimeClassificationLeaders, RealtimeClassificationStanding, RealtimeGcStanding, ResultType, Rider, RiderFormSnapshot, RiderHealthStatus, RiderPotentials, RiderProgramRaceSummary, RiderRaceFormSource, RiderSeasonFormPhase, RiderSkillKey, RiderSkills, RiderStatsPayload, RiderStatsPointsByRaceFormat, RiderStatsPointsByTerrain, RiderStatsRaceBlock, RiderStatsRow, RiderStatsRowType, RiderStatsSeason, Role, SeasonPointAwardType, SeasonStandingCountryRow, SeasonStandingCountryRiderRow, SeasonStandingRow, SeasonStandingsPayload, Stage, StageClassification, StageMarkerCategory, StageMarkerClassification, StageNonFinisherRow, StageResultsPayload, StageScoringRule, Team, RiderCareerStats } from '../../../../shared/types';
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


  private getRidersQuery(useContracts: boolean, filterByTeam: boolean): string {
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
      ${useDailyState ? 'rider_state.season_race_days_total' : '0'} AS season_race_days_total,
      ${useDailyState ? 'rider_state.rolling_30d_race_days' : '0'} AS rolling_30d_race_days
    `;
    const riderStateJoin = useDailyState ? 'LEFT JOIN rider_daily_state rider_state ON rider_state.rider_id = riders.id' : '';
    const freeRaceFormJoin = useFreeRaceForm ? 'LEFT JOIN (SELECT rider_id, SUM(amount) AS total FROM rider_r_form_events GROUP BY rider_id) free_r_form ON free_r_form.rider_id = riders.id' : '';

    if (!useContracts) {
      return filterByTeam
        ? `SELECT ${countrySelect}, NULL AS contract_end_season FROM riders JOIN sta_country country ON country.id = riders.country_id LEFT JOIN sta_role role ON role.id = riders.role_id LEFT JOIN type_rider rider_type ON rider_type.id = riders.rider_type_id LEFT JOIN type_rider specialization_1 ON specialization_1.id = riders.specialization_1_id LEFT JOIN type_rider specialization_2 ON specialization_2.id = riders.specialization_2_id LEFT JOIN type_rider specialization_3 ON specialization_3.id = riders.specialization_3_id ${riderStateJoin} ${freeRaceFormJoin} WHERE active_team_id = ? AND is_retired = 0 ORDER BY overall_rating DESC`
        : `SELECT ${countrySelect}, NULL AS contract_end_season FROM riders JOIN sta_country country ON country.id = riders.country_id LEFT JOIN sta_role role ON role.id = riders.role_id LEFT JOIN type_rider rider_type ON rider_type.id = riders.rider_type_id LEFT JOIN type_rider specialization_1 ON specialization_1.id = riders.specialization_1_id LEFT JOIN type_rider specialization_2 ON specialization_2.id = riders.specialization_2_id LEFT JOIN type_rider specialization_3 ON specialization_3.id = riders.specialization_3_id ${riderStateJoin} ${freeRaceFormJoin} WHERE is_retired = 0 ORDER BY overall_rating DESC`;
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

    return filterByTeam
      ? `${selectWithResolvedContract} ${freeRaceFormJoin} WHERE COALESCE(current_contract.team_id, riders.active_team_id) = ? AND riders.is_retired = 0 ORDER BY riders.overall_rating DESC`
      : `${selectWithResolvedContract} ${freeRaceFormJoin} WHERE riders.is_retired = 0 ORDER BY riders.overall_rating DESC`;
  }


  public getRiders(teamId?: number, includeFormDebug = false): Rider[] {
    const season = new GameStateRepository(this.db).getCurrentSeason();
    const currentDate = new GameStateRepository(this.db).getCurrentDate();
    const useContracts = tableExists(this.db, 'contracts');
    const rows: RiderRow[] = teamId != null
      ? (useContracts
        ? this.db.prepare(new RiderRepository(this.db).getRidersQuery(true, true)).all(season, season, teamId)
        : this.db.prepare(new RiderRepository(this.db).getRidersQuery(false, true)).all(teamId)
      ) as RiderRow[]
      : (useContracts
        ? this.db.prepare(new RiderRepository(this.db).getRidersQuery(true, false)).all(season, season)
        : this.db.prepare(new RiderRepository(this.db).getRidersQuery(false, false)).all()
      ) as RiderRow[];
    const seasonPointsByRiderId = new RiderRepository(this.db).getSeasonPointsByRiderId(season);
    const raceFormSourcesByRiderId = this.loadRaceFormSourcesByRiderId(rows.map((row) => row.id), season, currentDate);
    const seasonRaceStatsByRiderId = this.getSeasonRaceStatsByRiderId(season);
    const yearStartSkillsByRiderId = this.loadYearlyBaselinesByRiderId(rows.map((row) => row.id), season);
    const riders = rows.map((row) => ({
      ...mapRider(row, season, currentDate, seasonPointsByRiderId.get(row.id) ?? 0),
      yearStartSkills: yearStartSkillsByRiderId.get(row.id),
      raceFormSources: raceFormSourcesByRiderId.get(row.id) ?? [],
      seasonRaceDays: seasonRaceStatsByRiderId.get(row.id)?.raceDays ?? 0,
      seasonWins: seasonRaceStatsByRiderId.get(row.id)?.wins ?? 0,
    }));
    const ridersWithPrograms = this.attachProgramData(riders, season);
    const ridersWithMentors = this.attachMentorData(ridersWithPrograms);
    return includeFormDebug ? this.attachFormDebugData(ridersWithMentors, season, currentDate) : ridersWithMentors;
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


  private loadYearlyBaselinesByRiderId(riderIds: number[], season: number): Map<number, Record<RiderSkillKey, number>> {
    if (riderIds.length === 0 || !tableExists(this.db, 'rider_skill_yearly_baseline')) {
      return new Map();
    }
    const placeholders = riderIds.map(() => '?').join(', ');
    const rows = this.db.prepare(`
      SELECT rider_id, skill_key, baseline_value
      FROM rider_skill_yearly_baseline
      WHERE season = ? AND rider_id IN (${placeholders})
    `).all(season, ...riderIds) as Array<{ rider_id: number; skill_key: string; baseline_value: number }>;

    const map = new Map<number, Record<RiderSkillKey, number>>();
    for (const row of rows) {
      if (!map.has(row.rider_id)) {
        map.set(row.rider_id, {} as Record<RiderSkillKey, number>);
      }
      map.get(row.rider_id)![row.skill_key as RiderSkillKey] = row.baseline_value;
    }
    return map;
  }


  private attachProgramData(riders: Rider[], season: number): Rider[] {
    if (riders.length === 0 || !tableExists(this.db, 'rider_season_programs') || !tableExists(this.db, 'race_programs')) {
      return riders;
    }

    const riderIds = riders.map((rider) => rider.id);
    const placeholders = riderIds.map(() => '?').join(', ');
    const programRows = this.db.prepare(`
      SELECT rider_season_programs.rider_id,
             rider_season_programs.program_id,
             race_programs.name AS program_name,
             race_programs.peak1_min,
             race_programs.peak1_max,
             race_programs.peak2_min,
             race_programs.peak2_max,
             race_programs.peak3_min,
             race_programs.peak3_max
      FROM rider_season_programs
      JOIN race_programs ON race_programs.id = rider_season_programs.program_id
      WHERE rider_season_programs.season = ?
        AND rider_season_programs.rider_id IN (${placeholders})
    `).all(season, ...riderIds) as Array<RiderSeasonProgramRow & RaceProgramRow>;
    const programByRiderId = new Map(programRows.map((row) => [row.rider_id, {
      id: row.program_id,
      name: row.program_name,
      peak1Min: row.peak1_min,
      peak1Max: row.peak1_max,
      peak2Min: row.peak2_min,
      peak2Max: row.peak2_max,
      peak3Min: row.peak3_min,
      peak3Max: row.peak3_max,
    } satisfies RaceProgram]));

    const raceRows = tableExists(this.db, 'race_program_races')
      ? this.db.prepare(`
          SELECT rider_season_programs.rider_id,
                 race_program_races.race_id
          FROM rider_season_programs
          JOIN race_program_races ON race_program_races.program_id = rider_season_programs.program_id
          WHERE rider_season_programs.season = ?
            AND rider_season_programs.rider_id IN (${placeholders})
          ORDER BY race_program_races.race_id ASC
        `).all(season, ...riderIds) as Array<{ rider_id: number; race_id: number }>
      : [];
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
             race_programs.name,
             race_programs.peak1_min,
             race_programs.peak1_max,
             race_programs.peak2_min,
             race_programs.peak2_max,
             race_programs.peak3_min,
             race_programs.peak3_max
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
      WHERE race_program_races.program_id = ?
      ORDER BY races.start_date ASC, races.id ASC
    `).all(programRow.id) as RaceRow[];
    const stagesByRaceId = new RaceRepository(this.db).getStagesByRaceIds(raceRows.map(row => row.id));
    const currentDate = new GameStateRepository(this.db).getCurrentDate();
    return {
      program: mapRaceProgram(programRow),
      races: raceRows.map((row) => {
        const stages = stagesByRaceId.get(row.id) ?? [];
        return mapRaceWithSummary(row, stages, new RiderRepository(this.db).getUpcomingStageSummary(stages, row.is_stage_race === 1, currentDate));
      }),
    };
  }


  public getRiderStats(riderId: number): RiderStatsPayload | null {
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
    const currentSeasonPoints = new RiderRepository(this.db).getSeasonPointsByRiderId(currentSeason).get(rider.id) ?? 0;
    const currentSeasonRaceStats = this.getSeasonRaceStatsByRiderId(currentSeason, rider.id).get(rider.id) ?? { raceDays: 0, wins: 0 };
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
        gc_results.rank AS gc_rank,
        stage_points.points_awarded AS stage_points,
        stage_entries.status AS stage_entry_status,
        stage_entries.status_reason AS stage_entry_status_reason,
        stages.stage_score AS stage_score
      FROM stage_entries
      JOIN stages ON stages.id = stage_entries.stage_id
      JOIN races ON races.id = stages.race_id
      JOIN race_categories ON race_categories.id = races.category_id
      LEFT JOIN results rider_stage_results
        ON rider_stage_results.stage_id = stages.id
       AND rider_stage_results.rider_id = stage_entries.rider_id
       AND rider_stage_results.result_type_id = ${RESULT_TYPE_IDS.stage}
      LEFT JOIN results team_stage_results
        ON team_stage_results.stage_id = stages.id
       AND team_stage_results.team_id = stage_entries.team_id
       AND team_stage_results.rider_id IS NULL
       AND team_stage_results.result_type_id = ${RESULT_TYPE_IDS.stage}
       AND stages.profile = 'TTT'
      LEFT JOIN results gc_results
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
        stages.stage_score AS stage_score
      FROM results
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
       END
      WHERE results.rider_id = ?
        AND races.is_stage_race = 1
        AND stages.stage_number = races.number_of_stages
        AND results.result_type_id IN (${RESULT_TYPE_IDS.gc}, ${RESULT_TYPE_IDS.points}, ${RESULT_TYPE_IDS.mountain}, ${RESULT_TYPE_IDS.youth})
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
      } satisfies RiderStatsRow);

      const terrainBucket = resolveRiderStatsTerrainBucket(row.profile);
      pointsByTerrain[terrainBucket] += stagePoints;
      if (row.is_stage_race === 1) {
        pointsByRaceFormat.stageRace += stagePoints;
      } else {
        pointsByRaceFormat.oneDay += stagePoints;
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

    return {
      riderId: rider.id,
      riderName: `${rider.firstName} ${rider.lastName}`,
      age: rider.age ?? (new GameStateRepository(this.db).getCurrentSeason() - rider.birthYear),
      teamId: rider.activeTeamId ?? null,
      teamName: rider.activeTeamId != null ? new TeamRepository(this.db).getTeamById(rider.activeTeamId)?.name ?? null : null,
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
        ? (this.db.prepare('SELECT date, s_form AS sForm, r_form AS rForm, total_form AS totalForm FROM rider_form_history WHERE rider_id = ? ORDER BY date ASC').all(rider.id) as Array<{ date: string; sForm: number; rForm: number; totalForm: number }>)
        : [],
      careerStats: this.getRiderCareerStats(rider.id),
    } satisfies RiderStatsPayload;
  }


  private getSeasonRaceStatsByRiderId(season: number, riderId?: number): Map<number, RiderSeasonRaceStats> {
    const statsByRiderId = new Map<number, RiderSeasonRaceStats>();
    if (!tableExists(this.db, 'results') || !tableExists(this.db, 'stages')) {
      return statsByRiderId;
    }

    const riderFilterStageEntries = riderId != null ? 'AND stage_entries.rider_id = ?' : '';
    const riderFilterResults = riderId != null ? 'AND results.rider_id = ?' : '';
    const riderFilterStageEntriesResults = riderId != null ? 'AND stage_entries.rider_id = ?' : '';

    const argsStageEntries = riderId != null ? [season, riderId] : [season];
    const argsResults = riderId != null ? [RESULT_TYPE_IDS.stage, season, riderId] : [RESULT_TYPE_IDS.stage, season];
    const argsResultsGc = riderId != null ? [RESULT_TYPE_IDS.gc, season, riderId] : [RESULT_TYPE_IDS.gc, season];

    // 1. Race Days
    const raceDaysRows = this.db.prepare(`
      SELECT stage_entries.rider_id AS rider_id, COUNT(DISTINCT stage_entries.stage_id) AS race_days
      FROM stage_entries
      JOIN stages ON stages.id = stage_entries.stage_id
      WHERE stage_entries.status != 'dns' AND CAST(substr(stages.date, 1, 4) AS INTEGER) = ?
        ${riderFilterStageEntries}
      GROUP BY stage_entries.rider_id
    `).all(...argsStageEntries) as Array<{ rider_id: number; race_days: number }>;

    for (const row of raceDaysRows) {
      statsByRiderId.set(row.rider_id, { raceDays: row.race_days, wins: 0 });
    }

    // 2. Individual Stage Wins
    const individualWinsRows = this.db.prepare(`
      SELECT results.rider_id AS rider_id, COUNT(*) AS wins
      FROM results
      JOIN stages ON stages.id = results.stage_id
      WHERE results.result_type_id = ? AND results.rank = 1 AND results.rider_id IS NOT NULL
        AND CAST(substr(stages.date, 1, 4) AS INTEGER) = ?
        ${riderFilterResults}
      GROUP BY results.rider_id
    `).all(...argsResults) as Array<{ rider_id: number; wins: number }>;

    for (const row of individualWinsRows) {
      if (statsByRiderId.has(row.rider_id)) {
        statsByRiderId.get(row.rider_id)!.wins += row.wins;
      }
    }

    // 3. TTT Stage Wins
    const tttWinsRows = this.db.prepare(`
      SELECT stage_entries.rider_id AS rider_id, COUNT(*) AS wins
      FROM results
      JOIN stages ON stages.id = results.stage_id
      JOIN stage_entries ON stage_entries.stage_id = results.stage_id AND stage_entries.team_id = results.team_id
      WHERE results.result_type_id = ? AND results.rank = 1 AND results.rider_id IS NULL
        AND stage_entries.status != 'dns'
        AND CAST(substr(stages.date, 1, 4) AS INTEGER) = ?
        ${riderFilterStageEntriesResults}
      GROUP BY stage_entries.rider_id
    `).all(...argsResults) as Array<{ rider_id: number; wins: number }>;

    for (const row of tttWinsRows) {
      if (statsByRiderId.has(row.rider_id)) {
        statsByRiderId.get(row.rider_id)!.wins += row.wins;
      }
    }

    // 4. GC Wins
    const gcWinsRows = this.db.prepare(`
      SELECT results.rider_id AS rider_id, COUNT(*) AS wins
      FROM results
      JOIN stages ON stages.id = results.stage_id
      JOIN races ON races.id = stages.race_id
      WHERE results.result_type_id = ? AND results.rank = 1 AND results.rider_id IS NOT NULL
        AND races.is_stage_race = 1 AND stages.stage_number = races.number_of_stages
        AND CAST(substr(stages.date, 1, 4) AS INTEGER) = ?
        ${riderFilterResults}
      GROUP BY results.rider_id
    `).all(...argsResultsGc) as Array<{ rider_id: number; wins: number }>;

    for (const row of gcWinsRows) {
      if (statsByRiderId.has(row.rider_id)) {
        statsByRiderId.get(row.rider_id)!.wins += row.wins;
      }
    }

    return statsByRiderId;
  }


  private loadRaceFormSourcesByRiderId(riderIds: number[], season: number, currentDate: string): Map<number, RiderRaceFormSource[]> {
    const sourcesByRiderId = new Map<number, RiderRaceFormSource[]>();
    if (riderIds.length === 0) {
      return sourcesByRiderId;
    }

    const labelsByDate = this.loadRaceFormSourceLabelsByDate(season);
    const placeholders = riderIds.map(() => '?').join(', ');
    const seasonStart = `${season}-01-01`;
    const seasonEnd = `${season}-12-31`;

    if (tableExists(this.db, 'rider_r_form_daily_awards')) {
      const awardRows = this.db.prepare(`
        SELECT rider_id, award_date, award_type
        FROM rider_r_form_daily_awards
        WHERE rider_id IN (${placeholders})
          AND award_date >= ?
          AND award_date <= ?
          AND award_type = 'build'
        ORDER BY award_date ASC
      `).all(...riderIds, seasonStart, seasonEnd) as Array<{ rider_id: number; award_date: string; award_type: 'build' }>;

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
      const eventRows = this.db.prepare(`
        SELECT rider_id, source_date, amount
        FROM rider_r_form_events
        WHERE rider_id IN (${placeholders})
          AND source_date >= ?
          AND source_date <= ?
          AND expires_on > ?
        ORDER BY source_date ASC
      `).all(...riderIds, seasonStart, seasonEnd, currentDate) as Array<{ rider_id: number; source_date: string; amount: number }>;

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
             ${useDailyState ? 'rider_state.season_race_days_total' : '0'} AS season_race_days_total,
             ${useDailyState ? 'rider_state.rolling_30d_race_days' : '0'} AS rolling_30d_race_days,
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
    };
  }

  private getRiderCareerStats(riderId: number): RiderCareerStats {
    const careerStatsRow = tableExists(this.db, 'rider_career_stats')
      ? this.db.prepare(`
          SELECT breakaway_attempts, attacks, counter_attacks, crashes, defects
          FROM rider_career_stats
          WHERE rider_id = ?
        `).get(riderId) as { breakaway_attempts: number; attacks: number; counter_attacks: number; crashes: number; defects: number } | undefined
      : undefined;

    const breakawayAttempts = careerStatsRow?.breakaway_attempts ?? 0;
    const attacks = careerStatsRow?.attacks ?? 0;
    const counterAttacks = careerStatsRow?.counter_attacks ?? 0;
    const crashes = careerStatsRow?.crashes ?? 0;
    const defects = careerStatsRow?.defects ?? 0;

    const categories: Record<string, {
      gcWins: number;
      gcPodiums: number;
      gcTopTen: number;
      stageWins: number;
      stagePodiums: number;
      oneDayWins: number;
      oneDayPodiums: number;
      mountainWins: number;
      pointsWins: number;
      youthWins: number;
    }> = {};

    const knownCategories = [
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
        gcPodiums: 0,
        gcTopTen: 0,
        stageWins: 0,
        stagePodiums: 0,
        oneDayWins: 0,
        oneDayPodiums: 0,
        mountainWins: 0,
        pointsWins: 0,
        youthWins: 0,
      };
    }

    if (tableExists(this.db, 'results') && tableExists(this.db, 'stages')) {
      const resultsRows = this.db.prepare(`
        SELECT
          r.result_type_id AS result_type_id,
          r.rank AS rank,
          races.is_stage_race AS is_stage_race,
          races.number_of_stages AS number_of_stages,
          stages.stage_number AS stage_number,
          cat.name AS category_name
        FROM results r
        JOIN stages ON stages.id = r.stage_id
        JOIN races ON races.id = stages.race_id
        JOIN race_categories cat ON cat.id = races.category_id
        WHERE r.rider_id = ?

        UNION ALL

        SELECT
          r.result_type_id AS result_type_id,
          r.rank AS rank,
          races.is_stage_race AS is_stage_race,
          races.number_of_stages AS number_of_stages,
          stages.stage_number AS stage_number,
          cat.name AS category_name
        FROM results r
        JOIN stages ON stages.id = r.stage_id
        JOIN races ON races.id = stages.race_id
        JOIN race_categories cat ON cat.id = races.category_id
        JOIN stage_entries se ON se.stage_id = r.stage_id AND se.team_id = r.team_id
        WHERE r.rider_id IS NULL AND se.rider_id = ? AND r.result_type_id = 1 AND stages.profile = 'TTT'
      `).all(riderId, riderId) as Array<{
        result_type_id: number;
        rank: number;
        is_stage_race: number;
        number_of_stages: number;
        stage_number: number;
        category_name: string;
      }>;

      for (const row of resultsRows) {
        let catStats = categories[row.category_name];
        if (!catStats) {
          catStats = {
            gcWins: 0,
            gcPodiums: 0,
            gcTopTen: 0,
            stageWins: 0,
            stagePodiums: 0,
            oneDayWins: 0,
            oneDayPodiums: 0,
            mountainWins: 0,
            pointsWins: 0,
            youthWins: 0,
          };
          categories[row.category_name] = catStats;
        }

        const rank = row.rank;
        const isStageRace = row.is_stage_race === 1;
        const isFinalStage = row.stage_number === row.number_of_stages;

        if (row.result_type_id === 1) { // Stage result
          if (!isStageRace) {
            if (rank === 1) catStats.oneDayWins++;
            if (rank <= 3) catStats.oneDayPodiums++;
          } else {
            if (rank === 1) catStats.stageWins++;
            if (rank <= 3) catStats.stagePodiums++;
          }
        } else if (row.result_type_id === 2 && isStageRace && isFinalStage) { // GC
          if (rank === 1) catStats.gcWins++;
          if (rank <= 3) catStats.gcPodiums++;
          if (rank <= 10) catStats.gcTopTen++;
        } else if (row.result_type_id === 3 && isStageRace && isFinalStage) { // Points
          if (rank === 1) catStats.pointsWins++;
        } else if (row.result_type_id === 4 && isStageRace && isFinalStage) { // Mountain
          if (rank === 1) catStats.mountainWins++;
        } else if (row.result_type_id === 5 && isStageRace && isFinalStage) { // Youth
          if (rank === 1) catStats.youthWins++;
        }
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
      totalGcWins,
      totalStageWins,
      categories,
    };
  }

  private getCareerWins(riderId: number): number {
    if (!tableExists(this.db, 'results') || !tableExists(this.db, 'stage_entries')) {
      return 0;
    }

    const row = this.db.prepare(`
      SELECT SUM(CASE WHEN rank = 1 THEN 1 ELSE 0 END) AS wins
      FROM (
        SELECT rank FROM results
        WHERE result_type_id = ? AND rider_id = ?
        
        UNION ALL
        
        SELECT results.rank FROM results
        JOIN stage_entries ON stage_entries.stage_id = results.stage_id
        WHERE results.result_type_id = ?
          AND results.rider_id IS NULL
          AND stage_entries.rider_id = ?
          AND stage_entries.team_id = results.team_id
          
        UNION ALL
        
        SELECT results.rank FROM results
        JOIN stages ON stages.id = results.stage_id
        JOIN races ON races.id = stages.race_id
        WHERE results.result_type_id = ? 
          AND results.rider_id = ?
          AND races.is_stage_race = 1 
          AND stages.stage_number = races.number_of_stages
      )
    `).get(RESULT_TYPE_IDS.stage, riderId, RESULT_TYPE_IDS.stage, riderId, RESULT_TYPE_IDS.gc, riderId) as { wins: number | null } | undefined;

    return row?.wins ?? 0;
  }


  private getSeasonBreakawayAttempts(season: number, riderId: number): number {
    if (!tableExists(this.db, 'results') || !tableExists(this.db, 'stages') || !columnExists(this.db, 'results', 'is_breakaway')) {
      return 0;
    }

    const row = this.db.prepare(`
      SELECT COUNT(*) AS attempts
      FROM results
      JOIN stages ON stages.id = results.stage_id
      WHERE results.result_type_id = ?
        AND results.rider_id = ?
        AND results.is_breakaway = 1
        AND CAST(substr(stages.date, 1, 4) AS INTEGER) = ?
    `).get(RESULT_TYPE_IDS.stage, riderId, season) as { attempts: number | null } | undefined;

    return row?.attempts ?? 0;
  }


  private getCareerRaceDaysBySeason(riderId: number): CareerRaceDaysSeasonRow[] {
    if (!tableExists(this.db, 'results') || !tableExists(this.db, 'stages')) {
      return [];
    }

    return this.db.prepare(`
      SELECT
        CAST(substr(stages.date, 1, 4) AS INTEGER) AS season,
        COUNT(*) AS race_days
      FROM stage_entries
      JOIN stages ON stages.id = stage_entries.stage_id
      WHERE stage_entries.status != 'dns'
        AND stage_entries.rider_id = ?
      GROUP BY CAST(substr(stages.date, 1, 4) AS INTEGER)
      ORDER BY season DESC
    `).all(riderId) as CareerRaceDaysSeasonRow[];
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
        const completedStageIds = tableExists(this.db, 'results')
          ? new Set<number>((this.db.prepare(`
            SELECT DISTINCT stage_id
            FROM results
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


  public getSeasonPointsByRiderId(season: number): Map<number, number> {
    if (!tableExists(this.db, 'season_point_events')) {
      return new Map();
    }

    const rows = this.db.prepare(`
      SELECT rider_id, SUM(points_awarded) AS points_total
      FROM season_point_events
      WHERE season = ?
      GROUP BY rider_id
    `).all(season) as Array<{ rider_id: number; points_total: number }>;

    return new Map(rows.map((row) => [row.rider_id, row.points_total]));
  }

}
