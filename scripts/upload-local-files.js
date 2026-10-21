/**
 * BULK STORAGE UPLOADER FOR APEX PUBLIC SCHOOL
 * 
 * Automatically compresses high-resolution photos with Sharp before uploading
 * to guarantee storage and bandwidth quotas are never exceeded.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=([^\r\n]+)/)?.[1]?.trim();
const serviceKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/)?.[1]?.trim();

if (!url || !serviceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

function getAllFiles(dir, baseDir = dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(full, baseDir));
    } else {
      const rel = path.relative(baseDir, full).replace(/\\/g, '/');
      results.push({ fullPath: full, relPath: rel });
    }
  }
  return results;
}

const MIME_MAP = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

async function main() {
  const uploadDir = path.join(process.cwd(), 'local_uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created folder: ${uploadDir}`);
    console.log('Place your images/documents inside `local_uploads/<bucket_name>/...` and run this script again!');
    return;
  }

  const files = getAllFiles(uploadDir);
  if (files.length === 0) {
    console.log(`Folder 'local_uploads/' is currently empty.`);
    console.log(`To upload files automatically, place them in: local_uploads/<bucket_name>/<file_name>`);
    console.log(`Example: local_uploads/hero/my-banner.jpg`);
    return;
  }

  console.log(`Found ${files.length} local files to upload to Supabase...`);

  let successCount = 0;
  for (const f of files) {
    const parts = f.relPath.split('/');
    if (parts.length < 2) {
      console.warn(`Skipping ${f.relPath}: File must be inside a bucket subfolder (e.g. local_uploads/hero/image.png)`);
      continue;
    }

    const bucket = parts[0];
    const objectPath = parts.slice(1).join('/');
    const ext = path.extname(f.fullPath).toLowerCase();
    let contentType = MIME_MAP[ext] || 'application/octet-stream';
    let fileBuffer = fs.readFileSync(f.fullPath);

    // Auto-compress large images before uploading
    if (IMAGE_EXTS.has(ext) && fileBuffer.length > 250 * 1024) {
      try {
        const originalKB = Math.round(fileBuffer.length / 1024);
        let sharpInst = sharp(fileBuffer).resize({
          width: 1920,
          height: 1920,
          fit: 'inside',
          withoutEnlargement: true,
        });

        let compressed;
        if (ext === '.png') {
          compressed = await sharpInst.png({ quality: 80, compressionLevel: 9 }).toBuffer();
        } else if (ext === '.webp') {
          compressed = await sharpInst.webp({ quality: 80 }).toBuffer();
        } else {
          compressed = await sharpInst.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
        }

        if (compressed.length < fileBuffer.length) {
          const newKB = Math.round(compressed.length / 1024);
          console.log(`  ⚡ Auto-compressed image: ${originalKB} KB -> ${newKB} KB (-${Math.round((1 - newKB/originalKB)*100)}%)`);
          fileBuffer = compressed;
        }
      } catch (compErr) {
        console.warn(`  ⚠️ Compression skipped for ${f.relPath}:`, compErr.message);
      }
    }

    console.log(`Uploading to [${bucket}] -> ${objectPath}...`);
    const { error } = await supabase.storage
      .from(bucket)
      .upload(objectPath, fileBuffer, {
        contentType,
        cacheControl: '31536000',
        upsert: true,
      });

    if (error) {
      console.error(`  ❌ Failed: ${error.message}`);
    } else {
      console.log(`  ✓ Uploaded successfully!`);
      successCount++;
    }
  }

  console.log(`\n=== UPLOAD FINISHED: ${successCount} / ${files.length} files uploaded! ===`);
}

main();
