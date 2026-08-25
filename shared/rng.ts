/**
 * Deterministischer Zufall fuer die Rennsimulation.
 *
 * Bis hierher zog die Simulation ueber `Math.random()`. Damit war kein Rennen
 * wiederholbar: keine Wiederholung, keine reproduzierbaren Fehlerberichte,
 * keine Golden-Master-Tests und keine belastbaren Balancing-Laeufe. Mit einem
 * je Etappe gespeicherten Seed liefert dieselbe Etappe mit demselben
 * Starterfeld immer dasselbe Ergebnis.
 *
 * Bewusst ohne Abhaengigkeiten und ohne globalen Zustand: der Generator wird
 * durchgereicht, nicht importiert. Ein modulweiter Generator waere wieder
 * derselbe versteckte globale Zustand, nur mit anderem Namen.
 */

/** Liefert eine Zahl in [0, 1). Signaturgleich zu `Math.random`. */
export type RandomSource = () => number;

/**
 * Mulberry32 — kleiner, schneller 32-Bit-Generator mit guter Gleichverteilung.
 * Fuer eine Spielsimulation mehr als ausreichend; kryptografisch ist er nicht
 * und muss er nicht sein.
 */
export function createSeededRandom(seed: number): RandomSource {
  let state = seed >>> 0;
  return function next(): number {
    state = (state + 0x6D2B79F5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Leitet aus einem Etappen-Seed einen eigenen Seed je Teilsystem ab.
 *
 * Der Grund ist Robustheit gegen spaetere Aenderungen: zoegen alle Teilsysteme
 * aus einem einzigen Strom, wuerde ein zusaetzlicher Zufallsaufruf in der
 * Engine jede nachfolgende Ziehung verschieben — der Ausreisserplan derselben
 * Etappe saehe danach anders aus. Mit getrennten Stroemen bleibt jedes
 * Teilsystem von Aenderungen in den anderen unberuehrt.
 */
export function deriveSeed(seed: number, label: string): number {
  // FNV-1a ueber das Label, danach mit dem Etappen-Seed gemischt.
  let hash = 0x811C9DC5;
  for (let index = 0; index < label.length; index += 1) {
    hash ^= label.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return ((hash ^ (seed >>> 0)) + Math.imul(seed >>> 0, 0x9E3779B1)) >>> 0;
}

/** Erzeugt einen Seed aus echtem Zufall — fuer Etappen ohne gespeicherten Seed. */
export function createRandomSeed(): number {
  return Math.floor(Math.random() * 0xFFFFFFFF) >>> 0;
}

/** Gleichverteilt in [min, max). */
export function randomBetween(random: RandomSource, min: number, max: number): number {
  return min + (random() * (max - min));
}

/** Gleichverteilt in [min, max], beide Grenzen eingeschlossen. */
export function randomInteger(random: RandomSource, min: number, max: number): number {
  const normalizedMin = Math.ceil(Math.min(min, max));
  const normalizedMax = Math.floor(Math.max(min, max));
  return Math.floor(random() * ((normalizedMax - normalizedMin) + 1)) + normalizedMin;
}

/** Ein Element aus der Liste; `undefined` bei leerer Liste. */
export function pickRandom<T>(random: RandomSource, values: readonly T[]): T | undefined {
  if (values.length === 0) {
    return undefined;
  }
  return values[Math.floor(random() * values.length)];
}

/**
 * Fisher-Yates in einer Kopie. Bewusst nicht `sort(() => rng() - 0.5)`: das
 * ist keine Gleichverteilung und je nach Sortierverfahren sogar verzerrt.
 */
export function shuffled<T>(random: RandomSource, values: readonly T[]): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const temporary = result[index] as T;
    result[index] = result[swapIndex] as T;
    result[swapIndex] = temporary;
  }
  return result;
}

/** Fisher-Yates in der uebergebenen Liste. */
export function shuffleInPlace<T>(random: RandomSource, values: T[]): T[] {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const temporary = values[index] as T;
    values[index] = values[swapIndex] as T;
    values[swapIndex] = temporary;
  }
  return values;
}
