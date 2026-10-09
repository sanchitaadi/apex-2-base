
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BUCKET = "academic-resources";
const UPLOAD_PREFIX = "/wp-content/uploads/";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing server-side Supabase configuration.");
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function isValidPath(year: string, month: string, filename: string) {
  return (
    /^\d{4}$/.test(year) &&
    /^(0[1-9]|1[0-2])$/.test(month) &&
    filename.toLowerCase().endsWith(".pdf") &&
    !filename.includes("/") &&
    !filename.includes("\\") &&
    filename !== "." &&
    filename !== ".."
  );
}

function getLegacyUrlCandidates(
  year: string,
  month: string,
  filename: string
) {
  const encodedFilename = encodeURIComponent(filename);
  const path = `${UPLOAD_PREFIX}${year}/${month}/${encodedFilename}`;

  return [
    `https://apexpublicschool.in${path}`,
    `https://www.apexpublicschool.in${path}`,
  ];
}

export async function GET(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      year: string;
      month: string;
      filename: string;
    }>;
  }
) {
  try {
    const { year, month, filename } = await params;

    if (!isValidPath(year, month, filename)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const legacyUrls = getLegacyUrlCandidates(year, month, filename);
    const supabase = getSupabaseAdmin();

    // Find the document dynamically. No hardcoded filename map.
    const { data: document, error } = await supabase
      .from("mandatory_public_disclosures")
      .select("document_url, storage_url")
      .in("document_url", legacyUrls)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Legacy PDF database lookup failed:", error.message);

      return new NextResponse("Could not look up PDF", {
        status: 500,
      });
    }

    if (!document) {
      return new NextResponse("PDF not found", {
        status: 404,
      });
    }

    // New records use storage_url. The fallback supports older records
    // whose document_url still directly contains their Supabase URL.
    const storageUrl =
      document.storage_url ||
      (document.document_url?.includes(
        "/storage/v1/object/public/"
      )
        ? document.document_url
        : null);

    if (!storageUrl) {
      return new NextResponse("PDF storage location not found", {
        status: 404,
      });
    }

    const parsedStorageUrl = new URL(storageUrl);

    // Only serve files from this project's public Supabase Storage.
    if (
      parsedStorageUrl.protocol !== "https:" ||
      parsedStorageUrl.hostname !== "gkuuvmfuilrbvlwzburj.supabase.co" ||
      !parsedStorageUrl.pathname.startsWith(
        `/storage/v1/object/public/${BUCKET}/`
      )
    ) {
      return new NextResponse("Invalid PDF storage URL", {
        status: 500,
      });
    }

    const pdfResponse = await fetch(parsedStorageUrl.toString(), {
      cache: "no-store",
    });

    if (!pdfResponse.ok) {
      console.error(
        "Supabase PDF fetch failed:",
        pdfResponse.status,
        parsedStorageUrl.pathname
      );

      return new NextResponse("PDF could not be loaded", {
        status: 502,
      });
    }

    const contentType = pdfResponse.headers.get("content-type");

    if (
      contentType &&
      !contentType.toLowerCase().includes("application/pdf") &&
      !contentType.toLowerCase().includes("application/octet-stream")
    ) {
      return new NextResponse("Stored file is not a PDF", {
        status: 415,
      });
    }

    return new NextResponse(await pdfResponse.arrayBuffer(), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename.replace(/["\\]/g, "_")}"`,
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Legacy PDF route error:", error);

    return new NextResponse("PDF service error", {
      status: 500,
    });
  }
}
