const fs = require('fs');

const data = require('../supabase_backup_complete.json');

function inferType(col, val) {
  if (col === 'id') {
    if (typeof val === 'number') return 'serial PRIMARY KEY';
    return 'uuid PRIMARY KEY DEFAULT gen_random_uuid()';
  }
  if (typeof val === 'boolean' || col.startsWith('is_') || col.endsWith('_enabled') || col === 'is_active' || col === 'is_published') {
    return 'boolean DEFAULT true';
  }
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return 'integer DEFAULT 0';
    return 'numeric';
  }
  if (Array.isArray(val)) {
    if (val.length > 0 && typeof val[0] === 'string') return 'text[]';
    return 'jsonb DEFAULT \'[]\'::jsonb';
  }
  if (val && typeof val === 'object') {
    return 'jsonb DEFAULT \'{}\'::jsonb';
  }
  if (col.endsWith('_date') || col === 'date') {
    return 'date';
  }
  if (col.endsWith('_at') || col === 'created_at' || col === 'updated_at') {
    return 'timestamptz DEFAULT now()';
  }
  return 'text';
}

// 1. Pre-scan all tables to determine precise column types across all rows
const tableColTypes = {};
for (const [table, rows] of Object.entries(data.tables)) {
  tableColTypes[table] = {};
  if (rows && rows.length > 0) {
    for (const row of rows) {
      for (const [col, val] of Object.entries(row)) {
        if (val !== null && val !== undefined) {
          if (!tableColTypes[table][col]) {
            tableColTypes[table][col] = inferType(col, val);
          } else if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'string') {
            tableColTypes[table][col] = 'text[]';
          }
        }
      }
    }
  }
}

let fullScript = `-- =====================================================================\n`;
fullScript += `-- COMPLETE SUPABASE RESTORE SCRIPT (TABLES + DATA + BUCKETS + POLICIES)\n`;
fullScript += `-- Target: Run this in the SQL Editor of your NEW Supabase project\n`;
fullScript += `-- =====================================================================\n\n`;

fullScript += `-- 0. ENABLE REQUIRED EXTENSIONS & SECURITY FUNCTIONS\n`;
fullScript += `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n`;
fullScript += `CREATE EXTENSION IF NOT EXISTS "pgcrypto";\n\n`;

fullScript += `-- Helper function for admin RLS policies\n`;
fullScript += `CREATE OR REPLACE FUNCTION public.is_admin()\n`;
fullScript += `RETURNS boolean\n`;
fullScript += `LANGUAGE plpgsql\n`;
fullScript += `SECURITY DEFINER\n`;
fullScript += `AS $$\n`;
fullScript += `BEGIN\n`;
fullScript += `  RETURN EXISTS (\n`;
fullScript += `    SELECT 1 FROM public.admin_users\n`;
fullScript += `    WHERE id = auth.uid()\n`;
fullScript += `      AND is_active = true\n`;
fullScript += `      AND role IN ('admin', 'super_admin')\n`;
fullScript += `  ) OR EXISTS (\n`;
fullScript += `    SELECT 1 FROM public.admin_profiles\n`;
fullScript += `    WHERE id = auth.uid()\n`;
fullScript += `      AND is_active = true\n`;
fullScript += `      AND role IN ('owner', 'admin', 'super_admin')\n`;
fullScript += `  );\n`;
fullScript += `END;\n`;
fullScript += `$$;\n\n`;

// 1. Create Storage Buckets
fullScript += `-- ---------------------------------------------------------------------\n`;
fullScript += `-- 1. STORAGE BUCKETS (20 Buckets)\n`;
fullScript += `-- ---------------------------------------------------------------------\n`;
for (const b of data.buckets) {
  fullScript += `INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('${b.id}', '${b.name}', ${b.public ? 'true' : 'false'}, ${b.file_size_limit || 'NULL'}, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;\n`;
}
fullScript += `\n`;

// 2. Tables Schema & Data
fullScript += `-- ---------------------------------------------------------------------\n`;
fullScript += `-- 2. TABLE SCHEMAS & DATA\n`;
fullScript += `-- ---------------------------------------------------------------------\n`;

for (const [table, rows] of Object.entries(data.tables)) {
  const sample = (rows && rows.length > 0) ? rows[0] : null;
  if (!sample) {
    fullScript += `CREATE TABLE IF NOT EXISTS "public"."${table}" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "is_active" boolean DEFAULT true,
  "is_published" boolean DEFAULT true,
  "status" text DEFAULT 'draft',
  "blog_id" uuid,
  "declaration_accepted" boolean DEFAULT true,
  "created_at" timestamptz DEFAULT now()
);\n\n`;
    continue;
  }

  // Generate CREATE TABLE
  const colDefs = Object.keys(sample).map(col => {
    let type = tableColTypes[table]?.[col] || inferType(col, sample[col]);
    return `"${col}" ${type}`;
  });

  fullScript += `CREATE TABLE IF NOT EXISTS "public"."${table}" (\n  ${colDefs.join(',\n  ')}\n);\n\n`;

  // Insert rows
  fullScript += `-- Data for ${table} (${rows.length} rows)\n`;
  for (const row of rows) {
    const cols = Object.keys(row).map(c => `"${c}"`).join(', ');
    const vals = Object.values(row).map((val, idx) => {
      const colName = Object.keys(row)[idx];
      const colType = tableColTypes[table]?.[colName];

      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'number') return val;
      if (typeof val === 'boolean') return val ? 'true' : 'false';

      if (colType === 'text[]') {
        if (Array.isArray(val)) {
          if (val.length === 0) return `'{}'::text[]`;
          const items = val.map(s => `'${String(s).replace(/'/g, "''")}'`).join(', ');
          return `ARRAY[${items}]::text[]`;
        }
        return `'{}'::text[]`;
      }

      if (Array.isArray(val)) {
        return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
      }

      if (typeof val === 'object') {
        return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
      }

      return `'${String(val).replace(/'/g, "''")}'`;
    }).join(', ');

    fullScript += `INSERT INTO "public"."${table}" (${cols}) VALUES (${vals}) ON CONFLICT DO NOTHING;\n`;
  }
  fullScript += `\n`;
}

// 3. RLS Policies
fullScript += `-- ---------------------------------------------------------------------\n`;
fullScript += `-- 3. ROW LEVEL SECURITY (RLS) POLICIES\n`;
fullScript += `-- ---------------------------------------------------------------------\n`;

// Ensure columns used in policies exist on empty/legacy tables
const columnsToAdd = [
  ['homepage_sections', 'is_active', 'boolean DEFAULT true'],
  ['events', 'is_published', 'boolean DEFAULT true'],
  ['faculty', 'is_active', 'boolean DEFAULT true'],
  ['activities', 'is_active', 'boolean DEFAULT true'],
  ['activities', 'is_published', 'boolean DEFAULT true'],
  ['achievements', 'is_published', 'boolean DEFAULT true'],
  ['academic_resources', 'is_active', 'boolean DEFAULT true'],
  ['pages', 'is_published', 'boolean DEFAULT true'],
  ['documents', 'is_active', 'boolean DEFAULT true'],
  ['accolade_images', 'is_active', 'boolean DEFAULT true'],
  ['admission_applications', 'declaration_accepted', 'boolean DEFAULT true'],
  ['blog_posts', 'status', 'text DEFAULT \'draft\''],
  ['blog_posts', 'is_active', 'boolean DEFAULT true'],
  ['blog_images', 'blog_id', 'uuid'],
  ['cms_blogs', 'status', 'text DEFAULT \'draft\''],
  ['blogs', 'status', 'text DEFAULT \'draft\'']
];

for (const [tbl, col, def] of columnsToAdd) {
  fullScript += `ALTER TABLE "public"."${tbl}" ADD COLUMN IF NOT EXISTS "${col}" ${def};\n`;
}
fullScript += `\n`;

const seenPolicies = new Set();
for (const p of data.policies) {
  // Skip storage schema - those are Supabase's internal tables we cannot own
  if (p.schemaname !== 'public') continue;

  const key = `${p.schemaname}.${p.tablename}.${p.policyname}`;
  if (seenPolicies.has(key)) continue;
  seenPolicies.add(key);

  const roles = Array.isArray(p.roles) ? p.roles.join(', ') : (p.roles || 'public');
  fullScript += `ALTER TABLE "${p.schemaname}"."${p.tablename}" ENABLE ROW LEVEL SECURITY;\n`;
  fullScript += `DO $$ BEGIN\n`;
  fullScript += `  CREATE POLICY "${p.policyname}" ON "${p.schemaname}"."${p.tablename}"\n`;
  fullScript += `    AS ${p.permissive || 'PERMISSIVE'} FOR ${p.cmd}\n`;
  fullScript += `    TO ${roles}\n`;
  if (p.qual) fullScript += `    USING (${p.qual})\n`;
  if (p.with_check) fullScript += `    WITH CHECK (${p.with_check})\n`;
  fullScript += `  ;\n`;
  fullScript += `EXCEPTION WHEN OTHERS THEN NULL;\n`;
  fullScript += `END $$;\n\n`;
}

// Replace old project URLs with new project URL
const oldRef = 'gkuuvmfuilrbvlwzburj.supabase.co';
const newRef = 'ngqzmzlpjpbitxetqltj.supabase.co';
fullScript = fullScript.replaceAll(oldRef, newRef);

fs.writeFileSync('./complete_migration.sql', fullScript, 'utf8');

// Also update the 3 split files
const part1End = fullScript.indexOf('-- Data for ');
const part2End = fullScript.indexOf('-- 3. ROW LEVEL SECURITY (RLS) POLICIES');

const part1 = fullScript.substring(0, part1End);
const part2 = fullScript.substring(part1End, part2End);
const part3 = fullScript.substring(part2End);

fs.writeFileSync('./01_schema_and_buckets.sql', part1, 'utf8');
fs.writeFileSync('./02_insert_data.sql', part2, 'utf8');
fs.writeFileSync('./03_rls_policies.sql', part3, 'utf8');

console.log('SUCCESS: All migration SQL files updated!');
console.log('Part 1:', (part1.length / 1024).toFixed(1), 'KB');
console.log('Part 2:', (part2.length / 1024).toFixed(1), 'KB');
console.log('Part 3:', (part3.length / 1024).toFixed(1), 'KB');
