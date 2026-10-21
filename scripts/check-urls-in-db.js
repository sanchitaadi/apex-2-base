const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=([^\r\n]+)/)?.[1]?.trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/)?.[1]?.trim();

const supabase = createClient(url, key);

async function checkDbUrls() {
  const tables = [
    'hero_slides', 'gallery_images', 'faculty', 'campus_facilities', 
    'academic_stages', 'academic_streams', 'mandatory_public_disclosures',
    'about_pages', 'blog_posts', 'cbse_results', 'site_settings'
  ];
  
  for (const t of tables) {
    const { data } = await supabase.from(t).select('*').limit(3);
    if (!data || data.length === 0) continue;
    console.log('\n--- TABLE:', t, '---');
    for (const row of data) {
      for (const [k, v] of Object.entries(row)) {
        if (typeof v === 'string' && (v.includes('http') || v.includes('/storage/'))) {
          console.log(`  ${k}: ${v.slice(0, 100)}`);
        }
      }
    }
  }
}

checkDbUrls();
