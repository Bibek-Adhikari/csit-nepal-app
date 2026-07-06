-- Create entrance questions table for question bank
CREATE TABLE IF NOT EXISTS entrance_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL CHECK (topic IN ('mathematics', 'english', 'computer-gk')),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for filtering by topic
CREATE INDEX IF NOT EXISTS idx_entrance_questions_topic ON entrance_questions(topic);

-- Enable Row Level Security
ALTER TABLE entrance_questions ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "public_read_entrance_questions" ON entrance_questions
  FOR SELECT TO public USING (true);

-- Allow service role full access
CREATE POLICY "service_full_access_entrance_questions" ON entrance_questions
  FOR ALL TO service_role USING (true) WITH CHECK (true);
