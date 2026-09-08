import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("website_theme")
      .select("*")
      .order("updated_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Theme API error:",
        error
      );

      return NextResponse.json(
        {
          theme: null,
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      theme: data,
    });
  } catch (error) {
    console.error(
      "Theme API unexpected error:",
      error
    );

    return NextResponse.json(
      {
        theme: null,
        error: "Unable to load theme",
      },
      {
        status: 500,
      }
    );
  }
}