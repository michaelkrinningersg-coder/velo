import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import {
  championshipAgeBounds,
  championshipAllowsTeamless,
  championshipContinents,
  championshipRestrictsToEurope,
  championshipTitleColumn,
  getChampionshipCategoryDef,
  isChampionshipCategory,
  isOlympicSeason,
  CONTINENTAL_MAX_RIDERS_PER_COUNTRY,
  NATIONAL_SELECTION_TEAM_ID,
} from './championships';
import { isChampionshipCategory as sharedIsChampionshipCategory } from '../../../shared/types';
import { buildChampionshipRoster } from './RaceRosterService';
import {
  createTestDb,
  seedReferenceData,
  seedTeams,
  seedRider,
} from '../__tests__/helpers/testDb';

describe('championship age-class helpers', () => {
  it('liefert die korrekten Altersgrenzen je Klasse', () => {
    expect(championshipAgeBounds('ELITE')).toEqual({ minAge: 23, maxAge: null });
    expect(championshipAgeBounds('U23')).toEqual({ minAge: 20, maxAge: 22 });
    expect(championshipAgeBounds('JUNIOR')).toEqual({ minAge: null, maxAge: 19 });
    expect(championshipAgeBounds('OPEN')).toEqual({ minAge: null, maxAge: null });
  });

  it('erlaubt teamlose Fahrer nur bei U23/Junioren', () => {
    expect(championshipAllowsTeamless('U23')).toBe(true);
    expect(championshipAllowsTeamless('JUNIOR')).toBe(true);
    expect(championshipAllowsTeamless('ELITE')).toBe(false);
    expect(championshipAllowsTeamless('OPEN')).toBe(false);
  });

  it('beschraenkt nur die EM auf Europa', () => {
    expect(championshipRestrictsToEurope('EM')).toBe(true);
    expect(championshipRestrictsToEurope('WM')).toBe(false);
    expect(championshipRestrictsToEurope('OLY')).toBe(false);
  });

  it('mappt jeden Titeltyp+Disziplin auf eine Karriere-Zaehlspalte', () => {
    expect(championshipTitleColumn('WM', 'ROAD')).toBe('world_champion_road_titles');
    expect(championshipTitleColumn('EM', 'ITT')).toBe('euro_champion_itt_titles');
    expect(championshipTitleColumn('WM_U23', 'ROAD')).toBe('world_u23_champion_road_titles');
    expect(championshipTitleColumn('EM_U23', 'ITT')).toBe('euro_u23_champion_itt_titles');
    expect(championshipTitleColumn('WM_JUN', 'ROAD')).toBe('world_junior_champion_road_titles');
    expect(championshipTitleColumn('EM_JUN', 'ITT')).toBe('euro_junior_champion_itt_titles');
    expect(championshipTitleColumn('OLY', 'ROAD')).toBe('olympic_champion_road_titles');
    expect(championshipTitleColumn('OLY', 'ITT')).toBe('olympic_champion_itt_titles');
    // Kontinentale Meisterschaften.
    expect(championshipTitleColumn('CM_AO', 'ROAD')).toBe('cont_ao_champion_road_titles');
    expect(championshipTitleColumn('CM_AM', 'ITT')).toBe('cont_am_champion_itt_titles');
    expect(championshipTitleColumn('CM_AF_U23', 'ROAD')).toBe('cont_af_u23_champion_road_titles');
    expect(championshipTitleColumn('CM_AO_JUN', 'ITT')).toBe('cont_ao_junior_champion_itt_titles');
  });

  it('liefert den Kontinent-Filter je Kategorie', () => {
    // EM => Europa; WM/Olympia offen; kontinentale Meisterschaften eigene Liste.
    expect(championshipContinents(getChampionshipCategoryDef(12)!)).toEqual(['Europe']);
    expect(championshipContinents(getChampionshipCategoryDef(10)!)).toBeNull();
    expect(championshipContinents(getChampionshipCategoryDef(28)!)).toEqual(['Asia', 'Oceania']);
    expect(championshipContinents(getChampionshipCategoryDef(34)!)).toEqual(['North America', 'South America']);
    expect(championshipContinents(getChampionshipCategoryDef(40)!)).toEqual(['Africa']);
    // Flache Kadergrenze nur bei kontinentalen Meisterschaften.
    expect(getChampionshipCategoryDef(28)!.maxRidersPerCountry).toBe(CONTINENTAL_MAX_RIDERS_PER_COUNTRY);
    expect(getChampionshipCategoryDef(10)!.maxRidersPerCountry).toBeUndefined();
  });

  it('erkennt alle Meisterschaftskategorien inkl. Olympia und Kontinental', () => {
    for (const id of [10, 11, 12, 13, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]) {
      expect(isChampionshipCategory(id)).toBe(true);
      expect(sharedIsChampionshipCategory(id)).toBe(true);
      expect(getChampionshipCategoryDef(id)).toBeTruthy();
    }
    // Kontinentale Kategorien 28-45.
    for (let id = 28; id <= 45; id++) {
      expect(isChampionshipCategory(id)).toBe(true);
      expect(sharedIsChampionshipCategory(id)).toBe(true);
      expect(getChampionshipCategoryDef(id)).toBeTruthy();
    }
    expect(isChampionshipCategory(14)).toBe(false); // National
    expect(isChampionshipCategory(26)).toBe(false); // WT-Bonus-Override
    expect(isChampionshipCategory(99)).toBe(false);
  });

  it('markiert nur durch 4 teilbare Saisons als Olympia-Jahre', () => {
    expect(isOlympicSeason(2028)).toBe(true);
    expect(isOlympicSeason(2032)).toBe(true);
    expect(isOlympicSeason(2026)).toBe(false);
    expect(isOlympicSeason(2027)).toBe(false);
    expect(isOlympicSeason(2029)).toBe(false);
  });

  it('hat fuer jede Kategorie-Def eine nicht-leere Punktetabelle', () => {
    for (const id of [16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
      28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]) {
      const def = getChampionshipCategoryDef(id)!;
      const points = def.pointsOneDay.split('|').map(Number);
      expect(points.length).toBeGreaterThan(0);
      expect(points.every((p) => Number.isFinite(p) && p > 0)).toBe(true);
      // Absteigend sortiert (Platz 1 hoechster Wert).
      for (let i = 1; i < points.length; i++) {
        expect(points[i]).toBeLessThanOrEqual(points[i - 1]);
      }
    }
  });
});

describe('buildChampionshipRoster age filtering & teamless', () => {
  let db: Database.Database;
  const SEASON = 2030;

  interface TestRider {
    id: number;
    countryId: number;
    activeTeamId: number | null;
    birthYear: number;
    seasonFormPhase: string;
    overallRating: number;
    skills: { timeTrial: number };
  }
  let riders: TestRider[];

  function makeRepo() {
    return {
      getCurrentSeason: () => SEASON,
      getRiders: () => riders,
    } as any;
  }

  beforeEach(() => {
    db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 1, playerTeamId: 1 });

    // DB-Fahrer + In-Memory-Fahrer mit denselben IDs (Nationenwertung liest die
    // DB, der Roster liest repo.getRiders()).
    const specs = [
      { birthYear: 2005, team: 1 as number | null }, // Elite, 25
      { birthYear: 2009, team: 1 as number | null }, // U23, 21
      { birthYear: 2012, team: 1 as number | null }, // Junior, 18
      { birthYear: 2009, team: null as number | null }, // teamlos U23, 21
      { birthYear: 2005, team: null as number | null }, // teamlos Elite, 25
    ];
    riders = [];
    for (const s of specs) {
      const id = seedRider(db, { birthYear: s.birthYear, activeTeamId: s.team, countryId: 1, overallRating: 70 });
      riders.push({
        id,
        countryId: 1,
        activeTeamId: s.team,
        birthYear: s.birthYear,
        seasonFormPhase: 'neutral',
        overallRating: 70,
        skills: { timeTrial: 70 },
      });
    }

    // Nationenwertung: Land 1 braucht Punkte > 0. Ein Race/Stage + ein
    // season_point_event genuegen.
    db.prepare(`INSERT INTO races (id, name, country_id, category_id, is_stage_race, number_of_stages, start_date, end_date, prestige)
      VALUES (1, 'R', 1, 1, 0, 1, '2030-01-01', '2030-01-01', 10)`).run();
    db.prepare(`INSERT INTO stages (id, race_id, stage_number, date, profile, start_elevation, details_csv_file)
      VALUES (1, 1, 1, '2030-01-01', 'Flat', 0, 'x.csv')`).run();
    db.prepare(`INSERT INTO season_point_events (season, race_id, stage_id, rider_id, team_id, award_type, rank, points_awarded, awarded_on)
      VALUES (?, 1, 1, ?, 1, 'one_day_result', 1, 100, '2030-01-01')`).run(SEASON, riders[0].id);
  });

  afterEach(() => db.close());

  it('Elite-WM (>=23): nur Fahrer mit Team ab 23', () => {
    const selected = buildChampionshipRoster(db, makeRepo(), { categoryId: 10 } as any, {} as any);
    const ids = selected.map((r) => r.id).sort();
    expect(ids).toEqual([riders[0].id]); // nur Elite mit Team; teamloser Elite raus
  });

  it('WM U23 (20-22): U23-Fahrer inkl. teamlos, ohne Elite/Junior', () => {
    const selected = buildChampionshipRoster(db, makeRepo(), { categoryId: 16 } as any, {} as any);
    const ids = selected.map((r) => r.id).sort((a, b) => a - b);
    expect(ids).toEqual([riders[1].id, riders[3].id].sort((a, b) => a - b));
  });

  it('WM Junioren (<=19): nur der 18-Jaehrige', () => {
    const selected = buildChampionshipRoster(db, makeRepo(), { categoryId: 18 } as any, {} as any);
    expect(selected.map((r) => r.id)).toEqual([riders[2].id]);
  });

  it('reserviert eine hohe, kollisionsfreie Pseudo-Team-ID', () => {
    expect(NATIONAL_SELECTION_TEAM_ID).toBeGreaterThan(1000);
  });
});
