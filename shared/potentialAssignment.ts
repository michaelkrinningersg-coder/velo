/**
 * Potenziale der Bestandsfahrer aus den Newgen-Presets ableiten.
 *
 * Fahrer aus `riders.csv` bringen nur ihre heutigen Faehigkeiten mit. Ihre
 * Potenziale entstanden bisher aus einer eigenen Formel (`buildPotentials` im
 * RiderDevelopmentService), die jeden Skill einzeln um einen Anteil des
 * Abstands zu 85 hochrechnet — ohne Profilbezug. Ein Sprinter bekam auf
 * Kopfstein denselben prozentualen Aufschlag wie auf den Sprint, und kein
 * Bestandsfahrer war einem Preset zuzuordnen.
 *
 * Diese Datei zieht die Potenziale stattdessen aus einem Preset, das zum
 * Fahrer passt. Zwei Regeln tragen das:
 *
 *   1. Ein Preset passt nur, wenn es fuer *jeden* Skill ein Potenzial mindestens
 *      in Hoehe des heutigen Wertes zulaesst. Sonst muesste ein Fahrer
 *      schlechter werden, um ins Preset zu passen.
 *   2. Gezogen wird zwischen dem heutigen Wert und der Obergrenze des Presets.
 *      Damit ist das Potenzial nie kleiner als das Koennen.
 *
 * Wer sein Zielalter schon erreicht hat, waechst ohnehin nicht mehr: bei ihm
 * ist das Potenzial gleich dem heutigen Wert, und ein Preset waere eine
 * Behauptung ueber eine Entwicklung, die nicht mehr stattfindet.
 */

export const POTENTIAL_MAX = 85;

export interface PresetSpanne {
  readonly displayName: string;
  readonly weight: number;
  /** Gesamtwertung aus der Mitte der Spannen — die Staerke des Presets. */
  readonly midOverall: number;
  /** Untergrenze je Skill-Spalte. */
  readonly min: Readonly<Record<string, number>>;
  /** Obergrenze je Skill-Spalte. */
  readonly max: Readonly<Record<string, number>>;
}

/**
 * Wie stark die Auswahl eines Fahrers ohne Vertrag zu Presets nahe seinem
 * heutigen Koennen gezogen wird. Der Wert ist die Spanne in Punkten, ueber die
 * das Gewicht auf 1/e faellt.
 *
 * Der Grund: die Vertraeglichkeitsregel laesst jedes Preset zu, dessen
 * Obergrenzen der Fahrer nicht ueberschreitet — fuer einen schwachen Fahrer
 * also fast den ganzen Katalog, samt der Spitzenpresets. Gleichverteilt
 * gezogen bekam ein Vertragsloser dadurch im Schnitt elf Punkte Luft nach oben,
 * ein Fahrer im Team nur sechs. Das ist verkehrt herum: wer keinen Vertrag
 * bekommen hat, ist der, den kein Team wollte.
 */
export const OHNE_VERTRAG_NAEHE = 5;

/**
 * Wie stark die Ziehung innerhalb der Preset-Spanne bei einem Fahrer ohne
 * Vertrag zum unteren Rand neigt. 1 ist gleichverteilt, groessere Werte ziehen
 * nach unten.
 *
 * Der Massstab ist der Newgen-Jahrgang: von ihm erreichen 21 Prozent ein
 * Potenzial ueber 74. Die Vertragslosen im Bestand lagen nach der
 * gleichverteilten Ziehung bei 32 Prozent — sie waeren also anderthalbmal so
 * oft stark geworden wie ein frischer Jahrgang, und das alles auf einmal.
 */
export const OHNE_VERTRAG_NEIGUNG = 1.5;

/**
 * Laesst dieses Preset fuer jeden Skill ein Potenzial zu, das den heutigen Wert
 * nicht unterschreitet?
 */
export function istPresetVertraeglich(
  preset: PresetSpanne,
  skills: Readonly<Record<string, number>>,
  spalten: readonly string[],
): boolean {
  return spalten.every((spalte) => (preset.max[spalte] ?? 0) >= (skills[spalte] ?? 0));
}

/**
 * Zieht die Potenziale eines Fahrers aus einem Preset.
 *
 * Die Untergrenze ist der hoehere von beiden Werten: die des Presets und der
 * heutige Skill. Liegt der Skill ueber der Preset-Untergrenze, verliert das
 * Preset dort seinen Spielraum nach unten — gewollt, denn ein Fahrer soll durch
 * die Zuordnung nichts einbuessen.
 */
export function ziehePotenziale(
  preset: PresetSpanne,
  skills: Readonly<Record<string, number>>,
  spalten: readonly string[],
  zufall: () => number,
  neigung = 1,
): Record<string, number> {
  const potenziale: Record<string, number> = {};
  // Eine Neigung ueber 1 verschiebt die Gleichverteilung zum unteren Rand der
  // Spanne, ohne sie zu verlassen — die Grenzen des Presets bleiben gueltig.
  const ziehe = () => (neigung === 1 ? zufall() : Math.pow(zufall(), neigung));
  for (const spalte of spalten) {
    const heute = skills[spalte] ?? 0;
    const untere = Math.max(heute, preset.min[spalte] ?? heute);
    const obere = Math.min(POTENTIAL_MAX, Math.max(untere, preset.max[spalte] ?? untere));
    // Ganzzahlig wie bei den Newgens; aufgerundet, damit ein gebrochener
    // Ist-Wert nicht durch das Abrunden unterschritten wird.
    const von = Math.ceil(untere - 1e-9);
    const bis = Math.max(von, Math.floor(obere + 1e-9));
    potenziale[spalte] = von + Math.floor(ziehe() * (bis - von + 1));
  }
  return potenziale;
}

/**
 * Gewichtete Auswahl aus den vertraeglichen Presets.
 *
 * Ist `naeheZuKoennen` gesetzt, faellt das Gewicht eines Presets exponentiell
 * mit dem Abstand seiner Mitte ueber diesem Koennen. Presets unterhalb werden
 * nicht bevorzugt — sie sind ohnehin selten vertraeglich, und ein Fahrer soll
 * nicht kuenstlich klein gehalten werden, nur weil er heute schon gut ist.
 */
export function waehlePreset(
  kandidaten: readonly PresetSpanne[],
  zufall: () => number,
  naeheZuKoennen?: number,
): PresetSpanne | null {
  if (kandidaten.length === 0) return null;
  const gewicht = (p: PresetSpanne): number => {
    const grund = Math.max(1, p.weight);
    if (naeheZuKoennen == null) return grund;
    const ueber = Math.max(0, p.midOverall - naeheZuKoennen);
    return grund * Math.exp(-ueber / OHNE_VERTRAG_NAEHE);
  };
  const gesamt = kandidaten.reduce((summe, p) => summe + gewicht(p), 0);
  if (!(gesamt > 0)) return kandidaten[kandidaten.length - 1]!;
  let rest = zufall() * gesamt;
  for (const preset of kandidaten) {
    rest -= gewicht(preset);
    if (rest <= 0) return preset;
  }
  return kandidaten[kandidaten.length - 1]!;
}
