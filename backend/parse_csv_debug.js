const fs = require('fs');
const content = fs.readFileSync('debug/Rennprogramme.csv', 'utf8');
const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

const delimiter = ';';
const headers = lines[0].split(delimiter);
const variants = lines[1].split(delimiter);

const parsed = [];
for (let i = 2; i < 8; i++) {
  const cells = lines[i].split(delimiter);
  parsed.push({
    role: cells[0],
    cells: cells.slice(1)
  });
}

// Generate Markdown Table
let md = '| Index | Program | Variant | ' + parsed.map(p => p.role).join(' | ') + ' |\n';
md += '|---|---|---|' + parsed.map(() => '---').join('|') + '|\n';

let currentProgram = '';
for (let i = 1; i < headers.length; i++) {
  if (headers[i]) {
    currentProgram = headers[i];
  }
  const variant = variants[i] || '';
  const rowCells = parsed.map(p => p.cells[i - 1] || '');
  md += `| ${i} | ${currentProgram} | ${variant} | ` + rowCells.join(' | ') + ' |\n';
}

fs.writeFileSync('debug/Rennprogramme_table_utf8.md', md, 'utf8');
console.log('Saved to debug/Rennprogramme_table_utf8.md');
