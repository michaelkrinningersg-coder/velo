/**
 * Kern der Quick Simulation: aus vorberechneten Groessen ein vollstaendiges
 * Etappenergebnis, ohne einen einzigen simulierten Schritt.
 *
 * Sieben Schritte, von denen dieser Modul die drei neuen zusammensetzt und die
 * vier bestehenden aufruft:
 *
 *   1 Vorberechnung        Ausreisserplan, Vorfaelle, Wetter   uebernommen
 *   2 Leistungsscore       calculateStageFavorites()           uebernommen
 *   3 Siegerzeit           groupModel                          neu
 *   4 Gruppen, Abstaende   groupModel                          ersetzt die Sim
 *   5 Vorfaelle            incidents                           neu
 *   6 Zeitlimit            resolveStageTimeLimitSeconds()      uebernommen
 *   7 Rangfolge            rankStageResultEntries()            uebernommen
 *
 * Reine Funktion: alles, was von aussen kommt — Scores, Plan, Vorfaelle,
 * Zufall — wird hereingereicht. Damit ist derselbe Aufruf mit demselben Seed
 * reproduzierbar, und derselbe Kern laeuft im Frontend wie im Kalibrierwerkzeug.
 */

import {
  isTimeTrialProfile,
  rankStageResultEntries,
  resolveStageTimeLimitSeconds,
  roundStageResultSeconds,
  TIME_TIE_THRESHOLD_SECONDS,
} from '../stageResultRules';
import type { StageProfile } from '../types';
import type { QuickSimProfileParameters } from '../quickSimProfiles';
import type { RandomSource } from '../rng';
import {
  resolveBreakawaySurvives,
  type QuickSimBreakawayPlan,
} from './breakaway';
import {
  buildFinishGroups,
  drawFinishRegime,
  drawFirstGroupShare,
  resolveDifficultyPerKm,
  resolveFirstGroupSize,
  resolveWinnerTimeSeconds,
  type FinishRegime,
} from './groupModel';
import {
  resolveIncidentOutcomes,
  type QuickSimIncident,
  type QuickSimIncidentOutcome,
} from './incidents';
import { buildIndividualTimeTrialGaps, buildTeamTimeTrialGaps } from './timeTrial';

/**
 * Sekunden Restvorsprung je Kilometer, den die Ausreissergruppe frueher im
 * Ziel ist als der Einholpunkt liegt.
 *
 * Ungemessen — Startwert fuer den Fit. Ueberlebte Ausreisser sind im
 * Referenzlauf zu selten, um daraus eine Verteilung zu ziehen; sobald genug
 * Faelle vorliegen, gehoert der Wert in die Profiltabelle.
 */
export const BREAKAWAY_CLOSING_SECONDS_PER_KM = 20;

/** Obergrenze des Restvorsprungs, damit ein weit gezogener Einholpunkt keine Stunde ergibt. */
const MAX_BREAKAWAY_LEAD_SECONDS = 600;

export interface QuickSimRiderInput {
  riderId: number;
  /** Leistungsscore aus `calculateStageFavorites()`, hoeher ist besser. */
  score: number;
  /** Tie-Break innerhalb einer Zeitgruppe, wie in der vollen Simulation. */
  photoFinishScore: number;
  /** Nur fuer das Mannschaftszeitfahren noetig — dort ist das Team die Gruppe. */
  teamId?: number;
}

export interface QuickSimStageInput {
  profile: StageProfile;
  distanceKm: number;
  stageScore: number | null;
  parameters: QuickSimProfileParameters;
  riders: readonly QuickSimRiderInput[];
  incidents?: readonly QuickSimIncident[];
  breakaway?: QuickSimBreakawayPlan | null;
  random: RandomSource;
}

export interface QuickSimResultEntry {
  riderId: number;
  /** Zielzeit in Sekunden. Bei Aufgabe null. */
  stageTimeSeconds: number | null;
  /** Rueckstand auf den Sieger in Sekunden. Bei Aufgabe null. */
  gapSeconds: number | null;
  photoFinishScore: number;
  isAbandon: boolean;
  isOutsideTimeLimit: boolean;
  /** Index der Zeitgruppe, 0 ist die Siegergruppe. Bei Aufgabe null. */
  groupIndex: number | null;
  incident: QuickSimIncidentOutcome | null;
}

export interface QuickSimStageResult {
  /** Alle Fahrer in Rangfolge; Aufgaben haengen unsortiert hinten an. */
  entries: QuickSimResultEntry[];
  winnerTimeSeconds: number;
  timeLimitSeconds: number | null;
  regime: FinishRegime;
  difficultyPerKm: number;
  firstGroupSize: number;
  timeGroupCount: number;
  breakawaySurvived: boolean;
  abandonCount: number;
  outsideTimeLimitCount: number;
}

/**
 * Zeitgruppen aus aufsteigend sortierten Zielzeiten, nach der 1-Sekunden-Regel
 * des Spiels. Die Groessen kommen damit aus den Zeiten und nicht aus der
 * Ziehung — beim Zeitfahren gibt es gar keine Ziehung, und auf der Strasse
 * koennen zwei gezogene Gruppen naeher als eine Sekunde beieinander liegen.
 */
function resolveTimeGroupSizes(sortedTimesSeconds: readonly number[]): number[] {
  if (sortedTimesSeconds.length === 0) {
    return [];
  }
  const sizes: number[] = [1];
  for (let index = 1; index < sortedTimesSeconds.length; index += 1) {
    const step = (sortedTimesSeconds[index] as number) - (sortedTimesSeconds[index - 1] as number);
    if (step > TIME_TIE_THRESHOLD_SECONDS) {
      sizes.push(1);
      continue;
    }
    sizes[sizes.length - 1] = (sizes[sizes.length - 1] as number) + 1;
  }
  return sizes;
}

/**
 * Score, mit dem ein Fahrer in die Gruppenbildung eingeht.
 *
 * Der Ausreisserplan wirkt als Score-Verschiebung, nicht als Sonderfall:
 * ueberlebt die Gruppe, hebt der Bonus sie nach vorne; wird sie gestellt,
 * schiebt der Malus sie nach hinten. Genau so macht es die volle Simulation.
 */
function buildScoreMap(input: QuickSimStageInput, breakawaySurvived: boolean): Map<number, number> {
  const scores = new Map<number, number>();
  for (const rider of input.riders) {
    scores.set(rider.riderId, rider.score);
  }

  const plan = input.breakaway;
  if (!plan) {
    return scores;
  }

  const shift = breakawaySurvived ? (plan.skillBonus ?? 0) : -(plan.malusValue ?? 0);
  if (shift === 0) {
    return scores;
  }
  for (const riderId of plan.riderIds) {
    const current = scores.get(riderId);
    if (current != null) {
      scores.set(riderId, current + shift);
    }
  }
  return scores;
}

/** Restvorsprung der ueberlebenden Ausreissergruppe im Ziel. */
export function resolveSurvivingBreakawayLeadSeconds(
  plan: QuickSimBreakawayPlan,
  distanceKm: number,
): number {
  const surplusKm = Math.max(0, (plan.phaseEndDistanceMeters / 1000) - distanceKm);
  return Math.min(MAX_BREAKAWAY_LEAD_SECONDS, Math.max(1, Math.round(surplusKm * BREAKAWAY_CLOSING_SECONDS_PER_KM)));
}

export function simulateQuickStage(input: QuickSimStageInput): QuickSimStageResult {
  const { profile, distanceKm, stageScore, parameters, riders, random } = input;

  // 5 · Vorfaelle zuerst: Aufgaben duerfen die Gruppengroessen nicht mehr
  //     beeinflussen, deshalb stehen sie vor der Regime-Ziehung fest.
  const incidentOutcomes = resolveIncidentOutcomes(random, input.incidents ?? [], parameters, distanceKm);

  const finishers = riders.filter((rider) => !incidentOutcomes.get(rider.riderId)?.isAbandon);
  const abandons = riders.filter((rider) => incidentOutcomes.get(rider.riderId)?.isAbandon);

  const difficultyPerKm = resolveDifficultyPerKm(stageScore, distanceKm);
  const breakawaySurvived = resolveBreakawaySurvives(
    input.breakaway ?? null,
    Math.round(distanceKm * 1000),
  );

  if (finishers.length === 0) {
    return {
      entries: abandons.map((rider) => toAbandonEntry(rider, incidentOutcomes)),
      winnerTimeSeconds: 0,
      timeLimitSeconds: null,
      regime: 'split',
      difficultyPerKm,
      firstGroupSize: 0,
      timeGroupCount: 0,
      breakawaySurvived,
      abandonCount: abandons.length,
      outsideTimeLimitCount: 0,
    };
  }

  // 3 · Siegerzeit. Haengt an Distanz und Profil, nicht an den Fahrern.
  const winnerTimeSeconds = resolveWinnerTimeSeconds(random, parameters, distanceKm);

  // Zeitfahren gehen einen eigenen Weg: keine Regime-Ziehung, keine
  // Ausreissergruppe, keine gezogenen Zeitgruppen.
  if (isTimeTrialProfile(profile)) {
    const gapByRiderId = profile === 'TTT'
      ? buildTeamTimeTrialGaps(random, finishers, parameters, winnerTimeSeconds)
      : buildIndividualTimeTrialGaps(random, finishers, parameters, winnerTimeSeconds);
    return assembleResult({
      input,
      finishers,
      abandons,
      incidentOutcomes,
      gapByRiderId,
      groupIndexByRiderId: null,
      winnerTimeSeconds,
      regime: 'split',
      difficultyPerKm,
      breakawaySurvived,
    });
  }

  // 4 · Gruppen und Abstaende.
  const scores = buildScoreMap(input, breakawaySurvived);
  const sorted = [...finishers].sort(
    (left, right) => (scores.get(right.riderId) as number) - (scores.get(left.riderId) as number)
      || left.riderId - right.riderId,
  );

  const regime = drawFinishRegime(random, parameters, difficultyPerKm);
  const gapByRiderId = new Map<number, number>();
  const groupIndexByRiderId = new Map<number, number>();
  if (breakawaySurvived && input.breakaway) {
    // Die Ausreisser bilden Gruppe 1, das Feld beginnt bei Gruppe 2. Der
    // Etappensieg faellt damit zwingend aus der Gruppe — nicht als Bonus, der
    // sich gegen einen starken Sprinter auch mal nicht durchsetzt.
    const breakawayIds = new Set(input.breakaway.riderIds);
    const head = sorted.filter((rider) => breakawayIds.has(rider.riderId));
    const field = sorted.filter((rider) => !breakawayIds.has(rider.riderId));
    const leadSeconds = resolveSurvivingBreakawayLeadSeconds(input.breakaway, distanceKm);

    for (const rider of head) {
      gapByRiderId.set(rider.riderId, 0);
      groupIndexByRiderId.set(rider.riderId, 0);
    }
    const headGroupCount = head.length > 0 ? 1 : 0;

    const fieldGroups = buildFinishGroups({
      scoresDescending: field.map((rider) => scores.get(rider.riderId) as number),
      firstGroupSize: resolveFirstGroupSize(
        drawFirstGroupShare(random, parameters, regime, difficultyPerKm),
        field.length,
      ),
      distanceKm,
      parameters,
      random,
    });
    fieldGroups.forEach((group, index) => {
      for (const memberIndex of group.memberIndices) {
        const rider = field[memberIndex] as QuickSimRiderInput;
        gapByRiderId.set(rider.riderId, leadSeconds + group.gapSeconds);
        groupIndexByRiderId.set(rider.riderId, headGroupCount + index);
      }
    });
  } else {
    const share = drawFirstGroupShare(random, parameters, regime, difficultyPerKm);
    const groups = buildFinishGroups({
      scoresDescending: sorted.map((rider) => scores.get(rider.riderId) as number),
      firstGroupSize: resolveFirstGroupSize(share, sorted.length),
      distanceKm,
      parameters,
      random,
    });
    groups.forEach((group, index) => {
      for (const memberIndex of group.memberIndices) {
        const rider = sorted[memberIndex] as QuickSimRiderInput;
        gapByRiderId.set(rider.riderId, group.gapSeconds);
        groupIndexByRiderId.set(rider.riderId, index);
      }
    });
  }

  return assembleResult({
    input,
    finishers: sorted,
    abandons,
    incidentOutcomes,
    gapByRiderId,
    groupIndexByRiderId,
    winnerTimeSeconds,
    regime,
    difficultyPerKm,
    breakawaySurvived,
  });
}

interface AssembleInput {
  input: QuickSimStageInput;
  finishers: readonly QuickSimRiderInput[];
  abandons: readonly QuickSimRiderInput[];
  incidentOutcomes: ReadonlyMap<number, QuickSimIncidentOutcome>;
  gapByRiderId: ReadonlyMap<number, number>;
  /** Nur die Strassenfassung kennt gezogene Gruppen; beim Zeitfahren null. */
  groupIndexByRiderId: ReadonlyMap<number, number> | null;
  winnerTimeSeconds: number;
  regime: FinishRegime;
  difficultyPerKm: number;
  breakawaySurvived: boolean;
}

/**
 * Schritte 5 bis 7: Vorfallverluste aufschlagen, Zeitlimit setzen, Rangfolge
 * bilden. Gemeinsam fuer Strasse und Zeitfahren — was sich unterscheidet, sind
 * nur die Rueckstaende, die hier schon feststehen.
 */
function assembleResult(assemble: AssembleInput): QuickSimStageResult {
  const {
    input, finishers, abandons, incidentOutcomes, gapByRiderId,
    groupIndexByRiderId, winnerTimeSeconds, regime, difficultyPerKm, breakawaySurvived,
  } = assemble;

  const finisherEntries: QuickSimResultEntry[] = finishers.map((rider) => {
    const incident = incidentOutcomes.get(rider.riderId) ?? null;
    const gapSeconds = (gapByRiderId.get(rider.riderId) ?? 0) + (incident?.timeLossSeconds ?? 0);
    return {
      riderId: rider.riderId,
      stageTimeSeconds: roundStageResultSeconds(winnerTimeSeconds + gapSeconds),
      gapSeconds: Math.round(gapSeconds),
      photoFinishScore: rider.photoFinishScore,
      isAbandon: false,
      isOutsideTimeLimit: false,
      groupIndex: groupIndexByRiderId?.get(rider.riderId) ?? null,
      incident,
    };
  });

  // 6 · Zeitlimit — dieselbe Regel wie in der vollen Simulation.
  const timeLimitSeconds = resolveStageTimeLimitSeconds(
    input.profile,
    finisherEntries.map((entry) => entry.stageTimeSeconds as number),
  );
  if (timeLimitSeconds != null) {
    for (const entry of finisherEntries) {
      entry.isOutsideTimeLimit = (entry.stageTimeSeconds as number) > timeLimitSeconds;
    }
  }

  // 7 · Rangfolge und Tie-Break, unveraendert aus den Etappenregeln.
  const ranked = rankStageResultEntries(
    finisherEntries.map((entry) => ({ ...entry, stageTimeSeconds: entry.stageTimeSeconds as number })),
    input.profile,
  );

  // Die Rueckstaende beziehen sich auf den tatsaechlichen Sieger, nicht auf die
  // gezogene Siegerzeit: ein Vorfall in der Spitzengruppe verschiebt beides.
  const winnerEntry = ranked[0];
  const actualWinnerTimeSeconds = winnerEntry ? winnerEntry.stageTimeSeconds : roundStageResultSeconds(winnerTimeSeconds);
  for (const entry of ranked) {
    entry.gapSeconds = entry.stageTimeSeconds - actualWinnerTimeSeconds;
  }

  const groupSizes = resolveTimeGroupSizes(ranked.map((entry) => entry.stageTimeSeconds));
  if (groupIndexByRiderId == null) {
    // Beim Zeitfahren gibt es keine gezogenen Gruppen — der Index kommt aus den
    // Zeiten, damit das Feld trotzdem eine Gruppenstruktur hat.
    let groupIndex = 0;
    let cursor = 0;
    for (const size of groupSizes) {
      for (let offset = 0; offset < size; offset += 1) {
        (ranked[cursor + offset] as QuickSimResultEntry).groupIndex = groupIndex;
      }
      cursor += size;
      groupIndex += 1;
    }
  }

  return {
    entries: [...ranked, ...abandons.map((rider) => toAbandonEntry(rider, incidentOutcomes))],
    winnerTimeSeconds: actualWinnerTimeSeconds,
    timeLimitSeconds,
    regime,
    difficultyPerKm,
    firstGroupSize: groupSizes[0] ?? 0,
    timeGroupCount: groupSizes.length,
    breakawaySurvived,
    abandonCount: abandons.length,
    outsideTimeLimitCount: ranked.filter((entry) => entry.isOutsideTimeLimit).length,
  };
}

function toAbandonEntry(
  rider: QuickSimRiderInput,
  outcomes: ReadonlyMap<number, QuickSimIncidentOutcome>,
): QuickSimResultEntry {
  return {
    riderId: rider.riderId,
    stageTimeSeconds: null,
    gapSeconds: null,
    photoFinishScore: rider.photoFinishScore,
    isAbandon: true,
    isOutsideTimeLimit: false,
    groupIndex: null,
    incident: outcomes.get(rider.riderId) ?? null,
  };
}
