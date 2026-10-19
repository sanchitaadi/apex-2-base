const fs = require('fs');

const csvPath = 'C:/Users/Aadi/.gemini/antigravity/brain/0d0a5b03-7a3e-4893-814e-da2e2b8d01ad/.user_uploaded/media_1792425712955.csv';
let content = fs.readFileSync(csvPath, 'utf8').trim();

// Strip CSV header "data"
if (content.startsWith('data')) {
  content = content.replace(/^data\r?\n/, '');
}

// Unescape CSV quotes if wrapped in quotes
if (content.startsWith('"') && content.endsWith('"')) {
  content = content.slice(1, -1).replace(/""/g, '"');
}

const data = JSON.parse(content);
fs.writeFileSync('./supabase_backup_complete.json', JSON.stringify(data, null, 2), 'utf8');

console.log('SUCCESS! Backup safely saved to supabase_backup_complete.json');
console.log('Total Tables:', Object.keys(data.tables).length);
console.log('Total Buckets:', data.buckets.length);
console.log('Total Policies:', data.policies.length);

// Also generate restore SQL script!
let restoreSql = `-- ==========================================================\n`;
restoreSql += `-- RESTORE SCRIPT FOR NEW SUPABASE PROJECT\n`;
restoreSql += `-- Generated: ${new Date().toISOString()}\n`;
restoreSql += `-- ==========================================================\n\n`;

// 1. Storage Buckets
restoreSql += `-- 1. CREATE STORAGE BUCKETS\n`;
for (const b of data.buckets) {
  restoreSql += `INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('${b.id}', '${b.name}', ${b.public ? 'true' : 'false'}, ${b.file_size_limit || 'NULL'}, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;\n`;
}
restoreSql += `\n`;

// 2. Data for each table
restoreSql += `-- 2. INSERT TABLE DATA\n`;
for (const [table, rows] of Object.entries(data.tables)) {
  if (rows && rows.length > 0) {
    restoreSql += `-- Table: ${table} (${rows.length} rows)\n`;
    for (const row of rows) {
      const cols = Object.keys(row).map(c => `"${c}"`).join(', ');
      const vals = Object.values(row).map(val => {
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number') return val;
        if (typeof val === 'boolean') return val ? 'true' : 'false';
        if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
        return `'${String(val).replace(/'/g, "''")}'`;
      }).join(', ');
      restoreSql += `INSERT INTO "public"."${table}" (${cols}) VALUES (${vals}) ON CONFLICT DO NOTHING;\n`;
    }
    restoreSql += `\n`;
  }
}

// 3. RLS Policies
restoreSql += `-- 3. ROW LEVEL SECURITY (RLS) POLICIES\n`;
for (const p of data.policies) {
  const roles = Array.isArray(p.roles) ? p.roles.join(', ') : (p.roles || 'public');
  restoreSql += `ALTER TABLE "${p.schemaname}"."${p.tablename}" ENABLE ROW LEVEL SECURITY;\n`;
  restoreSql += `DO $$ BEGIN\n`;
  restoreSql += `  CREATE POLICY "${p.policyname}" ON "${p.schemaname}"."${p.tablename}"\n`;
  restoreSql += `    AS ${p.permissive || 'PERMISSIVE'} FOR ${p.cmd}\n`;
  restoreSql += `    TO ${roles}\n`;
  if (p.qual) restoreSql += `    USING (${p.qual})\n`;
  if (p.with_check) restoreSql += `    WITH CHECK (${p.with_check})\n`;
  restoreSql += `  ;\n`;
  restoreSql += `EXCEPTION WHEN duplicate_object THEN NULL;\n`;
  restoreSql += `END $$;\n\n`;
}

fs.writeFileSync('./restore_to_new_project.sql', restoreSql, 'utf8');
console.log('SUCCESS! restore_to_new_project.sql generated!');
