import { summarizeStageProfile } from '../../simulation/StageParser';
import Database from 'better-sqlite3';
import { Country, FormDebugPoint, Nationality, PrecalculatedRaceIncident, Race, RaceCategory, RaceCategoryBonus, RaceClassificationRow, RaceProgram, RaceProgramParticipant, RaceStageSummary, RealtimeClassificationLeaders, RealtimeClassificationStanding, RealtimeGcStanding, ResultType, Rider, RiderFormSnapshot, RiderHealthStatus, RiderPotentials, RiderProgramRaceSummary, RiderRaceFormSource, RiderSeasonFormPhase, RiderSkillKey, RiderSkills, RiderStatsPayload, RiderStatsPointsByRaceFormat, RiderStatsPointsByTerrain, RiderStatsRaceBlock, RiderStatsRow, RiderStatsRowType, RiderStatsSeason, Role, SeasonPointAwardType, SeasonStandingCountryRow, SeasonStandingCountryRiderRow, SeasonStandingRow, SeasonStandingsPayload, Stage, StageClassification, StageMarkerCategory, StageMarkerClassification, StageNonFinisherRow, StageResultsPayload, StageScoringRule, Team } from '../../../../shared/types';
import { SKILL_WEIGHT_RIDER_COLUMNS, SkillWeightRule } from '../../../../shared/skillWeights';
import { RESULT_TYPE_IDS, RACE_FORM_BUILD_SOURCE_AMOUNT, isMountainClassificationType, resolveMarkerResultsSortPriority, SEASON_POINT_AWARD_TYPES, RIDER_SKILL_COLUMNS, SEASON_FORM_RISE_DAYS, SEASON_FORM_FALL_DAYS, SEASON_FORM_MAX_RAW, SEASON_FORM_RISE_STEP_RAW, DIVISION_BY_TIER, RiderRow, RiderSeasonRaceStats, CareerRaceDaysSeasonRow, RaceProgramRow, RiderSeasonProgramRow, TeamRow, RaceRow, StageRow, StageResultsMetaRow, RuleRow, SkillWeightRow, StageEntryStatus, ResultTypeRow, StageResultDbRow, StageNonFinisherDbRow, StageMarkerResultDbRow, StageSeasonPointDbRow, StageTeamSeasonPointDbRow, SeasonPointStageRow, SeasonPointResultRow, RiderSeasonStandingDbRow, TeamSeasonStandingDbRow, CountrySeasonStandingDbRow, RiderStatsStageDbRow, RiderStatsFinalDbRow, emptyRiderStatsPointsByTerrain, emptyRiderStatsPointsByRaceFormat, resolveRiderStatsTerrainBucket, resolveDataCsvDir, parseCsvLine, parseRaceList, parseRankedValues, parsePeakDates, usesMountainStagePoints, resolveStageResultPointValues, isoDateToDayNumber, randomBetween, roundToTwoDecimals, addDaysIso, resolveStageRaceBaseFatigue, resolveStageRaceFatigueMalus, resolveEffectiveRecuperationSkill, resolvePeakPhase, resolveDeclineValue, resolveEffectiveSeasonForm, resolveProjectionPoint, resolveRiderSeasonFormPhase, tableExists, columnExists, mapSkillObject, mapCountry, mapRole, mapRider, mapTeam, mapRaceCategoryBonus, mapRaceCategory, mapSkillWeightRule, mapStage, loadFallbackStages, mapRace, buildRaceSelect, mapRaceProgram, mapRaceWithSummary } from '../mappers';
import { GameStateRepository } from './GameStateRepository';
import { RaceRepository } from './RaceRepository';
import { RiderRepository } from './RiderRepository';
import { TeamRepository } from './TeamRepository';


export class ResultRepository {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }


  public getSeasonStandings(season = new GameStateRepository(this.db).getCurrentSeason()): SeasonStandingsPayload {
    new GameStateRepository(this.db).syncSeasonPointEventsForSeason(season);
    if (!tableExists(this.db, 'season_point_events')) {
      return {
        season,
        riderStandings: [],
        teamStandings: [],
        countryStandings: [],
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
      WHERE season_point_events.season = ?
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
    };
  }


  public getPreviousGcStandings(raceId: number, stageNumber: number): RealtimeGcStanding[] {
    if (!tableExists(this.db, 'results')) {
      return [];
    }

    const previousStage = this.db.prepare(`
      SELECT stages.id AS stage_id
      FROM stages
      JOIN results ON results.stage_id = stages.id
      WHERE stages.race_id = ?
        AND stages.stage_number < ?
        AND results.result_type_id = ?
      GROUP BY stages.id, stages.stage_number
      ORDER BY stages.stage_number DESC
      LIMIT 1
    `).get(raceId, stageNumber, RESULT_TYPE_IDS.gc) as { stage_id: number } | undefined;
    if (!previousStage) {
      return [];
    }

    const rows = this.db.prepare(`
      SELECT rider_id, rank, time_seconds
      FROM results
      WHERE stage_id = ?
        AND result_type_id = ?
        AND rider_id IS NOT NULL
      ORDER BY rank ASC
    `).all(previousStage.stage_id, RESULT_TYPE_IDS.gc) as Array<{ rider_id: number; rank: number; time_seconds: number }>;
    const leaderTime = rows[0]?.time_seconds ?? 0;
    return rows.map((row) => ({
      riderId: row.rider_id,
      rank: row.rank,
      timeSeconds: row.time_seconds,
      gapSeconds: row.time_seconds - leaderTime,
    }));
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
        races.number_of_stages AS number_of_stages
      FROM stages
      JOIN races ON races.id = stages.race_id
      WHERE stages.id = ?
    `).get(stageId) as StageResultsMetaRow | undefined;
    if (!meta) return null;

    const season = Number.parseInt(meta.date.slice(0, 4), 10);
    if (Number.isFinite(season)) {
      new GameStateRepository(this.db).syncSeasonPointEventsForSeason(season);
    }

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
        results.team_id AS team_id,
        teams.name AS team_name
      FROM results
      JOIN result_types ON result_types.id = results.result_type_id
      LEFT JOIN riders ON riders.id = results.rider_id
      LEFT JOIN teams ON teams.id = results.team_id
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
    const previousGcRanks = previousGcStandings.length > 0
      ? new Map(
          previousGcStandings.map((standing) => [standing.riderId, standing.rank] as const),
        )
      : new Map<number, number>();

    const groupedRows = new Map<number, StageResultDbRow[]>();
    for (const row of rows) {
      const bucket = groupedRows.get(row.result_type_id) ?? [];
      bucket.push(row);
      groupedRows.set(row.result_type_id, bucket);
    }

    const classifications: StageClassification[] = resultTypes
      .map((resultType) => {
        const typeRows = groupedRows.get(resultType.id) ?? [];
        const shouldFilterCompletedRiders = fullyClassifiedRiderIds != null
          && (resultType.id === RESULT_TYPE_IDS.gc
            || resultType.id === RESULT_TYPE_IDS.points
            || resultType.id === RESULT_TYPE_IDS.mountain
            || resultType.id === RESULT_TYPE_IDS.youth);
        const visibleRows = shouldFilterCompletedRiders
          ? typeRows.filter((row) => row.rider_id != null && fullyClassifiedRiderIds.has(row.rider_id))
          : typeRows;
        if (visibleRows.length === 0) {
          return null;
        }

        const leaderTime = visibleRows[0]?.time_seconds ?? null;
        const isGcClassification = resultType.id === RESULT_TYPE_IDS.gc;
        const mappedRows: RaceClassificationRow[] = visibleRows.map((row, index) => {
          const previousGcRank = isGcClassification && row.rider_id != null
            ? previousGcRanks.get(row.rider_id) ?? null
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
            gcPreviousRank: isGcClassification ? previousGcRank : undefined,
            gcRankDelta: isGcClassification && previousGcRank != null ? previousGcRank - displayRank : null,
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
      FROM stage_entries
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
    return this.db.prepare(`
      SELECT rider_id, team_id, rank
      FROM results
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
      SELECT stages.id AS stage_id
      FROM stages
      JOIN results ON results.stage_id = stages.id
      WHERE stages.race_id = ?
        AND stages.stage_number < ?
        AND results.result_type_id = ?
      GROUP BY stages.id, stages.stage_number
      ORDER BY stages.stage_number DESC
      LIMIT 1
    `).get(raceId, stageNumber, resultTypeId) as { stage_id: number } | undefined;
    if (!previousStage) {
      return null;
    }

    const row = this.db.prepare(`
      SELECT rider_id
      FROM results
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
      SELECT stages.id AS stage_id
      FROM stages
      JOIN results ON results.stage_id = stages.id
      WHERE stages.race_id = ?
        AND stages.stage_number < ?
        AND results.result_type_id = ?
      GROUP BY stages.id, stages.stage_number
      ORDER BY stages.stage_number DESC
      LIMIT 1
    `).get(raceId, stageNumber, resultTypeId) as { stage_id: number } | undefined;
    if (!previousStage) {
      return [];
    }

    const rows = this.db.prepare(`
      SELECT rider_id, rank, time_seconds, points
      FROM results
      WHERE stage_id = ?
        AND result_type_id = ?
        AND rider_id IS NOT NULL
      ORDER BY rank ASC
    `).all(previousStage.stage_id, resultTypeId) as Array<{ rider_id: number; rank: number; time_seconds: number | null; points: number | null }>;
    const leaderTime = rows.find((row) => row.time_seconds != null)?.time_seconds ?? null;

    return rows.map((row) => ({
      riderId: row.rider_id,
      rank: row.rank,
      points: row.points,
      timeSeconds: row.time_seconds,
      gapSeconds: row.time_seconds != null && leaderTime != null ? Math.max(0, row.time_seconds - leaderTime) : null,
    }));
  }

}
