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

const files = walk('./src');
let count = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('"3600"') || content.includes("'3600'")) {
    content = content.replace(/"3600"/g, '"31536000"').replace(/'3600'/g, '"31536000"');
    fs.writeFileSync(f, content, 'utf8');
    count++;
    console.log('Updated cacheControl in:', f);
  }
});
console.log('Total files updated to 1-year cache:', count);
