const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=([^\r\n]+)/)?.[1]?.trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/)?.[1]?.trim();

const supabase = createClient(url, key);

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function optimizeStorage() {
  console.log('=== STARTING SUPABASE STORAGE COMPRESSION ===');
  console.log('Connecting to:', url);

  const { data: buckets } = await supabase.storage.listBuckets();
  let totalSavedBytes = 0;
  let optimizedCount = 0;

  for (const b of buckets) {
    const { data: rootItems } = await supabase.storage.from(b.id).list('', { limit: 1000 });
    if (!rootItems) continue;

    for (const item of rootItems) {
      // If folder
      if (item.id === null) {
        const { data: subItems } = await supabase.storage.from(b.id).list(item.name, { limit: 1000 });
        if (subItems) {
          for (const sub of subItems) {
            await processFile(b.id, `${item.name}/${sub.name}`, sub.metadata?.size || 0);
          }
        }
      } else {
        await processFile(b.id, item.name, item.metadata?.size || 0);
      }
    }
  }

  async function processFile(bucket, filePath, originalSize) {
    const ext = path.extname(filePath).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) return;

    // Only compress files larger than 250 KB
    if (originalSize < 250 * 1024) return;

    const originalMB = (originalSize / 1024 / 1024).toFixed(2);
    console.log(`\nCompressing [${bucket}] ${filePath} (${originalMB} MB)...`);

    try {
      // 1. Download
      const { data: blob, error: dlErr } = await supabase.storage.from(bucket).download(filePath);
      if (dlErr || !blob) {
        console.error(`  ❌ Failed to download: ${dlErr?.message}`);
        return;
      }

      const inputBuffer = Buffer.from(await blob.arrayBuffer());

      // 2. Compress with Sharp
      let sharpInstance = sharp(inputBuffer).resize({
        width: 1920,
        height: 1920,
        fit: 'inside',
        withoutEnlargement: true,
      });

      let outputBuffer;
      let contentType = 'image/jpeg';

      if (ext === '.png') {
        // High compression PNG or WebP
        outputBuffer = await sharpInstance.png({ quality: 80, compressionLevel: 9 }).toBuffer();
        contentType = 'image/png';
      } else if (ext === '.webp') {
        outputBuffer = await sharpInstance.webp({ quality: 80 }).toBuffer();
        contentType = 'image/webp';
      } else {
        // jpg / jpeg
        outputBuffer = await sharpInstance.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
        contentType = 'image/jpeg';
      }

      const newSize = outputBuffer.length;
      if (newSize >= originalSize) {
        console.log(`  ℹ️ Compression didn't reduce size. Keeping original.`);
        return;
      }

      const newMB = (newSize / 1024 / 1024).toFixed(2);
      const savedMB = ((originalSize - newSize) / 1024 / 1024).toFixed(2);
      const percentReduction = Math.round(((originalSize - newSize) / originalSize) * 100);

      // 3. Re-upload with same path
      const { error: upErr } = await supabase.storage.from(bucket).upload(filePath, outputBuffer, {
        contentType,
        cacheControl: '31536000',
        upsert: true,
      });

      if (upErr) {
        console.error(`  ❌ Failed to upload compressed image: ${upErr.message}`);
      } else {
        console.log(`  ✓ Reduced from ${originalMB} MB -> ${newMB} MB (-${percentReduction}%, saved ${savedMB} MB)!`);
        totalSavedBytes += (originalSize - newSize);
        optimizedCount++;
      }
    } catch (err) {
      console.error(`  ❌ Error processing ${filePath}:`, err.message);
    }
  }

  const totalSavedMB = (totalSavedBytes / 1024 / 1024).toFixed(2);
  console.log(`\n=================================================`);
  console.log(`=== STORAGE COMPRESSION COMPLETE ===`);
  console.log(`Optimized ${optimizedCount} images.`);
  console.log(`TOTAL BANDWIDTH & STORAGE SAVED: ${totalSavedMB} MB!`);
  console.log(`=================================================`);
}

optimizeStorage();
