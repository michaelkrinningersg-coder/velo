/**
 * Parameter der Quick Simulation je Etappenprofil.
 *
 * Die Werte liegen als Daten vor (`data/csv/quick_sim_profiles.csv` →
 * Tabelle `quick_sim_profiles`), weil sie gegen die Instant-Simulation
 * gefittet werden und ohne Rebuild anpassbar bleiben muessen. Die Konstanten
 * hier sind nur der Notnagel fuer den Fall, dass die Tabelle fehlt oder leer
 * ist — sie halten die Simulation lauffaehig, sind aber nicht kalibriert.
 */

import type { StageProfile } from './types';

export interface QuickSimProfileParameters {
  /** Referenzgeschwindigkeit fuer die Siegerzeit in km/h. */
  baseSpeedKmh: number;
  /**
   * Achsenabschnitt der Regime-Ziehung. Zusammen mit BUNCH_SLOPE und der
   * Schwierigkeit je Kilometer bestimmt er, wie wahrscheinlich das Feld
   * geschlossen ankommt. Gemessen, nicht geschaetzt.
   */
  bunchIntercept: number;
  /** Mittlerer Anteil der ersten Zeitgruppe bei geschlossener Ankunft. Gemessen. */
  bunchedShareMean: number;
  /**
   * Achsenabschnitt fuer den Anteil bei zerfallenem Feld:
   * anteil = splitShareIntercept + SPLIT_SHARE_SLOPE · ln(D). Gemessen.
   */
  splitShareIntercept: number;
  /**
   * Rueckstand des letzten Fahrers in Sekunden je Kilometer. Der eine Wert,
   * der die ganze Rueckstandskurve hinter der ersten Gruppe skaliert. Gemessen.
   */
  tailGapPerKm: number;
  /**
   * Mittlere Zahl Fahrer je Zeitgruppe im Feld hinter der ersten Gruppe.
   * Das abgehaengte Ende faehrt nicht einzeln, sondern in kleinen Gruppen.
   *
   * Gegen die Zahl der Zeitgruppen gefittet, nicht abgelesen: der Median des
   * Verhaeltnisses "Fahrer je Gruppe" ueber die Laeufe trifft die Gruppenzahl
   * nicht (Flat 2,00 abgelesen gegen 4,83 gefittet). Fuer ITT und TTT sind es
   * Platzhalter aus dem gepoolten Verhaeltnis — beide bekommen ein eigenes
   * Modell.
   */
  tailGroupSize: number;
  /** Streuung des Rueckstands. Regelt die Vorhersagbarkeit des Ergebnisses. */
  noiseSigma: number;
  /** Faktor auf den Zeitverlust eines Vorfalls. */
  incidentLossMultiplier: number;
  /** Wahrscheinlichkeit, dass ein schwerer Sturz zur Aufgabe fuehrt. */
  severeDnfChance: number;
  /** Exponent der Ausduennung der Ausreissergruppe bis zum Einholpunkt. */
  breakawayShrinkExponent: number;
}

/**
 * Steigung der Regime-Ziehung, gemeinsam ueber alle Profile.
 *
 * Aus 53 Strassenetappen und 2.650 Laeufen: eine logistische Anpassung mit
 * Achsenabschnitt je Profil und gemeinsamer Steigung schlaegt sowohl das
 * Modell mit einem einzigen Achsenabschnitt als auch das mit log-Schwierigkeit
 * deutlich (BIC 1863 gegen 2130 und 2218).
 */
export const BUNCH_SLOPE = -5.869;

/**
 * Steigung des Anteils im zerfallenen Regime auf den natuerlichen Logarithmus
 * der Schwierigkeit je Kilometer.
 *
 * Ein gepoolter Mittelwert reichte nicht: er sagte fuer alle Bergprofile 0,092
 * voraus, beobachtet waren 0,022 bis 0,034. Achsenabschnitt je Profil plus
 * log-Schwierigkeit erklaert 54 % der Streuung zwischen den Etappen, ein
 * gepoolter Mittelwert 0 %.
 */
export const SPLIT_SHARE_SLOPE = -0.0673;

/**
 * Relative Streuung des Anteils innerhalb einer Etappe, je Regime. Aus ihr und
 * dem Mittelwert werden die Beta-Parameter der Ziehung bestimmt.
 */
export const BUNCHED_SHARE_RELATIVE_SD = 0.123;
export const SPLIT_SHARE_RELATIVE_SD = 0.694;

/**
 * Form der Rueckstandskurve hinter der ersten Zeitgruppe.
 *
 *   rueckstand(v) = tailGapPerKm · km · TAIL_SHAPE_EPSILON · v^TAIL_SHAPE_EXPONENT
 *                                       / (1 − v + TAIL_SHAPE_EPSILON)
 *
 * `v` ist die Position hinter der ersten Gruppe: 0 direkt dahinter, 1 beim
 * letzten Fahrer. Bei v = 1 ergibt die Kurve genau `tailGapPerKm`.
 *
 * Der erste Entwurf leitete den Rueckstand aus dem Score-Abstand zum
 * Vordermann ab. Die Messung widerlegt das: auf einer Flachetappe liegt Rang
 * 100 bei 0,035 Sekunden je Kilometer zurueck, der letzte Fahrer bei 6,5 —
 * Faktor 185. So einen Sprung erzeugt kein Score-Abstand, denn die Scores
 * springen dort nicht. Das Ende des Feldes wird abgehaengt, und das haengt an
 * der Position im Feld, nicht an der Staerke des Vordermanns.
 *
 * Auf die Position hinter der ersten Gruppe normiert, fallen die Kurven aller
 * neun Strassenprofile zusammen — deshalb sind beide Formparameter gemeinsam
 * und nur die Hoehe (`tailGapPerKm`) profilabhaengig. Aus 11.601 Messpunkten
 * ueber 53 Etappen.
 */
export const TAIL_SHAPE_EPSILON = 0.081;
export const TAIL_SHAPE_EXPONENT = 0.50;

/**
 * Anzahl Zeitgruppen je Regime (Median, 10./90. Perzentil) — Kontrollgroesse
 * fuer die Kalibrierung des Abstandsmodells, kein Eingabeparameter.
 */
export const TIME_GROUP_COUNT_REFERENCE = {
  bunched: { p10: 8, median: 15, p90: 24 },
  split: { p10: 14, median: 45, p90: 123 },
} as const;

/**
 * Werte je Profil. `baseSpeedKmh`, `bunchIntercept`, `bunchedShareMean`,
 * `splitShareIntercept` und `tailGapPerKm` sind gemessen — die Geschwindigkeit
 * und die Kurvenhoehe als Mittel aus zwei vollstaendigen Referenzlaeufen.
 * `noiseSigma`, `incidentLossMultiplier`, `severeDnfChance` und
 * `breakawayShrinkExponent` sind weiterhin geschaetzte Startwerte.
 */
export const DEFAULT_QUICK_SIM_PROFILES: Record<StageProfile, QuickSimProfileParameters> = {
  Flat:            { baseSpeedKmh: 44.59, bunchIntercept: 1.57, bunchedShareMean: 0.8575, splitShareIntercept: -0.0861, tailGapPerKm: 6.92, tailGroupSize: 4.83, noiseSigma: 0.15, incidentLossMultiplier: 1.2, severeDnfChance: 0.25, breakawayShrinkExponent: 1.5 },
  Rolling:         { baseSpeedKmh: 43.34, bunchIntercept: 3.02, bunchedShareMean: 0.7043, splitShareIntercept: 0.1522, tailGapPerKm: 8.29, tailGroupSize: 4.58, noiseSigma: 0.18, incidentLossMultiplier: 1.4, severeDnfChance: 0.25, breakawayShrinkExponent: 1.5 },
  Hilly:           { baseSpeedKmh: 44.03, bunchIntercept: 2.0, bunchedShareMean: 0.7862, splitShareIntercept: 0.0915, tailGapPerKm: 8.56, tailGroupSize: 7.26, noiseSigma: 0.20, incidentLossMultiplier: 1.7, severeDnfChance: 0.28, breakawayShrinkExponent: 1.5 },
  Hilly_Difficult: { baseSpeedKmh: 41.76, bunchIntercept: 2.73, bunchedShareMean: 0.7335, splitShareIntercept: 0.0247, tailGapPerKm: 9.78, tailGroupSize: 4.11, noiseSigma: 0.22, incidentLossMultiplier: 2.0, severeDnfChance: 0.30, breakawayShrinkExponent: 1.5 },
  Cobble:          { baseSpeedKmh: 47.30, bunchIntercept: -4.03, bunchedShareMean: 0.7, splitShareIntercept: -0.0628, tailGapPerKm: 12.59, tailGroupSize: 5.44, noiseSigma: 0.30, incidentLossMultiplier: 2.4, severeDnfChance: 0.35, breakawayShrinkExponent: 1.4 },
  Cobble_Hill:     { baseSpeedKmh: 47.39, bunchIntercept: 1.64, bunchedShareMean: 0.6237, splitShareIntercept: 0.1757, tailGapPerKm: 8.07, tailGroupSize: 5.37, noiseSigma: 0.30, incidentLossMultiplier: 2.4, severeDnfChance: 0.35, breakawayShrinkExponent: 1.4 },
  Medium_Mountain: { baseSpeedKmh: 40.97, bunchIntercept: -2.69, bunchedShareMean: 0.7, splitShareIntercept: 0.0632, tailGapPerKm: 10.39, tailGroupSize: 4.44, noiseSigma: 0.22, incidentLossMultiplier: 2.2, severeDnfChance: 0.30, breakawayShrinkExponent: 1.6 },
  Mountain:        { baseSpeedKmh: 38.39, bunchIntercept: -1.33, bunchedShareMean: 0.7, splitShareIntercept: 0.0533, tailGapPerKm: 13.71, tailGroupSize: 2.96, noiseSigma: 0.24, incidentLossMultiplier: 2.6, severeDnfChance: 0.30, breakawayShrinkExponent: 1.7 },
  High_Mountain:   { baseSpeedKmh: 38.25, bunchIntercept: -0.98, bunchedShareMean: 0.7, splitShareIntercept: 0.0558, tailGapPerKm: 16.28, tailGroupSize: 2.57, noiseSigma: 0.26, incidentLossMultiplier: 3.0, severeDnfChance: 0.32, breakawayShrinkExponent: 1.8 },
  ITT:             { baseSpeedKmh: 50.14, bunchIntercept: 0.0, bunchedShareMean: 0.7, splitShareIntercept: 0.0, tailGapPerKm: 12.54, tailGroupSize: 2.45, noiseSigma: 0.10, incidentLossMultiplier: 1.0, severeDnfChance: 0.20, breakawayShrinkExponent: 1.0 },
  TTT:             { baseSpeedKmh: 57.66, bunchIntercept: 0.0, bunchedShareMean: 0.7, splitShareIntercept: 0.0, tailGapPerKm: 21.94, tailGroupSize: 6.43, noiseSigma: 0.08, incidentLossMultiplier: 1.0, severeDnfChance: 0.20, breakawayShrinkExponent: 1.0 },
};

/** Zeile der Tabelle `quick_sim_profiles`, wie sie aus SQLite kommt. */
export interface QuickSimProfileRow {
  profile: string;
  base_speed_kmh: number;
  bunch_intercept: number;
  bunched_share_mean: number;
  split_share_intercept: number;
  tail_gap_per_km: number;
  tail_group_size: number;
  noise_sigma: number;
  incident_loss_multiplier: number;
  severe_dnf_chance: number;
  breakaway_shrink_exponent: number;
}

export function mapQuickSimProfileRow(row: QuickSimProfileRow): QuickSimProfileParameters {
  return {
    baseSpeedKmh: row.base_speed_kmh,
    bunchIntercept: row.bunch_intercept,
    bunchedShareMean: row.bunched_share_mean,
    splitShareIntercept: row.split_share_intercept,
    tailGapPerKm: row.tail_gap_per_km,
    tailGroupSize: row.tail_group_size,
    noiseSigma: row.noise_sigma,
    incidentLossMultiplier: row.incident_loss_multiplier,
    severeDnfChance: row.severe_dnf_chance,
    breakawayShrinkExponent: row.breakaway_shrink_exponent,
  };
}

/**
 * Baut die Parametertabelle aus Datenbankzeilen und faellt je Profil einzeln
 * auf die Vorgabe zurueck. Bewusst je Profil und nicht als Ganzes: eine
 * unvollstaendige Tabelle — etwa nach dem Hinzufuegen eines neuen Profils —
 * soll die vorhandenen Werte nicht entwerten.
 */
export function buildQuickSimProfileMap(
  rows: readonly QuickSimProfileRow[],
): Record<StageProfile, QuickSimProfileParameters> {
  const result = { ...DEFAULT_QUICK_SIM_PROFILES };
  for (const row of rows) {
    if (row.profile in result) {
      result[row.profile as StageProfile] = mapQuickSimProfileRow(row);
    }
  }
  return result;
}
