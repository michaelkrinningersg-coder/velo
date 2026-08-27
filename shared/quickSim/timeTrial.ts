/**
 * Zeitfahren in der Quick Simulation.
 *
 * ITT und TTT haben keine Gruppendynamik — das Gruppenmodell der Strassen-
 * etappen passt hier nicht, und der Vergleich mit der Instant-Simulation hat
 * das deutlich gezeigt: 15 Zeitgruppen statt 34 beim ITT, eine erste Gruppe
 * von 15 % des Feldes statt 2 %.
 *
 * Was die Instant-Simulation tatsaechlich tut, ist einfacher als das
 * Strassenmodell:
 *
 *   ITT  jeder faehrt allein. Der Rueckstand waechst linear mit dem
 *        Score-Abstand zum Besten, dazu eine Reststreuung.
 *
 *        Gemessen an vier echten Zeitfahren, je 5 Laeufe der vollen
 *        Simulation gegen 120 Laeufe der Quick Simulation: die Steigung
 *        liegt bei 0,0048 der Siegerzeit je Score-Punkt, die Reststreuung
 *        bei 2,35 %. In der CSV steht trotzdem 0,0044 und 1,5 % — und das
 *        mit Absicht.
 *
 *        Der Grund: die Regression misst gegen einen Score OHNE Tagesform,
 *        der Etappenscore der Quick Simulation traegt sie aber schon in
 *        sich. Wer die gemessene Reststreuung obendrauf legt, zaehlt die
 *        Tagesform zweimal. Nachgemessen am fertigen Lauf ueber alle vier
 *        Etappen: mit 2,35 % liegt die Rangkorrelation bei 0,645 und die
 *        Rueckstaende 19 % zu hoch, mit 1,5 % bei 0,740 und 3 % zu hoch.
 *        Die volle Simulation liegt bei 0,704.
 *
 *   TTT  die Mannschaft *ist* die Gruppe. Eine Sonde ueber zwei Etappen
 *        zeigt: die Spanne innerhalb eines Teams ist exakt 0,0 Sekunden, bei
 *        jedem einzelnen Team. Die Zahl der Zeitgruppen ist damit die Zahl der
 *        Mannschaften. Die Teamzeit haengt am Mittel der besten fuenf, minus
 *        einem Malus fuer fehlende Fahrer — dieselbe Regel wie in
 *        `applyTeamTimeTrialTempo`.
 *
 * Die Zeitgruppen entstehen in beiden Faellen aus den Zeiten selbst, nach der
 * 1-Sekunden-Regel. Beim ITT ist das der Grund, warum ein kurzes Zeitfahren
 * weniger Gruppen hat als ein langes: dieselbe Streuung, auf weniger Sekunden
 * verteilt.
 */

import type { QuickSimProfileParameters } from '../quickSimProfiles';
import type { RandomSource } from '../rng';
import { drawStandardNormal } from './groupModel';

/**
 * Grenze fuer die Tagesstreuung eines Zeitfahrens, in Standardabweichungen.
 *
 * Die Reststreuung der vollen Simulation hat duennere Enden als eine
 * Normalverteilung: mit ungestutztem Zufall blieben die Rueckstaende auch bei
 * richtig eingestellter Steigung rund ein Zehntel zu gross, weil einzelne
 * Ausreisser das Feld auseinanderziehen. Dieselbe Stutzung benutzt das
 * Strassenmodell fuer seine Streufaktoren.
 */
export const TIME_TRIAL_SIGMA_CLAMP = 2;

/** Wie viele Fahrer in die Teamwertung eingehen. Wie in der Instant-Simulation. */
export const TEAM_TIME_TRIAL_COUNTING_RIDERS = 5;
/** Sollstaerke einer Mannschaft; jeder fehlende Fahrer kostet einen Punkt. */
export const TEAM_TIME_TRIAL_FULL_SIZE = 8;

export interface TimeTrialRider {
  riderId: number;
  score: number;
  /** Nur fuer das TTT noetig. */
  teamId?: number;
}

/**
 * Wertung einer Mannschaft: Mittel der besten fuenf, abzueglich eines Punktes
 * je fehlendem Fahrer. Uebernommen aus `applyTeamTimeTrialTempo` — eine
 * eigene Formel wuerde mit der Zeit davon abweichen, ohne dass es auffiele.
 */
export function resolveTeamTimeTrialScore(scores: readonly number[]): number {
  if (scores.length === 0) {
    return 1;
  }
  const counting = [...scores]
    .sort((left, right) => right - left)
    .slice(0, Math.min(TEAM_TIME_TRIAL_COUNTING_RIDERS, scores.length));
  const mean = counting.reduce((sum, score) => sum + score, 0) / counting.length;
  const missingMalus = Math.max(0, TEAM_TIME_TRIAL_FULL_SIZE - scores.length);
  return Math.max(1, mean - missingMalus);
}

/**
 * Relativer Zeitversatz je Einheit (Fahrer oder Mannschaft), normiert auf den
 * Besten. Der Beste hat 0, alle anderen einen positiven Wert.
 */
function buildRelativeOffsets(
  random: RandomSource,
  scoresById: ReadonlyMap<number, number>,
  parameters: QuickSimProfileParameters,
): Map<number, number> {
  const offsets = new Map<number, number>();
  if (scoresById.size === 0) {
    return offsets;
  }

  const bestScore = Math.max(...scoresById.values());
  let smallest = Number.POSITIVE_INFINITY;
  for (const [id, score] of scoresById) {
    const z = Math.min(
      TIME_TRIAL_SIGMA_CLAMP,
      Math.max(-TIME_TRIAL_SIGMA_CLAMP, drawStandardNormal(random)),
    );
    const offset = (parameters.timeTrialSlope * (bestScore - score))
      + (z * parameters.timeTrialNoise);
    offsets.set(id, offset);
    smallest = Math.min(smallest, offset);
  }

  // Auf den tatsaechlich Schnellsten normieren, damit die gezogene Siegerzeit
  // die Siegerzeit bleibt. Sonst faehrt der Sieger schneller als das gemessene
  // `base_speed_kmh` — das ist selbst eine Siegergeschwindigkeit.
  for (const [id, offset] of offsets) {
    offsets.set(id, offset - smallest);
  }
  return offsets;
}

/**
 * Rueckstaende eines Einzelzeitfahrens in Sekunden, je Fahrer.
 */
export function buildIndividualTimeTrialGaps(
  random: RandomSource,
  riders: readonly TimeTrialRider[],
  parameters: QuickSimProfileParameters,
  winnerTimeSeconds: number,
): Map<number, number> {
  const scores = new Map(riders.map((rider) => [rider.riderId, rider.score]));
  const offsets = buildRelativeOffsets(random, scores, parameters);
  const gaps = new Map<number, number>();
  for (const rider of riders) {
    gaps.set(rider.riderId, Math.max(0, (offsets.get(rider.riderId) ?? 0) * winnerTimeSeconds));
  }
  return gaps;
}

/**
 * Rueckstaende eines Mannschaftszeitfahrens in Sekunden, je Fahrer.
 * Alle Fahrer einer Mannschaft bekommen denselben Wert.
 */
export function buildTeamTimeTrialGaps(
  random: RandomSource,
  riders: readonly TimeTrialRider[],
  parameters: QuickSimProfileParameters,
  winnerTimeSeconds: number,
): Map<number, number> {
  const ridersByTeam = new Map<number, TimeTrialRider[]>();
  for (const rider of riders) {
    // Fahrer ohne Mannschaft bilden je eine eigene — sonst wuerden sie zu einem
    // Phantomteam verschmelzen und gemeinsam ins Ziel kommen.
    const teamId = rider.teamId ?? -rider.riderId;
    const bucket = ridersByTeam.get(teamId) ?? [];
    bucket.push(rider);
    ridersByTeam.set(teamId, bucket);
  }

  const teamScores = new Map<number, number>();
  for (const [teamId, members] of ridersByTeam) {
    teamScores.set(teamId, resolveTeamTimeTrialScore(members.map((member) => member.score)));
  }

  const offsets = buildRelativeOffsets(random, teamScores, parameters);
  const gaps = new Map<number, number>();
  for (const [teamId, members] of ridersByTeam) {
    const gapSeconds = Math.max(0, (offsets.get(teamId) ?? 0) * winnerTimeSeconds);
    for (const member of members) {
      gaps.set(member.riderId, gapSeconds);
    }
  }
  return gaps;
}
