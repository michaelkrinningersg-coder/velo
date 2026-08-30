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

/**
 * Wer schon einmal unter Vertrag stand, aber seit drei abgeschlossenen Saisons
 * keinen mehr findet, gibt ab 28 auf.
 *
 * Die Regel oben greift nur bei Fahrern, die NIE einen Vertrag hatten. Wer
 * einmal einen hatte und dann keinen mehr bekommt, blieb bis zum
 * retirement_age (im Zweifel 36) im Fahrerfeld stehen, ohne je zu fahren.
 */
describe('Ruecktritt nach drei Jahren ohne Vertrag', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 2, playerTeamId: 1 });
    seedGameState(db, { date: '2031-01-01', season: 2031 });
  });

  afterEach(() => db.close());

  /** Fahrer ohne Team mit einem Vertrag, der in `vertragsende` auslief. */
  function legeFahrer(alter: number, vertragsende: number): number {
    const id = seedRider(db, { activeTeamId: null, overallRating: 68, roleId: 1 });
    db.prepare('UPDATE riders SET birth_year = ?, retirement_age = 36 WHERE id = ?').run(2031 - alter, id);
    db.prepare(`INSERT INTO contracts (rider_id, team_id, start_season, end_season, status)
      VALUES (?, 1, ?, ?, 'expired')`).run(id, vertragsende - 1, vertragsende);
    return id;
  }

  const istImRuhestand = (id: number): boolean =>
    (db.prepare('SELECT is_retired FROM riders WHERE id = ?').get(id) as { is_retired: number }).is_retired === 1;

  it('schickt Fahrer ab 28 nach drei vertragslosen Saisons in den Ruhestand', () => {
    // 2031 ist die neue Saison, zuletzt gefahren wurde 2030. Vertragsende 2027
    // heisst: 2028, 2029 und 2030 ohne Vertrag — drei Saisons.
    const drei = legeFahrer(28, 2027);
    // Vertragsende 2028: nur 2029 und 2030 ohne Vertrag — zwei Saisons.
    const zwei = legeFahrer(28, 2028);

    new ContractService(db).checkContractStatuses(2031, true);

    expect(istImRuhestand(drei)).toBe(true);
    expect(istImRuhestand(zwei)).toBe(false);
    expect((db.prepare('SELECT retired_season FROM riders WHERE id = ?').get(drei) as any).retired_season).toBe(2030);
  });

  it('laesst Fahrer unter 28 trotz drei vertragsloser Saisons weiterfahren', () => {
    const jung = legeFahrer(27, 2027);
    const alt = legeFahrer(28, 2027);

    new ContractService(db).checkContractStatuses(2031, true);

    expect(istImRuhestand(jung)).toBe(false);
    expect(istImRuhestand(alt)).toBe(true);
  });

  it('ruehrt Fahrer mit laufendem Vertrag nicht an', () => {
    const id = seedRider(db, { activeTeamId: 1, overallRating: 68, roleId: 1 });
    db.prepare('UPDATE riders SET birth_year = ?, retirement_age = 36 WHERE id = ?').run(2031 - 33, id);
    // Ein alter, laengst ausgelaufener Vertrag UND ein laufender.
    db.prepare(`INSERT INTO contracts (rider_id, team_id, start_season, end_season, status)
      VALUES (?, 1, 2020, 2022, 'expired')`).run(id);
    db.prepare(`INSERT INTO contracts (rider_id, team_id, start_season, end_season, status)
      VALUES (?, 1, 2031, 2033, 'active')`).run(id);

    new ContractService(db).checkContractStatuses(2031, true);

    expect(istImRuhestand(id)).toBe(false);
  });
});
