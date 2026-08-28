/**
 * Qualitaet der Startliste eines Rennens.
 *
 * Gemessen an den UCI-Karrierepunkten der Starter zum Zeitpunkt des Rennstarts.
 * Der rohe Wert taugt nicht als Vergleichsgroesse: Karrierepunkte wachsen
 * monoton, in Saison 1 hat niemand welche und in Saison 20 jeder Tausende. Eine
 * Summe stiege damit jedes Jahr, unabhaengig davon, wer tatsaechlich am Start
 * steht.
 *
 * Deshalb wird gegen das *staerkstmoegliche Feld derselben Saison* normiert:
 * die Summe der Karrierepunkte der besten Fahrer, so viele wie das Rennen
 * Starter hat. Der Wert beantwortet damit "welchen Anteil der ueberhaupt
 * verfuegbaren Feldstaerke hat dieses Rennen angezogen" — beschraenkt auf 0 bis
 * 100 und ueber Saisons vergleichbar.
 *
 * Die Bezugsgroesse ist die tatsaechliche Starterzahl, nicht eine feste Zahl:
 * sonst misst der Wert vor allem die Feldgroesse statt die Qualitaet.
 *
 * Der Wert wird einmal beim Rennstart berechnet und gespeichert. Er laesst sich
 * spaeter nicht nachrechnen, weil die Startliste einer vergangenen Saison
 * nirgends erhalten bleibt (`active_race_entries` haelt immer nur die
 * laufende).
 */

/** Eingabe der Berechnung: Karrierepunkte, absteigend sortiert oder nicht. */
export interface StartlistQualityInput {
  /** Karrierepunkte je Starter, zum Startdatum. */
  starterPoints: number[];
  /**
   * Karrierepunkte aller Fahrer im Spiel, zum selben Datum. Daraus werden die
   * besten `starterPoints.length` genommen.
   */
  fieldPoints: number[];
}

export interface StartlistQualityResult {
  /** 0 bis 100, oder null wenn das staerkstmoegliche Feld null Punkte hat. */
  score: number | null;
  /** Summe der Karrierepunkte der Starter. */
  rawPoints: number;
  /** Summe des staerkstmoeglichen Feldes gleicher Groesse. */
  maxPoints: number;
  starters: number;
}

export function computeStartlistQuality(input: StartlistQualityInput): StartlistQualityResult {
  const starters = input.starterPoints.length;
  const rawPoints = input.starterPoints.reduce((summe, punkte) => summe + Math.max(0, punkte), 0);

  const besteZuerst = [...input.fieldPoints].sort((links, rechts) => rechts - links);
  const maxPoints = besteZuerst
    .slice(0, starters)
    .reduce((summe, punkte) => summe + Math.max(0, punkte), 0);

  // In der ersten Saison hat noch niemand Punkte. Dann gibt es keinen
  // sinnvollen Wert - lieber nichts anzeigen als eine Ersatzgroesse, die in
  // derselben Kurve etwas anderes misst.
  if (starters === 0 || maxPoints <= 0) {
    return { score: null, rawPoints, maxPoints, starters };
  }

  // Die Starter *sind* eine Teilmenge des Feldes, der Anteil kann also nie
  // ueber 100 liegen. Die Klammer faengt nur Rundung ab.
  const score = Math.min(100, (rawPoints / maxPoints) * 100);
  return { score: Math.round(score * 10) / 10, rawPoints, maxPoints, starters };
}
