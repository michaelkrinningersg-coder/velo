/**
 * Wer am 01.08. verlaengert wird.
 *
 * Bisher entschied das eine Mischung: alle auslaufenden Vertraege wurden
 * gemischt und die ersten 35 % verlaengert. Der Zufall traf jeden gleich, und
 * gemessen an den 532 auslaufenden Vertraegen der Saison 2027 hiess das:
 *
 *   65 % der Teams verlieren ihren besten auslaufenden Fahrer an den Draft,
 *   52 von 80 auslaufenden Kapitaenen und Co-Kapitaenen gehen mit,
 *   und von den Fahrern ab 32 werden anteilig genauso viele verlaengert wie
 *   von den unter 24-Jaehrigen.
 *
 * Die letzte Zeile ist der eigentliche Schaden: sie arbeitet gegen die
 * Vertragslaengen, die genau andersherum gebaut sind (U23 drei bis fuenf
 * Jahre, Veteranen eins bis zwei — siehe `contractTerms.ts`).
 *
 * Was hier NICHT passiert: die Zahl der Verlaengerungen aendern. Sie bleibt bei
 * 35 % je Team. Die Kaderfluktuation haengt daran und ist frisch geeicht
 * (gemessen 8,8 Zugaenge je Team, Zielspanne 6 bis 10); sie soll sich nicht
 * als Nebenwirkung mitbewegen. Es aendert sich nur, WER die 35 % sind.
 */

/**
 * Wie stark der Wert die Auswahl bestimmt.
 *
 * 0 waere die alte Mischung, 3 waere deterministisch. Gemessen an den echten
 * Kadern: bei 1,4 bleibt der beste auslaufende Fahrer eines Teams in 95 % der
 * Faelle, bei 0,6 erst in 75 %. Ueber 2,0 aendert sich kaum noch etwas, es
 * verschwinden nur die Ueberraschungen.
 */
export const RENEWAL_SHARPNESS = 1.4;

/** Bis zu diesem Alter zaehlt das Potenzial mit. */
export const RENEWAL_YOUNG_MAX_AGE = 25;
/** Anteil des Potenzials am Wert junger Fahrer. */
export const RENEWAL_POTENTIAL_WEIGHT = 0.3;
/** Abzug je Jahr, das ein Fahrer ueber seinem Decline Age liegt. */
export const RENEWAL_DECLINE_PENALTY_PER_YEAR = 0.8;

/**
 * Mindestwahrscheinlichkeit fuer Fahrer, die keine Ziehung entscheiden sollte.
 *
 * Kapitaene fallen ohne diese Regel auf 65 %, weil viele von ihnen alt sind und
 * der Altersabzug sie trifft. Ein Team laesst seinen Kapitaen aber nicht aus
 * Versehen ziehen. Junge Talente sind der Kern, den die langen Vertraege
 * binden sollen.
 */
export const RENEWAL_CAPTAIN_FLOOR = 0.85;
export const RENEWAL_TALENT_FLOOR = 0.8;
/**
 * Der wertvollste auslaufende Fahrer eines Teams.
 *
 * Ohne ihn blieb er gemessen nur in 52 bis 76 % der Faelle — nicht wegen der
 * Ziehung, sondern weil Kapitaene und Talente das Kontingent aufbrauchen und
 * ihn verdraengen. Da die Kappung bei zu vielen gesetzten Faellen nach Wert
 * sortiert, ueberlebt er sie als Wertvollster immer.
 *
 * Bewusst 0,9 und nicht 1,0: bei Sicherheit wuerde der beste auslaufende
 * Fahrer eines Teams nie mehr auf den Markt kommen. Ein Zehntel bleibt.
 */
export const RENEWAL_BEST_FLOOR = 0.9;
export const RENEWAL_TALENT_MAX_AGE = 21;
export const RENEWAL_TALENT_POTENTIAL = 74;

export interface RenewalCandidate {
  /** Vertrag, der verlaengert wuerde. */
  contractId: number;
  riderId: number;
  overall: number;
  potential: number;
  age: number;
  /** Decline Age des Fahrers; 0 oder negativ heisst unbekannt. */
  declineAge: number;
  /** Kapitaen oder Co-Kapitaen? */
  isCaptain: boolean;
}

/**
 * Was ein Fahrer seinem Team fuer die kommenden Jahre wert ist.
 *
 * Bewusst nicht die blanke Gesamtwertung: die bevorzugt den 33-Jaehrigen vor
 * dem 22-Jaehrigen. Eine Ziehung nach ihr verlaengert die Fahrer ab 32 sogar
 * haeufiger als der reine Zufall (gemessen 41 % gegen 35 %) und die unter
 * 24-Jaehrigen seltener (25 %) — das Gegenteil dessen, was die Vertragslaengen
 * wollen.
 */
export function resolveRenewalValue(candidate: RenewalCandidate): number {
  const basis = candidate.age < RENEWAL_YOUNG_MAX_AGE
    ? (candidate.overall * (1 - RENEWAL_POTENTIAL_WEIGHT)) + (candidate.potential * RENEWAL_POTENTIAL_WEIGHT)
    : candidate.overall;
  const declineAge = candidate.declineAge > 0 ? candidate.declineAge : 30;
  const abzug = Math.max(0, candidate.age - declineAge) * RENEWAL_DECLINE_PENALTY_PER_YEAR;
  return basis - abzug;
}

/**
 * Mindestwahrscheinlichkeit eines Fahrers, oder 0.
 *
 * `isMostValuable` markiert den wertvollsten auslaufenden Fahrer seines Teams.
 */
export function resolveRenewalFloor(
  candidate: RenewalCandidate,
  teamMedianValue: number,
  isMostValuable = false,
): number {
  if (isMostValuable) {
    return RENEWAL_BEST_FLOOR;
  }
  if (candidate.isCaptain && resolveRenewalValue(candidate) > teamMedianValue) {
    return RENEWAL_CAPTAIN_FLOOR;
  }
  if (candidate.age < RENEWAL_TALENT_MAX_AGE && candidate.potential >= RENEWAL_TALENT_POTENTIAL) {
    return RENEWAL_TALENT_FLOOR;
  }
  return 0;
}

function median(werte: number[]): number {
  if (werte.length === 0) return 0;
  const sortiert = [...werte].sort((links, rechts) => links - rechts);
  const mitte = Math.floor(sortiert.length / 2);
  return sortiert.length % 2 === 0
    ? (sortiert[mitte - 1]! + sortiert[mitte]!) / 2
    : sortiert[mitte]!;
}

/**
 * Waehlt aus den auslaufenden Vertraegen EINES Teams die aus, die verlaengert
 * werden.
 *
 * Je Team, nicht global: standardisiert wird innerhalb des eigenen Kaders,
 * damit auch ein schwaches Team seine Besten behaelt und nicht nur die Teams
 * mit den absolut staerksten Fahrern.
 *
 * `random` liefert Zahlen in [0, 1) — so bleibt die Funktion ohne eigenen
 * Zufall und laesst sich testen.
 */
export function selectRenewalCandidates(
  candidates: readonly RenewalCandidate[],
  count: number,
  random: () => number,
): RenewalCandidate[] {
  const ziel = Math.max(0, Math.min(count, candidates.length));
  if (ziel === 0 || candidates.length === 0) return [];
  if (ziel >= candidates.length) return [...candidates];

  const werte = new Map(candidates.map((c) => [c.riderId, resolveRenewalValue(c)]));
  const mittelwert = median([...werte.values()]);
  const bester = candidates.reduce((links, rechts) => (
    (werte.get(rechts.riderId) as number) > (werte.get(links.riderId) as number) ? rechts : links
  ));

  // 1. Gesetzte Faelle: Kapitaene ueber dem Median und junge Talente ziehen
  //    ihre Mindestwahrscheinlichkeit, verbrauchen aber Plaetze aus demselben
  //    Kontingent — die Gesamtzahl bleibt.
  const gesetzt: RenewalCandidate[] = [];
  const offen: RenewalCandidate[] = [];
  for (const candidate of candidates) {
    const schwelle = resolveRenewalFloor(candidate, mittelwert, candidate.riderId === bester.riderId);
    if (schwelle > 0 && random() < schwelle) gesetzt.push(candidate);
    else offen.push(candidate);
  }

  if (gesetzt.length >= ziel) {
    // Mehr gesetzte Faelle als Plaetze: die wertvollsten zuerst.
    return gesetzt
      .sort((links, rechts) => (werte.get(rechts.riderId) as number) - (werte.get(links.riderId) as number))
      .slice(0, ziel);
  }

  // 2. Rest per gewichteter Ziehung ohne Zuruecklegen.
  const restWerte = offen.map((c) => werte.get(c.riderId) as number);
  const mittel = restWerte.reduce((summe, wert) => summe + wert, 0) / Math.max(1, restWerte.length);
  const varianz = restWerte.reduce((summe, wert) => summe + ((wert - mittel) ** 2), 0) / Math.max(1, restWerte.length);
  const streuung = Math.sqrt(varianz) || 1;

  const topf = offen.map((candidate) => ({
    candidate,
    gewicht: Math.exp(RENEWAL_SHARPNESS * (((werte.get(candidate.riderId) as number) - mittel) / streuung)),
  }));

  const gewaehlt = [...gesetzt];
  while (gewaehlt.length < ziel && topf.length > 0) {
    const summe = topf.reduce((wert, eintrag) => wert + eintrag.gewicht, 0);
    let wurf = random() * summe;
    let index = topf.length - 1;
    for (let i = 0; i < topf.length; i += 1) {
      wurf -= topf[i]!.gewicht;
      if (wurf <= 0) { index = i; break; }
    }
    gewaehlt.push(topf[index]!.candidate);
    topf.splice(index, 1);
  }
  return gewaehlt;
}
