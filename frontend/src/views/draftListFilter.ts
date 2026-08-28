/**
 * Sortierung und Filter der Draft-Kandidatenliste.
 *
 * Bewusst ohne Zugriff auf den globalen Zustand: die Saison kommt als
 * Argument herein, damit sich Filter und Sortierung fuer sich testen lassen.
 */

export type DraftSortKey = 'overall' | 'potential' | 'age' | 'wins' | 'uci' | 'country' | 'team';

export interface DraftListSteuerung {
  sortKey: DraftSortKey;
  absteigend: boolean;
  team: string;
  land: string;
  spez: string;
  minOverall: number | null;
  minPotential: number | null;
  maxAlter: number | null;
  minSiege: number | null;
  maxUci: number | null;
  nurWaehlbare: boolean;
}

export const DRAFT_SORT_LABELS: Array<[DraftSortKey, string]> = [
  ['overall', 'Faehigkeit'],
  ['potential', 'Potential'],
  ['age', 'Alter'],
  ['wins', 'Siege'],
  ['uci', 'UCI-Rang'],
  ['country', 'Land'],
  ['team', 'Team'],
];

export function draftListSteuerungStandard(): DraftListSteuerung {
  return {
    sortKey: 'overall', absteigend: true,
    team: '', land: '', spez: '',
    minOverall: null, minPotential: null, maxAlter: null, minSiege: null, maxUci: null,
    nurWaehlbare: false,
  };
}

export function draftAlter(kandidat: any, season: number): number {
  return season - kandidat.birthYear;
}

/** Filtert und sortiert die Kandidaten nach der uebergebenen Einstellung. */
export function applyDraftListSteuerung(
  kandidaten: any[],
  f: DraftListSteuerung,
  season: number,
): any[] {
  const gefiltert = kandidaten.filter((c: any) => {
    if (f.nurWaehlbare && c.blocked) return false;
    if (f.team && String(c.oldTeamName ?? '') !== f.team) return false;
    if (f.land && String(c.countryCode ?? '') !== f.land) return false;
    if (f.spez && ![c.specialization1, c.specialization2, c.specialization3].includes(f.spez)) return false;
    if (f.minOverall != null && c.overallRating < f.minOverall) return false;
    if (f.minPotential != null && c.potential < f.minPotential) return false;
    if (f.maxAlter != null && draftAlter(c, season) > f.maxAlter) return false;
    if (f.minSiege != null && (c.wins ?? 0) < f.minSiege) return false;
    // Ohne UCI-Rang faellt der Fahrer aus einer Rangfilterung heraus.
    if (f.maxUci != null && (c.uciRank == null || c.uciRank > f.maxUci)) return false;
    return true;
  });

  const richtung = f.absteigend ? -1 : 1;
  const text = (a: string, b: string) => a.localeCompare(b, 'de');
  gefiltert.sort((a: any, b: any) => {
    switch (f.sortKey) {
      case 'potential': return richtung * (a.potential - b.potential) || b.overallRating - a.overallRating;
      case 'age':       return richtung * (draftAlter(a, season) - draftAlter(b, season)) || b.overallRating - a.overallRating;
      case 'wins':      return richtung * ((a.wins ?? 0) - (b.wins ?? 0)) || b.overallRating - a.overallRating;
      // Fahrer ohne Rang stehen immer hinten, unabhaengig von der Richtung.
      case 'uci': {
        const ra = a.uciRank ?? Number.POSITIVE_INFINITY;
        const rb = b.uciRank ?? Number.POSITIVE_INFINITY;
        if (!isFinite(ra) && !isFinite(rb)) return b.overallRating - a.overallRating;
        if (!isFinite(ra)) return 1;
        if (!isFinite(rb)) return -1;
        return -richtung * (ra - rb) || b.overallRating - a.overallRating;
      }
      case 'country':   return richtung * text(a.countryCode ?? '', b.countryCode ?? '') || b.overallRating - a.overallRating;
      // Fahrer ohne altes Team sortieren, als hiesse ihr Team zuletzt im Alphabet.
      case 'team':      return richtung * text(a.oldTeamName ?? '\uffff', b.oldTeamName ?? '\uffff') || b.overallRating - a.overallRating;
      default:          return richtung * (a.overallRating - b.overallRating);
    }
  });
  return gefiltert;
}
