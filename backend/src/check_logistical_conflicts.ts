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
  const countries = parseCSV(fs.readFileSync(path.join(csvDir, 'country.csv'), 'utf8'));

  // Map country ID to name
  const countryMap = new Map<number, string>();
  countries.forEach(row => {
    countryMap.set(Number(row.id), row.name);
  });

  // Map race ID to details
  const raceMap = new Map<number, { name: string, country_id: number, country_name: string, start_date: string, end_date: string }>();
  races.forEach(row => {
    const countryId = Number(row.country_id);
    raceMap.set(Number(row.id), {
      name: row.name,
      country_id: countryId,
      country_name: countryMap.get(countryId) || `Country ${countryId}`,
      start_date: row.start_date,
      end_date: row.end_date
    });
  });

  const programToRaces = new Map<number, number[]>();
  programRaces.forEach(row => {
    const progId = Number(row.program_id);
    const raceId = Number(row.race_id);
    const list = programToRaces.get(progId) ?? [];
    list.push(raceId);
    programToRaces.set(progId, list);
  });

  console.log('=== LOGISTICAL CHECK: BACK-TO-BACK RACES IN DIFFERENT COUNTRIES ===\n');

  programs.forEach(pRow => {
    const progId = Number(pRow.id);
    const name = pRow.name;
    const raceIds = programToRaces.get(progId) ?? [];
    const programRacesList = raceIds.map(id => ({ id, ...raceMap.get(id) })).filter((r): r is any => !!r);

    // Sort by start date
    programRacesList.sort((a, b) => a.start_date.localeCompare(b.start_date));

    // Check back-to-back race gaps
    for (let i = 0; i < programRacesList.length - 1; i++) {
      const r1 = programRacesList[i];
      const r2 = programRacesList[i + 1];

      const end1 = new Date(r1.end_date);
      const start2 = new Date(r2.start_date);

      // Gap in days
      const gapMs = start2.getTime() - end1.getTime();
      const gapDays = Math.round(gapMs / (1000 * 60 * 60 * 24));

      // We look for gaps of 1 day (next day start) or 2 days
      if (gapDays >= 1 && gapDays <= 2) {
        if (r1.country_id !== r2.country_id) {
          console.log(`Program: "${name}" (ID: ${progId})`);
          console.log(`  -> back-to-back: "${r1.name}" in ${r1.country_name} (ends ${r1.end_date})`);
          console.log(`     and "${r2.name}" in ${r2.country_name} (starts ${r2.start_date})`);
          console.log(`     Gap: ${gapDays} day(s)\n`);
        }
      }
    }
  });

  console.log('=== LOGISTICAL CHECK: COUNTRY TRAVEL DENSITY (SPRING: JAN-APR) ===\n');

  programs.forEach(pRow => {
    const progId = Number(pRow.id);
    const name = pRow.name;
    const raceIds = programToRaces.get(progId) ?? [];
    const programRacesList = raceIds.map(id => ({ id, ...raceMap.get(id) })).filter((r): r is any => !!r);

    // Filter to Jan-Apr
    const springRaces = programRacesList.filter(r => {
      const start = r.start_date;
      return start.startsWith('2026-01-') || start.startsWith('2026-02-') || start.startsWith('2026-03-') || start.startsWith('2026-04-');
    });

    // Sort by start date
    springRaces.sort((a, b) => a.start_date.localeCompare(b.start_date));

    // Find country sequence
    const countriesVisited: string[] = [];
    springRaces.forEach(r => {
      countriesVisited.push(r.country_name);
    });

    // Count transitions of country (excluding consecutive duplicates)
    let transitions = 0;
    for (let i = 0; i < countriesVisited.length - 1; i++) {
      if (countriesVisited[i] !== countriesVisited[i + 1]) {
        transitions++;
      }
    }

    if (transitions >= 6) {
      console.log(`Program: "${name}" (ID: ${progId}) has high country travel density in spring:`);
      console.log(`  -> Path: ${countriesVisited.join(' -> ')}`);
      console.log(`  -> Transitions: ${transitions}\n`);
    }
  });
}

run().catch(console.error);
