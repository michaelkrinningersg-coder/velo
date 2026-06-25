const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, '..', '..', 'data', 'csv');

// Helper to read and parse CSV
function readCsv(filename) {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] || '';
    });
    return obj;
  });
}

// 1. Missing World Tour Races definition
const newRaces = [
  { id: '50', name: 'Volta Ciclista a Catalunya', country_id: '8', category_id: '4', is_stage_race: '1', number_of_stages: '7', start_date: '2026-03-23', end_date: '2026-03-29', prestige: '85' },
  { id: '51', name: 'Itzulia Basque Country', country_id: '8', category_id: '4', is_stage_race: '1', number_of_stages: '6', start_date: '2026-04-06', end_date: '2026-04-11', prestige: '83' },
  { id: '52', name: 'Tour de Romandie', country_id: '17', category_id: '4', is_stage_race: '1', number_of_stages: '6', start_date: '2026-04-28', end_date: '2026-05-03', prestige: '82' },
  { id: '53', name: 'Criterium du Dauphine', country_id: '3', category_id: '4', is_stage_race: '1', number_of_stages: '8', start_date: '2026-05-31', end_date: '2026-06-07', prestige: '88' },
  { id: '54', name: 'Tour de Suisse', country_id: '17', category_id: '4', is_stage_race: '1', number_of_stages: '8', start_date: '2026-06-07', end_date: '2026-06-14', prestige: '87' },
  { id: '55', name: 'Tour de France', country_id: '3', category_id: '1', is_stage_race: '1', number_of_stages: '21', start_date: '2026-07-04', end_date: '2026-07-26', prestige: '100' },
  { id: '56', name: 'Clasica de San Sebastian', country_id: '8', category_id: '7', is_stage_race: '0', number_of_stages: '1', start_date: '2026-07-25', end_date: '2026-07-25', prestige: '83' },
  { id: '57', name: 'Tour de Pologne', country_id: '30', category_id: '4', is_stage_race: '1', number_of_stages: '7', start_date: '2026-08-03', end_date: '2026-08-09', prestige: '80' },
  { id: '58', name: 'BEMER Cyclassics', country_id: '7', category_id: '7', is_stage_race: '0', number_of_stages: '1', start_date: '2026-08-16', end_date: '2026-08-16', prestige: '80' },
  { id: '59', name: 'Renewi Tour', country_id: '4', category_id: '4', is_stage_race: '1', number_of_stages: '5', start_date: '2026-08-24', end_date: '2026-08-28', prestige: '81' },
  { id: '60', name: 'Vuelta a Espana', country_id: '8', category_id: '2', is_stage_race: '1', number_of_stages: '21', start_date: '2026-08-22', end_date: '2026-09-13', prestige: '95' },
  { id: '61', name: 'Bretagne Classic - Ouest-France', country_id: '3', category_id: '7', is_stage_race: '0', number_of_stages: '1', start_date: '2026-08-30', end_date: '2026-08-30', prestige: '82' },
  { id: '62', name: 'Grand Prix Cycliste de Quebec', country_id: '22', category_id: '7', is_stage_race: '0', number_of_stages: '1', start_date: '2026-09-11', end_date: '2026-09-11', prestige: '83' },
  { id: '63', name: 'Grand Prix Cycliste de Montreal', country_id: '22', category_id: '7', is_stage_race: '0', number_of_stages: '1', start_date: '2026-09-13', end_date: '2026-09-13', prestige: '83' },
  { id: '64', name: 'Il Lombardia', country_id: '2', category_id: '3', is_stage_race: '0', number_of_stages: '1', start_date: '2026-10-10', end_date: '2026-10-10', prestige: '95' },
  { id: '65', name: 'Tour of Guangxi', country_id: '25', category_id: '4', is_stage_race: '1', number_of_stages: '6', start_date: '2026-10-13', end_date: '2026-10-18', prestige: '75' }
];

// Write races.csv
const existingRaces = readCsv('races.csv');
const allRacesMap = new Map();
existingRaces.forEach(r => allRacesMap.set(r.id, r));
newRaces.forEach(r => allRacesMap.set(r.id, r));
const finalRacesList = Array.from(allRacesMap.values()).sort((a,b) => parseInt(a.id) - parseInt(b.id));

const racesHeader = 'id,name,country_id,category_id,is_stage_race,number_of_stages,start_date,end_date,prestige';
const racesCsvContent = [racesHeader, ...finalRacesList.map(r => `${r.id},"${r.name}",${r.country_id},${r.category_id},${r.is_stage_race},${r.number_of_stages},${r.start_date},${r.end_date},${r.prestige}`)].join('\n') + '\n';
fs.writeFileSync(path.join(dataDir, 'races.csv'), racesCsvContent, 'utf8');
console.log('Saved races.csv with new UWT races!');

// Helper to format date
function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// 2. Missing Stages definition
const newStages = [];
let nextStageId = 200;

// Helper to generate a stage row
function makeStageRow(id, raceId, stageNum, date, profile, file) {
  return {
    id: String(id),
    race_id: String(raceId),
    stage_number: String(stageNum),
    date: date,
    profile: profile,
    start_elevation: '50',
    details_csv_file: file,
    final_spread_start_percent: '70',
    final_push_start_percent: '90',
    final_spread_difficulty_multiplier: '1',
    crash_incident_multiplier: '1',
    mechanical_incident_multiplier: '1',
    allowed_weather: '1|3'
  };
}

// 50: Volta Ciclista a Catalunya (7 stages)
const catStages = ['Flat', 'Rolling', 'Hilly', 'Medium_Mountain', 'Mountain', 'Hilly_Difficult', 'Hilly'];
const catFiles = ['dummy_flat_a.csv', 'dummy_rolling_a.csv', 'dummy_hilly_a.csv', 'dummy_medium_mountain_a.csv', 'dummy_mountain_a.csv', 'dummy_hilly_difficult_a.csv', 'dummy_hilly_b.csv'];
for (let i = 0; i < 7; i++) {
  newStages.push(makeStageRow(nextStageId++, 50, i + 1, addDays('2026-03-23', i), catStages[i], catFiles[i]));
}

// 51: Itzulia Basque Country (6 stages)
const basqueStages = ['ITT', 'Hilly', 'Hilly_Difficult', 'Rolling', 'Hilly_Difficult', 'Medium_Mountain'];
const basqueFiles = ['dummy_itt_b.csv', 'dummy_hilly_a.csv', 'dummy_hilly_difficult_a.csv', 'dummy_rolling_a.csv', 'dummy_hilly_difficult_b.csv', 'dummy_medium_mountain_b.csv'];
for (let i = 0; i < 6; i++) {
  newStages.push(makeStageRow(nextStageId++, 51, i + 1, addDays('2026-04-06', i), basqueStages[i], basqueFiles[i]));
}

// 52: Tour de Romandie (6 stages)
const romStages = ['ITT', 'Flat', 'Hilly', 'ITT', 'Mountain', 'Rolling'];
const romFiles = ['dummy_itt_a.csv', 'dummy_flat_a.csv', 'dummy_hilly_a.csv', 'dummy_itt_d.csv', 'dummy_mountain_b.csv', 'dummy_rolling_b.csv'];
for (let i = 0; i < 6; i++) {
  newStages.push(makeStageRow(nextStageId++, 52, i + 1, addDays('2026-04-28', i), romStages[i], romFiles[i]));
}

// 53: Criterium du Dauphine (8 stages)
const dauStages = ['Flat', 'Rolling', 'Hilly', 'ITT', 'Hilly_Difficult', 'Medium_Mountain', 'High_Mountain', 'Mountain'];
const dauFiles = ['dummy_flat_a.csv', 'dummy_rolling_a.csv', 'dummy_hilly_a.csv', 'dummy_itt_e.csv', 'dummy_hilly_difficult_a.csv', 'dummy_medium_mountain_a.csv', 'dummy_high_mountain_a.csv', 'dummy_mountain_a.csv'];
for (let i = 0; i < 8; i++) {
  newStages.push(makeStageRow(nextStageId++, 53, i + 1, addDays('2026-05-31', i), dauStages[i], dauFiles[i]));
}

// 54: Tour de Suisse (8 stages)
const suiStages = ['ITT', 'Flat', 'Rolling', 'Hilly', 'Mountain', 'High_Mountain', 'ITT', 'Hilly_Difficult'];
const suiFiles = ['dummy_itt_c.csv', 'dummy_flat_b.csv', 'dummy_rolling_b.csv', 'dummy_hilly_b.csv', 'dummy_mountain_c.csv', 'dummy_high_mountain_b.csv', 'dummy_itt_f.csv', 'dummy_hilly_difficult_c.csv'];
for (let i = 0; i < 8; i++) {
  newStages.push(makeStageRow(nextStageId++, 54, i + 1, addDays('2026-06-07', i), suiStages[i], suiFiles[i]));
}

// 55: Tour de France (21 stages)
const tdfStages = [
  'Flat', 'Rolling', 'Flat', 'Hilly', 'TTT', 'Hilly_Difficult', 'Flat', 'Rolling', 'ITT', 'Medium_Mountain',
  'Mountain', 'High_Mountain', 'Flat', 'Hilly', 'Mountain', 'Rolling', 'High_Mountain', 'Mountain', 'ITT', 'High_Mountain', 'Flat'
];
const tdfFiles = [
  'dummy_flat_a.csv', 'dummy_rolling_a.csv', 'dummy_flat_b.csv', 'dummy_hilly_a.csv', 'dummy_ttt_a.csv', 'dummy_hilly_difficult_a.csv', 'dummy_flat_c.csv', 'dummy_rolling_b.csv', 'dummy_itt_e.csv', 'dummy_medium_mountain_a.csv',
  'dummy_mountain_a.csv', 'dummy_high_mountain_a.csv', 'dummy_flat_a.csv', 'dummy_hilly_b.csv', 'dummy_mountain_b.csv', 'dummy_rolling_c.csv', 'dummy_high_mountain_c.csv', 'dummy_mountain_d.csv', 'dummy_itt_i.csv', 'dummy_high_mountain_e.csv', 'dummy_flat_b.csv'
];
for (let i = 0; i < 21; i++) {
  newStages.push(makeStageRow(nextStageId++, 55, i + 1, addDays('2026-07-04', i), tdfStages[i], tdfFiles[i]));
}

// 56: Clasica de San Sebastian (1 stage)
newStages.push(makeStageRow(nextStageId++, 56, 1, '2026-07-25', 'Hilly_Difficult', 'dummy_hilly_difficult_a.csv'));

// 57: Tour de Pologne (7 stages)
const polStages = ['Flat', 'Rolling', 'Hilly', 'ITT', 'Rolling', 'Hilly_Difficult', 'Flat'];
const polFiles = ['dummy_flat_b.csv', 'dummy_rolling_b.csv', 'dummy_hilly_b.csv', 'dummy_itt_d.csv', 'dummy_rolling_c.csv', 'dummy_hilly_difficult_b.csv', 'dummy_flat_a.csv'];
for (let i = 0; i < 7; i++) {
  newStages.push(makeStageRow(nextStageId++, 57, i + 1, addDays('2026-08-03', i), polStages[i], polFiles[i]));
}

// 58: BEMER Cyclassics (1 stage)
newStages.push(makeStageRow(nextStageId++, 58, 1, '2026-08-16', 'Flat', 'dummy_flat_a.csv'));

// 59: Renewi Tour (5 stages)
const renStages = ['Flat', 'ITT', 'Flat', 'Rolling', 'Cobble'];
const renFiles = ['dummy_flat_a.csv', 'dummy_itt_b.csv', 'dummy_flat_b.csv', 'dummy_rolling_a.csv', 'dummy_cobble_a.csv'];
for (let i = 0; i < 5; i++) {
  newStages.push(makeStageRow(nextStageId++, 59, i + 1, addDays('2026-08-24', i), renStages[i], renFiles[i]));
}

// 60: Vuelta a Espana (21 stages)
const vueStages = [
  'TTT', 'Flat', 'Hilly', 'Rolling', 'Hilly_Difficult', 'Flat', 'Rolling', 'Mountain', 'Mountain', 'Flat',
  'ITT', 'Hilly', 'Medium_Mountain', 'Mountain', 'High_Mountain', 'Rolling', 'Hilly_Difficult', 'Mountain', 'High_Mountain', 'ITT', 'Flat'
];
const vueFiles = [
  'dummy_ttt_b.csv', 'dummy_flat_a.csv', 'dummy_hilly_a.csv', 'dummy_rolling_a.csv', 'dummy_hilly_difficult_a.csv', 'dummy_flat_b.csv', 'dummy_rolling_b.csv', 'dummy_mountain_a.csv', 'dummy_mountain_b.csv', 'dummy_flat_c.csv',
  'dummy_itt_f.csv', 'dummy_hilly_b.csv', 'dummy_medium_mountain_b.csv', 'dummy_mountain_c.csv', 'dummy_high_mountain_b.csv', 'dummy_rolling_c.csv', 'dummy_hilly_difficult_b.csv', 'dummy_mountain_d.csv', 'dummy_high_mountain_d.csv', 'dummy_itt_j.csv', 'dummy_flat_a.csv'
];
for (let i = 0; i < 21; i++) {
  newStages.push(makeStageRow(nextStageId++, 60, i + 1, addDays('2026-08-22', i), vueStages[i], vueFiles[i]));
}

// 61: Bretagne Classic (1 stage)
newStages.push(makeStageRow(nextStageId++, 61, 1, '2026-08-30', 'Hilly', 'dummy_hilly_a.csv'));

// 62: GP Quebec (1 stage)
newStages.push(makeStageRow(nextStageId++, 62, 1, '2026-09-11', 'Hilly', 'dummy_hilly_b.csv'));

// 63: GP Montreal (1 stage)
newStages.push(makeStageRow(nextStageId++, 63, 1, '2026-09-13', 'Hilly_Difficult', 'dummy_hilly_difficult_b.csv'));

// 64: Il Lombardia (1 stage)
newStages.push(makeStageRow(nextStageId++, 64, 1, '2026-10-10', 'Mountain', 'dummy_mountain_b.csv'));

// 65: Tour of Guangxi (6 stages)
const guaStages = ['Flat', 'Flat', 'Rolling', 'Hilly', 'Rolling', 'Flat'];
const guaFiles = ['dummy_flat_a.csv', 'dummy_flat_b.csv', 'dummy_rolling_a.csv', 'dummy_hilly_a.csv', 'dummy_rolling_b.csv', 'dummy_flat_c.csv'];
for (let i = 0; i < 6; i++) {
  newStages.push(makeStageRow(nextStageId++, 65, i + 1, addDays('2026-10-13', i), guaStages[i], guaFiles[i]));
}

const existingStages = readCsv('stages.csv');
const allStagesMap = new Map();
existingStages.forEach(s => allStagesMap.set(s.id, s));
newStages.forEach(s => allStagesMap.set(s.id, s));
const finalStagesList = Array.from(allStagesMap.values()).sort((a,b) => parseInt(a.id) - parseInt(b.id));

const stagesHeader = 'id,race_id,stage_number,date,profile,start_elevation,details_csv_file,final_spread_start_percent,final_push_start_percent,final_spread_difficulty_multiplier,crash_incident_multiplier,mechanical_incident_multiplier,allowed_weather';
const stagesCsvContent = [stagesHeader, ...finalStagesList.map(s => `${s.id},${s.race_id},${s.stage_number},${s.date},${s.profile},${s.start_elevation},${s.details_csv_file},${s.final_spread_start_percent},${s.final_push_start_percent},${s.final_spread_difficulty_multiplier},${s.crash_incident_multiplier},${s.mechanical_incident_multiplier},"${s.allowed_weather}"`)].join('\n') + '\n';
fs.writeFileSync(path.join(dataDir, 'stages.csv'), stagesCsvContent, 'utf8');
console.log('Saved stages.csv with new stages!');

// 3. Generate race_programs.csv (114 programs)
const combosWith6Variants = [
  'SHP', 'HBS', 'SPH', 'HSB', 'HSP', 'BHS', 'BHT', 'HBP', 'PSH', 'BHP',
  'PHS', 'HPS', 'AOO', 'OOO'
];

const combosWith3Variants = [
  'HPB', 'TPH', 'HBT', 'PST', 'PHB', 'PTH', 'SPT', 'TBH', 'HTB', 'BTH'
];

const raceProgramsList = [];
let programId = 1;

for (const combo of combosWith6Variants) {
  for (let variant = 1; variant <= 6; variant++) {
    raceProgramsList.push({
      id: String(programId++),
      name: `${combo}_${variant}`
    });
  }
}

for (const combo of combosWith3Variants) {
  for (let variant = 1; variant <= 3; variant++) {
    raceProgramsList.push({
      id: String(programId++),
      name: `${combo}_${variant}`
    });
  }
}

const programsHeader = 'id,name';
const programsCsvContent = [programsHeader, ...raceProgramsList.map(p => `${p.id},${p.name}`)].join('\n') + '\n';
fs.writeFileSync(path.join(dataDir, 'race_programs.csv'), programsCsvContent, 'utf8');
console.log('Saved race_programs.csv with ' + raceProgramsList.length + ' new programs!');

// 4. Generate race_program_races.csv
// We will assign matching races to each program.
const newRaceProgramRaces = [];
let mappingId = 1;

// Define matching rules
for (const program of raceProgramsList) {
  const name = program.name;
  const combo = name.split('_')[0];
  const pId = parseInt(program.id);

  // We assign races based on characters in combo
  finalRacesList.forEach(race => {
    const raceId = parseInt(race.id);
    const catId = parseInt(race.category_id);
    const isStage = race.is_stage_race === '1';

    let match = false;

    if (combo === 'OOO') {
      // Fallback program gets all races
      match = true;
    } else if (combo === 'AOO' || combo === 'APO') {
      // Attacker/APO program gets hilly and cobble classics, and stage races
      const isCobble = [15, 21, 45, 46, 25, 27].includes(raceId) || race.name.includes('Roubaix') || race.name.includes('Flanders');
      const isHilly = [16, 17, 26, 28, 29, 30, 56, 63, 64].includes(raceId) || race.name.includes('Lombardia');
      if (isCobble || isHilly || isStage) {
        match = true;
      }
    } else {
      // General spec combinations
      const hasB = combo.includes('B');
      const hasH = combo.includes('H');
      const hasS = combo.includes('S');
      const hasT = combo.includes('T');
      const hasP = combo.includes('P');

      if (hasB || hasT) {
        // Stage races
        if (isStage) match = true;
      }
      if (hasP) {
        // Cobble classics (Roubaix, Flanders, Gent-Wevelgem, E3, Omloop, Dwars, stage 5 of Renewi)
        const isCobble = [15, 21, 45, 46, 25, 27, 59].includes(raceId) || race.name.includes('Roubaix') || race.name.includes('Flanders');
        if (isCobble) match = true;
      }
      if (hasH) {
        // Hilly classics (Strade, MSR, Amstel, Fleche, Liege, San Sebastian, Montreal, Lombardia, Brabantse Pijl)
        const isHilly = [16, 17, 26, 28, 29, 30, 56, 63, 64].includes(raceId) || race.name.includes('Lombardia') || race.name.includes('Sebastian') || race.name.includes('Liege');
        if (isHilly) match = true;
      }
      if (hasS) {
        // Flat/sprint classics / stage races
        const isSprintClassics = [2, 20, 24, 31, 32, 58, 61, 62].includes(raceId) || race.name.includes('Cyclassics') || race.name.includes('Frankfurt');
        if (isSprintClassics || isStage) match = true;
      }
    }

    if (match) {
      newRaceProgramRaces.push({
        id: String(mappingId++),
        program_id: String(pId),
        race_id: String(raceId)
      });
    }
  });
}

const mappingHeader = 'id,program_id,race_id';
const mappingCsvContent = [mappingHeader, ...newRaceProgramRaces.map(m => `${m.id},${m.program_id},${m.race_id}`)].join('\n') + '\n';
fs.writeFileSync(path.join(dataDir, 'race_program_races.csv'), mappingCsvContent, 'utf8');
console.log(`Saved race_program_races.csv with ${newRaceProgramRaces.length} mappings!`);

// 5. Delete race_program_probability_rules.csv if exists
const rulesFile = path.join(dataDir, 'race_program_probability_rules.csv');
if (fs.existsSync(rulesFile)) {
  fs.unlinkSync(rulesFile);
  console.log('Deleted race_program_probability_rules.csv!');
}
