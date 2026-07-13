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
  PalmaresRiderRef,
  RaceWinnerEntry,
} from '../../../shared/types';

// Nur echte Renn-Siege zaehlen (Etappe/Eintages/GC), keine Wertungstrikots.
const WIN_FILTER = `
  spe.rank = 1 AND (
    (r.is_stage_race = 1 AND spe.award_type IN ('stage_result','gc_final'))
    OR (r.is_stage_race = 0 AND spe.award_type = 'one_day_result'))`;

function tableExists(db: Database.Database, name: string): boolean {
  return db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?").get(name) != null;
}
function columnExists(db: Database.Database, table: string, col: string): boolean {
  return (db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>).some((c) => c.name === col);
}

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
    const rows = this.db.prepare(`
      SELECT r.name AS raceName, r.prestige AS prestige, spe.season AS season,
             spe.points_awarded AS points, spe.rank AS rank, spe.award_type AS award
      FROM season_point_events spe
      JOIN races r ON r.id = spe.race_id
      WHERE spe.rider_id = ? AND spe.points_awarded > 0
        AND spe.award_type NOT LIKE '%\\_leader\\_day' ESCAPE '\\'
        ${seasonClause}
    `).all(...params) as Array<{ raceName: string; prestige: number; season: number; points: number; rank: number; award: string }>;

    const groups = new Map<string, WrappedCareerResult & { order: number }>();
    for (const row of rows) {
      const type = awardLabel(row.award);
      const key = `${row.raceName}|${type}|${row.rank}|${row.points}`;
      const existing = groups.get(key);
      if (existing) {
        existing.count += 1;
        existing.season = Math.max(existing.season, row.season);
      } else {
        groups.set(key, {
          raceName: row.raceName, season: row.season, points: row.points,
          rank: row.rank, type, count: 1, prestige: row.prestige ?? 0,
          isClassification: row.award.endsWith('_final'),
          order: awardOrder(row.award),
        });
      }
    }
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

  private topRidersByWins(season: number, limit = 3): WrappedWinsEntry[] {
    const rows = this.db.prepare(`
      SELECT spe.rider_id AS riderId, COUNT(*) AS wins
      FROM season_point_events spe
      JOIN races r ON r.id = spe.race_id
      WHERE spe.season = ? AND ${WIN_FILTER}
      GROUP BY spe.rider_id
      ORDER BY wins DESC, spe.rider_id ASC
      LIMIT ?
    `).all(season, limit) as Array<{ riderId: number; wins: number }>;
    const out: WrappedWinsEntry[] = [];
    for (const row of rows) {
      const rider = this.riderRef(row.riderId);
      if (rider) out.push({ rider, wins: row.wins });
    }
    return out;
  }

  private topRidersByPoints(season: number, limit = 3): WrappedRiderPoints[] {
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
      if (rider) out.push({ rider, points: row.points });
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

  private topTeamsByWins(season: number, limit = 3): WrappedTeamStat[] {
    return this.db.prepare(`
      SELECT spe.team_id AS teamId, t.name AS teamName, COUNT(*) AS value
      FROM season_point_events spe
      JOIN races r ON r.id = spe.race_id
      JOIN teams t ON t.id = spe.team_id
      WHERE spe.season = ? AND ${WIN_FILTER}
      GROUP BY spe.team_id
      ORDER BY value DESC, t.name ASC
      LIMIT ?
    `).all(season, limit) as WrappedTeamStat[];
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

  private retirees(season: number, allTimeRank: Map<number, number>, limit = 5): { list: WrappedRetiree[]; ids: Set<number> } {
    if (!columnExists(this.db, 'riders', 'retired_season')) return { list: [], ids: new Set() };
    const rows = this.db.prepare(`
      SELECT ri.id AS riderId,
             (SELECT COALESCE(SUM(points_awarded),0) FROM season_point_events WHERE rider_id = ri.id) AS uci
      FROM riders ri
      WHERE ri.retired_season = ?
      ORDER BY uci DESC
      LIMIT ?
    `).all(season, limit) as Array<{ riderId: number; uci: number }>;
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
        bestResults: this.bestResults(row.riderId, 100, undefined, true),
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
        bestResults: this.bestResults(entry.riderId, 100, undefined, true),
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
        bestResults: this.bestResults(entry.riderId, 100, undefined, true),
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

  public getWrapped(season: number): SeasonWrappedPayload {
    const resultRepo = new ResultRepository(this.db);
    const hasEvents = tableExists(this.db, 'season_point_events');
    // Jahressieger (inkl. 2./3. Platz) aus DERSELBEN Quelle wie die
    // Season-Standings-Jahresuebersicht, damit Format & Daten identisch sind.
    const standings = resultRepo.getSeasonStandings(season);
    const raceWinners = standings.raceWinners ?? [];
    const teamStandings = standings.teamStandings;
    const topTeamsByPoints: WrappedTeamStat[] = teamStandings
      .filter((t) => t.teamId != null)
      .slice(0, 3)
      .map((t) => ({ teamId: t.teamId as number, teamName: t.teamName, value: t.points }));

    // Kumulative All-Time-Ranglisten (bis Saison bzw. Vorsaison) einmal berechnen
    // und an Legenden + Herausgefallene weiterreichen.
    const cumNow = hasEvents ? this.cumulativeRanking(season) : { ordered: [], rankById: new Map<number, number>() };
    const cumPrev = hasEvents ? this.cumulativeRanking(season - 1) : { ordered: [], rankById: new Map<number, number>() };
    const allTimeRank = cumNow.rankById;
    const seasonRank = hasEvents ? this.seasonRankMap(season) : new Map<number, number>();
    const { list: retirees, ids: retireeIds } = this.retirees(season, allTimeRank);
    const topRidersByWins = this.topRidersByWins(season);

    return {
      season,
      raceWinners,
      topRidersByWins,
      topRidersByPoints: this.topRidersByPoints(season),
      topTeamsByWins: this.topTeamsByWins(season),
      topTeamsByPoints,
      bestNewcomers: this.bestNewcomers(season, seasonRank),
      retirees,
      legends: hasEvents ? this.legends(season, retireeIds, cumNow, cumPrev) : [],
      fallenLegends: hasEvents ? this.fallenLegends(season, retireeIds, cumNow, cumPrev) : [],
      surprise: hasEvents ? this.surprise(season, raceWinners) : { lowestOvrWinner: null, youngestMonumentWinner: null },
      records: hasEvents ? this.records(season, topRidersByWins, topTeamsByPoints) : { mostWins: null, teamDominance: null, longestStreak: null },
    };
  }
}
