/**
 * Vertraeglichkeitsregeln fuer die Potenzial-Presets der Newgens.
 *
 * Ein Preset ist eine Kiste im Faehigkeitsraum: je Skill eine Spanne, aus der
 * das Potenzial des Fahrers gezogen wird. Ohne Regeln kann diese Kiste in
 * mehreren Richtungen gleichzeitig bis ans Maximum reichen — ein Preset mit
 * Berg 85 und Sprint 85 erzeugt Fahrer, die es im Radsport nicht gibt.
 *
 * Die Regeln greifen deshalb an der Obergrenze der Spanne (`max_pot_*`) an:
 * ueberschreitet ein Preset in einer Leitfaehigkeit die Schwelle, deckelt es
 * die dazu unvertraeglichen Faehigkeiten. Die Untergrenze zaehlt bewusst
 * nicht — sie sagt nur, wie schwach ein Fahrer aus diesem Preset ausfallen
 * darf, und schafft keine Alleskoenner.
 *
 * Reihenfolge zaehlt: bricht ein Preset Regel 1 und Regel 3 zugleich (Berg und
 * Sprint beide ueber 80), entscheidet der hoehere der beiden Werte, welche
 * Faehigkeit die Identitaet des Presets ist und welche gedeckelt wird.
 */

/** Eine Regel: ueberschreitet `wenn` die Schwelle, gilt fuer `dann` die Obergrenze. */
export interface NewgenPresetRule {
  readonly wenn: string;
  readonly ueber: number;
  readonly dann: string;
  readonly hoechstens: number;
}

export const NEWGEN_PRESET_RULES: readonly NewgenPresetRule[] = [
  { wenn: 'mountain', ueber: 80, dann: 'sprint', hoechstens: 72 },
  { wenn: 'mountain', ueber: 80, dann: 'time_trial', hoechstens: 82 },
  { wenn: 'mountain', ueber: 80, dann: 'cobble', hoechstens: 74 },
  { wenn: 'mountain', ueber: 80, dann: 'flat', hoechstens: 78 },
  { wenn: 'sprint', ueber: 80, dann: 'mountain', hoechstens: 74 },
  { wenn: 'sprint', ueber: 80, dann: 'hill', hoechstens: 80 },
  { wenn: 'hill', ueber: 80, dann: 'time_trial', hoechstens: 80 },
];

export interface NewgenPresetViolation {
  readonly presetId: number;
  readonly regel: NewgenPresetRule;
  readonly wennWert: number;
  readonly dannWert: number;
}

type PresetLike = Record<string, unknown> & { preset_id?: number | string };

function obergrenze(preset: PresetLike, skill: string): number {
  return Number(preset[`max_pot_${skill}`] ?? 0);
}

/** Alle Regelbrueche einer Preset-Liste. Leer heisst: die Liste ist sauber. */
export function findNewgenPresetViolations(
  presets: ReadonlyArray<PresetLike>,
): NewgenPresetViolation[] {
  const treffer: NewgenPresetViolation[] = [];
  for (const preset of presets) {
    for (const regel of NEWGEN_PRESET_RULES) {
      const wennWert = obergrenze(preset, regel.wenn);
      const dannWert = obergrenze(preset, regel.dann);
      if (wennWert > regel.ueber && dannWert > regel.hoechstens) {
        treffer.push({ presetId: Number(preset.preset_id ?? 0), regel, wennWert, dannWert });
      }
    }
  }
  return treffer;
}

export function describeNewgenPresetViolation(v: NewgenPresetViolation): string {
  return `Preset ${v.presetId}: ${v.regel.wenn} ${v.wennWert} > ${v.regel.ueber}`
    + `, also darf ${v.regel.dann} hoechstens ${v.regel.hoechstens} sein, ist aber ${v.dannWert}`;
}
