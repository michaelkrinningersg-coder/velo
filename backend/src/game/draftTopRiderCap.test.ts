import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import { RiderDraftService } from './RiderDraftService';
import {
  createTestDb,
  seedReferenceData,
  seedTeams,
  seedGameState,
} from '../__tests__/helpers/testDb';

/**
 * Top-Fahrer-Kappe (Ansatz "weiche Rampe + hartes Deckel-Limit"): kein Team darf
 * mehr als 4 Fahrer >77 bzw. 10 >74 draften, solange nicht ALLE Teams die Kappe
 * erreicht haben (paritätsgesteuerte Eskalation). Verifiziert über einen
 * kompletten KI-Draft mit vielen starken Free Agents.
 */
describe('RiderDraftService — Top-Fahrer-Kappe', () => {
  let db: Database.Database;
  let draftService: RiderDraftService;

  beforeEach(() => {
    db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 25, playerTeamId: 1 });
    seedGameState(db, { date: '2026-10-15', season: 2026, draftStatus: 'completed' });

    const insertRider = db.prepare(`
      INSERT INTO riders (
        first_name, last_name, country_id, role_id, rider_type_id, birth_year,
        peak_age, decline_age, retirement_age, skill_development, pot_overall, overall_rating,
        specialization_1_id, specialization_2_id, specialization_3_id, is_retired
      ) VALUES (?, ?, 1, 3, 1, ?, 25, 30, 35, 10, ?, ?, ?, 2, 3, 0)
    `);
    const tx = db.transaction(() => {
      // Realistisch: 40 sehr starke (>77) und 80 starke (76, also >74) passen
      // locker unter die Basiskappen (4×25=100 bzw. 10×25=250); dazu reichlich
      // normale Fahrer (Überangebot), damit ein am Limit stehendes Team stets
      // eine legale Alternative hat (kein erzwungener Overflow).
      let n = 0;
      const add = (overall: number, count: number) => {
        for (let k = 0; k < count; k++) {
          n++;
          const spec = ((n % 5) + 1); // Specs 1..5 streuen
          insertRider.run('Fahrer', `${n}`, 1998, overall + 3, overall, spec);
        }
      };
      add(80, 40);   // >77
      add(76, 80);   // >74, nicht >77
      add(70, 220);  // <=74 (Überangebot)
    });
    tx();

    draftService = new RiderDraftService(db);
  });

  afterEach(() => db.close());

  function countsByTeam(threshold: number): number[] {
    const rows = db.prepare(`
      SELECT c.team_id AS teamId, COUNT(*) AS n
      FROM contracts c JOIN riders r ON r.id = c.rider_id
      WHERE c.status IN ('active','future') AND r.overall_rating > ?
      GROUP BY c.team_id
    `).all(threshold) as Array<{ teamId: number; n: number }>;
    const teamIds = (db.prepare('SELECT id FROM teams').all() as Array<{ id: number }>).map(t => t.id);
    const map = new Map<number, number>(teamIds.map(id => [id, 0]));
    for (const r of rows) if (map.has(r.teamId)) map.set(r.teamId, r.n);
    return [...map.values()];
  }

  it('hält die Basiskappen ein (kein Team >4 Fahrer >77 / >10 Fahrer >74) und schließt ab', () => {
    draftService.executeDraft(2027);
    expect(draftService.getNextPickState(2027).finished).toBe(true);

    const c77 = countsByTeam(77);
    const c74 = countsByTeam(74);
    // Bei Überangebot niedriger Fahrer greift die harte Kappe ohne Eskalation:
    // kein Team über der Basis (4 bzw. 10).
    expect(Math.max(...c77)).toBeLessThanOrEqual(4);
    expect(Math.max(...c74)).toBeLessThanOrEqual(10);
    // Und die Verteilung ist gestreut (nicht alle Top-Fahrer bei einem Team).
    expect(c77.reduce((a, b) => a + b, 0)).toBeGreaterThan(0);
  });
});
