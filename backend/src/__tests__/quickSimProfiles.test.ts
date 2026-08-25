import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { describe, expect, it } from 'vitest';
import {
  buildQuickSimProfileMap,
  DEFAULT_QUICK_SIM_PROFILES,
  mapQuickSimProfileRow,
  type QuickSimProfileRow,
} from '../../../shared/quickSimProfiles';
import { loadQuickSimProfiles } from '../simulation/quickSimProfileLoader';

const ALL_PROFILES = [
  'Flat', 'Rolling', 'Hilly', 'Hilly_Difficult', 'Cobble', 'Cobble_Hill',
  'Medium_Mountain', 'Mountain', 'High_Mountain', 'ITT', 'TTT',
] as const;

function row(profile: string, overrides: Partial<QuickSimProfileRow> = {}): QuickSimProfileRow {
  return {
    profile,
    base_speed_kmh: 40,
    bunch_intercept: 1,
    bunched_share_mean: 0.7,
    split_share_intercept: 0.05,
    tail_gap_per_km: 8.5,
    tail_group_size: 3,
    noise_sigma: 0.2,
    incident_loss_multiplier: 2,
    severe_dnf_chance: 0.3,
    breakaway_shrink_exponent: 1.5,
    time_trial_slope: 0,
    time_trial_noise: 0,
    mass_crash_involvement: 0.35,
    ...overrides,
  };
}

function createTable(db: Database.Database): void {
  db.prepare(`
    CREATE TABLE quick_sim_profiles (
      profile                     TEXT PRIMARY KEY,
      base_speed_kmh              REAL NOT NULL,
      bunch_intercept             REAL NOT NULL,
      bunched_share_mean          REAL NOT NULL,
      split_share_intercept       REAL NOT NULL,
      tail_gap_per_km             REAL NOT NULL,
      tail_group_size             REAL NOT NULL,
      noise_sigma                 REAL NOT NULL,
      incident_loss_multiplier    REAL NOT NULL,
      severe_dnf_chance           REAL NOT NULL,
      breakaway_shrink_exponent   REAL NOT NULL,
      time_trial_slope            REAL NOT NULL,
      time_trial_noise            REAL NOT NULL,
      mass_crash_involvement      REAL NOT NULL
    )
  `).run();
}

function insert(db: Database.Database, entry: QuickSimProfileRow): void {
  db.prepare(`
    INSERT INTO quick_sim_profiles VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    entry.profile, entry.base_speed_kmh, entry.bunch_intercept,
    entry.bunched_share_mean, entry.split_share_intercept, entry.tail_gap_per_km,
    entry.tail_group_size, entry.noise_sigma, entry.incident_loss_multiplier,
    entry.severe_dnf_chance, entry.breakaway_shrink_exponent,
    entry.time_trial_slope, entry.time_trial_noise, entry.mass_crash_involvement,
  );
}

describe('Vorgabewerte', () => {
  it('deckt jedes Etappenprofil ab', () => {
    for (const profile of ALL_PROFILES) {
      expect(DEFAULT_QUICK_SIM_PROFILES[profile]).toBeDefined();
    }
    expect(Object.keys(DEFAULT_QUICK_SIM_PROFILES).sort()).toEqual([...ALL_PROFILES].sort());
  });

  it('bildet die erwartete Profilordnung ab: flacher heisst schneller und geschlossener', () => {
    const flat = DEFAULT_QUICK_SIM_PROFILES.Flat;
    const high = DEFAULT_QUICK_SIM_PROFILES.High_Mountain;
    // Auf der Flachetappe faehrt das Feld schneller …
    expect(flat.baseSpeedKmh).toBeGreaterThan(high.baseSpeedKmh);
    // … und kommt viel eher geschlossen an.
    expect(flat.bunchIntercept).toBeGreaterThan(high.bunchIntercept);
    // … und das Ende des Feldes verliert weniger.
    expect(flat.tailGapPerKm).toBeLessThan(high.tailGapPerKm);
  });

  it('gibt Zeitfahren keine Regime-Ziehung', () => {
    // Zeitfahren kennen keine Gruppendynamik; der Wert bleibt neutral.
    expect(DEFAULT_QUICK_SIM_PROFILES.ITT.bunchIntercept).toBe(0);
    expect(DEFAULT_QUICK_SIM_PROFILES.TTT.bunchIntercept).toBe(0);
  });
});

describe('mapQuickSimProfileRow', () => {
  it('uebertraegt jede Spalte auf das passende Feld', () => {
    const mapped = mapQuickSimProfileRow(row('Flat', {
      base_speed_kmh: 43.5, bunch_intercept: 3.1, bunched_share_mean: 0.857,
      split_share_intercept: -0.086, tail_gap_per_km: 6.91, tail_group_size: 2.01,
      noise_sigma: 0.151, incident_loss_multiplier: 1.21, severe_dnf_chance: 0.251,
      breakaway_shrink_exponent: 1.51, time_trial_slope: 0.0041, time_trial_noise: 0.0191, mass_crash_involvement: 0.31,
    }));
    expect(mapped).toEqual({
      baseSpeedKmh: 43.5, bunchIntercept: 3.1, bunchedShareMean: 0.857,
      splitShareIntercept: -0.086, tailGapPerKm: 6.91, tailGroupSize: 2.01,
      noiseSigma: 0.151, incidentLossMultiplier: 1.21, severeDnfChance: 0.251,
      breakawayShrinkExponent: 1.51, timeTrialSlope: 0.0041, timeTrialNoise: 0.0191, massCrashInvolvement: 0.31,
    });
  });
});

describe('buildQuickSimProfileMap', () => {
  it('nimmt gelieferte Zeilen und faellt fuer den Rest auf die Vorgabe zurueck', () => {
    const result = buildQuickSimProfileMap([row('Flat', { base_speed_kmh: 99 })]);
    expect(result.Flat.baseSpeedKmh).toBe(99);
    expect(result.Mountain).toEqual(DEFAULT_QUICK_SIM_PROFILES.Mountain);
  });

  it('ignoriert unbekannte Profile, statt die Tabelle zu verunreinigen', () => {
    const result = buildQuickSimProfileMap([row('Gibt_Es_Nicht')]);
    expect(result).toEqual(DEFAULT_QUICK_SIM_PROFILES);
    expect('Gibt_Es_Nicht' in result).toBe(false);
  });

  it('liefert bei leerer Eingabe die vollstaendige Vorgabe', () => {
    expect(buildQuickSimProfileMap([])).toEqual(DEFAULT_QUICK_SIM_PROFILES);
  });
});

describe('loadQuickSimProfiles', () => {
  it('faellt ohne Tabelle auf die Vorgabe zurueck', () => {
    const db = new Database(':memory:');
    expect(loadQuickSimProfiles(db)).toEqual(DEFAULT_QUICK_SIM_PROFILES);
    db.close();
  });

  it('faellt bei leerer Tabelle auf die Vorgabe zurueck', () => {
    const db = new Database(':memory:');
    createTable(db);
    expect(loadQuickSimProfiles(db)).toEqual(DEFAULT_QUICK_SIM_PROFILES);
    db.close();
  });

  it('liest gespeicherte Werte und mischt fehlende Profile aus der Vorgabe', () => {
    const db = new Database(':memory:');
    createTable(db);
    insert(db, row('High_Mountain', { base_speed_kmh: 30.5, noise_sigma: 0.4 }));
    const loaded = loadQuickSimProfiles(db);
    expect(loaded.High_Mountain.baseSpeedKmh).toBe(30.5);
    expect(loaded.High_Mountain.noiseSigma).toBe(0.4);
    expect(loaded.Flat).toEqual(DEFAULT_QUICK_SIM_PROFILES.Flat);
    db.close();
  });
});

describe('CSV und Vorgabewerte', () => {
  // Die CSV ist die Bearbeitungsquelle, die Konstanten sind der Notnagel.
  // Zwei Quellen driften auseinander, sobald jemand nur eine anfasst — dieser
  // Test macht das sofort sichtbar statt erst in einer schiefen Kalibrierung.
  it('enthalten dieselben Werte', () => {
    const csvPath = path.join(__dirname, '..', '..', '..', 'data', 'csv', 'quick_sim_profiles.csv');
    const lines = fs.readFileSync(csvPath, 'utf8').trim().split(/\r?\n/);
    const header = lines[0]!.split(',');
    expect(header[0]).toBe('profile');

    const fromCsv = lines.slice(1).map((line) => {
      const cells = line.split(',');
      return mapQuickSimProfileRow(Object.fromEntries(
        header.map((column, index) => [
          column,
          column === 'profile' ? cells[index] : Number(cells[index]),
        ]),
      ) as unknown as QuickSimProfileRow);
    });

    const profilesInCsv = lines.slice(1).map((line) => line.split(',')[0]);
    expect(profilesInCsv.sort()).toEqual([...ALL_PROFILES].sort());

    profilesInCsv.forEach((profile) => {
      const index = lines.slice(1).findIndex((line) => line.split(',')[0] === profile);
      expect({ profile, ...fromCsv[index] })
        .toEqual({ profile, ...DEFAULT_QUICK_SIM_PROFILES[profile as keyof typeof DEFAULT_QUICK_SIM_PROFILES] });
    });
  });
});
