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
const skillWeights_1 = require("../../../shared/skillWeights");
const RiderLoadModel_1 = require("../game/RiderLoadModel");
const StageParser_1 = require("../simulation/StageParser");
const RESULT_TYPE_IDS = {
    stage: 1,
    gc: 2,
    points: 3,
    mountain: 4,
    youth: 5,
    team: 6,
};
const RACE_FORM_BUILD_SOURCE_AMOUNT = 0.25;
function isMountainClassificationType(markerType, markerCategory) {
    return markerType === 'climb_top'
        || ((markerType === 'finish_hill' || markerType === 'finish_mountain') && markerCategory != null && markerCategory !== 'Sprint');
}
function resolveMarkerResultsSortPriority(classification) {
    if (isMountainClassificationType(classification.markerType, classification.markerCategory))
        return 0;
    if (classification.markerType === 'sprint_intermediate')
        return 1;
    return 2;
}
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
const SEASON_FORM_RISE_DAYS = 42;
const SEASON_FORM_FALL_DAYS = 14;
const SEASON_FORM_MAX_RAW = 6;
const SEASON_FORM_RISE_STEP_RAW = SEASON_FORM_MAX_RAW / SEASON_FORM_RISE_DAYS;
const DIVISION_BY_TIER = {
    1: 'WorldTour',
    2: 'ProTour',
    3: 'U23',
};
function emptyRiderStatsPointsByTerrain() {
    return {
        flat: 0,
        hilly: 0,
        mediumMountain: 0,
        mountain: 0,
    };
}
function emptyRiderStatsPointsByRaceFormat() {
    return {
        stageRace: 0,
        oneDay: 0,
    };
}
function resolveRiderStatsTerrainBucket(profile) {
    switch (profile) {
        case 'Hilly':
        case 'Hilly_Difficult':
        case 'Cobble_Hill':
            return 'hilly';
        case 'Medium_Mountain':
            return 'mediumMountain';
        case 'Mountain':
        case 'High_Mountain':
            return 'mountain';
        default:
            return 'flat';
    }
}
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
function parsePeakDates(value) {
    if (!value)
        return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === 'string') : [];
    }
    catch {
        return [];
    }
}
function usesMountainStagePoints(profile) {
    return !['ITT', 'Flat', 'Rolling', 'Hilly'].includes(profile);
}
function resolveStageResultPointValues(stage) {
    if (stage.profile === 'TTT') {
        return [];
    }
    return parseRankedValues(stage.points_stage);
}
function isoDateToDayNumber(isoDate) {
    return Math.floor(new Date(`${isoDate}T00:00:00.000Z`).getTime() / 86400000);
}
function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}
function roundToTwoDecimals(value) {
    return Math.round(value * 100) / 100;
}
function addDaysIso(isoDate, days) {
    const date = new Date(`${isoDate}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
}
function resolveStageRaceBaseFatigue(stageNumber, recuperationSkill) {
    if (stageNumber <= 1) {
        return 0;
    }
    const cappedRecuperation = Math.min(85, recuperationSkill);
    const completedStages = stageNumber - 1;
    const baseFatigueRate = 0.10 + (((85 - cappedRecuperation) / 35) * 0.75);
    const stageProgressionFatigue = 0.01 * ((stageNumber - 2) * completedStages / 2);
    return (completedStages * baseFatigueRate) + stageProgressionFatigue;
}
function resolveStageRaceFatigueMalus(stageNumber, recuperationSkill, accumulatedRandomFatigue) {
    if (stageNumber == null) {
        return 0;
    }
    return roundToTwoDecimals(resolveStageRaceBaseFatigue(stageNumber, recuperationSkill) + accumulatedRandomFatigue);
}
function resolveEffectiveRecuperationSkill(recuperationSkill, stageRaceRecuperationPenalty) {
    return Math.max(0, recuperationSkill - stageRaceRecuperationPenalty);
}
function resolvePeakPhase(currentDate, peakDates) {
    const currentDay = isoDateToDayNumber(currentDate);
    for (const peakDate of peakDates) {
        const peakDay = isoDateToDayNumber(peakDate);
        if (currentDay >= peakDay && currentDay < peakDay + SEASON_FORM_FALL_DAYS) {
            return { phase: 'decline', peakDate, elapsedDays: currentDay - peakDay };
        }
        if (currentDay >= peakDay - SEASON_FORM_RISE_DAYS && currentDay < peakDay) {
            return { phase: 'build', peakDate, elapsedDays: peakDay - currentDay };
        }
    }
    return null;
}
function resolveDeclineValue(peakValue, elapsedDays) {
    if (elapsedDays >= SEASON_FORM_FALL_DAYS) {
        return 0;
    }
    const boundedPeakValue = Math.min(SEASON_FORM_MAX_RAW, Math.max(0, peakValue));
    return roundToTwoDecimals(Math.max(0, boundedPeakValue * (1 - (elapsedDays / SEASON_FORM_FALL_DAYS))));
}
function resolveEffectiveSeasonForm(rawSeasonForm) {
    return roundToTwoDecimals(Math.min(SEASON_FORM_MAX_RAW, Math.max(0, rawSeasonForm)));
}
function resolveProjectionPoint(date, peakDates) {
    const phase = resolvePeakPhase(date, peakDates);
    if (!phase) {
        return { sForm: 0, rForm: 0 };
    }
    if (phase.phase === 'build') {
        const sFormRaw = roundToTwoDecimals(Math.min(SEASON_FORM_MAX_RAW, Math.max(0, (SEASON_FORM_RISE_DAYS - phase.elapsedDays + 1) * SEASON_FORM_RISE_STEP_RAW)));
        const sForm = resolveEffectiveSeasonForm(sFormRaw);
        return { sForm, rForm: 0 };
    }
    return {
        sForm: resolveEffectiveSeasonForm(resolveDeclineValue(SEASON_FORM_MAX_RAW, phase.elapsedDays)),
        rForm: 0,
    };
}
function resolveRiderSeasonFormPhase(currentDate, peakDates) {
    const phase = resolvePeakPhase(currentDate, peakDates);
    if (!phase)
        return 'neutral';
    if (phase.phase === 'build')
        return 'rise';
    return 'fall';
}
function tableExists(db, tableName) {
    const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName);
    return row != null;
}
function columnExists(db, tableName, columnName) {
    if (!tableExists(db, tableName)) {
        return false;
    }
    const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
    return columns.some((column) => column.name === columnName);
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
function mapRider(row, currentYear, _currentDate, seasonPoints = 0, stageNumber) {
    const country = mapCountry(row);
    const role = mapRole(row);
    const peakDates = parsePeakDates(row.peak_dates_json);
    const accumulatedRandomFatigue = row.accumulated_random_fatigue ?? 0;
    const stageRaceRecuperationPenalty = (row.race_recuperation_penalty ?? 0) + (row.current_recovery_penalty ?? 0);
    const totalRaceFormBonus = roundToTwoDecimals((row.race_form_bonus ?? 0) + (row.free_r_form_bonus ?? 0));
    const riderLoadSummary = (0, RiderLoadModel_1.buildRiderLoadSummary)(row.season_race_days_total ?? 0, row.rolling_30d_race_days ?? 0, currentYear - row.birth_year);
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
        seasonRaceDaysTotal: riderLoadSummary.seasonRaceDaysTotal,
        rolling30dRaceDays: riderLoadSummary.rolling30dRaceDays,
        formBonus: resolveEffectiveSeasonForm(row.form_bonus ?? 0),
        raceFormBonus: totalRaceFormBonus,
        longTermFatigueMalus: riderLoadSummary.longTermFatigueMalus,
        shortTermFatigueMalus: riderLoadSummary.shortTermFatigueMalus,
        totalFatigueLoadMalus: riderLoadSummary.totalFatigueLoadMalus,
        shortTermFatigueWarning: riderLoadSummary.shortTermFatigueWarning,
        peakSForm: resolveEffectiveSeasonForm(row.peak_s_form ?? 0),
        peakRForm: row.peak_r_form ?? 0,
        activePeakDate: row.active_peak_date,
        fatigueMalus: resolveStageRaceFatigueMalus(stageNumber, resolveEffectiveRecuperationSkill(row.skill_recuperation, stageRaceRecuperationPenalty), accumulatedRandomFatigue),
        accumulatedRandomFatigue,
        stageRaceDayFormPenalty: row.incident_day_form_penalty ?? 0,
        stageRaceMicroFormPenalty: row.incident_micro_form_penalty ?? 0,
        stageRaceStaminaPenalty: row.incident_stamina_penalty ?? 0,
        stageRaceDayFormCap: row.incident_day_form_cap,
        stageRaceRecuperationPenalty,
        seasonFormPeakDates: peakDates,
        seasonFormPhase: resolveRiderSeasonFormPhase(_currentDate, peakDates),
        healthStatus: row.health_status ?? 'healthy',
        unavailableUntil: row.unavailable_until,
        unavailableDaysRemaining: row.unavailable_days_remaining ?? 0,
        healthStatusLabel: row.health_status === 'ill' ? 'Krankheit' : row.health_status === 'injured' ? 'Verletzung' : null,
        isUnavailable: (row.unavailable_days_remaining ?? 0) > 0,
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
        pointsMountainStage: row.points_mountainstage,
        pointsSprintFinish: row.points_sprint_finish,
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
function mapStageScoringRule(row) {
    const weights = RIDER_SKILL_COLUMNS.reduce((result, [skillKey, columnSuffix]) => {
        const value = row[`weight_${columnSuffix}`];
        if (typeof value === 'number' && value > 0) {
            result[skillKey] = value;
        }
        return result;
    }, {});
    return {
        id: row.id,
        ruleKey: row.rule_key,
        appliesTo: row.applies_to,
        markerType: row.marker_type,
        markerCategory: row.marker_category,
        weights,
    };
}
function mapSkillWeightRule(row) {
    const weights = skillWeights_1.SKILL_WEIGHT_RIDER_COLUMNS.reduce((result, [skillKey, columnSuffix]) => {
        const value = row[`weight_${columnSuffix}`];
        if (typeof value === 'number' && value > 0) {
            result[skillKey] = value;
        }
        return result;
    }, {});
    return {
        id: row.id,
        simulationMode: row.simulation_mode,
        terrain: row.terrain,
        weights,
        finalSpreadLateMultiplier: row.final_spread_late_multiplier,
        finalSpreadPeakMultiplier: row.final_spread_peak_multiplier,
        tttSpeedMultiplier: row.ttt_speed_multiplier,
    };
}
function mapStage(row) {
    const summary = (0, StageParser_1.summarizeStageProfile)(row.details_csv_file, row.start_elevation);
    return {
        id: row.id,
        raceId: row.race_id,
        stageNumber: row.stage_number,
        date: row.date,
        profile: row.profile,
        detailsCsvFile: row.details_csv_file,
        startElevation: row.start_elevation,
        finalSpreadStartPercent: row.final_spread_start_percent,
        finalPushStartPercent: row.final_push_start_percent,
        finalSpreadDifficultyMultiplier: row.final_spread_difficulty_multiplier,
        crashIncidentMultiplier: row.crash_incident_multiplier,
        mechanicalIncidentMultiplier: row.mechanical_incident_multiplier,
        distanceKm: summary.distanceKm,
        elevationGainMeters: summary.elevationGainMeters,
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
            start_elevation: Number(record['start_elevation']),
            details_csv_file: record['details_csv_file'] ?? '',
            final_spread_start_percent: Number(record['final_spread_start_percent'] ?? '70') || 70,
            final_push_start_percent: Number(record['final_push_start_percent'] ?? '90') || 90,
            final_spread_difficulty_multiplier: Number(record['final_spread_difficulty_multiplier'] ?? '1') || 1,
            crash_incident_multiplier: Number(record['crash_incident_multiplier'] ?? '1') || 1,
            mechanical_incident_multiplier: Number(record['mechanical_incident_multiplier'] ?? '1') || 1,
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
function mapRaceProgram(row) {
    return {
        id: row.id,
        name: row.name,
        peak1Min: row.peak1_min,
        peak1Max: row.peak1_max,
        peak2Min: row.peak2_min,
        peak2Max: row.peak2_max,
        peak3Min: row.peak3_min,
        peak3Max: row.peak3_max,
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
           race_categories_bonus.points_mountainstage,
           race_categories_bonus.points_sprint_finish,
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
            .prepare('SELECT "current_date" AS current_date FROM game_state WHERE id = 1')
            .get();
        if (row?.current_date)
            return row.current_date;
        return `${this.getCurrentSeason()}-01-01`;
    }
    prepareStageRaceFatigue(raceId, stageNumber, riderIds) {
        if (stageNumber < 1 || riderIds.length === 0) {
            return;
        }
        this.ensureStageRaceStateSchema();
        const insertState = this.db.prepare(`
      INSERT OR IGNORE INTO rider_stage_race_state (
        race_id, rider_id, accumulated_random_fatigue, last_applied_stage_number,
        incident_day_form_penalty, incident_micro_form_penalty, incident_stamina_penalty,
        incident_day_form_cap, race_recuperation_penalty, current_recovery_penalty,
        pending_recovery_penalty_1, pending_recovery_penalty_2, pending_recovery_penalty_3
      ) VALUES (?, ?, 0, 0, 0, 0, 0, NULL, 0, 0, 0, 0, 0)
    `);
        const selectState = this.db.prepare(`
      SELECT rider_id,
             accumulated_random_fatigue,
             last_applied_stage_number,
             current_recovery_penalty,
             pending_recovery_penalty_1,
             pending_recovery_penalty_2,
             pending_recovery_penalty_3
      FROM rider_stage_race_state
      WHERE race_id = ? AND rider_id = ?
    `);
        const updateState = this.db.prepare(`
      UPDATE rider_stage_race_state
      SET accumulated_random_fatigue = ?,
          last_applied_stage_number = ?,
          current_recovery_penalty = ?,
          pending_recovery_penalty_1 = ?,
          pending_recovery_penalty_2 = ?,
          pending_recovery_penalty_3 = ?
      WHERE race_id = ? AND rider_id = ?
    `);
        this.db.transaction(() => {
            for (const riderId of riderIds) {
                insertState.run(raceId, riderId);
                const existing = selectState.get(raceId, riderId);
                if (!existing || existing.last_applied_stage_number >= stageNumber) {
                    continue;
                }
                let accumulatedRandomFatigue = existing.accumulated_random_fatigue;
                let currentRecoveryPenalty = existing.current_recovery_penalty;
                let pendingRecoveryPenalty1 = existing.pending_recovery_penalty_1;
                let pendingRecoveryPenalty2 = existing.pending_recovery_penalty_2;
                let pendingRecoveryPenalty3 = existing.pending_recovery_penalty_3;
                for (let nextStageNumber = existing.last_applied_stage_number + 1; nextStageNumber <= stageNumber; nextStageNumber += 1) {
                    currentRecoveryPenalty = pendingRecoveryPenalty1;
                    pendingRecoveryPenalty1 = pendingRecoveryPenalty2;
                    pendingRecoveryPenalty2 = pendingRecoveryPenalty3;
                    pendingRecoveryPenalty3 = 0;
                }
                if (Math.random() < 0.005) {
                    accumulatedRandomFatigue = roundToTwoDecimals(accumulatedRandomFatigue + randomBetween(0.1, 0.3));
                }
                updateState.run(accumulatedRandomFatigue, stageNumber, currentRecoveryPenalty, pendingRecoveryPenalty1, pendingRecoveryPenalty2, pendingRecoveryPenalty3, raceId, riderId);
            }
        })();
    }
    ensureStageEntries(stage) {
        this.db.prepare(`
      CREATE TABLE IF NOT EXISTS stage_entries (
        stage_id       INTEGER NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
        race_id        INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
        team_id        INTEGER NOT NULL REFERENCES teams(id),
        rider_id       INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        status         TEXT    NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'started', 'finished', 'dns', 'dnf')),
        status_reason  TEXT,
        PRIMARY KEY (stage_id, rider_id)
      )
    `).run();
        this.db.prepare('CREATE INDEX IF NOT EXISTS idx_stage_entries_race_stage_status ON stage_entries(race_id, stage_id, status)').run();
        this.db.prepare('CREATE INDEX IF NOT EXISTS idx_stage_entries_rider_status ON stage_entries(rider_id, status)').run();
        if (tableExists(this.db, 'rider_daily_state')) {
            this.db.prepare(`
        DELETE FROM stage_entries
        WHERE stage_id = ?
          AND status = 'scheduled'
          AND rider_id IN (
            SELECT rider_id
            FROM rider_daily_state
            WHERE unavailable_days_remaining > 0
          )
      `).run(stage.id);
        }
        const inactiveRiderIds = new Set(this.db.prepare(`
      SELECT DISTINCT stage_entries.rider_id AS rider_id
      FROM stage_entries
      JOIN stages ON stages.id = stage_entries.stage_id
      WHERE stage_entries.race_id = ?
        AND stages.stage_number < ?
        AND stage_entries.status IN ('dns', 'dnf')
    `).all(stage.raceId, stage.stageNumber).map((row) => row.rider_id));
        const raceEntries = (tableExists(this.db, 'rider_daily_state')
            ? this.db.prepare(`
          SELECT re.race_id, re.team_id, re.rider_id
          FROM race_entries re
          LEFT JOIN rider_daily_state rider_state ON rider_state.rider_id = re.rider_id
          WHERE re.race_id = ?
            AND COALESCE(rider_state.unavailable_days_remaining, 0) = 0
          ORDER BY re.rider_id ASC
        `).all(stage.raceId)
            : this.db.prepare(`
          SELECT race_id, team_id, rider_id
          FROM race_entries
          WHERE race_id = ?
          ORDER BY rider_id ASC
        `).all(stage.raceId));
        const insertStageEntry = this.db.prepare(`
      INSERT OR IGNORE INTO stage_entries (stage_id, race_id, team_id, rider_id, status, status_reason)
      VALUES (?, ?, ?, ?, 'scheduled', NULL)
    `);
        this.db.transaction(() => {
            for (const entry of raceEntries) {
                if (inactiveRiderIds.has(entry.rider_id)) {
                    continue;
                }
                insertStageEntry.run(stage.id, stage.raceId, entry.team_id, entry.rider_id);
            }
        })();
    }
    clearStageEntries(stageId) {
        if (!tableExists(this.db, 'stage_entries')) {
            return;
        }
        this.db.prepare('DELETE FROM stage_entries WHERE stage_id = ?').run(stageId);
    }
    updateStageEntryStatus(stageId, riderId, status, statusReason = null) {
        this.db.prepare(`
      CREATE TABLE IF NOT EXISTS stage_entries (
        stage_id       INTEGER NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
        race_id        INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
        team_id        INTEGER NOT NULL REFERENCES teams(id),
        rider_id       INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        status         TEXT    NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'started', 'finished', 'dns', 'dnf')),
        status_reason  TEXT,
        PRIMARY KEY (stage_id, rider_id)
      )
    `).run();
        this.db.prepare(`
      UPDATE stage_entries
      SET status = ?, status_reason = ?
      WHERE stage_id = ? AND rider_id = ?
    `).run(status, statusReason, stageId, riderId);
    }
    markStageEntriesFinished(stageId, riderIds) {
        if (riderIds.length === 0) {
            return;
        }
        this.db.transaction(() => {
            for (const riderId of riderIds) {
                this.updateStageEntryStatus(stageId, riderId, 'finished');
            }
        })();
    }
    getFullyClassifiedStageRaceRiderIds(raceId, upToStageNumber) {
        if (upToStageNumber < 1 || !tableExists(this.db, 'stages') || !tableExists(this.db, 'stage_entries') || !tableExists(this.db, 'races')) {
            return [];
        }
        const raceRow = this.db.prepare('SELECT is_stage_race FROM races WHERE id = ?').get(raceId);
        if (!raceRow || raceRow.is_stage_race !== 1) {
            return [];
        }
        const expectedStageCount = this.db.prepare(`
      SELECT COUNT(*) AS stage_count
      FROM stages
      WHERE race_id = ?
        AND stage_number <= ?
    `).get(raceId, upToStageNumber)?.stage_count ?? 0;
        if (expectedStageCount < 1) {
            return [];
        }
        const rows = this.db.prepare(`
      SELECT stage_entries.rider_id AS rider_id
      FROM stage_entries
      JOIN stages ON stages.id = stage_entries.stage_id
      WHERE stage_entries.race_id = ?
        AND stages.stage_number <= ?
      GROUP BY stage_entries.rider_id
      HAVING COUNT(*) = ?
        AND SUM(CASE WHEN stage_entries.status = 'finished' THEN 1 ELSE 0 END) = ?
        AND SUM(CASE WHEN stage_entries.status IN ('dns', 'dnf') THEN 1 ELSE 0 END) = 0
    `).all(raceId, upToStageNumber, expectedStageCount, expectedStageCount);
        return rows.map((row) => row.rider_id);
    }
    markUnavailableStageRaceParticipantsAsDnf() {
        if (!tableExists(this.db, 'races')
            || !tableExists(this.db, 'stages')
            || !tableExists(this.db, 'race_entries')
            || !tableExists(this.db, 'stage_entries')
            || !tableExists(this.db, 'rider_daily_state')) {
            return 0;
        }
        const candidates = this.db.prepare(`
      SELECT
        target_stage.id AS stage_id,
        candidate.race_id AS race_id,
        candidate.team_id AS team_id,
        candidate.rider_id AS rider_id,
        candidate.health_status AS health_status
      FROM (
        SELECT
          race_entries.race_id AS race_id,
          race_entries.team_id AS team_id,
          race_entries.rider_id AS rider_id,
          rider_daily_state.health_status AS health_status,
          MAX(stages.stage_number) AS last_finished_stage_number
        FROM race_entries
        JOIN races ON races.id = race_entries.race_id
        JOIN rider_daily_state ON rider_daily_state.rider_id = race_entries.rider_id
        JOIN stage_entries ON stage_entries.race_id = race_entries.race_id
          AND stage_entries.rider_id = race_entries.rider_id
          AND stage_entries.status = 'finished'
        JOIN stages ON stages.id = stage_entries.stage_id
        WHERE races.is_stage_race = 1
          AND rider_daily_state.unavailable_days_remaining > 0
          AND rider_daily_state.health_status IN ('ill', 'injured')
          AND NOT EXISTS (
            SELECT 1
            FROM stage_entries AS exited_entries
            WHERE exited_entries.race_id = race_entries.race_id
              AND exited_entries.rider_id = race_entries.rider_id
              AND exited_entries.status IN ('dns', 'dnf')
          )
        GROUP BY race_entries.race_id, race_entries.team_id, race_entries.rider_id, rider_daily_state.health_status
      ) AS candidate
      JOIN stages AS target_stage
        ON target_stage.race_id = candidate.race_id
       AND target_stage.stage_number = candidate.last_finished_stage_number + 1
    `).all();
        if (candidates.length === 0) {
            return 0;
        }
        const upsertStageEntry = this.db.prepare(`
      INSERT INTO stage_entries (stage_id, race_id, team_id, rider_id, status, status_reason)
      VALUES (?, ?, ?, ?, 'dnf', ?)
      ON CONFLICT(stage_id, rider_id) DO UPDATE SET
        race_id = excluded.race_id,
        team_id = excluded.team_id,
        status = excluded.status,
        status_reason = excluded.status_reason
    `);
        this.db.transaction(() => {
            for (const candidate of candidates) {
                upsertStageEntry.run(candidate.stage_id, candidate.race_id, candidate.team_id, candidate.rider_id, candidate.health_status === 'ill' ? 'Krankheit' : 'Verletzung');
            }
        })();
        return candidates.length;
    }
    attachStageRaceFatigue(raceId, riders, stageNumber) {
        if (riders.length === 0 || stageNumber < 1) {
            return riders;
        }
        this.ensureStageRaceStateSchema();
        const fatigueRows = this.db.prepare(`
      SELECT race_id,
             rider_id,
             accumulated_random_fatigue,
             incident_day_form_penalty,
             incident_micro_form_penalty,
             incident_stamina_penalty,
             incident_day_form_cap,
             race_recuperation_penalty,
             current_recovery_penalty
      FROM rider_stage_race_state
      WHERE race_id = ? AND rider_id = ?
    `);
        return riders.map((rider) => {
            const row = fatigueRows.get(raceId, rider.id);
            const accumulatedRandomFatigue = row?.accumulated_random_fatigue ?? 0;
            const stageRaceRecuperationPenalty = (row?.race_recuperation_penalty ?? 0) + (row?.current_recovery_penalty ?? 0);
            return {
                ...rider,
                accumulatedRandomFatigue,
                fatigueMalus: resolveStageRaceFatigueMalus(stageNumber, resolveEffectiveRecuperationSkill(rider.skills.recuperation, stageRaceRecuperationPenalty), accumulatedRandomFatigue),
                stageRaceDayFormPenalty: row?.incident_day_form_penalty ?? 0,
                stageRaceMicroFormPenalty: row?.incident_micro_form_penalty ?? 0,
                stageRaceStaminaPenalty: row?.incident_stamina_penalty ?? 0,
                stageRaceDayFormCap: row?.incident_day_form_cap ?? null,
                stageRaceRecuperationPenalty,
            };
        });
    }
    applyIncidentRaceState(raceId, incidents) {
        if (incidents.length === 0) {
            return;
        }
        this.ensureStageRaceStateSchema();
        const relevantIncidents = incidents.filter((incident) => incident.type === 'crash' && incident.severity !== 'severe');
        if (relevantIncidents.length === 0) {
            return;
        }
        const insertState = this.db.prepare(`
      INSERT OR IGNORE INTO rider_stage_race_state (
        race_id, rider_id, accumulated_random_fatigue, last_applied_stage_number,
        incident_day_form_penalty, incident_micro_form_penalty, incident_stamina_penalty,
        incident_day_form_cap, race_recuperation_penalty, current_recovery_penalty,
        pending_recovery_penalty_1, pending_recovery_penalty_2, pending_recovery_penalty_3
      ) VALUES (?, ?, 0, 0, 0, 0, 0, NULL, 0, 0, 0, 0, 0)
    `);
        const currentState = this.db.prepare(`
      SELECT incident_day_form_penalty,
             incident_micro_form_penalty,
             incident_stamina_penalty,
             incident_day_form_cap,
             race_recuperation_penalty,
             pending_recovery_penalty_1,
             pending_recovery_penalty_2,
             pending_recovery_penalty_3
      FROM rider_stage_race_state
      WHERE race_id = ? AND rider_id = ?
    `);
        const updateState = this.db.prepare(`
      UPDATE rider_stage_race_state
      SET incident_day_form_penalty = ?,
          incident_micro_form_penalty = ?,
          incident_stamina_penalty = ?,
          incident_day_form_cap = ?,
          race_recuperation_penalty = ?,
          pending_recovery_penalty_1 = ?,
          pending_recovery_penalty_2 = ?,
          pending_recovery_penalty_3 = ?
      WHERE race_id = ? AND rider_id = ?
    `);
        for (const incident of relevantIncidents) {
            insertState.run(raceId, incident.riderId);
            const existing = currentState.get(raceId, incident.riderId);
            if (!existing) {
                continue;
            }
            let incidentDayFormPenalty = existing.incident_day_form_penalty;
            let incidentMicroFormPenalty = existing.incident_micro_form_penalty;
            let incidentStaminaPenalty = existing.incident_stamina_penalty;
            let incidentDayFormCap = existing.incident_day_form_cap;
            let raceRecuperationPenalty = existing.race_recuperation_penalty;
            let pendingRecoveryPenalty1 = existing.pending_recovery_penalty_1;
            let pendingRecoveryPenalty2 = existing.pending_recovery_penalty_2;
            let pendingRecoveryPenalty3 = existing.pending_recovery_penalty_3;
            if (incident.severity === 'medium') {
                incidentDayFormPenalty = roundToTwoDecimals(incidentDayFormPenalty + incident.dayFormPenalty - 3);
                incidentMicroFormPenalty = roundToTwoDecimals(incidentMicroFormPenalty - 3);
                incidentStaminaPenalty = roundToTwoDecimals(incidentStaminaPenalty + incident.staminaPenalty);
                incidentDayFormCap = incidentDayFormCap == null ? 0 : Math.min(incidentDayFormCap, 0);
                raceRecuperationPenalty = roundToTwoDecimals(raceRecuperationPenalty + incident.raceRecuperationPenalty);
            }
            if (incident.severity === 'light') {
                pendingRecoveryPenalty1 = roundToTwoDecimals(pendingRecoveryPenalty1 + (incident.recoveryPenaltyStages[0] ?? 0));
                pendingRecoveryPenalty2 = roundToTwoDecimals(pendingRecoveryPenalty2 + (incident.recoveryPenaltyStages[1] ?? 0));
                pendingRecoveryPenalty3 = roundToTwoDecimals(pendingRecoveryPenalty3 + (incident.recoveryPenaltyStages[2] ?? 0));
            }
            updateState.run(incidentDayFormPenalty, incidentMicroFormPenalty, incidentStaminaPenalty, incidentDayFormCap, raceRecuperationPenalty, pendingRecoveryPenalty1, pendingRecoveryPenalty2, pendingRecoveryPenalty3, raceId, incident.riderId);
        }
    }
    getRidersQuery(useContracts, filterByTeam) {
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
    getRiders(teamId, includeFormDebug = false) {
        const season = this.getCurrentSeason();
        const currentDate = this.getCurrentDate();
        const useContracts = tableExists(this.db, 'contracts');
        const rows = teamId != null
            ? (useContracts
                ? this.db.prepare(this.getRidersQuery(true, true)).all(season, season, teamId)
                : this.db.prepare(this.getRidersQuery(false, true)).all(teamId))
            : (useContracts
                ? this.db.prepare(this.getRidersQuery(true, false)).all(season, season)
                : this.db.prepare(this.getRidersQuery(false, false)).all());
        const seasonPointsByRiderId = this.getSeasonPointsByRiderId(season);
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
    attachMentorData(riders) {
        return riders.map((rider) => {
            if ((rider.age ?? 0) <= 23 && rider.activeTeamId != null) {
                const mentors = riders.filter(m => m.id !== rider.id &&
                    m.activeTeamId === rider.activeTeamId &&
                    (m.age ?? 0) >= 31 &&
                    m.overallRating >= 73 &&
                    (m.riderType === rider.riderType ||
                        (rider.specialization1 && m.riderType === rider.specialization1) ||
                        (rider.specialization2 && m.riderType === rider.specialization2) ||
                        (rider.specialization3 && m.riderType === rider.specialization3)));
                if (mentors.length > 0) {
                    mentors.sort((a, b) => b.overallRating - a.overallRating);
                    const strongestMentor = mentors[0];
                    return {
                        ...rider,
                        mentorName: `${strongestMentor.firstName.charAt(0)}. ${strongestMentor.lastName}`,
                    };
                }
            }
            return rider;
        });
    }
    loadYearlyBaselinesByRiderId(riderIds, season) {
        if (riderIds.length === 0 || !tableExists(this.db, 'rider_skill_yearly_baseline')) {
            return new Map();
        }
        const placeholders = riderIds.map(() => '?').join(', ');
        const rows = this.db.prepare(`
      SELECT rider_id, skill_key, baseline_value
      FROM rider_skill_yearly_baseline
      WHERE season = ? AND rider_id IN (${placeholders})
    `).all(season, ...riderIds);
        const map = new Map();
        for (const row of rows) {
            if (!map.has(row.rider_id)) {
                map.set(row.rider_id, {});
            }
            map.get(row.rider_id)[row.skill_key] = row.baseline_value;
        }
        return map;
    }
    attachProgramData(riders, season) {
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
    `).all(season, ...riderIds);
        const programByRiderId = new Map(programRows.map((row) => [row.rider_id, {
                id: row.program_id,
                name: row.program_name,
                peak1Min: row.peak1_min,
                peak1Max: row.peak1_max,
                peak2Min: row.peak2_min,
                peak2Max: row.peak2_max,
                peak3Min: row.peak3_min,
                peak3Max: row.peak3_max,
            }]));
        const raceRows = tableExists(this.db, 'race_program_races')
            ? this.db.prepare(`
          SELECT rider_season_programs.rider_id,
                 race_program_races.race_id
          FROM rider_season_programs
          JOIN race_program_races ON race_program_races.program_id = rider_season_programs.program_id
          WHERE rider_season_programs.season = ?
            AND rider_season_programs.rider_id IN (${placeholders})
          ORDER BY race_program_races.race_id ASC
        `).all(season, ...riderIds)
            : [];
        const raceIdsByRiderId = new Map();
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
    getRaceProgramsForRace(raceId) {
        if (!tableExists(this.db, 'race_programs') || !tableExists(this.db, 'race_program_races')) {
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
        return rows.map(mapRaceProgram);
    }
    getRiderProgramRaceSummary(riderId) {
        const season = this.getCurrentSeason();
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
    `).get(season, riderId);
        if (!programRow) {
            return null;
        }
        const raceRows = this.db.prepare(`
      ${buildRaceSelect()}
      JOIN race_program_races ON race_program_races.race_id = races.id
      WHERE race_program_races.program_id = ?
      ORDER BY races.start_date ASC, races.id ASC
    `).all(programRow.id);
        const stagesByRaceId = this.getStagesByRaceIds(raceRows.map(row => row.id));
        const currentDate = this.getCurrentDate();
        return {
            program: mapRaceProgram(programRow),
            races: raceRows.map((row) => {
                const stages = stagesByRaceId.get(row.id) ?? [];
                return mapRaceWithSummary(row, stages, this.getUpcomingStageSummary(stages, row.is_stage_race === 1, currentDate));
            }),
        };
    }
    getRiderStats(riderId) {
        const rider = this.getRiderById(riderId);
        if (!rider) {
            return null;
        }
        const currentSeason = this.getCurrentSeason();
        const currentSeasonStandings = this.getSeasonStandings(currentSeason).riderStandings;
        const currentSeasonRank = currentSeasonStandings.find((row) => row.riderId === rider.id)?.rank ?? null;
        this.syncSeasonPointEventsForSeason(currentSeason);
        const currentSeasonPoints = this.getSeasonPointsByRiderId(currentSeason).get(rider.id) ?? 0;
        const currentSeasonRaceStats = this.getSeasonRaceStatsByRiderId(currentSeason).get(rider.id) ?? { raceDays: 0, wins: 0 };
        const currentSeasonBreakawayAttempts = this.getSeasonBreakawayAttempts(currentSeason, rider.id);
        const careerWins = this.getCareerWins(rider.id);
        const careerRaceDaysBySeason = this.getCareerRaceDaysBySeason(rider.id);
        const programSummary = this.getRiderProgramRaceSummary(rider.id);
        const pointsByTerrain = emptyRiderStatsPointsByTerrain();
        const pointsByRaceFormat = emptyRiderStatsPointsByRaceFormat();
        if (!tableExists(this.db, 'results') || !tableExists(this.db, 'stages')) {
            return this.createEmptyRiderStatsPayload(rider, currentSeasonRank, currentSeasonPoints, currentSeasonRaceStats.raceDays, currentSeasonBreakawayAttempts, careerWins, careerRaceDaysBySeason, programSummary);
        }
        const seasonRows = this.db.prepare(`
      SELECT DISTINCT CAST(substr(stages.date, 1, 4) AS INTEGER) AS season
      FROM stage_entries
      JOIN stages ON stages.id = stage_entries.stage_id
      WHERE stage_entries.rider_id = ?
        AND stage_entries.status IN ('finished', 'dnf')
      ORDER BY season ASC
    `).all(riderId);
        for (const row of seasonRows) {
            if (Number.isFinite(row.season)) {
                this.syncSeasonPointEventsForSeason(row.season);
            }
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
        stage_entries.status_reason AS stage_entry_status_reason
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
    `).all(RESULT_TYPE_IDS.gc, riderId);
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
        final_points.points_awarded AS final_points
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
    `).all(riderId);
        const seasons = new Map();
        const blocks = new Map();
        const stageSummaryCache = new Map();
        const ensureSeason = (season) => {
            const existing = seasons.get(season);
            if (existing) {
                return existing;
            }
            const created = {
                season,
                raceBlocks: [],
            };
            seasons.set(season, created);
            return created;
        };
        const ensureRaceBlock = (season, raceId, raceName, raceCategoryName, isStageRace, startDate, endDate) => {
            const key = `${season}:${raceId}`;
            const existing = blocks.get(key);
            if (existing) {
                return existing;
            }
            const seasonBucket = ensureSeason(season);
            const created = {
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
        const getStageSummary = (stageId, detailsCsvFile, startElevation) => {
            const cached = stageSummaryCache.get(stageId);
            if (cached) {
                return cached;
            }
            const summary = (0, StageParser_1.summarizeStageProfile)(detailsCsvFile, startElevation);
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
            });
            const terrainBucket = resolveRiderStatsTerrainBucket(row.profile);
            pointsByTerrain[terrainBucket] += stagePoints;
            if (row.is_stage_race === 1) {
                pointsByRaceFormat.stageRace += stagePoints;
            }
            else {
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
            });
            pointsByTerrain[resolveRiderStatsTerrainBucket(row.profile)] += finalPoints;
            pointsByRaceFormat.stageRace += finalPoints;
        }
        const rowTypeOrder = {
            stage_result: 0,
            gc_final: 1,
            points_final: 2,
            mountain_final: 3,
            youth_final: 4,
        };
        for (const season of seasons.values()) {
            season.raceBlocks.sort((left, right) => (left.startDate.localeCompare(right.startDate)
                || left.raceName.localeCompare(right.raceName, 'de')
                || left.raceId - right.raceId));
            for (const block of season.raceBlocks) {
                block.rows.sort((left, right) => (left.date.localeCompare(right.date)
                    || (left.stageNumber ?? 999) - (right.stageNumber ?? 999)
                    || rowTypeOrder[left.rowType] - rowTypeOrder[right.rowType]
                    || (left.resultRank ?? 999) - (right.resultRank ?? 999)));
            }
        }
        return {
            riderId: rider.id,
            riderName: `${rider.firstName} ${rider.lastName}`,
            teamId: rider.activeTeamId ?? null,
            teamName: rider.activeTeamId != null ? this.getTeamById(rider.activeTeamId)?.name ?? null : null,
            countryCode: rider.country?.code3 ?? rider.nationality ?? null,
            roleName: rider.role?.name ?? null,
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
        };
    }
    getRaceProgramParticipants(raceId) {
        const season = this.getCurrentSeason();
        if (!tableExists(this.db, 'rider_season_programs') || !tableExists(this.db, 'race_program_races')) {
            return [];
        }
        const race = this.getRaces().find((entry) => entry.id === raceId);
        const targetDivision = race?.category?.tier != null ? DIVISION_BY_TIER[race.category.tier] : undefined;
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
        const ridersById = new Map(this.getRiders().map((rider) => [rider.id, rider]));
        const teamsById = new Map(this.getTeams().map((team) => [team.id, team]));
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
        const winterBreakEnd = `${season}-02-15`;
        const raceStartDate = race?.startDate ?? '';
        let filtered = participants.filter((entry) => targetDivision == null || entry.team?.division === targetDivision);
        // During winter break (race before Feb 15): exclude the top 2 riders per team
        if (raceStartDate < winterBreakEnd) {
            const teamEntryMap = new Map();
            for (const entry of filtered) {
                if (entry.team == null) continue;
                if (!teamEntryMap.has(entry.team.id)) teamEntryMap.set(entry.team.id, []);
                teamEntryMap.get(entry.team.id).push(entry);
            }
            const top2RiderIds = new Set();
            for (const teamEntries of teamEntryMap.values()) {
                const sorted = [...teamEntries].sort((a, b) => b.rider.overallRating - a.rider.overallRating);
                for (const entry of sorted.slice(0, 2)) {
                    top2RiderIds.add(entry.rider.id);
                }
            }
            filtered = filtered.filter((entry) => !top2RiderIds.has(entry.rider.id));
        }
        return filtered
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
    getSeasonRaceStatsByRiderId(season) {
        const statsByRiderId = new Map();
        if (!tableExists(this.db, 'results') || !tableExists(this.db, 'stages')) {
            return statsByRiderId;
        }
        const rows = this.db.prepare(`
      SELECT
        stage_entries.rider_id AS rider_id,
        COUNT(*) AS race_days,
        SUM(CASE WHEN results.rank = 1 THEN 1 ELSE 0 END) AS wins
      FROM stage_entries
      JOIN stages ON stages.id = stage_entries.stage_id
      LEFT JOIN results ON results.stage_id = stages.id AND results.rider_id = stage_entries.rider_id AND results.result_type_id = ?
      WHERE stage_entries.status != 'dns'
        AND CAST(substr(stages.date, 1, 4) AS INTEGER) = ?
      GROUP BY stage_entries.rider_id
    `).all(RESULT_TYPE_IDS.stage, season);
        for (const row of rows) {
            statsByRiderId.set(row.rider_id, {
                raceDays: row.race_days,
                wins: row.wins ?? 0,
            });
        }
        return statsByRiderId;
    }
    loadRaceFormSourcesByRiderId(riderIds, season, currentDate) {
        const sourcesByRiderId = new Map();
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
      `).all(...riderIds, seasonStart, seasonEnd);
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
      `).all(...riderIds, seasonStart, seasonEnd, currentDate);
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
    loadRaceFormSourceLabelsByDate(season) {
        const labelsByDate = new Map();
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
    `).all(`${season}-01-01`, `${season}-12-31`);
        for (const row of rows) {
            const label = row.is_stage_race === 1
                ? `${row.race_name} Etappe ${row.stage_number}`
                : row.race_name;
            const existing = labelsByDate.get(row.date);
            labelsByDate.set(row.date, existing ? `${existing} / ${label}` : label);
        }
        return labelsByDate;
    }
    getRiderById(id) {
        const season = this.getCurrentSeason();
        const currentDate = this.getCurrentDate();
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
    `).get(id);
        return row ? mapRider(row, season, currentDate, 0) : null;
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
    getStageScoringRules() {
        if (!tableExists(this.db, 'rules')) {
            return [];
        }
        const rows = this.db.prepare(`
      SELECT id,
             rule_key,
             applies_to,
             marker_type,
             marker_category,
             weight_flat,
             weight_mountain,
             weight_medium_mountain,
             weight_hill,
             weight_time_trial,
             weight_prologue,
             weight_cobble,
             weight_sprint,
             weight_acceleration,
             weight_downhill,
             weight_attack,
             weight_stamina,
             weight_resistance,
             weight_recuperation,
             weight_bike_handling
      FROM rules
      ORDER BY id ASC
    `).all();
        return rows.map(mapStageScoringRule);
    }
    getSkillWeightRules() {
        if (!tableExists(this.db, 'skill_weights')) {
            return [];
        }
        const rows = this.db.prepare(`
      SELECT id,
             simulation_mode,
             terrain,
             weight_flat,
             weight_mountain,
             weight_medium_mountain,
             weight_hill,
             weight_time_trial,
             weight_prologue,
             weight_cobble,
             weight_sprint,
             weight_acceleration,
             weight_downhill,
             weight_attack,
             weight_stamina,
             weight_resistance,
             weight_recuperation,
             weight_bike_handling,
                  final_spread_late_multiplier,
                  final_spread_peak_multiplier,
             ttt_speed_multiplier
      FROM skill_weights
      ORDER BY id ASC
    `).all();
        return rows.map(mapSkillWeightRule);
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
        const currentDate = this.getCurrentDate();
        const useDailyState = tableExists(this.db, 'rider_daily_state');
        this.ensureStageRaceStateSchema();
        const useStageRaceState = tableExists(this.db, 'rider_stage_race_state');
        const useFreeRaceForm = tableExists(this.db, 'rider_r_form_events');
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
             ${useStageRaceState ? 'COALESCE(race_state.accumulated_random_fatigue, 0)' : '0'} AS accumulated_random_fatigue,
             ${useStageRaceState ? 'COALESCE(race_state.incident_day_form_penalty, 0)' : '0'} AS incident_day_form_penalty,
             ${useStageRaceState ? 'COALESCE(race_state.incident_micro_form_penalty, 0)' : '0'} AS incident_micro_form_penalty,
             ${useStageRaceState ? 'COALESCE(race_state.incident_stamina_penalty, 0)' : '0'} AS incident_stamina_penalty,
             ${useStageRaceState && columnExists(this.db, 'rider_stage_race_state', 'incident_day_form_cap') ? 'race_state.incident_day_form_cap' : 'NULL'} AS incident_day_form_cap,
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
        const seasonPointsByRiderId = this.getSeasonPointsByRiderId(season);
        const stageRow = this.db.prepare('SELECT stage_number FROM stages WHERE race_id = ? AND date = ? ORDER BY stage_number ASC LIMIT 1').get(raceId, currentDate);
        return rows.map((row) => mapRider(row, season, currentDate, seasonPointsByRiderId.get(row.id) ?? 0, stageRow?.stage_number));
    }
    getStageRiders(stageId) {
        const season = this.getCurrentSeason();
        const currentDate = this.getCurrentDate();
        const useDailyState = tableExists(this.db, 'rider_daily_state');
        this.ensureStageRaceStateSchema();
        const useStageRaceState = tableExists(this.db, 'rider_stage_race_state');
        const useFreeRaceForm = tableExists(this.db, 'rider_r_form_events');
        const stage = this.getStageById(stageId);
        if (!stage) {
            return [];
        }
        this.ensureStageEntries(stage);
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
             ${useStageRaceState ? 'COALESCE(race_state.accumulated_random_fatigue, 0)' : '0'} AS accumulated_random_fatigue,
             ${useStageRaceState ? 'COALESCE(race_state.incident_day_form_penalty, 0)' : '0'} AS incident_day_form_penalty,
             ${useStageRaceState ? 'COALESCE(race_state.incident_micro_form_penalty, 0)' : '0'} AS incident_micro_form_penalty,
             ${useStageRaceState ? 'COALESCE(race_state.incident_stamina_penalty, 0)' : '0'} AS incident_stamina_penalty,
             ${useStageRaceState && columnExists(this.db, 'rider_stage_race_state', 'incident_day_form_cap') ? 'race_state.incident_day_form_cap' : 'NULL'} AS incident_day_form_cap,
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
        const seasonPointsByRiderId = this.getSeasonPointsByRiderId(season);
        return rows.map((row) => mapRider(row, season, currentDate, seasonPointsByRiderId.get(row.id) ?? 0, stage.stageNumber));
    }
    ensureStageRaceStateSchema() {
        this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_stage_race_state (
        race_id INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        accumulated_random_fatigue REAL NOT NULL DEFAULT 0,
        last_applied_stage_number INTEGER NOT NULL DEFAULT 0,
        incident_day_form_penalty REAL NOT NULL DEFAULT 0,
        incident_micro_form_penalty REAL NOT NULL DEFAULT 0,
        incident_stamina_penalty REAL NOT NULL DEFAULT 0,
        incident_day_form_cap REAL,
        race_recuperation_penalty REAL NOT NULL DEFAULT 0,
        current_recovery_penalty REAL NOT NULL DEFAULT 0,
        pending_recovery_penalty_1 REAL NOT NULL DEFAULT 0,
        pending_recovery_penalty_2 REAL NOT NULL DEFAULT 0,
        pending_recovery_penalty_3 REAL NOT NULL DEFAULT 0,
        PRIMARY KEY (race_id, rider_id)
      )
    `).run();
        this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_rider_stage_race_state_race
      ON rider_stage_race_state(race_id, rider_id)
    `).run();
        const missingColumns = [
            ['incident_day_form_penalty', 'REAL NOT NULL DEFAULT 0'],
            ['incident_micro_form_penalty', 'REAL NOT NULL DEFAULT 0'],
            ['incident_stamina_penalty', 'REAL NOT NULL DEFAULT 0'],
            ['incident_day_form_cap', 'REAL'],
            ['race_recuperation_penalty', 'REAL NOT NULL DEFAULT 0'],
            ['current_recovery_penalty', 'REAL NOT NULL DEFAULT 0'],
            ['pending_recovery_penalty_1', 'REAL NOT NULL DEFAULT 0'],
            ['pending_recovery_penalty_2', 'REAL NOT NULL DEFAULT 0'],
            ['pending_recovery_penalty_3', 'REAL NOT NULL DEFAULT 0'],
        ];
        for (const [columnName, columnDefinition] of missingColumns) {
            if (!columnExists(this.db, 'rider_stage_race_state', columnName)) {
                this.db.prepare(`
          ALTER TABLE rider_stage_race_state
          ADD COLUMN ${columnName} ${columnDefinition}
        `).run();
            }
        }
    }
    attachFormDebugData(riders, season, currentDate) {
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
            };
        });
    }
    loadRiderFormHistoryByRiderId(riderIds, season) {
        const historyByRiderId = new Map();
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
    `).all(...riderIds, `${season}-01-01`, `${season}-10-31`);
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
    buildFormDebugSeries(rider, history, seasonStart, seasonEnd, currentDate) {
        const historyByDate = new Map(history.map((entry) => [entry.date, entry]));
        const points = [];
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
    getSeasonStandings(season = this.getCurrentSeason()) {
        this.syncSeasonPointEventsForSeason(season);
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
    `).all(season);
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
    `).all(season);
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
    `).all(season);
        return {
            season,
            riderStandings: this.mapRiderSeasonStandings(riderRows),
            teamStandings: this.mapTeamSeasonStandings(teamRows),
            countryStandings: this.mapCountrySeasonStandings(countryRows, riderRows),
        };
    }
    getStageById(id) {
        const row = this.db.prepare(`
      SELECT id, race_id, stage_number, date, profile, start_elevation, details_csv_file,
             final_spread_start_percent, final_push_start_percent, final_spread_difficulty_multiplier,
             crash_incident_multiplier, mechanical_incident_multiplier
      FROM stages
      WHERE id = ?
    `).get(id);
        return row ? mapStage(row) : null;
    }
    getPreviousGcStandings(raceId, stageNumber) {
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
    `).get(raceId, stageNumber, RESULT_TYPE_IDS.gc);
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
    `).all(previousStage.stage_id, RESULT_TYPE_IDS.gc);
        const leaderTime = rows[0]?.time_seconds ?? 0;
        return rows.map((row) => ({
            riderId: row.rider_id,
            rank: row.rank,
            timeSeconds: row.time_seconds,
            gapSeconds: row.time_seconds - leaderTime,
        }));
    }
    getPreviousGcStandingsForStage(stageId) {
        const stage = this.getStageById(stageId);
        if (!stage) {
            return [];
        }
        return this.getPreviousGcStandings(stage.raceId, stage.stageNumber);
    }
    getPreviousPointsStandings(raceId, stageNumber) {
        return this.getPreviousClassificationStandings(raceId, stageNumber, RESULT_TYPE_IDS.points);
    }
    getPreviousMountainStandings(raceId, stageNumber) {
        return this.getPreviousClassificationStandings(raceId, stageNumber, RESULT_TYPE_IDS.mountain);
    }
    getPreviousYouthStandings(raceId, stageNumber) {
        return this.getPreviousClassificationStandings(raceId, stageNumber, RESULT_TYPE_IDS.youth);
    }
    getPreviousClassificationLeaders(raceId, stageNumber) {
        return {
            gcLeaderRiderId: this.getPreviousClassificationLeaderRiderId(raceId, stageNumber, RESULT_TYPE_IDS.gc),
            pointsLeaderRiderId: this.getPreviousClassificationLeaderRiderId(raceId, stageNumber, RESULT_TYPE_IDS.points),
            mountainLeaderRiderId: this.getPreviousClassificationLeaderRiderId(raceId, stageNumber, RESULT_TYPE_IDS.mountain),
            youthLeaderRiderId: this.getPreviousClassificationLeaderRiderId(raceId, stageNumber, RESULT_TYPE_IDS.youth),
        };
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
        stages.profile AS profile,
        races.is_stage_race AS is_stage_race,
        races.number_of_stages AS number_of_stages
      FROM stages
      JOIN races ON races.id = stages.race_id
      WHERE stages.id = ?
    `).get(stageId);
        if (!meta)
            return null;
        const season = Number.parseInt(meta.date.slice(0, 4), 10);
        if (Number.isFinite(season)) {
            this.syncSeasonPointEventsForSeason(season);
        }
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
    `).all(stageId);
        if (rows.length === 0)
            return null;
        const uciPointsByRiderAndAwardType = this.loadStageUciPointsByRiderAndAwardType(stageId);
        const uciPointsByTeamId = this.loadStageUciPointsByTeamId(stageId);
        const fullyClassifiedRiderIds = meta.is_stage_race === 1
            ? new Set(this.getFullyClassifiedStageRaceRiderIds(meta.race_id, meta.stage_number))
            : null;
        const previousGcStandings = meta.stage_number > 1
            ? this.getPreviousGcStandingsForStage(stageId)
                .filter((standing) => fullyClassifiedRiderIds == null || fullyClassifiedRiderIds.has(standing.riderId))
            : [];
        const previousGcRanks = previousGcStandings.length > 0
            ? new Map(previousGcStandings.map((standing) => [standing.riderId, standing.rank]))
            : new Map();
        const groupedRows = new Map();
        for (const row of rows) {
            const bucket = groupedRows.get(row.result_type_id) ?? [];
            bucket.push(row);
            groupedRows.set(row.result_type_id, bucket);
        }
        const classifications = resultTypes
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
            const mappedRows = visibleRows.map((row, index) => {
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
            previousGcStandings,
            markerClassifications: tableExists(this.db, 'stage_marker_results')
                ? this.loadStageMarkerClassifications(stageId)
                : [],
            nonFinishers: this.loadStageNonFinishers(meta.race_id, meta.stage_number),
        };
    }
    loadStageNonFinishers(raceId, upToStageNumber) {
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
    `).all(raceId, upToStageNumber);
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
    loadStageMarkerClassifications(stageId) {
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
    `).all(stageId);
        const grouped = new Map();
        for (const row of rows) {
            const bucket = grouped.get(row.marker_key) ?? [];
            bucket.push(row);
            grouped.set(row.marker_key, bucket);
        }
        return [...grouped.entries()].map(([markerKey, markerRows]) => ({
            markerKey,
            markerLabel: markerRows[0]?.marker_label ?? markerKey,
            markerType: markerRows[0]?.marker_type,
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
        })).sort((left, right) => (resolveMarkerResultsSortPriority(left) - resolveMarkerResultsSortPriority(right)
            || left.kmMark - right.kmMark
            || left.markerLabel.localeCompare(right.markerLabel, 'de')
            || left.markerKey.localeCompare(right.markerKey, 'de')));
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
        stages.profile AS profile,
        races.is_stage_race AS is_stage_race,
        races.number_of_stages AS number_of_stages,
        race_categories_bonus.points_stage AS points_stage,
        race_categories_bonus.points_mountainstage AS points_mountainstage,
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
                    this.insertSeasonPointAwards(insert, season, stage, 'stage_result', stageRows, resolveStageResultPointValues(stage));
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
      SELECT id, race_id, stage_number, date, profile, start_elevation, details_csv_file,
            final_spread_start_percent, final_push_start_percent, final_spread_difficulty_multiplier,
            crash_incident_multiplier, mechanical_incident_multiplier
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
    createEmptyRiderStatsPayload(rider, currentSeasonRank, currentSeasonPoints, currentSeasonRaceDays, currentSeasonBreakawayAttempts, careerWins, careerRaceDaysBySeason, programSummary) {
        return {
            riderId: rider.id,
            riderName: `${rider.firstName} ${rider.lastName}`,
            teamId: rider.activeTeamId ?? null,
            teamName: rider.activeTeamId != null ? this.getTeamById(rider.activeTeamId)?.name ?? null : null,
            countryCode: rider.country?.code3 ?? rider.nationality ?? null,
            roleName: rider.role?.name ?? null,
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
        };
    }
    getCareerWins(riderId) {
        if (!tableExists(this.db, 'results')) {
            return 0;
        }
        const row = this.db.prepare(`
      SELECT COUNT(*) AS wins
      FROM results
      WHERE result_type_id = ?
        AND rider_id = ?
        AND rank = 1
    `).get(RESULT_TYPE_IDS.stage, riderId);
        return row?.wins ?? 0;
    }
    getSeasonBreakawayAttempts(season, riderId) {
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
    `).get(RESULT_TYPE_IDS.stage, riderId, season);
        return row?.attempts ?? 0;
    }
    getCareerRaceDaysBySeason(riderId) {
        if (!tableExists(this.db, 'results') || !tableExists(this.db, 'stages')) {
            return [];
        }
        return this.db.prepare(`
      SELECT
        CAST(substr(stages.date, 1, 4) AS INTEGER) AS season,
        COUNT(*) AS raceDays
      FROM stage_entries
      JOIN stages ON stages.id = stage_entries.stage_id
      WHERE stage_entries.status != 'dns'
        AND stage_entries.rider_id = ?
      GROUP BY CAST(substr(stages.date, 1, 4) AS INTEGER)
      ORDER BY season DESC
    `).all(riderId);
    }
    mapResultTypeIdToRiderStatsRowType(resultTypeId) {
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
    getRiderStatsFinalLabel(rowType) {
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
    getUpcomingStageSummary(stages, isStageRace, currentDate) {
        if (stages.length === 0)
            return undefined;
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
            }
            else {
                const completedStageIds = tableExists(this.db, 'results')
                    ? new Set(this.db.prepare(`
            SELECT DISTINCT stage_id
            FROM results
            WHERE result_type_id = ?
              AND stage_id IN (${orderedStages.map(() => '?').join(', ')})
          `).all(RESULT_TYPE_IDS.stage, ...orderedStages.map((stage) => stage.id)).map((row) => row.stage_id))
                    : new Set();
                selectedStage = orderedStages.find((stage) => stage.date <= currentDate && !completedStageIds.has(stage.id))
                    ?? orderedStages.find((stage) => stage.date >= currentDate && !completedStageIds.has(stage.id))
                    ?? orderedStages.find((stage) => stage.date >= currentDate)
                    ?? orderedStages.find((stage) => !completedStageIds.has(stage.id))
                    ?? orderedStages[orderedStages.length - 1];
            }
        }
        if (!selectedStage)
            return undefined;
        const summary = (0, StageParser_1.summarizeStageProfile)(selectedStage.detailsCsvFile, selectedStage.startElevation);
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
    loadStageUciPointsByRiderAndAwardType(stageId) {
        if (!tableExists(this.db, 'season_point_events')) {
            return new Map();
        }
        const rows = this.db.prepare(`
      SELECT rider_id, award_type, SUM(points_awarded) AS points_total
      FROM season_point_events
      WHERE stage_id = ?
      GROUP BY rider_id, award_type
    `).all(stageId);
        return new Map(rows.map((row) => [this.getStageUciPointKey(row.rider_id, row.award_type), row.points_total]));
    }
    loadStageUciPointsByTeamId(stageId) {
        if (!tableExists(this.db, 'season_point_events')) {
            return new Map();
        }
        const rows = this.db.prepare(`
      SELECT team_id, SUM(points_awarded) AS points_total
      FROM season_point_events
      WHERE stage_id = ? AND team_id IS NOT NULL
      GROUP BY team_id
    `).all(stageId);
        return new Map(rows.map((row) => [row.team_id, row.points_total]));
    }
    resolveStageRowUciPoints(meta, row, uciPointsByRiderAndAwardType, uciPointsByTeamId) {
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
        return awardTypes.reduce((sum, awardType) => sum + (uciPointsByRiderAndAwardType.get(this.getStageUciPointKey(row.rider_id, awardType)) ?? 0), 0);
    }
    getAwardTypesForStageResult(meta, resultTypeId) {
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
    getStageUciPointKey(riderId, awardType) {
        return `${riderId}:${awardType}`;
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
            countryName: row.country_name,
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
            countryName: row.country_name,
            points: row.points_total,
            gapPoints: leaderPoints - row.points_total,
        }));
    }
    mapCountrySeasonStandings(rows, riderRows) {
        const leaderPoints = rows[0]?.points_total ?? 0;
        const ridersByCountryCode = new Map();
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
    getPreviousClassificationLeaderRiderId(raceId, stageNumber, resultTypeId) {
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
    `).get(raceId, stageNumber, resultTypeId);
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
    `).get(previousStage.stage_id, resultTypeId);
        return row?.rider_id ?? null;
    }
    getPreviousClassificationStandings(raceId, stageNumber, resultTypeId) {
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
    `).get(raceId, stageNumber, resultTypeId);
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
    `).all(previousStage.stage_id, resultTypeId);
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
exports.GameRepository = GameRepository;
