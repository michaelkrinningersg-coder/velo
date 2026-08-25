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
  /**
   * Achsenabschnitt fuer den Anteil der ersten Zeitgruppe bei geschlossener
   * Ankunft: anteil = bunchedShareIntercept + BUNCHED_SHARE_SLOPE · ln(D).
   *
   * Vorher ein fester Mittelwert je Profil. Die Messung zeigt aber, dass der
   * Anteil auch *innerhalb* eines Profils mit der Schwierigkeit faellt
   * (Cobble_Hill -0,59, Hilly -0,42, Rolling -0,42): eine leichte Flachetappe
   * bringt ein groesseres Feld geschlossen ins Ziel als eine schwere.
   */
  bunchedShareIntercept: number;
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
  /**
   * Streuung der Reihenfolge, als Vielfaches der Score-Streuung im Feld.
   *
   * Ohne sie faehrt die Quick Simulation dasselbe Rennen wie die Favoriten-
   * liste: gemessen an der Rangkorrelation lag sie auf Flachetappen bei 0,81,
   * die volle Simulation bei 0,47. Zeiten, Gruppen und Abstaende koennen
   * stimmen und es gewinnen trotzdem immer dieselben — genau davor warnt der
   * Entwurf. Gegen die Rangkorrelation gefittet.
   */
  rankNoise: number;
  /**
   * Anteil der Kandidaten eines Massensturzes, den es tatsaechlich trifft.
   * Die volle Simulation entscheidet das ueber die Position (hoechstens 50
   * Meter Abstand); ohne Positionen tritt dieser Anteil an ihre Stelle.
   * Startwert, noch ungemessen. Zeitfahren kennen keine Massenstuerze.
   */
  massCrashInvolvement: number;
  /**
   * Nur Zeitfahren: Rueckstand je Score-Punkt, als Anteil der Siegerzeit.
   * Beim ITT je Fahrer, beim TTT je Mannschaft. Gegen den Rueckstand des
   * letzten Fahrers und die Zahl der Zeitgruppen gefittet; 0 fuer
   * Strassenprofile.
   */
  timeTrialSlope: number;
  /**
   * Nur Zeitfahren: Reststreuung um diese Gerade, ebenfalls als Anteil der
   * Siegerzeit — die Tagesform. Gemessen; 0 fuer Strassenprofile.
   */
  timeTrialNoise: number;
}

/**
 * Steigung der Regime-Ziehung, gemeinsam ueber alle Profile.
 *
 * Aus 53 Strassenetappen und 2.650 Laeufen: eine logistische Anpassung mit
 * Achsenabschnitt je Profil und gemeinsamer Steigung schlaegt sowohl das
 * Modell mit einem einzigen Achsenabschnitt als auch das mit log-Schwierigkeit
 * deutlich (BIC 1863 gegen 2130 und 2218).
 */
export const BUNCH_SLOPE = -3.270;

/**
 * Steigung des Anteils im zerfallenen Regime auf den natuerlichen Logarithmus
 * der Schwierigkeit je Kilometer.
 *
 * Ein gepoolter Mittelwert reichte nicht: er sagte fuer alle Bergprofile 0,092
 * voraus, beobachtet waren 0,022 bis 0,034. Achsenabschnitt je Profil plus
 * log-Schwierigkeit erklaert 54 % der Streuung zwischen den Etappen, ein
 * gepoolter Mittelwert 0 %.
 */
export const SPLIT_SHARE_SLOPE = -0.0634;

/**
 * Dieselbe Steigung fuer das geschlossene Regime. Je schwerer die Etappe,
 * desto kleiner auch die geschlossen ankommende Gruppe.
 */
export const BUNCHED_SHARE_SLOPE = -0.0300;

/**
 * Relative Streuung des Anteils innerhalb einer Etappe, je Regime. Aus ihr und
 * dem Mittelwert werden die Beta-Parameter der Ziehung bestimmt.
 */
export const BUNCHED_SHARE_RELATIVE_SD = 0.109;
export const SPLIT_SHARE_RELATIVE_SD = 1.077;

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
export const TAIL_SHAPE_EPSILON = 0.108;
export const TAIL_SHAPE_EXPONENT = 0.65;

/**
 * Anzahl Zeitgruppen je Regime (Median, 10./90. Perzentil) — Kontrollgroesse
 * fuer die Kalibrierung des Abstandsmodells, kein Eingabeparameter.
 */
export const TIME_GROUP_COUNT_REFERENCE = {
  bunched: { p10: 8, median: 15, p90: 24 },
  split: { p10: 14, median: 45, p90: 123 },
} as const;

/**
 * Werte je Profil. `baseSpeedKmh`, `bunchIntercept`, `bunchedShareIntercept`,
 * `splitShareIntercept` und `tailGapPerKm` sind gemessen — die Geschwindigkeit
 * und die Kurvenhoehe als Mittel aus zwei vollstaendigen Referenzlaeufen.
 * `noiseSigma`, `incidentLossMultiplier`, `severeDnfChance` und
 * `breakawayShrinkExponent` sind weiterhin geschaetzte Startwerte.
 */
export const DEFAULT_QUICK_SIM_PROFILES: Record<StageProfile, QuickSimProfileParameters> = {
  Flat:             { baseSpeedKmh: 44.01, bunchIntercept: 1.63, bunchedShareIntercept: 0.8813, splitShareIntercept: 0.0054, tailGapPerKm: 7.20, tailGroupSize: 8.44, noiseSigma: 0.15, incidentLossMultiplier: 1.20, severeDnfChance: 0.25, breakawayShrinkExponent: 1.50, timeTrialSlope: 0.00000, timeTrialNoise: 0.0000, massCrashInvolvement: 0.35, rankNoise: 1.41 },
  Rolling:          { baseSpeedKmh: 42.49, bunchIntercept: 2.38, bunchedShareIntercept: 0.7527, splitShareIntercept: 0.2947, tailGapPerKm: 8.11, tailGroupSize: 4.18, noiseSigma: 0.18, incidentLossMultiplier: 1.40, severeDnfChance: 0.25, breakawayShrinkExponent: 1.50, timeTrialSlope: 0.00000, timeTrialNoise: 0.0000, massCrashInvolvement: 0.35, rankNoise: 1.41 },
  Hilly:            { baseSpeedKmh: 42.83, bunchIntercept: 1.66, bunchedShareIntercept: 0.7860, splitShareIntercept: 0.2417, tailGapPerKm: 8.58, tailGroupSize: 4.15, noiseSigma: 0.20, incidentLossMultiplier: 1.70, severeDnfChance: 0.28, breakawayShrinkExponent: 1.50, timeTrialSlope: 0.00000, timeTrialNoise: 0.0000, massCrashInvolvement: 0.35, rankNoise: 1.29 },
  Hilly_Difficult:  { baseSpeedKmh: 41.41, bunchIntercept: 1.13, bunchedShareIntercept: 0.6951, splitShareIntercept: 0.0886, tailGapPerKm: 9.93, tailGroupSize: 3.96, noiseSigma: 0.22, incidentLossMultiplier: 2.00, severeDnfChance: 0.30, breakawayShrinkExponent: 1.50, timeTrialSlope: 0.00000, timeTrialNoise: 0.0000, massCrashInvolvement: 0.35, rankNoise: 1.02 },
  Cobble:           { baseSpeedKmh: 46.08, bunchIntercept: -3.03, bunchedShareIntercept: 0.5725, splitShareIntercept: -0.0112, tailGapPerKm: 13.08, tailGroupSize: 5.42, noiseSigma: 0.30, incidentLossMultiplier: 2.40, severeDnfChance: 0.35, breakawayShrinkExponent: 1.40, timeTrialSlope: 0.00000, timeTrialNoise: 0.0000, massCrashInvolvement: 0.35, rankNoise: 0.38 },
  Cobble_Hill:      { baseSpeedKmh: 46.85, bunchIntercept: 1.16, bunchedShareIntercept: 0.6661, splitShareIntercept: 0.1715, tailGapPerKm: 8.35, tailGroupSize: 5.25, noiseSigma: 0.30, incidentLossMultiplier: 2.40, severeDnfChance: 0.35, breakawayShrinkExponent: 1.40, timeTrialSlope: 0.00000, timeTrialNoise: 0.0000, massCrashInvolvement: 0.35, rankNoise: 0.84 },
  Medium_Mountain:  { baseSpeedKmh: 39.83, bunchIntercept: -1.49, bunchedShareIntercept: 0.5717, splitShareIntercept: 0.1008, tailGapPerKm: 10.64, tailGroupSize: 4.38, noiseSigma: 0.22, incidentLossMultiplier: 2.20, severeDnfChance: 0.30, breakawayShrinkExponent: 1.60, timeTrialSlope: 0.00000, timeTrialNoise: 0.0000, massCrashInvolvement: 0.35, rankNoise: 0.79 },
  Mountain:         { baseSpeedKmh: 36.91, bunchIntercept: -6.24, bunchedShareIntercept: 0.7000, splitShareIntercept: 0.1099, tailGapPerKm: 15.50, tailGroupSize: 1.85, noiseSigma: 0.24, incidentLossMultiplier: 2.60, severeDnfChance: 0.30, breakawayShrinkExponent: 1.70, timeTrialSlope: 0.00000, timeTrialNoise: 0.0000, massCrashInvolvement: 0.35, rankNoise: 0.51 },
  High_Mountain:    { baseSpeedKmh: 35.85, bunchIntercept: -5.18, bunchedShareIntercept: 0.7000, splitShareIntercept: 0.0517, tailGapPerKm: 21.04, tailGroupSize: 2.25, noiseSigma: 0.26, incidentLossMultiplier: 3.00, severeDnfChance: 0.32, breakawayShrinkExponent: 1.80, timeTrialSlope: 0.00000, timeTrialNoise: 0.0000, massCrashInvolvement: 0.35, rankNoise: 0.26 },
  ITT:              { baseSpeedKmh: 45.94, bunchIntercept: 0.00, bunchedShareIntercept: 0.7000, splitShareIntercept: 0.0000, tailGapPerKm: 10.70, tailGroupSize: 2.45, noiseSigma: 0.10, incidentLossMultiplier: 1.00, severeDnfChance: 0.20, breakawayShrinkExponent: 1.00, timeTrialSlope: 0.00300, timeTrialNoise: 0.0300, massCrashInvolvement: 0.00, rankNoise: 0.35 },
  TTT:              { baseSpeedKmh: 55.45, bunchIntercept: 0.00, bunchedShareIntercept: 0.7000, splitShareIntercept: 0.0000, tailGapPerKm: 23.22, tailGroupSize: 6.43, noiseSigma: 0.08, incidentLossMultiplier: 1.00, severeDnfChance: 0.20, breakawayShrinkExponent: 1.00, timeTrialSlope: 0.01300, timeTrialNoise: 0.0350, massCrashInvolvement: 0.00, rankNoise: 0.35 },
};

/** Zeile der Tabelle `quick_sim_profiles`, wie sie aus SQLite kommt. */
export interface QuickSimProfileRow {
  profile: string;
  base_speed_kmh: number;
  bunch_intercept: number;
  bunched_share_intercept: number;
  split_share_intercept: number;
  tail_gap_per_km: number;
  tail_group_size: number;
  noise_sigma: number;
  incident_loss_multiplier: number;
  severe_dnf_chance: number;
  breakaway_shrink_exponent: number;
  time_trial_slope: number;
  time_trial_noise: number;
  mass_crash_involvement: number;
  rank_noise: number;
}

/**
 * Uebersetzt eine Datenbankzeile in Parameter.
 *
 * Jeder Wert faellt einzeln auf die Vorgabe zurueck, wenn er fehlt oder keine
 * Zahl ist. Das ist kein Uebereifer: eine Zeile aus einem aelteren Spielstand
 * hat weniger Spalten, und `undefined` in einer Rechnung ergibt `NaN` — das
 * pflanzt sich lautlos bis in eine Gruppengroesse fort, die dann keine ist.
 * Genau das ist beim Umbenennen einer Spalte passiert.
 */
export function mapQuickSimProfileRow(
  row: QuickSimProfileRow,
  fallback: QuickSimProfileParameters = DEFAULT_QUICK_SIM_PROFILES[row.profile as StageProfile]
    ?? DEFAULT_QUICK_SIM_PROFILES.Flat,
): QuickSimProfileParameters {
  const value = (candidate: number | undefined, replacement: number): number =>
    (typeof candidate === 'number' && Number.isFinite(candidate) ? candidate : replacement);
  return {
    baseSpeedKmh: value(row.base_speed_kmh, fallback.baseSpeedKmh),
    bunchIntercept: value(row.bunch_intercept, fallback.bunchIntercept),
    bunchedShareIntercept: value(row.bunched_share_intercept, fallback.bunchedShareIntercept),
    splitShareIntercept: value(row.split_share_intercept, fallback.splitShareIntercept),
    tailGapPerKm: value(row.tail_gap_per_km, fallback.tailGapPerKm),
    tailGroupSize: value(row.tail_group_size, fallback.tailGroupSize),
    noiseSigma: value(row.noise_sigma, fallback.noiseSigma),
    incidentLossMultiplier: value(row.incident_loss_multiplier, fallback.incidentLossMultiplier),
    severeDnfChance: value(row.severe_dnf_chance, fallback.severeDnfChance),
    breakawayShrinkExponent: value(row.breakaway_shrink_exponent, fallback.breakawayShrinkExponent),
    timeTrialSlope: value(row.time_trial_slope, fallback.timeTrialSlope),
    timeTrialNoise: value(row.time_trial_noise, fallback.timeTrialNoise),
    massCrashInvolvement: value(row.mass_crash_involvement, fallback.massCrashInvolvement),
    rankNoise: value(row.rank_noise, fallback.rankNoise),
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
      const profile = row.profile as StageProfile;
      result[profile] = mapQuickSimProfileRow(row, DEFAULT_QUICK_SIM_PROFILES[profile]);
    }
  }
  return result;
}
