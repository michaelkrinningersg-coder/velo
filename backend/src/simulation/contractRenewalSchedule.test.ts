import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import { ensureContractRenewals } from './contractRenewalSchedule';
import { saveRenewalSelection, getRenewalSelectionPayload, isRenewalSelectionPending } from './contractRenewalSelection';
import {
  createTestDb,
  seedReferenceData,
  seedTeams,
  seedRider,
  seedGameState,
} from '../__tests__/helpers/testDb';

const SEASON = 2026;
const AI_TEAM = 2;
const PLAYER_TEAM = 1;

function insertContract(db: Database.Database, riderId: number, teamId: number, startSeason: number, endSeason: number) {
  const info = db.prepare(`
    INSERT INTO contracts (rider_id, team_id, start_season, end_season, status)
    VALUES (?, ?, ?, ?, 'active')
  `).run(riderId, teamId, startSeason, endSeason);
  return Number(info.lastInsertRowid);
}

function getContract(db: Database.Database, id: number) {
  return db.prepare('SELECT end_season AS endSeason, status FROM contracts WHERE id = ?').get(id) as
    | { endSeason: number; status: string } | undefined;
}

describe('ensureContractRenewals — KI-Teams (Auto-35%)', () => {
  let db: Database.Database;
  beforeEach(() => {
    db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 2, playerTeamId: PLAYER_TEAM });
  });
  afterEach(() => db.close());

  it('tut vor dem 01.08. nichts', () => {
    seedGameState(db, { date: '2026-07-31', season: SEASON });
    const riderId = seedRider(db, { birthYear: 1998, retirementAge: 35, activeTeamId: AI_TEAM });
    const contractId = insertContract(db, riderId, AI_TEAM, 2024, SEASON);
    ensureContractRenewals(db);
    expect(getContract(db, contractId)?.endSeason).toBe(SEASON);
    expect(db.prepare('SELECT 1 FROM contract_renewal_runs WHERE season = ?').get(SEASON)).toBeUndefined();
  });

  it('verlaengert rund 35% der auslaufenden KI-Vertraege um 1-3 Jahre', () => {
    seedGameState(db, { date: '2026-08-01', season: SEASON });
    const ids: number[] = [];
    for (let i = 0; i < 200; i++) {
      const riderId = seedRider(db, { birthYear: 1998, retirementAge: 35, activeTeamId: AI_TEAM });
      ids.push(insertContract(db, riderId, AI_TEAM, 2024, SEASON));
    }
    ensureContractRenewals(db);
    const renewed = ids.filter((id) => (getContract(db, id)?.endSeason ?? SEASON) > SEASON);
    expect(renewed.length).toBe(70); // round(200 * 0.35)
    for (const id of renewed) {
      const ext = getContract(db, id)!.endSeason - SEASON;
      expect(ext).toBeGreaterThanOrEqual(1);
      expect(ext).toBeLessThanOrEqual(3);
    }
  });

  it('verlaengert keinen KI-Fahrer, der dadurch das Retirement-Age erreichen wuerde', () => {
    const riderId = seedRider(db, { birthYear: 1998, retirementAge: 35, activeTeamId: AI_TEAM });
    const contractId = insertContract(db, riderId, AI_TEAM, 2024, 2032);
    seedGameState(db, { date: '2032-08-01', season: 2032 });
    ensureContractRenewals(db);
    expect(getContract(db, contractId)?.endSeason).toBe(2032);
  });
});

describe('Spieler-Vertragsverlängerung — Auswahl (10.01.) + Ziehung (01.08.)', () => {
  let db: Database.Database;
  beforeEach(() => {
    db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 2, playerTeamId: PLAYER_TEAM });
  });
  afterEach(() => db.close());

  function seedPlayerExpiring(count: number, birthYear = 1998): number[] {
    const ids: number[] = [];
    for (let i = 0; i < count; i++) {
      const riderId = seedRider(db, { birthYear, retirementAge: 38, activeTeamId: PLAYER_TEAM });
      ids.push(insertContract(db, riderId, PLAYER_TEAM, 2024, SEASON));
    }
    return ids;
  }

  it('am 10.01. ist die Auswahl pending; max. 75% der auslaufenden Fahrer wählbar', () => {
    seedGameState(db, { date: '2026-01-10', season: SEASON });
    seedPlayerExpiring(8);
    expect(isRenewalSelectionPending(db)).toBe(true);
    const payload = getRenewalSelectionPayload(db);
    expect(payload.candidates.length).toBe(8);
    expect(payload.maxSelectable).toBe(8); // kein Limit -> alle wählbar
  });

  it('schließt Retirement-Fälle aus der Auswahl aus', () => {
    seedGameState(db, { date: '2026-01-10', season: SEASON });
    // Alter am Saisonende 34, Retirement 35 -> nicht wählbar.
    const rid = seedRider(db, { birthYear: 1992, retirementAge: 35, activeTeamId: PLAYER_TEAM });
    insertContract(db, rid, PLAYER_TEAM, 2024, SEASON);
    const payload = getRenewalSelectionPayload(db);
    expect(payload.candidates.find((c) => c.riderId === rid)).toBeUndefined();
  });

  it('erlaubt die Auswahl ALLER wählbaren Fahrer, lehnt nur nicht-wählbare ab', () => {
    seedGameState(db, { date: '2026-01-10', season: SEASON });
    const ids = seedPlayerExpiring(4); // kein Limit -> alle 4 wählbar
    expect(() => saveRenewalSelection(db, ids)).not.toThrow(); // alle 4 erlaubt
    expect(() => saveRenewalSelection(db, [999999])).toThrow(); // nicht wählbar
  });

  it('bestätigte Auswahl schließt das Fenster; am 01.08. verlängern 50-80% der Ausgewählten', () => {
    seedGameState(db, { date: '2026-01-10', season: SEASON });
    const ids = seedPlayerExpiring(20); // alle wählbar
    const selected = ids.slice(0, 12);
    saveRenewalSelection(db, selected);
    expect(isRenewalSelectionPending(db)).toBe(false); // Fenster geschlossen

    // Zum Ziehungstag springen und laufen lassen.
    db.prepare('UPDATE game_state SET "current_date" = ? WHERE id = 1').run('2026-08-01');
    ensureContractRenewals(db);

    const renewedSelected = selected.filter((id) => (getContract(db, id)?.endSeason ?? SEASON) > SEASON).length;
    const renewedOthers = ids.slice(12).filter((id) => (getContract(db, id)?.endSeason ?? SEASON) > SEASON).length;
    // 50-80% von 12 = 6..10 (gerundet); nicht ausgewählte Fahrer werden NICHT verlängert.
    expect(renewedSelected).toBeGreaterThanOrEqual(Math.floor(12 * 0.50));
    expect(renewedSelected).toBeLessThanOrEqual(Math.ceil(12 * 0.80));
    expect(renewedOthers).toBe(0);
  });

  it('ohne Auswahl-Bestätigung wird kein Spieler-Vertrag verlängert (Fenster verpasst)', () => {
    // Kein saveRenewalSelection -> am 01.08. keine Ziele -> keine Verlängerung.
    seedGameState(db, { date: '2026-08-01', season: SEASON });
    const ids = seedPlayerExpiring(10);
    ensureContractRenewals(db);
    const renewed = ids.filter((id) => (getContract(db, id)?.endSeason ?? SEASON) > SEASON).length;
    expect(renewed).toBe(0);
  });
});
