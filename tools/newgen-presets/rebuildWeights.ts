/**
 * Rechnet die Gewichtsspalte der Newgen-Potenzial-Presets neu.
 *
 * Aufruf:
 *   node -r ts-node/register/transpile-only tools/newgen-presets/rebuildWeights.ts [--schreiben]
 *
 * Ohne --schreiben wird nur berichtet, was sich aendern wuerde.
 *
 * Die Gewichte werden nicht von Hand gepflegt: sie folgen aus der Stufe des
 * Presets und dem Zielanteil dieser Stufe (shared/newgenPresetTiers.ts). Wer
 * ein Preset hinzufuegt oder seine Spannen verschiebt, laesst danach dieses
 * Werkzeug laufen — die Stufenanteile bleiben dann von allein richtig.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  NEWGEN_PRESET_TIERS,
  resolveNewgenPresetWeights,
} from '../../shared/newgenPresetTiers';

const CSV = path.resolve(__dirname, '../../data/csv/newgen_potential_presets.csv');

function lies(): { kopf: string[]; zeilen: Array<Record<string, string>> } {
  const roh = fs.readFileSync(CSV, 'utf8').replace(/\r/g, '').trim().split('\n');
  const kopf = roh[0]!.split(',');
  const zeilen = roh.slice(1).map((zeile) => {
    const felder = zeile.split(',');
    const eintrag: Record<string, string> = {};
    kopf.forEach((spalte, index) => { eintrag[spalte] = felder[index] ?? ''; });
    return eintrag;
  });
  return { kopf, zeilen };
}

function main(): void {
  const schreiben = process.argv.includes('--schreiben');
  const { kopf, zeilen } = lies();
  const gewichte = resolveNewgenPresetWeights(zeilen);

  const summe = gewichte.reduce((wert, eintrag) => wert + eintrag.weight, 0);
  console.log(`${zeilen.length} Presets, Gewichtssumme ${summe}\n`);
  console.log('Stufe  ab mid   Presets  Gewicht je  Gewicht gesamt  Anteil   Ziel     Deckel');
  for (const stufe of NEWGEN_PRESET_TIERS) {
    const gruppe = gewichte.filter((eintrag) => eintrag.tier === stufe.key);
    if (gruppe.length === 0) {
      console.log(`  ${stufe.key}    ${String(stufe.abMidOverall).padStart(6)}        0           —               0    0,0%  ${(100 * stufe.zielanteil).toFixed(1)}%   ${stufe.deckel ?? '—'}`);
      continue;
    }
    const gesamt = gruppe.reduce((wert, eintrag) => wert + eintrag.weight, 0);
    console.log(`  ${stufe.key}    ${String(stufe.abMidOverall).padStart(6)}  ${String(gruppe.length).padStart(7)}  ${String(gruppe[0]!.weight).padStart(10)}  ${String(gesamt).padStart(14)}  ${(100 * gesamt / summe).toFixed(1).padStart(5)}%  ${(100 * stufe.zielanteil).toFixed(1).padStart(5)}%   ${stufe.deckel ?? '—'}`);
  }

  const nachId = new Map(gewichte.map((eintrag) => [eintrag.presetId, eintrag]));
  let geaendert = 0;
  for (const zeile of zeilen) {
    const neu = nachId.get(Number(zeile['preset_id']));
    if (!neu) continue;
    if (String(neu.weight) !== zeile['weight']) geaendert += 1;
    zeile['weight'] = String(neu.weight);
  }
  console.log(`\n${geaendert} Presets bekommen ein anderes Gewicht.`);

  if (!schreiben) {
    console.log('Nichts geschrieben — mit --schreiben ausfuehren.');
    return;
  }
  const ausgabe = [kopf.join(',')]
    .concat(zeilen.map((zeile) => kopf.map((spalte) => zeile[spalte]).join(',')))
    .join('\n');
  fs.writeFileSync(CSV, `${ausgabe}\n`);
  console.log(`geschrieben: ${CSV}`);
}

main();
