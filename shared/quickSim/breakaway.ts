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
import type { StageProfile } from '../types';
import type { RandomSource } from '../rng';
import { drawStandardNormal, drawTailGroupSize } from './groupModel';
import { TIME_TIE_THRESHOLD_SECONDS } from '../stageResultRules';

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
 *
 * Den Einholpunkt zieht `resolveBreakawaySurvivalChance()` aus
 * `breakawaySurvival.ts` ins Ziel, wenn die Gruppe laufen gelassen wird — die
 * Entscheidung faellt also weiterhin allein an dieser einen Stelle.
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

/**
 * Wie viel einer durchgekommenen Ausreissergruppe wirklich vorne ankommt.
 *
 * Eine Gruppe, die nicht gestellt wird, faehrt trotzdem nicht geschlossen ins
 * Ziel. Am letzten Anstieg attackiert einer, zwei folgen, der Rest zerfaellt
 * und wird vom Feld noch aufgesammelt. Bisher stand die komplette Gruppe
 * zeitgleich auf den vordersten Plaetzen — auf einer Hochgebirgsetappe waren
 * das acht Fahrer mit demselben Rueckstand vor dem Feld, was es so nicht gibt.
 *
 * Der Anteil, der durchkommt, ist terrainabhaengig: je haerter das Profil,
 * desto weniger. Im Hochgebirge zerlegt der Anstieg die Gruppe, huegelig
 * kommt sie oft komplett an. Unten liegt die Grenze ueberall bei zehn
 * Prozent — mindestens der Etappensieger kommt durch, sonst waere die Gruppe
 * gestellt worden.
 *
 * Durchkommen heisst: der Fahrer steht vor dem ersten Nicht-Ausreisser. Wer
 * nicht durchkommt, wird eingeholt und reiht sich im Feld ein.
 */
export const BREAKAWAY_SURVIVOR_SHARE_MIN = 0.1;

export const BREAKAWAY_SURVIVOR_SHARE_MAX: Partial<Record<StageProfile, number>> = {
  Mountain: 0.5,
  High_Mountain: 0.5,
  Medium_Mountain: 0.75,
  Hilly_Difficult: 0.75,
  Hilly: 1,
};

export function resolveBreakawaySurvivorShareMax(profile: StageProfile | null | undefined): number {
  return (profile ? BREAKAWAY_SURVIVOR_SHARE_MAX[profile] : undefined) ?? 1;
}

/**
 * Zieht den durchkommenden Anteil.
 *
 * Normalverteilt zwischen Unter- und Obergrenze: Mittelwert in der Mitte,
 * Streuung ein Viertel der Spanne, damit die Grenzen bei zwei Sigma liegen
 * und die Ziehung nur selten abgeschnitten wird.
 */
export function drawBreakawaySurvivorShare(
  random: RandomSource,
  profile: StageProfile | null | undefined,
): number {
  const max = resolveBreakawaySurvivorShareMax(profile);
  const min = Math.min(BREAKAWAY_SURVIVOR_SHARE_MIN, max);
  const mitte = (min + max) / 2;
  const sigma = (max - min) / 4;
  return Math.min(max, Math.max(min, mitte + (drawStandardNormal(random) * sigma)));
}

/**
 * Wie viele Ausreisser durchkommen. Immer mindestens einer: der Etappensieger.
 */
export function resolveBreakawaySurvivorCount(
  random: RandomSource,
  breakawaySize: number,
  profile: StageProfile | null | undefined,
): number {
  if (breakawaySize <= 0) {
    return 0;
  }
  const anteil = drawBreakawaySurvivorShare(random, profile);
  return Math.min(breakawaySize, Math.max(1, Math.round(anteil * breakawaySize)));
}

/**
 * Abzug auf den Score fuer einen eingeholten Ausreisser.
 *
 * Er hat den Tag vorne verbracht und kommt mit leeren Beinen zurueck: er
 * reiht sich im Feld ein wie jeder andere, nur drei Punkte schwaecher.
 */
export const CAUGHT_BREAKAWAY_SCORE_MALUS = 3;

/** Mittlere Groesse einer Gruppe innerhalb der durchgekommenen Ausreisser. */
export const BREAKAWAY_FRAGMENT_MEAN_SIZE = 1.5;

/**
 * Anteil des Restvorsprungs, ueber den sich die durchgekommenen Ausreisser
 * verteilen. Die Obergrenze liegt unter eins, damit auch der letzte von ihnen
 * vor dem Feld bleibt — sonst waere er nicht durchgekommen.
 */
export const BREAKAWAY_FRAGMENT_SPREAD_RANGE = { min: 0.15, max: 0.8 };

/**
 * Wie sich die Abstaende ueber die Spanne verteilen. Ueber eins heisst:
 * vorne dicht, hinten weit — der Etappensieger faehrt seinen Vorsprung
 * heraus, das Ende der Gruppe verliert dahinter deutlich mehr.
 */
export const BREAKAWAY_FRAGMENT_GAP_EXPONENT = 1.5;

/** Mindestabstand zweier Ausreissergruppen, damit sie getrennt bleiben. */
const MIN_FRAGMENT_SPLIT_SECONDS = TIME_TIE_THRESHOLD_SECONDS + 1;

export interface BreakawayFragment {
  /** Wie viele Fahrer in dieser Gruppe stehen. */
  size: number;
  /** Rueckstand auf den Etappensieger in Sekunden. */
  gapSeconds: number;
}

/**
 * Teilt die durchgekommenen Ausreisser in Zeitgruppen auf.
 *
 * Die Reihenfolge steht schon fest — sie kommt aus dem Score. Hier faellt nur
 * noch, wer mit wem zeitgleich ankommt und wie weit die Gruppen auseinander
 * liegen. Die Gruppengroessen sind geometrisch verteilt um einen kleinen
 * Mittelwert: meist faehrt der Sieger allein, dahinter kommen Einzelne und
 * Paare.
 *
 * Die Abstaende werden als Positionen in der gezogenen Spanne gezogen und
 * sortiert. Dadurch sind sie unregelmaessig — mal folgt der Zweite nach
 * zwanzig Sekunden, mal nach zwei Minuten — ohne dass ein Fahrer den vor ihm
 * liegenden ueberholen kann.
 */
export function buildBreakawayFragments(
  random: RandomSource,
  survivorCount: number,
  leadSeconds: number,
): BreakawayFragment[] {
  if (survivorCount <= 0) {
    return [];
  }
  // Mehr Gruppen, als der Restvorsprung hergibt, kann es nicht geben: die
  // letzte muesste sonst hinter dem Feld liegen, und dann waere sie nicht
  // durchgekommen.
  const maxGruppen = Math.max(
    1,
    1 + Math.floor(Math.max(0, leadSeconds - 1) / MIN_FRAGMENT_SPLIT_SECONDS),
  );
  const groessen: number[] = [];
  let rest = survivorCount;
  while (rest > 0) {
    const groesse = groessen.length + 1 >= maxGruppen
      ? rest
      : drawTailGroupSize(random, BREAKAWAY_FRAGMENT_MEAN_SIZE, rest);
    groessen.push(groesse);
    rest -= groesse;
  }
  if (groessen.length <= 1) {
    return groessen.map((size) => ({ size, gapSeconds: 0 }));
  }

  const { min, max } = BREAKAWAY_FRAGMENT_SPREAD_RANGE;
  const spanne = Math.max(0, leadSeconds) * (min + (random() * (max - min)));
  const positionen = groessen.slice(1)
    .map(() => Math.pow(random(), BREAKAWAY_FRAGMENT_GAP_EXPONENT))
    .sort((links, rechts) => links - rechts);

  // Jede Gruppe muss sichtbar hinter der vorigen liegen, sonst faellt sie
  // durch die 1-Sekunden-Regel wieder mit ihr zusammen und die Aufteilung
  // waere umsonst gewesen. Nach oben bleibt gleichzeitig Platz fuer alle
  // Gruppen, die noch kommen — die letzte muss vor dem Feld bleiben.
  const letzte = groessen.length - 1;
  let vorher = 0;
  return groessen.map((size, index) => {
    if (index === 0) {
      return { size, gapSeconds: 0 };
    }
    const obergrenze = leadSeconds - 1 - ((letzte - index) * MIN_FRAGMENT_SPLIT_SECONDS);
    const gapSeconds = Math.min(
      obergrenze,
      Math.max(vorher + MIN_FRAGMENT_SPLIT_SECONDS, Math.round(spanne * (positionen[index - 1] as number))),
    );
    vorher = gapSeconds;
    return { size, gapSeconds };
  });
}
