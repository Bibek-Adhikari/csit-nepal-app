import { getSupabaseServer } from './supabase';

export async function ensureStorageBuckets() {
  try {
    const supabase = getSupabaseServer();

    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      console.error('Failed to list buckets:', listError);
      return;
    }

    const existingBucketNames = buckets.map((b: { name: string }) => b.name);
    const requiredBuckets = ['notes', 'lectures', 'entrance'];

    for (const bucketName of requiredBuckets) {
      if (!existingBucketNames.includes(bucketName)) {
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: false,
          fileSizeLimit: 52428800,
          allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
        });

        if (createError) {
          console.error(`Failed to create bucket ${bucketName}:`, createError);
        } else {
          console.log(`Created private bucket: ${bucketName}`);
        }
      } else {
        // Ensure existing buckets stay private; objects are only served via
        // temporary signed URLs (see src/lib/pdf-access.ts).
        const { error: updateError } = await supabase.storage.updateBucket(bucketName, { public: false });
        if (updateError) {
          console.error(`Failed to make bucket private: ${bucketName}`, updateError);
        } else {
          console.log(`Bucket is private: ${bucketName}`);
        }
      }
    }
  } catch (error) {
    console.error('Storage initialization error:', error);
  }
}
