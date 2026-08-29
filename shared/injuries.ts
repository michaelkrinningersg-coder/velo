/**
 * Verletzungsarten.
 *
 * Vorher zog jede der beiden Quellen — der Tageswurf in `GameStateService` und
 * der schwere Sturz in `StageResultCommitService` — dieselbe anonyme Zahl:
 * zu 10 % 6 bis 30 Tage, sonst 2 bis 14. Erwartungswert 9,0 Tage.
 *
 * Jetzt kommt die Dauer aus einer Art, und die Art aus `injury_types.csv`. Die
 * Tabelle hat zwei Gewichtsspalten, weil sich ein Sturz anders verletzt als
 * eine harte Trainingswoche: aus dem Peloton kommen Schuerfwunden, Rippen und
 * Brueche, aus dem Alltag Sehnen und Muskeln.
 *
 * Die Auflage bei der Einfuehrung war, dass die Ausfallzeit dabei nicht
 * steigt. Beide Gewichtungen liegen deshalb unter den bisherigen 9,0 Tagen
 * (8,56 im Alltag, 8,75 nach einem Sturz); `mittlereAusfalltage` rechnet das
 * nach, ein Test haelt es fest. Was sich aendert, ist die Form der Verteilung:
 * die meisten Ausfaelle sind kuerzer als frueher, dafuer gibt es einen langen
 * Schwanz, den es vorher gar nicht gab (Schluesselbein, Becken).
 */

export type Verletzungsquelle = 'alltag' | 'sturz';

export interface Verletzungsart {
  readonly key: string;
  readonly label: string;
  readonly gewichtAlltag: number;
  readonly gewichtSturz: number;
  readonly minTage: number;
  readonly maxTage: number;
}

export interface GezogeneVerletzung {
  /** Schluessel der Art; null, wenn keine Arten vorliegen (alter Spielstand). */
  readonly key: string | null;
  /** Anzeigename; null wie oben. */
  readonly label: string | null;
  readonly durationDays: number;
}

/** Die Ziehung von frueher — Rueckfall, wenn die Tabelle leer ist. */
export function ziehVerletzungOhneArten(zufall: () => number): GezogeneVerletzung {
  const langwierig = zufall() < 0.1;
  const von = langwierig ? 6 : 2;
  const bis = langwierig ? 30 : 14;
  return { key: null, label: null, durationDays: ganzzahl(zufall, von, bis) };
}

export function gewichtFuer(art: Verletzungsart, quelle: Verletzungsquelle): number {
  const gewicht = quelle === 'sturz' ? art.gewichtSturz : art.gewichtAlltag;
  return Number.isFinite(gewicht) && gewicht > 0 ? gewicht : 0;
}

/**
 * Erwartete Ausfalltage einer Quelle. Dient der Kalibrierung: die Zahl darf
 * nicht ueber den Wert des alten Modells steigen.
 */
export function mittlereAusfalltage(
  arten: readonly Verletzungsart[],
  quelle: Verletzungsquelle,
): number {
  let summeGewicht = 0;
  let summeTage = 0;
  for (const art of arten) {
    const gewicht = gewichtFuer(art, quelle);
    if (gewicht <= 0) continue;
    summeGewicht += gewicht;
    summeTage += gewicht * ((art.minTage + art.maxTage) / 2);
  }
  return summeGewicht > 0 ? summeTage / summeGewicht : 0;
}

/**
 * Zieht Art und Dauer einer Verletzung. `zufall` liefert Werte in [0,1).
 *
 * Ohne verwendbare Arten faellt die Ziehung auf das alte Modell zurueck —
 * ein Spielstand ohne die Tabelle verliert dadurch die Bezeichnung, aber
 * nicht die Verletzung.
 */
export function ziehVerletzung(
  arten: readonly Verletzungsart[],
  quelle: Verletzungsquelle,
  zufall: () => number,
): GezogeneVerletzung {
  const gewichtet = arten.filter((art) => gewichtFuer(art, quelle) > 0);
  const summe = gewichtet.reduce((wert, art) => wert + gewichtFuer(art, quelle), 0);
  if (summe <= 0) {
    return ziehVerletzungOhneArten(zufall);
  }

  let wurf = zufall() * summe;
  for (const art of gewichtet) {
    wurf -= gewichtFuer(art, quelle);
    if (wurf < 0) {
      return {
        key: art.key,
        label: art.label,
        durationDays: ganzzahl(zufall, art.minTage, art.maxTage),
      };
    }
  }

  // Nur bei Rundungsresten erreichbar.
  const letzte = gewichtet[gewichtet.length - 1]!;
  return {
    key: letzte.key,
    label: letzte.label,
    durationDays: ganzzahl(zufall, letzte.minTage, letzte.maxTage),
  };
}

function ganzzahl(zufall: () => number, min: number, max: number): number {
  const von = Math.max(1, Math.round(min));
  const bis = Math.max(von, Math.round(max));
  return Math.min(bis, von + Math.floor(zufall() * ((bis - von) + 1)));
}
