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

    // Try full query ordered by publish_date
    let query = supabase
      .from("blog_posts")
      .select("*")
      .order("publish_date", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    let { data, error } = await query;

    // Graceful fallback if publish_date column doesn't exist yet
    if (error && error.message?.includes("does not exist")) {
      console.warn("Fallback query for blog_posts:", error.message);
      const fallback = await supabase.from("blog_posts").select("*");
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.warn("Supabase blog_posts error:", error.message);

      return NextResponse.json({
        blogs: [],
      });
    }

    return NextResponse.json({
      blogs: data ?? [],
    });
  } catch (error) {
    console.error("Blogs API error:", error);

    return NextResponse.json({
      blogs: [],
    });
  }
}
