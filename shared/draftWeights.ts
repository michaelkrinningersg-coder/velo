/**
 * Gewichtung eines Draft-Picks.
 *
 * Frueher stand diese Rechnung zweimal im RiderDraftService — einmal fuer den
 * echten Pick, einmal fuer die Kandidatenanzeige — und die beiden Kopien
 * konnten auseinanderlaufen. Jetzt steht sie hier, ohne Datenbankzugriff: der
 * Dienst sammelt die Zahlen, diese Datei entscheidet.
 *
 * Alles ist multiplikativ. Vorher war es gemischt: Grundgewicht 1,0, darauf
 * die Quote mit +15 und der Fokus mit +4. Ein additiver Bonus von 15 auf eine
 * Basis von 1 ist aber kein Bonus, sondern eine Entscheidung — gemessen kam
 * dabei heraus, dass der Teamfokus zwischen 5 und 32 von 40 Fahrern traf, also
 * gar nicht wirkte. Faktoren lassen sich dagegen gegeneinander abwaegen und
 * bleiben lesbar: x2,2 ist doppelt so wichtig wie x1,1.
 *
 * Die Basis ist neu und der Grund, warum das ueberhaupt geht: sie faellt
 * exponentiell mit dem Abstand zum besten verfuegbaren Fahrer. Vorher war sie
 * fuer die Raenge 1 bis 20 konstant 1,0 — die Qualitaet des Fahrers spielte im
 * Pick keine Rolle, sie steckte nur darin, wer ueberhaupt in den Pool kam. Mit
 * den eigenen auslaufenden Fahrern im Pool (siehe RiderDraftService) waere das
 * nicht mehr tragbar: ein Wassertraeger haette dieselbe Chance wie der beste
 * Free Agent.
 */

/** Punkte Draftwert, um die das Gewicht auf 1/e faellt. */
export const DRAFT_VALUE_FALLOFF = 4.0;

/** Faktoren der Nationenbindung. Siehe `NationPreferenceKind`. */
export const NATION_FACTORS = { home: 3.0, neighbour: 2.1, scouting: 1.7, none: 1 } as const;
export type NationPreferenceKind = keyof typeof NATION_FACTORS;

/**
 * Ab dieser Gesamtwertung (oder diesem Potenzial) zaehlt die Nationalitaet
 * nicht mehr: wer gut genug ist, wird ueberall genommen.
 *
 * Ohne diese Ausnahme waere die staerkere Nationenbindung ein Nachteil fuer
 * genau die Fahrer, die sie nicht treffen soll — der starke Kolumbianer im
 * belgischen Team. Gemessen liegt der beste Fahrer ohne Vertrag in jeder
 * Nation bei Gesamtwertung 68 bis 70; die Schwelle liegt bewusst darueber.
 */
export const NATION_BLIND_OVERALL = 74;
export const NATION_BLIND_POTENTIAL = 76;

/** Faktoren des Teamfokus, je Rang des Fokus. */
export const FOCUS_FACTORS = [2.2, 1.7, 1.3] as const;
/**
 * Anteil des Kaders, den die drei Fokusspezialisierungen ausmachen sollen.
 *
 * Nicht 0,45, obwohl drei von sieben Spezialisierungen rechnerisch 43 % waeren:
 * das Feld ist schief besetzt (Sprint und Huegel stellen zwei Drittel aller
 * Fahrer), und die Teams lagen schon vor der Umstellung im Mittel bei 53 %.
 * Ein Ziel von 0,45 waere damit fuer die meisten Teams sofort erfuellt gewesen
 * und der Fokusfaktor haette nie gegriffen — gemessen bewegte sich der Anteil
 * dann nur von 53 auf 56 %.
 */
export const FOCUS_TARGET_SHARE = 0.6;

/** Faktoren der Loyalitaet, nach Zugehoerigkeit in Saisons. */
export const LOYALTY_FACTOR_CORE = 3.0;   // ab 3 Saisons im Team
export const LOYALTY_FACTOR_RECENT = 2.0; // 1 bis 2 Saisons
/** Daempfung fuer Fahrer, die ihren Zenit hinter sich haben. */
export const LOYALTY_FACTOR_DECLINING = 0.6;

/** Faktor, wenn eine Spezialisierungsquote des Teams offen ist. */
export const QUOTA_FACTOR = 1.8;

/**
 * Verteilung der Spitzenfahrer.
 *
 * Gemessen hielt ein Team acht starke Bergfahrer, waehrend vier Teams keinen
 * hatten — und 15 Teams hatten keinen starken Sprinter. Die alte Regel war
 * eine Stufe (-15 ab dem zweiten) und half in beiden Faellen nicht: bei Berg
 * stieg sie nach dem zweiten nicht weiter, bei Sprint griff sie nie, weil es
 * gar nicht so viele gibt.
 *
 * Neu eine Rampe nach unten und ein Bonus nach oben. Der Zielwert je Team
 * kommt aus der tatsaechlichen Knappheit: gibt es 10 starke Pflasterfahrer
 * fuer 25 Teams, ist der Zielwert 1 und der Bonus alles, was zaehlt.
 */
export const STRONG_RIDER_OVERALL = 75;
export const STRONG_STACK_FALLOFF = 0.6;
export const STRONG_MISSING_FACTOR = 2.0;

export interface DraftRiderInput {
  riderId: number;
  overall: number;
  potential: number;
  age: number;
  /** Wert, nach dem der Pool sortiert ist. */
  draftValue: number;
  specialization1Id: number | null;
  specialization2Id: number | null;
  specialization3Id: number | null;
  countryId: number | null;
  /** Team der abgelaufenen Saison, falls es eines gab. */
  oldTeamId: number | null;
  /** Saisons, die der Fahrer schon bei diesem Team ist. 0 wenn neu. */
  tenureSeasons: number;
  /** Hat der Fahrer sein Decline Age erreicht? */
  isDeclining: boolean;
}

export interface DraftTeamInput {
  teamId: number;
  focusSpecIds: Array<number | null>;
  /** Nationen mit ihrer Bindungsart. */
  nationKindByCountryId: ReadonlyMap<number, NationPreferenceKind>;
  /** Spezialisierungen, deren Quote noch offen ist und denen der Fahrer helfen kann. */
  openQuotaSpecIds: ReadonlySet<number>;
  /** Quoten, die auch ueber Zweit- und Drittspezialisierung erfuellbar sind. */
  quotaSpecIdsCountingSecondary: ReadonlySet<number>;
  /** Zahl starker Fahrer je Erstspezialisierung im Kader. */
  strongCountBySpecId: ReadonlyMap<number, number>;
  /** Zielwert starker Fahrer je Spezialisierung, aus der Knappheit im Feld. */
  strongTargetBySpecId: ReadonlyMap<number, number>;
  /** Anteil des Kaders in den drei Fokusspezialisierungen. */
  focusShare: number;
  /** Rang des Teams in der Draft-Reihenfolge, 0 ist das beste Team. */
  rankIndex: number;
}

export interface DraftWeightBreakdown {
  weight: number;
  blocked: boolean;
  factors: string[];
}

const runde = (value: number): string => value.toFixed(2);

/** Faktor der Nationenbindung fuer einen Fahrer. */
export function resolveNationFactor(rider: DraftRiderInput, team: DraftTeamInput): number {
  if (rider.overall >= NATION_BLIND_OVERALL || rider.potential >= NATION_BLIND_POTENTIAL) {
    return NATION_FACTORS.none;
  }
  if (rider.countryId == null) return NATION_FACTORS.none;
  return NATION_FACTORS[team.nationKindByCountryId.get(rider.countryId) ?? 'none'];
}

/**
 * Faktor des Teamfokus. Er schrumpft, je naeher der Kader am Zielanteil ist —
 * ein Team, das seine 45 % beisammen hat, nimmt wieder den besten Fahrer.
 */
export function resolveFocusFactor(rider: DraftRiderInput, team: DraftTeamInput): number {
  const rang = team.focusSpecIds.findIndex((specId) => specId != null && specId === rider.specialization1Id);
  if (rang < 0 || rang >= FOCUS_FACTORS.length) return 1;
  const luecke = Math.max(0, Math.min(1, (FOCUS_TARGET_SHARE - team.focusShare) / FOCUS_TARGET_SHARE));
  return 1 + ((FOCUS_FACTORS[rang] as number) - 1) * luecke;
}

/** Faktor der Loyalitaet gegenueber einem eigenen auslaufenden Fahrer. */
export function resolveLoyaltyFactor(rider: DraftRiderInput, team: DraftTeamInput): number {
  if (rider.oldTeamId !== team.teamId) return 1;
  const basis = rider.tenureSeasons >= 3 ? LOYALTY_FACTOR_CORE : LOYALTY_FACTOR_RECENT;
  return rider.isDeclining ? Math.max(1, basis * LOYALTY_FACTOR_DECLINING) : basis;
}

/** Faktor der offenen Spezialisierungsquoten. */
export function resolveQuotaFactor(rider: DraftRiderInput, team: DraftTeamInput): number {
  for (const specId of team.openQuotaSpecIds) {
    const hilft = team.quotaSpecIdsCountingSecondary.has(specId)
      ? (rider.specialization1Id === specId || rider.specialization2Id === specId || rider.specialization3Id === specId)
      : rider.specialization1Id === specId;
    if (hilft) return QUOTA_FACTOR;
  }
  return 1;
}

/** Faktor der Spitzenverteilung: Bonus bei Luecke, Rampe bei Haeufung. */
export function resolveStrongSpreadFactor(rider: DraftRiderInput, team: DraftTeamInput): number {
  if (rider.overall < STRONG_RIDER_OVERALL || rider.specialization1Id == null) return 1;
  const vorhanden = team.strongCountBySpecId.get(rider.specialization1Id) ?? 0;
  const ziel = team.strongTargetBySpecId.get(rider.specialization1Id) ?? 1;
  if (vorhanden === 0) return STRONG_MISSING_FACTOR;
  if (vorhanden < ziel) return 1;
  return 1 / (1 + (STRONG_STACK_FALLOFF * (vorhanden - ziel + 1)));
}

/**
 * Gewicht eines Fahrers fuer ein Team.
 *
 * `topCapFactor` und `topCapBlocked` kommen von aussen, weil die Kappe an der
 * eskalierenden Parität aller Teams haengt und damit nicht ohne Datenbank
 * bestimmbar ist.
 */
export function resolveDraftWeight(
  rider: DraftRiderInput,
  team: DraftTeamInput,
  bestDraftValue: number,
  topCap: { factor: number; blocked: boolean; label: string | null },
): DraftWeightBreakdown {
  const factors: string[] = [];
  if (topCap.blocked) {
    return { weight: 0.01, blocked: true, factors: topCap.label ? [topCap.label] : ['Top-Kappe'] };
  }

  let weight = Math.exp(-Math.max(0, bestDraftValue - rider.draftValue) / DRAFT_VALUE_FALLOFF);
  factors.push(`Qualitaet ${runde(weight)}`);

  // Die schwaechsten fuenf Teams greifen bewusst nach Talenten statt nach
  // fertigen Fahrern — sie haben die spaeten Picks und brauchen Perspektive.
  if (team.rankIndex >= 20 && rider.age < 25) {
    weight *= 4;
    factors.push('U25 der Schlusslichter (x4)');
  }

  const anwenden = (faktor: number, name: string) => {
    if (faktor === 1) return;
    weight *= faktor;
    factors.push(`${name} (x${runde(faktor)})`);
  };

  anwenden(resolveNationFactor(rider, team), 'Nation');
  anwenden(resolveFocusFactor(rider, team), 'Teamfokus');
  anwenden(resolveLoyaltyFactor(rider, team), 'Loyalitaet');
  anwenden(resolveQuotaFactor(rider, team), 'Quote');
  anwenden(resolveStrongSpreadFactor(rider, team), 'Spitzenverteilung');
  anwenden(topCap.factor, topCap.label ?? 'Top-Kappe');

  return { weight: Math.max(0.01, weight), blocked: false, factors };
}
