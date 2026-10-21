import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing image URL", { status: 400 });
  }

  try {
    const imageUrl = new URL(url);

    if (imageUrl.protocol !== "https:") {
      return new NextResponse("Only HTTPS images are allowed", {
        status: 400,
      });
    }

    const response = await fetch(imageUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154 Safari/537.36",
        Referer: "https://apexpublicschool.in/",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      next: { revalidate: 31536000 },
    });

    if (!response.ok) {
      return new NextResponse("Unable to load image", {
        status: response.status,
      });
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "image/jpeg",
        "Cache-Control":
          "public, max-age=31536000, immutable",
        "CDN-Cache-Control":
          "public, max-age=31536000",
        "Vercel-CDN-Cache-Control":
          "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);

    return new NextResponse("Image proxy failed", {
      status: 500,
    });
  }
}
