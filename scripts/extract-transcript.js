const fs = require('fs');
const readline = require('readline');

async function extract() {
  const transcriptPath = 'C:\\Users\\Aadi\\.gemini\\antigravity\\brain\\0d0a5b03-7a3e-4893-814e-da2e2b8d01ad\\.system_generated\\logs\\transcript_full.jsonl';
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let rawMatch = '';
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'USER_INPUT' && typeof obj.content === 'string' && obj.content.includes('gallery_images')) {
        rawMatch = obj.content;
      }
    } catch (e) {}
  }

  if (rawMatch) {
    const idx = rawMatch.indexOf('{"tables"');
    if (idx !== -1) {
      const jsonText = rawMatch.substring(idx).trim();
      const data = JSON.parse(jsonText);
      fs.writeFileSync('./supabase_backup_complete.json', JSON.stringify(data, null, 2), 'utf8');
      console.log('SUCCESS: supabase_backup_complete.json written!');
      console.log('Tables:', Object.keys(data.tables).length);
      console.log('Buckets:', data.buckets.length);
      console.log('Policies:', data.policies.length);
      return;
    }
  }
  console.log('No matching text found.');
}

extract();
