import { describe, expect, it, beforeEach } from 'vitest';
import type Database from 'better-sqlite3';
import { createTestDb, seedReferenceData, seedTeams, seedRider } from './helpers/testDb';
import { ResultRepository } from '../db/repositories/ResultRepository';
import { StartlistQualityService } from '../game/StartlistQualityService';

/**
 * Bestenlisten und Startlisten-Qualitaet der Rennkarte.
 *
 * Renn-IDs werden je Saison neu vergeben — jede Aggregation muss deshalb ueber
 * den Rennnamen laufen, sonst zeigt die Karte nur die laufende Austragung.
 */

const KAT_NORMAL = 1;
const KAT_LANDESMEISTERSCHAFT = 28;

let db: Database.Database;

function legeRennen(id: number, name: string, saison: number, opts: {
  etappen?: number; kategorie?: number; rundfahrt?: boolean; profile?: string[];
} = {}): void {
  const etappen = opts.etappen ?? 1;
  db.prepare(`
    INSERT INTO races (id, name, country_id, category_id, is_stage_race, number_of_stages,
      start_date, end_date, prestige)
    VALUES (?, ?, 1, ?, ?, ?, ?, ?, 80)
  `).run(id, name, opts.kategorie ?? KAT_NORMAL, opts.rundfahrt === false ? 0 : 1,
    etappen, `${saison}-07-01`, `${saison}-07-${String(etappen).padStart(2, '0')}`);
  for (let i = 1; i <= etappen; i++) {
    db.prepare(`
      INSERT INTO stages (id, race_id, stage_number, date, profile, start_elevation, details_csv_file)
      VALUES (?, ?, ?, ?, ?, 100, 'x.csv')
    `).run(id * 1000 + i, id, i, `${saison}-07-${String(i).padStart(2, '0')}`,
      opts.profile?.[i - 1] ?? 'Flat');
  }
}

/**
 * Ein Punkteereignis. `etappe` waehlt die Etappe — season_point_events laesst je
 * Etappe, Fahrer und Wertungsart genau eine Zeile zu, mehrere Etappensiege
 * desselben Fahrers brauchen also verschiedene Etappen.
 */
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
  db.prepare(`INSERT OR IGNORE INTO sta_country
    (id, name, code_3, continent, regen_rating, number_regen_min, number_regen_max, program_group_id)
    VALUES (2, 'Belgien', 'BEL', 'Europe', 80, 2, 5, 1)`).run();
  seedTeams(db, { count: 3, playerTeamId: 1 });
  seedRider(db, { id: 1, lastName: 'Erster', countryId: 1 });
  seedRider(db, { id: 2, lastName: 'Zweiter', countryId: 2 });
  seedRider(db, { id: 3, lastName: 'Dritter', countryId: 1 });
});

describe('Bestenlisten der Rennkarte', () => {
  it('aggregiert Gesamt- und Etappensiege ueber alle Austragungen desselben Rennens', () => {
    legeRennen(10, 'Tour', 2026, { etappen: 3, profile: ['Flat', 'Mountain', 'ITT'] });
    legeRennen(11, 'Tour', 2027, { etappen: 3, profile: ['Flat', 'Flat', 'Mountain'] });

    // 2026: Fahrer 1 gewinnt gesamt, Fahrer 2 wird Zweiter; zwei Etappen an Fahrer 1.
    punkte(10, 2026, 'gc_final', 1, 1, 1);
    punkte(10, 2026, 'gc_final', 2, 2, 2);
    punkte(10, 2026, 'gc_final', 3, 3, 3);
    punkte(10, 2026, 'stage_result', 1, 1, 1, { etappe: 1 });
    punkte(10, 2026, 'stage_result', 1, 1, 1, { etappe: 2 });
    punkte(10, 2026, 'stage_result', 2, 2, 2, { etappe: 2 });
    // 2027: Fahrer 1 gewinnt erneut, Fahrer 3 wird Zweiter.
    punkte(11, 2027, 'gc_final', 1, 1, 1);
    punkte(11, 2027, 'gc_final', 2, 3, 3);
    punkte(11, 2027, 'stage_result', 1, 2, 2, { etappe: 1 });

    const rekorde = new ResultRepository(db).getRacePalmares(11).records;

    expect(rekorde.editions).toBe(2);
    expect(rekorde.overallWins[0]?.rider.riderId).toBe(1);
    expect(rekorde.overallWins[0]?.wins).toBe(2);
    expect(rekorde.overallWins[0]?.seasons).toEqual([2027, 2026]);
    // Zweite und dritte Plaetze zaehlen mit, machen aber keinen Sieger.
    expect(rekorde.overallWins.find((z) => z.rider.riderId === 2)).toBeUndefined();
    expect(rekorde.stageWins[0]).toMatchObject({ wins: 2 });
    expect(rekorde.stageWins[0]?.rider.riderId).toBe(1);
  });

  it('liefert Etappensieger weit ueber die ersten zehn hinaus', () => {
    // Die Oberflaeche blaettert zu zehnt — die Liste muss dafuer tiefer reichen.
    legeRennen(10, 'Tour', 2026, { etappen: 12 });
    for (let i = 1; i <= 12; i++) {
      seedRider(db, { id: 100 + i, lastName: `Sieger${i}` });
      punkte(10, 2026, 'stage_result', 1, 100 + i, 1, { etappe: i });
    }
    const r = new ResultRepository(db).getRacePalmares(10).records;
    expect(r.stageWins).toHaveLength(12);
  });

  it('zaehlt zweite und dritte Plaetze beim Gesamtsieger mit', () => {
    legeRennen(10, 'Tour', 2026, { etappen: 1 });
    legeRennen(11, 'Tour', 2027, { etappen: 1 });
    legeRennen(12, 'Tour', 2028, { etappen: 1 });
    punkte(10, 2026, 'gc_final', 1, 1, 1);
    punkte(11, 2027, 'gc_final', 2, 1, 1);
    punkte(12, 2028, 'gc_final', 3, 1, 1);

    const zeile = new ResultRepository(db).getRacePalmares(12).records.overallWins[0];
    expect(zeile).toMatchObject({ wins: 1, seconds: 1, thirds: 1 });
  });

  it('fuehrt Berg-, Nachwuchs- und Punktetrikot getrennt', () => {
    legeRennen(10, 'Tour', 2026, { etappen: 1 });
    punkte(10, 2026, 'gc_final', 1, 1, 1);
    punkte(10, 2026, 'mountain_final', 1, 2, 2);
    punkte(10, 2026, 'youth_final', 1, 3, 3);
    punkte(10, 2026, 'points_final', 1, 2, 2);

    const r = new ResultRepository(db).getRacePalmares(10).records;
    expect(r.mountainWins.map((z) => z.rider.riderId)).toEqual([2]);
    expect(r.youthWins.map((z) => z.rider.riderId)).toEqual([3]);
    expect(r.pointsWins.map((z) => z.rider.riderId)).toEqual([2]);
  });

  it('bilanziert Nationen und Teams ueber die Podestplaetze', () => {
    legeRennen(10, 'Tour', 2026, { etappen: 1 });
    punkte(10, 2026, 'gc_final', 1, 1, 1); // GER, Team 1
    punkte(10, 2026, 'gc_final', 2, 2, 2); // BEL, Team 2
    punkte(10, 2026, 'gc_final', 3, 3, 1); // GER, Team 1

    const r = new ResultRepository(db).getRacePalmares(10).records;
    expect(r.nations[0]).toMatchObject({ countryCode: 'GER', wins: 1, podiums: 2 });
    expect(r.nations[1]).toMatchObject({ countryCode: 'BEL', wins: 0, podiums: 1 });
    expect(r.teams[0]).toMatchObject({ teamId: 1, wins: 1, podiums: 2 });
  });

  it('nimmt die Profilverteilung der aufgerufenen Austragung, nicht der alten', () => {
    legeRennen(10, 'Tour', 2026, { etappen: 3, profile: ['Flat', 'Flat', 'Flat'] });
    legeRennen(11, 'Tour', 2027, { etappen: 3, profile: ['Mountain', 'Mountain', 'ITT'] });

    const r = new ResultRepository(db).getRacePalmares(11).records;
    expect(r.stageCount).toBe(3);
    expect(r.profiles).toEqual([{ profile: 'Mountain', stages: 2 }, { profile: 'ITT', stages: 1 }]);
  });

  it('laesst Etappensiege bei Eintagesrennen leer und wertet den Tagessieg', () => {
    legeRennen(20, 'Klassiker', 2026, { etappen: 1, rundfahrt: false });
    punkte(20, 2026, 'one_day_result', 1, 2, 2);
    punkte(20, 2026, 'one_day_result', 2, 1, 1);

    const r = new ResultRepository(db).getRacePalmares(20).records;
    expect(r.stageWins).toEqual([]);
    expect(r.overallWins[0]?.rider.riderId).toBe(2);
    expect(r.overallWins[0]?.wins).toBe(1);
  });
});

describe('Startlisten-Qualitaet', () => {
  function starte(raceId: number, riderIds: number[]): void {
    for (const id of riderIds) {
      db.prepare('INSERT INTO active_race_entries (race_id, rider_id, team_id) VALUES (?, ?, ?)')
        .run(raceId, id, 1);
    }
  }

  it('schreibt den Wert einmal und aendert ihn danach nicht mehr', () => {
    legeRennen(10, 'Tour', 2027, { etappen: 1 });
    // Karrierepunkte aus einer frueheren Saison.
    legeRennen(9, 'Vorjahr', 2026, { etappen: 1 });
    punkte(9, 2026, 'gc_final', 1, 1, 1, { punkte: 500, tag: '2026-07-01' });
    punkte(9, 2026, 'gc_final', 2, 2, 2, { punkte: 300, tag: '2026-07-01' });
    punkte(9, 2026, 'gc_final', 3, 3, 3, { punkte: 200, tag: '2026-07-01' });
    starte(10, [1, 2]);

    const dienst = new StartlistQualityService(db);
    dienst.erfasseRennstart(10, 2027);

    const zeile = db.prepare('SELECT * FROM race_startlist_quality WHERE race_id = 10').get() as any;
    // 800 von 800 (die beiden Besten sind am Start) -> 100.
    expect(zeile.score).toBe(100);
    expect(zeile.starters).toBe(2);

    // Zweiter Aufruf mit veraenderter Startliste schreibt nichts nach.
    starte(10, [3]);
    dienst.erfasseRennstart(10, 2027);
    expect((db.prepare('SELECT COUNT(*) n FROM race_startlist_quality').get() as any).n).toBe(1);
    expect((db.prepare('SELECT starters FROM race_startlist_quality WHERE race_id = 10').get() as any).starters).toBe(2);
  });

  it('misst gegen die Starterzahl, nicht gegen das ganze Feld', () => {
    legeRennen(9, 'Vorjahr', 2026, { etappen: 1 });
    legeRennen(10, 'Tour', 2027, { etappen: 1 });
    punkte(9, 2026, 'gc_final', 1, 1, 1, { punkte: 500, tag: '2026-07-01' });
    punkte(9, 2026, 'gc_final', 2, 2, 2, { punkte: 100, tag: '2026-07-01' });
    starte(10, [2]); // nur der Schwaechere startet

    new StartlistQualityService(db).erfasseRennstart(10, 2027);
    const zeile = db.prepare('SELECT * FROM race_startlist_quality WHERE race_id = 10').get() as any;
    expect(zeile.max_points).toBe(500);
    expect(zeile.score).toBe(20);
  });

  it('misst gegen das Feld der Saison, nicht gegen die heute aktiven Fahrer', () => {
    legeRennen(9, 'Vorjahr', 2026, { etappen: 1 });
    legeRennen(10, 'Tour', 2027, { etappen: 1 });
    punkte(9, 2026, 'gc_final', 1, 1, 1, { punkte: 500, tag: '2026-07-01' });
    punkte(9, 2026, 'gc_final', 2, 2, 2, { punkte: 300, tag: '2026-07-01' });
    // Fahrer 2 ist inzwischen zurueckgetreten — er stand 2027 aber unter
    // Vertrag und gehoert damit ins Feld dieser Saison.
    db.prepare('UPDATE riders SET is_retired = 1 WHERE id = 2').run();
    for (const id of [1, 2, 3]) {
      db.prepare(`INSERT INTO contracts (rider_id, team_id, start_season, end_season, status)
        VALUES (?, 1, 2027, 2027, 'active')`).run(id);
    }
    starte(10, [1]);

    new StartlistQualityService(db).erfasseRennstart(10, 2027);
    const zeile = db.prepare('SELECT * FROM race_startlist_quality WHERE race_id = 10').get() as any;
    // Bester des Feldes ist Fahrer 1 mit 500 — er startet, also 100.
    expect(zeile.max_points).toBe(500);
    expect(zeile.score).toBe(100);
  });

  it('traegt fehlende Werte aus archivierten Startlisten nach', () => {
    legeRennen(9, 'Vorjahr', 2026, { etappen: 1 });
    legeRennen(10, 'Tour', 2027, { etappen: 1 });
    punkte(9, 2026, 'gc_final', 1, 1, 1, { punkte: 500, tag: '2026-07-01' });
    punkte(9, 2026, 'gc_final', 2, 2, 2, { punkte: 100, tag: '2026-07-01' });
    punkte(10, 2027, 'gc_final', 1, 2, 2, { tag: '2027-07-01' });
    // Die laufende Startliste ist weg, das Archiv haelt sie: [team, fahrer].
    db.prepare("INSERT INTO race_entries_compact (race_id, season, payload) VALUES (10, 2027, '[[2,2]]')").run();

    const dienst = new StartlistQualityService(db);
    expect(dienst.nachtragen()).toBe(1);
    const zeile = db.prepare('SELECT * FROM race_startlist_quality WHERE race_id = 10').get() as any;
    expect(zeile.starters).toBe(1);
    expect(zeile.raw_points).toBe(100);   // Fahrer 2 hatte 100 vor dem Start
    expect(zeile.max_points).toBe(500);   // bester des Feldes: Fahrer 1
    expect(zeile.score).toBe(20);
    // Zweiter Lauf findet nichts mehr.
    expect(dienst.nachtragen()).toBe(0);
  });

  it('traegt fuer Meisterschaften nichts nach', () => {
    legeRennen(30, 'Meisterschaft', 2027, { etappen: 1, kategorie: KAT_LANDESMEISTERSCHAFT });
    punkte(30, 2027, 'one_day_result', 1, 1, 1);
    db.prepare("INSERT INTO race_entries_compact (race_id, season, payload) VALUES (30, 2027, '[[1,1]]')").run();
    expect(new StartlistQualityService(db).nachtragen()).toBe(0);
  });

  it('erfasst Landesmeisterschaften nicht', () => {
    legeRennen(30, 'Meisterschaft', 2027, { etappen: 1, kategorie: KAT_LANDESMEISTERSCHAFT });
    starte(30, [1, 2]);
    new StartlistQualityService(db).erfasseRennstart(30, 2027);
    expect((db.prepare('SELECT COUNT(*) n FROM race_startlist_quality').get() as any).n).toBe(0);
  });

  it('liefert die gespeicherte Reihe ueber alle Austragungen des Rennens', () => {
    legeRennen(10, 'Tour', 2026, { etappen: 1 });
    legeRennen(11, 'Tour', 2027, { etappen: 1 });
    db.prepare(`INSERT INTO race_startlist_quality (race_id, season, score, raw_points, max_points, starters)
      VALUES (11, 2027, 61.5, 615, 1000, 150), (10, 2026, 44.0, 440, 1000, 150)`).run();

    const reihe = new ResultRepository(db).getRacePalmares(11).records.startlistQuality;
    expect(reihe.map((z) => z.season)).toEqual([2026, 2027]);
    expect(reihe[1]).toMatchObject({ score: 61.5, starters: 150 });
  });
});
