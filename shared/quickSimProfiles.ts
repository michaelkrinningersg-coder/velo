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
  /** Score-Abstand, ab dem eine neue Zeitgruppe beginnt. 0 = keine Gruppen. */
  groupThreshold: number;
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
 * Nicht kalibrierte Startwerte. Aus dem gewuenschten Verhalten abgeleitet,
 * nicht gemessen — sie sind der Ausgangspunkt des Fits, nicht sein Ergebnis.
 */
export const DEFAULT_QUICK_SIM_PROFILES: Record<StageProfile, QuickSimProfileParameters> = {
  Flat:            { baseSpeedKmh: 45.3, groupThreshold: 3.0, gapFactor: 0.060, gapExponent: 1.3, noiseSigma: 0.15, incidentLossMultiplier: 1.2, severeDnfChance: 0.25, breakawayShrinkExponent: 1.5 },
  Rolling:         { baseSpeedKmh: 43.7, groupThreshold: 2.2, gapFactor: 0.100, gapExponent: 1.3, noiseSigma: 0.18, incidentLossMultiplier: 1.4, severeDnfChance: 0.25, breakawayShrinkExponent: 1.5 },
  Hilly:           { baseSpeedKmh: 42.4, groupThreshold: 1.6, gapFactor: 0.180, gapExponent: 1.4, noiseSigma: 0.20, incidentLossMultiplier: 1.7, severeDnfChance: 0.28, breakawayShrinkExponent: 1.5 },
  Hilly_Difficult: { baseSpeedKmh: 43.6, groupThreshold: 1.2, gapFactor: 0.260, gapExponent: 1.4, noiseSigma: 0.22, incidentLossMultiplier: 2.0, severeDnfChance: 0.30, breakawayShrinkExponent: 1.5 },
  Cobble:          { baseSpeedKmh: 48.2, groupThreshold: 1.0, gapFactor: 0.300, gapExponent: 1.5, noiseSigma: 0.30, incidentLossMultiplier: 2.4, severeDnfChance: 0.35, breakawayShrinkExponent: 1.4 },
  Cobble_Hill:     { baseSpeedKmh: 48.1, groupThreshold: 1.0, gapFactor: 0.300, gapExponent: 1.5, noiseSigma: 0.30, incidentLossMultiplier: 2.4, severeDnfChance: 0.35, breakawayShrinkExponent: 1.4 },
  Medium_Mountain: { baseSpeedKmh: 42.7, groupThreshold: 0.9, gapFactor: 0.340, gapExponent: 1.5, noiseSigma: 0.22, incidentLossMultiplier: 2.2, severeDnfChance: 0.30, breakawayShrinkExponent: 1.6 },
  Mountain:        { baseSpeedKmh: 38.6, groupThreshold: 0.6, gapFactor: 0.450, gapExponent: 1.6, noiseSigma: 0.24, incidentLossMultiplier: 2.6, severeDnfChance: 0.30, breakawayShrinkExponent: 1.7 },
  High_Mountain:   { baseSpeedKmh: 38.2, groupThreshold: 0.4, gapFactor: 0.580, gapExponent: 1.7, noiseSigma: 0.26, incidentLossMultiplier: 3.0, severeDnfChance: 0.32, breakawayShrinkExponent: 1.8 },
  ITT:             { baseSpeedKmh: 43.4, groupThreshold: 0.0, gapFactor: 0.700, gapExponent: 1.0, noiseSigma: 0.10, incidentLossMultiplier: 1.0, severeDnfChance: 0.20, breakawayShrinkExponent: 1.0 },
  TTT:             { baseSpeedKmh: 55.3, groupThreshold: 0.0, gapFactor: 0.700, gapExponent: 1.0, noiseSigma: 0.08, incidentLossMultiplier: 1.0, severeDnfChance: 0.20, breakawayShrinkExponent: 1.0 },
};

/** Zeile der Tabelle `quick_sim_profiles`, wie sie aus SQLite kommt. */
export interface QuickSimProfileRow {
  profile: string;
  base_speed_kmh: number;
  group_threshold: number;
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
    groupThreshold: row.group_threshold,
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
