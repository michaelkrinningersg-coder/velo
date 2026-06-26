const fs = require('fs');

const fileContent = fs.readFileSync('scratch/rebuild_race_program_races_v10.js', 'utf8');

// Define the arrays
const prog25Str = `// Program 25: Classic_Non_Cobble_No Grand Tour_one day focus_1 (125 days, 52 WT / 73 Pro)
const prog25Races = [
  10, 11, 17, 18, 22, 26, 28, 29, 30, 50, 51, 53, 56, 59, 64, 65, 78, 80, 85, 89, 104, 105, 107, 108, 110, 111, 113, 115, 117, 119, 120, 122
];

// Program 26: Classic_Non_Cobble_No Grand Tour_one day focus_2 (125 days, 51 WT / 74 Pro)
const prog26Races = [
  1, 2, 5, 9, 12, 13, 14, 17, 19, 20, 24, 28, 29, 30, 52, 53, 54, 56, 57, 61, 62, 63, 64, 71, 73, 74, 75, 76, 84, 92, 94, 95, 100, 105, 106, 108, 111, 114, 116, 118, 119, 121
];

// Program 27: Classic_Non_Cobble_No Grand Tour_one day focus_3 (145 days, 65 WT / 80 Pro)
const prog27Races = [
  1, 8, 10, 11, 13, 14, 17, 19, 22, 26, 28, 29, 30, 32, 50, 51, 52, 56, 57, 59, 64, 65, 73, 75, 76, 78, 80, 81, 82, 84, 85, 90, 91, 104, 105, 107, 108, 109, 111, 115, 117, 119, 121, 122
];
`;

// Insert the arrays below prog24Races
const p24Anchor = `const prog24Races = [\n  2, 3, 4, 9, 11, 15, 19, 21, 22, 25, 27, 45, 46, 51, 53, 59, 70, 71, 73, 74, 75, 76, 78, 79, 80, 84, 85, 90, 92, 93, 94, 95, 101, 102, 103, 104, 105, 106, 108, 110, 111, 112, 113, 115, 117, 119, 121\n];`;
let updated = fileContent.replace(p24Anchor, p24Anchor + '\n\n' + prog25Str);

// Insert addProgRaces below addProgRaces(24, prog24Races);
const addProgAnchor = `addProgRaces(24, prog24Races);`;
const addProgStr = `addProgRaces(25, prog25Races);\naddProgRaces(26, prog26Races);\naddProgRaces(27, prog27Races);`;
updated = updated.replace(addProgAnchor, addProgAnchor + '\n' + addProgStr);

fs.writeFileSync('scratch/rebuild_race_program_races_v11.js', updated, 'utf8');
console.log("Successfully generated rebuild_race_program_races_v11.js");
