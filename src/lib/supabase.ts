import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const getUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const getAnonKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(getUrl(), getAnonKey());
  }
  return _client;
}

type ServerSupabaseOptions = {
  requireServiceRole?: boolean;
};

export function getSupabaseServer({ requireServiceRole = false }: ServerSupabaseOptions = {}): SupabaseClient {
  const url = getUrl();
  const anonKey = getAnonKey();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set");
  }

  if (requireServiceRole) {
    if (!serviceRoleKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for server-side storage mutations");
    }
    if (serviceRoleKey === anonKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY must be the service_role key, not the anon key");
    }
    return createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  return createClient(url, anonKey);
}
