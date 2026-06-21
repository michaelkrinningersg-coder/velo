"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractService = void 0;
const RiderRoleService_1 = require("./RiderRoleService");
const CONTRACT_STATUS_ACTIVE = 'active';
const CONTRACT_STATUS_EXPIRED = 'expired';
const CONTRACT_STATUS_FUTURE = 'future';
class ContractService {
    constructor(db) {
        this.db = db;
    }
    checkContractStatuses(currentSeason, isSeasonTransition = false) {
        this.db.transaction(() => {
            if (isSeasonTransition) {
                // Rider in Rente schicken (die noch keinen neuen Vertrag haben)
                // - Wenn sie ihr retirement_age erreicht haben (oder >= 36 als Fallback)
                // - Oder ab Alter 29 (>= 29) mit 1% Chance, wenn Rolle Wassertraeger (5) oder Starker Helfer (4)
                const retirementCandidates = this.db.prepare(`
          SELECT id, birth_year, retirement_age, role_id, first_name, last_name
          FROM riders
          WHERE is_retired = 0
            AND id NOT IN (
              SELECT rider_id FROM contracts WHERE end_season >= ?
            )
        `).all(currentSeason);
                const mandatoryRetirees = [];
                const earlyCandidates = [];
                for (const r of retirementCandidates) {
                    const age = currentSeason - r.birth_year;
                    const limitAge = r.retirement_age > 0 ? r.retirement_age : 36;
                    if (age >= limitAge) {
                        mandatoryRetirees.push(r.id);
                    }
                    else if (age >= 29 && (r.role_id === 4 || r.role_id === 5)) {
                        earlyCandidates.push(r);
                    }
                }
                // Shuffle early candidates randomly
                for (let i = earlyCandidates.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [earlyCandidates[i], earlyCandidates[j]] = [earlyCandidates[j], earlyCandidates[i]];
                }
                const earlyCount = Math.ceil(earlyCandidates.length * 0.025);
                const earlyRetirees = earlyCandidates.slice(0, earlyCount);
                const retireStmt = this.db.prepare(`
          UPDATE riders
          SET is_retired = 1
          WHERE id = ?
        `);
                for (const id of mandatoryRetirees) {
                    retireStmt.run(id);
                }
                for (const r of earlyRetirees) {
                    retireStmt.run(r.id);
                }
            }
            this.db.prepare(`
        UPDATE contracts
        SET status = CASE
          WHEN end_season < ? THEN ?
          WHEN start_season > ? THEN ?
          ELSE ?
        END
      `).run(currentSeason, CONTRACT_STATUS_EXPIRED, currentSeason, CONTRACT_STATUS_FUTURE, CONTRACT_STATUS_ACTIVE);
            this.db.prepare(`
        UPDATE riders
        SET active_contract_id = (
          SELECT c.id
          FROM contracts c
          WHERE c.rider_id = riders.id
            AND c.status = ?
          ORDER BY c.start_season DESC, c.id DESC
          LIMIT 1
        ),
        active_team_id = (
          SELECT c.team_id
          FROM contracts c
          WHERE c.rider_id = riders.id
            AND c.status = ?
          ORDER BY c.start_season DESC, c.id DESC
          LIMIT 1
        )
      `).run(CONTRACT_STATUS_ACTIVE, CONTRACT_STATUS_ACTIVE);
            new RiderRoleService_1.RiderRoleService(this.db).recalculateAllTeamRoles();
        })();
    }
}
exports.ContractService = ContractService;
