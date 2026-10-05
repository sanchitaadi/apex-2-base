import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase blogs error:", error);

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