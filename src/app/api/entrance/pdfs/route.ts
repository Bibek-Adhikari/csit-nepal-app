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

    if (dbError) {
      console.error("entrance_pdfs DB query error:", dbError);
    }

    const dbFileNames = new Set((dbPdfs ?? []).map((p) => p.file_name));

    const supabaseAdmin = getSupabaseServer({ requireServiceRole: true });

    const bucketUrl = `${supabaseAdmin.storage.from("entrance").getPublicUrl("").data.publicUrl}`.replace(/\/+$/, "");
    const inlineSuffix = "?content-disposition=inline";

    async function listPrefix(prefix: string) {
      const { data: files, error } = await supabaseAdmin.storage
        .from("entrance")
        .list(prefix, { limit: 100, sortBy: { column: "name", order: "desc" } });
      if (error || !files) {
        console.error(`entrance storage list error (prefix="${prefix}"):`, error);
        return [];
      }
      return files
        .filter((f) => f.metadata?.size && f.name.endsWith(".pdf"))
        .map((f) => {
          const fullPath = prefix ? `${prefix}/${f.name}` : f.name;
          return {
            id: fullPath,
            title: f.name.replace(/\.pdf$/i, "").replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
            file_name: fullPath,
            file_path: fullPath,
            file_size: f.metadata!.size,
            mime_type: "application/pdf",
            public_url: `${bucketUrl}/${fullPath.split("/").map(encodeURIComponent).join("/")}${inlineSuffix}`,
            year: null,
            created_at: f.created_at ?? new Date().toISOString(),
          };
        })
        .filter((p) => !dbFileNames.has(p.file_name));
    }

    const [rootFiles, folderFiles] = await Promise.all([
      listPrefix(""),
      listPrefix("entrance_pdfs"),
    ]);

    const storagePdfs = [...rootFiles, ...folderFiles];

    const pdfs = [...(dbPdfs ?? []), ...storagePdfs].map((p) => ({
      ...p,
      public_url: p.public_url.includes("?") ? p.public_url : `${p.public_url}${inlineSuffix}`,
    }));

    return NextResponse.json({ pdfs });
  } catch (error) {
    console.error("entrance PDFs GET error:", error);
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
