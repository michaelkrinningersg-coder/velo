import Database from 'better-sqlite3';
import type { RiderSpecialization } from '../../../shared/types';

export interface RiderTagFlags {
  isStageRacer: number;
  isOneDayRacer: number;
  hasGrandTourTag: number;
  hasStageRaceTag: number;
  hasOneDayClassicTag: number;
}

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName) as { name: string } | undefined;
  return row != null;
}

function columnExists(db: Database.Database, tableName: string, columnName: string): boolean {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
  return columns.some(column => column.name === columnName);
}

interface RiderTagRow {
  id: number;
  skill_recuperation: number;
  specialization_1: RiderSpecialization | null;
  specialization_2: RiderSpecialization | null;
  specialization_3: RiderSpecialization | null;
}

function getStagePoints(specialization: RiderSpecialization | null): number {
  switch (specialization) {
    case 'Berg':
    case 'Timetrial':
    case 'Sprint':
    case 'Attacker':
      return 1;
    default:
      return 0;
  }
}

function getOneDayPoints(specialization: RiderSpecialization | null): number {
  switch (specialization) {
    case 'Hill':
    case 'Cobble':
    case 'Sprint':
    case 'Attacker':
      return 1;
    default:
      return 0;
  }
}

export function deriveRiderTags(
  specializations: Array<RiderSpecialization | null>,
  recuperation: number,
): RiderTagFlags {
  const stagePoints = specializations.reduce((sum, specialization) => sum + getStagePoints(specialization), 0);
  const oneDayPoints = specializations.reduce((sum, specialization) => sum + getOneDayPoints(specialization), 0);
  const hasStageRaceTag = stagePoints >= 2 ? 1 : 0;
  const hasOneDayClassicTag = oneDayPoints >= 2 ? 1 : 0;
  const hasGrandTourTag = specializations.includes('Berg') && specializations.includes('Timetrial') && recuperation > 72 ? 1 : 0;

  return {
    isStageRacer: hasStageRaceTag,
    isOneDayRacer: hasOneDayClassicTag,
    hasGrandTourTag,
    hasStageRaceTag,
    hasOneDayClassicTag,
  };
}

export class RiderTagService {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  public recalculateAllTags(): void {
    if (!tableExists(this.db, 'riders') || !tableExists(this.db, 'type_rider')) return;
    const requiredColumns = [
      'specialization_1_id',
      'specialization_2_id',
      'specialization_3_id',
      'skill_recuperation',
      'is_stage_racer',
      'is_one_day_racer',
      'has_grand_tour_tag',
      'has_stage_race_tag',
      'has_one_day_classic_tag',
    ];
    if (requiredColumns.some(column => !columnExists(this.db, 'riders', column))) return;

    this.db.transaction(() => {
      const rows = this.db.prepare(`
        SELECT r.id,
               r.skill_recuperation,
               specialization_1.type_key AS specialization_1,
               specialization_2.type_key AS specialization_2,
               specialization_3.type_key AS specialization_3
        FROM riders r
        LEFT JOIN type_rider specialization_1 ON specialization_1.id = r.specialization_1_id
        LEFT JOIN type_rider specialization_2 ON specialization_2.id = r.specialization_2_id
        LEFT JOIN type_rider specialization_3 ON specialization_3.id = r.specialization_3_id
      `).all() as RiderTagRow[];

      const update = this.db.prepare(`
        UPDATE riders
        SET is_stage_racer = ?,
            is_one_day_racer = ?,
            has_grand_tour_tag = ?,
            has_stage_race_tag = ?,
            has_one_day_classic_tag = ?
        WHERE id = ?
      `);

      for (const row of rows) {
        const tags = deriveRiderTags(
          [row.specialization_1, row.specialization_2, row.specialization_3],
          row.skill_recuperation,
        );
        update.run(
          tags.isStageRacer,
          tags.isOneDayRacer,
          tags.hasGrandTourTag,
          tags.hasStageRaceTag,
          tags.hasOneDayClassicTag,
          row.id,
        );
      }
    })();
  }
}