import { getSupabaseServer } from './supabase';

export async function ensureStorageBuckets() {
  try {
    const supabase = getSupabaseServer();

    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      console.error('Failed to list buckets:', listError);
      return;
    }

    const existingBucketNames = buckets.map((b: any) => b.name);
    const requiredBuckets = ['notes', 'lectures'];

    for (const bucketName of requiredBuckets) {
      if (!existingBucketNames.includes(bucketName)) {
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 52428800,
          allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
        });

        if (createError) {
          console.error(`Failed to create bucket ${bucketName}:`, createError);
        } else {
          console.log(`Created bucket: ${bucketName}`);
        }
      } else {
        console.log(`Bucket already exists: ${bucketName}`);
      }
    }
  } catch (error) {
    console.error('Storage initialization error:', error);
  }
}
