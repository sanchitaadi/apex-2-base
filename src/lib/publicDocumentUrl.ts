export function publicDocumentUrl(
  url: string | null | undefined,
  title?: string | null
): string {
  if (!url) {
    return "";
  }

  const cleanUrl = url.trim();

  if (!cleanUrl) {
    return "";
  }

  /*
   * Already an Apex public document URL.
   */
  if (
    cleanUrl.startsWith("/documents/") ||
    cleanUrl.includes("apexpublicschool.in/documents/")
  ) {
    return cleanUrl;
  }

  /*
   * Only transform Supabase Storage URLs.
   *
   * Other external URLs should remain untouched.
   */
  if (!cleanUrl.includes(".supabase.co/storage/")) {
    return cleanUrl;
  }

  /*
   * Create a readable filename.
   */
  let filename = "";

  try {
    const parsed = new URL(cleanUrl);

    const pathname = decodeURIComponent(
      parsed.pathname
    );

    filename =
      pathname
        .split("/")
        .filter(Boolean)
        .pop() || "";
  } catch {
    filename = "";
  }

  /*
   * Remove the old file extension.
   */
  filename = filename
    .replace(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i, "");

  /*
   * Prefer the CMS title when available.
   */
  if (title?.trim()) {
    filename = title.trim();
  }

  /*
   * Convert to a clean URL slug.
   */
  filename = filename
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!filename) {
    filename = "document";
  }

  return `/documents/${filename}.pdf`;
}