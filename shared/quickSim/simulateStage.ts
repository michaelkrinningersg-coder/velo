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
  drawStandardNormal,
  drawFirstGroupShare,
  resolveBunchProbability,
  resolveDifficultyPerKm,
  resolveFirstGroupShareMean,
  resolveFirstGroupSize,
  resolveWinnerTimeSeconds,
  type FinishRegime,
} from './groupModel';
import { applyGroupProtection, PROTECTION_STRENGTH } from './groupProtection';
import { resolveRankNoiseFactor, resolveTieBreakNoiseFactor } from './terrainModifiers';
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

/**
 * Vorsprung einer Gruppe, die per Ziehung durchgekommen ist. Ungemessen: im
 * Referenzlauf gab es keinen einzigen solchen Fall, weil es die Ziehung noch
 * nicht gab. Die Spanne entspricht dem, was in einer Rundfahrt ueblich ist.
 */
const DRAWN_BREAKAWAY_LEAD_SECONDS = { min: 20, max: 240 };

export interface QuickSimRiderInput {
  riderId: number;
  /** Leistungsscore aus `calculateStageFavorites()`, hoeher ist besser. */
  score: number;
  /** Tie-Break innerhalb einer Zeitgruppe, wie in der vollen Simulation. */
  photoFinishScore: number;
  /** Nur fuer das Mannschaftszeitfahren noetig — dort ist das Team die Gruppe. */
  teamId?: number;
  /**
   * Kapitaen, Co-Kapitaen oder Edelhelfer: faellt auf Flach- und
   * Huegeletappen nur mit Sturz oder Defekt aus der ersten Gruppe.
   */
  isProtected?: boolean;
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

/**
 * Nachvollziehbarkeit der Gruppenbildung.
 *
 * Die Zeitgruppen entstehen aus vier Ziehungen hintereinander — Regime,
 * Anteil der ersten Gruppe, Rueckstandskurve, Gruppengroessen — und werden
 * danach vom Kapitaensschutz noch einmal verschoben. Am Ergebnis ist von
 * alldem nur die Endaufstellung zu sehen. Diese Aufschluesselung haelt die
 * Zwischenschritte fest, damit sich eine ueberraschende Gruppe erklaeren
 * laesst, ohne den Lauf nachzustellen.
 */
export interface QuickSimGroupDiagnostics {
  difficultyPerKm: number;
  /** P(geschlossene Ankunft) aus der Schwierigkeit je Kilometer. */
  bunchProbability: number;
  regime: FinishRegime;
  /** Erwartungswert des Anteils der ersten Gruppe vor der Ziehung. */
  shareMean: number;
  /** Gezogener Anteil. */
  drawnShare: number;
  finisherCount: number;
  /** Groesse der ersten Gruppe aus dem gezogenen Anteil. */
  firstGroupSize: number;
  /** Gruppen wie gezogen, vor dem Kapitaensschutz. */
  drawnGroups: Array<{ size: number; gapSeconds: number }>;
  /** Gruppen nach dem Kapitaensschutz. */
  protectedGroups: Array<{ size: number; gapSeconds: number }>;
  /** Wie viele Fahrer der Schutz nach vorne gezogen hat. */
  protectedPromotions: number;
  /** Anteil der geschuetzten Fahrer, die aufruecken durften. */
  protectionStrength: number;
  /** Ausreissergruppe vorne? Dann ist Gruppe 1 die Ausreissergruppe. */
  breakawayHeadSize: number;
  /**
   * Rangrauschen je Fahrer. Es trifft den Ordnungsscore *und* den
   * `photoFinishScore` — ohne diese Groesse laesst sich der Zielscore eines
   * Fahrers nicht aus seinen Faehigkeiten nachrechnen.
   */
  rankNoiseByRiderId: ReadonlyMap<number, number>;
  /** Streuung, aus der das Rangrauschen gezogen wurde — inklusive Terrainfaktor. */
  rankNoiseSigma: number;
  /** Anteil des Rangrauschens, der auf den Tie-Break geht. */
  tieBreakNoiseFactor: number;
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
  /** Nur auf Strassenetappen belegt; beim Zeitfahren gibt es keine Ziehung. */
  groupDiagnostics?: QuickSimGroupDiagnostics;
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

/**
 * Streut die Reihenfolge um den Leistungsscore.
 *
 * Die Scores allein ergeben ein Rennen, das dem Favoritentipp zu genau folgt:
 * gemessen an der Rangkorrelation kam die Quick Simulation auf Flachetappen
 * auf 0,81, die volle Simulation auf 0,47. Zeiten, Gruppen und Abstaende
 * koennen stimmen und es gewinnen trotzdem immer dieselben.
 *
 * Die Streuung ist ein Vielfaches der Score-Streuung im Feld — damit wirkt sie
 * in einem engen Feld genauso stark wie in einem breiten, statt in dem einen
 * alles umzuwerfen und im anderen nichts.
 *
 * Sie trifft beides: die Reihenfolge *und* den Tie-Break im Ziel. Nur auf die
 * Reihenfolge gelegt, blieb sie auf Flachetappen wirkungslos — dort kommen
 * neun von zehn Fahrern zeitgleich an, und wer gewinnt, entscheidet der
 * Zielsprint, nicht die Gruppenzuordnung.
 */
function drawRankNoise(
  random: RandomSource,
  scores: ReadonlyMap<number, number>,
  rankNoise: number,
): Map<number, number> {
  const noise = new Map<number, number>();
  if (rankNoise <= 0 || scores.size < 2) {
    return noise;
  }
  const values = [...scores.values()];
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const spread = Math.sqrt(
    values.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / (values.length - 1),
  );
  if (spread <= 0) {
    return noise;
  }
  // Nach Fahrer-ID, damit die Ziehung nicht an der Reihenfolge der Map haengt.
  for (const riderId of [...scores.keys()].sort((left, right) => left - right)) {
    noise.set(riderId, drawStandardNormal(random) * spread * rankNoise);
  }
  return noise;
}

/**
 * Fahrer mit dem Score, mit dem sie ins Rennen gehen.
 *
 * Der Ausreisser-Malus muss auch den `photoFinishScore` treffen, nicht nur die
 * Reihenfolge. Sonst gewinnt ein gestellter Ausreisser den Sprint innerhalb
 * seiner Zeitgruppe — er sitzt zwar hinten im Feld, hat aber unveraendert den
 * hoechsten Tie-Break-Wert, und genau das war er nach 150 Kilometern vorne
 * eben nicht mehr.
 */
function applyScoreShiftToEntries(
  riders: readonly QuickSimRiderInput[],
  input: QuickSimStageInput,
  breakawaySurvived: boolean,
  rankNoise: ReadonlyMap<number, number>,
  tieBreakNoiseFactor: number,
): QuickSimRiderInput[] {
  const plan = input.breakaway;
  const shift = plan ? (breakawaySurvived ? (plan.skillBonus ?? 0) : -(plan.malusValue ?? 0)) : 0;
  const affected = new Set(plan?.riderIds ?? []);
  return riders.map((rider) => {
    const delta = (affected.has(rider.riderId) ? shift : 0)
      + ((rankNoise.get(rider.riderId) ?? 0) * tieBreakNoiseFactor);
    return delta === 0 ? rider : { ...rider, photoFinishScore: rider.photoFinishScore + delta };
  });
}

/** Restvorsprung der ueberlebenden Ausreissergruppe im Ziel. */
export function resolveSurvivingBreakawayLeadSeconds(
  plan: QuickSimBreakawayPlan,
  distanceKm: number,
  random?: RandomSource,
): number {
  const surplusKm = Math.max(0, (plan.phaseEndDistanceMeters / 1000) - distanceKm);
  if (surplusKm <= 0) {
    // Die Gruppe kam nicht deshalb durch, weil der Einholpunkt hinter dem Ziel
    // lag, sondern weil die Ziehung sie hat laufen lassen. Dann gibt der Plan
    // keinen Vorsprung her und er wird gezogen.
    if (!random) {
      return DRAWN_BREAKAWAY_LEAD_SECONDS.min;
    }
    const { min, max } = DRAWN_BREAKAWAY_LEAD_SECONDS;
    return Math.round(min + (random() * (max - min)));
  }
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
  // Das Rangrauschen wird einmal gezogen und zweimal verwendet: voll auf die
  // Reihenfolge des Feldes, abgeschwaecht auf den Tie-Break. Beides mit
  // demselben Zufallswert je Fahrer, damit ein Fahrer, den der Zufall nach
  // vorne traegt, im Sprint nicht gegenlaeufig behandelt wird.
  const rankNoise = drawRankNoise(random, scores, parameters.rankNoise * resolveRankNoiseFactor(profile));
  for (const [riderId, delta] of rankNoise) {
    scores.set(riderId, (scores.get(riderId) as number) + delta);
  }
  const tieBreakFactor = resolveTieBreakNoiseFactor(profile);
  const sorted = applyScoreShiftToEntries(finishers, input, breakawaySurvived, rankNoise, tieBreakFactor).sort(
    (left, right) => (scores.get(right.riderId) as number) - (scores.get(left.riderId) as number)
      || left.riderId - right.riderId,
  );

  const regime = drawFinishRegime(random, parameters, difficultyPerKm);
  const gapByRiderId = new Map<number, number>();
  const groupIndexByRiderId = new Map<number, number>();
  let diagnostics: QuickSimGroupDiagnostics | undefined;
  if (breakawaySurvived && input.breakaway) {
    // Die Ausreisser bilden Gruppe 1, das Feld beginnt bei Gruppe 2. Der
    // Etappensieg faellt damit zwingend aus der Gruppe — nicht als Bonus, der
    // sich gegen einen starken Sprinter auch mal nicht durchsetzt.
    const breakawayIds = new Set(input.breakaway.riderIds);
    const head = sorted.filter((rider) => breakawayIds.has(rider.riderId));
    const field = sorted.filter((rider) => !breakawayIds.has(rider.riderId));
    const leadSeconds = resolveSurvivingBreakawayLeadSeconds(input.breakaway, distanceKm, random);

    for (const rider of head) {
      gapByRiderId.set(rider.riderId, 0);
      groupIndexByRiderId.set(rider.riderId, 0);
    }
    const headGroupCount = head.length > 0 ? 1 : 0;

    const fieldShare = drawFirstGroupShare(random, parameters, regime, difficultyPerKm);
    const fieldGroups = buildFinishGroups({
      scoresDescending: field.map((rider) => scores.get(rider.riderId) as number),
      firstGroupSize: resolveFirstGroupSize(fieldShare, field.length),
      distanceKm,
      parameters,
      profile,
      random,
    });
    fieldGroups.forEach((group, index) => {
      for (const memberIndex of group.memberIndices) {
        const rider = field[memberIndex] as QuickSimRiderInput;
        gapByRiderId.set(rider.riderId, leadSeconds + group.gapSeconds);
        groupIndexByRiderId.set(rider.riderId, headGroupCount + index);
      }
    });
    diagnostics = {
      difficultyPerKm,
      bunchProbability: resolveBunchProbability(parameters, difficultyPerKm),
      regime,
      shareMean: resolveFirstGroupShareMean(parameters, regime, difficultyPerKm),
      drawnShare: fieldShare,
      finisherCount: sorted.length,
      firstGroupSize: resolveFirstGroupSize(fieldShare, field.length),
      drawnGroups: fieldGroups.map((group) => ({ size: group.memberIndices.length, gapSeconds: leadSeconds + group.gapSeconds })),
      protectedGroups: fieldGroups.map((group) => ({ size: group.memberIndices.length, gapSeconds: leadSeconds + group.gapSeconds })),
      protectedPromotions: 0,
      protectionStrength: 0,
      breakawayHeadSize: head.length,
      rankNoiseByRiderId: rankNoise,
      rankNoiseSigma: parameters.rankNoise * resolveRankNoiseFactor(profile),
      tieBreakNoiseFactor: tieBreakFactor,
    };
  } else {
    const share = drawFirstGroupShare(random, parameters, regime, difficultyPerKm);
    const firstGroupSize = resolveFirstGroupSize(share, sorted.length);
    const drawnGroups = buildFinishGroups({
      scoresDescending: sorted.map((rider) => scores.get(rider.riderId) as number),
      firstGroupSize,
      distanceKm,
      parameters,
      profile,
      random,
    });
    // Zustand vor dem Kapitaensschutz festhalten — `applyGroupProtection`
    // aendert die Gruppen an Ort und Stelle.
    const vorSchutz = drawnGroups.map((group) => ({ size: group.memberIndices.length, gapSeconds: group.gapSeconds }));
    const groups = applyGroupProtection({
      groups: drawnGroups,
      profile,
      // Wer gestuerzt ist oder einen Defekt hatte, verliert den Anschluss auch
      // als Kapitaen — dafuer ist die Ausnahme da.
      protectedIndices: new Set(sorted.flatMap((rider, index) => (
        rider.isProtected && !incidentOutcomes.has(rider.riderId) ? [index] : []
      ))),
      // Zurueckfallen darf dagegen keiner von ihnen: ein gestuerzter Kapitaen
      // rueckt zwar nicht mehr auf, soll aber auch nicht als Tauschopfer nach
      // hinten gereicht werden, nur weil ein anderer aufrueckt.
      undisplaceableIndices: new Set(sorted.flatMap((rider, index) => (
        rider.isProtected ? [index] : []
      ))),
      random,
    });
    diagnostics = {
      difficultyPerKm,
      bunchProbability: resolveBunchProbability(parameters, difficultyPerKm),
      regime,
      shareMean: resolveFirstGroupShareMean(parameters, regime, difficultyPerKm),
      drawnShare: share,
      finisherCount: sorted.length,
      firstGroupSize,
      drawnGroups: vorSchutz,
      protectedGroups: groups.map((group) => ({ size: group.memberIndices.length, gapSeconds: group.gapSeconds })),
      protectedPromotions: Math.max(0, (groups[0]?.memberIndices.length ?? 0) - (vorSchutz[0]?.size ?? 0)),
      protectionStrength: PROTECTION_STRENGTH[profile] ?? 0,
      breakawayHeadSize: 0,
      rankNoiseByRiderId: rankNoise,
      rankNoiseSigma: parameters.rankNoise * resolveRankNoiseFactor(profile),
      tieBreakNoiseFactor: tieBreakFactor,
    };
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
    diagnostics,
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
  diagnostics?: QuickSimGroupDiagnostics | undefined;
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
    diagnostics,
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
    ...(diagnostics ? { groupDiagnostics: diagnostics } : {}),
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
