/**
 * Vertragslaengen.
 *
 * Frueher gleichverteilt 1 bis 3 Jahre, sowohl im Draft als auch bei der
 * Verlaengerung am 01.08. Daraus folgt eine mittlere Laufzeit von 2 Jahren,
 * also laeuft die Haelfte aller Kader jedes Jahr aus — gemessen 532 von 1000
 * Vertraegen. Zusammen mit den anderen Stellschrauben ergab das 15 von 40
 * Fahrern Fluktuation je Saison.
 *
 * Die Laenge haengt jetzt am Fahrer statt am Zufall allein. Das senkt nicht
 * nur die Fluktuation, es erzeugt auch die Struktur, die ein Team ausmacht:
 * junge Talente sind der Kern und bleiben lange, alte Fahrer und Mitlaeufer
 * rotieren am Rand.
 *
 *   Abgaenge = Kadergroesse x (1/Laufzeit) x (1 - Quote 01.08.)
 *                           x (1 - Quote im Draft)  +  Renteneintritte
 *
 * Mit mittlerer Laufzeit 3, Quote 0,35 und Draft-Quote 0,25 landet man bei
 * 40 x 0,333 x 0,65 x 0,75 = 6,5 plus rund 1,5 Renteneintritte, also 8.
 */

export interface ContractTermInput {
  /** Alter zum Saisonbeginn. */
  age: number;
  /** Potenzial-Gesamtwertung. */
  potential: number;
  /** Retirement Age des Fahrers; 0 oder negativ heisst unbekannt. */
  retirementAge: number;
  /** Prestige des anbietenden Teams, 1 bis 5. Ohne Angabe 3. */
  teamPrestige?: number;
}

/** Spanne der Laufzeit je Fahrergruppe. */
export interface ContractTermRange { min: number; max: number }

export const CONTRACT_TERM_YOUNG: ContractTermRange = { min: 3, max: 5 };
export const CONTRACT_TERM_PRIME_TALENT: ContractTermRange = { min: 3, max: 4 };
export const CONTRACT_TERM_PRIME: ContractTermRange = { min: 2, max: 3 };
export const CONTRACT_TERM_VETERAN: ContractTermRange = { min: 1, max: 2 };
export const CONTRACT_TERM_LAST_YEARS: ContractTermRange = { min: 1, max: 1 };

export const YOUNG_MAX_AGE = 23;
/**
 * Ab hier gibt es nur noch kurze Vertraege.
 *
 * Nicht 30, sondern 32: der Free-Agent-Pool ist alt, und mit der Grenze bei 30
 * kam die mittlere Laufzeit im gemessenen Lauf nur auf 2,5 statt der
 * angestrebten 3,0 Jahre — die Fluktuation blieb bei rund 10 statt 8.
 */
export const VETERAN_MIN_AGE = 32;
export const PRIME_TALENT_POTENTIAL = 74;
/** So viele Jahre vor dem Karriereende gibt es nur noch Einjahresvertraege. */
export const LAST_YEARS_BEFORE_RETIREMENT = 2;

/**
 * Wie stark das Prestige die anbietbare Laufzeit verschiebt.
 *
 * Ein Prestige-5-Team bindet ein Talent ein Jahr laenger als ein
 * Prestige-1-Team. Damit wandern die besten Nachwuchsfahrer mit der Zeit nach
 * oben, und die schwachen Teams werden zu Ausbildungsteams — das ist eine
 * eigene Identitaet und nicht nur "schlechter".
 */
export const PRESTIGE_TERM_OFFSET: Readonly<Record<number, number>> = {
  1: -1, 2: 0, 3: 0, 4: 1, 5: 1,
};

export function resolveContractTermRange(input: ContractTermInput): ContractTermRange {
  const restJahre = input.retirementAge > 0 ? input.retirementAge - input.age : Number.POSITIVE_INFINITY;
  if (restJahre <= LAST_YEARS_BEFORE_RETIREMENT) return CONTRACT_TERM_LAST_YEARS;
  if (input.age < YOUNG_MAX_AGE) return CONTRACT_TERM_YOUNG;
  if (input.age >= VETERAN_MIN_AGE) return CONTRACT_TERM_VETERAN;
  return input.potential >= PRIME_TALENT_POTENTIAL ? CONTRACT_TERM_PRIME_TALENT : CONTRACT_TERM_PRIME;
}

/**
 * Laufzeit eines Vertrags in Jahren.
 *
 * `random` liefert eine Zahl in [0, 1) — so bleibt die Funktion ohne eigenen
 * Zufall und laesst sich testen.
 */
export function resolveContractYears(input: ContractTermInput, random: () => number): number {
  const spanne = resolveContractTermRange(input);
  const versatz = PRESTIGE_TERM_OFFSET[Math.max(1, Math.min(5, Math.round(input.teamPrestige ?? 3)))] ?? 0;
  const min = Math.max(1, spanne.min);
  const max = Math.max(min, spanne.max + versatz);
  const jahre = min + Math.floor(random() * ((max - min) + 1));
  // Nie ueber das Karriereende hinaus.
  const rest = input.retirementAge > 0 ? Math.max(1, input.retirementAge - input.age) : jahre;
  return Math.max(1, Math.min(jahre, rest));
}
