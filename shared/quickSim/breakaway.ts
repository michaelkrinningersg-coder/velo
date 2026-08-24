/**
 * Ausreissergruppe und Einholpunkt in der Quick Simulation.
 *
 * Der Einholpunkt wird nicht hier erfunden: `precalculateStageBreakaway()`
 * zieht ihn schon heute vor dem Rennen als `phaseEndDistanceMeters`. Die Quick
 * Sim liest ihn nur — dadurch holen beide Modi die Ausreisser per Konstruktion
 * am selben Kilometer ein.
 *
 * Daraus folgt alles Weitere ohne einen einzigen simulierten Schritt: welche
 * Zwischenwertung aus der Ausreissergruppe faellt und welche aus dem Feld, wie
 * viele Ausreisser zum jeweiligen Zeitpunkt noch vorne sind, und ob die Gruppe
 * bis ins Ziel kommt.
 */

import type { QuickSimProfileParameters } from '../quickSimProfiles';

/** Woher der Sieger einer Zwischenwertung kommt. */
export type MarkerSource = 'breakaway' | 'field';

export interface QuickSimBreakawayPlan {
  riderIds: readonly number[];
  /** Meter, an dem die Gruppe gestellt wird. */
  phaseEndDistanceMeters: number;
  /** Meter, ab dem die Gruppe vorne ist. */
  triggerDistanceMeters: number;
  /** Score-Bonus der Ausreisser aus dem Plan. */
  skillBonus?: number;
  /** Score-Malus, wenn die Gruppe gestellt wird. */
  malusValue?: number;
}

/**
 * Kommt die Ausreissergruppe durch?
 *
 * Liegt der Einholpunkt jenseits der Zieldistanz, wird sie nie gestellt. Das
 * ist eine strukturelle Entscheidung, kein Score-Bonus: der Etappensieg faellt
 * dann zwingend aus der Gruppe, sonst gaebe es Etappen, deren Ausreisser nie
 * eingeholt wurden und die trotzdem ein Sprinter gewinnt.
 */
export function resolveBreakawaySurvives(
  plan: QuickSimBreakawayPlan | null,
  stageDistanceMeters: number,
): boolean {
  if (!plan || plan.riderIds.length === 0 || stageDistanceMeters <= 0) {
    return false;
  }
  return plan.phaseEndDistanceMeters >= stageDistanceMeters;
}

/**
 * Groesse der Ausreissergruppe an einem Kilometer.
 *
 *   n(km) = max(1, ceil( n₀ · (1 − (km / km_einhol)^p) ))
 *
 * Ohne diese Ausduennung gewinnt derselbe Ausreisser jede Wertung bis zum
 * Einholpunkt — was nach zwei Etappen auffaellt. Der Exponent steuert, wann
 * die Gruppe zerfaellt: ueber 1 haelt sie lange zusammen und broeckelt erst
 * kurz vor dem Einholpunkt.
 */
export function resolveBreakawaySizeAtKm(
  initialSize: number,
  markerKm: number,
  catchKm: number,
  parameters: QuickSimProfileParameters,
): number {
  if (initialSize <= 0) {
    return 0;
  }
  if (catchKm <= 0 || markerKm >= catchKm) {
    return Math.min(initialSize, 1);
  }
  const progress = Math.max(0, markerKm) / catchKm;
  const remaining = 1 - Math.pow(progress, Math.max(0.1, parameters.breakawayShrinkExponent));
  return Math.min(initialSize, Math.max(1, Math.ceil(initialSize * remaining)));
}

/**
 * Aus welchem Feld die Punkte einer Zwischenwertung kommen.
 * Vor dem Einholpunkt die Ausreisser, ab dem Einholpunkt das Feld.
 */
export function resolveMarkerSource(markerKm: number, catchKm: number): MarkerSource {
  return markerKm < catchKm ? 'breakaway' : 'field';
}

export interface MarkerRankingInput {
  markerKm: number;
  /** Wie viele Raenge die Wertung vergibt. */
  rankCount: number;
  catchKm: number;
  plan: QuickSimBreakawayPlan | null;
  parameters: QuickSimProfileParameters;
  /** Feldreihenfolge fuer diesen Marker, absteigend nach Marker-Score. */
  fieldOrderByMarkerScore: readonly number[];
  /**
   * Marker-Score je Fahrer. Entscheidet, welche Ausreisser bis hierhin vorne
   * geblieben sind — ein Kletterer haelt am Berg laenger durch, ein Sprinter
   * im Flachen.
   */
  resolveMarkerScore: (riderId: number) => number;
}

export interface MarkerRanking {
  source: MarkerSource;
  /** Fahrer in Reihenfolge der Raenge. Hoechstens `rankCount` Eintraege. */
  riderIds: number[];
  /** Wie viele Ausreisser an diesem Kilometer noch vorne waren. */
  breakawaySize: number;
}

/**
 * Reihenfolge an einer Zwischenwertung.
 *
 * Reicht die geschrumpfte Gruppe nicht fuer alle Punkteraenge — ein
 * Zwischensprint vergibt oft acht Plaetze, vorne sind aber nur drei —, kommen
 * die restlichen Raenge aus dem Kopf des Feldes. Das entspricht dem, was im
 * echten Rennen passiert.
 */
export function resolveMarkerRanking(input: MarkerRankingInput): MarkerRanking {
  const { markerKm, rankCount, catchKm, plan, parameters, fieldOrderByMarkerScore, resolveMarkerScore } = input;
  const source = resolveMarkerSource(markerKm, catchKm);

  const takeFromField = (exclude: ReadonlySet<number>, count: number): number[] => {
    const picked: number[] = [];
    for (const riderId of fieldOrderByMarkerScore) {
      if (picked.length >= count) {
        break;
      }
      if (!exclude.has(riderId)) {
        picked.push(riderId);
      }
    }
    return picked;
  };

  if (source === 'field' || !plan || plan.riderIds.length === 0) {
    return {
      source: 'field',
      riderIds: takeFromField(new Set(), Math.max(0, rankCount)),
      breakawaySize: 0,
    };
  }

  const breakawaySize = resolveBreakawaySizeAtKm(plan.riderIds.length, markerKm, catchKm, parameters);
  const leaders = [...plan.riderIds]
    .sort((left, right) => resolveMarkerScore(right) - resolveMarkerScore(left) || left - right)
    .slice(0, breakawaySize);

  const riderIds = leaders.slice(0, Math.max(0, rankCount));
  if (riderIds.length < rankCount) {
    riderIds.push(...takeFromField(new Set(plan.riderIds), rankCount - riderIds.length));
  }

  return { source: 'breakaway', riderIds, breakawaySize };
}
