import { describe, expect, it } from 'vitest';
import {
  DRAFT_VALUE_FALLOFF,
  NATION_BLIND_OVERALL,
  NATION_FACTORS,
  STRONG_MISSING_FACTOR,
  resolveDraftWeight,
  resolveFocusFactor,
  resolveQualityFactor,
  resolveLoyaltyFactor,
  resolveNationFactor,
  resolveStrongSpreadFactor,
  type DraftRiderInput,
  type DraftTeamInput,
  type NationPreferenceKind,
} from '../../../shared/draftWeights';
import {
  CONTRACT_TERM_VETERAN,
  CONTRACT_TERM_YOUNG,
  resolveContractTermRange,
  resolveContractYears,
} from '../../../shared/contractTerms';
import { resolvePrestigeByRank, resolveTopRiderCaps } from '../game/TeamPrestigeService';
import {
  SHARE_DEFICIT_FACTOR_MAX,
  SPEC_QUALITY_THRESHOLD,
  QUALITY_GOAL_FACTOR,
  QUALITY_GOAL_FACTOR_SECONDARY,
  SPEC_TALENT_MIN_AGE,
  SPEC_TALENT_POTENTIAL_MARGIN,
  decktSpecAb,
  resolveGoalSpecIds,
  type TeamSpecState,
} from '../../../shared/teamSpecTargets';

/** Schwerpunkt Berg 28, Huegel 23, Sprint 19, Rest je 10. */
const zielAnteile = new Map<number, number>([[1, 28], [2, 23], [3, 19], [4, 10], [5, 10], [7, 10]]);
const specZustand = (teil: Partial<TeamSpecState> = {}): TeamSpecState => ({
  targetShares: zielAnteile,
  actualShares: new Map<number, number>(),
  coveredSpecIds: new Set<number>(),
  ...teil,
});

const fahrer = (teil: Partial<DraftRiderInput> = {}): DraftRiderInput => ({
  riderId: 1, overall: 70, potential: 72, age: 26, draftValue: 70,
  specialization1Id: 1, specialization2Id: null, specialization3Id: null,
  countryId: 7, oldTeamId: null, tenureSeasons: 0, isDeclining: false, peakAge: 26, ...teil,
});

const team = (teil: Partial<DraftTeamInput> = {}): DraftTeamInput => ({
  teamId: 1, focusSpecIds: [1, 2, 3],
  nationKindByCountryId: new Map<number, NationPreferenceKind>([[7, 'home'], [3, 'neighbour'], [11, 'scouting']]),
  openQuotaSpecIds: new Set<number>(), quotaSpecIdsCountingSecondary: new Set<number>([4, 5]),
  strongCountBySpecId: new Map(), strongTargetBySpecId: new Map(),
  focusShare: 0, specState: specZustand(), rankIndex: 0, ...teil,
});

const keineKappe = { factor: 1, blocked: false, label: null };

describe('Nationenbindung im Draft', () => {
  it('gewichtet Heimat staerker als Nachbarland und Scoutingland', () => {
    expect(resolveNationFactor(fahrer({ countryId: 7 }), team())).toBe(NATION_FACTORS.home);
    expect(resolveNationFactor(fahrer({ countryId: 3 }), team())).toBe(NATION_FACTORS.neighbour);
    expect(resolveNationFactor(fahrer({ countryId: 11 }), team())).toBe(NATION_FACTORS.scouting);
    expect(resolveNationFactor(fahrer({ countryId: 99 }), team())).toBe(NATION_FACTORS.none);
  });

  it('laesst Weltklasse ungewichtet — sonst faende der starke Exot kein Team', () => {
    const stark = fahrer({ countryId: 99, overall: NATION_BLIND_OVERALL });
    expect(resolveNationFactor(stark, team())).toBe(1);
    // Und der Landsmann bekommt dann auch keinen Vorteil mehr.
    expect(resolveNationFactor({ ...stark, countryId: 7 }, team())).toBe(1);
  });
});

describe('Zielverteilung der Spezialisierungen', () => {
  it('wirkt voll bei leerem Kader und verschwindet am Zielanteil', () => {
    expect(resolveFocusFactor(fahrer({ specialization1Id: 1 }), team()))
      .toBeCloseTo(SHARE_DEFICIT_FACTOR_MAX, 6);
    const erfuellt = team({ specState: specZustand({ actualShares: new Map([[1, 28]]) }) });
    expect(resolveFocusFactor(fahrer({ specialization1Id: 1 }), erfuellt)).toBe(1);
    // Ueber dem Ziel bleibt es bei 1, es gibt keinen Abschlag.
    const ueber = team({ specState: specZustand({ actualShares: new Map([[1, 40]]) }) });
    expect(resolveFocusFactor(fahrer({ specialization1Id: 1 }), ueber)).toBe(1);
  });

  it('stuft nach der Hoehe des Zielanteils ab, laesst aber keine Spezialisierung aussen vor', () => {
    const t = team();
    const berg = resolveFocusFactor(fahrer({ specialization1Id: 1 }), t);
    const sprint = resolveFocusFactor(fahrer({ specialization1Id: 3 }), t);
    const pflaster = resolveFocusFactor(fahrer({ specialization1Id: 5 }), t);
    // Bei leerem Kader ist die relative Luecke ueberall 100 Prozent - der
    // Unterschied entsteht erst, wenn der Kader sich fuellt.
    expect(berg).toBeCloseTo(sprint, 6);
    expect(pflaster).toBeGreaterThan(1);

    // Mit halb gefuelltem Schwerpunkt zieht die schwaecher besetzte Spec staerker.
    const teilweise = team({ specState: specZustand({ actualShares: new Map([[1, 25], [5, 2]]) }) });
    expect(resolveFocusFactor(fahrer({ specialization1Id: 5 }), teilweise))
      .toBeGreaterThan(resolveFocusFactor(fahrer({ specialization1Id: 1 }), teilweise));
  });

  it('kennt keine Spezialisierung ausserhalb der Zielverteilung', () => {
    // Der Angreifer (6) ist bewusst nicht Teil der Verteilung.
    expect(resolveFocusFactor(fahrer({ specialization1Id: 6 }), team())).toBe(1);
  });
});

describe('Qualitaetsziel je Spezialisierung', () => {
  it('bevorzugt den Fahrer, der eine offene Spezialisierung ueber die Schwelle hebt', () => {
    const stark = fahrer({ specialization1Id: 1, overall: SPEC_QUALITY_THRESHOLD + 1 });
    expect(resolveQualityFactor(stark, team())).toBe(QUALITY_GOAL_FACTOR);
  });

  it('faellt weg, sobald die Spezialisierung bedient ist', () => {
    const t = team({ specState: specZustand({ coveredSpecIds: new Set([1]) }) });
    expect(resolveQualityFactor(fahrer({ specialization1Id: 1, overall: 80 }), t)).toBe(1);
  });

  it('greift nicht unterhalb der Schwelle', () => {
    expect(resolveQualityFactor(fahrer({ specialization1Id: 1, overall: SPEC_QUALITY_THRESHOLD }), team())).toBe(1);
  });

  it('wirkt ausserhalb der angestrebten Spezialisierungen schwaecher', () => {
    // Zeitfahren (4) liegt bei 10 Prozent und ist damit kein Ziel.
    const zf = fahrer({ specialization1Id: 4, overall: SPEC_QUALITY_THRESHOLD + 1 });
    expect(resolveQualityFactor(zf, team())).toBe(QUALITY_GOAL_FACTOR_SECONDARY);
  });

  it('erkennt ein Talent als Abdeckung, auch unterhalb der Schwelle', () => {
    // Potential 75, 20 Jahre alt, Zenit mit 26 - zaehlt.
    const talent = fahrer({
      specialization1Id: 1,
      overall: 64,
      potential: SPEC_QUALITY_THRESHOLD + SPEC_TALENT_POTENTIAL_MARGIN,
      age: 20,
      peakAge: 26,
    });
    expect(decktSpecAb({ specId: 1, overall: 64, potential: 75, age: 20, peakAge: 26 })).toBe(true);
    expect(resolveQualityFactor(talent, team())).toBe(QUALITY_GOAL_FACTOR);
  });

  it('laesst ein Talent nicht zaehlen, wenn Potential, Alter oder Zenit nicht passen', () => {
    const basis = { specId: 1, overall: 64, potential: 75, age: 20, peakAge: 26 };
    // Potential zu niedrig
    expect(decktSpecAb({ ...basis, potential: 74 })).toBe(false);
    // Zu jung
    expect(decktSpecAb({ ...basis, age: SPEC_TALENT_MIN_AGE - 1 })).toBe(false);
    // Zu nah am Zenit: mit 25 bei Zenit 26 bleibt nur ein Jahr
    expect(decktSpecAb({ ...basis, age: 25 })).toBe(false);
    expect(decktSpecAb({ ...basis, age: 24 })).toBe(true);
    // Ohne Zenitangabe kein Talentweg
    expect(decktSpecAb({ ...basis, peakAge: null })).toBe(false);
  });

  it('zaehlt einen fertigen Fahrer weiterhin unabhaengig vom Alter', () => {
    expect(decktSpecAb({ specId: 1, overall: 80, potential: 80, age: 34, peakAge: 27 })).toBe(true);
  });

  it('zaehlt Pflaster immer zu den Zielen, auch bei niedrigem Anteil', () => {
    const ziele = resolveGoalSpecIds(zielAnteile);
    expect(ziele.has(5)).toBe(true);
    expect([...ziele].sort()).toEqual([1, 2, 3, 5]);
    const pf = fahrer({ specialization1Id: 5, overall: SPEC_QUALITY_THRESHOLD + 1 });
    expect(resolveQualityFactor(pf, team())).toBe(QUALITY_GOAL_FACTOR);
  });
});

describe('Loyalitaet', () => {
  it('gilt nur fuer eigene Fahrer und steigt mit der Zugehoerigkeit', () => {
    expect(resolveLoyaltyFactor(fahrer({ oldTeamId: 2, tenureSeasons: 5 }), team())).toBe(1);
    const kurz = resolveLoyaltyFactor(fahrer({ oldTeamId: 1, tenureSeasons: 1 }), team());
    const lang = resolveLoyaltyFactor(fahrer({ oldTeamId: 1, tenureSeasons: 4 }), team());
    expect(lang).toBeGreaterThan(kurz);
    expect(kurz).toBeGreaterThan(1);
  });

  it('daempft Fahrer nach ihrem Zenit', () => {
    const frisch = resolveLoyaltyFactor(fahrer({ oldTeamId: 1, tenureSeasons: 4 }), team());
    const alt = resolveLoyaltyFactor(fahrer({ oldTeamId: 1, tenureSeasons: 4, isDeclining: true }), team());
    expect(alt).toBeLessThan(frisch);
    expect(alt).toBeGreaterThanOrEqual(1);
  });
});

describe('Verteilung der Spitzenfahrer', () => {
  it('belohnt die Luecke und bestraft die Haeufung', () => {
    const stark = fahrer({ overall: 78, specialization1Id: 1 });
    const ziel = new Map([[1, 2]]);
    expect(resolveStrongSpreadFactor(stark, team({ strongTargetBySpecId: ziel })))
      .toBe(STRONG_MISSING_FACTOR);
    const zwei = team({ strongCountBySpecId: new Map([[1, 2]]), strongTargetBySpecId: ziel });
    const acht = team({ strongCountBySpecId: new Map([[1, 8]]), strongTargetBySpecId: ziel });
    expect(resolveStrongSpreadFactor(stark, zwei)).toBeLessThan(1);
    // Rampe statt Stufe: acht starke Bergfahrer wiegen schwerer als zwei.
    expect(resolveStrongSpreadFactor(stark, acht)).toBeLessThan(resolveStrongSpreadFactor(stark, zwei));
  });

  it('laesst schwache Fahrer unberuehrt', () => {
    expect(resolveStrongSpreadFactor(fahrer({ overall: 70 }), team())).toBe(1);
  });
});

describe('Gesamtgewicht', () => {
  it('faellt exponentiell mit dem Abstand zum besten Fahrer', () => {
    const t = team();
    const nah = resolveDraftWeight(fahrer({ draftValue: 78, countryId: 99 }), t, 78, keineKappe).weight;
    const fern = resolveDraftWeight(fahrer({ draftValue: 78 - DRAFT_VALUE_FALLOFF, countryId: 99 }), t, 78, keineKappe).weight;
    expect(fern / nah).toBeCloseTo(Math.exp(-1), 3);
  });

  it('sperrt einen Fahrer, dessen Kappe erreicht ist', () => {
    const ergebnis = resolveDraftWeight(fahrer(), team(), 70, { factor: 0, blocked: true, label: 'Sperre' });
    expect(ergebnis.blocked).toBe(true);
  });

  it('haelt einen eigenen Stammfahrer gegen einen etwas besseren Fremden', () => {
    const t = team({ focusShare: 1 });
    const eigener = resolveDraftWeight(
      fahrer({ draftValue: 72, countryId: 99, oldTeamId: 1, tenureSeasons: 4 }), t, 75, keineKappe).weight;
    const fremder = resolveDraftWeight(
      fahrer({ draftValue: 75, countryId: 99 }), t, 75, keineKappe).weight;
    expect(eigener).toBeGreaterThan(fremder);
  });
});

describe('Vertragslaengen', () => {
  it('bindet Talente lang und Veteranen kurz', () => {
    expect(resolveContractTermRange({ age: 21, potential: 76, retirementAge: 36 })).toEqual(CONTRACT_TERM_YOUNG);
    expect(resolveContractTermRange({ age: 32, potential: 76, retirementAge: 38 })).toEqual(CONTRACT_TERM_VETERAN);
  });

  it('gibt vor dem Karriereende nur noch ein Jahr', () => {
    expect(resolveContractYears({ age: 34, potential: 70, retirementAge: 35 }, () => 0.99)).toBe(1);
  });

  it('geht nie ueber das Karriereende hinaus', () => {
    for (let alter = 20; alter < 36; alter += 1) {
      const jahre = resolveContractYears({ age: alter, potential: 80, retirementAge: 36, teamPrestige: 5 }, () => 0.99);
      expect(alter + jahre).toBeLessThanOrEqual(36);
    }
  });

  it('laesst Spitzenteams laenger binden als Ausbildungsteams', () => {
    const stark = resolveContractYears({ age: 20, potential: 78, retirementAge: 38, teamPrestige: 5 }, () => 0.99);
    const schwach = resolveContractYears({ age: 20, potential: 78, retirementAge: 38, teamPrestige: 1 }, () => 0.99);
    expect(stark).toBeGreaterThan(schwach);
  });

  it('trifft im Mittel rund drei Jahre', () => {
    // Die Kennzahl, an der die Fluktuation haengt: 40 x (1/3) x 0,65 x 0,75
    // plus Renteneintritte ergibt rund acht Wechsel je Saison.
    let summe = 0, n = 0;
    for (let alter = 20; alter <= 34; alter += 1) {
      for (let i = 0; i < 200; i += 1) {
        summe += resolveContractYears({ age: alter, potential: 72, retirementAge: 36 }, Math.random);
        n += 1;
      }
    }
    const mittel = summe / n;
    expect(mittel).toBeGreaterThan(2.4);
    expect(mittel).toBeLessThan(3.4);
  });
});

describe('Prestige', () => {
  it('verteilt 25 Teams auf fuenf gleich grosse Stufen', () => {
    const stufen = Array.from({ length: 25 }, (_, index) => resolvePrestigeByRank(index, 25));
    expect(stufen[0]).toBe(5);
    expect(stufen[24]).toBe(1);
    for (const stufe of [1, 2, 3, 4, 5]) {
      expect(stufen.filter((s) => s === stufe)).toHaveLength(5);
    }
  });

  it('faechert die Top-Fahrer-Kappe auf und laesst Prestige 3 beim alten Wert', () => {
    expect(resolveTopRiderCaps(3)).toEqual({ cap77: 4, cap74: 10 });
    expect(resolveTopRiderCaps(5).cap77).toBeGreaterThan(resolveTopRiderCaps(3).cap77);
    expect(resolveTopRiderCaps(1).cap77).toBeLessThan(resolveTopRiderCaps(3).cap77);
  });
});
