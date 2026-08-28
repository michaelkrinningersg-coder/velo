/**
 * Wie sich die Faehigkeiten eines Fahrers ueber seine Laufbahn entwickeln.
 *
 * Drei Abschnitte, dazwischen keine Sonderfaelle:
 *
 *   Aufbau     bis zum Zielalter waechst jeder Skill mit einer festen Rate auf
 *              sein Potenzial zu
 *   Plateau    zwischen Zielalter und Abbaubeginn steht er still
 *   Abbau      ab dem Abbaubeginn faellt er auf seinen Sockel, den er mit
 *              `PROGRESSION_FLOOR_AGE` erreicht
 *
 * Die Rate ist in beiden Richtungen dieselbe Konstruktion: verbleibender Weg
 * geteilt durch verbleibende Zeit. Das hat zwei Eigenschaften, auf denen das
 * ganze Modell steht.
 *
 * Erstens ist sie konstant, obwohl sie taeglich neu bestimmt wird:
 *
 *     S' = S + (P - S)/D   =>   (P - S')/(D - 1) = (P - S)/D
 *
 * Zweitens korrigiert sie sich selbst. Wer zurueckliegt, hat eine groessere
 * Restluecke und dadurch von allein eine hoehere Rate — es braucht keinen
 * zweiten Mechanismus, der ihn aufholen laesst, und ein Fahrer aus einem alten
 * Spielstand wird dort aufgenommen, wo er gerade steht.
 *
 * Aus derselben Eigenschaft folgt, dass sich Tage buendeln lassen, ohne dass
 * ein Fehler entsteht: dreissig Schritte mit der Rate sind exakt ein Schritt
 * mit dem Dreissigfachen. Fahrer ausserhalb der ersten Liga koennen deshalb
 * einmal im Monat gerechnet werden und stehen danach auf demselben Wert wie
 * einer, der taeglich gerechnet wurde.
 */

import type { RiderSkillKey } from './types';

/** Ab diesem Alter beginnt die Laufbahn im Modell. */
export const PROGRESSION_START_AGE = 16;

/**
 * Alter, mit dem jeder Skill seinen Sockel erreicht hat.
 *
 * Der Wert ist die Stellschraube fuer das Tempo des Abbaus: er streckt den Weg
 * zum Sockel, ohne den Sockel selbst oder die Form der Kurve zu veraendern.
 * Erreicht wird er nie — der spaeteste Ruhestand liegt bei 38.
 *
 * Von 43 auf 55 erhoeht, um den Abbau nach dem Abbaubeginn um rund ein Drittel
 * zu verlangsamen. An 200 Fahrern gemessen: fuenf Jahre nach dem Abbaubeginn
 * 6,90 statt 10,66 Punkte Verlust (65 Prozent), acht Jahre danach 9,62 statt
 * 14,88 (ebenfalls 65 Prozent) — die Kurve wird gleichmaessig flacher. Die
 * Kehrseite ist der hoehere Wert am Karriereende: 67,4 statt 63,4.
 */
export const PROGRESSION_FLOOR_AGE = 55;

/** Tiefster Sockel — darunter faellt kein Skill, egal wie klein sein Potenzial ist. */
export const PROGRESSION_MIN_FLOOR = 50;

/** Wie weit ein Skill unter sein Potenzial faellt, solange der Sockel nicht greift. */
export const PROGRESSION_DECLINE_DEPTH = 20;

/** Um so viel ist der Abbau vor dem Karriereende schneller als danach. */
export const DECLINE_ACCELERATION_BEFORE_RETIREMENT = 3;

/** Alter, bis zu dem der Entwicklungswert einen langsamen Fahrer bremst. */
export const DEVELOPMENT_SLOWDOWN_UNTIL_AGE = 21;

/** Frueheste Ankunft am Potenzial, egal wie hoch der Entwicklungswert ist. */
export const EARLIEST_TARGET_AGE = 21;

/**
 * Versatz auf Peak Age und Abbaubeginn je Skill.
 *
 * Sprint und Antritt sind zwei Jahre frueher am Maximum, Ausdauer, Resistenz
 * und Regeneration zwei Jahre spaeter. Der Abbaubeginn wandert nur nach hinten
 * mit (siehe `resolveEffectiveDeclineAge`): Sprint und Antritt halten ihr
 * Maximum bis zum normalen Abbaubeginn und gewinnen dadurch zwei Jahre
 * Plateau, die Ausdauergruppe behaelt ihre Plateaulaenge.
 *
 * `bikeHandling` steht nicht in der Tabelle, weil es nicht entwickelt, sondern
 * aus anderen Werten abgeleitet wird.
 */
export const SKILL_PEAK_OFFSET: Partial<Record<RiderSkillKey, number>> = {
  sprint: -2,
  acceleration: -2,
  stamina: 2,
  resistance: 2,
  recuperation: 2,
};

export function resolveSkillPeakOffset(skillKey: RiderSkillKey): number {
  return SKILL_PEAK_OFFSET[skillKey] ?? 0;
}

export function resolveEffectivePeakAge(peakAge: number, skillKey: RiderSkillKey): number {
  return peakAge + resolveSkillPeakOffset(skillKey);
}

/**
 * Der Abbaubeginn wandert nur nach hinten mit, nie nach vorn.
 *
 * Sonst faengt der Sprintwert zwei Jahre frueher an zu fallen, obwohl er nur
 * frueher oben sein soll. Und ohne das Mitwandern nach hinten laege das
 * Maximum der Ausdauergruppe bei rund einem Siebtel der Fahrer hinter ihrem
 * Abbaubeginn — der Wert wuerde gleichzeitig wachsen und fallen.
 */
export function resolveEffectiveDeclineAge(declineAge: number, skillKey: RiderSkillKey): number {
  return declineAge + Math.max(0, resolveSkillPeakOffset(skillKey));
}

/**
 * Wie stark der Entwicklungswert die Laufbahn beschleunigt.
 *
 * Geometrisch, damit "halbiert" und "verdoppelt" symmetrisch um den Standard
 * liegen: 0 ergibt 0,5, 10 ergibt 1,0, 20 ergibt 2,0.
 */
export function resolveDevelopmentFactor(developmentValue: number): number {
  const wert = Math.max(0, Math.min(20, developmentValue));
  return Math.pow(2, (wert - 10) / 10);
}

/**
 * Das Alter, mit dem ein Fahrer sein Potenzial erreicht.
 *
 * Ueber dem Standardwert zieht der Entwicklungswert das Zielalter nach vorn —
 * anders bekommt man ein frueheres Maximum nicht hin. Eine hoehere Rate allein
 * reicht nicht: bei einer Rate der Form k * Restluecke / Restzeit entwickelt
 * sich die Luecke als Luecke0 * ((D-t)/D)^k und wird fuer *jedes* k erst am
 * Ende null. Ein groesseres k macht die Annaeherung steiler, nicht die Ankunft
 * frueher.
 *
 * Unter dem Standardwert bleibt das Zielalter dagegen stehen. Ein langsamer
 * Entwickler soll sein Potenzial trotzdem erreichen; er verliert nur Zeit in
 * der Jugend (siehe `resolveGrowthPerDay`) und holt sie danach auf.
 */
export function resolveTargetAge(peakAge: number, developmentValue: number): number {
  if (developmentValue <= 10 || peakAge <= PROGRESSION_START_AGE) {
    return peakAge;
  }
  const verkuerzt = PROGRESSION_START_AGE
    + ((peakAge - PROGRESSION_START_AGE) / resolveDevelopmentFactor(developmentValue));
  return Math.max(EARLIEST_TARGET_AGE, Math.min(peakAge, verkuerzt));
}

/**
 * Der Sockel eines Skills — der Wert, auf dem er mit 43 steht.
 *
 * Zwanzig Punkte unter seinem Potenzial, aber nie unter fuenfzig. Damit bleibt
 * die Rangfolge der Fahrer bis zum Karriereende erhalten: wer ein Potenzial von
 * 85 hatte, steht am Ende bei 65, wer 68 hatte, bei 50. Mit einem fuer alle
 * gleichen Sockel waeren am Ende alle gleich.
 */
export function resolveSkillFloor(potential: number): number {
  return Math.max(PROGRESSION_MIN_FLOOR, potential - PROGRESSION_DECLINE_DEPTH);
}

export interface GrowthInput {
  skill: number;
  potential: number;
  /** Alter in Jahren, mit Nachkommastellen. */
  age: number;
  /** Zielalter dieses Skills, also inklusive Versatz. */
  targetAge: number;
  developmentValue: number;
}

/**
 * Zuwachs je Tag im Aufbau. Null, sobald das Potenzial erreicht oder das
 * Zielalter ueberschritten ist.
 */
export function resolveGrowthPerDay(input: GrowthInput): number {
  const { skill, potential, age, targetAge, developmentValue } = input;
  const luecke = potential - skill;
  if (luecke <= 0 || age >= targetAge) {
    return 0;
  }
  const restTage = (targetAge - age) * DAYS_PER_YEAR;
  if (restTage <= 0) {
    return luecke;
  }
  const rate = luecke / restTage;
  // Nur der langsame Entwickler wird gebremst. Beim schnellen steckt die
  // Beschleunigung schon im vorgezogenen Zielalter, ein zweiter Faktor wuerde
  // sie doppelt zaehlen.
  if (developmentValue < 10 && age < DEVELOPMENT_SLOWDOWN_UNTIL_AGE) {
    return rate * resolveDevelopmentFactor(developmentValue);
  }
  return rate;
}

export interface DeclineInput {
  skill: number;
  /** Sockel dieses Skills aus `resolveSkillFloor`. */
  floor: number;
  age: number;
  /** Abbaubeginn dieses Skills, also inklusive Versatz. */
  declineAge: number;
  retirementAge: number;
}

/**
 * Abbau je Tag. Null, solange der Abbaubeginn nicht erreicht oder der Sockel
 * schon unterschritten ist.
 *
 * Bis zum Karriereende faellt der Skill dreimal so schnell wie danach, und
 * beides zusammen bringt ihn mit `PROGRESSION_FLOOR_AGE` (F) genau auf seinen
 * Sockel. Daraus folgt die Rate:
 *
 *     3r * (Karriereende - Abbaubeginn) + r * (F - Karriereende) = Weg
 *     r = Weg / (2 * Karriereende - 3 * Abbaubeginn + F)
 *
 * Die woertliche Alternative — Basisrate aus dem vollen Weg bis F, davon das
 * Dreifache — geht nicht auf: der Sockel waere nach (F - Abbaubeginn)/3 Jahren
 * erreicht, unter Umstaenden noch vor dem Karriereende, und danach stuende der
 * Fahrer still.
 */
export function resolveDeclinePerDay(input: DeclineInput): number {
  const { skill, floor, age, declineAge, retirementAge } = input;
  const weg = skill - floor;
  if (weg <= 0 || age < declineAge || age >= PROGRESSION_FLOOR_AGE) {
    return 0;
  }
  const vorKarriereende = age < retirementAge;
  const gewicht = vorKarriereende
    ? (DECLINE_ACCELERATION_BEFORE_RETIREMENT * (retirementAge - age))
      + (PROGRESSION_FLOOR_AGE - retirementAge)
    : PROGRESSION_FLOOR_AGE - age;
  if (gewicht <= 0) {
    return weg;
  }
  const proJahr = (weg / gewicht) * (vorKarriereende ? DECLINE_ACCELERATION_BEFORE_RETIREMENT : 1);
  return proJahr / DAYS_PER_YEAR;
}

export const DAYS_PER_YEAR = 365.25;

export interface SkillStepInput {
  skillKey: RiderSkillKey;
  skill: number;
  potential: number;
  /** Alter zu Beginn des Schritts, in Jahren. */
  age: number;
  /** Wie viele Tage der Schritt umfasst. Ein Tag im Normalfall, dreissig beim Monatslauf. */
  days: number;
  peakAge: number;
  declineAge: number;
  retirementAge: number;
  developmentValue: number;
}

/**
 * Ein Entwicklungsschritt fuer einen Skill.
 *
 * Faellt eine Phasengrenze — Zielalter oder Abbaubeginn — in einen gebuendelten
 * Schritt, wird er dort geteilt. Sonst wuechse ein Fahrer noch ein paar Tage
 * ueber sein Zielalter hinaus oder finge zu spaet an abzubauen. Bei einem
 * Tagesschritt kann das nicht auftreten, bei einem Monatsschritt schon.
 */
export function advanceSkill(input: SkillStepInput): number {
  const { skillKey, potential, days, peakAge, declineAge, retirementAge, developmentValue } = input;
  if (!(days > 0) || !Number.isFinite(potential)) {
    return input.skill;
  }

  const zielAlter = resolveTargetAge(resolveEffectivePeakAge(peakAge, skillKey), developmentValue);
  const abbauAlter = resolveEffectiveDeclineAge(declineAge, skillKey);
  const sockel = resolveSkillFloor(potential);

  let skill = input.skill;
  let alter = input.age;
  let rest = days;

  while (rest > 0) {
    const grenze = naechsteGrenze(alter, zielAlter, abbauAlter, retirementAge, developmentValue);
    const tageBisGrenze = grenze == null ? rest : Math.min(rest, (grenze - alter) * DAYS_PER_YEAR);
    const schritt = Math.max(Math.min(rest, tageBisGrenze), 0);
    if (schritt <= 0) {
      // Die Grenze liegt genau hier — ein Haar weiter, damit die naechste
      // Phase greift und die Schleife nicht steht.
      alter += 1 / DAYS_PER_YEAR;
      rest -= 1;
      continue;
    }

    if (alter < zielAlter) {
      skill = wachse(skill, potential, alter, zielAlter, schritt, developmentValue);
    } else if (alter >= abbauAlter) {
      const proTag = resolveDeclinePerDay({ skill, floor: sockel, age: alter, declineAge: abbauAlter, retirementAge });
      skill = Math.max(sockel, skill - (proTag * schritt));
    }
    // Dazwischen liegt das Plateau: nichts zu tun.

    alter += schritt / DAYS_PER_YEAR;
    rest -= schritt;
  }

  return skill;
}

/**
 * Der Aufbau ueber einen ganzen Schritt, in geschlossener Form.
 *
 * Bei der Standardgeschwindigkeit ist die Rate konstant und ein Schritt ueber n
 * Tage genau das n-fache. Bei einem gebremsten Fahrer ist sie das nicht: mit
 *
 *     S' = S + k * (P - S)/D
 *
 * ist die Rate am naechsten Tag nur fuer k = 1 wieder dieselbe. Die Luecke
 * entwickelt sich stattdessen als
 *
 *     Luecke(t) = Luecke(0) * ((D - t)/D)^k
 *
 * und genau das rechnet diese Funktion. Damit ist jeder Schritt exakt, egal wie
 * viele Tage er umfasst — Tageslauf und Monatslauf kommen auf denselben Wert.
 */
function wachse(
  skill: number,
  potential: number,
  alter: number,
  zielAlter: number,
  tage: number,
  developmentValue: number,
): number {
  const luecke = potential - skill;
  if (luecke <= 0) {
    return skill;
  }
  const restTage = (zielAlter - alter) * DAYS_PER_YEAR;
  if (restTage <= tage) {
    return potential;
  }
  const k = (developmentValue < 10 && alter < DEVELOPMENT_SLOWDOWN_UNTIL_AGE)
    ? resolveDevelopmentFactor(developmentValue)
    : 1;
  return potential - (luecke * Math.pow((restTage - tage) / restTage, k));
}

/**
 * Die naechste Phasengrenze nach `alter`, oder null, wenn keine mehr kommt.
 *
 * Vier Stellen aendern die Rate: das Zielalter (Wachstum endet), der
 * Abbaubeginn (Abbau faengt an), das Karriereende (der Abbau verlangsamt sich
 * auf ein Drittel) und bei gebremsten Fahrern das einundzwanzigste Lebensjahr
 * (die Bremse endet). Ein gebuendelter Schritt, der ueber eine davon
 * hinweggeht, muss dort geteilt werden — sonst rechnet er die halbe Strecke
 * mit der falschen Rate.
 */
function naechsteGrenze(
  alter: number,
  zielAlter: number,
  abbauAlter: number,
  retirementAge: number,
  developmentValue: number,
): number | null {
  const kandidaten = [zielAlter, abbauAlter, retirementAge];
  // Bei einem gebremsten Fahrer endet die Bremse mit einundzwanzig — auch das
  // ist ein Ratenwechsel und muss den Schritt teilen.
  if (developmentValue < 10) {
    kandidaten.push(DEVELOPMENT_SLOWDOWN_UNTIL_AGE);
  }
  const kommend = kandidaten.filter((grenze) => grenze > alter);
  return kommend.length > 0 ? Math.min(...kommend) : null;
}

/** Ein Punkt Entwicklungswert je so vieler Renntage. */
export const RACE_DAY_BONUS_STEP = 15;
/** Hoechster Zuschlag aus Renntagen. */
export const RACE_DAY_BONUS_MAX = 5;
/** Zuschlag, wenn ein passender Mentor im Team steht. */
export const MENTOR_BONUS = 3;
/** Hoechstes Alter, in dem der Mentorenbonus noch wirkt. */
export const MENTOR_BONUS_MAX_AGE = 23;

/**
 * Zuschlag aus den Renntagen der Vorsaison.
 *
 * Es zaehlen alle Renntage gleich, ohne Gewichtung nach Rennkategorie: ein Tag
 * bei einer kleinen Rundfahrt zaehlt wie ein Tag bei der Tour.
 */
export function resolveRaceDayBonus(raceDays: number): number {
  if (!(raceDays > 0)) {
    return 0;
  }
  return Math.min(RACE_DAY_BONUS_MAX, Math.floor(raceDays / RACE_DAY_BONUS_STEP));
}

/**
 * Der wirksame Entwicklungswert: Grundwert plus die beiden Zuschlaege, die der
 * Spieler beeinflussen kann, gedeckelt bei zwanzig.
 */
export function resolveEffectiveDevelopmentValue(
  baseValue: number,
  raceDays: number,
  hasMentor: boolean,
): number {
  const summe = baseValue + resolveRaceDayBonus(raceDays) + (hasMentor ? MENTOR_BONUS : 0);
  return Math.max(0, Math.min(20, summe));
}
