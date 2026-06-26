const fs = require('fs');

const fileContent = fs.readFileSync('scratch/rebuild_race_program_races_v11.js', 'utf8');

// Define the arrays
const prog28Str = `// Program 28: Classic_Non_Cobble_No Grand Tour_stage race focus_1 (124 days, 55 WT / 69 Pro)
const prog28Races = [
  10, 11, 17, 19, 28, 29, 30, 50, 51, 53, 56, 57, 64, 65, 104, 105, 107, 108, 110, 111, 114, 116, 117, 119, 121, 122
];

// Program 29: Classic_Non_Cobble_No Grand Tour_stage race focus_2 (123 days, 54 WT / 69 Pro)
const prog29Races = [
  1, 2, 5, 8, 9, 12, 13, 14, 17, 18, 24, 26, 28, 29, 30, 50, 52, 53, 54, 56, 59, 61, 62, 63, 64, 71, 73, 74, 75, 76, 78, 80, 84, 86, 89, 90, 92, 94, 95, 100, 105, 106, 111, 113, 115, 118, 120
];

// Program 30: Classic_Non_Cobble_No Grand Tour_stage race focus_3 (144 days, 68 WT / 76 Pro)
const prog30Races = [
  1, 4, 9, 10, 11, 13, 14, 17, 19, 20, 22, 26, 28, 29, 30, 51, 52, 53, 56, 57, 58, 59, 64, 65, 71, 73, 74, 75, 76, 78, 80, 84, 85, 91, 92, 104, 105, 107, 108, 109, 111, 117, 119, 121, 122
];
`;

// Insert the arrays below prog27Races
const p27Anchor = `const prog27Races = [\n  1, 8, 10, 11, 13, 14, 17, 19, 22, 26, 28, 29, 30, 32, 50, 51, 52, 56, 57, 59, 64, 65, 73, 75, 76, 78, 80, 81, 82, 84, 85, 90, 91, 104, 105, 107, 108, 109, 111, 115, 117, 119, 121, 122\n];`;
let updated = fileContent.replace(p27Anchor, p27Anchor + '\n\n' + prog28Str);

// Insert addProgRaces below addProgRaces(27, prog27Races);
const addProgAnchor = `addProgRaces(27, prog27Races);`;
const addProgStr = `addProgRaces(28, prog28Races);\naddProgRaces(29, prog29Races);\naddProgRaces(30, prog30Races);`;
updated = updated.replace(addProgAnchor, addProgAnchor + '\n' + addProgStr);

fs.writeFileSync('scratch/rebuild_race_program_races_v12.js', updated, 'utf8');
console.log("Successfully generated rebuild_race_program_races_v12.js");
