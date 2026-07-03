const fs = require('fs');
const path = require('path');

const ridersPath = path.join(__dirname, '..', 'data', 'csv', 'riders.csv');
const contractsPath = path.join(__dirname, '..', 'data', 'csv', 'contracts.csv');

// 1. Read riders.csv
const ridersContent = fs.readFileSync(ridersPath, 'utf8');
const ridersLines = ridersContent.split(/\r?\n/);
const ridersHeader = ridersLines[0].split(';');
const colIdx = {};
ridersHeader.forEach((col, idx) => {
  colIdx[col] = idx;
});

const riders = [];
const teamCounts = {};
for (let i = 1; i <= 25; i++) {
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

let totalOriginalRiders = 0;
for (let tId = 1; tId <= 25; tId++) {
  totalOriginalRiders += teamCounts[tId];
}
console.log(`Original total riders in WT teams: ${totalOriginalRiders}`);

// 2. Read contracts.csv
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

console.log(`Original active WT contracts: ${activeContracts.size}`);

let missingContractsCount = 0;
riders.forEach(r => {
  if (r.teamId != null && r.teamId >= 1 && r.teamId <= 25) {
    if (!activeContracts.has(r.riderId)) {
      missingContractsCount++;
    }
  }
});

console.log(`Original riders in WT teams missing active WT contracts: ${missingContractsCount}`);
