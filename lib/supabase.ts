import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client for the registration API route.
 *
 * Accepts either naming convention:
 *   NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY   (this project's default)
 *   SUPABASE_URL             / SUPABASE_SECRET_KEY         (main Verikon site's names)
 */

let cachedClient: SupabaseClient | null = null;

const getUrl = () => {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  return raw ? raw.trim() : null;
};

const getSecretKey = () => {
  const raw = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  return raw ? raw.trim() : null;
};

export function getServiceClient(): SupabaseClient | null {
  const u = getUrl();
  const k = getSecretKey();

  if (!u || !k) return null;

  if (!cachedClient) {
    cachedClient = createClient(u, k, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return cachedClient;
}

export const isSupabaseConfigured = () => Boolean(getUrl() && getSecretKey());

export async function pingSupabase(): Promise<{ connected: boolean; latencyMs: number; error?: string }> {
  const client = getServiceClient();
  if (!client) {
    return { connected: false, latencyMs: 0, error: "Credentials not configured" };
  }

  const start = Date.now();
  try {
    const { error } = await client.from("registrations").select("id").limit(1);
    const latencyMs = Date.now() - start;
    if (error) {
      return { connected: false, latencyMs, error: error.message };
    }
    return { connected: true, latencyMs };
  } catch (err) {
    const latencyMs = Date.now() - start;
    return {
      connected: false,
      latencyMs,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
