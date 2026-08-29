import Database from 'better-sqlite3';
import type { Verletzungsart } from '../../../shared/injuries';
import { tableExists } from './mappers';

interface InjuryTypeRow {
  key: string;
  label: string;
  gewicht_alltag: number;
  gewicht_sturz: number;
  min_tage: number;
  max_tage: number;
}

/**
 * Die Verletzungsarten aus der Datenbank.
 *
 * Leer, wenn ein Spielstand die Tabelle noch nicht hat — `ziehVerletzung`
 * faellt dann auf das Modell ohne Arten zurueck, es gibt also weiterhin
 * Verletzungen, nur ohne Bezeichnung.
 */
export function ladeVerletzungsarten(db: Database.Database): Verletzungsart[] {
  if (!tableExists(db, 'injury_types')) {
    return [];
  }
  const rows = db.prepare(`
    SELECT key, label, gewicht_alltag, gewicht_sturz, min_tage, max_tage
    FROM injury_types
  `).all() as InjuryTypeRow[];
  return rows.map((row) => ({
    key: row.key,
    label: row.label,
    gewichtAlltag: row.gewicht_alltag,
    gewichtSturz: row.gewicht_sturz,
    minTage: row.min_tage,
    maxTage: row.max_tage,
  }));
}
