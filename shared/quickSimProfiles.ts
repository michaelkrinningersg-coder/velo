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
  /** Sekunden Rueckstand je Score-Punkt und Kilometer. */
  gapFactor: number;
  /** Exponent auf den Score-Abstand. Groesser als 1 zieht das Feld hinten auseinander. */
  gapExponent: number;
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
 * Verteilung des Anteils der ersten Zeitgruppe an den Finishern, getrennt nach
 * Regime. Beta-Verteilungen aus den gemessenen Momenten (Momentenmethode).
 *
 *   geschlossen: Mittel 0,772  sd 0,124   (n = 795 Laeufe)
 *   zerfallen:   Mittel 0,092  sd 0,124   (n = 1.855 Laeufe)
 */
export const BUNCHED_SHARE_BETA = { alpha: 8.065, beta: 2.382 } as const;
export const SPLIT_SHARE_BETA = { alpha: 0.408, beta: 4.025 } as const;

/**
 * Anzahl Zeitgruppen je Regime (Median, 10./90. Perzentil) — Kontrollgroesse
 * fuer die Kalibrierung des Abstandsmodells, kein Eingabeparameter.
 */
export const TIME_GROUP_COUNT_REFERENCE = {
  bunched: { p10: 8, median: 15, p90: 24 },
  split: { p10: 14, median: 45, p90: 123 },
} as const;

/**
 * Werte je Profil. `baseSpeedKmh` und `bunchIntercept` sind gemessen; die
 * uebrigen sind weiterhin geschaetzte Startwerte fuer den Fit.
 */
export const DEFAULT_QUICK_SIM_PROFILES: Record<StageProfile, QuickSimProfileParameters> = {
  Flat:            { baseSpeedKmh: 44.7, bunchIntercept: 1.57, gapFactor: 0.060, gapExponent: 1.3, noiseSigma: 0.15, incidentLossMultiplier: 1.2, severeDnfChance: 0.25, breakawayShrinkExponent: 1.5 },
  Rolling:         { baseSpeedKmh: 43.7, bunchIntercept: 3.02, gapFactor: 0.100, gapExponent: 1.3, noiseSigma: 0.18, incidentLossMultiplier: 1.4, severeDnfChance: 0.25, breakawayShrinkExponent: 1.5 },
  Hilly:           { baseSpeedKmh: 44.4, bunchIntercept: 2.0, gapFactor: 0.180, gapExponent: 1.4, noiseSigma: 0.20, incidentLossMultiplier: 1.7, severeDnfChance: 0.28, breakawayShrinkExponent: 1.5 },
  Hilly_Difficult: { baseSpeedKmh: 41.6, bunchIntercept: 2.73, gapFactor: 0.260, gapExponent: 1.4, noiseSigma: 0.22, incidentLossMultiplier: 2.0, severeDnfChance: 0.30, breakawayShrinkExponent: 1.5 },
  Cobble:          { baseSpeedKmh: 47.1, bunchIntercept: -4.03, gapFactor: 0.300, gapExponent: 1.5, noiseSigma: 0.30, incidentLossMultiplier: 2.4, severeDnfChance: 0.35, breakawayShrinkExponent: 1.4 },
  Cobble_Hill:     { baseSpeedKmh: 47.3, bunchIntercept: 1.64, gapFactor: 0.300, gapExponent: 1.5, noiseSigma: 0.30, incidentLossMultiplier: 2.4, severeDnfChance: 0.35, breakawayShrinkExponent: 1.4 },
  Medium_Mountain: { baseSpeedKmh: 40.8, bunchIntercept: -2.69, gapFactor: 0.340, gapExponent: 1.5, noiseSigma: 0.22, incidentLossMultiplier: 2.2, severeDnfChance: 0.30, breakawayShrinkExponent: 1.6 },
  Mountain:        { baseSpeedKmh: 38.5, bunchIntercept: -1.33, gapFactor: 0.450, gapExponent: 1.6, noiseSigma: 0.24, incidentLossMultiplier: 2.6, severeDnfChance: 0.30, breakawayShrinkExponent: 1.7 },
  High_Mountain:   { baseSpeedKmh: 39.0, bunchIntercept: -0.98, gapFactor: 0.580, gapExponent: 1.7, noiseSigma: 0.26, incidentLossMultiplier: 3.0, severeDnfChance: 0.32, breakawayShrinkExponent: 1.8 },
  ITT:             { baseSpeedKmh: 51.7, bunchIntercept: 0.0, gapFactor: 0.700, gapExponent: 1.0, noiseSigma: 0.10, incidentLossMultiplier: 1.0, severeDnfChance: 0.20, breakawayShrinkExponent: 1.0 },
  TTT:             { baseSpeedKmh: 57.9, bunchIntercept: 0.0, gapFactor: 0.700, gapExponent: 1.0, noiseSigma: 0.08, incidentLossMultiplier: 1.0, severeDnfChance: 0.20, breakawayShrinkExponent: 1.0 },
};

/** Zeile der Tabelle `quick_sim_profiles`, wie sie aus SQLite kommt. */
export interface QuickSimProfileRow {
  profile: string;
  base_speed_kmh: number;
  bunch_intercept: number;
  gap_factor: number;
  gap_exponent: number;
  noise_sigma: number;
  incident_loss_multiplier: number;
  severe_dnf_chance: number;
  breakaway_shrink_exponent: number;
}

export function mapQuickSimProfileRow(row: QuickSimProfileRow): QuickSimProfileParameters {
  return {
    baseSpeedKmh: row.base_speed_kmh,
    bunchIntercept: row.bunch_intercept,
    gapFactor: row.gap_factor,
    gapExponent: row.gap_exponent,
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
