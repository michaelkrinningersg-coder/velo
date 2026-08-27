/**
 * Wie stark Form und Anfahrt je Terrain wirken.
 *
 * Zwei Groessen, die zusammengehoeren: auf einer Flachetappe soll nicht die
 * Saisonform darueber entscheiden, wer den Sprint gewinnt, sondern der
 * Anfahrtszug. Also wirkt die Form dort nur zur Haelfte, und der
 * Anfahrtsbonus dafuer um ein Viertel staerker. Auf Huegeletappen faellt
 * beides schwaecher aus, weil dort die Beine wieder mehr zaehlen.
 *
 * Dazu zwei Faktoren auf das Rangrauschen: einer fuer seinen Anteil am
 * Zielsprint, einer fuer seine Groesse insgesamt.
 *
 * Alles, was in einer Tabelle nicht steht, bleibt dort bei 1,0. Pflaster- und
 * Zeitfahrprofile sind in keiner der vier vertreten.
 */

import type { StageProfile } from '../types';

/**
 * Anteil, mit dem Saisonform und Rennform in den Etappenscore eingehen.
 * Die Tagesform ist davon nicht betroffen: sie ist der Zufall des Tages und
 * soll ihre volle Spannweite behalten.
 */
export const SEASON_FORM_FACTOR: Partial<Record<StageProfile, number>> = {
  Flat: 0.5,
  Rolling: 0.5,
  Hilly: 0.75,
};

/** Faktor auf den Anfahrtsbonus im Zielsprint. */
export const LEADOUT_BONUS_FACTOR: Partial<Record<StageProfile, number>> = {
  Flat: 1.25,
  Rolling: 1.25,
  Hilly: 1.15,
};

/**
 * Anteil des Rangrauschens, der auf den Tie-Break geht.
 *
 * Das Rangrauschen muss auf den Ordnungsscore — dagegen ist `rank_noise`
 * kalibriert (Rangkorrelation zur Favoritenliste). Auf den `photoFinishScore`
 * angewandt entschied es aber auch den Zielsprint, und zwar staerker als alles
 * andere: gemessen +3 bis +15 Punkte gegen einen Anfahrtsbonus von +1,5 bis
 * +3,2. Auf einer Flachetappe kam damit ein Fahrer mit der schwaechsten Basis
 * der Spitzengruppe aufs Podium.
 *
 * Auf Flach-, Rolling- und Huegeletappen zaehlt es deshalb nur noch zu einem
 * Viertel. Die Reihenfolge des Feldes bleibt davon unberuehrt — dort wirkt
 * `RANK_NOISE_FACTOR`.
 */
export const TIE_BREAK_NOISE_FACTOR: Partial<Record<StageProfile, number>> = {
  Flat: 0.25,
  Rolling: 0.25,
  Hilly: 0.25,
};

/**
 * Faktor auf das Rangrauschen insgesamt — fuer jedes Profil derselbe.
 *
 * `rank_noise` stammt aus dem Kalibrierlauf und ist dort gegen die
 * Rangkorrelation zur vollen Simulation angepasst worden. Als Spielgroesse war
 * das Ergebnis zu gross: der Zufall verschob die Feldreihenfolge staerker, als
 * es die Unterschiede zwischen den Fahrern taten. Erst blieb die Haelfte
 * davon, inzwischen ein Fuenftel — der Etappenscore soll die Reihenfolge
 * bestimmen, das Rauschen nur noch die Faelle entscheiden, in denen zwei
 * Fahrer ohnehin gleichauf liegen.
 *
 * Bewusst eine einzelne Zahl und keine Tabelle je Profil: eine Tabelle mit
 * neunmal demselben Wert taeuscht eine Terrainabhaengigkeit vor, die es nicht
 * gibt. Die Funktion behaelt trotzdem ihren Profilparameter, damit die
 * Aufrufstellen unveraendert bleiben, falls das je wieder terrainabhaengig
 * werden soll.
 */
export const RANK_NOISE_FACTOR = 0.2;

/**
 * Abzug auf den Etappenscore fuer Wassertraeger am Berg.
 *
 * Ein Wassertraeger faehrt am Berg nicht sein eigenes Rennen: er zieht sein
 * Feld an, holt Flaschen und faellt danach zurueck. Sein Bergwert sagt, was
 * er koennte, nicht was er darf. Im Modell stand er dagegen mit dem vollen
 * Wert im Feld — im Giro-Lauf wurde ein Wassertraeger mit Bergwert 75 damit
 * Vierter der Gesamtwertung.
 *
 * Der Abzug wirkt auf den Ordnungsscore und damit auf die Zielposition. Er
 * waechst mit dem Terrain: was auf einer Mittelgebirgsetappe noch zu
 * verstecken ist, kostet im Hochgebirge Minuten. Auf allen anderen Profilen
 * gibt es keinen Abzug — dort ist der Wassertraeger im Feld ganz normal
 * dabei.
 */
export const DOMESTIQUE_CLIMB_PENALTY: Partial<Record<StageProfile, number>> = {
  Medium_Mountain: 2,
  Mountain: 4,
  High_Mountain: 6,
};

/**
 * Anteil des Abzugs, den ein starker Helfer traegt.
 *
 * Er faehrt am Berg laenger vorne mit als der Wassertraeger, faehrt aber
 * ebenfalls nicht sein eigenes Rennen — ein Drittel des vollen Abzugs.
 */
export const STRONG_HELPER_PENALTY_SHARE = 1 / 3;

/** Rollen, die den Abzug tragen, mit ihrem Anteil daran. */
export const CLIMB_PENALTY_BY_ROLE: Record<string, number> = {
  wassertraeger: 1,
  'starke helfer': STRONG_HELPER_PENALTY_SHARE,
};

export function resolveDomestiqueClimbPenalty(profile: StageProfile | null | undefined): number {
  return (profile ? DOMESTIQUE_CLIMB_PENALTY[profile] : undefined) ?? 0;
}

/** Abzug fuer eine Rolle auf diesem Terrain. Unbekannte Rollen tragen keinen. */
export function resolveClimbPenaltyForRole(
  roleName: string,
  profile: StageProfile | null | undefined,
): number {
  return resolveDomestiqueClimbPenalty(profile) * (CLIMB_PENALTY_BY_ROLE[roleName] ?? 0);
}

/**
 * Faktor auf den reinen Faehigkeitsanteil des Etappenscores.
 *
 * Der Score setzt sich aus zwei Teilen zusammen: was der Fahrer kann
 * (gewichtete Faehigkeiten plus Ausdauer) und wie er drauf ist (Tagesform,
 * Saisonform, Rennform, Ermuedung). Der zweite Teil ist ueberall etwa gleich
 * gross — rund 25 Punkte zwischen Bestform und voellig leer. Der erste nicht:
 * gemessen an einem Feld von 200 Fahrern streuen die Faehigkeiten auf einer
 * Hilly-Etappe um 2,13 Punkte, im Hochgebirge um 4,69.
 *
 * Daraus folgt, dass ein schlechter Formtag auf den leichten Profilen doppelt
 * so viele Plaetze kostet wie am Berg. Zwischen Rang 25 und Rang 50 lagen auf
 * Hilly 1,11 Punkte — die Form konnte einen Fahrer damit durch das halbe Feld
 * schieben. Gemessen: der nach Faehigkeiten 25.-beste Fahrer eines Feldes fiel
 * dort von Rang 25 auf Rang 164, wenn seine Form von +4 auf -4 ging.
 *
 * Der Faktor spreizt den Faehigkeitsanteil deshalb je Terrain so weit auf,
 * dass die Streuung ueberall aehnlich gross ist. Die Form bleibt in absoluter
 * Groesse stehen und verliert dadurch relativ an Gewicht. Nach den Faktoren
 * liegen alle Strassenprofile zwischen 3,54 und 4,92 statt zwischen 2,13 und
 * 4,69, und derselbe Fahrer verliert auf Hilly noch 76 statt 139 Plaetze.
 *
 * Das Einzelzeitfahren ist seit der Umstellung auf die Terraingewichte mit
 * dabei — auch dort summieren sich die Gewichte jetzt auf 1 und die Form
 * bekaeme sonst zu viel Gewicht. Das Mannschaftszeitfahren bleibt aussen vor:
 * dort zaehlt ohnehin nur das Mittel der besten fuenf einer Mannschaft.
 * Pflasterprofile bleiben vorerst bei 1,0 — sie sind bisher nicht gemessen.
 */
export const SKILL_WEIGHT_FACTOR_BY_PROFILE: Partial<Record<StageProfile, number>> = {
  Flat: 1.4,
  Rolling: 1.4,
  Hilly: 2.2,
  Hilly_Difficult: 1.5,
  Medium_Mountain: 1.15,
  Mountain: 1.1,
  High_Mountain: 1.05,
  // Zeitfahren: die Gewichte aus `ittScoreWeights.ts` summieren sich auf 1 und
  // druecken die Streuung des Koennens damit auf 2,4 Punkte — unter die der
  // Form. Vorher stand hier nichts, weil der alte Score den Bergwert
  // obendraufaddierte und dadurch kuenstlich breit war. Gemessen liegen die
  // Strassenprofile nach ihren Faktoren bei 2,9 bis 4,9; 1,7 bringt das
  // Zeitfahren in dieselbe Gegend.
  ITT: 1.7,
};

export function resolveSkillWeightFactor(profile: StageProfile | null | undefined): number {
  return (profile ? SKILL_WEIGHT_FACTOR_BY_PROFILE[profile] : undefined) ?? 1;
}

export function resolveTieBreakNoiseFactor(profile: StageProfile | null | undefined): number {
  return (profile ? TIE_BREAK_NOISE_FACTOR[profile] : undefined) ?? 1;
}

export function resolveRankNoiseFactor(_profile?: StageProfile | null): number {
  return RANK_NOISE_FACTOR;
}

export function resolveSeasonFormFactor(profile: StageProfile | null | undefined): number {
  return (profile ? SEASON_FORM_FACTOR[profile] : undefined) ?? 1;
}

export function resolveLeadoutBonusFactor(profile: StageProfile | null | undefined): number {
  return (profile ? LEADOUT_BONUS_FACTOR[profile] : undefined) ?? 1;
}
