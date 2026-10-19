const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\Aadi\\.gemini\\antigravity\\brain\\0d0a5b03-7a3e-4893-814e-da2e2b8d01ad\\.system_generated\\logs\\transcript_full.jsonl', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);

for (let i = lines.length - 1; i >= 0; i--) {
  const line = lines[i];
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.type === 'USER_INPUT') {
      console.log('Found user input at line', i, 'content length:', obj.content ? obj.content.length : 0);
      if (obj.content && obj.content.includes('notices')) {
        console.log('Content preview:', obj.content.slice(0, 100));
        let c = obj.content;
        const start = c.indexOf('{"tables"');
        if (start !== -1) {
          const jsonText = c.substring(start).trim();
          const parsed = JSON.parse(jsonText);
          fs.writeFileSync('./supabase_backup_complete.json', JSON.stringify(parsed, null, 2), 'utf8');
          console.log('Successfully saved to supabase_backup_complete.json!');
          break;
        }
      }
    }
  } catch (e) {
    console.error('Error on line', i, e.message);
  }
}
