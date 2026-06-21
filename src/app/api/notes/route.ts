import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function batchFileExists(urls: string[]): Promise<boolean[]> {
  const results: boolean[] = new Array(urls.length).fill(false);
  const concurrency = 10;
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const checks = await Promise.all(
      batch.map(async (url) => {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 3000);
          const res = await fetch(url, { method: "HEAD", signal: controller.signal });
          clearTimeout(timer);
          return res.ok;
        } catch {
          return false;
        }
      })
    );
    for (let j = 0; j < checks.length; j++) {
      results[i + j] = checks[j];
    }
  }
  return results;
}

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseServer();
    const { searchParams } = new URL(request.url);
    const semester = searchParams.get("semester");
    const subject = searchParams.get("subject");
    const unit = searchParams.get("unit");
    const format = searchParams.get("format");
    const limit = parseInt(searchParams.get("limit") || "200");
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

    const notes = data || [];
    const urls = notes.map((n) => n.public_url);
    const exists = await batchFileExists(urls);
    const valid = notes.filter((_, i) => exists[i]);

    return NextResponse.json({ notes: valid, count: valid.length });
  } catch (error) {
    console.error("List notes error:", error);
    return NextResponse.json({ error: "Failed to list notes" }, { status: 500 });
  }
}
