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
 * Abweichende Streuung der Ziehung im zerfallenen Regime, je Profil.
 *
 * Der gemessene Wert 1,077 ist groesser als 1 und macht die Beta-Ziehung
 * damit zweigipfelig: sie wirft ueberwiegend sehr kleine Anteile aus und
 * gelegentlich einen sehr grossen. Fuer die Bergprofile ist der lange
 * Schwanz zu lang — dort soll die erste Zeitgruppe auch im oberen Zehntel
 * noch eine Gruppe sein und nicht das halbe Feld.
 *
 * Profile ohne Eintrag behalten den gemessenen Wert.
 */
export const SPLIT_SHARE_RELATIVE_SD_BY_PROFILE: Partial<Record<StageProfile, number>> = {
  Hilly_Difficult: 0.85,
  Medium_Mountain: 0.85,
  Mountain: 0.45,
  High_Mountain: 0.80,
};

export function resolveSplitShareRelativeSd(profile?: StageProfile | null): number {
  return (profile != null ? SPLIT_SHARE_RELATIVE_SD_BY_PROFILE[profile] : undefined) ?? SPLIT_SHARE_RELATIVE_SD;
}

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
 * Abweichende Kurvenformen je Profil.
 *
 * Die gemessene Kurve ist ein Referenzwert, keine Spielentscheidung — und als
 * Spielgroesse passt sie an drei Stellen nicht:
 *
 * `sform` fuer Mountain und High_Mountain. Die gemessene Kurve trennt das Feld
 * am Berg zu wenig: ueber acht Bergetappen eines Giro verliert Rang 20
 * zusammen 5:26 und Rang 50 16:35. Damit landen Fahrer mit Bergwerten um 70 —
 * Helfer und Wassertraeger — in den Top 10 der Gesamtwertung. Angehoben werden
 * muss dafuer die *Mitte* der Kurve, nicht ihr Ende, und genau das gibt die
 * gemessene Familie `eps v^p / (1 - v + eps)` nicht her: sie ist ueberall
 * konvex, mehr Mitte gab es dort nur zusammen mit mehr Anfang.
 *
 * `sform` mit flacheren Parametern fuer Medium_Mountain. Dieselbe Familie,
 * aber frueh kippend und dann saettigend: das Feld faellt am Anstieg
 * auseinander, das abgehaengte Ende verliert aber nicht Stunden.
 *
 * `gemessen` mit kleinerem `eps` fuer Flat, Rolling und Hilly. Dort soll die
 * Kurve umgekehrt *spaeter* wegbrechen als gemessen: bis weit ins Feld hinein
 * passiert fast nichts, und erst das wirklich abgehaengte Ende verliert. Ein
 * kleineres `eps` schiebt genau das nach hinten.
 *
 * Beide Familien sind bei v = 0 exakt 0 und bei v = 1 exakt 1, unabhaengig von
 * ihren Parametern — der Rueckstand des letzten Fahrers bleibt also immer
 * `tailGapPerKm` und damit auch sein Verhaeltnis zum Zeitlimit. Die Form
 * verteilt nur um, wer davon wieviel abbekommt.
 *
 *   gemessen   f(v) = w v^e / (1 - v + w)
 *   sform      f(v) = v^e / (v^e + w (1 - v))
 *
 * Bei `sform` ist der lineare Term bewusst linear: mit einem Exponenten unter
 * 1 an dieser Stelle entstuende zwischen dem vorletzten und dem letzten Fahrer
 * eine Stufe von mehreren Minuten.
 *
 * Das sind Spielentscheidungen, keine Messungen — anders als der Eintrag fuer
 * die uebrigen Profile, der aus dem Referenzlauf stammt.
 */
export type TailShapeKind = 'gemessen' | 'sform';

export interface TailShapeParameters {
  kind: TailShapeKind;
  /** Exponent auf die Position — je groesser, desto enger vorne. */
  exponent: number;
  /** Gewicht des Nennerterms — steuert, wann die Kurve kippt. */
  weight: number;
}

/** Die gemessene Form, gueltig fuer jedes Profil ohne eigenen Eintrag. */
export const DEFAULT_TAIL_SHAPE: TailShapeParameters = {
  kind: 'gemessen',
  exponent: TAIL_SHAPE_EXPONENT,
  weight: TAIL_SHAPE_EPSILON,
};

export const TAIL_SHAPE_BY_PROFILE: Partial<Record<StageProfile, TailShapeParameters>> = {
  // Flach und rollend: eingestellte Werte, nicht aus echten Rennen abgeleitet.
  Flat: { kind: 'gemessen', exponent: 0.65, weight: 0.020 },
  Rolling: { kind: 'gemessen', exponent: 0.65, weight: 0.020 },
  // Ab hier an 568 echte Grand-Tour-Etappen angepasst — siehe
  // MEASURED_STAGE_GAP_MODEL. Restfehler gegen die gemessene Medianform
  // 0,014 bis 0,023, bei Hilly 0,070.
  Hilly: { kind: 'sform', exponent: 0.644, weight: 2.939 },
  Hilly_Difficult: { kind: 'sform', exponent: 1.243, weight: 0.894 },
  Medium_Mountain: { kind: 'sform', exponent: 1.274, weight: 0.648 },
  Mountain: { kind: 'sform', exponent: 1.434, weight: 0.399 },
  High_Mountain: { kind: 'sform', exponent: 1.513, weight: 0.239 },
};

/**
 * Hoehe der Rueckstandskurve und Groesse der Zeitgruppen, aus echten Rennen.
 *
 * Beides stand bisher als feste Zahl je Profil in `tailGapPerKm` und
 * `tailGroupSize`. Die Messung ueber 826 Grand-Tour-Etappen von 2010 bis 2024
 * zeigt zwei Dinge, die eine feste Zahl nicht abbilden kann:
 *
 * Erstens streut beides erheblich. Der Rueckstand des letzten Fahrers liegt
 * auf Huegeletappen zwischen 1,63 und 8,19 Sekunden je Kilometer (p10 bis
 * p90, Faktor 5), im Hochgebirge zwischen 10,83 und 17,32 (Faktor 1,6). Die
 * Streuung wird also kleiner, je haerter das Terrain ist — eine
 * Hochgebirgsetappe ist immer eine Hochgebirgsetappe, eine Huegeletappe kann
 * alles sein.
 *
 * Zweitens ist ein guter Teil dieser Streuung *erklaerbar*: die
 * Rangkorrelation zur Schwierigkeit je Kilometer liegt innerhalb eines
 * Terrains bei +0,41 bis +0,71 fuer den Rueckstand und bei -0,22 bis -0,53
 * fuer die Gruppengroesse — schwerer heisst groessere Abstaende und kleinere
 * Gruppen. Das auszuwuerfeln, statt es zu rechnen, waere Verschwendung.
 *
 * Deshalb zwei Schichten:
 *
 *   wert = exp(slope · D + intercept) · lognormal(0, sigma)
 *
 * Der erste Teil ist bestimmt und macht aus einer brutalen Bergetappe von
 * selbst eine mit groesseren Abstaenden als eine milde desselben Profils. Der
 * zweite traegt nur noch, was uebrig bleibt. `sigma` ist dabei um die
 * Streuung bereinigt, die `noiseSigma` ohnehin schon erzeugt (gemessen
 * Faktor 1,08 im Gebirge bis 1,45 im Huegel).
 *
 * Die Rohwerte im Logarithmus sind nahezu symmetrisch (Schiefe -0,0 bis
 * +0,8), die Lognormalverteilung ist also die passende Form. Roh sind sie es
 * nicht: dort liegt die Schiefe zwischen +0,9 und +11,4.
 *
 * Profile ohne Eintrag behalten ihre festen `tailGapPerKm` und
 * `tailGroupSize` — das sind Flat, Rolling und die beiden Pflasterprofile.
 */
export interface MeasuredStageGapModel {
  /** `tailGapPerKm = exp(gapSlope · D + gapIntercept)`. */
  gapSlope: number;
  gapIntercept: number;
  /** Streuung im Logarithmus, bereits um `noiseSigma` bereinigt. */
  gapSigma: number;
  /** `tailGroupSize = exp(groupSlope · D + groupIntercept)`. */
  groupSlope: number;
  groupIntercept: number;
  groupSigma: number;
}

/** Auf wieviel Sigma die Ziehung gestutzt wird, damit kein Ausreisser entgleist. */
export const MEASURED_GAP_SIGMA_CLAMP = 2;

/**
 * Wie sich die Zeitgruppen ueber das Feld verteilen.
 *
 * `tailGroupSize` war bisher eine Zahl je Etappe und galt damit von der
 * Spitzengruppe bis zum letzten Fahrer gleich. So faehrt am Berg aber
 * niemand. Gemessen an 826 echten Etappen, mittlere Gruppengroesse je
 * Fuenftel des Feldes:
 *
 *   Terrain           0-20 %  20-40 %  40-60 %  60-80 %  80-100 %
 *   High_Mountain       1,49     2,57     5,00     6,20      2,21
 *   Mountain            1,75     2,33     4,54     6,80      2,33
 *   Medium_Mountain     2,62     2,64     6,00     6,88      2,62
 *   Hilly_Difficult     6,90     2,85     4,67     6,50      3,40
 *
 * Vorne faehrt jeder fuer sich, in der zweiten Haelfte sammelt sich das
 * Gruppetto, und dahinter troepfeln die Abgehaengten wieder einzeln herein.
 * Das Modell lieferte dagegen ueberall dieselbe Groesse — gemessen 2,29 bis
 * 2,50 ueber alle fuenf Abschnitte einer Hochgebirgsetappe.
 *
 * Deshalb ein Formfaktor um 1 auf die Position hinter der Spitzengruppe, mit
 * drei Stuetzstellen und geradliniger Ueberblendung dazwischen. `Hilly_Difficult`
 * steht bewusst nicht darin: dort sitzt die dicke Gruppe vorne, nicht hinten.
 */
/**
 * Obergrenze fuer die erste Zeitgruppe am Berg, in Fahrern.
 *
 * Die Ziehung im zerfallenen Regime hat einen langen Schwanz: `SPLIT_SHARE_RELATIVE_SD`
 * liegt bei 1,077, und die Beta-Verteilung wirft damit gelegentlich einen
 * Anteil aus, der zu keiner Bergetappe passt. Im Giro- und Tour-Lauf ergab
 * das auf Hochgebirgsetappen erste Gruppen von 15, 22 und 31 Fahrern —
 * ueber 52 echte Hochgebirgsetappen liegt das Groesste bei fuenf.
 *
 * Gemessen an echten Rennen:
 *
 *   Terrain            p50  p75  p90  p95  p99   groesste
 *   Hilly_Difficult      2   12   79  117  171        173
 *   Medium_Mountain      1    2    5   32  100        112
 *   Mountain             1    1    2    5   36         92
 *   High_Mountain        1    1    2    3    5          5
 *
 * Die Grenze fuer das Hochgebirge deckt sich damit genau. Die uebrigen drei
 * sind strenger als die Wirklichkeit und damit Spielentscheidungen: eine
 * schwere Huegeletappe, auf der 170 Fahrer zeitgleich ankommen, gibt es
 * real, ist im Spiel aber ein verlorener Renntag.
 */
export const FIRST_GROUP_MAX_SIZE: Partial<Record<StageProfile, number>> = {
  Hilly_Difficult: 50,
  Medium_Mountain: 25,
  Mountain: 10,
  High_Mountain: 6,
};

/**
 * Ab welcher Groesse die erste Zeitgruppe nur noch langsam waechst.
 *
 * Ein harter Deckel allein trifft die Vorgabe nicht: die Beta-Ziehung liefert
 * zwischen oberem Zehntel und oberem Hundertstel den Faktor zwei, gewuenscht
 * ist ein Viertel. Unterhalb des Knies bleibt die Ziehung deshalb, wie sie
 * ist, darueber laeuft sie saettigend auf die Obergrenze zu:
 *
 *   f(x) = M - (M - k) · exp(-(x - k) / (M - k))
 *
 * Bei x = k ist das genau k *und* die Steigung genau 1, der Uebergang ist
 * also knickfrei; fuer grosse x geht es gegen M, ohne es je zu erreichen.
 *
 * Die Saettigungsbreite ist bewusst an `M - k` gebunden und kein eigener
 * Parameter: die Steigung am Knie ist `(M - k) / s`, eine kleinere Breite
 * macht die Kurve dort also *steiler* statt flacher — die Gruppe wuerde
 * oberhalb des Knies schneller wachsen als darunter. Wer frueher saettigen
 * will, muss das Knie senken oder die Obergrenze, nicht die Breite.
 */
export const FIRST_GROUP_SOFT_KNEE: Partial<Record<StageProfile, number>> = {
  Hilly_Difficult: 12,
  Medium_Mountain: 15,
  Mountain: 6,
  High_Mountain: 4,
};

export const TAIL_GROUP_SHAPE_PROFILES: ReadonlySet<StageProfile> = new Set<StageProfile>([
  'Medium_Mountain', 'Mountain', 'High_Mountain',
]);
/** Position, an der die Gruppen am groessten sind. */
export const TAIL_GROUP_SHAPE_PEAK = 0.7;
/** Faktor am Anfang, am Gipfel und beim letzten Fahrer. */
export const TAIL_GROUP_SHAPE_START = 0.55;
export const TAIL_GROUP_SHAPE_PEAK_FACTOR = 2.30;
export const TAIL_GROUP_SHAPE_END = 0.85;

export const MEASURED_STAGE_GAP_MODEL: Partial<Record<StageProfile, MeasuredStageGapModel>> = {
  Hilly: { gapSlope: 0.561, gapIntercept: 1.068, gapSigma: 0.473, groupSlope: -0.115, groupIntercept: 1.698, groupSigma: 0.558 },
  Hilly_Difficult: { gapSlope: 0.333, gapIntercept: 1.627, gapSigma: 0.520, groupSlope: -0.264, groupIntercept: 1.835, groupSigma: 0.605 },
  Medium_Mountain: { gapSlope: 0.328, gapIntercept: 1.846, gapSigma: 0.264, groupSlope: -0.618, groupIntercept: 1.959, groupSigma: 0.522 },
  Mountain: { gapSlope: 0.257, gapIntercept: 2.014, gapSigma: 0.318, groupSlope: -0.473, groupIntercept: 1.854, groupSigma: 0.440 },
  High_Mountain: { gapSlope: 0.174, gapIntercept: 2.252, gapSigma: 0.175, groupSlope: -0.217, groupIntercept: 1.49, groupSigma: 0.404 },
};

export function resolveTailShape(profile?: StageProfile | null): TailShapeParameters {
  return (profile != null ? TAIL_SHAPE_BY_PROFILE[profile] : undefined) ?? DEFAULT_TAIL_SHAPE;
}

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
  Flat:             { baseSpeedKmh: 44.01, bunchIntercept: 1.63, bunchedShareIntercept: 0.8813, splitShareIntercept: 0.0054, tailGapPerKm: 4.90, tailGroupSize: 8.44, noiseSigma: 0.15, incidentLossMultiplier: 1.20, severeDnfChance: 0.25, breakawayShrinkExponent: 1.50, timeTrialSlope: 0.00000, timeTrialNoise: 0.0000, massCrashInvolvement: 0.35, rankNoise: 1.41 },
  Rolling:          { baseSpeedKmh: 42.49, bunchIntercept: 2.38, bunchedShareIntercept: 0.7527, splitShareIntercept: 0.2947, tailGapPerKm: 5.35, tailGroupSize: 4.18, noiseSigma: 0.18, incidentLossMultiplier: 1.40, severeDnfChance: 0.25, breakawayShrinkExponent: 1.50, timeTrialSlope: 0.00000, timeTrialNoise: 0.0000, massCrashInvolvement: 0.35, rankNoise: 1.41 },
  Hilly:            { baseSpeedKmh: 42.83, bunchIntercept: -0.50, bunchedShareIntercept: 0.7860, splitShareIntercept: 0.0700, tailGapPerKm: 6.12, tailGroupSize: 4.15, noiseSigma: 0.20, incidentLossMultiplier: 1.70, severeDnfChance: 0.28, breakawayShrinkExponent: 1.50, timeTrialSlope: 0.00000, timeTrialNoise: 0.0000, massCrashInvolvement: 0.35, rankNoise: 1.29 },
  Hilly_Difficult:  { baseSpeedKmh: 41.41, bunchIntercept: -5.00, bunchedShareIntercept: 0.6951, splitShareIntercept: 0.0100, tailGapPerKm: 9.93, tailGroupSize: 3.96, noiseSigma: 0.22, incidentLossMultiplier: 2.00, severeDnfChance: 0.30, breakawayShrinkExponent: 1.50, timeTrialSlope: 0.00000, timeTrialNoise: 0.0000, massCrashInvolvement: 0.35, rankNoise: 1.02 },
  Cobble:           { baseSpeedKmh: 46.08, bunchIntercept: -3.03, bunchedShareIntercept: 0.5725, splitShareIntercept: -0.0112, tailGapPerKm: 13.08, tailGroupSize: 5.42, noiseSigma: 0.30, incidentLossMultiplier: 2.40, severeDnfChance: 0.35, breakawayShrinkExponent: 1.40, timeTrialSlope: 0.00000, timeTrialNoise: 0.0000, massCrashInvolvement: 0.35, rankNoise: 0.38 },
  Cobble_Hill:      { baseSpeedKmh: 46.85, bunchIntercept: 1.16, bunchedShareIntercept: 0.6661, splitShareIntercept: 0.1715, tailGapPerKm: 8.35, tailGroupSize: 5.25, noiseSigma: 0.30, incidentLossMultiplier: 2.40, severeDnfChance: 0.35, breakawayShrinkExponent: 1.40, timeTrialSlope: 0.00000, timeTrialNoise: 0.0000, massCrashInvolvement: 0.35, rankNoise: 0.84 },
  Medium_Mountain:  { baseSpeedKmh: 39.83, bunchIntercept: -2.00, bunchedShareIntercept: 0.5717, splitShareIntercept: 0.0100, tailGapPerKm: 6.76, tailGroupSize: 4.38, noiseSigma: 0.22, incidentLossMultiplier: 2.20, severeDnfChance: 0.30, breakawayShrinkExponent: 1.60, timeTrialSlope: 0.00000, timeTrialNoise: 0.0000, massCrashInvolvement: 0.35, rankNoise: 0.79 },
  Mountain:         { baseSpeedKmh: 36.91, bunchIntercept: -1.00, bunchedShareIntercept: 0.7000, splitShareIntercept: 0.0060, tailGapPerKm: 23.25, tailGroupSize: 1.85, noiseSigma: 0.24, incidentLossMultiplier: 2.60, severeDnfChance: 0.30, breakawayShrinkExponent: 1.70, timeTrialSlope: 0.00000, timeTrialNoise: 0.0000, massCrashInvolvement: 0.35, rankNoise: 0.51 },
  High_Mountain:    { baseSpeedKmh: 35.85, bunchIntercept: -1.00, bunchedShareIntercept: 0.7000, splitShareIntercept: 0.0320, tailGapPerKm: 36.82, tailGroupSize: 2.25, noiseSigma: 0.26, incidentLossMultiplier: 3.00, severeDnfChance: 0.32, breakawayShrinkExponent: 1.80, timeTrialSlope: 0.00000, timeTrialNoise: 0.0000, massCrashInvolvement: 0.35, rankNoise: 0.26 },
  ITT:              { baseSpeedKmh: 45.94, bunchIntercept: 0.00, bunchedShareIntercept: 0.7000, splitShareIntercept: 0.0000, tailGapPerKm: 10.70, tailGroupSize: 2.45, noiseSigma: 0.10, incidentLossMultiplier: 1.00, severeDnfChance: 0.20, breakawayShrinkExponent: 1.00, timeTrialSlope: 0.00440, timeTrialNoise: 0.0150, massCrashInvolvement: 0.00, rankNoise: 0.35 },
  TTT:              { baseSpeedKmh: 55.45, bunchIntercept: 0.00, bunchedShareIntercept: 0.7000, splitShareIntercept: 0.0000, tailGapPerKm: 23.22, tailGroupSize: 6.43, noiseSigma: 0.08, incidentLossMultiplier: 1.00, severeDnfChance: 0.20, breakawayShrinkExponent: 1.00, timeTrialSlope: 0.00820, timeTrialNoise: 0.0046, massCrashInvolvement: 0.00, rankNoise: 0.35 },
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
