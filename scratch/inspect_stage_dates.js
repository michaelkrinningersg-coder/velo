const fs = require('fs');
const path = require('path');

const csvDir = path.join(__dirname, '..', 'data', 'csv');
const racesPath = path.join(csvDir, 'races.csv');
const stagesPath = path.join(csvDir, 'stages.csv');

function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    // Basic CSV line parser (handles quotes)
    const cells = [];
    let inQuotes = false;
    let current = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cells.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    cells.push(current);
    
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cells[idx] ? cells[idx].replace(/^"|"$/g, '') : '';
    });
    return row;
  });
}

const races = parseCsv(racesPath);
const stages = parseCsv(stagesPath);

const racesMap = new Map();
races.forEach(r => {
  racesMap.set(r.id, r);
});

// Group stages by race_id
const stagesByRace = new Map();
stages.forEach(s => {
  if (!stagesByRace.has(s.race_id)) {
    stagesByRace.set(s.race_id, []);
  }
  stagesByRace.get(s.race_id).push(s);
});

console.log('Mismatches report:');
for (const [raceId, raceStages] of stagesByRace.entries()) {
  const race = racesMap.get(raceId);
  if (!race) {
    console.log(`Race ID ${raceId} not found in races.csv!`);
    continue;
  }
  
  // Sort stages by stage_number
  raceStages.sort((a, b) => parseInt(a.stage_number, 10) - parseInt(b.stage_number, 10));
  
  const numStages = parseInt(race.number_of_stages, 10);
  const isStageRace = parseInt(race.is_stage_race, 10) === 1;
  
  const firstStage = raceStages[0];
  const lastStage = raceStages[raceStages.length - 1];
  
  let mismatch = false;
  let detail = '';
  
  if (!isStageRace || numStages === 1) {
    // One day classic
    if (raceStages.length !== 1) {
      detail += `Expected 1 stage, found ${raceStages.length}. `;
      mismatch = true;
    }
    if (firstStage.date !== race.start_date) {
      detail += `Date mismatch: stage date is ${firstStage.date}, race start_date is ${race.start_date}. `;
      mismatch = true;
    }
  } else {
    // Stage race
    if (raceStages.length !== numStages) {
      detail += `Expected ${numStages} stages, found ${raceStages.length}. `;
      mismatch = true;
    }
    if (firstStage.date !== race.start_date) {
      detail += `Stage 1 date mismatch: stage date is ${firstStage.date}, race start_date is ${race.start_date}. `;
      mismatch = true;
    }
    if (lastStage.date !== race.end_date) {
      detail += `Stage ${lastStage.stage_number} date mismatch: stage date is ${lastStage.date}, race end_date is ${race.end_date}. `;
      mismatch = true;
    }
  }
  
  if (mismatch) {
    console.log(`Race: "${race.name}" (ID: ${raceId})`);
    console.log(`  Race dates: ${race.start_date} to ${race.end_date}. Stages: ${numStages}.`);
    console.log(`  Issues: ${detail}`);
    console.log(`  Stage dates: ${raceStages.map(s => `${s.stage_number}:${s.date}`).join(', ')}`);
  }
}
