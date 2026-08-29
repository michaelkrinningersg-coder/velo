import { describe, expect, it } from 'vitest';
import type Database from 'better-sqlite3';
import { createTestDb, seedReferenceData, seedRider, seedTeams } from './helpers/testDb';
import { ladeVerletzungsarten } from '../db/injuryTypes';
import { GameStateService } from '../game/GameStateService';
import {
  mittlereAusfalltage,
  ziehVerletzung,
  ziehVerletzungOhneArten,
  type Verletzungsart,
} from '../../../shared/injuries';
import { createSeededRandom } from '../../../shared/rng';

/**
 * Das alte Modell zog zu 10 % 6 bis 30 Tage, sonst 2 bis 14 — Erwartungswert
 * 9,0 Tage. Die Verletzungsarten wurden unter der Auflage eingefuehrt, dass
 * die Ausfallzeit dadurch nicht steigt.
 */
const ALTES_MODELL_TAGE = 9.0;

function ausfall(
  db: Database.Database,
  riderId: number,
  tage: number,
  bis: string | null,
  art: string | null = null,
): void {
  db.prepare(`
    INSERT INTO rider_daily_state (rider_id, season, health_status, health_detail, unavailable_until, unavailable_days_remaining)
    VALUES (?, 2026, 'injured', ?, ?, ?)
  `).run(riderId, art, bis, tage);
}

function zustand(db: Database.Database, riderId: number): {
  health_status: string; health_detail: string | null;
  unavailable_until: string | null; unavailable_days_remaining: number;
} {
  return db.prepare(`
    SELECT health_status, health_detail, unavailable_until, unavailable_days_remaining
    FROM rider_daily_state WHERE rider_id = ?
  `).get(riderId) as any;
}

describe('Verletzungsarten', () => {
  it('werden aus der CSV in den Spielstand geladen', () => {
    const db = createTestDb();
    const arten = ladeVerletzungsarten(db);
    expect(arten.length).toBeGreaterThanOrEqual(5);
    for (const art of arten) {
      expect(art.label.length).toBeGreaterThan(0);
      expect(art.maxTage).toBeGreaterThanOrEqual(art.minTage);
      expect(art.minTage).toBeGreaterThanOrEqual(1);
    }
    db.close();
  });

  it('kosten im Mittel nicht mehr Ausfallzeit als das alte Modell', () => {
    const db = createTestDb();
    const arten = ladeVerletzungsarten(db);
    expect(mittlereAusfalltage(arten, 'alltag')).toBeLessThanOrEqual(ALTES_MODELL_TAGE);
    expect(mittlereAusfalltage(arten, 'sturz')).toBeLessThanOrEqual(ALTES_MODELL_TAGE);
    // Und nicht so weit darunter, dass Verletzungen bedeutungslos werden.
    expect(mittlereAusfalltage(arten, 'alltag')).toBeGreaterThan(6);
    expect(mittlereAusfalltage(arten, 'sturz')).toBeGreaterThan(6);
    db.close();
  });

  it('halten die gemessene Dauer in der Spanne ihrer Art', () => {
    const db = createTestDb();
    const arten = ladeVerletzungsarten(db);
    const nachKey = new Map(arten.map((art) => [art.key, art]));
    const zufall = createSeededRandom(42);
    for (let wurf = 0; wurf < 5000; wurf += 1) {
      const gezogen = ziehVerletzung(arten, wurf % 2 === 0 ? 'alltag' : 'sturz', zufall);
      const art = nachKey.get(gezogen.key ?? '');
      expect(art).toBeDefined();
      expect(gezogen.durationDays).toBeGreaterThanOrEqual(art!.minTage);
      expect(gezogen.durationDays).toBeLessThanOrEqual(art!.maxTage);
    }
    db.close();
  });

  it('ziehen nach einem Sturz keine Art mit Sturzgewicht 0', () => {
    const db = createTestDb();
    const arten = ladeVerletzungsarten(db);
    const ohneSturz = new Set(arten.filter((art) => art.gewichtSturz === 0).map((art) => art.key));
    expect(ohneSturz.size).toBeGreaterThan(0);
    const zufall = createSeededRandom(7);
    for (let wurf = 0; wurf < 5000; wurf += 1) {
      expect(ohneSturz.has(ziehVerletzung(arten, 'sturz', zufall).key ?? '')).toBe(false);
    }
    db.close();
  });

  it('fallen ohne Arten auf das alte Modell zurueck', () => {
    const leer: Verletzungsart[] = [];
    const zufall = createSeededRandom(3);
    let summe = 0;
    const wuerfe = 20000;
    for (let wurf = 0; wurf < wuerfe; wurf += 1) {
      const gezogen = ziehVerletzung(leer, 'alltag', zufall);
      expect(gezogen.key).toBeNull();
      expect(gezogen.durationDays).toBeGreaterThanOrEqual(2);
      expect(gezogen.durationDays).toBeLessThanOrEqual(30);
      summe += gezogen.durationDays;
    }
    expect(summe / wuerfe).toBeCloseTo(ALTES_MODELL_TAGE, 0);
    expect(ziehVerletzungOhneArten(createSeededRandom(1)).label).toBeNull();
  });
});

/**
 * Regression: das Herunterzaehlen stand frueher in der Tagesschleife, die
 * jeden Fahrer ohne Tier-1-Team wieder verlaesst. Wer ohne Vertrag oder in
 * einer unteren Division krank wurde, blieb es damit dauerhaft — im
 * gemessenen Spielstand hingen so 18 vereinslose Fahrer fest.
 */
describe('Ausfalltage herunterzaehlen', () => {
  const heute = '2026-06-10';

  function aufbau(): { db: Database.Database; service: GameStateService } {
    const db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 1 });
    return { db, service: new GameStateService(db) };
  }

  it('macht auch einen Fahrer ohne Team wieder gesund', () => {
    const { db, service } = aufbau();
    const ohneTeam = seedRider(db, { activeTeamId: null });
    const mitTeam = seedRider(db, { activeTeamId: 1 });
    ausfall(db, ohneTeam, 1, heute, 'prellung');
    ausfall(db, mitTeam, 1, heute, 'prellung');

    (service as any).zaehleAusfalltageHerunter('2026-06-11');

    for (const riderId of [ohneTeam, mitTeam]) {
      const nachher = zustand(db, riderId);
      expect(nachher.health_status).toBe('healthy');
      expect(nachher.unavailable_days_remaining).toBe(0);
      expect(nachher.unavailable_until).toBeNull();
      // Die Art gehoert zur Verletzung, nicht zum Fahrer.
      expect(nachher.health_detail).toBeNull();
    }
    db.close();
  });

  it('zaehlt einen laufenden Ausfall um genau einen Tag herunter', () => {
    const { db, service } = aufbau();
    const fahrer = seedRider(db, { activeTeamId: null });
    ausfall(db, fahrer, 3, '2026-06-12', 'rippenprellung');

    (service as any).zaehleAusfalltageHerunter('2026-06-11');

    const nachher = zustand(db, fahrer);
    expect(nachher.health_status).toBe('injured');
    expect(nachher.unavailable_days_remaining).toBe(2);
    // Rueckkehrdatum bleibt stehen: es haengt am Sturz, nicht am Zaehler.
    expect(nachher.unavailable_until).toBe('2026-06-12');
    expect(nachher.health_detail).toBe('rippenprellung');
    db.close();
  });

  it('befreit haengengebliebene Fahrer aus alten Spielstaenden sofort', () => {
    const { db, service } = aufbau();
    const fahrer = seedRider(db, { activeTeamId: null });
    // Zaehler behauptet noch 9 Tage, das Rueckkehrdatum liegt aber lange
    // zurueck — so sehen die Zeilen aus, die das alte Verhalten hinterlassen hat.
    ausfall(db, fahrer, 9, '2026-01-12', 'schluesselbeinbruch');

    (service as any).zaehleAusfalltageHerunter(heute);

    const nachher = zustand(db, fahrer);
    expect(nachher.health_status).toBe('healthy');
    expect(nachher.unavailable_days_remaining).toBe(0);
    db.close();
  });
});
