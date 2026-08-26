/**
 * Modell gegen die echten Etappen halten.
 *
 * Liest `ziele_real.csv` — je echte Etappe eine Zeile mit den gemessenen
 * Groessen — und simuliert *dieselbe* Etappe: gleiche Distanz, gleicher
 * stage_score, gleiche Feldgroesse, gleiches Terrain. Damit faellt jeder
 * Vergleichsfehler weg, der sonst daher kaeme, dass eine synthetische
 * Testetappe anders lang oder anders schwer ist als die echte.
 *
 * Gibt je Terrain aus, wie weit das Modell danebenliegt. Aendert nichts.
 *
 * Aufruf:  node tools/real-data/runVergleich.js
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { simulateQuickStage } from '../../shared/quickSim/simulateStage';
import { DEFAULT_QUICK_SIM_PROFILES } from '../../shared/quickSimProfiles';
import { TIME_LIMIT_PERCENT_BY_PROFILE } from '../../shared/stageResultRules';
import { createSeededRandom } from '../../shared/rng';
import type { StageProfile } from '../../shared/types';

/** Laeufe je echter Etappe. Der Median daraus ist der Modellwert. */
const LAEUFE = 50;
/** Dieselbe Regel wie in der Auswertung der echten Listen. */
const ZEITGLEICH_SEKUNDEN = 1;
const ANTEILE = [0.05, 0.10, 0.25, 0.50, 0.75, 0.90, 1.00];
/** Diese Profile werden gemessen, aber nicht nachgezogen. */
const NUR_KONTROLLE: ReadonlySet<string> = new Set(['Flat', 'Rolling']);
const ORDNUNG: StageProfile[] = ['Flat', 'Rolling', 'Hilly', 'Hilly_Difficult', 'Medium_Mountain', 'Mountain', 'High_Mountain'];

interface EchteZeile { terrain: string; km: number; ps: number; finisher: number; [feld: string]: string | number }

function liesCsv(datei: string): EchteZeile[] {
  const zeilen = fs.readFileSync(datei, 'utf8').trim().split('\n');
  const kopf = zeilen[0]!.split(',');
  return zeilen.slice(1).map((zeile) => {
    const felder = zeile.split(',');
    const raus: Record<string, string | number> = {};
    kopf.forEach((name, index) => {
      const roh = felder[index] ?? '';
      const zahl = Number(roh);
      raus[name] = roh !== '' && Number.isFinite(zahl) ? zahl : roh;
    });
    return raus as unknown as EchteZeile;
  });
}

const median = (werte: number[]): number => {
  const sortiert = [...werte].sort((links, rechts) => links - rechts);
  return sortiert[Math.floor(sortiert.length / 2)] ?? 0;
};

/** Kennzahlen eines Laufs — dieselben, die `werte_ergebnisse_aus.py` misst. */
function kennzahlen(rueckstaende: number[], km: number): Record<string, number> {
  const anzahl = rueckstaende.length;
  const gruppen: number[] = [1];
  for (let index = 1; index < anzahl; index += 1) {
    if (rueckstaende[index]! - rueckstaende[index - 1]! <= ZEITGLEICH_SEKUNDEN) {
      gruppen[gruppen.length - 1] += 1;
    } else {
      gruppen.push(1);
    }
  }
  const raus: Record<string, number> = {
    erste_gruppe: gruppen[0]!,
    zeitgruppen: gruppen.length,
    gruppengroesse_hinten: (anzahl - gruppen[0]!) / Math.max(1, gruppen.length - 1),
    letzter_je_km: rueckstaende[anzahl - 1]! / km,
  };
  for (const anteil of ANTEILE) {
    const index = Math.min(anzahl - 1, Math.max(0, Math.round(anteil * anzahl) - 1));
    raus[`p${Math.round(anteil * 100)}_je_km`] = rueckstaende[index]! / km;
  }
  return raus;
}

function simuliere(zeile: EchteZeile): Record<string, number> | null {
  const profil = zeile.terrain as StageProfile;
  const parameter = DEFAULT_QUICK_SIM_PROFILES[profil];
  if (!parameter || !(zeile.km > 0) || !(zeile.finisher >= 20)) {
    return null;
  }
  // Die Scores tragen nur die Reihenfolge — die Rueckstaende haengen im
  // Modell an der Position im Feld, nicht am Score-Abstand.
  const fahrer = Array.from({ length: zeile.finisher }, (_, index) => ({
    riderId: index + 1,
    score: 90 - (index * (21 / zeile.finisher)),
    photoFinishScore: 90 - (index * (21 / zeile.finisher)),
  }));
  const grenze = TIME_LIMIT_PERCENT_BY_PROFILE[profil] ?? 20;
  const je: Record<string, number[]> = {};
  const ueberLimit: number[] = [];
  for (let seed = 0; seed < LAEUFE; seed += 1) {
    const lauf = simulateQuickStage({
      profile: profil, distanceKm: zeile.km, stageScore: zeile.ps,
      parameters: parameter, riders: fahrer, random: createSeededRandom(seed),
    });
    const rueckstaende = lauf.entries
      .filter((eintrag) => !eintrag.isAbandon && eintrag.gapSeconds != null)
      .map((eintrag) => eintrag.gapSeconds!)
      .sort((links, rechts) => links - rechts);
    if (rueckstaende.length < 20) continue;
    for (const [name, wert] of Object.entries(kennzahlen(rueckstaende, zeile.km))) {
      (je[name] ??= []).push(wert);
    }
    // Siegerzeit aus dem Modell ist hier nicht noetig: das Limit haengt an
    // ihr, und die echte Siegerzeit steht in der Etappe. Ersatzweise die
    // Referenzgeschwindigkeit des Profils.
    const siegerzeit = (zeile.km / parameter.baseSpeedKmh) * 3600;
    ueberLimit.push(rueckstaende.filter((r) => r > siegerzeit * (grenze / 100)).length);
  }
  if (Object.keys(je).length === 0) return null;
  const raus: Record<string, number> = {};
  for (const [name, werte] of Object.entries(je)) raus[name] = median(werte);
  raus['ueber_zeitlimit'] = median(ueberLimit);
  return raus;
}

const ziele = path.join(__dirname, 'ziele_real.csv');
if (!fs.existsSync(ziele)) {
  console.error(`${ziele} fehlt — erst werte_ergebnisse_aus.py laufen lassen.`);
  process.exit(1);
}
const echte = liesCsv(ziele);
const nachTerrain = new Map<string, Array<{ echt: EchteZeile; modell: Record<string, number> }>>();
let uebersprungen = 0;
for (const zeile of echte) {
  const modell = simuliere(zeile);
  if (modell == null) { uebersprungen += 1; continue; }
  const liste = nachTerrain.get(zeile.terrain) ?? [];
  liste.push({ echt: zeile, modell });
  nachTerrain.set(zeile.terrain, liste);
}
console.log(`${echte.length - uebersprungen} Etappen verglichen, je ${LAEUFE} Laeufe (${uebersprungen} uebersprungen)\n`);

const GROESSEN: Array<[string, string, number]> = [
  ['erste_gruppe', 'erste Zeitgruppe (Fahrer)', 0],
  ['zeitgruppen', 'Anzahl Zeitgruppen', 0],
  ['gruppengroesse_hinten', 'Gruppengroesse dahinter', 1],
  ['p25_je_km', 'Rueckstand bei 25 % (s/km)', 2],
  ['p50_je_km', 'Rueckstand bei 50 % (s/km)', 2],
  ['p75_je_km', 'Rueckstand bei 75 % (s/km)', 2],
  ['letzter_je_km', 'Rueckstand des Letzten (s/km)', 2],
  ['ueber_zeitlimit', 'ueber dem Zeitlimit', 1],
];
for (const terrain of ORDNUNG) {
  const paare = nachTerrain.get(terrain);
  if (!paare || paare.length === 0) continue;
  const vermerk = NUR_KONTROLLE.has(terrain) ? '   — nur Kontrolle, wird nicht nachgezogen' : '';
  console.log(`${terrain}  (${paare.length} Etappen)${vermerk}`);
  console.log('  Groesse                          echt      Modell     Faktor');
  for (const [feld, beschriftung, nachkomma] of GROESSEN) {
    const echt = median(paare.map((paar) => Number(paar.echt[feld])).filter(Number.isFinite));
    const modell = median(paare.map((paar) => paar.modell[feld]!).filter(Number.isFinite));
    const faktor = echt === 0 ? (modell === 0 ? 1 : Infinity) : modell / echt;
    const zeichen = Number.isFinite(faktor) ? `${faktor.toFixed(2)}x` : '—';
    console.log(`  ${beschriftung.padEnd(30)}${echt.toFixed(nachkomma).padStart(8)}`
      + `${modell.toFixed(nachkomma).padStart(12)}${zeichen.padStart(11)}`);
  }
  console.log('');
}
