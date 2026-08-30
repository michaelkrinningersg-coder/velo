// Die Zuordnung Laendercode -> Flaggen-Icon liegt in shared/, damit sie nicht
// zweimal gepflegt werden muss: diese Datei und state.ts hielten je eine eigene
// Kopie, die bereits auseinandergelaufen war (OMA fehlte hier).
import { FLAG_CODE_BY_CODE3 } from '../../../shared/flagCodes';

export function renderFlag(code3: string): string {
  const alpha2 = FLAG_CODE_BY_CODE3[code3] ?? null;
  if (!alpha2) return '';
  return `<span class="fi fi-${alpha2} country-flag" aria-hidden="true"></span>`;
}