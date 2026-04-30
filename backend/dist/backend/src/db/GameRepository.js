"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRepository = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const StageParser_1 = require("../simulation/StageParser");
const RESULT_TYPE_IDS = {
    stage: 1,
    gc: 2,
    points: 3,
    mountain: 4,
    youth: 5,
    team: 6,
};
const SEASON_POINT_AWARD_TYPES = [
    'stage_result',
    'one_day_result',
    'gc_leader_day',
    'points_leader_day',
    'mountain_leader_day',
    'youth_leader_day',
    'gc_final',
    'points_final',
    'mountain_final',
    'youth_final',
];
const RIDER_SKILL_COLUMNS = [
    ['flat', 'flat'],
    ['mountain', 'mountain'],
    ['mediumMountain', 'medium_mountain'],
    ['hill', 'hill'],
    ['timeTrial', 'time_trial'],
    ['prologue', 'prologue'],
    ['cobble', 'cobble'],
    ['sprint', 'sprint'],
    ['acceleration', 'acceleration'],
    ['downhill', 'downhill'],
    ['attack', 'attack'],
    ['stamina', 'stamina'],
    ['resistance', 'resistance'],
    ['recuperation', 'recuperation'],
    ['bikeHandling', 'bike_handling'],
];
function resolveDataCsvDir() {
    const candidates = [
        path.resolve(__dirname, '..', '..', '..', 'data', 'csv'),
        path.resolve(__dirname, '..', '..', '..', '..', 'data', 'csv'),
        path.resolve(process.cwd(), 'data', 'csv'),
    ];
    for (const candidate of candidates) {
        if (fs.existsSync(path.join(candidate, 'stages.csv'))) {
            return candidate;
        }
    }
    return candidates[0];
}
function parseCsvLine(line) {
    const cells = [];
    let current = '';
    let inQuotes = false;
    for (let index = 0; index < line.length; index += 1) {
        const char = line[index];
        const next = line[index + 1];
        if (char === '"') {
            if (inQuotes && next === '"') {
                current += '"';
                index += 1;
            }
            else {
                inQuotes = !inQuotes;
            }
            continue;
        }
        if (char === ',' && !inQuotes) {
            cells.push(current.trim());
            current = '';
            continue;
        }
        current += char;
    }
    cells.push(current.trim());
    return cells;
}
function parseRaceList(value) {
    if (!value.trim())
        return [];
    return value.split(',').map(part => Number.parseInt(part.trim(), 10)).filter(Number.isFinite);
}
function parseRankedValues(value) {
    if (!value.trim())
        return [];
    return value.split('|').map((part) => Number.parseInt(part.trim(), 10)).filter(Number.isFinite);
}
function tableExists(db, tableName) {
    const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName);
    return row != null;
}
function mapSkillObject(row, prefix = '') {
    const entries = RIDER_SKILL_COLUMNS.map(([key, column]) => [key, row[`${prefix}${column}`]]);
    return Object.fromEntries(entries);
}
function mapCountry(row) {
    return {
        id: row.country_id,
        name: row.country_name,
        code3: row.country_code_3,
        continent: row.country_continent,
        regenRating: row.country_regen_rating,
        numberRegenMin: row.country_number_regen_min,
        numberRegenMax: row.country_number_regen_max,
    };
}
function mapRole(row) {
    if (row.role_id == null || row.role_name == null || row.role_weighting == null) {
        return undefined;
    }
    return {
        id: row.role_id,
        name: row.role_name,
        weighting: row.role_weighting,
    };
}
function mapRider(row, currentYear, seasonPoints = 0) {
    const country = mapCountry(row);
    const role = mapRole(row);
    return {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        nationality: country.code3,
        countryId: country.id,
        country,
        riderTypeId: row.rider_type_id,
        specialization1Id: row.specialization_1_id,
        specialization2Id: row.specialization_2_id,
        specialization3Id: row.specialization_3_id,
        birthYear: row.birth_year,
        peakAge: row.peak_age,
        declineAge: row.decline_age,
        retirementAge: row.retirement_age,
        skillDevelopment: row.skill_development,
        roleId: row.role_id,
        role,
        age: currentYear - row.birth_year,
        potential: row.pot_overall,
        overallRating: row.overall_rating,
        skills: mapSkillObject(row, 'skill_'),
        potentials: mapSkillObject(row, 'pot_'),
        riderType: row.rider_type,
        specialization1: row.specialization_1,
        specialization2: row.specialization_2,
        specialization3: row.specialization_3,
        isStageRacer: row.is_stage_racer === 1,
        isOneDayRacer: row.is_one_day_racer === 1,
        hasGrandTourTag: row.has_grand_tour_tag === 1,
        hasStageRaceTag: row.has_stage_race_tag === 1,
        hasOneDayClassicTag: row.has_one_day_classic_tag === 1,
        favoriteRaces: parseRaceList(row.favorite_races),
        nonFavoriteRaces: parseRaceList(row.non_favorite_races),
        activeTeamId: row.active_team_id,
        activeContractId: row.active_contract_id,
        contractEndSeason: row.contract_end_season,
        seasonPoints,
    };
}
function mapTeam(row) {
    const country = mapCountry(row);
    return {
        id: row.id,
        name: row.name,
        abbreviation: row.abbreviation,
        divisionId: row.division_id,
        u23TeamId: row.u23_team,
        mainTeamId: row.main_team_id,
        isPlayerTeam: row.is_player_team === 1,
        countryCode: country.code3,
        countryId: country.id,
        country,
        colorPrimary: row.color_primary,
        colorSecondary: row.color_secondary,
        aiFocus1: row.ai_focus_1,
        aiFocus2: row.ai_focus_2,
        aiFocus3: row.ai_focus_3,
        u23TeamName: row.u23_team_name ?? undefined,
        mainTeamName: row.main_team_name ?? undefined,
        divisionName: row.division_name,
        shortName: row.abbreviation,
        nationality: country.code3,
        division: row.division_name,
    };
}
function mapRaceCategoryBonus(row) {
    return {
        id: row.category_bonus_system_id,
        name: row.bonus_name,
        bonusSecondsFinal: row.bonus_seconds_final,
        bonusSecondsIntermediate: row.bonus_seconds_intermediate,
        pointsStage: row.points_stage,
        pointsOneDay: row.points_one_day,
        pointsGcFinal: row.points_gc_final,
        pointsJerseyLeaderDay: row.points_jersey_leader_day,
        pointsJerseySprintDay: row.points_jersey_sprint_day,
        pointsJerseyMountainDay: row.points_jersey_mountain_day,
        pointsJerseyYouthDay: row.points_jersey_youth_day,
        pointsSprintIntermediate: row.points_sprint_intermediate,
        pointsMountainHc: row.points_mountain_hc,
        pointsMountainCat1: row.points_mountain_cat1,
        pointsMountainCat2: row.points_mountain_cat2,
        pointsMountainCat3: row.points_mountain_cat3,
        pointsMountainCat4: row.points_mountain_cat4,
        pointsJerseySprintFinal: row.points_jersey_sprint_final,
        pointsJerseyMountainFinal: row.points_jersey_mountain_final,
        pointsJerseyYouthFinal: row.points_jersey_youth_final,
    };
}
function mapRaceCategory(row) {
    const bonusSystem = mapRaceCategoryBonus(row);
    return {
        id: row.category_id,
        name: row.category_name,
        tier: row.category_tier,
        numberOfTeams: row.category_number_of_teams,
        numberOfRiders: row.category_number_of_riders,
        bonusSystemId: row.category_bonus_system_id,
        bonusSystem,
    };
}
function mapStage(row) {
    return {
        id: row.id,
        raceId: row.race_id,
        stageNumber: row.stage_number,
        date: row.date,
        profile: row.profile,
        detailsCsvFile: row.details_csv_file,
    };
}
function loadFallbackStages(raceIds) {
    if (raceIds.length === 0)
        return [];
    const filePath = path.join(resolveDataCsvDir(), 'stages.csv');
    if (!fs.existsSync(filePath))
        return [];
    const lines = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').trim().split(/\r?\n/);
    if (lines.length <= 1)
        return [];
    const headers = parseCsvLine(lines[0]);
    return lines.slice(1)
        .map((line) => {
        const values = parseCsvLine(line);
        const record = headers.reduce((acc, header, index) => {
            acc[header] = values[index] ?? '';
            return acc;
        }, {});
        return {
            id: Number(record['id']),
            race_id: Number(record['race_id']),
            stage_number: Number(record['stage_number']),
            date: record['date'] ?? '',
            profile: record['profile'],
            details_csv_file: record['details_csv_file'] ?? '',
        };
    })
        .filter((row) => raceIds.includes(row.race_id) && Number.isFinite(row.id) && Number.isFinite(row.race_id));
}
function mapRace(row, stages) {
    const country = mapCountry(row);
    const category = mapRaceCategory(row);
    return {
        id: row.id,
        name: row.name,
        countryId: row.country_id,
        categoryId: row.category_id,
        isStageRace: row.is_stage_race === 1,
        numberOfStages: row.number_of_stages,
        startDate: row.start_date,
        endDate: row.end_date,
        prestige: row.prestige,
        country,
        category,
        stages,
    };
}
function mapRaceWithSummary(row, stages, upcomingStage) {
    return {
        ...mapRace(row, stages),
        ...(upcomingStage ? { upcomingStage } : {}),
    };
}
function buildRaceSelect() {
    return `
    SELECT races.*,
           country.name AS country_name,
           country.code_3 AS country_code_3,
           country.continent AS country_continent,
           country.regen_rating AS country_regen_rating,
           country.number_regen_min AS country_number_regen_min,
           country.number_regen_max AS country_number_regen_max,
           race_categories.name AS category_name,
           race_categories.tier AS category_tier,
           race_categories.number_of_teams AS category_number_of_teams,
           race_categories.number_of_riders AS category_number_of_riders,
           race_categories.bonus_system_id AS category_bonus_system_id,
           race_categories_bonus.name AS bonus_name,
           race_categories_bonus.bonus_seconds_final,
           race_categories_bonus.bonus_seconds_intermediate,
           race_categories_bonus.points_stage,
           race_categories_bonus.points_one_day,
           race_categories_bonus.points_gc_final,
           race_categories_bonus.points_jersey_leader_day,
           race_categories_bonus.points_jersey_sprint_day,
           race_categories_bonus.points_jersey_mountain_day,
           race_categories_bonus.points_jersey_youth_day,
           race_categories_bonus.points_sprint_intermediate,
           race_categories_bonus.points_mountain_hc,
           race_categories_bonus.points_mountain_cat1,
           race_categories_bonus.points_mountain_cat2,
           race_categories_bonus.points_mountain_cat3,
           race_categories_bonus.points_mountain_cat4,
           race_categories_bonus.points_jersey_sprint_final,
           race_categories_bonus.points_jersey_mountain_final,
           race_categories_bonus.points_jersey_youth_final
    FROM races
    JOIN sta_country country ON country.id = races.country_id
    JOIN race_categories ON race_categories.id = races.category_id
    JOIN race_categories_bonus ON race_categories_bonus.id = race_categories.bonus_system_id
  `;
}
class GameRepository {
    constructor(db) {
        this.db = db;
    }
    getCurrentSeason() {
        const row = this.db
            .prepare('SELECT season FROM game_state WHERE id = 1')
            .get();
        if (row)
            return row.season;
        const legacy = this.db
            .prepare(`SELECT value FROM career_meta WHERE key = 'current_season'`)
            .get();
        return legacy ? Number(legacy.value) : 2026;
    }
    getCurrentDate() {
        const row = this.db
            .prepare('SELECT current_date FROM game_state WHERE id = 1')
            .get();
        if (row?.current_date)
            return row.current_date;
        return `${this.getCurrentSeason()}-01-01`;
    }
    getRidersQuery(useContracts, filterByTeam) {
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
      country.number_regen_max AS country_number_regen_max
    `;
        if (!useContracts) {
            return filterByTeam
                ? `SELECT ${countrySelect}, NULL AS contract_end_season FROM riders JOIN sta_country country ON country.id = riders.country_id LEFT JOIN sta_role role ON role.id = riders.role_id LEFT JOIN type_rider rider_type ON rider_type.id = riders.rider_type_id LEFT JOIN type_rider specialization_1 ON specialization_1.id = riders.specialization_1_id LEFT JOIN type_rider specialization_2 ON specialization_2.id = riders.specialization_2_id LEFT JOIN type_rider specialization_3 ON specialization_3.id = riders.specialization_3_id WHERE active_team_id = ? AND is_retired = 0 ORDER BY overall_rating DESC`
                : `SELECT ${countrySelect}, NULL AS contract_end_season FROM riders JOIN sta_country country ON country.id = riders.country_id LEFT JOIN sta_role role ON role.id = riders.role_id LEFT JOIN type_rider rider_type ON rider_type.id = riders.rider_type_id LEFT JOIN type_rider specialization_1 ON specialization_1.id = riders.specialization_1_id LEFT JOIN type_rider specialization_2 ON specialization_2.id = riders.specialization_2_id LEFT JOIN type_rider specialization_3 ON specialization_3.id = riders.specialization_3_id WHERE is_retired = 0 ORDER BY overall_rating DESC`;
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
      ${activeContractJoin}
    `;
        return filterByTeam
            ? `${selectWithResolvedContract} WHERE COALESCE(current_contract.team_id, riders.active_team_id) = ? AND riders.is_retired = 0 ORDER BY riders.overall_rating DESC`
            : `${selectWithResolvedContract} WHERE riders.is_retired = 0 ORDER BY riders.overall_rating DESC`;
    }
    getRiders(teamId) {
        const season = this.getCurrentSeason();
        this.syncSeasonPointEventsForSeason(season);
        const useContracts = tableExists(this.db, 'contracts');
        const rows = teamId != null
            ? (useContracts
                ? this.db.prepare(this.getRidersQuery(true, true)).all(season, season, teamId)
                : this.db.prepare(this.getRidersQuery(false, true)).all(teamId))
            : (useContracts
                ? this.db.prepare(this.getRidersQuery(true, false)).all(season, season)
                : this.db.prepare(this.getRidersQuery(false, false)).all());
        const seasonPointsByRiderId = this.getSeasonPointsByRiderId(season);
        return rows.map((row) => mapRider(row, season, seasonPointsByRiderId.get(row.id) ?? 0));
    }
    getRiderById(id) {
        const season = this.getCurrentSeason();
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
      WHERE riders.id = ?
    `).get(id);
        return row ? mapRider(row, season) : null;
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
        return rows.map(mapTeam);
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
        return row ? mapTeam(row) : null;
    }
    getRaces(season) {
        const requestedSeason = season ?? this.getCurrentSeason();
        const currentDate = this.getCurrentDate();
        const rows = this.db.prepare(`
      ${buildRaceSelect()}
      WHERE CAST(substr(races.start_date, 1, 4) AS INTEGER) = ?
      ORDER BY races.start_date ASC, races.id ASC
    `).all(requestedSeason);
        const stagesByRaceId = this.getStagesByRaceIds(rows.map(row => row.id));
        return rows.map((row) => {
            const stages = stagesByRaceId.get(row.id) ?? [];
            return mapRaceWithSummary(row, stages, this.getUpcomingStageSummary(stages, row.is_stage_race === 1, currentDate));
        });
    }
    getRaceById(id) {
        const row = this.db.prepare(`
      ${buildRaceSelect()}
      WHERE races.id = ?
    `).get(id);
        if (!row)
            return null;
        const currentDate = this.getCurrentDate();
        const stagesByRaceId = this.getStagesByRaceIds([id]);
        const stages = stagesByRaceId.get(id) ?? [];
        return mapRaceWithSummary(row, stages, this.getUpcomingStageSummary(stages, row.is_stage_race === 1, currentDate));
    }
    getRaceRiders(raceId) {
        const season = this.getCurrentSeason();
        this.syncSeasonPointEventsForSeason(season);
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
      INNER JOIN race_entries re ON re.rider_id = r.id
      WHERE re.race_id = ? AND r.is_retired = 0
      ORDER BY r.overall_rating DESC
    `).all(raceId);
        const seasonPointsByRiderId = this.getSeasonPointsByRiderId(season);
        return rows.map((row) => mapRider(row, season, seasonPointsByRiderId.get(row.id) ?? 0));
    }
    getSeasonStandings(season = this.getCurrentSeason()) {
        this.syncSeasonPointEventsForSeason(season);
        if (!tableExists(this.db, 'season_point_events')) {
            return {
                season,
                riderStandings: [],
                teamStandings: [],
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
        SUM(season_point_events.points_awarded) AS points_total
      FROM season_point_events
      JOIN riders ON riders.id = season_point_events.rider_id
      JOIN sta_country country ON country.id = riders.country_id
      LEFT JOIN teams ON teams.id = riders.active_team_id
      WHERE season_point_events.season = ?
      GROUP BY season_point_events.rider_id, riders.first_name, riders.last_name, teams.id, teams.name, country.code_3
      ORDER BY points_total DESC, riders.last_name ASC, riders.first_name ASC
    `).all(season);
        const teamRows = this.db.prepare(`
      SELECT
        season_point_events.team_id AS team_id,
        teams.name AS team_name,
        country.code_3 AS country_code_3,
        SUM(season_point_events.points_awarded) AS points_total
      FROM season_point_events
      JOIN teams ON teams.id = season_point_events.team_id
      JOIN sta_country country ON country.id = teams.country_id
      WHERE season_point_events.season = ?
      GROUP BY season_point_events.team_id, teams.name, country.code_3
      ORDER BY points_total DESC, teams.name ASC
    `).all(season);
        return {
            season,
            riderStandings: this.mapRiderSeasonStandings(riderRows),
            teamStandings: this.mapTeamSeasonStandings(teamRows),
        };
    }
    getStageById(id) {
        const row = this.db.prepare(`
      SELECT id, race_id, stage_number, date, profile, details_csv_file
      FROM stages
      WHERE id = ?
    `).get(id);
        return row ? mapStage(row) : null;
    }
    getStageResults(stageId) {
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
        stages.profile AS profile
      FROM stages
      JOIN races ON races.id = stages.race_id
      WHERE stages.id = ?
    `).get(stageId);
        if (!meta)
            return null;
        const resultTypes = this.db.prepare(`
      SELECT id, name
      FROM result_types
      ORDER BY id ASC
    `).all();
        const rows = this.db.prepare(`
      SELECT
        results.result_type_id AS result_type_id,
        result_types.name AS result_type_name,
        results.rank AS rank,
        results.time_seconds AS time_seconds,
        results.points AS points,
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
    `).all(stageId);
        if (rows.length === 0)
            return null;
        const groupedRows = new Map();
        for (const row of rows) {
            const bucket = groupedRows.get(row.result_type_id) ?? [];
            bucket.push(row);
            groupedRows.set(row.result_type_id, bucket);
        }
        const classifications = resultTypes
            .map((resultType) => {
            const typeRows = groupedRows.get(resultType.id) ?? [];
            if (typeRows.length === 0) {
                return null;
            }
            const leaderTime = typeRows[0]?.time_seconds ?? null;
            const mappedRows = typeRows.map((row) => ({
                rank: row.rank,
                riderId: row.rider_id,
                riderName: row.rider_id == null
                    ? null
                    : `${row.rider_first_name ?? ''} ${row.rider_last_name ?? ''}`.trim(),
                teamId: row.team_id,
                teamName: row.team_name ?? '',
                timeSeconds: row.time_seconds,
                gapSeconds: leaderTime != null && row.time_seconds != null ? row.time_seconds - leaderTime : null,
                points: row.points,
            }));
            return {
                resultTypeId: resultType.id,
                resultTypeName: resultType.name,
                rows: mappedRows,
            };
        })
            .filter((classification) => classification != null);
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
            })),
            classifications,
        };
    }
    getStagesForRace(raceId) {
        return this.getStagesByRaceIds([raceId]).get(raceId) ?? [];
    }
    syncSeasonPointEventsForSeason(season = this.getCurrentSeason()) {
        if (!tableExists(this.db, 'season_point_events') || !tableExists(this.db, 'results')) {
            return;
        }
        const stages = this.db.prepare(`
      SELECT
        stages.id AS stage_id,
        stages.race_id AS race_id,
        stages.stage_number AS stage_number,
        stages.date AS date,
        races.is_stage_race AS is_stage_race,
        races.number_of_stages AS number_of_stages,
        race_categories_bonus.points_stage AS points_stage,
        race_categories_bonus.points_one_day AS points_one_day,
        race_categories_bonus.points_gc_final AS points_gc_final,
        race_categories_bonus.points_jersey_leader_day AS points_jersey_leader_day,
        race_categories_bonus.points_jersey_sprint_day AS points_jersey_sprint_day,
        race_categories_bonus.points_jersey_mountain_day AS points_jersey_mountain_day,
        race_categories_bonus.points_jersey_youth_day AS points_jersey_youth_day,
        race_categories_bonus.points_jersey_sprint_final AS points_jersey_sprint_final,
        race_categories_bonus.points_jersey_mountain_final AS points_jersey_mountain_final,
        race_categories_bonus.points_jersey_youth_final AS points_jersey_youth_final
      FROM stages
      JOIN races ON races.id = stages.race_id
      JOIN race_categories ON race_categories.id = races.category_id
      JOIN race_categories_bonus ON race_categories_bonus.id = race_categories.bonus_system_id
      WHERE CAST(substr(stages.date, 1, 4) AS INTEGER) = ?
        AND EXISTS (
          SELECT 1
          FROM results
          WHERE results.stage_id = stages.id AND results.result_type_id = ?
        )
      ORDER BY stages.date ASC, stages.race_id ASC, stages.stage_number ASC
    `).all(season, RESULT_TYPE_IDS.stage);
        if (stages.length === 0) {
            return;
        }
        const insert = this.db.prepare(`
      INSERT OR IGNORE INTO season_point_events (
        season, race_id, stage_id, rider_id, team_id, award_type, rank, points_awarded, awarded_on
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        this.db.transaction(() => {
            for (const stage of stages) {
                const stageRows = this.loadSeasonPointResultRows(stage.stage_id, RESULT_TYPE_IDS.stage);
                const gcRows = this.loadSeasonPointResultRows(stage.stage_id, RESULT_TYPE_IDS.gc);
                const pointsRows = this.loadSeasonPointResultRows(stage.stage_id, RESULT_TYPE_IDS.points);
                const mountainRows = this.loadSeasonPointResultRows(stage.stage_id, RESULT_TYPE_IDS.mountain);
                const youthRows = this.loadSeasonPointResultRows(stage.stage_id, RESULT_TYPE_IDS.youth);
                if (stage.is_stage_race === 1) {
                    this.insertSeasonPointAwards(insert, season, stage, 'stage_result', stageRows, parseRankedValues(stage.points_stage));
                    this.insertSeasonPointLeaderAward(insert, season, stage, 'gc_leader_day', gcRows[0], stage.points_jersey_leader_day);
                    this.insertSeasonPointLeaderAward(insert, season, stage, 'points_leader_day', pointsRows[0], stage.points_jersey_sprint_day);
                    this.insertSeasonPointLeaderAward(insert, season, stage, 'mountain_leader_day', mountainRows[0], stage.points_jersey_mountain_day);
                    this.insertSeasonPointLeaderAward(insert, season, stage, 'youth_leader_day', youthRows[0], stage.points_jersey_youth_day);
                    if (stage.stage_number === stage.number_of_stages) {
                        this.insertSeasonPointAwards(insert, season, stage, 'gc_final', gcRows, parseRankedValues(stage.points_gc_final));
                        this.insertSeasonPointAwards(insert, season, stage, 'points_final', pointsRows, parseRankedValues(stage.points_jersey_sprint_final));
                        this.insertSeasonPointAwards(insert, season, stage, 'mountain_final', mountainRows, parseRankedValues(stage.points_jersey_mountain_final));
                        this.insertSeasonPointAwards(insert, season, stage, 'youth_final', youthRows, parseRankedValues(stage.points_jersey_youth_final));
                    }
                }
                else {
                    this.insertSeasonPointAwards(insert, season, stage, 'one_day_result', stageRows, parseRankedValues(stage.points_one_day));
                }
            }
        })();
    }
    getStagesByRaceIds(raceIds) {
        const stagesByRaceId = new Map();
        if (raceIds.length === 0)
            return stagesByRaceId;
        const placeholders = raceIds.map(() => '?').join(', ');
        const stageRows = this.db.prepare(`
      SELECT id, race_id, stage_number, date, profile, details_csv_file
      FROM stages
      WHERE race_id IN (${placeholders})
      ORDER BY race_id ASC, stage_number ASC
    `).all(...raceIds);
        for (const row of stageRows) {
            const stages = stagesByRaceId.get(row.race_id) ?? [];
            stages.push(mapStage(row));
            stagesByRaceId.set(row.race_id, stages);
        }
        const missingRaceIds = raceIds.filter((raceId) => !stagesByRaceId.has(raceId));
        if (missingRaceIds.length > 0) {
            for (const row of loadFallbackStages(missingRaceIds)) {
                const stages = stagesByRaceId.get(row.race_id) ?? [];
                stages.push(mapStage(row));
                stagesByRaceId.set(row.race_id, stages);
            }
        }
        return stagesByRaceId;
    }
    getUpcomingStageSummary(stages, isStageRace, currentDate) {
        if (stages.length === 0)
            return undefined;
        const selectedStage = isStageRace
            ? stages.find((stage) => stage.date >= currentDate) ?? stages[stages.length - 1]
            : stages[0];
        if (!selectedStage)
            return undefined;
        const summary = (0, StageParser_1.summarizeStageProfile)(selectedStage.detailsCsvFile);
        return {
            stageId: selectedStage.id,
            stageNumber: selectedStage.stageNumber,
            date: selectedStage.date,
            profile: selectedStage.profile,
            detailsCsvFile: selectedStage.detailsCsvFile,
            distanceKm: summary.distanceKm,
            elevationGainMeters: summary.elevationGainMeters,
        };
    }
    getSeasonPointsByRiderId(season) {
        if (!tableExists(this.db, 'season_point_events')) {
            return new Map();
        }
        const rows = this.db.prepare(`
      SELECT rider_id, SUM(points_awarded) AS points_total
      FROM season_point_events
      WHERE season = ?
      GROUP BY rider_id
    `).all(season);
        return new Map(rows.map((row) => [row.rider_id, row.points_total]));
    }
    loadSeasonPointResultRows(stageId, resultTypeId) {
        return this.db.prepare(`
      SELECT rider_id, team_id, rank
      FROM results
      WHERE stage_id = ? AND result_type_id = ? AND rider_id IS NOT NULL AND team_id IS NOT NULL
      ORDER BY rank ASC
    `).all(stageId, resultTypeId);
    }
    insertSeasonPointAwards(insert, season, stage, awardType, rows, pointValues) {
        pointValues.forEach((points, index) => {
            const row = rows[index];
            if (!row || points <= 0) {
                return;
            }
            insert.run(season, stage.race_id, stage.stage_id, row.rider_id, row.team_id, awardType, row.rank, points, stage.date);
        });
    }
    insertSeasonPointLeaderAward(insert, season, stage, awardType, row, points) {
        if (!row || points <= 0) {
            return;
        }
        insert.run(season, stage.race_id, stage.stage_id, row.rider_id, row.team_id, awardType, row.rank, points, stage.date);
    }
    mapRiderSeasonStandings(rows) {
        const leaderPoints = rows[0]?.points_total ?? 0;
        return rows.map((row, index) => ({
            rank: index + 1,
            riderId: row.rider_id,
            riderName: `${row.rider_first_name} ${row.rider_last_name}`.trim(),
            teamId: row.team_id,
            teamName: row.team_name ?? '—',
            countryCode: row.country_code_3,
            points: row.points_total,
            gapPoints: leaderPoints - row.points_total,
        }));
    }
    mapTeamSeasonStandings(rows) {
        const leaderPoints = rows[0]?.points_total ?? 0;
        return rows.map((row, index) => ({
            rank: index + 1,
            riderId: null,
            riderName: null,
            teamId: row.team_id,
            teamName: row.team_name,
            countryCode: row.country_code_3,
            points: row.points_total,
            gapPoints: leaderPoints - row.points_total,
        }));
    }
}
exports.GameRepository = GameRepository;
