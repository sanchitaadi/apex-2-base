const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');
const { PDFDocument, PDFName, PDFNumber } = require('pdf-lib');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=([^\r\n]+)/)?.[1]?.trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/)?.[1]?.trim();

const supabase = createClient(url, key);

async function compressPdfBuffer(pdfBuffer) {
  try {
    const doc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
    let modified = false;

    for (const [ref, obj] of doc.context.enumerateIndirectObjects()) {
      if (obj.dict) {
        const subtype = obj.dict.get(PDFName.of('Subtype'))?.toString();
        if (subtype === '/Image') {
          const filter = obj.dict.get(PDFName.of('Filter'))?.toString() || '';
          if (filter.includes('DCTDecode') && obj.contents && obj.contents.length > 30000) {
            try {
              const origImg = Buffer.from(obj.contents);
              const meta = await sharp(origImg).metadata();
              
              if (meta.width > 1400 || meta.height > 1400 || origImg.length > 150000) {
                const compressed = await sharp(origImg)
                  .resize({ width: 1500, height: 1500, fit: 'inside', withoutEnlargement: true })
                  .jpeg({ quality: 75, mozjpeg: true })
                  .toBuffer();

                if (compressed.length < origImg.length * 0.9) {
                  const newMeta = await sharp(compressed).metadata();
                  obj.contents = new Uint8Array(compressed);
                  obj.dict.set(PDFName.of('Width'), PDFNumber.of(newMeta.width));
                  obj.dict.set(PDFName.of('Height'), PDFNumber.of(newMeta.height));
                  obj.dict.set(PDFName.of('Length'), PDFNumber.of(compressed.length));
                  modified = true;
                }
              }
            } catch (imgErr) {
              // skip unhandled image format
            }
          }
        }
      }
    }

    if (!modified) return { buffer: pdfBuffer, changed: false };
    const newBytes = await doc.save();
    return {
      buffer: Buffer.from(newBytes),
      changed: newBytes.length < pdfBuffer.length
    };
  } catch (e) {
    return { buffer: pdfBuffer, changed: false, error: e.message };
  }
}

async function compressLiveDocuments() {
  console.log('=== STARTING LIVE SUPABASE DOCUMENT OPTIMIZATION ===');
  const bucket = 'academic-resources';
  const prefix = 'mandatory-disclosure';

  const { data: files, error: listErr } = await supabase.storage.from(bucket).list(prefix, { limit: 100 });
  if (listErr) {
    console.error('List error:', listErr);
    return;
  }

  let totalOriginal = 0;
  let totalOptimized = 0;
  let updatedCount = 0;

  for (const f of files) {
    const fullPath = `${prefix}/${f.name}`;
    console.log(`\nProcessing: [${bucket}] ${fullPath} (${Math.round((f.metadata?.size || 0)/1024)} KB)`);

    // Download original
    const { data: downloadData, error: dlErr } = await supabase.storage.from(bucket).download(fullPath);
    if (dlErr) {
      console.error('  Download failed:', dlErr.message);
      continue;
    }

    const origBuffer = Buffer.from(await downloadData.arrayBuffer());
    totalOriginal += origBuffer.length;

    const { buffer: optimizedBuffer, changed } = await compressPdfBuffer(origBuffer);

    if (!changed) {
      console.log('  No compression needed (already optimal). Ensuring 1-year cache headers...');
      // Re-upload to ensure cacheControl is 31536000
      await supabase.storage.from(bucket).upload(fullPath, origBuffer, {
        cacheControl: '31536000',
        contentType: 'application/pdf',
        upsert: true
      });
      totalOptimized += origBuffer.length;
      continue;
    }

    // Validate before upload
    try {
      await PDFDocument.load(optimizedBuffer);
    } catch (valErr) {
      console.error('  Validation failed, keeping original:', valErr.message);
      totalOptimized += origBuffer.length;
      continue;
    }

    // Upload optimized PDF in place
    const { error: upErr } = await supabase.storage.from(bucket).upload(fullPath, optimizedBuffer, {
      cacheControl: '31536000',
      contentType: 'application/pdf',
      upsert: true
    });

    if (upErr) {
      console.error('  Upload failed:', upErr.message);
      totalOptimized += origBuffer.length;
    } else {
      const origKB = Math.round(origBuffer.length / 1024);
      const newKB = Math.round(optimizedBuffer.length / 1024);
      const savedKB = origKB - newKB;
      const pct = ((savedKB / origKB) * 100).toFixed(1);
      console.log(`  SUCCESS: ${origKB} KB -> ${newKB} KB (Saved ${savedKB} KB, -${pct}%)`);
      totalOptimized += optimizedBuffer.length;
      updatedCount++;
    }
  }

  console.log('\n========================================');
  console.log('=== DOCUMENT OPTIMIZATION COMPLETE ===');
  console.log(`Updated files: ${updatedCount} / ${files.length}`);
  console.log(`Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized total: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Storage saved: ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Bandwidth reduction: ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%`);
  console.log('========================================');
}

compressLiveDocuments();
