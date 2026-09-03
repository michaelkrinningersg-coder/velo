import Database from 'better-sqlite3';
import type { RiderPotentials, RiderSkillKey, RiderSkills, RiderSpecialization } from '../../../shared/types';
import { RiderTagService } from './RiderTagService';
import { calcRiderOverall } from '../../../shared/riderOverall';
import {
  MENTOR_BONUS_MAX_AGE,
  advanceSkill,
  resolveEffectiveDevelopmentValue,
} from '../../../shared/riderProgression';
// `tableExists`/`columnExists` kommen aus db/mappers: dort werden positive
// Antworten je Verbindung gemerkt. Die frueheren lokalen Kopien fragten das
// Schema bei jedem Aufruf neu — in zwei gemessenen Spielmonaten waren das 7341
// sqlite_master-Abfragen und 2117 `PRAGMA table_info`.
import { columnExists, tableExists } from '../db/mappers';

const RIDER_STAT_MAX = 85;

const RIDER_SKILL_COLUMNS = [
  ['flat', 'flat'],
  ['mountain', 'mountain'],
  ['mediumMountain', 'medium_mountain'],
  ['hill', 'hill'],
  ['timeTrial', 'time_trial'],
  ['prologue', 'prologue'],
  ['cobble', 'cobble'],
  ['sprint', 'sprint'],
  ['acceleration', 'acceleration'],
  ['downhill', 'downhill'],
  ['attack', 'attack'],
  ['stamina', 'stamina'],
  ['resistance', 'resistance'],
  ['recuperation', 'recuperation'],
  ['bikeHandling', 'bike_handling'],
] as const satisfies ReadonlyArray<readonly [RiderSkillKey, string]>;

interface RiderDevelopmentRow {
  id: number;
  birth_year: number;
  skill_development: number;
  peak_age: number;
  decline_age: number;
  retirement_age: number;
  skill_flat: number;
  skill_mountain: number;
  skill_medium_mountain: number;
  skill_hill: number;
  skill_time_trial: number;
  skill_prologue: number;
  skill_cobble: number;
  skill_sprint: number;
  skill_acceleration: number;
  skill_downhill: number;
  skill_attack: number;
  skill_stamina: number;
  skill_resistance: number;
  skill_recuperation: number;
}

export type RiderDevelopmentFormPhase = 'build' | 'decline' | null;

export interface RiderDevelopmentDailyContext {
  riderId: number;
  healthStatus: 'healthy' | 'ill' | 'injured';
  unavailableDaysRemaining: number;
  formPhase: RiderDevelopmentFormPhase;
  isInRaceToday: boolean;
  isPeakStartDay: boolean;
  peakDate: string | null;
}

interface DailyDevelopmentRow extends RiderDevelopmentRow {
  is_retired: number;
  rider_type: RiderSpecialization;
  active_team_id: number | null;
  specialization_1_id: number | null;
  specialization_2_id: number | null;
  specialization_3_id: number | null;
  overall_rating: number;
  skill_bike_handling: number;
  pot_flat: number;
  pot_mountain: number;
  pot_medium_mountain: number;
  pot_hill: number;
  pot_time_trial: number;
  pot_prologue: number;
  pot_cobble: number;
  pot_sprint: number;
  pot_acceleration: number;
  pot_downhill: number;
  pot_attack: number;
  pot_stamina: number;
  pot_resistance: number;
  pot_recuperation: number;
  pot_bike_handling: number;
  team_tier?: number | null;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, min = 0, max = RIDER_STAT_MAX): number {
  return round2(Math.max(min, Math.min(max, value)));
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function calcBikeHandling(skills: Pick<RiderSkills, 'downhill' | 'sprint' | 'attack' | 'resistance'>): number {
  return clamp(skills.downhill * 0.7 + skills.sprint * 0.15 + skills.attack * 0.05 + skills.resistance * 0.1);
}

/**
 * Die Gesamtwertung liegt in shared/riderOverall.ts. Sie wird auch vom
 * Werkzeug gebraucht, das die Newgen-Presets einstuft; hier steht nur noch der
 * Wiederausgang, damit die Aufrufstellen im Backend unveraendert bleiben.
 */
export { calcRiderOverall as calcOverall };

function scoreProfile(skills: RiderSkills, weights: Array<[RiderSkillKey, number]>): number {
  return weights.reduce((sum, [key, weight]) => sum + skills[key] * weight, 0);
}

function buildHybridSkills(skills: RiderSkills, potentials: RiderPotentials): RiderSkills {
  const entries = RIDER_SKILL_COLUMNS.map(([key]) => {
    const baseValue = skills[key];
    const potentialValue = potentials[key];
    return [key, clamp(baseValue * 0.65 + potentialValue * 0.35)];
  });
  return Object.fromEntries(entries) as RiderSkills;
}

function getSpecializationScores(skills: RiderSkills): Array<{ specialization: RiderSpecialization; score: number }> {
  const scores: Array<{ specialization: RiderSpecialization; score: number }> = [
    { specialization: 'Berg', score: scoreProfile(skills, [['mountain', 0.4], ['mediumMountain', 0.2], ['stamina', 0.15], ['attack', 0.15], ['downhill', 0.1]]) },
    { specialization: 'Hill', score: scoreProfile(skills, [['hill', 0.35], ['acceleration', 0.2], ['mediumMountain', 0.15], ['attack', 0.15], ['bikeHandling', 0.15]]) },
    { specialization: 'Sprint', score: scoreProfile(skills, [['sprint', 0.4], ['acceleration', 0.25], ['flat', 0.15], ['bikeHandling', 0.1], ['resistance', 0.1]]) },
    { specialization: 'Timetrial', score: scoreProfile(skills, [['timeTrial', 0.5], ['prologue', 0.2], ['flat', 0.1], ['resistance', 0.1], ['bikeHandling', 0.1]]) },
    { specialization: 'Cobble', score: scoreProfile(skills, [['cobble', 0.4], ['flat', 0.2], ['resistance', 0.15], ['bikeHandling', 0.15], ['hill', 0.1]]) },
    { specialization: 'Attacker', score: scoreProfile(skills, [['attack', 0.26], ['acceleration', 0.18], ['hill', 0.18], ['mediumMountain', 0.18], ['resistance', 0.18]]) * 0.978 },
    { specialization: 'Flat', score: scoreProfile(skills, [['flat', 0.50], ['stamina', 0.20], ['resistance', 0.15], ['bikeHandling', 0.15]]) * 0.991 },
  ];
  return scores.sort((left, right) => right.score - left.score);
}

function buildAgeProfile(): { peakAge: number; declineAge: number; retirementAge: number } {
  const peakAge = rand(24, 28);
  // Untergrenze 28: davor stand 26, womit ein Fahrer mit Zielalter 24 schon mit
  // 26 abzubauen begann — zwei Jahre Plateau bei einer Laufbahn, die bis 38
  // reicht. Die Obergrenze bleibt bei 32.
  const declineAge = rand(Math.max(peakAge + 1, 28), 32);
  const retirementAge = rand(Math.max(declineAge + 1, 32), 38);
  return { peakAge, declineAge, retirementAge };
}

function buildPotentials(skills: RiderSkills, age: number, skillDevelopment: number, peakAge: number): RiderPotentials {
  if (age >= peakAge) {
    return Object.fromEntries(RIDER_SKILL_COLUMNS.map(([key]) => [key, skills[key]])) as RiderPotentials;
  }

  const ageFactor = Math.max(0.15, (peakAge - age) / 8);
  const developmentFactor = skillDevelopment / 20;
  const entries = RIDER_SKILL_COLUMNS.map(([key]) => {
    const current = skills[key];
    const headroom = Math.max(0, RIDER_STAT_MAX - current);
    if (headroom <= 0.01) return [key, current];

    const growthBase = headroom * (0.14 + ageFactor * 0.24 + developmentFactor * 0.22);
    const growth = Math.max(Math.min(headroom, growthBase * randomBetween(0.75, 1.25)), Math.min(headroom, 0.25));
    return [key, clamp(current + growth)];
  });
  return Object.fromEntries(entries) as RiderPotentials;
}

function buildCurrentSkills(row: RiderDevelopmentRow): RiderSkills {
  const baseSkills = {
    flat: row.skill_flat,
    mountain: row.skill_mountain,
    mediumMountain: row.skill_medium_mountain,
    hill: row.skill_hill,
    timeTrial: row.skill_time_trial,
    prologue: row.skill_prologue,
    cobble: row.skill_cobble,
    sprint: row.skill_sprint,
    acceleration: row.skill_acceleration,
    downhill: row.skill_downhill,
    attack: row.skill_attack,
    stamina: row.skill_stamina,
    resistance: row.skill_resistance,
    recuperation: row.skill_recuperation,
  } satisfies Omit<RiderSkills, 'bikeHandling'>;

  return {
    ...baseSkills,
    bikeHandling: calcBikeHandling(baseSkills),
  };
}

function buildCurrentSkillsFromDailyRow(row: DailyDevelopmentRow): RiderSkills {
  return {
    flat: row.skill_flat,
    mountain: row.skill_mountain,
    mediumMountain: row.skill_medium_mountain,
    hill: row.skill_hill,
    timeTrial: row.skill_time_trial,
    prologue: row.skill_prologue,
    cobble: row.skill_cobble,
    sprint: row.skill_sprint,
    acceleration: row.skill_acceleration,
    downhill: row.skill_downhill,
    attack: row.skill_attack,
    stamina: row.skill_stamina,
    resistance: row.skill_resistance,
    recuperation: row.skill_recuperation,
    bikeHandling: row.skill_bike_handling,
  };
}

/** Potenziale aus einer Zeile, die die pot_-Spalten mitgelesen hat. */
function buildPotentialsFromRow(row: Record<string, number>): RiderPotentials {
  const raus = {} as RiderPotentials;
  for (const [key, column] of RIDER_SKILL_COLUMNS) {
    raus[key] = Number(row[`pot_${column}`] ?? 0);
  }
  return raus;
}

function buildPotentialsFromDailyRow(row: DailyDevelopmentRow): RiderPotentials {
  return {
    flat: row.pot_flat,
    mountain: row.pot_mountain,
    mediumMountain: row.pot_medium_mountain,
    hill: row.pot_hill,
    timeTrial: row.pot_time_trial,
    prologue: row.pot_prologue,
    cobble: row.pot_cobble,
    sprint: row.pot_sprint,
    acceleration: row.pot_acceleration,
    downhill: row.pot_downhill,
    attack: row.pot_attack,
    stamina: row.pot_stamina,
    resistance: row.pot_resistance,
    recuperation: row.pot_recuperation,
    bikeHandling: row.pot_bike_handling,
  };
}

function buildUpdatedSpecializationIds(skills: RiderSkills, typeIdByKey: Map<RiderSpecialization, number>): { riderTypeId: number; specialization1Id: number; specialization2Id: number | null; specialization3Id: number | null } | null {
  const specializations = getSpecializationScores(skills).slice(0, 3).map(entry => entry.specialization);
  const riderTypeId = typeIdByKey.get(specializations[0]);
  const specialization1Id = specializations[0] == null ? null : typeIdByKey.get(specializations[0]) ?? null;
  const specialization2Id = specializations[1] == null ? null : typeIdByKey.get(specializations[1]) ?? null;
  const specialization3Id = specializations[2] == null ? null : typeIdByKey.get(specializations[2]) ?? null;
  if (riderTypeId == null || specialization1Id == null) return null;
  return { riderTypeId, specialization1Id, specialization2Id, specialization3Id };
}

/** Anzahl Tage des Monats vor dem Monat des ISO-Datums. */
function tageImVormonat(isoDate: string): number {
  const jahr = Number(isoDate.slice(0, 4));
  const monat = Number(isoDate.slice(5, 7)); // 1..12
  // Tag 0 des laufenden Monats ist der letzte Tag des Vormonats.
  return new Date(Date.UTC(jahr, monat - 1, 0)).getUTCDate();
}

export class RiderDevelopmentService {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  /**
   * Ein Entwicklungsschritt fuer alle Fahrer.
   *
   * `contexts` wird nicht mehr ausgewertet: Krankheit, Verletzung, Sperre,
   * Rennteilnahme, Formphase und Winterpause hielten die Entwicklung frueher an
   * oder beschleunigten sie. Im neuen Modell laeuft sie durchgehend und haengt
   * allein am Alter, am Potenzial und am Entwicklungswert. Der Parameter bleibt
   * stehen, damit die Aufrufstelle unveraendert bleibt.
   */
  public advanceDailyDevelopment(currentDate: string, season: number, _contexts: RiderDevelopmentDailyContext[], dayMultiplier = 1): void {
    if (!tableExists(this.db, 'riders') || !tableExists(this.db, 'type_rider')) return;

    const boundedDayMultiplier = Math.max(1, Math.min(31, Math.floor(dayMultiplier)));

    // Wochenschritt: die Fahrer der ersten Liga werden nicht mehr taeglich,
    // sondern am 1., 8., 15. und 22. gerechnet, jeweils fuer die Tage seit dem
    // vorigen Stichtag. Das Modell rechnet einen Mehrtagesschritt geschlossen
    // (siehe advanceSkill); gegen sieben Tagesschritte weicht er um hoechstens
    // 0,003 Punkte je Woche ab — gemessen ueber Alter 19 bis 34 und alle
    // Entwicklungswerte (Test entwicklungWochenschritt). Ueber eine Saison
    // sind das im schlechtesten Fall rund 0,15 Punkte, unter der
    // Anzeigegenauigkeit. Gespart werden an sechs von sieben
    // Tagen das Laden von 620 Fahrern mit 45 Spalten und 620 Schreibvorgaenge.
    // Ein expliziter Mehrtages-Aufruf (dayMultiplier > 1) rechnet wie bisher
    // bei jedem Aufruf.
    const tag = Number(currentDate.slice(8, 10));
    const stichtag = boundedDayMultiplier > 1 || tag === 1 || tag === 8 || tag === 15 || tag === 22;
    if (!stichtag) return;
    const tageSeitStichtag = boundedDayMultiplier > 1
      ? boundedDayMultiplier
      : tag === 1
        ? tageImVormonat(currentDate) - 21 // vom 22. des Vormonats bis zum 1.
        : 7;

    const rows = this.db.prepare(`
      SELECT riders.id, riders.birth_year, riders.skill_development, riders.peak_age, riders.decline_age, riders.retirement_age,
             riders.is_retired, type_rider.type_key AS rider_type, riders.active_team_id, riders.specialization_1_id, riders.specialization_2_id, riders.specialization_3_id, riders.overall_rating,
             riders.skill_flat, riders.skill_mountain, riders.skill_medium_mountain, riders.skill_hill, riders.skill_time_trial,
             riders.skill_prologue, riders.skill_cobble, riders.skill_sprint, riders.skill_acceleration, riders.skill_downhill,
             riders.skill_attack, riders.skill_stamina, riders.skill_resistance, riders.skill_recuperation, riders.skill_bike_handling,
             riders.pot_flat, riders.pot_mountain, riders.pot_medium_mountain, riders.pot_hill, riders.pot_time_trial,
             riders.pot_prologue, riders.pot_cobble, riders.pot_sprint, riders.pot_acceleration, riders.pot_downhill,
             riders.pot_attack, riders.pot_stamina, riders.pot_resistance, riders.pot_recuperation, riders.pot_bike_handling,
             dt.tier AS team_tier
      FROM riders
      JOIN type_rider ON type_rider.id = riders.rider_type_id
      LEFT JOIN teams t ON t.id = riders.active_team_id
      LEFT JOIN division_teams dt ON dt.id = t.division_id
      -- Dieselbe Bedingung, die die Schleife unten als erstes prueft
      -- (if !isTier1 && !isFirstOfMonth: continue). Vorher wurden alle 3210
      -- Fahrer mit 45 Spalten geladen und die meisten sofort verworfen — 14,2 ms
      -- an dreissig von einunddreissig Tagen umsonst.
      --
      -- Die Mentorenliste unten bleibt vollstaendig: sie wird je Team
      -- ausgewertet, und Teamkollegen teilen die Division, also den Tier.
      WHERE ? = 1 OR (riders.active_team_id IS NOT NULL AND dt.tier = 1)
    `).all(currentDate.endsWith('-01') ? 1 : 0) as DailyDevelopmentRow[];

    // Renntage der Vorsaison je Fahrer — Grundlage des Rennbonus. Es zaehlen
    // alle Renntage gleich, ohne Gewichtung nach Rennkategorie.
    const raceDaysByRiderId = new Map<number, number>();
    if (tableExists(this.db, 'rider_daily_state')) {
      const raceDayRows = this.db.prepare(
        'SELECT rider_id, season_race_days_total AS tage FROM rider_daily_state WHERE season = ?',
      ).all(season - 1) as Array<{ rider_id: number; tage: number | null }>;
      for (const raceDayRow of raceDayRows) {
        raceDaysByRiderId.set(raceDayRow.rider_id, Number(raceDayRow.tage ?? 0));
      }
    }

    const mentorsByTeam = new Map<number, Array<{ spec1: number }>>();
    for (const row of rows) {
      const age = season - row.birth_year;
      if (age >= 31 && row.overall_rating >= 73 && row.active_team_id != null && row.specialization_1_id != null) {
        if (!mentorsByTeam.has(row.active_team_id)) mentorsByTeam.set(row.active_team_id, []);
        mentorsByTeam.get(row.active_team_id)!.push({ spec1: row.specialization_1_id });
      }
    }

    const update = this.db.prepare(`
      UPDATE riders
      SET overall_rating = ?,
          skill_flat = ?,
          skill_mountain = ?,
          skill_medium_mountain = ?,
          skill_hill = ?,
          skill_time_trial = ?,
          skill_prologue = ?,
          skill_cobble = ?,
          skill_sprint = ?,
          skill_acceleration = ?,
          skill_downhill = ?,
          skill_attack = ?,
          skill_stamina = ?,
          skill_resistance = ?,
          skill_recuperation = ?,
          skill_bike_handling = ?
      WHERE id = ?
    `);

    const isFirstOfMonth = currentDate.endsWith('-01');
    for (const row of rows) {
      const isTier1 = row.active_team_id != null && row.team_tier === 1;

      if (!isTier1 && !isFirstOfMonth) {
        continue;
      }

      // Fahrer der ersten Liga werden taeglich gerechnet, alle anderen einmal
      // im Monat mit dreissig Tagen auf einmal. Beim neuen Modell ist das keine
      // Naeherung mehr: `advanceSkill` rechnet den Aufbau geschlossen und teilt
      // an jeder Phasengrenze, ein Monatsschritt kommt deshalb auf denselben
      // Wert wie dreissig Tagesschritte.
      const days = isTier1 ? tageSeitStichtag : 30;

      if (row.is_retired === 1) {
        continue;
      }

      const age = season - row.birth_year;
      const currentSkills = buildCurrentSkillsFromDailyRow(row);
      const potentialSkills = buildPotentialsFromDailyRow(row);

      // Der wirksame Entwicklungswert: Grundwert plus die beiden Zuschlaege,
      // die der Spieler beeinflussen kann. Beide wirken nur, solange der Fahrer
      // sein Potenzial noch nicht erreicht hat.
      const hasMentor = age <= MENTOR_BONUS_MAX_AGE
        && row.active_team_id != null
        && (() => {
          const teamMentors = mentorsByTeam.get(row.active_team_id as number) ?? [];
          const top3Specs = [row.specialization_1_id, row.specialization_2_id, row.specialization_3_id].filter(Boolean);
          return teamMentors.some((mentor) => top3Specs.includes(mentor.spec1));
        })();
      const developmentValue = resolveEffectiveDevelopmentValue(
        row.skill_development,
        raceDaysByRiderId.get(row.id) ?? 0,
        hasMentor,
      );

      const updatedSkills = { ...currentSkills };
      let veraendert = false;
      for (const [skillKey] of RIDER_SKILL_COLUMNS) {
        if (skillKey === 'bikeHandling') continue;
        const potential = potentialSkills[skillKey];
        if (!Number.isFinite(potential) || potential <= 0) continue;
        const naechster = advanceSkill({
          skillKey,
          skill: currentSkills[skillKey],
          potential,
          age,
          days,
          peakAge: row.peak_age,
          declineAge: row.decline_age,
          retirementAge: row.retirement_age,
          developmentValue,
        });
        if (Math.abs(naechster - currentSkills[skillKey]) > 1e-9) {
          updatedSkills[skillKey] = clamp(naechster);
          veraendert = true;
        }
      }

      if (!veraendert) {
        continue;
      }

      updatedSkills.bikeHandling = calcBikeHandling(updatedSkills);

      update.run(
        calcRiderOverall(updatedSkills),
        updatedSkills.flat,
        updatedSkills.mountain,
        updatedSkills.mediumMountain,
        updatedSkills.hill,
        updatedSkills.timeTrial,
        updatedSkills.prologue,
        updatedSkills.cobble,
        updatedSkills.sprint,
        updatedSkills.acceleration,
        updatedSkills.downhill,
        updatedSkills.attack,
        updatedSkills.stamina,
        updatedSkills.resistance,
        updatedSkills.recuperation,
        updatedSkills.bikeHandling,
        row.id,
      );
    }
  }

  public recalculateSpecializations(_currentSeason: number): void {
    if (!tableExists(this.db, 'riders') || !tableExists(this.db, 'type_rider')) return;

    const requiredColumns = [
      'rider_type_id',
      'specialization_1_id',
      'specialization_2_id',
      'specialization_3_id',
    ];
    if (requiredColumns.some(column => !columnExists(this.db, 'riders', column))) return;

    const typeIdByKey = new Map<RiderSpecialization, number>();
    const typeRows = this.db.prepare('SELECT id, type_key FROM type_rider').all() as Array<{ id: number; type_key: RiderSpecialization }>;
    for (const row of typeRows) typeIdByKey.set(row.type_key, row.id);

    const rows = this.db.prepare(`
      SELECT id, birth_year, skill_development, peak_age, decline_age, retirement_age,
             skill_flat, skill_mountain, skill_medium_mountain, skill_hill, skill_time_trial,
             skill_prologue, skill_cobble, skill_sprint, skill_acceleration, skill_downhill,
             skill_attack, skill_stamina, skill_resistance, skill_recuperation
      FROM riders
      WHERE is_retired = 0
    `).all() as RiderDevelopmentRow[];

    const update = this.db.prepare(`
      UPDATE riders
      SET overall_rating = ?,
          skill_bike_handling = ?,
          rider_type_id = ?,
          specialization_1_id = ?,
          specialization_2_id = ?,
          specialization_3_id = ?
      WHERE id = ?
    `);

    this.db.transaction(() => {
      for (const row of rows) {
        const currentSkills = buildCurrentSkills(row);
        const specializationIds = buildUpdatedSpecializationIds(currentSkills, typeIdByKey);
        if (!specializationIds) {
          continue;
        }

        update.run(
          calcRiderOverall(currentSkills),
          currentSkills.bikeHandling,
          specializationIds.riderTypeId,
          specializationIds.specialization1Id,
          specializationIds.specialization2Id,
          specializationIds.specialization3Id,
          row.id,
        );
      }
    })();

    new RiderTagService(this.db).recalculateAllTags();
  }

  public initializeRiders(currentSeason: number, force = false): void {
    if (!tableExists(this.db, 'riders') || !tableExists(this.db, 'type_rider')) return;
    const requiredColumns = [
      'peak_age',
      'decline_age',
      'retirement_age',
      'skill_development',
      'pot_overall',
      'pot_flat',
      'pot_bike_handling',
      'rider_type_id',
      'specialization_1_id',
      'specialization_2_id',
      'specialization_3_id',
    ];
    if (requiredColumns.some(column => !columnExists(this.db, 'riders', column))) return;

    const typeIdByKey = new Map<RiderSpecialization, number>();
    const typeRows = this.db.prepare('SELECT id, type_key FROM type_rider').all() as Array<{ id: number; type_key: RiderSpecialization }>;
    for (const row of typeRows) typeIdByKey.set(row.type_key, row.id);

    // Die Potenziale werden mitgelesen, weil sie nicht mehr blind ueberschrieben
    // werden duerfen: ein frisch erzeugter Newgen bringt seine Potenziale aus den
    // Presets mit und hat nur noch kein Altersprofil. Frueher hat diese Methode
    // beides zusammen neu gezogen und die Preset-Ziehung damit wirkungslos
    // gemacht.
    const rows = this.db.prepare(`
      SELECT id, birth_year, skill_development, peak_age, decline_age, retirement_age,
             skill_flat, skill_mountain, skill_medium_mountain, skill_hill, skill_time_trial,
             skill_prologue, skill_cobble, skill_sprint, skill_acceleration, skill_downhill,
             skill_attack, skill_stamina, skill_resistance, skill_recuperation,
             pot_flat, pot_mountain, pot_medium_mountain, pot_hill, pot_time_trial,
             pot_prologue, pot_cobble, pot_sprint, pot_acceleration, pot_downhill,
             pot_attack, pot_stamina, pot_resistance, pot_recuperation, pot_bike_handling
      FROM riders
    `).all() as Array<RiderDevelopmentRow & Record<string, number>>;

    const update = this.db.prepare(`
      UPDATE riders
      SET peak_age = ?,
          decline_age = ?,
          retirement_age = ?,
          skill_development = ?,
          overall_rating = ?,
          pot_overall = ?,
          skill_bike_handling = ?,
          pot_flat = ?,
          pot_mountain = ?,
          pot_medium_mountain = ?,
          pot_hill = ?,
          pot_time_trial = ?,
          pot_prologue = ?,
          pot_cobble = ?,
          pot_sprint = ?,
          pot_acceleration = ?,
          pot_downhill = ?,
          pot_attack = ?,
          pot_stamina = ?,
          pot_resistance = ?,
          pot_recuperation = ?,
          pot_bike_handling = ?,
          rider_type_id = ?,
          specialization_1_id = ?,
          specialization_2_id = ?,
          specialization_3_id = ?
      WHERE id = ?
    `);

    this.db.transaction(() => {
      for (const row of rows) {
        const needsInitialization = force
          || row.skill_development <= 0
          || row.peak_age <= 0
          || row.decline_age <= 0
          || row.retirement_age <= 0;
        if (!needsInitialization) continue;

        const age = currentSeason - row.birth_year;
        const currentSkills = buildCurrentSkills(row);

        // Nur ergaenzen, was tatsaechlich fehlt. Ein Newgen hat seinen
        // Entwicklungswert und seine Potenziale schon; ihm fehlt allein das
        // Altersprofil.
        const skillDevelopment = (force || row.skill_development <= 0)
          ? rand(1, 20)
          : row.skill_development;
        const ageProfile = (force || row.peak_age <= 0 || row.decline_age <= 0 || row.retirement_age <= 0)
          ? buildAgeProfile()
          : { peakAge: row.peak_age, declineAge: row.decline_age, retirementAge: row.retirement_age };
        const vorhandenePotenziale = buildPotentialsFromRow(row);
        const hatPotenziale = RIDER_SKILL_COLUMNS.some(([key]) => vorhandenePotenziale[key] > 0);
        const potentials = (force || !hatPotenziale)
          ? buildPotentials(currentSkills, age, skillDevelopment, ageProfile.peakAge)
          : vorhandenePotenziale;
        const hybridSkills = buildHybridSkills(currentSkills, potentials);
        const specializations = getSpecializationScores(hybridSkills).slice(0, 3).map(entry => entry.specialization);
        const riderTypeId = typeIdByKey.get(specializations[0]);
        const specialization1Id = specializations[0] == null ? null : typeIdByKey.get(specializations[0]) ?? null;
        const specialization2Id = specializations[1] == null ? null : typeIdByKey.get(specializations[1]) ?? null;
        const specialization3Id = specializations[2] == null ? null : typeIdByKey.get(specializations[2]) ?? null;
        if (riderTypeId == null || specialization1Id == null) {
          throw new Error(`Rider-Type Mapping fehlt fuer Fahrer ${row.id}.`);
        }

        update.run(
          ageProfile.peakAge,
          ageProfile.declineAge,
          ageProfile.retirementAge,
          skillDevelopment,
          calcRiderOverall(currentSkills),
          calcRiderOverall(potentials),
          currentSkills.bikeHandling,
          potentials.flat,
          potentials.mountain,
          potentials.mediumMountain,
          potentials.hill,
          potentials.timeTrial,
          potentials.prologue,
          potentials.cobble,
          potentials.sprint,
          potentials.acceleration,
          potentials.downhill,
          potentials.attack,
          potentials.stamina,
          potentials.resistance,
          potentials.recuperation,
          potentials.bikeHandling,
          riderTypeId,
          specialization1Id,
          specialization2Id,
          specialization3Id,
          row.id,
        );
      }
    })();

    new RiderTagService(this.db).recalculateAllTags();
  }
}