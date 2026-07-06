-- Create entrance_pdfs table for storing entrance PDF metadata
CREATE TABLE IF NOT EXISTS entrance_pdfs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT DEFAULT 'application/pdf',
  public_url TEXT NOT NULL,
  year TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for ordering by creation date
CREATE INDEX IF NOT EXISTS idx_entrance_pdfs_created_at ON entrance_pdfs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE entrance_pdfs ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "public_read_entrance_pdfs" ON entrance_pdfs
  FOR SELECT TO public USING (true);

-- Allow service role full access
CREATE POLICY "service_full_access_entrance_pdfs" ON entrance_pdfs
  FOR ALL TO service_role USING (true) WITH CHECK (true);
