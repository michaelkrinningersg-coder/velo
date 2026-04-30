"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderRoleService = void 0;
const CAPTAIN_ROLE_NAME = 'Kapitaen';
const CO_CAPTAIN_ROLE_NAME = 'Co-Kapitaen';
const ELITE_HELPER_ROLE_NAME = 'Edelhelfer';
const STRONG_HELPER_ROLE_NAME = 'Starke Helfer';
const WATER_CARRIER_ROLE_NAME = 'Wassertraeger';
const SPRINTER_ROLE_NAME = 'Sprinter';
function tableExists(db, tableName) {
    const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName);
    return row != null;
}
function columnExists(db, tableName, columnName) {
    const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
    return columns.some((column) => column.name === columnName);
}
function compareLeadership(left, right) {
    return right.overall_rating - left.overall_rating
        || right.skill_mountain - left.skill_mountain
        || right.skill_time_trial - left.skill_time_trial
        || right.skill_hill - left.skill_hill
        || right.skill_flat - left.skill_flat
        || left.id - right.id;
}
function compareSprint(left, right) {
    return right.skill_sprint - left.skill_sprint
        || right.skill_acceleration - left.skill_acceleration
        || right.overall_rating - left.overall_rating
        || left.id - right.id;
}
function hasSprintFocus(rider) {
    const specializations = [
        rider.rider_type,
        rider.specialization_1,
        rider.specialization_2,
        rider.specialization_3,
    ];
    if (specializations.includes('Sprint')) {
        return true;
    }
    const sprintBias = rider.skill_sprint + rider.skill_acceleration
        - Math.max(rider.skill_mountain, rider.skill_hill, rider.skill_time_trial);
    return rider.skill_sprint >= 68 && sprintBias >= 10;
}
class RiderRoleService {
    constructor(db) {
        this.db = db;
    }
    recalculateAllTeamRoles() {
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
    `).all();
        const ridersByTeamId = new Map();
        for (const row of rows) {
            if (row.active_team_id == null)
                continue;
            const roster = ridersByTeamId.get(row.active_team_id) ?? [];
            roster.push(row);
            ridersByTeamId.set(row.active_team_id, roster);
        }
        const resetInactive = this.db.prepare(`
      UPDATE riders
      SET role_id = NULL
      WHERE active_team_id IS NULL OR is_retired = 1
    `);
        const updateRole = this.db.prepare('UPDATE riders SET role_id = ? WHERE id = ?');
        this.db.transaction(() => {
            resetInactive.run();
            for (const roster of ridersByTeamId.values()) {
                const assignments = this.assignRolesForRoster(roster, roleIds);
                for (const assignment of assignments) {
                    updateRole.run(assignment.roleId, assignment.riderId);
                }
            }
        })();
    }
    loadRoleIds() {
        const rows = this.db.prepare('SELECT id, name FROM sta_role').all();
        const roleIdByName = new Map(rows.map((row) => [row.name, row.id]));
        const captain = roleIdByName.get(CAPTAIN_ROLE_NAME);
        const coCaptain = roleIdByName.get(CO_CAPTAIN_ROLE_NAME);
        const eliteHelper = roleIdByName.get(ELITE_HELPER_ROLE_NAME);
        const strongHelper = roleIdByName.get(STRONG_HELPER_ROLE_NAME);
        const waterCarrier = roleIdByName.get(WATER_CARRIER_ROLE_NAME);
        const sprinter = roleIdByName.get(SPRINTER_ROLE_NAME);
        if (captain == null
            || coCaptain == null
            || eliteHelper == null
            || strongHelper == null
            || waterCarrier == null
            || sprinter == null) {
            return null;
        }
        return {
            captain,
            coCaptain,
            eliteHelper,
            strongHelper,
            waterCarrier,
            sprinter,
        };
    }
    assignRolesForRoster(roster, roleIds) {
        if (roster.length === 0) {
            return [];
        }
        const assignments = new Map();
        const sprinter = this.selectSprinter(roster);
        if (sprinter != null) {
            assignments.set(sprinter.id, roleIds.sprinter);
        }
        const leadershipRoster = roster
            .filter((rider) => rider.id !== sprinter?.id)
            .sort(compareLeadership);
        if (leadershipRoster[0] != null) {
            assignments.set(leadershipRoster[0].id, roleIds.captain);
        }
        if (leadershipRoster[1] != null) {
            assignments.set(leadershipRoster[1].id, roleIds.coCaptain);
        }
        const supportRoster = leadershipRoster.slice(2);
        if (supportRoster.length > 0) {
            const eliteHelperCount = Math.min(supportRoster.length, Math.max(1, Math.round(supportRoster.length * 15 / 80)));
            const remainingAfterElite = supportRoster.length - eliteHelperCount;
            const strongHelperCount = Math.min(remainingAfterElite, Math.round(supportRoster.length * 25 / 80));
            for (const rider of supportRoster.slice(0, eliteHelperCount)) {
                assignments.set(rider.id, roleIds.eliteHelper);
            }
            for (const rider of supportRoster.slice(eliteHelperCount, eliteHelperCount + strongHelperCount)) {
                assignments.set(rider.id, roleIds.strongHelper);
            }
            for (const rider of supportRoster.slice(eliteHelperCount + strongHelperCount)) {
                assignments.set(rider.id, roleIds.waterCarrier);
            }
        }
        return roster.map((rider) => ({
            riderId: rider.id,
            roleId: assignments.get(rider.id) ?? roleIds.waterCarrier,
        }));
    }
    selectSprinter(roster) {
        if (roster.length < 4) {
            return null;
        }
        const candidates = roster.filter(hasSprintFocus).sort(compareSprint);
        return candidates[0] ?? null;
    }
}
exports.RiderRoleService = RiderRoleService;
