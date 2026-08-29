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
  /** Untergrenze je Skill-Spalte. */
  readonly min: Readonly<Record<string, number>>;
  /** Obergrenze je Skill-Spalte. */
  readonly max: Readonly<Record<string, number>>;
}

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
): Record<string, number> {
  const potenziale: Record<string, number> = {};
  for (const spalte of spalten) {
    const heute = skills[spalte] ?? 0;
    const untere = Math.max(heute, preset.min[spalte] ?? heute);
    const obere = Math.min(POTENTIAL_MAX, Math.max(untere, preset.max[spalte] ?? untere));
    // Ganzzahlig wie bei den Newgens; aufgerundet, damit ein gebrochener
    // Ist-Wert nicht durch das Abrunden unterschritten wird.
    const von = Math.ceil(untere - 1e-9);
    const bis = Math.max(von, Math.floor(obere + 1e-9));
    potenziale[spalte] = von + Math.floor(zufall() * (bis - von + 1));
  }
  return potenziale;
}

/** Gewichtete Auswahl aus den vertraeglichen Presets. */
export function waehlePreset(
  kandidaten: readonly PresetSpanne[],
  zufall: () => number,
): PresetSpanne | null {
  if (kandidaten.length === 0) return null;
  const gesamt = kandidaten.reduce((summe, p) => summe + Math.max(1, p.weight), 0);
  let rest = zufall() * gesamt;
  for (const preset of kandidaten) {
    rest -= Math.max(1, preset.weight);
    if (rest <= 0) return preset;
  }
  return kandidaten[kandidaten.length - 1]!;
}
