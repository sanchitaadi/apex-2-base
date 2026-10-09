import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const PDF_MAP: Record<string, string> = {
  "2025/09/Affiliation-certificate.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1790846393834-affiliation-grant-letter.pdf",
  "2025/09/Copy-of-Society.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1790847660300-adobe-scan-01-oct-2026-2-.pdf",
  "2025/09/Copy-of-Recognition-Certificate.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1790846554470-copy-of-recognition-certificate.pdf",
  "2025/09/Copy-of-Building-Safety-certificate.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1790846891529-copy-of-latest-building-safety-certificate.pdf",
  "2025/09/Copy-of-Fire-Safety-certificate.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1790846603637-copy-of-fire-safety-certificate.pdf",
  "2026/05/Self-Certification-Digitally-signed-2026.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1790847019194-self-certification-digitally-signed-2026.pdf",
  "2025/09/WATER-HEALTH-CERTIFICATE-SANITATION-CERTIFICATE.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1790846685644-water-health-certificate-sanitation-certificate.pdf",
  "2026/02/Water-Test-Report.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1790847193733-water-test-report-1.pdf",
  "2026/05/FEE-STRUCTURE-2026-2027.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1790847397226-adobe-scan-01-oct-2026.pdf",
  "2026/05/Adobe-Scan-21-Apr-2026-1.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1790846847915-adobe-scan-21-apr-2026-1-.pdf",
  "2026/05/GOVERNING-BODY-OF-JEANNE-CHRISTIAN-EDUCATIONAL-SOCIETY.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1790847467410-signed-document.pdf",
  "2025/09/List-of-Parent-Teacher-Association.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1791399478769-adobe-scan-07-oct-2026.pdf",
  "2026/05/CBSE-BOARD-LAST-5-YEARS-RESULT-CLASS-X-XII.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1790849280784-adobe-scan-01-oct-2026-1.pdf",
  "2026/05/LIST-OF-PGT-2026-2027.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1791399605520-list-of-pgt-2026-27.pdf",
  "2026/05/LIST-OF-TGT-2026-2027.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1791399500169-list-of-tgt-2026-27.pdf",
  "2026/05/LIST-OF-PRT-2026-2027.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1791399567241-list-of-prt-2026-27.pdf",
  "2025/09/Copy-of-NOC-NO-OBJECTION-CERTIFICATE.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1791538099932-copy-of-recognition-certificate.pdf",
};

function isValidYear(value: string) {
  return /^\d{4}$/.test(value);
}

function isValidMonth(value: string) {
  return /^(0[1-9]|1[0-2])$/.test(value);
}

function getPathname(url: string): string | null {
  try {
    return decodeURIComponent(new URL(url).pathname).replace(/\/+$/, "");
  } catch {
    return null;
  }
}

async function findStorageUrl(key: string): Promise<string | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  const endpoint = new URL(
    "/rest/v1/mandatory_public_disclosures",
    SUPABASE_URL
  );
  endpoint.searchParams.set("select", "document_url,storage_url");
  endpoint.searchParams.set("is_active", "eq.true");

  const response = await fetch(endpoint.toString(), {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const rows: Array<{
    document_url: string | null;
    storage_url: string | null;
  }> = await response.json();

  const requestedPath = getPathname(`/wp-content/uploads/${key}`);
  const matchingRow = rows.find(
    (row) =>
      !!row.document_url &&
      !!row.storage_url &&
      getPathname(row.document_url) === requestedPath
  );

  if (!matchingRow?.storage_url) return null;

  let storageUrl: URL;
  try {
    storageUrl = new URL(matchingRow.storage_url);
  } catch {
    return null;
  }

  const expectedOrigin = new URL(SUPABASE_URL).origin;
  if (
    storageUrl.origin !== expectedOrigin ||
    !storageUrl.pathname.startsWith(
      "/storage/v1/object/public/academic-resources/mandatory-disclosure/"
    ) ||
    !storageUrl.pathname.toLowerCase().endsWith(".pdf")
  ) {
    return null;
  }

  return storageUrl.toString();
}

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ year: string; month: string; filename: string }>;
  }
) {
  const { year, month, filename } = await params;

  if (
    !isValidYear(year) ||
    !isValidMonth(month) ||
    filename.includes("/") ||
    filename.includes("\\") ||
    filename === "." ||
    filename === ".." ||
    !filename.toLowerCase().endsWith(".pdf")
  ) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const key = `${year}/${month}/${filename}`;
  let storageUrl: string | null = null;

  try {
    storageUrl = await findStorageUrl(key);
  } catch {
    storageUrl = null;
  }

  // Fallback keeps older hardcoded legacy URLs working.
  if (!storageUrl) storageUrl = PDF_MAP[key] ?? null;

  if (!storageUrl) {
    return new NextResponse("PDF not found", { status: 404 });
  }

  try {
    const response = await fetch(storageUrl, {
      cache: "no-store",
      redirect: "error",
    });

    if (!response.ok) {
      return new NextResponse("PDF could not be loaded", { status: 502 });
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/pdf")) {
      return new NextResponse("The requested file is not a PDF", {
        status: 502,
      });
    }

    const body = await response.arrayBuffer();
    const safeFilename = filename.replace(/["\r\n]/g, "");

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${safeFilename}"`,
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("PDF could not be loaded", { status: 502 });
  }
}
