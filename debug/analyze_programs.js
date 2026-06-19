// NICHT LÖSCHEN / DO NOT DELETE - Zukünftiges Testskript
/**
 * analyze_programs.js
 * Analyzes Tier 1 (WorldTour) riders from riders.csv to:
 * 1. Assign roles using the RiderRoleService algorithm.
 * 2. Calculate spec1-3 using the resolveSkillScores formula.
 * 3. Analyze all combinations of role & spec1-3, check if they exist in rules.
 * 4. Calculate expected (probabilistic) and deterministic program assignments.
 * 
 * Outputs:
 * - debug/combinations_analysis.csv
 * - debug/program_distribution.csv
 */

const fs = require('fs');
const path = require('path');

// Constants
const ROLE_NAMES = {
  1: 'Kapitaen',
  2: 'Co-Kapitaen',
  3: 'Edelhelfer',
  4: 'Starke Helfer',
  5: 'Wassertraeger',
  6: 'Sprinter'
};

const roleIds = {
  captain: { id: 1, weighting: 10 },
  coCaptain: { id: 2, weighting: 10 },
  eliteHelper: { id: 3, weighting: 15 },
  strongHelper: { id: 4, weighting: 25 },
  waterCarrier: { id: 5, weighting: 40 },
  sprinter: { id: 6, weighting: 0 }
};

const SPECIALIZATION_IDS = [1, 2, 3, 4, 5, 6];

// Delimiter & CSV parser
function detectCsvDelimiter(line) {
  let commaCount = 0;
  let semicolonCount = 0;
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes) {
      if (char === ',') commaCount += 1;
      if (char === ';') semicolonCount += 1;
    }
  }

  return semicolonCount > commaCount ? ';' : ',';
}

function parseCsvLine(line, delimiter) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function parseCsv(content) {
  const normalized = content.replace(/^\uFEFF/, '').trim();
  if (!normalized) return [];

  const lines = normalized
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length < 2) {
    throw new Error('CSV must contain header and at least one data row.');
  }

  const delimiter = detectCsvDelimiter(lines[0]);
  const headers = parseCsvLine(lines[0], delimiter).map(value => value.trim());
  return lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line, delimiter);
    if (values.length !== headers.length) {
      while (values.length < headers.length) values.push('');
      values.length = headers.length;
    }

    return headers.reduce((record, header, headerIndex) => {
      record[header] = values[headerIndex] ?? '';
      return record;
    }, {});
  });
}

// Calculations
function clamp(value, min = 0, max = 85) {
  return Math.max(min, Math.min(max, Math.round(value * 100) / 100));
}

function calcBikeHandling(row) {
  const downhill = parseFloat(row.skill_downhill || 0);
  const sprint = parseFloat(row.skill_sprint || 0);
  const attack = parseFloat(row.skill_attack || 0);
  const resistance = parseFloat(row.skill_resistance || 0);
  return clamp(downhill * 0.7 + sprint * 0.15 + attack * 0.05 + resistance * 0.1);
}

function calcOverall(row) {
  const skills = {
    mountain: parseFloat(row.skill_mountain || 0),
    hill: parseFloat(row.skill_hill || 0),
    sprint: parseFloat(row.skill_sprint || 0),
    timeTrial: parseFloat(row.skill_time_trial || 0),
    cobble: parseFloat(row.skill_cobble || 0),
    mediumMountain: parseFloat(row.skill_medium_mountain || 0),
    stamina: parseFloat(row.skill_stamina || 0),
    resistance: parseFloat(row.skill_resistance || 0),
    recuperation: parseFloat(row.skill_recuperation || 0),
    flat: parseFloat(row.skill_flat || 0),
    acceleration: parseFloat(row.skill_acceleration || 0),
  };

  const includedSkills = [
    ['mountain', skills.mountain, 1.8],
    ['hill', skills.hill, 1],
    ['sprint', skills.sprint, 1.2],
    ['timeTrial', skills.timeTrial, 2 / 3],
    ['cobble', skills.cobble, 4 / 5],
    ['mediumMountain', skills.mediumMountain, 0.2],
    ['stamina', skills.stamina, 0.1],
    ['resistance', skills.resistance, 0.1],
    ['recuperation', skills.recuperation, 0.1],
    ['flat', skills.flat, 0.15],
    ['acceleration', skills.acceleration, 0.8],
  ];

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

function resolveSkillScores(row, bikeHandling) {
  const mountain = parseFloat(row.skill_mountain || 0);
  const medium_mountain = parseFloat(row.skill_medium_mountain || 0);
  const recuperation = parseFloat(row.skill_recuperation || 0);
  const stamina = parseFloat(row.skill_stamina || 0);
  const hill = parseFloat(row.skill_hill || 0);
  const acceleration = parseFloat(row.skill_acceleration || 0);
  const attack = parseFloat(row.skill_attack || 0);
  const resistance = parseFloat(row.skill_resistance || 0);
  const sprint = parseFloat(row.skill_sprint || 0);
  const flat = parseFloat(row.skill_flat || 0);
  const time_trial = parseFloat(row.skill_time_trial || 0);
  const prologue = parseFloat(row.skill_prologue || 0);
  const cobble = parseFloat(row.skill_cobble || 0);

  return {
    1: mountain * 0.45 + medium_mountain * 0.25 + recuperation * 0.15 + stamina * 0.15,
    2: hill * 0.4 + medium_mountain * 0.2 + acceleration * 0.15 + attack * 0.15 + resistance * 0.1,
    3: sprint * 0.4 + acceleration * 0.25 + flat * 0.15 + bikeHandling * 0.1 + resistance * 0.1,
    4: time_trial * 0.45 + prologue * 0.25 + flat * 0.15 + stamina * 0.15,
    5: cobble * 0.55 + flat * 0.15 + bikeHandling * 0.15 + resistance * 0.15,
    6: (attack * 0.35 + stamina * 0.2 + resistance * 0.2 + hill * 0.15 + acceleration * 0.1) * 0.97
  };
}

function resolveBestSpecIds(row, bikeHandling) {
  const scores = resolveSkillScores(row, bikeHandling);
  const missingSpecs = SPECIALIZATION_IDS
    .map(specId => ({ specId, score: scores[specId] }))
    .sort((left, right) => (right.score - left.score) || (left.specId - right.specId));

  const top3 = missingSpecs.slice(0, 3).map(x => x.specId);
  return top3.sort((a, b) => a - b);
}

// Role Assignment Logic
function compareLeadership(left, right) {
  return (right.overall_rating - left.overall_rating)
    || (right.skill_mountain - left.skill_mountain)
    || (right.skill_time_trial - left.skill_time_trial)
    || (right.skill_hill - left.skill_hill)
    || (right.skill_flat - left.skill_flat)
    || (left.id - right.id);
}

function compareSprint(left, right) {
  return (right.skill_sprint - left.skill_sprint)
    || (right.skill_acceleration - left.skill_acceleration)
    || (right.overall_rating - left.overall_rating)
    || (left.id - right.id);
}

function resolveProportionalCounts(rosterSize, roleKeys, roleIds) {
  const counts = {};
  for (const key of roleKeys) counts[key] = 0;
  if (rosterSize <= 0) return counts;

  const weightedRoles = roleKeys.map((key) => ({
    key,
    weighting: Math.max(0, roleIds[key].weighting),
    baseCount: 0,
    remainder: 0,
  }));
  const totalWeight = weightedRoles.reduce((sum, role) => sum + role.weighting, 0);

  if (totalWeight <= 0) return counts;

  let assignedCount = 0;
  for (const role of weightedRoles) {
    const quota = (rosterSize * role.weighting) / totalWeight;
    role.baseCount = Math.floor(quota);
    role.remainder = quota - role.baseCount;
    counts[role.key] = role.baseCount;
    assignedCount += role.baseCount;
  }

  let remainingCount = rosterSize - assignedCount;
  const rankedRemainders = [...weightedRoles].sort((left, right) => {
    return (right.remainder - left.remainder)
      || (right.weighting - left.weighting)
      || (roleKeys.indexOf(left.key) - roleKeys.indexOf(right.key));
  });

  for (const role of rankedRemainders) {
    if (remainingCount <= 0) break;
    counts[role.key] += 1;
    remainingCount -= 1;
  }

  return counts;
}

function resolveLeadershipRoleCounts(rosterSize) {
  const proportionalCounts = resolveProportionalCounts(rosterSize, ['captain', 'coCaptain', 'eliteHelper', 'strongHelper', 'waterCarrier'], roleIds);
  let captain = proportionalCounts.captain;
  let coCaptain = proportionalCounts.coCaptain;

  if (rosterSize > 0 && captain === 0) {
    captain = 1;
  }

  if (captain + coCaptain > rosterSize) {
    const overflow = captain + coCaptain - rosterSize;
    const reducedCoCaptain = Math.max(0, coCaptain - overflow);
    const stillOverflow = overflow - (coCaptain - reducedCoCaptain);
    coCaptain = reducedCoCaptain;
    if (stillOverflow > 0) {
      captain = Math.max(1, captain - stillOverflow);
    }
  }

  return { captain, coCaptain };
}

function resolveHelperRoleCounts(helperRosterSize) {
  const counts = resolveProportionalCounts(helperRosterSize, ['eliteHelper', 'strongHelper', 'waterCarrier'], roleIds);
  if (helperRosterSize > 0 && counts.eliteHelper + counts.strongHelper + counts.waterCarrier === 0) {
    counts.waterCarrier = helperRosterSize;
  }
  return counts;
}

function assignRoleSlice(assignments, sortedRoster, startIndex, count, roleId) {
  let cursor = startIndex;
  const slice = sortedRoster.slice(startIndex, startIndex + count);
  for (const rider of slice) {
    assignments.set(rider.id, roleId);
    cursor += 1;
  }
  return cursor;
}

function assignRolesForRoster(roster) {
  if (roster.length === 0) return;

  const assignments = new Map();

  // 1. Sort by leadership
  const leadershipRoster = [...roster].sort(compareLeadership);
  const leadershipCounts = resolveLeadershipRoleCounts(roster.length);

  // Assign Captains first (from all riders)
  let assignedCaptains = 0;
  for (const rider of leadershipRoster) {
    if (assignedCaptains < leadershipCounts.captain) {
      assignments.set(rider.id, roleIds.captain.id);
      assignedCaptains++;
    }
  }

  // 2. Sort sprinter candidates (sprint skill >= 73)
  const allSprinterCandidates = roster
    .filter((rider) => rider.skill_sprint >= 73)
    .sort(compareSprint);

  // Assign up to 3 sprinters (skipping already assigned captains)
  let assignedSprinters = 0;
  for (const sprinter of allSprinterCandidates) {
    if (assignments.has(sprinter.id)) continue;
    if (assignedSprinters < 3) {
      assignments.set(sprinter.id, roleIds.sprinter.id);
      assignedSprinters++;
    }
  }

  // 3. Assign Co-Captains (next leadership counts, skipping already assigned captains and sprinters)
  let assignedCoCaptains = 0;
  for (const rider of leadershipRoster) {
    if (assignments.has(rider.id)) continue;
    if (assignedCoCaptains < leadershipCounts.coCaptain) {
      assignments.set(rider.id, roleIds.coCaptain.id);
      assignedCoCaptains++;
    }
  }

  // 4. Assign helper roles to remaining unassigned riders
  const helperRoster = roster
    .filter((rider) => !assignments.has(rider.id))
    .sort(compareLeadership);

  const helperCounts = resolveHelperRoleCounts(helperRoster.length);

  let helperCursor = 0;
  helperCursor = assignRoleSlice(assignments, helperRoster, helperCursor, helperCounts.eliteHelper, roleIds.eliteHelper.id);
  helperCursor = assignRoleSlice(assignments, helperRoster, helperCursor, helperCounts.strongHelper, roleIds.strongHelper.id);
  assignRoleSlice(assignments, helperRoster, helperCursor, helperCounts.waterCarrier, roleIds.waterCarrier.id);

  for (const rider of roster) {
    rider.role_id = assignments.get(rider.id) ?? roleIds.waterCarrier.id;
    rider.role_name = ROLE_NAMES[rider.role_id];
  }
}

// Program Rules Match Logic
function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function deterministicUnit(seed) {
  return hashString(seed) / 0xffffffff;
}

function ruleMatchesSpecs(rule, specs) {
  const ruleSpecs = [rule.spec_1, rule.spec_2, rule.spec_3].filter(id => id != null);
  return ruleSpecs.every(spec => specs.includes(spec));
}

function ruleSpecificity(rule) {
  return [rule.spec_1, rule.spec_2, rule.spec_3].filter(spec => spec != null).length;
}

function selectRulePool(rules, roleName, specs) {
  const matching = rules.filter((rule) => rule.role_name === roleName && ruleMatchesSpecs(rule, specs));
  if (matching.length > 0) {
    const maxSpecificity = Math.max(...matching.map(ruleSpecificity));
    return matching.filter((rule) => ruleSpecificity(rule) === maxSpecificity);
  }

  const fallback = rules.filter((rule) => rule.role_name === 'Wassertraeger' && ruleMatchesSpecs(rule, specs));
  if (fallback.length > 0) {
    const maxSpecificity = Math.max(...fallback.map(ruleSpecificity));
    return fallback.filter((rule) => ruleSpecificity(rule) === maxSpecificity);
  }

  return rules.filter((rule) => ruleSpecificity(rule) === 0);
}

function chooseProgramId(rules, seed) {
  const totalWeight = rules.reduce((sum, rule) => sum + Math.max(0, rule.probability), 0);
  if (totalWeight <= 0) {
    return null;
  }

  const target = deterministicUnit(seed) * totalWeight;
  let cursor = 0;
  const sorted = [...rules].sort((left, right) => left.id - right.id);
  for (const rule of sorted) {
    cursor += Math.max(0, rule.probability);
    if (target <= cursor) {
      return rule.program_id;
    }
  }

  return sorted[sorted.length - 1]?.program_id ?? null;
}

// Main Execution
function main() {
  console.log('Starting analysis of programs...');

  // Load and parse CSVs
  const dataDir = path.join(__dirname, '..', 'data', 'csv');
  console.log(`Reading CSVs from ${dataDir}...`);
  const teamsPath = path.join(dataDir, 'teams.csv');
  const ridersPath = path.join(dataDir, 'riders.csv');
  const rulesPath = path.join(dataDir, 'race_program_probability_rules.csv');
  const programsPath = path.join(dataDir, 'race_programs.csv');
  const typeRiderPath = path.join(dataDir, 'type_rider.csv');

  const teamsCsv = parseCsv(fs.readFileSync(teamsPath, 'utf8'));
  const ridersCsv = parseCsv(fs.readFileSync(ridersPath, 'utf8'));
  const rulesCsv = parseCsv(fs.readFileSync(rulesPath, 'utf8'));
  const programsCsv = parseCsv(fs.readFileSync(programsPath, 'utf8'));
  const typeRiderCsv = parseCsv(fs.readFileSync(typeRiderPath, 'utf8'));

  // Build spec name map
  const specNamesMap = {};
  for (const row of typeRiderCsv) {
    const id = parseInt(row.id);
    specNamesMap[id] = row.key;
  }

  // Filter WorldTour teams
  const worldTourTeams = teamsCsv.filter(t => t.division_name === 'WorldTour');
  const worldTourTeamIds = new Set(worldTourTeams.map(t => parseInt(t.team_id)));
  console.log(`Loaded ${worldTourTeams.length} WorldTour teams.`);

  // Parse all riders to determine global top 75 in the peloton
  const allRiders = [];
  for (const row of ridersCsv) {
    const rider = {
      id: parseInt(row.rider_id),
      first_name: row.first_name,
      last_name: row.last_name,
      team_id: row.team_id ? parseInt(row.team_id) : null,
      skill_flat: parseInt(row.skill_flat || 0),
      skill_mountain: parseInt(row.skill_mountain || 0),
      skill_medium_mountain: parseInt(row.skill_medium_mountain || 0),
      skill_hill: parseInt(row.skill_hill || 0),
      skill_time_trial: parseInt(row.skill_time_trial || 0),
      skill_prologue: parseInt(row.skill_prologue || 0),
      skill_cobble: parseInt(row.skill_cobble || 0),
      skill_sprint: parseInt(row.skill_sprint || 0),
      skill_acceleration: parseInt(row.skill_acceleration || 0),
      skill_downhill: parseInt(row.skill_downhill || 0),
      skill_attack: parseInt(row.skill_attack || 0),
      skill_stamina: parseInt(row.skill_stamina || 0),
      skill_resistance: parseInt(row.skill_resistance || 0),
      skill_recuperation: parseInt(row.skill_recuperation || 0),
    };

    rider.bike_handling = calcBikeHandling(rider);
    rider.overall_rating = calcOverall(rider);
    rider.specs = resolveBestSpecIds(rider, rider.bike_handling);
    allRiders.push(rider);
  }

  // Sort global peloton to get top 75
  const sortedPeloton = [...allRiders].sort((a, b) => (b.overall_rating - a.overall_rating) || (a.id - b.id));
  const top75RiderIds = new Set(sortedPeloton.slice(0, 75).map(r => r.id));

  // Filter WorldTour team riders for role & program analysis
  const riders = allRiders.filter(r => worldTourTeamIds.has(r.team_id));
  console.log(`Loaded ${riders.length} WorldTour team riders. Global Top 75 set size: ${top75RiderIds.size}`);

  // Group by team and assign roles
  const ridersByTeam = new Map();
  for (const rider of riders) {
    if (!ridersByTeam.has(rider.team_id)) {
      ridersByTeam.set(rider.team_id, []);
    }
    ridersByTeam.get(rider.team_id).push(rider);
  }

  for (const teamRiders of ridersByTeam.values()) {
    assignRolesForRoster(teamRiders);
  }

  // Determine best sprinter and team sorted order for program exceptions
  const bestSprinterByTeam = new Map();
  for (const [teamId, teamRiders] of ridersByTeam.entries()) {
    // Sort team riders by overall descending, id ascending
    teamRiders.sort((a, b) => (b.overall_rating - a.overall_rating) || (a.id - b.id));
    const sprinters = teamRiders.filter(r => r.role_name === 'Sprinter');
    if (sprinters.length > 0) {
      bestSprinterByTeam.set(teamId, sprinters[0].id);
    }
  }

  // Build programs mapping
  const programsMap = new Map();
  const programsList = [];
  for (const row of programsCsv) {
    const prog = {
      id: parseInt(row.id),
      name: row.name
    };
    programsMap.set(prog.id, prog.name);
    programsMap.set(prog.name, prog.id);
    programsList.push(prog);
  }

  // Parse Rules Matrix
  const rules = [];
  let ruleIdCounter = 1;
  const ruleCombinationsSet = new Set();

  for (const row of rulesCsv) {
    const roleName = row.role_name;
    const spec1 = parseInt(row.spec_1);
    const spec2 = parseInt(row.spec_2);
    const spec3 = parseInt(row.spec_3);
    const specs = [spec1, spec2, spec3].sort((a, b) => a - b);
    const comboKey = `${roleName}|${specs[0]}|${specs[1]}|${specs[2]}`;
    ruleCombinationsSet.add(comboKey);

    for (const program of programsList) {
      const probValue = parseFloat(row[program.name] || '0');
      rules.push({
        id: ruleIdCounter++,
        role_name: roleName,
        spec_1: specs[0],
        spec_2: specs[1],
        spec_3: specs[2],
        program_id: program.id,
        probability: probValue
      });
    }
  }

  // Counts of combinations found among riders
  const riderCombinationCounts = {};
  for (const rider of riders) {
    const comboKey = `${rider.role_name}|${rider.specs[0]}|${rider.specs[1]}|${rider.specs[2]}`;
    riderCombinationCounts[comboKey] = (riderCombinationCounts[comboKey] || 0) + 1;
  }

  // CSV 1: Combinations Analysis
  // We want to list every possible combination from the rules and also any found in riders.
  // The possible roles are the 6 standard roles, and all combinations of 3 specs out of 6.
  const allCombinations = [];
  const roles = Object.values(ROLE_NAMES);
  
  // Generate all 3-combinations from [1..6]
  const specCombos = [];
  for (let i = 1; i <= 6; i++) {
    for (let j = i + 1; j <= 6; j++) {
      for (let k = j + 1; k <= 6; k++) {
        specCombos.push([i, j, k]);
      }
    }
  }

  for (const role of roles) {
    for (const specCombo of specCombos) {
      const comboKey = `${role}|${specCombo[0]}|${specCombo[1]}|${specCombo[2]}`;
      const existsInRules = ruleCombinationsSet.has(comboKey);
      if (!existsInRules) continue;
      const riderCount = riderCombinationCounts[comboKey] || 0;
      allCombinations.push({
        role_name: role,
        spec_1: specCombo[0],
        spec_1_name: specNamesMap[specCombo[0]] || 'Unknown',
        spec_2: specCombo[1],
        spec_2_name: specNamesMap[specCombo[1]] || 'Unknown',
        spec_3: specCombo[2],
        spec_3_name: specNamesMap[specCombo[2]] || 'Unknown',
        exists_in_rules: 'true',
        rider_count: riderCount
      });
    }
  }

  // Also check if any rider has a combination not covered by standard generation (should not happen, but just in case)
  for (const comboKey in riderCombinationCounts) {
    const [role, s1, s2, s3] = comboKey.split('|');
    const spec1 = parseInt(s1);
    const spec2 = parseInt(s2);
    const spec3 = parseInt(s3);
    const alreadyAdded = allCombinations.some(c => c.role_name === role && c.spec_1 === spec1 && c.spec_2 === spec2 && c.spec_3 === spec3);
    if (!alreadyAdded) {
      const existsInRules = ruleCombinationsSet.has(comboKey);
      if (!existsInRules) continue;
      allCombinations.push({
        role_name: role,
        spec_1: spec1,
        spec_1_name: specNamesMap[spec1] || 'Unknown',
        spec_2: spec2,
        spec_2_name: specNamesMap[spec2] || 'Unknown',
        spec_3: spec3,
        spec_3_name: specNamesMap[spec3] || 'Unknown',
        exists_in_rules: 'true',
        rider_count: riderCombinationCounts[comboKey]
      });
    }
  }

  // Sort combinations by role name, spec_1, spec_2, spec_3
  allCombinations.sort((a, b) => {
    return a.role_name.localeCompare(b.role_name)
      || a.spec_1 - b.spec_1
      || a.spec_2 - b.spec_2
      || a.spec_3 - b.spec_3;
  });

  const debugDir = path.join(__dirname);
  if (!fs.existsSync(debugDir)) {
    fs.mkdirSync(debugDir, { recursive: true });
  }

  const csv1Path = path.join(debugDir, 'combinations_analysis.csv');
  let csv1Content = 'role_name;spec_1;spec_1_name;spec_2;spec_2_name;spec_3;spec_3_name;exists_in_rules;rider_count\n';
  for (const combo of allCombinations) {
    csv1Content += `${combo.role_name};${combo.spec_1};${combo.spec_1_name};${combo.spec_2};${combo.spec_2_name};${combo.spec_3};${combo.spec_3_name};${combo.exists_in_rules};${combo.rider_count}\n`;
  }
  fs.writeFileSync(csv1Path, csv1Content, 'utf8');
  console.log(`CSV 1 written to ${csv1Path}`);

  // Calculate Program Assignments (expected and deterministic)
  const expectedCounts = {};
  const deterministicCounts = {};
  for (const prog of programsList) {
    expectedCounts[prog.id] = 0;
    deterministicCounts[prog.id] = 0;
  }

  // To balance least-assigned programs in fallback, we track assignment counts dynamically during the loop.
  const deterministicAssignmentsMap = {};
  const expectedAssignmentsMap = {};
  for (const p of programsList) {
    deterministicAssignmentsMap[p.id] = 0;
    expectedAssignmentsMap[p.id] = 0;
  }

  // Initialize detailed tracking
  const expectedByRole = {};
  const deterministicByRole = {};
  const expectedByRoleSpec = {};
  const deterministicByRoleSpec = {};

  for (const prog of programsList) {
    expectedByRole[prog.id] = {};
    deterministicByRole[prog.id] = {};
    expectedByRoleSpec[prog.id] = {};
    deterministicByRoleSpec[prog.id] = {};

    for (const role of roles) {
      expectedByRole[prog.id][role] = 0;
      deterministicByRole[prog.id][role] = 0;

      expectedByRoleSpec[prog.id][role] = {};
      deterministicByRoleSpec[prog.id][role] = {};
      for (let s = 1; s <= 6; s++) {
        expectedByRoleSpec[prog.id][role][s] = 0;
        deterministicByRoleSpec[prog.id][role][s] = 0;
      }
    }
  }

  for (const rider of riders) {
    const roleName = rider.role_name;
    const specs = rider.specs;
    const teamId = rider.team_id;

    const teamRiders = ridersByTeam.get(teamId) || [];
    const isBestRider = teamRiders[0]?.id === rider.id;
    const isBestSprinter = bestSprinterByTeam.get(teamId) === rider.id;

    let rulePool;

    if (isBestSprinter) {
      rulePool = [
        { id: -1, role_name: 'Sprinter', spec_1: null, spec_2: null, spec_3: null, program_id: 2, probability: 50 },
        { id: -2, role_name: 'Sprinter', spec_1: null, spec_2: null, spec_3: null, program_id: 6, probability: 50 },
      ];
    } else {
      const excludedProgramIds = new Set();
      if (roleName === 'Kapitaen' || roleName === 'Co-Kapitaen') {
        [14, 15, 17, 18, 19, 20].forEach(id => excludedProgramIds.add(id));
      }
      const nonLeaderRiders = teamRiders.filter(
        r => r.role_name !== 'Kapitaen' && r.role_name !== 'Co-Kapitaen'
      );
      const nonLeaderIndex = nonLeaderRiders.findIndex(r => r.id === rider.id);
      if (nonLeaderIndex >= 0 && nonLeaderIndex <= 3) {
        [15, 18, 19, 20].forEach(id => excludedProgramIds.add(id));
      }

      if (roleName !== 'Wassertraeger' && roleName !== 'Starke Helfer') {
        [25, 26, 27, 28].forEach(id => excludedProgramIds.add(id));
      }

      if (isBestRider) {
        const bestRiderExclusions = [9, 10, 11, 12, 20, 25, 26, 27, 28];
        const combinedExclusions = new Set([...excludedProgramIds, ...bestRiderExclusions]);
        const filteredRules = rules.filter(r => !combinedExclusions.has(r.program_id));
        const tempRulePool = selectRulePool(filteredRules, roleName, specs);
        const totalWeight = tempRulePool.reduce((sum, rule) => sum + Math.max(0, rule.probability), 0);

        if (totalWeight > 0) {
          rulePool = tempRulePool;
        } else {
          const bestRiderExclusionsSet = new Set(bestRiderExclusions);
          if (roleName !== 'Wassertraeger' && roleName !== 'Starke Helfer') {
            [25, 26, 27, 28].forEach(id => bestRiderExclusionsSet.add(id));
          }
          const relaxedRules = rules.filter(r => !bestRiderExclusionsSet.has(r.program_id));
          rulePool = selectRulePool(relaxedRules, roleName, specs);
        }
      } else {
        const filteredRules = rules.filter(r => !excludedProgramIds.has(r.program_id));
        rulePool = selectRulePool(filteredRules, roleName, specs);
      }
    }

    const totalWeight = rulePool.reduce((sum, rule) => sum + Math.max(0, rule.probability), 0);
    const seed = `2026|${rider.id}|${roleName}|${specs.join('|')}`;
    const isTop75 = top75RiderIds.has(rider.id);

    // Filter candidate programs for fallback
    const allowedPrograms = programsList.filter(p => {
      if (isTop75) {
        const nameLower = p.name.toLowerCase();
        return nameLower.includes('tour') && !nameLower.includes('non_tour') && !nameLower.includes('non-tour');
      }
      return true;
    });
    const fallbackCandidates = allowedPrograms.length > 0 ? allowedPrograms : programsList;

    // Expected assignment distribution
    if (totalWeight > 0) {
      for (const rule of rulePool) {
        const p = Math.max(0, rule.probability) / totalWeight;
        expectedCounts[rule.program_id] = (expectedCounts[rule.program_id] || 0) + p;
        expectedAssignmentsMap[rule.program_id] += p;

        expectedByRole[rule.program_id][roleName] = (expectedByRole[rule.program_id][roleName] || 0) + p;
        expectedByRoleSpec[rule.program_id][roleName][specs[0]] = (expectedByRoleSpec[rule.program_id][roleName][specs[0]] || 0) + p;
      }
    } else {
      // Fallback
      const minCount = Math.min(...fallbackCandidates.map(c => expectedAssignmentsMap[c.id]));
      const bestCandidates = fallbackCandidates.filter(c => Math.abs(expectedAssignmentsMap[c.id] - minCount) < 0.0001);
      const p = 1.0 / bestCandidates.length;
      for (const c of bestCandidates) {
        expectedCounts[c.id] = (expectedCounts[c.id] || 0) + p;
        expectedAssignmentsMap[c.id] += p;

        expectedByRole[c.id][roleName] = (expectedByRole[c.id][roleName] || 0) + p;
        expectedByRoleSpec[c.id][roleName][specs[0]] = (expectedByRoleSpec[c.id][roleName][specs[0]] || 0) + p;
      }
    }

    // Deterministic assignment
    let chosenId = null;
    if (totalWeight > 0) {
      chosenId = chooseProgramId(rulePool, seed);
    } else {
      // Fallback: least assigned among candidates
      const minCount = Math.min(...fallbackCandidates.map(c => deterministicAssignmentsMap[c.id]));
      const bestCandidates = fallbackCandidates.filter(c => deterministicAssignmentsMap[c.id] === minCount);
      const idx = Math.floor(deterministicUnit(seed) * bestCandidates.length);
      chosenId = bestCandidates[idx].id;
    }

    if (chosenId != null) {
      deterministicCounts[chosenId] = (deterministicCounts[chosenId] || 0) + 1;
      deterministicAssignmentsMap[chosenId] += 1;

      deterministicByRole[chosenId][roleName] = (deterministicByRole[chosenId][roleName] || 0) + 1;
      deterministicByRoleSpec[chosenId][roleName][specs[0]] = (deterministicByRoleSpec[chosenId][roleName][specs[0]] || 0) + 1;
    }
  }

  // CSV 2: Program Distribution
  const csv2Path = path.join(debugDir, 'program_distribution.csv');

  const specNames = {
    1: 'Berg',
    2: 'Hill',
    3: 'Sprint',
    4: 'Timetrial',
    5: 'Cobble',
    6: 'Attacker'
  };

  const getCleanRole = (role) => role.replace(/\s+/g, '_').replace(/-/g, '_');

  let headers = ['program_id', 'program_name', 'program_id', 'expected_rider_count', 'deterministic_rider_count'];

  // Role headers
  for (const role of roles) {
    headers.push(`expected_role_${getCleanRole(role)}`);
  }
  for (const role of roles) {
    headers.push(`deterministic_role_${getCleanRole(role)}`);
  }

  // Spec headers for all roles
  const specRoles = roles;
  for (const role of specRoles) {
    for (let s = 1; s <= 6; s++) {
      headers.push(`expected_${getCleanRole(role)}_spec1_${specNames[s]}`);
    }
  }
  for (const role of specRoles) {
    for (let s = 1; s <= 6; s++) {
      headers.push(`deterministic_${getCleanRole(role)}_spec1_${specNames[s]}`);
    }
  }

  let csv2Content = headers.join(';') + '\n';
  for (const prog of programsList) {
    const rowCells = [];
    rowCells.push(prog.id);
    rowCells.push(prog.name);
    rowCells.push(prog.id);
    rowCells.push(Math.floor(expectedCounts[prog.id] || 0));
    rowCells.push(Math.floor(deterministicCounts[prog.id] || 0));

    // Expected roles
    for (const role of roles) {
      rowCells.push(Math.floor(expectedByRole[prog.id][role] || 0));
    }
    // Deterministic roles
    for (const role of roles) {
      rowCells.push(Math.floor(deterministicByRole[prog.id][role] || 0));
    }

    // Expected spec roles
    for (const role of specRoles) {
      for (let s = 1; s <= 6; s++) {
        rowCells.push(Math.floor(expectedByRoleSpec[prog.id][role][s] || 0));
      }
    }
    // Deterministic spec roles
    for (const role of specRoles) {
      for (let s = 1; s <= 6; s++) {
        rowCells.push(Math.floor(deterministicByRoleSpec[prog.id][role][s] || 0));
      }
    }

    csv2Content += rowCells.join(';') + '\n';
  }
  fs.writeFileSync(csv2Path, csv2Content, 'utf8');
  console.log(`CSV 2 written to ${csv2Path}`);

  // CSV 3: Deterministic Only Program Distribution
  const csv3Path = path.join(debugDir, 'program_distribution_deterministic.csv');
  let headersDet = ['program_id', 'program_name', 'program_id', 'deterministic_rider_count'];

  // Role headers
  for (const role of roles) {
    headersDet.push(`deterministic_role_${getCleanRole(role)}`);
  }

  // Spec headers for Kapitaen, Co-Kapitaen, Edelhelfer
  for (const role of specRoles) {
    for (let s = 1; s <= 6; s++) {
      headersDet.push(`deterministic_${getCleanRole(role)}_spec1_${specNames[s]}`);
    }
  }

  let csv3Content = headersDet.join(';') + '\n';
  for (const prog of programsList) {
    const rowCells = [];
    rowCells.push(prog.id);
    rowCells.push(prog.name);
    rowCells.push(prog.id);
    rowCells.push(Math.floor(deterministicCounts[prog.id] || 0));

    // Deterministic roles
    for (const role of roles) {
      rowCells.push(Math.floor(deterministicByRole[prog.id][role] || 0));
    }

    // Deterministic spec roles
    for (const role of specRoles) {
      for (let s = 1; s <= 6; s++) {
        rowCells.push(Math.floor(deterministicByRoleSpec[prog.id][role][s] || 0));
      }
    }

    csv3Content += rowCells.join(';') + '\n';
  }
  fs.writeFileSync(csv3Path, csv3Content, 'utf8');
  console.log(`CSV 3 written to ${csv3Path}`);

  let attackerCount = 0;
  for (const rider of riders) {
    if (rider.specs.includes(6)) {
      attackerCount++;
    }
  }
  console.log(`Number of riders with Attacker specialization in top 3: ${attackerCount}`);

  console.log('Analysis completed successfully!');
}

main();
