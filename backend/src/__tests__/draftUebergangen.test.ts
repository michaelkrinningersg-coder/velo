import { describe, expect, it } from 'vitest';
import type Database from 'better-sqlite3';
import { createTestDb, seedReferenceData, seedTeams, seedRider, seedGameState } from './helpers/testDb';
import { RiderDraftService } from '../game/RiderDraftService';
import {
  PASSED_OVER_MAX,
  PASSED_OVER_RANKS,
  PASSED_OVER_STEP,
  resolvePassedOverFactor,
} from '../../../shared/draftWeights';

/**
 * Ungeduld im Draft: wer im Pool vorn steht und trotzdem liegen bleibt, wird mit
 * jedem Pick attraktiver.
 *
 * Der Zaehler steht nirgends gespeichert — er wird aus der Draft-Historie
 * abgeleitet. Das geht, weil der Draftwert eines Fahrers feststeht und der Pool
 * nur kleiner wird: ein Rang kann sich nur verbessern.
 */

const SAISON = 2028;

const fahrerEingabe = (passedOverPicks: number) => ({
  riderId: 1, overall: 70, potential: 72, age: 26, draftValue: 70,
  specialization1Id: 1, specialization2Id: null, specialization3Id: null,
  countryId: 1, oldTeamId: null, tenureSeasons: 0, isDeclining: false,
  peakAge: 26, passedOverPicks,
});

describe('resolvePassedOverFactor', () => {
  it('laesst einen frisch verfuegbaren Fahrer unveraendert', () => {
    expect(resolvePassedOverFactor(fahrerEingabe(0))).toBe(1);
  });

  it('waechst je uebergangenem Pick', () => {
    expect(resolvePassedOverFactor(fahrerEingabe(5))).toBeCloseTo(1 + (5 * PASSED_OVER_STEP), 10);
  });

  it('ist gedeckelt', () => {
    expect(resolvePassedOverFactor(fahrerEingabe(500))).toBe(PASSED_OVER_MAX);
  });
});

/**
 * Der Aufbau haelt alle Teams bis auf eines voll, damit der naechste Pick
 * berechenbar ist, und setzt alle Fahrer auf dasselbe Alter — dann ist der
 * Draftwert gleich der Gesamtwertung und die Rangfolge im Pool ablesbar.
 */
function aufbau(): { db: Database.Database; freie: number[] } {
  const db = createTestDb();
  seedReferenceData(db);
  seedTeams(db, { count: 25, playerTeamId: 1 });
  seedGameState(db, { date: `${SAISON}-11-01`, season: SAISON, draftStatus: 'active', draftSeason: SAISON });

  const maxKader = (db.prepare('SELECT max_roster_size m FROM division_teams WHERE id = 1').get() as any).m;
  const vertrag = db.prepare(`INSERT INTO contracts (rider_id, team_id, start_season, end_season, status)
    VALUES (?, ?, ?, ?, 'active')`);
  for (let team = 1; team <= 25; team += 1) {
    const plaetze = team === 5 ? maxKader - 12 : maxKader;
    for (let i = 0; i < plaetze; i += 1) {
      const id = seedRider(db, { birthYear: SAISON - 30, overallRating: 55, potOverall: 55 });
      vertrag.run(id, team, SAISON, SAISON + 1);
    }
  }

  // Freies Feld, absteigend stark. Alter 30: damit ist der Draftwert exakt die
  // Gesamtwertung, die Rangfolge im Pool also genau diese Reihenfolge.
  const freie: number[] = [];
  for (let i = 0; i < 12; i += 1) {
    freie.push(seedRider(db, {
      birthYear: SAISON - 30, overallRating: 78 - i, potOverall: 78 - i, activeTeamId: null,
    }));
  }
  return { db, freie };
}

function historie(
  db: Database.Database,
  eintraege: Array<{ pick: number; wert: number; riderId?: number }>,
): void {
  const insert = db.prepare(`
    INSERT INTO draft_history (season, draft_round, pick_number, team_id, rider_id,
      old_team_id, contract_length, overall_at_draft, pot_overall_at_draft, draft_value)
    VALUES (?, 1, ?, 2, ?, NULL, 2, ?, ?, ?)
  `);
  // Ein gezogener Fahrer bekommt einen Vertrag und verlaesst damit das freie
  // Feld — ohne das stuende er weiter im Pool und verschoebe die Raenge.
  const vertrag = db.prepare(`INSERT INTO contracts (rider_id, team_id, start_season, end_season, status)
    VALUES (?, 2, ?, ?, 'active')`);
  let naechsteId = 900000;
  for (const eintrag of eintraege) {
    let riderId = eintrag.riderId;
    if (riderId == null) {
      naechsteId += 1;
      riderId = naechsteId;
      seedRider(db, { id: riderId, birthYear: SAISON - 30, overallRating: eintrag.wert, potOverall: eintrag.wert });
    }
    vertrag.run(riderId, SAISON, SAISON + 1);
    insert.run(SAISON, eintrag.pick, riderId, eintrag.wert, eintrag.wert, eintrag.wert);
  }
}

function uebergangenLaut(db: Database.Database, riderId: number): number {
  const kandidat = new RiderDraftService(db).getDraftCandidatesForNextPick(SAISON)
    .find((k: any) => k.riderId === riderId);
  const eintrag = (kandidat?.factors ?? []).find((f: string) => f.startsWith('Uebergangen'));
  if (!eintrag) return 0;
  return Number(/Uebergangen (\d+)x/.exec(eintrag)?.[1] ?? 0);
}

describe('Zaehlung aus der Draft-Historie', () => {
  it('zaehlt fuer den von Anfang an Besten jeden gemachten Pick', () => {
    const { db, freie } = aufbau();
    // Vier Picks, alle schwaecher als die Spitze des freien Feldes.
    historie(db, [1, 2, 3, 4].map((pick) => ({ pick, wert: 50 })));
    expect(uebergangenLaut(db, freie[0]!)).toBe(4);
    db.close();
  });

  it('zaehlt erst ab dem Pick, an dem ein Fahrer in die Spitze aufrueckt', () => {
    const { db, freie } = aufbau();
    // freie[3] startet auf Rang 4. Er rueckt in die besten drei auf, sobald
    // einer der drei vor ihm weg ist — hier beim zweiten Pick, an dem der
    // Beste gezogen wird. Danach folgen noch zwei Picks, an denen er
    // uebergangen wurde.
    historie(db, [
      { pick: 1, wert: 50 },
      { pick: 5, wert: 78, riderId: freie[0]! },
      { pick: 6, wert: 50 },
      { pick: 7, wert: 50 },
    ]);
    expect(uebergangenLaut(db, freie[3]!)).toBe(2);
    // Die beiden, die von Anfang an vorn standen, zaehlen alle vier Picks.
    expect(uebergangenLaut(db, freie[1]!)).toBe(4);
    db.close();
  });

  it('gilt fuer die ersten drei, nicht fuer den vierten', () => {
    const { db, freie } = aufbau();
    historie(db, [{ pick: 1, wert: 50 }, { pick: 2, wert: 50 }]);
    for (let rang = 0; rang < PASSED_OVER_RANKS; rang += 1) {
      expect(uebergangenLaut(db, freie[rang]!)).toBe(2);
    }
    expect(uebergangenLaut(db, freie[PASSED_OVER_RANKS]!)).toBe(0);
    db.close();
  });

  it('laesst den Draftbeginn unberuehrt', () => {
    const { db, freie } = aufbau();
    expect(uebergangenLaut(db, freie[0]!)).toBe(0);
    db.close();
  });
});
