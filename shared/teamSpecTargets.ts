/**
 * Zielverteilung der Spezialisierungen je Team.
 *
 * Frueher hatte ein Team drei feste Fokusplaetze (`ai_focus_1..3`) und alles
 * andere war ihm gleichgueltig. Gemessen fuehrte das zu Kadern ohne jeden
 * brauchbaren Sprinter, Zeitfahrer oder Pflasterfahrer: drei Teams hatten gar
 * keinen Zeitfahrer, elf hatten ihre Sprint-Quote erfuellt und trotzdem
 * niemanden ueber 72.
 *
 * Jetzt strebt jedes Team fuer *jede* Spezialisierung einen Anteil an. Der
 * Schwerpunkt bleibt ueber die Hoehe des Anteils erhalten (28 / 23 / 19 Prozent
 * gegen 10 Prozent Grundanteil), aber keine Spezialisierung faellt mehr ganz
 * heraus.
 *
 * Der Angreifer ist bewusst nicht dabei: der Klassifikator erzeugt keine, und
 * ein Ziel, das niemand erfuellen kann, verzerrt nur die uebrigen Anteile.
 */

/** Die sechs Spezialisierungen, auf die sich die Zielverteilung bezieht. */
export const TARGET_SPEC_IDS = [1, 2, 3, 4, 5, 7] as const;
export type TargetSpecId = (typeof TARGET_SPEC_IDS)[number];

/**
 * Ab welcher Gesamtstaerke ein Fahrer eine Spezialisierung als "abgedeckt"
 * gilt.
 *
 * Gemessen am Feld: ueber 74 gibt es im ganzen Spiel nur 56 Fahrer, davon je
 * genau einen fuer Pflaster und Flach — 24 von 25 Teams koennten das Ziel dort
 * nie erreichen. Bei 72 stehen 208 Fahrer zur Verfuegung, rechnerisch 4,7
 * Spezialisierungen je Team. Damit ist das Ziel anspruchsvoll und trotzdem
 * erreichbar.
 */
export const SPEC_QUALITY_THRESHOLD = 72;

/**
 * So viele Spezialisierungen soll ein Team mit mindestens einem Fahrer ueber
 * der Schwelle besetzen. Welche, ergibt sich aus den hoechsten Zielanteilen —
 * so jagt nicht jedes Team dieselben drei.
 */
export const QUALITY_GOAL_SPEC_COUNT = 3;

/**
 * Pflaster zaehlt gesondert: ein Fahrer ueber der Schwelle genuegt, und das
 * Ziel gilt unabhaengig davon, ob Pflaster unter den drei hoechsten Anteilen
 * liegt. Bei Schwelle 72 gibt es 15 solcher Fahrer — es reicht also nicht fuer
 * jedes Team, bleibt aber ein sinnvolles Streben.
 */
export const COBBLE_SPEC_ID = 5;
export const COBBLE_QUALITY_GOAL = 1;

/** Staerke des Zuschlags, wenn ein Anteil deutlich unter seinem Ziel liegt. */
export const SHARE_DEFICIT_FACTOR_MAX = 2.4;
/**
 * Zuschlag fuer den Fahrer, der eine noch offene Qualitaetsluecke schliesst.
 * Er wirkt nur einmal je Spezialisierung — sobald sie bedient ist, faellt er
 * weg und das Team nimmt wieder den besten verfuegbaren Fahrer.
 */
export const QUALITY_GOAL_FACTOR = 3.0;
/** Abgeschwaechter Zuschlag ausserhalb der angestrebten Spezialisierungen. */
export const QUALITY_GOAL_FACTOR_SECONDARY = 1.6;

export interface SpecTarget {
  specId: number;
  /** Angestrebter Kaderanteil in Prozent. */
  targetShare: number;
}

export interface TeamSpecState {
  /** Zielanteile je Spezialisierung, in Prozent. */
  targetShares: Map<number, number>;
  /** Tatsaechliche Kaderanteile je Spezialisierung, in Prozent. */
  actualShares: Map<number, number>;
  /** Spezialisierungen, in denen das Team schon einen Fahrer ueber der Schwelle hat. */
  coveredSpecIds: Set<number>;
}

/** Die angestrebten Spezialisierungen: die mit den hoechsten Zielanteilen. */
export function resolveGoalSpecIds(targetShares: Map<number, number>): Set<number> {
  const sortiert = [...targetShares.entries()]
    .filter(([specId]) => (TARGET_SPEC_IDS as readonly number[]).includes(specId))
    // Bei gleichem Anteil entscheidet die ID, damit die Auswahl stabil bleibt.
    .sort((a, b) => b[1] - a[1] || a[0] - b[0]);
  const ziele = new Set(sortiert.slice(0, QUALITY_GOAL_SPEC_COUNT).map(([specId]) => specId));
  ziele.add(COBBLE_SPEC_ID);
  return ziele;
}

/**
 * Faktor aus dem Fehlbetrag zwischen Ziel- und Ist-Anteil.
 *
 * Liegt der Kaderanteil einer Spezialisierung auf oder ueber ihrem Ziel, ist
 * der Faktor 1 — das Team nimmt dann wieder den besten Fahrer. Je groesser die
 * Luecke, desto staerker der Zuschlag, hoechstens `SHARE_DEFICIT_FACTOR_MAX`.
 */
export function resolveShareDeficitFactor(specId: number | null, zustand: TeamSpecState): number {
  if (specId == null) return 1;
  const ziel = zustand.targetShares.get(specId);
  if (ziel == null || ziel <= 0) return 1;
  const ist = zustand.actualShares.get(specId) ?? 0;
  const luecke = Math.max(0, Math.min(1, (ziel - ist) / ziel));
  return 1 + (SHARE_DEFICIT_FACTOR_MAX - 1) * luecke;
}

/**
 * Faktor fuer das Qualitaetsziel: gilt nur fuer einen Fahrer, der eine bisher
 * unbesetzte Spezialisierung ueber die Schwelle hebt.
 */
export function resolveQualityGoalFactor(
  specId: number | null,
  overall: number,
  zustand: TeamSpecState,
  goalSpecIds: Set<number>,
): number {
  if (specId == null) return 1;
  if (overall <= SPEC_QUALITY_THRESHOLD) return 1;
  if (zustand.coveredSpecIds.has(specId)) return 1;
  return goalSpecIds.has(specId) ? QUALITY_GOAL_FACTOR : QUALITY_GOAL_FACTOR_SECONDARY;
}

/** Kaderanteile je Spezialisierung in Prozent. */
export function resolveActualShares(kader: Array<{ specId: number | null }>): Map<number, number> {
  const anteile = new Map<number, number>();
  if (kader.length === 0) return anteile;
  const zaehler = new Map<number, number>();
  for (const fahrer of kader) {
    if (fahrer.specId == null) continue;
    zaehler.set(fahrer.specId, (zaehler.get(fahrer.specId) ?? 0) + 1);
  }
  for (const [specId, anzahl] of zaehler) {
    anteile.set(specId, (anzahl / kader.length) * 100);
  }
  return anteile;
}

/** Spezialisierungen, in denen das Team schon einen Fahrer ueber der Schwelle hat. */
export function resolveCoveredSpecIds(
  kader: Array<{ specId: number | null; overall: number }>,
): Set<number> {
  const gedeckt = new Set<number>();
  for (const fahrer of kader) {
    if (fahrer.specId != null && fahrer.overall > SPEC_QUALITY_THRESHOLD) gedeckt.add(fahrer.specId);
  }
  return gedeckt;
}
