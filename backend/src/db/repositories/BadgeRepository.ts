import type Database from 'better-sqlite3';

export interface BadgeHolderRow {
  riderId: number;
  firstName: string;
  lastName: string;
  nationality: string | null;
  teamId: number | null;
  teamName: string | null;
  teamAbbr: string | null;
  teamDivisionId: number | null;
  isRetired: boolean;
  tier: string | null;
}

/**
 * Liest die materialisierten Hall-of-Fame-Badge-Halter aus `rider_badges`.
 */
export class BadgeRepository {
  constructor(private readonly db: Database.Database) {}

  /**
   * Alle Halter eines Badges — inkl. WorldTour/ProTour/sonstige und
   * zurueckgetretene Fahrer. Sortiert nach Tier-Rang
   * (gold > silber > bronze > cyan > lila > earned), dann Nachname.
   */
  public getBadgeHolders(badgeKey: string): BadgeHolderRow[] {
    if (!this.tableExists()) return [];

    const rows = this.db.prepare(`
      SELECT
        r.id AS riderId,
        r.first_name AS firstName,
        r.last_name AS lastName,
        c.code_3 AS nationality,
        t.id AS teamId,
        t.name AS teamName,
        t.abbreviation AS teamAbbr,
        t.division_id AS teamDivisionId,
        r.is_retired AS isRetired,
        rb.tier AS tier
      FROM rider_badges rb
      JOIN riders r ON r.id = rb.rider_id
      JOIN sta_country c ON c.id = r.country_id
      LEFT JOIN teams t ON t.id = r.active_team_id
      WHERE rb.badge_key = ?
      ORDER BY
        CASE rb.tier
          WHEN 'gold' THEN 0
          WHEN 'silver' THEN 1
          WHEN 'bronze' THEN 2
          WHEN 'cyan' THEN 3
          WHEN 'purple' THEN 4
          WHEN 'earned' THEN 5
          ELSE 6
        END ASC,
        r.last_name ASC
    `).all(badgeKey) as Array<{
      riderId: number;
      firstName: string;
      lastName: string;
      nationality: string | null;
      teamId: number | null;
      teamName: string | null;
      teamAbbr: string | null;
      teamDivisionId: number | null;
      isRetired: number;
      tier: string | null;
    }>;

    return rows.map((r) => ({
      riderId: r.riderId,
      firstName: r.firstName,
      lastName: r.lastName,
      nationality: r.nationality ?? null,
      teamId: r.teamId ?? null,
      teamName: r.teamName ?? null,
      teamAbbr: r.teamAbbr ?? null,
      teamDivisionId: r.teamDivisionId ?? null,
      isRetired: r.isRetired === 1,
      tier: r.tier ?? null,
    }));
  }

  private tableExists(): boolean {
    return !!this.db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='rider_badges'")
      .get();
  }
}
