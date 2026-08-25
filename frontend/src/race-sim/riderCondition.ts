/**
 * Form und Ermuedung eines Fahrers am Renntag.
 *
 * Lag als modulprivate Funktion in `SimulationEngine.ts`. Die Quick Simulation
 * braucht denselben Wert: `calculateStageFavoriteRiderRanking` rechnet zwar
 * Saisonform und Rennform ein, die drei Ermuedungswerte aber nicht — die
 * Favoritenanzeige kommt ohne sie aus, ein Leistungsscore nicht. Ohne diese
 * Funktion waere ein muerber Fahrer in der Quick Simulation so stark wie ein
 * frischer, und das ausgerechnet in Rundfahrten, wo sich Ermuedung aufbaut.
 */

import type { Rider } from '../../../shared/types';

/** Ermuedung geht nur halb ein — dieselbe Gewichtung wie im TimeTrialSimulator. */
export const FATIGUE_WEIGHT = 0.5;

/** Summe der drei Ermuedungswerte, bereits gewichtet. Immer >= 0. */
export function resolveFatigueMalus(rider: Rider): number {
  return ((rider.fatigueMalus ?? 0)
    + (rider.longTermFatigueMalus ?? 0)
    + (rider.shortTermFatigueMalus ?? 0)) * FATIGUE_WEIGHT;
}

/**
 * Saisonform plus Rennform minus gewichtete Ermuedung — der Zuschlag, mit dem
 * die Simulation jede Faehigkeit des Fahrers verschiebt.
 */
export function resolveConditionFormBonus(rider: Rider): number {
  return (rider.formBonus ?? 0) + (rider.raceFormBonus ?? 0) - resolveFatigueMalus(rider);
}
