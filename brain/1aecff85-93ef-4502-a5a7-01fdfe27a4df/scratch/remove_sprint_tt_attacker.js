const fs = require('fs');
const path = require('path');

const csvPath = 'c:\\Users\\mkrinninger\\Downloads\\velo-feature-riderdevelopment\\data\\csv\\race_program_probability_rules.csv';
const content = fs.readFileSync(csvPath, 'utf8');

const lines = content.split('\n');
const headers = lines[0];
const dataLines = lines.slice(1).filter(line => line.trim().length > 0);

const filtered = [];
let idCounter = 1;

for (const line of dataLines) {
  const parts = line.split(',');
  const spec1 = parts[2];
  const spec2 = parts[3];
  const spec3 = parts[4];
  
  // check if specs are 3, 4, 6
  if (spec1 === '3' && spec2 === '4' && spec3 === '6') {
    console.log(`Removing row: ${line}`);
    continue;
  }
  
  parts[0] = idCounter++;
  filtered.push(parts.join(','));
}

const newContent = [headers, ...filtered, ''].join('\n');
fs.writeFileSync(csvPath, newContent, 'utf8');
console.log(`Successfully updated CSV. Total rows left: ${filtered.length}`);
