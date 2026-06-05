const fs = require('fs');
const path = require('path');

const files = ['src/app.ts', 'index.html'];

const replacements = {
    'ÃƒÆ’Ã‚Â¤': 'ä',
    'ÃƒÆ’Ã‚Â¶': 'ö',
    'ÃƒÆ’Ã‚Â¼': 'ü',
    'ÃƒÆ’Ã¢â‚¬Å¾': 'Ä',
    'ÃƒÆ’Ã¢â‚¬œ': 'Ö',
    'ÃƒÆ’Ã…â€œ': 'Ü',
    'ÃƒÆ’Ã…Â¸': 'ß',
    'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“': '–',
    'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ': '-',
    'Ãƒâ€šÃ‚Â·': '·',
    'ÃƒÂ¢Ã¢â‚¬â€ Ã‚Â ': '▬',
    'ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â²': '▲',
    'ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¼': '▼',
    'ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬Ëœ': '↑',
    'ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬Å“': '↓',
    'ÃƒÆ’Ã¢â‚¬â€ ': '×',
    'ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦': '...',
    'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢': '\''
};

let totalReplacements = 0;

for (const file of files) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let fileReplacements = 0;
        
        for (const [bad, good] of Object.entries(replacements)) {
            const regex = new RegExp(bad.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
            const matches = content.match(regex);
            if (matches) {
                fileReplacements += matches.length;
                totalReplacements += matches.length;
                content = content.replace(regex, good);
            }
        }
        
        if (fileReplacements > 0) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`+ Fixed ${fileReplacements} strings in ${file}`);
        } else {
            console.log(`- No strings to fix in ${file}`);
        }
    } else {
        console.log(`- File not found: ${file}`);
    }
}

console.log(`Total replacements: ${totalReplacements}`);