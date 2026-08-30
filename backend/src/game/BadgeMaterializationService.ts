import type Database from 'better-sqlite3';
import { computeRiderBadgeTiers } from '../../../shared/hallOfFameBadges';
import { RiderRepository } from '../db/repositories/RiderRepository';

/**
 * Materialisiert die Hall-of-Fame-Badges pro Fahrer in die Tabelle
 * `rider_badges`. Dadurch werden auch die ~90 "bespoke" Badges (ohne
 * Ranglisten-Metrik) global filterbar. Wird bei JEDEM Savegame-Load neu
 * aufgebaut — bewusst NICHT im heissen Tageswechsel-Pfad.
 *
 * Die Tier-Ableitung stammt aus `shared/hallOfFameBadges.ts` (Single Source of
 * Truth), identisch zur Frontend-Anzeige.
 */
export class BadgeMaterializationService {
  constructor(private readonly db: Database.Database) {}

  /**
   * Baut `rider_badges` komplett neu auf: fuer JEDEN Fahrer (inkl.
   * zurueckgetreten/teamlos) werden die gehaltenen Badges (tier != null oder
   * earned) upgesertet. Bestehende Zeilen werden zuvor geloescht. Alles in
   * einer einzigen Transaktion.
   */
  public rebuildAllRiderBadges(): void {
    this.rebuild(null);
  }

  private hatTabelle(): boolean {
    return this.hatTabelleNamens('rider_badges');
  }

  private hatTabelleNamens(name: string): boolean {
    return this.db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?")
      .get(name) != null;
  }

  /** `riderIds === null` heisst: alle Fahrer. */
  private rebuild(riderIds: number[] | null): void {
    if (!this.hatTabelle()) return;

    const repo = new RiderRepository(this.db);
    const zuBauen = riderIds ?? repo.getAllRiderIds();
    if (zuBauen.length === 0) return;

    const insert = this.db.prepare(
      'INSERT INTO rider_badges (rider_id, badge_key, tier) VALUES (?, ?, ?)',
    );
    const loescheEinen = this.db.prepare('DELETE FROM rider_badges WHERE rider_id = ?');

    const rebuild = this.db.transaction(() => {
      if (riderIds === null) {
        this.db.prepare('DELETE FROM rider_badges').run();
      }
      for (const riderId of zuBauen) {
        if (riderIds !== null) loescheEinen.run(riderId);
        const inputs = repo.getBadgeInputsForRider(riderId);
        const badges = computeRiderBadgeTiers(inputs);
        for (const badge of badges) {
          const held = badge.tier != null || badge.earned;
          if (!held) continue;
          // Schwellen-/Rang-Badges: konkretes Tier. Single-/Binaer-Badges: 'earned'.
          insert.run(riderId, badge.key, badge.tier ?? 'earned');
        }
      }
    });

    rebuild();
  }
}
