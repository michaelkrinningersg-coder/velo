import type Database from 'better-sqlite3';

/**
 * Schreibt Zeilen als Mehrzeilen-INSERT in festen Blockgroessen.
 *
 * Feste Groessen (64, 8, 1) statt "so viele wie gerade da sind": jede
 * Blockgroesse ist eine eigene vorbereitete Anweisung im Statement-Cache, und
 * eine Anweisung je moeglicher Zeilenzahl wuerde ihn mit Einmal-Eintraegen
 * fuellen. Die Reihenfolge der Zeilen bleibt erhalten.
 *
 * `beiFehler` bekommt die Zeile, an der ein Block scheitert: der Block wird
 * dann zeilenweise wiederholt, damit die Fehlermeldung die schuldige Zeile
 * nennt statt nur "Block von 64".
 */
export function schreibeInBloecken(
  db: Database.Database,
  kopf: string,
  zeile: string,
  zeilen: unknown[][],
  beiFehler?: (zeile: unknown[], fehler: Error) => never,
): void {
  let ab = 0;
  for (const groesse of [64, 8, 1]) {
    if (ab >= zeilen.length) break;
    const anweisung = db.prepare(kopf + Array.from({ length: groesse }, () => zeile).join(', '));
    while (zeilen.length - ab >= groesse) {
      const block = zeilen.slice(ab, ab + groesse);
      try {
        anweisung.run(...block.flat());
      } catch (fehler) {
        if (!beiFehler || groesse === 1) throw fehler;
        // Zeilenweise nachfassen, damit die Meldung die Zeile benennt.
        const einzeln = db.prepare(kopf + zeile);
        for (const z of block) {
          try { einzeln.run(...z); } catch (e) { beiFehler(z, e as Error); }
        }
        throw fehler;
      }
      ab += groesse;
    }
  }
}
