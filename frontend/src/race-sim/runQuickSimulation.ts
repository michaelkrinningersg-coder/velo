/**
 * Quick Simulation: ein Etappenergebnis ohne Substep-Schleife.
 *
 * Bindet den reinen Kern aus `shared/quickSim` an das Spiel an. Alles, was vor
 * dem Rennen feststeht — Favoritenwertung, Vorfaelle, Ausreisserplan — kommt
 * aus denselben Funktionen und denselben abgeleiteten Seeds wie in der
 * Instant-Simulation. Damit sehen beide Modi auf derselben Etappe mit
 * demselben Seed dieselben Stuerze und denselben Einholpunkt; sie
 * unterscheiden sich nur darin, wie aus alldem Zielzeiten werden.
 *
 * Rueckgabe ist bewusst kein `SimulationSnapshot`: der Modus simuliert keine
 * Positionen, keine Uhr und keine Cluster. Geliefert wird genau das, was der
 * Commit-Dienst braucht.
 */

import {
  resolveMarkerRanking,
  type QuickSimBreakawayPlan,
} from '../../../shared/quickSim/breakaway';
import { expandMassCrashes, type QuickSimIncident } from '../../../shared/quickSim/incidents';
import {
  simulateQuickStage,
  type QuickSimResultEntry,
  type QuickSimStageResult,
} from '../../../shared/quickSim/simulateStage';
import {
  DEFAULT_QUICK_SIM_PROFILES,
  type QuickSimProfileParameters,
} from '../../../shared/quickSimProfiles';
import { createRandomSeed, createSeededRandom, deriveSeed, type RandomSource } from '../../../shared/rng';
import {
  isChampionshipCategory,
  type PrecalculatedRaceIncident,
  type RaceSimMessage,
  type RealtimeLeadoutContribution,
  type RealtimeSimulationBootstrap,
  type RealtimeStageCommitEntry,
  type Rider,
  type RiderSkillKey,
  type StageMarkerClassification,
  type StageMarkerClassificationEntry,
  type StageProfile,
} from '../../../shared/types';
import { rankStageResultEntries } from '../../../shared/stageResultRules';
import {
  drawTeamLeadoutRandoms,
  hasSprintFinish,
  LEADOUT_SPRINTER_THRESHOLD,
  resolveFinishMarkerType,
  resolveLeadoutBonus,
} from './sprintLeadout';
import { resolveLeadoutBonusFactor, resolveSeasonFormFactor } from './terrainModifiers';
import { buildDynamicCrashIncident, precalculateRaceIncidents } from './incidents';
import { applyPreRaceRiderModifiers } from './preRaceModifiers';
import { resolveQuickSimFatigueMalus, resolveSkillsWithMentorBoosts, sampleDailyForm } from './riderCondition';
import { applySpecialFormStatesWithContext } from './specialFormStates';
import { calculateStageFavorites, calculateStageFavoriteRiderRanking } from './stageFavorites';
import { precalculateStageBreakaway } from './stageBreakaways';
import { resolveBreakawaySurvivalChance } from '../../../shared/quickSim/breakawaySurvival';
import { collectStageBoundaryMarkers, isMountainClassificationMarker } from './stageSummary';
import {
  buildStageScoringWeightMap,
  resolveFinishWeightProfile,
  resolveMarkerWeightProfile,
  resolveWeightProfileValue,
  type MarkerWeightProfile,
} from './markerWeights';

/** Wie viele Raenge je Zwischenwertung geliefert werden. Der Commit-Dienst vergibt danach die Punkte. */
const MARKER_RANKS = 15;

/**
 * Rollen, die auf Flach- und Huegeletappen vor der ersten Zeitgruppe geschuetzt
 * sind. Siehe `shared/quickSim/groupProtection.ts`.
 */
const PROTECTED_ROLES = new Set(['Kapitaen', 'Co-Kapitaen', 'Edelhelfer']);

export interface QuickSimulationOutcome {
  entries: RealtimeStageCommitEntry[];
  markerClassifications: StageMarkerClassification[];
  incidents: PrecalculatedRaceIncident[];
  events: RaceSimMessage[];
  /** Anfahrtsboni des Zielsprints, fuer die Statistik im Commit-Dienst. */
  leadoutContributions: RealtimeLeadoutContribution[];
  /** Mannschaft mit dem Tagesbonus, falls eine gezogen wurde. */
  superTeamId: number | undefined;
  /** Kennzahlen des Laufs — fuer Anzeige und Kalibrierung. */
  result: QuickSimStageResult;
  seed: number;
}

export interface RunQuickSimulationOptions {
  /** Ueberschreibt den Etappen-Seed. Sonst der aus dem Bootstrap. */
  seed?: number;
  /** Ueberschreibt die Profilparameter. Sonst die aus der Datenbank oder die Vorgabe. */
  parameters?: QuickSimProfileParameters;
}

interface StageMarkerInfo {
  key: string;
  label: string;
  markerType: StageMarkerClassification['markerType'];
  markerCategory: StageMarkerClassification['markerCategory'];
  kmMark: number;
}

/**
 * Zwischenwertungen der Etappe, in derselben Auswahl und Reihenfolge wie
 * `buildIntermediateMarkers` in der Engine.
 */
function collectIntermediateMarkers(bootstrap: RealtimeSimulationBootstrap): StageMarkerInfo[] {
  return collectStageBoundaryMarkers(bootstrap.stageSummary)
    .filter(({ marker }) => marker.type === 'sprint_intermediate' || isMountainClassificationMarker(marker))
    .map(({ key, label, marker, kmMark }) => ({
      key,
      label,
      markerType: marker.type,
      markerCategory: marker.cat,
      kmMark,
    }))
    .sort((left, right) => left.kmMark - right.kmMark);
}

export function runQuickSimulation(
  bootstrap: RealtimeSimulationBootstrap,
  options?: RunQuickSimulationOptions,
): QuickSimulationOutcome {
  const profile = bootstrap.stage.profile as StageProfile;
  const distanceKm = bootstrap.stageSummary.distanceKm;
  const elevationGainMeters = bootstrap.stageSummary.elevationGainMeters;
  const seed = options?.seed ?? bootstrap.simSeed ?? createRandomSeed();
  const parameters = options?.parameters
    ?? bootstrap.quickSimProfiles?.[profile]
    ?? DEFAULT_QUICK_SIM_PROFILES[profile];

  // Heimvorteil, Wetterprofil (samt Leutnant-Ausgleich) und Rivalendruck —
  // dieselben Zuschlaege wie in der vollen Simulation, aus demselben Modul.
  const preRace = applyPreRaceRiderModifiers({
    riders: bootstrap.riders,
    race: bootstrap.race,
    stage: bootstrap.stage,
    lieutenants: bootstrap.lieutenants,
    rivalries: bootstrap.rivalries,
    random: createSeededRandom(deriveSeed(seed, 'pre-race')),
  });
  // Mentorenbonus: die volle Simulation schlaegt ihn im Leistungsscore auf die
  // Faehigkeit auf. Hier gleich auf die Faehigkeiten, damit jede spaetere
  // Bewertung ihn sieht.
  const riders = preRace.riders.map((rider) => {
    const skills = resolveSkillsWithMentorBoosts(rider);
    return skills === rider.skills ? rider : { ...rider, skills };
  });

  // Tagesform: sie geht in jede spaetere Bewertung ein.
  const gcLeaderRiderId = bootstrap.gcStandings.find((standing) => standing.rank === 1)?.riderId ?? null;
  const dailyFormRandom = createSeededRandom(deriveSeed(seed, 'daily-form'));
  const dailyFormByRiderId = new Map(riders.map((rider) => [
    rider.id,
    sampleDailyForm(dailyFormRandom, rider.id === gcLeaderRiderId),
  ]));
  const favoriteOptions = { distanceKm, elevationGainMeters, dailyFormByRiderId };

  // Dieselben abgeleiteten Stroeme wie in SimulationEngine — gleicher Seed,
  // gleiche Stuerze, gleicher Einholpunkt.
  const precalculatedIncidents = precalculateRaceIncidents(
    riders,
    bootstrap.stage,
    distanceKm,
    createSeededRandom(deriveSeed(seed, 'incidents')),
  );
  const toQuickIncident = (incident: PrecalculatedRaceIncident): QuickSimIncident => ({
    riderId: incident.riderId,
    type: incident.type,
    severity: incident.severity,
    triggerDistanceKm: incident.triggerDistanceKm,
    waitDurationSeconds: incident.waitDurationSeconds,
    ...(incident.isMassCrashTrigger ? { isMassCrashTrigger: true } : {}),
    ...(incident.massCrashPotentialRiderIds ? { massCrashPotentialRiderIds: incident.massCrashPotentialRiderIds } : {}),
  });

  // Massenstuerze aufloesen: die volle Simulation zieht die Fahrer hinein, die
  // im Moment des Sturzes hoechstens 50 Meter entfernt sind. Ohne Positionen
  // tritt an deren Stelle ein gemessener Anteil der Kandidaten.
  const massCrashRandom = createSeededRandom(deriveSeed(seed, 'mass-crash'));
  const riderForVictim = new Map(riders.map((rider) => [rider.id, rider]));
  const incidents = expandMassCrashes(
    massCrashRandom,
    precalculatedIncidents.map(toQuickIncident),
    parameters.massCrashInvolvement,
    (riderId, triggerDistanceKm) => {
      const rider = riderForVictim.get(riderId);
      if (!rider) {
        return { riderId, type: 'crash', severity: 'light', triggerDistanceKm, waitDurationSeconds: 30 };
      }
      // Derselbe Opfer-Vorfall, den auch die Engine baut.
      return toQuickIncident(buildDynamicCrashIncident(
        rider, riders, triggerDistanceKm, distanceKm, massCrashRandom,
      ));
    },
  );

  const plan = precalculateStageBreakaway(
    riders,
    bootstrap.race,
    bootstrap.stage,
    bootstrap.stageSummary,
    calculateStageFavorites(riders, bootstrap.teams, bootstrap.stage, favoriteOptions),
    bootstrap.gcStandings,
    bootstrap.mountainStandings,
    bootstrap.teams,
    createSeededRandom(deriveSeed(seed, 'breakaway')),
  );
  // Kommt die Gruppe durch? `precalculateStageBreakaway` zieht den Einholpunkt
  // hoechstens bei 0,85 der Distanz — nach dem Plan allein wuerde also nie eine
  // Gruppe ueberleben. Die Entscheidung faellt deshalb hier, nach Rennstruktur
  // und Etappennummer, und verschiebt bei Erfolg den Einholpunkt ins Ziel.
  // Dadurch stimmen Zwischenwertungen, Meldungen und Zeitabstaende von selbst.
  const survivalRandom = createSeededRandom(deriveSeed(seed, 'breakaway-survival'));
  const survivalChance = resolveBreakawaySurvivalChance({
    profile,
    isStageRace: bootstrap.race.isStageRace,
    stageNumber: bootstrap.stage.stageNumber,
    numberOfStages: bootstrap.race.numberOfStages,
    random: survivalRandom,
  });
  const stageDistanceMeters = Math.round(distanceKm * 1000);
  const breakawaySurvives = plan != null && survivalRandom() < survivalChance;
  const breakaway: QuickSimBreakawayPlan | null = plan
    ? {
      riderIds: plan.riderIds,
      phaseEndDistanceMeters: breakawaySurvives
        ? Math.max(plan.phaseEndDistanceMeters, stageDistanceMeters)
        : plan.phaseEndDistanceMeters,
      triggerDistanceMeters: plan.triggerDistanceMeters,
      skillBonus: plan.skillBonus,
      malusValue: plan.malusValue,
    }
    : null;

  // Superform und Supermalus: derselbe Zufallsstrom wie in der Engine, damit
  // beide Modi auf derselben Etappe dieselben Fahrer treffen.
  const ridersWithSpecialStates = applySpecialFormStatesWithContext(riders, bootstrap.stage, {
    teams: bootstrap.teams,
    ...favoriteOptions,
    random: createSeededRandom(deriveSeed(seed, 'special-form')),
  });
  // Die Sonderzustaende verschieben die Tagesform — genau so rechnet die Engine.
  //
  // Die Ermuedung kommt hier ebenfalls hinein, und zwar aus einem Grund:
  // `calculateStageFavoriteRiderRanking` rechnet Saisonform und Rennform ein,
  // die Ermuedungswerte aber nicht. Fuer eine Favoritenanzeige reicht das;
  // fuer einen Leistungsscore nicht — sonst waere ein muerber Fahrer so stark
  // wie ein frischer.
  //
  // Anders als die Engine zaehlt die Quick Simulation dabei nur Kurz- und
  // Langzeitermuedung. Die Rundfahrt-Ermuedung erfasst dieselbe Belastung ein
  // zweites Mal — Begruendung in `resolveQuickSimFatigueMalus`.
  const effectiveDailyForm = new Map(ridersWithSpecialStates.map((rider) => [
    rider.id,
    (dailyFormByRiderId.get(rider.id) ?? 0)
    + (rider.specialFormDelta ?? 0)
    - resolveQuickSimFatigueMalus(rider),
  ]));

  const ranking = calculateStageFavoriteRiderRanking(
    ridersWithSpecialStates,
    bootstrap.teams,
    bootstrap.stage,
    { distanceKm, elevationGainMeters, dailyFormByRiderId: effectiveDailyForm },
  );

  // Der Zielscore ist nicht der Etappenscore: wer zeitgleich ankommt, gewinnt
  // den Sprint nach den Gewichten der Zielankunft. Vorher stand hier derselbe
  // Wert wie fuer die Etappe — mit der neuen Etappengewichtung waere ein
  // Sprinter dadurch auch im Zielsprint nicht mehr vorne gewesen.
  const finishWeights = resolveFinishWeightProfile(
    buildStageScoringWeightMap(bootstrap.stageScoringRules ?? []),
    resolveFinishMarkerType(bootstrap.stageSummary, profile),
  );
  const photoFinishByRiderId = new Map(ridersWithSpecialStates.map((rider) => [
    rider.id,
    resolveWeightProfileValue(rider.skills, finishWeights, effectiveDailyForm.get(rider.id) ?? 0),
  ]));

  const result = simulateQuickStage({
    profile,
    distanceKm,
    stageScore: bootstrap.stage.profileScore ?? null,
    parameters,
    riders: ranking.map((candidate) => ({
      riderId: candidate.rider.id,
      score: candidate.effectiveSkill,
      photoFinishScore: photoFinishByRiderId.get(candidate.rider.id) ?? candidate.effectiveSkill,
      teamId: candidate.rider.activeTeamId ?? undefined,
      isProtected: PROTECTED_ROLES.has(candidate.rider.role?.name ?? ''),
    })),
    incidents,
    breakaway,
    random: createSeededRandom(deriveSeed(seed, 'quicksim')),
  });

  const riderById = new Map(ridersWithSpecialStates.map((rider) => [rider.id, rider]));
  const breakawayRiderIds = new Set(plan?.riderIds ?? []);
  // Der Anfahrtsbonus wirkt auf den Tie-Break innerhalb der ersten Zeitgruppe,
  // nicht auf die Zielzeit — er kann den Etappensieg drehen, sonst nichts.
  const leadout = applySprintLeadout({
    bootstrap, result, riderById,
    random: createSeededRandom(deriveSeed(seed, 'leadout')),
  });
  logGroupAssembly(result, bootstrap);
  logPhotoFinishFormula(result, bootstrap, riderById, finishWeights, effectiveDailyForm);
  logPhotoFinish(result, bootstrap, riderById, leadout.perSprinter);
  const entries = buildCommitEntries(result, bootstrap, breakawayRiderIds, leadout.perSprinter);
  const markerClassifications = buildMarkerClassifications({
    bootstrap, result, breakaway, parameters, riderById,
  });

  return {
    entries,
    markerClassifications,
    incidents: precalculatedIncidents,
    events: buildEvents(result, bootstrap, plan, riderById, ridersWithSpecialStates),
    leadoutContributions: leadout.contributions,
    superTeamId: plan?.superTeamId,
    result,
    seed,
  };
}

/**
 * Schluesselt auf, wie die Zeitgruppen einer Etappe zustande kamen.
 *
 * Vier Ziehungen hintereinander, danach der Kapitaensschutz — am Ergebnis
 * sieht man nur die Endaufstellung. Dieses Log zeigt jeden Schritt:
 *
 *   1  Schwierigkeit je Kilometer  D = stage_score / km
 *   2  Regime                      P(geschlossen) = sigmoid(a + b·D), gezogen
 *   3  Anteil der ersten Gruppe    Beta-Ziehung um einen Erwartungswert
 *   4  Rueckstandskurve            Gruppengroessen und Abstaende
 *   5  Kapitaensschutz             Aufruecken geschuetzter Rollen
 *   6  Zeitgruppen                 aus den Zielzeiten, 1-Sekunden-Regel
 *
 * Schritt 6 muss nicht zu Schritt 5 passen: gezogene Gruppen, die naeher als
 * eine Sekunde beieinander liegen, verschmelzen zu einer Zeitgruppe.
 */
function logGroupAssembly(result: QuickSimStageResult, bootstrap: RealtimeSimulationBootstrap): void {
  const d = result.groupDiagnostics;
  const profile = bootstrap.stage.profile as StageProfile;
  const distanceKm = bootstrap.stageSummary.distanceKm;

  console.groupCollapsed(
    `[QuickSim] Gruppenbildung · ${bootstrap.race?.name ?? 'Rennen'} Etappe ${bootstrap.stage.stageNumber}`
    + ` (${profile}, ${distanceKm.toFixed(1)} km)`,
  );

  if (!d) {
    console.log('Zeitfahren — keine Gruppenziehung. Die Zeitgruppen entstehen allein aus den Zielzeiten.');
    console.log(`Zeitgruppen: ${result.timeGroupCount}, erste Gruppe: ${result.firstGroupSize} Fahrer`);
    console.groupEnd();
    return;
  }

  console.log(
    `1 Schwierigkeit   D = ${bootstrap.stage.profileScore ?? '—'} / ${distanceKm.toFixed(1)} km`
    + ` = ${d.difficultyPerKm.toFixed(4)} Punkte je km`,
  );
  console.log(
    `2 Regime          P(geschlossene Ankunft) = ${(d.bunchProbability * 100).toFixed(1)} %`
    + `  ->  gezogen: ${d.regime === 'bunched' ? 'geschlossen' : 'zerfallen'}`,
  );
  console.log(
    `3 Erste Gruppe    Erwartungswert ${(d.shareMean * 100).toFixed(1)} %`
    + `  ->  gezogen ${(d.drawnShare * 100).toFixed(1)} %`
    + `  ->  ${d.firstGroupSize} von ${d.finisherCount} Fahrern`,
  );
  if (d.breakawayHeadSize > 0) {
    console.log(`  Ausreissergruppe vorne: ${d.breakawayHeadSize} Fahrer bilden Gruppe 1, das Feld beginnt bei Gruppe 2.`);
  }

  console.log(`4 Gezogene Gruppen (${d.drawnGroups.length}):`);
  console.table(d.drawnGroups.slice(0, 20).map((group, index) => ({
    Gruppe: index + 1,
    Fahrer: group.size,
    Rueckstand: `${group.gapSeconds.toFixed(0)} s`,
    'je km': `${(group.gapSeconds / Math.max(1, distanceKm)).toFixed(2)} s`,
  })));

  if (d.protectedPromotions > 0 || d.protectionStrength > 0) {
    console.log(
      `5 Kapitaensschutz  Wirkung auf ${profile}: ${(d.protectionStrength * 100).toFixed(0)} %`
      + `  ->  ${d.protectedPromotions} Fahrer zusaetzlich in Gruppe 1`
      + ` (${d.drawnGroups[0]?.size ?? 0} -> ${d.protectedGroups[0]?.size ?? 0})`,
    );
  } else {
    console.log('5 Kapitaensschutz  wirkt auf diesem Profil nicht.');
  }

  const zeitgruppen = new Map<number, number>();
  for (const entry of result.entries) {
    if (entry.isAbandon || entry.groupIndex == null) {
      continue;
    }
    zeitgruppen.set(entry.groupIndex, (zeitgruppen.get(entry.groupIndex) ?? 0) + 1);
  }
  console.log(
    `6 Zeitgruppen     ${result.timeGroupCount} aus den Zielzeiten (1-Sekunden-Regel),`
    + ` erste Gruppe ${result.firstGroupSize} Fahrer`
    + `  ->  ${[...zeitgruppen.entries()].sort((a, b) => a[0] - b[0]).slice(0, 12).map(([index, n]) => `G${index + 1}:${n}`).join('  ')}`,
  );
  console.groupEnd();
}

/**
 * Zeigt, wie der `photoFinishScore` entsteht.
 *
 * Er ist nicht der Etappenscore. Der Etappenscore entscheidet, wer vorne
 * mitfaehrt; der Zielscore entscheidet den Sprint unter denen, die zeitgleich
 * ankommen. Beide benutzen andere Gewichte, und genau das ist die haeufigste
 * Verwechslung — deshalb steht die Formel hier ausgeschrieben.
 *
 *   photoFinishScore = Summe ueber die Zielgewichte von
 *                      max(0, Faehigkeit + wirksame Tagesform) · Gewicht
 *
 * "Wirksame Tagesform" ist Tagesform + Superform/Supermalus − Ermuedung.
 * Danach kommen noch der Ausreisser-Bonus/Malus und der Anfahrtsbonus dazu.
 */
function logPhotoFinishFormula(
  result: QuickSimStageResult,
  bootstrap: RealtimeSimulationBootstrap,
  riderById: ReadonlyMap<number, Rider>,
  finishWeights: MarkerWeightProfile,
  effectiveDailyForm: ReadonlyMap<number, number>,
): void {
  const profile = bootstrap.stage.profile as StageProfile;
  const finishType = resolveFinishMarkerType(bootstrap.stageSummary, profile);
  const gewichte = Object.entries(finishWeights)
    .filter(([, weight]) => (weight ?? 0) > 0)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0)) as Array<[RiderSkillKey, number]>;

  console.groupCollapsed(
    `[QuickSim] Zielscore · ${bootstrap.race?.name ?? 'Rennen'} Etappe ${bootstrap.stage.stageNumber}`
    + ` · Ankunft ${finishType}`,
  );
  console.log(
    'photoFinishScore = SUMME( max(0, Faehigkeit + wirksame Tagesform) x Gewicht )'
    + '  + Rangrauschen  + Ausreisserbonus/-malus  + Anfahrtsbonus',
  );
  console.log(
    'wirksame Tagesform = Tagesform (-4 bis +4) + Superform/Supermalus (+5 / -6)'
    + ' - halbierte Kurz- und Langzeitermuedung.'
    + `  Rangrauschen: Normalverteilung mit Sigma ${(result.groupDiagnostics?.rankNoiseSigma ?? 0).toFixed(3)} x Streuung der Etappenscores.`,
  );
  console.log(`Zielgewichte (${finishType}): ` + gewichte.map(([key, weight]) => `${key} ${weight.toFixed(2)}`).join('  ·  '));

  const ersteGruppe = result.entries
    .filter((entry) => !entry.isAbandon && entry.groupIndex === 0)
    .slice(0, 5);
  for (const entry of ersteGruppe) {
    const rider = riderById.get(entry.riderId);
    if (!rider) {
      continue;
    }
    const form = effectiveDailyForm.get(entry.riderId) ?? 0;
    const rauschen = result.groupDiagnostics?.rankNoiseByRiderId.get(entry.riderId) ?? 0;
    const skills = resolveSkillsWithMentorBoosts(rider);
    let summe = 0;
    const zeilen = gewichte.map(([key, weight]) => {
      const wert = Math.max(0, (skills[key] ?? 0) + form);
      const beitrag = wert * weight;
      summe += beitrag;
      return {
        Faehigkeit: key,
        Wert: skills[key] ?? 0,
        'mit Tagesform': Number(wert.toFixed(2)),
        Gewicht: weight,
        Beitrag: Number(beitrag.toFixed(3)),
      };
    });
    const rest = entry.photoFinishScore - summe - rauschen;
    console.log(
      `${rider.firstName} ${rider.lastName}: Basis ${summe.toFixed(3)}`
      + `  (wirksame Tagesform ${form >= 0 ? '+' : ''}${form.toFixed(2)})`
      + `  ${rauschen >= 0 ? '+' : ''}${rauschen.toFixed(3)} Rangrauschen`
      + `  ${rest >= 0 ? '+' : ''}${rest.toFixed(3)} Anfahrt/Ausreisser`
      + `  =  ${entry.photoFinishScore.toFixed(3)}`,
    );
    console.table(zeilen);
  }
  console.groupEnd();
}

/**
 * Zeigt, wer die Zeitgleichheit gewonnen hat und womit.
 *
 * Innerhalb einer Zeitgruppe entscheidet nicht die Zeit, sondern der
 * `photoFinishScore` (`rankStageResultEntries`, 1-Sekunden-Regel). Der Wert
 * ist damit die eigentliche Begruendung des Etappensiegs — und war bisher
 * nirgends sichtbar. Ausgegeben werden die Siegergruppe und jede weitere
 * Zeitgruppe mit mehr als einem Fahrer.
 */
function logPhotoFinish(
  result: QuickSimStageResult,
  bootstrap: RealtimeSimulationBootstrap,
  riderById: ReadonlyMap<number, Rider>,
  perSprinter: ReadonlyMap<number, { leadoutBonus: number; leadoutRiderId: number | null }>,
): void {
  const finisher = result.entries.filter((entry) => !entry.isAbandon && entry.groupIndex != null);
  if (finisher.length === 0) {
    return;
  }

  const gruppen = new Map<number, QuickSimResultEntry[]>();
  for (const entry of finisher) {
    const bucket = gruppen.get(entry.groupIndex as number);
    if (bucket) {
      bucket.push(entry);
    } else {
      gruppen.set(entry.groupIndex as number, [entry]);
    }
  }

  const name = (riderId: number): string => {
    const rider = riderById.get(riderId);
    return rider ? `${rider.firstName} ${rider.lastName}` : `#${riderId}`;
  };

  const profile = bootstrap.stage.profile as StageProfile;
  console.groupCollapsed(
    `[QuickSim] Zeitgleichheit · ${bootstrap.race?.name ?? 'Rennen'} Etappe ${bootstrap.stage.stageNumber}`
    + ` (${profile}) · Anfahrtsfaktor ×${resolveLeadoutBonusFactor(profile).toFixed(2)}`
    + ` · Form ×${resolveSeasonFormFactor(profile).toFixed(2)}`,
  );
  for (const [index, gruppe] of [...gruppen.entries()].sort((a, b) => a[0] - b[0])) {
    if (gruppe.length < 2 && index > 0) {
      continue;
    }
    console.log(
      `Zeitgruppe ${index + 1}: ${gruppe.length} Fahrer, Rueckstand ${(gruppe[0]?.gapSeconds ?? 0).toFixed(0)} s`
      + ' — Reihenfolge nach photoFinishScore',
    );
    console.table(gruppe.slice(0, 15).map((entry, position) => {
      const anfahrt = perSprinter.get(entry.riderId);
      return {
        Platz: position + 1,
        Fahrer: name(entry.riderId),
        photoFinishScore: Number(entry.photoFinishScore.toFixed(3)),
        Anfahrtsbonus: anfahrt ? Number(anfahrt.leadoutBonus.toFixed(3)) : 0,
        ohneAnfahrt: Number((entry.photoFinishScore - (anfahrt?.leadoutBonus ?? 0)).toFixed(3)),
        Anfahrer: anfahrt?.leadoutRiderId != null ? name(anfahrt.leadoutRiderId) : '—',
        Zeit: entry.stageTimeSeconds,
      };
    }));
  }
  console.groupEnd();
}

interface LeadoutInput {
  bootstrap: RealtimeSimulationBootstrap;
  result: QuickSimStageResult;
  riderById: ReadonlyMap<number, Rider>;
  random: RandomSource;
}

/**
 * Anfahrtsbonus im Zielsprint.
 *
 * Nur auf Flach- und Huegelankuenften, nur fuer Fahrer in der ersten
 * Zeitgruppe, und je Mannschaft nur fuer deren besten Sprinter. Der Bonus geht
 * auf den `photoFinishScore` — er entscheidet also, wer den Sprint gewinnt,
 * nicht wer wie viel Zeit verliert.
 *
 * Ohne ihn waere der Etappensieg auf einer Sprintetappe allein eine Frage des
 * Fahrerscores, und der Anfahrtszug — das Sichtbarste am Sprint — bliebe
 * wirkungslos.
 *
 * Aendert `result.entries` in der Reihenfolge, wenn der Bonus die erste Gruppe
 * umsortiert.
 */
function applySprintLeadout(input: LeadoutInput): {
  contributions: RealtimeLeadoutContribution[];
  perSprinter: Map<number, { leadoutBonus: number; leadoutRiderId: number | null }>;
} {
  const { bootstrap, result, riderById, random } = input;
  const perSprinter = new Map<number, { leadoutBonus: number; leadoutRiderId: number | null }>();
  const profile = bootstrap.stage.profile as StageProfile;
  if (!hasSprintFinish(bootstrap.stageSummary, profile)) {
    return { contributions: [], perSprinter };
  }

  const finishers = result.entries.filter((entry) => !entry.isAbandon);
  const firstGroup = finishers.filter((entry) => entry.groupIndex === 0);
  if (firstGroup.length === 0) {
    return { contributions: [], perSprinter };
  }

  // Bei Meisterschaften sind die "Teamkollegen" die Landsleute.
  const isChampionship = isChampionshipCategory(bootstrap.race?.categoryId);
  const groupIdOf = (rider: Rider): number | null => {
    if (isChampionship) {
      return rider.countryId != null ? -1 - rider.countryId : null;
    }
    return rider.activeTeamId ?? null;
  };

  const availableByRiderId = new Map(
    result.entries.map((entry) => [entry.riderId, !entry.isAbandon && !entry.isOutsideTimeLimit]),
  );
  const scoreByRiderId = new Map(finishers.map((entry) => [entry.riderId, entry.photoFinishScore]));

  // Je Gruppe der beste Sprinter, der es in die erste Zeitgruppe geschafft hat.
  const bestSprinterByGroupId = new Map<number, QuickSimResultEntry>();
  for (const entry of firstGroup) {
    const rider = riderById.get(entry.riderId);
    if (!rider || (rider.skills.sprint ?? 0) < LEADOUT_SPRINTER_THRESHOLD) {
      continue;
    }
    const groupId = groupIdOf(rider);
    if (groupId == null) {
      continue;
    }
    const current = bestSprinterByGroupId.get(groupId);
    const currentRider = current ? riderById.get(current.riderId) : null;
    const isBetter = !current
      || (scoreByRiderId.get(entry.riderId) as number) > (scoreByRiderId.get(current.riderId) as number)
      || ((scoreByRiderId.get(entry.riderId) as number) === (scoreByRiderId.get(current.riderId) as number)
        && (rider.skills.sprint ?? 0) > (currentRider?.skills.sprint ?? 0));
    if (isBetter) {
      bestSprinterByGroupId.set(groupId, entry);
    }
  }
  if (bestSprinterByGroupId.size === 0) {
    return { contributions: [], perSprinter };
  }

  const ridersByGroupId = new Map<number, Rider[]>();
  for (const rider of riderById.values()) {
    const groupId = groupIdOf(rider);
    if (groupId == null) {
      continue;
    }
    const bucket = ridersByGroupId.get(groupId) ?? [];
    bucket.push(rider);
    ridersByGroupId.set(groupId, bucket);
  }

  const contributions: RealtimeLeadoutContribution[] = [];
  let changed = false;
  // Nach Gruppen-Kennung sortiert, damit die Ziehung nicht an der
  // Fahrerreihenfolge haengt.
  for (const [groupId, sprinter] of [...bestSprinterByGroupId.entries()].sort((a, b) => a[0] - b[0])) {
    const teammates = (ridersByGroupId.get(groupId) ?? [])
      .filter((rider) => rider.id !== sprinter.riderId)
      .sort((left, right) => left.id - right.id)
      .map((rider) => ({
        riderId: rider.id,
        name: `${rider.firstName} ${rider.lastName}`,
        skills: rider.skills,
        isAvailable: availableByRiderId.get(rider.id) ?? false,
      }));
    // Terrainfaktor: auf Flach- und Rollingetappen wirkt die Anfahrt um ein
    // Viertel staerker, huegelig um 15 Prozent — der Gegenwert dazu, dass
    // Saison- und Rennform dort abgeschwaecht in den Etappenscore eingehen.
    const roher = resolveLeadoutBonus(teammates, drawTeamLeadoutRandoms(random));
    const faktor = resolveLeadoutBonusFactor(profile);
    const leadout = {
      ...roher,
      bonus: roher.bonus * faktor,
      contributions: roher.contributions.map((eintrag) => ({
        ...eintrag,
        contribution: Number((eintrag.contribution * faktor).toFixed(2)),
      })),
    };
    if (leadout.bonus <= 0) {
      continue;
    }
    sprinter.photoFinishScore += leadout.bonus;
    changed = true;
    perSprinter.set(sprinter.riderId, {
      leadoutBonus: leadout.bonus,
      leadoutRiderId: leadout.leadoutRiderId,
    });
    const teamId = riderById.get(sprinter.riderId)?.activeTeamId;
    if (teamId != null) {
      contributions.push({
        teamId,
        sprinterId: sprinter.riderId,
        leadoutBonus: leadout.bonus,
        contributorsJson: JSON.stringify(leadout.contributions),
      });
    }
  }

  if (changed) {
    // Der Bonus kann die erste Gruppe umsortieren — neu ranken, sonst stimmt
    // der Etappensieg nicht mehr mit dem photoFinishScore ueberein.
    const abandons = result.entries.filter((entry) => entry.isAbandon);
    const ranked = rankStageResultEntries(
      finishers.map((entry) => ({ ...entry, stageTimeSeconds: entry.stageTimeSeconds as number })),
      profile,
    );
    result.entries = [...ranked, ...abandons];
  }
  return { contributions, perSprinter };
}

/**
 * Ergebniszeilen fuer den Commit-Dienst. Ueber die Startliste iteriert, nicht
 * ueber das Ergebnis: der Dienst erwartet genau einen Zielstatus je Starter.
 */
function buildCommitEntries(
  result: QuickSimStageResult,
  bootstrap: RealtimeSimulationBootstrap,
  breakawayRiderIds: ReadonlySet<number>,
  leadoutByRiderId: ReadonlyMap<number, { leadoutBonus: number; leadoutRiderId: number | null }> = new Map(),
): RealtimeStageCommitEntry[] {
  const byRiderId = new Map(result.entries.map((entry) => [entry.riderId, entry]));
  return bootstrap.riders.map((starter) => {
    const entry = byRiderId.get(starter.id) ?? null;
    const isDnf = entry == null || entry.isAbandon || entry.stageTimeSeconds == null;
    return {
      riderId: starter.id,
      finishTimeSeconds: isDnf ? null : entry.stageTimeSeconds,
      finishStatus: isDnf ? 'dnf' : 'finished',
      isBreakaway: breakawayRiderIds.has(starter.id),
      statusReason: isDnf ? resolveAbandonReason(entry) : null,
      photoFinishScore: entry?.photoFinishScore,
      ...(leadoutByRiderId.get(starter.id) ?? {}),
    } satisfies RealtimeStageCommitEntry;
  });
}

function resolveAbandonReason(entry: QuickSimResultEntry | null): string | null {
  if (!entry?.incident) {
    return null;
  }
  return entry.incident.type === 'crash' ? 'Sturz' : 'Defekt';
}

interface MarkerBuildInput {
  bootstrap: RealtimeSimulationBootstrap;
  result: QuickSimStageResult;
  breakaway: QuickSimBreakawayPlan | null;
  parameters: QuickSimProfileParameters;
  riderById: ReadonlyMap<number, Rider>;
}

/**
 * Zwischenwertungen aus dem Einholpunkt.
 *
 * Der Einholpunkt steht vor dem Rennen fest (`phaseEndDistanceMeters` aus dem
 * Ausreisserplan). Wertungen davor fallen aus der Ausreissergruppe, danach aus
 * dem Kopf des Feldes — ohne dass eine Sekunde simuliert werden muss.
 */
function buildMarkerClassifications(input: MarkerBuildInput): StageMarkerClassification[] {
  const { bootstrap, result, breakaway, parameters, riderById } = input;
  const markers = collectIntermediateMarkers(bootstrap);
  if (markers.length === 0) {
    return [];
  }

  const weightMap = buildStageScoringWeightMap(bootstrap.stageScoringRules ?? []);
  const catchKm = breakaway ? breakaway.phaseEndDistanceMeters / 1000 : 0;
  const finishOrder = result.entries.filter((entry) => !entry.isAbandon).map((entry) => entry.riderId);
  // Ausreisser koennen aufgegeben haben und stehen dann nicht im Zielfeld —
  // ihre Marker-Wertung wird trotzdem gebraucht.
  const markerCandidates = [...new Set([...finishOrder, ...(breakaway?.riderIds ?? [])])];
  const winnerTimeSeconds = result.winnerTimeSeconds;
  const distanceKm = bootstrap.stageSummary.distanceKm;

  return markers.map((marker) => {
    const weights = resolveMarkerWeightProfile(weightMap, marker.markerType, marker.markerCategory);
    // Je Fahrer einmal rechnen, nicht einmal je Vergleich: der Sortiervergleich
    // wuerde denselben Wert sonst rund log2(n)-mal anfordern.
    const scoreByRiderId = new Map<number, number>();
    for (const riderId of markerCandidates) {
      const rider = riderById.get(riderId);
      // Derselbe deterministische Tie-Break wie in der Engine, damit zwei
      // gleich starke Fahrer nicht an jeder Wertung in derselben Reihenfolge
      // stehen.
      scoreByRiderId.set(riderId, rider
        ? resolveWeightProfileValue(rider.skills, weights)
          + (resolveDeterministicRatio(`${bootstrap.stage.id}:${marker.key}:${riderId}`) * 25)
        : 0);
    }
    const resolveMarkerScore = (riderId: number): number => scoreByRiderId.get(riderId) ?? 0;

    const fieldOrder = [...finishOrder].sort(
      (left, right) => resolveMarkerScore(right) - resolveMarkerScore(left) || left - right,
    );
    const ranking = resolveMarkerRanking({
      markerKm: marker.kmMark,
      rankCount: MARKER_RANKS,
      catchKm,
      plan: breakaway,
      parameters,
      fieldOrderByMarkerScore: fieldOrder,
      resolveMarkerScore,
    });

    // Die Ueberquerungszeit ist keine gemessene Groesse, sondern aus dem
    // Kilometer und der Siegerzeit hochgerechnet — der Commit-Dienst braucht
    // sie nur, um die Reihenfolge zu halten.
    const crossingTimeSeconds = distanceKm > 0
      ? Math.round((marker.kmMark / distanceKm) * winnerTimeSeconds)
      : 0;
    const entries: StageMarkerClassificationEntry[] = ranking.riderIds.map((riderId, index) => ({
      riderId,
      rank: index + 1,
      crossingTimeSeconds: crossingTimeSeconds + index,
      gapSeconds: index,
      photoFinishScore: resolveMarkerScore(riderId),
    }));

    return {
      markerKey: marker.key,
      markerLabel: marker.label,
      markerType: marker.markerType,
      markerCategory: marker.markerCategory,
      kmMark: marker.kmMark,
      entries,
    };
  });
}

/** FNV-1a, identisch zu `resolveDeterministicRatio` in der Engine. */
function resolveDeterministicRatio(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

/**
 * Ereignisse der Etappe.
 *
 * Der Modus simuliert nichts, hat aber trotzdem etwas zu erzaehlen: die
 * Ausreissergruppe, der Einholpunkt und die Stuerze stehen alle vorberechnet
 * fest. Das ist der Unterschied zwischen einer Ergebnistabelle und einer
 * Etappe, die stattgefunden hat.
 */
function buildEvents(
  result: QuickSimStageResult,
  bootstrap: RealtimeSimulationBootstrap,
  plan: { riderIds: number[]; triggerDistanceMeters: number; phaseEndDistanceMeters: number; superTeamId?: number } | null,
  riderById: ReadonlyMap<number, Rider>,
  ridersWithSpecialStates: readonly Rider[],
): RaceSimMessage[] {
  const events: RaceSimMessage[] = [];
  const distanceKm = bootstrap.stageSummary.distanceKm;
  const winnerTimeSeconds = result.winnerTimeSeconds;
  const atKm = (kmMark: number): number => (distanceKm > 0
    ? Math.round((kmMark / distanceKm) * winnerTimeSeconds)
    : 0);
  const nameOf = (riderId: number): string => {
    const rider = riderById.get(riderId);
    return rider ? `${rider.firstName} ${rider.lastName}` : `Fahrer ${riderId}`;
  };
  let nextId = 1;

  if (plan?.superTeamId != null) {
    const team = bootstrap.teams.find((entry) => entry.id === plan.superTeamId);
    events.push({
      id: nextId += 1,
      elapsedSeconds: 0,
      riderId: null,
      riderName: null,
      riderTeamId: plan.superTeamId,
      type: 'superteam',
      tone: 'neutral',
      title: `Superteam des Tages: ${team ? team.name : `Team ${plan.superTeamId}`}`,
      detail: 'Die Mannschaft faehrt heute ueber ihrem Niveau.',
      kmMark: 0,
    });
  }

  for (const rider of ridersWithSpecialStates) {
    if (!rider.hasSuperform && !rider.hasSupermalus) {
      continue;
    }
    events.push({
      id: nextId += 1,
      elapsedSeconds: 0,
      riderId: rider.id,
      riderName: `${rider.firstName} ${rider.lastName}`,
      riderTeamId: rider.activeTeamId ?? null,
      type: 'superteam',
      tone: rider.hasSuperform ? 'neutral' : 'warning',
      title: rider.hasSuperform ? 'Superform' : 'Supermalus',
      detail: `${rider.firstName} ${rider.lastName} startet mit ${(rider.specialFormDelta ?? 0) >= 0 ? '+' : ''}${(rider.specialFormDelta ?? 0).toFixed(1)} Form.`,
      kmMark: 0,
    });
  }

  if (plan && plan.riderIds.length > 0) {
    const triggerKm = plan.triggerDistanceMeters / 1000;
    events.push({
      id: nextId += 1,
      elapsedSeconds: atKm(triggerKm),
      riderId: plan.riderIds[0] ?? null,
      riderName: plan.riderIds[0] != null ? nameOf(plan.riderIds[0]) : null,
      riderTeamId: null,
      type: 'attack',
      tone: 'neutral',
      title: `Ausreissergruppe gebildet: ${plan.riderIds.length} Fahrer`,
      detail: plan.riderIds.map(nameOf).join(', '),
      kmMark: Math.round(triggerKm * 10) / 10,
    });

    const catchKm = plan.phaseEndDistanceMeters / 1000;
    if (catchKm < distanceKm && !result.breakawaySurvived) {
      events.push({
        id: nextId += 1,
        elapsedSeconds: atKm(catchKm),
        riderId: null,
        riderName: null,
        riderTeamId: null,
        type: 'attack',
        tone: 'neutral',
        title: 'Ausreisser gestellt',
        detail: `Das Feld holt die Spitzengruppe bei Kilometer ${catchKm.toFixed(1)} ein.`,
        kmMark: Math.round(catchKm * 10) / 10,
      });
    } else if (result.breakawaySurvived) {
      events.push({
        id: nextId += 1,
        elapsedSeconds: winnerTimeSeconds,
        riderId: null,
        riderName: null,
        riderTeamId: null,
        type: 'attack',
        tone: 'neutral',
        title: 'Die Ausreisser kommen durch',
        detail: 'Das Feld bekommt die Spitzengruppe nicht mehr zu fassen.',
        kmMark: Math.round(distanceKm * 10) / 10,
      });
    }
  }

  for (const entry of result.entries) {
    const incident = entry.incident;
    if (!incident) {
      continue;
    }
    const rider = riderById.get(entry.riderId);
    events.push({
      id: nextId += 1,
      elapsedSeconds: atKm(incident.triggerDistanceKm),
      riderId: entry.riderId,
      riderName: nameOf(entry.riderId),
      riderTeamId: rider?.activeTeamId ?? null,
      type: entry.isAbandon ? 'dnf' : 'incident',
      tone: entry.isAbandon ? 'danger' : 'warning',
      title: incident.type === 'crash' ? 'Sturz' : 'Defekt',
      detail: entry.isAbandon
        ? `${nameOf(entry.riderId)} kann das Rennen nicht fortsetzen.`
        : `${nameOf(entry.riderId)} verliert ${Math.round(incident.timeLossSeconds)} Sekunden.`,
      kmMark: Math.round(incident.triggerDistanceKm * 10) / 10,
    });
  }

  return events.sort((left, right) => left.elapsedSeconds - right.elapsedSeconds);
}
