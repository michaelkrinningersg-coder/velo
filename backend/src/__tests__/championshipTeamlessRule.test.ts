import { describe, expect, it } from 'vitest';
import {
  CHAMPIONSHIP_CATEGORY_DEFS,
  NATIONAL_CHAMPIONSHIP_CATEGORY_IDS,
  categoryAllowsTeamlessRiders,
  championshipAllowsTeamless,
} from '../simulation/championships';

describe('Wer darf teamlos starten', () => {
  it('laesst nationale Meisterschaften teamlose Fahrer zu', () => {
    for (const categoryId of NATIONAL_CHAMPIONSHIP_CATEGORY_IDS) {
      expect(categoryAllowsTeamlessRiders(categoryId)).toBe(true);
    }
    expect(NATIONAL_CHAMPIONSHIP_CATEGORY_IDS.length).toBeGreaterThan(0);
  });

  it('folgt bei den anderen Meisterschaften der Altersklasse', () => {
    for (const def of CHAMPIONSHIP_CATEGORY_DEFS) {
      expect(categoryAllowsTeamlessRiders(def.categoryId))
        .toBe(championshipAllowsTeamless(def.ageClass));
    }
    // Elite und Olympia (OPEN) sind dabei, U23 und Junioren ebenso.
    const klassen = new Set(CHAMPIONSHIP_CATEGORY_DEFS.map((def) => def.ageClass));
    expect(klassen.has('ELITE')).toBe(true);
    expect(klassen.has('U23')).toBe(true);
  });

  it('sagt bei allem anderen nein', () => {
    const bekannt = new Set<number>([
      ...NATIONAL_CHAMPIONSHIP_CATEGORY_IDS,
      ...CHAMPIONSHIP_CATEGORY_DEFS.map((def) => def.categoryId),
    ]);
    for (let categoryId = 1; categoryId <= 40; categoryId += 1) {
      if (bekannt.has(categoryId)) continue;
      expect(categoryAllowsTeamlessRiders(categoryId)).toBe(false);
    }
    expect(categoryAllowsTeamlessRiders(null)).toBe(false);
    expect(categoryAllowsTeamlessRiders(undefined)).toBe(false);
  });
});
