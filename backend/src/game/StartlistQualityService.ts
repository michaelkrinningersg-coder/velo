import type Database from 'better-sqlite3';
import { CHAMPIONSHIP_CATEGORY_IDS } from '../../../shared/types';
import { computeStartlistQuality } from '../../../shared/startlistQuality';
import { tableExists } from '../db/mappers';

/**
 * Schreibt die Qualitaet der Startliste eines Rennens fest.
 *
 * Der Wert wird beim Start des Rennens erfasst und danach nur noch gelesen —
 * nie beim Abruf neu gerechnet. Die Startlisten vergangener Saisons bleiben in
 * `race_entries_compact` erhalten (Sicht `race_entries`), fehlende Werte lassen
 * sich deshalb einmalig nachtragen.
 *
 * Landesmeisterschaften und die uebrigen Meisterschaften bekommen keinen Wert:
 * dort ist das Feld nach Nationen zerlegt, der Anteil am staerkstmoeglichen
 * Feld waere systematisch niedrig und mit anderen Rennen nicht vergleichbar.
 */
/**
 * Karrierepunkte je Stichtag, ueber Aufrufe hinweg.
 *
 * Der Dienst wird bei jedem Etappen-Commit neu gebaut, ein Feld auf der Instanz
 * traegt also nichts. Die Summe ueber alle Punkteereignisse kostete auf einem
 * Spielstand von 2033 gut 28 ms und lief in zwei gemessenen Monaten 78-mal —
 * einmal je Rennstart, obwohl alle Rennen desselben Tages denselben Wert
 * brauchen. Der Puffer haelt genau einen Stichtag: Ereignisse werden nur mit
 * dem laufenden Datum angehaengt, ein einmal berechneter Stichtag aendert sich
 * also nicht mehr. Ein spaeterer Stichtag derselben Saison wird fortgeschrieben
 * (siehe karrierepunkteVor), ein Saisonwechsel rechnet neu.
 */
const punktePuffer = new WeakMap<Database.Database, { stichtag: string; werte: Map<number, number> }>();

export class StartlistQualityService {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  /**
   * Erfasst das Rennen, falls fuer diese Saison noch kein Wert steht.
   * Idempotent — mehrfacher Aufruf schreibt nichts nach.
   *
   * @returns true, wenn eine Zeile geschrieben wurde.
   */
  public erfasseRennstart(raceId: number, season: number, punkteMapVorgabe?: Map<number, number>): boolean {
    if (!tableExists(this.db, 'race_startlist_quality')) return false;

    const vorhanden = this.db.prepare(
      'SELECT 1 FROM race_startlist_quality WHERE race_id = ? AND season = ?',
    ).get(raceId, season);
    if (vorhanden) return false;

    const rennen = this.db.prepare(
      'SELECT category_id AS categoryId, start_date AS startDate FROM races WHERE id = ?',
    ).get(raceId) as { categoryId: number | null; startDate: string } | undefined;
    if (!rennen) return false;
    if (rennen.categoryId != null && CHAMPIONSHIP_CATEGORY_IDS.includes(rennen.categoryId)) return false;

    const starter = this.starterIds(raceId);
    if (starter.length === 0) return false;

    const punkteMap = punkteMapVorgabe ?? this.karrierepunkteVor(rennen.startDate);
    const feld = this.feldDerSaison(season);
    if (feld.length === 0) return false;

    const ergebnis = computeStartlistQuality({
      starterPoints: starter.map((id) => punkteMap.get(id) ?? 0),
      fieldPoints: feld.map((id) => punkteMap.get(id) ?? 0),
    });

    this.db.prepare(`
      INSERT OR IGNORE INTO race_startlist_quality
        (race_id, season, score, raw_points, max_points, starters)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(raceId, season, ergebnis.score, ergebnis.rawPoints, ergebnis.maxPoints, ergebnis.starters);
    return true;
  }

  /**
   * Traegt fehlende Werte fuer bereits gefahrene Rennen nach — einmalig beim
   * Laden eines Spielstands, der die Kennzahl noch nicht kannte. Rennen mit
   * bereits gespeichertem Wert werden uebersprungen, der Lauf ist damit
   * idempotent und nach dem ersten Mal praktisch kostenlos.
   *
   * @returns Anzahl neu geschriebener Zeilen.
   */
  public nachtragen(): number {
    if (!tableExists(this.db, 'race_startlist_quality')) return 0;

    const meisterschaften = CHAMPIONSHIP_CATEGORY_IDS.join(',');
    const offen = this.db.prepare(`
      SELECT r.id AS raceId, r.start_date AS startDate,
             CAST(substr(r.start_date, 1, 4) AS INTEGER) AS season
      FROM races r
      WHERE r.category_id NOT IN (${meisterschaften})
        AND NOT EXISTS (SELECT 1 FROM race_startlist_quality q WHERE q.race_id = r.id)
        AND EXISTS (SELECT 1 FROM season_point_events e WHERE e.race_id = r.id)
      ORDER BY r.start_date ASC
    `).all() as Array<{ raceId: number; startDate: string; season: number }>;
    if (offen.length === 0) return 0;

    // Die Karrierepunkte einmal je Rennen zu aggregieren waere ein voller Scan
    // pro Rennen. Stattdessen laufen die Ereignisse nach Datum sortiert einmal
    // durch und der Punktestand waechst mit — die Rennen sind ebenso sortiert.
    const ereignisse = this.db.prepare(`
      SELECT rider_id AS riderId, points_awarded AS punkte, awarded_on AS tag
      FROM season_point_events
      WHERE race_id NOT IN (SELECT id FROM races WHERE category_id IN (${meisterschaften}))
      ORDER BY awarded_on ASC
    `).all() as Array<{ riderId: number; punkte: number; tag: string }>;

    const stand = new Map<number, number>();
    let gelesen = 0;
    let geschrieben = 0;

    const lauf = this.db.transaction(() => {
      for (const zeile of offen) {
        while (gelesen < ereignisse.length && ereignisse[gelesen]!.tag < zeile.startDate) {
          const e = ereignisse[gelesen]!;
          stand.set(e.riderId, (stand.get(e.riderId) ?? 0) + e.punkte);
          gelesen += 1;
        }
        if (this.erfasseRennstart(zeile.raceId, zeile.season, stand)) geschrieben += 1;
      }
    });
    lauf();
    return geschrieben;
  }

  /**
   * Startliste des Rennens. Die Sicht `race_entries` deckt laufende und
   * archivierte Rennen ab; ohne sie bleibt nur die laufende Saison.
   */
  private starterIds(raceId: number): number[] {
    const quelle = tableExists(this.db, 'race_entries') ? 'race_entries' : 'active_race_entries';
    const zeilen = this.db.prepare(
      `SELECT DISTINCT rider_id AS riderId FROM ${quelle} WHERE race_id = ?`,
    ).all(raceId) as Array<{ riderId: number }>;
    return zeilen.map((z) => z.riderId);
  }

  /**
   * Das staerkstmoegliche Feld einer Saison: alle Fahrer, die in ihr unter
   * Vertrag standen. `riders.is_retired` taugt dafuer nicht — es beschreibt das
   * Heute, ein spaeter zurueckgetretener Fahrer fiele rueckwirkend aus dem Feld
   * und der Wert der alten Saison stiege ohne Grund.
   */
  private readonly feldCache = new Map<number, number[]>();

  private feldDerSaison(season: number): number[] {
    const gecacht = this.feldCache.get(season);
    if (gecacht) return gecacht;
    const zeilen = this.db.prepare(`
      SELECT DISTINCT rider_id AS riderId FROM contracts
      WHERE start_season <= ? AND end_season >= ?
    `).all(season, season) as Array<{ riderId: number }>;
    if (zeilen.length > 0) {
      const feld = zeilen.map((z) => z.riderId);
      this.feldCache.set(season, feld);
      return feld;
    }

    // Spielstaende ganz am Anfang haben noch keine Vertraege — dann bleibt nur
    // das heutige aktive Feld.
    const ersatz = this.db.prepare('SELECT id FROM riders WHERE is_retired = 0').all() as Array<{ id: number }>;
    const feld = ersatz.map((z) => z.id);
    this.feldCache.set(season, feld);
    return feld;
  }

  /**
   * Karrierepunkte je Fahrer bis zum Stichtag (ausschliesslich). Meisterschaften
   * zaehlen nicht mit: ein Fahrer mit vielen Landestiteln haette sonst eine
   * Karrierewertung, die seine Staerke im Renngeschehen nicht widerspiegelt.
   */
  private karrierepunkteVor(stichtag: string): Map<number, number> {
    const meisterschaften = CHAMPIONSHIP_CATEGORY_IDS.join(',');
    const gepuffert = punktePuffer.get(this.db);
    if (gepuffert && gepuffert.stichtag === stichtag) {
      return gepuffert.werte;
    }

    // Fortschreiben statt neu summieren.
    //
    // Der Spielstand laeuft vorwaerts: der naechste Stichtag liegt fast immer
    // wenige Tage hinter dem gepufferten. Dann reichen die Ereignisse dazwischen
    // — mit dem Index auf `awarded_on` 0,10 ms statt 38 ms fuer die volle
    // Summe ueber alle 74 000 Punkteereignisse.
    //
    // Beim Saisonwechsel wird trotzdem voll gerechnet. Dort tragen Backfills
    // (`nachtragen`) Ereignisse fuer zurueckliegende Tage nach, die eine reine
    // Fortschreibung nicht mehr einsammeln wuerde.
    const gleicheSaison = gepuffert != null && gepuffert.stichtag.slice(0, 4) === stichtag.slice(0, 4);
    if (gepuffert && gleicheSaison && gepuffert.stichtag < stichtag) {
      const nachtrag = this.db.prepare(`
        SELECT rider_id AS riderId, SUM(points_awarded) AS punkte
        FROM season_point_events
        WHERE awarded_on >= ? AND awarded_on < ?
          AND race_id NOT IN (SELECT id FROM races WHERE category_id IN (${meisterschaften}))
        GROUP BY rider_id
      `).all(gepuffert.stichtag, stichtag) as Array<{ riderId: number; punkte: number }>;
      for (const zeile of nachtrag) {
        gepuffert.werte.set(zeile.riderId, (gepuffert.werte.get(zeile.riderId) ?? 0) + zeile.punkte);
      }
      punktePuffer.set(this.db, { stichtag, werte: gepuffert.werte });
      return gepuffert.werte;
    }

    const zeilen = this.db.prepare(`
      SELECT rider_id AS riderId, SUM(points_awarded) AS punkte
      FROM season_point_events
      WHERE awarded_on < ?
        AND race_id NOT IN (SELECT id FROM races WHERE category_id IN (${meisterschaften}))
      GROUP BY rider_id
    `).all(stichtag) as Array<{ riderId: number; punkte: number }>;
    const werte = new Map(zeilen.map((z) => [z.riderId, z.punkte]));
    punktePuffer.set(this.db, { stichtag, werte });
    return werte;
  }
}
