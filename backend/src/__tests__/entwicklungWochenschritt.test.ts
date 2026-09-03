import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import { createTestDb, seedReferenceData, seedTeams, seedRider } from './helpers/testDb';
import { RiderDevelopmentService } from '../game/RiderDevelopmentService';
import { advanceSkill } from '../../../shared/riderProgression';

/**
 * Die Entwicklung der Erstliga-Fahrer laeuft im Wochenschritt (1., 8., 15.,
 * 22.), nicht mehr taeglich.
 *
 * Vorher wurden an jedem Tag 620 Fahrer mit 45 Spalten geladen und wieder
 * geschrieben — ueber ein Jahr 227 000 UPDATEs fuer Aenderungen im
 * Tausendstelbereich. Das Modell rechnet einen Mehrtagesschritt geschlossen,
 * der Wochenschritt liefert deshalb (fast) dasselbe Ergebnis.
 */
describe('Entwicklung im Wochenschritt', () => {
  let db: Database.Database;
  let fahrer: number;

  const flat = (): number => (db.prepare('SELECT skill_flat FROM riders WHERE id = ?').get(fahrer) as { skill_flat: number }).skill_flat;

  beforeEach(() => {
    db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 2, playerTeamId: 1 });
    fahrer = seedRider(db, { activeTeamId: 1, overallRating: 60 });
    // Jung, weit unter Potenzial, normaler Entwicklungswert: waechst sicher.
    db.prepare(`UPDATE riders SET birth_year = 2012, skill_flat = 60, pot_flat = 85, skill_development = 14,
      peak_age = 27, decline_age = 32, retirement_age = 37 WHERE id = ?`).run(fahrer);
  });

  afterEach(() => db.close());

  it('rechnet an gewoehnlichen Tagen nichts und am Stichtag eine Woche', () => {
    const dienst = new RiderDevelopmentService(db);
    const vorher = flat();
    dienst.advanceDailyDevelopment('2034-03-09', 2034, []);
    dienst.advanceDailyDevelopment('2034-03-10', 2034, []);
    expect(flat()).toBe(vorher);

    dienst.advanceDailyDevelopment('2034-03-08', 2034, []);
    expect(flat()).toBeGreaterThan(vorher);
  });

  it('weicht vom taeglichen Rechnen je Woche um hoechstens drei Tausendstel ab', () => {
    let groessteAbweichung = 0;
    for (const age of [19, 22, 25, 28, 31, 34]) {
      for (const developmentValue of [4, 10, 16, 20]) {
        for (const skill of [55, 65, 74]) {
          const basis = { skillKey: 'flat' as const, potential: 85, age, peakAge: 27, declineAge: 32, retirementAge: 37, developmentValue };
          let taeglich = skill;
          for (let i = 0; i < 7; i += 1) taeglich = advanceSkill({ ...basis, skill: taeglich, days: 1 });
          const woche = advanceSkill({ ...basis, skill, days: 7 });
          groessteAbweichung = Math.max(groessteAbweichung, Math.abs(taeglich - woche));
        }
      }
    }
    // Gemessen: 0,0030 im schlechtesten Fall (jung, grosser Abstand zum
    // Potenzial). Ueber eine Saison summiert sich das auf hoechstens rund
    // 0,15 Punkte — unter der Anzeigegenauigkeit.
    expect(groessteAbweichung).toBeLessThan(0.005);
  });
});
