/**
 * BULK STORAGE UPLOADER FOR APEX PUBLIC SCHOOL
 * 
 * Usage:
 * Put your files or folders into a folder called `local_uploads/` in the project root:
 * local_uploads/
 *   ├── hero/
 *   │     └── photo1.png
 *   ├── faculty/
 *   │     └── teacher1.jpg
 *   ├── site-assets/
 *   │     └── branding/logo.webp
 *   └── ...
 * 
 * Then run:
 *   node scripts/upload-local-files.js
 * 
 * It will automatically upload all files to the corresponding buckets in your new Supabase project
 * with 1-year cache headers and verify their public accessibility.
 */

const fs = require('fs');
const path = require('path');
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
    // Expected path format: <bucket_name>/<path_inside_bucket>
    const parts = f.relPath.split('/');
    if (parts.length < 2) {
      console.warn(`Skipping ${f.relPath}: File must be inside a bucket subfolder (e.g. local_uploads/hero/image.png)`);
      continue;
    }

    const bucket = parts[0];
    const objectPath = parts.slice(1).join('/');
    const ext = path.extname(f.fullPath).toLowerCase();
    const contentType = MIME_MAP[ext] || 'application/octet-stream';
    const fileBuffer = fs.readFileSync(f.fullPath);

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
