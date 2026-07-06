import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { validateAdminRequest } from "@/lib/admin-auth";

export async function GET() {
  try {
    const supabase = getSupabaseServer();

    const { data: dbPdfs, error: dbError } = await supabase
      .from("entrance_pdfs")
      .select("*")
      .order("created_at", { ascending: false });

    const dbFileNames = new Set((dbPdfs ?? []).map((p) => p.file_name));

    const { data: storageFiles, error: storageError } = await supabase.storage
      .from("entrance")
      .list("", { limit: 100, sortBy: { column: "name", order: "desc" } });

    const storagePdfs = (storageError || !storageFiles ? [] : storageFiles)
      .filter((f) => !dbFileNames.has(f.name) && f.name.endsWith(".pdf"))
      .map((f) => ({
        id: f.name,
        title: f.name.replace(/\.pdf$/i, "").replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
        file_name: f.name,
        file_path: f.name,
        file_size: f.metadata?.size ?? null,
        mime_type: "application/pdf",
        public_url: supabase.storage.from("entrance").getPublicUrl(f.name).data.publicUrl,
        year: null,
        created_at: f.created_at ?? new Date().toISOString(),
      }));

    const pdfs = [...(dbPdfs ?? []), ...storagePdfs];

    return NextResponse.json({ pdfs });
  } catch {
    return NextResponse.json({ error: "Failed to fetch PDFs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!validateAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const title = ((body.title as string) || "").trim();
    const fileName = ((body.fileName as string) || "").trim();
    const fileSize = (body.fileSize as number) || 0;
    const year = ((body.year as string) || "").trim() || null;

    if (!title || !fileName) {
      return NextResponse.json({ error: "title and fileName are required" }, { status: 400 });
    }

    const filePath = `${fileName}`;
    const supabase = getSupabaseServer({ requireServiceRole: true });

    const { data: signedData, error: signedError } = await supabase.storage
      .from("entrance")
      .createSignedUploadUrl(filePath);

    if (signedError || !signedData) {
      return NextResponse.json({ error: signedError?.message || "Failed to create signed upload URL" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("entrance").getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;

    const { error: dbError } = await supabase.from("entrance_pdfs").insert({
      title,
      file_name: fileName,
      file_path: filePath,
      file_size: fileSize,
      mime_type: "application/pdf",
      public_url: publicUrl,
      year,
    });

    if (dbError) {
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
    console.error("Entrance upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
