import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

export async function POST() {
  try {
    const supabase = getSupabaseServer({ requireServiceRole: true });

    const { error } = await supabase.from("notes").select("id").limit(1);

    if (error && error.message?.includes("does not exist")) {
      return NextResponse.json({
        created: false,
        message: "Notes table does not exist yet.",
        instructions: "Go to https://supabase.com/dashboard/project/yrahncykruiwkiwtxjlv/sql/new and run the SQL from supabase/migrations/00001_create_notes_table.sql",
      });
    }

    return NextResponse.json({
      created: true,
      message: "Notes table exists and is ready.",
    });
  } catch (error) {
    return NextResponse.json({
      created: false,
      error: "Connection failed. Make sure SUPABASE_SERVICE_ROLE_KEY is correct.",
      instructions: "1. Verify your service_role key in .env.local\n2. Go to https://supabase.com/dashboard/project/yrahncykruiwkiwtxjlv/sql/new\n3. Run the SQL from supabase/migrations/00001_create_notes_table.sql",
    }, { status: 500 });
  }
}
