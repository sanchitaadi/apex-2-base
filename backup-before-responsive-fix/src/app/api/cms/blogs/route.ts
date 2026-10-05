import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: NextRequest) {
  try {
    if (!url || !key) {
      return NextResponse.json(
        {
          blogs: [],
          error: "Supabase environment variables are missing",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(url, key);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = supabase
      .from("blog_posts")
      .select("*")
      .order("publish_date", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase blog_posts error:", error);

      return NextResponse.json(
        {
          blogs: [],
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      blogs: data ?? [],
    });
  } catch (error) {
    console.error("Blogs API error:", error);

    return NextResponse.json(
      {
        blogs: [],
        error:
          error instanceof Error
            ? error.message
            : "Failed to load blogs",
      },
      { status: 500 }
    );
  }
}