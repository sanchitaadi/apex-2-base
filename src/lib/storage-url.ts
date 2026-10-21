/**
 * Normalizes any Supabase storage URL so it resolves through the Next.js edge caching proxy
 * at `/storage/[...path]`.
 * 
 * This ensures that background images, inline images, and direct links bypass Supabase's
 * 5 GB Cached Egress limit and use Vercel's 100 GB global CDN cache with 1-year immutable caching.
 */
export function resolveStorageUrl(url: string | null | undefined): string {
  if (!url) return "";
  
  if (url.startsWith("/storage/")) {
    return url;
  }

  // Match any Supabase storage public path: /storage/v1/object/public/...
  const publicStorageIndex = url.indexOf("/storage/v1/object/public/");
  if (publicStorageIndex !== -1) {
    const relativePath = url.substring(publicStorageIndex + "/storage/v1/object/public/".length);
    return `/storage/${relativePath}`;
  }

  return url;
}
