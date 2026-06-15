const fs = require('fs');

const logPath = 'C:/Users/mkrinninger/.gemini/antigravity-ide/brain/e49a586c-ffe2-4c2c-a6c4-7f31e8778d91/.system_generated/logs/transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const data = JSON.parse(line);
    if (data.step_index === 2349) {
      const tc = data.tool_calls.find(t => t.name === 'write_to_file' || t.name === 'replace_file_content');
      if (tc && tc.args.CodeContent) {
        fs.writeFileSync('C:/Users/mkrinninger/.gemini/antigravity-ide/brain/e49a586c-ffe2-4c2c-a6c4-7f31e8778d91/scratch/plan_step_2349.txt', tc.args.CodeContent, 'utf8');
        console.log('Wrote plan to plan_step_2349.txt');
      }
    }
  } catch (err) {}
}
