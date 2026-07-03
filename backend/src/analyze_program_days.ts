import * as fs from 'fs';
import * as path from 'path';

interface CSVRow {
  [key: string]: string;
}

function parseCSV(content: string): CSVRow[] {
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  const result: CSVRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: CSVRow = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    result.push(row);
  }
  return result;
}

async function run() {
  const csvDir = path.join(__dirname, '..', '..', 'data', 'csv');
  const programs = parseCSV(fs.readFileSync(path.join(csvDir, 'race_programs.csv'), 'utf8'));
  const programRaces = parseCSV(fs.readFileSync(path.join(csvDir, 'race_program_races.csv'), 'utf8'));
  const races = parseCSV(fs.readFileSync(path.join(csvDir, 'races.csv'), 'utf8'));

  // Map race ID to number of stages (race days)
  const raceDaysMap = new Map<number, { name: string, days: number }>();
  races.forEach(row => {
    const days = Number(row.number_of_stages) || 1;
    raceDaysMap.set(Number(row.id), {
      name: row.name,
      days: days
    });
  });

  // Calculate race days for each program
  const programDays: Array<{ id: number, name: string, totalDays: number, raceCount: number }> = [];

  programs.forEach(pRow => {
    const progId = Number(pRow.id);
    const name = pRow.name;

    const mappedRaces = programRaces.filter(row => Number(row.program_id) === progId);
    let totalDays = 0;
    mappedRaces.forEach(row => {
      const raceId = Number(row.race_id);
      const raceInfo = raceDaysMap.get(raceId);
      if (raceInfo) {
        totalDays += raceInfo.days;
      }
    });

    programDays.push({
      id: progId,
      name: name,
      totalDays: totalDays,
      raceCount: mappedRaces.length
    });
  });

  // Sort descending by totalDays
  programDays.sort((a, b) => b.totalDays - a.totalDays);

  console.log('=== SEASON PROGRAMS ANALYZED BY RACE DAYS (DESCENDING) ===');
  programDays.forEach((p, idx) => {
    console.log(`${idx + 1}. [ID: ${p.id}] "${p.name}"`);
    console.log(`   -> Total Race Days: ${p.totalDays} days (${p.raceCount} races)\n`);
  });
}

run().catch(console.error);
