const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.ts') || file.endsWith('.tsx')) results.push(file);
  });
  return results;
}

const buckets = new Set();
const files = walk('./src');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const m1 = content.matchAll(/storage\.from\(['"]([a-zA-Z0-9\-_]+)['"]\)/g);
  for (const m of m1) buckets.add(m[1]);
  const m2 = content.matchAll(/const\s+BUCKET\s*=\s*['"]([a-zA-Z0-9\-_]+)['"]/g);
  for (const m of m2) buckets.add(m[1]);
  const m3 = content.matchAll(/bucket:\s*['"]([a-zA-Z0-9\-_]+)['"]/g);
  for (const m of m3) buckets.add(m[1]);
});
console.log('Buckets found in code:');
console.log(Array.from(buckets).sort());
