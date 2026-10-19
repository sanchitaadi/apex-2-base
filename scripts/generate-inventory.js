const fs = require('fs');

const data = require('../supabase_backup_complete.json');

const files = [];

// Helper to extract Supabase storage URL details
function extractStoragePath(url, sourceTable, title) {
  if (!url || typeof url !== 'string') return;
  const match = url.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)$/);
  if (match) {
    files.push({
      bucket: match[1],
      path: match[2],
      fullUrl: url,
      source: sourceTable,
      name: title || match[2].split('/').pop(),
    });
  }
}

// 1. notices
if (data.tables.notices) {
  for (const item of data.tables.notices) {
    extractStoragePath(item.image_url, 'notices', item.title);
    extractStoragePath(item.document_url, 'notices (doc)', item.title);
    extractStoragePath(item.storage_url, 'notices (storage)', item.title);
  }
}

// 2. hero_slides
if (data.tables.hero_slides) {
  for (const item of data.tables.hero_slides) {
    extractStoragePath(item.image_url, 'hero_slides', item.title);
    extractStoragePath(item.image_desktop_url, 'hero_slides', item.title);
    extractStoragePath(item.image_mobile_url, 'hero_slides', item.title);
  }
}

// 3. gallery_albums
if (data.tables.gallery_albums) {
  for (const item of data.tables.gallery_albums) {
    extractStoragePath(item.cover_image_url, 'gallery_albums', item.title);
  }
}

// 4. gallery_images
if (data.tables.gallery_images) {
  for (const item of data.tables.gallery_images) {
    extractStoragePath(item.image_url, 'gallery_images', item.alt_text || item.title);
  }
}

// 5. faculty_members
if (data.tables.faculty_members) {
  for (const item of data.tables.faculty_members) {
    extractStoragePath(item.image_url, 'faculty_members', item.name);
  }
}

// 6. about_pages
if (data.tables.about_pages) {
  for (const item of data.tables.about_pages) {
    extractStoragePath(item.image_url, 'about_pages', item.title);
  }
}

// 7. academic_documents
if (data.tables.academic_documents) {
  for (const item of data.tables.academic_documents) {
    extractStoragePath(item.document_url, 'academic_documents', item.title);
    extractStoragePath(item.storage_url, 'academic_documents', item.title);
  }
}

// 8. mandatory_public_disclosures
if (data.tables.mandatory_public_disclosures) {
  for (const item of data.tables.mandatory_public_disclosures) {
    extractStoragePath(item.document_url, 'mandatory_public_disclosures', item.title);
    extractStoragePath(item.storage_url, 'mandatory_public_disclosures', item.title);
  }
}

// 9. cbse_result_banners
if (data.tables.cbse_result_banners) {
  for (const item of data.tables.cbse_result_banners) {
    extractStoragePath(item.image_url, 'cbse_result_banners', item.title);
    extractStoragePath(item.pdf_url, 'cbse_result_banners (pdf)', item.title);
  }
}

// 10. campus_facilities
if (data.tables.campus_facilities) {
  for (const item of data.tables.campus_facilities) {
    extractStoragePath(item.image_url, 'campus_facilities', item.title);
  }
}

// 11. kaushal_bodh
if (data.tables.kaushal_bodh) {
  for (const item of data.tables.kaushal_bodh) {
    extractStoragePath(item.image_url, 'kaushal_bodh cover', item.title);
    if (Array.isArray(item.gallery_images)) {
      for (const img of item.gallery_images) {
        extractStoragePath(img.url, 'kaushal_bodh gallery', img.caption);
      }
    }
  }
}

// 12. site_settings
if (data.tables.site_settings) {
  for (const item of data.tables.site_settings) {
    extractStoragePath(item.logo_url, 'site_settings', 'Logo');
    if (item.setting_value && item.setting_value.logo_url) {
      extractStoragePath(item.setting_value.logo_url, 'site_settings (global)', 'Logo');
    }
  }
}

// Deduplicate
const uniqueFiles = new Map();
for (const f of files) {
  const key = `${f.bucket}:::${f.path}`;
  if (!uniqueFiles.has(key)) {
    uniqueFiles.set(key, f);
  }
}

console.log('Total unique files tracked across all content:', uniqueFiles.size);

// Write CSV
let csv = 'Bucket,Path in Bucket,Source Section,Description / Title\n';
for (const f of uniqueFiles.values()) {
  csv += `"${f.bucket}","${f.path}","${f.source}","${(f.name || '').replace(/"/g, '""')}"\n`;
}
fs.writeFileSync('./storage_files_inventory.csv', csv, 'utf8');

// Group by bucket for Markdown checklist
const grouped = {};
for (const f of uniqueFiles.values()) {
  if (!grouped[f.bucket]) grouped[f.bucket] = [];
  grouped[f.bucket].push(f);
}

let md = '# 📁 Supabase Storage Files Checklist\n\n';
md += 'Upload your files to these buckets with these exact paths so all website links match automatically:\n\n';

for (const [bucket, bFiles] of Object.entries(grouped)) {
  md += `## 🪣 Bucket: \`${bucket}\` (${bFiles.length} files)\n\n`;
  md += '| # | Relative Path to Upload | Section / Title |\n';
  md += '|---|---|---|\n';
  bFiles.forEach((f, i) => {
    md += `| ${i + 1} | \`${f.path}\` | ${f.source}: ${f.name} |\n`;
  });
  md += '\n';
}

fs.writeFileSync('./storage_files_checklist.md', md, 'utf8');
console.log('Generated storage_files_inventory.csv & storage_files_checklist.md');
