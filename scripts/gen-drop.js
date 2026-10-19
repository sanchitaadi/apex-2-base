const data = require('../supabase_backup_complete.json');
const tables = Object.keys(data.tables);
// Generate targeted DROP TABLE only for tables we own
const drops = tables.map(t => `DROP TABLE IF EXISTS "public"."${t}" CASCADE;`).join('\n');
console.log(drops);
