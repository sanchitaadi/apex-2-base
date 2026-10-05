import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("cms_pages")
      .select("id, title, slug, status, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("CMS pages error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      pages: data || [],
    });
  } catch (error) {
    console.error("CMS pages API error:", error);

    return NextResponse.json(
      { error: "Unable to load pages." },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const slug =
      typeof body.slug === "string"
        ? body.slug.trim()
        : "";

    const status =
      body.status === "published"
        ? "published"
        : "draft";

    const seoTitle =
      typeof body.seo_title === "string"
        ? body.seo_title.trim()
        : null;

    const seoDescription =
      typeof body.seo_description === "string"
        ? body.seo_description.trim()
        : null;

    if (!title) {
      return NextResponse.json(
        {
          error: "Page title is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!slug) {
      return NextResponse.json(
        {
          error: "Page slug is required.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("cms_pages")
      .insert({
        title,
        slug,
        status,
        seo_title: seoTitle,
        seo_description: seoDescription,
        layout_json: {
          sections: [],
        },
      })
      .select()
      .single();

    if (error) {
      console.error("Create CMS page error:", error);

      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: "A page with this URL slug already exists.",
          },
          {
            status: 409,
          }
        );
      }

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        page: data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create CMS page API error:", error);

    return NextResponse.json(
      {
        error: "Unable to create page.",
      },
      {
        status: 500,
      }
    );
  }
}