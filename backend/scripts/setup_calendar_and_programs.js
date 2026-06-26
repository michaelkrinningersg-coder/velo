const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, '..', '..', 'data', 'csv');

// Helper to read and parse CSV (delimiter-agnostic)
function readCsv(filename) {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return [];

  const delimiter = lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(delimiter);
  return lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);

    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (values[i] || '').trim();
    });
    return obj;
  });
}

// 1. Missing World Tour Races definition
const newRaces = [
  { id: '50', name: 'Volta Ciclista a Catalunya', country_id: '8', category_id: '4', is_stage_race: '1', number_of_stages: '7', start_date: '2026-03-23', end_date: '2026-03-29', prestige: '85' },
  { id: '51', name: 'Itzulia Basque Country', country_id: '8', category_id: '4', is_stage_race: '1', number_of_stages: '6', start_date: '2026-04-06', end_date: '2026-04-11', prestige: '83' },
  { id: '52', name: 'Tour de Romandie', country_id: '17', category_id: '4', is_stage_race: '1', number_of_stages: '6', start_date: '2026-04-28', end_date: '2026-05-03', prestige: '82' },
  { id: '53', name: 'Tour Auvergne - Rhône-Alpes', country_id: '3', category_id: '4', is_stage_race: '1', number_of_stages: '8', start_date: '2026-06-07', end_date: '2026-06-14', prestige: '88' },
  { id: '54', name: 'Tour de Suisse', country_id: '17', category_id: '4', is_stage_race: '1', number_of_stages: '5', start_date: '2026-06-17', end_date: '2026-06-21', prestige: '87' },
  { id: '55', name: 'Tour de France', country_id: '3', category_id: '1', is_stage_race: '1', number_of_stages: '21', start_date: '2026-07-04', end_date: '2026-07-26', prestige: '100' },
  { id: '56', name: 'DSSK (Donostia San Sebastian Klasikoa)', country_id: '8', category_id: '7', is_stage_race: '0', number_of_stages: '1', start_date: '2026-08-01', end_date: '2026-08-01', prestige: '83' },
  { id: '57', name: 'Tour de Pologne', country_id: '30', category_id: '4', is_stage_race: '1', number_of_stages: '7', start_date: '2026-08-03', end_date: '2026-08-09', prestige: '80' },
  { id: '58', name: 'ADAC Cyclassics', country_id: '7', category_id: '7', is_stage_race: '0', number_of_stages: '1', start_date: '2026-08-16', end_date: '2026-08-16', prestige: '80' },
  { id: '59', name: 'Renewi Tour', country_id: '4', category_id: '4', is_stage_race: '1', number_of_stages: '5', start_date: '2026-08-19', end_date: '2026-08-23', prestige: '81' },
  { id: '60', name: 'La Vuelta Ciclista a España', country_id: '8', category_id: '2', is_stage_race: '1', number_of_stages: '21', start_date: '2026-08-22', end_date: '2026-09-13', prestige: '95' },
  { id: '61', name: 'Bretagne Classic - CIC', country_id: '3', category_id: '7', is_stage_race: '0', number_of_stages: '1', start_date: '2026-08-30', end_date: '2026-08-30', prestige: '82' },
  { id: '62', name: 'Grand Prix Cycliste de Québec', country_id: '22', category_id: '7', is_stage_race: '0', number_of_stages: '1', start_date: '2026-09-11', end_date: '2026-09-11', prestige: '83' },
  { id: '63', name: 'Grand Prix Cycliste de Montréal', country_id: '22', category_id: '7', is_stage_race: '0', number_of_stages: '1', start_date: '2026-09-13', end_date: '2026-09-13', prestige: '83' },
  { id: '64', name: 'Il Lombardia', country_id: '2', category_id: '3', is_stage_race: '0', number_of_stages: '1', start_date: '2026-10-10', end_date: '2026-10-10', prestige: '95' },
  { id: '65', name: 'Tour of Guangxi', country_id: '25', category_id: '4', is_stage_race: '1', number_of_stages: '6', start_date: '2026-10-13', end_date: '2026-10-18', prestige: '75' }
];

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

// 53: Tour Auvergne - Rhône-Alpes (8 stages)
const dauStages = ['Flat', 'Rolling', 'Hilly', 'ITT', 'Hilly_Difficult', 'Medium_Mountain', 'High_Mountain', 'Mountain'];
const dauFiles = ['dummy_flat_a.csv', 'dummy_rolling_a.csv', 'dummy_hilly_a.csv', 'dummy_itt_e.csv', 'dummy_hilly_difficult_a.csv', 'dummy_medium_mountain_a.csv', 'dummy_high_mountain_a.csv', 'dummy_mountain_a.csv'];
for (let i = 0; i < 8; i++) {
  newStages.push(makeStageRow(nextStageId++, 53, i + 1, addDays('2026-06-07', i), dauStages[i], dauFiles[i]));
}

// 54: Tour de Suisse (5 stages)
const suiStages = ['ITT', 'Flat', 'Rolling', 'Hilly', 'Mountain'];
const suiFiles = ['dummy_itt_c.csv', 'dummy_flat_b.csv', 'dummy_rolling_b.csv', 'dummy_hilly_b.csv', 'dummy_mountain_c.csv'];
for (let i = 0; i < 5; i++) {
  newStages.push(makeStageRow(nextStageId++, 54, i + 1, addDays('2026-06-17', i), suiStages[i], suiFiles[i]));
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

// 56: DSSK (Donostia San Sebastian Klasikoa) (1 stage)
newStages.push(makeStageRow(nextStageId++, 56, 1, '2026-08-01', 'Hilly_Difficult', 'dummy_hilly_difficult_a.csv'));

// 57: Tour de Pologne (7 stages)
const polStages = ['Flat', 'Rolling', 'Hilly', 'ITT', 'Rolling', 'Hilly_Difficult', 'Flat'];
const polFiles = ['dummy_flat_b.csv', 'dummy_rolling_b.csv', 'dummy_hilly_b.csv', 'dummy_itt_d.csv', 'dummy_rolling_c.csv', 'dummy_hilly_difficult_b.csv', 'dummy_flat_a.csv'];
for (let i = 0; i < 7; i++) {
  newStages.push(makeStageRow(nextStageId++, 57, i + 1, addDays('2026-08-03', i), polStages[i], polFiles[i]));
}

// 58: ADAC Cyclassics (1 stage)
newStages.push(makeStageRow(nextStageId++, 58, 1, '2026-08-16', 'Flat', 'dummy_flat_a.csv'));

// 59: Renewi Tour (5 stages)
const renStages = ['Flat', 'ITT', 'Flat', 'Rolling', 'Cobble'];
const renFiles = ['dummy_flat_a.csv', 'dummy_itt_b.csv', 'dummy_flat_b.csv', 'dummy_rolling_a.csv', 'dummy_cobble_a.csv'];
for (let i = 0; i < 5; i++) {
  newStages.push(makeStageRow(nextStageId++, 59, i + 1, addDays('2026-08-19', i), renStages[i], renFiles[i]));
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
existingStages.forEach(s => {
  const rId = parseInt(s.race_id, 10);
  if (rId < 50 || rId > 65) {
    allStagesMap.set(s.id, s);
  }
});
newStages.forEach(s => allStagesMap.set(s.id, s));
const finalStagesList = Array.from(allStagesMap.values()).sort((a,b) => parseInt(a.id) - parseInt(b.id));

const stagesHeader = 'id,race_id,stage_number,date,profile,start_elevation,details_csv_file,final_spread_start_percent,final_push_start_percent,final_spread_difficulty_multiplier,crash_incident_multiplier,mechanical_incident_multiplier,allowed_weather';
const stagesCsvContent = [stagesHeader, ...finalStagesList.map(s => `${s.id},${s.race_id},${s.stage_number},${s.date},${s.profile},${s.start_elevation},${s.details_csv_file},${s.final_spread_start_percent},${s.final_push_start_percent},${s.final_spread_difficulty_multiplier},${s.crash_incident_multiplier},${s.mechanical_incident_multiplier},"${s.allowed_weather}"`)].join('\n') + '\n';
fs.writeFileSync(path.join(dataDir, 'stages.csv'), stagesCsvContent, 'utf8');
console.log('Saved stages.csv with new stages!');

// Load countries to map country_id to preferred nationality group
const countries = readCsv('country.csv');
const countryGroupMap = {};
countries.forEach(c => {
  const groupId = parseInt(c.program_group_id, 10);
  const groupNames = { 1: 'BeNeLUX', 2: 'FraGer', 3: 'EspSlo', 4: 'ITAUSA' };
  countryGroupMap[c.id] = groupNames[groupId] || 'ITAUSA';
});

// Write races.csv with new columns
const existingRaces = readCsv('races.csv');
const allRacesMap = new Map();
existingRaces.forEach(r => allRacesMap.set(r.id, r));
newRaces.forEach(r => allRacesMap.set(r.id, r));
const finalRacesList = Array.from(allRacesMap.values()).sort((a,b) => parseInt(a.id) - parseInt(b.id));

const racesHeader = 'id,name,country_id,category_id,is_stage_race,number_of_stages,start_date,end_date,prestige,preferred_nationality_group,required_specs';
const racesCsvContent = [racesHeader, ...finalRacesList.map(r => {
  const prefNat = countryGroupMap[r.country_id] || 'ITAUSA';
  const raceStages = finalStagesList.filter(s => s.race_id === r.id);
  const stageProfiles = raceStages.map(s => s.profile);
  
  let spec = 'T|F|S|A';
  const hasMountain = stageProfiles.some(p => ['Mountain', 'High_Mountain', 'Medium_Mountain'].includes(p));
  const hasCobble = stageProfiles.some(p => ['Cobble', 'Cobble_Hill'].includes(p));
  const hasHilly = stageProfiles.some(p => ['Hilly', 'Hilly_Difficult'].includes(p));

  if (hasMountain) {
    spec = 'B|T|F|A';
  } else if (hasCobble) {
    spec = 'P|T|F|A';
  } else if (hasHilly) {
    spec = 'H|T|F|A';
  } else {
    spec = 'T|F|S|A';
  }

  return `${r.id},"${r.name}",${r.country_id},${r.category_id},${r.is_stage_race},${r.number_of_stages},${r.start_date},${r.end_date},${r.prestige},${prefNat},${spec}`;
})].join('\n') + '\n';

fs.writeFileSync(path.join(dataDir, 'races.csv'), racesCsvContent, 'utf8');
console.log('Saved races.csv with preferred nationality and required specs!');

// 3. Generate race_programs.csv based on simulation
const SPECIALIZATION_IDS = [1, 2, 3, 4, 5, 6, 7];
const FLAT_MULT = 0.991;
const ATTACKER_MULT = 0.978;

const g1 = ['BEL', 'NED', 'LUX', 'NOR', 'DEN', 'SWD', 'GBR', 'IRL'];
const g2 = ['FRA', 'AUS', 'NZL', 'GER', 'AUT', 'SWI'];
const g3 = ['ESP', 'POR', 'AND', 'CAN', 'CZE', 'POL', 'LAT', 'EST', 'LTU', 'SLO', 'SVK'];
const g4 = ['ITA', 'COL', 'ECU', 'VEN', 'MEX', 'ARG', 'USA'];

function getProgramGroupId(code) {
  if (g1.includes(code)) return 1;
  if (g2.includes(code)) return 2;
  if (g3.includes(code)) return 3;
  return 4;
}

const groupNames = {
  1: 'BeNeLUX',
  2: 'FraGer',
  3: 'EspSlo',
  4: 'ITAUSA'
};

const specAbbrMap = { 1: 'B', 2: 'H', 3: 'S', 4: 'T', 5: 'P', 6: 'A', 7: 'F' };

function normalizeComboKey(comboKey) {
  const map = {
    // Berg (B)
    'BFH': 'BHF',
    'BTH': 'BHT',
    'BHA': 'BHP',
    'BFP': 'BHP',
    
    // Sprint (S)
    'STF': 'SFT',
    'SAF': 'SFA',
    'STA': 'SAT',
    'SHF': 'SFT',
    
    // Cobble (P)
    'PTF': 'PFT',
    'PTA': 'PAT',
    'PAF': 'PFA',
    'PHF': 'PFH',
    'PHS': 'PFT',
    'PSF': 'PFT',
    'PSG': 'PFT',
    'PSH': 'SPH',
    
    // Hill (H)
    'HAB': 'HBA',
    'HTF': 'HFT',
    'HSP': 'HSF',
    'HTB': 'HSB',
    'HPS': 'HPF',
    
    // Time Trial (T)
    'TAF': 'TFA',
    'TBH': 'TBF',
    'THF': 'TFH',
    'TFP': 'TPF',
    'TPH': 'TPF',
    'TFS': 'TFH',
    'TSF': 'TFH',
    
    // Flat (F)
    'FTA': 'FAT',
    'FSP': 'FPS',
    'FHP': 'FPS',
    'FTP': 'FPS',
    'FST': 'FTS',
    'FSH': 'FTS',
    'FHS': 'FTS'
  };
  return map[comboKey] ?? comboKey;
}

function getVariantCount(n) {
  if (n < 4) return 1;
  if (n < 10) return 2;
  return 4;
}

function getMaxVariants(comboKey, region, baseRidersCount) {
  if (comboKey === 'SPH' || comboKey === 'SHP') return 1;
  if (comboKey === 'SPF' && region === 'FraGer') return 2;
  return getVariantCount(baseRidersCount);
}

const validExactMatchCombos = new Set([
  'SHP', 'HBS', 'SPH', 'HSB', 'HSP', 'BHS', 'BHT', 'HBP', 'PSH', 'BHP',
  'PHS', 'HPS', 'HPB', 'TPH', 'HBT', 'PST', 'PHB', 'PTH', 'SPT', 'TBH', 'HTB', 'BTH',
  'FPS', 'FSP', 'FSH', 'FHS', 'FPH', 'FHP', 'FPT', 'FTP', 'FTS', 'FST',
  'BFH', 'BHF', 'BFS', 'BSF', 'BFP', 'BPF',
  'HFB', 'HBF', 'HFS', 'HSF', 'HFT', 'HTF', 'HFP', 'HPF',
  'SFB', 'SBF', 'SFH', 'SHF', 'SFT', 'STF', 'SFP', 'SPF',
  'TFB', 'TBF', 'TFH', 'THF', 'TFS', 'TSF', 'TFP', 'TPF',
  'PFB', 'PBF', 'PFH', 'PHF', 'PFS', 'PSF', 'PFT', 'PTF'
]);

const initialCombosWith6Variants = [
  'SHP', 'HBS', 'SPH', 'HSB', 'HSP', 'BHS', 'BHT', 'HBP', 'PSH', 'BHP',
  'PHS', 'HPS', 'AOO', 'OOO',
  'FPS', 'FSP', 'FSH', 'FHS', 'FPH', 'FHP', 'FPT', 'FTP', 'FTS', 'FST',
  'BFH', 'BHF', 'BFS', 'BSF', 'BFP', 'BPF',
  'HFB', 'HBF', 'HFS', 'HSF', 'HFT', 'HTF', 'HFP', 'HPF',
  'SFB', 'SBF', 'SFH', 'SHF', 'SFT', 'STF', 'SFP', 'SPF',
  'TFB', 'TBF', 'TFH', 'THF', 'TFS', 'TSF', 'TFP', 'TPF',
  'PFB', 'PBF', 'PFH', 'PHF', 'PFS', 'PSF', 'PFT', 'PTF'
];

const initialCombosWith3Variants = [
  'HPB', 'TPH', 'HBT', 'PST', 'PHB', 'PTH', 'SPT', 'TBH', 'HTB', 'BTH'
];

function resolveSkillScores(row) {
  const f = parseFloat(row.skill_flat || '50');
  const m = parseFloat(row.skill_mountain || '50');
  const mm = parseFloat(row.skill_medium_mountain || '50');
  const h = parseFloat(row.skill_hill || '50');
  const tt = parseFloat(row.skill_time_trial || '50');
  const pr = parseFloat(row.skill_prologue || '50');
  const co = parseFloat(row.skill_cobble || '50');
  const sp = parseFloat(row.skill_sprint || '50');
  const ac = parseFloat(row.skill_acceleration || '50');
  const att = parseFloat(row.skill_attack || '50');
  const st = parseFloat(row.skill_stamina || '50');
  const re = parseFloat(row.skill_resistance || '50');
  const rec = parseFloat(row.skill_recuperation || '50');
  const dh = parseFloat(row.skill_downhill || '50');
  const bh = parseFloat(row.skill_bike_handling) || Math.min(85, Math.max(0, dh * 0.7 + sp * 0.15 + att * 0.05 + re * 0.1));

  return {
    1: m * 0.45 + mm * 0.25 + rec * 0.15 + st * 0.15,
    2: h * 0.4 + mm * 0.2 + ac * 0.15 + att * 0.15 + re * 0.1,
    3: sp * 0.4 + ac * 0.25 + f * 0.15 + bh * 0.1 + re * 0.1,
    4: tt * 0.45 + pr * 0.25 + f * 0.15 + st * 0.15,
    5: co * 0.55 + f * 0.15 + bh * 0.15 + re * 0.15,
    6: (att * 0.35 + st * 0.2 + re * 0.2 + h * 0.15 + ac * 0.1) * ATTACKER_MULT,
    7: (f * 0.5 + st * 0.2 + re * 0.15 + bh * 0.15) * FLAT_MULT,
  };
}

function resolveBestSpecIds(row) {
  const spec1 = row.specialization_1_id ? parseInt(row.specialization_1_id) : null;
  const spec2 = row.specialization_2_id ? parseInt(row.specialization_2_id) : null;
  const spec3 = row.specialization_3_id ? parseInt(row.specialization_3_id) : null;
  const seededSpecs = [spec1, spec2, spec3].filter(id => id != null);

  if (seededSpecs.length >= 3) {
    return seededSpecs.slice(0, 3);
  }

  const scores = resolveSkillScores(row);
  const missingSpecs = SPECIALIZATION_IDS
    .filter((specId) => !seededSpecs.includes(specId))
    .sort((left, right) => scores[right] - scores[left] || left - right);

  const merged = [...seededSpecs, ...missingSpecs.slice(0, 3 - seededSpecs.length)];
  const unique = [];
  for (const id of merged) {
    if (!unique.includes(id)) unique.push(id);
  }
  return unique.slice(0, 3);
}

function provisionalOverall(row) {
  const sum = parseFloat(row.skill_flat || '50') +
    parseFloat(row.skill_mountain || '50') +
    parseFloat(row.skill_medium_mountain || '50') +
    parseFloat(row.skill_hill || '50') +
    parseFloat(row.skill_time_trial || '50') +
    parseFloat(row.skill_cobble || '50') +
    parseFloat(row.skill_sprint || '50') * 1.2 +
    parseFloat(row.skill_stamina || '50') +
    parseFloat(row.skill_resistance || '50') +
    parseFloat(row.skill_recuperation || '50') +
    parseFloat(row.skill_acceleration || '50');
  const val = sum / 11.2;
  return Math.max(0, Math.min(85, Math.round(val * 100) / 100));
}

function getSurvivingPrograms() {
  // 1. Run the bootstrapper first to generate a deterministic world_data.db
  const bootstrapperPath = path.resolve(__dirname, '..', 'dist', 'backend', 'src', 'bootstrapper.js');
  const { bootstrap } = require(bootstrapperPath);
  bootstrap(true);

  // 2. Open database and query riders
  const Database = require('better-sqlite3');
  const dbPath = path.resolve(__dirname, '..', 'assets', 'world_data.db');
  const db = new Database(dbPath);

  const riders = db.prepare(`
    SELECT r.id,
           r.specialization_1_id,
           r.specialization_2_id,
           r.specialization_3_id,
           r.overall_rating,
           COALESCE(current_contract.team_id, r.active_team_id) AS team_id,
           country.program_group_id AS program_group_id,
           dt.tier AS team_tier
    FROM riders r
    LEFT JOIN sta_country country ON country.id = r.country_id
    LEFT JOIN contracts current_contract
      ON current_contract.id = (
        SELECT contracts.id
        FROM contracts
        WHERE contracts.rider_id = r.id
          AND contracts.start_season <= 2026
          AND contracts.end_season >= 2026
        ORDER BY contracts.start_season DESC, contracts.id DESC
        LIMIT 1
      )
    LEFT JOIN teams t ON t.id = COALESCE(current_contract.team_id, r.active_team_id)
    LEFT JOIN division_teams dt ON dt.id = t.division_id
    WHERE r.is_retired = 0
      AND COALESCE(current_contract.team_id, r.active_team_id) IS NOT NULL
  `).all();

  // Group by combination to find splits
  const comboGroups = {};
  for (const r of riders) {
    const specs = [r.specialization_1_id, r.specialization_2_id, r.specialization_3_id];
    const orderedAbbr = specs.map(id => specAbbrMap[id]).join('');
    let comboKey = 'OOO';
    if (validExactMatchCombos.has(orderedAbbr)) {
      comboKey = orderedAbbr;
    } else {
      const spec1 = specs[0];
      if (spec1 === 5) {
        comboKey = 'POO';
      } else if (spec1 === 3) {
        comboKey = 'SOO';
      } else if (spec1 === 1) {
        comboKey = 'BOO';
      } else if (spec1 === 2) {
        comboKey = 'HOO';
      } else {
        comboKey = 'OOO';
      }
    }

    comboKey = normalizeComboKey(comboKey);

    if (!comboGroups[comboKey]) comboGroups[comboKey] = [];
    comboGroups[comboKey].push(r);
  }

  // Determine split combinations (Tier 1 count >= 25)
  const splitCombos = new Set();
  for (const [combo, list] of Object.entries(comboGroups)) {
    const tier1Count = list.filter(r => r.team_tier === 1).length;
    if (tier1Count >= 25) {
      if (combo[0] !== 'P' && combo[1] !== 'P' && combo !== 'TFH' && combo !== 'TFS') {
        splitCombos.add(combo);
      }
    }
  }

  // 3. Clear race_programs table and insert ALL candidate programs
  db.prepare('DELETE FROM race_programs').run();
  
  const candidatePrograms = [];
  let nextId = 1;
  
  for (const comboKey of Object.keys(comboGroups)) {
    if (splitCombos.has(comboKey)) {
      for (const [regionIdStr, region] of Object.entries(groupNames)) {
        const regionId = parseInt(regionIdStr);
        const regionalRiders = comboGroups[comboKey].filter(r => r.program_group_id === regionId);
        const maxVariants = getMaxVariants(comboKey, region, regionalRiders.length);
        for (let v = 1; v <= maxVariants; v++) {
          candidatePrograms.push({ id: nextId++, name: `${comboKey}_${region}_${v}` });
        }
      }
    } else {
      const totalRiders = comboGroups[comboKey].length;
      const maxVariants = getMaxVariants(comboKey, null, totalRiders);
      for (let v = 1; v <= maxVariants; v++) {
        candidatePrograms.push({ id: nextId++, name: `${comboKey}_${v}` });
      }
    }
  }

  const insertProg = db.prepare('INSERT INTO race_programs (id, name) VALUES (?, ?)');
  db.transaction(() => {
    for (const p of candidatePrograms) {
      insertProg.run(p.id, p.name);
    }
  })();

  // 4. Run the actual runtime assignment engine on these candidate programs
  db.prepare('DELETE FROM rider_season_programs WHERE season = 2026').run();
  const { RiderProgramService } = require('../dist/backend/src/game/RiderProgramService.js');
  const service = new RiderProgramService(db);
  service.ensureSeasonPrograms(2026);

  // 5. Query which programs got at least 1 Tier 1 rider
  const stats = db.prepare(`
    SELECT 
      rp.name AS program_name,
      SUM(CASE WHEN dt.tier = 1 THEN 1 ELSE 0 END) AS tier1_riders
    FROM race_programs rp
    LEFT JOIN rider_season_programs rsp ON rsp.program_id = rp.id AND rsp.season = 2026
    LEFT JOIN riders r ON r.id = rsp.rider_id
    LEFT JOIN contracts c ON c.id = (
      SELECT contracts.id FROM contracts
      WHERE contracts.rider_id = r.id
        AND contracts.start_season <= 2026
        AND contracts.end_season >= 2026
      ORDER BY contracts.start_season DESC, contracts.id DESC
      LIMIT 1
    )
    LEFT JOIN teams t ON t.id = COALESCE(c.team_id, r.active_team_id)
    LEFT JOIN division_teams dt ON dt.id = t.division_id
    GROUP BY rp.name
  `).all();

  db.prepare('DELETE FROM rider_season_programs WHERE season = 2026').run();
  db.close();

  // Determine surviving programs
  const surviving = [];
  for (const s of stats) {
    if (s.program_name === 'BHT_FraGer_4') {
      continue;
    }
    if (s.program_name === 'OOO_1' || s.program_name === 'OOO_BeNeLUX_1') {
      surviving.push(s.program_name);
      continue;
    }
    if (s.tier1_riders >= 1) {
      surviving.push(s.program_name);
    }
  }

  return surviving.sort();
}

const survivingProgramNames = getSurvivingPrograms();
const raceProgramsList = survivingProgramNames.map((name, i) => ({
  id: String(i + 1),
  name
}));

const programsHeader = 'id,name';
const programsCsvContent = [programsHeader, ...raceProgramsList.map(p => `${p.id},${p.name}`)].join('\n') + '\n';
fs.writeFileSync(path.join(dataDir, 'race_programs.csv'), programsCsvContent, 'utf8');
console.log('Saved race_programs.csv with ' + raceProgramsList.length + ' surviving programs!');

// 4. Generate race_program_races.csv
// We will assign matching races to each program.
const newRaceProgramRaces = [];
let mappingId = 1;

// Parse program names
function parseProgramName(name) {
  const parts = name.split('_');
  const combo = parts[0];
  let group = null;
  let variant = 1;
  if (parts.length === 3) {
    group = parts[1];
    variant = parseInt(parts[2], 10);
  } else if (parts.length === 2) {
    variant = parseInt(parts[1], 10);
  }
  return {
    combo,
    group,
    variant,
    spec1: combo[0]
  };
}

const parsedPrograms = raceProgramsList.map(p => {
  const parsed = parseProgramName(p.name);
  return {
    id: p.id,
    name: p.name,
    ...parsed
  };
});

// Collision tracking
const programCalendars = new Map(); // program_id -> Array of race objects
parsedPrograms.forEach(p => {
  programCalendars.set(p.id, []);
});

function racesOverlap(raceA, raceB) {
  const startA = new Date(raceA.start_date);
  const endA = new Date(raceA.end_date);
  const startB = new Date(raceB.start_date);
  const endB = new Date(raceB.end_date);
  return startA <= endB && endA >= startB;
}

function isProgramBusy(programId, newRace) {
  const calendar = programCalendars.get(programId) || [];
  for (const assignedRace of calendar) {
    if (racesOverlap(assignedRace, newRace)) {
      return true;
    }
  }
  return false;
}

function getMatchingProgramCandidates(combo, preferredGroup, variantSet) {
  const candidates = [];
  for (const v of variantSet) {
    if (preferredGroup) {
      const regionalName = `${combo}_${preferredGroup}_${v}`;
      const found = parsedPrograms.find(p => p.name === regionalName);
      if (found) {
        candidates.push(found);
        continue;
      }
    }
    const globalName = `${combo}_${v}`;
    const found = parsedPrograms.find(p => p.name === globalName);
    if (found) {
      candidates.push(found);
    }
  }
  return candidates;
}

// Deterministic seedable pseudo-random generator to ensure stable sorting and choices
let seedVal = 12345;
function seededRandom() {
  const x = Math.sin(seedVal++) * 10000;
  return x - Math.floor(x);
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Read back races to include their new columns
const finalRacesWithNewColumns = readCsv('races.csv');

// Sort races by prestige descending so that high-prestige races are filled first, and date as a tie breaker
const sortedRaces = [...finalRacesWithNewColumns].sort((a, b) => {
  const diff = parseInt(b.prestige, 10) - parseInt(a.prestige, 10);
  if (diff !== 0) return diff;
  return a.start_date.localeCompare(b.start_date);
});

for (const race of sortedRaces) {
  const catId = parseInt(race.category_id, 10);
  const requiredSpecs = (race.required_specs || '').split('|');
  const preferredGroup = race.preferred_nationality_group;

  // Find all matching combos for the specs
  const matchingCombos = Array.from(new Set(parsedPrograms.filter(p => requiredSpecs.includes(p.spec1)).map(p => p.combo)));
  
  if (matchingCombos.length === 0) continue;

  // We always assign OOO fallback program if available, checking collisions
  const fallback = parsedPrograms.find(p => p.combo === 'OOO' && p.group === preferredGroup) || parsedPrograms.find(p => p.combo === 'OOO' && !p.group);
  if (fallback) {
    if (!isProgramBusy(fallback.id, race)) {
      programCalendars.get(fallback.id).push(race);
      newRaceProgramRaces.push({ id: String(mappingId++), program_id: fallback.id, race_id: race.id });
    }
  }

  // Determine variant assignment rules
  if ([1, 2, 3].includes(catId)) {
    // TDF (1), GT (2), Monument (3): all variants 1-2
    for (const combo of matchingCombos) {
      const candidates = getMatchingProgramCandidates(combo, preferredGroup, [1, 2]);
      for (const p of candidates) {
        if (!isProgramBusy(p.id, race)) {
          programCalendars.get(p.id).push(race);
          newRaceProgramRaces.push({ id: String(mappingId++), program_id: p.id, race_id: race.id });
        }
      }
    }
  } else if ([4, 5, 7, 8].includes(catId)) {
    // Stage Race / One Day High & Middle: 1 random from {1, 2}, 1 random from {3, 4}
    for (const combo of matchingCombos) {
      // 1 random from {1, 2}
      const setA = shuffle(getMatchingProgramCandidates(combo, preferredGroup, [1, 2]));
      for (const p of setA) {
        if (!isProgramBusy(p.id, race)) {
          programCalendars.get(p.id).push(race);
          newRaceProgramRaces.push({ id: String(mappingId++), program_id: p.id, race_id: race.id });
          break; // only select one
        }
      }
      // 1 random from {3, 4}
      const setB = shuffle(getMatchingProgramCandidates(combo, preferredGroup, [3, 4]));
      for (const p of setB) {
        if (!isProgramBusy(p.id, race)) {
          programCalendars.get(p.id).push(race);
          newRaceProgramRaces.push({ id: String(mappingId++), program_id: p.id, race_id: race.id });
          break; // only select one
        }
      }
    }
  } else {
    // Low / other categories: 1 variant from {1, 2} on 1/4 of specs, else {3, 4}
    const shuffledCombos = shuffle(matchingCombos);
    const splitCount = Math.max(1, Math.round(shuffledCombos.length / 4));
    
    for (let i = 0; i < shuffledCombos.length; i++) {
      const combo = shuffledCombos[i];
      if (i < splitCount) {
        // try to assign one from {1, 2}
        const setA = shuffle(getMatchingProgramCandidates(combo, preferredGroup, [1, 2]));
        for (const p of setA) {
          if (!isProgramBusy(p.id, race)) {
            programCalendars.get(p.id).push(race);
            newRaceProgramRaces.push({ id: String(mappingId++), program_id: p.id, race_id: race.id });
            break;
          }
        }
      } else {
        // try to assign one from {3, 4}
        const setB = shuffle(getMatchingProgramCandidates(combo, preferredGroup, [3, 4]));
        for (const p of setB) {
          if (!isProgramBusy(p.id, race)) {
            programCalendars.get(p.id).push(race);
            newRaceProgramRaces.push({ id: String(mappingId++), program_id: p.id, race_id: race.id });
            break;
          }
        }
      }
    }
  }
}

// Report gaps
const raceProgramCounts = {};
finalRacesWithNewColumns.forEach(r => {
  raceProgramCounts[r.id] = 0;
});
newRaceProgramRaces.forEach(a => {
  raceProgramCounts[a.race_id]++;
});

console.log('=== Gaps Report (Races with 0 assigned programs) ===');
let gapsCount = 0;
finalRacesWithNewColumns.forEach(r => {
  if (raceProgramCounts[r.id] === 0) {
    console.log(`- Race "${r.name}" (ID: ${r.id}, Prestige: ${r.prestige}, Cat: ${r.category_id}) has 0 programs assigned.`);
    gapsCount++;
  }
});
console.log(`Total gaps (0 programs assigned): ${gapsCount}`);

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
