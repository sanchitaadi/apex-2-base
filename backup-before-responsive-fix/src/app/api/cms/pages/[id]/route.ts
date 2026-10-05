import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Page ID is required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("cms_pages")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Get CMS page error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Page not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      page: data,
    });
  } catch (error) {
    console.error("GET CMS page error:", error);

    return NextResponse.json(
      { error: "Unable to load page." },
      { status: 500 }
    );
  }
}


export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Page ID is required." },
        { status: 400 }
      );
    }

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

    const layoutJson =
      body.layout_json &&
      typeof body.layout_json === "object"
        ? body.layout_json
        : {
            sections: [],
          };

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

    /*
     * Check whether another page already
     * uses this slug.
     */

    const { data: existingPage, error: slugError } =
      await supabase
        .from("cms_pages")
        .select("id")
        .eq("slug", slug)
        .neq("id", id)
        .maybeSingle();

    if (slugError) {
      console.error(
        "CMS slug validation error:",
        slugError
      );

      return NextResponse.json(
        {
          error:
            "Unable to validate page slug.",
        },
        {
          status: 500,
        }
      );
    }

    if (existingPage) {
      return NextResponse.json(
        {
          error:
            "Another page already uses this URL slug.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Update CMS page
     */

    const { data, error } = await supabase
      .from("cms_pages")
      .update({
        title,
        slug,
        status,
        seo_title: seoTitle,
        seo_description: seoDescription,
        layout_json: layoutJson,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error(
        "Update CMS page error:",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Page updated successfully.",
      page: data,
    });
  } catch (error) {
    console.error(
      "PUT CMS page error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to update page.",
      },
      {
        status: 500,
      }
    );
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Page ID is required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("cms_pages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Delete CMS page error:",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Page deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE CMS page error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to delete page.",
      },
      {
        status: 500,
      }
    );
  }
}
