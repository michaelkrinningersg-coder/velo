const fs = require('fs');
const path = require('path');

const csvDir = path.join(__dirname, '..', 'data', 'csv');

// 1. Analyze riders.csv
const ridersContent = fs.readFileSync(path.join(csvDir, 'riders.csv'), 'utf8');
const riderLines = ridersContent.split(/\r?\n/).filter(line => line.trim().length > 0);
const riderHeaders = riderLines[0].split(';');
const riders = riderLines.slice(1).map(line => {
  const parts = line.split(';');
  const row = {};
  riderHeaders.forEach((h, i) => {
    row[h] = parts[i];
  });
  return row;
});

console.log('--- RIDERS CSV ANALYSIS ---');
console.log('Total riders in CSV:', riders.length);

const teamCountsCsv = {};
const noTeamRiders = [];
riders.forEach(r => {
  const tId = r.team_id ? parseInt(r.team_id, 10) : null;
  if (tId && tId >= 1 && tId <= 25) {
    teamCountsCsv[tId] = (teamCountsCsv[tId] || 0) + 1;
  } else {
    noTeamRiders.push(r);
  }
});

console.log('Riders per team (1-25) in CSV:');
let totalAssigned = 0;
for (let i = 1; i <= 25; i++) {
  const count = teamCountsCsv[i] || 0;
  console.log(`  Team ${i}: ${count} riders`);
  totalAssigned += count;
}
console.log('Total assigned to teams (1-25):', totalAssigned);
console.log('Riders without tier 1 team (1-25):', noTeamRiders.length);
