const fs = require('fs');

const fullSql = fs.readFileSync('./complete_migration.sql', 'utf8');

const part1End = fullSql.indexOf('-- Data for ');
const part2End = fullSql.indexOf('-- 3. ROW LEVEL SECURITY (RLS) POLICIES');

const part1 = fullSql.substring(0, part1End);
const part2 = fullSql.substring(part1End, part2End);
const part3 = fullSql.substring(part2End);

fs.writeFileSync('./01_schema_and_buckets.sql', part1, 'utf8');
fs.writeFileSync('./02_insert_data.sql', part2, 'utf8');
fs.writeFileSync('./03_rls_policies.sql', part3, 'utf8');

console.log('Part 1 (Schema & Buckets):', (part1.length / 1024).toFixed(1), 'KB');
console.log('Part 2 (Insert Data):', (part2.length / 1024).toFixed(1), 'KB');
console.log('Part 3 (RLS Policies):', (part3.length / 1024).toFixed(1), 'KB');
