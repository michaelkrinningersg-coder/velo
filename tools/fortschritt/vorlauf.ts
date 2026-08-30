/**
 * Bringt einen Spielstand auf ein Zieldatum und schreibt mit, was jeder Monat
 * gekostet hat.
 *
 * Aufruf:
 *   NODE_PATH=backend/node_modules \
 *   TS_NODE_COMPILER_OPTIONS='{"module":"commonjs","moduleResolution":"node"}' \
 *     node -r ./backend/node_modules/ts-node/register/transpile-only \
 *     tools/fortschritt/vorlauf.ts <quelle.db> <ziel.db> <JJJJ-MM-TT>
 *
 * Wozu: das Spiel wird mit dem Alter des Spielstands langsamer, und die Frage
 * ist, wo. Der Lauf liefert die Kurve dazu — je Monat die Wanduhr und die
 * Aufteilung auf die Phasen eines Auto-Weiter-Schritts. Nebenbei entsteht ein
 * fortgeschrittener Spielstand, an dem sich mit `messung.ts` fein messen laesst.
 *
 * Die Quelle wird kopiert, nicht veraendert.
 *
 * `STUMM=0` laesst die Protokollausgabe der Simulation stehen. Sonst ist sie
 * abgeschaltet: sie kostet Zeit und macht die Tabelle unlesbar.
 */
import Database from 'better-sqlite3';
import * as fs from 'fs';
import { DatabaseService } from '../../backend/src/db/DatabaseService';
import { GameStateService } from '../../backend/src/game/GameStateService';
import { einSchritt, neueUhr, PHASEN } from './schritt';

const QUELLE = process.argv[2];
const ZIELDATEI = process.argv[3];
const ZIEL = process.argv[4];
if (!QUELLE || !ZIELDATEI || !ZIEL) {
  process.stderr.write('Aufruf: vorlauf.ts <quelle.db> <ziel.db> <JJJJ-MM-TT>\n');
  process.exit(1);
}

const stumm = process.env['STUMM'] !== '0';
const echo = (zeile: string) => process.stdout.write(zeile + '\n');
if (stumm) {
  for (const name of ['log', 'table', 'debug', 'info', 'warn', 'group', 'groupEnd', 'dir']) {
    (console as any)[name] = () => {};
  }
}

for (const anhang of ['', '-wal', '-shm']) {
  if (fs.existsSync(QUELLE + anhang)) fs.copyFileSync(QUELLE + anhang, ZIELDATEI + anhang);
}
const db = new Database(ZIELDATEI);
new DatabaseService().applySchemaTo(db);

const gss = new GameStateService(db);
gss.ensureState();

let monat = '';
let start = Date.now();
let schritteImMonat = 0;
let etappenImMonat = 0;
let uhr = neueUhr();

echo(['Monat', 'Schritte', 'Etappen', 'Sekunden', ...PHASEN].join('\t'));

const zeileAusgeben = () => {
  if (!monat) return;
  const sekunden = (Date.now() - start) / 1000;
  echo([monat, schritteImMonat, etappenImMonat, sekunden.toFixed(2),
    ...PHASEN.map((p) => (uhr.zeit.get(p) ?? 0).toFixed(0))].join('\t'));
};

let schutz = 0;
for (;;) {
  const datum = gss.loadState().currentDate;
  if (datum >= ZIEL) break;
  if (++schutz > 200000) { echo('Abbruch: zu viele Schritte'); break; }

  const laufenderMonat = datum.slice(0, 7);
  if (laufenderMonat !== monat) {
    zeileAusgeben();
    monat = laufenderMonat;
    start = Date.now();
    schritteImMonat = 0;
    etappenImMonat = 0;
    uhr = neueUhr();
  }

  let ergebnis;
  try {
    ergebnis = einSchritt(db, gss, uhr);
  } catch (fehler) {
    echo('!! ' + datum + ': ' + (fehler as Error).message);
    break;
  }
  if (!ergebnis) break;
  schritteImMonat += 1;
  if (ergebnis.art === 'etappe') etappenImMonat += 1;
}
zeileAusgeben();
echo('Fertig bei ' + gss.loadState().currentDate);
db.close();
