import { describe, it, expect } from 'vitest';
import {
  scoreRivalryPair,
  selectSeasonRivalries,
  deriveRivalryDiscipline,
  type RivalryDuel,
  type RivalryPairMeta,
  type RankedRivalryPair,
} from '../../../shared/rivalries';

const TARGET = 2027;

// Kapitaene, unterschiedliche Teams, gleicher Jahrgang.
function meta(overrides: Partial<RivalryPairMeta> = {}): RivalryPairMeta {
  return { birthYearA: 2000, birthYearB: 2000, teamA: 1, teamB: 2, roleA: 1, roleB: 1, ...overrides };
}

// Erzeugt n ausgeglichene GC-Duelle (abwechselnd P1/P2) in einer Saison.
function balancedDuels(n: number, season = TARGET, categoryId = 2): RivalryDuel[] {
  return Array.from({ length: n }, (_, i) => ({
    season, categoryId, type: 'GC' as const,
    rankA: i % 2 === 0 ? 1 : 2,
    rankB: i % 2 === 0 ? 2 : 1,
  }));
}

describe('scoreRivalryPair — Gates', () => {
  it('same_team wird abgelehnt', () => {
    const s = scoreRivalryPair(balancedDuels(8), meta({ teamB: 1 }), TARGET);
    expect(s.qualifies).toBe(false);
    expect(s.reason).toBe('same_team');
  });

  it('Altersunterschied > 6 wird abgelehnt', () => {
    const s = scoreRivalryPair(balancedDuels(8), meta({ birthYearB: 1993 }), TARGET);
    expect(s.qualifies).toBe(false);
    expect(s.reason).toBe('age_delta');
  });

  it('nicht-eligible Rolle wird abgelehnt', () => {
    const s = scoreRivalryPair(balancedDuels(8), meta({ roleB: 5 }), TARGET);
    expect(s.qualifies).toBe(false);
    expect(s.reason).toBe('role');
  });

  it('zu wenige Begegnungen (<6) wird abgelehnt', () => {
    const s = scoreRivalryPair(balancedDuels(4), meta(), TARGET);
    expect(s.qualifies).toBe(false);
    expect(s.reason).toBe('few_encounters');
  });

  it('dominantes Duo (winShare > 0.70) wird abgelehnt', () => {
    // 8 Duelle, A gewinnt 7 (87.5 %) -> dominant.
    const duels: RivalryDuel[] = Array.from({ length: 8 }, (_, i) => ({
      season: TARGET, categoryId: 2, type: 'GC' as const,
      rankA: i < 7 ? 1 : 2, rankB: i < 7 ? 2 : 1,
    }));
    const s = scoreRivalryPair(duels, meta(), TARGET);
    expect(s.qualifies).toBe(false);
    expect(s.reason).toBe('dominant');
  });

  it('inaktiv in Zielsaison (<2 Duelle) wird abgelehnt', () => {
    // 8 Duelle, aber alle in 2025 -> in 2027 inaktiv.
    const s = scoreRivalryPair(balancedDuels(8, 2025), meta(), TARGET);
    expect(s.qualifies).toBe(false);
    expect(s.reason).toBe('inactive_season');
  });
});

describe('scoreRivalryPair — qualifizierendes Paar', () => {
  it('ausgeglichenes GC-Duo qualifiziert und liefert Kennzahlen', () => {
    const s = scoreRivalryPair(balancedDuels(8), meta(), TARGET);
    expect(s.qualifies).toBe(true);
    expect(s.encounters).toBe(8);
    expect(s.winA).toBe(4);
    expect(s.winB).toBe(4);
    expect(s.seasonEncounters).toBe(8);
    expect(s.topCategoryId).toBe(2);
    expect(s.balance).toBeCloseTo(1, 5);
    expect(s.intensity).toBeGreaterThan(0);
  });

  it('Grand Tour (Gewicht 2.0) schlaegt One Day Low (0.6) bei sonst gleichem Muster', () => {
    const gt = scoreRivalryPair(balancedDuels(8, TARGET, 2), meta(), TARGET);
    const odl = scoreRivalryPair(balancedDuels(8, TARGET, 9), meta(), TARGET);
    expect(gt.intensity).toBeGreaterThan(odl.intensity);
  });

  it('geringerer Altersunterschied erhoeht die Intensitaet', () => {
    const sameAge = scoreRivalryPair(balancedDuels(8), meta(), TARGET);
    const gap = scoreRivalryPair(balancedDuels(8), meta({ birthYearB: 1995 }), TARGET); // Δ5
    expect(sameAge.intensity).toBeGreaterThan(gap.intensity);
  });
});

describe('selectSeasonRivalries', () => {
  it('sortiert nach Intensitaet, jeder Fahrer max. 1x, Top-Index ~92', () => {
    const strong = scoreRivalryPair(balancedDuels(12, TARGET, 2), meta(), TARGET);
    const second = scoreRivalryPair(balancedDuels(9, TARGET, 2), meta(), TARGET);
    const pairs: RankedRivalryPair[] = [
      { aId: 1, bId: 2, score: strong },
      { aId: 3, bId: 4, score: second },
    ];
    const sel = selectSeasonRivalries(pairs);
    expect(sel.length).toBe(2);
    expect(sel[0].aId).toBe(1);
    expect(sel[0].rank).toBe(1);
    expect(sel[0].index).toBeGreaterThanOrEqual(90);
    expect(sel[0].index).toBeLessThanOrEqual(93);
  });

  it('ein Fahrer taucht nur in seiner staerksten Rivalitaet auf', () => {
    const strong = scoreRivalryPair(balancedDuels(12, TARGET, 2), meta(), TARGET);
    const alsoStrong = scoreRivalryPair(balancedDuels(10, TARGET, 2), meta(), TARGET);
    // Fahrer 1 in beiden Paaren -> nur das staerkere bleibt.
    const pairs: RankedRivalryPair[] = [
      { aId: 1, bId: 2, score: strong },
      { aId: 1, bId: 3, score: alsoStrong },
    ];
    const sel = selectSeasonRivalries(pairs);
    expect(sel.length).toBe(1);
    expect(sel[0].bId).toBe(2);
  });

  it('Paare mit zu niedrigem Index (relativ zum Top) fallen raus', () => {
    const strong = scoreRivalryPair(balancedDuels(12, TARGET, 2), meta(), TARGET);
    const tooWeak = scoreRivalryPair(balancedDuels(6, TARGET, 8), meta(), TARGET); // Index ~21
    const sel = selectSeasonRivalries([
      { aId: 1, bId: 2, score: strong },
      { aId: 3, bId: 4, score: tooWeak },
    ]);
    expect(sel.length).toBe(1);
    expect(sel[0].aId).toBe(1);
  });

  it('maximal 10 Rivalitaeten', () => {
    const pairs: RankedRivalryPair[] = Array.from({ length: 15 }, (_, i) => ({
      aId: i * 2 + 1, bId: i * 2 + 2,
      score: scoreRivalryPair(balancedDuels(8, TARGET, 2), meta(), TARGET),
    }));
    const sel = selectSeasonRivalries(pairs);
    expect(sel.length).toBeLessThanOrEqual(10);
  });
});

describe('deriveRivalryDiscipline', () => {
  it('zwei Sprinter -> Sprint', () => {
    expect(deriveRivalryDiscipline(7, 6, 6)).toBe('Sprint');
  });
  it('Grand Tour -> GC', () => {
    expect(deriveRivalryDiscipline(2, 1, 1)).toBe('GC');
  });
  it('Monument -> Monument', () => {
    expect(deriveRivalryDiscipline(3, 1, 2)).toBe('Monument');
  });
  it('One Day High -> One-Day', () => {
    expect(deriveRivalryDiscipline(7, 1, 2)).toBe('One-Day');
  });
});
