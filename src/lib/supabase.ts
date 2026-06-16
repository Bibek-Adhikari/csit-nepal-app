import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

type ServerSupabaseOptions = {
  requireServiceRole?: boolean;
};

export function getSupabaseServer({ requireServiceRole = false }: ServerSupabaseOptions = {}): SupabaseClient {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (requireServiceRole && !serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for server-side storage mutations");
  }

  if (serviceRoleKey === supabaseAnonKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY must be the service_role key, not the anon/publishable key");
  }

  if (serviceRoleKey) {
    return createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}


