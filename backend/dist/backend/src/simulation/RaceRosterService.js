"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewRaceRoster = previewRaceRoster;
exports.previewRaceRosterEditor = previewRaceRosterEditor;
exports.applyRaceRosterSelection = applyRaceRosterSelection;
exports.ensureRaceEntries = ensureRaceEntries;
exports.refreshRaceEntriesForRaceStart = refreshRaceEntriesForRaceStart;
const mappers_1 = require("../db/mappers");
const DIVISION_BY_TIER = {
    1: 'WorldTour',
    2: 'ProTour',
    3: 'U23',
};
const DEFAULT_ROLE_REQUIREMENTS = {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 2,
    6: 1,
};
const COBBLE_SELECTION_MIN_SKILL = 65;
const RIDER_LOCK_MESSAGES = {
    'already-raced-today': 'Heute bereits in einem anderen Rennen gestartet.',
    'active-stage-race': 'Aktuell noch in einer anderen Rundfahrt gebunden.',
    unavailable: 'Aktuell krank oder verletzt und nicht startberechtigt.',
    'winter-break': 'Winterpause zur Erholung (15.10. - 15.02.).',
    'low-category-exclusion': 'Nicht startberechtigt für Low-Kategorie Rennen (Kapitän / bester Co-Kapitän / bester Sprinter).',
    'cobble-climber-exclusion': 'Bergfahrer (Spec 1/2) ohne Cobble-Skill >= 72 sind nicht startberechtigt bei Pflasterrennen.',
    'fatigue-exclusion': 'Zu erschöpft für den Start eines neuen Rennens (Kurzzeit > 10 oder Gesamt > 11).',
};
function createDeterministicRandom(seed) {
    let state = seed >>> 0;
    return () => {
        state = (state * 1664525 + 1013904223) >>> 0;
        return state / 0x100000000;
    };
}
function shuffleDeterministically(items, seed) {
    const shuffled = [...items];
    const random = createDeterministicRandom(seed);
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
}
function shuffleRandomly(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
}
function canCustomizeRoster(race, stage) {
    return race.id > 0 && stage.id > 0;
}
function getPlayerTeam(repo) {
    const playerTeam = repo.getTeams().find((team) => team.isPlayerTeam);
    if (!playerTeam) {
        throw new Error('Es konnte kein Spielerteam gefunden werden.');
    }
    return playerTeam;
}
function groupRidersByTeam(riders) {
    const ridersByTeamId = new Map();
    for (const rider of riders) {
        if (rider.activeTeamId == null) {
            continue;
        }
        const teamRiders = ridersByTeamId.get(rider.activeTeamId) ?? [];
        teamRiders.push(rider);
        ridersByTeamId.set(rider.activeTeamId, teamRiders);
    }
    return ridersByTeamId;
}
function buildRiderLockMap(db, repo, race, riders = repo.getRiders()) {
    const currentDate = repo.getCurrentDate();
    const locks = new Map();
    let hasCobbleStage = false;
    if (race && race.id) {
        const row = db.prepare(`
      SELECT COUNT(*) AS count
      FROM stages
      WHERE race_id = ? AND (profile = 'Cobble' OR profile = 'Cobble_Hill')
    `).get(race.id);
        hasCobbleStage = (row?.count ?? 0) > 0;
    }
    const currentStageRow = race && race.id
        ? db.prepare('SELECT stage_number FROM stages WHERE race_id = ? AND date = ?').get(race.id, currentDate)
        : undefined;
    const currentStageNumber = currentStageRow?.stage_number ?? 1;
    for (const rider of riders) {
        let isContinuingStageRace = false;
        if (race && race.isStageRace && currentStageNumber > 1) {
            const hasEntry = db.prepare('SELECT 1 FROM race_entries WHERE race_id = ? AND rider_id = ?').get(race.id, rider.id);
            if (hasEntry) {
                isContinuingStageRace = true;
            }
        }
        if (rider.isUnavailable) {
            locks.set(rider.id, 'unavailable');
        }
        else {
            const shortTerm = rider.shortTermFatigueMalus ?? 0.0;
            const longTerm = rider.longTermFatigueMalus ?? 0.0;
            if (!isContinuingStageRace && (shortTerm > 10.0 || (shortTerm + longTerm) > 11.0)) {
                locks.set(rider.id, 'fatigue-exclusion');
            }
            else if (hasCobbleStage) {
                const isBerg = rider.specialization1 === 'Berg' || rider.specialization2 === 'Berg';
                const hasCobbleSkill = (rider.skills?.cobble ?? 0) >= 72;
                if (isBerg && !hasCobbleSkill) {
                    locks.set(rider.id, 'cobble-climber-exclusion');
                }
            }
        }
    }
    if ((0, mappers_1.isWinterBreak)(currentDate)) {
        const ridersByTeamId = groupRidersByTeam(riders);
        for (const teamRiders of ridersByTeamId.values()) {
            const topTwo = [...teamRiders].sort((a, b) => b.overallRating - a.overallRating).slice(0, 2);
            for (const rider of topTwo) {
                if (!locks.has(rider.id)) {
                    locks.set(rider.id, 'winter-break');
                }
            }
        }
    }
    if (race && (race.categoryId === 6 || race.categoryId === 9)) {
        const ridersByTeamId = groupRidersByTeam(riders);
        for (const teamRiders of ridersByTeamId.values()) {
            // Find the best Co-Captain (roleId === 2)
            const coCaptains = teamRiders.filter((r) => r.roleId === 2);
            if (coCaptains.length > 0) {
                coCaptains.sort((a, b) => b.overallRating - a.overallRating || a.lastName.localeCompare(b.lastName, 'de') || a.firstName.localeCompare(b.firstName, 'de') || a.id - b.id);
                const bestCoCap = coCaptains[0];
                if (!locks.has(bestCoCap.id)) {
                    locks.set(bestCoCap.id, 'low-category-exclusion');
                }
            }
            // Find the best Sprinter (roleId === 6)
            const sprinters = teamRiders.filter((r) => r.roleId === 6);
            if (sprinters.length > 0) {
                sprinters.sort((a, b) => b.overallRating - a.overallRating || a.lastName.localeCompare(b.lastName, 'de') || a.firstName.localeCompare(b.firstName, 'de') || a.id - b.id);
                const bestSprinter = sprinters[0];
                if (!locks.has(bestSprinter.id)) {
                    locks.set(bestSprinter.id, 'low-category-exclusion');
                }
            }
            // Lock all Captains (roleId === 1)
            const captains = teamRiders.filter((r) => r.roleId === 1);
            for (const cap of captains) {
                if (!locks.has(cap.id)) {
                    locks.set(cap.id, 'low-category-exclusion');
                }
            }
        }
    }
    const sameDayRows = db.prepare(`
    SELECT DISTINCT results.rider_id AS rider_id
    FROM results
    JOIN stages ON stages.id = results.stage_id
    WHERE results.result_type_id = 1
      AND results.rider_id IS NOT NULL
      AND stages.date = ?
      AND stages.race_id != ?
  `).all(currentDate, race.id);
    for (const row of sameDayRows) {
        if (!locks.has(row.rider_id)) {
            locks.set(row.rider_id, 'already-raced-today');
        }
    }
    const activeStageRaceRows = db.prepare(`
    SELECT DISTINCT re.rider_id AS rider_id
    FROM race_entries re
    JOIN races race_entries_race ON race_entries_race.id = re.race_id
    WHERE race_entries_race.is_stage_race = 1
      AND re.race_id != ?
      AND EXISTS (
        SELECT 1
        FROM stages remaining_stage
        WHERE remaining_stage.race_id = re.race_id
          AND remaining_stage.date >= ?
          AND NOT EXISTS (
            SELECT 1
            FROM results remaining_result
            WHERE remaining_result.stage_id = remaining_stage.id
              AND remaining_result.result_type_id = 1
          )
      )
  `).all(race.id, currentDate);
    for (const row of activeStageRaceRows) {
        if (!locks.has(row.rider_id)) {
            locks.set(row.rider_id, 'active-stage-race');
        }
    }
    return locks;
}
function getEligibleRiders(roster, riderLocks) {
    return roster.filter((rider) => !riderLocks.has(rider.id));
}
function isCobbleStage(stage) {
    return stage.profile === 'Cobble' || stage.profile === 'Cobble_Hill';
}
function resolveRoleRequirements() {
    return Object.entries(DEFAULT_ROLE_REQUIREMENTS)
        .map(([roleId, count]) => ({ roleId: Number(roleId), count }))
        .filter((requirement) => Number.isFinite(requirement.roleId) && requirement.count > 0)
        .sort((left, right) => left.roleId - right.roleId);
}
function resolveRoleName(roleNameById, roleId) {
    if (roleId == null) {
        return 'Restplatz';
    }
    return roleNameById.get(roleId) ?? `Rolle ${roleId}`;
}
function orderCandidatesForStage(candidates, stage, seed, useTrueRandom = false) {
    const shuffled = useTrueRandom
        ? shuffleRandomly(candidates)
        : shuffleDeterministically(candidates, seed);
    if (!isCobbleStage(stage)) {
        return shuffled;
    }
    const cobbleReady = shuffled.filter((rider) => rider.skills.cobble >= COBBLE_SELECTION_MIN_SKILL);
    const fallback = shuffled
        .filter((rider) => rider.skills.cobble < COBBLE_SELECTION_MIN_SKILL)
        .sort((left, right) => right.skills.cobble - left.skills.cobble || left.id - right.id);
    return [...cobbleReady, ...fallback];
}
function logAutomaticRosterSelection(team, race, stage, entries) {
    console.log(`[RaceRoster] ${race.name} | ${formatStageDebugLabel(stage)} | ${team.name} | ${entries.length} Fahrer automatisch ausgewaehlt`);
    entries.forEach((entry, index) => {
        const riderRoleId = entry.rider.roleId ?? null;
        const riderRoleName = entry.rider.role?.name ?? `Rolle ${riderRoleId ?? 'unbekannt'}`;
        const targetRoleLabel = entry.targetRoleId == null ? 'Restplatz' : `Sollrolle ${entry.targetRoleId}`;
        const reasonText = entry.reasons.length > 0 ? entry.reasons.join('; ') : 'ohne Abweichung';
        console.log(`  ${index + 1}. ${entry.rider.firstName} ${entry.rider.lastName} | role_id=${riderRoleId ?? 'null'} (${riderRoleName}) | ${targetRoleLabel} | Phase=${entry.phase} | ${reasonText}`);
    });
}
function formatStageDebugLabel(stage) {
    return `Etappe ${stage.stageNumber} ${stage.profile}`;
}
function selectRaceRoster(team, eligibleRoster, targetCount, raceId, race, stage) {
    const requestedCount = Math.min(targetCount, eligibleRoster.length);
    if (requestedCount <= 0) {
        return [];
    }
    const roleRequirements = resolveRoleRequirements();
    const roleNameById = new Map();
    eligibleRoster.forEach((rider) => {
        if (rider.roleId != null && rider.role?.name) {
            roleNameById.set(rider.roleId, rider.role.name);
        }
    });
    const roleIdsAscending = Array.from(new Set([
        ...roleRequirements.map((requirement) => requirement.roleId),
        ...eligibleRoster.map((rider) => rider.roleId).filter((roleId) => roleId != null),
    ])).sort((left, right) => left - right);
    const roleIdsDescending = [...roleIdsAscending].sort((left, right) => right - left);
    const selectedIds = new Set();
    const selected = [];
    let seedOffset = 0;
    const addSelection = (rider, targetRoleId, phase, reasons) => {
        selected.push({ rider, targetRoleId, phase, reasons });
        selectedIds.add(rider.id);
    };
    const takeCandidates = (roleId, takeCount, targetRoleId, phase, extraReason) => {
        if (takeCount <= 0) {
            return 0;
        }
        const orderedCandidates = orderCandidatesForStage(eligibleRoster.filter((rider) => !selectedIds.has(rider.id) && rider.roleId === roleId), stage, raceId * 1000 + team.id * 100 + seedOffset, phase === 'fill');
        let taken = 0;
        for (const rider of orderedCandidates.slice(0, takeCount)) {
            const reasons = extraReason ? [extraReason] : [];
            if (isCobbleStage(stage) && rider.skills.cobble < COBBLE_SELECTION_MIN_SKILL) {
                reasons.push(`Cobble-Filter nicht voll erfuellbar, ${rider.skills.cobble} Cobble nachgerueckt`);
            }
            addSelection(rider, targetRoleId, phase, reasons);
            taken += 1;
        }
        seedOffset += 1;
        return taken;
    };
    for (const requirement of roleRequirements) {
        if (selected.length >= requestedCount) {
            break;
        }
        const desiredCount = Math.min(requirement.count, requestedCount - selected.length);
        let filled = takeCandidates(requirement.roleId, desiredCount, requirement.roleId, 'exact');
        if (filled >= desiredCount) {
            continue;
        }
        for (const replacementRoleId of roleIdsAscending) {
            if (replacementRoleId <= requirement.roleId || filled >= desiredCount) {
                continue;
            }
            filled += takeCandidates(replacementRoleId, desiredCount - filled, requirement.roleId, 'replacement', `Exakte Rolle ${resolveRoleName(roleNameById, requirement.roleId)} nicht verfuegbar, ersetzt durch ${resolveRoleName(roleNameById, replacementRoleId)}`);
        }
    }
    if (selected.length < requestedCount) {
        for (const roleId of roleIdsDescending) {
            if (selected.length >= requestedCount) {
                break;
            }
            takeCandidates(roleId, requestedCount - selected.length, roleId, 'fill', 'Restplatz von unten nach oben aufgefuellt');
        }
    }
    if (selected.length < requestedCount) {
        const remaining = orderCandidatesForStage(eligibleRoster.filter((rider) => !selectedIds.has(rider.id)), stage, raceId * 1000 + team.id * 100 + 997, true);
        for (const rider of remaining.slice(0, requestedCount - selected.length)) {
            const reasons = ['Restplatz ohne verwertbare Rollenbindung aufgefuellt'];
            if (isCobbleStage(stage) && rider.skills.cobble < COBBLE_SELECTION_MIN_SKILL) {
                reasons.push(`Cobble-Filter nicht voll erfuellbar, ${rider.skills.cobble} Cobble nachgerueckt`);
            }
            addSelection(rider, rider.roleId ?? null, 'fill', reasons);
        }
    }
    return selected;
}
function resolveParticipatingTeams(repo, race, riderLocks, ridersByTeamId) {
    const targetDivision = DIVISION_BY_TIER[race.category?.tier ?? 1];
    const existingEntries = repo.getRaceRiders(race.id);
    if (existingEntries.length > 0) {
        const existingTeamIds = new Set(existingEntries.map((rider) => rider.activeTeamId).filter((teamId) => teamId != null));
        return repo.getTeams().filter((team) => existingTeamIds.has(team.id));
    }
    const riderLimit = race.category?.numberOfRiders ?? 0;
    return repo.getTeams()
        .filter((team) => team.division === targetDivision)
        .filter((team) => getEligibleRiders(ridersByTeamId.get(team.id) ?? [], riderLocks).length >= riderLimit)
        .slice(0, race.category?.numberOfTeams ?? 0);
}
function buildLegacyRaceRoster(db, repo, race, stage, enableDebug = false) {
    const riders = repo.getRiders();
    const ridersByTeamId = groupRidersByTeam(riders);
    const riderLocks = buildRiderLockMap(db, repo, race, riders);
    const eligibleTeams = resolveParticipatingTeams(repo, race, riderLocks, ridersByTeamId);
    return eligibleTeams
        .flatMap((team) => {
        const selectedEntries = selectRaceRoster(team, getEligibleRiders(ridersByTeamId.get(team.id) ?? [], riderLocks), race.category?.numberOfRiders ?? 0, race.id, race, stage);
        if (enableDebug) {
            logAutomaticRosterSelection(team, race, stage, selectedEntries);
        }
        return selectedEntries.map((entry) => entry.rider);
    })
        .sort((left, right) => right.overallRating - left.overallRating || left.id - right.id);
}
function resolveProgramPhasePriority(rider) {
    if (rider.seasonFormPhase === 'rise')
        return 0;
    if (rider.seasonFormPhase === 'fall')
        return 2;
    return 1;
}
function isNeutralPhase(rider) {
    return rider.seasonFormPhase === 'neutral' || rider.seasonFormPhase == null;
}
function orderProgramCandidates(candidates) {
    return [...candidates].sort((left, right) => {
        const phaseCompare = resolveProgramPhasePriority(left) - resolveProgramPhasePriority(right);
        if (phaseCompare !== 0)
            return phaseCompare;
        return right.overallRating - left.overallRating || left.id - right.id;
    });
}
function hasActiveOrEarmarkedCollision(db, repo, rider, teamRiders, season, targetRace, riderLocks) {
    const overlappingRaces = db.prepare(`
    SELECT id, name, category_id, start_date, end_date
    FROM races
    WHERE id != ?
      AND start_date <= ?
      AND end_date >= ?
  `).all(targetRace.id, targetRace.endDate, targetRace.startDate);
    for (const overlapRace of overlappingRaces) {
        const entriesCountRow = db.prepare(`
      SELECT COUNT(*) AS count
      FROM race_entries
      WHERE race_id = ? AND team_id = ?
    `).get(overlapRace.id, rider.activeTeamId);
        const isRosterFinalized = (entriesCountRow?.count ?? 0) > 0;
        if (isRosterFinalized) {
            const hasEntry = db.prepare(`
        SELECT 1
        FROM race_entries
        WHERE race_id = ? AND rider_id = ?
      `).get(overlapRace.id, rider.id);
            if (hasEntry) {
                return true;
            }
        }
        else {
            const overlapPrograms = repo.getRaceProgramsForRace(overlapRace.id);
            if (overlapPrograms.length > 0) {
                const programIds = new Set(overlapPrograms.map((p) => p.id));
                if (rider.seasonProgram != null && programIds.has(rider.seasonProgram.id)) {
                    const overlapRoster = teamRiders.filter((r) => {
                        return r.seasonProgram != null && programIds.has(r.seasonProgram.id) && !r.isUnavailable;
                    });
                    const orderedCandidates = orderProgramCandidates(overlapRoster);
                    const categoryRow = db.prepare(`
            SELECT number_of_riders
            FROM race_categories
            WHERE id = ?
          `).get(overlapRace.categoryId);
                    const limit = categoryRow?.number_of_riders ?? 8;
                    const earmarked = orderedCandidates.slice(0, limit);
                    if (earmarked.some((r) => r.id === rider.id)) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
function canFillRosterSlot(db, repo, rider, teamRiders, riderLocks, season, race) {
    if (rider.roleId == null) {
        return false;
    }
    const name = race.category?.name ?? '';
    const isMonumentOrGrandTour = name.includes('Monument') || name.includes('Grand Tour') || name.includes('Tour de France');
    const isHighCategory = name.includes('Stage Race High') || name.includes('One Day High');
    if (isMonumentOrGrandTour) {
        // Monument/Grand Tour: Captain (1), Co-Captain (2), Sprinter (6), Edelhelfer (3), Starke Helfer (4), Wasserträger (5)
        if (![1, 2, 6, 3, 4, 5].includes(rider.roleId)) {
            return false;
        }
    }
    else if (isHighCategory) {
        // High category: Edelhelfer (3), Starke Helfer (4), Wasserträger (5)
        if (![3, 4, 5].includes(rider.roleId)) {
            return false;
        }
    }
    else {
        // Other (Middle/Low): Edelhelfer (3), Starke Helfer (4), Wasserträger (5), Sprinter (6)
        if (![3, 4, 5, 6].includes(rider.roleId)) {
            return false;
        }
    }
    return !hasActiveOrEarmarkedCollision(db, repo, rider, teamRiders, season, race, riderLocks);
}
function orderFillCandidates(candidates, race) {
    const name = race.category?.name ?? '';
    const isMonumentOrGrandTour = name.includes('Monument') || name.includes('Grand Tour') || name.includes('Tour de France');
    const isHighCategory = name.includes('Stage Race High') || name.includes('One Day High');
    if (isMonumentOrGrandTour) {
        const roleOrder = [1, 2, 6, 3, 4, 5];
        return [...candidates].sort((left, right) => {
            const idxLeft = roleOrder.indexOf(left.roleId ?? 0);
            const idxRight = roleOrder.indexOf(right.roleId ?? 0);
            const pLeft = idxLeft === -1 ? 99 : idxLeft;
            const pRight = idxRight === -1 ? 99 : idxRight;
            if (pLeft !== pRight) {
                return pLeft - pRight;
            }
            return (right.overallRating ?? 0) - (left.overallRating ?? 0) || left.id - right.id;
        });
    }
    if (isHighCategory) {
        const roleOrder = [3, 4, 5];
        return [...candidates].sort((left, right) => {
            const idxLeft = roleOrder.indexOf(left.roleId ?? 0);
            const idxRight = roleOrder.indexOf(right.roleId ?? 0);
            const pLeft = idxLeft === -1 ? 99 : idxLeft;
            const pRight = idxRight === -1 ? 99 : idxRight;
            if (pLeft !== pRight) {
                return pLeft - pRight;
            }
            return (right.overallRating ?? 0) - (left.overallRating ?? 0) || left.id - right.id;
        });
    }
    // Other races: Middle, Low, etc.
    const roleOrder = [5, 4, 3, 6];
    return [...candidates].sort((left, right) => {
        const idxLeft = roleOrder.indexOf(left.roleId ?? 0);
        const idxRight = roleOrder.indexOf(right.roleId ?? 0);
        const pLeft = idxLeft === -1 ? 99 : idxLeft;
        const pRight = idxRight === -1 ? 99 : idxRight;
        if (pLeft !== pRight) {
            return pLeft - pRight;
        }
        if (left.roleId === 6) {
            // Sprinters: weak to strong overall rating
            return (left.overallRating ?? 0) - (right.overallRating ?? 0) || left.id - right.id;
        }
        else {
            // Wasserträger, Starke Helfer, Edelhelfer: fewest race days first
            return (left.seasonRaceDays ?? 0) - (right.seasonRaceDays ?? 0) || left.id - right.id;
        }
    });
}
function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}
function buildRaceRoster(db, repo, race, stage, enableDebug = false) {
    const season = repo.getCurrentSeason();
    const racePrograms = repo.getRaceProgramsForRace(race.id);
    if (racePrograms.length === 0) {
        return buildLegacyRaceRoster(db, repo, race, stage, enableDebug);
    }
    const riders = repo.getRiders();
    const programIds = new Set(racePrograms.map((program) => program.id));
    const riderLocks = buildRiderLockMap(db, repo, race, riders);
    const targetDivision = DIVISION_BY_TIER[race.category?.tier ?? 1];
    const riderLimit = race.category?.numberOfRiders ?? 0;
    const teamLimit = race.category?.numberOfTeams ?? 0;
    const ridersByTeamId = groupRidersByTeam(riders);
    const selectedTeams = repo.getTeams()
        .filter((team) => team.division === targetDivision)
        .filter((team) => (ridersByTeamId.get(team.id) ?? []).some((rider) => rider.seasonProgram != null && programIds.has(rider.seasonProgram.id)))
        .slice(0, teamLimit);
    const selected = selectedTeams.flatMap((team) => {
        const teamFullRoster = ridersByTeamId.get(team.id) ?? [];
        const roster = getEligibleRiders(teamFullRoster, riderLocks);
        const programCandidates = orderProgramCandidates(roster.filter((rider) => rider.seasonProgram != null && programIds.has(rider.seasonProgram.id)));
        const teamSelection = programCandidates.slice(0, riderLimit);
        const selectedIds = new Set(teamSelection.map((rider) => rider.id));
        if (teamSelection.length < riderLimit) {
            let fillCandidates;
            if (!race.isStageRace && (stage.profile === 'Cobble' || stage.profile === 'Cobble_Hill')) {
                fillCandidates = roster
                    .filter((rider) => !selectedIds.has(rider.id) && !hasActiveOrEarmarkedCollision(db, repo, rider, teamFullRoster, season, race, riderLocks))
                    .sort((a, b) => b.skills.cobble - a.skills.cobble || a.id - b.id);
            }
            else {
                fillCandidates = orderFillCandidates(roster.filter((rider) => !selectedIds.has(rider.id) && canFillRosterSlot(db, repo, rider, teamFullRoster, riderLocks, season, race)), race);
            }
            for (const rider of fillCandidates.slice(0, riderLimit - teamSelection.length)) {
                teamSelection.push(rider);
                selectedIds.add(rider.id);
            }
        }
        if (enableDebug) {
            const underfilled = teamSelection.length < riderLimit ? ` | unterbesetzt ${teamSelection.length}/${riderLimit}` : '';
            console.log(`[RaceRoster] ${race.name} | ${formatStageDebugLabel(stage)} | ${team.name} | ${teamSelection.length} Programmfahrer/Fuellfahrer ausgewaehlt${underfilled}`);
            teamSelection.forEach((rider, index) => {
                const source = programCandidates.some((candidate) => candidate.id === rider.id) ? 'Programm' : 'Fuellung';
                console.log(`  ${index + 1}. ${rider.firstName} ${rider.lastName} | ${source} | Phase=${rider.seasonFormPhase ?? 'neutral'} | Rolle=${rider.role?.name ?? rider.roleId ?? 'unbekannt'} | Renntage=${rider.seasonRaceDays ?? 0}`);
            });
        }
        return teamSelection;
    });
    return selected.sort((left, right) => right.overallRating - left.overallRating || left.id - right.id);
}
function previewRaceRoster(db, repo, race, stage) {
    const existingEntries = repo.getRaceRiders(race.id);
    if (existingEntries.length > 0) {
        if (race.isStageRace) {
            repo.prepareStageRaceFatigue(race.id, stage.stageNumber, existingEntries.map((rider) => rider.id));
        }
        repo.ensureStageEntries(stage);
        return repo.getStageRiders(stage.id);
    }
    const selected = buildRaceRoster(db, repo, race, stage);
    if (race.isStageRace) {
        repo.prepareStageRaceFatigue(race.id, stage.stageNumber, selected.map((rider) => rider.id));
        return repo.attachStageRaceFatigue(race.id, selected, stage.stageNumber);
    }
    return selected;
}
function previewRaceRosterEditor(db, repo, race, stage) {
    const riderLocks = buildRiderLockMap(db, repo, race);
    const selectedIds = new Set(previewRaceRoster(db, repo, race, stage).map((rider) => rider.id));
    const playerTeam = getPlayerTeam(repo);
    const teams = [{
            team: playerTeam,
            riderLimit: race.category?.numberOfRiders ?? 0,
            riders: repo.getRiders(playerTeam.id).map((rider) => {
                const lockReason = riderLocks.get(rider.id) ?? null;
                return {
                    rider,
                    isSelected: selectedIds.has(rider.id),
                    isLocked: lockReason != null,
                    lockReason: lockReason ? RIDER_LOCK_MESSAGES[lockReason] : null,
                };
            }),
        }];
    return {
        race,
        stage,
        teams,
    };
}
function applyRaceRosterSelection(db, repo, race, stage, riderIds) {
    if (!canCustomizeRoster(race, stage)) {
        throw new Error('Das Starterfeld kann für dieses Rennen jetzt nicht mehr bearbeitet werden.');
    }
    const riderLocks = buildRiderLockMap(db, repo, race);
    const selectedRiderIds = new Set(riderIds.filter((riderId) => Number.isInteger(riderId)));
    const playerTeam = getPlayerTeam(repo);
    const riderLimit = race.category?.numberOfRiders ?? 0;
    const playerRoster = repo.getRiders(playerTeam.id);
    const rosterById = new Map(playerRoster.map((rider) => [rider.id, rider]));
    const validatedSelections = [...selectedRiderIds]
        .map((riderId) => rosterById.get(riderId) ?? null)
        .filter((rider) => rider != null);
    if (validatedSelections.length !== riderLimit) {
        throw new Error(`${playerTeam.name} muss genau ${riderLimit} Fahrer fuer das Starterfeld stellen.`);
    }
    for (const rider of validatedSelections) {
        const lockReason = riderLocks.get(rider.id);
        if (lockReason) {
            throw new Error(`${rider.firstName} ${rider.lastName} ist gesperrt: ${RIDER_LOCK_MESSAGES[lockReason]}`);
        }
    }
    const participatingRiderIds = new Set(validatedSelections.map((rider) => rider.id));
    const unknownSelection = [...selectedRiderIds].find((riderId) => !participatingRiderIds.has(riderId));
    if (unknownSelection != null) {
        throw new Error('Die Auswahl enthält Fahrer ausserhalb deines Teams.');
    }
    const autoEntries = previewRaceRoster(db, repo, race, stage).filter((rider) => rider.activeTeamId !== playerTeam.id);
    const finalSelections = [...autoEntries, ...validatedSelections];
    const deleteEntries = db.prepare('DELETE FROM race_entries WHERE race_id = ?');
    const insertEntry = db.prepare('INSERT OR IGNORE INTO race_entries (race_id, team_id, rider_id) VALUES (?, ?, ?)');
    db.transaction(() => {
        deleteEntries.run(race.id);
        repo.clearStageEntries(stage.id);
        for (const rider of finalSelections) {
            if (rider.activeTeamId == null) {
                continue;
            }
            insertEntry.run(race.id, rider.activeTeamId, rider.id);
        }
    })();
    repo.ensureStageEntries(stage);
    return repo.getStageRiders(stage.id);
}
function ensureRaceEntries(db, repo, race, stage) {
    const existingEntries = repo.getRaceRiders(race.id);
    if (existingEntries.length > 0) {
        if (race.isStageRace) {
            repo.prepareStageRaceFatigue(race.id, stage.stageNumber, existingEntries.map((rider) => rider.id));
        }
        repo.ensureStageEntries(stage);
        return repo.getStageRiders(stage.id);
    }
    const selected = buildRaceRoster(db, repo, race, stage, true);
    const insertEntry = db.prepare('INSERT OR IGNORE INTO race_entries (race_id, team_id, rider_id) VALUES (?, ?, ?)');
    db.transaction(() => {
        for (const rider of selected) {
            if (rider.activeTeamId == null) {
                continue;
            }
            insertEntry.run(race.id, rider.activeTeamId, rider.id);
        }
    })();
    if (race.isStageRace) {
        repo.prepareStageRaceFatigue(race.id, stage.stageNumber, selected.map((rider) => rider.id));
    }
    repo.ensureStageEntries(stage);
    return repo.getStageRiders(stage.id);
}
function refreshRaceEntriesForRaceStart(db, repo, race, stage) {
    const selected = buildRaceRoster(db, repo, race, stage);
    const deleteRaceEntries = db.prepare('DELETE FROM race_entries WHERE race_id = ?');
    const deleteStageEntries = db.prepare('DELETE FROM stage_entries WHERE race_id = ?');
    const insertEntry = db.prepare('INSERT OR IGNORE INTO race_entries (race_id, team_id, rider_id) VALUES (?, ?, ?)');
    db.transaction(() => {
        deleteStageEntries.run(race.id);
        deleteRaceEntries.run(race.id);
        for (const rider of selected) {
            if (rider.activeTeamId == null) {
                continue;
            }
            insertEntry.run(race.id, rider.activeTeamId, rider.id);
        }
    })();
    if (race.isStageRace) {
        repo.prepareStageRaceFatigue(race.id, stage.stageNumber, selected.map((rider) => rider.id));
    }
    repo.ensureStageEntries(stage);
    return repo.getStageRiders(stage.id);
}
