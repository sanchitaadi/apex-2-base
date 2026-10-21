const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=([^\r\n]+)/)?.[1]?.trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/)?.[1]?.trim();

const supabase = createClient(url, key);

async function scanDocs() {
  const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
  if (bErr) {
    console.error('Bucket list error:', bErr);
    return;
  }
  const docs = [];
  
  for (const b of buckets) {
    async function listFolder(prefix = '') {
      const { data: items, error: iErr } = await supabase.storage.from(b.id).list(prefix, { limit: 1000 });
      if (!items) return;
      for (const item of items) {
        const fullPath = prefix ? prefix + '/' + item.name : item.name;
        if (item.id === null) {
          await listFolder(fullPath);
        } else {
          const isDoc = item.name.match(/\.(pdf|doc|docx|xls|xlsx|txt|csv)$/i) || 
                        (item.metadata?.mimetype && item.metadata.mimetype.includes('pdf'));
          if (isDoc) {
            docs.push({
              bucket: b.id,
              name: fullPath,
              sizeKB: Math.round((item.metadata?.size || 0) / 1024),
              sizeMB: ((item.metadata?.size || 0) / 1024 / 1024).toFixed(2),
              mimetype: item.metadata?.mimetype || 'application/pdf',
              cacheControl: item.metadata?.cacheControl,
              created_at: item.created_at || item.updated_at
            });
          }
        }
      }
    }
    await listFolder();
  }
  
  console.log('=== ALL DOCUMENTS IN SUPABASE STORAGE ===');
  console.log('Total document files found:', docs.length);
  let totalKB = 0;
  for (const d of docs) {
    totalKB += d.sizeKB;
    const publicUrl = supabase.storage.from(d.bucket).getPublicUrl(d.name).data.publicUrl;
    let httpCache = 'unknown';
    try {
      const res = await fetch(publicUrl, { method: 'HEAD' });
      httpCache = res.headers.get('cache-control') || 'none';
    } catch (e) {
      httpCache = 'fetch error';
    }
    console.log(`[${d.bucket}] ${d.name}`);
    console.log(`    Size: ${d.sizeMB} MB (${d.sizeKB} KB) | Meta cacheControl: ${d.cacheControl} | HTTP Cache-Control: ${httpCache}`);
  }
  console.log('\nTotal document size:', (totalKB / 1024).toFixed(2), 'MB');
}

scanDocs();
