import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import { ensureContractRenewals } from './contractRenewalSchedule';
import {
  createTestDb,
  seedReferenceData,
  seedTeams,
  seedRider,
  seedGameState,
} from '../__tests__/helpers/testDb';

const SEASON = 2026;

function insertContract(db: Database.Database, riderId: number, teamId: number, startSeason: number, endSeason: number) {
  const info = db.prepare(`
    INSERT INTO contracts (rider_id, team_id, start_season, end_season, status)
    VALUES (?, ?, ?, ?, 'active')
  `).run(riderId, teamId, startSeason, endSeason);
  return Number(info.lastInsertRowid);
}

function getContract(db: Database.Database, id: number) {
  return db.prepare('SELECT end_season AS endSeason, status FROM contracts WHERE id = ?').get(id) as
    | { endSeason: number; status: string }
    | undefined;
}

describe('ensureContractRenewals', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 2, playerTeamId: 1 });
  });

  afterEach(() => db.close());

  it('tut vor dem 01.08. nichts', () => {
    seedGameState(db, { date: '2026-07-31', season: SEASON });
    const riderId = seedRider(db, { birthYear: 1998, retirementAge: 35, activeTeamId: 1 });
    const contractId = insertContract(db, riderId, 1, 2024, SEASON);

    ensureContractRenewals(db);

    expect(getContract(db, contractId)?.endSeason).toBe(SEASON);
    expect(db.prepare('SELECT 1 FROM contract_renewal_runs WHERE season = ?').get(SEASON)).toBeUndefined();
  });

  it('verlaengert rund 35% der auslaufenden Vertraege um 1-3 Jahre, ab dem 01.08.', () => {
    seedGameState(db, { date: '2026-08-01', season: SEASON });
    const contractIds: number[] = [];
    for (let i = 0; i < 200; i++) {
      const riderId = seedRider(db, { birthYear: 1998, retirementAge: 35, activeTeamId: 1 });
      contractIds.push(insertContract(db, riderId, 1, 2024, SEASON));
    }

    ensureContractRenewals(db);

    const renewed = contractIds.filter((id) => (getContract(db, id)?.endSeason ?? SEASON) > SEASON);
    // Math.round(200 * 0.35) = 70
    expect(renewed.length).toBe(70);
    for (const id of renewed) {
      const c = getContract(db, id)!;
      const extension = c.endSeason - SEASON;
      expect(extension).toBeGreaterThanOrEqual(1);
      expect(extension).toBeLessThanOrEqual(3);
      expect(c.status).toBe('active');
    }
    expect(db.prepare('SELECT 1 FROM contract_renewal_runs WHERE season = ?').get(SEASON)).toBeTruthy();
  });

  it('ist idempotent - ein zweiter Lauf verlaengert nicht erneut', () => {
    seedGameState(db, { date: '2026-08-15', season: SEASON });
    const contractIds: number[] = [];
    for (let i = 0; i < 50; i++) {
      const riderId = seedRider(db, { birthYear: 1998, retirementAge: 35, activeTeamId: 1 });
      contractIds.push(insertContract(db, riderId, 1, 2024, SEASON));
    }

    ensureContractRenewals(db);
    const afterFirstRun = contractIds.map((id) => getContract(db, id)?.endSeason);

    ensureContractRenewals(db);
    const afterSecondRun = contractIds.map((id) => getContract(db, id)?.endSeason);

    expect(afterSecondRun).toEqual(afterFirstRun);
  });

  it('verlaengert nicht, wenn der Fahrer dadurch das Retirement-Age erreichen wuerde', () => {
    // Alter am Saisonende bereits 34; jede Verlaengerung um 1+ Jahr wuerde das
    // Retirement-Age 35 erreichen -> darf nicht verlaengert werden.
    const riderId = seedRider(db, { birthYear: 1998, retirementAge: 35, activeTeamId: 1 });
    const contractId = insertContract(db, riderId, 1, 2024, 2032);

    seedGameState(db, { date: '2032-08-01', season: 2032 });
    ensureContractRenewals(db);

    expect(getContract(db, contractId)?.endSeason).toBe(2032);
  });
});
