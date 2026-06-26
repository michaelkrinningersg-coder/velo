import Database from 'better-sqlite3';
import { GameStateRepository } from "../db/repositories/GameStateRepository";
import { RaceRepository } from "../db/repositories/RaceRepository";
import { ResultRepository } from "../db/repositories/ResultRepository";
import { RiderRepository } from "../db/repositories/RiderRepository";
import { TeamRepository } from "../db/repositories/TeamRepository";

import { Race, RaceRosterEditorPayload, Rider, Stage, Team } from '../../../shared/types';
import { isWinterBreak, tableExists } from '../db/mappers';

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


type RiderLockReason = 'already-raced-today' | 'active-stage-race' | 'unavailable' | 'winter-break' | 'low-category-exclusion' | 'cobble-climber-exclusion' | 'fatigue-exclusion' | 'cobble-low-skill-exclusion' | 'gt-program-exclusion';
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
  'low-category-exclusion': 'Nicht startberechtigt für diese Rennkategorie aufgrund der Rolle (Kapitän / Co-Kapitän / Sprinter).',
  'cobble-climber-exclusion': 'Bergfahrer (Spec 1/2) ohne Cobble-Skill >= 72 sind nicht startberechtigt bei Pflasterrennen.',
  'fatigue-exclusion': 'Zu erschöpft für den Start eines neuen Rennens (Gesamt-Fatigue >= 16).',
  'cobble-low-skill-exclusion': 'Pflasterrennen erfordern einen Mindest-Cobble-Skill von 65.',
  'gt-program-exclusion': 'Diese Grand Tour ist nicht im Saisonprogramm des Fahrers enthalten.',
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

export function sortWaterCarriersAscending(riders: Rider[]): Rider[] {
  const result = [...riders];
  const waterCarrierIndices: number[] = [];
  const waterCarriers: Rider[] = [];

  for (let i = 0; i < result.length; i++) {
    if (result[i] && result[i].roleId === 5) {
      waterCarrierIndices.push(i);
      waterCarriers.push(result[i]);
    }
  }

  if (waterCarriers.length > 1) {
    waterCarriers.sort((a, b) => (a.seasonRaceDays ?? 0) - (b.seasonRaceDays ?? 0) || a.id - b.id);
    for (let i = 0; i < waterCarrierIndices.length; i++) {
      result[waterCarrierIndices[i]] = waterCarriers[i];
    }
  }

  return result;
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

function buildRiderLockMap(db: Database.Database, repo: any, race: Race, riders: Rider[]): Map<number, RiderLockReason> {
  const currentDate = repo.getCurrentDate();
  const locks = new Map<number, RiderLockReason>();

  let hasCobbleStage = false;
  if (race && race.id) {
    const row = db.prepare(`
      SELECT COUNT(*) AS count
      FROM stages
      WHERE race_id = ? AND (profile = 'Cobble' OR profile = 'Cobble_Hill')
    `).get(race.id) as { count: number } | undefined;
    hasCobbleStage = (row?.count ?? 0) > 0;
  }

  const currentStageRow = race && race.id
    ? db.prepare('SELECT stage_number FROM stages WHERE race_id = ? AND date = ?').get(race.id, currentDate) as { stage_number: number } | undefined
    : undefined;
  const currentStageNumber = currentStageRow?.stage_number ?? 1;

  const activeRaceRiderIds = new Set<number>();
  if (race && race.isStageRace && currentStageNumber > 1) {
    const rows = db.prepare('SELECT rider_id FROM race_entries WHERE race_id = ?').all(race.id) as Array<{ rider_id: number }>;
    for (const r of rows) {
      activeRaceRiderIds.add(r.rider_id);
    }
  }

  for (const rider of riders) {
    let isContinuingStageRace = false;
    if (race && race.isStageRace && currentStageNumber > 1) {
      if (activeRaceRiderIds.has(rider.id)) {
        isContinuingStageRace = true;
      }
    }

    if (rider.isUnavailable) {
      locks.set(rider.id, 'unavailable');
    } else {
      const shortTerm = rider.shortTermFatigueMalus ?? 0.0;
      const longTerm = rider.longTermFatigueMalus ?? 0.0;
      if (!isContinuingStageRace && (shortTerm + longTerm) >= 16.0) {
        locks.set(rider.id, 'fatigue-exclusion');
      } else if (hasCobbleStage) {
        if ((rider.skills?.cobble ?? 0) < 65) {
          locks.set(rider.id, 'cobble-low-skill-exclusion');
        } else {
          const isBerg = rider.specialization1 === 'Berg' || rider.specialization2 === 'Berg';
          const hasCobbleSkill = (rider.skills?.cobble ?? 0) >= 72;
          if (isBerg && !hasCobbleSkill) {
            locks.set(rider.id, 'cobble-climber-exclusion');
          }
        }
      }
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

  if (race) {
    const catId = race.categoryId;
    const catName = race.category?.name ?? '';
    const isGrandTour = catId === 1 || catId === 2 || catName.includes('Grand Tour') || catName.includes('Tour de France');

    if (isGrandTour) {
      const racePrograms = repo.getRaceProgramsForRace ? repo.getRaceProgramsForRace(race.id) : [];
      if (racePrograms && racePrograms.length > 0) {
        for (const rider of riders) {
          const roleId = rider.roleId;
          if (roleId === 1 || roleId === 2 || roleId === 6) {
            const programRaceIds = rider.seasonProgramRaceIds ?? [];
            if (!programRaceIds.includes(race.id)) {
              if (!locks.has(rider.id)) {
                locks.set(rider.id, 'gt-program-exclusion');
              }
            }
          }
        }
      }
    }

    const isCapLockedCategory = ![1, 2, 3, 4, 7].includes(catId);
    const isCoCapLockedCategory = ![1, 2, 3, 4, 5, 7, 8].includes(catId);

    if (isCapLockedCategory || isCoCapLockedCategory) {
      const ridersByTeamId = groupRidersByTeam(riders);
      for (const teamRiders of ridersByTeamId.values()) {
        // Find and sort sprinters of this team by overall rating (roleId === 6)
        const sprinters = teamRiders.filter((r) => r.roleId === 6);
        sprinters.sort((a: any, b: any) => b.overallRating - a.overallRating || a.lastName.localeCompare(b.lastName, 'de') || a.firstName.localeCompare(b.firstName, 'de') || a.id - b.id);

        const bestSprinter = sprinters[0] ?? null;
        const secondBestSprinter = sprinters[1] ?? null;

        // 1. Captains and best Sprinter: locked in category 5, 6, 8, 9
        if (isCapLockedCategory) {
          const captains = teamRiders.filter((r) => r.roleId === 1);
          for (const cap of captains) {
            if (!locks.has(cap.id)) {
              locks.set(cap.id, 'low-category-exclusion');
            }
          }
          if (bestSprinter && !locks.has(bestSprinter.id)) {
            locks.set(bestSprinter.id, 'low-category-exclusion');
          }
        }

        // 2. Co-Captains and second best Sprinter: locked in category 6, 9
        if (isCoCapLockedCategory) {
          const coCaptains = teamRiders.filter((r) => r.roleId === 2);
          for (const coCap of coCaptains) {
            if (!locks.has(coCap.id)) {
              locks.set(coCap.id, 'low-category-exclusion');
            }
          }
          if (secondBestSprinter && !locks.has(secondBestSprinter.id)) {
            locks.set(secondBestSprinter.id, 'low-category-exclusion');
          }
        }
      }
    }
  }

  const sameDayRows = db.prepare(`
    SELECT DISTINCT results.rider_id AS rider_id
    FROM all_results results
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
            FROM all_results remaining_result
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
    return sortWaterCarriersAscending(shuffled);
  }

  const cobbleReady = sortWaterCarriersAscending(shuffled.filter((rider: any) => rider.skills.cobble >= COBBLE_SELECTION_MIN_SKILL));
  const fallback = sortWaterCarriersAscending(shuffled
    .filter((rider: any) => rider.skills.cobble < COBBLE_SELECTION_MIN_SKILL)
    .sort((left: any, right: any) => right.skills.cobble - left.skills.cobble || left.id - right.id));
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
  const season = repo.getCurrentSeason();
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
      let teamSelection = selectedEntries.map((entry: any) => entry.rider);
      teamSelection = enforceSprinterLimits(
        teamSelection,
        ridersByTeamId.get(team.id) ?? [],
        getEligibleRiders(ridersByTeamId.get(team.id) ?? [], riderLocks),
        db,
        repo,
        riderLocks,
        season,
        race,
        stage,
        race.category?.numberOfRiders ?? 0
      );
      teamSelection = enforceLieutenantRules(
        db,
        repo,
        team.id,
        teamSelection,
        getEligibleRiders(ridersByTeamId.get(team.id) ?? [], riderLocks),
        ridersByTeamId.get(team.id) ?? [],
        riderLocks,
        season,
        race,
        stage,
        race.category?.numberOfRiders ?? 0
      );
      return teamSelection;
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

export function orderProgramCandidates(candidates: Rider[], race?: Race, useHomePreference = false): Rider[] {
  const sorted = [...candidates].sort((left: any, right: any) => {
    const phaseCompare = resolveProgramPhasePriority(left) - resolveProgramPhasePriority(right);
    if (phaseCompare !== 0) return phaseCompare;

    if (useHomePreference && race) {
      const leftIsHome = left.countryId === race.countryId ? 1 : 0;
      const rightIsHome = right.countryId === race.countryId ? 1 : 0;
      if (leftIsHome !== rightIsHome) {
        return rightIsHome - leftIsHome;
      }
    }

    return (right.overallRating ?? 0) - (left.overallRating ?? 0) || left.id - right.id;
  });
  return sortWaterCarriersAscending(sorted);
}

function hasActiveOrEarmarkedCollision(
  db: Database.Database,
  repo: any,
  rider: Rider,
  teamRiders: Rider[],
  season: number,
  targetRace: Race,
  riderLocks: Map<number, RiderLockReason>
): boolean {
  const overlappingRaces = db.prepare(`
    SELECT id, name, category_id, start_date, end_date
    FROM races
    WHERE id != ?
      AND start_date <= ?
      AND end_date >= ?
  `).all(targetRace.id, targetRace.endDate, targetRace.startDate) as Race[];

  for (const overlapRace of overlappingRaces) {
    const entriesCountRow = db.prepare(`
      SELECT COUNT(*) AS count
      FROM race_entries
      WHERE race_id = ? AND team_id = ?
    `).get(overlapRace.id, rider.activeTeamId) as { count: number } | undefined;
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
    } else {
      const overlapPrograms = repo.getRaceProgramsForRace(overlapRace.id);
      if (overlapPrograms.length > 0) {
        const programIds = new Set(overlapPrograms.map((p: any) => p.id));
        if (rider.seasonProgram != null && programIds.has(rider.seasonProgram.id)) {
          const overlapRoster = teamRiders.filter((r: any) => {
            return r.seasonProgram != null && programIds.has(r.seasonProgram.id) && !r.isUnavailable;
          });

          const orderedCandidates = orderProgramCandidates(overlapRoster);
          const categoryRow = db.prepare(`
            SELECT number_of_riders
            FROM race_categories
            WHERE id = ?
          `).get(overlapRace.categoryId) as { number_of_riders: number } | undefined;
          const limit = categoryRow?.number_of_riders ?? 8;

          const earmarked = orderedCandidates.slice(0, limit);
          if (earmarked.some((r: any) => r.id === rider.id)) {
            return true;
          }
        }
      }
    }
  }

  return false;
}


function canFillRosterSlot(
  db: Database.Database,
  repo: any,
  rider: Rider,
  teamRiders: Rider[],
  riderLocks: Map<number, RiderLockReason>,
  season: number,
  race: Race,
  teamCollisionRiderIds?: Set<number>
): boolean {
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
  } else if (isHighCategory) {
    // High category: Edelhelfer (3), Starke Helfer (4), Wasserträger (5)
    if (![3, 4, 5].includes(rider.roleId)) {
      return false;
    }
  } else {
    // Other (Middle/Low): Edelhelfer (3), Starke Helfer (4), Wasserträger (5), Sprinter (6)
    if (![3, 4, 5, 6].includes(rider.roleId)) {
      return false;
    }
  }

  if (teamCollisionRiderIds) {
    return !teamCollisionRiderIds.has(rider.id);
  }
  return !hasActiveOrEarmarkedCollision(db, repo, rider, teamRiders, season, race, riderLocks);
}



export function orderFillCandidates(candidates: Rider[], race: Race, useHomePreference = false): Rider[] {
  const name = race.category?.name ?? '';
  const isMonumentOrGrandTour = name.includes('Monument') || name.includes('Grand Tour') || name.includes('Tour de France');
  const isHighCategory = name.includes('Stage Race High') || name.includes('One Day High');

  let sorted: Rider[];
  if (isMonumentOrGrandTour) {
    const roleOrder = [1, 2, 6, 3, 4, 5];
    sorted = [...candidates].sort((left: any, right: any) => {
      const idxLeft = roleOrder.indexOf(left.roleId ?? 0);
      const idxRight = roleOrder.indexOf(right.roleId ?? 0);
      const pLeft = idxLeft === -1 ? 99 : idxLeft;
      const pRight = idxRight === -1 ? 99 : idxRight;

      if (pLeft !== pRight) {
        return pLeft - pRight;
      }
      if (useHomePreference) {
        const leftIsHome = left.countryId === race.countryId ? 1 : 0;
        const rightIsHome = right.countryId === race.countryId ? 1 : 0;
        if (leftIsHome !== rightIsHome) {
          return rightIsHome - leftIsHome;
        }
      }
      return (right.overallRating ?? 0) - (left.overallRating ?? 0) || left.id - right.id;
    });
  } else if (isHighCategory) {
    const roleOrder = [3, 4, 5];
    sorted = [...candidates].sort((left: any, right: any) => {
      const idxLeft = roleOrder.indexOf(left.roleId ?? 0);
      const idxRight = roleOrder.indexOf(right.roleId ?? 0);
      const pLeft = idxLeft === -1 ? 99 : idxLeft;
      const pRight = idxRight === -1 ? 99 : idxRight;

      if (pLeft !== pRight) {
        return pLeft - pRight;
      }
      if (useHomePreference) {
        const leftIsHome = left.countryId === race.countryId ? 1 : 0;
        const rightIsHome = right.countryId === race.countryId ? 1 : 0;
        if (leftIsHome !== rightIsHome) {
          return rightIsHome - leftIsHome;
        }
      }
      return (right.overallRating ?? 0) - (left.overallRating ?? 0) || left.id - right.id;
    });
  } else {
    // Other races: Middle, Low, etc.
    const roleOrder = [5, 4, 3, 6];
    sorted = [...candidates].sort((left: any, right: any) => {
      const idxLeft = roleOrder.indexOf(left.roleId ?? 0);
      const idxRight = roleOrder.indexOf(right.roleId ?? 0);
      const pLeft = idxLeft === -1 ? 99 : idxLeft;
      const pRight = idxRight === -1 ? 99 : idxRight;

      if (pLeft !== pRight) {
        return pLeft - pRight;
      }

      if (useHomePreference) {
        const leftIsHome = left.countryId === race.countryId ? 1 : 0;
        const rightIsHome = right.countryId === race.countryId ? 1 : 0;
        if (leftIsHome !== rightIsHome) {
          return rightIsHome - leftIsHome;
        }
      }

      if (left.roleId === 6) {
        // Sprinters: weak to strong overall rating
        return (left.overallRating ?? 0) - (right.overallRating ?? 0) || left.id - right.id;
      } else {
        // Wasserträger, Starke Helfer, Edelhelfer: fewest race days first
        return (left.seasonRaceDays ?? 0) - (right.seasonRaceDays ?? 0) || left.id - right.id;
      }
    });
  }

  return sortWaterCarriersAscending(sorted);
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

  // Deterministic check for home rider preference based on season and race ID
  const seedStr = `${season}:${race.id}:home_preference`;
  const seedHash = hashString(seedStr);
  const randomValue = (seedHash % 10000) / 10000;
  const useHomePreference = randomValue < (race.category?.homeSelectionProbability ?? 0);

  if (enableDebug && useHomePreference && (race.category?.homeSelectionProbability ?? 0) > 0) {
    console.log(`[RaceRoster] ${race.name} | Heimauswahl aktiv (Wahrscheinlichkeit: ${race.category?.homeSelectionProbability})`);
  }

  // Precalculate overlapping races once per buildRaceRoster call
  const overlappingRaces = db.prepare(`
    SELECT id, name, category_id AS categoryId, start_date AS startDate, end_date AS endDate
    FROM races
    WHERE id != ?
      AND start_date <= ?
      AND end_date >= ?
  `).all(race.id, race.endDate, race.startDate) as Race[];

  const cachedLimits = new Map<number, number>();
  const cachedPrograms = new Map<number, any[]>();
  for (const overlapRace of overlappingRaces) {
    const categoryRow = db.prepare(`
      SELECT number_of_riders
      FROM race_categories
      WHERE id = ?
    `).get(overlapRace.categoryId) as { number_of_riders: number } | undefined;
    cachedLimits.set(overlapRace.categoryId, categoryRow?.number_of_riders ?? 8);
    cachedPrograms.set(overlapRace.id, repo.getRaceProgramsForRace(overlapRace.id));
  }

  const selected = selectedTeams.flatMap((team: any) => {
    const teamFullRoster = ridersByTeamId.get(team.id) ?? [];
    const roster = getEligibleRiders(teamFullRoster, riderLocks);
    const programCandidates = orderProgramCandidates(
      roster.filter((rider: any) => rider.seasonProgram != null && programIds.has(rider.seasonProgram.id)),
      race,
      useHomePreference
    );
    let teamSelection = programCandidates.slice(0, riderLimit);
    const selectedIds = new Set(teamSelection.map((rider: any) => rider.id));

    if (teamSelection.length < riderLimit) {
      // Build collision set for the current team
      const teamCollisionRiderIds = new Set<number>();
      for (const overlapRace of overlappingRaces) {
        const teamEntries = db.prepare(`
          SELECT rider_id
          FROM race_entries
          WHERE race_id = ? AND team_id = ?
        `).all(overlapRace.id, team.id) as Array<{ rider_id: number }>;

        if (teamEntries.length > 0) {
          for (const entry of teamEntries) {
            teamCollisionRiderIds.add(entry.rider_id);
          }
        } else {
          const overlapPrograms = cachedPrograms.get(overlapRace.id) ?? [];
          if (overlapPrograms.length > 0) {
            const overlapProgIds = new Set(overlapPrograms.map((p: any) => p.id));
            const overlapRoster = teamFullRoster.filter((r: any) => {
              return r.seasonProgram != null && overlapProgIds.has(r.seasonProgram.id) && !r.isUnavailable;
            });

            if (overlapRoster.length > 0) {
              const orderedCandidates = orderProgramCandidates(overlapRoster);
              const limit = cachedLimits.get(overlapRace.categoryId) ?? 8;
              const earmarked = orderedCandidates.slice(0, limit);
              for (const r of earmarked) {
                teamCollisionRiderIds.add(r.id);
              }
            }
          }
        }
      }

      let fillCandidates: Rider[];
      const categoryId = race.categoryId;
      const isCobbleRace = !race.isStageRace && (stage.profile === 'Cobble' || stage.profile === 'Cobble_Hill');

      if (isCobbleRace) {
        const sorted = roster.filter((rider: any) => {
          if (selectedIds.has(rider.id) || teamCollisionRiderIds.has(rider.id)) return false;
          if (hasActiveOrEarmarkedCollision(db, repo, rider, teamFullRoster, season, race, riderLocks)) return false;
          const cobbleSkill = rider.skills?.cobble ?? 0;
          if (cobbleSkill < 65) return false;
          return [3, 4, 5].includes(rider.roleId);
        }).sort((a: any, b: any) => (a.skills?.cobble ?? 0) - (b.skills?.cobble ?? 0) || a.id - b.id);
        fillCandidates = sortWaterCarriersAscending(sorted);
      } else {
        const candidates = roster.filter((rider: any) => {
          if (selectedIds.has(rider.id) || teamCollisionRiderIds.has(rider.id)) return false;
          if (hasActiveOrEarmarkedCollision(db, repo, rider, teamFullRoster, season, race, riderLocks)) return false;
          return true;
        });

        const catName = race.category?.name ?? '';
        const isMonumentOrGT = [1, 2, 3].includes(categoryId) || catName.includes('Monument') || catName.includes('Grand Tour') || catName.includes('Tour de France');
        const isHigh = [4, 7].includes(categoryId) || catName.includes('Stage Race High') || catName.includes('One Day High');
        const isMiddle = [5, 8].includes(categoryId) || catName.includes('Stage Race Middle') || catName.includes('One Day Middle');
        const isLow = [6, 9].includes(categoryId) || catName.includes('Stage Race Low') || catName.includes('One Day Low');

        const hasSprinterSelected = teamSelection.some((r: any) => r.roleId === 6);
        const stageProfileIsFlatRollingHilly = ['Flat', 'Rolling', 'Hilly'].includes(stage.profile);

        const teamSprinters = teamFullRoster
          .filter((r: any) => r.roleId === 6)
          .sort((a: any, b: any) => (b.overallRating ?? 0) - (a.overallRating ?? 0) || a.id - b.id);

        fillCandidates = candidates.filter((rider: any) => {
          const roleId = rider.roleId;

          if (isMonumentOrGT || isHigh) {
            if (roleId === 6) {
              return !hasSprinterSelected && stageProfileIsFlatRollingHilly;
            }
            return [1, 2, 3, 4, 5].includes(roleId);
          } else if (isMiddle) {
            if (roleId === 6) {
              if (hasSprinterSelected) return false;
              const isAllowedSprinter = teamSprinters.length > 1 && (teamSprinters[1].id === rider.id || (teamSprinters.length > 2 && teamSprinters[2].id === rider.id));
              if (!isAllowedSprinter) return false;
              const isStageRace = race.isStageRace;
              return isStageRace || stageProfileIsFlatRollingHilly;
            }
            return [3, 4, 5].includes(roleId);
          } else if (isLow) {
            if (roleId === 6) {
              const isAllowedSprinter = teamSprinters.length > 2 && teamSprinters[2].id === rider.id;
              if (!isAllowedSprinter) return false;
              const isStageRace = race.isStageRace;
              return isStageRace || stageProfileIsFlatRollingHilly;
            }
            return [3, 4, 5].includes(roleId);
          }
          return false;
        });

        fillCandidates.sort((left: any, right: any) => {
          if (left.roleId === 6 && right.roleId === 6) {
            return (left.seasonRaceDays ?? 0) - (right.seasonRaceDays ?? 0) || left.id - right.id;
          }
          if ([3, 4, 5].includes(left.roleId) && [3, 4, 5].includes(right.roleId)) {
            return (left.seasonRaceDays ?? 0) - (right.seasonRaceDays ?? 0) || left.id - right.id;
          }
          return (right.overallRating ?? 0) - (left.overallRating ?? 0) || left.id - right.id;
        });
        fillCandidates = sortWaterCarriersAscending(fillCandidates);
      }
      for (const rider of fillCandidates.slice(0, riderLimit - teamSelection.length)) {
        teamSelection.push(rider);
        selectedIds.add(rider.id);
      }
    }

    teamSelection = enforceSprinterLimits(
      teamSelection,
      teamFullRoster,
      roster,
      db,
      repo,
      riderLocks,
      season,
      race,
      stage,
      riderLimit
    );

    teamSelection = enforceLieutenantRules(
      db,
      repo,
      team.id,
      teamSelection,
      roster,
      teamFullRoster,
      riderLocks,
      season,
      race,
      stage,
      riderLimit
    );

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
  const riderLocks = buildRiderLockMap(db, repo, race, repo.getRiders());
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

  const riderLocks = buildRiderLockMap(db, repo, race, repo.getRiders());
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

  // Check if all three top sprinters of the player team are selected
  const sprinters = playerRoster.filter((r: any) => r.roleId === 6);
  sprinters.sort((a: any, b: any) => b.overallRating - a.overallRating || a.lastName.localeCompare(b.lastName, 'de') || a.firstName.localeCompare(b.firstName, 'de') || a.id - b.id);
  const s1 = sprinters[0] ?? null;
  const s2 = sprinters[1] ?? null;
  const s3 = sprinters[2] ?? null;
  if (s1 && s2 && s3) {
    const s1Selected = validatedSelections.some((r: any) => r.id === s1.id);
    const s2Selected = validatedSelections.some((r: any) => r.id === s2.id);
    const s3Selected = validatedSelections.some((r: any) => r.id === s3.id);
    if (s1Selected && s2Selected && s3Selected) {
      throw new Error(`Ungültige Auswahl: Der drittbeste Sprinter ${s3.firstName} ${s3.lastName} darf nicht aufgestellt werden, wenn bereits der beste und zweitbeste Sprinter aufgestellt sind.`);
    }
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

function enforceLieutenantRules(
  db: Database.Database,
  repo: any,
  teamId: number,
  teamSelection: Rider[],
  roster: Rider[],
  teamFullRoster: Rider[],
  riderLocks: Map<number, RiderLockReason>,
  season: number,
  race: Race,
  stage: Stage,
  riderLimit: number
): Rider[] {
  if (!tableExists(db, 'rider_lieutenants')) {
    return teamSelection;
  }

  const lieutenants = db.prepare(`
    SELECT leader_id, lieutenant_id FROM rider_lieutenants WHERE season = ?
  `).all(season) as Array<{ leader_id: number; lieutenant_id: number }>;

  const leaderToLt = new Map<number, number>();
  const ltToLeader = new Map<number, number>();
  for (const row of lieutenants) {
    leaderToLt.set(row.leader_id, row.lieutenant_id);
    ltToLeader.set(row.lieutenant_id, row.leader_id);
  }

  let currentSelection = [...teamSelection];
  let changed = true;
  let attempts = 0;

  while (changed && attempts < 10) {
    changed = false;
    attempts++;

    const selectedLeaderIds = new Set<number>();
    for (const r of currentSelection) {
      if (leaderToLt.has(r.id)) {
        selectedLeaderIds.add(r.id);
      }
    }

    const toRemoveIds = new Set<number>();
    for (const r of currentSelection) {
      if (ltToLeader.has(r.id)) {
        const leaderId = ltToLeader.get(r.id)!;
        if (!selectedLeaderIds.has(leaderId)) {
          toRemoveIds.add(r.id);
        }
      }
    }

    if (toRemoveIds.size > 0) {
      currentSelection = currentSelection.filter(r => !toRemoveIds.has(r.id));
      changed = true;
    }

    const currentSelectedLeaderIds = new Set<number>();
    for (const r of currentSelection) {
      if (leaderToLt.has(r.id)) {
        currentSelectedLeaderIds.add(r.id);
      }
    }

    const toAddLts: Rider[] = [];
    for (const leaderId of currentSelectedLeaderIds) {
      const ltId = leaderToLt.get(leaderId)!;
      const alreadySelected = currentSelection.some(r => r.id === ltId);
      if (!alreadySelected) {
        const eligibleLt = roster.find(r => r.id === ltId);
        if (eligibleLt) {
          toAddLts.push(eligibleLt);
        }
      }
    }

    if (toAddLts.length > 0) {
      for (const lt of toAddLts) {
        if (currentSelection.length < riderLimit) {
          currentSelection.push(lt);
          changed = true;
        } else {
          const removableCandidates = currentSelection.filter(r => 
            !leaderToLt.has(r.id) && 
            !ltToLeader.has(r.id)
          );

          if (removableCandidates.length > 0) {
            removableCandidates.sort((a, b) => a.overallRating - b.overallRating || b.id - a.id);
            const toDrop = removableCandidates[0];
            currentSelection = currentSelection.filter(r => r.id !== toDrop.id);
            currentSelection.push(lt);
            changed = true;
          }
        }
      }
    }

    if (currentSelection.length < riderLimit) {
      const currentSelectedIds = new Set(currentSelection.map(r => r.id));
      const fillPool = roster.filter(r => {
        if (currentSelectedIds.has(r.id)) return false;
        if (ltToLeader.has(r.id)) {
          const leaderId = ltToLeader.get(r.id)!;
          return currentSelectedIds.has(leaderId);
        }
        return true;
      });

      if (fillPool.length > 0) {
        let sortedFill: Rider[];
        if (!race.isStageRace && (stage.profile === 'Cobble' || stage.profile === 'Cobble_Hill')) {
          sortedFill = sortWaterCarriersAscending([...fillPool].sort((a: any, b: any) => b.skills.cobble - a.skills.cobble || a.id - b.id));
        } else {
          sortedFill = orderFillCandidates(
            fillPool.filter(r => canFillRosterSlot(db, repo, r, teamFullRoster, riderLocks, season, race)),
            race
          );
        }

        if (sortedFill.length > 0) {
          currentSelection.push(sortedFill[0]);
          changed = true;
        }
      }
    }
  }

  return currentSelection;
}

function enforceSprinterLimits(
  teamSelection: Rider[],
  teamFullRoster: Rider[],
  roster: Rider[], // eligible roster (excluding locks)
  db: Database.Database,
  repo: any,
  riderLocks: Map<number, RiderLockReason>,
  season: number,
  race: Race,
  stage: Stage,
  riderLimit: number
): Rider[] {
  let currentSelection = [...teamSelection];

  // Find and sort sprinters of this team by overall rating (roleId === 6)
  const sprinters = teamFullRoster.filter((r) => r.roleId === 6);
  sprinters.sort((a: any, b: any) => b.overallRating - a.overallRating || a.lastName.localeCompare(b.lastName, 'de') || a.firstName.localeCompare(b.firstName, 'de') || a.id - b.id);

  const s1 = sprinters[0] ?? null;
  const s2 = sprinters[1] ?? null;
  const s3 = sprinters[2] ?? null;

  if (s1 && s2 && s3) {
    const s1Selected = currentSelection.some(r => r.id === s1.id);
    const s2Selected = currentSelection.some(r => r.id === s2.id);
    const s3Selected = currentSelection.some(r => r.id === s3.id);

    if (s1Selected && s2Selected && s3Selected) {
      // Remove s3 from the selection
      currentSelection = currentSelection.filter(r => r.id !== s3.id);

      // We need to fill the empty slot with another candidate who is NOT s3 (and not already selected)
      const currentSelectedIds = new Set(currentSelection.map(r => r.id));
      const fillPool = roster.filter(r => r.id !== s3.id && !currentSelectedIds.has(r.id));

      if (fillPool.length > 0) {
        let sortedFill: Rider[];
        if (!race.isStageRace && (stage.profile === 'Cobble' || stage.profile === 'Cobble_Hill')) {
          sortedFill = sortWaterCarriersAscending([...fillPool].sort((a: any, b: any) => b.skills.cobble - a.skills.cobble || a.id - b.id));
        } else {
          sortedFill = orderFillCandidates(
            fillPool.filter(r => canFillRosterSlot(db, repo, r, teamFullRoster, riderLocks, season, race)),
            race
          );
        }

        if (sortedFill.length > 0) {
          currentSelection.push(sortedFill[0]);
        }
      }
    }
  }

  return currentSelection;
}