import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      {
        connected: false,
        error: "Supabase environment variables are missing.",
      },
      { status: 500 }
    );
  }

  const { error } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1);

  if (error && error.code !== "42P01") {
    return NextResponse.json(
      {
        connected: false,
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    connected: true,
    message:
      error?.code === "42P01"
        ? "Supabase connected. Database table will be created next."
        : "Supabase connected successfully.",
  });
}