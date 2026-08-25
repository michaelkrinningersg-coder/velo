/**
 * Wie stark Form und Anfahrt je Terrain wirken.
 *
 * Zwei Groessen, die zusammengehoeren: auf einer Flachetappe soll nicht die
 * Saisonform darueber entscheiden, wer den Sprint gewinnt, sondern der
 * Anfahrtszug. Also wirkt die Form dort nur zur Haelfte, und der
 * Anfahrtsbonus dafuer um ein Viertel staerker. Auf Huegeletappen faellt
 * beides schwaecher aus, weil dort die Beine wieder mehr zaehlen.
 *
 * Alles, was hier nicht steht, bleibt bei 1,0 — Berg-, Pflaster- und
 * Zeitfahrprofile also unveraendert.
 */

import type { StageProfile } from '../../../shared/types';

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

export function resolveSeasonFormFactor(profile: StageProfile | null | undefined): number {
  return (profile ? SEASON_FORM_FACTOR[profile] : undefined) ?? 1;
}

export function resolveLeadoutBonusFactor(profile: StageProfile | null | undefined): number {
  return (profile ? LEADOUT_BONUS_FACTOR[profile] : undefined) ?? 1;
}
