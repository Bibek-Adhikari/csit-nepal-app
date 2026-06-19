import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

const ADMIN_KEY = process.env.ADMIN_KEY || "";

async function listAllFiles(supabase: ReturnType<typeof getSupabaseServer>, bucket: string, prefix = ""): Promise<string[]> {
  const { data, error } = await supabase.storage.from(bucket).list(prefix || undefined, { limit: 100 });
  if (error || !data) return [];

  const files: string[] = [];
  for (const item of data) {
    const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.id) {
      files.push(fullPath);
    } else {
      const nested = await listAllFiles(supabase, bucket, fullPath);
      files.push(...nested);
    }
  }
  return files;
}

export async function POST(request: Request) {
  try {
    const adminKey = request.headers.get("x-admin-key") || "";
    if (!adminKey || adminKey !== ADMIN_KEY) {
      return NextResponse.json({ error: "Invalid or missing admin key" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const bucket = ((body.bucket as string) || "lectures").trim();

    const supabase = getSupabaseServer({ requireServiceRole: true });

    const allFiles = await listAllFiles(supabase, bucket);
    const pdfFiles = allFiles.filter((f) => f.endsWith(".pdf"));

    const { data: existing, error: dbError } = await supabase
      .from("notes")
      .select("file_path")
      .eq("bucket", bucket);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    const existingPaths = new Set((existing || []).map((r: { file_path: string }) => r.file_path));

    const toInsert = pdfFiles.filter((f) => !existingPaths.has(f));

    let inserted = 0;
    const errors: string[] = [];

    for (const filePath of toInsert) {
      const parts = filePath.split("/");
      const fileName = parts.pop() || "";
      const folder = parts.join("/");

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("notes").insert({
        title: fileName.replace(/\.pdf$/i, "").replace(/^\d+-/, ""),
        file_name: fileName,
        file_path: filePath,
        file_size: 0,
        mime_type: "application/pdf",
        format: "pdf",
        bucket,
        semester_key: parts[0] || "",
        subject_slug: parts[1] || "",
        unit_slug: parts[2] || "",
        public_url: urlData.publicUrl,
      });

      if (insertError) {
        errors.push(`${filePath}: ${insertError.message}`);
      } else {
        inserted++;
      }
    }

    return NextResponse.json({
      synced: inserted,
      total_orphans: toInsert.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Failed to sync files" }, { status: 500 });
  }
}
