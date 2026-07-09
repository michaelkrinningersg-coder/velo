import { describe, it, expect } from 'vitest';
import type Database from 'better-sqlite3';
import {
  createTestDb,
  seedReferenceData,
  seedTeams,
  seedRider,
  seedGameState,
} from '../__tests__/helpers/testDb';
import { GameStateService } from './GameStateService';
import { BadgeMaterializationService } from './BadgeMaterializationService';
import { resolveWinTrackerTier } from '../../../shared/hallOfFameBadges';

function columnExists(db: Database.Database, table: string, column: string): boolean {
  return (db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>)
    .some((c) => c.name === column);
}

describe('BadgeMaterializationService.rebuildAllRiderBadges', () => {
  it('materialises threshold and single/binary badges into rider_badges', () => {
    const db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 2, playerTeamId: 1 });
    // Lazy columns / game_state via the real service path.
    seedGameState(db, { date: '2030-06-01', season: 2030 });
    new GameStateService(db).ensureState();

    // Rider A: 30 Karrieresiege (Grand-Tour-GC) -> winTracker-Tier + WM-Straßentitel.
    const riderA = seedRider(db, { id: 101, lastName: 'Winner', activeTeamId: 1 });
    // Rider B: keinerlei Erfolge -> haelt kein Badge.
    const riderB = seedRider(db, { id: 102, lastName: 'Nobody', activeTeamId: 2 });

    const wins = 30;
    db.prepare(`
      INSERT INTO rider_career_category_stats (rider_id, category_name, gc_wins)
      VALUES (?, 'World Tour - Grand Tour', ?)
    `).run(riderA, wins);

    // rider_career_stats-Zeile mit WM-Straßentitel (Single-/Binaer-Badge).
    db.prepare('INSERT OR IGNORE INTO rider_career_stats (rider_id) VALUES (?)').run(riderA);
    const hasChampionCol = columnExists(db, 'rider_career_stats', 'world_champion_road_titles');
    if (hasChampionCol) {
      db.prepare('UPDATE rider_career_stats SET world_champion_road_titles = 1 WHERE rider_id = ?').run(riderA);
    }

    new BadgeMaterializationService(db).rebuildAllRiderBadges();

    const rowsA = db.prepare('SELECT badge_key, tier FROM rider_badges WHERE rider_id = ?')
      .all(riderA) as Array<{ badge_key: string; tier: string | null }>;
    const mapA = new Map(rowsA.map((r) => [r.badge_key, r.tier]));

    // Schwellen-Badge: winTracker mit dem korrekten Tier (30 Siege -> cyan).
    expect(mapA.has('winTracker')).toBe(true);
    expect(mapA.get('winTracker')).toBe(resolveWinTrackerTier(wins)); // 'cyan'
    expect(resolveWinTrackerTier(wins)).toBe('cyan');

    // Single-/Binaer-Badge: WM-Straßentitel -> tier === 'earned'.
    if (hasChampionCol) {
      expect(mapA.get('worldChampionRoad')).toBe('earned');
    }

    // grandTourWinner (Single-Badge) muss ebenfalls verdient sein.
    expect(mapA.get('grandTourWinner')).toBe('earned');

    // Jede materialisierte Zeile ist ein "gehaltenes" Badge (tier gesetzt).
    for (const r of rowsA) {
      expect(r.tier === null).toBe(false);
    }

    // Rider ohne Erfolge haelt kein einziges Badge.
    const countB = (db.prepare('SELECT COUNT(*) AS c FROM rider_badges WHERE rider_id = ?')
      .get(riderB) as { c: number }).c;
    expect(countB).toBe(0);

    db.close();
  });

  it('is idempotent: a second rebuild yields identical rows', () => {
    const db = createTestDb();
    seedReferenceData(db);
    seedTeams(db, { count: 1, playerTeamId: 1 });
    seedGameState(db, { date: '2030-06-01', season: 2030 });
    new GameStateService(db).ensureState();

    const rider = seedRider(db, { id: 201, lastName: 'Rebuild', activeTeamId: 1 });
    db.prepare(`
      INSERT INTO rider_career_category_stats (rider_id, category_name, stage_wins)
      VALUES (?, 'World Tour - Grand Tour', 12)
    `).run(rider);

    const svc = new BadgeMaterializationService(db);
    svc.rebuildAllRiderBadges();
    const first = (db.prepare('SELECT COUNT(*) AS c FROM rider_badges').get() as { c: number }).c;
    svc.rebuildAllRiderBadges();
    const second = (db.prepare('SELECT COUNT(*) AS c FROM rider_badges').get() as { c: number }).c;

    expect(first).toBeGreaterThan(0);
    expect(second).toBe(first);

    db.close();
  });
});
