/**
 * Misst das Fortschreiten eines Spielstands Schritt fuer Schritt.
 *
 * Aufruf:
 *   NODE_PATH=backend/node_modules \
 *   TS_NODE_COMPILER_OPTIONS='{"module":"commonjs","moduleResolution":"node"}' \
 *     node -r ./backend/node_modules/ts-node/register/transpile-only \
 *     tools/fortschritt/messung.ts <spielstand.db> [monate] [arbeitskopie.db]
 *
 * Was herauskommt:
 *   - Wanduhr je Phase eines Auto-Weiter-Schritts
 *   - jede ausgefuehrte SQL-Anweisung, der Phase zugeordnet, nach Zeit und
 *     nach Haeufigkeit sortiert
 *   - die Groesse der wichtigsten Tabellen
 *
 * `SPUR=<Anfang einer SQL>` haengt eine Aufrufer-Zaehlung an: welche Stelle im
 * Code diese Abfrage wie oft ausloest. Damit laesst sich eine teure Abfrage
 * ihrem Verursacher zuordnen, statt ihn zu erraten.
 *
 * Der Spielstand wird kopiert, nicht veraendert. `STUMM=0` laesst die
 * Protokollausgabe der Simulation stehen.
 */
import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { DatabaseService } from '../../backend/src/db/DatabaseService';
import { GameStateService } from '../../backend/src/game/GameStateService';
import { einSchritt, neueUhr, PHASEN } from './schritt';
import { herkunft, instrumentiere, sqlPosten, sqlZuruecksetzen } from './instrument';

const QUELLE = process.argv[2];
const MONATE = Number(process.argv[3] ?? 2);
if (!QUELLE) {
  process.stderr.write('Aufruf: messung.ts <spielstand.db> [monate] [arbeitskopie.db]\n');
  process.exit(1);
}
const ARBEIT = process.argv[4] ?? path.join(path.dirname(QUELLE), 'messung-arbeitskopie.db');

const stumm = process.env['STUMM'] !== '0';
const echo = (zeile: string) => process.stdout.write(zeile + '\n');
if (stumm) {
  for (const name of ['log', 'table', 'debug', 'info', 'warn', 'group', 'groupEnd', 'dir']) {
    (console as any)[name] = () => {};
  }
}

for (const anhang of ['', '-wal', '-shm']) {
  if (fs.existsSync(QUELLE + anhang)) fs.copyFileSync(QUELLE + anhang, ARBEIT + anhang);
}
const db = new Database(ARBEIT);
new DatabaseService().applySchemaTo(db);

const gss = new GameStateService(db);
gss.ensureState();
const startDatum = gss.loadState().currentDate;

// Erst nach dem Schema instrumentieren: der Anweisungs-Zwischenspeicher haengt
// sich beim Laden an, die Messhuelle muss darueber liegen.
const uhr = neueUhr();
instrumentiere(db, uhr);
sqlZuruecksetzen();

function plusMonate(iso: string, n: number): string {
  const [jahr, monat, tag] = iso.split('-').map(Number);
  const gesamt = (jahr! * 12) + (monat! - 1) + n;
  return Math.floor(gesamt / 12) + '-'
    + String((gesamt % 12) + 1).padStart(2, '0') + '-'
    + String(tag).padStart(2, '0');
}
const ende = plusMonate(startDatum, MONATE);

const gesamtStart = Date.now();
let schritte = 0;
let etappen = 0;
let tage = 0;
/** Kosten je Schritt-Art: wie oft und wieviel ms je Phase. */
const jeArt = new Map<string, { n: number; ms: Map<string, number> }>();
for (;;) {
  const datum = gss.loadState().currentDate;
  if (datum >= ende) break;
  let ergebnis;
  try {
    ergebnis = einSchritt(db, gss, uhr);
  } catch (fehler) {
    echo('!! ' + datum + ': ' + (fehler as Error).message);
    break;
  }
  if (!ergebnis) break;
  schritte += 1;
  if (ergebnis.art === 'etappe') etappen += 1; else tage += 1;
  const art = ergebnis.art === 'tag' ? 'Tageswechsel' : (ergebnis.art2 ?? 'unbekannt');
  let eintrag = jeArt.get(art);
  if (!eintrag) { eintrag = { n: 0, ms: new Map() }; jeArt.set(art, eintrag); }
  eintrag.n += 1;
  for (const [phase, wert] of Object.entries(ergebnis.ms ?? {})) {
    eintrag.ms.set(phase, (eintrag.ms.get(phase) ?? 0) + (wert as number));
  }
}
const gesamt = (Date.now() - gesamtStart) / 1000;

echo('');
echo('== Lauf ==');
echo('Von ' + startDatum + ' bis ' + gss.loadState().currentDate
  + ' | ' + schritte + ' Schritte (' + etappen + ' Etappen, ' + tage + ' Tage)'
  + ' | ' + gesamt.toFixed(1) + ' s'
  + ' | ' + ((gesamt * 1000) / Math.max(1, schritte)).toFixed(0) + ' ms je Schritt');

echo('');
echo('== Phasen ==');
echo(['Phase', 'Sekunden', 'Anteil', 'Aufrufe', 'ms je Aufruf', 'davon SQL s', 'SQL-Anteil'].join('\t'));
const summe = PHASEN.reduce((s, p) => s + (uhr.zeit.get(p) ?? 0), 0);
// Wieviel einer Phase in SQL steckt und wieviel in JavaScript: ohne die
// Aufteilung sucht man an einer Abfrage herum, obwohl die Zeit im Mapping liegt.
const sqlJePhase = new Map<string, number>();
for (const e of sqlPosten()) sqlJePhase.set(e.phase, (sqlJePhase.get(e.phase) ?? 0) + e.ms);
for (const p of [...PHASEN].sort((a, b) => (uhr.zeit.get(b) ?? 0) - (uhr.zeit.get(a) ?? 0))) {
  const ms = uhr.zeit.get(p) ?? 0;
  const n = uhr.anzahl.get(p) ?? 0;
  const sql = sqlJePhase.get(p) ?? 0;
  echo([p, (ms / 1000).toFixed(2), ((ms / Math.max(1, summe)) * 100).toFixed(1) + '%', n,
    (ms / Math.max(1, n)).toFixed(1), (sql / 1000).toFixed(2),
    ((sql / Math.max(1, ms)) * 100).toFixed(0) + '%'].join('\t'));
}
echo(['SUMME', (summe / 1000).toFixed(2), '100%', '', ''].join('\t'));

echo('');
echo('== Kosten je Schritt-Art ==');
echo(['Art', 'Schritte', 'ms je Schritt', 'Summe s', 'Anteil', ...PHASEN.map((p) => p + ' ms')].join('\t'));
const artReihen = [...jeArt.entries()]
  .map(([art, e]) => ({ art, e, gesamtMs: [...e.ms.values()].reduce((s2, v) => s2 + v, 0) }))
  .sort((a, b) => b.gesamtMs - a.gesamtMs);
const artSumme = artReihen.reduce((s2, r) => s2 + r.gesamtMs, 0);
for (const r of artReihen) {
  echo([r.art, r.e.n, (r.gesamtMs / r.e.n).toFixed(1), (r.gesamtMs / 1000).toFixed(2),
    ((r.gesamtMs / Math.max(1, artSumme)) * 100).toFixed(1) + '%',
    ...PHASEN.map((p) => ((r.e.ms.get(p) ?? 0) / r.e.n).toFixed(1))].join('\t'));
}

const alle = sqlPosten();
const sqlSumme = alle.reduce((s, e) => s + e.ms, 0);
echo('');
echo('== SQL gesamt: ' + (sqlSumme / 1000).toFixed(2) + ' s in '
  + alle.reduce((s, e) => s + e.anzahl, 0) + ' Ausfuehrungen, '
  + alle.length + ' verschiedene (Phase x Text) ==');

echo('');
echo('== Teuerste SQL-Anweisungen ==');
echo(['ms', 'Anteil', 'Aufrufe', 'ms/Aufruf', 'Phase', 'SQL'].join('\t'));
for (const e of [...alle].sort((a, b) => b.ms - a.ms).slice(0, 30)) {
  echo([e.ms.toFixed(0), ((e.ms / Math.max(1, sqlSumme)) * 100).toFixed(1) + '%', e.anzahl,
    (e.ms / e.anzahl).toFixed(2), e.phase, e.sql].join('\t'));
}

// Dieselbe Abfrage taucht oft in mehreren Phasen auf. Erst zusammengefasst
// sieht man, was sie ueber den ganzen Schritt kostet.
const jeText = new Map<string, { ms: number; anzahl: number; phasen: Set<string> }>();
for (const e of alle) {
  let t = jeText.get(e.sql);
  if (!t) { t = { ms: 0, anzahl: 0, phasen: new Set() }; jeText.set(e.sql, t); }
  t.ms += e.ms; t.anzahl += e.anzahl; t.phasen.add(e.phase);
}
echo('');
echo('== Teuerste SQL-Anweisungen, ueber alle Phasen zusammengefasst ==');
echo(['ms', 'Anteil', 'Aufrufe', 'ms/Aufruf', 'Phasen', 'SQL'].join('\t'));
for (const [sql, t] of [...jeText.entries()].sort((a, b) => b[1].ms - a[1].ms).slice(0, 25)) {
  echo([t.ms.toFixed(0), ((t.ms / Math.max(1, sqlSumme)) * 100).toFixed(1) + '%', t.anzahl,
    (t.ms / t.anzahl).toFixed(2), [...t.phasen].join('+'), sql].join('\t'));
}

echo('');
echo('== Haeufigste SQL-Anweisungen ==');
echo(['Aufrufe', 'ms', 'ms/Aufruf', 'Phase', 'SQL'].join('\t'));
for (const e of [...alle].sort((a, b) => b.anzahl - a.anzahl).slice(0, 20)) {
  echo([e.anzahl, e.ms.toFixed(0), (e.ms / e.anzahl).toFixed(3), e.phase, e.sql].join('\t'));
}

if (herkunft.size > 0) {
  echo('');
  echo('== Herkunft der verfolgten Abfrage ==');
  for (const [zeile, n] of [...herkunft.entries()].sort((a, b) => b[1] - a[1])) {
    echo(n + '\t' + zeile);
  }
}

echo('');
echo('== Groesse des Spielstands ==');
for (const tabelle of ['riders', 'results', 'results_flat', 'results_history', 'race_results_compact',
  'stage_entries', 'active_race_entries', 'race_entries_compact', 'season_point_events',
  'contracts', 'stages', 'races', 'rider_daily_state', 'stage_marker_results',
  'rider_season_stats', 'rider_career_category_stats', 'rider_badges', 'draft_history']) {
  try {
    const n = (db.prepare('SELECT COUNT(*) AS n FROM ' + tabelle).get() as { n: number }).n;
    echo(tabelle + '\t' + n);
  } catch { /* Tabelle fehlt in diesem Spielstand */ }
}
echo('Datei\t' + (fs.statSync(ARBEIT).size / 1048576).toFixed(1) + ' MB');
db.close();
