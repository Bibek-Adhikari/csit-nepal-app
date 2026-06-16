import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseServer();
    const { searchParams } = new URL(request.url);
    const semester = searchParams.get("semester");
    const subject = searchParams.get("subject");
    const unit = searchParams.get("unit");
    const format = searchParams.get("format");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (semester) query = query.eq("semester_key", semester);
    if (subject) query = query.eq("subject_slug", subject);
    if (unit) query = query.eq("unit_slug", unit);
    if (format) query = query.eq("format", format);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notes: data, count });
  } catch (error) {
    console.error("List notes error:", error);
    return NextResponse.json({ error: "Failed to list notes" }, { status: 500 });
  }
}
