import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { validateAdminRequest } from "@/lib/admin-auth";

export async function DELETE(request: Request) {
  try {
    if (!validateAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseServer({ requireServiceRole: true });
    const body = (await request.json()) as { path: string; bucket?: string };

    const path = body.path?.trim();
    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    const bucket = (body.bucket || "notes").trim();

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
