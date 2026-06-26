const fs = require('fs');
const path = require('path');

const csvDir = path.join(__dirname, '..', 'data', 'csv');
const stagesPath = path.join(csvDir, 'stages.csv');

// Read the stages CSV file
const content = fs.readFileSync(stagesPath, 'utf8');
const lines = content.split(/\r?\n/);
if (lines.length === 0) {
  console.error('stages.csv is empty');
  process.exit(1);
}

const headers = lines[0].split(',');
const raceIdIdx = headers.indexOf('race_id');
const stageNumIdx = headers.indexOf('stage_number');
const dateIdx = headers.indexOf('date');

function parseLine(line) {
  const cells = [];
  let inQuotes = false;
  let current = '';
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

// Generate dates for Grand Tours with Monday rest days
function getGrandTourDate(startDateStr, stageNumber, restDays) {
  const start = new Date(startDateStr);
  let current = new Date(start);
  let stageCount = 1;
  while (stageCount < stageNumber) {
    current.setDate(current.getDate() + 1);
    const dateStr = current.toISOString().split('T')[0];
    if (restDays.includes(dateStr)) {
      // It's a rest day, skip it
      continue;
    }
    stageCount++;
  }
  return current.toISOString().split('T')[0];
}

const newLines = [lines[0]];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const cells = parseLine(line);
  const raceId = cells[raceIdIdx];
  const stageNumber = parseInt(cells[stageNumIdx], 10);
  
  // 1. Santos Tour Down Under (ID 1)
  if (raceId === '1') {
    if (stageNumber === 7 || stageNumber === 8) {
      console.log(`Deleting stage ${stageNumber} record for Santos Tour Down Under`);
      continue; // Skip stages 7 and 8
    }
    // Update dates for stages 1-6 to run consecutively Jan 20 to Jan 25
    // Jan 20 is start_date, Jan 25 is end_date.
    const start = new Date('2026-01-20');
    start.setDate(start.getDate() + (stageNumber - 1));
    const newDate = start.toISOString().split('T')[0];
    console.log(`Updating TDU stage ${stageNumber} date to ${newDate}`);
    cells[dateIdx] = newDate;
  }
  
  // 2. Mapei Cadel Evans (ID 4)
  else if (raceId === '4') {
    console.log(`Updating Cadel Evans stage ${stageNumber} date to 2026-02-01`);
    cells[dateIdx] = '2026-02-01';
  }
  
  // 3. UAE Tour (ID 10)
  else if (raceId === '10') {
    const start = new Date('2026-02-16');
    start.setDate(start.getDate() + (stageNumber - 1));
    const newDate = start.toISOString().split('T')[0];
    console.log(`Updating UAE Tour stage ${stageNumber} date to ${newDate}`);
    cells[dateIdx] = newDate;
  }
  
  // 4. In Flanders Fields (ID 45)
  else if (raceId === '45') {
    console.log(`Updating In Flanders Fields stage ${stageNumber} date to 2026-03-29`);
    cells[dateIdx] = '2026-03-29';
  }
  
  // 5. Tour de France (ID 55)
  else if (raceId === '55') {
    const restDays = ['2026-07-13', '2026-07-20'];
    const newDate = getGrandTourDate('2026-07-04', stageNumber, restDays);
    console.log(`Updating Tour de France stage ${stageNumber} date to ${newDate}`);
    cells[dateIdx] = newDate;
  }
  
  // 6. La Vuelta (ID 60)
  else if (raceId === '60') {
    const restDays = ['2026-08-31', '2026-09-07'];
    const newDate = getGrandTourDate('2026-08-22', stageNumber, restDays);
    console.log(`Updating La Vuelta stage ${stageNumber} date to ${newDate}`);
    cells[dateIdx] = newDate;
  }
  
  newLines.push(cells.join(','));
}

// Write the updated lines back to stages.csv
fs.writeFileSync(stagesPath, newLines.join('\n') + '\n', 'utf8');
console.log('Successfully updated stages.csv');
