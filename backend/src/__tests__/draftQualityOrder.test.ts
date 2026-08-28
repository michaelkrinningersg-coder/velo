import { describe, expect, it } from 'vitest';
import type Database from 'better-sqlite3';
import { createTestDb, seedReferenceData, seedTeams, seedRider, seedGameState } from './helpers/testDb';
import { RiderDraftService, DRAFT_LOTTERY_SIZE, DRAFT_POOL_SIZE } from '../game/RiderDraftService';

/**
 * Der Draft ist eine gewichtete Lotterie — er soll nicht stur den Besten
 * nehmen. Er darf die Spitze aber auch nicht verlieren.
 *
 * Gemessen an einem echten Spielstand ging ein Fahrer ueber 74 im Schnitt erst
 * beim 84. Pick weg, der letzte erst beim 193. Grund war nicht ein einzelner
 * Zuschlag, sondern die Masse: die Wahrscheinlichkeit verteilte sich ueber den
 * ganzen Pool aus 100 Kandidaten, und achtzig schwache wiegen zusammen mehr als
 * die Spitze. Seither zieht die KI nur noch aus den nach Gewicht besten
 * `DRAFT_LOTTERY_SIZE` Kandidaten, und das Gewicht faellt steiler mit dem
 * Abstand zum Besten.
 */

const SAISON = 2028;

function aufbau(): Database.Database {
  const db = createTestDb();
  seedReferenceData(db);
  seedTeams(db, { count: 25, playerTeamId: 1 });
  seedGameState(db, { date: `${SAISON}-11-01`, season: SAISON, draftStatus: 'active', draftSeason: SAISON });

  // Alle Teams bis auf eines voll — so laufen alle Picks ueber dasselbe Team
  // und die Reihenfolge der Ergebnisse ist die Reihenfolge der Auswahl.
  const maxKader = (db.prepare('SELECT max_roster_size m FROM division_teams WHERE id = 1').get() as any).m;
  const vertrag = db.prepare(`INSERT INTO contracts (rider_id, team_id, start_season, end_season, status)
    VALUES (?, ?, ?, ?, 'active')`);
  for (let team = 1; team <= 25; team++) {
    const plaetze = team === 5 ? maxKader - 5 : maxKader;
    for (let i = 0; i < plaetze; i++) {
      const id = seedRider(db, { birthYear: SAISON - 26, overallRating: 60, potOverall: 62 });
      vertrag.run(id, team, SAISON, SAISON + 1);
    }
  }

  // Freies Feld: eine breite Staerkespanne, alle gleich alt und ohne
  // Nationen- oder Spezialisierungsvorteil, damit nur die Qualitaet wirkt.
  for (let i = 0; i < 120; i++) {
    const ovr = 58 + (i % 20);
    seedRider(db, {
      birthYear: SAISON - 27, overallRating: ovr, potOverall: ovr,
      spec1: 2, spec2: 2, spec3: 2,
    });
  }
  return db;
}

describe('Draft: die Spitze geht zuerst', () => {
  it('zieht die staerksten Fahrer, nicht irgendeinen aus der Masse', () => {
    // Das freie Feld reicht von 58 bis 77, je sechs Fahrer pro Stufe. Ein
    // Team hat fuenf Plaetze — es zieht also fuenfmal aus derselben Masse.
    // Ueber mehrere Drafts gemessen, weil eine Lotterie einzeln nichts beweist.
    const gezogen: number[] = [];
    for (let lauf = 0; lauf < 10; lauf++) {
      const db = aufbau();
      new RiderDraftService(db).executeDraft(SAISON);
      for (const zeile of db.prepare(
        'SELECT overall_at_draft ovr FROM draft_history WHERE season = ?',
      ).all(SAISON) as Array<{ ovr: number }>) {
        gezogen.push(zeile.ovr);
      }
      db.close();
    }
    expect(gezogen.length).toBe(50);

    const mittel = gezogen.reduce((summe, ovr) => summe + ovr, 0) / gezogen.length;
    const schwacheQuote = gezogen.filter((ovr) => ovr < 70).length / gezogen.length;

    // Gemessen mit der flachen Gewichtung: Mittel 72,1 und 15 Prozent der Picks
    // unter 68 — bis hinunter zu 60. Mit dem Lostopf: Mittel 74,1, kein Pick
    // unter 71. Die Schwellen liegen bewusst dazwischen.
    expect(mittel).toBeGreaterThanOrEqual(73);
    expect(schwacheQuote).toBeLessThanOrEqual(0.02);
  });

  it('laesst der Lotterie Raum: der Lostopf ist kleiner als der Pool, aber nicht eins', () => {
    // Beides zusammen ist die Aussage: der Spieler sieht die ganze Liste, die
    // KI zieht aus einem Ausschnitt — und sie zieht, sie waehlt nicht.
    expect(DRAFT_LOTTERY_SIZE).toBeGreaterThan(1);
    expect(DRAFT_LOTTERY_SIZE).toBeLessThan(DRAFT_POOL_SIZE);
  });

  it('zeigt dem Spieler weiterhin die volle Kandidatenliste', () => {
    const db = aufbau();
    const kandidaten = new RiderDraftService(db).getDraftCandidatesForNextPick(SAISON);
    expect(kandidaten.length).toBeGreaterThan(DRAFT_LOTTERY_SIZE);
    db.close();
  });
});
