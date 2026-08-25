import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import { ResultRepository } from './ResultRepository';
import {
  createTestDb,
  seedReferenceData,
  seedTeams,
  seedRider,
  seedGameState,
} from '../../__tests__/helpers/testDb';

function insertCountry(db: Database.Database, id: number, name: string, code: string, continent = 'Europe') {
  db.prepare(`INSERT OR IGNORE INTO sta_country
    (id, name, code_3, continent, regen_rating, number_regen_min, number_regen_max)
    VALUES (?, ?, ?, ?, 50, 1, 3)`).run(id, name, code, continent);
}

function insertChampTitle(db: Database.Database, season: number, type: string, disc: string, riderId: number, countryId: number) {
  db.prepare(`INSERT INTO championship_titles
    (season, championship_type, discipline, rider_id, country_id, race_id, stage_id, awarded_on)
    VALUES (?, ?, ?, ?, ?, 1, 1, ?)`).run(season, type, disc, riderId, countryId, `${season}-09-23`);
}

function insertNatTitle(db: Database.Database, season: number, disc: string, countryId: number, riderId: number) {
  db.prepare(`INSERT INTO national_champion_titles
    (season, discipline, country_id, rider_id, race_id, stage_id, awarded_on)
    VALUES (?, ?, ?, ?, 1, 1, ?)`).run(season, disc, countryId, riderId, `${season}-06-28`);
}

describe('Season-Standings Champion-Uebersichten', () => {
  let db: Database.Database;
  let repo: ResultRepository;

  beforeEach(() => {
    db = createTestDb();
    seedReferenceData(db); // Land 1 (GER)
    seedTeams(db, { count: 1, playerTeamId: 1 });
    insertCountry(db, 2, 'Frankreich', 'FRA');
    seedGameState(db, { date: '2032-10-01', season: 2032 });
  });

  afterEach(() => db.close());

  it('reigningTitles: je Typ+Disziplin die juengste Edition bis zur Saison', () => {
    const a = seedRider(db, { countryId: 1, activeTeamId: 1 });
    const b = seedRider(db, { countryId: 2, activeTeamId: 1 });
    // WM Strasse: 2028 (a) und 2032 (b) -> reigning 2032 = b
    insertChampTitle(db, 2028, 'WM', 'ROAD', a, 1);
    insertChampTitle(db, 2032, 'WM', 'ROAD', b, 2);
    // Olympia 2028 (a), U23-WM ITT 2030 (a)
    insertChampTitle(db, 2028, 'OLY', 'ROAD', a, 1);
    insertChampTitle(db, 2030, 'WM_U23', 'ITT', a, 1);

    repo = new ResultRepository(db);
    const titles = repo.getSeasonStandings(2032).reigningTitles ?? [];

    const wmRoad = titles.find((t) => t.type === 'WM' && t.discipline === 'ROAD');
    expect(wmRoad?.holder.riderId).toBe(b);
    expect(wmRoad?.holder.season).toBe(2032);
    expect(titles.find((t) => t.type === 'OLY' && t.discipline === 'ROAD')?.holder.riderId).toBe(a);
    expect(titles.find((t) => t.type === 'WM_U23' && t.discipline === 'ITT')?.holder.riderId).toBe(a);
  });

  it('reigningTitles: Stand einer frueheren Saison ignoriert spaetere Titel', () => {
    const a = seedRider(db, { countryId: 1, activeTeamId: 1 });
    const b = seedRider(db, { countryId: 2, activeTeamId: 1 });
    insertChampTitle(db, 2028, 'WM', 'ROAD', a, 1);
    insertChampTitle(db, 2032, 'WM', 'ROAD', b, 2);

    repo = new ResultRepository(db);
    const titles2030 = repo.getSeasonStandings(2030).reigningTitles ?? [];
    expect(titles2030.find((t) => t.type === 'WM' && t.discipline === 'ROAD')?.holder.riderId).toBe(a);
  });

  it('nationalChampions: gruppiert Strasse+ITT je Land, reigning pro Land', () => {
    const g1 = seedRider(db, { countryId: 1, activeTeamId: 1 });
    const g2 = seedRider(db, { countryId: 1, activeTeamId: 1 });
    const f1 = seedRider(db, { countryId: 2, activeTeamId: 1 });
    insertNatTitle(db, 2030, 'ROAD', 1, g1);
    insertNatTitle(db, 2032, 'ROAD', 1, g2); // reigning Strasse GER = g2 (2032)
    insertNatTitle(db, 2031, 'ITT', 1, g1);
    insertNatTitle(db, 2032, 'ROAD', 2, f1);

    repo = new ResultRepository(db);
    const groups = repo.getSeasonStandings(2032).nationalChampions ?? [];
    const ger = groups.find((x) => x.countryCode === 'GER');
    expect(ger?.road?.riderId).toBe(g2);
    expect(ger?.itt?.riderId).toBe(g1);
    const fra = groups.find((x) => x.countryCode === 'FRA');
    expect(fra?.road?.riderId).toBe(f1);
    expect(fra?.itt).toBeNull();
  });
});
