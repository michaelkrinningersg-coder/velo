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
 * weiterhin der volle Wert.
 */
export const TIE_BREAK_NOISE_FACTOR: Partial<Record<StageProfile, number>> = {
  Flat: 0.25,
  Rolling: 0.25,
  Hilly: 0.25,
};

/**
 * Faktor auf das Rangrauschen insgesamt.
 *
 * Ab `Hilly_Difficult` aufwaerts entscheiden die Beine, nicht die Position im
 * Feld — dort darf der Zufall kleiner ausfallen. Flach, rollend und huegelig
 * bleibt der kalibrierte Wert stehen; dort ist er die Grundlage der
 * Rangkorrelation gegen die volle Simulation.
 */
export const RANK_NOISE_FACTOR: Partial<Record<StageProfile, number>> = {
  Hilly_Difficult: 0.75,
  Medium_Mountain: 0.75,
  Mountain: 0.75,
  High_Mountain: 0.75,
};

export function resolveTieBreakNoiseFactor(profile: StageProfile | null | undefined): number {
  return (profile ? TIE_BREAK_NOISE_FACTOR[profile] : undefined) ?? 1;
}

export function resolveRankNoiseFactor(profile: StageProfile | null | undefined): number {
  return (profile ? RANK_NOISE_FACTOR[profile] : undefined) ?? 1;
}

export function resolveSeasonFormFactor(profile: StageProfile | null | undefined): number {
  return (profile ? SEASON_FORM_FACTOR[profile] : undefined) ?? 1;
}

export function resolveLeadoutBonusFactor(profile: StageProfile | null | undefined): number {
  return (profile ? LEADOUT_BONUS_FACTOR[profile] : undefined) ?? 1;
}
