import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

const CREATE_TABLE_SQL = `-- Create notes table for storing uploaded file metadata
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT DEFAULT 'application/pdf',
  format TEXT NOT NULL CHECK (format IN ('pdf', 'handwritten', 'solution', 'course')),
  bucket TEXT NOT NULL DEFAULT 'notes',
  semester_key TEXT NOT NULL,
  subject_slug TEXT NOT NULL,
  unit_slug TEXT NOT NULL,
  public_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notes_folder ON notes(semester_key, subject_slug, unit_slug);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_notes" ON notes
  FOR SELECT TO public USING (true);

CREATE POLICY "service_full_access_notes" ON notes
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Subject unit quiz questions (independent from entrance_questions)
CREATE TABLE IF NOT EXISTS subject_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  semester_key TEXT NOT NULL,
  subject_slug TEXT NOT NULL,
  unit_slug TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subject_questions_unit
  ON subject_questions(semester_key, subject_slug, unit_slug);
ALTER TABLE subject_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_subject_questions" ON subject_questions
  FOR SELECT TO public USING (true);

CREATE POLICY "service_full_access_subject_questions" ON subject_questions
  FOR ALL TO service_role USING (true) WITH CHECK (true);`;

export async function POST() {
  try {
    const supabase = getSupabaseServer({ requireServiceRole: true });

    const { error } = await supabase.from("notes").select("id").limit(1);

    if (error && error.message?.includes("does not exist")) {
      const projectRef =
        process.env.NEXT_PUBLIC_SUPABASE_URL
          ?.replace("https://", "")
          .replace(".supabase.co", "") || "";

      return NextResponse.json({
        created: false,
        message: "Notes table does not exist.",
        sql: CREATE_TABLE_SQL,
        sqlEditorUrl: `https://supabase.com/dashboard/project/${projectRef}/sql/new`,
      });
    }

    if (error) {
      return NextResponse.json({ created: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ created: true, message: "Notes table exists and is ready." });
  } catch (error) {
    return NextResponse.json({
      created: false,
      error: error instanceof Error ? error.message : "Connection failed",
    }, { status: 500 });
  }
}
