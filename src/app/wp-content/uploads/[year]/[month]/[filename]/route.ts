import { NextResponse } from "next/server";

const PDF_MAP: Record<string, string> = {
  "2025/09/Affiliation-certificate.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1790846393834-affiliation-grant-letter.pdf",

  "2025/09/Copy-of-Society.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1790847660304-adobe-scan-01-oct-2026-2-.pdf",

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
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1790849280784-adobe-scan-01-oct-2026-1-.pdf",

  "2026/05/LIST-OF-PGT-2026-2027.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1791399605520-list-of-pgt-2026-27.pdf",

  "2026/05/LIST-OF-TGT-2026-2027.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1791399500169-list-of-tgt-2026-27.pdf",

  "2026/05/LIST-OF-PRT-2026-2027.pdf":
    "https://gkuuvmfuilrbvlwzburj.supabase.co/storage/v1/object/public/academic-resources/mandatory-disclosure/1791399567241-list-of-prt-2026-27.pdf",
};

// The NOC URL from the uploaded CBSE disclosure PDF is intentionally not
// mapped here because the current mandatory_public_disclosures export does
// not contain a corresponding NOC PDF. We must not guess its Storage file.

function isValidYear(value: string) {
  return /^\d{4}$/.test(value);
}

function isValidMonth(value: string) {
  return /^(0[1-9]|1[0-2])$/.test(value);
}

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      year: string;
      month: string;
      filename: string;
    }>;
  },
) {
  const { year, month, filename } = await params;

  if (!isValidYear(year) || !isValidMonth(month) || !filename.toLowerCase().endsWith(".pdf")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const key = `${year}/${month}/${filename}`;
  const storageUrl = PDF_MAP[key];

  if (!storageUrl) {
    return new NextResponse("PDF not found", { status: 404 });
  }

  try {
    const response = await fetch(storageUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      return new NextResponse("PDF could not be loaded", {
        status: response.status,
      });
    }

    const body = await response.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch {
    return new NextResponse("PDF could not be loaded", {
      status: 502,
    });
  }
}
