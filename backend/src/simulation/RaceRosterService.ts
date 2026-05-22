import Database from 'better-sqlite3';
import { GameRepository } from '../db/GameRepository';
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

type RiderLockReason = 'already-raced-today' | 'active-stage-race' | 'unavailable';
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
};

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

function getPlayerTeam(repo: GameRepository): Team {
  const playerTeam = repo.getTeams().find((team) => team.isPlayerTeam);
  if (!playerTeam) {
    throw new Error('Es konnte kein Spielerteam gefunden werden.');
  }
  return playerTeam;
}

function buildRiderLockMap(db: Database.Database, repo: GameRepository, race: Race): Map<number, RiderLockReason> {
  const currentDate = repo.getCurrentDate();
  const locks = new Map<number, RiderLockReason>();

  for (const rider of repo.getRiders()) {
    if (rider.isUnavailable) {
      locks.set(rider.id, 'unavailable');
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
  return roster.filter((rider) => !riderLocks.has(rider.id));
}

function isCobbleStage(stage: Stage): boolean {
  return stage.profile === 'Cobble' || stage.profile === 'Cobble_Hill';
}

function resolveRoleRequirements(race: Race): RoleRequirement[] {
  const roleRequirements = race.category?.roleRequirements ?? DEFAULT_ROLE_REQUIREMENTS;
  return Object.entries(roleRequirements)
    .map(([roleId, count]) => ({ roleId: Number(roleId), count }))
    .filter((requirement) => Number.isFinite(requirement.roleId) && requirement.count > 0)
    .sort((left, right) => left.roleId - right.roleId);
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

  const cobbleReady = shuffled.filter((rider) => rider.skills.cobble >= COBBLE_SELECTION_MIN_SKILL);
  const fallback = shuffled
    .filter((rider) => rider.skills.cobble < COBBLE_SELECTION_MIN_SKILL)
    .sort((left, right) => right.skills.cobble - left.skills.cobble || left.id - right.id);
  return [...cobbleReady, ...fallback];
}

function logAutomaticRosterSelection(team: Team, race: Race, stage: Stage, entries: SelectedRosterEntry[]): void {
  console.log(`[RaceRoster] ${race.name} | ${formatStageDebugLabel(stage)} | ${team.name} | ${entries.length} Fahrer automatisch ausgewaehlt`);
  entries.forEach((entry, index) => {
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

  const roleRequirements = resolveRoleRequirements(race);
  const roleNameById = new Map<number, string>();
  eligibleRoster.forEach((rider) => {
    if (rider.roleId != null && rider.role?.name) {
      roleNameById.set(rider.roleId, rider.role.name);
    }
  });
  const roleIdsAscending = Array.from(new Set([
    ...roleRequirements.map((requirement) => requirement.roleId),
    ...eligibleRoster.map((rider) => rider.roleId).filter((roleId): roleId is number => roleId != null),
  ])).sort((left, right) => left - right);
  const roleIdsDescending = [...roleIdsAscending].sort((left, right) => right - left);
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
      eligibleRoster.filter((rider) => !selectedIds.has(rider.id) && rider.roleId === roleId),
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
      eligibleRoster.filter((rider) => !selectedIds.has(rider.id)),
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

function resolveParticipatingTeams(repo: GameRepository, race: Race, riderLocks: Map<number, RiderLockReason>): Team[] {
  const targetDivision = DIVISION_BY_TIER[race.category?.tier ?? 1];
  const existingEntries = repo.getRaceRiders(race.id);
  if (existingEntries.length > 0) {
    const existingTeamIds = new Set(existingEntries.map((rider) => rider.activeTeamId).filter((teamId): teamId is number => teamId != null));
    return repo.getTeams().filter((team) => existingTeamIds.has(team.id));
  }

  const riderLimit = race.category?.numberOfRiders ?? 0;
  return repo.getTeams()
    .filter((team) => team.division === targetDivision)
    .filter((team) => getEligibleRiders(repo.getRiders(team.id), riderLocks).length >= riderLimit)
    .slice(0, race.category?.numberOfTeams ?? 0);
}

function buildRaceRoster(db: Database.Database, repo: GameRepository, race: Race, stage: Stage, enableDebug = false): Rider[] {
  const riderLocks = buildRiderLockMap(db, repo, race);
  const eligibleTeams = resolveParticipatingTeams(repo, race, riderLocks);

  return eligibleTeams
    .flatMap((team) => {
      const selectedEntries = selectRaceRoster(team, getEligibleRiders(repo.getRiders(team.id), riderLocks), race.category?.numberOfRiders ?? 0, race.id, race, stage);
      if (enableDebug) {
        logAutomaticRosterSelection(team, race, stage, selectedEntries);
      }
      return selectedEntries.map((entry) => entry.rider);
    })
    .sort((left, right) => right.overallRating - left.overallRating || left.id - right.id);
}

export function previewRaceRoster(db: Database.Database, repo: GameRepository, race: Race, stage: Stage): Rider[] {
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

export function previewRaceRosterEditor(db: Database.Database, repo: GameRepository, race: Race, stage: Stage): RaceRosterEditorPayload {
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

export function applyRaceRosterSelection(db: Database.Database, repo: GameRepository, race: Race, stage: Stage, riderIds: number[]): Rider[] {
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
    .filter((rider): rider is Rider => rider != null);

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

export function ensureRaceEntries(db: Database.Database, repo: GameRepository, race: Race, stage: Stage): Rider[] {
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