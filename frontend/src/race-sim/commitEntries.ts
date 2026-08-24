/**
 * Uebersetzt einen Simulations-Snapshot in die Ergebniszeilen, die der
 * Commit-Dienst erwartet.
 *
 * Lag urspruenglich in `views/liveRace.ts`, gehoert dort aber nicht hin: die
 * Funktion kennt nur Snapshot und Bootstrap, keine Ansicht. Hier liegt sie so,
 * dass auch der Kalibrier-Harness sie benutzen kann — sonst muesste er die
 * Zeitfahr-Sonderbehandlung nachbauen und wuerde falsch messen.
 */

import type {
  RealtimeSimulationBootstrap,
  RealtimeStageCommitEntry,
} from '../../../shared/types';
import type { SimulationSnapshot } from './SimulationEngine';

export function buildRealtimeCommitEntries(
  snapshot: SimulationSnapshot,
  bootstrap: RealtimeSimulationBootstrap,
): RealtimeStageCommitEntry[] {
  // Der Commit erwartet GENAU einen Zielstatus je Starter (= bootstrap.riders,
  // dieselbe Quelle wie die Startliste beim Speichern). Daher ueber die
  // Startliste iterieren statt einzelne Sim-Ergebnisse zu verwerfen: Ein
  // Starter ohne gueltige Zielzeit, der nicht als DNF markiert ist (Sim-Randfall
  // bei viel Attrition/OTL auf spaeten GT-Etappen), wird als DNF gewertet — so
  // bleibt die Anzahl der uebergebenen Ergebnisse konsistent.
  const isTimeTrial = bootstrap.stage.profile === 'ITT' || bootstrap.stage.profile === 'TTT';
  const snapshotByRiderId = new Map(snapshot.riders.map((rider) => [rider.riderId, rider]));
  return bootstrap.riders.map((starter) => {
    const rider = snapshotByRiderId.get(starter.id);
    const finishTime = rider ? (isTimeTrial ? rider.riderClockSeconds : rider.finishTimeSeconds) : null;
    let finishStatus = rider?.finishStatus ?? 'finished';
    if (finishStatus !== 'dnf' && finishTime == null) {
      finishStatus = 'dnf';
    }
    return {
      riderId: starter.id,
      finishTimeSeconds: finishStatus === 'dnf' ? null : finishTime,
      finishStatus,
      isBreakaway: rider?.isBreakaway,
      statusReason: rider?.statusReason ?? null,
      photoFinishScore: rider?.photoFinishScore,
      leadoutRiderId: rider?.leadoutRiderId,
      leadoutBonus: rider?.leadoutBonus,
    } satisfies RealtimeStageCommitEntry;
  });
}
