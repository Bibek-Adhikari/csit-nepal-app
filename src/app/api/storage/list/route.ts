import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

type StorageFile = {
  name: string;
  path: string;
  url: string;
  size: number;
  createdAt: string;
  formattedSize?: string;
};

function formatSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseServer();
    const { searchParams } = new URL(request.url);
    const bucket = searchParams.get("bucket") || "notes";
    const folder = searchParams.get("folder") || "";

    let query = supabase.storage.from(bucket).list(folder || undefined, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const files: StorageFile[] = (data || []).map((item) => {
      const fullPath = folder ? `${folder}/${item.name}` : item.name;
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fullPath);
      return {
        name: item.name,
        path: fullPath,
        url: urlData.publicUrl,
        size: item.metadata?.size ?? 0,
        createdAt: item.created_at,
        formattedSize: formatSize(item.metadata?.size ?? 0),
      };
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error("List error:", error);
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
  }
}
