export function slugifyPdfName(value: string): string {
  return value
    .replace(/\.pdf$/i, "")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export function buildLegacyPdfUrl(
  filename: string,
  date = new Date()
): string {
  const cleanFilename =
    slugifyPdfName(filename) + ".pdf";

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  return `/wp-content/uploads/${year}/${month}/${cleanFilename}`;
}

export function isLegacyPdfUrl(
  value: string | null | undefined
): boolean {
  if (!value) return false;

  return /^https?:\/\/[^/]+\/wp-content\/uploads\/\d{4}\/\d{2}\/.+\.pdf$/i.test(
    value
  ) || /^\/wp-content\/uploads\/\d{4}\/\d{2}\/.+\.pdf$/i.test(
    value
  );
}