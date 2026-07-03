const fs = require('fs');
const path = require('path');

const ridersPath = path.join(__dirname, '..', 'data', 'csv', 'riders.csv');
const contractsPath = path.join(__dirname, '..', 'data', 'csv', 'contracts.csv');

if (!fs.existsSync(ridersPath) || !fs.existsSync(contractsPath)) {
  console.error('Error: CSV files not found!');
  process.exit(1);
}

// 1. Check riders.csv
const ridersContent = fs.readFileSync(ridersPath, 'utf8');
const ridersLines = ridersContent.split(/\r?\n/);
const ridersHeader = ridersLines[0].split(';');
const colIdx = {};
ridersHeader.forEach((col, idx) => {
  colIdx[col] = idx;
});

const riders = [];
const teamCounts = {};
for (let i = 1; i < 26; i++) {
  teamCounts[i] = 0;
}

for (let i = 1; i < ridersLines.length; i++) {
  const line = ridersLines[i].trim();
  if (!line) continue;
  const cols = line.split(';');
  const riderId = cols[colIdx['rider_id']];
  const teamIdStr = cols[colIdx['team_id']];
  const teamId = teamIdStr ? parseInt(teamIdStr.trim(), 10) : null;

  riders.push({ riderId, teamId });
  if (teamId != null && teamId >= 1 && teamId <= 25) {
    teamCounts[teamId]++;
  }
}

console.log('Riders per WT Team (expected 40):');
let allCorrect = true;
for (let tId = 1; tId <= 25; tId++) {
  console.log(`  - Team ID ${tId}: ${teamCounts[tId]} riders`);
  if (teamCounts[tId] !== 40) {
    allCorrect = false;
  }
}

if (!allCorrect) {
  console.error('Error: Not all WorldTour teams have exactly 40 riders!');
  process.exit(1);
} else {
  console.log('Success: All 25 WorldTour teams have exactly 40 riders.');
}

// 2. Check contracts.csv
const contractsContent = fs.readFileSync(contractsPath, 'utf8');
const contractsLines = contractsContent.split(/\r?\n/);
const activeContracts = new Set();

for (let i = 1; i < contractsLines.length; i++) {
  const line = contractsLines[i].trim();
  if (!line) continue;
  const [riderId, teamId, startSeason, endSeason, status] = line.split(',');
  if (status === 'active' && parseInt(teamId, 10) >= 1 && parseInt(teamId, 10) <= 25) {
    activeContracts.add(riderId);
  }
}

let missingContractsCount = 0;
riders.forEach(r => {
  if (r.teamId != null && r.teamId >= 1 && r.teamId <= 25) {
    if (!activeContracts.has(r.riderId)) {
      console.error(`Error: Rider ID ${r.riderId} is assigned to team ${r.teamId} but has no active contract in contracts.csv!`);
      missingContractsCount++;
    }
  }
});

if (missingContractsCount > 0) {
  console.error(`Verification FAILED: ${missingContractsCount} riders are missing contracts.`);
  process.exit(1);
} else {
  console.log('Success: All assigned WorldTour riders have active contracts in contracts.csv.');
}
