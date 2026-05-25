import Database from 'better-sqlite3';

const SPECIALIZATION_IDS = [1, 2, 3, 4, 5, 6] as const;
type SpecializationId = typeof SPECIALIZATION_IDS[number];
const ROLE_FALLBACK = 'Wassertraeger';

type RiderProgramRow = {
  id: number;
  role_name: string | null;
  specialization_1_id: number | null;
  specialization_2_id: number | null;
  specialization_3_id: number | null;
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
  skill_bike_handling: number;
};

type ProbabilityRuleRow = {
  id: number;
  role_name: string;
  spec_1: number | null;
  spec_2: number | null;
  spec_3: number | null;
  program_id: number;
  probability: number;
};

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName) as { name: string } | undefined;
  return row != null;
}

function normalizeRoleName(value: string | null | undefined): string {
  return value?.trim() || ROLE_FALLBACK;
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function deterministicUnit(seed: string): number {
  return hashString(seed) / 0xffffffff;
}

function isSpecializationId(value: number | null | undefined): value is SpecializationId {
  return SPECIALIZATION_IDS.includes(value as SpecializationId);
}

function normalizeSpecIds(specIds: number[]): SpecializationId[] {
  const uniqueSpecIds = Array.from(new Set(specIds.filter(isSpecializationId)));
  return SPECIALIZATION_IDS.filter((specId) => uniqueSpecIds.includes(specId));
}

function resolveSkillScores(row: RiderProgramRow): Record<SpecializationId, number> {
  return {
    1: row.skill_mountain * 0.45 + row.skill_medium_mountain * 0.25 + row.skill_recuperation * 0.15 + row.skill_stamina * 0.15,
    2: row.skill_hill * 0.4 + row.skill_medium_mountain * 0.2 + row.skill_acceleration * 0.15 + row.skill_attack * 0.15 + row.skill_resistance * 0.1,
    3: row.skill_sprint * 0.4 + row.skill_acceleration * 0.25 + row.skill_flat * 0.15 + row.skill_bike_handling * 0.1 + row.skill_resistance * 0.1,
    4: row.skill_time_trial * 0.45 + row.skill_prologue * 0.25 + row.skill_flat * 0.15 + row.skill_stamina * 0.15,
    5: row.skill_cobble * 0.55 + row.skill_flat * 0.15 + row.skill_bike_handling * 0.15 + row.skill_resistance * 0.15,
    6: row.skill_attack * 0.35 + row.skill_stamina * 0.2 + row.skill_resistance * 0.2 + row.skill_hill * 0.15 + row.skill_acceleration * 0.1,
  };
}

function resolveBestSpecIds(row: RiderProgramRow): SpecializationId[] {
  const seededSpecs = normalizeSpecIds([
    row.specialization_1_id,
    row.specialization_2_id,
    row.specialization_3_id,
  ].filter((specId): specId is number => specId != null));

  if (seededSpecs.length >= 3) {
    return seededSpecs.slice(0, 3);
  }

  const scores = resolveSkillScores(row);
  const missingSpecs = SPECIALIZATION_IDS
    .filter((specId) => !seededSpecs.includes(specId))
    .sort((left, right) => scores[right] - scores[left] || left - right);

  return normalizeSpecIds([...seededSpecs, ...missingSpecs.slice(0, 3 - seededSpecs.length)]);
}

function ruleMatchesSpecs(rule: ProbabilityRuleRow, specs: SpecializationId[]): boolean {
  const ruleSpecs = normalizeSpecIds([rule.spec_1, rule.spec_2, rule.spec_3].filter((specId): specId is number => specId != null));
  return ruleSpecs.every((spec) => specs.includes(spec));
}

function ruleSpecificity(rule: ProbabilityRuleRow): number {
  return [rule.spec_1, rule.spec_2, rule.spec_3].filter((spec) => spec != null).length;
}

function selectRulePool(rules: ProbabilityRuleRow[], roleName: string, specs: SpecializationId[]): ProbabilityRuleRow[] {
  const matching = rules.filter((rule) => rule.role_name === roleName && ruleMatchesSpecs(rule, specs));
  if (matching.length > 0) {
    const maxSpecificity = Math.max(...matching.map(ruleSpecificity));
    return matching.filter((rule) => ruleSpecificity(rule) === maxSpecificity);
  }

  const fallback = rules.filter((rule) => rule.role_name === ROLE_FALLBACK && ruleMatchesSpecs(rule, specs));
  if (fallback.length > 0) {
    const maxSpecificity = Math.max(...fallback.map(ruleSpecificity));
    return fallback.filter((rule) => ruleSpecificity(rule) === maxSpecificity);
  }

  return rules.filter((rule) => ruleSpecificity(rule) === 0);
}

function chooseProgramId(rules: ProbabilityRuleRow[], seed: string): number | null {
  const totalWeight = rules.reduce((sum, rule) => sum + Math.max(0, rule.probability), 0);
  if (totalWeight <= 0) {
    return null;
  }

  const target = deterministicUnit(seed) * totalWeight;
  let cursor = 0;
  for (const rule of [...rules].sort((left, right) => left.id - right.id)) {
    cursor += Math.max(0, rule.probability);
    if (target <= cursor) {
      return rule.program_id;
    }
  }

  return rules[rules.length - 1]?.program_id ?? null;
}

export class RiderProgramService {
  constructor(private readonly db: Database.Database) {}

  public ensureSeasonPrograms(season: number, assignedOn?: string): void {
    if (!tableExists(this.db, 'riders') || !tableExists(this.db, 'race_programs') || !tableExists(this.db, 'race_program_probability_rules')) {
      return;
    }

    this.ensureSchema();

    const assignedDate = assignedOn ?? this.resolveAssignedOn(season);
    const missingCount = (this.db.prepare(`
      SELECT COUNT(*) AS count
      FROM riders
      LEFT JOIN contracts current_contract
        ON current_contract.id = (
          SELECT contracts.id
          FROM contracts
          WHERE contracts.rider_id = riders.id
            AND contracts.start_season <= ?
            AND contracts.end_season >= ?
          ORDER BY contracts.start_season DESC, contracts.id DESC
          LIMIT 1
        )
      WHERE riders.is_retired = 0
        AND COALESCE(current_contract.team_id, riders.active_team_id) IS NOT NULL
        AND NOT EXISTS (
          SELECT 1
          FROM rider_season_programs existing_program
          WHERE existing_program.season = ?
            AND existing_program.rider_id = riders.id
        )
    `).get(season, season, season) as { count: number } | undefined)?.count ?? 0;
    if (missingCount === 0) {
      return;
    }

    const rules = this.db.prepare(`
      SELECT id, role_name, spec_1, spec_2, spec_3, program_id, probability
      FROM race_program_probability_rules
      ORDER BY id ASC
    `).all() as ProbabilityRuleRow[];
    if (rules.length === 0) {
      return;
    }

    const riders = this.db.prepare(`
      SELECT riders.id,
             role.name AS role_name,
             riders.specialization_1_id,
             riders.specialization_2_id,
             riders.specialization_3_id,
             riders.skill_flat,
             riders.skill_mountain,
             riders.skill_medium_mountain,
             riders.skill_hill,
             riders.skill_time_trial,
             riders.skill_prologue,
             riders.skill_cobble,
             riders.skill_sprint,
             riders.skill_acceleration,
             riders.skill_downhill,
             riders.skill_attack,
             riders.skill_stamina,
             riders.skill_resistance,
             riders.skill_recuperation,
             riders.skill_bike_handling
      FROM riders
      LEFT JOIN sta_role role ON role.id = riders.role_id
      LEFT JOIN contracts current_contract
        ON current_contract.id = (
          SELECT contracts.id
          FROM contracts
          WHERE contracts.rider_id = riders.id
            AND contracts.start_season <= ?
            AND contracts.end_season >= ?
          ORDER BY contracts.start_season DESC, contracts.id DESC
          LIMIT 1
        )
      WHERE riders.is_retired = 0
        AND COALESCE(current_contract.team_id, riders.active_team_id) IS NOT NULL
        AND NOT EXISTS (
          SELECT 1
          FROM rider_season_programs existing_program
          WHERE existing_program.season = ?
            AND existing_program.rider_id = riders.id
        )
      ORDER BY riders.id ASC
    `).all(season, season, season) as RiderProgramRow[];

    const insert = this.db.prepare(`
      INSERT OR IGNORE INTO rider_season_programs (season, rider_id, program_id, assigned_on)
      VALUES (?, ?, ?, ?)
    `);

    this.db.transaction(() => {
      for (const rider of riders) {
        const roleName = normalizeRoleName(rider.role_name);
        const specs = resolveBestSpecIds(rider);
        const rulePool = selectRulePool(rules, roleName, specs);
        const programId = chooseProgramId(rulePool, `${season}|${rider.id}|${roleName}|${specs.join('|')}`);
        if (programId == null) {
          continue;
        }
        insert.run(season, rider.id, programId, assignedDate);
      }
    })();
  }

  private ensureSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS rider_season_programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        season INTEGER NOT NULL,
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        program_id INTEGER NOT NULL REFERENCES race_programs(id),
        assigned_on TEXT NOT NULL,
        UNIQUE(season, rider_id)
      );

      CREATE INDEX IF NOT EXISTS idx_rider_season_programs_program
        ON rider_season_programs(season, program_id);
    `);
  }

  private resolveAssignedOn(season: number): string {
    const row = this.db.prepare('SELECT "current_date" AS current_date FROM game_state WHERE id = 1').get() as { current_date: string } | undefined;
    return row?.current_date ?? `${season}-01-01`;
  }
}
