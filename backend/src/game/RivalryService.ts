import type Database from 'better-sqlite3';
import {
  scoreRivalryPair,
  selectSeasonRivalries,
  deriveRivalryDiscipline,
  RIVALRY_ELIGIBLE_ROLE_IDS,
  RIVALRY_MIN_OVERALL,
  type RivalryDuel,
  type RivalryDuelType,
  type RivalryPairMeta,
  type RankedRivalryPair,
} from '../../../shared/rivalries';
import type {
  RivalryOverviewPayload,
  RivalryOverviewItem,
  RivalryDetailPayload,
  RivalryDuelRow,
  RiderTopRival,
} from '../../../shared/types';

interface EligibleRider {
  id: number;
  birthYear: number;
  roleId: number | null;
  teamId: number | null;
  overall: number;
}

interface DuelEventRow {
  rider_id: number;
  stage_id: number;
  award_type: string;
  rank: number;
  team_id: number | null;
  race_id: number;
  race_name: string;
  category_id: number;
  is_stage_race: number;
  stage_date: string;
}

function tableExists(db: Database.Database, name: string): boolean {
  return db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?").get(name) != null;
}

function awardToType(award: string): RivalryDuelType {
  if (award === 'gc_final') return 'GC';
  if (award === 'stage_result') return 'Etappe';
  return 'Eintages';
}

function seasonOf(date: string): number {
  return Number.parseInt(date.slice(0, 4), 10);
}

// Kurzname der Kategorie (ohne "World Tour - "-Praefix).
function shortCategoryName(name: string): string {
  return name.replace(/^World Tour\s*-\s*/i, '').trim();
}

const DUEL_WHERE = `
  ((r.is_stage_race = 0 AND e.award_type = 'one_day_result')
    OR (r.is_stage_race = 1 AND e.award_type IN ('stage_result','gc_final')))`;

export class RivalryService {
  constructor(private readonly db: Database.Database) {}

  // Kandidaten-Saisons fuer die Materialisierung, neueste zuerst. Nur "reife"
  // Saisons (>= MIN_SEASON_RACES abgeschlossene Rennen) — so wird eine gerade
  // erst begonnene Saison nicht gewaehlt (dort haetten die Paare zu wenige
  // Duelle und wuerden alle vom "aktiv in Saison"-Gate verworfen). Fallback:
  // die hoechste vorhandene Saison, falls keine reif ist.
  private static readonly MIN_SEASON_RACES = 20;
  private resolveCandidateSeasons(): number[] {
    if (!tableExists(this.db, 'season_point_events')) return [];
    const rows = this.db.prepare(`
      SELECT season, COUNT(DISTINCT race_id) AS races
      FROM season_point_events
      WHERE award_type IN ('one_day_result','gc_final')
      GROUP BY season
      ORDER BY season DESC
    `).all() as Array<{ season: number; races: number }>;
    if (rows.length === 0) return [];
    const mature = rows.filter((r) => r.races >= RivalryService.MIN_SEASON_RACES).map((r) => r.season);
    return mature.length > 0 ? mature : [rows[0].season];
  }

  private getEligibleRiders(): EligibleRider[] {
    const placeholders = Array.from(RIVALRY_ELIGIBLE_ROLE_IDS).join(',');
    return this.db.prepare(`
      SELECT id, birth_year AS birthYear, role_id AS roleId, active_team_id AS teamId, overall_rating AS overall
      FROM riders
      WHERE role_id IN (${placeholders})
        AND overall_rating >= ?
        AND is_retired = 0
        AND active_team_id IS NOT NULL
    `).all(RIVALRY_MIN_OVERALL) as EligibleRider[];
  }

  // ---- Materialisierung -------------------------------------------------

  public rebuildRivalries(): void {
    if (!tableExists(this.db, 'rivalries') || !tableExists(this.db, 'season_point_events')) return;
    const candidateSeasons = this.resolveCandidateSeasons();
    if (candidateSeasons.length === 0) {
      this.db.prepare('DELETE FROM rivalries').run();
      return;
    }

    const eligible = this.getEligibleRiders();
    const byId = new Map(eligible.map((r) => [r.id, r] as const));
    if (eligible.length < 2) {
      this.db.transaction(() => this.db.prepare('DELETE FROM rivalries').run())();
      return;
    }

    const ids = eligible.map((r) => r.id).join(',');
    const rows = this.db.prepare(`
      SELECT e.rider_id, e.stage_id, e.award_type, e.rank, e.team_id,
             r.id AS race_id, r.name AS race_name, r.category_id, r.is_stage_race,
             s.date AS stage_date
      FROM season_point_events e
      JOIN stages s ON s.id = e.stage_id
      JOIN races r ON r.id = s.race_id
      WHERE e.rider_id IN (${ids}) AND ${DUEL_WHERE}
    `).all() as DuelEventRow[];

    // Nach (stage_id, award_type) gruppieren, dann Paare unter den eligible
    // Teilnehmern bilden.
    const groups = new Map<string, DuelEventRow[]>();
    for (const row of rows) {
      const key = `${row.stage_id}|${row.award_type}`;
      const list = groups.get(key);
      if (list) list.push(row); else groups.set(key, [row]);
    }

    // Pro Paar (minId-maxId) die Duelle sammeln. rankA = niedrigere Id.
    const pairDuels = new Map<string, RivalryDuel[]>();
    for (const list of groups.values()) {
      if (list.length < 2) continue;
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const x = list[i], y = list[j];
          const lo = x.rider_id < y.rider_id ? x : y;
          const hi = x.rider_id < y.rider_id ? y : x;
          const key = `${lo.rider_id}-${hi.rider_id}`;
          const duel: RivalryDuel = {
            season: seasonOf(lo.stage_date),
            categoryId: lo.category_id,
            type: awardToType(lo.award_type),
            rankA: lo.rank,
            rankB: hi.rank,
          };
          const arr = pairDuels.get(key);
          if (arr) arr.push(duel); else pairDuels.set(key, [duel]);
        }
      }
    }

    // Neueste reife Saison waehlen, die tatsaechlich Rivalitaeten liefert
    // (aeltere als Fallback, falls die jueingste keine ergibt).
    let targetSeason = candidateSeasons[0];
    let selected = selectSeasonRivalries([]);
    for (const season of candidateSeasons) {
      const ranked: RankedRivalryPair[] = [];
      for (const [key, duels] of pairDuels) {
        const [loId, hiId] = key.split('-').map(Number);
        const lo = byId.get(loId); const hi = byId.get(hiId);
        if (!lo || !hi) continue;
        const meta: RivalryPairMeta = {
          birthYearA: lo.birthYear, birthYearB: hi.birthYear,
          teamA: lo.teamId, teamB: hi.teamId,
          roleA: lo.roleId, roleB: hi.roleId,
        };
        const score = scoreRivalryPair(duels, meta, season);
        if (score.qualifies) ranked.push({ aId: loId, bId: hiId, score });
      }
      const picked = selectSeasonRivalries(ranked);
      if (picked.length > 0) { targetSeason = season; selected = picked; break; }
    }

    const insert = this.db.prepare(`
      INSERT INTO rivalries
        (season, rank, rider_a_id, rider_b_id, idx, intensity, encounters,
         win_a, win_b, season_win_a, season_win_b, top_category_id, discipline)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    `);

    this.db.transaction(() => {
      this.db.prepare('DELETE FROM rivalries WHERE season = ?').run(targetSeason);
      for (const sel of selected) {
        const lo = byId.get(sel.aId)!; const hi = byId.get(sel.bId)!;
        // Anzeige: staerkerer OVR links (= rider_a). Bei Gleichstand niedrigere Id.
        const swap = hi.overall > lo.overall || (hi.overall === lo.overall && hi.id < lo.id);
        const aId = swap ? sel.bId : sel.aId;
        const bId = swap ? sel.aId : sel.bId;
        const winA = swap ? sel.score.winB : sel.score.winA;
        const winB = swap ? sel.score.winA : sel.score.winB;
        const sWinA = swap ? sel.score.seasonWinB : sel.score.seasonWinA;
        const sWinB = swap ? sel.score.seasonWinA : sel.score.seasonWinB;
        const discipline = deriveRivalryDiscipline(sel.score.topCategoryId, lo.roleId, hi.roleId);
        insert.run(
          targetSeason, sel.rank, aId, bId, sel.index, sel.score.intensity,
          sel.score.encounters, winA, winB, sWinA, sWinB,
          sel.score.topCategoryId, discipline,
        );
      }
    })();
  }

  // ---- Lesen: Overview --------------------------------------------------

  private latestSeason(): number | null {
    if (!tableExists(this.db, 'rivalries')) return null;
    const row = this.db.prepare('SELECT MAX(season) AS s FROM rivalries').get() as { s: number | null };
    return row?.s ?? null;
  }

  private riderDisplay(riderId: number): {
    id: number; firstName: string; lastName: string; countryCode: string | null;
    teamId: number | null; teamName: string | null; roleId: number | null; roleName: string | null;
    overall: number; birthYear: number;
  } | null {
    const row = this.db.prepare(`
      SELECT r.id, r.first_name AS firstName, r.last_name AS lastName,
             c.code_3 AS countryCode, r.active_team_id AS teamId, t.name AS teamName,
             r.role_id AS roleId, role.name AS roleName, r.overall_rating AS overall,
             r.birth_year AS birthYear
      FROM riders r
      JOIN sta_country c ON c.id = r.country_id
      LEFT JOIN teams t ON t.id = r.active_team_id
      LEFT JOIN sta_role role ON role.id = r.role_id
      WHERE r.id = ?
    `).get(riderId) as any;
    return row ?? null;
  }

  private categoryNameMap(): Map<number, string> {
    const rows = this.db.prepare('SELECT id, name FROM race_categories').all() as Array<{ id: number; name: string }>;
    return new Map(rows.map((r) => [r.id, shortCategoryName(r.name)]));
  }

  public getOverview(season?: number): RivalryOverviewPayload {
    const target = season ?? this.latestSeason();
    if (target == null || !tableExists(this.db, 'rivalries')) {
      return { season: target ?? 0, seasons: [], rivalries: [] };
    }
    const seasons = (this.db.prepare('SELECT DISTINCT season FROM rivalries ORDER BY season DESC').all() as Array<{ season: number }>)
      .map((r) => r.season);
    const cats = this.categoryNameMap();
    const rows = this.db.prepare(`
      SELECT rank, rider_a_id AS aId, rider_b_id AS bId, idx, encounters,
             win_a AS winA, win_b AS winB, season_win_a AS sWinA, season_win_b AS sWinB,
             top_category_id AS topCat, discipline
      FROM rivalries WHERE season = ? ORDER BY rank ASC
    `).all(target) as any[];

    const rivalries: RivalryOverviewItem[] = [];
    for (const row of rows) {
      const a = this.riderDisplay(row.aId);
      const b = this.riderDisplay(row.bId);
      if (!a || !b) continue;
      rivalries.push({
        rank: row.rank,
        index: row.idx,
        discipline: row.discipline,
        topCategoryId: row.topCat,
        topCategoryName: row.topCat != null ? (cats.get(row.topCat) ?? null) : null,
        encounters: row.encounters,
        seasonWinA: row.sWinA, seasonWinB: row.sWinB,
        riderA: this.toOverviewRider(a),
        riderB: this.toOverviewRider(b),
      });
    }
    return { season: target, seasons, rivalries };
  }

  private toOverviewRider(r: NonNullable<ReturnType<RivalryService['riderDisplay']>>) {
    return {
      riderId: r.id, firstName: r.firstName, lastName: r.lastName,
      countryCode: r.countryCode, teamId: r.teamId, teamName: r.teamName,
      roleId: r.roleId, roleName: r.roleName, overallRating: r.overall,
    };
  }

  // ---- Lesen: Detail (Rivalitaetskarte) ---------------------------------

  private careerWins(riderId: number): number {
    if (!tableExists(this.db, 'rider_career_category_stats')) return 0;
    const row = this.db.prepare(
      'SELECT COALESCE(SUM(gc_wins + stage_wins + one_day_wins),0) AS w FROM rider_career_category_stats WHERE rider_id = ?',
    ).get(riderId) as { w: number };
    return row?.w ?? 0;
  }

  private allTimeUci(riderId: number): number {
    const row = this.db.prepare(
      'SELECT COALESCE(SUM(points_awarded),0) AS p FROM season_point_events WHERE rider_id = ?',
    ).get(riderId) as { p: number };
    return row?.p ?? 0;
  }

  private seasonProgram(riderId: number, season: number): string | null {
    if (!tableExists(this.db, 'rider_season_programs')) return null;
    const row = this.db.prepare(`
      SELECT rp.name AS name
      FROM rider_season_programs rsp
      JOIN race_programs rp ON rp.id = rsp.program_id
      WHERE rsp.season = ? AND rsp.rider_id = ?
    `).get(season, riderId) as { name: string } | undefined;
    return row?.name ?? null;
  }

  // Alle direkten Duelle des Paares (Anzeige-Reihenfolge A/B), neueste zuerst.
  private pairDuelsAllTime(aId: number, bId: number): RivalryDuelRow[] {
    const cats = this.categoryNameMap();
    const teamRows = this.db.prepare('SELECT id, name FROM teams').all() as Array<{ id: number; name: string }>;
    const teamName = new Map(teamRows.map((t) => [t.id, t.name]));
    const rows = this.db.prepare(`
      SELECT ea.rank AS rankA, eb.rank AS rankB, ea.team_id AS teamA, eb.team_id AS teamB,
             ea.award_type AS award, r.name AS raceName, r.category_id AS categoryId,
             r.is_stage_race AS isStageRace, s.date AS stageDate
      FROM season_point_events ea
      JOIN season_point_events eb
        ON eb.stage_id = ea.stage_id AND eb.award_type = ea.award_type AND eb.rider_id = ?
      JOIN stages s ON s.id = ea.stage_id
      JOIN races r ON r.id = s.race_id
      WHERE ea.rider_id = ? AND ${DUEL_WHERE.replace(/\be\.award_type\b/g, 'ea.award_type')}
      ORDER BY s.date DESC, r.name ASC
    `).all(bId, aId) as any[];

    return rows.map((row) => ({
      date: row.stageDate,
      season: seasonOf(row.stageDate),
      raceName: row.raceName,
      categoryId: row.categoryId,
      categoryName: cats.get(row.categoryId) ?? null,
      type: awardToType(row.award),
      rankA: row.rankA,
      rankB: row.rankB,
      teamAId: row.teamA,
      teamAName: row.teamA != null ? (teamName.get(row.teamA) ?? null) : null,
      teamBId: row.teamB,
      teamBName: row.teamB != null ? (teamName.get(row.teamB) ?? null) : null,
      winner: row.rankA < row.rankB ? 'A' : row.rankB < row.rankA ? 'B' : null,
    }));
  }

  public getDetail(aIdRaw: number, bIdRaw: number, season?: number): RivalryDetailPayload | null {
    const target = season ?? this.latestSeason();
    if (target == null || !tableExists(this.db, 'rivalries')) return null;
    // Materialisierte Zeile finden (Reihenfolge egal).
    const meta = this.db.prepare(`
      SELECT season, rank, rider_a_id AS aId, rider_b_id AS bId, idx, encounters, discipline,
             top_category_id AS topCat, season_win_a AS sWinA, season_win_b AS sWinB
      FROM rivalries
      WHERE season = ? AND ((rider_a_id = ? AND rider_b_id = ?) OR (rider_a_id = ? AND rider_b_id = ?))
    `).get(target, aIdRaw, bIdRaw, bIdRaw, aIdRaw) as any;
    if (!meta) return null;

    const a = this.riderDisplay(meta.aId);
    const b = this.riderDisplay(meta.bId);
    if (!a || !b) return null;

    const cats = this.categoryNameMap();
    const duels = this.pairDuelsAllTime(meta.aId, meta.bId);
    let gesamtA = 0, gesamtB = 0;
    for (const d of duels) { if (d.winner === 'A') gesamtA++; else if (d.winner === 'B') gesamtB++; }

    const buildRider = (r: NonNullable<ReturnType<RivalryService['riderDisplay']>>) => ({
      riderId: r.id, firstName: r.firstName, lastName: r.lastName,
      countryCode: r.countryCode, teamId: r.teamId, teamName: r.teamName,
      roleId: r.roleId, roleName: r.roleName, overallRating: r.overall,
      age: meta.season - r.birthYear,
      careerWins: this.careerWins(r.id),
      allTimeUciPoints: this.allTimeUci(r.id),
      seasonProgram: this.seasonProgram(r.id, meta.season),
    });

    return {
      season: meta.season,
      rank: meta.rank,
      index: meta.idx,
      discipline: meta.discipline,
      topCategoryId: meta.topCat,
      topCategoryName: meta.topCat != null ? (cats.get(meta.topCat) ?? null) : null,
      seasonWinA: meta.sWinA, seasonWinB: meta.sWinB,
      seasonEncounters: meta.sWinA + meta.sWinB,
      gesamtWinA: gesamtA, gesamtWinB: gesamtB,
      encounters: meta.encounters,
      riderA: buildRider(a),
      riderB: buildRider(b),
      duels,
    };
  }

  // ---- riderStats-Header: Top-Rivale eines Fahrers ----------------------

  public getTopRivalForRider(riderId: number): RiderTopRival | null {
    const season = this.latestSeason();
    if (season == null || !tableExists(this.db, 'rivalries')) return null;
    const row = this.db.prepare(`
      SELECT season, rider_a_id AS aId, rider_b_id AS bId, idx,
             win_a AS winA, win_b AS winB
      FROM rivalries
      WHERE season = ? AND (rider_a_id = ? OR rider_b_id = ?)
      ORDER BY idx DESC LIMIT 1
    `).get(season, riderId, riderId) as any;
    if (!row) return null;
    const isA = row.aId === riderId;
    const rivalId = isA ? row.bId : row.aId;
    const rival = this.riderDisplay(rivalId);
    if (!rival) return null;
    return {
      season: row.season,
      riderAId: row.aId,
      riderBId: row.bId,
      rivalRiderId: rivalId,
      rivalFirstName: rival.firstName,
      rivalLastName: rival.lastName,
      rivalCountryCode: rival.countryCode,
      index: row.idx,
      selfWins: isA ? row.winA : row.winB,
      rivalWins: isA ? row.winB : row.winA,
    };
  }
}
