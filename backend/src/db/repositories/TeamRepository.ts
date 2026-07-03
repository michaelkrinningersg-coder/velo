import { summarizeStageProfile } from '../../simulation/StageParser';
import Database from 'better-sqlite3';
import {
  Country,
  FormDebugPoint,
  Nationality,
  PrecalculatedRaceIncident,
  Race,
  RaceCategory,
  RaceCategoryBonus,
  RaceClassificationRow,
  RaceProgram,
  RaceProgramParticipant,
  RaceStageSummary,
  RealtimeClassificationLeaders,
  RealtimeClassificationStanding,
  RealtimeGcStanding,
  ResultType,
  Rider,
  RiderFormSnapshot,
  RiderHealthStatus,
  RiderPotentials,
  RiderProgramRaceSummary,
  RiderRaceFormSource,
  RiderSeasonFormPhase,
  RiderSkillKey,
  RiderSkills,
  RiderStatsPayload,
  RiderStatsPointsByRaceFormat,
  RiderStatsPointsByTerrain,
  RiderStatsRaceBlock,
  RiderStatsRow,
  RiderStatsRowType,
  RiderStatsSeason,
  Role,
  SeasonPointAwardType,
  SeasonStandingCountryRow,
  SeasonStandingCountryRiderRow,
  SeasonStandingRow,
  SeasonStandingsPayload,
  Stage,
  StageClassification,
  StageMarkerCategory,
  StageMarkerClassification,
  StageNonFinisherRow,
  StageResultsPayload,
  StageScoringRule,
  Team,
  TeamStatsPayload,
  TeamStatsRider,
  TeamStatsTopResult,
  TeamSuccessStats,
} from '../../../../shared/types';
import { SKILL_WEIGHT_RIDER_COLUMNS, SkillWeightRule } from '../../../../shared/skillWeights';
import {
  RESULT_TYPE_IDS,
  RACE_FORM_BUILD_SOURCE_AMOUNT,
  isMountainClassificationType,
  resolveMarkerResultsSortPriority,
  SEASON_POINT_AWARD_TYPES,
  RIDER_SKILL_COLUMNS,
  SEASON_FORM_RISE_DAYS,
  SEASON_FORM_FALL_DAYS,
  SEASON_FORM_MAX_RAW,
  SEASON_FORM_RISE_STEP_RAW,
  DIVISION_BY_TIER,
  RiderRow,
  RiderSeasonRaceStats,
  CareerRaceDaysSeasonRow,
  RaceProgramRow,
  RiderSeasonProgramRow,
  TeamRow,
  RaceRow,
  StageRow,
  StageResultsMetaRow,
  RuleRow,
  SkillWeightRow,
  StageEntryStatus,
  ResultTypeRow,
  StageResultDbRow,
  StageNonFinisherDbRow,
  StageMarkerResultDbRow,
  StageSeasonPointDbRow,
  StageTeamSeasonPointDbRow,
  SeasonPointStageRow,
  SeasonPointResultRow,
  RiderSeasonStandingDbRow,
  TeamSeasonStandingDbRow,
  CountrySeasonStandingDbRow,
  RiderStatsStageDbRow,
  RiderStatsFinalDbRow,
  emptyRiderStatsPointsByTerrain,
  emptyRiderStatsPointsByRaceFormat,
  resolveRiderStatsTerrainBucket,
  resolveDataCsvDir,
  parseCsvLine,
  parseRaceList,
  parseRankedValues,
  parsePeakDates,
  usesMountainStagePoints,
  resolveStageResultPointValues,
  isoDateToDayNumber,
  randomBetween,
  roundToTwoDecimals,
  addDaysIso,
  resolveStageRaceBaseFatigue,
  resolveStageRaceFatigueMalus,
  resolveEffectiveRecuperationSkill,
  resolvePeakPhase,
  resolveDeclineValue,
  resolveEffectiveSeasonForm,
  resolveProjectionPoint,
  resolveRiderSeasonFormPhase,
  tableExists,
  columnExists,
  mapSkillObject,
  mapCountry,
  mapRole,
  mapRider,
  mapTeam,
  mapRaceCategoryBonus,
  mapRaceCategory,
  mapSkillWeightRule,
  mapStage,
  loadFallbackStages,
  mapRace,
  buildRaceSelect,
  mapRaceProgram,
  mapRaceWithSummary,
} from '../mappers';
import { GameStateRepository } from './GameStateRepository';
import { ResultRepository } from './ResultRepository';
import { RaceRepository } from './RaceRepository';
import { RiderRepository } from './RiderRepository';


export class TeamRepository {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }


  public getTeams(): Team[] {
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
    `).all() as TeamRow[];
    return rows.map(mapTeam);
  }


  public getTeamById(id: number): Team | null {
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
    `).get(id) as TeamRow | undefined;
    return row ? mapTeam(row) : null;
  }

  public getTeamStats(teamId: number): TeamStatsPayload | null {
    const team = this.getTeamById(teamId);
    if (!team) {
      return null;
    }

    const riders = new RiderRepository(this.db).getRiders(teamId);

    // 1. Map Riders
    const teamRiders: TeamStatsRider[] = riders.map((rider) => ({
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
        NULL AS event_ids,
        NULL AS jerseys_worn,
        stages.super_team_id AS super_team_id,
        spe.team_id AS team_id
      FROM season_point_events spe
      JOIN riders r ON r.id = spe.rider_id
      JOIN sta_country c ON c.id = r.country_id
      JOIN stages ON stages.id = spe.stage_id
      JOIN races ON races.id = spe.race_id
      JOIN race_categories cat ON cat.id = races.category_id
      WHERE spe.team_id = ?
        AND spe.points_awarded > 0
        AND spe.award_type IN ('stage_result', 'one_day_result', 'gc_final', 'points_final', 'mountain_final', 'youth_final')
      ORDER BY spe.points_awarded DESC, stages.date DESC
    `).all(teamId) as Array<{
      season: number;
      race_id: number;
      stage_id: number;
      rider_id: number;
      rider_first_name: string;
      rider_last_name: string;
      rider_country_code: string;
      race_name: string;
      race_category_name: string;
      is_stage_race: number;
      stage_number: number;
      date: string;
      profile: string;
      award_type: string;
      result_rank: number;
      season_points: number;
      stage_score: number;
      event_ids: string | null;
      jerseys_worn: string | null;
      super_team_id?: number | null;
      team_id?: number | null;
    }>;

    const topResults: TeamStatsTopResult[] = topResultsRows.map((row) => {
      let rowType: RiderStatsRowType = 'stage_result';
      if (row.award_type === 'gc_final') rowType = 'gc_final';
      else if (row.award_type === 'points_final') rowType = 'points_final';
      else if (row.award_type === 'mountain_final') rowType = 'mountain_final';
      else if (row.award_type === 'youth_final') rowType = 'youth_final';

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
        finishStatus: 'classified' as const,
        statusReason: null,
        profile: row.profile as any,
        seasonPoints: row.season_points,
        season: row.season,
        stageScore: row.stage_score,
        eventIds: row.event_ids,
        jerseysWorn: row.jerseys_worn,
        superTeamId: row.super_team_id ?? null,
        teamId: row.team_id ?? null,
        isStageRace: row.is_stage_race === 1,
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
      FROM all_results results
      JOIN stages ON stages.id = results.stage_id
      JOIN races ON races.id = stages.race_id
      JOIN race_categories cat ON cat.id = races.category_id
      JOIN race_categories_bonus cat_bonus ON cat_bonus.id = cat.bonus_system_id
      WHERE results.team_id = ?
        AND results.rider_id IS NULL
        AND results.result_type_id = 1
        AND stages.profile = 'TTT'
    `).all(teamId) as Array<{
      season: number;
      race_id: number;
      stage_id: number;
      race_name: string;
      race_category_name: string;
      is_stage_race: number;
      stage_number: number;
      date: string;
      profile: string;
      result_rank: number;
      stage_score: number;
      points_stage: string;
      super_team_id?: number | null;
      team_id?: number | null;
    }>;

    for (const row of tttRows) {
      const pointsList = parseRankedValues(row.points_stage);
      const points = pointsList[row.result_rank - 1] ?? 0;
      if (points > 0) {
        topResults.push({
          riderId: null as any,
          riderName: 'Mannschaftszeitfahren',
          riderCountryCode: null,
          rowType: 'stage_result' as const,
          date: row.date,
          raceId: row.race_id,
          raceName: row.race_name,
          raceCategoryName: row.race_category_name,
          stageId: row.stage_id,
          stageNumber: row.stage_number,
          resultRank: row.result_rank,
          gcRank: null,
          finishStatus: 'classified' as const,
          statusReason: null,
          profile: row.profile as any,
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
    const successStats: TeamStatsPayload['successStats'] = {};

    const seasonsRows = this.db.prepare(`
      SELECT DISTINCT CAST(substr(date, 1, 4) AS INTEGER) AS season FROM stages
    `).all() as Array<{ season: number }>;
    const activeSeasons = seasonsRows.map((r) => r.season).sort((a, b) => b - a);

    const initSuccessStats = (): TeamSuccessStats => {
      const categories: TeamSuccessStats['categories'] = {};
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
        homeAdvantageDays: 0,
        superHomeAdvantageDays: 0,
        homePressureDays: 0,
        breakawayKms: 0,
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
    const cStatsRow = careerStatsStmt.get(teamId) as any;
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
      FROM all_stage_entries stage_entries
      JOIN stages ON stages.id = stage_entries.stage_id
      WHERE stage_entries.team_id = ? AND stage_entries.status IN ('dns', 'dnf')
    `).all(teamId) as Array<{ season: number; status: string; status_reason: string | null }>;

    for (const row of nonFinisherRows) {
      const statsList = [successStats['all'], successStats[String(row.season)]].filter(Boolean);
      for (const stats of statsList) {
        if (row.status === 'dns') {
          stats.dnsCount++;
        } else if (row.status === 'dnf') {
          if (row.status_reason?.startsWith('OTL ')) {
            stats.otlCount++;
          } else {
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
      FROM all_stage_entries se
      JOIN stages ON stages.id = se.stage_id
      WHERE se.team_id = ? AND se.status != 'dns'
      GROUP BY season
    `).all(teamId) as Array<{ season: number; race_days: number }>;

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
      FROM all_stage_entries se
      JOIN stages ON stages.id = se.stage_id
      JOIN races ON races.id = stages.race_id
      JOIN race_categories cat ON cat.id = races.category_id
      WHERE se.team_id = ? AND se.status != 'dns'
      GROUP BY season, category_name
    `).all(teamId) as Array<{ season: number; category_name: string; race_days: number }>;

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
      FROM all_results results
      JOIN stages ON stages.id = results.stage_id
      WHERE results.team_id = ? AND results.result_type_id = 1 AND results.is_breakaway = 1
      GROUP BY season
    `).all(teamId) as Array<{ season: number; count: number }>;

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
      FROM all_results r1
      JOIN stages s ON s.id = r1.stage_id
      WHERE r1.team_id = ?
        AND r1.result_type_id = 1
        AND r1.is_breakaway = 1
        AND NOT EXISTS (
          SELECT 1 FROM all_results r2
          WHERE r2.stage_id = r1.stage_id
            AND r2.result_type_id = 1
            AND r2.rank < r1.rank
            AND r2.is_breakaway = 0
        )
      GROUP BY season
    `).all(teamId) as Array<{ season: number; count: number }>;

    for (const row of successfulBreakawayRows) {
      const statsList = [successStats['all'], successStats[String(row.season)]].filter(Boolean);
      for (const stats of statsList) {
        stats.successfulBreakaways += row.count;
      }
    }

    // G. Query GC & Stage results from pre-aggregated table
    const statsRows = tableExists(this.db, 'team_season_category_stats')
      ? this.db.prepare(`
          SELECT * FROM team_season_category_stats WHERE team_id = ?
        `).all(teamId) as any[]
      : [];

    for (const row of statsRows) {
      const statsList = [successStats['all'], successStats[String(row.season)]].filter(Boolean);
      for (const stats of statsList) {
        let catStats = stats.categories[row.category_name];
        if (!catStats) {
          continue;
        }
        catStats.oneDayWins += row.one_day_wins ?? 0;
        catStats.oneDaySecond += row.one_day_second ?? 0;
        catStats.oneDayThird += row.one_day_third ?? 0;
        catStats.oneDayTopTen += row.one_day_top_ten ?? 0;

        catStats.stageWins += row.stage_wins ?? 0;
        catStats.stageSecond += row.stage_second ?? 0;
        catStats.stageThird += row.stage_third ?? 0;
        catStats.stageTopTen += row.stage_top_ten ?? 0;

        catStats.gcWins += row.gc_wins ?? 0;
        catStats.gcSecond += row.gc_second ?? 0;
        catStats.gcThird += row.gc_third ?? 0;
        catStats.gcTopTen += row.gc_top_ten ?? 0;

        catStats.pointsWins += row.points_wins ?? 0;
        catStats.mountainWins += row.mountain_wins ?? 0;
        catStats.youthWins += row.youth_wins ?? 0;
        catStats.breakawayWins += row.breakaway_wins ?? 0;

        catStats.winFlat += row.win_flat ?? 0;
        catStats.winRolling += row.win_rolling ?? 0;
        catStats.winHilly += row.win_hilly ?? 0;
        catStats.winHillyDifficult += row.win_hilly_difficult ?? 0;
        catStats.winMediumMountain += row.win_medium_mountain ?? 0;
        catStats.winMountain += row.win_mountain ?? 0;
        catStats.winHighMountain += row.win_high_mountain ?? 0;
        catStats.winCobble += row.win_cobble ?? 0;
        catStats.winCobbleHill += row.win_cobble_hill ?? 0;
        catStats.winITT += row.win_itt ?? 0;
        catStats.winTTT += row.win_ttt ?? 0;

        catStats.winWeather1 += row.win_weather_1 ?? 0;
        catStats.winWeather2 += row.win_weather_2 ?? 0;
        catStats.winWeather3 += row.win_weather_3 ?? 0;
        catStats.winWeather4 += row.win_weather_4 ?? 0;
        catStats.winWeather5 += row.win_weather_5 ?? 0;
        catStats.winWeather6 += row.win_weather_6 ?? 0;
        catStats.winWeather7 += row.win_weather_7 ?? 0;
      }
    }

    // H. Query leader jerseys
    const leaderJerseyRows = this.db.prepare(`
      SELECT
        CAST(substr(stages.date, 1, 4) AS INTEGER) AS season,
        cat.name AS category_name,
        r.result_type_id,
        COUNT(*) AS count
      FROM all_results r
      JOIN stages ON stages.id = r.stage_id
      JOIN races ON races.id = stages.race_id
      JOIN race_categories cat ON cat.id = races.category_id
      WHERE r.team_id = ?
        AND r.result_type_id IN (2, 3, 4, 5, 7)
        AND r.rank = 1
        AND races.is_stage_race = 1
      GROUP BY season, category_name, r.result_type_id
    `).all(teamId) as Array<{ season: number; category_name: string; result_type_id: number; count: number }>;

    for (const row of leaderJerseyRows) {
      const statsList = [successStats['all'], successStats[String(row.season)]].filter(Boolean);
      for (const stats of statsList) {
        let catStats = stats.categories[row.category_name];
        if (catStats) {
          if (row.result_type_id === 2) {
            catStats.leaderJerseys = row.count;
          } else if (row.result_type_id === 3) {
            catStats.pointsJerseys = row.count;
          } else if (row.result_type_id === 4) {
            catStats.mountainJerseys = row.count;
          } else if (row.result_type_id === 5) {
            catStats.youthJerseys = row.count;
          } else if (row.result_type_id === 7) {
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
    `).all(teamId) as Array<{ season: number; category_name: string; marker_type: string; marker_category: string | null; count: number }>;

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
          } else if (mCat === '1') {
            catStats.climbWins1 += row.count;
          } else if (mCat === '2') {
            catStats.climbWins2 += row.count;
          } else if (mCat === '3') {
            catStats.climbWins3 += row.count;
          } else if (mCat === '4') {
            catStats.climbWins4 += row.count;
          }
        }
      }
    }

    // J. Query superteam counts from stages
    if (tableExists(this.db, 'stages')) {
      const superteamCountRows = this.db.prepare(`
        SELECT CAST(substr(date, 1, 4) AS INTEGER) AS season, COUNT(*) AS count
        FROM stages
        WHERE super_team_id = ?
        GROUP BY season
      `).all(teamId) as Array<{ season: number; count: number }>;

      for (const row of superteamCountRows) {
        const yrStr = String(row.season);
        if (successStats[yrStr]) {
          successStats[yrStr].superteamCount = row.count;
        }
        successStats['all'].superteamCount += row.count;
      }
    }

    // K. Query home advantage and breakaway kms from rider_season_stats
    if (tableExists(this.db, 'rider_season_stats')) {
      const seasonStatsRows = this.db.prepare(`
        SELECT
          season,
          SUM(home_advantage_days) AS home_adv,
          SUM(super_home_advantage_days) AS super_home,
          SUM(home_pressure_days) AS home_press,
          SUM(breakaway_kms) AS breakaway_kms
        FROM rider_season_stats
        WHERE rider_id IN (SELECT id FROM riders WHERE active_team_id = ? AND is_retired = 0)
        GROUP BY season
      `).all(teamId) as Array<{
        season: number;
        home_adv: number | null;
        super_home: number | null;
        home_press: number | null;
        breakaway_kms: number | null;
      }>;

      for (const row of seasonStatsRows) {
        const statsList = [successStats['all'], successStats[String(row.season)]].filter(Boolean);
        for (const stats of statsList) {
          stats.homeAdvantageDays += row.home_adv ?? 0;
          stats.superHomeAdvantageDays += row.super_home ?? 0;
          stats.homePressureDays += row.home_press ?? 0;
          stats.breakawayKms += row.breakaway_kms ?? 0;
        }
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
      historyRosters: this.getTeamHistoryRosters(teamId),
      transfers: this.getTeamTransfers(teamId),
    };
  }

  public getTeamTransfers(teamId: number): Record<number, {
    incoming: Array<{
      id: number;
      firstName: string;
      lastName: string;
      nationality: string | null;
      specialization1: string | null;
      specialization2: string | null;
      specialization3: string | null;
      roleName: string | null;
      overallRating: number;
      fromTeamId?: number | null;
      fromTeamName?: string | null;
    }>;
    outgoing: Array<{
      id: number;
      firstName: string;
      lastName: string;
      nationality: string | null;
      specialization1: string | null;
      specialization2: string | null;
      specialization3: string | null;
      roleName: string | null;
      overallRating: number;
      isRetired: boolean;
      toTeamId?: number | null;
      toTeamName?: string | null;
    }>;
  }> {
    const db = this.db;
    const currentSeason = new GameStateRepository(db).getCurrentSeason();
    
    // Find all seasons that have transfers for this team
    const seasonsSet = new Set<number>();
    const contractSeasons = db.prepare(`
      SELECT DISTINCT start_season, end_season FROM contracts WHERE team_id = ?
    `).all(teamId) as Array<{ start_season: number; end_season: number }>;
    
    for (const row of contractSeasons) {
      seasonsSet.add(row.start_season);
      seasonsSet.add(row.end_season + 1);
    }

    // Min and max years
    let minYear = currentSeason;
    let maxYear = currentSeason;
    for (const yr of seasonsSet) {
      if (yr < minYear) minYear = yr;
      if (yr > maxYear) maxYear = yr;
    }

    const transfers: Record<number, { incoming: any[]; outgoing: any[] }> = {};

    const incomingStmt = db.prepare(`
      SELECT 
        r.id,
        r.first_name AS firstName,
        r.last_name AS lastName,
        co.code_3 AS nationality,
        spec1.type_key AS specialization1,
        spec2.type_key AS specialization2,
        spec3.type_key AS specialization3,
        COALESCE(role.name, curr_role.name, 'Helfer') AS roleName,
        r.overall_rating AS overallRating,
        dh.old_team_id AS fromTeamId,
        prev_t.name AS fromTeamName
      FROM contracts c
      JOIN riders r ON c.rider_id = r.id
      LEFT JOIN sta_country co ON r.country_id = co.id
      LEFT JOIN type_rider spec1 ON r.specialization_1_id = spec1.id
      LEFT JOIN type_rider spec2 ON r.specialization_2_id = spec2.id
      LEFT JOIN type_rider spec3 ON r.specialization_3_id = spec3.id
      LEFT JOIN rider_season_roles rsr ON rsr.rider_id = r.id AND rsr.season = :season
      LEFT JOIN sta_role role ON rsr.role_id = role.id
      LEFT JOIN sta_role curr_role ON r.role_id = curr_role.id
      LEFT JOIN draft_history dh ON dh.rider_id = r.id AND dh.season = :season AND dh.team_id = :teamId
      LEFT JOIN teams prev_t ON dh.old_team_id = prev_t.id
      WHERE c.team_id = :teamId AND c.start_season = :season
    `);

    const outgoingStmt = db.prepare(`
      SELECT 
        r.id,
        r.first_name AS firstName,
        r.last_name AS lastName,
        co.code_3 AS nationality,
        spec1.type_key AS specialization1,
        spec2.type_key AS specialization2,
        spec3.type_key AS specialization3,
        COALESCE(role.name, curr_role.name, 'Helfer') AS roleName,
        r.overall_rating AS overallRating,
        r.is_retired AS isRetired,
        dh.team_id AS toTeamId,
        next_t.name AS toTeamName
      FROM contracts c
      JOIN riders r ON c.rider_id = r.id
      LEFT JOIN sta_country co ON r.country_id = co.id
      LEFT JOIN type_rider spec1 ON r.specialization_1_id = spec1.id
      LEFT JOIN type_rider spec2 ON r.specialization_2_id = spec2.id
      LEFT JOIN type_rider spec3 ON r.specialization_3_id = spec3.id
      LEFT JOIN rider_season_roles rsr ON rsr.rider_id = r.id AND rsr.season = :roleSeason
      LEFT JOIN sta_role role ON rsr.role_id = role.id
      LEFT JOIN sta_role curr_role ON r.role_id = curr_role.id
      LEFT JOIN draft_history dh ON dh.rider_id = r.id AND dh.season = :nextSeason AND dh.old_team_id = :teamId
      LEFT JOIN teams next_t ON dh.team_id = next_t.id
      WHERE c.team_id = :teamId AND c.end_season = :endSeason
    `);

    for (let y = minYear; y <= maxYear; y++) {
      const incomingRaw = incomingStmt.all({
        season: y,
        prevSeason: y - 1,
        teamId: teamId
      }) as any[];

      const outgoingRaw = outgoingStmt.all({
        roleSeason: y - 1,
        teamId: teamId,
        endSeason: y - 1,
        nextSeason: y
      }) as any[];

      const incoming = incomingRaw
        .filter(r => r.fromTeamId !== teamId)
        .map((r: any) => ({
          id: r.id,
          firstName: r.firstName,
          lastName: r.lastName,
          nationality: r.nationality,
          specialization1: r.specialization1,
          specialization2: r.specialization2,
          specialization3: r.specialization3,
          roleName: r.roleName,
          overallRating: r.overallRating,
          fromTeamId: r.fromTeamId ?? null,
          fromTeamName: r.fromTeamName ?? null,
        }));

      const outgoing = outgoingRaw
        .filter(r => r.toTeamId !== teamId)
        .map((r: any) => ({
          id: r.id,
          firstName: r.firstName,
          lastName: r.lastName,
          nationality: r.nationality,
          specialization1: r.specialization1,
          specialization2: r.specialization2,
          specialization3: r.specialization3,
          roleName: r.roleName,
          overallRating: r.overallRating,
          isRetired: r.isRetired === 1,
          toTeamId: r.toTeamId ?? null,
          toTeamName: r.toTeamName ?? null,
        }));

      if (incoming.length > 0 || outgoing.length > 0) {
        transfers[y] = {
          incoming,
          outgoing
        };
      }
    }

    return transfers;
  }

  public getTeamHistoryRosters(teamId: number): Record<number, Array<{
    riderId: number;
    firstName: string;
    lastName: string;
    nationality: string | null;
    roleName: string | null;
    overallRating: number;
    potential: number | null;
    contractEndSeason: number | null;
  }>> {
    const db = this.db;
    const currentSeason = new GameStateRepository(db).getCurrentSeason();
    
    // 1. Alle Verträge dieses Teams abfragen
    const contracts = db.prepare(`
      SELECT c.rider_id, c.start_season, c.end_season, r.first_name, r.last_name, co.code_3 AS nationality, r.overall_rating, r.pot_overall AS potential
      FROM contracts c
      JOIN riders r ON c.rider_id = r.id
      LEFT JOIN sta_country co ON r.country_id = co.id
      WHERE c.team_id = ?
    `).all(teamId) as any[];

    if (contracts.length === 0) {
      return {};
    }

    // Min und Max Jahr ermitteln
    let minYear = currentSeason;
    let maxYear = currentSeason;
    for (const c of contracts) {
      if (c.start_season < minYear) minYear = c.start_season;
      if (c.end_season > maxYear) maxYear = c.end_season;
    }

    // Historische Rollen laden
    const seasonRolesRows = db.prepare(`
      SELECT sr.rider_id, sr.season, role.name AS roleName
      FROM rider_season_roles sr
      JOIN sta_role role ON sr.role_id = role.id
      WHERE sr.rider_id IN (
        SELECT DISTINCT rider_id FROM contracts WHERE team_id = ?
      )
    `).all(teamId) as Array<{ rider_id: number; season: number; roleName: string }>;

    // Map für schnellen Zugriff auf historische Rollen: riderId -> season -> roleName
    const roleMap = new Map<number, Map<number, string>>();
    for (const row of seasonRolesRows) {
      if (!roleMap.has(row.rider_id)) {
        roleMap.set(row.rider_id, new Map<number, string>());
      }
      roleMap.get(row.rider_id)!.set(row.season, row.roleName);
    }

    // Aktuelle Rollen laden (falls y === currentSeason)
    const currentRolesRows = db.prepare(`
      SELECT r.id AS rider_id, role.name AS roleName
      FROM riders r
      JOIN sta_role role ON r.role_id = role.id
      WHERE r.active_team_id = ? AND r.is_retired = 0
    `).all(teamId) as Array<{ rider_id: number; roleName: string }>;
    const currentRoleMap = new Map<number, string>(currentRolesRows.map(r => [r.rider_id, r.roleName]));

    const historyRosters: Record<number, any[]> = {};

    for (let y = minYear; y <= maxYear; y++) {
      const rosterForYear: any[] = [];
      for (const c of contracts) {
        if (c.start_season <= y && c.end_season >= y) {
          let roleName: string | null = null;
          if (y === currentSeason) {
            roleName = currentRoleMap.get(c.rider_id) ?? null;
          } else if (y < currentSeason) {
            roleName = roleMap.get(c.rider_id)?.get(y) ?? null;
          } else {
            roleName = null; // Zukünftig
          }

          rosterForYear.push({
            riderId: c.rider_id,
            firstName: c.first_name,
            lastName: c.last_name,
            nationality: c.nationality,
            roleName: roleName,
            overallRating: c.overall_rating,
            potential: c.potential,
            contractEndSeason: c.end_season,
          });
        }
      }

      if (rosterForYear.length > 0) {
        // Sortiere Kader nach Nachname, Vorname
        rosterForYear.sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName));
        historyRosters[y] = rosterForYear;
      }
    }

    return historyRosters;
  }
}
