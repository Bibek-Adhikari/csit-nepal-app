import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServer({ requireServiceRole: true });

    const url = new URL(request.url);
    const bucketFromQuery = (url.searchParams.get("bucket") || "").trim();
    const folderFromQuery = (url.searchParams.get("folder") || "").trim();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    const bucketFromForm = ((formData.get("bucket") as string) || "").trim();
    const folderFromForm = ((formData.get("folder") as string) || "").trim();

    const bucket = (bucketFromQuery || bucketFromForm || "notes").trim();
    const folder = (folderFromQuery || folderFromForm || "").trim();

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${fileExt ? "." + fileExt : ""}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return NextResponse.json({
      path: data.path,
      url: urlData.publicUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

