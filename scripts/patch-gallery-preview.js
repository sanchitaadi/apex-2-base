const fs = require('fs');
let c = fs.readFileSync('src/components/home/GalleryPreview.tsx', 'utf8');
if (!c.includes('resolveStorageUrl')) {
  c = c.replace('import { supabase } from "@/lib/supabase/browser";', 'import { supabase } from "@/lib/supabase/browser";\r\nimport { resolveStorageUrl } from "@/lib/storage-url";');
  c = c.replace('`url("${item.image_url}")`', '`url("${resolveStorageUrl(item.image_url)}")`');
  fs.writeFileSync('src/components/home/GalleryPreview.tsx', c, 'utf8');
  console.log('Patched GalleryPreview.tsx with resolveStorageUrl');
}
