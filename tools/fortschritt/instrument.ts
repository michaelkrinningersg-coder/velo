/**
 * Misst jede ausgefuehrte SQL-Anweisung und ordnet sie der laufenden Phase zu.
 *
 * Haengt sich UEBER den Anweisungs-Zwischenspeicher (`installStatementCache`),
 * misst also die Ausfuehrung, nicht das Kompilieren. Der Zwischenspeicher gibt
 * dasselbe Statement-Objekt mehrfach zurueck — die Messhuelle wird deshalb je
 * Objekt einmal gebaut und gemerkt.
 *
 * `SPUR=<Anfang der SQL>` zaehlt zusaetzlich mit, aus welcher Stelle im Code
 * eine bestimmte Abfrage kommt. Ohne das raet man, welcher der vielen Aufrufer
 * gemeint ist. Mehrere Anfaenge lassen sich mit `;;` trennen; die Zaehlung
 * nennt dann je Zeile, welche Abfrage gemeint war.
 */
import type Database from 'better-sqlite3';
import type { Uhr } from './schritt';

export interface SqlPosten {
  sql: string;
  phase: string;
  ms: number;
  anzahl: number;
}

const posten = new Map<string, SqlPosten>();

/** Aufrufstelle -> Anzahl, nur fuer die per `SPUR` verfolgte Abfrage. */
export const herkunft = new Map<string, number>();

function kuerze(sql: string): string {
  return sql.replace(/\s+/g, ' ').trim().slice(0, 200);
}

function buche(phase: string, sql: string, ms: number): void {
  const schluessel = phase + ' :: ' + sql;
  let eintrag = posten.get(schluessel);
  if (!eintrag) {
    eintrag = { sql, phase, ms: 0, anzahl: 0 };
    posten.set(schluessel, eintrag);
  }
  eintrag.ms += ms;
  eintrag.anzahl += 1;
}

export function sqlPosten(): SqlPosten[] {
  return [...posten.values()];
}

export function sqlZuruecksetzen(): void {
  posten.clear();
  herkunft.clear();
}

export function instrumentiere(db: Database.Database, uhr: Uhr): void {
  const originalPrepare = db.prepare.bind(db);
  const huellen = new WeakMap<object, unknown>();
  const spur = (process.env['SPUR'] ?? '').split(';;').map((x) => x.trim()).filter(Boolean);

  (db as any).prepare = (sql: string) => {
    const stmt = originalPrepare(sql) as unknown as object;
    const vorhanden = huellen.get(stmt);
    if (vorhanden) return vorhanden;
    const kurz = kuerze(sql);
    const huelle = new Proxy(stmt, {
      get(ziel: any, name: string | symbol) {
        const wert = ziel[name];
        if (name === 'run' || name === 'get' || name === 'all') {
          return (...args: unknown[]) => {
            const start = process.hrtime.bigint();
            try {
              return wert.apply(ziel, args);
            } finally {
              buche(uhr.phase ?? 'sonstiges', kurz, Number(process.hrtime.bigint() - start) / 1e6);
              const treffer = spur.find((anfang) => kurz.startsWith(anfang));
              if (treffer) {
                const zeile = ((new Error().stack ?? '').split('\n')
                  .find((z) => /backend\/src|frontend\/src/.test(z)) ?? '?').trim();
                const schluessel = treffer.slice(0, 40) + ' <- ' + zeile;
                herkunft.set(schluessel, (herkunft.get(schluessel) ?? 0) + 1);
              }
            }
          };
        }
        return typeof wert === 'function' ? wert.bind(ziel) : wert;
      },
    });
    huellen.set(stmt, huelle);
    return huelle;
  };

  const originalExec = db.exec.bind(db);
  (db as any).exec = (sql: string) => {
    const start = process.hrtime.bigint();
    try {
      return originalExec(sql);
    } finally {
      buche(uhr.phase ?? 'sonstiges', 'EXEC ' + kuerze(sql), Number(process.hrtime.bigint() - start) / 1e6);
    }
  };
}
