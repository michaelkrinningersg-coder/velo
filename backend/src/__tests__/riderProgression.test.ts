import { describe, expect, it } from 'vitest';
import {
  DAYS_PER_YEAR,
  MENTOR_BONUS,
  PROGRESSION_DECLINE_DEPTH,
  PROGRESSION_FLOOR_AGE,
  PROGRESSION_MIN_FLOOR,
  RACE_DAY_BONUS_MAX,
  SKILL_PEAK_OFFSET,
  advanceSkill,
  resolveDeclinePerDay,
  resolveDevelopmentFactor,
  resolveEffectiveDeclineAge,
  resolveEffectiveDevelopmentValue,
  resolveEffectivePeakAge,
  resolveGrowthPerDay,
  resolveRaceDayBonus,
  resolveSkillFloor,
  resolveTargetAge,
} from '../../../shared/riderProgression';
import type { RiderSkillKey } from '../../../shared/types';

interface LaufbahnOpts {
  skillKey?: RiderSkillKey; skill: number; potential: number; startAge?: number;
  peakAge: number; declineAge: number; retirementAge: number; developmentValue: number;
  step?: number;
}

/**
 * Faehrt einen Skill bis zu einem Zielalter und gibt den Wert *genau dort*
 * zurueck. Der letzte Schritt wird gekuerzt, damit beide Schrittweiten am
 * selben Alter stehen — sonst misst ein Monatslauf bis zu fuenfzehn Tage
 * daneben, was in der Aufbauphase schon ein Zehntelpunkt ist.
 */
function wertMit(zielAlter: number, opts: LaufbahnOpts): number {
  const schritt = opts.step ?? 1;
  let skill = opts.skill;
  let alter = opts.startAge ?? 16;
  while (alter < zielAlter - 1e-9) {
    const tage = Math.min(schritt, (zielAlter - alter) * DAYS_PER_YEAR);
    skill = advanceSkill({
      skillKey: opts.skillKey ?? 'mountain', skill, potential: opts.potential, age: alter,
      days: tage, peakAge: opts.peakAge, declineAge: opts.declineAge,
      retirementAge: opts.retirementAge, developmentValue: opts.developmentValue,
    });
    alter += tage / DAYS_PER_YEAR;
  }
  return skill;
}

/** Dasselbe fuer mehrere Alter auf einmal. */
function laufbahn(opts: LaufbahnOpts & { alter: number[] }): Map<number, number> {
  return new Map(opts.alter.map((a) => [a, wertMit(a, opts)]));
}

describe('Entwicklungswert', () => {
  it('ist geometrisch um den Standard herum', () => {
    expect(resolveDevelopmentFactor(0)).toBeCloseTo(0.5, 10);
    expect(resolveDevelopmentFactor(10)).toBeCloseTo(1.0, 10);
    expect(resolveDevelopmentFactor(20)).toBeCloseTo(2.0, 10);
    expect(resolveDevelopmentFactor(5)).toBeCloseTo(Math.SQRT1_2, 10);
    expect(resolveDevelopmentFactor(15)).toBeCloseTo(Math.SQRT2, 10);
    // Halbieren und Verdoppeln liegen symmetrisch: f(10-x) * f(10+x) = 1
    for (const x of [1, 3, 5, 7, 10]) {
      expect(resolveDevelopmentFactor(10 - x) * resolveDevelopmentFactor(10 + x)).toBeCloseTo(1, 10);
    }
  });

  it('klemmt ausserhalb der Spanne', () => {
    expect(resolveDevelopmentFactor(-5)).toBe(resolveDevelopmentFactor(0));
    expect(resolveDevelopmentFactor(99)).toBe(resolveDevelopmentFactor(20));
  });

  it('zieht das Zielalter nur bei schnellen Entwicklern nach vorn', () => {
    expect(resolveTargetAge(27, 10)).toBe(27);
    expect(resolveTargetAge(27, 5)).toBe(27);
    expect(resolveTargetAge(27, 0)).toBe(27);
    expect(resolveTargetAge(27, 20)).toBeCloseTo(21.5, 6);
    expect(resolveTargetAge(27, 15)).toBeCloseTo(16 + 11 / Math.SQRT2, 6);
    // Nie vor dem fruehesten Zielalter und nie hinter dem Peak Age.
    expect(resolveTargetAge(22, 20)).toBeGreaterThanOrEqual(21);
    for (let dev = 0; dev <= 20; dev += 1) {
      const ziel = resolveTargetAge(26, dev);
      expect(ziel).toBeLessThanOrEqual(26);
      expect(ziel).toBeGreaterThanOrEqual(21);
    }
  });
});

describe('Versatz je Skillgruppe', () => {
  it('setzt Sprint frueher und Ausdauer spaeter', () => {
    expect(SKILL_PEAK_OFFSET.sprint).toBe(-2);
    expect(SKILL_PEAK_OFFSET.acceleration).toBe(-2);
    expect(SKILL_PEAK_OFFSET.stamina).toBe(2);
    expect(SKILL_PEAK_OFFSET.resistance).toBe(2);
    expect(SKILL_PEAK_OFFSET.recuperation).toBe(2);
    for (const key of ['flat', 'mountain', 'hill', 'timeTrial', 'cobble', 'downhill', 'attack'] as RiderSkillKey[]) {
      expect(resolveEffectivePeakAge(26, key)).toBe(26);
    }
  });

  it('laesst den Abbaubeginn nur nach hinten wandern', () => {
    // Sprint ist frueher oben, faengt aber nicht frueher an zu fallen.
    expect(resolveEffectivePeakAge(26, 'sprint')).toBe(24);
    expect(resolveEffectiveDeclineAge(29, 'sprint')).toBe(29);
    // Ausdauer ist spaeter oben und faengt entsprechend spaeter an zu fallen.
    expect(resolveEffectivePeakAge(26, 'stamina')).toBe(28);
    expect(resolveEffectiveDeclineAge(29, 'stamina')).toBe(31);
  });

  it('laesst kein Maximum hinter dem Abbaubeginn liegen', () => {
    const keys: RiderSkillKey[] = ['sprint', 'acceleration', 'stamina', 'resistance', 'recuperation', 'mountain'];
    for (let peak = 24; peak <= 28; peak += 1) {
      for (let decline = Math.max(peak + 1, 26); decline <= 32; decline += 1) {
        for (const key of keys) {
          expect(resolveEffectivePeakAge(peak, key)).toBeLessThanOrEqual(resolveEffectiveDeclineAge(decline, key));
        }
      }
    }
  });
});

describe('Aufbau', () => {
  it('bringt den Fahrer punktgenau an sein Potenzial', () => {
    for (const dev of [0, 5, 10, 15, 20]) {
      expect(wertMit(27, { skill: 60, potential: 80, peakAge: 27, declineAge: 30, retirementAge: 36, developmentValue: dev }))
        .toBeCloseTo(80, 6);
    }
  });

  it('laesst schnelle Entwickler frueher ankommen', () => {
    const wann = (dev: number): number => {
      const opts = { skill: 60, potential: 80, peakAge: 27, declineAge: 30, retirementAge: 36, developmentValue: dev };
      for (let alter = 17; alter <= 27; alter += 1) {
        if (wertMit(alter, opts) >= 79.95) return alter;
      }
      return 99;
    };
    expect(wann(20)).toBeLessThan(wann(15));
    expect(wann(15)).toBeLessThan(wann(10));
    expect(wann(10)).toBe(27);
    // Ein langsamer Entwickler kommt trotzdem am Peak an, nicht spaeter.
    expect(wann(0)).toBe(27);
    expect(wann(5)).toBe(27);
  });

  it('bremst den langsamen Entwickler nur in der Jugend', () => {
    const basis = { skill: 60, potential: 80, peakAge: 27, declineAge: 30, retirementAge: 36 };
    // Mit 20 liegt er zurueck ...
    expect(wertMit(20, { ...basis, developmentValue: 0 }))
      .toBeLessThan(wertMit(20, { ...basis, developmentValue: 10 }) - 1);
    // ... und holt bis zum Peak wieder auf.
    expect(wertMit(27, { ...basis, developmentValue: 0 }))
      .toBeCloseTo(wertMit(27, { ...basis, developmentValue: 10 }), 6);
  });

  it('steht still, sobald das Potenzial erreicht ist', () => {
    const opts = { skill: 60, potential: 80, peakAge: 27, declineAge: 30, retirementAge: 36, developmentValue: 20 };
    for (const alter of [22, 23, 24, 25, 26, 27, 28, 29, 30]) {
      expect(wertMit(alter, opts)).toBeCloseTo(80, 6);
    }
  });

  it('waechst nicht ueber das Potenzial hinaus und nicht unter null', () => {
    expect(resolveGrowthPerDay({ skill: 80, potential: 80, age: 20, targetAge: 27, developmentValue: 10 })).toBe(0);
    expect(resolveGrowthPerDay({ skill: 85, potential: 80, age: 20, targetAge: 27, developmentValue: 10 })).toBe(0);
    expect(resolveGrowthPerDay({ skill: 60, potential: 80, age: 28, targetAge: 27, developmentValue: 10 })).toBe(0);
  });
});

describe('Sockel und Abbau', () => {
  it('setzt den Sockel um die Abbautiefe unter das Potenzial, nie unter fuenfzig', () => {
    // An den Konstanten gemessen, nicht an festen Zahlen: die Aussage ist die
    // Konstruktion, nicht der gerade eingestellte Wert.
    expect(resolveSkillFloor(85)).toBe(85 - PROGRESSION_DECLINE_DEPTH);
    expect(resolveSkillFloor(80)).toBe(80 - PROGRESSION_DECLINE_DEPTH);
    // Unterhalb dieser Grenze bindet der Mindestsockel.
    const grenze = PROGRESSION_MIN_FLOOR + PROGRESSION_DECLINE_DEPTH;
    expect(resolveSkillFloor(grenze)).toBe(PROGRESSION_MIN_FLOOR);
    expect(resolveSkillFloor(grenze - 5)).toBe(PROGRESSION_MIN_FLOOR);
    expect(resolveSkillFloor(PROGRESSION_MIN_FLOOR)).toBe(PROGRESSION_MIN_FLOOR);
    for (let pot = 50; pot <= 85; pot += 1) {
      expect(resolveSkillFloor(pot)).toBeGreaterThanOrEqual(PROGRESSION_MIN_FLOOR);
      expect(resolveSkillFloor(pot)).toBeLessThanOrEqual(pot);
    }
  });

  it('bringt den Skill mit dem Sockelalter genau auf seinen Sockel', () => {
    for (const [pot, decline, retire] of [[85, 30, 36], [80, 28, 34], [72, 31, 37], [68, 29, 35], [60, 30, 36]] as Array<[number, number, number]>) {
      const wert = wertMit(PROGRESSION_FLOOR_AGE, { skill: pot, potential: pot, startAge: 26, peakAge: 26, declineAge: decline, retirementAge: retire, developmentValue: 10 });
      expect(wert).toBeCloseTo(resolveSkillFloor(pot), 6);
    }
  });

  it('faellt vor dem Karriereende genau dreimal so schnell wie danach', () => {
    const vor = resolveDeclinePerDay({ skill: 80, floor: 60, age: 31, declineAge: 30, retirementAge: 36 });
    // Denselben Reststand kurz nach dem Karriereende gegenrechnen.
    const stand = 80 - (vor * DAYS_PER_YEAR * 5);
    const nach = resolveDeclinePerDay({ skill: stand, floor: 60, age: 36.001, declineAge: 30, retirementAge: 36 });
    expect(vor / nach).toBeCloseTo(3, 2);
  });

  it('faellt nie unter den Sockel und nicht vor dem Abbaubeginn', () => {
    expect(resolveDeclinePerDay({ skill: 60, floor: 60, age: 35, declineAge: 30, retirementAge: 36 })).toBe(0);
    expect(resolveDeclinePerDay({ skill: 55, floor: 60, age: 35, declineAge: 30, retirementAge: 36 })).toBe(0);
    expect(resolveDeclinePerDay({ skill: 80, floor: 60, age: 29, declineAge: 30, retirementAge: 36 })).toBe(0);
    expect(resolveDeclinePerDay({ skill: 80, floor: 60, age: PROGRESSION_FLOOR_AGE + 1, declineAge: 30, retirementAge: 36 })).toBe(0);
    const spur = laufbahn({ alter: [30, 32, 34, 36, 38, 40, PROGRESSION_FLOOR_AGE], skill: 80, potential: 80, startAge: 26, peakAge: 26, declineAge: 30, retirementAge: 36, developmentValue: 10 });
    for (const [, wert] of spur) expect(wert).toBeGreaterThanOrEqual(60 - 1e-6);
  });

  it('haelt das Plateau zwischen Zielalter und Abbaubeginn', () => {
    const opts = { skill: 60, potential: 80, peakAge: 27, declineAge: 31, retirementAge: 37, developmentValue: 10 };
    for (const alter of [28, 29, 30, 31]) expect(wertMit(alter, opts)).toBeCloseTo(80, 6);
    expect(wertMit(32, opts)).toBeLessThan(80);
  });
});

describe('Buendelung von Tagen', () => {
  it('liefert im Monatsschritt dasselbe wie taeglich', () => {
    for (const dev of [0, 10, 20]) {
      const basis = { skill: 58, potential: 82, peakAge: 27, declineAge: 30, retirementAge: 36, developmentValue: dev };
      for (const alter of [20, 24, 27, 30, 34, 36, 38, PROGRESSION_FLOOR_AGE]) {
        expect(wertMit(alter, { ...basis, step: 30 }))
          .toBeCloseTo(wertMit(alter, { ...basis, step: 1 }), 6);
      }
    }
  });

  it('teilt einen Schritt an der Phasengrenze', () => {
    // Zielalter 27 liegt mitten im Schritt: der Fahrer darf danach nicht
    // weiterwachsen.
    const wert = advanceSkill({
      skillKey: 'mountain', skill: 79.9, potential: 80, age: 26.98, days: 30,
      peakAge: 27, declineAge: 30, retirementAge: 36, developmentValue: 10,
    });
    expect(wert).toBeCloseTo(80, 6);
    expect(wert).toBeLessThanOrEqual(80);
  });
});

describe('Zuschlaege auf den Entwicklungswert', () => {
  it('gibt einen Punkt je fuenfzehn Renntage, hoechstens fuenf', () => {
    expect(resolveRaceDayBonus(0)).toBe(0);
    expect(resolveRaceDayBonus(14)).toBe(0);
    expect(resolveRaceDayBonus(15)).toBe(1);
    expect(resolveRaceDayBonus(44)).toBe(2);
    expect(resolveRaceDayBonus(45)).toBe(3);
    expect(resolveRaceDayBonus(75)).toBe(RACE_DAY_BONUS_MAX);
    expect(resolveRaceDayBonus(200)).toBe(RACE_DAY_BONUS_MAX);
  });

  it('deckelt Grundwert plus beide Zuschlaege bei zwanzig', () => {
    expect(resolveEffectiveDevelopmentValue(10, 0, false)).toBe(10);
    expect(resolveEffectiveDevelopmentValue(10, 75, false)).toBe(15);
    expect(resolveEffectiveDevelopmentValue(10, 75, true)).toBe(18);
    expect(resolveEffectiveDevelopmentValue(18, 75, true)).toBe(20);
    expect(resolveEffectiveDevelopmentValue(20, 75, true)).toBe(20);
    expect(MENTOR_BONUS).toBe(3);
  });
});

describe('Zusammenspiel ueber eine ganze Laufbahn', () => {
  const basis = { peakAge: 26, declineAge: 29, retirementAge: 35 };

  it('fuehrt Sprint frueher hinauf und laesst ihn trotzdem erst normal fallen', () => {
    const opts = { ...basis, skill: 62, potential: 80, developmentValue: 10 };
    const sprint = (alter: number) => wertMit(alter, { ...opts, skillKey: 'sprint' });
    const berg = (alter: number) => wertMit(alter, { ...opts, skillKey: 'mountain' });
    // Sprint ist mit 24 oben, der Bergwert erst mit 26.
    expect(sprint(24)).toBeCloseTo(80, 6);
    expect(berg(24)).toBeLessThan(80);
    expect(berg(26)).toBeCloseTo(80, 6);
    // Beide fangen mit 29 an zu fallen — der Sprint nicht frueher.
    expect(sprint(29)).toBeCloseTo(80, 6);
    expect(sprint(30)).toBeLessThan(80);
    expect(berg(30)).toBeLessThan(80);
  });

  it('fuehrt Ausdauer spaeter hinauf und laesst sie spaeter fallen', () => {
    const opts = { ...basis, skill: 62, potential: 80, developmentValue: 10 };
    const ausdauer = (alter: number) => wertMit(alter, { ...opts, skillKey: 'stamina' });
    expect(ausdauer(26)).toBeLessThan(80);
    expect(ausdauer(28)).toBeCloseTo(80, 6);
    // Abbaubeginn 29 + 2 = 31.
    expect(ausdauer(31)).toBeCloseTo(80, 6);
    expect(ausdauer(32)).toBeLessThan(80);
    // Und mit dem Sockelalter steht sie trotzdem auf demselben Sockel: der
    // Versatz verschiebt den Beginn des Abbaus, nicht sein Ende.
    expect(ausdauer(PROGRESSION_FLOOR_AGE)).toBeCloseTo(resolveSkillFloor(80), 6);
  });

  it('haelt die Rangfolge zweier Fahrer bis zum Ende durch', () => {
    const stark = { ...basis, skill: 65, potential: 85, developmentValue: 10 };
    const schwach = { ...basis, skill: 60, potential: 70, developmentValue: 10 };
    for (const alter of [26, 30, 35, 40, PROGRESSION_FLOOR_AGE]) {
      expect(wertMit(alter, stark)).toBeGreaterThan(wertMit(alter, schwach));
    }
    // Mit einem fuer alle gleichen Sockel waeren am Ende beide gleich gewesen.
    expect(wertMit(PROGRESSION_FLOOR_AGE, stark)).toBeCloseTo(resolveSkillFloor(85), 6);
    expect(wertMit(PROGRESSION_FLOOR_AGE, schwach)).toBeCloseTo(resolveSkillFloor(70), 6);
    expect(resolveSkillFloor(85)).toBeGreaterThan(resolveSkillFloor(70));
  });

  it('nimmt einen Fahrer aus einem alten Spielstand dort auf, wo er steht', () => {
    // Weit unter Potenzial mit 24 — er holt bis zum Peak trotzdem auf.
    expect(wertMit(26, { ...basis, startAge: 24, skill: 55, potential: 80, developmentValue: 10 }))
      .toBeCloseTo(80, 6);
    // Ueber dem Potenzial: kein Wachstum, aber auch kein Abbau vor der Zeit.
    expect(wertMit(28, { ...basis, startAge: 24, skill: 82, potential: 80, developmentValue: 10 }))
      .toBeCloseTo(82, 6);
  });
});
