/**
 * Faehigkeitsgewichte eines Einzelzeitfahrens.
 *
 * Die Quick Simulation rechnete den ITT-Score bisher als
 *
 *     Zeitfahrwert + Form + Bergwert x (Hoehenmeter / 500)
 *
 * Die volle Simulation macht etwas ganz anderes: sie gewichtet je
 * Streckensegment nach dessen Terrain, mit der Tabelle aus
 * `data/csv/skill_weights.csv` (simulation_mode = 'itt'). Jede Zeile dieser
 * Tabelle summiert sich auf 1 — der Score bleibt damit auf der
 * Faehigkeitsskala und waechst nicht mit Laenge oder Hoehenmetern.
 *
 * Der Unterschied war nicht akademisch. Gemessen ueber alle 16 ITT-Strecken
 * des Kalenders: 82,9 % Flat, 14,8 % Hill, 2,3 % Abfahrt — und 0,0 %
 * Bergterrain. Die Engine gibt dem Bergwert auf jedem Zeitfahren also das
 * Gewicht null, die Quick Simulation im Mittel 0,27 und auf dem 40,6-km-Kurs
 * mit 671 Hm, auf dem WM und alle nationalen Meisterschaften gefahren werden,
 * das Gewicht 1,34 — mehr als dem Zeitfahrwert selbst. Der heutige Score
 * korrelierte auf dieser Strecke nur mit 0,649 zur Gewichtung der Engine; der
 * blanke Zeitfahrwert allein kam auf 0,943.
 *
 * Hier stehen deshalb dieselben Gewichte wie in der Engine-Tabelle, mit einer
 * bewussten Abweichung: siehe `ITT_HILL_MOUNTAIN_SHARE`.
 */

import type { RiderSkillKey, StageTerrain } from '../types';

/**
 * Anteil des Huegelgewichts, der auf den Bergwert umgelegt wird.
 *
 * Die Engine-Tabelle gibt dem Bergwert auf Huegelterrain nichts, weil ihre
 * Zeile fuer `Hill` nur Huegel, Zeitfahren und Ausdauer kennt. Auf einem
 * Zeitfahren mit 671 Hoehenmetern soll ein Kletterer aber wenigstens etwas
 * davon haben — das ist eine Spielentscheidung, keine Messung, und steht
 * deshalb als eigene Zahl hier statt still in der Tabelle.
 *
 * Der Anteil wirkt nur, wo die Strecke auch bergauf geht: auf einem flachen
 * Zeitfahren gibt es kein Huegelterrain und damit auch kein Berggewicht.
 */
export const ITT_HILL_MOUNTAIN_SHARE = 0.15;

const HILL_TOTAL = 0.475;

/**
 * Gewichte je Terrain. Die Zeilen entsprechen `skill_weights.csv`
 * (simulation_mode = 'itt'); jede summiert sich auf 1.
 */
export const ITT_TERRAIN_WEIGHTS: Readonly<Record<StageTerrain, Partial<Record<RiderSkillKey, number>>>> = {
  Flat: { flat: 0.15, timeTrial: 0.725, stamina: 0.125 },
  Hill: {
    hill: HILL_TOTAL - ITT_HILL_MOUNTAIN_SHARE,
    mountain: ITT_HILL_MOUNTAIN_SHARE,
    timeTrial: 0.4,
    stamina: 0.125,
  },
  Medium_Mountain: { mediumMountain: 0.5, timeTrial: 1 / 3, stamina: 1 / 6 },
  Mountain: { mountain: 2 / 3, timeTrial: 1 / 6, stamina: 1 / 6 },
  High_Mountain: { mountain: 2 / 3, timeTrial: 1 / 6, stamina: 1 / 6 },
  Cobble: { timeTrial: 0.5, cobble: 0.375, stamina: 0.125 },
  Cobble_Hill: { hill: 0.125, timeTrial: 0.5, cobble: 0.25, stamina: 0.125 },
  Abfahrt: { flat: 1 / 9, timeTrial: 2 / 3, downhill: 2 / 9 },
  Sprint: { flat: 0.25, timeTrial: 0.625, stamina: 0.125 },
};

/** Gewichte, wenn die Terrainanteile fehlen: reines Flachzeitfahren. */
export const ITT_FALLBACK_TERRAIN: StageTerrain = 'Flat';

export type TerrainShares = ReadonlyMap<StageTerrain, number>;

/**
 * Mittelt die Terraingewichte nach den Kilometeranteilen der Strecke.
 *
 * Anteile, die sich nicht auf 1 summieren, werden normiert — eine Strecke, von
 * der nur ein Teil bekannt ist, soll den Score nicht schrumpfen lassen.
 */
export function resolveIttScoreWeights(shares: TerrainShares | null | undefined): Partial<Record<RiderSkillKey, number>> {
  const gewichte: Partial<Record<RiderSkillKey, number>> = {};
  let summe = 0;
  for (const [terrain, anteil] of shares ?? []) {
    if (!(anteil > 0)) continue;
    const zeile = ITT_TERRAIN_WEIGHTS[terrain];
    if (!zeile) continue;
    summe += anteil;
    for (const [key, weight] of Object.entries(zeile) as Array<[RiderSkillKey, number]>) {
      gewichte[key] = (gewichte[key] ?? 0) + weight * anteil;
    }
  }
  if (summe <= 0) {
    return { ...ITT_TERRAIN_WEIGHTS[ITT_FALLBACK_TERRAIN] };
  }
  for (const key of Object.keys(gewichte) as RiderSkillKey[]) {
    gewichte[key] = (gewichte[key] as number) / summe;
  }
  return gewichte;
}

/**
 * Kilometeranteile je Terrain aus den Streckensegmenten.
 *
 * Bewusst ueber die Kilometer und nicht ueber die Zahl der Segmente: ein
 * 200 Meter langer Huegel und eine 12 Kilometer lange Gerade sind nicht
 * gleich viel wert.
 */
export function resolveTerrainShares(
  segments: ReadonlyArray<{ terrain: StageTerrain; length_km: number }> | null | undefined,
): Map<StageTerrain, number> {
  const anteile = new Map<StageTerrain, number>();
  let gesamt = 0;
  for (const segment of segments ?? []) {
    const laenge = Number(segment.length_km);
    if (!(laenge > 0)) continue;
    anteile.set(segment.terrain, (anteile.get(segment.terrain) ?? 0) + laenge);
    gesamt += laenge;
  }
  if (gesamt <= 0) return anteile;
  for (const [terrain, laenge] of anteile) anteile.set(terrain, laenge / gesamt);
  return anteile;
}
