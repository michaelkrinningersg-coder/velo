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
exports.DIVISION_BY_TIER = exports.SEASON_FORM_RISE_STEP_RAW = exports.SEASON_FORM_MAX_RAW = exports.SEASON_FORM_FALL_DAYS = exports.SEASON_FORM_RISE_DAYS = exports.RIDER_SKILL_COLUMNS = exports.SEASON_POINT_AWARD_TYPES = exports.RACE_FORM_BUILD_SOURCE_AMOUNT = exports.RESULT_TYPE_IDS = void 0;
exports.isMountainClassificationType = isMountainClassificationType;
exports.resolveMarkerResultsSortPriority = resolveMarkerResultsSortPriority;
exports.emptyRiderStatsPointsByTerrain = emptyRiderStatsPointsByTerrain;
exports.emptyRiderStatsPointsByRaceFormat = emptyRiderStatsPointsByRaceFormat;
exports.resolveRiderStatsTerrainBucket = resolveRiderStatsTerrainBucket;
exports.resolveDataCsvDir = resolveDataCsvDir;
exports.parseCsvLine = parseCsvLine;
exports.parseRaceList = parseRaceList;
exports.parseRankedValues = parseRankedValues;
exports.parsePeakDates = parsePeakDates;
exports.usesMountainStagePoints = usesMountainStagePoints;
exports.resolveStageResultPointValues = resolveStageResultPointValues;
exports.isoDateToDayNumber = isoDateToDayNumber;
exports.randomBetween = randomBetween;
exports.roundToTwoDecimals = roundToTwoDecimals;
exports.addDaysIso = addDaysIso;
exports.resolveStageRaceBaseFatigue = resolveStageRaceBaseFatigue;
exports.resolveStageRaceFatigueMalus = resolveStageRaceFatigueMalus;
exports.resolveEffectiveRecuperationSkill = resolveEffectiveRecuperationSkill;
exports.resolvePeakPhase = resolvePeakPhase;
exports.resolveDeclineValue = resolveDeclineValue;
exports.resolveEffectiveSeasonForm = resolveEffectiveSeasonForm;
exports.resolveProjectionPoint = resolveProjectionPoint;
exports.resolveRiderSeasonFormPhase = resolveRiderSeasonFormPhase;
exports.tableExists = tableExists;
exports.columnExists = columnExists;
exports.mapSkillObject = mapSkillObject;
exports.mapCountry = mapCountry;
exports.mapRole = mapRole;
exports.mapRider = mapRider;
exports.mapTeam = mapTeam;
exports.mapRaceCategoryBonus = mapRaceCategoryBonus;
exports.mapRaceCategory = mapRaceCategory;
exports.mapStageScoringRule = mapStageScoringRule;
exports.mapSkillWeightRule = mapSkillWeightRule;
exports.mapStage = mapStage;
exports.loadFallbackStages = loadFallbackStages;
exports.mapRace = mapRace;
exports.mapRaceProgram = mapRaceProgram;
exports.mapRaceWithSummary = mapRaceWithSummary;
exports.buildRaceSelect = buildRaceSelect;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const skillWeights_1 = require("../../../shared/skillWeights");
const RiderLoadModel_1 = require("../game/RiderLoadModel");
const StageParser_1 = require("../simulation/StageParser");
exports.RESULT_TYPE_IDS = {
    stage: 1,
    gc: 2,
    points: 3,
    mountain: 4,
    youth: 5,
    team: 6,
};
exports.RACE_FORM_BUILD_SOURCE_AMOUNT = 0.25;
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
exports.SEASON_POINT_AWARD_TYPES = [
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
exports.RIDER_SKILL_COLUMNS = [
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
exports.SEASON_FORM_RISE_DAYS = 42;
exports.SEASON_FORM_FALL_DAYS = 14;
exports.SEASON_FORM_MAX_RAW = 6;
exports.SEASON_FORM_RISE_STEP_RAW = exports.SEASON_FORM_MAX_RAW / exports.SEASON_FORM_RISE_DAYS;
exports.DIVISION_BY_TIER = {
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
        timetrial: 0,
        cobble: 0,
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
        case 'ITT':
        case 'TTT':
            return 'timetrial';
        case 'Cobble':
        case 'Cobble_Hill':
            return 'cobble';
        case 'Hilly':
        case 'Hilly_Difficult':
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
        if (currentDay >= peakDay && currentDay < peakDay + exports.SEASON_FORM_FALL_DAYS) {
            return { phase: 'decline', peakDate, elapsedDays: currentDay - peakDay };
        }
        if (currentDay >= peakDay - exports.SEASON_FORM_RISE_DAYS && currentDay < peakDay) {
            return { phase: 'build', peakDate, elapsedDays: peakDay - currentDay };
        }
    }
    return null;
}
function resolveDeclineValue(peakValue, elapsedDays) {
    if (elapsedDays >= exports.SEASON_FORM_FALL_DAYS) {
        return 0;
    }
    const boundedPeakValue = Math.min(exports.SEASON_FORM_MAX_RAW, Math.max(0, peakValue));
    return roundToTwoDecimals(Math.max(0, boundedPeakValue * (1 - (elapsedDays / exports.SEASON_FORM_FALL_DAYS))));
}
function resolveEffectiveSeasonForm(rawSeasonForm) {
    return roundToTwoDecimals(Math.min(exports.SEASON_FORM_MAX_RAW, Math.max(0, rawSeasonForm)));
}
function resolveProjectionPoint(date, peakDates) {
    const phase = resolvePeakPhase(date, peakDates);
    if (!phase) {
        return { sForm: 0, rForm: 0 };
    }
    if (phase.phase === 'build') {
        const sFormRaw = roundToTwoDecimals(Math.min(exports.SEASON_FORM_MAX_RAW, Math.max(0, (exports.SEASON_FORM_RISE_DAYS - phase.elapsedDays + 1) * exports.SEASON_FORM_RISE_STEP_RAW)));
        const sForm = resolveEffectiveSeasonForm(sFormRaw);
        return { sForm, rForm: 0 };
    }
    return {
        sForm: resolveEffectiveSeasonForm(resolveDeclineValue(exports.SEASON_FORM_MAX_RAW, phase.elapsedDays)),
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
    const entries = exports.RIDER_SKILL_COLUMNS.map(([key, column]) => [key, row[`${prefix}${column}`]]);
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
    const weights = exports.RIDER_SKILL_COLUMNS.reduce((result, [skillKey, columnSuffix]) => {
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
