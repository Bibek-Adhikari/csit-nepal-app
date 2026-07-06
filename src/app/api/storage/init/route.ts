import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

type BucketSummary = {
  name: string;
  id?: string;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Storage initialization failed";
}

export async function POST() {
  try {
    const supabase = getSupabaseServer({ requireServiceRole: true });
    const buckets: BucketSummary[] = [];
    const { data, error } = await supabase.storage.listBuckets();
    if (error) throw error;
    buckets.push(...(data.map((b) => ({ name: b.name, id: b.id }))));

    const required = ["notes", "lectures", "entrance"];
    const created: string[] = [];

    for (const name of required) {
      const exists = buckets.some((b) => b.name === name);
      if (!exists) {
        const { error: createError } = await supabase.storage.createBucket(name, {
          public: true,
          fileSizeLimit: 52428800,
          allowedMimeTypes: [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
          ],
        });
        if (createError) throw createError;
        created.push(name);
      }
    }

    return NextResponse.json({ created, buckets: buckets.map((b) => b.name) });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
