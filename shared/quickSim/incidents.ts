/**
 * Vorfaelle in der Quick Simulation.
 *
 * Die Vorfaelle selbst werden nicht hier gezogen — sie kommen unveraendert aus
 * `precalculateRaceIncidents()`, damit Quick und Instant dieselben Stuerze und
 * Defekte auf derselben Etappe kennen. Was hier passiert, ist die Umrechnung
 * eines Vorfalls in Zeitverlust und Aufgabe, ohne die Substep-Schleife.
 *
 * Der Kern ist eine Beobachtung aus der vollen Simulation: die Wartezeit ist
 * nicht der Schaden. Der Schaden ist der verlorene Anschluss — und der kostet
 * umso mehr, je frueher der Vorfall passiert und je schwerer das Profil ist.
 *
 *   verlust = wartezeit · m(profil) · (1 + restKm / km)
 *
 * Bei einem Sturz auf den letzten Metern bleibt es damit fast bei der
 * Wartezeit; bei Kilometer 40 einer Bergetappe wird daraus ein Vielfaches.
 */

import type { QuickSimProfileParameters } from '../quickSimProfiles';
import type { RandomSource } from '../rng';

/** Was die Quick Sim von einem vorberechneten Vorfall braucht. */
export interface QuickSimIncident {
  riderId: number;
  type: 'crash' | 'mechanical';
  severity: 'light' | 'medium' | 'severe' | null;
  triggerDistanceKm: number;
  waitDurationSeconds: number;
  /** Dieser Sturz kann weitere Fahrer mitreissen. */
  isMassCrashTrigger?: boolean;
  /** Wer dabei ueberhaupt in Frage kommt. Vorberechnet, wie in der vollen Sim. */
  massCrashPotentialRiderIds?: readonly number[];
}

/**
 * Loest Massenstuerze in einzelne Vorfaelle auf.
 *
 * Die volle Simulation kennt Positionen: sie zieht in einen Massensturz genau
 * die Fahrer hinein, die im Moment des Sturzes hoechstens 50 Meter entfernt
 * sind. Die Quick Simulation hat keine Positionen — an ihre Stelle tritt ein
 * Anteil: welcher Teil der vorberechneten Kandidaten es tatsaechlich trifft.
 *
 * Ohne diese Aufloesung stuerzt nur der Ausloeser. Das faellt umso mehr ins
 * Gewicht, seit das Wetter die Simulation wieder erreicht: bei Regen
 * verfuenffacht sich die Sturzwahrscheinlichkeit, und damit auch die Zahl der
 * Massenstuerze.
 *
 * Der Opfer-Vorfall wird nicht hier gebaut, sondern hereingereicht — die volle
 * Simulation hat dafuer `buildDynamicCrashIncident`, und zwei Fassungen
 * derselben Sturzschwere waeren genau die Doppelpflege, die auseinanderlaeuft.
 */
export function expandMassCrashes(
  random: RandomSource,
  incidents: readonly QuickSimIncident[],
  involvementShare: number,
  buildVictimIncident: (riderId: number, triggerDistanceKm: number) => QuickSimIncident,
): QuickSimIncident[] {
  const expanded = [...incidents];
  if (involvementShare <= 0) {
    return expanded;
  }

  // Wer schon einen Vorfall hat, wird nicht zusaetzlich mitgerissen — sonst
  // zaehlte derselbe Sturz doppelt.
  const alreadyAffected = new Set(incidents.map((incident) => incident.riderId));
  for (const incident of incidents) {
    if (!incident.isMassCrashTrigger || !incident.massCrashPotentialRiderIds) {
      continue;
    }
    for (const victimId of incident.massCrashPotentialRiderIds) {
      if (alreadyAffected.has(victimId) || random() >= involvementShare) {
        continue;
      }
      alreadyAffected.add(victimId);
      expanded.push(buildVictimIncident(victimId, incident.triggerDistanceKm));
    }
  }
  return expanded;
}

export interface QuickSimIncidentOutcome {
  riderId: number;
  /** Zeitverlust in Sekunden. Bei Aufgabe ohne Bedeutung. */
  timeLossSeconds: number;
  /** Aufgabe: der Fahrer erreicht das Ziel nicht. */
  isAbandon: boolean;
  severity: 'light' | 'medium' | 'severe' | null;
  type: 'crash' | 'mechanical';
  triggerDistanceKm: number;
}

/**
 * Zeitverlust eines einzelnen Vorfalls.
 *
 * Die Restdistanz geht als Anteil der Gesamtdistanz ein, nicht in Kilometern:
 * ein Sturz bei der Haelfte kostet auf jeder Etappe das Anderthalbfache der
 * Wartezeit mal Profilmultiplikator, unabhaengig davon, ob sie 120 oder 240 km
 * lang ist.
 */
export function resolveIncidentTimeLossSeconds(
  incident: QuickSimIncident,
  parameters: QuickSimProfileParameters,
  distanceKm: number,
): number {
  if (distanceKm <= 0) {
    return Math.max(0, incident.waitDurationSeconds);
  }
  const remainingKm = Math.max(0, distanceKm - Math.max(0, incident.triggerDistanceKm));
  const reconnectFactor = 1 + (remainingKm / distanceKm);
  const loss = Math.max(0, incident.waitDurationSeconds)
    * parameters.incidentLossMultiplier
    * reconnectFactor;
  return Math.round(loss);
}

/**
 * Wertet alle Vorfaelle einer Etappe aus.
 *
 * Mehrere Vorfaelle desselben Fahrers summieren sich; die erste Aufgabe
 * beendet seine Etappe, spaetere Vorfaelle zaehlen dann nicht mehr. Die
 * Reihenfolge der Ziehung haengt an der Vorfallliste, nicht an der Fahrerliste
 * — sonst waere das Ergebnis von der Sortierung der Fahrer abhaengig.
 */
export function resolveIncidentOutcomes(
  random: RandomSource,
  incidents: readonly QuickSimIncident[],
  parameters: QuickSimProfileParameters,
  distanceKm: number,
): Map<number, QuickSimIncidentOutcome> {
  const byRider = new Map<number, QuickSimIncidentOutcome>();

  const ordered = [...incidents].sort((left, right) => left.triggerDistanceKm - right.triggerDistanceKm);
  for (const incident of ordered) {
    const existing = byRider.get(incident.riderId);
    if (existing?.isAbandon) {
      continue;
    }

    // Ein schwerer Sturz beendet die Etappe — dieselbe Regel wie in der vollen
    // Simulation, wo `severity === 'severe'` den Fahrer unmittelbar auf DNF
    // setzt. Vorher entschied hier zusaetzlich ein Wurf gegen
    // `severeDnfChance`: derselbe Sturz beendete in der vollen Simulation das
    // Rennen und liess den Fahrer in der Quick Simulation zu drei Vierteln
    // weiterfahren — verletzt, denn die Verletzung haengt in beiden Faellen
    // allein an der Schwere.
    const isAbandon = incident.type === 'crash' && incident.severity === 'severe';
    const timeLossSeconds = resolveIncidentTimeLossSeconds(incident, parameters, distanceKm);

    if (!existing) {
      byRider.set(incident.riderId, {
        riderId: incident.riderId,
        timeLossSeconds,
        isAbandon,
        severity: incident.severity,
        type: incident.type,
        triggerDistanceKm: incident.triggerDistanceKm,
      });
      continue;
    }

    existing.timeLossSeconds += timeLossSeconds;
    if (isAbandon) {
      existing.isAbandon = true;
      existing.severity = incident.severity;
      existing.type = incident.type;
      existing.triggerDistanceKm = incident.triggerDistanceKm;
    }
  }

  return byRider;
}
