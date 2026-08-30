import { describe, expect, it, beforeEach } from 'vitest';
import type Database from 'better-sqlite3';
import { createTestDb, seedReferenceData, seedTeams, seedRider } from './helpers/testDb';
import { WrappedService } from '../game/WrappedService';

/**
 * Saison-Rueckblick: die Auswertungen, die neu dazugekommen sind.
 *
 * Die Ereignistabelle laesst je Etappe, Fahrer und Wertungsart genau eine Zeile
 * zu — mehrere Ergebnisse desselben Fahrers im selben Rennen brauchen deshalb
 * verschiedene Etappen.
 */

let db: Database.Database;

function legeRennen(id: number, name: string, saison: number, opts: {
  etappen?: number; kategorie?: number; rundfahrt?: boolean;
} = {}): void {
  const etappen = opts.etappen ?? 1;
  db.prepare(`
    INSERT INTO races (id, name, country_id, category_id, is_stage_race, number_of_stages,
      start_date, end_date, prestige)
    VALUES (?, ?, 1, ?, ?, ?, ?, ?, 80)
  `).run(id, name, opts.kategorie ?? 1, opts.rundfahrt === false ? 0 : 1, etappen,
    `${saison}-07-01`, `${saison}-07-${String(Math.max(1, etappen)).padStart(2, '0')}`);
}

function punkte(raceId: number, saison: number, awardType: string, rank: number,
  riderId: number, teamId: number,
  opts: { punkte?: number; tag?: string; etappe?: number } = {}): void {
  db.prepare(`
    INSERT INTO season_point_events
      (season, race_id, stage_id, rider_id, team_id, award_type, rank, points_awarded, awarded_on)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(saison, raceId, raceId * 1000 + (opts.etappe ?? 1), riderId, teamId, awardType, rank,
    opts.punkte ?? 100, opts.tag ?? `${saison}-07-01`);
}

beforeEach(() => {
  db = createTestDb();
  seedReferenceData(db);
  seedTeams(db, { count: 3, playerTeamId: 1 });
  seedRider(db, { id: 1, lastName: 'Erster', activeTeamId: 1 });
  seedRider(db, { id: 2, lastName: 'Zweiter', activeTeamId: 2 });
  seedRider(db, { id: 3, lastName: 'Dritter', activeTeamId: 3 });
});

describe('Meiste zweite Plaetze', () => {
  it('zaehlt nur echte Rennergebnisse, keine Wertungstrikots', () => {
    legeRennen(10, 'Rundfahrt', 2030, { etappen: 5 });
    // Zweiter wird dreimal Etappenzweiter und einmal Zweiter der Bergwertung.
    punkte(10, 2030, 'stage_result', 2, 2, 2, { etappe: 1 });
    punkte(10, 2030, 'stage_result', 2, 2, 2, { etappe: 2 });
    punkte(10, 2030, 'stage_result', 2, 2, 2, { etappe: 3 });
    punkte(10, 2030, 'mountain_final', 2, 2, 2, { etappe: 4 });
    // Erster wird einmal Zweiter und einmal Erster.
    punkte(10, 2030, 'stage_result', 2, 1, 1, { etappe: 1 });
    punkte(10, 2030, 'stage_result', 1, 1, 1, { etappe: 2 });

    const w = new WrappedService(db).getWrapped(2030);
    expect(w.topRidersBySecond.map((e) => [e.rider.riderId, e.wins]))
      .toEqual([[2, 3], [1, 1]]);
  });
});

describe('Ranglisten mit Vorjahresplatz', () => {
  it('kennt den Platz aus der vollen Vorjahresliste, nicht nur aus deren Spitze', () => {
    legeRennen(20, 'Klassiker', 2029, { rundfahrt: false });
    legeRennen(21, 'Klassiker', 2030, { rundfahrt: false });
    // 2029: Dritter gewinnt zweimal, Erster einmal -> Erster liegt auf Platz 2.
    punkte(20, 2029, 'one_day_result', 1, 3, 3, { etappe: 1 });
    punkte(20, 2029, 'one_day_result', 1, 3, 3, { etappe: 2 });
    punkte(20, 2029, 'one_day_result', 1, 1, 1, { etappe: 3 });
    // 2030: Erster gewinnt dreimal.
    punkte(21, 2030, 'one_day_result', 1, 1, 1, { etappe: 1 });
    punkte(21, 2030, 'one_day_result', 1, 1, 1, { etappe: 2 });
    punkte(21, 2030, 'one_day_result', 1, 1, 1, { etappe: 3 });

    const w = new WrappedService(db).getWrapped(2030);
    expect(w.topRidersByWins[0]?.rider.riderId).toBe(1);
    expect(w.topRidersByWins[0]?.previousRank).toBe(2);
  });

  it('zeigt zehn statt drei Eintraege', () => {
    legeRennen(30, 'Grosses Rennen', 2030, { etappen: 12 });
    for (let i = 1; i <= 12; i += 1) {
      seedRider(db, { id: 100 + i, lastName: `F${i}`, activeTeamId: 1 });
      punkte(30, 2030, 'stage_result', 1, 100 + i, 1, { etappe: i });
    }
    expect(new WrappedService(db).getWrapped(2030).topRidersByWins).toHaveLength(10);
  });
});

describe('Trikottage', () => {
  it('wertet die Fuehrungstrikot-Ereignisse aus, die sonst herausgefiltert werden', () => {
    legeRennen(40, 'Rundfahrt', 2030, { etappen: 6 });
    for (let etappe = 1; etappe <= 4; etappe += 1) {
      punkte(40, 2030, 'gc_leader_day', 1, 1, 1, { etappe, punkte: 5 });
    }
    punkte(40, 2030, 'gc_leader_day', 1, 2, 2, { etappe: 5, punkte: 5 });
    punkte(40, 2030, 'mountain_leader_day', 1, 3, 3, { etappe: 1, punkte: 3 });

    const gruppen = new WrappedService(db).getWrapped(2030).jerseyDays;
    const gesamt = gruppen.find((g) => g.key === 'gc');
    expect(gesamt?.holders[0]).toMatchObject({ days: 4 });
    expect(gesamt?.holders[0]?.rider.riderId).toBe(1);
    expect(gesamt?.holders[1]?.days).toBe(1);
    expect(gruppen.find((g) => g.key === 'mountain')?.holders[0]?.days).toBe(1);
    // Wertungen ohne Traeger tauchen gar nicht erst auf.
    expect(gruppen.some((g) => g.key === 'youth')).toBe(false);
  });
});

describe('Karriereergebnisse', () => {
  it('fuehrt alle Jahre einer Ergebnisgruppe, nicht nur das letzte', () => {
    for (const saison of [2028, 2029, 2031]) {
      const id = saison;
      legeRennen(id, 'Traditionsrennen', saison, { rundfahrt: false });
      punkte(id, saison, 'one_day_result', 1, 1, 1);
    }
    db.prepare('UPDATE riders SET retired_season = 2031 WHERE id = 1').run();

    const retiree = new WrappedService(db).getWrapped(2031).retirees[0];
    const gruppe = retiree?.bestResults.find((r) => r.raceName === 'Traditionsrennen');
    expect(gruppe?.count).toBe(3);
    expect(gruppe?.seasons).toEqual([2028, 2029, 2031]);
  });

  it('traegt die Rennkategorie mit, nach der die Siege gruppiert werden', () => {
    // Die Testdatenbank traegt nur die Meisterschaftskategorien; die
    // World-Tour-Stufen kommen sonst aus der CSV.
    db.prepare(`INSERT INTO race_categories
      (id, name, tier, number_of_teams, number_of_riders, bonus_system_id, home_selection_probability)
      VALUES (2, 'World Tour - Grand Tour', 1, 25, 8, 1, 0.02)`).run();
    legeRennen(60, 'Grosse Rundfahrt', 2031, { etappen: 2, kategorie: 2 });
    punkte(60, 2031, 'gc_final', 1, 1, 1, { etappe: 1 });
    punkte(60, 2031, 'stage_result', 1, 1, 1, { etappe: 2 });
    db.prepare('UPDATE riders SET retired_season = 2031 WHERE id = 1').run();

    const ergebnisse = new WrappedService(db).getWrapped(2031).retirees[0]?.bestResults ?? [];
    const rundfahrt = ergebnisse.filter((r) => r.raceName === 'Grosse Rundfahrt');
    expect(rundfahrt.length).toBeGreaterThan(0);
    for (const eintrag of rundfahrt) {
      expect(eintrag.categoryId).toBe(2);
      expect(eintrag.categoryName).toBe('World Tour - Grand Tour');
    }
  });
});

describe('Eigenes Team', () => {
  it('vergleicht Punkte und Siege mit der Vorsaison', () => {
    legeRennen(50, 'Rennen', 2029, { rundfahrt: false });
    legeRennen(51, 'Rennen', 2030, { etappen: 3 });
    punkte(50, 2029, 'one_day_result', 1, 1, 1, { punkte: 100 });
    punkte(51, 2030, 'stage_result', 1, 1, 1, { etappe: 1, punkte: 100 });
    punkte(51, 2030, 'stage_result', 1, 1, 1, { etappe: 2, punkte: 300 });

    const team = new WrappedService(db).getWrapped(2030).playerTeam;
    expect(team?.teamId).toBe(1);
    expect(team?.wins).toBe(2);
    expect(team?.previousWins).toBe(1);
    expect(team?.points).toBe(400);
    expect(team?.previousPoints).toBe(100);
    expect(team?.biggestWin?.points).toBe(300);
    expect(team?.ridersWithWin).toBe(1);
  });
});

describe('Ewige Bestenliste im Rueckblick', () => {
  it('nimmt den Vorjahresplatz aus der vollen Liste, nicht nur aus der Spitze', () => {
    legeRennen(60, 'Klassiker', 2029, { rundfahrt: false });
    legeRennen(61, 'Klassiker', 2030, { rundfahrt: false });
    // Bis 2029: Dritter fuehrt die ewige Wertung an, Erster ist Zweiter,
    // Zweiter ist Dritter.
    punkte(60, 2029, 'one_day_result', 1, 3, 3, { etappe: 1, punkte: 500 });
    punkte(60, 2029, 'one_day_result', 2, 1, 1, { etappe: 1, punkte: 300 });
    punkte(60, 2029, 'one_day_result', 3, 2, 2, { etappe: 1, punkte: 100 });
    // 2030 zieht Erster vorbei und Zweiter an Dritter.
    punkte(61, 2030, 'one_day_result', 1, 1, 1, { etappe: 1, punkte: 400 });
    punkte(61, 2030, 'one_day_result', 2, 2, 2, { etappe: 1, punkte: 450 });

    const top = new WrappedService(db).getWrapped(2030).allTimeTop;
    expect(top.map((e) => [e.rider.riderId, e.points, e.previousRank ?? null])).toEqual([
      [1, 700, 2], // 300 + 400, vorher Platz 2
      [2, 550, 3], // 100 + 450, vorher Platz 3
      [3, 500, 1], // unveraendert — und trotzdem von Platz 1 auf 3 durchgereicht
    ]);
  });

  it('meldet einen Fahrer ohne Punkte in der Vorsaison als neu', () => {
    legeRennen(62, 'Klassiker', 2029, { rundfahrt: false });
    legeRennen(63, 'Klassiker', 2030, { rundfahrt: false });
    punkte(62, 2029, 'one_day_result', 1, 1, 1, { etappe: 1, punkte: 500 });
    // Zweiter punktet erstmals 2030.
    punkte(63, 2030, 'one_day_result', 1, 2, 2, { etappe: 1, punkte: 200 });

    const top = new WrappedService(db).getWrapped(2030).allTimeTop;
    expect(top.find((e) => e.rider.riderId === 2)?.previousRank ?? null).toBeNull();
    expect(top.find((e) => e.rider.riderId === 1)?.previousRank).toBe(1);
  });
});

describe('Abschiede der Saison', () => {
  /** Legt `anzahl` Fahrer an, die nach 2030 zuruecktreten; die ersten `mitPunkten` punkten. */
  function legeRuecktritte(anzahl: number, mitPunkten: number): number[] {
    legeRennen(70, 'Klassiker', 2030, { rundfahrt: false });
    const ids: number[] = [];
    for (let i = 0; i < anzahl; i += 1) {
      const id = 100 + i;
      seedRider(db, { id, lastName: `Abschied${i}`, activeTeamId: 1 });
      db.prepare('UPDATE riders SET retired_season = 2030 WHERE id = ?').run(id);
      // Absteigende Punkte, damit die Reihenfolge feststeht.
      if (i < mitPunkten) punkte(70, 2030, 'one_day_result', 1, id, 1, { etappe: i + 1, punkte: 1000 - i * 10 });
      ids.push(id);
    }
    return ids;
  }

  it('zeigt mehr als zehn, wenn mehr in den All-Time-Top-100 stehen', () => {
    const ids = legeRuecktritte(14, 12);

    const list = new WrappedService(db).getWrapped(2030).retirees;
    // Die zwoelf mit Punkten stehen alle in den Top 100 der ewigen Wertung;
    // die beiden ohne Punkte tauchen dort nicht auf und liegen hinter Platz 10.
    expect(list.map((r) => r.rider.riderId)).toEqual(ids.slice(0, 12));
  });

  it('zeigt mindestens zehn, auch wenn kaum jemand All-Time zaehlt', () => {
    const ids = legeRuecktritte(14, 3);

    const list = new WrappedService(db).getWrapped(2030).retirees;
    expect(list).toHaveLength(10);
    // Die drei mit Punkten zuerst, danach fuellen die punktlosen auf.
    expect(list.slice(0, 3).map((r) => r.rider.riderId)).toEqual(ids.slice(0, 3));
  });
});
