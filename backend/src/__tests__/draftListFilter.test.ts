import { describe, expect, it } from 'vitest';
import {
  applyDraftListSteuerung,
  draftListSteuerungStandard,
  type DraftListSteuerung,
} from '../../../frontend/src/views/draftListFilter';

const SAISON = 2028;

const k = (teil: Partial<Record<string, unknown>> = {}) => ({
  riderId: 1, lastName: 'Muster', countryCode: 'GER', oldTeamName: 'Team A',
  specialization1: 'Berg', specialization2: null, specialization3: null,
  overallRating: 70, potential: 74, birthYear: SAISON - 26,
  uciRank: 50, wins: 0, blocked: false, ...teil,
});

const steuerung = (teil: Partial<DraftListSteuerung> = {}): DraftListSteuerung =>
  ({ ...draftListSteuerungStandard(), ...teil });

const feld = [
  k({ riderId: 1, lastName: 'Alt', overallRating: 76, potential: 76, birthYear: SAISON - 33, uciRank: 3, wins: 12, countryCode: 'FRA', oldTeamName: 'Zenit' }),
  k({ riderId: 2, lastName: 'Talent', overallRating: 64, potential: 79, birthYear: SAISON - 19, uciRank: null, wins: 0, countryCode: 'BEL', oldTeamName: null, specialization1: 'Sprint' }),
  k({ riderId: 3, lastName: 'Mitte', overallRating: 71, potential: 73, birthYear: SAISON - 26, uciRank: 120, wins: 3, countryCode: 'GER', oldTeamName: 'Alpha' }),
  k({ riderId: 4, lastName: 'Gesperrt', overallRating: 78, potential: 78, birthYear: SAISON - 28, uciRank: 1, wins: 20, countryCode: 'ESP', oldTeamName: 'Alpha', blocked: true }),
];

const ids = (liste: any[]) => liste.map((x) => x.riderId);

describe('Sortierung der Draft-Kandidatenliste', () => {
  it('sortiert standardmaessig nach Faehigkeit absteigend', () => {
    expect(ids(applyDraftListSteuerung(feld, steuerung(), SAISON))).toEqual([4, 1, 3, 2]);
  });

  it('dreht die Richtung um', () => {
    expect(ids(applyDraftListSteuerung(feld, steuerung({ absteigend: false }), SAISON))).toEqual([2, 3, 1, 4]);
  });

  it('sortiert nach Potential, Alter und Siegen', () => {
    expect(ids(applyDraftListSteuerung(feld, steuerung({ sortKey: 'potential' }), SAISON))[0]).toBe(2);
    // Alter absteigend: der aelteste zuerst
    expect(ids(applyDraftListSteuerung(feld, steuerung({ sortKey: 'age' }), SAISON))[0]).toBe(1);
    expect(ids(applyDraftListSteuerung(feld, steuerung({ sortKey: 'age', absteigend: false }), SAISON))[0]).toBe(2);
    expect(ids(applyDraftListSteuerung(feld, steuerung({ sortKey: 'wins' }), SAISON))[0]).toBe(4);
  });

  it('stellt beim UCI-Rang den besten Rang nach vorn und Fahrer ohne Rang nach hinten', () => {
    const absteigend = ids(applyDraftListSteuerung(feld, steuerung({ sortKey: 'uci' }), SAISON));
    expect(absteigend[0]).toBe(4);      // Rang 1
    expect(absteigend.at(-1)).toBe(2);  // ohne Rang
    const aufsteigend = ids(applyDraftListSteuerung(feld, steuerung({ sortKey: 'uci', absteigend: false }), SAISON));
    expect(aufsteigend[0]).toBe(3);     // Rang 120
    expect(aufsteigend.at(-1)).toBe(2); // ohne Rang bleibt hinten
  });

  it('sortiert nach Land und Team alphabetisch, Teamlose zuletzt', () => {
    expect(ids(applyDraftListSteuerung(feld, steuerung({ sortKey: 'country', absteigend: false }), SAISON))[0]).toBe(2); // BEL
    const nachTeam = ids(applyDraftListSteuerung(feld, steuerung({ sortKey: 'team', absteigend: false }), SAISON));
    expect(nachTeam.at(-1)).toBe(2); // ohne altes Team
    expect(nachTeam[0]).toBe(4);     // Alpha, staerkerer von zweien
  });

  it('laesst die Eingabeliste unveraendert', () => {
    const vorher = ids(feld);
    applyDraftListSteuerung(feld, steuerung({ sortKey: 'age' }), SAISON);
    expect(ids(feld)).toEqual(vorher);
  });
});

describe('Filter der Draft-Kandidatenliste', () => {
  it('filtert nach Team, Land und Typ', () => {
    expect(ids(applyDraftListSteuerung(feld, steuerung({ team: 'Alpha' }), SAISON)).sort()).toEqual([3, 4]);
    expect(ids(applyDraftListSteuerung(feld, steuerung({ land: 'GER' }), SAISON))).toEqual([3]);
    expect(ids(applyDraftListSteuerung(feld, steuerung({ spez: 'Sprint' }), SAISON))).toEqual([2]);
  });

  it('filtert nach Faehigkeit, Potential, Alter und Siegen', () => {
    expect(ids(applyDraftListSteuerung(feld, steuerung({ minOverall: 76 }), SAISON))).toEqual([4, 1]);
    expect(ids(applyDraftListSteuerung(feld, steuerung({ minPotential: 78 }), SAISON)).sort()).toEqual([2, 4]);
    expect(ids(applyDraftListSteuerung(feld, steuerung({ maxAlter: 20 }), SAISON))).toEqual([2]);
    expect(ids(applyDraftListSteuerung(feld, steuerung({ minSiege: 5 }), SAISON)).sort()).toEqual([1, 4]);
  });

  it('wirft beim UCI-Filter Fahrer ohne Rang heraus', () => {
    expect(ids(applyDraftListSteuerung(feld, steuerung({ maxUci: 100 }), SAISON)).sort()).toEqual([1, 4]);
  });

  it('blendet gesperrte Fahrer auf Wunsch aus', () => {
    expect(ids(applyDraftListSteuerung(feld, steuerung({ nurWaehlbare: true }), SAISON))).toEqual([1, 3, 2]);
  });

  it('kombiniert Filter und liefert notfalls eine leere Liste', () => {
    expect(applyDraftListSteuerung(feld, steuerung({ land: 'GER', minOverall: 90 }), SAISON)).toEqual([]);
  });
});
