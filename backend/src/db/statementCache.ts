/**
 * Zwischenspeicher fuer vorbereitete SQL-Anweisungen.
 *
 * Im Profil des Ergebnis-Speicherns entfielen 12 Prozent der Zeit auf das
 * Kompilieren von SQL: 7348 ausgefuehrte Anweisungen mit 138 verschiedenen
 * Texten, und `db.prepare(...)` steht an ueber hundert Stellen mitten im
 * Ablauf statt einmalig davor. Jede dieser Stellen einzeln umzubauen waere ein
 * grosser Eingriff in Code, der funktioniert; ein Zwischenspeicher an der
 * Verbindung erreicht dasselbe an einer Stelle.
 *
 * Das ist nur zulaessig, weil im Backend weder `pluck()`, `raw()`, `expand()`
 * noch `iterate()` benutzt werden — diese vier veraendern den Zustand einer
 * Anweisung und wuerden sich ueber gemeinsam genutzte Objekte hinweg
 * auswirken. `run`, `get` und `all` sind zustandslos und wiederverwendbar.
 * Wird eine der vier eingefuehrt, muss dieser Zwischenspeicher fallen.
 */

import type Database from 'better-sqlite3';

/**
 * Obergrenze. Einige Abfragen bauen ihre Platzhalterliste aus der Anzahl der
 * Fahrer (`IN (?, ?, …)`) und ergeben damit beliebig viele verschiedene Texte;
 * ohne Grenze wuechse der Speicher unbegrenzt.
 */
const MAX_STATEMENTS = 512;

const installedConnections = new WeakSet<Database.Database>();

/**
 * Haengt den Zwischenspeicher an eine Verbindung. Mehrfachaufrufe sind
 * wirkungslos.
 */
export function installStatementCache(db: Database.Database): void {
  if (installedConnections.has(db)) {
    return;
  }
  installedConnections.add(db);

  const cache = new Map<string, Database.Statement>();
  const original = db.prepare.bind(db);

  (db as { prepare: (sql: string) => Database.Statement }).prepare = (sql: string): Database.Statement => {
    const hit = cache.get(sql);
    if (hit) {
      return hit;
    }
    const statement = original(sql);
    if (cache.size >= MAX_STATEMENTS) {
      // Aeltester Eintrag zuerst — `Map` haelt die Einfuegereihenfolge.
      const oldest = cache.keys().next();
      if (!oldest.done) {
        cache.delete(oldest.value);
      }
    }
    cache.set(sql, statement);
    return statement;
  };
}
