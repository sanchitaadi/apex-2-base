const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=([^\r\n]+)/)?.[1]?.trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/)?.[1]?.trim();

const supabase = createClient(url, key);

async function checkDisclosures() {
  const { data, error } = await supabase.from('mandatory_public_disclosures').select('*').order('sort_order');
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Count in mandatory_public_disclosures:', data?.length);
  data?.forEach(d => {
    console.log(`[order=${d.sort_order}] ${d.description} | active=${d.is_active} | URL: ${d.document_url}`);
  });
}

checkDisclosures();
