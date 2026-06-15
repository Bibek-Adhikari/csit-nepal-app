import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

export async function DELETE(request: Request) {
  try {
    const supabase = getSupabaseServer();
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
