import { summarizeStageProfile } from '../../simulation/StageParser';
import Database from 'better-sqlite3';
import { Country, FormDebugPoint, Nationality, PrecalculatedRaceIncident, Race, RaceCategory, RaceCategoryBonus, RaceClassificationRow, RaceProgram, RaceProgramParticipant, RaceStageSummary, RealtimeClassificationLeaders, RealtimeClassificationStanding, RealtimeGcStanding, ResultType, Rider, RiderFormSnapshot, RiderHealthStatus, RiderPotentials, RiderProgramRaceSummary, RiderRaceFormSource, RiderSeasonFormPhase, RiderSkillKey, RiderSkills, RiderHallOfFameStats, RiderStatsPayload, RiderStatsPointsByRaceFormat, RiderStatsPointsByTerrain, RiderStatsRaceBlock, RiderStatsRow, RiderStatsRowType, RiderStatsSeason, Role, SeasonPointAwardType, SeasonStandingCountryRow, SeasonStandingCountryRiderRow, SeasonStandingRow, SeasonStandingsPayload, Stage, StageClassification, StageMarkerCategory, StageMarkerClassification, StageNonFinisherRow, StageResultsPayload, StageScoringRule, Team, RiderCareerStats, RiderFatigueHistoryEntry } from '../../../../shared/types';
import { SKILL_WEIGHT_RIDER_COLUMNS, SkillWeightRule } from '../../../../shared/skillWeights';
import { RESULT_TYPE_IDS, RACE_FORM_BUILD_SOURCE_AMOUNT, isMountainClassificationType, resolveMarkerResultsSortPriority, SEASON_POINT_AWARD_TYPES, RIDER_SKILL_COLUMNS, SEASON_FORM_RISE_DAYS, SEASON_FORM_FALL_DAYS, SEASON_FORM_MAX_RAW, SEASON_FORM_RISE_STEP_RAW, DIVISION_BY_TIER, RiderRow, RiderSeasonRaceStats, CareerRaceDaysSeasonRow, RaceProgramRow, RiderSeasonProgramRow, TeamRow, RaceRow, StageRow, StageResultsMetaRow, RuleRow, SkillWeightRow, StageEntryStatus, ResultTypeRow, StageResultDbRow, StageNonFinisherDbRow, StageMarkerResultDbRow, StageSeasonPointDbRow, StageTeamSeasonPointDbRow, SeasonPointStageRow, SeasonPointResultRow, RiderSeasonStandingDbRow, TeamSeasonStandingDbRow, CountrySeasonStandingDbRow, RiderStatsStageDbRow, RiderStatsFinalDbRow, emptyRiderStatsPointsByTerrain, emptyRiderStatsPointsByRaceFormat, resolveRiderStatsTerrainBucket, resolveDataCsvDir, parseCsvLine, parseRaceList, parseRankedValues, parsePeakDates, usesMountainStagePoints, resolveStageResultPointValues, isoDateToDayNumber, randomBetween, roundToTwoDecimals, addDaysIso, resolveStageRaceBaseFatigue, resolveStageRaceFatigueMalus, resolveEffectiveRecuperationSkill, resolvePeakPhase, resolveDeclineValue, resolveEffectiveSeasonForm, resolveProjectionPoint, resolveRiderSeasonFormPhase, tableExists, columnExists, mapSkillObject, mapCountry, mapRole, mapRider, mapTeam, mapRaceCategoryBonus, mapRaceCategory, mapSkillWeightRule, mapStage, loadFallbackStages, mapRace, buildRaceSelect, mapRaceProgram, mapRaceWithSummary } from '../mappers';
import { GameStateRepository } from './GameStateRepository';
import { ResultRepository } from './ResultRepository';
import { RaceRepository } from './RaceRepository';
import { TeamRepository } from './TeamRepository';

// Modulweiter, versionsgebundener Cache fuer die teuren All-Time-Ranglisten der
// Hall of Fame. Jede Metrik ist eine Map<riderId, Rang> ueber ALLE Fahrer.
// Der Cache wird verworfen, sobald sich der Datenstand aendert (Anzahl
// results_flat-Zeilen + aktuelle Saison). So zahlt nur das erste Oeffnen eines
// Fahrers den vollen Tabellen-Scan; jedes weitere Oeffnen ist ein O(1)-Lookup,
// solange keine Etappe committet wurde. Nur lesende Nutzung — bei Datenaenderung
// automatisch invalidiert.
let HOF_RANK_CACHE: { version: string; maps: Map<string, Map<number, number>> } | null = null;

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
      ${useDailyState ? 'rider_state.season_ttt_wins' : '0'} AS season_ttt_wins,
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
      seasonTttWins: isCurrentSeason ? ((row as any).season_ttt_wins ?? 0) : 0,
    }));
    if (!includeDetailedStats) {
      // Summary-Modus (Standard des Frontends nach jedem Tageswechsel): schwere,
      // nur in Detail-Ansichten benoetigte Felder strippen. Teams-/Fahrer-Views
      // laden Details bei Bedarf gezielt nach (needsDetails-Mechanismus).
      // Spart ~2 MB Serialisierung/Transfer/Parse pro Reload bei 3200 Fahrern.
      for (const rider of riders) {
        delete (rider as any).potentials;
        delete (rider as any).favoriteRaces;
        delete (rider as any).nonFavoriteRaces;
      }
    }
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
        AND CAST(substr(races.start_date, 1, 4) AS INTEGER) = ?
        AND (
          race_program_races.allowed_program_group_ids IS NULL
          OR race_program_races.allowed_program_group_ids = ''
          OR ('|' || race_program_races.allowed_program_group_ids || '|') LIKE ('%|' || sta_country.program_group_id || '|%')
        )
      ORDER BY races.start_date ASC, races.id ASC
    `).all(riderId, programRow.id, season) as RaceRow[];
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
    const hallOfFame = this.buildHallOfFameStats(careerWins, rider.id);
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

    // Performance: results_flat/stage_entries_flat sind dauerhafte Relational-
    // Kopien (beim Commit gepflegt, einmalig backgefuellt). Die json_each-Views
    // muessten fuer rider-bezogene Filter saemtliche Kompakt-Payloads entpacken
    // (~600ms, wachsend); die Flat-Tabellen beantworten das per Index.
    const resultsSource = tableExists(this.db, 'results_flat') ? 'results_flat' : 'all_results';
    const entriesSource = tableExists(this.db, 'stage_entries_flat') ? 'stage_entries_flat' : 'all_stage_entries';

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
      FROM ${entriesSource} stage_entries
      JOIN stages ON stages.id = stage_entries.stage_id
      JOIN races ON races.id = stages.race_id
      JOIN race_categories ON race_categories.id = races.category_id
      LEFT JOIN wetter ON wetter.id = stages.rolled_weather_id
      LEFT JOIN ${resultsSource} rider_stage_results
        ON rider_stage_results.stage_id = stages.id
       AND rider_stage_results.rider_id = stage_entries.rider_id
       AND rider_stage_results.result_type_id = ${RESULT_TYPE_IDS.stage}
      LEFT JOIN ${resultsSource} team_stage_results
        ON team_stage_results.stage_id = stages.id
       AND team_stage_results.team_id = stage_entries.team_id
       AND team_stage_results.rider_id IS NULL
       AND team_stage_results.result_type_id = ${RESULT_TYPE_IDS.stage}
       AND stages.profile = 'TTT'
      LEFT JOIN ${resultsSource} gc_results
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
      FROM ${resultsSource} results
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

      // Wertungspunkte aus Rundfahrten (GC/Punkte/Berg/Nachwuchs/Ausreisser) NICHT
      // nach Terrain bucketen — sie lassen sich keinem Terrain klar zuordnen. Nur
      // Etappenergebnisse und Eintagesrennen fliessen in die Terrain-Auswertung ein
      // (siehe stageRows-Schleife oben). Das Format-Bucket bleibt unveraendert.
      // Nur die aktuelle Saison zaehlen — sonst akkumulieren die Format-Summen
      // ueber alle Saisons (Bug: 1825 statt 560 Punkte).
      if (row.season === currentSeason) {
        pointsByRaceFormat.stageRace += finalPoints;
      }
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
      hallOfFame,
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
      ${useDailyState ? 'rider_state.season_ttt_wins' : '0'} AS season_ttt_wins,
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
    const hallOfFame = this.buildHallOfFameStats(careerWins, rider.id);
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
      hallOfFame,
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
    const superformDays = careerStatsRow?.superform_days ?? 0;

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
      superformDays,
      categories,
    };
  }

  /**
   * Platz in der ewigen Siegerliste (Karrieresiege ueber alle Kategorien).
   * Standard-Ranking: Platz = 1 + Anzahl Fahrer mit strikt mehr Siegen —
   * Gleichstaende teilen sich denselben Platz. Fahrer ohne Sieg sind
   * unplatziert (rank null). Eine einzelne Aggregat-Query ueber die kleine
   * rider_career_category_stats-Tabelle, daher unkritisch fuer die Ladezeit.
   */
  private getAllTimeWinsRank(careerWins: number): { rank: number | null; rankedRiders: number } {
    if (!tableExists(this.db, 'rider_career_category_stats')) {
      return { rank: null, rankedRiders: 0 };
    }

    const row = this.db.prepare(`
      SELECT
        COALESCE(SUM(CASE WHEN wins > ? THEN 1 ELSE 0 END), 0) AS better,
        COUNT(*) AS ranked
      FROM (
        SELECT SUM(gc_wins + stage_wins + one_day_wins) AS wins
        FROM rider_career_category_stats
        GROUP BY rider_id
        HAVING wins > 0
      )
    `).get(careerWins) as { better: number; ranked: number };

    return {
      rank: careerWins > 0 ? row.better + 1 : null,
      rankedRiders: row.ranked,
    };
  }

  /**
   * Generischer All-Time-Rang aus einer Ranglisten-Metrik von "Statistiken &
   * Rekorde". `aggregateSql` muss je Fahrer eine Zeile (rider_id, wert) liefern;
   * der Rang ist die Zahl der Fahrer mit strikt hoeherem Wert + 1
   * (Wettkampf-Ranking, Gleichstand teilt sich den Rang). Fahrer ohne Wert bzw.
   * mit Wert <= 0 gelten als nicht gewertet (null). Fehlt eine Quelltabelle
   * oder -view, faengt der try/catch das ab und liefert null — die uebrigen
   * Kennzahlen bleiben unberuehrt.
   */
  private getAllTimeAggregateRank(aggregateSql: string, riderId: number, innerParams: unknown[] = []): number | null {
    try {
      const row = this.db.prepare(`
        WITH per_rider(rider_id, v) AS (${aggregateSql})
        SELECT (SELECT COUNT(*) FROM per_rider p WHERE p.v > me.v) + 1 AS rank, me.v AS value
        FROM per_rider me WHERE me.rider_id = ?
      `).get(...innerParams, riderId) as { rank: number; value: number } | undefined;
      if (!row || row.value == null || row.value <= 0) return null;
      return row.rank;
    } catch {
      return null;
    }
  }

  /**
   * Billiger Datenstand-Stempel zur Cache-Invalidierung: Anzahl results_flat-
   * Zeilen plus aktuelle Saison. Aendert sich bei jedem Etappen-Commit und
   * Saisonwechsel. null => kein Cache moeglich (dann Einzelberechnung).
   */
  private getDataVersion(): string | null {
    try {
      const a = (this.db.prepare(`SELECT COUNT(*) AS c FROM results_flat`).get() as { c: number } | undefined)?.c ?? 0;
      const b = (this.db.prepare(`SELECT value FROM career_meta WHERE key = 'current_season'`).get() as { value: string } | undefined)?.value ?? '';
      return `${a}:${b}`;
    } catch {
      return null;
    }
  }

  /**
   * Cache-gestuetzter All-Time-Rang: berechnet die vollstaendige Rangliste einer
   * Metrik einmal pro Datenstand (Map<riderId, Rang>) und liest danach O(1).
   * `aggregateSql` liefert je Fahrer genau zwei Spalten (id, wert). Faellt bei
   * fehlendem Datenstand-Stempel auf die Einzelberechnung zurueck.
   */
  private getCachedRank(version: string | null, metricKey: string, aggregateSql: string, riderId: number, innerParams: unknown[] = []): number | null {
    if (version == null) return this.getAllTimeAggregateRank(aggregateSql, riderId, innerParams);
    if (!HOF_RANK_CACHE || HOF_RANK_CACHE.version !== version) {
      HOF_RANK_CACHE = { version, maps: new Map() };
    }
    let map = HOF_RANK_CACHE.maps.get(metricKey);
    if (!map) {
      map = new Map<number, number>();
      try {
        const rows = this.db.prepare(aggregateSql).all(...innerParams) as Array<Record<string, unknown>>;
        const parsed = rows
          .map((r) => { const vals = Object.values(r); return { id: Number(vals[0]), v: Number(vals[1]) }; })
          .filter((r) => Number.isFinite(r.id) && Number.isFinite(r.v) && r.v > 0)
          .sort((a, b) => b.v - a.v);
        let prevV: number | null = null, prevRank = 0;
        parsed.forEach((r, i) => {
          const rank = (prevV != null && r.v === prevV) ? prevRank : i + 1;
          prevV = r.v; prevRank = rank;
          map!.set(r.id, rank);
        });
      } catch { /* leere Map -> null */ }
      HOF_RANK_CACHE.maps.set(metricKey, map);
    }
    return map.get(riderId) ?? null;
  }

  /**
   * All-Time-Raenge der Ranglisten-basierten Hall-of-Fame-Badges. Jede Metrik
   * nutzt dieselbe Quelle wie die zugehoerige Rangliste in "Statistiken &
   * Rekorde" (bzw. bei Gelb-Tagen results_flat, wo die rank-1-GC-Zeilen das
   * Saison-Pruning ueberleben).
   */
  private getStatRecordRanks(riderId: number): {
    uciPointsRank: number | null; stageScoresRank: number | null;
    speedStageRank: number | null; speedOnedayRank: number | null;
    leadoutBonusRank: number | null; counterAttacksRank: number | null;
    superteamCountRank: number | null; lieutenantPeakRank: number | null;
    yellowDaysRank: number | null;
  } {
    const v = this.getDataVersion();
    const rank = (key: string, sql: string) => this.getCachedRank(v, key, sql, riderId);
    return {
      uciPointsRank: rank('uciPointsRank', 'SELECT rider_id, SUM(points_awarded) FROM season_point_events GROUP BY rider_id'),
      stageScoresRank: rank('stageScoresRank', `SELECT se.rider_id, SUM(s.stage_score) FROM all_stage_entries se
         JOIN stages s ON s.id = se.stage_id WHERE se.status = 'finished' GROUP BY se.rider_id`),
      speedStageRank: rank('speedStageRank', `SELECT rider_id, MAX(avg_speed_kmh) FROM stage_speed_records WHERE kind = 'stage' GROUP BY rider_id`),
      speedOnedayRank: rank('speedOnedayRank', `SELECT rider_id, MAX(avg_speed_kmh) FROM stage_speed_records WHERE kind = 'oneday' GROUP BY rider_id`),
      leadoutBonusRank: rank('leadoutBonusRank', 'SELECT sprinter_id, MAX(leadout_bonus) FROM stage_leadouts GROUP BY sprinter_id'),
      counterAttacksRank: rank('counterAttacksRank', 'SELECT rider_id, counter_attacks FROM rider_career_stats'),
      superteamCountRank: rank('superteamCountRank', 'SELECT rider_id, superteam_count FROM rider_career_stats'),
      lieutenantPeakRank: rank('lieutenantPeakRank', 'SELECT rider_id, MAX(max_overall_rating) FROM lieutenant_all_time_peaks GROUP BY rider_id'),
      yellowDaysRank: rank('yellowDaysRank', 'SELECT rider_id, COUNT(*) FROM results_flat WHERE result_type_id = 2 AND rank = 1 GROUP BY rider_id'),
    };
  }

  /**
   * Bester (niedrigster) All-Time-Rang eines Team-Leadouts, an dem der Fahrer
   * beteiligt war — als Anfahrer (contributors_json) ODER als angefahrener
   * Sprinter. Rangliste wie in "Statistiken & Rekorde" (Team-Leadout): nach
   * leadout_bonus absteigend, dedupliziert je (Team, Sprinter, Anfahrer-Set).
   * Nur die Top 10 sind relevant (Gold 1 · Silber 2 · Bronze 3 · Cyan 4-10);
   * darunter/ausserhalb -> null.
   */
  private getBestLeadoutRank(riderId: number): number | null {
    if (!tableExists(this.db, 'stage_leadouts')) return null;
    let rows: Array<{ team_id: number; sprinter_id: number; contributors_json: string }>;
    try {
      rows = this.db.prepare(
        'SELECT team_id, sprinter_id, contributors_json FROM stage_leadouts ORDER BY leadout_bonus DESC LIMIT 300'
      ).all() as Array<{ team_id: number; sprinter_id: number; contributors_json: string }>;
    } catch {
      return null;
    }
    const seen = new Set<string>();
    let rank = 0;
    for (const row of rows) {
      let contributorIds: number[] = [];
      try {
        contributorIds = (JSON.parse(row.contributors_json) as Array<{ riderId: number }>).map((c) => c.riderId);
      } catch {
        continue;
      }
      const key = `${row.team_id}:${row.sprinter_id}:${[...contributorIds].sort((a, b) => a - b).join(',')}`;
      if (seen.has(key)) continue;
      seen.add(key);
      rank += 1;
      if (rank > 10) break;
      if (row.sprinter_id === riderId || contributorIds.includes(riderId)) {
        return rank; // Zeilen absteigend sortiert -> erster Treffer ist der beste Rang.
      }
    }
    return null;
  }

  /**
   * Badge-Kennzahlen Welle 1: aus results_flat (rank-1- und punktende Zeilen
   * ueberleben das Pruning) sowie season_point_events abgeleitet. Kategorie-
   * Namen ueber race_categories.
   */
  private getBadgeWave1Stats(riderId: number): {
    bestSeasonUciPoints: number; phantomGcWins: number; firstBloodWins: number;
    hatTrickRaces: number; whereHillsWins: number; springWins: number; gcStayerTopTen: number;
  } {
    const out = { bestSeasonUciPoints: 0, phantomGcWins: 0, firstBloodWins: 0, hatTrickRaces: 0, whereHillsWins: 0, springWins: 0, gcStayerTopTen: 0 };
    try {
      const r = this.db.prepare(`SELECT MAX(v) AS m FROM (SELECT SUM(points_awarded) AS v FROM season_point_events WHERE rider_id = ? GROUP BY season)`).get(riderId) as { m: number | null } | undefined;
      out.bestSeasonUciPoints = r?.m ?? 0;
    } catch { /* Quelle fehlt */ }
    if (!tableExists(this.db, 'results_flat')) return out;
    // Phantom GC: Etappenrennen-GC-Sieg, ohne je zuvor (Vor-Etappe) GC-Fuehrender gewesen zu sein.
    try {
      const rows = this.db.prepare(`
        SELECT s.race_id AS rid, ra.number_of_stages AS nos, s.stage_number AS sn, rf.rank AS rk
        FROM results_flat rf JOIN stages s ON s.id = rf.stage_id JOIN races ra ON ra.id = s.race_id
        WHERE rf.rider_id = ? AND rf.result_type_id = 2 AND ra.is_stage_race = 1
      `).all(riderId) as Array<{ rid: number; nos: number; sn: number; rk: number }>;
      const byRace = new Map<number, { final: number | null; priorLeader: boolean }>();
      for (const r of rows) {
        let e = byRace.get(r.rid);
        if (!e) { e = { final: null, priorLeader: false }; byRace.set(r.rid, e); }
        if (r.sn === r.nos) e.final = r.rk; else if (r.rk === 1) e.priorLeader = true;
      }
      for (const e of byRace.values()) if (e.final === 1 && !e.priorLeader) out.phantomGcWins += 1;
    } catch { /* */ }
    const scalar = (sql: string): number => {
      try { const r = this.db.prepare(sql).get(riderId) as { c: number } | undefined; return r?.c ?? 0; } catch { return 0; }
    };
    out.firstBloodWins = scalar(`
      SELECT COUNT(*) AS c FROM results_flat rf JOIN stages s ON s.id = rf.stage_id JOIN races ra ON ra.id = s.race_id JOIN race_categories rc ON rc.id = ra.category_id
      WHERE rf.rider_id = ? AND rf.result_type_id = 1 AND rf.rank = 1 AND s.stage_number = 1 AND ra.is_stage_race = 1
        AND rc.name IN ('World Tour - Tour de France', 'World Tour - Grand Tour', 'World Tour - Stage Race High')`);
    out.hatTrickRaces = scalar(`
      SELECT COUNT(*) AS c FROM (SELECT s.race_id FROM results_flat rf JOIN stages s ON s.id = rf.stage_id JOIN races ra ON ra.id = s.race_id
        WHERE rf.rider_id = ? AND rf.result_type_id = 1 AND rf.rank = 1 AND ra.is_stage_race = 1 GROUP BY s.race_id HAVING COUNT(*) >= 3)`);
    out.whereHillsWins = scalar(`
      SELECT COUNT(*) AS c FROM results_flat rf JOIN stages s ON s.id = rf.stage_id
      WHERE rf.rider_id = ? AND rf.result_type_id = 1 AND rf.rank = 1 AND s.stage_score IS NOT NULL AND s.stage_score < 20`);
    out.springWins = scalar(`
      SELECT COUNT(*) AS c FROM results_flat rf JOIN stages s ON s.id = rf.stage_id JOIN races ra ON ra.id = s.race_id JOIN race_categories rc ON rc.id = ra.category_id
      WHERE rf.rider_id = ? AND rf.result_type_id = 1 AND rf.rank = 1 AND ra.is_stage_race = 0
        AND rc.name IN ('World Tour - One Day High', 'World Tour - Monument')
        AND substr(s.date, 6, 5) >= '03-01' AND substr(s.date, 6, 5) <= '05-02'`);
    out.gcStayerTopTen = scalar(`
      SELECT COUNT(*) AS c FROM results_flat rf JOIN stages s ON s.id = rf.stage_id JOIN races ra ON ra.id = s.race_id JOIN race_categories rc ON rc.id = ra.category_id
      WHERE rf.rider_id = ? AND rf.result_type_id = 2 AND s.stage_number = ra.number_of_stages AND rf.rank <= 10
        AND rc.name IN ('World Tour - Tour de France', 'World Tour - Grand Tour')`);
    return out;
  }

  /** Badge-Kennzahlen Welle 5 (Helfer & Team) — rein abgeleitet. */
  private getBadgeWave5Stats(riderId: number): {
    waterCarrierDays: number; superDomestiqueLeadouts: number; lieutenantSeasons: number;
    kingmakerCount: number; franchiseSeasons: number; bandOfBrothersBest: number;
    cleanSweepCount: number; cleanSweepPlusCount: number; hottestPick: boolean;
  } {
    const out = { waterCarrierDays: 0, superDomestiqueLeadouts: 0, lieutenantSeasons: 0, kingmakerCount: 0, franchiseSeasons: 0, bandOfBrothersBest: 0, cleanSweepCount: 0, cleanSweepPlusCount: 0, hottestPick: false };
    const num = (sql: string, params: any[] = [riderId]): number => {
      try { const r = this.db.prepare(sql).get(...params) as { c: number } | undefined; return r?.c ?? 0; } catch { return 0; }
    };
    out.waterCarrierDays = num(`SELECT COALESCE(SUM(rss.race_days),0) AS c FROM rider_season_roles rsr JOIN rider_season_stats rss ON rss.rider_id = rsr.rider_id AND rss.season = rsr.season WHERE rsr.rider_id = ? AND rsr.role_id = 5`);
    out.superDomestiqueLeadouts = num(`SELECT COUNT(*) AS c FROM stage_leadouts WHERE contributors_json LIKE ?`, [`%"riderId":${riderId},%`]);
    out.lieutenantSeasons = num(`SELECT COUNT(DISTINCT season) AS c FROM rider_lieutenants WHERE lieutenant_id = ?`);
    out.kingmakerCount = num(`SELECT COUNT(*) AS c FROM rider_lieutenants rl WHERE rl.lieutenant_id = ? AND EXISTS (
      SELECT 1 FROM results_flat rf JOIN stages s ON s.id = rf.stage_id JOIN races ra ON ra.id = s.race_id JOIN race_categories rc ON rc.id = ra.category_id
      WHERE rf.rider_id = rl.leader_id AND rf.rank = 1 AND rf.result_type_id = 2 AND s.stage_number = ra.number_of_stages
        AND rc.name IN ('World Tour - Tour de France', 'World Tour - Grand Tour') AND CAST(substr(s.date,1,4) AS INTEGER) = rl.season)`);
    out.hottestPick = num(`SELECT COUNT(*) AS c FROM draft_history WHERE rider_id = ? AND pick_number = 1`) > 0;
    // Clean Sweep (+Plus): GC + Berg + Punkte (+ Nachwuchs) + eine Etappe im selben Etappenrennen.
    try {
      const rows = this.db.prepare(`
        SELECT s.race_id AS rid,
          MAX(CASE WHEN rf.result_type_id=2 AND rf.rank=1 AND s.stage_number=ra.number_of_stages THEN 1 ELSE 0 END) gc,
          MAX(CASE WHEN rf.result_type_id=4 AND rf.rank=1 AND s.stage_number=ra.number_of_stages THEN 1 ELSE 0 END) kom,
          MAX(CASE WHEN rf.result_type_id=3 AND rf.rank=1 AND s.stage_number=ra.number_of_stages THEN 1 ELSE 0 END) pts,
          MAX(CASE WHEN rf.result_type_id=5 AND rf.rank=1 AND s.stage_number=ra.number_of_stages THEN 1 ELSE 0 END) yth,
          MAX(CASE WHEN rf.result_type_id=1 AND rf.rank=1 THEN 1 ELSE 0 END) stg
        FROM results_flat rf JOIN stages s ON s.id=rf.stage_id JOIN races ra ON ra.id=s.race_id
        WHERE rf.rider_id=? AND ra.is_stage_race=1 GROUP BY s.race_id`).all(riderId) as any[];
      for (const r of rows) {
        if (r.gc && r.kom && r.pts && r.stg) out.cleanSweepCount += 1;
        if (r.gc && r.kom && r.pts && r.yth && r.stg) out.cleanSweepPlusCount += 1;
      }
    } catch { /* */ }
    // The Franchise: Saison mit > 50 % der Teamsiege (Team-Gesamtsiege >= 5).
    try {
      const rw = this.db.prepare(`
        SELECT CAST(substr(s.date,1,4) AS INTEGER) AS yr, rf.team_id AS tid, COUNT(*) AS c
        FROM results_flat rf JOIN stages s ON s.id=rf.stage_id JOIN races ra ON ra.id=s.race_id
        WHERE rf.rider_id=? AND rf.rank=1 AND (rf.result_type_id=1 OR (rf.result_type_id=2 AND ra.is_stage_race=1 AND s.stage_number=ra.number_of_stages))
        GROUP BY yr, tid`).all(riderId) as Array<{ yr: number; tid: number; c: number }>;
      const teamTotal = this.db.prepare(`
        SELECT COUNT(*) AS c FROM results_flat rf JOIN stages s ON s.id=rf.stage_id JOIN races ra ON ra.id=s.race_id
        WHERE rf.team_id=? AND CAST(substr(s.date,1,4) AS INTEGER)=? AND rf.rank=1 AND (rf.result_type_id=1 OR (rf.result_type_id=2 AND ra.is_stage_race=1 AND s.stage_number=ra.number_of_stages))`);
      for (const r of rw) {
        const tt = (teamTotal.get(r.tid, r.yr) as { c: number } | undefined)?.c ?? 0;
        if (tt >= 5 && r.c > tt / 2) out.franchiseSeasons += 1;
      }
    } catch { /* */ }
    // Band of Brothers: meiste gemeinsame Saisons mit demselben Teamkollegen.
    try {
      const cur = (this.db.prepare(`SELECT season FROM game_state WHERE id=1`).get() as { season: number } | undefined)?.season ?? 99999;
      const mine = this.db.prepare(`SELECT team_id, start_season, end_season FROM contracts WHERE rider_id=?`).all(riderId) as Array<{ team_id: number; start_season: number; end_season: number }>;
      const mySet = new Set<string>();
      for (const c of mine) for (let y = c.start_season; y <= Math.min(c.end_season, cur); y++) mySet.add(`${c.team_id}:${y}`);
      if (mySet.size > 0) {
        const others = this.db.prepare(`SELECT rider_id, team_id, start_season, end_season FROM contracts WHERE rider_id != ?`).all(riderId) as Array<{ rider_id: number; team_id: number; start_season: number; end_season: number }>;
        const cnt = new Map<number, number>();
        for (const c of others) {
          let n = 0;
          for (let y = c.start_season; y <= Math.min(c.end_season, cur); y++) if (mySet.has(`${c.team_id}:${y}`)) n += 1;
          if (n > 0) cnt.set(c.rider_id, (cnt.get(c.rider_id) ?? 0) + n);
        }
        for (const v of cnt.values()) if (v > out.bandOfBrothersBest) out.bandOfBrothersBest = v;
      }
    } catch { /* */ }
    return out;
  }

  /** Badge-Kennzahlen Welle 8 — rein abgeleitet. */
  private getBadgeWave8Stats(riderId: number): {
    prologueWins: number; autumnWins: number; grandFinaleWins: number; prodigyWins: number;
    lastDanceWin: boolean; gtRunnerUp: number; undertakerWins: number; greenGrandSlam: boolean;
  } {
    const out = { prologueWins: 0, autumnWins: 0, grandFinaleWins: 0, prodigyWins: 0, lastDanceWin: false, gtRunnerUp: 0, undertakerWins: 0, greenGrandSlam: false };
    if (!tableExists(this.db, 'results_flat')) return out;
    const num = (sql: string, p: any[] = [riderId]): number => {
      try { return (this.db.prepare(sql).get(...p) as { c: number } | undefined)?.c ?? 0; } catch { return 0; }
    };
    out.autumnWins = num(`SELECT COUNT(*) AS c FROM results_flat rf JOIN stages s ON s.id=rf.stage_id JOIN races ra ON ra.id=s.race_id JOIN race_categories rc ON rc.id=ra.category_id
      WHERE rf.rider_id=? AND rf.rank=1 AND ra.is_stage_race=0 AND rc.name IN ('World Tour - One Day High','World Tour - Monument')
        AND substr(s.date,6,5) >= '09-01' AND substr(s.date,6,5) <= '10-31'`);
    out.prodigyWins = num(`SELECT COUNT(*) AS c FROM results_flat rf JOIN stages s ON s.id=rf.stage_id JOIN races ra ON ra.id=s.race_id JOIN race_categories rc ON rc.id=ra.category_id JOIN riders r ON r.id=rf.rider_id
      WHERE rf.rider_id=? AND rf.rank=1 AND (CAST(substr(s.date,1,4) AS INTEGER) - r.birth_year) < 23 AND (
        (rf.result_type_id=1 AND ra.is_stage_race=0 AND rc.name='World Tour - Monument')
        OR (rf.result_type_id=2 AND ra.is_stage_race=1 AND s.stage_number=ra.number_of_stages AND rc.name IN ('World Tour - Tour de France','World Tour - Grand Tour')))`);
    out.gtRunnerUp = num(`SELECT COUNT(*) AS c FROM results_flat rf JOIN stages s ON s.id=rf.stage_id JOIN races ra ON ra.id=s.race_id JOIN race_categories rc ON rc.id=ra.category_id
      WHERE rf.rider_id=? AND rf.rank=2 AND rf.result_type_id=2 AND s.stage_number=ra.number_of_stages AND rc.name IN ('World Tour - Tour de France','World Tour - Grand Tour')`);
    out.undertakerWins = num(`SELECT COUNT(*) AS c FROM results_flat rf JOIN stages s ON s.id=rf.stage_id JOIN races ra ON ra.id=s.race_id JOIN race_categories rc ON rc.id=ra.category_id
      WHERE rf.rider_id=? AND rf.rank=1 AND rf.result_type_id=1 AND s.stage_number=ra.number_of_stages AND rc.name IN ('World Tour - Tour de France','World Tour - Grand Tour')`);
    // Green Grand Slam: Punktewertung (Typ 3, Schlussetappe) in allen 3 GTs.
    try {
      const names = new Set((this.db.prepare(`SELECT DISTINCT ra.name AS n FROM results_flat rf JOIN stages s ON s.id=rf.stage_id JOIN races ra ON ra.id=s.race_id
        WHERE rf.rider_id=? AND rf.rank=1 AND rf.result_type_id=3 AND s.stage_number=ra.number_of_stages
          AND ra.name IN ('Tour de France', 'Giro d''Italia', 'La Vuelta Ciclista a España')`).all(riderId) as Array<{ n: string }>).map((r) => r.n));
      out.greenGrandSlam = names.has('Tour de France') && names.has("Giro d'Italia") && names.has('La Vuelta Ciclista a España');
    } catch { /* */ }
    // Prologue Prince: Sieg auf ITT-Etappe 1 mit < 10 km (Distanz aus dem Profil).
    try {
      const rows = this.db.prepare(`SELECT s.details_csv_file AS csv, s.start_elevation AS elev FROM results_flat rf JOIN stages s ON s.id=rf.stage_id
        WHERE rf.rider_id=? AND rf.rank=1 AND rf.result_type_id=1 AND s.profile='ITT' AND s.stage_number=1`).all(riderId) as Array<{ csv: string | null; elev: number | null }>;
      for (const r of rows) { try { const d = summarizeStageProfile(r.csv ?? '', r.elev ?? 0).distanceKm ?? 0; if (d > 0 && d < 10) out.prologueWins += 1; } catch { /* */ } }
    } catch { /* */ }
    // Grand Finale (Sieg im letzten Rennen der Saison) + Last Dance (Sieg in
    // der letzten Karrieresaison eines zurueckgetretenen Fahrers).
    try {
      const won = new Set<number>();
      for (const r of this.db.prepare(`SELECT DISTINCT s.race_id AS rid FROM results_flat rf JOIN stages s ON s.id=rf.stage_id JOIN races ra ON ra.id=s.race_id
        WHERE rf.rider_id=? AND rf.rank=1 AND ((rf.result_type_id=1 AND ra.is_stage_race=0) OR (rf.result_type_id=2 AND ra.is_stage_race=1 AND s.stage_number=ra.number_of_stages))`).all(riderId) as Array<{ rid: number }>) won.add(r.rid);
      const races = this.db.prepare(`SELECT id, CAST(substr(start_date,1,4) AS INTEGER) AS yr FROM races ORDER BY yr, start_date, id`).all() as Array<{ id: number; yr: number }>;
      const bySeason = new Map<number, number[]>();
      for (const r of races) { const a = bySeason.get(r.yr) ?? []; a.push(r.id); bySeason.set(r.yr, a); }
      for (const arr of bySeason.values()) if (arr.length && won.has(arr[arr.length - 1])) out.grandFinaleWins += 1;
      const retired = (this.db.prepare(`SELECT is_retired AS r FROM riders WHERE id=?`).get(riderId) as { r: number } | undefined)?.r;
      if (retired) {
        const lastSeason = (this.db.prepare(`SELECT MAX(season) AS m FROM rider_season_stats WHERE rider_id=? AND race_days>0`).get(riderId) as { m: number | null } | undefined)?.m;
        if (lastSeason != null) {
          out.lastDanceWin = num(`SELECT COUNT(*) AS c FROM results_flat rf JOIN stages s ON s.id=rf.stage_id JOIN races ra ON ra.id=s.race_id
            WHERE rf.rider_id=? AND rf.rank=1 AND CAST(substr(s.date,1,4) AS INTEGER)=? AND ((rf.result_type_id=1 AND ra.is_stage_race=0) OR (rf.result_type_id=2 AND ra.is_stage_race=1 AND s.stage_number=ra.number_of_stages))`, [riderId, lastSeason]) > 0;
        }
      }
    } catch { /* */ }
    return out;
  }

  /** Badge-Kennzahlen Welle 6 (Saison-Muster) — rein abgeleitet. */
  private getBadgeWave6Stats(riderId: number): {
    mrReliableSeasons: number; instantImpact: boolean; outOfDarkWins: number; hotStreakOpenerSeasons: number;
  } {
    const out = { mrReliableSeasons: 0, instantImpact: false, outOfDarkWins: 0, hotStreakOpenerSeasons: 0 };
    try {
      out.mrReliableSeasons = (this.db.prepare(`SELECT COUNT(*) AS c FROM rider_season_stats WHERE rider_id=? AND race_days>=30 AND (dnf_count+dns_count+otl_count)=0`).get(riderId) as { c: number } | undefined)?.c ?? 0;
    } catch { /* */ }
    if (!tableExists(this.db, 'results_flat')) return out;
    // Renn-Siege (Eintagessieg oder GC-Gesamtsieg) als race_id-Menge.
    const won = new Set<number>();
    try {
      for (const r of this.db.prepare(`
        SELECT DISTINCT s.race_id AS rid FROM results_flat rf JOIN stages s ON s.id=rf.stage_id JOIN races ra ON ra.id=s.race_id
        WHERE rf.rider_id=? AND rf.rank=1 AND ((rf.result_type_id=1 AND ra.is_stage_race=0) OR (rf.result_type_id=2 AND ra.is_stage_race=1 AND s.stage_number=ra.number_of_stages))`).all(riderId) as Array<{ rid: number }>) won.add(r.rid);
    } catch { /* */ }
    // Instant Impact: Renn-Sieg in der ersten Vertragssaison.
    try {
      const first = (this.db.prepare(`SELECT MIN(start_season) AS m FROM contracts WHERE rider_id=?`).get(riderId) as { m: number | null } | undefined)?.m;
      if (first != null) {
        const w = (this.db.prepare(`SELECT COUNT(*) AS c FROM results_flat rf JOIN stages s ON s.id=rf.stage_id JOIN races ra ON ra.id=s.race_id
          WHERE rf.rider_id=? AND rf.rank=1 AND CAST(substr(s.date,1,4) AS INTEGER)=? AND ((rf.result_type_id=1 AND ra.is_stage_race=0) OR (rf.result_type_id=2 AND ra.is_stage_race=1 AND s.stage_number=ra.number_of_stages))`).get(riderId, first) as { c: number } | undefined)?.c ?? 0;
        out.instantImpact = w > 0;
      }
    } catch { /* */ }
    // Saisons: Sieg im ersten Rennen bzw. 3+ Siege in den ersten 5 Rennen.
    try {
      const races = this.db.prepare(`SELECT id, CAST(substr(start_date,1,4) AS INTEGER) AS yr FROM races ORDER BY yr, start_date, id`).all() as Array<{ id: number; yr: number }>;
      const bySeason = new Map<number, number[]>();
      for (const r of races) { const a = bySeason.get(r.yr) ?? []; a.push(r.id); bySeason.set(r.yr, a); }
      for (const arr of bySeason.values()) {
        if (arr.length === 0) continue;
        if (won.has(arr[0])) out.outOfDarkWins += 1;
        if (arr.slice(0, 5).filter((id) => won.has(id)).length >= 3) out.hotStreakOpenerSeasons += 1;
      }
    } catch { /* */ }
    return out;
  }

  /**
   * "Wilde" Kennzahlen fuer Kuriositaeten-Badges (Welle A, reine Auslese ohne
   * neues Tracking). Zaehler aus rider_career_stats/rider_season_stats sowie
   * sieg-basierte Groessen aus results_flat (rank-1-Zeilen ueberleben das
   * Saison-Pruning). "Sieg des Rennens" = Etappen-/Eintagessieg (Typ 1) bzw.
   * GC-Gesamtsieg an der Schlussetappe (Typ 2); Groundhog wertet nur den
   * Gesamt-/Eintagessieg (nicht einzelne Etappensiege).
   */
  private getWildStats(riderId: number): {
    defects: number; doomedEscapes: number; supermalusDays: number; bestSeasonRaceDays: number;
    veteranWins: number; awayWins: number; breakawayWins: number; groundhogStreak: number;
    fullMoonPodiums: number; cleanStreakBest: number; grandToursFinished: number; multiJerseyDays: number;
    longHaulWins: number; staminaWins: number; verticalLimitWins: number;
    lanterneRougeStage: number; lanterneRougeGt: number; lanterneRougeSr: number; timeCutFinishes: number;
    teamEffortPodiums: number; oneManTeam: number; gcBySeconds: number; bitterEndDnf: number;
    winStreakBest: number; peakPerformerWins: number; yoyoRaces: number;
  } {
    const out = {
      defects: 0, doomedEscapes: 0, supermalusDays: 0, bestSeasonRaceDays: 0, veteranWins: 0, awayWins: 0,
      breakawayWins: 0, groundhogStreak: 0, fullMoonPodiums: 0, cleanStreakBest: 0, grandToursFinished: 0, multiJerseyDays: 0,
      longHaulWins: 0, staminaWins: 0, verticalLimitWins: 0,
      lanterneRougeStage: 0, lanterneRougeGt: 0, lanterneRougeSr: 0, timeCutFinishes: 0,
      teamEffortPodiums: 0, oneManTeam: 0, gcBySeconds: 0, bitterEndDnf: 0, winStreakBest: 0,
      peakPerformerWins: 0, yoyoRaces: 0,
    };

    if (tableExists(this.db, 'rider_career_stats')) {
      const hasWaveB = columnExists(this.db, 'rider_career_stats', 'multi_jersey_days');
      const hasWave2 = columnExists(this.db, 'rider_career_stats', 'long_haul_wins');
      const hasWave3 = columnExists(this.db, 'rider_career_stats', 'lanterne_rouge_stage');
      const hasWave4 = columnExists(this.db, 'rider_career_stats', 'win_streak_best');
      const hasWave7 = columnExists(this.db, 'rider_career_stats', 'peak_performer_wins');
      const c = this.db.prepare(
        `SELECT defects, breakaway_attempts, successful_breakaways, supermalus_days
         ${hasWaveB ? ', full_moon_podiums, clean_streak_best, grand_tours_finished, multi_jersey_days' : ''}
         ${hasWave2 ? ', long_haul_wins, stamina_wins, vertical_limit_wins' : ''}
         ${hasWave3 ? ', lanterne_rouge_stage, lanterne_rouge_gt, lanterne_rouge_sr, time_cut_finishes, team_effort_podiums, one_man_team, gc_by_seconds, bitter_end_dnf' : ''}
         ${hasWave4 ? ', win_streak_best' : ''}
         ${hasWave7 ? ', peak_performer_wins, yoyo_races' : ''}
         FROM rider_career_stats WHERE rider_id = ?`
      ).get(riderId) as any;
      if (c) {
        out.defects = c.defects ?? 0;
        out.doomedEscapes = Math.max(0, (c.breakaway_attempts ?? 0) - (c.successful_breakaways ?? 0));
        out.supermalusDays = c.supermalus_days ?? 0;
        out.fullMoonPodiums = c.full_moon_podiums ?? 0;
        out.cleanStreakBest = c.clean_streak_best ?? 0;
        out.grandToursFinished = c.grand_tours_finished ?? 0;
        out.multiJerseyDays = c.multi_jersey_days ?? 0;
        out.longHaulWins = c.long_haul_wins ?? 0;
        out.staminaWins = c.stamina_wins ?? 0;
        out.verticalLimitWins = c.vertical_limit_wins ?? 0;
        out.lanterneRougeStage = c.lanterne_rouge_stage ?? 0;
        out.lanterneRougeGt = c.lanterne_rouge_gt ?? 0;
        out.lanterneRougeSr = c.lanterne_rouge_sr ?? 0;
        out.timeCutFinishes = c.time_cut_finishes ?? 0;
        out.teamEffortPodiums = c.team_effort_podiums ?? 0;
        out.oneManTeam = c.one_man_team ?? 0;
        out.gcBySeconds = c.gc_by_seconds ?? 0;
        out.bitterEndDnf = c.bitter_end_dnf ?? 0;
        out.winStreakBest = c.win_streak_best ?? 0;
        out.peakPerformerWins = c.peak_performer_wins ?? 0;
        out.yoyoRaces = c.yoyo_races ?? 0;
      }
    }
    if (tableExists(this.db, 'rider_season_stats')) {
      const s = this.db.prepare('SELECT MAX(race_days) AS m FROM rider_season_stats WHERE rider_id = ?').get(riderId) as { m: number | null } | undefined;
      out.bestSeasonRaceDays = s?.m ?? 0;
    }

    if (tableExists(this.db, 'results_flat')) {
      const rider = this.db.prepare('SELECT birth_year AS by, country_id AS cid FROM riders WHERE id = ?').get(riderId) as { by: number | null; cid: number | null } | undefined;
      const birthYear = rider?.by ?? null;
      const homeCid = rider?.cid ?? null;
      const winRows = this.db.prepare(`
        SELECT CAST(substr(s.date, 1, 4) AS INTEGER) AS yr, ra.country_id AS rc, rf.is_breakaway AS ib,
               rf.result_type_id AS rt, ra.name AS rn, ra.is_stage_race AS isr
        FROM results_flat rf
        JOIN stages s ON s.id = rf.stage_id
        JOIN races ra ON ra.id = s.race_id
        WHERE rf.rider_id = ? AND rf.rank = 1 AND (
          rf.result_type_id = 1
          OR (rf.result_type_id = 2 AND ra.is_stage_race = 1 AND s.stage_number = ra.number_of_stages)
        )
      `).all(riderId) as Array<{ yr: number; rc: number | null; ib: number | null; rt: number; rn: string | null; isr: number }>;

      const raceSeasons = new Map<string, Set<number>>();
      for (const w of winRows) {
        if (birthYear != null && w.yr - birthYear >= 35) out.veteranWins += 1;
        if (homeCid != null && w.rc != null && w.rc !== homeCid) out.awayWins += 1;
        if (w.rt === 1 && w.ib === 1) out.breakawayWins += 1;
        // Groundhog nur auf Renn-Gesamtsiegen: GC-Gesamtsieg (Typ 2) oder
        // Eintagessieg (Typ 1 & kein Etappenrennen).
        const isRaceWin = w.rt === 2 || (w.rt === 1 && w.isr === 0);
        if (isRaceWin && w.rn) {
          let set = raceSeasons.get(w.rn);
          if (!set) { set = new Set<number>(); raceSeasons.set(w.rn, set); }
          set.add(w.yr);
        }
      }
      // Laengste Serie aufeinanderfolgender Saisons mit Sieg desselben Rennens.
      for (const seasons of raceSeasons.values()) {
        const sorted = [...seasons].sort((a, b) => a - b);
        let run = 1, best = 1;
        for (let i = 1; i < sorted.length; i++) {
          run = sorted[i] === sorted[i - 1] + 1 ? run + 1 : 1;
          if (run > best) best = run;
        }
        if (best > out.groundhogStreak) out.groundhogStreak = best;
      }
    }
    return out;
  }

  /**
   * Baut die Hall-of-Fame-Kennzahlen fuer einen Fahrer. Renntage, Ausreisser-km
   * und Ausreissversuche stammen aus rider_career_stats (dort inkrementell
   * hochgezaehlt). Der Ausreisser-km-Rang nutzt dasselbe Standard-Ranking wie
   * die Siegerliste. Beide Aggregate laufen ueber die kleine career-stats-
   * Tabelle und sind fuer die Ladezeit unkritisch.
   */
  private buildHallOfFameStats(careerWins: number, riderId: number): RiderHallOfFameStats {
    const winsRank = this.getAllTimeWinsRank(careerWins);

    let raceDays = 0;
    let breakawayKms = 0;
    let breakawayAttempts = 0;
    let breakawayKmRank: number | null = null;
    let rankedBreakawayRiders = 0;
    let allTimeAttacks = 0;
    let attacksRank: number | null = null;
    let rankedAttackers = 0;
    let allTimeDistanceKm = 0;
    let bunchSprintWins = 0;
    let fullMoonWins = 0;
    let catPodiums = 0;
    let ghostTop10 = 0;
    let nationExpressCountries = 0;

    if (tableExists(this.db, 'rider_career_stats')) {
      const hasBunch = columnExists(this.db, 'rider_career_stats', 'bunch_sprint_wins');
      const hasMoon = columnExists(this.db, 'rider_career_stats', 'full_moon_wins');
      const hasCat = columnExists(this.db, 'rider_career_stats', 'cat_podiums');
      const hasGhost = columnExists(this.db, 'rider_career_stats', 'ghost_top10');
      const hasNation = columnExists(this.db, 'rider_career_stats', 'raced_country_ids');
      const own = this.db.prepare(`
        SELECT race_days, breakaway_kms, breakaway_attempts, attacks, total_km
               ${hasBunch ? ', bunch_sprint_wins' : ''}
               ${hasMoon ? ', full_moon_wins' : ''}
               ${hasCat ? ', cat_podiums' : ''}
               ${hasGhost ? ', ghost_top10' : ''}
               ${hasNation ? ', raced_country_ids' : ''}
        FROM rider_career_stats WHERE rider_id = ?
      `).get(riderId) as { race_days: number; breakaway_kms: number; breakaway_attempts: number; attacks: number; total_km: number; bunch_sprint_wins?: number; full_moon_wins?: number; cat_podiums?: number; ghost_top10?: number; raced_country_ids?: string | null } | undefined;
      raceDays = own?.race_days ?? 0;
      breakawayKms = own?.breakaway_kms ?? 0;
      breakawayAttempts = own?.breakaway_attempts ?? 0;
      allTimeAttacks = own?.attacks ?? 0;
      allTimeDistanceKm = own?.total_km ?? 0;
      bunchSprintWins = own?.bunch_sprint_wins ?? 0;
      fullMoonWins = own?.full_moon_wins ?? 0;
      catPodiums = own?.cat_podiums ?? 0;
      ghostTop10 = own?.ghost_top10 ?? 0;
      if (own?.raced_country_ids) {
        nationExpressCountries = new Set(
          String(own.raced_country_ids).split(',').map((t) => Number(t)).filter((n) => Number.isInteger(n))
        ).size;
      }

      const rankRow = this.db.prepare(`
        SELECT
          COALESCE(SUM(CASE WHEN breakaway_kms > ? THEN 1 ELSE 0 END), 0) AS brk_better,
          COALESCE(SUM(CASE WHEN breakaway_kms > 0 THEN 1 ELSE 0 END), 0) AS brk_ranked,
          COALESCE(SUM(CASE WHEN attacks > ? THEN 1 ELSE 0 END), 0) AS atk_better,
          COALESCE(SUM(CASE WHEN attacks > 0 THEN 1 ELSE 0 END), 0) AS atk_ranked
        FROM rider_career_stats
      `).get(breakawayKms, allTimeAttacks) as { brk_better: number; brk_ranked: number; atk_better: number; atk_ranked: number };
      breakawayKmRank = breakawayKms > 0 ? rankRow.brk_better + 1 : null;
      rankedBreakawayRiders = rankRow.brk_ranked;
      attacksRank = allTimeAttacks > 0 ? rankRow.atk_better + 1 : null;
      rankedAttackers = rankRow.atk_ranked;
    }

    const special = this.getSpecialRaceAchievements(riderId);
    const loyalty = this.getLoyaltyStats(riderId);
    const geography = this.getGeographyAchievements(riderId);
    const statRanks = this.getStatRecordRanks(riderId);
    const wild = this.getWildStats(riderId);
    const leadoutTrainRank = this.getBestLeadoutRank(riderId);
    const wave1 = this.getBadgeWave1Stats(riderId);
    const wave5 = this.getBadgeWave5Stats(riderId);
    const wave6 = this.getBadgeWave6Stats(riderId);
    const wave8 = this.getBadgeWave8Stats(riderId);

    return {
      allTimeWins: careerWins,
      allTimeWinsRank: winsRank.rank,
      careerWinsRank: winsRank.rank,
      leadoutTrainRank,
      ...statRanks,
      ...wild,
      ...wave1,
      ...wave5,
      ...wave6,
      ...wave8,
      rankedRiders: winsRank.rankedRiders,
      allTimeRaceDays: raceDays,
      breakawayKms,
      breakawayAttempts,
      breakawayKmRank,
      rankedBreakawayRiders,
      allTimeAttacks,
      attacksRank,
      rankedAttackers,
      allTimeDistanceKm,
      bunchSprintWins,
      fullMoonWins,
      catPodiums,
      ghostTop10,
      nationExpressCountries,
      ...special,
      ...loyalty,
      ...geography,
    };
  }

  /**
   * Geografie-Erfolge aus Etappensiegen (rank 1). Kontinente pro Saison (World
   * Citizen), Kontinente all-time (Globetrotter) und Laender-Meister. rank-1-
   * Zeilen ueberleben das Saison-Pruning, daher vollstaendig aus results_flat
   * rekonstruierbar (eine fahrergefilterte Query).
   */
  private getGeographyAchievements(riderId: number): {
    worldCitizenBestYear: number; continentsWon: string[];
    mediterraneanMaster: boolean; scandinavianMaster: boolean; beneluxMaster: boolean;
    countriesWonCount: number; homeSoilWins: number;
  } {
    const empty = { worldCitizenBestYear: 0, continentsWon: [] as string[], mediterraneanMaster: false, scandinavianMaster: false, beneluxMaster: false, countriesWonCount: 0, homeSoilWins: 0 };
    if (!tableExists(this.db, 'results_flat') || !tableExists(this.db, 'sta_country')) {
      return empty;
    }
    // Es zaehlen alle Siege im jeweiligen Land: Etappensiege und Eintagesrennen
    // (result_type_id = 1) sowie GC-Gesamtsiege von Rundfahrten
    // (result_type_id = 2). GC-Zwischenwertungen tragen aber ebenfalls rank = 1
    // fuer den Fuehrenden nach jeder Etappe — daher wird der Gesamtsieg nur an
    // der Schlussetappe (hoechste stage_number des Rennens) gewertet. Bei
    // Eintagesrennen fallen Etappen- und GC-Zeile auf dasselbe Land; die
    // Set-Aggregation weiter unten entdoppelt das sauber.
    const rows = this.db.prepare(`
      SELECT substr(s.date, 1, 4) AS yr, co.continent AS continent, co.name AS country
      FROM results_flat rf
      JOIN stages s ON s.id = rf.stage_id
      JOIN races ra ON ra.id = s.race_id
      JOIN sta_country co ON co.id = ra.country_id
      WHERE rf.rider_id = ? AND rf.rank = 1 AND (
        rf.result_type_id = 1
        OR (rf.result_type_id = 2 AND s.stage_number = (
          SELECT MAX(s2.stage_number) FROM stages s2 WHERE s2.race_id = ra.id
        ))
      )
    `).all(riderId) as Array<{ yr: string; continent: string | null; country: string | null }>;

    const continentsByYear = new Map<string, Set<string>>();
    const allContinents = new Set<string>();
    const countriesWon = new Set<string>();
    for (const r of rows) {
      if (r.continent) {
        allContinents.add(r.continent);
        let set = continentsByYear.get(r.yr);
        if (!set) { set = new Set<string>(); continentsByYear.set(r.yr, set); }
        set.add(r.continent);
      }
      if (r.country) countriesWon.add(r.country);
    }
    let worldCitizenBestYear = 0;
    for (const set of continentsByYear.values()) {
      if (set.size > worldCitizenBestYear) worldCitizenBestYear = set.size;
    }
    // Home Soil Hero: Siege im Heimatland des Fahrers. Saubere Sieg-Semantik
    // (Etappen-/Eintagessiege + GC-Gesamtsiege an der Schlussetappe) ohne die
    // Doppelzaehlung von Eintagesrennen aus der Set-Query oben.
    let homeSoilWins = 0;
    const homeRow = this.db.prepare('SELECT country_id AS cid FROM riders WHERE id = ?').get(riderId) as { cid: number | null } | undefined;
    if (homeRow?.cid != null) {
      const hs = this.db.prepare(`
        SELECT COUNT(*) AS c
        FROM results_flat rf
        JOIN stages s ON s.id = rf.stage_id
        JOIN races ra ON ra.id = s.race_id
        WHERE rf.rider_id = ? AND rf.rank = 1 AND ra.country_id = ? AND (
          rf.result_type_id = 1
          OR (rf.result_type_id = 2 AND ra.is_stage_race = 1 AND s.stage_number = ra.number_of_stages)
        )
      `).get(riderId, homeRow.cid) as { c: number };
      homeSoilWins = hs.c;
    }

    const won = (c: string) => countriesWon.has(c);
    return {
      worldCitizenBestYear,
      continentsWon: [...allContinents],
      mediterraneanMaster: won('Portugal') && won('Spain') && won('France') && won('Italy'),
      scandinavianMaster: won('Denmark') && won('Norway'),
      beneluxMaster: won('Belgium') && won('Netherlands') && won('Luxembourg'),
      countriesWonCount: countriesWon.size,
      homeSoilWins,
    };
  }

  /**
   * Loyalitaets-/Langlebigkeitskennzahlen aus den Vertraegen. Es zaehlen nur
   * bereits verstrichene Saisons (bis zur aktuellen), damit zukuenftige
   * Vertragsjahre keine Erfolge vortaeuschen. Ueberlappungen und Luecken werden
   * ueber Saison-Mengen sauber behandelt.
   */
  private getLoyaltyStats(riderId: number): { careerSeasons: number; mostSeasonsOneTeam: number; teamCount: number } {
    if (!tableExists(this.db, 'contracts')) {
      return { careerSeasons: 0, mostSeasonsOneTeam: 0, teamCount: 0 };
    }
    const currentSeason = new GameStateRepository(this.db).getCurrentSeason();
    const rows = this.db.prepare(`
      SELECT team_id, start_season, end_season FROM contracts WHERE rider_id = ?
    `).all(riderId) as Array<{ team_id: number; start_season: number; end_season: number }>;

    const allSeasons = new Set<number>();
    const seasonsByTeam = new Map<number, Set<number>>();
    for (const c of rows) {
      const end = Math.min(c.end_season, currentSeason);
      if (c.start_season > currentSeason) continue;
      let teamSet = seasonsByTeam.get(c.team_id);
      if (!teamSet) { teamSet = new Set<number>(); seasonsByTeam.set(c.team_id, teamSet); }
      for (let s = c.start_season; s <= end; s += 1) {
        allSeasons.add(s);
        teamSet.add(s);
      }
    }
    let mostSeasonsOneTeam = 0;
    for (const teamSet of seasonsByTeam.values()) {
      if (teamSet.size > mostSeasonsOneTeam) mostSeasonsOneTeam = teamSet.size;
    }
    return {
      careerSeasons: allSeasons.size,
      mostSeasonsOneTeam,
      teamCount: seasonsByTeam.size,
    };
  }

  /**
   * Ermittelt Spezialrennen-Erfolge aus den Siegen des Fahrers (nach Rennnamen).
   * Grand-Tour-Siege = GC-Sieg an der Schlussetappe; Klassiker-Siege = Sieg im
   * Eintagesrennen. Liest aus results_flat (Fallback all_results) und ist damit
   * eine einzelne fahrergefilterte Query.
   */
  private getSpecialRaceAchievements(riderId: number): {
    wonAllGrandTours: boolean; wonAllMonuments: boolean; wonCobbleKing: boolean; wonArdennenKing: boolean;
    tourOfNationHome: boolean;
  } {
    const empty = { wonAllGrandTours: false, wonAllMonuments: false, wonCobbleKing: false, wonArdennenKing: false, tourOfNationHome: false };
    if (!tableExists(this.db, 'results') && !tableExists(this.db, 'results_flat')) {
      return empty;
    }
    const src = tableExists(this.db, 'results_flat') ? 'results_flat' : 'all_results';
    const rows = this.db.prepare(`
      SELECT DISTINCT races.name AS name
      FROM ${src} rf
      JOIN stages ON stages.id = rf.stage_id
      JOIN races ON races.id = stages.race_id
      WHERE rf.rider_id = ? AND rf.rank = 1
        AND (
          (rf.result_type_id = 2 AND races.is_stage_race = 1 AND stages.stage_number = races.number_of_stages)
          OR (rf.result_type_id = 1 AND races.is_stage_race = 0)
        )
    `).all(riderId) as Array<{ name: string }>;
    const won = new Set(rows.map((r) => r.name));

    const has = (name: string) => won.has(name);
    const grandTours = ['Tour de France', "Giro d'Italia", 'La Vuelta Ciclista a España'];
    const monuments = ['Milano-Sanremo', 'Ronde van Vlaanderen ME', 'Paris-Roubaix Hauts-de-France', 'Liège-Bastogne-Liège', 'Il Lombardia'];

    // Tour of Nation: Gesamtsieg bei der Heim-Grand-Tour — franzoesischer
    // Fahrer bei der Tour de France, italienischer beim Giro, spanischer bei
    // der Vuelta. Heimatland ueber die Landeszuordnung des Fahrers.
    const homeCountry = this.db.prepare(
      'SELECT co.name AS name FROM riders r JOIN sta_country co ON co.id = r.country_id WHERE r.id = ?'
    ).get(riderId) as { name: string | null } | undefined;
    const homeGtByCountry: Record<string, string> = {
      France: 'Tour de France',
      Italy: "Giro d'Italia",
      Spain: 'La Vuelta Ciclista a España',
    };
    const homeGt = homeCountry?.name ? homeGtByCountry[homeCountry.name] : undefined;
    const tourOfNationHome = homeGt ? has(homeGt) : false;

    return {
      wonAllGrandTours: grandTours.every(has),
      wonAllMonuments: monuments.every(has),
      wonCobbleKing: has('Ronde van Vlaanderen ME') && has('Paris-Roubaix Hauts-de-France'),
      wonArdennenKing: has('Amstel Gold Race') && has('La Flèche Wallonne') && has('Liège-Bastogne-Liège'),
      tourOfNationHome,
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
