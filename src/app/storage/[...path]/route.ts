import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    if (!path || path.length === 0) {
      return new NextResponse("Invalid path", { status: 400 });
    }

    const storagePath = path.map(encodeURIComponent).join("/");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");

    if (!supabaseUrl) {
      return new NextResponse("Storage origin not configured", { status: 500 });
    }

    const targetUrl = `${supabaseUrl}/storage/v1/object/public/${storagePath}`;

    const upstream = await fetch(targetUrl, {
      next: { revalidate: 31536000 },
    });

    if (!upstream.ok) {
      return new NextResponse("Asset not found", { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "CDN-Cache-Control": "public, max-age=31536000",
        "Vercel-CDN-Cache-Control": "public, max-age=31536000",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return new NextResponse(`Storage proxy error: ${message}`, { status: 500 });
  }
}
