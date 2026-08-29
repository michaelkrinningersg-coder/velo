/**
 * Mehrjahreslauf zur Kalibrierung der Feldstaerke.
 *
 * Aufruf:
 *   NODE_PATH=backend/node_modules \
 *   TS_NODE_COMPILER_OPTIONS='{"module":"commonjs","moduleResolution":"node"}' \
 *     node -r ./backend/node_modules/ts-node/register/transpile-only \
 *     tools/feldstaerke/mehrjahreslauf.ts <spielstand.db> [jahre]
 *
 * NODE_PATH ist noetig, weil die Abhaengigkeiten im backend liegen und dieses
 * Werkzeug daneben.
 *
 * Die Frage, auf die das Werkzeug antwortet: bleibt die Zahl der starken
 * Fahrer ueber die Jahre stabil, oder laeuft das Feld nach oben oder unten
 * davon? Gefahren wird mit den echten Diensten — Newgens, Entwicklung, Abbau
 * und Ruhestand — auf einer Kopie des Spielstands.
 *
 * Was der Lauf NICHT enthaelt: Rennen, Draft und Vertraege. Renntage heben den
 * Entwicklungswert um bis zu fuenf Punkte und ziehen damit das Zielalter vor;
 * sie aendern aber nicht, WIE HOCH ein Fahrer kommt — das steht im Potenzial.
 * Fuer die Frage nach der ZAHL starker Fahrer ist der Lauf deshalb belastbar,
 * fuer die Frage, WANN einer stark wird, ist er etwas zu langsam; die
 * Beharrungswerte duerften in einem gefahrenen Spiel eher leicht hoeher liegen.
 *
 * Ohne Draft laufen alle Vertraege aus, und der Ruhestand haengt dann allein am
 * Karriereende des Fahrers. Das ist die Absicht: so misst der Lauf die
 * Alterung des Feldes und nicht die Kaderpolitik der Teams.
 *
 * Gemessen an einem Spielstand von 2027 ueber 25 Jahre: das Feld laeuft nicht
 * davon. Ueber 74 pendelt es sich bei rund 105 Fahrern ein (Start 56), ueber 77
 * bei 5 bis 9 (Start 4). Ueber 80 bleibt niemand — siehe unten.
 *
 * Die Decke: ein Preset koennte rechnerisch einen Fahrer mit 81,6 hergeben,
 * wenn jeder der fuenfzehn Skills seine Obergrenze traefe. Da fuenfzehn
 * unabhaengige Zuege gemittelt werden, liegt das Ergebnis aber eng um die Mitte
 * des Presets (76,6 beim staerksten). Nach 25 Jahren war der beste erzeugte
 * Fahrer 78,8. Ein Fahrer wie Pogacar mit 81,5 stammt aus der Importliste und
 * ist mit den Presets nicht nachzubauen.
 */

import Database from 'better-sqlite3';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { DatabaseService } from '../../backend/src/db/DatabaseService';
import { RiderNewgenService } from '../../backend/src/game/RiderNewgenService';
import { RiderDevelopmentService } from '../../backend/src/game/RiderDevelopmentService';
import { ContractService } from '../../backend/src/game/ContractService';

interface Jahreszeile {
  saison: number;
  feld: number;
  ueber74: number;
  ueber77: number;
  ueber80: number;
  mittel: number;
  /** Dieselben Zahlen fuer das Potenzial — was das Feld noch werden kann. */
  potMittel: number;
  potUeber74: number;
  potUeber77: number;
  medianAlter: number;
  newgens: number;
  ruhestand: number;
}

function zaehle(db: Database.Database, saison: number): Omit<Jahreszeile, 'saison' | 'newgens' | 'ruhestand'> {
  const zeilen = db.prepare(
    'SELECT overall_rating AS ovr, pot_overall AS pot, birth_year FROM riders WHERE is_retired = 0',
  ).all() as Array<{ ovr: number; pot: number; birth_year: number }>;
  const alter = zeilen.map((z) => saison - z.birth_year).sort((a, b) => a - b);
  const n = Math.max(1, zeilen.length);
  return {
    feld: zeilen.length,
    ueber74: zeilen.filter((z) => z.ovr > 74).length,
    ueber77: zeilen.filter((z) => z.ovr > 77).length,
    ueber80: zeilen.filter((z) => z.ovr > 80).length,
    mittel: zeilen.reduce((s, z) => s + z.ovr, 0) / n,
    potMittel: zeilen.reduce((s, z) => s + z.pot, 0) / n,
    potUeber74: zeilen.filter((z) => z.pot > 74).length,
    potUeber77: zeilen.filter((z) => z.pot > 77).length,
    medianAlter: alter[Math.floor(alter.length / 2)] ?? 0,
  };
}

/** Die staerksten Fahrer am Ende des Laufs. */
function zeigeSpitze(db: Database.Database, saison: number, anzahl: number): void {
  const zeilen = db.prepare(`
    SELECT r.first_name AS vorname, r.last_name AS nachname, ${saison} - r.birth_year AS alt,
           r.overall_rating AS ovr, r.pot_overall AS pot, r.pot_preset_key AS preset,
           land.code_3 AS land, tr.display_name AS spez
    FROM riders r
    LEFT JOIN sta_country land ON land.id = r.country_id
    LEFT JOIN type_rider tr ON tr.id = r.specialization_1_id
    WHERE r.is_retired = 0
    ORDER BY r.overall_rating DESC LIMIT ?
  `).all(anzahl) as Array<Record<string, string | number>>;

  console.log(`\nDie ${anzahl} staerksten Fahrer in ${saison}`);
  console.log('  # | Fahrer | Land | Alter | OVR | Potenzial | Spez | Preset');
  zeilen.forEach((z, i) => {
    console.log(
      String(i + 1).padStart(3) + ' | ' + `${z['vorname']} ${z['nachname']}`.padEnd(28)
      + ' | ' + String(z['land'] ?? '???') + ' | ' + String(z['alt']).padStart(2)
      + ' | ' + Number(z['ovr']).toFixed(1).padStart(4)
      + ' | ' + Number(z['pot']).toFixed(1).padStart(4)
      + ' | ' + String(z['spez'] ?? '?').padEnd(19)
      + ' | ' + String(z['preset'] ?? '— (Import)'),
    );
  });
}

function main(): void {
  const quelle = process.argv[2];
  const jahre = Number(process.argv[3] ?? 20);
  if (!quelle || !fs.existsSync(quelle)) {
    console.error('Spielstand angeben, z. B. savegames/meins.db');
    process.exit(1);
  }

  // Immer auf einer Kopie — der Lauf schreibt in die Datenbank.
  const kopie = path.join(path.dirname(quelle), `lauf-${Date.now()}.db`);
  fs.copyFileSync(quelle, kopie);
  const db = new Database(kopie);
  new DatabaseService().applySchemaTo(db);

  const start = (db.prepare('SELECT season FROM game_state WHERE id = 1').get() as { season: number }).season;
  const reihe: Jahreszeile[] = [];
  reihe.push({ saison: start, ...zaehle(db, start), newgens: 0, ruhestand: 0 });

  for (let i = 1; i <= jahre; i++) {
    const saison = start + i;
    const vorher = (db.prepare('SELECT COUNT(*) AS n FROM riders').get() as { n: number }).n;
    const aktivVorher = (db.prepare('SELECT COUNT(*) AS n FROM riders WHERE is_retired = 0').get() as { n: number }).n;

    // 1. Ruhestand: wer sein Karriereende erreicht hat und keinen Vertrag mehr
    //    hat, hoert auf. Ohne Draft laufen alle Vertraege aus.
    new ContractService(db).checkContractStatuses(saison, true);
    // 2. Newgens des Jahrgangs, danach ihr Altersprofil.
    new RiderNewgenService(db).createYearStartNewgens(saison);
    new RiderDevelopmentService(db).initializeRiders(saison);
    // 3. Ein Jahr Entwicklung. Gebuendelte Schritte sind exakt (siehe
    //    shared/riderProgression.ts), zwoelf Monate plus fuenf Tage.
    const dienst = new RiderDevelopmentService(db);
    for (let monat = 0; monat < 12; monat++) {
      dienst.advanceDailyDevelopment(`${saison}-01-01`, saison, [], 30);
    }
    dienst.advanceDailyDevelopment(`${saison}-12-27`, saison, [], 5);

    const nachher = (db.prepare('SELECT COUNT(*) AS n FROM riders').get() as { n: number }).n;
    const aktivNachher = (db.prepare('SELECT COUNT(*) AS n FROM riders WHERE is_retired = 0').get() as { n: number }).n;
    const newgens = nachher - vorher;
    reihe.push({
      saison, ...zaehle(db, saison), newgens,
      ruhestand: aktivVorher + newgens - aktivNachher,
    });
  }

  console.log('\n       |      |  Gesamtwertung        |     Potenzial      |        |         |');
  console.log('Saison | Feld | >74 | >77 | >80 |  Ø   | >74  | >77 |  Ø   | Alter | Newgens | Rente');
  for (const z of reihe) {
    console.log(
      String(z.saison).padStart(6) + ' | ' + String(z.feld).padStart(4)
      + ' | ' + String(z.ueber74).padStart(3) + ' | ' + String(z.ueber77).padStart(3)
      + ' | ' + String(z.ueber80).padStart(3) + ' | ' + z.mittel.toFixed(1).padStart(4)
      + ' | ' + String(z.potUeber74).padStart(4) + ' | ' + String(z.potUeber77).padStart(3)
      + ' | ' + z.potMittel.toFixed(1).padStart(4)
      + ' | ' + String(z.medianAlter).padStart(5) + ' | ' + String(z.newgens).padStart(7)
      + ' | ' + String(z.ruhestand).padStart(5),
    );
  }
  const erste = reihe[0]!;
  const letzte = reihe[reihe.length - 1]!;
  console.log(`\nUeber ${jahre} Jahre: Feld ${erste.feld} -> ${letzte.feld}, `
    + `>74 ${erste.ueber74} -> ${letzte.ueber74}, >77 ${erste.ueber77} -> ${letzte.ueber77}, `
    + `>80 ${erste.ueber80} -> ${letzte.ueber80}`);
  zeigeSpitze(db, start + jahre, Number(process.env['SPITZE'] ?? 50));
  console.log(`\nKopie: ${kopie}`);
  db.close();
}

main();
