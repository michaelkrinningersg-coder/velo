"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewRaceRoster = previewRaceRoster;
exports.ensureRaceEntries = ensureRaceEntries;
const DIVISION_BY_TIER = {
    1: 'WorldTour',
    2: 'ProTour',
    3: 'U23',
};
const RACE_ROLE_REQUIREMENTS = [
    { roleName: 'Kapitaen', count: 1 },
    { roleName: 'Co-Kapitaen', count: 1 },
    { roleName: 'Edelhelfer', count: 1 },
    { roleName: 'Starke Helfer', count: 1 },
    { roleName: 'Sprinter', count: 1 },
    { roleName: 'Wassertraeger', count: 2 },
];
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
function selectRaceRoster(team, repo, targetCount, raceId) {
    const roster = repo.getRiders(team.id);
    const requestedCount = Math.min(targetCount, roster.length);
    if (requestedCount <= 0) {
        return [];
    }
    const selectedIds = new Set();
    const selected = [];
    let seedOffset = 0;
    for (const requirement of RACE_ROLE_REQUIREMENTS) {
        if (selected.length >= requestedCount) {
            break;
        }
        const roleCandidates = shuffleDeterministically(roster.filter((rider) => !selectedIds.has(rider.id) && rider.role?.name === requirement.roleName), raceId * 1000 + team.id * 100 + seedOffset);
        const takeCount = Math.min(requirement.count, requestedCount - selected.length, roleCandidates.length);
        for (const rider of roleCandidates.slice(0, takeCount)) {
            selected.push(rider);
            selectedIds.add(rider.id);
        }
        seedOffset += 1;
    }
    if (selected.length < requestedCount) {
        const remaining = shuffleDeterministically(roster.filter((rider) => !selectedIds.has(rider.id)), raceId * 1000 + team.id * 100 + 97);
        for (const rider of remaining.slice(0, requestedCount - selected.length)) {
            selected.push(rider);
            selectedIds.add(rider.id);
        }
    }
    return selected;
}
function buildRaceRoster(repo, race) {
    const targetDivision = DIVISION_BY_TIER[race.category?.tier ?? 1];
    const eligibleTeams = repo.getTeams()
        .filter((team) => team.division === targetDivision)
        .slice(0, race.category?.numberOfTeams ?? 0);
    return eligibleTeams
        .flatMap((team) => selectRaceRoster(team, repo, race.category?.numberOfRiders ?? 0, race.id))
        .sort((left, right) => right.overallRating - left.overallRating || left.id - right.id);
}
function previewRaceRoster(repo, race) {
    const existingEntries = repo.getRaceRiders(race.id);
    if (existingEntries.length > 0) {
        return existingEntries;
    }
    return buildRaceRoster(repo, race);
}
function ensureRaceEntries(db, repo, race) {
    const existingEntries = repo.getRaceRiders(race.id);
    if (existingEntries.length > 0) {
        return existingEntries;
    }
    const selected = buildRaceRoster(repo, race);
    const insertEntry = db.prepare('INSERT OR IGNORE INTO race_entries (race_id, team_id, rider_id) VALUES (?, ?, ?)');
    db.transaction(() => {
        for (const rider of selected) {
            if (rider.activeTeamId == null) {
                continue;
            }
            insertEntry.run(race.id, rider.activeTeamId, rider.id);
        }
    })();
    return repo.getRaceRiders(race.id);
}
