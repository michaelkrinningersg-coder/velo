const fs = require('fs');
let content = fs.readFileSync('frontend/src/app.ts', 'utf8');

// Fix let html = \n    <table
content = content.replace(/let html = \r?\n    <table/g, 'let html = \\n    <table');

// Fix <tbody>\r?\n  ;
content = content.replace(/<tbody>\r?\n  ;/g, '<tbody>\n  \;');

// Fix html \+= \r?\n      <tr>
content = content.replace(/html \+= \r?\n      <tr>/g, 'html += \\n      <tr>');

// Fix </tr>\r?\n    ;/g
content = content.replace(/<\/tr>\r?\n    ;/g, '</tr>\n    \;');

// Fix html \+= </tbody></table>;
content = content.replace(/html \+= </tbody><\/table>;/g, 'html += \</tbody></table>\;');

fs.writeFileSync('frontend/src/app.ts', content);
console.log('Fixed missing backticks in app.ts');