const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { PDFDocument, PDFName } = require('pdf-lib');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=([^\r\n]+)/)?.[1]?.trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/)?.[1]?.trim();

const supabase = createClient(url, key);

async function inspectAllDocs() {
  const { data: files } = await supabase.storage.from('academic-resources').list('mandatory-disclosure', { limit: 100 });
  const dir = path.join('scratch', 'docs');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  console.log('Inspecting', files.length, 'files...');
  for (const f of files) {
    const { data, error } = await supabase.storage.from('academic-resources').download(`mandatory-disclosure/${f.name}`);
    if (error) {
      console.error('Download error for', f.name, error);
      continue;
    }
    const buf = Buffer.from(await data.arrayBuffer());
    const filePath = path.join(dir, f.name);
    fs.writeFileSync(filePath, buf);

    try {
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
      const images = [];
      for (const [ref, obj] of doc.context.enumerateIndirectObjects()) {
        if (obj.dict) {
          const subtype = obj.dict.get(PDFName.of('Subtype'))?.toString();
          if (subtype === '/Image') {
            const filter = obj.dict.get(PDFName.of('Filter'))?.toString();
            const w = obj.dict.get(PDFName.of('Width'))?.value || obj.dict.get(PDFName.of('Width'));
            const h = obj.dict.get(PDFName.of('Height'))?.value || obj.dict.get(PDFName.of('Height'));
            images.push({ ref: ref.toString(), filter, w, h, size: obj.contents?.length || 0 });
          }
        }
      }
      console.log(`\n${f.name} (${Math.round(buf.length / 1024)} KB, ${doc.getPageCount()} pages):`);
      images.forEach(img => console.log(`   Image ${img.ref}: filter=${img.filter}, size=${Math.round(img.size/1024)} KB`));
    } catch (e) {
      console.log(`\n${f.name}: PDFDocument load error:`, e.message);
    }
  }
}

inspectAllDocs();
