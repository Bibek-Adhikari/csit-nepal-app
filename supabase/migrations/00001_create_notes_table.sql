-- Create notes table for storing uploaded file metadata
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT DEFAULT 'application/pdf',
  format TEXT NOT NULL CHECK (format IN ('pdf', 'handwritten')),
  bucket TEXT NOT NULL DEFAULT 'notes',
  semester_key TEXT NOT NULL,
  subject_slug TEXT NOT NULL,
  unit_slug TEXT NOT NULL,
  public_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by folder path
CREATE INDEX IF NOT EXISTS idx_notes_folder ON notes(semester_key, subject_slug, unit_slug);

-- Index for ordering by creation date
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to notes metadata
CREATE POLICY "public_read_notes" ON notes
  FOR SELECT TO public USING (true);

-- Allow service role full access (insert/update/delete handled server-side via API routes)
CREATE POLICY "service_full_access_notes" ON notes
  FOR ALL TO service_role USING (true) WITH CHECK (true);
