-- Make the PDF storage buckets private.
-- Objects in private buckets can no longer be read via static public URLs and
-- are only reachable through temporary signed URLs (createSignedUrl).
UPDATE storage.buckets
SET public = false
WHERE id IN ('notes', 'lectures', 'entrance');

-- Storage objects are protected by RLS on storage.objects.
-- Signed URL generation and storage.list run server-side with the anon key,
-- so allow SELECT for the anon role. The app currently has no user accounts;
-- once Supabase Auth is enabled and sessions are enforced, restrict read access
-- to authenticated users by dropping the anon policy below.
CREATE POLICY "anon_can_read_pdf_objects" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id IN ('notes', 'lectures', 'entrance'));

-- Allow authenticated users to read private objects (used with Supabase Auth).
CREATE POLICY "authenticated_can_read_pdf_objects" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id IN ('notes', 'lectures', 'entrance'));

-- No INSERT/UPDATE/DELETE policies are created, so only the service_role key
-- (which bypasses RLS) can upload, move or remove objects. Client uploads
-- continue to work through /api/storage/upload (service-role + signed upload URL).

-- To make buckets private immediately from SQL, this already does it.
-- If you prefer not to run a migration, flip them in the Supabase dashboard:
-- Storage -> Buckets -> (notes/lectures/entrance) -> Edit -> "Public bucket" OFF.