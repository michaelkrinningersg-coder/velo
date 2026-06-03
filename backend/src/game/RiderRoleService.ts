import Database from 'better-sqlite3';
import type { RiderSpecialization } from '../../../shared/types';

const CAPTAIN_ROLE_NAME = 'Kapitaen';
const CO_CAPTAIN_ROLE_NAME = 'Co-Kapitaen';
const ELITE_HELPER_ROLE_NAME = 'Edelhelfer';
const STRONG_HELPER_ROLE_NAME = 'Starke Helfer';
const WATER_CARRIER_ROLE_NAME = 'Wassertraeger';
const SPRINTER_ROLE_NAME = 'Sprinter';

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName) as { name: string } | undefined;
  return row != null;
}

function columnExists(db: Database.Database, tableName: string, columnName: string): boolean {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
  return columns.some((column) => column.name === columnName);
}

interface RoleRow {
  id: number;
  name: string;
  weighting: number;
}

interface RoleDefinition {
  id: number;
  weighting: number;
}

interface RiderRoleRow {
  id: number;
  active_team_id: number | null;
  overall_rating: number;
  skill_sprint: number;
  skill_acceleration: number;
  skill_flat: number;
  skill_mountain: number;
  skill_hill: number;
  skill_time_trial: number;
  rider_type: RiderSpecialization | null;
  specialization_1: RiderSpecialization | null;
  specialization_2: RiderSpecialization | null;
  specialization_3: RiderSpecialization | null;
}

interface RoleIdMap {
  captain: RoleDefinition;
  coCaptain: RoleDefinition;
  eliteHelper: RoleDefinition;
  strongHelper: RoleDefinition;
  waterCarrier: RoleDefinition;
  sprinter: RoleDefinition;
}

type HelperRoleKey = 'eliteHelper' | 'strongHelper' | 'waterCarrier';
type NonSprinterRoleKey = 'captain' | 'coCaptain' | 'eliteHelper' | 'strongHelper' | 'waterCarrier';

const HELPER_ROLE_KEYS: HelperRoleKey[] = ['eliteHelper', 'strongHelper', 'waterCarrier'];
const NON_SPRINTER_ROLE_KEYS: NonSprinterRoleKey[] = ['captain', 'coCaptain', 'eliteHelper', 'strongHelper', 'waterCarrier'];

function compareLeadership(left: RiderRoleRow, right: RiderRoleRow): number {
  return right.overall_rating - left.overall_rating
    || right.skill_mountain - left.skill_mountain
    || right.skill_time_trial - left.skill_time_trial
    || right.skill_hill - left.skill_hill
    || right.skill_flat - left.skill_flat
    || left.id - right.id;
}

function compareSprint(left: RiderRoleRow, right: RiderRoleRow): number {
  return right.skill_sprint - left.skill_sprint
    || right.skill_acceleration - left.skill_acceleration
    || right.overall_rating - left.overall_rating
    || left.id - right.id;
}

export class RiderRoleService {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  public recalculateAllTeamRoles(): void {
    if (!tableExists(this.db, 'riders') || !tableExists(this.db, 'sta_role')) {
      return;
    }

    const requiredColumns = [
      'role_id',
      'active_team_id',
      'overall_rating',
      'skill_sprint',
      'skill_acceleration',
      'skill_flat',
      'skill_mountain',
      'skill_hill',
      'skill_time_trial',
      'is_retired',
    ];
    if (requiredColumns.some((column) => !columnExists(this.db, 'riders', column))) {
      return;
    }

    const roleIds = this.loadRoleIds();
    if (roleIds == null) {
      return;
    }

    const rows = this.db.prepare(`
      SELECT r.id,
             r.active_team_id,
             r.overall_rating,
             r.skill_sprint,
             r.skill_acceleration,
             r.skill_flat,
             r.skill_mountain,
             r.skill_hill,
             r.skill_time_trial,
             rider_type.type_key AS rider_type,
             specialization_1.type_key AS specialization_1,
             specialization_2.type_key AS specialization_2,
             specialization_3.type_key AS specialization_3
      FROM riders r
      LEFT JOIN type_rider rider_type ON rider_type.id = r.rider_type_id
      LEFT JOIN type_rider specialization_1 ON specialization_1.id = r.specialization_1_id
      LEFT JOIN type_rider specialization_2 ON specialization_2.id = r.specialization_2_id
      LEFT JOIN type_rider specialization_3 ON specialization_3.id = r.specialization_3_id
      WHERE r.active_team_id IS NOT NULL AND r.is_retired = 0
      ORDER BY r.active_team_id ASC, r.overall_rating DESC, r.id ASC
    `).all() as RiderRoleRow[];

    const ridersByTeamId = new Map<number, RiderRoleRow[]>();
    for (const row of rows) {
      if (row.active_team_id == null) continue;
      const roster = ridersByTeamId.get(row.active_team_id) ?? [];
      roster.push(row);
      ridersByTeamId.set(row.active_team_id, roster);
    }

    const resetAllRoles = this.db.prepare('UPDATE riders SET role_id = NULL');
    const resetInactive = this.db.prepare(`
      UPDATE riders
      SET role_id = NULL
      WHERE active_team_id IS NULL OR is_retired = 1
    `);
    const updateRole = this.db.prepare('UPDATE riders SET role_id = ? WHERE id = ?');

    this.db.transaction(() => {
      resetAllRoles.run();
      resetInactive.run();

      for (const roster of ridersByTeamId.values()) {
        const assignments = this.assignRolesForRoster(roster, roleIds);
        for (const assignment of assignments) {
          updateRole.run(assignment.roleId, assignment.riderId);
        }
      }
    })();
  }

  private loadRoleIds(): RoleIdMap | null {
    const rows = this.db.prepare('SELECT id, name, weighting FROM sta_role').all() as RoleRow[];
    const roleByName = new Map(rows.map((row) => [row.name, row]));

    const captain = roleByName.get(CAPTAIN_ROLE_NAME);
    const coCaptain = roleByName.get(CO_CAPTAIN_ROLE_NAME);
    const eliteHelper = roleByName.get(ELITE_HELPER_ROLE_NAME);
    const strongHelper = roleByName.get(STRONG_HELPER_ROLE_NAME);
    const waterCarrier = roleByName.get(WATER_CARRIER_ROLE_NAME);
    const sprinter = roleByName.get(SPRINTER_ROLE_NAME);

    if (
      captain == null
      || coCaptain == null
      || eliteHelper == null
      || strongHelper == null
      || waterCarrier == null
      || sprinter == null
    ) {
      return null;
    }

    return {
      captain: { id: captain.id, weighting: captain.weighting },
      coCaptain: { id: coCaptain.id, weighting: coCaptain.weighting },
      eliteHelper: { id: eliteHelper.id, weighting: eliteHelper.weighting },
      strongHelper: { id: strongHelper.id, weighting: strongHelper.weighting },
      waterCarrier: { id: waterCarrier.id, weighting: waterCarrier.weighting },
      sprinter: { id: sprinter.id, weighting: sprinter.weighting },
    };
  }

  private assignRolesForRoster(roster: RiderRoleRow[], roleIds: RoleIdMap): Array<{ riderId: number; roleId: number }> {
    if (roster.length === 0) {
      return [];
    }

    const assignments = new Map<number, number>();

    const leadershipRoster = [...roster].sort(compareLeadership);
    const leadershipCounts = this.resolveLeadershipRoleCounts(roster.length, roleIds);
    let cursor = 0;
    cursor = this.assignRoleSlice(assignments, leadershipRoster, cursor, leadershipCounts.captain, roleIds.captain.id);
    this.assignRoleSlice(assignments, leadershipRoster, cursor, leadershipCounts.coCaptain, roleIds.coCaptain.id);

    const sprintCandidates = roster
      .filter((rider) => !assignments.has(rider.id) && rider.skill_sprint >= 74)
      .sort(compareSprint)
      .slice(0, 3);
    for (const sprinter of sprintCandidates) {
      assignments.set(sprinter.id, roleIds.sprinter.id);
    }

    const helperRoster = roster
      .filter((rider) => !assignments.has(rider.id))
      .sort(compareLeadership);

    const helperCounts = this.resolveHelperRoleCounts(helperRoster.length, roleIds);

    cursor = 0;
    cursor = this.assignRoleSlice(assignments, helperRoster, cursor, helperCounts.eliteHelper, roleIds.eliteHelper.id);
    cursor = this.assignRoleSlice(assignments, helperRoster, cursor, helperCounts.strongHelper, roleIds.strongHelper.id);
    this.assignRoleSlice(assignments, helperRoster, cursor, helperCounts.waterCarrier, roleIds.waterCarrier.id);

    return roster.map((rider) => ({
      riderId: rider.id,
      roleId: assignments.get(rider.id) ?? roleIds.waterCarrier.id,
    }));
  }

  private resolveHelperRoleCounts(
    helperRosterSize: number,
    roleIds: RoleIdMap,
  ): Record<HelperRoleKey, number> {
    const counts = this.resolveProportionalCounts(helperRosterSize, HELPER_ROLE_KEYS, roleIds);
    if (helperRosterSize > 0 && counts.eliteHelper + counts.strongHelper + counts.waterCarrier === 0) {
      counts.waterCarrier = helperRosterSize;
    }
    return counts;
  }

  private resolveLeadershipRoleCounts(
    rosterSize: number,
    roleIds: RoleIdMap,
  ): Record<'captain' | 'coCaptain', number> {
    const proportionalCounts = this.resolveProportionalCounts(rosterSize, NON_SPRINTER_ROLE_KEYS, roleIds);
    let captain = proportionalCounts.captain;
    let coCaptain = proportionalCounts.coCaptain;

    if (rosterSize > 0 && captain === 0) {
      captain = 1;
    }

    if (captain + coCaptain > rosterSize) {
      const overflow = captain + coCaptain - rosterSize;
      const reducedCoCaptain = Math.max(0, coCaptain - overflow);
      const stillOverflow = overflow - (coCaptain - reducedCoCaptain);
      coCaptain = reducedCoCaptain;
      if (stillOverflow > 0) {
        captain = Math.max(1, captain - stillOverflow);
      }
    }

    return { captain, coCaptain };
  }

  private resolveProportionalCounts<K extends keyof RoleIdMap>(
    rosterSize: number,
    roleKeys: readonly K[],
    roleIds: RoleIdMap,
  ): Record<K, number> {
    const counts = Object.fromEntries(roleKeys.map((key) => [key, 0])) as Record<K, number>;
    if (rosterSize <= 0) {
      return counts;
    }

    const weightedRoles = roleKeys.map((key) => ({
      key,
      weighting: Math.max(0, roleIds[key].weighting),
      baseCount: 0,
      remainder: 0,
    }));
    const totalWeight = weightedRoles.reduce((sum, role) => sum + role.weighting, 0);

    if (totalWeight <= 0) {
      return counts;
    }

    let assignedCount = 0;
    for (const role of weightedRoles) {
      const quota = rosterSize * role.weighting / totalWeight;
      role.baseCount = Math.floor(quota);
      role.remainder = quota - role.baseCount;
      counts[role.key] = role.baseCount;
      assignedCount += role.baseCount;
    }

    let remainingCount = rosterSize - assignedCount;
    const rankedRemainders = [...weightedRoles].sort((left, right) => right.remainder - left.remainder
      || right.weighting - left.weighting
      || roleKeys.indexOf(left.key) - roleKeys.indexOf(right.key));

    for (const role of rankedRemainders) {
      if (remainingCount <= 0) {
        break;
      }
      counts[role.key] += 1;
      remainingCount -= 1;
    }

    return counts;
  }

  private assignRoleSlice(
    assignments: Map<number, number>,
    sortedRoster: RiderRoleRow[],
    startIndex: number,
    count: number,
    roleId: number,
  ): number {
    let cursor = startIndex;
    for (const rider of sortedRoster.slice(startIndex, startIndex + count)) {
      assignments.set(rider.id, roleId);
      cursor += 1;
    }

    return cursor;
  }

}