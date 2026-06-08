import Database from 'better-sqlite3';
import { GameStateRepository } from "../db/repositories/GameStateRepository";
import { RaceRepository } from "../db/repositories/RaceRepository";
import { ResultRepository } from "../db/repositories/ResultRepository";
import { RiderRepository } from "../db/repositories/RiderRepository";
import { TeamRepository } from "../db/repositories/TeamRepository";

import { Race, RaceRosterEditorPayload, Rider, Stage, Team } from '../../../shared/types';

const DIVISION_BY_TIER: Record<number, Team['division']> = {
  1: 'WorldTour',
  2: 'ProTour',
  3: 'U23',
};

const DEFAULT_ROLE_REQUIREMENTS: Record<number, number> = {
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 2,
  6: 1,
};
const COBBLE_SELECTION_MIN_SKILL = 65;
const CAPTAIN_ROLE_IDS = new Set([1, 2]);
const GENERIC_FILL_ROLE_PRIORITY = new Map<number, number>([
  [5, 0],
  [4, 1],
  [3, 2],
  [6, 3],
]);
const SPECIAL_FILL_CATEGORIES = new Set([1, 2, 3, 6]);
const SPECIAL_FILL_SEQUENCE = [
  { roleId: 3, phase: 'rise' },
  { roleId: 3, phase: 'neutral' },
  { roleId: 4, phase: 'rise' },
  { roleId: 4, phase: 'neutral' },
  { roleId: 6, phase: 'rise' },
  { roleId: 6, phase: 'neutral' },
  { roleId: 5, phase: 'rise' },
  { roleId: 5, phase: 'neutral' },
] as const;

type RiderLockReason = 'already-raced-today' | 'active-stage-race' | 'unavailable' | 'winter-break';
type SelectionPhase = 'exact' | 'replacement' | 'fill';

interface RoleRequirement {
  roleId: number;
  count: number;
}

interface SelectedRosterEntry {
  rider: Rider;
  targetRoleId: number | null;
  phase: SelectionPhase;
  reasons: string[];
}

const RIDER_LOCK_MESSAGES: Record<RiderLockReason, string> = {
  'already-raced-today': 'Heute bereits in einem anderen Rennen gestartet.',
  'active-stage-race': 'Aktuell noch in einer anderen Rundfahrt gebunden.',
  unavailable: 'Aktuell krank oder verletzt und nicht startberechtigt.',
  'winter-break': 'Winterpause zur Erholung (15.10. - 15.02.).',
};

function isWinterBreak(dateString: string): boolean {
  const match = dateString.match(/^\d{4}-(\d{2})-(\d{2})/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);

  if (month === 10 && day >= 15) return true;
  if (month === 11 || month === 12 || month === 1) return true;
  if (month === 2 && day <= 15) return true;
  return false;
}

function createDeterministicRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function shuffleDeterministically<T>(items: T[], seed: number): T[] {
  const shuffled = [...items];
  const random = createDeterministicRandom(seed);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function shuffleRandomly<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function canCustomizeRoster(race: Race, stage: Stage): boolean {
  return race.id > 0 && stage.id > 0;
}

function getPlayerTeam(repo: any): Team {
  const playerTeam = repo.getTeams().find((team: any) => team.isPlayerTeam);
  if (!playerTeam) {
    throw new Error('Es konnte kein Spielerteam gefunden werden.');
  }
  return playerTeam;
}

function groupRidersByTeam(riders: Rider[]): Map<number, Rider[]> {
  const ridersByTeamId = new Map<number, Rider[]>();
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

function buildRiderLockMap(db: Database.Database, repo: any, race: Race, riders = repo.getRiders()): Map<number, RiderLockReason> {
  const currentDate = repo.getCurrentDate();
  const locks = new Map<number, RiderLockReason>();

  for (const rider of riders) {
    if (rider.isUnavailable) {
      locks.set(rider.id, 'unavailable');
    }
  }

  if (isWinterBreak(currentDate)) {
    const ridersByTeamId = groupRidersByTeam(riders);
    for (const teamRiders of ridersByTeamId.values()) {
      const topTwo = [...teamRiders].sort((a: any, b: any) => b.overallRating - a.overallRating).slice(0, 2);
      for (const rider of topTwo) {
        if (!locks.has(rider.id)) {
          locks.set(rider.id, 'winter-break');
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
  `).all(currentDate, race.id) as Array<{ rider_id: number }>;

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
  `).all(race.id, currentDate) as Array<{ rider_id: number }>;

  for (const row of activeStageRaceRows) {
    if (!locks.has(row.rider_id)) {
      locks.set(row.rider_id, 'active-stage-race');
    }
  }

  return locks;
}

function getEligibleRiders(roster: Rider[], riderLocks: Map<number, RiderLockReason>): Rider[] {
  return roster.filter((rider: any) => !riderLocks.has(rider.id));
}

function isCobbleStage(stage: Stage): boolean {
  return stage.profile === 'Cobble' || stage.profile === 'Cobble_Hill';
}

function resolveRoleRequirements(): RoleRequirement[] {
  return Object.entries(DEFAULT_ROLE_REQUIREMENTS)
    .map(([roleId, count]: any) => ({ roleId: Number(roleId), count }))
    .filter((requirement: any) => Number.isFinite(requirement.roleId) && requirement.count > 0)
    .sort((left: any, right: any) => left.roleId - right.roleId);
}

function resolveRoleName(roleNameById: Map<number, string>, roleId: number | null): string {
  if (roleId == null) {
    return 'Restplatz';
  }
  return roleNameById.get(roleId) ?? `Rolle ${roleId}`;
}

function orderCandidatesForStage(candidates: Rider[], stage: Stage, seed: number, useTrueRandom = false): Rider[] {
  const shuffled = useTrueRandom
    ? shuffleRandomly(candidates)
    : shuffleDeterministically(candidates, seed);
  if (!isCobbleStage(stage)) {
    return shuffled;
  }

  const cobbleReady = shuffled.filter((rider: any) => rider.skills.cobble >= COBBLE_SELECTION_MIN_SKILL);
  const fallback = shuffled
    .filter((rider: any) => rider.skills.cobble < COBBLE_SELECTION_MIN_SKILL)
    .sort((left: any, right: any) => right.skills.cobble - left.skills.cobble || left.id - right.id);
  return [...cobbleReady, ...fallback];
}

function logAutomaticRosterSelection(team: Team, race: Race, stage: Stage, entries: SelectedRosterEntry[]): void {
  console.log(`[RaceRoster] ${race.name} | ${formatStageDebugLabel(stage)} | ${team.name} | ${entries.length} Fahrer automatisch ausgewaehlt`);
  entries.forEach((entry: any, index: any) => {
    const riderRoleId = entry.rider.roleId ?? null;
    const riderRoleName = entry.rider.role?.name ?? `Rolle ${riderRoleId ?? 'unbekannt'}`;
    const targetRoleLabel = entry.targetRoleId == null ? 'Restplatz' : `Sollrolle ${entry.targetRoleId}`;
    const reasonText = entry.reasons.length > 0 ? entry.reasons.join('; ') : 'ohne Abweichung';
    console.log(`  ${index + 1}. ${entry.rider.firstName} ${entry.rider.lastName} | role_id=${riderRoleId ?? 'null'} (${riderRoleName}) | ${targetRoleLabel} | Phase=${entry.phase} | ${reasonText}`);
  });
}

function formatStageDebugLabel(stage: Stage): string {
  return `Etappe ${stage.stageNumber} ${stage.profile}`;
}

function selectRaceRoster(team: Team, eligibleRoster: Rider[], targetCount: number, raceId: number, race: Race, stage: Stage): SelectedRosterEntry[] {
  const requestedCount = Math.min(targetCount, eligibleRoster.length);
  if (requestedCount <= 0) {
    return [];
  }

  const roleRequirements = resolveRoleRequirements();
  const roleNameById = new Map<number, string>();
  eligibleRoster.forEach((rider: any) => {
    if (rider.roleId != null && rider.role?.name) {
      roleNameById.set(rider.roleId, rider.role.name);
    }
  });
  const roleIdsAscending = Array.from(new Set([
    ...roleRequirements.map((requirement: any) => requirement.roleId),
    ...eligibleRoster.map((rider: any) => rider.roleId).filter((roleId: any): roleId is number => roleId != null),
  ])).sort((left: any, right: any) => left - right);
  const roleIdsDescending = [...roleIdsAscending].sort((left: any, right: any) => right - left);
  const selectedIds = new Set<number>();
  const selected: SelectedRosterEntry[] = [];
  let seedOffset = 0;

  const addSelection = (rider: Rider, targetRoleId: number | null, phase: SelectionPhase, reasons: string[]): void => {
    selected.push({ rider, targetRoleId, phase, reasons });
    selectedIds.add(rider.id);
  };

  const takeCandidates = (roleId: number, takeCount: number, targetRoleId: number | null, phase: SelectionPhase, extraReason?: string): number => {
    if (takeCount <= 0) {
      return 0;
    }

    const orderedCandidates = orderCandidatesForStage(
      eligibleRoster.filter((rider: any) => !selectedIds.has(rider.id) && rider.roleId === roleId),
      stage,
      raceId * 1000 + team.id * 100 + seedOffset,
      phase === 'fill',
    );
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

      filled += takeCandidates(
        replacementRoleId,
        desiredCount - filled,
        requirement.roleId,
        'replacement',
        `Exakte Rolle ${resolveRoleName(roleNameById, requirement.roleId)} nicht verfuegbar, ersetzt durch ${resolveRoleName(roleNameById, replacementRoleId)}`,
      );
    }
  }

  if (selected.length < requestedCount) {
    for (const roleId of roleIdsDescending) {
      if (selected.length >= requestedCount) {
        break;
      }

      takeCandidates(
        roleId,
        requestedCount - selected.length,
        roleId,
        'fill',
        'Restplatz von unten nach oben aufgefuellt',
      );
    }
  }

  if (selected.length < requestedCount) {
    const remaining = orderCandidatesForStage(
      eligibleRoster.filter((rider: any) => !selectedIds.has(rider.id)),
      stage,
      raceId * 1000 + team.id * 100 + 997,
      true,
    );
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

function resolveParticipatingTeams(repo: any, race: Race, riderLocks: Map<number, RiderLockReason>, ridersByTeamId: Map<number, Rider[]>): Team[] {
  const targetDivision = DIVISION_BY_TIER[race.category?.tier ?? 1];
  const existingEntries = repo.getRaceRiders(race.id);
  if (existingEntries.length > 0) {
    const existingTeamIds = new Set(existingEntries.map((rider: any) => rider.activeTeamId).filter((teamId: any): teamId is number => teamId != null));
    return repo.getTeams().filter((team: any) => existingTeamIds.has(team.id));
  }

  const riderLimit = race.category?.numberOfRiders ?? 0;
  return repo.getTeams()
    .filter((team: any) => team.division === targetDivision)
    .filter((team: any) => getEligibleRiders(ridersByTeamId.get(team.id) ?? [], riderLocks).length >= riderLimit)
    .slice(0, race.category?.numberOfTeams ?? 0);
}

function buildLegacyRaceRoster(db: Database.Database, repo: any, race: Race, stage: Stage, enableDebug = false): Rider[] {
  const riders = repo.getRiders();
  const ridersByTeamId = groupRidersByTeam(riders);
  const riderLocks = buildRiderLockMap(db, repo, race, riders);
  const eligibleTeams = resolveParticipatingTeams(repo, race, riderLocks, ridersByTeamId);

  return eligibleTeams
    .flatMap((team: any) => {
      const selectedEntries = selectRaceRoster(team, getEligibleRiders(ridersByTeamId.get(team.id) ?? [], riderLocks), race.category?.numberOfRiders ?? 0, race.id, race, stage);
      if (enableDebug) {
        logAutomaticRosterSelection(team, race, stage, selectedEntries);
      }
      return selectedEntries.map((entry: any) => entry.rider);
    })
    .sort((left: any, right: any) => right.overallRating - left.overallRating || left.id - right.id);
}

function resolveProgramPhasePriority(rider: Rider): number {
  if (rider.seasonFormPhase === 'rise') return 0;
  if (rider.seasonFormPhase === 'fall') return 2;
  return 1;
}

function isNeutralPhase(rider: Rider): boolean {
  return rider.seasonFormPhase === 'neutral' || rider.seasonFormPhase == null;
}

function orderProgramCandidates(candidates: Rider[]): Rider[] {
  return [...candidates].sort((left: any, right: any) => {
    const phaseCompare = resolveProgramPhasePriority(left) - resolveProgramPhasePriority(right);
    if (phaseCompare !== 0) return phaseCompare;
    return right.overallRating - left.overallRating || left.id - right.id;
  });
}

function hasProgramCollision(db: Database.Database, riderId: number, season: number, race: Race): boolean {
  const row = db.prepare(`
    SELECT COUNT(*) AS count
    FROM rider_season_programs
    JOIN race_program_races ON race_program_races.program_id = rider_season_programs.program_id
    JOIN races program_race ON program_race.id = race_program_races.race_id
    WHERE rider_season_programs.season = ?
      AND rider_season_programs.rider_id = ?
      AND program_race.id != ?
      AND program_race.start_date <= ?
      AND program_race.end_date >= ?
  `).get(season, riderId, race.id, race.endDate, race.startDate) as { count: number } | undefined;
  return (row?.count ?? 0) > 0;
}

function canFillRosterSlot(db: Database.Database, rider: Rider, season: number, race: Race): boolean {
  if (rider.roleId == null || CAPTAIN_ROLE_IDS.has(rider.roleId)) {
    return false;
  }
  if (!GENERIC_FILL_ROLE_PRIORITY.has(rider.roleId)) {
    return false;
  }
  return !hasProgramCollision(db, rider.id, season, race);
}

function resolveSpecialFillIndex(rider: Rider): number {
  return SPECIAL_FILL_SEQUENCE.findIndex((entry: any) => {
    if (rider.roleId !== entry.roleId) return false;
    if (entry.phase === 'rise') return rider.seasonFormPhase === 'rise';
    return isNeutralPhase(rider);
  });
}

function orderFillCandidates(candidates: Rider[], race: Race): Rider[] {
  if (SPECIAL_FILL_CATEGORIES.has(race.categoryId)) {
    return [...candidates]
      .map((rider: any) => ({ rider, index: resolveSpecialFillIndex(rider) }))
      .filter((entry: any) => entry.index >= 0)
      .sort((left: any, right: any) => left.index - right.index || right.rider.overallRating - left.rider.overallRating || left.rider.id - right.rider.id)
      .map((entry: any) => entry.rider);
  }

  return [...candidates].sort((left: any, right: any) => {
    const phaseCompare = resolveProgramPhasePriority(left) - resolveProgramPhasePriority(right);
    if (phaseCompare !== 0) return phaseCompare;
    const roleCompare = (GENERIC_FILL_ROLE_PRIORITY.get(left.roleId ?? 0) ?? 99) - (GENERIC_FILL_ROLE_PRIORITY.get(right.roleId ?? 0) ?? 99);
    if (roleCompare !== 0) return roleCompare;
    const raceDaysCompare = (left.seasonRaceDays ?? 0) - (right.seasonRaceDays ?? 0);
    if (raceDaysCompare !== 0) return raceDaysCompare;
    return hashString(`${race.id}|${left.activeTeamId ?? 0}|${left.id}`) - hashString(`${race.id}|${right.activeTeamId ?? 0}|${right.id}`);
  });
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function buildRaceRoster(db: Database.Database, repo: any, race: Race, stage: Stage, enableDebug = false): Rider[] {
  const season = repo.getCurrentSeason();
  const racePrograms = repo.getRaceProgramsForRace(race.id);
  if (racePrograms.length === 0) {
    return buildLegacyRaceRoster(db, repo, race, stage, enableDebug);
  }

  const riders = repo.getRiders();
  const programIds = new Set(racePrograms.map((program: any) => program.id));
  const riderLocks = buildRiderLockMap(db, repo, race, riders);
  const targetDivision = DIVISION_BY_TIER[race.category?.tier ?? 1];
  const riderLimit = race.category?.numberOfRiders ?? 0;
  const teamLimit = race.category?.numberOfTeams ?? 0;
  const ridersByTeamId = groupRidersByTeam(riders);
  const selectedTeams = repo.getTeams()
    .filter((team: any) => team.division === targetDivision)
    .filter((team: any) => (ridersByTeamId.get(team.id) ?? []).some((rider: any) => rider.seasonProgram != null && programIds.has(rider.seasonProgram.id)))
    .slice(0, teamLimit);

  const selected = selectedTeams.flatMap((team: any) => {
    const roster = getEligibleRiders(ridersByTeamId.get(team.id) ?? [], riderLocks);
    const programCandidates = orderProgramCandidates(roster.filter((rider: any) => rider.seasonProgram != null && programIds.has(rider.seasonProgram.id)));
    const teamSelection = programCandidates.slice(0, riderLimit);
    const selectedIds = new Set(teamSelection.map((rider: any) => rider.id));

    if (teamSelection.length < riderLimit) {
      const fillCandidates = orderFillCandidates(
        roster.filter((rider: any) => !selectedIds.has(rider.id) && canFillRosterSlot(db, rider, season, race)),
        race,
      );
      for (const rider of fillCandidates.slice(0, riderLimit - teamSelection.length)) {
        teamSelection.push(rider);
        selectedIds.add(rider.id);
      }
    }

    if (enableDebug) {
      const underfilled = teamSelection.length < riderLimit ? ` | unterbesetzt ${teamSelection.length}/${riderLimit}` : '';
      console.log(`[RaceRoster] ${race.name} | ${formatStageDebugLabel(stage)} | ${team.name} | ${teamSelection.length} Programmfahrer/Fuellfahrer ausgewaehlt${underfilled}`);
      teamSelection.forEach((rider: any, index: any) => {
        const source = programCandidates.some((candidate: any) => candidate.id === rider.id) ? 'Programm' : 'Fuellung';
        console.log(`  ${index + 1}. ${rider.firstName} ${rider.lastName} | ${source} | Phase=${rider.seasonFormPhase ?? 'neutral'} | Rolle=${rider.role?.name ?? rider.roleId ?? 'unbekannt'} | Renntage=${rider.seasonRaceDays ?? 0}`);
      });
    }

    return teamSelection;
  });

  return selected.sort((left: any, right: any) => right.overallRating - left.overallRating || left.id - right.id);
}

export function previewRaceRoster(db: Database.Database, repo: any, race: Race, stage: Stage): Rider[] {
  const existingEntries = repo.getRaceRiders(race.id);
  if (existingEntries.length > 0) {
    if (race.isStageRace) {
      repo.prepareStageRaceFatigue(race.id, stage.stageNumber, existingEntries.map((rider: any) => rider.id));
    }
    repo.ensureStageEntries(stage);
    return repo.getStageRiders(stage.id);
  }

  const selected = buildRaceRoster(db, repo, race, stage);
  if (race.isStageRace) {
    repo.prepareStageRaceFatigue(race.id, stage.stageNumber, selected.map((rider: any) => rider.id));
    return repo.attachStageRaceFatigue(race.id, selected, stage.stageNumber);
  }
  return selected;
}

export function previewRaceRosterEditor(db: Database.Database, repo: any, race: Race, stage: Stage): RaceRosterEditorPayload {
  const riderLocks = buildRiderLockMap(db, repo, race);
  const selectedIds = new Set(previewRaceRoster(db, repo, race, stage).map((rider: any) => rider.id));
  const playerTeam = getPlayerTeam(repo);
  const teams = [{
    team: playerTeam,
    riderLimit: race.category?.numberOfRiders ?? 0,
    riders: repo.getRiders(playerTeam.id).map((rider: any) => {
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

export function applyRaceRosterSelection(db: Database.Database, repo: any, race: Race, stage: Stage, riderIds: number[]): Rider[] {
  if (!canCustomizeRoster(race, stage)) {
    throw new Error('Das Starterfeld kann für dieses Rennen jetzt nicht mehr bearbeitet werden.');
  }

  const riderLocks = buildRiderLockMap(db, repo, race);
  const selectedRiderIds = new Set(riderIds.filter((riderId: any) => Number.isInteger(riderId)));
  const playerTeam = getPlayerTeam(repo);
  const riderLimit = race.category?.numberOfRiders ?? 0;
  const playerRoster = repo.getRiders(playerTeam.id);
  const rosterById = new Map(playerRoster.map((rider: any) => [rider.id, rider]));
  const validatedSelections = [...selectedRiderIds]
    .map((riderId: any) => rosterById.get(riderId) ?? null)
    .filter((rider: any): rider is Rider => rider != null);

  if (validatedSelections.length !== riderLimit) {
    throw new Error(`${playerTeam.name} muss genau ${riderLimit} Fahrer fuer das Starterfeld stellen.`);
  }

  for (const rider of validatedSelections) {
    const lockReason = riderLocks.get(rider.id);
    if (lockReason) {
      throw new Error(`${rider.firstName} ${rider.lastName} ist gesperrt: ${RIDER_LOCK_MESSAGES[lockReason]}`);
    }
  }

  const participatingRiderIds = new Set(validatedSelections.map((rider: any) => rider.id));
  const unknownSelection = [...selectedRiderIds].find((riderId: any) => !participatingRiderIds.has(riderId));
  if (unknownSelection != null) {
    throw new Error('Die Auswahl enthält Fahrer ausserhalb deines Teams.');
  }

  const autoEntries = previewRaceRoster(db, repo, race, stage).filter((rider: any) => rider.activeTeamId !== playerTeam.id);
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

export function ensureRaceEntries(db: Database.Database, repo: any, race: Race, stage: Stage): Rider[] {
  const existingEntries = repo.getRaceRiders(race.id);
  if (existingEntries.length > 0) {
    if (race.isStageRace) {
      repo.prepareStageRaceFatigue(race.id, stage.stageNumber, existingEntries.map((rider: any) => rider.id));
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
    repo.prepareStageRaceFatigue(race.id, stage.stageNumber, selected.map((rider: any) => rider.id));
  }

  repo.ensureStageEntries(stage);
  return repo.getStageRiders(stage.id);
}

export function refreshRaceEntriesForRaceStart(db: Database.Database, repo: any, race: Race, stage: Stage): Rider[] {
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
    repo.prepareStageRaceFatigue(race.id, stage.stageNumber, selected.map((rider: any) => rider.id));
  }

  repo.ensureStageEntries(stage);
  return repo.getStageRiders(stage.id);
}