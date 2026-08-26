/**
 * Distanz, Hoehenmeter und stage_score aller eigenen Etappen einsammeln.
 *
 * Laeuft ueber `readStageScoreSegments` und `calculateStageScore`, damit
 * derselbe Wert herauskommt wie im Spiel. Schreibt `eigene_etappen.json`,
 * aus der `klassifiziere_etappen.py` den Terrain-Klassifikator lernt.
 *
 * Aufruf:  node tools/real-data/run.js
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { readStageScoreSegments } from '../../backend/src/bootstrapper';
import { calculateStageScore } from '../../backend/src/simulation/StageScoreCalculator';

const WURZEL = path.join(__dirname, '..', '..');

/** CSV-Zeile zerlegen, Anfuehrungszeichen beachten (allowed_weather enthaelt Kommas). */
function zerlege(zeile: string): string[] {
  const felder: string[] = [];
  let aktuell = '';
  let inAnfuehrung = false;
  for (const zeichen of zeile) {
    if (zeichen === '"') inAnfuehrung = !inAnfuehrung;
    else if (zeichen === ',' && !inAnfuehrung) { felder.push(aktuell); aktuell = ''; }
    else aktuell += zeichen;
  }
  felder.push(aktuell);
  return felder;
}

const csv = fs.readFileSync(path.join(WURZEL, 'data', 'csv', 'stages.csv'), 'utf8').trim().split('\n');
const kopf = zerlege(csv[0]!);
const etappen = csv.slice(1).map((zeile) => {
  const felder = zerlege(zeile);
  return Object.fromEntries(kopf.map((k, i) => [k, felder[i] ?? '']));
});

const raus: Array<{ profile: string; km: number; hm: number; score: number }> = [];
let ohneDetails = 0;
for (const etappe of etappen) {
  try {
    const segmente = readStageScoreSegments(etappe['details_csv_file']!, etappe['id']!);
    const km = segmente.reduce((summe, s) => summe + s.lengthKm, 0);
    // Hoehenmeter: nur die Anstiege, so zaehlt PCS die `vertical_meters` auch.
    const hm = segmente.reduce((summe, s) => summe + Math.max(0, (s.gradientPercent / 100) * s.lengthKm * 1000), 0);
    const ergebnis = calculateStageScore(segmente, Number(etappe['start_elevation'] ?? 0)) as unknown;
    const score = typeof ergebnis === 'number' ? ergebnis : ((ergebnis as { stageScore?: number })?.stageScore ?? 0);
    raus.push({ profile: etappe['profile']!, km, hm, score });
  } catch {
    // Zeitfahren ohne Detaildatei — fuer den Klassifikator ohnehin ohne Belang.
    ohneDetails += 1;
  }
}

fs.writeFileSync(path.join(__dirname, 'eigene_etappen.json'), JSON.stringify(raus));
console.log(`${raus.length} Etappen geschrieben, ${ohneDetails} ohne Detaildatei uebersprungen.`);
