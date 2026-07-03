const fs = require('fs');
const path = require('path');

const ridersPath = path.join(__dirname, '..', 'data', 'csv', 'riders.csv');
const contractsPath = path.join(__dirname, '..', 'data', 'csv', 'contracts.csv');

console.log('Riders CSV path:', ridersPath);
console.log('Contracts CSV path:', contractsPath);

if (!fs.existsSync(ridersPath) || !fs.existsSync(contractsPath)) {
  console.error('Error: CSV files not found!');
  process.exit(1);
}

// Helper to parse integer safely
function int(val) {
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? 0 : parsed;
}

// Helper to compute provisional overall strength (same as backend provisionalOverall)
function getStrength(row) {
  const sum = int(row.skill_flat) +
    int(row.skill_mountain) +
    int(row.skill_medium_mountain) +
    int(row.skill_hill) +
    int(row.skill_time_trial) +
    int(row.skill_cobble) +
    int(row.skill_sprint) * 1.2 +
    int(row.skill_stamina) +
    int(row.skill_resistance) +
    int(row.skill_recuperation) +
    int(row.skill_acceleration);
  return sum / 11.2;
}

// 1. Read and parse riders.csv
const ridersContent = fs.readFileSync(ridersPath, 'utf8');
const ridersLines = ridersContent.split(/\r?\n/);
const ridersHeader = ridersLines[0];
const ridersHeaderCols = ridersHeader.split(';');

// Map header columns to indexes
const colIdx = {};
ridersHeaderCols.forEach((col, idx) => {
  colIdx[col] = idx;
});

const ridersRows = [];
for (let i = 1; i < ridersLines.length; i++) {
  const line = ridersLines[i].trim();
  if (!line) continue;
  const cols = line.split(';');
  ridersRows.push({
    lineIndex: i,
    cols: cols,
    riderId: cols[colIdx['rider_id']],
    firstName: cols[colIdx['first_name']],
    lastName: cols[colIdx['last_name']],
    teamId: cols[colIdx['team_id']],
    skill_flat: cols[colIdx['skill_flat']],
    skill_mountain: cols[colIdx['skill_mountain']],
    skill_medium_mountain: cols[colIdx['skill_medium_mountain']],
    skill_hill: cols[colIdx['skill_hill']],
    skill_time_trial: cols[colIdx['skill_time_trial']],
    skill_prologue: cols[colIdx['skill_prologue']],
    skill_cobble: cols[colIdx['skill_cobble']],
    skill_sprint: cols[colIdx['skill_sprint']],
    skill_stamina: cols[colIdx['skill_stamina']],
    skill_resistance: cols[colIdx['skill_resistance']],
    skill_recuperation: cols[colIdx['skill_recuperation']],
    skill_acceleration: cols[colIdx['skill_acceleration']],
  });
}

console.log(`Parsed ${ridersRows.length} riders from CSV.`);

// 2. Filter free agents (teamId is empty or not in 1-25)
const freeAgents = ridersRows.filter(r => !r.teamId || r.teamId.trim() === '');
console.log(`Found ${freeAgents.length} free agent riders.`);

// 3. Compute strength and sort
freeAgents.forEach(r => {
  r.strength = getStrength(r);
});

// Sort descending by strength
freeAgents.sort((a, b) => b.strength - a.strength || int(a.riderId) - int(b.riderId));

const top200 = freeAgents.slice(0, 200);
console.log('Top 5 strongest free agents to assign:');
top200.slice(0, 5).forEach(r => {
  console.log(`  - ID ${r.riderId}: ${r.firstName} ${r.lastName} (Strength: ${r.strength.toFixed(2)})`);
});

// 4. Create team pool (8 slots per team for teams 1-25)
const teamPool = [];
for (let tId = 1; tId <= 25; tId++) {
  for (let slot = 0; slot < 8; slot++) {
    teamPool.push(tId);
  }
}

// Shuffle the pool (Fisher-Yates)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
shuffle(teamPool);

// 5. Assign teams to the top 200 riders
top200.forEach((rider, idx) => {
  const assignedTeamId = teamPool[idx];
  rider.cols[colIdx['team_id']] = String(assignedTeamId);
  rider.teamId = String(assignedTeamId); // Keep in memory too
});

// 6. Write back riders.csv
// Detect original line endings
const hasCarriageReturn = ridersContent.includes('\r\n');
const lineEnding = hasCarriageReturn ? '\r\n' : '\n';

const updatedRidersContent = [ridersHeader]
  .concat(ridersRows.map(r => r.cols.join(';')))
  .join(lineEnding) + lineEnding;

fs.writeFileSync(ridersPath, updatedRidersContent, 'utf8');
console.log('Successfully updated riders.csv.');

// 7. Parse current contracts to see what is already there
const contractsContent = fs.readFileSync(contractsPath, 'utf8');
const contractsLines = contractsContent.split(/\r?\n/);
while (contractsLines.length > 0 && !contractsLines[contractsLines.length - 1].trim()) {
  contractsLines.pop();
}

const existingContractRiders = new Set();
for (let i = 1; i < contractsLines.length; i++) {
  const line = contractsLines[i].trim();
  if (!line) continue;
  const [riderId, teamId, startSeason, endSeason, status] = line.split(',');
  if (status === 'active' && parseInt(teamId, 10) >= 1 && parseInt(teamId, 10) <= 25) {
    existingContractRiders.add(riderId);
  }
}

// Find riders currently assigned to teams 1-25 who do not have an active contract in contracts.csv
let addedContractsCount = 0;
ridersRows.forEach(rider => {
  const teamId = rider.teamId ? parseInt(rider.teamId.trim(), 10) : null;
  if (teamId != null && teamId >= 1 && teamId <= 25) {
    if (!existingContractRiders.has(rider.riderId)) {
      contractsLines.push(`${rider.riderId},${teamId},2026,2028,active`);
      addedContractsCount++;
    }
  }
});

const updatedContractsContent = contractsLines.join(lineEnding) + lineEnding;
fs.writeFileSync(contractsPath, updatedContractsContent, 'utf8');
console.log(`Successfully added/repaired ${addedContractsCount} contracts in contracts.csv (200 new riders + any originally missing).`);
