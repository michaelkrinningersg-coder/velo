import type Database from 'better-sqlite3';
import { CHAMPIONSHIP_CATEGORY_IDS } from '../../../shared/types';
import { computeStartlistQuality } from '../../../shared/startlistQuality';

/**
 * Schreibt die Qualitaet der Startliste eines Rennens - einmal, beim Start.
 *
 * Die Berechnung kann nicht nachgeholt werden: `active_race_entries` haelt
 * immer nur die laufende Saison, die Startliste einer vergangenen ist weg.
 * Deshalb wird der Wert festgeschrieben und beim Abruf nie neu gerechnet.
 *
 * Landesmeisterschaften und die uebrigen Meisterschaften bekommen keinen Wert:
 * dort ist das Feld nach Nationen zerlegt, der Anteil am staerkstmoeglichen
 * Feld waere systematisch niedrig und mit Rundfahrten nicht vergleichbar.
 */
export class StartlistQualityService {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  /**
   * Erfasst das Rennen, falls fuer diese Saison noch kein Wert steht.
   * Idempotent - mehrfacher Aufruf schreibt nichts nach.
   */
  public erfasseRennstart(raceId: number, season: number): void {
    const vorhanden = this.db.prepare(
      'SELECT 1 FROM race_startlist_quality WHERE race_id = ? AND season = ?',
    ).get(raceId, season);
    if (vorhanden) return;

    const rennen = this.db.prepare(
      'SELECT category_id AS categoryId, start_date AS startDate FROM races WHERE id = ?',
    ).get(raceId) as { categoryId: number | null; startDate: string } | undefined;
    if (!rennen) return;
    if (rennen.categoryId != null && CHAMPIONSHIP_CATEGORY_IDS.includes(rennen.categoryId)) return;

    // Karrierepunkte zum Startdatum: alles, was vor dem Rennen vergeben wurde.
    // Meisterschaften zaehlen auch hier nicht mit - sonst haette ein Fahrer mit
    // vielen Landestiteln eine Karrierewertung, die kein Rennen widerspiegelt.
    const meisterschaften = CHAMPIONSHIP_CATEGORY_IDS.join(',');
    const punkteJeFahrer = this.db.prepare(`
      SELECT rider_id AS riderId, SUM(points_awarded) AS punkte
      FROM season_point_events
      WHERE awarded_on < ?
        AND race_id NOT IN (SELECT id FROM races WHERE category_id IN (${meisterschaften}))
      GROUP BY rider_id
    `).all(rennen.startDate) as Array<{ riderId: number; punkte: number }>;

    const punkteMap = new Map(punkteJeFahrer.map((zeile) => [zeile.riderId, zeile.punkte]));

    const starter = this.db.prepare(
      'SELECT rider_id AS riderId FROM active_race_entries WHERE race_id = ?',
    ).all(raceId) as Array<{ riderId: number }>;
    if (starter.length === 0) return;

    // Das staerkstmoegliche Feld: alle aktiven Fahrer, aus denen die besten so
    // viele genommen werden, wie das Rennen Starter hat.
    const feld = this.db.prepare(
      'SELECT id FROM riders WHERE is_retired = 0',
    ).all() as Array<{ id: number }>;

    const ergebnis = computeStartlistQuality({
      starterPoints: starter.map((zeile) => punkteMap.get(zeile.riderId) ?? 0),
      fieldPoints: feld.map((zeile) => punkteMap.get(zeile.id) ?? 0),
    });

    this.db.prepare(`
      INSERT OR IGNORE INTO race_startlist_quality
        (race_id, season, score, raw_points, max_points, starters)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(raceId, season, ergebnis.score, ergebnis.rawPoints, ergebnis.maxPoints, ergebnis.starters);
  }

  /** Gespeicherte Werte eines Rennens, aelteste Saison zuerst. */
  public verlauf(raceId: number): Array<{
    season: number;
    score: number | null;
    rawPoints: number;
    maxPoints: number;
    starters: number;
  }> {
    return this.db.prepare(`
      SELECT season, score, raw_points AS rawPoints, max_points AS maxPoints, starters
      FROM race_startlist_quality
      WHERE race_id = ?
      ORDER BY season ASC
    `).all(raceId) as Array<{
      season: number; score: number | null; rawPoints: number; maxPoints: number; starters: number;
    }>;
  }
}
