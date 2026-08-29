/**
 * Laedt die Parameter der Quick Simulation aus dem Spielstand.
 *
 * Die Werte liegen als Daten vor, damit sie nach jedem Kalibrierlauf ohne
 * Rebuild angepasst werden koennen. Fehlt die Tabelle oder eine Zeile, greift
 * je Profil die Vorgabe aus `shared/quickSimProfiles.ts` — die Simulation
 * laeuft dann weiter, nur eben unkalibriert.
 */

import type Database from 'better-sqlite3';
import {
  buildQuickSimProfileMap,
  DEFAULT_QUICK_SIM_PROFILES,
  type QuickSimProfileParameters,
  type QuickSimProfileRow,
} from '../../../shared/quickSimProfiles';
import type { StageProfile } from '../../../shared/types';

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(tableName);
  return row != null;
}

export function loadQuickSimProfiles(
  db: Database.Database,
): Record<StageProfile, QuickSimProfileParameters> {
  if (!tableExists(db, 'quick_sim_profiles')) {
    return { ...DEFAULT_QUICK_SIM_PROFILES };
  }

  const rows = db.prepare(`
    SELECT
      profile, base_speed_kmh, bunch_intercept, bunched_share_intercept, split_share_intercept,
      tail_gap_per_km, tail_group_size,
      noise_sigma, incident_loss_multiplier, breakaway_shrink_exponent,
      time_trial_slope, time_trial_noise, mass_crash_involvement, rank_noise
    FROM quick_sim_profiles
  `).all() as QuickSimProfileRow[];

  return buildQuickSimProfileMap(rows);
}
