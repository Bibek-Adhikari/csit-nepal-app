import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

const ADMIN_KEY = process.env.ADMIN_KEY || "";

export async function POST(request: Request) {
  try {
    const adminKey = request.headers.get("x-admin-key") || "";
    if (!adminKey || adminKey !== ADMIN_KEY) {
      return NextResponse.json({ error: "Invalid or missing admin key" }, { status: 401 });
    }

    const body = await request.json();
    const bucket = ((body.bucket as string) || "notes").trim();
    const folder = ((body.folder as string) || "").trim();
    const title = ((body.title as string) || "").trim();
    const format = ((body.format as string) || "pdf").trim();
    let fileName = ((body.fileName as string) || "").trim();

    if (!folder) {
      return NextResponse.json({ error: "folder is required" }, { status: 400 });
    }

    if (!fileName) {
      return NextResponse.json({ error: "fileName is required" }, { status: 400 });
    }

    const filePath = `${folder}/${fileName}`;

    const supabase = getSupabaseServer({ requireServiceRole: true });

    const { data: signedData, error: signedError } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(filePath);

    if (signedError || !signedData) {
      console.error("Signed URL error:", signedError);
      return NextResponse.json({ error: signedError?.message || "Failed to create signed upload URL" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;

    const { error: dbError } = await supabase.from("notes").insert({
      title: title || fileName.replace(/\.[^/.]+$/, ""),
      file_name: fileName,
      file_path: filePath,
      file_size: (body.fileSize as number) || 0,
      mime_type: (body.fileType as string) || "application/pdf",
      format: format as "pdf" | "handwritten",
      bucket,
      semester_key: folder.split("/")[0] || "",
      subject_slug: folder.split("/")[1] || "",
      unit_slug: folder.split("/")[2] || "",
      public_url: publicUrl,
    });

    if (dbError) {
      console.error("Failed to insert note record:", dbError);
      if (dbError.message?.includes("does not exist")) {
        return NextResponse.json({
          error: "The 'notes' database table does not exist. Run POST /api/db/init or execute the setup SQL in Supabase dashboard.",
          code: "TABLE_NOT_FOUND",
        }, { status: 500 });
      }
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      signedUrl: signedData.signedUrl,
      path: filePath,
      publicUrl,
      token: signedData.token,
      fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
