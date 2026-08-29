import { describe, expect, it } from 'vitest';
import {
  DAYS_PER_YEAR,
  PROGRESSION_DECLINE_DEPTH,
  advanceSkill,
  resolveGrowthEndAge,
  resolveSkillFloor,
  resolveVisiblePotential,
} from '../../../shared/riderProgression';

/**
 * Das gespeicherte Potenzial ist der Zenit einer Laufbahn. Nach dem Zenit sagt
 * es nichts mehr darueber aus, was ein Fahrer noch erreichen kann — er baut ab.
 * Draft, Vertragsverlaengerung und die Anzeige rechnen deshalb mit dem
 * gedeckelten Wert.
 */
describe('Sichtbares Potenzial', () => {
  const basis = { potential: 78, ability: 70, peakAge: 26, developmentValue: 10 };

  it('zeigt im Aufbau das volle Potenzial', () => {
    expect(resolveVisiblePotential({ ...basis, age: 22 })).toBe(78);
    expect(resolveVisiblePotential({ ...basis, age: 25 })).toBe(78);
  });

  it('deckelt ab dem Ende der Entwicklung auf das heutige Koennen', () => {
    const ende = resolveGrowthEndAge(basis.peakAge, basis.developmentValue);
    expect(resolveVisiblePotential({ ...basis, age: ende })).toBe(70);
    expect(resolveVisiblePotential({ ...basis, age: 33, ability: 64 })).toBe(64);
  });

  it('laesst die Ausdauergruppe ihre zwei Jahre Nachlauf', () => {
    // Der Zenit liegt bei 26, die Ausdauer steigt bis 28 — vorher darf nichts
    // gedeckelt werden, sonst verliert ein Fahrer seine letzten Punkte.
    expect(resolveGrowthEndAge(26, 10)).toBe(28);
    expect(resolveVisiblePotential({ ...basis, age: 27 })).toBe(78);
  });

  it('hebt ein Potenzial nie an', () => {
    expect(resolveVisiblePotential({ ...basis, age: 33, ability: 90 })).toBe(78);
  });

  it('greift nicht bei einem Fahrer ohne Altersprofil', () => {
    expect(resolveVisiblePotential({ ...basis, peakAge: 0, age: 33 })).toBe(78);
  });

  it('zieht ein frueh ausgewachsenes Talent frueher heran', () => {
    // Ein hoher Entwicklungswert zieht das Zielalter nach vorn.
    expect(resolveGrowthEndAge(26, 20)).toBeLessThan(resolveGrowthEndAge(26, 10));
  });
});

describe('Der Abbau bleibt am gespeicherten Zenit haengen', () => {
  it('faellt auf den Sockel des Zenits, nicht auf einen nachlaufenden', () => {
    // Der Grund, warum die Deckelung beim Lesen passiert und nicht in der
    // Datenbank: der Sockel des Abbaus haengt am Potenzial. Wuerde man das
    // gespeicherte Potenzial dem fallenden Koennen nachfuehren, liefe der
    // Sockel mit und der Fahrer verlore ohne Ende.
    const potenzial = 80;
    const sockel = resolveSkillFloor(potenzial);
    expect(sockel).toBe(potenzial - PROGRESSION_DECLINE_DEPTH);

    let skill = potenzial;
    let alter = 30;
    for (let jahr = 0; jahr < 24; jahr++) {
      skill = advanceSkill({
        skillKey: 'flat', skill, potential: potenzial, age: alter, days: DAYS_PER_YEAR,
        peakAge: 26, declineAge: 30, retirementAge: 36, developmentValue: 10,
      });
      alter += 1;
    }
    // Am Zenit festgehalten kommt der Fahrer auf seinem Sockel zur Ruhe.
    expect(skill).toBeGreaterThanOrEqual(sockel - 1e-6);
    expect(skill).toBeLessThan(sockel + 1);

    // Mit einem nachgefuehrten Potenzial waere der Sockel mitgewandert: der
    // Fahrer jagt eine Untergrenze, die immer 15 Punkte unter ihm liegt.
    let nachgefuehrt = potenzial;
    let alter2 = 30;
    for (let jahr = 0; jahr < 24; jahr++) {
      nachgefuehrt = advanceSkill({
        skillKey: 'flat', skill: nachgefuehrt, potential: nachgefuehrt, age: alter2,
        days: DAYS_PER_YEAR, peakAge: 26, declineAge: 30, retirementAge: 36, developmentValue: 10,
      });
      alter2 += 1;
    }
    // Nachgefuehrt landet er rund vierzehn Punkte tiefer, praktisch auf der
    // absoluten Untergrenze von 50 — gemessen 51,2 gegen 65,4.
    expect(nachgefuehrt).toBeLessThan(sockel - 10);
  });
});
