const fs = require('fs');
const sql = fs.readFileSync('./03_rls_policies.sql', 'utf8');
const storageRefs = (sql.match(/storage\./g) || []).length;
console.log('storage. references in policies:', storageRefs);
console.log('Total lines in 03_rls_policies.sql:', sql.split('\n').length);
// Check for any non-public schema ALTER TABLE
const nonPublic = sql.split('\n').filter(l => l.includes('ALTER TABLE') && !l.includes('"public"'));
console.log('Non-public schema ALTER TABLE lines:', nonPublic.length);
if (nonPublic.length > 0) nonPublic.forEach(l => console.log(' >', l));
