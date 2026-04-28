import Database from 'better-sqlite3';

const CONTRACT_STATUS_ACTIVE = 'active';
const CONTRACT_STATUS_EXPIRED = 'expired';
const CONTRACT_STATUS_FUTURE = 'future';

export type ContractStatus =
  | typeof CONTRACT_STATUS_ACTIVE
  | typeof CONTRACT_STATUS_EXPIRED
  | typeof CONTRACT_STATUS_FUTURE;

export class ContractService {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  public checkContractStatuses(currentSeason: number): void {
    this.db.transaction(() => {
      this.db.prepare(`
        UPDATE contracts
        SET status = CASE
          WHEN end_season < ? THEN ?
          WHEN start_season > ? THEN ?
          ELSE ?
        END
      `).run(
        currentSeason,
        CONTRACT_STATUS_EXPIRED,
        currentSeason,
        CONTRACT_STATUS_FUTURE,
        CONTRACT_STATUS_ACTIVE,
      );

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