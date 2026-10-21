const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=([^\r\n]+)/)?.[1]?.trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/)?.[1]?.trim();

const supabase = createClient(url, key);

async function checkOldHero() {
  const { data: slides } = await supabase.from('hero_slides').select('*');
  for (const s of slides) {
    console.log('\nSlide:', s.id, s.title);
    for (const [k, v] of Object.entries(s)) {
      if (typeof v === 'string' && v.includes('storage/v1/object/public')) {
        const path = v.split('/public/')[1];
        const [bucket, ...rest] = path.split('/');
        const filePath = rest.join('/');
        try {
          const res = await fetch(v, { method: 'HEAD' });
          console.log(`  ${k}: ${filePath} -> HTTP ${res.status}`);
        } catch (e) {
          console.log(`  ${k}: ${filePath} -> FETCH ERROR`);
        }
      }
    }
  }
}

checkOldHero();
