"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractService = void 0;
const CONTRACT_STATUS_ACTIVE = 'active';
const CONTRACT_STATUS_EXPIRED = 'expired';
const CONTRACT_STATUS_FUTURE = 'future';
class ContractService {
    constructor(db) {
        this.db = db;
    }
    checkContractStatuses(currentSeason) {
        this.db.transaction(() => {
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
        })();
    }
}
exports.ContractService = ContractService;
