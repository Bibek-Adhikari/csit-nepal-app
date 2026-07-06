import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { validateAdminRequest } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);

  try {
    const supabase = getSupabaseServer();
    let query = supabase
      .from("entrance_questions")
      .select("*")
      .limit(limit);

    if (topic) {
      query = query.eq("topic", topic);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ questions: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!validateAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { topic, question, options, correct_answer, explanation } = body;

    if (!topic || !question || !options || !correct_answer) {
      return NextResponse.json({ error: "topic, question, options, and correct_answer are required" }, { status: 400 });
    }

    if (!["mathematics", "english", "computer-gk"].includes(topic)) {
      return NextResponse.json({ error: "topic must be mathematics, english, or computer-gk" }, { status: 400 });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ error: "options must be an array with at least 2 items" }, { status: 400 });
    }

    const supabase = getSupabaseServer({ requireServiceRole: true });

    const { data, error } = await supabase
      .from("entrance_questions")
      .insert({
        topic,
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
