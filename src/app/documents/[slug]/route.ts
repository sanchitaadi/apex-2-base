import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const cleanSlug = slug
      .replace(/\.pdf$/i, "")
      .toLowerCase();

    // Get mandatory disclosure documents
    const { data, error } = await supabase
      .from("mandatory_public_disclosures")
      .select("id, description, document_url, is_active")
      .eq("is_active", true);

    if (error) {
      console.error("Document database error:", error);

      return new Response("Document lookup failed", {
        status: 500,
      });
    }

    const document = (data || []).find((item) => {
      const generatedSlug = slugify(item.description || "");
      return generatedSlug === cleanSlug;
    });

    if (!document?.document_url) {
      return new Response("Document not found", {
        status: 404,
      });
    }

    // Fetch the actual PDF from Supabase Storage
    const pdfResponse = await fetch(document.document_url, {
      cache: "no-store",
    });

    if (!pdfResponse.ok) {
      console.error(
        "Supabase PDF fetch failed:",
        pdfResponse.status,
        document.document_url
      );

      return new Response("Unable to load document", {
        status: 502,
      });
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Document route error:", error);

    return new Response("Internal server error", {
      status: 500,
    });
  }
}