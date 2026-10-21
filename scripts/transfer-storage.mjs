/**
 * AUTOMATED SUPABASE-TO-SUPABASE STORAGE TRANSFER SCRIPT
 * 
 * Transfers all 328 image and document assets from the OLD Supabase project
 * directly into the NEW Supabase project.
 * 
 * Usage:
 *   node scripts/transfer-storage.mjs [OPTIONAL_OLD_API_KEY]
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const OLD_URL = 'https://gkuuvmfuilrbvlwzburj.supabase.co';
const oldApiKey = process.argv[2] || '';

const env = fs.readFileSync('.env.local', 'utf8');
const newUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=([^\r\n]+)/)?.[1]?.trim();
const newServiceKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/)?.[1]?.trim();

if (!newUrl || !newServiceKey) {
  console.error('Missing new Supabase credentials in .env.local');
  process.exit(1);
}

const newSupabase = createClient(newUrl, newServiceKey);

// Parse CSV inventory
const csvContent = fs.readFileSync('storage_files_inventory.csv', 'utf8');
const lines = csvContent.split('\n').slice(1);
const filesToTransfer = [];

for (const line of lines) {
  if (!line.trim()) continue;
  const match = line.match(/^"([^"]+)","([^"]+)"/);
  if (match) {
    filesToTransfer.push({
      bucket: match[1],
      filePath: match[2],
    });
  }
}

console.log(`Loaded ${filesToTransfer.length} files from storage inventory to transfer.`);

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
  let successCount = 0;
  let blockedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < filesToTransfer.length; i++) {
    const item = filesToTransfer[i];
    const sourceUrl = `${OLD_URL}/storage/v1/object/public/${item.bucket}/${item.filePath}`;
    const ext = path.extname(item.filePath).toLowerCase();
    const contentType = MIME_MAP[ext] || 'application/octet-stream';

    const headers = {};
    if (oldApiKey) {
      headers['apikey'] = oldApiKey;
      headers['Authorization'] = `Bearer ${oldApiKey}`;
    }

    try {
      const res = await fetch(sourceUrl, { headers });
      if (res.status === 402) {
        if (blockedCount === 0) {
          console.error(`\n❌ Old Supabase project Storage API returned HTTP 402 (Payment Required / Egress Limit Exceeded).`);
          console.error(`Supabase gateway is actively blocking public file downloads from ${OLD_URL}.\n`);
        }
        blockedCount++;
        if (blockedCount >= 3) {
          console.log(`Aborting: Old project is blocked with HTTP 402. Please see instructions below.`);
          break;
        }
        continue;
      }

      if (!res.ok) {
        console.warn(`[${i + 1}/${filesToTransfer.length}] ⚠️ Failed to fetch from old project (${res.status}): ${item.filePath}`);
        failedCount++;
        continue;
      }

      const buffer = Buffer.from(await res.arrayBuffer());

      // Upload to new project
      const { error: uploadErr } = await newSupabase.storage
        .from(item.bucket)
        .upload(item.filePath, buffer, {
          contentType,
          cacheControl: '31536000',
          upsert: true,
        });

      if (uploadErr) {
        console.error(`[${i + 1}/${filesToTransfer.length}] ❌ Upload to new project failed:`, uploadErr.message);
        failedCount++;
      } else {
        console.log(`[${i + 1}/${filesToTransfer.length}] ✓ Transferred: [${item.bucket}] ${item.filePath}`);
        successCount++;
      }
    } catch (err) {
      console.error(`[${i + 1}/${filesToTransfer.length}] Error on ${item.filePath}:`, err.message);
      failedCount++;
    }
  }

  console.log(`\n=== TRANSFER SUMMARY ===`);
  console.log(`Transferred: ${successCount}`);
  console.log(`Blocked (402): ${blockedCount}`);
  console.log(`Failed: ${failedCount}`);
}

main();
