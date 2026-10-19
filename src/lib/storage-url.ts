/**
 * Normalizes any Supabase storage URL so it always resolves against the active project's Supabase URL.
 * 
 * If a URL contains an old project ref (e.g. gkuuvmfuilrbvlwzburj.supabase.co), this ensures
 * it points to whatever NEXT_PUBLIC_SUPABASE_URL is currently configured in your .env.local.
 */
export function resolveStorageUrl(url: string | null | undefined): string {
  if (!url) return "";
  
  const currentSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
  if (!currentSupabaseUrl) return url;

  // Match any Supabase storage public path: /storage/v1/object/public/...
  const publicStorageIndex = url.indexOf("/storage/v1/object/public/");
  if (publicStorageIndex !== -1) {
    const relativePath = url.substring(publicStorageIndex);
    return `${currentSupabaseUrl}${relativePath}`;
  }

  return url;
}
