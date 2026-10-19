const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function exportAll() {
  const password = process.argv[2];
  if (!password) {
    console.error('Usage: node scripts/export-supabase.js <DATABASE_PASSWORD>');
    process.exit(1);
  }

  // Connection config for Supabase project
  const projectRef = 'gkuuvmfuilrbvlwzburj';

  console.log('Connecting to Supabase PostgreSQL database...');
  const client = new Client({
    host: 'aws-0-ap-southeast-2.pooler.supabase.com',
    port: 6543,
    user: `postgres.${projectRef}`,
    password: password,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    console.log('Connected successfully!');

    // 1. Get all public tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const tableNames = tablesRes.rows.map(r => r.table_name);
    console.log(`Found ${tableNames.length} tables in public schema.`);

    // 2. Fetch all RLS Policies from pg_policies
    console.log('Fetching RLS policies...');
    const policiesRes = await client.query(`
      SELECT 
        schemaname, 
        tablename, 
        policyname, 
        permissive, 
        roles, 
        cmd, 
        qual, 
        with_check
      FROM pg_policies
      WHERE schemaname IN ('public', 'storage')
      ORDER BY schemaname, tablename, policyname;
    `);
    console.log(`Found ${policiesRes.rows.length} RLS policies.`);

    // 3. Fetch Storage Buckets definition
    console.log('Fetching storage buckets...');
    let bucketsRes = { rows: [] };
    try {
      bucketsRes = await client.query(`
        SELECT id, name, public, file_size_limit, allowed_mime_types
        FROM storage.buckets;
      `);
      console.log(`Found ${bucketsRes.rows.length} storage buckets.`);
    } catch (e) {
      console.log('Could not access storage.buckets:', e.message);
    }

    const exportData = {
      buckets: bucketsRes.rows,
      policies: policiesRes.rows,
      tables: {}
    };

    let sqlDump = `-- ========================================================\n`;
    sqlDump += `-- COMPLETE SUPABASE BACKUP: SCHEMAS, POLICIES, BUCKETS & DATA\n`;
    sqlDump += `-- Generated: ${new Date().toISOString()}\n`;
    sqlDump += `-- ========================================================\n\n`;

    // Add Storage Buckets to SQL
    if (bucketsRes.rows.length > 0) {
      sqlDump += `-- --- STORAGE BUCKETS ---\n`;
      for (const b of bucketsRes.rows) {
        const mimes = b.allowed_mime_types ? `'${JSON.stringify(b.allowed_mime_types)}'::text[]` : 'NULL';
        sqlDump += `INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('${b.id}', '${b.name}', ${b.public ? 'true' : 'false'}, ${b.file_size_limit || 'NULL'}, ${mimes})
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;\n`;
      }
      sqlDump += `\n`;
    }

    // Add Table Data
    sqlDump += `-- --- TABLE DATA ---\n`;
    for (const table of tableNames) {
      process.stdout.write(`Exporting table ${table}... `);
      try {
        const rowsRes = await client.query(`SELECT * FROM "public"."${table}"`);
        exportData.tables[table] = rowsRes.rows;
        console.log(`${rowsRes.rows.length} rows`);

        if (rowsRes.rows.length > 0) {
          sqlDump += `-- Table: ${table}\n`;
          for (const row of rowsRes.rows) {
            const columns = Object.keys(row).map(c => `"${c}"`).join(', ');
            const values = Object.values(row).map(val => {
              if (val === null || val === undefined) return 'NULL';
              if (typeof val === 'number' || typeof val === 'boolean') return val;
              if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
              return `'${String(val).replace(/'/g, "''")}'`;
            }).join(', ');
            sqlDump += `INSERT INTO "public"."${table}" (${columns}) VALUES (${values});\n`;
          }
          sqlDump += `\n`;
        }
      } catch (err) {
        console.log(`Failed: ${err.message}`);
      }
    }

    // Add RLS Policies to SQL
    if (policiesRes.rows.length > 0) {
      sqlDump += `-- --- ROW LEVEL SECURITY (RLS) POLICIES ---\n`;
      for (const p of policiesRes.rows) {
        const roles = Array.isArray(p.roles) ? p.roles.join(', ') : (p.roles || 'public');
        sqlDump += `ALTER TABLE "${p.schemaname}"."${p.tablename}" ENABLE ROW LEVEL SECURITY;\n`;
        sqlDump += `CREATE POLICY "${p.policyname}" ON "${p.schemaname}"."${p.tablename}"\n`;
        sqlDump += `  AS ${p.permissive || 'PERMISSIVE'} FOR ${p.cmd}\n`;
        sqlDump += `  TO ${roles}\n`;
        if (p.qual) sqlDump += `  USING (${p.qual})\n`;
        if (p.with_check) sqlDump += `  WITH CHECK (${p.with_check})\n`;
        sqlDump += `;\n\n`;
      }
    }

    const jsonPath = path.join(__dirname, '..', 'supabase_full_backup.json');
    const sqlPath = path.join(__dirname, '..', 'supabase_full_backup.sql');

    fs.writeFileSync(jsonPath, JSON.stringify(exportData, null, 2), 'utf-8');
    fs.writeFileSync(sqlPath, sqlDump, 'utf-8');

    console.log('\nBackup completed successfully!');
    console.log(`JSON Backup saved to: ${jsonPath}`);
    console.log(`SQL Dump saved to: ${sqlPath}`);

  } catch (error) {
    console.error('Connection failed:', error.message);
  } finally {
    await client.end();
  }
}

exportAll();
