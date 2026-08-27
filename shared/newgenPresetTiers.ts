/**
 * Stufen der Newgen-Potenzial-Presets: wie stark ein Preset ist, wie oft es
 * gezogen werden soll und wie viele aktive Fahrer hoechstens daraus stammen
 * duerfen.
 *
 * Warum es die Stufen gibt: ein Preset, das oft gezogen wird, erzeugt viele
 * aehnliche Fahrer. Bei einem Wassertraeger merkt das niemand, bei einem
 * Rundfahrtsieger schon. Die Spitze bekommt deshalb einen Deckel — hoechstens
 * drei aktive Fahrer je Preset — und dafuer so viele Presets, dass der Deckel
 * nicht beisst: in 25 Jahren entstehen rund 3900 Newgens, davon 7 % aus Stufe
 * S+, also rund 273 Fahrer. Bei 264 Presets in dieser Stufe wird jedes im
 * Schnitt einmal gebraucht — der Deckel von drei laesst dreifache Luft.
 *
 * Eingestuft wird ueber die Gesamtwertung aus der MITTE der Preset-Spanne. Sie
 * ist ungefaehr die Medianstaerke der Fahrer, die das Preset erzeugt; die
 * Obergrenze liegt rund vier Punkte darueber.
 *
 * Das Gewicht wird aus dieser Tabelle abgeleitet und nicht von Hand gesetzt:
 * jedes Preset einer Stufe traegt denselben Anteil. Kommen zehn neue
 * Stufe-A-Presets dazu, sinkt ihr Einzelgewicht automatisch — der Anteil der
 * Stufe bleibt.
 */

import { calcRiderOverall } from './riderOverall';

export interface NewgenPresetTier {
  /** Kurzzeichen der Stufe. */
  readonly key: string;
  /** Untere Grenze der Gesamtwertung aus der Mitte der Spanne, einschliesslich. */
  readonly abMidOverall: number;
  /** Anteil an allen Newgen-Zuegen. Die Anteile aller Stufen ergeben 1. */
  readonly zielanteil: number;
  /** Hoechstzahl aktiver Fahrer je Preset. null heisst: kein Deckel. */
  readonly deckel: number | null;
}

/**
 * Absteigend nach Staerke. Die letzte Stufe faengt alles Uebrige auf.
 *
 * Die Anteile sind nicht geraten, sondern gegen das eingelesene Feld geeicht:
 * mit ihnen treffen die Newgens dessen Potenzialverteilung (Median 71,7,
 * 20,6 % ab 74, 5,9 % ab 76). Ohne diese Eichung sinkt die Welt ab — ein
 * 30-Jahres-Lauf mit einer flacheren Verteilung endete bei Median 64,0 und
 * gerade noch zwei Fahrern ab Gesamtwertung 75, wo es am Anfang 32 waren.
 */
export const NEWGEN_PRESET_TIERS: readonly NewgenPresetTier[] = [
  { key: 'S+', abMidOverall: 76.0, zielanteil: 0.070, deckel: 3 },
  { key: 'S', abMidOverall: 74.5, zielanteil: 0.045, deckel: null },
  { key: 'A', abMidOverall: 72.5, zielanteil: 0.170, deckel: null },
  { key: 'B', abMidOverall: 71.0, zielanteil: 0.200, deckel: null },
  { key: 'C', abMidOverall: 69.5, zielanteil: 0.280, deckel: null },
  { key: 'D', abMidOverall: 68.0, zielanteil: 0.135, deckel: null },
  { key: 'E', abMidOverall: -Infinity, zielanteil: 0.100, deckel: null },
];

/**
 * Massstab fuer die abgeleiteten Gewichte.
 *
 * Die Gewichtsspalte ist ganzzahlig. Bei einem kleinen Massstab bekaeme jedes
 * Preset der Spitzenstufen das Mindestgewicht 1 und die Stufe traefe ihren
 * Anteil nicht mehr. Bei 10000 kam Stufe S+ auf Gewicht 3 statt der noetigen
 * 2,5 und lag damit 1,3 Punkte ueber ihrem Zielanteil; 40000 loest fein genug
 * auf, dass alle sieben Stufen ihren Anteil auf ein Zehntel genau treffen.
 */
export const NEWGEN_PRESET_WEIGHT_SCALE = 40000;

const SKILL_KEYS = [
  'flat', 'mountain', 'medium_mountain', 'hill', 'time_trial',
  'cobble', 'sprint', 'acceleration', 'stamina', 'resistance', 'recuperation',
] as const;

const CAMEL: Record<string, keyof ReturnType<typeof leereWerte>> = {
  flat: 'flat', mountain: 'mountain', medium_mountain: 'mediumMountain', hill: 'hill',
  time_trial: 'timeTrial', cobble: 'cobble', sprint: 'sprint', acceleration: 'acceleration',
  stamina: 'stamina', resistance: 'resistance', recuperation: 'recuperation',
};

function leereWerte() {
  return {
    flat: 0, mountain: 0, mediumMountain: 0, hill: 0, timeTrial: 0, cobble: 0,
    sprint: 0, acceleration: 0, stamina: 0, resistance: 0, recuperation: 0,
  };
}

export type NewgenPresetRow = Record<string, unknown>;

/** Gesamtwertung aus der Mitte der Spanne — der Massstab fuer die Einstufung. */
export function resolvePresetMidOverall(preset: NewgenPresetRow): number {
  const werte = leereWerte();
  for (const skill of SKILL_KEYS) {
    const unten = Number(preset[`min_pot_${skill}`] ?? 0);
    const oben = Number(preset[`max_pot_${skill}`] ?? 0);
    werte[CAMEL[skill]!] = (unten + oben) / 2;
  }
  return calcRiderOverall(werte);
}

export function resolveNewgenPresetTier(midOverall: number): NewgenPresetTier {
  return NEWGEN_PRESET_TIERS.find((stufe) => midOverall >= stufe.abMidOverall)
    ?? NEWGEN_PRESET_TIERS[NEWGEN_PRESET_TIERS.length - 1]!;
}

export interface NewgenPresetWeighting {
  readonly presetId: number;
  readonly tier: string;
  readonly midOverall: number;
  readonly weight: number;
}

/**
 * Leitet die Gewichte aller Presets aus der Stufentabelle ab.
 *
 * Presets einer Stufe teilen sich deren Zielanteil zu gleichen Teilen. Eine
 * Stufe ohne Presets verfaellt — ihr Anteil geht nicht verloren, sondern wird
 * ueber die Normierung auf die uebrigen verteilt, weil die Gewichte im Spiel
 * ohnehin nur relativ zueinander wirken.
 */
export function resolveNewgenPresetWeights(
  presets: ReadonlyArray<NewgenPresetRow>,
): NewgenPresetWeighting[] {
  const anzahlJeStufe = new Map<string, number>();
  const eingestuft = presets.map((preset) => {
    const midOverall = resolvePresetMidOverall(preset);
    const tier = resolveNewgenPresetTier(midOverall);
    anzahlJeStufe.set(tier.key, (anzahlJeStufe.get(tier.key) ?? 0) + 1);
    return { preset, midOverall, tier };
  });

  return eingestuft.map(({ preset, midOverall, tier }) => {
    const anzahl = anzahlJeStufe.get(tier.key) ?? 1;
    const weight = Math.max(
      1,
      Math.round((NEWGEN_PRESET_WEIGHT_SCALE * tier.zielanteil) / anzahl),
    );
    return { presetId: Number(preset['preset_id'] ?? 0), tier: tier.key, midOverall, weight };
  });
}
