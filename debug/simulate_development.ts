import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

const RIDER_STAT_MAX = 85;
const DAILY_GROWTH_CAP = 0.018;
const DAILY_DECLINE_CAP = 0.012;
const SEASON_FORM_RISE_DAYS = 45;
const SEASON_FORM_FALL_DAYS = 25;
const SEASON_FORM_MAX_RAW = 4.0;
const SEASON_FORM_RISE_STEP_RAW = 0.1;
const SEASON_FORM_MIN_RAW = 0.0;

const RIDER_SKILL_KEYS = [
  'flat', 'mountain', 'mediumMountain', 'hill', 'timeTrial',
  'prologue', 'cobble', 'sprint', 'acceleration', 'downhill',
  'attack', 'stamina', 'resistance', 'recuperation'
] as const;

type RiderSkillKey = typeof RIDER_SKILL_KEYS[number];

interface RiderData {
  id: number;
  first_name: string;
  last_name: string;
  birth_year: number;
  skill_development: number;
  peak_age: number;
  decline_age: number;
  retirement_age: number;
  is_retired: number;
  overall_rating: number;
  team_name: string | null;
  rider_type: string;
  specialization_1_id: number | null;
  specialization_2_id: number | null;
  specialization_3_id: number | null;
  active_team_id: number | null;
  skills: Record<string, number>;
  potentials: Record<string, number>;
  peak_dates: string[];
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, min = 0, max = RIDER_STAT_MAX): number {
  return round2(Math.max(min, Math.min(max, value)));
}

function randomNoise(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function calcBikeHandling(skills: Record<string, number>): number {
  return clamp(
    (skills.downhill ?? 0) * 0.7 +
    (skills.sprint ?? 0) * 0.15 +
    (skills.attack ?? 0) * 0.05 +
    (skills.resistance ?? 0) * 0.1
  );
}

function calcOverall(skills: Record<string, number>): number {
  const bikeHandling = calcBikeHandling(skills);
  const includedSkills = [
    ['mountain', skills.mountain ?? 0, 1.8],
    ['hill', skills.hill ?? 0, 1],
    ['sprint', skills.sprint ?? 0, 1.2],
    ['timeTrial', skills.timeTrial ?? 0, 2 / 3],
    ['cobble', skills.cobble ?? 0, 4 / 5],
    ['mediumMountain', skills.mediumMountain ?? 0, 0.2],
    ['stamina', skills.stamina ?? 0, 0.1],
    ['resistance', skills.resistance ?? 0, 0.1],
    ['recuperation', skills.recuperation ?? 0, 0.1],
    ['flat', skills.flat ?? 0, 0.15],
    ['acceleration', skills.acceleration ?? 0, 0.8],
  ] as const;

  const weightedTotal = includedSkills.reduce((sum, [, value, weight]) => sum + value * weight, 0);
  let topSkillValue = -Infinity;
  let secondSkillValue = -Infinity;

  for (const [, value] of includedSkills) {
    if (value > topSkillValue) {
      secondSkillValue = topSkillValue;
      topSkillValue = value;
      continue;
    }
    if (value > secondSkillValue) {
      secondSkillValue = value;
    }
  }

  const bonusTotal = topSkillValue * 1.5 + secondSkillValue * 1.25;
  const totalWeight = 1.8 + 1 + 1.2 + (2 / 3) + (4 / 5) + 0.2 + 0.1 + 0.1 + 0.1 + 0.15 + 0.8 + 1.5 + 1.25;
  return clamp((weightedTotal + bonusTotal) / totalWeight);
}

function resolveAgeGrowthFactor(age: number, peakAge: number): number {
  if (age >= peakAge) return 0;
  const yearsUntilPeak = Math.max(0, peakAge - age);
  return Math.max(0.18, Math.min(1.0, yearsUntilPeak / 7));
}

function resolveSkillDevelopmentFactor(skillDevelopment: number): number {
  return 0.65 + (Math.max(1, Math.min(20, skillDevelopment)) / 20) * 0.7;
}

function resolveSkillFocusFactor(riderType: string, skillKey: RiderSkillKey): number {
  const factors: Record<string, Partial<Record<RiderSkillKey, number>>> = {
    Berg: { mountain: 1.35, mediumMountain: 1.2, stamina: 1.15, attack: 1.12, downhill: 1.05 },
    Hill: { hill: 1.35, acceleration: 1.2, mediumMountain: 1.12, attack: 1.12, bikeHandling: 1.05 },
    Sprint: { sprint: 1.35, acceleration: 1.25, flat: 1.15, resistance: 1.05 },
    Timetrial: { timeTrial: 1.35, prologue: 1.25, flat: 1.1, resistance: 1.1 },
    Cobble: { cobble: 1.35, flat: 1.15, resistance: 1.15, hill: 1.05, bikeHandling: 1.08 },
    Attacker: { attack: 1.35, acceleration: 1.15, hill: 1.12, mediumMountain: 1.1, resistance: 1.1 },
  };
  const typeFactors = factors[riderType];
  if (!typeFactors) return 0.78;
  return typeFactors[skillKey] ?? 0.78;
}

function resolveSkillDeclineFactor(skillKey: RiderSkillKey): number {
  const factors: Record<RiderSkillKey, number> = {
    flat: 0.55,
    mountain: 0.85,
    mediumMountain: 0.8,
    hill: 0.9,
    timeTrial: 0.65,
    prologue: 1.15,
    cobble: 0.85,
    sprint: 1.35,
    acceleration: 1.45,
    downhill: 0.75,
    attack: 0.95,
    stamina: 0.55,
    resistance: 0.6,
    recuperation: 0.65,
    bikeHandling: 0.7,
  };
  return factors[skillKey] ?? 1.0;
}

function isoDateToDayNumber(isoDate: string): number {
  return Math.floor(new Date(`${isoDate}T00:00:00.000Z`).getTime() / 86400000);
}

function isNovember(currentDate: string): boolean {
  return currentDate.slice(5, 10) >= '11-01' && currentDate.slice(5, 10) <= '11-30';
}

function resolvePeakPhase(currentDate: string, peakDates: string[]): { phase: 'build' | 'decline'; peakDate: string; elapsedDays: number; actualBuildStartDay?: number } | null {
  const currentDay = isoDateToDayNumber(currentDate);
  const sortedPeaks = [...peakDates].sort((a, b) => isoDateToDayNumber(a) - isoDateToDayNumber(b));

  for (let i = 0; i < sortedPeaks.length; i++) {
    const peakDate = sortedPeaks[i];
    const peakDay = isoDateToDayNumber(peakDate);
    const prevPeakDay = i > 0 ? isoDateToDayNumber(sortedPeaks[i - 1]) : Number.NEGATIVE_INFINITY;

    if (currentDay >= peakDay && currentDay < peakDay + SEASON_FORM_FALL_DAYS) {
      return { phase: 'decline', peakDate, elapsedDays: currentDay - peakDay };
    }

    const seasonYear = peakDate.slice(0, 4);
    const seasonStartDay = isoDateToDayNumber(`${seasonYear}-01-01`);
    const idealBuildStart = Math.max(seasonStartDay, peakDay - SEASON_FORM_RISE_DAYS);
    const prevDeclineEnd = prevPeakDay + SEASON_FORM_FALL_DAYS;
    const actualBuildStartDay = Math.max(idealBuildStart, prevDeclineEnd);

    if (currentDay >= actualBuildStartDay && currentDay < peakDay) {
      return { phase: 'build', peakDate, elapsedDays: peakDay - currentDay, actualBuildStartDay };
    }
  }

  return null;
}

function getDatesForYear(year: number): string[] {
  const dates: string[] = [];
  const start = new Date(Date.UTC(year, 0, 1));
  for (let i = 0; i < 365; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

// Loads riders from the db and returns copy
function loadRiders(db: Database.Database): RiderData[] {
  const rows = db.prepare(`
    SELECT 
      r.id, r.first_name, r.last_name, r.birth_year, r.skill_development, r.peak_age, r.decline_age, r.retirement_age, r.is_retired, r.overall_rating,
      t.name AS team_name,
      tr.type_key AS rider_type,
      r.specialization_1_id, r.specialization_2_id, r.specialization_3_id, r.active_team_id,
      r.skill_flat, r.skill_mountain, r.skill_medium_mountain, r.skill_hill, r.skill_time_trial,
      r.skill_prologue, r.skill_cobble, r.skill_sprint, r.skill_acceleration, r.skill_downhill,
      r.skill_attack, r.skill_stamina, r.skill_resistance, r.skill_recuperation, r.skill_bike_handling,
      r.pot_flat, r.pot_mountain, r.pot_medium_mountain, r.pot_hill, r.pot_time_trial,
      r.pot_prologue, r.pot_cobble, r.pot_sprint, r.pot_acceleration, r.pot_downhill,
      r.pot_attack, r.pot_stamina, r.pot_resistance, r.pot_recuperation, r.pot_bike_handling,
      rds.peak_dates_json
    FROM riders r
    LEFT JOIN teams t ON t.id = r.active_team_id
    LEFT JOIN type_rider tr ON tr.id = r.rider_type_id
    LEFT JOIN rider_daily_state rds ON rds.rider_id = r.id AND rds.season = 2027
    WHERE r.is_retired = 0
  `).all() as any[];

  return rows.map(r => {
    let peak_dates: string[] = [];
    if (r.peak_dates_json) {
      try { peak_dates = JSON.parse(r.peak_dates_json); } catch (e) {}
    }
    // Fallback peak dates if empty
    if (peak_dates.length === 0) {
      peak_dates = ['2027-05-15', '2027-07-15', '2027-09-15'];
    }

    let peakAge = r.peak_age;
    let declineAge = r.decline_age;
    let retirementAge = r.retirement_age;
    let skillDevelopment = r.skill_development;
    if (peakAge <= 0 || declineAge <= 0 || retirementAge <= 0 || skillDevelopment <= 0) {
      peakAge = Math.floor(Math.random() * 5) + 24; // 24 to 28
      declineAge = Math.floor(Math.random() * (32 - Math.max(peakAge + 1, 26) + 1)) + Math.max(peakAge + 1, 26);
      retirementAge = Math.floor(Math.random() * (38 - Math.max(declineAge + 1, 32) + 1)) + Math.max(declineAge + 1, 32);
      skillDevelopment = Math.floor(Math.random() * 20) + 1;
    }

    const skills: Record<string, number> = {};
    const potentials: Record<string, number> = {};
    for (const key of RIDER_SKILL_KEYS) {
      const colName = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      skills[key] = r[`skill_${colName}`] ?? 60;
      potentials[key] = r[`pot_${colName}`] ?? 70;
    }

    return {
      id: r.id,
      first_name: r.first_name,
      last_name: r.last_name,
      birth_year: r.birth_year,
      skill_development: skillDevelopment,
      peak_age: peakAge,
      decline_age: declineAge,
      retirement_age: retirementAge,
      is_retired: r.is_retired,
      overall_rating: r.overall_rating,
      team_name: r.team_name,
      rider_type: r.rider_type ?? 'Berg',
      specialization_1_id: r.specialization_1_id,
      specialization_2_id: r.specialization_2_id,
      specialization_3_id: r.specialization_3_id,
      active_team_id: r.active_team_id,
      skills,
      potentials,
      peak_dates
    };
  });
}

function simulateYear(riders: RiderData[], year: number): void {
  const yearDates = getDatesForYear(year);

  // Build mentors list
  const mentorsByTeam = new Map<number, Array<{ spec1: number }>>();
  for (const r of riders) {
    const age = year - r.birth_year;
    if (r.is_retired) continue;
    if (age >= 31 && r.overall_rating >= 73 && r.active_team_id != null && r.specialization_1_id != null) {
      if (!mentorsByTeam.has(r.active_team_id)) mentorsByTeam.set(r.active_team_id, []);
      mentorsByTeam.get(r.active_team_id)!.push({ spec1: r.specialization_1_id });
    }
  }

  // Pre-generate random race dates inside peak phases for each rider based on age
  const riderRaceDates = new Map<number, Set<string>>();
  for (const r of riders) {
    if (r.is_retired) continue;
    const age = year - r.birth_year;
    let maxRaceDays = 100;
    if (age === 16) {
      maxRaceDays = 0;
    } else if (age >= 17 && age <= 19) {
      maxRaceDays = 60;
    }

    const peakDatesForYear = r.peak_dates.map(d => d.replace(/^\d{4}/, String(year)));
    const peakDays: string[] = [];
    for (const date of yearDates) {
      if (resolvePeakPhase(date, peakDatesForYear) !== null) {
        peakDays.push(date);
      }
    }
    // Shuffle and pick up to maxRaceDays
    const shuffled = [...peakDays].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, maxRaceDays);
    riderRaceDates.set(r.id, new Set(selected));
  }

  // Day-by-day simulation
  const awardedPeaks = new Map<number, Set<string>>(); // riderId -> Set of peakDates

  for (const date of yearDates) {
    const isNov = isNovember(date);

    for (const r of riders) {
      if (r.is_retired) continue;

      const age = year - r.birth_year;
      const peakDatesForYear = r.peak_dates.map(d => d.replace(/^\d{4}/, String(year)));
      const phaseInfo = resolvePeakPhase(date, peakDatesForYear);

      const raceDates = riderRaceDates.get(r.id);
      const isInRaceToday = raceDates ? raceDates.has(date) : false;

      // isPeakStartDay is true if it is the peak date itself (first day of decline)
      const isPeakStartDay = phaseInfo?.phase === 'decline' && phaseInfo.elapsedDays === 0;

      // Determine canGrow & canDecline
      let canGrow = true;
      let canDecline = true;

      if (isInRaceToday) {
        if (age > 22) {
          canGrow = false;
        }
      }
      if (phaseInfo?.phase === 'decline') {
        canGrow = false;
      }
      if (isNov) {
        canGrow = false;
      }
      if (age >= r.peak_age) {
        canGrow = false;
      }

      const deltas: Partial<Record<RiderSkillKey, number>> = {};
      let growthTotal = 0;
      let declineTotal = 0;

      if (canGrow) {
        const ageFactor = resolveAgeGrowthFactor(age, r.peak_age);
        let mentorBoost = 0;
        if (age <= 23 && r.active_team_id != null) {
          const teamMentors = mentorsByTeam.get(r.active_team_id) ?? [];
          const top3Specs = [r.specialization_1_id, r.specialization_2_id, r.specialization_3_id].filter(Boolean);
          if (teamMentors.some(m => top3Specs.includes(m.spec1))) {
            mentorBoost = 3;
          }
        }
        const developmentFactor = resolveSkillDevelopmentFactor(Math.min(20, r.skill_development + mentorBoost));
        const u23RaceMultiplier = (age <= 22 && isInRaceToday) ? 1.5 : 1;

        let peakBoostMultiplier = 0;
        if (age <= 22 && isInRaceToday && isPeakStartDay && phaseInfo?.peakDate) {
          let set = awardedPeaks.get(r.id);
          if (!set) {
            set = new Set();
            awardedPeaks.set(r.id, set);
          }
          if (!set.has(phaseInfo.peakDate)) {
            set.add(phaseInfo.peakDate);
            peakBoostMultiplier = 30;
          }
        }

        const localDayMultiplier = 1 + peakBoostMultiplier;

        for (const skillKey of RIDER_SKILL_KEYS) {
          const headroom = Math.max(0, r.potentials[skillKey] - r.skills[skillKey]);
          if (headroom <= 0.01) continue;
          const dailyGrowth = Math.min(
            DAILY_GROWTH_CAP * localDayMultiplier * (age <= 22 ? 1.5 : 1),
            headroom * 0.0023 * ageFactor * developmentFactor * resolveSkillFocusFactor(r.rider_type, skillKey) * localDayMultiplier * randomNoise(0.75, 1.25) * u23RaceMultiplier,
          );
          if (dailyGrowth <= 0) continue;
          const applied = clamp(Math.min(r.potentials[skillKey], r.skills[skillKey] + dailyGrowth)) - r.skills[skillKey];
          if (applied > 0) {
            deltas[skillKey] = round2(applied);
            growthTotal += applied;
          }
        }
      }

      if (canDecline && age >= r.decline_age) {
        const yearsAfterDecline = Math.max(0, age - r.decline_age + 1);
        const ageDeclineFactor = Math.min(2.4, 0.35 + yearsAfterDecline * 0.22);

        let declineMultiplier = 1.0;
        if (isInRaceToday) {
          declineMultiplier *= 0.5;
        }
        if (phaseInfo?.phase === 'build') {
          declineMultiplier *= 0.5;
        } else if (phaseInfo?.phase === 'decline') {
          declineMultiplier *= 3.0;
        }

        for (const skillKey of RIDER_SKILL_KEYS) {
          const dailyDecline = Math.min(
            DAILY_DECLINE_CAP * 1,
            0.00135 * ageDeclineFactor * resolveSkillDeclineFactor(skillKey) * 1 * randomNoise(0.75, 1.25) * declineMultiplier,
          );
          if (dailyDecline <= 0) continue;
          const applied = r.skills[skillKey] - clamp(r.skills[skillKey] - dailyDecline);
          if (applied > 0) {
            deltas[skillKey] = round2((deltas[skillKey] ?? 0) - applied);
            declineTotal += applied;
          }
        }
      }

      // Update skills
      const hasDelta = growthTotal > 0 || declineTotal > 0;
      if (hasDelta) {
        for (const [skillKey, delta] of Object.entries(deltas)) {
          r.skills[skillKey] = clamp(r.skills[skillKey] + delta);
        }
        r.skills.bikeHandling = calcBikeHandling(r.skills);
        r.overall_rating = calcOverall(r.skills);
      }
    }
  }
}

function runSimulation(db: Database.Database, yearsCount: number, csvFilename: string): void {
  const riders = loadRiders(db);
  const resultsList: Array<{
    name: string;
    team: string;
    startAge: number;
    endAge: number;
    startOvr: number;
    endOvr: number;
    change: number;
    status: string;
  }> = [];

  for (const r of riders) {
    const startOvr = r.overall_rating;
    const startAge = 2027 - r.birth_year;

    // Simulate season by season
    for (let y = 0; y < yearsCount; y++) {
      const currentYear = 2027 + y;
      const age = currentYear - r.birth_year;

      if (age >= r.retirement_age) {
        r.is_retired = 1;
      }

      if (!r.is_retired) {
        // Roll new skill development
        r.skill_development = Math.max(1, Math.min(20, r.skill_development + Math.floor(Math.random() * 7) - 3));
        simulateYear([r], currentYear);
      }
    }

    const endOvr = r.overall_rating;
    const endAge = startAge + yearsCount;
    const change = round2(endOvr - startOvr);

    resultsList.push({
      name: `${r.first_name} ${r.last_name}`,
      team: r.team_name ?? 'Vereinslos / Free Agent',
      startAge,
      endAge,
      startOvr,
      endOvr,
      change,
      status: r.is_retired ? 'Retired' : 'Active'
    });
  }

  // Sort by change descending
  resultsList.sort((a, b) => b.change - a.change);

  // Write CSV
  const csvPath = path.join(__dirname, csvFilename);
  let csvContent = 'Fahrer;Team;Alter Start;Alter Ende;Overall Start;Overall Ende;Entwicklung;Status\n';
  for (const r of resultsList) {
    csvContent += `${r.name};${r.team};${r.startAge};${r.endAge};${r.startOvr.toFixed(2)};${r.endOvr.toFixed(2)};${r.change >= 0 ? '+' : ''}${r.change.toFixed(2)};${r.status}\n`;
  }
  fs.writeFileSync(csvPath, csvContent, 'utf8');

  console.log(`\n=== STÄRKSTE GEWINNER (${yearsCount} JAHR(E)) ===`);
  const gainers = resultsList.slice(0, 15);
  gainers.forEach((r, idx) => {
    console.log(`${idx + 1}. ${r.name} (${r.team}) | Alter: ${r.startAge} -> ${r.endAge} | OVR: ${r.startOvr.toFixed(1)} -> ${r.endOvr.toFixed(1)} (+${r.change.toFixed(2)}) [${r.status}]`);
  });

  console.log(`\n=== STÄRKSTE VERLIERER (${yearsCount} JAHR(E)) ===`);
  const decliners = [...resultsList].reverse().slice(0, 15);
  decliners.forEach((r, idx) => {
    console.log(`${idx + 1}. ${r.name} (${r.team}) | Alter: ${r.startAge} -> ${r.endAge} | OVR: ${r.startOvr.toFixed(1)} -> ${r.endOvr.toFixed(1)} (${r.change.toFixed(2)}) [${r.status}]`);
  });

  console.log(`\nVoller Report geschrieben nach: ${csvPath}\n`);
}

async function main() {
  const dbPath = path.join(__dirname, 'stages_test.db');
  if (!fs.existsSync(dbPath)) {
    console.error(`Database not found at ${dbPath}. Please run test_calendar.ts first.`);
    process.exit(1);
  }
  const db = new Database(dbPath, { readonly: true });

  try {
    console.log("=== SIMULIERE ENTWICKLUNG FÜR 1 JAHR ===");
    runSimulation(db, 1, 'development_simulation_1_year.csv');

    console.log("\n=== SIMULIERE ENTWICKLUNG FÜR 5 JAHRE ===");
    runSimulation(db, 5, 'development_simulation_5_years.csv');

  } catch (err) {
    console.error("Simulation error:", err);
  } finally {
    db.close();
  }
}

main();
