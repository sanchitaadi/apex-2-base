const fs = require('fs');

// 1. wp-content route
const wpRoute = 'src/app/wp-content/uploads/[year]/[month]/[filename]/route.ts';
if (fs.existsSync(wpRoute)) {
  let content = fs.readFileSync(wpRoute, 'utf8');
  content = content.replace(/cache:\s*["']no-store["']/g, 'next: { revalidate: 604800 }');
  content = content.replace(/"Cache-Control":\s*"public,\s*max-age=3600,\s*s-maxage=86400"/g, '"Cache-Control": "public, max-age=31536000, immutable"');
  fs.writeFileSync(wpRoute, content, 'utf8');
  console.log('Patched wp-content PDF route with 1-year immutable cache and 7-day edge revalidation.');
}

// 2. documents slug route
const docRoute = 'src/app/documents/[slug]/route.ts';
if (fs.existsSync(docRoute)) {
  let content = fs.readFileSync(docRoute, 'utf8');
  content = content.replace(/cache:\s*["']no-store["']/g, 'next: { revalidate: 604800 }');
  content = content.replace(/"Cache-Control":\s*"public,\s*max-age=3600"/g, '"Cache-Control": "public, max-age=31536000, immutable"');
  fs.writeFileSync(docRoute, content, 'utf8');
  console.log('Patched /documents/[slug] route with 1-year immutable cache and 7-day edge revalidation.');
}
