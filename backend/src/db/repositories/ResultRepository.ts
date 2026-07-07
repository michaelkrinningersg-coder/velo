import { summarizeStageProfile } from '../../simulation/StageParser';
import { CHAMPIONSHIP_CATEGORY_IDS } from '../../simulation/championships';
import Database from 'better-sqlite3';
import { Country, FormDebugPoint, Nationality, PrecalculatedRaceIncident, Race, RaceCategory, RaceCategoryBonus, RaceClassificationRow, RaceProgram, RaceProgramParticipant, RaceRosterEntry, RaceRosterPayload, RaceStageSummary, RealtimeClassificationLeaders, RealtimeClassificationStanding, RealtimeGcStanding, ResultType, Rider, RiderFormSnapshot, RiderHealthStatus, RiderPotentials, RiderProgramRaceSummary, RiderRaceFormSource, RiderSeasonFormPhase, RiderSkillKey, RiderSkills, RiderStatsPayload, RiderStatsPointsByRaceFormat, RiderStatsPointsByTerrain, RiderStatsRaceBlock, RiderStatsRow, RiderStatsRowType, RiderStatsSeason, Role, SeasonPointAwardType, SeasonStandingCountryRow, SeasonStandingCountryRiderRow, SeasonStandingRow, SeasonStandingsPayload, Stage, StageClassification, StageMarkerCategory, StageMarkerClassification, StageNonFinisherRow, StageResultsPayload, StageScoringRule, Team, RaceSimMessage } from '../../../../shared/types';
import { SKILL_WEIGHT_RIDER_COLUMNS, SkillWeightRule } from '../../../../shared/skillWeights';
import { RESULT_TYPE_IDS, RACE_FORM_BUILD_SOURCE_AMOUNT, isMountainClassificationType, resolveMarkerResultsSortPriority, SEASON_POINT_AWARD_TYPES, RIDER_SKILL_COLUMNS, SEASON_FORM_RISE_DAYS, SEASON_FORM_FALL_DAYS, SEASON_FORM_MAX_RAW, SEASON_FORM_RISE_STEP_RAW, DIVISION_BY_TIER, RiderRow, RiderSeasonRaceStats, CareerRaceDaysSeasonRow, RaceProgramRow, RiderSeasonProgramRow, TeamRow, RaceRow, StageRow, StageResultsMetaRow, RuleRow, SkillWeightRow, StageEntryStatus, ResultTypeRow, StageResultDbRow, StageNonFinisherDbRow, StageMarkerResultDbRow, StageSeasonPointDbRow, StageTeamSeasonPointDbRow, SeasonPointStageRow, SeasonPointResultRow, RiderSeasonStandingDbRow, TeamSeasonStandingDbRow, CountrySeasonStandingDbRow, RiderStatsStageDbRow, RiderStatsFinalDbRow, emptyRiderStatsPointsByTerrain, emptyRiderStatsPointsByRaceFormat, resolveRiderStatsTerrainBucket, resolveDataCsvDir, parseCsvLine, parseRaceList, parseRankedValues, parsePeakDates, usesMountainStagePoints, resolveStageResultPointValues, isoDateToDayNumber, randomBetween, roundToTwoDecimals, addDaysIso, resolveStageRaceBaseFatigue, resolveStageRaceFatigueMalus, resolveEffectiveRecuperationSkill, resolvePeakPhase, resolveDeclineValue, resolveEffectiveSeasonForm, resolveProjectionPoint, resolveRiderSeasonFormPhase, tableExists, columnExists, mapSkillObject, mapCountry, mapRole, mapRider, mapTeam, mapRaceCategoryBonus, mapRaceCategory, mapSkillWeightRule, mapStage, loadFallbackStages, mapRace, buildRaceSelect, mapRaceProgram, mapRaceWithSummary } from '../mappers';
import { GameStateRepository } from './GameStateRepository';
import { RaceRepository } from './RaceRepository';
import { RiderRepository } from './RiderRepository';
import { TeamRepository } from './TeamRepository';


export class ResultRepository {
  private readonly db: Database.Database;

  public static readonly inMemoryStageEvents = new Map<number, RaceSimMessage[]>();

  public static clearInMemoryStageEvents(): void {
    ResultRepository.inMemoryStageEvents.clear();
  }

  constructor(db: Database.Database) {
    this.db = db;
  }

  public getSeasonRankForRider(season: number, riderId: number): number | null {
    if (!tableExists(this.db, 'season_point_events')) {
      return null;
    }

    const row = this.db.prepare(`
      WITH rankings AS (
        SELECT
          season_point_events.rider_id AS rider_id,
          RANK() OVER (ORDER BY SUM(season_point_events.points_awarded) DESC, riders.last_name ASC, riders.first_name ASC) as rank
        FROM season_point_events
        JOIN riders ON riders.id = season_point_events.rider_id
        WHERE season_point_events.season = ?
        GROUP BY season_point_events.rider_id, riders.last_name, riders.first_name
      )
      SELECT rank FROM rankings WHERE rider_id = ?
    `).get(season, riderId) as { rank: number } | undefined;

    return row?.rank ?? null;
  }

  private getAvailableStandingsSeasons(currentSeason: number): number[] {
    const seasons: number[] = [];
    for (let yr = 2026; yr <= currentSeason; yr++) {
      seasons.push(yr);
    }
    return seasons;
  }

  public getSeasonStandings(season = new GameStateRepository(this.db).getCurrentSeason()): SeasonStandingsPayload {
    const currentSeason = new GameStateRepository(this.db).getCurrentSeason();
    
    // Prüfen, ob wir einen Snapshot für ein historisches Jahr haben
    if (season < currentSeason && tableExists(this.db, 'season_standings_snapshots')) {
      const snapshotRow = this.db.prepare(`
        SELECT payload_json FROM season_standings_snapshots WHERE season = ?
      `).get(season) as { payload_json: string } | undefined;
      
      if (snapshotRow) {
        try {
          const payload = JSON.parse(snapshotRow.payload_json) as SeasonStandingsPayload;
          payload.availableSeasons = this.getAvailableStandingsSeasons(currentSeason);
          return payload;
        } catch (e) {
          // Fallback falls parsen fehlschlägt
        }
      }
    }

    if (!tableExists(this.db, 'season_point_events')) {
      return {
        season,
        riderStandings: [],
        teamStandings: [],
        countryStandings: [],
        availableSeasons: this.getAvailableStandingsSeasons(currentSeason),
      };
    }

    const riderRows = this.db.prepare(`
      SELECT
        season_point_events.rider_id AS rider_id,
        riders.first_name AS rider_first_name,
        riders.last_name AS rider_last_name,
        teams.id AS team_id,
        teams.name AS team_name,
        country.code_3 AS country_code_3,
        country.name AS country_name,
        SUM(season_point_events.points_awarded) AS points_total
      FROM season_point_events
      JOIN riders ON riders.id = season_point_events.rider_id
      JOIN sta_country country ON country.id = riders.country_id
      LEFT JOIN teams ON teams.id = riders.active_team_id
      WHERE season_point_events.season = ?
      GROUP BY season_point_events.rider_id, riders.first_name, riders.last_name, teams.id, teams.name, country.code_3, country.name
      ORDER BY points_total DESC, riders.last_name ASC, riders.first_name ASC
    `).all(season) as RiderSeasonStandingDbRow[];

    const teamRows = this.db.prepare(`
      SELECT
        season_point_events.team_id AS team_id,
        teams.name AS team_name,
        country.code_3 AS country_code_3,
        country.name AS country_name,
        SUM(season_point_events.points_awarded) AS points_total
      FROM season_point_events
      JOIN teams ON teams.id = season_point_events.team_id
      JOIN sta_country country ON country.id = teams.country_id
      JOIN races ON races.id = season_point_events.race_id
      WHERE season_point_events.season = ?
        AND races.category_id NOT IN (${CHAMPIONSHIP_CATEGORY_IDS.join(',')})
      GROUP BY season_point_events.team_id, teams.name, country.code_3, country.name
      ORDER BY points_total DESC, teams.name ASC
    `).all(season) as TeamSeasonStandingDbRow[];

    const countryRows = this.db.prepare(`
      SELECT
        country.code_3 AS country_code_3,
        country.name AS country_name,
        SUM(season_point_events.points_awarded) AS points_total
      FROM season_point_events
      JOIN riders ON riders.id = season_point_events.rider_id
      JOIN sta_country country ON country.id = riders.country_id
      WHERE season_point_events.season = ?
      GROUP BY country.code_3, country.name
      ORDER BY points_total DESC, country.name ASC
    `).all(season) as CountrySeasonStandingDbRow[];

    return {
      season,
      riderStandings: this.mapRiderSeasonStandings(riderRows),
      teamStandings: this.mapTeamSeasonStandings(teamRows),
      countryStandings: this.mapCountrySeasonStandings(countryRows, riderRows),
      availableSeasons: this.getAvailableStandingsSeasons(currentSeason),
      reigningChampions: this.getReigningChampions(),
    };
  }

  // Regierende Welt-/Europameister: je (Typ, Disziplin) der Sieger der juengsten
  // Edition. Speist die Champion-Marker in Ergebnissen, Top Results und Dashboard.
  private getReigningChampions(): Array<{ riderId: number; type: 'WM' | 'EM'; discipline: 'ITT' | 'ROAD'; season: number }> {
    if (!tableExists(this.db, 'championship_titles')) {
      return [];
    }
    return this.db.prepare(`
      SELECT ct.rider_id AS riderId, ct.championship_type AS type, ct.discipline AS discipline, ct.season AS season
      FROM championship_titles ct
      WHERE ct.season = (
        SELECT MAX(inner_ct.season)
        FROM championship_titles inner_ct
        WHERE inner_ct.championship_type = ct.championship_type
          AND inner_ct.discipline = ct.discipline
      )
    `).all() as Array<{ riderId: number; type: 'WM' | 'EM'; discipline: 'ITT' | 'ROAD'; season: number }>;
  }


  public getPreviousGcStandings(raceId: number, stageNumber: number): RealtimeGcStanding[] {
    if (!tableExists(this.db, 'results')) {
      return [];
    }

    const previousStage = this.db.prepare(`
      SELECT id AS stage_id, stage_number
      FROM stages
      WHERE race_id = ?
        AND stage_number < ?
      ORDER BY stage_number DESC
      LIMIT 1
    `).get(raceId, stageNumber) as { stage_id: number; stage_number: number } | undefined;
    if (!previousStage) {
      return [];
    }

    const prevPrevStage = this.db.prepare(`
      SELECT id AS stage_id
      FROM stages
      WHERE race_id = ?
        AND stage_number < ?
      ORDER BY stage_number DESC
      LIMIT 1
    `).get(raceId, previousStage.stage_number) as { stage_id: number } | undefined;

    const prevPrevRanks = new Map<number, number>();
    if (prevPrevStage) {
      const pRows = this.db.prepare(`
        SELECT rider_id, rank
        FROM all_results
        WHERE stage_id = ?
          AND result_type_id = ?
          AND rider_id IS NOT NULL
      `).all(prevPrevStage.stage_id, RESULT_TYPE_IDS.gc) as Array<{ rider_id: number; rank: number }>;
      for (const r of pRows) {
        prevPrevRanks.set(r.rider_id, r.rank);
      }
    }

    const rows = this.db.prepare(`
      SELECT rider_id, rank, time_seconds
      FROM all_results
      WHERE stage_id = ?
        AND result_type_id = ?
        AND rider_id IS NOT NULL
      ORDER BY rank ASC
    `).all(previousStage.stage_id, RESULT_TYPE_IDS.gc) as Array<{ rider_id: number; rank: number; time_seconds: number }>;
    const leaderTime = rows[0]?.time_seconds ?? 0;
    return rows.map((row) => {
      const prevRank = prevPrevRanks.get(row.rider_id) ?? null;
      return {
        riderId: row.rider_id,
        rank: row.rank,
        timeSeconds: row.time_seconds,
        gapSeconds: row.time_seconds - leaderTime,
        previousRank: prevRank,
        rankDelta: prevRank != null ? prevRank - row.rank : null,
      };
    });
  }


  public getPreviousGcStandingsForStage(stageId: number): RealtimeGcStanding[] {
    const stage = new RaceRepository(this.db).getStageById(stageId);
    if (!stage) {
      return [];
    }

    return this.getPreviousGcStandings(stage.raceId, stage.stageNumber);
  }


  public getPreviousPointsStandings(raceId: number, stageNumber: number): RealtimeClassificationStanding[] {
    return this.getPreviousClassificationStandings(raceId, stageNumber, RESULT_TYPE_IDS.points);
  }


  public getPreviousMountainStandings(raceId: number, stageNumber: number): RealtimeClassificationStanding[] {
    return this.getPreviousClassificationStandings(raceId, stageNumber, RESULT_TYPE_IDS.mountain);
  }


  public getPreviousYouthStandings(raceId: number, stageNumber: number): RealtimeClassificationStanding[] {
    return this.getPreviousClassificationStandings(raceId, stageNumber, RESULT_TYPE_IDS.youth);
  }


  public getPreviousClassificationLeaders(raceId: number, stageNumber: number): RealtimeClassificationLeaders {
    return {
      gcLeaderRiderId: this.getPreviousClassificationLeaderRiderId(raceId, stageNumber, RESULT_TYPE_IDS.gc),
      pointsLeaderRiderId: this.getPreviousClassificationLeaderRiderId(raceId, stageNumber, RESULT_TYPE_IDS.points),
      mountainLeaderRiderId: this.getPreviousClassificationLeaderRiderId(raceId, stageNumber, RESULT_TYPE_IDS.mountain),
      youthLeaderRiderId: this.getPreviousClassificationLeaderRiderId(raceId, stageNumber, RESULT_TYPE_IDS.youth),
    };
  }


  /**
   * Returns the actual roster of a race — all riders who started the race,
   * sourced from the race_entries table.
   * Also marks riders who have dropped out (DNF/OTL from stage_non_finishers).
   */
  public getRaceRoster(raceId: number): RaceRosterPayload | null {
    if (!tableExists(this.db, 'race_entries') || !tableExists(this.db, 'stages')) {
      return null;
    }

    // Check that race exists
    const raceRow = this.db.prepare(`
      SELECT races.id AS race_id, races.name AS race_name
      FROM races
      WHERE races.id = ?
    `).get(raceId) as { race_id: number; race_name: string } | undefined;
    if (!raceRow) return null;

    // Check if the race has actually started/has entries
    const entriesCountRow = this.db.prepare(`
      SELECT COUNT(*) AS count
      FROM race_entries
      WHERE race_id = ?
    `).get(raceId) as { count: number } | undefined;
    
    if (!entriesCountRow || entriesCountRow.count === 0) {
      return null;
    }

    // Get all riders registered in race_entries for this race
    type RosterDbRow = {
      rider_id: number;
      first_name: string;
      last_name: string;
      country_code: string | null;
      team_id: number | null;
      team_name: string | null;
      role_id: number | null;
      role_name: string | null;
      overall_rating: number;
      spec1_name: string | null;
      spec2_name: string | null;
    };

    const rosterRows = this.db.prepare(`
      SELECT DISTINCT
        riders.id AS rider_id,
        riders.first_name AS first_name,
        riders.last_name AS last_name,
        sta_country.code_3 AS country_code,
        teams.id AS team_id,
        teams.name AS team_name,
        role.id AS role_id,
        role.name AS role_name,
        riders.overall_rating AS overall_rating,
        specialization_1.type_key AS spec1_name,
        specialization_2.type_key AS spec2_name
      FROM race_entries
      JOIN riders ON riders.id = race_entries.rider_id
      LEFT JOIN sta_country ON sta_country.id = riders.country_id
      LEFT JOIN teams ON teams.id = race_entries.team_id
      LEFT JOIN sta_role role ON role.id = riders.role_id
      LEFT JOIN type_rider specialization_1 ON specialization_1.id = riders.specialization_1_id
      LEFT JOIN type_rider specialization_2 ON specialization_2.id = riders.specialization_2_id
      WHERE race_entries.race_id = ?
      ORDER BY teams.name ASC, riders.last_name ASC, riders.first_name ASC
    `).all(raceId) as RosterDbRow[];

    // Determine dropped riders: any rider with a row in stage_non_finishers for this race
    const droppedRiderIds = new Set<number>();
    if (tableExists(this.db, 'stage_non_finishers')) {
      type NonFinRow = { rider_id: number };
      const nonFinRows = this.db.prepare(`
        SELECT DISTINCT stage_non_finishers.rider_id AS rider_id
        FROM stage_non_finishers
        JOIN stages ON stages.id = stage_non_finishers.stage_id
        WHERE stages.race_id = ?
      `).all(raceId) as NonFinRow[];
      for (const r of nonFinRows) {
        droppedRiderIds.add(r.rider_id);
      }
    }

    // 1. Fetch GC Ranks efficiently: find the maximum stage number with GC results
    const maxStageRow = this.db.prepare(`
      SELECT MAX(stages.stage_number) AS max_stage_number
      FROM stages
      JOIN all_results r ON r.stage_id = stages.id
      WHERE stages.race_id = ? AND r.result_type_id = 2
    `).get(raceId) as { max_stage_number: number | null } | undefined;
    const maxStageNumber = maxStageRow?.max_stage_number ?? null;

    let gcRanksByRiderId = new Map<number, number>();
    if (maxStageNumber != null) {
      const maxStageIdRow = this.db.prepare(`
        SELECT id FROM stages WHERE race_id = ? AND stage_number = ?
      `).get(raceId, maxStageNumber) as { id: number } | undefined;
      
      if (maxStageIdRow) {
        const gcRanks = this.db.prepare(`
          SELECT rider_id, rank
          FROM all_results
          WHERE stage_id = ? AND result_type_id = 2 AND rider_id IS NOT NULL
        `).all(maxStageIdRow.id) as Array<{ rider_id: number; rank: number }>;
        
        gcRanksByRiderId = new Map(gcRanks.map(r => [r.rider_id, r.rank]));
      }
    }

    // 2. Fetch dropouts efficiently
    const dropouts = this.db.prepare(`
      SELECT rider_id, status, status_reason
      FROM all_stage_entries
      WHERE race_id = ? AND status IN ('dns', 'dnf')
    `).all(raceId) as Array<{ rider_id: number; status: string; status_reason: string | null }>;
    const dropoutByRiderId = new Map(dropouts.map(d => [d.rider_id, d]));

    const entries: RaceRosterEntry[] = rosterRows.map((row) => {
      const dropout = dropoutByRiderId.get(row.rider_id);
      const dropoutStatus = dropout?.status ?? null;
      const dropoutReason = dropout?.status_reason ?? null;
      const hasDropped = droppedRiderIds.has(row.rider_id) || dropoutStatus != null;
      const gcRank = gcRanksByRiderId.get(row.rider_id) ?? null;

      return {
        riderId: row.rider_id,
        firstName: row.first_name,
        lastName: row.last_name,
        countryCode: row.country_code,
        teamId: row.team_id,
        teamName: row.team_name,
        roleId: row.role_id,
        roleName: row.role_name,
        overallRating: row.overall_rating,
        specialization1: row.spec1_name,
        specialization2: row.spec2_name,
        hasDropped,
        gcRank: hasDropped ? null : gcRank,
        dropoutStatus: dropoutStatus as any,
        dropoutReason,
      };
    });

    return {
      raceId: raceRow.race_id,
      raceName: raceRow.race_name,
      entries,
    };
  }


  public getStageResults(stageId: number): StageResultsPayload | null {
    if (!tableExists(this.db, 'results') || !tableExists(this.db, 'result_types')) {
      return null;
    }

    const meta = this.db.prepare(`
      SELECT
        stages.id AS stage_id,
        stages.race_id AS race_id,
        races.name AS race_name,
        stages.stage_number AS stage_number,
        stages.date AS date,
        stages.profile AS profile,
        races.is_stage_race AS is_stage_race,
        races.number_of_stages AS number_of_stages,
        stages.rolled_weather_id AS rolled_weather_id,
        w.wetter_name AS rolled_wetter_name
      FROM stages
      JOIN races ON races.id = stages.race_id
      LEFT JOIN wetter w ON w.id = stages.rolled_weather_id
      WHERE stages.id = ?
    `).get(stageId) as (StageResultsMetaRow & { rolled_weather_id: number | null, rolled_wetter_name: string | null }) | undefined;
    if (!meta) return null;

    const resultTypes = this.db.prepare(`
      SELECT id, name
      FROM result_types
      ORDER BY id ASC
    `).all() as ResultTypeRow[];

    const rows = this.db.prepare(`
      SELECT
        results.result_type_id AS result_type_id,
        result_types.name AS result_type_name,
        results.rank AS rank,
        results.time_seconds AS time_seconds,
        results.points AS points,
        results.is_breakaway AS is_breakaway,
        results.rider_id AS rider_id,
        riders.first_name AS rider_first_name,
        riders.last_name AS rider_last_name,
        riders.birth_year AS birth_year,
        results.team_id AS team_id,
        teams.name AS team_name,
        results.leadout_rider_id AS leadout_rider_id,
        results.leadout_bonus AS leadout_bonus,
        results.breakaway_kms AS breakaway_kms,
        results.event_ids AS event_ids,
        results.jerseys_worn AS jerseys_worn,
        leadout_riders.last_name AS leadout_rider_last_name,
        leadout_countries.code_3 AS leadout_rider_country_code
      FROM all_results results
      JOIN result_types ON result_types.id = results.result_type_id
      LEFT JOIN riders ON riders.id = results.rider_id
      LEFT JOIN teams ON teams.id = results.team_id
      LEFT JOIN riders AS leadout_riders ON leadout_riders.id = results.leadout_rider_id
      LEFT JOIN sta_country AS leadout_countries ON leadout_countries.id = leadout_riders.country_id
      WHERE results.stage_id = ?
      ORDER BY results.result_type_id ASC, results.rank ASC
    `).all(stageId) as StageResultDbRow[];
    if (rows.length === 0) return null;

    const uciPointsByRiderAndAwardType = this.loadStageUciPointsByRiderAndAwardType(stageId);
    const uciPointsByTeamId = this.loadStageUciPointsByTeamId(stageId);
    const fullyClassifiedRiderIds = meta.is_stage_race === 1
      ? new Set(new GameStateRepository(this.db).getFullyClassifiedStageRaceRiderIds(meta.race_id, meta.stage_number))
      : null;
    const previousGcStandings = meta.stage_number > 1
      ? this.getPreviousGcStandingsForStage(stageId)
          .filter((standing) => fullyClassifiedRiderIds == null || fullyClassifiedRiderIds.has(standing.riderId))
      : [];

    const previousRanksByType = new Map<number, Map<string, number>>();
    if (meta.stage_number > 1) {
      const previousStage = this.db.prepare(`
        SELECT id AS stage_id, stage_number
        FROM stages
        WHERE race_id = ?
          AND stage_number < ?
        ORDER BY stage_number DESC
        LIMIT 1
      `).get(meta.race_id, meta.stage_number) as { stage_id: number; stage_number: number } | undefined;

      if (previousStage) {
        const prevPrevStage = this.db.prepare(`
          SELECT id AS stage_id
          FROM stages
          WHERE race_id = ?
            AND stage_number < ?
          ORDER BY stage_number DESC
          LIMIT 1
        `).get(meta.race_id, previousStage.stage_number) as { stage_id: number } | undefined;

        const prevPrevRanksByType = new Map<number, Map<string, number>>();
        if (prevPrevStage) {
          const pRows = this.db.prepare(`
            SELECT rider_id, team_id, rank, result_type_id
            FROM all_results
            WHERE stage_id = ?
              AND (rider_id IS NOT NULL OR team_id IS NOT NULL)
          `).all(prevPrevStage.stage_id) as Array<{ rider_id: number | null; team_id: number | null; rank: number; result_type_id: number }>;
          
          for (const r of pRows) {
            let typeMap = prevPrevRanksByType.get(r.result_type_id);
            if (!typeMap) {
              typeMap = new Map<string, number>();
              prevPrevRanksByType.set(r.result_type_id, typeMap);
            }
            const key = r.result_type_id === RESULT_TYPE_IDS.team && r.team_id != null
              ? `team_${r.team_id}`
              : (r.rider_id != null ? `rider_${r.rider_id}` : '');
            if (key) typeMap.set(key, r.rank);
          }
        }

        const prevRows = this.db.prepare(`
          SELECT rider_id, team_id, rank, time_seconds, points, result_type_id
          FROM all_results
          WHERE stage_id = ?
            AND (rider_id IS NOT NULL OR team_id IS NOT NULL)
          ORDER BY rank ASC
        `).all(previousStage.stage_id) as Array<{ rider_id: number | null; team_id: number | null; rank: number; time_seconds: number | null; points: number | null; result_type_id: number }>;

        const prevStandingsByType = new Map<number, Array<{ riderId: number | null; teamId: number | null; rank: number; points: number | null; timeSeconds: number | null; gapSeconds: number | null; previousRank: number | null; rankDelta: number | null }>>();
        
        const prevRowsByType = new Map<number, typeof prevRows>();
        for (const row of prevRows) {
          const bucket = prevRowsByType.get(row.result_type_id) ?? [];
          bucket.push(row);
          prevRowsByType.set(row.result_type_id, bucket);
        }

        for (const [rtId, rowsForType] of prevRowsByType.entries()) {
          const leaderTime = rowsForType.find((row) => row.time_seconds != null)?.time_seconds ?? null;
          const prevPrevMap = prevPrevRanksByType.get(rtId);
          
          const standings = rowsForType.map((row) => {
            const key = rtId === RESULT_TYPE_IDS.team && row.team_id != null
              ? `team_${row.team_id}`
              : (row.rider_id != null ? `rider_${row.rider_id}` : '');
            const prevRank = key && prevPrevMap ? (prevPrevMap.get(key) ?? null) : null;
            return {
              riderId: row.rider_id,
              teamId: row.team_id,
              rank: row.rank,
              points: row.points,
              timeSeconds: row.time_seconds,
              gapSeconds: row.time_seconds != null && leaderTime != null ? Math.max(0, row.time_seconds - leaderTime) : null,
              previousRank: prevRank,
              rankDelta: prevRank != null ? prevRank - row.rank : null,
            };
          });
          prevStandingsByType.set(rtId, standings);
        }

        for (const rt of resultTypes) {
          if (rt.id === RESULT_TYPE_IDS.stage) continue;
          const standings = prevStandingsByType.get(rt.id) ?? [];
          const rankMap = new Map<string, number>();
          for (const s of standings) {
            if (rt.id === RESULT_TYPE_IDS.team && s.teamId != null) {
              rankMap.set(`team_${s.teamId}`, s.rank);
            } else if (s.riderId != null && (fullyClassifiedRiderIds == null || fullyClassifiedRiderIds.has(s.riderId))) {
              rankMap.set(`rider_${s.riderId}`, s.rank);
            }
          }
          previousRanksByType.set(rt.id, rankMap);
        }
      }
    }

    const groupedRows = new Map<number, StageResultDbRow[]>();
    for (const row of rows) {
      const bucket = groupedRows.get(row.result_type_id) ?? [];
      bucket.push(row);
      groupedRows.set(row.result_type_id, bucket);
    }

    const classifications: StageClassification[] = resultTypes
      .map((resultType) => {
        let typeRows = groupedRows.get(resultType.id) ?? [];
        if (resultType.id === RESULT_TYPE_IDS.youth) {
          const gcRowsList = groupedRows.get(RESULT_TYPE_IDS.gc) ?? [];
          const season = Number.parseInt(meta.date.slice(0, 4), 10);
          typeRows = gcRowsList
            .filter((row) => row.birth_year != null && (season - row.birth_year) <= 25)
            .map((row, index) => ({
              ...row,
              result_type_id: RESULT_TYPE_IDS.youth,
              result_type_name: 'Youth',
              rank: index + 1
            }));
        }
        const shouldFilterCompletedRiders = fullyClassifiedRiderIds != null
          && (resultType.id === RESULT_TYPE_IDS.gc
            || resultType.id === RESULT_TYPE_IDS.points
            || resultType.id === RESULT_TYPE_IDS.mountain
            || resultType.id === RESULT_TYPE_IDS.youth
            || resultType.id === RESULT_TYPE_IDS.breakaway);
        const visibleRows = shouldFilterCompletedRiders
          ? typeRows.filter((row) => row.rider_id != null && fullyClassifiedRiderIds.has(row.rider_id))
          : typeRows;
        if (visibleRows.length === 0) {
          return null;
        }

        const leaderTime = visibleRows[0]?.time_seconds ?? null;
        const isGcClassification = resultType.id === RESULT_TYPE_IDS.gc;
        const mappedRows: RaceClassificationRow[] = visibleRows.map((row, index) => {
          const rankMap = previousRanksByType.get(resultType.id);
          const previousRank = rankMap
            ? (row.rider_id != null ? rankMap.get(`rider_${row.rider_id}`) : (row.team_id != null ? rankMap.get(`team_${row.team_id}`) : null)) ?? null
            : null;
          const displayRank = shouldFilterCompletedRiders ? index + 1 : row.rank;

          return {
            rank: displayRank,
            riderId: row.rider_id,
            riderName: row.rider_id == null
              ? null
              : `${row.rider_first_name ?? ''} ${row.rider_last_name ?? ''}`.trim(),
            teamId: row.team_id,
            teamName: row.team_name ?? '',
            isBreakaway: resultType.id === RESULT_TYPE_IDS.stage ? row.is_breakaway === 1 : false,
            timeSeconds: row.time_seconds,
            gapSeconds: leaderTime != null && row.time_seconds != null ? row.time_seconds - leaderTime : null,
            points: row.points,
            uciPoints: this.resolveStageRowUciPoints(meta, row, uciPointsByRiderAndAwardType, uciPointsByTeamId),
            previousRank: previousRank,
            rankDelta: previousRank != null ? previousRank - displayRank : null,
            leadoutRiderId: resultType.id === RESULT_TYPE_IDS.stage ? row.leadout_rider_id : null,
            leadoutBonus: resultType.id === RESULT_TYPE_IDS.stage ? row.leadout_bonus : null,
            leadoutRiderLastName: resultType.id === RESULT_TYPE_IDS.stage ? row.leadout_rider_last_name : null,
            leadoutRiderCountryCode: resultType.id === RESULT_TYPE_IDS.stage ? row.leadout_rider_country_code : null,
            breakawayKms: (resultType.id === RESULT_TYPE_IDS.stage || resultType.id === RESULT_TYPE_IDS.breakaway) ? row.breakaway_kms : null,
            eventIds: resultType.id === RESULT_TYPE_IDS.stage ? row.event_ids : null,
            jerseysWorn: resultType.id === RESULT_TYPE_IDS.stage ? row.jerseys_worn : null,
          };
        });

        return {
          resultTypeId: resultType.id,
          resultTypeName: resultType.name,
          rows: mappedRows,
        } satisfies StageClassification;
      })
      .filter((classification): classification is StageClassification => classification != null);

    return {
      raceId: meta.race_id,
      raceName: meta.race_name,
      stageId: meta.stage_id,
      stageNumber: meta.stage_number,
      date: meta.date,
      profile: meta.profile,
      resultTypes: resultTypes.map((resultType) => ({
        id: resultType.id,
        name: resultType.name,
      })) satisfies ResultType[],
      classifications,
      previousGcStandings,
      markerClassifications: tableExists(this.db, 'stage_marker_results')
        ? this.loadStageMarkerClassifications(stageId)
        : [],
      nonFinishers: this.loadStageNonFinishers(meta.race_id, meta.stage_number),
      events: ResultRepository.inMemoryStageEvents.get(stageId) ?? [],
      rolledWeatherId: meta.rolled_weather_id,
      rolledWetterName: meta.rolled_wetter_name,
    };
  }


  private loadStageNonFinishers(raceId: number, upToStageNumber: number): StageNonFinisherRow[] {
    if (!tableExists(this.db, 'stage_entries')) {
      return [];
    }

    const rows = this.db.prepare(`
      SELECT
        stage_entries.rider_id AS rider_id,
        riders.first_name AS rider_first_name,
        riders.last_name AS rider_last_name,
        stage_entries.team_id AS team_id,
        teams.name AS team_name,
        sta_country.code_3 AS country_code,
        stages.id AS stage_id,
        stages.stage_number AS stage_number,
        stage_entries.status AS status,
        stage_entries.status_reason AS status_reason
      FROM all_stage_entries stage_entries
      JOIN stages ON stages.id = stage_entries.stage_id
      JOIN riders ON riders.id = stage_entries.rider_id
      LEFT JOIN teams ON teams.id = stage_entries.team_id
      LEFT JOIN sta_country ON sta_country.id = riders.country_id
      WHERE stage_entries.race_id = ?
        AND stages.stage_number <= ?
        AND stage_entries.status = 'dnf'
      ORDER BY stages.stage_number ASC,
        CASE WHEN stage_entries.status_reason LIKE 'OTL %' THEN 0 ELSE 1 END ASC,
        teams.name ASC,
        riders.last_name ASC,
        riders.first_name ASC,
        riders.id ASC
    `).all(raceId, upToStageNumber) as StageNonFinisherDbRow[];

    return rows.map((row) => ({
      riderId: row.rider_id,
      riderName: `${row.rider_first_name ?? ''} ${row.rider_last_name ?? ''}`.trim(),
      teamId: row.team_id,
      teamName: row.team_name ?? '',
      countryCode: row.country_code ?? null,
      stageId: row.stage_id,
      stageNumber: row.stage_number,
      status: row.status,
      statusReason: row.status_reason,
      isOtl: row.status_reason?.startsWith('OTL ') ?? false,
    }));
  }


  private loadStageMarkerClassifications(stageId: number): StageMarkerClassification[] {
    const rows = this.db.prepare(`
      SELECT
        marker_key,
        marker_label,
        marker_type,
        marker_category,
        km_mark,
        rider_id,
        rank,
        crossing_time_seconds,
        gap_seconds,
        points_awarded,
        photo_finish_score
      FROM stage_marker_results
      WHERE stage_id = ?
      ORDER BY marker_key ASC, rank ASC
    `).all(stageId) as StageMarkerResultDbRow[];

    const grouped = new Map<string, StageMarkerResultDbRow[]>();
    for (const row of rows) {
      const bucket = grouped.get(row.marker_key) ?? [];
      bucket.push(row);
      grouped.set(row.marker_key, bucket);
    }

    return [...grouped.entries()].map(([markerKey, markerRows]) => ({
      markerKey,
      markerLabel: markerRows[0]?.marker_label ?? markerKey,
      markerType: markerRows[0]?.marker_type as StageMarkerClassification['markerType'],
      markerCategory: markerRows[0]?.marker_category ?? null,
      kmMark: markerRows[0]?.km_mark ?? 0,
      entries: markerRows.map((row) => ({
        riderId: row.rider_id,
        rank: row.rank,
        crossingTimeSeconds: row.crossing_time_seconds,
        gapSeconds: row.gap_seconds,
        pointsAwarded: row.points_awarded,
        photoFinishScore: row.photo_finish_score,
      })),
    })).sort((left, right) => (
      resolveMarkerResultsSortPriority(left) - resolveMarkerResultsSortPriority(right)
      || left.kmMark - right.kmMark
      || left.markerLabel.localeCompare(right.markerLabel, 'de')
      || left.markerKey.localeCompare(right.markerKey, 'de')
    ));
  }


  private loadStageUciPointsByRiderAndAwardType(stageId: number): Map<string, number> {
    if (!tableExists(this.db, 'season_point_events')) {
      return new Map();
    }

    const rows = this.db.prepare(`
      SELECT rider_id, award_type, SUM(points_awarded) AS points_total
      FROM season_point_events
      WHERE stage_id = ?
      GROUP BY rider_id, award_type
    `).all(stageId) as StageSeasonPointDbRow[];

    return new Map(
      rows.map((row) => [this.getStageUciPointKey(row.rider_id, row.award_type), row.points_total]),
    );
  }


  private loadStageUciPointsByTeamId(stageId: number): Map<number, number> {
    if (!tableExists(this.db, 'season_point_events')) {
      return new Map();
    }

    const rows = this.db.prepare(`
      SELECT team_id, SUM(points_awarded) AS points_total
      FROM season_point_events
      WHERE stage_id = ? AND team_id IS NOT NULL
        AND race_id NOT IN (SELECT id FROM races WHERE category_id IN (${CHAMPIONSHIP_CATEGORY_IDS.join(',')}))
      GROUP BY team_id
    `).all(stageId) as StageTeamSeasonPointDbRow[];

    return new Map(rows.map((row) => [row.team_id, row.points_total]));
  }


  private resolveStageRowUciPoints(
    meta: StageResultsMetaRow,
    row: StageResultDbRow,
    uciPointsByRiderAndAwardType: Map<string, number>,
    uciPointsByTeamId: Map<number, number>,
  ): number | null {
    if (row.result_type_id === RESULT_TYPE_IDS.team) {
      return row.team_id == null ? null : (uciPointsByTeamId.get(row.team_id) ?? 0);
    }

    if (row.rider_id == null) {
      return null;
    }

    const awardTypes = this.getAwardTypesForStageResult(meta, row.result_type_id);
    if (awardTypes.length === 0) {
      return 0;
    }

    return awardTypes.reduce(
      (sum, awardType) => sum + (uciPointsByRiderAndAwardType.get(this.getStageUciPointKey(row.rider_id as number, awardType)) ?? 0),
      0,
    );
  }


  private getAwardTypesForStageResult(meta: StageResultsMetaRow, resultTypeId: number): SeasonPointAwardType[] {
    if (meta.is_stage_race !== 1) {
      return resultTypeId === RESULT_TYPE_IDS.stage ? ['one_day_result'] : [];
    }

    switch (resultTypeId) {
      case RESULT_TYPE_IDS.stage:
        return ['stage_result'];
      case RESULT_TYPE_IDS.gc:
        return meta.stage_number === meta.number_of_stages ? ['gc_leader_day', 'gc_final'] : ['gc_leader_day'];
      case RESULT_TYPE_IDS.points:
        return meta.stage_number === meta.number_of_stages ? ['points_leader_day', 'points_final'] : ['points_leader_day'];
      case RESULT_TYPE_IDS.mountain:
        return meta.stage_number === meta.number_of_stages ? ['mountain_leader_day', 'mountain_final'] : ['mountain_leader_day'];
      case RESULT_TYPE_IDS.youth:
        return meta.stage_number === meta.number_of_stages ? ['youth_leader_day', 'youth_final'] : ['youth_leader_day'];
      default:
        return [];
    }
  }


  private getStageUciPointKey(riderId: number, awardType: SeasonPointAwardType): string {
    return `${riderId}:${awardType}`;
  }


  public loadSeasonPointResultRows(stageId: number, resultTypeId: number): SeasonPointResultRow[] {
    if (resultTypeId === RESULT_TYPE_IDS.youth) {
      const stageRow = this.db.prepare('SELECT date FROM stages WHERE id = ?').get(stageId) as { date: string } | undefined;
      if (!stageRow) return [];
      const season = Number.parseInt(stageRow.date.slice(0, 4), 10);
      
      const gcYouthRows = this.db.prepare(`
        SELECT 
          r.rider_id, 
          r.team_id
        FROM all_results r
        JOIN riders ON riders.id = r.rider_id
        WHERE r.stage_id = ? 
          AND r.result_type_id = ? 
          AND r.rider_id IS NOT NULL 
          AND (? - riders.birth_year) <= 25
        ORDER BY r.rank ASC
      `).all(stageId, RESULT_TYPE_IDS.gc, season) as Array<{ rider_id: number; team_id: number }>;

      return gcYouthRows.map((row, index) => ({
        rider_id: row.rider_id,
        team_id: row.team_id,
        rank: index + 1
      }));
    }

    return this.db.prepare(`
      SELECT rider_id, team_id, rank
      FROM all_results
      WHERE stage_id = ? AND result_type_id = ? AND rider_id IS NOT NULL AND team_id IS NOT NULL
      ORDER BY rank ASC
    `).all(stageId, resultTypeId) as SeasonPointResultRow[];
  }


  public insertSeasonPointAwards(
    insert: Database.Statement,
    season: number,
    stage: SeasonPointStageRow,
    awardType: SeasonPointAwardType,
    rows: SeasonPointResultRow[],
    pointValues: number[],
  ): void {
    pointValues.forEach((points, index) => {
      const row = rows[index];
      if (!row || points <= 0) {
        return;
      }

      insert.run(
        season,
        stage.race_id,
        stage.stage_id,
        row.rider_id,
        row.team_id,
        awardType,
        row.rank,
        points,
        stage.date,
      );
    });
  }


  public insertSeasonPointLeaderAward(
    insert: Database.Statement,
    season: number,
    stage: SeasonPointStageRow,
    awardType: SeasonPointAwardType,
    row: SeasonPointResultRow | undefined,
    points: number,
  ): void {
    if (!row || points <= 0) {
      return;
    }

    insert.run(
      season,
      stage.race_id,
      stage.stage_id,
      row.rider_id,
      row.team_id,
      awardType,
      row.rank,
      points,
      stage.date,
    );
  }


  private mapRiderSeasonStandings(rows: RiderSeasonStandingDbRow[]): SeasonStandingRow[] {
    const leaderPoints = rows[0]?.points_total ?? 0;
    return rows.map((row, index) => ({
      rank: index + 1,
      riderId: row.rider_id,
      riderName: `${row.rider_first_name} ${row.rider_last_name}`.trim(),
      teamId: row.team_id,
      teamName: row.team_name ?? '—',
      countryCode: row.country_code_3,
      countryName: row.country_name,
      points: row.points_total,
      gapPoints: leaderPoints - row.points_total,
    }));
  }


  private mapTeamSeasonStandings(rows: TeamSeasonStandingDbRow[]): SeasonStandingRow[] {
    const leaderPoints = rows[0]?.points_total ?? 0;
    return rows.map((row, index) => ({
      rank: index + 1,
      riderId: null,
      riderName: null,
      teamId: row.team_id,
      teamName: row.team_name,
      countryCode: row.country_code_3,
      countryName: row.country_name,
      points: row.points_total,
      gapPoints: leaderPoints - row.points_total,
    }));
  }


  private mapCountrySeasonStandings(rows: CountrySeasonStandingDbRow[], riderRows: RiderSeasonStandingDbRow[]): SeasonStandingCountryRow[] {
    const leaderPoints = rows[0]?.points_total ?? 0;
    const ridersByCountryCode = new Map<Nationality, SeasonStandingCountryRiderRow[]>();

    for (const row of riderRows) {
      const bucket = ridersByCountryCode.get(row.country_code_3) ?? [];
      bucket.push({
        rank: bucket.length + 1,
        riderId: row.rider_id,
        riderName: `${row.rider_first_name} ${row.rider_last_name}`.trim(),
        countryCode: row.country_code_3,
        points: row.points_total,
      });
      ridersByCountryCode.set(row.country_code_3, bucket);
    }

    return rows.map((row, index) => ({
      rank: index + 1,
      countryCode: row.country_code_3,
      countryName: row.country_name,
      points: row.points_total,
      gapPoints: leaderPoints - row.points_total,
      topRiders: (ridersByCountryCode.get(row.country_code_3) ?? []).slice(0, 20),
    }));
  }


  private getPreviousClassificationLeaderRiderId(raceId: number, stageNumber: number, resultTypeId: number): number | null {
    if (!tableExists(this.db, 'results')) {
      return null;
    }

    const previousStage = this.db.prepare(`
      SELECT id AS stage_id, date
      FROM stages
      WHERE race_id = ?
        AND stage_number < ?
      ORDER BY stage_number DESC
      LIMIT 1
    `).get(raceId, stageNumber) as { stage_id: number; date: string } | undefined;
    if (!previousStage) {
      return null;
    }

    if (resultTypeId === RESULT_TYPE_IDS.youth) {
      const season = Number.parseInt(previousStage.date.slice(0, 4), 10);
      const row = this.db.prepare(`
        SELECT r.rider_id
        FROM all_results r
        JOIN riders ON riders.id = r.rider_id
        WHERE r.stage_id = ?
          AND r.result_type_id = ?
          AND r.rider_id IS NOT NULL
          AND (? - riders.birth_year) <= 25
        ORDER BY r.rank ASC
        LIMIT 1
      `).get(previousStage.stage_id, RESULT_TYPE_IDS.gc, season) as { rider_id: number } | undefined;
      return row?.rider_id ?? null;
    }

    const row = this.db.prepare(`
      SELECT rider_id
      FROM all_results
      WHERE stage_id = ?
        AND result_type_id = ?
        AND rider_id IS NOT NULL
      ORDER BY rank ASC
      LIMIT 1
    `).get(previousStage.stage_id, resultTypeId) as { rider_id: number } | undefined;
    return row?.rider_id ?? null;
  }


  private getPreviousClassificationStandings(raceId: number, stageNumber: number, resultTypeId: number): RealtimeClassificationStanding[] {
    if (!tableExists(this.db, 'results')) {
      return [];
    }

    const previousStage = this.db.prepare(`
      SELECT id AS stage_id, stage_number, date
      FROM stages
      WHERE race_id = ?
        AND stage_number < ?
      ORDER BY stage_number DESC
      LIMIT 1
    `).get(raceId, stageNumber) as { stage_id: number; stage_number: number; date: string } | undefined;
    if (!previousStage) {
      return [];
    }

    const prevPrevStage = this.db.prepare(`
      SELECT id AS stage_id
      FROM stages
      WHERE race_id = ?
        AND stage_number < ?
      ORDER BY stage_number DESC
      LIMIT 1
    `).get(raceId, previousStage.stage_number) as { stage_id: number } | undefined;

    if (resultTypeId === RESULT_TYPE_IDS.youth) {
      const season = Number.parseInt(previousStage.date.slice(0, 4), 10);
      const prevPrevRanks = new Map<number, number>();
      if (prevPrevStage) {
        const pRows = this.db.prepare(`
          SELECT r.rider_id
          FROM all_results r
          JOIN riders ON riders.id = r.rider_id
          WHERE r.stage_id = ?
            AND r.result_type_id = ?
            AND r.rider_id IS NOT NULL
            AND (? - riders.birth_year) <= 25
          ORDER BY r.rank ASC
        `).all(prevPrevStage.stage_id, RESULT_TYPE_IDS.gc, season) as Array<{ rider_id: number }>;
        for (let i = 0; i < pRows.length; i++) {
          prevPrevRanks.set(pRows[i].rider_id, i + 1);
        }
      }

      const rows = this.db.prepare(`
        SELECT r.rider_id, r.team_id, r.time_seconds, r.points
        FROM all_results r
        JOIN riders ON riders.id = r.rider_id
        WHERE r.stage_id = ?
          AND r.result_type_id = ?
          AND r.rider_id IS NOT NULL
          AND (? - riders.birth_year) <= 25
        ORDER BY r.rank ASC
      `).all(previousStage.stage_id, RESULT_TYPE_IDS.gc, season) as Array<{ rider_id: number; team_id: number | null; time_seconds: number | null; points: number | null }>;
      const leaderTime = rows.find((row) => row.time_seconds != null)?.time_seconds ?? null;

      return rows.map((row, index) => {
        const u25Rank = index + 1;
        const prevRank = prevPrevRanks.get(row.rider_id) ?? null;
        return {
          riderId: row.rider_id,
          teamId: row.team_id,
          rank: u25Rank,
          points: row.points,
          timeSeconds: row.time_seconds,
          gapSeconds: row.time_seconds != null && leaderTime != null ? Math.max(0, row.time_seconds - leaderTime) : null,
          previousRank: prevRank,
          rankDelta: prevRank != null ? prevRank - u25Rank : null,
        };
      });
    }

    const prevPrevRanks = new Map<string, number>();
    if (prevPrevStage) {
      const pRows = this.db.prepare(`
        SELECT rider_id, team_id, rank
        FROM all_results
        WHERE stage_id = ?
          AND result_type_id = ?
          AND (rider_id IS NOT NULL OR team_id IS NOT NULL)
      `).all(prevPrevStage.stage_id, resultTypeId) as Array<{ rider_id: number | null; team_id: number | null; rank: number }>;
      for (const r of pRows) {
        if (resultTypeId === RESULT_TYPE_IDS.team && r.team_id != null) {
          prevPrevRanks.set(`team_${r.team_id}`, r.rank);
        } else if (r.rider_id != null) {
          prevPrevRanks.set(`rider_${r.rider_id}`, r.rank);
        }
      }
    }

    const rows = this.db.prepare(`
      SELECT rider_id, team_id, rank, time_seconds, points
      FROM all_results
      WHERE stage_id = ?
        AND result_type_id = ?
        AND (rider_id IS NOT NULL OR team_id IS NOT NULL)
      ORDER BY rank ASC
    `).all(previousStage.stage_id, resultTypeId) as Array<{ rider_id: number | null; team_id: number | null; rank: number; time_seconds: number | null; points: number | null }>;
    const leaderTime = rows.find((row) => row.time_seconds != null)?.time_seconds ?? null;

    return rows.map((row) => {
      const key = resultTypeId === RESULT_TYPE_IDS.team && row.team_id != null
        ? `team_${row.team_id}`
        : (row.rider_id != null ? `rider_${row.rider_id}` : '');
      const prevRank = key ? (prevPrevRanks.get(key) ?? null) : null;
      return {
        riderId: row.rider_id,
        teamId: row.team_id,
        rank: row.rank,
        points: row.points,
        timeSeconds: row.time_seconds,
        gapSeconds: row.time_seconds != null && leaderTime != null ? Math.max(0, row.time_seconds - leaderTime) : null,
        previousRank: prevRank,
        rankDelta: prevRank != null ? prevRank - row.rank : null,
      };
    });
  }

}
