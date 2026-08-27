/**
 * Automatische Auswahl der Verlaengerungsziele.
 *
 * Das Auswahlfenster am 10.01. blockiert den Tageswechsel. Damit ein
 * unbeaufsichtigtes Spiel dort nicht stehen bleibt, waehlt es nach fuenf
 * Minuten selbst aus und bestaetigt.
 *
 * Die Regel ist bewusst schlicht: wer das Alterslimit erreicht hat, bekommt
 * keinen neuen Vertrag — bei ihm lohnt die Verlaengerung nicht mehr. Von den
 * uebrigen werden die besten drei Viertel gewaehlt; das letzte Viertel ist
 * der Teil des Kaders, den man ohnehin austauschen wuerde.
 *
 * Liegt in `shared/`, weil es eine Spielregel ist und nicht Bedienung — und
 * weil es sich hier ohne Browser testen laesst.
 */

/** Wie lange das Fenster offen bleibt, bevor es selbst auswaehlt. */
export const AUTO_SELECT_AFTER_MS = 5 * 60 * 1000;
/** Ab diesem Alter waehlt die Automatik einen Fahrer nicht mehr aus. */
export const AUTO_SELECT_MAX_AGE = 32;
/** Anteil der uebrigen Fahrer, den die Automatik auswaehlt. */
export const AUTO_SELECT_SHARE = 0.75;

export interface AutoSelectCandidate {
  riderId: number;
  age: number;
  overallRating: number;
}

/**
 * Auswahl der Automatik, nach Gesamtwertung absteigend. Bei Gleichstand
 * entscheidet die Fahrer-Id, damit dieselbe Liste immer dieselbe Auswahl
 * ergibt.
 */
export function resolveAutoSelection(liste: ReadonlyArray<AutoSelectCandidate>): number[] {
  const jung = [...liste]
    .filter((kandidat) => kandidat.age < AUTO_SELECT_MAX_AGE)
    .sort((links, rechts) => rechts.overallRating - links.overallRating || links.riderId - rechts.riderId);
  return jung.slice(0, Math.round(jung.length * AUTO_SELECT_SHARE)).map((kandidat) => kandidat.riderId);
}
