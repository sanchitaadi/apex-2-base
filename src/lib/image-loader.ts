/**
 * Custom Next.js Image Loader
 * 
 * Intercepts Supabase storage image URLs and routes them through the Next.js
 * edge caching proxy at `/storage/[...path]`.
 * 
 * Benefits:
 * 1. Bypasses Supabase's strict 5 GB Cached Egress limit completely by caching
 *    assets on Vercel's global CDN (100 GB free bandwidth).
 * 2. Uses 0 Vercel Image Transformations because images are already optimized.
 * 3. Browser caches assets immutably for 1 full year.
 */

export default function imageLoader({
  src,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src) return "";

  // If already a relative storage path
  if (src.startsWith("/storage/")) {
    return src;
  }

  // Intercept any Supabase public storage URL (old or new project)
  const marker = "/storage/v1/object/public/";
  const markerIdx = src.indexOf(marker);
  if (markerIdx !== -1) {
    const storagePath = src.substring(markerIdx + marker.length);
    return `/storage/${storagePath}`;
  }

  // Return original src if external or local
  return src;
}
