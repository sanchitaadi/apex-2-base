const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=([^\r\n]+)/)?.[1]?.trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/)?.[1]?.trim();

const supabase = createClient(url, key);

async function matchFiles() {
  const { data: dbRows } = await supabase.from('mandatory_public_disclosures').select('*');
  const { data: files } = await supabase.storage.from('academic-resources').list('mandatory-disclosure', { limit: 100 });
  
  console.log('=== MATCHING DB ROWS WITH STORAGE FILES ===');
  console.log('DB count:', dbRows.length);
  console.log('Storage files count:', files.length);
  
  for (const f of files) {
    const matched = dbRows.filter(r => 
      (r.storage_url && r.storage_url.includes(f.name)) || 
      (r.document_url && r.document_url.includes(f.name))
    );
    console.log(`\nFile: ${f.name} (${Math.round((f.metadata?.size || 0)/1024)} KB)`);
    if (matched.length > 0) {
      matched.forEach(m => console.log(`  -> Matched DB [id=${m.id}] sort=${m.sort_order}: "${m.description}"`));
    } else {
      console.log('  -> NO MATCHING DB ROW FOUND!');
    }
  }
}

matchFiles();
