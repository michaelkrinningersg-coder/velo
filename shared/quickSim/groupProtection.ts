/**
 * Schutz der Kapitaene und Edelhelfer vor der ersten Zeitgruppe.
 *
 * Die Quick Simulation kennt keinen Windschatten. In der vollen Simulation
 * bleibt ein Kapitaen mit schwachem Flachwert trotzdem im Feld, weil Mitfahren
 * viel weniger kostet, als der Skill-Unterschied nahelegt — hier faellt er
 * heraus. Diese Regel ist der Ersatz fuer das fehlende Windschattenmodell,
 * kein Kunstgriff.
 *
 * Sie wirkt als *Schutz*, nicht als Score-Bonus: der Fahrer kommt in die
 * Gruppe, sein `photoFinishScore` bleibt unberuehrt. Er faehrt also zeitgleich
 * ins Ziel, gewinnt den Sprint aber deswegen nicht.
 *
 * Nur auf Flach-, Rolling- und Huegeletappen; am Berg entscheidet die Beine,
 * nicht die Position. Und nur ohne Sturz oder Defekt — wer stuerzt, verliert
 * den Anschluss auch als Kapitaen.
 */

import type { RandomSource } from '../rng';
import type { StageProfile } from '../types';
import type { FinishGroup } from './groupModel';

/**
 * Wie stark der Schutz je Profil wirkt. Auf der Flachetappe haelt praktisch
 * jeder Kapitaen die Gruppe, huegelig wird es schon eng, und auf schweren
 * Huegeletappen faellt auch ein Kapitaen regelmaessig heraus.
 */
export const PROTECTION_STRENGTH: Partial<Record<StageProfile, number>> = {
  Flat: 1.0,
  Rolling: 1.0,
  Hilly: 0.6,
  Hilly_Difficult: 0.35,
};

/** Hoechstens dieser Anteil einer Gruppe wird ausgetauscht oder angehaengt. */
export const MAX_PROTECTED_SHARE = 0.25;

/** In der Haelfte der Faelle wird getauscht, in der anderen angehaengt. */
const SWAP_CHANCE = 0.5;

export interface GroupProtectionInput {
  groups: FinishGroup[];
  profile: StageProfile;
  /** Indizes (in die nach Score sortierte Liste) der geschuetzten Fahrer. */
  protectedIndices: ReadonlySet<number>;
  /**
   * Fahrer, die beim Tausch nicht zurueckfallen duerfen. Nicht dieselbe Menge
   * wie `protectedIndices`: ein gestuerzter Kapitaen rueckt nicht mehr auf,
   * soll aber auch nicht als Tauschopfer nach hinten gereicht werden. Ohne
   * Angabe gilt `protectedIndices`.
   */
  undisplaceableIndices?: ReadonlySet<number>;
  random: RandomSource;
}

/**
 * Zieht geschuetzte Fahrer nach vorne.
 *
 * Von der ersten Gruppe an: solange das Kontingent reicht, ruecken die besten
 * geschuetzten Fahrer aus den hinteren Gruppen auf. Wer nicht mehr
 * hineinpasst, kommt bei der naechsten Gruppe erneut in Frage.
 *
 * Anhaengen macht die Gruppe groesser, Tauschen laesst ihre Groesse — und die
 * ist gegen die volle Simulation kalibriert. Deshalb die Haelfte so, die
 * Haelfte so.
 */
export function applyGroupProtection(input: GroupProtectionInput): FinishGroup[] {
  const { groups, profile, protectedIndices, random } = input;
  const undisplaceable = input.undisplaceableIndices ?? protectedIndices;
  const strength = PROTECTION_STRENGTH[profile] ?? 0;
  if (strength <= 0 || protectedIndices.size === 0 || groups.length < 2) {
    return groups;
  }

  // Gruppenzugehoerigkeit als Nachschlagewerk, damit Verschieben billig bleibt.
  const groupOf = new Map<number, number>();
  groups.forEach((group, index) => {
    for (const member of group.memberIndices) {
      groupOf.set(member, index);
    }
  });

  for (let target = 0; target < groups.length - 1; target += 1) {
    const group = groups[target] as FinishGroup;
    let budget = Math.floor(group.memberIndices.length * MAX_PROTECTED_SHARE);
    if (budget <= 0) {
      continue;
    }

    // Kandidaten: geschuetzte Fahrer aus hinteren Gruppen, die besten zuerst.
    // Der Index ist die Score-Reihenfolge, kleiner heisst staerker.
    const candidates = [...protectedIndices]
      .filter((member) => (groupOf.get(member) ?? 0) > target)
      .sort((left, right) => left - right);

    for (const member of candidates) {
      if (budget <= 0) {
        break;
      }
      if (random() >= strength) {
        continue;
      }

      const from = groupOf.get(member) as number;
      const source = groups[from] as FinishGroup;
      source.memberIndices = source.memberIndices.filter((entry) => entry !== member);
      group.memberIndices.push(member);
      groupOf.set(member, target);
      budget -= 1;

      if (random() < SWAP_CHANCE) {
        // Tauschen: der schwaechste ungeschuetzte Fahrer der Gruppe rueckt in
        // die Gruppe, aus welcher der geschuetzte gekommen ist.
        const displaced = [...group.memberIndices]
          .filter((entry) => !undisplaceable.has(entry))
          .sort((left, right) => right - left)[0];
        if (displaced != null) {
          group.memberIndices = group.memberIndices.filter((entry) => entry !== displaced);
          source.memberIndices.push(displaced);
          groupOf.set(displaced, from);
        }
      }
    }
  }

  // Innerhalb jeder Gruppe die Score-Reihenfolge wiederherstellen und leere
  // Gruppen entfernen — sie haetten sonst einen Rueckstand ohne Fahrer.
  for (const group of groups) {
    group.memberIndices.sort((left, right) => left - right);
  }
  return groups.filter((group) => group.memberIndices.length > 0);
}
