import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import { createTestDb, seedReferenceData, seedTeams, seedRider, seedGameState } from './helpers/testDb';
import { ContractService, schwelleOhneVertrag } from '../game/ContractService';

/**
 * Wer bis Mitte zwanzig nie einen Vertrag hatte, gibt am Jahresende auf.
 *
 * Ohne die Regel blieben ungedraftete Fahrer dauerhaft im Draft-Pool und im
 * Fahrerfeld stehen, ohne je zu fahren. Die Altersgrenze liegt bei 24 plus oder
 * minus eins und haengt an der Fahrer-ID, bleibt also ueber die Jahre gleich.
 */
describe('Ruecktritt ohne je einen Vertrag', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 2, playerTeamId: 1 });
    seedGameState(db, { date: '2031-01-01', season: 2031 });
  });

  afterEach(() => db.close());

  /** Fahrer ohne Team; `mitVertrag` legt einen laengst ausgelaufenen Vertrag an. */
  function legeFahrer(geburtsjahr: number, mitVertrag: boolean): number {
    const id = seedRider(db, { activeTeamId: null, overallRating: 68, roleId: 1 });
    db.prepare('UPDATE riders SET birth_year = ?, retirement_age = 36 WHERE id = ?').run(geburtsjahr, id);
    if (mitVertrag) {
      db.prepare(`INSERT INTO contracts (rider_id, team_id, start_season, end_season, status)
        VALUES (?, 1, 2027, 2029, 'expired')`).run(id);
    }
    return id;
  }

  const istImRuhestand = (id: number): boolean =>
    (db.prepare('SELECT is_retired FROM riders WHERE id = ?').get(id) as { is_retired: number }).is_retired === 1;

  it('die Grenze liegt bei 24 plus/minus eins und bleibt je Fahrer gleich', () => {
    const grenzen = new Set<number>();
    for (let id = 1; id <= 400; id += 1) {
      const grenze = schwelleOhneVertrag(id);
      expect(grenze).toBeGreaterThanOrEqual(23);
      expect(grenze).toBeLessThanOrEqual(25);
      expect(schwelleOhneVertrag(id)).toBe(grenze);
      grenzen.add(grenze);
    }
    // Alle drei Stufen kommen vor — sonst waere die Streuung nur behauptet.
    expect([...grenzen].sort()).toEqual([23, 24, 25]);
  });

  it('schickt vertragslose Fahrer ab ihrer Grenze in den Ruhestand', () => {
    const jung = legeFahrer(2031 - 20, false);   // 20 Jahre
    const alt = legeFahrer(2031 - 26, false);    // 26 Jahre, ueber jeder Grenze

    new ContractService(db).checkContractStatuses(2031, true);

    expect(istImRuhestand(jung)).toBe(false);
    expect(istImRuhestand(alt)).toBe(true);
    // retired_season ist die zuletzt bestrittene Saison.
    expect((db.prepare('SELECT retired_season FROM riders WHERE id = ?').get(alt) as any).retired_season).toBe(2030);
  });

  it('laesst gleichaltrige Fahrer in Ruhe, die schon einmal einen Vertrag hatten', () => {
    const ohne = legeFahrer(2031 - 26, false);
    const mit = legeFahrer(2031 - 26, true);

    new ContractService(db).checkContractStatuses(2031, true);

    expect(istImRuhestand(ohne)).toBe(true);
    expect(istImRuhestand(mit)).toBe(false);
  });

  it('greift genau ab der Grenze des jeweiligen Fahrers', () => {
    const id = legeFahrer(2031 - 30, false);
    const grenze = schwelleOhneVertrag(id);

    // Ein Jahr unter der Grenze: bleibt aktiv.
    db.prepare('UPDATE riders SET birth_year = ? WHERE id = ?').run(2031 - (grenze - 1), id);
    new ContractService(db).checkContractStatuses(2031, true);
    expect(istImRuhestand(id)).toBe(false);

    // Genau auf der Grenze: Ruhestand.
    db.prepare('UPDATE riders SET birth_year = ? WHERE id = ?').run(2031 - grenze, id);
    new ContractService(db).checkContractStatuses(2031, true);
    expect(istImRuhestand(id)).toBe(true);
  });
});
