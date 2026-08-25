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

import { randomBetween, type RandomSource } from '../../../shared/rng';
import type { Rider, RiderSkillKey } from '../../../shared/types';

/** Ermuedung geht nur halb ein — dieselbe Gewichtung wie im TimeTrialSimulator. */
export const FATIGUE_WEIGHT = 0.5;

/** Summe der drei Ermuedungswerte, bereits gewichtet. Immer >= 0. */
export function resolveFatigueMalus(rider: Rider): number {
  return ((rider.fatigueMalus ?? 0)
    + (rider.longTermFatigueMalus ?? 0)
    + (rider.shortTermFatigueMalus ?? 0)) * FATIGUE_WEIGHT;
}

/**
 * Ermuedung fuer die Quick Simulation — ohne die Rundfahrt-Ermuedung.
 *
 * `fatigueMalus` rechnet die Belastung innerhalb des laufenden Rennens ein
 * (Etappennummer gegen Regeneration) und erreicht auf der 21. Etappe je nach
 * Fahrer 4 bis 27 Punkte. Kurz- und Langzeitermuedung erfassen dieselbe
 * Belastung ein zweites Mal, nur ueber die Saison hinweg — beide zusammen
 * ergaeben am Ende einer grossen Rundfahrt einen Abzug von bis zu 27
 * Skillpunkten, gegen den keine Form mehr ankommt.
 *
 * Die Quick Simulation zaehlt die Belastung deshalb nur einmal, ueber die
 * beiden Saisonwerte. Die volle Simulation bleibt unveraendert.
 */
export function resolveQuickSimFatigueMalus(rider: Rider): number {
  return ((rider.longTermFatigueMalus ?? 0)
    + (rider.shortTermFatigueMalus ?? 0)) * FATIGUE_WEIGHT;
}

/** Untere Grenze der Tagesform. */
export const DAILY_FORM_MIN = -4;
/** Obere Grenze der Tagesform. */
export const DAILY_FORM_MAX = 4;
/**
 * Obere Grenze fuer den Traeger des Gesamttrikots. Er faellt seltener nach
 * oben aus, weil er unter Beobachtung faehrt — nach unten gilt fuer ihn
 * dieselbe Grenze wie fuer alle anderen.
 */
export const DAILY_FORM_GC_LEADER_MAX = 1.5;

/**
 * Tagesform eines Fahrers, einmal je Etappe gezogen und additiv auf jede
 * Faehigkeit gerechnet.
 *
 * Stand frueher zweimal da — einmal in der Engine, einmal in der Quick
 * Simulation. Zwei Kopien einer Spanne, die in beiden Modi gleich sein muss,
 * driften auseinander; deshalb jetzt hier.
 */
export function sampleDailyForm(random: RandomSource, isGcLeader = false): number {
  const max = isGcLeader ? DAILY_FORM_GC_LEADER_MAX : DAILY_FORM_MAX;
  return Math.round(randomBetween(random, DAILY_FORM_MIN, max) * 100) / 100;
}

/**
 * Saisonform plus Rennform minus gewichtete Ermuedung — der Zuschlag, mit dem
 * die Simulation jede Faehigkeit des Fahrers verschiebt.
 */
export function resolveConditionFormBonus(rider: Rider): number {
  return (rider.formBonus ?? 0) + (rider.raceFormBonus ?? 0) - resolveFatigueMalus(rider);
}

/**
 * Wer vom Mentorenbonus ueberhaupt profitiert.
 *
 * Die volle Simulation rechnet ihn nur fuer Kapitaene und Co-Kapitaene ein —
 * obwohl er an Fahrer bis 22 vergeben wird, und junge Kapitaene selten sind
 * (im aktuellen Spielstand zwei von 252 jungen Fahrern). Ob das so gewollt
 * ist, ist eine Balance-Frage; hier wird die bestehende Regel gespiegelt,
 * damit beide Modi dasselbe Ergebnis liefern.
 */
export function usesMentorBoosts(rider: Rider): boolean {
  return rider.role?.name === 'Kapitaen' || rider.role?.name === 'Co-Kapitaen';
}

/** Faehigkeiten eines Fahrers inklusive Mentorenbonus, falls er ihn nutzt. */
export function resolveSkillsWithMentorBoosts(rider: Rider): Record<RiderSkillKey, number> {
  if (!rider.mentorBoosts || !usesMentorBoosts(rider)) {
    return rider.skills;
  }
  const skills = { ...rider.skills };
  for (const [key, boost] of Object.entries(rider.mentorBoosts)) {
    if (typeof boost === 'number') {
      skills[key as RiderSkillKey] += boost;
    }
  }
  return skills;
}
