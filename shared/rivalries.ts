// Single Source of Truth fuer die Rivalen-Erkennung. Reine, deterministische
// Logik (keine DB, kein Zufall) — damit sie unabhaengig testbar ist. Die
// SQL-Beschaffung liegt im RivalryService; hier nur Bewertung & Auswahl.

// Rollen, die ueberhaupt rivalfaehig sind: Kapitaen(1), Co-Kapitaen(2),
// Sprinter(6). Helfer/Wassertraeger bleiben aussen vor.
export const RIVALRY_ELIGIBLE_ROLE_IDS: ReadonlySet<number> = new Set([1, 2, 6]);

// Gates.
export const RIVALRY_MIN_OVERALL = 74;
export const RIVALRY_MAX_AGE_DELTA = 6;         // Jahre
export const RIVALRY_MIN_ENCOUNTERS = 6;        // gemeinsame Duelle (all-time)
export const RIVALRY_MIN_SEASON_ENCOUNTERS = 2; // in der Zielsaison aktiv
export const RIVALRY_BALANCE_LOW = 0.30;        // dominante Duos raus
export const RIVALRY_BALANCE_HIGH = 0.70;

// Auswahl.
export const RIVALRY_MAX_COUNT = 10;            // max. Rivalitaeten je Saison
export const RIVALRY_MIN_INDEX = 45;            // nur hoher Index
const RIVALRY_INDEX_TOP_HEADROOM = 1.08;        // Top-Paar landet bei ~92
const RIVALRY_RECENCY_DECAY = 0.85;             // je Saison Rueckstand

// Kategorie-Gewichte (race_categories.id): TdF/GrandTour/Monument top,
// One-Day-Low am geringsten.
const CATEGORY_WEIGHT: Record<number, number> = {
  1: 2.0, // World Tour - Tour de France
  2: 2.0, // Grand Tour
  3: 2.0, // Monument
  4: 1.5, // Stage Race High
  5: 1.0, // Stage Race Middle
  6: 0.7, // Stage Race Low
  7: 1.3, // One Day High
  8: 0.9, // One Day Middle
  9: 0.6, // One Day Low
};
function categoryWeight(categoryId: number): number {
  return CATEGORY_WEIGHT[categoryId] ?? 1.0;
}

export type RivalryDuelType = 'GC' | 'Etappe' | 'Eintages';

export interface RivalryDuel {
  season: number;
  categoryId: number;
  type: RivalryDuelType;
  rankA: number;
  rankB: number;
}

export interface RivalryPairMeta {
  birthYearA: number;
  birthYearB: number;
  teamA: number | null;
  teamB: number | null;
  roleA: number | null;
  roleB: number | null;
}

export interface RivalryScore {
  qualifies: boolean;
  reason?: string;
  intensity: number;      // roher Intensitaets-Score (unbeschraenkt)
  encounters: number;     // all-time
  winA: number;
  winB: number;
  seasonWinA: number;
  seasonWinB: number;
  seasonEncounters: number;
  topCategoryId: number | null;
  balance: number;        // 0..1 (1 = ausgeglichen)
  ageDelta: number;
}

// Bewertet ein Fahrerpaar aus der Liste seiner gemeinsamen Duelle (all-time).
export function scoreRivalryPair(duels: RivalryDuel[], meta: RivalryPairMeta, targetSeason: number): RivalryScore {
  const ageDelta = Math.abs(meta.birthYearA - meta.birthYearB);
  const base: RivalryScore = {
    qualifies: false, intensity: 0, encounters: 0, winA: 0, winB: 0,
    seasonWinA: 0, seasonWinB: 0, seasonEncounters: 0, topCategoryId: null,
    balance: 0, ageDelta,
  };

  // Harte, guenstige Gates zuerst.
  if (meta.teamA != null && meta.teamB != null && meta.teamA === meta.teamB) {
    return { ...base, reason: 'same_team' };
  }
  if (ageDelta > RIVALRY_MAX_AGE_DELTA) {
    return { ...base, reason: 'age_delta' };
  }
  if (!RIVALRY_ELIGIBLE_ROLE_IDS.has(meta.roleA ?? -1) || !RIVALRY_ELIGIBLE_ROLE_IDS.has(meta.roleB ?? -1)) {
    return { ...base, reason: 'role' };
  }

  let raw = 0;
  let winA = 0;
  let winB = 0;
  let seasonWinA = 0;
  let seasonWinB = 0;
  let seasonEncounters = 0;
  const catCounts = new Map<number, number>();

  for (const d of duels) {
    if (d.season > targetSeason) continue; // zukuenftige Duelle ignorieren
    const inSeason = d.season === targetSeason;
    if (inSeason) seasonEncounters++;

    if (d.rankA < d.rankB) {
      winA++; if (inSeason) seasonWinA++;
    } else if (d.rankB < d.rankA) {
      winB++; if (inSeason) seasonWinB++;
    }

    const proximity = 1 / (1 + Math.abs(d.rankA - d.rankB));
    const stake = 1 / Math.sqrt(Math.max(1, Math.min(d.rankA, d.rankB)));
    const recency = Math.pow(RIVALRY_RECENCY_DECAY, targetSeason - d.season);
    raw += proximity * stake * categoryWeight(d.categoryId) * recency;

    catCounts.set(d.categoryId, (catCounts.get(d.categoryId) ?? 0) + 1);
  }

  const encounters = winA + winB + duels.filter((d) => d.season <= targetSeason && d.rankA === d.rankB).length;
  const decisive = winA + winB;

  if (encounters < RIVALRY_MIN_ENCOUNTERS) {
    return { ...base, encounters, winA, winB, seasonWinA, seasonWinB, seasonEncounters, reason: 'few_encounters' };
  }
  if (seasonEncounters < RIVALRY_MIN_SEASON_ENCOUNTERS) {
    return { ...base, encounters, winA, winB, seasonWinA, seasonWinB, seasonEncounters, reason: 'inactive_season' };
  }
  if (decisive === 0) {
    return { ...base, encounters, winA, winB, seasonWinA, seasonWinB, seasonEncounters, reason: 'no_decisive' };
  }

  const winShareA = winA / decisive;
  if (winShareA < RIVALRY_BALANCE_LOW || winShareA > RIVALRY_BALANCE_HIGH) {
    return { ...base, encounters, winA, winB, seasonWinA, seasonWinB, seasonEncounters, reason: 'dominant' };
  }

  const balance = 1 - Math.abs(winShareA - 0.5) * 2;
  const ageAffinity = Math.max(0, 1 - ageDelta / RIVALRY_MAX_AGE_DELTA);
  const intensity = raw * balance * ageAffinity;

  let topCategoryId: number | null = null;
  let topCount = -1;
  for (const [cat, count] of catCounts) {
    if (count > topCount) { topCount = count; topCategoryId = cat; }
  }

  return {
    qualifies: intensity > 0,
    intensity, encounters, winA, winB, seasonWinA, seasonWinB,
    seasonEncounters, topCategoryId, balance, ageDelta,
  };
}

export interface RankedRivalryPair {
  aId: number;
  bId: number;
  score: RivalryScore;
}

export interface SelectedRivalry extends RankedRivalryPair {
  rank: number;
  index: number; // 0..~92, fuer die Anzeige normiert
}

// Waehlt die finalen Rivalitaeten: nach Intensitaet absteigend, jeder Fahrer
// hoechstens einmal, max. RIVALRY_MAX_COUNT, nur hoher Index.
export function selectSeasonRivalries(pairs: RankedRivalryPair[]): SelectedRivalry[] {
  const qualifying = pairs
    .filter((p) => p.score.qualifies)
    .sort((a, b) => b.score.intensity - a.score.intensity);

  const used = new Set<number>();
  const picked: RankedRivalryPair[] = [];
  for (const p of qualifying) {
    if (picked.length >= RIVALRY_MAX_COUNT) break;
    if (used.has(p.aId) || used.has(p.bId)) continue;
    used.add(p.aId); used.add(p.bId);
    picked.push(p);
  }
  if (picked.length === 0) return [];

  const topIntensity = picked[0].score.intensity;
  const denom = topIntensity * RIVALRY_INDEX_TOP_HEADROOM;

  const result: SelectedRivalry[] = [];
  for (const p of picked) {
    const index = denom > 0 ? Math.round((100 * p.score.intensity) / denom) : 0;
    if (index < RIVALRY_MIN_INDEX) continue; // nur hoher Index
    result.push({ ...p, rank: result.length + 1, index });
  }
  return result;
}

// Disziplin-Label fuers UI (aus Top-Kategorie + Rollen der beiden).
export function deriveRivalryDiscipline(topCategoryId: number | null, roleA: number | null, roleB: number | null): string {
  if (roleA === 6 && roleB === 6) return 'Sprint';
  if (topCategoryId != null) {
    if ([1, 2, 4, 5, 6].includes(topCategoryId)) return 'GC';
    if (topCategoryId === 3) return 'Monument';
    if ([7, 8, 9].includes(topCategoryId)) return 'One-Day';
  }
  return 'Allround';
}
