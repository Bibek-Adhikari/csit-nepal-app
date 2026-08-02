import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { validateAdminRequest } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const semester = searchParams.get("semester");
  const subject = searchParams.get("subject");
  const unit = searchParams.get("unit");
  const count = Math.min(Math.max(Number(searchParams.get("count")) || 200, 1), 200);

  if (!semester || !subject) {
    return NextResponse.json({ questions: [] });
  }

  try {
    const supabase = getSupabaseServer();
    let query = supabase
      .from("subject_questions")
      .select("*")
      .eq("semester_key", semester)
      .eq("subject_slug", subject);

    if (unit) {
      query = query.eq("unit_slug", unit);
    }

    const { data, error } = await query
      .order("created_at", { ascending: true })
      .limit(200);

    if (error) {
      console.error("subject_questions query error:", error.message);
      return NextResponse.json({ questions: [] });
    }

    const questions = (data ?? []).slice(0, count);
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("subject_questions GET error:", error);
    return NextResponse.json({ questions: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!validateAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { semester_key, subject_slug, unit_slug, question, options, correct_answer, explanation } = body;

    if (!semester_key || !subject_slug || !unit_slug || !question || !options || !correct_answer) {
      return NextResponse.json({
        error: "semester_key, subject_slug, unit_slug, question, options, and correct_answer are required",
      }, { status: 400 });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ error: "options must be an array with at least 2 items" }, { status: 400 });
    }

    const supabase = getSupabaseServer({ requireServiceRole: true });

    const { data, error } = await supabase
      .from("subject_questions")
      .insert({
        semester_key,
        subject_slug,
        unit_slug,
        question,
        options,
        correct_answer,
        explanation: explanation || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ question: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add question" }, { status: 500 });
  }
}
