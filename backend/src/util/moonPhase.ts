/**
 * Leichtgewichtige Mondphasen-Berechnung — es wird nichts in der Datenbank
 * abgelegt. Ein "Vollmondtag" wird allein aus dem Kalenderdatum abgeleitet
 * (synodischer Monat ab einem bekannten Neumond). Genauigkeit ~1 Tag, fuer
 * ein Spiel-Badge voellig ausreichend.
 */

const SYNODIC_MONTH = 29.530588853; // Tage zwischen zwei Neumonden
// Referenz-Neumond (Julianisches Datum), empirisch so justiert, dass die
// erkannten Vollmondtage mit dem realen Kalender uebereinstimmen (2027: 8/8).
const KNOWN_NEW_MOON_JD = 2451549.4;

function julianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day
    + Math.floor((153 * m + 2) / 5)
    + 365 * y
    + Math.floor(y / 4)
    - Math.floor(y / 100)
    + Math.floor(y / 400)
    - 32045;
}

/** Mondalter in Tagen (0 = Neumond, ~14.77 = Vollmond) fuer ein ISO-Datum. */
export function moonAgeDays(dateIso: string): number {
  const parts = dateIso.slice(0, 10).split('-').map(Number);
  const [year, month, day] = parts;
  if (!year || !month || !day) return NaN;
  const jd = julianDayNumber(year, month, day) - 0.5; // Mitternacht UTC
  let age = (jd - KNOWN_NEW_MOON_JD) % SYNODIC_MONTH;
  if (age < 0) age += SYNODIC_MONTH;
  return age;
}

/** Ob der Kalendertag ein Vollmondtag ist (innerhalb eines halben Tages zum exakten Vollmond). */
export function isFullMoonDate(dateIso: string): boolean {
  const age = moonAgeDays(dateIso);
  if (Number.isNaN(age)) return false;
  return Math.abs(age - SYNODIC_MONTH / 2) <= 0.5;
}
