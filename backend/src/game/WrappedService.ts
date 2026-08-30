import type Database from 'better-sqlite3';
import { ResultRepository } from '../db/repositories/ResultRepository';
import type {
  SeasonWrappedPayload,
  WrappedWinsEntry,
  WrappedRiderPoints,
  WrappedTeamStat,
  WrappedNewcomer,
  WrappedRetiree,
  WrappedLegend,
  WrappedFallenLegend,
  WrappedCareerResult,
  WrappedSurprise,
  WrappedRecords,
  WrappedPlayerTeam,
  WrappedProgression,
  WrappedProgressionSeries,
  WrappedRivalry,
  WrappedJerseyGroup,
  WrappedJerseyKey,
  WrappedGrandTourClassifications,
  WrappedGrind,
  WrappedGrindEntry,
  WrappedStrongestField,
  PalmaresRiderRef,
  RaceWinnerEntry,
} from '../../../shared/types';
// `tableExists`/`columnExists` kommen aus db/mappers: dort werden positive
// Antworten je Verbindung gemerkt. Die frueheren lokalen Kopien fragten das
// Schema bei jedem Aufruf neu — in zwei gemessenen Spielmonaten waren das 7341
// sqlite_master-Abfragen und 2117 `PRAGMA table_info`.
import { columnExists, tableExists } from '../db/mappers';

// Zweite Plaetze, mit demselben Zuschnitt wie WIN_FILTER.
const SECOND_FILTER = `
  spe.rank = 2 AND (
    (r.is_stage_race = 1 AND spe.award_type IN ('stage_result','gc_final'))
    OR (r.is_stage_race = 0 AND spe.award_type = 'one_day_result'))`;

// Die vier Fuehrungstrikots, in der Reihenfolge, in der sie angezeigt werden.
const JERSEYS: Array<{ key: WrappedJerseyKey; award: string; label: string }> = [
  { key: 'gc', award: 'gc_leader_day', label: 'Gesamtwertung' },
  { key: 'points', award: 'points_leader_day', label: 'Punktewertung' },
  { key: 'mountain', award: 'mountain_leader_day', label: 'Bergwertung' },
  { key: 'youth', award: 'youth_leader_day', label: 'Nachwuchswertung' },
];

// Tour de France und die uebrigen Grand Tours.
const GRAND_TOUR_CATEGORIES = [1, 2];

// Nur echte Renn-Siege zaehlen (Etappe/Eintages/GC), keine Wertungstrikots.
const WIN_FILTER = `
  spe.rank = 1 AND (
    (r.is_stage_race = 1 AND spe.award_type IN ('stage_result','gc_final'))
    OR (r.is_stage_race = 0 AND spe.award_type = 'one_day_result'))`;

function awardLabel(award: string): string {
  switch (award) {
    case 'gc_final': return 'GC';
    case 'stage_result': return 'Etappe';
    case 'one_day_result': return 'Eintages';
    case 'points_final': return 'Punkte';
    case 'mountain_final': return 'Berg';
    case 'youth_final': return 'Nachwuchs';
    case 'gc_leader_day': return 'GC-Trikot';
    case 'points_leader_day': return 'Punkte-Trikot';
    case 'mountain_leader_day': return 'Berg-Trikot';
    case 'youth_leader_day': return 'Nachwuchs-Trikot';
    default: return 'Wertung';
  }
}

// Reihenfolge der Ergebnistypen INNERHALB eines Rennens: zuerst die Wertungen
// (nach Typ gruppiert: GC, Punkte, Berg, Nachwuchs), danach Etappen- bzw.
// Eintagesergebnisse. Innerhalb eines Typs wird spaeter nach Punkten sortiert.
function awardOrder(award: string): number {
  switch (award) {
    case 'gc_final': return 0;
    case 'points_final': return 1;
    case 'mountain_final': return 2;
    case 'youth_final': return 3;
    case 'stage_result': return 4;
    case 'one_day_result': return 5;
    default: return 6;
  }
}

export class WrappedService {
  constructor(private readonly db: Database.Database) {}

  private riderRef(riderId: number): PalmaresRiderRef | null {
    const row = this.db.prepare(`
      SELECT ri.id AS riderId, ri.first_name AS firstName, ri.last_name AS lastName,
             c.code_3 AS countryCode, ri.active_team_id AS teamId, t.name AS teamName
      FROM riders ri
      JOIN sta_country c ON c.id = ri.country_id
      LEFT JOIN teams t ON t.id = ri.active_team_id
      WHERE ri.id = ?
    `).get(riderId) as any;
    if (!row) return null;
    return { ...row, specialization1: null, specialization2: null };
  }

  // Kumulative All-Time-UCI-Wertung bis einschliesslich `throughSeason`.
  private cumulativeRanking(throughSeason: number): { ordered: Array<{ riderId: number; pts: number; rank: number }>; rankById: Map<number, number> } {
    const rows = this.db.prepare(`
      SELECT rider_id AS riderId, SUM(points_awarded) AS pts
      FROM season_point_events
      WHERE season <= ?
      GROUP BY rider_id
      ORDER BY pts DESC, rider_id ASC
    `).all(throughSeason) as Array<{ riderId: number; pts: number }>;
    const ordered = rows.map((r, i) => ({ riderId: r.riderId, pts: r.pts, rank: i + 1 }));
    return { ordered, rankById: new Map(ordered.map((r) => [r.riderId, r.rank])) };
  }

  // Rang je Fahrer in der Saison-UCI-Wertung (nur diese Saison).
  private seasonRankMap(season: number): Map<number, number> {
    const rows = this.db.prepare(`
      SELECT rider_id AS riderId, SUM(points_awarded) AS pts
      FROM season_point_events
      WHERE season = ?
      GROUP BY rider_id
      ORDER BY pts DESC, rider_id ASC
    `).all(season) as Array<{ riderId: number; pts: number }>;
    return new Map(rows.map((r, i) => [r.riderId, i + 1]));
  }

  // Beste Ergebnisse eines Fahrers, IDENTISCHE Ergebnisse gruppiert
  // (gleiches Rennen + Typ + Platz + Punkte -> z. B. "3x Etappe").
  //
  // groupByRace = false (Standard, Newcomer): flach nach Punkten absteigend.
  // groupByRace = true (Legenden/Retirees/Herausgefallene): nach RENNEN
  // gruppiert — Rennen nach Prestige absteigend, innerhalb eines Rennens zuerst
  // die Wertungen (GC/Punkte/Berg/Nachwuchs) nach Punkten absteigend, danach die
  // Etappen- bzw. Eintagesergebnisse nach Punkten absteigend.
  private bestResults(riderId: number, limit = 10, season?: number, groupByRace = false): WrappedCareerResult[] {
    const seasonClause = season != null ? 'AND spe.season = ?' : '';
    const params: any[] = season != null ? [riderId, season] : [riderId];
    // Fuer die nach Rennen gruppierten Palmares (Legenden/Retirees/Herausgefallene)
    // gilt ein Positions-/Kategorie-Filter: nur wirklich zaehlbare Ergebnisse.
    //   GC (gc_final)                              : Platz <= 10
    //   Etappenwertung (stage_result)              : Platz <= 10
    //   Punkte/Berg/Nachwuchs (*_final)            : alle mit Punkten
    //   Eintagesrennen (one_day_result), regulaer  : Platz <= 25
    //     inkl. WM/EM/Olympia/kontinentale Meisterschaften (Eintagesrennen)
    //   Nationale Meisterschaften (Kat. 14/15)     : Platz <= 10
    // Flach (Newcomer): wie bisher alle mit Punkten ausser Trikot-Tagespunkten.
    const filterClause = groupByRace
      ? `AND (
             (spe.award_type = 'gc_final' AND spe.rank <= 10)
          OR (spe.award_type = 'stage_result' AND spe.rank <= 10)
          OR (spe.award_type IN ('points_final', 'mountain_final', 'youth_final'))
          OR (spe.award_type = 'one_day_result' AND r.category_id IN (14, 15) AND spe.rank <= 10)
          OR (spe.award_type = 'one_day_result' AND (r.category_id IS NULL OR r.category_id NOT IN (14, 15)) AND spe.rank <= 25)
        )`
      : `AND spe.award_type NOT LIKE '%\\_leader\\_day' ESCAPE '\\'`;
    const rows = this.db.prepare(`
      SELECT r.name AS raceName, r.prestige AS prestige, spe.season AS season,
             spe.points_awarded AS points, spe.rank AS rank, spe.award_type AS award,
             r.category_id AS categoryId, kategorie.name AS categoryName
      FROM season_point_events spe
      JOIN races r ON r.id = spe.race_id
      LEFT JOIN race_categories kategorie ON kategorie.id = r.category_id
      WHERE spe.rider_id = ? AND spe.points_awarded > 0
        ${filterClause}
        ${seasonClause}
    `).all(...params) as Array<{
      raceName: string; prestige: number; season: number; points: number;
      rank: number; award: string; categoryId: number | null; categoryName: string | null;
    }>;

    const groups = new Map<string, WrappedCareerResult & { order: number }>();
    for (const row of rows) {
      const type = awardLabel(row.award);
      const key = `${row.raceName}|${type}|${row.rank}|${row.points}`;
      const existing = groups.get(key);
      if (existing) {
        existing.count += 1;
        existing.season = Math.max(existing.season, row.season);
        // Die Jahre gehoeren zur Gruppe: "3x Etappe" allein sagt nicht, wann.
        if (!existing.seasons.includes(row.season)) existing.seasons.push(row.season);
      } else {
        groups.set(key, {
          raceName: row.raceName, season: row.season, seasons: [row.season], points: row.points,
          rank: row.rank, type, count: 1, prestige: row.prestige ?? 0,
          categoryId: row.categoryId ?? null, categoryName: row.categoryName ?? null,
          isClassification: row.award.endsWith('_final'),
          order: awardOrder(row.award),
        });
      }
    }
    for (const gruppe of groups.values()) gruppe.seasons.sort((a, b) => a - b);
    const list = [...groups.values()];
    if (groupByRace) {
      // Nach Rennen (Prestige absteigend) gruppiert; innerhalb eines Rennens nach
      // Typ gruppiert (Wertungen GC/Punkte/Berg/Nachwuchs zuerst, dann Etappen/
      // Eintages), innerhalb eines Typs nach Punkten absteigend.
      list.sort((a, b) =>
        b.prestige - a.prestige
        || a.raceName.localeCompare(b.raceName)
        || a.order - b.order
        || b.points - a.points
        || b.count - a.count);
    } else {
      list.sort((a, b) => b.points - a.points || b.prestige - a.prestige || b.count - a.count);
    }
    return list.slice(0, limit).map(({ order: _o, ...rest }) => rest);
  }

  // Vollstaendige Rangliste einer Saison. Ohne LIMIT, weil daraus auch der
  // Vorjahresplatz fuer den Auf-/Abstiegspfeil kommt — mit LIMIT waere jeder
  // Fahrer ausserhalb der Top 10 faelschlich "neu".
  private winsRanking(season: number, filter = WIN_FILTER): Array<{ riderId: number; wins: number }> {
    return this.db.prepare(`
      SELECT spe.rider_id AS riderId, COUNT(*) AS wins
      FROM season_point_events spe
      JOIN races r ON r.id = spe.race_id
      WHERE spe.season = ? AND ${filter}
      GROUP BY spe.rider_id
      ORDER BY wins DESC, spe.rider_id ASC
    `).all(season) as Array<{ riderId: number; wins: number }>;
  }

  private static rankMap<T extends { riderId?: number; teamId?: number }>(
    rows: T[], key: (row: T) => number,
  ): Map<number, number> {
    return new Map(rows.map((row, index) => [key(row), index + 1]));
  }

  private topRidersByWins(season: number, limit = 10, filter = WIN_FILTER): WrappedWinsEntry[] {
    const vorjahr = WrappedService.rankMap(this.winsRanking(season - 1, filter), (r) => r.riderId);
    const out: WrappedWinsEntry[] = [];
    for (const row of this.winsRanking(season, filter).slice(0, limit)) {
      const rider = this.riderRef(row.riderId);
      if (rider) out.push({ rider, wins: row.wins, previousRank: vorjahr.get(row.riderId) ?? null });
    }
    return out;
  }

  private topRidersByPoints(season: number, limit = 10): WrappedRiderPoints[] {
    const vorjahr = this.seasonRankMap(season - 1);
    const rows = this.db.prepare(`
      SELECT rider_id AS riderId, SUM(points_awarded) AS points
      FROM season_point_events
      WHERE season = ?
      GROUP BY rider_id
      ORDER BY points DESC, rider_id ASC
      LIMIT ?
    `).all(season, limit) as Array<{ riderId: number; points: number }>;
    const out: WrappedRiderPoints[] = [];
    for (const row of rows) {
      const rider = this.riderRef(row.riderId);
      if (rider) out.push({ rider, points: row.points, previousRank: vorjahr.get(row.riderId) ?? null });
    }
    return out;
  }

  // Ewige Bestenliste nach dieser Saison. Die kumulierten Ranglisten liegen
  // ohnehin schon vor (Legenden/Herausgefallene) — hier kommt keine weitere
  // Abfrage dazu, nur ein Schnitt durch die vorhandene Reihenfolge.
  private allTimeTop(
    now: { ordered: Array<{ riderId: number; pts: number; rank: number }> },
    prev: { rankById: Map<number, number> },
    limit = 20,
  ): WrappedRiderPoints[] {
    const out: WrappedRiderPoints[] = [];
    for (const entry of now.ordered.slice(0, limit)) {
      const rider = this.riderRef(entry.riderId);
      // Wer vor dieser Saison noch keinen Punkt hatte, steht nicht in der
      // Vorjahres-Rangliste — rankDelta zeigt dafuer "NEU".
      if (rider) out.push({ rider, points: entry.pts, previousRank: prev.rankById.get(entry.riderId) ?? null });
    }
    return out;
  }

  private riderSeasonWins(season: number, riderId: number): number {
    const row = this.db.prepare(`
      SELECT COUNT(*) AS wins FROM season_point_events spe
      JOIN races r ON r.id = spe.race_id
      WHERE spe.season = ? AND spe.rider_id = ? AND ${WIN_FILTER}
    `).get(season, riderId) as { wins: number };
    return row?.wins ?? 0;
  }

  private teamWinsRanking(season: number): WrappedTeamStat[] {
    return this.db.prepare(`
      SELECT spe.team_id AS teamId, t.name AS teamName, COUNT(*) AS value
      FROM season_point_events spe
      JOIN races r ON r.id = spe.race_id
      JOIN teams t ON t.id = spe.team_id
      WHERE spe.season = ? AND ${WIN_FILTER}
      GROUP BY spe.team_id
      ORDER BY value DESC, t.name ASC
    `).all(season) as WrappedTeamStat[];
  }

  private topTeamsByWins(season: number, limit = 10): WrappedTeamStat[] {
    const vorjahr = WrappedService.rankMap(this.teamWinsRanking(season - 1), (t) => t.teamId);
    return this.teamWinsRanking(season).slice(0, limit)
      .map((team) => ({ ...team, previousRank: vorjahr.get(team.teamId) ?? null }));
  }

  private bestNewcomers(season: number, seasonRank: Map<number, number>, limit = 3): WrappedNewcomer[] {
    if (!tableExists(this.db, 'contracts')) return [];
    const rows = this.db.prepare(`
      WITH newcomers AS (
        SELECT rider_id FROM contracts GROUP BY rider_id HAVING MIN(start_season) = ?
      )
      SELECT spe.rider_id AS riderId, SUM(spe.points_awarded) AS uciPoints
      FROM season_point_events spe
      JOIN newcomers n ON n.rider_id = spe.rider_id
      WHERE spe.season = ?
      GROUP BY spe.rider_id
      HAVING uciPoints > 0
      ORDER BY uciPoints DESC
      LIMIT ?
    `).all(season, season, limit) as Array<{ riderId: number; uciPoints: number }>;
    const out: WrappedNewcomer[] = [];
    for (const row of rows) {
      const rider = this.riderRef(row.riderId);
      if (rider) out.push({
        rider, uciPoints: row.uciPoints,
        wins: this.riderSeasonWins(season, row.riderId),
        seasonUciRank: seasonRank.get(row.riderId) ?? null,
        bestResults: this.bestResults(row.riderId, 10, season),
      });
    }
    return out;
  }

  private careerWins(riderId: number): number {
    if (!tableExists(this.db, 'rider_career_category_stats')) return 0;
    const row = this.db.prepare(
      'SELECT COALESCE(SUM(gc_wins + stage_wins + one_day_wins),0) AS w FROM rider_career_category_stats WHERE rider_id = ?',
    ).get(riderId) as { w: number };
    return row?.w ?? 0;
  }

  /**
   * Abschiede der Saison, nach All-Time-UCI-Punkten sortiert.
   *
   * Gezeigt werden die besten `mindestens` — und darueber hinaus jeder, der in
   * der ewigen Bestenliste in den Top `elitegrenze` steht. Ein fester Deckel
   * von fuenf verschwieg in Jahrgaengen mit vielen grossen Karriereenden
   * Fahrer, die in der ewigen Wertung weit vorne stehen.
   *
   * Beide Reihenfolgen — die Abfrage hier und `allTimeRank` — sortieren nach
   * denselben All-Time-Punkten, die Elitefahrer bilden also immer einen
   * Praefix der Liste; die Auswahl kann nicht loechrig werden.
   */
  private retirees(
    season: number,
    allTimeRank: Map<number, number>,
    mindestens = 10,
    elitegrenze = 100,
  ): { list: WrappedRetiree[]; ids: Set<number> } {
    if (!columnExists(this.db, 'riders', 'retired_season')) return { list: [], ids: new Set() };
    const alle = this.db.prepare(`
      SELECT ri.id AS riderId,
             (SELECT COALESCE(SUM(points_awarded),0) FROM season_point_events WHERE rider_id = ri.id) AS uci
      FROM riders ri
      WHERE ri.retired_season = ?
      ORDER BY uci DESC
    `).all(season) as Array<{ riderId: number; uci: number }>;
    // Erst auswaehlen, dann Details laden: die Karrierezahlen und die besten
    // Ergebnisse je Fahrer sind teuer, und ein Jahrgang kann Hunderte
    // Ruecktritte umfassen.
    const rows = alle.filter((row, index) =>
      index < mindestens || (allTimeRank.get(row.riderId) ?? Number.POSITIVE_INFINITY) <= elitegrenze);
    const list: WrappedRetiree[] = [];
    const ids = new Set<number>();
    for (const row of rows) {
      const rider = this.riderRef(row.riderId);
      if (!rider) continue;
      ids.add(row.riderId);
      const cn = this.careerNumbers(row.riderId);
      list.push({
        rider, allTimeUciPoints: row.uci,
        allTimeUciRank: allTimeRank.get(row.riderId) ?? null,
        careerWins: this.careerWins(row.riderId),
        bestResults: this.bestResults(row.riderId, 200, undefined, true),
        careerFromSeason: cn.from, careerToSeason: cn.to,
        grandTourWins: cn.gt, monumentWins: cn.monument,
      });
    }
    return { list, ids };
  }

  // Fahrer, die in dieser Saison neu in eine All-Time-UCI-Stufe (Top 25/10/3/1)
  // aufgestiegen sind — verglichen mit dem Stand bis zum Vorjahr.
  private legends(
    season: number,
    retireeIds: Set<number>,
    now: ReturnType<WrappedService['cumulativeRanking']>,
    prev: ReturnType<WrappedService['cumulativeRanking']>,
  ): WrappedLegend[] {
    const TIERS = [1, 3, 10, 25];
    const out: WrappedLegend[] = [];
    for (const entry of now.ordered.slice(0, 25)) {
      if (retireeIds.has(entry.riderId)) continue; // Retirees stehen bereits eigen
      const rankPrev = prev.rankById.get(entry.riderId) ?? Number.POSITIVE_INFINITY;
      let newTier: number | null = null;
      for (const t of TIERS) {
        if (entry.rank <= t && rankPrev > t) { newTier = t; break; }
      }
      if (newTier == null) continue;
      const rider = this.riderRef(entry.riderId);
      if (!rider) continue;
      const birth = this.db.prepare('SELECT birth_year AS birthYear FROM riders WHERE id = ?').get(entry.riderId) as { birthYear: number } | undefined;
      out.push({
        rider, allTimeUciPoints: entry.pts, allTimeUciRank: entry.rank,
        careerWins: this.careerWins(entry.riderId),
        bestResults: this.bestResults(entry.riderId, 200, undefined, true),
        newTier,
        age: birth?.birthYear ? season - birth.birthYear : null,
      });
    }
    out.sort((a, b) => a.newTier - b.newTier || (a.allTimeUciRank ?? 0) - (b.allTimeUciRank ?? 0));
    return out;
  }

  // Fahrer, die in dieser Saison AUS den Top 25 der All-Time-UCI-Wertung
  // herausgefallen sind (bis zur Vorsaison in den Top 25, jetzt dahinter).
  // Eigene Detail-Ansicht wie bei Retirees/Legenden.
  private fallenLegends(
    season: number,
    retireeIds: Set<number>,
    now: ReturnType<WrappedService['cumulativeRanking']>,
    prev: ReturnType<WrappedService['cumulativeRanking']>,
  ): WrappedFallenLegend[] {
    const CUTOFF = 25;
    const nowPtsById = new Map(now.ordered.map((r) => [r.riderId, r.pts]));
    const out: WrappedFallenLegend[] = [];
    for (const entry of prev.ordered.slice(0, CUTOFF)) {
      if (retireeIds.has(entry.riderId)) continue; // Retirees stehen bereits eigen
      const nowRank = now.rankById.get(entry.riderId) ?? Number.POSITIVE_INFINITY;
      if (nowRank <= CUTOFF) continue; // weiterhin in den Top 25 -> keine Legende im Abstieg
      const rider = this.riderRef(entry.riderId);
      if (!rider) continue;
      const cn = this.careerNumbers(entry.riderId);
      out.push({
        rider,
        previousRank: entry.rank,
        currentRank: Number.isFinite(nowRank) ? nowRank : null,
        allTimeUciPoints: nowPtsById.get(entry.riderId) ?? entry.pts,
        careerWins: this.careerWins(entry.riderId),
        bestResults: this.bestResults(entry.riderId, 200, undefined, true),
        careerFromSeason: cn.from, careerToSeason: cn.to,
        grandTourWins: cn.gt, monumentWins: cn.monument,
      });
    }
    out.sort((a, b) => a.previousRank - b.previousRank);
    return out;
  }

  // ---- Ueberraschung des Jahres ----------------------------------------
  private surprise(season: number, raceWinners: RaceWinnerEntry[]): WrappedSurprise {
    let lowestOvrWinner: WrappedSurprise['lowestOvrWinner'] = null;
    let youngestMonumentWinner: WrappedSurprise['youngestMonumentWinner'] = null;
    const info = this.db.prepare('SELECT overall_rating AS ovr, birth_year AS birthYear FROM riders WHERE id = ?');
    for (const w of raceWinners) {
      if (!w.winner) continue;
      const row = info.get(w.winner.riderId) as { ovr: number; birthYear: number } | undefined;
      if (!row) continue;
      const ovr = Math.round(row.ovr);
      if (!lowestOvrWinner || ovr < lowestOvrWinner.value) {
        lowestOvrWinner = { rider: w.winner, raceName: w.raceName, categoryId: w.categoryId, value: ovr };
      }
      if (w.categoryId === 3) { // Monument
        const age = season - row.birthYear;
        if (!youngestMonumentWinner || age < youngestMonumentWinner.value) {
          youngestMonumentWinner = { rider: w.winner, raceName: w.raceName, categoryId: w.categoryId, value: age };
        }
      }
    }
    return { lowestOvrWinner, youngestMonumentWinner };
  }

  // ---- Rekorde der Saison ----------------------------------------------
  // Laengste Serie aufeinanderfolgender Renntags-Siege (Etappen/Eintages,
  // chronologisch). Nur Kandidaten mit >= 2 Siegen werden geprueft.
  private longestWinStreak(season: number): WrappedRecords['longestStreak'] {
    const candidates = (this.db.prepare(`
      SELECT spe.rider_id AS id
      FROM season_point_events spe
      WHERE spe.season = ? AND spe.rank = 1 AND spe.award_type IN ('stage_result','one_day_result')
      GROUP BY spe.rider_id HAVING COUNT(*) >= 2
    `).all(season) as Array<{ id: number }>).map((r) => r.id);
    if (candidates.length === 0) return null;
    const rows = this.db.prepare(`
      SELECT spe.rider_id AS rid, spe.rank AS rank
      FROM season_point_events spe
      WHERE spe.season = ? AND spe.award_type IN ('stage_result','one_day_result')
        AND spe.rider_id IN (${candidates.join(',')})
      ORDER BY spe.rider_id, spe.awarded_on, spe.stage_id
    `).all(season) as Array<{ rid: number; rank: number }>;
    let bestRider = -1, bestStreak = 0, curRider = -1, cur = 0;
    for (const row of rows) {
      if (row.rid !== curRider) { curRider = row.rid; cur = 0; }
      if (row.rank === 1) { cur += 1; if (cur > bestStreak) { bestStreak = cur; bestRider = row.rid; } }
      else cur = 0;
    }
    if (bestRider < 0 || bestStreak < 2) return null;
    const rider = this.riderRef(bestRider);
    return rider ? { rider, streak: bestStreak } : null;
  }

  private records(season: number, topRidersByWins: WrappedWinsEntry[], topTeamsByPoints: WrappedTeamStat[]): WrappedRecords {
    const mostWins = topRidersByWins[0] ?? null;
    let teamDominance: WrappedRecords['teamDominance'] = null;
    if (topTeamsByPoints.length >= 1) {
      const lead = topTeamsByPoints.length >= 2 ? topTeamsByPoints[0].value - topTeamsByPoints[1].value : topTeamsByPoints[0].value;
      teamDominance = { team: topTeamsByPoints[0], lead };
    }
    return { mostWins, teamDominance, longestStreak: this.longestWinStreak(season) };
  }

  // ---- Retiree "Karriere in Zahlen" ------------------------------------
  private careerNumbers(riderId: number): { from: number | null; to: number | null; gt: number; monument: number } {
    const span = this.db.prepare(
      'SELECT MIN(season) AS f, MAX(season) AS t FROM season_point_events WHERE rider_id = ?',
    ).get(riderId) as { f: number | null; t: number | null };
    let gt = 0, monument = 0;
    if (tableExists(this.db, 'rider_career_category_stats')) {
      gt = (this.db.prepare(
        `SELECT COALESCE(SUM(gc_wins),0) AS w FROM rider_career_category_stats
         WHERE rider_id = ? AND category_name IN ('World Tour - Tour de France','World Tour - Grand Tour')`,
      ).get(riderId) as { w: number }).w;
      monument = (this.db.prepare(
        `SELECT COALESCE(SUM(one_day_wins),0) AS w FROM rider_career_category_stats
         WHERE rider_id = ? AND category_name = 'World Tour - Monument'`,
      ).get(riderId) as { w: number }).w;
    }
    return { from: span?.f ?? null, to: span?.t ?? null, gt, monument };
  }

  // ---- Eigenes Team ----------------------------------------------------
  private playerTeam(season: number, resultRepo: ResultRepository): WrappedPlayerTeam | null {
    const team = this.db.prepare(
      'SELECT id, name FROM teams WHERE is_player_team = 1 LIMIT 1',
    ).get() as { id: number; name: string } | undefined;
    if (!team) return null;

    const platz = (jahr: number): { rank: number | null; points: number } => {
      const stand = resultRepo.getSeasonStandings(jahr).teamStandings;
      const index = stand.findIndex((row) => row.teamId === team.id);
      return index < 0
        ? { rank: null, points: 0 }
        : { rank: index + 1, points: stand[index]!.points };
    };
    const jetzt = platz(season);
    const vorher = platz(season - 1);

    const siege = (jahr: number): number => (this.db.prepare(`
      SELECT COUNT(*) AS n FROM season_point_events spe
      JOIN races r ON r.id = spe.race_id
      WHERE spe.season = ? AND spe.team_id = ? AND ${WIN_FILTER}
    `).get(jahr, team.id) as { n: number }).n;

    const besterRow = this.db.prepare(`
      SELECT rider_id AS riderId, SUM(points_awarded) AS points
      FROM season_point_events
      WHERE season = ? AND team_id = ?
      GROUP BY rider_id
      ORDER BY points DESC, rider_id ASC
      LIMIT 1
    `).get(season, team.id) as { riderId: number; points: number } | undefined;
    const besterRef = besterRow ? this.riderRef(besterRow.riderId) : null;
    const seasonRank = this.seasonRankMap(season);

    const groessterRow = this.db.prepare(`
      SELECT spe.rider_id AS riderId, r.name AS raceName,
             spe.points_awarded AS points, spe.award_type AS award
      FROM season_point_events spe
      JOIN races r ON r.id = spe.race_id
      WHERE spe.season = ? AND spe.team_id = ? AND ${WIN_FILTER}
      ORDER BY spe.points_awarded DESC
      LIMIT 1
    `).get(season, team.id) as { riderId: number; raceName: string; points: number; award: string } | undefined;
    const groessterRef = groessterRow ? this.riderRef(groessterRow.riderId) : null;

    const mitSieg = (this.db.prepare(`
      SELECT COUNT(DISTINCT spe.rider_id) AS n FROM season_point_events spe
      JOIN races r ON r.id = spe.race_id
      WHERE spe.season = ? AND spe.team_id = ? AND ${WIN_FILTER}
    `).get(season, team.id) as { n: number }).n;

    return {
      teamId: team.id,
      teamName: team.name,
      rank: jetzt.rank,
      previousRank: vorher.rank,
      points: jetzt.points,
      previousPoints: vorher.points,
      wins: siege(season),
      previousWins: siege(season - 1),
      bestRider: besterRow && besterRef
        ? { rider: besterRef, points: besterRow.points, seasonRank: seasonRank.get(besterRow.riderId) ?? null }
        : null,
      biggestWin: groessterRow && groessterRef
        ? {
          rider: groessterRef, raceName: groessterRow.raceName,
          points: groessterRow.points, type: awardLabel(groessterRow.award),
        }
        : null,
      ridersWithWin: mitSieg,
    };
  }

  // ---- Punkteverlauf ---------------------------------------------------
  private progression(season: number, top: WrappedRiderPoints[]): WrappedProgression | null {
    const drei = top.slice(0, 3);
    if (drei.length === 0) return null;

    const series: WrappedProgressionSeries[] = [];
    for (const eintrag of drei) {
      const rows = this.db.prepare(`
        SELECT awarded_on AS date, SUM(points_awarded) AS points
        FROM season_point_events
        WHERE season = ? AND rider_id = ? AND awarded_on IS NOT NULL
        GROUP BY awarded_on
        ORDER BY awarded_on ASC
      `).all(season, eintrag.rider.riderId) as Array<{ date: string; points: number }>;
      let summe = 0;
      const punkte = rows.map((row) => { summe += row.points; return { date: row.date, total: summe }; });
      series.push({ rider: eintrag.rider, points: punkte, total: summe });
    }
    if (series.every((reihe) => reihe.points.length === 0)) return null;

    // `races` hat keine Saisonspalte — die Rennen einer Saison haengen am Datum.
    const markers = (this.db.prepare(`
      SELECT name, start_date AS date
      FROM races
      WHERE category_id IN (${GRAND_TOUR_CATEGORIES.join(',')})
        AND start_date LIKE ?
      ORDER BY start_date ASC
    `).all(`${season}%`) as Array<{ name: string; date: string }>)
      .map((row) => ({ date: row.date, label: row.name }));

    const alleDaten = series.flatMap((reihe) => reihe.points.map((punkt) => punkt.date));
    return {
      series,
      markers,
      fromDate: `${season}-01-01`,
      toDate: alleDaten.length > 0 ? alleDaten.reduce((a, b) => (a > b ? a : b)) : `${season}-12-31`,
      maxPoints: Math.max(...series.map((reihe) => reihe.total), 1),
    };
  }

  // ---- Duell des Jahres ------------------------------------------------
  private rivalry(season: number): WrappedRivalry | null {
    if (!tableExists(this.db, 'rivalries')) return null;
    const row = this.db.prepare(`
      SELECT rider_a_id, rider_b_id, intensity, encounters,
             win_a, win_b, season_win_a, season_win_b, top_category_id, discipline
      FROM rivalries WHERE season = ? ORDER BY rank ASC LIMIT 1
    `).get(season) as any;
    if (!row) return null;
    const riderA = this.riderRef(row.rider_a_id);
    const riderB = this.riderRef(row.rider_b_id);
    if (!riderA || !riderB) return null;
    return {
      riderA, riderB,
      encounters: row.encounters ?? 0,
      seasonWinA: row.season_win_a ?? 0,
      seasonWinB: row.season_win_b ?? 0,
      careerWinA: row.win_a ?? 0,
      careerWinB: row.win_b ?? 0,
      intensity: row.intensity ?? 0,
      discipline: row.discipline ?? null,
      topCategoryId: row.top_category_id ?? null,
    };
  }

  // ---- Trikottage ------------------------------------------------------
  // Die `*_leader_day`-Ereignisse werden ueberall sonst herausgefiltert; hier
  // sind sie der Punkt: wer trug am laengsten ein Fuehrungstrikot.
  private jerseyDays(season: number, limit = 3): WrappedJerseyGroup[] {
    const abfrage = this.db.prepare(`
      SELECT rider_id AS riderId, COUNT(*) AS days
      FROM season_point_events
      WHERE season = ? AND award_type = ?
      GROUP BY rider_id
      ORDER BY days DESC, rider_id ASC
      LIMIT ?
    `);
    const gruppen: WrappedJerseyGroup[] = [];
    for (const trikot of JERSEYS) {
      const rows = abfrage.all(season, trikot.award, limit) as Array<{ riderId: number; days: number }>;
      const holders: WrappedJerseyGroup['holders'] = [];
      for (const row of rows) {
        const rider = this.riderRef(row.riderId);
        if (rider) holders.push({ rider, days: row.days });
      }
      if (holders.length > 0) gruppen.push({ key: trikot.key, label: trikot.label, holders });
    }
    return gruppen;
  }

  // ---- Wertungstrikots der Grand Tours ---------------------------------
  private grandTourClassifications(season: number): WrappedGrandTourClassifications[] {
    const rennen = this.db.prepare(`
      SELECT id, name, category_id AS categoryId
      FROM races
      WHERE category_id IN (${GRAND_TOUR_CATEGORIES.join(',')})
        AND start_date LIKE ?
      ORDER BY start_date ASC
    `).all(`${season}%`) as Array<{ id: number; name: string; categoryId: number }>;

    const sieger = this.db.prepare(`
      SELECT rider_id AS riderId FROM season_point_events
      WHERE season = ? AND race_id = ? AND award_type = ? AND rank = 1
      LIMIT 1
    `);
    const hole = (raceId: number, award: string): PalmaresRiderRef | null => {
      const row = sieger.get(season, raceId, award) as { riderId: number } | undefined;
      return row ? this.riderRef(row.riderId) : null;
    };

    const out: WrappedGrandTourClassifications[] = [];
    for (const rennenZeile of rennen) {
      const eintrag: WrappedGrandTourClassifications = {
        raceId: rennenZeile.id,
        raceName: rennenZeile.name,
        categoryId: rennenZeile.categoryId,
        points: hole(rennenZeile.id, 'points_final'),
        mountain: hole(rennenZeile.id, 'mountain_final'),
        youth: hole(rennenZeile.id, 'youth_final'),
      };
      if (eintrag.points || eintrag.mountain || eintrag.youth) out.push(eintrag);
    }
    return out;
  }

  // ---- Pech und Schinderei ---------------------------------------------
  private grind(season: number, limit = 5): WrappedGrind {
    if (!tableExists(this.db, 'rider_season_stats')) return { unluckiest: [], workhorses: [] };
    const bauen = (rows: Array<{
      riderId: number; value: number; injuryDays: number; illnessDays: number; raceDays: number;
    }>): WrappedGrindEntry[] => {
      const out: WrappedGrindEntry[] = [];
      for (const row of rows) {
        const rider = this.riderRef(row.riderId);
        if (rider) out.push({
          rider, value: row.value,
          injuryDays: row.injuryDays, illnessDays: row.illnessDays, raceDays: row.raceDays,
        });
      }
      return out;
    };
    const spalten = `
      rider_id AS riderId,
      COALESCE(injury_days, 0) AS injuryDays,
      COALESCE(illness_days, 0) AS illnessDays,
      COALESCE(race_days, 0) AS raceDays`;
    const unluckiest = bauen(this.db.prepare(`
      SELECT ${spalten}, COALESCE(injury_days, 0) + COALESCE(illness_days, 0) AS value
      FROM rider_season_stats
      WHERE season = ?
      ORDER BY value DESC, rider_id ASC
      LIMIT ?
    `).all(season, limit) as any[]);
    const workhorses = bauen(this.db.prepare(`
      SELECT ${spalten}, COALESCE(race_days, 0) AS value
      FROM rider_season_stats
      WHERE season = ?
      ORDER BY value DESC, rider_id ASC
      LIMIT ?
    `).all(season, limit) as any[]);
    return {
      unluckiest: unluckiest.filter((eintrag) => eintrag.value > 0),
      workhorses: workhorses.filter((eintrag) => eintrag.value > 0),
    };
  }

  // ---- Staerkste Felder ------------------------------------------------
  private strongestFields(season: number, limit = 10): WrappedStrongestField[] {
    if (!tableExists(this.db, 'race_startlist_quality')) return [];
    return this.db.prepare(`
      SELECT q.race_id AS raceId, r.name AS raceName, q.score AS score, q.starters AS starters
      FROM race_startlist_quality q
      JOIN races r ON r.id = q.race_id
      WHERE q.season = ?
      ORDER BY q.score DESC, r.name ASC
      LIMIT ?
    `).all(season, limit) as WrappedStrongestField[];
  }

  public getWrapped(season: number): SeasonWrappedPayload {
    const resultRepo = new ResultRepository(this.db);
    const hasEvents = tableExists(this.db, 'season_point_events');
    // Jahressieger (inkl. 2./3. Platz) aus DERSELBEN Quelle wie die
    // Season-Standings-Jahresuebersicht, damit Format & Daten identisch sind.
    const standings = resultRepo.getSeasonStandings(season);
    const raceWinners = standings.raceWinners ?? [];
    const teamStandings = standings.teamStandings;
    // Vorjahresplatz fuer den Auf-/Abstiegspfeil aus derselben Quelle.
    const teamStandingsVorjahr = resultRepo.getSeasonStandings(season - 1).teamStandings;
    const teamRangVorjahr = new Map(teamStandingsVorjahr
      .filter((t) => t.teamId != null)
      .map((t, index) => [t.teamId as number, index + 1]));
    const topTeamsByPoints: WrappedTeamStat[] = teamStandings
      .filter((t) => t.teamId != null)
      .slice(0, 10)
      .map((t) => ({
        teamId: t.teamId as number, teamName: t.teamName, value: t.points,
        previousRank: teamRangVorjahr.get(t.teamId as number) ?? null,
      }));

    // Kumulative All-Time-Ranglisten (bis Saison bzw. Vorsaison) einmal berechnen
    // und an Legenden + Herausgefallene weiterreichen.
    const cumNow = hasEvents ? this.cumulativeRanking(season) : { ordered: [], rankById: new Map<number, number>() };
    const cumPrev = hasEvents ? this.cumulativeRanking(season - 1) : { ordered: [], rankById: new Map<number, number>() };
    const allTimeRank = cumNow.rankById;
    const seasonRank = hasEvents ? this.seasonRankMap(season) : new Map<number, number>();
    const { list: retirees, ids: retireeIds } = this.retirees(season, allTimeRank);
    const topRidersByWins = this.topRidersByWins(season);
    const topRidersByPoints = this.topRidersByPoints(season);

    return {
      season,
      raceWinners,
      topRidersByWins,
      topRidersBySecond: this.topRidersByWins(season, 5, SECOND_FILTER),
      topRidersByPoints,
      allTimeTop: this.allTimeTop(cumNow, cumPrev),
      topTeamsByWins: this.topTeamsByWins(season),
      topTeamsByPoints,
      bestNewcomers: this.bestNewcomers(season, seasonRank),
      playerTeam: this.playerTeam(season, resultRepo),
      progression: hasEvents ? this.progression(season, topRidersByPoints) : null,
      rivalry: this.rivalry(season),
      jerseyDays: hasEvents ? this.jerseyDays(season) : [],
      grandTourClassifications: hasEvents ? this.grandTourClassifications(season) : [],
      grind: this.grind(season),
      strongestFields: this.strongestFields(season),
      retirees,
      legends: hasEvents ? this.legends(season, retireeIds, cumNow, cumPrev) : [],
      fallenLegends: hasEvents ? this.fallenLegends(season, retireeIds, cumNow, cumPrev) : [],
      surprise: hasEvents ? this.surprise(season, raceWinners) : { lowestOvrWinner: null, youngestMonumentWinner: null },
      records: hasEvents ? this.records(season, topRidersByWins, topTeamsByPoints) : { mostWins: null, teamDominance: null, longestStreak: null },
    };
  }
}
