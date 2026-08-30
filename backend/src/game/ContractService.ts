import Database from 'better-sqlite3';
import { RiderRoleService } from './RiderRoleService';

const CONTRACT_STATUS_ACTIVE = 'active';
const CONTRACT_STATUS_EXPIRED = 'expired';
const CONTRACT_STATUS_FUTURE = 'future';

export type ContractStatus =
  | typeof CONTRACT_STATUS_ACTIVE
  | typeof CONTRACT_STATUS_EXPIRED
  | typeof CONTRACT_STATUS_FUTURE;

/**
 * Ab welchem Alter ein Fahrer aufgibt, der noch nie einen Vertrag hatte.
 *
 * Vierundzwanzig, plus/minus eins. Der Wert haengt an der Fahrer-ID und bleibt
 * damit ueber die Jahre gleich; wuerfelte man ihn jede Saison neu, koennte sich
 * derselbe Fahrer mit Glueck Jahr um Jahr an der Grenze vorbeimogeln, statt
 * einmal eine feste Grenze zu haben.
 *
 * Wozu die Regel: Wer bis Mitte zwanzig nie gedraftet wurde, bleibt sonst
 * dauerhaft im Draft-Pool und im Fahrerfeld stehen, ohne je zu fahren.
 */
export function schwelleOhneVertrag(riderId: number): number {
  return 23 + ((Math.imul(riderId, 2654435761) >>> 0) % 3);
}

export class ContractService {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  public checkContractStatuses(currentSeason: number, isSeasonTransition = false): void {
    this.db.transaction(() => {
      if (isSeasonTransition) {
        // Rider in Rente schicken (die noch keinen neuen Vertrag haben)
        // - Wenn sie ihr retirement_age erreicht haben (oder >= 36 als Fallback)
        // - Wenn sie nie einen Vertrag hatten und die Altersgrenze 24 +/- 1
        //   erreicht haben (siehe schwelleOhneVertrag)
        // - Oder ab Alter 29 (>= 29) mit 1% Chance, wenn Rolle Wassertraeger (5) oder Starker Helfer (4)
        const retirementCandidates = this.db.prepare(`
          SELECT id, birth_year, retirement_age, role_id, first_name, last_name
          FROM riders
          WHERE is_retired = 0
            AND id NOT IN (
              SELECT rider_id FROM contracts WHERE end_season >= ?
            )
        `).all(currentSeason) as Array<{
          id: number;
          birth_year: number;
          retirement_age: number;
          role_id: number | null;
          first_name: string;
          last_name: string;
        }>;

        // Wer ueberhaupt schon einmal einen Vertrag hatte — auch einen laengst
        // ausgelaufenen. Wer nie einen hatte, gibt ab Mitte zwanzig auf.
        const jeUnterVertrag = new Set<number>(
          (this.db.prepare('SELECT DISTINCT rider_id FROM contracts').all() as Array<{ rider_id: number }>)
            .map((zeile) => zeile.rider_id),
        );

        const mandatoryRetirees: number[] = [];
        const earlyCandidates: typeof retirementCandidates = [];

        for (const r of retirementCandidates) {
          const age = currentSeason - r.birth_year;
          const limitAge = r.retirement_age > 0 ? r.retirement_age : 36;

          if (age >= limitAge) {
            mandatoryRetirees.push(r.id);
          } else if (!jeUnterVertrag.has(r.id) && age >= schwelleOhneVertrag(r.id)) {
            mandatoryRetirees.push(r.id);
          } else if (age >= 29 && (r.role_id === 4 || r.role_id === 5)) {
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

        // retired_season = zuletzt bestrittene Saison (currentSeason ist bereits
        // die neue Saison). So ist die Retiree-Kohorte pro Saison abfragbar
        // (Saison-Wrapped).
        const retiredSeason = currentSeason - 1;
        const retireStmt = this.db.prepare(`
          UPDATE riders
          SET is_retired = 1, retired_season = ?
          WHERE id = ?
        `);

        for (const id of mandatoryRetirees) {
          retireStmt.run(retiredSeason, id);
        }
        for (const r of earlyRetirees) {
          retireStmt.run(retiredSeason, r.id);
        }
      }

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

      new RiderRoleService(this.db).recalculateAllTeamRoles();
    })();
  }
}