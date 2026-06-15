import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

export async function POST() {
  try {
    const supabase = getSupabaseServer();
    const buckets: { name: string; id?: string }[] = [];
    const { data, error } = await supabase.storage.listBuckets();
    if (error) throw error;
    buckets.push(...(data.map((b: any) => ({ name: b.name, id: b.id }))));

    const required = ["notes", "lectures"];
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
